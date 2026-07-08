// _image_provider_alternate.js — global DDG ↔ Pollinator alternation + adaptive per-provider cooldown (owner 2026-07-06).
// Q&A image repair / fill: one provider per request, strict alternation, 15s floor with adaptive sweet-spot learning.
const FLOOR_MS = parseInt(process.env.IMAGE_PROVIDER_COOLDOWN_MS || '15000', 10);
const DDG_COOLDOWN_MS = parseInt(process.env.DDG_THROTTLE_COOLDOWN_MS || process.env.DDG_DELAY_MS || String(FLOOR_MS), 10);
const FLUX_COOLDOWN_MS = parseInt(
  process.env.FLUX_THROTTLE_COOLDOWN_MS || process.env.POLLINATOR_FREQ_MS || process.env.POLLINATOR_MIN_MS || process.env.IMAGE_GAP_MS || '20000',
  10
);

let adaptiveThrottle;
try { adaptiveThrottle = require('./_adaptive_throttle_learner'); } catch (e) { adaptiveThrottle = null; }

const THROTTLE_KW = /429|403|throttl|rate.?limit|cooldown|too many|busy/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

let turn = Promise.resolve();
let lastProvider = null;
const lastDoneAt = { ddg: 0, flux: 0, any: 0 };
const stats = { ddg: 0, flux: 0, waits: 0, lastLabel: '', lastWaitMs: 0, lastLearn: null };

function isThrottleMsg(msg) { return THROTTLE_KW.test(String(msg || '')); }

function providerFloorMs(provider) {
  if (provider === 'flux') return Math.max(0, FLUX_COOLDOWN_MS);
  return Math.max(FLOOR_MS, DDG_COOLDOWN_MS);
}

function providerCooldownMs(provider) {
  if (adaptiveThrottle) return Math.max(providerFloorMs(provider), adaptiveThrottle.getCooldownMs(provider));
  return providerFloorMs(provider);
}

function globalCooldownMs() {
  return Math.max(providerCooldownMs('ddg'), providerCooldownMs('flux'));
}

/** Pick the next provider: flip from last, or honor preferred on first call. */
function nextAlternateProvider(preferred) {
  if (lastProvider === 'flux') return 'ddg';
  if (lastProvider === 'ddg') return 'flux';
  return preferred === 'ddg' ? 'ddg' : 'flux';
}

function canUseProvider(provider, opts) {
  opts = opts || {};
  if (opts.noAlternate || opts.forceProvider) return true;
  if (!lastProvider) return true;
  return provider !== lastProvider;
}

async function waitForProvider(provider, opts) {
  opts = opts || {};
  if (opts.noAlternate) {
    const gap = Math.max(0, providerCooldownMs(provider) - (Date.now() - lastDoneAt[provider]));
    if (gap > 0) {
      stats.waits++;
      stats.lastWaitMs = gap;
      await sleep(gap);
    }
    return;
  }
  while (!canUseProvider(provider, opts)) {
    stats.waits++;
    await sleep(500);
  }
  const providerGap = Math.max(0, providerCooldownMs(provider) - (Date.now() - lastDoneAt[provider]));
  const globalGap = Math.max(0, globalCooldownMs() - (Date.now() - lastDoneAt.any));
  const gap = Math.max(providerGap, globalGap);
  if (gap > 0) {
    stats.waits++;
    stats.lastWaitMs = gap;
    await sleep(gap);
  }
}

function jobOk(result) {
  if (result === null || result === false || result === undefined) return false;
  if (typeof result === 'number') return result > 0;
  if (typeof result === 'string') return result.length > 0;
  return true;
}

function markProviderDone(provider, ok) {
  if (!ok) return;
  const now = Date.now();
  lastDoneAt[provider] = now;
  lastDoneAt.any = now;
  lastProvider = provider;
  stats[provider]++;
}

function reportProviderOutcome(provider, ok, reason, opts) {
  if (!adaptiveThrottle) return null;
  opts = opts || {};
  const throttle = !!(opts.throttle || opts.throttleReason || (reason && isThrottleMsg(reason)));
  let learn;
  if (ok) {
    learn = adaptiveThrottle.onSuccess(provider);
    stats.lastLearn = { provider, ok: true, stepSec: learn.stepSec, sweet: true, decreased: !!learn.decreased };
  } else if (throttle) {
    learn = adaptiveThrottle.onThrottle(provider, reason || opts.throttleReason || 'throttled');
    stats.lastLearn = { provider, ok: false, stepSec: learn.stepSec, sweet: false, reason: reason || opts.throttleReason || 'throttled' };
  }
  return learn || null;
}

async function runProviderJob(provider, fn, label, opts) {
  opts = opts || {};
  if (provider !== 'ddg' && provider !== 'flux') throw new Error('runProviderJob: bad provider ' + provider);
  const waitForPrior = turn;
  let releaseTurn;
  turn = new Promise(r => { releaseTurn = r; });
  await waitForPrior;
  try {
    await waitForProvider(provider, opts);
    stats.lastLabel = label || provider;
    let result;
    let failReason = null;
    try {
      result = await fn();
      if (opts.throttleReason) failReason = opts.throttleReason;
    } catch (e) {
      if (e && e.code === 'SCRUB_STOP') throw e;
      if (isThrottleMsg(e.message)) failReason = e.message;
      result = null;
    }
    const ok = jobOk(result);
    reportProviderOutcome(provider, ok, failReason, opts);
    markProviderDone(provider, ok);
    return result;
  } finally {
    releaseTurn();
  }
}

