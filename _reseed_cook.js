// _reseed_cook — load the WHOLE population straight into the COOK queue (owner 4444) so every entry
// gets the deep scrub to a true 12/13 (not fast-passed aside). cc_signed go last.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const COOKQ = WD + '/_scrub_cook_queue.json', QUEUE = WD + '/_scrub_button_queue.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id) && !/\bdemo\b|standing desk|\btest entry\b/i.test(String(e.question || '')));
  const unproven = [], certified = [];
  for (const e of es) { (e.cc_signed ? certified : unproven).push(e.id); }
  const all = unproven.concat(certified);
  fs.writeFileSync(COOKQ, JSON.stringify(all));   // everything goes to the deep-cook queue
  fs.writeFileSync(QUEUE, JSON.stringify([]));      // fast-pass queue empty → straight to cooking
  console.log('[reseed-cook] COOK queue = ' + all.length + ' (' + unproven.length + ' unproven, ' + certified.length + ' cc_signed) · fast-queue cleared');
})().catch(e => { console.log('[reseed-cook] FATAL', e && e.message); process.exit(1); });
