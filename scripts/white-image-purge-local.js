#!/usr/bin/env node
// IMAGE LEAD drip — runs AHEAD of content drip.
// 1) White / blank / mangled / 404 covers + body slots
// 2) Off-topic images (spa-on-hotel, tribal-chief-on-CRO, alt misses topic)
// Replaces bad slots with relevant hosted /assets/qa art. Stamps image_lead_done_at
// so the content drip can follow behind.
//
// Env:
//   WHITE_PURGE_BATCH=80
//   WHITE_PURGE_IDLE_MS=3000
//   WHITE_PURGE_EMAIL_EVERY=1   (immediate per-URL; owner default)
//   WHITE_PURGE_PILLAR=          (optional lock; default = all pillars)
//   WHITE_PURGE_ONCE=1
//   WHITE_PURGE_ORDER=smallest

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { sortSmallestPillarFirst, pillarOrderSummary } = require('./lib/pillar-inventory-order');
const { deployQaAssetFiles } = require('./lib/deploy-qa-assets');
const { checkImageContext } = require('./lib/image-context-check');
const {
  pexelsSearchApplicable,
  nextQaSlotId,
  replaceImageUrlInBody,
} = require('./lib/pexels-applicable');
let ensureAlternateFaceCover;
try {
  ({ ensureAlternateFaceCover } = require('../_ddg_facecard_lib'));
} catch (e) {
  console.error(JSON.stringify({ fatal: 'ddg_facecard: ' + e.message }));
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
if (!process.env.NETLIFY_AUTH_TOKEN && process.env.BLOBS_PAT) {
  process.env.NETLIFY_AUTH_TOKEN = process.env.BLOBS_PAT;
}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const SITE = 'https://pulserevops.com';
const BUSY_FILE = '/tmp/cursor-drip-busy.id';
const BATCH = Math.max(10, parseInt(process.env.WHITE_PURGE_BATCH || '80', 10));
const IDLE_MS = Math.max(500, parseInt(process.env.WHITE_PURGE_IDLE_MS || '3000', 10));
// Owner: email IMMEDIATELY on each finished URL (default 1).
const EMAIL_EVERY = Math.max(1, parseInt(process.env.WHITE_PURGE_EMAIL_EVERY || '1', 10) || 1);
const ONCE = String(process.env.WHITE_PURGE_ONCE || '') === '1';
// Pillar lock — e.g. WHITE_PURGE_PILLAR=tl (CRO Pulse Tools). Same as DRIP_PILLAR if unset.
const PILLAR_PREFIXES = String(process.env.WHITE_PURGE_PILLAR || process.env.DRIP_PILLAR || '')
  .split(/[,\s]+/)
  .map((x) => x.trim().toLowerCase())
  .filter(Boolean);
function idInPillar(id) {
  if (!PILLAR_PREFIXES.length) return true;
  const s = String(id || '').toLowerCase();
  return PILLAR_PREFIXES.some((p) => s.startsWith(p));
}
const ORDER_MODE = String(process.env.WHITE_PURGE_ORDER || 'smallest').toLowerCase(); // smallest | newest
const pillarKey = (PILLAR_PREFIXES.join(',') || 'all') + ':' + ORDER_MODE;
const STATE_KEY =
  PILLAR_PREFIXES.length
    ? '_white_image_purge_local_state_' + PILLAR_PREFIXES.join('-') + '_' + ORDER_MODE + '.json'
    : '_white_image_purge_local_state_' + ORDER_MODE + '.json';
const ASSET_DIR = path.join(process.cwd(), 'assets', 'qa');
fs.mkdirSync(ASSET_DIR, { recursive: true });

const MANGLED_RX =
  /(?:%2C%20|,)\s*realistic\s+magazine\s+style|nologo=true|model=flux|image\.pollinations\.ai|no%20watermark\?width=|prompt\/[^)\s]*no%20text/i;

