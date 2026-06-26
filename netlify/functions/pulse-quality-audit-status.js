// Public read of _quality_audit_status.json for the knowledge.html top bar.

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initStore() {
  if (!getStore) return null;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (tok && SITE_ID) { try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {} }
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  const store = initStore();
  if (!store) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'no store' }) };
  try {
    const status = (await store.get('_quality_audit_status.json', { type: 'json' })) || {
      audited: 0, pass: 0, fail: 0, total: 0, cursor_pct: 0, idle: true,
    };
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, ...status }) };
  } catch (_e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'read err' }) };
  }
};
