// Maximize CRO / CRO Syndicate / fractional CRO SEO across library + static pages.
// Usage:
//   node _cro_seo_maximize.js              # tag + IndexNow all matches
//   node _cro_seo_maximize.js --dry-run
//   node _cro_seo_maximize.js --limit 100  # cap library rows per run
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const {
  matchCroTier,
  tagsForEntry,
  displayKeywordsForTier,
  CRO_STATIC_URLS,
  CRO_INDEXNOW_EXTRA,
} = require('./_cro_seo_keywords');
const {
  pingIndexNowEntry,
  pingIndexNowUrlList,
} = require('./netlify/functions/lib/indexnow-ping-entry');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

const STATIC_CRO_URLS = [...CRO_STATIC_URLS, ...CRO_INDEXNOW_EXTRA];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  const stats = { cro: 0, revops: 0, skipped: 0, updated: 0, indexnow_ok: 0 };
  let processed = 0;

  for (const row of idx.entries || []) {
    if (!row || !/^(q|tl|ra|gp)\d+$/i.test(row.id)) continue;
    const tier = matchCroTier(row.question, row.tags);
    if (!tier) {
      stats.skipped++;
      continue;
    }
    if (processed >= LIMIT) break;

    const entry = await store.get(`answers/${row.id}.json`, { type: 'json' });
    if (!entry) continue;

    const newTags = tagsForEntry(row.question, entry.tags || row.tags, tier);
    const display = displayKeywordsForTier(tier);
    const mergedBrand = [
      ...(Array.isArray(entry.seo_brand_keywords) ? entry.seo_brand_keywords : []),
      ...display,
    ].filter((v, i, a) => a.indexOf(v) === i);
    const changed =
      JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) ||
      entry.seo_cro_tier !== tier ||
      JSON.stringify(mergedBrand) !== JSON.stringify(entry.seo_brand_keywords || []);

    if (!DRY && changed) {
      const now = Date.now();
      await store.setJSON(`answers/${row.id}.json`, {
        ...entry,
        tags: newTags,
        seo_cro_tier: tier,
        seo_brand_keywords: mergedBrand,
        seo_cro_optimized_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) {
        idx.entries[i] = {
          ...idx.entries[i],
          tags: newTags,
          seo_cro_tier: tier,
          seo_cro_optimized_at: now,
        };
      }
      stats.updated++;
    }

    stats[tier]++;
    processed++;

    if (!DRY) {
      const ping = await pingIndexNowEntry(row.id, store, { ...row, tags: newTags });
      if (ping.ok) stats.indexnow_ok++;
      if (processed % 25 === 0) console.log(`… ${processed} indexed (${stats.indexnow_ok} ok)`);
      await sleep(120);
    } else {
      console.log(`${row.id}\t${tier}\ttags=${newTags.length}`);
    }
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  let staticPing = null;
  if (!DRY) {
    staticPing = await pingIndexNowUrlList(STATIC_CRO_URLS);
  }

  const report = {
    ok: true,
    dryRun: DRY,
    stats,
    staticPing,
    staticUrls: STATIC_CRO_URLS,
  };
  fs.writeFileSync(path.join(__dirname, '_cro_seo_maximize_report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
