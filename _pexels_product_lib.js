// _pexels_product_lib.js — serial Pexels product/section images (HARD 18s throttle via pexels-throttle.js).
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { pexelsRequest } = require('./netlify/functions/lib/pexels-throttle');
const { sectionImageSearchQuery } = require('./netlify/functions/lib/entry-image-query');
const { queryCacheKey } = require('./netlify/functions/lib/derive-image-search-query');

const WD = __dirname;
const DIR = WD + '/assets/qa';
const QUERY_CACHE = WD + '/image_query_cache.json';

function readJson(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function writeJson(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
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

function bestPexelsPhoto(photos) {
  const pool = (photos || [])
    .filter((p) => p && p.src && p.width >= 1200 && p.width >= (p.height || 0))
    .sort((a, b) => (b.width * b.height) - (a.width * a.height));
  const p = pool[0] || (photos || []).find((x) => x && x.src);
  if (!p || !p.src) return null;
  return {
    url: p.src.large2x || p.src.large || p.src.original || '',
    id: p.id,
    width: p.width,
  };
}

async function pexelsApiSearch(query) {
  const url = 'https://api.pexels.com/v1/search?per_page=5&orientation=landscape&query=' + encodeURIComponent(query);
  const key = process.env.PEXELS_API_KEY || '';
  if (!key) throw new Error('PEXELS_API_KEY missing');
  const r = await pexelsRequest(() => httpsGet(url, {
    Authorization: key,
    'User-Agent': 'pulserevops-pexels-product/1.0',
  }));
  if (r.status === 429) throw new Error('Pexels 429 after retry');
  if (r.status !== 200) throw new Error('Pexels HTTP ' + r.status);
  return JSON.parse(r.body.toString('utf8'));
}

async function resolvePexelsUrl(query, qCache, familyIndex, familyKey) {
  const qKey = queryCacheKey(query);
  let pool = qCache[qKey];
  if (!pool || !Array.isArray(pool.photos) || !pool.photos.length) {
    const data = await pexelsApiSearch(query);
    const photos = (data.photos || []).map((p) => ({
      id: p.id,
      width: p.width,
      height: p.height,
      url: (p.src && (p.src.large2x || p.src.large || p.src.original)) || '',
    })).filter((p) => p.url);
    if (!photos.length) return null;
    pool = { query, photos, fetchedAt: new Date().toISOString() };
    qCache[qKey] = pool;
    writeJson(QUERY_CACHE, qCache);
  }
  const fam = familyKey || qKey;
  const idx = familyIndex[fam] || 0;
  const pick = bestPexelsPhoto(pool.photos) || pool.photos[idx % pool.photos.length];
  familyIndex[fam] = idx + 1;
  return pick && pick.url ? pick.url : null;
}

/**
 * Fetch one self-hosted graded product image via Pexels (serial — caller must not parallelize).
 * @returns {Promise<string|null>} /assets/qa/<id>-<rank>.jpg
 */
async function ensurePexelsProductImage(id, rank, productName, entryTitle, opts) {
  opts = opts || {};
  const slot = rank || 1;
  const out = path.join(DIR, id + '-' + slot + '.jpg');
  const rel = '/assets/qa/' + id + '-' + slot + '.jpg';
  if (!opts.forceNew) {
    try {
      if (fs.statSync(out).size > 8000) return rel;
    } catch (e) {}
  }
  const query = sectionImageSearchQuery(entryTitle || productName, productName);
  const qCache = readJson(QUERY_CACHE, {});
  const familyIndex = opts.familyIndex || {};
  const srcUrl = await resolvePexelsUrl(query, qCache, familyIndex, opts.familyKey || queryCacheKey(entryTitle || id));
  if (!srcUrl) return null;

  const dl = await httpsGet(srcUrl, { 'User-Agent': 'pulserevops-pexels-product/1.0' });
  if (dl.status !== 200 || !/^image\//i.test(dl.ct)) throw new Error('pexels download HTTP ' + dl.status);

  const { storeGradedImage, sectionImageGradeOpts } = require('./_ddg_facecard_lib');
  fs.mkdirSync(DIR, { recursive: true });
  const gradeOpts = sectionImageGradeOpts(null);
  const ok = await storeGradedImage(dl.body, out, gradeOpts);
  if (!ok) return null;
  try {
    if (fs.statSync(out).size > 8000) return rel;
  } catch (e) {}
  return null;
}

function usePexelsProductImages() {
  return process.env.USE_PEXELS_PRODUCT_IMAGES === '1' || process.env.IMAGE_PRODUCT_PROVIDER === 'pexels';
}

module.exports = {
  ensurePexelsProductImage,
  usePexelsProductImages,
  resolvePexelsUrl,
  bestPexelsPhoto,
};
