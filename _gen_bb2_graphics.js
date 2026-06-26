// Generates the 25 BB2 graphics (gb0446-gb0470) as 1584x396 LinkedIn-banner SVGs
// using CSS-var palettes so the on-page recolor tool can theme each asset.
// Run: node _gen_bb2_graphics.js
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'graphics', 'assets');

// Palette presets (--c1, --c2, --c3 are the accent gradient stops; --ink for body type)
const PAL = {
  amber:   { c1: '#fbbf24', c2: '#d97706', c3: '#fde68a', ink: '#2a1a02' },
  emerald: { c1: '#34d399', c2: '#059669', c3: '#a7f3d0', ink: '#022c22' },
  sky:     { c1: '#38bdf8', c2: '#0284c7', c3: '#bae6fd', ink: '#0c2740' },
  rose:    { c1: '#fb7185', c2: '#e11d48', c3: '#fecdd3', ink: '#3b0a16' },
  violet:  { c1: '#a78bfa', c2: '#7c3aed', c3: '#ddd6fe', ink: '#1e1b4b' },
  cyan:    { c1: '#22d3ee', c2: '#0891b2', c3: '#a5f3fc', ink: '#083344' },
  indigo:  { c1: '#818cf8', c2: '#4f46e5', c3: '#c7d2fe', ink: '#1e1b4b' },
  orange:  { c1: '#fb923c', c2: '#ea580c', c3: '#fed7aa', ink: '#3a160a' },
  teal:    { c1: '#2dd4bf', c2: '#0d9488', c3: '#99f6e4', ink: '#042f2e' },
  lime:    { c1: '#a3e635', c2: '#65a30d', c3: '#d9f99d', ink: '#172a04' },
};

function radial(transform) {
  return `
  <g transform="${transform}">
    <line x1="0" y1="0" x2="0" y2="-110" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="110" y2="0" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="0" y2="110" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <line x1="0" y1="0" x2="-110" y2="0" stroke="url(#accent)" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <circle cx="0" cy="-110" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="110" cy="0" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="0" cy="110" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="-110" cy="0" r="22" fill="none" stroke="url(#accent)" stroke-width="5"/>
    <circle cx="0" cy="0" r="16" fill="url(#accent)"/>
  </g>`;
}

function risingBars() {
  // a 6-bar rising chart, decorative
  return `
  <g transform="translate(1170,310)">
    <rect x="0" y="-30" width="22" height="30" fill="url(#accent)" opacity="0.85" rx="3"/>
    <rect x="34" y="-55" width="22" height="55" fill="url(#accent)" opacity="0.85" rx="3"/>
    <rect x="68" y="-78" width="22" height="78" fill="url(#accent)" opacity="0.9" rx="3"/>
    <rect x="102" y="-104" width="22" height="104" fill="url(#accent)" opacity="0.95" rx="3"/>
    <rect x="136" y="-128" width="22" height="128" fill="url(#accent)" opacity="1" rx="3"/>
    <rect x="170" y="-150" width="22" height="150" fill="url(#accent)" opacity="1" rx="3"/>
  </g>`;
}

function hexBadge() {
  // hex badge cluster
  return `
  <g transform="translate(1280,198)" stroke="url(#accent)" fill="none" stroke-width="4">
    <polygon points="0,-100 87,-50 87,50 0,100 -87,50 -87,-50"/>
    <polygon points="0,-65 56,-32 56,32 0,65 -56,32 -56,-32" opacity="0.7"/>
    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="url(#accent)" opacity="0.95"/>
  </g>`;
}

