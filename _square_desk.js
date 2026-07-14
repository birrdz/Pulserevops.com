// Square Builder desk — waiting square → title → keyword search → DELETE/white → write over → answer page.

function buildSquareDeskPage() {
  return `<!doctype html>
<html lang=en>
<head>
<meta charset=utf8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Square Builder</title>
<style>
:root{--bg:#f4f4f5;--panel:#ffffff;--line:#d4d4d8;--text:#18181b;--muted:#71717a;--accent:#7c3aed;--ok:#16a34a}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:linear-gradient(180deg,#ffffff 0%,#f4f4f5 40%,#e4e4e7 100%);color:var(--text);font-family:Georgia,"Times New Roman",serif}
body{display:flex;flex-direction:column;align-items:center;padding:28px 16px 48px}
.wrap{width:min(920px,100%);display:flex;flex-direction:column;align-items:center;gap:18px}
h1{margin:0;font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;letter-spacing:.02em;color:#111}
.sub{margin:0;color:var(--muted);font-family:system-ui,sans-serif;font-size:.92rem;text-align:center;max-width:34rem;line-height:1.45}
.sq{
  width:min(280px,72vw);aspect-ratio:1;border-radius:22px;border:2px solid #a1a1aa;
  background:#ffffff;
  box-shadow:0 10px 40px rgba(0,0,0,.08);
  cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;
  transition:transform .15s ease, box-shadow .2s ease, border-color .2s;
}
.sq:hover{transform:translateY(-3px);border-color:var(--accent);box-shadow:0 16px 44px rgba(124,58,237,.18)}
.sq:active{transform:scale(.98)}
.sq.wait::before{content:"";position:absolute;inset:18%;border:2px dashed #d4d4d8;border-radius:16px}
.sq .label{position:relative;z-index:1;font-family:system-ui,sans-serif;font-weight:800;font-size:.95rem;color:#52525b;text-align:center;padding:12px}
.sq.green{border-color:#16a34a}
.sq.whiteout{background:#ffffff;border-color:#e4e4e7}
.sq img{width:100%;height:100%;object-fit:cover;display:block}
.card{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:18px 18px 16px;box-shadow:0 4px 24px rgba(0,0,0,.04)}
.ttl{font-size:clamp(1.15rem,2.6vw,1.55rem);font-weight:800;line-height:1.25;margin:0 0 12px;color:#111}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input[type=text]{
  flex:1;min-width:180px;padding:14px 14px;border-radius:12px;border:1px solid var(--line);
  background:#fff;color:var(--text);font-size:1rem;font-family:system-ui,sans-serif;
}
button.act{
  border:none;border-radius:12px;padding:14px 18px;font-weight:800;font-family:system-ui,sans-serif;
  font-size:.95rem;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;
}
button.act:disabled{opacity:.45;cursor:wait}
button.ghost{background:#fff;border:1px solid var(--line);color:var(--muted);border-radius:12px;padding:12px 14px;font-family:system-ui,sans-serif;font-weight:700;cursor:pointer}
button.danger{background:#fff;border:1px solid #fca5a5;color:#b91c1c;border-radius:12px;padding:12px 14px;font-family:system-ui,sans-serif;font-weight:800;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:14px}
.grid button{
  appearance:none;border:2px solid #e4e4e7;padding:0;border-radius:12px;overflow:hidden;cursor:pointer;
  background:#fff;aspect-ratio:1;position:relative;
}
.grid button:hover{border-color:var(--accent)}
.grid img{width:100%;height:100%;object-fit:cover;display:block}
.status{font-family:system-ui,sans-serif;font-size:.85rem;color:var(--muted);min-height:1.2em}
.badge{display:inline-block;font-family:system-ui,sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.04em;
  padding:4px 8px;border-radius:999px;background:#ede9fe;color:#6d28d9;margin-bottom:8px}
.badge.ok{background:#dcfce7;color:#15803d}
.phase{width:100%;display:none}
.phase.on{display:block}
.slots{display:flex;flex-direction:column;gap:8px;margin-top:12px;font-family:system-ui,sans-serif}
.slot{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:#fff}
.slot.done{border-color:#86efac;background:#f0fdf4}
.slot .n{font-weight:900;color:var(--accent);width:2.2rem}
.slot .t{flex:1;color:var(--muted);font-size:.85rem}
footer a{color:#71717a;font-family:system-ui,sans-serif;font-size:.75rem}
</style>
</head>
<body>
<div class=wrap>
  <h1>🟦 Square Builder</h1>
  <p class=sub id=headline>A square is waiting. Click it — pick a photo to delete the old one, paint white, then write over.</p>

  <div id=phaseWait class="phase on">
    <button type=button class="sq wait" id=waitingSquare aria-label="Open waiting square">
      <span class=label>Click to open</span>
    </button>
    <p class=status id=waitStatus>Loading next Q&amp;A…</p>
  </div>

  <div id=phasePick class=phase>
    <div class=card>
      <div class=badge id=shapeBadge>Q&amp;A</div>
      <h2 class=ttl id=entryTitle>—</h2>
      <div class=row>
        <div class="sq wait whiteout" id=titleSquare style="width:120px;flex-shrink:0"><span class=label style="font-size:.72rem">face</span></div>
        <div style="flex:1;min-width:200px">
          <p class=status style="margin:0 0 8px">Click a photo → <b>deletes</b> old face → paints <b>white</b> → writes the new image over it (face-card + top image).</p>
          <div class=row>
            <input type=text id=kw placeholder="keyword from the title" autocomplete=off>
            <button type=button class=act id=searchBtn>Search</button>
            <button type=button class=danger id=deleteBtn title="Delete face now (white out)">Delete → white</button>
          </div>
        </div>
      </div>
      <p class=status id=pickStatus></p>
      <div class=grid id=grid></div>
    </div>
  </div>

  <div id=phaseAnswer class=phase>
    <div class=card>
      <div class="badge ok">Answer page</div>
      <h2 class=ttl id=ansTitle>—</h2>
      <div class=row style="align-items:flex-start">
        <div class="sq green" id=ansSquare style="width:160px;flex-shrink:0"></div>
        <div style="flex:1">
          <p class=status id=ansBlurb>Face-card + top image written over.</p>
          <div class=slots id=slotList></div>
          <div class=row style="margin-top:14px">
            <input type=text id=ansKw placeholder="keyword for next body image" autocomplete=off>
            <button type=button class=act id=ansSearchBtn>Search</button>
            <button type=button class=ghost id=nextSqBtn>Next square →</button>
          </div>
          <p class=status id=ansStatus></p>
          <div class=grid id=ansGrid></div>
        </div>
      </div>
    </div>
  </div>

  <footer><a href="/format-fixer-full">Format Fixer (content only)</a> · <a href="/scrubber">Scrub</a></footer>
</div>
<script>
const KEY='4444';
let cur=null;
const $=s=>document.querySelector(s);
function show(id){
  ['phaseWait','phasePick','phaseAnswer'].forEach(p=>$('#'+p).classList.toggle('on', p===id));
}
function shapeLabel(s){
  if(s==='top10') return 'TOP 10';
  if(s==='styles') return 'STYLES';
  return 'Q&A ESSAY';
}
function paintSq(el, url, mode){
  if(!el) return;
  el.classList.remove('wait','green','whiteout');
  if(mode==='white' || url==='__white__'){
    el.classList.add('whiteout');
    el.style.background='#ffffff';
    el.innerHTML='<span class=label style="color:#a1a1aa">WHITE</span>';
    return;
  }
  if(url){
    el.classList.add('green');
    el.innerHTML='<img src="'+url+(url.indexOf('?')>=0?'&':'?')+'t='+Date.now()+'" alt="face">';
  }else{
    el.classList.add('wait','whiteout');
    el.style.background='#ffffff';
    el.innerHTML='<span class=label>Click</span>';
  }
}
async function loadNext(){
  $('#waitStatus').textContent='Loading next Q&A…';
  paintSq($('#waitingSquare'), null);
  try{
    const j=await(await fetch('/square-next?key='+KEY)).json();
    if(!j||!j.ok){ $('#waitStatus').textContent=(j&&j.msg)||'No entry ready'; cur=null; return; }
    cur=j;
    if(j.faceUrl) paintSq($('#waitingSquare'), j.faceUrl);
    $('#waitStatus').textContent=(j.demo?'Demo · ':'')+j.id+(j.faceUrl?' · existing face will be deleted then written over':'');
    $('#headline').textContent='Click the square. Next photo deletes old → white → write over.';
  }catch(e){
    $('#waitStatus').textContent='Could not load — click to retry';
    cur=null;
  }
}
function openSquare(){
  if(!cur||!cur.id){ loadNext(); return; }
  $('#entryTitle').textContent=cur.title||cur.id;
  $('#shapeBadge').textContent=shapeLabel(cur.shape);
  $('#kw').value=suggestKeyword(cur.title||'');
  $('#grid').innerHTML='';
  $('#pickStatus').textContent=cur.faceUrl?'Existing face shown. Search + click will DELETE it, paint white, then write over.':'Search + click writes face + top.';
  paintSq($('#titleSquare'), cur.faceUrl||null);
  show('phasePick');
  $('#kw').focus();
}
function suggestKeyword(title){
  const stop=new Set(['the','a','an','to','of','for','in','on','and','or','how','what','why','with','from','does','do','is','are','best','top']);
  const words=String(title).replace(/[^\\w\\s-]/g,' ').split(/\\s+/).filter(w=>w&&w.length>2&&!stop.has(w.toLowerCase()));
  return words.slice(0,3).join(' ');
}
async function runSearch(q, gridEl, statusEl){
  statusEl.textContent='Searching…';
  gridEl.innerHTML='';
  try{
    const j=await(await fetch('/square-search?key='+KEY+'&q='+encodeURIComponent(q)+'&id='+encodeURIComponent((cur&&cur.id)||''))).json();
    if(!j.ok){ statusEl.textContent=j.msg||'Search failed'; return; }
    const items=j.results||[];
    if(!items.length){ statusEl.textContent='No photos — try another keyword'; return; }
    statusEl.textContent=items.length+' photos — click = delete old → white → write over';
    items.forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      const img=document.createElement('img');
      img.loading='lazy';
      img.alt='';
      const thumb=item.thumb||item.image;
      img.src='/square-proxy?u='+encodeURIComponent(thumb);
      b.appendChild(img);
      b.onclick=()=>pickImage(item.image||thumb, thumb);
      gridEl.appendChild(b);
    });
  }catch(e){ statusEl.textContent='Search error'; }
}
async function deleteToWhite(){
  if(!cur||!cur.id) return;
  const statusEl=$('#pickStatus');
  statusEl.textContent='Deleting face → painting white…';
  paintSq($('#titleSquare'), '__white__', 'white');
  try{
    const j=await(await fetch('/square-delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,id:cur.id})})).json();
    if(!j.ok){ statusEl.textContent=j.msg||'Delete failed'; return; }
    cur.faceUrl=j.faceUrl||null;
    paintSq($('#titleSquare'), j.faceUrl||'__white__', j.faceUrl?null:'white');
    statusEl.textContent='Deleted + white. Now search and click a photo to write over.';
  }catch(e){ statusEl.textContent='Delete error'; }
}
async function postPick(imageUrl, slot){
  const body={key:KEY,id:cur.id,imageUrl};
  if(slot!=null && slot>=0) body.slot=slot;
  return (await fetch('/square-pick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json();
}
async function pickImage(imageUrl, thumbUrl){
  if(!cur||!cur.id) return;
  const onAnswer=!!$('#phaseAnswer').classList.contains('on');
  const statusEl=onAnswer?$('#ansStatus'):$('#pickStatus');
  // Step 1: wipe UI to white + delete on server
  statusEl.textContent='1/3 Deleting old image…';
  if(!onAnswer) paintSq($('#titleSquare'), '__white__', 'white');
  else paintSq($('#ansSquare'), '__white__', 'white');
  try{
    await fetch('/square-delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:KEY,id:cur.id})});
  }catch(e){}
  statusEl.textContent='2/3 White painted — writing new photo over…';
  try{
    let slot=null;
    if(onAnswer){
      slot=(cur.nextSlot!=null)?cur.nextSlot:((cur.slots||[]).findIndex(s=>s&&s.kind==='body'));
    }
    let j=await postPick(imageUrl, slot);
    if(!j.ok && thumbUrl && thumbUrl!==imageUrl){
      statusEl.textContent='Retrying via proxy…';
      j=await postPick(thumbUrl, slot);
    }
    if(!j.ok){ statusEl.textContent=j.msg||'Write-over failed'; return; }
    statusEl.textContent='3/3 Wrote over.';
    if(j.mode==='slot'){
      cur.slots=j.slots||cur.slots;
      cur.nextSlot=j.nextSlot;
      cur.faceUrl=j.faceUrl||cur.faceUrl;
      renderSlots();
      $('#ansGrid').innerHTML='';
      return;
    }
    cur.faceUrl=j.faceUrl;
    cur.slots=j.slots||[];
    cur.nextSlot=j.nextSlot;
    enterAnswer();
    $('#ansStatus').textContent='Deleted → white → wrote OVER face-card + top image.';
  }catch(e){ statusEl.textContent='Save error — try another photo'; }
}
function enterAnswer(){
  $('#ansTitle').textContent=cur.title||cur.id;
  paintSq($('#ansSquare'), cur.faceUrl);
  $('#ansBlurb').textContent='Face + top overwritten. More clicks write over body slots the same way.';
  renderSlots();
  $('#ansKw').value=suggestKeyword(cur.title||'');
  $('#ansGrid').innerHTML='';
  show('phaseAnswer');
  $('#headline').textContent='Answer page — each click deletes/whites/writes over the next slot.';
}
function renderSlots(){
  const list=$('#slotList');
  list.innerHTML='';
  (cur.slots||[]).forEach(s=>{
    const d=document.createElement('div');
    d.className='slot'+(s.filled?' done':'');
    d.innerHTML='<span class=n>'+s.label+'</span><span class=t>'+(s.filled?(s.url||'filled'):'waiting')+'</span>';
    list.appendChild(d);
  });
}
$('#waitingSquare').addEventListener('click', openSquare);
$('#searchBtn').addEventListener('click',()=>runSearch(($('#kw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#grid'), $('#pickStatus')));
$('#deleteBtn').addEventListener('click', deleteToWhite);
$('#kw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#searchBtn').click(); });
$('#ansSearchBtn').addEventListener('click',()=>runSearch(($('#ansKw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#ansGrid'), $('#ansStatus')));
$('#ansKw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#ansSearchBtn').click(); });
$('#nextSqBtn').addEventListener('click',async()=>{ show('phaseWait'); await loadNext(); });
loadNext();
</script>
</body>
</html>`;
}

module.exports = { buildSquareDeskPage };
