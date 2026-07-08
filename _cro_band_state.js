// _cro_band_state.js — report CRO sprint publish state for assigning the writer crew.
const fs = require('fs');
for (const f of ['.env.local', '.env']) {
  try { for (const ln of fs.readFileSync(f, 'utf8').split(/\r?\n/)) { const m = ln.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
}
const { getStore } = require('@netlify/blobs');
const idnum = (id) => parseInt(String(id).replace(/^tl/i, ''), 10);
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const pub = new Set(idx.entries.filter(e => e && /^tl\d+$/i.test(e.id)).map(e => idnum(e.id)));
  const queue = JSON.parse(fs.readFileSync('_cro_market_queue.json', 'utf8'));
  const items = Array.isArray(queue) ? queue : (queue.items || queue.queue || []);
  // Band: tl9398–10008. Front (Claude) <9728, Back (DeepSeek) >=9728.
  const inBand = items.filter(it => { const n = idnum(it.id); return n >= 9398 && n <= 10008; });
  const unpub = inBand.filter(it => !pub.has(idnum(it.id)));
  const frontUnpub = unpub.filter(it => idnum(it.id) < 9728).sort((a, b) => idnum(a.id) - idnum(b.id));
  const backUnpub = unpub.filter(it => idnum(it.id) >= 9728).sort((a, b) => idnum(a.id) - idnum(b.id));
  console.log('CRO band total:', inBand.length, '| published:', inBand.length - unpub.length, '| remaining:', unpub.length);
  console.log('FRONT (Claude, <9728) remaining:', frontUnpub.length, frontUnpub.length ? `[${frontUnpub[0].id}..${frontUnpub[frontUnpub.length-1].id}]` : '');
  console.log('BACK (DeepSeek, >=9728) remaining:', backUnpub.length, backUnpub.length ? `[${backUnpub[0].id}..${backUnpub[backUnpub.length-1].id}]` : '');
  console.log('\n--- FRONT next 16 (for 2 Claude writers, 8 each) ---');
  frontUnpub.slice(0, 16).forEach(it => console.log(it.id, '::', it.title));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
