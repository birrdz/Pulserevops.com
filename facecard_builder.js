// facecard_builder.js — KORY'S FACE CARD BUILDER (2026-07-15).
// Manual, owner-driven face cards. Pipeline no longer touches images/titles — you do, here.
// Per entry: see the question + current image → type/tweak a search → pick a CLEAN Pexels photo
// (no baked title, ever) → it bakes a static file at assets/qa/<id>.jpg (+ .sq). Deploy when ready.
'use strict';
const http = require('http');
const fs = require('fs');
const https = require('https');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PEXELS = process.env.PEXELS_API_KEY;
const PORT = parseInt(process.env.FCB_PORT || '8920', 10);
const QA = WD + '/assets/qa';
const REC = WD + '/sim/facecard_builder_receipts.md';
try { fs.mkdirSync(WD + '/sim', { recursive: true }); } catch (e) {}

const PNAMES = { tl:'Pulse Tools', ca:'Cars', bt:'Boats', aq:'Aquariums', ik:'Industry KPIs', tk:'Tech Stacks', bs:'Book Summaries', st:'Sales Trainings', fr:'Franchises', co:'Collectibles', ai:'AI Infra', gb:'Graphics', bo:'Buildouts', sy:'Style', gp:'GTM Playbooks', ra:'Rev Architecture', pt:'Pets', es:'Espresso', tv:'TVs', rs:'Resorts', cl:'Cologne', lv:'Lux Vacations', ev:'Events', ga:'Gatherings', gm:'Gaming', mv:'Movies', wl:'Wellness', dn:'Dining', nl:'Nightlife', q:'Q&A', hf:'Home & Family', sw:'Software', sp:'Sports' };
const pOf = id => (String(id).match(/^([a-z]+)\d/i) || [, ''])[1].toLowerCase();

