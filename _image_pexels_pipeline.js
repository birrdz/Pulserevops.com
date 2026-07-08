#!/usr/bin/env node
// _image_pexels_pipeline.js — serial per-page image fetch via Pexels.
//
// EXECUTION RULES (HARD LAW — owner 2026-07-08):
//   Serial only · one API request in flight · MINIMUM 18s between Pexels calls (18000ms floor, no env may lower)
//   No worker pools · no parallel sub-agents making Pexels calls
//   HTTP 429: sleep 60s, retry once; second 429 = failure
//   Lockfile image_run.lock blocks parallel runs across Cursor + Claude Code
//
// PIPELINE (per page, serial):
//   1. Check image_run_cache.json — if slug already completed, SKIP
//   2. Derive search query (shared lib)
//   3. Query Pexels ONCE per unique query (image_query_cache.json), reuse for clone family
//   4. Download photo → /assets/page-images/<slug>.jpg
//   5. Mark slug complete in image_run_cache.json
//
// Usage:
//   node _image_pexels_pipeline.js
//   ONE_SLUG=foo-bar node _image_pexels_pipeline.js
//   DRY_RUN=1 node _image_pexels_pipeline.js
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { deriveImageSearchQuery, queryCacheKey } = require('./netlify/functions/lib/derive-image-search-query');
const { shouldSkipMv, skipMvLog, pillarOf } = require('./netlify/functions/lib/mv-pillar-guard');
const { pexelsRequest, PEXELS_MIN_GAP_MS } = require('./netlify/functions/lib/pexels-throttle');
const { acquireLock, releaseLock, readLock } = require('./netlify/functions/lib/image-run-lock');

const WD = __dirname;
const PEXELS_EXCLUDED_PILLARS = new Set(['mv', 'hf']);

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const PEXELS_KEY = process.env.PEXELS_API_KEY || '';
const RUN_CACHE = WD + '/image_run_cache.json';
const QUERY_CACHE = WD + '/image_query_cache.json';
const MANIFEST = WD + '/_image_pages_manifest.json';
const OUT_DIR = WD + '/assets/page-images';
const MISSES_LOG = WD + '/image_run_misses.log';
const DRY = process.env.DRY_RUN === '1';
const ONE_SLUG = process.env.ONE_SLUG || '';
const OPERATOR = process.env.IMAGE_RUN_OPERATOR || 'CURSOR';

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

function readJson(f, fallback) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fallback; }
}
function writeJson(f, obj) {
  fs.writeFileSync(f, JSON.stringify(obj, null, 2));
}

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout: 45000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), ct: res.headers['content-type'] || '' }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function shouldSkipPage(page) {
  if (shouldSkipMv({ id: page.id, pillar: page.pillar }) || /^mv[-_]|\/movies\//i.test(String(page.slug || ''))) {
    skipMvLog('pexels-pipeline', { id: page.id, pillar: page.pillar });
    return 'mv-excluded';
  }
  const pillar = String(page.pillar || pillarOf(page.id || page.slug || '')).toLowerCase();
  if (PEXELS_EXCLUDED_PILLARS.has(pillar)) {
    console.log('[pexels-pipeline] SKIP ' + (page.id || page.slug) + ' · pillar ' + pillar + ' excluded');
    return pillar + '-excluded';
  }
  return '';
}

function pickBestPhoto(photos) {
  const candidates = (photos || [])
    .filter((p) => p && (p.width || 0) >= 1200 && (p.height || 0) > 0)
    .sort((a, b) => (b.width || 0) - (a.width || 0));
  return candidates[0] || null;
}

function pickPhotoUrl(photo) {
  const src = photo && photo.src;
  if (!src) return '';
  return src.large2x || src.large || src.original || '';
}

async function pexelsSearch(query) {
  const url = 'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' + encodeURIComponent(query);
  const r = await pexelsRequest(() => httpsGet(url, {
    Authorization: PEXELS_KEY,
    'User-Agent': 'pulserevops-image-pipeline/1.0',
  }));
  if (r.status === 429) throw new Error('Pexels HTTP 429 after retry');
  if (r.status !== 200) throw new Error('Pexels HTTP ' + r.status + ': ' + r.body.toString('utf8').slice(0, 200));
  return JSON.parse(r.body.toString('utf8'));
}

