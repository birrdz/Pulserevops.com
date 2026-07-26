#!/usr/bin/env node
'use strict';
/**
 * TL image freeze — stop old / banned images from coming back after text passes.
 *
 * Problem: preserveImages / enforceWriterVisualLock re-inserts the ORIGINAL
 * body's image list. If that list still had pollinations, cost graphs, or
 * superseded /assets/qa/tlNNNN(-v*).jpg faces, they resurrect after every DS pass.
 *
 * Fix:
 *  1. Strip banned URLs from the body (and from the "original" used for preserve).
 *  2. Lock cover via lockTlAnswerEntry (cro face pool + cover_src).
 *  3. Persist tl_allowed_body_imgs so later passes only restore the clean set.
 *  4. Drop face_path / bb_images that point at banned assets.
 */

const {
  preserveImages: preserveImagesSlots,
  collectImageLines,
} = require('./_visual_lock_law');
const { classifyCostImg, stripCostImages } = require('./_tl_cost_image_strip_lib');
const {
  lockTlAnswerEntry,
  isTlId,
  croCoverForId,
  isLockedFaceUrl,
} = require('./_tl_cover_lock_lib');

const BANNED_BODY_RE = [
  /pollinations\.ai/i,
  /image\.pollinations\.ai/i,
  /\/assets\/qa\/tl\d+(?:-v\d+)?\.(?:jpg|jpeg|png|webp)/i,
  /\/assets\/cro-cover-[45]\.jpg/i,
];

function urlFromImgLine(line) {
  const m = String(line || '').match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? String(m[1]).trim() : '';
}

function extractImageUrls(body) {
  return collectImageLines(body)
    .map(urlFromImgLine)
    .filter(Boolean);
}

function isBannedTlBodyImageUrl(url) {
  const u = String(url || '').trim();
  if (!u) return true;
  if (BANNED_BODY_RE.some((re) => re.test(u))) return true;
  // Cost classifier needs full markdown line context for alt-based rules
  const fake = `![](${u})`;
  if (classifyCostImg(fake)) return true;
  return false;
}

function isBannedTlImgLine(line) {
  const s = String(line || '');
  if (classifyCostImg(s)) return true;
  const url = urlFromImgLine(s);
  if (!url) return /^@@PRODUCT\b/.test(s.trim()) ? false : true;
  return isBannedTlBodyImageUrl(url);
}

function stripBannedTlBodyImages(body) {
  const cost = stripCostImages(String(body || ''));
  let next = cost.next;
  const removed = [...cost.removed];
  next = next.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (full, url) => {
    if (isBannedTlImgLine(full) || isBannedTlBodyImageUrl(url)) {
      removed.push(String(url).trim());
      return '';
    }
    return full;
  });
  next = next
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
  if (next) next += '\n';
  return { body: next, removed: [...new Set(removed)] };
}

/** Prefer persisted allow-list; else strip bans from source body. */
function resolveAllowedBodyImgs(entry, bodyFallback) {
  const persisted = Array.isArray(entry && entry.tl_allowed_body_imgs)
    ? entry.tl_allowed_body_imgs.map(String).filter(Boolean)
    : [];
  if (persisted.length) {
    return persisted.filter((u) => !isBannedTlBodyImageUrl(u));
  }
  const src =
    bodyFallback != null ? bodyFallback : (entry && (entry.answer || entry.body)) || '';
  const cleaned = stripBannedTlBodyImages(src);
  return extractImageUrls(cleaned.body);
}

/**
 * Drop-in for format_fixer / booster preserveImages(original, newBody, opts)
 * on tl* entries. Strips bans from BOTH sides before slot restore so
 * superseded faces / pollinations never re-enter.
 */
