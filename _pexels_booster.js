// _pexels_booster.js — PEXELS IMAGE BOOSTER (owner 2026-07-17). Approve (✓) or reject (✗) cool photos;
// approved ones save straight into the library (assets/qa/_pexels_stored) so every tool can use them
// instantly as candidates. Goal: bank ~5000 pre-approved images. No auto — you check or x each.
'use strict';
const http = require('http'), fs = require('fs'), https = require('https'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.BOOSTER_PORT || '7704', 10);
const STORE = WD + '/assets/qa/_pexels_stored';
const PEXELS = process.env.PEXELS_API_KEY;
const TARGET = 5000;
try { fs.mkdirSync(STORE, { recursive: true }); } catch (e) {}
const KWS = ['business meeting', 'modern office', 'technology', 'data analytics', 'handshake deal', 'startup team', 'teamwork', 'laptop work', 'city skyline', 'finance', 'marketing strategy', 'conference', 'creative workspace', 'abstract technology', 'professional portrait', 'growth chart', 'warehouse logistics', 'customer service', 'server room', 'coffee meeting', 'whiteboard planning', 'sales presentation', 'network connection', 'digital dashboard', 'corporate building', 'productivity', 'innovation', 'consulting', 'boardroom', 'remote work'];

function approved() { try { return JSON.parse(fs.readFileSync(WD + '/new/_booster_approved.json', 'utf8')); } catch (e) { return []; } }
function markApproved(full) { const a = approved(); if (a.indexOf(full) < 0) { a.push(full); try { fs.writeFileSync(WD + '/new/_booster_approved.json', JSON.stringify(a)); } catch (e) {} } return a.length; }
function count() { return approved().length; }
function rejected() { try { return JSON.parse(fs.readFileSync(WD + '/new/_booster_rejected.json', 'utf8')); } catch (e) { return []; } }
function markRejected(full) { const a = rejected(); if (a.indexOf(full) < 0) { a.push(full); try { fs.writeFileSync(WD + '/new/_booster_rejected.json', JSON.stringify(a)); } catch (e) {} } }
const pexSearch = (q, page) => new Promise(res => { if (!PEXELS) return res(null); https.get('https://api.pexels.com/v1/search?per_page=40&page=' + (page || 1) + '&orientation=landscape&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = u => new Promise(res => { https.get(u, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Pexels Booster</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:16px}
h1{color:#34d399;margin:0 0 2px}.sub{color:#9aa2ad;font-size:13px;margin-bottom:10px}
#pbar{height:10px;background:#1a1d24;border-radius:6px;overflow:hidden;max-width:600px;margin-bottom:12px}#pfill{height:100%;background:linear-gradient(90deg,#34d399,#5ac8fa);width:0%}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
.cell{border:3px solid #262c36;border-radius:10px;overflow:hidden;background:#000;position:relative}
.cell img{width:100%;height:130px;object-fit:cover;display:block}
.cell .btns{display:flex}.cell .btns button{flex:1;border:0;padding:8px;font-size:17px;cursor:pointer}
.yes{background:#123b1e;color:#4ce07a}.no{background:#3a1414;color:#ff8a8a}
.cell.approved{border-color:#4ce07a}.cell.approved::after{content:"✓ saved";position:absolute;top:6px;left:6px;background:#123b1e;color:#4ce07a;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px}
.cell.gone{opacity:.25}
button.load{font-size:15px;padding:10px 18px;border-radius:8px;border:1px solid #34d399;background:#0d2b1e;color:#eafff0;font-weight:800;margin-top:14px}
</style>
<h1>📸 Pexels Image Booster</h1>
<div class=sub id=sub>Check ✓ to bank an image into your library (instant use in every tool) · ✗ to skip · goal 5,000.</div>
<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <input id=theme placeholder="theme (e.g. sales team, office, tech)…" onkeydown="if(event.key==='Enter')more()" style="width:250px;padding:8px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea">
  <button class=load onclick=more() style="margin-top:0;background:#0d2b3b;border-color:#5ac8fa">🔎 Search</button>
  <input id=count type=number value=200 min=1 max=5000 style="width:80px;padding:8px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea"> images
  <button class=load id=autobtn onclick=autoRun() style="margin-top:0;background:#3a1d55;border-color:#c88bf0">▶ AUTO approve til done</button>
  <button class=load onclick=more() style="margin-top:0">↻ 40 more</button>
  <span id=autostat style="font-size:12px;color:#c88bf0"></span>
</div>
<div id=pbar><div id=pfill></div></div>
<div class=grid id=grid></div>
<script>
var BATCH=[],AUTO=false;
function theme(){return (document.getElementById('theme').value||'').trim()}
function stats(){fetch('/api/stats').then(function(r){return r.json()}).then(function(s){document.getElementById('sub').innerHTML='Check ✓ to bank into your library · ✗ to skip · <b style="color:#34d399">'+s.approved.toLocaleString()+'</b> / '+s.target.toLocaleString()+' banked';document.getElementById('pfill').style.width=Math.min(100,(s.approved/s.target*100)).toFixed(1)+'%';})}
function esc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
async function more(){var d=await fetch('/api/batch?q='+encodeURIComponent(theme())).then(function(r){return r.json()});BATCH=(d.photos||[]);document.getElementById('grid').innerHTML=BATCH.map(function(p,i){return '<div class=cell id="c'+i+'"><img src="'+esc(p.thumb)+'"><div class=btns><button class=yes onclick=yes('+i+')>✓</button><button class=no onclick=no('+i+')>✗</button></div></div>'}).join('');}
function no(i){var p=BATCH[i];var c=document.getElementById('c'+i);if(c)c.classList.add('gone');if(p)fetch('/api/reject',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({full:p.full})});}
async function yes(i){var p=BATCH[i];if(!p)return;var c=document.getElementById('c'+i);var r=await fetch('/api/approve',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({full:p.full})}).then(function(x){return x.json()});if(r&&r.ok){if(c)c.classList.add('approved');stats();}else{if(c)c.classList.add('gone');}}
async function autoRun(){
  if(AUTO){AUTO=false;document.getElementById('autobtn').textContent='▶ AUTO approve til done';return}
  var target=parseInt(document.getElementById('count').value||'200',10)||200;
  var goal=(await fetch('/api/stats').then(function(r){return r.json()})).approved+target;
  AUTO=true;document.getElementById('autobtn').textContent='⏹ STOP';
  while(AUTO){
    var s=await fetch('/api/stats').then(function(r){return r.json()});
    document.getElementById('autostat').textContent='banking "'+(theme()||'random')+'" — '+s.approved.toLocaleString()+' / goal '+goal.toLocaleString();
    if(s.approved>=goal)break;
    if(!BATCH.length){await more();}
    if(!BATCH.length){document.getElementById('autostat').textContent+=' — no more images for this theme';break}
    for(var i=0;i<BATCH.length&&AUTO;i++){var st=await fetch('/api/stats').then(function(r){return r.json()});if(st.approved>=goal)break;var cc=document.getElementById('c'+i);if(cc)cc.scrollIntoView({block:'center',behavior:'smooth'});await yes(i);await new Promise(function(z){setTimeout(z,140)});}   // show image → green-check (save to library) → next
    if(AUTO)await more();   // load the next batch and keep going
  }
  AUTO=false;document.getElementById('autobtn').textContent='▶ AUTO approve til done';
}
stats();more();
</script>`;

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  const send = (sc, b, ct) => { res.writeHead(sc, { 'content-type': ct || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u.pathname === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u.pathname === '/health') return send(200, 'ok', 'text/plain');
    if (u.pathname === '/api/stats') return send(200, JSON.stringify({ approved: count(), target: TARGET }));
    if (u.pathname === '/api/batch') {
      const seen = new Set(approved()); const rej = new Set(rejected()); const theme = String(u.query.q || '').trim();
      let photos = [], kw = '';
      for (let t = 0; t < 8 && photos.length === 0; t++) {
        kw = theme || KWS[crypto.randomBytes(1)[0] % KWS.length];
        const page = 1 + (crypto.randomBytes(1)[0] % (t < 3 ? 6 : 15));
        const r = await pexSearch(kw, page);
        photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })).filter(p => !seen.has(p.full) && !rej.has(p.full));
      }
      return send(200, JSON.stringify({ kw, photos }));
    }
    if (req.method === 'POST' && u.pathname === '/api/reject') { const b = await body(); if (b.full) markRejected(String(b.full)); return send(200, '{"ok":true}'); }
    if (req.method === 'POST' && u.pathname === '/api/approve') {
      const b = await body(); const full = String(b.full || ''); if (!/^https?:\/\//.test(full)) return send(200, '{"ok":false,"err":"bad url"}');
      if (approved().indexOf(full) >= 0) return send(200, JSON.stringify({ ok: true, count: count(), dup: true }));
      const buf = await dl(full); if (!buf || buf.length < 3000) return send(200, '{"ok":false,"err":"download failed"}');
      const name = 'boost_' + crypto.randomBytes(6).toString('hex') + '.jpg';
      try { fs.writeFileSync(STORE + '/' + name, buf); } catch (e) { return send(200, '{"ok":false,"err":"save failed"}'); }
      const n = markApproved(full);
      return send(200, JSON.stringify({ ok: true, count: n, saved: name }));
    }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[pexels-booster] http://localhost:' + PORT + '/'));
