'use strict';
const fs = require('fs');

// --- pulse-squares.js: never wipe a row to 1 card — allow topic-cover reuse inside a pillar row ---
{
  const p = 'C:/Users/koryj/website/js/pulse-squares.js';
  let t = fs.readFileSync(p, 'utf8');

  // claimImg: if all candidates used, still return primary (allow dupes when opts.allowImageDupes)
  // Better: change uniqueOnScreen / paintRow
  t = t.replace(
    /function uniqueOnScreen\(entries, used\) \{[\s\S]*?\n  \}/,
    `function uniqueOnScreen(entries, used, allowDupes) {
    used = used || Object.create(null);
    var out = [];
    (entries || []).forEach(function (e) {
      if (!e) return;
      var img = claimImg(e, used);
      if (!img) {
        if (!allowDupes) return;
        // Pillar rows: keep the card even if cover repeats — otherwise whole row collapses to 1 square
        img = rawImg(e) || topicOf(e.id);
      }
      var copy = {};
      for (var k in e) if (Object.prototype.hasOwnProperty.call(e, k)) copy[k] = e[k];
      copy.img = img;
      out.push(copy);
    });
    return out;
  }`
  );

  t = t.replace(
    /list = uniqueOnScreen\(list, used\);/,
    'list = uniqueOnScreen(list, used, opts.allowImageDupes !== false);'
  );
  // Default for paintRow: allow dupes (topic rows need it). Recent can pass allowImageDupes:false if wanted.
  // Actually Recent also suffered — allow by default true for paintRow.
  // paintGrid: keep strict? leave as uniqueOnScreen(list, Object.create(null)) - update call
  t = t.replace(
    /list = uniqueOnScreen\(list, Object\.create\(null\)\);/,
    'list = uniqueOnScreen(list, Object.create(null), opts.allowImageDupes);'
  );

  fs.writeFileSync(p, t);
  console.log('js uniqueOnScreen allowDupes', t.includes('allowDupes'));
}

