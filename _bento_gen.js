const fs=require('fs');
const cards=JSON.parse(fs.readFileSync('C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/5313d009-9bbe-4c3b-b7bd-ca2e078ef434/scratchpad/cards.json','utf8'));
// span-pattern cycle — no two ADJACENT cards the same size (6-col grid). grid-auto-flow:dense fills gaps.
const SZ=['hero','tall','wide','std','tall','std','wide','std','hero','wide','tall','std','wide','std','tall','wide'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cardHtml=(c,i)=>{
  const z=SZ[i%SZ.length];
  // whole card = link; image lazy + alt; fade-in on load; onerror removes the card (no broken rectangles).
  return `<a class="bento-card ${z}" href="/knowledge/${encodeURIComponent(c.id)}" aria-label="${esc(c.q)}">
    <img class="bento-img" src="/assets/qa/${c.id}.jpg" alt="${esc(c.q)}" loading="lazy"
         onload="if(this.naturalWidth<100){var p=this.closest('.bento-card');if(p)p.remove();}else{this.classList.add('loaded');}"
         onerror="var p=this.closest('.bento-card'); if(p) p.remove();">
    <div class="bento-grad"></div>
    <div class="bento-txt"><span class="bento-eyebrow">${esc(c.cat)}</span><h3 class="bento-title">${esc(c.q)}</h3></div>
  </a>`;
};
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pulse News — Bento Grid (DDG images)</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,900&display=swap" rel="stylesheet">
<!-- PULSE-BENTO-GRID:START (idempotent block — re-running replaces between these markers) -->
<style>
:root{--gold:#FFB81C;--bg:#1A0710}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);padding:16px;font-family:system-ui,-apple-system,sans-serif}
h1.hd{color:var(--gold);font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:900;font-size:1.5rem;text-align:center;margin:4px 0 16px}
.bento-grid{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:120px;gap:10px;grid-auto-flow:dense;max-width:1320px;margin:0 auto}
.bento-card{position:relative;overflow:hidden;border-radius:10px;text-decoration:none;background:#241019;box-shadow:0 4px 16px rgba(0,0,0,.45);transition:transform .22s ease,box-shadow .22s ease}
.bento-card:hover{transform:scale(1.015);box-shadow:0 10px 30px rgba(255,184,28,.24),0 0 0 1px rgba(255,184,28,.4)}
.bento-card.hero{grid-column:span 3;grid-row:span 3}
.bento-card.wide{grid-column:span 3;grid-row:span 2}
.bento-card.tall{grid-column:span 2;grid-row:span 3}
.bento-card.std{grid-column:span 2;grid-row:span 2}
.bento-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .45s ease}
.bento-img.loaded{opacity:1}
.bento-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,5,12,0.92) 0%,rgba(20,5,12,0.55) 40%,transparent 75%)}
.bento-txt{position:absolute;left:0;right:0;bottom:0;padding:14px;z-index:2}
.bento-eyebrow{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.14em;font-weight:800;color:var(--gold);margin-bottom:5px}
.bento-title{margin:0;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:700;color:var(--gold);line-height:1.15;text-shadow:0 1px 3px rgba(0,0,0,.6);font-size:17px;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bento-card.hero .bento-title{font-size:22px;-webkit-line-clamp:3}
.bento-card.wide .bento-title{font-size:20px;-webkit-line-clamp:2}
.bento-card.tall .bento-title{font-size:18px}
@media(max-width:1024px){.bento-grid{grid-template-columns:repeat(4,1fr)}}
@media(max-width:640px){.bento-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:130px}.bento-card.hero{grid-column:span 2;grid-row:span 2}.bento-card.wide{grid-column:span 2;grid-row:span 2}.bento-card.tall{grid-column:span 2;grid-row:span 2}.bento-card.std{grid-column:span 1;grid-row:span 1}}
</style>
<!-- PULSE-BENTO-GRID:END -->
</head><body>
<h1 class="hd">Pulse News — Bento Grid (6-col spanning, DDG images)</h1>
<div class="bento-grid">
${cards.map(cardHtml).join('\n')}
</div></body></html>`;
fs.writeFileSync('C:/Users/koryj/website/_bento_mock.html', html);
console.log('wrote _bento_mock.html — 6-col bento,', cards.length, 'cards');
