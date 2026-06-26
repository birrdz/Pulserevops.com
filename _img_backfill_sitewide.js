// FULL-SITE DDG image backfill — sweeps EVERY pillar every pass and fixes any entry
// missing images, by ACTUAL image count (not the images_pending flag), so the whole
// back catalog gets images, not just new entries. Idempotent (per-pillar scripts skip
// entries that already have enough images). Loops behind the writers; free/keyless.
// Run in background: node _img_backfill_sitewide.js   (stop: create _img_audit_stop.flag)
const { execSync } = require('child_process');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }

// Q&A-style pillars → representative cover image (suffix tunes the DDG query).
const COVER = { q: '', ik: '', tk: '', cg: '', st: '', ra: '', gp: '', sw: '', tl: '', ai: '', bo: '', gb: '', sk: '', hf: '', ed: '', bs: 'book cover', sp: 'portrait' };
// Listicle pillars → per-item Top-10 card backfill (needs the pillar URL path).
const TOP10 = { er: '/electronic-reviews', ca: '/cars', bt: '/boats', aq: '/aquariums', fr: '/franchises', sc: '/schools', pt: '/pets', co: '/collectibles', wl: '/wellness', gm: '/gaming', mv: '/movies', dn: '/dining', rs: '/resorts', tv: '/travel', tn: '/towns', lv: '/living', es: '/estates', cl: '/clubs', ev: '/events', ga: '/gatherings', sy: '/style', nl: '/nightlife' };

const STOP = 'C:/Users/koryj/website/_img_audit_stop.flag';
const LOG = 'C:/Users/koryj/website/_img_backfill_sitewide.log';
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function run(cmd) { try { execSync(cmd, { cwd: 'C:/Users/koryj/website', stdio: 'ignore', timeout: 20 * 60 * 1000 }); } catch (e) {} }

(async () => {
  log('[img-sitewide] started — full-site sweep across all pillars');
  for (let pass = 1; ; pass++) {
    if (fs.existsSync(STOP)) { log('[img-sitewide] stop flag — exiting'); break; }
    log('[img-sitewide] FULL-SITE pass ' + pass + ' start');
    for (const [p, suf] of Object.entries(COVER)) { if (fs.existsSync(STOP)) break; run(`node _cover_img_any.js ${p} "${suf}"`); }
    for (const [p, path] of Object.entries(TOP10)) { if (fs.existsSync(STOP)) break; run(`node _img_backfill_any.js ${p} ${path}`); }
    log('[img-sitewide] pass ' + pass + ' complete');
    await sleep(120000); // breathe, then re-sweep (catches newly written entries too)
  }
})().catch(e => { log('[img-sitewide] FATAL ' + e.message); });
