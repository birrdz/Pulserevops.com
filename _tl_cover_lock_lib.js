/**
 * CRO/tl cover lock — owner hate title-baked flux faces.
 * Always use curated /assets/cro-cover-1..6.jpg (live). Never re-bake.
 */
'use strict';

const SAFE_COVERS = 6; // cro-cover-7..10 are 404 on prod

function croCoverForId(id) {
  const n = Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0);
  return '/assets/cro-cover-' + ((n % SAFE_COVERS) + 1) + '.jpg';
}

function stripPollinationsMd(body) {
  return String(body || '').replace(/!\[[^\]]*\]\(https?:\/\/image\.pollinations\.ai\/[^)]+\)\s*/gi, '');
}

/** Absolute or site-relative cro-cover URL → relative path. */
function normalizeCroCover(url) {
  const s = String(url || '');
  const m = s.match(/\/assets\/cro-cover-([1-6])\.jpg/i);
  return m ? '/assets/cro-cover-' + m[1] + '.jpg' : '';
}

/**
 * Patch answer blob fields to locked curated cover.
 * Does not rewrite prose except stripping live pollinations md images.
 */
function lockTlAnswerEntry(entry, id) {
  const cover = croCoverForId(id);
  const prev = String(entry.answer || '');
  const nextBody = stripPollinationsMd(prev);
  const out = Object.assign({}, entry, {
    img: cover,
    cover,
    cover_src: 'cro-cover-locked',
    face_title_baked: false,
    face_locked: true,
    face_lock_at: Date.now(),
    updated_at: new Date().toISOString(),
  });
  if (nextBody !== prev) out.answer = nextBody;
  return { entry: out, cover, bodyChanged: nextBody !== prev };
}

/** Patch one index row in place. */
function lockTlIndexRow(row, id) {
  if (!row) return null;
  const cover = croCoverForId(id || row.id);
  return Object.assign({}, row, {
    img: cover,
    cover_src: 'cro-cover-locked',
    face_title_baked: false,
  });
}

function isTlId(id) {
  return /^tl\d+$/i.test(String(id || ''));
}

module.exports = {
  SAFE_COVERS,
  croCoverForId,
  stripPollinationsMd,
  normalizeCroCover,
  lockTlAnswerEntry,
  lockTlIndexRow,
  isTlId,
};
