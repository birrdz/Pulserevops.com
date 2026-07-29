// _hub.js — "Kory's Crew Hub" (owner 2026-07-22). Port 7950. Replaces _multibox_manager.js.
// ONE clean dashboard that spawns + supervises a FLEET of Whole-Crew workers (_page_finisher.js) — each crew
// takes a page start-to-finish (write → face → hero → body 1-6 → mermaid → next) — and SELF-HEALS: a dead crew
// is auto-respawned. The primary machine is 👷 wholecrew. Also: Library Health, Similarity Dedup, and a new
// Pipeline Q&A generator. Zero new deps (http / fs / child_process / @netlify/blobs only).
//
// The whole point of the LIVE MONITOR: each worker's own HTTP server FREEZES during blob writes, so we NEVER
// poll the worker. Every crew writes a status FILE (new/imagebank/_crew_<port>.json) synchronously on every
// stage change; the hub (always responsive) reads those files → boxes + stage bars always render.
'use strict';
require('./_index_guard'); // INDEXING LOCK LAW 4444 — see INDEXING_LOCK_LAW.md
const http = require('http');
const fs = require('fs');
const net = require('net');
const { spawn, execSync } = require('child_process');

const WD = 'C:/Users/koryj/website';
let claudeUnbenched = () => false; try { ({ claudeUnbenched } = require('./new/_claude_bench')); } catch (e) {}
const PORT = 7950;

// ── .env.local (never printed; only injected into env) ──────────────────────────────────────────────────────
try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

function log(m) { try { fs.appendFileSync(WD + '/_hub.out.log', new Date().toISOString() + ' ' + m + '\n'); } catch (e) {} }
process.on('uncaughtException', e => log('UNCAUGHT ' + ((e && e.stack) || e)));

// ── CONFIG ──────────────────────────────────────────────────────────────────────────────────────────────────
// The 22 content pillars. Two-letter codes (plus q/nil) prefix every entry id.
// EVERY pillar in the library gets a row (owner 2026-07-23). Labels below are taken from each pillar's own
// tags/questions in the index — not invented. The 19 after 'nil' were live but missing from the dropdown, so
// their pages could never be targeted by a crew. Malformed test ids (qmpx*, 1-5 rows each) are deliberately
// excluded — they are not real pillars.
const PILLARS = { tl: 'CRO Pulse Tools', gp: 'GTM Playbooks', ra: 'Revenue Architecture', cg: 'CRO Coaching', st: 'Sales Trainings', sk: 'Skill Drills', ik: 'Industry KPIs', tk: 'Tech Stacks', sw: 'Software', bo: 'Buildouts', fr: 'Franchises', bs: 'Book Summaries', ai: 'AI Infra', q: 'General Q&A', mv: 'Movies', aq: 'Aquariums', ca: 'Cars', bt: 'Boats', co: 'Collectibles', sy: 'Style', gb: 'Graphics', nil: 'NIL',
  ed: 'Small Business Ops', er: 'Electronics Reviews', pt: 'Pets', sc: 'Schools', dn: 'Dining', es: 'Estates',
  tv: 'Travel', sp: 'Speeches', tc: 'Telco', rs: 'Resorts', nl: 'Nightlife', cl: 'Clubs', tn: 'Towns',
  lv: 'Living', wl: 'Wellness', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', hf: 'HS Football Recruiting',
  // 🆕 2026-07-23 — three new Q&A pillars. Prefixes checked free against all 40 already in use.
  // "ed" was NOT available (Small Business Ops, 1,036 entries), so EdTech is "et".
  et: 'EdTech', se: 'Sales Enablement', tr: 'Teacher Resources' };

// Machine types the hub can spawn. wholecrew is the primary; the per-slot image machines are kept for
// compatibility with the generic spawn model but are not surfaced in the UI.
const TYPES = {
  // 👷 WHOLE CREW — one worker takes a page start-to-finish. Up to 4 crews; they leapfrog via a shared claim file.
  wholecrew: { file: '_page_finisher.js', portEnv: 'FINISHER_PORT', base: 7700, label: "👷 Kory's Crew", max: 10 },
  booster: { file: '_content_booster.js', portEnv: 'BOOSTER_PORT', base: 7960, label: '🚀 Content Booster', max: 5 },
  media:   { file: '_ad_image_creator.js', portEnv: 'MEDIA_PORT', base: 7970, label: '🎬 Face Cards', max: 5 },
  hero:  { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7810, label: '🦸 Hero (cover)', max: 3, slot: 'hero' },
  body1: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7820, label: '🖼️ Body 1', max: 3, slot: '1' },
  body2: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7830, label: '🖼️ Body 2', max: 3, slot: '2' },
  body3: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7840, label: '🖼️ Body 3', max: 3, slot: '3' },
  body4: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7850, label: '🖼️ Body 4', max: 3, slot: '4' },
  body5: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7860, label: '🖼️ Body 5', max: 3, slot: '5' },
  body6: { file: '_ad_picture_machine.js', portEnv: 'LASTLEG_PORT', base: 7870, label: '🖼️ Body 6', max: 3, slot: '6' },
};

// Per-stage "done" lists (image + text stages). Used by the whole-library health/progress scans.
const DONE_FILES = {
  media: WD + '/new/imagebank/_ad_done.json', booster: WD + '/new/imagebank/_content_done.json',
  hero: WD + '/new/imagebank/_slot_hero_done.json', body1: WD + '/new/imagebank/_slot_1_done.json', body2: WD + '/new/imagebank/_slot_2_done.json',
  body3: WD + '/new/imagebank/_slot_3_done.json', body4: WD + '/new/imagebank/_slot_4_done.json', body5: WD + '/new/imagebank/_slot_5_done.json', body6: WD + '/new/imagebank/_slot_6_done.json',
  lastleg: WD + '/new/imagebank/_picture_done.json'
};
// A page is FULLY DONE only when every one of these stages has passed (text + face + hero + all 6 body images).
const STAGE_KEYS = ['booster', 'media', 'hero', 'body1', 'body2', 'body3', 'body4', 'body5', 'body6'];
const POD = 250;

// ── BLOBS ───────────────────────────────────────────────────────────────────────────────────────────────────
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN
  });
}
// The library index, cached 20s. Strong-consistency read, up to 4 tries (aux lanes can write a stale copy).
let _idxCache = null, _idxAt = 0;
async function progressIndex() {
  if (_idxCache && Date.now() - _idxAt < 20000) return _idxCache;
  for (let i = 0; i < 4; i++) {
    try { const x = await theStore().get('_index.json', { type: 'json', consistency: 'strong' }); if (x && x.entries) { _idxCache = x; _idxAt = Date.now(); return x; } } catch (e) {}
  }
  return _idxCache || { entries: [] };
}

// ── TOOLS ───────────────────────────────────────────────────────────────────────────────────────────────────
// Per-pillar/per-stage pod progress (oldest-first, stable 250-pods).
async function progressFor(type, pillar) {
  const idx = await progressIndex();
  const rx = new RegExp('^' + String(pillar).toLowerCase().replace(/[^a-z]/g, '') + '\\d');
  const rows = (idx.entries || []).filter(e => e && rx.test(String(e.id || ''))).sort((a, b) => (a.ts || 0) - (b.ts || 0));
  let doneSet = new Set(); try { doneSet = new Set(JSON.parse(fs.readFileSync(DONE_FILES[type] || '', 'utf8'))); } catch (e) {}
  const total = rows.length; let done = 0; const pods = [];
  for (let p = 0; p * POD < total; p++) {
    const slice = rows.slice(p * POD, (p + 1) * POD);
    const d = slice.reduce((n, e) => n + (doneSet.has(e.id) ? 1 : 0), 0);
    done += d; pods.push({ n: p + 1, done: d, size: slice.length });
  }
  return { pillar, type, total, done, remaining: total - done, pods };
}
// Per-pillar pods with live remaining counts (single index pass).
async function allPods(type) {
  const idx = await progressIndex();
  let doneSet = new Set(); try { doneSet = new Set(JSON.parse(fs.readFileSync(DONE_FILES[type] || '', 'utf8'))); } catch (e) {}
  const byPillar = {};
  for (const e of (idx.entries || [])) { const id = String((e && e.id) || ''); const pm = id.match(/^([a-z]+)/); if (!pm || !PILLARS[pm[1]]) continue; (byPillar[pm[1]] = byPillar[pm[1]] || []).push({ id, ts: e.ts || 0 }); }
  const out = {};
  for (const code of Object.keys(byPillar)) {
    const rows = byPillar[code].sort((a, b) => (a.ts || 0) - (b.ts || 0)); const pods = [];
    for (let p = 0; p * POD < rows.length; p++) { const slice = rows.slice(p * POD, (p + 1) * POD); const rem = slice.reduce((n, e) => n + (doneSet.has(e.id) ? 0 : 1), 0); pods.push({ n: p + 1, remaining: rem, size: slice.length }); }
    out[code] = pods;
  }
  return out;
}
// ✅ FULLY DONE — a page is fully done if the Whole Crew took it start-to-finish (its own finisher done-list) OR
// it passed every legacy stage. Whole-library totals + per-pillar; drops only malformed qmp* ids.
async function fullyDone() {
  const idx = await progressIndex();
  const sets = STAGE_KEYS.map(t => { try { return new Set(JSON.parse(fs.readFileSync(DONE_FILES[t] || '', 'utf8'))); } catch (e) { return new Set(); } });
  const crew = new Set();
  for (const p of Object.keys(PILLARS)) { try { for (const id of JSON.parse(fs.readFileSync(WD + '/new/imagebank/_finisher_' + p + '_done.json', 'utf8'))) crew.add(String(id)); } catch (e) {} }
  const byPillar = {}; let total = 0, done = 0;
  for (const e of (idx.entries || [])) {
    const id = String((e && e.id) || ''); const pm = id.match(/^([a-z]+)/); if (!pm) continue;
    const p = pm[1]; if (p.length > 3 && !PILLARS[p]) continue;
    total++; if (!byPillar[p]) byPillar[p] = { total: 0, done: 0 };
    byPillar[p].total++;
    if (crew.has(id) || sets.every(s => s.has(id))) { byPillar[p].done++; done++; }
  }
  return { total, done, remaining: total - done, byPillar };
}
// 🔎 LOW-VALUE SCAN — whole-library quality_score sweep. Tiers: bad(≤9) · weak(10-11) · good/at-gate(≥12).
async function lowValueScan() {
  const idx = await progressIndex();
  const tiers = { bad: 0, weak: 0, good: 0 }; const byPillar = {}; let total = 0, low = 0;
  for (const e of (idx.entries || [])) {
    const id = String((e && e.id) || ''); const pm = id.match(/^([a-z]+)/); if (!pm) continue;
    const p = pm[1]; if (p.length > 3 && !PILLARS[p]) continue;
    // Prefer gate_score (what crews stamp); fall back to quality_score. Both ≥12 = leave LOW-VALUE.
    const q = (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 10 : e.quality_score)); total++;
    if (!byPillar[p]) byPillar[p] = { total: 0, low: 0 };
    byPillar[p].total++;
    if (q <= 9) tiers.bad++; else if (q < 12) tiers.weak++; else tiers.good++;
    if (q < 12) { low++; byPillar[p].low++; }
  }
  return { total, low, tiers, byPillar };
}
// ♻️ FIX PILE — un-mark the most-recently-finished N entries of a pillar so crews re-do them, and drop their ids
// into the priority fix-queue the crews read first. Images are left alone (baton/crew-gated).
function fixQueuePath(p) { return WD + '/new/imagebank/_fix_queue_' + p + '.json'; }
function queueFix(p, ids) { let q = []; try { q = JSON.parse(fs.readFileSync(fixQueuePath(p), 'utf8')); } catch (e) {} const merged = Array.from(new Set([...q, ...ids])); try { fs.writeFileSync(fixQueuePath(p), JSON.stringify(merged)); } catch (e) {} return merged.length; }
function requeueFixPile(pillar, count) {
  const p = String(pillar).toLowerCase().replace(/[^a-z]/g, '');
  if (!PILLARS[p]) return { ok: false, err: 'unknown pillar' };
  const n = Math.max(1, Math.min(2000, parseInt(count, 10) || 100));
  const rx = new RegExp('^' + p + '\\d');
  let pool = [];
  const crewDone = WD + '/new/imagebank/_finisher_' + p + '_done.json';
  try { pool = JSON.parse(fs.readFileSync(crewDone, 'utf8')).filter(id => rx.test(String(id))); } catch (e) {}
  if (!pool.length) { try { pool = JSON.parse(fs.readFileSync(DONE_FILES.booster, 'utf8')).filter(id => rx.test(String(id))); } catch (e) {} }
  const pick = pool.slice(-n);
  if (!pick.length) return { ok: false, err: 'nothing finished yet for ' + p };
  const pickSet = new Set(pick);
  const strip = (f) => { try { const a = JSON.parse(fs.readFileSync(f, 'utf8')); const b = a.filter(id => !pickSet.has(id)); if (b.length !== a.length) fs.writeFileSync(f, JSON.stringify(b)); } catch (e) {} };
  strip(DONE_FILES.booster); strip(crewDone);
  const queued = queueFix(p, pick);
  log('REQUEUE ' + p + ' +' + pick.length + ' → fix pile (' + queued + ' queued)');
  return { ok: true, pillar: p, requeued: pick.length, queued };
}
// 🧹 SIMILARITY DEDUP — cluster near-duplicate QUESTIONS into transitive families (union-find), keep the
// highest-quality survivor. Keeps digit tokens (gallon/model numbers), strips "Top N" prefix + 4-digit years.
const DEDUP_STOP = new Set('how do i a an the to in for of you is are what can my with and on at your me we our not this that best top get make start when where which who why should if it as by or be have has 2027 2026'.split(' '));
function qTokens(q) { const s = String(q || '').toLowerCase().replace(/^top\s*\d+\s*/, ' ').replace(/\b(19|20)\d\d\b/g, ' ').replace(/[^a-z0-9 ]/g, ' '); return [...new Set(s.split(/\s+/).filter(w => (w.length > 2 || /\d/.test(w)) && !DEDUP_STOP.has(w)))]; }
function jaccTok(a, b) { const B = new Set(b); let inter = 0; for (const x of a) if (B.has(x)) inter++; const uni = a.length + b.length - inter; return uni ? inter / uni : 0; }
async function dedupScan(pillar, thresh) {
  const idx = await progressIndex(); thresh = Math.max(0.3, Math.min(0.95, thresh || 0.7));
  const want = (!pillar || pillar === '__all__') ? null : String(pillar).toLowerCase().replace(/[^a-z]/g, '');
  const byP = {};
  for (const e of (idx.entries || [])) { const id = String(e.id || ''); const m = id.match(/^([a-z]+)/); if (!m) continue; const p = m[1]; if (p.length > 3 && !PILLARS[p]) continue; if (want && p !== want) continue; (byP[p] = byP[p] || []).push({ id, q: e.question || '', score: e.quality_score == null ? 10 : e.quality_score, ts: e.ts || 0, toks: qTokens(e.question || '') }); }
  const families = []; let removable = 0, scanned = 0;
  for (const p of Object.keys(byP)) {
    const list = byP[p]; scanned += list.length;
    const df = {}; for (const r of list) for (const t of r.toks) df[t] = (df[t] || 0) + 1;
    const cap = Math.max(3, Math.floor(list.length * 0.35));   // drop tokens too common to discriminate
    const inv = {}; list.forEach((r, i) => { for (const t of r.toks) { if (df[t] <= cap) (inv[t] = inv[t] || []).push(i); } });
    // TRANSITIVE clustering (union-find): A~B and B~C ⇒ all three in ONE family even if A and C aren't direct.
    const parent = list.map((_, i) => i);
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
    for (let i = 0; i < list.length; i++) {
      const cnt = {}; for (const t of list[i].toks) { const arr = inv[t]; if (!arr) continue; for (const j of arr) { if (j > i) cnt[j] = (cnt[j] || 0) + 1; } }
      for (const j in cnt) { if (cnt[j] < 2) continue; const jj = +j; if (jaccTok(list[i].toks, list[jj].toks) >= thresh) union(i, jj); }
    }
    const groups = {};
    for (let i = 0; i < list.length; i++) { const r = find(i); (groups[r] = groups[r] || []).push(list[i]); }
    for (const r of Object.keys(groups)) {
      const fam = groups[r]; if (fam.length < 2) continue;
      fam.sort((a, c) => c.score - a.score || c.ts - a.ts);   // survivor = highest score, then newest
      families.push({ pillar: p, keep: fam[0].id, keepQ: fam[0].q, keepScore: fam[0].score, members: fam.map(x => x.id), remove: fam.slice(1).map(x => ({ id: x.id, q: x.q, score: x.score })) });
      removable += fam.length - 1;
    }
  }
  families.sort((a, b) => b.remove.length - a.remove.length);
  return { pillar: want || '__all__', thresh, scanned, totalFamilies: families.length, removable, families: families.slice(0, 250) };
}
async function dedupApply(pillar, thresh, mode) {
  const scan = await dedupScan(pillar, thresh);
  if (!scan.families.length) return { ok: true, removed: 0, dissolved: 0, families: 0, note: 'no dupes found at ' + Math.round(scan.thresh * 100) + '%' };
  if (mode === 'remove') {
    const store = theStore();
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    if (!idx || !idx.entries || idx.entries.length < 1000) return { ok: false, err: 'index read thin — aborted (safety)' };
    try { await store.setJSON('_index_backup_dedup.json', idx); } catch (e) { return { ok: false, err: 'backup failed — aborted' }; }
    const del = new Set(); const surv = {}; const redir = {};
    for (const f of scan.families) { (surv[f.pillar] = surv[f.pillar] || new Set()).add(f.keep); for (const r of f.remove) { del.add(r.id); redir[r.id] = f.keep; } }
    let ok = 0; for (const id of del) { try { await store.delete('answers/' + id + '.json'); } catch (e) {} ok++; }
    const before = idx.entries.length; idx.entries = idx.entries.filter(e => !(e && del.has(e.id))); await store.setJSON('_index.json', idx);
    // 🔒 SEO: merge removed→survivor into the 301 redirect map the renderer serves (no 404s, equity consolidates).
    try { let rm = {}; try { rm = (await store.get('_dedup_redirects.json', { type: 'json' })) || {}; } catch (e) {} Object.assign(rm, redir); await store.setJSON('_dedup_redirects.json', rm); } catch (e) {}
    try { fs.writeFileSync(WD + '/_dedup_removed.json', JSON.stringify([...del])); } catch (e) {}
    for (const p of Object.keys(surv)) queueFix(p, [...surv[p]]);
    _idxCache = null;   // force re-read so counts reflect the removal
    log('DEDUP remove ' + ok + ' extras · index ' + before + '→' + idx.entries.length + ' · backup _index_backup_dedup.json · list _dedup_removed.json');
    return { ok: true, removed: ok, survivors: Object.values(surv).reduce((n, s) => n + s.size, 0), indexBefore: before, indexAfter: idx.entries.length, backup: true };
  }
  // dissolve (default, non-destructive): rewrite every family member distinct via the crew fix-pile.
  const byP = {}; for (const f of scan.families) { (byP[f.pillar] = byP[f.pillar] || new Set()).add(f.keep); for (const r of f.remove) byP[f.pillar].add(r.id); }
  let n = 0; for (const p of Object.keys(byP)) { queueFix(p, [...byP[p]]); n += byP[p].size; }
  log('DEDUP dissolve ' + n + ' pages → fix-pile for distinct rewrite (' + scan.families.length + ' families)');
  return { ok: true, dissolved: n, removed: 0, families: scan.families.length };
}

