// ════════════════════════════════════════════════════════════════════════
// pulse-pillar-totals-cron — Netlify scheduled function (every 12 hours)
//
// Walks the master _index.json once and computes per-pillar entry counts +
// grand total. Stores the snapshot to the Blobs store at _pillar_totals.json
// so the homepage badge can read it via the fast `pulse-pillar-totals`
// endpoint without re-walking 5,500+ entries on every page load.
//
// Pillar prefixes counted:
//   q####  → Knowledge Library
//   ik#### → Industry KPIs
//   ra#### → Revenue Architecture
//   gp#### → GTM Playbooks
//   st#### → Sales Trainings
//   tk#### → Tech Stacks
//   gb#### → Graphics
//   bs#### → Book Summaries
//   er#### → Electronic Reviews
//   vq_*   → Visitor Questions (already merged into knowledge counts after publish)
//
// Owner asked for "Knowledge Library, Industry KPIs, Revenue Architecture,
// GTM Playbooks, Sales Trainings, Tech Stacks, and the Library" — the
// snapshot includes ALL pillars so the homepage can sum any combination.
//
// Schedule: every 12 hours (00:00 and 12:00 UTC).
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

function prefixOf(id) {
  if (!id) return null;
  if (/^vq_/i.test(id)) return 'q'; // visitor questions count under Knowledge
  const m = id.match(/^([a-z]+)\d+/i);
  return m ? m[1].toLowerCase() : null;
}

async function buildSnapshot() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  const store = (tok && sid)
    ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok })
    : getStore('pulse-machine-library');
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

  const snapshot = {
    total,
    by_pillar: counts,
    raw_index_length: (idx.entries || []).length,
    unknown_prefix_count: unknown,
    generated_at: Date.now(),
    generated_iso: new Date().toISOString(),
    next_run_iso: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    source: 'pulse-pillar-totals-cron',
  };

  await store.setJSON('_pillar_totals.json', snapshot);
  return snapshot;
}

// Netlify scheduled function — runs on the schedule below.
exports.handler = async () => {
  try {
    const snap = await buildSnapshot();
    console.log('[pulse-pillar-totals-cron] OK', JSON.stringify(snap));
    return { statusCode: 200, body: JSON.stringify({ ok: true, snapshot: snap }) };
  } catch (err) {
    console.error('[pulse-pillar-totals-cron] FAIL', err && err.stack);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err && err.message) }) };
  }
};

// Netlify's scheduled-functions config — every 6 hours (00:00 / 06:00 / 12:00 / 18:00 UTC).
// Bumped from 12h → 6h on 2026-06-02 per owner: "every category should be
// updating the amount in each category at least twice a day." 4×/day exceeds that.
exports.config = { schedule: '0 */6 * * *' };
