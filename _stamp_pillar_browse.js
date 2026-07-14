'use strict';
/**
 * Stamp pillar browse squares + face URLs on index from local disk.
 * Fixes black homepage cards when .sq.jpg exists locally but imgSq is null in index
 * (and creates .sq.jpg from face when missing).
 *
 * Usage: node _stamp_pillar_browse.js ik
 *        node _stamp_pillar_browse.js ra,ik
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const QA = path.join(WD, 'assets', 'qa');
const pillars = String(process.argv[2] || 'ik').toLowerCase().split(/[,+]/).map((s) => s.trim()).filter(Boolean);
function fileOk(f) { try { return fs.statSync(f).size > 8000; } catch (e) { return false; } }

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const out = {};
  for (const pfx of pillars) {
    const rx = new RegExp('^' + pfx + '\\d+$', 'i');
    let stamped = 0, madeSq = 0, noFace = 0, noTitle = 0, total = 0;
    for (const e of (idx.entries || [])) {
      if (!e || !rx.test(String(e.id))) continue;
      total++;
      const id = String(e.id);
      const facePath = path.join(QA, id + '.jpg');
      const sqPath = path.join(QA, id + '.sq.jpg');
      const faceUrl = '/assets/qa/' + id + '.jpg';
      const sqUrl = '/assets/qa/' + id + '.sq.jpg';
      const q = String(e.question || e.title || '').trim();
      if (!q) noTitle++;
      let dirty = false;
      if (!fileOk(facePath)) { noFace++; continue; }
      if (!fileOk(sqPath)) {
        try {
          await sharp(facePath).rotate().resize(760, 760, { fit: 'cover', position: 'north' }).jpeg({ quality: 86, mozjpeg: true }).toFile(sqPath);
          madeSq++;
        } catch (err) { continue; }
      }
      if (e.imgSq !== sqUrl) { e.imgSq = sqUrl; dirty = true; }
      // Prefer real face over topic stock on answer cards
      if (!e.img || /\/assets\/topics\//i.test(String(e.img)) || /\.sq\.jpg/i.test(String(e.img))) {
        e.img = faceUrl; dirty = true;
      }
      e.face_title_baked = false;
      if (dirty) stamped++;
    }
    out[pfx] = { total, stamped, madeSq, noFace, noTitle };
  }
  await store.setJSON('_index.json', idx);
  console.log(JSON.stringify({ ok: true, pillars: out }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
