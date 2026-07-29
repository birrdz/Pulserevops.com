// 🔒 SHARED IMAGE STANDARDS — ONE source of truth for image quality, used by BOTH machines.
//
// Owner 2026-07-29: "you gotta make sure the same image standards are in there that we had with drip"
// and "if we are gonna do it right, front end gotta move those rules to front end."
//
// These rules were tuned incident-by-incident on the drip (white boxes on dark layouts, soccer photos
// on a sales page, banner crops slicing subjects in half). They belong to the SITE, not to the drip —
// so the crew (front end) gets them the FIRST time a page is written, instead of the drip having to
// come back and redo the work.
//
// Both new/_drip.js and _page_finisher.js require this module. Do not copy these functions into
// either machine — a copy is how the two standards drift apart and one machine quietly gets worse.

'use strict';

const fs = require('fs');
const path = require('path');

const IB = path.join(__dirname, 'imagebank');
const NOTES_F = path.join(IB, '_pillar_image_notes.json');

const MIN_IMG_BYTES = 3000;   // below this it is a placeholder/broken stub, not a real photo
const IMG_MAX_W = parseInt(process.env.DRIP_IMG_MAX_W || '1800', 10);
const IMG_QUALITY = parseInt(process.env.DRIP_IMG_QUALITY || '82', 10);

// ── PILLAR VISUAL VOCABULARY ────────────────────────────────────────────────
// What a stock library should be searched for on each pillar. Several entries here are
// scar tissue: a pillar whose obvious words mean something else to a photo library gets
// anchored to the business sense in words the library actually understands.
const PILLAR_CONTEXT = {
  ca: ['car', 'vehicle', 'automobile', 'suv', 'truck', 'driving', 'road'],
  bt: ['boat', 'yacht', 'vessel', 'marina', 'sailing', 'water', 'harbor'],
  nl: ['nightlife', 'bar', 'club', 'cocktail', 'night', 'lounge', 'party'],
  dn: ['restaurant', 'dining', 'food', 'meal', 'chef', 'cuisine', 'table'],
  rs: ['resort', 'hotel', 'pool', 'beach', 'vacation', 'lounge'],
  tv: ['travel', 'destination', 'landscape', 'city', 'tourism'],
  es: ['house', 'home', 'estate', 'property', 'architecture', 'interior'],
  bo: ['building', 'construction', 'interior', 'office', 'architecture'],
  pt: ['pet', 'dog', 'cat', 'animal'],
  aq: ['aquarium', 'fish', 'tank', 'coral', 'water'],
  sy: ['fashion', 'outfit', 'clothing', 'style', 'wardrobe'],
  gm: ['gaming', 'game', 'console', 'computer', 'screen'],
  mv: ['cinema', 'movie', 'film', 'theater'],
  wl: ['wellness', 'fitness', 'health', 'yoga', 'spa'],
  sc: ['school', 'campus', 'classroom', 'student', 'education'],
  co: ['collection', 'vintage', 'antique', 'collectible'],
  ev: ['event', 'venue', 'celebration', 'gathering'],
  cl: ['club', 'venue', 'lounge'],
  lv: ['living', 'home', 'lifestyle', 'interior'],
  ga: ['gathering', 'party', 'celebration'],
  fr: ['franchise', 'storefront', 'business', 'retail'],
  tc: ['telecom', 'network', 'antenna', 'infrastructure'],
  ai: ['server', 'datacenter', 'technology', 'computer', 'network'],
  sw: ['software', 'computer', 'screen', 'code', 'office'],
  tk: ['technology', 'computer', 'software', 'office'],
  // revenue / business pillars share an office-and-meetings visual language
  tl: ['business', 'office', 'meeting', 'team', 'strategy'],
  gp: ['business', 'office', 'meeting', 'team', 'strategy'],
  ra: ['business', 'office', 'meeting', 'team', 'strategy'],
  st: ['sales', 'business', 'meeting', 'team', 'presentation'],
  ik: ['business', 'chart', 'analytics', 'office', 'data'],
  // ⚠️ was ['coaching','meeting','mentor','team'] — "coaching" and "team" lead a stock search straight to
  // sports, the same trap that put soccer photos on sk. Anchored to the business sense instead.
  cg: ['business coaching', 'manager employee', 'office meeting', 'mentor professional', 'workplace'],
  bs: ['book', 'reading', 'library', 'study'],
  er: ['electronics', 'device', 'gadget', 'technology'],
  q:  ['business', 'office', 'meeting', 'team', 'strategy', 'work'],
  ed: ['energy', 'efficiency', 'power', 'building', 'industrial'],
  gb: ['chart', 'diagram', 'graphic', 'design', 'data'],
  sp: ['speech', 'presentation', 'stage', 'microphone', 'audience'],
  tn: ['town', 'street', 'downtown', 'neighborhood', 'main street'],
  // 🔧 FIXED 2026-07-29 — this context put soccer photos on sales pages. "training / practice / drill /
  // skill" is the vocabulary of ATHLETIC training. Skill Drills are SALES coaching; say so in words a
  // stock library understands.
  sk: ['business meeting', 'sales team', 'office coaching', 'manager employee', 'professional'],
  hf: ['football', 'stadium', 'athlete', 'team', 'field'],
  tr: ['teacher', 'classroom', 'school', 'education', 'student', 'lesson'],
  et: ['education', 'technology', 'classroom', 'student', 'laptop'],
  se: ['sales', 'business', 'meeting', 'presentation', 'team'],
  nil: ['athlete', 'college', 'sports', 'stadium'],
};

