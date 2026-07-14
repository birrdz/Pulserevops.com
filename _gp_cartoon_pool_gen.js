// _gp_cartoon_pool_gen.js — CARTOON / DIGITAL-ART face-card pool for GTM (gp), owner spec 2026-07-09.
// TWO concurrent lanes, each STRICTLY one-at-a-time (no doubling a provider, no 3-way):
//   • DDG lane  — starts at t=0
//   • Pollinator (flux) lane — starts at t=20s (20s launch stagger)
// Both pull from ONE shared slot counter, so providers naturally alternate. Self-learning pace per lane.
// Subjects: people at work, businesses, office buildings, firemen at work — cartoon/digital-art style.
// Every image gets the LOCKED warm cine-grade pushed VERY BRIGHT + VERY SHARP.
// Saves graded assets/qa/_gp_pool/NNN.jpg (gallery) + RAW assets/qa/_gp_pool/raw/NNN.jpg (cook-loop source).
// Does NOT touch live /assets/qa/<id>.jpg. Approval-gated via _gp_gallery_server.js (:8905).
const fs = require('fs');
const { grade } = require('./_gp_grade.js');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) { console.log('img-search-lib load fail', e.message); }
const POOL = WD + '/assets/qa/_gp_pool';
const RAW = POOL + '/raw';
try { fs.mkdirSync(RAW, { recursive: true }); } catch (e) {}
// THEME QUEUE (owner 2026-07-09): walk slots in order; each slot's theme = first band whose `upto` it's under.
const { THEMES } = require('./_gp_themes.js');
let _acc = 0; for (const t of THEMES) { t._start = _acc; _acc = t.upto; }
const LAST_UPTO = THEMES.length ? THEMES[THEMES.length - 1].upto : 1000;
function themeForSlot(slot) { for (const t of THEMES) if (slot <= t.upto) return t; return THEMES[THEMES.length - 1]; }
const NEG = ', absolutely no text, no words, no letters, no signage, no captions, no writing, no watermark, no logo';
function sceneModFor(slot) {
  const t = themeForSlot(slot);
  const j = Math.max(0, slot - t._start - 1);
  const scene = t.scenes[j % t.scenes.length];
  const mod = t.mods[Math.floor(j / t.scenes.length) % t.mods.length];
  return { theme: t.name, scene, mod, prompt: t.prompt + scene + ', ' + mod + (t.tail || '') + NEG };
}
const TOTAL = parseInt(process.env.GP_POOL_N || String(LAST_UPTO), 10);
const LAUNCH_STAGGER_MS = parseInt(process.env.GP_LAUNCH_STAGGER || '0', 10);
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const PEXELS = process.env.PEXELS_API_KEY || '';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// CLEAN stock lane (no watermark, unlike DDG). Returns a raw buffer or null.
async function pexelsPhoto(scene, slot) {
  if (!PEXELS) return null;
  try {
    const q = encodeURIComponent(scene.replace(/[^a-z ]/gi, ' ').trim().split(/\s+/).slice(0, 6).join(' '));
    const page = 1 + (Math.floor(slot / 15) % 30);             // paginate by slot so repeated scenes pull FRESH photos (anti-dup)
    const r = await fetch('https://api.pexels.com/v1/search?query=' + q + '&per_page=15&page=' + page + '&orientation=square', { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return null;
    const photos = ((await r.json()).photos || []);
    if (!photos.length) return null;
    const pick = photos[slot % photos.length];                 // deterministic per-slot variety
    const url = pick && pick.src && (pick.src.large2x || pick.src.large || pick.src.original);
    return await fetchBuf(url, 30000);
  } catch (e) { return null; }
}

// Hugging Face Inference — FLUX.1-schnell AI generation (clean). Returns raw buffer or null.
async function hfImage(prompt, seed) {
  const HF = process.env.HUGGINGFACE_API_KEY; if (!HF) return null;
  const endpoints = [
    'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
  ];
  for (const ep of endpoints) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { Authorization: 'Bearer ' + HF, 'Content-Type': 'application/json' }, body: JSON.stringify({ inputs: prompt, parameters: { width: 768, height: 768, seed: seed || 0 } }), signal: AbortSignal.timeout(90000) });
      const ct = r.headers.get('content-type') || '';
      if (ct.startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 3000) return b; }
    } catch (e) {}
  }
  return null;
}

