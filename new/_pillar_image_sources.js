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
//               Netlify env AND now in .env.local so the crew can read it. Verified working, LIVE.
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
//   mv  ✅ tmdb — LIVE. TMDB_API_KEY added to .env.local (the crew reads that, not Netlify env)
//   everything else → stock (unchanged behaviour)
//
// Next pillars that WANT ddg-brand when their turn comes, because their titles name real things:
//   er electronics · ca cars · co collectibles · bt boats · tk tech stacks · sw software ·
//   ai infrastructure · bs books (or the free OpenLibrary covers API) · gm games (or RAWG/IGDB)
// Place pillars (real venues, real photos exist): nl · dn · rs · tv · es · ga · cl · ev · tn

'use strict';

const SOURCES = {
  // fr: reverted to stock 2026-07-30 — owner: "some are good but it's using a lot of the same
  // pictures over and over ... with the exception of the occasional picture of a store, the old
  // format was better." Measured: 17% of images on recent fr pages were byte-identical to one on
  // an earlier page. The repeats were NOT DDG's — DDG verifies only ~3-5 real photos per brand,
  // then the ladder falls through to the local banked pool for the remaining slots, and that pool
  // is shared by every page. Two genuine storefronts followed by recycled stock reads worse than
  // consistent stock, because the good ones make the repeats obvious.
  // To re-enable: set source back to 'ddg-brand'. Better first: cap a page's image count to what
  // DDG can actually verify (fewer images, all real) instead of padding from the pool.
  fr: { source: 'stock', tried: 'ddg-brand', note: 'reverted — pool padding caused visible repeats' },
  mv: { source: 'tmdb', note: 'real posters/backdrops per film from themoviedb.org' },
  _DEFAULT: { source: 'stock', note: 'Pexels + local banked pool' },
};

/** Config for a pillar prefix, falling back to _DEFAULT. Never returns null. */
function imageSourceFor(pillar) {
  const p = String(pillar || '').toLowerCase().replace(/[^a-z]/g, '');
  return SOURCES[p] || SOURCES._DEFAULT;
}

/** true when this pillar's images come from the movie database. */
function usesMovieDb(pillar) {
  return imageSourceFor(pillar).source === 'tmdb';
}

/** true when this pillar should try real branded photos before anything generic. */
function usesBrandPhotos(pillar) {
  return imageSourceFor(pillar).source === 'ddg-brand';
}

module.exports = { SOURCES, imageSourceFor, usesBrandPhotos, usesMovieDb };
