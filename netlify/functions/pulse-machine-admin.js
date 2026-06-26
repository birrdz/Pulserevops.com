// ════════════════════════════════════════════════════════════════════════
// pulse-machine-admin — owner-only control endpoint.
//
// Auth: shared secret in `?key=` query string OR `x-admin-key` header.
// The expected key matches the admin.html EXPECTED constant — hardcoded for
// simplicity (this is owner-only convenience, not a true security boundary).
//
// Actions:
//   POST { action: 'pause' }   → sets _pause.json { paused: true }
//   POST { action: 'resume' }  → sets _pause.json { paused: false }
//   GET  /                     → returns current pause state
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const EXPECTED_KEY = 'pulsemachine'; // matches admin.html

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function authed(event) {
  const params = event.queryStringParameters || {};
  const headerKey = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
  return params.key === EXPECTED_KEY || headerKey === EXPECTED_KEY;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (!authed(event)) return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'not found' }) };

  const store = initStore();
  if (!store) return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'no store' }) };

  if (event.httpMethod === 'GET') {
    try {
      const pause = (await store.get('_pause.json', { type: 'json' })) || { paused: false };
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, ...pause }) };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'read err' }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'bad json' }) }; }
    const action = String(body.action || '').toLowerCase();
    if (action === 'pause') {
      await store.setJSON('_pause.json', { paused: true, ts: Date.now(), source: 'admin' });
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, paused: true }) };
    }
    if (action === 'resume') {
      await store.setJSON('_pause.json', { paused: false, ts: Date.now(), source: 'admin' });
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, paused: false }) };
    }
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'unknown action' }) };
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'GET or POST only' }) };
};
