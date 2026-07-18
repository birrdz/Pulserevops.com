// _pulse_studio.js — PULSE STUDIO + FIX-ALL MACHINE (owner 2026-07-17).
// ONE tool that does it all per entry: content→13/13, face image, dressing, 6 internal images (Q&A).
// FIX-ALL AUTO runs the whole pipeline worst-first: build content (gated 13/13, auto-publish only if it
// passes) → face image (top-match + veto) → internal images (top-6 + veto). Human veto on every image;
// content is quality-gated. All safe publishers, all reversible.
'use strict';
const http = require('http'), fs = require('fs'), https = require('https'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.STUDIO_PORT || '7710', 10);
const PEXLIB = WD + '/assets/qa/_pexels_stored', LIB = WD + '/new/imagebank/cro';
const PEXELS = process.env.PEXELS_API_KEY;
let sharp = null; try { sharp = require('sharp'); } catch (e) {}
let pc = {}; try { pc = require('./new/publish_core'); } catch (e) {}
let ic = {}; try { ic = require('./new/improve_content'); } catch (e) {}
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }

function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }
function doneList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_studio_done.json', 'utf8')); } catch (e) { return []; } }
function markDone(id) { const d = doneList(); if (d.indexOf(id) < 0) { d.push(id); try { fs.writeFileSync(WD + '/new/_studio_done.json', JSON.stringify(d)); } catch (e) {} } }
function usedSrc() { try { return JSON.parse(fs.readFileSync(WD + '/new/_ad_used_src.json', 'utf8')); } catch (e) { return []; } }
function markUsed(src) { const a = usedSrc(); if (a.indexOf(src) < 0) { a.push(src); try { fs.writeFileSync(WD + '/new/_ad_used_src.json', JSON.stringify(a)); } catch (e) {} } }
function deleteLibFile(src) { if (String(src).indexOf('/lib/') === 0) { try { fs.rmSync(libResolve(String(src).slice(5)), { force: true }); } catch (e) {} } }   // used library image = deleted from library (single-use)

const QA = /^q\d+$/;
let _inv = { at: 0, list: [] };
async function loadInventory(force) {
  const now = Date.now();
  if (!force && _inv.list.length && (now - _inv.at) < 3 * 60 * 1000) return _inv.list;
  let list = []; const s = blobStore();
  if (s) { try { const idx = await s.get('_index.json', { type: 'json' }); list = ((idx && idx.entries) || []).filter(e => e && e.id && QA.test(e.id)).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0, gate: (typeof e.gate_score === 'number' ? e.gate_score : 0) })); } catch (e) {} }
  _inv = { at: now, list }; return list;
}
async function nextEntry(explicitId) {
  const list = await loadInventory(false); const doneSet = new Set(doneList());
  let e;
  if (explicitId) e = list.find(o => o.id === explicitId);
  else { const pool = list.filter(o => !doneSet.has(o.id)); pool.sort((a, b) => (a.gate - b.gate) || (a.ts - b.ts)); e = pool[0]; }
  const stats = { total: list.length, done: [...doneSet].filter(x => list.some(o => o.id === x)).length, remaining: list.filter(o => !doneSet.has(o.id)).length };
  return { e, stats };
}
function kwOf(q) { return String(q || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !/^(the|and|for|you|your|what|how|when|why|best|top|most|common|should|know|before|about|with|from|2024|2025|2026|2027|2028)$/.test(w)).slice(0, 2).join(' '); }
function gate(body, question) { return ic.gateScore ? ic.gateScore({ body: body || '', question: question || '' }) : { score: 0, pass: false, fails: [], wordCount: 0 }; }

