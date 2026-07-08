// _mv_poster_download.js — movie-poster library builder (owner 2026-07-07).
// Sources (in order): OMDb API (if OMDB_API_KEY set) → Wikipedia infobox poster → REST lead image.
// Saves RAW jpg to BOTH Downloads + assets/qa/_poster-lib. Landscape Wikipedia posters center-cropped to 2:3.
'use strict';
const fs = require('fs');
const path = require('path');
let sharp; try { sharp = require('sharp'); } catch (e) {}
const { parseMovieSlot } = require('./_mv_image_title_match');

const UA = 'PulseRevOps/1.0 (koryjordanwhite@gmail.com) movie-poster-library';
const DOWNLOADS = 'C:/Users/koryj/Downloads/movie-posters';
const LIB = 'C:/Users/koryj/website/assets/qa/_poster-lib';
const MANIFEST = 'C:/Users/koryj/website/_mv_poster_manifest.json';
const COOLDOWN_MS = 300;
const MAX_RETRY = 2;
const OMDB_KEY = process.env.OMDB_API_KEY || process.env.OMDB_KEY || '';
const OMDB_REFRESH = process.env.OMDB_REFRESH === '1';
const MOVIE_YEAR_RE = /\s*\((\d{4})\)\s*$/;

const TITLE_ALIASES = {
  'the sound of metal': { title: 'Sound of Metal', year: '2020' },
  'parasite-era follow-up — decision to leave': { title: 'Decision to Leave', year: '2022' },
  'parasite-era follow-up - decision to leave': { title: 'Decision to Leave', year: '2022' },
  'mission: impossible — fallout': { title: 'Mission: Impossible – Fallout', year: '2018' },
  'mission: impossible - fallout': { title: 'Mission: Impossible – Fallout', year: '2018' },
};

for (const d of [DOWNLOADS, LIB]) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function normalizeTitle(title, year) {
  let t = String(title || '').replace(MOVIE_YEAR_RE, '').trim();
  t = t.replace(/^parasite[- ]era[- ]follow[- ]up\s*[—–-]\s*/i, '');
  const k = t.toLowerCase().replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
  const alias = TITLE_ALIASES[k] || TITLE_ALIASES[k.replace(/[^\w\s:]/g, ' ').replace(/\s+/g, ' ').trim()];
  if (alias) return { title: alias.title, year: alias.year || year };
  return { title: t, year };
}

async function jget(u) {
  const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
  return r.ok ? r.json() : null;
}

async function omdbPosterBuf(title, year) {
  if (!OMDB_KEY) return null;
  const u = 'https://www.omdbapi.com/?apikey=' + OMDB_KEY + '&t=' + encodeURIComponent(title) +
    (year ? '&y=' + year : '') + '&type=movie';
  try {
    const j = await jget(u);
    if (!j || j.Response !== 'True' || !j.Poster || j.Poster === 'N/A') return null;
    const ir = await fetch(j.Poster, { signal: AbortSignal.timeout(20000) });
    if (!ir.ok) return null;
    const buf = Buffer.from(await ir.arrayBuffer());
    if (buf.length < 4000) return null;
    return { buf, article: 'OMDb:' + (j.Title || title), source: 'omdb' };
  } catch (e) { return null; }
}

async function resolveArticle(title, year) {
  const tries = [];
  const os = await jget('https://en.wikipedia.org/w/api.php?action=opensearch&limit=8&format=json&search=' +
    encodeURIComponent(title + ' ' + (year || '') + ' film'));
  if (os && os[1] && os[1].length) {
    const withYearFilm = os[1].find((t) => year && t.includes(year) && /film/i.test(t));
    const withFilm = os[1].find((t) => /\(.*film\)/i.test(t));
    tries.push(withYearFilm, withFilm, os[1][0]);
  }
  if (year) tries.push(title + ' (' + year + ' film)');
  tries.push(title + ' (film)', title);
  return [...new Set(tries.filter(Boolean))];
}

async function wikiFileUrl(fileName, width) {
  const name = 'File:' + String(fileName).replace(/^(File|Image):/i, '').trim();
  const j = await jget('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=' +
    width + '&titles=' + encodeURIComponent(name));
  const pages = j && j.query && j.query.pages;
  if (!pages) return null;
  for (const k in pages) { const ii = pages[k].imageinfo; if (ii && ii[0]) return ii[0].thumburl || ii[0].url; }
  return null;
}

async function infoboxImage(article, width) {
  const j = await jget('https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&section=0&page=' +
    encodeURIComponent(article));
  const wt = j && j.parse && j.parse.wikitext && j.parse.wikitext['*'];
  if (!wt) return null;
  for (const field of ['poster', 'image']) {
    const m = wt.match(new RegExp('\\|\\s*' + field + '\\s*=\\s*(?:\\[\\[)?\\s*(?:File:|Image:)?\\s*([^\\n\\]|]+?\\.(?:jpg|jpeg|png|gif))', 'i'));
    if (!m) continue;
    const capM = wt.match(/\|\s*caption\s*=\s*([^\n]+)/i);
    const url = await wikiFileUrl(m[1], width);
    if (url) return { url, caption: capM ? capM[1] : '', file: m[1] };
  }
  return null;
}

