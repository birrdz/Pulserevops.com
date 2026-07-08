// Tiny static server for the live SEO dashboard. Serves _seo_audit/ with dashboard.html
// as the index. Read-only, localhost. Stop: _pulse_spider_stop.flag not used here — just kill.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve('C:/Users/koryj/website/_seo_audit');
const PORT = parseInt(process.env.DASH_PORT || '8899', 10);
const MIME = { '.html': 'text/html', '.json': 'application/json', '.jsonl': 'text/plain', '.csv': 'text/csv', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u === '/' || u === '') u = '/dashboard.html';
  const f = path.resolve(ROOT, '.' + (u.startsWith('/') ? u : '/' + u));
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
    res.end(d);
  });
}).listen(PORT, () => console.log('SEO dashboard on http://localhost:' + PORT + '/'));
