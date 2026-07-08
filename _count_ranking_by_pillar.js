// Count ranking-list entries for one pillar
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const pillar = process.argv[2] || 'sw';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { titleSuggestsRankingList } = require('./_ranking_list_master_law');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && String(e.id).startsWith(pillar) && titleSuggestsRankingList(e.question || ''));
  rows.sort((a, b) => a.id.localeCompare(b.id));
  console.log('count', rows.length);
  console.log('first', rows[0] && rows[0].id, rows[0] && rows[0].question);
  console.log('last', rows[rows.length - 1] && rows[rows.length - 1].id);
})().catch(e => { console.error(e); process.exit(1); });
