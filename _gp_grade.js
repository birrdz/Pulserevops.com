// _gp_grade.js — the LOCKED warm cine-grade (_IMAGE_LOOK_LOCK.md) pushed VERY BRIGHT + VERY SHARP,
// parameterized by cook-pass so the selection-room refiner can ramp brightness+sharpness toward a
// ceiling over repeated passes (always re-grading FROM RAW, so no cumulative artifacts). Wide face-card tile.
const sharp = require('sharp');
const GRADE_STAMP = 'PULSE_GRADE=v_final';                     // 🔒 spec: grader stamps atomically (_HERO_RESOLUTION_LAW.md)
// locked vignette + grain + warm-cast overlay (matches _IMAGE_LOOK_LOCK.md datedSVG)
function overlaySVG(w, h) {
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs>' +
    '<radialGradient id="v" cx="0.5" cy="0.47" r="1.08"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.08"/></radialGradient>' +
    '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.045"/></feComponentTransfer></filter>' +
    '</defs><rect width="' + w + '" height="' + h + '" fill="#ffffff" opacity="0"/>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#v)"/>' +
    '<rect width="' + w + '" height="' + h + '" filter="url(#grain)" opacity="0.045"/></svg>');
}

// pass 0 = generation baseline (already very bright/sharp); each cook pass nudges toward the ceiling
function paramsFor(pass) {
  const p = Math.max(0, pass | 0);
  return {
    saturation: Math.min(1.16, 1.10 + p * 0.004),   // BRIGHT & CHEERFUL — vivid natural color, no gold (owner 2026-07-10, supersedes _IMAGE_LOOK_LOCK)
    brightness: Math.min(1.20, 1.12 + p * 0.008),   // pushed brighter, still protects highlights
    contrast: 1.06,                                  // gentle contrast, lifted shadows
    sigma: Math.min(2.6, 1.8 + p * 0.14),            // very sharp, ramps up
  };
}

async function grade(rawBuf, outPath, opts) {
  opts = opts || {};
  const q = paramsFor(opts.pass || 0);
  const w = opts.w || 760, h = opts.h || 760;
  const base = await sharp(rawBuf, { animated: false })
    .resize(w, h, { fit: 'cover', position: 'attention' })   // match main-page tile: 760x760 square
    .modulate({ saturation: q.saturation, brightness: q.brightness })
    .linear(q.contrast, 6)                                    // filmic: contrast + lifted (not crushed) shadows
    .recomb([[1.0, 0, 0], [0, 1.0, 0], [0, 0, 1.0]])         // NEUTRAL — no warm cast (owner 2026-07-10 de-yellow)
    .sharpen({ sigma: q.sigma })                             // very sharp unsharp mask
    .toBuffer();
  await sharp(base)
    .composite([{ input: overlaySVG(w, h) }])                // locked vignette + grain + warm cast
    .withMetadata({ exif: { IFD0: { ImageDescription: GRADE_STAMP } } })   // 🔒 PROOF-OF-GRADE stamp
    .jpeg({ quality: 90 })
    .toFile(outPath);
  return q;
}

module.exports = { grade, paramsFor };
