'use strict';

const http = require('http');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = process.env.PULSE_ROOT || __dirname;
const PORT = Math.max(1, parseInt(process.env.SQUARE_BUILDER_PORT || '8900', 10));
const BACKEND_PORT = Math.max(1, parseInt(process.env.SCRUB_BTN_PORT || '8899', 10));
let backendChild = null;

function lanAddress() {
  const addresses = Object.values(os.networkInterfaces()).flat();
  const hit = addresses.find(item => item && item.family === 'IPv4' && !item.internal && /^(?:192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(item.address));
  return hit ? hit.address : '';
}

function dashboardHtml() {
  const lan = lanAddress();
  const localUrl = 'http://localhost:' + PORT + '/';
  const lanUrl = lan ? 'http://' + lan + ':' + PORT + '/' : '';
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>PULSE Square Builder</title><style>*{box-sizing:border-box}html,body{margin:0;height:100%;background:#090d12;color:#fff;font-family:Inter,system-ui,sans-serif}' +
    '.bar{height:52px;display:flex;align-items:center;gap:14px;padding:8px 16px;background:#100916;border-bottom:2px solid #a855f7;white-space:nowrap;overflow:auto}' +
    '.bar b{color:#e879f9}.bar a{color:#fff;background:#6b21a8;border-radius:18px;padding:7px 13px;text-decoration:none;font-weight:800}.bar span{color:#9ca3af;font-size:12px}' +
    'iframe{display:block;width:100%;height:calc(100% - 52px);border:0;background:#0b0f14}</style></head><body>' +
    '<div class="bar"><b>◻️ Square Builder</b><a href="/app">Open dashboard</a><span>Local: ' + localUrl + '</span>' +
    (lanUrl ? '<a href="' + lanUrl + '">LAN: ' + lanUrl + '</a>' : '<span>LAN address unavailable</span>') +
    '</div><iframe src="/app" title="Square Builder dashboard"></iframe></body></html>';
}

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
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(dashboardHtml());
  }
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ ok: true, port: PORT, lan: lanAddress() || null }));
  }
  if (req.url === '/portal-url' && req.method === 'GET') {
    const lan = lanAddress();
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ ok: true, localhost: 'http://localhost:' + PORT + '/', lan: lan ? 'http://' + lan + ':' + PORT + '/' : null }));
  }
  const targetPath = req.url === '/app' ? '/square-builder' : req.url;
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
  server.listen(PORT, '0.0.0.0', () => {
    console.log('[square-builder] ready at http://localhost:' + PORT + '/');
    const lan = lanAddress();
    if (lan) console.log('[square-builder] LAN dashboard at http://' + lan + ':' + PORT + '/');
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
