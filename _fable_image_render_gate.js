// _fable_image_render_gate.js — Fable live-render image guard (per _FABLE_MASTER_SPEC.md §2 PASS-2 + §4).
// Guarantees every image on an entry (cover + section + @@PRODUCT) actually RENDERS before publish, on
// BOTH mobile and desktop:
//   • auditImage()          — self-hosted (/assets/qa/), real raster, >=600px, not SVG/placeholder/hotlink, grade-stamped
//   • verifyQaAssetRenders()— file exists + decodes via sharp (real raster >=200px) + grade stamp  == the "live-render guard"
// Mobile+desktop parity is then guaranteed centrally by the renderer's entryImgAttrs() in
// netlify/functions/pulse-machine-entry.js (responsive width:100% / object-fit:cover / aspect-ratio hints /
// loading / decoding=async / onerror fallback / @media breakpoints). A valid self-hosted raster therefore
// renders identically at 375px and 1440px. Broken/placeholder/hotlinked assets are the only thing that would
// fail to render on either viewport — this gate re-fetches + self-hosts them (or HOLDs) before publish.
'use strict';
const {
  bodyPageImageUrls,
  auditImage,
  verifyQaAssetRenders,
  repairBrokenQaImages,
  fillEntryMissingImages,
  pickMatchingLibraryImage,
  backfillRegistry,
} = require('./_ddg_facecard_lib');
const { auditMovieTitleMatch, enumerateProductSlots } = require('./_mv_image_title_match');

const COVER = (id) => '/assets/qa/' + id + '.jpg';
const pillarOf = (id) => (String(id).match(/^[a-z]+/) || [''])[0];

// Hard timeout — a hung live-provider fetch inside repair must never freeze the gate (owner 2026-07-07).
function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error('gate-timeout ' + (label || '') + ' ' + ms + 'ms')), ms); });
  return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(t));
}

// Replace one image URL in the body (both markdown ![]() and @@PRODUCT img="...") with a new url.
function swapImageUrl(body, oldUrl, newUrl) {
  const esc = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return String(body)
    .replace(new RegExp('(\\]\\()' + esc + '(\\))', 'g'), '$1' + newUrl + '$2')
    .replace(new RegExp('(img=")' + esc + '(")', 'g'), '$1' + newUrl + '$2');
}

// Enumerate renderable INTERNAL image URLs on the entry: markdown + @@PRODUCT img=.
// Face-card cover (/assets/qa/<id>.jpg) is EXCLUDED unless opts.includeCover — owner 2026-07-07:
// "do not write face card images; internal images + content format only." Covers are left untouched.
function entryImageUrls(id, body, opts = {}) {
  const cover = COVER(id);
  const urls = new Set();
  if (opts.includeCover) urls.add(cover);
  for (const u of bodyPageImageUrls(body)) if (opts.includeCover || u !== cover) urls.add(u);
  return [...urls];
}

// One image "renders on mobile + desktop" iff it is a self-hosted, grade-stamped, decodable raster.
async function imageRenders(url, id) {
  const audit = await auditImage(url, id);           // Fable §2/§3 exclusion + self-host + grade
  const render = await verifyQaAssetRenders(url, id); // Fable §4 live-render guard (sharp decode)
  const ok = !!audit.pass && render !== false;
  return { url, ok, flag: ok ? null : (audit.flag || (render === false ? 'NO_RENDER' : 'STANDARD')) };
}

async function scanEntryImages(id, body, opts = {}) {
  const results = [];
  for (const url of entryImageUrls(id, body, opts)) results.push(await imageRenders(url, id));
  let failed = results.filter((r) => !r.ok);
  // Criterion #14 (mv): image must match slot movie title — not just render (owner 2026-07-07).
  if (!opts.skipTitleMatch && pillarOf(id) === 'mv') {
    const tm = await auditMovieTitleMatch(id, body);
    for (const f of tm.failed) {
      if (!failed.find((x) => x.url === f.url)) failed.push({ url: f.url, ok: false, flag: f.flag });
    }
  }
  return { total: results.length, failed };
}

/**
 * Verify (and, if needed, repair) every image on an entry so all render on mobile + desktop before publish.
 * @param {string} id
 * @param {string} title
 * @param {string} body  rebuilt golden-template body (verified BEFORE save)
 * @param {{ store?:object, template?:'top10'|'qa', maxRounds?:number, onProgress?:Function }} opts
 * @returns {Promise<{ pass:boolean, body:string, total:number, failed:Array, rounds:number, flags:string[] }>}
 */
