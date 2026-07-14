'use strict';
/**
 * Rebuild sitewide need-fix pool for NEXT 30 (when scan_report was clobbered by next30 scope).
 * Then reset fixer + lock panel settings.
 */
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const SIM = path.join(WD, 'sim');
const FIXED = path.join(SIM, 'FIXED.md');

function loadCleared() {
  const s = new Set();
  try {
    const md = fs.readFileSync(FIXED, 'utf8');
    for (const m of md.matchAll(/·\s*([a-z]+\d+)\s*·/gi)) s.add(m[1].toLowerCase());
  } catch (e) {}
  return s;
}

(async () => {
  const cleared = loadCleared();
  const idx = await store.get('_index.json', { type: 'json' });
  const entries = {};
  let sub13 = 0, stub = 0, pass = 0;
  for (const e of (idx.entries || [])) {
    if (!e || !e.id) continue;
    const id = String(e.id).toLowerCase();
    if (!/^[a-z]{1,6}\d{1,6}$/i.test(id)) continue; // skip visitor ghosts / junk ids
    if (cleared.has(id)) { pass++; continue; }
    const qs = Number(e.quality_score);
    const gs = Number(e.gate_score);
    const words = Number(e.words) || 0;
    // Need-fix until modern certify. gate_score>=13 preferred; quality_score>=13 also counts
    // (index often missing gate_score). Legacy quality=10 alone is NOT done.
    const trulyDone = (Number.isFinite(gs) && gs >= 13) || (Number.isFinite(qs) && qs >= 13);
    const thin = words > 0 && words < 400;
    if (trulyDone && !thin) { pass++; continue; }
    const pile = thin ? 'STUB' : 'SUB13';
    if (pile === 'STUB') stub++; else sub13++;
    const pillar = (id.match(/^([a-z]+)/) || [, 'q'])[1];
    entries[id] = {
      id,
      pillar,
      pile,
      score: Number.isFinite(gs) ? gs : (Number.isFinite(qs) ? Math.round(qs * 1.3) : 0),
      quality_score: Number.isFinite(qs) ? qs : 0,
      words,
    };
  }
  const report = {
    scope: 'ALL',
    at: new Date().toISOString(),
    source: 'index-rebuild-for-next30',
    entries,
  };
  fs.mkdirSync(SIM, { recursive: true });
  fs.writeFileSync(path.join(SIM, 'scan_report_sitewide.json'), JSON.stringify(report));
  fs.writeFileSync(path.join(SIM, 'scan_report.json'), JSON.stringify(report));
  fs.writeFileSync(path.join(SIM, 'summary.json'), JSON.stringify({
    scope: 'ALL',
    total: Object.keys(entries).length + pass,
    piles: { PASS: pass, SUB13: sub13, STUB: stub, NEAR_DUP: 0 },
    at: report.at,
  }, null, 1));

  // Reset transform state
  for (const f of ['transform_state.json', 'fix_progress.json', 'next30.json', 'STOP.flag']) {
    try { fs.unlinkSync(path.join(SIM, f)); } catch (e) {}
  }
  fs.writeFileSync(path.join(SIM, 'run_status.json'), JSON.stringify({
    stage: 'idle',
    phase: 'idle',
    note: 'Reset · sitewide need rebuilt · NEXT 30 ready · sim→quality→image→title→13/13 · quality /10',
    updated: new Date().toISOString(),
  }, null, 1));
  fs.writeFileSync(path.join(SIM, 'transform_state.json'), JSON.stringify({ cleared: [], at: new Date().toISOString() }, null, 1));

  // Lock settings
  const cfgPath = path.join(WD, 'gen', 'config.json');
  const cfg = {
    fixConcurrency: 30,
    fixWorkers: 1,
    fixSoloTriple: false,
    fixScope: 'next30',
    fixStage: 'all',
    entriesPerHour: 10,
    perTopicPerHour: null,
    genTopics: 'ALL',
    runHours: 2,
    runUntil: null,
    paused: true,
    deployEveryHours: 0,
    pillarLap: false,
  };
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 1));

  // Rebuild NEXT 30 from new queue
  delete require.cache[require.resolve('./_fixer_scope_sections')];
  const { takeNext30, needFixQueue, buildFixerPods } = require('./_fixer_scope_sections');
  const q = needFixQueue();
  const next = takeNext30({ offset: 0 });
  buildFixerPods();
  console.log(JSON.stringify({
    ok: true,
    need: Object.keys(entries).length,
    sub13,
    stub,
    passSkippedOrOk: pass,
    queue: q.length,
    next30: { n: next.n, batch: next.batch, batches: next.batches, ids: next.ids.slice(0, 5) },
    settings: cfg,
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
