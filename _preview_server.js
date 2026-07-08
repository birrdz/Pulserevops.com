// tiny local static server for previewing the built pages (root-relative paths resolve)
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 8790;
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.ico':'image/x-icon', '.json':'application/json' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const fp = path.join(ROOT, p);
  fs.readFile(fp, (err, buf) => {
    if (err) { res.writeHead(404); res.end('404 ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, '0.0.0.0', () => console.log('preview on http://192.168.5.57:' + PORT + '/  (LAN — reachable from phone on home WiFi)'));