const pexSearch = q => new Promise(res => { if (!PEXELS) return res(null); https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&query=' + encodeURIComponent(q || 'business'), { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); });
const dl = u => new Promise(res => { https.get(u, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
function libFiles() { let a = []; try { a = a.concat(fs.readdirSync(PEXLIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'pex/' + f)); } catch (e) {} try { a = a.concat(fs.readdirSync(LIB).filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => 'cro/' + f)); } catch (e) {} return a; }
function libResolve(rel) { rel = String(rel || '').replace(/\.\./g, ''); if (rel.indexOf('cro/') === 0) return LIB + '/' + rel.slice(4); if (rel.indexOf('pex/') === 0) return PEXLIB + '/' + rel.slice(4); return LIB + '/' + rel; }
function sample(arr, n) { const out = []; const used = {}; let g = 0; while (out.length < n && out.length < arr.length && g < n * 40) { g++; const i = Math.floor(Math.random() * arr.length); if (used[i]) continue; used[i] = 1; out.push(arr[i]); } return out; }
async function cover(buf) { if (!sharp) return buf; try { return await sharp(buf).resize(1200, 675, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 83 + (crypto.randomBytes(1)[0] % 8) }).toBuffer(); } catch (e) { return buf; } }
async function srcToBuf(src) { let buf = null; if (String(src).indexOf('/lib/') === 0) { try { buf = fs.readFileSync(libResolve(String(src).slice(5))); } catch (e) {} } else { buf = await dl(src); } if (!buf || buf.length < 2500) return null; return await cover(buf); }

const REB = {}; // id -> rebuilt body held for review

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Pulse Studio — Fix-All</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:14px}
h1{margin:0 0 2px;color:#ffb641}.sub{color:#9aa2ad;font-size:13px;margin-bottom:12px}
.wrap{display:flex;gap:16px;flex-wrap:wrap}
.col{flex:1;min-width:320px}
.sec{background:#151922;border:1px solid #262c36;border-radius:12px;padding:12px;margin-bottom:12px}
.sec h3{margin:0 0 6px;font-size:14px;letter-spacing:.04em}
.done{border-color:#2e7d46}.done h3::after{content:" ✓";color:#4ce07a}
.chip{display:inline-block;background:#3a2d12;color:#ffce8a;border:1px solid #7a5a20;border-radius:20px;padding:1px 9px;font-size:11px;margin:2px 3px 0 0}
button{font-size:14px;padding:8px 12px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea;cursor:pointer}
.go{background:#243b0d;border-color:#6bbf3a;color:#eafff0;font-weight:800}
.big{background:#3a1d55;border-color:#c88bf0;color:#fff;font-weight:900;font-size:16px;padding:11px 22px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px;margin-top:8px}
.cand{border:3px solid transparent;border-radius:8px;overflow:hidden;cursor:pointer;background:#000;position:relative}.cand img{width:100%;height:66px;object-fit:cover;display:block}.cand.sel{border-color:#5ac8fa}.cand.sel::after{content:"✓";position:absolute;top:1px;right:4px;color:#5ac8fa;font-weight:900}
.opt{display:block;width:100%;text-align:left;margin:4px 0;padding:7px 10px;border:1px solid #333;border-radius:8px;background:#1a1d24;color:#eafff0;font-size:13px;cursor:pointer}.opt:hover{border-color:#c88bf0}
input{font-size:14px;padding:8px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#0f1116f2;z-index:60;text-align:center;font-size:2.2vw;font-weight:900;color:#ffb641;padding:20px}#stage.on{display:flex}
#log{max-height:150px;overflow:auto;font-family:ui-monospace,monospace;font-size:12px;color:#8affb0}
a{color:#e8b84a}
</style>
<h1>🎛️ Pulse Studio — Fix-All Machine</h1>
<div class=sub id=sub>Worst-first · one entry, every fix: content→13/13, face image, dressing, 6 internal images. Face card + text kept where not being changed.</div>
<div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <button class=big id=fixbtn onclick=fixAll()>🔧 FIX-ALL AUTO RUN</button>
  <button onclick=skip()>⏭ Skip entry</button>
  <span style="font-size:12px;color:#9aa2ad">image veto <input id=vetosecs type=number value=7 min=3 max=30 style="width:46px"> s</span>
  <span id=idlab style="font-size:13px;color:#9aa2ad"></span>
</div>
<div id=log></div>
<div class=wrap>
  <div class=col>
    <div class=sec id=sec-content><h3>🧱 Content → 13/13</h3><div id=content>—</div></div>
    <div class=sec id=sec-dress><h3>✍️ Dressing (title)</h3><div id=dress>—</div></div>
  </div>
  <div class=col>
    <div class=sec id=sec-face><h3>📣 Face image</h3><div id=face>—</div></div>
    <div class=sec id=sec-internal><h3>🖼️ Internal images (6, Q&amp;A)</h3><div id=internal>—</div></div>
    <div class=sec><h3>🔎 Photo search (face + internal)</h3><input id=q1 placeholder="keyword…" style="width:60%" onkeydown="if(event.key==='Enter')search()"><button onclick=search()>Search</button><div class=grid id=cands></div></div>
  </div>
</div>
<div id=stage></div>
<script>
var E=null,CANDS=[],FACE=null,INT=[],DR=[],AUTO=false;
function escH(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function j(u,o){return fetch(u,o).then(function(r){return r.json()})}
function stage(t){var s=document.getElementById('stage');s.innerHTML='<div style="max-width:820px">'+t+'</div>';s.classList.add('on')}
function hide(){document.getElementById('stage').classList.remove('on')}
function log(m){var el=document.getElementById('log');var d=document.createElement('div');d.textContent=new Date().toLocaleTimeString()+'  '+m;el.insertBefore(d,el.firstChild)}
document.getElementById('cands').addEventListener('click',function(e){var c=e.target.closest('.cand');if(!c)return;var i=+c.getAttribute('data-i');var p=CANDS[i];if(!p)return;if(window.__pickmode==='face'){FACE=p;renderFace();}else{var at=INT.findIndex(function(x){return x.full===p.full});if(at>=0)INT.splice(at,1);else if(INT.length<6)INT.push(p);renderInternal();}mark();});
function mark(){document.querySelectorAll('.cand').forEach(function(c){var i=+c.getAttribute('data-i');var p=CANDS[i]||{};c.classList.toggle('sel',(FACE&&FACE.full===p.full)||INT.some(function(x){return x.full===p.full}))});}
async function load(id){FACE=null;INT=[];DR=[];E=(await j('/api/next'+(id?('?id='+encodeURIComponent(id)):'')));var s=E.stats;document.getElementById('sub').innerHTML='📚 <b style="color:#4ce07a">'+s.done.toLocaleString()+'</b> done · <b style="color:#e8c874">'+s.remaining.toLocaleString()+'</b> to go · '+s.total.toLocaleString()+' Q&amp;A';
  if(!E.id){document.getElementById('idlab').textContent='🎉 all done';document.getElementById('content').textContent='';return;}
  document.getElementById('idlab').innerHTML='<a href="https://pulserevops.com/knowledge/'+E.id+'?cb='+Date.now()+'" target=_blank style="color:#8affb0;text-decoration:underline;font-weight:800">'+E.advId+'</a> · ref '+E.id+' · "'+escH((E.q||'').slice(0,60))+'"';
  renderContent();renderDress();renderFace();renderInternal();
  document.getElementById('q1').value=E.kw||'';search(E.kw||'');
}
function renderContent(){var el=document.getElementById('content');var col=E.pass?'#4ce07a':(E.score>=10?'#e8c874':'#ff9a9a');
  el.innerHTML='<div>gate <b style="color:'+col+'">'+E.score+'</b>/13 · '+(E.words||0).toLocaleString()+' words '+(E.pass?'<span style="color:#4ce07a">✓</span>':'')+'</div>'+((E.fails||[]).map(function(f){return '<span class=chip>'+escH(f)+'</span>'}).join(''))+'<div style="margin-top:8px"><button class=go onclick=buildContent()>🔨 Build to 13/13</button></div>';
  document.getElementById('sec-content').classList.toggle('done',!!E.pass);}
function renderDress(){var el=document.getElementById('dress');el.innerHTML='<div style="font-size:13px;color:#cfe4ff;margin-bottom:6px">'+escH(E.q||'')+'</div><button onclick=loadDress()>✨ 3 better options</button><div id=dropts></div>';}
async function loadDress(){document.getElementById('dropts').innerHTML='<span style="color:#9aa2ad;font-size:12px">…</span>';var d=await j('/api/dressings?id='+encodeURIComponent(E.id));if(!(d&&d.ok)){document.getElementById('dropts').innerHTML='<span style="color:#ff8a8a;font-size:12px">'+escH((d&&d.err)||'x')+'</span>';return}DR=d.options||[];document.getElementById('dropts').innerHTML=DR.map(function(o,i){return '<button class=opt data-i="'+i+'" onclick=setDress('+i+')>'+escH(o)+'</button>'}).join('');}
async function setDress(i){var t=DR[i];if(!t)return;var r=await j('/api/setdressing',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,dressing:t})});if(r&&r.ok){E.q=t;renderDress();document.getElementById('sec-dress').classList.add('done');log('✍️ '+E.id+' dressing set')}}
function renderFace(){var el=document.getElementById('face');el.innerHTML=(FACE?'<img src="'+escH(FACE.thumb)+'" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:2px solid #6bbf3a">':'<div style="color:#9aa2ad;font-size:13px">click a photo (face mode) to pick the hero image</div>')+'<div style="margin-top:8px"><button onclick="setMode(\\'face\\')">📣 face pick mode</button> <button class=go onclick=sealFace() '+(FACE?'':'disabled')+'>🔒 Seal face</button></div>';}
function renderInternal(){var el=document.getElementById('internal');var strip='';for(var i=0;i<6;i++){strip+='<span style="display:inline-block;width:48px;height:30px;margin:1px;border-radius:4px;background:'+(INT[i]?'#0c1017':'#1a1d24')+';overflow:hidden;border:1px solid #345">'+(INT[i]?'<img src="'+escH(INT[i].thumb)+'" style="width:100%;height:100%;object-fit:cover">':'')+'</span>';}
  el.innerHTML=strip+'<div style="margin-top:8px"><button onclick="setMode(\\'int\\')">🖼️ internal pick mode</button> <button onclick=autoInt()>✨ top 6</button> <button class=go onclick=sealInt() '+(INT.length?'':'disabled')+'>🔒 Seal '+INT.length+' internal</button></div>';}
function setMode(m){window.__pickmode=m;log('pick mode: '+(m==='face'?'FACE (1)':'INTERNAL (up to 6)'));}
function autoInt(){INT=CANDS.slice(0,6);renderInternal();mark();}
async function search(q){if(q===undefined)q=document.getElementById('q1').value||'';var d=await j('/api/candidates?q='+encodeURIComponent(q||''));CANDS=(d.photos||[]);document.getElementById('cands').innerHTML=CANDS.map(function(p,i){return '<div class=cand data-i="'+i+'"><img src="'+escH(p.thumb)+'"></div>'}).join('');mark();}
async function buildContent(){stage('🔨 rebuilding to 13/13 on your Max plan…<br><span style="font-size:1.1vw;color:#9aa2ad">1–3 min…</span>');var r=await j('/api/build?id='+encodeURIComponent(E.id));hide();if(!(r&&r.ok)){log('⚠ '+E.id+' build: '+((r&&r.err)||'x'));return}if(r.pass){var p=await j('/api/pubcontent',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,body:r.body})});if(p&&p.ok){E.score=13;E.pass=true;E.words=r.words;E.fails=[];renderContent();log('✅ '+E.id+' content 13/13 · '+r.words+'w')}else log('⚠ '+E.id+' publish: '+((p&&p.err)||'x'));}else{log('⏭ '+E.id+' content only '+r.after+'/13');E.score=r.after;renderContent();}}
async function sealFace(){if(!FACE)return;stage('🔒 sealing face image…');var r=await j('/api/face',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,src:FACE.full})});hide();if(r&&r.ok){document.getElementById('sec-face').classList.add('done');log('✅ '+E.id+' face sealed')}else log('⚠ '+E.id+' face: '+((r&&r.err)||'x'));}
async function sealInt(){if(!INT.length)return;stage('🔒 placing '+INT.length+' internal images…');var r=await j('/api/internal',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,srcs:INT.map(function(x){return x.full})})});hide();if(r&&r.ok){document.getElementById('sec-internal').classList.add('done');log('✅ '+E.id+' '+r.count+' internal images')}else log('⚠ '+E.id+' internal: '+((r&&r.err)||'x'));}
async function skip(){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});load();}
// ---- FIX-ALL AUTO ----
function vetoStep(title,imgs,secs){return new Promise(function(resolve){var left=secs,done=false,iv;function fin(v){if(done)return;done=true;if(iv)clearInterval(iv);resolve(v)}window.__v=function(){fin('veto')};window.__n=function(){fin('go')};window.__s=function(){AUTO=false;fin('veto')};
  function draw(){stage(title+' in <b style="color:#e8c874">'+left+'</b>s<br><div style="display:flex;gap:6px;max-width:680px;margin:10px auto;flex-wrap:wrap;justify-content:center">'+imgs.map(function(u){return '<img src="'+escH(u)+'" style="width:150px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:2px solid #6bbf3a">'}).join('')+'</div><div><button onclick=__v() style="font-size:1.3vw;padding:8px 16px;background:#5a0d0d;border:1px solid #ff6a6a;color:#fff">⏭ Skip</button> <button onclick=__n() style="font-size:1.3vw;padding:8px 16px;background:#243b0d;border:1px solid #6bbf3a;color:#eafff0">Go now</button> <button onclick=__s() style="font-size:1.3vw;padding:8px 14px">⏹ Stop</button></div>')}
  draw();iv=setInterval(function(){left--;if(left<=0)fin('go');else draw()},1000)})}
