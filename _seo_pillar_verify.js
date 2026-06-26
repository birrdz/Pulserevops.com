// Spot-check SEO + sitemap per pillar. Usage: node _seo_pillar_verify.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE = 'https://pulserevops.com';
const PILLARS = {
  ai: { hub: '/ai-infrastructure', prefix: 'ai' },
  aq: { hub: '/aquariums', prefix: 'aq' },
  bt: { hub: '/boats', prefix: 'bt' },
  bs: { hub: '/sales-book-summaries', prefix: 'bs' },
  bo: { hub: '/buildouts', prefix: 'bo' },
  cg: { hub: '/coaching', prefix: 'cg' },
  co: { hub: '/collectibles', prefix: 'co' },
  dn: { hub: '/dining', prefix: 'dn' },
  er: { hub: '/electronic-reviews', prefix: 'er' },
  st: { hub: '/sales-trainings', prefix: 'st', sitemap: 'sales-trainings' },
  rs: { hub: '/resorts', prefix: 'rs' },
  ca: { hub: '/cars', prefix: 'ca' },
  hf: { hub: '/highschool-football-recruiting', prefix: 'hf' },
  cl: { hub: '/clubs', prefix: 'cl' },
  gm: { hub: '/gaming', prefix: 'gm' },
  ga: { hub: '/gatherings', prefix: 'ga' },
  ev: { hub: '/events', prefix: 'ev' },
  es: { hub: '/estates', prefix: 'es' },
  gp: { hub: '/go-to-market-playbooks', prefix: 'gp' },
  ra: { hub: '/revenue-architecture', prefix: 'ra' },
  fr: { hub: '/franchises', prefix: 'fr' },
};

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-seo-pillar-verify/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function checkEntry(html, url) {
  const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const checks = {
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${esc}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
    metaKw: /<meta\s+name="keywords"/i.test(html),
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

function checkHub(html) {
  return {
    ok: /<meta\s+name="keywords"/i.test(html) && /CollectionPage/i.test(html) && /application\/ld\+json/i.test(html),
    metaKw: /<meta\s+name="keywords"/i.test(html),
    collectionLd: /CollectionPage/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
  };
}

async function main() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: m[1].trim(),
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = idx.entries || [];

  const results = [];
  for (const [key, cfg] of Object.entries(PILLARS)) {
    const pillarRows = rows.filter((r) => r && new RegExp(`^${cfg.prefix}\\d+$`, 'i').test(r.id));
    const seoStamped = pillarRows.filter((r) => r.seo_optimized_at).length;
    const sample = pillarRows[0];
    let samplePass = 'n/a';
    let sampleUrl = '';
    if (sample) {
      sampleUrl = `${SITE}${cfg.hub}/${sample.id}`;
      const page = await get(sampleUrl);
      const seo = checkEntry(page.body || '', sampleUrl);
      samplePass = page.status === 200 && seo.ok ? 'pass' : `fail:${page.status}:${seo.missing.join('+')}`;
    }
    const smKey = cfg.sitemap || (key === 'hf' ? 'highschool-football-recruiting' : key === 'ai' ? 'ai-infrastructure' : key === 'bs' ? 'book-summaries' : key === 'gp' ? 'go-to-market-playbooks' : key === 'ra' ? 'revenue-architecture' : key === 'st' ? 'sales-trainings' : key);
    const sm = await get(`${SITE}/sitemap-${smKey}.xml`);
    const hubUrl = `${SITE}${cfg.hub}`;
    const hubPage = await get(hubUrl);
    const hub = checkHub(hubPage.body || '');
    const inSm = sample ? (sm.body || '').includes(sample.id) : pillarRows.length === 0;
    results.push({
      pillar: key,
      entries: pillarRows.length,
      seoStamped,
      hubSync: hub.ok ? 'yes' : `partial:${[!hub.metaKw && 'kw', !hub.collectionLd && 'CollectionPage', !hub.jsonLd && 'jsonLd'].filter(Boolean).join('+')}`,
      sitemap: sm.status === 200 && inSm ? 'yes' : sm.status === 200 ? 'hub-only' : `http-${sm.status}`,
      sampleUrl,
      samplePass,
    });
    console.log(`${key}\tentries=${pillarRows.length}\tseo=${seoStamped}\thub=${hub.ok}\tsm=${sm.status}\tsample=${samplePass}`);
  }
  fs.writeFileSync(path.join(__dirname, '_seo_pillar_verify_report.json'), JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