// ── PER-PILLAR VETO NOTES (live-editable, re-read every 60s) ─────────────────
let NOTES_CACHE = null, NOTES_AT = 0;

function pillarNotes(pillar) {
  if (!NOTES_CACHE || Date.now() - NOTES_AT > 60000) {
    try { NOTES_CACHE = JSON.parse(fs.readFileSync(NOTES_F, 'utf8')) || {}; } catch (e) { NOTES_CACHE = {}; }
    NOTES_AT = Date.now();
  }
  const n = NOTES_CACHE[pillar];
  if (n && typeof n === 'object') return n;
  // 🌐 STANDING RULE: a pillar with no entry of its own inherits _DEFAULT, so every pillar —
  // including ones added later — gets the universal junk filter without being listed by hand.
  const d = NOTES_CACHE._DEFAULT;
  return (d && typeof d === 'object') ? d : null;
}

/** truthy (the matched term) when this candidate is explicitly vetoed for its pillar */
function vetoed(text, pillar) {
  const n = pillarNotes(pillar);
  if (!n || !Array.isArray(n.avoid) || !n.avoid.length) return false;
  const t = ' ' + String(text || '').toLowerCase() + ' ';
  for (const bad of n.avoid) {
    const b = String(bad || '').toLowerCase().trim();
    if (b && t.includes(b)) return b;
  }
  return false;
}

// ── AMBIGUOUS MATCH WORDS (owner incident 2026-07-29 — soccer photos on a sales page) ──
// Each of these means something different in a stock-photo library than it does on a business
// page: a "drill" is a power tool or a sports exercise, "training" and "practice" are athletic,
// a "pitch" is a field, a "coach" is a bus. Matching on one alone is not evidence of relevance.
const AMBIGUOUS_MATCH = new Set(['drill', 'drills', 'training', 'train', 'practice', 'practise', 'skill', 'skills',
  'coach', 'coaching', 'pitch', 'field', 'team', 'play', 'player', 'game', 'exercise', 'workout', 'session',
  'bank', 'court', 'net', 'club', 'run', 'running', 'lead', 'leads', 'target', 'goal', 'goals', 'score']);

/**
 * A candidate is acceptable only if its alt text shares at least one SPECIFIC (non-ambiguous)
 * word with the topic. Ambiguous words may add to the score afterwards, but can never be the
 * sole reason for a match.
 */
