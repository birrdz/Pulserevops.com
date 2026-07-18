// _dressing_maker.js — DRESSING MAKER (owner 2026-07-17). Component #2 next to the Advertising Card tool.
// Fixes terrible TITLES ("dressings"). Worst-first over the whole blob library. AI proposes 3 options,
// you pick/edit one, seal → updates the real H1/<title>/SEO (entry.question) but KEEPS the URL/id, body, image.
'use strict';
const http = require('http'), fs = require('fs'), url = require('url'), crypto = require('crypto');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PORT = parseInt(process.env.DRESS_PORT || '7701', 10);
const { spawnSync } = require('child_process');
let claudeBin = null; try { ({ claudeBin } = require('./new/improve_content')); } catch (e) {}
let publishDressingOnly = null; try { ({ publishDressingOnly } = require('./new/publish_core')); } catch (e) {}
let getStore = null; try { ({ getStore } = require('@netlify/blobs')); } catch (e) {}
function blobStore() { if (!getStore) return null; try { return getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN }); } catch (e) { return null; } }

function advId(id) { let h = 2166136261; const s = String(id); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return 'AD-' + (10000 + (h % 90000)); }
function doneList() { try { return JSON.parse(fs.readFileSync(WD + '/new/_dressing_done.json', 'utf8')); } catch (e) { return []; } }
function markDone(id) { const d = doneList(); if (d.indexOf(id) < 0) { d.push(id); try { fs.writeFileSync(WD + '/new/_dressing_done.json', JSON.stringify(d)); } catch (e) {} } }
function saveAdvMap(id, adv, q) { const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} m[adv] = { id, advId: adv, title: q || '' }; m['id:' + id] = adv; try { fs.writeFileSync(p, JSON.stringify(m, null, 1)); } catch (e) {} }

const ACR = /\b(RevOps|SDR|OTE|CRO|B2B|B2C|KPI|KPIs|AI|SaaS|GTM|CRM|NIL|FDD|TV|TVs|SUV|CBB|ROI|API|SEO|PLG|ARR|MRR|ICP|SLA)\b/g;
// title "badness" score — worst first. Cheap string-only heuristic.
function badness(t) {
  t = String(t || ''); let s = 0; const why = [];
  if (!t.trim()) return { score: 999, why: ['empty'] };
  if (t === t.toLowerCase()) { s += 4; why.push('all lowercase'); }
  const shout = t.replace(ACR, ''); if (shout.replace(/[^A-Za-z]/g, '').length > 8 && shout === shout.toUpperCase()) { s += 4; why.push('ALL CAPS'); }
  if (/^[a-z]/.test(t)) { s += 1; why.push('starts lowercase'); }
  if (t.length < 24) { s += 2; why.push('too short'); }
  if (t.length > 95) { s += 2; why.push('too long'); }
  if (/(\.\.\.|…)\s*$/.test(t)) { s += 3; why.push('truncated'); }
  if (/\s{2,}/.test(t)) { s += 1; why.push('double spaces'); }
  if (/\bhow do you\b.*\bhow do you\b/i.test(t) || /(.{6,})\1/i.test(t)) { s += 2; why.push('repetition'); }
  const outdatable = /\b(best|top|cost|price|pricing|how much|trend|guide|review|latest|2024|2025|2026)\b/i.test(t);
  const yr = t.match(/\b(20\d\d)\b/);
  if (outdatable && !yr) { s += 2; why.push('needs a year'); }
  if (yr && +yr[1] < 2027) { s += 3; why.push('old year ' + yr[1]); }
  if (/[""'']/.test(t)) { s += 1; why.push('stray quotes'); }
  if (/\bunknown\b|\buntitled\b|\bdraft\b/i.test(t)) { s += 4; why.push('placeholder word'); }
  return { score: s, why };
}