// Cloudflare Workers AI — flux-1-schnell AI generation (clean). Needs CLOUDFLARE_ACCOUNT_ID. Returns raw buffer or null.
async function cfImage(prompt, seed) {
  const CF = process.env.CLOUDFLARE_API_KEY, ACCT = process.env.CLOUDFLARE_ACCOUNT_ID; if (!CF || !ACCT) return null;
  try {
    const r = await fetch('https://api.cloudflare.com/client/v4/accounts/' + ACCT + '/ai/run/@cf/black-forest-labs/flux-1-schnell', { method: 'POST', headers: { Authorization: 'Bearer ' + CF, 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt, steps: 6, seed: seed || 0 }), signal: AbortSignal.timeout(60000) });
    const j = await r.json();
    if (j && j.result && j.result.image) { const b = Buffer.from(j.result.image, 'base64'); if (b.length > 3000) return b; }
  } catch (e) {}
  return null;
}

// SUBJECTS — STAR WARS-TYPE SPACE OPERA (owner 2026-07-09). Distinct space-opera subjects so a big batch has
// real variety (scene × lighting = 1000+ combos; seed + hash-dedup = no repeats). Generic descriptions (no trademarks).
const SCENES = [
  'wing-shaped rebel starfighters dogfighting near a moon-sized battle station', 'a hooded space knight igniting a glowing laser sword', 'twin suns setting over a vast desert planet', 'a domed astromech droid rolling across sand dunes', 'a golden humanoid protocol droid in a starship corridor', 'a crowded galactic cantina full of strange aliens', 'a squad of white-armored troopers marching through a hangar', 'a colossal wedge-shaped star destroyer looming over a planet', 'four-legged armored walkers advancing across a snowfield', 'a battered freighter jumping to lightspeed in a streak of stars',
  'a robed old master teaching in a swamp-planet hut', 'a masked dark warlord in flowing black cape and armor', 'a bounty hunter in dented armor with a jetpack', 'a laser-sword duel on a platform above a reactor shaft', 'a fleet of capital ships massing in orbit', 'a moisture farm under a blazing desert sky', 'a carbon-freezing chamber wreathed in steam', 'a forest moon village of tree huts among giant redwoods', 'a podracer speeding through a rocky desert canyon', 'a massive space battle with laser fire and exploding cruisers',
  'a lone starfighter skimming a battle station trench', 'a cloaked figure overlooking a desert canyon at dusk', 'a hangar bay full of parked starfighters and droids', 'a throne room with tall red-armored guards', 'a desert sail barge over dunes at golden hour', 'an ice planet outpost with domed shelters in a blizzard', 'a jungle temple ruin with a landed shuttle', 'a swampy bog with a small green sage and a starfighter half-sunk', 'a smuggler and a furry copilot in a cockpit', 'a rebel briefing room with a glowing tactical hologram',
  'a cliffside monastery on an ocean world at sunset', 'a spice-mining rig on a red desert planet', 'a dark throne overlooking a fleet through a viewport', 'twin-ion starfighters screaming past a cruiser', 'a desert scavenger leading a pack animal across dunes', 'a lightning-wielding emperor on a battle-station bridge', 'a rebel pilot climbing into an X-shaped fighter', 'a droid factory line assembling battle droids', 'a cantina band of alien musicians playing', 'a moon-sized station firing a superlaser beam',
  'a snow-swept base with parked snow-speeders', 'a cloud city gantry among orange sunset clouds', 'a jedi temple hall lined with tall columns', 'a desert duel of two robed figures with glowing blades', 'a bounty hunter ship landing on a stormy platform', 'a cargo hold of a freighter with crates and droids', 'a lone moon rising over a ringed gas giant', 'a rebel fleet emerging from hyperspace over a planet', 'a jungle canopy with a speeder chase between trees', 'a desert sarlacc pit ringed by skiffs',
  'a dark cathedral hangar with a shuttle descending', 'an armored trooper patrol in a red-lit corridor', 'a scavenger picking through a crashed star destroyer in the desert', 'a wise armored bounty hunter with a small green foundling', 'a starfighter squadron flying in formation at dawn', 'a cliff temple with meditating robed figures', 'a smoky underworld market on a rainy planet', 'a giant sandworm cresting a dune', 'a rebel gunner in a turret firing at fighters', 'a dark lord kneeling before a hologram of an emperor',
  'a desert pod hangar with mechanics and droids', 'a duel on a lava planet with rivers of fire', 'a snowy trench battle with troopers and walkers', 'a lone astromech on a wing of a crashed fighter', 'a majestic cruiser bridge with officers at stations', 'a forest speeder-bike chase at high speed', 'a desert homestead at twilight with two moons', 'an ancient sith temple glowing with red crystals', 'a rebel hangar celebration with pilots and droids', 'a wing-shaped fighter breaking through a blockade',
  'a lone hooded figure holding a glowing blue blade in the rain', 'a desert marketplace of hooded traders and droids', 'a starship graveyard drifting in deep space', 'a masked warrior meditating before a wall of fire', 'a cargo walker crossing a misty valley', 'a cockpit view of a lightspeed jump', 'a temple guardian statue on a mist-shrouded world', 'a rebel command center with holographic star maps', 'a desert cantina exterior under a violet sky', 'a starfighter exploding into sparks in a space battle',
  'a mountaintop jedi hermitage above the clouds', 'a droid workshop cluttered with mechanical limbs', 'a cloaked bounty hunter tracking through a neon rainy alley', 'a fleet of triangular cruisers eclipsing a sun', 'a desert skiff gliding over dunes toward a pit', 'an ice cave with a hanging survivor and a glowing blade', 'a landing platform at sunset with a sleek yacht', 'a swamp with a sunken fighter and glowing eyes in the dark', 'a war room of rebel leaders around a glowing table', 'a lone star knight silhouetted against twin suns',
];
const MODS = ['epic golden-hour desert light', 'cold deep-space starlight', 'dramatic nebula glow', 'fiery explosion light', 'moody hangar lighting', 'hazy twin-sun backlight', 'blue lightsaber glow', 'red villain rim light', 'volumetric god rays through smoke', 'snowy overcast light', 'sunset over alien clouds', 'high-contrast cinematic key light'];

