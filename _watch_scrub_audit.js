// Wait for q12763 test, restart server, then watch for +10 scrubs and run full audit.
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const SCRUBLOG = WD + '/_scrub_run_log.json';
const dayFile = WD + '/_scrub_button_day.json';
const testLog = 'C:/Users/koryj/.cursor/projects/C-Users-koryj-AppData-Local-Temp-ac8a7824-64b2-4b1f-8bd5-83bff2b334e3/terminals/450782.txt';

function dayCount() { try { const d = JSON.parse(fs.readFileSync(dayFile, 'utf8')); const today = new Date().toISOString().slice(0, 10); return d.day === today ? (d.n || 0) : 0; } catch (e) { return 0; } }
function logCount() { try { return JSON.parse(fs.readFileSync(SCRUBLOG, 'utf8')).length; } catch (e) { return 0; } }
function testDone() {
  try {
    const t = fs.readFileSync(testLog, 'utf8');
    return /exit_code:/.test(t) || /\nAFTER /.test(t);
  } catch (e) { return false; }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function restartServer() {
  const { execSync } = require('child_process');
  try {
    const out = execSync('netstat -ano | findstr ":8899" | findstr LISTENING', { encoding: 'utf8' });
    const pid = (out.trim().split(/\s+/).pop());
    if (pid) execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
  } catch (e) {}
  await sleep(2000);
  spawn('node', ['_scrub_button_server.js'], { cwd: WD, detached: true, stdio: 'ignore' }).unref();
  await sleep(4000);
  const r = await fetch('http://localhost:8899/state?key=4444').then(x => x.json()).catch(() => null);
  console.log('server restart', r && r.ok ? 'OK' : 'CHECK MANUALLY');
}

(async () => {
  console.log('[watch] waiting for q12763 test to finish…');
  for (let i = 0; i < 120; i++) {
    if (testDone()) break;
    await sleep(15000);
  }
  console.log('[watch] restarting scrub server with serial slot + audit log…');
  await restartServer();
  const baseline = logCount();
  const baselineDay = dayCount();
  console.log('[watch] baseline scrub log entries:', baseline, '| day count:', baselineDay);
  console.log('[watch] waiting for', 10, 'new scrub runs (hit Begin Scrub on your end)…');
  for (let i = 0; i < 90; i++) {
    const lc = logCount();
    const newRuns = lc - baseline;
    if (newRuns >= 10) {
      console.log('[watch] +' + newRuns + ' scrubs logged — running full audit…');
      const { execSync } = require('child_process');
      execSync('node _audit_scrub_last10.js 10', { cwd: WD, stdio: 'inherit' });
      return;
    }
    if (i % 4 === 0) console.log('[watch] scrub log:', lc, '(+' + newRuns + '/10)');
    await sleep(30000);
  }
  console.log('[watch] timeout — run manually: node _audit_scrub_last10.js 10');
})().catch(e => console.error(e.message));
