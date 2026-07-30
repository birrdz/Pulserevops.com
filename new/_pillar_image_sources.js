// 🖼 PER-PILLAR IMAGE SOURCE MAP — which provider each pillar's images come from.
//
// Owner 2026-07-30: "keep it all in the notes so in the future it just switches back and forth."
// Add a pillar here and BOTH machines (crew `_page_finisher.js` and drip `new/_drip.js`) pick it
// up — there is no second place to edit.
//
// ── THE PRINCIPLE ───────────────────────────────────────────────────────────
// The right provider depends on ONE question: does the page name a SPECIFIC REAL THING?
//
//   names a real thing  → you need a REAL PHOTO of that thing.  Stock cannot supply it and a
//                         generator can only invent it. Use DDG (web image search) or a
//                         purpose-built database (TMDB for film).
//   generic concept     → stock or generated imagery is genuinely fine, and cheaper.
//
// That is why franchise pages were failing: 'Should I open or buy a Five Guys franchise' names a
// real company, and Pexels has no Five Guys photo, so the crew recycled the same banked images
// across page after page (verified: three fr pages shared photos byte-for-byte).
//
// ── PROVIDERS, MEASURED 2026-07-30 ──────────────────────────────────────────
//   ddg-brand   DDG web image search + brand extraction. Real photos of real premises.
//               Keyless, unmetered, 5s serialised gap. Verified: 56 hits for a Five Guys
//               storefront, 35 for a Mr. Rooter van, 33 for a Blink Fitness interior, all ≥1200px.
//   tmdb        themoviedb.org. Real posters/backdrops per film, `tmdb_api_key` already in
//               Netlify env, free, high-res. Verified working. NOT wired into either machine yet.
//   stock       Pexels + the 7,953-image local banked pool. Fine for generic business imagery.
//               ⚠️ Pexels is on a quota cooldown — the local pool carries most of the load.
//
// ── REJECTED, AND WHY ───────────────────────────────────────────────────────
//   pollinations   free, keyless, but ~45s per image and returns 940x627 whatever size you ask
//                  for. An 11-image page spends ~11 min in the image stage → ~5 pages/hour.
//   huggingface    key exists but the free image models are GONE — HTTP 410 "deprecated and no
//                  longer supported by provider hf-inference". Image gen now routes to paid
//                  third-party providers.
//   leonardo / replicate / aihorde   keys exist; credit-limited, pay-per-run, or slow queue.
//   ⛔ generated logos / posters      NEVER. A generated "Five Guys logo" or film poster is a
//                  fabricated brand asset — the fake-logo incident. Real, or generic. Never invented.
//
// ── STATUS ──────────────────────────────────────────────────────────────────
//   fr  ✅ ddg-brand — LIVE (this is the pillar being worked)
//   mv  📋 tmdb — mapped, not wired. See _MOVIES_IMAGE_SOURCE_NOTE.md
//   everything else → stock (unchanged behaviour)
//
// Next pillars that WANT ddg-brand when their turn comes, because their titles name real things:
//   er electronics · ca cars · co collectibles · bt boats · tk tech stacks · sw software ·
//   ai infrastructure · bs books (or the free OpenLibrary covers API) · gm games (or RAWG/IGDB)
// Place pillars (real venues, real photos exist): nl · dn · rs · tv · es · ga · cl · ev · tn

'use strict';

const SOURCES = {
  fr: { source: 'ddg-brand', extract: 'franchiseBrand', note: 'real store/premises photos of the named franchise' },
  mv: { source: 'stock', planned: 'tmdb', note: 'TMDB posters — key present, not wired yet' },
  _DEFAULT: { source: 'stock', note: 'Pexels + local banked pool' },
};

/** Config for a pillar prefix, falling back to _DEFAULT. Never returns null. */
function imageSourceFor(pillar) {
  const p = String(pillar || '').toLowerCase().replace(/[^a-z]/g, '');
  return SOURCES[p] || SOURCES._DEFAULT;
}

/** true when this pillar should try real branded photos before anything generic. */
function usesBrandPhotos(pillar) {
  return imageSourceFor(pillar).source === 'ddg-brand';
}

module.exports = { SOURCES, imageSourceFor, usesBrandPhotos };