function fluxPrompt(scene, mod) {
  return 'epic cinematic space opera movie still, Star Wars style, of ' + scene + ', ' + mod +
    ', highly detailed, dramatic, film grain, sweeping composition, sharp focus, 8k, absolutely no text, no words, no letters, no signage, no captions, no writing, no watermark, no logo';
}
function ddgQuery(scene) { return scene + ' professional photograph real people at work -cartoon -illustration -vector -clipart -diagram -infographic -chart'; }

async function fetchBuf(url, timeout) {
  if (typeof url !== 'string' || !/^https?:/.test(url)) return null;
  const isPoll = url.includes('pollinations');
  const tries = isPoll ? 6 : 1;
  for (let a = 0; a < tries; a++) {
    try {
      const r = await fetch(url, { headers: PTOK && isPoll ? { Authorization: 'Bearer ' + PTOK } : { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(timeout || 60000) });
      if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 3000) return b; }
    } catch (e) {}
    if (a < tries - 1) await sleep(2500 * (a + 1));
  }
  return null;
}
const urlOf = res => typeof res === 'string' ? res : (res && (res.img || res.url || res.src || res.image || res.link)) || null;
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

// ===== IMAGE PROVIDER LADDER — CADENCE & CIRCUIT BREAKER (owner spec 2026-07-09, THIS pipeline only) =====
// Strict order; fall to next rung ONLY when the current one trips. Main-site DDG ban is a separate chain, unaffected.
const LADDER = (process.env.GP_LADDER || 'flux,huggingface').split(',');   // owner: Pollinator + Hugging Face, rotating
const SOLO = LADDER.length === 1;                                   // single-provider: no bench
const BREAKER_ON = process.env.GP_BREAKER === '1';                 // circuit-breaker HALT off by default (owner wants continuous gen)
const CADENCE = { flux: 0, huggingface: 10000, cloudflare: 3000, pexels: 2000 };   // min gap between SUCCESSFUL requests (30s stagger dominates)
const STAGGER_MS = parseInt(process.env.GP_STAGGER_MS || '30000', 10);            // owner: 30s cooldown after each image
const CF_DAILY_CAP = parseInt(process.env.CF_DAILY_CAP || '9000', 10);             // Cloudflare free-tier hard stop
const BENCH_MS = 600000;                                            // 10-minute bench
const nowMs = () => Date.now();
const lastOk = { flux: 0, huggingface: 0, cloudflare: 0, pexels: 0 };
const benchUntil = { flux: 0, huggingface: 0, cloudflare: 0, pexels: 0 };
let cfToday = 0;
const attemptWin = [];                                             // rolling window across ALL providers; true = failure
const RUN_STATUS = WD + '/run_status.json';
const runStats = { pipeline: 'gp-image-ladder', started: new Date().toISOString(), attempts: 0, stored: 0, failed: 0, dup: 0, byProvider: {}, halted: false, reason: null };
function bumpProv(p, k) { (runStats.byProvider[p] = runStats.byProvider[p] || { stored: 0, failed: 0, dup: 0 })[k]++; }
function winFailRate() { const w = attemptWin.slice(-20); return w.length ? w.filter(Boolean).length / w.length : 0; }
function writeStatus() { try { fs.writeFileSync(RUN_STATUS, JSON.stringify(Object.assign({}, runStats, { windowFailRate: +winFailRate().toFixed(3), benchUntil, cfToday, updated: new Date().toISOString() }), null, 1)); } catch (e) {} }
// honest metric: log EVERY attempt (provider, slot, outcome, latency, cooldown/fallback state); never call a fallback a primary
function logAttempt(provider, slot, outcome, latency, note) {
  runStats.attempts++;
  if (outcome === 'stored') { runStats.stored++; bumpProv(provider, 'stored'); }
  else if (outcome === 'dup') { runStats.dup++; bumpProv(provider, 'dup'); }
  else { runStats.failed++; bumpProv(provider, 'failed'); }
  console.log('[ladder] ' + provider + ' #' + slot + ' ' + outcome.toUpperCase() + ' ' + latency + 'ms' + (note ? ' (' + note + ')' : '') + (provider !== LADDER[0] ? ' [FALLBACK]' : ''));
  writeStatus();
}
const isHardBench = e => /\b429\b|rate.?limit|too many|vqd|token/i.test(String(e || ''));

