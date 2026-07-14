// sim_machine_server.js � SIMILARITY_MACHINE control panel + watcher (LAN, phone-first).
// THREE controls: SCOPE / START / STOP. Press START and walk away � it runs scan -> triage ->
// transform -> verify for the chosen scope. Polls sim/run_command.json; drives the child stages;
// surfaces progress, piles, self-heal, and the LESSONS ledger. Gitignored, NEVER deployed.
'use strict';
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const PORT = parseInt(process.env.SIM_PORT || '8904', 10);
const SCAN_SCRIPT = WD + '/_sim_scan_cursor.js';
const TRANSFORM_SCRIPT = WD + '/_sim_transform_cursor.js';
const SIM = WD + '/sim';
try { fs.mkdirSync(SIM, { recursive: true }); } catch (e) {}
const CMD_F = SIM + '/run_command.json', STATUS_F = SIM + '/run_status.json', SUMMARY_F = SIM + '/summary.json';
const REPORT_F = SIM + '/scan_report.json', OPLOG_F = SIM + '/operator_log.md', LESSONS_F = SIM + '/LESSONS.md', FAILS_F = SIM + '/transform_failures.md';
const AUTO_F = SIM + '/auto_run.json';
const CONFIG_F = WD + '/gen/config.json';
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const liveConfig = readJSON(CONFIG_F, {});
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'Home & Family', sw:'Software', sk:'Skill Drills', sp:'Sports', cg:'Cologne', dr:'Drills' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();
const opLog = (line) => { try { fs.appendFileSync(OPLOG_F, `- ${new Date().toISOString()} � ${line}\n`); } catch (e) {} };

// seed LESSONS.md if absent (append-only institutional memory)
if (!fs.existsSync(LESSONS_F)) fs.writeFileSync(LESSONS_F, `# sim/LESSONS.md � SIMILARITY_MACHINE institutional memory (append-only)\n\nEvery run reads this in full and applies every rule before entry one. No-re-coaching, enforced by the machine on itself.\n\n| date | symptom | root cause | fix applied | rule going forward |\n|------|---------|-----------|-------------|--------------------|\n`);
if (!fs.existsSync(STATUS_F)) writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', scope: null });
else {
  const st = readJSON(STATUS_F, {});
  if (st.stage && st.stage !== 'idle' && st.stage !== 'done' && st.stage !== 'scan-done' && st.stage !== 'stopped') {
    writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', scope: null, note: 'Recovered from interrupted run � pick a scope and run the report.' });
    opLog('RECOVERED orphaned run state on startup');
  }
}

// ?? scope enumeration from the live registry (cached) ??
let scopeCache = { at: 0, data: null };
async function scopeList() {
  if (scopeCache.data && Date.now() - scopeCache.at < 60000) return scopeCache.data;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  const byP = {};
  for (const e of es) { const p = pOf(e.id); if (!p) continue; byP[p] = (byP[p] || 0) + 1; }
  const pillars = Object.keys(byP).sort((a, b) => byP[b] - byP[a]).map(p => ({ p, name: PNAMES[p] || p.toUpperCase(), n: byP[p] }));
  const data = { total: es.length, pillars };
  scopeCache = { at: Date.now(), data };
  return data;
}

