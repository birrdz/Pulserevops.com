// _pillar_dupe_pool.js — build 100 shared section images per topic pillar for dupe-fill reuse.
//   node _pillar_dupe_pool.js tl           → fill pool-tl-001..100 for Pulse Tools / CRO
//   node _pillar_dupe_pool.js tl 50        → target 50 instead of 100
//   node _pillar_dupe_pool.js --next       → next pillar not yet at 100
//   node _pillar_dupe_pool.js --status     → counts per pillar
//   node _pillar_dupe_pool.js all          → every pillar sequentially (stop: _pillar_dupe_pool_stop.flag)
// Harvests diverse existing section images first, then DDG-generates the rest.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const STATE_F = WD + '/_pillar_dupe_pool.json';
const STOP_F = WD + '/_pillar_dupe_pool_stop.flag';
const LOG_F = WD + '/_pillar_dupe_pool.out.log';
const {
  PILLAR_SUBJECT, countPillarPoolSlots, ensurePillarPoolSlot, harvestPillarPoolFromLibrary, backfillRegistry, flushReg, buildPoolQuery,
} = require('./_ddg_facecard_lib');

const PILLARS = [
  'tl', 'ca', 'bt', 'aq', 'ik', 'tk', 'bs', 'st', 'fr', 'co', 'ai', 'gb', 'bo', 'sy', 'cr', 'fs', 'gp', 'ra', 'pt',
  'es', 'tv', 'rs', 'cl', 'lv', 'ev', 'ga', 'gm', 'mv', 'wl', 'dr', 'dn', 'nl', 'tn', 'sc', 'tc', 'er', 'ce', 'q',
  'ed', 'sw', 'hf', 'sp', 'sk',
];
const PILLAR_LABEL = {
  tl: 'Pulse Tools / CRO', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks',
  bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infrastructure',
  gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM Playbooks',
  ra: 'Revenue Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne',
  lv: 'Luxury Travel', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness',
  dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics',
  ce: 'Pulse News', q: 'Knowledge', ed: 'Advice', sw: 'Software', hf: 'Home & Family', sp: 'Speeches', sk: 'Skills',
};

const SCENE_MODIFIERS = [
  'close-up detail', 'wide establishing shot', 'indoor natural light', 'outdoor golden hour', 'professional workplace',
  'modern minimalist setting', 'warm vintage editorial tone', 'high contrast dramatic lighting', 'soft ambient light',
  'urban environment', 'suburban scene', 'hands-on practical view', 'overhead flat lay', 'side angle perspective',
  'team collaboration scene', 'solo focused work', 'customer interaction', 'product in use', 'workspace desk setup',
  'retail storefront exterior', 'interior design detail', 'action moment candid', 'quiet contemplative mood',
  'bright airy atmosphere', 'moody atmospheric scene', 'clean corporate environment', 'authentic documentary style',
  'seasonal outdoor scene', 'nighttime illuminated', 'morning light soft shadows', 'macro texture detail',
  'lifestyle context shot', 'equipment close-up', 'process in progress', 'finished result showcase',
  'comparison side by side', 'hands demonstrating', 'group setting small crowd', 'empty space minimalist',
  'colorful vibrant scene', 'neutral toned professional', 'heritage classic style', 'contemporary modern look',
  'behind the scenes candid', 'public venue atmosphere', 'home setting comfortable', 'travel destination vista',
  'craftsmanship detail', 'technology interface screen', 'nature integrated backdrop', 'industrial setting',
];

function poolQuery(pillar, slot) {
  return buildPoolQuery(pillar, slot, 0);
}
function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}
function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) { return { pillars: {} }; }
}
function saveState(st) {
  fs.writeFileSync(STATE_F, JSON.stringify(st, null, 2));
}
function nextIncompletePillar(st, target) {
  for (const p of PILLARS) {
    const have = countPillarPoolSlots(p);
    if (have < target) return p;
  }
  return null;
}