// ── FLEET ───────────────────────────────────────────────────────────────────────────────────────────────────
const FLEET_F = WD + '/_hub_fleet.json';
let FLEET = [];   // [{id, type, port, pillar, podIndex, opts, restarts, startedAt, child, pid, alive, fails}]
function saveFleet() { try { fs.writeFileSync(FLEET_F, JSON.stringify(FLEET.map(b => ({ id: b.id, type: b.type, port: b.port, pillar: b.pillar, podIndex: b.podIndex || 0, opts: b.opts || {}, restarts: b.restarts, startedAt: b.startedAt })), null, 1)); } catch (e) {} }
function loadFleet() { try { FLEET = (JSON.parse(fs.readFileSync(FLEET_F, 'utf8')) || []).map(b => Object.assign({ child: null, pid: 0, alive: false, fails: 0 }, b)); } catch (e) { FLEET = []; } }

// First free port in this type's band (base..base+40) not already taken by a same-type box.
function nextPort(type) {
  const t = TYPES[type]; const used = new Set(FLEET.filter(b => b.type === type).map(b => b.port));
  for (let p = t.base; p < t.base + 40; p++) if (!used.has(p)) return p;
  return t.base + 40 + Math.floor(Math.random() * 100);
}
function spawnBox(box) {
  const t = TYPES[box.type];
  // stride: this box is lane strideI of strideN among same-type boxes on the SAME pillar/pod → leapfrog, no clash.
  // 👷 ZONE CREWS ARE EXEMPT (owner 2026-07-22): a dedicated pipeline crew must see EVERY page in its pillar, so it
  // rides stride 0-of-1 (no partition) and can pick up all the queued seeds. Zone crews are also excluded from the
  // peer set of normal crews — otherwise adding one would re-slice a roaming crew's lane (each roamer is normally
  // 0-of-1 and sees everything; pairing it with a zone crew silently cut BOTH to half the pages, which is why
  // generated seeds sat unwritten).
  const isZone = !!(box.opts && box.opts.zone);
  const peers = FLEET.filter(b => b.type === box.type && b.pillar === box.pillar && (b.podIndex || 0) === (box.podIndex || 0) && !(b.opts && b.opts.zone));
  const strideN = isZone ? 1 : Math.max(1, peers.length);
  const strideI = isZone ? 0 : Math.max(0, peers.findIndex(b => b.id === box.id));
  box.strideI = strideI; box.strideN = strideN;
  const env = Object.assign({}, process.env, {
    [t.portEnv]: String(box.port), SLOT: t.slot || '', SLOT_PILLAR: box.pillar, DEFAULT_PILLAR: box.pillar,
    POD_INDEX: String(box.podIndex || 0), BOX_I: String(strideI), BOX_N: String(strideN), BOX_SIZE: '250',
    GATE_MIN: '12', GATE_RESTARTS: '4', AUTO_ARM: '1', EMBEDDED: '1',
    // single source of truth: a roaming crew may visit EVERY pillar in the dropdown. Without this the worker fell
    // back to its own 10-pillar default and silently never roamed to Cars/Boats/Pets/Travel/Gaming/etc.
    ROAM_PILLARS: Object.keys(PILLARS).join(',')
  });
  const o = box.opts || {};   // crew options → worker env
  if (o.engine) env.ENGINE_MODE = String(o.engine);
  if (o.cooldown != null) env.COOLDOWN_MS = String(Math.max(0, o.cooldown | 0) * 1000);
  if (o.stagger != null) env.STAGGER_MS = String(Math.max(0, o.stagger | 0) * 1000);
  if (o.roam) env.ROAM = '1';
  if (o.under12) env.UNDER12 = '1';   // 📉 Less than 12/13 mode — prefer failed-rewrite pile + score < 12
  // 💸 CHEAP WRITE (owner 2026-07-27): surgical-first ($0) → publish at ≥12; else ONE DeepSeek try.
  // No Cursor TEAM / FULL redo. Default ON so crews can stay running cheaply toward 12/13.
  if (o.cheap !== false) env.CHEAP_WRITE = '1';
  else env.CHEAP_WRITE = '0';
  // 🆕 NEW Q&A CREW (owner 2026-07-28) — dedicated crew for the pipeline generator's brand-new questions.
  // Works pending seeds ONLY and holds them to ≥12/13 AND a real word floor, so a fresh page can never
  // publish as the ~650-word surgical stub that 12/13 alone allows (WORD_COUNT is the point it drops).
  // Set LAST so the full-write intent always beats the cheap default.
  if (o.newqa) { env.NEWQA = '1'; env.CHEAP_WRITE = '0'; }
  // 🔁 FORCE REWRITE (owner 2026-07-28) — every page goes through the real writer, even one already stamped
  // 12/13. Without this a crew "finishes" pages by trusting the stored score and never rewrites anything.
  if (o.force) env.FORCE_REWRITE = '1';
  // 🔗 DETACHED (owner 2026-07-23): spawn each crew in its OWN process group and unref() it, so a hub restart (or
  // crash) does NOT drag the crew down with it. Combined with the ping-based re-adoption in the listen() handler,
  // this makes restarting the hub non-destructive — live crews keep writing their in-flight page uninterrupted and
  // the new hub simply ADOPTS them. Handle-less adopted crews are still stoppable via killByPort(). windowsHide
  // keeps detached children from popping a console window.
  const child = spawn(process.execPath, [WD + '/' + t.file], { cwd: WD, env, windowsHide: true, detached: true });
  box.child = child; box.pid = child.pid; box.alive = true;
  try { child.unref(); } catch (e) {}   // don't keep the hub's event loop alive waiting on the crew
  child.on('exit', () => { box.alive = false; });   // heal loop respawns
  log('SPAWN ' + box.id + ' ' + box.type + ' :' + box.port + ' pillar=' + box.pillar + ' pid=' + child.pid);
}
// 🪓 KILL-BY-PORT (owner 2026-07-23): a crew that was ADOPTED after a hub restart (see re-adoption below) has no
// child handle — box.child is null — so box.child.kill() silently does nothing and stopBox/stopAll/forceClear could
// not actually stop it. This finds whatever is LISTENING on the port and taskkills it, so an adopted crew is still
// stoppable. Windows: netstat → taskkill /T (kills the child tree too).
// ── 🩸 THE DRIP (owner 2026-07-28) ──────────────────────────────────────────────────────────
// A single slow worker (`new/_drip.js`) that walks the ENTIRE library oldest-first, lifting every
// page to 12/13+, then wraps around and does it again — forever. CC-dominant writer with DeepSeek
// brought in only when CC cannot reach the bar. Spawned detached like the crews, so a hub restart
// never drags it down; the hub re-adopts it by port on the next status poll.
const DRIP_PORT = parseInt(process.env.DRIP_PORT || '7951', 10);
let DRIP_CHILD = null;
let DRIP_PILLAR = '';        // '' = whole library; else a pillar prefix like 'tl'
function dripAlive() {
  if (DRIP_CHILD && DRIP_CHILD.exitCode == null) return true;
  try {                                        // adopted after a hub restart → detect by listening port
    const out = execSync('netstat -ano -p tcp', { encoding: 'utf8', windowsHide: true });
    return out.split('\n').some(l => /LISTENING/i.test(l) && new RegExp('[:.]' + DRIP_PORT + '\\s').test(l));
  } catch (e) { return false; }
}
function spawnDrip(paceSec, pillar) {
  const env = Object.assign({}, process.env, {
    // 🔒 MAX-PLAN ONLY — never hand the drip a metered Anthropic credential (owner law).
    ANTHROPIC_API_KEY: '', ANTHROPIC_AUTH_TOKEN: '', CLAUDE_API_KEY: '',
    DRIP_PILLARS: String(pillar || ''),   // '' = whole library
    DRIP_MIN_WORDS: process.env.DRIP_MIN_WORDS || '2000',
    DRIP_PORT: String(DRIP_PORT),
    DRIP_PACE_MS: String(Math.max(0, paceSec | 0) * 1000),
    GATE_MIN: '12',
    // ✍️ CC ONLY (owner 2026-07-28). This line used to force DRIP_DS_TRIES=2, which overrode the
    // drip's own CC-only default and kept DeepSeek in the ladder after it was removed.
    // ── QUALITY TUNING (owner 2026-07-28: "best possible quality", get pages to 12+) ──
    // Measured over 84 pages: 31 published, 53 missed. The single biggest miss cause was QA pages
    // failing DIRECT_ANSWER / FAQ / SOURCES (25 of 53). surgicalGateFix deliberately will NOT
    // invent sources or FAQ entries, so those can ONLY be fixed by a writer — and the writer was
    // being skipped because the hourly cap kept tripping while the WEEK sat at ~30/350.
    // So: give CC more room per hour, and one more attempt per page. Weekly total and the
    // even-pacing guard are unchanged — they remain the real spend protection.
    DRIP_CC_TRIES: process.env.DRIP_CC_TRIES || '4',
    DRIP_DS_TRIES: process.env.DRIP_DS_TRIES || '0',   // no DeepSeek, no Cursor
    DRIP_CC_PER_HOUR: process.env.DRIP_CC_PER_HOUR || '60',
    DRIP_CC_PER_DAY:  process.env.DRIP_CC_PER_DAY  || '150',
    DRIP_CC_PER_WEEK: process.env.DRIP_CC_PER_WEEK || '350',
    DRIP_EMAIL: '1',
    CLAUDE_OK: '1',                                    // the drip's primary writer is Claude Code
  });
  const child = spawn(process.execPath, [WD + '/new/_drip.js'], { cwd: WD, env, windowsHide: true, detached: true, stdio: 'ignore' });
  DRIP_CHILD = child;
  try { child.unref(); } catch (e) {}
  log('DRIP spawn :' + DRIP_PORT + ' pace=' + paceSec + 's pid=' + child.pid);
  return child;
}

// ── 🛡 SEO GUARD (owner 2026-07-28: "lock it down 4444 … cant be changed, on purpose or accidental")
// Keeps `new/_seo_lock.js guard` alive: it watches index.html SEO, robots.txt, the sitemaps and the
// netlify.toml sitemap redirects, and reverts ANY edit back to the 4444-locked bytes. Detached +
// respawned by the heal loop, so neither a hub restart nor a crash leaves the SEO surface unguarded.
// The guard can only ever write the LOCKED content back, so supervising it can never cause a change.
let SEO_GUARD = null;
function seoGuardAlive() { return !!(SEO_GUARD && SEO_GUARD.exitCode == null); }
function spawnSeoGuard() {
  if (seoGuardAlive()) return SEO_GUARD;
  try {
    const out = fs.openSync(WD + '/_seo_guard.out.log', 'a');
    SEO_GUARD = spawn(process.execPath, [WD + '/new/_seo_lock.js', 'guard'],
      { cwd: WD, env: process.env, windowsHide: true, detached: true, stdio: ['ignore', out, out] });
    try { SEO_GUARD.unref(); } catch (e) {}
    SEO_GUARD.on('exit', () => { SEO_GUARD = null; });
    log('SEO GUARD spawn pid=' + SEO_GUARD.pid);
  } catch (e) { log('SEO GUARD spawn failed — ' + ((e && e.message) || e)); }
  return SEO_GUARD;
}

function killByPort(port) {
  try {
    const out = execSync('netstat -ano -p tcp', { encoding: 'utf8', windowsHide: true });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      const m = line.match(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)/i);
      if (m && parseInt(m[1], 10) === port) pids.add(m[2]);
    }
    let killed = 0;
    for (const pid of pids) { try { execSync('taskkill /PID ' + pid + ' /F /T', { windowsHide: true, stdio: 'ignore' }); killed++; } catch (e) {} }
    return killed;
  } catch (e) { return 0; }
}
// Stop a box whether it has a live child handle (normal) or was adopted after a restart (handle-less → kill by port).
function killBox(box, hard) {
  let ok = false;
  try { if (box && box.child) { box.child.kill(hard ? 'SIGKILL' : 'SIGTERM'); ok = true; } } catch (e) {}
  if (box && (!box.child || hard)) { if (killByPort(box.port)) ok = true; }   // handle-less or force → ensure it's gone
  return ok;
}
// TCP port-alive check — a busy box (event loop blocked mid-write) still ACCEPTS the connection, so we never
// mistake "busy" for "dead". Only a truly gone process fails to connect.
function ping(port) {
  return new Promise(res => { const s = net.connect({ host: '127.0.0.1', port, timeout: 4000 }); let done = false; const fin = v => { if (done) return; done = true; try { s.destroy(); } catch (e) {} res(v); }; s.on('connect', () => fin(true)); s.on('error', () => fin(false)); s.on('timeout', () => fin(false)); });
}
// SELF-HEAL — every 15s; respawn ONLY after 2 consecutive fails (never kill a healthy-but-busy box).
let healing = false;
async function healLoop() {
  if (healing) return; healing = true;
  for (const box of FLEET) {
    const up = await ping(box.port);
    if (up) { box.alive = true; box.fails = 0; }
    else {
      box.fails = (box.fails || 0) + 1; box.alive = false;
      if (box.fails >= 2) {
        box.fails = 0; box.restarts = (box.restarts || 0) + 1;
        log('DOWN ' + box.id + ' :' + box.port + ' pillar=' + box.pillar + ' — respawning (restart #' + box.restarts + ')');
        killBox(box);   // free the port (handle OR port-based) before respawning, so the new child never hits EADDRINUSE
        spawnBox(box); saveFleet();
      }
    }
  }
  healing = false;
}
// ── ⏰ HOURLY NEW Q&A GENERATOR (owner 2026-07-28) ───────────────────────────────────────────────────────────
// "once per hour pick a random pillar so that's 24 new a day. random pillars but try to spread it evenly so you
// get to everything."
//
// SHUFFLED ROUND-ROBIN, not plain random. Picking uniformly at random every hour would hammer some pillars and
// leave others untouched for weeks (the coupon-collector problem — with 44 pillars you'd wait ~190 draws to see
// them all). Instead: shuffle the whole pillar list, walk it one per hour, and only reshuffle once every pillar
// has had its turn. Random order, guaranteed even coverage, every pillar inside ~44 hours.
//
// Each tick spawns the SAME `_pipeline_gen.js` the 4444 hub button spawns — so it inherits the near-duplicate
// gate (rejects a question scoring >= GEN_SIM Jaccard against any existing question in that pillar), the
// on-topic fence, and now GEN_YEAR, which forces every title to end "in 2027".
const HOURLY_GEN_MS = Math.max(60000, parseInt(process.env.HOURLY_GEN_MS || String(3600000), 10));
const HOURLY_GEN_ON = process.env.HOURLY_GEN !== '0';
const HGEN_F = WD + '/_hourly_gen_rotation.json';
// 🚦 Backlog guard. The build-backlog law pauses generation once unbuilt entries pile up, because writing is the
// bottleneck, not generating. Default is deliberately generous so the hourly cadence actually runs as asked;
// set HOURLY_GEN_MAX_PENDING=10 to enforce the stricter law.
const HGEN_MAX_PENDING = Math.max(0, parseInt(process.env.HOURLY_GEN_MAX_PENDING || '250', 10));
function hgenState() { try { return JSON.parse(fs.readFileSync(HGEN_F, 'utf8')) || {}; } catch (e) { return {}; } }
function hgenSave(s) { try { fs.writeFileSync(HGEN_F, JSON.stringify(s, null, 1)); } catch (e) {} }
function nextHourlyPillar() {
  const s = hgenState();
  let q = Array.isArray(s.queue) ? s.queue.filter(p => PILLARS[p]) : [];
  if (!q.length) {
    q = Object.keys(PILLARS);
    for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = q[i]; q[i] = q[j]; q[j] = t; }
    s.round = (s.round || 0) + 1;
    log('HOURLY GEN — new round ' + s.round + ', reshuffled ' + q.length + ' pillars');
  }
  const p = q.shift();
  s.queue = q; s.last = p; s.lastAt = Date.now();
  hgenSave(s);
  return p;
}
let hgenBusy = false;
async function hourlyGenTick() {
  if (!HOURLY_GEN_ON || hgenBusy) return;
  hgenBusy = true;
  try {
    // don't stack seeds forever if nothing is writing them
    if (HGEN_MAX_PENDING) {
      let pending = 0;
      try { const idx = await progressIndex(); for (const e of ((idx && idx.entries) || [])) if (e && e.pending === true) pending++; } catch (e) {}
      if (pending >= HGEN_MAX_PENDING) { log('HOURLY GEN skipped — ' + pending + ' unwritten seeds already queued (cap ' + HGEN_MAX_PENDING + ')'); return; }
    }
    const p = nextHourlyPillar();
    if (!p) return;
    const env = Object.assign({}, process.env, { GEN_PILLAR: p, GEN_COUNT: '1', GEN_NOTES: '', GEN_YEAR: '2027' });
    const st = hgenState();
    log('HOURLY GEN — ' + p + ' (' + (PILLARS[p] || p) + ') · 1 new Q&A · ends "in 2027" · ' + (st.queue || []).length + ' pillars left this round');
    // 📧 Capture stdout so the email reports the question that was ACTUALLY seeded, plus how many
    // near-duplicates were rejected on the way. Piping (rather than writing straight to the log file)
    // is what makes that possible; the output is still appended to the same detail log afterwards.
    const child = spawn(process.execPath, [WD + '/_pipeline_gen.js'], { cwd: WD, env, windowsHide: true });
    let buf = '';
    const grab = d => { buf += String(d); };
    child.stdout.on('data', grab); child.stderr.on('data', grab);
    child.on('error', e => log('HOURLY GEN spawn err ' + ((e && e.message) || e)));
    child.on('exit', () => {
      try { fs.appendFileSync(WD + '/_pipeline_gen.detail.log', buf); } catch (e) {}
      const m = buf.match(/^SEEDED\s+([a-z]+\d+)\s+::\s*(.*)$/m);
      if (!m) { log('HOURLY GEN ' + p + ' — nothing seeded (no unique question accepted); no email'); return; }
      const rejects = parseInt((buf.match(/near-dup rejects (\d+)/) || [, '0'])[1], 10) || 0;
      log('HOURLY GEN ' + p + ' → ' + m[1] + ' :: ' + m[2].slice(0, 90));
      try {
        const { emailNewQuestion } = require(WD + '/_entry_done_email.js');
        emailNewQuestion(p, PILLARS[p] || p, m[1], m[2], { rejects, left: (st.queue || []).length });
      } catch (e) { log('HOURLY GEN email err ' + ((e && e.message) || e)); }
    });
  } catch (e) {
    log('HOURLY GEN err ' + ((e && e.message) || e));
  } finally { hgenBusy = false; }
}

