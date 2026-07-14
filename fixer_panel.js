// fixer_panel.js — KORY'S FIXER (fresh build, 2026-07-14) · LAN, phone-first, gitignored, NEVER deployed.
// One clean control panel on a NEW port (8905). Two engines, both owner-triggered:
//   ① FIXER (auto-run) — sweeps pillars smallest-first; for each: scan → if bad, fix the full pipeline
//      (sim → quality 10/10 → image → title → 13/13 gate), then IMMEDIATELY advances to the next group.
//      Loops the whole sweep until STOP. Reuses sim_scan.js + sim_transform.js unchanged.
//   ② DAILY DRIVER (generator) — drives gen_daemon.js --once continuously (pillarLap = next group at once).
// Nothing runs until the owner presses START. DeepSeek-only by default (DS_ONLY=1) per the cost law.
'use strict';
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
let dsChat = null; try { ({ dsChat } = require('./_ds_lib')); } catch (e) {}

const PORT = parseInt(process.env.FIXER_PORT || '8905', 10);
const SIM = WD + '/sim', GEN = WD + '/gen';
try { fs.mkdirSync(SIM, { recursive: true }); } catch (e) {}
try { fs.mkdirSync(GEN, { recursive: true }); } catch (e) {}
const SUMMARY_F = SIM + '/summary.json', FIX_STATUS_F = SIM + '/run_status.json', STOP_F = SIM + '/STOP.flag';
const GEN_CONFIG_F = GEN + '/config.json', GEN_STATUS_F = GEN + '/run_status.json';
const OPLOG_F = SIM + '/fixer_panel_log.md';
const PODS_F = SIM + '/fixer_pods.json';          // engines resolve pod<N> scopes against this (explicit id lists)
const PANEL_PODS_F = SIM + '/panel_pods.json';    // panel metadata + DONE ledger (dropped pods, keyed pillar:block)
const FIXED_F = SIM + '/FIXED.md';                // append-only resolved ledger written by sim_transform
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const writeJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} };
const opLog = (line) => { try { fs.appendFileSync(OPLOG_F, `- ${new Date().toISOString()} · ${line}\n`); } catch (e) {} };
const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', tn:'Towns', sc:'Schools', tc:'Telco', er:'Electronics', q:'Q&A', hf:'Home & Family', sw:'Software', sk:'Skill Drills', sp:'Sports', cg:'Cologne', dr:'Drills' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();
const numOf = id => parseInt(String(id).replace(/\D/g, ''), 10) || 0;
// Template type from the title (source of truth = scan/registry heuristic; we do NOT re-index).
// TOP_LIST = ranked/list intent → 11-image contract; else GENERAL → 3-image contract.
const typeOf = q => /\btop\s*\d|\btop-\d|\bbest\b|\branked\b|\blist\b/i.test(String(q || '')) ? 'TOP_LIST' : 'GENERAL';
let fixerTypeFilter = null;   // null = ALL · 'GENERAL' · 'TOP_LIST' — filters the worklist at run time only

// ── panel-owned run state (NOT the child status files — the child scripts own those) ──
const fixer = { on: false, stopReq: false, sweep: 0, pillar: null, idx: 0, total: 0, scanned: 0, fixed: 0, failed: 0, note: 'idle', child: null };
const gen = { on: false, note: 'idle', child: null };

// ── scope enumeration from the live registry (cached 60s) ──
let scopeCache = { at: 0, data: null };
async function scopeList() {
  if (scopeCache.data && Date.now() - scopeCache.at < 60000) return scopeCache.data;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  const byP = {};
  let certified = 0;
  for (const e of es) { const p = pOf(e.id); if (!p || !PNAMES[p]) continue; byP[p] = (byP[p] || 0) + 1; if (typeof e.quality_score === 'number' && e.quality_score >= 10) certified++; } // real pillars only; count 10/10-certified
  const pillars = Object.keys(byP).sort((a, b) => byP[a] - byP[b]).map(p => ({ p, name: PNAMES[p] || p.toUpperCase(), n: byP[p] })); // smallest first
  const data = { total: es.length, pillars, certified };
  scopeCache = { at: Date.now(), data };
  return data;
}

// ── pods of 100, grouped by pillar (tl 1-100, tl 101-200 …). Writes fixer_pods.json so the
//    engines resolve pod<N> scopes by explicit id list. Skips pods already in the DONE ledger. ──
function loadDone() { const d = readJSON(PANEL_PODS_F, {}); return new Set(Array.isArray(d.done) ? d.done : []); }
function markPodDone(key) {
  const d = readJSON(PANEL_PODS_F, {}); const done = new Set(Array.isArray(d.done) ? d.done : []);
  done.add(key); d.done = [...done]; writeJSON(PANEL_PODS_F, d); opLog('pod DONE (dropped): ' + key);
}
function fixedIdSet() {
  const s = new Set();
  try { for (const line of fs.readFileSync(FIXED_F, 'utf8').split('\n')) { const m = line.match(/·\s*([a-z]+\d[a-z0-9]*)\s*·/i); if (m) s.add(m[1].toLowerCase()); } } catch (e) {}
  return s;
}

