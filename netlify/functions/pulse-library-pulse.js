// ════════════════════════════════════════════════════════════════════════
// pulse-library-pulse — THE single authoritative count endpoint.
//
// Replaces the prior fragmented landscape of pulse-pillar-totals (cached),
// pulse-machine-library-list?status=1 (live), per-pillar counts in HTML,
// hardcoded values, and a +2,000,000 display offset that all diverged.
//
// One endpoint. One number. One paint target. Site-wide consistency.
//
// GET /.netlify/functions/pulse-library-pulse
//   → { ok, total, by_pillar:{q,st,ik,tk,gb,bs,er,ra,gp}, generated_iso }
//
// The total is computed FRESH on every request from _index.json (no cache,
// no snapshot drift). For 5,000-6,000 entries the index fetch is ~50-100ms
// — fast enough to call every 60s from the browser without burning budget.
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const PILLAR_KEYS = {
  q:  'knowledge',
  st: 'sales_trainings',
  ik: 'industry_kpis',
  tk: 'tech_stacks',
  gb: 'graphics',
  bs: 'book_summaries',
  er: 'electronic_reviews',
  ra: 'revenue_architecture',
  gp: 'gtm_playbooks',
};

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try {
    return (tok && sid)
      ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok })
      : getStore('pulse-machine-library');
  } catch (_) { return null; }
}

exports.handler = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // 30s edge cache is enough to coalesce a herd of visitors at the same minute
    // without ever showing a stale-by-more-than-30s number.
    'Cache-Control': 'public, max-age=30, s-maxage=30',
  };
  const store = initStore();
  if (!store) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'store init failed' }) };
  }
  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const entries = idx.entries || [];
    const counts = Object.fromEntries(Object.values(PILLAR_KEYS).map((k) => [k, 0]));
    let total = 0;
    for (const e of entries) {
      if (!e || !e.id) continue;
      total++;
      let pfx;
      if (/^vq_/i.test(e.id)) pfx = 'q';
      else {
        const m = e.id.match(/^([a-z]+)\d+/i);
        pfx = m ? m[1].toLowerCase() : null;
      }
      const key = pfx && PILLAR_KEYS[pfx];
      if (key) counts[key]++;
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        total,
        by_pillar: counts,
        generated_at: Date.now(),
        generated_iso: new Date().toISOString(),
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};
