#!/usr/bin/env node
/**
 * One-shot: freeze tl answer blobs so banned/old images stay gone.
 *
 *   LIMIT=50 ONCE=1 node _tl_image_freeze_sweep.js
 *   IDS=tl21689,tl21749 node _tl_image_freeze_sweep.js
 *   ALL=1 node _tl_image_freeze_sweep.js
 */
'use strict';

const fs = require('fs');
const { getStore } = require('/workspace/node_modules/@netlify/blobs');
const { freezeTlEntryImages, isBannedTlBodyImageUrl, extractImageUrls } =
  require('/workspace/_tl_image_freeze_lib');
const { stampIndexFromAnswers } = require('/workspace/_finish_index_stamp_lib');

try {
  const envPath = process.env.AQ_DRIP_ENV || '/tmp/aq-drip.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch (_e) {}

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({
  name: 'pulse-machine-library',
  siteID: SITE_ID,
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

function log(m) {
  console.log(new Date().toISOString() + ' ' + m);
}

async function listTlIds() {
  if (process.env.IDS) {
    return process.env.IDS.split(/[\s,]+/).filter((x) => /^tl\d+$/i.test(x));
  }
  if (process.env.FROM && process.env.TO) {
    const lo = parseInt(process.env.FROM, 10);
    const hi = parseInt(process.env.TO, 10);
    const out = [];
    for (let n = hi; n >= lo; n--) out.push('tl' + n);
    return out;
  }
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx && (idx.entries || idx.items || idx)) || [];
  const list = Array.isArray(rows)
    ? rows
    : Object.keys(rows)
        .filter((k) => /^tl\d+$/i.test(k))
        .map((k) => ({ id: k, ...(rows[k] || {}) }));
  let ids = list
    .map((r) => (typeof r === 'string' ? r : r && r.id))
    .filter((id) => /^tl\d+$/i.test(String(id || '')));
  ids = [...new Set(ids)].sort((a, b) => {
    const na = parseInt(String(a).replace(/\D/g, ''), 10) || 0;
    const nb = parseInt(String(b).replace(/\D/g, ''), 10) || 0;
    return nb - na; // high → low
  });
  const limit = process.env.ALL === '1' ? ids.length : parseInt(process.env.LIMIT || '40', 10);
  return ids.slice(0, limit);
}

async function main() {
  const ids = await listTlIds();
  log('FREEZE_SWEEP start n=' + ids.length);
  let changed = 0;
  let bannedLeft = 0;
  const touched = [];
  for (const id of ids) {
    let entry;
    try {
      entry = await store.get(`answers/${id}.json`, { type: 'json', consistency: 'strong' });
    } catch (e) {
      log('ERR get ' + id + ' ' + (e.message || e));
      continue;
    }
    if (!entry || !entry.answer) {
      log('SKIP missing ' + id);
      continue;
    }
    const beforeBanned = extractImageUrls(entry.answer).filter(isBannedTlBodyImageUrl);
    const fr = freezeTlEntryImages(entry, id);
    const afterBanned = extractImageUrls(fr.entry.answer || '').filter(isBannedTlBodyImageUrl);
    if (afterBanned.length) bannedLeft++;
    if (fr.changed || beforeBanned.length) {
      await store.setJSON(`answers/${id}.json`, {
        ...fr.entry,
        updated_at: new Date().toISOString(),
      });
      changed++;
      touched.push(id);
      log(
        'FROZEN ' +
          id +
          ' removed=' +
          fr.removed.length +
          ' beforeBanned=' +
          beforeBanned.length +
          ' afterBanned=' +
          afterBanned.length +
          ' cover=' +
          (fr.cover || '')
      );
    } else {
      log('OK ' + id + ' allowed=' + (fr.allowed || []).length);
    }
  }
  if (touched.length) {
    try {
      await stampIndexFromAnswers(store, touched, { log, lockTlCover: true });
      log('INDEX_STAMPED n=' + touched.length);
    } catch (e) {
      log('INDEX_STAMP_ERR ' + (e.message || e));
    }
  }
  log('FREEZE_SWEEP done changed=' + changed + ' bannedLeft=' + bannedLeft + ' n=' + ids.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
