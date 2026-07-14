'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { publicUrlFor, routeSegFor } = require('./_publish_cover');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 15);
  console.log('newest', es.length);
  for (const e of es) {
    const id = e.id;
    const blob = await store.get('answers/' + id + '.json', { type: 'json' });
    const words = blob && blob.answer ? String(blob.answer).split(/\s+/).length : 0;
    console.log([
      id,
      'seg=' + routeSegFor(id),
      'url=' + publicUrlFor(id),
      'img=' + (e.img ? 'yes' : 'no'),
      'words=' + words,
      'q=' + String(e.question || '').slice(0, 48),
    ].join(' | '));
  }
})().catch((e) => { console.error(e); process.exit(1); });
