// ════════════════════════════════════════════════════════════════════════
// pulse-machine-evening-push — daily 23:00 UTC (= 7pm EDT) heavy push.
//
// Cron: "0 23 * * *"
//
// What it does, in order:
//   1. Pulls every library entry researched today
//   2. Pings IndexNow with the full batch (Bing/Yandex/Seznam)
//   3. Pings IndexNow with the homepage + library hub + tools index
//      (signals "fresh activity" at evening crawl peak — SEO timing)
//   4. Writes today's run state to `pulse-machine-library/_evening_push.json`
//      so /whats-new can show "Last refresh: 7pm EDT"
//
// Why evening: search engines weight crawl frequency by activity patterns.
// A consistent 7pm-EDT activity burst trains them to re-crawl at peak hours.
// Plus: 7pm EDT is the highest browser-traffic window for B2B audiences in
// the US (commute end + couch time).
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const HOST = 'pulserevops.com';
const SITE = 'https://' + HOST;
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;

// Always-warm URLs to re-ping at evening peak (signals fresh activity)
const HUB_URLS = [
  SITE + '/',
  SITE + '/knowledge.html',
  SITE + '/tools/',
  SITE + '/themachine',
];

function initStore(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore(name); } catch (e) { return null; }
}

function dayKey(d) { return (d || new Date()).toISOString().slice(0, 10); }

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
        'User-Agent': 'pulserevops-evening-push/1.0',
      },
      timeout: 8000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 200) }));
    });
    req.on('error', () => resolve({ status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0 }); });
    req.write(data);
    req.end();
  });
}

async function indexNowPush(urls) {
  if (!urls.length) return null;
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(0, 10000),
  };
  const results = await Promise.all([
    postJSON('https://api.indexnow.org/indexnow', payload),
    postJSON('https://www.bing.com/indexnow', payload),
    postJSON('https://yandex.com/indexnow', payload),
  ]);
  return {
    api_indexnow: results[0].status,
    bing: results[1].status,
    yandex: results[2].status,
  };
}

exports.handler = async () => {
  const store = initStore('pulse-machine-library');
  if (!store) return { statusCode: 200, body: 'no store' };

  const today = dayKey();
  const todayMidnight = new Date(today + 'T00:00:00Z').getTime();

  // Pull today's library entries
  let entries = [];
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    entries = (idx.entries || []).filter(e => e && e.id && (e.ts || 0) >= todayMidnight);
  } catch (e) { /* fall through */ }

  const todayUrls = entries.map(e => SITE + '/knowledge/' + e.id);

  // Phase 1: today's library entries
  const phase1 = await indexNowPush(todayUrls);

  // Phase 2: hub URLs (homepage, library, tools index, themachine)
  const phase2 = await indexNowPush(HUB_URLS);

  // Phase 3: top tag pages (where activity changed today)
  const todayTags = new Set();
  entries.forEach(e => (e.tags || []).forEach(t => {
    const tl = String(t || '').toLowerCase();
    if (tl && /^[a-z0-9-]+$/.test(tl)) todayTags.add(tl);
  }));
  const tagUrls = Array.from(todayTags).map(t => SITE + '/knowledge/tag/' + t);
  const phase3 = await indexNowPush(tagUrls);

  const summary = {
    day: today,
    ts: Date.now(),
    today_entry_count: todayUrls.length,
    today_tag_count: tagUrls.length,
    phase1_entries: phase1,
    phase2_hubs: phase2,
    phase3_tags: phase3,
  };

  // Write public-facing "evening push" state for /whats-new ticker
  try { await store.setJSON('_evening_push.json', summary); } catch (e) {}

  console.log('[evening-push] done', summary);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, ...summary }),
  };
};
