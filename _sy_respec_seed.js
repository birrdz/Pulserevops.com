// _sy_respec_seed.js — build _sy_respec_queue.json for the v1→v2 age-band respec of sy0010–sy0100.
// Pulls each entry's current title from the live _index.json. Priority: the 3 short-a-men's-block
// ids (sy0036/0041/0042) first, then ascending. Feed to _sy_ds_run.js via SY_QUEUE.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const n = id => parseInt(id.slice(2), 10);
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = await s.get('_index.json', { type: 'json' });
  const items = (idx.entries || [])
    .filter(e => e && /^sy\d+$/.test(e.id) && n(e.id) >= 10 && n(e.id) <= 100)
    .map(e => ({ id: e.id, title: e.question }));
  const pri = new Set(['sy0036', 'sy0041', 'sy0042']);
  items.sort((a, b) => (pri.has(b.id) - pri.has(a.id)) || a.id.localeCompare(b.id));
  fs.writeFileSync('C:/Users/koryj/website/_sy_respec_queue.json', JSON.stringify(items, null, 1));
  console.log('respec queue:', items.length, 'entries; first 6:', items.slice(0, 6).map(x => x.id).join(','));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
