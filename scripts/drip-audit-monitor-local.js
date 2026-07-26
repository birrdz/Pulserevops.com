#!/usr/bin/env node
// Always-on DROP/DRIP: ALWAYS auditing newly updated knowledge URLs.
// INDEPENDENT of the 2750-wave pipeline STOP_AT=8000 — when the batch wave
// takes a break at 8000, THIS DRIP KEEPS RUNNING and keeps auditing new/updated URLs.
// Sources:
//   - any blob with recent updated_at / face_purged_at / batch_cycled_at / polished_at
//   - local drop file: logs/drip-audit-drop.jsonl  (paste URL or id per line)
//
// Independent audit = Cerebras (never DeepSeek). Cursor rewrites via _cursor_write_queue.json.
// Emails include "drip audit" labeling.
//
// Env:
//   DRIP_POLL_MS=30000
//   DRIP_LOOKBACK_MS=86400000   (default 24h)
//   CURSOR_ULTRA=1

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
const STATE_KEY = '_drip_audit_monitor_state.json';
const QUEUE_KEY = '_cursor_write_queue.json';
const DROP_FILE = path.join(process.cwd(), 'logs', 'drip-audit-drop.jsonl');
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');
const POLL_MS = parseInt(process.env.DRIP_POLL_MS || '30000', 10);
const LOOKBACK_MS = parseInt(process.env.DRIP_LOOKBACK_MS || String(24 * 3600 * 1000), 10);

fs.mkdirSync(path.dirname(DROP_FILE), { recursive: true });
if (!fs.existsSync(DROP_FILE)) fs.writeFileSync(DROP_FILE, '');

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

function idFromUrlOrId(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  const m = s.match(/\/knowledge\/([a-z]{2,3}\d[\w-]*)/i) || s.match(/\b([a-z]{2,3}\d{3,})\b/i);
  if (m) return m[1].toLowerCase();
  if (/^[a-z]{2,3}\d/i.test(s)) return s.toLowerCase();
  return '';
}

async function emailOne(subject, html) {
  try {
    const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html }),
      signal: AbortSignal.timeout(20000),
    });
    console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', subject: String(subject).slice(0, 90) }));
  } catch (e) {
    console.log(JSON.stringify({ email: 'fail', err: String(e.message || e).slice(0, 100) }));
  }
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

async function cerebrasAudit(system, user) {
  const key = process.env.CEREBRAS_API_KEY || process.env.cerebras;
  if (!key) throw new Error('CEREBRAS_API_KEY missing');
  const model = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
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
      await new Promise((res) => setTimeout(res, 8000));
      continue;
    }
    if (!r.ok) throw new Error(r.status + ':' + t.slice(0, 140));
    const j = JSON.parse(t);
    const text = (((j.choices || [])[0] || {}).message || {}).content || '';
    try {
      return parseJsonObject(text);
    } catch (e) {
      continue;
    }
  }
  throw new Error('audit-failed');
}

const AUDIT_SYS = `Strict fact-checker (drip audit). Return ONLY compact JSON:
{"verdict":"pass"|"flag","issues":["Section 2: …"],"hallucinations":["Section 3: …"],"content_gaps":["FAQ: …"],"sections":["Section 2"]}
HARD LIMITS: max 5 issues / hallucinations / gaps; each ≤140 chars; start with section label.
FLAG invented facts/stats/years, contradictions, wrong Direct Answer, missing sections.`;

function clip(answer) {
  const s = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  if (s.length <= 12000) return s;
  return s.slice(0, 7000) + '\n\n…\n\n' + s.slice(-4000);
}

function entryTs(blob, row) {
  const vals = [
    blob && blob.batch_cycled_at,
    blob && blob.face_purged_at,
    blob && blob.updated_at,
    blob && blob.drip_audited_at,
    row && row.ts,
    row && row.polished_at,
  ];
  let max = 0;
  for (const v of vals) {
    if (!v) continue;
    const n = typeof v === 'number' ? v : Date.parse(String(v));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

function readDropFile(seenDrop) {
  const ids = [];
  let text = '';
  try {
    text = fs.readFileSync(DROP_FILE, 'utf8');
  } catch (e) {
    return ids;
  }
  const lines = text.split(/\r?\n/).filter(Boolean);
  // Only process new trailing lines via byte offset stored in seenDrop
  const start = seenDrop.lines || 0;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i].trim();
    let id = '';
    try {
      const j = JSON.parse(line);
      id = idFromUrlOrId(j.id || j.url || j.href || '');
    } catch (e) {
      id = idFromUrlOrId(line);
    }
    if (id) ids.push(id);
  }
  seenDrop.lines = lines.length;
  return ids;
}

async function enqueueCursor(s, queue, item) {
  const queued = new Set((queue.items || []).map((x) => x && x.id));
  if (queued.has(item.id)) {
    // refresh pending critique if still pending
    queue.items = (queue.items || []).map((x) =>
      x && x.id === item.id && x.status === 'pending' ? Object.assign({}, x, item, { status: 'pending' }) : x
    );
  } else {
    queue.items = queue.items || [];
    queue.items.push(item);
  }
  queue.updated_at = new Date().toISOString();
  queue.drip = true;
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
}

