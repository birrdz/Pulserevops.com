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
let claudeChat = null; try { ({ claudeChat } = require('./_claude_chat')); } catch (e) {}   // for topic suggestions (DeepSeek in timeout)
const { exec } = require('child_process');
// The fixer's 13/13 stage POSTs to the gate on this port. If it dies or a wrong process squats
// the port, EVERY fix "fails the gate" (false positives) — so the panel can restart it (below).
const GATE_PORT = parseInt(process.env.SCRUB_BTN_PORT || '8899', 10);
const GATE_HEALTH_URL = 'http://127.0.0.1:' + GATE_PORT + '/gate-publish';

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
const fixer = { on: false, stopReq: false, sweep: 0, pillar: null, idx: 0, total: 0, scanned: 0, fixed: 0, failed: 0, note: 'idle', child: null, workers: 5 };
// Worker count = how many URLs the fixer melts in parallel (SIM_BATCH). 5 = Normal, 10 = Double.
// Takes effect on the NEXT pod (the currently-running sim child keeps its batch).
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

// ── SEO INDEXING: Delta (recent new+fixed) + Mass (whole site) → IndexNow (Bing/Yandex/etc.) ──
let libraryEntryPublicUrl = null;
try { ({ libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url')); } catch (e) { opLog('index: url mapper load fail ' + e.message); }
const INDEX_STATE_F = SIM + '/index_button_state.json';
const INDEXNOW_ENDPOINT = 'https://pulserevops.com/.netlify/functions/indexnow-ping?key=pulsemachine';
const MASS_COOLDOWN_MS = 48 * 3600 * 1000;   // whole-site sweep — every 48h (relax to weekly once stable)
const DELTA_COOLDOWN_MS = 12 * 3600 * 1000;  // recent new+fixed — twice a day
const DELTA_WINDOW_MS = 25 * 3600 * 1000;    // "recent" = ts/last_modified within ~a day (or pulse-recent tag)
const index = { busy: false, note: 'idle', lastMass: 0, lastDelta: 0 };
(function () { const s = readJSON(INDEX_STATE_F, {}); index.lastMass = s.massAt || 0; index.lastDelta = s.deltaAt || 0; })();
function saveIndexState() { writeJSON(INDEX_STATE_F, { massAt: index.lastMass, deltaAt: index.lastDelta }); }

async function collectEntryUrls(recentOnly) {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const cut = Date.now() - DELTA_WINDOW_MS;
  const out = [];
  for (const e of ((idx && idx.entries) || [])) {
    if (!e || !e.id || /^vq_/i.test(String(e.id))) continue;
    if (recentOnly) {
      const recentTag = Array.isArray(e.tags) && e.tags.includes('pulse-recent');
      const ts = e.ts || e.last_modified_ms || 0;
      if (!recentTag && ts < cut) continue;
    }
    let url = null; try { url = libraryEntryPublicUrl ? libraryEntryPublicUrl(e) : null; } catch (_) {}
    if (url) out.push(url);
  }
  return [...new Set(out)];
}

async function submitIndexNow(urls) {
  let submitted = 0, batches = 0, ok = true;
  for (let i = 0; i < urls.length; i += 10000) {   // IndexNow: 10k per call
    const chunk = urls.slice(i, i + 10000); batches++;
    try {
      const r = await fetch(INDEXNOW_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ urls: chunk }) });
      if (r.ok) submitted += chunk.length; else ok = false;
    } catch (e) { ok = false; }
  }
  return { submitted, batches, ok };
}

