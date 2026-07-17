// taste_trainer.js — FULLY INDEPENDENT image-taste trainer. Port 7803.
// Does NOT import/read/write anything the picker/POA/publish use. Its files:
//   reads  new/_train_titles.json          (titles to train on)
//   reads  .env.local                      (only to get PEXELS_API_KEY — value never logged)
//   writes new/_taste_log.json             (your picks: title + chosen image alt + passed ones)
//   reads  new/imagebank/cro/*, assets/qa/_pexels_stored/*  (fallback candidates, read-only)
// Worst case: close the tab. Nothing else is touched. No placement, no publish, no POA.
//
// GOAL: it shows a real title + 10 RELEVANT Pexels images (with alt-text). You tap the one you
// would use. After ~100 picks, the log holds enough signal to learn the kind of image you choose
// for each kind of title — so the picker can later rank your favorites first. You only ever click.

'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const PORT = parseInt(process.env.TASTE_PORT || '7803', 10);
const TITLES_F = path.join(WD, 'new', '_train_titles.json');
const LOG_F = path.join(WD, 'new', '_taste_log.json');
const LIBS = { cro: path.join(WD, 'new', 'imagebank', 'cro'), pex: path.join(WD, 'assets', 'qa', '_pexels_stored') };

const errlog = m => { try { fs.appendFileSync(path.join(WD, 'new', '_taste_trainer_err.log'), new Date().toISOString() + ' ' + m + '\n'); } catch (_) {} };
process.on('uncaughtException', e => errlog((e && e.stack) || e));
process.on('unhandledRejection', e => errlog('UR ' + e));

// Self-contained .env.local loader (only to read PEXELS_API_KEY — never logged or exposed).
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

let TITLES = [];
try { TITLES = JSON.parse(fs.readFileSync(TITLES_F, 'utf8')); } catch (e) { TITLES = ['How to build a sales pipeline', 'Best CRM for small teams']; }

function libFiles() { let a = []; for (const k of Object.keys(LIBS)) { try { a = a.concat(fs.readdirSync(LIBS[k]).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).map(f => k + '/' + f)); } catch (e) {} } return a; }
const ALL = libFiles();
function sample(arr, n) { const c = arr.slice(); const out = []; while (out.length < n && c.length) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return out; }
function logCount() { try { return JSON.parse(fs.readFileSync(LOG_F, 'utf8')).length; } catch (e) { return 0; } }
function body(req) { return new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); }); }

