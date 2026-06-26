// Batch 2 for the Graphics pillar: generates gb0021-gb0220 (200 on-brand SVGs)
// across all categories, then publishes them to the pulse-machine-library blob
// store in a SINGLE process (no 200 execFile spawns) + one batched IndexNow ping.
//
//   node _gb_batch2.js gen       -> write all SVG assets to graphics/assets/
//   node _gb_batch2.js publish   -> write all blob entries + batch IndexNow
//   node _gb_batch2.js both      -> gen then publish
//
// Brand: dark gradient bg #0b0f17->#0f172a, orange->gold accent gradient, cyan
// var(--c4,#22d3ee), Inter font stack, EKG pulse motif, pulserevops.com credit. Graphics
// are EXEMPT from the text/mermaid graders (see project_graphics_pillar memory).
const fs = require('fs');
const path = require('path');
const { PALETTES, paletteVars } = require('./graphics-palettes.js');

const ASSET_DIR = path.join(__dirname, 'graphics', 'assets');
const START_NUM = 21;            // first id = gb0021
const FONT = "'Inter','Segoe UI',system-ui,Arial,sans-serif";
// Deterministic per-id palette pick so the gallery shows colour variety and a
// re-run is stable. Customiser on the entry page overrides via inline vars.
function pickPalette(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return PALETTES[h % PALETTES.length]; }
function injectTheme(svg, pal) { return svg.replace(/(<svg[^>]*>)/, `$1\n  <style>svg{${paletteVars(pal)}}</style>`); }

// ── helpers ───────────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function plain(x) { return (Array.isArray(x) ? x.join(' ') : String(x)).replace(/\s+/g, ' ').trim(); }
function lc(s) { return String(s).charAt(0).toLowerCase() + String(s).slice(1); }
function id4(n) { return 'gb' + String(n).padStart(4, '0'); }
// estimate a font size that keeps `text` within maxW (weight-aware char factor)
function fit(text, maxW, maxSize, factor) {
  factor = factor || 0.60;
  const len = String(text).length || 1;
  const s = Math.floor(maxW / (len * factor));
  return Math.max(8, Math.min(maxSize, s));
}
// EKG/pulse polyline points across [x0..x1] on baseline y, spike amplitude amp
function ekg(x0, x1, y, amp) {
  const w = x1 - x0;
  const pts = [
    [0.00, 0], [0.28, 0], [0.32, -0.35], [0.385, 1.0], [0.45, -0.7], [0.50, 0],
    [0.64, 0], [0.68, -0.35], [0.745, 1.0], [0.81, -0.7], [0.86, 0], [1.0, 0],
  ];
  return pts.map(([fx, fy]) => `${Math.round(x0 + fx * w)},${Math.round(y - fy * amp)}`).join(' ');
}
const DEFS_GRADS = (w, h, gx, gy, gr) =>
`  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:var(--bg1,#0b0f17)"/><stop offset="1" style="stop-color:var(--bg2,#0f172a)"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style="stop-color:var(--c1,#FF8C1A)"/><stop offset="0.55" style="stop-color:var(--c2,#E8710A)"/><stop offset="1" style="stop-color:var(--c3,#FFD740)"/>
    </linearGradient>
    <linearGradient id="accent2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style="stop-color:var(--c4,#22d3ee)"/><stop offset="1" style="stop-color:var(--c4b,#67e8f9)"/>
    </linearGradient>
    <radialGradient id="glow" cx="${gx}" cy="${gy}" r="${gr}">
      <stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.16"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/>
    </radialGradient>`;
const WORDMARK = () => '';
// join words with accent middots, for sublines like "Pipeline · Process · Predictability"
function middots(parts) {
  return parts.map(esc).join(' <tspan fill="url(#accent)">&#183;</tspan> ');
}

// ── template renderers ──────────────────────────────────────────────────────
function renderBanner(s) {
  const W = 1584, H = 396;
  const hs = fit(s.headline, 1410, 78, 0.58);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.8, 0.28, 0.55)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <polyline points="${ekg(900, 1520, 86, 56)}" stroke="url(#accent)" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <text x="90" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="88" y="${150 + hs - 6}" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <text x="90" y="330" font-family="${FONT}" font-size="30" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>
${WORDMARK(1496, 350, 16)}
</svg>`;
}

function renderSlideTitle(s) {
  const W = 1920, H = 1080;
  const lines = s.titleLines;
  const fsz = fit(lines.reduce((a, b) => a.length > b.length ? a : b), 1640, 124, 0.56);
  const totalH = lines.length * fsz * 1.06;
  let ty = 540 - totalH / 2 + fsz * 0.82;
  const titleSvg = lines.map(l => {
    const t = `  <text x="960" y="${Math.round(ty)}" text-anchor="middle" font-family="${FONT}" font-size="${fsz}" font-weight="900" fill="#FFFFFF">${esc(l)}</text>`;
    ty += fsz * 1.06; return t;
  }).join('\n');
  const waveY = Math.round(540 + totalH / 2 + 70);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.32, 0.55)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="960" y="300" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" letter-spacing="14" fill="url(#accent)">${esc(s.eyebrow)}</text>
${titleSvg}
  <polyline points="${ekg(700, 1220, waveY, 70)}" stroke="url(#accent)" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
  <text x="960" y="${waveY + 116}" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>
${WORDMARK(1762, 996, 22)}
</svg>`;
}

function renderSlideDivider(s) {
  const W = 1920, H = 1080;
  const bfs = fit(s.big, 1200, 300, 0.60);
  const hfs = fit(s.headline, 1640, 104, 0.56);
  const bigBase = Math.round(380 + 0.22 * bfs);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.3, 0.6)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="960" y="${bigBase}" text-anchor="middle" font-family="${FONT}" font-size="${bfs}" font-weight="900" fill="url(#accent)" opacity="0.92">${esc(s.big)}</text>
  <rect x="${960 - 220}" y="600" width="440" height="6" rx="3" fill="#1f2a3d"/>
  <text x="960" y="720" text-anchor="middle" font-family="${FONT}" font-size="${hfs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
${WORDMARK(1762, 996, 22)}
</svg>`;
}

function renderSlideClosing(s) {
  const W = 1920, H = 1080;
  const bfs = fit(s.big, 1500, 150, 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.36, 0.6)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="960" y="490" text-anchor="middle" font-family="${FONT}" font-size="${bfs}" font-weight="900" fill="#FFFFFF">${esc(s.big)}</text>
  <polyline points="540,600 760,600 800,600 836,536 876,690 916,600 1010,600 1050,600 1086,560 1126,656 1166,600 1380,600" stroke="url(#accent)" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
  <circle cx="1380" cy="600" r="10" fill="var(--c4,#22d3ee)"/>
  <text x="960" y="720" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="#EDE5D8">${esc(s.sub)}</text>
  ${s.prompt ? `<text x="960" y="800" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="800" letter-spacing="4" fill="url(#accent)">${esc(s.prompt)}</text>` : ''}
${WORDMARK(1762, 996, 22)}
</svg>`;
}

