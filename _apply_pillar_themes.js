/**
 * One-shot: apply mood-matched accent themes to pillar hub landing pages.
 * Pattern matches aquariums.html / highschool-football-recruiting.html (full accent overrides).
 */
const fs = require('fs');
const path = require('path');

function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Dark neutral tint for borders/backgrounds derived from accent */
function borderRgb(accentHex) {
  const [r, g, b] = hexRgb(accentHex);
  return mix([r, g, b], [12, 28, 32], 0.72);
}

function rgba(rgb, a) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

function styleBlock(theme, extras) {
  const { accent, od, bg, s1, cardh, t1, t2, t3, label } = theme;
  const br = borderRgb(accent);
  const ar = hexRgb(accent);
  return `<!-- ${label} -->
<style>
:root{
  --orange:${accent};--od:${od};
  --bg:${bg};--s1:${s1};--card:#FFFFFF;--cardh:${cardh};
  --bdr:${rgba(br, 0.12)};--bdrh:${rgba(ar, 0.42)};
  --t1:${t1};--t2:${t2};--t3:${t3};
}
body{background-color:${bg};background-image:none}
.hdr{background:rgba(255,255,255,.94);border-bottom:1px solid ${rgba(br, 0.08)}}
.hdr-name{color:var(--orange)}
.hdr-cta{background:var(--orange);color:#fff}
.search-input{background:#fff;border:1px solid ${rgba(br, 0.14)};color:var(--t1)}
.search-clear{background:${rgba(br, 0.06)}}
.filter-chip{background:${rgba(br, 0.03)};border:1px solid ${rgba(br, 0.10)}}
.filter-chip.is-active{background:var(--orange);color:#fff;border-color:var(--orange)}
.statusbar strong{color:var(--t1)}
.card{background:#fff}
.card::before{background:linear-gradient(90deg,transparent,${rgba(br, 0.06)},transparent)}
.card:hover{box-shadow:0 8px 24px ${rgba(br, 0.10)}}
.card-meta{border-top:1px solid ${rgba(br, 0.06)}}
.card-pillar{color:var(--orange);background:${rgba(ar, 0.10)};border:1px solid ${rgba(ar, 0.25)}}
.pager button{background:${rgba(br, 0.03)};border:1px solid ${rgba(br, 0.10)}}
.pager button.is-active{background:var(--orange);color:#fff;border-color:var(--orange)}
.footer{background:var(--s1);border-top:1px solid ${rgba(br, 0.08)}}
.footer-pillars span{background:${rgba(br, 0.03)};border:1px solid ${rgba(br, 0.08)}}
.footer-pillars strong{color:${t1}}
.hero-eyebrow{background:${rgba(ar, 0.10)};border:1px solid ${rgba(ar, 0.28)};color:var(--od)}
.hero-counts strong{color:var(--orange)}
.hero h1 em{color:var(--orange)}
.pillar-brand{display:flex;justify-content:center;margin:10px auto 18px}
.pillar-hero-logo{display:block;width:min(1180px,94vw);height:auto;margin:0 auto}
.pillar-brand-fallback{display:flex;align-items:center;gap:14px;justify-content:center}
.pbf-mark,.kbf-mark{height:54px;width:auto;display:block}
.pbf-word,.kbf-word{font-size:42px;font-weight:800;letter-spacing:2px;color:var(--orange);line-height:1}
.pbf-word em,.kbf-word em{font-style:normal;color:var(--od)}
@media(max-width:560px){.pbf-mark,.kbf-mark{height:38px}.pbf-word,.kbf-word{font-size:28px;letter-spacing:1px}}
.hero{padding-top:22px;padding-bottom:14px;max-width:1360px}
.hero h1{margin-top:6px}${extras || ''}
</style>`;
}

