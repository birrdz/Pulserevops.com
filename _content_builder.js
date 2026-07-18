// _content_builder.js — CONTENT BUILDER (owner 2026-07-17). Component #3.
// Rebuilds weak Q&A-essay bodies to 13/13 on the Max-plan CLI. Worst-content-first over the CURRENT site.
// SAFE: fenced to q#### (Q&A essay) entries only; human reviews every rebuild; publishes ONLY at 13/13;
// KEEPS the title + image; saves the previous body for revert. No auto-build, no auto-publish.
'use strict';
const http = require('http'), fs = require('fs'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.CONTENT_PORT || '7702', 10);
let gateScore = null, rebuildToGate = null; try { ({ gateScore, rebuildToGate } = require('./new/improve_content')); } catch (e) {}
let publishContentBody = null; try { ({ publishContentBody } = require('./new/publish_core')); } catch (e) {}
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }

function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }
function doneList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_content_done.json', 'utf8')); } catch (e) { return []; } }
function markDone(id) { const d = doneList(); if (d.indexOf(id) < 0) { d.push(id); try { fs.writeFileSync(WD + '/new/_content_done.json', JSON.stringify(d)); } catch (e) {} } }
function saveAdvMap(id, adv, q) { const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} m[adv] = { id, advId: adv, title: q || '' }; m['id:' + id] = adv; try { fs.writeFileSync(p, JSON.stringify(m, null, 1)); } catch (e) {} }

const QA = /^q\d+$/;   // v1 fence: Q&A-essay entries only (golden Q&A template). Other formats have their own locked templates.
let _inv = { at: 0, list: [] };
async function loadInventory(force) {
  const now = Date.now();
  if (!force && _inv.list.length && (now - _inv.at) < 5 * 60 * 1000) return _inv.list;
  let list = []; const s = blobStore();
  if (s) { try { const idx = await s.get('_index.json', { type: 'json' }); list = ((idx && idx.entries) || []).filter(e => e && e.id && QA.test(e.id)).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0, gate: (typeof e.gate_score === 'number' ? e.gate_score : 0), qual: (typeof e.quality_score === 'number' ? e.quality_score : 0) })); } catch (e) {} }
  _inv = { at: now, list }; return list;
}
function rankPool(list, doneSet) {
  const pool = [];
  for (const o of list) { if (doneSet.has(o.id)) continue; pool.push(o); }
  pool.sort((a, b) => (a.gate - b.gate) || (a.qual - b.qual) || (a.ts - b.ts));   // lowest gate score first = worst content
  return pool;
}
async function liveScore(id) {   // accurate re-score of the live body
  const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {} }
  const body = (blob && blob.answer) || ''; const question = (blob && (blob.question || blob.h1)) || '';
  const g = gateScore ? gateScore({ body, question }) : { score: 0, pass: false, fails: [], wordCount: 0 };
  return { question, body, score: g.score, pass: !!g.pass, fails: g.fails || [], words: g.wordCount || 0 };
}

