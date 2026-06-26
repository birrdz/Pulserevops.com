// Adds a visible "Graphics" pillar card to the homepage pillar grid via Netlify
// snippet injection — NO deploy (same mechanism as the build-status widget).
// Idempotent: updates the snippet if it already exists. Run: node _inject_graphics_pill.js
require('./_loadenv.js');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.BLOBS_PAT;
const TITLE = 'PULSE Graphics pillar card';
const HTML = `<!-- PULSE Graphics pillar card (snippet-injected, no deploy) -->
<script id="pulse-graphics-pill">
(function(){
  function add(){
    var p=location.pathname;
    if(p!=='/'&&p!=='/index.html')return;
    var grid=document.querySelector('.pgrid');
    if(!grid||grid.querySelector('a[href="/graphics"]'))return;
    var a=document.createElement('a');
    a.className='pcard';
    a.href='/graphics';
    a.innerHTML='<span class="em">\\uD83C\\uDFA8</span><span class="pt"><span class="pn">Graphics</span><span class="pd">Themeable RevOps SVGs</span></span>';
    grid.appendChild(a);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);
  else add();
})();
</script>`;

(async () => {
  const base = 'https://api.netlify.com/api/v1/sites/' + SID + '/snippets';
  const list = await (await fetch(base, { headers: { Authorization: 'Bearer ' + TOK } })).json();
  const existing = Array.isArray(list) ? list.find(s => s.title === TITLE) : null;
  const body = JSON.stringify({ title: TITLE, general: HTML, general_position: 'body' });
  const opts = { method: existing ? 'PUT' : 'POST', headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' }, body };
  const url = existing ? base + '/' + existing.id : base;
  const r = await fetch(url, opts);
  console.log((existing ? 'UPDATED' : 'CREATED') + ' snippet -> HTTP ' + r.status);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
