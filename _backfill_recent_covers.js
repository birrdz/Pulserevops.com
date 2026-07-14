// One-shot: stamp live topic/pool covers on recent imageless Daily Driver entries.
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { attachPublishCover, liveCoverUrl } = require('./_publish_cover');

const DAYS = Number(process.env.DAYS || 14);
const MAX = Number(process.env.MAX || 80);
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const cutoff = Date.now() - DAYS * 86400000;
  const need = (idx.entries || [])
    .filter((e) => e && e.id && Number(e.ts || 0) >= cutoff)
    .filter((e) => !e.img || e.images_pending || e.cover_src === 'topic-interim' || /^\/assets\/qa\/[a-z]+\d+\.jpg$/i.test(e.img))
    .sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
    .slice(0, MAX);

  console.log('candidates', need.length, 'days', DAYS);
  let n = 0;
  for (const e of need) {
    const title = e.question || e.title || e.id;
    // Fast path: if only missing img, stamp live cover without rebaking every time when MAX is large.
    if (process.env.FAST === '1') {
      const img = liveCoverUrl(e.id);
      e.img = img;
      e.cover_src = e.cover_src || (img.includes('/topics/') ? 'topic-interim' : 'pool-interim');
      try {
        const blob = await store.get('answers/' + e.id + '.json', { type: 'json' });
        if (blob) await store.setJSON('answers/' + e.id + '.json', Object.assign({}, blob, { img, cover_src: e.cover_src }));
      } catch (err) {}
      n++;
      console.log('fast', e.id, img);
    } else {
      const r = await attachPublishCover(store, e.id, title);
      n++;
      console.log(e.id, r.img, 'faceLocal=' + !!r.faceLocal);
    }
  }
  if (process.env.FAST === '1') {
    await store.setJSON('_index.json', idx);
  }
  console.log('done', n);
})().catch((e) => { console.error(e); process.exit(1); });