// ── ⏸ PAUSE AFTER N FINISHES (owner 2026-07-29) ─────────────────────────────────────────────────────────────
// "create a toggle that pauses after 100 url finishes."
//
// Counted FLEET-WIDE, not per crew. With 3 crews a per-crew limit of 100 would really mean 300 URLs, which is
// not what "pause after 100 finishes" means — you'd blow through your intended batch by 3x. So the hub sums the
// `done` counter every crew writes into its own status file and stops the whole fleet the moment the total
// reaches the limit.
//
// Lives in the hub rather than in the crews because no single crew can see the fleet total, and because
// stopping is the hub's job anyway. Survives a hub restart via the state file.
const PAUSE_STATE_F = WD + '/_hub_pause_after.json';
function pauseState() { try { return JSON.parse(fs.readFileSync(PAUSE_STATE_F, 'utf8')) || {}; } catch (e) { return {}; } }
function savePauseState(s) { try { fs.writeFileSync(PAUSE_STATE_F, JSON.stringify(s, null, 1)); } catch (e) {} }
// Sum of finished pages across every live crew's status file. Each crew's `done` is a RUN total that resets when
// it is relaunched, which is exactly right: the limit applies to the batch you just sent out.
function fleetFinished() {
  let total = 0;
  for (const b of FLEET) {
    try {
      const s = JSON.parse(fs.readFileSync(WD + '/new/imagebank/_crew_' + b.port + '.json', 'utf8'));
      total += Number(s && s.done) || 0;
    } catch (e) {}
  }
  return total;
}
function pauseAfterTick() {
  const st = pauseState();
  if (!st.limit || st.tripped) return;
  if (!FLEET.length) return;                       // nothing running yet
  const done = fleetFinished();
  st.done = done; savePauseState(st);
  if (done < st.limit) return;
  st.tripped = true; st.trippedAt = Date.now(); savePauseState(st);
  log('⏸ PAUSE-AFTER reached — ' + done + '/' + st.limit + ' URLs finished across the fleet. Stopping all crews.');
  try { stopAll(); } catch (e) { log('pause-after stopAll err ' + ((e && e.message) || e)); }
  try {
    const { emailEntryDone } = require(WD + '/_entry_done_email.js');
    emailEntryDone('⏸ Fleet paused', done + ' URLs', { q: 'Hit the ' + st.limit + '-URL limit — all crews stopped.', note: 'Send the Crew again to continue.' });
  } catch (e) {}
}

// LAUNCH — port-based ids ('W7700') are always unique, so they never collide across restarts or re-adopts.
const ZONE_MAX = 4;   // 👷 pipeline zone crews are EXTRA (the 11th+) — counted/capped separately from the 10 manual crews.
function launch(type, assignments, opts) {
  if (!TYPES[type]) return { ok: false, err: 'bad type' };
  const t = TYPES[type];
  const isZone = !!(opts && opts.zone);
  // Manual (fixing) crews and pipeline zone crews have SEPARATE caps so a zone crew is an added 11th, never stolen
  // from the fixing fleet, and never blocks a manual launch.
  const existing = FLEET.filter(b => b.type === type && !!(b.opts && b.opts.zone) === isZone).length;
  const cap = isZone ? ZONE_MAX : (t.max || 5);
  const room = Math.max(0, cap - existing);
  if (room <= 0) return { ok: false, err: (isZone ? 'zone crews' : t.label) + ' capped at ' + cap + ' (already running ' + existing + ')' };
  const requested = assignments.length;
  assignments = assignments.slice(0, room);
  const created = [];
  // TWO PASSES (owner 2026-07-23): push EVERY box into FLEET first, THEN spawn them. spawnBox derives a crew's
  // stride from how many same-pillar peers are already in FLEET — so spawning inside the push loop gave the crews
  // INCONSISTENT divisors (crew1 saw N=1 and grabbed the whole pillar, crew2 N=2, crew3 N=3 → no even split).
  // Registering all peers first means every crew on the pillar spawns with the SAME N. (The finisher also recomputes
  // the split live each loop, so this is belt-and-suspenders.)
  for (const raw of assignments) {
    const parts = String(raw).split(':');            // "code" or "code:podIndex"
    const pillar = parts[0]; const podIndex = parts[1] != null ? parseInt(parts[1], 10) || 0 : 0;
    const port = nextPort(type);
    const box = { id: type[0].toUpperCase() + port, type, port, pillar, podIndex, opts: opts || {}, restarts: 0, startedAt: Date.now(), child: null, pid: 0, alive: false, fails: 0 };
    FLEET.push(box); created.push(box);
  }
  saveFleet();                 // fleet file reflects ALL new peers before any finisher starts reading it
  for (const box of created) spawnBox(box);
  return { ok: true, created: created.map(b => ({ id: b.id, port: b.port, pillar: b.pillar })), capped: requested > assignments.length ? ('capped at ' + t.max) : '' };
}
function stopBox(id) { const i = FLEET.findIndex(b => b.id === id); if (i < 0) return { ok: false }; killBox(FLEET[i]); FLEET.splice(i, 1); saveFleet(); return { ok: true }; }
function stopAll() { for (const b of FLEET) killBox(b); FLEET = []; saveFleet(); return { ok: true }; }
// 🧨 FORCE STOP + CLEAR — SIGKILL every tracked crew, wipe the fleet file, and reset the shared crew state
// (pillar assignments, image lock) + delete the per-crew status files.
function forceClear() {
  let killed = 0;
  for (const bx of FLEET) { if (killBox(bx, true)) killed++; }   // hard kill via handle AND port (adopted crews too)
  const ports = FLEET.map(x => x.port); FLEET = [];
  saveFleet(); try { fs.writeFileSync(FLEET_F, '[]'); } catch (e) {}
  try { fs.writeFileSync(WD + '/new/imagebank/_pillar_assign.json', '{}'); } catch (e) {}
  try { fs.writeFileSync(WD + '/new/imagebank/_finisher_imglock.json', '{"holder":-1,"ts":0}'); } catch (e) {}
  for (const p of ports) { try { fs.unlinkSync(WD + '/new/imagebank/_crew_' + p + '.json'); } catch (e) {} }
  log('FORCE CLEAR — killed ' + killed + ' crews, fleet wiped');
  return { ok: true, killed, cleared: ports.length };
}

// ── UI ──────────────────────────────────────────────────────────────────────────────────────────────────────
// 📊 INVENTORY COUNTS IN THE DROPDOWNS (owner 2026-07-28: "put inv levels next to pillar names").
// Live entry count + how many are already at 12/13+, read from the index and cached for 5 minutes
// so building a dropdown never costs a blob read. Falls back to the bare name if the index is
// unreachable, so a flaky connection can never blank the pillar list.
let PILLAR_COUNTS = { at: 0, data: {} };
// Everything finished BEFORE this moment doesn't count toward this pass — that is what makes a
// reset actually show full inventory again (22 of 22) instead of "already done".
function resetTs() {
  try { return JSON.parse(fs.readFileSync(WD + '/new/imagebank/_reset_marker.json', 'utf8')).ts || 0; } catch (e) { return 0; }
}
let RESET_TS = resetTs();
// per-pillar reset markers, so one pillar can be put back without disturbing the others
function resetMarks() {
  try { return JSON.parse(fs.readFileSync(WD + '/new/imagebank/_reset_marks.json', 'utf8')) || {}; } catch (e) { return {}; }
}
let RESET_MARKS = resetMarks();
async function refreshPillarCounts() {
  RESET_TS = resetTs();          // pick up a reset that happened while the hub was running
  RESET_MARKS = resetMarks();
  try {
    const idx = await theStore().get('_index.json', { type: 'json', consistency: 'strong' });
    if (!idx || !idx.entries || idx.entries.length < 1000) return PILLAR_COUNTS.data;
    const d = {};
    for (const e of idx.entries) {
      if (!e || !e.id) continue;
      const p = (String(e.id).match(/^([a-z]+)/) || [, ''])[1];
      if (!p) continue;
      if (!d[p]) d[p] = { n: 0, ok: 0, low: 0 };
      d[p].n++;
      // "done" = finished SINCE THE LAST RESET, not "has a good score from some earlier run".
      // Judging by gate_score alone made a freshly-reset pillar read DONE immediately.
      // a per-pillar reset overrides the global one for that pillar
      const mark = Math.max(RESET_TS, (RESET_MARKS[p] || 0));
      if ((e.polished_at || 0) > mark) d[p].ok++;
      // "11 or less" pile: scored by a crew and still under the bar. Distinct from never-scored —
      // these have been tried and came up short, so they are the ones worth a second look.
      else if (e.gate_score != null && e.gate_score <= 11) d[p].low++;
    }
    PILLAR_COUNTS = { at: Date.now(), data: d };
    // 📉 THE "11 OR LESS" PILE — scored and still under the bar, kept as its own worklist so it
    // can be picked up later without hunting through the whole library.
    try {
      const low = idx.entries
        .filter(e => e && e.id && e.gate_score != null && e.gate_score <= 11)
        .map(e => ({ id: e.id, score: e.gate_score, q: String(e.question || '').slice(0, 120) }))
        .sort((a, b) => a.score - b.score);
      fs.writeFileSync(WD + '/_ELEVEN_OR_LESS.json', JSON.stringify({ ts: Date.now(), count: low.length, entries: low }, null, 1));
      const md = ['# 11 OR LESS — scored below the bar, worth a second pass', '',
        'Regenerated whenever the hub refreshes pillar counts. ' + low.length + ' entries.', '',
        '| id | score | question |', '|---|---|---|'];
      for (const e of low.slice(0, 2000)) md.push('| `' + e.id + '` | ' + e.score + '/13 | ' + e.q.replace(/\|/g, '/') + ' |');
      fs.writeFileSync(WD + '/_ELEVEN_OR_LESS.md', md.join('\n') + '\n');
    } catch (e) {}
  } catch (e) {}
  return PILLAR_COUNTS.data;
}
// Label shows what is LEFT, not the total — the number ticks DOWN as pages reach 12/13+, which is
// what "22 → 21 → 20" means in practice. A pillar with nothing left is marked ✅ DONE; anything
// still sitting at 11 or lower is called out separately so it can be worked later.
function pillarLabel(k) {
  const c = PILLAR_COUNTS.data[k];
  if (!c || !c.n) return PILLARS[k];
  const left = c.n - c.ok;
  if (left <= 0) return '✅ ' + PILLARS[k] + ' — DONE (' + c.n.toLocaleString() + ')';
  const low = c.low ? ' · ' + c.low + ' at ≤11' : '';
  return PILLARS[k] + ' — ' + left.toLocaleString() + ' left of ' + c.n.toLocaleString() + low;
}
function pillarOpts(sel) {
  return Object.keys(PILLARS)
    .map(k => `<option value="${k}"${k === sel ? ' selected' : ''}>${pillarLabel(k)}</option>`)
    .join('');
}
// kept for any older reference; the live dropdowns call pillarOpts() so counts stay current
const PILLAR_OPTS = Object.keys(PILLARS).map(k => `<option value="${k}"${k === 'tl' ? ' selected' : ''}>${PILLARS[k]}</option>`).join('');

