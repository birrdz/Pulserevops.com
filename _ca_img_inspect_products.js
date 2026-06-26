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
  const id = process.argv[2] || 'ca0940';
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/' + id + '.json', { type: 'json' });
  const lines = e.answer.split(/\n/).filter(l => /^@@PRODUCT/.test(l));
  console.log('count', lines.length);
  lines.forEach((l, i) => console.log(i + 1, l.includes(' img=') ? 'HAS' : 'NO', l.slice(0, 100)));
})();
