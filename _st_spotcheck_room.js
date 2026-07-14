'use strict';
/**
 * ST spot-check room — 50 faces + 50 tops, SHOW AS SITE law.
 * Usage: node _st_spotcheck_room.js
 * Opens http://127.0.0.1:8921/
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { getStore } = require('@netlify/blobs');

const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const PORT = 8921;
const QA = path.join(WD, 'assets', 'qa');
const N = 50;

function faceOk(id) {
  try { return fs.statSync(path.join(QA, id + '.jpg')).size > 8000; } catch (e) { return false; }
}
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

(async () => {
  const mosaic = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-st.json'), 'utf8'));
  const ids = shuffle(mosaic.map((x) => x.id || x).filter(Boolean)).slice(0, N);
  const rows = [];
  let fail = 0;
  for (const id of ids) {
    const face = '/assets/qa/' + id + '.jpg';
    let blob = null;
    try { blob = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {}
    const q = String((blob && (blob.question || blob.title || blob.h1)) || id);
    const body = String((blob && (blob.answer || blob.body)) || '');
    const ms = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
    const topUrl = ms[0] ? ms[0][2].replace(/\?.*$/, '') : '';
    const img = String((blob && blob.img) || '').replace(/\?.*$/, '');
    const disk = faceOk(id);
    const topSame = topUrl === face || topUrl.endsWith('/' + id + '.jpg');
    const imgSame = img === face || img.endsWith('/' + id + '.jpg');
    const ok = disk && topSame && imgSame;
    if (!ok) fail++;
    rows.push({ id, q, face, topUrl: topUrl || face, disk, topSame, imgSame, ok });
  }
  fs.writeFileSync(path.join(WD, '_st_spotcheck_50.json'), JSON.stringify({
    at: new Date().toISOString(),
    n: rows.length,
    fail,
    pass: rows.length - fail,
    ids: rows.map((r) => r.id),
    rows,
  }, null, 1));

  const css = fs.readFileSync(path.join(WD, 'css', 'pulse-mosaic.css'), 'utf8');
  const cards = rows.map((r) => {
    const tip = String(r.q).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const badge = r.ok ? 'OK' : 'FIX';
    const bc = r.ok ? '#1a7f4b' : '#B91C3F';
    return `<div class="pair" data-ok="${r.ok ? 1 : 0}">
      <div class="mm" style="aspect-ratio:1/1">
        <img class="mm-img" src="${r.face}?t=${Date.now()}" alt="${tip}" loading="lazy">
        <div class="mm-scrim"></div>
        <span class="mm-cat">SALES TRAININGS · FACE</span>
        <h4>${tip}</h4>
      </div>
      <div class="mm" style="aspect-ratio:1/1">
        <img class="mm-img" src="${r.topUrl}?t=${Date.now()}" alt="${tip}" loading="lazy">
        <div class="mm-scrim"></div>
        <span class="mm-cat">SALES TRAININGS · TOP</span>
        <h4>${tip}</h4>
      </div>
      <div class="meta"><b>${r.id}</b> · <span style="color:${bc}">${badge}</span> · disk=${r.disk} topSame=${r.topSame} imgSame=${r.imgSame}</div>
    </div>`;
  }).join('\n');

  const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>ST spot-check · 50 face + 50 top</title>
<link rel="stylesheet" href="/css/pulse-mosaic.css">
<style>
body{margin:0;background:#1A0710;color:#F6C445;font-family:Georgia,serif}
header{padding:16px 20px;border-bottom:1px solid #333}
header b{color:#FFEB3B}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;padding:18px}
.pair{display:flex;flex-direction:column;gap:8px}
.mm{position:relative;overflow:hidden;border-radius:4px;background:#000;aspect-ratio:1/1}
.mm-img{width:100%;height:100%;object-fit:cover;display:block}
.mm-scrim{position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(transparent,#000c)}
.mm-cat{position:absolute;top:8px;left:8px;background:#000a;color:#FFE566;font:700 10px/1 system-ui;padding:4px 7px;border-radius:3px;letter-spacing:.04em}
.mm h4{position:absolute;left:10px;right:10px;bottom:10px;margin:0;color:#FFEB3B;font:800 14px/1.25 Georgia,serif}
.meta{font:12px/1.3 system-ui;color:#aaa}
.pass{color:#6BC88A}.fail{color:#f66}
</style>
<header>
  <div><b>ST spot-check</b> · ${rows.length} faces + ${rows.length} tops · SHOW AS SITE</div>
  <div class="${fail ? 'fail' : 'pass'}">auto: ${rows.length - fail}/${rows.length} pass · fail=${fail}</div>
  <div style="opacity:.7;font:12px system-ui;margin-top:6px">If this looks good → reply <b>pre-draft</b> (or I start draft if 0 fails).</div>
</header>
<div class="grid">${cards}</div>`;

  const server = http.createServer((req, res) => {
    const u = req.url.split('?')[0];
    if (u === '/' || u === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }
    if (u === '/css/pulse-mosaic.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      return res.end(css);
    }
    if (u.startsWith('/assets/qa/')) {
      const f = path.join(WD, u.replace(/\//g, path.sep).replace(/^[\\/]/, ''));
      // safer: map /assets/qa/x.jpg
      const name = path.basename(u);
      const fp = path.join(QA, name);
      if (!fp.startsWith(QA) || !fs.existsSync(fp)) {
        res.writeHead(404); return res.end('missing');
      }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
      return fs.createReadStream(fp).pipe(res);
    }
    res.writeHead(404); res.end('no');
  });
  server.listen(PORT, () => {
    console.log(JSON.stringify({
      ok: true,
      url: 'http://127.0.0.1:' + PORT + '/',
      lan: 'http://192.168.5.68:' + PORT + '/',
      pass: rows.length - fail,
      fail,
      n: rows.length,
    }));
  });
})().catch((e) => { console.error(e); process.exit(1); });
