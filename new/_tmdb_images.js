// 🎬 TMDB — real posters and backdrops for real films.
//
// Owner 2026-07-30: movie pages must use the online movie database. `tmdb_api_key` was already in
// Netlify env; nothing read it, so `mv` pages were getting random cinema stock instead of the
// actual film's poster.
//
// Same principle as franchise pages: when a page names a specific real thing, the image has to BE
// that thing. A Top-10 movie page names ten films — stock photography can never show them, and a
// generated "poster" would be a fabricated studio asset (the fake-logo mistake in another costume).
//
// Free, no meaningful rate limit, returns high-resolution art (w1280 / original), so it satisfies
// the HD law without upscaling. Verified 2026-07-30: exact matches with posters AND backdrops for
// "Final Fantasy VII: Advent Children", "The Godfather", "Dune: Part Two".

'use strict';

const GAP_MS = parseInt(process.env.TMDB_GAP_MS || '300', 10);
const IMG_BASE = 'https://image.tmdb.org/t/p/';
const TTL_MS = 24 * 3600 * 1000;

let _last = 0;
let _chain = Promise.resolve();
const _cache = new Map();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function apiKey() {
  return process.env.TMDB_API_KEY || process.env.tmdb_api_key || '';
}

/** Strip the year and ranking furniture a heading carries, leaving just the film title. */
function cleanTitle(raw) {
  return String(raw || '')
    .replace(/^#{2,3}\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/[🏆💎]/g, '')
    .replace(/\bBEST\s+(?:OVERALL|VALUE)\b/gi, '')
    .replace(/\((?:19|20)\d{2}\)/g, '')
    .replace(/\bin\s+(?:19|20)\d{2}\b/gi, '')
    .replace(/[—–|]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function searchOne(title) {
  const key = apiKey();
  if (!key) return null;
  const q = cleanTitle(title);
  if (!q) return null;
  const ck = q.toLowerCase();
  const hit = _cache.get(ck);
  if (hit && (Date.now() - hit.at) < TTL_MS) return hit.v;

  const gap = GAP_MS - (Date.now() - _last);
  if (gap > 0) await sleep(gap);
  _last = Date.now();
  try {
    const u = 'https://api.themoviedb.org/3/search/movie?api_key=' + encodeURIComponent(key)
            + '&query=' + encodeURIComponent(q);
    const r = await fetch(u, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    const j = await r.json();
    const m = (j.results || [])[0];
    if (!m) { _cache.set(ck, { at: Date.now(), v: null }); return null; }
    const v = {
      title: m.title,
      year: String(m.release_date || '').slice(0, 4),
      poster: m.poster_path ? IMG_BASE + 'w1280' + m.poster_path : '',
      backdrop: m.backdrop_path ? IMG_BASE + 'w1280' + m.backdrop_path : '',
    };
    _cache.set(ck, { at: Date.now(), v });
    return v;
  } catch (e) { return null; }
}

/** Serialised lookup — TMDB is fast, but keep one request in flight for predictability. */
function search(title) {
  _chain = _chain.then(() => searchOne(title)).catch(() => null);
  return _chain;
}

/**
 * Images for a movie page. `itemTitles` are the ranked film titles (from `## N. <Film>` headings);
 * pass the page title alone for a non-ranked page.
 * Returns [{url, alt, w, h}] — backdrop for the hero (16:9 suits the cover), poster for each item.
 */
async function movieImages(itemTitles, want) {
  const list = (Array.isArray(itemTitles) ? itemTitles : [itemTitles]).filter(Boolean);
  const target = Math.max(1, want || 11);
  const out = [];
  const seen = new Set();
  for (const t of list) {
    if (out.length >= target) break;
    const m = await search(t);
    if (!m) continue;
    // backdrop first for the leading slot (wide), poster for the item itself (portrait, recognisable)
    for (const [url, kind] of [[m.poster, 'poster'], [m.backdrop, 'backdrop']]) {
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push({ url, alt: m.title + (m.year ? ' (' + m.year + ')' : '') + ' ' + kind, w: 1280, h: kind === 'poster' ? 1920 : 720, via: 'tmdb:' + kind });
      break;                       // one image per film — the poster is the canonical one
    }
  }
  return out.slice(0, target);
}

module.exports = { search, movieImages, cleanTitle, apiKey, IMG_BASE };
