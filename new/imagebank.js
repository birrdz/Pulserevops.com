// new/imagebank.js — CRO Image Bank (port 8924). A fast approve/reject wall.
// Pulls HD Pexels images for CRO / Chief Revenue Officer content, 50 at a time, DEDUPED (never repeats).
// Tap the good ones → Save → they download to a reusable local library. Un-tapped ones are discarded
// (remembered so they never show again). Goal: 2,000 approved. That library then feeds future CRO builds.
'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const PEXELS = process.env.PEXELS_API_KEY;
const PORT = parseInt(process.env.BANK_PORT || '8924', 10);
const DIR = WD + '/new/imagebank';
const CRO_DIR = DIR + '/cro';
fs.mkdirSync(CRO_DIR, { recursive: true });
const APPROVED = DIR + '/_approved.json';
const SEEN = DIR + '/_seen.json';
const TARGET = 2000;

const QUERIES = ['business executive', 'revenue growth chart', 'sales team meeting', 'corporate boardroom', 'business leadership', 'business handshake', 'team meeting office', 'financial dashboard', 'business strategy', 'businesswoman executive', 'startup office', 'business presentation', 'data analytics screen', 'corporate finance', 'business growth graph', 'conference room', 'sales pipeline', 'business planning', 'modern office', 'business technology laptop', 'professional business people', 'executive leadership', 'office collaboration', 'business negotiation', 'corporate meeting', 'business analytics', 'business success', 'CEO office', 'business consulting', 'marketing strategy', 'sales growth', 'business chart'];

const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const NOTIFY_TO = 'koryjordanwhite@gmail.com';
const FLAG_2000 = DIR + '/_notified_2000.flag';
async function notify2000(count) {
  if (!RESEND || fs.existsSync(FLAG_2000)) return;
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [NOTIFY_TO], subject: '🎉 CRO Image Bank hit 2,000!', html: '<div style="font-family:system-ui;font-size:16px"><h2>🎉 You banked 2,000 CRO images!</h2><p>Your reusable CRO library is stocked (' + count + ' approved). Tell Claude "wire the library in" and future CRO fixes will pull covers + inside images straight from it.</p></div>' }) });
    if (r.ok) { fs.writeFileSync(FLAG_2000, new Date().toISOString()); console.log('[imagebank] 🎉 2000 reached — emailed ' + NOTIFY_TO); }
  } catch (e) {}
}
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const save = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };
const dl = url => new Promise(res => { https.get(url, r => { if (r.statusCode !== 200) { r.resume(); return res(null); } const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c))); }).on('error', () => res(null)); });
function pex(q, page) { return new Promise(res => { https.get('https://api.pexels.com/v1/search?per_page=40&orientation=landscape&size=large&query=' + encodeURIComponent(q) + '&page=' + page, { headers: { Authorization: PEXELS } }, r => { let s = ''; r.on('data', d => s += d); r.on('end', () => { try { res(JSON.parse(s)); } catch (e) { res(null); } }); }).on('error', () => res(null)); }); }

let qi = 0, pageOf = {};
async function nextBatch(n) {
  const seen = new Set(load(SEEN, []));
  const out = [];
  let guard = 0;
  while (out.length < n && guard < QUERIES.length * 6) {
    guard++;
    const q = QUERIES[qi % QUERIES.length]; qi++;
    pageOf[q] = (pageOf[q] || 0) + 1;
    const r = await pex(q, pageOf[q]);
    for (const p of (r && r.photos) || []) {
      if (seen.has(p.id) || out.find(x => x.id === p.id)) continue;
      if ((p.width || 0) < 1600) continue;               // HD only
      out.push({ id: p.id, thumb: p.src.medium, large: p.src.large, full: p.src.large2x || p.src.original || p.src.large, query: q, w: p.width, h: p.height });
      if (out.length >= n) break;
    }
  }
  return out;
}

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><title>CRO Image Bank</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0d0d10;color:#e8e6e1;font-family:system-ui,Arial;padding:14px;max-width:640px;margin:auto}
h1{font-size:20px;margin:0 0 2px}.sub{color:#8a8680;font-size:13px}
.bar{height:12px;border-radius:7px;background:#26262e;overflow:hidden;margin:10px 0}.fill{height:100%;width:0;background:linear-gradient(90deg,#22c55e,#FF1493)}
.top{position:sticky;top:0;background:#0d0d10;padding:8px 0;z-index:5;border-bottom:1px solid #26262e;margin-bottom:12px}
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
<h1>🖼️ CRO Image Bank</h1><div class=sub id=sub>one at a time · ✓ keep or ✗ pass · deduped, HD only</div>
<div class=bar><div class=fill id=fill></div></div>
</div>
<div class=card id=card><img id=big></div>
<div class=meta id=meta></div>
<div class=btns><button class=no onclick="decide(false)">✗ Pass</button><button class=yes onclick="decide(true)">✓ Keep</button></div>
<div class=hint id=cnt>← Pass · Keep → (arrow keys work too)</div>
<script>
var buf=[],bi=0,busy=false,fetching=false;
async function stats(){var s=await(await fetch('/api/stats')).json();document.getElementById('sub').textContent=s.approved.toLocaleString()+' / '+s.target.toLocaleString()+' kept in your CRO library';document.getElementById('fill').style.width=Math.min(100,s.approved/s.target*100)+'%';}
async function fillBuf(){if(fetching)return;fetching=true;try{var d=await(await fetch('/api/next?n=50')).json();buf=buf.concat(d.images||[]);}catch(e){}fetching=false;}
function show(){var c=buf[bi];if(!c){document.getElementById('big').removeAttribute('src');document.getElementById('meta').textContent='loading…';fillBuf().then(show);return;}
  document.getElementById('big').src=c.large||c.full||c.thumb;document.getElementById('meta').textContent=c.w+'×'+c.h+' · '+c.query;
  if(buf.length-bi<8)fillBuf();}
async function decide(keep){if(busy)return;var c=buf[bi];if(!c)return;busy=true;
  fetch('/api/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(keep?{approve:[c],reject:[]}:{approve:[],reject:[c.id]})}).then(function(){if(keep)stats();});
  var card=document.getElementById('card');card.classList.add(keep?'goR':'goL');
  setTimeout(function(){bi++;show();card.classList.remove('goR','goL');busy=false;},170);}
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowUp')decide(true);else if(e.key==='ArrowLeft'||e.key==='ArrowDown')decide(false);});
stats();fillBuf().then(show);
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0], q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  const body = () => new Promise(r => { let b = ''; req.on('data', d => b += d); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); });
  try {
    if (u === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/stats') { return send(200, JSON.stringify({ approved: load(APPROVED, []).length, target: TARGET })); }
    if (u === '/api/next') { const imgs = await nextBatch(parseInt(q.get('n') || '50', 10)); return send(200, JSON.stringify({ images: imgs })); }
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
        fs.writeFileSync(CRO_DIR + '/' + a.id + '.jpg', buf);
        approved.push({ id: a.id, file: a.id + '.jpg', query: a.query, w: a.w, h: a.h });
      }
      save(SEEN, Array.from(seen));
      save(APPROVED, approved);
      if (approved.length >= TARGET) notify2000(approved.length);
      return send(200, JSON.stringify({ ok: true, approved: approved.length }));
    }
    return send(404, '{}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[imagebank] CRO Image Bank → http://localhost:' + PORT));