function altOverlapOk(alt, nouns) {
  const words = String(alt || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let specific = 0;
  for (const w of words) {
    if (!nouns || !nouns.has(w)) continue;
    if (!AMBIGUOUS_MATCH.has(w)) specific++;
  }
  return specific > 0;                 // ambiguous-only matches are rejected
}

/**
 * FETCH + VALIDATE + AUTO-FOCUS. Returns a JPEG Buffer, or null when the candidate fails any
 * standard. This is the choke point every image must pass on BOTH machines.
 *
 *   1. must decode as a real image, min 600x400
 *   2. must not be blank — flat/white/black frames rejected
 *   3. edge test — pale flat margins (product-on-white) rejected at 2+ edges
 *   4. auto-focus crop on wide images so the subject fills the frame
 *   5. downscale only — never upscale to fake HD
 */
async function fetchImage(url) {
  let sharp = null;
  try { sharp = require('sharp'); } catch (e) {}
  try {
    let buf;
    if (typeof url === 'object' && url && url.local) {
      try { buf = fs.readFileSync(url.file); } catch (e) { return null; }   // banked pool image off disk
    } else {
      const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!r.ok) return null;
      const ct = String(r.headers.get('content-type') || '');
      if (ct && !/^image\//i.test(ct)) return null;        // an HTML error body is not an image
      buf = Buffer.from(await r.arrayBuffer());
    }
    if (buf.length <= MIN_IMG_BYTES) return null;
    if (!sharp) return buf;                                 // no sharp → cannot validate, ship as-is

    // 1. MUST DECODE.
    let md;
    try { md = await sharp(buf).metadata(); } catch (e) { return null; }
    if (!md || !md.width || !md.height) return null;
    if (md.width < 600 || md.height < 400) return null;     // thumbnails render as mush

    // 2. MUST NOT BE BLANK. Bar tightened twice on 2026-07-29 — white images kept reaching pages
    //    at stdev 18 / mean 232 (product-on-white and washed-out skies pass a looser bar, then
    //    render as a white box in a dark layout).
    try {
      const st = await sharp(buf).stats();
      const chans = (st.channels || []).slice(0, 3);
      if (chans.length) {
        const meanStdev = chans.reduce((n, c) => n + (c.stdev || 0), 0) / chans.length;
        const meanLevel = chans.reduce((n, c) => n + (c.mean || 0), 0) / chans.length;
        if (meanStdev < 22) return null;                     // featureless / near-flat
        if (meanLevel > 226 || meanLevel < 16) return null;  // blown-out white / crushed black
      }
      // 3. EDGE TEST — the real "white image" tell. A photo has content at its edges; a
      //    product-on-white or a padded frame has a uniform pale border.
      try {
        const w = md.width, h = md.height;
        const band = Math.max(8, Math.round(Math.min(w, h) * 0.06));
        const edges = await Promise.all([
          sharp(buf).extract({ left: 0, top: 0, width: w, height: band }).stats(),          // top
          sharp(buf).extract({ left: 0, top: h - band, width: w, height: band }).stats(),   // bottom
          sharp(buf).extract({ left: 0, top: 0, width: band, height: h }).stats(),          // left
          sharp(buf).extract({ left: w - band, top: 0, width: band, height: h }).stats(),   // right
        ]);
        let bright = 0;
        for (const e of edges) {
          const c = (e.channels || []).slice(0, 3);
          if (!c.length) continue;
          const m = c.reduce((n, x) => n + (x.mean || 0), 0) / c.length;
          const s = c.reduce((n, x) => n + (x.stdev || 0), 0) / c.length;
          if (m > 228 && s < 26) bright++;                   // this edge is a pale, flat margin
        }
        // 2+ pale edges is enough. Top-10 pages pull product photos on white studio backgrounds,
        // which typically have a clean left/right or top/bottom PAIR rather than all four.
        if (bright >= 2) return null;
      } catch (e) {}
    } catch (e) {}

    // 4. AUTO-FOCUS / AUTO-ZOOM. sharp's `attention` strategy finds the highest-saliency region and
    //    crops to it, so the subject fills the frame instead of sitting small inside dead space. It
    //    also crops AWAY pale margins, and stops the layout slicing images at arbitrary points.
    //    Only applied above 3:2 — already-tight or portrait images are left alone.
    const ratio = md.width / Math.max(1, md.height);
    if (ratio > 1.55) {
      try {
        // Crop the WIDTH down to reach 3:2, not the height. Targeting height on a 16:9 source asks
        // for a frame TALLER than the original, which sharp satisfies by padding — the opposite of
        // a zoom, and the bug in the first version of this block.
        const targetW = Math.round(md.height * 1.5);
        if (targetW < md.width) {
          const out = await sharp(buf)
            .resize({ width: targetW, height: md.height, fit: 'cover', position: sharp.strategy.attention })
            .jpeg({ quality: IMG_QUALITY, mozjpeg: true }).toBuffer();
          if (out.length > MIN_IMG_BYTES) buf = out;
        }
      } catch (e) {}
    }
    // 5. Only ever shrink. Below IMG_MAX_W the original is kept — never upscale to fake HD.
    if (md.width > IMG_MAX_W) {
      try {
        const out = await sharp(buf).resize({ width: IMG_MAX_W, withoutEnlargement: true })
          .jpeg({ quality: IMG_QUALITY, mozjpeg: true }).toBuffer();
        if (out.length > MIN_IMG_BYTES) buf = out;
      } catch (e) {}
    }
    return buf;
  } catch (e) { return null; }
}

// ── 🦆 DDG IMAGE SEARCH — the provider that can actually find a named product ─────────────
// Owner 2026-07-29: "you're supposed to be using DDG pollinator ... look at what we did with
// the drip. use that." This is the drip's ladder, moved here so the CREW leads with it too.
//
// Why it matters for Top-10s: Pexels is a stock library and has no photo of a "Logitech MX
// Master 4" — it never will. DDG is a web image search, so a named model returns the actual
// product. That is the difference between "a gaming mouse" and "THAT gaming mouse".
// Keyless, unmetered, throttled, and held to the SAME relevance bar as everything else.
let _ddgToken = { t: '', at: 0 };
let _ddgLast = 0;
let _ddgChain = Promise.resolve();
const DDG_GAP_MS = parseInt(process.env.DDG_GAP_MS || '5000', 10);
const _ddgCache = new Map();
const _DDG_TTL = 6 * 3600 * 1000;
const _sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function ddgOne(query) {
  const k = String(query).toLowerCase().trim();
  const hit = _ddgCache.get(k);
  if (hit && (Date.now() - hit.at) < _DDG_TTL) return hit.p;
  const gap = DDG_GAP_MS - (Date.now() - _ddgLast);
  if (gap > 0) await _sleep(gap);
  _ddgLast = Date.now();
  try {
    // DDG needs a short-lived vqd token from the HTML endpoint before the image API will answer.
    if (!_ddgToken.t || Date.now() - _ddgToken.at > 900000) {
      const h = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query),
        { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) });
      const txt = await h.text();
      const m = txt.match(/vqd=["']?([-\d]+)["']?/) || txt.match(/vqd=([^&"']+)/);
      if (!m) return [];
      _ddgToken = { t: m[1], at: Date.now() };
      await _sleep(1200);
    }
    const u = 'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query)
      + '&vqd=' + encodeURIComponent(_ddgToken.t) + '&f=,,,size:Large,,&p=1';
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://duckduckgo.com/' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) { if (r.status === 403) _ddgToken = { t: '', at: 0 }; return []; }
    const j = await r.json();
    const out = (j.results || []).map(x => ({
      url: x.image, alt: x.title || '', w: x.width || 0, h: x.height || 0,
      by: x.source || 'ddg', page: x.url || '',
    })).filter(x => x.url && x.w >= 1200);
    _ddgCache.set(k, { at: Date.now(), p: out });
    return out;
  } catch (e) { return []; }
}

/** Serialised DDG search — one request at a time, throttled by DDG_GAP_MS. */
function ddgSearch(query) {
  _ddgChain = _ddgChain.then(() => ddgOne(query)).catch(() => []);
  return _ddgChain;
}

module.exports = {
  PILLAR_CONTEXT,
  AMBIGUOUS_MATCH,
  altOverlapOk,
  pillarNotes,
  vetoed,
  fetchImage,
  ddgSearch,
  DDG_GAP_MS,
  MIN_IMG_BYTES,
  IMG_MAX_W,
  IMG_QUALITY,
  NOTES_F,
};