async function portraitBuf(buf, opts) {
  if (!sharp) return null;
  let meta;
  try { meta = await sharp(buf).metadata(); } catch (e) { return null; }
  let w = meta.width, h = meta.height, ar = w / h;
  const isPoster = opts && (/poster/i.test(opts.caption || '') || /poster/i.test(opts.file || ''));
  if ((ar > 0.85 || ar < 0.5) && isPoster && ar > 0.85) {
    const cropW = Math.round(h * 0.667);
    buf = await sharp(buf).extract({ left: Math.max(0, Math.floor((w - cropW) / 2)), top: 0, width: Math.min(cropW, w), height: h }).toBuffer();
    meta = await sharp(buf).metadata();
    w = meta.width; h = meta.height; ar = w / h;
  }
  if (ar > 0.85 || ar < 0.42) return { landscape: true };
  return { buf, w, h, ar };
}

async function grabPortrait(url, article, extra) {
  if (!url) return null;
  try {
    const ir = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    if (!ir.ok) return null;
    const buf0 = Buffer.from(await ir.arrayBuffer());
    if (buf0.length < 4000) return null;
    const r = await portraitBuf(buf0, extra || {});
    if (!r || !r.buf) return r;
    return { buf: r.buf, w: r.w, h: r.h, ar: r.ar, article, source: 'wikipedia' };
  } catch (e) { return null; }
}

async function posterBufFor(rawTitle, rawYear) {
  const norm = normalizeTitle(rawTitle, rawYear);
  const title = norm.title;
  const year = norm.year || rawYear;
  const omdb = await omdbPosterBuf(title, year);
  if (omdb && omdb.buf) {
    const r = await portraitBuf(omdb.buf, { caption: 'poster' });
    if (r && r.buf) return Object.assign(omdb, r);
  }
  const articles = await resolveArticle(title, year);
  let sawLandscape = false;
  for (const article of articles) {
    try {
      const ib = await infoboxImage(article, 600);
      if (ib) {
        const r = await grabPortrait(ib.url, article, { caption: ib.caption, file: ib.file });
        if (r && r.buf) return r;
        if (r && r.landscape) sawLandscape = true;
      }
    } catch (e) {}
    const sum = await jget('https://en.wikipedia.org/api/rest_v1/page/summary/' +
      encodeURIComponent(article.replace(/ /g, '_')));
    const src = sum && ((sum.originalimage && sum.originalimage.source) || (sum.thumbnail && sum.thumbnail.source));
    if (src) {
      const r = await grabPortrait(src.replace(/\/\d+px-/, '/600px-'), article, { caption: 'poster' });
      if (r && r.buf) return r;
      if (r && r.landscape) sawLandscape = true;
    }
  }
  return sawLandscape ? { rejected: 'aspect' } : null;
}

async function main() {
  const src = process.env.TITLE_LIST || '_mv_needed_titles.json';
  let needed = require('./' + src.replace(/^\.?\//, ''));
  if (process.env.LIMIT) needed = needed.slice(0, parseInt(process.env.LIMIT, 10));
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { ok: {}, fail: {} };
  let done = 0, fresh = 0, skip = 0, fail = 0, aspectFlag = 0;
  console.log('Movie-poster library — ' + needed.length + ' titles → ' + (OMDB_KEY ? 'OMDb+Wikipedia' : 'Wikipedia'));
  for (const item of needed) {
    done++;
    const movie = parseMovieSlot(item.title);
    const key = movie.slugYear || movie.slug;
    const libFile = path.join(LIB, key + '.jpg');
    const have = fs.existsSync(libFile) && fs.statSync(libFile).size > 4000;
    // OMDB_REFRESH: upgrade any non-OMDb poster (Wikipedia crop/salvage) to the real OMDb theatrical poster.
    const refreshable = OMDB_REFRESH && OMDB_KEY && (!manifest.ok[key] || manifest.ok[key].source !== 'omdb');
    if (have && !refreshable) { skip++; continue; }
    let res = null;
    for (let a = 0; a <= MAX_RETRY && !res; a++) {
      try { res = await posterBufFor(movie.title, movie.year); } catch (e) { res = null; }
      if (!res && a < MAX_RETRY) await sleep(500);
    }
    if (!res || !res.buf) {
      if (have) { skip++; await sleep(COOLDOWN_MS); continue; } // refresh miss but we already have a poster
      fail++;
      const reason = res && res.rejected === 'aspect' ? 'landscape-only' : 'no-poster';
      if (reason === 'landscape-only') aspectFlag++;
      manifest.fail[key] = { title: item.title, reason };
      console.log('  [' + done + '/' + needed.length + '] FAIL  ' + item.title + '  (' + reason + ')');
      await sleep(COOLDOWN_MS); continue;
    }
    // refresh: keep existing unless OMDb gave us the upgrade
    if (have && refreshable && res.source !== 'omdb') { skip++; await sleep(COOLDOWN_MS); continue; }
    for (const dir of [LIB, DOWNLOADS]) {
      fs.writeFileSync(path.join(dir, key + '.jpg'), res.buf);
      if (movie.slug && movie.slug !== key) {
        const alias = path.join(dir, movie.slug + '.jpg');
        if (!fs.existsSync(alias)) fs.writeFileSync(alias, res.buf);
      }
    }
    fresh++;
    manifest.ok[key] = { title: item.title, article: res.article, w: res.w, h: res.h, ar: res.ar ? +res.ar.toFixed(2) : null, source: res.source || 'wikipedia' };
    delete manifest.fail[key];
    if (fresh % 25 === 0) { console.log('  [' + done + '/' + needed.length + '] ok ' + fresh); fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1)); }
    await sleep(COOLDOWN_MS);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log('\nDONE — fresh ' + fresh + ' · skipped ' + skip + ' · failed ' + fail + ' · total ' + needed.length);
}

main().catch((e) => { console.error('FATAL', e); process.exitCode = 1; });
