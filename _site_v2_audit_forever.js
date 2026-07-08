// _site_v2_audit_forever.js — always-on WHOLE-SITE auditor (owner crew 2026-06-29:
// "one Claude code to audit the whole site"). Wraps _site_v2_audit.js: re-scans every
// entry across all pillars every INTERVAL_MIN (default 30), refreshing _site_v2_queue.json
// + _site_v2_rollup.json so the Claude fixer always has the live list of sub-V2 entries.
// Stop: create _site_v2_audit_stop.flag.
// Relaunch: Start-Process node _site_v2_audit_forever.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
const { spawn } = require('child_process');
const fs = require('fs');
const INTERVAL = (parseInt(process.env.INTERVAL_MIN || '30', 10)) * 60 * 1000;
const STOP = 'C:/Users/koryj/website/_site_v2_audit_stop.flag';
function runOnce() {
  return new Promise((res) => {
    const p = spawn(process.execPath, ['_site_v2_audit.js'], { cwd: 'C:/Users/koryj/website', stdio: 'inherit' });
    p.on('exit', (c) => res(c)); p.on('error', () => res(-1));
  });
}
(async () => {
  console.log('[site-v2-audit] whole-site auditor up, interval', INTERVAL / 60000, 'min');
  while (!fs.existsSync(STOP)) {
    await runOnce();
    console.log('[site-v2-audit]', new Date().toISOString(), 'scan complete; queue refreshed');
    const t = Date.now();
    while (Date.now() - t < INTERVAL && !fs.existsSync(STOP)) { await new Promise(r => setTimeout(r, 5000)); }
  }
  console.log('[site-v2-audit] stop flag seen, exiting');
})();
