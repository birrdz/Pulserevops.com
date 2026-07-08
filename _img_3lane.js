// _img_3lane.js — 3 PARALLEL DDG image lanes, NEWEST-PUBLISHED FIRST. Run THREE
// instances: LANE=1, LANE=2, LANE=3. Each owns a disjoint 1/3 of the pillar task
// list (round-robin) so the lanes never double-process.
//
// OWNER LAW (2026-06-27):
//  • EVERY answer gets a topical MAIN image at the TOP — ABOVE the quick-answer /
//    Direct Answer line (NOT under). _cover_img_any.js prepends the cover as the
//    first line of the body, so it renders above the H1 + Direct Answer. We now run
//    a cover pass on EVERY pillar (Q&A/essay AND Top-10), so no answer is left
//    without a top image; Top-10 pillars additionally get all 10 item images.
//  • RUN NON-STOP, ALWAYS — keep sweeping the whole site behind the writers, even
//    when no project is active. The lane only STOPS after it has swept its whole
//    slice of the site TWICE with ZERO images created or fixed (2 clean sweeps),
//    i.e. nothing left to create or repair. Manual override: create _img3_stop.flag.
//   LANE=1 node _img_3lane.js   (and LANE=2, LANE=3 in two more processes)
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }

const DIR = 'C:/Users/koryj/website';
// Q&A/essay pillars → single topical cover image (suffix tunes the DDG query).
// NOTE: tl (CRO/Tools) is INTENTIONALLY EXCLUDED — CRO answers use the curated
// cro-cover rotation (cro-cover-{1,3,4,5,6}.jpg via _cro_set_covers.js / REQS.cro).
// The generic DDG cover lane must NOT touch tl or it re-randomizes the owner's cards.
const COVER = { q: '', ik: '', tk: '', cg: '', st: '', ra: '', gp: '', sw: '', ai: '', bo: '', gb: '', sk: '', hf: '', ed: '', bs: 'book cover', sp: 'portrait' };
// Listicle pillars → per-item Top-10 image backfill (needs the pillar URL path)
// AND a top cover (so the MAIN image sits above the quick-answer line here too).
const TOP10 = { er: '/electronic-reviews', ca: '/cars', bt: '/boats', aq: '/aquariums', fr: '/franchises', sc: '/schools', pt: '/pets', co: '/collectibles', wl: '/wellness', gm: '/gaming', mv: '/movies', dn: '/dining', rs: '/resorts', tv: '/travel', tn: '/towns', lv: '/living', es: '/estates', cl: '/clubs', ev: '/events', ga: '/gatherings', sy: '/style', nl: '/nightlife' };

const LANE = parseInt(process.env.LANE || '1', 10);          // 1 | 2 | 3
const NLANES = 3;
const STOP = DIR + '/_img3_stop.flag';
const LOG = DIR + '/_img_3lane.log';
const log = s => { const line = new Date().toISOString() + ` [lane${LANE}] ` + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Spawn node DIRECTLY (no cmd.exe shell) so no console window flashes — windowsHide is
// unreliable for shelled-out console apps on Windows; spawnSync of the exe honors it.
// cmd is always `node <script> <arg> <arg?>` with double-quoted args.
function run(cmd) {
  try {
    const m = cmd.match(/^node\s+(.*)$/);
    if (!m) { execSync(cmd, { cwd: DIR, stdio: 'ignore', timeout: 25 * 60 * 1000, windowsHide: true }); return; }
    const args = []; const re = /"([^"]*)"|(\S+)/g; let mm;
    while ((mm = re.exec(m[1]))) args.push(mm[1] !== undefined ? mm[1] : mm[2]);
    spawnSync(process.execPath, args, { cwd: DIR, stdio: 'ignore', timeout: 25 * 60 * 1000, windowsHide: true });
  } catch (e) {}
}
function readJSON(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } }
function rm(p) { try { fs.unlinkSync(p); } catch (e) {} }

// Build the full task list: a COVER pass for EVERY pillar (so every answer gets a
// top image), then the Top-10 per-item backfill. Covers first so the main image
// lands fast everywhere. Keep only this lane's 1/3 (round-robin).
const tasks = [];
for (const [p, suf] of Object.entries(COVER)) tasks.push({ kind: 'cover', p, cmd: `node _cover_img_any.js ${p} "${suf}"`, res: `${DIR}/_${p}_cover_result.json` });
for (const p of Object.keys(TOP10))            tasks.push({ kind: 'cover', p, cmd: `node _cover_img_any.js ${p} ""`,      res: `${DIR}/_${p}_cover_result.json` });
for (const [p, path] of Object.entries(TOP10)) tasks.push({ kind: 'top10', p, cmd: `node _img_backfill_any.js ${p} ${path}`, res: `${DIR}/_${p}_ddg_result.json` });
const mine = tasks.filter((_, i) => i % NLANES === (LANE - 1));

// Count images created/fixed by a finished task from its result file.
function workFromResult(t) {
  const r = readJSON(t.res);
  if (!r) return 0;
  return (r.added || 0) + (r.fixed || 0) + (r.addedImgs || 0);
}

(async () => {
  log(`start — ${mine.length} pillar-tasks: ${mine.map(t => t.kind[0] + ':' + t.p).join(',')}`);
  let cleanStreak = 0;
  for (let pass = 1; ; pass++) {
    if (fs.existsSync(STOP)) { log('stop flag — exiting'); break; }
    log(`pass ${pass} start (newest-first)`);
    let passWork = 0;
    for (const t of mine) {
      if (fs.existsSync(STOP)) break;
      rm(t.res);                 // clear so a stale file can't look like work
      run(t.cmd);
      const w = workFromResult(t);
      passWork += w;
      if (w) log(`  ${t.kind}:${t.p} +${w}`);
    }
    log(`pass ${pass} complete — images created/fixed this pass: ${passWork}`);
    if (passWork === 0) {
      cleanStreak++;
      log(`clean sweep ${cleanStreak}/2 (nothing to create or fix)`);
      if (cleanStreak >= 2) { log('site swept TWICE clean — no image left to create or fix. Lane done.'); break; }
    } else {
      cleanStreak = 0;
    }
    await sleep(120000); // breathe, then re-sweep to catch newly written entries
  }
})().catch(e => { log('FATAL ' + e.message); });
