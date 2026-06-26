const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const ID = process.argv[2] || 'ca0923';
(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN
  });
  const e = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!e) { console.error('not found', ID); process.exit(1); }
  const out = 'C:/Users/koryj/website/lab/_' + ID + '_body.md';
  fs.writeFileSync(out, e.answer);
  console.log(ID, e.question, '| chars:', e.answer.length, '| words:', e.answer.split(/\s+/).length);
})().catch(e => { console.error(e); process.exit(1); });
