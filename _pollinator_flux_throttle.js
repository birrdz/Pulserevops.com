// _pollinator_flux_throttle.js — GLOBAL Pollinator flux gate (owner 2026-07-03).
// 🔒 IMAGE LOOK LAW: every flux image must match /topics page tiles — candid documentary editorial
// photo (buildPoolQuery + fetchFluxPrompt), warm cinematic grade via storeGradedImage, no text/flyers.
// Strictly serial: job N+1 does not BEGIN until job N is 100% done (fetch + save to disk).
// Strictly serial: job N+1 does not BEGIN until job N is 100% done (fetch + save to disk).
// No artificial gap between jobs — generation time is the natural spacing (owner 2026-07-05).
// Owner 2026-07-06: default 20s between each Pollinator flux image.
/** Site-wide Pollinator gap between flux jobs — default 20s. */
const FLUX_FREQ_MS = parseInt(process.env.POLLINATOR_FREQ_MS || process.env.POLLINATOR_MIN_MS || process.env.IMAGE_GAP_MS || '20000', 10);
const POLLINATOR_BREAK_MS = FLUX_FREQ_MS;
let adaptiveThrottle;
try { adaptiveThrottle = require('./_adaptive_throttle_learner'); } catch (e) { adaptiveThrottle = null; }
function learnedFluxGapMs() {
  const floor = FLUX_FREQ_MS;
  if (floor <= 0) return 0; // owner: no pollinator cooldown — skip adaptive ladder
  if (adaptiveThrottle) return Math.max(floor, adaptiveThrottle.getCooldownMs('flux'));
  return floor;
}
const FLUX_429_MS = parseInt(process.env.POLLINATOR_429_MS || '5000', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PTOK = () => process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';
function pollinatorHeaders() { const k = PTOK(); return k ? { Authorization: 'Bearer ' + k } : {}; }

let turn = Promise.resolve();
let lastDoneAt = 0;
let abortCheck = () => false;
function setFluxAbortCheck(fn) { abortCheck = fn || (() => false); }
async function interruptibleSleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (abortCheck()) { const e = new Error('SCRUB_STOP'); e.code = 'SCRUB_STOP'; throw e; }
    await sleep(Math.min(400, end - Date.now()));
  }
}
const stats = { jobCount: 0, totalMs: 0, lastMs: 0, busy: false, currentLabel: '', recent: [] };

function getGapMs() { return learnedFluxGapMs(); }

function fluxStats() {
  const gap = learnedFluxGapMs();
  const learn = adaptiveThrottle ? adaptiveThrottle.snap('flux') : null;
  const ago = lastDoneAt ? Math.max(0, Math.round((Date.now() - lastDoneAt) / 1000)) : null;
  return {
    jobCount: stats.jobCount,
    totalMs: stats.totalMs,
    lastMs: stats.lastMs,
    avgMs: stats.jobCount ? Math.round(stats.totalMs / stats.jobCount) : 0,
    busy: stats.busy,
    currentLabel: stats.currentLabel,
    freqMs: gap,
    freqSec: Math.round(gap / 1000),
    gapMs: gap,
    gapSec: Math.round(gap / 1000),
    minGapMs: gap,
    adaptive: !!learn,
    throttleLearn: learn,
    lastDoneAt,
    lastAgoSec: ago,
    recent: stats.recent.slice(0, 12),
  };
}

function fluxJobOk(result) {
  if (result === null || result === false || result === undefined) return false;
  if (typeof result === 'number') return result > 0;
  if (typeof result === 'string') return result.length > 0;
  return true;
}

async function runFluxJob(fn, label, opts) {
  opts = opts || {};
  const noCooldown = !!opts.noCooldown;
  const waitForPrior = turn;
  let releaseTurn;
  turn = new Promise(r => { releaseTurn = r; });
  await waitForPrior;
  let result;
  try {
    const gap = noCooldown ? 0 : Math.max(0, learnedFluxGapMs() - (Date.now() - lastDoneAt));
    if (gap > 0) await interruptibleSleep(gap);
    if (abortCheck()) { const e = new Error('SCRUB_STOP'); e.code = 'SCRUB_STOP'; throw e; }
    stats.busy = true;
    stats.currentLabel = label || 'flux';
    const t0 = Date.now();
    try {
      result = await fn();
    } catch (err) {
      if (err && err.code === 'SCRUB_STOP') throw err;
      result = null;
    } finally {
      const ms = Date.now() - t0;
      const ok = fluxJobOk(result);
      stats.lastMs = ms;
      stats.totalMs += ms;
      stats.jobCount++;
      stats.busy = false;
      stats.currentLabel = '';
      stats.recent.unshift({ ms, label: label || 'flux', at: new Date().toISOString(), gapMs: learnedFluxGapMs(), ok });
      stats.recent = stats.recent.slice(0, 20);
      lastDoneAt = Date.now();
      if (adaptiveThrottle) {
        if (ok) adaptiveThrottle.onSuccess('flux');
        else if (opts.throttle || opts.throttleReason) adaptiveThrottle.onThrottle('flux', opts.throttleReason || 'throttled');
      }
    }
    return result;
  } finally {
    stats.busy = false;
    stats.currentLabel = '';
    releaseTurn();
  }
}

