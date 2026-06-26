// Index all of today's knowledge Q&As: SEO check, IndexNow (all engines), Google sitemap verify.
// Usage: node _index_today_all_engines.js [YYYY-MM-DD]
const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'pulserevops.com';
const SITE = `https://${HOST}`;
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;
const SHARED_KEY = 'pulsemachine-writer-2026';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const CHUNK = 400;
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://search.seznam.cz/indexnow',
];

function loadEnvLocal() {
  const p = path.join(__dirname, '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-index-today/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + (u.search || ''),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'pulse-index-today/1.0',
        },
        timeout: 30000,
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 300) }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: 'timeout' });
    });
    req.write(data);
    req.end();
  });
}

function postTarget(id) {
  const payload = JSON.stringify({ key: SHARED_KEY, id });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: HOST,
        path: '/.netlify/functions/pulse-indexnow-target',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.write(payload);
    req.end();
  });
}

function checkSeo(html, id) {
  const url = `${SITE}/knowledge/${id}`;
  const checks = {
    title: /<title[^>]*>/i.test(html),
    metaDesc: /<meta\s+name="description"/i.test(html),
    canonical: html.includes(`rel="canonical" href="${url}"`),
    og: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
  };
  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

async function fetchTodayIds(day) {
  const utcStart = Date.parse(`${day}T00:00:00.000Z`);
  const utcEnd = utcStart + 86400000;
  const raw = await get(`${SITE}/.netlify/functions/pulse-machine-library-list?recent=5000`);
  const j = JSON.parse(raw.body);
  const ids = (j.entries || [])
    .filter((e) => e.ts >= utcStart && e.ts < utcEnd)
    .map((e) => e.id)
    .filter((id) => /^q\d+$/i.test(id));
  return ids.sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
}

async function stampIndexed(ids) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!tok) {
    console.log('No BLOBS_PAT — skipping was_indexed_at stamp (IndexNow still sent)');
    return { stamped: 0 };
  }
  const { getStore } = require('@netlify/blobs');
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const set = new Set(ids);
  const ts = Date.now();
  let stamped = 0;
  idx.entries = (idx.entries || []).map((e) => {
    if (e && set.has(e.id) && !e.was_indexed_at) {
      stamped++;
      return { ...e, was_indexed_at: ts };
    }
    return e;
  });
  await store.setJSON('_index.json', idx);
  return { stamped, ts };
}

async function googleIndexingApi(urls) {
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const credJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credPath && !credJson) return { ok: false, reason: 'no_google_credentials' };

  let cred;
  try {
    cred = credJson ? JSON.parse(credJson) : JSON.parse(fs.readFileSync(credPath, 'utf8'));
  } catch (e) {
    return { ok: false, reason: 'bad_credentials: ' + e.message };
  }

  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth({
    credentials: cred,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) return { ok: false, reason: 'no_access_token' };

  let ok = 0;
  let fail = 0;
  for (const url of urls) {
    const body = JSON.stringify({ url, type: 'URL_UPDATED' });
    const r = await new Promise((resolve) => {
      const req = https.request(
        {
          hostname: 'indexing.googleapis.com',
          path: '/v3/urlNotifications:publish',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let b = '';
          res.on('data', (c) => (b += c));
          res.on('end', () => resolve({ status: res.statusCode, body: b }));
        }
      );
      req.on('error', () => resolve({ status: 0 }));
      req.write(body);
      req.end();
    });
    if (r.status >= 200 && r.status < 300) ok++;
    else fail++;
    await new Promise((r) => setTimeout(r, 200));
  }
  return { ok: true, submitted: ok, failed: fail };
}

async function main() {
  loadEnvLocal();
  const day = process.argv[2] || new Date().toISOString().slice(0, 10);
  console.log('Date (UTC):', day);

  let ids = [];
  const cache = path.join(__dirname, '_today_ids.json');
  if (fs.existsSync(cache)) {
    try {
      ids = JSON.parse(fs.readFileSync(cache, 'utf8'));
    } catch (_) {}
  }
  const fresh = await fetchTodayIds(day);
  if (fresh.length >= ids.length) ids = fresh;
  fs.writeFileSync(cache, JSON.stringify(ids, null, 0));
  console.log('Entries:', ids.length, ids[0], '…', ids[ids.length - 1]);
  if (!ids.length) {
    console.log('Nothing to index for', day);
    return;
  }

  const urls = ids.map((id) => `${SITE}/knowledge/${id}`);

  // ── SEO sample (every 50th + first/last) ──
  const seoSample = [ids[0], ids[ids.length - 1], ...ids.filter((_, i) => i % 50 === 0)];
  const seoUnique = [...new Set(seoSample)];
  let seoFail = 0;
  for (const id of seoUnique) {
    const page = await get(`${SITE}/knowledge/${id}`);
    const seo = checkSeo(page.body || '', id);
    if (!seo.ok || page.status !== 200) {
      seoFail++;
      console.log('SEO FAIL', id, page.status, seo.missing?.join(','));
    }
  }
  console.log(`SEO spot-check: ${seoUnique.length - seoFail}/${seoUnique.length} OK`);

  // ── Sitemap (Google discovery) ──
  const sm = await get(`${SITE}/.netlify/functions/pulse-machine-sitemap`);
  let inSm = 0;
  for (const id of ids) {
    if (sm.body.includes(`/knowledge/${id}</loc>`)) inSm++;
  }
  console.log(`Google sitemap: ${inSm}/${ids.length} URLs in sitemap-knowledge.xml`);
  const sitemapUrls = [
    `${SITE}/sitemap-index.xml`,
    `${SITE}/sitemap-knowledge.xml`,
    `${SITE}/sitemap-recent.xml`,
  ];
  for (const smUrl of sitemapUrls) {
    const ping = await get(smUrl);
    console.log('Sitemap fetch (warm crawl):', smUrl, ping.status);
  }

  // ── IndexNow — all engines, chunked ──
  const indexResults = [];
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);
    const payload = { host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: chunk };
    const batch = { chunk: `${i + 1}-${i + chunk.length}`, engines: {} };
    for (const ep of INDEXNOW_ENDPOINTS) {
      const r = await postJSON(ep, payload);
      batch.engines[new URL(ep).hostname] = r.status;
      await new Promise((x) => setTimeout(x, 500));
    }
    indexResults.push(batch);
    console.log('IndexNow chunk', batch.chunk, JSON.stringify(batch.engines));
  }

  // ── Stamp was_indexed_at in blob index ──
  const stamp = await stampIndexed(ids);
  console.log('Stamped was_indexed_at:', stamp.stamped, 'entries');

  // ── Google Indexing API (optional credentials) ──
  const google = await googleIndexingApi(urls);
  if (google.ok) {
    console.log('Google Indexing API:', google.submitted, 'ok,', google.failed, 'failed');
  } else {
    console.log(
      'Google: sitemap discovery (no Indexing API creds on this machine).',
      'Submit sitemap in Search Console:',
      `${SITE}/sitemap-knowledge.xml`
    );
  }

  const log = {
    day,
    count: ids.length,
    range: [ids[0], ids[ids.length - 1]],
    seoSpotFail: seoFail,
    sitemapListed: inSm,
    indexnow: indexResults,
    stamped: stamp.stamped,
    google,
    ts: Date.now(),
  };
  const logPath = path.join(__dirname, `_index_today_${day}_log.json`);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log('Wrote', logPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
