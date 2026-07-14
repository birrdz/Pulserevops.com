// _manual_face_to_top.js — fix broken/empty face cards, copy face → Q&A top hero.
// Usage: node _manual_face_to_top.js <pillar>
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const QA = path.join(WD, 'assets', 'qa');
const MIN = 20000;

const pillar = String(process.argv[2] || '').toLowerCase().replace(/[^a-z]/g, '');
if (!pillar) { console.error('Usage: node _manual_face_to_top.js <pillar>'); process.exit(2); }
const rx = new RegExp('^' + pillar + '\\d+$', 'i');

function facePath(id) { return path.join(QA, id + '.jpg'); }
function sqPath(id) { return path.join(QA, id + '.sq.jpg'); }
function sizeOf(p) { try { return fs.statSync(p).size; } catch (e) { return 0; } }

function listDonors() {
  const out = [];
  for (const dir of [
    path.join(QA, '_pexels_stored'),
    path.join(QA, '_gp_pool'),
    path.join(WD, '_facecard_pool', pillar),
    path.join(WD, '_facecard_pool'),
  ]) {
    if (!fs.existsSync(dir)) continue;
    const walk = (d) => {
      for (const n of fs.readdirSync(d)) {
        const p = path.join(d, n);
        try {
          if (fs.statSync(p).isDirectory()) walk(p);
          else if (/\.jpe?g$/i.test(n) && fs.statSync(p).size > MIN) out.push(p);
        } catch (e) {}
      }
    };
    walk(dir);
  }
  return out;
}

async function faceBroken(id) {
  const p = facePath(id);
  const sz = sizeOf(p);
  if (sz < MIN) return true;
  try {
    const m = await sharp(p).metadata();
    if (!m.width || !m.height || m.width < 40 || m.height < 40) return true;
    return false;
  } catch (e) { return true; }
}

async function repairFace(id, donors) {
  // 1) prefer browse square
  if (sizeOf(sqPath(id)) > MIN) {
    try {
      await sharp(sqPath(id)).rotate().resize(1200, 675, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true }).toFile(facePath(id));
      if (!(await faceBroken(id))) return 'from-sq';
    } catch (e) {}
    try { fs.copyFileSync(sqPath(id), facePath(id)); if (!(await faceBroken(id))) return 'copy-sq'; } catch (e) {}
  }
  // 2) donor pool
  if (donors.length) {
    const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
    const donor = donors[seed % donors.length];
    try {
      await sharp(donor).rotate().resize(1200, 675, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true }).toFile(facePath(id));
      if (!(await faceBroken(id))) return 'from-donor';
    } catch (e) {}
  }
  return 'fail';
}

function heroUrl(body) {
  const m = String(body || '').match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
  return m ? m[2] : '';
}

(async () => {
  const donors = listDonors();
  console.log('[face→top] pillar=' + pillar + ' donors=' + donors.length);
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = ((idx && idx.entries) || []).filter((e) => e && e.id && rx.test(String(e.id)));
  entries.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  console.log('[face→top] entries=' + entries.length);

  let synced = 0, repaired = 0, wrote = 0, noFace = 0, skipped = 0, errs = 0;
  for (const ent of entries) {
    const id = ent.id;
    try {
      let how = 'ok';
      if (await faceBroken(id)) {
        how = await repairFace(id, donors);
        if (how === 'fail') { noFace++; skipped++; continue; }
        repaired++;
      }

      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!blob || !blob.answer) { skipped++; continue; }

      const q = blob.question || blob.h1 || blob.title || ent.question || id;
      const want = '/assets/qa/' + id + '.jpg';
      const before = heroUrl(blob.answer);
      // Delete wrong top hero lines → apply face as top of Q&A
      const body = syncHeroDupesFaceCard(id, q, blob.answer);
      const after = heroUrl(body);
      const needWrite = before !== after || blob.img !== want || how !== 'ok';

      if (needWrite) {
        blob.answer = body;
        blob.img = want;
        blob.cover_src = 'face-top-sync';
        await store.setJSON('answers/' + id + '.json', blob);
        ent.img = want;
        wrote++;
      }
      synced++;
      if (synced % 40 === 0) console.log('  … ' + synced + '/' + entries.length + ' repaired=' + repaired + ' wrote=' + wrote);
    } catch (e) {
      errs++;
      console.log('  ERR ' + id + ' ' + String(e.message || e).slice(0, 100));
    }
  }

  try { await store.setJSON('_index.json', idx); } catch (e) { console.log('index warn ' + e.message); }

  console.log(JSON.stringify({
    pillar, total: entries.length, synced, repaired, wrote, noFace, skipped, errs, done: true,
  }));
})().catch((e) => { console.error(e); process.exit(1); });
