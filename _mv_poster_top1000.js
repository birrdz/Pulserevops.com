// _mv_poster_top1000.js — build a top-N popular-movie title list from IMDb public datasets (keyless).
// Uses title.ratings.tsv.gz sorted by numVotes + title.basics.tsv.gz for primaryTitle/startYear.
// Output: _mv_top1000_titles.json  [{slug, title}]  (default N=1000)
'use strict';
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const { parseMovieSlot } = require('./_mv_image_title_match');

const N = parseInt(process.env.TOP_N || '1000', 10);
const OUT = 'C:/Users/koryj/website/_mv_top1000_titles.json';
const RATINGS = 'https://datasets.imdbws.com/title.ratings.tsv.gz';
const BASICS = 'https://datasets.imdbws.com/title.basics.tsv.gz';
const CACHE = 'C:/Users/koryj/website/_imdb_cache';

async function fetchGz(url, dest) {
  if (fs.existsSync(dest)) return dest;
  if (!fs.existsSync(CACHE)) fs.mkdirSync(CACHE, { recursive: true });
  const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!r.ok) throw new Error('fetch failed ' + url + ' ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return dest;
}

async function loadTopIds(n) {
  const path = await fetchGz(RATINGS, CACHE + '/title.ratings.tsv.gz');
  const stream = fs.createReadStream(path).pipe(zlib.createGunzip());
  const rl = readline.createInterface({ input: stream });
  const rows = [];
  let head = true;
  for await (const line of rl) {
    if (head) { head = false; continue; }
    const [tconst, , numVotes] = line.split('\t');
    const v = parseInt(numVotes, 10);
    if (v > 5000) rows.push({ tconst, numVotes: v });
  }
  rows.sort((a, b) => b.numVotes - a.numVotes);
  return rows.slice(0, n * 3).map((r) => r.tconst); // over-fetch; filter to movies below
}

async function loadBasics(want) {
  const path = await fetchGz(BASICS, CACHE + '/title.basics.tsv.gz');
  const stream = fs.createReadStream(path).pipe(zlib.createGunzip());
  const rl = readline.createInterface({ input: stream });
  const wantSet = new Set(want);
  const out = new Map();
  let head = true;
  for await (const line of rl) {
    if (head) { head = false; continue; }
    const parts = line.split('\t');
    const tconst = parts[0];
    if (!wantSet.has(tconst)) continue;
    const titleType = parts[1];
    const primaryTitle = parts[2];
    const startYear = parts[5] === '\\N' ? null : parts[5];
    if (titleType !== 'movie') continue;
    out.set(tconst, { primaryTitle, startYear });
    if (out.size >= wantSet.size) break;
  }
  return out;
}

(async () => {
  console.log('Building top-' + N + ' movie list from IMDb datasets…');
  const ids = await loadTopIds(N);
  const basics = await loadBasics(ids);
  const list = [];
  for (const id of ids) {
    const b = basics.get(id);
    if (!b) continue;
    const title = b.startYear ? b.primaryTitle + ' (' + b.startYear + ')' : b.primaryTitle;
    const movie = parseMovieSlot(title);
    list.push({ slug: movie.slugYear || movie.slug, title });
    if (list.length >= N) break;
  }
  // merge in all currently-needed mv titles so coverage is guaranteed
  try {
    const need = require('./_mv_needed_titles.json');
    const seen = new Set(list.map((x) => x.slug));
    for (const n of need) {
      if (!seen.has(n.slug)) { list.push(n); seen.add(n.slug); }
    }
  } catch (e) {}
  fs.writeFileSync(OUT, JSON.stringify(list, null, 1));
  console.log('Wrote ' + list.length + ' titles → ' + OUT);
})().catch((e) => { console.error('FATAL', e); process.exitCode = 1; });
