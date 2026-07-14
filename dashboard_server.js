// dashboard_server.js — MERGED PULSE CONTROL PANEL (localhost:8904, LAN, phone-first).
// ONE server, ONE page, ONE URL. Two panels:
//   • FIX MACHINE  — the existing scan→fix→verify car-wash (RUN REPORT / GO / STOP / CLEAR / FORCE STOP), preserved intact.
//   • GENERATOR    — gen_daemon.js controls (rate, topics, runHours, start/stop, deployEveryHours) + live status.
//     UI: START = unpause + run a batch now (--once) for runHours; STOP = park the hourly daemon (config.paused=true).
// Both read gen/config.json HOT (single source of truth). Every knob shows its current value with a tap control that
// writes config.json — the daemon/fix machine re-read it at the top of every cycle (no restarts). The daemon NEVER
// raises its own rate; only this panel can.
// Rebuilt from the clean twin (correct glyphs); retires the 8903 twin + the mojibake 8904 cursor server.
'use strict';
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const PORT = parseInt(process.env.SIM_PORT || '8904', 10);
const SCAN_SCRIPT = WD + '/sim_scan.js';
const TRANSFORM_SCRIPT = WD + '/sim_transform.js';
const SIM = WD + '/sim';
const GEN = WD + '/gen';
try { fs.mkdirSync(SIM, { recursive: true }); } catch (e) {}
try { fs.mkdirSync(GEN, { recursive: true }); } catch (e) {}
const CMD_F = SIM + '/run_command.json', STATUS_F = SIM + '/run_status.json', SUMMARY_F = SIM + '/summary.json';
const REPORT_F = SIM + '/scan_report.json', OPLOG_F = SIM + '/operator_log.md', LESSONS_F = SIM + '/LESSONS.md';
const CONFIG_F = GEN + '/config.json', GEN_STATUS_F = GEN + '/run_status.json', DAILY_F = GEN + '/daily_log.md';
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'Home & Family', sw:'Software', sk:'Skill Drills', sp:'Sports', dr:'Drills' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();
const opLog = (line) => { try { fs.appendFileSync(OPLOG_F, `- ${new Date().toISOString()} · ${line}\n`); } catch (e) {} };

// ── config (single source of truth; hot-reloaded; clamped; daemon never raises its own rate) ──
const CONFIG_DEFAULTS = { fixConcurrency: 10, fixWorkers: 1, fixScope: 'ALL', entriesPerHour: 10, perTopicPerHour: null, genTopics: 'ALL', runHours: 2, runUntil: null, paused: false, deployEveryHours: 0, pillarLap: false };
function loadConfig() {
  const raw = readJSON(CONFIG_F, {});
  const cfg = Object.assign({}, CONFIG_DEFAULTS, raw);
  // migrate away from old activeHours clock-window
  if (cfg.activeHours != null && (cfg.runHours == null || raw.runHours == null)) {
    const n = parseInt(String(cfg.activeHours).replace(/[^\d]/g, ''), 10);
    if (Number.isFinite(n) && n > 0 && n <= 168) cfg.runHours = n;
  }
  delete cfg.activeHours;
  delete cfg.maxPerHour; // retired — rate knobs are the only ceiling
  return cfg;
}
function clampNum(cfg, key, v) { const b = (cfg._bounds || {})[key]; if (!b) return v; return Math.max(b[0], Math.min(b[1], v)); }
function updateConfig(key, value) {
  const cfg = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
  delete cfg.activeHours;
  // Daily Driver owns generation — ignore custom rate / topic knobs while ON
  if (cfg.pillarLap && ['entriesPerHour', 'perTopicPerHour', 'genTopics', 'deployEveryHours'].includes(key)) {
    return loadConfig();
  }
  const numeric = ['fixConcurrency', 'entriesPerHour', 'perTopicPerHour', 'deployEveryHours', 'runHours'];
  if (key === 'paused') cfg.paused = !!value;
  else if (key === 'pillarLap') cfg.pillarLap = !!value;
  else if (key === 'runUntil') cfg.runUntil = value || null;
  else if (key === 'maxPerHour') { delete cfg.maxPerHour; writeJSON(CONFIG_F, cfg); return loadConfig(); } // retired
  else if (key === 'genTopics') {
    if (value === 'ALL' || value == null || value === '') cfg.genTopics = 'ALL';
    else if (Array.isArray(value)) {
      cfg.genTopics = value.map(t => String(t).trim().toLowerCase()).filter(t => PNAMES[t]);
    } else {
      const cleaned = String(value).split(',').map(s => s.trim().toLowerCase()).filter(t => t && PNAMES[t]);
      cfg.genTopics = cleaned.length ? cleaned : 'ALL';
    }
  }
  else if (key === 'fixScope') cfg[key] = value;
  else if (numeric.includes(key)) {
    let v = (value === null || value === '') ? null : Math.round(Number(value));
    if (v != null && !Number.isFinite(v)) return loadConfig();
    if (key === 'runHours') {
      if (v == null || v < 1) v = 1;
      v = Math.min(168, v);
    }
    if (key === 'deployEveryHours') {
      if (v == null || v < 0) v = 0; // 0 = never auto Netlify/code deploy
      v = Math.min(24, v);
    }
    if (v != null) v = clampNum(cfg, key, v);
    cfg[key] = v;
    // XOR law: exactly one of entriesPerHour / perTopicPerHour is active
    if (key === 'entriesPerHour' && v != null) cfg.perTopicPerHour = null;
    if (key === 'perTopicPerHour' && v != null) cfg.entriesPerHour = null;
  }
  writeJSON(CONFIG_F, cfg);
  const out = loadConfig();
  delete out.maxPerHour;
  return out;
}

