// _all_flux_facecards.js — SITE-WIDE Pollinator-ONLY face-card cover campaign (owner 2026-07-06).
// LAW: face-card COVERS = Pollinations flux ONLY. DDG face cards are BANNED and get OVERWRITTEN.
// For EVERY Q&A entry whose cover_src !== 'flux' (DDG / unstamped / bad), regenerate the face-card cover
// with Pollinations flux, apply the LOCKED "Fable" filter hues (storeGradedImage in _ddg_facecard_lib.js),
// bake the gold title, OVERWRITE /assets/qa/<id>.jpg, and stamp cover_src:'flux' on a fresh strong read.
// Order: LARGEST pillar first (owner). Flat 20s cooldown between images (owner 2026-07-06: ~40s render usually
// covers it, and parallelism is blocked by pollinator's 1-per-IP token → ~1/min, the owner's goal).
// Face cards only — NO in-body/section images touched. STRICT SERIAL: one process, one Pollinator call in flight.
//   Stop: create _all_flux_facecards_stop.flag.  FORCE_ALL=1 rebuilds even flux-stamped.  ONLY_PREFIX=tl one pillar.
//   Progress log lives OUTSIDE the publish root (scratchpad) so deploys don't 422.
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000'; // 20s pollinator cooldown (owner 2026-07-06)
const fs = require('fs');
const path = require('path');
const os = require('os');
const WD = process.env.PULSE_ROOT || __dirname;
const envFile = path.join(WD, '.env.local');
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const lib = require('./_ddg_facecard_lib');
const { fluxPromptUrl, runFluxJob } = require('./_pollinator_flux_throttle');
const { storeGradedImage, coverPath, buildFluxFaceQuery, stampCoverProvenance, gradeFaceCardFromBuffer } = lib;
const { sendFaceCardEmail } = require('./_facecard_resend_email');
const {
  poolPath,
  poolCount,
  appendPoolMeta,
  applyPoolSlot,
  loadPoolMeta,
} = require('./_facecard_pool_lib');
const { pickSmartPoolSlot, describeForMeta } = require('./_facecard_pool_match');
const { readSquareQueue, completeSquareBuild, failSquareBuild } = require('./_square_builder_queue');
const S = 760, DIR = WD + '/assets/qa';
const STOP = WD + '/_all_flux_facecards_stop.flag';
const PROG = process.env.PROG_LOG || path.join(os.tmpdir(), 'pulse-all-flux-progress.json');
// ── PERSISTENT RUN CONFIG (owner 2026-07-07): _all_flux_config.json survives watchdog relaunches (the
// watchdog spawns this script with NO env), so the mv→tl scope + 200-inventory-then-dupe plan sticks. ──
let CFG = {};
try { CFG = JSON.parse(fs.readFileSync(WD + '/_all_flux_config.json', 'utf8')) || {}; } catch (e) {}
const FORCE_ALL = process.env.FORCE_ALL === '1' || CFG.force === true || fs.existsSync(WD + '/_all_flux_force.flag'); // flag persists across watchdog relaunches
const RUN_PILLARS_F = WD + '/_all_flux_run_pillars.json'; // # of pillars fully processed THIS run (drives deploy-every-3 even under FORCE_ALL)
// Ordered pillar scope: config.prefixes (e.g. ["mv","tl"] = finish Movies, THEN pivot to CRO Pulse Tools)
// wins; else single ONLY_PREFIX env; else [] = whole site smallest-first.
const PREFIXES = Array.isArray(CFG.prefixes) && CFG.prefixes.length ? CFG.prefixes.map(String)
  : (process.env.ONLY_PREFIX ? [process.env.ONLY_PREFIX] : []);
const ONLY_PREFIX = PREFIXES.length === 1 ? PREFIXES[0] : ''; // POOL_BUILD_ONLY path stays single-prefix
const LIMIT = parseInt(process.env.LIMIT || '9999999', 10);
// Parallel sharding (owner 2026-07-07 "try 2 in parallel"): SHARD_COUNT instances split the todo list by
// index (i % SHARD_COUNT === SHARD_INDEX) so they NEVER touch the same entry. Only shard 0 stashes to the
// pool to avoid a _meta.json write race. Launch the shards staggered ~20s apart.
const SHARD_COUNT = Math.max(1, parseInt(process.env.SHARD_COUNT || '1', 10));
const SHARD_INDEX = Math.min(SHARD_COUNT - 1, Math.max(0, parseInt(process.env.SHARD_INDEX || '0', 10)));
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
const nowIso = () => new Date().toISOString();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const HDR = PTOK ? { Authorization: 'Bearer ' + PTOK } : {};

