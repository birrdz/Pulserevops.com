// lib_builder.js — INDEPENDENT "yes/no" library builder. Port 7804.
// Shows one generic BUSINESS Pexels image at a time. YES downloads the full-res image into your
// local library; NO skips. Counter climbs to your target (1000). Touches nothing else — its own
// server, its own folder. This builds a LIBRARY of candidate images; it never places an image on
// any face card / answer page (that stays manual in the picker).
//   reads  .env.local            (PEXELS_API_KEY only — value never logged)
//   writes new/imagebank/approved/*.jpg   (the images you approve)

'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const PORT = 7804;
const BUILD_DIR = path.join(WD, 'new', 'imagebank', 'approved');
try { fs.mkdirSync(BUILD_DIR, { recursive: true }); } catch (e) {}

const errlog = m => { try { fs.appendFileSync(path.join(WD, 'new', '_lib_builder_err.log'), new Date().toISOString() + ' ' + m + '\n'); } catch (_) {} };
process.on('uncaughtException', e => errlog((e && e.stack) || e));
process.on('unhandledRejection', e => errlog('UR ' + e));

try {
  for (const line of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split('\n')) {
    const s = line.trim(); if (!s || s[0] === '#') continue;
    const i = s.indexOf('='); if (i < 0) continue;
    const k = s.slice(0, i).trim(); let v = s.slice(i + 1).trim();
    if ((v[0] === '"' && v.slice(-1) === '"') || (v[0] === "'" && v.slice(-1) === "'")) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
} catch (e) {}
const PEXELS = process.env.PEXELS_API_KEY || '';

const QUERIES = ['business meeting', 'modern office', 'corporate team', 'business handshake', 'professional workspace',
  'startup team', 'business conference', 'office laptop work', 'business people talking', 'coworking space',
  'executive boardroom', 'sales presentation', 'business strategy whiteboard', 'team collaboration', 'business woman office',
  'business man suit', 'office building exterior', 'business technology', 'finance charts desk', 'customer meeting',
  'business travel airport', 'remote work laptop', 'business networking event', 'office desk workspace', 'business growth chart'];

function pexSearch(q, page) {
  return new Promise(res => {
    if (!PEXELS) return res(null);
    https.get('https://api.pexels.com/v1/search?per_page=20&orientation=landscape&page=' + (page || 1) + '&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS } }, r => {
      let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } });
    }).on('error', () => res(null));
  });
}
function download(url, dest) {
  return new Promise((res) => {
    const f = fs.createWriteStream(dest);
    https.get(url, r => { if (r.statusCode !== 200) { f.close(); try { fs.unlinkSync(dest); } catch (_) {} return res(false); } r.pipe(f); f.on('finish', () => f.close(() => res(true))); }).on('error', () => { try { fs.unlinkSync(dest); } catch (_) {} res(false); });
  });
}
function kept() { try { return fs.readdirSync(BUILD_DIR).filter(f => /\.jpe?g$/i.test(f)).length; } catch (e) { return 0; } }
function body(req) { return new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); }); }
function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
let servedPage = 1;

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Library Builder</title>
<style>
body{margin:0;background:#0a0f14;color:#eaf4ff;font-family:system-ui,Segoe UI,Arial;padding:18px;text-align:center}
h1{font-size:19px;margin:0 0 4px;color:#5fd4ff}
.sub{color:#7fa8c0;font-size:13px;margin-bottom:14px}
.stage{max-width:760px;margin:0 auto}
.imgwrap{background:#0f1620;border:1px solid #24425a;border-radius:16px;overflow:hidden;min-height:300px;display:flex;align-items:center;justify-content:center}
.imgwrap img{width:100%;height:auto;max-height:62vh;object-fit:contain;display:block}
.alt{color:#7fa8c0;font-size:13px;margin:10px 0 4px;min-height:18px}
.btns{display:flex;gap:16px;justify-content:center;margin-top:14px}
button{border:0;border-radius:14px;padding:18px 0;font-size:22px;font-weight:800;cursor:pointer;flex:1;max-width:240px}
.no{background:#3a1414;color:#ff9c9c;border:1px solid #7a2a2a}
.yes{background:#123a1f;color:#8fffb0;border:1px solid #2a7a45}
.bar{margin-top:16px;font-size:14px;color:#7fa8c0}
.big{font-size:26px;color:#5fd4ff;font-weight:800}
.prog{height:8px;background:#12202c;border-radius:99px;overflow:hidden;margin:10px auto;max-width:760px}
.prog>i{display:block;height:100%;background:#2a9adf;width:0}
kbd{background:#12202c;border:1px solid #24425a;border-radius:5px;padding:1px 6px;font-size:12px}
</style>
<h1>🗂️ Library Builder <span style="font-size:12px;color:#4a6a80">independent · port 7804 · downloads to new/imagebank/approved</span></h1>
<div class=sub>Generic business images. <b style="color:#8fffb0">YES</b> saves it to your library, <b style="color:#ff9c9c">NO</b> skips. Goal: <b id=goaln>1000</b>. Keys: <kbd>&larr;</kbd> no · <kbd>&rarr;</kbd> yes</div>
<div class=prog><i id=prog></i></div>
<div class=stage>
  <div class=imgwrap id=wrap><div style="color:#4a6a80">loading&hellip;</div></div>
  <div class=alt id=alt></div>
  <div class=btns><button class=no onclick=vote(false)>✕ NO</button><button class=yes onclick=vote(true)>✓ YES</button></div>
  <div class=bar>saved: <span class=big id=count>0</span> / <span id=goal>1000</span> &nbsp; · &nbsp; <span id=seen>0</span> seen</div>
</div>
<script>
var CUR=null,seen=0,GOAL=1000;
async function next(){
  document.getElementById('wrap').innerHTML='<div style="color:#4a6a80">loading next...</div>';
  document.getElementById('alt').textContent='';
  var d=await (await fetch('/api/next')).json();
  CUR=d;
  if(!d||!d.full){document.getElementById('wrap').innerHTML='<div style="color:#ff9c9c;padding:30px">no image (Pexels quota?) - try again in a moment</div>';return;}
  var img=new Image();img.onload=function(){document.getElementById('wrap').innerHTML='';document.getElementById('wrap').appendChild(img);};img.src=d.thumb;
  document.getElementById('alt').textContent=(d.alt||'')+'   ['+d.query+']';
}
async function vote(yes){
  seen++;document.getElementById('seen').textContent=seen;
  if(yes&&CUR){
    try{var r=await (await fetch('/api/keep',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:CUR.id,full:CUR.full,alt:CUR.alt,query:CUR.query})})).json();
      document.getElementById('count').textContent=r.count;
      document.getElementById('prog').style.width=Math.min(100,r.count/GOAL*100)+'%';
      if(r.count>=GOAL){document.getElementById('wrap').innerHTML='<div style="color:#8fffb0;padding:40px;font-size:24px;font-weight:800">🎉 '+r.count+' saved - goal reached!</div>';return;}
    }catch(e){}
  }
  next();
}
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight')vote(true);if(e.key==='ArrowLeft')vote(false);});
async function loadCount(){try{var s=await (await fetch('/api/stats')).json();document.getElementById('count').textContent=s.count;document.getElementById('prog').style.width=Math.min(100,s.count/GOAL*100)+'%';}catch(e){}}
loadCount();next();
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0];
  const send = (code, ct, data) => { res.writeHead(code, { 'content-type': ct }); res.end(data); };
  try {
    if (u === '/' || u === '/index.html') return send(200, 'text/html; charset=utf-8', PAGE);
    if (u === '/api/stats') return send(200, 'application/json', JSON.stringify({ count: kept(), pexels: !!PEXELS }));
    if (u === '/api/next') {
      const q = rnd(QUERIES);
      let r = await pexSearch(q, 1 + Math.floor(Math.random() * 25));
      let photos = (r && r.photos) || [];
      if (!photos.length) { r = await pexSearch(q, 1); photos = (r && r.photos) || []; }
      if (!photos.length) return send(200, 'application/json', JSON.stringify({}));
      const p = rnd(photos);
      return send(200, 'application/json', JSON.stringify({ id: 'px' + p.id, thumb: p.src.large || p.src.medium, full: p.src.large2x || p.src.original || p.src.large, alt: p.alt || '', query: q }));
    }
    if (u === '/api/keep' && req.method === 'POST') {
      const b = await body(req);
      const id = String(b.id || ('img' + Date.now())).replace(/[^a-z0-9]/gi, '');
      const dest = path.join(BUILD_DIR, id + '.jpg');
      let ok = true;
      if (!fs.existsSync(dest)) ok = await download(String(b.full || ''), dest);
      return send(200, 'application/json', JSON.stringify({ ok, count: kept() }));
    }
    send(404, 'text/plain', 'not found');
  } catch (e) { errlog('req ' + e); send(500, 'text/plain', 'err'); }
}).listen(PORT, () => console.log('Library Builder :' + PORT + ' pexels=' + (!!PEXELS) + ' dir=' + BUILD_DIR + ' have=' + kept()));