if (!fs.existsSync(STATUS_F)) writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', scope: null });
else { const st = readJSON(STATUS_F, {}); if (st.stage && !['idle','done','scan-done','stopped'].includes(st.stage)) { writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', scope: null, note: 'Recovered from interrupted run — pick a scope and run the report.' }); opLog('RECOVERED orphaned run state on startup'); } }

// ── scope enumeration (cached) ──
let scopeCache = { at: 0, data: null };
async function scopeList() {
  if (scopeCache.data && Date.now() - scopeCache.at < 60000) return scopeCache.data;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  const byP = {}; for (const e of es) { const p = pOf(e.id); if (p) byP[p] = (byP[p] || 0) + 1; }
  const pillars = Object.keys(byP).sort((a, b) => byP[b] - byP[a]).map(p => ({ p, name: PNAMES[p] || p.toUpperCase(), n: byP[p] }));
  const data = { total: es.length, pillars }; scopeCache = { at: Date.now(), data }; return data;
}

// ── generator one-shot (START now) — separate from fix-machine child ──
let genChild = null;
function genStartNow() {
  const cfg0 = loadConfig();
  const hours = Math.max(1, Math.min(168, Number(cfg0.runHours) || 2));
  const until = new Date(Date.now() + hours * 3600000).toISOString();
  const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
  cfgFile.paused = false;
  cfgFile.runHours = hours;
  cfgFile.runUntil = until;
  delete cfgFile.activeHours;
  writeJSON(CONFIG_F, cfgFile);
  try {
    writeJSON(GEN_STATUS_F, Object.assign(readJSON(GEN_STATUS_F, {}), {
      stage: 'generating',
      currentJob: 'starting batch…',
      phase: 'starting batch…',
      note: 'START pressed — run ' + hours + 'h',
      updated: new Date().toISOString()
    }));
  } catch (e) {}
  opLog('GEN START now · run ' + hours + 'h until ' + until);
  if (genChild) return { ok: true, already: true, cfg: loadConfig() };
  try {
    // Fresh session counters for the live feed
    try {
      writeJSON(GEN_STATUS_F, Object.assign(readJSON(GEN_STATUS_F, {}), {
        sessionDone: 0, sessionPassed: 0, sessionPublished: 0,
        recentResults: [], recentJobs: [], lastResult: null,
        stage: 'generating', currentJob: 'starting…', updated: new Date().toISOString()
      }));
    } catch (e) {}
    genChild = spawn(process.execPath, [WD + '/gen_daemon.js', '--once'], { cwd: WD, env: process.env, stdio: 'ignore' });
    genChild.on('close', () => { genChild = null; });
    genChild.on('error', () => { genChild = null; });
  } catch (e) { genChild = null; opLog('GEN START failed: ' + (e && e.message)); }
  return { ok: true, cfg: loadConfig(), runningOnce: !!genChild };
}
function genStop() {
  const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
  cfgFile.paused = true;
  cfgFile.runUntil = null;
  delete cfgFile.activeHours;
  writeJSON(CONFIG_F, cfgFile);
  opLog('GEN STOP');
  if (genChild) {
    try { genChild.kill(); } catch (e) {}
    genChild = null;
  }
  try {
    const st = readJSON(GEN_STATUS_F, {});
    writeJSON(GEN_STATUS_F, Object.assign({}, st, { stage: 'stopped', currentJob: null, note: 'stopped from panel', updated: new Date().toISOString() }));
  } catch (e) {}
  return { ok: true, cfg: loadConfig() };
}

// ── fix-machine run engine (STOP/FORCE STOP must NEVER touch Daily Driver / genChild) ──
let child = null, running = false, stopRequested = false;
function setStatus(o) { writeJSON(STATUS_F, Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() })); }
/** Kill only the fix-machine child. Never genChild, never config.paused. */
function killFixChild(hard) {
  if (!child) return;
  try {
    if (hard) child.kill('SIGKILL');
    else child.kill();
  } catch (e) {}
  child = null;
}
function runStage(script, args, envExtra) {
  return new Promise((resolve) => {
    child = spawn(process.execPath, [script].concat(args), { cwd: WD, env: Object.assign({}, process.env, envExtra || {}) });
    let buf = ''; child.stdout.on('data', d => { buf += d; const lines = buf.split('\n'); buf = lines.pop(); });
    child.stderr.on('data', () => {}); child.on('close', code => { child = null; resolve(code); });
  });
}
const fixEnv = () => ({ SIM_BATCH: String(loadConfig().fixConcurrency || 10) });   // hot-reload concurrency knob (owner default 10 — gentler on breaker)
async function runScanOnly(scope) {
  const locked = String(scope || 'ALL').trim() || 'ALL';
  // Lock pillar for this run — config + status so mid-run never jumps to ALL
  try {
    const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
    cfgFile.fixScope = locked;
    writeJSON(CONFIG_F, cfgFile);
  } catch (e) {}
  running = true; stopRequested = false; opLog(`SCAN scope=${locked}`);
  setStatus({ stage: 'scan', phase: 'scanning', scope: locked, lockedScope: locked, selfHeal: null, error: null, note: null, transformed: 0, published: 0, startedAt: new Date().toISOString() });
  const code = await runStage(SCAN_SCRIPT, [locked]);
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle', scope: locked, lockedScope: locked }); running = false; return; }
  if (code !== 0) { setStatus({ stage: 'error', phase: 'idle', scope: locked, lockedScope: locked, error: 'scan exited ' + code }); running = false; return; }
  const sum = readJSON(SUMMARY_F, {});
  setStatus({ stage: 'scan-done', phase: 'idle', scope: locked, lockedScope: locked, piles: sum.piles, families: sum.familyCount, note: 'Report ready — press GO to fix ' + locked + ' only (locked).' });
  opLog(`SCAN done scope=${locked}`); running = false;
}
async function runTransformOnly(scope) {
  running = true; stopRequested = false;
  if (!fs.existsSync(REPORT_F)) { setStatus({ stage: 'error', phase: 'idle', error: 'No report yet — press RUN REPORT first.' }); running = false; return; }
  // Prefer the scan report's own scope — never widen to ALL mid-run
  const rep = readJSON(REPORT_F, {});
  const st = readJSON(STATUS_F, {});
  let locked = String(scope || st.lockedScope || st.scope || rep.scope || 'ALL').trim() || 'ALL';
  if (rep.scope && String(rep.scope).toUpperCase() !== 'ALL') {
    // Report was for one pillar — FORCE stay on that pillar even if UI drifted to ALL
    locked = String(rep.scope).trim();
  }
  try {
    const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
    cfgFile.fixScope = locked;
    writeJSON(CONFIG_F, cfgFile);
  } catch (e) {}
  opLog(`FIX scope=${locked} (pillar-locked)`);
  setStatus({ stage: 'transform', phase: 'fixing flagged URLs', scope: locked, lockedScope: locked, selfHeal: null, error: null, note: 'Locked on ' + locked + ' until done', startedAt: new Date().toISOString() });
  const tCode = await runStage(TRANSFORM_SCRIPT, [locked], fixEnv());
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle', scope: locked, lockedScope: locked }); running = false; return; }
  if (tCode !== 0) { setStatus({ stage: 'error', phase: 'idle', scope: locked, lockedScope: locked, error: 'transform exited ' + tCode }); running = false; return; }
  setStatus({ stage: 'verify', phase: 'verifying', scope: locked, lockedScope: locked });
  await runStage(SCAN_SCRIPT, [locked]);
  const v = readJSON(SUMMARY_F, {});
  setStatus({ stage: 'done', phase: 'idle', scope: locked, lockedScope: locked, piles: v.piles, families: v.familyCount, verified: (v.piles && v.piles.NEAR_DUP === 0 && v.piles.STUB === 0 && (v.piles.SUB13 || 0) === 0), note: 'Finished ' + locked });
  opLog(`FIX done scope=${locked}`); running = false;
}
setInterval(() => {
  if (running) return;
  const cmd = readJSON(CMD_F, null); if (!cmd || cmd.consumed) return;
  writeJSON(CMD_F, Object.assign({}, cmd, { consumed: true }));
  const onErr = e => { setStatus({ stage: 'error', phase: 'idle', error: e && e.message }); running = false; };
  const scope = cmd.scope || loadConfig().fixScope || 'ALL';
  if (cmd.action === 'scan') runScanOnly(scope).catch(onErr);
  else if (cmd.action === 'transform') runTransformOnly(scope).catch(onErr);
}, 1500);

