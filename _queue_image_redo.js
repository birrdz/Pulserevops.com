// Queue entries for image redo (red column) — Pollinator face/hero outside, DDG sections inside.
// Usage:
//   node _queue_image_redo.js --pillar mv              all Movies entries
//   node _queue_image_redo.js --pillar mv --placeholders   + site-wide /img/auto placeholders
//   node _queue_image_redo.js --placeholders             placeholders only (all pillars)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const KEY = '4444';
const AP = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const QUEUE = WD + '/_scrub_button_queue.json';
const PARK = WD + '/_redbox_parked.json';
const PENDING = WD + '/_scrub_pending_signoff.json';
const REJECT_FIX = WD + '/_scrub_reject_fix.json';
const LANE_JOBS_F = WD + '/_scrub_lane_jobs.json';
const FACE_HERO_F = WD + '/_face_hero_run.json';
const INTERNAL_F = WD + '/_internal_images_run.json';
const CONC = 16;
const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const args = process.argv.slice(2);
const pillars = [];
let includePlaceholders = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--pillar') pillars.push(args[++i]);
  else if (args[i] === '--placeholders') includePlaceholders = true;
}
if (!pillars.length && !includePlaceholders) pillars.push('mv');

function readArr(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return []; } }
function pillarOf(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }

function bodyNeedsImageRedo(id, body, ent) {
  const b = String(body || '');
  if (!b || b.length < 200) return 'thin/missing body';
  const reasons = [];
  if (/\/img\/auto\/|placeholder\.svg/i.test(b)) reasons.push('placeholder slots');
  if (/pollinations\.ai/i.test(b)) reasons.push('pollinations hotlink');
  const imgs = [...b.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)];
  for (const m of imgs) {
    if (/^https?:\/\//i.test(m[1]) && !/\/assets\/qa\//i.test(m[1])) { reasons.push('hotlinked image'); break; }
  }
  const facePath = '/assets/qa/' + id + '.jpg';
  const hero = b.slice(0, 1600).match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  if (!hero) reasons.push('no hero markdown');
  else if (hero[1] !== facePath) reasons.push('hero not synced to face card');
  if (ent && ent.cover_src && ent.cover_src !== 'flux') reasons.push('cover_src not flux');
  try {
    const st = fs.statSync(WD + '/assets/qa/' + id + '.jpg');
    if (st.size < 40000) reasons.push('face file small/missing');
  } catch (e) { reasons.push('face file missing'); }
  return reasons.join('; ') || 'image policy';
}

async function stopJobs() {
  for (const url of [
    'http://localhost:8899/face-hero-force-stop',
    'http://localhost:8899/internal-images-stop',
  ]) {
    try {
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY }) });
    } catch (e) {}
  }
  try {
    await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, action: 'stop' }) });
  } catch (e) {}
  for (const f of [FACE_HERO_F, INTERNAL_F]) {
    try {
      const j = JSON.parse(fs.readFileSync(f, 'utf8'));
      j.running = false; j.stop = true; j.phase = 'stopped'; j.finishedAt = Date.now(); j.pendingReview = null;
      j.currentId = ''; j.currentStep = 'stopped for image redo queue';
      fs.writeFileSync(f, JSON.stringify(j, null, 2));
    } catch (e) {}
  }
  await sleep(600);
}

function buildRedoRec(id, title, why) {
  const targets = ['pollinatorFaceCover', 'heroImage', 'pollinatorInternalFlux', 'media3to10', 'imagesLaw'];
  return {
    id,
    title: String(title || id).slice(0, 120),
    pillar: pillarOf(id),
    why: 'image redo — Pollinator face/hero + DDG sections (render before pub): ' + why,
    ownerTargets: targets,
    ownerNotes: 'Redo with tile-safe Pollinator cover + 16:9 DDG sections; hold until all images render.',
    source: 'image-redo-queue',
    at: new Date().toISOString(),
    status: 'queued-for-scrub',
  };
}