const BANDFILLS = ['url(#band1)', 'url(#band2)', 'url(#band3)', 'url(#band4)', 'url(#band5)'];
function renderInfoFunnel(s) {
  const W = 1080, H = 1350;
  const items = s.items;
  const N = items.length;
  const yTop = 322, yBot = 1180, gap = 16;
  const bandH = (yBot - yTop) / N;
  const xL = 150, xR = 930, maxInset = 300;
  let bands = '';
  for (let i = 0; i < N; i++) {
    const tIn = (i / N) * maxInset, bIn = ((i + 1) / N) * maxInset;
    const lt = xL + tIn, rt = xR - tIn, lb = xL + bIn, rb = xR - bIn;
    const yt = yTop + i * bandH, yb = yt + bandH - gap;
    const ym = (yt + yb) / 2;
    const white = (i % 5) === 3;
    const tc = white ? '#FFFFFF' : '#0b0f17';
    bands += `  <polygon points="${lt.toFixed(0)},${yt.toFixed(0)} ${rt.toFixed(0)},${yt.toFixed(0)} ${rb.toFixed(0)},${yb.toFixed(0)} ${lb.toFixed(0)},${yb.toFixed(0)}" fill="${BANDFILLS[i % 5]}"/>\n`;
    bands += `  <text x="540" y="${(ym - 6).toFixed(0)}" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="900" letter-spacing="2" fill="${tc}">${esc(items[i].label.toUpperCase())}</text>\n`;
    if (items[i].sub) bands += `  <text x="540" y="${(ym + 34).toFixed(0)}" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="600" fill="${tc}" opacity="${white ? '0.85' : '0.78'}">${esc(items[i].sub)}</text>\n`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.16, 0.6)}
    <linearGradient id="band1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c3,#FFD740)"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)"/></linearGradient>
    <linearGradient id="band2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)"/><stop offset="1" style="stop-color:var(--c2,#E8710A)"/></linearGradient>
    <linearGradient id="band3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c4,#22d3ee)"/><stop offset="1" style="stop-color:var(--c4b,#67e8f9)"/></linearGradient>
    <linearGradient id="band4" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c2,#E8710A)"/><stop offset="1" style="stop-color:var(--c2,#E8710A)"/></linearGradient>
    <linearGradient id="band5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c3,#FFD740)"/><stop offset="1" style="stop-color:var(--c2,#E8710A)"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="540" y="150" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="8" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="540" y="226" text-anchor="middle" font-family="${FONT}" font-size="${fit(s.heading, 940, 60, 0.54)}" font-weight="900" fill="#FFFFFF">${esc(s.heading)}</text>
${bands}${WORDMARK(880, 1268, 20)}
</svg>`;
}

function renderInfoRows(s) {
  const W = 1080, H = 1350;
  const items = s.items;
  const N = items.length;
  const yTop = 300, yBot = 1200, gap = 16;
  const rowH = (yBot - yTop) / N;
  const r = Math.min(52, rowH / 2 - 16);
  const lfs = Math.min(40, Math.round(rowH * 0.32));
  const sfs = Math.min(23, Math.round(rowH * 0.19));
  let rows = '';
  for (let i = 0; i < N; i++) {
    const yt = yTop + i * rowH;
    const h = rowH - gap;
    const cy = yt + h / 2;
    rows += `  <g>
    <rect x="76" y="${yt.toFixed(0)}" width="928" height="${h.toFixed(0)}" rx="20" fill="#111a2b" stroke="#1f2a3d" stroke-width="2"/>
    <circle cx="178" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#accent)"/>
    <text x="178" y="${(cy + r * 0.36).toFixed(0)}" text-anchor="middle" font-family="${FONT}" font-size="${Math.round(r)}" font-weight="900" fill="#0b0f17">${i + 1}</text>
    <text x="268" y="${(cy - (items[i].sub ? 8 : -lfs * 0.34)).toFixed(0)}" font-family="${FONT}" font-size="${lfs}" font-weight="800" fill="#FFFFFF">${esc(items[i].label)}</text>
${items[i].sub ? `    <text x="268" y="${(cy + sfs + 6).toFixed(0)}" font-family="${FONT}" font-size="${sfs}" font-weight="500" fill="#94a3b8">${esc(items[i].sub)}</text>` : ''}
  </g>\n`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.16, 0.6)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="540" y="150" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="8" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="540" y="226" text-anchor="middle" font-family="${FONT}" font-size="${fit(s.heading, 940, 56, 0.54)}" font-weight="900" fill="#FFFFFF">${esc(s.heading)}</text>
${rows}${WORDMARK(1004, 1262, 20)}
</svg>`;
}

function renderQuote(s) {
  const W = 1080, H = 1080;
  const lines = s.lines;
  const fsz = fit(lines.reduce((a, b) => a.length > b.length ? a : b), 920, 92, 0.56);
  const lh = fsz * 1.16;
  const block = lines.length * lh;
  let qy = 560 - block / 2 + fsz * 0.78;
  const linesSvg = lines.map((l, i) => {
    const fill = (s.accentLine === i) ? 'url(#accent)' : '#FFFFFF';
    const t = `  <text x="540" y="${Math.round(qy)}" text-anchor="middle" font-family="${FONT}" font-size="${fsz}" font-weight="800" fill="${fill}" letter-spacing="-1">${esc(l)}</text>`;
    qy += lh; return t;
  }).join('\n');
  const waveY = Math.round(560 + block / 2 + 56);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.4, 0.6)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="540" y="280" text-anchor="middle" font-family="${FONT}" font-size="240" font-weight="900" fill="url(#accent)" opacity="0.9">&#8220;</text>
${linesSvg}
  <polyline points="${ekg(360, 720, waveY, 48)}" stroke="url(#accent)" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
${s.attribution ? `  <text x="540" y="${waveY + 80}" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" letter-spacing="8" fill="#94a3b8">&#8212; ${esc(s.attribution)}</text>` : ''}
</svg>`;
}

function renderWall(s) {
  const W = 2400, H = 3000;
  const lines = s.lines;
  const N = lines.length;
  const fsz = fit(lines.reduce((a, b) => a.length > b.length ? a : b), 2000, 460, 0.62);
  const lh = fsz * 1.0;
  const block = N * lh;
  let ty = 1500 - block / 2 + fsz * 0.78;
  const colors = N === 2 ? ['#FFFFFF', 'url(#accent)'] : ['#FFFFFF', '#EDE5D8', 'url(#accent)'];
  const linesSvg = lines.map((l, i) => {
    const fill = colors[Math.min(i, colors.length - 1)];
    const t = `  <text x="1200" y="${Math.round(ty)}" text-anchor="middle" font-family="${FONT}" font-size="${fsz}" font-weight="900" letter-spacing="-8" fill="${fill}">${esc(l)}</text>`;
    ty += lh; return t;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f17"/><stop offset="1" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8C1A"/><stop offset="0.5" stop-color="#E8710A"/><stop offset="1" stop-color="var(--c3,#FFD740)"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="216" y="216" width="1968" height="2568" fill="none" stroke="#1e293b" stroke-width="6" rx="32"/>
  <text x="1200" y="560" text-anchor="middle" font-family="${FONT}" font-size="86" font-weight="800" letter-spacing="26" fill="#94a3b8">${esc(s.eyebrow)}</text>
${linesSvg}
  <polyline points="${ekg(360, 2040, 2440, 200)}" fill="none" stroke="url(#accent)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="360" cy="2440" r="22" fill="var(--c4,#22d3ee)"/>
  <circle cx="2040" cy="2440" r="22" fill="var(--c4,#22d3ee)"/>
</svg>`;
}

