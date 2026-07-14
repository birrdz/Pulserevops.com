'use strict';
/**
 * PICK 29 — random URLs that need fixing, no sims, spread across pillars.
 * Writes sim/pick29.json for the fix machine.
 */
const fs = require('fs');
const path = require('path');
const WD = path.join(__dirname);
const SIM = path.join(WD, 'sim');
const PICK_F = path.join(SIM, 'pick29.json');
const REPORT_F = path.join(SIM, 'scan_report.json');
const N = 29;

function pillarOf(id) {
  const m = String(id || '').toLowerCase().match(/^([a-z]{1,3})\d+$/);
  return m ? m[1] : '';
}

function isRealEntryId(id) {
  // Real library Q&As: gp0123, ik0719, st0001, q11133 — not draft/tmp qmpx* hashes
  return /^[a-z]{1,3}\d{2,5}$/i.test(String(id || ''));
}

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = x[i]; x[i] = x[j]; x[j] = t;
  }
  return x;
}

/** Last scan report: SUB13+STUB only — never NEAR_DUP / sim. */
function candidatesFromReport() {
  if (!fs.existsSync(REPORT_F)) return { list: [], scope: null };
  let rep;
  try { rep = JSON.parse(fs.readFileSync(REPORT_F, 'utf8')); } catch (e) { return { list: [], scope: null }; }
  const out = [];
  for (const e of Object.values(rep.entries || {})) {
    if (!e || !e.id || !isRealEntryId(e.id)) continue;
    const pile = String(e.pile || '').toUpperCase();
    if (pile !== 'SUB13' && pile !== 'STUB') continue;
    out.push({ id: String(e.id), kind: pile === 'STUB' ? 'stub' : 'sub13', pile, pillar: pillarOf(e.id), src: 'report' });
  }
  return { list: out, scope: rep.scope || null };
}

/** Library index fallback — IQ under 8 or missing (needs quality/gate), no sim. */
async function candidatesFromIndex(store) {
  if (!store) return [];
  let idx;
  try { idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); } catch (e) { return []; }
  const out = [];
  for (const e of (idx && idx.entries) || []) {
    if (!e || !e.id || !isRealEntryId(e.id)) continue;
    const id = String(e.id);
    const p = pillarOf(id);
    if (!p) continue;
    const iq = e.quality_score != null ? Number(e.quality_score) : (e.iq != null ? Number(e.iq) : null);
    const sc = e.score != null ? Number(e.score) : (e.rubric != null ? Number(e.rubric) : null);
    // Done only at 10/10 (pass bar). Old "iq>=8" skip left 8s stranded as finished.
    if (iq != null && iq >= 10 && (sc == null || sc >= 13)) continue;
    out.push({
      id,
      kind: (sc != null && sc < 8) ? 'stub' : 'sub13',
      pile: 'NEED',
      pillar: p,
      src: 'index',
      iq,
      score: sc,
    });
  }
  return out;
}

/** Stratified random: round-robin across pillars. */
function pickAcrossPillars(cands, n) {
  const by = {};
  for (const c of cands) {
    const p = c.pillar || pillarOf(c.id) || '?';
    if (!by[p]) by[p] = [];
    by[p].push(c);
  }
  for (const p of Object.keys(by)) by[p] = shuffle(by[p]);
  const pillars = shuffle(Object.keys(by));
  if (!pillars.length) return [];
  const picked = [];
  const seen = new Set();
  let guard = 0;
  while (picked.length < n && guard < n * 80) {
    guard++;
    let progress = false;
    for (const p of pillars) {
      if (picked.length >= n) break;
      const bucket = by[p];
      while (bucket.length) {
        const c = bucket.shift();
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        picked.push(c);
        progress = true;
        break;
      }
    }
    if (!progress) break;
  }
  return picked;
}

async function runPick(n, store) {
  n = Math.max(1, Math.min(100, parseInt(n, 10) || N));
  const fromRep = candidatesFromReport();
  let cands = fromRep.list.slice();
  let src = 'report';
  const pillarsInReport = new Set(cands.map((c) => c.pillar));
  // Always prefer multi-pillar: merge index need-fix when report is thin / one pillar
  if ((pillarsInReport.size < 3 || cands.length < n * 2) && store) {
    const fromIdx = await candidatesFromIndex(store);
    if (fromIdx.length) {
      const seen = new Set(cands.map((c) => c.id));
      for (const c of fromIdx) {
        if (seen.has(c.id)) continue;
        seen.add(c.id);
        cands.push(c);
      }
      src = pillarsInReport.size ? 'report+index' : 'index';
    }
  }
  const picked = pickAcrossPillars(cands, n);
  const byPillar = {};
  for (const p of picked) byPillar[p.pillar] = (byPillar[p.pillar] || 0) + 1;
  const out = {
    at: new Date().toISOString(),
    n: picked.length,
    want: n,
    noSim: true,
    stage: 'nosim',
    scope: 'ALL',
    ids: picked.map((x) => x.id),
    items: picked,
    byPillar,
    candidatePool: cands.length,
    source: src,
    reportScope: fromRep.scope,
    note: 'Random ' + picked.length + ' needing fix · no sims · across pillars (' + src + ')',
  };
  try { fs.mkdirSync(SIM, { recursive: true }); } catch (e) {}
  fs.writeFileSync(PICK_F, JSON.stringify(out, null, 2));
  return out;
}

module.exports = { runPick, PICK_F, N };
if (require.main === module) {
  (async () => {
    let store = null;
    try {
      for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
        const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
      const { getStore } = require('@netlify/blobs');
      store = getStore({
        name: 'pulse-machine-library',
        siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
        token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
      });
    } catch (e) {}
    const r = await runPick(process.argv[2] || N, store);
    console.log(JSON.stringify({ ok: true, n: r.n, byPillar: r.byPillar, source: r.source, ids: r.ids.slice(0, 10), pool: r.candidatePool }, null, 2));
  })().catch((e) => { console.error(e); process.exit(1); });
}
