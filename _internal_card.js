// _internal_card.js — INTERNAL IMAGE MAKER (owner 2026-07-17). Component #4.
// Places the BODY/figure images inside answers (NOT the face card). 13/13 Q&A only ("must be 13/13 to get
// images"), oldest+worst first, and gated to entries whose content is >=1h old (runs "an hour behind" words).
// Pick up to 6 internal images per entry (or auto top-3), veto, seal → publishInternalImages (sets bb_images
// so they render, no deploy). KEEPS the face image + title + text.
'use strict';
const http = require('http'), fs = require('fs'), https = require('https'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.INTERNAL_PORT || '7703', 10);
const PEXLIB = WD + '/assets/qa/_pexels_stored', LIB = WD + '/new/imagebank/cro';
const PEXELS = process.env.PEXELS_API_KEY;
const HOUR = 3600000;
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
let publishInternalImages = null; try { ({ publishInternalImages } = require('./new/publish_core')); } catch (e) {}
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }

function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }
function doneList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_internal_done.json', 'utf8')); } catch (e) { return []; } }
function markDone(id) { const d = doneList(); if (d.indexOf(id) < 0) { d.push(id); try { fs.writeFileSync(WD + '/new/_internal_done.json', JSON.stringify(d)); } catch (e) {} } }
function saveAdvMap(id, adv, q) { const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} m[adv] = { id, advId: adv, title: q || '' }; m['id:' + id] = adv; try { fs.writeFileSync(p, JSON.stringify(m, null, 1)); } catch (e) {} }

const QA = /^q\d+$/;
let _inv = { at: 0, list: [] };
async function loadInventory(force) {
  const now = Date.now();
  if (!force && _inv.list.length && (now - _inv.at) < 5 * 60 * 1000) return _inv.list;
  let list = []; const s = blobStore();
  if (s) { try { const idx = await s.get('_index.json', { type: 'json' }); list = ((idx && idx.entries) || []).filter(e => e && e.id && QA.test(e.id) && (e.gate_score >= 13)).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0, polished: e.polished_at || e.ts || 0 })); } catch (e) {} }
  _inv = { at: now, list }; return list;
}
async function scan() {
  const list = await loadInventory(false); const now = Date.now();
  const doneSet = new Set(doneList());
  const pool = list.filter(o => !doneSet.has(o.id) && (now - (o.polished || o.ts) > HOUR));
  pool.sort((a, b) => (a.ts - b.ts));                        // oldest first
  const waiting = list.filter(o => !doneSet.has(o.id) && (now - (o.polished || o.ts) <= HOUR)).length;
  return { card: pool[0] || null, total: list.length, done: [...doneSet].filter(x => list.some(o => o.id === x)).length, remaining: pool.length, waiting };
}
function kwOf(q) { return String(q || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !/^(the|and|for|you|your|what|how|when|why|best|top|most|common|should|know|before|about|with|from|2024|2025|2026|2027|2028)$/.test(w)).slice(0, 2).join(' '); }

