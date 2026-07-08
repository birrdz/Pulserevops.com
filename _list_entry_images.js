const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const id = process.argv[2];
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  const body = e.answer || '';
  const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  imgs.forEach((m, i) => console.log((i + 1) + '. [' + m[1].slice(0, 80) + ']\n   ' + m[2]));
})().catch(e => { console.error(e); process.exit(1); });
