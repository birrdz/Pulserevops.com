'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.env.PULSE_ROOT || __dirname;
const QUEUE_FILE = process.env.SQUARE_BUILDER_QUEUE || path.join(ROOT, '_square_builder_queue.json');
const LOCK_FILE = QUEUE_FILE + '.lock';

function emptyState() {
  return { version: 1, pending: [], completedIds: [], completed: 0, failed: 0, updatedAt: null };
}

function readQueueUnlocked() {
  try {
    const value = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    return Object.assign(emptyState(), value, {
      pending: Array.isArray(value.pending) ? value.pending : [],
      completedIds: Array.isArray(value.completedIds) ? value.completedIds : [],
    });
  } catch (e) {
    return emptyState();
  }
}

function writeQueueUnlocked(state) {
  state.updatedAt = new Date().toISOString();
  const tmp = QUEUE_FILE + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  try {
    fs.renameSync(tmp, QUEUE_FILE);
  } catch (e) {
    // Windows cannot always replace an existing destination with renameSync. The queue lock keeps
    // this remove+rename fallback safe from competing fixer/builder writers.
    try { fs.rmSync(QUEUE_FILE, { force: true }); } catch (z) {}
    fs.renameSync(tmp, QUEUE_FILE);
  }
  return state;
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function withQueueLock(fn) {
  const deadline = Date.now() + 5000;
  let fd;
  while (Date.now() < deadline) {
    try {
      fd = fs.openSync(LOCK_FILE, 'wx');
      break;
    } catch (e) {
      try {
        const age = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
        if (age > 30000) fs.rmSync(LOCK_FILE, { force: true });
      } catch (z) {}
      sleepSync(15);
    }
  }
  if (fd == null) throw new Error('square builder queue lock timeout');
  try {
    return fn();
  } finally {
    try { fs.closeSync(fd); } catch (e) {}
    try { fs.rmSync(LOCK_FILE, { force: true }); } catch (e) {}
  }
}

function readSquareQueue() {
  return withQueueLock(() => readQueueUnlocked());
}

function enqueueSquareBuild(id, question) {
  id = String(id || '').trim();
  if (!id) return false;
  return withQueueLock(() => {
    const state = readQueueUnlocked();
    if (state.pending.some(item => item && item.id === id) || state.completedIds.includes(id)) return false;
    state.pending.push({
      id,
      question: String(question || id).trim() || id,
      queuedAt: new Date().toISOString(),
      attempts: 0,
      lastError: '',
    });
    writeQueueUnlocked(state);
    return true;
  });
}

function completeSquareBuild(id) {
  return withQueueLock(() => {
    const state = readQueueUnlocked();
    const before = state.pending.length;
    state.pending = state.pending.filter(item => item && item.id !== id);
    if (state.pending.length === before) return false;
    if (!state.completedIds.includes(id)) state.completedIds.push(id);
    state.completed = (state.completed || 0) + 1;
    writeQueueUnlocked(state);
    return true;
  });
}

function failSquareBuild(id, error) {
  return withQueueLock(() => {
    const state = readQueueUnlocked();
    const item = state.pending.find(row => row && row.id === id);
    if (!item) return false;
    item.attempts = (item.attempts || 0) + 1;
    item.lastError = String(error || 'square build failed').slice(0, 240);
    item.lastAttemptAt = new Date().toISOString();
    state.failed = (state.failed || 0) + 1;
    writeQueueUnlocked(state);
    return true;
  });
}
function removeSquareBuildsByPrefix(prefix) {
  prefix = String(prefix || '').toLowerCase();
  if (!prefix) return 0;
  return withQueueLock(() => {
    const state = readQueueUnlocked();
    const before = state.pending.length;
    state.pending = state.pending.filter(item => !String(item && item.id || '').toLowerCase().startsWith(prefix));
    const removed = before - state.pending.length;
    if (removed) writeQueueUnlocked(state);
    return removed;
  });
}

module.exports = {
  QUEUE_FILE,
  readSquareQueue,
  enqueueSquareBuild,
  completeSquareBuild,
  failSquareBuild,
  removeSquareBuildsByPrefix,
};
