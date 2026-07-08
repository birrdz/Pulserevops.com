#!/usr/bin/env node
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const mv = (idx.entries || []).filter(e => e && /^mv\d/i.test(String(e.id))).slice(0, 8);
  for (const row of mv) {
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const body = String(e && e.answer || '');
    const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map(m => ({ alt: m[1].slice(0, 40), url: m[2] }));
    console.log('\n===', row.id, row.question);
    imgs.slice(0, 6).forEach((im, i) => console.log(' ', i, im.url, '|', im.alt));
  }
})();
