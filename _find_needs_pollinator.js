// Find queued Q&As missing pollinator face-card and/or internal flux images.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { bodyImagesAllFlux } = require('./_img_flux_lib');
const { faceCardCoverOk } = require('./_face_cover_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

function imgUrls(body) {
  const imgs = []; let m; const re = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = re.exec(String(body))) && imgs.length < 8) imgs.push(m[1]);
  return imgs;
}

(async () => {
  const q = JSON.parse(fs.readFileSync(WD + '/_scrub_button_queue.json', 'utf8'));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e]));
  const need = [];
  for (const id of q) {
    const ent = byId[id]; if (!ent) continue;
    let body = '';
    try { const b = await store.get('answers/' + id + '.json', { type: 'json' }); body = (b && b.answer) || ''; } catch (e) {}
    const face = faceCardCoverOk(id, ent.cover_src);
    const flux = bodyImagesAllFlux(body);
    if (!face || !flux) {
      need.push({ id, face, flux, cover_src: ent.cover_src || null, imgs: imgUrls(body), title: String(ent.question || '').slice(0, 60) });
    }
    if (need.length >= 5) break;
  }
  console.log(JSON.stringify({ scanned: q.length, found: need.length, picks: need }, null, 2));
})().catch(e => { console.error(e.message); process.exit(1); });
