#!/usr/bin/env node
// CURSOR DRIP — find one → fix one → find next.
// No timetable. No cooldown. No batching.
//
// OWNER ORDER PER URL (exact):
//   1) PURGE white / blank / mangled / broken image slots
//   2) FACT-CHECK (Cerebras OK if cheaper; never DeepSeek / Claude)
//   3) FIX CONTENT from fact-check (Cursor drip rewrite; never DeepSeek / Claude)
//   3b) FIX mangled / broken mermaid diagrams anywhere in the body
//   4) FIX IMAGES throughout the URL against the FINAL (post-rewrite) topic:
//      if fact-check replaced content, new images MUST match the NEW topic/sections
//      (Pexels cover + repairBrokenQaImages / fillEntryMissingImages, relevance-gated)
//
// Then immediately find the next URL.
//
// Env:
//   DRIP_FULL_INVENTORY=1
//   DRIP_IDLE_MS=5000   ONLY when nothing due
//   CURSOR_ULTRA=1 ULTRA_PLAN=1 PEXELS_ALLOW_FAST=1
//   PEXELS_PACE_MS=0    zero artificial wait; still one Pexels call at a time

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { preserveImages, enforceWriterVisualLock } = require('../_visual_lock_law');
const { pexelsRequest } = require('../netlify/functions/lib/pexels-throttle');
const { deriveImageSearchQuery } = require('../netlify/functions/lib/derive-image-search-query');
const { extractCoreTerms, gatePexels, simplifyQuery } = require('../netlify/functions/lib/image-relevance-gate');
const { sanitizeMermaid } = require('../_mermaid_sanitize');

let storeGradedImage, repairBrokenQaImages, fillEntryMissingImages;
try {
  ({ storeGradedImage, repairBrokenQaImages, fillEntryMissingImages } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ fatal: 'ddg_facecard: ' + e.message }));
  process.exit(1);
}

const MERMAID_DIRECTIVES = [
  'graph',
  'flowchart',
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'erDiagram',
  'gantt',
  'pie',
  'journey',
  'mindmap',
  'timeline',
  'gitGraph',
  'quadrantChart',
];

/** Deterministic mermaid fence fixes (]] bugs, BOM, sanitize <>, etc.). */
function fixMermaidDeterministic(answer) {
  if (typeof answer !== 'string' || answer.indexOf('```mermaid') < 0) {
    return { answer, changed: false, issues: [] };
  }
  const issues = [];
  let s = answer;
  // Unclosed fence at EOF — close it
  const opens = (s.match(/```mermaid/gi) || []).length;
  const closes = (s.match(/```/g) || []).length;
  if (opens > 0 && closes < opens * 2) {
    // rough: if last mermaid open has no closing fence after it
    const lastOpen = s.toLowerCase().lastIndexOf('```mermaid');
    const after = s.slice(lastOpen + 10);
    if (!/```/.test(after)) {
      s = s.replace(/\s*$/, '\n```\n');
      issues.push('unclosed-fence');
    }
  }
  s = s.replace(/```mermaid([\s\S]*?)```/g, (whole, inner) => {
    let body = inner;
    const before = body;
    body = body.replace(/\]\](\s*(?:-->|---|--|==>|==|\||$))/gm, ']$1');
    body = body.replace(/\]\](\s*\n)/g, ']$1');
    body = body.replace(/\["\s+/g, '["').replace(/\s+"\]/g, '"]');
    body = body.replace(/[​-‏﻿­]/g, '');
    body = body.replace(/-->\|([^|\n]+)\|>/g, '-->|$1|');
    if (body !== before) issues.push('syntax-normalize');
    const first = (body.trim().split('\n')[0] || '').trim();
    if (!MERMAID_DIRECTIVES.some((d) => first.toLowerCase().startsWith(d.toLowerCase()))) {
      issues.push('bad-directive:' + first.slice(0, 40));
    }
    const counts = { '[': 0, ']': 0, '(': 0, ')': 0, '{': 0, '}': 0 };
    for (const c of body) if (c in counts) counts[c]++;
    if (counts['['] !== counts[']']) issues.push('unbalanced-brackets');
    if (counts['('] !== counts[')']) issues.push('unbalanced-parens');
    return '```mermaid' + body + '```';
  });
  s = sanitizeMermaid(s);
  return { answer: s, changed: s !== answer, issues: [...new Set(issues)] };
}

