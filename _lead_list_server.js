// _lead_list_server.js — local CRO Lead List viewer (owner 2026-07-17).
// Reads cro-leads/ from the live blob and shows them in a table. Read-only. Port LEADS_PORT (default 9099).
'use strict';
const http = require('http');
const fs = require('fs');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
function store() { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); }
const PORT = parseInt(process.env.LEADS_PORT || '9099', 10);
const esc = s => String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

async function leads() {
  const s = store(); let list; try { list = await s.list({ prefix: 'cro-leads/' }); } catch (e) { return []; }
  const out = [];
  for (const b of (list.blobs || [])) { try { const d = await s.get(b.key, { type: 'json' }); if (d) out.push(d); } catch (e) {} }
  out.sort((a, b) => (b.ts || 0) - (a.ts || 0)); return out;
}

http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/leads') { const d = await leads(); res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(d)); }
    const rows = await leads();
    const trs = rows.map(d => {
      const when = d.ts ? new Date(d.ts).toLocaleString() : '';
      const via = d.ref || d.hdrRef || '(direct / unknown)';
      const viaHtml = /^https?:\/\//i.test(via) ? ('<a href="' + esc(via) + '" target=_blank>' + esc(via) + '</a>') : esc(via);
      return '<tr><td style="white-space:nowrap">' + esc(when) + '</td><td><b>' + esc(d.name || '—') + '</b></td><td>' + (d.email ? '<a href="mailto:' + esc(d.email) + '">' + esc(d.email) + '</a>' : '') + '</td><td style="white-space:nowrap">' + esc(d.phone || '') + '</td><td>' + esc(d.company || '') + '</td><td>' + esc(d.page || '') + '</td><td>' + viaHtml + (d.utm ? '<br><span style="color:#b89a55;font-size:12px">' + esc(d.utm) + '</span>' : '') + '</td><td style="max-width:360px;white-space:pre-wrap;font-size:13px;color:#d8cbb0">' + esc((d.message || '').slice(0, 700)) + '</td></tr>';
    }).join('');
    const html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>CRO Lead List</title>'
      + '<style>body{margin:0;background:#15110d;color:#f3e7c9;font-family:system-ui,Arial;padding:18px}h1{color:#d4af37;margin:0 0 4px;font-size:22px}.sub{color:#c9a45a;margin-bottom:14px;font-size:14px}table{width:100%;border-collapse:collapse;background:#1e1913;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4)}th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #3a2f22;vertical-align:top;font-size:14px}th{background:#2a2016;color:#e8c874}tr:hover td{background:#241d15}a{color:#e8b84a}.empty{padding:40px;text-align:center;color:#c9a45a}</style>'
      + '<h1>📇 CRO Lead List</h1><div class=sub>' + rows.length + ' leads · newest first · reads the live blob · <a href="javascript:location.reload()">↻ refresh</a></div>'
      + (rows.length ? ('<table><thead><tr><th>When</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Page</th><th>How they found us</th><th>Details</th></tr></thead><tbody>' + trs + '</tbody></table>')
        : '<div class=empty>No leads yet — they show up here the moment someone submits the revenue-checkup / CRO form.</div>');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
  } catch (e) { res.writeHead(500); res.end('err: ' + (e && e.message || e)); }
}).listen(PORT, () => console.log('[lead-list] http://localhost:' + PORT + '/'));
