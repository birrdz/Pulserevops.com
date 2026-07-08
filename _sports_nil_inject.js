// _sports_nil_inject.js — open up /sports (remove the 4-digit password gate) and re-list all
// college NIL Q&As on the page. Idempotent (re-run safe). Reads _nil_entries.json.
const fs = require('fs');
const P = 'C:/Users/koryj/website/sports.html';
const nil = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_nil_entries.json', 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// classify
const groups = { bball: [], fball: [], other: [] };
for (const e of nil) {
  const q = e.question || '';
  if (/football/i.test(q)) groups.fball.push(e);
  else if (/basketball/i.test(q)) groups.bball.push(e);
  else groups.other.push(e);
}
const linkList = arr => arr.map(e => `      <a class="nil-link" href="/knowledge/${e.id}">${esc(e.question)}</a>`).join('\n');
const sub = (title, arr) => arr.length ? `    <h3 class="nil-h3">${title} <span class="nil-ct">${arr.length}</span></h3>\n    <div class="nil-grid">\n${linkList(arr)}\n    </div>\n` : '';

const SECTION = `
<section id="nil-qas" class="nil-qas">
  <div class="nil-head">
    <h2>🏀🏈 College Sports &amp; NIL — Q&amp;A Library <span class="nil-ct">${nil.length}</span></h2>
    <p class="nil-sub">Every Pulse answer on college Name, Image &amp; Likeness (NIL) earnings, collectives, revenue-share, and roster strategy. Tap any question to read the full breakdown.</p>
    <input id="nil-filter" class="nil-filter" type="search" placeholder="Filter questions (team, sport, keyword)…" oninput="nilFilter(this.value)">
  </div>
${sub("Men's &amp; Women's Basketball", groups.bball)}${sub('Football', groups.fball)}${sub('More NIL &amp; Revenue', groups.other)}
</section>
`;

const STYLE = `
<style id="nil-qas-style">
  .nil-qas { max-width:1180px; margin:0 auto 36px; padding:24px 22px; border:1px solid rgba(120,180,255,0.18); border-radius:16px; background:rgba(12,22,40,0.45); }
  .nil-qas h2 { margin:0 0 6px; font-size:1.5rem; font-weight:900; color:#7BB6FF; }
  .nil-qas .nil-sub { margin:0 0 14px; font-size:0.86rem; color:rgba(190,215,255,0.72); line-height:1.5; }
  .nil-ct { display:inline-block; font-size:0.72rem; font-weight:800; color:#0b1628; background:#7BB6FF; border-radius:99px; padding:2px 9px; vertical-align:middle; }
  .nil-filter { width:100%; max-width:440px; padding:9px 13px; border-radius:10px; border:1px solid rgba(120,180,255,0.3); background:rgba(8,16,30,0.7); color:#e8f0ff; font-size:0.9rem; outline:none; }
  .nil-filter:focus { border-color:#7BB6FF; box-shadow:0 0 12px rgba(120,180,255,0.35); }
  .nil-h3 { margin:20px 0 10px; font-size:0.78rem; letter-spacing:0.14em; text-transform:uppercase; color:rgba(180,210,255,0.8); }
  .nil-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:8px 16px; }
  .nil-link { display:block; font-size:0.9rem; color:#cfe0ff; text-decoration:none; padding:6px 10px; border-radius:8px; border:1px solid transparent; transition:background .15s,border-color .15s; }
  .nil-link:hover { background:rgba(120,180,255,0.1); border-color:rgba(120,180,255,0.3); color:#fff; }
  .nil-link.nil-hide { display:none; }
</style>
`;

const FILTER_JS = `
<script id="nil-qas-js">
  function nilFilter(v){ v=(v||'').toLowerCase().trim();
    document.querySelectorAll('#nil-qas .nil-link').forEach(function(a){
      a.classList.toggle('nil-hide', v && a.textContent.toLowerCase().indexOf(v)===-1);
    });
    document.querySelectorAll('#nil-qas .nil-h3').forEach(function(h){
      var grid=h.nextElementSibling; if(!grid) return;
      var any=Array.prototype.some.call(grid.querySelectorAll('.nil-link'),function(a){return !a.classList.contains('nil-hide');});
      h.style.display=any?'':'none'; grid.style.display=any?'':'none';
    });
  }
</script>
`;

let html = fs.readFileSync(P, 'utf8');

// 1) remove a prior injection if present (idempotent)
html = html.replace(/<style id="nil-qas-style">[\s\S]*?<\/style>\n?/, '');
html = html.replace(/<section id="nil-qas"[\s\S]*?<\/section>\n?/, '');
html = html.replace(/<script id="nil-qas-js">[\s\S]*?<\/script>\n?/, '');

// 2) delete the password gate div
html = html.replace(/<div class="gate" id="gate">[\s\S]*?<div id="unlocked">/, '<div id="unlocked">');

// 3) make #unlocked visible by default
html = html.replace('#unlocked { display:none;', '#unlocked { display:block;');

// 4) neutralize the gate JS (gate element no longer exists)
html = html.replace(/<script>\s*function checkPwd[\s\S]*?<\/script>/, '<script>/* sports page is open — gate removed */</script>');

// 5) inject style into <head> (before </head>) and the NIL section at the top of #unlocked
html = html.replace('</head>', STYLE + '</head>');
html = html.replace('<div id="unlocked">', '<div id="unlocked">\n' + SECTION + FILTER_JS);

fs.writeFileSync(P, html, 'utf8');
console.log('sports.html updated: gate removed, NIL section injected with', nil.length, 'links (bball', groups.bball.length, 'fball', groups.fball.length, 'other', groups.other.length + ')');
