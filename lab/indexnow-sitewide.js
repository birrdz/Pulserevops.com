// One-shot site-wide IndexNow push. Pulls every URL from every sitemap on
// pulserevops.com, dedupes, and submits the full list to Bing, Yandex, Naver,
// Seznam, and the indexnow.org distribution endpoint in one batch each.
//
// Google does NOT participate in IndexNow — Google reads sitemap-index.xml
// directly. Submit that once in Google Search Console (handled separately).

const https = require('https');

const HOST = 'pulserevops.com';
const SITE = 'https://' + HOST;
const INDEXNOW_KEY_VAL = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY_VAL}.txt`;

// Every sitemap on the property. sitemap-index.xml lists most of these, but
// some are referenced from robots.txt only — list explicitly to be sure.
const SITEMAPS = [
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-knowledge.xml',
  '/sitemap-knowledge-verified.xml',
  '/sitemap-recent.xml',
  '/sitemap-machine.xml',
  '/sitemap-press.xml',
  '/sitemap-howtos.xml',
  '/sitemap-pillars.xml',
  '/sitemap-blog.xml',
  '/sitemap-images.xml',
  '/sitemap-news.xml',
];

const ENDPOINTS = [
  { name: 'indexnow.org', url: 'https://api.indexnow.org/indexnow' },
  { name: 'bing',         url: 'https://www.bing.com/indexnow' },
  { name: 'yandex',       url: 'https://yandex.com/indexnow' },
  { name: 'naver',        url: 'https://searchadvisor.naver.com/indexnow' },
  { name: 'seznam',       url: 'https://search.seznam.cz/indexnow' },
];

function get(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    https.get({ hostname: u.hostname, path: u.pathname + (u.search || ''), timeout: 15000 }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    }).on('error', (e) => resolve({ status: 0, body: 'err: ' + e.message })).on('timeout', function() { this.destroy(); resolve({ status: 0, body: 'timeout' }); });
  });
}

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'pulserevops-indexnow-sitewide/1.0',
      },
      timeout: 30000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 300) }));
    });
    req.on('error', (e) => resolve({ status: 0, body: 'err: ' + e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

function extractLocs(xml) {
  const out = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u.startsWith('http')) out.push(u);
  }
  return out;
}

(async () => {
  console.log('Pulling URLs from ' + SITEMAPS.length + ' sitemaps...');
  const allUrls = new Set();
  const childSitemaps = new Set();
  for (const path of SITEMAPS) {
    const r = await get(SITE + path);
    if (r.status !== 200) { console.log('  ' + path + ' · status ' + r.status + ' (skip)'); continue; }
    const locs = extractLocs(r.body);
    let pageCount = 0, sitemapCount = 0;
    for (const u of locs) {
      // sitemap-index.xml points to other sitemaps — recurse into those.
      if (/\.xml(\?|$)/.test(u)) {
        childSitemaps.add(u);
        sitemapCount++;
      } else {
        allUrls.add(u);
        pageCount++;
      }
    }
    console.log('  ' + path + ' · ' + pageCount + ' pages + ' + sitemapCount + ' nested sitemaps');
  }
  // Pull any child sitemaps referenced by sitemap-index.xml that we hadn't listed directly.
  for (const u of childSitemaps) {
    if (SITEMAPS.some(p => SITE + p === u)) continue;
    const r = await get(u);
    if (r.status !== 200) { console.log('  (child) ' + u + ' · status ' + r.status + ' (skip)'); continue; }
    const locs = extractLocs(r.body);
    let c = 0;
    for (const v of locs) if (!/\.xml(\?|$)/.test(v)) { allUrls.add(v); c++; }
    console.log('  (child) ' + u + ' · ' + c + ' pages');
  }
  const urls = Array.from(allUrls);
  console.log('\nDeduped total: ' + urls.length + ' unique URLs to submit\n');

  if (!urls.length) { console.log('Nothing to submit. Exiting.'); return; }

  // IndexNow accepts up to 10,000 URLs per request. Chunk if needed.
  const CHUNK = 10000;
  const chunks = [];
  for (let i = 0; i < urls.length; i += CHUNK) chunks.push(urls.slice(i, i + CHUNK));

  for (let c = 0; c < chunks.length; c++) {
    const urlList = chunks[c];
    console.log('Submitting chunk ' + (c + 1) + '/' + chunks.length + ' (' + urlList.length + ' URLs) to each endpoint:');
    const payload = { host: HOST, key: INDEXNOW_KEY_VAL, keyLocation: KEY_LOCATION, urlList };
    const results = await Promise.all(ENDPOINTS.map(ep => postJSON(ep.url, payload)));
    for (let i = 0; i < ENDPOINTS.length; i++) {
      const ep = ENDPOINTS[i];
      const r = results[i];
      const ok = r.status >= 200 && r.status < 300;
      console.log('  ' + (ok ? 'OK ' : 'FAIL') + '  ' + ep.name.padEnd(14) + ' status=' + r.status + (ok ? '' : ' body=' + r.body.slice(0, 150)));
    }
  }
  console.log('\nDone. Google is covered by the sitemap (no /ping needed since 2023).');
})();
