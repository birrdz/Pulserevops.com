#!/usr/bin/env node
// Always-on DROP/DRIP: ALWAYS auditing newly updated knowledge URLs.
// INDEPENDENT of the 2750-wave pipeline STOP_AT=8000 — when the batch wave
// takes a break at 8000, THIS DRIP KEEPS RUNNING and keeps auditing new/updated URLs.
//
// WHEN IN DOUBT: sweep the FULL inventory (~28k–35k pages), not just a lookback window.
// After each full pass, loop back for missed / newly updated URLs.
//
// Sources:
//   - FULL index inventory (default) + recent updates + drop file
//   - local drop file: logs/drip-audit-drop.jsonl  (paste URL or id per line)
//
// Independent audit = Cerebras (never DeepSeek). Cursor rewrites via _cursor_write_queue.json.
// Emails include "drip audit" labeling.
//
// Env:
//   DRIP_POLL_MS=120000          gap between ticks (~2 min default — find+drive cadence)
//   DRIP_SCAN_PER_TICK=120       index rows to probe per tick
//   DRIP_AUDIT_PER_TICK=6        max Cerebras audits per tick (keeps cadence ~few mins)
//   DRIP_FULL_INVENTORY=1        (default 1 — when in doubt, full ~35k inventory)
//   DRIP_LOOKBACK_MS=…           (only used if DRIP_FULL_INVENTORY=0)
//   DRIP_EMAIL_PASS=0            (default off — avoid inbox flood; FLAG + Cursor completion emails)
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
// Owner: find + drive every few minutes — not a multi-hour pre-scan.
const POLL_MS = parseInt(process.env.DRIP_POLL_MS || '120000', 10);
const SCAN_PER_TICK = Math.max(20, parseInt(process.env.DRIP_SCAN_PER_TICK || '120', 10));
const AUDIT_PER_TICK = Math.max(1, parseInt(process.env.DRIP_AUDIT_PER_TICK || '6', 10));
const LOOKBACK_MS = parseInt(process.env.DRIP_LOOKBACK_MS || String(24 * 3600 * 1000), 10);
// Owner: when in doubt, sweep the full inventory (~35k), not a short lookback.
const FULL_INVENTORY = String(process.env.DRIP_FULL_INVENTORY || '1') !== '0';
const EMAIL_PASS = String(process.env.DRIP_EMAIL_PASS || '0') === '1';

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

  if (EMAIL_PASS) {
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
  }
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

/**
 * Load / refresh the rolling inventory (ids only — no per-blob pre-scan).
 * Prefer recently touched first; still covers full inventory as the cursor wraps.
 */
async function ensureInventory(s, state) {
  const dropIds = readDropFile(state.drop || (state.drop = { lines: 0 }));
  const dropSet = new Set(dropIds);
  const needRefresh =
    !Array.isArray(state.inventoryIds) ||
    !state.inventoryIds.length ||
    !state.inventoryBuiltAt ||
    Date.now() - Date.parse(state.inventoryBuiltAt) > 6 * 3600 * 1000;

  if (needRefresh) {
    const since = Date.now() - LOOKBACK_MS;
    const idx = await s.get('_index.json', { type: 'json' });
    const rows = ((idx && idx.entries) || []).filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
    const scored = [];
    for (const row of rows) {
      const its = entryTs({}, row);
      if (!FULL_INVENTORY && !dropSet.has(row.id) && its && its < since) continue;
      scored.push({ id: String(row.id).toLowerCase(), ts: its || 0 });
    }
    scored.sort((a, b) => b.ts - a.ts);
    const seen = new Set();
    const ids = [];
    for (const x of scored) {
      if (seen.has(x.id)) continue;
      seen.add(x.id);
      ids.push(x.id);
    }
    // Drop-file ids jump the queue (prepend if missing)
    for (let i = dropIds.length - 1; i >= 0; i--) {
      const id = dropIds[i];
      if (!seen.has(id)) {
        ids.unshift(id);
        seen.add(id);
      } else {
        const at = ids.indexOf(id);
        if (at > 0) {
          ids.splice(at, 1);
          ids.unshift(id);
        }
      }
    }
    state.inventoryIds = ids;
    state.inventoryBuiltAt = new Date().toISOString();
    state.invCursor = 0;
    state.sweepNo = (state.sweepNo || 0) + 1;
    state.sweepStartedAt = state.inventoryBuiltAt;
    // Clear legacy pre-build fields so we never resume a stuck multi-hour build
    state.sweepList = [];
    state.sweepIndex = 0;
    console.log(
      JSON.stringify({
        phase: 'drip-inventory-ready',
        sweepNo: state.sweepNo,
        inventory: ids.length,
        fullInventory: FULL_INVENTORY,
        note: 'rolling cursor — audit every few minutes; no multi-hour pre-scan',
      })
    );
  } else if (dropIds.length) {
    // Hot-insert new drop ids at front without full rebuild
    const ids = state.inventoryIds.slice();
    for (let i = dropIds.length - 1; i >= 0; i--) {
      const id = dropIds[i];
      const at = ids.indexOf(id);
      if (at >= 0) ids.splice(at, 1);
      ids.unshift(id);
    }
    state.inventoryIds = ids;
  }
  return dropSet;
}

