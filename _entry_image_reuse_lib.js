// _entry_image_reuse_lib.js — reuse Top-10 @@PRODUCT or internal section images as face-card cover.
//
// Owner law (2026-07-08): any self-hosted image already on the entry (ranked product photo first,
// then section markdown images) may be promoted to /assets/qa/<id>.jpg for the mosaic face-card AND
// synced as the top hero markdown line — no new provider fetch required.
'use strict';

const fs = require('fs');
const path = require('path');
const {
  coverPath,
  coverFileOk,
  gradeFaceCardFromBuffer,
  verifyQaAssetRenders,
  stampCoverProvenance,
} = require('./_ddg_facecard_lib');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const { enumerateProductSlots } = require('./_mv_image_title_match');
const { shouldSkipMv } = require('./netlify/functions/lib/mv-pillar-guard');

const WD = path.join(__dirname);

const FACE_GENERIC = /\/assets\/cro-cover-\d|placeholder|og-preview|pulse-og|no-?image|pollinations\.ai/i;
const VALID_COVER_SRC = new Set(['flux', 'pexels', 'ddg-facecard', 'internal-reuse', 'product-reuse']);

function localAssetPath(url) {
  const u = String(url || '').trim().split('?')[0];
  if (!u.startsWith('/assets/')) return '';
  const abs = path.join(WD, u.replace(/^\//, ''));
  return fs.existsSync(abs) ? abs : '';
}

function isReusableUrl(url, id) {
  if (!url || FACE_GENERIC.test(url)) return false;
  if (/^https?:\/\//i.test(url)) return false;
  if (!/^\/assets\//.test(url)) return false;
  if (url === '/assets/qa/' + id + '.jpg') return false;
  const abs = localAssetPath(url);
  if (!abs) return false;
  try { return fs.statSync(abs).size > 20000; } catch (e) { return false; }
}

/** @@PRODUCT imgs in rank order, then markdown section images (excluding current face path). */
function listReusableEntryImages(body, id) {
  const out = [];
  const seen = new Set();
  const slots = enumerateProductSlots(body);
  slots.sort((a, b) => (a.rank || 99) - (b.rank || 99));
  for (const s of slots) {
    const u = s.url || '';
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push({ url: u, kind: 'product', rank: s.rank || 0, label: s.name || '' });
  }
  const md = /!\[[^\]]*\]\(([^)\s]+)/g;
  let m;
  const s = String(body || '');
  while ((m = md.exec(s))) {
    const u = m[1];
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push({ url: u, kind: 'section', rank: 100 + out.length, label: '' });
  }
  return out.filter((c) => isReusableUrl(c.url, id));
}

function coverSrcIsValid(src) {
  return VALID_COVER_SRC.has(String(src || ''));
}

/**
 * Copy a self-hosted entry image to the face-card file (square crop + gold title).
 * @returns {Promise<{ ok: boolean, bytes: number, coverSrc: string }>}
 */
async function promoteUrlToFaceCard(id, question, sourceUrl, opts) {
  opts = opts || {};
  const abs = localAssetPath(sourceUrl);
  if (!abs) return { ok: false, bytes: 0, coverSrc: '' };
  try {
    const buf = fs.readFileSync(abs);
    const kind = opts.kind === 'product' ? 'product-reuse' : 'internal-reuse';
    await gradeFaceCardFromBuffer(buf, coverPath(id), { question: question || id });
    const bytes = fs.statSync(coverPath(id)).size;
    if (bytes < 40000) return { ok: false, bytes, coverSrc: kind };
    const renders = await verifyQaAssetRenders('/assets/qa/' + id + '.jpg', id);
    if (renders === false) return { ok: false, bytes, coverSrc: kind };
    return { ok: true, bytes, coverSrc: kind };
  } catch (e) {
    return { ok: false, bytes: 0, coverSrc: '', error: e.message };
  }
}

/**
 * Pick the best internal/top-10 image and set it as face-card + hero markdown.
 * @param {{ store?: object, force?: boolean, entryMeta?: object }} opts
 */
async function ensureFaceCardFromEntryImages(id, question, body, opts) {
  opts = opts || {};
  if (shouldSkipMv({ id })) {
    return { applied: false, body, reason: 'mv-excluded' };
  }
  const meta = opts.entryMeta || {};
  const existingSrc = meta.cover_src || '';
  if (!opts.force && coverFileOk(id) && coverSrcIsValid(existingSrc)) {
    const synced = syncHeroDupesFaceCard(id, question, body);
    return { applied: false, body: synced, reason: 'cover-ok', coverSrc: existingSrc };
  }

  const candidates = listReusableEntryImages(body, id);
  for (const c of candidates) {
    const promoted = await promoteUrlToFaceCard(id, question, c.url, { kind: c.kind });
    if (!promoted.ok) continue;
    let outBody = syncHeroDupesFaceCard(id, question, body);
    if (opts.store) {
      await stampCoverProvenance(id, opts.store, promoted.coverSrc, { faceTitleBaked: true });
    }
    return {
      applied: true,
      body: outBody,
      sourceUrl: c.url,
      coverSrc: promoted.coverSrc,
      kind: c.kind,
      rank: c.rank,
      bytes: promoted.bytes,
    };
  }
  return { applied: false, body, reason: candidates.length ? 'promote-failed' : 'no-candidates' };
}

module.exports = {
  VALID_COVER_SRC,
  listReusableEntryImages,
  isReusableUrl,
  promoteUrlToFaceCard,
  ensureFaceCardFromEntryImages,
  coverSrcIsValid,
};
