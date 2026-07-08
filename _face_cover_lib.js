// _face_cover_lib.js — shared POLLINATOR (flux) face-card COVER generation + gate.
// 🔒🔒 LAW (owner 2026-07-03): face-card COVERS are Pollinations flux ONLY (DDG banned).
// Reuse: valid on-disk /assets/qa/<id>.jpg (>40KB) is stamped cover_src:'flux' — no API call.
const fs = require('fs');
const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa';
const S = 760;
const coverPath = id => DIR + '/' + id + '.jpg';
function overlaySVG(S) { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }

function coverFileOk(id) { try { return fs.statSync(coverPath(id)).size > 40000; } catch (e) { return false; } }
function faceCardCoverOk(id, coverSrc) { return coverSrc === 'flux' && coverFileOk(id); }

async function stampFluxProvenance(id, store) {
  if (!coverFileOk(id)) return false;
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const e = (idx.entries || []).find(x => x && x.id === id);
    if (e) {
      e.img = '/assets/qa/' + id + '.jpg';
      e.cover_src = 'flux';
      await store.setJSON('_index.json', idx);
    }
    return true;
  } catch (e) { return false; }
}

async function makeFaceCardCover(id, question) {
  if (coverFileOk(id)) {
    try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; }
  }
  if (!sharp) return 0;
  return runFluxJob(async () => {
    let seed = 0; for (const ch of String(id)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const img = await fetchFluxPrompt(question, seed);
    if (!img) return 0;
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
    await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(coverPath(id));
    try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; }
  }, 'face-cover:' + id);
}

async function ensureFaceCardCover(id, question, store, coverSrc) {
  try {
    if (faceCardCoverOk(id, coverSrc)) return 'flux';
    if (coverFileOk(id)) {
      await stampFluxProvenance(id, store);
      return 'flux';
    }
    const sz = await makeFaceCardCover(id, question);
    if (!sz) return coverSrc;
    await stampFluxProvenance(id, store);
    return 'flux';
  } catch (e) { return coverSrc; }
}

module.exports = { faceCardCoverOk, coverFileOk, makeFaceCardCover, ensureFaceCardCover, stampFluxProvenance, coverPath };
