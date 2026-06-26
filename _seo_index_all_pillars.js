// Batch IndexNow + was_indexed_at stamp for all SEO-optimized pillar entries + hub URLs.
// Usage: node _seo_index_all_pillars.js [--dry-run] [--stamp-only]
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
const { pingIndexNowUrlList, stampIndexed } = require('./netlify/functions/lib/indexnow-ping-entry');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DRY = process.argv.includes('--dry-run');
const STAMP_ONLY = process.argv.includes('--stamp-only');
const CHUNK = 400;

const PILLAR_HUBS = {
  ai: 'https://pulserevops.com/ai-infrastructure',
  aq: 'https://pulserevops.com/aquariums',
  bt: 'https://pulserevops.com/boats',
  bs: 'https://pulserevops.com/sales-book-summaries',
  bo: 'https://pulserevops.com/buildouts',
  cg: 'https://pulserevops.com/coaching',
  co: 'https://pulserevops.com/collectibles',
  dn: 'https://pulserevops.com/dining',
  ca: 'https://pulserevops.com/cars',
  hf: 'https://pulserevops.com/highschool-football-recruiting',
  cl: 'https://pulserevops.com/clubs',
  gm: 'https://pulserevops.com/gaming',
  ga: 'https://pulserevops.com/gatherings',
  ev: 'https://pulserevops.com/events',
  es: 'https://pulserevops.com/estates',
  gp: 'https://pulserevops.com/go-to-market-playbooks',
  ra: 'https://pulserevops.com/revenue-architecture',
  fr: 'https://pulserevops.com/franchises',
};

const SEO_PILLAR_PREFIXES = Object.keys(PILLAR_HUBS);

function loadPat() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local missing');
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
  if (!tok) throw new Error('BLOBS_PAT missing');
  return tok;
}

function pillarKey(id) {
  const m = String(id || '').match(/^([a-z]{1,3})\d+$/i);
  return m ? m[1].toLowerCase() : null;
}

async function main() {
  const tok = loadPat();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = idx.entries || [];

  const byPillar = {};
  for (const p of SEO_PILLAR_PREFIXES) byPillar[p] = { total: 0, seoStamped: 0, urls: [] };

  const entryUrls = [];
  for (const row of entries) {
    if (!row || !row.id) continue;
    const pk = pillarKey(row.id);
    if (!pk || !byPillar[pk]) continue;
    byPillar[pk].total++;
    if (row.seo_optimized_at) byPillar[pk].seoStamped++;
    const url = libraryEntryPublicUrl(row);
    if (url) {
      byPillar[pk].urls.push(url);
      entryUrls.push(url);
    }
  }

  const hubUrls = [...new Set(Object.values(PILLAR_HUBS))];
  const allUrls = [...new Set([...entryUrls, ...hubUrls])];
  console.log(`Pillar entries: ${entryUrls.length} URLs + ${hubUrls.length} hubs = ${allUrls.length} total`);

  let indexPing = { ok: true, chunks: 0, skipped: STAMP_ONLY };
  if (!DRY && allUrls.length && !STAMP_ONLY) {
    for (let i = 0; i < allUrls.length; i += CHUNK) {
      const chunk = allUrls.slice(i, i + CHUNK);
      const ping = await pingIndexNowUrlList(chunk);
      indexPing.chunks++;
      console.log(`IndexNow chunk ${indexPing.chunks}: ok=${ping.ok} urls=${chunk.length}`);
      if (!ping.ok) indexPing.ok = false;
    }
  } else if (STAMP_ONLY) {
    console.log('IndexNow skipped (--stamp-only)');
  }

  let stamped = 0;
  if (!DRY) {
    const now = Date.now();
    idx.entries = entries.map((row) => {
      const pk = pillarKey(row.id);
      if (!pk || !byPillar[pk]) return row;
      if (!row.seo_optimized_at && !row.was_indexed_at) return row;
      stamped++;
      return { ...row, was_indexed_at: row.was_indexed_at || now };
    });
    await store.setJSON('_index.json', idx);
    console.log(`Stamped was_indexed_at on ${stamped} pillar index rows (batch)`);
  }

  const report = { dryRun: DRY, stampOnly: STAMP_ONLY, pillars: byPillar, indexPing, stamped, hubUrls, urlCount: allUrls.length };
  const out = path.join(__dirname, '_seo_index_all_pillars_report.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log('Wrote', out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
