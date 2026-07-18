// _pulse_hub.js — PULSE CONTROL CENTER v2 (owner 2026-07-17). Controls every tool + shows progress:
// live status, Start/Stop/Restart/Open, per-tool % of library fixed, and the full Q&A list oldest→newest.
'use strict';
const http = require('http'), net = require('net'), fs = require('fs'), url = require('url'), { spawn, execSync } = require('child_process');
const WD = __dirname;
const PORT = parseInt(process.env.HUB_PORT || '7000', 10);
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }
function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }

const TOOLS = [
  { key: 'studio', label: '🎛️ Fix-All Studio', port: 7710, script: '_pulse_studio.js', env: 'STUDIO_PORT', done: '_studio_done.json', scope: 'qa', desc: 'everything, one entry' },
  { key: 'card', label: '📣 Ad Card', port: 7700, script: '_ad_card.js', env: 'AD_PORT', done: '_ad_done.json', scope: 'all', desc: 'face images' },
  { key: 'content', label: '🧱 Content 13/13', port: 7702, script: '_content_builder.js', env: 'CONTENT_PORT', done: '_content_done.json', scope: 'qa', desc: 'word rebuilds' },
  { key: 'internal', label: '🖼️ Internal Images', port: 7703, script: '_internal_card.js', env: 'INTERNAL_PORT', done: '_internal_done.json', scope: 'qa', desc: '6 body images' },
  { key: 'booster', label: '📸 Pexels Booster', port: 7704, script: '_pexels_booster.js', env: 'BOOSTER_PORT', done: '_booster_approved.json', scope: 'boost', desc: 'bank 5000 photos' },
];
const byKey = k => TOOLS.find(t => t.key === k);
function up(port) { return new Promise(res => { const s = net.connect({ host: '127.0.0.1', port, timeout: 500 }); s.on('connect', () => { s.destroy(); res(true); }); s.on('error', () => res(false)); s.on('timeout', () => { s.destroy(); res(false); }); }); }
function killPort(port) { try { const out = execSync('netstat -ano -p tcp', { encoding: 'utf8' }); const pids = new Set(); out.split(/\r?\n/).forEach(l => { if (!/LISTENING/i.test(l)) return; const p = l.trim().split(/\s+/); if ((p[1] || '').endsWith(':' + port)) pids.add(p[p.length - 1]); }); pids.forEach(pid => { try { execSync('taskkill /PID ' + pid + ' /F', { stdio: 'ignore' }); } catch (e) {} }); } catch (e) {} }
function startTool(key) { const t = byKey(key); if (!t) return { ok: false, err: 'unknown' }; try { fs.accessSync(WD + '/' + t.script); } catch (e) { return { ok: false, err: 'not built' }; } const env = Object.assign({}, process.env); env[t.env] = String(t.port); try { const c = spawn(process.execPath, [WD + '/' + t.script], { cwd: WD, env, detached: true, stdio: 'ignore', windowsHide: true }); c.unref(); return { ok: true }; } catch (e) { return { ok: false, err: String(e.message || e) }; } }
function doneCount(t) { try { return JSON.parse(fs.readFileSync(WD + '/new/' + t.done, 'utf8')).length; } catch (e) { return 0; } }
function doneListIds(t) { try { return JSON.parse(fs.readFileSync(WD + '/new/' + t.done, 'utf8')); } catch (e) { return []; } }

