'use strict';
/** Stamp RA img + imgSq from local files; report which still 404 on live CDN. */
const fs = require('fs');
const path = require('path');
const https = require('https');
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
const mosaic = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ra.json'), 'utf8'));
const ids = mosaic.map((x) => x.id || x).filter(Boolean);

function diskOk(id, kind) {
  const f = path.join(QA, id + (kind === 'sq' ? '.sq.jpg' : '.jpg'));
  try { return fs.statSync(f).size > 8000; } catch (e) { return false; }
}
function head(p) {
  return new Promise((res) => {
    const req = https.request({ hostname: 'pulserevops.com', path: p, method: 'HEAD', timeout: 15000 }, (r) => {
      res(r.statusCode);
    });
    req.on('error', () => res(0));
    req.on('timeout', () => { req.destroy(); res(0); });
    req.end();
  });
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map();
  for (const e of (idx.entries || [])) {
    if (e && e.id) byId.set(String(e.id).toLowerCase(), e);
  }
  let stamped = 0, missingDisk = 0;
  const needDeploy = [];
  for (const id of ids) {
    const faceOk = diskOk(id, 'face');
    const sqOk = diskOk(id, 'sq');
    if (!faceOk || !sqOk) { missingDisk++; continue; }
    const face = '/assets/qa/' + id + '.jpg';
    const sq = '/assets/qa/' + id + '.sq.jpg';
    let ent = byId.get(String(id).toLowerCase());
    if (!ent) {
      ent = { id, has_answer: true };
      idx.entries.unshift(ent);
      byId.set(String(id).toLowerCase(), ent);
    }
    // Title stays HTML question — do not bake into JPG
    if (!String(ent.question || '').trim() && mosaic.find) {
      const row = mosaic.find((x) => (x.id || x) === id);
      if (row && row.question) ent.question = row.question;
    }
    ent.img = face;
    ent.imgSq = sq;
    ent.cover_src = ent.cover_src === 'topic-interim' || !ent.cover_src ? 'pexels-topic' : ent.cover_src;
    ent.face_title_baked = false;
    stamped++;
  }
  await store.setJSON('_index.json', idx);

  // Spot-check live CDN for a sample + any known misses
  const sample = ids.filter((_, i) => i % 20 === 0).slice(0, 40);
  for (const id of sample) {
    const s = await head('/assets/qa/' + id + '.sq.jpg');
    const f = await head('/assets/qa/' + id + '.jpg');
    if (s !== 200 || f !== 200) needDeploy.push({ id, sq: s, face: f });
  }

  console.log(JSON.stringify({
    total: ids.length,
    stamped,
    missingDisk,
    sampleChecked: sample.length,
    sample404: needDeploy.length,
    sample404ids: needDeploy.slice(0, 20),
    note: 'Index stamped. Live 404s need draft deploy of assets/qa/ra*.jpg + .sq.jpg',
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
