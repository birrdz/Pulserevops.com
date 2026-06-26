// Removes the left-hand jump-to-section TOC rail (#entry-toc-left) on all answer
// pages via Netlify snippet injection — NO deploy. Idempotent (updates if exists).
// Run: node _inject_hide_left_toc.js
require('./_loadenv.js');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.BLOBS_PAT;
const TITLE = 'PULSE hide left TOC rail';
// CSS must out-specify the page's `#entry-toc-left.toc-ready{display:block!important}`
// (id+class) — so match it with html+id+class. Plus JS removes the node outright.
const HTML = `<style id="pulse-hide-left-toc">
/* Owner 2026-06-26: remove the left-hand jump-to-section TOC rail on answer pages */
html #entry-toc-left, html #entry-toc-left.toc-ready{display:none !important;visibility:hidden !important;}
</style>
<script id="pulse-kill-left-toc">
(function(){function kill(){var n=document.querySelectorAll('#entry-toc-left');for(var i=0;i<n.length;i++)n[i].remove();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',kill);else kill();setTimeout(kill,1200);})();
</script>`;

(async () => {
  const base = 'https://api.netlify.com/api/v1/sites/' + SID + '/snippets';
  const list = await (await fetch(base, { headers: { Authorization: 'Bearer ' + TOK } })).json();
  const existing = Array.isArray(list) ? list.find(s => s.title === TITLE) : null;
  const body = JSON.stringify({ title: TITLE, general: HTML, general_position: 'head' });
  const r = await fetch(existing ? base + '/' + existing.id : base, {
    method: existing ? 'PUT' : 'POST',
    headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' }, body,
  });
  console.log((existing ? 'UPDATED' : 'CREATED') + ' snippet -> HTTP ' + r.status);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