let idxCache = { at: 0, entries: null };
async function loadEntries() {
  if (idxCache.entries && Date.now() - idxCache.at < 30000) return idxCache.entries;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && !/^vq_/i.test(String(e.id)));
  idxCache = { at: Date.now(), entries: es };
  return es;
}
// smart default query from the question — concrete nouns, drop filler + years
function queryFor(q) {
  const stop = new Set(['what','whats','how','why','is','are','should','do','does','the','a','an','of','to','in','on','for','and','or','with','you','your','i','my','can','when','where','which','best','ideal','2027','2026','2028']);
  return String(q || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stop.has(w)).slice(0, 4).join(' ');
}
function pexSearch(q) {
  return new Promise(res => {
    https.get('https://api.pexels.com/v1/search?per_page=12&orientation=landscape&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS } }, r => {
      let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } });
    }).on('error', () => res(null));
  });
}
function dl(url) {
  return new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
}
function receipt(id, url, bytes) {
  if (!fs.existsSync(REC)) fs.writeFileSync(REC, '# FACE CARD BUILDER — owner-picked clean face cards. Append-only.\n\n');
  fs.appendFileSync(REC, `- ${new Date().toISOString()} · ${id} · ${bytes}B · ${url}\n`);
}
function bakedCount() { try { return new Set(fs.readFileSync(REC, 'utf8').split('\n').map(l => (l.match(/·\s*([a-z]+\d[a-z0-9]*)\s*·/i) || [])[1]).filter(Boolean)).size; } catch (e) { return 0; } }

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
<title>Kory's Face Card Builder</title>
<style>
body{margin:0;background:#0d0d10;color:#e8e6e1;font-family:system-ui,Arial;padding:16px;max-width:1100px;margin:auto}
h1{font-size:22px;margin:0 0 4px}.sub{color:#8a8680;font-size:13px;margin-bottom:14px}
select,input,button{font-size:15px;padding:9px 11px;border-radius:8px;border:1px solid #2a2a32;background:#17171c;color:#e8e6e1}
button{background:#26262e;font-weight:700;cursor:pointer}button:hover{background:#33333d}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}
.entry{border:1px solid #24242a;border-radius:10px;padding:10px;margin:8px 0;background:#141419;cursor:pointer}
.entry.sel{border-color:#F6C445}
.eq{font-weight:700;font-size:15px}.eid{color:#8a8680;font-size:12px}
.cands{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px}
.cand{border:2px solid transparent;border-radius:8px;overflow:hidden;cursor:pointer;background:#000}
.cand img{width:100%;height:100px;object-fit:cover;display:block}
.cand:hover{border-color:#F6C445}
.cur{max-width:260px;border-radius:8px;border:1px solid #2a2a32;margin-top:6px}
.stat{color:#8a8680;font-size:13px;margin-top:6px}.ok{color:#22c55e}.warn{color:#f59e0b}
.bar{background:#141419;border:1px solid #26262e;border-radius:10px;padding:10px 14px;margin-bottom:12px}
</style>
<h1>🖼️ Kory's Face Card Builder</h1>
<div class=sub>Pick a CLEAN photo per entry — no baked titles, ever. It bakes a static file; deploy when ready. <b id=bcount>0</b> baked this session.</div>
<div class=bar>
  <div class=row>
    <select id=pillar onchange="loadList()"><option value="">— pick a pillar —</option></select>
    <select id=filter onchange="loadList()"><option value=all>all entries</option><option value=needs selected>needs a face card (no static file)</option></select>
    <button onclick="loadList()">↻ refresh</button>
  </div>
</div>
<div id=list></div>
<div id=work style="display:none">
  <hr style="border-color:#24242a">
  <div class=eq id=wq></div><div class=eid id=wid></div>
  <div>current: <img class=cur id=wcur src="" onerror="this.style.opacity=.2"></div>
  <div class=row><input id=q placeholder="search words (concrete nouns)" style="flex:1;min-width:200px"><button onclick="search()">🔍 Search Pexels</button></div>
  <div class=stat id=wstat></div>
  <div class=cands id=cands></div>
</div>
<script>
let sel=null;
async function loadPillars(){const es=await(await fetch('/api/pillars')).json();const s=document.getElementById('pillar');for(const p of es.pillars)s.insertAdjacentHTML('beforeend','<option value="'+p.p+'">'+p.name+' ('+p.n+')</option>');}
async function loadList(){
  const pil=document.getElementById('pillar').value,f=document.getElementById('filter').value;
  const box=document.getElementById('list');if(!pil){box.innerHTML='<div class=sub>pick a pillar</div>';return;}
  box.innerHTML='<div class=sub>loading…</div>';
  const d=await(await fetch('/api/entries?pillar='+pil+'&filter='+f)).json();
  box.innerHTML=(d.entries||[]).map(e=>'<div class=entry data-id="'+e.id+'" onclick=pick(this)><div class=eq>'+esc(e.q)+'</div><div class=eid>'+e.id+' · '+(e.cover||'?')+(e.hasStatic?'':' · <span class=warn>no static</span>')+'</div></div>').join('')||'<div class=sub>none</div>';
}
function esc(s){return String(s==null?'':s).replace(/</g,'&lt;');}
async function pick(el){
  document.querySelectorAll('.entry').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');
  sel=el.getAttribute('data-id');
  const d=await(await fetch('/api/entry?id='+sel)).json();
  document.getElementById('work').style.display='block';
  document.getElementById('wq').textContent=d.q;document.getElementById('wid').textContent=d.id;
  document.getElementById('wcur').src='https://pulserevops.com/assets/qa/'+d.id+'.jpg?t='+Date.now();
  document.getElementById('q').value=d.query;document.getElementById('cands').innerHTML='';document.getElementById('wstat').textContent='';
  window.scrollTo(0,document.body.scrollHeight);
  search();
}
async function search(){
  const q=document.getElementById('q').value;const st=document.getElementById('wstat');st.textContent='searching Pexels…';
  const d=await(await fetch('/api/pexels?q='+encodeURIComponent(q))).json();
  const box=document.getElementById('cands');
  box.innerHTML=(d.photos||[]).map(p=>'<div class=cand onclick=\\'bake("'+p.full.replace(/"/g,'')+'")\\'><img src="'+p.thumb+'"><div class=eid style=padding:4px>'+esc((p.alt||'').slice(0,40))+'</div></div>').join('');
  st.textContent=(d.photos||[]).length+' candidates — click one to bake it (no text added)';
}
async function bake(url){
  const st=document.getElementById('wstat');st.textContent='baking…';
  const r=await(await fetch('/api/bake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:sel,url:url})})).json();
  if(r.ok){st.innerHTML='<span class=ok>✓ baked '+r.bytes+'B — assets/qa/'+sel+'.jpg (deploy to go live)</span>';document.getElementById('wcur').src='/local/'+sel+'.jpg?t='+Date.now();document.getElementById('bcount').textContent=r.count;}
  else st.innerHTML='<span class=warn>✗ '+(r.err||'failed')+'</span>';
}
loadPillars();
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0];
  const q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  try {
    if (u === '/' ) return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/pillars') { const es = await loadEntries(); const by = {}; for (const e of es) { const p = pOf(e.id); if (PNAMES[p]) by[p] = (by[p] || 0) + 1; } const pillars = Object.keys(by).sort((a, b) => by[a] - by[b]).map(p => ({ p, name: PNAMES[p], n: by[p] })); return send(200, JSON.stringify({ pillars })); }
    if (u === '/api/entries') { const es = await loadEntries(); const pil = q.get('pillar'), f = q.get('filter'); let list = es.filter(e => pOf(e.id) === pil); if (f === 'needs') list = list.filter(e => !fs.existsSync(QA + '/' + e.id + '.jpg')); list = list.slice(0, 300).map(e => ({ id: e.id, q: e.question || e.title || e.id, cover: e.cover_src, hasStatic: fs.existsSync(QA + '/' + e.id + '.jpg') })); return send(200, JSON.stringify({ entries: list })); }
    if (u === '/api/entry') { const es = await loadEntries(); const e = es.find(x => x.id === q.get('id')) || {}; return send(200, JSON.stringify({ id: e.id, q: e.question || e.title || e.id, query: queryFor(e.question || e.title) })); }
    if (u === '/api/pexels') { const r = await pexSearch(q.get('q') || 'business'); const photos = ((r && r.photos) || []).map(p => ({ thumb: p.src.medium, full: p.src.large2x || p.src.original || p.src.large, alt: p.alt || '' })); return send(200, JSON.stringify({ photos })); }
    if (u.startsWith('/local/')) { const id = u.slice(7).replace(/\.jpg.*/, ''); try { return send(200, fs.readFileSync(QA + '/' + id + '.jpg'), 'image/jpeg'); } catch (e) { return send(404, 'x'); } }
    if (req.method === 'POST' && u === '/api/bake') {
      let body = ''; req.on('data', d => body += d); await new Promise(r => req.on('end', r));
      const { id, url } = JSON.parse(body || '{}');
      if (!id || !url) return send(400, '{"ok":false,"err":"missing id/url"}');
      const buf = await dl(url);
      if (!buf || buf.length < 500) return send(200, '{"ok":false,"err":"download failed"}');
      fs.writeFileSync(QA + '/' + id + '.jpg', buf);          // base (what the template constructs)
      fs.writeFileSync(QA + '/' + id + '.sq.jpg', buf);       // square variant
      receipt(id, url, buf.length);
      return send(200, JSON.stringify({ ok: true, bytes: buf.length, count: bakedCount() }));
    }
    return send(404, '{"error":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[facecard] Kory\'s Face Card Builder → http://localhost:' + PORT + '  (LAN :' + PORT + ')'));