// ✅ PILLAR COMPLETION (owner 2026-07-23): when every page in a pillar is finished, email ONCE and gray the pillar
// out in every dropdown so it can't be picked again. Emailed pillars are remembered on disk so a hub restart
// doesn't re-send. If a pillar gains new entries later it drops out of "complete" and becomes selectable again.
const PILLAR_DONE_EMAILED = WD + '/_pillar_complete_emailed.json';
const loadEmailed = () => { try { return new Set(JSON.parse(fs.readFileSync(PILLAR_DONE_EMAILED, 'utf8'))); } catch (e) { return new Set(); } };
const saveEmailed = s => { try { fs.writeFileSync(PILLAR_DONE_EMAILED, JSON.stringify([...s])); } catch (e) {} };
function resendKeyHub() {
  let k = process.env.RESEND_API_KEY || process.env.resendapikey; if (k) return k;
  try { for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*(resendapikey|RESEND_API_KEY)\s*=\s*(.*)\s*$/i); if (m) return m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
  return '';
}
async function emailPillarComplete(code, label, total) {
  const k = resendKeyHub(); if (!k) return false;
  const html = '<div style="font-family:system-ui,Arial;font-size:15px;line-height:1.5;color:#111">'
    + '<div style="display:inline-block;background:#0d7a3f;color:#fff;font-size:12px;font-weight:800;letter-spacing:.6px;padding:4px 10px;border-radius:999px;margin:0 0 10px">✅ PILLAR COMPLETE</div>'
    + '<h2 style="margin:0 0 8px;color:#0d7a3f">' + label + ' — all ' + total.toLocaleString() + ' pages finished</h2>'
    + '<p style="margin:0 0 6px;color:#444">Every page in this pillar has been through the crew start-to-finish. It is now greyed out in the hub dropdowns and can no longer be selected.</p></div>';
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST',
      headers: { Authorization: 'Bearer ' + k, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Hub <onboarding@resend.dev>', to: ['koryjordanwhite@gmail.com'],
        subject: '✅ PILLAR COMPLETE — ' + label + ' (' + total.toLocaleString() + ' pages)', html }),
      signal: AbortSignal.timeout(12000) });
    if (r.ok) { log('PILLAR COMPLETE email sent: ' + code); return true; }
    log('pillar-complete email FAIL ' + code + ' ' + r.status); return false;
  } catch (e) { log('pillar-complete email ERR ' + code + ' ' + ((e && e.message) || e)); return false; }
}
// per-pillar totals vs the crew done-list → { total, done, remaining, complete }
// 🔢 ONE SOURCE OF TRUTH FOR EVERY PILLAR NUMBER (owner 2026-07-28: "less than 12 pillar needs to talk to other
// pillars so the numbers line up"). "📉 Less than 12/13" used to be counted somewhere else entirely — a stale
// `_under12_inventory.json` snapshot — while the pillar rows were counted live off the index, so the two labels
// in the SAME dropdown disagreed and neither one could be trusted. Now every number in the dropdown (total,
// remaining, under-12, pending seeds) comes out of this one index pass, so they add up by construction.
async function pillarStatus() {
  const idx = await progressIndex();
  const counts = {}, low = {}, pend = {};
  for (const e of ((idx && idx.entries) || [])) {
    if (!e || !e.id) continue;
    const m = String(e.id).match(/^([a-z]+)\d+$/i); if (!m) continue;
    const p = m[1].toLowerCase(); if (!PILLARS[p]) continue;
    counts[p] = (counts[p] || 0) + 1;
    // same scoring rule the crews use to decide "under 12" (gate_score first, quality_score as the fallback)
    const q = (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 10 : e.quality_score));
    if (q < 12) low[p] = (low[p] || 0) + 1;
    if (e.pending === true) pend[p] = (pend[p] || 0) + 1;
  }
  const out = {};
  const emailed = loadEmailed(); let changed = false;
  for (const p of Object.keys(PILLARS)) {
    const total = counts[p] || 0;
    let done = 0;
    try { done = (JSON.parse(fs.readFileSync(WD + '/new/imagebank/_finisher_' + p + '_done.json', 'utf8')) || []).length; } catch (e) {}
    const remaining = Math.max(0, total - done);
    const complete = total > 0 && remaining === 0;
    out[p] = { label: PILLARS[p], total, done, remaining, complete, under12: low[p] || 0, pending: pend[p] || 0 };
    if (complete && !emailed.has(p)) { emailed.add(p); changed = true; emailPillarComplete(p, PILLARS[p], total); }
    if (!complete && emailed.has(p)) { emailed.delete(p); changed = true; }   // re-opened (new entries) → can alert again
  }
  if (changed) saveEmailed(emailed);
  return out;
}
const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><title>Kory's Crew Hub</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#0b0a0c;color:#ece7ea;font-family:system-ui,Segoe UI,Arial;padding:8px 10px;max-width:1280px;margin:auto;font-size:13px}
.top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
h1{font-size:17px;margin:0;color:#B91C3F;letter-spacing:.2px}
.sub{color:#9c8188;font-size:11px}
.grid{display:grid;grid-template-columns:1fr;gap:8px;align-items:start}
.col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;align-items:start}
.card{background:#121014;border:1px solid #2a1c22;border-left:3px solid #B91C3F;border-radius:9px;padding:9px 10px}
.card h2{font-size:13px;margin:0;font-weight:800;display:inline-block}
.head{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:5px}
label,.mut{color:#9c8188;font-size:11px}
select,input,textarea,button{font-size:12px;padding:5px 7px;border-radius:6px;border:1px solid #3a2730;background:#1b171b;color:#ece7ea}
button{background:#B91C3F;color:#fff;font-weight:800;cursor:pointer;border-color:#B91C3F;padding:6px 9px}
/* 🟢 animated RUNNING badge for the drip */
.dripLive{display:inline-flex;align-items:center;gap:5px;color:#2ecc71;font-weight:800;letter-spacing:.06em;animation:dripGlow 1.6s ease-in-out infinite}
.dripDot{width:8px;height:8px;border-radius:50%;background:#2ecc71;box-shadow:0 0 0 0 rgba(46,204,113,.7);animation:dripPulse 1.4s infinite}
@keyframes dripPulse{0%{box-shadow:0 0 0 0 rgba(46,204,113,.7)}70%{box-shadow:0 0 0 9px rgba(46,204,113,0)}100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}}
@keyframes dripGlow{0%,100%{opacity:1}50%{opacity:.55}}
button:hover{filter:brightness(1.12)}
.sm{padding:4px 7px;font-size:11px}
.gold{background:#FFB81C;color:#231a05;border-color:#FFB81C}
.row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:4px 0}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{background:#0e0c10;border-radius:8px;padding:8px;text-align:center}
.big{font-size:24px;font-weight:900;line-height:1.1}
a{color:#8ab4ff;font-weight:700}
.chip{font-size:10px;background:#1a0f14;border:1px solid #B91C3F;color:#ff9aac;padding:1px 6px;border-radius:20px}
/* ONE monitor panel; one ROW per crew */
#boxgrid{margin-top:6px;border:1px solid #2a1c22;border-radius:9px;background:#0d0b0e;padding:6px;display:flex;flex-direction:column;gap:5px;min-height:52px}
.crewrow{display:grid;grid-template-columns:132px 1fr 150px;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:#100d11;border:1px solid #251820;transition:border-color .35s ease,box-shadow .35s ease}
.crewrow.live{border-color:#2ecc71;box-shadow:0 0 10px rgba(46,204,113,.22)}
.crewid{font-size:11px;font-weight:800;line-height:1.25;overflow:hidden}
.crewid .p{color:#cbb;font-weight:600;font-size:10px}
.crewmeta{text-align:right;font-size:10px;color:#9c8188;line-height:1.3}
.stagebar{display:flex;gap:3px;flex:1;min-width:0}
/* 📦 inventory chip — pages still left in THIS crew's pillar, sat right next to its Write→Merm bar */
.stagewrap{display:flex;align-items:center;gap:7px;min-width:0}
.invchip{flex:0 0 auto;font-size:9.5px;font-weight:900;letter-spacing:.2px;color:#FFB81C;background:#1c1408;border:1px solid #3d2c0d;border-radius:999px;padding:3px 7px;white-space:nowrap}
.invchip.doneall{color:#8affb0;background:#0c1a11;border-color:#1d4029}
.splitchip{flex:0 0 auto;font-size:9.5px;font-weight:900;letter-spacing:.2px;color:#8ab4ff;background:#0c1424;border:1px solid #1d2f52;border-radius:999px;padding:3px 7px;white-space:nowrap}
.cell{flex:1;min-width:20px;text-align:center;padding:5px 1px;border-radius:5px;font-size:9px;font-weight:800;letter-spacing:.2px;border:1px solid transparent;transition:background .4s ease,color .4s ease,box-shadow .4s ease}
.cell.pending{background:#170d10;color:#4e3237}
.cell.done{background:#2ecc71;color:#06210f;box-shadow:0 0 6px rgba(46,204,113,.45)}
.cell.active{background:#FFB81C;color:#231a05;animation:pulse 1s ease-in-out infinite}
.cell.cooldown{background:#3a0e14;color:#ff8a97;border:1px solid #b3121f;font-weight:800;animation:cdblink 1s ease-in-out infinite}
@keyframes cdblink{0%,100%{box-shadow:0 0 3px rgba(179,18,31,.5)}50%{box-shadow:0 0 12px 2px rgba(179,18,31,.85)}}
.crewrow.cooling{border-color:#b3121f;box-shadow:0 0 8px rgba(179,18,31,.25)}
.crewrow.flipping{border-color:#8ab4ff;box-shadow:0 0 12px rgba(138,180,255,.4)}
.flipbadge{margin-left:6px;padding:3px 8px;border-radius:6px;font-size:9px;font-weight:900;white-space:nowrap;color:#04121f;background:linear-gradient(90deg,#8ab4ff,#FFB81C,#8ab4ff);background-size:200% 100%;animation:flipslide .9s linear infinite;box-shadow:0 0 8px rgba(138,180,255,.6)}
@keyframes flipslide{0%{background-position:0% 0}100%{background-position:200% 0}}
/* ♻️ page came up short → thrown out and RESTARTED from scratch on the opposite engine — pink, pulsing, unmissable */
.flipbadge.restart{color:#1a0a14;background:linear-gradient(90deg,#ff9ad5,#FFB81C,#ff9ad5);background-size:200% 100%;box-shadow:0 0 10px rgba(255,154,213,.75);animation:flipslide .7s linear infinite,pulse 1.1s ease-in-out infinite}
.crewrow.flipping:has(.flipbadge.restart){border-color:#ff9ad5;box-shadow:0 0 14px rgba(255,154,213,.5)}
@keyframes pulse{0%,100%{box-shadow:0 0 3px rgba(255,184,28,.55);opacity:.9;transform:translateY(0)}50%{box-shadow:0 0 14px 3px rgba(255,184,28,.95);opacity:1;transform:translateY(-1px)}}
.updot{color:#2ecc71;animation:blink 1.4s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
.bar{height:12px;background:#241016;border-radius:6px;overflow:hidden;border:1px solid #3a2730}
@media(max-width:620px){.crewrow{grid-template-columns:1fr;gap:4px}.crewmeta{text-align:left}}
hr{border:0;border-top:1px solid #2a1c22;margin:7px 0}
@media(max-width:900px){.grid{grid-template-columns:1fr}}
@media(max-width:560px){.grid2{grid-template-columns:1fr}}
</style>
<div class=top>
  <h1>👷 Kory's Crew Hub</h1>
  <div style="background:linear-gradient(90deg,#B91C3F,#FFB81C);color:#0a0a0e;font-weight:900;padding:6px 12px;border-radius:8px;margin:6px 0;font-size:13px;letter-spacing:1px">🆕 NEW HUB v2 — rebuilt clean · one panel, glowing crew rows below · if this bar is missing you're on a cached page (Ctrl+Shift+R)</div>
  <span class=sub>fleet spawner + live file-based monitor · <span class=chip>self-healing</span> · <a href="/map">🗺️ map</a></span>
</div>

<div class=grid>
  <!-- ════ LEFT: A. KORY'S CREW — launcher + LIVE MONITOR (prominent) ════ -->
  <div class=card style="border-left-color:#FFB81C">
    <div class=head><h2 style="color:#FFB81C">👷 Kory's Crew</h2><span class=mut>write → face → hero → body 1-6 → mermaid, per page</span></div>
    <div class=row>
      <select id=crewpillar title=Pillar style="max-width:180px"><option value=__smallest__>🎯 Smallest inventory (finish it off)</option><option value=__largest__>🎯 Largest inventory (biggest pile)</option><option value=__worst__>🎯 Worst scores (most bad)</option><option value=__notfinished__>📋 Not-Finished pile</option><option value=__under12__ selected>📉 Less than 12/13</option><option value=__newqa__>🆕 New pipeline Q&amp;As (unwritten seeds)</option><option disabled>──── or a pillar ────</option>${PILLAR_OPTS}</select>
      <select id=crewcount title="Crews" style="width:48px"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select>
      <select id=crewengine title="Writer — ⭐ Premium auto-selects and climbs through every writer until the page clears 12/13" style="width:230px">' + (claudeUnbenched()
        ? '<option value=premium selected>⭐ PREMIUM — all writers → 12/13</option><option value=ccds>CC + DS (CC first)</option><option value=claude>Claude Code only</option><option value=deepseek>DeepSeek only</option><option value=alternate>Alternate (DS↔CC)</option><option value=cursor>Cursor Agent</option>'
        : '<option value=premium selected>⭐ PREMIUM — all writers → 12/13</option><option value=deepseek>DeepSeek</option><option value=cursor>Cursor Agent</option><option value=alternate>Alternate (DS↔Cursor)</option><option value=claude disabled>Claude Code — cooldown til Tue</option>') + '</select>
      <label>Stag<input id=crewstagger type=number value=0 min=0 style="width:48px;text-align:center"></label>
      <label>Cool<input id=crewcool type=number value=0 min=0 style="width:48px;text-align:center"></label>
      <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer" title="Hop to a fresh unclaimed pillar each page"><input type=checkbox id=crewroam checked>roam</label>
      <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;color:#ffd08a" title="Stop the whole fleet once this many URLs have been finished across ALL crews (not per crew). Uncheck for no limit."><input type=checkbox id=crewpauseon>⏸ pause after<input id=crewpauseafter type=number value=100 min=1 style="width:56px;text-align:center;margin-left:3px"></label>
      <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;color:#8affb0" title="Surgical then DeepSeek x3 then Cursor when stuck. No images until gate 12+"><input type=checkbox id=crewcheap checked>cheap</label>
      <label style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;color:#FFB81C" title="Rewrite EVERY page through the full writer ladder, even one already stored at 12/13 or 13/13 - and re-pull its images under the shared standards. Without this a crew trusts the stored score and skips the page without touching it."><input type=checkbox id=crewforce>🔁 redo all</label>
    </div>
    <div class=row>
      <input id=crewcode placeholder=4444 inputmode=numeric style="width:56px;text-align:center">
      <button class=gold onclick=sendCrew()>👷 Send the Crew</button>
      <button class=sm onclick=forceClear() style="margin-left:auto">🧨 Force Stop + Clear</button>
    </div>
    <div class=mut style="margin:2px 0;font-size:11px;color:#8affb0">PLAN: write-until-12 · surgical → DS×3 → Cursor rescue → no images until ≥12 · Less than 12/13 · roam</div>
    <div id=crewmsg class=mut style="margin:2px 0"></div>
    <div id=winloss style="margin:4px 0 6px;padding:5px 8px;border-radius:6px;background:#141118;border:1px solid #2a2430;font-size:11px"></div>
    <div id=boxgrid><div class=mut>No crews running — hit 👷 Send the Crew.</div></div>
  </div>

  <!-- ════ RIGHT: B/C/D compact stack ════ -->
  <div class=col>
    <!-- A2. 🩸 THE DRIP — slow forever-pass over the WHOLE library (owner 2026-07-28) -->
    <div class=card style="border-left-color:#B91C3F">
      <div class=head>
        <h2 style="color:#ff8fa8">🩸 The Drip</h2>
        <span id=dripbadge class=mut style="font-size:11px">○ stopped</span>
        <button id=dripbtn class=sm onclick=toggleDrip() style="margin-left:auto;background:#2ecc71;border-color:#2ecc71;color:#06210f;font-weight:800">▶ START</button>
      </div>
      <div class=mut style="font-size:11px;color:#ff8fa8;margin:2px 0">
        CC-only writer · auditor + supervisor · 2000-3000 words · places hero + face card + up to 10 body images (validated, deduped, DOM-verified)
</div>
      <div class=row style="margin:4px 0">
        <label class=mut style="font-size:11px">pillar</label>
        <select id=drippillar style="max-width:170px" title="Restrict the drip to one pillar (default: the whole library)"><option value="">🌍 Whole library</option>${PILLAR_OPTS}</select>
      </div>
      <div id=dripscope class=mut style="font-size:10.5px;margin:2px 0 6px"></div>
      <div class="grid2">
        <div class=stat style="background:#0c130e"><div class=mut style="font-size:10px">✅ FINISHED</div><div id=dripdone class=big style="color:#8affb0">—</div><div id=driplap class=mut>—</div></div>
        <div class=stat style="background:#170f0c"><div class=mut style="font-size:10px">⏳ LEFT TO COMPLETE</div><div id=dripleft class=big style="color:#FFB81C">—</div><div id=drippct class=mut>—</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:6px">
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">🤖 CC wins</div><div id=dripcc class=big style="color:#8ab4ff;font-size:19px">—</div></div>
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">🆘 DS rescues</div><div id=dripds class=big style="color:#8ab4ff;font-size:19px">—</div></div>
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">🔧 surgical</div><div id=dripsx class=big style="color:#8ab4ff;font-size:19px">—</div></div>
      </div>
      <div class=row style="margin-top:6px">
        <button class=sm onclick=resetPillar() title="Put the selected pillar back to be re-run (count returns to full)" style="background:#7a5b12;border-color:#7a5b12">♻️ Reset pillar</button>
        <button class=sm onclick=resetPillar(true) title="Put the WHOLE library back to be re-run" style="background:#5b2a2a;border-color:#5b2a2a">♻️ Reset all</button>
      </div>
      <div class=row style="margin-top:6px">
        <label class=mut style="font-size:11px">pace<input id=drippace type=number value=0 min=0 max=3600 style="width:56px;text-align:center" title="seconds between pages"></label>
        <input id=dripcode placeholder=4444 inputmode=numeric style="width:56px;text-align:center">
        <a href="http://localhost:7951/" target=_blank class=mut style="margin-left:auto;font-size:11px">open :7951 ↗</a>
      </div>
      <div id=dripnow style="margin-top:6px;padding:7px 9px;border-radius:6px;background:#141118;border:1px solid #2a2430;font-size:11px"></div>
      <div id=dripfeed style="margin-top:5px;max-height:150px;overflow:auto;font-size:11px"></div>
      <div id=dripmode style="margin-top:5px;font-size:11.5px">🖼 IMAGES ONLY</div>
      <div id=dripmsg class=mut style="margin-top:4px;font-size:11px"></div>
    </div>

    <!-- B. LIBRARY HEALTH -->
    <div class=card style="border-left-color:#2ecc71">
      <div class=head><h2 style="color:#8affb0">📊 Library Health</h2><span class=mut id=healthupd style="font-size:10px">auto every 60s</span><button class=sm onclick=scanHealth() style="background:#2ecc71;border-color:#2ecc71;color:#06210f">↻ Scan</button></div>
      <div class="grid2">
        <div class=stat style="background:#0c130e"><div class=mut style="font-size:10px">✅ FULLY DONE</div><div id=fdnum class=big style="color:#8affb0">—</div><div id=fdsub class=mut>—</div></div>
        <div class=stat style="background:#170f0c"><div class=mut style="font-size:10px">🔎 LOW-VALUE (&lt;12/13)</div><div id=lvnum class=big style="color:#FFB81C">—</div><div id=lvsub class=mut>—</div></div>
      </div>
      <div class=head style="margin-top:6px"><span class=mut style="font-size:10px">⚡ FIX SPEED — whole crew</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">⚡ / sec</div><div id=rsec class=big style="color:#8ab4ff;font-size:20px">—</div></div>
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">⚡ / min</div><div id=rmin class=big style="color:#8ab4ff;font-size:20px">—</div></div>
        <div class=stat style="background:#0c1013"><div class=mut style="font-size:10px">⚡ / hour</div><div id=rhour class=big style="color:#8ab4ff;font-size:20px">—</div></div>
      </div>
      <div id=lvtiers class=mut style="margin-top:5px"></div>
      <div id=lvpillars style="margin-top:5px;max-height:130px;overflow:auto"></div>
      <hr>
      <div class=row>
        <span class=mut>♻️ Fix-pile</span>
        <select id=fqpillar style="max-width:130px">${PILLAR_OPTS}</select>
        <input id=fqcount type=number value=100 min=1 max=2000 style="width:60px;text-align:center" title="how many">
        <input id=fqcode placeholder=4444 inputmode=numeric style="width:52px;text-align:center">
        <button class="gold sm" onclick=requeueFix()>♻️ Re-queue</button>
      </div>
      <div id=fqout class=mut></div>
    </div>

    <!-- C. SIMILARITY DEDUP -->
    <div class=card style="border-left-color:#7a5cff">
      <div class=head><h2 style="color:#b9a8ff">🧹 Similarity Dedup</h2></div>
      <div class=row>
        <select id=ddpillar style="max-width:130px"><option value=__all__>🌐 Whole library</option>${PILLAR_OPTS}</select>
        <select id=ddthresh style="width:110px"><option value=0.6>loose 60%</option><option value=0.7 selected>default 70%</option><option value=0.8>tight 80%</option></select>
        <button class=sm onclick=dedupScan() style="background:#7a5cff;border-color:#7a5cff">🔍 Scan</button>
      </div>
      <div id=ddout class=mut style="margin-top:3px">click Scan…</div>
      <div id=ddfam style="max-height:150px;overflow:auto;margin-top:4px"></div>
      <div class=row style="margin-top:5px">
        <input id=ddcode placeholder=4444 inputmode=numeric style="width:52px;text-align:center">
        <button class=sm onclick="dedupApply('dissolve')" style="background:#2ecc71;border-color:#2ecc71;color:#06210f">♻️ Dissolve</button>
        <button class=sm onclick="dedupApply('remove')">🗑️ Remove</button>
      </div>
      <div id=ddapply class=mut></div>
    </div>

    <!-- D. NEW PIPELINE Q&A -->
    <div class=card style="border-left-color:#3fb6d6">
      <div class=head><h2 style="color:#8fe3f5">✍️ New Pipeline Q&A</h2><span class=mut>seeds pending · text only</span></div>
      <div class=row>
        <select id=genpillar style="max-width:130px">${PILLAR_OPTS}</select>
        <input id=gencount type=number value=10 min=1 max=200 style="width:56px;text-align:center" title="how many">
        <input id=gencode placeholder=4444 inputmode=numeric style="width:52px;text-align:center">
        <button class=sm onclick=generate() style="background:#3fb6d6;border-color:#3fb6d6;color:#04222b">✍️ Generate</button>
      </div>
      <textarea id=gennotes placeholder="Notes — what should these be about? (blank = general coverage)" style="width:100%;min-height:38px;resize:vertical;margin-top:4px"></textarea>
      <div id=genout class=mut></div>
      <div id=genlog class=mut style="font-size:10px;margin-top:3px"></div>
    </div>
  </div>
</div>

<script>
var PILLARS=${JSON.stringify(PILLARS)};
async function j(u,o){return await (await fetch(u,o)).json();}
function code(id){return (document.getElementById(id).value||'').trim();}

// ── A. crew launcher + live monitor ──────────────────────────────────────────────────────────────────────────
async function sendCrew(){
  if(code('crewcode')!=='4444'){alert('type 4444 in the box');return;}
  var pillar=document.getElementById('crewpillar').value;
  var roam=document.getElementById('crewroam').checked;
  var under12=false, newqa=false;
  if(pillar==='__under12__'){
    var tp=await j('/api/targetpillar?mode=under12');
    if(!tp||!tp.pillar){alert('nothing left under 12/13');return;}
    // keep roam if checked — hop pillars that still have gate < 12 (owner 2026-07-27)
    pillar=tp.pillar; under12=true;
  } else if(pillar==='__newqa__'){
    // 🆕 dedicated NEW Q&A crew — writes the pipeline generator's fresh seeds, full length, nothing else.
    var tn=await j('/api/targetpillar?mode=newqa');
    if(!tn||!tn.pillar){alert('no unwritten pipeline seeds — generate some in "new pipeline Q&A" first');return;}
    pillar=tn.pillar; newqa=true;
  } else if(pillar.indexOf('__')===0){
    var tp2=await j('/api/targetpillar?mode='+pillar.replace(/_/g,''));
    if(!tp2||!tp2.pillar){alert('nothing left to target for that mode');return;}
    pillar=tp2.pillar; roam=false;
  }
  var n=parseInt(document.getElementById('crewcount').value,10)||1; if(n>10)n=10;
  var opts={engine:document.getElementById('crewengine').value,
    stagger:Math.max(0,parseInt(document.getElementById('crewstagger').value,10)||0),
    cooldown:Math.max(0,parseInt(document.getElementById('crewcool').value,10)||0),
    roam:roam, under12:under12, newqa:newqa,
    // ⏸ fleet-wide finish limit — 0/absent means run forever
    pauseAfter: (document.getElementById('crewpauseon') && document.getElementById('crewpauseon').checked)
      ? Math.max(1, parseInt(document.getElementById('crewpauseafter').value,10)||100) : 0,
    cheap: !!(document.getElementById('crewcheap') && document.getElementById('crewcheap').checked),
    // 🔁 redo-all: ignore the stored gate score and run the full ladder + fresh images on every page
    force: !!(document.getElementById('crewforce') && document.getElementById('crewforce').checked)};
  // cheap mode: force DeepSeek for the paid pass (Cursor rescue is the expensive path)
  if(opts.cheap && opts.engine==='alternate') opts.engine='deepseek';
  // ⭐ PREMIUM is the whole ladder by definition — cheap mode would contradict it, so premium turns cheap off.
  if(opts.engine==='premium') opts.cheap=false;
  if(opts.force) opts.cheap=false;   // 🔁 redo-all always takes the full ladder, never the surgical shortcut
  // 🆕 a NEW Q&A crew never runs cheap — a brand-new page has no prose to top up, so the surgical
  // rung would just publish a padded skeleton at 12/13. Full write every time.
  if(newqa) opts.cheap=false;
  var pillars=[]; for(var i=0;i<n;i++)pillars.push(pillar);
  var r=await j('/api/launch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444',type:'wholecrew',pillars:pillars,opts:opts})});
  var m=document.getElementById('crewmsg');
  if(!r||!r.ok){m.innerHTML='<span style=color:#ff6a6a>'+((r&&r.err)||'failed')+'</span>';return;}
  var launchHtml='<span style=color:#8affb0>👷 '+((r.created||[]).length)+' crew(s) sent · '+(newqa?'🆕 new Q&As · ':'')+(under12?'📉 <12/13 · ':'')+(opts.cheap?'💸 cheap · ':'')+(opts.roam?'JUMP pillars':(PILLARS[pillar]||pillar))+' · '+opts.engine+' · stagger '+opts.stagger+'s · cooldown '+opts.cooldown+'s'+(r.capped?' ('+r.capped+')':'')+'</span>';
  m.setAttribute('data-launch', launchHtml); m.innerHTML=launchHtml+' <span style="color:#FFB81C;font-weight:800">· 0W / 0L</span>';
  renderCrews();
}
async function forceClear(){
  if(!confirm('🧨 FORCE STOP every crew and wipe the fleet? (clears all boxes, the image lock, and pillar assignments)'))return;
  try{var r=await j('/api/forceclear',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444'})});
    document.getElementById('crewmsg').innerHTML='<span style=color:#FFB81C>🧨 killed '+(r.killed||0)+' crews · fleet wiped clean ('+(r.cleared||0)+' status files cleared). Ready for a fresh launch.</span>';
    renderCrews();
  }catch(e){alert('failed');}
}
// stage sequence + labelled cells. 'lock' is treated as 'cover' so Write shows DONE (green) while images wait.
var CSEQ=['write','face','hero','body1','body2','body3','body4','body5','body6','mermaid'];
var CBOX=[['write','Write'],['face','Face'],['hero','Hero'],['body1','Img1'],['body2','Img2'],['body3','Img3'],['body4','Img4'],['body5','Img5'],['body6','Img6'],['mermaid','Merm']];
// returns the visual STATE class for a cell: 'done' (green) · 'active' (glowing yellow) · 'pending' (dim).
function cstate(cell,cur){
  if(cur==='done')return 'done';
  if(cur==='lock')cur='face';      // write done, waiting for image turnstile → Write green, Face active
  if(cur==='cover')cur='hero';     // legacy 'cover' → treat as hero stage
  var bi=CSEQ.indexOf(cell),ci=CSEQ.indexOf(cur);
  if(ci<0)return 'pending';        // idle / unknown → nothing lit
  if(bi<ci)return 'done';          // already passed → solid green
  if(bi===ci)return 'active';      // CURRENT stage → glowing yellow
  return 'pending';                // not reached yet → dim
}
async function renderCrews(){
  try{
    var d=await j('/api/crews'); var g=document.getElementById('boxgrid'); if(!g)return;
    // ⏸ progress toward the fleet-wide finish limit, above the crew rows
    var pab=document.getElementById('pausebar');
    if(!pab){pab=document.createElement('div');pab.id='pausebar';pab.style.cssText='margin:4px 0 8px;font-size:12px';g.parentNode.insertBefore(pab,g);}
    if(d.pauseAfter){
      var pct=Math.min(100,Math.round(d.pauseAfter.done/d.pauseAfter.limit*100));
      pab.innerHTML=d.pauseAfter.tripped
        ? '<span style="color:#ffd08a;font-weight:800">⏸ PAUSED — hit the '+d.pauseAfter.limit+'-URL limit. Send the Crew again to continue.</span>'
        : '<span style="color:#ffd08a">⏸ pause at '+d.pauseAfter.limit+' — <b>'+d.pauseAfter.done+'</b> finished ('+pct+'%)</span>'
          +'<div style="height:5px;background:#241016;border-radius:3px;overflow:hidden;margin-top:3px"><div style="height:100%;width:'+pct+'%;background:#FFB81C"></div></div>';
    } else pab.innerHTML='';
    if(!d.crews||!d.crews.length){
      g.innerHTML='<div class=mut style="padding:8px">No crews running — hit 👷 Send the Crew.</div>';
      var wl0=document.getElementById('winloss');   // keep the 🏁 box visible even with 0 crews (it used to vanish)
      if(wl0)wl0.innerHTML='<span class=mut>🎯 This run: no crews — Send the Crew to start the 12+ scoreboard.</span>'; var cm0=document.getElementById('crewmsg'); if(cm0) cm0.removeAttribute('data-launch');
      return;
    }
    g.innerHTML=d.crews.map(function(c){
      var st=c.status||{};
      var stale=st.ts?(Date.now()-st.ts>120000):true;              // status file older than 120s → idle
      var cur=stale?'idle':(st.stage||'idle');
      var cdLeft=(cur==='cooldown'&&st.cooldownUntil)?Math.max(0,Math.ceil((st.cooldownUntil-Date.now())/1000)):0;
      var cooling=cur==='cooldown'&&cdLeft>0;                        // resting between pages → red countdown
      var flipping=!stale&&st.flip;                                 // over-the-hump engine switch in progress
      // 🏁 PAUSED — crew finished its pillar and stopped on purpose (owner 2026-07-28). Not idle, not dead:
      // it is watching for new work and will start again by itself if any lands.
      var paused=!stale&&!!st.paused;
      var live=!stale&&cur!=='idle'&&!cooling&&!paused;
      var bars=paused
        ? '<div class="cell" style="flex:1;min-width:0;background:#1c2a1f;color:#8affb0;border-color:#2f5c3a">🏁 PILLAR COMPLETE — ⏸ PAUSED'+(st.pauseWhy?' ('+String(st.pauseWhy).replace(/</g,'&lt;')+')':'')+'</div>'
        : cooling
        ? '<div class="cell cooldown" style="flex:1;min-width:0">🧊 COOLDOWN — next page in '+cdLeft+'s</div>'
        : CBOX.map(function(b){return '<div class="cell '+cstate(b[0],cur)+'">'+b[1]+'</div>';}).join('')
          +(flipping?'<span class="flipbadge'+(/RESTART/i.test(st.flip)?' restart':'')+'">'+st.flip+'</span>':'');
      var pil=st.pillar||c.pillar;
      // 📦 INVENTORY CHIP (owner 2026-07-23): how many pages are still left in THIS crew's pillar, right beside its
      // Write→Merm bar, so the backlog for the category being worked is readable without hunting the meta column.
      var rem=Number(st.remaining||0), tot=Number(st.total||0);
      var inv='<span class="invchip'+(tot&&!rem?' doneall':'')+'" title="'+(PILLARS[pil]||pil)+': '+rem.toLocaleString()+' left of '+tot.toLocaleString()+' · '+(st.done||0)+' finished by this crew">'
        +(tot&&!rem?'✅ pillar done':'📦 '+rem.toLocaleString()+' left')+'</span>';
      // 🔢 SPLIT BADGE — when 2+ crews share this pillar, show which slice this crew works (e.g. "⅓ splitting 1/3")
      // so the even-split is visible. splitN=1 (solo/roaming) shows nothing.
      var sN=Number(st.splitN||1), sI=Number(st.splitI||0);
      var split=sN>1?'<span class="splitchip" title="'+sN+' crews sharing '+(PILLARS[pil]||pil)+' evenly — this crew works every '+sN+'th page (slice '+(sI+1)+' of '+sN+')">🔗 '+(sI+1)+'/'+sN+' split</span>':'';
      return '<div class="crewrow'+(live?' live':'')+(cooling?' cooling':'')+(flipping?' flipping':'')+'">'
        +'<div class=crewid>'+(paused?'<span style=color:#8affb0>⏸ PAUSED</span>':cooling?'<span style=color:#ff6a6a>● COOLDOWN</span>':live?'<span class=updot>●</span> UP':'<span style=color:#777>○ idle</span>')+' '+c.id
          +(st.newqa?'<span style="color:#FFB81C;font-weight:800"> 🆕</span>':'')
          +'<div class=p>'+String((PILLARS[pil]||pil)).slice(0,18)+'</div></div>'
        +'<div class=stagewrap>'+inv+split+'<div class=stagebar>'+bars+'</div></div>'
        +'<div class=crewmeta><b style="color:#8ab4ff">'+(st.engine||'')+'</b> :'+c.port+(c.restarts?' ↻'+c.restarts:'')
          +'<br><b style="color:#FFB81C">'+Number(st.remaining||0).toLocaleString()+'</b> left · done '+(st.done||0)
          +((st.win||st.loss)?'<br><span style=color:#8affb0>'+(st.win||0)+'W</span>-<span style=color:#ff6a6a>'+(st.loss||0)+'L</span> saves':'')
          +'<br><span style=color:#cbb>'+String(st.current||'—').slice(0,22)+'</span></div>'
      +'</div>';
    }).join('');
    // 🎯 LIVE fleet gate scoreboard (same place as crew status): hit 12+ vs missed <12
    var W=0,L=0, lasts=[]; d.crews.forEach(function(c){var s=c.status||{};W+=(s.win||0);L+=(s.loss||0); if(s.lastGate) lasts.push(String(s.pillar||c.pillar)+' '+s.lastGate);});
    var wl=document.getElementById('winloss');
    var cm=document.getElementById('crewmsg');
    var tot=W+L, pct=tot?Math.round(W/tot*100):0;
    var scoreline='🎯 <b>'+W+' hit 12+</b> · <span style="color:#ff6a6a">'+L+' missed</span>'+(tot?(' · <b style="color:'+(pct>=50?'#8affb0':'#ff6a6a')+'">'+pct+'%</b>'):'')+(lasts.length?(' · last <b style="color:#FFB81C">'+lasts[lasts.length-1]+'</b>'):'');
    if(wl){
      wl.innerHTML=tot
        ? '🎯 <b>This run:</b> <span style="color:#8affb0;font-weight:900">'+W+' hit 12+</span> · <span style="color:#ff6a6a;font-weight:900">'+L+' missed</span> · <b style="color:'+(pct>=50?'#8affb0':'#ff6a6a')+'">'+pct+'%</b> clear'+(lasts.length?(' · last <b style="color:#FFB81C">'+lasts[lasts.length-1]+'</b>'):'')
        : '<span class=mut>🎯 This run: 0 hit 12+ · 0 missed — waiting on first finish.</span>';
    }
    // Keep the "N crew · JUMP pillars" line and append live W/L (owner: usually shown here)
    if(cm && d.crews && d.crews.length){
      var base=cm.getAttribute('data-launch')||'';
      if(!base){
        // preserve current launch text once
        var t=(cm.textContent||'').trim();
        if(t && t.indexOf('hit 12')<0) cm.setAttribute('data-launch', cm.innerHTML);
        base=cm.getAttribute('data-launch')||'';
      }
      if(base) cm.innerHTML=base+' <span style="color:#FFB81C;font-weight:800">· '+W+'W / '+L+'L</span>';
      else cm.innerHTML='<span style=color:#8affb0>'+scoreline+'</span>';
    }
  }catch(e){}
}
// ✅ grey out finished pillars in EVERY dropdown — strike-through + disabled so a done pillar can't be picked.
async function paintPillarStatus(){
  try{
    var st=await (await fetch('/api/pillarstatus')).json();
    var u12=null; try{u12=await j('/api/targetpillar?mode=under12');}catch(e){}
    var nqa=null; try{nqa=await j('/api/targetpillar?mode=newqa');}catch(e){}
    ['crewpillar','genpillar','ddpillar','fqpillar'].forEach(function(selId){
      var sel=document.getElementById(selId); if(!sel)return;
      Array.prototype.forEach.call(sel.options,function(o){
        if(o.value==='__under12__'){
          // 🔢 sum the SAME per-pillar numbers the rows below show, so the totals reconcile on screen
          var n=0,have=false;
          for(var k in st){ if(st[k]&&st[k].under12!=null){ n+=st[k].under12; have=true; } }
          if(!have&&u12&&u12.inventory!=null){ n=u12.inventory; have=true; }
          o.textContent='📉 Less than 12/13'+(have?' — '+Number(n).toLocaleString()+' left':'');
          return;
        }
        if(o.value==='__newqa__'){
          // 🆕 unwritten pipeline seeds — same index pass again, so this reconciles with the rows too
          var sn=0,shave=false;
          for(var k2 in st){ if(st[k2]&&st[k2].pending!=null){ sn+=st[k2].pending; shave=true; } }
          if(!shave&&nqa&&nqa.inventory!=null){ sn=nqa.inventory; shave=true; }
          o.textContent='🆕 New pipeline Q&As'+(shave?' — '+Number(sn).toLocaleString()+' unwritten':'');
          o.disabled=(shave&&sn===0);
          return;
        }
        var s=st[o.value]; if(!s)return;
        var base=o.getAttribute('data-label')||o.textContent.replace(/ — .*$/,'').replace(/^✅ /,'');
        if(!o.getAttribute('data-label'))o.setAttribute('data-label',base);
        if(s.complete){
          o.disabled=true; o.style.color='#e5484d'; o.style.textDecoration='line-through';
          o.style.textDecorationColor='#ff2d2d'; o.style.textDecorationThickness='2px';
          o.textContent=base+' — DONE ('+s.total.toLocaleString()+')';
        }else{
          o.disabled=false; o.style.color=''; o.style.textDecoration=''; o.style.textDecorationColor=''; o.style.textDecorationThickness='';
          // 📉/🆕 the pillar's own share of the two aggregate rows above it — the per-pillar numbers add up to
          // the "Less than 12/13" and "New pipeline Q&As" totals exactly, because all three come from one pass.
          var extra=(s.under12?' · 📉'+Number(s.under12).toLocaleString():'')+(s.pending?' · 🆕'+Number(s.pending).toLocaleString():'');
          o.textContent=base+' — '+s.remaining.toLocaleString()+' left / '+s.total.toLocaleString()+extra;
        }
      });
    });
  }catch(e){}
}
paintPillarStatus(); setInterval(paintPillarStatus,60000);
setInterval(renderCrews,1000); renderCrews();
scanHealth(true); setInterval(function(){scanHealth(true);},60000);   // 📊 library health auto-refreshes every 60s (silent)
async function pollRate(){try{var r=await j('/api/rate');var e;if(e=document.getElementById('rsec'))e.textContent=r.perSec;if(e=document.getElementById('rmin'))e.textContent=r.perMin;if(e=document.getElementById('rhour'))e.textContent=r.perHour;}catch(err){}}
setInterval(pollRate,3000); pollRate();   // ⚡ fix-speed boxes refresh every 3s

// ── 🩸 THE DRIP — status poll + ON/OFF button ────────────────────────────────────────────
function dripAgo(t){var s=Math.round((Date.now()-t)/1000);return s<60?s+'s':Math.round(s/60)+'m';}
async function pollDrip(){
  try{
    var d=await j('/api/drip');
    var e,btn=document.getElementById('dripbtn'),live=(d.running&&d.on);
    if(btn){
      if(live){btn.textContent='⏹ STOP';btn.style.background='#B91C3F';btn.style.borderColor='#B91C3F';btn.style.color='#fff';}
      else{btn.textContent='▶ START';btn.style.background='#2ecc71';btn.style.borderColor='#2ecc71';btn.style.color='#06210f';}
    }
    // 🖼 show the drip's MODE on the hub card. Images-only is hardwired now, but it was invisible from here —
    // the owner had to open :7951 to see it, which is why it kept seeming like it had reverted.
    if(e=document.getElementById('dripmode')){
      // the drip's own status is nested under d.status — d.imagesOnly is always undefined
      e.innerHTML=((d.status&&d.status.imagesOnly)===false)
        ?'<span style="color:#ff9a9a;font-weight:800">⚠ TEXT MODE — will rewrite pages</span>'
        :'<span style="color:#8affb0;font-weight:800">🖼 IMAGES ONLY</span> <span style="color:#9c8188">· only pages at 12/13+ · text never touched</span>';
    }
    // 🟢 animated green RUNNING badge while the drip is live
    if(e=document.getElementById('dripbadge')){
      e.innerHTML=live
        ?'<span class=dripLive><span class=dripDot></span>RUNNING</span>'
        :'<span style="color:#888">○ stopped</span>';
    }
    var s=d.status||{};
    if(e=document.getElementById('dripdone'))e.textContent=(s.done==null?'—':s.done.toLocaleString());
    if(e=document.getElementById('dripleft'))e.textContent=(s.left==null?'—':s.left.toLocaleString());
    if(e=document.getElementById('driplap'))e.textContent=(s.lap?('lap '+s.lap+' · '+(s.fixed||0)+' fixed'):'—');
    // 🔢 SAY WHY THE TWO NUMBERS DIFFER (owner 2026-07-29: "gaming sys 73 and 59"). The pillar dropdown shows
    // EVERY page in the pillar; the drip's queue shows only what it may touch — 12/13+ and finished inside the
    // recency window. Those are different measures and the card never said so, which reads as a bug.
    if(e=document.getElementById('dripscope')){
      e.innerHTML=(s.total!=null)
        ? ('<b>'+s.total.toLocaleString()+'</b> eligible for images <span style="color:#9c8188">— pages at 12/13+ finished recently. The pillar dropdown shows the FULL page count for that pillar, so a smaller number here is expected.</span>')
        : '';
    }
    if(e=document.getElementById('drippct'))e.textContent=(s.total?(((s.done/s.total)*100).toFixed(1)+'% of '+s.total.toLocaleString()):'—');
    if(e=document.getElementById('dripcc'))e.textContent=(s.ccWins==null?'—':s.ccWins);
    if(e=document.getElementById('dripds'))e.textContent=(s.dsRescues==null?'—':s.dsRescues);
    if(e=document.getElementById('dripsx'))e.textContent=(s.surgicalWins==null?'—':s.surgicalWins);
    // 👁 real-time: what it is working on RIGHT NOW
    if(e=document.getElementById('dripnow')){
      e.innerHTML=s.current
        ?('<div style="color:#9a8a72;font-size:10px">WORKING ON NOW · '+dripAgo(s.since)+'</div>'
          +'<div style="font-weight:800;color:#EAC15C">'+s.current+'</div>'
          +'<div style="color:#ece7ea">'+(s.currentQ||'').slice(0,110)+'</div>'
          +'<div style="color:#8ab4ff">stage: <b>'+(s.stage||'')+'</b> · from '+(s.currentBefore==null?'?':s.currentBefore)+'/13</div>')
        :'<span style="color:#9a8a72">idle — waiting for the next page</span>';
    }
    if(e=document.getElementById('dripfeed')){
      e.innerHTML=(s.feed||[]).map(function(f){
        var c=f.skipped?'#9a8a72':(f.ok?'#8affb0':'#ff8fa8'),t=f.skipped?'✓':(f.ok?'✅':'📉');
        return '<div style="padding:2px 0;border-bottom:1px solid #201c26"><span style="color:'+c+'">'+t+'</span> <b>'+f.id+'</b> '+f.before+'→'+f.score+'/13 <span style="color:#8ab4ff">'+f.engine+'</span> <span style="color:#9a8a72">'+dripAgo(f.at)+'</span></div>';
      }).join('')||'<span style="color:#9a8a72">no pages finished yet</span>';
    }
    if(e=document.getElementById('dripmsg')){
      if(!d.running)e.innerHTML='<span style=color:#888>○ not running — press ▶ START</span>';
      else if(!d.on)e.innerHTML='<span style=color:#FFB81C>⏹ stopping after the current page</span>';
      else e.innerHTML='<span style=color:#8affb0>● running</span>'+(s.pillars&&s.pillars.length?(' · pillar <b>'+s.pillars.join(',')+'</b>'):' · whole library');
    }
  }catch(err){}
}
setInterval(pollDrip,4000); pollDrip();

async function resetPillar(all){
  var code=document.getElementById('dripcode').value.trim();
  var p=all?'all':document.getElementById('drippillar').value;
  var msg=document.getElementById('dripmsg');
  if(!all&&!p){msg.innerHTML='<span style=color:#FFB81C>pick a pillar first (or use Reset all)</span>';return;}
  msg.innerHTML='<span style=color:#FFB81C>resetting…</span>';
  try{
    var r=await j('/api/resetpillar',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({code:code,pillar:all?'all':p})});
    if(r.err){msg.innerHTML='<span style=color:#ff8fa8>'+r.err+'</span>';return;}
    msg.innerHTML='<span style=color:#8affb0>♻️ '+(all?'whole library':p)+' back in inventory — count is full again</span>';
    setTimeout(function(){location.reload();},1200);
  }catch(err){msg.innerHTML='<span style=color:#ff8fa8>'+err+'</span>';}
}

async function toggleDrip(){
  var code=document.getElementById('dripcode').value.trim();
  var pace=parseInt(document.getElementById('drippace').value||'45',10);
  var pillar=document.getElementById('drippillar').value;
  var msg=document.getElementById('dripmsg');
  msg.innerHTML='<span style=color:#FFB81C>…</span>';
  try{
    var r=await j('/api/drip',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({code:code,pace:pace,pillar:pillar})});
    if(r.err){msg.innerHTML='<span style=color:#ff8fa8>'+r.err+'</span>';return;}
    msg.innerHTML='<span style=color:#8affb0>'+(r.on
      ?('🩸 STARTED — '+(pillar?('pillar '+pillar):'whole library')+' at 1 page / '+pace+'s')
      :'⏹ STOPPING after the current page')+'</span>';
    pollDrip();
  }catch(err){msg.innerHTML='<span style=color:#ff8fa8>'+err+'</span>';}
}

// ── B. library health ────────────────────────────────────────────────────────────────────────────────────────
async function scanHealth(silent){
  if(!silent){document.getElementById('fdsub').textContent='scanning…'; document.getElementById('lvsub').textContent='scanning…';}
  try{
    var fd=await j('/api/fullydone'); var lv=await j('/api/lowvalue');
    var hu=document.getElementById('healthupd'); if(hu){var t=new Date();hu.textContent='updated '+t.toLocaleTimeString();}
    document.getElementById('fdnum').textContent=fd.done.toLocaleString();
    document.getElementById('fdsub').innerHTML='of '+fd.total.toLocaleString()+' · <span style=color:#FFB81C>'+fd.remaining.toLocaleString()+' to go</span>';
    document.getElementById('lvnum').textContent=lv.low.toLocaleString();
    document.getElementById('lvsub').innerHTML=(lv.total?Math.round(lv.low/lv.total*1000)/10:0)+'% of '+lv.total.toLocaleString();
    document.getElementById('lvtiers').innerHTML='🔴 bad (≤9): <b style=color:#ff6a6a>'+lv.tiers.bad.toLocaleString()+'</b> &nbsp; 🟠 weak (10-11): <b style=color:#FFB81C>'+lv.tiers.weak.toLocaleString()+'</b> &nbsp; 🟢 at gate (≥12): <b style=color:#8affb0>'+lv.tiers.good.toLocaleString()+'</b>';
    var ps=Object.keys(lv.byPillar).sort(function(a,b){return lv.byPillar[b].low-lv.byPillar[a].low;});
    var rows=ps.map(function(p){var o=lv.byPillar[p];var pct=o.total?Math.round(o.low/o.total*100):0;
      return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin:2px 0"><span style="width:150px;color:#cbb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(PILLARS[p]||p)+'</span><div class=bar style="flex:1"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#B91C3F,#FFB81C)"></div></div><span style="width:120px;text-align:right;color:#FFB81C">'+o.low.toLocaleString()+' / '+o.total.toLocaleString()+'</span></div>';
    }).join('');
    document.getElementById('lvpillars').innerHTML='<div class=mut style="font-size:11px;margin-bottom:3px">low-value by pillar (worst first):</div>'+rows;
  }catch(e){document.getElementById('fdsub').textContent='scan failed';document.getElementById('lvsub').textContent='scan failed';}
}
async function requeueFix(){
  if(code('fqcode')!=='4444'){alert('type 4444 in the box');return;}
  var pillar=document.getElementById('fqpillar').value; var count=parseInt(document.getElementById('fqcount').value,10)||100;
  document.getElementById('fqout').textContent='re-queuing…';
  try{var r=await j('/api/requeue',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444',pillar:pillar,count:count})});
    if(!r||!r.ok){document.getElementById('fqout').innerHTML='<span style=color:#ff6a6a>'+((r&&r.err)||'failed')+'</span>';return;}
    document.getElementById('fqout').innerHTML='<span style=color:#8affb0>✓ '+r.requeued.toLocaleString()+' '+(PILLARS[r.pillar]||r.pillar)+' Q&As back in the fix pile ('+r.queued.toLocaleString()+' queued) — crews rewrite them first.</span>';
  }catch(e){document.getElementById('fqout').textContent='failed';}
}

// ── C. dedup ─────────────────────────────────────────────────────────────────────────────────────────────────
var DDLAST=null;
async function dedupScan(){
  var pillar=document.getElementById('ddpillar').value; var thresh=document.getElementById('ddthresh').value;
  document.getElementById('ddout').textContent='scanning '+(pillar==='__all__'?'whole library':pillar)+'… (can take a bit)';
  document.getElementById('ddfam').innerHTML='';
  try{
    var r=await j('/api/dedupscan?pillar='+pillar+'&thresh='+thresh); DDLAST=r;
    if(r.err){document.getElementById('ddout').innerHTML='<span style=color:#ff6a6a>'+r.err+'</span>';return;}
    document.getElementById('ddout').innerHTML='scanned <b>'+r.scanned.toLocaleString()+'</b> · <b style=color:#b9a8ff>'+r.totalFamilies.toLocaleString()+'</b> dupe families · <b style=color:#FFB81C>'+r.removable.toLocaleString()+'</b> removable extras (match '+Math.round(r.thresh*100)+'%)';
    var h=r.families.slice(0,120).map(function(f,fi){
      var ex=f.remove.map(function(x){return '<a href="https://pulserevops.com/knowledge/'+x.id+'" target=_blank style="color:#ff9a9a;font-size:10px">'+x.id+'</a>';}).join(' ');
      var mem=(f.members||[f.keep].concat(f.remove.map(function(x){return x.id;}))).join(',');
      return '<div style="background:#120e22;border-radius:7px;padding:7px 9px;margin:4px 0;font-size:11px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div style="color:#8affb0">🧬 Family '+(fi+1)+' · '+(f.members?f.members.length:(f.remove.length+1))+' pages</div><button onclick="assimilate(\\''+f.pillar+'\\',\\''+mem+'\\',\\''+f.keep+'\\')" style="font-size:11px;padding:5px 9px;background:#7a5cff;border-color:#7a5cff">Assimilate → &lt;30%</button></div><div style="color:#8affb0;margin-top:3px">✓ keep '+f.keep+' <span class=mut>('+f.keepScore+'/13)</span> — '+(f.keepQ||'').slice(0,70)+'</div><div class=mut style="margin-top:2px">others: '+ex+'</div><div id="assim-'+f.keep+'" class=mut style="font-size:11px;margin-top:3px"></div></div>';
    }).join('');
    document.getElementById('ddfam').innerHTML=h+(r.totalFamilies>120?'<div class=mut style="font-size:11px">…+'+(r.totalFamilies-120)+' more families</div>':'');
  }catch(e){document.getElementById('ddout').textContent='scan failed';}
}
async function assimilate(pillar,mem,keep){
  if(code('ddcode')!=='4444'){alert('type 4444 in the box first');return;}
  var ids=mem.split(','); var el=document.getElementById('assim-'+keep);
  if(el)el.innerHTML='<span style=color:#b9a8ff>🧬 launching assimilator on '+ids.length+' pages… (rewrites until all &lt;30%)</span>';
  try{
    var r=await j('/api/assimilate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444',pillar:pillar,ids:ids})});
    if(!r.ok){if(el)el.innerHTML='<span style=color:#ff6a6a>'+(r.err||'failed')+'</span>';return;}
    if(!window.__assimPoll){window.__assimPoll=true;setInterval(pollAssim,4000);}
  }catch(e){if(el)el.textContent='failed';}
}
async function pollAssim(){
  try{var s=await j('/api/assimilate_status');
    Object.keys(s||{}).forEach(function(k){var f=s[k];if(!f||!f.ids)return;
      var keep=f.ids[0];var el=document.getElementById('assim-'+keep);
      if(!el){for(var i=0;i<f.ids.length;i++){el=document.getElementById('assim-'+f.ids[i]);if(el)break;}}
      if(!el)return;
      var c=f.state==='done'?'#8affb0':(f.state==='failed'?'#ff6a6a':(f.state==='stalled'?'#FFB81C':'#b9a8ff'));
      var ico=f.state==='done'?'✅':(f.state==='running'?'🧬':(f.state==='stalled'?'⚠️':'•'));
      el.innerHTML='<span style=color:'+c+'>'+ico+' '+f.state+' · round '+(f.round||0)+' · max sim '+(f.maxSim!=null?Math.round(f.maxSim*100)+'%':'—')+(f.pairsOver!=null?' · '+f.pairsOver+' pairs over':'')+(f.note?' · '+f.note:'')+'</span>';
    });
  }catch(e){}
}
async function dedupApply(mode){
  if(code('ddcode')!=='4444'){alert('type 4444 in the box');return;}
  var pillar=document.getElementById('ddpillar').value; var thresh=document.getElementById('ddthresh').value;
  if(mode==='remove'&&!confirm('DELETE the extra dupes from '+(pillar==='__all__'?'the WHOLE library':pillar)+'? Index is backed up + id list saved, but this removes pages. Continue?'))return;
  document.getElementById('ddapply').textContent=mode==='remove'?'removing…':'queuing rewrites…';
  try{
    var r=await j('/api/dedupapply',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444',pillar:pillar,thresh:thresh,mode:mode})});
    if(!r.ok){document.getElementById('ddapply').innerHTML='<span style=color:#ff6a6a>'+(r.err||'failed')+'</span>';return;}
    if(mode==='remove'){document.getElementById('ddapply').innerHTML='<span style=color:#8affb0>✓ removed '+r.removed.toLocaleString()+' extras · index '+r.indexBefore.toLocaleString()+'→'+r.indexAfter.toLocaleString()+' · '+r.survivors+' survivors queued for rewrite · backup saved</span>';}
    else{document.getElementById('ddapply').innerHTML='<span style=color:#8affb0>✓ '+r.dissolved.toLocaleString()+' pages queued to fix-pile — crews rewrite each distinct ('+r.families+' families)</span>';}
  }catch(e){document.getElementById('ddapply').textContent='failed';}
}

// ── D. new pipeline Q&A ──────────────────────────────────────────────────────────────────────────────────────
async function generate(){
  if(code('gencode')!=='4444'){alert('type 4444 in the box');return;}
  var pillar=document.getElementById('genpillar').value; var count=parseInt(document.getElementById('gencount').value,10)||10;
  var notes=document.getElementById('gennotes').value||'';
  document.getElementById('genout').textContent='launching generator…';
  try{
    var r=await j('/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:'4444',pillar:pillar,count:count,notes:notes})});
    if(!r.ok){document.getElementById('genout').innerHTML='<span style=color:#ff6a6a>'+(r.err||'failed')+'</span>';return;}
    var crewNote=(r.crew&&r.crew.id)?(' · 👷 dedicated crew '+r.crew.id+' pinned to this zone (the 11th)'):(r.crew&&r.crew.reused)?' · 👷 reusing the zone crew already here':(r.crew&&r.crew.err)?(' · ⚠️ zone crew: '+r.crew.err):'';
    document.getElementById('genout').innerHTML='<span style=color:#8affb0>✍️ generating '+r.count+' new '+((PILLARS[r.pillar]||r.pillar))+' Q&As (dup-checked) — seeded pending, written FIRST'+crewNote+'. Watch the log ↓</span>';
    setTimeout(pollGenLog,3000);
  }catch(e){document.getElementById('genout').textContent='failed';}
}
async function pollGenLog(){
  try{var r=await j('/api/genlog');if(r.lines&&r.lines.length){document.getElementById('genlog').innerHTML='📝 '+r.lines.map(function(l){return l.replace(/</g,'&lt;');}).join('<br>');}}catch(e){}
  setTimeout(pollGenLog,15000);
}
</script>`;

// 🗺️ MACHINE MAP — live "race" visualizer of per-stage progress for a pillar. Open http://localhost:7950/map
const MAP_PAGE = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Pulse Machine Map</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0b0a0c;color:#ece7ea;font-family:system-ui,Arial;padding:16px}
h1{font-size:20px;margin:0 0 3px;color:#FFB81C}.sub{color:#9c8188;font-size:12px;margin-bottom:12px}
select{background:#1b171b;color:#ece7ea;border:1px solid #FFB81C;border-radius:8px;padding:5px 8px;font-size:14px}
.track{position:relative;height:120px;background:#131317;border:1px solid #2a2a30;border-radius:12px;margin:14px 0 20px}
.grid{position:absolute;top:0;bottom:0;width:1px;background:#212129}.gl{position:absolute;bottom:2px;font-size:9px;color:#55555f}
.runner{position:absolute;transform:translateX(-50%);text-align:center;transition:left .8s ease;white-space:nowrap}
.dot{width:15px;height:15px;border-radius:50%;margin:0 auto 2px;box-shadow:0 0 9px currentColor;border:2px solid #0b0a0c}
.rlab{font-size:9px;font-weight:800;background:#000c;padding:0 3px;border-radius:3px}
.row{display:flex;align-items:center;gap:10px;margin:6px 0}.name{width:120px;font-size:13px;font-weight:700}
.bar{flex:1;height:15px;background:#1b171b;border-radius:8px;overflow:hidden;border:1px solid #2a2a30}.fill{height:100%;transition:width .8s ease}
.num{width:170px;font-size:12px;color:#9c8188;text-align:right}.pct{color:#8affb0;font-weight:800}</style>
<h1>🗺️ Machine Map</h1><div class=sub>Per-stage position for a pillar · <select id=pillar onchange=tick()></select> · auto-refresh 3s · leader furthest right</div>
<div class=track id=track></div><div id=rows></div>
<script>
var M=[{k:'booster',name:'✍️ Writer',c:'#4aa3ff'},{k:'media',name:'🎬 Face Cards',c:'#FFB81C'},{k:'hero',name:'🦸 Hero',c:'#b026ff'},{k:'body1',name:'🖼️ Body 1',c:'#39ff14'},{k:'body2',name:'🖼️ Body 2',c:'#00e5ff'},{k:'body3',name:'🖼️ Body 3',c:'#ffd166'},{k:'body4',name:'🖼️ Body 4',c:'#ff8c42'},{k:'body5',name:'🖼️ Body 5',c:'#ff6b6b'},{k:'body6',name:'🖼️ Body 6',c:'#f72585'}];
var PILLARS=${JSON.stringify(PILLARS)};var psel=document.getElementById('pillar');
psel.innerHTML=Object.keys(PILLARS).map(function(k){return '<option value="'+k+'"'+(k==='tl'?' selected':'')+'>'+PILLARS[k]+'</option>';}).join('');
async function tick(){try{var p=psel.value;var d=await (await fetch('/api/progressall?pillar='+p)).json();var t=d.types||{};
 var g='';for(var i=1;i<10;i++){g+='<div class=grid style="left:'+(i*10)+'%"></div>';}g+='<div class=gl style="left:1%">start</div><div class=gl style="right:1%">done</div>';
 var pcts=M.map(function(m){var pr=t[m.k]||{done:0,total:0};return pr.total?(pr.done/pr.total*100):0;});
 var maxPct=Math.max.apply(null,pcts);if(maxPct<=0)maxPct=1;
 var run='';M.forEach(function(m,mi){var pct=pcts[mi];var relX=Math.min(96,(pct/maxPct)*90);var top=6+mi*10;run+='<div class=runner style="left:'+relX.toFixed(1)+'%;top:'+top+'%;color:'+m.c+'"><div class=dot style="background:'+m.c+'"></div><div class=rlab style="color:'+m.c+'">'+m.name.replace(/^\\S+ /,'')+' '+pct.toFixed(1)+'%</div></div>';});
 document.getElementById('track').innerHTML=g+run;
 var rows='';M.forEach(function(m){var pr=t[m.k]||{done:0,total:0};var pct=pr.total?(pr.done/pr.total*100):0;rows+='<div class=row><div class=name style="color:'+m.c+'">'+m.name+'</div><div class=bar><div class=fill style="width:'+pct.toFixed(1)+'%;background:'+m.c+'"></div></div><div class=num><span class=pct>'+(pr.done||0).toLocaleString()+'</span> / '+(pr.total||0).toLocaleString()+' · '+pct.toFixed(1)+'%</div></div>';});
 document.getElementById('rows').innerHTML=rows;}catch(e){}}
tick();setInterval(tick,3000);
</script>`;

// ── HTTP ────────────────────────────────────────────────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  const u = req.url.split('?')[0];
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0' }); res.end(b); };
  const body = () => new Promise(r => { let b = ''; req.on('data', d => b += d); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); });
  const gate = b => String(b.code || '') === '4444';
  try {
    // pages
    if (u === '/') {
      // PAGE is built once at startup, so the pillar dropdowns were frozen with no counts.
      // Refresh at most every 5 minutes, then swap the live labels in per request.
      // 45s, not 5 minutes — the counts are meant to visibly tick down as pages finish.
      if (Date.now() - PILLAR_COUNTS.at > 45000) { try { await refreshPillarCounts(); } catch (e) {} }
      let html = PAGE;
      if (Object.keys(PILLAR_COUNTS.data).length) {
        for (const k of Object.keys(PILLARS)) {
          const lbl = pillarLabel(k);
          if (lbl !== PILLARS[k]) {
            html = html.split('>' + PILLARS[k] + '</option>').join('>' + lbl + '</option>');
          }
        }
      }
      return send(200, html, 'text/html; charset=utf-8');
    }
    if (u === '/map' || u === '/viz') return send(200, MAP_PAGE, 'text/html; charset=utf-8');

    // fleet + crew monitor (read-only)
    if (u === '/api/fleet') return send(200, JSON.stringify({ boxes: FLEET.map(b => ({ id: b.id, type: b.type, port: b.port, pillar: b.pillar, restarts: b.restarts || 0, alive: !!b.alive })) }));
    // 🖥️ CREW MONITOR — read each crew's status FILE (the worker's own HTTP is blocked mid-write, so we never
    // rely on it). The hub is always responsive → boxes + stage bars always render.
    if (u === '/api/crews') {
      const out = [];
      for (const b of FLEET) {
        if (b.type !== 'wholecrew') continue;
        let st = null; try { st = JSON.parse(fs.readFileSync(WD + '/new/imagebank/_crew_' + b.port + '.json', 'utf8')); } catch (e) {}
        out.push({ id: b.id, port: b.port, pillar: b.pillar, alive: !!b.alive, restarts: b.restarts || 0, status: st });
      }
      // ⏸ report the fleet-wide finish limit alongside the crews so the UI can show progress toward it
      const ps = pauseState();
      return send(200, JSON.stringify({ crews: out, pauseAfter: ps.limit ? { limit: ps.limit, done: fleetFinished(), tripped: !!ps.tripped } : null }));
    }

    // ── 🩸 THE DRIP (owner 2026-07-28) ────────────────────────────────────────────────────
    // One slow worker walking the WHOLE library to 12/13+, forever. GET = status for the card,
    // POST {code:4444, pace} = toggle. OFF is a flag file so the drip always finishes the page
    // it is on before stopping (never leaves a half-rewritten entry).
    if (u === '/api/drip') {
      const OFF = WD + '/new/imagebank/_drip_off.flag';
      const readStatus = async () => {
        try {
          const r = await fetch('http://127.0.0.1:' + DRIP_PORT + '/api/status', { signal: AbortSignal.timeout(2500) });
          if (r.ok) return await r.json();
        } catch (e) {}
        try { return JSON.parse(fs.readFileSync(WD + '/new/imagebank/_drip_state.json', 'utf8')); } catch (e) {}
        return {};
      };
      if (req.method !== 'POST') {
        const st = await readStatus();
        return send(200, JSON.stringify({ running: dripAlive(), on: !fs.existsSync(OFF), status: st }));
      }
      const b = await body();
      if (String(b.code || '').trim() !== '4444') return send(200, JSON.stringify({ err: 'code 4444 required' }));
      const wasOn = dripAlive() && !fs.existsSync(OFF);
      if (wasOn) {
        try { fs.writeFileSync(OFF, new Date().toISOString()); } catch (e) {}
        log('DRIP OFF (flag set — stops after the current page)');
        return send(200, JSON.stringify({ ok: true, on: false }));
      }
      try { fs.unlinkSync(OFF); } catch (e) {}
      const pillar = String(b.pillar || '').trim().toLowerCase();
      // A pillar change needs a fresh worker (the filter is read at boot) and a fresh cursor,
      // otherwise the new scope would resume at the old scope's position.
      if (dripAlive() && pillar !== String(DRIP_PILLAR || '')) { killByPort(DRIP_PORT); DRIP_CHILD = null; }
      if (pillar !== String(DRIP_PILLAR || '')) {
        DRIP_PILLAR = pillar;
        try { fs.unlinkSync(WD + '/new/imagebank/_drip_state.json'); } catch (e) {}
        try { fs.unlinkSync(WD + '/new/imagebank/_drip_queue.json'); } catch (e) {}
      }
      if (!dripAlive()) spawnDrip(Math.max(0, parseInt(b.pace, 10) || 0), pillar);
      log('DRIP START' + (pillar ? ' pillar=' + pillar : ' whole-library'));
      return send(200, JSON.stringify({ ok: true, on: true, pillar }));
    }

    // ── ♻️ RESET A PILLAR (or everything) BACK TO "TO BE RE-RUN" ──────────────────────────
    // Owner 2026-07-28: "add a reset by pillar to drip … so I can manually put them all or by
    // pillar back in status to be reran". Clears that pillar's done bookkeeping and stamps a
    // per-pillar marker, so the dropdown count returns to full and ticks down again from there.
    if (req.method === 'POST' && u === '/api/resetpillar') {
      const b = await body();
      if (String(b.code || '').trim() !== '4444') return send(200, JSON.stringify({ err: 'code 4444 required' }));
      const p = String(b.pillar || '').toLowerCase().replace(/[^a-z]/g, '');
      const IBD = WD + '/new/imagebank';
      try {
        if (!p || p === 'all') {
          const { execSync } = require('child_process');
          execSync('node new/_reset_inventory.js --apply', { cwd: WD, encoding: 'utf8', timeout: 120000 });
          RESET_TS = resetTs();
          PILLAR_COUNTS.at = 0;
          // clear every pillar's back-of-the-line demotions, and reset the drip, same as the per-pillar path
          try {
            for (const f of fs.readdirSync(IBD)) if (/^_finisher_[a-z]+_back\.json$/.test(f)) fs.writeFileSync(IBD + '/' + f, '{}');
          } catch (e) {}
          try { fs.unlinkSync(IBD + '/_drip_queue.json'); } catch (e) {}
          try {
            const sf = IBD + '/_drip_state.json';
            const st = JSON.parse(fs.readFileSync(sf, 'utf8'));
            st.cursor = 0; st.fixed = 0; st.alreadyOk = 0; st.missed = 0; st.errors = 0;
            fs.writeFileSync(sf, JSON.stringify(st, null, 1));
          } catch (e) {}
          log('RESET ALL pillars → back in inventory (+ back-lists cleared, drip queue/cursor reset)');
          return send(200, JSON.stringify({ ok: true, pillar: 'all', dripReset: true }));
        }
        if (!PILLARS[p]) return send(200, JSON.stringify({ err: 'unknown pillar ' + p }));
        // that pillar's crew done-list + claims + BACK-OF-THE-LINE demotions.
        // 🔧 2026-07-29 — the back-list was being missed. A page that once failed the gate is held at the back
        // of its pillar forever via _finisher_<p>_back.json; clearing only the done-list meant "reset" put the
        // pillar back but silently left those pages demoted, so the count said N to do while some of them
        // stayed at the end of the queue. A reset now genuinely means every page starts equal again.
        for (const f of ['_finisher_' + p + '_done.json', '_wholecrew_' + p + '_claims.json']) {
          try { if (fs.existsSync(IBD + '/' + f)) fs.writeFileSync(IBD + '/' + f, '[]'); } catch (e) {}
        }
        for (const f of ['_finisher_' + p + '_back.json']) {
          try { if (fs.existsSync(IBD + '/' + f)) fs.writeFileSync(IBD + '/' + f, '{}'); } catch (e) {}
        }
        // per-pillar marker: anything polished before now no longer counts as done for this pillar
        let marks = {};
        try { marks = JSON.parse(fs.readFileSync(IBD + '/_reset_marks.json', 'utf8')) || {}; } catch (e) {}
        marks[p] = Date.now();
        try { fs.writeFileSync(IBD + '/_reset_marks.json', JSON.stringify(marks)); } catch (e) {}
        PILLAR_COUNTS.at = 0;                       // force a recount on the next page load
        // 🩸 RESET THE DRIP TOO (owner 2026-07-29: "need to be the same when I hit reset pillar").
        // Reset only ever cleared the CREW's bookkeeping, so the drip carried on with the queue and cursor it
        // built before the reset — its counters stayed stale and disagreed with the hub. Deleting the queue
        // file and zeroing the cursor makes the drip rebuild from scratch on its next loop, so both machines
        // are counting the same pillar from the same starting point.
        try { fs.unlinkSync(IBD + '/_drip_queue.json'); } catch (e) {}
        try {
          const sf = IBD + '/_drip_state.json';
          const st = JSON.parse(fs.readFileSync(sf, 'utf8'));
          st.cursor = 0; st.fixed = 0; st.alreadyOk = 0; st.missed = 0; st.errors = 0;
          fs.writeFileSync(sf, JSON.stringify(st, null, 1));
        } catch (e) {}
        // 🔄 RESET MEANS THE WHOLE PILLAR (owner 2026-07-29: "when I hit reset pillar it should move them all
        // back"). Clearing the done-list only frees pages for the CREWS. The drip has a second gate — a 24h
        // recency window — so after a reset it still saw only the recently-finished subset (73 in the pillar,
        // 59 eligible). This marker tells the drip to ignore that window for this pillar, so reset genuinely
        // means every finished page in it goes back on the list. The drip clears the marker once it has
        // rebuilt, so it is a one-shot instruction rather than a permanent setting.
        try {
          let full = {};
          try { full = JSON.parse(fs.readFileSync(IBD + '/_drip_full_pillar.json', 'utf8')) || {}; } catch (e) {}
          full[p] = Date.now();
          fs.writeFileSync(IBD + '/_drip_full_pillar.json', JSON.stringify(full));
        } catch (e) {}
        log('RESET pillar ' + p + ' → back in inventory (crew done-list, back-list, claims + drip queue/cursor)');
        return send(200, JSON.stringify({ ok: true, pillar: p, dripReset: true }));
      } catch (e) { return send(200, JSON.stringify({ err: String((e && e.message) || e) })); }
    }

    // progress + health (read-only)
    if (u === '/api/progressall') { const qp = new URLSearchParams(req.url.split('?')[1] || ''); const pillar = qp.get('pillar') || 'tl'; const out = {}; for (const t of Object.keys(DONE_FILES)) { try { out[t] = await progressFor(t, pillar); } catch (e) { out[t] = { total: 0, done: 0, remaining: 0, pods: [] }; } } return send(200, JSON.stringify({ pillar, types: out })); }
    if (u === '/api/allpods') { const qp = new URLSearchParams(req.url.split('?')[1] || ''); const type = qp.get('type') || 'wholecrew'; try { return send(200, JSON.stringify(await allPods(type))); } catch (e) { return send(200, JSON.stringify({})); } }
    // ⚡ FIX SPEED (owner 2026-07-22): count crew ✅ DONE completions in the last 10s/60s/3600s → per-sec/min/hour rate.
    if (u === '/api/rate') { try { const f = WD + '/_page_finisher.out.log'; const st = fs.statSync(f); const len = Math.min(st.size, 3000000); const buf = Buffer.alloc(len); const fd = fs.openSync(f, 'r'); fs.readSync(fd, buf, 0, len, st.size - len); fs.closeSync(fd); const now = Date.now(); let s10 = 0, m60 = 0, h = 0; for (const l of buf.toString('utf8').split('\n')) { if (l.indexOf('✅ DONE') < 0) continue; const t = Date.parse(l.slice(0, 24)); if (isNaN(t)) continue; const age = now - t; if (age <= 3600000) { h++; if (age <= 60000) m60++; if (age <= 10000) s10++; } } return send(200, JSON.stringify({ perSec: Math.round(s10 / 10 * 100) / 100, perMin: m60, perHour: h })); } catch (e) { return send(200, JSON.stringify({ perSec: 0, perMin: 0, perHour: 0 })); } }
    // 🎯 TARGET PILLAR (owner 2026-07-22): resolve smallest/largest/worst/notfinished → the pillar to gang up on.
    if (u === '/api/targetpillar') { const qp = new URLSearchParams(req.url.split('?')[1] || ''); const mode = qp.get('mode') || 'smallest'; try {
        if (mode === 'notfinished') { let nf = []; try { nf = JSON.parse(fs.readFileSync(WD + '/_not_finished.json', 'utf8')); } catch (e) {} const cnt = {}; for (const x of nf) { const m = String((x && x.id) || '').match(/^([a-z]+)/); if (m) cnt[m[1]] = (cnt[m[1]] || 0) + 1; } const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; return send(200, JSON.stringify({ mode, pillar: top || null, left: top ? cnt[top] : 0, label: PILLARS[top] || top || '' })); }
        // 🆕 NEW Q&A: the pillar holding the most UNWRITTEN pipeline seeds. A seed is an index row the
        // generator left `pending:true`; publishContentBody clears the flag, so this count IS the backlog
        // of brand-new questions with no body yet.
        if (mode === 'newqa') {
          const idx = await progressIndex(); const cnt = {};
          for (const e of (idx.entries || [])) {
            if (!e || e.pending !== true) continue;
            const m = String(e.id || '').match(/^([a-z]+)\d/);
            if (!m || !PILLARS[m[1]]) continue;
            cnt[m[1]] = (cnt[m[1]] || 0) + 1;
          }
          const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
          const tot = Object.values(cnt).reduce((a, b) => a + b, 0);
          return send(200, JSON.stringify({ mode, pillar: top || null, left: top ? cnt[top] : 0, label: (top ? ((PILLARS[top] || top) + ' · 🆕 new Q&As') : ''), inventory: tot, byPillar: cnt }));
        }
        // 📉 UNDER 12 — counted from pillarStatus(), the SAME index pass that produces every pillar row's numbers
        // (owner 2026-07-28: "less than 12 pillar needs to talk to other pillars so the numbers line up"). The old
        // path read a stale `_under12_inventory.json` snapshot, which is why this label and the pillar labels
        // beneath it in the same dropdown never agreed. byPillar is returned so the UI can show the split.
        if (mode === 'under12') {
          const st = await pillarStatus();
          const cnt = {};
          for (const p of Object.keys(st)) if (st[p].under12) cnt[p] = st[p].under12;
          const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
          const tot = Object.values(cnt).reduce((a, b) => a + b, 0);
          return send(200, JSON.stringify({ mode, pillar: top || null, left: top ? cnt[top] : 0, label: (top ? ((PILLARS[top] || top) + ' · <12/13') : ''), inventory: tot, byPillar: cnt }));
        }
        const idx = await progressIndex(); const by = {};
        for (const e of (idx.entries || [])) { const id = String((e && e.id) || ''); const m = id.match(/^([a-z]+)/); if (!m) continue; const p = m[1]; if (p.length > 3 && !PILLARS[p]) continue; const q = (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 10 : e.quality_score)); if (!by[p]) by[p] = { total: 0, low: 0, bad: 0, sum: 0 }; by[p].total++; by[p].sum += q; if (q < 12) by[p].low++; if (q <= 9) by[p].bad++; }
        const ps = Object.keys(by).filter(p => by[p].low > 0); let pick;
        if (mode === 'largest') pick = ps.sort((a, b) => by[b].low - by[a].low)[0];
        else if (mode === 'worst') pick = ps.sort((a, b) => (by[b].bad / by[b].total) - (by[a].bad / by[a].total) || (by[a].sum / by[a].total) - (by[b].sum / by[b].total))[0];
        else pick = ps.sort((a, b) => by[a].low - by[b].low)[0];
        return send(200, JSON.stringify({ mode, pillar: pick || null, left: pick ? by[pick].low : 0, label: PILLARS[pick] || pick || '' }));
      } catch (e) { return send(200, JSON.stringify({ mode, pillar: null, left: 0 })); } }
    if (u === '/api/pillarstatus') { try { return send(200, JSON.stringify(await pillarStatus())); } catch (e) { return send(200, '{}'); } }
    if (u === '/api/fullydone') { try { return send(200, JSON.stringify(await fullyDone())); } catch (e) { return send(200, JSON.stringify({ total: 0, done: 0, remaining: 0, byPillar: {} })); } }
    if (u === '/api/lowvalue') { try { return send(200, JSON.stringify(await lowValueScan())); } catch (e) { return send(200, JSON.stringify({ total: 0, low: 0, tiers: { bad: 0, weak: 0, good: 0 }, byPillar: {} })); } }

    // dedup (scan read-only; apply/assimilate 4444-gated)
    if (u === '/api/dedupscan') { const qp = new URLSearchParams(req.url.split('?')[1] || ''); const pillar = qp.get('pillar') || '__all__'; const thresh = parseFloat(qp.get('thresh') || '0.7'); try { return send(200, JSON.stringify(await dedupScan(pillar, thresh))); } catch (e) { return send(200, JSON.stringify({ err: String(e.message || e), families: [], removable: 0, totalFamilies: 0 })); } }
    if (u === '/api/assimilate_status') { try { return send(200, fs.readFileSync(WD + '/new/imagebank/_assimilate_status.json', 'utf8')); } catch (e) { return send(200, '{}'); } }
    if (req.method === 'POST' && u === '/api/assimilate') {
      const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' }));
      const p = String(b.pillar || '').toLowerCase().replace(/[^a-z]/g, '');
      const ids = Array.isArray(b.ids) ? b.ids.filter(x => /^[a-z]+\d/.test(String(x))).slice(0, 12) : [];
      if (ids.length < 2) return send(200, JSON.stringify({ ok: false, err: 'need 2+ ids' }));
      try {
        const env = Object.assign({}, process.env, { ASSIM_FAMILY: JSON.stringify(ids), ASSIM_PILLAR: p, ASSIM_THRESH: '0.30' });
        const child = spawn(process.execPath, [WD + '/_assimilate.js'], { cwd: WD, env, detached: true, stdio: 'ignore' }); child.unref();
        log('ASSIMILATE spawn ' + p + ' [' + ids.join(',') + ']');
        return send(200, JSON.stringify({ ok: true, ids, spawned: true }));
      } catch (e) { return send(200, JSON.stringify({ ok: false, err: String(e.message || e) })); }
    }
    if (req.method === 'POST' && u === '/api/dedupapply') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' })); try { return send(200, JSON.stringify(await dedupApply(b.pillar, parseFloat(b.thresh || '0.7'), b.mode === 'remove' ? 'remove' : 'dissolve'))); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String(e.message || e) })); } }

    // new pipeline generator (4444-gated) + log (read-only)
    if (req.method === 'POST' && u === '/api/generate') {
      const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' }));
      const p = String(b.pillar || '').toLowerCase().replace(/[^a-z]/g, ''); if (!PILLARS[p]) return send(200, JSON.stringify({ ok: false, err: 'unknown pillar' }));
      const n = Math.max(1, Math.min(200, parseInt(b.count, 10) || 10)); const notes = String(b.notes || '').slice(0, 4000);
      try {
        const env = Object.assign({}, process.env, { GEN_PILLAR: p, GEN_COUNT: String(n), GEN_NOTES: notes });
        // Capture the generator's output (it was going to stdio:'ignore', which threw away the index-write
        // diagnostics and made a silent clobber invisible).
        const genLog = fs.openSync(WD + '/_pipeline_gen.detail.log', 'a');
        const child = spawn(process.execPath, [WD + '/_pipeline_gen.js'], { cwd: WD, env, stdio: ['ignore', genLog, genLog] });
        log('GENERATE spawn ' + p + ' ×' + n + (notes ? ' · notes:' + notes.slice(0, 60) : ''));
        // 👷 DEDICATED ZONE CREW (owner 2026-07-22): every Generate also brings in ONE whole-crew worker PINNED to this
        // pillar (roam OFF) so the fresh pipeline seeds get WRITTEN FIRST via the fix-pile priority — same live box +
        // animations as a fixing crew, one page at a time. Already have a pinned crew here → reuse it (seeds append to
        // its fix-queue). One extra crew per zone, capped by wholecrew.max.
        // ⏳ SEQUENCE, don't race (owner 2026-07-22): the zone crew is spawned ONLY after the generator EXITS.
        // Spawning it immediately put a second read-modify-write on _index.json at the exact moment the generator
        // was merging its new ids in — the crew won every retry and the seeds never landed in the index (blobs
        // existed but were invisible). Waiting costs a few seconds and makes the write deterministic.
        const pinned = FLEET.some(x => x.type === 'wholecrew' && x.pillar === p && x.opts && x.opts.zone);
        child.on('exit', code => {
          log('GENERATE ' + p + ' finished (exit ' + code + ') — now spawning the zone crew');
          if (pinned) return log('GENERATE zone-crew ' + p + ' → reusing existing');
          // Writer for fresh seeds = CC + DS (owner 2026-07-28). Was 'alternate' (DS↔Cursor), which
          // needed a CURSOR_API_KEY that has never been set — half of every generated batch went to a
          // writer that could not run.
          // 🆕 2026-07-28: was `under12`, which pointed the crew at the WHOLE <12 backlog for the pillar
          // (thousands of old pages) — the fresh seeds were just somewhere in that pile, and the ones it did
          // reach published as ~650-word stubs because 12/13 is achievable without the word-count point.
          // `newqa` pins it to pending seeds ONLY and holds each one to ≥12/13 AND the word floor.
          const lr = launch('wholecrew', [p], { engine: 'ccds', newqa: true, cheap: false, stagger: 0, cooldown: 0, roam: false, zone: true });
          log('GENERATE zone-crew ' + p + ' → engine ccds · 🆕 newqa (seeds only, full write) · ' + JSON.stringify((lr && lr.ok && lr.created && lr.created[0]) || (lr && lr.err)));
        });
        return send(200, JSON.stringify({ ok: true, pillar: p, count: n, spawned: true, crew: pinned ? { reused: true } : { queued: true } }));
      } catch (e) { return send(200, JSON.stringify({ ok: false, err: String(e.message || e) })); }
    }
    if (u === '/api/genlog') { try { const t = fs.readFileSync(WD + '/_pipeline_gen.out.log', 'utf8').split(/\r?\n/).filter(Boolean).slice(-8).reverse(); return send(200, JSON.stringify({ lines: t })); } catch (e) { return send(200, JSON.stringify({ lines: [] })); } }

    // fix-pile requeue (4444-gated)
    if (req.method === 'POST' && u === '/api/requeue') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' })); try { return send(200, JSON.stringify(requeueFixPile(b.pillar, b.count))); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String(e.message || e) })); } }

    // fleet control (all 4444-gated)
    if (req.method === 'POST' && u === '/api/launch') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' })); const pillars = Array.isArray(b.pillars) ? b.pillars.filter(p => PILLARS[String(p).split(':')[0]]) : []; if (!pillars.length) return send(200, JSON.stringify({ ok: false, err: 'no pillars' }));
      // ⏸ arm (or clear) the fleet-wide finish limit for THIS batch. Counting restarts with every send, so
      // "pause after 100" always means 100 from now — not 100 since the hub booted.
      const lim = Math.max(0, parseInt((b.opts && b.opts.pauseAfter) || 0, 10) || 0);
      savePauseState(lim ? { limit: lim, done: 0, tripped: false, armedAt: Date.now() } : {});
      if (lim) log('⏸ pause-after armed — fleet stops at ' + lim + ' finished URLs');
      return send(200, JSON.stringify(launch(b.type, pillars, b.opts || {}))); }
    if (req.method === 'POST' && u === '/api/stopbox') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false })); return send(200, JSON.stringify(stopBox(b.id))); }
    if (req.method === 'POST' && u === '/api/stopall') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false })); return send(200, JSON.stringify(stopAll())); }
    if (req.method === 'POST' && u === '/api/forceclear') { const b = await body(); if (!gate(b)) return send(200, JSON.stringify({ ok: false, err: 'type 4444' })); return send(200, JSON.stringify(forceClear())); }

    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: (e && e.message) || 'err' })); }
}).listen(PORT, () => {
  loadFleet();
  // 🔁 IDEMPOTENT RE-ADOPTION (owner 2026-07-23): a hub restart must NOT kill or duplicate in-progress crews. On
  // Windows the crew children are orphaned-but-alive when the hub dies (they keep writing, still holding their
  // ports). The old code blindly re-spawned every saved box → the new child hit EADDRINUSE on the port the orphan
  // still held → crashed → churn until healLoop's ping recovered it. Now: PING each saved crew first. If it answers,
  // ADOPT it (leave it running, no child handle — killByPort covers stopping it later). Only spawn the ones that
  // are genuinely dead. Result: restarting the hub is non-destructive; live work continues uninterrupted.
  if (FLEET.length) {
    log('re-adopting ' + FLEET.length + ' boxes from fleet file');
    (async () => {
      let adopted = 0, spawned = 0;
      for (const b of FLEET) {
        if (await ping(b.port)) { b.alive = true; b.fails = 0; b.child = null; adopted++; log('  ADOPTED live ' + b.id + ' :' + b.port + ' pillar=' + b.pillar + ' (kept running)'); }
        else { spawnBox(b); spawned++; }
      }
      saveFleet();
      log('re-adoption done — ' + adopted + ' kept alive, ' + spawned + ' respawned');
    })();
  }
  setInterval(healLoop, 15000);
  setInterval(pauseAfterTick, 4000);   // ⏸ fleet-wide finish limit — checked often so it stops close to the mark
  // ⏰ HOURLY NEW Q&A — one brand-new question an hour, 24 a day (owner 2026-07-28).
  setTimeout(hourlyGenTick, 90000);           // first run 90s after boot, not during startup churn
  setInterval(hourlyGenTick, HOURLY_GEN_MS);
  // 🛡 SEO GUARD — armed at boot and kept alive forever (owner 4444 lock).
  spawnSeoGuard();
  setInterval(() => { if (!seoGuardAlive()) spawnSeoGuard(); }, 30000);
  // 🔔 PILLAR-COMPLETE WATCHER (owner 2026-07-23): pillarStatus() is what detects a finished pillar and fires the
  // completion email — but it used to run ONLY when a browser had the hub open and polling. With no tab open, a
  // pillar could finish and sit silent forever (Skill Drills finished and the email only went out when the endpoint
  // was hit by hand). Run it server-side on a timer so the alert never depends on someone watching.
  const pillarWatch = () => pillarStatus().catch(e => log('pillar watch err ' + ((e && e.message) || e)));
  setTimeout(pillarWatch, 8000);          // once shortly after boot
  setInterval(pillarWatch, 120000);       // then every 2 minutes, browser or not
  console.log('[hub] → http://localhost:' + PORT + '  (spawns + self-heals the Whole-Crew fleet)');
});

