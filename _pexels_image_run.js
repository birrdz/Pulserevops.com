#!/usr/bin/env node
// _pexels_image_run.js — spec-compliant Real Photo Acquisition Pass (CLAUDE_CODE_PEXELS_IMAGE_RUN.md).
// Serial, ONE request in flight, ≥18s HARD floor between Pexels calls, lockfile, mv+hf guards,
// query-cache dedupe per clone family, storeGradedImage (grade + EXIF PULSE_GRADE=v_final), face-card
// cover = the page's real Pexels image, circuit breaker, 429 handling, resume-safe cache, report.
// Usage: PILLAR=gm node _pexels_image_run.js   ·   DRY_RUN=1 for query-derivation preview only.
'use strict';
const fs = require('fs'), path = require('path'), https = require('https');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { deriveImageSearchQuery, queryCacheKey } = require('./netlify/functions/lib/derive-image-search-query');
const { shouldSkipMv, skipMvLog } = require('./netlify/functions/lib/mv-pillar-guard');
const { shouldSkipHf, skipHfLog } = require('./netlify/functions/lib/hf-pillar-guard');
const { storeGradedImage } = require('./_ddg_facecard_lib');

// ── HARD LAW: Pexels throttle. 18000ms floor, NOT overridable by any env var. ──
const PEXELS_MIN_MS = 18000;
const PIXABAY_MIN_MS = 1000;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const PEXELS_KEY = process.env.PEXELS_API_KEY || '';
const PIXABAY_KEY = process.env.PIXABAY_API_KEY || '';   // absent → fallback disabled
const PILLAR = String(process.env.PILLAR || '').toLowerCase();
const DRY = process.env.DRY_RUN === '1';
const LOCK = WD + '/image_run.lock';
const RUN_CACHE = WD + '/image_run_cache.json';
const QUERY_CACHE = WD + '/image_query_cache.json';
const MISSES = WD + '/image_run_misses.log';
const REPORT = WD + '/IMAGE_RUN_REPORT.md';
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const nowIso = () => new Date().toISOString();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2));

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout: 45000 }, res => { const c = []; res.on('data', x => c.push(x)); res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(c), ct: res.headers['content-type'] || '' })); });
    req.on('error', reject); req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── Lockfile ──
function acquireLock() {
  if (fs.existsSync(LOCK)) { const h = readJson(LOCK, {}); throw new Error('image_run.lock held by ' + (h.operator || '?') + ' pillar=' + (h.pillar || '?') + ' since ' + (h.at || '?') + ' — REFUSING to start'); }
  writeJson(LOCK, { operator: 'CLAUDE_CODE', pid: process.pid, at: nowIso(), pillar: PILLAR });
}
function releaseLock() { try { const h = readJson(LOCK, {}); if (h.operator === 'CLAUDE_CODE') fs.unlinkSync(LOCK); } catch (e) {} }

