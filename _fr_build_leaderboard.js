// Builds franchise-leaderboard.html from _fr_rank.json — a searchable, sortable
// "Top Franchises to Open or Buy in 2027" leaderboard (ranked by unit economics).
const fs=require('fs');
const j=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_fr_rank.json','utf8'));
const fmt=v=>v?('$'+(v>=1e6?(v/1e6).toFixed(v>=1e7?0:1)+'M':Math.round(v/1e3)+'K')):'—';
// compact rows for the client
const rows=j.ranks.map(r=>({r:r.rank,n:r.name,id:r.id,i:r.invMid||null,v:r.revMid||null,y:r.royalty||null,s:r.score}));
const DATA=JSON.stringify(rows);
const total=j.total;
const html=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#FBBF24"><meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/svg+xml" href="/icon-192.svg">
<title>Top Franchises to Open or Buy in 2027 — Ranked by Unit Economics | PULSE</title>
<meta name="description" content="Searchable leaderboard ranking ${total} franchises to open or buy in 2027 by unit economics — revenue-to-investment efficiency and royalty load. Find the best franchise to open by the numbers.">
<meta name="keywords" content="best franchises to open 2027, top franchises to buy 2027, franchise rankings, best franchise to open, franchise unit economics, most profitable franchises, franchise leaderboard, franchises by ROI, cheapest franchises to open, highest revenue franchises">
<link rel="canonical" href="https://pulserevops.com/franchise-leaderboard">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:title" content="Top Franchises to Open or Buy in 2027 — Ranked"><meta property="og:description" content="Searchable leaderboard of ${total} franchises ranked by unit economics."><meta property="og:url" content="https://pulserevops.com/franchise-leaderboard"><meta property="og:type" content="website">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Top Franchises to Open or Buy in 2027","description":"Leaderboard ranking ${total} franchises by unit economics.","url":"https://pulserevops.com/franchise-leaderboard"}</script>
<style>
:root{--bg:#070a0f;--bg2:#0e1218;--bg3:#161b25;--ink:#EDE5D8;--dim:rgba(237,229,216,.72);--faint:rgba(237,229,216,.5);--accent:#FBBF24;--orange:#FF8C1A;--line:rgba(255,255,255,.08)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,sans-serif;line-height:1.5}
a{color:var(--orange);text-decoration:none}a:hover{color:var(--accent)}
.top{position:sticky;top:0;z-index:30;background:rgba(7,10,15,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);padding:11px 18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.top .brand{font-weight:900;letter-spacing:.08em;font-size:.82rem}.top .brand .d{color:var(--orange)}
.top a{font-size:.74rem;font-weight:700;color:var(--dim)}
.wrap{max-width:1080px;margin:0 auto;padding:30px 18px 70px}
.eyebrow{font-size:.58rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
h1{font-size:clamp(1.7rem,4vw,2.7rem);font-weight:900;line-height:1.06;margin:0 0 12px;background:linear-gradient(135deg,#FFD740,#FBBF24 50%,#FF8C1A);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.lede{max-width:760px;color:var(--dim);font-size:1rem;margin-bottom:8px}
.note{max-width:760px;color:var(--faint);font-size:.82rem;margin-bottom:18px}
.search{width:100%;max-width:520px;padding:13px 16px;border-radius:12px;border:1px solid var(--line);background:var(--bg2);color:var(--ink);font-size:1rem;outline:none;margin:6px 0 8px}
.search:focus{border-color:rgba(251,191,36,.5)}
.count{font-size:.78rem;color:var(--faint);margin:0 0 14px}
table{width:100%;border-collapse:collapse;font-size:.9rem}
thead th{position:sticky;top:52px;background:var(--bg3);text-align:left;padding:11px 12px;font-size:.62rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--line);cursor:pointer;white-space:nowrap}
thead th[data-s]:hover{color:#fff}
tbody td{padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:middle}
tbody tr:hover{background:rgba(251,191,36,.05)}
.rank{font-weight:900;font-variant-numeric:tabular-nums;color:var(--accent);font-size:1.05rem;width:64px}
.rank .hash{color:var(--faint);font-size:.7rem;margin-right:1px}
.top3{font-size:1.35rem}
.nm{font-weight:700;color:var(--ink)}.nm a{color:var(--ink)}.nm a:hover{color:var(--accent)}
.num{font-variant-numeric:tabular-nums;color:var(--dim);white-space:nowrap}
.ue{min-width:96px}.ue-n{display:block;font-weight:900;font-variant-numeric:tabular-nums;color:var(--accent);font-size:.95rem}
.ue-bar{display:block;height:5px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:4px;overflow:hidden}
.ue-bar span{display:block;height:100%;background:linear-gradient(90deg,#FF8C1A,#FFD740)}
@media(max-width:640px){.hide-sm{display:none}}
.foot{margin-top:26px;font-size:.74rem;color:var(--faint)}
</style></head>
<body>
<div class="top"><span class="brand">PULSE<span class="d">.</span></span><a href="/">Home</a><a href="/franchises">Franchises</a><a href="/fractional-cro">Fractional CRO</a></div>
<div class="wrap">
<div class="eyebrow">⚡ Franchise Leaderboard · 2027</div>
<h1>Top Franchises to Open or Buy in 2027</h1>
<p class="lede">All <strong>${total}</strong> franchises we cover, ranked by <strong>unit economics</strong> — led by <strong>how much each unit actually makes</strong>. Search by name, sort any column, and click through to the full breakdown.</p>
<p class="note">Methodology: <strong>unit economics is the #1 factor.</strong> The biggest driver is per-unit revenue — if a unit makes the most, it ranks highest. Capital efficiency (revenue per dollar invested, so a cheaper build is a plus) and a lighter royalty load are secondary modifiers. Figures are from each brand's latest FDD as covered in its entry, and are estimates that vary by market and operator.</p>
<input id="q" class="search" type="search" placeholder="Search ${total} franchises… (e.g. Chick-fil-A, pizza, gym)" autocomplete="off">
<div class="count" id="count"></div>
<table><thead><tr>
<th data-s="r">Rank</th><th data-s="n">Franchise</th><th data-s="s" title="Unit-economics score — weighted heaviest in the ranking">Unit Econ ★</th><th data-s="i" class="hide-sm">Investment</th><th data-s="v" class="hide-sm">Mature Revenue</th><th data-s="y" class="hide-sm">Royalty</th>
</tr></thead><tbody id="tb"></tbody></table>
<div class="foot">Ranked by Pulse from each brand's FDD. Informational only — not investment advice. See each entry for full numbers and sources.</div>
</div>
<script>
const D=${DATA};
const fmt=v=>v?('$'+(v>=1e6?(v/1e6).toFixed(v>=1e7?0:1)+'M':Math.round(v/1e3)+'K')):'—';
let sortKey='r',asc=true,q='';
const tb=document.getElementById('tb'),count=document.getElementById('count');
function render(){
  let rows=D;
  if(q){const s=q.toLowerCase();rows=rows.filter(r=>r.n.toLowerCase().includes(s));}
  rows=rows.slice().sort((a,b)=>{let x=a[sortKey],y=b[sortKey];if(sortKey==='n'){x=(x||'').toLowerCase();y=(y||'').toLowerCase();return asc?(x<y?-1:x>y?1:0):(x>y?-1:x<y?1:0);}x=x==null?-Infinity:x;y=y==null?-Infinity:y;return asc?x-y:y-x;});
  count.textContent=rows.length+' of '+D.length+' franchises';
  tb.innerHTML=rows.slice(0,400).map(r=>{
    const medal=r.r<=3?['','🥇','🥈','🥉'][r.r]:'';
    return '<tr><td class="rank'+(r.r<=3?' top3':'')+'">'+(medal||('<span class=hash>#</span>'+r.r))+'</td>'
    +'<td class="nm"><a href="/franchises/'+r.id+'">'+r.n+'</a></td>'
    +'<td class="ue"><span class="ue-n">'+(r.s!=null?r.s.toFixed(1):'—')+'</span><span class="ue-bar"><span style="width:'+Math.max(2,r.s||0)+'%"></span></span></td>'
    +'<td class="num hide-sm">'+fmt(r.i)+'</td><td class="num hide-sm">'+fmt(r.v)+'</td>'
    +'<td class="num hide-sm">'+(r.y?r.y+'%':'—')+'</td></tr>';
  }).join('')+(rows.length>400?'<tr><td colspan=5 style="padding:14px;color:var(--faint)">Showing first 400 — refine your search to see more.</td></tr>':'');
}
document.getElementById('q').addEventListener('input',e=>{q=e.target.value;render();});
document.querySelectorAll('th[data-s]').forEach(th=>th.addEventListener('click',()=>{const k=th.dataset.s;if(sortKey===k)asc=!asc;else{sortKey=k;asc=(k==='r'||k==='n');}render();}));
render();
</script>
</body></html>`;
fs.writeFileSync('C:/Users/koryj/website/franchise-leaderboard.html',html);
console.log('wrote franchise-leaderboard.html ('+(html.length/1024).toFixed(0)+' KB,',total,'rows)');
