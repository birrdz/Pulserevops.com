'use strict';
/**
 * _image_check_drip.js — VERIFY-ONLY image flag drip (owner 2026-07-27).
 * Does NOT place, download, or swap images (IMAGE_PLACEMENT_LAW).
 * Scans whole library for pollinations / broken / missing face markers → ledger + queue.
 *
 *   node _image_check_drip.js
 * Stop: _image_check_stop.flag
 */
'use strict';
const fs = require('fs');
const path = require('path');
const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const LOGF = path.join(WD, '_image_check.out.log');
const STOPF = path.join(WD, '_image_check_stop.flag');
const OUTF = path.join(WD, '_image_flagged.json');
const QUEUEF = path.join(WD, '_image_check_queue.json');
const INTERVAL = parseInt(process.env.IMG_CHECK_INTERVAL_S || '1800', 10) * 1000; // 30m between full passes

function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOGF, line + '\n'); } catch (e) {}
}
function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

function classify(id, title, body, imgField) {
  const b = String(body || '');
  const reasons = [];
  if (/pollinations\.ai/i.test(b) || /pollinations\.ai/i.test(String(imgField || ''))) reasons.push('pollinations_url');
  if (/via\.placeholder|placehold\.co|picsum\.photos/i.test(b)) reasons.push('placeholder_url');
  const mdImgs = (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  if (mdImgs === 0) reasons.push('no_body_images');
  // face path expected at /assets/qa/<id>.jpg — flag if blob.img missing/empty
  if (!imgField || !String(imgField).trim()) reasons.push('missing_face_img_field');
  else if (/pollinations|placeholder/i.test(String(imgField))) reasons.push('bad_face_img_field');
  return reasons;
}

async function onePass() {
  const store = theStore();
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter((e) => e && e.id);
  log('[img-check] scanning ' + entries.length + ' index rows (verify-only, no placement)');
  const flagged = [];
  let checked = 0;
  for (const e of entries) {
    if (fs.existsSync(STOPF)) break;
    checked++;
    let body = '', img = e.img || '';
    try {
      const blob = await store.get('answers/' + e.id + '.json', { type: 'json' });
      if (blob) {
        body = String(blob.answer || '');
        if (blob.img) img = blob.img;
      }
    } catch (err) { continue; }
    const reasons = classify(e.id, e.question || e.title, body, img);
    if (!reasons.length) continue;
    flagged.push({
      id: e.id,
      question: String(e.question || e.title || '').slice(0, 160),
      reasons,
      url: 'https://pulserevops.com/knowledge/' + e.id,
      flagged_at: new Date().toISOString(),
    });
    if (flagged.length % 200 === 0) log('[img-check] flagged ' + flagged.length + ' · checked ' + checked);
  }
  fs.writeFileSync(OUTF, JSON.stringify({ at: new Date().toISOString(), checked, flagged: flagged.length, items: flagged }, null, 0));
  fs.writeFileSync(QUEUEF, JSON.stringify(flagged.map((x) => x.id)));
  log('[img-check] pass done · checked=' + checked + ' flagged=' + flagged.length + ' → ' + OUTF);
  log('[img-check] NOTE: placement is human-only (:7802 / block builder). This drip only flags.');
  return flagged.length;
}

(async () => {
  try { fs.unlinkSync(STOPF); } catch (e) {}
  log('[img-check] FOREVER start · interval=' + (INTERVAL / 1000) + 's · stop via ' + STOPF);
  while (!fs.existsSync(STOPF)) {
    try { await onePass(); } catch (e) { log('[img-check] ERR ' + ((e && e.message) || e)); }
    if (fs.existsSync(STOPF)) break;
    log('[img-check] sleep ' + (INTERVAL / 1000) + 's then rescan whole inventory');
    await new Promise((r) => setTimeout(r, INTERVAL));
  }
  log('[img-check] stop flag — exiting');
})().catch((e) => { log('FATAL ' + e); process.exit(1); });
