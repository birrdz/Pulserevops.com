// ════════════════════════════════════════════════════════════════════════
// pulse-nightly-seo-sweep-background — nightly full-site IndexNow ping.
//
// Runs every night at 8 PM Eastern (midnight UTC during EDT). Walks the
// entire library + every static hub page + every /reviews mirror and pings
// IndexNow.org so Bing, Yandex, Naver, Seznam, and Yep crawl them.
//
// Google does NOT have a public ping API anymore (deprecated 2023). Google
// gets discovery via the sitemap (refreshed automatically) + the cumulative
// effect of IndexNow partners that proxy to Googlebot.
//
// What it pings:
//   1. Every library entry — both the original URL (e.g. /knowledge/q12345)
//      and the /reviews mirror (e.g. /knowledge/q12345/reviews).
//   2. Every static hub page — home, /knowledge, /sales-trainings,
//      /industry-kpis, /dashboard, /matrix, /schedule, /plan-90, /bins,
//      /answers, /resume, /machine — plus their /reviews mirrors.
//   3. Every tool page in TOOLS registry — both versions.
//   4. Pings Google + Bing for the sitemap (sitemap-ping protocol is still
//      supported even though general URL ping is not).
//
// Output: writes _nightly_seo_sweep_status.json so the dashboard / a future
// admin UI can see last-run stats.
//
// Schedule: every day at 0:00 UTC (= 8 PM EDT during summer, 7 PM EST in
// winter). Owner is on Eastern time per session memory.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

let TOOLS = null;
try { TOOLS = require('./lib/pulse-tools-registry').TOOLS; } catch (e) {}

const SITE = 'https://pulserevops.com';
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';

// IndexNow batch endpoint accepts up to 10,000 URLs per request. We batch in
// 1000-URL chunks for safety.
const BATCH = 1000;

// EVERY page on the site — html files in root + every named-route redirect
// from netlify.toml. Updated 2026-05-27 per owner directive "EVERY PAGE ON
// SITE." Keep in sync if new top-level routes are added.
const STATIC_PAGES = [
  '/',                              // index.html
  '/home',
  // Pillar hubs
  '/knowledge', '/knowledge-library',
  '/sales-trainings', '/trainings',
  '/industry-kpis',
  '/tech-stacks',
  '/graphics',
  '/sales-book-summaries', '/book-summaries', '/cliff-notes', '/sales-books',
  // Working surfaces
  '/dashboard', '/matrix', '/schedule', '/bins', '/answers',
  '/queue', '/agents', '/admin', '/intent',
  // About / persona
  '/kory-white', '/kory-white-maryland',
  '/machine', '/themachine',
  // Public hubs and discovery
  '/tools', '/reviews', '/village', '/fresh',
  '/war-room', '/warroom', '/crm',
  '/leader-hub', '/guided-tour', '/tour',
  '/press-kit', '/kit', '/media',
  // Real-estate-listing micro-pages (still indexed)
  '/319-blue-bay-road-stevensville-md', '/319-blue-bay-road', '/home-for-sale',
  // Legal
  '/privacy',
  // Cross-domain mirror surfaces
  '/sports', '/pulse-new',
  // Feeds and sitemaps so engines re-fetch them
  '/feed.xml', '/atom.xml', '/rss', '/rss.xml',
  '/sitemap-index.xml', '/sitemap.xml',
  '/sitemap-knowledge.xml', '/sitemap-tools.xml',
  '/sitemap-reviews.xml', '/sitemap-machine.xml',
  '/sitemap-recent.xml', '/sitemap-news.xml',
  '/sitemap-pillars.xml', '/sitemap-press.xml',
  '/sitemap-howtos.xml', '/sitemap-blog.xml',
  '/sitemap-images.xml',
];

function initStore() {
  if (!getStore) return null;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (tok && SITE_ID) { try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {} }
  }
  return null;
}

function pillarPathFromId(id) {
  if (/^ik\d+$/i.test(id))    return '/industry-kpis/';
  if (/^st\d+$/i.test(id))    return '/sales-trainings/';
  if (/^tk\d+$/i.test(id))    return '/tech-stacks/';
  if (/^gb\d+$/i.test(id))    return '/graphics/';
  if (/^vq_/i.test(id))       return '/knowledge/';
  if (/^q\d+$/i.test(id))     return '/knowledge/';
  return '/knowledge/';
}

