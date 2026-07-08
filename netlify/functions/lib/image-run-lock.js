// image-run-lock.js — cross-tool lockfile for Pexels image runs (shared API key with Cursor).
'use strict';

const fs = require('fs');
const path = require('path');

const LOCK_F = path.join(__dirname, '../../../image_run.lock');

function readLock() {
  try {
    return JSON.parse(fs.readFileSync(LOCK_F, 'utf8'));
  } catch (e) {
    return null;
  }
}

function isStale(lock) {
  if (!lock || !lock.at) return true;
  const age = Date.now() - new Date(lock.at).getTime();
  return age > 6 * 60 * 60 * 1000;
}

function acquireLock(holder) {
  holder = holder || {};
  const existing = readLock();
  if (existing && !isStale(existing)) {
    return { acquired: false, holder: existing };
  }
  const lock = {
    operator: holder.operator || 'unknown',
    pid: process.pid,
    pillar: holder.pillar || '',
    at: new Date().toISOString(),
  };
  fs.writeFileSync(LOCK_F, JSON.stringify(lock, null, 2));
  return { acquired: true, lock };
}

function releaseLock() {
  try { fs.unlinkSync(LOCK_F); } catch (e) {}
}

function assertLockHeld() {
  const lock = readLock();
  if (!lock || lock.pid !== process.pid) {
    throw new Error('image_run.lock not held by this process');
  }
}

module.exports = {
  LOCK_F,
  readLock,
  acquireLock,
  releaseLock,
  assertLockHeld,
  isStale,
};