// NO DUPLICATES: content-hash every raw; reject any image whose bytes already exist (owner 2026-07-09).
const crypto = require('crypto');
const HASHES_F = WD + '/_gp_pool_hashes.json';
const hashBuf = b => crypto.createHash('sha256').update(b).digest('hex');
const seenHashes = new Set(loadJSON(HASHES_F, []));
try { for (const f of fs.readdirSync(RAW)) { if (/\.jpg$/i.test(f)) { try { seenHashes.add(hashBuf(fs.readFileSync(RAW + '/' + f))); } catch (e) {} } } } catch (e) {}
const saveHashes = () => { try { fs.writeFileSync(HASHES_F, JSON.stringify([...seenHashes])); } catch (e) {} };

const manifest = loadJSON(WD + '/_gp_pool_manifest.json', { slots: [] });
const bySlot = new Map(manifest.slots.map(s => [s.slot, s]));
function persist() {
  manifest.slots = [...bySlot.values()].sort((a, b) => a.slot - b.slot);
  manifest.generated = manifest.slots.filter(s => s.ok).length; manifest.total = TOTAL;
  manifest.fail = manifest.slots.filter(s => !s.ok).length; manifest.style = 'realistic';
  fs.writeFileSync(WD + '/_gp_pool_manifest.json', JSON.stringify(manifest, null, 1));
  fs.writeFileSync(WD + '/_gp_pool_progress.txt', manifest.generated + '/' + TOTAL + ' (fail ' + manifest.fail + ') style=realistic');
}

