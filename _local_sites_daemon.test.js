'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-local-sites-'));
const daemon = path.join(__dirname, '_local_sites_daemon.js');
const manager = path.join(root, 'pulse_machines_manager.js');
fs.writeFileSync(manager, `
  const http = require('http');
  const PORT = 7950;
  http.createServer((req, res) => { res.writeHead(200); res.end('PULSE Machines'); })
    .listen(PORT, '127.0.0.1');
`);
fs.writeFileSync(path.join(root, 'local-sites.json'), JSON.stringify([
  { id: 'machines-manager', name: 'PULSE Machines', port: 7950, required: true, discover: true },
]));

function get(port, pathname = '/') {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: pathname, timeout: 1000 }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ code: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

async function waitFor(fn, timeout = 10000) {
  const end = Date.now() + timeout;
  let error;
  while (Date.now() < end) {
    try { return await fn(); } catch (e) { error = e; }
    await new Promise(r => setTimeout(r, 200));
  }
  throw error || new Error('timed out');
}

(async () => {
  const child = spawn(process.execPath, [daemon], {
    cwd: root,
    env: {
      ...process.env,
      LOCAL_SITES_ROOT: root,
      LOCAL_SITES_DAEMON_PORT: '17959',
      LOCAL_SITES_INTERVAL_MS: '3000',
    },
    stdio: 'ignore',
  });
  let managerPid;
  try {
    await waitFor(async () => {
      const response = await get(17959, '/api/status');
      const status = JSON.parse(response.body);
      const service = status.services[0];
      if (service.status !== 'up') throw new Error(`manager is ${service.status}`);
      managerPid = service.pid;
      return service;
    });
    const managerResponse = await get(7950);
    assert.strictEqual(managerResponse.code, 200);
    assert.strictEqual(managerResponse.body, 'PULSE Machines');
    console.log('local-sites daemon integration test passed');
  } finally {
    child.kill('SIGTERM');
    if (managerPid) {
      try { process.kill(managerPid, 'SIGTERM'); } catch (_) {}
    }
    fs.rmSync(root, { recursive: true, force: true });
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
