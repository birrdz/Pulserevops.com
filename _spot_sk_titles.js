'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const sharp = require('sharp');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN
});

const ids = process.argv.slice(2);
const list = ids.length ? ids : ['sk0086', 'sk0085', 'sk0095', 'sk0088', 'sk0083', 'sk0092', 'sk0091', 'sk0093'];

/** Heuristic: gold baked titles leave a high-sat yellow band on lower third — sample pixels. */
async function yellowBandHint(path) {
  try {
    const { data, info } = await sharp(path)
      .resize(120, 160, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;
    let gold = 0, n = 0;
    const y0 = Math.floor(h * 0.55);
    for (let y = y0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        n++;
        // gold-ish: high R/G, low B
        if (r > 160 && g > 120 && b < 100 && r > b + 60) gold++;
      }
    }
    return +(gold / Math.max(1, n)).toFixed(3);
  } catch (e) {
    return null;
  }
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const byId = {};
  for (const e of (idx && idx.entries) || []) if (e && e.id) byId[e.id] = e;

  for (const id of list) {
    const a = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!a) { console.log(id + ' MISSING_BLOB'); continue; }
    const h1 = String(a.h1 || a.title || '').trim();
    const q = String(a.question || '').trim();
    const cp = WD + '/assets/qa/' + id + '.jpg';
    let bytes = 0, exists = false;
    try { bytes = fs.statSync(cp).size; exists = true; } catch (e) {}
    const goldRatio = exists ? await yellowBandHint(cp) : null;
    const ent = byId[id] || {};
    const okTitle = !!(h1 || q);
    const okImg = exists && bytes > 8000;
    const bakeFlag = a.face_title_baked === true || ent.face_title_baked === true;
    const suspectBake = goldRatio != null && goldRatio > 0.12;
    console.log(JSON.stringify({
      id,
      okTitle,
      okImg,
      bytes,
      h1: h1.slice(0, 70),
      q: q.slice(0, 70),
      cover_src: a.cover_src || null,
      face_title_baked: a.face_title_baked,
      idx_img: ent.img || null,
      idx_baked: ent.face_title_baked,
      goldLowerRatio: goldRatio,
      suspectBake,
      qs: a.quality_score,
      verdict: (!okTitle || !okImg || bakeFlag || suspectBake) ? 'CHECK' : 'OK'
    }));
  }
})().catch(e => { console.error(e); process.exit(1); });
