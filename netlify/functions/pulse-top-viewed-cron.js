// ════════════════════════════════════════════════════════════════════════
// pulse-top-viewed-cron — Netlify scheduled function (every 6 hours = 4×/day)
//
// Refreshes the rolling top-12-most-viewed-in-7-days snapshot so the
// Trending shelf on /knowledge serves fresh data without recomputing on
// every page-load. The snapshot is written to the `pulse-view-counts`
// blob store at `top10-weekly.json`, the same key entry-view.js already
// reads + serves via GET /.netlify/functions/entry-view?trending=1.
//
// Schedule: every 6 hours (00:00 · 06:00 · 12:00 · 18:00 UTC).
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');
const { buildTop10Weekly } = require('./lib/top10-weekly');

const VIEW_STORE = 'pulse-view-counts';
const LIB_STORE = 'pulse-machine-library';
const TOP10_KEY = 'top10-weekly.json';

function initStore(name) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try {
    return (tok && sid)
      ? getStore({ name, siteID: sid, token: tok })
      : getStore(name);
  } catch (_) { return null; }
}

exports.handler = async () => {
  const viewStore = initStore(VIEW_STORE);
  const libStore = initStore(LIB_STORE);
  if (!viewStore || !libStore) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'store init failed' }) };
  }
  try {
    const snap = await buildTop10Weekly(viewStore, libStore);
    await viewStore.setJSON(TOP10_KEY, snap);
    const top = (snap && Array.isArray(snap.trending) ? snap.trending : []).slice(0, 3).map(e => e && e.id).filter(Boolean);
    console.log('[pulse-top-viewed-cron] OK', 'count=' + (snap && snap.trending ? snap.trending.length : 0), 'top3=' + top.join(','));
    return { statusCode: 200, body: JSON.stringify({ ok: true, count: snap && snap.trending ? snap.trending.length : 0, top: top }) };
  } catch (err) {
    console.error('[pulse-top-viewed-cron] FAIL', err && err.stack);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};

// 4× per day = every 6 hours (00:00 · 06:00 · 12:00 · 18:00 UTC).
exports.config = { schedule: '0 */6 * * *' };
