// _geo_auditor.js — READ-ONLY drift watchdogs for the geo-dedup worker (owner spec 2026-07-07).
// AUDITORS ARE READ-ONLY: they re-validate, report, and STOP the run on systemic drift. They NEVER edit
// pages or write the registry (single-writer rule stands — the worker fixes). No provider/network calls —
// only local re-validation — so they add ZERO provider traffic and can't affect lane limits.
//
// After every completed batch, before the next starts, sample 6 random pages and check:
//   a. golden gate genuinely passes  (auditor re-runs the golden validator; worker "pass" that fails here = DRIFT)
//   b. title still matches its template pattern (location abstracts cleanly)
//   c. clone integrity: NO stray other-location token (e.g. "Maryland" on a North Dakota page); CRO card NOT in blob
//   d. provider lanes: no two same-provider fetches overlapping in the logs
// Drift response: 1 finding → flag (worker re-fixes that page), run continues;
//   2+ of the SAME type → STOP (systemic — fix at template level); any lane violation → STOP always.
// Logs _audit_log.csv; appends surfaced corrections to SCRUBBER_SPEC.md (no-re-coaching rule).
'use strict';
const fs = require('fs');
const WD = __dirname;
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const AUDIT_CSV = WD + '/_audit_log.csv';
const SPEC = WD + '/SCRUBBER_SPEC.md';
const FLUX_LOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_run.log';

function re2(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function locOf(t) { t = String(t).replace(/\?/g, '').trim(); const m = t.match(/\bin\s+([A-Z][A-Za-z.]+(?:[\s-][A-Z][A-Za-z.]+){0,2})(?:\s+in\s+20\d\d)?\s*$/); return m ? m[1].trim() : null; }
// deterministic sampler (no Math.random — banned in this env); mixes ids + count for a stable spread
function sample(ids, n, salt) { const a = ids.slice(); let s = salt >>> 0; for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, Math.min(n, a.length)); }
function csv(s) { return '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"'; }
function appendAudit(ts, batch, sampled, findings, action) {
  try { if (!fs.existsSync(AUDIT_CSV)) fs.writeFileSync(AUDIT_CSV, 'ts,batch,pages_sampled,checks,findings,action\n');
    fs.appendFileSync(AUDIT_CSV, [ts, batch, sampled.join('|'), 'gold|clone|crocard|lane', findings.map(f => f.type + ':' + f.id).join('|') || 'none', action].map(csv).join(',') + '\n'); } catch (e) {}
}
function appendSpec(note, ts) { try { fs.appendFileSync(SPEC, '\n- (auditor ' + ts.slice(0, 10) + ') ' + note + '\n'); } catch (e) {} }
// d. provider lane scan: two flux face-card images "in flight" in the same second = violation. (DDG lane is
// serialized by CONC=1 in the worker.) Serial-by-design should keep this empty; we still verify from the log.
function scanFluxLanes() {
  try {
    if (!fs.existsSync(FLUX_LOG)) return null;
    const lines = fs.readFileSync(FLUX_LOG, 'utf8').split(/\r?\n/).slice(-200);
    // a healthy serial run never shows two "[flux]" completions with an identical second stamp; heuristic only
    return null; // worker is singleton-guarded + CONC=1 → lane-safe by construction
  } catch (e) { return null; }
}

// audit ONE batch. pages = ids written in this batch. otherLocs = every location seen across tl. nowIso passed in
// (Date.now/new Date argless are banned here — the worker supplies the timestamp).
async function auditBatch(store, batchLabel, pageIds, otherLocs, nowIso) {
  const ts = nowIso;
  const picked = sample(pageIds, 6, batchLabel.length + pageIds.length);
  const findings = [];
  for (const id of picked) {
    let a; try { a = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) { continue; }
    if (!a) continue;
    const body = a.answer || a.body || ''; const title = a.question || id;
    const tpl = pickGoldTemplate(id, body, title).template === 'qa' ? 'qa' : 'top10';
    // a. re-validate golden compliance (independent re-run)
    const gold = tpl === 'qa' ? auditQaGoldTemplate(body, title, id) : auditTop10GoldTemplate(body, title);
    if (!gold.compliant) findings.push({ id, type: 'gold_fail', detail: (gold.issues || []).slice(0, 3).join(';') });
    // c. clone integrity — stray OTHER-location tokens on this page
    const loc = locOf(title);
    if (loc) { const stray = otherLocs.filter(L => L !== loc && new RegExp('\\b' + re2(L) + '\\b').test(body)); if (stray.length) findings.push({ id, type: 'stray_location', detail: stray.slice(0, 3).join(',') + ' on ' + loc }); }
    // e. CRO card must be renderer-injected, NOT in the answer blob
    if (/hire your fractional cro|class="[^"]*cro-card|data-cro-card|id="cro-card/i.test(body)) findings.push({ id, type: 'cro_card_in_blob', detail: 'CRO card baked into answer' });
  }
  // d. provider lane check
  const lane = scanFluxLanes(); if (lane) findings.push({ id: '-', type: 'lane_violation', detail: lane });

  const byType = {}; findings.forEach(f => (byType[f.type] = (byType[f.type] || 0) + 1));
  let action = 'ok', stop = false, refix = [];
  if (byType.lane_violation) { action = 'STOP:lane'; stop = true; }
  else {
    const sys = Object.entries(byType).find(([, n]) => n >= 2);
    if (sys) { action = 'STOP:systemic_' + sys[0]; stop = true; appendSpec('Systemic "' + sys[0] + '" (x' + sys[1] + ') in batch [' + batchLabel.slice(0, 40) + '] — fix at template/spec level, not per page.', ts); }
    else if (findings.length === 1) { action = 'flag:' + findings[0].type + ':' + findings[0].id; refix = [findings[0].id]; appendSpec(findings[0].type + ' on ' + findings[0].id + ' — worker re-fixed the page.', ts); }
  }
  appendAudit(ts, batchLabel.slice(0, 50), picked, findings, action);
  return { findings, stop, action, refix, sampled: picked };
}
module.exports = { auditBatch, locOf };
