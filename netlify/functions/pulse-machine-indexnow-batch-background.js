// ════════════════════════════════════════════════════════════════════════
// pulse-machine-indexnow-batch — every 4 hours, find library entries
// created since the last run that haven't been IndexNow-pinged yet, and
// submit them in one batch to Bing/Yandex/Seznam.
//
// Cron: "0 */4 * * *" (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)
// State tracked in `_indexnow_state.json` blob: { lastPushedTs, lastBatch }.
//
// Why decoupled instead of inlined into research function: keeps the
// hourly research cron's failure surface tiny. If IndexNow is down, only
// this batch fails — not the research.
//
// Why every 4h instead of hourly: avoid burning IndexNow trust budget
// with single-URL pings. 4-6 URLs per push is a healthier cadence.
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const HOST = 'pulserevops.com';
const INDEXNOW_KEY = '7f3e9a2c8b1d4e5f6a7b8c9d0e1f2a3b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const LOOKBACK_MS = 6 * 60 * 60 * 1000; // 6h safety window past the 4h cron interval

function initStore(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore(name); } catch (e) { return null; }
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
        'User-Agent': 'pulserevops-indexnow-cron/1.0',
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

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async () => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  const store = initStore('pulse-machine-library');
  if (!store) return { statusCode: 200, body: 'no store' };

  // State
  let state = { lastPushedTs: 0, lastBatch: null };
  try { state = (await store.get('_indexnow_state.json', { type: 'json' })) || state; } catch (e) {}

  // Default: pick up entries created in the last 6 hours OR since lastPushedTs (whichever is more recent)
  const cutoff = Math.max(state.lastPushedTs || 0, Date.now() - LOOKBACK_MS);

  // Pull library index
  let entries = [];
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    // Pick up an entry if EITHER its original ts OR its last_modified_ms (set
    // by the polish endpoint when an entry climbs a score level) is past the
    // cutoff. This re-pings IndexNow whenever a polished entry's body changes,
    // so search engines see the updated content, not the original 5/10 draft.
    entries = (idx.entries || []).filter(e => {
      if (!e || !e.id) return false;
      const lastTouch = Math.max(e.ts || 0, e.last_modified_ms || 0);
      return lastTouch > cutoff;
    });
  } catch (e) {
    return { statusCode: 200, body: 'idx err' };
  }

  if (!entries.length) {
    console.log('[indexnow-batch] no new entries since', new Date(cutoff).toISOString());
    return { statusCode: 200, body: JSON.stringify({ ok: true, pushed: 0 }) };
  }

  const { libraryEntryPublicUrl } = require('./lib/library-entry-url');
  const urls = entries
    .map((e) => libraryEntryPublicUrl(e))
    .filter(Boolean)
    .slice(0, 10000);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  // Federated push (covers Bing/Yandex/Seznam) + direct fallbacks
  const results = await Promise.all([
    postJSON('https://api.indexnow.org/indexnow', payload),
    postJSON('https://www.bing.com/indexnow', payload),
    postJSON('https://yandex.com/indexnow', payload),
  ]);

  const summary = {
    api_indexnow: results[0].status,
    bing: results[1].status,
    yandex: results[2].status,
  };

  // Only update state if at least one engine accepted
  const anyOk = results.some(r => r.status >= 200 && r.status < 300);
  if (anyOk) {
    await store.setJSON('_indexnow_state.json', {
      lastPushedTs: Date.now(),
      lastBatch: { count: urls.length, ts: Date.now(), summary, sample: urls.slice(0, 3) },
    });
  }

  console.log('[indexnow-batch] pushed', urls.length, 'urls', summary);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, pushed: urls.length, summary, sample: urls.slice(0, 3) }),
  };
};
