// _adaptive_throttle_learner.js — learns API sweet-spot wait when alternating flux ↔ DDG (owner 2026-07-04).
// Ladder: 15s floor → 30s → 45s … (+15s steps) on throttle; lock sweet spot on success; step down after consecutive OK.
const fs = require('fs');
const path = require('path');

const WD = process.env.PULSE_WD || 'C:/Users/koryj/website';
const STATE_FILE = path.join(WD, '.adaptive_throttle.json');
const STEP_SEC = parseInt(process.env.THROTTLE_LEARN_STEP_SEC || '15', 10);
const FLOOR_SEC = parseInt(process.env.THROTTLE_LEARN_FLOOR_SEC || process.env.THROTTLE_LEARN_START_SEC || '15', 10);
const START_SEC = FLOOR_SEC;
const MAX_SEC = parseInt(process.env.THROTTLE_LEARN_MAX_SEC || '300', 10);
const DECREASE_AFTER = parseInt(process.env.THROTTLE_LEARN_DECREASE_AFTER || '3', 10);

function buildLadder() {
  const ladder = [];
  for (let s = START_SEC; s <= MAX_SEC; s += STEP_SEC) ladder.push(s * 1000);
  if (!ladder.length) ladder.push(START_SEC * 1000);
  return ladder;
}
const LADDER_MS = buildLadder();

function defaultSlot() {
  return { step: 0, sweetStep: null, hits: 0, successes: 0, consecutiveSuccesses: 0, lastReason: '', lastAt: 0, lockedMs: null };
}

let state = { flux: defaultSlot(), ddg: defaultSlot(), updatedAt: 0 };

function load() {
  try {
    if (!fs.existsSync(STATE_FILE)) return;
    const j = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    for (const k of ['flux', 'ddg']) {
      if (j[k]) state[k] = Object.assign(defaultSlot(), j[k]);
    }
    state.updatedAt = j.updatedAt || 0;
  } catch (e) {}
}

function save() {
  state.updatedAt = Date.now();
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } catch (e) {}
}

load();

function ensureSlot(slot) {
  if (slot !== 'flux' && slot !== 'ddg') slot = 'flux';
  if (!state[slot]) state[slot] = defaultSlot();
  return state[slot];
}

function stepMs(st, stepIdx) {
  return LADDER_MS[Math.min(Math.max(0, stepIdx), LADDER_MS.length - 1)];
}

function getCooldownMs(slot) {
  const st = ensureSlot(slot);
  const idx = st.sweetStep != null ? st.sweetStep : st.step;
  return Math.max(FLOOR_SEC * 1000, stepMs(st, idx));
}

/** Throttle / rate-limit hit — wait at current ladder step; escalate on repeat before success. */
function onThrottle(slot, reason) {
  const st = ensureSlot(slot);
  const now = Date.now();
  const prevWait = stepMs(st, st.step);
  const repeatHit = !!(st.lastAt && st.hits > 0 && (now - st.lastAt) < prevWait + 8000);

  if (st.sweetStep != null) {
    st.step = Math.min(st.sweetStep + 1, LADDER_MS.length - 1);
    st.sweetStep = null;
    st.lockedMs = null;
  } else if (repeatHit) {
    st.step = Math.min(st.step + 1, LADDER_MS.length - 1);
  }

  const ms = Math.max(FLOOR_SEC * 1000, stepMs(st, st.step));
  st.hits = (st.hits || 0) + 1;
  st.consecutiveSuccesses = 0;
  st.lastReason = String(reason || 'throttled').slice(0, 120);
  st.lastAt = now;
  save();
  const nextSec = st.step + 1 < LADDER_MS.length ? Math.round(stepMs(st, st.step + 1) / 1000) : null;
  return {
    ms,
    step: st.step,
    stepSec: Math.round(ms / 1000),
    sweet: false,
    repeatHit,
    nextStepSec: nextSec,
    ladderSec: LADDER_MS.map(x => Math.round(x / 1000)),
  };
}

/** Successful image fetch — lock sweet spot; after consecutive OK, step down toward floor. */
function onSuccess(slot) {
  const st = ensureSlot(slot);
  st.consecutiveSuccesses = (st.consecutiveSuccesses || 0) + 1;
  st.successes = (st.successes || 0) + 1;
  st.lastAt = Date.now();
  let decreased = false;
  if (st.sweetStep == null) {
    st.sweetStep = st.step;
  } else if (st.consecutiveSuccesses >= DECREASE_AFTER && st.sweetStep > 0) {
    st.sweetStep = st.sweetStep - 1;
    st.step = st.sweetStep;
    st.consecutiveSuccesses = 0;
    decreased = true;
  }
  st.lockedMs = Math.max(FLOOR_SEC * 1000, stepMs(st, st.sweetStep));
  save();
  return {
    ms: st.lockedMs,
    step: st.step,
    sweetStep: st.sweetStep,
    stepSec: Math.round(st.lockedMs / 1000),
    sweet: true,
    decreased,
    consecutiveSuccesses: st.consecutiveSuccesses,
  };
}

function snap(slot) {
  const st = ensureSlot(slot);
  const idx = st.sweetStep != null ? st.sweetStep : st.step;
  const ms = stepMs(st, idx);
  return {
    slot,
    step: st.step,
    sweetStep: st.sweetStep,
    waitMs: ms,
    waitSec: Math.round(ms / 1000),
    sweet: st.sweetStep != null,
    hits: st.hits || 0,
    successes: st.successes || 0,
    consecutiveSuccesses: st.consecutiveSuccesses || 0,
    lastReason: st.lastReason || '',
    floorSec: FLOOR_SEC,
    maxSec: MAX_SEC,
    ladderSec: LADDER_MS.map(x => Math.round(x / 1000)),
  };
}

function snapAll() {
  return { flux: snap('flux'), ddg: snap('ddg'), updatedAt: state.updatedAt, ladderSec: LADDER_MS.map(x => Math.round(x / 1000)) };
}

function reset(slot) {
  if (slot === 'flux' || slot === 'ddg') state[slot] = defaultSlot();
  else { state.flux = defaultSlot(); state.ddg = defaultSlot(); }
  save();
}

module.exports = {
  onThrottle,
  onSuccess,
  getCooldownMs,
  snap,
  snapAll,
  reset,
  LADDER_MS,
  START_SEC,
  FLOOR_SEC,
  STEP_SEC,
  MAX_SEC,
  DECREASE_AFTER,
};