// accent, od, bg, s1, cardh, t1, t2, t3, themeColor
const T = {
  all:  ['#2D6A4F','#1B4332','#EBF2E5','#F2F8F4','#F5FAF6','#14261C','#4A6356','#8AA896','#EBF2E5'],
  q:    ['#2D6A4F','#1B4332','#EBF2E5','#F2F8F4','#F5FAF6','#14261C','#4A6356','#8AA896','#EBF2E5'],
  st:   ['#2563EB','#1D4ED8','#EEF4FF','#F3F7FF','#F5F8FF','#0F172A','#475569','#94A3B8','#EEF4FF'],
  ik:   ['#D97706','#B45309','#FDF8EE','#FDF6EC','#FFFBF5','#1C1408','#6B5340','#A89078','#FDF8EE'],
  tk:   ['#475569','#334155','#ECF1E6','#F2F5EF','#F6F8F4','#0F172A','#475569','#94A3B8','#ECF1E6'],
  gb:   ['#7C3AED','#6D28D9','#F5F0FF','#F8F4FF','#FAF7FF','#1E1033','#5B4A72','#9B8AB0','#F5F0FF'],
  bs:   ['#B45309','#92400E','#FBF5EB','#FDF8F2','#FFFCF7','#1A1208','#6B5340','#A89078','#FBF5EB'],
  er:   ['#0891B2','#0E7490','#EAF8FC','#F0FAFC','#F5FCFD','#0C2A30','#3F5A60','#7E9298','#EAF8FC'],
  ra:   ['#059669','#047857','#F0FDF7','#F3FDF8','#F5FBF8','#052E1C','#3D5A4A','#7E9A8A','#F0FDF7'],
  gp:   ['#0D9488','#0F766E','#F0FDFA','#F3FDFB','#F5FCFA','#0F2E2A','#3D5A56','#7E9A96','#F0FDFA'],
  fr:   ['#16A34A','#15803D','#EEFEED','#F2FBF3','#F5FCF6','#102818','#3F5A48','#7E927F','#EEFEED'],
  ca:   ['#DC2626','#B91C1C','#FEF2F2','#FEF5F5','#FFF8F8','#1C0A0A','#5A4040','#9A8080','#FEF2F2'],
  sports:['#166534','#14532D','#F1FCEF','#F4FCF2','#F7FDF5','#102818','#3F5A48','#7E927F','#F1FCEF'],
  tn:   ['#5B7553','#4A6244','#F2F5EF','#F6F8F4','#F8FAF6','#1A2218','#4A5648','#8A917E','#F2F5EF'],
  sc:   ['#1E40AF','#1E3A8A','#EEF2FF','#F3F6FF','#F5F8FF','#0F172A','#475569','#94A3B8','#EEF2FF'],
  nl:   ['#7C3AED','#6D28D9','#F5F0FF','#F8F4FF','#FAF7FF','#1E1033','#5B4A72','#9B8AB0','#F5F0FF'],
  dn:   ['#9F1239','#881337','#FDF2F6','#FEF5F8','#FFF8FA','#2A0A14','#5A4048','#9A8088','#FDF2F6'],
  bt:   ['#0E8FA8','#0A7286','#EAF6F8','#F2FAFB','#F5FCFD','#0C2A30','#3F5A60','#7E9298','#EAF6F8'],
  mv:   ['#9333EA','#7E22CE','#FAF5FF','#FBF7FF','#FCFAFF','#1E1033','#5B4A72','#9B8AB0','#FAF5FF'],
  wl:   ['#059669','#047857','#ECFDF5','#F0FDF7','#F3FDF8','#052E1C','#3D5A4A','#7E9A8A','#ECFDF5'],
  dr:   ['#EA580C','#C2410C','#FFF7ED','#FFFAF5','#FFFCF8','#1C1008','#6B5340','#A89078','#FFF7ED'],
  tv:   ['#0284C7','#0369A1','#F0F9FF','#F3FAFF','#F5FBFF','#0C1929','#3F5060','#7E9098','#F0F9FF'],
  rs:   ['#E8710A','#C45A08','#FFF7ED','#FFFAF5','#FFFCF8','#1C1408','#6B5340','#A89078','#FFF7ED'],
  es:   ['#1E3A5F','#152A45','#F5F3EE','#F8F6F1','#FAF8F4','#0F1A28','#4A5568','#8896A8','#F5F3EE'],
  cl:   ['#166534','#14532D','#F0FDF4','#F3FDF6','#F5FDF7','#102818','#3F5A48','#7E927F','#F0FDF4'],
  lv:   ['#B45309','#92400E','#FBF7F0','#FDF9F4','#FFFCF8','#1A1208','#6B5340','#A89078','#FBF7F0'],
  ev:   ['#DB2777','#BE185D','#FDF2F8','#FEF5FA','#FFF8FB','#2A0A18','#5A4048','#9A8088','#FDF2F8'],
  sy:   ['#BE185D','#9D174D','#FDF2F8','#FEF5FA','#FFF8FB','#2A0A18','#5A4048','#9A8088','#FDF2F8'],
  ga:   ['#CA8A04','#A16207','#FFFBEB','#FFFCF2','#FFFDF7','#1C1408','#6B5340','#A89078','#FFFBEB'],
  gm:   ['#9333EA','#7E22CE','#FAF5FF','#FBF7FF','#FCFAFF','#1E1033','#5B4A72','#9B8AB0','#FAF5FF'],
  sk:   ['#DC2626','#B91C1C','#FEF2F2','#FEF5F5','#FFF8F8','#1C0A0A','#5A4040','#9A8080','#FEF2F2'],
  sp:   ['#D97706','#B45309','#FFFBEB','#FFFCF2','#FFFDF7','#1C1408','#6B5340','#A89078','#FFFBEB'],
  tl:   ['#475569','#334155','#F1F5F9','#F4F7FA','#F6F9FB','#0F172A','#475569','#94A3B8','#F1F5F9'],
  cg:   ['#16A34A','#15803D','#F0FDF4','#F3FDF6','#F5FDF7','#102818','#3F5A48','#7E927F','#F0FDF4'],
  co:   ['#92400E','#78350F','#FBF5EB','#FDF8F2','#FFFCF7','#1A1208','#6B5340','#A89078','#FBF5EB'],
  aq:   ['#0E8FA8','#0A7286','#EAF6F8','#F2FAFB','#F5FCFD','#0C2A30','#3F5A60','#7E9298','#EAF6F8'],
  hf:   ['#1C7A3E','#155E2F','#EAF3EC','#F2F8F3','#F5FBF6','#10271A','#3F5A48','#7E927F','#EAF3EC'],
  ai:   ['#0284C7','#0369A1','#F0F9FF','#F3FAFF','#F5FBFF','#0C1929','#3F5060','#7E9098','#F0F9FF'],
  bo:   ['#D97706','#B45309','#FFFBEB','#FFFCF2','#FFFDF7','#1C1408','#6B5340','#A89078','#FFFBEB'],
  cd:   ['#1E3A5F','#152A45','#EEF2F7','#F3F6FA','#F5F8FB','#0F1A28','#4A5568','#8896A8','#EEF2F7'],
};

