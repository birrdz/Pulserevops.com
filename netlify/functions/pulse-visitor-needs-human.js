// pulse-visitor-needs-human — owner endpoint that exposes any visitor
// questions where the Gemini volume writer failed (quota, API error,
// short answer). These need Claude Code to compose a gold-format reply
// per the locked Pulse workflow.
//
// Auth: shared key `pulsemachine` in ?key= or x-admin-key header.
//
// GET /pulse-visitor-needs-human?key=pulsemachine
//   → { ok, count, items: [{vq_id, q, reason, flagged_at}, ...] }
//
// POST /pulse-visitor-needs-human?key=pulsemachine
//   body { action: 'clear', vq_ids: ['vq_xxx', ...] }
//   → removes those vq_ids from the flag list

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const EXPECTED_KEY = 'pulsemachine';
const FLAG_KEY = '_visitor_needs_human.json';
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
};

function initStore() {
  if (!getStore) return null;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (tok && SITE_ID) {
      try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {}
    }
  }
  return null;
}

function authed(event) {
  const params = event.queryStringParameters || {};
  const headerKey = (event.headers && (event.headers['x-admin-key'] || event.headers['X-Admin-Key'])) || '';
  return params.key === EXPECTED_KEY || headerKey === EXPECTED_KEY;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (!authed(event)) return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'not found' }) };
  const store = initStore();
  if (!store) return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'no store' }) };

  if (event.httpMethod === 'GET') {
    try {
      const f = (await store.get(FLAG_KEY, { type: 'json' })) || { items: [] };
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: true,
          count: (f.items || []).length,
          last_flag_at: f.last_flag_at || null,
          items: (f.items || []).slice(0, 50),
        }),
      };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'read err' }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'bad json' }) }; }
    const action = String(body.action || '').toLowerCase();
    if (action === 'clear') {
      const ids = Array.isArray(body.vq_ids) ? new Set(body.vq_ids) : new Set();
      try {
        const f = (await store.get(FLAG_KEY, { type: 'json' })) || { items: [] };
        const before = (f.items || []).length;
        f.items = (f.items || []).filter(it => !ids.has(it.vq_id));
        await store.setJSON(FLAG_KEY, f);
        return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, before, after: f.items.length }) };
      } catch (e) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'write err' }) };
      }
    }
    if (action === 'clear_all') {
      try {
        await store.setJSON(FLAG_KEY, { items: [], cleared_at: Date.now() });
        return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, cleared_all: true }) };
      } catch (e) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'write err' }) };
      }
    }
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'unknown action (clear | clear_all)' }) };
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'GET or POST only' }) };
};
