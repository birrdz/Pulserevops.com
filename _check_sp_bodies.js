'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN
});
(async () => {
  for (const id of ['sp0255', 'sp0036', 'sp0241']) {
    try {
      const a = await store.get('answers/' + id + '.json', { type: 'json' });
      const ans = String((a && (a.answer || a.body)) || '');
      console.log(id, 'blob=' + !!a, 'ansLen=' + ans.length, 'words=' + ans.split(/\s+/).filter(Boolean).length);
    } catch (e) {
      console.log(id, 'ERR', e.message);
    }
  }
  const cachePath = WD + '/sim/scan_cache.json';
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  const sp = Object.keys(cache).filter(k => k.startsWith('sp'));
  const empty = sp.filter(k => !(cache[k] && cache[k].words));
  console.log('cache sp=' + sp.length + ' zeroWord=' + empty.length);
  console.log('zero sample: ' + empty.slice(0, 12).join(','));
})().catch(e => { console.error(e); process.exit(1); });
