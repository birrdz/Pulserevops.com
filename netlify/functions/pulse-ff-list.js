// ════════════════════════════════════════════════════════════════════════
// pulse-ff-list — public read-only endpoint for the Fantasy Football page.
// Returns the latest aggregated rankings written by pulse-ff-daily.
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'pulse-fantasy-football';
const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=60',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET')     return { statusCode: 405, headers: CORS, body: 'GET only' };
  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const store = getStore({ name: STORE_NAME, siteID: SITE_ID, token: tok });
    const latest = await store.get('_latest.json', { type: 'json' });
    if (!latest) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'rankings not yet generated' }) };
    }
    // Attach simulation summary if available — small payload, used by the
    // "Season Simulations" card on /sports.
    try {
      const sims = await store.get('simulations/_latest.json', { type: 'json' });
      if (sims && sims.ok) {
        latest.simulations = {
          generated_at: sims.generated_at,
          n_sims: sims.n_sims,
          season: sims.season,
          method: sims.method,
          leaders: sims.leaders,
        };
      }
    } catch (_) { /* sims optional */ }
    return { statusCode: 200, headers: CORS, body: JSON.stringify(latest) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
