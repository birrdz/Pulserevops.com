/**
 * Browse-square rules (owner 2026-07-11/12) — wired into Kory fixer (sim_transform) + gen_daemon.
 *
 * WHEN a new/fixed entry is ready:
 *  1. Grab an APPLICABLE photo from assets/qa/_pexels_stored (or local libs)
 *  2. Write untitled assets/qa/<id>.sq.jpg  (NO baked gold title — HTML title on the card)
 *  3. Keep full question untouched on the Q&A answer page
 *  4. Stamp index imgSq so homepage / pillar rows use the square
 *  5. Card chrome: per-topic trim via PulseSquares.TC; no face-card .jpg on browse rows
 *
 * BANNED on browse path: face mosaic /.jpg with baked gold title (double-title bug).
 * Answer-page heroes can still use separate cover logic elsewhere — not here.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
const STORED = path.join(WD, 'assets', 'qa', '_pexels_stored');
const QA = path.join(WD, 'assets', 'qa');

/** Loose keyword → search tokens for matching stored filenames / later API. */
const PILLAR_HINTS = {
  gp: ['business', 'meeting', 'office', 'strategy', 'handshake', 'sales', 'team'],
  ik: ['chart', 'analytics', 'dashboard', 'kpi', 'data'],
  ra: ['architecture', 'building', 'blueprint', 'structure'],
  st: ['training', 'classroom', 'presentation', 'coach'],
  bs: ['book', 'reading', 'library'],
  cg: ['coaching', 'mentor', 'meeting'],
  q: ['knowledge', 'research', 'desk', 'laptop'],
  sw: ['software', 'code', 'laptop', 'developer'],
  ai: ['ai', 'server', 'tech', 'circuit'],
  tk: ['tech', 'stack', 'laptop', 'server']
};

function pillarOf(id) {
  return String(id || '').replace(/\d.*$/, '').toLowerCase();
}

function listStored() {
  try {
    return fs.readdirSync(STORED)
      .filter((n) => /\.jpe?g$/i.test(n))
      .map((n) => path.join(STORED, n))
      .filter((f) => {
        try { return fs.statSync(f).size > 20000; } catch (e) { return false; }
      });
  } catch (e) {
    return [];
  }
}

/**
 * Pick a stored Pexels donor. Prefer unused paths. Seeded by id for stability.
 * @param {string} id
 * @param {string} title
 * @param {Set<string>|Object} [used] absolute paths already claimed
 */
function pickApplicablePexels(id, title, used) {
  const usedSet = used instanceof Set ? used : new Set(Object.keys(used || {}));
  const all = listStored();
  if (!all.length) return null;
  const pillar = pillarOf(id);
  const hints = (PILLAR_HINTS[pillar] || []).concat(
    String(title || '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 4).slice(0, 8)
  );
  const scored = all.map((f, i) => {
    const name = path.basename(f).toLowerCase();
    let score = 0;
    for (const h of hints) if (h && name.includes(h)) score += 3;
    // mild preference for numeric slots (approved gallery) over car dumps
    if (/^\d+\.jpe?g$/i.test(path.basename(f))) score += 1;
    if (usedSet.has(f)) score -= 100;
    return { f, score, i };
  });
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const pool = scored.filter((x) => x.score >= 0).slice(0, 40);
  if (!pool.length) return scored[seed % scored.length].f;
  return pool[seed % pool.length].f;
}

/**
 * Untitled browse square — attention crop, headroom-friendly, no gold title bake.
 */
async function writeUntitledSquare(id, donorPath) {
  const dest = path.join(QA, id + '.sq.jpg');
  await sharp(donorPath)
    .rotate()
    .resize(760, 760, { fit: 'cover', position: 'north' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  return dest;
}

/**
 * Apply browse-square rules after fixer has a title.
 * Does NOT change the full question text on the answer blob.
 */
async function applyBrowseSquareRules(id, title, opts) {
  opts = opts || {};
  const used = opts.used || new Set();
  const donor = opts.donor || pickApplicablePexels(id, title, used);
  if (!donor) return { ok: false, why: 'no-pexels' };
  const dest = await writeUntitledSquare(id, donor);
  used.add(donor);
  const imgSq = '/assets/qa/' + id + '.sq.jpg';
  if (opts.stampIndex !== false) {
    try {
      const store = require('./_blob_store') || null;
      // soft: many environments use flib store — optional stamp via callback
      if (typeof opts.onStamp === 'function') await opts.onStamp(id, imgSq);
    } catch (e) {}
  }
  return { ok: true, id, imgSq, donor, bytes: fs.statSync(dest).size };
}

module.exports = {
  STORED,
  PILLAR_HINTS,
  listStored,
  pickApplicablePexels,
  writeUntitledSquare,
  applyBrowseSquareRules,
  pillarOf
};
