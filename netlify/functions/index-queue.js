// index-queue — returns library entries still in the slow Google indexing
// queue (recently pushed, not yet known to be crawled). Used by the resume
// page widget. Data source: `_index.json` from the pulse-machine-library
// blob store. Filter to entries pushed in the last QUEUE_WINDOW_DAYS.

let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const QUEUE_WINDOW_DAYS = 14;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  if (!getStore) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'blobs unavailable' }) };
  }

  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
    const store = (tok && sid)
      ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok })
      : getStore('pulse-machine-library');

    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const entries = idx.entries || [];

    const now = Date.now();
    const cutoff = now - QUEUE_WINDOW_DAYS * 86400000;

    // Queue = entries published in the last 14 days that we have NOT yet
    // submitted to IndexNow. After a bulk stamp, this drops to ~0; new
    // entries from the cron routine appear here until pinged.
    const inQueue = entries
      .filter(e => e && e.id && (e.ts || 0) >= cutoff && !e.was_indexed_at)
      .map(e => ({
        id: e.id,
        question: (e.question || '').slice(0, 200),
        ts: e.ts || 0,
      }))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({
        ok: true,
        window_days: QUEUE_WINDOW_DAYS,
        total_library: entries.length,
        queue_count: inQueue.length,
        queue: inQueue,
      }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