let _inv = { at: 0, list: [] };
async function loadInventory(force) {
  const now = Date.now();
  if (!force && _inv.list.length && (now - _inv.at) < 5 * 60 * 1000) return _inv.list;
  let list = []; const s = blobStore();
  if (s) { try { const idx = await s.get('_index.json', { type: 'json' }); list = ((idx && idx.entries) || []).filter(e => e && e.id).map(e => ({ id: e.id, q: e.title || e.question || '', ts: e.ts || 0 })); } catch (e) {} }
  _inv = { at: now, list }; return list;
}
async function scan() {
  const list = await loadInventory(false);
  const doneSet = new Set(doneList());
  let doneCount = 0; const pool = [];
  for (const o of list) { if (doneSet.has(o.id)) { doneCount++; continue; } const b = badness(o.q); pool.push({ id: o.id, q: o.q, ts: o.ts, score: b.score, why: b.why }); }
  pool.sort((a, b) => (b.score - a.score) || (a.ts - b.ts));   // worst dressing first, then oldest
  return { card: pool[0] || null, total: list.length, done: doneCount, remaining: list.length - doneCount };
}

function suggestTitles(question, body) {
  if (!claudeBin) return { ok: false, err: 'Claude CLI not found' };
  const bin = claudeBin(); if (!bin) return { ok: false, err: 'Claude CLI not found' };
  const env = Object.assign({}, process.env); delete env.ANTHROPIC_API_KEY; delete env.ANTHROPIC_AUTH_TOKEN; delete env.CLAUDE_API_KEY;
  const prompt = [
    'You are a title editor for a RevOps knowledge site. Rewrite this page title ("dressing") into 3 stronger options.',
    'HARD RULES:',
    '- Keep the SAME meaning/intent — the page body already answers the original question. Do NOT change what is being asked.',
    '- Clean, specific, compelling. Proper capitalization (Title/sentence case), fix typos. Keep real acronyms uppercase',
    '  (RevOps, SDR, OTE, CRO, B2B, KPI, GTM, CRM, SaaS, ROI, ARR, ICP).',
    '- If the topic is time-sensitive (best/top/cost/pricing/trends/guide), END the title with "in 2027".',
    '- 40 to 90 characters. No fabrication, no clickbait, no quotes around the title.',
    '',
    'CURRENT TITLE: ' + String(question || ''),
    'BODY EXCERPT (context only): ' + String(body || '').replace(/\s+/g, ' ').slice(0, 600),
    '',
    'Output EXACTLY three lines, each starting "1) ", "2) ", "3) " and nothing else.',
  ].join('\n');
  const r = spawnSync(bin, ['-p', '--output-format', 'text'], { input: prompt, encoding: 'utf8', timeout: 90000, maxBuffer: 1024 * 1024 * 8, windowsHide: true, env });
  if (r.error) return { ok: false, err: String(r.error.message || r.error) };
  if (r.status && r.status !== 0) return { ok: false, err: 'LLM call failed (exit ' + r.status + ')' };
  const out = String(r.stdout || '');
  const opts = [];
  out.split(/\r?\n/).forEach(line => { const m = line.match(/^\s*[1-3][).\]]\s*(.+?)\s*$/); if (m && m[1]) opts.push(m[1].replace(/^["']|["']$/g, '').trim()); });
  if (!opts.length) { // fallback: any non-empty lines
    out.split(/\r?\n/).map(x => x.trim()).filter(x => x.length > 15 && x.length < 120).slice(0, 3).forEach(x => opts.push(x));
  }
  if (!opts.length) return { ok: false, err: 'LLM returned no usable titles' };
  return { ok: true, options: opts.slice(0, 3) };
}

const PAGE = `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Dressing Maker</title>
<style>
body{margin:0;background:#0f1116;color:#e8e8ea;font-family:system-ui,Arial;padding:16px}
h1{color:#c88bf0;margin:0 0 2px}.sub{color:#9aa2ad;font-size:13px;margin-bottom:14px}
.cur{background:#171a22;border:1px solid #333;border-radius:12px;padding:16px;max-width:900px}
.chip{display:inline-block;background:#3a1d1d;color:#ff9a9a;border:1px solid #a33;border-radius:20px;padding:2px 10px;font-size:12px;margin:3px 4px 0 0}
.opt{display:block;width:100%;text-align:left;margin:8px 0;padding:12px 14px;border:1px solid #333;border-radius:10px;background:#1a1d24;color:#eafff0;font-size:16px;cursor:pointer;line-height:1.35}
.opt:hover{border-color:#c88bf0;background:#221a2b}
.row:hover{background:#1c2029}
textarea{width:100%;box-sizing:border-box;font-size:18px;padding:12px;border-radius:10px;border:1px solid #c88bf0;background:#12151c;color:#fff;font-weight:700;line-height:1.35;min-height:70px;font-family:inherit}
button{font-size:15px;padding:9px 14px;border-radius:8px;border:1px solid #333;background:#1a1d24;color:#e8e8ea;cursor:pointer}
.seal{background:#3a1d55;border-color:#c88bf0;color:#fff;font-weight:800;font-size:17px;padding:12px 24px}
#stage{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#0f1116f2;z-index:50;text-align:center;font-size:3vw;font-weight:900;color:#c88bf0;padding:20px}
#stage.on{display:flex}
a{color:#e8b84a}
</style>
<h1>✍️ Dressing Maker</h1><div class=sub id=sub>Fixing the worst titles first · AI proposes 3 · you pick/edit · seal updates the real H1/SEO (URL, body, image untouched).</div>
<div class=cur>
  <div id=qid style="color:#c8a8f0;font-weight:800;margin-bottom:6px">—</div>
  <div style="color:#9aa2ad;font-size:11px;letter-spacing:.08em">CURRENT DRESSING</div>
  <div id=cur style="font-size:19px;color:#ffcaca;font-weight:700;margin:4px 0 6px;line-height:1.3"></div>
  <div id=why></div>
  <div style="margin:16px 0 6px;color:#9aa2ad;font-size:11px;letter-spacing:.08em">✨ NEW DRESSING — pick one, then tweak if you want</div>
  <div id=opts style="color:#9aa2ad;font-size:14px">generating 3 options…</div>
  <textarea id=box placeholder="the new dressing (H1) goes here…"></textarea>
  <div id=live style="font-size:12px;color:#9aa2ad;margin:6px 0 2px">preview H1 → <span id=livep style="color:#eac15c;font-weight:800"></span></div>
  <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
    <button class=seal onclick=seal()>🔒 Seal new dressing →</button>
    <button onclick=regen()>↻ 3 new options</button>
    <button onclick=skip()>⏭ Skip</button>
    <button onclick=openList()>📋 Worst 500 — click any to edit</button>
  </div>
  <div id=msg style="margin-top:8px;font-size:13px;color:#9aa2ad"></div>
  <div id=listwrap style="margin-top:14px"></div>
</div>
<div id=stage></div>
<script>
var E=null,LAST=null,OPTS=[];
function escH(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]})}
function j(u,o){return fetch(u,o).then(function(r){return r.json()})}
function stage(t){var s=document.getElementById('stage');s.innerHTML='<div style="max-width:820px">'+t+'</div>';s.classList.add('on')}
function hide(){document.getElementById('stage').classList.remove('on')}
function invLine(st){if(!st)return '';return '📚 <b style="color:#c88bf0">'+st.done.toLocaleString()+'</b> dressings fixed · <b style="color:#e8c874">'+st.remaining.toLocaleString()+'</b> to go · '+st.total.toLocaleString()+' total — worst first';}
document.getElementById('box').addEventListener('input',function(){document.getElementById('livep').textContent=this.value});
document.getElementById('opts').addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b)return;var i=+b.getAttribute('data-i');if(OPTS[i]!=null){document.getElementById('box').value=OPTS[i];document.getElementById('livep').textContent=OPTS[i]}});
async function openList(){var w=document.getElementById('listwrap');w.innerHTML='<div style="color:#9aa2ad">loading worst 500…</div>';var d=await j('/api/list?n=500');var items=(d.items||[]);w.innerHTML='<div style="margin:6px 0;color:#c88bf0;font-weight:700">📋 Worst '+items.length+' dressings — click any to edit &nbsp;<button onclick="document.getElementById(\\'listwrap\\').innerHTML=\\'\\'" style="font-size:12px;padding:3px 8px">✕ close</button></div><div style="max-height:440px;overflow:auto;border:1px solid #333;border-radius:10px">'+items.map(function(it){return '<div class=row data-id="'+it.id+'" style="padding:8px 11px;border-bottom:1px solid #23262e;cursor:pointer;font-size:14px"><span style="color:#c8a8f0">'+it.advId+'</span> <span style="color:#ff9a9a;font-size:11px">[bad '+it.score+']</span> &nbsp;'+escH(it.q||'(blank title)')+'</div>'}).join('')+'</div>';}
document.getElementById('listwrap').addEventListener('click',function(e){var r=e.target.closest('.row');if(!r)return;var id=r.getAttribute('data-id');document.getElementById('listwrap').innerHTML='';window.scrollTo(0,0);load(id)});
async function load(id){E=await j('/api/card'+(id?('?id='+encodeURIComponent(id)):''));if(!E||!E.id){document.getElementById('sub').innerHTML=(E&&E.stats?invLine(E.stats)+' · ':'')+'🎉 no dressings left';document.getElementById('cur').textContent='';document.getElementById('opts').textContent='';hide();return;}
  document.getElementById('sub').innerHTML=invLine(E.stats);
  document.getElementById('qid').innerHTML='<span style="color:#9aa2ad;font-size:11px;letter-spacing:.08em">ADVERTISE ID</span> &nbsp;<b style="font-size:18px;color:#eafff0">'+E.advId+'</b><span style="color:#5f6570;font-size:11px;margin-left:8px">searchable · ref '+E.id+'</span>';
  document.getElementById('cur').textContent=E.q||'(blank)';
  document.getElementById('why').innerHTML=(E.why||[]).map(function(w){return '<span class=chip>'+escH(w)+'</span>'}).join('')||'<span style="color:#6b7;font-size:12px">no obvious problems — polish anyway</span>';
  document.getElementById('box').value='';document.getElementById('livep').textContent='';document.getElementById('msg').textContent='';
  document.getElementById('opts').textContent='generating 3 options…';regen();
}
async function regen(){document.getElementById('opts').textContent='✨ generating 3 options…';var r=await j('/api/suggest?id='+encodeURIComponent(E.id));if(!(r&&r.ok)){document.getElementById('opts').innerHTML='<span style="color:#ff8a8a">⚠ '+escH((r&&r.err)||'failed')+' — type one below</span>';return}OPTS=r.options||[];document.getElementById('opts').innerHTML=OPTS.map(function(o,i){return '<button class=opt data-i="'+i+'">'+escH(o)+'</button>'}).join('');if(OPTS[0]){document.getElementById('box').value=OPTS[0];document.getElementById('livep').textContent=OPTS[0]}}
async function seal(){var t=(document.getElementById('box').value||'').trim();if(t.length<8){document.getElementById('msg').innerHTML='⚠️ pick or type a dressing (min 8 chars)';return}
  stage('🔒 sealing the new dressing…');var r=await j('/api/set',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id,dressing:t})});
  if(!(r&&r.ok)){hide();document.getElementById('msg').innerHTML='⚠️ '+((r&&r.err)||'failed');return}
  LAST={ref:E.id,adv:E.advId,url:r.url,title:t};var secs=4;
  function draw(){stage('✅ DRESSING UPDATED — live H1/SEO<br><span style="font-size:1.4vw;color:#eac15c;display:block;margin:8px auto;max-width:760px">"'+escH(t)+'"</span><span style="font-size:1.2vw"><a href="'+escH(r.url)+'?cb='+Date.now()+'" target=_blank style="color:#8affb0">view page →</a></span><br><span style="font-size:1.4vw;color:#c88bf0">next in '+secs+'…</span><br><div style="margin-top:8px"><button onclick="nextNow()" style="font-size:1.6vw;padding:9px 20px;background:#3a1d55;border:1px solid #c88bf0;color:#fff">Next now →</button> &nbsp;<button onclick="holdIt()" style="font-size:1.6vw;padding:9px 18px">⏸ Hold</button></div>')}
  draw();window._t=setInterval(function(){secs--;if(secs<=0){clearInterval(window._t);hide();load()}else{draw()}},1000)}
function nextNow(){if(window._t)clearInterval(window._t);hide();load()}
function holdIt(){if(window._t)clearInterval(window._t);stage('⏸ held<br><span style="font-size:1.3vw"><a href="'+escH(LAST.url)+'?cb='+Date.now()+'" target=_blank style="color:#8affb0">'+escH(LAST.adv)+' — view page →</a></span><br><div style="margin-top:10px"><button onclick="nextNow()" style="font-size:1.6vw;padding:9px 22px;background:#3a1d55;border:1px solid #c88bf0;color:#fff">Next dressing →</button></div>')}
async function skip(){await j('/api/skip',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:E.id})});load()}
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
      const s = await scan(); const stats = { total: s.total, done: s.done, remaining: s.remaining };
      let e = s.card;
      if (u.query.id) { const list = await loadInventory(false); const f = list.find(o => o.id === u.query.id); e = f ? (function () { const b = badness(f.q); return { id: f.id, q: f.q, why: b.why, score: b.score }; })() : null; }
      if (!e) return send(200, JSON.stringify({ stats }));
      const adv = advId(e.id); saveAdvMap(e.id, adv, e.q);
      return send(200, JSON.stringify({ id: e.id, advId: adv, q: e.q, why: e.why, score: e.score, stats }));
    }
    if (u.pathname === '/api/list') {
      const n = Math.min(2000, Math.max(1, parseInt(u.query.n || '500', 10)));
      const list = await loadInventory(false); const doneSet = new Set(doneList());
      const pool = [];
      for (const o of list) { if (doneSet.has(o.id)) continue; const b = badness(o.q); pool.push({ id: o.id, q: o.q, score: b.score }); }
      pool.sort((a, b) => (b.score - a.score) || 0);
      return send(200, JSON.stringify({ items: pool.slice(0, n).map(x => ({ id: x.id, advId: advId(x.id), q: x.q, score: x.score })) }));
    }
    if (u.pathname === '/api/suggest') {
      const id = String(u.query.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (!id) return send(200, '{"ok":false,"err":"no id"}');
      const s = blobStore(); let blob = null; if (s) { try { blob = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {} }
      const q = (blob && (blob.question || blob.h1)) || '';
      const bodyTxt = (blob && blob.answer) || '';
      const r = suggestTitles(q, bodyTxt);
      return send(200, JSON.stringify(r));
    }
    if (u.pathname === '/api/find') {
      const q = String(u.query.q || '').trim(); if (!q) return send(200, '{}');
      const p = WD + '/new/_advid_map.json'; let m = {}; try { m = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
      let out = null;
      if (/^AD-/i.test(q)) { const up = q.toUpperCase(); const rec = m[up]; if (rec) out = { advId: up, id: rec.id, title: rec.title }; else { const list = await loadInventory(false); const hit = list.find(o => advId(o.id) === up); if (hit) out = { advId: up, id: hit.id, title: hit.q }; } }
      else { const id = q.replace(/[^a-zA-Z0-9_-]/g, ''); out = { advId: advId(id), id }; }
      return send(200, JSON.stringify(out || {}));
    }
    if (req.method === 'POST' && u.pathname === '/api/set') {
      const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); const dressing = b.dressing;
      if (!id || !dressing) return send(200, '{"ok":false,"err":"missing id/dressing"}');
      if (!publishDressingOnly) return send(200, '{"ok":false,"err":"publish_core not loaded"}');
      try { const r = await publishDressingOnly(id, dressing); saveAdvMap(id, advId(id), r.title); markDone(id); return send(200, JSON.stringify({ ok: true, url: r.url, prev: r.prev, title: r.title })); }
      catch (e) { return send(200, JSON.stringify({ ok: false, err: String((e && e.message) || 'set failed') })); }
    }
    if (req.method === 'POST' && u.pathname === '/api/skip') { const b = await body(); const id = String(b.id || '').replace(/[^a-zA-Z0-9_-]/g, ''); if (id) markDone(id); return send(200, '{"ok":true}'); }
    return send(404, '{"err":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ err: String((e && e.message) || e) })); }
}).listen(PORT, () => console.log('[dressing-maker] http://localhost:' + PORT + '/'));
