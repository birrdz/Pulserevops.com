// ════════════════════════════════════════════════════════════════════════
// pulse-pillar-totals — fast public read of the per-pillar entry-count
// snapshot written by the pulse-pillar-totals-cron scheduled function.
//
// Returns the cached _pillar_totals.json blob, or a fresh computation if
// the cache is missing/stale. Cache TTL: 12 hours (matches cron cadence).
// Stale-on-error: if recompute fails, fall back to the cached snapshot.
//
// GET /.netlify/functions/pulse-pillar-totals
//   → { total, by_pillar:{ knowledge, industry_kpis, ... }, generated_at, ... }
//
// GET /.netlify/functions/pulse-pillar-totals?force=1
//   → recompute on the fly (bypasses cache, also rewrites the blob)
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const PREFIX_KEYS = {
  q:  'knowledge',
  ik: 'industry_kpis',
  ra: 'revenue_architecture',
  gp: 'gtm_playbooks',
  st: 'sales_trainings',
  tk: 'tech_stacks',
  gb: 'graphics',
  bs: 'book_summaries',
  er: 'electronic_reviews',
};
const TTL_MS = 5 * 60 * 1000; // 5 min — refreshed frequently so homepage pillar counts feel live

function prefixOf(id) {
  if (!id) return null;
  if (/^vq_/i.test(id)) return 'q';
  const m = id.match(/^([a-z]+)\d+/i);
  return m ? m[1].toLowerCase() : null;
}

async function computeSnapshot(store) {
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const counts = Object.fromEntries(Object.values(PREFIX_KEYS).map((k) => [k, 0]));
  let unknown = 0;
  for (const e of idx.entries || []) {
    const pfx = prefixOf(e && e.id);
    const key = pfx && PREFIX_KEYS[pfx];
    if (key) counts[key]++;
    else if (e && e.id) unknown++;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return {
    total,
    by_pillar: counts,
    raw_index_length: (idx.entries || []).length,
    unknown_prefix_count: unknown,
    generated_at: Date.now(),
    generated_iso: new Date().toISOString(),
    source: 'pulse-pillar-totals (live)',
  };
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300, s-maxage=1800', // 5min browser, 30min CDN
  };

  let store;
  try {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
    store = (tok && sid)
      ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok })
      : getStore('pulse-machine-library');
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'store init failed: ' + String(err && err.message) }) };
  }

  const qs = (event && event.queryStringParameters) || {};
  const force = qs.force === '1' || qs.force === 'true' || /[?&]force=1/.test((event && event.rawQuery) || '');
  let cached = null;
  try {
    cached = await store.get('_pillar_totals.json', { type: 'json' });
  } catch (_) {}

  // Cache hit + fresh + not forced → return cached.
  if (cached && !force && cached.generated_at && Date.now() - cached.generated_at < TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: true, ...cached }) };
  }

  // Cache miss / stale / forced → recompute. Write back for the next caller.
  try {
    const snap = await computeSnapshot(store);
    try { await store.setJSON('_pillar_totals.json', snap); } catch (_) {}
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: false, ...snap }) };
  } catch (err) {
    // Recompute failed — fall back to whatever was cached, even if stale.
    if (cached) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, cached: true, stale: true, ...cached, fallback_reason: String(err && err.message) }) };
    }
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};
