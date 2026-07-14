'use strict';
/**
 * IMAGE FETCH — Pexels ONLY (owner forever workflow).
 *
 *   title keywords → Pexels search → download → putQaAsset(/assets/qa/) → apply
 *
 * No Pollinator. No Cloudflare. No HF. No Grok. No DDG.
 * Those API keys are intentionally NOT read here.
 *
 * Speed: one Pexels call + download + upload. No 15–30s multi-provider stagger.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { putQaAsset } = require('./_live_qa_asset');
const { assertAllowedImageUrl, isBannedImageUrl } = require('./_image_hard_bans');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');

/** Floor between Pexels searches only (~few seconds — not 15–30s AI gens). */
const PEXELS_GAP_MS = Math.max(1500, parseInt(process.env.PEXELS_PACE_MS || '2000', 10) || 2000);

let turn = Promise.resolve();
let inFlight = false;
let lastPexelsAt = 0;
const stats = { calls: 0, ok: 0, fails: 0, waits: 0 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function httpsGet(url, headers) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: headers || {}, timeout: 45000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({ status: res.statusCode, body: Buffer.concat(chunks), ct: res.headers['content-type'] || '' })
      );
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

async function storeLocal(buf, id, slot) {
  if (!buf || buf.length < 8000) return null;
  const rel = String(id) + '-' + String(slot) + '.jpg';
  try {
    const jpg = await sharp(buf)
      .rotate()
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();
    const put = await putQaAsset(rel, jpg);
    if (put && put.url) {
      assertAllowedImageUrl(put.url, 'pexels-put');
      return put.url;
    }
  } catch (e) {}
  fs.mkdirSync(QA, { recursive: true });
  const out = path.join(QA, rel);
  await sharp(buf)
    .rotate()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  try {
    if (fs.statSync(out).size > 8000) {
      const url = '/assets/qa/' + rel;
      assertAllowedImageUrl(url, 'pexels-local');
      return url;
    }
  } catch (e) {}
  return null;
}

/** Pexels search → download bytes. ONLY image API this module knows. */
async function fetchPexels(query) {
  const { pexelsRequest } = require('./netlify/functions/lib/pexels-throttle');
  const key = process.env.PEXELS_API_KEY || '';
  if (!key) throw new Error('PEXELS_API_KEY missing — only image API allowed');
  const q = String(query || 'professional photo').trim().slice(0, 120) || 'professional photo';
  const url =
    'https://api.pexels.com/v1/search?per_page=8&orientation=landscape&query=' + encodeURIComponent(q);
  const r = await pexelsRequest(() =>
    httpsGet(url, { Authorization: key, 'User-Agent': 'pulse-pexels-only/1.0' })
  );
  if (r.status !== 200) throw new Error('pexels ' + r.status);
  const j = JSON.parse(r.body.toString('utf8'));
  const photos = (j.photos || []).filter((p) => p && p.src);
  const p = photos[0] || null;
  if (!p) return null;
  const src = p.src.large2x || p.src.large || p.src.original;
  const dl = await httpsGet(src, { 'User-Agent': 'pulse-pexels-only/1.0' });
  if (dl.status !== 200 || !/^image\//i.test(dl.ct)) return null;
  return dl.body.length > 8000 ? dl.body : null;
}

/**
 * Serial one-at-a-time: keywords → Pexels → download → /assets/qa/ → URL.
 */
async function rotateFetchProductImage(id, slot, query) {
  const waitForPrior = turn;
  let release;
  turn = new Promise((r) => {
    release = r;
  });
  await waitForPrior;

  if (inFlight) {
    release();
    throw new Error('pexels-only: parallel blocked — 1 worker');
  }
  inFlight = true;

  try {
    const gap = Math.max(0, PEXELS_GAP_MS - (Date.now() - (lastPexelsAt || 0)));
    if (gap > 0) {
      stats.waits++;
      await sleep(gap);
    }
    stats.calls++;
    let buf = null;
    try {
      buf = await fetchPexels(query);
    } catch (e) {
      lastPexelsAt = Date.now();
      stats.fails++;
      return { url: null, via: 'pexels-fail', err: String(e.message || e), provider: 'pexels' };
    }
    lastPexelsAt = Date.now();
    if (!buf) {
      stats.fails++;
      return { url: null, via: 'pexels-empty', provider: 'pexels' };
    }
    const rel = await storeLocal(buf, id, slot);
    if (!rel || isBannedImageUrl(rel)) {
      stats.fails++;
      return { url: null, via: 'pexels-store-fail', provider: 'pexels' };
    }
    stats.ok++;
    return { url: rel, via: 'pexels', provider: 'pexels' };
  } finally {
    inFlight = false;
    release();
  }
}

function rotateStats() {
  return {
    order: ['pexels'],
    ladder: ['library', 'pexels'],
    staggerMs: PEXELS_GAP_MS,
    only: 'pexels',
    inFlight,
    lastPexelsAt,
    stats: Object.assign({}, stats),
  };
}

/** Dead stubs — other providers do not exist in this module. */
async function fetchPollinations() {
  throw new Error('REMOVED — Pexels only');
}

module.exports = {
  rotateFetchProductImage,
  rotateStats,
  fetchPexels,
  ORDER: ['pexels'],
  CADENCE: { pexels: PEXELS_GAP_MS },
  STAGGER_MS: PEXELS_GAP_MS,
  SHARED_LADDER: ['library', 'pexels'],
  fetchPollinations, // throws if anything still imports old name
};
