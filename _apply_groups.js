'use strict';
const fs = require('fs');

const CRO_GOLD = '#EAC15C';

const TC = {
  gp: CRO_GOLD, ik: CRO_GOLD, ra: CRO_GOLD, st: CRO_GOLD,
  bs: CRO_GOLD, cg: CRO_GOLD, q: CRO_GOLD, sk: CRO_GOLD,
  sp: '#E0B84A', cd: '#E0B84A',
  tk: '#A78BDB', tl: '#A78BDB', sw: '#A78BDB', ai: '#A78BDB', er: '#A78BDB', tc: '#A78BDB',
  fr: '#C8A878', es: '#C8A878', bo: '#C8A878',
  ca: '#5AA8D4', bt: '#5AA8D4',
  tv: '#4AB8A8', rs: '#4AB8A8', tn: '#4AB8A8', sc: '#4AB8A8',
  gb: '#C090D0', sy: '#C090D0', co: '#C090D0',
  dn: '#E090A8', cl: '#E090A8',
  nl: '#1A1A1E',
  ev: '#E8E4D8', ga: '#E8E4D8', lv: '#E8E4D8',
  hf: '#6BC88A', gm: '#6BC88A', wl: '#6BC88A',
  dr: '#E07878', mv: '#E07878',
  aq: '#6BC88A', pt: '#6BC88A',
  ce: CRO_GOLD, fs: '#4AB8A8', cr: '#E07878'
};

const GROUP_COLOR = {
  'Revenue & Leadership': CRO_GOLD,
  'Technology': '#A78BDB',
  'Business & Property': '#C8A878',
  'Cars & Boats': '#5AA8D4',
  'Places': '#4AB8A8',
  'Style & Culture': '#C090D0',
  'Out & About': '#E090A8',
  'Play & Pets': '#6BC88A'
};

const ROWS = [
  { group: 'Revenue & Leadership', title: 'GTM Playbooks', pillar: 'gp', href: '/go-to-market-playbooks' },
  { group: 'Revenue & Leadership', title: 'Industry KPIs', pillar: 'ik', href: '/industry-kpis' },
  { group: 'Revenue & Leadership', title: 'Revenue Architecture', pillar: 'ra', href: '/revenue-architecture' },
  { group: 'Revenue & Leadership', title: 'Sales Trainings', pillar: 'st', href: '/sales-trainings' },
  { group: 'Revenue & Leadership', title: 'Book Summaries', pillar: 'bs', href: '/sales-book-summaries' },
  { group: 'Revenue & Leadership', title: 'CRO Coaching', pillar: 'cg', href: '/coaching' },
  { group: 'Revenue & Leadership', title: 'Knowledge', pillar: 'q', href: '/knowledge' },
  { group: 'Revenue & Leadership', title: 'Skills', pillar: 'sk', href: '/skills' },
  { group: 'Technology', title: 'Tech Stacks', pillar: 'tk', href: '/tech-stacks' },
  { group: 'Technology', title: 'Pulse Tools', pillar: 'tl', href: '/tools' },
  { group: 'Technology', title: 'Software', pillar: 'sw', href: '/software' },
  { group: 'Technology', title: 'AI Infrastructure', pillar: 'ai', href: '/ai-infrastructure' },
  { group: 'Technology', title: 'Electronics', pillar: 'er', href: '/electronic-reviews' },
  { group: 'Technology', title: 'Telco', pillar: 'tc', href: '/telco' },
  { group: 'Business & Property', title: 'Speeches', pillar: 'sp', href: '/speeches' },
  { group: 'Business & Property', title: 'Contracts', pillar: 'cd', href: '/contracts' },
  { group: 'Business & Property', title: 'Franchises', pillar: 'fr', href: '/franchises' },
  { group: 'Business & Property', title: 'Estates', pillar: 'es', href: '/estates' },
  { group: 'Business & Property', title: 'Buildouts', pillar: 'bo', href: '/buildouts' },
  { group: 'Cars & Boats', title: 'Cars', pillar: 'ca', href: '/cars' },
  { group: 'Cars & Boats', title: 'Boats', pillar: 'bt', href: '/boats' },
  { group: 'Places', title: 'Travel', pillar: 'tv', href: '/travel' },
  { group: 'Places', title: 'Resorts', pillar: 'rs', href: '/resorts' },
  { group: 'Places', title: 'Towns', pillar: 'tn', href: '/towns' },
  { group: 'Places', title: 'Schools', pillar: 'sc', href: '/schools' },
  { group: 'Style & Culture', title: 'Graphics', pillar: 'gb', href: '/graphics' },
  { group: 'Style & Culture', title: 'Style', pillar: 'sy', href: '/style' },
  { group: 'Style & Culture', title: 'Collectibles', pillar: 'co', href: '/collectibles' },
  { group: 'Out & About', title: 'Dining', pillar: 'dn', href: '/dining' },
  { group: 'Out & About', title: 'Clubs', pillar: 'cl', href: '/clubs' },
  { group: 'Out & About', title: 'Nightlife', pillar: 'nl', href: '/nightlife' },
  { group: 'Out & About', title: 'Events', pillar: 'ev', href: '/events' },
  { group: 'Out & About', title: 'Gatherings', pillar: 'ga', href: '/gatherings' },
  { group: 'Out & About', title: 'Living', pillar: 'lv', href: '/living' },
  { group: 'Play & Pets', title: 'HS Football', pillar: 'hf', href: '/highschool-football-recruiting' },
  { group: 'Play & Pets', title: 'Drills', pillar: 'dr', href: '/drills' },
  { group: 'Play & Pets', title: 'Gaming', pillar: 'gm', href: '/gaming' },
  { group: 'Play & Pets', title: 'Movies', pillar: 'mv', href: '/movies' },
  { group: 'Play & Pets', title: 'Wellness', pillar: 'wl', href: '/wellness' },
  { group: 'Play & Pets', title: 'Aquariums', pillar: 'aq', href: '/aquariums' },
  { group: 'Play & Pets', title: 'Pets', pillar: 'pt', href: '/pets' }
];

