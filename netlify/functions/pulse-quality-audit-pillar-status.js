// ════════════════════════════════════════════════════════════════════════
// pulse-quality-audit-pillar-status — pillar-scoped audit progress.
//
// Returns audit status for a single pillar (kpi, training, qa) instead of
// the full library. Powers the per-pillar AUDITING bar on
// industry-kpis.html and sales-trainings.html (mirror of the bar on
// knowledge.html, but scoped).
//
// Query param: ?pillar=kpi | training | qa  (defaults to kpi)
//
// Method:
//   • total       = entries in _index.json matching the pillar's id pattern
//   • fail        = entries in _quality_audit_flagged.json matching the pattern
//   • audited_pct = overall cursor audited_pct (uniform-progress approximation)
//   • audited     = round(total × audited_pct / 100)
//   • pass        = max(0, audited − fail)
//   • idle        = global idle flag (auditor walks all pillars together)
//
// The "uniform-progress" approximation is accurate because the auditor sweeps
// the index in cursor order, hitting every prefix proportionally on each pass.
// For a stricter per-pillar count, add by-pillar tracking to the cursor in
// pulse-quality-audit-background.js.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PILLAR_RE = {
  kpi:      /^ik\d+$/i,
  training: /^st\d+$/i,
  qa:       /^(?:q\d+|vq_)/i,
};

function initStore() {
  if (!getStore) return null;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (tok && SITE_ID) { try { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); } catch (_e) {} }
  }
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  const pillar = (event.queryStringParameters && event.queryStringParameters.pillar) || 'kpi';
  const re = PILLAR_RE[pillar];
  if (!re) return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'unknown pillar' }) };

  const store = initStore();
  if (!store) return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'no store' }) };

  try {
    const [idx, status, flagged] = await Promise.all([
      store.get('_index.json', { type: 'json' }).catch(() => null),
      store.get('_quality_audit_status.json', { type: 'json' }).catch(() => null),
      store.get('_quality_audit_flagged.json', { type: 'json' }).catch(() => null),
    ]);

    const entries = (idx && idx.entries) || [];
    const pillarEntries = entries.filter(e => e && e.id && re.test(e.id));
    const total = pillarEntries.length;

    const overallPct = Math.min(100, (status && typeof status.audited_pct === 'number' ? status.audited_pct : (status && status.cursor_pct) || 0));
    const audited = Math.round(total * overallPct / 100);

    const flaggedItems = (flagged && flagged.items) || [];
    const pillarFlagged = flaggedItems.filter(i => i && i.id && re.test(i.id));
    const fail = pillarFlagged.length;
    const pass = Math.max(0, audited - fail);

    const pass_rate = audited > 0 ? Math.round((pass / audited) * 1000) / 10 : 0;

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=10' },
      body: JSON.stringify({
        ok: true,
        pillar,
        total,
        audited,
        pass,
        fail,
        pass_rate,
        audited_pct: overallPct,
        idle: !!(status && status.idle),
        last_run: (status && status.last_run) || 0,
        flagged_ids: pillarFlagged.slice(0, 10).map(f => ({ id: f.id, score: f.score, missing: (f.missing || []).slice(0, 3) })),
      }),
    };
  } catch (_e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'read err' }) };
  }
};
