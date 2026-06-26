// Patch a single entry's question field in answers/<id>.json and _index.json
// Usage: node _fix_q_title.js <id> "<new question>"
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT;
const ID = process.argv[2], Q = process.argv[3];
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const ans = await store.get(`answers/${ID}.json`, { type: 'json' });
  if (!ans) { console.error('no answer blob'); process.exit(1); }
  ans.question = Q;
  await store.setJSON(`answers/${ID}.json`, ans);
  const idx = await store.get('_index.json', { type: 'json' });
  const e = idx.entries.find(x => x && x.id === ID);
  if (e) e.question = Q;
  await store.setJSON('_index.json', idx);
  console.log('patched', ID, '->', Q);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
