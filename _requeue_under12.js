'use strict';
/**
 * Put ALL gate < 12 pages back into the Less-than-12 / crew piles (owner 2026-07-27).
 * - Prefer gate_score, else quality_score
 * - Strip those ids from every _finisher_*_done.json (+ content booster done)
 * - Write _under12_failed.json + per-pillar _fix_queue_*.json
 * - Rebuild _under12_inventory.json
 *
 *   node _requeue_under12.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const BANK = path.join(WD, 'new', 'imagebank');
const GATE = 12;

function scoreOf(e) {
  if (e.gate_score != null) return Number(e.gate_score);
  if (e.quality_score != null) return Number(e.quality_score);
  return 10;
}
function pillarOf(id) {
  const m = String(id).match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : null;
}

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx && idx.entries) || [];
  const byPillar = {};
  const ids = [];
  const hist = {};
  for (const e of entries) {
    if (!e || !e.id) continue;
    const id = String(e.id);
    const p = pillarOf(id);
    if (!p) continue;
    const q = scoreOf(e);
    if (!(q < GATE)) continue;
    ids.push(id);
    byPillar[p] = (byPillar[p] || 0) + 1;
    hist[q] = (hist[q] || 0) + 1;
  }
  const idSet = new Set(ids);
  console.log('[requeue] found ' + ids.length + ' ids with score < ' + GATE);
  console.log('[requeue] hist ' + JSON.stringify(hist));
  console.log('[requeue] top pillars ' + JSON.stringify(Object.entries(byPillar).sort((a, b) => b[1] - a[1]).slice(0, 12)));

  // Strip from all finisher done lists
  let stripped = 0;
  const doneFiles = fs.existsSync(BANK)
    ? fs.readdirSync(BANK).filter((f) => /^_finisher_[a-z]+_done\.json$/i.test(f))
    : [];
  for (const f of doneFiles) {
    const fp = path.join(BANK, f);
    try {
      const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (!Array.isArray(a)) continue;
      const b = a.filter((id) => !idSet.has(String(id)));
      const n = a.length - b.length;
      if (n) {
        fs.writeFileSync(fp, JSON.stringify(b));
        stripped += n;
        console.log('[requeue] stripped ' + n + ' from ' + f + ' → ' + b.length + ' left');
      }
    } catch (e) {}
  }
  // content booster / other done lists that block under12
  for (const f of ['_content_done.json', '_booster_done.json']) {
    const fp = path.join(BANK, f);
    if (!fs.existsSync(fp)) continue;
    try {
      const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (!Array.isArray(a)) continue;
      const b = a.filter((id) => !idSet.has(String(id)));
      const n = a.length - b.length;
      if (n) {
        fs.writeFileSync(fp, JSON.stringify(b));
        stripped += n;
        console.log('[requeue] stripped ' + n + ' from ' + f);
      }
    } catch (e) {}
  }

  // Failed-rewrite pile = full under12 set (crews prefer this when UNDER12=1)
  const failRows = ids.map((id) => ({ id, after: null, at: Date.now(), requeued: true }));
  fs.writeFileSync(path.join(WD, '_under12_failed.json'), JSON.stringify(failRows));
  console.log('[requeue] wrote _under12_failed.json · ' + failRows.length);

  // Per-pillar fix queues (crews read these first)
  const byPIds = {};
  for (const id of ids) {
    const p = pillarOf(id);
    (byPIds[p] = byPIds[p] || []).push(id);
  }
  let queuedPillars = 0;
  for (const p of Object.keys(byPIds)) {
    const fp = path.join(BANK, '_fix_queue_' + p + '.json');
    let prev = [];
    try { prev = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) {}
    const merged = Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...byPIds[p]]));
    fs.writeFileSync(fp, JSON.stringify(merged));
    queuedPillars++;
  }
  console.log('[requeue] fix queues for ' + queuedPillars + ' pillars');

  // Inventory for hub dropdown
  const inv = { total: ids.length, at: new Date().toISOString(), byPillar, ids, hist };
  fs.writeFileSync(path.join(WD, '_under12_inventory.json'), JSON.stringify(inv));
  console.log('[requeue] wrote _under12_inventory.json · ' + inv.total);

  console.log(JSON.stringify({
    ok: true,
    under12: ids.length,
    strippedFromDone: stripped,
    pillars: Object.keys(byPillar).length,
    top: Object.entries(byPillar).sort((a, b) => b[1] - a[1]).slice(0, 10),
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
