// Builds nil-leaderboard.html from _nil_rank.json — a searchable "Top NIL Schools"
// leaderboard ranked by total athlete money (rev-share + collective), 2026-27.
const fs=require('fs');
const j=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_nil_rank.json','utf8'));
const DATA=JSON.stringify(j.schools);
const N=j.schools.length;
const html=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#FBBF24"><meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/svg+xml" href="/icon-192.svg">
<title>Top NIL Schools ${j.season} — Ranked by Collective &amp; Revenue-Share Money | PULSE</title>
<meta name="description" content="Searchable leaderboard ranking the top college programs by total athlete money for ${j.season} — NIL collective + revenue-share spend across football, men's and women's basketball. Updated regularly.">
<meta name="keywords" content="best NIL schools 2027, top NIL collectives, NIL school rankings, NIL revenue sharing, highest NIL budget, college football NIL spending, men's basketball NIL, women's basketball NIL, NIL collective money, which school spends most on NIL">
<link rel="canonical" href="https://pulserevops.com/nil-leaderboard">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:title" content="Top NIL Schools ${j.season} — Ranked"><meta property="og:description" content="Top programs by NIL collective + revenue-share money across football and basketball."><meta property="og:url" content="https://pulserevops.com/nil-leaderboard"><meta property="og:type" content="website">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Top NIL Schools ${j.season}","description":"Leaderboard ranking college programs by total athlete money for ${j.season}.","url":"https://pulserevops.com/nil-leaderboard"}</script>
<style>
:root{--bg:#070a0f;--bg2:#0e1218;--bg3:#161b25;--ink:#EDE5D8;--dim:rgba(237,229,216,.72);--faint:rgba(237,229,216,.5);--accent:#FBBF24;--orange:#FF8C1A;--line:rgba(255,255,255,.08)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,sans-serif;line-height:1.5}
a{color:var(--orange);text-decoration:none}a:hover{color:var(--accent)}
.top{position:sticky;top:0;z-index:30;background:rgba(7,10,15,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:11px 18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.top .brand{font-weight:900;letter-spacing:.08em;font-size:.82rem}.top .brand .d{color:var(--orange)}
.top a{font-size:.74rem;font-weight:700;color:var(--dim)}
.wrap{max-width:1180px;margin:0 auto;padding:30px 18px 70px}
.eyebrow{font-size:.58rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
h1{font-size:clamp(1.7rem,4vw,2.7rem);font-weight:900;line-height:1.06;margin:0 0 12px;background:linear-gradient(135deg,#FFD740,#FBBF24 50%,#FF8C1A);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.lede{max-width:820px;color:var(--dim);font-size:1rem;margin-bottom:8px}
.note{max-width:820px;color:var(--faint);font-size:.82rem;margin-bottom:8px}
.upd{font-size:.74rem;color:var(--accent);font-weight:700;margin-bottom:16px}
.search{width:100%;max-width:520px;padding:13px 16px;border-radius:12px;border:1px solid var(--line);background:var(--bg2);color:var(--ink);font-size:1rem;outline:none;margin:6px 0 8px}
.search:focus{border-color:rgba(251,191,36,.5)}
.count{font-size:.78rem;color:var(--faint);margin:0 0 14px}
table{width:100%;border-collapse:collapse;font-size:.88rem}
thead th{position:sticky;top:52px;background:var(--bg3);text-align:left;padding:10px 11px;font-size:.6rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--line);cursor:pointer;white-space:nowrap}
tbody td{padding:11px;border-bottom:1px solid var(--line);vertical-align:top}
tbody tr:hover{background:rgba(251,191,36,.05)}
.rank{font-weight:900;font-variant-numeric:tabular-nums;color:var(--accent);font-size:1.05rem;width:54px}
.rank .hash{color:var(--faint);font-size:.7rem}.top3{font-size:1.3rem}
.sch{font-weight:800;color:var(--ink);white-space:nowrap}
.col{color:var(--dim);font-size:.82rem}
.tot{font-variant-numeric:tabular-nums;white-space:nowrap;min-width:96px}
.tot-n{display:block;font-weight:900;color:#7CFFB2;font-size:.95rem}
.tot-bar{display:block;height:5px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:4px;overflow:hidden;max-width:120px}
.tot-bar span{display:block;height:100%;background:linear-gradient(90deg,#FF8C1A,#FFD740)}
.sp{color:var(--dim);font-size:.8rem;min-width:120px}
.q{color:var(--faint)}
.conf{font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:2px 7px;border-radius:99px}
.c-high{background:rgba(124,255,178,.14);color:#7CFFB2}.c-medium{background:rgba(251,191,36,.14);color:var(--accent)}.c-low{background:rgba(237,229,216,.1);color:var(--faint)}
@media(max-width:760px){.hide-sm{display:none}}
.foot{margin-top:24px;font-size:.74rem;color:var(--faint)}
</style></head>
<body>
<div class="top"><span class="brand">PULSE<span class="d">.</span></span><a href="/">Home</a><a href="/sports">Sports / NIL</a><a href="/franchise-leaderboard">Franchise Leaderboard</a></div>
<div class="wrap">
<div class="eyebrow">⚡ NIL Leaderboard · ${j.season}</div>
<h1>Top NIL Schools — ${j.season}</h1>
<p class="lede">Ranked by <strong>who's paying the most for players</strong> — total current/upcoming <strong>roster spend (player payroll)</strong> across <strong>football, men's & women's basketball</strong> for the <strong>${j.season}</strong> season. This is who has the most money to throw around — <em>not</em> a prediction of results (a #1 payroll can still finish last). Search by school, sort any column.</p>
<p class="note">${j.basis}</p>
<p class="upd">📅 Reflects right now / the ${j.season} cycle. Updated regularly — figures with "?" depend on unsettled recruiting/transfers and get filled in as they land.</p>
<input id="q" class="search" type="search" placeholder="Search schools… (e.g. Kentucky, LSU, Texas)" autocomplete="off">
<div class="count" id="count"></div>
<table><thead><tr>
<th data-s="rank">Rank</th><th data-s="school">School</th><th data-s="collective" class="hide-sm">Collective</th><th data-s="total">Roster $ ★</th><th class="hide-sm">Football</th><th class="hide-sm">Men's BB</th><th class="hide-sm">Women's BB</th><th data-s="conf">Confidence</th>
</tr></thead><tbody id="tb"></tbody></table>
<div class="foot">Compiled by Pulse from public reporting (roster valuations, collective disclosures, rev-share filings). NIL/collective spending is largely undisclosed, so all figures are estimates that change weekly. Informational only.</div>
</div>
<script>
const D=${DATA};
const sp=v=>v==='?'?'<span class="q">?</span>:v;
const num=t=>{const m=String(t).match(/([\\d.]+)/);return m?parseFloat(m[1]):0;};
const MAXM=Math.max.apply(null,D.map(r=>num(r.total)));
let sortKey='rank',asc=true,q='';
const tb=document.getElementById('tb'),count=document.getElementById('count');
function render(){
  let rows=D;
  if(q){const s=q.toLowerCase();rows=rows.filter(r=>(r.school+' '+r.collective).toLowerCase().includes(s));}
  rows=rows.slice().sort((a,b)=>{let x=a[sortKey],y=b[sortKey];if(sortKey==='total'){x=num(x);y=num(y);return asc?y-x:x-y;}if(typeof x==='string'){x=x.toLowerCase();y=(y||'').toLowerCase();return asc?(x<y?-1:1):(x>y?-1:1);}return asc?x-y:y-x;});
  count.textContent=rows.length+' of '+D.length+' schools';
  tb.innerHTML=rows.map(r=>{
    const medal=r.rank<=3?['','🥇','🥈','🥉'][r.rank]:'';
    return '<tr><td class="rank'+(r.rank<=3?' top3':'')+'">'+(medal||('<span class=hash>#</span>'+r.rank))+'</td>'
    +'<td class="sch">'+r.school+'</td><td class="col hide-sm">'+sp(r.collective)+'</td>'
    +'<td class="tot"><span class="tot-n">'+r.total+'</span><span class="tot-bar"><span style="width:'+Math.max(3,Math.round(num(r.total)/MAXM*100))+'%"></span></span></td>'
    +'<td class="sp hide-sm">'+sp(r.fb)+'</td><td class="sp hide-sm">'+sp(r.mbb)+'</td><td class="sp hide-sm">'+sp(r.wbb)+'</td>'
    +'<td><span class="conf c-'+r.conf+'">'+r.conf+'</span></td></tr>';
  }).join('');
}
document.getElementById('q').addEventListener('input',e=>{q=e.target.value;render();});
document.querySelectorAll('th[data-s]').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.s;if(sortKey===k)asc=!asc;else{sortKey=k;asc=(k==='rank'||k==='school');}render();}));
render();
</script>
</body></html>`;
fs.writeFileSync('C:/Users/koryj/website/nil-leaderboard.html',html);
console.log('wrote nil-leaderboard.html ('+(html.length/1024).toFixed(0)+' KB,',N,'schools)');
