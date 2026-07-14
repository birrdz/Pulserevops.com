'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve('C:/Users/koryj/website/_mockups_gtm_title');
const PORT = 8911;
const TYPES = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css' };
http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u === '/') u = '/index.html';
  const f = path.normalize(path.join(ROOT, u.replace(/^\/+/, '')));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, '0.0.0.0', () => console.log('[mockups] http://localhost:' + PORT + '/  ·  http://192.168.5.68:' + PORT + '/'));
