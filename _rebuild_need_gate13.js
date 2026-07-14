'use strict';
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
  try {
    const st = JSON.parse(fs.readFileSync(path.join(SIM, 'transform_state.json'), 'utf8'));
    for (const id of st.cleared || []) s.add(String(id).toLowerCase());
  } catch (e) {}
  return s;
}

/** Truly done = has gate_score >= 13 (modern certify). Legacy quality=10 alone is NOT done. */
function isTrulyDone(e) {
  const gs = Number(e.gate_score);
  if (Number.isFinite(gs) && gs >= 13) return true;
  // also accept explicit modern stamp if both quality>=10 AND gate present
  return false;
}

(async () => {
  const cleared = loadCleared();
  const idx = await store.get('_index.json', { type: 'json' });
  let real = 0, need = 0, skipCleared = 0, skipDone = 0;
  let legacy10noGate = 0, hasGate13 = 0, q13 = 0;
  const entries = {};
  for (const e of idx.entries || []) {
    if (!e || !e.id) continue;
    const id = String(e.id).toLowerCase();
    if (!/^[a-z]{1,6}\d{1,6}$/i.test(id)) continue;
    real++;
    const qs = Number(e.quality_score);
    const gs = Number(e.gate_score);
    if (Number.isFinite(gs) && gs >= 13) hasGate13++;
    if (qs === 13) q13++;
    if (cleared.has(id)) { skipCleared++; continue; }
    if (isTrulyDone(e)) { skipDone++; continue; }
    if (qs === 10 && !Number.isFinite(gs)) legacy10noGate++;
    need++;
    const thin = (Number(e.words) || 0) > 0 && (Number(e.words) || 0) < 400;
    entries[id] = {
      id,
      pillar: (id.match(/^([a-z]+)/) || [, 'q'])[1],
      pile: thin ? 'STUB' : 'SUB13',
      score: Number.isFinite(gs) ? gs : (Number.isFinite(qs) ? Math.round(qs * 1.3) : 0),
      quality_score: Number.isFinite(qs) ? qs : 0,
      words: Number(e.words) || 0,
      why: Number.isFinite(gs) ? ('gate_' + gs) : (qs === 10 ? 'legacy10' : ('q_' + (Number.isFinite(qs) ? qs : 'na'))),
    };
  }
  const batches = Math.ceil(need / 30);
  console.log(JSON.stringify({
    indexReal: real,
    needFix: need,
    batchesOf30: batches,
    skipCleared,
    skipGate13: skipDone,
    hasGate13OnIndex: hasGate13,
    qualityEquals13: q13,
    legacy10NoGateScore: legacy10noGate,
  }, null, 2));

  const report = {
    scope: 'ALL',
    at: new Date().toISOString(),
    source: 'rebuild-need-until-gate13',
    law: 'need-fix unless gate_score>=13 (legacy quality=10 alone is NOT done)',
    entries,
  };
  fs.writeFileSync(path.join(SIM, 'scan_report_sitewide.json'), JSON.stringify(report));
  fs.writeFileSync(path.join(SIM, 'scan_report.json'), JSON.stringify(report));
  const stub = Object.values(entries).filter((x) => x.pile === 'STUB').length;
  const sub = Object.values(entries).filter((x) => x.pile === 'SUB13').length;
  fs.writeFileSync(path.join(SIM, 'summary.json'), JSON.stringify({
    scope: 'ALL',
    total: real,
    piles: { PASS: skipDone, SUB13: sub, STUB: stub, NEAR_DUP: 0 },
    at: report.at,
    note: 'NEED ' + need + ' · ' + batches + '×30 · done only if gate_score≥13',
  }, null, 1));

  try { fs.unlinkSync(path.join(SIM, 'next30.json')); } catch (e) {}
  delete require.cache[require.resolve('./_fixer_scope_sections')];
  const { takeNext30, needFixQueue, buildFixerPods } = require('./_fixer_scope_sections');
  const q = needFixQueue();
  const next = takeNext30({ offset: 0 });
  const pods = buildFixerPods();
  console.log(JSON.stringify({
    rebuilt: true,
    queue: q.length,
    next30: { n: next.n, batch: next.batch, batches: next.batches, totalNeed: next.totalNeed },
    openPods: (pods.open || []).length,
    donePods: (pods.done || []).length,
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
