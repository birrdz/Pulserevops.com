'use strict';
/** Restart panel with windowsHide; no CMD flash. */
const { execSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';

try {
  const out = execSync('netstat -ano | findstr :8904', { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    const m = line.trim().match(/\s(\d+)\s*$/);
    if (m && m[1] !== '0') pids.add(m[1]);
  }
  for (const pid of pids) {
    try { execSync('taskkill /PID ' + pid + ' /F', { stdio: 'ignore' }); } catch (e) {}
  }
} catch (e) {}

// clear STOP from stuck scan
try { fs.unlinkSync(path.join(WD, 'sim', 'STOP.flag')); } catch (e) {}
const st = path.join(WD, 'sim', 'run_status.json');
fs.writeFileSync(st, JSON.stringify({
  stage: 'idle', phase: 'idle',
  note: 'Panel restarted · windowsHide · NEXT 30 ready · sim→quality→image→title→13/13',
  updated: new Date().toISOString(),
}, null, 1));

setTimeout(() => {
  const p = spawn(process.execPath, [path.join(WD, 'dashboard_server.js')], {
    cwd: WD,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  p.unref();
  console.log(JSON.stringify({ ok: true, pid: p.pid, url: 'http://127.0.0.1:8904/full' }));
  setTimeout(() => {
    http.get('http://127.0.0.1:8904/', (r) => console.log('panel', r.statusCode)).on('error', (e) => console.log('panel_err', e.message));
  }, 1200);
}, 600);
