// _all_to_red — move the ENTIRE live population into RED (owner 4444, 2026-07-02).
// green(_v2_approved) -> 0 (backed up), QUEUE = every live index id (round-robin by pillar so the first
// 1000 is a representative cross-section), COOKQ cleared. Truly-12/13 entries will wave through fast;
// everything else gets a real re-scrub under the NEW rubric (Top-10 must ship all 10 images).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const AP = WD + '/_v2_approved.json', COOKQ = WD + '/_scrub_cook_queue.json', QUEUE = WD + '/_scrub_button_queue.json';
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id)).map(e => e.id);
  const byP = {}; for (const id of ids) (byP[pillarOf(id)] = byP[pillarOf(id)] || []).push(id);
  const pillars = Object.keys(byP).sort();
  const queue = []; let more = true;
  for (let i = 0; more; i++) { more = false; for (const p of pillars) { if (byP[p][i]) { queue.push(byP[p][i]); more = true; } } }
  // backup + zero green
  try { fs.writeFileSync(WD + '/_v2_approved.pre_allred.json', fs.readFileSync(AP, 'utf8')); } catch (e) {}
  fs.writeFileSync(AP, JSON.stringify([]));
  fs.writeFileSync(COOKQ, JSON.stringify([]));
  fs.writeFileSync(QUEUE, JSON.stringify(queue));
  console.log('[all-to-red] green -> 0  ·  red(to-scrub) = ' + queue.length + '  ·  pillars = ' + pillars.length);
  console.log('first 20:', queue.slice(0, 20).join(' '));
})().catch(e => { console.log('FATAL', e && e.message); process.exit(1); });
