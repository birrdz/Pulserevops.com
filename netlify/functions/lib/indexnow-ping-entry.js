// IndexNow ping for any indexable library entry (q / st / ik) + stamp was_indexed_at.

const https = require('https');
const { HOST, libraryEntryPublicUrl } = require('./library-entry-url');

const INDEXNOW_KEY_VAL = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY_VAL}.txt`;

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
          'User-Agent': 'pulserevops-indexnow-ping-entry/1.0',
        },
        timeout: 8000,
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => {
          buf += c;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 200) }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: 'err' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: 'timeout' });
    });
    req.write(data);
    req.end();
  });
}

async function stampIndexed(store, id, ts) {
  if (!store || !id) return;
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = (idx.entries || []).findIndex((e) => e && e.id === id);
    if (i >= 0) {
      idx.entries[i] = { ...idx.entries[i], was_indexed_at: ts };
      await store.setJSON('_index.json', idx);
    }
    const entry = await store.get('answers/' + id + '.json', { type: 'json' });
    if (entry) {
      await store.setJSON('answers/' + id + '.json', { ...entry, was_indexed_at: ts });
    }
  } catch (_) {}
}

/**
 * @param {string} id — q#### | st#### | ik####
 * @param {import('@netlify/blobs').Store | null} store
 * @param {object} [indexRow] — optional _index.json row (tags)
 */
async function pingIndexNowEntry(id, store, indexRow) {
  if (!id || !(/^(q|st|ik|tk|gb|bs|er|ra|gp|fr|ca|tn|sc|nl|dn|bt|mv|wl|dr|tv|rs|es|cl|lv|ev|sy|ga|gm|sk|sp|tl|cg|co|ai|bo|cd|aq|hf|tc)\d+(?:rv)?$/i.test(id) || /^vq_[a-z0-9]+(?:rv)?$/i.test(id))) {
    return { ok: false, reason: 'bad id' };
  }

  let row = indexRow;
  if (!row && store) {
    try {
      const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      row = (idx.entries || []).find((e) => e && e.id === id);
    } catch (_) {}
  }
  if (!row) row = { id };

  const targetUrl = libraryEntryPublicUrl(row);
  if (!targetUrl) return { ok: false, reason: 'no public url', id };

  // DUAL-INDEX LAW (2026-05-27): every entry ships with BOTH the original URL
  // AND its /reviews mirror. Ping them both so Bing/Yandex/Seznam crawl the
  // mirror immediately rather than waiting for the sitemap re-fetch.
  const reviewsUrl = targetUrl + '/reviews';

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY_VAL,
    keyLocation: KEY_LOCATION,
    urlList: [targetUrl, reviewsUrl],
  };

  const results = await Promise.all([
    postJSON('https://api.indexnow.org/indexnow', payload),
    postJSON('https://www.bing.com/indexnow', payload),
    postJSON('https://yandex.com/indexnow', payload),
    postJSON('https://searchadvisor.naver.com/indexnow', payload),
    postJSON('https://search.seznam.cz/indexnow', payload),
  ]);

  const pings = {
    indexnow_org: results[0].status,
    bing: results[1].status,
    yandex: results[2].status,
    naver: results[3].status,
    seznam: results[4].status,
  };
  const anyOk = results.some((r) => r.status >= 200 && r.status < 300);
  const ts = Date.now();
  if (anyOk && store) await stampIndexed(store, id, ts);

  return { ok: anyOk, id, url: targetUrl, ts, pings };
}

/** Batch IndexNow (up to 10k URLs) — does not stamp; caller stamps after. */
async function pingIndexNowUrlList(urls) {
  const list = (urls || []).filter(Boolean).slice(0, 10000);
  if (!list.length) return { ok: false, reason: 'empty url list' };

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY_VAL,
    keyLocation: KEY_LOCATION,
    urlList: list,
  };

  const results = await Promise.all([
    postJSON('https://api.indexnow.org/indexnow', payload),
    postJSON('https://www.bing.com/indexnow', payload),
    postJSON('https://yandex.com/indexnow', payload),
  ]);

  const pings = {
    indexnow_org: results[0].status,
    bing: results[1].status,
    yandex: results[2].status,
  };
  const anyOk = results.some((r) => r.status >= 200 && r.status < 300);
  return { ok: anyOk, count: list.length, pings };
}

module.exports = { pingIndexNowEntry, pingIndexNowUrlList, stampIndexed, HOST };