async function runIndex(kind) {
  if (index.busy) return { ok: false, err: 'busy' };
  const now = Date.now();
  const cd = kind === 'mass' ? MASS_COOLDOWN_MS : DELTA_COOLDOWN_MS;
  const last = kind === 'mass' ? index.lastMass : index.lastDelta;
  if (now - last < cd) return { ok: false, err: 'cooldown', readyIn: (last + cd) - now };
  index.busy = true; index.note = kind + ' — enumerating URLs…';
  try {
    const urls = await collectEntryUrls(kind === 'delta');
    if (!urls.length) { index.note = kind + ' — nothing to submit'; return { ok: true, submitted: 0, total: 0 }; }
    index.note = kind + ' — submitting ' + urls.length + ' URLs to IndexNow…';
    const res = await submitIndexNow(urls);
    if (kind === 'mass') index.lastMass = now; else index.lastDelta = now;   // cooldown starts on run
    saveIndexState();
    index.note = kind + ' ✓ ' + res.submitted + '/' + urls.length + ' submitted · ' + res.batches + ' batch(es) · ' + new Date().toLocaleTimeString();
    opLog('INDEX ' + kind + ' → ' + res.submitted + '/' + urls.length + ' URLs');
    return { ok: true, submitted: res.submitted, total: urls.length, batches: res.batches };
  } catch (e) { index.note = kind + ' error: ' + (e && e.message); return { ok: false, err: String(e.message || e) }; }
  finally { index.busy = false; }
}
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
  // Emit one pillar's 100-blocks as pods (tl 1-100, tl 101-200, …).
  function emitPillar(pil) {
    if (!byP[pil]) return;
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
  // ⭐ PRIORITY pillars (Pulse Tools / CRO 'tl') at the VERY TOP of the page — easiest to find,
  // auto-run starts here (owner 2026-07-14: put tl above the black-squares pods).
  for (const pil of PRIORITY) emitPillar(pil);
  // ⬛ BLACK SQUARES POD(S) — imageless entries next (get an image first when the lane opens)
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
  // the rest of the pillars (non-priority), smallest first
  for (const pil of pillars) { if (PRIORITY.indexOf(pil) !== -1) continue; emitPillar(pil); }
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

// ── POINTED TOPIC SUGGESTIONS (owner 2026-07-15): the Daily Driver offers SPECIFIC (not broad) topics
//    to click; persisted to gen/topic_suggestions.json so the daemon can randomly pick one on auto.
//    Claude Code writer (DeepSeek in timeout), DeepSeek fallback. ──
const SUGGEST_F = GEN + '/topic_suggestions.json';
function parseTopicLines(t) {
  const raw = String(t || '').split('\n')
    .map(l => l.replace(/^\s*\d+[).\].:]?\s*/, '').replace(/^\s*[-*•]\s*/, '').replace(/^["'`]|["'`]$/g, '').trim())
    .filter(Boolean);
  // keep only real titles — drop prompt echoes / preamble; must be a question OR a "Top 10 …"
  const ok = raw.filter(q => {
    if (/\bpillar:?\b|these (need|should)|one (per|title per) line|ending in 2027 where|good \(pointed|bad \(broad/i.test(q)) return false;
    const isTop10 = /^top\s*10\b/i.test(q);
    const isQ = /\?\s*$/.test(q) || /^(how|what|why|is|are|should|when|where|which|can|do|does|will)\b/i.test(q);
    return isTop10 || isQ;
  });
  return ok.slice(0, 8);
}
async function getSuggestions(pillar, force) {
  pillar = String(pillar || '').toLowerCase();
  if (!pillar || !PNAMES[pillar]) return [];
  const name = PNAMES[pillar] || pillar;
  const all = readJSON(SUGGEST_F, {});
  const cur = all[pillar];
  if (!force && cur && Array.isArray(cur.topics) && cur.topics.length && (Date.now() - (cur.at || 0) < 1800 * 1000)) return cur.topics;
  const sys = 'You propose SPECIFIC, POINTED page titles for a RevOps knowledge library. Each title is EITHER a natural Q&A question OR a "Top 10 <specific thing>" (exactly 10, never another number). Output ONLY a plain list, one title per line — no numbering, no commentary, no quotes.';
  const user = `Pillar: ${name}. Propose 8 POINTED, NARROW titles a real reader would search — each about ONE concrete scenario / tool / number / role / company-stage, NOT broad. GOOD (pointed): "How do you structure OTE for a 6-person SDR team in 2027?", "Top 10 CRM cleanup steps before a Series A in 2027". BAD (broad, never do this): "What is ${name}?", "How do you get started with ${name} in 2027?". One specific topic per line. End in 2027 where a year applies.`;
  let lines = [];
  try { if (claudeChat) { const r = await claudeChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { timeoutMs: 120000 }); lines = parseTopicLines(typeof r === 'string' ? r : (r && (r.content || r.text)) || ''); } } catch (e) {}
  if (!lines.length && dsChat) { try { const r = await dsChat([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 700, temperature: 1.0 }); lines = parseTopicLines((r && r.content) || ''); } catch (e) {} }
  if (lines.length) { all[pillar] = { at: Date.now(), topics: lines }; writeJSON(SUGGEST_F, all); }
  return lines.length ? lines : (cur && cur.topics) || [];
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
  // CLAUDE_ONLY=1 (owner 2026-07-15: "CLAUDE-MAX", DeepSeek in timeout) → 5 Claude Code (Max) agents,
  // DeepSeek rests entirely (no fallback). SIM_BATCH = N URLs melted in parallel = N Claude agents at once.
  const fixEnv = { SIM_BATCH: String(fixer.workers || 5), SIM_FIX_STAGE: 'all', IMAGE_APPLY_PAUSED: '1', CLAUDE_ONLY: '1' };
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
          await runStage(WD + '/sim_transform.js', [pod.p], Object.assign({}, fixEnv, { SIM_BATCH: String(fixer.workers || 5) }));
          const st = readJSON(FIX_STATUS_F, {});
          fixer.fixed += (st.transformed || 0); fixer.failed += (st.failed || 0);
        }
        // pod done? Re-scan and drop it when nothing FIXABLE is left — every id is either
        // certified/PASS or permanently 3-strike-skipped. One stubborn entry no longer pins the
        // whole pod open forever (old rule required ALL 100 in FIXED.md → pods never dropped).
        if (bad > 0) { await runStage(WD + '/sim_scan.js', [pod.p]); }   // refresh piles after the fix
        const rep = (readJSON(SIM + '/scan_report.json', {}).entries) || {};
        const strikes = (readJSON(SIM + '/transform_state.json', {}).strikes) || {};
        const stuck = pod.ids.filter(id => {
          const r = rep[String(id)] || rep[String(id).toLowerCase()];
          const flagged = r && (r.pile === 'SUB13' || r.pile === 'NEAR_DUP' || r.pile === 'STUB');
          const burned = (strikes[String(id)] || 0) >= 3 || (strikes[String(id).toLowerCase()] || 0) >= 3;
          return flagged && !burned;   // still flagged AND still has fix attempts left
        });
        if (!stuck.length) { markPodDone(m.key); opLog('pod clean → dropped: ' + m.key + ' (' + pod.ids.length + ' ids)'); }
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
.live .lrow{display:flex;align-items:center;gap:10px;font-size:19px;padding:12px 14px;border-radius:9px;border:1px solid #24242a;background:#101013;margin:6px 0;animation:slidein .45s ease}
.live .lrow.done{animation:flashdone 1s ease}
@keyframes slidein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes flashdone{0%{background:#101013}30%{background:#123d21;box-shadow:0 0 0 2px #22c55e}100%{background:#101013}}
.done-badge{margin-left:auto;color:#22c55e;font-weight:800;font-size:20px;opacity:0}
.lrow.done .done-badge{opacity:1;animation:pop .5s ease}
@keyframes pop{0%{transform:scale(.4)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
.live .lid{color:#EAC15C;width:92px;flex:0 0 auto;font-weight:700;font-size:18px}
.live .ltitle{color:#b9b4ad;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:17px}
.chips{display:flex;gap:3px;flex:0 0 auto}
.chip{display:inline-block;min-width:40px;text-align:center;padding:6px 10px;border-radius:5px;font-size:15px;font-weight:800;letter-spacing:.02em;color:#fff;background:#B91C3F}
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
    <button class=kill onclick="if(confirm('Reset the fixer? Restores ALL pods to the list and clears the fixed/failed counters. (Does not touch entries.)')){post('/api/fixer/reset');setTimeout(loadPods,400);}">⟳ Reset</button>
    <button class=kill onclick="if(confirm('Clear the fixer counters (fixed / failed)? Pods stay as-is.'))post('/api/fixer/clear')">⌫ Clear</button>
  </div>
  <div class=row style="align-items:center;gap:8px;flex-wrap:wrap">
    <label style="margin:0">Workers <b id=wk-cur class=k>5</b> <span class=k style="opacity:.6">parallel/pod</span></label>
    <button class="go wk" id=wk-5 onclick="setWorkers(5)">Normal · 5</button>
    <button class="go wk" id=wk-10 onclick="setWorkers(10)">⚡ Double · 10</button>
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
  <label>Pointed topic ideas <span class=k>(specific, not broad · click one to load it · on auto it randomly picks one)</span></label>
  <div class=row><button class=go id=btn-suggest onclick="loadSuggest(1)">💡 Suggest pointed topics</button></div>
  <div id=gn-suggest class=subs><span class=k>pick ONE pillar, then tap Suggest — click a topic to load it into Notes</span></div>
  <label>Notes — extra steer (optional)</label>
  <textarea id=gn-notes placeholder="e.g. focus on RevOps for early-stage SaaS founders — pricing, first sales hire, CRM setup. It'll start here and branch off."></textarea>
  <div class=steps>Starts on your notes (or a clicked topic), then branches off · each entry gated 13/13 before publish · images deferred</div>
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

<div class=card>
  <h3>🔎 SEO Index <span class=k>(submit URLs to Bing / Yandex / IndexNow)</span></h3>
  <div class=row style="margin-top:6px">
    <button class=go id=btn-delta onclick="doIndex('delta')">⚡ Delta Index <b id=cd-delta></b></button>
    <button class=go id=btn-mass onclick="doIndex('mass')">🌐 Mass Index <b id=cd-mass></b></button>
  </div>
  <div class=k style="margin-top:6px">⚡ Delta = new + fixed URLs only · every 12h &nbsp;|&nbsp; 🌐 Mass = whole site · every 48h</div>
  <div class=stat id=idx-stat>idle</div>
</div>

<div class=card id=recover>
  <label>🛠 Recover — tap these if the fixer stops working (gate down, stuck, or after a reboot). No Claude needed.</label>
  <div id=hbar style="padding:9px 11px;border-radius:8px;font-weight:600;margin:6px 0">checking gate…</div>
  <div class=row>
    <button class=go id=btn-gate onclick="recover('/api/gate/restart','Restart Gate')">🔌 Restart Gate</button>
    <button class=go id=btn-stack onclick="recover('/api/stack/restart','Restart Everything')">🚀 Restart Everything</button>
  </div>
  <div class=row style="margin-top:6px">
    <button id=btn-reset onclick="post('/api/fixer/reset');document.getElementById('recover-stat').textContent='pods restored + counters cleared'">♻️ Reset Pods</button>
    <button id=btn-fstop onclick="post('/api/fixer/forcestop');document.getElementById('recover-stat').textContent='force-stopped'">⏹ Force Stop</button>
  </div>
  <div class=k style="margin-top:6px">🔴 Gate down = every fix "fails" (the false positives). <b>Restart Gate</b> fixes that. <b>Restart Everything</b> = gate + start the fixer in one tap.</div>
  <div class=stat id=recover-stat></div>
</div>

<script>
async function post(u,body){await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});setTimeout(tick,300);}
function esc(s){return String(s==null?'':s).replace(/</g,'&lt;');}
// ── SEO Index buttons (Delta / Mass) ──
async function doIndex(kind){
  var b=document.getElementById('btn-'+kind); if(b)b.disabled=true;
  document.getElementById('idx-stat').textContent=kind+' — starting…';
  try{
    var r=await(await fetch('/api/index/'+kind,{method:'POST'})).json();
    if(!r.ok && r.err==='cooldown'){var h=Math.floor(r.readyIn/3600000),m=Math.floor((r.readyIn%3600000)/60000);document.getElementById('idx-stat').textContent=kind+' on cooldown — ready in '+h+'h '+m+'m';}
  }catch(e){}
  loadIndexStatus();
}
function fmtCd(kind,ms){
  var b=document.getElementById('btn-'+kind),cd=document.getElementById('cd-'+kind);
  if(ms>0){var h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000);if(b)b.disabled=true;if(cd)cd.textContent='('+h+'h '+m+'m)';}
  else{if(b)b.disabled=false;if(cd)cd.textContent='';}
}
async function loadIndexStatus(){
  try{
    var d=await(await fetch('/api/index/status')).json();
    if(d.note)document.getElementById('idx-stat').textContent=d.note;
    fmtCd('mass',d.massReadyIn);fmtCd('delta',d.deltaReadyIn);
    if(d.busy){document.getElementById('btn-mass').disabled=true;document.getElementById('btn-delta').disabled=true;}
  }catch(e){}
}
setInterval(loadIndexStatus,30000);loadIndexStatus();
// ── Recover: live gate health + one-tap restart (so you never get stuck without Claude) ──
async function loadHealth(){
  try{
    var h=await(await fetch('/api/health')).json();
    var el=document.getElementById('hbar'); if(!el)return;
    if(h.gate){el.textContent='🟢 Gate UP on '+h.gatePort+' — fixer can certify normally';el.style.background='#0b3d17';el.style.color='#7CFFA0';}
    else{el.textContent='🔴 Gate DOWN on '+h.gatePort+' — fixes will FALSE-FAIL until you tap Restart Gate';el.style.background='#4a0d0d';el.style.color='#ff9a9a';}
  }catch(e){}
}
setInterval(loadHealth,10000);loadHealth();
async function recover(url,label){
  var s=document.getElementById('recover-stat');s.textContent=label+' — working… (can take ~20s)';
  var g=document.getElementById('btn-gate'),k=document.getElementById('btn-stack');if(g)g.disabled=true;if(k)k.disabled=true;
  try{var r=await(await fetch(url,{method:'POST'})).json();
    s.textContent=label+(r.ok?' ✓ done — gate is up'+(r.fixerStarted?' + fixer started':''):' ✗ failed: '+(r.err||'see fixer log'));
  }catch(e){s.textContent=label+' ✗ error — try again';}
  if(g)g.disabled=false;if(k)k.disabled=false;
  loadHealth();
}
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
async function loadSuggest(force){
  var pil=document.getElementById('gn-pillar').value;
  var box=document.getElementById('gn-suggest');
  if(!pil||pil==='ALL'){box.innerHTML='<span class=k>pick ONE pillar to get pointed topic ideas (ALL rotates)</span>';return;}
  box.innerHTML='<span class=k>thinking up pointed topics… (~10s)</span>';
  try{
    var d=await(await fetch('/api/gen/suggest?force='+(force?1:0)+'&pillar='+encodeURIComponent(pil))).json();
    box.innerHTML=(d.topics||[]).map(function(t){return '<span class="subchip" onclick="pickSuggest(this)" title="click to load into Notes">'+esc(t)+'</span>';}).join('')||'<span class=k>none — tap Suggest again</span>';
  }catch(e){box.innerHTML='<span class=k>could not load — try again</span>';}
}
function pickSuggest(el){
  document.getElementById('gn-notes').value=el.textContent;
  document.querySelectorAll('#gn-suggest .subchip').forEach(function(x){x.classList.remove('sel');});
  el.classList.add('sel');
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
async function setWorkers(n){
  try{ var r=await(await fetch('/api/fixer/workers',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({n:n})})).json(); syncWorkers(r.workers); }catch(e){}
}
function syncWorkers(n){
  n=n||5; var el=document.getElementById('wk-cur'); if(el)el.textContent=n;
  var a=document.getElementById('wk-5'),b=document.getElementById('wk-10');
  if(a)a.classList.toggle('sel',n<=5); if(b)b.classList.toggle('sel',n>=10);
}
function liveChip(c,k,lab){var v=(c&&c[k])||'pending';var cls=v==='done'?'done':v==='active'?'active':v==='failed'?'failed':v==='skip'?'skip':'';return '<span class="chip '+cls+'" title="'+k+': '+v+'">'+lab+'</span>';}
var liveRows={}, doneRemoved={};
async function tickLive(){
  try{
    var p=await(await fetch('/api/progress')).json();
    var ids=Object.keys(p||{});
    var box=document.getElementById('fx-live');
    if(!ids.length){ box.classList.remove('on'); box.innerHTML=''; liveRows={}; doneRemoved={}; return; }
    box.classList.add('on');
    if(!box.querySelector('.livehead')){ box.innerHTML='<label class=livehead>Fixing now — red → green, then drops off the moment it passes</label>'; liveRows={}; }
    var present={};
    ids.forEach(function(id){
      present[id]=1;
      if(doneRemoved[id]) return;                 // already fixed + dropped — never re-add
      var e=p[id]||{}, c=e.checks||{};
      var complete=(c.gate==='done');
      var row=liveRows[id];
      if(!row){ row=document.createElement('div'); row.className='lrow'; box.appendChild(row); liveRows[id]=row; }  // NEW → slides in
      row.innerHTML='<span class="lid">'+esc(id)+'</span><span class="ltitle">'+esc(e.title||'')+'</span>'
        +'<span class="chips">'+liveChip(c,'similarity','SIM')+liveChip(c,'quality','Q10')+liveChip(c,'title','T')+liveChip(c,'image','IMG')+liveChip(c,'gate','13')+'</span>'
        +'<span class="done-badge">✓</span>';
      // owner 2026-07-15: the instant a URL is fixed (all green), drop it off the list ASAP
      if(complete && !row.classList.contains('done')){
        row.classList.add('done'); doneRemoved[id]=1;
        setTimeout(function(){ if(row.parentNode){ row.style.transition='opacity .4s'; row.style.opacity='0'; setTimeout(function(){ if(row.parentNode) row.parentNode.removeChild(row); },400);} delete liveRows[id]; }, 1800);
      }
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

// ── SELF-SERVICE RECOVERY: bring the gate (and fixer) back WITHOUT Claude. ──
// When the gate on GATE_PORT dies or a wrong server squats it, every fix "fails the gate"
// (false positives) and the fixer looks broken. These let the owner recover from the panel.
let gateProc = null;
async function gateUp() {
  try {
    const r = await fetch(GATE_HEALTH_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: '4444', id: '_health', body: 'x', simMode: true, dryRun: true }),
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return false;                       // 404 = wrong server squatting the port
    const j = await r.json().catch(() => null);
    return !!(j && (typeof j.score === 'number' || 'pass' in j));   // real rubric response
  } catch (e) { return false; }
}
function killPort(port) {
  return new Promise(resolve => {                  // free a squatter: kill whatever LISTENs on the port
    exec(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`,
      { windowsHide: true }, () => resolve());
  });
}
async function restartGate() {
  opLog('RECOVER: restart gate requested');
  if (await gateUp()) { opLog('RECOVER: gate already up'); return { ok: true, gate: true, already: true }; }
  await killPort(GATE_PORT);
  await new Promise(r => setTimeout(r, 900));
  const env = Object.assign({}, process.env, { GATE_ONLY: '1', GOLD_SKIP_IMG_GATE: '1', SCRUB_BTN_PORT: String(GATE_PORT) });
  try {
    gateProc = spawn(process.execPath, [WD + '/_scrub_button_server.js'], { cwd: WD, env, detached: true, stdio: 'ignore' });
    gateProc.unref();
  } catch (e) { opLog('RECOVER: gate spawn fail ' + (e && e.message)); return { ok: false, err: String(e && e.message) }; }
  for (let i = 0; i < 25; i++) { await new Promise(r => setTimeout(r, 1000)); if (await gateUp()) { opLog('RECOVER: gate UP on ' + GATE_PORT); return { ok: true, gate: true }; } }
  opLog('RECOVER: gate did not answer in 25s');
  return { ok: false, err: 'gate did not answer in 25s — check _gate_8899.out.log' };
}

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
    if (req.method === 'GET' && u === '/api/gen/suggest') { const q = new URLSearchParams(req.url.split('?')[1] || ''); const topics = await getSuggestions(q.get('pillar'), q.get('force') === '1'); return send(200, JSON.stringify({ pillar: q.get('pillar'), topics })); }
    if (req.method === 'GET' && u === '/api/pods') { const { meta, typeCount, type } = await buildPods(); return send(200, JSON.stringify({ pods: meta.map(m => ({ key: m.key, label: m.label, n: m.n })), open: meta.length, done: [...loadDone()].length, typeCount, type })); }
    if (req.method === 'POST' && u === '/api/fixer/type') { const b = await readBody(req); const t = String(b.type || '').toUpperCase(); fixerTypeFilter = (t === 'GENERAL' || t === 'TOP_LIST') ? t : null; opLog('type filter → ' + (fixerTypeFilter || 'ALL')); return send(200, '{"ok":true}'); }
    if (req.method === 'GET' && u === '/api/progress') { return send(200, JSON.stringify(readJSON(SIM + '/fix_progress.json', {}))); }
    if (req.method === 'GET' && u === '/api/totals') { const sc = await scopeList(); const total = sc.total || 0; const fixed = sc.certified || 0; const run = readJSON(FIX_STATUS_F, {}); const rate = readJSON(SIM + '/fix_rate.json', {}); const now = Date.now(); const perHr = (Array.isArray(rate.times) ? rate.times : []).filter(t => now - t < 3600000).length; return send(200, JSON.stringify({ total, fixed, pct: total ? +(fixed / total * 100).toFixed(2) : 0, runTransformed: run.transformed || 0, runScope: run.scope || null, perHr })); }
    if (req.method === 'POST' && u === '/api/fixer/start') { runFixer().catch(() => {}); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/run-pod') { const b = await readBody(req); runFixer({ onlyKey: b.onlyKey, startKey: b.startKey }).catch(() => {}); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/workers') { const b = await readBody(req); let n = parseInt(b.n, 10); if (!(n >= 1 && n <= 20)) n = 5; fixer.workers = n; opLog('workers → ' + n + (fixer.on ? ' (applies next pod)' : '')); return send(200, JSON.stringify({ ok: true, workers: n })); }
    if (req.method === 'POST' && u === '/api/fixer/stop') { stopFixer(false); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/forcestop') { stopFixer(true); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/fixer/clear') {
      _campaignFixed = new Set(); writeJSON(CAMPAIGN_FIXED_F, { ids: [], updated: new Date().toISOString() });
      fixer.fixed = 0; fixer.failed = 0; fixer.scanned = 0; fixer.note = 'cleared';
      opLog('FIXER clear — counters reset'); return send(200, '{"ok":true}');
    }
    if (req.method === 'GET' && u === '/api/index/status') {
      const now = Date.now();
      return send(200, JSON.stringify({
        busy: index.busy, note: index.note,
        massReadyIn: Math.max(0, (index.lastMass + MASS_COOLDOWN_MS) - now),
        deltaReadyIn: Math.max(0, (index.lastDelta + DELTA_COOLDOWN_MS) - now),
        massCooldownH: MASS_COOLDOWN_MS / 3600000, deltaCooldownH: DELTA_COOLDOWN_MS / 3600000,
      }));
    }
    if (req.method === 'POST' && u === '/api/index/mass') { const r = await runIndex('mass'); return send(200, JSON.stringify(r)); }
    if (req.method === 'POST' && u === '/api/index/delta') { const r = await runIndex('delta'); return send(200, JSON.stringify(r)); }
    if (req.method === 'POST' && u === '/api/fixer/reset') {
      stopFixer(true);
      const pd = readJSON(PANEL_PODS_F, {}); pd.done = []; writeJSON(PANEL_PODS_F, pd);   // all pods reappear
      try { const pf = readJSON(PODS_F, {}); pf.done = []; writeJSON(PODS_F, pf); } catch (e) {}
      _campaignFixed = new Set(); writeJSON(CAMPAIGN_FIXED_F, { ids: [], updated: new Date().toISOString() });
      fixer.fixed = 0; fixer.failed = 0; fixer.scanned = 0; fixer.sweep = 0; fixer.idx = 0; fixer.total = 0; fixer.pillar = null; fixer.note = 'reset';
      opLog('FIXER reset — pods restored + counters cleared'); return send(200, '{"ok":true}');
    }
    if (req.method === 'POST' && u === '/api/gen/start') { const body = await readBody(req); startGen(body); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/stop') { stopGen(); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/forcestop') { forceGen(); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u === '/api/gen/clear') { clearGen(); return send(200, '{"ok":true}'); }
    if (req.method === 'GET' && u === '/api/health') { const gate = await gateUp(); return send(200, JSON.stringify({ gate, gatePort: GATE_PORT, fixer: fixer.on, gen: gen.on })); }
    if (req.method === 'POST' && u === '/api/gate/restart') { const r = await restartGate(); return send(200, JSON.stringify(r)); }
    if (req.method === 'POST' && u === '/api/stack/restart') {
      const g = await restartGate();
      let fixerStarted = false;
      if (g.ok && !fixer.on) { runFixer().catch(() => {}); fixerStarted = true; }   // gate back → auto-kick the fixer
      return send(200, JSON.stringify({ ok: g.ok, gate: g.gate || false, err: g.err, fixerStarted }));
    }
    return send(404, '{"error":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'error' })); }
}).listen(PORT, () => {
  console.log(`[fixer] Kory's Fixer on http://localhost:${PORT}  (LAN: http://<your-ip>:${PORT})`);
  opLog(`panel up on ${PORT}`);
});
