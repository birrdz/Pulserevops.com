'use strict';
// PILLAR X FACE/TOPS spot-check
// Usage: node _manual_pillar_face_tops_spot.js <pillar> [N=20]
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
const pillar = String(process.argv[2] || '').toLowerCase().replace(/[^a-z]/g, '');
const N = Math.max(1, parseInt(process.argv[3] || '20', 10) || 20);
if (!pillar) {
  console.error('Usage: node _manual_pillar_face_tops_spot.js <pillar> [N]');
  process.exit(2);
}
const QA = path.join(WD, 'assets', 'qa');
const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-' + pillar + '.json'), 'utf8'));
const step = Math.max(1, Math.floor(mos.length / N));
const ids = [];
for (let i = 0; i < N; i++) ids.push(mos[Math.min(mos.length - 1, i * step)].id);

(async () => {
  let facePass = 0, topPass = 0, both = 0;
  const fails = [];
  for (const id of ids) {
    let faceBytes = 0;
    try { faceBytes = fs.statSync(path.join(QA, id + '.jpg')).size; } catch (e) {}
    const faceOk = faceBytes > 8000;
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    const body = String((blob && (blob.answer || blob.body)) || '');
    const faceUrl = '/assets/qa/' + id + '.jpg';
    const md = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    const heroIsFace = md[0] && (md[0][2].replace(/\?.*$/, '') === faceUrl || md[0][2].endsWith('/' + id + '.jpg'));
    const secondIsFace = md[1] && (md[1][2].replace(/\?.*$/, '') === faceUrl || md[1][2].endsWith('/' + id + '.jpg'));
    const topOk = !!(heroIsFace && secondIsFace);
    if (faceOk) facePass++;
    if (topOk) topPass++;
    if (faceOk && topOk) both++;
    else fails.push({ id, faceOk, topOk, second: md[1] && md[1][2].slice(0, 60) });
  }
  const out = {
    process: 'PILLAR X FACE/TOPS',
    pillar,
    checked: ids.length,
    facePass,
    topPass,
    bothPass: both,
    facePct: Math.round(100 * facePass / ids.length),
    topPct: Math.round(100 * topPass / ids.length),
    bothPct: Math.round(100 * both / ids.length),
    gate: both / ids.length >= 0.9 ? 'PASS' : 'FAIL_FIX',
    fails,
  };
  fs.writeFileSync(path.join(WD, '_' + pillar + '_face_tops_spot.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
