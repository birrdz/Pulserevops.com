'use strict';
// Build + serve GTM approved gallery: image + title for each ✓
const fs = require('fs');
const http = require('http');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const PORT = 8915;
const QA = path.join(WD, 'assets', 'qa');
const STATE = path.join(WD, '_gp_topic_review_state.json');

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

(async () => {
  const st = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  const ids = Object.keys(st.approved || {}).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = {};
  for (const e of (idx && idx.entries) || []) {
    if (e && e.id) byId[e.id] = e;
  }
  const rows = ids.map((id) => {
    const e = byId[id] || {};
    const title = e.question || e.title || e.h1 || id;
    const meta = st.approved[id] || {};
    const face = path.join(QA, id + '.jpg');
    const ok = fs.existsSync(face) && fs.statSync(face).size > 5000;
    return { id, title, query: meta.query || '', mode: meta.mode || '', ok };
  });
  const html = `<!doctype html><html><head><meta charset=utf-8>
<title>GTM approved — ${rows.length}</title>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#111;color:#eee;font-family:Georgia,serif}
h1{margin:0;padding:18px 20px 6px;font-size:28px;font-weight:700;letter-spacing:.02em}
.sub{padding:0 20px 16px;color:#aaa;font-size:14px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;padding:12px 16px 40px}
figure{margin:0;background:#1a1a1a;border:1px solid #333;overflow:hidden}
img{width:100%;aspect-ratio:16/10;object-fit:contain;background:#000;display:block}
figcaption{padding:10px 12px 14px}
.id{font:12px/1.2 ui-monospace,Consolas,monospace;color:#EAC15C;margin-bottom:6px}
.tt{font-size:14px;line-height:1.35;color:#f2f2f2}
.q{margin-top:6px;font-size:11px;color:#888}
.miss{color:#f66}
</style></head><body>
<h1>GTM approved · ${rows.length}</h1>
<p class=sub>Face card + title for every ✓ — scroll all in one page.</p>
<div class=g>
${rows.map((r) => `<figure>
  ${r.ok ? `<img loading=lazy src="/img/${r.id}.jpg" alt="">` : `<div class=miss style="padding:40px 12px;text-align:center">missing file</div>`}
  <figcaption><div class=id>${esc(r.id)}</div><div class=tt>${esc(r.title)}</div>${r.query ? `<div class=q>${esc(r.query)}</div>` : ''}</figcaption>
</figure>`).join('\n')}
</div></body></html>`;

  http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname === '/' || u.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(html);
    }
    const m = u.pathname.match(/^\/img\/(gp\d+)\.jpg$/i);
    if (m) {
      const f = path.join(QA, m[1].toLowerCase() + '.jpg');
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing'); }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
      return fs.createReadStream(f).pipe(res);
    }
    res.writeHead(404); res.end('not found');
  }).listen(PORT, '127.0.0.1', () => {
    console.log('[gp-approved] http://127.0.0.1:' + PORT + '/  · ' + rows.length + ' images+titles');
  });
})().catch((e) => { console.error(e); process.exit(1); });