async function fixOne(){
  var d=await j('/api/next');if(!d||!d.id)return{done:true};var id=d.id;log('▶ '+id+' ('+d.advId+') gate '+d.score+'/13 — order: face → content → internal');
  var secs=Math.max(3,Math.min(30,parseInt((document.getElementById('vetosecs')||{}).value||'7',10)));
  var cd=await j('/api/candidates?q='+encodeURIComponent(d.kw||''));var cands=(cd.photos||[]);
  // 1. FACE (ad card first)
  if(cands.length){var fa=await vetoStep('📣 '+id+' — sealing FACE image',[cands[0].thumb],secs);if(!AUTO)return{stopped:true};if(fa==='go'){await j('/api/face',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:id,src:cands[0].full})});log('✅ '+id+' face')}else log('⏭ '+id+' face skipped');}
  if(!AUTO)return{stopped:true};
  // 2. CONTENT to 13/13 (gated — auto-publish only if it passes)
  var pass=d.pass;
  if(!pass){stage('🔨 '+id+' — content to 13/13…');var r=await j('/api/build?id='+encodeURIComponent(id));if(r&&r.ok&&r.pass){await j('/api/pubcontent',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:id,body:r.body})});pass=true;log('✅ '+id+' content 13/13 · '+r.words+'w')}else{log('⏭ '+id+' content stuck '+((r&&r.after)||'?')+'/13 — no internal images (needs 13/13)')}}
  if(!AUTO)return{stopped:true};
  // 3. INTERNAL 6 — ONLY if 13/13 (law: must be 13/13 to get images)
  if(pass&&cands.length){var picks=cands.slice(0,6);var ia=await vetoStep('🖼️ '+id+' — placing 6 INTERNAL images',picks.map(function(x){return x.thumb}),secs);if(!AUTO)return{stopped:true};if(ia==='go'){var ir=await j('/api/internal',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:id,srcs:picks.map(function(x){return x.full})})});log('✅ '+id+' '+((ir&&ir.count)||0)+' internal')}else log('⏭ '+id+' internal skipped');}
  await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:id})});
  return{id:id,done1:true};
}
async function fixAll(){if(AUTO){AUTO=false;document.getElementById('fixbtn').textContent='🔧 FIX-ALL AUTO RUN';return}
  if(!confirm('FIX-ALL AUTO: worst entry first. Builds content to 13/13 (auto-publish ONLY if it passes), then FACE image (veto), then 6 INTERNAL images (veto). Content is quality-gated; you veto every image. STOP anytime. Start?'))return;
  AUTO=true;document.getElementById('fixbtn').textContent='⏹ STOP FIX-ALL';log('🔧 fix-all started');
  while(AUTO){var res=await fixOne();if(res.done){log('🎉 nothing left');break}if(res.stopped)break;}
  AUTO=false;document.getElementById('fixbtn').textContent='🔧 FIX-ALL AUTO RUN';hide();load();
}
load();
</script>`;

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  const send = (sc, b, ct) => { res.writeHead(sc, { 'content-type': ct || 'application/json', 'access-control-allow-origin': '*' }); res.end(b); };
  const body = () => new Promise(r => { let s = ''; req.on('data', d => s += d); req.on('end', () => { try { r(JSON.parse(s || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u.pathname === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u.pathname === '/health') return send(200, 'ok', 'text/plain');
    if (u.pathname === '/api/next') {
      const { e, stats } = await nextEntry(u.query.id); if (!e) return send(200, JSON.stringify({ stats }));
      const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + e.id + '.json', { type: 'json' }); } catch (x) {} }
      const q = (blob && (blob.question || blob.h1)) || e.q; const g = gate(blob && blob.answer, q);
      return send(200, JSON.stringify({ id: e.id, advId: advId(e.id), q, kw: kwOf(q), score: g.score, pass: !!g.pass, fails: g.fails, words: g.wordCount, stats }));
    }
    if (u.pathname === '/api/candidates') { const qq = u.query.q; let photos = []; if (qq) { const r = await pexSearch(qq); photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large })); } if (!photos.length) photos = sample(libFiles(), 40).map(f => ({ thumb: '/lib/' + f, full: '/lib/' + f })); const used = new Set(usedSrc()); photos = photos.filter(p => !used.has(p.full)); return send(200, JSON.stringify({ photos })); }
    if (u.pathname.indexOf('/lib/') === 0) { try { return send(200, fs.readFileSync(libResolve(u.pathname.slice(5))), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (u.pathname === '/api/build') {
      const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id || !ic.rebuildToGate) return send(200, '{"ok":false,"err":"no id/writer"}');
      const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (x) {} }
      const r = ic.rebuildToGate((blob && (blob.question || blob.h1)) || '', (blob && blob.answer) || '', { maxAttempts: 3 });
      if (!r.ok && !r.body) return send(200, JSON.stringify({ ok: false, err: r.err || 'rebuild failed' }));
      REB[id] = r.body; return send(200, JSON.stringify({ ok: true, before: r.before, after: r.after, pass: r.pass, fails: r.fails, words: r.words, body: r.body }));
    }
    if (req.method === 'POST' && u.pathname === '/api/pubcontent') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const bd = b.body || REB[id]; if (!id || !bd) return send(200, '{"ok":false,"err":"missing"}'); const g = gate(bd, ''); if (!g.pass) return send(200, JSON.stringify({ ok: false, err: 'not 13/13 (' + (g.fails || []).join(', ') + ')' })); if (!pc.publishContentBody) return send(200, '{"ok":false,"err":"no publisher"}'); try { const r = await pc.publishContentBody(id, bd); delete REB[id]; return send(200, JSON.stringify({ ok: true, url: r.url })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'x') })); } }
    if (req.method === 'POST' && u.pathname === '/api/face') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id || !b.src || !pc.publishFaceImageOnly) return send(200, '{"ok":false,"err":"missing"}'); const buf = await srcToBuf(b.src); if (!buf) return send(200, '{"ok":false,"err":"image did not load"}'); try { fs.mkdirSync(WD + '/new/output/' + id, { recursive: true }); fs.writeFileSync(WD + '/new/output/' + id + '/facecard.jpg', buf); let m = {}; try { m = JSON.parse(fs.readFileSync(WD + '/new/output/' + id + '/meta.json', 'utf8')); } catch (e) {} m.faceCard = 'facecard.jpg'; fs.writeFileSync(WD + '/new/output/' + id + '/meta.json', JSON.stringify(m)); const r = await pc.publishFaceImageOnly(id); markUsed(b.src); deleteLibFile(b.src); return send(200, JSON.stringify({ ok: true, url: r.url })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'x') })); } }
    if (req.method === 'POST' && u.pathname === '/api/internal') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const srcs = Array.isArray(b.srcs) ? b.srcs.slice(0, 6) : []; if (!id || !srcs.length || !pc.publishInternalImages) return send(200, '{"ok":false,"err":"missing"}'); const bufs = []; for (const s of srcs) { const bf = await srcToBuf(s); if (bf) { bufs.push(bf); markUsed(s); } } if (!bufs.length) return send(200, '{"ok":false,"err":"images did not load"}'); try { const r = await pc.publishInternalImages(id, bufs); return send(200, JSON.stringify({ ok: true, count: r.count, url: r.url })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'x') })); } }
    if (u.pathname === '/api/dressings') { const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id || !ic.claudeBin) return send(200, '{"ok":false,"err":"no id/cli"}'); const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {} } const bin = ic.claudeBin(); if (!bin) return send(200, '{"ok":false,"err":"cli not found"}'); const { spawnSync } = require('child_process'); const env = Object.assign({}, process.env); delete env.ANTHROPIC_API_KEY; delete env.ANTHROPIC_AUTH_TOKEN; delete env.CLAUDE_API_KEY; const prompt = ['Rewrite this RevOps page title into 3 stronger options. Same meaning, proper caps, keep acronyms (RevOps,SDR,OTE,CRO,B2B,KPI,GTM,CRM), end time-sensitive ones with "in 2027", 40-90 chars, no quotes.', 'CURRENT: ' + ((blob && (blob.question || blob.h1)) || ''), 'BODY: ' + String((blob && blob.answer) || '').replace(/\s+/g, ' ').slice(0, 500), 'Output EXACTLY 3 lines: "1) ", "2) ", "3) ".'].join('\n'); const rr = spawnSync(bin, ['-p', '--output-format', 'text'], { input: prompt, encoding: 'utf8', timeout: 90000, maxBuffer: 1024 * 1024 * 8, windowsHide: true, env }); const out = String(rr.stdout || ''); const opts = []; out.split(/\r?\n/).forEach(l => { const m = l.match(/^\s*[1-3][).\]]\s*(.+?)\s*$/); if (m) opts.push(m[1].replace(/^["']|["']$/g, '').trim()); }); if (!opts.length) return send(200, '{"ok":false,"err":"no titles"}'); return send(200, JSON.stringify({ ok: true, options: opts.slice(0, 3) })); }
    if (req.method === 'POST' && u.pathname === '/api/setdressing') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id || !b.dressing || !pc.publishDressingOnly) return send(200, '{"ok":false,"err":"missing"}'); try { const r = await pc.publishDressingOnly(id, b.dressing); return send(200, JSON.stringify({ ok: true, title: r.title })); } catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'x') })); } }
    if (req.method === 'POST' && u.pathname === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) markDone(id); return send(200, '{"ok":true}'); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[pulse-studio] http://localhost:' + PORT + '/'));
