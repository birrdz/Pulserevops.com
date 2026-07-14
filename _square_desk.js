// Square Builder — FAKE mosaic preview (CSS title). Click stages a photo; Save queues Cursor manual bake.

function buildSquareDeskPage() {
  return `<!doctype html>
<html lang=en>
<head>
<meta charset=utf8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Square Builder</title>
<style>
:root{--bg:#0f1115;--panel:#171a21;--line:#2a3040;--text:#eef2f7;--muted:#9aa3b2;--gold:#EAC15C;--ok:#22c55e;--accent:#a855f7}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:radial-gradient(900px 480px at 50% -8%,#1c2433 0%,var(--bg) 55%);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,sans-serif}
body{display:flex;flex-direction:column;align-items:center;padding:28px 16px 56px}
.wrap{width:min(720px,100%);display:flex;flex-direction:column;align-items:center;gap:16px}
h1{margin:0;font-size:1.55rem;font-weight:850;letter-spacing:.01em}
.sub{margin:0;color:var(--muted);font-size:.9rem;text-align:center;line-height:1.45;max-width:36rem}
/* FAKE main-page mosaic look — CSS title overlay, NOT the baked JPEG */
.tile{
  width:min(560px,92vw);aspect-ratio:3/1;border-radius:6px;border:1.5px solid var(--gold);
  box-shadow:0 0 0 1px rgba(234,193,92,.25),0 14px 40px rgba(0,0,0,.45);
  background:#1a1a1a;position:relative;overflow:hidden;cursor:pointer;
}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(1.18) saturate(1.04);display:block}
.tile .ghost-title{
  position:absolute;left:0;right:0;bottom:0;padding:18% 4% 5%;z-index:2;pointer-events:none;
  background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,0) 55%);
  font-family:Georgia,'Playfair Display',serif;font-style:italic;font-weight:900;
  font-size:clamp(.95rem,3.2vw,1.45rem);line-height:1.08;color:#FFD54F;
  text-shadow:0 0 2px #000,0 1px 0 #000,-1px 0 0 #000,1px 0 0 #000;
  display:block;
}
.tile.green{border-color:var(--ok);box-shadow:0 0 0 2px rgba(34,197,94,.45),0 14px 40px rgba(0,0,0,.45)}
.tile .lab{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:1;color:#889;font-weight:800;font-size:.85rem}
.fake-tag{display:inline-block;font-size:.68rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#fde68a;background:rgba(234,193,92,.14);border:1px solid rgba(234,193,92,.35);padding:3px 8px;border-radius:999px;margin:8px 0 0}
.card{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px}
.ttl{margin:0 0 10px;font-size:1.2rem;font-weight:800;line-height:1.25}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input[type=text]{flex:1;min-width:160px;padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:#0c1018;color:var(--text);font-size:1rem}
button.act{border:none;border-radius:10px;padding:12px 16px;font-weight:800;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff}
button.save{background:linear-gradient(135deg,#15803d,#22c55e)}
button.ghost{background:transparent;border:1px solid var(--line);color:var(--muted);border-radius:10px;padding:12px 14px;font-weight:700;cursor:pointer}
button:disabled{opacity:.45;cursor:not-allowed}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:12px}
.grid button{appearance:none;border:2px solid #2a3040;padding:0;border-radius:10px;overflow:hidden;cursor:pointer;background:#0c1018;aspect-ratio:1}
.grid button:hover{border-color:var(--accent)}
.grid img{width:100%;height:100%;object-fit:cover;display:block}
.status{font-size:.84rem;color:var(--muted);min-height:1.2em;margin:8px 0 0}
.badge{display:inline-block;font-size:.7rem;font-weight:800;padding:3px 8px;border-radius:999px;background:rgba(168,85,247,.18);color:#e9d5ff;margin-bottom:8px}
.badge.ok{background:rgba(34,197,94,.18);color:#86efac}
.phase{width:100%;display:none}.phase.on{display:block}
.slots{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.slot{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:#0c1018}
.slot.done{border-color:rgba(34,197,94,.55);background:rgba(34,197,94,.08)}
.slot .n{font-weight:900;color:var(--accent);width:2.4rem}
.slot .t{flex:1;color:var(--muted);font-size:.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.slot .g{color:var(--ok);font-weight:900}
footer a{color:#7a8496;font-size:.75rem}
</style>
</head>
<body>
<div class=wrap>
  <h1>🟦 Square Builder</h1>
  <p class=sub id=headline>Preview is a <b>fake</b> mosaic (CSS title). Click a photo into the box. Hit <b>Save</b> — Cursor bakes the real face-card + top image.</p>

  <div id=phaseWait class="phase on">
    <button type=button class="tile wait" id=waitingSquare aria-label="Open waiting square">
      <span class=lab>Click to open</span>
      <div class=ghost-title id=waitTitle></div>
    </button>
    <div class=fake-tag>Fake preview · title CSS only</div>
    <p class=status id=waitStatus>Loading…</p>
  </div>

  <div id=phasePick class=phase>
    <div class=card>
      <div class=badge id=shapeBadge>Q&amp;A</div>
      <h2 class=ttl id=entryTitle>—</h2>
      <div class="tile wait" id=titleTile>
        <span class=lab id=titleLab>search → click a photo</span>
        <div class=ghost-title id=pickTitle></div>
      </div>
      <div class=fake-tag>Not the real file yet · title is a CSS lookalike</div>
      <p class=status style="margin-top:10px">Click stages the photo into this fake tile with the title on top. Nothing is written to the face-card yet.</p>
      <div class=row style="margin-top:10px">
        <input type=text id=kw placeholder="keyword from the title" autocomplete=off>
        <button type=button class=act id=searchBtn>Search</button>
        <button type=button class="act save" id=saveFaceBtn disabled>Save face →</button>
      </div>
      <p class=status id=pickStatus></p>
      <div class=grid id=grid></div>
    </div>
  </div>

  <div id=phaseAnswer class=phase>
    <div class=card>
      <div class="badge ok">Answer page · still fake until Cursor finishes</div>
      <h2 class=ttl id=ansTitle>—</h2>
      <div class="tile green" id=ansTile>
        <div class=ghost-title id=ansGhost></div>
      </div>
      <div class=fake-tag>Preview only · Save queues Cursor to bake for real</div>
      <p class=status id=ansBlurb>Fill body slots the same way (fake). When ready, hit Save all.</p>
      <div class=slots id=slotList></div>
      <div class=row style="margin-top:12px">
        <input type=text id=ansKw placeholder="keyword for next body image" autocomplete=off>
        <button type=button class=act id=ansSearchBtn>Search</button>
        <button type=button class="act save" id=saveAllBtn>Save all → Cursor bake</button>
        <button type=button class=ghost id=nextSqBtn>Next square →</button>
      </div>
      <p class=status id=ansStatus></p>
      <div class=grid id=ansGrid></div>
    </div>
  </div>

  <footer><a href="/format-fixer-full">Format Fixer</a> · <a href="/scrubber">Scrub</a></footer>
</div>
<script>
const KEY='4444';
let cur=null;
let stagedFace=null; // raw https URL
let stagedSlots={};  // n -> https URL
const $=s=>document.querySelector(s);
function show(id){['phaseWait','phasePick','phaseAnswer'].forEach(p=>$('#'+p).classList.toggle('on',p===id));}
function shapeLabel(s){return s==='top10'?'TOP 10':s==='styles'?'STYLES':'Q&A ESSAY';}
function proxy(u){ return '/square-proxy?u='+encodeURIComponent(u); }
/** Fake mosaic: raw photo + CSS gold title (never the baked /assets/qa file). */
function paintFake(tile, previewSrc, title, green){
  if(!tile) return;
  tile.classList.toggle('green', !!green);
  tile.classList.toggle('wait', !previewSrc);
  const lab=tile.querySelector('.lab');
  if(lab) lab.style.display=previewSrc?'none':'flex';
  let img=tile.querySelector('img.face');
  if(previewSrc){
    if(!img){ img=document.createElement('img'); img.className='face'; tile.insertBefore(img, tile.firstChild); }
    img.src=previewSrc.indexOf('/square-proxy')===0?previewSrc:proxy(previewSrc);
  }else if(img){ img.remove(); }
  const g=tile.querySelector('.ghost-title');
  if(g){ g.style.display='block'; g.textContent=title||''; }
}
async function loadNext(){
  $('#waitStatus').textContent='Loading…';
  stagedFace=null; stagedSlots={};
  paintFake($('#waitingSquare'), null, '', false);
  try{
    const j=await(await fetch('/square-next?key='+KEY)).json();
    if(!j||!j.ok){ $('#waitStatus').textContent=(j&&j.msg)||'No entry'; cur=null; return; }
    cur=j;
    // Always fake — title only on wait; do not load prior baked face into preview
    paintFake($('#waitingSquare'), null, j.title, false);
    $('#waitStatus').textContent=(j.demo?'Demo · ':'')+j.id+' · fake preview · Click to open';
    $('#headline').textContent='Fake mosaic preview. Pick a photo, then Save — Cursor bakes the real face-card.';
    if(j.pending&&j.pending.faceImageUrl){
      stagedFace=j.pending.faceImageUrl;
      stagedSlots=j.pending.slots||{};
    }
  }catch(e){ $('#waitStatus').textContent='Load failed — click to retry'; cur=null; }
}
function openSquare(){
  if(!cur||!cur.id){ loadNext(); return; }
  $('#entryTitle').textContent=cur.title||cur.id;
  $('#shapeBadge').textContent=shapeLabel(cur.shape);
  $('#kw').value=suggestKeyword(cur.title||'');
  $('#grid').innerHTML='';
  $('#pickStatus').textContent='Search → click a photo into the fake tile (title appears as CSS).';
  paintFake($('#titleTile'), stagedFace, cur.title, !!stagedFace);
  $('#saveFaceBtn').disabled=!stagedFace;
  show('phasePick');
  $('#kw').focus();
}
function suggestKeyword(title){
  const stop=new Set(['the','a','an','to','of','for','in','on','and','or','how','what','why','with','from','does','do','is','are','best','top']);
  return String(title).replace(/[^\\w\\s-]/g,' ').split(/\\s+/).filter(w=>w&&w.length>2&&!stop.has(w.toLowerCase())).slice(0,3).join(' ');
}
async function runSearch(q, gridEl, statusEl){
  statusEl.textContent='Searching…';
  gridEl.innerHTML='';
  try{
    const j=await(await fetch('/square-search?key='+KEY+'&q='+encodeURIComponent(q)+'&id='+encodeURIComponent((cur&&cur.id)||''))).json();
    if(!j.ok){ statusEl.textContent=j.msg||'Search failed'; return; }
    const items=j.results||[];
    if(!items.length){ statusEl.textContent='No photos'; return; }
    statusEl.textContent=items.length+' photos — click to stage into fake tile';
    items.forEach(item=>{
      const b=document.createElement('button'); b.type='button';
      const img=document.createElement('img'); img.loading='lazy'; img.alt='';
      const thumb=item.thumb||item.image;
      img.src=proxy(thumb);
      b.appendChild(img);
      b.onclick=()=>stageImage(item.image||thumb, thumb);
      gridEl.appendChild(b);
    });
  }catch(e){ statusEl.textContent='Search error'; }
}
async function stageRemote(payload){
  return (await fetch('/square-stage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({key:KEY,id:cur.id,title:cur.title},payload))})).json();
}
async function stageImage(imageUrl, thumbUrl){
  if(!cur||!cur.id) return;
  const onAnswer=!!$('#phaseAnswer').classList.contains('on');
  const statusEl=onAnswer?$('#ansStatus'):$('#pickStatus');
  statusEl.textContent='Staging into fake tile…';
  try{
    let slot=null;
    if(onAnswer){
      slot=(cur.nextSlot!=null)?cur.nextSlot:((cur.slots||[]).findIndex(s=>s&&s.kind==='body'&&!stagedSlots[s.n]));
      const bodySlot=cur.slots&&cur.slots[slot];
      const n=bodySlot&&bodySlot.kind==='body'?bodySlot.n:null;
      if(n==null){ statusEl.textContent='No open body slot'; return; }
      stagedSlots[n]=imageUrl;
      let j=await stageRemote({faceImageUrl:stagedFace,slots:stagedSlots,previewUrl:imageUrl,slotN:n});
      if(!j.ok&&thumbUrl&&thumbUrl!==imageUrl){
        stagedSlots[n]=thumbUrl;
        j=await stageRemote({faceImageUrl:stagedFace,slots:stagedSlots,previewUrl:thumbUrl,slotN:n});
      }
      if(!j.ok){ statusEl.textContent=j.msg||'Stage failed'; return; }
      cur.slots=j.slots||cur.slots;
      cur.nextSlot=j.nextSlot;
      renderSlots();
      $('#ansGrid').innerHTML='';
      statusEl.textContent='Body slot staged (fake).';
      return;
    }
    stagedFace=imageUrl;
    let j=await stageRemote({faceImageUrl:stagedFace,slots:stagedSlots,previewUrl:imageUrl});
    if(!j.ok&&thumbUrl&&thumbUrl!==imageUrl){
      stagedFace=thumbUrl;
      j=await stageRemote({faceImageUrl:stagedFace,slots:stagedSlots,previewUrl:thumbUrl});
    }
    if(!j.ok){ statusEl.textContent=j.msg||'Stage failed'; return; }
    paintFake($('#titleTile'), stagedFace, cur.title, true);
    $('#saveFaceBtn').disabled=false;
    statusEl.textContent='Staged in fake tile. Hit Save face → when it looks right.';
  }catch(e){ statusEl.textContent='Stage error — try another photo'; }
}
function enterAnswer(){
  $('#ansTitle').textContent=cur.title||cur.id;
  paintFake($('#ansTile'), stagedFace, cur.title, true);
  $('#ansBlurb').textContent='Still fake. Fill body slots, then Save all — Cursor bakes the real files.';
  renderSlots();
  $('#ansKw').value=suggestKeyword(cur.title||'');
  $('#ansGrid').innerHTML='';
  show('phaseAnswer');
  $('#headline').textContent='Fake answer preview — Save queues Cursor to put the real face-card on.';
}
function renderSlots(){
  const list=$('#slotList'); list.innerHTML='';
  (cur.slots||[]).forEach(s=>{
    if(s.kind==='face'||s.kind==='top'){
      const d=document.createElement('div');
      d.className='slot'+(stagedFace?' done':'');
      d.innerHTML='<span class=n>'+s.label+'</span><span class=t>'+(stagedFace?'staged (fake)':'waiting')+'</span>'+(stagedFace?'<span class=g>✓</span>':'');
      list.appendChild(d);
      return;
    }
    const url=stagedSlots[s.n];
    const d=document.createElement('div');
    d.className='slot'+(url?' done':'');
    d.innerHTML='<span class=n>'+s.label+'</span><span class=t>'+(url?'staged (fake)':'waiting')+'</span>'+(url?'<span class=g>✓</span>':'');
    list.appendChild(d);
  });
}
async function queueSave(kind){
  if(!cur||!cur.id) return;
  if(!stagedFace){ (kind==='face'?$('#pickStatus'):$('#ansStatus')).textContent='Stage a face photo first.'; return; }
  const statusEl=kind==='face'?$('#pickStatus'):$('#ansStatus');
  statusEl.textContent='Queuing for Cursor manual bake…';
  try{
    const j=await(await fetch('/square-save-draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      key:KEY,id:cur.id,title:cur.title,shape:cur.shape,
      faceImageUrl:stagedFace,slots:stagedSlots
    })})).json();
    if(!j.ok){ statusEl.textContent=j.msg||'Queue failed'; return; }
    statusEl.textContent='Queued · Cursor will bake the real face-card + top image shortly.';
    if(kind==='face') enterAnswer();
  }catch(e){ statusEl.textContent='Queue error'; }
}
$('#waitingSquare').addEventListener('click', openSquare);
$('#searchBtn').addEventListener('click',()=>runSearch(($('#kw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#grid'), $('#pickStatus')));
$('#kw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#searchBtn').click(); });
$('#saveFaceBtn').addEventListener('click',()=>queueSave('face'));
$('#ansSearchBtn').addEventListener('click',()=>runSearch(($('#ansKw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#ansGrid'), $('#ansStatus')));
$('#ansKw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#ansSearchBtn').click(); });
$('#saveAllBtn').addEventListener('click',()=>queueSave('all'));
$('#nextSqBtn').addEventListener('click',async()=>{ show('phaseWait'); await loadNext(); });
loadNext();
</script>
</body>
</html>`;
}

module.exports = { buildSquareDeskPage };
