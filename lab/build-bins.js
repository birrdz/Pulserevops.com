// Build /bins.html — evidence-room cataloged view of the library.
// Groups all valid lab entries by primary tag (first tag in tags array).
const fs = require('fs');
const path = require('path');

const LAB_DIR = path.join(__dirname, 'cheap-100');
const OUT = path.join(__dirname, '..', 'bins.html');

function escTxt(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const files = fs.readdirSync(LAB_DIR).filter(f => /^q\d+\.json$/.test(f));
const bins = {};
let total = 0;
for (const f of files) {
  let e;
  try { e = JSON.parse(fs.readFileSync(path.join(LAB_DIR, f), 'utf8')); }
  catch (err) { continue; }
  const tag = (e.tags && e.tags[0]) || 'misc';
  const norm = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'misc';
  if (!bins[norm]) bins[norm] = { tag: norm, label: tag, entries: [] };
  bins[norm].entries.push({ id: e.id, q: e.question });
  total++;
}

const sorted = Object.values(bins).sort((a, b) => b.entries.length - a.entries.length);

const binCards = sorted.map(b => `
  <a href="#bin-${b.tag}" class="bin">
    <div class="bin-tape">EVIDENCE</div>
    <div class="bin-label">${escTxt(b.label.toUpperCase())}</div>
    <div class="bin-count">${b.entries.length} entries</div>
  </a>
`).join('');

const binSections = sorted.map(b => `
  <section class="bin-section" id="bin-${b.tag}">
    <h2>${escTxt(b.label.toUpperCase())} <span class="bin-section-count">${b.entries.length}</span></h2>
    <ul class="bin-entries">
      ${b.entries.map(e => `<li><a href="/answers.html#${e.id}">${escTxt(e.q)}</a></li>`).join('\n      ')}
    </ul>
  </section>
`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>The Evidence Room — ${total} sales answers, filed by topic | Pulse RevOps</title>
  <meta name="description" content="${total} operator-grade sales answers, organized into ${sorted.length} topic bins. Browse by category — comp, hiring, pipeline, pricing, discovery, demos, objections, churn, scaling, and more.">
  <link rel="canonical" href="https://pulserevops.com/bins.html">
  <meta property="og:title" content="The Evidence Room — Sales Answers Filed by Topic">
  <meta property="og:description" content="${total} answers across ${sorted.length} topic bins. Pulse RevOps' library, organized.">
  <meta property="og:url" content="https://pulserevops.com/bins.html">
  <meta property="og:image" content="https://pulserevops.com/assets/PULSELINKEDINBG.jpg">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E8710A' d='M3 12h3l2-7 4 14 2-7h7'/%3E%3C/svg%3E">
  <style>
    :root { --orange:#E8710A; --orange-bright:#FF8C1A; --ink:#EDE5D8; --bg:#070a0f; --cardboard:#b8956a; --cardboard-dark:#8b6f4f; --tape:#d4a574; --marker:#c63d1f; }
    * { box-sizing:border-box; }
    html,body { margin:0; padding:0; background:var(--bg); color:var(--ink); font-family:'Inter',-apple-system,sans-serif; line-height:1.55; scroll-behavior:smooth; }
    a { color:var(--orange-bright); text-decoration:none; }

    .top { padding:28px clamp(20px,5vw,56px) 16px; display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
    .brand { font-size:0.78rem; font-weight:800; letter-spacing:0.32em; text-transform:uppercase; }
    .brand .dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--orange-bright); margin-right:12px; box-shadow:0 0 10px var(--orange-bright); }
    .nav-links { display:flex; gap:14px; font-size:0.7rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; }
    .nav-links a { color:rgba(237,229,216,0.65); }
    .nav-links a:hover { color:var(--orange-bright); }

    .hero { padding:32px clamp(20px,5vw,56px) 28px; max-width:1080px; margin:0 auto; text-align:center; }
    .hero .kicker { font-size:0.66rem; font-weight:800; letter-spacing:0.28em; text-transform:uppercase; color:var(--orange-bright); margin-bottom:10px; }
    .hero h1 { font-size:clamp(2rem,4.2vw,3.2rem); font-weight:900; letter-spacing:-0.02em; margin:0 0 14px; }
    .hero p { color:rgba(237,229,216,0.75); font-size:1.05rem; max-width:680px; margin:0 auto; }
    .hero .stats { display:flex; gap:22px; justify-content:center; margin-top:18px; flex-wrap:wrap; font-size:0.66rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(237,229,216,0.5); }
    .hero .stats b { color:var(--orange-bright); font-weight:900; font-size:0.95rem; }

    .bin-grid { max-width:1200px; margin:0 auto; padding:24px clamp(20px,5vw,56px) 48px; display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:18px; }
    .bin { display:block; position:relative; padding:24px 18px 20px; min-height:140px; background:linear-gradient(160deg,var(--cardboard) 0%,var(--cardboard-dark) 100%); border:2px solid #6b5236; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1); cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; color:#2a1f0f; text-decoration:none; }
    .bin:hover { transform:translateY(-2px); box-shadow:0 8px 18px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.12); }
    .bin-tape { position:absolute; top:-8px; left:50%; transform:translateX(-50%) rotate(-2deg); background:var(--tape); padding:3px 22px; font-size:0.55rem; font-weight:800; letter-spacing:0.22em; color:#5a3f20; border:1px solid rgba(0,0,0,0.15); box-shadow:0 1px 3px rgba(0,0,0,0.3); }
    .bin-label { font-family:'Permanent Marker','Marker Felt','Comic Sans MS',cursive; font-size:1.4rem; font-weight:900; color:var(--marker); text-align:center; margin-top:12px; letter-spacing:0.04em; line-height:1.1; transform:rotate(-1.5deg); text-shadow:1px 1px 0 rgba(0,0,0,0.1); word-break:break-word; }
    .bin-count { position:absolute; bottom:10px; right:14px; font-family:'Courier New',monospace; font-size:0.7rem; font-weight:700; color:#3a2812; padding:2px 8px; background:rgba(255,255,255,0.25); border:1px solid rgba(0,0,0,0.2); border-radius:3px; }

    .bin-sections { max-width:980px; margin:48px auto 64px; padding:0 clamp(20px,5vw,56px); }
    .bin-section { margin:32px 0; padding:24px 26px; background:rgba(10,14,20,0.55); border:1px solid rgba(255,255,255,0.08); border-radius:12px; }
    .bin-section h2 { font-family:'Permanent Marker','Marker Felt','Comic Sans MS',cursive; font-size:1.6rem; color:var(--marker); margin:0 0 16px; transform:rotate(-0.5deg); }
    .bin-section-count { font-family:'Courier New',monospace; font-size:0.75rem; color:rgba(237,229,216,0.5); padding:2px 8px; border:1px solid rgba(255,255,255,0.15); border-radius:3px; margin-left:8px; vertical-align:middle; }
    .bin-entries { list-style:none; padding:0; margin:0; }
    .bin-entries li { padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.95rem; }
    .bin-entries li:last-child { border-bottom:none; }
    .bin-entries a { color:rgba(237,229,216,0.85); }
    .bin-entries a:hover { color:var(--orange-bright); }

    .footer-note { padding:24px 0 48px; text-align:center; color:rgba(237,229,216,0.4); font-size:0.72rem; letter-spacing:0.12em; }
  </style>
</head>
<body>
  <div class="top">
    <div class="brand"><span class="dot"></span>Pulse · The Evidence Room</div>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/knowledge.html">Head</a>
      <a href="/answers.html">Tail</a>
      <a href="/themachine">Machine</a>
    </div>
  </div>

  <div class="hero">
    <div class="kicker">◉ The Evidence Room — Filed by Topic</div>
    <h1>${total} Sales Answers, Filed by Topic</h1>
    <p>The library, organized like an evidence room. ${sorted.length} cardboard bins, marker-stenciled, sorted by frequency. Click a bin to drop into its entries — or browse linearly at <a href="/answers.html">Processing (not deployed)</a> / <a href="/knowledge.html">Posted (on site)</a>.</p>
    <div class="stats">
      <div><b>${total}</b> entries</div>
      <div><b>${sorted.length}</b> bins</div>
    </div>
  </div>

  <div class="bin-grid">
${binCards}
  </div>

  <div class="bin-sections">
${binSections}
  </div>

  <div class="footer-note">Pulse RevOps · The Evidence Room · ${new Date().toISOString().slice(0,10)}</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`wrote ${OUT} — ${total} entries across ${sorted.length} bins`);