async function buildPillarPool(pillar, target) {
  target = target || 100;
  const label = PILLAR_LABEL[pillar] || pillar;
  const st = loadState();
  if (!st.pillars[pillar]) st.pillars[pillar] = { target, harvested: 0, generated: 0, startedAt: null, finishedAt: null };
  st.pillars[pillar].target = target;
  st.pillars[pillar].startedAt = st.pillars[pillar].startedAt || new Date().toISOString();
  saveState(st);

  let have = countPillarPoolSlots(pillar);
  log('[pool] ' + pillar + ' (' + label + ') — ' + have + '/' + target + ' pool images');

  if (have < target) {
    log('[pool] ' + pillar + ' — harvesting existing section images…');
    const har = await harvestPillarPoolFromLibrary(pillar, have + 1, Math.min(45, target - have));
    have = countPillarPoolSlots(pillar);
    st.pillars[pillar].harvested = (st.pillars[pillar].harvested || 0) + har.copied;
    log('[pool] ' + pillar + ' — harvested ' + har.copied + ' → now ' + have + '/' + target);
    saveState(st);
  }

  let slot = 1;
  for (slot = 1; slot <= target; slot++) {
    if (fs.existsSync(STOP_F)) { log('[pool] STOP flag'); break; }
    have = countPillarPoolSlots(pillar);
    if (have >= target) break;
    try {
      if (fs.statSync(WD + '/assets/qa/pool-' + pillar + '-' + String(slot).padStart(3, '0') + '.jpg').size > 8000) continue;
    } catch (e) {}

    const query = poolQuery(pillar, slot);
    log('[pool] ' + pillar + ' slot ' + slot + '/' + target + ' — ' + query.slice(0, 72));
    const r = await ensurePillarPoolSlot(pillar, slot, query);
    if (r.ok) {
      if (!r.skipped) {
        st.pillars[pillar].generated = (st.pillars[pillar].generated || 0) + 1;
        log('[pool] ✓ ' + pillar + ' pool-' + String(slot).padStart(3, '0') + ' → ' + r.url);
      }
    } else {
      log('[pool] ✗ ' + pillar + ' slot ' + slot + ' — ' + (r.err || 'failed'));
    }
    saveState(st);
    await new Promise(r => setTimeout(r, 2500));
  }

  have = countPillarPoolSlots(pillar);
  if (have >= target) {
    st.pillars[pillar].finishedAt = new Date().toISOString();
    log('[pool] ✅ ' + pillar + ' COMPLETE — ' + have + ' shared pool images ready for dupe fill');
  } else {
    log('[pool] ⏸ ' + pillar + ' paused at ' + have + '/' + target + ' — re-run to continue');
  }
  saveState(st);
  return have;
}

async function printStatus(target) {
  await backfillRegistry();
  target = target || 100;
  log('[pool] status (target ' + target + ' per pillar):');
  let done = 0, partial = 0;
  for (const p of PILLARS) {
    const n = countPillarPoolSlots(p);
    const mark = n >= target ? '✅' : (n > 0 ? '…' : '—');
    if (n >= target) done++; else if (n > 0) partial++;
    log('  ' + mark + ' ' + p.padEnd(3) + ' ' + String(n).padStart(3) + '/100  ' + (PILLAR_LABEL[p] || ''));
  }
  log('[pool] complete: ' + done + '/' + PILLARS.length + ' · partial: ' + partial);
}

(async () => {
  const arg = process.argv[2] || '--status';
  const arg2 = parseInt(process.argv[3] || '100', 10) || 100;
  const target = Math.max(1, Math.min(100, arg2));

  if (arg === '--status' || arg === '-s') {
    await printStatus(target);
    return;
  }
  if (arg === '--next' || arg === '-n') {
    const st = loadState();
    const p = nextIncompletePillar(st, target);
    if (!p) { log('[pool] all pillars at ' + target + '+'); await printStatus(target); return; }
    await buildPillarPool(p, target);
    flushReg();
    return;
  }
  if (arg === 'all') {
    log('[pool] ALL pillars — target ' + target + ' each · stop: _pillar_dupe_pool_stop.flag');
    for (const p of PILLARS) {
      if (fs.existsSync(STOP_F)) break;
      if (countPillarPoolSlots(p) >= target) { log('[pool] skip ' + p + ' (already ' + target + ')'); continue; }
      await buildPillarPool(p, target);
    }
    await printStatus(target);
    flushReg();
    return;
  }
  if (!PILLARS.includes(arg)) {
    console.log('Usage: node _pillar_dupe_pool.js <pillar|all|--next|--status> [target=100]');
    console.log('Pillars: ' + PILLARS.join(', '));
    process.exit(1);
  }
  await buildPillarPool(arg, target);
  flushReg();
})().catch(e => { log('[pool] FATAL ' + (e && e.message)); process.exit(1); });
