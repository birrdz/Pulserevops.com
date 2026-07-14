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
const path = require('path');
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
const { buildFixerPods, loadPods, isPodLocked, maybeLockPod, parsePodScope, takeNext30, skipNext30, SECTION_SIZE, SPLIT_MIN } = require('./_fixer_scope_sections');
const { handleSquareRoutes } = require('./_fixer_square_builder');
const PNAMES = {
  tl: 'Pulse Tools',
  ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infra', gb: 'Graphics', bo: 'Buildouts', sy: 'Style', gp: 'GTM Playbooks', ra: 'Rev Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne', lv: 'Lux Vacations', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics', q: 'Q&A', hf: 'Home & Family', sw: 'Software', sk: 'Skill Drills', sp: 'Sports', dr: 'Drills', ce: 'Current Events', ed: 'Advice',
};
// Fixer pods of 30 — panel chips ONLY (live site pillars unchanged)
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();
const opLog = (line) => { try { fs.appendFileSync(OPLOG_F, `- ${new Date().toISOString()} · ${line}\n`); } catch (e) {} };

// ── config (single source of truth; hot-reloaded; clamped; daemon never raises its own rate) ──
const FIX_STAGES = ['all', 'nosim', 'similarity', 'quality', 'image', 'title', 'gate'];
const CONFIG_DEFAULTS = {
  fixConcurrency: 30, // 30 workers · 1 URL each · finish independently
  fixWorkers: 1,
  fixSoloTriple: false, // OFF = N URLs parallel, stages in order
  fixScope: 'ALL',
  fixStage: 'all', // sim→quality→image→title→13/13 · quality chip /10 · nosim skips sim
  fixWriter: 'deepseek', // deepseek | claude|cursor — Claude Code only when resting DS
  fixRunUntil: null, // ISO — Fix Machine keep-going deadline (Eastern wall clock set by owner)
  entriesPerHour: 10,
  perTopicPerHour: null,
  genTopics: 'ALL',
  runHours: 2,
  runUntil: null,
  paused: false,
  deployEveryHours: 0,
  pillarLap: false,
};

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
  const numeric = ['fixConcurrency', 'fixWorkers', 'entriesPerHour', 'perTopicPerHour', 'deployEveryHours', 'runHours'];
  if (key === 'paused') cfg.paused = !!value;
  else if (key === 'pillarLap') cfg.pillarLap = !!value;
  else if (key === 'fixSoloTriple') {
    cfg.fixSoloTriple = !!value;
    if (cfg.fixSoloTriple) {
      // 1 URL · 5 workers (1 each: quality · image · title · 13/13 · sim)
      cfg.fixConcurrency = 1;
      cfg.fixWorkers = 5;
    }
  }
  else if (key === 'fixStage') {
    const s = String(value || 'all').toLowerCase().trim();
    cfg.fixStage = FIX_STAGES.includes(s) ? s : 'all';
  }
  else if (key === 'fixWriter') {
    const w = String(value || 'deepseek').toLowerCase().trim();
    cfg.fixWriter = (w === 'claude' || w === 'cursor') ? 'claude' : 'deepseek';
  }
  else if (key === 'fixRunUntil') cfg.fixRunUntil = value || null;
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

