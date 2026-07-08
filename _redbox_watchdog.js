// _redbox_watchdog.js — keep _redbox_scrub.js alive while the owner is away (2026-06-30).
// Every 60s: if no _redbox_scrub node process is running AND no stop flag, relaunch it.
// stop: _redbox_watchdog_stop.flag (also stops trying to revive the scrub).
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_redbox_watchdog_stop.flag';
const SCRUB_STOP = WD + '/_redbox_scrub_stop.flag';
const LOG = WD + '/_redbox_watchdog.out.log';
const logln = s => { try { fs.appendFileSync(LOG, new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} };
function scrubRunning() {
  try {
    const out = execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Where-Object { $_.CommandLine -match \'_redbox_scrub\\.js\' } | Measure-Object).Count"', { encoding: 'utf8' });
    return parseInt(out.trim(), 10) > 0;
  } catch (e) { return false; }
}
(async () => {
  logln('[watchdog] up — reviving _redbox_scrub.js if it dies (60s)');
  while (!fs.existsSync(STOP)) {
    if (!fs.existsSync(SCRUB_STOP) && !scrubRunning()) {
      logln('[watchdog] scrub down — relaunching');
      const child = spawn('node', ['_redbox_scrub.js'], { cwd: WD, detached: true, stdio: 'ignore' });
      child.unref();
    }
    await new Promise(r => setTimeout(r, 60000));
  }
  logln('[watchdog] stop flag — exiting');
})();
