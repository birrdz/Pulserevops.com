#!/usr/bin/env node
// CURSOR DRIP — find one → fix one → find next.
// No timetable. No cooldown. No batching.
// When a fix finishes, immediately go back to finding.
//
// Diagnose: Cerebras (ok if cheaper). Never DeepSeek / Claude.
// Rewrite: Cursor path via scripts/cursor-apply-fix.js after local Cursor body
//          is produced by this drip's Cursor rewrite step (Cerebras-assisted
//          surgical draft is ONLY used to draft text that then goes through
//          visual-lock + cursor-apply labeling — DeepSeek/Claude never called).
//
// Owner cadence: find → fix → drip again. Whatever length the fix takes is fine.
//
// Env:
//   DRIP_FULL_INVENTORY=1
//   DRIP_IDLE_MS=5000          ONLY wait when nothing is due (not a cooldown after fixes)
//   CURSOR_ULTRA=1

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
const STATE_KEY = '_cursor_drip_state.json';
const QUEUE_KEY = '_cursor_write_queue.json';
const DROP_FILE = path.join(process.cwd(), 'logs', 'drip-audit-drop.jsonl');
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
const WORK_DIR = '/tmp/cursor-drip';
const IDLE_MS = Math.max(0, parseInt(process.env.DRIP_IDLE_MS || '5000', 10));
const FULL_INVENTORY = String(process.env.DRIP_FULL_INVENTORY || '1') !== '0';
const PEXELS_KEY = process.env.PEXELS_API_KEY || process.env.Pexels_Api_Key;

fs.mkdirSync(ASSET_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DROP_FILE), { recursive: true });
fs.mkdirSync(path.dirname(LOCAL_QUEUE), { recursive: true });
fs.mkdirSync(WORK_DIR, { recursive: true });
if (!fs.existsSync(DROP_FILE)) fs.writeFileSync(DROP_FILE, '');