// ── "FIXED" counter tied to the VISUAL: an entry counts the moment all 5 levers are green
//    (sim·quality·title·image·gate all done). Persisted so it keeps climbing as entries roll out. ──
const CAMPAIGN_FIXED_F = SIM + '/panel_fixed_ids.json';
let _campaignFixed = (() => { const d = readJSON(CAMPAIGN_FIXED_F, {}); return new Set(Array.isArray(d.ids) ? d.ids : []); })();
function accrueFixed() {
  try {
    const p = readJSON(SIM + '/fix_progress.json', {});
    let changed = false;
    for (const id of Object.keys(p)) {
      const c = (p[id] && p[id].checks) || {};
      const allGreen = c.gate === 'done' && ['similarity', 'quality', 'title', 'image'].every(k => c[k] === 'done' || c[k] === 'skip');
      if (allGreen && !_campaignFixed.has(id)) { _campaignFixed.add(id); changed = true; }
    }
    if (changed) writeJSON(CAMPAIGN_FIXED_F, { ids: [..._campaignFixed], updated: new Date().toISOString() });
  } catch (e) {}
}
setInterval(accrueFixed, 1500);
async function buildPods() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = ((idx && idx.entries) || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  const byP = {};
  const blackIds = [];   // ⬛ imageless / dead-image-link entries = black squares → fix these FIRST
  const typeCount = { GENERAL: 0, TOP_LIST: 0 };
  for (const e of es) {
    const p = pOf(e.id); if (!p || !PNAMES[p]) continue;
    const t = typeOf(e.question || e.title || '');
    typeCount[t]++;
    if (fixerTypeFilter && t !== fixerTypeFilter) continue;   // template-type filter — worklist only, no re-index
    (byP[p] = byP[p] || []).push(String(e.id));
    const im = e.imgSq || e.img || '';
    if (!im || /pulse-og|pollinat|placeholder|img-missing/i.test(im)) blackIds.push(String(e.id));
  }
  // PRIORITY pillars first (owner 2026-07-14: Pulse Tools / CRO tools 'tl' at the very top so
  // auto-run starts on them), then the rest smallest-pillar-first.
  const PRIORITY = ['tl'];
  const pillars = Object.keys(byP).sort((a, b) => {
    const pa = PRIORITY.indexOf(a), pb = PRIORITY.indexOf(b);
    if (pa !== -1 && pb !== -1) return pa - pb;      // both priority → keep priority order
    if (pa !== -1) return -1;                        // a is priority → first
    if (pb !== -1) return 1;                         // b is priority → first
    return byP[a].length - byP[b].length;            // neither → smallest pillar first
  });
  const done = loadDone();
  const open = [], meta = [];
  let n = 0;
  // ⬛ BLACK SQUARES POD(S) AT THE VERY TOP — imageless entries get an image first
  const blackSorted = blackIds.slice().sort((a, b) => numOf(a) - numOf(b));
  for (let i = 0; i < blackSorted.length; i += 100) {
    const chunk = blackSorted.slice(i, i + 100);
    const key = 'black:' + (i / 100);
    if (done.has(key)) continue;
    n++;
    const label = '⬛ black squares ' + (i + 1) + '-' + (i + chunk.length);
    open.push({ p: 'pod' + n, name: label, n: chunk.length, ids: chunk });
    meta.push({ p: 'pod' + n, key, pillar: '(black)', label, n: chunk.length });
  }
  for (const pil of pillars) {
    const ids = byP[pil].slice().sort((a, b) => numOf(a) - numOf(b));
    const blocks = {};
    for (const id of ids) { const k = Math.floor((numOf(id) - 1) / 100); (blocks[k] = blocks[k] || []).push(id); }
    for (const k of Object.keys(blocks).map(Number).sort((a, b) => a - b)) {
      const key = pil + ':' + k;
      if (done.has(key)) continue;                       // fully fixed earlier — dropped from the list
      n++;
      const p = 'pod' + n;
      const label = pil + ' ' + (k * 100 + 1) + '-' + (k * 100 + 100);
      open.push({ p, name: label, n: blocks[k].length, ids: blocks[k] });
      meta.push({ p, key, pillar: pil, label, n: blocks[k].length });
    }
  }
  writeJSON(PODS_F, { at: new Date().toISOString(), open, done: [], locked: {} });
  writeJSON(PANEL_PODS_F, Object.assign(readJSON(PANEL_PODS_F, {}), { at: new Date().toISOString(), pods: meta }));
  return { open, meta, typeCount, type: fixerTypeFilter };
}

