// Targeted IndexNow ping — submits ONE specific library entry URL to
// Bing/Yandex/Seznam. Used by the wake-loop INDEX phase so the action is
// visibly tied to the entry currently being polished, not a generic batch.
//
// POST { key, id } → pings https://pulserevops.com/knowledge/<id>

const https = require('https');
const { getStore } = require('@netlify/blobs');

const HOST = 'pulserevops.com';
const INDEXNOW_KEY_VAL = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY_VAL}.txt`;
const SHARED_KEY = 'pulsemachine-writer-2026';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
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
        'User-Agent': 'pulserevops-indexnow-target/1.0',
      },
      timeout: 8000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: buf.slice(0, 200) }));
    });
    req.on('error', () => resolve({ status: 0, body: 'err' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  if (body.key !== SHARED_KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };
  const id = body.id;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id (must be qNNNN)' }) };

  const targetUrl = `https://${HOST}/knowledge/${id}`;
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY_VAL,
    keyLocation: KEY_LOCATION,
    urlList: [targetUrl],
  };

  // Submit to every IndexNow endpoint we know of — most distribute via
  // api.indexnow.org but direct submission gives faster propagation. DDG,
  // Ecosia use Bing's index (covered via Bing). Brave + Mojeek don't support
  // IndexNow.
  const results = await Promise.all([
    postJSON('https://api.indexnow.org/indexnow', payload),
    postJSON('https://www.bing.com/indexnow', payload),
    postJSON('https://yandex.com/indexnow', payload),
    postJSON('https://searchadvisor.naver.com/indexnow', payload),
    postJSON('https://search.seznam.cz/indexnow', payload),
  ]);

  // Stamp was_indexed_at on the entry's index row + per-entry blob so the
  // library card can show a visible "⊙ INDEXED" badge after a successful ping.
  const ts = Date.now();
  try {
    const tok = process.env.BLOBS_PAT;
    let store;
    try { store = getStore('pulse-machine-library'); }
    catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = (idx.entries || []).findIndex(e => e && e.id === id);
    if (i >= 0) {
      idx.entries[i] = { ...idx.entries[i], was_indexed_at: ts };
      await store.setJSON('_index.json', idx);
    }
    const entry = await store.get('answers/' + id + '.json', { type: 'json' });
    if (entry) {
      await store.setJSON('answers/' + id + '.json', { ...entry, was_indexed_at: ts });
    }
  } catch (_e) {}

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      id,
      url: targetUrl,
      ts,
      pings: {
        indexnow_org: results[0].status,
        bing: results[1].status,
        yandex: results[2].status,
        naver: results[3].status,
        seznam: results[4].status,
      },
    }),
  };
};
