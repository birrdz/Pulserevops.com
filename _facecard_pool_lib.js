// _facecard_pool_lib.js — pillar face-card pool paths + metadata (owner 2026-07-06)
'use strict';
const fs = require('fs');
const path = require('path');
const { coverPath, rebakeFaceCardTitle } = require('./_ddg_facecard_lib');

const WD = path.join(__dirname);
const POOL_DIR = WD + '/_facecard_pool';

function poolPath(pillar, seq) {
  return POOL_DIR + '/' + pillar + '/' + seq + '.jpg';
}

function poolCount(pillar) {
  try {
    return fs.readdirSync(POOL_DIR + '/' + pillar).filter((f) => /\.jpg$/.test(f)).length;
  } catch (e) {
    return 0;
  }
}

function metaPath(pillar) {
  return POOL_DIR + '/' + pillar + '/_meta.json';
}

function loadPoolMeta(pillar) {
  try {
    const j = JSON.parse(fs.readFileSync(metaPath(pillar), 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch (e) {
    return [];
  }
}

function savePoolMeta(pillar, meta) {
  fs.mkdirSync(POOL_DIR + '/' + pillar, { recursive: true });
  fs.writeFileSync(metaPath(pillar), JSON.stringify(meta, null, 2));
}

function appendPoolMeta(pillar, entry) {
  const meta = loadPoolMeta(pillar);
  meta.push(entry);
  savePoolMeta(pillar, meta);
  return meta.length - 1;
}

async function applyPoolSlot(id, question, pillar, slotIndex) {
  const src = poolPath(pillar, slotIndex);
  try {
    if (!fs.existsSync(src)) return 0;
    fs.copyFileSync(src, coverPath(id));
  } catch (e) {
    return 0;
  }
  try {
    await rebakeFaceCardTitle(id, question);
  } catch (e) {}
  try {
    return fs.statSync(coverPath(id)).size;
  } catch (e) {
    return 0;
  }
}

module.exports = {
  POOL_DIR,
  poolPath,
  poolCount,
  metaPath,
  loadPoolMeta,
  savePoolMeta,
  appendPoolMeta,
  applyPoolSlot,
};
