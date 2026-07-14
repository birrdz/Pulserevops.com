// pexels-throttle.js — serial Pexels API, one request in flight.
// Owner 2026-07-13: thousands/day OK → ~few secs between calls (default 4s).
// Save quota for real DD/Fixer allocations — no nightly bank burn.
// PEXELS_PACE_MS can raise the floor; 429 → 60s backoff + retry once.
'use strict';

const PEXELS_MIN_GAP_MS = 4000;
const PEXELS_429_SLEEP_MS = 60000;

let inFlight = false;
let lastPexelsAt = 0;
let turn = Promise.resolve();

function pexelsMinGapMs() {
  const env = parseInt(process.env.PEXELS_PACE_MS || String(PEXELS_MIN_GAP_MS), 10);
  const n = Number.isFinite(env) && env > 0 ? env : PEXELS_MIN_GAP_MS;
  return Math.max(PEXELS_MIN_GAP_MS, n);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Queue: exactly one Pexels HTTP call at a time, with mandatory gap after each. */
function runPexelsSerial(fn) {
  const job = turn.then(async () => {
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
  turn = job.catch(() => {});
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
