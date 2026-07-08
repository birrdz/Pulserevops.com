const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const pillar = process.argv[2] || 'ce';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { titleSuggestsRankingList } = require('./_ranking_list_master_law');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && String(e.id).match(new RegExp('^' + pillar + '\\d', 'i')));
  const rank = rows.filter(e => titleSuggestsRankingList(e.question || ''));
  const bipolar = rows.filter(e => /bipolar/i.test(e.question || ''));
  console.log(JSON.stringify({ pillar, total: rows.length, ranking: rank.length, bipolar: bipolar.length, sample: rows[0], rankSample: rank[0] }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
