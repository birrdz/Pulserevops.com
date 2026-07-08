// _v2_supervisor.js — SEO SPIDER FIXER supervisor (4444 2026-06-30).
// FIX-ONLY mode when _v2_components_stop.flag exists: needs-review + imgnr1 only (no engine, no final gate, no imglane2).
// Full mode: _v2_components.js (2 DS engine) + _v2_needs_review.js (1 DS) + _v2_nr_ddg.js×1 + DDG LANE=2 + DS final gate.
//   knobs: V2C_DS_CONC=2, NR_DS_CONC=1, NR_DDG_LANES=1, V2C_WINDOW=400, V2C_CRO=1, FINAL_DS_CONC=2
//   stop: _v2_supervisor_stop.flag · log: _v2_supervisor.out.log
//   CC auditor (_v2_auditor.js) stays OFF while _v2_auditor_stop.flag exists — final gate replaces it.
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_v2_supervisor_stop.flag';
const FIXLOG = WD + '/_v2_components.out.log';
const V2C_WINDOW = process.env.V2C_WINDOW || '400';
const V2C_CC_CONC = process.env.V2C_CC_CONC || '0';
const V2C_DS_CONC = process.env.V2C_DS_CONC || '2';
const NR_DS_CONC = process.env.NR_DS_CONC || '1';
const NR_DDG_LANES = process.env.NR_DDG_LANES || '1';
const V2C_CRO = process.env.V2C_CRO || '1';
const FINAL_DS_CONC = process.env.FINAL_DS_CONC || '2';
const CC_AUDIT_CONC = process.env.CC_AUDIT_CONC || '2';
const AUDITLOG = WD + '/_v2_auditor.out.log';
const FINALLOG = WD + '/_v2_final_gate.out.log';
const NRLOG = WD + '/_v2_needs_review.out.log';
const NRDDGLOG = WD + '/_v2_nr_ddg.out.log';
const CC_DOWN = () => fs.existsSync(WD + '/_v2_auditor_stop.flag');
const FIX_ONLY = () => fs.existsSync(WD + '/_v2_components_stop.flag');
const CREW_LABEL = FIX_ONLY()
  ? `${NR_DS_CONC}x DS needs-review + ${NR_DDG_LANES}x DDG needs-review [FIX-ONLY]`
  : `${V2C_DS_CONC}x DS engine + ${NR_DS_CONC}x DS needs-review + ${NR_DDG_LANES}x DDG needs-review + 1 DDG engine + ${CC_DOWN() ? FINAL_DS_CONC + 'x DS-final' : CC_AUDIT_CONC + 'x CC-audit'}`;
