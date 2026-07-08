// Generates the Fish & Crabs pillar: a hub + self-contained hot-spot pages, each
// with a time-of-day-aware Leaflet heat map + Q&A. Honest data: illustrative
// seasonal/time density + REAL public-access points, with disclaimers.
// Output: fish-and-crabs/index.html (hub) + fish-and-crabs/<slug>.html (spots).
const fs = require('fs');
const DIR = 'C:/Users/koryj/website/fish-and-crabs';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const CSS = `
  :root{ --bg:#0e1418; --bg2:#16202a; --card:#16202a; --line:rgba(255,255,255,0.08);
    --text:#eaf2f4; --muted:#9fb0b6; --accent:#13c2c2; --accent2:#ff8c1a; --crab:#ff5a3c; --fish:#2f9be8; }
  *{box-sizing:border-box}
  body{margin:0;font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.65}
  a{color:var(--accent)}
  .topbar{position:sticky;top:0;z-index:1000;display:flex;justify-content:space-between;align-items:center;
    padding:13px 22px;background:rgba(14,20,24,0.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
  .topbar .brand{font-family:'Plus Jakarta Sans';font-weight:900;letter-spacing:.04em;color:#fff;text-decoration:none}
  .topbar a{text-decoration:none;font-weight:800;font-size:.9rem}
  .wrap{max-width:1040px;margin:0 auto;padding:0 20px}
  .eyebrow{margin:34px 0 8px;font-size:.66rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}
  h1{font-family:'Plus Jakarta Sans';font-size:clamp(1.9rem,4.4vw,2.9rem);margin:0 0 12px;line-height:1.12;color:#fff}
  .dek{color:var(--muted);font-size:1.08rem;max-width:760px}
  .meta{margin:14px 0 4px;font-size:.8rem;color:var(--muted)}
  .quick{margin:22px 0;padding:18px 22px;background:linear-gradient(135deg,rgba(19,194,194,.1),rgba(255,140,26,.06));
    border:1px solid rgba(19,194,194,.25);border-radius:14px}
  .quick b{color:#fff}
  .mapcard{margin:26px 0;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--card)}
  .maphead{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line)}
  .maphead h2{margin:0;font-size:1.05rem}
  .toggles{display:flex;gap:8px}
  .tg{cursor:pointer;font-size:.72rem;font-weight:800;padding:5px 11px;border-radius:20px;border:1px solid var(--line);background:transparent;color:var(--muted);font-family:inherit}
  .tg.crab.on{background:rgba(255,90,60,.18);border-color:var(--crab);color:#ffb3a6}
  .tg.fish.on{background:rgba(47,155,232,.18);border-color:var(--fish);color:#bfe0fb}
  .timebar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.02)}
  .timebar .lbl{font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .times{display:flex;gap:6px;flex-wrap:wrap}
  .tm{cursor:pointer;font-size:.74rem;font-weight:800;padding:6px 12px;border-radius:8px;border:1px solid var(--line);background:transparent;color:var(--muted);font-family:inherit}
  .tm.on{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#06121a;border-color:transparent}
  .nowbite{font-size:.74rem;color:var(--muted)}
  #map{height:460px;width:100%;background:#0a1014}
  .legend{display:flex;gap:14px;flex-wrap:wrap;font-size:.74rem;color:var(--muted);padding:10px 18px}
  .legend span{display:inline-flex;align-items:center;gap:6px}
  .dot{width:11px;height:11px;border-radius:50%;display:inline-block}
  .maphint{padding:10px 18px;font-size:.74rem;color:var(--muted);border-top:1px solid var(--line)}
  .dialogue{display:flex;gap:14px;align-items:flex-start;margin:18px 0 6px;padding:18px 20px;border-radius:16px;
    background:linear-gradient(135deg,rgba(19,194,194,.12),rgba(255,140,26,.07));border:1px solid rgba(19,194,194,.28)}
  .dialogue .av{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:1.5rem;
    background:rgba(14,20,24,.55);border:1px solid var(--line)}
  .dialogue .when{font-size:.66rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:5px}
  .dialogue .text{color:#eaf2f4;font-size:1.04rem;line-height:1.6;margin:0}
  .dialogue .sig{margin-top:8px;font-size:.78rem;color:var(--muted);font-style:italic}
  /* fullscreen */
  .tg.fs{margin-left:auto}
  .mapcard:fullscreen{background:var(--bg);display:flex;flex-direction:column;width:100vw;height:100vh}
  .mapcard:fullscreen #map{flex:1;height:auto}
  .mapcard:-webkit-full-screen{background:var(--bg);width:100vw;height:100vh;display:flex;flex-direction:column}
  .mapcard:-webkit-full-screen #map{flex:1}
  /* map controls + tap hint */
  #map{position:relative;cursor:pointer}
  .mapcard:fullscreen #map,.mapcard:-webkit-full-screen #map{cursor:default}
  .leaflet-control-layers{background:var(--card)!important;color:var(--text)!important;border:1px solid var(--line)!important;border-radius:10px!important}
  .leaflet-control-layers-expanded{padding:9px 12px 9px 10px!important;font-size:.8rem}
  .leaflet-control-layers label{margin:3px 0;font-weight:700}
  .leaflet-bar a{background:var(--card)!important;color:var(--text)!important;border-bottom:1px solid var(--line)!important}
  .leaflet-bar a:hover{background:var(--bg2)!important}
  .leaflet-control-scale-line{background:rgba(14,20,24,.7)!important;color:var(--text)!important;border-color:var(--line)!important}
  .maptip{position:absolute;z-index:600;left:50%;top:12px;transform:translateX(-50%);background:rgba(14,20,24,.85);color:#eaf2f4;
    font-size:.74rem;font-weight:700;padding:6px 14px;border-radius:20px;border:1px solid var(--line);pointer-events:none;
    white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35);transition:opacity .4s}
  /* gradient legend */
  .heatleg{display:flex;align-items:center;gap:12px;padding:11px 18px;flex-wrap:wrap;border-top:1px solid var(--line)}
  .heatleg .bar{height:10px;width:150px;border-radius:6px;background:linear-gradient(to right,#2ecc71,#f1c40f,#e67e22,#e74c3c)}
  .heatleg .lab{font-size:.72rem;color:var(--muted);font-weight:700}
  .heatleg .pin{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;color:var(--muted)}
  .locask{position:absolute;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;background:rgba(8,12,16,.5);backdrop-filter:blur(2px)}
  .locask-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;max-width:290px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.55)}
  .locask-t{font-weight:800;font-size:1.05rem;color:#fff;margin-bottom:6px}
  .locask-d{font-size:.82rem;color:var(--muted);margin-bottom:14px;line-height:1.45}
  .locask-b{display:flex;gap:8px;justify-content:center}
  .locask-b button{padding:9px 14px;border-radius:9px;border:none;font-weight:700;cursor:pointer;background:#e67e22;color:#fff;font-size:.85rem}
  .locask-b button.ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
  h2.sec{font-family:'Plus Jakarta Sans';font-size:1.5rem;margin:38px 0 6px;color:#fff}
  .spotcard{display:flex;gap:14px;align-items:flex-start;margin:12px 0;padding:14px 16px;background:var(--card);border:1px solid var(--line);border-radius:12px}
  .spotcard .rank{flex:0 0 auto;width:30px;height:30px;border-radius:8px;display:grid;place-items:center;font-weight:900;background:rgba(19,194,194,.15);color:var(--accent)}
  .spotcard b{color:#fff}
  .chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}
  .chip{font-size:.68rem;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--line)}
  .qa{border-top:1px solid var(--line);padding:18px 0}
  .qa h3{margin:0 0 6px;font-size:1.12rem;color:#fff}
  .qa p{margin:0 0 10px;color:#d4dee1}
  .disc{margin:30px 0;padding:14px 18px;font-size:.82rem;color:var(--muted);background:rgba(255,140,26,.06);border:1px solid rgba(255,140,26,.22);border-radius:12px}
  /* hub */
  .hubgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin:26px 0 10px}
  .hubcard{display:block;text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--card);transition:border-color .2s,transform .2s}
  .hubcard:hover{border-color:var(--accent);transform:translateY(-3px)}
  .hubcard .body{padding:16px 18px}
  .hubcard h3{margin:0 0 6px;color:#fff;font-family:'Plus Jakarta Sans';font-size:1.12rem}
  .hubcard p{margin:0;color:var(--muted);font-size:.92rem}
  .hubcard .tag{display:inline-block;margin-bottom:8px;font-size:.64rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
  .subtiles{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:26px 0 14px}
  @media(max-width:560px){.subtiles{grid-template-columns:1fr}}
  .subtile{display:block;text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:20px;padding:34px 26px;text-align:center;
    background:var(--card);transition:border-color .2s,transform .2s}
  .subtile:hover{transform:translateY(-3px)}
  .subtile.crab:hover{border-color:var(--crab)}
  .subtile.fish:hover{border-color:var(--fish)}
  .subtile .ic{font-size:3rem;line-height:1}
  .subtile h2{font-family:'Plus Jakarta Sans';margin:12px 0 6px;color:#fff;font-size:1.5rem}
  .subtile p{margin:0;color:var(--muted);font-size:.95rem}
  .subtile .cnt{display:inline-block;margin-top:12px;font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
  footer{margin-top:40px;padding:30px 20px;text-align:center;color:var(--muted);font-size:.82rem;border-top:1px solid var(--line)}`;