{
  const p = 'C:/Users/koryj/website/js/pulse-squares.js';
  let t = fs.readFileSync(p, 'utf8');
  t = t.replace(/var TC = \{[\s\S]*?\n  \};/, 'var TC = {\n' + Object.keys(TC).map((k) => `    ${k}: '${TC[k]}'`).join(',\n') + '\n  };');
  fs.writeFileSync(p, t);
}

{
  const p = 'C:/Users/koryj/website/index.html';
  let t = fs.readFileSync(p, 'utf8');
  t = t.replace(/var TC=\{[^}]+\};/, 'var TC={' + Object.keys(TC).map((k) => `${k}:'${TC[k]}'`).join(',') + '};');
  const rowsJs = 'var ROWS=[\n' + ROWS.map((r) =>
    `      {group:'${r.group}',title:'${r.title}',pillar:'${r.pillar}',href:'${r.href}'}`
  ).join(',\n') + '\n    ];';
  t = t.replace(/var ROWS=\[[\s\S]*?\];/, rowsJs);

  if (!t.includes('.psq-group')) {
    t = t.replace(
      /\/\* Kill old full-bleed bands/,
      `  .psq-group{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:22px clamp(12px,4vw,40px) 4px;box-sizing:border-box}
  .psq-group__label{display:inline-flex;align-items:center;gap:10px;font:800 .72rem/1 Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gc,#EAC15C)}
  .psq-group__label::before,.psq-group__label::after{content:"";display:block;height:2px;width:28px;background:var(--gc,#EAC15C);opacity:.85}
  .psq-group__rule{height:1px;margin-top:10px;background:linear-gradient(90deg,var(--gc,#EAC15C),transparent 70%);opacity:.45}
  /* Kill old full-bleed bands`
    );
  }

  const newPaint = `function paint(spec, ents){
      if(!window.PulseSquares || !ents || !ents.length) return false;
      var g=spec.group||'';
      if(g && g!==paint._lastGroup){
        paint._lastGroup=g;
        var gh=document.createElement('div');
        gh.className='psq-group';
        var gc=spec.groupColor||spec.color||'#EAC15C';
        gh.style.setProperty('--gc', gc);
        gh.innerHTML='<div class="psq-group__label">'+String(g).replace(/</g,'&lt;')+'</div><div class="psq-group__rule"></div>';
        stack.appendChild(gh);
      }
      var el=document.createElement('div');
      stack.appendChild(el);
      var col=spec.color||(window.PulseSquares.colorOf?window.PulseSquares.colorOf(spec.pillar):null);
      window.PulseSquares.paintRow(el, ents, {
        title:spec.title,
        pillar:spec.pillar,
        color:col,
        moreHref:spec.href,
        limit:20,
        shuffle:true,
        usedImages:Object.create(null),
        idleMs:15000,
        reshuffleMs:30*60*1000
      });
      if(el.style.display==='none' || !el.querySelector('.rcard')){
        try{el.remove();}catch(e){}
        return false;
      }
      return true;
    }`;
  t = t.replace(/function paint\(spec, ents\)\{[\s\S]*?return true;\n    \}/, newPaint);

  if (!t.includes('GROUP_COLOR')) {
    const gc = 'var GROUP_COLOR=' + JSON.stringify(GROUP_COLOR) + ';\n    ROWS.forEach(function(r){if(r.group&&GROUP_COLOR[r.group])r.groupColor=GROUP_COLOR[r.group];if(r.group===\'Revenue & Leadership\')r.color=\'' + CRO_GOLD + '\';});';
    t = t.replace(/(var ROWS=\[[\s\S]*?\];)/, '$1\n    ' + gc);
  }

  t = t.replace(/pulse-squares\.js\?v=[^"]+/, 'pulse-squares.js?v=20260711u');
  t = t.replace(/pulse-squares\.css\?v=[^"]+/, 'pulse-squares.css?v=20260711u');
  fs.writeFileSync(p, t);
  console.log('html', t.includes('psq-group'), t.includes('Revenue & Leadership'));
}

console.log('done');
