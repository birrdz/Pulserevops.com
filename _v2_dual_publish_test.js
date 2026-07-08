// One-shot test: publish a stuck dual-consensus entry. Usage: node _v2_dual_publish_test.js [id]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { publishDualSigned } = require('./_v2_nr_dual_gate');

const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  const id = process.argv[2] || 'ai0028';
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const title = (idx.entries || []).find(e => e.id === id)?.question || id;
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const byPillar = {};
  const pillarOf = i => (String(i).match(/^[a-z]+/) || [''])[0];
  for (const e of idx.entries || []) if (e && e.id) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question });
  const before = JSON.parse(fs.readFileSync(WD + '/_v2_cc_approved.json', 'utf8')).length;
  const ok = await publishDualSigned(id, title, valid, byPillar, dsChat, idx);
  const after = JSON.parse(fs.readFileSync(WD + '/_v2_cc_approved.json', 'utf8')).length;
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  console.log(JSON.stringify({
    id, ok, ccBefore: before, ccAfter: after,
    inCc: JSON.parse(fs.readFileSync(WD + '/_v2_cc_approved.json', 'utf8')).includes(id),
    final_signed: !!e?.final_signed,
    was_indexed_at: e?.was_indexed_at || null,
    dual_audit: !!e?.dual_audit,
  }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