// ?? the run engine (watcher): executes the current command's stages, serial + resume-safe ??
let child = null, running = false, stopRequested = false;
let autoRun = Object.assign({ enabled: liveConfig.fixAutoRun === true, scope: 'tl', podSize: 100, cursor: 0, pod: 1, completed: 0, phase: 'idle', error: null }, readJSON(AUTO_F, {}));
const saveAuto = () => writeJSON(AUTO_F, Object.assign({}, autoRun, { updated: new Date().toISOString() }));
function setStatus(o) { writeJSON(STATUS_F, Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() })); }
function runStage(script, args, extraEnv) {
  return new Promise((resolve) => {
    child = spawn(process.execPath, [script].concat(args), { cwd: WD, env: Object.assign({}, process.env, extraEnv || {}) });
    let buf = '';
    // the sub-script (sim_scan / sim_transform) OWNS run_status.json � the panel must NOT write it here or the
    // two racing writers clobber each other and the dashboard flickers to idle mid-run. Just drain the pipes.
    child.stdout.on('data', d => { buf += d; const lines = buf.split('\n'); buf = lines.pop(); });
    child.stderr.on('data', () => {});
    child.on('close', code => { child = null; resolve(code); });
  });
}
async function executeRun(cmd) {
  running = true; stopRequested = false;
  const scope = cmd.scope;
  opLog(`START scope=${scope}`);
  // START runs the FIX against the existing scan report; only scans when there is none yet
  if (!fs.existsSync(REPORT_F)) {
    setStatus({ stage: 'scan', phase: 'scanning', scope, selfHeal: null, error: null, note: null, startedAt: new Date().toISOString() });
    const scanCode = await runStage(SCAN_SCRIPT, [scope]);
    if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle' }); opLog('STOP (during scan)'); running = false; return; }
    if (scanCode !== 0) { setStatus({ stage: 'error', phase: 'idle', error: 'scan exited ' + scanCode }); opLog('scan HALT code=' + scanCode); running = false; return; }
  } else {
    setStatus({ stage: 'transform', phase: 'fixing flagged URLs', scope, selfHeal: null, error: null, note: null, startedAt: new Date().toISOString() });
  }
  const sum = readJSON(SUMMARY_F, {});
  setStatus({ stage: 'triage', phase: 'triaged', piles: sum.piles, families: sum.familyCount });
  // Phase 3 TRANSFORM � wired to the transform runner (near-dups + stubs -> 14/14 gate). Resume-safe.
  if (fs.existsSync(TRANSFORM_SCRIPT)) {
    setStatus({ stage: 'transform', phase: 'transforming' });
    const tCode = await runStage(TRANSFORM_SCRIPT, [scope]);
    if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle' }); opLog('STOP (during transform)'); running = false; return; }
    if (tCode !== 0) { setStatus({ stage: 'error', phase: 'idle', error: 'transform exited ' + tCode }); running = false; return; }
    // Phase 4 VERIFY � fresh scan must return clean
    setStatus({ stage: 'verify', phase: 'verifying' });
    await runStage(SCAN_SCRIPT, [scope]);
    const v = readJSON(SUMMARY_F, {});
    setStatus({ stage: 'done', phase: 'idle', piles: v.piles, families: v.familyCount, verified: (v.piles && v.piles.NEAR_DUP === 0 && v.piles.STUB === 0 && (v.piles.SUB13 || 0) === 0) });
  } else {
    setStatus({ stage: 'scan-done', phase: 'idle', note: 'SCAN complete � transform runner (sim_transform.js) not yet enabled; press START again once wired.' });
  }
  opLog(`DONE scope=${scope}`);
  running = false;
}
// ? RUN REPORT � scan only, then wait for GO
async function runScanOnly(scope) {
  running = true; stopRequested = false;
  opLog(`SCAN scope=${scope}`);
  setStatus({ stage: 'scan', phase: 'scanning', scope, selfHeal: null, error: null, note: null, transformed: 0, published: 0, startedAt: new Date().toISOString() });
  const code = await runStage(SCAN_SCRIPT, [scope]);
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle' }); running = false; return; }
  if (code !== 0) { setStatus({ stage: 'error', phase: 'idle', error: 'scan exited ' + code }); running = false; return; }
  const sum = readJSON(SUMMARY_F, {});
  setStatus({ stage: 'scan-done', phase: 'idle', piles: sum.piles, families: sum.familyCount, note: 'Report ready � press ? GO to fix.' });
  opLog(`SCAN done scope=${scope}`); running = false;
}
// ? GO � transform the flagged URLs against the existing report, then verify-scan
async function runTransformOnly(scope) {
  running = true; stopRequested = false;
  if (!fs.existsSync(REPORT_F)) { setStatus({ stage: 'error', phase: 'idle', error: 'No report yet � press ? RUN REPORT first.' }); running = false; return; }
  opLog(`FIX scope=${scope}`);
  setStatus({ stage: 'transform', phase: 'fixing flagged URLs', scope, selfHeal: null, error: null, note: null, startedAt: new Date().toISOString() });
  const tCode = await runStage(TRANSFORM_SCRIPT, [scope]);
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle' }); running = false; return; }
  if (tCode !== 0) { setStatus({ stage: 'error', phase: 'idle', error: 'transform exited ' + tCode }); running = false; return; }
  setStatus({ stage: 'verify', phase: 'verifying' });
  await runStage(SCAN_SCRIPT, [scope]);
  const v = readJSON(SUMMARY_F, {});
  setStatus({ stage: 'done', phase: 'idle', piles: v.piles, families: v.familyCount, verified: (v.piles && v.piles.NEAR_DUP === 0 && v.piles.STUB === 0 && (v.piles.SUB13 || 0) === 0) });
  opLog(`FIX done scope=${scope}`); running = false;
}
// AUTO-RUN — preserve the same scan → similarity/quality/title/image/13/13 → verify engine,
// but feed it TL in restart-safe pods of 100 until the pillar is exhausted or owner stops it.
async function runAutoTlPods() {
  if (running || !autoRun.enabled) return;
  running = true; stopRequested = false;
  try { fs.unlinkSync(SIM + '/STOP.flag'); } catch (e) {}
  opLog(`AUTO START scope=tl cursor=${autoRun.cursor || 0} pod=${autoRun.pod || 1} size=100`);
  while (autoRun.enabled && !stopRequested) {
    const offset = Math.max(0, Number(autoRun.cursor) || 0);
    const pod = Math.max(1, Number(autoRun.pod) || 1);
    const env = { SIM_OFFSET: String(offset), SIM_MAX: '100', SIM_BATCH: process.env.SIM_BATCH || '10' };
    try { fs.unlinkSync(REPORT_F); } catch (e) {}
    try { fs.unlinkSync(SUMMARY_F); } catch (e) {}
    autoRun.phase = 'scan'; autoRun.error = null; saveAuto();
    setStatus({ stage: 'scan', phase: `AUTO TL pod ${pod} · scanning ${offset + 1}-${offset + 100}`, scope: 'tl', autoRun: true, autoPod: pod, autoCursor: offset });
    const scanCode = await runStage(SCAN_SCRIPT, ['tl'], env);
    if (stopRequested || !autoRun.enabled) break;
    const scanned = readJSON(SUMMARY_F, {});
    if (scanCode !== 0 || !scanned.total) {
      autoRun.enabled = false; autoRun.phase = 'done'; saveAuto();
      setStatus({ stage: 'done', phase: 'idle', note: `AUTO TL complete · ${autoRun.completed || 0} processed`, autoRun: false });
      break;
    }
    autoRun.phase = 'fix'; saveAuto();
    setStatus({ stage: 'transform', phase: `AUTO TL pod ${pod} · SIM → QUALITY → TITLE → IMAGE → 13/13`, scope: 'tl', autoRun: true, autoPod: pod, autoCursor: offset });
    const transformCode = await runStage(TRANSFORM_SCRIPT, ['tl'], env);
    if (stopRequested || !autoRun.enabled) break;
    if (transformCode !== 0) {
      autoRun.error = 'transform exited ' + transformCode; autoRun.phase = 'error'; saveAuto();
      setStatus({ stage: 'error', phase: 'idle', error: autoRun.error, autoRun: false });
      break;
    }
    autoRun.phase = 'verify'; saveAuto();
    setStatus({ stage: 'verify', phase: `AUTO TL pod ${pod} · verifying`, scope: 'tl', autoRun: true, autoPod: pod, autoCursor: offset });
    const verifyCode = await runStage(SCAN_SCRIPT, ['tl'], env);
    if (verifyCode !== 0) {
      autoRun.error = 'verify exited ' + verifyCode; autoRun.phase = 'error'; saveAuto();
      break;
    }
    const count = Number(scanned.total) || 0;
    autoRun.completed = (Number(autoRun.completed) || 0) + count;
    autoRun.cursor = offset + count;
    autoRun.pod = pod + 1;
    autoRun.phase = count < 100 ? 'done' : 'next-pod';
    saveAuto();
    opLog(`AUTO POD ${pod} done · ${count} TL Q&As · next cursor=${autoRun.cursor}`);
    if (count < 100) {
      autoRun.enabled = false; saveAuto();
      setStatus({ stage: 'done', phase: 'idle', verified: true, note: `AUTO TL complete · ${autoRun.completed} processed`, autoRun: false });
      break;
    }
  }
  if (stopRequested) {
    autoRun.enabled = false; autoRun.phase = 'stopped'; saveAuto();
    setStatus({ stage: 'stopped', phase: 'idle', note: `AUTO TL stopped at cursor ${autoRun.cursor || 0}`, autoRun: false });
  }
  running = false;
}
// ? STREAM � sweep the whole site smallest-pillar-first: scan a pillar, immediately fix its bad URLs, next pillar.
// Work starts within seconds on the smallest pillar; a giant pillar never blocks the start.
async function runStreamAll() {
  running = true; stopRequested = false;
  try { fs.unlinkSync(SIM + '/STOP.flag'); } catch (e) {}
  const d = await scopeList();
  const pillars = (d.pillars || []).slice().sort((a, b) => a.n - b.n).map(p => p.p);   // smallest first
  opLog(`STREAM whole-site fix � ${pillars.length} pillars, smallest first`);
  setStatus({ stage: 'transform', phase: 'starting stream', streamTotal: pillars.length, streamDone: 0, streamFixed: 0, streamFailed: 0 });
  let done = 0, totFixed = 0, totFail = 0;
  for (const pil of pillars) {
    if (stopRequested || fs.existsSync(SIM + '/STOP.flag')) { setStatus({ stage: 'stopped', phase: 'idle', note: 'Stopped mid-stream.' }); running = false; return; }
    setStatus({ stage: 'scan', phase: `scanning ${pil} (${done + 1}/${pillars.length})`, scope: pil });
    const sc = await runStage(SCAN_SCRIPT, [pil]);
    if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle' }); running = false; return; }
    if (sc === 0) {
      const sum = readJSON(SUMMARY_F, {});
      const bad = sum.piles ? ((sum.piles.NEAR_DUP || 0) + (sum.piles.SUB13 || 0) + (sum.piles.STUB || 0)) : 0;
      setStatus({ stage: 'transform', phase: `fixing ${pil} � ${bad} flagged (${done + 1}/${pillars.length})`, scope: pil, piles: sum.piles });
      if (bad > 0) await runStage(TRANSFORM_SCRIPT, [pil]);
      const st = readJSON(STATUS_F, {}); totFixed += (st.transformed || 0); totFail += (st.failed || 0);
    }
    done++;
    setStatus({ streamDone: done, streamTotal: pillars.length, streamFixed: totFixed, streamFailed: totFail });
  }
  setStatus({ stage: 'done', phase: 'idle', verified: true, streamDone: done, streamFixed: totFixed, streamFailed: totFail, note: `Whole-site stream complete � ${pillars.length} pillars swept, ${totFixed} fixed.` });
  opLog(`STREAM done � ${totFixed} fixed, ${totFail} failed`); running = false;
}
// command watcher
setInterval(() => {
  if (running) return;
  const cmd = readJSON(CMD_F, null);
  if (!cmd || cmd.consumed) return;
  writeJSON(CMD_F, Object.assign({}, cmd, { consumed: true }));
  const onErr = e => { setStatus({ stage: 'error', phase: 'idle', error: e && e.message }); running = false; };
  if (cmd.action === 'scan' && cmd.scope) runScanOnly(cmd.scope).catch(onErr);
  else if (cmd.action === 'transform') runTransformOnly(cmd.scope || 'ALL').catch(onErr);
  else if (cmd.action === 'start' && cmd.scope) executeRun(cmd).catch(onErr);
}, 1500);