let _idx = { at: 0, all: [], qa: [] };
async function library(force) { const now = Date.now(); if (!force && _idx.all.length && (now - _idx.at) < 5 * 60000) return _idx; const s = blobStore(); let all = []; if (s) { try { const idx = await s.get('_index.json', { type: 'json' }); all = ((idx && idx.entries) || []).filter(e => e && e.id).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0 })); } catch (e) {} } all.sort((a, b) => (a.ts - b.ts) || String(a.id).localeCompare(String(b.id))); const qa = all.filter(e => /^q\d+$/.test(e.id)); _idx = { at: now, all, qa }; return _idx; }

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>PULSE Control Center</title>
<style>
html,body{margin:0;height:100%;background:#0b0d12;color:#e8e8ea;font-family:system-ui,Arial}
#top{padding:10px 14px;background:#12151c;border-bottom:1px solid #262a33;max-height:62vh;overflow:auto}
.brand{font-weight:900;color:#ffb641;font-size:18px;margin-right:10px}
.tools{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.tool{background:#171a22;border:1px solid #2a2f38;border-radius:12px;padding:10px 12px;min-width:212px}
.tool .h{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px}
.dot{width:10px;height:10px;border-radius:50%;background:#666;display:inline-block}.dot.up{background:#4ce07a;box-shadow:0 0 8px #4ce07a}.dot.down{background:#e0564c}
.tool .d{font-size:11px;color:#8a92a0;margin:3px 0 5px}
.bar{height:7px;background:#0c0f14;border-radius:5px;overflow:hidden;margin:5px 0}.bar>i{display:block;height:100%;background:linear-gradient(90deg,#4ce07a,#5ac8fa)}
.pct{font-size:11px;color:#9aa2ad}
.tool button{font-size:11px;padding:4px 8px;margin:3px 2px 0 0;border-radius:6px;border:1px solid #333;background:#1e2129;color:#e8e8ea;cursor:pointer}
.tool button.open{background:#243b0d;border-color:#6bbf3a;color:#eafff0}.tool button.stop{background:#3a1414;border-color:#a33}.tool button.restart{background:#241d10;border-color:#e8c874}
#bar2{margin-top:10px;font-size:12px;color:#9aa2ad}#bar2 a{color:#8affb0}
#libpanel{margin-top:12px;border-top:1px solid #262a33;padding-top:10px}
#libpanel input{font-size:13px;padding:6px 9px;border-radius:7px;border:1px solid #333;background:#1a1d24;color:#e8e8ea;width:240px}
#liblist{max-height:200px;overflow:auto;border:1px solid #262a33;border-radius:8px;margin-top:8px;font-size:13px}
.lrow{padding:5px 10px;border-bottom:1px solid #1c2029;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lrow:hover{background:#1c2029}
#frameWrap{position:absolute;left:0;right:0;bottom:0;background:#0f1116}iframe{width:100%;height:100%;border:0;background:#0f1116}
.down{display:flex;align-items:center;justify-content:center;height:100%;color:#9aa2ad;font-size:16px;padding:30px;text-align:center}
</style>
<div id=top>
  <span class=brand>⚡ PULSE CONTROL CENTER</span>
  <button onclick=startAll() style="font-size:12px;padding:5px 11px;border-radius:7px;border:1px solid #6bbf3a;background:#243b0d;color:#eafff0">▶ Start all</button>
  <span id=summary style="font-size:12px;color:#9aa2ad;margin-left:8px"></span>
  <div class=tools id=tools></div>
  <div id=bar2>🌐 <a href="https://pulserevops.com/" target=_blank>pulserevops.com</a> · <a href="https://pulserevops.com/?edit=edit-44b2be6132ef" target=_blank>unlock inline title editing</a></div>
  <div id=libpanel>
    <b style="color:#ffb641">📚 Site Q&amp;A list — oldest → newest</b> <span id=libcount style="font-size:12px;color:#9aa2ad"></span>
    <div style="margin-top:6px"><select id=libpillar onchange="loadLib()" style="font-size:13px;padding:6px 9px;border-radius:7px;border:1px solid #333;background:#1a1d24;color:#e8e8ea;max-width:240px"></select> <input id=libq placeholder="filter by id or title…" oninput="renderLib()"> <button onclick="libOrder=(libOrder==='old'?'new':'old');loadLib()" id=ordbtn style="font-size:12px;padding:6px 9px">oldest first</button> <label style="font-size:12px;color:#9aa2ad">dept: <select id=libdept onchange="renderLib()" style="font-size:12px;padding:5px;border-radius:6px;border:1px solid #333;background:#1a1d24;color:#e8e8ea"><option value="face">📣 Ad Cards</option><option value="content">🧱 Content</option><option value="internal">🖼️ Internal</option><option value="all">✅ Fully done</option></select></label> <label style="font-size:12px;color:#9aa2ad"><input type=checkbox id=onlynew onchange="renderLib()"> only new (🔵 never done)</label> <span style="font-size:11px;color:#4ce07a">unchecked = ALL incl. done (green, sorted up)</span></div>
    <div id=liblist></div>
    <div style="text-align:center;margin-top:6px"><button id=morebtn onclick="LIBSHOW+=300;renderLib()" style="font-size:12px;padding:6px 12px">show more</button></div>
  </div>
</div>
<div id=frameWrap><div class=down id=down>pick a tool (Open) or a Q&A row to load it here</div></div>
<script>
var TOOLS=${JSON.stringify(TOOLS.map(t => ({ key: t.key, label: t.label, port: t.port, desc: t.desc, scope: t.scope })))};
var cur=null,LIB=[],LIBSHOW=300,libOrder='old';
var PILLAR_NAME={tl:'CRO Pulse Tools',ca:'Cars',bt:'Boats',aq:'Aquariums',ik:'Industry KPIs',tk:'Tech Stacks',bs:'Book Summaries',st:'Sales Trainings',fr:'Franchises',co:'Collectibles',ai:'AI Infra',gb:'Graphics',bo:'Buildouts',sy:'Style',gp:'GTM Playbooks',ra:'Rev Architecture',pt:'Pets',es:'Espresso',tv:'TVs',rs:'Resorts',cl:'Cologne',lv:'Lux Vacations',ev:'Events',ga:'Gatherings',gm:'Gaming',mv:'Movies',wl:'Wellness',dn:'Dining',nl:'Nightlife',tn:'Towns',sc:'Schools',tc:'Telco',er:'Electronics',q:'Knowledge Q&A',hf:'Home & Family',sw:'Software',sk:'Skills',sp:'Speeches',dr:'Drills',ce:'Pulse News',ed:'Advice',cr:'Crabbing',fs:'Fishing',bo0:'Buildouts'};
function pillarOf(id){var m=String(id).match(/^([a-z]+)/i);return m?m[1].toLowerCase():'?'}
async function populatePillars(){var counts=await fetch('/pillars').then(function(r){return r.json()}).catch(function(){return{}});var keys=Object.keys(counts).sort(function(a,b){if(a==='tl')return -1;if(b==='tl')return 1;return counts[b]-counts[a]});var sel=el('libpillar');sel.innerHTML='<option value="">All pillars</option>'+keys.map(function(p){return '<option value="'+p+'">'+(PILLAR_NAME[p]||p.toUpperCase())+' ('+counts[p].toLocaleString()+')</option>'}).join('');sel.value=counts['tl']?'tl':'';loadLib();}
function el(id){return document.getElementById(id)}
function render(status,stats){
  el('tools').innerHTML=TOOLS.map(function(t){var u=status&&status[t.key];var st=(stats&&stats[t.key])||{done:0,total:0,pct:0};
    return '<div class=tool><div class=h><span class="dot '+(u?'up':'down')+'"></span>'+t.label+'</div><div class=d>:'+t.port+' · '+t.desc+'</div>'
     +'<div class=bar><i style="width:'+st.pct+'%"></i></div><div class=pct>'+st.done.toLocaleString()+' / '+st.total.toLocaleString()+' · <b>'+st.pct+'%</b></div>'
     +'<button class=open onclick="openTool(\\''+t.key+'\\')">Open</button><button onclick="ctl(\\'start\\',\\''+t.key+'\\')">Start</button><button class=stop onclick="ctl(\\'stop\\',\\''+t.key+'\\')">Stop</button><button class=restart onclick="ctl(\\'restart\\',\\''+t.key+'\\')">Restart</button></div>';
  }).join('');
  var upn=TOOLS.filter(function(t){return status&&status[t.key]}).length;el('summary').textContent=upn+'/'+TOOLS.length+' running';
}
function openTool(key){cur=key;var t=TOOLS.filter(function(x){return x.key===key})[0];el('frameWrap').innerHTML='<iframe src="http://localhost:'+t.port+'/"></iframe>';layout();}
function openEntry(id){el('frameWrap').innerHTML='<iframe src="http://localhost:7710/?id='+encodeURIComponent(id)+'"></iframe>';layout();}
async function ctl(action,key){try{await fetch('/ctl?action='+action+'&key='+key)}catch(e){}setTimeout(ping,action==='stop'?400:1700);if(action==='start'||action==='restart')setTimeout(function(){openTool(key)},1900)}
async function startAll(){for(var i=0;i<TOOLS.length;i++){try{await fetch('/ctl?action=start&key='+TOOLS[i].key)}catch(e){}}setTimeout(ping,2000)}
async function ping(){try{var s=await fetch('/status').then(function(r){return r.json()});var st=await fetch('/stats').then(function(r){return r.json()});render(s,st)}catch(e){}}
async function loadLib(){var sc=el('liblist')?el('liblist').scrollTop:0;el('ordbtn').textContent=libOrder==='old'?'oldest first':'newest first';var pil=el('libpillar')?el('libpillar').value:'';var d=await fetch('/library?order='+libOrder+'&pillar='+encodeURIComponent(pil)).then(function(r){return r.json()});LIB=d.items||[];el('libcount').textContent=(pil?(PILLAR_NAME[pil]||pil.toUpperCase())+': ':'')+'('+((d.pillarTotal!=null?d.pillarTotal:d.total)||LIB.length).toLocaleString()+' entries)';if(!LIBSHOW||LIBSHOW<300)LIBSHOW=300;renderLib();if(el('liblist'))el('liblist').scrollTop=sc}
function renderLib(){var q=(el('libq').value||'').toLowerCase();var dept=el('libdept')?el('libdept').value:'face';var onlynew=el('onlynew')&&el('onlynew').checked;function doneFor(e){return dept==='face'?e.face:dept==='content'?e.content:dept==='internal'?e.internal:(e.face&&e.content&&e.internal)}function dstr(ts){if(!ts)return '';var d=new Date(ts);return (d.getMonth()+1)+'/'+d.getDate()}var rows=LIB.filter(function(e){if(onlynew&&doneFor(e))return false;return !q||e.id.toLowerCase().indexOf(q)>=0||(e.q||'').toLowerCase().indexOf(q)>=0});rows=rows.slice().sort(function(a,b){return (doneFor(b)?1:0)-(doneFor(a)?1:0)}).slice(0,LIBSHOW);function dot(on){return '<span style="color:'+(on?'#4ce07a':'#40454d')+';font-weight:900">●</span>'}el('liblist').innerHTML=rows.map(function(e){var dn=doneFor(e);var idc=dn?'#4ce07a':'#a9d8ff';var bl=dn?'border-left:3px solid #4ce07a':'border-left:3px solid transparent';var dt=dn?' <span style="color:#4ce07a;font-size:11px">✓'+dstr(e.ts)+'</span>':'';return '<div class=lrow onclick="openEntry(\\''+e.id+'\\')" title="'+e.id+'" style="'+bl+'">'+dot(e.face)+dot(e.content)+dot(e.internal)+' <a href="https://pulserevops.com/knowledge/'+e.id+'?cb='+Date.now()+'" target=_blank onclick="event.stopPropagation()" style="color:'+idc+';font-weight:'+(dn?'800':'400')+';text-decoration:underline">'+e.advId+'</a>'+dt+' <span style="color:#6b7280;font-size:11px">'+e.id+'</span> '+(e.q||'(blank)').replace(/</g,'&lt;')+'</div>'}).join('')||'<div class=lrow>no matches</div>';}
function layout(){var h=el('top').offsetHeight;el('frameWrap').style.top=h+'px'}
window.addEventListener('resize',layout);
ping();setInterval(ping,5000);populatePillars();setInterval(loadLib,20000);setTimeout(layout,150);setInterval(layout,2500);
</script>`;

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  if (u.pathname === '/status') { const out = {}; await Promise.all(TOOLS.map(async t => { out[t.key] = await up(t.port); })); res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(out)); }
  if (u.pathname === '/stats') {
    const lib = await library(false); const out = {};
    for (const t of TOOLS) { const done = doneCount(t); const total = t.scope === 'all' ? lib.all.length : t.scope === 'qa' ? lib.qa.length : 5000; out[t.key] = { done, total, pct: total ? +(done / total * 100).toFixed(1) : 0 }; }
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(out));
  }
  if (u.pathname === '/pillars') {
    const lib = await library(false); const counts = {};
    lib.all.forEach(e => { const p = String(e.id).toLowerCase().replace(/\d.*$/, ''); counts[p] = (counts[p] || 0) + 1; });
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(counts));
  }
  if (u.pathname === '/library') {
    const lib = await library(false); const pil = String(u.query.pillar || '').toLowerCase();
    const faceD = new Set(doneListIds(byKey('card'))); const contD = new Set([].concat(doneListIds(byKey('content')), doneListIds(byKey('studio')))); const intD = new Set(doneListIds(byKey('internal')));
    let items = pil ? lib.all.filter(e => String(e.id).toLowerCase().replace(/\d.*$/, '') === pil) : lib.all.slice();
    const pillarTotal = items.length;
    if (u.query.order === 'new') items = items.slice().reverse();
    items = items.slice(0, 12000).map(e => ({ id: e.id, advId: advId(e.id), q: e.q, ts: e.ts, face: faceD.has(e.id), content: contD.has(e.id), internal: intD.has(e.id) }));
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ total: lib.all.length, pillarTotal, items }));
  }
  if (u.pathname === '/ctl') { const action = u.query.action, key = u.query.key; const t = byKey(key); if (!t) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":false}'); } let r = { ok: true }; if (action === 'stop') killPort(t.port); else if (action === 'start') r = startTool(key); else if (action === 'restart') { killPort(t.port); await new Promise(z => setTimeout(z, 700)); r = startTool(key); } res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(r)); }
  if (u.pathname === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(PAGE);
}).listen(PORT, () => console.log('[pulse-control] http://localhost:' + PORT + '/'));