async function tick(s, state) {
  let queue = { items: [], drip: true };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!Array.isArray(queue.items)) queue.items = [];

  const dropSet = await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) {
    state.lastRunAt = new Date().toISOString();
    await s.setJSON(STATE_KEY, state);
    return { idle: true, audited: 0, flagged: 0 };
  }

  let cursor = state.invCursor || 0;
  if (cursor >= inventory.length) cursor = 0;

  const due = [];
  let scanned = 0;
  let wrapped = false;
  const startCursor = cursor;
  while (scanned < SCAN_PER_TICK && due.length < AUDIT_PER_TICK) {
    if (cursor >= inventory.length) {
      cursor = 0;
      wrapped = true;
      console.log(
        JSON.stringify({
          phase: 'drip-inventory-wrap',
          sweepNo: state.sweepNo,
          audited: state.audited || 0,
          flagged: state.flagged || 0,
          note: 'full pass complete — looping for missed/new',
        })
      );
      state.sweepNo = (state.sweepNo || 0) + 1;
      state.lastSweepCompletedAt = new Date().toISOString();
      // Refresh inventory on wrap so newly updated URLs surface
      state.inventoryBuiltAt = null;
      await s.setJSON(STATE_KEY, state);
      await ensureInventory(s, state);
      break;
    }
    const id = inventory[cursor];
    cursor += 1;
    scanned += 1;
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      continue;
    }
    if (!needsDripAudit(blob, id, dropSet)) continue;
    due.push(id);
  }
  state.invCursor = cursor;

  console.log(
    JSON.stringify({
      phase: 'drip-tick',
      sweepNo: state.sweepNo,
      scanned,
      due: due.length,
      auditCap: AUDIT_PER_TICK,
      cursor: state.invCursor,
      inventory: inventory.length,
      pendingCursorWrites: (queue.items || []).filter((x) => x && x.status === 'pending').length,
      wrapped,
      startCursor,
    })
  );

  let auditedThis = 0;
  let flaggedThis = 0;
  for (const id of due) {
    try {
      const r = await auditOne(s, id, state, queue);
      state.lastId = id;
      state.lastResult = r;
      state.lastRunAt = new Date().toISOString();
      if (r.skip) {
        console.log(JSON.stringify(Object.assign({ sweepNo: state.sweepNo }, r)));
        continue;
      }
      state.audited = (state.audited || 0) + 1;
      auditedThis += 1;
      if (r.verdict === 'flag') {
        state.flagged = (state.flagged || 0) + 1;
        flaggedThis += 1;
      } else if (r.verdict === 'pass') {
        state.passed = (state.passed || 0) + 1;
      }
      await s.setJSON(STATE_KEY, state);
      console.log(JSON.stringify(Object.assign({ sweepNo: state.sweepNo }, r)));
    } catch (e) {
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
      console.log(JSON.stringify({ id, err: String(e.message || e).slice(0, 140) }));
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Heartbeat so inbox shows drip is alive even when a tick finds only passes
  if (auditedThis > 0) {
    const pending = (queue.items || []).filter((x) => x && x.status === 'pending').length;
    await emailOne(
      ('PULSE drip audit tick — audited ' + auditedThis + ' · flagged ' + flaggedThis + ' · queue ' + pending).slice(0, 180),
      '<p><b>Drip audit</b> rolling tick (every few minutes).</p>' +
        '<ul>' +
        '<li>audited this tick: <b>' +
        auditedThis +
        '</b></li>' +
        '<li>flagged this tick: <b>' +
        flaggedThis +
        '</b> → Cursor rewrite queue</li>' +
        '<li>pending Cursor writes: <b>' +
        pending +
        '</b></li>' +
        '<li>inventory cursor: ' +
        (state.invCursor || 0) +
        ' / ' +
        inventory.length +
        '</li>' +
        '</ul>' +
        '<p>Full inventory keeps rolling; drip never stops after batch STOP_AT=8000.</p>'
    );
  }

  await s.setJSON(STATE_KEY, state);
  return { idle: auditedThis === 0 && due.length === 0, audited: auditedThis, flagged: flaggedThis };
}

async function main() {
  const s = store();
  let state = {
    inventoryIds: [],
    invCursor: 0,
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
  // Force rolling mode — abandon any legacy multi-hour sweepList build
  state.sweepList = [];
  state.sweepIndex = 0;
  state.inventoryBuiltAt = null;

  await emailOne(
    'PULSE drip audit monitor ON — find+drive every few minutes',
    '<p>Always-on <b>drip audit</b> (rolling cadence):</p>' +
      '<ol>' +
      '<li>Every few minutes: scan a chunk of inventory + audit due pages</li>' +
      '<li>Flags → <b>Cursor rewrite</b> queue → Pexels → one completion email</li>' +
      '<li>Walks the <b>full inventory</b> (~28k–35k), then loops for missed/new</li>' +
      '<li>Stays running after batch STOP_AT=8000</li>' +
      '</ol>' +
      '<p>pollMs=' +
      POLL_MS +
      ' scan/tick=' +
      SCAN_PER_TICK +
      ' audit/tick=' +
      AUDIT_PER_TICK +
      '</p>'
  );

  console.log(
    JSON.stringify({
      phase: 'drip-start',
      pollMs: POLL_MS,
      scanPerTick: SCAN_PER_TICK,
      auditPerTick: AUDIT_PER_TICK,
      dropFile: DROP_FILE,
      mode: 'rolling-full-inventory',
      fullInventory: FULL_INVENTORY,
    })
  );
  for (;;) {
    try {
      const r = await tick(s, state);
      // Busy ticks: short gap so we keep driving; idle: full poll interval
      const wait = r && r.idle ? POLL_MS : Math.min(POLL_MS, 45000);
      await new Promise((res) => setTimeout(res, wait));
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