function looksValidMermaidInner(inner) {
  if (!inner || String(inner).trim().length < 8) return false;
  const first = String(inner).trim().split('\n')[0].trim();
  if (!MERMAID_DIRECTIVES.some((d) => first.toLowerCase().startsWith(d.toLowerCase()))) return false;
  const counts = { '[': 0, ']': 0 };
  for (const c of inner) if (c in counts) counts[c]++;
  if (counts['['] !== counts[']']) return false;
  if (!/-->|---|->>/.test(inner) && !/^pie\b/i.test(first)) return false;
  return true;
}

/** Rebuild a broken mermaid from the FINAL question/topic (Cerebras — never Claude). */
async function regenerateMermaid(question, id, brokenInner, why) {
  const text = await cerebrasChat(
    `Return ONLY one valid fenced mermaid block for a knowledge article.
Rules: start with flowchart TD (or LR); 4-10 nodes; quoted labels A["Label"]; balanced brackets; no < > in labels; no explanation.`,
    [
      'Rebuild mangled/broken mermaid for Cursor drip.',
      'ID: ' + id,
      'Topic/question: ' + question,
      'Why broken: ' + (why || []).join(', '),
      'Broken inner (may be junk):',
      String(brokenInner || '').slice(0, 1200),
      '',
      'Return ONLY:',
      '```mermaid',
      'flowchart TD',
      '  ...',
      '```',
    ].join('\n'),
    800
  );
  const m = String(text || '').match(/```mermaid\s*([\s\S]*?)```/i);
  if (!m) return null;
  let inner = m[1].trim();
  inner = sanitizeMermaid('```mermaid\n' + inner + '\n```').replace(/^```mermaid\s*/i, '').replace(/```$/, '').trim();
  if (!looksValidMermaidInner(inner)) return null;
  return inner;
}

function buildSectionTitleLookup(body) {
  const lookup = {};
  const lines = String(body || '').split('\n');
  for (const line of lines) {
    const m = line.match(/^#{2,3}\s+(.+)/);
    if (!m) continue;
    const title = m[1].replace(/[\[\]"#]/g, '').trim().slice(0, 120);
    if (title) lookup[title.toLowerCase()] = title;
  }
  return lookup;
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

const MANGLED_RX =
  /(?:%2C%20|,)\s*realistic\s+magazine\s+style|nologo=true|model=flux|image\.pollinations\.ai|no%20watermark\?width=|prompt\/[^)\s]*no%20text/i;

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

function absUrl(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  if (u[0] === '/') return SITE + u;
  return '';
}

function normUrl(u) {
  return String(u || '')
    .replace(/\?.*$/, '')
    .trim();
}

function isMangled(u) {
  return MANGLED_RX.test(String(u || ''));
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

function extractImageUrls(answer, cover) {
  const urls = [];
  if (cover) urls.push(String(cover));
  const lines = String(answer || '').split('\n');
  for (const line of lines) {
    let m = line.match(/!\[[^\]]*\]\((https?:\/\/[^\s]+|\/assets\/[^\s)]+)\)/i);
    if (!m) m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
    if (m) urls.push(m[1]);
    if (isMangled(line)) {
      const m2 = line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m2) urls.push(m2[1]);
    }
    const pm = line.match(/@@PRODUCT[^]*?\bimg="([^"]+)"/i);
    if (pm) urls.push(pm[1]);
  }
  return [...new Set(urls.filter(Boolean))];
}

