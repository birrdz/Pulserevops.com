// One-off: ping IndexNow for every library entry whose URL hasn't been
// pinged yet (or hasn't been pinged in 30+ days). Batches in groups of 500
// so we don't blow IndexNow's per-request size limit.
const https = require('https');
const { getStore } = require('@netlify/blobs');

const HOST = 'pulserevops.com';
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const TOKEN = process.env.BLOBS_PAT;
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
if (!TOKEN) { console.error('Missing BLOBS_PAT'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(data), 'User-Agent': 'pulserevops-indexnow/1.0' },
      timeout: 15000,
    }, (res) => {
      let buf = ''; res.on('data', c => buf += c);
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 200) }));
    });
    req.on('error', () => resolve({ status: 0, body: 'err' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data); req.end();
  });
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !idx.entries) { console.error('no index'); process.exit(1); }
  const allEntries = idx.entries.filter(e => e && e.id && /^q\d+$/.test(e.id));
  console.log('Index has', allEntries.length, 'q-entries');

  // Read existing indexnow ping log to skip already-pinged URLs in the last 30 days
  let pinged = {};
  try {
    const log = await store.get('_indexnow_log.json', { type: 'json' });
    if (log && log.urls) pinged = log.urls;
  } catch (e) {}
  const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
  const toPing = allEntries.filter(e => {
    const u = `https://${HOST}/knowledge/${e.id}`;
    return !pinged[u] || pinged[u] < cutoff;
  });
  console.log('Need pinging:', toPing.length, '(skipping', allEntries.length - toPing.length, 'recently pinged)');

  const urls = toPing.map(e => `https://${HOST}/knowledge/${e.id}`);
  const BATCH = 500;
  let totalOk = 0;
  const summary = { batches: [] };

  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const payload = { host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: batch };
    const results = await Promise.all([
      postJSON('https://api.indexnow.org/indexnow', payload),
      postJSON('https://www.bing.com/indexnow', payload),
      postJSON('https://yandex.com/indexnow', payload),
    ]);
    const codes = { api: results[0].status, bing: results[1].status, yandex: results[2].status };
    const anyOk = results.some(r => r.status >= 200 && r.status < 300);
    if (anyOk) {
      totalOk += batch.length;
      batch.forEach(u => { pinged[u] = Date.now(); });
    }
    summary.batches.push({ batch: i / BATCH + 1, size: batch.length, codes, ok: anyOk });
    console.log('Batch', i / BATCH + 1, 'size', batch.length, 'codes', codes, anyOk ? 'OK' : 'FAIL');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Save updated ping log
  await store.setJSON('_indexnow_log.json', { urls: pinged, last_run_ms: Date.now(), pinged_this_run: totalOk });
  // Also reset the batch state so the regular cron picks up from here
  await store.setJSON('_indexnow_state.json', {
    lastPushedTs: Date.now(),
    lastBatch: { count: totalOk, ts: Date.now(), summary, sample: urls.slice(0, 3), source: 'manual-backlog-script' }
  });

  console.log('\nDONE. Pinged', totalOk, 'URLs across', summary.batches.length, 'batches.');
})();