function shieldDeco() {
  // shield outline (security flavor)
  return `
  <g transform="translate(1280,198)" stroke="url(#accent)" fill="none" stroke-width="5">
    <path d="M0,-130 L100,-90 L100,30 Q100,110 0,140 Q-100,110 -100,30 L-100,-90 Z" opacity="0.9"/>
    <path d="M-40,10 L-15,40 L40,-25" stroke="url(#accent)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

function pipeArrow() {
  // pipeline → arrow
  return `
  <g transform="translate(1230,198)" stroke="url(#accent)" fill="none" stroke-width="6" stroke-linecap="round">
    <line x1="-160" y1="0" x2="120" y2="0"/>
    <polyline points="80,-40 140,0 80,40"/>
    <circle cx="-140" cy="0" r="12" fill="url(#accent)"/>
    <circle cx="-60" cy="0" r="12" fill="url(#accent)"/>
    <circle cx="20" cy="0" r="12" fill="url(#accent)"/>
  </g>`;
}

function makeBanner({ kicker, headline, sub, palette, deco }) {
  const p = PAL[palette];
  const decoSvg = deco === 'bars' ? risingBars()
                : deco === 'hex'  ? hexBadge()
                : deco === 'shield' ? shieldDeco()
                : deco === 'arrow' ? pipeArrow()
                : radial('translate(1260,198)');
  const subRendered = sub
    .replace(/\s·\s/g, ' <tspan fill="url(#accent)">&#183;</tspan> ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
  <style>svg{--c1:${p.c1};--c2:${p.c2};--c3:${p.c3};--c4:${p.c1};--c4b:${p.c3};--ink:${p.ink};}</style>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1584" y2="396" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:var(--bg1,#0b0f17)"/>
      <stop offset="1" style="stop-color:var(--bg2,#0f172a)"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style="stop-color:var(--c1,${p.c1})"/>
      <stop offset="0.55" style="stop-color:var(--c2,${p.c2})"/>
      <stop offset="1" style="stop-color:var(--c3,${p.c3})"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.3" r="0.5">
      <stop offset="0" style="stop-color:var(--c1,${p.c1})" stop-opacity="0.18"/>
      <stop offset="1" style="stop-color:var(--c1,${p.c1})" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect x="0" y="0" width="1584" height="396" fill="url(#bg)"/>
  <rect x="0" y="0" width="1584" height="396" fill="url(#glow)"/>
  ${decoSvg}

  <text x="120" y="180" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${kicker}</text>
  <text x="118" y="262" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="72" font-weight="900" fill="#FFFFFF">${headline}</text>
  <text x="120" y="316" font-family="'Inter','Segoe UI',system-ui,Arial,sans-serif" font-size="28" font-weight="700" fill="#EDE5D8">${subRendered}</text>
</svg>
`;
}