async function auditOne(s, id, state, queue) {
  const blob = await s.get('answers/' + id + '.json', { type: 'json' });
  if (!blob || !blob.answer) return { id, skip: 'no-blob' };
  const url = knowledgeUrl(id);
  const question = blob.question || id;

  const audit = await cerebrasAudit(
    AUDIT_SYS,
    'DRIP AUDIT\nID: ' + id + '\nURL: ' + url + '\nQuestion: ' + question + '\n\nAnswer:\n' + clip(blob.answer)
  );
  const verdict = String(audit.verdict || '').toLowerCase();
  const issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
  const sections = [].concat(audit.sections || []);
  const ts = new Date().toISOString();

  await s.setJSON(
    'answers/' + id + '.json',
    Object.assign({}, blob, {
      drip_audited_at: ts,
      drip_audit_verdict: verdict === 'flag' || issues.length ? 'flag' : 'pass',
      drip_audit_issues: issues.slice(0, 8),
      drip_audit_sections: sections.slice(0, 8),
      updated_at: ts,
    })
  );

  if (verdict === 'flag' || issues.length) {
    await enqueueCursor(s, queue, {
      id,
      question,
      url,
      issues: (audit.issues || []).slice(0, 6),
      hallucinations: (audit.hallucinations || []).slice(0, 6),
      content_gaps: (audit.content_gaps || []).slice(0, 6),
      sections: sections.slice(0, 8),
      queued_at: ts,
      status: 'pending',
      writer: 'cursor',
      source: 'drip-audit',
    });

    await emailOne(
      ('PULSE drip audit FLAG — ' + id + ': ' + (sections.slice(0, 3).join(', ') || 'issues')).slice(0, 180),
      '<p><b>Drip audit</b> (always-on monitor) flagged a newly fixed URL.</p>' +
        '<p><a href="' +
        url +
        '">' +
        url +
        '</a></p>' +
        '<p><b>Question:</b> ' +
        String(question).replace(/</g, '').slice(0, 200) +
        '</p>' +
        '<p><b>Fact-check sections:</b> ' +
        (sections.length ? sections.map((x) => '<code>' + String(x).replace(/</g, '') + '</code>').join(', ') : 'see list') +
        '</p>' +
        '<ul>' +
        issues
          .slice(0, 6)
          .map((x) => '<li>' + String(x).replace(/</g, '').slice(0, 220) + '</li>')
          .join('') +
        '</ul>' +
        '<p>Queued for <b>Cursor rewrite</b> (not DeepSeek) → then Pexels + full update email.</p>'
    );
    return { id, verdict: 'flag', issues: issues.length };
  }

  await emailOne(
    'PULSE drip audit PASS — ' + id,
    '<p><b>Drip audit</b> (always-on monitor) passed a newly fixed URL.</p>' +
      '<p><a href="' +
      url +
      '">' +
      url +
      '</a></p>' +
      '<p>No Cursor rewrite queued.</p>'
  );
  return { id, verdict: 'pass' };
}

function needsDripAudit(blob, id, dropSet) {
  if (!blob || !blob.answer) return false;
  if (dropSet.has(id)) return true;
  const ts = entryTs(blob, null);
  const dripAt = blob.drip_audited_at ? Date.parse(blob.drip_audited_at) : 0;
  // never audited
  if (!dripAt) return true;
  // updated after last drip audit (missed refresh / new fix)
  if (ts && ts > dripAt) return true;
  // prior drip error / incomplete
  if (blob.drip_audit_verdict === 'error') return true;
  return false;
}

/** Build FULL sweep list of updated URLs that still need drip audit. */
async function buildSweepList(s, state) {
  const since = Date.now() - LOOKBACK_MS;
  const dropIds = readDropFile(state.drop || (state.drop = { lines: 0 }));
  const dropSet = new Set(dropIds);
  const idx = await s.get('_index.json', { type: 'json' });
  const rows = ((idx && idx.entries) || []).filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));

  // newest-updated first within lookback, plus explicit drops
  const scored = [];
  for (const row of rows) {
    const its = entryTs({}, row);
    if (!dropSet.has(row.id) && its && its < since) continue;
    scored.push({ id: row.id, ts: its || 0 });
  }
  for (const id of dropIds) {
    if (!scored.some((x) => x.id === id)) scored.push({ id, ts: Date.now() });
  }
  scored.sort((a, b) => b.ts - a.ts);

  const list = [];
  const seen = new Set();
  for (const { id } of scored) {
    if (seen.has(id)) continue;
    seen.add(id);
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      continue;
    }
    if (!needsDripAudit(blob, id, dropSet)) continue;
    list.push(id);
  }
  return list;
}

