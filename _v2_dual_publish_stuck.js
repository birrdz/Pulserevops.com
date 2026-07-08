// Drain dual-consensus entries stuck in _v2_redbox_dual.json (both PASS, not yet cc_approved).
// Usage: node _v2_dual_publish_stuck.js [--dry]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { publishDualSigned, bothPass, readDual } = require('./_v2_nr_dual_gate');

const WD = 'C:/Users/koryj/website';
const FINAL = WD + '/_v2_cc_approved.json';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };

(async () => {
  const dry = process.argv.includes('--dry');
  const cc = new Set(readArr(FINAL));
  const dual = readDual();
  const stuck = Object.keys(dual).filter(id => bothPass(dual, id) && !cc.has(id)).sort();
  console.log(JSON.stringify({ stuck: stuck.length, dry }, null, 2));
  if (dry || !stuck.length) return;

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const byPillar = {};
  const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
  for (const e of idx.entries || []) if (e && e.id) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question });

  let ok = 0, fail = 0;
  for (const id of stuck) {
    const r = await publishDualSigned(id, titleOf[id] || id, valid, byPillar, dsChat, idx);
    if (r) ok++; else fail++;
  }
  console.log(JSON.stringify({ published: ok, failed: fail, ccAfter: readArr(FINAL).length }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
