#!/usr/bin/env node
// Audit-only fact-check. Queues flagged entries for Cursor writing.
// Does NOT rewrite content — DeepSeek is forbidden for rewrites (owner).
// Audit model: Cerebras (default). Images = Pexels after Cursor rewrite.

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

function loadEnv(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
loadEnv('/tmp/pulse-runtime.env');
loadEnv(path.join(process.cwd(), '.env.local'));

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const STATE_KEY = '_factcheck_audit_state.json';
const QUEUE_KEY = '_cursor_write_queue.json';
const IMAGE_STATE_KEY = '_mangled_image_purge_state.json';
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');
const CYCLE_IDS_JSON = process.env.CYCLE_IDS_JSON || '';
const RESET = String(process.env.RESET_AUDIT || '') === '1';

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

async function emailOne(subject, html) {
  try {
    const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
    console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', subject: subject.slice(0, 80) }));
  } catch (e) {}
}

function parseJsonObject(text) {
  const raw = String(text || '').trim();
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no-json');
  try {
    return JSON.parse(m[0]);
  } catch (e) {
    let s = m[0].replace(/,\s*$/, '');
    const q = (s.match(/"/g) || []).length;
    if (q % 2 === 1) s += '"';
    const opens = (s.match(/\[/g) || []).length - (s.match(/\]/g) || []).length;
    const braces = (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;
    s += ']'.repeat(Math.max(0, opens));
    s += '}'.repeat(Math.max(0, braces));
    s = s.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(s);
  }
}

async function auditJson(system, user) {
  // OWNER: do NOT use DeepSeek to audit DeepSeek-written pages (won't catch its own errors).
  // Audit with Cerebras. Content REWRITE = Cursor only.
  // Ultra plan: no artificial RPM brakes — only brief retry on real 429.
  const key = process.env.CEREBRAS_API_KEY || process.env.cerebras;
  if (!key) throw new Error('CEREBRAS_API_KEY missing for independent audit');
  const model = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
  let lastErr = '';
  for (let attempt = 1; attempt <= 5; attempt++) {
    const r = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 1200,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: AbortSignal.timeout(120000),
    });
    const t = await r.text();
    if (r.status === 429) {
      lastErr = '429';
      // ultra plan: minimal backoff only when provider actually rate-limits
      await new Promise((res) => setTimeout(res, 8000)); // provider 429 only
      continue;
    }
    if (!r.ok) throw new Error(r.status + ':' + t.slice(0, 160));
    const j = JSON.parse(t);
    const text = (((j.choices || [])[0] || {}).message || {}).content || '';
    try {
      return parseJsonObject(text);
    } catch (e) {
      lastErr = String(e.message || e);
      continue;
    }
  }
  throw new Error(lastErr || 'audit-failed');
}

const AUDIT_SYS = `Strict fact-checker. Return ONLY compact JSON:
{"verdict":"pass"|"flag","issues":["Section 2: …"],"hallucinations":["Section 3: …"],"content_gaps":["FAQ: …"],"sections":["Section 2","Section 3"]}
HARD LIMITS: max 5 issues, max 5 hallucinations, max 5 content_gaps; each string ≤140 chars.
Each string MUST start with a section label (Direct Answer / Section N / FAQ / Bottom Line / How We Ranked).
FLAG invented facts/vendors/stats/years, contradictions, wrong Direct Answer, missing required sections.`;

function clip(answer) {
  const s = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  if (s.length <= 12000) return s;
  return s.slice(0, 7000) + '\n\n…\n\n' + s.slice(-4000);
}

async function main() {
  const s = store();
  fs.mkdirSync(path.dirname(LOCAL_QUEUE), { recursive: true });

  if (RESET) {
    await s.setJSON(STATE_KEY, {
      doneIds: [],
      flagged: 0,
      passed: 0,
      errors: 0,
      resetAt: new Date().toISOString(),
      note: 'full restart — audit for Cursor writing only',
    });
    await s.setJSON(QUEUE_KEY, {
      items: [],
      updated_at: new Date().toISOString(),
      resetAt: new Date().toISOString(),
      writer: 'cursor-only',
    });
    fs.writeFileSync(LOCAL_QUEUE, JSON.stringify({ items: [], writer: 'cursor-only' }, null, 2));
    console.log(JSON.stringify({ phase: 'reset', audit: true, queue: true }));
  }

  let state = { doneIds: [], flagged: 0, passed: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  const imgState = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
  let ids = Array.isArray(imgState.doneIds) ? imgState.doneIds.slice() : [];
  if (CYCLE_IDS_JSON) {
    const locked = JSON.parse(fs.readFileSync(CYCLE_IDS_JSON, 'utf8'));
    ids = Array.isArray(locked) ? locked : locked.ids || [];
  }
  if (!ids.length) throw new Error('no image-purge / locked ids');

  let queue = { items: [], updated_at: null, writer: 'cursor-only' };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!Array.isArray(queue.items)) queue.items = [];
  const queued = new Set(queue.items.map((x) => x && x.id).filter(Boolean));

  const done = new Set(state.doneIds || []);
  const todo = ids.filter((id) => !done.has(id));
  console.log(JSON.stringify({ phase: 'audit-start', todo: todo.length, queued: queued.size, writer: 'cursor' }));

  await emailOne(
    'PULSE restart — audit for Cursor rewrites (no DeepSeek writing)',
    '<p>Starting over on the first <b>' +
      ids.length +
      '</b>.</p>' +
      '<p><b>Fact-check audit</b> queues issues. <b>Cursor</b> rewrites content (not DeepSeek). Then <b>Pexels</b> image + one email per full fix.</p>'
  );

  let flagged = 0;
  let passed = 0;
  let errors = 0;

  for (const id of todo) {
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      errors++;
      continue;
    }
    if (!blob || !blob.answer) {
      done.add(id);
      continue;
    }

    try {
      const audit = await auditJson(
        AUDIT_SYS,
        'ID: ' + id + '\nQuestion: ' + (blob.question || id) + '\n\nAnswer:\n' + clip(blob.answer)
      );
      const verdict = String(audit.verdict || '').toLowerCase();
      const issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
      if (verdict === 'flag' || issues.length) {
        if (!queued.has(id)) {
          queue.items.push({
            id,
            question: blob.question || id,
            issues: (audit.issues || []).slice(0, 6),
            hallucinations: (audit.hallucinations || []).slice(0, 6),
            content_gaps: (audit.content_gaps || []).slice(0, 6),
            sections: (audit.sections || []).slice(0, 8),
            queued_at: new Date().toISOString(),
            status: 'pending',
            writer: 'cursor',
          });
          queued.add(id);
        }
        flagged++;
        console.log(JSON.stringify({ id, verdict: 'flag', issues: (audit.issues || []).slice(0, 2) }));
      } else {
        passed++;
        if (passed % 25 === 0) console.log(JSON.stringify({ id, verdict: 'pass', passed, flagged }));
      }
      done.add(id);

      // checkpoint every flag/pass so Cursor queue is never lost on restart
      queue.updated_at = new Date().toISOString();
      await s.setJSON(QUEUE_KEY, queue);
      fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
      state.doneIds = [...done];
      state.flagged = flagged;
      state.passed = passed;
      state.lastId = id;
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
    } catch (e) {
      errors++;
      console.log(JSON.stringify({ id, auditError: String(e.message || e).slice(0, 140) }));
      // ultra: tiny pause only on hard errors
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }
  }

  queue.updated_at = new Date().toISOString();
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
  state.doneIds = [...done];
  state.complete = true;
  state.flagged = flagged;
  state.passed = passed;
  state.errors = errors;
  await s.setJSON(STATE_KEY, state);

  const pending = (queue.items || []).filter((x) => x.status === 'pending').length;
  console.log(JSON.stringify({ done: true, passed, flagged, errors, pendingForCursor: pending }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