// ── Pexels (HARD throttle enforced by caller) ──
let lastPexelsAt = 0, lastPixabayAt = 0;
async function throttlePexels() { const wait = lastPexelsAt + PEXELS_MIN_MS - Date.now(); if (wait > 0) await sleep(wait); lastPexelsAt = Date.now(); }
async function pexelsSearch(query) {
  await throttlePexels();
  const url = 'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' + encodeURIComponent(query);
  let r = await httpsGet(url, { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-image-run/1.0' });
  if (r.status === 429) { log('  · Pexels 429 — sleep 60s, retry once'); await sleep(60000); await throttlePexels(); r = await httpsGet(url, { Authorization: PEXELS_KEY, 'User-Agent': 'pulserevops-image-run/1.0' }); }
  if (r.status !== 200) throw new Error('Pexels HTTP ' + r.status);
  return JSON.parse(r.body.toString('utf8'));
}
async function pixabaySearch(query) {
  if (!PIXABAY_KEY) return null;
  const wait = lastPixabayAt + PIXABAY_MIN_MS - Date.now(); if (wait > 0) await sleep(wait); lastPixabayAt = Date.now();
  const url = 'https://pixabay.com/api/?key=' + encodeURIComponent(PIXABAY_KEY) + '&q=' + encodeURIComponent(query) + '&per_page=5&orientation=horizontal&image_type=photo';
  let r = await httpsGet(url, { 'User-Agent': 'pulserevops-image-run/1.0' });
  if (r.status === 429) { log('  · Pixabay 429 — sleep 60s, retry once'); await sleep(60000); r = await httpsGet(url, { 'User-Agent': 'pulserevops-image-run/1.0' }); }
  if (r.status !== 200) throw new Error('Pixabay HTTP ' + r.status);
  return JSON.parse(r.body.toString('utf8'));
}
// Pick best: width ≥1200 landscape then highest res — skip consume-blocklist ids.
function bestPexels(photos) {
  let isBlocked = () => false;
  try { isBlocked = require('./_pexels_consume_lib').isBlockedPexelsId; } catch (e) {}
  const ok = (photos || []).filter(p => p && p.width >= 1200 && p.width >= p.height && !isBlocked(p.id));
  const pool = ok.length ? ok : (photos || []).filter(p => p && p.src && !isBlocked(p.id));
  pool.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  const p = pool[0]; if (!p) return null;
  return { url: (p.src && (p.src.large2x || p.src.large || p.src.original)) || '', id: p.id, provider: 'pexels', width: p.width };
}
function bestPixabay(hits) {
  const ok = (hits || []).filter(h => h && h.imageWidth >= 1200);
  const pool = ok.length ? ok : (hits || []);
  pool.sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight));
  const h = pool[0]; if (!h) return null;
  return { url: h.largeImageURL || '', id: h.id, provider: 'pixabay', width: h.imageWidth };
}
async function download(url) { const r = await httpsGet(url, { 'User-Agent': 'pulserevops-image-run/1.0' }); if (r.status !== 200 || !/^image\//i.test(r.ct)) throw new Error('download HTTP ' + r.status); return r.body; }

// ── Circuit breaker: >20% failures (download/API errors, NOT misses) over rolling 50 ──
const window = [];
function recordOutcome(fail) { window.push(fail ? 1 : 0); if (window.length > 50) window.shift(); const f = window.reduce((a, b) => a + b, 0); return window.length >= 50 && (f / window.length) > 0.20; }

async function main() {
  if (!PILLAR) throw new Error('PILLAR env required');
  if (PILLAR === 'mv' || PILLAR === 'hf') throw new Error('HARD EXCLUSION: refuse to run pillar ' + PILLAR);
  // COMPLETED / do-not-touch pillars (owner) — same treatment as mv/hf once a pillar is fully done.
  const completed = (() => { try { return JSON.parse(fs.readFileSync(WD + '/image_run_completed.json', 'utf8')); } catch (e) { return []; } })();
  if (Array.isArray(completed) && completed.map(String).includes(PILLAR)) throw new Error('COMPLETED pillar ' + PILLAR + ' is on the do-not-touch list — refusing to re-run');
  if (!PEXELS_KEY && !DRY) throw new Error('PEXELS_API_KEY missing');
  acquireLock();
  log('▶ IMAGE RUN · pillar=' + PILLAR + ' · Pexels 18s HARD floor · Pixabay=' + (PIXABAY_KEY ? 'on' : 'OFF') + (DRY ? ' · DRY' : ''));

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let pages = (idx.entries || []).filter(e => e && new RegExp('^' + PILLAR + '\\d+$', 'i').test(String(e.id)));
  // guard clauses — never mv/hf
  pages = pages.filter(e => { if (shouldSkipMv({ id: e.id })) { skipMvLog('image-run', { id: e.id }); return false; } if (shouldSkipHf({ id: e.id })) { skipHfLog('image-run', { id: e.id }); return false; } return true; });
  pages.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  log('  pages=' + pages.length);

  const runCache = readJson(RUN_CACHE, {});
  const qCache = readJson(QUERY_CACHE, {});
  let stored = 0, reused = 0, misses = 0, failures = 0, apiReqs = 0, idxDirty = false;

  for (const e of pages) {
    const id = String(e.id).toLowerCase();
    if (runCache[id] && runCache[id].status === 'done') { continue; }
    const title = e.question || e.title || id;
    const query = deriveImageSearchQuery(title);
    const qKey = queryCacheKey(title);
    if (DRY) { log('  (dry) ' + id + ' → "' + query + '" [' + qKey + ']'); continue; }
    try {
      // query cache (clone family shares one API call)
      let poolEntry = qCache[qKey];
      if (!poolEntry) {
        apiReqs++;
        const data = await pexelsSearch(query);
        let pick = bestPexels(data.photos);
        let provider = 'pexels', srcUrl = pick && pick.url;
        if (!pick || !pick.url) {
          const px = await pixabaySearch(query);   // fallback (null if no key)
          const pk = px && bestPixabay(px.hits);
          if (pk && pk.url) { pick = pk; provider = 'pixabay'; srcUrl = pk.url; }
        }
        if (!pick || !pick.url) {  // both 0 → miss, continue (no retry, no broadening)
          fs.appendFileSync(MISSES, nowIso() + '\t' + id + '\t' + query + '\n');
          misses++; recordOutcome(false); log('  ⊘ MISS ' + id + ' "' + query + '"'); continue;
        }
        poolEntry = { query, provider, url: srcUrl, at: nowIso() };
        qCache[qKey] = poolEntry; writeJson(QUERY_CACHE, qCache);
      } else { reused++; }
      // download + grade + self-host as the face-card cover (square tile, attention crop)
      const buf = await download(poolEntry.url);
      const dest = WD + '/assets/qa/' + id + '.jpg';
      const ok = await storeGradedImage(buf, dest, { square: 760, faceCard: true, cropPosition: 'attention', bright: false });
      if (!ok) { failures++; if (recordOutcome(true)) throw new Error('CIRCUIT BREAKER'); log('  ✗ grade fail ' + id); continue; }
      // update page cover (single-writer index)
      const row = (idx.entries || []).find(x => x && String(x.id).toLowerCase() === id);
      if (row) { row.img = '/assets/qa/' + id + '.jpg'; row.cover_src = 'pexels'; row.face_title_baked = false; idxDirty = true; }
      runCache[id] = { slug: id, query, provider: poolEntry.provider, source_url: poolEntry.url, registered_path: '/assets/qa/' + id + '.jpg', timestamp: nowIso(), status: 'done' };
      writeJson(RUN_CACHE, runCache);
      stored++; recordOutcome(false);
      if (stored % 10 === 0) { await store.setJSON('_index.json', idx); idxDirty = false; }
      log('  ✓ ' + id + ' [' + poolEntry.provider + '] "' + query + '"');
    } catch (err) {
      if (String(err.message).includes('CIRCUIT BREAKER')) {
        log('🛑 CIRCUIT BREAKER — failure rate >20% over 50 · HALT');
        if (idxDirty) await store.setJSON('_index.json', idx);
        fs.appendFileSync(REPORT, '\n## ' + PILLAR + ' — HALTED (circuit breaker) ' + nowIso() + '\nstored=' + stored + ' reused=' + reused + ' misses=' + misses + ' failures=' + failures + '\n');
        releaseLock(); process.exit(3);
      }
      failures++; if (recordOutcome(true)) { log('🛑 CIRCUIT BREAKER'); if (idxDirty) await store.setJSON('_index.json', idx); releaseLock(); process.exit(3); }
      log('  ✗ ' + id + ' ' + err.message);
    }
  }
  if (idxDirty) await store.setJSON('_index.json', idx);

  const missPct = pages.length ? (misses / pages.length * 100).toFixed(1) : '0';
  const remainReq = 0; // pilot processes all; estimate for report
  const rep = '\n## ' + PILLAR + ' — pilot ' + nowIso() + '\n' +
    '- pages processed: ' + pages.length + '\n- unique Pexels queries (API requests): ' + apiReqs + '\n- images stored (graded): ' + stored + '\n- query-cache reuse (clone family): ' + reused + '\n- misses: ' + misses + ' (' + missPct + '%)\n- failures: ' + failures + '\n- throttle: 18s/Pexels · est API time ' + Math.round(apiReqs * 18 / 60) + ' min\n';
  fs.appendFileSync(REPORT, rep);
  log('◀ DONE stored=' + stored + ' reused=' + reused + ' misses=' + misses + '(' + missPct + '%) failures=' + failures + ' apiReqs=' + apiReqs);
  if (parseFloat(missPct) > 10) log('⚠ misses >10% — per spec, STOP and update QUERY DERIVATION before continuing');
  releaseLock();
}

process.on('SIGINT', () => { releaseLock(); process.exit(130); });
process.on('SIGTERM', () => { releaseLock(); process.exit(143); });
main().catch(e => { log('FATAL ' + (e && e.message)); releaseLock(); process.exit(1); });
