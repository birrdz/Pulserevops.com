// _all_flux_watchdog.js — keepalive for the flux face-card campaign. Every 3 min, if the generator or the
// emailer isn't running (crash / flux hang / killed), relaunch it. Both are resumable (skip cover_src:'flux').
// Stop everything: create _all_flux_facecards_stop.flag (halts generator) + _all_flux_watchdog_stop.flag (halts this).
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_all_flux_watchdog_stop.flag';
const GEN_STOP = WD + '/_all_flux_facecards_stop.flag';
const LOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_watchdog.log';
const RUNLOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_run.log';
const EMAILLOG = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_email_loop.log';
const sleep = ms => new Promise(r => setTimeout(r, ms));
function log(m) { const l = new Date().toISOString() + ' ' + m; console.log(l); try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} }
const { spawnSync } = require('child_process');
// Robust detection via spawnSync (no bash re-quoting). SAFETY BIAS: on ANY uncertainty
// (error/timeout/unparseable) return TRUE = "assume running", so a false negative can NEVER
// spawn a duplicate. Worst case is a missed relaunch, which is far safer than duplicate generators.
function running(script) {
  const ps = "(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*" + script + "*' }).Count";
  try {
    const r = spawnSync('powershell.exe', ['-NoProfile', '-Command', ps], { encoding: 'utf8', timeout: 25000 });
    if (r.error || r.status !== 0) return true;
    const n = parseInt(String(r.stdout || '').trim(), 10);
    return Number.isFinite(n) ? n > 0 : true;
  } catch (e) { return true; }
}
function launch(script, logfile) {
  const fd = fs.openSync(logfile, 'a');
  const child = spawn('node', [script], { cwd: WD, detached: true, stdio: ['ignore', fd, fd] });
  child.unref();
  log('relaunched ' + script + ' pid ' + child.pid);
}
(async () => {
  log('watchdog up — guarding generator + emailer every 3 min');
  while (!fs.existsSync(STOP)) {
    if (!fs.existsSync(GEN_STOP) && !running('_all_flux_facecards.js')) { log('generator DOWN'); launch('_all_flux_facecards.js', RUNLOG); }
    if (!running('_all_flux_pillar_email.js')) { log('pillar-emailer DOWN'); launch('_all_flux_pillar_email.js', EMAILLOG); }
    if (!fs.existsSync(WD + '/_all_flux_daily_deploy_stop.flag') && !running('_all_flux_daily_deploy.js')) { log('daily-deploy DOWN'); launch('_all_flux_daily_deploy.js', 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad/_all_flux_daily_deploy.log'); }
    for (let i = 0; i < 45 && !fs.existsSync(STOP); i++) await sleep(4000);
  }
  log('watchdog stop flag — exiting');
})();
