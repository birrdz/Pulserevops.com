// ═══════════════════════════════════════════════════════════════════════════
// pulse-library-snapshot-background — twice-daily snapshot of the latest N
// library entries (across EVERY pillar: knowledge / trainings / KPIs / tech
// stacks / graphics / book summaries / electronic reviews / revenue
// architecture / GTM playbooks). Writes the snapshot to the blob store at
// `_latest_all_pillars.json` so static pages can ship a pre-rendered "Just
// published" list at deploy/build time and the client can refresh from the
// live API on top of it.
//
// SCHEDULE (NOT WIRED YET — owner approval required):
//   To activate, add to netlify.toml:
//     [functions."pulse-library-snapshot-background"]
//     schedule = "0 12,0 * * *"      # 12:00 UTC (8 AM ET) + 00:00 UTC (8 PM ET)
//
// The widgets on index.html / dashboard.html / pulse-new.html already fetch
// pulse-machine-library-list?recent=N with cache:'no-store' on every page
// load, so visitors always see fresh state without this cron — the snapshot
// is purely a deploy-time optimisation. Leaving the schedule directive OFF
// keeps us inside the "crons disabled by default" rule
// (feedback_pulse_locked_workflow.md / passcode 4444).
// ═══════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SNAPSHOT_SIZE = 50; // newest N across ALL pillars

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) {
    try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; }
  }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

// Mirror of netlify/functions/lib/library-entry-url.js. Inlined so this
// background function has no dependency on the shared helper at deploy time.
function pillarOf(id) {
  const s = String(id || '');
  if (/^st\d+$/i.test(s))  return { kind: 'training',            path: '/sales-trainings/',        label: 'Sales Training' };
  if (/^ik\d+$/i.test(s))  return { kind: 'kpi',                 path: '/industry-kpis/',          label: 'Industry KPI' };
  if (/^tk\d+$/i.test(s))  return { kind: 'techstack',           path: '/tech-stacks/',            label: 'Tech Stack' };
  if (/^gb\d+$/i.test(s))  return { kind: 'graphic',             path: '/graphics/',               label: 'Graphic' };
  if (/^bs\d+$/i.test(s))  return { kind: 'booksummary',         path: '/sales-book-summaries/',   label: 'Book Summary' };
  if (/^er\d+$/i.test(s))  return { kind: 'electronicreview',    path: '/electronic-reviews/',     label: 'Electronic Review' };
  if (/^ra\d+$/i.test(s))  return { kind: 'revenuearchitecture', path: '/revenue-architecture/',   label: 'Revenue Architecture' };
  if (/^gp\d+$/i.test(s))  return { kind: 'gtmplaybook',         path: '/go-to-market-playbooks/', label: 'GTM Playbook' };
  if (/^vq_/i.test(s))     return { kind: 'knowledge',           path: '/knowledge/',              label: 'Visitor Q&A' };
  if (/^q\d+$/i.test(s))   return { kind: 'knowledge',           path: '/knowledge/',              label: 'Library answer' };
  return null;
}

exports.handler = async () => {
  const store = initStore();
  if (!store) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'blob store unavailable' }) };
  }

  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const allEntries = Array.isArray(idx.entries) ? idx.entries : [];

    // Per-pillar breakdown.
    const byPillar = {};
    const ranked = [];
    for (const e of allEntries) {
      if (!e || !e.id) continue;
      const p = pillarOf(e.id);
      if (!p) continue;
      byPillar[p.kind] = (byPillar[p.kind] || 0) + 1;
      ranked.push({
        id: e.id,
        question: e.question || '',
        ts: e.ts || 0,
        polished_at: e.polished_at || null,
        quality_score: typeof e.quality_score === 'number' ? e.quality_score : 5,
        tags: Array.isArray(e.tags) ? e.tags.slice(0, 6) : [],
        kind: p.kind,
        url: p.path + e.id,
        label: p.label,
      });
    }

    // Newest first across all pillars combined.
    ranked.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    const latest = ranked.filter((e) => e.question).slice(0, SNAPSHOT_SIZE);

    const snapshot = {
      ok: true,
      snapshot_ts: Date.now(),
      snapshot_iso: new Date().toISOString(),
      schema_version: 'v1-2026-05-31',
      library_total: allEntries.length,
      by_pillar: byPillar,
      latest,
    };

    await store.set('_latest_all_pillars.json', JSON.stringify(snapshot), {
      metadata: { written_at: snapshot.snapshot_iso },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        wrote: '_latest_all_pillars.json',
        snapshot_ts: snapshot.snapshot_ts,
        library_total: snapshot.library_total,
        latest_count: latest.length,
        by_pillar: byPillar,
      }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: false, reason: 'snapshot err', message: String((e && e.message) || e) }),
    };
  }
};
