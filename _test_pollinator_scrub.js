// Scrub ONE queued Q&A that is missing pollinator images (not random).
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { bodyImagesAllFlux } = require('./_img_flux_lib');
const { faceCardCoverOk } = require('./_face_cover_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const QUEUE = WD + '/_scrub_button_queue.json';
const KEY = '4444';
const TARGET = process.argv[2] || null;

function imgUrls(body) {
  const imgs = []; let m; const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = re.exec(String(body))) && imgs.length < 12) imgs.push(m[1]);
  return imgs;
}

async function snap(id) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ent = (idx.entries || []).find(e => e && e.id === id) || {};
  const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  const body = blob && blob.answer ? blob.answer : '';
  let coverKb = 0; try { coverKb = Math.round(fs.statSync(path.join(WD, 'assets/qa', id + '.jpg')).size / 1024); } catch (e) {}
  return { id, cover_src: ent.cover_src || null, faceFlux: faceCardCoverOk(id, ent.cover_src), allFlux: bodyImagesAllFlux(body), coverKb, imgUrls: imgUrls(body) };
}

async function pickNeedsScrub(q) {
  if (TARGET) return TARGET;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e]));
  for (const id of q) {
    const ent = byId[id]; if (!ent) continue;
    const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    const body = blob && blob.answer ? blob.answer : '';
    if (!faceCardCoverOk(id, ent.cover_src) || !bodyImagesAllFlux(body)) return id;
  }
  return q[0];
}

(async () => {
  const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  const pick = await pickNeedsScrub(q);
  console.log('TEST ID (needs pollinator):', pick);
  const before = await snap(pick);
  console.log('BEFORE', JSON.stringify(before, null, 2));
  const rest = q.filter(x => x !== pick);
  fs.writeFileSync(QUEUE, JSON.stringify([pick, ...rest]));
  console.log('scrub-one starting (flux images are slow — several minutes)...');
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30 * 60 * 1000);
  let r;
  try {
    r = await fetch('http://localhost:8899/scrub-one', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY }), signal: ctrl.signal });
  } catch (e) {
    clearTimeout(timer);
    throw new Error('scrub-one fetch failed — is _scrub_button_server.js running on :8899? ' + e.message);
  }
  clearTimeout(timer);
  const out = await r.json();
  const after = await snap(pick);
  console.log('SCRUB', JSON.stringify({ status: out.status, score: out.score, steps: out.steps, msg: out.msg, beforeScore: out.before, elapsedSec: Math.round((Date.now() - t0) / 1000) }, null, 2));
  console.log('AFTER', JSON.stringify(after, null, 2));
  console.log('IMPROVED', { faceCard: !before.faceFlux && after.faceFlux, internalFlux: !before.allFlux && after.allFlux });
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