// Guaranteed INSTANT fallback: swap every still-failing slot with an already-graded self-hosted library/pool
// image (no live provider → cannot hang). Hotlinks never survive the gate. Spec (owner 2026-07-07):
// "on image fetch timeout, retry from self-hosted library before falling back to hotlink — hotlinks never pass."
async function guaranteedLibraryFill(id, title, body, failedUrls, onProgress) {
  const pillar = pillarOf(id);
  let b = String(body || '');
  const exclude = [...entryImageUrls(id, b, { includeCover: true })];
  const slotByUrl = {};
  for (const s of enumerateProductSlots(b)) slotByUrl[s.url] = s.name;
  let filled = 0;
  for (const url of failedUrls) {
    const movieName = slotByUrl[url] || title;
    if (onProgress) onProgress({ phase: 'library-fallback', url, title: movieName });
    let pick = null;
    try {
      pick = await withTimeout(
        pickMatchingLibraryImage(id, pillar, movieName, movieName, exclude, {
          forSectionFill: true, pillarOnly: true, allowTopicalReuse: true, minScore: 4,
          requireMovieTitle: pillar === 'mv', movieSlot: movieName,
        }),
        20000, 'lib:' + url);
    } catch (e) { pick = null; }
    if (!pick) {
      if (onProgress) onProgress({ phase: 'no-library-match', title: movieName, url });
      continue;
    }
    const renders = await imageRenders(pick, id);
    if (!renders.ok) continue;
    b = swapImageUrl(b, url, pick);
    exclude.push(pick);
    filled++;
  }
  return { body: b, filled };
}

async function fableImageRenderGate(id, title, body, opts = {}) {
  const maxRounds = opts.maxRounds != null ? opts.maxRounds : 2;
  const includeCover = !!opts.includeCover; // owner 2026-07-07: cover excluded — never write face-card images here
  const scanOpts = { includeCover };
  const REPAIR_TIMEOUT_MS = parseInt(process.env.GATE_REPAIR_TIMEOUT_MS || '90000', 10);
  try { await backfillRegistry(); } catch (e) {}
  let b = String(body || '');
  let scan = await scanEntryImages(id, b, scanOpts);
  let rounds = 0;
  // ONE-STRIKE TIMEOUT RULE (owner 2026-07-07): a live provider that hangs once does NOT get a second 90s
  // attempt — the run drops straight to guaranteedLibraryFill (instant, already-graded). Live→library, never
  // live→live→library. Prevents ~3 min wasted per stubborn slot.
  let providerHung = false;

  while (scan.failed.length && rounds < maxRounds && !providerHung) {
    rounds++;
    const flags = scan.failed.map((f) => f.flag);
    if (opts.onProgress) opts.onProgress({ phase: 'image-render-repair', round: rounds, failing: scan.failed.length, flags });

    // Internal images only — heal markdown ![]() slots, then fill/upgrade @@PRODUCT img= slots. No cover writes.
    // alternateSources + qaUpgradeAlternate = opt into staggered DDG ↔ Pollinator (self-host + grade) for internal images.
    // Timeout-wrapped: a hung live provider must not freeze the gate.
    const altOpts = { store: opts.store, onProgress: opts.onProgress, alternateSources: true, qaUpgradeAlternate: true, upgradeMode: true };
    try {
      const r = await withTimeout(repairBrokenQaImages(id, title, b, altOpts), REPAIR_TIMEOUT_MS, 'repair');
      if (r && r.body) b = r.body;
    } catch (e) { providerHung = true; if (opts.onProgress) opts.onProgress({ phase: 'repair-timeout', err: e.message }); }
    if (!providerHung) {
      try {
        const f = await withTimeout(fillEntryMissingImages(id, title, b, altOpts), REPAIR_TIMEOUT_MS, 'fill');
        if (f && f.body) b = f.body;
      } catch (e) { providerHung = true; if (opts.onProgress) opts.onProgress({ phase: 'fill-timeout', err: e.message }); }
    }

    scan = await scanEntryImages(id, b, scanOpts);
  }

  // Final guaranteed instant fallback — any slot still failing (incl. a hung-provider one-strike bailout) gets an
  // already-graded self-hosted library image. Hotlinks never survive the gate.
  if (scan.failed.length) {
    if (opts.onProgress && providerHung) opts.onProgress({ phase: 'one-strike-fallback', failing: scan.failed.length });
    const fb = await guaranteedLibraryFill(id, title, b, scan.failed.map((f) => f.url), opts.onProgress);
    if (fb.filled) { b = fb.body; scan = await scanEntryImages(id, b, scanOpts); }
  }

  return {
    pass: scan.failed.length === 0,
    body: b,
    total: scan.total,
    failed: scan.failed,
    rounds,
    flags: [...new Set(scan.failed.map((f) => f.flag))],
  };
}

module.exports = { fableImageRenderGate, scanEntryImages, entryImageUrls, imageRenders };