const pexSearch = q => new Promise(res => { if (!PEXELS) return res(null); https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = u => new Promise(res => { https.get(u, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
function libFiles() { let a = []; try { a = a.concat(fs.readdirSync(PEXLIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'pex/' + f)); } catch (e) {} try { a = a.concat(fs.readdirSync(LIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'cro/' + f)); } catch (e) {} return a; }
function libResolve(rel) { rel = String(rel || '').replace(/\.\./g, ''); if (rel.indexOf('cro/') === 0) return LIB + '/' + rel.slice(4); if (rel.indexOf('pex/') === 0) return PEXLIB + '/' + rel.slice(4); return LIB + '/' + rel; }
function sample(arr, n) { const out = []; const used = {}; let g = 0; while (out.length < n && out.length < arr.length && g < n * 40) { g++; const i = Math.floor(Math.random() * arr.length); if (used[i]) continue; used[i] = 1; out.push(arr[i]); } return out; }
async function cover(buf) { if (!sharp) return buf; try { return await sharp(buf).resize(1200, 675, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 83 + (crypto.randomBytes(1)[0] % 8) }).toBuffer(); } catch (e) { return buf; } }

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Internal Image Maker</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:16px}
h1{color:#5ac8fa;margin:0 0 2px}.sub{color:#9aa2ad;font-size:13px;margin-bottom:14px}
.card{display:flex;gap:20px;flex-wrap:wrap}.cur{flex:0 0 340px;max-width:100%}
.set{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.set .s{aspect-ratio:16/9;border:2px dashed #345;border-radius:8px;background:#0c1017;overflow:hidden}.set .s img{width:100%;height:100%;object-fit:cover}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:12px}
.cand{border:3px solid transparent;border-radius:9px;overflow:hidden;cursor:pointer;background:#000;position:relative}.cand img{width:100%;height:84px;object-fit:cover;display:block}.cand.sel{border-color:#5ac8fa}.cand.sel::after{content:"✓";position:absolute;top:2px;right:5px;color:#5ac8fa;font-weight:900}
input,button{font-size:15px;padding:9px 12px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea}
button{cursor:pointer}.seal{background:#0d2b3b;border-color:#5ac8fa;color:#eafaff;font-weight:800}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#0f1116f2;z-index:50;text-align:center;font-size:2.4vw;font-weight:900;color:#5ac8fa;padding:20px}
#stage.on{display:flex}a{color:#e8b84a}
</style>
<h1>🖼️ Internal Image Maker</h1><div class=sub id=sub>Body images inside answers · 13/13 Q&amp;A only · oldest first · runs 1h behind words · face card + title + text kept.</div>
<div class=card>
  <div class=cur>
    <div id=qid style="color:#a9d8ff;font-weight:800;margin-bottom:6px">—</div>
    <div id=q style="font-size:15px;color:#cfe4ff;font-weight:700;margin-bottom:6px;line-height:1.3"></div>
    <div style="font-size:11px;color:#9aa2ad;letter-spacing:.06em">INTERNAL SET (pick up to 6)</div>
    <div class=set id=setrow><div class=s></div><div class=s></div><div class=s></div><div class=s></div><div class=s></div><div class=s></div></div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <button class=seal onclick=seal()>🔒 Seal internal images</button>
      <button onclick=autoTop()>✨ Auto from page (6)</button>
      <button onclick=skip()>⏭ Skip</button>
      <button id=autobtn onclick=adAuto() style="background:#3a1d55;border-color:#c88bf0;color:#fff;font-weight:800">▶ AUTO RUN</button>
      <span style="font-size:12px;color:#9aa2ad">veto <input id=vetosecs type=number value=7 min=3 max=30 style="width:48px;padding:4px"> s</span>
    </div>
    <div id=adlog style="margin-top:8px;max-height:170px;overflow:auto;font-family:ui-monospace,monospace;font-size:12px;color:#8affb0"></div>
    <div id=msg style="margin-top:8px;font-size:13px;color:#9aa2ad"></div>
  </div>
  <div style="flex:1;min-width:300px">
    <input id=q1 placeholder="search photos…" style="width:62%" onkeydown="if(event.key==='Enter')search()"><button onclick="search()">Search</button>
    <div class=grid id=cands></div>
  </div>
</div>
<div id=stage></div>
<script>
var E=null,CANDS=[],SET=[],AUTO=false;
function escH(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function j(u,o){return fetch(u,o).then(function(r){return r.json()})}
function stage(t){var s=document.getElementById('stage');s.innerHTML='<div style="max-width:760px">'+t+'</div>';s.classList.add('on')}
function hide(){document.getElementById('stage').classList.remove('on')}
function invLine(st){if(!st)return '';return '🖼️ <b style="color:#5ac8fa">'+st.done.toLocaleString()+'</b> done · <b style="color:#e8c874">'+st.remaining.toLocaleString()+'</b> ready · '+st.waiting.toLocaleString()+' waiting (1h behind) · '+st.total.toLocaleString()+' at 13/13';}
function drawSet(){var r=document.getElementById('setrow');var h='';for(var i=0;i<Math.max(6,SET.length);i++){h+='<div class=s>'+(SET[i]?'<img src="'+escH(SET[i].thumb)+'">':'')+'</div>';}r.innerHTML=h;document.querySelectorAll('.cand').forEach(function(c){var i=+c.getAttribute('data-i');c.classList.toggle('sel',SET.some(function(x){return x.full===(CANDS[i]||{}).full)})});}
document.getElementById('cands').addEventListener('click',function(e){var c=e.target.closest('.cand');if(!c)return;var i=+c.getAttribute('data-i');var p=CANDS[i];if(!p)return;var at=SET.findIndex(function(x){return x.full===p.full});if(at>=0)SET.splice(at,1);else if(SET.length<6)SET.push(p);drawSet();});
async function load(id){SET=[];E=await j('/api/card'+(id?('?id='+encodeURIComponent(id)):''));if(!E||!E.id){document.getElementById('sub').innerHTML=(E&&E.stats?invLine(E.stats)+' · ':'')+'🎉 none ready (words must be 1h old + 13/13)';document.getElementById('q').textContent='';document.getElementById('cands').innerHTML='';drawSet();hide();return;}
  document.getElementById('sub').innerHTML=invLine(E.stats);
  document.getElementById('qid').innerHTML='<span style="color:#9aa2ad;font-size:11px;letter-spacing:.08em">ADVERTISE ID</span> &nbsp;<b style="font-size:17px;color:#eafff0">'+E.advId+'</b><span style="color:#5f6570;font-size:11px;margin-left:8px">ref '+E.id+'</span>';
  document.getElementById('q').textContent=E.q||'';document.getElementById('msg').textContent='';
  document.getElementById('q1').value=E.kw||'';drawSet();search(E.kw||'');
}
async function search(q){if(q===undefined)q=document.getElementById('q1').value||'';var d=await j('/api/candidates?q='+encodeURIComponent(q||''));CANDS=(d.photos||[]);document.getElementById('cands').innerHTML=CANDS.map(function(p,i){return '<div class=cand data-i="'+i+'"><img src="'+escH(p.thumb)+'"></div>'}).join('');drawSet();}
async function autoTop(){document.getElementById('msg').textContent='✨ matching 6 photos to the page sections…';var d=await j('/api/autopick?id='+encodeURIComponent(E.id)+'&n=6');SET=(d.picks||[]).slice(0,6);if(!SET.length)SET=CANDS.slice(0,6);document.getElementById('msg').textContent='';drawSet();}
async function seal(){if(!SET.length){document.getElementById('msg').innerHTML='⚠️ pick at least 1 image';return;}stage('🔒 placing '+SET.length+' internal images…');var r=await j('/api/set',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,srcs:SET.map(function(x){return x.full})})});if(r&&r.ok){stage('✅ '+r.count+' internal images placed!<br><span style="font-size:1.3vw"><a href="'+r.url+'?cb='+Date.now()+'" target=_blank style="color:#8affb0">view page →</a></span><br><span style="font-size:1.4vw;color:#5ac8fa">next…</span>');setTimeout(function(){hide();load()},1600);}else{hide();document.getElementById('msg').innerHTML='⚠️ '+((r&&r.err)||'failed');}}
async function skip(){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});load();}
// ---- veto auto-run ----
function adLog(m){var el=document.getElementById('adlog');if(!el)return;var d=document.createElement('div');d.textContent=new Date().toLocaleTimeString()+'  '+m;el.insertBefore(d,el.firstChild)}
function setAutoBtn(){var b=document.getElementById('autobtn');if(!b)return;b.textContent=AUTO?'⏹ STOP auto run':'▶ AUTO RUN';b.style.background=AUTO?'#5a0d0d':'#3a1d55';b.style.borderColor=AUTO?'#ff6a6a':'#c88bf0'}
function previewCountdown(c,imgs,secs){return new Promise(function(resolve){var left=secs,done=false,iv;
  function fin(v){if(done)return;done=true;if(iv)clearInterval(iv);resolve(v)}
  window.__veto=function(){fin('veto')};window.__sealnow=function(){fin('seal')};window.__stopauto=function(){AUTO=false;fin('veto')};
  function draw(){stage('▶ AUTO — placing '+imgs.length+' internal images in <b style="color:#e8c874">'+left+'</b>s<br><span style="font-size:1.1vw;color:#9aa2ad">'+escH(c.q||'')+'</span><br><div style="display:flex;gap:6px;max-width:640px;margin:10px auto">'+imgs.map(function(u){return '<img src="'+escH(u)+'" style="flex:1;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:2px solid #5ac8fa">'}).join('')+'</div><div style="margin-top:6px"><button onclick="__veto()" style="font-size:1.4vw;padding:9px 18px;background:#5a0d0d;border:1px solid #ff6a6a;color:#fff">⏭ Skip this one</button> &nbsp;<button onclick="__sealnow()" style="font-size:1.4vw;padding:9px 18px;background:#0d2b3b;border:1px solid #5ac8fa;color:#eafaff">Place now</button> &nbsp;<button onclick="__stopauto()" style="font-size:1.4vw;padding:9px 16px">⏹ Stop</button></div>')}
  draw();iv=setInterval(function(){left--;if(left<=0){fin('seal')}else draw()},1000)})}
async function adAutoOne(){
  var c=await j('/api/card');if(!c||!c.id)return{done:true};
  var d=await j('/api/candidates?q='+encodeURIComponent(c.kw||''));var cands=(d.photos||[]);
  if(cands.length<1){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id})});return{id:c.id,skipped:'no photos'}}
  var ap=await j('/api/autopick?id='+encodeURIComponent(c.id)+'&n=6');var picks=(ap.picks||[]).slice(0,6);if(!picks.length)picks=cands.slice(0,6);
  var secs=Math.max(3,Math.min(30,parseInt((document.getElementById('vetosecs')||{}).value||'7',10)));
  var act=await previewCountdown(c,picks.map(function(x){return x.thumb}),secs);
  if(act==='veto'){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id})});return{id:c.id,skipped:'vetoed'}}
  var r=await j('/api/set',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id,srcs:picks.map(function(x){return x.full})})});
  return{id:c.id,sealed:r&&r.ok,count:r&&r.count,err:r&&r.err}
}
async function adAuto(){
  if(AUTO){AUTO=false;setAutoBtn();adLog('⏹ stopping…');return}
  if(!confirm('INTERNAL AUTO-RUN: for each 13/13 Q&A (words 1h+ old) it auto-picks the top 6 keyword photos and shows a countdown. Places them unless you Skip. Log shows each; STOP anytime. Start?'))return;
  AUTO=true;setAutoBtn();adLog('▶ internal auto-run started');
  while(AUTO){var res=await adAutoOne();if(res.done){adLog('🎉 none ready');break}if(res.sealed)adLog('✅ '+res.id+' — '+res.count+' internal images');else if(res.skipped)adLog('⏭ '+res.id+' '+res.skipped);else adLog('⚠ '+res.id+' '+(res.err||'failed'));if(!AUTO)break;}
  AUTO=false;setAutoBtn();hide();load();
}
load();
</script>`;

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  const send = (sc, b, ct) => { res.writeHead(sc, { 'content-type': ct || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u.pathname === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u.pathname === '/health') return send(200, 'ok', 'text/plain');
    if (u.pathname === '/api/card') {
      const s = await scan(); const stats = { total: s.total, done: s.done, remaining: s.remaining, waiting: s.waiting };
      let e = s.card;
      if (u.query.id) { const list = await loadInventory(false); const f = list.find(o => o.id === u.query.id); e = f ? { id: f.id, q: f.q } : null; }
      if (!e) return send(200, JSON.stringify({ stats }));
      const adv = advId(e.id); saveAdvMap(e.id, adv, e.q);
      return send(200, JSON.stringify({ id: e.id, advId: adv, q: e.q, kw: kwOf(e.q), stats }));
    }
    if (u.pathname === '/api/candidates') { const qq = u.query.q; let photos = []; if (qq) { const r = await pexSearch(qq); photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); } if (!photos.length) photos = sample(libFiles(), 40).map(f => ({ thumb: '/lib/' + f, full: '/lib/' + f })); return send(200, JSON.stringify({ photos })); }
    if (u.pathname === '/api/autopick') {
      // Preselect internal images FROM THE ANSWER PAGE: one topic-matched photo per body section (## / ### headings).
      const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const n = Math.min(10, Math.max(1, parseInt(u.query.n || '6', 10)));
      const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {} }
      const bodyTxt = (blob && blob.answer) || ''; const heads = [];
      bodyTxt.split(/\r?\n/).forEach(l => { const m = l.match(/^\s*#{2,3}\s+(.+)/); if (m) { const h = m[1].replace(/[#*`]/g, '').trim(); if (h && !/^(direct answer|faq|sources|related|table of|frequently asked)/i.test(h)) heads.push(h); } });
      const used = new Set(usedSrc()); const picks = []; const seen = new Set();
      for (const h of heads) { if (picks.length >= n) break; const kw = kwOf(h) || kwOf(blob && (blob.question || blob.h1)) || 'business'; const r = await pexSearch(kw); const ph = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); const pick = ph.find(p => !used.has(p.full) && !seen.has(p.full)); if (pick) { seen.add(pick.full); picks.push(pick); } }
      if (picks.length < n) { const r = await pexSearch(kwOf(blob && (blob.question || blob.h1)) || 'business'); const ph = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); for (const p of ph) { if (picks.length >= n) break; if (!used.has(p.full) && !seen.has(p.full)) { seen.add(p.full); picks.push(p); } } }
      return send(200, JSON.stringify({ picks }));
    }
    if (u.pathname.indexOf('/lib/') === 0) { try { return send(200, fs.readFileSync(libResolve(u.pathname.slice(5))), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (req.method === 'POST' && u.pathname === '/api/set') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const srcs = Array.isArray(b.srcs) ? b.srcs.slice(0, 6) : [];
      if (!id || !srcs.length) return send(200, '{"ok":false,"err":"missing id/images"}');
      if (!publishInternalImages) return send(200, '{"ok":false,"err":"publish_core not loaded"}');
      const bufs = [];
      for (const src of srcs) { let buf = null; if (String(src).indexOf('/lib/') === 0) { try { buf = fs.readFileSync(libResolve(String(src).slice(5))); } catch (e) {} } else { buf = await dl(src); } if (buf && buf.length > 2500) bufs.push(await cover(buf)); }
      if (!bufs.length) return send(200, '{"ok":false,"err":"images did not load"}');
      try { const r = await publishInternalImages(id, bufs); markDone(id); return send(200, JSON.stringify({ ok: true, url: r.url, count: r.count })); }
      catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'set failed') })); }
    }
    if (u.pathname === '/api/find') { const q = String(u.query.q || '').trim(); if (!q) return send(200, '{}'); const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} let out = null; if (/^AD-/i.test(q)) { const up = q.toUpperCase(); const rec = m[up]; if (rec) out = { advId: up, id: rec.id, title: rec.title }; } else { const id = q.replace(/[^a-zA-Z0-9_-]/g, ''); out = { advId: advId(id), id }; } return send(200, JSON.stringify(out || {})); }
    if (req.method === 'POST' && u.pathname === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) markDone(id); return send(200, '{"ok":true}'); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[internal-card] http://localhost:' + PORT + '/'));
