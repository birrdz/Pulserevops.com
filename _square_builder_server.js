'use strict';

const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = process.env.PULSE_ROOT || __dirname;
const PORT = Math.max(1, parseInt(process.env.SQUARE_BUILDER_PORT || '8900', 10));
const BACKEND_PORT = Math.max(1, parseInt(process.env.SCRUB_BTN_PORT || '8899', 10));
let backendChild = null;

function backendReady() {
  return new Promise(resolve => {
    const req = http.get({ hostname: '127.0.0.1', port: BACKEND_PORT, path: '/square-builder', timeout: 1000 }, res => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

async function ensureBackend() {
  if (await backendReady()) return true;
  backendChild = spawn(process.execPath, [path.join(ROOT, '_scrub_button_server.js')], {
    cwd: ROOT,
    env: Object.assign({}, process.env, { PULSE_ROOT: ROOT, SCRUB_BTN_PORT: String(BACKEND_PORT) }),
    stdio: 'inherit',
    windowsHide: false,
  });
  backendChild.on('exit', code => {
    if (code && code !== 0) console.error('[square-builder] backend exited with code ' + code);
    backendChild = null;
  });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await backendReady()) return true;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

function proxy(req, res) {
  const targetPath = req.url === '/' ? '/square-builder' : req.url;
  const upstream = http.request({
    hostname: '127.0.0.1',
    port: BACKEND_PORT,
    path: targetPath,
    method: req.method,
    headers: Object.assign({}, req.headers, { host: '127.0.0.1:' + BACKEND_PORT }),
  }, upstreamRes => {
    res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
    upstreamRes.pipe(res);
  });
  upstream.on('error', () => {
    if (res.headersSent) return res.end();
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '2' });
    res.end('<!doctype html><meta http-equiv="refresh" content="2"><title>Square Builder</title><p>Square Builder is starting…</p>');
  });
  req.pipe(upstream);
}

(async () => {
  const ready = await ensureBackend();
  if (!ready) throw new Error('internal builder backend did not start on port ' + BACKEND_PORT);
  const server = http.createServer(proxy);
  server.on('error', error => {
    if (error && error.code === 'EADDRINUSE') console.error('[square-builder] port ' + PORT + ' is already in use');
    else console.error('[square-builder]', error && error.message);
    process.exit(1);
  });
  server.listen(PORT, '127.0.0.1', () => {
    console.log('[square-builder] ready at http://localhost:' + PORT + '/');
  });
  const close = () => {
    if (backendChild && !backendChild.killed) backendChild.kill();
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
})().catch(error => {
  console.error('[square-builder] fatal:', error.message);
  process.exit(1);
});
