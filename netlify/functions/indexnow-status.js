// indexnow-status — GET endpoint returning recent IndexNow ping activity.
// Fed by indexnow-ping.js (which logs each batch to indexnow-status:latest.json).
// Used by the resume-page backlog widget.

let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  if (!getStore) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'blobs unavailable' }) };
  }

  try {
    const store = getStore({ name: 'indexnow-status', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
    const log = (await store.get('latest.json', { type: 'json' })) || { recent: [], total_pinged: 0, day_counts: {} };

    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const yesterday = new Date(now - 86400000).toISOString().slice(0, 10);

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30' },
      body: JSON.stringify({
        ok: true,
        total_pinged: log.total_pinged || 0,
        today_count: (log.day_counts && log.day_counts[day]) || 0,
        yesterday_count: (log.day_counts && log.day_counts[yesterday]) || 0,
        last_ping_at: log.last_ping_at || null,
        recent: (log.recent || []).slice(-15).reverse(),
        day_counts: log.day_counts || {},
      }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
