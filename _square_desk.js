// Square Builder desk — waiting square → title → keyword search → click = face+top → answer page.
// Pure HTML for /face-card-top-image-generator and /format-fixer (daily driver).

function buildSquareDeskPage() {
  return `<!doctype html>
<html lang=en>
<head>
<meta charset=utf8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Square Builder</title>
<style>
:root{--bg:#0b0f14;--panel:#121a22;--line:rgba(255,255,255,.12);--text:#e8eef2;--muted:#8aa0ad;--accent:#e879f9;--ok:#2ecc71;--warn:#f1c40f}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:radial-gradient(1200px 600px at 50% -10%,#1a0f24 0%,var(--bg) 55%);color:var(--text);font-family:Georgia,"Times New Roman",serif}
body{display:flex;flex-direction:column;align-items:center;padding:28px 16px 48px}
.wrap{width:min(920px,100%);display:flex;flex-direction:column;align-items:center;gap:18px}
h1{margin:0;font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;letter-spacing:.02em}
.sub{margin:0;color:var(--muted);font-family:system-ui,sans-serif;font-size:.92rem;text-align:center;max-width:34rem;line-height:1.45}
.sq{
  width:min(280px,72vw);aspect-ratio:1;border-radius:22px;border:2px solid rgba(232,121,249,.55);
  background:linear-gradient(145deg,#1b1224 0%,#101820 100%);
  box-shadow:0 18px 50px rgba(0,0,0,.45), inset 0 0 40px rgba(232,121,249,.08);
  cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;
  transition:transform .15s ease, box-shadow .2s ease, border-color .2s;
}
.sq:hover{transform:translateY(-3px);box-shadow:0 22px 60px rgba(168,85,247,.28);border-color:#e879f9}
.sq:active{transform:scale(.98)}
.sq.wait::before{content:"";position:absolute;inset:18%;border:2px dashed rgba(232,121,249,.35);border-radius:16px}
.sq .label{position:relative;z-index:1;font-family:system-ui,sans-serif;font-weight:800;font-size:.95rem;color:#e879f9;text-align:center;padding:12px}
.sq.green{border-color:#2ecc71;box-shadow:0 18px 50px rgba(46,204,113,.25)}
.sq img{width:100%;height:100%;object-fit:cover;display:block}
.card{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:18px 18px 16px}
.ttl{font-size:clamp(1.15rem,2.6vw,1.55rem);font-weight:800;line-height:1.25;margin:0 0 12px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input[type=text]{
  flex:1;min-width:180px;padding:14px 14px;border-radius:12px;border:1px solid var(--line);
  background:#0a1016;color:var(--text);font-size:1rem;font-family:system-ui,sans-serif;
}
button.act{
  border:none;border-radius:12px;padding:14px 18px;font-weight:800;font-family:system-ui,sans-serif;
  font-size:.95rem;cursor:pointer;background:linear-gradient(135deg,#c084fc,#e879f9);color:#1a1206;
}
button.act:disabled{opacity:.45;cursor:wait}
button.ghost{background:transparent;border:1px solid var(--line);color:var(--muted);border-radius:12px;padding:12px 14px;font-family:system-ui,sans-serif;font-weight:700;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:14px}
.grid button{
  appearance:none;border:2px solid transparent;padding:0;border-radius:12px;overflow:hidden;cursor:pointer;
  background:#0a1016;aspect-ratio:1;position:relative;
}
.grid button:hover{border-color:var(--accent)}
.grid img{width:100%;height:100%;object-fit:cover;display:block}
.status{font-family:system-ui,sans-serif;font-size:.85rem;color:var(--muted);min-height:1.2em}
.badge{display:inline-block;font-family:system-ui,sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.04em;
  padding:4px 8px;border-radius:999px;background:rgba(232,121,249,.15);color:#e879f9;margin-bottom:8px}
.badge.ok{background:rgba(46,204,113,.16);color:#2ecc71}
.phase{width:100%;display:none}
.phase.on{display:block}
.slots{display:flex;flex-direction:column;gap:8px;margin-top:12px;font-family:system-ui,sans-serif}
.slot{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:#0a1016}
.slot.done{border-color:rgba(46,204,113,.45)}
.slot .n{font-weight:900;color:var(--accent);width:2.2rem}
.slot .t{flex:1;color:var(--muted);font-size:.85rem}
.hide{display:none!important}
footer a{color:#8aa0ad;font-family:system-ui,sans-serif;font-size:.75rem}
</style>
</head>
<body>
<div class=wrap>
  <h1>🟦 Square Builder</h1>
  <p class=sub id=headline>A square is waiting. Click it — no pillar picker, no extra buttons.</p>

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
        <div class=sq wait id=titleSquare style="width:120px;flex-shrink:0"><span class=label style="font-size:.72rem">face</span></div>
        <div style="flex:1;min-width:200px">
          <p class=status style="margin:0 0 8px">Type a keyword from the title, pick a photo. Click <b>writes OVER</b> the existing face-card + top image (same file).</p>
          <div class=row>
            <input type=text id=kw placeholder="keyword from the title" autocomplete=off>
            <button type=button class=act id=searchBtn>Search</button>
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
          <p class=status id=ansBlurb>Face-card + top image saved. Top image is the same file as the face-card.</p>
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
let cur=null; // {id,title,shape,faceUrl,slots,nextSlot}
const $=s=>document.querySelector(s);
function show(id){
  ['phaseWait','phasePick','phaseAnswer'].forEach(p=>$('#'+p).classList.toggle('on', p===id));
}
function shapeLabel(s){
  if(s==='top10') return 'TOP 10';
  if(s==='styles') return 'STYLES';
  return 'Q&A ESSAY';
}
function paintSq(el, url, fallbackLabel){
  if(!el) return;
  if(url){
    el.classList.remove('wait');
    el.classList.add('green');
    el.innerHTML='<img src="'+url+(url.indexOf('?')>=0?'&':'?')+'t='+Date.now()+'" alt="face">';
  }else{
    el.classList.add('wait');
    el.classList.remove('green');
    el.innerHTML='<span class=label>'+(fallbackLabel||'Click')+'</span>';
  }
}
async function loadNext(){
  $('#waitStatus').textContent='Loading next Q&A…';
  paintSq($('#waitingSquare'), null, 'Click to open');
  try{
    const j=await(await fetch('/square-next?key='+KEY)).json();
    if(!j||!j.ok){ $('#waitStatus').textContent=(j&&j.msg)||'No entry ready — still click to retry'; cur=null; return; }
    cur=j;
    if(j.faceUrl) paintSq($('#waitingSquare'), j.faceUrl, 'face');
    $('#waitStatus').textContent=(j.demo?'Demo · ':'')+j.id+(j.pillar?(' · '+j.pillar):'')+(j.faceUrl?' · will overwrite existing':'');
    $('#headline').textContent=j.faceUrl?'Square ready — click, then pick a new photo to write over it.':'Square ready. Click it.';
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
  $('#pickStatus').textContent=cur.faceUrl?'Existing face shown — search + click writes OVER it.':'Search + click writes the face-card + top image.';
  paintSq($('#titleSquare'), cur.faceUrl||null, 'face');
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
    statusEl.textContent=items.length+' photos — click one to WRITE OVER the existing image';
    items.forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.title='Overwrite with this photo';
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
async function postPick(imageUrl, slot){
  const body={key:KEY,id:cur.id,imageUrl};
  if(slot!=null && slot>=0) body.slot=slot;
  const r=await fetch('/square-pick',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r.json();
}
async function pickImage(imageUrl, thumbUrl){
  if(!cur||!cur.id) return;
  const onAnswer=!!$('#phaseAnswer').classList.contains('on');
  const statusEl=onAnswer?$('#ansStatus'):$('#pickStatus');
  statusEl.textContent=onAnswer?'Writing over image slot…':'Writing OVER face-card + top image…';
  // Instant preview from the thumb while save runs
  if(thumbUrl){
    const prev='/square-proxy?u='+encodeURIComponent(thumbUrl);
    if(!onAnswer) paintSq($('#titleSquare'), prev, 'face');
    else paintSq($('#ansSquare'), prev, 'face');
  }
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
    if(!j.ok){ statusEl.textContent=j.msg||'Overwrite failed'; return; }
    if(j.mode==='slot'){
      cur.slots=j.slots||cur.slots;
      cur.nextSlot=j.nextSlot;
      cur.faceUrl=j.faceUrl||cur.faceUrl;
      renderSlots();
      $('#ansGrid').innerHTML='';
      statusEl.textContent='Wrote over slot · next ready';
      return;
    }
    cur.faceUrl=j.faceUrl;
    cur.slots=j.slots||[];
    cur.nextSlot=j.nextSlot;
    enterAnswer();
    statusEl.textContent='';
    $('#ansStatus').textContent='Wrote OVER face-card + top image'+(j.blobOk===false?' (local file — Blobs offline)':'')+'.';
  }catch(e){ statusEl.textContent='Save error — try another photo'; }
}
function enterAnswer(){
  $('#ansTitle').textContent=cur.title||cur.id;
  paintSq($('#ansSquare'), cur.faceUrl, 'face');
  $('#ansBlurb').textContent=cur.shape==='top10'
    ? 'Face + top overwritten. Click photos to write over ranks #1, #2…'
    : cur.shape==='styles'
    ? 'Face + top overwritten. Next clicks write over outfit slots.'
    : 'Face + top overwritten (same file). Clicks write over body image slots.';
  renderSlots();
  $('#ansKw').value=suggestKeyword(cur.title||'');
  $('#ansGrid').innerHTML='';
  show('phaseAnswer');
  $('#headline').textContent='Answer page — each click writes over the next image slot.';
}
function renderSlots(){
  const list=$('#slotList');
  list.innerHTML='';
  (cur.slots||[]).forEach(s=>{
    const d=document.createElement('div');
    d.className='slot'+(s.filled?' done':'');
    d.innerHTML='<span class=n>'+s.label+'</span><span class=t>'+(s.filled?(s.url||'filled'):'waiting — will write over')+'</span>';
    list.appendChild(d);
  });
}
$('#waitingSquare').addEventListener('click', openSquare);
$('#searchBtn').addEventListener('click',()=>runSearch(($('#kw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#grid'), $('#pickStatus')));
$('#kw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#searchBtn').click(); });
$('#ansSearchBtn').addEventListener('click',()=>runSearch(($('#ansKw').value||'').trim()||suggestKeyword(cur&&cur.title||''), $('#ansGrid'), $('#ansStatus')));
$('#ansKw').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#ansSearchBtn').click(); });
$('#nextSqBtn').addEventListener('click',async()=>{ show('phaseWait'); $('#headline').textContent='Loading next square…'; await loadNext(); });
loadNext();
</script>
</body>
</html>`;
}

module.exports = { buildSquareDeskPage };
