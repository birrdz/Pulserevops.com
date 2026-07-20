/**
 * CRO/tl cover lock — curated face/hero pool (50), rotate by id.
 * Face card and hero MAY match / dupe (owner 2026-07-20).
 * Never re-bake title-flux /assets/qa/tlNNNN.jpg faces.
 *
 * Pool order + length are LOCKED — do not filter slots at runtime
 * (changes id→face mapping). Body image bans live in _tl_image_freeze_lib.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SAFE_COVERS = 6; // cro-cover-1..6 fallback
const FACES_FILE = process.env.TL_CRO_FACES || path.join(__dirname, '_tl_cro_faces50.json');

let _faces = null;
function loadFaces() {
  if (_faces) return _faces;
  try {
    const raw = JSON.parse(fs.readFileSync(FACES_FILE, 'utf8'));
    const list = (raw.faces || raw.available || raw.pool || [])
      .map((x) => (typeof x === 'string' ? x : x && x.img))
      .filter((u) => u && /^\/assets\//i.test(u));
    if (list.length >= 10) {
      _faces = list;
      return _faces;
    }
  } catch (_e) {}
  _faces = [];
  for (let i = 1; i <= SAFE_COVERS; i++) _faces.push('/assets/cro-cover-' + i + '.jpg');
  return _faces;
}

function idNum(id) {
  return Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0);
}

/** Rotating face/hero for tl — same URL OK for both slots. */
function croCoverForId(id) {
  const faces = loadFaces();
  const n = idNum(id);
  return faces[n % faces.length];
}

/** Face + hero are the same image (explicit dupe allowed). */
function faceAndHeroForId(id) {
  const cover = croCoverForId(id);
  return { face: cover, hero: cover, img: cover };
}

function stripPollinationsMd(body) {
  return String(body || '').replace(/!\[[^\]]*\]\(https?:\/\/image\.pollinations\.ai\/[^)]+\)\s*/gi, '');
}

/** Accept cro-cover OR any /assets/qa/ pool face from the 50 list. */
function normalizeCroCover(url) {
  const s = String(url || '').split('?')[0];
  const m = s.match(/\/assets\/cro-cover-([1-6])\.jpg/i);
  if (m) return '/assets/cro-cover-' + m[1] + '.jpg';
  const faces = loadFaces();
  if (faces.includes(s)) return s;
  return '';
}

/** True if cover/img is already a valid locked face (pool or cro-cover). */
function isLockedFaceUrl(url) {
  const s = String(url || '').split('?')[0];
  if (!s) return false;
  if (/pollinations\.ai/i.test(s)) return false;
  // Superseded per-page flux faces — not the curated pool
  if (/\/assets\/qa\/tl\d+(?:-v\d+)?\.(?:jpg|jpeg|png|webp)$/i.test(s)) return false;
  if (normalizeCroCover(s)) return true;
  if (loadFaces().includes(s)) return true;
  if (/\/assets\/qa\/pool-tl-\d+\.jpg/i.test(s)) return true;
  if (/\/assets\/qa\/tl\d+-b\d+\.jpg/i.test(s)) return true;
  return false;
}

/**
 * Patch answer blob fields to locked curated face/hero (may be identical).
 */
function lockTlAnswerEntry(entry, id) {
  const cover = croCoverForId(id);
  const prev = String(entry.answer || '');
  const nextBody = stripPollinationsMd(prev);
  const out = Object.assign({}, entry, {
    img: cover,
    cover,
    face: cover, // face card == hero (dupe OK)
    cover_src: 'cro-face-pool',
    face_title_baked: false,
    face_locked: true,
    face_lock_at: Date.now(),
    updated_at: new Date().toISOString(),
  });
  if (nextBody !== prev) out.answer = nextBody;
  return { entry: out, cover, bodyChanged: nextBody !== prev };
}

function lockTlIndexRow(row, id) {
  if (!row) return null;
  const cover = croCoverForId(id || row.id);
  return Object.assign({}, row, {
    img: cover,
    cover_src: 'cro-face-pool',
    face_title_baked: false,
  });
}

function isTlId(id) {
  return /^tl\d+$/i.test(String(id || ''));
}

function facePoolSize() {
  return loadFaces().length;
}

module.exports = {
  SAFE_COVERS,
  FACES_FILE,
  loadFaces,
  facePoolSize,
  croCoverForId,
  faceAndHeroForId,
  stripPollinationsMd,
  normalizeCroCover,
  isLockedFaceUrl,
  lockTlAnswerEntry,
  lockTlIndexRow,
  isTlId,
};