function pexSearch(q) {
  return new Promise(res => {
    if (!PEXELS) return res(null);
    https.get('https://api.pexels.com/v1/search?per_page=15&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => {
      let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } });
    }).on('error', () => res(null));
  });
}
function keywords(title) { return String(title).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['what', 'best', 'need', 'your', 'this', 'that', 'with', 'from', 'have'].includes(w)).slice(0, 3).join(' ') || 'business office'; }

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Taste Trainer</title>
<style>
body{margin:0;background:#0c0a12;color:#f3eefb;font-family:system-ui,Segoe UI,Arial;padding:18px}
h1{font-size:19px;margin:0 0 4px;color:#c9a6ff}
.sub{color:#9a86c0;font-size:13px;margin-bottom:14px}
.title{background:#1a1330;border:1px solid #6b4fd0;border-radius:14px;padding:20px;font-size:26px;font-weight:800;color:#fff;margin-bottom:6px;line-height:1.25}
.hint{color:#b9a6e6;font-size:14px;margin:8px 0 16px}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.card{aspect-ratio:1/1;border-radius:12px;overflow:hidden;border:2px solid #2a2140;cursor:pointer;background:#181228;transition:transform .08s,border-color .12s;position:relative}
.card:hover{border-color:#c9a6ff;transform:scale(1.03)}
.card img{width:100%;height:100%;object-fit:cover;display:block}
.bar{display:flex;justify-content:space-between;align-items:center;margin-top:16px;font-size:14px;color:#b9a6e6}
button{background:#2a2140;color:#e9defb;border:1px solid #6b4fd0;border-radius:9px;padding:8px 14px;font-size:13px;cursor:pointer}
.big{font-size:22px;color:#c9a6ff;font-weight:800}
.src{font-size:12px;color:#7a6aa0;margin-left:8px}
@media(max-width:700px){.grid{grid-template-columns:repeat(2,1fr)}}
</style>
<h1>🎨 Taste Trainer <span class=src>independent · port 7803 · touches nothing else</span></h1>
<div class=sub>Pick the image you would use for this title. It logs your choice + the ones you passed, and learns your eye. You are only clicking &mdash; nothing is placed or published.</div>
<div class=title id=title>loading&hellip;</div>
<div class=hint>👇 tap the one you would use <span id=srcnote class=src></span></div>
<div class=grid id=grid></div>
<div class=bar><div>trained: <span class=big id=count>0</span> picks &nbsp; <span class=src id=goal>(aim for ~100)</span></div><div><button onclick=skip()>none fit &mdash; skip &rarr;</button></div></div>
<script>
var CUR=null;
async function next(){
  document.getElementById('title').textContent='loading next title...';
  document.getElementById('grid').innerHTML='';
  var d=await (await fetch('/api/next')).json();
  CUR=d;
  document.getElementById('title').textContent=d.title;
  document.getElementById('srcnote').textContent=d.src==='pexels'?('(Pexels: '+d.query+')'):'(local library)';
  var g=document.getElementById('grid');g.innerHTML='';
  d.images.forEach(function(im,idx){
    var c=document.createElement('div');c.className='card';c.title=im.alt||'';
    c.onclick=function(){pick(idx);};
    var img=document.createElement('img');img.src=im.thumb;img.loading='lazy';
    c.appendChild(img);g.appendChild(c);
  });
}
async function pick(idx){
  var im=CUR.images[idx];
  try{
    var r=await (await fetch('/api/pick',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:CUR.title,query:CUR.query,src:CUR.src,picked:{id:im.id,alt:im.alt,full:im.full,src:im.src},shown:CUR.images.map(function(x){return {id:x.id,alt:x.alt};})})})).json();
    document.getElementById('count').textContent=r.count;
  }catch(e){}
  next();
}
async function skip(){next();}
async function loadCount(){try{var s=await (await fetch('/api/stats')).json();document.getElementById('count').textContent=s.count;}catch(e){}}
loadCount();next();
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0];
  const send = (code, ct, data) => { res.writeHead(code, { 'content-type': ct }); res.end(data); };
  try {
    if (u === '/' || u === '/index.html') return send(200, 'text/html; charset=utf-8', PAGE);
    if (u === '/api/next') {
      const title = TITLES[Math.floor(Math.random() * TITLES.length)] || 'business tool';
      const kw = keywords(title);
      let images = [], src = 'lib';
      const r = await pexSearch(kw);
      if (r && r.photos && r.photos.length) {
        src = 'pexels';
        images = r.photos.slice(0, 10).map(p => ({ id: 'px' + p.id, thumb: p.src.medium, full: p.src.large2x || p.src.large || p.src.original, alt: p.alt || '', src: 'pexels' }));
      }
      if (!images.length) images = sample(ALL, 10).map(f => ({ id: f, thumb: '/img?f=' + encodeURIComponent(f), full: '/img?f=' + encodeURIComponent(f), alt: '', src: 'lib' }));
      return send(200, 'application/json', JSON.stringify({ title, query: kw, src, images }));
    }
    if (u === '/api/stats') return send(200, 'application/json', JSON.stringify({ count: logCount(), pexels: !!PEXELS }));
    if (u === '/api/pick' && req.method === 'POST') {
      const b = await body(req);
      let arr = []; try { arr = JSON.parse(fs.readFileSync(LOG_F, 'utf8')); } catch (e) {}
      arr.push({ ts: new Date().toISOString(), title: b.title || '', query: b.query || '', src: b.src || '', picked: b.picked || {}, shown: b.shown || [] });
      try { fs.writeFileSync(LOG_F, JSON.stringify(arr)); } catch (e) {}
      return send(200, 'application/json', JSON.stringify({ ok: true, count: arr.length }));
    }
    if (u === '/img') {
      const f = decodeURIComponent((req.url.split('f=')[1] || '').split('&')[0]);
      const parts = f.split('/'); const dir = LIBS[parts[0]];
      if (!dir || parts.length !== 2 || /\.\./.test(f)) return send(404, 'text/plain', 'no');
      try { return send(200, 'image/jpeg', fs.readFileSync(path.join(dir, parts[1]))); } catch (e) { return send(404, 'text/plain', 'no'); }
    }
    send(404, 'text/plain', 'not found');
  } catch (e) { errlog('req ' + e); send(500, 'text/plain', 'err'); }
}).listen(PORT, () => console.log('Taste Trainer :' + PORT + ' — pexels=' + (!!PEXELS) + ' titles=' + TITLES.length + ' libfallback=' + ALL.length));
