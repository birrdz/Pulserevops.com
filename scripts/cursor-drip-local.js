#!/usr/bin/env node
// CURSOR DRIP — find one → fix one → find next.
// No timetable. No cooldown. No batching.
//
// OWNER ORDER PER URL (exact):
//   1) FIND white / blank / mangled / broken / 404 images (scan ALL slots on the URL)
//   2) FACT-CHECK (Cerebras OK if cheaper; never DeepSeek / Claude)
//   3) FIX CONTENT from fact-check (Cursor rewrite; never DeepSeek / Claude)
//   3b) FIX mangled / broken mermaid diagrams anywhere in the body
//   4) REPLACE every bad image in place with a NEW applicable hosted /assets/qa
//      image for that section/topic. If a section would end up with zero images,
//      put one back. Deploy so nothing 404s / shows white.
//
// Then immediately find the next URL.
//
// Env:
//   DRIP_FULL_INVENTORY=1
//   DRIP_IDLE_MS=5000   ONLY when nothing due
//   CURSOR_ULTRA=1 ULTRA_PLAN=1 PEXELS_ALLOW_FAST=1
//   PEXELS_PACE_MS=2000  (~1–5s between calls; one Pexels image at a time)

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
const { deployQaAssetFiles, listLocalQaFilesForId } = require('./lib/deploy-qa-assets');
const { sortSmallestPillarFirst, pillarOrderSummary } = require('./lib/pillar-inventory-order');

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
// BLOBS_PAT is the same Netlify PAT — use it for asset deploys when AUTH token unset.
if (!process.env.NETLIFY_AUTH_TOKEN && process.env.BLOBS_PAT) {
  process.env.NETLIFY_AUTH_TOKEN = process.env.BLOBS_PAT;
}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const QUEUE_KEY = '_cursor_write_queue.json';
// Pillar-scoped state so switching locks doesn't corrupt sitewide cursors.
function dripStateKey() {
  const p = String(process.env.DRIP_PILLAR || '')
    .split(/[,\s]+/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
    .join(',');
  return p ? '_cursor_drip_state_' + p + '.json' : '_cursor_drip_state.json';
}
const STATE_KEY = dripStateKey();
const DROP_FILE = path.join(process.cwd(), 'logs', 'drip-audit-drop.jsonl');
const LOCAL_QUEUE = path.join(process.cwd(), 'logs', 'cursor-write-queue.json');
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
const WORK_DIR = '/tmp/cursor-drip';
const BUSY_FILE = '/tmp/cursor-drip-busy.id';
const IDLE_MS = Math.max(0, parseInt(process.env.DRIP_IDLE_MS || '5000', 10));
const FULL_INVENTORY = String(process.env.DRIP_FULL_INVENTORY || '1') !== '0';
// Content drip stays BEHIND image-lead (white-purge): fact-check → rewrite only.
// Default ON so image-lead owns white/off-topic image work.
const CONTENT_ONLY = String(process.env.DRIP_CONTENT_ONLY || '1') !== '0';
const BEHIND_IMAGE_LEAD = String(process.env.DRIP_BEHIND_IMAGE_LEAD || '1') !== '0';
// When white-purge service is clearing inventory, prefer fact-check/content first.
// Image-only pages still get picked if nothing else is due (or DRIP_DEFER_IMAGE_PURGE=0).
const DEFER_IMAGE_PURGE =
  CONTENT_ONLY || String(process.env.DRIP_DEFER_IMAGE_PURGE || '1') !== '0';
// Pillar lock — optional. Default = all pillars, smallest first.
const PILLAR_PREFIXES = String(process.env.DRIP_PILLAR || '')
  .split(/[,\s]+/)
  .map((x) => x.trim().toLowerCase())
  .filter(Boolean);
const ORDER_MODE = String(process.env.DRIP_ORDER || 'smallest').toLowerCase(); // smallest | newest
function idInPillar(id) {
  if (!PILLAR_PREFIXES.length) return true;
  const s = String(id || '').toLowerCase();
  return PILLAR_PREFIXES.some((p) => s.startsWith(p));
}
const WHITE_PURGE_STATE_KEY =
  PILLAR_PREFIXES.length
    ? '_white_image_purge_local_state_' + PILLAR_PREFIXES.join('-') + '_' + ORDER_MODE + '.json'
    : '_white_image_purge_local_state_' + ORDER_MODE + '.json';

/** Image-lead already cleared this URL (or scanned past it) — content drip may claim it. */
async function imageLeadCleared(s, id, inventory) {
  if (!BEHIND_IMAGE_LEAD) return true;
  try {
    const blob = await s.get('answers/' + id + '.json', { type: 'json' });
    if (blob && blob.image_lead_done_at) return true;
  } catch (e) {}
  try {
    const wp = await s.get(WHITE_PURGE_STATE_KEY, { type: 'json' });
    if (!wp) return false;
    const done = new Set(wp.doneIds || []);
    if (done.has(id)) return true;
    const inv = Array.isArray(wp.inventoryIds) && wp.inventoryIds.length ? wp.inventoryIds : inventory || [];
    const i = inv.indexOf(id);
    return i >= 0 && i < (wp.cursor || 0);
  } catch (e) {
    return false;
  }
}
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

const { sendOwnerEmail } = require('./lib/pulse-email');
async function emailOne(subject, html) {
  const r = await sendOwnerEmail(subject, html);
  return !!(r && r.ok);
}

// Owner: email IMMEDIATELY on each finished URL (no digest wait).
const EMAIL_EVERY = Math.max(1, parseInt(process.env.DRIP_EMAIL_EVERY || '1', 10));
const EMAIL_MAX_GAP_MS = Math.max(
  60 * 1000,
  parseInt(process.env.DRIP_EMAIL_MAX_GAP_MS || String(15 * 60 * 1000), 10)
);
const emailBuf = [];
let lastDigestAt = 0;

async function flushDripDigest(reason) {
  if (!emailBuf.length) return false;
  const items = emailBuf.splice(0, emailBuf.length);
  lastDigestAt = Date.now();
  const ids = items.map((x) => x.id);
  const one = items.length === 1 ? items[0] : null;
  const subject = (
    one
      ? 'PULSE content drip · ' + one.id + ' · fact-check/rewrite · ' + new Date().toISOString().slice(11, 16) + 'Z'
      : 'PULSE content drip · ' + items.length + ' URLs · ' + new Date().toISOString().slice(11, 16) + 'Z · ' + ids.slice(0, 3).join(', ')
  ).slice(0, 180);
  const html = one
    ? '<p><b>Content drip finished</b> (fact-check → rewrite lies/misspeaks).</p>' +
      '<p><a href="' +
      esc(one.url) +
      '">' +
      esc(one.id) +
      '</a> — ' +
      esc(String(one.question || '').slice(0, 160)) +
      '</p>' +
      (one.notes
        ? '<p>' + esc(String(one.notes).slice(0, 400)) + '</p>'
        : '')
    : '<p><b>Content drip</b> (' +
      esc(reason || 'batch') +
      ') — <b>' +
      items.length +
      ' URLs</b>:</p><ol>' +
      items
        .map(
          (x) =>
            '<li><a href="' +
            esc(x.url) +
            '">' +
            esc(x.id) +
            '</a> — ' +
            esc(String(x.question || '').slice(0, 120)) +
            '</li>'
        )
        .join('') +
      '</ol>';
  console.log(JSON.stringify({ phase: 'email', reason, count: items.length, ids }));
  return emailOne(subject, html);
}

async function queueDripEmail(item, opts) {
  opts = opts || {};
  emailBuf.push(item);
  // Immediate when EMAIL_EVERY=1 (owner default)
  const gapDue = lastDigestAt && Date.now() - lastDigestAt >= EMAIL_MAX_GAP_MS;
  const countDue = emailBuf.length >= EMAIL_EVERY;
  if (opts.force || countDue || gapDue || !lastDigestAt) {
    await flushDripDigest(opts.force ? 'forced' : countDue ? 'every-' + EMAIL_EVERY : 'max-gap');
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

/** Same proxy the renderer uses for hotlinked imgs — if wsrv 404s, the page shows white/missing. */
function wsrvUrl(abs) {
  const u = String(abs || '');
  if (!/^https?:\/\//i.test(u)) return null;
  if (/pulserevops\.com\/assets\//i.test(u) || /wsrv\.nl\//i.test(u)) return null;
  const bare = u.replace(/^https?:\/\//i, '');
  return 'https://wsrv.nl/?url=' + encodeURIComponent(bare) + '&w=760&output=webp&q=80&we&n=-1';
}

function nextQaSlotId(entryId) {
  let max = 0;
  try {
    const re = new RegExp('^' + String(entryId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.jpe?g$', 'i');
    for (const f of fs.readdirSync(ASSET_DIR)) {
      const m = f.match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10) || 0);
    }
  } catch (e) {}
  return entryId + '-' + (max + 1);
}

/** Classify: mangled | white | defunct | ok | empty */
async function classifyImage(url) {
  if (!url) return { kind: 'empty', url };
  if (isMangled(url)) return { kind: 'mangled', url };
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) return { kind: 'ok', url, skipPurge: true };
  if (/img-missing|placeholder\.svg|\/img\/auto\//i.test(url)) return { kind: 'defunct', url };
  // Paint chips / color swatches read as white rectangles on the page
  if (/\/colors\/|chalk\+?white|color.?swatch|paint.?chip|colou?r.?chip/i.test(url)) {
    return { kind: 'white', url, reason: 'color-swatch' };
  }
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty', url };
  // Hotlinks: prefer the live proxy path — that's what readers hit
  const via = wsrvUrl(abs) || abs;
  try {
    const r = await fetch(via, {
      headers: { 'User-Agent': 'PulseCursorDrip/1.0', Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) {
      // Fallback: try origin once (self-hosted /assets never use wsrv)
      if (via !== abs) {
        try {
          const r2 = await fetch(abs, {
            headers: { 'User-Agent': 'PulseCursorDrip/1.0', Accept: 'image/*' },
            redirect: 'follow',
            signal: AbortSignal.timeout(12000),
          });
          if (!r2.ok) return { kind: 'defunct', status: r2.status, url: abs, via: 'wsrv+' + r.status };
          // origin works but wsrv fails → still broken on live page
          return { kind: 'defunct', status: r.status, url: abs, reason: 'wsrv-fail-origin-ok' };
        } catch (e2) {
          return { kind: 'defunct', url: abs, reason: 'wsrv+origin-fail' };
        }
      }
      return { kind: 'defunct', status: r.status, url: abs };
    }
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
      // Broader white/blank catch — near-white blanks still read as white on page
      white =
        (mean >= 235 && whitePct >= 0.85) ||
        whitePct >= 0.9 ||
        (mean >= 225 && whitePct >= 0.75) ||
        (mean >= 210 && whitePct >= 0.7) ||
        (mean >= 245 && buf.length < 25000);
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

/** Nearest ## heading above a URL occurrence (for applicable replacement query). */
function sectionTitleForUrl(body, url) {
  const lines = String(body || '').split('\n');
  let title = '';
  const needle = String(url || '');
  const short = needle.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
  for (const line of lines) {
    const hm = line.match(/^##\s+(.+)/);
    if (hm) title = hm[1].replace(/[\[\]#]/g, '').trim().slice(0, 100);
    if (needle && (line.includes(needle) || (short && line.includes(short)))) {
      return title || '(intro)';
    }
  }
  return title || '(intro)';
}

function replaceImageUrlInBody(body, oldUrl, newRel) {
  let out = String(body || '');
  const variants = new Set([oldUrl, normUrl(oldUrl)]);
  const rel = String(oldUrl || '').replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
  if (rel && rel !== oldUrl) variants.add(rel);
  for (const v of variants) {
    if (!v) continue;
    // markdown
    out = out.split('](' + v + ')').join('](' + newRel + ')');
    // @@PRODUCT img=
    out = out.split('img="' + v + '"').join('img="' + newRel + '"');
  }
  return out;
}

/** Remove bad image lines entirely. Extras that were purged stay gone unless step 4
 *  finds the section now has zero good images (then one replacement is required). */
function stripBadFromBody(body, badUrls) {
  const ban = new Set((badUrls || []).map((u) => normUrl(u)));
  const lines = String(body || '').split('\n');
  const out = [];
  const removed = [];
  let purgedHero = false;
  let lineIdx = 0;
  for (let line of lines) {
    const isImgLine = /!\[[^\]]*\]\(/i.test(line);
    const isProd = /@@PRODUCT/i.test(line) && /img="/i.test(line);
    if (isImgLine) {
      let drop = false;
      if (isMangled(line)) {
        removed.push(line.slice(0, 120));
        drop = true;
      } else {
        const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/) || line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
        if (m) {
          const u = normUrl(m[1]);
          const rel = u.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
          if (ban.has(u) || ban.has(rel) || [...ban].some((x) => x && (u.includes(x) || line.includes(x)))) {
            removed.push(m[1].slice(0, 200));
            drop = true;
          }
        }
      }
      if (drop) {
        // First content image ≈ hero/cover for this page
        if (lineIdx < 12 && !purgedHero && out.every((l) => !/!\[[^\]]*\]\(/i.test(l))) purgedHero = true;
        continue;
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
    lineIdx++;
  }
  return { answer: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed, purgedHero };
}

/** Per-## section image counts (markdown + @@PRODUCT img). */
function sectionImageStats(body) {
  const lines = String(body || '').split('\n');
  const sections = [];
  let cur = { title: '(intro)', images: 0, hasProse: false };
  const flush = () => {
    sections.push(cur);
  };
  for (const line of lines) {
    const hm = line.match(/^##\s+(.+)/);
    if (hm) {
      flush();
      cur = { title: hm[1].replace(/[\[\]#]/g, '').trim().slice(0, 120), images: 0, hasProse: false };
      continue;
    }
    if (/!\[[^\]]*\]\([^)]+\)/.test(line) || (/@@PRODUCT/i.test(line) && /img="[^"]+"/i.test(line))) {
      cur.images += 1;
    } else if (line.trim().length > 40 && !/^```/.test(line) && !/^[-*]\s/.test(line)) {
      cur.hasProse = true;
    }
  }
  flush();
  return sections;
}

/** Sections that had ≥1 image before purge and 0 after → need exactly one replacement. */
function sectionsNeedingReplacement(beforeStats, afterStats) {
  const need = [];
  const afterByTitle = new Map(afterStats.map((s) => [s.title.toLowerCase(), s]));
  for (const b of beforeStats) {
    if (!b.images) continue;
    const a = afterByTitle.get(b.title.toLowerCase());
    if (a && a.images === 0 && (a.hasProse || b.images > 0)) {
      need.push(a.title);
    }
  }
  // Intro/hero: if intro lost all images, flag as needing cover
  const introB = beforeStats.find((s) => s.title === '(intro)');
  const introA = afterStats.find((s) => s.title === '(intro)');
  const needCover = !!(introB && introB.images > 0 && introA && introA.images === 0);
  return { sectionTitles: need.filter((t) => t !== '(intro)'), needCover };
}

function hasLeadingImage(body) {
  return /^﻿?\s*!\[[^\]]*\]\([^)]+\)/m.test(String(body || '').trim());
}

function insertImageAfterSectionHeading(body, sectionTitle, rel, alt) {
  const title = String(sectionTitle || '').trim();
  if (!title || !rel) return body;
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(##\\s+' + esc + '[^\\n]*\\n)', 'i');
  if (!re.test(body)) return body;
  const imgLine = '![' + String(alt || title).replace(/[\[\]]/g, '').slice(0, 80) + '](' + rel + ')\n\n';
  return body.replace(re, '$1\n' + imgLine);
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

async function auditImagesOnPage(blobOrBody, id, coverOpt) {
  const isBlob = blobOrBody && typeof blobOrBody === 'object' && blobOrBody.answer != null;
  const answer = isBlob ? blobOrBody.answer : blobOrBody;
  const cover = coverOpt != null ? coverOpt : isBlob ? blobOrBody.img || '' : '';
  // Scan ALL slots on the URL (cap high — product cards + section figures)
  const urls = extractImageUrls(answer, cover).slice(0, 40);
  const bad = [];
  const reasons = [];
  const details = [];
  for (const u of urls) {
    const cls = await classifyImage(u);
    if (cls.kind === 'white' || cls.kind === 'mangled' || cls.kind === 'defunct') {
      bad.push(u);
      reasons.push(cls.kind + ':' + String(u).slice(0, 80));
      details.push({ url: u, kind: cls.kind, section: sectionTitleForUrl(answer, u) });
    }
  }
  return { bad, reasons, details, hasBad: bad.length > 0, scanned: urls.length };
}

function needsDrip(blob, id, dropSet) {
  if (!blob || !blob.answer) return false;
  if (dropSet.has(id)) return true;
  // Content-only drip: skip image-only triggers (image-lead owns those)
  if (!CONTENT_ONLY && quickNeedsImagePurge(blob)) return true;
  if (blob.cursor_fixed_at) {
    const fixed = Date.parse(blob.cursor_fixed_at) || 0;
    const ts = entryTs(blob, null);
    if (fixed && ts && ts <= fixed) {
      if (CONTENT_ONLY) {
        // Still re-audit if never fact-checked after image-lead, or last audit flagged
        if (blob.drip_audit_verdict === 'flag' || blob.drip_audit_verdict === 'error') return true;
        const dripAt = blob.drip_audited_at ? Date.parse(blob.drip_audited_at) : 0;
        const leadAt = blob.image_lead_done_at ? Date.parse(blob.image_lead_done_at) : 0;
        if (leadAt && (!dripAt || dripAt < leadAt)) return true;
        return false;
      }
      if (!quickNeedsImagePurge(blob)) return false;
    }
  }
  const dripAt = blob.drip_audited_at ? Date.parse(blob.drip_audited_at) : 0;
  if (!dripAt) return true;
  const ts = entryTs(blob, null);
  if (ts && ts > dripAt) return true;
  if (blob.drip_audit_verdict === 'flag' || blob.drip_audit_verdict === 'error') return true;
  // After image-lead finishes, content drip should fact-check even if prior audit was clean
  const leadAt = blob.image_lead_done_at ? Date.parse(blob.image_lead_done_at) : 0;
  if (CONTENT_ONLY && leadAt && dripAt && dripAt < leadAt) return true;
  return false;
}

async function ensureInventory(s, state) {
  const dropIds = readDropFile(state.drop || (state.drop = { lines: 0 }));
  const dropSet = new Set(dropIds);
  const pillarKey = (PILLAR_PREFIXES.join(',') || '*') + ':' + ORDER_MODE;
  const needRefresh =
    !Array.isArray(state.inventoryIds) ||
    !state.inventoryIds.length ||
    !state.inventoryBuiltAt ||
    state.pillarLock !== pillarKey ||
    Date.now() - Date.parse(state.inventoryBuiltAt) > 6 * 3600 * 1000;
  if (needRefresh) {
    const idx = await s.get('_index.json', { type: 'json' });
    const rows = ((idx && idx.entries) || []).filter(
      (e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)) && idInPillar(e.id)
    );
    const seen = new Set();
    let ids = [];
    for (const row of rows) {
      const id = String(row.id).toLowerCase();
      if (seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
    }
    if (ORDER_MODE === 'newest') {
      const scored = rows.map((row) => ({ id: String(row.id).toLowerCase(), ts: entryTs({}, row) || 0 }));
      scored.sort((a, b) => b.ts - a.ts);
      ids = [];
      const seen2 = new Set();
      for (const x of scored) {
        if (seen2.has(x.id)) continue;
        seen2.add(x.id);
        ids.push(x.id);
      }
    } else {
      ids = sortSmallestPillarFirst(ids);
    }
    // Drop-file priority still jumps to front
    for (let i = dropIds.length - 1; i >= 0; i--) {
      const id = dropIds[i];
      if (!idInPillar(id)) continue;
      const at = ids.indexOf(id);
      if (at >= 0) ids.splice(at, 1);
      ids.unshift(id);
    }
    state.inventoryIds = ids;
    state.inventoryBuiltAt = new Date().toISOString();
    state.pillarLock = pillarKey;
    state.invCursor = 0;
    state.imgCursor = 0;
    const order = pillarOrderSummary(ids);
    console.log(
      JSON.stringify({
        phase: 'cursor-drip-inventory',
        inventory: ids.length,
        fullInventory: FULL_INVENTORY,
        pillar: pillarKey,
        order: ORDER_MODE,
        firstPillars: order.slice(0, 8),
        lastPillars: order.slice(-4),
      })
    );
  }
  return dropSet;
}

async function findImagePurgeCandidate(s, state, dropSet, inventory, queue) {
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
    const imgAudit = await auditImagesOnPage(blob, id);
    if (!imgAudit.hasBad && !dropSet.has(id) && !isMangled(blob.answer || '')) {
      continue;
    }
    state.imgCursor = cursor;
    return { id, blob, queue, priority: 'image-purge', imgAudit };
  }
  state.imgCursor = cursor;
  return null;
}

/**
 * Find one URL.
 * Default (DRIP_DEFER_IMAGE_PURGE=1): queue → content first; image-only purge last
 * so the white-purge service can clear inventory ahead of the drip.
 * On any claimed URL, fixOne still runs step1/4 if bad images remain.
 */
async function findOne(s, state) {
  let queue = { items: [] };
  try {
    queue = Object.assign(queue, (await s.get(QUEUE_KEY, { type: 'json' })) || {});
  } catch (e) {}
  const forceId = String(process.env.DRIP_FORCE_ID || '').trim();
  if (forceId) {
    if (!idInPillar(forceId)) throw new Error('DRIP_FORCE_ID outside pillar lock: ' + forceId);
    const blob = await s.get('answers/' + forceId + '.json', { type: 'json' });
    if (!blob || !blob.answer) throw new Error('DRIP_FORCE_ID missing blob: ' + forceId);
    const imgAudit = await auditImagesOnPage(blob, forceId);
    return { id: forceId, blob, queue, priority: 'force', imgAudit };
  }
  const dropSet = await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) return null;

  if (!CONTENT_ONLY && !DEFER_IMAGE_PURGE) {
    const imgFirst = await findImagePurgeCandidate(s, state, dropSet, inventory, queue);
    if (imgFirst) return imgFirst;
  }

  // PASS A — existing Cursor queue pending (fact-check / content work)
  // Prefer smallest pillars first so queue work doesn't jump to tl/giants.
  let pending = (queue.items || []).filter((x) => x && x.status === 'pending' && idInPillar(x.id));
  if (pending.length && ORDER_MODE === 'smallest') {
    const ordered = sortSmallestPillarFirst(pending.map((x) => x.id));
    pending = ordered.map((id) => pending.find((x) => String(x.id).toLowerCase() === id)).filter(Boolean);
  }
  for (const it of pending) {
    const id = String(it.id).toLowerCase();
    if (!(await imageLeadCleared(s, id, inventory))) continue;
    const blob = await s.get('answers/' + id + '.json', { type: 'json' });
    return { id, blob, queue, fromQueue: true, critique: it, priority: 'queue' };
  }

  // PASS B — general content due (fact-check + rewrite) — stay behind image-lead
  let cursor = state.invCursor || 0;
  let scanned = 0;
  while (scanned < inventory.length) {
    if (cursor >= inventory.length) cursor = 0;
    const id = inventory[cursor];
    cursor += 1;
    scanned += 1;
    if (!(await imageLeadCleared(s, id, inventory))) continue;
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

  // PASS C — image-only leftovers (disabled in content-only mode; image-lead owns this)
  if (!CONTENT_ONLY && DEFER_IMAGE_PURGE) {
    const imgLast = await findImagePurgeCandidate(s, state, dropSet, inventory, queue);
    if (imgLast) return imgLast;
  }
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

/**
 * ONE Pexels image at a time: per_page=1, serial queue, search+download under the same lock.
 * Tries page 1..N sequentially (still one request at a time) until relevance gate passes.
 */
async function pexelsSearchApplicable(title, id) {
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing');
  const query = deriveImageSearchQuery(title || id);
  const core = extractCoreTerms(query);
  const tryQueries = [query, simplifyQuery(query)].filter((q, i, a) => q && a.indexOf(q) === i);
  const maxPages = 8;

  for (const q of tryQueries) {
    for (let page = 1; page <= maxPages; page++) {
      // Entire acquire (search + download + grade) holds the serial Pexels lock —
      // never two Pexels asks or downloads overlapping.
      const got = await pexelsRequest(async () => {
        const url =
          'https://api.pexels.com/v1/search?per_page=1&page=' +
          page +
          '&orientation=landscape&query=' +
          encodeURIComponent(q);
        const res = await fetch(url, {
          headers: { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-cursor-drip/1.0' },
          signal: AbortSignal.timeout(30000),
        });
        if (res.status !== 200) {
          return { status: res.status, body: Buffer.from(await res.arrayBuffer()), miss: true };
        }
        const data = JSON.parse(Buffer.from(await res.arrayBuffer()).toString('utf8'));
        const photos = data.photos || [];
        const p = photos[0];
        if (!p) return { status: 200, body: Buffer.alloc(0), miss: true, exhausted: true };

        // Gate on this single photo (total_results still available for thin-results check)
        const gated = gatePexels(core, data.total_results || 0, photos);
        const landscapeOk = p.width >= 1200 && p.width >= p.height;
        const accept = gated.pass || (landscapeOk && page >= maxPages);
        if (!accept && !gated.pass) {
          return { status: 200, body: Buffer.alloc(0), miss: true, tryNextPage: true, total: data.total_results };
        }
        if (!landscapeOk && page < maxPages) {
          return { status: 200, body: Buffer.alloc(0), miss: true, tryNextPage: true };
        }

        const src = p.src && (p.src.large2x || p.src.large || p.src.original);
        if (!src) return { status: 200, body: Buffer.alloc(0), miss: true, tryNextPage: true };

        const dl = await fetch(src, { signal: AbortSignal.timeout(45000) });
        if (!dl.ok) return { status: dl.status, body: Buffer.alloc(0), miss: true, tryNextPage: true };
        const buf = Buffer.from(await dl.arrayBuffer());
        const dest = path.join(ASSET_DIR, id + '.jpg');
        await storeGradedImage(buf, dest, {
          square: 760,
          faceCard: true,
          cropPosition: 'attention',
          bright: false,
        });
        return {
          status: 200,
          body: Buffer.alloc(0),
          ok: true,
          rel: '/assets/qa/' + id + '.jpg',
          query: q,
          gated: !!gated.pass,
          alt: (p.alt || '').slice(0, 120),
          page,
        };
      });

      if (got && got.ok) {
        return { rel: got.rel, query: got.query, gated: got.gated, alt: got.alt, page: got.page };
      }
      if (got && got.exhausted) break;
      // tryNextPage / miss → continue sequential page (still one-at-a-time)
    }
  }
  throw new Error('pexels applicable miss');
}

/** Drop markdown / @@PRODUCT img refs that point at missing local /assets/qa files (would 404 live). */
function stripUnhostedQaRefs(body, assetDir) {
  const dir = assetDir || ASSET_DIR;
  const lines = String(body || '').split('\n');
  const out = [];
  let stripped = 0;
  for (let line of lines) {
    const md = line.match(/!\[[^\]]*\]\((\/assets\/qa\/([^)\s]+))\)/);
    if (md) {
      const file = path.join(dir, md[2]);
      let ok = false;
      try {
        ok = fs.existsSync(file) && fs.statSync(file).size > 8000;
      } catch (e) {}
      if (!ok) {
        stripped++;
        continue;
      }
    }
    if (/@@PRODUCT/i.test(line) && /img="\/assets\/qa\/[^"]+"/i.test(line)) {
      const m = line.match(/img="\/assets\/qa\/([^"]+)"/i);
      if (m) {
        const file = path.join(dir, m[1]);
        let ok = false;
        try {
          ok = fs.existsSync(file) && fs.statSync(file).size > 8000;
        } catch (e) {}
        if (!ok) {
          line = line.replace(/\s*img="[^"]*"/i, '');
          stripped++;
        }
      }
    }
    out.push(line);
  }
  return { answer: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), stripped };
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
  try {
    fs.writeFileSync(BUSY_FILE, String(id));
  } catch (e) {}
  try {
    return await fixOneInner(s, state, found, id, blob, queue);
  } finally {
    try {
      if (fs.existsSync(BUSY_FILE) && String(fs.readFileSync(BUSY_FILE, 'utf8')).trim() === String(id)) {
        fs.unlinkSync(BUSY_FILE);
      }
    } catch (e) {}
  }
}

async function fixOneInner(s, state, found, id, blob, queue) {
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

  // ─── STEP 1: FIND white / blank / mangled / broken / 404 (all slots) ───
  // Skipped in CONTENT_ONLY — image-lead drip owns white/off-topic images.
  let purgedCount = 0;
  let badImageDetails = [];
  const beforeImgStats = CONTENT_ONLY ? [] : sectionImageStats(body);
  let imgAudit = { bad: [], reasons: [], details: [], hasBad: false, scanned: 0 };
  if (!CONTENT_ONLY) {
  console.log(JSON.stringify({ phase: 'step1-find-bad-images', id }));
  imgAudit = found.imgAudit || (await auditImagesOnPage(blob, id));
  // Always rescan fully (found.imgAudit may be stale / capped)
  if (!imgAudit.details || imgAudit.scanned < 15) {
    imgAudit = await auditImagesOnPage(body, id, blob.img || '');
  }
  badImageDetails = imgAudit.details || [];
  if (imgAudit.hasBad || isMangled(body)) {
    // Strip only mangled lines (broken markdown). Keep other bad URLs for in-place replace.
    const mangledOnly = (imgAudit.bad || []).filter((u) => isMangled(u) || /pollinations\.ai/i.test(u));
    if (mangledOnly.length || isMangled(body)) {
      const { answer: cleaned, removed } = stripBadFromBody(body, mangledOnly);
      body = cleaned;
      purgedCount = removed.length;
    }
    purgedCount = Math.max(purgedCount, (imgAudit.bad || []).length);
    const banned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls.slice() : [];
    for (const u of imgAudit.bad || []) {
      const n = normUrl(u);
      if (n && !banned.includes(n)) banned.push(n);
    }
    blob.purged_image_urls = banned;
    blob.face_purged_at = new Date().toISOString();
    blob.face_purge_reason = (imgAudit.reasons || []).slice(0, 8).join(',') || 'white-mangled-broken';
    actions.push('find-bad-images:' + (imgAudit.bad || []).length);
    stepNotes.push(
      'Found ' +
        (imgAudit.bad || []).length +
        ' white/broken/404 image(s) across ' +
        (imgAudit.scanned || 0) +
        ' slots — will replace each with applicable art after rewrite'
    );
    console.log(
      JSON.stringify({
        phase: 'step1-found-bad',
        id,
        bad: (imgAudit.bad || []).length,
        scanned: imgAudit.scanned,
        reasons: (imgAudit.reasons || []).slice(0, 8),
        sections: (badImageDetails || []).map((d) => d.section).filter(Boolean).slice(0, 10),
      })
    );
  } else {
    stepNotes.push('No white/mangled/broken image slots found');
    console.log(JSON.stringify({ phase: 'step1-clean', id, scanned: imgAudit.scanned || 0 }));
  }
  } else {
    stepNotes.push('Image steps skipped — image-lead drip owns white/off-topic images');
    console.log(JSON.stringify({ phase: 'step1-skipped-content-only', id }));
  }
  void beforeImgStats;

  // ─── STEP 2: FACT-CHECK (find lies / misspeaks) ───
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
      verdict: actions.some((a) => /find-bad-images|purge-/i.test(String(a))) ? 'flag' : 'pass',
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

  // ─── STEP 4: REPLACE EVERY WHITE/BROKEN IMAGE WITH APPLICABLE HOSTED ART ───
  // Skipped in CONTENT_ONLY — image-lead owns this.
  const finalTopic = question;
  const titleLookup = buildSectionTitleLookup(body);
  let coverRel = null;
  let repaired = 0;
  let filled = 0;

  let deployed = 0;
  if (CONTENT_ONLY) {
    console.log(JSON.stringify({ phase: 'step4-skipped-content-only', id }));
    stepNotes.push('Image replace skipped — image-lead drip owns applicable images');
  } else {
  // Re-audit AFTER rewrite (visual-lock may have kept bad URLs).
  // Also queue every remaining external hotlink — easier to self-host all than chase whites.
  const postAudit = await auditImagesOnPage(body, id, blob.img || '');
  const toReplace = [];
  const seenReplace = new Set();
  const pushReplace = (url, kind, section) => {
    const k = normUrl(url) || url;
    if (!url || seenReplace.has(k)) return;
    seenReplace.add(k);
    toReplace.push({ url, kind, section: section || sectionTitleForUrl(body, url) });
  };
  for (const d of postAudit.details || []) pushReplace(d.url, d.kind, d.section);
  for (const u of postAudit.bad || []) pushReplace(u, 'bad', sectionTitleForUrl(body, u));
  for (const u of extractImageUrls(body, '')) {
    if (/^https?:\/\//i.test(u) && !/pulserevops\.com\/assets\//i.test(u)) {
      pushReplace(u, 'external-hotlink', sectionTitleForUrl(body, u));
    }
  }
  // Cap so one URL cannot burn the whole Pexels day — still "several"/all typical page slots
  const replaceList = toReplace.slice(0, 20);

  console.log(
    JSON.stringify({
      phase: 'step4-replace-all-bad',
      id,
      bad: replaceList.length,
      scanned: postAudit.scanned,
      against: contentRewrote ? 'post-rewrite-topic' : 'current-topic',
      needCover: !hasLeadingImage(body),
    })
  );

  if (!hasLeadingImage(body)) {
    try {
      const cover = await pexelsSearchApplicable(finalTopic, id);
      coverRel = cover.rel;
      body = swapLeadingImage(body, coverRel, finalTopic);
      actions.push('pexels-cover:' + (cover.query || 'topic') + (cover.gated ? ':gated' : ':fallback'));
      stepNotes.push('Added cover for page topic via Pexels');
    } catch (e) {
      console.log(JSON.stringify({ phase: 'step4-cover-miss', id, err: String(e.message || e).slice(0, 100) }));
    }
  }

  const replacedUrls = new Set();
  for (const item of replaceList) {
    const oldUrl = item.url;
    if (!oldUrl || replacedUrls.has(oldUrl)) continue;
    // Skip if already a good local asset
    if (/^\/assets\/qa\//i.test(oldUrl) && !/pollinations|_purged|img-missing/i.test(oldUrl)) {
      const absCheck = path.join(ASSET_DIR, path.basename(oldUrl.split('?')[0]));
      try {
        if (fs.existsSync(absCheck) && fs.statSync(absCheck).size > 8000) {
          const cls = await classifyImage(oldUrl);
          if (cls.kind === 'ok') continue;
        }
      } catch (e) {}
    }
    const sec = item.section && item.section !== '(intro)' ? item.section : finalTopic;
    try {
      const slotId = nextQaSlotId(id);
      const q = String(sec + ' ' + finalTopic).slice(0, 120);
      const got = await pexelsSearchApplicable(q, slotId);
      const rel = (got && got.rel) || '/assets/qa/' + slotId + '.jpg';
      const abs = path.join(ASSET_DIR, path.basename(rel));
      if (!fs.existsSync(abs) || fs.statSync(abs).size < 8000) throw new Error('not on disk ' + rel);
      const before = body;
      body = replaceImageUrlInBody(body, oldUrl, rel);
      if (body === before) {
        // URL not present as exact string — insert at section if empty
        body = insertImageAfterSectionHeading(body, sec, rel, sec);
      }
      replacedUrls.add(oldUrl);
      filled += 1;
      repaired += 1;
      console.log(
        JSON.stringify({
          phase: 'step4-replaced',
          id,
          kind: item.kind,
          section: String(sec).slice(0, 60),
          from: String(oldUrl).slice(0, 80),
          to: rel,
        })
      );
    } catch (e) {
      console.log(
        JSON.stringify({
          phase: 'step4-replace-miss',
          id,
          section: String(sec).slice(0, 60),
          err: String(e.message || e).slice(0, 100),
        })
      );
    }
  }
  if (filled) {
    actions.push('replace-bad-images:' + filled);
    stepNotes.push('Replaced ' + filled + ' white/broken image(s) with NEW applicable hosted art');
  }

  // Safety: ranking/content sections with zero images → one applicable image
  const emptySecs = sectionImageStats(body).filter(
    (s) =>
      s.images === 0 &&
      s.hasProse &&
      s.title !== '(intro)' &&
      !/^(FAQ|Sources|Related|Diagram|Bottom Line|How to Choose|What to Look For|Direct Answer)/i.test(s.title)
  );
  for (const s of emptySecs.slice(0, 8)) {
    try {
      const slotId = nextQaSlotId(id);
      const got = await pexelsSearchApplicable((s.title + ' ' + finalTopic).slice(0, 120), slotId);
      const rel = (got && got.rel) || '/assets/qa/' + slotId + '.jpg';
      body = insertImageAfterSectionHeading(body, s.title, rel, s.title);
      filled += 1;
      actions.push('empty-section-fill:' + s.title.slice(0, 40));
      stepNotes.push('Section "' + s.title.slice(0, 50) + '" had no image after purge — added one');
      console.log(JSON.stringify({ phase: 'step4-empty-section-fill', id, section: s.title, rel }));
    } catch (e) {
      console.log(JSON.stringify({ phase: 'step4-empty-miss', id, section: s.title, err: String(e.message || e).slice(0, 80) }));
    }
  }
  void titleLookup;
  void purgedCount;
  void badImageDetails;
  // Deploy newly written local assets for this id, then drop any /assets/qa refs
  // that still have no local file (never publish phantom 404 slots).
  try {
    const localFiles = listLocalQaFilesForId(ASSET_DIR, id);
    // Also include any /assets/qa basename referenced in body that exists locally
    // (covers cross-id reuse that was copied into ASSET_DIR).
    const extra = new Set(localFiles);
    for (const m of String(body).matchAll(/\/assets\/qa\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp))/gi)) {
      const abs = path.join(ASSET_DIR, m[1]);
      try {
        if (fs.existsSync(abs) && fs.statSync(abs).size > 8000) extra.add(abs);
      } catch (e) {}
    }
    const toDeploy = [...extra];
    if (toDeploy.length) {
      console.log(JSON.stringify({ phase: 'step4-deploy-assets', id, files: toDeploy.length }));
      const dep = await deployQaAssetFiles(toDeploy, {
        promote: true,
        title: 'cursor drip · ' + id + ' · ' + toDeploy.length + ' qa assets',
      });
      if (dep && dep.ok && !dep.skipped) {
        deployed = dep.assets || toDeploy.length;
        actions.push('deploy-qa-assets:' + deployed);
        stepNotes.push('Deployed ' + deployed + ' /assets/qa file(s) to Netlify (live)');
        console.log(JSON.stringify({ phase: 'step4-deployed', id, deployId: dep.deployId, assets: deployed, promoted: dep.promoted }));
      } else if (dep && dep.error) {
        throw new Error(dep.error);
      }
    }
  } catch (e) {
    console.log(JSON.stringify({ phase: 'step4-deploy-err', id, err: String(e.message || e).slice(0, 160) }));
    stepNotes.push('Asset deploy soft-failed — stripping unhosted /assets/qa refs so page is not full of 404s');
  }

  {
    const scrub = stripUnhostedQaRefs(body, ASSET_DIR);
    body = scrub.answer;
    if (scrub.stripped) {
      actions.push('strip-unhosted-qa:' + scrub.stripped);
      stepNotes.push('Removed ' + scrub.stripped + ' image ref(s) with no local file (would 404)');
      // If we stripped the cover we just set, clear coverRel
      if (coverRel) {
        const coverFile = path.join(ASSET_DIR, path.basename(coverRel));
        let coverOk = false;
        try {
          coverOk = fs.existsSync(coverFile) && fs.statSync(coverFile).size > 8000;
        } catch (e) {}
        if (!coverOk) coverRel = null;
      }
    }
  }
  } // end !CONTENT_ONLY step4

  console.log(
    JSON.stringify({
      phase: 'step4-done',
      id,
      cover: coverRel,
      repaired,
      filled,
      deployed,
      contentRewrote,
      sectionTopics: Object.keys(titleLookup).length,
      contentOnly: CONTENT_ONLY,
    })
  );

  // ─── SAVE + ONE EMAIL ───
  // Minimum ship: purge + rewrite. Images are best-effort (must be hosted if referenced).
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

  fs.writeFileSync(
    path.join(WORK_DIR, id + '.json'),
    JSON.stringify({ id, doneAt, actions, sections, issues: issues.slice(0, 8), coverRel, repaired, filled }, null, 2)
  );

  state.fixed = (state.fixed || 0) + 1;
  state.lastId = id;
  state.lastResult = 'fixed';
  await queueDripEmail({
    id,
    url,
    question: String(question || '').slice(0, 160),
    replaced: filled || repaired || 0,
    actions: actions.slice(0, 6),
    at: doneAt,
  });
  console.log(JSON.stringify({ phase: 'cursor-drip-fixed', id, actions, sections, emailBuf: emailBuf.length }));
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

  const once = String(process.env.DRIP_ONCE || '') === '1';
  if (!once) {
    // Catch-up: last hour of local done files so inbox gets visibility immediately
    try {
      const hourAgo = Date.now() - 60 * 60 * 1000;
      const recent = fs
        .readdirSync(WORK_DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => {
          try {
            return JSON.parse(fs.readFileSync(path.join(WORK_DIR, f), 'utf8'));
          } catch (e) {
            return null;
          }
        })
        .filter((j) => j && j.id && Date.parse(j.doneAt || 0) >= hourAgo)
        .sort((a, b) => Date.parse(b.doneAt) - Date.parse(a.doneAt));
      // No startup spam — owner wants per-URL emails only when a drip finishes work.
      lastDigestAt = Date.now();
      console.log(JSON.stringify({ phase: 'startup-catchup-skipped', recentHour: recent.length, emailEvery: EMAIL_EVERY }));
    } catch (e) {
      lastDigestAt = Date.now();
    }
  }

  console.log(
    JSON.stringify({
      phase: 'cursor-drip-start',
      mode: CONTENT_ONLY ? 'content-behind: factcheck→rewrite' : 'find-bad→factcheck→content→replace-all-bad',
      contentOnly: CONTENT_ONLY,
      behindImageLead: BEHIND_IMAGE_LEAD,
      idleMsWhenEmpty: IDLE_MS,
      forceId: process.env.DRIP_FORCE_ID || null,
      once,
      deferImagePurge: DEFER_IMAGE_PURGE,
      pillar: PILLAR_PREFIXES.join(',') || '*',
      order: ORDER_MODE,
      emailEvery: EMAIL_EVERY,
      emailMaxGapMin: Math.round(EMAIL_MAX_GAP_MS / 60000),
    })
  );

  for (;;) {
    try {
      const found = await findOne(s, state);
      if (!found) {
        state.lastRunAt = new Date().toISOString();
        await s.setJSON(STATE_KEY, state);
        console.log(JSON.stringify({ phase: 'cursor-drip-idle', note: 'nothing due — brief idle then find again' }));
        if (once) break;
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
          note: once ? 'fix done — DRIP_ONCE exit' : 'fix done — finding next immediately',
          fixed: state.fixed || 0,
        })
      );
      if (once) break;
    } catch (e) {
      console.log(JSON.stringify({ phase: 'cursor-drip-error', err: String(e.message || e).slice(0, 200) }));
      if (once) throw e;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
