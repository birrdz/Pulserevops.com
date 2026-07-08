// _url_health_forever.js — always-on watchdog around _url_health_canary.js.
// Runs the canary every INTERVAL_MIN (default 20). On failure it leaves
// _url_health_alert.json in place (the hourly handoff + next session surface it);
// on success it refreshes _url_health_ok.json. Stop: create _url_health_stop.flag.
// Relaunch: Start-Process node _url_health_forever.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
const { spawn } = require('child_process');
const fs = require('fs');
const INTERVAL = (parseInt(process.env.INTERVAL_MIN || '20', 10)) * 60 * 1000;
const STOP = 'C:/Users/koryj/website/_url_health_stop.flag';
function runOnce() {
  return new Promise((res) => {
    const p = spawn(process.execPath, ['_url_health_canary.js'], { cwd: 'C:/Users/koryj/website', stdio: 'inherit' });
    p.on('exit', (code) => res(code));
    p.on('error', () => res(-1));
  });
}
(async () => {
  console.log('[url-health] watchdog up, interval', INTERVAL / 60000, 'min');
  while (!fs.existsSync(STOP)) {
    const code = await runOnce();
    console.log('[url-health]', new Date().toISOString(), 'canary exit', code, code === 2 ? '🚨 ALERT (see _url_health_alert.json)' : '');
    const t = Date.now();
    while (Date.now() - t < INTERVAL && !fs.existsSync(STOP)) { await new Promise(r => setTimeout(r, 5000)); }
  }
  console.log('[url-health] stop flag seen, exiting');
})();