function preserveTlImages(originalBody, newBody, entryOrOpts) {
  const entry =
    entryOrOpts &&
    typeof entryOrOpts === 'object' &&
    (entryOrOpts.answer != null || entryOrOpts.tl_allowed_body_imgs)
      ? entryOrOpts
      : entryOrOpts && entryOrOpts.entryMeta
        ? entryOrOpts.entryMeta
        : entryOrOpts || {};

  const draftClean = stripBannedTlBodyImages(newBody || '').body;
  const origClean = stripBannedTlBodyImages(originalBody || '').body;

  let allow = resolveAllowedBodyImgs(entry, origClean);
  if (!allow.length) allow = extractImageUrls(origClean);

  // Synthetic original: only allowed URLs, so slot restore cannot pull bans.
  let syntheticOrig = origClean;
  const origImgs = collectImageLines(origClean).filter((l) => /^!\[/.test(l.trim()));
  if (allow.length && origImgs.length) {
    let ai = 0;
    syntheticOrig = origClean.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (full, url) => {
      if (isBannedTlBodyImageUrl(url)) return '';
      if (ai < allow.length) {
        const nextUrl = allow[ai++];
        return full.replace(String(url).trim(), nextUrl);
      }
      return full;
    });
  } else if (allow.length && !origImgs.length) {
    return draftClean;
  }

  let out = preserveImagesSlots(syntheticOrig, draftClean);
  out = stripBannedTlBodyImages(out).body;

  if (allow.length && extractImageUrls(out).some((u) => isBannedTlBodyImageUrl(u))) {
    let ai = 0;
    out = out.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (full, url) => {
      if (isBannedTlBodyImageUrl(url)) {
        if (ai < allow.length) {
          const nextUrl = allow[ai++];
          const alt = (full.match(/^!\[([^\]]*)\]/) || [])[1] || 'Image';
          return `![${alt}](${nextUrl})`;
        }
        return '';
      }
      ai++;
      return full;
    });
    out = out.replace(/\n{3,}/g, '\n\n').trim();
    if (out) out += '\n';
  }
  return out;
}

/**
 * Freeze one answer blob: strip bans, lock cover, stamp allow-list.
 * Uses `answer` field — Netlify blob shape.
 */
function freezeTlEntryImages(entry, id) {
  if (!entry || typeof entry !== 'object') {
    return { entry, changed: false, removed: [], allowed: [], cover: null };
  }
  const eid = id || entry.id || '';
  const before = String(entry.answer || entry.body || '');
  const stripped = stripBannedTlBodyImages(before);
  const next = Object.assign({}, entry);
  if (entry.answer != null || !entry.body) next.answer = stripped.body;
  if (entry.body != null && entry.answer == null) next.body = stripped.body;

  // Restore CC 50-face pool mapping when cover is missing/bad/scrambled.
  // Never invent a different face when already on the correct pool slot.
  const want = croCoverForId(eid);
  const have = String(next.img || next.cover || '');
  let locked = { entry: next, cover: have || want, bodyChanged: false };
  if (!have || !isLockedFaceUrl(have) || have !== want) {
    locked = lockTlAnswerEntry(next, eid);
  }
  const out = locked.entry;
  const cover = out.cover || locked.cover || want;
  if (cover) {
    out.cover = cover;
    out.img = cover;
    out.face = cover;
    out.cover_src = 'cro-face-pool';
    out.face_locked = true;
  }

  const allow = extractImageUrls(out.answer || out.body || '').filter(
    (u) => u && !isBannedTlBodyImageUrl(u)
  );
  out.tl_allowed_body_imgs = allow;
  out.tl_images_frozen_at = new Date().toISOString();

  if (out.face_path && isBannedTlBodyImageUrl(out.face_path)) delete out.face_path;
  if (Array.isArray(out.bb_images)) {
    out.bb_images = out.bb_images.filter((u) => !isBannedTlBodyImageUrl(u));
  }

  const after = String(out.answer || out.body || '');
  const metaChanged =
    String(entry.img || '') !== String(out.img || '') ||
    String(entry.cover || '') !== String(out.cover || '') ||
    String(entry.face || '') !== String(out.face || '') ||
    JSON.stringify(entry.tl_allowed_body_imgs || null) !== JSON.stringify(allow);
  const changed =
    before !== after ||
    !!locked.bodyChanged ||
    stripped.removed.length > 0 ||
    metaChanged;

  return {
    entry: out,
    changed,
    removed: stripped.removed,
    allowed: allow,
    cover: out.cover || locked.cover || null,
  };
}

module.exports = {
  isTlId,
  isBannedTlBodyImageUrl,
  stripBannedTlBodyImages,
  resolveAllowedBodyImgs,
  preserveTlImages,
  freezeTlEntryImages,
  extractImageUrls,
};
