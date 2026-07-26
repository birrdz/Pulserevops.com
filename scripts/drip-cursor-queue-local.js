#!/usr/bin/env node
// Always-on DRIP — Cursor does everything.
// This process only FINDS candidates and queues them for Cursor.
// It does NOT call Cerebras / DeepSeek / Claude.
// Cursor diagnoses + rewrites + Pexels + one email via cursor-apply-fix.js.
//
// Env:
//   DRIP_POLL_MS=120000
//   DRIP_SCAN_PER_TICK=80
//   DRIP_QUEUE_PER_TICK=8
//   DRIP_FULL_INVENTORY=1

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
const STATE_KEY = '_drip_cursor_queue_state.json';
const QUEUE_KEY = '_cursor_write_queue.json';
const DROP_FILE = path.join(process.cwd(), 'logs', 'drip-audit-drop.jsonl');
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');
const POLL_MS = parseInt(process.env.DRIP_POLL_MS || '120000', 10);
const SCAN_PER_TICK = Math.max(20, parseInt(process.env.DRIP_SCAN_PER_TICK || '80', 10));
const QUEUE_PER_TICK = Math.max(1, parseInt(process.env.DRIP_QUEUE_PER_TICK || '8', 10));
const FULL_INVENTORY = String(process.env.DRIP_FULL_INVENTORY || '1') !== '0';

fs.mkdirSync(path.dirname(DROP_FILE), { recursive: true });
if (!fs.existsSync(DROP_FILE)) fs.writeFileSync(DROP_FILE, '');
fs.mkdirSync(path.dirname(LOCAL_QUEUE), { recursive: true });

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

