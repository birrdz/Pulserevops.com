// _tl_done_watch.js — polls tl face-card coverage; exits when all tl entries have a flux cover (<= threshold
// remaining), so the caller can fire a FINAL deploy + kick off the golden-template pass. (owner 2026-07-07)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const THRESH = parseInt(process.env.DONE_THRESHOLD || '5', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  while (true) {
    let remaining = null;
    try {
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const tl = (idx.entries || []).filter(e => e && e.id && /^tl\d+$/.test(e.id));
      remaining = tl.filter(e => e.cover_src !== 'flux').length;
      console.log(new Date().toISOString() + ' tl remaining: ' + remaining + ' / ' + tl.length);
    } catch (e) { console.log('check err ' + e.message); }
    if (remaining != null && remaining <= THRESH) { console.log('TL_FACECARDS_DONE remaining=' + remaining); process.exit(0); }
    await sleep(120000);
  }
})();
