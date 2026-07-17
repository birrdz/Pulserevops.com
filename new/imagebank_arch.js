// new/imagebank_arch.js — Architecture × Art Image Bank (port 8925). Twin of imagebank.js.
// Same fast approve/reject wall: green ✓ Keep / red ✗ Pass, HD-only, DEDUPED (never repeats).
// Theme: building / architecture MEETS art — iconic, modern, brutalist, geometric, abstract.
// Approved → new/imagebank/arch/img/<id>.jpg + _approved.json. Goal 2,000, reviewed 100 at a time.
// When done: run new/merge_arch_to_cro.js to fold the approved set into what's left of the CRO pool.
'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const PEXELS = process.env.PEXELS_API_KEY;
const PORT = parseInt(process.env.ARCH_PORT || '8925', 10);
const DIR = WD + '/new/imagebank/arch';
const IMG_DIR = DIR + '/img';
fs.mkdirSync(IMG_DIR, { recursive: true });
const APPROVED = DIR + '/_approved.json';
const SEEN = DIR + '/_seen.json';
const TARGET = 2000;

// building-architecture MEETS art — striking, gallery-grade, abstract-leaning
const QUERIES = ['modern architecture', 'architecture abstract', 'brutalist architecture', 'architectural detail', 'building facade', 'geometric architecture', 'architectural photography', 'contemporary architecture', 'concrete architecture', 'minimalist architecture', 'architecture pattern', 'skyscraper abstract', 'architectural lines', 'building geometry', 'futuristic architecture', 'iconic architecture', 'architectural curves', 'glass facade building', 'staircase architecture', 'ceiling architecture', 'symmetry architecture', 'black and white architecture', 'urban architecture', 'facade pattern', 'architecture perspective', 'atrium interior', 'modern building exterior', 'architectural landmark', 'parametric architecture', 'spiral staircase', 'museum architecture', 'opera house architecture', 'cantilever architecture', 'architecture reflection', 'monochrome architecture', 'architecture close up', 'building abstract art', 'facade geometry', 'architecture ceiling pattern', 'sculptural building'];