function applyBatch(redoMap) {
  const ids = [...redoMap.keys()];
  if (!ids.length) return 0;
  const idSet = new Set(ids);
  const fix = readArr(REJECT_FIX).filter(x => x && !idSet.has(x.id));
  const q = readArr(QUEUE).filter(x => !idSet.has(x));
  const park = readArr(PARK).filter(p => !idSet.has((p && p.id) || p));
  const pending = readArr(PENDING).filter(x => x && !idSet.has(x.id));
  const ap = readArr(AP).filter(x => !idSet.has(x));
  const cc = readArr(CC).filter(x => !idSet.has(x));
  const laneAll = readArr(LANE_JOBS_F).filter(j => j && j.id);
  const laneById = new Map(laneAll.map(j => [j.id, j]));

  const newFix = [];
  const newPark = [];
  const newQ = [];
  for (const id of ids) {
    const rec = redoMap.get(id);
    newFix.push(rec);
    newPark.unshift({ id, why: rec.why, at: rec.at, source: 'image-redo-queue' });
    newQ.push(id);
    const prev = laneById.get(id) || { id, sectionIdx: 0, contentRounds: 0 };
    laneById.set(id, Object.assign(prev, {
      id,
      phase: 'image_cover',
      sectionIdx: 0,
      imagesVerified: false,
      ownerNotes: rec.ownerNotes,
      updatedAt: new Date().toISOString(),
    }));
  }

  writeArr(REJECT_FIX, [...newFix, ...fix].slice(0, 800));
  writeArr(PARK, [...newPark, ...park].slice(0, 800));
  writeArr(QUEUE, [...newQ, ...q]);
  writeArr(PENDING, pending);
  writeArr(AP, ap);
  writeArr(CC, cc);
  writeArr(LANE_JOBS_F, [...laneById.values()].slice(0, 5000));
  return ids.length;
}
function writeArr(p, a) { fs.writeFileSync(p, JSON.stringify(a, null, 2)); }

(async () => {
  console.log('[image-redo] stopping face-hero + internal-images + scrub…');
  await stopJobs();

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const entries = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/i.test(String(e.id)));
  const pillarSet = new Set(pillars);
  const redoMap = new Map();

  for (const ent of entries) {
    if (!pillarSet.has(pillarOf(ent.id))) continue;
    const id = ent.id;
    redoMap.set(id, buildRedoRec(id, ent.question, 'full pillar redo — Pollinator face/hero + DDG sections'));
  }
  console.log('[image-redo] pillar queue (no blob fetch): ' + redoMap.size);

  if (includePlaceholders) {
    console.log('[image-redo] scanning placeholders site-wide (' + entries.length + ' entries, conc=' + CONC + ')…');
    let cur = 0, scanned = 0, hits = 0;
    async function worker() {
      while (cur < entries.length) {
        const ent = entries[cur++];
        const id = ent.id;
        if (pillarSet.has(pillarOf(id))) continue;
        const blob = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        scanned++;
        const body = blob && blob.answer;
        if (!/\/img\/auto\/|placeholder\.svg|pollinations\.ai/i.test(String(body || ''))) continue;
        if (!redoMap.has(id)) {
          redoMap.set(id, buildRedoRec(id, ent.question || (blob && blob.question), bodyNeedsImageRedo(id, body, ent)));
          hits++;
        }
        if (scanned % 500 === 0) console.log('[image-redo] scanned ' + scanned + ' · placeholder hits ' + hits + ' · total queued ' + redoMap.size);
      }
    }
    await Promise.all(Array.from({ length: CONC }, worker));
    console.log('[image-redo] placeholder scan done · new hits ' + hits);
  }

  const n = applyBatch(redoMap);
  console.log('[image-redo] DONE · wrote ' + n + ' entries → red column (reject-fix + queue + lane image_cover)');
  console.log('[image-redo] pillars=' + [...pillarSet].join(',') + ' placeholders=' + includePlaceholders);
  const st = await fetch('http://localhost:8899/state?key=' + KEY).then(r => r.json()).catch(() => null);
  if (st) console.log('[image-redo] UI: under(red)=' + st.under + ' fixing=' + st.fixing + ' green=' + st.green);
})().catch(e => { console.error('[image-redo] FATAL', e); process.exit(1); });