const FILE_KEY = {
  'knowledge.html': 'all',
  'sales-trainings.html': 'st',
  'industry-kpis.html': 'ik',
  'tech-stacks.html': 'tk',
  'graphics.html': 'gb',
  'sales-book-summaries.html': 'bs',
  'electronic-reviews.html': 'er',
  'revenue-architecture.html': 'ra',
  'go-to-market-playbooks.html': 'gp',
  'franchises.html': 'fr',
  'cars.html': 'ca',
  'sports.html': 'sports',
  'towns.html': 'tn',
  'schools.html': 'sc',
  'nightlife.html': 'nl',
  'dining.html': 'dn',
  'boats.html': 'bt',
  'movies.html': 'mv',
  'wellness.html': 'wl',
  'drills.html': 'dr',
  'travel.html': 'tv',
  'resorts.html': 'rs',
  'estates.html': 'es',
  'clubs.html': 'cl',
  'living.html': 'lv',
  'events.html': 'ev',
  'style.html': 'sy',
  'gatherings.html': 'ga',
  'gaming.html': 'gm',
  'skills.html': 'sk',
  'speeches.html': 'sp',
  'tools.html': 'tl',
  'coaching.html': 'cg',
  'collectibles.html': 'co',
  'aquariums.html': 'aq',
  'highschool-football-recruiting.html': 'hf',
  'ai-infrastructure.html': 'ai',
  'buildouts.html': 'bo',
  'contracts.html': 'cd',
};

const KNOWLEDGE_EXTRAS = `
.toolbar{background:rgba(255,255,255,.96);border-bottom:1px solid rgba(45,106,79,.08);box-shadow:0 6px 20px rgba(20,38,28,.06)}
.search-kbd-hint{color:var(--t3)}
.search-kbd-hint kbd{background:rgba(45,106,79,.05);border-color:rgba(45,106,79,.12);color:var(--t2)}
.card-q mark{background:rgba(45,106,79,.18)}
.hub-recent-pill:hover{border-color:rgba(45,106,79,.35)}
.skip-link{color:#fff}
.search-spinner{border-color:rgba(45,106,79,.22);border-top-color:var(--orange)}
.empty-btn{border-color:rgba(45,106,79,.35);background:rgba(45,106,79,.10);color:var(--orange)}
.empty-btn:hover{background:rgba(45,106,79,.18)}
.hub-results-bar{background:rgba(255,255,255,.96);border-bottom-color:rgba(45,106,79,.08);color:var(--t2)}
.hub-results-bar strong{color:var(--t1)}
.hub-results-bar button{border-color:rgba(45,106,79,.35);background:rgba(45,106,79,.10);color:var(--orange)}
.card.card-visited{border-color:var(--orange);box-shadow:0 0 0 2px rgba(45,106,79,.22),0 8px 24px rgba(20,38,28,.10)}`;