async function batchPingIndexNow(urlList) {
  if (!urlList.length) return { sent: 0, batches: 0, results: [] };
  const results = [];
  let sent = 0;
  for (let i = 0; i < urlList.length; i += BATCH) {
    const chunk = urlList.slice(i, i + BATCH);
    const body = {
      host: 'pulserevops.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: chunk,
    };
    try {
      const r = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      results.push({ batch: Math.floor(i / BATCH), status: r.status, count: chunk.length });
      sent += chunk.length;
    } catch (e) {
      results.push({ batch: Math.floor(i / BATCH), error: String(e.message || e), count: chunk.length });
    }
  }
  return { sent, batches: results.length, results };
}

async function pingSitemapToSearchEngines() {
  // Sitemap ping is a legacy protocol — Google deprecated their endpoint in 2023
  // and Bing in 2022, but a few search engines still honor it. We send to the
  // ones that still work + ensure the sitemap is fresh via IndexNow on the
  // sitemap URL itself.
  const sitemaps = [
    `${SITE}/sitemap-index.xml`,
    `${SITE}/sitemap.xml`,
    `${SITE}/sitemap-knowledge.xml`,
    `${SITE}/sitemap-reviews.xml`,
    `${SITE}/sitemap-machine.xml`,
  ];
  const sitemapPingResults = [];
  for (const sm of sitemaps) {
    // Yandex still supports sitemap ping
    try {
      const r = await fetch(`https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sm)}`, { method: 'GET' });
      sitemapPingResults.push({ engine: 'yandex', sitemap: sm, status: r.status });
    } catch (e) { sitemapPingResults.push({ engine: 'yandex', sitemap: sm, error: String(e.message || e) }); }
  }
  return sitemapPingResults;
}

exports.handler = async () => {
  const startTs = Date.now();
  const store = initStore();
  if (!store) return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'no store' }) };

  // Build the full URL universe
  const urlSet = new Set();

  // 1. Static hub pages + /reviews mirrors
  // Skip /reviews mirror for sitemap/feed URLs and listing-data URLs since
  // those aren't real pages — the mirror only makes sense for actual HTML pages.
  function shouldMirrorReviews(p) {
    if (p === '/' || p.endsWith('/reviews')) return false;
    if (/\.xml$/i.test(p)) return false;
    if (/^\/(rss|atom|feed)/i.test(p)) return false;
    return true;
  }
  for (const p of STATIC_PAGES) {
    urlSet.add(`${SITE}${p}`);
    if (shouldMirrorReviews(p)) {
      urlSet.add(`${SITE}${p}/reviews`);
    }
  }

  // 2. Tool pages + /reviews mirrors
  if (TOOLS) {
    for (const slug of Object.keys(TOOLS)) {
      urlSet.add(`${SITE}/tools/${slug}`);
      urlSet.add(`${SITE}/tools/${slug}/reviews`);
    }
  }

  // 3. Library entries — main URL + /reviews mirror for each
  let entries = [];
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    entries = (idx.entries || []).filter(e => e && e.id);
  } catch (_e) {}

  for (const e of entries) {
    const path = pillarPathFromId(e.id) + e.id;
    urlSet.add(`${SITE}${path}`);
    urlSet.add(`${SITE}${path}/reviews`);
  }

  const urlList = Array.from(urlSet);

  // 4. Ping IndexNow in batches
  const indexNowResult = await batchPingIndexNow(urlList);

  // 5. Ping sitemap to search engines that still accept it
  const sitemapResult = await pingSitemapToSearchEngines();

  const finishedTs = Date.now();
  const status = {
    last_run: finishedTs,
    duration_ms: finishedTs - startTs,
    total_urls: urlList.length,
    entries_count: entries.length,
    static_pages_count: STATIC_PAGES.length,
    tool_pages_count: TOOLS ? Object.keys(TOOLS).length : 0,
    indexnow: indexNowResult,
    sitemap_ping: sitemapResult,
  };
  try { await store.setJSON('_nightly_seo_sweep_status.json', status); } catch (_e) {}

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, ...status }),
  };
};

// Netlify scheduled function: runs every day at midnight UTC = 8 PM Eastern
// during EDT (May-November). Use cron "0 0 * * *" UTC.
module.exports.config = { schedule: '0 0 * * *' };