// ── scope chips — simple: NEXT 30 (+ green DONE summary) ──
let scopeCache = { at: 0, data: null };
async function scopeList() {
  if (scopeCache.data && Date.now() - scopeCache.at < 10000) return scopeCache.data;
  const pack = buildFixerPods();
  const { loadNext30, needFixQueue, loadClearedIds, loadImageDoneIds } = require('./_fixer_scope_sections');
  const next = loadNext30();
  const leftQ = needFixQueue().length;
  const fixedN = loadClearedIds().size; // true 5/5 only
  let imageDoneN = 0;
  try { imageDoneN = loadImageDoneIds().size; } catch (e) {}
  // Owner: Image-done = 1/5 of a finished URL toward %; full 5/5 = 1.0
  // Freeze high-water need so % only climbs (never resets down mid-run)
  // Owner lock: if baseline.locked, never overwrite (full-library ~35k base).
  const BASE_F = SIM + '/fix_pct_baseline.json';
  let base = readJSON(BASE_F, null);
  const hint = Math.max(leftQ + fixedN, next.totalNeed || 0, 1);
  if (!base || !base.need) {
    base = { need: Math.max(hint, 1), at: new Date().toISOString(), locked: true };
    writeJSON(BASE_F, base);
  } else if (!base.locked && hint > base.need) {
    base = { need: hint, at: new Date().toISOString() };
    writeJSON(BASE_F, base);
  }
  // Credit toward % only — NEVER (base - openQueue)/base (that fake~84% treating open queue as "what's left of the library").
  // Honor locked baseline as-is (full catalog with Style, or ~34k non-Style when Style was parked).
  const baseNeed = Math.max(1, Number(base.need) || hint || 1);
  if (base.locked && Number(base.need) !== baseNeed) {
    base = Object.assign({}, base, { need: baseNeed });
    writeJSON(BASE_F, base);
  }
  const credit = fixedN + imageDoneN * 0.2;
  const done = Math.max(0, Math.min(baseNeed, credit));
  const pctDone = Math.round((done / baseNeed) * 1000) / 10;
  const left = leftQ;
  const doneUrls = fixedN;
  const pillars = [
    {
      p: 'next30',
      name: 'NEXT 30',
      n: next.n,
      note: 'batch ' + (next.batch || 1) + '/' + (next.batches || 1) + ' · ' + next.n + ' URLs',
      green: false,
      locked: false,
      batch: next.batch || 1,
      batches: next.batches || 1,
      left: next.left || 0,
    },
  ];
  if (doneUrls > 0) {
    pillars.push({
      p: '_done_summary',
      name: 'DONE',
      n: doneUrls,
      note: 'already fixed · locked',
      green: true,
      locked: true,
    });
  }
  const data = {
    total: left,
    needFix: left,
    openQueue: left,
    fixed: doneUrls,
    imageDone: imageDoneN,
    baseline: baseNeed,
    pctDone,
    styleParked: false,
    styleActive: true,
    pillars,
    pods: Object.assign({}, pack.stats || {}, {
      next30: next.n,
      left,
      batch: next.batch,
      batches: next.batches,
      fixed: doneUrls,
      pctDone,
      baseline: baseNeed,
    }),
  };
  scopeCache = { at: Date.now(), data };
  return data;
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
  // START = continuous Daily Driver until STOP / runUntil (was exiting after 1 batch)
  cfgFile.pillarLap = true;
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
    const genLog = GEN + '/daemon.out.log';
    let genOut;
    try { genOut = fs.openSync(genLog, 'a'); } catch (e) { genOut = 'ignore'; }
    genChild = spawn(process.execPath, [WD + '/gen_daemon.js', '--once'], {
      cwd: WD,
      env: process.env,
      stdio: genOut === 'ignore' ? 'ignore' : ['ignore', genOut, genOut],
      windowsHide: true, // never pop a CMD window on Windows
      detached: false,
    });
    genChild.on('close', (code, signal) => {
      genChild = null;
      try {
        const cfg = loadConfig();
        const want = !cfg.paused && cfg.runUntil && Date.parse(cfg.runUntil) > Date.now();
        if (want) {
          // Unexpected exit during run window — mark so UI is not stuck on "starting…"
          writeJSON(GEN_STATUS_F, Object.assign(readJSON(GEN_STATUS_F, {}), {
            stage: 'error',
            currentJob: null,
            note: 'gen_daemon exited (code ' + code + (signal ? '/' + signal : '') + ') — press START again',
            updated: new Date().toISOString(),
          }));
          opLog('GEN child died unexpectedly code=' + code);
        }
      } catch (e) {}
    });
    genChild.on('error', (err) => {
      genChild = null;
      opLog('GEN spawn error: ' + (err && err.message));
      try {
        writeJSON(GEN_STATUS_F, Object.assign(readJSON(GEN_STATUS_F, {}), {
          stage: 'error', currentJob: null, note: 'gen spawn failed: ' + (err && err.message),
          updated: new Date().toISOString(),
        }));
      } catch (e) {}
    });
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

// ── IndexNow panel worker (NEVER touches genChild or fix child) ──
let indexChild = null;
const INDEXNOW_STATUS_F = GEN + '/indexnow_panel.json';
const INDEXNOW_COOL_F = GEN + '/indexnow_cooldown.json';
const INDEXNOW_STOP_F = GEN + '/indexnow_stop.flag';
const INDEXNOW_SITE_MS = 7 * 24 * 3600 * 1000;
const INDEXNOW_DELTA_MS = 24 * 3600 * 1000;
function indexnowView() {
  const st = readJSON(INDEXNOW_STATUS_F, {});
  const cool = readJSON(INDEXNOW_COOL_F, {});
  const siteLeft = Math.max(0, (cool.siteAt || 0) + INDEXNOW_SITE_MS - Date.now());
  const deltaLeft = Math.max(0, (cool.deltaAt || 0) + INDEXNOW_DELTA_MS - Date.now());
  return Object.assign({}, st, {
    running: !!indexChild || !!st.running,
    cooldown: { siteMs: siteLeft, deltaMs: deltaLeft },
  });
}
function indexnowStart(mode) {
  const m = String(mode || '').toLowerCase();
  if (m !== 'site' && m !== 'delta') return { ok: false, error: 'mode must be site|delta', indexnow: indexnowView() };
  if (indexChild) return { ok: false, error: 'IndexNow already running', indexnow: indexnowView() };
  const view = indexnowView();
  if (m === 'site' && view.cooldown.siteMs > 0) return { ok: false, error: 'Index Site on cooldown', indexnow: view };
  if (m === 'delta' && view.cooldown.deltaMs > 0) return { ok: false, error: 'Index Delta on cooldown', indexnow: view };
  try { fs.unlinkSync(INDEXNOW_STOP_F); } catch (e) {}
  writeJSON(INDEXNOW_STATUS_F, { stage: 'starting', mode: m, running: true, done: 0, total: 0, note: 'Starting ' + m + '…', updated: Date.now() });
  indexChild = spawn(process.execPath, [WD + '/_panel_indexnow.js', m], {
    cwd: WD,
    env: process.env,
    stdio: 'ignore',
    windowsHide: true, // never pop a CMD window on Windows
  });
  indexChild.on('close', () => { indexChild = null; });
  indexChild.on('error', () => { indexChild = null; });
  opLog('INDEXNOW start ' + m + ' (gen/fixer untouched)');
  return { ok: true, indexnow: indexnowView() };
}
function indexnowStop() {
  try { fs.writeFileSync(INDEXNOW_STOP_F, '1'); } catch (e) {}
  if (indexChild) {
    try { indexChild.kill(); } catch (e) {}
    indexChild = null;
  }
  const st = readJSON(INDEXNOW_STATUS_F, {});
  writeJSON(INDEXNOW_STATUS_F, Object.assign({}, st, { stage: 'stopped', running: false, note: 'Stopped', updated: Date.now() }));
  opLog('INDEXNOW stop (gen/fixer untouched)');
  return { ok: true, indexnow: indexnowView() };
}

// ── fix-machine run engine (STOP/FORCE STOP must NEVER touch Daily Driver / genChild) ──
let child = null, running = false, stopRequested = false;
function setStatus(o) { writeJSON(STATUS_F, Object.assign(readJSON(STATUS_F, {}), o, { updated: new Date().toISOString() })); }
function readFixRate() {
  const now = Date.now();
  try {
    const j = readJSON(SIM + '/fix_rate.json', {});
    const times = (Array.isArray(j.times) ? j.times : []).filter((t) => typeof t === 'number' && now - t < 3600000);
    return {
      fixesPerMin: times.filter((t) => now - t < 60000).length,
      fixesPerHour: times.length,
    };
  } catch (e) {
    return { fixesPerMin: 0, fixesPerHour: 0 };
  }
}
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
    // Never overlap fix/scan children — kill any stray before spawn.
    if (child) { try { child.kill('SIGKILL'); } catch (e) {} child = null; }
    child = spawn(process.execPath, [script].concat(args), {
      cwd: WD,
      env: Object.assign({}, process.env, envExtra || {}, (() => {
        // fixWriter: claude|cursor → Claude Code only (DeepSeek rests). deepseek → DS only (default).
        const cfg = loadConfig();
        const w = String(cfg.fixWriter || process.env.FIX_WRITER || 'deepseek').toLowerCase().trim();
        const useClaude = w === 'claude' || w === 'cursor';
        return useClaude
          ? { DS_ONLY: '0', NO_CLAUDE: '0', CLAUDE_ONLY: '1', NO_DS: '1', CONTENT_WRITER_ENGINE: 'claude' }
          : { DS_ONLY: '1', NO_CLAUDE: '1', CLAUDE_ONLY: '0', NO_DS: '0' };
      })()),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true, // never pop a CMD window on Windows
    });
    let buf = '';
    if (child.stdout) child.stdout.on('data', d => { buf += d; const lines = buf.split(/\r?\n/); buf = lines.pop(); for (const line of lines) if (line) console.log('[fix-child]', line); });
    if (child.stderr) child.stderr.on('data', d => { const s = String(d); if (s.trim()) console.error('[fix-child:err]', s.trim()); });
    child.on('error', (err) => {
      console.error('[fix-child] spawn error', err && err.message);
      child = null;
      resolve(1);
    });
    child.on('close', code => { child = null; resolve(code == null ? 1 : code); });
  });
}
const fixEnv = () => {
  const cfg = loadConfig();
  const solo = !!cfg.fixSoloTriple;
  const stage = FIX_STAGES.includes(String(cfg.fixStage || '').toLowerCase())
    ? String(cfg.fixStage).toLowerCase()
    : 'all';
  return {
    SIM_BATCH: String(solo ? 1 : (cfg.fixConcurrency || 30)),
    SIM_WORKERS: String(solo ? (cfg.fixWorkers || 5) : (cfg.fixWorkers || 1)),
    SIM_FIX_STAGE: stage,
    SIM_NOSIM: stage === 'nosim' ? '1' : '',
    // Image stage: Pexels library / API ONLY (download → /assets/qa/) — pollinations hard-banned in rotate
    IMG_ROTATE_ORDER: 'pexels',
    IMG_ALLOW_NON_PEXELS: '0',
    IMG_GENERIC_BANK: '1',
    IMG_BANK_MATCH_MIN: '1',
  };
};
// Scan hits Netlify Blobs harder than transform — keep well under fixConcurrency (was hard-coded 18).
const scanEnv = () => {
  const fc = Number(loadConfig().fixConcurrency) || 30;
  const conc = Math.max(2, Math.min(6, Math.ceil(fc / 4)));
  return { SIM_READ_CONC: String(conc), SIM_SCAN_PAUSE_MS: '300', SIM_CACHE_EVERY: '30' };
};
async function runScanOnly(scope) {
  const locked = String(scope || 'ALL').trim() || 'ALL';
  if (isPodLocked(locked)) {
    setStatus({ stage: 'idle', phase: 'idle', scope: locked, note: 'Pod ' + locked + ' is green/locked — cannot scan-fix again.' });
    opLog('BLOCKED locked pod scan ' + locked);
    return;
  }
  try {
    const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
    cfgFile.fixScope = locked;
    writeJSON(CONFIG_F, cfgFile);
  } catch (e) {}
  running = true; stopRequested = false; opLog(`SCAN scope=${locked}`);
  setStatus({ stage: 'scan', phase: 'scanning', scope: locked, lockedScope: locked, selfHeal: null, error: null, note: null, transformed: 0, published: 0, startedAt: new Date().toISOString() });
  const code = await runStage(SCAN_SCRIPT, [locked], scanEnv());
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle', scope: locked, lockedScope: locked }); running = false; return; }
  if (code !== 0) { setStatus({ stage: 'error', phase: 'idle', scope: locked, lockedScope: locked, error: 'scan exited ' + code }); running = false; return; }
  const sum = readJSON(SUMMARY_F, {});
  try { buildFixerPods(); scopeCache = { at: 0, data: null }; } catch (e) {}
  setStatus({ stage: 'scan-done', phase: 'idle', scope: locked, lockedScope: locked, piles: sum.piles, families: sum.familyCount, note: 'Report ready — press GO to fix ' + locked + ' only.' });
  opLog(`SCAN done scope=${locked}`); running = false;
}
async function runTransformOnly(scope) {
  running = true; stopRequested = false;
  if (!fs.existsSync(REPORT_F)) { setStatus({ stage: 'error', phase: 'idle', error: 'No report yet — press RUN REPORT first.' }); running = false; return; }
  const rep = readJSON(REPORT_F, {});
  const st = readJSON(STATUS_F, {});
  let locked = String(scope || st.lockedScope || st.scope || rep.scope || 'ALL').trim() || 'ALL';
  if (isPodLocked(locked)) {
    setStatus({ stage: 'idle', phase: 'idle', scope: locked, note: 'Pod ' + locked + ' is green/locked — cannot FIX again.' });
    opLog('BLOCKED locked pod fix ' + locked);
    running = false;
    return;
  }
  // Pod scopes stay on the pod. Non-pod: prefer report scope if single.
  const isPod = !!parsePodScope(locked);
  if (!isPod && rep.scope && String(rep.scope).toUpperCase() !== 'ALL' && !parsePodScope(rep.scope)) {
    locked = String(rep.scope).trim();
  }
  try {
    const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
    cfgFile.fixScope = locked;
    writeJSON(CONFIG_F, cfgFile);
  } catch (e) {}
  opLog(`FIX scope=${locked}`);
  setStatus({ stage: 'transform', phase: 'fixing flagged URLs', scope: locked, lockedScope: locked, selfHeal: null, error: null, note: 'Locked on ' + locked + ' · 30 workers · 1 URL each · sim→quality→image→title→13/13', startedAt: new Date().toISOString() });
  const tCode = await runStage(TRANSFORM_SCRIPT, [locked], fixEnv());
  if (stopRequested) { setStatus({ stage: 'stopped', phase: 'idle', scope: locked, lockedScope: locked }); running = false; return; }
  if (tCode !== 0) { setStatus({ stage: 'error', phase: 'idle', scope: locked, lockedScope: locked, error: 'transform exited ' + tCode }); running = false; return; }
  setStatus({ stage: 'verify', phase: 'verifying', scope: locked, lockedScope: locked });
  await runStage(SCAN_SCRIPT, [locked], scanEnv());
  try {
    const lockRes = maybeLockPod(locked);
    buildFixerPods();
    scopeCache = { at: 0, data: null };
    if (lockRes && lockRes.locked) opLog('POD GREEN LOCKED ' + locked + ' → ' + (lockRes.pod && lockRes.pod.p));
  } catch (e) {}
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
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;margin:0}
body{background:#0a0a0c;color:#e8e6e1;font:15px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:16px 14px 40px}
/* FULLSCREEN FIT — ?fs=1 or /full */
body.fs{overflow:auto}
body.fs .wrap{max-width:none;width:100%;min-height:100vh;min-height:100dvh;margin:0;padding:18px clamp(16px,3vw,40px) 48px;box-sizing:border-box}
body.fs .scopes{max-height:28vh;overflow:auto;padding-right:4px}
body.fs #fixlist{max-height:36vh;overflow:auto}
#fsBtn{position:fixed;top:10px;right:12px;z-index:9999;background:#B91C3F;color:#fff;border:0;border-radius:999px;padding:10px 14px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45)}
#fsBtn:hover{filter:brightness(1.08)}
body.fs #fsBtn{background:#1a7f4b}
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
.chip.green{background:#143d28;border-color:#1a7f4b;color:#7dffb0;font-weight:800;cursor:not-allowed;opacity:.92}
.chip.green.sel{outline:2px solid #7dffb0;background:#1a4a32}
.chip.green .n{color:#9dff9a}
.chip.nextwrap{display:inline-flex;align-items:stretch;padding:0;gap:0;overflow:hidden}
.chip.nextwrap .nextlab{padding:8px 12px;cursor:pointer}
.chip.nextwrap .nextskip{border:0;border-left:1px solid #5a4a20;background:#2a2130;color:#FFB81C;padding:8px 12px;font-size:16px;font-weight:900;cursor:pointer;line-height:1}
.chip.nextwrap .nextskip:hover{background:#3a3018;color:#fff}
.chip.nextwrap.sel{outline:2px solid #FFB81C}
input.topic{width:100%;margin-top:8px;background:#1c1c22;border:1px solid #2c2c34;color:#e8e6e1;border-radius:10px;padding:10px;font-size:14px}
.btns{display:flex;gap:12px;margin:16px 0}
button{flex:1;border:0;border-radius:14px;padding:20px;font-size:20px;font-weight:800;letter-spacing:1px;cursor:pointer}
#go{background:#FFB81C;color:#1a1a1a;box-shadow:0 0 24px rgba(255,184,28,.35)}#go:disabled{background:#20202a;color:#555;box-shadow:none}
#stop{background:#B91C3F;color:#fff}#clear{background:#20202a;color:#cfc7bd}
#btnIndexSite:disabled,#btnIndexDelta:disabled{opacity:.4;cursor:not-allowed;filter:grayscale(.5)}
#indexBar{height:100%;width:0;background:linear-gradient(90deg,#EAC15C,#1a8f4c);border-radius:4px;transition:width .3s}
#fix{width:100%;margin-top:8px;background:linear-gradient(180deg,#FFB81C,#e0a015);color:#1a1a1a;display:none;font-size:18px;animation:fixpulse 1.6s ease-in-out infinite}
.stage-tag{display:inline-block;margin:4px 0 2px;padding:6px 12px;border-radius:999px;background:#1c1c22;border:1px solid #FFB81C;color:#FFB81C;font-size:12px;font-weight:700;letter-spacing:.04em}
.stagemodal{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.72);align-items:center;justify-content:center;padding:18px}
.stagemodal.open{display:flex}
.stagemodal-card{background:#141417;border:1px solid #2c2c34;border-radius:16px;padding:18px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.55)}
.stagemodal-h{font-size:18px;font-weight:800;color:#FFB81C;margin-bottom:6px}
.stagemodal-sub{font-size:13px;color:#8a8680;margin-bottom:14px;line-height:1.4}
.stagetags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.stagetag{background:#1c1c22;border:1px solid #2c2c34;color:#d8d6d1;border-radius:999px;padding:10px 14px;font-size:13px;font-weight:700;cursor:pointer;user-select:none}
.stagetag.sel{background:#B91C3F;border-color:#B91C3F;color:#fff}
.stagetag.all.sel{background:#FFB81C;border-color:#FFB81C;color:#1a1a1a}
.stagemodal-actions{display:flex;gap:10px;justify-content:flex-end}
.stagemodal-actions #stageConfirm{flex:0 0 auto;padding:12px 18px;font-size:15px;background:#FFB81C;color:#1a1a1a;border:0;border-radius:12px;font-weight:800;cursor:pointer}
@keyframes fixpulse{0%,100%{box-shadow:0 0 18px rgba(255,184,28,.35)}50%{box-shadow:0 0 44px rgba(255,184,28,.8)}}
#force{width:100%;margin-top:8px;background:#2a1215;color:#ff9aa8;border:1px solid #B91C3F;font-size:15px}
.piles{display:flex;gap:10px;margin-top:10px}.pile{flex:1;background:#1c1c22;border-radius:10px;padding:10px;text-align:center}.pile b{display:block;font-size:22px}
.pile.near.pill-sim{cursor:pointer;border:1px solid #5a4a20;background:#2a2418;border-radius:20px}
.pile.near.pill-sim:hover{border-color:#FFB81C}
.pile.near.pill-sim.sel{outline:2px solid #FFB81C;background:#3a3018}
.pass b{color:#39FF14;font-family:"Segoe UI",Impact,Haettenschweiler,Arial Black,sans-serif;font-size:34px;font-weight:900;letter-spacing:.02em;text-shadow:0 0 8px rgba(57,255,20,.85),0 0 22px rgba(57,255,20,.55),0 0 40px rgba(57,255,20,.35)}.near b{color:#FFB81C}.sub b{color:#E08A2B}.stub b{color:#B91C3F}
.fin-count{display:inline-block;font-family:"Segoe UI",Impact,Haettenschweiler,Arial Black,sans-serif;font-size:2.15rem;font-weight:900;line-height:1;letter-spacing:.03em;color:#39FF14;text-shadow:0 0 8px rgba(57,255,20,.9),0 0 22px rgba(57,255,20,.6),0 0 42px rgba(57,255,20,.4);vertical-align:-0.12em;margin:0 2px}
.fin-label{color:#9dff9a;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.stage{font-size:14px}.stage b{color:#FFB81C}
.fixrate{font:800 18px/1.25 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#c8c2b8;letter-spacing:.02em;margin:8px 0 2px}
.fixrate b{color:#FFB81C;font-weight:900}
.fixpct{font:900 42px/1.05 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#FFB81C;letter-spacing:-.02em;margin:10px 0 4px;text-shadow:0 0 24px rgba(255,184,28,.25)}
.fixpct small{display:block;font:600 12px/1.3 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#8a8680;letter-spacing:0;margin-top:6px;font-weight:600}
.bar{height:14px;background:#1c1c22;border-radius:8px;overflow:hidden;margin:8px 0}.bar>div{height:100%;background:linear-gradient(90deg,#B91C3F,#FFB81C);width:0%;transition:width .5s}
.err{background:#2a1416;border:1px solid #B91C3F;color:#ff9aa8;border-radius:10px;padding:10px;margin-top:10px;font-size:13px;display:none}
.fitem{background:#141417;border:1px solid #24242a;border-radius:10px;padding:9px 11px;margin-bottom:8px}
.fitem.fok{border-color:#1a7f4b;background:#111a14}
.fitem.fsimhi{border-color:#FFB81C}
.famtag{display:inline-block;background:#2a2130;border:1px solid #FFB81C;color:#FFB81C;border-radius:999px;padding:1px 8px;font-size:10px;font-weight:800;margin-right:6px;letter-spacing:.03em}
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
.pubfeed{margin-top:12px;padding-top:10px;border-top:1px solid #2a2824;font-size:12px;line-height:1.4;max-height:220px;overflow:auto}
.pubfeed .ph{color:#8a8680;font-size:11px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.pubfeed .pr{margin:4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pubfeed .pr .ok{color:#7dffb0;font-weight:700}
.pubfeed .pr a{color:#F6C445;text-decoration:none;font-weight:600}
.pubfeed .pr .src{color:#8a8680;font-size:10px}
.lapbar{margin-top:8px;height:6px;background:#1a1916;border-radius:4px;overflow:hidden}
.lapbar>i{display:block;height:100%;background:linear-gradient(90deg,#1a7f4b,#FFB81C);width:0;transition:width .4s}
#fixArm.locked{position:relative}
#fixArm.locked .fix-lockable{opacity:.38;pointer-events:none;filter:grayscale(.4)}
#runLockBanner{display:none;margin:10px 0 0;padding:10px 12px;border-radius:10px;border:1px solid #B91C3F;background:rgba(185,28,63,.15);color:#ff8a9a;font-weight:800;font-size:13px}
#fixArm.locked #runLockBanner{display:block}
#fixArm.locked #stop,#fixArm.locked #force{opacity:1!important;pointer-events:auto!important;filter:none!important}
/* Daily Driver / generator stays usable while the fix machine runs — only Fix Machine knobs lock */
</style></head><body><button type=button id=fsBtn title="Fit to screen">⛶ FULL SCREEN</button><div class=wrap>
<h1>🧼 KORY'S PULSE CONTROL PANEL</h1>
<div class=dim>One page. Fix machine + hourly generator. Every knob writes <b>gen/config.json</b> live — no restarts. The daemon never raises its own rate; only you can.</div>

<h2>Fix Machine</h2>
<div style="margin:0 0 10px"><a href="/square" style="display:inline-block;background:#F6C445;color:#111;font-weight:800;text-decoration:none;padding:10px 14px;border-radius:10px">⬛ SQUARE BUILDER</a>
<span class=dim style="margin-left:10px">Pexels click · face+top · Top10 / Q&A / Style internals · black→green</span></div>
<div id=fixArm>
<div class=dim><b>NEXT 30</b> = run this batch of 30. Press <b>→</b> to skip to the next group of 30 if this one is stuck. Green DONE = already fixed. Status bars show on every URL while it improves.</div>
<div id=runLockBanner>🔒 FIX RUNNING — scope / CLEAR / GO / batch knobs locked. FIX STOP &amp; FIX FORCE STOP still work (fixer only — Daily Driver keeps running).</div>
<div class="card fix-lockable"><div class=lab>Scope</div><div class=scopes id=scopes>loading…</div>
<input class=topic id=topic placeholder="…or type a topic / id-prefix (e.g. gp0, ca11)"></div>
<div class=btns>
  <button class=fix-lockable id=go disabled>RUN REPORT</button>
  <button class=fix-lockable id=clear>CLEAR</button>
  <button id=stop>FIX STOP</button>
</div>
<div class=stage-tag id=stageTag>stage · ALL</div>
<button class=fix-lockable id=fix>GO ▸ FIX IT</button>
<button id=force>■ FIX FORCE STOP · kill fixer only</button>
<div class="card fix-lockable" id=concCard>
  <div class=knob>
    <div>
      <div class=kn>TRY · lockstep / tandem</div>
      <div class=kd>ON = <b>1 URL · 5 workers</b> (1 each on sim · quality · image · title · 13/13). OFF = <b>30 workers · 1 URL each</b>, finish independently.</div>
    </div>
    <button type=button class="toggle off" id=tSoloTriple onclick="toggleSoloTriple()">OFF</button>
  </div>
  <div id=batchKnobs>
  <div class=knob style="margin-top:12px"><div><div class=kn>URLs fixed at a time</div><div class=kd>when tandem OFF · with tandem ON this stays <b>1</b></div></div>
    <div class=stepper><button class=sbtn onclick="bump('fixConcurrency',-1)">–</button><div class=val id=vFix>–</div><button class=sbtn onclick="bump('fixConcurrency',1)">+</button></div></div>
  <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',1)">1</button>
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',10)">10</button>
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',20)">20</button>
    <button type=button class=sbtn style="width:auto;padding:0 14px;font-size:12px" onclick="api('fixConcurrency',30)">30</button>
  </div>
  </div>
</div>
<div class=card><div class=stage id=stage>Idle. Pick a scope and press RUN REPORT.</div>
<div class=fixrate id=fixRate title="Live fix throughput">— /min · — /hr</div>
<div class=fixpct id=fixPct title="Sitewide fixer progress">—%</div>
<div class=bar><div id=barfill></div></div>
<div class=piles>
  <div class="pile pass"><b id=pPass>–</b>PASS</div>
  <div class="pile near pill-sim" id=pileSim title="Similarity pile — click to select Similarity stage only">
    <b id=pNear>–</b>SIMILARITY
    <div style="font-size:10px;color:#FFB81C;margin-top:4px;font-weight:600" id=pNearHint>click → sim-only</div>
  </div>
  <div class="pile sub"><b id=pSub>–</b>SUB 13/13</div>
  <div class="pile stub"><b id=pStub>–</b>STUB</div>
</div>
<div class=err id=err></div></div>
<div class=card id=fixcard style="display:none"><div class=lab>🔧 Fixing now — <b id=fixModeLab>batch mode</b> · <span id=fixStageLab>ALL stages</span></div><div id=fixlist></div></div>
</div>

<div id=stageModal class=stagemodal aria-hidden=true>
  <div class=stagemodal-card>
    <div class=stagemodal-h>What to fix?</div>
    <div class=stagemodal-sub>Only stages the <b>last scan</b> found work for. Pick <b>ALL</b> (sim → quality → image → title → 13/13 · quality /10) or one step.</div>
    <div class=stagetags id=stageTags></div>
    <div class=stagemodal-actions>
      <button type=button class=sbtn style="width:auto;padding:0 16px" id=stageCancel>Cancel</button>
      <button type=button id=stageConfirm>Continue</button>
    </div>
  </div>
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
      <div class=pubfeed id=pubFeed title="Recently published Q&amp;As"></div>
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

<div class=card id=indexCard>
  <div class=lab>SEO IndexNow</div>
  <div class=dim style="margin:0 0 10px">Full site ≈ weekly · Delta = new Q&amp;As + recently fixed (24h cooldown). Money pages first. Separate from Daily Driver / Fixer.</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin:0 0 10px">
    <button type=button class=sbtn id=btnIndexSite style="width:auto;padding:0 16px;background:#1a4a7a;color:#fff;font-weight:800">Index Site</button>
    <button type=button class=sbtn id=btnIndexDelta style="width:auto;padding:0 16px;background:#1a8f4c;color:#fff;font-weight:800">Index Delta</button>
    <button type=button class=sbtn id=btnIndexStop style="width:auto;padding:0 16px;background:#7a1520;color:#fff;font-weight:800;display:none">Stop Index</button>
  </div>
  <div class=stage id=indexLive style="min-height:1.4em">—</div>
  <div class=bar style="margin-top:8px"><div id=indexBar></div></div>
  <div class=dim id=indexLast style="margin-top:8px;font-size:12px">Last runs load here.</div>
</div>
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
function toggleSoloTriple(){ api('fixSoloTriple',!cfg.fixSoloTriple); }
function renderCfg(){var m=mode();
 document.getElementById('mEPH').className='modebtn'+(m==='eph'?' sel':'');
 document.getElementById('mPTH').className='modebtn'+(m==='pth'?' sel':'');
 document.getElementById('rateName').textContent=m==='pth'?'perTopicPerHour':'entriesPerHour';
 document.getElementById('vRate').textContent=m==='pth'?(cfg.perTopicPerHour!=null?cfg.perTopicPerHour:'–'):(cfg.entriesPerHour!=null?cfg.entriesPerHour:'–');
 document.getElementById('vDep').textContent=(cfg.deployEveryHours===0||cfg.deployEveryHours==='0')?'OFF':cfg.deployEveryHours;
 document.getElementById('vFix').textContent=cfg.fixConcurrency!=null?cfg.fixConcurrency:30;
 var solo=!!cfg.fixSoloTriple;
 var ts=document.getElementById('tSoloTriple');
 if(ts){ ts.textContent=solo?'ON':'OFF'; ts.className='toggle '+(solo?'on':'off'); }
 var bk=document.getElementById('batchKnobs');
 if(bk){ bk.style.opacity=solo?'0.35':'1'; bk.style.pointerEvents=solo?'none':'auto'; }
 if(cfg.fixStage)pickStage=String(cfg.fixStage).toLowerCase();
 syncStageTag();
 // highlight 1/10/20/30 presets
 try{
  var fc=Number(cfg.fixConcurrency)||1;
  document.querySelectorAll('#batchKnobs button.sbtn').forEach(function(b){
   var t=String(b.textContent||'').trim();
   if(t!=='1'&&t!=='10'&&t!=='20'&&t!=='30')return;
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
function fmtCd(ms){if(ms<=0)return '';var s=Math.ceil(ms/1000);var d=Math.floor(s/86400);s%=86400;var h=Math.floor(s/3600);s%=3600;var m=Math.floor(s/60);if(d)return d+'d '+h+'h';if(h)return h+'h '+m+'m';return m+'m';}
function renderIndex(ix){
 ix=ix||{};
 var live=document.getElementById('indexLive');
 var bar=document.getElementById('indexBar');
 var last=document.getElementById('indexLast');
 var bs=document.getElementById('btnIndexSite');
 var bd=document.getElementById('btnIndexDelta');
 var bk=document.getElementById('btnIndexStop');
 if(!live)return;
 var running=!!ix.running;
 if(bk)bk.style.display=running?'inline-block':'none';
 var note=ix.note||'—';
 if(ix.stats&&ix.stats.total){
  note+=' · catalog '+Number(ix.stats.indexed||0).toLocaleString()+' / '+Number(ix.stats.total).toLocaleString()+' ('+(ix.stats.pct||0)+'%)';
 }
 live.textContent=note;
 var pct=(ix.total>0)?Math.round(100*(ix.done||0)/ix.total):0;
 if(bar)bar.style.width=(running?pct:(ix.stage==='done'?100:0))+'%';
 var cool=ix.cooldown||{};
 var siteLeft=Number(cool.siteMs||0);
 var deltaLeft=Number(cool.deltaMs||0);
 if(bs){
  bs.disabled=running||siteLeft>0;
  bs.textContent=siteLeft>0?('Index Site · next in '+fmtCd(siteLeft)):(running&&ix.mode==='site'?'Indexing Site…':'Index Site');
 }
 if(bd){
  bd.disabled=running||deltaLeft>0;
  bd.textContent=deltaLeft>0?('Index Delta · next in '+fmtCd(deltaLeft)):(running&&ix.mode==='delta'?'Indexing Delta…':'Index Delta');
 }
 var lines=[];
 var L=ix.last||{};
 if(L.site){lines.push('Last Site: '+new Date(L.site.at).toLocaleString()+' · '+Number(L.site.urls||0).toLocaleString()+' URLs · '+(L.site.pct!=null?L.site.pct+'% indexed':''));}
 if(L.delta){lines.push('Last Delta: '+new Date(L.delta.at).toLocaleString()+' · '+Number(L.delta.urls||0).toLocaleString()+' URLs · '+(L.delta.pct!=null?L.delta.pct+'% indexed':''));}
 if(last)last.textContent=lines.length?lines.join(' · '):'No IndexNow runs yet from this panel.';
}
function startIndex(mode){
 fetch('/api/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'start',mode:mode})})
  .then(function(r){return r.json()}).then(function(j){
    if(!j||!j.ok){alert((j&&j.error)||'IndexNow blocked');}
    if(j&&j.indexnow)renderIndex(j.indexnow);
  }).catch(function(e){alert(String(e));});
}
document.getElementById('btnIndexSite').onclick=function(){if(this.disabled)return;if(!confirm('Index Site — full catalog + money pages? Greys out for 7 days.'))return;startIndex('site');};
document.getElementById('btnIndexDelta').onclick=function(){if(this.disabled)return;if(!confirm('Index Delta — new Q&As + recently fixed + money pages? Greys out for 24 hours.'))return;startIndex('delta');};
document.getElementById('btnIndexStop').onclick=function(){fetch('/api/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'stop'})});};

var scope=null;
function loadScopes(){fetch('/api/scope').then(function(r){return r.json()}).then(function(d){
 var el=document.getElementById('scopes');
 var html=[];
 // Sitewide fixer % — climbs as ledger grows (you are ~1–2% now)
 var pctEl=document.getElementById('fixPct');
 if(pctEl){
  // Owner: base = full library (~35,711), NEVER open-queue size (~5.7k).
  var pct=(d.pctDone!=null)?d.pctDone:((d.pods&&d.pods.pctDone)!=null?d.pods.pctDone:0);
  var left=d.openQueue!=null?d.openQueue:(d.needFix!=null?d.needFix:(d.total||0));
  var fixed=d.fixed||0;
  var base=Number(d.baseline||(d.pods&&d.pods.baseline)||0);
  if(!base||base<1000) base=Number(d.total)||0;
  var styleNote=(d.styleParked===false||d.styleActive)?' · Style in population':'';
  window.__fixPctDone=pct;
  pctEl.innerHTML=pct+'%<small><b style="color:#FFB81C">base '+Number(base).toLocaleString()+'</b> · '+Number(fixed).toLocaleString()+' fixed · '+Number(left).toLocaleString()+' open'+styleNote+'</small>';
  var bf=document.getElementById('barfill');
  if(bf && !(document.body.classList.contains('fix-running'))) bf.style.width=Math.min(100,pct)+'%';
 }
 d.pillars.forEach(function(p){
  var g=p.green||p.locked;
  if(p.p==='next30'){
   var bat=(p.batch&&p.batches)?(' · '+p.batch+'/'+p.batches):'';
   html.push('<span class="chip all nextwrap" data-s="next30" data-locked="0" title="'+(p.note||'Next 30')+'"><span class=nextlab>NEXT 30'+bat+'</span><button type=button class=nextskip title="Skip to next group of 30" aria-label="Skip next 30">→</button></span>');
   return;
  }
  var cls='chip'+(g?' green locked':'');
  html.push('<span class="'+cls+'" data-s="'+p.p+'" data-locked="'+(g?'1':'0')+'" title="'+(g?'Already fixed — locked':(p.note||''))+'">'+p.name+' <span class=n>'+p.n+'</span></span>');
 });
 el.innerHTML=html.join('');
 el.querySelectorAll('.chip[data-s]').forEach(function(c){
  var lab=c.querySelector('.nextlab')||c;
  lab.onclick=function(e){
   e.stopPropagation();
   if(c.getAttribute('data-locked')==='1'||c.classList.contains('locked')){
    alert('DONE is locked — already fixed. Use NEXT 30.');
    return;
   }
   document.getElementById('topic').value='';
   sel(c.dataset.s,c);
  };
  var sk=c.querySelector('.nextskip');
  if(sk)sk.onclick=function(e){
   e.preventDefault();e.stopPropagation();
   if(document.body.classList.contains('fix-running')){alert('Stop the current fix first, then skip.');return;}
   fetch('/api/next30',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'skip'})})
    .then(function(r){return r.json()})
    .then(function(j){
      if(!j||!j.ok){alert((j&&j.error)||'Skip failed');return;}
      scopeCacheBump();
      loadScopes();
      var note='Skipped to NEXT 30 · batch '+(j.batch||'?')+'/'+(j.batches||'?')+' · '+(j.n||0)+' URLs';
      document.getElementById('stage').innerHTML='<b>SKIPPED</b> · '+note;
    }).catch(function(err){alert(String(err));});
  };
 });
 var next=el.querySelector('.chip[data-s="next30"]');
 if(next)sel('next30',next);
});}
function scopeCacheBump(){ /* force refresh on next /api/scope */ }
function sel(s,c){scope=s;document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});if(c)c.classList.add('sel');document.getElementById('go').disabled=!scope;}
document.getElementById('topic').oninput=function(e){var v=e.target.value.trim();document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});scope=v||null;document.getElementById('go').disabled=!scope;};
document.getElementById('fix').onclick=function(){if(document.body.classList.contains('fix-running'))return;var s=scope;
 if(!s){fetch('/api/status').then(function(r){return r.json()}).then(function(j){var st=j&&j.status||{};s=st.lockedScope||st.scope;if(!s){alert('Pick a pillar chip first — will not jump to ALL.');return;}openStagePicker(s);}).catch(function(){alert('Pick a pillar chip first.');});return;}openStagePicker(s);};
function goFix(s,stage){var st=stage||pickStage||'all';fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'transform',scope:s,fixStage:st})});document.getElementById('stage').innerHTML='🔧 Fixing <b>'+s+'</b> · stage <b>'+stageLabel(st)+'</b> (locked until done)…';}
document.getElementById('go').onclick=function(){if(document.body.classList.contains('fix-running'))return;if(!scope)return;fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'scan',scope:scope})});document.getElementById('stage').innerHTML='📊 Running report on <b>'+scope+'</b> (locked)…';};

var STAGE_OPTS=[
 {id:'all',lab:'ALL'},
 {id:'similarity',lab:'Similarity'},
 {id:'quality',lab:'Quality'},
 {id:'title',lab:'Title'},
 {id:'image',lab:'Image'},
 {id:'gate',lab:'13/13'}
];
var pickStage='all';
var stagePending=null; // {scope}
var lastPiles={PASS:0,NEAR_DUP:0,SUB13:0,STUB:0};
function stageLabel(id){
 var o=STAGE_OPTS.filter(function(x){return x.id===id})[0];
 return o?o.lab:(id||'ALL');
}
/** Stages allowed from last scan piles — order: sim → quality → image → title → 13/13 */
function allowedStagesFromPiles(p){
 p=p||lastPiles||{};
 var near=Number(p.NEAR_DUP)||0, sub=Number(p.SUB13)||0, stub=Number(p.STUB)||0;
 var out=[];
 if(near+sub+stub>0)out.push({id:'all',lab:'ALL',n:near+sub+stub});
 if(near>0)out.push({id:'similarity',lab:'Similarity',n:near});
 if(stub>0||sub>0)out.push({id:'quality',lab:'Quality',n:stub+sub});
 if(stub+sub+near>0){
  out.push({id:'title',lab:'Title',n:stub+sub+near});
  out.push({id:'image',lab:'Image',n:stub+sub+near});
 }
 if(sub>0||stub>0)out.push({id:'gate',lab:'13/13',n:sub+stub});
 return out;
}
function syncStageTag(){
 var el=document.getElementById('stageTag');
 if(el)el.textContent='stage · '+stageLabel(pickStage|| (cfg&&cfg.fixStage)||'all').toUpperCase();
 var fl=document.getElementById('fixStageLab');
 if(fl)fl.textContent=(pickStage==='all'||!pickStage)?'ALL stages · sim→quality→image→title→13/13 · quality /10':('ONLY · '+stageLabel(pickStage));
}
function openStagePicker(s){
 var allowed=allowedStagesFromPiles(lastPiles);
 if(!allowed.length){alert('Nothing to fix — run REPORT first (or piles are clean).');return;}
 stagePending={scope:s};
 if(!allowed.some(function(o){return o.id===pickStage;}))pickStage=allowed[0].id;
 var modal=document.getElementById('stageModal');
 var tags=document.getElementById('stageTags');
 tags.innerHTML=allowed.map(function(o){
  var sel=o.id===pickStage;
  var cnt=(o.n!=null&&o.id!=='all')?' · '+o.n:'';
  return '<button type=button class="stagetag'+(o.id==='all'?' all':'')+(sel?' sel':'')+'" data-s="'+o.id+'">'+o.lab+cnt+'</button>';
 }).join('');
 tags.querySelectorAll('.stagetag').forEach(function(b){
  b.onclick=function(){
   pickStage=b.getAttribute('data-s');
   tags.querySelectorAll('.stagetag').forEach(function(x){x.classList.toggle('sel',x.getAttribute('data-s')===pickStage);});
   syncStageTag();
  };
 });
 modal.classList.add('open');
 modal.setAttribute('aria-hidden','false');
}
function closeStagePicker(){
 var modal=document.getElementById('stageModal');
 modal.classList.remove('open');
 modal.setAttribute('aria-hidden','true');
 stagePending=null;
}
document.getElementById('stageCancel').onclick=function(){closeStagePicker();};
document.getElementById('stageConfirm').onclick=function(){
 if(!stagePending)return;
 var s=stagePending.scope,st=pickStage||'all';
 var allowed=allowedStagesFromPiles(lastPiles).map(function(o){return o.id;});
 if(allowed.indexOf(st)<0){alert('That stage is not in the last scan — pick again.');return;}
 closeStagePicker();
 api('fixStage',st).then(function(){
  syncStageTag();
  goFix(s,st);
 });
};
document.getElementById('stageModal').onclick=function(e){if(e.target===this)closeStagePicker();};
// SIM pile pill — park all near-dup URLs together; click selects Similarity (later)
(function(){
 var el=document.getElementById('pileSim');
 if(!el)return;
 el.onclick=function(){
  if(!(lastPiles&&lastPiles.NEAR_DUP)){alert('No sim-needed URLs parked — run REPORT first.');return;}
  pickStage='similarity';
  el.classList.add('sel');
  syncStageTag();
  api('fixStage','similarity');
 };
})();
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
 lastPiles={PASS:Number(p.PASS)||0,NEAR_DUP:Number(p.NEAR_DUP)||0,SUB13:Number(p.SUB13)||0,STUB:Number(p.STUB)||0};
 var simPill=document.getElementById('pileSim');
 if(simPill){
  var nSim=lastPiles.NEAR_DUP||0;
  simPill.classList.toggle('sel', pickStage==='similarity');
  var hint=document.getElementById('pNearHint');
  if(hint)hint.textContent=nSim?(nSim.toLocaleString()+' · click for sim-only'):'empty';
 }
 var stage=st.stage||'idle',msg='<b>'+stage.toUpperCase()+'</b>';
 if(st.scope)msg+=' · '+st.scope;if(st.phase&&st.phase!=='idle')msg+=' · '+st.phase;
 if(st.scanned!=null)msg+=' · <b style="color:#FFB81C">scanned '+st.scanned.toLocaleString()+(st.total?'/'+st.total.toLocaleString():'')+'</b>';
 var finLab=((st.fixStage==='all'||!st.fixStage)?'finished 5/5':('finished · '+stageLabel(st.fixStage)));
 if(st.remaining!=null)msg+=' · <b style="color:#FFB81C">remaining '+st.remaining.toLocaleString()+' ↓</b> · <span class=fin-label>'+finLab+'</span> <span class=fin-count>'+(st.fixedTotal||0).toLocaleString()+'</span>';
 if(st.currentId)msg+=' · now '+st.currentId;
 if(st.breaker!=null)msg+=' · breaker '+st.breaker+'%';
 if(stage==='done')msg+=st.verified?' · <span style="color:#39FF14;font-weight:900;text-shadow:0 0 10px rgba(57,255,20,.7)">✅ VERIFIED CLEAN</span>':' · check report';
 if(st.note)msg+='<br><span style=color:#8a8680>'+st.note+'</span>';
 document.getElementById('stage').innerHTML=msg;
 var rateEl=document.getElementById('fixRate');
 if(rateEl){
  var pm=(st.fixesPerMin!=null)?st.fixesPerMin:(s.fixRate&&s.fixRate.fixesPerMin);
  var ph=(st.fixesPerHour!=null)?st.fixesPerHour:(s.fixRate&&s.fixRate.fixesPerHour);
  if(pm==null)pm=0;if(ph==null)ph=0;
  rateEl.innerHTML='<b>'+Number(pm).toLocaleString()+'</b> /min · <b>'+Number(ph).toLocaleString()+'</b> /hr';
 }
 // Live run bar: SCAN = scanned/total · FIX = finished/todo. Idle = sitewide credit % only.
 // NEVER invent sitewide % from (35k - remaining)/35k during a run.
 var pctElLive=document.getElementById('fixPct');
 var bfLive=document.getElementById('barfill');
 var runScan=stage==='scan'&&st.total>0;
 var runFix=(stage==='transform'||stage==='verify')&&(st.todo>0||st.total>0||st.remaining!=null);
 if(runScan){
  var scN=Number(st.scanned)||0, scT=Number(st.total)||1;
  var scPct=Math.min(100,Math.round(scN/scT*1000)/10);
  if(bfLive)bfLive.style.width=scPct+'%';
  if(pctElLive)pctElLive.innerHTML=scPct+'%<small><b style="color:#FFB81C">SCANNING</b> · '+scN.toLocaleString()+' / '+scT.toLocaleString()+(st.phase?(' · '+st.phase):'')+'</small>';
 }else if(runFix){
  var todoN=Number(st.todo)||Number(st.total)||0;
  var doneN=(st.fixedTotal!=null)?Number(st.fixedTotal):((st.transformed!=null)?Number(st.transformed):0);
  if(st.remaining!=null&&todoN) doneN=Math.max(0,todoN-Number(st.remaining));
  var fxPct=todoN?Math.min(100,Math.round(doneN/todoN*1000)/10):0;
  if(bfLive)bfLive.style.width=fxPct+'%';
  if(pctElLive)pctElLive.innerHTML=fxPct+'%<small><b style="color:#FFB81C">FIXING · '+(stageLabel(st.fixStage||pickStage||'all').toUpperCase())+'</b> · '+(st.currentId||(st.batchIds&&st.batchIds[0])||'…')+' · '+doneN.toLocaleString()+' / '+todoN.toLocaleString()+(st.remaining!=null?(' · '+Number(st.remaining).toLocaleString()+' left'):'')+'</small>';
 }else{
  var pct=0;
  if(window.__fixPctDone!=null) pct=window.__fixPctDone;
  if(stage==='done' && window.__fixPctDone==null)pct=100;
  if(bfLive)bfLive.style.width=Math.min(100,pct)+'%';
  // refresh sitewide % from scope (throttled via scope cache)
  if(!window.__fixPctTick || Date.now()-window.__fixPctTick>2000){
   window.__fixPctTick=Date.now();
   fetch('/api/scope').then(function(r){return r.json()}).then(function(d){
    if(document.body.classList.contains('fix-running'))return; // don't clobber live scan/fix bar
    var pctEl=document.getElementById('fixPct');
    if(!pctEl||!d)return;
    var p=(d.pctDone!=null)?d.pctDone:0;
    var left=d.openQueue!=null?d.openQueue:(d.needFix!=null?d.needFix:d.total||0);
    var base=Number(d.baseline||0);
    if(!base||base<1000) base=Number(d.openQueue||d.total)||0;
    window.__fixPctDone=p;
    var styleNote=(d.styleParked===false||d.styleActive)?' · Style in population':'';
    pctEl.innerHTML=p+'%<small><b style="color:#FFB81C">base '+Number(base).toLocaleString()+'</b> · '+Number(d.fixed||0).toLocaleString()+' fixed · '+Number(left).toLocaleString()+' open'+styleNote+'</small>';
    document.getElementById('barfill').style.width=Math.min(100,p)+'%';
   }).catch(function(){});
  }
 }
 var fx=document.getElementById('fix'),np=(p.NEAR_DUP||0)+(p.STUB||0)+(p.SUB13||0);
 if(busy){fx.style.display='none';}
  else if((stage==='scan-done'||stage==='done')&&np>0){
  var stLab=stageLabel((cfg&&cfg.fixStage)||pickStage||'all');
  fx.style.display='block';
  fx.innerHTML='✨ Fix '+(p.NEAR_DUP||0).toLocaleString()+' similarity + '+(p.SUB13||0).toLocaleString()+' sub-13 + '+(p.STUB||0).toLocaleString()+' stubs — '+stLab.toUpperCase()+' · '+(cfg.fixConcurrency||30)+' workers · 1 URL each · quality /10';
 }
 else fx.style.display='none';
 // Keep RUN REPORT lit whenever a scope is selected (unlock after stale runs)
 var goBtn=document.getElementById('go');
 if(goBtn && scope && !busy) goBtn.disabled=false;
 var er=document.getElementById('err');if(st.error){er.style.display='block';er.textContent='⛔ '+st.error;}else er.style.display='none';
 var fc=document.getElementById('fixcard'),fl=document.getElementById('fixlist'),fp=s.fix||{},fkeys=Object.keys(fp);
 if((stage==='transform'||stage==='verify')&&fkeys.length){fc.style.display='block';
   var ml=document.getElementById('fixModeLab');
   if(ml)ml.textContent=(st.fixConcurrency===1||(st.note&&/1 URL/i.test(st.note)))?('1 URL · 5 parts in tandem (1w each)'):((st.batchSize||st.fixConcurrency||30)+' workers · 1 URL each · finish independently');
   fl.innerHTML=fkeys.slice(-40).reverse().map(function(id){var v=fp[id]||{};var c=v.checks||{};
     // Chip order: sim → quality → image → title → 13/13
     var simPct=(v.ov!=null?v.ov:null);
     var pc=Math.min(100, Number(simPct)||0);
     var simLab=(simPct==null?'sim ?':'sim '+simPct+'%');
     // Quality chip = x/10 only (never show gate /13 here)
     var iqRaw=(typeof v.iq==='number')?v.iq:null;
     var iq=(iqRaw==null)?null:(iqRaw>=11?10:Math.max(0,Math.min(10,Math.round(iqRaw))));
     var qLab=(iq!=null?'quality '+iq+'/10':'quality');
     var tandem=v.workers===5;
     var fam=v.family?('<span class=famtag title="sim family">fam '+esc(String(v.family)).slice(0,18)+'</span> '):'';
     var over=simPct!=null&&simPct>=30;
     function chip(k,lab){var s2=c[k]||'pending';var m=({done:['✓','#1a7f4b'],fixed:['✓','#1a7f4b'],active:['⏳','#FFB81C'],failed:['✗','#B91C3F'],pending:['○','#666'],wait:['…','#888'],skip:['–','#444']})[s2]||['○','#666'];var extra=(tandem&&s2==='active')?' · 1w':'';return '<span class=chp style="color:'+m[1]+'">'+m[0]+' '+lab+extra+'</span>';}
     return '<div class="fitem'+(v.status==='approved'?' fok':'')+(over?' fsimhi':'')+'"><div class=fhdr><span class=fid>'+id+'</span><span class=ftt>'+fam+(v.kind?'['+v.kind+'] ':'')+(v.title||'')+(tandem?' · 5 parts tandem':'')+'</span></div><div class=fbar><i style="width:'+pc+'%"></i></div><div class=fchk>'+chip('similarity',simLab)+chip('quality',qLab)+chip('image','image')+chip('title','title')+chip('gate','13/13')+'</div></div>';}).join('');}
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
 if(g.todayDone!=null)gm+=' · <span class=fin-label>today</span> <span class=fin-count>'+(Number(g.todayDone)||0).toLocaleString()+'</span>'+(g.todayPublished!=null?' <span style="color:#8a8680">('+ (Number(g.todayPublished)||0)+' live)</span>':'');
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
 // Published feed (DD + scrub certify) — always show when we have rows
 (function(){
  var pf=document.getElementById('pubFeed');
  if(!pf) return;
  var rows=(g.recentResults||[]).filter(function(r){return r&&(r.published||r.pass);}).slice().reverse().slice(0,12);
  if(!rows.length){pf.innerHTML='';return;}
  pf.innerHTML='<div class=ph>Published / gated</div>'+rows.map(function(r){
    var mark=r.published?'✓':'·';
    var href=r.url||('https://pulserevops.com/knowledge/'+r.id);
    var src=r.source?(' <span class=src>· '+esc(r.source)+'</span>'):'';
    var sc=r.score!=null?(' '+r.score+'/13'):'';
    return '<div class=pr><span class=ok>'+mark+'</span> <a href="'+esc(href)+'" target=_blank rel=noopener>'+esc(r.id)+'</a> '
      +esc(r.pillarName||'')+' — '+esc(r.title||'')+sc+src+'</div>';
  }).join('');
 })();
 if(g.pillarLap||cfg.pillarLap){
  var lm=document.getElementById('lapMeta');
  var ll=document.getElementById('lapLive');
  var lap=g.lap||{};
  if(lm){
   var bit='Daily Driver ON';
   if(lap.lap!=null)bit+=' · lap #'+lap.lap;
   if(lap.done!=null&&lap.total!=null)bit+=' · <span class=fin-label>pillars</span> <span class=fin-count>'+lap.done+'</span><span style="color:#9dff9a;font-weight:800">/'+lap.total+'</span>';
   if(lap.next)bit+=' · next '+esc(lap.nextName||lap.next);
   if(g.todayDone!=null)bit+=' · <span class=fin-label>today</span> <span class=fin-count>'+(Number(g.todayDone)||0).toLocaleString()+'</span>'+(g.todayPublished!=null?' pub '+(Number(g.todayPublished)||0):'');
   lm.innerHTML=bit;
  }
  var lb=document.getElementById('lapBar'),lbw=document.getElementById('lapBarWrap');
  if(lb&&lbw&&lap.total){lbw.style.display='block';lb.style.width=Math.min(100,Math.round((lap.done||0)/lap.total*100))+'%';}
  else if(lbw)lbw.style.display='none';
  if(ll){
   var nowPill=g.currentPillarName||(lap.lastName||'');
   var nowTitle=g.currentTitle||'';
   var nowId=g.currentId||'';
   if(!nowTitle&&g.currentJob&&String(g.currentJob).indexOf(':')>0)nowTitle=String(g.currentJob).replace(/^[^:]+:\s*/,'');
   if(label==='GENERATING'&&(nowId||nowTitle||nowPill)){
    ll.innerHTML='<div class=row><span class=k>Writing now</span><br>'
      +(nowId?'<span class=now>'+esc(nowId)+'</span> ':'')
      +(nowPill?'<span style="color:#9dff9a;font-weight:700">'+esc(nowPill)+'</span>':'')
      +'<br><span style="color:#F6C445;font-weight:700;font-size:15px;line-height:1.35">'+(nowTitle?esc(nowTitle):'…')+'</span>'
      +(g.phase?'<br><span style="color:#8a8680;font-size:12px">'+esc(g.phase)+'</span>':'')
      +'</div>';
   } else if(label==='GENERATING'){
    ll.innerHTML='<div class=row><span class=k>Writing now</span><br><span class=now>starting next…</span></div>';
   } else if(g.lastResult&&g.lastResult.title){
    var lr=g.lastResult;
    ll.innerHTML='<div class=row><span class=k>Last finished</span><br><span class="'+(lr.published||lr.pass?'ok':'bad')+'">'+(lr.published?'✓':'·')+'</span> '
      +(lr.id?'<span class=now>'+esc(lr.id)+'</span> ':'')
      +esc(lr.pillarName||'')+' — '+esc(lr.title)+'</div>';
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
 if(s.indexnow)renderIndex(s.indexnow);
}).catch(function(){});}
loadScopes();loadCfg();setInterval(function(){poll();loadCfg();},3000);poll();
(function(){
  function applyFs(on){
    document.body.classList.toggle('fs',!!on);
    try{ localStorage.setItem('pulsePanelFs', on?'1':'0'); }catch(e){}
    var b=document.getElementById('fsBtn');
    if(b)b.textContent=on?'⛶ EXIT FULL':'⛶ FULL SCREEN';
  }
  var want=false;
  try{ want=localStorage.getItem('pulsePanelFs')==='1'; }catch(e){}
  if(/[?&]fs=1\\b/.test(location.search)||location.pathname==='/full') want=true;
  applyFs(want);
  var b=document.getElementById('fsBtn');
  if(b)b.onclick=function(){
    var on=!document.body.classList.contains('fs');
    applyFs(on);
    try{
      if(on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      else if(!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    }catch(e){}
  };
  if(want){
    setTimeout(function(){
      try{ if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); }catch(e){}
    },400);
  }
})();
</script></div></body></html>`;

function panelHtml() {
  const topics = Object.keys(PNAMES).sort((a, b) => PNAMES[a].localeCompare(PNAMES[b])).map(p => ({ p, name: PNAMES[p] }));
  return PANEL_TMPL.replace('__TOPICS_JSON__', JSON.stringify(topics));
}

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (await handleSquareRoutes(req, res, u, store)) return;
    if (u.pathname === '/api/scope') { const d = await scopeList(); res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(d)); }
    if (u.pathname === '/api/next30' && req.method === 'POST') {
      let b = '';
      req.on('data', (c) => { b += c; });
      req.on('end', () => {
        let d = {};
        try { d = JSON.parse(b || '{}'); } catch (e) {}
        try {
          scopeCache = { at: 0, data: null }; // bust cache so UI sees new batch
          const out = (d.action === 'skip')
            ? skipNext30()
            : (d.action === 'reset' ? takeNext30({ offset: 0 }) : takeNext30());
          opLog('NEXT30 ' + (d.action || 'take') + ' batch=' + out.batch + '/' + out.batches + ' n=' + out.n);
          res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({
            ok: true,
            n: out.n,
            ids: out.ids,
            offset: out.offset,
            batch: out.batch,
            batches: out.batches,
            left: out.left,
            totalNeed: out.totalNeed,
          }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
        }
      });
      return;
    }
    if (u.pathname === '/api/status') {
      const gen = readJSON(GEN_STATUS_F, {});
      const cfgNow = loadConfig();
      // Always refresh "done today" from disk so panel shows it even between gen ticks
      let todayDisk = null;
      try { todayDisk = readJSON(GEN + '/today_stats.json', null); } catch (e) {}
      const todayMerge = {};
      if (todayDisk && todayDisk.date) {
        todayMerge.todayDate = todayDisk.date;
        todayMerge.todayDone = Number(todayDisk.done) || 0;
        todayMerge.todayPassed = Number(todayDisk.passed) || 0;
        todayMerge.todayPublished = Number(todayDisk.published) || 0;
      }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      // Stale lock: running flag but no child → unlock so RUN REPORT lights again
      if (running && !child) {
        running = false;
        stopRequested = false;
      }
      const stLive = readJSON(STATUS_F, {});
      const rateLive = readFixRate();
      // Always prefer rolling file rates so /min + /hr stay live between status writes
      stLive.fixesPerMin = rateLive.fixesPerMin;
      stLive.fixesPerHour = rateLive.fixesPerHour;
      return res.end(JSON.stringify({
        status: stLive,
        fixRate: rateLive,
        running: !!(running && child),
        genRunning: !!genChild,
        gen: Object.assign({}, gen, todayMerge, {
          paused: !!cfgNow.paused,
          runUntil: cfgNow.runUntil || null,
          runHours: cfgNow.runHours,
          genTopics: cfgNow.genTopics,
          pillarLap: !!cfgNow.pillarLap,
          lap: readJSON(GEN + '/lap_state.json', null)
        }),
        fix: readJSON(SIM + '/fix_progress.json', {}),
        indexnow: indexnowView(),
        lessons: tailFile(LESSONS_F, 6),
        oplog: tailFile(OPLOG_F, 6)
      }));
    }
    if (u.pathname === '/api/indexnow' && req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        let out = { ok: false, error: 'action must be start|stop|status', indexnow: indexnowView() };
        if (d.action === 'status') out = { ok: true, indexnow: indexnowView() };
        else if (d.action === 'stop') out = indexnowStop();
        else if (d.action === 'start') out = indexnowStart(d.mode);
        res.writeHead(out.ok ? 200 : 409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(out));
      });
      return;
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
          if (sc === '_done_summary' || isPodLocked(sc)) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ ok: false, error: 'Pod ' + sc + ' is green/locked — cannot ' + d.action + ' again' }));
          }
          // Pod scopes stay on pod; non-pod keep report pillar lock
          if (d.action === 'transform' && !parsePodScope(sc) && repNow.scope && String(repNow.scope).toUpperCase() !== 'ALL' && !parsePodScope(repNow.scope)) {
            sc = String(repNow.scope).trim();
          }
          try {
            const cfgFile = readJSON(CONFIG_F, Object.assign({}, CONFIG_DEFAULTS));
            cfgFile.fixScope = sc;
            if (d.fixStage != null) {
              const fsSt = String(d.fixStage).toLowerCase().trim();
              cfgFile.fixStage = FIX_STAGES.includes(fsSt) ? fsSt : 'all';
            }
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