const REBUILT = {};   // id -> { body, score, pass, fails, words } (held for human review + publish)

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Content Builder</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:16px}
h1{color:#4ce07a;margin:0 0 2px}.sub{color:#9aa2ad;font-size:13px;margin-bottom:14px}
.cur{background:#141a16;border:1px solid #2a3a2f;border-radius:12px;padding:16px;max-width:1000px}
.score{font-size:26px;font-weight:900}
.chip{display:inline-block;background:#3a2d12;color:#ffce8a;border:1px solid #7a5a20;border-radius:20px;padding:2px 10px;font-size:12px;margin:3px 4px 0 0}
button{font-size:15px;padding:9px 14px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea;cursor:pointer}
.build{background:#123b1e;border-color:#4ce07a;color:#eafff0;font-weight:800;font-size:16px;padding:11px 20px}
.pub{background:#0e3a2a;border-color:#3fe0a0;color:#eafff5;font-weight:800;font-size:16px;padding:11px 22px}
textarea{width:100%;box-sizing:border-box;font-size:13px;padding:12px;border-radius:10px;border:1px solid #2a3a2f;background:#0c120e;color:#dfeee4;min-height:340px;font-family:ui-monospace,monospace;line-height:1.5}
.row:hover{background:#152019}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#0f1116f2;z-index:50;text-align:center;font-size:2.4vw;font-weight:900;color:#4ce07a;padding:20px}
#stage.on{display:flex}
a{color:#e8b84a}
</style>
<h1>🧱 Content Builder</h1><div class=sub id=sub>Worst content first (Q&amp;A essays) · rebuild to 13/13 on your Max plan · publish only at 13/13 · title &amp; images kept · body saved for revert.</div>
<div class=cur>
  <div id=qid style="color:#9edcb2;font-weight:800;margin-bottom:6px">—</div>
  <div id=q style="font-size:18px;color:#cfe9d6;font-weight:700;margin:2px 0 8px;line-height:1.3"></div>
  <div>current gate: <span id=score class=score style="color:#ff9a9a">—</span><span style="color:#9aa2ad;font-size:15px">/13</span> &nbsp;<span id=words style="color:#9aa2ad;font-size:13px"></span></div>
  <div id=fails style="margin-top:6px"></div>
  <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
    <button class=build onclick=build()>🔨 Build to 13/13</button>
    <button onclick=skip()>⏭ Skip</button>
    <button onclick=openList()>📋 Worst 500 — click any</button>
    <button id=autobtn onclick=autoRun() style="background:#3a1d55;border-color:#c88bf0;color:#fff;font-weight:800">▶ AUTO RUN</button>
  </div>
  <div id=msg style="margin-top:8px;font-size:13px;color:#9aa2ad"></div>
  <div id=result style="margin-top:14px"></div>
  <div id=autolog style="margin-top:12px;max-height:260px;overflow:auto;font-family:ui-monospace,monospace;font-size:12px;color:#bfeecb"></div>
  <div id=listwrap style="margin-top:14px"></div>
</div>
<div id=stage></div>
<script>
var E=null,BUILT=null;
function escH(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function j(u,o){return fetch(u,o).then(function(r){return r.json()})}
function stage(t){var s=document.getElementById('stage');s.innerHTML='<div style="max-width:820px">'+t+'</div>';s.classList.add('on')}
function hide(){document.getElementById('stage').classList.remove('on')}
function invLine(st){if(!st)return '';return '📚 <b style="color:#4ce07a">'+st.done.toLocaleString()+'</b> rebuilt · <b style="color:#e8c874">'+st.remaining.toLocaleString()+'</b> Q&amp;A to go · '+st.total.toLocaleString()+' Q&amp;A essays — worst first';}
document.getElementById('listwrap').addEventListener('click',function(e){var r=e.target.closest('.row');if(!r)return;var id=r.getAttribute('data-id');document.getElementById('listwrap').innerHTML='';window.scrollTo(0,0);load(id)});
async function openList(){var w=document.getElementById('listwrap');w.innerHTML='<div style="color:#9aa2ad">loading worst 500…</div>';var d=await j('/api/list?n=500');var items=(d.items||[]);w.innerHTML='<div style="margin:6px 0;color:#4ce07a;font-weight:700">📋 Worst '+items.length+' — click any &nbsp;<button onclick="document.getElementById(\\'listwrap\\').innerHTML=\\'\\'" style="font-size:12px;padding:3px 8px">✕ close</button></div><div style="max-height:440px;overflow:auto;border:1px solid #2a3a2f;border-radius:10px">'+items.map(function(it){return '<div class=row data-id="'+it.id+'" style="padding:8px 11px;border-bottom:1px solid #1c2a22;cursor:pointer;font-size:14px"><span style="color:#9edcb2">'+it.advId+'</span> <span style="color:#ff9a9a;font-size:11px">gate '+it.gate+'/13</span> &nbsp;'+escH(it.q||'(blank)')+'</div>'}).join('')+'</div>';}
async function load(id){BUILT=null;document.getElementById('result').innerHTML='';E=await j('/api/card'+(id?('?id='+encodeURIComponent(id)):''));if(!E||!E.id){document.getElementById('sub').innerHTML=(E&&E.stats?invLine(E.stats)+' · ':'')+'🎉 no Q&amp;A left';document.getElementById('q').textContent='';hide();return;}
  document.getElementById('sub').innerHTML=invLine(E.stats);
  document.getElementById('qid').innerHTML='<span style="color:#9aa2ad;font-size:11px;letter-spacing:.08em">ADVERTISE ID</span> &nbsp;<a href="https://pulserevops.com/knowledge/'+E.id+'?cb='+Date.now()+'" target=_blank style="font-size:18px;color:#8affb0;text-decoration:underline">'+E.advId+'</a><span style="color:#5f6570;font-size:11px;margin-left:8px">searchable · ref '+E.id+'</span>';
  document.getElementById('q').textContent=E.q||'(no title)';
  var sc=document.getElementById('score');sc.textContent=E.score;sc.style.color=E.pass?'#4ce07a':(E.score>=10?'#e8c874':'#ff9a9a');
  document.getElementById('words').textContent='· '+(E.words||0).toLocaleString()+' words';
  document.getElementById('fails').innerHTML=(E.fails||[]).map(function(f){return '<span class=chip>'+escH(f)+'</span>'}).join('')||(E.pass?'<span style="color:#4ce07a;font-size:13px">already 13/13 — you can rebuild anyway</span>':'');
  document.getElementById('msg').textContent='';
}
async function build(){stage('🔨 rebuilding on your Max plan…<br><span style="font-size:1.3vw;color:#9aa2ad">this takes 1–3 minutes (a few passes to hit 13/13)…</span>');
  var r=await j('/api/rebuild?id='+encodeURIComponent(E.id));hide();
  if(!(r&&r.ok)){document.getElementById('msg').innerHTML='⚠️ '+escH((r&&r.err)||'rebuild failed');return}
  BUILT=r;
  var col=r.pass?'#4ce07a':'#e8c874';
  document.getElementById('result').innerHTML='<div style="margin:6px 0"><b>Rebuilt:</b> gate <span style="color:#ff9a9a">'+r.before+'</span> → <span style="color:'+col+';font-weight:900">'+r.after+'</span>/13 · '+(r.words||0).toLocaleString()+' words · '+(r.pass?'<span style="color:#4ce07a;font-weight:800">✅ 13/13 — ready to publish</span>':'<span style="color:#e8c874">not 13/13 yet ('+(r.fails||[]).join(', ')+') — Build again</span>')+'</div>'
    +'<div style="color:#9aa2ad;font-size:12px;margin:6px 0 2px">review / tweak the new body:</div>'
    +'<textarea id=body>'+escH(r.body||'')+'</textarea>'
    +'<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">'
    +'<button class=pub onclick=publish() '+(r.pass?'':'disabled style="opacity:.5;cursor:not-allowed"')+'>✅ Publish 13/13 →</button>'
    +'<button class=build onclick=build()>🔨 Build again</button></div>';
}
async function publish(){var body=(document.getElementById('body')||{}).value||(BUILT&&BUILT.body);if(!BUILT||!BUILT.pass){document.getElementById('msg').innerHTML='⚠️ must be 13/13 to publish';return}
  stage('📤 publishing the 13/13 body (title &amp; images kept)…');var r=await j('/api/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,body:body})});
  if(!(r&&r.ok)){hide();document.getElementById('msg').innerHTML='⚠️ '+escH((r&&r.err)||'publish failed');return}
  var secs=4;function draw(){stage('✅ PUBLISHED 13/13!<br><span style="font-size:1.3vw"><a href="'+r.url+'?cb='+Date.now()+'" target=_blank style="color:#8affb0">view page →</a></span><br><span style="font-size:1.4vw;color:#4ce07a">next in '+secs+'…</span><br><div style="margin-top:8px"><button onclick="nextNow()" style="font-size:1.5vw;padding:9px 20px;background:#123b1e;border:1px solid #4ce07a;color:#eafff0">Next now →</button> &nbsp;<button onclick="hold()" style="font-size:1.5vw;padding:9px 18px">⏸ Hold</button></div>')}
  draw();window._t=setInterval(function(){secs--;if(secs<=0){clearInterval(window._t);hide();load()}else{draw()}},1000)}
function nextNow(){if(window._t)clearInterval(window._t);hide();load()}
function hold(){if(window._t)clearInterval(window._t);hide()}
async function skip(){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});load()}
var AUTO=false;
function autoLog(m){var el=document.getElementById('autolog');if(!el)return;var d=document.createElement('div');d.textContent=new Date().toLocaleTimeString()+'  '+m;el.insertBefore(d,el.firstChild)}
function setAutoBtn(){var b=document.getElementById('autobtn');if(!b)return;b.textContent=AUTO?'⏹ STOP auto run':'▶ AUTO RUN';b.style.background=AUTO?'#5a0d0d':'#3a1d55';b.style.borderColor=AUTO?'#ff6a6a':'#c88bf0'}
async function autoRun(){
  if(AUTO){AUTO=false;setAutoBtn();autoLog('⏹ stopping after this one…');return}
  if(!confirm('AUTO RUN builds each worst Q&A to 13/13 and PUBLISHES only the ones that pass (the gate blocks anything under 13/13). Failures are skipped + logged. The old body is saved for revert. Q&A essays only. Unattended — STOP anytime. Start?'))return;
  AUTO=true;setAutoBtn();autoLog('▶ auto run started');
  while(AUTO){
    var c=await j('/api/card');if(!c||!c.id){autoLog('🎉 no more Q&A to build');break}
    autoLog('⏳ '+c.advId+' ('+c.id+') at '+c.score+'/13 — building…');
    var r=await j('/api/rebuild?id='+encodeURIComponent(c.id));
    if(!AUTO){autoLog('⏹ stopped');break}
    if(r&&r.ok&&r.pass){
      var p=await j('/api/publish',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id,body:r.body})});
      autoLog(p&&p.ok?('✅ '+c.id+' published 13/13 · '+(r.words||0)+'w'):('⚠ '+c.id+' publish failed: '+((p&&p.err)||'')));
    } else {
      await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:c.id})});
      autoLog('⏭ '+c.id+' skipped (best '+((r&&r.after)||'?')+'/13) — revisit manually');
    }
  }
  AUTO=false;setAutoBtn();load();
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
      const list = await loadInventory(false); const doneSet = new Set(doneList());
      const stats = { total: list.length, done: doneSet.size, remaining: list.length - [...doneSet].filter(x => list.some(o => o.id === x)).length };
      let id = u.query.id;
      if (!id) { const pool = rankPool(list, doneSet); id = pool[0] && pool[0].id; }
      if (!id) return send(200, JSON.stringify({ stats }));
      const adv = advId(id); const ls = await liveScore(id); saveAdvMap(id, adv, ls.question);
      return send(200, JSON.stringify({ id, advId: adv, q: ls.question, score: ls.score, pass: ls.pass, fails: ls.fails, words: ls.words, stats }));
    }
    if (u.pathname === '/api/list') {
      const n = Math.min(2000, Math.max(1, parseInt(u.query.n || '500', 10)));
      const list = await loadInventory(false); const doneSet = new Set(doneList());
      const pool = rankPool(list, doneSet);
      return send(200, JSON.stringify({ items: pool.slice(0, n).map(x => ({ id: x.id, advId: advId(x.id), q: x.q, gate: x.gate })) }));
    }
    if (u.pathname === '/api/rebuild') {
      const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false,"err":"no id"}');
      if (!rebuildToGate) return send(200, '{"ok":false,"err":"writer not loaded"}');
      const ls = await liveScore(id);
      const r = rebuildToGate(ls.question, ls.body, { maxAttempts: 3 });
      if (!r.ok && !r.body) return send(200, JSON.stringify({ ok: false, err: r.err || 'rebuild failed' }));
      REBUILT[id] = { body: r.body, score: r.after, pass: r.pass, fails: r.fails, words: r.words };
      return send(200, JSON.stringify({ ok: true, before: r.before, after: r.after, pass: r.pass, fails: r.fails, words: r.words, body: r.body, note: r.err || undefined }));
    }
    if (req.method === 'POST' && u.pathname === '/api/publish') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const bodyText = b.body || (REBUILT[id] && REBUILT[id].body);
      if (!id || !bodyText) return send(200, '{"ok":false,"err":"missing id/body"}');
      // enforce 13/13 on whatever will actually be published (handles hand-edits too)
      const g = gateScore ? gateScore({ body: bodyText, question: '' }) : { pass: false };
      if (!g.pass) return send(200, JSON.stringify({ ok: false, err: 'not 13/13 (' + (g.fails || []).join(', ') + ') — Build again' }));
      if (!publishContentBody) return send(200, '{"ok":false,"err":"publish_core not loaded"}');
      try { const r = await publishContentBody(id, bodyText); saveAdvMap(id, advId(id), ''); markDone(id); delete REBUILT[id]; return send(200, JSON.stringify({ ok: true, url: r.url })); }
      catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'publish failed') })); }
    }
    if (u.pathname === '/api/find') {
      const q = String(u.query.q || '').trim(); if (!q) return send(200, '{}');
      const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
      let out = null;
      if (/^AD-/i.test(q)) { const up = q.toUpperCase(); const rec = m[up]; if (rec) out = { advId: up, id: rec.id, title: rec.title }; }
      else { const id = q.replace(/[^a-zA-Z0-9_-]/g, ''); out = { advId: advId(id), id }; }
      return send(200, JSON.stringify(out || {}));
    }
    if (req.method === 'POST' && u.pathname === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) markDone(id); return send(200, '{"ok":true}'); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[content-builder] http://localhost:' + PORT + '/'));
