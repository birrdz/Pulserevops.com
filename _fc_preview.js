// minimal static file server for local preview of the website dir. Stop: Ctrl-C / kill.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = 'C:/Users/koryj/website';
const PORT = 8124;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.ico': 'image/x-icon', '.webp': 'image/webp' };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  let f = path.join(ROOT, u);
  // pretty fish-and-crabs routes → .html
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); res.end('404: ' + u); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('preview on http://localhost:' + PORT + '/'));
