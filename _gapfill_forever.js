// GAP-FILL SUPERVISOR — never stops until the whole gap (TARGET) is written.
// Loop: top up the queue when low (auto-loads the next ~500), run the writer to
// completion, re-check progress, repeat. One writer at a time (no id collisions).
// Run in background: node _gapfill_forever.js
const fs = require('fs');
const { execSync } = require('child_process');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const QFILE = 'C:/Users/koryj/website/_gapfill_queue.json';
const LOG = 'C:/Users/koryj/website/_gapfill_forever.log';
const STOP = 'C:/Users/koryj/website/_gapfill_stop.flag';
const BASELINE = 19851, TARGET = 8730;
const LOW_WATER = 40;   // refill when fewer than this many unwritten titles remain
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  logln('[forever] supervisor started; target=' + TARGET);
  for (;;) {
    if (fs.existsSync(STOP)) { logln('[forever] stop flag found — exiting'); break; }
    // 1. progress check
    let W = 0;
    try { const i = await store.get('_index.json', { type: 'json', consistency: 'strong' }); W = Math.max(0, i.entries.length - BASELINE);
      const have = new Set(i.entries.map(e => norm(e.question)));
      const queue = JSON.parse(fs.readFileSync(QFILE, 'utf8'));
      const remaining = queue.filter(it => !have.has(norm(it.title))).length;
      logln('[forever] W=' + W + '/' + TARGET + ' queue_remaining=' + remaining);
      if (W >= TARGET) {
        logln('[forever] TARGET REACHED — running end-of-campaign year-stamp');
        // 1) turn on going-forward enforcement, 2) retro-stamp the back-catalog
        try { fs.writeFileSync('C:/Users/koryj/website/_year_law_enforce.flag', new Date().toISOString()); } catch (e) {}
        try { execSync('node _year_stamp_retro.js', { cwd: 'C:/Users/koryj/website', stdio: 'inherit', timeout: 6 * 3600 * 1000 }); logln('[forever] retro year-stamp complete'); }
        catch (e) { logln('[forever] retro year-stamp err ' + e.message); }
        logln('[forever] done');
        break;
      }
      // 2. refill the next ~500 when the queue is running low
      if (remaining < LOW_WATER) {
        logln('[forever] queue low — loading next ~500');
        try { execSync('node _gapfill_refill.js --per=36', { cwd: 'C:/Users/koryj/website', stdio: 'inherit', timeout: 600000 }); }
        catch (e) { logln('[forever] refill err ' + e.message); }
      }
    } catch (e) { logln('[forever] progress read err ' + e.message); await sleep(15000); continue; }
    // 3. run the writer to completion (it re-reads queue+index, skips written)
    logln('[forever] launching writer pass');
    try { execSync('node -r ./_loadenv.js _gapfill_run.js --conc=2', { cwd: 'C:/Users/koryj/website', stdio: 'inherit', timeout: 6 * 3600 * 1000 }); }
    catch (e) { logln('[forever] writer pass ended: ' + e.message); }
    await sleep(5000); // brief breath before next cycle
  }
})().catch(e => { logln('[forever] FATAL ' + e.message); process.exit(1); });