let cursor = Math.max(0, parseInt(process.env.GP_START || '0', 10)); // GP_START=5600 → begin AFTER slot 5600 (targets the cars band 5601-6600)
function nextSlot() { // atomic in single-threaded node; skip already-good slots (resume-safe)
  while (cursor < TOTAL) { cursor++; const s = bySlot.get(cursor); if (!(s && s.ok)) return cursor; }
  return null;
}

// fetch one candidate from a provider, varied by attempt so retries diverge (dedup escape hatch)
async function fetchProvider(provider, scene, prompt, slot, attempt) {
  const vseed = ((slot * 2654435761) + attempt * 7919) >>> 0;
  if (provider === 'ddg') {
    if (!searchRealPhoto) return null;
    const res = await searchRealPhoto(scene + (attempt ? ' ' + ['closeup', 'wide', 'candid'][(attempt - 1) % 3] : ''), 'gp-pool-' + slot + '-' + attempt, { skipRefine: true });
    return await fetchBuf(urlOf(res), 45000);
  }
  if (provider === 'huggingface') return await hfImage(prompt, vseed % 2147483647);
  if (provider === 'cloudflare') return await cfImage(prompt, vseed % 2147483647);
  if (provider === 'pexels') return await pexelsPhoto(scene, slot + attempt * 13);
  const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=760&height=760&nologo=true&model=' + provider + '&seed=' + (vseed % 1000000);
  return await fetchBuf(url, 120000);
}

function halt(slot) { runStats.halted = true; runStats.reason = 'window failure rate > 20% (halt at slot ' + slot + ')'; writeStatus(); console.log('[ladder] 🛑 CIRCUIT BREAKER — ' + runStats.reason + ' — exiting clean'); return true; }

// Walk the ladder for ONE slot: strict order, fall to next rung only on trip. SERIAL, single graded writer.
async function genOne(preferred, slot, providersOverride) {
  const { theme, scene, prompt } = sceneModFor(slot);
  const out = POOL + '/' + String(slot).padStart(3, '0') + '.jpg';
  const rawOut = RAW + '/' + String(slot).padStart(3, '0') + '.jpg';
  const existing = bySlot.get(slot);
  if (existing && existing.ok && fs.existsSync(out)) return true;   // resume-safe: graded image for slug = truth, skip
  const order = providersOverride || (preferred ? [preferred].concat(LADDER.filter(p => p !== preferred)) : LADDER);   // lane = single provider; else rotate preferred to front
  const noBench = SOLO || (Array.isArray(providersOverride) && providersOverride.length === 1);   // single-provider lane: keep retrying, never bench

  async function tryStore(provider, buf, latency) {                 // dedup + single-writer store (never hotlink)
    const bh = hashBuf(buf);
    if (seenHashes.has(bh)) { logAttempt(provider, slot, 'dup', latency); return 'dup'; }   // pHash dup ≠ failure
    seenHashes.add(bh); saveHashes();
    fs.writeFileSync(rawOut, buf);
    await grade(buf, out, { pass: 0 });                            // storeGradedImage-equivalent: the ONLY writer
    bySlot.set(slot, { slot, scene, sourceTitle: scene, theme, provider, ok: true, cookPass: 0 });
    persist();
    lastOk[provider] = nowMs(); attemptWin.push(false); if (attemptWin.length > 40) attemptWin.shift();
    logAttempt(provider, slot, 'stored', latency);
    return 'stored';
  }

  for (const provider of order) {
    if (nowMs() < benchUntil[provider]) continue;                  // benched rung — skip
    if (provider === 'cloudflare' && cfToday >= CF_DAILY_CAP) continue;   // CF daily free-tier hard stop
    const wait = CADENCE[provider] - (nowMs() - lastOk[provider]);  // cadence: min gap since this provider's last success
    if (wait > 0) await sleep(wait);

    let localFail = 0;
    for (let t = 0; t < 3; t++) {                                   // per rung: dup-escape tries + the failure/cooldown rules
      const t0 = nowMs();
      let buf = null, err = null;
      try { buf = await fetchProvider(provider, scene, prompt, slot, t); } catch (e) { err = e && e.message; }
      if (provider === 'cloudflare' && buf) cfToday++;
      const latency = nowMs() - t0;
      if (buf) {
        const r = await tryStore(provider, buf, latency);
        if (r === 'stored') { if (BREAKER_ON && attemptWin.length >= 20 && winFailRate() > 0.20) return halt(slot); return true; }
        continue;                                                   // dup → vary and retry SAME rung (no trip)
      }
      attemptWin.push(true); if (attemptWin.length > 40) attemptWin.shift();   // FAILURE = no usable graded image
      logAttempt(provider, slot, 'fail', latency, err || 'no-image');
      if (BREAKER_ON && attemptWin.length >= 20 && winFailRate() > 0.20) return halt(slot);
      if (isHardBench(err)) { if (!noBench) benchUntil[provider] = nowMs() + BENCH_MS; break; }   // 429/token → 10-min bench (skip in solo)
      localFail++;
      if (localFail === 1) { await sleep(30000); continue; }        // 1st failure: 30s cooldown, retry once
      if (!noBench) benchUntil[provider] = nowMs() + BENCH_MS; break;  // 2nd failure: bench 10 min, fall to next rung (solo just moves on)
    }
  }
  bySlot.set(slot, { slot, scene, sourceTitle: scene, theme, ok: false }); persist();
  return false;
}