async function downloadUrl(url, dest) {
  const r = await httpsGet(url, { 'User-Agent': 'pulserevops-image-pipeline/1.0' });
  if (r.status !== 200 || !/^image\//i.test(r.ct)) throw new Error('download HTTP ' + r.status + ' ct=' + r.ct);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, r.body);
  return r.body.length;
}

function logMiss(slug, query, reason) {
  const line = new Date().toISOString() + '\t' + slug + '\t' + query + '\t' + reason + '\n';
  try { fs.appendFileSync(MISSES_LOG, line); } catch (e) {}
}

function defaultManifest() {
  return [
    { slug: 'best-noise-cancelling-headphones-2026', title: 'Best Noise Cancelling Headphones 2026' },
    { slug: 'crm-software-for-realtors-annapolis-md', title: 'CRM Software for Realtors Annapolis MD' },
  ];
}

async function getQueryPool(queryKey, query, qCache) {
  if (qCache[queryKey] && Array.isArray(qCache[queryKey].photos) && qCache[queryKey].photos.length) {
    log('  · query cache HIT', queryKey, '(' + qCache[queryKey].photos.length + ' photos)');
    return qCache[queryKey];
  }
  if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing');
  log('  · Pexels search (≥' + (PEXELS_MIN_GAP_MS / 1000) + 's gap enforced)', JSON.stringify(query));
  const data = await pexelsSearch(query);
  const photos = (data.photos || []).map((p) => ({
    id: p.id,
    width: p.width,
    height: p.height,
    url: pickPhotoUrl(p),
    photographer: p.photographer,
    alt: p.alt,
  })).filter((p) => p.url);
  if (!photos.length) return { query, photos: [], fetchedAt: new Date().toISOString(), miss: true };
  qCache[queryKey] = { query, photos, fetchedAt: new Date().toISOString() };
  writeJson(QUERY_CACHE, qCache);
  log('  · query cache STORE', queryKey, photos.length, 'photos');
  return qCache[queryKey];
}

async function processPage(page, runCache, qCache, familyIndex) {
  const slug = page.slug;
  const skip = shouldSkipPage(page);
  if (skip) return { slug, skipped: true, reason: skip };

  const title = page.title || slug;
  if (runCache[slug] && runCache[slug].status === 'done') {
    log('· SKIP', slug, '(cached done)');
    return { slug, skipped: true };
  }

  const query = deriveImageSearchQuery(page.queryFrom || slug || title);
  const qKey = queryCacheKey(page.queryFrom || slug || title);
  log('▶', slug, '→', query);

  if (DRY) {
    log('  (dry-run) would fetch query', qKey);
    return { slug, dry: true, query, qKey };
  }

  const pool = await getQueryPool(qKey, query, qCache);
  if (!pool.photos || !pool.photos.length) {
    logMiss(slug, query, 'pexels_zero');
    runCache[slug] = { status: 'miss', query, queryKey: qKey, at: new Date().toISOString() };
    writeJson(RUN_CACHE, runCache);
    return { slug, miss: true, query };
  }

  const fam = page.family || qKey;
  const idx = familyIndex[fam] || 0;
  const photo = pickBestPhoto(pool.photos) || pool.photos[idx % pool.photos.length];
  familyIndex[fam] = idx + 1;

  const dest = path.join(OUT_DIR, slug + '.jpg');
  const bytes = await downloadUrl(photo.url, dest);
  runCache[slug] = {
    status: 'done',
    query,
    queryKey: qKey,
    family: fam,
    photoId: photo.id,
    url: photo.url,
    file: '/assets/page-images/' + slug + '.jpg',
    bytes,
    at: new Date().toISOString(),
  };
  writeJson(RUN_CACHE, runCache);
  log('✓', slug, bytes + 'b', photo.url.slice(0, 60) + '…');
  return { slug, ok: true, query, file: runCache[slug].file };
}

(async () => {
  const lock = acquireLock({ operator: OPERATOR, pillar: process.env.PILLAR || '' });
  if (!lock.acquired) {
    console.error('REFUSED: image_run.lock held by', JSON.stringify(lock.holder));
    process.exit(2);
  }
  process.on('exit', () => releaseLock());
  process.on('SIGINT', () => { releaseLock(); process.exit(130); });
  process.on('SIGTERM', () => { releaseLock(); process.exit(143); });

  if (!PEXELS_KEY && !DRY) {
    console.error('PEXELS_API_KEY missing in .env.local');
    releaseLock();
    process.exit(1);
  }

  let pages = fs.existsSync(MANIFEST) ? readJson(MANIFEST, []) : defaultManifest();
  if (!Array.isArray(pages) || !pages.length) pages = defaultManifest();
  if (ONE_SLUG) pages = pages.filter((p) => p.slug === ONE_SLUG);
  if (!pages.length && ONE_SLUG) pages = [{ slug: ONE_SLUG, title: ONE_SLUG.replace(/-/g, ' ') }];

  const runCache = readJson(RUN_CACHE, {});
  const qCache = readJson(QUERY_CACHE, {});
  const familyIndex = {};
  let done = 0; let skipped = 0; let failed = 0; let misses = 0;

  log('▶ IMAGE PIPELINE ·', pages.length, 'pages · SERIAL · Pexels gap ≥', PEXELS_MIN_GAP_MS + 'ms · lock pid', process.pid);

  for (const page of pages) {
    try {
      const r = await processPage(page, runCache, qCache, familyIndex);
      if (r.skipped) skipped++;
      else if (r.miss) misses++;
      else if (r.ok || r.dry) done++;
    } catch (e) {
      failed++;
      log('✗', page.slug, e.message);
      runCache[page.slug] = { status: 'error', error: e.message, at: new Date().toISOString() };
      writeJson(RUN_CACHE, runCache);
    }
  }

  releaseLock();
  log('◀ done=' + done + ' skipped=' + skipped + ' misses=' + misses + ' failed=' + failed);
})().catch((e) => {
  releaseLock();
  console.error('FATAL', e);
  process.exit(1);
});
