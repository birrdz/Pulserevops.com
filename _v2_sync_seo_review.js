// _v2_sync_seo_review.js — push needs-review (red box) to seo-monitor/content.json
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const { pushSeoCounts, reconcileLedger } = require('./_seo_monitor_sync_lib');

function readCrewPhase() {
  if (process.env.CREW_PHASE) return process.env.CREW_PHASE;
  try { return JSON.parse(fs.readFileSync(WD + '/_v2_crew_phase.json', 'utf8')).phase || 'red'; } catch (e) {}
  return fs.existsSync(WD + '/_v2_redbox_complete.flag') ? 'engine' : 'red';
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const reconcile = reconcileLedger(idx);
  const crewPhase = readCrewPhase();
  const engineMode = crewPhase === 'engine' || fs.existsSync(WD + '/_v2_redbox_complete.flag');
  const patch = {
    crewPhase,
    auditedAt: new Date().toISOString(),
    reviewNote: engineMode
      ? 'Site-wide perfection engine: 1 DS crawl-400 + 2 DDG imglanes + dual audit on approved→final'
      : 'Red box: 3 DS fix → 2 DDG images → 3 DS auditors (both PASS @12/13) → publish',
  };
  if (engineMode) patch.mode = 'crawl-400';
  const out = await pushSeoCounts(store, patch);
  console.log(JSON.stringify({
    needsReview: out.needsReview,
    redboxAuditQueue: out.redboxAuditQueue,
    approved: out.approved,
    ccApproved: out.ccApproved,
    catalogTotal: out.catalogTotal,
    reconcile: out.reconcile || reconcile,
  }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
