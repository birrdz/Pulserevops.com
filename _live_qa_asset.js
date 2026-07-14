'use strict';
/**
 * Live QA asset put — CONTENT path (no code deploy per image).
 * Owner 2026-07-13: inventory → search → download → upload live → assign.
 *
 *   1) Write local assets/qa/<rel> (inventory / machine mirror)
 *   2) Put bytes in Netlify Blobs (qa-bin/<rel>) — live the moment serve fn is up
 *   3) Return stable site URL /assets/qa/<rel>
 *
 * Serve: netlify/functions/pulse-qa-asset.js + netlify.toml rewrite (one-time CODE).
 */
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STORE_NAME = 'pulse-machine-library';
const KEY_PREFIX = 'qa-bin/';

let _store = null;

function loadEnv() {
  try {
    for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] == null) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {}
}

function getAssetStore() {
  if (_store) return _store;
  loadEnv();
  const { getStore } = require('@netlify/blobs');
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  _store = getStore({ name: STORE_NAME, siteID: SITE_ID, token });
  return _store;
}

function normalizeRel(relOrName) {
  let r = String(relOrName || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^assets\/qa\//i, '');
  if (!r || r.includes('..')) throw new Error('live-qa-asset: bad path');
  return r;
}

function publicUrl(rel) {
  return '/assets/qa/' + normalizeRel(rel);
}

function localPath(rel) {
  return path.join(QA, normalizeRel(rel).split('/').join(path.sep));
}

function blobKey(rel) {
  return KEY_PREFIX + normalizeRel(rel);
}

/**
 * Put image bytes live + local. Returns site-relative URL.
 * @param {string} rel e.g. "aq123-5.jpg" or "_live_bank/foo.jpg"
 * @param {Buffer} buf
 * @param {{ contentType?: string }} [opts]
 */
async function putQaAsset(rel, buf, opts) {
  opts = opts || {};
  if (!buf || !Buffer.isBuffer(buf) || buf.length < 2000) {
    throw new Error('live-qa-asset: buffer too small');
  }
  const r = normalizeRel(rel);
  const abs = localPath(r);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);

  const ct = opts.contentType || 'image/jpeg';
  let live = false;
  let err = null;
  try {
    const store = getAssetStore();
    await store.set(blobKey(r), buf, { metadata: { contentType: ct, at: new Date().toISOString() } });
    live = true;
  } catch (e) {
    err = String(e.message || e);
  }
  return {
    url: publicUrl(r),
    rel: r,
    bytes: buf.length,
    local: true,
    live,
    err,
  };
}

/** Put from an existing local file (re-upload to live blob). */
async function putQaAssetFile(relOrAbs, opts) {
  const abs = path.isAbsolute(relOrAbs)
    ? relOrAbs
    : localPath(relOrAbs);
  const buf = fs.readFileSync(abs);
  const rel = path.isAbsolute(relOrAbs)
    ? path.relative(QA, abs).replace(/\\/g, '/')
    : normalizeRel(relOrAbs);
  return putQaAsset(rel, buf, opts);
}

async function getQaAssetBuffer(rel) {
  const r = normalizeRel(rel);
  try {
    const store = getAssetStore();
    const buf = await store.get(blobKey(r), { type: 'arrayBuffer' });
    if (buf && buf.byteLength > 2000) return Buffer.from(buf);
  } catch (e) {}
  const abs = localPath(r);
  if (fs.existsSync(abs)) {
    const buf = fs.readFileSync(abs);
    if (buf.length > 2000) return buf;
  }
  return null;
}

module.exports = {
  putQaAsset,
  putQaAssetFile,
  getQaAssetBuffer,
  publicUrl,
  localPath,
  blobKey,
  KEY_PREFIX,
  QA,
};
