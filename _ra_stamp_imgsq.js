'use strict';
/**
 * Stamp RA index img + imgSq from local assets (browse row was black — no imgSq).
 * Does NOT invent faces — only stamps paths that exist on disk.
 */
const fs = require('fs');
const path = require('path');
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
function ok(f) { try { return fs.statSync(f).size > 8000; } catch (e) { return false; } }

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let stamped = 0, noFace = 0, noSq = 0, titled = 0;
  for (const e of (idx.entries || [])) {
    if (!e || !/^ra\d+$/i.test(String(e.id))) continue;
    const id = String(e.id);
    const face = path.join(QA, id + '.jpg');
    const sq = path.join(QA, id + '.sq.jpg');
    const faceUrl = '/assets/qa/' + id + '.jpg';
    const sqUrl = '/assets/qa/' + id + '.sq.jpg';
    let dirty = false;
    if (!String(e.question || e.title || '').trim()) {
      // leave — need real title; count only
    } else titled++;
    if (ok(face)) {
      if (e.img !== faceUrl && (!e.img || /topics\/revenue-architecture/i.test(String(e.img)) || !e.img)) {
        e.img = faceUrl;
        dirty = true;
      }
      e.face_title_baked = false;
    } else noFace++;
    if (ok(sq)) {
      if (e.imgSq !== sqUrl) { e.imgSq = sqUrl; dirty = true; }
    } else {
      // create sq from face if face exists
      if (ok(face)) {
        try {
          const sharp = require('sharp');
          await sharp(face).rotate().resize(760, 760, { fit: 'cover', position: 'north' }).jpeg({ quality: 86, mozjpeg: true }).toFile(sq);
          e.imgSq = sqUrl;
          dirty = true;
        } catch (err) { noSq++; }
      } else noSq++;
    }
    if (dirty) stamped++;
  }
  await store.setJSON('_index.json', idx);
  console.log(JSON.stringify({ ok: true, stamped, titled, noFace, noSq }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