/** Classify: mangled | white | defunct | ok | empty */
async function classifyImage(url) {
  if (!url) return { kind: 'empty', url };
  if (isMangled(url)) return { kind: 'mangled', url };
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) return { kind: 'ok', url, skipPurge: true };
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty', url };
  try {
    const r = await fetch(abs, {
      headers: { 'User-Agent': 'PulseCursorDrip/1.0', Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) return { kind: 'defunct', status: r.status, url: abs };
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const buf = Buffer.from(await r.arrayBuffer());
    if (!ct.startsWith('image/') || buf.length < 1200) {
      return { kind: 'defunct', url: abs, reason: 'not-image-or-tiny', bytes: buf.length };
    }
    let white = false;
    let mean = null;
    let whitePct = null;
    try {
      const sharp = require('sharp');
      const { data, info } = await sharp(buf)
        .resize(96, 96, { fit: 'inside' })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const n = info.width * info.height;
      let sum = 0;
      let w = 0;
      for (let i = 0; i < data.length; i += 3) {
        const m = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += m;
        if (m >= 245) w++;
      }
      mean = sum / n;
      whitePct = w / n;
      white = (mean >= 235 && whitePct >= 0.9) || whitePct >= 0.95;
    } catch (e) {
      const ff = buf.filter((b) => b >= 0xf0).length / buf.length;
      if (buf.length < 8000 && ff > 0.55) white = true;
    }
    if (white) return { kind: 'white', url: abs, mean, whitePct, bytes: buf.length };
    return { kind: 'ok', url: abs, bytes: buf.length, mean, whitePct };
  } catch (e) {
    return { kind: 'defunct', url: abs, reason: String(e.message || e).slice(0, 80) };
  }
}

function stripBadFromBody(body, badUrls) {
  const ban = new Set((badUrls || []).map((u) => normUrl(u)));
  const lines = String(body || '').split('\n');
  const out = [];
  const removed = [];
  for (let line of lines) {
    const isImgLine = /!\[[^\]]*\]\(/i.test(line);
    const isProd = /@@PRODUCT/i.test(line) && /img="/i.test(line);
    if (isImgLine) {
      if (isMangled(line)) {
        removed.push(line.slice(0, 120));
        continue;
      }
      const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/) || line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m) {
        const u = normUrl(m[1]);
        const rel = u.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
        if (ban.has(u) || ban.has(rel) || [...ban].some((x) => x && (u.includes(x) || line.includes(x)))) {
          removed.push(m[1].slice(0, 200));
          continue;
        }
      }
    }
    if (isProd) {
      if (isMangled(line)) {
        line = line.replace(/\s*img="[^"]*"/i, '');
        removed.push('@@PRODUCT mangled img');
      } else {
        for (const bad of ban) {
          if (bad && line.includes(bad)) {
            line = line.replace(/\s*img="[^"]*"/i, '');
            removed.push(bad.slice(0, 120));
            break;
          }
        }
      }
    }
    out.push(line);
  }
  return { answer: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed };
}

/** Quick signal that a page likely needs image purge (no network). */
function quickNeedsImagePurge(blob) {
  if (!blob || !blob.answer) return false;
  const ans = String(blob.answer);
  const cover = blob.img || '';
  if (isMangled(ans) || isMangled(cover)) return true;
  if (!cover && !/!\[[^\]]*\]\(/i.test(ans)) return true;
  if (/placeholder\.svg|pollinations\.ai|nologo=true|model=flux/i.test(ans + cover)) return true;
  if (blob.drip_audit_verdict === 'flag' && /white|blank|mangled|broken image/i.test(JSON.stringify(blob.drip_audit_issues || [])))
    return true;
  return false;
}

async function auditImagesOnPage(blob, id) {
  const cover = blob.img || '';
  const urls = extractImageUrls(blob.answer, cover).slice(0, 12);
  const bad = [];
  const reasons = [];
  for (const u of urls) {
    const cls = await classifyImage(u);
    if (cls.kind === 'white' || cls.kind === 'mangled' || cls.kind === 'defunct') {
      bad.push(u);
      reasons.push(cls.kind + ':' + String(u).slice(0, 80));
    }
  }
  return { bad, reasons, hasBad: bad.length > 0 };
}

