// _perf_meter.js — timing, awareness + self-learning bottleneck optimizer (owner 2026-07-06).
// Measures how long each activity takes (face card vs Q&A fix + its sub-steps vs idle/overhead),
// keeps rolling stats, finds the current bottleneck, and hill-climbs fix-concurrency to raise
// throughput. Persists to _perf_stats.json and renders a live dashboard at _perf_dashboard.html.
'use strict';
const fs = require('fs');
const WD = __dirname;
const STATS_F = WD + '/_perf_stats.json';
const TELEM_F = WD + '/_perf_telemetry.jsonl';
const DASH_F = WD + '/assets/_perf_dashboard.html';
const WIN = 40;                 // rolling-sample window per activity
const MAX_K = 4;                // hard cap on concurrent fixes (protects index + DeepSeek)
const TRY_EVERY = 8;            // fixes between concurrency experiments
const IMPROVE = 0.08;           // need +8% throughput to keep a higher concurrency

function nowMs() { return Date.now(); }
function load() {
  try { return JSON.parse(fs.readFileSync(STATS_F, 'utf8')); } catch (e) { return null; }
}
let S = load() || {
  startedAt: new Date().toISOString(),
  samples: {},          // kind -> [ms,...] rolling
  totals: {},           // kind -> {n, sumMs}
  byK: {},              // concurrency K -> {fixes, sumMs}  (throughput learning)
  k: 1,                 // current chosen fix concurrency
  kSinceTry: 0,
  kBest: 1,
  fixes: 0, cards: 0, cycles: 0,
};

function save() { try { fs.writeFileSync(STATS_F, JSON.stringify(S)); } catch (e) {} }

// record a duration sample for an activity kind (e.g. 'card','fix','rebuild','save','check','idle')
function record(kind, ms, meta) {
  const arr = (S.samples[kind] = S.samples[kind] || []);
  arr.push(ms); if (arr.length > WIN) arr.shift();
  const t = (S.totals[kind] = S.totals[kind] || { n: 0, sumMs: 0 });
  t.n++; t.sumMs += ms;
  try { fs.appendFileSync(TELEM_F, JSON.stringify(Object.assign({ kind, ms, at: nowMs() }, meta || {})) + '\n'); } catch (e) {}
  save();
}
const avg = kind => { const a = S.samples[kind] || []; return a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0; };
const lifeAvg = kind => { const t = S.totals[kind]; return t && t.n ? Math.round(t.sumMs / t.n) : 0; };

// A simple timer: const t = meter.start(); ... const ms = t.stop('fix');
function start() { const t0 = nowMs(); return { stop(kind, meta) { const ms = nowMs() - t0; record(kind, ms, meta); return ms; }, peek() { return nowMs() - t0; } }; }

// Learn throughput per concurrency level. Call once per completed fix-batch.
function batchDone(k, fixCount, wallMs) {
  const b = (S.byK[k] = S.byK[k] || { fixes: 0, sumMs: 0 });
  b.fixes += fixCount; b.sumMs += wallMs;
  S.fixes += fixCount; S.cycles++; S.kSinceTry += fixCount;
  save();
}
function fixesPerHr(k) { const b = S.byK[k]; return b && b.sumMs ? (b.fixes / (b.sumMs / 3600000)) : 0; }

// Self-learning hill-climb: decide the fix concurrency for the next batch.
function nextK() {
  const cur = S.k;
  const curTh = fixesPerHr(cur);
  // not enough data on current level yet → keep measuring
  if (S.kSinceTry < TRY_EVERY) return cur;
  S.kSinceTry = 0;
  const up = cur + 1;
  if (up <= MAX_K && (!S.byK[up] || (S.byK[up].fixes < 6))) { S.k = up; save(); return up; } // explore next level
  // both cur and up have data → keep the better, lock toward best
  const upTh = fixesPerHr(up);
  if (up <= MAX_K && upTh > curTh * (1 + IMPROVE)) { S.k = up; S.kBest = up; }
  else { S.k = S.kBest = curTh >= fixesPerHr(S.kBest) ? cur : S.kBest; } // fall back to best proven level
  save();
  return S.k;
}

function bottleneck() {
  const parts = { card: avg('card'), rebuild: avg('rebuild'), save: avg('save'), check: avg('check'), idle: avg('idle') };
  let top = 'fix', max = 0;
  for (const k of ['rebuild', 'save', 'check', 'card', 'idle']) if (parts[k] > max) { max = parts[k]; top = k; }
  return { top, parts };
}