const STALL_CHECKS = parseInt(process.env.STALL_CHECKS || '10', 10);
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(WD + '/_v2_supervisor.out.log', line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function countAlive(match) { try { const o = execSync(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | Measure-Object).Count"`, { encoding: 'utf8', windowsHide: true }); return parseInt(o.trim(), 10) || 0; } catch (e) { return 0; } }
function killDdgLane2() { try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match 'imglane2' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true }); } catch (e) {} }
function ensureDdg() {
  if (FIX_ONLY()) {
    if (countAlive('imglane2') >= 1) { killDdgLane2(); logln('[v2sup] FIX-ONLY — killed imglane2'); }
    return true;
  }
  const n = countAlive('imglane2');
  if (n > 1) { logln(`[v2sup] SEO DDG duplicate (${n}) — killing all LANE 2, relaunching 1`); killDdgLane2(); launchDdg(); return false; }
  if (n < 1) { logln('[v2sup] SEO DDG down — launching LANE 2'); launchDdg(); return false; }
  return true;
}
function ensureFixer() {
  if (FIX_ONLY()) {
    if (countAlive('_v2_components') >= 1) { killFixer(); logln('[v2sup] FIX-ONLY — killed stray _v2_components'); }
    return true;
  }
  if (countAlive('_v2_components') < 1) { logln('[v2sup] fixer down — launching'); launchFixer(); return false; }
  return true;
}
function killFixer() { try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '_v2_components' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true }); } catch (e) {} }
function fixCount() { try { return (fs.readFileSync(FIXLOG, 'utf8').match(/✅ STAGE-1/g) || []).length; } catch (e) { return 0; } }
function ensureNeedsReview() {
  if (countAlive('v2needsreview') < 1) { logln('[v2sup] needs-review DS lane down — launching'); launchNeedsReview(); return false; }
  return true;
}
function launchNeedsReview() {
  const out = fs.openSync(NRLOG, 'a');
  const env = Object.assign({}, process.env, { NR_DS_CONC, V2C_MIN_SCORE: process.env.V2C_MIN_SCORE || '12', V2C_CRO: '1', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_needs_review.js', 'v2needsreview'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched needs-review lane _v2_needs_review.js (${NR_DS_CONC}x DeepSeek) pid ${p.pid}`);
}
function ensureNrDdg(lane) {
  if (FIX_ONLY() && lane > 1) return true;
  const tag = `imgnr${lane}`;
  if (countAlive(tag) < 1) { logln(`[v2sup] needs-review DDG lane ${lane} down — launching`); launchNrDdg(lane); return false; }
  return true;
}
function launchNrDdg(lane) {
  const out = fs.openSync(NRDDGLOG, 'a');
  const env = Object.assign({}, process.env, { NR_DDG_LANE: String(lane), NR_DDG_LANES });
  const p = spawn('node', ['_v2_nr_ddg.js', `imgnr${lane}`], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched needs-review DDG _v2_nr_ddg.js LANE=${lane} pid ${p.pid}`);
}
function killNrDdg() { try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match 'imgnr[12]' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true }); } catch (e) {} }
function launchFixer() {
  const out = fs.openSync(FIXLOG, 'a');
  const env = Object.assign({}, process.env, { V2C_WINDOW, V2C_CC_CONC, V2C_DS_CONC, V2C_CRO, V2C_MIN_SCORE: process.env.V2C_MIN_SCORE || '12', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_components.js'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched SEO fixer _v2_components.js (${CREW_LABEL}, window ${V2C_WINDOW}, CRO=${V2C_CRO}) pid ${p.pid}`);
}
function killAuditor() { try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '_v2_auditor' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true }); } catch (e) {} }
function ensureAuditor() {
  if (FIX_ONLY()) {
    if (countAlive('_v2_auditor') >= 1) { killAuditor(); logln('[v2sup] FIX-ONLY — killed CC auditor'); }
    if (countAlive('v2finalgate') >= 1) { killFinalGate(); logln('[v2sup] FIX-ONLY — killed DS final gate'); }
    return true;
  }
  if (CC_DOWN()) {
    if (countAlive('_v2_auditor') >= 1) { killAuditor(); logln('[v2sup] CC auditor stop flag ON — killed stray _v2_auditor'); }
    return ensureFinalGate();
  }
  if (countAlive('_v2_auditor') < 1) { logln('[v2sup] CC auditor down — launching'); launchAuditor(); return false; }
  return true;
}
function launchAuditor() {
  const out = fs.openSync(AUDITLOG, 'a');
  const env = Object.assign({}, process.env, { CC_AUDIT_CONC, CC_PASS_SCORE: process.env.CC_PASS_SCORE || '12', V2C_MIN_SCORE: process.env.V2C_MIN_SCORE || '12', V2C_CRO: '1', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_auditor.js'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched CC Stage-2 auditor _v2_auditor.js (${CC_AUDIT_CONC}x CC, pass@12/13) pid ${p.pid}`);
}
function killFinalGate() { try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match 'v2finalgate|_v2_final_gate' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true }); } catch (e) {} }
function ensureFinalGate() {
  if (fs.existsSync(WD + '/_v2_final_gate_stop.flag')) return true;
  const n = countAlive('v2finalgate');
  if (n > 1) { logln(`[v2sup] final gate duplicate (${n}) — killing all, relaunching 1`); killFinalGate(); launchFinalGate(); return false; }
  if (n < 1) { logln('[v2sup] DS final gate down — launching'); launchFinalGate(); return false; }
  return true;
}
function launchFinalGate() {
  const out = fs.openSync(FINALLOG, 'a');
  const env = Object.assign({}, process.env, { FINAL_DS_CONC, FINAL_PASS_SCORE: process.env.FINAL_PASS_SCORE || process.env.CC_PASS_SCORE || '12', V2C_MIN_SCORE: process.env.V2C_MIN_SCORE || '12', V2C_CRO: '1', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_final_gate.js', 'v2finalgate'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched DS Stage-2 final gate _v2_final_gate.js (${FINAL_DS_CONC}x DS, pass@12/13) pid ${p.pid}`);
}
function launchDdg() {
  const out = fs.openSync(WD + '/_img_3lane.out.log', 'a');
  const env = Object.assign({}, process.env, { LANE: '2' });
  const p = spawn('node', ['_img_3lane.js', 'imglane2'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[v2sup] launched SEO DDG _img_3lane.js LANE=2 pid ${p.pid}`);
}
(async () => {
  logln(`[v2sup] SEO spider fixer supervisor up — ${CREW_LABEL} (stall ~${STALL_CHECKS * 1.5}min)${FIX_ONLY() ? ' [FIX-ONLY]' : CC_DOWN() ? ' [CC OFF → DS final gate]' : ''}`);
  if (fs.existsSync(WD + '/_v2_auditor_stop.flag')) killAuditor();
  if (FIX_ONLY()) { killFixer(); killFinalGate(); killDdgLane2(); killNrDdg(); }
  if (!FIX_ONLY()) ensureFixer();
  ensureNeedsReview();
  for (let lane = 1; lane <= (FIX_ONLY() ? 1 : parseInt(NR_DDG_LANES, 10)); lane++) ensureNrDdg(lane);
  ensureAuditor();
  if (!FIX_ONLY() && ensureDdg()) logln('[v2sup] SEO DDG LANE 2 already up (imglane2)');
  let lastCount = -1, flat = 0;
  while (!fs.existsSync(STOP)) {
    if (!FIX_ONLY() && !ensureFixer()) { lastCount = -1; flat = 0; await sleep(8000); }
    if (!ensureNeedsReview()) await sleep(8000);
    for (let lane = 1; lane <= (FIX_ONLY() ? 1 : parseInt(NR_DDG_LANES, 10)); lane++) { if (!ensureNrDdg(lane)) await sleep(4000); }
    if (!ensureAuditor()) await sleep(8000);
    if (!FIX_ONLY() && !ensureDdg()) await sleep(8000);
    if (!FIX_ONLY()) {
      const c = fixCount();
      if (c === lastCount) flat++; else { flat = 0; lastCount = c; }
      if (flat >= STALL_CHECKS && countAlive('_v2_components') >= 1) {
        logln(`[v2sup] STALLED — no new ✅ STAGE-1 in ~${STALL_CHECKS * 1.5}min (count ${c}); killing + relaunching fixer`);
        killFixer(); await sleep(3000); launchFixer(); lastCount = -1; flat = 0;
      }
    }
    await sleep(90000);
  }
  logln('[v2sup] stop flag — exiting');
})().catch(e => { logln('[v2sup] FATAL ' + (e && e.message)); process.exit(1); });