// ── THROTTLE-ADAPTIVE COOLDOWN (owner 2026-07-06): start at floor (20s). On ANY failed fetch, +5s and
// retry until image returns — climb until it works, then STAY at that sweet spot. Persisted in COOL_F. ──
const COOL_F = WD + '/_all_flux_cooldown.json';
const COOL_STEP = parseInt(process.env.COOL_STEP_MS || (CFG.coolStepMs != null ? String(CFG.coolStepMs) : '5000'), 10);
const COOL_MAX = parseInt(process.env.COOL_MAX_MS || (CFG.coolMaxMs != null ? String(CFG.coolMaxMs) : '300000'), 10);
const COOL_FLOOR = parseInt(CFG.cooldownMs != null ? String(CFG.cooldownMs) : (process.env.POLLINATOR_FREQ_MS || '20000'), 10); // config wins so owner's 10s floor holds (2026-07-07)
let cool = { ms: COOL_FLOOR, r429: 0, fails: 0 };
try {
  const j = JSON.parse(fs.readFileSync(COOL_F, 'utf8'));
  if (j && Number.isFinite(j.ms)) cool = Object.assign(cool, j);
  if (cool.ms < COOL_FLOOR) cool.ms = COOL_FLOOR;
} catch (e) {}
let lastDone = 0;
function saveCool() { try { fs.writeFileSync(COOL_F, JSON.stringify({ ms: cool.ms, r429: cool.r429, fails: cool.fails || 0, at: nowIso() })); } catch (e) {} }
function bumpCooldown(reason) {
  cool.fails = (cool.fails || 0) + 1;
  if (reason === '429') cool.r429++;
  const p = cool.ms;
  cool.ms = Math.min(COOL_MAX, cool.ms + COOL_STEP);
  console.log('    ⏫ ' + (reason || 'fail') + ' → cooldown ' + Math.round(p / 1000) + 's→' + Math.round(cool.ms / 1000) + 's (+5s until works)');
  saveCool();
}

// Retry until success: wait current cooldown, fetch; on fail +5s and loop (owner law). Wrapped in global flux queue.
async function fetchAdaptiveFluxInner(prompt, seed) {
  let attempt = 0;
  while (!fs.existsSync(STOP)) {
    const gap = Math.max(0, cool.ms - (Date.now() - lastDone));
    if (gap > 0) await sleep(gap);
    let reason = 'miss';
    try {
      const u = fluxPromptUrl(prompt, seed + attempt * 17, { pool: true });
      const r = await fetch(u, { headers: HDR, signal: AbortSignal.timeout(120000) });
      if (r.status === 429 || r.status === 503) reason = '429';
      else if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) {
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 3000) {
          lastDone = Date.now();
          saveCool();
          return b;
        }
        reason = 'small';
      }
    } catch (e) {
      reason = 'err';
    }
    lastDone = Date.now();
    attempt++;
    bumpCooldown(reason);
    if (attempt % 20 === 0) console.log('    … still retrying flux (attempt ' + attempt + ', cd ' + Math.round(cool.ms / 1000) + 's)');
  }
  return null;
}

async function fetchAdaptiveFlux(prompt, seed) {
  return runFluxJob(() => fetchAdaptiveFluxInner(prompt, seed), 'face-card', { throttleReason: 'pollinator' });
}