// --- index.html: full ROWS, CRO fix, SEARCH inside card, deadspace ---
{
  const p = 'C:/Users/koryj/website/index.html';
  let t = fs.readFileSync(p, 'utf8');

  const ROWS = [
    // Revenue & Leadership (gold) — every topic stays its own row
    { group: 'Revenue & Leadership', title: 'GTM Playbooks', pillar: 'gp', href: '/go-to-market-playbooks' },
    { group: 'Revenue & Leadership', title: 'Industry KPIs', pillar: 'ik', href: '/industry-kpis' },
    { group: 'Revenue & Leadership', title: 'Revenue Architecture', pillar: 'ra', href: '/revenue-architecture' },
    { group: 'Revenue & Leadership', title: 'Sales Trainings', pillar: 'st', href: '/sales-trainings' },
    { group: 'Revenue & Leadership', title: 'Book Summaries', pillar: 'bs', href: '/sales-book-summaries' },
    { group: 'Revenue & Leadership', title: 'CRO Coaching', pillar: 'cg', href: '/coaching' },
    { group: 'Revenue & Leadership', title: 'Knowledge', pillar: 'q', href: '/knowledge' },
    { group: 'Revenue & Leadership', title: 'Skills', pillar: 'sk', href: '/skills' },
    { group: 'Revenue & Leadership', title: 'Speeches', pillar: 'sp', href: '/speeches' },
    { group: 'Revenue & Leadership', title: 'Contracts', pillar: 'cd', href: '/contracts' },
    // Technology
    { group: 'Technology', title: 'Tech Stacks', pillar: 'tk', href: '/tech-stacks' },
    { group: 'Technology', title: 'Pulse Tools', pillar: 'tl', href: '/tools' },
    { group: 'Technology', title: 'Software', pillar: 'sw', href: '/software' },
    { group: 'Technology', title: 'AI Infrastructure', pillar: 'ai', href: '/ai-infrastructure' },
    { group: 'Technology', title: 'Electronics', pillar: 'er', href: '/electronic-reviews' },
    { group: 'Technology', title: 'Telco', pillar: 'tc', href: '/telco' },
    // Business & Property
    { group: 'Business & Property', title: 'Franchises', pillar: 'fr', href: '/franchises' },
    { group: 'Business & Property', title: 'Estates', pillar: 'es', href: '/estates' },
    { group: 'Business & Property', title: 'Buildouts', pillar: 'bo', href: '/buildouts' },
    // Cars & Boats
    { group: 'Cars & Boats', title: 'Cars', pillar: 'ca', href: '/cars' },
    { group: 'Cars & Boats', title: 'Boats', pillar: 'bt', href: '/boats' },
    // Places
    { group: 'Places', title: 'Travel', pillar: 'tv', href: '/travel' },
    { group: 'Places', title: 'Resorts', pillar: 'rs', href: '/resorts' },
    { group: 'Places', title: 'Towns', pillar: 'tn', href: '/towns' },
    { group: 'Places', title: 'Schools', pillar: 'sc', href: '/schools' },
    // Style & Culture
    { group: 'Style & Culture', title: 'Graphics', pillar: 'gb', href: '/graphics' },
    { group: 'Style & Culture', title: 'Style', pillar: 'sy', href: '/style' },
    { group: 'Style & Culture', title: 'Collectibles', pillar: 'co', href: '/collectibles' },
    // Out & About
    { group: 'Out & About', title: 'Dining', pillar: 'dn', href: '/dining' },
    { group: 'Out & About', title: 'Clubs', pillar: 'cl', href: '/clubs' },
    { group: 'Out & About', title: 'Nightlife', pillar: 'nl', href: '/nightlife' },
    { group: 'Out & About', title: 'Events', pillar: 'ev', href: '/events' },
    { group: 'Out & About', title: 'Gatherings', pillar: 'ga', href: '/gatherings' },
    { group: 'Out & About', title: 'Living', pillar: 'lv', href: '/living' },
    // Play & Pets (fun last) — include fishing + crabbing
    { group: 'Play & Pets', title: 'HS Football', pillar: 'hf', href: '/highschool-football-recruiting' },
    { group: 'Play & Pets', title: 'Drills', pillar: 'dr', href: '/drills' },
    { group: 'Play & Pets', title: 'Gaming', pillar: 'gm', href: '/gaming' },
    { group: 'Play & Pets', title: 'Movies', pillar: 'mv', href: '/movies' },
    { group: 'Play & Pets', title: 'Wellness', pillar: 'wl', href: '/wellness' },
    { group: 'Play & Pets', title: 'Aquariums', pillar: 'aq', href: '/aquariums' },
    { group: 'Play & Pets', title: 'Fishing', pillar: 'fs', href: '/fish-and-crabs' },
    { group: 'Play & Pets', title: 'Crabbing', pillar: 'cr', href: '/fish-and-crabs' },
    { group: 'Play & Pets', title: 'Pets', pillar: 'pt', href: '/pets' }
  ];

  const GROUP_COLOR = {
    'Revenue & Leadership': '#EAC15C',
    'Technology': '#A78BDB',
    'Business & Property': '#C8A878',
    'Cars & Boats': '#5AA8D4',
    'Places': '#4AB8A8',
    'Style & Culture': '#C090D0',
    'Out & About': '#E090A8',
    'Play & Pets': '#6BC88A'
  };

  const rowsJs = 'var ROWS=[\n' + ROWS.map((r) =>
    `      {group:'${r.group}',title:'${r.title}',pillar:'${r.pillar}',href:'${r.href}'}`
  ).join(',\n') + '\n    ];';

  t = t.replace(/var ROWS=\[[\s\S]*?\];/, rowsJs);
  t = t.replace(/var GROUP_COLOR=\{[^}]+\};/, 'var GROUP_COLOR=' + JSON.stringify(GROUP_COLOR) + ';');
  // Ensure forEach gold line exists
  if (!t.includes("r.group==='Revenue & Leadership'")) {
    t = t.replace(
      /var GROUP_COLOR=[^;]+;/,
      (m) => m + `\n    ROWS.forEach(function(r){if(r.group&&GROUP_COLOR[r.group])r.groupColor=GROUP_COLOR[r.group];if(r.group==='Revenue & Leadership')r.color='#EAC15C';});`
    );
  }

  // paintRow: allowImageDupes true explicitly
  t = t.replace(
    /usedImages:Object\.create\(null\), \/\/ unique images within this row only/,
    "usedImages:Object.create(null),\n        allowImageDupes:true, // keep full pillar rows even if covers repeat"
  );

  // Load ALL rows aggressively — no early stop
  t = t.replace(
    /if\(!force && !nearBottom\(\) && i>2\)return;/,
    'if(!force && !nearBottom() && i>20)return;'
  );
  t = t.replace(
    /if\(i<14 \|\| nearBottom\(\) \|\| !ok \|\| !ents \|\| !ents\.length\) setTimeout\(function\(\)\{ loadNext\(true\); \}, 20\);/,
    'setTimeout(function(){ loadNext(true); }, 15);'
  );

  // --- Fix entire CRO header block: full-bleed + SEARCH inside trim ---
  const croBlock = `  <!-- CRO CARD HEADER — full-bleed L→R; SEARCH inside gold trim (owner 2026-07-11) -->
  <style>
  .crohdr{position:relative;width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px;margin-bottom:8px;padding:0;box-sizing:border-box}
  .cro-card{position:relative;display:flex;align-items:stretch;text-decoration:none;border:4px solid #EAC15C;border-radius:0;justify-content:center;overflow:hidden;min-height:320px;width:100%;background:linear-gradient(100deg,#180a10,#0f0a0c 60%);box-shadow:inset 0 0 0 2px rgba(8,6,4,.92),inset 0 0 0 4px rgba(234,193,92,.6),inset 0 0 40px rgba(234,193,92,.05),0 8px 32px rgba(0,0,0,.55)}
  .cro-card__img{flex:0 0 auto;width:270px;height:270px;align-self:center;margin:20px 12px 20px 30px;border-radius:50%;background-size:cover;background-position:center;filter:brightness(1.1);border:2px solid rgba(234,193,92,.5);box-shadow:0 4px 18px rgba(0,0,0,.4)}
  .cro-card__body{flex:0 1 auto;max-width:640px;padding:22px 30px 22px 18px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;text-align:left;gap:7px}
  .cro-card__eyebrow{font:800 .6rem/1.3 system-ui;letter-spacing:.13em;color:#FFB81C!important}
  .cro-card__title{margin:0;font-family:Georgia,serif;font-weight:800;font-size:clamp(2.1rem,4.4vw,3.3rem);line-height:1.03;color:#F6C445!important;text-shadow:0 1px 6px rgba(0,0,0,.5)}
  .cro-card__role{margin:0;color:#EAC15C!important;font-weight:700;font-size:.9rem}
  .cro-card__sub{margin:2px 0 0;color:#b9b1a6;font-size:.88rem;max-width:52ch}
  .cro-card__cta{background:linear-gradient(180deg,#EAC15C,#cf9f2e);color:#1a0a00;font-weight:900;font-size:.95rem;padding:11px 20px;border-radius:10px;white-space:nowrap}
  .cro-card:hover{border-color:#EAC15C}
  /* SEARCH sits INSIDE the gold frame, bottom-left corner */
  #pulseSearchSq{position:absolute;left:14px;bottom:14px;z-index:6;width:64px;height:64px;display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;background:#130a10;color:#F6C445;font:800 .68rem/1.05 Georgia,serif;letter-spacing:.1em;border:3px solid #EAC15C;border-radius:0;box-shadow:inset 0 0 0 2px rgba(8,6,4,.92),inset 0 0 0 4px rgba(234,193,92,.55),0 4px 14px rgba(0,0,0,.4);transition:border-color .15s,color .15s,transform .15s}
  #pulseSearchSq:hover,#pulseSearchSq:focus{border-color:#F6C445;color:#fff;transform:translateY(-1px);outline:none}
  .cro-bar{display:grid;grid-template-columns:repeat(6,1fr);margin:-2px 0 0;border:1px solid rgba(234,193,92,.4);border-top:none;border-radius:0;overflow:hidden;width:100%;box-sizing:border-box}
  .cro-bar a{text-align:center;padding:14px 8px;color:#EAC15C;font-weight:800;font-size:1.05rem;text-decoration:none;background:#130a10;border-right:1px solid rgba(234,193,92,.22)}
  .cro-bar a:last-child{border-right:none}
  .cro-bar a:hover{background:#1d1017;color:#fff}
  @media(max-width:640px){
    .crohdr{margin-top:8px}
    .cro-card{flex-direction:column;height:auto;min-height:0;overflow:visible;padding-bottom:72px}
    .cro-card__body{padding:6px 18px 20px}
    .cro-card__img{flex:none;width:210px;height:210px;min-height:210px;border-radius:50%;margin:18px auto 6px;border:2px solid rgba(234,193,92,.5);background-size:cover;background-position:center}
    .cro-bar{grid-template-columns:repeat(2,1fr)}
    .cro-bar a{padding:9px 6px;font-size:.92rem;line-height:1.15}
    .cro-bar a:nth-child(2){border-right:none}
    #pulseSearchSq{left:12px;bottom:12px;width:56px;height:56px;font-size:.6rem}
  }
  </style>
  <div class="crohdr">
    <a class="cro-card" href="/revenue-checkup" target="_blank" rel="noopener" data-pulse-click="hire-cro" aria-label="Get a free 30-minute revenue checkup with Kory White, Fractional CRO">
      <div class="cro-card__img" style="background-image:url('/assets/kory-white.jpg')"></div>
      <div class="cro-card__body">
        <span class="cro-card__eyebrow">FRACTIONAL CRO · MARYLAND-BASED, NATIONWIDE · $0→$200M</span>
        <h2 class="cro-card__title">Kory White</h2>
        <p class="cro-card__role">RevOps &amp; Revenue Leadership</p>
        <p class="cro-card__sub">Get a <strong>free 30-minute revenue checkup</strong> &mdash; Kory reviews your pipeline and forecast, then names the 1&ndash;2 fixes that move revenue fastest. 25 yrs scaling teams $0&rarr;$200M.</p>
        <span class="cro-card__cta" style="display:inline-block;align-self:flex-start;margin-top:10px;white-space:normal;text-align:center;">Free 30-min revenue checkup &rarr;</span>
      </div>
      <span id="pulseSearchSq" role="link" tabindex="0" data-href="/search" aria-label="Search all Q&amp;As" title="Search">SEARCH</span>
    </a>
    <div class="cro-bar">
      <a href="/fractional-cro" data-pulse-click="fractional-cro-hub">Hire a Fractional CRO</a>
      <a href="/revenue-checkup" data-pulse-click="hire-cro">How We Help?</a>
      <a href="https://calendly.com/korywhiterevops?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget" target="_blank" rel="noopener" data-pulse-click="hire-cro">📅 Book a Call</a>
      <a href="https://www.linkedin.com/in/korywhite" target="_blank" rel="noopener" data-pulse-click="curator">LinkedIn</a>
      <a href="/assets/kory-white-cro-resume.pdf" target="_blank" rel="noopener">Résumé</a>
      <a href="https://crosyndicate.com/?utm_source=pulserevops.com&utm_medium=referral&utm_campaign=cro-widget" target="_blank" rel="noopener" data-pulse-click="cro-syndicate">CRO Syndicate</a>
    </div>
  </div>
  <script>(function(){var s=document.getElementById('pulseSearchSq');if(!s)return;function go(e){e.preventDefault();e.stopPropagation();location.href=s.getAttribute('data-href')||'/search';}s.addEventListener('click',go);s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')go(e);});})();</script>
`;

  // Replace from CRO CARD HEADER comment through end of crohdr closing
  t = t.replace(
    /<!-- CRO CARD HEADER[\s\S]*?<div class="cro-bar">[\s\S]*?<\/div><\/div>\s*\n\s*<!-- UNIFIED SQUARE ROWS/,
    croBlock + '\n  <!-- UNIFIED SQUARE ROWS'
  );

  // Tighten group label deadspace
  t = t.replace(
    /\.psq-group\{width:100vw;margin-left:calc\(50% - 50vw\);margin-right:calc\(50% - 50vw\);padding:22px clamp\(12px,4vw,40px\) 4px;box-sizing:border-box\}/,
    '.psq-group{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:14px clamp(12px,4vw,40px) 2px;box-sizing:border-box}'
  );
  t = t.replace(
    /\.crohdr\{margin-bottom:6px!important\}/,
    '.crohdr{margin-bottom:4px!important}#psqStack{margin-top:0!important}.psq-group:first-child{padding-top:10px!important}'
  );

  // Hide Recent if empty gap - keep recent but tighten
  t = t.replace(/#recentRow\.recentrow\{padding-top:8px!important\}/, '#recentRow.recentrow{padding-top:6px!important;padding-bottom:4px!important}');

  t = t.replace(/pulse-squares\.css\?v=[^"]+/, 'pulse-squares.css?v=20260711y');
  t = t.replace(/pulse-squares\.js\?v=[^"]+/, 'pulse-squares.js?v=20260711y');

  fs.writeFileSync(p, t);
  console.log({
    rows: ROWS.length,
    first: ROWS[0].pillar,
    last: ROWS[ROWS.length - 1].pillar,
    hasFs: ROWS.some((r) => r.pillar === 'fs'),
    hasCr: ROWS.some((r) => r.pillar === 'cr'),
    hasGp: ROWS.some((r) => r.pillar === 'gp'),
    croSearchInside: t.includes('data-href="/search"') && t.includes('cro-card__cta'),
    allowDupes: t.includes('allowImageDupes:true')
  });
}

console.log('done');
