const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const path = require('path');
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const e = await store.get('answers/aq1158.json', { type: 'json' });
  const idx = await store.get('_index.json', { type: 'json' });
  const row = (idx.entries || []).find(x => x && x.id === 'aq1158');
  console.log('index img:', row && row.img);
  console.log('FIRST 2 LINES:\n' + (e.answer || '').split('\n').slice(0, 2).join('\n'));
  const local = path.join(WD, 'assets', 'qa', 'aq1158.jpg');
  console.log('local jpg:', fs.existsSync(local), fs.existsSync(local) ? fs.statSync(local).size : 0);
})().catch(err => { console.error(err); process.exit(1); });
