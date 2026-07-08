// Image-stuck watchdog (owner 2026-07-08): when image production stalls — no new
// /assets/qa/*.jpg written for STUCK_MS while the lane is in an image phase — pause
// image production for PAUSE_MS (2 min) so the throttled provider resets, then resume.
// The scrub server's image slots skip work while _img_pause_until.txt is in the future.
// Stop: _image_stuck_watchdog_stop.flag
const fs = require('fs');
const cp = require('child_process');
const WD = 'C:/Users/koryj/website';
const QA = WD + '/assets/qa';
const PAUSE_F = WD + '/_img_pause_until.txt';
const STOP_F = WD + '/_image_stuck_watchdog_stop.flag';
const LOG_F = WD + '/_image_stuck_watchdog.log';
const SCRUB_API = 'http://localhost:8899';
const STUCK_MS = parseInt(process.env.STUCK_MS || '120000', 10);   // no new image for 2 min = stuck
const PAUSE_MS = parseInt(process.env.PAUSE_MS || '120000', 10);   // pause image production 2 min
const POLL_MS = 20000;

function log(m) { const s = new Date().toISOString() + ' ' + m; try { fs.appendFileSync(LOG_F, s + '\n'); } catch (e) {} console.log('[img-watchdog] ' + m); }

function newestImageMtime() {
  let newest = 0;
  try { for (const f of fs.readdirSync(QA)) { if (!/\.jpg$/i.test(f)) continue; const t = fs.statSync(QA + '/' + f).mtimeMs; if (t > newest) newest = t; } } catch (e) {}
  return newest;
}
async function laneInImagePhase() {
  try {
    const j = await (await fetch(SCRUB_API + '/scrub-status', { signal: AbortSignal.timeout(5000) })).json();
    const sl = (j.lane && j.lane.slots) || {};
    // in an image phase if flux/ddg slot busy, or the active entry's phase is an image phase
    const imgBusy = (sl.ddg && sl.ddg.busy) || (sl.flux && sl.flux.busy);
    const live = j.scrubLive || {};
    const phaseImg = /top10|image|hero|§|img/i.test(String(live.stage || live.carwash || ''));
    return !!(imgBusy || phaseImg);
  } catch (e) { return false; }
}
function pausedUntil() { try { return parseInt(fs.readFileSync(PAUSE_F, 'utf8').trim(), 10) || 0; } catch (e) { return 0; } }
function setPause(ms) { try { fs.writeFileSync(PAUSE_F, String(Date.now() + ms)); } catch (e) {} }

(async () => {
  log('watchdog live · stuck>' + (STUCK_MS/1000) + 's · pause ' + (PAUSE_MS/1000) + 's');
  let lastNewest = newestImageMtime();
  let lastChange = Date.now();
  while (!fs.existsSync(STOP_F)) {
    try {
      // currently paused? wait it out, then resume note
      const pu = pausedUntil();
      if (pu > Date.now()) { await new Promise(r => setTimeout(r, Math.min(POLL_MS, pu - Date.now()))); continue; }
      const newest = newestImageMtime();
      if (newest > lastNewest) { lastNewest = newest; lastChange = Date.now(); }
      const stalledMs = Date.now() - lastChange;
      if (stalledMs >= STUCK_MS && await laneInImagePhase()) {
        log('⏸️ images STUCK (' + Math.round(stalledMs/1000) + 's no new image) — pausing image production ' + (PAUSE_MS/1000) + 's to reset provider throttle');
        setPause(PAUSE_MS);
        // let content/audit keep running during the image pause; reset stall clock so we
        // re-evaluate fresh after resume
        await new Promise(r => setTimeout(r, PAUSE_MS + 3000));
        lastChange = Date.now(); lastNewest = newestImageMtime();
        log('▶️ image pause over — resumed');
      }
    } catch (e) { log('loop err ' + (e.message || e)); }
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  log('stopped (flag)');
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
