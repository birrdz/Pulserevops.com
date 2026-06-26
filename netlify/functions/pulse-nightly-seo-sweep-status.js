// Public read of _nightly_seo_sweep_status.json — last-run stats for the
// nightly SEO sweep (pulse-nightly-seo-sweep-background.js).

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
    const status = (await store.get('_nightly_seo_sweep_status.json', { type: 'json' })) || { never_run: true };
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, ...status }) };
  } catch (_e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'read err' }) };
  }
};