function entryTs(blob, row) {
  const vals = [
    blob && blob.batch_cycled_at,
    blob && blob.face_purged_at,
    blob && blob.updated_at,
    blob && blob.drip_audited_at,
    blob && blob.cursor_fixed_at,
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

/** Lightweight triage only — Cursor does the real diagnose+rewrite. */
function needsCursorPass(blob, id, dropSet) {
  if (!blob || !blob.answer) return false;
  if (dropSet.has(id)) return true;
  if (blob.cursor_fixed_at) {
    const fixed = Date.parse(blob.cursor_fixed_at) || 0;
    const ts = entryTs(blob, null);
    if (fixed && ts && ts <= fixed && blob.drip_audit_verdict !== 'flag') return false;
  }
  const ans = String(blob.answer || '');
  if (ans.length < 400) return true;
  if (/white\s*page|placeholder|lorem ipsum|TODO_FIX|\[image\]/i.test(ans)) return true;
  if (!/##\s*FAQ\b/i.test(ans) && !/\bFAQ\b/.test(ans.slice(0, 500))) {
    // many pages need FAQ — still let Cursor decide; only force if clearly Q&A-ish
  }
  if (!blob.cursor_fixed_at && !blob.drip_audited_at) return true;
  if (blob.drip_audit_verdict === 'flag' || blob.drip_audit_verdict === 'error') return true;
  const ts = entryTs(blob, null);
  const seen = Math.max(
    Date.parse(blob.cursor_queued_at || 0) || 0,
    Date.parse(blob.cursor_fixed_at || 0) || 0,
    Date.parse(blob.drip_audited_at || 0) || 0
  );
  if (ts && seen && ts > seen) return true;
  if (!seen) return true;
  return false;
}

async function enqueueCursor(s, queue, item) {
  const items = queue.items || [];
  const pendingIds = new Set(items.filter((x) => x && x.status === 'pending').map((x) => x.id));
  if (pendingIds.has(item.id)) {
    queue.items = items.map((x) =>
      x && x.id === item.id && x.status === 'pending' ? Object.assign({}, x, item, { status: 'pending' }) : x
    );
  } else {
    queue.items = items.concat([item]);
  }
  queue.updated_at = new Date().toISOString();
  queue.writer = 'cursor-only';
  queue.drip = true;
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
}

async function ensureInventory(s, state) {
  const dropIds = readDropFile(state.drop || (state.drop = { lines: 0 }));
  const dropSet = new Set(dropIds);
  const needRefresh =
    !Array.isArray(state.inventoryIds) ||
    !state.inventoryIds.length ||
    !state.inventoryBuiltAt ||
    Date.now() - Date.parse(state.inventoryBuiltAt) > 6 * 3600 * 1000;

  if (needRefresh) {
    const idx = await s.get('_index.json', { type: 'json' });
    const rows = ((idx && idx.entries) || []).filter((e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
    const scored = rows.map((row) => ({ id: String(row.id).toLowerCase(), ts: entryTs({}, row) || 0 }));
    scored.sort((a, b) => b.ts - a.ts);
    const seen = new Set();
    const ids = [];
    for (const x of scored) {
      if (seen.has(x.id)) continue;
      seen.add(x.id);
      ids.push(x.id);
    }
    for (let i = dropIds.length - 1; i >= 0; i--) {
      const id = dropIds[i];
      const at = ids.indexOf(id);
      if (at >= 0) ids.splice(at, 1);
      ids.unshift(id);
      seen.add(id);
    }
    state.inventoryIds = ids;
    state.inventoryBuiltAt = new Date().toISOString();
    state.invCursor = 0;
    state.sweepNo = (state.sweepNo || 0) + 1;
    console.log(
      JSON.stringify({
        phase: 'drip-inventory-ready',
        sweepNo: state.sweepNo,
        inventory: ids.length,
        fullInventory: FULL_INVENTORY,
        note: 'Cursor-only queue — no Cerebras/DeepSeek/Claude',
      })
    );
  }
  return dropSet;
}

async function tick(s, state) {
  let queue = { items: [], writer: 'cursor-only', drip: true };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!Array.isArray(queue.items)) queue.items = [];

  const dropSet = await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) {
    await s.setJSON(STATE_KEY, state);
    return { idle: true, queued: 0 };
  }

  let cursor = state.invCursor || 0;
  if (cursor >= inventory.length) cursor = 0;

  const due = [];
  let scanned = 0;
  while (scanned < SCAN_PER_TICK && due.length < QUEUE_PER_TICK) {
    if (cursor >= inventory.length) {
      cursor = 0;
      state.sweepNo = (state.sweepNo || 0) + 1;
      state.inventoryBuiltAt = null;
      state.invCursor = 0;
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
    if (!needsCursorPass(blob, id, dropSet)) continue;
    due.push({ id, blob });
  }
  state.invCursor = cursor;

  let queued = 0;
  for (const { id, blob } of due) {
    const ts = new Date().toISOString();
    const question = (blob && blob.question) || id;
    const priorIssues = [].concat((blob && blob.drip_audit_issues) || [], (blob && blob.batch_cycle_issues) || []).slice(0, 6);
    await enqueueCursor(s, queue, {
      id,
      question,
      url: knowledgeUrl(id),
      issues: priorIssues.length ? priorIssues : ['Cursor review: diagnose + rewrite required'],
      hallucinations: [],
      content_gaps: [],
      sections: [],
      queued_at: ts,
      status: 'pending',
      writer: 'cursor',
      source: 'drip-cursor',
    });
    try {
      await s.setJSON(
        'answers/' + id + '.json',
        Object.assign({}, blob, {
          cursor_queued_at: ts,
          updated_at: ts,
        })
      );
    } catch (e) {}
    queued += 1;
    state.queued = (state.queued || 0) + 1;
    state.lastId = id;
    console.log(JSON.stringify({ phase: 'drip-queued-for-cursor', id, question: String(question).slice(0, 80) }));
  }

  const pending = (queue.items || []).filter((x) => x && x.status === 'pending').length;
  console.log(
    JSON.stringify({
      phase: 'drip-tick',
      sweepNo: state.sweepNo,
      scanned,
      queuedThisTick: queued,
      pendingCursor: pending,
      cursor: state.invCursor,
      inventory: inventory.length,
      note: 'Cursor must drain with diagnose+rewrite+Pexels+email',
    })
  );

  if (queued > 0) {
    await emailOne(
      ('PULSE drip → Cursor queue +' + queued + ' · pending ' + pending).slice(0, 180),
      '<p><b>Drip</b> queued pages for <b>Cursor</b> (no Cerebras / DeepSeek / Claude).</p>' +
        '<p>Queued this tick: <b>' +
        queued +
        '</b>. Pending for Cursor: <b>' +
        pending +
        '</b>.</p>' +
        '<p>Cursor diagnoses, rewrites, Pexels, then one completion email per page.</p>'
    );
  }

  state.lastRunAt = new Date().toISOString();
  await s.setJSON(STATE_KEY, state);
  return { idle: queued === 0, queued };
}

async function main() {
  const s = store();
  let state = { inventoryIds: [], invCursor: 0, sweepNo: 0, drop: { lines: 0 }, queued: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!state.drop) state.drop = { lines: 0 };

  await emailOne(
    'PULSE drip ON — Cursor does everything (queue only; no Cerebras)',
    '<p>Drip finds URLs every few minutes and queues them for <b>Cursor</b>.</p>' +
      '<p><b>Cursor</b> diagnoses + rewrites + Pexels + one email. No Cerebras, no DeepSeek, no Claude API.</p>'
  );

  console.log(
    JSON.stringify({
      phase: 'drip-start',
      mode: 'cursor-queue-only',
      pollMs: POLL_MS,
      scanPerTick: SCAN_PER_TICK,
      queuePerTick: QUEUE_PER_TICK,
    })
  );

  for (;;) {
    try {
      const r = await tick(s, state);
      await new Promise((res) => setTimeout(res, r && r.idle ? POLL_MS : Math.min(POLL_MS, 45000)));
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
