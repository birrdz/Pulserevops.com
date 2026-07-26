#!/usr/bin/env node
// Audit-only fact-check (DeepSeek). Queues flagged entries for Cursor writing.
// Does NOT rewrite content (Cursor writes). Image fill is separate (Pexels).

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

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

async function emailOne(subject, html) {
  try {
    await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {}
}

async function dsJson(system, user) {
  const key = process.env.DEEPSEEK_API_KEY || process.env.ds1;
  if (!key) throw new Error('DEEPSEEK_API_KEY/ds1 missing');
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 700,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal: AbortSignal.timeout(90000),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(r.status + ':' + t.slice(0, 160));
  const j = JSON.parse(t);
  const text = (((j.choices || [])[0] || {}).message || {}).content || '';
  const m = String(text).match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no-json');
  return JSON.parse(m[0]);
}

const AUDIT_SYS = `You are a strict fact-checker. Return ONLY JSON:
{"verdict":"pass"|"flag","issues":["..."],"hallucinations":["exact false claim"],"content_gaps":["missing/thin section"],"image_gaps":["missing/broken image note"]}
FLAG invented stats/vendors/years, contradictions, wrong Direct Answer, missing required sections.
PASS if solid. Max 6 issues. Quote bad claims.`;

function clip(answer) {
  const s = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  if (s.length <= 12000) return s;
  return s.slice(0, 7000) + '\n\n…\n\n' + s.slice(-4000);
}

async function main() {
  const s = store();
  fs.mkdirSync(path.dirname(LOCAL_QUEUE), { recursive: true });

  let state = { doneIds: [], flagged: 0, passed: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  const imgState = (await s.get(IMAGE_STATE_KEY, { type: 'json' })) || {};
  const ids = Array.isArray(imgState.doneIds) ? imgState.doneIds : [];
  if (!ids.length) throw new Error('no image-purge doneIds');

  let queue = { items: [], updated_at: null };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  const queued = new Set((queue.items || []).map((x) => x.id));

  const done = new Set(state.doneIds || []);
  const todo = ids.filter((id) => !done.has(id));
  console.log(JSON.stringify({ phase: 'audit-start', todo: todo.length, queued: queued.size }));

  await emailOne(
    'PULSE fact-check audit started (Cursor will write fixes)',
    '<p>Auditing ' +
      todo.length +
      ' entries. Flagged ones go to the Cursor write queue. Content rewrites = Cursor. Images = Pexels (separate).</p>'
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
      const audit = await dsJson(
        AUDIT_SYS,
        'ID: ' +
          id +
          '\nQuestion: ' +
          (blob.question || id) +
          '\n\nAnswer:\n' +
          clip(blob.answer)
      );
      const verdict = String(audit.verdict || '').toLowerCase();
      if (verdict === 'flag' || (audit.hallucinations || []).length || (audit.content_gaps || []).length) {
        if (!queued.has(id)) {
          queue.items.push({
            id,
            question: blob.question || id,
            issues: (audit.issues || []).slice(0, 6),
            hallucinations: (audit.hallucinations || []).slice(0, 6),
            content_gaps: (audit.content_gaps || []).slice(0, 6),
            image_gaps: (audit.image_gaps || []).slice(0, 4),
            queued_at: new Date().toISOString(),
            status: 'pending',
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
    } catch (e) {
      errors++;
      console.log(JSON.stringify({ id, auditError: String(e.message || e).slice(0, 140) }));
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    if ((flagged + passed) % 20 === 0) {
      queue.updated_at = new Date().toISOString();
      await s.setJSON(QUEUE_KEY, queue);
      fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
      state.doneIds = [...done];
      state.flagged = (state.flagged || 0) + flagged;
      state.passed = (state.passed || 0) + passed;
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
    }
  }

  queue.updated_at = new Date().toISOString();
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
  state.doneIds = [...done];
  state.complete = true;
  state.flagged = (state.flagged || 0) + flagged;
  state.passed = (state.passed || 0) + passed;
  state.errors = (state.errors || 0) + errors;
  await s.setJSON(STATE_KEY, state);

  await emailOne(
    'PULSE audit done — ' + flagged + ' flagged for Cursor writing',
    '<p>passed=' +
      passed +
      ' flagged=' +
      flagged +
      ' errors=' +
      errors +
      '</p><p>Cursor write queue size: ' +
      (queue.items || []).filter((x) => x.status === 'pending').length +
      '</p>'
  );
  console.log(JSON.stringify({ done: true, passed, flagged, errors, queue: queue.items.length }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
