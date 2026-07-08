// Strip top hero from ranking-list blobs (no product re-fetch). Usage: node _strip_ranking_hero.js [--id=aq1158] [--dry]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const {
  isRankingListBody,
  titleSuggestsRankingList,
  stripRankingHeroMarkdown,
  rankingListHasTopHero,
} = require('./_ranking_list_master_law');
const { FORMAT_V } = require('./_ranking_list_rebuild_lib');
const args = process.argv.slice(2);
const ONE = (args.find(a => a.startsWith('--id=')) || '').split('=')[1] || '';
const DRY = args.includes('--dry');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && e.id && (ONE ? e.id === ONE : /^aq\d+$/i.test(e.id)));
  let changed = 0;
  for (const row of rows) {
    const title = row.question || '';
    if (!ONE && !titleSuggestsRankingList(title)) continue;
    const entry = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!entry || !entry.answer) continue;
    if (!isRankingListBody(entry.answer, title) && !titleSuggestsRankingList(title)) continue;
    const hadHero = rankingListHasTopHero(entry.answer) || !!row.img;
    if (!hadHero && entry.format_v === FORMAT_V && entry.cover_src === 'no-hero') continue;

    const body = stripRankingHeroMarkdown(entry.answer);
    const firstProd = (body.match(/@@PRODUCT[^\n]* img="([^"]+)"/) || [])[1] || '';
    console.log((DRY ? '[dry] ' : '') + row.id + ' strip hero' + (hadHero ? '' : ' (format only)'));

    if (DRY) { changed++; continue; }

    entry.answer = body;
    entry.format_v = FORMAT_V;
    entry.cover_src = 'no-hero';
    entry.polished_at = Date.now();
    await store.setJSON('answers/' + row.id + '.json', entry);

    const i = (idx.entries || []).findIndex(e => e && e.id === row.id);
    if (i >= 0) {
      idx.entries[i] = Object.assign({}, idx.entries[i], {
        format_v: FORMAT_V,
        cover_src: 'no-hero',
        img: firstProd || '',
        polished_at: entry.polished_at,
      });
    }
    changed++;
  }
  if (!DRY && changed) await store.setJSON('_index.json', idx);
  console.log('Done:', changed, DRY ? '(dry run)' : 'written');
})().catch(e => { console.error(e); process.exit(1); });
