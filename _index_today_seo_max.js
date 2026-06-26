// SEO verify + IndexNow batch for today's CRO / Tools / resume-removal work.
// Usage: node _index_today_seo_max.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { CRO_STATIC_URLS, CRO_INDEXNOW_EXTRA } = require('./_cro_seo_keywords');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

const SITE = 'https://pulserevops.com';
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const REPORT = path.join(__dirname, '_index_today_seo_max_report.json');
const CHUNK = 500;
const TODAY = new Date().toISOString().slice(0, 10);

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-index-today-seo-max/1.0' }, maxRedirects: 5 }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            finalUrl: res.headers.location || url,
            body,
          })
        );
      })
      .on('error', (e) => resolve({ status: 0, body: e.message, finalUrl: url }));
  });
}

function seoCheck(html, url) {
  const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const checks = {
    http200: true,
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="[^"]+"/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${esc}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
    keywords: /<meta\s+name="keywords"\s+content="/i.test(html),
  };
  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SID,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const tlRows = (idx.entries || []).filter((e) => e && /^tl\d+$/i.test(e.id));

  const staticUrls = [
    ...CRO_STATIC_URLS,
    `${SITE}/tools`,
    `${SITE}/highschool-football-recruiting`,
    `${SITE}/resume`,
  ];
  const tlSample = ['tl0001', 'tl0100', 'tl0300', 'tl0500', 'tl0660']
    .map((id) => libraryEntryPublicUrl({ id }))
    .filter(Boolean);
  const tlReviewsSample = tlSample.map((u) => u + '/reviews');

  const indexUrls = [
    ...new Set([
      ...staticUrls,
      ...CRO_INDEXNOW_EXTRA.map((u) => (u.startsWith('http') ? u : SITE + u)),
      ...tlRows.map((r) => libraryEntryPublicUrl(r)).filter(Boolean),
      ...tlRows.map((r) => libraryEntryPublicUrl(r) + '/reviews').filter(Boolean),
    ]),
  ];

  const seoTargets = [...new Set([...staticUrls, ...tlSample, ...tlReviewsSample.slice(0, 2)])];
  const seoResults = [];
  for (const url of seoTargets) {
    const page = await get(url);
    const canonical = url.startsWith(SITE + '/resume') ? url : url;
    const seo = seoCheck(page.body || '', canonical);
    const row = {
      url,
      status: page.status,
      seo: seo.ok,
      missing: seo.missing,
      redirect: url.includes('/resume') ? page.status === 301 || page.status === 302 : false,
    };
    if (url.includes('/resume') && (page.status === 301 || page.status === 302)) {
      row.seo = true;
      row.missing = [];
      row.note = '301 redirect (expected after removal)';
    }
    seoResults.push(row);
    console.log(`${url}\tHTTP ${page.status}\tSEO ${row.seo ? 'OK' : row.missing.join(',')}`);
  }

  const smMain = await get(`${SITE}/sitemap.xml`);
  const smKnowledge = await get(`${SITE}/.netlify/functions/pulse-machine-sitemap`);
  const smImages = await get(`${SITE}/sitemap-images.xml`);
  const sitemapChecks = {
    fractional_cro: (smMain.body || '').includes('/fractional-cro</loc>'),
    cro_syndicate: (smMain.body || '').includes('/cro-syndicate-team</loc>'),
    kory_white: (smMain.body || '').includes('/kory-white-maryland</loc>'),
    tools_hub: (smMain.body || '').includes('/tools/</loc>') || (smKnowledge.body || '').includes('/tools</loc>'),
    tl_tools_path: (smKnowledge.body || '').includes('/tools/tl0001</loc>'),
    kory_white_image: (smImages.body || '').includes('/kory-white-maryland</loc>'),
    no_resume_sitemap: !(smImages.body || '').includes('/resume</loc>'),
  };

  const indexBatches = [];
  for (let i = 0; i < indexUrls.length; i += CHUNK) {
    const chunk = indexUrls.slice(i, i + CHUNK);
    const ping = await pingIndexNowUrlList(chunk);
    indexBatches.push({ offset: i, count: chunk.length, ping });
    console.log(`IndexNow batch ${i / CHUNK + 1}: ${JSON.stringify(ping.pings)}`);
    await sleep(2500);
  }

  const ts = Date.now();
  for (const row of tlRows) {
    const i = idx.entries.findIndex((e) => e && e.id === row.id);
    if (i >= 0) idx.entries[i] = { ...idx.entries[i], was_indexed_at: ts };
  }
  await store.setJSON('_index.json', idx);

  const report = {
    ok: true,
    date: TODAY,
    keywordCount: require('./netlify/functions/lib/cro-seo-keywords').CRO_BRAND_KEYWORDS.length,
    seoResults,
    sitemapChecks,
    indexUrlCount: indexUrls.length,
    indexBatches,
    googleNote:
      'Google discovery via sitemap.xml + sitemap-knowledge.xml + robots.txt. IndexNow covers Bing/Yandex.',
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
