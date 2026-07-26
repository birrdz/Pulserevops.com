// pexels-throttle.js — serial Pexels API, one request in flight.
// Default floor: ≥18s between calls. Owner ultra override:
//   CURSOR_ULTRA=1 | ULTRA_PLAN=1 | PEXELS_ALLOW_FAST=1  → may lower via PEXELS_PACE_MS (default 1s)
'use strict';

const PEXELS_MIN_GAP_MS = 18000;
const PEXELS_429_SLEEP_MS = 60000;

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
  const env = parseInt(process.env.PEXELS_PACE_MS || '0', 10);
  if (ultraFast()) {
    const pace = Number.isFinite(env) && env > 0 ? env : 1000;
    return Math.max(500, pace);
  }
  return Math.max(PEXELS_MIN_GAP_MS, Number.isFinite(env) ? env : 0);
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