async function fetchFluxBuffer(url, opts = {}) {
  const COOL_F = require('path').join(process.env.PULSE_WD || 'C:/Users/koryj/website', '_all_flux_cooldown.json');
  const STEP = parseInt(process.env.COOL_STEP_MS || '5000', 10);
  const floor = FLUX_FREQ_MS;
  let coolMs = floor;
  try { const j = JSON.parse(require('fs').readFileSync(COOL_F, 'utf8')); if (j && j.ms >= floor) coolMs = j.ms; } catch (e) {}
  const maxTry = opts.maxTry || 999;
  for (let t = 0; t < maxTry; t++) {
    try {
      const r = await fetch(url, { headers: pollinatorHeaders(), signal: AbortSignal.timeout(90000) });
      if (r.status === 429 || r.status === 503) {
        coolMs = Math.min(parseInt(process.env.COOL_MAX_MS || '300000', 10), coolMs + STEP);
        try { require('fs').writeFileSync(COOL_F, JSON.stringify({ ms: coolMs, at: new Date().toISOString(), via: 'throttle' })); } catch (e) {}
        await interruptibleSleep(coolMs);
        continue;
      }
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) {
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 3000) return b;
      }
    } catch (e) {}
    coolMs = Math.min(parseInt(process.env.COOL_MAX_MS || '300000', 10), coolMs + STEP);
    try { require('fs').writeFileSync(COOL_F, JSON.stringify({ ms: coolMs, at: new Date().toISOString(), via: 'throttle-miss' })); } catch (e) {}
    await interruptibleSleep(coolMs);
  }
  return null;
}

function fluxPromptUrl(q, seed, opts) {
  opts = opts || {};
  let tail = ', natural light, cinematic, detailed, no text, no words, no letters, no watermark';
  tail += ', no chart no graph no diagram no infographic no dashboard screenshot, no infomercial no advertisement, no CGI no 3D render no sci-fi futuristic no neon cyberpunk no hologram no glowing AI interface';
  if (opts.pool) tail += ', no handshake, no handshaking, no stock photo cliché, no generic business meeting, no suits shaking hands';
  const missTails = {
    dupe: ', completely different composition subject and camera angle, distinct scene, no handshake',
    fetch: ', simple clear single subject, sharp focus, well lit, no handshake',
    grade: ', high contrast sharp focus well exposed, clean composition, no handshake',
    scene_jump: ', unusual camera angle different from typical stock photo, no handshake',
    escape: ', wide environmental establishing shot unique perspective, no handshake, no people shaking hands',
    minimal: ', simple uncluttered scene, no handshake',
    detail: ', macro close-up texture detail shallow depth of field, no handshake',
    night: ', golden hour or night lighting dramatic mood, no handshake',
    environment: ', empty location no people focus on place and objects, no handshake',
    branch: ', different thematic branch unrelated visual family distinct subject, no handshake',
  };
  if (opts.missMode && missTails[opts.missMode]) tail += missTails[opts.missMode];
  else if (opts.missTail) tail += ', ' + String(opts.missTail);
  const prompt = ('a realistic candid documentary color photograph of ' + String(q || '') + tail).slice(0, 480);
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + (seed % 99999);
}

async function fetchFluxPrompt(q, seed, opts) {
  opts = opts || {};
  const maxTry = opts.maxTry || 6;
  for (let t = 0; t < maxTry; t++) {
    const b = await fetchFluxBuffer(fluxPromptUrl(q, (seed || 0) + t * 17, opts));
    if (b) return b;
  }
  return null;
}

const FLUX_MIN_MS = learnedFluxGapMs();
module.exports = { runFluxJob, fetchFluxBuffer, fetchFluxPrompt, fluxPromptUrl, fluxStats, FLUX_MIN_MS, FLUX_FREQ_MS, POLLINATOR_BREAK_MS, getGapMs, sleep, setFluxAbortCheck, learnedFluxGapMs };
