// _v2_redbox_supervisor.js — RED BOX → SEO ENGINE auto-handoff (4444)
// Phase RED:    3 DS needs-review + 2 DDG (nr) + 2 DS dual-audit (red-box queue only)
// Phase ENGINE: 3 DS _v2_components + 2 DDG (img lanes 1+2) + 2 DS dual-audit (all approved→final)
// Stop: _v2_redbox_supervisor_stop.flag
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_v2_redbox_supervisor_stop.flag';
const NR = WD + '/_v2_needs_review.json';
const QUEUE = WD + '/_v2_redbox_audit_queue.json';
const DUAL = WD + '/_v2_redbox_dual.json';
const COMPLETE = WD + '/_v2_redbox_complete.flag';
const PHASE = WD + '/_v2_crew_phase.json';
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(WD + '/_v2_redbox_supervisor.out.log', line + '\n'); } catch (e) {} if (process.stdout.isTTY) console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const readPhase = () => { try { return JSON.parse(fs.readFileSync(PHASE, 'utf8')).phase || 'red'; } catch (e) { return fs.existsSync(COMPLETE) ? 'engine' : 'red'; } };
const writePhase = p => { fs.writeFileSync(PHASE, JSON.stringify({ phase: p, at: new Date().toISOString() }, null, 2)); };

