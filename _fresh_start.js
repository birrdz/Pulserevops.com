// _fresh_start.js — a clean, blank localhost, ready for a brand-new tool. Nothing else wired in.
'use strict';
const http = require('http');
const PORT = parseInt(process.env.FRESH_PORT || '9500', 10);
http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end('<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Fresh Start</title>'
    + '<body style="margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center">'
    + '<div style="max-width:520px;padding:24px"><div style="font-size:56px">🆕</div>'
    + '<h1 style="color:#6bbf3a;margin:8px 0 4px">Clean localhost — ready</h1>'
    + '<p style="color:#9aa2ad;font-size:15px">http://localhost:' + PORT + '/ · blank slate · nothing wired in but this page.</p>'
    + '<p style="color:#7a828c;font-size:13px;margin-top:18px">Tell Claude exactly what you want built here and it goes on this fresh server — clean, no old code.</p></div>');
}).listen(PORT, () => console.log('[fresh] http://localhost:' + PORT + '/'));