const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function tailFile(f, n) { try { return fs.readFileSync(f, 'utf8').trim().split('\n').slice(-n).join('\n'); } catch (e) { return ''; } }

const PANEL_TMPL = `<!doctype html><html><head><meta charset=utf-8><title>Kory's Pulse Control Panel</title>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:#0a0a0c;color:#e8e6e1;font:15px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:16px 14px 40px}
h1{font-size:19px;letter-spacing:.5px;margin:2px 0 2px;color:#FFB81C}
h2{font-size:15px;letter-spacing:.5px;margin:22px 0 2px;color:#B91C3F;text-transform:uppercase}
.dim{color:#8a8680;font-size:12px;margin-bottom:14px}
.card{background:#141417;border:1px solid #24242a;border-radius:14px;padding:14px;margin:12px 0}
.lab{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a8680;margin-bottom:8px}
.scopes{display:flex;flex-wrap:wrap;gap:7px}
.chip{background:#1c1c22;border:1px solid #2c2c34;color:#d8d6d1;border-radius:20px;padding:8px 12px;font-size:13px;cursor:pointer;user-select:none}
.chip .n{color:#8a8680;font-size:11px;margin-left:4px}
.chip.sel{background:#B91C3F;border-color:#B91C3F;color:#fff}
.chip.all{background:#2a2130;border-color:#FFB81C;color:#FFB81C}.chip.all.sel{background:#FFB81C;color:#1a1a1a}
input.topic{width:100%;margin-top:8px;background:#1c1c22;border:1px solid #2c2c34;color:#e8e6e1;border-radius:10px;padding:10px;font-size:14px}
.btns{display:flex;gap:12px;margin:16px 0}
button{flex:1;border:0;border-radius:14px;padding:20px;font-size:20px;font-weight:800;letter-spacing:1px;cursor:pointer}
#go{background:#FFB81C;color:#1a1a1a;box-shadow:0 0 24px rgba(255,184,28,.35)}#go:disabled{background:#20202a;color:#555;box-shadow:none}
#stop{background:#B91C3F;color:#fff}#clear{background:#20202a;color:#cfc7bd}
#fix{width:100%;margin-top:8px;background:linear-gradient(180deg,#FFB81C,#e0a015);color:#1a1a1a;display:none;font-size:18px;animation:fixpulse 1.6s ease-in-out infinite}
@keyframes fixpulse{0%,100%{box-shadow:0 0 18px rgba(255,184,28,.35)}50%{box-shadow:0 0 44px rgba(255,184,28,.8)}}
#force{width:100%;margin-top:8px;background:#2a1215;color:#ff9aa8;border:1px solid #B91C3F;font-size:15px}
.piles{display:flex;gap:10px;margin-top:10px}.pile{flex:1;background:#1c1c22;border-radius:10px;padding:10px;text-align:center}.pile b{display:block;font-size:22px}
.pass b{color:#39FF14;font-family:"Segoe UI",Impact,Haettenschweiler,Arial Black,sans-serif;font-size:34px;font-weight:900;letter-spacing:.02em;text-shadow:0 0 8px rgba(57,255,20,.85),0 0 22px rgba(57,255,20,.55),0 0 40px rgba(57,255,20,.35)}.near b{color:#FFB81C}.sub b{color:#E08A2B}.stub b{color:#B91C3F}
.fin-count{display:inline-block;font-family:"Segoe UI",Impact,Haettenschweiler,Arial Black,sans-serif;font-size:2.15rem;font-weight:900;line-height:1;letter-spacing:.03em;color:#39FF14;text-shadow:0 0 8px rgba(57,255,20,.9),0 0 22px rgba(57,255,20,.6),0 0 42px rgba(57,255,20,.4);vertical-align:-0.12em;margin:0 2px}
.fin-label{color:#9dff9a;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.stage{font-size:14px}.stage b{color:#FFB81C}
.bar{height:14px;background:#1c1c22;border-radius:8px;overflow:hidden;margin:8px 0}.bar>div{height:100%;background:linear-gradient(90deg,#B91C3F,#FFB81C);width:0%;transition:width .5s}
.err{background:#2a1416;border:1px solid #B91C3F;color:#ff9aa8;border-radius:10px;padding:10px;margin-top:10px;font-size:13px;display:none}
.fitem{background:#141417;border:1px solid #24242a;border-radius:10px;padding:9px 11px;margin-bottom:8px}
.fitem.fok{border-color:#1a7f4b;background:#111a14}
.fhdr{display:flex;gap:8px;align-items:baseline;margin-bottom:6px}
.fhdr .fid{font-family:ui-monospace,monospace;font-size:12px;color:#FFB81C;flex:0 0 auto}
.fhdr .ftt{font-size:12px;color:#9a948c;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.fbar{height:11px;background:#1c1c22;border-radius:6px;overflow:hidden}
.fbar>i{display:block;height:100%;background:linear-gradient(90deg,#B91C3F,#FFB81C);transition:width .4s}
.fchk{display:flex;flex-wrap:wrap;gap:14px;margin-top:7px}.chp{font-size:12.5px;font-weight:700}
#fixlist{max-height:440px;overflow:auto}
pre{background:#0d0d10;border:1px solid #222;border-radius:8px;padding:10px;font-size:11px;overflow:auto;max-height:160px;color:#9aa}
a{color:#FFB81C}
.knob{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid #1e1e24}
.knob:last-child{border-bottom:0}
.knob .kn{font-size:13px}.knob .kd{color:#8a8680;font-size:11px}
.stepper{display:flex;align-items:center;gap:8px}
.stepper .val{min-width:52px;text-align:center;font-weight:800;color:#FFB81C;font-size:16px}
.sbtn{flex:0 0 auto;width:38px;height:38px;padding:0;border-radius:10px;background:#1c1c22;color:#e8e6e1;border:1px solid #2c2c34;font-size:20px}
.toggle{padding:8px 14px;border-radius:20px;font-size:13px;font-weight:800;border:1px solid #2c2c34;flex:0 0 auto;width:auto}
.toggle.on{background:#1a7f4b;color:#fff;border-color:#1a7f4b}.toggle.off{background:#B91C3F;color:#fff;border-color:#B91C3F}
.modebtn{flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:800;background:#1c1c22;border:1px solid #2c2c34;color:#cfc7bd}
.modebtn.sel{background:#FFB81C;color:#1a1a1a}
.tin{width:120px;background:#1c1c22;border:1px solid #2c2c34;color:#e8e6e1;border-radius:8px;padding:8px;font-size:13px;text-align:center}
.gt-wrap{width:100%;margin:4px 0 2px}
.gt-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.gt-head .kn{font-size:13px}.gt-head .kd{color:#8a8680;font-size:11px}
.gt-tags{display:flex;flex-wrap:wrap;gap:6px;min-height:34px;padding:8px;background:#0d0d10;border:1px solid #2c2c34;border-radius:10px;cursor:pointer}
.gt-tags:empty::before{content:'Tap to pick topics…';color:#8a8680;font-size:13px}
.gt-tag{display:inline-flex;align-items:center;gap:5px;background:#B91C3F;color:#fff;border-radius:16px;padding:5px 10px;font-size:12px;font-weight:700}
.gt-tag.all{background:#FFB81C;color:#1a1a1a}
.gt-tag .x{opacity:.75;font-weight:900;cursor:pointer;line-height:1}
.gt-dd{display:none;margin-top:8px;max-height:260px;overflow:auto;background:#0d0d10;border:1px solid #2c2c34;border-radius:10px;padding:8px}
.gt-dd.open{display:block}
.gt-opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;user-select:none}
.gt-opt:hover{background:#1c1c22}
.gt-opt.on{background:#1a2430;color:#FFB81C}
.gt-opt .box{width:16px;height:16px;border:1.5px solid #555;border-radius:4px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:11px;color:transparent}
.gt-opt.on .box{background:#FFB81C;border-color:#FFB81C;color:#1a1a1a}
.gt-actions{display:flex;gap:8px;margin-top:8px}
.gt-actions button{flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:800;border:1px solid #2c2c34;background:#1c1c22;color:#cfc7bd}
.lapcard{border:2px solid #FFB81C!important;background:linear-gradient(135deg,#2a1a08,#14120e)!important;box-shadow:0 0 24px rgba(255,184,28,.18)}
.lapcard.on{border-color:#1a7f4b!important;box-shadow:0 0 28px rgba(26,127,75,.25)}
.laprow{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.laptitle{font-size:1.05rem;font-weight:900;color:#FFB81C;letter-spacing:.02em}
.lapcard.on .laptitle{color:#7dffb0}
.lapsub{color:#cfc7bd;font-size:13px;margin-top:6px;line-height:1.35;max-width:52ch}
.lapmeta{color:#8a8680;font-size:12px;margin-top:8px}
#genLocked.locked{opacity:.34;pointer-events:none;filter:grayscale(.55);position:relative}
#genLocked.locked::after{content:"✕ LOCKED — Daily Driver only";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;letter-spacing:.04em;color:#B91C3F;background:rgba(12,11,10,.55);border-radius:10px;pointer-events:none;text-align:center;padding:12px}
.lapacts{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:14px}
.lapacts .tin{width:72px}
.lapacts .laplab{font-size:12px;color:#8a8680}
.laplive{margin-top:14px;padding-top:12px;border-top:1px solid #2a2824;font-size:13px;line-height:1.45;color:#cfc7bd}
.laplive .row{margin:4px 0}
.laplive .k{color:#8a8680;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.laplive .now{color:#FFB81C;font-weight:700}
.laplive .ok{color:#7dffb0;font-weight:700}
.laplive .bad{color:#ff8a9a;font-weight:700}
.laplive .hist{margin-top:8px;color:#8a8680;font-size:12px}
.laplive .hist div{margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lapbar{margin-top:8px;height:6px;background:#1a1916;border-radius:4px;overflow:hidden}
.lapbar>i{display:block;height:100%;background:linear-gradient(90deg,#1a7f4b,#FFB81C);width:0;transition:width .4s}
#fixArm.locked{position:relative}
#fixArm.locked .fix-lockable{opacity:.38;pointer-events:none;filter:grayscale(.4)}
#runLockBanner{display:none;margin:10px 0 0;padding:10px 12px;border-radius:10px;border:1px solid #B91C3F;background:rgba(185,28,63,.15);color:#ff8a9a;font-weight:800;font-size:13px}
#fixArm.locked #runLockBanner{display:block}
#fixArm.locked #stop,#fixArm.locked #force{opacity:1!important;pointer-events:auto!important;filter:none!important}
/* Daily Driver / generator stays usable while the fix machine runs — only Fix Machine knobs lock */
</style></head><body><div class=wrap>
<h1>🧼 KORY'S PULSE CONTROL PANEL</h1>
<div class=dim>One page. Fix machine + hourly generator. Every knob writes <b>gen/config.json</b> live — no restarts. The daemon never raises its own rate; only you can.</div>

<h2>Fix Machine</h2>
<div id=fixArm>
<div class=dim>RUN REPORT scans the scope into Similarity / Sub-13 / Stubs → GO works the whole list (fixConcurrency at a time), 13/13-gated. Nothing that fails publishes.</div>
<div id=runLockBanner>🔒 FIX RUNNING — scope / CLEAR / GO / batch knobs locked. FIX STOP &amp; FIX FORCE STOP still work (fixer only — Daily Driver keeps running).</div>
<div class="card fix-lockable"><div class=lab>Scope</div><div class=scopes id=scopes>loading…</div>
<input class=topic id=topic placeholder="…or type a topic / id-prefix (e.g. gp0, ca11)"></div>
<div class=btns>
  <button class=fix-lockable id=go disabled>RUN REPORT</button>
  <button class=fix-lockable id=clear>CLEAR</button>
  <button id=stop>FIX STOP</button>
</div>
<button class=fix-lockable id=fix>GO ▸ FIX IT</button>
<button id=force>■ FIX FORCE STOP · kill fixer only</button>
<div class="card fix-lockable" id=concCard>
  <div class=knob><div><div class=kn>URLs fixed at a time</div><div class=kd>fix machine batch size · default <b>10</b> · bump to 20 when the pile is clean</div></div>
    <div class=stepper><button class=sbtn onclick="bump('fixConcurrency',-1)">–</button><div class=val id=vFix>–</div><button class=sbtn onclick="bump('fixConcurrency',1)">+</button></div></div>
  <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',10)">10</button>
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',20)">20</button>
  </div>
</div>
<div class=card><div class=stage id=stage>Idle. Pick a scope and press RUN REPORT.</div>
<div class=bar><div id=barfill></div></div>
<div class=piles><div class="pile pass"><b id=pPass>–</b>PASS</div><div class="pile near"><b id=pNear>–</b>SIMILARITY</div><div class="pile sub"><b id=pSub>–</b>SUB 13/13</div><div class="pile stub"><b id=pStub>–</b>STUB</div></div>
<div class=err id=err></div></div>
<div class=card id=fixcard style="display:none"><div class=lab>🔧 Fixing now — each URL: similarity → title → image → quality /10 → 13/13 (batches of fixConcurrency · target sim <b id=tgt>30</b>%)</div><div id=fixlist></div></div>
</div>

<h2>Generator</h2>
<div id=genSection>
<div class="card lapcard" id=lapCard>
  <div class=laprow>
    <div>
      <div class=laptitle>★ SET &amp; FORGET — Daily Driver</div>
      <div class=lapsub>Flip ON → everything else locks. START. One Q&amp;A finishes, then the next. Full pillar lap before repeat. No rate knobs, no topic tags — just this.</div>
      <div class=lapmeta id=lapMeta>—</div>
      <div class=lapbar id=lapBarWrap style="display:none"><i id=lapBar></i></div>
      <div class=laplive id=lapLive></div>
    </div>
    <button type=button class="toggle off" id=tLap onclick="togglePillarLap()">OFF</button>
  </div>
  <div class=lapacts>
    <button type=button class="toggle off" id=tPause onclick="toggleGen()">–</button>
    <span class=laplab>run</span>
    <input class=tin id=inHours type=number min=1 max=168 step=1 inputmode=numeric placeholder="2" onchange="setRunHours(this.value)">
    <span class=laplab>hours then auto-stop</span>
  </div>
</div>
<div id=genLocked>
<div class=dim id=genDim>Custom levers — only matter when Daily Driver is OFF.</div>
<div class=card>
  <div class=knob><div><div class=kn>deployEveryHours</div><div class=kd>auto Netlify deploy · <b>0 = off</b></div></div>
    <div class=stepper><button class=sbtn onclick="bump('deployEveryHours',-1)">–</button><div class=val id=vDep>–</div><button class=sbtn onclick="bump('deployEveryHours',1)">+</button></div></div>
  <div class=lab style="margin-top:10px">Rate mode (custom)</div>
  <div style="display:flex;gap:10px;margin-bottom:6px"><div class=modebtn id=mEPH onclick="setMode('eph')">Total / hour</div><div class=modebtn id=mPTH onclick="setMode('pth')">Per topic / hour</div></div>
  <div class=knob><div><div class=kn id=rateName>entriesPerHour</div><div class=kd>new entries generated each hour</div></div>
    <div class=stepper><button class=sbtn onclick="bump('rate',-1)">–</button><div class=val id=vRate>–</div><button class=sbtn onclick="bump('rate',1)">+</button></div></div>
  <div class=gt-wrap>
    <div class=gt-head><div><div class=kn>genTopics</div><div class=kd>Tag topics · ALL = rotate everything</div></div>
      <button type=button class=sbtn style="width:auto;padding:0 12px;font-size:12px" onclick="toggleGtDd()">▾</button></div>
    <div class=gt-tags id=gtTags onclick="toggleGtDd()"></div>
    <div class=gt-dd id=gtDd></div>
    <div class=gt-actions>
      <button type=button onclick="setGenAll()">ALL topics</button>
      <button type=button onclick="clearGenTopics()">Clear</button>
    </div>
  </div>
</div>
</div>
<div class=card><div class=lab>Generator status</div><div class=stage id=genstage>—</div>
<div class=bar><div id=genbar></div></div></div>
</div>

<div class=card><div class=lab>Lessons ledger (last 6)</div><pre id=lessons>—</pre></div>
<div class=card><div class=lab>Operator log (last 6)</div><pre id=oplog>—</pre></div>

<script>
var cfg={};
var TOPICS=__TOPICS_JSON__;
var gtOpen=false;
function api(k,v){return fetch('/api/config',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:k,value:v})}).then(function(r){return r.json()}).then(function(c){cfg=c;renderCfg();});}
function mode(){return (cfg.perTopicPerHour!=null&&cfg.entriesPerHour==null)?'pth':'eph';}
function setMode(m){if(m==='pth')api('perTopicPerHour',cfg.perTopicPerHour!=null?cfg.perTopicPerHour:5);else api('entriesPerHour',cfg.entriesPerHour!=null?cfg.entriesPerHour:10);}
function bump(which,d){var k=which,cur;if(which==='rate'){k=mode()==='pth'?'perTopicPerHour':'entriesPerHour';cur=cfg[k]!=null?cfg[k]:0;}else cur=cfg[k]!=null?cfg[k]:0;api(k,cur+d);}
function setText(k,v){api(k,v);}
function setRunHours(v){api('runHours',v);}
function selectedTopics(){
 if(cfg.genTopics==='ALL'||cfg.genTopics==null||cfg.genTopics==='')return null; // null = ALL
 if(Array.isArray(cfg.genTopics))return cfg.genTopics.map(function(t){return String(t).toLowerCase()});
 return String(cfg.genTopics).split(',').map(function(s){return s.trim().toLowerCase()}).filter(Boolean);
}
function setGenAll(){api('genTopics','ALL');}
function clearGenTopics(){api('genTopics',[]);}
function toggleTopic(code){
 var cur=selectedTopics();
 if(cur===null){api('genTopics',[code]);return;}
 var i=cur.indexOf(code);
 if(i>=0)cur.splice(i,1);else cur.push(code);
 if(!cur.length)api('genTopics','ALL');
 else api('genTopics',cur);
}
function toggleGtDd(e){if(e)e.stopPropagation();gtOpen=!gtOpen;document.getElementById('gtDd').className='gt-dd'+(gtOpen?' open':'');}
function renderGenTopics(){
 var sel=selectedTopics();
 var tags=document.getElementById('gtTags');
 if(sel===null){
  tags.innerHTML='<span class="gt-tag all">ALL topics</span>';
 } else if(!sel.length){
  tags.innerHTML='';
 } else {
  var by= {};TOPICS.forEach(function(t){by[t.p]=t.name});
  tags.innerHTML=sel.map(function(p){return '<span class=gt-tag data-p="'+p+'">'+esc(by[p]||p)+' <span class=x data-x="'+p+'">×</span></span>'}).join('');
  tags.querySelectorAll('[data-x]').forEach(function(x){x.onclick=function(e){e.stopPropagation();toggleTopic(x.getAttribute('data-x'));};});
 }
 var dd=document.getElementById('gtDd');
 dd.innerHTML=TOPICS.map(function(t){
  var on=sel!==null&&sel.indexOf(t.p)>=0;
  return '<div class="gt-opt'+(on?' on':'')+'" data-p="'+t.p+'"><span class=box>'+(on?'✓':'')+'</span><span><b>'+esc(t.name)+'</b> <span style="color:#8a8680;font-size:11px">'+t.p+'</span></span></div>';
 }).join('');
 dd.querySelectorAll('.gt-opt').forEach(function(o){o.onclick=function(e){e.stopPropagation();toggleTopic(o.getAttribute('data-p'));};});
}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function toggleGen(){
 var wantStart=!!cfg.paused;
 fetch('/api/gen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:wantStart?'start':'stop'})})
  .then(function(r){return r.json()}).then(function(d){if(d&&d.cfg){cfg=d.cfg;renderCfg();}else loadCfg();
   if(wantStart){var gs=document.getElementById('genstage');if(gs)gs.innerHTML='<b>STARTING</b> · batch kicked off now';}});
}
function togglePillarLap(){api('pillarLap',!cfg.pillarLap);}
function renderCfg(){var m=mode();
 document.getElementById('mEPH').className='modebtn'+(m==='eph'?' sel':'');
 document.getElementById('mPTH').className='modebtn'+(m==='pth'?' sel':'');
 document.getElementById('rateName').textContent=m==='pth'?'perTopicPerHour':'entriesPerHour';
 document.getElementById('vRate').textContent=m==='pth'?(cfg.perTopicPerHour!=null?cfg.perTopicPerHour:'–'):(cfg.entriesPerHour!=null?cfg.entriesPerHour:'–');
 document.getElementById('vDep').textContent=(cfg.deployEveryHours===0||cfg.deployEveryHours==='0')?'OFF':cfg.deployEveryHours;
 document.getElementById('vFix').textContent=cfg.fixConcurrency!=null?cfg.fixConcurrency:10;
 // highlight 10/20 presets on the fix-machine concurrency card
 try{
  var fc=Number(cfg.fixConcurrency)||10;
  document.querySelectorAll('#concCard button.sbtn').forEach(function(b){
   var t=String(b.textContent||'').trim();
   if(t!=='10'&&t!=='20')return;
   b.style.outline=(Number(t)===fc)?'2px solid #FFB81C':'none';
   b.style.color=(Number(t)===fc)?'#FFB81C':'';
  });
 }catch(e){}

 var ih=document.getElementById('inHours');if(document.activeElement!==ih)ih.value=cfg.runHours!=null?cfg.runHours:2;
 renderGenTopics();
 var tp=document.getElementById('tPause');tp.textContent=cfg.paused?'START':'STOP';tp.className='toggle '+(cfg.paused?'on':'off');
 var lapOn=!!cfg.pillarLap;
 var tl=document.getElementById('tLap');tl.textContent=lapOn?'ON':'OFF';tl.className='toggle '+(lapOn?'on':'off');
 document.getElementById('lapCard').className='card lapcard'+(lapOn?' on':'');
 var lock=document.getElementById('genLocked');
 if(lock)lock.className=lapOn?'locked':'';
 var gd=document.getElementById('genDim');
 if(gd)gd.textContent=lapOn?'Custom levers locked — Daily Driver is running the show.':'Custom levers — only matter when Daily Driver is OFF.';
}
function loadCfg(){fetch('/api/config').then(function(r){return r.json()}).then(function(c){cfg=c;renderCfg();});}

var scope=null;
function loadScopes(){fetch('/api/scope').then(function(r){return r.json()}).then(function(d){
 var el=document.getElementById('scopes');el.innerHTML='<span class="chip all" data-s="ALL">ALL <span class=n>'+d.total.toLocaleString()+'</span></span>'+
  d.pillars.map(function(p){return '<span class=chip data-s="'+p.p+'">'+p.name+' <span class=n>'+p.n+'</span></span>'}).join('');
 el.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){document.getElementById('topic').value='';sel(c.dataset.s,c)}});});}
function sel(s,c){scope=s;document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});if(c)c.classList.add('sel');document.getElementById('go').disabled=!scope;}
document.getElementById('topic').oninput=function(e){var v=e.target.value.trim();document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});scope=v||null;document.getElementById('go').disabled=!scope;};
document.getElementById('fix').onclick=function(){if(document.body.classList.contains('fix-running'))return;var s=scope;if(!s){fetch('/api/status').then(function(r){return r.json()}).then(function(j){var st=j&&j.fix||{};s=st.lockedScope||st.scope;if(!s){alert('Pick a pillar chip first — will not jump to ALL.');return;}goFix(s);}).catch(function(){alert('Pick a pillar chip first.');});return;}goFix(s);};
function goFix(s){fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'transform',scope:s})});document.getElementById('stage').innerHTML='🔧 Fixing <b>'+s+'</b> only (locked until done)…';}
document.getElementById('go').onclick=function(){if(document.body.classList.contains('fix-running'))return;if(!scope)return;fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'scan',scope:scope})});document.getElementById('stage').innerHTML='📊 Running report on <b>'+scope+'</b> (locked)…';};
document.getElementById('stop').onclick=function(){fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'stop'})});};
document.getElementById('force').onclick=function(){if(!confirm('FIX FORCE STOP — kill the fix machine only? Daily Driver will keep running.'))return;fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'forcestop'})});document.getElementById('stage').innerHTML='■ Fix force-stopped (Daily Driver untouched).';};
document.getElementById('clear').onclick=function(){if(document.body.classList.contains('fix-running'))return;if(!confirm('CLEAR and start over?'))return;fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'clear'})});location.reload();};

function setFixRunLock(on){
 document.body.classList.toggle('fix-running',!!on);
 var arm=document.getElementById('fixArm');
 if(arm)arm.classList.toggle('locked',!!on);
}

function poll(){fetch('/api/status').then(function(r){return r.json()}).then(function(s){
 var st=s.status||{},p=st.piles||{};
 var stage=st.stage||'idle';
 // Lock ONLY from a live fix-machine child — never from a stale stage left after breaker/crash.
 // (Old logic used stage===scan|transform|verify and grayed Daily Driver forever.)
 var busy=!!s.running;
 setFixRunLock(busy);
 document.getElementById('pPass').textContent=p.PASS!=null?p.PASS.toLocaleString():'–';
 document.getElementById('pNear').textContent=p.NEAR_DUP!=null?p.NEAR_DUP.toLocaleString():'–';
 document.getElementById('pStub').textContent=p.STUB!=null?p.STUB.toLocaleString():'–';
 document.getElementById('pSub').textContent=p.SUB13!=null?p.SUB13.toLocaleString():'–';
 var stage=st.stage||'idle',msg='<b>'+stage.toUpperCase()+'</b>';
 if(st.scope)msg+=' · '+st.scope;if(st.phase&&st.phase!=='idle')msg+=' · '+st.phase;
 if(st.scanned!=null)msg+=' · <b style="color:#FFB81C">scanned '+st.scanned.toLocaleString()+(st.total?'/'+st.total.toLocaleString():'')+'</b>';
 if(st.remaining!=null)msg+=' · <b style="color:#FFB81C">remaining '+st.remaining.toLocaleString()+' ↓</b> · <span class=fin-label>finished</span> <span class=fin-count>'+(st.fixedTotal||0).toLocaleString()+'</span>';
 if(st.currentId)msg+=' · now '+st.currentId;
 if(st.breaker!=null)msg+=' · breaker '+st.breaker+'%';
 if(stage==='done')msg+=st.verified?' · <span style="color:#39FF14;font-weight:900;text-shadow:0 0 10px rgba(57,255,20,.7)">✅ VERIFIED CLEAN</span>':' · check report';
 if(st.note)msg+='<br><span style=color:#8a8680>'+st.note+'</span>';
 document.getElementById('stage').innerHTML=msg;
 var pct=0;
 if(st.scanned!=null&&st.total)pct=Math.round(st.scanned/st.total*100);           // scan progress
 else if(st.remaining!=null&&st.total)pct=Math.round((st.total-st.remaining)/st.total*100); // fix progress (resolved/total)
 if(stage==='done')pct=100;
 document.getElementById('barfill').style.width=pct+'%';
 var fx=document.getElementById('fix'),np=(p.NEAR_DUP||0)+(p.STUB||0)+(p.SUB13||0);
 if(busy){fx.style.display='none';}
 else if((stage==='scan-done'||stage==='done')&&np>0){fx.style.display='block';fx.innerHTML='✨ Fix '+(p.NEAR_DUP||0).toLocaleString()+' similarity + '+(p.SUB13||0).toLocaleString()+' sub-13 + '+(p.STUB||0).toLocaleString()+' stubs — FIX ALL';}
 else fx.style.display='none';
 var er=document.getElementById('err');if(st.error){er.style.display='block';er.textContent='⛔ '+st.error;}else er.style.display='none';
 var fc=document.getElementById('fixcard'),fl=document.getElementById('fixlist'),fp=s.fix||{},fkeys=Object.keys(fp);
 if((stage==='transform'||stage==='verify')&&fkeys.length){fc.style.display='block';document.getElementById('tgt').textContent=Math.round((st.target||0.30)*100);
   fl.innerHTML=fkeys.slice(-40).reverse().map(function(id){var v=fp[id]||{};var c=v.checks||{};
     var isScore=(v.metric==='score');
     // Quality = x/10 (stamp 10 on approve). Gate chip = 13/13 separately.
     var iq=(typeof v.iq==='number')?v.iq:(isScore?Math.min(10, Math.round(((v.ov||0)/13)*10)):0);
     var pc=isScore?Math.round((iq||0)/10*100):(v.ov!=null?v.ov:100);
     var firstLab=v.kind==='sub13'?('quality '+(iq||0)+'/10'):(v.kind==='stub'?('quality '+(iq||0)+'/10'):('sim '+(v.ov!=null?v.ov:100)+'%'));
     function chip(k,lab){var s2=c[k]||'pending';var m=({done:['✓','#1a7f4b'],fixed:['✓','#1a7f4b'],active:['⏳','#FFB81C'],failed:['✗','#B91C3F'],pending:['○','#666']})[s2]||['○','#666'];return '<span class=chp style="color:'+m[1]+'">'+m[0]+' '+lab+'</span>';}
     return '<div class="fitem'+(v.status==='approved'?' fok':'')+'"><div class=fhdr><span class=fid>'+id+'</span><span class=ftt>'+(v.kind?'['+v.kind+'] ':'')+(v.title||'')+'</span></div><div class=fbar><i style="width:'+Math.min(100,pc)+'%"></i></div><div class=fchk>'+chip('similarity',firstLab)+chip('title','title')+chip('image','image')+chip('gate','13/13')+'</div></div>';}).join('');}
 else fc.style.display='none';
 document.getElementById('lessons').textContent=s.lessons||'—';
 document.getElementById('oplog').textContent=s.oplog||'—';
 var g=s.gen||{};
 var rawStage=(g.stage||'idle').toLowerCase();
 var label;
 if(g.paused||rawStage==='stopped'||cfg.paused)label='STOPPED';
 else if(s.genRunning||rawStage==='generating'||rawStage==='proof'||rawStage==='starting')label='GENERATING';
 else if(rawStage==='error')label='ERROR';
 else if(rawStage==='proof-done')label='PROOF DONE';
 else if(rawStage==='armed'||rawStage==='idle')label='ARMED';
 else label=rawStage.toUpperCase();
 var gm='<b>'+label+'</b>';
 if(g.mode)gm+=' · '+g.mode;
 if(g.target!=null)gm+=' · target '+g.target;
 if(g.sessionDone!=null||g.done!=null)gm+=' · <span class=fin-label>finished</span> <span class=fin-count>'+((g.sessionDone!=null?g.sessionDone:g.done)||0).toLocaleString()+'</span>';
 if(g.passed!=null)gm+=' · passed '+g.passed;
 if(g.spend!=null)gm+=' · $'+g.spend+' today';
 if(!cfg.paused&&cfg.runUntil){var left=Date.parse(cfg.runUntil)-Date.now();if(left>0){var hm=Math.floor(left/3600000),mm=Math.floor((left%3600000)/60000);gm+=' · <b style=color:#FFB81C>'+hm+'h '+mm+'m left</b>';}else gm+=' · time up';}
 var job=g.currentJob||g.phase;
 if(job)gm+='<br><span style="color:#FFB81C;font-weight:700">job · '+esc(job)+'</span>';
 if(g.topics&&g.topics.length)gm+='<br><span style=color:#8a8680>topics · '+esc(g.topics.join(', '))+'</span>';
 if(g.recentJobs&&g.recentJobs.length){
  var tail=g.recentJobs.slice(-6);
  gm+='<br><span style=color:#8a8680>recent · '+tail.map(function(j){return esc(j);}).join('<br>········ ')+'</span>';
 }
 if(g.note)gm+='<br><span style=color:#8a8680>'+esc(g.note)+'</span>';
 if(g.pillarLap||cfg.pillarLap){
  var lm=document.getElementById('lapMeta');
  var ll=document.getElementById('lapLive');
  var lap=g.lap||{};
  if(lm){
   var bit='Daily Driver ON';
   if(lap.lap!=null)bit+=' · lap #'+lap.lap;
   if(lap.done!=null&&lap.total!=null)bit+=' · <span class=fin-label>pillars</span> <span class=fin-count>'+lap.done+'</span><span style="color:#9dff9a;font-weight:800">/'+lap.total+'</span>';
   if(lap.next)bit+=' · next '+esc(lap.nextName||lap.next);
   lm.innerHTML=bit;
  }
  var lb=document.getElementById('lapBar'),lbw=document.getElementById('lapBarWrap');
  if(lb&&lbw&&lap.total){lbw.style.display='block';lb.style.width=Math.min(100,Math.round((lap.done||0)/lap.total*100))+'%';}
  else if(lbw)lbw.style.display='none';
  if(ll){
   var nowPill=g.currentPillarName||(lap.lastName||'');
   var nowTitle=g.currentTitle||'';
   if(!nowTitle&&g.currentJob&&String(g.currentJob).indexOf(':')>0)nowTitle=String(g.currentJob).replace(/^[^:]+:\s*/,'');
   if(label==='GENERATING'&&(nowTitle||nowPill)){
    ll.innerHTML='<div class=row><span class=k>Working on</span><br><span class=now>'+esc(nowPill||'…')+'</span>'+(nowTitle?' — '+esc(nowTitle):'')+'</div>';
   } else if(label==='GENERATING'){
    ll.innerHTML='<div class=row><span class=k>Working on</span><br><span class=now>starting next…</span></div>';
   } else if(g.lastResult&&g.lastResult.title){
    var lr=g.lastResult;
    ll.innerHTML='<div class=row><span class=k>Last finished</span><br><span class="'+(lr.published||lr.pass?'ok':'bad')+'">'+(lr.published?'✓':'·')+'</span> '+esc(lr.pillarName||'')+' — '+esc(lr.title)+'</div>';
   } else {
    ll.innerHTML='';
   }
  }
 } else {
  var ll2=document.getElementById('lapLive');if(ll2)ll2.innerHTML='';
  var lbw2=document.getElementById('lapBarWrap');if(lbw2)lbw2.style.display='none';
 }
 document.getElementById('genstage').innerHTML=gm;
 var gt=g.target||0,gd=g.done||0;
 var barPct=(label==='GENERATING'&&gt)?Math.round(gd/gt*100):(label==='ARMED'||label==='STOPPED'||label==='PROOF DONE')?(gt?100:0):0;
 document.getElementById('genbar').style.width=barPct+'%';
}).catch(function(){});}
loadScopes();loadCfg();setInterval(function(){poll();loadCfg();},3000);poll();
</script></div></body></html>`;

