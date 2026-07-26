#!/usr/bin/env node
// Apply a Cursor-written rewrite for one entry, then Pexels cover + one email.
// NEVER calls DeepSeek for writing — body must be provided by Cursor (file/stdin).
//
// Usage:
//   CURSOR_REWRITE_FILE=/tmp/rewrite-ca0513.md node scripts/cursor-apply-fix.js ca0513
//   cat rewrite.md | node scripts/cursor-apply-fix.js ca0513
//
// Optional JSON critique file: CURSOR_CRITIQUE_JSON=/tmp/critique-ca0513.json

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { preserveImages, enforceWriterVisualLock } = require('../_visual_lock_law');
const { pexelsRequest } = require('../netlify/functions/lib/pexels-throttle');
const { deriveImageSearchQuery } = require('../netlify/functions/lib/derive-image-search-query');

let storeGradedImage;
try {
  ({ storeGradedImage } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ fatal: 'storeGradedImage: ' + e.message }));
  process.exit(1);
}

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
const QUEUE_KEY = '_cursor_write_queue.json';
const CYCLE_KEY = '_batch_cycle_state.json';
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.Pexels_Api_Key;
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');

fs.mkdirSync(ASSET_DIR, { recursive: true });
fs.mkdirSync(path.dirname(LOCAL_QUEUE), { recursive: true });

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function emailOne(subject, html) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
        signal: AbortSignal.timeout(20000),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(r.status + ':' + t.slice(0, 120));
      console.log(JSON.stringify({ email: 'ok', subject: String(subject).slice(0, 100), attempt }));
      return;
    } catch (e) {
      console.log(JSON.stringify({ email: 'fail', attempt, err: String(e.message || e).slice(0, 120) }));
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

function extractSectionLabels(items) {
  const labels = [];
  const seen = new Set();
  for (const raw of items || []) {
    const s = String(raw || '');
    const m =
      s.match(/^(Direct Answer|Bottom Line|How We Ranked|FAQ|Sources|What to Look For)\b/i) ||
      s.match(/^Section\s+(\d+)\b/i) ||
      s.match(/^##\s*(\d+)/i) ||
      s.match(/\bSection\s+(\d+)\b/i);
    if (!m) continue;
    let label = /^\d+$/.test(m[1] || '') ? 'Section ' + m[1] : m[1] || m[0];
    if (/^direct answer$/i.test(label)) label = 'Direct Answer';
    if (/^faq$/i.test(label)) label = 'FAQ';
    if (/^bottom line$/i.test(label)) label = 'Bottom Line';
    const k = label.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    labels.push(label);
  }
  return labels;
}

async function pexelsCover(id, title) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing');
  const query = deriveImageSearchQuery(title || id);
  const url =
    'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' +
    encodeURIComponent(query);
  const r = await pexelsRequest(async () => {
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-cursor-apply/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    return { status: res.status, body: Buffer.from(await res.arrayBuffer()) };
  });
  if (r.status !== 200) throw new Error('pexels ' + r.status);
  const data = JSON.parse(r.body.toString('utf8'));
  const photos = data.photos || [];
  const ok = photos.filter((p) => p && p.width >= 1200 && p.width >= p.height);
  const pool = ok.length ? ok : photos;
  pool.sort((a, b) => b.width * b.height - a.width * a.height);
  const p = pool[0];
  const src = p && p.src && (p.src.large2x || p.src.large || p.src.original);
  if (!src) throw new Error('pexels miss');
  const dl = await fetch(src, { signal: AbortSignal.timeout(45000) });
  if (!dl.ok) throw new Error('dl ' + dl.status);
  const buf = Buffer.from(await dl.arrayBuffer());
  const dest = path.join(ASSET_DIR, id + '.jpg');
  await storeGradedImage(buf, dest, {
    square: 760,
    faceCard: true,
    cropPosition: 'attention',
    bright: false,
  });
  return { rel: '/assets/qa/' + id + '.jpg', query };
}

function swapLeadingImage(answer, rel, title) {
  const ans = String(answer || '');
  const alt = String(title || 'cover').replace(/[\[\]"]/g, '').slice(0, 80);
  if (/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/.test(ans)) {
    return '![' + alt + '](' + rel + ')\n\n' + ans.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
  }
  return ans;
}

function readRewrite(id) {
  const file = process.env.CURSOR_REWRITE_FILE;
  if (file) return fs.readFileSync(file, 'utf8');
  if (!process.stdin.isTTY) return fs.readFileSync(0, 'utf8');
  const fallback = '/tmp/cursor-rewrite-' + id + '.md';
  if (fs.existsSync(fallback)) return fs.readFileSync(fallback, 'utf8');
  throw new Error('no Cursor rewrite body (set CURSOR_REWRITE_FILE or pipe stdin)');
}

async function main() {
  const id = process.argv[2];
  if (!id) throw new Error('usage: node scripts/cursor-apply-fix.js <id>');

  let rewritten = readRewrite(id)
    .replace(/^```(?:markdown|md)?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();
  if (rewritten.length < 400) throw new Error('rewrite too short');

  let critique = {};
  if (process.env.CURSOR_CRITIQUE_JSON && fs.existsSync(process.env.CURSOR_CRITIQUE_JSON)) {
    critique = JSON.parse(fs.readFileSync(process.env.CURSOR_CRITIQUE_JSON, 'utf8'));
  }

  const s = store();
  const blob = await s.get('answers/' + id + '.json', { type: 'json' });
  if (!blob || !blob.answer) throw new Error('missing blob ' + id);
  const question = blob.question || id;
  const original = String(blob.answer);
  const url = SITE + '/knowledge/' + encodeURIComponent(id);

  let body;
  try {
    body = enforceWriterVisualLock(original, rewritten, { id }) || preserveImages(original, rewritten);
  } catch (e) {
    body = preserveImages(original, rewritten);
  }

  const { rel, query } = await pexelsCover(id, question);
  body = swapLeadingImage(body, rel, question);

  const issues = []
    .concat(critique.issues || [], critique.hallucinations || [], critique.content_gaps || [])
    .map(String);
  const sections = extractSectionLabels(issues);
  const actions = ['content-rewrite:cursor', 'pexels:' + query];
  const ts = new Date().toISOString();

  await s.setJSON(
    'answers/' + id + '.json',
    Object.assign({}, blob, {
      answer: body,
      img: rel,
      cover_src: 'pexels',
      batch_cycled_at: ts,
      batch_cycle_actions: actions,
      batch_cycle_issues: issues.slice(0, 8),
      batch_cycle_writer: 'cursor',
      updated_at: ts,
    })
  );

  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const i = (idx.entries || []).findIndex((e) => e && e.id === id);
  if (i >= 0) {
    idx.entries[i].img = rel;
    idx.entries[i].cover_src = 'pexels';
    await s.setJSON('_index.json', idx);
  }

  // mark queue item done
  let queue = { items: [] };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  queue.items = (queue.items || []).map((it) =>
    it && it.id === id
      ? Object.assign({}, it, { status: 'done_cursor', done_at: ts, writer: 'cursor' })
      : it
  );
  queue.updated_at = ts;
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));

  // cycle progress
  let cycle = { doneIds: [], fixed: 0, passed: 0, imaged: 0 };
  try {
    cycle = Object.assign(cycle, (await s.get(CYCLE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  const done = new Set(cycle.doneIds || []);
  done.add(id);
  cycle.doneIds = [...done];
  cycle.fixed = (cycle.fixed || 0) + 1;
  cycle.imaged = (cycle.imaged || 0) + 1;
  cycle.lastId = id;
  cycle.lastRunAt = ts;
  cycle.writer = 'cursor';
  await s.setJSON(CYCLE_KEY, cycle);

  const sectionBit = sections.length ? sections.slice(0, 4).join(', ') : 'flagged sections';
  const fromDrip = String((critique && critique.source) || '') === 'drip-audit';
  const subject = (
    'PULSE ' +
    id +
    ': ' +
    (fromDrip ? 'drip audit · ' : '') +
    'fact-check ' +
    sectionBit +
    ' · rewrote body with Cursor · 1 Pexels image replaced'
  ).slice(0, 180);

  const html =
    '<p><b>What Cursor did on <code>' +
    esc(id) +
    '</code></b></p>' +
    (fromDrip
      ? '<p><b>Drip audit:</b> this URL came from the always-on newly-fixed monitor.</p>'
      : '<p><b>Drip audit:</b> included in the continuous fixed-URL audit drop.</p>') +
    '<p><a href="' +
    esc(url) +
    '">' +
    esc(url) +
    '</a></p>' +
    '<p><b>Question:</b> ' +
    esc(String(question).slice(0, 200)) +
    '</p>' +
    '<ol>' +
    '<li><b>Fact-check / drip audit:</b> ' +
    esc(sectionBit) +
    (issues.length ? ' — ' + issues.length + ' issue(s)' : '') +
    '.</li>' +
    '<li><b>Content:</b> rewrote/corrected with <b>Cursor</b> (not DeepSeek). Visual-lock preserved image slots, then cover swapped.</li>' +
    '<li><b>Images:</b> replaced <b>1</b> image via <b>Pexels</b> — search: <code>' +
    esc(query) +
    '</code> → <code>' +
    esc(rel) +
    '</code>.</li>' +
    '</ol>' +
    (issues.length
      ? '<p><b>Drip audit / fact-check findings:</b></p><ul>' +
        issues
          .slice(0, 8)
          .map((x) => '<li>' + esc(String(x).slice(0, 220)) + '</li>')
          .join('') +
        '</ul>'
      : '');

  await emailOne(subject, html);
  console.log(JSON.stringify({ ok: true, id, writer: 'cursor', actions, sections }));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