// ── icon shapes (drawn around center 400,400 on 800x800 tile) ───────────────
const ICONS = {
  target: () => `<circle cx="400" cy="400" r="180" fill="none" stroke="url(#accent)" stroke-width="34"/><circle cx="400" cy="400" r="108" fill="none" stroke="url(#accent)" stroke-width="34" opacity="0.8"/><circle cx="400" cy="400" r="38" fill="var(--c4,#22d3ee)"/>`,
  barchart: () => `<rect x="250" y="430" width="70" height="150" rx="10" fill="url(#accent)" opacity="0.7"/><rect x="365" y="350" width="70" height="230" rx="10" fill="url(#accent)" opacity="0.85"/><rect x="480" y="250" width="70" height="330" rx="10" fill="url(#accent)"/><line x1="220" y1="595" x2="580" y2="595" stroke="var(--c4,#22d3ee)" stroke-width="10" stroke-linecap="round"/>`,
  linechart: () => `<polyline points="240,540 330,470 410,500 500,360 560,300" fill="none" stroke="url(#accent)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M520 300 L585 290 L560 350 Z" fill="var(--c4,#22d3ee)"/><line x1="230" y1="600" x2="585" y2="600" stroke="#1f2a3d" stroke-width="8"/>`,
  coin: () => `<circle cx="400" cy="400" r="180" fill="none" stroke="url(#accent)" stroke-width="30"/><text x="400" y="478" text-anchor="middle" font-family="${FONT}" font-size="220" font-weight="900" fill="url(#accent)">$</text>`,
  rocket: () => `<path d="M400 230 C460 280 470 380 460 470 L340 470 C330 380 340 280 400 230 Z" fill="url(#accent)"/><circle cx="400" cy="350" r="34" fill="#0b0f17"/><path d="M340 460 L300 540 L350 500 Z" fill="var(--c4,#22d3ee)"/><path d="M460 460 L500 540 L450 500 Z" fill="var(--c4,#22d3ee)"/><path d="M375 480 L400 580 L425 480 Z" fill="var(--c3,#FFD740)"/>`,
  trophy: () => `<path d="M310 270 L490 270 L478 400 C478 450 430 480 400 480 C370 480 322 450 322 400 Z" fill="url(#accent)"/><path d="M310 290 C250 290 250 380 330 390" fill="none" stroke="url(#accent)" stroke-width="20"/><path d="M490 290 C550 290 550 380 470 390" fill="none" stroke="url(#accent)" stroke-width="20"/><rect x="380" y="480" width="40" height="50" fill="#94a3b8"/><rect x="330" y="530" width="140" height="34" rx="8" fill="var(--c4,#22d3ee)"/>`,
  check: () => `<circle cx="400" cy="400" r="180" fill="none" stroke="url(#accent)" stroke-width="30"/><polyline points="318,406 378,468 492,338" fill="none" stroke="var(--c4,#22d3ee)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>`,
  magnet: () => `<path d="M300 300 L300 450 C300 505 345 545 400 545 C455 545 500 505 500 450 L500 300 L420 300 L420 450 C420 460 412 468 400 468 C388 468 380 460 380 450 L380 300 Z" fill="url(#accent)"/><rect x="300" y="300" width="80" height="56" fill="var(--c4,#22d3ee)"/><rect x="420" y="300" width="80" height="56" fill="#e2e8f0"/>`,
  bulb: () => `<circle cx="400" cy="370" r="120" fill="url(#accent)"/><rect x="360" y="470" width="80" height="60" fill="#0b0f17"/><rect x="362" y="500" width="76" height="14" rx="7" fill="var(--c4,#22d3ee)"/><rect x="368" y="524" width="64" height="14" rx="7" fill="var(--c4,#22d3ee)"/><rect x="378" y="548" width="44" height="16" rx="8" fill="#94a3b8"/>`,
  megaphone: () => `<path d="M280 360 L470 300 L470 500 L280 440 Z" fill="url(#accent)"/><rect x="250" y="360" width="40" height="80" rx="8" fill="var(--c4,#22d3ee)"/><path d="M470 350 L470 450 C520 440 520 360 470 350 Z" fill="var(--c3,#FFD740)"/><path d="M520 300 C580 340 580 460 520 500" fill="none" stroke="var(--c4,#22d3ee)" stroke-width="14" stroke-linecap="round"/>`,
  phone: () => `<path d="M300 290 C290 280 320 250 345 270 L390 320 C405 335 395 355 385 365 C375 410 430 465 475 455 C485 445 505 435 520 450 L570 495 C590 520 560 550 550 540 C430 560 280 410 300 290 Z" fill="url(#accent)"/>`,
  envelope: () => `<rect x="250" y="300" width="300" height="200" rx="18" fill="url(#accent)"/><polyline points="250,320 400,420 550,320" fill="none" stroke="#0b0f17" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  calendar: () => `<rect x="260" y="290" width="280" height="240" rx="20" fill="none" stroke="url(#accent)" stroke-width="20"/><rect x="260" y="290" width="280" height="60" rx="20" fill="url(#accent)"/><line x1="320" y1="270" x2="320" y2="320" stroke="var(--c4,#22d3ee)" stroke-width="16" stroke-linecap="round"/><line x1="480" y1="270" x2="480" y2="320" stroke="var(--c4,#22d3ee)" stroke-width="16" stroke-linecap="round"/><polyline points="330,440 380,485 480,395" fill="none" stroke="var(--c4,#22d3ee)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`,
  gauge: () => `<path d="M250 470 A150 150 0 0 1 550 470" fill="none" stroke="#1f2a3d" stroke-width="40" stroke-linecap="round"/><path d="M250 470 A150 150 0 0 1 470 335" fill="none" stroke="url(#accent)" stroke-width="40" stroke-linecap="round"/><line x1="400" y1="470" x2="470" y2="360" stroke="var(--c4,#22d3ee)" stroke-width="18" stroke-linecap="round"/><circle cx="400" cy="470" r="26" fill="var(--c3,#FFD740)"/>`,
  gear: () => {
    let teeth = '';
    for (let i = 0; i < 8; i++) { const a = (i * 45) * Math.PI / 180; const x = 400 + Math.cos(a) * 175, y = 400 + Math.sin(a) * 175; teeth += `<rect x="${(x - 26).toFixed(0)}" y="${(y - 26).toFixed(0)}" width="52" height="52" rx="10" fill="url(#accent)" transform="rotate(${i * 45} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
    return `${teeth}<circle cx="400" cy="400" r="135" fill="url(#accent)"/><circle cx="400" cy="400" r="64" fill="#0b0f17"/>`;
  },
  shield: () => `<path d="M400 250 L530 300 L530 410 C530 500 470 545 400 575 C330 545 270 500 270 410 L270 300 Z" fill="url(#accent)"/><polyline points="345,400 388,448 470,350" fill="none" stroke="#0b0f17" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>`,
  flag: () => `<rect x="300" y="260" width="16" height="300" rx="8" fill="#94a3b8"/><path d="M316 270 L540 270 C500 320 540 360 540 360 L316 360 Z" fill="url(#accent)"/>`,
  key: () => `<circle cx="350" cy="380" r="90" fill="none" stroke="url(#accent)" stroke-width="34"/><circle cx="350" cy="380" r="28" fill="#0b0f17"/><rect x="430" y="362" width="170" height="34" rx="8" fill="url(#accent)"/><rect x="540" y="396" width="30" height="48" rx="6" fill="url(#accent)"/><rect x="490" y="396" width="26" height="40" rx="6" fill="url(#accent)"/>`,
  compass: () => `<circle cx="400" cy="400" r="175" fill="none" stroke="url(#accent)" stroke-width="24"/><path d="M400 290 L440 400 L400 510 L360 400 Z" fill="var(--c4,#22d3ee)"/><path d="M400 290 L440 400 L360 400 Z" fill="var(--c3,#FFD740)"/><circle cx="400" cy="400" r="20" fill="#0b0f17"/>`,
  arrow: () => `<path d="M300 500 L470 330" fill="none" stroke="url(#accent)" stroke-width="40" stroke-linecap="round"/><path d="M380 300 L520 300 L520 440 Z" fill="var(--c4,#22d3ee)"/>`,
};
function renderIcon(s) {
  const W = 800, H = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f17"/><stop offset="1" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8C1A"/><stop offset="0.5" stop-color="#E8710A"/><stop offset="1" stop-color="var(--c3,#FFD740)"/></linearGradient>
  </defs>
  <rect x="40" y="40" width="720" height="720" rx="80" fill="url(#bg)" stroke="#1e293b" stroke-width="4"/>
  ${ICONS[s.shape]()}
</svg>`;
}

function renderMeme(s) {
  const W = 1200, H = 1200;
  const top = s.top, bot = s.bottom;
  const tfs = fit(top.reduce((a, b) => a.length > b.length ? a : b), 1080, 104, 0.56);
  const bfs = fit(bot.reduce((a, b) => a.length > b.length ? a : b), 1080, 100, 0.56);
  const topSvg = top.map((l, i) => `  <text x="600" y="${200 + i * (tfs + 8)}" text-anchor="middle" filter="url(#shadow)" font-family="${FONT}" font-size="${tfs}" font-weight="900" fill="#FFFFFF" letter-spacing="-1" stroke="#0b0f17" stroke-width="3" paint-order="stroke">${esc(l)}</text>`).join('\n');
  const botStartY = 1050 - (bot.length - 1) * (bfs + 8);
  const botSvg = bot.map((l, i) => `  <text x="600" y="${botStartY + i * (bfs + 8)}" text-anchor="middle" filter="url(#shadow)" font-family="${FONT}" font-size="${bfs}" font-weight="900" fill="#FFFFFF" letter-spacing="-1" stroke="#0b0f17" stroke-width="3" paint-order="stroke">${esc(l)}</text>`).join('\n');
  const pulse = s.motif === 'spike'
    ? '220,600 360,600 396,600 430,420 470,760 506,600 560,600 596,600 632,470 672,700 706,600 760,600 800,420 838,600 980,600'
    : '220,600 320,600 360,600 392,520 432,690 470,600 520,600 558,600 592,540 628,668 664,600 700,600 720,600 980,600';
  const label = s.motif === 'spike' ? '— PIPELINE DETECTED —' : '— NO PIPELINE DETECTED —';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${DEFS_GRADS(W, H, 0.5, 0.5, 0.6)}
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.85"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
${topSvg}
  <rect x="180" y="430" width="840" height="340" rx="28" fill="#0b0f17" stroke="#1e293b" stroke-width="4"/>
  <rect x="180" y="430" width="840" height="340" rx="28" fill="url(#glow)" opacity="0.5"/>
  <line x1="220" y1="600" x2="980" y2="600" stroke="#1e293b" stroke-width="2" stroke-dasharray="10 12"/>
  <polyline points="${pulse}" stroke="url(#accent)" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="980" cy="600" r="11" fill="var(--c3,#FFD740)"/>
  <text x="600" y="730" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="800" letter-spacing="8" fill="#94a3b8">${esc(label)}</text>
${botSvg}
${WORDMARK(1110, 1140, 24)}
</svg>`;
}

const RENDERERS = {
  banner: renderBanner, slideTitle: renderSlideTitle, slideDivider: renderSlideDivider,
  slideClosing: renderSlideClosing, infoFunnel: renderInfoFunnel, infoRows: renderInfoRows,
  quote: renderQuote, wall: renderWall, icon: renderIcon, meme: renderMeme,
};
const DIMS = {
  banner: [1584, 396], slideTitle: [1920, 1080], slideDivider: [1920, 1080], slideClosing: [1920, 1080],
  infoFunnel: [1080, 1350], infoRows: [1080, 1350], quote: [1080, 1080], wall: [2400, 3000],
  icon: [800, 800], meme: [1200, 1200],
};
// pillar category-slug per template
const CAT = {
  banner: 'linkedin-banner', slideTitle: 'slide', slideDivider: 'slide', slideClosing: 'slide',
  infoFunnel: 'infographic', infoRows: 'infographic', quote: 'quote-card', wall: 'wall-art',
  icon: 'clip-art', meme: 'meme',
};

// ── title + description per spec ────────────────────────────────────────────
function titleFor(s) {
  switch (s.tpl) {
    case 'banner': return (s.role ? s.role : `&ldquo;${plain(s.headline)}&rdquo;`) + ' — LinkedIn Banner';
    case 'slideTitle': return `${s.deck} — Title Slide`;
    case 'slideDivider': return `${plain(s.headline)} — Section Divider Slide`;
    case 'slideClosing': return `${plain(s.big)} — Closing Slide`;
    case 'infoFunnel':
    case 'infoRows': return `${s.heading} — Infographic`;
    case 'quote': return `“${plain(s.lines)}” — Quote Card`;
    case 'wall': return `“${plain(s.lines)}” — Sales Floor Print`;
    case 'icon': return `${s.name} — Icon / Clip Art`;
    case 'meme': return `“${plain(s.bottom)}” — Sales Meme`;
  }
}
function descFor(s) {
  const labels = (s.items || []).map(i => i.label);
  const list = labels.slice(0, 4).join(', ') + (labels.length > 4 ? ', and more' : '');
  switch (s.tpl) {
    case 'banner': return `A dark, on-brand LinkedIn banner — "${plain(s.headline)}" over a "${plain(s.sub)}" line with a pulse motif. Put it on your profile to signal what you do.`;
    case 'slideTitle': return `A clean 16:9 title slide — "${plain(s.titleLines)}" with a "${plain(s.sub)}" sub-line and pulse accent. Open your ${s.ctx} on a polished, on-brand note.`;
    case 'slideDivider': return `A 16:9 section-divider slide — an oversized "${plain(s.big)}" beside the "${plain(s.headline)}" header. Use it to move cleanly between the chapters of your deck.`;
    case 'slideClosing': return `A 16:9 closing slide — "${plain(s.big)}" with a pulse line and a "${plain(s.sub)}" line. End any presentation on a clean, confident note.`;
    case 'infoFunnel': return `A portrait infographic of ${lc(s.heading)} — ${list} — as clean labeled bands. Reuse it in decks or posts to explain how the flow works.`;
    case 'infoRows': return `A numbered portrait infographic — ${s.heading} — covering ${list}. Drop it into onboarding decks or a sales-process explainer for reps and buyers.`;
    case 'quote': return `A square social quote card — "${plain(s.lines)}" in the Pulse accent style. A shareable LinkedIn or Instagram graphic and a ready slide pull-quote.`;
    case 'wall': return `A bold printable poster — "${plain(s.lines)}" stacked in the Pulse accent gradient. Print it for the sales floor or your home office to keep energy up.`;
    case 'icon': return `A clean ${lc(s.name)} in the Pulse accent gradient on a dark tile. Drop it into slides, docs, dashboards, or diagrams wherever you need a ${s.kw} mark.`;
    case 'meme': return `A clean vector sales meme — "${plain(s.top)}" over "${plain(s.bottom)}" with a pulse-monitor motif. Light, shareable humor for your sales Slack or kickoff.`;
  }
}

// ── CONTENT: 200 specs ──────────────────────────────────────────────────────
const SPECS = [];
const add = (o) => SPECS.push(o);

// 40 LinkedIn banners (20 role-identity + 20 theme)
[
  ['VP of Sales', 'VP OF SALES', 'I own the number.', ['Forecast', 'Pipeline', 'Team']],
  ['Sales Director', 'SALES DIRECTOR', 'I run the sales floor.', ['Coach', 'Process', 'Results']],
  ['Account Executive', 'ACCOUNT EXECUTIVE', 'I close complex deals.', ['Discovery', 'Value', 'Close']],
  ['SDR / BDR', 'SALES DEVELOPMENT', 'I build the pipeline.', ['Outreach', 'Meetings', 'Momentum']],
  ['Sales Manager', 'SALES MANAGER', 'I make reps better.', ['Coach', 'Forecast', 'Win']],
  ['Sales Enablement', 'SALES ENABLEMENT', 'I make reps ready.', ['Onboard', 'Train', 'Certify']],
  ['Sales Engineer', 'SALES ENGINEERING', 'I make the demo land.', ['Discovery', 'Demo', 'Proof']],
  ['Customer Success', 'CUSTOMER SUCCESS', 'I make customers win.', ['Onboard', 'Adopt', 'Renew']],
  ['RevOps Manager', 'REVENUE OPERATIONS', 'I run the revenue engine.', ['Systems', 'Data', 'Forecast']],
  ['Sales Ops Analyst', 'SALES OPERATIONS', 'I turn data into decisions.', ['Reports', 'Insight', 'Action']],
  ['Demand Gen Leader', 'DEMAND GENERATION', 'I fill the top of funnel.', ['Reach', 'Capture', 'Convert']],
  ['Solutions Consultant', 'SOLUTIONS CONSULTING', 'I solve before I sell.', ['Listen', 'Map', 'Solve']],
  ['Channel Manager', 'CHANNEL SALES', 'I grow through partners.', ['Recruit', 'Enable', 'Scale']],
  ['Founder / CEO', 'FOUNDER &amp; CEO', 'I sell the vision.', ['Story', 'Traction', 'Trust']],
  ['Sales Coach', 'SALES COACHING', 'I build closers.', ['Mindset', 'Skill', 'Reps']],
  ['Renewals Manager', 'RENEWALS', 'I protect the revenue.', ['Adopt', 'Value', 'Renew']],
  ['Partnerships Lead', 'PARTNERSHIPS', 'I build the ecosystem.', ['Source', 'Co-sell', 'Grow']],
  ['Marketing Ops', 'MARKETING OPERATIONS', 'I make marketing measurable.', ['Track', 'Attribute', 'Optimize']],
  ['GTM Strategist', 'GO-TO-MARKET', 'I design the motion.', ['Segment', 'Message', 'Scale']],
  ['Inside Sales Rep', 'INSIDE SALES', 'I close from the desk.', ['Call', 'Qualify', 'Close']],
].forEach(([role, eyebrow, headline, sub]) => add({ tpl: 'banner', role, eyebrow, headline, sub }));

[
  ['SALES PHILOSOPHY', 'Pipeline is the product.', ['Activity', 'Pipeline', 'Revenue']],
  ['DISCOVERY FIRST', 'Sell the problem.', ['Discover', 'Diagnose', 'Solve']],
  ['HOW I SELL', 'Trusted advisor, not vendor.', ['Listen', 'Advise', 'Earn']],
  ['FORECAST DISCIPLINE', 'A forecast you can trust.', ['Inspect', 'Qualify', 'Commit']],
  ['WHAT WINS DEALS', 'Discovery wins deals.', ['Ask', 'Listen', 'Uncover']],
  ['HOW WE WORK', 'Process over pressure.', ['System', 'Cadence', 'Calm']],
  ['SALES MINDSET', 'Every no is data.', ['Test', 'Learn', 'Adjust']],
  ['SALES FLOOR', "Coffee's for closers.", ['Dial', 'Qualify', 'Close']],
  ['OPEN TO NEW ROLES', 'Open to work — Sales.', ['Hunter', 'Closer', 'Builder']],
  ['NOW HIRING', "We're hiring closers.", ['Join', 'Build', 'Win']],
  ['SALES TRUTH', 'Quota is a floor.', ['Set', 'Beat', 'Repeat']],
  ['SALES MINDSET', 'Activity creates luck.', ['Reps', 'Reach', 'Results']],
  ['REVOPS LAW', 'Data beats opinions.', ['Measure', 'Model', 'Decide']],
  ['DEAL STRATEGY', 'Champions sell for you.', ['Find', 'Arm', 'Trust']],
  ['SALES WISDOM', 'Slow is smooth, smooth is fast.', ['Plan', 'Prep', 'Perform']],
  ['GO-TO-MARKET', 'Revenue is a team sport.', ['Sales', 'Marketing', 'Success']],
  ['FOLLOW-UP', 'The fortune is in the follow-up.', ['Touch', 'Track', 'Close']],
  ['Q4 PUSH', 'Win the quarter.', ['Pipeline', 'Pace', 'Push']],
  ['HOW I OPERATE', "Build, don't chase.", ['System', 'Signal', 'Scale']],
  ['SELLING CREDO', 'First the trust, then the deal.', ['Listen', 'Help', 'Earn']],
].forEach(([eyebrow, headline, sub]) => add({ tpl: 'banner', role: null, headline, eyebrow, sub }));

// 35 slides: 20 title + 10 divider + 5 closing
[
  ['Monthly Business Review', 'MBR · 2027', ['Monthly Business', 'Review'], ['Pipeline', 'Bookings', 'Forecast'], 'monthly business review'],
  ['Sales Kickoff', 'SKO 2027', ['Sales Kickoff'], ['One Team', 'One Number'], 'sales kickoff'],
  ['Pipeline Review', 'WEEKLY', ['Pipeline Review'], ['Inspect', 'Qualify', 'Commit'], 'pipeline review'],
  ['Forecast Call', 'WEEKLY', ['Forecast Call'], ['Commit', 'Best Case', 'Pipeline'], 'forecast call'],
  ['Win / Loss Review', 'QUARTERLY', ['Win / Loss Review'], ['Why We Win', 'Why We Lose'], 'win/loss review'],
  ['Revenue Review (Board)', 'BOARD MEETING', ['Revenue Review'], ['Growth', 'Efficiency', 'Retention'], 'board revenue review'],
  ['Annual Sales Planning', 'FY2027', ['Annual Sales Planning'], ['Targets', 'Territories', 'Headcount'], 'annual planning session'],
  ['Territory & Quota Planning', 'FY2027', ['Territory & Quota', 'Planning'], ['Coverage', 'Capacity', 'Quota'], 'planning session'],
  ['Comp Plan Rollout', 'FY2027', ['Comp Plan Rollout'], ['Quota', 'Accelerators', 'Payout'], 'comp plan rollout'],
  ['Sales Onboarding', 'WEEK ONE', ['Sales Onboarding'], ['Product', 'Process', 'Pitch'], 'new-hire onboarding'],
  ['Product Launch (GTM)', 'GO-TO-MARKET', ['Product Launch'], ['Positioning', 'Pricing', 'Playbook'], 'launch kickoff'],
  ['Deal Review', 'DEAL DESK', ['Deal Review'], ['MEDDIC', 'Risk', 'Next Steps'], 'deal review'],
  ['Account Plan', 'STRATEGIC ACCOUNT', ['Account Plan'], ['Map', 'Whitespace', 'Expand'], 'account planning session'],
  ['Executive Briefing', 'EXECUTIVE BRIEFING', ['Executive Briefing'], ['Vision', 'Value', 'Roadmap'], 'executive briefing'],
  ['Customer QBR', 'CUSTOMER QBR', ['Quarterly Business', 'Review'], ['Outcomes', 'Adoption', 'Roadmap'], 'customer QBR'],
  ['Discovery Call', 'DISCOVERY', ['Discovery Call'], ['Goals', 'Gaps', 'Impact'], 'discovery call'],
  ['Your Proposal', 'PROPOSAL', ['Your Proposal'], ['Solution', 'Value', 'Investment'], 'proposal review'],
  ['Sales Training', 'ENABLEMENT', ['Sales Training'], ['Skill', 'Drill', 'Reps'], 'training session'],
  ['Demand Gen Review', 'MARKETING', ['Demand Gen Review'], ['Leads', 'MQLs', 'Pipeline'], 'demand gen review'],
  ['RevOps Review', 'REVENUE OPERATIONS', ['RevOps Review'], ['Systems', 'Data', 'Process'], 'RevOps review'],
].forEach(([deck, eyebrow, titleLines, sub, ctx]) => add({ tpl: 'slideTitle', deck, eyebrow, titleLines, sub, ctx }));

[
  ['01', 'Agenda'], ['02', 'Pipeline'], ['03', 'Forecast'], ['04', 'Performance'], ['05', 'Next Steps'],
  ['01', 'Where We Are'], ['02', 'What Changed'], ['03', 'The Plan'], ['04', 'The Ask'], ['Q&A', 'Questions'],
].forEach(([big, headline]) => add({ tpl: 'slideDivider', big, headline }));

[
  ['Thank you.', "Let's build pipeline together.", 'Questions?'],
  ["Let's talk.", 'Book time with the team.', 'Get in touch'],
  ['Questions?', "We've got answers.", ''],
  ['Go win.', 'One team. One number.', ''],
  ['Next steps.', 'Align · Decide · Move', ''],
].forEach(([big, sub, prompt]) => add({ tpl: 'slideClosing', big, sub, prompt }));

// 30 infographics: 8 funnels + 22 numbered rows
const F = (eyebrow, heading, items) => add({ tpl: 'infoFunnel', eyebrow, heading, items });
F('MARKETING', 'The Marketing Funnel', [{ label: 'Awareness', sub: 'Reach the right audience' }, { label: 'Interest', sub: 'Earn attention and clicks' }, { label: 'Consideration', sub: 'Nurture toward intent' }, { label: 'Conversion', sub: 'Turn interest into pipeline' }]);
F('SALES', 'The Sales Funnel', [{ label: 'Leads', sub: 'Raw top-of-funnel volume' }, { label: 'MQLs', sub: 'Marketing-qualified interest' }, { label: 'SQLs', sub: 'Sales-accepted opportunities' }, { label: 'Proposals', sub: 'Active, late-stage deals' }, { label: 'Wins', sub: 'Closed-won revenue' }]);
F('GROWTH METRICS', 'Pirate Metrics (AARRR)', [{ label: 'Acquisition', sub: 'How users find you' }, { label: 'Activation', sub: 'First great experience' }, { label: 'Retention', sub: 'They keep coming back' }, { label: 'Referral', sub: 'They tell others' }, { label: 'Revenue', sub: 'They pay and expand' }]);
F('DEMAND', 'The Demand Waterfall', [{ label: 'Inquiry', sub: 'Top-of-funnel interest' }, { label: 'MQL', sub: 'Marketing-qualified' }, { label: 'SAL', sub: 'Sales-accepted' }, { label: 'SQL', sub: 'Sales-qualified' }, { label: 'Won', sub: 'Closed revenue' }]);
F('CUSTOMER JOURNEY', 'The Customer Journey', [{ label: 'Aware', sub: 'Discovers the problem' }, { label: 'Evaluate', sub: 'Compares solutions' }, { label: 'Buy', sub: 'Commits and signs' }, { label: 'Adopt', sub: 'Gets to value' }, { label: 'Advocate', sub: 'Refers and expands' }]);
F('RECRUITING', 'The Sales Hiring Funnel', [{ label: 'Sourced', sub: 'Candidates in pipeline' }, { label: 'Screened', sub: 'Phone screen passed' }, { label: 'Interviewed', sub: 'Onsite or panel' }, { label: 'Offer', sub: 'Offer extended' }, { label: 'Hired', sub: 'Signed and ramping' }]);
F('SAAS GROWTH', 'The SaaS Growth Funnel', [{ label: 'Visitor', sub: 'Lands on the site' }, { label: 'Signup', sub: 'Creates an account' }, { label: 'Activated', sub: 'Hits the aha moment' }, { label: 'Paid', sub: 'Converts to paid' }, { label: 'Expanded', sub: 'Upgrades and grows' }]);
F('LIFECYCLE', 'The Lead Lifecycle', [{ label: 'Anonymous', sub: 'Unknown traffic' }, { label: 'Known', sub: 'Identified contact' }, { label: 'Engaged', sub: 'Showing intent' }, { label: 'Qualified', sub: 'Ready for sales' }, { label: 'Customer', sub: 'Closed and onboarded' }]);

const R = (eyebrow, heading, items) => add({ tpl: 'infoRows', eyebrow, heading, items });
R('QUALIFICATION', 'MEDDIC Qualification', [{ label: 'Metrics', sub: 'Quantify the economic impact' }, { label: 'Economic Buyer', sub: 'Find who controls the budget' }, { label: 'Decision Criteria', sub: 'Know how they will choose' }, { label: 'Decision Process', sub: 'Map the steps to signature' }, { label: 'Identify Pain', sub: 'Anchor on real business pain' }, { label: 'Champion', sub: 'Build an internal advocate' }]);
R('QUALIFICATION', 'BANT Qualification', [{ label: 'Budget', sub: 'Can they fund a solution?' }, { label: 'Authority', sub: 'Who signs the deal?' }, { label: 'Need', sub: 'Is the pain real and urgent?' }, { label: 'Timing', sub: 'When will they decide?' }]);
R('DISCOVERY', 'SPIN Selling', [{ label: 'Situation', sub: 'Understand their current state' }, { label: 'Problem', sub: 'Surface the real difficulties' }, { label: 'Implication', sub: 'Explore the cost of inaction' }, { label: 'Need-Payoff', sub: 'Let them sell themselves' }]);
R('METHODOLOGY', 'The Challenger Sale', [{ label: 'Teach', sub: 'Reframe the way they think' }, { label: 'Tailor', sub: 'Speak to each stakeholder' }, { label: 'Take Control', sub: 'Lead the deal with confidence' }]);
R('TEAM HEALTH', '5 Dysfunctions of a Team', [{ label: 'Absence of Trust', sub: 'Build vulnerability-based trust' }, { label: 'Fear of Conflict', sub: 'Welcome productive debate' }, { label: 'Lack of Commitment', sub: 'Get real buy-in' }, { label: 'Avoiding Accountability', sub: 'Hold the standard' }, { label: 'Inattention to Results', sub: 'Win as a team' }]);
R('FORECASTING', '4 Forecast Categories', [{ label: 'Commit', sub: 'Will close — bet on it' }, { label: 'Best Case', sub: 'Upside if things go right' }, { label: 'Pipeline', sub: 'Active but unqualified to commit' }, { label: 'Omitted', sub: 'Not this period' }]);
R('PIPELINE MATH', 'The 3 Pipeline Levers', [{ label: 'Volume', sub: 'How many deals you create' }, { label: 'Conversion', sub: 'How many you win' }, { label: 'Velocity', sub: 'How fast they close' }]);
R('DISCOVERY', 'Discovery Questions That Win', [{ label: 'Goals', sub: 'What are you trying to achieve?' }, { label: 'Gaps', sub: "What's getting in the way?" }, { label: 'Impact', sub: 'What does it cost you?' }, { label: 'Timeline', sub: 'When does this need to change?' }, { label: 'Decision', sub: 'How will you decide?' }]);
R('OUTBOUND', 'The Cold Call Framework', [{ label: 'Open', sub: 'Earn the first 10 seconds' }, { label: 'Reason', sub: 'Why you are calling' }, { label: 'Question', sub: 'Provoke a real conversation' }, { label: 'Value', sub: 'Tease a relevant insight' }, { label: 'Ask', sub: 'Book the next step' }]);
R('OBJECTIONS', '5 Steps to Handle Any Objection', [{ label: 'Listen', sub: 'Let them finish completely' }, { label: 'Clarify', sub: 'Ask what they really mean' }, { label: 'Empathize', sub: 'Acknowledge the concern' }, { label: 'Respond', sub: 'Address it with evidence' }, { label: 'Confirm', sub: 'Check that it landed' }]);
R('DEMO', 'The Perfect Demo', [{ label: 'Discover', sub: 'Earn the right to show' }, { label: 'Tailor', sub: 'Show only what matters' }, { label: 'Show', sub: 'Lead with the payoff' }, { label: 'Prove', sub: 'Back it with proof' }, { label: 'Advance', sub: 'Lock the next step' }]);
R("BUYER'S JOURNEY", '5 Stages of the Buyer’s Journey', [{ label: 'Awareness', sub: 'Realizes there is a problem' }, { label: 'Consideration', sub: 'Researches the options' }, { label: 'Decision', sub: 'Chooses a solution' }, { label: 'Onboarding', sub: 'Implements and adopts' }, { label: 'Advocacy', sub: 'Renews and refers' }]);
R('OUTBOUND', '6 Sales Email Rules', [{ label: 'Keep It Short', sub: 'Five sentences or fewer' }, { label: 'Make It Personal', sub: 'Reference their world' }, { label: 'One Ask', sub: 'A single clear next step' }, { label: 'Lead With Value', sub: 'Give before you take' }, { label: 'Easy Yes', sub: 'Lower the friction' }, { label: 'Follow Up', sub: 'Persistence pays' }]);
R('CADENCE', 'The Weekly Rep Cadence', [{ label: 'Prospect', sub: 'Create new pipeline' }, { label: 'Progress', sub: 'Move deals forward' }, { label: 'Close', sub: 'Drive deals to signature' }, { label: 'Forecast', sub: 'Inspect and commit' }, { label: 'Learn', sub: 'Review wins and losses' }]);
R('REVOPS', '4 Pillars of RevOps', [{ label: 'People', sub: 'Roles, skills, and structure' }, { label: 'Process', sub: 'Repeatable revenue motion' }, { label: 'Technology', sub: 'The connected tech stack' }, { label: 'Data', sub: 'One source of truth' }]);
R('ONBOARDING', 'The 30-60-90 Ramp', [{ label: 'Learn (0-30)', sub: 'Product, process, and pitch' }, { label: 'Apply (31-60)', sub: 'Shadow, role-play, first calls' }, { label: 'Own (61-90)', sub: 'Carry pipeline and quota' }]);
R('STAKEHOLDERS', '4 Types of Buyers', [{ label: 'Economic Buyer', sub: 'Controls the budget' }, { label: 'Technical Buyer', sub: 'Vets the requirements' }, { label: 'User Buyer', sub: 'Lives with the tool daily' }, { label: 'Coach', sub: 'Guides you from inside' }]);
R('VALUE SELLING', 'The Value Selling Ladder', [{ label: 'Feature', sub: 'What the product does' }, { label: 'Benefit', sub: 'Why that matters' }, { label: 'Outcome', sub: 'The result it drives' }, { label: 'Impact', sub: 'The business effect' }, { label: 'Vision', sub: 'The bigger future' }]);
R('DEAL HEALTH', '5 Signs a Deal Is Real', [{ label: 'Pain', sub: 'A real, urgent problem' }, { label: 'Power', sub: 'Access to the decision-maker' }, { label: 'Process', sub: 'A known buying process' }, { label: 'Plan', sub: 'A mutual action plan' }, { label: 'Paper', sub: 'Procurement and legal in motion' }]);
R('NEGOTIATION', 'The Negotiation Checklist', [{ label: 'Anchor', sub: 'Set the frame first' }, { label: 'Trade', sub: 'Never give without a get' }, { label: 'Silence', sub: 'Let the pause do the work' }, { label: 'Summarize', sub: 'Confirm what is agreed' }, { label: 'Sign', sub: 'Make it easy to commit' }]);
R('RETENTION', 'The Renewal Playbook', [{ label: 'Adopt', sub: 'Drive real usage early' }, { label: 'Review', sub: 'Show value at the QBR' }, { label: 'Expand', sub: 'Find the next use case' }, { label: 'Renew', sub: 'Lock the next term' }]);
R('PROSPECTING', 'The Ideal Customer Profile', [{ label: 'Firmographics', sub: 'Industry, size, and geography' }, { label: 'Pain', sub: 'The problem you solve best' }, { label: 'Triggers', sub: 'Events that create urgency' }, { label: 'Fit', sub: 'Where you win and keep' }]);

// 35 quote cards
const Q = (lines, accentLine) => add({ tpl: 'quote', lines, accentLine });
Q(['Sell the problem,', 'not the product.'], 1);
Q(['No decision', 'is your real', 'competitor.'], 2);
Q(['The best discovery', 'feels like', 'free therapy.'], 1);
Q(['A forecast is', 'a promise,', 'not a guess.'], 1);
Q(['Activity', 'creates', 'luck.'], 2);
Q(['Slow is smooth.', 'Smooth is fast.'], 1);
Q(['Hire slow.', 'Ramp fast.'], 1);
Q(['Champions sell', "when you're not", 'in the room.'], 2);
Q(['Process scales.', "Heroics don't."], 1);
Q(['Data beats', 'opinions.'], 1);
Q(['Every no is', 'closer to', 'a yes.'], 2);
Q(['Price is what', 'you pay.', 'Value is what', 'you get.'], 3);
Q(['The fortune is', 'in the', 'follow-up.'], 2);
Q(["You can't shrink", 'your way', 'to growth.'], 2);
Q(['Listen more.', 'Pitch less.'], 1);
Q(['People buy', 'outcomes,', 'not features.'], 1);
Q(['The riches are', 'in the niches.'], 1);
Q(['Discovery', 'is the deal.'], 1);
Q(['Sell the meeting,', 'not the demo.'], 1);
Q(['A confused buyer', 'never buys.'], 1);
Q(['Make the buyer', 'the hero.'], 1);
Q(['Qualify hard.', 'Close easy.'], 1);
Q(['Pressure off.', 'Pipeline on.'], 1);
Q(['Deals stall', 'where the value', 'is unclear.'], 2);
Q(['Trust compounds.', 'So does', 'pipeline.'], 2);
Q(['Ask better', 'questions.'], 1);
Q(["Don't pitch.", 'Diagnose.'], 1);
Q(['Revenue follows', 'relationships.'], 1);
Q(['Coachable beats', 'talented.'], 1);
Q(['Your pipeline is', 'your paycheck.'], 1);
Q(['Show up.', 'Follow up.', 'Close.'], 2);
Q(['The next call', 'is the most', 'important one.'], 2);
Q(['Be the signal,', 'not the noise.'], 1);
Q(['Win the week.', 'The quarter', 'wins itself.'], 2);
Q(['Sell like', "you'd want", 'to be sold to.'], 2);

// 25 wall-art prints
const WA = (eyebrow, lines) => add({ tpl: 'wall', eyebrow, lines });
WA('SALES FLOOR LAW', ['MAKE', 'THE', 'CALLS']);
WA('DAILY REMINDER', ['FILL', 'THE', 'FUNNEL']);
WA('REVOPS LAW', ['TRUST', 'THE', 'PROCESS']);
WA('SALES FLOOR', ['EARN', 'THE', 'RIGHT']);
WA('PIPELINE LAW', ['MORE', 'PIPELINE', 'LESS PANIC']);
WA('DISCOVERY FIRST', ['ASK', 'BETTER', 'QUESTIONS']);
WA("CLOSER'S CREED", ['EARN', 'EVERY', 'YES']);
WA('THE DAILY THREE', ['SHOW UP', 'FOLLOW UP', 'CLOSE']);
WA('SALES TRUTH', ['ACTIVITY', 'PIPELINE', 'REVENUE']);
WA('SALES MINDSET', ['CHASE', 'THE', 'NO']);
WA('FORECAST LAW', ['COMMIT', 'MEANS', 'COMMIT']);
WA('PERSISTENCE', ['STAY', 'IN THE', 'DEAL']);
WA('TEAM LAW', ['ONE TEAM', 'ONE', 'NUMBER']);
WA('FOCUS', ['PROGRESS', 'EVERY', 'DEAL']);
WA('QUOTA', ['QUOTA', 'IS A', 'FLOOR']);
WA('BRING IT', ['BRING', 'THE', 'ENERGY']);
WA('DISCIPLINE', ['DO', 'THE REPS']);
WA('FOLLOW-UP', ['FOLLOW', 'UP', 'AGAIN']);
WA('COMPOUNDING', ['TRUST', 'COMPOUNDS']);
WA('WIN', ['WIN', 'THE', 'DAY']);
WA('OWNERSHIP', ['OWN', 'THE', 'NUMBER']);
WA('VALUE', ['SELL', 'THE', 'VALUE']);
WA('CADENCE', ['KEEP', 'THE', 'CADENCE']);
WA('RESILIENCE', ['NEXT', 'CALL', 'WINS']);
WA('PURPOSE', ['HELP', 'FIRST']);

// 20 clip-art icons
const IC = (shape, name, kw) => add({ tpl: 'icon', shape, name, kw });
IC('target', 'Target / Goal Icon', 'goal');
IC('barchart', 'Growth Bar Chart Icon', 'growth');
IC('linechart', 'Revenue Trend Icon', 'trend');
IC('coin', 'Revenue / Money Icon', 'revenue');
IC('rocket', 'Launch / Growth Rocket Icon', 'launch');
IC('trophy', 'Win / Trophy Icon', 'win');
IC('check', 'Closed-Won Check Icon', 'closed-won');
IC('magnet', 'Lead Magnet Icon', 'lead-gen');
IC('bulb', 'Idea / Insight Icon', 'insight');
IC('megaphone', 'Outreach / Announce Icon', 'outreach');
IC('phone', 'Cold Call / Dialer Icon', 'call');
IC('envelope', 'Sales Email Icon', 'email');
IC('calendar', 'Booked Meeting Icon', 'meeting');
IC('gauge', 'KPI Gauge Icon', 'KPI');
IC('gear', 'RevOps / Process Icon', 'process');
IC('shield', 'Retention / Trust Shield Icon', 'retention');
IC('flag', 'Milestone / Goal Flag Icon', 'milestone');
IC('key', 'Key Account Icon', 'key-account');
IC('compass', 'GTM Strategy Compass Icon', 'strategy');
IC('arrow', 'Pipeline Growth Arrow Icon', 'growth');

// 15 memes
const ME = (top, bottom, motif) => add({ tpl: 'meme', top, bottom, motif });
ME(['FORECAST SAYS 90%'], ['DEAL SLIPS TO', 'NEXT QUARTER'], 'flat');
ME(['JUST CIRCLING BACK'], ['FOR THE 6TH TIME'], 'flat');
ME(['VERBAL YES FRIDAY'], ['GHOSTED BY MONDAY'], 'flat');
ME(['THEY OPENED MY EMAIL'], ['12 TIMES. NO REPLY.'], 'flat');
ME(['END OF QUARTER'], ['SUDDENLY EVERYONE', 'REPLIES'], 'spike');
ME(['DISCOVERY CALL'], ['FREE CONSULTING', 'SESSION'], 'flat');
ME(['"NO BUDGET," THEY SAID'], ['BOUGHT THE', 'COMPETITOR'], 'flat');
ME(['UPDATING THE CRM'], ['...AFTER THE DEAL', 'CLOSES'], 'flat');
ME(['ONE MORE FOLLOW-UP'], ['SHOULD DO IT'], 'spike');
ME(['PIPELINE REVIEW MONDAY'], ['PANIC SUNDAY NIGHT'], 'flat');
ME(["IT'S NOT A NO"], ["IT'S A NOT YET"], 'spike');
ME(['QUOTA RESETS'], ['EVERY. SINGLE.', 'MONTH.'], 'flat');
ME(['"SEND ME SOME INFO"'], ['THE KISS OF DEATH'], 'flat');
ME(['DEAL: CLOSED WON'], ['FINANCE: NOT YET'], 'flat');
ME(['NEW LOGO LANDED'], ['TIME TO DO', 'IT AGAIN'], 'spike');

// ── assign ids + finalize ───────────────────────────────────────────────────
SPECS.forEach((s, i) => {
  s.id = id4(START_NUM + i);
  s.cat = CAT[s.tpl];
  s.title = titleFor(s).replace(/&ldquo;|&rdquo;/g, '"');
  s.desc = descFor(s);
});

// ── modes ───────────────────────────────────────────────────────────────────
function genAll() {
  if (!fs.existsSync(ASSET_DIR)) fs.mkdirSync(ASSET_DIR, { recursive: true });
  let n = 0;
  for (const s of SPECS) {
    const svg = injectTheme(RENDERERS[s.tpl](s), pickPalette(s.id));
    fs.writeFileSync(path.join(ASSET_DIR, s.id + '.svg'), svg, 'utf8');
    n++;
  }
  console.log(`generated ${n} SVGs (${SPECS[0].id}..${SPECS[SPECS.length - 1].id}) -> ${ASSET_DIR}`);
}

async function publishAll() {
  // load env for blob token
  try {
    const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    for (const line of env.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
  const { getStore } = require('@netlify/blobs');
  const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
  const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const urls = [];
  let done = 0;
  for (const s of SPECS) {
    const [W, H] = DIMS[s.tpl];
    const labels = { 'linkedin-banner': 'LinkedIn Banner', 'slide': 'Presentation Slide', 'infographic': 'Infographic', 'quote-card': 'Quote Card', 'wall-art': 'Wall Art / Printable', 'clip-art': 'Clip Art', 'meme': 'Meme' };
    const CATEGORY_LABEL = labels[s.cat] || 'Graphic';
    const ASSET_REL = `/graphics/assets/${s.id}.svg`;
    const now = Date.now();
    const TAGS = Array.from(new Set(['graphic', s.cat, 'free-download', 'revops-graphics', 'presentation-graphics']));
    const body =
`### ${s.title}

[![${s.title}](${ASSET_REL})](${ASSET_REL})

${s.desc}

**Format:** SVG (scalable vector) · **Size:** ${W}×${H} px · **Category:** ${CATEGORY_LABEL} · **License:** Free to use — no attribution required.

[⬇ Download this graphic](${ASSET_REL})

## Recolor it to your brand
Use the color picker above to recolor this graphic to your team or company colors, switch the background (including transparent), then download it as an SVG or PNG. No sign-up, no watermark.

## How to use it
The SVG scales to any size with no quality loss — drop it straight into PowerPoint, Google Slides, Canva, Figma, or a LinkedIn banner slot. The PNG export is ready to upload anywhere that wants a raster image.

## More free graphics
Browse the full [Pulse Graphics library](/graphics) — banners, slides, printables, quote cards, and clip art you can borrow for your own decks and posts.`;

    const entry = {
      id: s.id, question: s.title, answer: body, tags: TAGS,
      quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now,
      model: 'claude-opus-4-7', gold_format: true,
      graphic: { category: s.cat, category_label: CATEGORY_LABEL, asset: ASSET_REL, width: W, height: H },
    };
    await store.setJSON(`answers/${s.id}.json`, entry);
    const i = idx.entries.findIndex(e => e && e.id === s.id);
    const row = { id: s.id, question: s.title, tags: TAGS, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
    if (i >= 0) idx.entries.splice(i, 1);
    idx.entries.unshift(row);
    urls.push(`https://pulserevops.com/graphics/${s.id}`, `https://pulserevops.com/graphics/${s.id}/reviews`);
    done++;
    if (done % 25 === 0) console.log(`  wrote ${done}/${SPECS.length}`);
  }
  await store.setJSON('_index.json', idx);
  console.log(`published ${done} entries; index now has ${idx.entries.length} total`);
  const r = await pingIndexNowUrlList(urls);
  console.log('indexnow batch:', JSON.stringify(r));
}

(async () => {
  const mode = process.argv[2] || 'gen';
  if (mode === 'gen' || mode === 'both') genAll();
  if (mode === 'publish' || mode === 'both') await publishAll();
})().catch(e => { console.error('ERR', e && e.stack || e); process.exit(1); });
