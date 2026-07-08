// pulse-seo-monitor.js — serves the latest PULSE SPIDER SEO report for the on-site /seo
// dashboard. Read-only; key-gated. The crawler/daemon (_pulse_spider.js) publishes
// `seo-monitor/latest.json` to the blob store; this returns it when ?key=4444 is supplied.
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const ACCESS_KEY = '4444';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) {} }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: 'GET only' };
  const params = event.queryStringParameters || {};
  if (params.key !== ACCESS_KEY) return { statusCode: 401, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'unauthorized' }) };
  const store = initStore();
  if (!store) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'store unavailable' }) };
  try {
    const [data, content, progress] = await Promise.all([
      store.get('seo-monitor/latest.json', { type: 'json' }).catch(() => null),
      store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null),
      store.get('seo-monitor/progress.json', { type: 'json' }).catch(() => null),
    ]);
    if (!data && !content) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ pending: true, message: 'No report yet — the spider daemon will publish on its next cycle.', progress }) };
    const payload = Object.assign({}, data || {}, { content, progress });
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(payload) };
  } catch (e) { return { statusCode: 500, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: e.message }) }; }
};