async function runDdgJob(fn, label, opts) {
  return runProviderJob('ddg', fn, label || 'ddg', opts);
}

async function runFluxAlternateJob(fn, label, opts) {
  return runProviderJob('flux', fn, label || 'flux', opts);
}

function throttleLearnSnap() {
  return adaptiveThrottle ? adaptiveThrottle.snapAll() : null;
}

function providerStats() {
  const now = Date.now();
  const ago = (slot) => lastDoneAt[slot] ? Math.max(0, Math.round((now - lastDoneAt[slot]) / 1000)) : null;
  const learn = throttleLearnSnap();
  const ddgWait = providerCooldownMs('ddg');
  const fluxWait = providerCooldownMs('flux');
  return {
    lastProvider,
    nextProvider: lastProvider ? nextAlternateProvider() : null,
    floorMs: FLOOR_MS,
    floorSec: Math.round(FLOOR_MS / 1000),
    cooldownMs: globalCooldownMs(),
    cooldownSec: Math.round(globalCooldownMs() / 1000),
    ddgCooldownMs: ddgWait,
    ddgCooldownSec: Math.round(ddgWait / 1000),
    ddgWaitSec: Math.round(ddgWait / 1000),
    ddgSweet: !!(learn && learn.ddg && learn.ddg.sweet),
    fluxCooldownMs: fluxWait,
    fluxCooldownSec: Math.round(fluxWait / 1000),
    fluxWaitSec: Math.round(fluxWait / 1000),
    fluxSweet: !!(learn && learn.flux && learn.flux.sweet),
    adaptive: !!adaptiveThrottle,
    throttleLearn: learn,
    lastLearn: stats.lastLearn,
    lastDoneAgoSec: { ddg: ago('ddg'), flux: ago('flux'), any: ago('any') },
    jobCount: { ddg: stats.ddg, flux: stats.flux },
    waits: stats.waits,
    lastLabel: stats.lastLabel,
    lastWaitMs: stats.lastWaitMs,
  };
}

function cooldownLabel() {
  const s = providerStats();
  const ddgTag = s.ddgSweet ? (s.ddgWaitSec + 's🔒') : (s.ddgWaitSec + 's');
  const fluxTag = s.fluxSweet ? (s.fluxWaitSec + 's🔒') : (s.fluxWaitSec + 's');
  return 'DDG ' + ddgTag + ' · Pollinator ' + fluxTag + ' · alternate · floor ' + s.floorSec + 's';
}

function learnLogLine() {
  const s = providerStats();
  if (!s.adaptive) return 'throttle-learn: off · floor ' + s.floorSec + 's';
  const ddg = s.throttleLearn && s.throttleLearn.ddg;
  const flux = s.throttleLearn && s.throttleLearn.flux;
  const fmt = (slot, snap) => {
    if (!snap) return slot + '=n/a';
    return slot + '=' + snap.waitSec + 's' + (snap.sweet ? '🔒' : '') + (snap.hits ? (' hits=' + snap.hits) : '');
  };
  return 'throttle-learn · ' + fmt('ddg', ddg) + ' · ' + fmt('flux', flux) + ' · floor ' + s.floorSec + 's';
}

/** LOCKED gold-template law — saved bodies must not carry live Pollinator URLs. */
const LIVE_POLLINATIONS_RE = /(?:https?:)?\/\/(?:image\.)?pollinations\.ai\//i;

function auditLivePollinationsInBody(body) {
  return LIVE_POLLINATIONS_RE.test(String(body || '')) ? ['live_pollinations_url_in_body'] : [];
}

/** LOCKED gold-template law — Direct Answer must be dense (≥140 chars, ≥2 sentences). */
function auditDirectAnswerNotBlank(body) {
  const m = String(body || '').match(/##\s+Direct\s+Answer\s*\n+([\s\S]*?)(?=\n#{2,3}\s|\n```|$)/i);
  if (!m) return ['direct_answer_blank'];
  const para = m[1]
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`>_]/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .trim();
  const sentences = (para.match(/[.!?](?:\s|$)/g) || []).length;
  if (para.length < 140 || sentences < 2) return ['direct_answer_blank'];
  return [];
}

const GOLD_IMAGE_PROVIDER_LAW = [
  'LOCKED image/provider law (owner 4444, 2026-07-06):',
  '- DDG ↔ Pollinator strict alternation via _image_provider_alternate.js (runDdgJob / runFluxAlternateJob)',
  '- 15s floor BOTH providers — adaptive learner optimizes wait (persists .adaptive_throttle.json); IMAGE_PROVIDER_COOLDOWN_MS=' + FLOOR_MS,
  '- Saved bodies: self-hosted /assets/qa/ (or pillar pool) — NO live image.pollinations.ai URLs',
].join('\n');

module.exports = {
  FLOOR_MS,
  COOLDOWN_MS: FLOOR_MS,
  DDG_COOLDOWN_MS,
  FLUX_COOLDOWN_MS,
  GOLD_IMAGE_PROVIDER_LAW,
  LIVE_POLLINATIONS_RE,
  auditLivePollinationsInBody,
  auditDirectAnswerNotBlank,
  nextAlternateProvider,
  runProviderJob,
  runDdgJob,
  runFluxAlternateJob,
  providerStats,
  throttleLearnSnap,
  cooldownLabel,
  learnLogLine,
  reportProviderOutcome,
  isThrottleMsg,
  canUseProvider,
};
