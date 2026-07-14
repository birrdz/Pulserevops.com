'use strict';
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
const mosaic = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-st.json'), 'utf8'));
const ids = mosaic.map((x) => x.id || x).filter(Boolean);
function faceOk(id) {
  try { return fs.statSync(path.join(QA, id + '.jpg')).size > 8000; } catch (e) { return false; }
}
(async () => {
  const left = [];
  let faceFiles = 0, faceBlob = 0, topSame = 0, topDiff = 0, noBlob = 0, noFaceFile = 0;
  for (const id of ids) {
    const hasFace = faceOk(id);
    if (hasFace) faceFiles++;
    else noFaceFile++;
    let blob = null;
    try { blob = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {}
    if (!blob) { noBlob++; left.push(id); continue; }
    const face = '/assets/qa/' + id + '.jpg';
    const img = String(blob.img || '').replace(/\?.*$/, '');
    if (img === face || img.endsWith('/' + id + '.jpg')) faceBlob++;
    const body = String(blob.answer || blob.body || '');
    const ms = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    const first = ms[0] ? ms[0][2].replace(/\?.*$/, '') : '';
    const topOk = first === face || first.endsWith('/' + id + '.jpg');
    if (topOk) topSame++;
    else { topDiff++; left.push(id); }
    if (!hasFace && !left.includes(id)) left.push(id);
  }
  const uniqLeft = [...new Set(left)];
  fs.writeFileSync(path.join(WD, '_st_face_tops_queue.json'), JSON.stringify({
    at: new Date().toISOString(),
    total: ids.length,
    faceFiles,
    faceBlob,
    topSame,
    left: uniqLeft,
  }, null, 1));
  console.log(JSON.stringify({
    mosaic: ids.length,
    faceFiles,
    noFaceFile,
    faceBlob,
    topSame,
    topDiffOrMissing: topDiff + noBlob,
    noBlob,
    left: uniqLeft.length,
    next: uniqLeft.slice(0, 10),
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
