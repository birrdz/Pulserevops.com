'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = 8920;
const LIVE = 'https://pulserevops.com';
const CT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff2': 'font/woff2'
};
function proxy(req, res) {
  const url = LIVE + req.url;
  https.get(url, { headers: { 'User-Agent': 'pulse-preview' } }, (up) => {
    res.writeHead(up.statusCode || 502, {
      'Content-Type': up.headers['content-type'] || 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    });
    up.pipe(res);
  }).on('error', () => { res.writeHead(502); res.end('proxy fail'); });
}
http.createServer((req, res) => {
  if ((req.url || '').indexOf('/.netlify/functions/') === 0) return proxy(req, res);
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u === '/') u = '/index.html';
  if (u === '/search') u = '/search.html';
  const f = path.normalize(path.join(ROOT, u.replace(/^\//, '')));
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(f, (err, buf) => {
    if (err) {
      if (u.indexOf('/assets/') === 0 || u.indexOf('/mosaic-pool') === 0) return proxy(req, res);
      res.writeHead(404); return res.end('404 ' + u);
    }
    res.writeHead(200, { 'Content-Type': CT[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log('[preview] http://localhost:' + PORT + '/');
  console.log('[preview] phone  http://192.168.5.68:' + PORT + '/');
  console.log('[preview] search http://localhost:' + PORT + '/search');
});