const load = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const save = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };
const dl = url => new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
function pex(q, page) { return new Promise(res => { https.get('https://api.pexels.com/v1/search?per_page=80&orientation=landscape&size=large&query=' + encodeURIComponent(q) + '&page=' + page, { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); }); }

let qi = 0, pageOf = {};
async function nextBatch(n) {
  const seen = new Set(load(SEEN, []));
  const approved = new Set(load(APPROVED, []).map(x => x.id));
  const out = [];
  let guard = 0;
  while (out.length < n && guard < QUERIES.length * 8) {
    guard++;
    const q = QUERIES[qi % QUERIES.length]; qi++;
    pageOf[q] = (pageOf[q] || 0) + 1;
    const r = await pex(q, pageOf[q]);
    for (const p of (r && r.photos) || []) {
      if (seen.has(p.id) || approved.has(p.id) || out.find(x => x.id === p.id)) continue;
      if ((p.width || 0) < 1600) continue;               // HD only
      out.push({ id: p.id, thumb: p.src.medium, large: p.src.large, full: p.src.large2x || p.src.original || p.src.large, query: q, w: p.width, h: p.height });
      if (out.length >= n) break;
    }
  }
  return out;
}

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><title>Architecture × Art Bank</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0d0d10;color:#e8e6e1;font-family:system-ui,Arial;padding:14px;max-width:640px;margin:auto}
h1{font-size:20px;margin:0 0 2px}.sub{color:#8a8680;font-size:13px}
.bar{height:12px;border-radius:7px;background:#26262e;overflow:hidden;margin:10px 0}.fill{height:100%;width:0;background:linear-gradient(90deg,#22c55e,#E8A33D)}
.top{position:sticky;top:0;background:#0d0d10;padding:8px 0;z-index:5;border-bottom:1px solid #26262e;margin-bottom:12px}
.batch{color:#E8A33D;font-size:12px;font-weight:700;letter-spacing:.04em;margin-top:4px}
.card{border-radius:14px;overflow:hidden;background:#000;border:1px solid #26262e;aspect-ratio:3/2;display:flex;align-items:center;justify-content:center;transition:transform .16s ease,opacity .16s ease}
.card.goL{transform:translateX(-120%) rotate(-6deg);opacity:0}.card.goR{transform:translateX(120%) rotate(6deg);opacity:0}
.card img{width:100%;height:100%;object-fit:cover;display:block}
.meta{color:#8a8680;font-size:12px;text-align:center;margin:8px 0}
.btns{display:flex;gap:12px;margin-top:12px}
.btns button{flex:1;font-size:22px;padding:20px;border-radius:14px;border:0;font-weight:800;cursor:pointer}
.no{background:#7f1020;color:#fff}.yes{background:#1e7a3a;color:#fff}
.hint{color:#8a8680;font-size:13px;text-align:center;margin-top:8px}
</style>
<div class=top>
<h1>🏛️ Architecture × Art — Image Bank</h1><div class=sub id=sub>one at a time · ✓ keep or ✗ pass · deduped, HD only</div>
<div class=bar><div class=fill id=fill></div></div>
<div class=batch id=batch></div>
</div>
<div class=card id=card><img id=big></div>
<div class=meta id=meta></div>
<div class=btns><button class=no onclick="decide(false)">✗ Pass</button><button class=yes onclick="decide(true)">✓ Keep</button></div>
<div class=hint id=cnt>← Pass · Keep → (arrow keys work too)</div>
<script>
var buf=[],bi=0,busy=false,fetching=false,seenThisBatch=0;
async function stats(){var s=await(await fetch('/api/stats')).json();document.getElementById('sub').textContent=s.approved.toLocaleString()+' / '+s.target.toLocaleString()+' kept in your Architecture library';document.getElementById('fill').style.width=Math.min(100,s.approved/s.target*100)+'%';}
function batchLbl(){document.getElementById('batch').textContent='Batch of 100 · '+((seenThisBatch%100)||( seenThisBatch?100:0))+' / 100 reviewed';}
async function fillBuf(){if(fetching)return;fetching=true;try{var d=await(await fetch('/api/next?n=100')).json();buf=buf.concat(d.images||[]);}catch(e){}fetching=false;}
function show(){var c=buf[bi];if(!c){document.getElementById('big').removeAttribute('src');document.getElementById('meta').textContent='loading…';fillBuf().then(show);return;}
  document.getElementById('big').src=c.large||c.full||c.thumb;document.getElementById('meta').textContent=c.w+'×'+c.h+' · '+c.query;
  if(buf.length-bi<12)fillBuf();}
async function decide(keep){if(busy)return;var c=buf[bi];if(!c)return;busy=true;
  fetch('/api/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(keep?{approve:[c],reject:[]}:{approve:[],reject:[c.id]})}).then(function(){if(keep)stats();});
  var card=document.getElementById('card');card.classList.add(keep?'goR':'goL');
  seenThisBatch++;batchLbl();
  setTimeout(function(){bi++;show();card.classList.remove('goR','goL');busy=false;},170);}
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowUp')decide(true);else if(e.key==='ArrowLeft'||e.key==='ArrowDown')decide(false);});
stats();batchLbl();fillBuf().then(show);
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0], q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let b = ''; req.on('data', d => b += d); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/stats') { return send(200, JSON.stringify({ approved: load(APPROVED, []).length, target: TARGET })); }
    if (u === '/api/next') { const imgs = await nextBatch(parseInt(q.get('n') || '100', 10)); return send(200, JSON.stringify({ images: imgs })); }
    if (u === '/api/save' && req.method === 'POST') {
      const b = await body();
      const seen = new Set(load(SEEN, []));
      const approved = load(APPROVED, []);
      for (const id of (b.reject || [])) seen.add(id);
      for (const a of (b.approve || [])) {
        seen.add(a.id);
        if (approved.find(x => x.id === a.id)) continue;
        const buf = await dl(a.full);
        if (!buf || buf.length < 3000) continue;
        fs.writeFileSync(IMG_DIR + '/' + a.id + '.jpg', buf);
        approved.push({ id: a.id, file: a.id + '.jpg', query: a.query, w: a.w, h: a.h });
      }
      save(SEEN, Array.from(seen));
      save(APPROVED, approved);
      return send(200, JSON.stringify({ ok: true, approved: approved.length }));
    }
    return send(404, '{}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[imagebank_arch] Architecture × Art Bank → http://localhost:' + PORT));