const HEAD = (title, desc, canon) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://pulserevops.com${canon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>${CSS}</style>
</head>`;

function spotPage(d, all) {
  const spots = d.spots.map((s, i) => `
    <div class="spotcard"><div class="rank">${i + 1}</div><div><b>${s.name}</b> — ${s.note}
      <div class="chips">${s.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div></div></div>`).join('');
  const qa = d.qa.map(q => `<div class="qa"><h3>${q.q}</h3><p>${q.a}</p></div>`).join('\n');
  // FAQ structured data (Google FAQ rich-result eligible) built from this spot's Q&A.
  const faqLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: d.qa.map(q => ({ '@type': 'Question', name: q.q.replace(/<[^>]+>/g, ''), acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') } }))
  });
  const primary = d.cat === 'crab' ? 'crab' : 'fish';
  // hero image (Pollinations) — adds visual + indexable media; seed varies per spot.
  let seed = 0; for (let ci = 0; ci < d.slug.length; ci++) seed = (seed * 31 + d.slug.charCodeAt(ci)) % 100000;
  const imgPrompt = d.cat === 'crab'
    ? 'a bushel basket of blue crabs and a baited crab trotline over calm water, Chesapeake Bay, golden morning light, photorealistic, no text'
    : 'an angler holding a striped bass rockfish on a boat near bridge pilings, Chesapeake Bay, morning light, photorealistic, no text';
  const heroImg = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(imgPrompt) + '?width=1100&height=420&nologo=true&seed=' + seed;
  // nearby-spot cross-links (internal linking for SEO + browsing).
  const near = (all || []).filter(s => s.cat === d.cat && s.slug !== d.slug && s.center)
    .map(s => ({ s, dx: Math.abs(s.center[0] - d.center[0]) + Math.abs(s.center[1] - d.center[1]) }))
    .sort((a, b) => a.dx - b.dx).slice(0, 6).map(x => x.s);
  const nearLinks = near.length ? `
    <h2 class="sec">Nearby ${d.cat === 'crab' ? 'crabbing' : 'fishing'} spots</h2>
    <div class="hubgrid">${near.map(s => `<a class="hubcard" href="/fish-and-crabs/${s.slug}"><div class="body"><span class="tag">${s.region}</span><h3>${s.hubTitle}</h3></div></a>`).join('')}</div>` : '';
  return `${HEAD(d.title + ' · PULSE', d.desc, '/fish-and-crabs/' + d.slug)}
  <script type="application/ld+json">${faqLd}</script>
<body>
  <div class="topbar"><a class="brand" href="/fish-and-crabs">🦀 PULSE · Fish &amp; Crabs</a><a href="/fish-and-crabs">← All hot-spot maps</a></div>
  <div class="wrap">
    <div class="eyebrow">Fish &amp; Crabs · ${d.cat === 'crab' ? '🦀 Crabbing' : '🎣 Fishing'} Hot Spot</div>
    <h1>${d.title}</h1>
    <p class="dek">${d.dek}</p>

    <!-- HEAT MAP — hero, up top -->
    <div class="mapcard">
      <div class="maphead"><h2>🗺️ Density map</h2>
        <div class="toggles">
          <button type="button" class="tg crab ${d.cat === 'crab' ? 'on' : ''}" id="tg-crab">🦀 Crab</button>
          <button type="button" class="tg fish ${d.cat === 'crab' ? '' : 'on'}" id="tg-fish">🎣 Fish</button>
          <button type="button" class="tg loc" id="tg-loc">📍 My location</button>
          <button type="button" class="tg fs" id="tg-fs" title="Fullscreen">⛶ Fullscreen</button>
        </div></div>
      <div class="timebar"><span class="lbl">🕑 Time of day</span>
        <div class="times" id="times">
          <button type="button" class="tm" data-t="dawn">Dawn</button>
          <button type="button" class="tm on" data-t="morning">Morning</button>
          <button type="button" class="tm" data-t="midday">Midday</button>
          <button type="button" class="tm" data-t="dusk">Dusk</button>
          <button type="button" class="tm" data-t="night">Night</button>
        </div><span class="nowbite" id="nowbite"></span></div>
      <div id="map"></div>
      <div class="heatleg">
        <span class="lab">Few</span><span class="bar"></span><span class="lab">Lots</span>
        <span class="pin"><span class="dot" style="background:#ffd740"></span> Public access</span>
      </div>
      <div class="maphint" id="maphint">👆 <b>Tap the map to go fullscreen</b>, then scroll/pinch to zoom in close — switch to 🛰️ Satellite to see real coves, piers &amp; structure. Density is illustrative of typical patterns from public reports &amp; seasons — not exact GPS marks. Pins are public ramps &amp; piers. Confirm current regulations &amp; access before you go.</div>
    </div>

    <!-- SEASONAL DIALOGUE CARD — "around this time of year, they're usually around here" -->
    <div class="dialogue">
      <div class="av">${d.cat === 'crab' ? '🦀' : '🎣'}</div>
      <div>
        <div class="when" id="dlg-when">This season</div>
        <p class="text" id="dlg-text"></p>
        <div class="sig">— where they're usually holding right about now</div>
      </div>
    </div>

    <figure style="margin:18px 0;border-radius:14px;overflow:hidden;border:1px solid var(--line)"><img loading="lazy" src="${heroImg}" alt="${d.cat === 'crab' ? 'Blue crabbing' : 'Fishing'} — ${d.title}" style="display:block;width:100%;height:auto;background:#16202a"></figure>
    <div class="meta">Published Jun 28, 2026 · Updated Jun 28, 2026 · Public-access &amp; seasonal data</div>
    <div class="quick"><b>Quick answer:</b> ${d.quick}</div>

    <h2 class="sec">Top public hot spots</h2>
    ${spots}

    <h2 class="sec">Frequently asked questions</h2>
    ${qa}
    ${nearLinks}

    <div class="disc">⚠️ Public-access &amp; seasonal-pattern guide. Density is illustrative, not surveyed GPS marks. Fishing &amp; crabbing regulations (size, season, gear, licensing) change every year and are enforced — always verify current Maryland DNR rules and access boundaries before you go.</div>
  </div>
  <footer>© 2027 Kory White · PULSE · <a href="/fish-and-crabs">Fish &amp; Crabs hot-spot maps</a> · <a href="/">pulserevops.com</a></footer>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var DATA = ${JSON.stringify({ center: d.center, zoom: d.zoom, fish: d.fish, crab: d.crab, access: d.access, bite: d.bite, seasons: d.seasons, primary: primary })};
    var MAXZ = 21; // ultra-close zoom (overzoomed past native tiles so you can get right down onto a cove/pier)
    var map = L.map('map',{scrollWheelZoom:false, maxZoom:MAXZ, minZoom:6, doubleClickZoom:true, zoomDelta:0.5, zoomSnap:0.5, wheelPxPerZoomLevel:80}).setView(DATA.center, DATA.zoom);
    // Base layers: dark (default), light, and SATELLITE — satellite stays sharp when you
    // zoom ultra-close so you can read the actual shoreline, coves, piers & structure.
    var darkL = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OSM &copy; CARTO',maxZoom:MAXZ,maxNativeZoom:20});
    var lightL= L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OSM &copy; CARTO',maxZoom:MAXZ,maxNativeZoom:20});
    var streetL=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap',maxZoom:MAXZ,maxNativeZoom:19});
    // SATELLITE = Esri World Imagery + a labels overlay (towns/roads/waters) so you can
    // read exactly which cove, point, or pier you're looking at when you zoom right in.
    var esriImg=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Imagery &copy; Esri, Maxar, Earthstar Geographics',maxZoom:MAXZ,maxNativeZoom:19});
    var esriLbl=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{attribution:'Labels &copy; Esri',maxZoom:MAXZ,maxNativeZoom:19,opacity:0.9});
    var satL  = L.layerGroup([esriImg, esriLbl]);
    darkL.addTo(map);
    L.control.layers({'🌑 Dark':darkL,'☀️ Light':lightL,'🗺️ Streets':streetL,'🛰️ Satellite':satL},null,{position:'topright',collapsed:true}).addTo(map);
    L.control.scale({imperial:true,metric:false,position:'bottomleft'}).addTo(map);

    // GEO-ANCHORED density "heat" — each density point is a small stack of translucent
    // circles sized in REAL METERS (not screen pixels). Because they're true geographic
    // circles they stay pinned to their exact water coordinate: they NEVER drift when you
    // zoom (they scale with the map and pan off-screen like real geography) and they don't
    // smear across the shoreline the way the old pixel-blur heat layer did. Color = how many
    // fish/crabs are holding there right now: green (okay) → yellow → orange → red (dense).
    function colorFor(v){ return v>=0.8?'#e74c3c': v>=0.6?'#e67e22': v>=0.45?'#f1c40f':'#2ecc71'; }
    function metersFor(v){ return 110 + v*260; }            // denser = bigger + redder
    function addBlob(group, p){
      var col=colorFor(p[2]), r=metersFor(p[2]), base={stroke:false, fillColor:col, interactive:false};
      L.circle([p[0],p[1]], Object.assign({radius:r*1.7, fillOpacity:0.12}, base)).addTo(group);
      L.circle([p[0],p[1]], Object.assign({radius:r,     fillOpacity:0.24}, base)).addTo(group);
      L.circle([p[0],p[1]], Object.assign({radius:r*0.5, fillOpacity:0.34}, base)).addTo(group);
    }
    // Real-time: the map opens on the visitor's CURRENT time-of-day bucket.
    function timeBucket(){ var h=new Date().getHours(); return h<7?'dawn': h<11?'morning': h<16?'midday': h<20?'dusk':'night'; }
    var crabOn=${d.cat === 'crab' ? 'true' : 'false'}, fishOn=${d.cat === 'crab' ? 'false' : 'true'}, curT=timeBucket();
    var densityLayer=null;
    function render(){
      if(densityLayer){ map.removeLayer(densityLayer); densityLayer=null; }
      densityLayer=L.layerGroup();
      if(crabOn && DATA.crab[curT]) DATA.crab[curT].forEach(function(p){ addBlob(densityLayer,p); });
      if(fishOn && DATA.fish[curT]) DATA.fish[curT].forEach(function(p){ addBlob(densityLayer,p); });
      densityLayer.addTo(map);
      document.getElementById('nowbite').innerHTML = DATA.bite[curT] || '';
    }
    // Blobs are geo-anchored (meters) so there is nothing to rescale on zoom — they stay put.
    // Auto-shift through the day: every minute, if the real clock has crossed into a new
    // time-of-day bucket, re-pick it and redraw so the density moves on its own (no reload).
    setInterval(function(){ var t=timeBucket(); if(t!==curT){ curT=t;
      Array.prototype.forEach.call(document.querySelectorAll('#times .tm'),function(x){ x.classList.toggle('on', x.getAttribute('data-t')===curT); });
      render(); } }, 60000);

    // RECENTER control — reset to the spot's framing after you've zoomed/panned around.
    var Recenter = L.Control.extend({options:{position:'topleft'},onAdd:function(){
      var b=L.DomUtil.create('a','leaflet-bar leaflet-control'); b.href='#'; b.title='Reset view'; b.innerHTML='⟲';
      b.style.cssText='width:30px;height:30px;line-height:30px;text-align:center;font-size:17px;display:block';
      L.DomEvent.disableClickPropagation(b);
      L.DomEvent.on(b,'click',function(e){ L.DomEvent.stop(e); map.setView(DATA.center, DATA.zoom); });
      return b; }});
    map.addControl(new Recenter());

    // FLY-TO-HOTTEST — jump straight to the densest active zone for the current time/species.
    var Hot = L.Control.extend({options:{position:'topleft'},onAdd:function(){
      var b=L.DomUtil.create('a','leaflet-bar leaflet-control'); b.href='#'; b.title='Jump to the densest active zone'; b.innerHTML='🎯';
      b.style.cssText='width:30px;height:30px;line-height:30px;text-align:center;font-size:15px;display:block';
      L.DomEvent.disableClickPropagation(b);
      L.DomEvent.on(b,'click',function(e){ L.DomEvent.stop(e);
        var pts=(fishOn?(DATA.fish[curT]||[]):[]).concat(crabOn?(DATA.crab[curT]||[]):[]);
        var best=null,bv=-1; pts.forEach(function(p){if(p[2]>bv){bv=p[2];best=p;}});
        if(best) map.setView([best[0],best[1]], Math.max(map.getZoom(),15), {animate:true}); });
      return b; }});
    map.addControl(new Hot());

    // FULLSCREEN — the ⛶ button AND tapping the map both expand it; scroll-wheel zoom
    // turns on in fullscreen so you can dive right in, and off again when you exit.
    var mapCard=document.querySelector('.mapcard');
    var fsBtn=document.getElementById('tg-fs');
    function isFs(){ return !!(document.fullscreenElement||document.webkitFullscreenElement); }
    function enterFs(){ if(isFs())return; var fn=mapCard.requestFullscreen||mapCard.webkitRequestFullscreen; if(fn) fn.call(mapCard); }
    function exitFs(){ var fn=document.exitFullscreen||document.webkitExitFullscreen; if(fn) fn.call(document); }
    fsBtn.onclick=function(e){ if(e&&e.stopPropagation)e.stopPropagation(); if(isFs())exitFs(); else enterFs(); };
    // tap the water/map to open fullscreen (drag still pans; pin clicks still pop up)
    map.on('click', function(){ if(!isFs()) enterFs(); });
    // floating "tap to expand" hint over the map
    var tip=document.createElement('div'); tip.className='maptip'; tip.innerHTML='👆 Tap to go fullscreen &amp; zoom in close';
    document.getElementById('map').appendChild(tip);
    function onFs(){ var on=isFs(); fsBtn.classList.toggle('on',on); fsBtn.innerHTML=on?'⛶ Exit':'⛶ Fullscreen';
      if(on){ map.scrollWheelZoom.enable(); } else { map.scrollWheelZoom.disable(); }
      if(tip) tip.style.opacity = on?'0':'1';
      setTimeout(function(){ map.invalidateSize(); },180); }
    document.addEventListener('fullscreenchange',onFs); document.addEventListener('webkitfullscreenchange',onFs);

    DATA.access.forEach(function(a){ L.circleMarker([a[1],a[2]],{radius:6,color:'#0e1418',weight:2,fillColor:'#ffd740',fillOpacity:.95}).addTo(map).bindPopup('<b>'+a[0]+'</b><br>Public access'); });
    document.getElementById('tg-crab').onclick=function(e){if(e&&e.stopPropagation)e.stopPropagation();this.classList.toggle('on');crabOn=this.classList.contains('on');render();};
    document.getElementById('tg-fish').onclick=function(e){if(e&&e.stopPropagation)e.stopPropagation();this.classList.toggle('on');fishOn=this.classList.contains('on');render();};
    Array.prototype.forEach.call(document.querySelectorAll('#times .tm'),function(b){b.onclick=function(){Array.prototype.forEach.call(document.querySelectorAll('#times .tm'),function(x){x.classList.remove('on');});this.classList.add('on');curT=this.getAttribute('data-t');render();};});
    // highlight the current-time button on load
    Array.prototype.forEach.call(document.querySelectorAll('#times .tm'),function(x){ x.classList.toggle('on', x.getAttribute('data-t')===curT); });
    render();

    // GEOLOCATION — show the user relative to the hot spots + distance to the densest point.
    var youMarker=null;
    function haversineMi(a,b){var R=3958.8,dLat=(b[0]-a[0])*Math.PI/180,dLng=(b[1]-a[1])*Math.PI/180,la1=a[0]*Math.PI/180,la2=b[0]*Math.PI/180;var h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.sin(dLng/2)*Math.sin(dLng/2)*Math.cos(la1)*Math.cos(la2);return R*2*Math.asin(Math.sqrt(h));}
    function requestLocation(){
      var btn=document.getElementById('tg-loc');
      if(!navigator.geolocation){ document.getElementById('maphint').innerHTML='Location isn\\'t available in this browser.'; return; }
      btn.textContent='📍 Locating…';
      navigator.geolocation.getCurrentPosition(function(pos){
        var you=[pos.coords.latitude,pos.coords.longitude];
        if(youMarker) map.removeLayer(youMarker);
        youMarker=L.marker(you).addTo(map).bindPopup('<b>You are here</b>').openPopup();
        // densest active point
        var pts=(fishOn?(DATA.fish[curT]||[]):[]).concat(crabOn?(DATA.crab[curT]||[]):[]);
        var best=null,bv=-1; pts.forEach(function(p){if(p[2]>bv){bv=p[2];best=p;}});
        if(best){ var mi=haversineMi(you,[best[0],best[1]]); document.getElementById('maphint').innerHTML='📍 You\\'re about <b>'+mi.toFixed(1)+' miles</b> from the hottest zone right now. Pan/zoom to see your position relative to the density.'; map.fitBounds(L.latLngBounds([you,[best[0],best[1]]]).pad(0.4)); }
        else { map.setView(you, DATA.zoom); }
        btn.textContent='📍 My location'; btn.classList.add('on');
      }, function(){ document.getElementById('maphint').innerHTML='Couldn\\'t get your location (permission denied or unavailable).'; btn.textContent='📍 My location'; });
    }
    document.getElementById('tg-loc').onclick=function(){ requestLocation(); };

    // LOCATION POP-UP — on the map screen we ASK (the visitor must tap) before using their
    // location, so we can show how far they are from the hot spots. The browser's native
    // permission prompt only fires after they tap "Use my location" (a real user gesture).
    (function(){
      var ov=document.createElement('div'); ov.className='locask';
      ov.innerHTML='<div class="locask-card"><div class="locask-t">📍 Use your location?</div>'+
        '<div class="locask-d">See exactly how far you are from today\\'s '+(crabOn?'crabbing':'fishing')+' hot spots.</div>'+
        '<div class="locask-b"><button type="button" id="locask-yes">Use my location</button>'+
        '<button type="button" id="locask-no" class="ghost">Not now</button></div></div>';
      document.getElementById('map').appendChild(ov);
      ov.addEventListener('click', function(e){ e.stopPropagation(); }); // don't bubble to map (would open fullscreen)
      ov.querySelector('#locask-yes').onclick=function(e){ e.stopPropagation(); ov.style.display='none'; requestLocation(); };
      ov.querySelector('#locask-no').onclick=function(e){ e.stopPropagation(); ov.style.display='none'; };
    })();

    // SEASONAL DIALOGUE — "around this time of year…" driven by the real current month.
    (function(){
      var SEAS=DATA.seasons||{}, mo=new Date().getMonth();
      var key=(mo>=2&&mo<=4)?'spring':(mo>=5&&mo<=7)?'summer':(mo>=8&&mo<=10)?'fall':'winter';
      var MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
      var LB={spring:'Spring',summer:'Summer',fall:'Fall',winter:'Winter'};
      var w=document.getElementById('dlg-when'); if(w) w.textContent=MN[mo]+' · '+LB[key];
      var t=document.getElementById('dlg-text'); if(t) t.innerHTML=SEAS[key]||SEAS.summer||SEAS.spring||'';
    })();
  </script>
</body></html>`;
}

// HUB — two big subcategory choices: 🦀 Crabs and 🎣 Fish.
function hubPage(spots) {
  const nCrab = spots.filter(s => s.cat === 'crab').length;
  const nFish = spots.filter(s => s.cat === 'fish').length;
  return `${HEAD('Fish &amp; Crabs — Fishing &amp; Crabbing Hot-Spot Heat Maps in 2027 · PULSE', 'Interactive hot-spot density heat maps for fishing and crabbing — by time of day, with public access, gear, and the rules. Pick crabs or fish.', '/fish-and-crabs')}
<body>
  <div class="topbar"><a class="brand" href="/">🦀 PULSE · Fish &amp; Crabs</a><a href="/">← PULSE home</a></div>
  <div class="wrap">
    <div class="eyebrow">Living · Fish &amp; Crabs</div>
    <h1>Fishing &amp; Crabbing Hot-Spot Maps</h1>
    <p class="dek">Where the fish and crabs actually are — interactive <b>density maps</b> (red = dense, green = few) that shift by time of day, with public access, gear, and the rules. Pick what you're after:</p>
    <div class="subtiles">
      <a class="subtile crab" href="/fish-and-crabs/crab"><div class="ic">🦀</div><h2>Crabs</h2><p>Blue-crab hot spots — where they stack by season &amp; time of day.</p><span class="cnt">${nCrab} spot${nCrab===1?'':'s'} →</span></a>
      <a class="subtile fish" href="/fish-and-crabs/fish"><div class="ic">🎣</div><h2>Fish</h2><p>Rockfish, striped bass &amp; more — best spots by time of day.</p><span class="cnt">${nFish} spot${nFish===1?'':'s'} →</span></a>
    </div>
    <div class="disc">⚠️ These maps show illustrative seasonal/time density and real public-access points. Always verify current state DNR fishing &amp; crabbing regulations and access boundaries before heading out.</div>
  </div>
  <footer>© 2027 Kory White · PULSE · <a href="/">pulserevops.com</a></footer>
</body></html>`;
}

// SUBCATEGORY PAGE — /fish-and-crabs/crab or /fish-and-crabs/fish: lists the spots
// of that category (cards → the map pages) then brings up ALL their Q&As.
function subcatPage(cat, spots) {
  const mine = spots.filter(s => s.cat === cat);
  const ic = cat === 'crab' ? '🦀' : '🎣';
  const label = cat === 'crab' ? 'Crabbing' : 'Fishing';
  const groups = {};
  for (const d of mine) { (groups[d.region] = groups[d.region] || []).push(d); }
  const groupHtml = Object.keys(groups).sort().map(reg => `
    <h2 class="sec" style="font-size:1.2rem">${reg}</h2>
    <div class="hubgrid">${groups[reg].map(d => `<a class="hubcard" href="/fish-and-crabs/${d.slug}"><div class="body"><span class="tag">${d.region}</span><h3>${d.hubTitle}</h3><p>${d.hubBlurb}</p></div></a>`).join('')}</div>`).join('\n');
  return `${HEAD(`${label} Hot Spots — ${ic} Best ${cat === 'crab' ? 'Blue Crabbing' : 'Fishing'} Maps in 2027 · PULSE`, `${mine.length} ${label.toLowerCase()} hot-spot density maps across the Chesapeake Bay & surrounding waters — where to ${cat === 'crab' ? 'crab' : 'fish'} by time of day, with public access and the rules.`, '/fish-and-crabs/' + cat)}
<body>
  <div class="topbar"><a class="brand" href="/fish-and-crabs">${ic} PULSE · Fish &amp; Crabs</a><a href="/fish-and-crabs">← Crabs or Fish</a></div>
  <div class="wrap">
    <div class="eyebrow">Fish &amp; Crabs · ${ic} ${label}</div>
    <h1>${label} Hot Spots</h1>
    <p class="dek"><b>${mine.length}</b> ${label.toLowerCase()} spots across the Chesapeake Bay &amp; surrounding waters — each with its own interactive time-of-day density map, public access, and Q&amp;A. Tap any spot for its map.</p>
    ${groupHtml}
    <div class="disc">⚠️ Illustrative seasonal/time density + public access. Verify current state DNR/Marine Resources rules and access before you go.</div>
  </div>
  <footer>© 2027 Kory White · PULSE · <a href="/fish-and-crabs">Fish &amp; Crabs</a> · <a href="/">pulserevops.com</a></footer>
</body></html>`;
}

// ── DATA: Chesapeake + surrounding waters. Honest illustrative density + public access.
function load(f) { try { return require(f); } catch (e) { return []; } }
const RAW = [].concat(load('./_fc_data.js'), load('./_fc_crab10.js'), load('./_fc_crab100.js'), load('./_fc_landmarks.js'));
const seen = new Set(); const SPOTS = [];
for (const d of RAW) { if (!d || !d.slug || seen.has(d.slug)) continue; seen.add(d.slug); SPOTS.push(d); }
SPOTS.forEach(d => { fs.writeFileSync(DIR + '/' + d.slug + '.html', spotPage(d, SPOTS)); });
fs.writeFileSync(DIR + '/crab.html', subcatPage('crab', SPOTS));
fs.writeFileSync(DIR + '/fish.html', subcatPage('fish', SPOTS));
fs.writeFileSync(DIR + '/index.html', hubPage(SPOTS));
// dedicated SEO sitemap for the whole pillar
const urls = ['', '/crab', '/fish'].concat(SPOTS.map(d => '/' + d.slug));
const sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url><loc>https://pulserevops.com/fish-and-crabs' + u + '</loc><lastmod>2026-06-28</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>').join('\n') +
  '\n</urlset>\n';
fs.writeFileSync('C:/Users/koryj/website/sitemap-fish-crabs.xml', sm);
const nc = SPOTS.filter(s => s.cat === 'crab').length, nf = SPOTS.filter(s => s.cat === 'fish').length;
console.log('generated', SPOTS.length, 'spots (' + nc + ' crab, ' + nf + ' fish) + crab/fish/hub + sitemap-fish-crabs.xml');
