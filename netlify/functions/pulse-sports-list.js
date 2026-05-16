// Public read endpoint for the /sports page. Returns today's picks +
// lifetime stats. Password gate is client-side on sports.html — this
// endpoint is read-only and intentionally returns no PII.

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, max-age=0',
};

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (tok) {
    try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {}
  }
  try { return getStore('pulse-machine-library'); } catch (_e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: 'GET only' };

  const store = initStore();
  if (!store) return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'no store' }) };

  let picks = { date: null, items: [] };
  let stats = { lifetime: { wins: 0, losses: 0, pushes: 0, total: 0 }, by_sport: {}, today: { wins: 0, losses: 0, pushes: 0, total: 0 } };

  try {
    const p = await store.get('_sports_picks.json', { type: 'json' });
    if (p) picks = p;
  } catch (_e) {}

  try {
    const s = await store.get('_sports_stats.json', { type: 'json' });
    if (s) stats = s;
  } catch (_e) {}

  // Build per-sport win-rate strings
  const bySportFmt = {};
  for (const sport of Object.keys(stats.by_sport || {})) {
    const r = stats.by_sport[sport];
    const total = (r.wins || 0) + (r.losses || 0); // pushes excluded from rate
    const rate = total > 0 ? Math.round((r.wins || 0) * 100 / total) : null;
    bySportFmt[sport] = {
      wins: r.wins || 0,
      losses: r.losses || 0,
      pushes: r.pushes || 0,
      win_rate: rate,
    };
  }

  const lifeTotal = (stats.lifetime.wins || 0) + (stats.lifetime.losses || 0);
  const lifeRate = lifeTotal > 0 ? Math.round((stats.lifetime.wins || 0) * 100 / lifeTotal) : null;

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      date: picks.date,
      picks: picks.items || [],
      stats: {
        today: stats.today,
        lifetime: { ...stats.lifetime, win_rate: lifeRate },
        by_sport: bySportFmt,
      },
      configured: {
        odds_api: !!process.env.ODDS_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
      },
    }),
  };
};