const ITEMS = [
  { id:'gb0446', palette:'sky',     deco:'bars',   kicker:'PHARMA REVOPS',           headline:'Pharmaceutical CRO.',   sub:'Branded · Generics · Biotech · Medical Device' },
  { id:'gb0447', palette:'emerald', deco:'hex',    kicker:'REAL ESTATE REVOPS',      headline:'Real Estate CRO.',      sub:'Residential · Commercial · REIT · Home Builder' },
  { id:'gb0448', palette:'orange',  deco:'arrow',  kicker:'CONSTRUCTION REVOPS',     headline:'Construction CRO.',     sub:'Equipment · Materials · Heavy Rental · Modular' },
  { id:'gb0449', palette:'indigo',  deco:'radial', kicker:'INDUSTRIAL AUTOMATION',   headline:'Robotics CRO.',         sub:'OEM · Integrator · Vision · Cobots' },
  { id:'gb0450', palette:'violet',  deco:'hex',    kicker:'SEMICONDUCTOR REVOPS',    headline:'Foundry CRO.',          sub:'EDA · Foundry · IP · Packaging' },
  { id:'gb0451', palette:'amber',   deco:'bars',   kicker:'ENTERPRISE SAAS',          headline:'Renewal is the Sale.',  sub:'NRR · ELA · Co-Term · Multi-Year' },
  { id:'gb0452', palette:'teal',    deco:'arrow',  kicker:'DOCUMENT SERVICES',        headline:'Capture CRO.',          sub:'Print · Capture · Archive · Workflow' },
  { id:'gb0453', palette:'cyan',    deco:'shield', kicker:'IDENTITY · TRUST',         headline:'Verify Everything.',    sub:'KYC · KYB · Background · Biometric' },
  { id:'gb0454', palette:'rose',    deco:'shield', kicker:'FRAUD · AML',              headline:'Catch Rate Beats Headcount.', sub:'Sanctions · KYC · Transaction · SAR' },
  { id:'gb0455', palette:'lime',    deco:'shield', kicker:'OFFENSIVE SECURITY',       headline:'Pentest CRO.',          sub:'Web · Mobile · Cloud · Red Team' },
  { id:'gb0456', palette:'emerald', deco:'shield', kicker:'MANAGED DETECTION',         headline:'MDR Operator.',         sub:'EDR · XDR · IR · Threat Hunt' },
  { id:'gb0457', palette:'sky',     deco:'bars',   kicker:'SIEM · DATA LAKE',          headline:'Detection Engineer.',   sub:'Splunk · Sentinel · Chronicle · Panther' },
  { id:'gb0458', palette:'violet',  deco:'shield', kicker:'ZERO TRUST ACCESS',         headline:'ZTNA Operator.',        sub:'Zscaler · Netskope · Cloudflare · Prisma' },
  { id:'gb0459', palette:'rose',    deco:'shield', kicker:'CYBER INSURANCE',           headline:'Underwriter CRO.',      sub:'Loss Ratio · Sub-Limits · Vendor Endorsement' },
  { id:'gb0460', palette:'amber',   deco:'bars',   kicker:'REVENUE LAW',               headline:'NRR > New Logos.',      sub:'Expansion · Retention · Renewal · Multi-Year' },
  { id:'gb0461', palette:'sky',     deco:'arrow',  kicker:'REVENUE LAW',               headline:'Forecast First, Pipeline Second.', sub:'Commit · Best Case · Pipeline · Coverage' },
  { id:'gb0462', palette:'indigo',  deco:'radial', kicker:'REVENUE LAW',               headline:'Deals Do Not Stall. People Do.', sub:'Champion · Economic Buyer · Decision · Power' },
  { id:'gb0463', palette:'teal',    deco:'hex',    kicker:'REVENUE LAW',               headline:'Discovery is the Job.', sub:'Pain · Impact · Decision · Process' },
  { id:'gb0464', palette:'lime',    deco:'arrow',  kicker:'REVENUE LAW',               headline:'Champions Close Deals.', sub:'Build · Test · Mobilize · Reference' },
  { id:'gb0465', palette:'emerald', deco:'bars',   kicker:'REVENUE LAW',               headline:'Renewal is the New Sale.', sub:'Health Score · QBR · Co-Term · Multi-Year' },
  { id:'gb0466', palette:'cyan',    deco:'hex',    kicker:'REVENUE LAW',               headline:'Sales Cycles Shrink With Trust.', sub:'Reference · Proof · Pilot · Land' },
  { id:'gb0467', palette:'violet',  deco:'radial', kicker:'QUALIFICATION FRAMEWORK',   headline:'MEDDPICC.',             sub:'Metrics · Economic · Decision · Paper · Pain · Champion · Competition' },
  { id:'gb0468', palette:'rose',    deco:'arrow',  kicker:'REVENUE LAW',               headline:'BANT is Dead.',         sub:'Budget · Authority · Need · Timing → Replaced' },
  { id:'gb0469', palette:'orange',  deco:'bars',   kicker:'FORECAST DISCIPLINE',       headline:'Bands Beat Points.',    sub:'Low · Commit · High · Stretch' },
  { id:'gb0470', palette:'amber',   deco:'hex',    kicker:'ICP DISCIPLINE',            headline:'Say No to Win More.',   sub:'Fit · Pain · Power · Buy Cycle' },
];

let wrote = 0;
for (const it of ITEMS) {
  const svg = makeBanner(it);
  const p = path.join(OUT_DIR, it.id + '.svg');
  fs.writeFileSync(p, svg);
  wrote++;
  console.log('wrote', it.id);
}
console.log('done.', wrote, 'svgs');
