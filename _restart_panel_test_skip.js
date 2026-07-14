'use strict';
const { execSync, spawn } = require('child_process');
const http = require('http');
try {
  const out = execSync('netstat -ano | findstr :8904', { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    const m = line.trim().match(/\s(\d+)\s*$/);
    if (m && m[1] !== '0') pids.add(m[1]);
  }
  for (const pid of pids) {
    try { execSync('taskkill /PID ' + pid + ' /F', { stdio: 'ignore' }); console.log('killed', pid); } catch (e) {}
  }
} catch (e) { console.log('no listeners or netstat fail'); }
setTimeout(() => {
  const p = spawn('node', ['dashboard_server.js'], {
    cwd: 'C:/Users/koryj/website',
    detached: true,
    stdio: 'ignore',
  });
  p.unref();
  console.log('spawned', p.pid);
  setTimeout(() => {
    const data = JSON.stringify({ action: 'skip' });
    const req = http.request({
      hostname: '127.0.0.1', port: 8904, path: '/api/next30', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let b = '';
      res.on('data', (c) => b += c);
      res.on('end', () => {
        console.log('status', res.statusCode);
        console.log(b.slice(0, 300));
      });
    });
    req.on('error', (e) => console.log('err', e.message));
    req.write(data);
    req.end();
  }, 1500);
}, 800);
