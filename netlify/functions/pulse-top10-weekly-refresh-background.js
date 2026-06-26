// Hourly: recompute Top 10 most viewed (7-day) and cache in pulse-view-counts blob.

const { getStore } = require('@netlify/blobs');
const { buildTop10Weekly } = require('./lib/top10-weekly');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOP10_KEY = 'top10-weekly.json';

function initStore(name) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore(name);
  } catch {
    if (tok && SITE_ID) return getStore({ name, siteID: SITE_ID, token: tok });
    return null;
  }
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async function top10WeeklyRefresh() {
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

  const viewStore = initStore('pulse-view-counts');
  const libStore = initStore('pulse-machine-library');
  if (!viewStore || !libStore) {
    return { statusCode: 200, body: 'blob unavailable' };
  }

  const snapshot = await buildTop10Weekly(viewStore, libStore);
  await viewStore.setJSON(TOP10_KEY, snapshot);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      items: snapshot.items.length,
      updated_at: snapshot.updated_at,
      top: snapshot.items.map((i) => ({ id: i.id, count: i.count })),
    }),
  };
};