async function tick(s, state) {
  let queue = { items: [], drip: true };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!Array.isArray(queue.items)) queue.items = [];

  // Start or continue a full sweep of updated URLs
  if (!Array.isArray(state.sweepList) || !state.sweepList.length) {
    state.sweepList = await buildSweepList(s, state);
    state.sweepIndex = 0;
    state.sweepNo = (state.sweepNo || 0) + 1;
    state.sweepStartedAt = new Date().toISOString();
    console.log(
      JSON.stringify({
        phase: 'drip-sweep-start',
        sweepNo: state.sweepNo,
        total: state.sweepList.length,
        note: 'full list of updated URLs needing audit; after this pass, loop back for missed/new',
      })
    );
    if (!state.sweepList.length) {
      // nothing due — short idle, then rebuild (catch brand-new updates)
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
      return { idle: true };
    }
  }

  const batch = state.sweepList.slice(state.sweepIndex || 0, (state.sweepIndex || 0) + 25);
  console.log(
    JSON.stringify({
      phase: 'drip-tick',
      sweepNo: state.sweepNo,
      left: Math.max(0, state.sweepList.length - (state.sweepIndex || 0)),
      batch: batch.length,
      total: state.sweepList.length,
    })
  );

  for (const id of batch) {
    try {
      const r = await auditOne(s, id, state, queue);
      state.sweepIndex = (state.sweepIndex || 0) + 1;
      state.lastId = id;
      state.lastResult = r;
      state.lastRunAt = new Date().toISOString();
      state.audited = (state.audited || 0) + 1;
      if (r.verdict === 'flag') state.flagged = (state.flagged || 0) + 1;
      else if (r.verdict === 'pass') state.passed = (state.passed || 0) + 1;
      await s.setJSON(STATE_KEY, state);
      console.log(JSON.stringify(Object.assign({ sweepNo: state.sweepNo }, r)));
    } catch (e) {
      // leave id for a later sweep (mark error so needsDripAudit retries)
      try {
        const blob = await s.get('answers/' + id + '.json', { type: 'json' });
        if (blob) {
          await s.setJSON(
            'answers/' + id + '.json',
            Object.assign({}, blob, {
              drip_audit_verdict: 'error',
              drip_audit_error: String(e.message || e).slice(0, 160),
              updated_at: new Date().toISOString(),
            })
          );
        }
      } catch (e2) {}
      state.sweepIndex = (state.sweepIndex || 0) + 1;
      console.log(JSON.stringify({ id, err: String(e.message || e).slice(0, 140) }));
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Finished this full list → clear and loop back for missed / newly updated URLs
  if ((state.sweepIndex || 0) >= state.sweepList.length) {
    console.log(
      JSON.stringify({
        phase: 'drip-sweep-complete',
        sweepNo: state.sweepNo,
        audited: state.audited,
        flagged: state.flagged,
        note: 'looping back for missed or newly updated URLs',
      })
    );
    await emailOne(
      'PULSE drip audit sweep #' + state.sweepNo + ' complete — looping for missed/new URLs',
      '<p>Finished drip-audit sweep <b>#' +
        state.sweepNo +
        '</b> over the updated URL list.</p>' +
        '<p>audited≈' +
        (state.audited || 0) +
        ' flagged≈' +
        (state.flagged || 0) +
        '</p>' +
        '<p>Now looping back to catch <b>missed</b> or <b>newly updated</b> URLs. Drip never stops (even after batch STOP_AT=8000).</p>'
    );
    state.sweepList = [];
    state.sweepIndex = 0;
    state.lastSweepCompletedAt = new Date().toISOString();
    await s.setJSON(STATE_KEY, state);
  }
  return { idle: false };
}

async function main() {
  const s = store();
  let state = {
    sweepList: [],
    sweepIndex: 0,
    sweepNo: 0,
    drop: { lines: 0 },
    audited: 0,
    flagged: 0,
    passed: 0,
  };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!state.drop) state.drop = { lines: 0 };

  await emailOne(
    'PULSE drip audit monitor ON — full updated-URL sweeps forever',
    '<p>Always-on <b>drip audit</b>:</p>' +
      '<ol>' +
      '<li>Audits the <b>full list</b> of updated URLs</li>' +
      '<li>When that sweep finishes, <b>loops back</b> for missed or newly updated URLs</li>' +
      '<li>Flags → Cursor rewrite queue; emails include <b>drip audit</b></li>' +
      '<li>Stays running after batch STOP_AT=8000</li>' +
      '</ol>' +
      '<p>Drop file: <code>logs/drip-audit-drop.jsonl</code></p>'
  );

  console.log(JSON.stringify({ phase: 'drip-start', pollMs: POLL_MS, dropFile: DROP_FILE, mode: 'full-sweep-loop' }));
  for (;;) {
    try {
      const r = await tick(s, state);
      // if idle (nothing due), wait then rebuild; if busy, shorter gap between batches
      await new Promise((res) => setTimeout(res, r && r.idle ? POLL_MS : Math.min(POLL_MS, 5000)));
    } catch (e) {
      console.log(JSON.stringify({ tickError: String(e.message || e).slice(0, 160) }));
      await new Promise((r) => setTimeout(r, POLL_MS));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
