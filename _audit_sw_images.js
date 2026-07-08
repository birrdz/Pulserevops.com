// Audit software ranking list image state in blobs
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { titleSuggestsRankingList, isRankingListBody, rankingListHasTopHero } = require('./_ranking_list_master_law');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let n = 0, noProd = 0, hero = 0, weak = 0, compliant = 0;
  const bad = [];
  for (const row of (idx.entries || []).filter(e => e && /^sw\d/i.test(e.id) && titleSuggestsRankingList(e.question || ''))) {
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const body = e && e.answer ? e.answer : '';
    if (!body) continue;
    n++;
    const audit = auditImages(row.id, body);
    const prodImgs = (body.match(/^@@PRODUCT[^\n]* img="/gm) || []).length;
    const prodLines = (body.match(/^@@PRODUCT\b/gm) || []).length;
    const missingImg = prodLines - prodImgs;
    if (rankingListHasTopHero(body)) hero++;
    if (missingImg > 0 || audit.needs.includes('product_imgs')) noProd++;
    if (audit.compliant) compliant++;
    else if (bad.length < 8) bad.push({ id: row.id, needs: audit.needs, prodImgs, prodLines, cover: row.cover_src });
  }
  console.log({ total: n, compliant, hero, missingProductImgs: noProd, sampleBad: bad });
})().catch(e => { console.error(e); process.exit(1); });
