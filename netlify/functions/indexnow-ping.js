// ════════════════════════════════════════════════════════════════════════
// indexnow-ping — owner-only endpoint to push URLs to IndexNow protocol.
// Reaches Bing, Yandex, Seznam, Naver, Yep instantly. (Google doesn't
// participate in IndexNow — they read our sitemap on their crawl cycle.)
//
// Auth: ?key=pulsemachine
// POST { urls: ["https://pulserevops.com/...", ...] }
// → forwards to https://api.indexnow.org/indexnow with our IndexNow key.
//
// Reference: https://www.indexnow.org/documentation
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const ADMIN_KEY = 'pulsemachine';
const HOST = 'pulserevops.com';
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

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
        'User-Agent': 'pulserevops-indexnow/1.0',
      },
      timeout: 8000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 400) }));
    });
    req.on('error', (e) => resolve({ status: 0, body: 'err: ' + e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: 'forbidden' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };

  let urls = [];
  try {
    const body = JSON.parse(event.body || '{}');
    urls = Array.isArray(body.urls) ? body.urls : [];
  } catch (e) {}

  // Validate — only allow URLs on our host
  urls = urls
    .map(u => String(u || '').trim())
    .filter(u => u.startsWith(`https://${HOST}/`) || u === `https://${HOST}` || u.startsWith(`http://${HOST}`));

  if (!urls.length) return { statusCode: 400, body: JSON.stringify({ ok: false, err: 'no valid urls' }) };

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(0, 10000), // IndexNow allows up to 10k per call
  };

  // Hit Bing's endpoint (also covers Yandex, Seznam via IndexNow federation)
  const bingResp = await postJSON('https://api.indexnow.org/indexnow', payload);
  // Bing direct, in case the federated call has lag
  const bingDirect = await postJSON('https://www.bing.com/indexnow', payload);
  // Yandex direct
  const yandexResp = await postJSON('https://yandex.com/indexnow', payload);

  // Log this ping batch so the resume widget can show recent activity.
  try {
    if (getStore) {
      const store = getStore({ name: 'indexnow-status', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
      const log = (await store.get('latest.json', { type: 'json' })) || { recent: [], total_pinged: 0, day_counts: {} };
      const now = Date.now();
      const day = new Date(now).toISOString().slice(0, 10);
      log.day_counts = log.day_counts || {};
      log.day_counts[day] = (log.day_counts[day] || 0) + urls.length;
      log.total_pinged = (log.total_pinged || 0) + urls.length;
      log.last_ping_at = now;
      log.recent = (log.recent || []);
      urls.slice(0, 50).forEach(u => log.recent.push({ url: u, ts: now, bing: bingDirect.status }));
      log.recent = log.recent.slice(-200); // keep last 200
      await store.setJSON('latest.json', log);
    }
  } catch (e) { /* silent */ }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      submitted: urls.length,
      results: {
        'api.indexnow.org': bingResp.status,
        'www.bing.com':     bingDirect.status,
        'yandex.com':       yandexResp.status,
      },
      // 200/202 = accepted. 422 = invalid (usually wrong host or key mismatch).
      urls: urls,
    }),
  };
};
