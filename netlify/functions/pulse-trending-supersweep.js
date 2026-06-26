// pulse-trending-supersweep — boosts crawl frequency for the top-12 trending
// library entries. Two modes:
//
//   GET (no params)         → returns a sitemap-trending.xml with the top 12
//                             trending URLs at priority=1.0, changefreq=hourly.
//                             Reachable at /sitemap-trending.xml via redirect.
//
//   GET ?ping=1             → also fires IndexNow batch ping to all 5 engines
//                             for those URLs + the sitemap itself. Used by
//                             the hourly cron (and can be hit manually).
//
// Goal: anything in the top 5/12 gets re-crawled hourly across Bing/Yandex/
// Naver/Seznam/Yep, and Google sees a focused sitemap with maxed-out priority.

const https = require('https');
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const SITE = 'https://pulserevops.com';
const ENGINES = [
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://search.seznam.cz/indexnow',
  'https://indexnow.yep.com/indexnow',
];

const ROUTE = {
  q:'/knowledge/', st:'/sales-trainings/', ik:'/industry-kpis/',
  tk:'/tech-stacks/', gb:'/graphics/', bs:'/sales-book-summaries/',
  er:'/electronic-reviews/', ra:'/revenue-architecture/', gp:'/go-to-market-playbooks/',
};
function routeOf(id) {
  if (!id) return '/knowledge/';
  if (/^vq_/i.test(id)) return '/knowledge/';
  const m = id.match(/^([a-z]+)/i);
  const p = m ? m[1].toLowerCase() : 'q';
  return ROUTE[p] || '/knowledge/';
}

function initLibStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}
function initViewStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-view-counts', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-view-counts'); } catch (e) { return null; }
}

function lastNDays(n) {
  const out = [];
  const today = new Date();
  today.setUTCHours(0,0,0,0);
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    out.push(d.toISOString().slice(0,10));
  }
  return out;
}

async function postJson(url, body) {
  return new Promise((resolve) => {
    const data = Buffer.from(JSON.stringify(body));
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
    }, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode }));
    });
    req.on('error', () => resolve({ ok: false }));
    req.write(data); req.end();
  });
}

async function getTrending12() {
  const viewStore = initViewStore();
  if (!viewStore) return [];
  let counts = {};
  try { counts = (await viewStore.get('counts.json', { type: 'json' })) || { entries: {} }; } catch (e) {}
  const days7 = lastNDays(7);
  const ranked = Object.keys(counts.entries || {})
    .map(id => {
      const e = counts.entries[id] || {};
      let sum = 0;
      for (const d of days7) sum += (e.days && typeof e.days[d] === 'number' ? e.days[d] : 0);
      return { id, sum };
    })
    .filter(r => r.sum > 0);
  ranked.sort((a, b) => b.sum - a.sum);
  return ranked.slice(0, 12);
}

function buildSitemap(trending) {
  const now = new Date().toISOString();
  const urls = trending.map(t => {
    const u = SITE + routeOf(t.id) + t.id;
    return `  <url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>1.0</priority></url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};

  const trending = await getTrending12();
  const sitemap = buildSitemap(trending);

  // Optional IndexNow burst
  let pings = null;
  if (qs.ping === '1') {
    const urlList = trending.map(t => SITE + routeOf(t.id) + t.id);
    urlList.push(SITE + '/sitemap-trending.xml', SITE + '/sitemap.xml', SITE + '/sitemap-index.xml');
    const body = {
      host: 'pulserevops.com',
      key: INDEXNOW_KEY,
      keyLocation: SITE + '/' + INDEXNOW_KEY + '.txt',
      urlList,
    };
    pings = {};
    await Promise.all(ENGINES.map(async (e) => {
      pings[e] = (await postJson(e, body)).status || 'err';
    }));
    // Stamp last-run blob for audit
    const libStore = initLibStore();
    if (libStore) {
      try { await libStore.setJSON('_trending_supersweep.json', { ts: Date.now(), trending, pings }); } catch (_e) {}
    }
  }

  // Return either XML (default) or JSON (?json=1)
  if (qs.json === '1') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
      body: JSON.stringify({ ok: true, trending, count: trending.length, pings, sitemap_url: SITE + '/sitemap-trending.xml' }),
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=600' },
    body: sitemap,
  };
};
