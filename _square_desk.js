// Square Builder — no mosaic box. Click photos; switch freely between slots. Cursor bakes on Done.

function buildSquareDeskPage() {
  return `<!doctype html>
<html lang=en>
<head>
<meta charset=utf8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Square Builder — pick photos</title>
<style>
:root{--bg:#0f1115;--panel:#171a21;--line:#2a3040;--text:#eef2f7;--muted:#9aa3b2;--ok:#22c55e;--accent:#a855f7}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#0f1115;color:var(--text);font-family:system-ui,-apple-system,Segoe UI,sans-serif}
body{display:flex;flex-direction:column;align-items:center;padding:24px 14px 48px}
.wrap{width:min(780px,100%);display:flex;flex-direction:column;gap:14px}
h1{margin:0;font-size:1.4rem;font-weight:850}
.sub{margin:0;color:var(--muted);font-size:.9rem;line-height:1.45}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}
.ttl{margin:0 0 6px;font-size:1.15rem;font-weight:800;line-height:1.3}
.meta{color:var(--muted);font-size:.8rem;margin-bottom:12px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input[type=text]{flex:1;min-width:160px;padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:#0c1018;color:var(--text);font-size:1rem}
button.act{border:none;border-radius:10px;padding:12px 16px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff}
button.save{background:linear-gradient(135deg,#15803d,#22c55e)}
button.ghost{background:transparent;border:1px solid var(--line);color:var(--muted);border-radius:10px;padding:12px 14px;font-weight:700;cursor:pointer}
button:disabled{opacity:.4;cursor:not-allowed}
.slots{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.slotbtn{border:1px solid var(--line);background:#0c1018;color:var(--muted);border-radius:999px;padding:8px 12px;font-weight:800;cursor:pointer;font-size:.8rem}
.slotbtn.on{border-color:var(--accent);color:#e9d5ff;background:rgba(168,85,247,.18)}
.slotbtn.filled{border-color:rgba(34,197,94,.5);color:#86efac}
.slotbtn.on.filled{box-shadow:0 0 0 2px rgba(168,85,247,.35)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:12px}
.grid button{appearance:none;border:3px solid #2a3040;padding:0;border-radius:10px;overflow:hidden;cursor:pointer;background:#0c1018;aspect-ratio:1;position:relative}
.grid button:hover{border-color:var(--accent)}
.grid button.on{border-color:var(--ok);box-shadow:0 0 0 2px rgba(34,197,94,.45)}
.grid button.on::after{content:'✓';position:absolute;top:6px;right:8px;color:#86efac;font-weight:900;text-shadow:0 1px 2px #000}
.grid img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.status{font-size:.84rem;color:var(--muted);min-height:1.2em;margin:8px 0 0}
.picks{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.pick{display:flex;gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:10px;background:#0c1018;cursor:pointer}
.pick.on{border-color:var(--accent);background:rgba(168,85,247,.1)}
.pick img{width:72px;height:48px;object-fit:cover;border-radius:6px;pointer-events:none}
.pick .lab{font-weight:800;width:4.5rem;color:var(--accent)}
.pick .u{flex:1;font-size:.75rem;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pick .x{border:none;background:transparent;color:#f87171;font-weight:900;cursor:pointer;font-size:1rem;padding:4px 8px}
.badge{display:inline-block;font-size:.7rem;font-weight:800;padding:3px 8px;border-radius:999px;background:rgba(168,85,247,.18);color:#e9d5ff;margin-bottom:8px}
footer a{color:#7a8496;font-size:.75rem}
</style>
</head>
<body>
<div class=wrap>
  <h1>🟦 Pick photos</h1>
  <p class=sub>No preview box. Face-card <b>auto = top image</b> (same file). Tap a slot, click any photo to set/switch. Hit Done when ready.</p>

  <div class=card>
    <div class=badge id=shapeBadge>Q&amp;A</div>
    <h2 class=ttl id=entryTitle>Loading…</h2>
    <div class=meta id=entryMeta></div>
    <div class=slots id=slotBar></div>
    <div class=row>
      <input type=text id=kw placeholder="keyword" autocomplete=off>
      <button type=button class=act id=searchBtn>Search</button>
      <button type=button class=ghost id=nextBtn>Next entry →</button>
    </div>
    <p class=status id=status>Loading entry…</p>
    <div class=grid id=grid></div>
    <div class=picks id=pickList></div>
    <div class=row style="margin-top:14px">
      <button type=button class="act save" id=doneBtn disabled>Done — Cursor puts them on</button>
    </div>
  </div>

  <footer style="margin-top:8px;display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
    <a href="/format-fixer-full">← Format Fixer (content only)</a>
  </footer>
</div>
<script>
const KEY='4444';
let cur=null;
let faceUrl=null;
let bodyUrls={};
let active='face'; // 'face' or body slot number
const $=s=>document.querySelector(s);
function shapeLabel(s){return s==='top10'?'TOP 10':s==='styles'?'STYLES':'Q&A ESSAY';}
function proxy(u){return '/square-proxy?u='+encodeURIComponent(u);}
function suggestKeyword(title){
  const stop=new Set(['the','a','an','to','of','for','in','on','and','or','how','what','why','with','from','does','do','is','are','best','top']);
  return String(title||'').replace(/[^\\w\\s-]/g,' ').split(/\\s+/).filter(w=>w&&w.length>2&&!stop.has(w.toLowerCase())).slice(0,3).join(' ');
}
function bodySlotNs(){
  return (cur&&cur.slots||[]).filter(s=>s&&s.kind==='body').map(s=>s.n);
}
function targetLabel(){
  return active==='face'?'FACE + TOP':('IMG '+active);
}
function whatNext(){
  return 'Active: <b>'+targetLabel()+'</b> — click any photo to set/switch. Face pick auto-fills top image (same file).';
}
function setActive(t){
  active=t;
  renderSlotBar();
  renderPicks();
  $('#status').innerHTML=whatNext();
}
function renderSlotBar(){
  const bar=$('#slotBar'); bar.innerHTML='';
  const mk=(key,label,filled)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='slotbtn'+(active===key?' on':'')+(filled?' filled':'');
    b.textContent=label+(filled?' ✓':'');
    b.onclick=()=>setActive(key);
    bar.appendChild(b);
  };
  mk('face','FACE + TOP',!!faceUrl);
  bodySlotNs().forEach(n=>mk(n,'Img '+n,!!bodyUrls[n]));
}
function renderPicks(){
  const list=$('#pickList'); list.innerHTML='';
  const addRow=(key,label,url)=>{
    if(!url) return;
    const d=document.createElement('div');
    d.className='pick'+(active===key?' on':'');
    d.innerHTML='<span class=lab>'+label+'</span><img src="'+proxy(url)+'" alt=""><span class=u>'+url+'</span><button type=button class=x aria-label=remove>×</button>';
    d.onclick=(e)=>{ if(e.target.closest('.x')) return; setActive(key); };
    d.querySelector('.x').onclick=(e)=>{
      e.stopPropagation();
      if(key==='face') faceUrl=null; else delete bodyUrls[key];
      stageSilent();
      renderSlotBar(); renderPicks(); markGrid();
      $('#doneBtn').disabled=!faceUrl;
      $('#status').innerHTML=whatNext();
    };
    list.appendChild(d);
  };
  addRow('face','FACE+TOP',faceUrl);
  bodySlotNs().forEach(n=>addRow(n,'IMG '+n,bodyUrls[n]));
  $('#doneBtn').disabled=!faceUrl;
}
function markGrid(){
  const chosen=new Set([faceUrl,...Object.values(bodyUrls)].filter(Boolean));
  $('#grid').querySelectorAll('button').forEach(b=>{
    b.classList.toggle('on', chosen.has(b.dataset.url));
  });
}
async function stageSilent(){
  if(!cur) return;
  try{
    await fetch('/square-stage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      key:KEY,id:cur.id,title:cur.title,shape:cur.shape,faceImageUrl:faceUrl,slots:bodyUrls
    })});
  }catch(e){}
}
async function loadNext(){
  faceUrl=null; bodyUrls={}; active='face';
  $('#grid').innerHTML='';
  $('#pickList').innerHTML='';
  $('#doneBtn').disabled=true;
  $('#status').textContent='Loading…';
  try{
    const j=await(await fetch('/square-next?key='+KEY)).json();
    if(!j||!j.ok){ $('#entryTitle').textContent='No entry'; $('#status').textContent=(j&&j.msg)||'empty'; cur=null; return; }
    cur=j;
    $('#entryTitle').textContent=j.title||j.id;
    $('#shapeBadge').textContent=shapeLabel(j.shape);
    $('#entryMeta').textContent=j.id+(j.demo?' · demo':'')+' · face-card = top image (one file)';
    $('#kw').value=suggestKeyword(j.title);
    if(j.pending&&j.pending.faceImageUrl){
      faceUrl=j.pending.faceImageUrl;
      bodyUrls=Object.assign({}, j.pending.slots||{});
    }
    renderSlotBar();
    renderPicks();
    $('#status').innerHTML=whatNext();
  }catch(e){ $('#status').textContent='Load failed'; cur=null; }
}
async function runSearch(){
  if(!cur) return;
  const q=($('#kw').value||'').trim()||suggestKeyword(cur.title);
  $('#status').textContent='Searching…';
  $('#grid').innerHTML='';
  try{
    const j=await(await fetch('/square-search?key='+KEY+'&q='+encodeURIComponent(q))).json();
    if(!j.ok){ $('#status').textContent=j.msg||'Search failed'; return; }
    const items=j.results||[];
    if(!items.length){ $('#status').textContent='No photos'; return; }
    $('#status').innerHTML=items.length+' photos — '+whatNext();
    items.forEach(item=>{
      const url=item.image||item.thumb;
      if(!url) return;
      const b=document.createElement('button'); b.type='button'; b.dataset.url=url;
      const img=document.createElement('img'); img.loading='lazy'; img.alt='';
      img.src=proxy(item.thumb||url);
      b.appendChild(img);
      b.addEventListener('click',(e)=>{ e.preventDefault(); pick(url); });
      $('#grid').appendChild(b);
    });
    markGrid();
  }catch(e){ $('#status').textContent='Search error'; }
}
async function pick(url){
  if(!cur||!url) return;
  // Always set/REPLACE the active slot — switch freely
  if(active==='face'){
    faceUrl=url;
  }else{
    const n=Number(active);
    if(!n){ active='face'; faceUrl=url; }
    else bodyUrls[n]=url;
  }
  await stageSilent();
  renderSlotBar();
  renderPicks();
  markGrid();
  $('#status').innerHTML='Set <b>'+targetLabel()+'</b>. Click another photo to switch, or tap a different slot.';
}
async function done(){
  if(!cur||!faceUrl) return;
  $('#doneBtn').disabled=true;
  $('#status').textContent='Queued — Cursor will delete the old face and put your picks on…';
  try{
    const j=await(await fetch('/square-save-draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      key:KEY,id:cur.id,title:cur.title,shape:cur.shape,faceImageUrl:faceUrl,slots:bodyUrls
    })})).json();
    if(!j.ok){ $('#status').textContent=j.msg||'Queue failed'; $('#doneBtn').disabled=false; return; }
    $('#status').textContent='Queued for Cursor. You can Next entry or wait here.';
  }catch(e){ $('#status').textContent='Queue error'; $('#doneBtn').disabled=false; }
}
$('#searchBtn').onclick=runSearch;
$('#kw').addEventListener('keydown',e=>{ if(e.key==='Enter') runSearch(); });
$('#doneBtn').onclick=done;
$('#nextBtn').onclick=loadNext;
loadNext();
</script>
</body>
</html>`;
}

module.exports = { buildSquareDeskPage };