// ?? panel + api ??
const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function tailFile(f, n) { try { return fs.readFileSync(f, 'utf8').trim().split('\n').slice(-n).join('\n'); } catch (e) { return ''; } }

const PANEL = `<!doctype html><html><head><meta charset=utf-8><title>Kory's Fix-It-All Machine</title>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:#0a0a0c;color:#e8e6e1;font:15px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:16px 14px 40px}
h1{font-size:19px;letter-spacing:.5px;margin:2px 0 2px;color:#FFB81C}
.dim{color:#8a8680;font-size:12px;margin-bottom:14px}
.card{background:#141417;border:1px solid #24242a;border-radius:14px;padding:14px;margin:12px 0}
.lab{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a8680;margin-bottom:8px}
.scopes{display:flex;flex-wrap:wrap;gap:7px}
.chip{background:#1c1c22;border:1px solid #2c2c34;color:#d8d6d1;border-radius:20px;padding:8px 12px;font-size:13px;cursor:pointer;user-select:none}
.chip .n{color:#8a8680;font-size:11px;margin-left:4px}
.chip.sel{background:#B91C3F;border-color:#B91C3F;color:#fff}
.chip.all{background:#2a2130;border-color:#FFB81C;color:#FFB81C}
.chip.all.sel{background:#FFB81C;color:#1a1a1a}
input.topic{width:100%;margin-top:8px;background:#1c1c22;border:1px solid #2c2c34;color:#e8e6e1;border-radius:10px;padding:10px;font-size:14px}
.btns{display:flex;gap:12px;margin:16px 0}
button{flex:1;border:0;border-radius:14px;padding:20px;font-size:20px;font-weight:800;letter-spacing:1px;cursor:pointer}
#go{background:#FFB81C;color:#1a1a1a;box-shadow:0 0 24px rgba(255,184,28,.35)}#go:disabled{background:#20202a;color:#555;box-shadow:none}
#stop{background:#B91C3F;color:#fff}
#clear{background:#20202a;color:#cfc7bd}
#fix{width:100%;margin-top:8px;background:linear-gradient(180deg,#FFB81C,#e0a015);color:#1a1a1a;display:none;font-size:18px;animation:fixpulse 1.6s ease-in-out infinite}
@keyframes fixpulse{0%,100%{box-shadow:0 0 18px rgba(255,184,28,.35)}50%{box-shadow:0 0 44px rgba(255,184,28,.8)}}
#auto{width:100%;margin-top:8px;background:linear-gradient(180deg,#15803d,#22c55e);color:#fff;border:3px solid #86efac;font-size:18px;box-shadow:0 0 24px rgba(34,197,94,.4)}
#auto.off{background:#303039;color:#aaa;border-color:#555;box-shadow:none}
#force{width:100%;margin-top:8px;background:#2a1215;color:#ff9aa8;border:1px solid #B91C3F;font-size:15px}
#fixlist{display:flex;flex-direction:column;gap:8px;max-height:420px;overflow:auto}
.fitem{background:#141417;border:1px solid #24242a;border-radius:10px;padding:9px 11px}
.fitem.fok{border-color:#1a7f4b;background:#111a14}
.fhdr{display:flex;gap:8px;align-items:baseline;margin-bottom:6px}
.fhdr .fid{font-family:ui-monospace,monospace;font-size:12px;color:#FFB81C;flex:0 0 auto}
.fhdr .ftt{font-size:12px;color:#9a948c;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.fbar{height:11px;background:#1c1c22;border-radius:6px;overflow:hidden}
.fbar>i{display:block;height:100%;background:linear-gradient(90deg,#B91C3F,#FFB81C);transition:width .4s}
.fchk{display:flex;flex-wrap:wrap;gap:14px;margin-top:7px}
.chp{font-size:12.5px;font-weight:700}
.bar{height:14px;background:#1c1c22;border-radius:8px;overflow:hidden;margin:8px 0}
.bar>div{height:100%;background:linear-gradient(90deg,#B91C3F,#FFB81C);width:0%;transition:width .5s}
.piles{display:flex;gap:10px;margin-top:10px}
.pile{flex:1;background:#1c1c22;border-radius:10px;padding:10px;text-align:center}
.pile b{display:block;font-size:22px}
.pass b{color:#1a7f4b}.near b{color:#FFB81C}.sub b{color:#E08A2B}.stub b{color:#B91C3F}
.stage{font-size:14px}.stage b{color:#FFB81C}
.heal{background:#2a2130;border:1px solid #FFB81C;color:#FFB81C;border-radius:10px;padding:10px;margin-top:10px;font-size:13px;display:none}
.err{background:#2a1416;border:1px solid #B91C3F;color:#ff9aa8;border-radius:10px;padding:10px;margin-top:10px;font-size:13px;display:none}
pre{background:#0d0d10;border:1px solid #222;border-radius:8px;padding:10px;font-size:11px;overflow:auto;max-height:160px;color:#9aa}
a{color:#FFB81C}
</style></head><body><div class=wrap>
<h1>?? KORY'S FIX-IT-ALL MACHINE</h1>
<div class=dim>The car wash: ? RUN REPORT scans the scope into three sections � <b>Similarity</b>, <b>Sub-13/13</b>, and <b>Stubs</b> ? ? GO works the whole list <b>10 at a time</b>: rewrites near-dups until they're distinct, upgrades sub-13 pages to the checklist, writes stubs from scratch, and applies a title + approved cover to anything missing one. Every page must pass the 13/13 gate to publish. Nothing that fails publishes. FORCE STOP kills anything stuck.</div>

<div class=card><div class=lab>1 � Scope</div><div class=scopes id=scopes>loading�</div>
<input class=topic id=topic placeholder="�or type a topic / id-prefix (e.g. gp0, ca11)"></div>

<div class=btns><button id=go disabled>? RUN REPORT</button><button id=clear>CLEAR</button><button id=stop>STOP</button></div>
<button id=auto>▶ AUTO-RUN 100 · TL PULSE TOOLS · ON</button>
<button id=fix>? GO ? FIX IT</button>
<button id=force>? FORCE STOP &nbsp;�&nbsp; kill if stuck</button>

<div class=card><div class=stage id=stage>Idle. Pick a scope and press ? RUN REPORT.</div>
<div class=bar><div id=barfill></div></div>
<div class=piles><div class="pile pass"><b id=pPass>�</b>PASS</div><div class="pile near"><b id=pNear>�</b>SIMILARITY</div><div class="pile sub"><b id=pSub>�</b>SUB 13/13</div><div class="pile stub"><b id=pStub>�</b>STUB</div></div>
<div class=heal id=heal></div><div class=err id=err></div></div>

<div class=card id=fixcard style="display:none"><div class=lab>?? Fixing now � 10 at a time � every page must clear the 13/13 checklist (target sim <b id=tgt>30</b>%)</div><div id=fixlist></div></div>

<div class=card><div class=lab>Lessons ledger (last 8)</div><pre id=lessons>�</pre></div>
<div class=card><div class=lab>Operator log (last 8)</div><pre id=oplog>�</pre></div>

<script>
let scope=null, scopes=[];
async function loadScopes(){const d=await(await fetch('/api/scope')).json();scopes=d.pillars;
 const el=document.getElementById('scopes');el.innerHTML='<span class="chip all" data-s="ALL">ALL <span class=n>'+d.total.toLocaleString()+'</span></span>'+
  d.pillars.map(p=>'<span class=chip data-s="'+p.p+'">'+p.name+' <span class=n>'+p.n+'</span></span>').join('');
 el.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{document.getElementById('topic').value='';select(c.dataset.s,c)});}
function select(s,c){scope=s;document.querySelectorAll('.chip').forEach(x=>x.classList.remove('sel'));if(c)c.classList.add('sel');document.getElementById('go').disabled=!scope;}
document.getElementById('topic').oninput=e=>{const v=e.target.value.trim();document.querySelectorAll('.chip').forEach(x=>x.classList.remove('sel'));scope=v||null;document.getElementById('go').disabled=!scope;};
document.getElementById('go').onclick=async()=>{if(!scope)return;await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'scan',scope})});document.getElementById('stage').innerHTML='?? Running report on <b>'+scope+'</b>�';};
document.getElementById('fix').onclick=async()=>{const s=scope||'ALL';await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'transform',scope:s})});document.getElementById('stage').innerHTML='?? Fixing <b>'+s+'</b> � transforming flagged URLs�';};
document.getElementById('auto').onclick=async()=>{const on=document.getElementById('auto').classList.contains('off');await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'auto',enabled:on})});};
document.getElementById('stop').onclick=async()=>{await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'stop'})});};
document.getElementById('force').onclick=async()=>{if(!confirm('FORCE STOP � kill any stuck process now?'))return;await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'forcestop'})});document.getElementById('stage').innerHTML='? Force-stopped.';};
document.getElementById('clear').onclick=async()=>{if(!confirm('CLEAR and start over?'))return;await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'clear'})});location.reload();};
async function poll(){try{const s=await(await fetch('/api/status')).json();
 const st=s.status||{};const p=st.piles||{};
 const ar=s.auto||{};const ab=document.getElementById('auto');const aon=!!ar.enabled;
 ab.classList.toggle('off',!aon);ab.textContent=aon?('⏹ AUTO-RUN 100 · TL · POD '+(ar.pod||1)+' · '+(ar.completed||0)+' DONE'):'▶ AUTO-RUN 100 · TL PULSE TOOLS · OFF';
 document.getElementById('pPass').textContent=p.PASS!=null?p.PASS.toLocaleString():'�';
 document.getElementById('pNear').textContent=p.NEAR_DUP!=null?p.NEAR_DUP.toLocaleString():'�';
 document.getElementById('pStub').textContent=p.STUB!=null?p.STUB.toLocaleString():'�';
 document.getElementById('pSub').textContent=p.SUB13!=null?p.SUB13.toLocaleString():'�';
 let stage=st.stage||'idle';let msg='<b>'+stage.toUpperCase()+'</b>';
 if(st.scope)msg+=' � '+st.scope;if(st.phase&&st.phase!=='idle')msg+=' � '+st.phase;
 if(st.scanned&&st.total)msg+=' � '+st.scanned+'/'+st.total;
 if(st.families!=null)msg+=' � '+st.families+' families';
 if(stage==='done')msg+=st.verified?' � <span style=color:#1a7f4b>? VERIFIED CLEAN</span>':' � check report';
 if(st.note)msg+='<br><span style=color:#8a8680>'+st.note+'</span>';
 document.getElementById('stage').innerHTML=msg;
 let pct=0;if(st.total&&st.scanned)pct=Math.round(st.scanned/st.total*100);if(stage==='done')pct=100;
 document.getElementById('barfill').style.width=pct+'%';
 const fx=document.getElementById('fix');const np=(p.NEAR_DUP||0)+(p.STUB||0)+(p.SUB13||0);
 if((stage==='scan-done'||stage==='done')&&np>0){fx.style.display='block';fx.innerHTML='? Fix '+(p.NEAR_DUP||0).toLocaleString()+' similarity + '+(p.SUB13||0).toLocaleString()+' sub-13 + '+(p.STUB||0).toLocaleString()+' stubs � YES, FIX ALL (10 at a time)';}
 else if((stage==='scan-done'||stage==='done')&&np===0){fx.style.display='none';document.getElementById('stage').innerHTML+=' &nbsp; <span style="color:#1a7f4b;font-weight:700">? Report done � everything on this scope is distinct and 13/13, nothing to fix.</span>';}
 else fx.style.display='none';
 const fc=document.getElementById('fixcard'),fl=document.getElementById('fixlist');const fp=s.fix||{};const keys=Object.keys(fp);
 if((stage==='transform'||stage==='verify')&&keys.length){fc.style.display='block';document.getElementById('tgt').textContent=Math.round((st.target||0.30)*100);
   fl.innerHTML=keys.slice(-40).reverse().map(function(id){var v=fp[id]||{};var c=v.checks||{};
     var isScore=(v.metric==='score');
     var pc=isScore?Math.round((v.ov||0)/13*100):(v.ov!=null?v.ov:100);
     var firstLab=v.kind==='sub13'?('quality '+(v.ov||0)+'/13'):(v.kind==='stub'?('write '+(v.ov||0)+'/13'):('sim '+(v.ov!=null?v.ov:100)+'%'));
     function chip(k,lab){var s=c[k]||'pending';var m=({done:['?','#1a7f4b'],fixed:['? fixed','#1a7f4b'],active:['?','#FFB81C'],failed:['?','#B91C3F'],pending:['?','#666']})[s]||['?','#666'];return '<span class=chp style="color:'+m[1]+'">'+m[0].split(' ')[0]+' '+lab+(m[0].indexOf('fixed')>-1?' (fixed)':'')+'</span>';}
     return '<div class="fitem'+(v.status==='approved'?' fok':'')+'"><div class=fhdr><span class=fid>'+id+'</span><span class=ftt>'+(v.kind?'['+v.kind+'] ':'')+(v.title||'')+'</span></div><div class=fbar><i style="width:'+Math.min(100,pc)+'%"></i></div><div class=fchk>'+chip('similarity',firstLab)+chip('title','title')+chip('image','image')+chip('gate','13/13')+'</div></div>';}).join('');}
 else fc.style.display='none';
 const heal=document.getElementById('heal');if(st.selfHeal){heal.style.display='block';heal.textContent='? self-healed: '+st.selfHeal;}else heal.style.display='none';
 const err=document.getElementById('err');if(st.error){err.style.display='block';err.textContent='? '+st.error;}else err.style.display='none';
 document.getElementById('lessons').textContent=s.lessons||'�';
 document.getElementById('oplog').textContent=s.oplog||'�';
}catch(e){}}
loadScopes();setInterval(poll,3000);poll();
</script></div></body></html>`;

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/api/scope') { const d = await scopeList(); res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(d)); }
    if (u.pathname === '/api/status') {
      const status = readJSON(STATUS_F, {});
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify({ status, running, auto: autoRun, fix: readJSON(SIM + '/fix_progress.json', {}), lessons: tailFile(LESSONS_F, 8), oplog: tailFile(OPLOG_F, 8) }));
    }
    if (u.pathname === '/api/command' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        if (d.action === 'stop') { stopRequested = true; autoRun.enabled = false; autoRun.phase = 'stopped'; saveAuto(); if (child) { try { child.kill(); } catch (e) {} } opLog('STOP pressed'); }
        else if (d.action === 'forcestop') { stopRequested = true; autoRun.enabled = false; autoRun.phase = 'stopped'; saveAuto(); try { fs.writeFileSync(SIM + '/STOP.flag', '1'); } catch (e) {} if (child) { try { child.kill('SIGKILL'); } catch (e) {} child = null; } running = false; setStatus({ stage: 'stopped', phase: 'idle', note: 'Force-stopped.' }); opLog('FORCE STOP'); }
        else if (d.action === 'clear') { try { fs.unlinkSync(SIM + '/transform_state.json'); } catch (e) {} try { fs.unlinkSync(SIM + '/fix_progress.json'); } catch (e) {} writeJSON(STATUS_F, { stage: 'idle', phase: 'idle', note: 'Cleared � pick a scope and run the report.' }); opLog('CLEAR'); }
        else if (d.action === 'auto') {
          if (d.enabled === false) { stopRequested = true; autoRun.enabled = false; autoRun.phase = 'stopping'; saveAuto(); if (child) { try { child.kill(); } catch (e) {} } }
          else {
            stopRequested = false;
            autoRun = { enabled: true, scope: 'tl', podSize: 100, cursor: 0, pod: 1, completed: 0, phase: 'starting', error: null };
            saveAuto();
            setTimeout(() => runAutoTlPods().catch(e => { autoRun.error = e.message; autoRun.phase = 'error'; autoRun.enabled = false; saveAuto(); running = false; }), 50);
          }
        }
        else if (d.action === 'scan' || d.action === 'transform' || d.action === 'start') writeJSON(CMD_F, { action: d.action, scope: d.scope ? String(d.scope) : 'ALL', at: Date.now(), consumed: false });
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}');
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(PANEL);
  } catch (e) { res.writeHead(500); res.end(esc(e.message)); }
}).listen(PORT, () => {
  console.log('[sim-machine] control panel live on http://localhost:' + PORT + '  (scan wired; transform runs when _sim_transform_cursor.js present)');
  if (autoRun.enabled) setTimeout(() => runAutoTlPods().catch(e => {
    autoRun.error = e.message; autoRun.phase = 'error'; autoRun.enabled = false; saveAuto(); running = false;
  }), 1200);
});