function store() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!tok) throw new Error('BLOBS_PAT required');
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function entryTs(e) {
  const vals = [e.ts, e.polished_at, e.was_indexed_at, e.last_modified_ms].map((v) =>
    typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? +v : 0
  );
  return Math.max(0, ...vals);
}

function knowledgeUrl(id) {
  return SITE + '/knowledge/' + encodeURIComponent(id);
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

function wsrvUrl(abs) {
  const u = String(abs || '');
  if (!/^https?:\/\//i.test(u)) return null;
  if (/pulserevops\.com\/assets\//i.test(u) || /wsrv\.nl\//i.test(u)) return null;
  const bare = u.replace(/^https?:\/\//i, '');
  return 'https://wsrv.nl/?url=' + encodeURIComponent(bare) + '&w=760&output=webp&q=80&we&n=-1';
}

function dripBusyId() {
  try {
    return String(fs.readFileSync(BUSY_FILE, 'utf8') || '').trim().toLowerCase();
  } catch (e) {
    return '';
  }
}

const { sendOwnerEmail } = require('./lib/pulse-email');
async function emailOne(subject, html) {
  const r = await sendOwnerEmail(subject, html);
  return !!(r && r.ok);
}

function extractMdImageUrls(answer) {
  const urls = [];
  for (const line of String(answer || '').split('\n')) {
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

async function classifyImage(url) {
  if (!url) return { kind: 'empty', url };
  if (isMangled(url)) return { kind: 'mangled', url };
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) return { kind: 'ok', url, skipPurge: true };
  if (/img-missing|placeholder\.svg|\/img\/auto\//i.test(url)) return { kind: 'defunct', url };
  if (/\/colors\/|chalk\+?white|color.?swatch|paint.?chip|colou?r.?chip/i.test(url)) {
    return { kind: 'white', url, reason: 'color-swatch' };
  }
  const abs = absUrl(url);
  if (!abs) return { kind: 'empty', url };
  const via = wsrvUrl(abs) || abs;
  try {
    const r = await fetch(via, {
      headers: { 'User-Agent': 'PulseWhitePurgeLocal/1.0', Accept: 'image/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) {
      if (via !== abs) {
        try {
          const r2 = await fetch(abs, {
            headers: { 'User-Agent': 'PulseWhitePurgeLocal/1.0', Accept: 'image/*' },
            redirect: 'follow',
            signal: AbortSignal.timeout(12000),
          });
          if (!r2.ok) return { kind: 'defunct', status: r2.status, url: abs };
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
      // Broader blank catch — near-white / washed pages still read as white on site
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

function stripBadFromBody(body, badUrls) {
  const ban = new Set((badUrls || []).map((u) => normUrl(u)));
  const out = [];
  for (let line of String(body || '').split('\n')) {
    const isImgLine = /!\[[^\]]*\]\(/i.test(line);
    const isProd = /@@PRODUCT/i.test(line) && /img="/i.test(line);
    if (isImgLine) {
      if (isMangled(line)) continue;
      const m = line.match(/!\[[^\]]*\]\(([^)\s]+)\)/) || line.match(/!\[[^\]]*\]\((.+)\)\s*$/);
      if (m) {
        const u = normUrl(m[1]);
        const rel = u.replace(/^https?:\/\/(?:www\.)?pulserevops\.com/i, '');
        if (
          ban.has(u) ||
          ban.has(rel) ||
          [...ban].some((x) => x && (u.includes(x) || rel.includes(x) || line.includes(x)))
        ) {
          continue;
        }
      }
    }
    if (isProd) {
      for (const bad of ban) {
        if (bad && line.includes(bad)) {
          line = line.replace(/\s*img="[^"]*"/i, '');
          break;
        }
      }
      if (isMangled(line)) line = line.replace(/\s*img="[^"]*"/i, '');
    }
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function croCoverFallback(id) {
  let h = 0;
  const s = String(id || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return '/assets/cro-cover-' + ((h % 10) + 1) + '.jpg';
}

async function liveCoverOk(url) {
  if (!url) return false;
  if (/\/assets\/cro-cover-\d+\.jpg/i.test(url)) {
    const abs = absUrl(url);
    try {
      const r = await fetch(abs, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      });
      return r.ok;
    } catch (e) {
      return false;
    }
  }
  const bust = String(url).includes('?') ? url : url + '?purgev=' + Date.now();
  const cls = await classifyImage(bust);
  return cls.kind === 'ok';
}

/**
 * Re-read index (strong) and force cover fields — beats stampCoverProvenance races
 * that re-point img at a not-yet-deployed /assets/qa/{id}.jpg (white page).
 */
async function forceIndexCover(s, id, coverUrl, coverSrc, meta) {
  meta = meta || {};
  const canonId = String(id).toLowerCase();
  for (let attempt = 0; attempt < 3; attempt++) {
    const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
    if (!idx || !Array.isArray(idx.entries)) return null;
    const i = idx.entries.findIndex((e) => e && String(e.id).toLowerCase() === canonId);
    if (i < 0) return null;
    const ent = Object.assign({}, idx.entries[i]);
    if (coverUrl) {
      ent.img = coverUrl;
      ent.cover_src = coverSrc || ent.cover_src || 'white-purge-replace';
    } else {
      delete ent.img;
      delete ent.cover_src;
    }
    ent.face_title_baked = false;
    if (meta.face_purged_at) ent.face_purged_at = meta.face_purged_at;
    if (meta.face_purge_reason) ent.face_purge_reason = meta.face_purge_reason;
    if (meta.white_purge_local_at) ent.white_purge_local_at = meta.white_purge_local_at;
    if (meta.purged_image_urls) ent.purged_image_urls = meta.purged_image_urls;
    idx.entries[i] = ent;
    await s.setJSON('_index.json', idx);
    // verify read-back
    const again = await s.get('_index.json', { type: 'json', consistency: 'strong' });
    const check = (again.entries || []).find((e) => e && String(e.id).toLowerCase() === canonId);
    const got = check && check.img ? normUrl(check.img) : '';
    const want = coverUrl ? normUrl(coverUrl) : '';
    if (got === want && check && check.face_title_baked !== true) return again;
    await new Promise((r) => setTimeout(r, 400));
  }
  return null;
}

async function deployLocalCanon(id, local) {
  let dep = null;
  try {
    dep = await deployQaAssetFiles([local], { title: 'white-purge cover · ' + id });
  } catch (e) {
    console.log(JSON.stringify({ phase: 'cover-deploy-err', id, err: String(e.message || e).slice(0, 100) }));
    return null;
  }
  if (!dep || dep.ok === false) {
    console.log(JSON.stringify({ phase: 'cover-deploy-fail', id, err: dep && dep.error }));
    return null;
  }
  const canon = '/assets/qa/' + id + '.jpg';
  if (!(await liveCoverOk(canon))) {
    console.log(JSON.stringify({ phase: 'cover-replace-still-bad', id, kind: 'live-fail' }));
    return null;
  }
  return canon;
}

/** Production face cards always request /assets/qa/{id}.jpg — cro-cover index alone is not enough. */
async function copyCroCoverToCanon(id) {
  const fbRel = croCoverFallback(id);
  const src = path.join(process.cwd(), fbRel.replace(/^\//, ''));
  const local = path.join(ASSET_DIR, id + '.jpg');
  if (!fs.existsSync(src) || fs.statSync(src).size < 8000) return null;
  fs.copyFileSync(src, local);
  return deployLocalCanon(id, local);
}

async function replaceCover(s, id, question) {
  const local = path.join(ASSET_DIR, id + '.jpg');
  try {
    if (fs.existsSync(local)) fs.unlinkSync(local);
  } catch (e) {}
  const q = String(question || id).slice(0, 160);
  let ok = false;
  try {
    ok = !!(await ensureAlternateFaceCover(id, q, s, null, {
      qaUpgradeAlternate: true,
      forceNew: true,
      alternateSources: true,
    }));
  } catch (e) {
    console.log(JSON.stringify({ phase: 'cover-replace-err', id, err: String(e.message || e).slice(0, 120) }));
  }
  if (ok && fs.existsSync(local) && fs.statSync(local).size >= 8000) {
    const canon = await deployLocalCanon(id, local);
    if (canon) return canon;
  } else {
    console.log(JSON.stringify({ phase: 'cover-replace-miss-local', id, ok: !!ok }));
  }
  // Fallback: host cro-cover BYTES at the canonical face path (what live HTML actually loads)
  const fb = await copyCroCoverToCanon(id);
  if (fb) {
    console.log(JSON.stringify({ phase: 'cover-fallback-canon', id, from: croCoverFallback(id) }));
    return fb;
  }
  return null;
}

async function savePurged(s, idx, entryRow, blob, badUrls, reason, coverBad, newCover) {
  const id = String(entryRow.id).toLowerCase();
  const purgedList = Array.isArray(entryRow.purged_image_urls) ? entryRow.purged_image_urls.slice() : [];
  for (const u of badUrls) {
    const n = normUrl(u);
    if (n && !purgedList.includes(n)) purgedList.push(n);
  }
  const ts = new Date().toISOString();
  const coverSrc = newCover
    ? /\/assets\/cro-cover-\d+\.jpg/i.test(newCover)
      ? 'white-purge-fallback'
      : 'white-purge-replace'
    : null;
  if (blob) {
    const prevBanned = Array.isArray(blob.purged_image_urls) ? blob.purged_image_urls : [];
    const banned = [...new Set(prevBanned.concat(purgedList))];
    const next = Object.assign({}, blob, {
      answer: stripBadFromBody(blob.answer || '', banned),
      face_purged_at: ts,
      face_purge_reason: reason,
      purged_image_urls: banned,
      white_purge_local_at: ts,
      updated_at: ts,
    });
    if (coverBad || newCover) {
      next.cover_src = coverSrc;
      next.face_title_baked = false;
      // Always set a working cover URL — never leave 404 /assets/qa/{id}.jpg
      delete next.img;
      if (newCover) next.img = newCover;
    }
    await s.setJSON('answers/' + id + '.json', next);
  }
  const i = (idx.entries || []).findIndex((e) => e && String(e.id).toLowerCase() === id);
  if (i >= 0) {
    const ent = Object.assign({}, idx.entries[i]);
    if (coverBad || newCover) {
      delete ent.img;
      delete ent.cover_src;
      ent.face_title_baked = false;
      if (newCover) {
        ent.img = newCover;
        ent.cover_src = coverSrc;
      }
    }
    ent.face_purged_at = ts;
    ent.face_purge_reason = reason;
    ent.purged_image_urls = purgedList;
    ent.white_purge_local_at = ts;
    idx.entries[i] = ent;
  }
  // Strong re-patch — facecard stampCoverProvenance often re-writes broken canon mid-flight
  if (coverBad || newCover) {
    const patched = await forceIndexCover(s, id, newCover || null, coverSrc, {
      face_purged_at: ts,
      face_purge_reason: reason,
      white_purge_local_at: ts,
      purged_image_urls: purgedList,
    });
    if (patched && Array.isArray(idx.entries)) {
      const pi = patched.entries.findIndex((e) => e && String(e.id).toLowerCase() === id);
      const mi = idx.entries.findIndex((e) => e && String(e.id).toLowerCase() === id);
      if (pi >= 0 && mi >= 0) idx.entries[mi] = patched.entries[pi];
    }
  }
  return knowledgeUrl(id);
}

const emailBuf = [];
let lastDigestAt = 0;

async function flushDigest(reason, itemsOpt) {
  const items = itemsOpt || emailBuf.splice(0, emailBuf.length);
  if (!items.length) return false;
  lastDigestAt = Date.now();
  const one = items.length === 1 ? items[0] : null;
  const subject = (
    one
      ? 'PULSE image lead · ' +
        one.id +
        ' · ' +
        String(one.reason || 'images').slice(0, 60) +
        ' · ' +
        new Date().toISOString().slice(11, 16) +
        'Z'
      : 'PULSE image lead · ' +
        items.length +
        ' URLs · ' +
        new Date().toISOString().slice(11, 16) +
        'Z · ' +
        items
          .slice(0, 3)
          .map((x) => x.id)
          .join(', ')
  ).slice(0, 180);
  const html = one
    ? '<p><b>Image lead finished</b> — white/404 purge + context-applicable replace.</p>' +
      '<p><a href="' +
      esc(one.url) +
      '">' +
      esc(one.id) +
      '</a> · ' +
      esc(one.reason) +
      ' · ' +
      (one.bad || 0) +
      ' slot(s)' +
      (one.cover ? ' · cover ' + esc(one.cover) : '') +
      '</p>'
    : '<p><b>Image lead</b> (' +
      esc(reason) +
      ') — white/404 + off-topic context replace.</p><ol>' +
      items
        .map(
          (x) =>
            '<li><a href="' +
            esc(x.url) +
            '">' +
            esc(x.id) +
            '</a> · ' +
            esc(x.reason) +
            ' · ' +
            (x.bad || 0) +
            ' slot(s)' +
            (x.cover ? ' · cover ' + esc(x.cover) : '') +
            '</li>'
        )
        .join('') +
      '</ol>';
  console.log(JSON.stringify({ phase: 'email', reason, count: items.length, ids: items.map((x) => x.id) }));
  await emailOne(subject, html);
  return true;
}

async function queueDigest(item) {
  emailBuf.push(item);
  // Immediate when EMAIL_EVERY=1 (owner default)
  while (emailBuf.length >= EMAIL_EVERY) {
    const batch = emailBuf.splice(0, EMAIL_EVERY);
    await flushDigest('every-' + EMAIL_EVERY, batch);
  }
}

async function stampImageLeadDone(s, id, extra) {
  const ts = new Date().toISOString();
  try {
    const blob = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!blob) return;
    await s.setJSON(
      'answers/' + id + '.json',
      Object.assign({}, blob, extra || {}, {
        image_lead_done_at: ts,
        updated_at: ts,
      })
    );
  } catch (e) {}
}

async function replaceOffTopicSlots(s, id, blob, pageTitle) {
  const body0 = String(blob.answer || '');
  const urls = extractMdImageUrls(body0).slice(0, 24);
  const off = [];
  for (const u of urls) {
    if (/\/assets\/cro-cover-\d+\.jpg/i.test(u)) continue;
    const ctx = checkImageContext(u, body0, pageTitle);
    if (ctx.offTopic) off.push({ url: u, ...ctx });
  }
  if (!off.length) return { body: body0, replaced: 0, reasons: [] };

  let body = body0;
  const reasons = [];
  const deployed = [];
  let replaced = 0;
  for (const item of off.slice(0, 8)) {
    try {
      const slotId = nextQaSlotId(id, ASSET_DIR);
      const q = String((item.section !== '(intro)' ? item.section + ' ' : '') + pageTitle).slice(0, 120);
      const got = await pexelsSearchApplicable(q, slotId, ASSET_DIR);
      const rel = got.rel;
      const abs = path.join(ASSET_DIR, path.basename(rel));
      if (!fs.existsSync(abs) || fs.statSync(abs).size < 8000) continue;
      body = replaceImageUrlInBody(body, item.url, rel);
      deployed.push(abs);
      replaced++;
      reasons.push('offtopic:' + (item.reason || 'context'));
      console.log(
        JSON.stringify({
          phase: 'offtopic-replaced',
          id,
          reason: item.reason,
          section: String(item.section || '').slice(0, 60),
          from: String(item.url).slice(0, 80),
          to: rel,
        })
      );
    } catch (e) {
      console.log(
        JSON.stringify({
          phase: 'offtopic-miss',
          id,
          reason: item.reason,
          err: String(e.message || e).slice(0, 100),
        })
      );
    }
  }
  if (deployed.length) {
    try {
      await deployQaAssetFiles(deployed, { title: 'image-lead offtopic · ' + id });
    } catch (e) {
      console.log(JSON.stringify({ phase: 'offtopic-deploy-err', id, err: String(e.message || e).slice(0, 100) }));
    }
  }
  return { body, replaced, reasons };
}

async function processOne(s, idx, row) {
  const id = String(row.id).toLowerCase();
  if (dripBusyId() === id) {
    return { id, action: 'skip-drip-busy' };
  }
  let blob = null;
  try {
    blob = await s.get('answers/' + id + '.json', { type: 'json' });
  } catch (e) {
    return { id, action: 'missing' };
  }
  const question = (blob && (blob.question || blob.title)) || (row && (row.question || row.title)) || id;
  const cover = (row && (row.img || row.cover)) || (blob && blob.img) || '';
  const canon = '/assets/qa/' + id + '.jpg';
  let bodyUrls = blob && blob.answer ? extractMdImageUrls(blob.answer) : [];
  // Always probe cover + canonical face (versioned covers can hide a 404 canon)
  const candidates = [...new Set([cover, canon, ...bodyUrls].filter(Boolean))].slice(0, 40);
  const bad = [];
  const reasons = [];
  let coverBad = false;

  const coverLive = cover ? await liveCoverOk(cover) : false;

  for (const u of candidates) {
    if (/\/assets\/cro-cover-\d+\.jpg/i.test(u)) continue;
    if (isMangled(u)) {
      bad.push(u);
      reasons.push('mangled');
      if (cover && (u === cover || normUrl(u) === normUrl(cover))) coverBad = true;
      if (/\/assets\/qa\/[^/]+-v\d+\.jpg/i.test(u)) coverBad = true;
      // Canon mangled only matters when it is the active hero
      if (normUrl(u) === normUrl(canon) && (!cover || !coverLive)) coverBad = true;
      continue;
    }
    const cls = await classifyImage(u);
    if (cls.kind === 'ok' || cls.kind === 'empty') continue;
    if (cls.kind === 'white' || cls.kind === 'defunct' || cls.kind === 'mangled') {
      bad.push(u);
      reasons.push(cls.kind + (cls.reason ? ':' + cls.reason : ''));
      const isActiveCover =
        cover && (u === cover || normUrl(u) === normUrl(cover) || absUrl(u) === absUrl(cover));
      const isVersioned = /\/assets\/qa\/[^/]+-v\d+\.jpg/i.test(u);
      const isCanon = normUrl(u) === normUrl(canon);
      if (isActiveCover || isVersioned) coverBad = true;
      // Canon 404/white is coverBad only when index has no working cover
      // (render + face_title_baked still use /assets/qa/{id}.jpg)
      if (isCanon && (!cover || !coverLive)) coverBad = true;
    }
  }

  // No body/cover image at all → still a white page
  if (!cover && !bodyUrls.length) {
    coverBad = true;
    reasons.push('no-images');
  }

  // Index points at a cover that is still 404/white live — treat as coverBad even if body ok
  if (cover && !coverLive) {
    coverBad = true;
    if (!bad.includes(cover)) bad.push(cover);
    reasons.push('live-cover-bad');
  } else if (!cover && !(await liveCoverOk(canon))) {
    // Render often falls back to /assets/qa/{id}.jpg when face_title_baked
    coverBad = true;
    reasons.push('live-canon-bad');
  }

  // Off-topic / wrong-context images (even if they load fine)
  let offtopicReplaced = 0;
  if (blob && blob.answer) {
    const ot = await replaceOffTopicSlots(s, id, blob, question);
    if (ot.replaced) {
      blob.answer = ot.body;
      offtopicReplaced = ot.replaced;
      reasons.push(...ot.reasons);
      bodyUrls = extractMdImageUrls(blob.answer);
    }
  }

  if (!bad.length && !coverBad && !offtopicReplaced) {
    await stampImageLeadDone(s, id, { image_lead_status: 'ok' });
    return { id, action: 'ok' };
  }

  let newCover = null;
  let coverMode = 'kept';
  if (coverBad) {
    newCover = await replaceCover(s, id, question);
    if (newCover) {
      reasons.push('cover-replaced');
      coverMode = 'replaced';
    } else {
      reasons.push('cover-replace-miss');
      coverMode = 'miss';
    }
  }

  const reason = [...new Set(reasons)].join(',') || 'white-or-defunct';
  const url = await savePurged(s, idx, row, blob, bad, reason, coverBad, newCover);
  await stampImageLeadDone(s, id, {
    image_lead_status: 'fixed',
    image_lead_reason: reason,
    white_purge_local_at: new Date().toISOString(),
  });

  // Final live gate — do NOT email "fixed" if the hero cover is still 404/white
  let liveOk = true;
  if (coverBad) {
    const finalCover = newCover || cover || canon;
    liveOk = await liveCoverOk(finalCover);
    if (!liveOk && newCover && newCover !== canon) liveOk = await liveCoverOk(newCover);
    if (!liveOk) {
      console.log(
        JSON.stringify({
          phase: 'purge-live-fail',
          id,
          cover: finalCover,
          reason,
        })
      );
      return {
        id,
        action: 'purge-incomplete',
        reason: reason + ',live-verify-fail',
        bad: bad.length + offtopicReplaced,
        url,
        coverReplaced: coverMode === 'replaced',
        coverMode,
      };
    }
  }

  await queueDigest({
    id,
    url,
    reason,
    bad: bad.length + offtopicReplaced,
    cover: coverMode === 'kept' ? 'kept' : newCover || 'cleared',
  });
  return {
    id,
    action: 'purge',
    reason,
    bad: bad.length + offtopicReplaced,
    url,
    coverReplaced: coverMode === 'replaced',
    coverMode,
    liveOk,
    offtopic: offtopicReplaced,
  };
}

async function ensureInventory(s, state) {
  const need =
    !Array.isArray(state.inventoryIds) ||
    !state.inventoryIds.length ||
    !state.inventoryBuiltAt ||
    state.pillarLock !== pillarKey ||
    Date.now() - Date.parse(state.inventoryBuiltAt) > 6 * 3600 * 1000;
  if (!need) return;
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('no index');
  const rows = idx.entries.filter(
    (e) => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)) && idInPillar(e.id)
  );
  let ids = rows.map((e) => String(e.id).toLowerCase());
  if (ORDER_MODE === 'newest') {
    ids = rows
      .slice()
      .sort((a, b) => entryTs(b) - entryTs(a))
      .map((e) => String(e.id).toLowerCase());
  } else {
    ids = sortSmallestPillarFirst(ids);
  }
  state.inventoryIds = ids;
  state.inventoryBuiltAt = new Date().toISOString();
  state.pillarLock = pillarKey;
  state.cursor = 0;
  state.doneIds = [];
  const order = pillarOrderSummary(ids);
  console.log(
    JSON.stringify({
      phase: 'inventory',
      inventory: ids.length,
      pillar: pillarKey,
      order: ORDER_MODE,
      firstPillars: order.slice(0, 8),
      lastPillars: order.slice(-4),
    })
  );
}

async function tick(s, state) {
  await ensureInventory(s, state);
  const inventory = state.inventoryIds || [];
  if (!inventory.length) return { scanned: 0, remaining: 0 };

  const done = new Set(state.doneIds || []);
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map((idx.entries || []).filter((e) => e && e.id).map((e) => [String(e.id).toLowerCase(), e]));

  let scanned = 0;
  let purged = 0;
  let okN = 0;
  let skipped = 0;
  let indexDirty = false;
  const startCursor = state.cursor || 0;

  while (scanned < BATCH) {
    if ((state.cursor || 0) >= inventory.length) {
      state.cursor = 0;
      // Full pass complete — clear done set so we re-scan for new white/broken later
      if (done.size >= inventory.length * 0.95) {
        console.log(JSON.stringify({ phase: 'wrap', done: done.size, inventory: inventory.length }));
        done.clear();
        state.passes = (state.passes || 0) + 1;
      }
      if (scanned > 0) break;
    }
    const id = inventory[state.cursor || 0];
    state.cursor = (state.cursor || 0) + 1;
    if (done.has(id)) {
      skipped++;
      scanned++;
      continue;
    }
    const row = byId.get(id) || { id };
    const t0 = Date.now();
    const r = await processOne(s, idx, row);
    scanned++;
    if (r.action === 'purge') {
      purged++;
      indexDirty = true;
      done.add(id);
    } else if (r.action === 'purge-incomplete') {
      // Stripped/attempted but live cover still bad — retry later, do not claim fixed
      indexDirty = true;
      skipped++;
    } else if (r.action === 'ok' || r.action === 'missing') {
      okN++;
      done.add(id);
    } else if (r.action === 'skip-drip-busy') {
      skipped++;
      // do not mark done — retry next pass
    } else {
      done.add(id);
    }
    console.log(
      JSON.stringify({
        progress: true,
        scanned,
        purged,
        ok: okN,
        skipped,
        cursor: state.cursor,
        id,
        action: r.action,
        bad: r.bad || 0,
        coverMode: r.coverMode || null,
        ms: Date.now() - t0,
      })
    );
  }

  if (indexDirty) await s.setJSON('_index.json', idx);
  state.doneIds = [...done];
  state.scanned = (state.scanned || 0) + scanned;
  state.purged = (state.purged || 0) + purged;
  state.ok = (state.ok || 0) + okN;
  state.lastRunAt = new Date().toISOString();
  state.lastBatch = { scanned, purged, ok: okN, skipped, startCursor };
  await s.setJSON(STATE_KEY, state);

  console.log(
    JSON.stringify({
      phase: 'tick',
      scanned,
      purged,
      ok: okN,
      skipped,
      cursor: state.cursor,
      inventory: inventory.length,
      done: done.size,
      totals: { scanned: state.scanned, purged: state.purged, ok: state.ok },
      emailBuf: emailBuf.length,
    })
  );
  // Don't leave digests sitting — flush after each tick if anything pending
  if (emailBuf.length) await flushDigest('tick');
  return { scanned, purged, remaining: Math.max(0, inventory.length - done.size) };
}

async function main() {
  const s = store();
  let state = { doneIds: [], cursor: 0, scanned: 0, purged: 0, ok: 0, inventoryIds: [] };
  try {
    state = Object.assign(state, (await s.get(STATE_KEY, { type: 'json' })) || {});
  } catch (e) {}

  // No startup spam — first digest fires at 10 purged pages
  console.log(
    JSON.stringify({
      phase: 'start',
      batch: BATCH,
      idleMs: IDLE_MS,
      emailEvery: EMAIL_EVERY,
      pillar: pillarKey,
      stateKey: STATE_KEY,
    })
  );

  for (;;) {
    try {
      const r = await tick(s, state);
      if (emailBuf.length && Date.now() - lastDigestAt > 15 * 60 * 1000) await flushDigest('max-gap');
      if (ONCE) {
        await flushDigest('once-exit');
        break;
      }
      if (!r.purged && r.remaining === 0) {
        await new Promise((x) => setTimeout(x, IDLE_MS * 4));
        state.inventoryBuiltAt = null; // refresh
      } else {
        await new Promise((x) => setTimeout(x, IDLE_MS));
      }
    } catch (e) {
      console.log(JSON.stringify({ phase: 'error', err: String(e.message || e).slice(0, 200) }));
      await new Promise((x) => setTimeout(x, 5000));
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: String(e.message || e) }));
  process.exit(1);
});