const LOCK_F = WD + '/_all_flux_facecards.lock';
function takeSingletonLock() {
  try {
    if (fs.existsSync(LOCK_F)) {
      const o = JSON.parse(fs.readFileSync(LOCK_F, 'utf8'));
      try { process.kill(o.pid, 0); console.log('[all-flux] SINGLETON — already running pid ' + o.pid + ' · exit'); process.exit(0); }
      catch (e) { fs.unlinkSync(LOCK_F); }
    }
  } catch (e) { try { fs.unlinkSync(LOCK_F); } catch (z) {} }
  fs.writeFileSync(LOCK_F, JSON.stringify({ pid: process.pid, at: nowIso() }));
  const release = () => { try { fs.unlinkSync(LOCK_F); } catch (e) {} };
  process.on('exit', release);
  process.on('SIGINT', () => { release(); process.exit(0); });
  process.on('SIGTERM', () => { release(); process.exit(0); });
}
takeSingletonLock();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔒 DISTINCT NOTE — PER-PILLAR SUBJECT RESET (owner 2026-07-06):
// Every image MUST be applicable to BOTH (a) the pillar it's in AND (b) the exact question in that Q&A.
// The old builder mixed a rotating generic "pool query" that bled subjects across pillars (e.g. gaming
// images landed in Health & Fitness). FIX: anchor each flux prompt to the pillar's own visual THEME +
// that entry's cleaned question title — nothing else. When the generator crosses into a NEW pillar it
// PAUSES 30s, reads all the new pillar's titles, and only then resumes — so the subject changes
// COMPLETELY at every pillar boundary. Do not reintroduce cross-pillar generic pooling here.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// Themes derived from ACTUAL pillar CONTENT (owner 2026-07-06 — verified by sampling real titles; labels lie).
const PILLAR_THEME = {
  fs: 'recreational fishing and angling on the water', mv: 'cinema, films and movie scenes',
  hf: 'high school and college athletes and NIL sports deals', gm: 'video games and gaming',
  ga: 'group getaway rentals and family game nights', sw: 'business software and office computing',
  ev: 'party venues and celebration events', sk: 'business sales skills training workshops',
  wl: 'wellness, fitness apps and self-care', lv: 'charming small towns and beautiful places to retire',
  tn: 'charming towns and cities to live in', co: 'vintage collectibles and memorabilia',
  cl: 'cologne, fragrance and perfume bottles', nl: 'beach clubs and nightlife',
  rs: 'luxury all-inclusive resorts and vacation destinations', tc: 'mobile phones, cell plans and telecom',
  sp: 'public speaking and giving speeches', tv: 'luxury all-inclusive resorts and travel destinations',
  bo: 'commercial real estate construction and buildouts', cr: 'crabbing and crab fishing',
  bs: 'business books and reading', es: 'luxury residential real estate and equestrian communities',
  dn: 'restaurants and fine dining', bt: 'boats and boating on the water',
  gp: 'business go-to-market sales strategy meetings', ai: 'AI software tools and technology',
  sc: 'schools, colleges and university campuses', tk: 'business software technology at work',
  gb: 'graphic design studio and creative visual art', ra: 'business revenue operations strategy',
  pt: 'pets, aquarium fish and animals', ik: 'business professionals reviewing results in an office',
  er: 'consumer electronics and gadgets', cg: 'business sales coaching and mentoring',
  st: 'sales training workshops', aq: 'aquariums, reef tanks and fish',
  ed: 'everyday life advice and self-improvement', fr: 'franchise businesses and storefronts',
  ca: 'cars, SUVs and trucks', sy: 'fashion, outfits and what to wear',
  q: 'business revenue operations professionals at work', tl: 'business executives and revenue teams',
};
function pillarOf(id) { const m = String(id).match(/^([a-z]+)\d+$/); return m ? m[1] : ''; }
function cleanTitle(question) {
  return String(question || '').replace(/[#*_`>|]/g, ' ').replace(/\bin 20\d\d\b/gi, ' ').replace(/[?]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
}
// Prompt = pillar THEME + this entry's own question. Grounded in the pillar; specific to the question.
function anchoredPrompt(id, question) {
  const theme = PILLAR_THEME[pillarOf(id)] || 'business revenue operations';
  return theme + ' — ' + cleanTitle(question);
}
// ── DUPLICATE-AFTER-INVENTORY (owner 2026-07-06): build POOL_INVENTORY unique flux originals per pillar,
// then reuse pool photos when topical match makes sense (SMART_DUP=1) else generate a new one-off flux cover.
// Pool photos live OUTSIDE deploy root (_facecard_pool, netlifyignored).
const ORIG_PER_PILLAR = parseInt(process.env.ORIG_PER_PILLAR || '299', 10);
const POOL_INVENTORY = parseInt(process.env.POOL_INVENTORY || (CFG.poolInventory != null ? String(CFG.poolInventory) : '0'), 10); // 200 flux originals/pillar, then duplicate the remainder
const SMART_DUP = process.env.SMART_DUP === '1' || CFG.smartDup === true;
const POOL_BUILD_ONLY = process.env.POOL_BUILD_ONLY === '1'; // build pool inventory even if cover_src already flux
const QUEUE_MODE = process.env.SQUARE_BUILDER_QUEUE_MODE === '1' || CFG.queueMode === true;
// Persisted so watchdog relaunches keep the owner's selected cover shape. "square" is the legacy 760x760
// footprint with the corrected title layout; unset/"tile" retains the 1200x400 mosaic crop.
const FACE_CARD_VARIANT = String(process.env.FACE_CARD_VARIANT || CFG.faceCardVariant || 'tile').toLowerCase() === 'square' ? 'square' : 'tile';
const POOL_DIR = WD + '/_facecard_pool';

async function makeDuplicateCover(id, question, p, nPool, slotIndex) {
  const idx = slotIndex != null ? slotIndex : (() => {
    let h = 0;
    for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h % nPool;
  })();
  return applyPoolSlot(id, question, p, idx);
}

async function makeFluxOriginal(id, question, addToPool) {
  const p = pillarOf(id);
  let seed = 0;
  for (const ch of String(id)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const prompt = anchoredPrompt(id, question);
  const img = await fetchAdaptiveFlux(prompt, seed);
  if (!img) return 0;
  await gradeFaceCardFromBuffer(img, coverPath(id), { question, variant: FACE_CARD_VARIANT });
  if (addToPool) {
    const nPool = poolCount(p);
    const cap = POOL_INVENTORY > 0 ? POOL_INVENTORY : ORIG_PER_PILLAR;
    if (nPool < cap) {
      try {
        fs.mkdirSync(POOL_DIR + '/' + p, { recursive: true });
        const seq = appendPoolMeta(p, Object.assign({ seq: nPool }, describeForMeta(question)));
        await storeGradedImage(img, poolPath(p, seq), { square: S, bright: false, faceCard: true, cropPosition: 'attention' });
      } catch (e) {}
    }
  }
  try {
    return fs.statSync(coverPath(id)).size;
  } catch (e) {
    return 0;
  }
}

// Pollinator flux face card, OVERWRITE always.
async function makeFluxOverwrite(id, question) {
  const p = pillarOf(id);
  const nPool = poolCount(p);
  const invCap = POOL_INVENTORY > 0 ? POOL_INVENTORY : ORIG_PER_PILLAR;
  const meta = SMART_DUP || POOL_INVENTORY > 0 ? loadPoolMeta(p) : [];

  // Phase 1 — build inventory up to POOL_INVENTORY (always new flux; only shard 0 stashes to pool — no meta race)
  if (POOL_INVENTORY > 0 && nPool < POOL_INVENTORY) {
    return makeFluxOriginal(id, question, SHARD_INDEX === 0);
  }

  // Phase 2 — inventory full: DUPLICATE with VARIETY (owner 2026-07-07 "mix it up, move it around").
  // Spread duplicates ACROSS THE WHOLE POOL by an id-hash so near-identical questions get DIFFERENT images
  // (sequential ids rotate through consecutive slots → no two neighbors repeat, each image reused evenly and
  // far apart) instead of all collapsing to the single top topical match. Pool is single-theme so any slot fits.
  if (SMART_DUP && nPool >= POOL_INVENTORY && POOL_INVENTORY > 0) {
    let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const slot = h % nPool;
    const sz = await makeDuplicateCover(id, question, p, nPool, slot);
    if (sz) { console.log('    ↪ pool dup slot ' + slot + '/' + nPool + ' (spread for variety)'); return sz; }
    return makeFluxOriginal(id, question, false);
  }

  // Legacy: hash duplicate after ORIG_PER_PILLAR
  if (nPool >= ORIG_PER_PILLAR) return makeDuplicateCover(id, question, p, nPool);
  return makeFluxOriginal(id, question, true);
}

(async () => {
  let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); // reassigned on merge-flush (adopt orchestrator fixes)
  let ents = (idx.entries || []).filter(e => e && e.id && /^[a-z]+\d+$/.test(e.id) && e.question);
  if (PREFIXES.length) ents = ents.filter(e => PREFIXES.some(px => e.id.startsWith(px)));
  // group by pillar; honor config.prefixes ORDER when set (mv → tl), else SMALLEST pillar first, then by id within pillar
  const groups = {};
  for (const e of ents) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; (groups[p] = groups[p] || []).push(e); }
  const pillars = Object.entries(groups).sort((a, b) => {
    if (PREFIXES.length) {
      const ia = PREFIXES.indexOf(a[0]), ib = PREFIXES.indexOf(b[0]);
      if (ia !== ib) return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib);
    }
    return a[1].length - b[1].length; // tie / no scope → smallest pillar first
  });
  const ordered = [];
  for (const [p, arr] of pillars) { arr.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })); ordered.push(...arr); }
  let todo;
  if (QUEUE_MODE) {
    const queued = readSquareQueue().pending;
    if (CFG.manualReview === true) {
      console.log('[all-flux] WAITING · ' + queued.length + ' Q&As reserved for manual review at /square-builder');
      return;
    }
    const byId = new Map((idx.entries || []).filter(Boolean).map(e => [String(e.id), e]));
    todo = queued.map(item => Object.assign({}, byId.get(String(item.id)) || {}, item, {
      id: String(item.id),
      question: item.question || (byId.get(String(item.id)) && byId.get(String(item.id)).question) || String(item.id),
    })).slice(0, LIMIT);
    if (!todo.length) {
      console.log('[all-flux] WAITING · fixer-to-square queue is empty');
      return;
    }
    console.log('[all-flux] FIXER → SQUARE · ' + todo.length + ' Q&As waiting');
  } else if (POOL_BUILD_ONLY && POOL_INVENTORY > 0 && ONLY_PREFIX) {
    const have = poolCount(ONLY_PREFIX);
    const need = Math.max(0, POOL_INVENTORY - have);
    const scoped = ordered.filter((e) => e.id.startsWith(ONLY_PREFIX));
    todo = scoped.slice(0, need);
    console.log('[all-flux] POOL_BUILD_ONLY · ' + ONLY_PREFIX + ' · inventory ' + have + '/' + POOL_INVENTORY + ' · batch ' + todo.length);
  } else {
    todo = ordered.filter((e) => FORCE_ALL || e.cover_src !== 'flux');
    if (SHARD_COUNT > 1) { todo = todo.filter((e, i) => i % SHARD_COUNT === SHARD_INDEX); console.log('[all-flux] SHARD ' + SHARD_INDEX + '/' + SHARD_COUNT + ' → ' + todo.length + ' entries this shard'); }
    todo = todo.slice(0, LIMIT);
  }
  const totalFlux = ents.length - todo.length;
  console.log('[all-flux] ' + nowIso() + ' · ' + ents.length + ' Q&As · ' + todo.length + ' to (re)build flux · ' + totalFlux + ' already flux');
  console.log('[all-flux] pillar order (smallest first): ' + pillars.map(([p, a]) => p + ':' + a.length).join(' '));
  // titles per pillar (for the 30s boundary look-at-the-titles pause)
  const pillarTitles = {};
  for (const e of todo) { const p = pillarOf(e.id); (pillarTitles[p] = pillarTitles[p] || []).push(e.question); }
  const PILLAR_PAUSE_MS = parseInt(process.env.PILLAR_PAUSE_MS || '0', 10);
  let done = 0, fail = 0, curPillar = null; const startedAt = Date.now();
  // BATCHED index stamp (owner 2026-07-07 cleanup speed): the per-entry strong read + full write of the 35k-entry
  // _index.json was ~3s/entry. Single writer now → mutate the in-memory index and flush every STAMP_BATCH entries.
  const STAMP_BATCH = parseInt(process.env.STAMP_BATCH || '25', 10);
  let stampIds = [];
  // Re-read + MERGE on flush so a concurrent index writer (the golden-fix orchestrator) is never clobbered:
  // fetch the fresh index, apply only our cover stamps, write back, and adopt the merged copy. (owner 2026-07-07)
  const flushIndex = async () => {
    if (!stampIds.length) return;
    try {
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      for (const id of stampIds) { const e = (fresh.entries || []).find(x => x && x.id === id); if (e) { e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'flux'; e.face_title_baked = true; } }
      await store.setJSON('_index.json', fresh);
      idx = fresh; stampIds = [];
    } catch (z) { console.log('    idx flush err ' + (z && z.message)); }
  };
  for (let i = 0; i < todo.length; i++) {
    if (fs.existsSync(STOP)) { await flushIndex(); console.log('[all-flux] STOP flag — halting at ' + i + '/' + todo.length); break; }
    const e = todo[i];
    const p = pillarOf(e.id);
    if (p !== curPillar) {
      // 🔒 PILLAR BOUNDARY (owner 2026-07-06): stop 30s, read the NEW pillar's titles, then generate for it.
      if (curPillar !== null) { // the pillar we were on just finished THIS run → bump the run counter (drives deploys)
        try { const c = (JSON.parse((fs.existsSync(RUN_PILLARS_F) && fs.readFileSync(RUN_PILLARS_F, 'utf8')) || '{}').count || 0) + 1; fs.writeFileSync(RUN_PILLARS_F, JSON.stringify({ count: c, last: curPillar, at: nowIso() })); console.log('[all-flux] ✔ pillar "' + curPillar + '" finished this run (#' + c + ')'); } catch (z) {}
      }
      curPillar = p;
      const titles = pillarTitles[p] || [];
      console.log('\n[all-flux] ══ NEW PILLAR "' + p + '" · theme: ' + (PILLAR_THEME[p] || '?') + ' · ' + titles.length + ' titles ══');
      console.log('[all-flux]   sample titles: ' + titles.slice(0, 6).map(t => '“' + String(t).slice(0, 48) + '”').join(' | '));
      console.log('[all-flux]   pausing ' + Math.round(PILLAR_PAUSE_MS / 1000) + 's to reset subject to this pillar…');
      const end = Date.now() + PILLAR_PAUSE_MS;
      while (Date.now() < end) { if (fs.existsSync(STOP)) break; await sleep(Math.min(1000, end - Date.now())); }
    }
    let sz = 0;
    try { sz = await makeFluxOverwrite(e.id, e.question); } catch (x) { if (x && x.code === 'SCRUB_STOP') { console.log('[all-flux] SCRUB_STOP'); break; } console.log('  ✗ ' + e.id + ' err ' + (x && x.message)); }
    if (!sz) {
      fail++;
      if (QUEUE_MODE) failSquareBuild(e.id, 'flux build failed');
      console.log('  ✗ ' + e.id + ' flux FAILED — left as-is, retry next run');
      continue;
    }
    try {
      // mutate in-memory index (no per-entry strong read); write the small answer blob per-entry; flush index every STAMP_BATCH
      { // record id for the merged index flush; write the small answer blob per-entry (fresh read → no clobber)
        stampIds.push(e.id);
        try { const cur = await store.get('answers/' + e.id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + e.id + '.json', Object.assign({}, cur, { cover_src: 'flux', face_title_baked: true })); } catch (z) {}
        if (stampIds.length >= STAMP_BATCH) await flushIndex();
        if (QUEUE_MODE) {
          await flushIndex();
          completeSquareBuild(e.id);
        }
      }
      done++;
      const rate = done / Math.max(1, (Date.now() - startedAt) / 3600000);
      console.log('  ✓ ' + done + '/' + todo.length + ' ' + e.id + ' [flux] ' + Math.round(sz / 1024) + 'KB  (' + Math.round(rate) + '/hr · cd ' + Math.round(cool.ms / 1000) + 's · 429s ' + cool.r429 + ')  <-  ' + String(e.question).slice(0, 55));
      if (CFG.emailPerImage !== false) { // owner 2026-07-07: per-image email OFF in dup cleanup (flood). Set emailPerImage:true to re-enable.
        try {
          await sendFaceCardEmail({ id: e.id, question: e.question, kb: Math.round(sz / 1024), source: '_all_flux_facecards.js' });
          console.log('    📧 emailed ' + e.id);
        } catch (em) {
          console.log('    📧 email fail ' + e.id + ' · ' + (em && em.message));
        }
      }
    } catch (x) {
      fail++;
      if (QUEUE_MODE) failSquareBuild(e.id, x && x.message);
      console.log('  ✗ ' + e.id + ' stamp-fail ' + (x && x.message));
      continue;
    }
    if (done % 5 === 0) { try { fs.writeFileSync(PROG, JSON.stringify({ at: nowIso(), done, fail, total: todo.length, remaining: todo.length - i - 1, lastId: e.id, alreadyFlux: totalFlux }, null, 2)); } catch (z) {} }
  }
  await flushIndex(); // write any remaining stamps
  try { fs.writeFileSync(PROG, JSON.stringify({ at: nowIso(), done, fail, total: todo.length, finished: true }, null, 2)); } catch (z) {}
  console.log('[all-flux] DONE · rebuilt ' + done + ' · failed ' + fail + ' (rerun to catch failures + newly-added entries)');
})().catch(e => { console.log('[all-flux] FATAL', e && e.message); process.exit(1); });
