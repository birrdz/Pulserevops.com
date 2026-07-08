const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  for (const id of ['mv0050', 'mv0049', 'mv0048']) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    const b = String(e.answer);
    const o = syncHeroDupesFaceCard(id, e.question, b);
    console.log(id, 'marker', b.includes('<!--HERO-->'), '->', o.includes('<!--HERO-->'), 'changed', o !== b);
    console.log(o.split('\n').slice(0, 8).join('\n'), '\n---\n');
  }
})();