const CARS_EXTRAS = `
.hero-note{margin:10px auto 0;max-width:720px;font-size:.88rem;line-height:1.55;color:var(--t2);text-align:center}`;

const TOOLS_EXTRAS = `
.calc-cta{display:inline-flex;align-items:center;gap:10px;margin-top:16px;padding:11px 20px;border-radius:12px;background:linear-gradient(180deg,var(--orange),var(--od));color:#fff;font-weight:800;font-size:.95rem;text-decoration:none;box-shadow:0 6px 18px rgba(71,85,105,.22)}`;

const ESTATES_EXTRAS = `
.hero-counts strong,.pbf-word em,.kbf-word em{color:#B8860B}`;

function themeFromKey(key) {
  const row = T[key];
  if (!row) return null;
  const [accent, od, bg, s1, cardh, t1, t2, t3, themeColor] = row;
  const names = {
    all: 'Knowledge pillar — sage green theme',
    st: 'Sales Trainings pillar — professional blue theme',
    ik: 'Industry KPIs pillar — amber metrics theme',
    tk: 'Tech Stacks pillar — slate professional theme',
    gb: 'Graphics pillar — creative purple theme',
    bs: 'Book Summaries pillar — warm amber theme',
    er: 'Electronic Reviews pillar — cyan tech theme',
    ra: 'Revenue Architecture pillar — emerald blueprint theme',
    gp: 'GTM Playbooks pillar — teal motion theme',
    fr: 'Franchises pillar — growth green theme',
    ca: 'Cars pillar — automotive red theme',
    sports: 'Sports pillar — field green theme',
    bt: 'Boats pillar — marine teal theme',
    rs: 'Resorts pillar — warm orange/gold theme',
    dn: 'Dining pillar — wine red theme',
    nl: 'Nightlife pillar — purple neon theme',
    cg: 'Coaching pillar — growth green theme',
    es: 'Estates pillar — luxury navy/gold theme',
    aq: 'Aquariums pillar — light aqua theme',
    hf: 'HS Football Recruiting pillar — field green theme',
  };
  return {
    accent, od, bg, s1, cardh, t1, t2, t3, themeColor,
    label: names[key] || `${key} pillar — themed accent`,
  };
}

function applyFile(file, key, extras) {
  const fp = path.join(__dirname, file);
  if (!fs.existsSync(fp)) {
    console.log('skip missing', file);
    return false;
  }
  let html = fs.readFileSync(fp, 'utf8');
  const theme = themeFromKey(key);
  if (!theme) {
    console.log('skip no theme', file, key);
    return false;
  }

  const newBlock = styleBlock(theme, extras);

  // Replace existing themed style block, or inject before </head> for pages without one (graphics)
  const styleRe = /<!-- [^]*?pillar[^]*? -->\s*<style>[\s\S]*?<\/style>/i;
  if (styleRe.test(html)) {
    html = html.replace(styleRe, newBlock);
  } else if (/<link rel="stylesheet" href="\/css\/pillar-page.css">/.test(html)) {
    html = html.replace(
      /<link rel="stylesheet" href="\/css\/pillar-page.css">/,
      `<link rel="stylesheet" href="/css/pillar-page.css">\n${newBlock}`
    );
  } else {
    console.log('skip no anchor', file);
    return false;
  }

  html = html.replace(
    /<meta name="theme-color" content="[^"]*">/,
    `<meta name="theme-color" content="${theme.themeColor}">`
  );

  fs.writeFileSync(fp, html);
  console.log('updated', file, '→', theme.accent, key);
  return true;
}

let n = 0;
for (const [file, key] of Object.entries(FILE_KEY)) {
  let extras = '';
  if (file === 'knowledge.html') extras = KNOWLEDGE_EXTRAS;
  if (file === 'cars.html') extras = CARS_EXTRAS;
  if (file === 'tools.html') extras = TOOLS_EXTRAS;
  if (file === 'estates.html') extras = ESTATES_EXTRAS;
  if (applyFile(file, key, extras)) n++;
}
console.log('done:', n, 'files');