function panelHtml() {
  const topics = Object.keys(PNAMES).sort((a, b) => PNAMES[a].localeCompare(PNAMES[b])).map(p => ({ p, name: PNAMES[p] }));
  return PANEL_TMPL.replace('__TOPICS_JSON__', JSON.stringify(topics));
}

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/api/scope') { const d = await scopeList(); res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(d)); }
    if (u.pathname === '/api/status') {
      const gen = readJSON(GEN_STATUS_F, {});
      const cfgNow = loadConfig();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify({
        status: readJSON(STATUS_F, {}),
        running,
        genRunning: !!genChild,
        gen: Object.assign({}, gen, {
          paused: !!cfgNow.paused,
          runUntil: cfgNow.runUntil || null,
          runHours: cfgNow.runHours,
          genTopics: cfgNow.genTopics,
          pillarLap: !!cfgNow.pillarLap,
          lap: readJSON(GEN + '/lap_state.json', null)
        }),
        fix: readJSON(SIM + '/fix_progress.json', {}),
        lessons: tailFile(LESSONS_F, 6),
        oplog: tailFile(OPLOG_F, 6)
      }));
    }
    if (u.pathname === '/api/config' && req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(loadConfig())); }
    if (u.pathname === '/api/config' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        const cfg = (d && d.key) ? updateConfig(d.key, d.value) : loadConfig();
        opLog('CONFIG ' + (d && d.key) + '=' + JSON.stringify(d && d.value));
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(cfg));
      });
      return;
    }
    if (u.pathname === '/api/gen' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        // Daily Driver stays usable even while the fix machine runs (owner: only lock Fix Machine knobs).
        const out = (d.action === 'start') ? genStartNow() : (d.action === 'stop') ? genStop() : { ok: false, error: 'action must be start|stop', cfg: loadConfig() };
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out));
      });
      return;
    }
    if (u.pathname === '/api/command' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        // FIX STOP / FIX FORCE STOP — fixer only. Never pause Daily Driver, never kill genChild.
        if (d.action === 'stop') {
          stopRequested = true;
          killFixChild(false);
          opLog('FIX STOP (Daily Driver untouched)');
        }
        else if (d.action === 'forcestop') {
          stopRequested = true;
          try { fs.writeFileSync(SIM + '/STOP.flag', '1'); } catch (e) {}
          killFixChild(true);
          running = false;
          setStatus({ stage: 'stopped', phase: 'idle', note: 'Fix force-stopped — Daily Driver untouched.' });
          opLog('FIX FORCE STOP (Daily Driver untouched)');
        }
        else if (d.action === 'clear') {
          if (running) { res.writeHead(409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'fix machine running — CLEAR locked' })); }
          try { fs.unlinkSync(SIM + '/transform_state.json'); } catch (e) {} try { fs.unlinkSync(SIM + '/fix_progress.json'); } catch (e) {} writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', note: 'Cleared — pick a scope and run the report.' }); opLog('CLEAR');
        }
        else if (d.action === 'scan' || d.action === 'transform') {
          if (running) { res.writeHead(409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'fix machine running — ' + d.action + ' locked' })); }
          // Never silently widen to ALL: prefer explicit scope → locked status → report scope → config
          const stNow = readJSON(STATUS_F, {});
          const repNow = readJSON(REPORT_F, {});
          let sc = d.scope ? String(d.scope).trim() : '';
          if (!sc) sc = stNow.lockedScope || stNow.scope || '';
          if (!sc && d.action === 'transform' && repNow.scope) sc = String(repNow.scope);
          if (!sc) sc = loadConfig().fixScope || 'ALL';
          // Transform: if report is a single pillar, refuse ALL diversion
          if (d.action === 'transform' && repNow.scope && String(repNow.scope).toUpperCase() !== 'ALL') {
            sc = String(repNow.scope).trim();
          }
          try {
            const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
            cfgFile.fixScope = sc;
            writeJSON(CONFIG_F, cfgFile);
          } catch (e) {}
          writeJSON(CMD_F, { action: d.action, scope: sc, at: Date.now(), consumed: false });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}');
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(panelHtml());
  } catch (e) { res.writeHead(500); res.end(esc(e.message)); }
}).listen(PORT, () => console.log('[pulse-panel] merged control panel live on http://localhost:' + PORT + ' — Fix Machine + Generator, config-driven (gen/config.json)'));