// ── per-pillar SUBSECTIONS (10 topic angles, e.g. Cars → exotic convertibles, American muscle …).
//    Cached in gen/subsections.json; regenerated every ~hour so they "flip" to fresh ones. They SEED
//    the Daily Driver (genNotes) — the generator then makes golden-template titles + branches off. ──
const SUBSECTIONS_F = GEN + '/subsections.json';
async function getSubsections(pillar, force) {
  pillar = String(pillar || '').toLowerCase();
  if (!pillar || !PNAMES[pillar]) return [];
  const name = PNAMES[pillar] || pillar;
  const all = readJSON(SUBSECTIONS_F, {});
  const cur = all[pillar];
  if (!force && cur && Array.isArray(cur.subs) && cur.subs.length && (Date.now() - (cur.at || 0) < 3600 * 1000)) return cur.subs;
  let subs = [];
  if (dsChat) {
    try {
      const r = await dsChat([
        { role: 'system', content: 'You output ONLY a plain list, one item per line, no numbering, no commentary, no quotes.' },
        { role: 'user', content: `List exactly 10 distinct, specific SUB-TOPIC ANGLES for a "${name}" content pillar — each a short phrase (2-4 words), varied and concrete. Example for Cars: exotic convertibles, American muscle, Toyota reliability, electric SUVs, off-road trucks, luxury sedans, first car under 20k, classic restomods, Japanese tuners, family minivans. One per line, no numbers like "top 1000".` }
      ], { max_tokens: 300, temperature: 1.0 });
      subs = String((r && r.content) || '').split('\n').map(s => s.replace(/^\s*\d+[).\].:\-]*\s*/, '').replace(/^[-*•]\s*/, '').replace(/^["'`]|["'`]$/g, '').trim()).filter(Boolean).slice(0, 10);
    } catch (e) {}
  }
  if (subs.length) { all[pillar] = { at: Date.now(), subs }; writeJSON(SUBSECTIONS_F, all); }
  return subs.length ? subs : (cur && cur.subs) || [];
}

// ── run a child script; drain pipes; the child owns its own run_status.json ──
function runStage(script, args, extraEnv) {
  return new Promise((resolve) => {
    const env = Object.assign({}, process.env, extraEnv || {});
    const c = spawn(process.execPath, [script].concat(args), { cwd: WD, env });
    fixer.child = c;
    c.stdout.on('data', () => {});
    c.stderr.on('data', () => {});
    c.on('close', code => { if (fixer.child === c) fixer.child = null; resolve(code); });
    c.on('error', () => { if (fixer.child === c) fixer.child = null; resolve(-1); });
  });
}

// ── ① FIXER auto-run: sweep POD by POD (100 each, grouped by pillar). Pod ends → next pod → loop.
//    Full pipeline per URL (sim→quality→image→title→gate 13/13). A fully-fixed pod is dropped for good. ──
async function runFixer(opts) {
  opts = opts || {};
  if (fixer.on) return;
  fixer.on = true; fixer.stopReq = false; fixer.sweep = 0; fixer.scanned = 0; fixer.fixed = 0; fixer.failed = 0;
  try { fs.unlinkSync(STOP_F); } catch (e) {}
  try { fs.writeFileSync(SIM + '/fix_progress.json', '{}'); } catch (e) {} // fresh live box (clear stale batch)
  const onlyKey = opts.onlyKey || null;      // run just this one pod (by stable key pillar:block)
  let startKey = opts.startKey || null;       // start the sweep at this pod, then continue
  opLog('FIXER run START' + (onlyKey ? ' only=' + onlyKey : startKey ? ' from=' + startKey : ' (all)'));
  const fixEnv = { SIM_BATCH: '5', SIM_FIX_STAGE: 'all', IMAGE_APPLY_PAUSED: '1' }; // Claude Code · 5 at a time. IMAGE_APPLY_PAUSED=1 (Fable): CONTENT melt now, image applies PAUSED until render-path deploy + DOM check.
  try {
    for (;;) { // rebuild each sweep so newly-completed pods drop off the list
      let { open, meta } = await buildPods();
      if (onlyKey) {                          // single-pod run
        const idx = meta.findIndex(m => m.key === onlyKey);
        if (idx < 0) { fixer.note = 'pod not found or already done: ' + onlyKey; break; }
        open = [open[idx]]; meta = [meta[idx]];
      } else if (startKey) {                   // auto-run FROM the selected pod (first sweep only)
        const idx = meta.findIndex(m => m.key === startKey);
        if (idx > 0) { open = open.slice(idx); meta = meta.slice(idx); }
        startKey = null;
      }
      if (!open.length) { fixer.note = 'all pods complete — nothing left'; break; }
      fixer.sweep++; fixer.total = open.length; fixer.idx = 0;
      for (let i = 0; i < open.length; i++) {
        if (fixer.stopReq || fs.existsSync(STOP_F)) { fixer.note = 'stopped mid-sweep'; opLog('FIXER stopped'); fixer.on = false; return; }
        const pod = open[i], m = meta[i];
        fixer.idx = i + 1; fixer.pillar = m.label;
        fixer.note = `scanning ${m.label} (pod ${fixer.idx}/${open.length})`;
        await runStage(WD + '/sim_scan.js', [pod.p]);
        if (fixer.stopReq) { fixer.note = 'stopped'; fixer.on = false; return; }
        const piles = (readJSON(SUMMARY_F, {}).piles) || {};
        const bad = (piles.NEAR_DUP || 0) + (piles.SUB13 || 0) + (piles.STUB || 0);
        fixer.scanned++;
        if (bad > 0) {
          fixer.note = `fixing ${m.label} — ${bad} flagged (pod ${fixer.idx}/${open.length})`;
          await runStage(WD + '/sim_transform.js', [pod.p], fixEnv);
          const st = readJSON(FIX_STATUS_F, {});
          fixer.fixed += (st.transformed || 0); fixer.failed += (st.failed || 0);
        }
        // pod done? all 100 ids resolved in the FIXED ledger → drop it so it's never redone
        const fixedSet = fixedIdSet();
        if (pod.ids.every(id => fixedSet.has(String(id).toLowerCase()))) { markPodDone(m.key); }
        // immediately advance to the next pod (no pause)
      }
      opLog(`FIXER sweep ${fixer.sweep} complete — ${fixer.fixed} fixed, ${fixer.failed} failed`);
      if (fixer.stopReq || fs.existsSync(STOP_F)) break;
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (e) { fixer.note = 'error: ' + (e && e.message); opLog('FIXER error ' + (e && e.message)); }
  fixer.on = false; fixer.pillar = null; if (!fixer.stopReq) fixer.note = 'done';
}
function stopFixer(force) {
  fixer.stopReq = true; fixer.note = 'stopping…';
  try { fs.writeFileSync(STOP_F, new Date().toISOString()); } catch (e) {}
  if (force && fixer.child) { try { fixer.child.kill('SIGKILL'); } catch (e) {} fixer.child = null; }
  opLog(force ? 'FIXER force-stop' : 'FIXER stop');
}

// ── ② DAILY DRIVER: gen_daemon.js --once, continuous, until the duration timer expires ──
//   opts = { hours, pillar, notes } from the panel. hours=0 → run until STOP.
function startGen(opts) {
  opts = opts || {};
  if (gen.on && gen.child) return;
  const hours = Math.max(0, Math.min(72, Number(opts.hours) || 0));
  const pillar = String(opts.pillar || 'ALL').trim().toLowerCase();
  const sub = String(opts.subsection || '').trim();
  // subsection seeds the direction; operator notes append. Generator starts here, branches off, dedups.
  const notes = [sub, String(opts.notes || '')].filter(Boolean).join(' — ').slice(0, 800);
  const isAll = !pillar || pillar === 'all';
  const runUntil = hours > 0 ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : null;
  const cfg = Object.assign(
    { fixConcurrency: 30, entriesPerHour: 10, perTopicPerHour: null, deployEveryHours: 0 },
    readJSON(GEN_CONFIG_F, {}),
    {
      paused: false,
      runUntil,                       // duration timer — daemon auto-stops when it expires
      genNotes: notes,                // seed direction; generator starts here then branches off
      genTopics: isAll ? 'ALL' : [pillar],
      pillarLap: isAll,               // ALL → rotate every pillar one-at-a-time; single pillar → stay on it & branch
    }
  );
  writeJSON(GEN_CONFIG_F, cfg);
  gen.hours = hours; gen.pillar = isAll ? 'ALL' : pillar; gen.until = runUntil; gen.notes = notes;
  // IMAGE_APPLY_PAUSED=1 (Fable 2026-07-14): daily driver runs TEXT-ONLY — publishes images_pending
  // and defers all image applies until the render-path deploy lands + one DOM check passes. Same rule as fixer.
  const env = Object.assign({}, process.env, { DS_ONLY: '1', IMAGE_APPLY_PAUSED: '1' });
  const c = spawn(process.execPath, [WD + '/gen_daemon.js', '--once'], { cwd: WD, env });
  gen.child = c; gen.on = true; gen.note = `daily driver running${isAll ? ' · ALL pillars' : ' · ' + pillar}${runUntil ? ' · until ' + new Date(runUntil).toLocaleString() : ' · until STOP'}`;
  c.stdout.on('data', () => {});
  c.stderr.on('data', () => {});
  c.on('close', () => { gen.child = null; gen.on = false; if (gen.note === 'daily driver running') gen.note = 'stopped'; });
  c.on('error', e => { gen.child = null; gen.on = false; gen.note = 'error: ' + (e && e.message); });
  opLog('DAILY DRIVER start');
}
function stopGen() {
  const cfg = readJSON(GEN_CONFIG_F, {}); cfg.paused = true; writeJSON(GEN_CONFIG_F, cfg); // daemon exits on next loop
  gen.note = 'stopping…';
  setTimeout(() => { if (gen.child) { try { gen.child.kill(); } catch (e) {} } }, 4000); // backstop
  opLog('DAILY DRIVER stop');
}
function forceGen() {
  const cfg = readJSON(GEN_CONFIG_F, {}); cfg.paused = true; cfg.runUntil = null; writeJSON(GEN_CONFIG_F, cfg);
  if (gen.child) { try { gen.child.kill('SIGKILL'); } catch (e) {} gen.child = null; }
  gen.on = false; gen.note = 'force-stopped';
  // kill ANY gen_daemon process (even ones the panel didn't spawn)
  try { spawn('powershell', ['-NoProfile', '-Command', "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*gen_daemon*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"], { windowsHide: true }); } catch (e) {}
  opLog('DAILY DRIVER FORCE-STOP');
}
function clearGen() {
  writeJSON(GEN_STATUS_F, { stage: 'idle', note: 'cleared', sessionDone: 0, sessionPassed: 0, sessionPublished: 0, recentResults: [], recentJobs: [], currentJob: null, currentTitle: null, currentId: null });
  gen.note = 'cleared';
  opLog('DAILY DRIVER clear');
}

// ── status snapshot for the panel ──
function snapshot() {
  const fs2 = readJSON(FIX_STATUS_F, {});
  const gs = readJSON(GEN_STATUS_F, {});
  return {
    fixer: { on: fixer.on, sweep: fixer.sweep, pillar: fixer.pillar, idx: fixer.idx, total: fixer.total, scanned: fixer.scanned, fixed: _campaignFixed.size, failed: (fs2.failed != null ? fs2.failed : fixer.failed), note: fixer.note, child: fs2.stage || fs2.phase || null },
    gen: {
      on: gen.on, note: gen.note, stage: gs.stage || null,
      current: gs.currentTitle || gs.currentJob || null,        // the question being written right now
      currentPillar: gs.currentPillarName || gs.currentPillar || null,
      done: gs.sessionDone || 0, passed: gs.sessionPassed || 0, published: gs.sessionPublished || 0,
      recent: (Array.isArray(gs.recentResults) ? gs.recentResults : []).slice(-8).reverse().map(r => ({ id: r.id, title: r.title, pass: !!r.pass, pub: !!r.published, url: r.url || ('/knowledge/' + r.id) })),
    },
  };
}

// ── panel HTML ──
const PANEL = `<!doctype html><html><head><meta charset=utf-8><title>Kory's Fixer</title>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;background:#0a0a0c;color:#e8e6e1;font:17px/1.55 -apple-system,Segoe UI,Roboto,Arial,sans-serif}
.wrap{max-width:640px;margin:0 auto;padding:18px 14px 48px}
h1{font-size:22px;letter-spacing:.5px;margin:2px 0;color:#FFB81C}
.dim{color:#8a8680;font-size:14px;margin-bottom:14px}
.card{background:#141417;border:1px solid #24242a;border-radius:14px;padding:16px;margin:14px 0}
.title{font-size:18px;font-weight:600;margin:0 0 4px}
.sub{color:#8a8680;font-size:14px;margin:0 0 12px}
.row{display:flex;gap:10px;margin-top:10px}
button{flex:1;border:0;border-radius:11px;padding:14px;font-size:17px;font-weight:600;cursor:pointer}
.go{background:#1f7a3d;color:#fff}.stop{background:#B91C3F;color:#fff}.kill{background:#2a2a30;color:#e8e6e1}
button:disabled{opacity:.35;cursor:not-allowed;filter:grayscale(.6)}
.running-badge{display:inline-block;font-size:13px;font-weight:700;color:#F6C445;margin-left:8px}
.stat{background:#101013;border:1px solid #24242a;border-radius:10px;padding:10px 12px;margin-top:12px;font-size:15px}
.k{color:#8a8680}.v{color:#FFB81C;font-weight:600}
.pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:13px;font-weight:700;margin-left:6px}
.on{background:#123d21;color:#4ade80}.off{background:#2a2a30;color:#8a8680}
.steps{font-size:13px;color:#6f6c66;margin-top:8px;letter-spacing:.3px}
label{display:block;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#8a8680;margin:12px 0 5px}
select,textarea{width:100%;background:#101013;border:1px solid #2c2c34;color:#e8e6e1;border-radius:10px;padding:11px;font:16px/1.4 inherit}
.subs{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}
.subchip{background:#1c1c22;border:1px solid #2c2c34;color:#d8d6d1;border-radius:16px;padding:6px 11px;font-size:14px;cursor:pointer;user-select:none}
.subchip:hover{background:#22222a}
.subchip.sel{background:#1f7a3d;color:#fff;border-color:#1f7a3d}
textarea{min-height:78px;resize:vertical}
.podlist{max-height:210px;overflow-y:auto;border:1px solid #24242a;border-radius:10px;margin-top:6px;background:#101013}
.pod{padding:9px 12px;font-size:15px;cursor:pointer;border-bottom:1px solid #1c1c22;display:flex;justify-content:space-between;gap:8px;user-select:none}
.pod:last-child{border-bottom:0}
.pod:hover{background:#1a1a20}
.pod.sel{background:#B91C3F;color:#fff}
.pod .pn{color:#8a8680;font-size:13px}
.pod.sel .pn{color:#f5d5dd}
.live{margin-top:12px;display:none}
.live.on{display:block}
.live .lrow{display:flex;align-items:center;gap:8px;font-size:14px;padding:7px 8px;border-radius:8px;border:1px solid #24242a;background:#101013;margin:4px 0;animation:slidein .45s ease}
.live .lrow.done{animation:flashdone 1s ease}
@keyframes slidein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes flashdone{0%{background:#101013}30%{background:#123d21;box-shadow:0 0 0 2px #22c55e}100%{background:#101013}}
.done-badge{margin-left:auto;color:#22c55e;font-weight:800;font-size:15px;opacity:0}
.lrow.done .done-badge{opacity:1;animation:pop .5s ease}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
.live .lid{color:#EAC15C;width:72px;flex:0 0 auto;font-weight:700}
.live .ltitle{color:#8a8680;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chips{display:flex;gap:3px;flex:0 0 auto}
.chip{display:inline-block;min-width:26px;text-align:center;padding:2px 4px;border-radius:3px;font-size:11px;font-weight:800;letter-spacing:.02em;color:#fff;background:#B91C3F}
.chip.done{background:#22c55e;color:#062b13}
.chip.active{background:#F6C445;color:#241c00}
.chip.failed{background:#7f1020}
.chip.skip{background:#3a3a42;color:#8a8680}
.recentq{margin-top:8px;max-height:150px;overflow-y:auto}
.qrow{display:block;font-size:13px;padding:4px 6px;border-radius:6px;margin:2px 0;text-decoration:none;color:#d8d6d1;border-left:3px solid #B91C3F}
.qrow.pass{border-left-color:#F6C445}.qrow.pub{border-left-color:#22c55e}
.qrow:hover{background:#1a1a20}
.barwrap{height:12px;background:#101013;border:1px solid #24242a;border-radius:99px;overflow:hidden;margin:8px 0 4px}
.bar{height:100%;width:0;background:linear-gradient(90deg,#1f7a3d,#22c55e);transition:width .5s}
.totline{font-size:14px;color:#8a8680}.totline b{color:#22c55e}
</style></head><body><div class=wrap>
<h1>🧼 Kory's Fixer</h1>
<div class=dim>Fresh build · localhost:${PORT} · owner-triggered · DeepSeek-only</div>

<div class=card>
  <div class=title>① Fixer <span id=fx-pill class="pill off">idle</span></div>
  <div class=sub>Pods of 100 by pillar. Click a pod → run just it, or auto-run from there. Claude Code agents · ONE at a time (watch each).</div>
  <div class=steps>Pipeline per URL: sim → quality 10/10 → title → image → 13/13 gate</div>
  <div class=barwrap><div id=fx-bar class=bar></div></div>
  <div class=totline id=fx-totals>library —</div>
  <label>Template type <span class=k>(GENERAL = 3-img · TOP 10 = 11-img)</span></label>
  <div id=fx-types class=subs>
    <span class="subchip typechip sel" data-t=ALL onclick="setType('ALL')">ALL</span>
    <span class="subchip typechip" data-t=GENERAL onclick="setType('GENERAL')">GENERAL <b id=tc-gen></b></span>
    <span class="subchip typechip" data-t=TOP_LIST onclick="setType('TOP_LIST')">TOP 10 <b id=tc-top></b></span>
  </div>
  <label>Pods <span id=pod-count class=k></span></label>
  <div id=pod-list class=podlist>loading…</div>
  <div class=row>
    <button class=go id=btn-runpod onclick="runPod('only')" disabled>▶ Run this pod</button>
    <button class=go id=btn-runfrom onclick="runPod('from')" disabled>▶ Auto-run from here</button>
  </div>
  <div class=row>
    <button class=go id=btn-runall onclick=post('/api/fixer/start')>▶ Auto-run ALL</button>
    <button class=stop onclick=post('/api/fixer/stop')>■ Stop</button>
    <button class=kill onclick=post('/api/fixer/forcestop')>✕</button>
  </div>
  <div class=stat id=fx-stat>—</div>
  <div id=fx-live class=live></div>
</div>

<div class=card>
  <div class=title>② Daily Driver <span id=gn-pill class="pill off">idle</span></div>
  <div class=sub>Generator: publishes new golden Q&As over and over until the timer runs out.</div>
  <label>Run for</label>
  <select id=gn-hours>
    <option value=1>1 hour</option>
    <option value=2 selected>2 hours</option>
    <option value=4>4 hours</option>
    <option value=8>8 hours</option>
    <option value=12>12 hours</option>
    <option value=24>24 hours</option>
    <option value=0>Until I press Stop</option>
  </select>
  <label>Pillar</label>
  <select id=gn-pillar onchange="loadSubs()"><option value=ALL>ALL — rotate every pillar</option></select>
  <label>Subsection <span class=k>(seeds the topic · rotates hourly)</span></label>
  <div id=gn-subs class=subs><span class=k>pick a pillar to see 10 subsections</span></div>
  <label>Notes — extra steer (optional)</label>
  <textarea id=gn-notes placeholder="e.g. focus on RevOps for early-stage SaaS founders — pricing, first sales hire, CRM setup. It'll start here and branch off."></textarea>
  <div class=steps>Starts on your notes, then slowly branches off · each entry gated 13/13 before publish · images deferred</div>
  <div class=row>
    <button class=go id=btn-genstart onclick=startGen()>▶ Start driver</button>
    <button class=stop onclick=post('/api/gen/stop')>■ Stop</button>
  </div>
  <div class=row>
    <button class=kill onclick=post('/api/gen/forcestop')>✕ Force stop</button>
    <button class=kill onclick="if(confirm('Clear the Daily Driver session counters?'))post('/api/gen/clear')">⌫ Clear</button>
  </div>
  <div class=stat id=gn-stat>—</div>
</div>

<script>
async function post(u,body){await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});setTimeout(tick,300);}
function esc(s){return String(s==null?'':s).replace(/</g,'&lt;');}
var selSub=null;
async function loadSubs(){
  selSub=null;
  var pil=document.getElementById('gn-pillar').value;
  var box=document.getElementById('gn-subs');
  if(!pil||pil==='ALL'){box.innerHTML='<span class=k>ALL rotates every pillar — pick one pillar to seed subsections</span>';return;}
  box.innerHTML='<span class=k>loading 10 subsections…</span>';
  try{
    var d=await(await fetch('/api/subsections?pillar='+encodeURIComponent(pil))).json();
    box.innerHTML=(d.subs||[]).map(function(s){return '<span class="subchip" onclick="selSubChip(this)">'+esc(s)+'</span>';}).join('')||'<span class=k>none</span>';
  }catch(e){box.innerHTML='<span class=k>could not load</span>';}
}
function selSubChip(el){
  var was=el.classList.contains('sel');
  document.querySelectorAll('#gn-subs .subchip').forEach(function(x){x.classList.remove('sel');});
  if(was){selSub=null;}else{el.classList.add('sel');selSub=el.textContent;}
}
async function startGen(){
  const hours=+document.getElementById('gn-hours').value;
  const pillar=document.getElementById('gn-pillar').value;
  const notes=document.getElementById('gn-notes').value;
  await post('/api/gen/start',{hours,pillar,notes,subsection:selSub||''});
}
async function loadPillars(){
  try{
    const d=await(await fetch('/api/scope')).json();
    const sel=document.getElementById('gn-pillar');
    for(const p of (d.pillars||[]).slice().sort((a,b)=>a.name.localeCompare(b.name)))
      sel.insertAdjacentHTML('beforeend','<option value="'+p.p+'">'+esc(p.name)+' ('+p.n+')</option>');
  }catch(e){}
}
loadPillars();

// ── Fixer pod list (click to select), run buttons, live green-chip progress ──
var selKey=null;
async function setType(t){
  document.querySelectorAll('#fx-types .typechip').forEach(function(x){x.classList.toggle('sel',x.getAttribute('data-t')===t);});
  await fetch('/api/fixer/type',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:t})});
  selKey=null; loadPods();
}
async function loadPods(){
  try{
    var d=await(await fetch('/api/pods')).json();
    if(d.typeCount){document.getElementById('tc-gen').textContent=(d.typeCount.GENERAL||0).toLocaleString();document.getElementById('tc-top').textContent=(d.typeCount.TOP_LIST||0).toLocaleString();}
    document.querySelectorAll('#fx-types .typechip').forEach(function(x){x.classList.toggle('sel',x.getAttribute('data-t')===(d.type||'ALL'));});
    document.getElementById('pod-count').textContent='('+d.open+' open · '+d.done+' done'+(d.type?' · '+d.type:'')+')';
    var el=document.getElementById('pod-list');
    el.innerHTML=(d.pods||[]).map(function(p){
      return '<div class="pod'+(p.key===selKey?' sel':'')+'" data-k="'+esc(p.key)+'" onclick="selPod(this)"><span>'+esc(p.label)+'</span><span class="pn">'+p.n+'</span></div>';
    }).join('')||'<div class=pod>all pods done ✓</div>';
  }catch(e){}
}
function selPod(el){
  document.querySelectorAll('#pod-list .pod').forEach(function(x){x.classList.remove('sel');});
  el.classList.add('sel'); selKey=el.getAttribute('data-k');
  document.getElementById('btn-runpod').disabled=false;
  document.getElementById('btn-runfrom').disabled=false;
}
async function runPod(mode){
  if(!selKey)return;
  await post('/api/fixer/run-pod', mode==='only'?{onlyKey:selKey}:{startKey:selKey});
}
function liveChip(c,k,lab){var v=(c&&c[k])||'pending';var cls=v==='done'?'done':v==='active'?'active':v==='failed'?'failed':v==='skip'?'skip':'';return '<span class="chip '+cls+'" title="'+k+': '+v+'">'+lab+'</span>';}
var liveRows={};
async function tickLive(){
  try{
    var p=await(await fetch('/api/progress')).json();
    var ids=Object.keys(p||{});
    var box=document.getElementById('fx-live');
    if(!ids.length){ box.classList.remove('on'); box.innerHTML=''; liveRows={}; return; }
    box.classList.add('on');
    if(!box.querySelector('.livehead')){ box.innerHTML='<label class=livehead>Fixing now — red → green as each passes</label>'; liveRows={}; }
    var present={};
    ids.forEach(function(id){
      present[id]=1;
      var e=p[id]||{}, c=e.checks||{};
      var complete=(c.gate==='done');
      var row=liveRows[id];
      if(!row){ row=document.createElement('div'); row.className='lrow'; box.appendChild(row); liveRows[id]=row; }  // NEW → slides in
      if(complete && !row.classList.contains('done')) row.classList.add('done');                                    // COMPLETE → green flash + ✓
      row.innerHTML='<span class="lid">'+esc(id)+'</span><span class="ltitle">'+esc(e.title||'')+'</span>'
        +'<span class="chips">'+liveChip(c,'similarity','SIM')+liveChip(c,'quality','Q10')+liveChip(c,'title','T')+liveChip(c,'image','IMG')+liveChip(c,'gate','13')+'</span>'
        +'<span class="done-badge">✓</span>';
    });
    // entry finished & removed from prog → fade it out, then the next slides in
    Object.keys(liveRows).forEach(function(id){ if(!present[id]){ var r=liveRows[id]; r.style.transition='opacity .4s'; r.style.opacity='0'; setTimeout(function(){ if(r.parentNode) r.parentNode.removeChild(r); },400); delete liveRows[id]; } });
  }catch(e){}
}
async function tickTotals(){
  try{
    var t=await(await fetch('/api/totals')).json();
    document.getElementById('fx-bar').style.width=Math.min(100,t.pct)+'%';
    document.getElementById('fx-totals').innerHTML='Library <b>'+t.fixed.toLocaleString()+'</b> certified / '+t.total.toLocaleString()+' &middot; <b>'+t.pct+'%</b>'+(t.perHr?' &middot; <b>'+t.perHr+'</b>/hr':'')+(t.runTransformed?' &middot; this run <b>'+t.runTransformed+'</b>':'');
  }catch(e){}
}
loadPods(); tickTotals();
setInterval(loadPods,10000);
setInterval(tickLive,2000);
setInterval(tickTotals,15000);
async function tick(){
  try{
    const s=await(await fetch('/api/status')).json();
    const f=s.fixer,g=s.gen;
    document.getElementById('fx-pill').className='pill '+(f.on?'on':'off');
    document.getElementById('fx-pill').textContent=f.on?'RUNNING':'idle';
    // gray out fixer run buttons while running (or when no pod picked) so you can't double-fire
    var rp=document.getElementById('btn-runpod'), rf=document.getElementById('btn-runfrom'), ra=document.getElementById('btn-runall');
    if(rp)rp.disabled=f.on||!selKey; if(rf)rf.disabled=f.on||!selKey; if(ra)ra.disabled=f.on;
    document.getElementById('fx-stat').innerHTML=
      '<span class=k>note</span> <span class=v>'+esc(f.note)+'</span><br>'+
      '<span class=k>sweep</span> <span class=v>'+f.sweep+'</span> · '+
      '<span class=k>pod</span> <span class=v>'+esc(f.pillar||'-')+' ('+f.idx+'/'+f.total+')</span><br>'+
      '<span class=k>fixed</span> <span class=v>'+f.fixed+'</span> · '+
      '<span class=k>failed</span> <span class=v>'+f.failed+'</span>'+(f.child?' · <span class=k>stage</span> <span class=v>'+esc(f.child)+'</span>':'');
    document.getElementById('gn-pill').className='pill '+(g.on?'on':'off');
    document.getElementById('gn-pill').textContent=g.on?'RUNNING':'idle';
    var gs2=document.getElementById('btn-genstart'); if(gs2)gs2.disabled=g.on; // gray Start while running
    document.getElementById('gn-stat').innerHTML=
      '<span class=k>status</span> <span class=v>'+esc(g.note||g.stage||'idle')+'</span>'+
      (g.current?'<br><span class=k>now writing</span> <span class=v>'+esc(g.current)+'</span>'+(g.currentPillar?' <span class=k>('+esc(g.currentPillar)+')</span>':''):'')+
      '<br><span class=k>session</span> done '+g.done+' · passed '+g.passed+' · <b class=v>published '+g.published+'</b>'+
      ((g.recent&&g.recent.length)?'<div class=recentq>'+g.recent.map(function(r){return '<a class="qrow '+(r.pub?'pub':r.pass?'pass':'')+'" href="'+esc(r.url)+'" target=_blank>'+esc(r.id)+' · '+esc((r.title||'').slice(0,54))+(r.pub?' ✓pub':r.pass?' ·gated':' ·fail')+'</a>';}).join('')+'</div>':'');
  }catch(e){}
}
tick();setInterval(tick,2000);
</script>
</div></body></html>`;

// ── server ──
function readBody(req) {
  return new Promise(resolve => {
    let b = ''; req.on('data', d => { b += d; if (b.length > 1e5) b = b.slice(0, 1e5); });
    req.on('end', () => { try { resolve(b ? JSON.parse(b) : {}); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}
http.createServer(async (req, res) => {
  const u = req.url.split('?')[0];
  const send = (code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'application/json' }); res.end(body); };
  try {
    if (req.method === 'GET' && (u === '/' || u === '/index.html')) return send(200, PANEL, 'text/html; charset=utf-8');
    if (req.method === 'GET' && u === '/api/status') return send(200, JSON.stringify(snapshot()));
    if (req.method === 'GET' && u === '/api/scope') return send(200, JSON.stringify(await scopeList()));
    if (req.method === 'GET' && u === '/api/subsections') { const q = new URLSearchParams(req.url.split('?')[1] || ''); const subs = await getSubsections(q.get('pillar'), q.get('force') === '1'); return send(200, JSON.stringify({ pillar: q.get('pillar'), subs })); }
    if (req.method === 'GET' && u === '/api/pods') { const { meta, typeCount, type } = await buildPods(); return send(200, JSON.stringify({ pods: meta.map(m => ({ key: m.key, label: m.label, n: m.n })), open: meta.length, done: [...loadDone()].length, typeCount, type })); }
    if (req.method === 'POST' && u === '/api/fixer/type') { const b = await readBody(req); const t = String(b.type || '').toUpperCase(); fixerTypeFilter = (t === 'GENERAL' || t === 'TOP_LIST') ? t : null; opLog('type filter → ' + (fixerTypeFilter || 'ALL')); return send(200, '{"ok":true}'); }
    if (req.method === 'GET' && u === '/api/progress') { return send(200, JSON.stringify(readJSON(SIM + '/fix_progress.json', {}))); }
    if (req.method === 'GET' && u === '/api/totals') { const sc = await scopeList(); const total = sc.total || 0; const fixed = sc.certified || 0; const run = readJSON(FIX_STATUS_F, {}); const rate = readJSON(SIM + '/fix_rate.json', {}); const now = Date.now(); const perHr = (Array.isArray(rate.times) ? rate.times : []).filter(t => now - t < 3600000).length; return send(200, JSON.stringify({ total, fixed, pct: total ? +(fixed / total * 100).toFixed(2) : 0, runTransformed: run.transformed || 0, runScope: run.scope || null, perHr })); }
    if (req.method === 'POST' && u === '/api/fixer/start') { runFixer().catch(() => {}); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/run-pod') { const b = await readBody(req); runFixer({ onlyKey: b.onlyKey, startKey: b.startKey }).catch(() => {}); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/stop') { stopFixer(false); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/forcestop') { stopFixer(true); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/start') { const body = await readBody(req); startGen(body); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/stop') { stopGen(); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/forcestop') { forceGen(); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/clear') { clearGen(); return send(200, '{"ok":true}'); }
    return send(404, '{"error":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'error' })); }
}).listen(PORT, () => {
  console.log(`[fixer] Kory's Fixer on http://localhost:${PORT}  (LAN: http://<your-ip>:${PORT})`);
  opLog(`panel up on ${PORT}`);
});