function snapshot() {
  const bn = bottleneck();
  return {
    startedAt: S.startedAt, cycles: S.cycles, fixes: S.fixes, cards: S.cards,
    k: S.k, kBest: S.kBest,
    card: avg('card'), fix: avg('fix'), rebuild: avg('rebuild'), save: avg('save'), check: avg('check'), idle: avg('idle'),
    fixesPerHr: Math.round(fixesPerHr(S.k) || fixesPerHr(S.kBest)),
    bottleneck: bn.top, parts: bn.parts,
    byK: Object.fromEntries(Object.keys(S.byK).map(k => [k, Math.round(fixesPerHr(k))])),
  };
}

function incCards(n) { S.cards += (n || 1); save(); }

function fmtMs(ms) { return ms >= 1000 ? (ms / 1000).toFixed(1) + 's' : ms + 'ms'; }

function dashboardHtml() {
  const s = snapshot();
  const row = (label, v, hint) => '<tr><td>' + label + '</td><td class="n">' + v + '</td><td class="h">' + (hint || '') + '</td></tr>';
  const kRows = Object.entries(s.byK).map(([k, th]) => '<tr><td>K=' + k + (String(k) === String(s.k) ? ' ◀ current' : '') + '</td><td class="n">' + th + '/hr</td><td class="h"></td></tr>').join('');
  return '<title>PULSE Engine — Performance</title>' +
    '<style>:root{color-scheme:dark}body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#14120e;color:#f4ecd8;margin:0;padding:28px;max-width:760px}' +
    'h1{font-family:Georgia,serif;color:#EAC15C;font-size:1.7rem;margin:0 0 4px}.sub{color:#9c8f76;font-size:.85rem;margin:0 0 20px}' +
    'table{width:100%;border-collapse:collapse;margin:14px 0}td{padding:9px 10px;border-bottom:1px solid #2a2417}td.n{text-align:right;font-variant-numeric:tabular-nums;font-weight:700;color:#FFEB3B;white-space:nowrap}td.h{color:#8a7d64;font-size:.8rem}' +
    'h2{color:#EAC15C;font-size:1rem;margin:22px 0 2px;text-transform:uppercase;letter-spacing:.08em}.big{font-size:2.1rem;color:#7ee0a1;font-weight:800}.bn{color:#ff9a6b;font-weight:800}</style>' +
    '<h1>⚡ Engine Performance — self-learning</h1><p class="sub">started ' + s.startedAt + ' · ' + s.cycles + ' cycles · ' + s.fixes + ' fixes · ' + s.cards + ' covers</p>' +
    '<div class="big">' + s.fixesPerHr + ' fixes/hr</div>' +
    '<p class="sub">current bottleneck: <span class="bn">' + s.bottleneck + '</span> · fix concurrency <b>K=' + s.k + '</b> (best proven K=' + s.kBest + ')</p>' +
    '<h2>Activity timing (rolling avg)</h2><table>' +
    row('Q&A fix (total)', fmtMs(s.fix), 'end-to-end per entry') +
    row('&nbsp;&nbsp;↳ rebuild', fmtMs(s.rebuild), 'template + image-ensure (usual bottleneck)') +
    row('&nbsp;&nbsp;↳ save', fmtMs(s.save), 'blob write') +
    row('&nbsp;&nbsp;↳ grade check', fmtMs(s.check), '13/13 audit') +
    row('Face card', fmtMs(s.card), 'overlapped with the fix — off critical path') +
    row('Idle / overhead', fmtMs(s.idle), 'waiting / cooldown') +
    '</table><h2>Concurrency learning (throughput by K)</h2><table>' + (kRows || '<tr><td colspan=3 class="h">gathering samples…</td></tr>') + '</table>' +
    '<p class="sub">Auto-tuning: the engine raises K while throughput climbs ≥8%, then locks to the best proven level.</p>';
}

function writeDashboard() { try { fs.mkdirSync(WD + '/assets', { recursive: true }); fs.writeFileSync(DASH_F, dashboardHtml()); } catch (e) {} }

module.exports = { start, record, batchDone, nextK, snapshot, bottleneck, incCards, dashboardHtml, writeDashboard, fmtMs, get K() { return S.k; }, MAX_K };
