const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const e = await store.get('answers/q11133.json', { type: 'json' });
  const b = (e && e.answer) || '';
  const h2s = b.split('\n').filter(l => /^##\s+/.test(l)).map(l => l.trim());
  const imgs = b.match(/!\[[^\]]*\]\([^)]+\)/g) || [];
  const products = b.match(/^@@PRODUCT.*/gm) || [];
  const poll = b.match(/pollinations\.ai/gi) || [];
  console.log('H2 count', h2s.length);
  h2s.forEach(h => console.log(' ', h));
  console.log('images', imgs.length, 'products', products.length, 'pollinations', poll.length);
})().catch(e => { console.error(e); process.exit(1); });
