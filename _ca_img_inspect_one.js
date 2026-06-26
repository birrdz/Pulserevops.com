const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const id = process.argv[2] || 'ca0571';
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/' + id + '.json', { type: 'json' });
  const a = e.answer;
  console.log({
    items: (a.match(/^##\s+\d+\./gm) || []).length,
    prod: (a.match(/^@@PRODUCT/gm) || []).length,
    imgs: (a.match(/@@PRODUCT[^\n]* img=/g) || []).length,
    noImg: (a.match(/^@@PRODUCT[^\n]*$/gm) || []).filter(l => !/ img=/.test(l)).length,
  });
})();