function countAlive(match) {
  try {
    const o = execSync(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | Measure-Object).Count"`, { encoding: 'utf8', windowsHide: true });
    return parseInt(o.trim(), 10) || 0;
  } catch (e) { return 0; }
}
function killMatch(match) {
  try {
    execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`, { windowsHide: true });
  } catch (e) {}
}
function RemoveStop(f) { try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (e) {} }

function redBoxEmpty() {
  let dualPending = 0;
  try { dualPending = Object.keys(JSON.parse(fs.readFileSync(DUAL, 'utf8'))).length; } catch (e) {}
  return readArr(NR).length === 0 && readArr(QUEUE).length === 0 && dualPending === 0;
}

function launchNr() {
  RemoveStop(WD + '/_v2_needs_review_stop.flag');
  const out = fs.openSync(WD + '/_v2_needs_review.out.log', 'a');
  const env = Object.assign({}, process.env, { NR_DS_CONC: '3', NR_PACE_MS: '200', V2C_MIN_SCORE: '12', V2C_CRO: '1', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_needs_review.js', 'v2needsreview'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[redsup] launched 3× DS red-box fixer pid ${p.pid}`);
}
function launchNrDdg(lane) {
  RemoveStop(WD + '/_v2_nr_ddg_stop.flag');
  const out = fs.openSync(WD + '/_v2_nr_ddg.out.log', 'a');
  const env = Object.assign({}, process.env, { NR_DDG_LANE: String(lane), NR_DDG_LANES: '2' });
  const p = spawn('node', ['_v2_nr_ddg.js', `imgnr${lane}`], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[redsup] launched DDG nr lane ${lane} pid ${p.pid}`);
}
function launchImgLane(lane) {
  const tag = `imglane${lane}`;
  const out = fs.openSync(WD + '/_img_3lane.out.log', 'a');
  const env = Object.assign({}, process.env, { LANE: String(lane) });
  const p = spawn('node', ['_img_3lane.js', tag], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[redsup] launched SEO DDG ${tag} pid ${p.pid}`);
}
function launchEngine() {
  RemoveStop(WD + '/_v2_components_stop.flag');
  try { fs.unlinkSync(WD + '/_v2_components_stop.flag'); } catch (e) {}
  const out = fs.openSync(WD + '/_v2_components.out.log', 'a');
  const env = Object.assign({}, process.env, {
    V2C_DS_CONC: '3', V2C_CC_CONC: '0', V2C_MIN_SCORE: '12', V2C_CRO: '1', V2C_WINDOW: '400', DS_DAILY_CAP: '1000000',
  });
  const p = spawn('node', ['_v2_components.js'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[redsup] launched 3× DS SEO engine _v2_components.js pid ${p.pid}`);
}
function launchDual() {
  RemoveStop(WD + '/_v2_nr_dual_gate_stop.flag');
  const out = fs.openSync(WD + '/_v2_nr_dual_gate.out.log', 'a');
  const env = Object.assign({}, process.env, { RED_DUAL_CONC: '6', RED_DUAL_PACE_MS: '0', FINAL_PASS_SCORE: '12', V2C_MIN_SCORE: '12', DS_DAILY_CAP: '1000000' });
  const p = spawn('node', ['_v2_nr_dual_gate.js', 'reddualgate'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env });
  p.unref();
  logln(`[redsup] launched 2× DS dual auditors pid ${p.pid}`);
}
function launchSpotWatch() {
  RemoveStop(WD + '/_v2_spotcheck_watch_stop.flag');
  const out = fs.openSync(WD + '/_v2_spotcheck_watch.out.log', 'a');
  const p = spawn('node', ['_v2_spotcheck_watch.js', 'spotwatch'], { cwd: WD, detached: true, stdio: ['ignore', out, out], windowsHide: true, env: process.env });
  p.unref();
  logln(`[redsup] launched post-publish spot-check watcher pid ${p.pid}`);
}

function ensureRed() {
  let ok = true;
  if (countAlive('v2needsreview') < 1) { launchNr(); ok = false; }
  for (const lane of [1, 2]) { if (countAlive(`imgnr${lane}`) < 1) { launchNrDdg(lane); ok = false; } }
  if (countAlive('reddualgate') < 1) { launchDual(); ok = false; }
  if (countAlive('spotwatch') < 1) { launchSpotWatch(); ok = false; }
  killMatch('_v2_components|_chain_run|v2finalgate|imglane[12]');
  for (const f of ['_v2_components_stop.flag', '_chain_stop.flag', '_v2_final_gate_stop.flag']) {
    try { fs.writeFileSync(WD + '/' + f, ''); } catch (e) {}
  }
  return ok;
}

function ensureEngine() {
  let ok = true;
  killMatch('v2needsreview|imgnr[12]');
  try { fs.writeFileSync(WD + '/_v2_needs_review_stop.flag', ''); } catch (e) {}
  if (countAlive('_v2_components') < 1) { launchEngine(); ok = false; }
  for (const lane of [1, 2]) { if (countAlive(`imglane${lane}`) < 1) { launchImgLane(lane); ok = false; } }
  if (countAlive('reddualgate') < 1) { launchDual(); ok = false; }
  if (countAlive('spotwatch') < 1) { launchSpotWatch(); ok = false; }
  killMatch('_v2_final_gate|v2finalgate|_chain_run');
  RemoveStop(WD + '/_v2_components_stop.flag');
  RemoveStop(WD + '/_v2_final_gate_stop.flag');
  return ok;
}

function engineRemaining() {
  try {
    const c = JSON.parse(fs.readFileSync(WD + '/_seo_audit/content.json', 'utf8'));
    if (c.remaining != null) return { remaining: c.remaining, catalogTotal: c.catalogTotal, approved: c.approved };
  } catch (e) {}
  const approved = readArr(WD + '/_v2_approved.json').length;
  return { remaining: null, catalogTotal: null, approved };
}

async function syncSeo(phase) {
  try {
    const env = Object.assign({}, process.env, { CREW_PHASE: phase });
    spawn('node', ['_v2_sync_seo_review.js'], { cwd: WD, stdio: 'ignore', windowsHide: true, detached: true, env }).unref();
  } catch (e) {}
  logln(`[redsup] SEO monitor sync (${phase})`);
}

function doHandoff() {
  const { remaining, catalogTotal, approved } = engineRemaining();
  const remStr = remaining != null ? `${remaining.toLocaleString()} URLs remaining (${approved.toLocaleString()}/${catalogTotal.toLocaleString()} perfected)` : 'remaining URLs';
  logln(`[redsup] ✅ RED BOX EMPTY — handoff → SEO PERFECTION ENGINE`);
  logln(`[redsup] Resuming site-wide perfection engine — ${remStr}`);
  fs.writeFileSync(COMPLETE, new Date().toISOString());
  writePhase('engine');
  killMatch('v2needsreview|imgnr[12]');
  try { fs.writeFileSync(WD + '/_v2_needs_review_stop.flag', ''); } catch (e) {}
  RemoveStop(WD + '/_v2_components_stop.flag');
  RemoveStop(WD + '/_v2_final_gate_stop.flag');
  launchEngine();
  launchImgLane(1);
  launchImgLane(2);
  launchDual();
  launchSpotWatch();
  syncSeo('engine');
}

(async () => {
  let phase = readPhase();
  if (fs.existsSync(COMPLETE)) phase = 'engine';
  if (!fs.existsSync(PHASE) && !fs.existsSync(COMPLETE)) writePhase('red');
  logln(`[redsup] supervisor up — phase=${phase} (${phase === 'engine' ? '3 DS engine + 2 DDG imglane + 2 DS dual-audit' : '3 DS fix + 2 DDG + 2 DS dual-audit'})`);
  RemoveStop(STOP);
  let emptyStreak = 0;
  if (phase === 'engine') {
    ensureEngine();
  } else {
    ensureRed();
  }
  while (!fs.existsSync(STOP)) {
    phase = readPhase();
    if (phase === 'red') {
      if (!ensureRed()) { await sleep(8000); continue; }
      if (redBoxEmpty()) {
        emptyStreak++;
        logln(`[redsup] red box empty streak ${emptyStreak}/2`);
        if (emptyStreak >= 2) { doHandoff(); phase = 'engine'; emptyStreak = 0; }
      } else {
        emptyStreak = 0;
        const nr = readArr(NR).length;
        if (nr % 100 === 0 || nr < 50) logln(`[redsup] red box remaining: ${nr} needs-review · ${readArr(QUEUE).length} audit queue`);
      }
    } else {
      emptyStreak = 0;
      if (!ensureEngine()) await sleep(8000);
      const ap = readArr(WD + '/_v2_approved.json').length;
      const fin = readArr(WD + '/_v2_cc_approved.json').length;
      logln(`[redsup] ENGINE mode — stage-1 ${ap} · publish-ready ${fin} · awaiting dual ${Math.max(0, ap - fin)}`);
    }
    syncSeo(phase);
    await sleep(90000);
  }
  logln('[redsup] stop flag — exiting');
})().catch(e => { logln('[redsup] FATAL ' + e.message); process.exit(1); });