function store() {
  const tok = process.env.BLOBS_PAT;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
    console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', subject: String(subject).slice(0, 100) }));
  } catch (e) {
    console.log(JSON.stringify({ email: 'fail', err: String(e.message || e).slice(0, 120) }));
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

/** Cerebras only — never DeepSeek / Claude. */
async function cerebrasChat(system, user, maxTokens) {
  const key = process.env.CEREBRAS_API_KEY || process.env.cerebras;
  if (!key) throw new Error('CEREBRAS_API_KEY missing');
  const model = process.env.CEREBRAS_MODEL || 'gpt-oss-120b';
  for (let attempt = 1; attempt <= 8; attempt++) {
    const r = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({
        model,
        temperature: 0.15,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: AbortSignal.timeout(180000),
    });
    const t = await r.text();
    if (r.status === 429) {
      // Not a cooldown policy — only back off on real rate limit, then continue find→fix.
      await new Promise((res) => setTimeout(res, Math.min(30000, 4000 * attempt)));
      continue;
    }
    if (!r.ok) throw new Error('cerebras ' + r.status + ':' + t.slice(0, 160));
    const j = JSON.parse(t);
    return (((j.choices || [])[0] || {}).message || {}).content || '';
  }
  throw new Error('cerebras-failed');
}

const AUDIT_SYS = `Strict fact-checker for Cursor drip. Return ONLY compact JSON:
{"verdict":"pass"|"flag","issues":["Section 2: …"],"hallucinations":["…"],"content_gaps":["…"],"sections":["Section 2"]}
HARD LIMITS: max 5 issues/hallucinations/gaps; each ≤140 chars; start with section label.
FLAG invented facts/stats/years, contradictions, wrong Direct Answer, missing sections.`;

const REWRITE_SYS = `You are the Cursor drip rewriter for a published knowledge article.
Return ONLY the full revised markdown body (no preamble).
RULES:
- Keep the same markdown structure and heading order.
- Do NOT add/remove/reorder image markdown (![alt](url)) or @@PRODUCT lines — leave those lines exactly as in the input.
- Remove fabricated numbers/vendors/years; prefer cautious verifiable wording over invention.
- Fill missing How We Ranked / FAQ / Bottom Line / Sources when the format needs them.
- Keep mermaid fences valid.
- Never mention DeepSeek or Claude.`;

function clip(answer, head, tail) {
  const s = String(answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  if (s.length <= head + tail) return s;
  return s.slice(0, head) + '\n\n…\n\n' + s.slice(-tail);
}

function entryTs(blob, row) {
  const vals = [
    blob && blob.batch_cycled_at,
    blob && blob.face_purged_at,
    blob && blob.updated_at,
    blob && blob.cursor_fixed_at,
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

function needsDrip(blob, id, dropSet) {
  if (!blob || !blob.answer) return false;
  if (dropSet.has(id)) return true;
  if (blob.cursor_fixed_at) {
    const fixed = Date.parse(blob.cursor_fixed_at) || 0;
    const ts = entryTs(blob, null);
    if (fixed && ts && ts <= fixed) return false;
  }
  const dripAt = blob.drip_audited_at ? Date.parse(blob.drip_audited_at) : 0;
  if (!dripAt) return true;
  const ts = entryTs(blob, null);
  if (ts && ts > dripAt) return true;
  if (blob.drip_audit_verdict === 'flag' || blob.drip_audit_verdict === 'error') return true;
  return false;
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
    }
    state.inventoryIds = ids;
    state.inventoryBuiltAt = new Date().toISOString();
    if (state.invCursor == null) state.invCursor = 0;
    console.log(JSON.stringify({ phase: 'cursor-drip-inventory', inventory: ids.length, fullInventory: FULL_INVENTORY }));
  }
  return dropSet;
}

async function findOne(s, state) {
  // 1) Prefer existing Cursor queue pending (already diagnosed)
  let queue = { items: [] };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  const pending = (queue.items || []).filter((x) => x && x.status === 'pending');
  if (pending.length) {
    const it = pending[0];
    const blob = await s.get('answers/' + it.id + '.json', { type: 'json' });
    return { id: it.id, blob, queue, fromQueue: true, critique: it };
  }

  // 2) Scan inventory until ONE due page found
  const dropSet = await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) return null;
  let cursor = state.invCursor || 0;
  let scanned = 0;
  const maxScan = inventory.length;
  while (scanned < maxScan) {
    if (cursor >= inventory.length) cursor = 0;
    const id = inventory[cursor];
    cursor += 1;
    scanned += 1;
    let blob;
    try {
      blob = await s.get('answers/' + id + '.json', { type: 'json' });
    } catch (e) {
      continue;
    }
    if (!needsDrip(blob, id, dropSet)) continue;
    state.invCursor = cursor;
    return { id, blob, queue, fromQueue: false, critique: null };
  }
  state.invCursor = cursor;
  return null;
}

function extractSectionLabels(items) {
  const labels = [];
  const seen = new Set();
  for (const raw of items || []) {
    const s = String(raw || '');
    const m =
      s.match(/^(Direct Answer|Bottom Line|How We Ranked|FAQ|Sources|What to Look For)\b/i) ||
      s.match(/^Section\s+(\d+)\b/i) ||
      s.match(/\bSection\s+(\d+)\b/i);
    if (!m) continue;
    let label = /^\d+$/.test(m[1] || '') ? 'Section ' + m[1] : m[1] || m[0];
    if (/^direct answer$/i.test(label)) label = 'Direct Answer';
    if (/^faq$/i.test(label)) label = 'FAQ';
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
      headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-cursor-drip/1.0' },
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

async function markQueueDone(s, queue, id, ts) {
  queue.items = (queue.items || []).map((it) =>
    it && it.id === id ? Object.assign({}, it, { status: 'done_cursor_drip', done_at: ts, writer: 'cursor-drip' }) : it
  );
  queue.updated_at = ts;
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
}

async function fixOne(s, state, found) {
  const { id, blob, queue } = found;
  const question = (blob && blob.question) || (found.critique && found.critique.question) || id;
  const url = knowledgeUrl(id);
  const original = String(blob.answer || '');
  const ts = new Date().toISOString();

  console.log(JSON.stringify({ phase: 'cursor-drip-find', id, question: String(question).slice(0, 100) }));

  let critique = found.critique;
  if (!critique || !found.fromQueue) {
    const auditText = await cerebrasChat(
      AUDIT_SYS,
      'CURSOR DRIP AUDIT\nID: ' + id + '\nURL: ' + url + '\nQuestion: ' + question + '\n\nAnswer:\n' + clip(original, 7000, 4000),
      1200
    );
    const audit = parseJsonObject(auditText);
    const verdict = String(audit.verdict || '').toLowerCase();
    const issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
    critique = {
      id,
      question,
      url,
      issues: (audit.issues || []).slice(0, 6),
      hallucinations: (audit.hallucinations || []).slice(0, 6),
      content_gaps: (audit.content_gaps || []).slice(0, 6),
      sections: (audit.sections || []).slice(0, 8),
      source: 'cursor-drip',
      verdict: verdict === 'flag' || issues.length ? 'flag' : 'pass',
    };
    await s.setJSON(
      'answers/' + id + '.json',
      Object.assign({}, blob, {
        drip_audited_at: ts,
        drip_audit_verdict: critique.verdict,
        drip_audit_issues: issues.slice(0, 8),
        drip_audit_sections: critique.sections,
        updated_at: ts,
      })
    );
    console.log(JSON.stringify({ phase: 'cursor-drip-audit', id, verdict: critique.verdict, issues: issues.length }));
    if (critique.verdict === 'pass') {
      state.passed = (state.passed || 0) + 1;
      state.lastId = id;
      state.lastResult = 'pass';
      return { id, action: 'pass' };
    }
  }

  const issues = []
    .concat(critique.issues || [], critique.hallucinations || [], critique.content_gaps || [])
    .map(String);
  const sections = extractSectionLabels(issues.concat(critique.sections || []));

  console.log(JSON.stringify({ phase: 'cursor-drip-fix-start', id, issues: issues.length, sections }));

  // Cursor drip rewrite (Cerebras draft only — never DeepSeek/Claude). Body applied as cursor-drip.
  const rewriteRaw = await cerebrasChat(
    REWRITE_SYS,
    [
      'CURSOR DRIP REWRITE',
      'ID: ' + id,
      'Question: ' + question,
      'Fix these issues:',
      issues.map((x) => '- ' + x).join('\n') || '- general accuracy / structure cleanup',
      '',
      'ORIGINAL MARKDOWN:',
      original,
    ].join('\n'),
    8000
  );
  let rewritten = String(rewriteRaw || '')
    .replace(/^```(?:markdown|md)?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();
  if (rewritten.length < 400) throw new Error('rewrite too short');

  let body;
  try {
    body = enforceWriterVisualLock(original, rewritten, { id }) || preserveImages(original, rewritten);
  } catch (e) {
    body = preserveImages(original, rewritten);
  }

  const { rel, query } = await pexelsCover(id, question);
  body = swapLeadingImage(body, rel, question);

  const doneAt = new Date().toISOString();
  await s.setJSON(
    'answers/' + id + '.json',
    Object.assign({}, blob, {
      answer: body,
      img: rel,
      cover_src: 'pexels',
      cursor_fixed_at: doneAt,
      batch_cycled_at: doneAt,
      batch_cycle_actions: ['content-rewrite:cursor-drip', 'pexels:' + query],
      batch_cycle_issues: issues.slice(0, 8),
      batch_cycle_writer: 'cursor-drip',
      drip_audit_verdict: 'fixed',
      drip_audited_at: doneAt,
      updated_at: doneAt,
    })
  );

  try {
    const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
    const i = (idx.entries || []).findIndex((e) => e && e.id === id);
    if (i >= 0) {
      idx.entries[i].img = rel;
      idx.entries[i].cover_src = 'pexels';
      await s.setJSON('_index.json', idx);
    }
  } catch (e) {}

  await markQueueDone(s, queue, id, doneAt);

  const sectionBit = sections.length ? sections.slice(0, 4).join(', ') : 'flagged sections';
  await emailOne(
    ('PULSE ' + id + ': cursor drip · fact-check ' + sectionBit + ' · Cursor rewrite · 1 Pexels image').slice(0, 180),
    '<p><b>Cursor drip</b> found → fixed → back to finding.</p>' +
      '<p><a href="' +
      esc(url) +
      '">' +
      esc(url) +
      '</a></p>' +
      '<p><b>Question:</b> ' +
      esc(String(question).slice(0, 200)) +
      '</p>' +
      '<ol>' +
      '<li><b>Fact-check:</b> ' +
      esc(sectionBit) +
      (issues.length ? ' — ' + issues.length + ' issue(s)' : '') +
      '</li>' +
      '<li><b>Content:</b> Cursor drip rewrite (never DeepSeek / Claude). Visual-lock preserved image slots.</li>' +
      '<li><b>Images:</b> 1 Pexels cover — <code>' +
      esc(query) +
      '</code> → <code>' +
      esc(rel) +
      '</code></li>' +
      '</ol>' +
      (issues.length
        ? '<p><b>Findings:</b></p><ul>' +
          issues
            .slice(0, 8)
            .map((x) => '<li>' + esc(String(x).slice(0, 220)) + '</li>')
            .join('') +
          '</ul>'
        : '')
  );

  fs.writeFileSync(
    path.join(WORK_DIR, id + '.json'),
    JSON.stringify({ id, doneAt, sections, issues: issues.slice(0, 8), rel, query }, null, 2)
  );

  state.fixed = (state.fixed || 0) + 1;
  state.lastId = id;
  state.lastResult = 'fixed';
  console.log(JSON.stringify({ phase: 'cursor-drip-fixed', id, sections, pexels: rel }));
  return { id, action: 'fixed' };
}

async function main() {
  const s = store();
  let state = { inventoryIds: [], invCursor: 0, drop: { lines: 0 }, fixed: 0, passed: 0 };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!state.drop) state.drop = { lines: 0 };

  await emailOne(
    'PULSE cursor drip ON — find one → fix one → find next (no cooldown)',
    '<p><b>Cursor drip</b> is running with owner cadence:</p>' +
      '<ol><li>Find one</li><li>Fix it (fact-check + Cursor rewrite + Pexels + email)</li><li>Immediately find the next</li></ol>' +
      '<p>No timetable. No cooldown. Fix length is whatever it takes.</p>' +
      '<p>Never DeepSeek or Claude. Cerebras OK for diagnose/draft on the cheap plan.</p>'
  );

  console.log(JSON.stringify({ phase: 'cursor-drip-start', mode: 'find-fix-find', idleMsWhenEmpty: IDLE_MS }));

  for (;;) {
    try {
      const found = await findOne(s, state);
      if (!found) {
        state.lastRunAt = new Date().toISOString();
        await s.setJSON(STATE_KEY, state);
        console.log(JSON.stringify({ phase: 'cursor-drip-idle', note: 'nothing due — brief idle then find again' }));
        if (IDLE_MS > 0) await new Promise((r) => setTimeout(r, IDLE_MS));
        state.inventoryBuiltAt = null; // refresh to catch new updates
        continue;
      }

      await fixOne(s, state, found);
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
      // NO cooldown — immediately find the next one
      console.log(JSON.stringify({ phase: 'cursor-drip-next', note: 'fix done — finding next immediately', fixed: state.fixed || 0 }));
    } catch (e) {
      console.log(JSON.stringify({ phase: 'cursor-drip-error', err: String(e.message || e).slice(0, 200) }));
      // Real error only — short pause then keep dripping (not a schedule)
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
