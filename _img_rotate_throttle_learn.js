'use strict';
/**
 * Self-learning cooldown sweet spots for DD/Fixer image provider rotate.
 * Per-app ladder: floor 30s → +15s on throttle; lock sweet on success; step down after N OK.
 * Persists: .img_rotate_throttle.json
 */
const fs = require('fs');
const path = require('path');

const WD = process.env.PULSE_WD || path.join(__dirname);
const STATE_FILE = path.join(WD, '.img_rotate_throttle.json');
const STEP_SEC = parseInt(process.env.IMG_THROTTLE_STEP_SEC || '15', 10) || 15;
const FLOOR_SEC = Math.max(30, parseInt(process.env.IMG_THROTTLE_FLOOR_SEC || '30', 10) || 30);
const MAX_SEC = parseInt(process.env.IMG_THROTTLE_MAX_SEC || '300', 10) || 300;
const DECREASE_AFTER = parseInt(process.env.IMG_THROTTLE_DECREASE_AFTER || '3', 10) || 3;

const PROVIDERS = ['pexels', 'pollinations', 'cloudflare', 'ddg', 'huggingface', 'grok'];

function buildLadder() {
  const ladder = [];
  for (let s = FLOOR_SEC; s <= MAX_SEC; s += STEP_SEC) ladder.push(s * 1000);
  if (!ladder.length) ladder.push(FLOOR_SEC * 1000);
  return ladder;
}
const LADDER_MS = buildLadder();

function defaultSlot() {
  return {
    step: 0,
    sweetStep: null,
    hits: 0,
    successes: 0,
    consecutiveSuccesses: 0,
    lastReason: '',
    lastAt: 0,
    lockedMs: null,
  };
}

let state = { updatedAt: 0 };
for (const p of PROVIDERS) state[p] = defaultSlot();

function load() {
  try {
    if (!fs.existsSync(STATE_FILE)) return;
    const j = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    for (const p of PROVIDERS) {
      if (j[p]) state[p] = Object.assign(defaultSlot(), j[p]);
    }
    state.updatedAt = j.updatedAt || 0;
  } catch (e) {}
}

function save() {
  state.updatedAt = Date.now();
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {}
}

load();

function ensureSlot(slot) {
  const key = String(slot || '').toLowerCase();
  if (!PROVIDERS.includes(key)) return null;
  if (!state[key]) state[key] = defaultSlot();
  return state[key];
}

function stepMs(stepIdx) {
  return LADDER_MS[Math.min(Math.max(0, stepIdx), LADDER_MS.length - 1)];
}

function getCooldownMs(slot) {
  const st = ensureSlot(slot);
  if (!st) return FLOOR_SEC * 1000;
  const idx = st.sweetStep != null ? st.sweetStep : st.step;
  return Math.max(FLOOR_SEC * 1000, stepMs(idx));
}

function onThrottle(slot, reason) {
  const st = ensureSlot(slot);
  if (!st) return { ms: FLOOR_SEC * 1000, stepSec: FLOOR_SEC, sweet: false };
  const now = Date.now();
  const prevWait = stepMs(st.step);
  const repeatHit = !!(st.lastAt && st.hits > 0 && now - st.lastAt < prevWait + 8000);

  if (st.sweetStep != null) {
    st.step = Math.min(st.sweetStep + 1, LADDER_MS.length - 1);
    st.sweetStep = null;
    st.lockedMs = null;
  } else if (repeatHit) {
    st.step = Math.min(st.step + 1, LADDER_MS.length - 1);
  }

  const ms = Math.max(FLOOR_SEC * 1000, stepMs(st.step));
  st.hits = (st.hits || 0) + 1;
  st.consecutiveSuccesses = 0;
  st.lastReason = String(reason || 'throttled').slice(0, 120);
  st.lastAt = now;
  save();
  return {
    ms,
    step: st.step,
    stepSec: Math.round(ms / 1000),
    sweet: false,
    repeatHit,
  };
}

function onSuccess(slot) {
  const st = ensureSlot(slot);
  if (!st) return { ms: FLOOR_SEC * 1000, stepSec: FLOOR_SEC, sweet: true };
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
  st.lockedMs = Math.max(FLOOR_SEC * 1000, stepMs(st.sweetStep));
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
  if (!st) return null;
  const idx = st.sweetStep != null ? st.sweetStep : st.step;
  const ms = stepMs(idx);
  return {
    slot,
    waitSec: Math.round(ms / 1000),
    sweet: st.sweetStep != null,
    hits: st.hits || 0,
    successes: st.successes || 0,
    consecutiveSuccesses: st.consecutiveSuccesses || 0,
    lastReason: st.lastReason || '',
    floorSec: FLOOR_SEC,
  };
}

function snapAll() {
  const out = { updatedAt: state.updatedAt, floorSec: FLOOR_SEC, stepSec: STEP_SEC };
  for (const p of PROVIDERS) out[p] = snap(p);
  return out;
}

module.exports = {
  PROVIDERS,
  FLOOR_SEC,
  STEP_SEC,
  MAX_SEC,
  LADDER_MS,
  getCooldownMs,
  onThrottle,
  onSuccess,
  snap,
  snapAll,
};