(async () => {
  persist(); writeStatus();
  if (process.env.GP_LANES) {
    // GP_LANES="flux:0:60000,ddg:300000:60000" — provider:startDelayMs:cooldownMs. Concurrent lanes in ONE process
    // (shared cursor + manifest, no clobber), each STRICTLY its own provider (no fallback), one image at a time.
    const lanes = process.env.GP_LANES.split(',').map(s => { const [p, d, c] = s.split(':'); return { p: p.trim(), d: (d == null || d === '') ? 0 : +d, c: (c == null || c === '') ? 60000 : +c }; });
    console.log('[lanes] ' + lanes.map(l => l.p + ' (start +' + (l.d / 1000) + 's, ' + (l.c / 1000) + 's cooldown)').join('  |  '));
    async function providerLane({ p, d, c }) {
      await sleep(d);
      console.log('[lanes] ▶ ' + p + ' started (' + (c / 1000) + 's cooldown)');
      for (;;) { const slot = nextSlot(); if (slot == null) break; await genOne(null, slot, [p]); await sleep(c); }
      console.log('[lanes] ■ ' + p + ' done');
    }
    await Promise.all(lanes.map(providerLane));
  } else {
    console.log('[ladder] gp image pipeline · creators ' + LADDER.join(' + ') + ' (rotating) · SERIAL · ' + (STAGGER_MS / 1000) + 's cooldown · breaker ' + (BREAKER_ON ? 'ON' : 'OFF'));
    let rot = 0;
    for (;;) {
      if (runStats.halted) break;
      const slot = nextSlot();
      if (slot == null) break;
      const preferred = LADDER[rot++ % LADDER.length];
      await genOne(preferred, slot);
      if (!runStats.halted) await sleep(STAGGER_MS);
    }
  }
  runStats.reason = runStats.halted ? runStats.reason : 'complete';
  writeStatus();
  console.log('[ladder] done · stored=' + runStats.stored + ' failed=' + runStats.failed + ' dup=' + runStats.dup + (runStats.halted ? ' (HALTED)' : ''));
})().catch(e => { console.error('FATAL', e.message); try { fs.writeFileSync(WD + '/run_status.json', JSON.stringify({ pipeline: 'gp-image-ladder', halted: true, reason: 'FATAL: ' + e.message })); } catch (x) {} process.exit(1); });