function needsDrip(blob, id, dropSet) {
  if (!blob || !blob.answer) return false;
  if (dropSet.has(id)) return true;
  if (quickNeedsImagePurge(blob)) return true;
  if (blob.cursor_fixed_at) {
    const fixed = Date.parse(blob.cursor_fixed_at) || 0;
    const ts = entryTs(blob, null);
    if (fixed && ts && ts <= fixed && !quickNeedsImagePurge(blob)) return false;
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

/**
 * Find one URL. Prefer pages that need white/mangled image purge first,
 * then queue pending, then general due pages.
 */
async function findOne(s, state) {
  let queue = { items: [] };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  const dropSet = await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) return null;

  // PASS A — prioritize white/mangled/broken image candidates (quick local signal)
  let cursor = state.imgCursor != null ? state.imgCursor : 0;
  let scanned = 0;
  const maxScan = Math.min(inventory.length, 400);
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
    if (!blob || !blob.answer) continue;
    if (!quickNeedsImagePurge(blob) && !dropSet.has(id)) continue;
    // Confirm with classify (cover + body) — only claim if truly bad
    const imgAudit = await auditImagesOnPage(blob, id);
    if (!imgAudit.hasBad && !dropSet.has(id) && !isMangled(blob.answer || '')) {
      continue;
    }
    state.imgCursor = cursor;
    return { id, blob, queue, priority: 'image-purge', imgAudit };
  }
  state.imgCursor = cursor;

  // PASS B — existing Cursor queue pending
  const pending = (queue.items || []).filter((x) => x && x.status === 'pending');
  if (pending.length) {
    const it = pending[0];
    const blob = await s.get('answers/' + it.id + '.json', { type: 'json' });
    return { id: it.id, blob, queue, fromQueue: true, critique: it, priority: 'queue' };
  }

  // PASS C — general content due
  cursor = state.invCursor || 0;
  scanned = 0;
  while (scanned < inventory.length) {
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
    return { id, blob, queue, priority: 'content', critique: null };
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

async function pexelsSearchApplicable(title, id) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing');
  const query = deriveImageSearchQuery(title || id);
  const core = extractCoreTerms(query);
  const tryQueries = [query, simplifyQuery(query)].filter((q, i, a) => q && a.indexOf(q) === i);

  for (const q of tryQueries) {
    const url =
      'https://api.pexels.com/v1/search?per_page=12&orientation=landscape&query=' + encodeURIComponent(q);
    const r = await pexelsRequest(async () => {
      const res = await fetch(url, {
        headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-cursor-drip/1.0' },
        signal: AbortSignal.timeout(30000),
      });
      return { status: res.status, body: Buffer.from(await res.arrayBuffer()) };
    });
    if (r.status !== 200) continue;
    const data = JSON.parse(r.body.toString('utf8'));
    const photos = data.photos || [];
    const gated = gatePexels(core, data.total_results || photos.length, photos);
    let pool = gated.pass ? gated.passers : photos;
    pool = pool.filter((p) => p && p.width >= 1200 && p.width >= p.height);
    if (!pool.length) pool = gated.pass ? gated.passers : photos;
    if (!pool.length) continue;
    pool.sort((a, b) => b.width * b.height - a.width * a.height);
    const p = pool[0];
    const src = p && p.src && (p.src.large2x || p.src.large || p.src.original);
    if (!src) continue;
    const dl = await fetch(src, { signal: AbortSignal.timeout(45000) });
    if (!dl.ok) continue;
    const buf = Buffer.from(await dl.arrayBuffer());
    const dest = path.join(ASSET_DIR, id + '.jpg');
    await storeGradedImage(buf, dest, {
      square: 760,
      faceCard: true,
      cropPosition: 'attention',
      bright: false,
    });
    return {
      rel: '/assets/qa/' + id + '.jpg',
      query: q,
      gated: !!gated.pass,
      alt: (p.alt || '').slice(0, 120),
    };
  }
  throw new Error('pexels applicable miss');
}

function swapLeadingImage(answer, rel, title) {
  const ans = String(answer || '');
  const alt = String(title || 'cover').replace(/[\[\]"]/g, '').slice(0, 80);
  if (/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/.test(ans)) {
    return '![' + alt + '](' + rel + ')\n\n' + ans.replace(/^﻿?\s*!\[[^\]]*\]\([^)]*\)\s*\n*/, '');
  }
  return '![' + alt + '](' + rel + ')\n\n' + ans;
}

async function markQueueDone(s, queue, id, ts) {
  queue.items = (queue.items || []).map((it) =>
    it && it.id === id ? Object.assign({}, it, { status: 'done_cursor_drip', done_at: ts, writer: 'cursor-drip' }) : it
  );
  queue.updated_at = ts;
  await s.setJSON(QUEUE_KEY, queue);
  fs.writeFileSync(LOCAL_QUEUE, JSON.stringify(queue, null, 2));
}

/**
 * OWNER ORDER:
 * 1 purge white/mangled/broken
 * 2 fact-check
 * 3 content rewrite
 * 4 applicable/intact images throughout URL
 */
async function fixOne(s, state, found) {
  const { id, blob, queue } = found;
  const question = (blob && blob.question) || (found.critique && found.critique.question) || id;
  const url = knowledgeUrl(id);
  let body = String(blob.answer || '');
  const actions = [];
  const stepNotes = [];
  let issues = [];
  let sections = [];

  console.log(
    JSON.stringify({
      phase: 'cursor-drip-find',
      id,
      priority: found.priority || 'content',
      question: String(question).slice(0, 100),
    })
  );

  // ─── STEP 1: PURGE white / blank / mangled / broken ───
  console.log(JSON.stringify({ phase: 'step1-purge-images', id }));
  let imgAudit = found.imgAudit || (await auditImagesOnPage(blob, id));
  if (imgAudit.hasBad || isMangled(body)) {
    const { answer: cleaned, removed } = stripBadFromBody(body, imgAudit.bad || []);
    body = cleaned;
    const banned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls.slice() : [];
    for (const u of removed.concat(imgAudit.bad || [])) {
      const n = normUrl(u);
      if (n && !banned.includes(n)) banned.push(n);
    }
    blob.purged_image_urls = banned;
    blob.face_purged_at = new Date().toISOString();
    blob.face_purge_reason = (imgAudit.reasons || []).slice(0, 6).join(',') || 'white-mangled-broken';
    actions.push('purge-white-mangled:' + (removed.length || imgAudit.bad.length));
    stepNotes.push(
      'Purged white/blank/mangled/broken slots (' + (removed.length || imgAudit.bad.length) + ')'
    );
    console.log(
      JSON.stringify({
        phase: 'step1-purged',
        id,
        removed: (removed.length || imgAudit.bad.length),
        reasons: (imgAudit.reasons || []).slice(0, 4),
      })
    );
  } else {
    stepNotes.push('No white/mangled/broken slots to purge');
    console.log(JSON.stringify({ phase: 'step1-clean', id }));
  }

  // ─── STEP 2: FACT-CHECK (non-fatal — purge must still land) ───
  console.log(JSON.stringify({ phase: 'step2-factcheck', id }));
  let critique = found.critique;
  try {
    if (!critique || !found.fromQueue) {
      const auditText = await cerebrasChat(
        AUDIT_SYS,
        'CURSOR DRIP AUDIT\nID: ' +
          id +
          '\nURL: ' +
          url +
          '\nQuestion: ' +
          question +
          '\n\nAnswer:\n' +
          clip(body, 7000, 4000),
        1200
      );
      const audit = parseJsonObject(auditText);
      const verdict = String(audit.verdict || '').toLowerCase();
      issues = [].concat(audit.issues || [], audit.hallucinations || [], audit.content_gaps || []);
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
    } else {
      issues = []
        .concat(critique.issues || [], critique.hallucinations || [], critique.content_gaps || [])
        .map(String);
    }
  } catch (e) {
    console.log(JSON.stringify({ phase: 'step2-audit-softfail', id, err: String(e.message || e).slice(0, 120) }));
    critique = {
      id,
      question,
      url,
      issues: ['Fact-check soft-fail — continue image/content path'],
      hallucinations: [],
      content_gaps: [],
      sections: [],
      source: 'cursor-drip',
      verdict: actions.some((a) => String(a).startsWith('purge-')) ? 'flag' : 'pass',
    };
    issues = critique.issues.slice();
    actions.push('factcheck:softfail');
    stepNotes.push('Fact-check soft-failed (' + String(e.message || e).slice(0, 60) + ') — continuing');
  }
  sections = extractSectionLabels(issues.concat((critique && critique.sections) || []));
  if (!actions.includes('factcheck:softfail')) {
    actions.push('factcheck:' + (critique.verdict || 'flag'));
    stepNotes.push(
      'Fact-check: ' +
        (critique.verdict || 'flag') +
        (issues.length ? ' — ' + issues.length + ' issue(s)' : ' — clean')
    );
  }
  console.log(
    JSON.stringify({ phase: 'step2-done', id, verdict: critique.verdict, issues: issues.length, sections })
  );

  // ─── STEP 3: CONTENT REWRITE (if flagged; soft-fail OK) ───
  // If content is replaced, Step 4 MUST image the NEW topic — not the old copy.
  let contentRewrote = false;
  if (critique.verdict === 'flag' || issues.length) {
    console.log(JSON.stringify({ phase: 'step3-content-rewrite', id }));
    try {
      const rewriteRaw = await cerebrasChat(
        REWRITE_SYS,
        [
          'CURSOR DRIP REWRITE',
          'ID: ' + id,
          'Question: ' + question,
          'Fix these issues:',
          issues.map((x) => '- ' + x).join('\n') || '- general accuracy / structure cleanup',
          '',
          'ORIGINAL MARKDOWN (image/@@PRODUCT lines must stay in place):',
          body,
        ].join('\n'),
        8000
      );
      let rewritten = String(rewriteRaw || '')
        .replace(/^```(?:markdown|md)?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();
      if (rewritten.length < 400) throw new Error('rewrite too short');
      try {
        body = enforceWriterVisualLock(body, rewritten, { id }) || preserveImages(body, rewritten);
      } catch (e) {
        body = preserveImages(body, rewritten);
      }
      contentRewrote = true;
      actions.push('content-rewrite:cursor-drip');
      stepNotes.push('Content rewritten from fact-check (Cursor drip; never DeepSeek/Claude)');
      console.log(JSON.stringify({ phase: 'step3-done', id, bodyLen: body.length }));
    } catch (e) {
      actions.push('content-rewrite:softfail');
      stepNotes.push('Content rewrite soft-failed — purge + image steps still apply');
      console.log(JSON.stringify({ phase: 'step3-softfail', id, err: String(e.message || e).slice(0, 120) }));
    }
  } else {
    stepNotes.push('Content OK — no rewrite');
    console.log(JSON.stringify({ phase: 'step3-skip', id }));
  }

  // ─── STEP 3b: MANGLED / BROKEN MERMAIDS (anywhere, including bottom) ───
  console.log(JSON.stringify({ phase: 'step3b-mermaid', id }));
  try {
    const det = fixMermaidDeterministic(body);
    body = det.answer;
    let mermaidFixed = det.changed ? 1 : 0;
    // Validate / regenerate each block against FINAL topic
    const blocks = [...String(body).matchAll(/```mermaid\s*([\s\S]*?)```/gi)];
    if (!blocks.length) {
      // Missing mermaid — add one for the final topic
      const inner = await regenerateMermaid(question, id, '', ['missing']);
      if (inner) {
        // Insert after Direct Answer or near top of body
        if (/##\s*Direct Answer/i.test(body)) {
          body = body.replace(
            /(##\s*Direct Answer[\s\S]*?\n)(?=\n##\s|\n@@PRODUCT|\n!\[[^\]]*\]\()/i,
            '$1\n```mermaid\n' + inner + '\n```\n\n'
          );
        } else {
          body = body + '\n\n```mermaid\n' + inner + '\n```\n';
        }
        mermaidFixed += 1;
        actions.push('mermaid:added');
        stepNotes.push('Added missing mermaid for final topic');
      }
    } else {
      for (let bi = 0; bi < blocks.length; bi++) {
        const inner = blocks[bi][1];
        if (looksValidMermaidInner(inner) && !(det.issues || []).some((x) => String(x).startsWith('bad-directive') || x === 'unbalanced-brackets')) {
          continue;
        }
        const why = (det.issues || []).concat(['lint-fail']);
        const rebuilt = await regenerateMermaid(question, id, inner, why);
        if (rebuilt) {
          // Replace only this occurrence (nth)
          let n = 0;
          body = body.replace(/```mermaid\s*[\s\S]*?```/gi, (full) => {
            const cur = n++;
            if (cur === bi) return '```mermaid\n' + rebuilt + '\n```';
            return full;
          });
          mermaidFixed += 1;
          actions.push('mermaid:regenerated');
          stepNotes.push('Rebuilt mangled/errored mermaid #' + (bi + 1) + ' for final topic');
        }
      }
    }
    if (det.changed && !actions.some((a) => String(a).startsWith('mermaid:'))) {
      actions.push('mermaid:sanitize');
      stepNotes.push('Sanitized mermaid syntax (mangled/errored fences)');
    }
    console.log(JSON.stringify({ phase: 'step3b-done', id, mermaidFixed, issues: (det.issues || []).slice(0, 4) }));
  } catch (e) {
    console.log(JSON.stringify({ phase: 'step3b-softfail', id, err: String(e.message || e).slice(0, 120) }));
    stepNotes.push('Mermaid fix soft-failed — continuing to images');
  }

  // ─── STEP 4: APPLICABLE IMAGES FOR THE FINAL (POST-REWRITE) TOPIC ───
  // If Step 3 replaced content, images are chosen against the NEW body/sections —
  // never leave an old off-topic image on newly written content.
  console.log(
    JSON.stringify({
      phase: 'step4-applicable-images',
      id,
      against: contentRewrote ? 'post-rewrite-topic' : 'current-topic',
    })
  );
  const finalTopic = question;
  const titleLookup = buildSectionTitleLookup(body);
  let coverRel = null;
  let coverQuery = null;
  try {
    const cover = await pexelsSearchApplicable(finalTopic, id);
    coverRel = cover.rel;
    coverQuery = cover.query;
    body = swapLeadingImage(body, coverRel, finalTopic);
    actions.push('pexels-cover:' + coverQuery + (cover.gated ? ':gated' : ':fallback'));
    stepNotes.push(
      'Cover applicable to ' +
        (contentRewrote ? 'NEW post-fact-check topic' : 'page topic') +
        ' via Pexels (' +
        coverQuery +
        (cover.gated ? ', relevance-gated' : '') +
        ')'
    );
  } catch (e) {
    stepNotes.push('Cover Pexels miss: ' + String(e.message || e).slice(0, 80));
    console.log(JSON.stringify({ phase: 'step4-cover-miss', id, err: String(e.message || e).slice(0, 100) }));
  }

  // After content rewrite: force-upgrade body slots so new/changed sections get
  // applicable images for THEIR headings (not leftover old-topic art).
  let repaired = 0;
  let filled = 0;
  try {
    const rr = await repairBrokenQaImages(id, finalTopic, body, {
      upgradeMode: true,
      alternateSources: true,
      allowTopicalReuse: true,
      titleLookup,
      quiet: true,
    });
    if (rr && rr.body) {
      body = rr.body;
      repaired = rr.fixed || 0;
      if (repaired) {
        actions.push('repairBrokenQaImages:' + repaired);
        stepNotes.push(
          'Replaced ' +
            repaired +
            ' broken/non-applicable body image(s) for ' +
            (contentRewrote ? 'NEW' : 'current') +
            ' section topics'
        );
      }
    }
  } catch (e) {
    console.log(JSON.stringify({ phase: 'step4-repair-err', id, err: String(e.message || e).slice(0, 100) }));
  }
  try {
    const fr = await fillEntryMissingImages(id, finalTopic, body, {
      upgradeMode: true,
      titleLookup,
      quiet: true,
    });
    if (fr && fr.body) {
      body = fr.body;
      filled = fr.fixed || 0;
      if (filled) {
        actions.push('fillEntryMissingImages:' + filled);
        stepNotes.push(
          'Filled ' +
            filled +
            ' missing/upgradable slot(s) with images applicable to ' +
            (contentRewrote ? 'rewritten' : 'existing') +
            ' sections'
        );
      }
    }
  } catch (e) {
    console.log(JSON.stringify({ phase: 'step4-fill-err', id, err: String(e.message || e).slice(0, 100) }));
  }
  console.log(
    JSON.stringify({
      phase: 'step4-done',
      id,
      cover: coverRel,
      repaired,
      filled,
      contentRewrote,
      sectionTopics: Object.keys(titleLookup).length,
    })
  );

  // ─── SAVE + ONE EMAIL ───
  const doneAt = new Date().toISOString();
  const nextBlob = Object.assign({}, blob, {
    answer: body,
    cursor_fixed_at: doneAt,
    batch_cycled_at: doneAt,
    batch_cycle_actions: actions,
    batch_cycle_issues: issues.slice(0, 8),
    batch_cycle_writer: 'cursor-drip',
    drip_audited_at: doneAt,
    drip_audit_verdict: critique.verdict === 'pass' && !issues.length ? 'pass' : 'fixed',
    drip_audit_issues: issues.slice(0, 8),
    drip_audit_sections: sections,
    updated_at: doneAt,
  });
  if (coverRel) {
    nextBlob.img = coverRel;
    nextBlob.cover_src = 'pexels';
  }
  await s.setJSON('answers/' + id + '.json', nextBlob);

  try {
    const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
    const i = (idx.entries || []).findIndex((e) => e && e.id === id);
    if (i >= 0 && coverRel) {
      idx.entries[i].img = coverRel;
      idx.entries[i].cover_src = 'pexels';
      await s.setJSON('_index.json', idx);
    }
  } catch (e) {}

  await markQueueDone(s, queue, id, doneAt);

  const sectionBit = sections.length ? sections.slice(0, 4).join(', ') : 'see findings';
  await emailOne(
    (
      'PULSE ' +
      id +
      ': cursor drip · purge images · fact-check ' +
      sectionBit +
      ' · content · applicable images'
    ).slice(0, 180),
    '<p><b>Cursor drip</b> finished one URL (then finds next immediately):</p>' +
      '<p><a href="' +
      esc(url) +
      '">' +
      esc(url) +
      '</a></p>' +
      '<p><b>Question:</b> ' +
      esc(String(question).slice(0, 200)) +
      '</p>' +
      '<ol>' +
      '<li><b>Purge</b> white/mangled/broken images</li>' +
      '<li><b>Fact-check</b> — ' +
      esc(sectionBit) +
      '</li>' +
      '<li><b>Content fix</b> from fact-check (Cursor drip; never DeepSeek/Claude)</li>' +
      '<li><b>Mermaid</b> — mangled/errored diagrams fixed for the final topic</li>' +
      '<li><b>Applicable images</b> chosen against the <b>' +
      (contentRewrote ? 'NEW post-rewrite' : 'current') +
      ' topic</b> — cover + body slots throughout the URL</li>' +
      '</ol>' +
      '<p><b>Steps:</b></p><ul>' +
      stepNotes.map((x) => '<li>' + esc(x) + '</li>').join('') +
      '</ul>' +
      (issues.length
        ? '<p><b>Fact-check findings:</b></p><ul>' +
          issues
            .slice(0, 8)
            .map((x) => '<li>' + esc(String(x).slice(0, 220)) + '</li>')
            .join('') +
          '</ul>'
        : '')
  );

  fs.writeFileSync(
    path.join(WORK_DIR, id + '.json'),
    JSON.stringify({ id, doneAt, actions, sections, issues: issues.slice(0, 8), coverRel, repaired, filled }, null, 2)
  );

  state.fixed = (state.fixed || 0) + 1;
  state.lastId = id;
  state.lastResult = 'fixed';
  console.log(JSON.stringify({ phase: 'cursor-drip-fixed', id, actions, sections }));
  return { id, action: 'fixed' };
}

async function main() {
  const s = store();
  let state = {
    inventoryIds: [],
    invCursor: 0,
    imgCursor: 0,
    drop: { lines: 0 },
    fixed: 0,
    passed: 0,
  };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  if (!state.drop) state.drop = { lines: 0 };

  await emailOne(
    'PULSE cursor drip ON — purge → fact-check → content → applicable images',
    '<p><b>Cursor drip</b> per URL (then immediately find next):</p>' +
      '<ol>' +
      '<li>Purge white / blank / mangled / broken images</li>' +
      '<li>Fact-check</li>' +
      '<li>Fix content from fact-check</li>' +
      '<li>Replace non-applicable / not-intact images throughout the URL</li>' +
      '</ol>' +
      '<p>No timetable. No cooldown. Prefer image-purge URLs first. Never DeepSeek or Claude.</p>'
  );

  console.log(
    JSON.stringify({
      phase: 'cursor-drip-start',
      mode: 'purge→factcheck→content→applicable-images',
      idleMsWhenEmpty: IDLE_MS,
    })
  );

  for (;;) {
    try {
      const found = await findOne(s, state);
      if (!found) {
        state.lastRunAt = new Date().toISOString();
        await s.setJSON(STATE_KEY, state);
        console.log(JSON.stringify({ phase: 'cursor-drip-idle', note: 'nothing due — brief idle then find again' }));
        if (IDLE_MS > 0) await new Promise((r) => setTimeout(r, IDLE_MS));
        state.inventoryBuiltAt = null;
        continue;
      }

      await fixOne(s, state, found);
      state.lastRunAt = new Date().toISOString();
      await s.setJSON(STATE_KEY, state);
      console.log(
        JSON.stringify({
          phase: 'cursor-drip-next',
          note: 'fix done — finding next immediately',
          fixed: state.fixed || 0,
        })
      );
    } catch (e) {
      console.log(JSON.stringify({ phase: 'cursor-drip-error', err: String(e.message || e).slice(0, 200) }));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
