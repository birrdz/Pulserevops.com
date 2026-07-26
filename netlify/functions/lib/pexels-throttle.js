// pexels-throttle.js — serial Pexels API, ONE request in flight (never parallel).
// Default floor: ≥18s between calls.
// Owner ultra / Cursor drip (Pexels exclusive — nothing else should call it):
//   CURSOR_ULTRA=1 | ULTRA_PLAN=1 | PEXELS_ALLOW_FAST=1
//   → gap = PEXELS_PACE_MS, default 2000 (1–5s band). Still ONE request at a time.
// Real 429s still sleep and retry (not an artificial pace).
'use strict';

const PEXELS_MIN_GAP_MS = 18000;
const PEXELS_429_SLEEP_MS = 60000;
const ULTRA_DEFAULT_GAP_MS = 2000; // owner: ~1–5s between serial Pexels calls
const ULTRA_MAX_GAP_MS = 5000;

let inFlight = false;
let lastPexelsAt = 0;
let turn = Promise.resolve();

function ultraFast() {
  return (
    process.env.CURSOR_ULTRA === '1' ||
    process.env.ULTRA_PLAN === '1' ||
    process.env.PEXELS_ALLOW_FAST === '1'
  );
}

function pexelsMinGapMs() {
  const env = parseInt(process.env.PEXELS_PACE_MS || '', 10);
  if (ultraFast()) {
    // Default 2s; clamp to 1–5s when set. Serial queue still enforces one-at-a-time.
    if (!Number.isFinite(env) || env < 0) return ULTRA_DEFAULT_GAP_MS;
    if (env === 0) return 0; // explicit zero still allowed
    return Math.min(ULTRA_MAX_GAP_MS, Math.max(1000, env));
  }
  return Math.max(PEXELS_MIN_GAP_MS, Number.isFinite(env) ? env : 0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Queue: exactly ONE Pexels operation at a time (never parallel).
 * Callers should put search + download of a single image inside fn when acquiring an asset.
 */
function runPexelsSerial(fn) {
  const job = turn.then(async () => {
    // Wait if a prior op is somehow still marked in-flight (should not happen with the queue)
    let spins = 0;
    while (inFlight && spins < 600) {
      await sleep(100);
      spins++;
    }
    if (inFlight) throw new Error('pexels-throttle: request already in flight');
    const gap = Math.max(0, pexelsMinGapMs() - (Date.now() - lastPexelsAt));
    if (gap > 0) await sleep(gap);
    inFlight = true;
    try {
      return await fn();
    } finally {
      inFlight = false;
      lastPexelsAt = Date.now();
    }
  });
  turn = job.then(
    () => {},
    () => {}
  );
  return job;
}

/**
 * Execute one Pexels API call with throttle + 429 handling (sleep 60s, retry once).
 * @param {() => Promise<{status:number, body:Buffer}>} requestFn
 * @returns {Promise<{status:number, body:Buffer, retried429:boolean}>}
 */
async function pexelsRequest(requestFn) {
  return runPexelsSerial(async () => {
    let retried429 = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await requestFn();
      if (r.status === 429 && attempt === 0) {
        await sleep(PEXELS_429_SLEEP_MS);
        retried429 = true;
        continue;
      }
      return Object.assign({}, r, { retried429 });
    }
    throw new Error('pexels-throttle: second 429');
  });
}

function assertNotInFlight() {
  if (inFlight) throw new Error('pexels-throttle: parallel Pexels call blocked');
}

module.exports = {
  PEXELS_MIN_GAP_MS,
  PEXELS_429_SLEEP_MS,
  pexelsMinGapMs,
  runPexelsSerial,
  pexelsRequest,
  assertNotInFlight,
};
