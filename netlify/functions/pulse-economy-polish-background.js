// Background Gemini rewrite (15-min cap). Started by pulse-economy-polish (202).
// POST/GET body or query: { id: "q11129" }

const { getStore } = require('@netlify/blobs');
const { polishEntryById } = require('./lib/economy-polish-entry');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore('pulse-machine-library');
  } catch {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

function parseId(event) {
  const q = event.queryStringParameters || {};
  if (q.id) return String(q.id).trim();
  try {
    const b = JSON.parse(event.body || '{}');
    if (b.id) return String(b.id).trim();
  } catch (_e) {}
  return '';
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async (event) => {
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

  const id = parseId(event);
  if (!/^q\d+$/i.test(id)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'id required (q####)' }) };
  }

  const store = initStore();
  if (!store) {
    return { statusCode: 503, body: JSON.stringify({ ok: false, reason: 'blob store unavailable' }) };
  }

  const result = await polishEntryById(store, id, { dryRun: false });
  try {
    await store.setJSON('_economy_polish_last_result.json', { ...result, finished_at: Date.now() });
  } catch (_e) {}
  console.log('[pulse-economy-polish-background]', JSON.stringify(result).slice(0, 800));
  return {
    statusCode: result.ok ? 200 : (result.status || 500),
    body: JSON.stringify(result),
  };
};
