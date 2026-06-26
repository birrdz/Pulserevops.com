// LinkedIn banner / wallpaper batch: gb0221-gb0420 (200 covers, 1584x396).
// All category 'linkedin-banner' so they float to the top of /graphics.
// 14 visual styles (6 text-forward + 8 wallpaper-forward) x 3 colour schemes.
//
//   node _gb_banners.js gen      -> write all SVG assets to graphics/assets/
//   node _gb_banners.js publish  -> write all blob entries + batch IndexNow
//   node _gb_banners.js both
const fs = require('fs');
const path = require('path');
const { PALETTES, paletteVars } = require('./graphics-palettes.js');

const ASSET_DIR = path.join(__dirname, 'graphics', 'assets');
const START_NUM = 221;
function pickPalette(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return PALETTES[h % PALETTES.length]; }
function injectTheme(s, pal) { return s.replace(/(<svg[^>]*>)/, `$1\n  <style>svg{${paletteVars(pal)}}</style>`); }
const FONT = "'Inter','Segoe UI',system-ui,Arial,sans-serif";
const W = 1584, H = 396, CX = 792;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function plain(x) { return (Array.isArray(x) ? x.join(' ') : String(x)).replace(/\s+/g, ' ').trim(); }
function id4(n) { return 'gb' + String(n).padStart(4, '0'); }
function fit(text, maxW, maxSize, factor) {
  factor = factor || 0.60; const len = String(text).length || 1;
  return Math.max(8, Math.min(maxSize, Math.floor(maxW / (len * factor))));
}
function ekg(x0, x1, y, amp) {
  const w = x1 - x0;
  const pts = [[0, 0], [0.28, 0], [0.32, -0.35], [0.385, 1], [0.45, -0.7], [0.5, 0], [0.64, 0], [0.68, -0.35], [0.745, 1], [0.81, -0.7], [0.86, 0], [1, 0]];
  return pts.map(([fx, fy]) => `${Math.round(x0 + fx * w)},${Math.round(y - fy * amp)}`).join(' ');
}
function middots(parts) { return parts.map(esc).join(' <tspan fill="url(#accent)">&#183;</tspan> '); }
const WORDMARK = () => '';

function defsBanner(scheme, gx, gy, gr, extra) {
  return `  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--bg1,#0b0f17)"/><stop offset="1" style="stop-color:var(--bg2,#0f172a)"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)"/><stop offset="0.55" style="stop-color:var(--c2,#E8710A)"/><stop offset="1" style="stop-color:var(--c3,#FFD740)"/></linearGradient>
    <linearGradient id="accent2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--c4,#22d3ee)"/><stop offset="1" style="stop-color:var(--c4b,#67e8f9)"/></linearGradient>
    <radialGradient id="glow" cx="${gx}" cy="${gy}" r="${gr}"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.18"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/></radialGradient>${extra || ''}
  </defs>`;
}
const BG = `  <rect width="${W}" height="${H}" fill="url(#bg)"/>\n  <rect width="${W}" height="${H}" fill="url(#glow)"/>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${body}\n</svg>`;

function chip(text, cy, fs, maxW) {
  const f = fit(text, maxW || 1180, fs, 0.58);
  const w = Math.round(text.length * f * 0.58) + 90;
  const x = CX - w / 2;
  return `  <rect x="${x}" y="${Math.round(cy - f * 0.82 - 16)}" width="${w}" height="${Math.round(f * 1.25 + 28)}" rx="${Math.round((f * 1.25 + 28) / 2)}" fill="#0b0f17" opacity="0.6" stroke="url(#accent)" stroke-width="2"/>
  <text x="${CX}" y="${Math.round(cy)}" text-anchor="middle" font-family="${FONT}" font-size="${f}" font-weight="800" fill="#FFFFFF">${esc(text)}</text>`;
}
function wavePath(yMid, amp, waves, phase, close) {
  let d = `M0,${yMid.toFixed(1)}`; const steps = 48;
  for (let i = 1; i <= steps; i++) { const x = W * i / steps; const y = yMid + amp * Math.sin(phase + (i / steps) * waves * 2 * Math.PI); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
  if (close) d += ` L${W},${H} L0,${H} Z`;
  return d;
}

// ── TEXT-FORWARD STYLES ─────────────────────────────────────────────────────
function spotlight(s) {
  const hs = fit(s.headline, 1410, 78, 0.58);
  return svg(`${defsBanner(s.scheme, 0.8, 0.28, 0.55)}
${BG}
  <polyline points="${ekg(900, 1520, 86, 56)}" stroke="url(#accent)" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <text x="90" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="88" y="${150 + hs - 6}" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <text x="90" y="330" font-family="${FONT}" font-size="30" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>
${WORDMARK(1496, 350)}`);
}
function centered(s) {
  const hs = fit(s.headline, 1380, 72, 0.57);
  return svg(`${defsBanner(s.scheme, 0.5, 0.3, 0.6)}
${BG}
  <text x="${CX}" y="120" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="8" fill="url(#accent)">${esc(s.eyebrow)}</text>
  <text x="${CX}" y="${120 + hs - 4}" text-anchor="middle" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <polyline points="${ekg(CX - 200, CX + 200, 120 + hs + 36, 34)}" stroke="url(#accent)" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <text x="${CX}" y="350" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>`);
}
function leftbar(s) {
  const hs = fit(s.headline, 1360, 76, 0.58);
  return svg(`${defsBanner(s.scheme, 0.85, 0.3, 0.5)}
${BG}
  <rect x="0" y="0" width="26" height="${H}" fill="url(#accent)"/>
  <text x="130" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="128" y="${150 + hs - 6}" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <text x="130" y="330" font-family="${FONT}" font-size="30" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>
${WORDMARK(1496, 350)}`);
}
function quoteStyle(s) {
  const hs = fit(s.headline, 1180, 64, 0.56);
  return svg(`${defsBanner(s.scheme, 0.2, 0.3, 0.55)}
${BG}
  <text x="70" y="250" font-family="${FONT}" font-size="240" font-weight="900" fill="url(#accent)" opacity="0.9">&#8220;</text>
  <text x="300" y="${175 + hs * 0.34}" font-family="${FONT}" font-size="${hs}" font-weight="800" fill="#FFFFFF" letter-spacing="-1">${esc(s.headline)}</text>
  <text x="300" y="300" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="2" fill="#94a3b8">${middots(s.sub)}</text>
${WORDMARK(1496, 350)}`);
}
function panel(s) {
  const hs = fit(s.headline, 1300, 70, 0.57);
  return svg(`${defsBanner(s.scheme, 0.7, 0.25, 0.6)}
${BG}
  <rect x="64" y="60" width="1456" height="276" rx="28" fill="#0b0f17" opacity="0.55" stroke="url(#accent)" stroke-width="2"/>
  <text x="110" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="url(#accent)">${esc(s.eyebrow)}</text>
  <text x="108" y="${150 + hs - 6}" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <text x="110" y="308" font-family="${FONT}" font-size="28" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>
${WORDMARK(1474, 322)}`);
}
function underline(s) {
  const hs = fit(s.headline, 1380, 72, 0.57);
  const uw = Math.min(640, s.headline.length * hs * 0.5);
  return svg(`${defsBanner(s.scheme, 0.5, 0.25, 0.6, `\n    <pattern id="dots" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#16202f"/></pattern>`)}
${BG}
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <text x="${CX}" y="120" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="8" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="${CX}" y="${120 + hs - 4}" text-anchor="middle" font-family="${FONT}" font-size="${hs}" font-weight="900" fill="#FFFFFF">${esc(s.headline)}</text>
  <rect x="${CX - uw / 2}" y="${120 + hs + 18}" width="${uw}" height="7" rx="3" fill="url(#accent)"/>
  <text x="${CX}" y="350" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="#EDE5D8">${middots(s.sub)}</text>`);
}

// ── WALLPAPER-FORWARD STYLES (visual + tagline chip) ────────────────────────
function pulsefield(s) {
  let lines = '';
  for (let i = 0; i < 5; i++) { const y = 50 + i * 78; lines += `  <polyline points="${ekg(0, W, y, 30)}" stroke="url(#accent2)" fill="none" stroke-width="2" opacity="0.10"/>\n`; }
  return svg(`${defsBanner(s.scheme, 0.5, 0.5, 0.7)}
${BG}
${lines}  <polyline points="${ekg(0, W, 198, 64)}" stroke="url(#accent)" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
${chip(s.tag, 210, 42)}
${WORDMARK(1496, 350)}`);
}
function dotgrid(s) {
  return svg(`${defsBanner(s.scheme, 0.82, 0.22, 0.6, `\n    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="2.5" fill="#16202f"/></pattern>`)}
${BG}
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <circle cx="1300" cy="120" r="240" fill="url(#glow)"/>
${chip(s.tag, 210, 42)}
${WORDMARK(1496, 350)}`);
}
function waves(s) {
  return svg(`${defsBanner(s.scheme, 0.5, 0.4, 0.7)}
${BG}
  <path d="${wavePath(240, 46, 2.2, 0, true)}" fill="url(#accent)" opacity="0.16"/>
  <path d="${wavePath(280, 52, 1.8, 1.6, true)}" fill="url(#accent2)" opacity="0.12"/>
  <path d="${wavePath(210, 40, 2.6, 3.0, false)}" fill="none" stroke="url(#accent)" stroke-width="4" opacity="0.8"/>
${chip(s.tag, 175, 42)}
${WORDMARK(1496, 350)}`);
}
function radar(s) {
  let arcs = '';
  for (let i = 1; i <= 6; i++) { arcs += `  <circle cx="${W}" cy="${H}" r="${i * 150}" fill="none" stroke="url(#accent2)" stroke-width="2" opacity="${(0.16 - i * 0.012).toFixed(3)}"/>\n`; }
  return svg(`${defsBanner(s.scheme, 0.95, 0.95, 0.6)}
${BG}
${arcs}  <line x1="${W}" y1="${H}" x2="${W - 900}" y2="${H - 360}" stroke="url(#accent)" stroke-width="3" opacity="0.5"/>
  <text x="90" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="88" y="240" font-family="${FONT}" font-size="${fit(s.tag, 1100, 64, 0.57)}" font-weight="900" fill="#FFFFFF">${esc(s.tag)}</text>
${WORDMARK(1496, 350)}`);
}
function bars(s) {
  const hs = [120, 200, 160, 260, 210, 300, 180, 240, 320, 200, 280, 150, 230, 290, 170, 250];
  let bs = '';
  const bw = W / hs.length;
  hs.forEach((h, i) => { bs += `  <rect x="${(i * bw + 6).toFixed(1)}" y="${(H - h).toFixed(0)}" width="${(bw - 12).toFixed(1)}" height="${h}" fill="url(#accent)" opacity="${(0.18 + (i % 3) * 0.05).toFixed(2)}"/>\n`; });
  return svg(`${defsBanner(s.scheme, 0.2, 0.2, 0.6)}
${BG}
${bs}  <text x="90" y="150" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="url(#accent)">${esc(s.eyebrow)}</text>
  <text x="88" y="235" font-family="${FONT}" font-size="${fit(s.tag, 1180, 66, 0.57)}" font-weight="900" fill="#FFFFFF">${esc(s.tag)}</text>
${WORDMARK(1496, 350)}`);
}
function network(s) {
  const nodes = [[180, 110], [360, 250], [520, 90], [720, 300], [900, 150], [1120, 280], [1300, 110], [1460, 250], [1040, 60], [640, 180]];
  const edges = [[0, 1], [1, 2], [2, 4], [1, 3], [3, 5], [4, 5], [4, 6], [6, 7], [5, 7], [2, 8], [8, 4], [9, 1], [9, 3], [6, 8]];
  let ls = '', cs = '';
  edges.forEach(([a, b]) => { ls += `  <line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="url(#accent2)" stroke-width="2" opacity="0.28"/>\n`; });
  nodes.forEach(([x, y], i) => { cs += `  <circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 9 : 6}" fill="url(#accent)" opacity="0.85"/>\n`; });
  return svg(`${defsBanner(s.scheme, 0.5, 0.2, 0.7)}
${BG}
${ls}${cs}${chip(s.tag, 300, 40)}
${WORDMARK(1496, 56)}`);
}
function mesh(s) {
  return svg(`${defsBanner(s.scheme, 0.5, 0.5, 0.6, `\n    <radialGradient id="b1" cx="0.2" cy="0.3" r="0.5"><stop offset="0" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0.28"/><stop offset="1" style="stop-color:var(--c1,#FF8C1A)" stop-opacity="0"/></radialGradient>\n    <radialGradient id="b2" cx="0.8" cy="0.7" r="0.5"><stop offset="0" style="stop-color:var(--c4,#22d3ee)" stop-opacity="0.22"/><stop offset="1" style="stop-color:var(--c4,#22d3ee)" stop-opacity="0"/></radialGradient>\n    <radialGradient id="b3" cx="0.6" cy="0.2" r="0.4"><stop offset="0" style="stop-color:var(--c3,#FFD740)" stop-opacity="0.20"/><stop offset="1" style="stop-color:var(--c3,#FFD740)" stop-opacity="0"/></radialGradient>`)}
${BG}
  <rect width="${W}" height="${H}" fill="url(#b1)"/>
  <rect width="${W}" height="${H}" fill="url(#b2)"/>
  <rect width="${W}" height="${H}" fill="url(#b3)"/>
${chip(s.tag, 210, 44)}
${WORDMARK(1496, 350)}`);
}
function monogram(s) {
  const letter = (s.tag.match(/[A-Za-z]/) || ['P'])[0].toUpperCase();
  return svg(`${defsBanner(s.scheme, 0.78, 0.3, 0.55)}
${BG}
  <text x="120" y="370" font-family="${FONT}" font-size="440" font-weight="900" fill="url(#accent)" opacity="0.12">${esc(letter)}</text>
  <text x="560" y="180" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="6" fill="#94a3b8">${esc(s.eyebrow)}</text>
  <text x="558" y="250" font-family="${FONT}" font-size="${fit(s.tag, 900, 60, 0.57)}" font-weight="900" fill="#FFFFFF">${esc(s.tag)}</text>
${WORDMARK(1496, 350)}`);
}

const RENDER = { spotlight, centered, leftbar, quote: quoteStyle, panel, underline, pulsefield, dotgrid, waves, radar, bars, network, mesh, monogram };
const TEXT_STYLES = ['spotlight', 'centered', 'leftbar', 'quote', 'panel', 'underline'];
const WALL_STYLES = ['pulsefield', 'dotgrid', 'waves', 'radar', 'bars', 'network', 'mesh', 'monogram'];
const WALL_DESC = { pulsefield: 'layered pulse-line', dotgrid: 'dot-grid', waves: 'flowing-wave', radar: 'radar-sweep', bars: 'bar-chart skyline', network: 'connected-node', mesh: 'soft gradient-mesh', monogram: 'bold monogram' };
const SCHEMES = ['gold', 'cyan', 'gold', 'mix', 'gold', 'cyan'];

// ── CONTENT ─────────────────────────────────────────────────────────────────
const SPECS = [];
const msg = [];   // message banners (text styles)
const wall = [];  // wallpaper banners (visual styles)

// 44 role banners
[
  ['Chief Revenue Officer', 'I own the whole number.', ['Sales', 'Marketing', 'Success']],
  ['VP of Sales', 'I build winning sales teams.', ['Hire', 'Coach', 'Win']],
  ['VP of Revenue', 'I connect the revenue engine.', ['Pipeline', 'Process', 'Predictability']],
  ['Regional Sales Director', 'I run the region.', ['Coverage', 'Coaching', 'Quota']],
  ['Enterprise AE', 'I close seven-figure deals.', ['Discovery', 'Value', 'Trust']],
  ['Mid-Market AE', 'I move deals fast.', ['Qualify', 'Demo', 'Close']],
  ['SMB Account Executive', 'I win volume.', ['Speed', 'Volume', 'Close']],
  ['Account Manager', 'I grow the accounts I win.', ['Adopt', 'Expand', 'Renew']],
  ['Sales Development Rep', 'I open the doors.', ['Research', 'Reach', 'Book']],
  ['SDR Manager', 'I build the pipeline machine.', ['Hire', 'Coach', 'Scale']],
  ['Business Development', 'I create new revenue.', ['Source', 'Qualify', 'Pass']],
  ['Sales Operations Lead', 'I make selling easier.', ['Systems', 'Data', 'Insight']],
  ['Revenue Operations', 'I run the revenue engine.', ['People', 'Process', 'Tech']],
  ['Sales Enablement Lead', 'I make reps ready to win.', ['Onboard', 'Train', 'Certify']],
  ['Sales Engineer', 'I make the technical case.', ['Discover', 'Demo', 'Prove']],
  ['Solutions Architect', 'I design what they buy.', ['Map', 'Scope', 'Solve']],
  ['Customer Success Manager', 'I turn customers into fans.', ['Onboard', 'Adopt', 'Renew']],
  ['Head of Customer Success', 'I protect and grow revenue.', ['Retain', 'Expand', 'Advocate']],
  ['Renewals Specialist', 'I keep the revenue.', ['Adopt', 'Value', 'Renew']],
  ['Channel Account Manager', 'I sell through partners.', ['Recruit', 'Enable', 'Scale']],
  ['Partnerships Lead', 'I build the ecosystem.', ['Source', 'Co-sell', 'Grow']],
  ['Demand Generation Lead', 'I fill the funnel.', ['Reach', 'Capture', 'Convert']],
  ['Growth Marketer', 'I turn spend into pipeline.', ['Test', 'Measure', 'Scale']],
  ['Marketing Operations', 'I make marketing measurable.', ['Track', 'Attribute', 'Optimize']],
  ['Product Marketing Lead', 'I make the market care.', ['Position', 'Message', 'Launch']],
  ['Field Sales Rep', 'I win in the field.', ['Travel', 'Build', 'Close']],
  ['Inside Sales Rep', 'I close from the desk.', ['Call', 'Qualify', 'Close']],
  ['Sales Coach', 'I build closers.', ['Mindset', 'Skill', 'Reps']],
  ['Sales Trainer', 'I level up the team.', ['Teach', 'Drill', 'Apply']],
  ['Deal Desk Manager', 'I get deals to signature.', ['Price', 'Approve', 'Close']],
  ['Sales Recruiter', 'I find people who close.', ['Source', 'Screen', 'Hire']],
  ['Territory Manager', 'I own my patch.', ['Plan', 'Cover', 'Win']],
  ['Key Account Manager', 'I grow the accounts that matter.', ['Map', 'Whitespace', 'Expand']],
  ['Pre-Sales Consultant', 'I prove it works.', ['Scope', 'Demo', 'Validate']],
  ['Sales Analyst', 'I turn data into decisions.', ['Report', 'Model', 'Recommend']],
  ['GTM Strategist', 'I design the go-to-market.', ['Segment', 'Message', 'Motion']],
  ['Founder & CEO', 'I sell the vision.', ['Story', 'Traction', 'Trust']],
  ['Startup Founder', 'I build revenue from zero.', ['Build', 'Sell', 'Scale']],
  ['Fractional CRO', 'Revenue leadership, on demand.', ['Strategy', 'Systems', 'Pipeline']],
  ['Sales Consultant', 'I fix broken sales motions.', ['Diagnose', 'Design', 'Deliver']],
  ['Revenue Advisor', 'I help teams grow predictably.', ['Audit', 'Advise', 'Scale']],
  ['Sales Leader', 'I lead from the front.', ['Coach', 'Forecast', 'Win']],
  ['Head of Sales', 'I own the forecast.', ['Inspect', 'Qualify', 'Commit']],
  ['Commercial Director', 'I drive the commercial plan.', ['Plan', 'Execute', 'Deliver']],
].forEach(([role, headline, sub]) => msg.push({ role, eyebrow: role.toUpperCase(), headline, sub }));

// 66 tagline / philosophy banners
[
  ['SALES PHILOSOPHY', 'Pipeline is the product.', ['Activity', 'Pipeline', 'Revenue']],
  ['DISCOVERY FIRST', 'Sell the problem, not the product.', ['Discover', 'Diagnose', 'Solve']],
  ['HOW I SELL', 'Trusted advisor, never a vendor.', ['Listen', 'Advise', 'Earn']],
  ['FORECAST DISCIPLINE', 'A forecast you can trust.', ['Inspect', 'Qualify', 'Commit']],
  ['WHAT WINS', 'Discovery wins deals.', ['Ask', 'Listen', 'Uncover']],
  ['HOW WE WORK', 'Process over pressure.', ['System', 'Cadence', 'Calm']],
  ['SALES MINDSET', 'Every no is data.', ['Test', 'Learn', 'Adjust']],
  ['SALES TRUTH', 'Quota is a floor, not a ceiling.', ['Set', 'Beat', 'Repeat']],
  ['SALES MINDSET', 'Activity creates luck.', ['Reps', 'Reach', 'Results']],
  ['REVOPS LAW', 'Data beats opinions.', ['Measure', 'Model', 'Decide']],
  ['DEAL STRATEGY', 'Champions sell when you can’t.', ['Find', 'Arm', 'Trust']],
  ['SALES WISDOM', 'Slow is smooth. Smooth is fast.', ['Plan', 'Prep', 'Perform']],
  ['GO-TO-MARKET', 'Revenue is a team sport.', ['Sales', 'Marketing', 'Success']],
  ['FOLLOW-UP', 'The fortune is in the follow-up.', ['Touch', 'Track', 'Close']],
  ['HOW I OPERATE', 'Build, don’t chase.', ['System', 'Signal', 'Scale']],
  ['SELLING CREDO', 'First the trust, then the deal.', ['Listen', 'Help', 'Earn']],
  ['VALUE SELLING', 'People buy outcomes, not features.', ['Outcome', 'Impact', 'Vision']],
  ['SALES TRUTH', 'No decision is the real competitor.', ['Urgency', 'Cost', 'Now']],
  ['DISCOVERY', 'The best discovery feels like therapy.', ['Ask', 'Listen', 'Reflect']],
  ['MINDSET', 'Coachable beats talented.', ['Learn', 'Apply', 'Grow']],
  ['CADENCE', 'Win the week. The quarter follows.', ['Plan', 'Execute', 'Review']],
  ['PROSPECTING', 'Your pipeline is your paycheck.', ['Prospect', 'Build', 'Close']],
  ['SALES LAW', 'Qualify hard, close easy.', ['Qualify', 'Advance', 'Close']],
  ['NEGOTIATION', 'Never give without a get.', ['Anchor', 'Trade', 'Sign']],
  ['DEMO CRAFT', 'Sell the meeting, not the demo.', ['Discover', 'Tailor', 'Advance']],
  ['CLARITY', 'A confused buyer never buys.', ['Simplify', 'Clarify', 'Decide']],
  ['BUYER FIRST', 'Make the buyer the hero.', ['Listen', 'Guide', 'Win']],
  ['RELATIONSHIPS', 'Revenue follows relationships.', ['Trust', 'Value', 'Time']],
  ['PERSISTENCE', 'The next call is the most important one.', ['Show up', 'Follow up', 'Close']],
  ['FOCUS', 'Be the signal, not the noise.', ['Relevant', 'Useful', 'Brief']],
  ['GOLDEN RULE', 'Sell like you’d want to be sold to.', ['Honest', 'Helpful', 'Human']],
  ['COMPOUNDING', 'Trust compounds. So does pipeline.', ['Consistency', 'Care', 'Time']],
  ['PIPELINE LAW', 'More pipeline, less panic.', ['Prospect', 'Build', 'Relax']],
  ['EXECUTION', 'Plans are nothing. Reps are everything.', ['Show up', 'Do reps', 'Improve']],
  ['ENERGY', 'Bring the energy every call.', ['Prepared', 'Present', 'Positive']],
  ['ACCOUNTABILITY', 'Own the number.', ['Commit', 'Track', 'Deliver']],
  ['DISCIPLINE', 'Do the reps.', ['Daily', 'Consistent', 'Relentless']],
  ['CURIOSITY', 'Ask better questions.', ['Why', 'What if', 'How']],
  ['CONSULTATIVE', 'Don’t pitch. Diagnose.', ['Listen', 'Probe', 'Prescribe']],
  ['VALUE', 'Sell the value, not the price.', ['Outcome', 'Impact', 'ROI']],
  ['LISTENING', 'Listen more. Pitch less.', ['Hear', 'Understand', 'Respond']],
  ['NICHE', 'The riches are in the niches.', ['Focus', 'Specialize', 'Win']],
  ['HIRING', 'Hire slow. Ramp fast.', ['Profile', 'Vet', 'Onboard']],
  ['SCALE', 'Process scales. Heroics don’t.', ['System', 'Repeat', 'Scale']],
  ['HONESTY', 'Give before you take.', ['Help', 'Teach', 'Earn']],
  ['MOMENTUM', 'Motion creates momentum.', ['Start', 'Move', 'Build']],
  ['RESILIENCE', 'It’s not a no. It’s a not yet.', ['Nurture', 'Follow up', 'Return']],
  ['PIPELINE', 'Pipeline cures all.', ['Build', 'Fill', 'Win']],
  ['CLOSING', 'Earn every yes.', ['Discover', 'Value', 'Ask']],
  ['PREPARATION', 'Champions are made before the call.', ['Research', 'Plan', 'Rehearse']],
  ['STORYTELLING', 'Facts tell. Stories sell.', ['Hook', 'Story', 'Proof']],
  ['EMPATHY', 'Sell with the buyer, not at them.', ['Listen', 'Align', 'Guide']],
  ['SIMPLICITY', 'Clarity closes.', ['Simple', 'Clear', 'Done']],
  ['GRIT', 'Stay in the deal.', ['Persist', 'Adapt', 'Win']],
  ['LEARNING', 'Win or learn. Never lose.', ['Reflect', 'Adjust', 'Improve']],
  ['SERVICE', 'Help first. Sell second.', ['Serve', 'Solve', 'Sell']],
  ['TRUST', 'Trust is the real close.', ['Honest', 'Reliable', 'Consistent']],
  ['VISION', 'Sell the future, not the feature.', ['Vision', 'Outcome', 'Impact']],
  ['OWNERSHIP', 'Run your patch like a business.', ['Plan', 'Prioritize', 'Execute']],
  ['SPEED', 'Speed to lead wins.', ['Fast', 'First', 'Relevant']],
  ['CONSISTENCY', 'Small reps, big results.', ['Daily', 'Focused', 'Compounding']],
  ['COACHING', 'Great reps are coached, not born.', ['Observe', 'Feedback', 'Reps']],
  ['INSIGHT', 'Teach them something new.', ['Reframe', 'Challenge', 'Lead']],
  ['ALIGNMENT', 'Sell to the problem they feel.', ['Pain', 'Cost', 'Now']],
  ['CONFIDENCE', 'Calm closers win.', ['Prepared', 'Present', 'Steady']],
  ['PURPOSE', 'Sell things worth buying.', ['Honest', 'Useful', 'Proud']],
].forEach(([eyebrow, headline, sub]) => msg.push({ role: null, eyebrow, headline, sub }));

// 22 industry GTM banners
[
  ['SAAS REVENUE', 'SaaS revenue, built to scale.', ['ARR', 'NRR', 'Efficiency']],
  ['FINTECH SALES', 'Selling trust in FinTech.', ['Compliance', 'Security', 'ROI']],
  ['HEALTHCARE GTM', 'Revenue in regulated markets.', ['Trust', 'Outcomes', 'Compliance']],
  ['CYBERSECURITY', 'Selling security that scales.', ['Risk', 'Trust', 'Value']],
  ['MANUFACTURING', 'Industrial sales, modernized.', ['Relationships', 'ROI', 'Uptime']],
  ['PROFESSIONAL SERVICES', 'Selling expertise and outcomes.', ['Trust', 'Scope', 'Value']],
  ['MARTECH', 'Revenue for marketing tech.', ['Pipeline', 'Attribution', 'Growth']],
  ['DEVTOOLS', 'Selling to developers.', ['Docs', 'DX', 'Trust']],
  ['LOGISTICS', 'Revenue that moves.', ['Cost', 'Speed', 'Reliability']],
  ['REAL ESTATE TECH', 'PropTech revenue, built right.', ['Pipeline', 'Trust', 'Close']],
  ['EDTECH', 'Selling better outcomes.', ['Impact', 'Adoption', 'Value']],
  ['INSURTECH', 'Modernizing insurance sales.', ['Trust', 'Speed', 'Compliance']],
  ['HR TECH', 'Selling to people leaders.', ['Outcomes', 'Adoption', 'ROI']],
  ['E-COMMERCE', 'Revenue that converts.', ['Traffic', 'Conversion', 'AOV']],
  ['AI & ML', 'Selling AI that delivers.', ['Trust', 'ROI', 'Adoption']],
  ['CLOUD INFRA', 'Revenue at scale.', ['Reliability', 'Cost', 'Trust']],
  ['MEDIA & ADTECH', 'Revenue across screens.', ['Reach', 'Yield', 'ROI']],
  ['BIOTECH', 'Selling science and scale.', ['Trust', 'Rigor', 'Outcomes']],
  ['ENERGY & UTILITIES', 'Powering revenue growth.', ['Efficiency', 'Trust', 'Scale']],
  ['NONPROFIT', 'Mission-driven revenue.', ['Impact', 'Trust', 'Sustainability']],
  ['HOSPITALITY', 'Revenue that delights.', ['Experience', 'Loyalty', 'Yield']],
  ['CONSULTING', 'Selling outcomes, not hours.', ['Trust', 'Scope', 'Impact']],
].forEach(([eyebrow, headline, sub]) => msg.push({ role: null, eyebrow, headline, sub }));

// 12 open-to-work banners
[
  ['OPEN TO WORK', 'Open to sales leadership roles.', ['Hunter', 'Closer', 'Builder']],
  ['OPEN TO WORK', 'Seeking my next AE seat.', ['Quota', 'Hunger', 'Results']],
  ['OPEN TO WORK', 'Ready to build pipeline for you.', ['Outbound', 'Discovery', 'Close']],
  ['OPEN TO WORK', 'Looking for my next SDR role.', ['Outreach', 'Energy', 'Grit']],
  ['OPEN TO WORK', 'Available for fractional CRO work.', ['Strategy', 'Systems', 'Pipeline']],
  ['OPEN TO WORK', 'Seeking a RevOps role.', ['Systems', 'Data', 'Process']],
  ['OPEN TO WORK', 'Open to Customer Success roles.', ['Retain', 'Expand', 'Advocate']],
  ['OPEN TO WORK', 'Ready to lead a sales team.', ['Coach', 'Forecast', 'Win']],
  ['OPEN TO WORK', 'Looking for my next quota.', ['Pipeline', 'Pace', 'Close']],
  ['OPEN TO WORK', 'Seeking enablement leadership.', ['Onboard', 'Train', 'Certify']],
  ['OPEN TO WORK', 'Available for sales consulting.', ['Diagnose', 'Design', 'Deliver']],
  ['OPEN TO WORK', 'Ready for my next challenge.', ['Drive', 'Skill', 'Results']],
].forEach(([eyebrow, headline, sub]) => msg.push({ role: null, eyebrow, headline, sub }));

// 8 hiring banners
[
  ['NOW HIRING', 'We’re hiring closers.', ['Join', 'Build', 'Win']],
  ['NOW HIRING', 'Join a team that runs on pipeline.', ['Growth', 'Coaching', 'Culture']],
  ['WE’RE HIRING', 'Build your sales career with us.', ['Ramp', 'Earn', 'Grow']],
  ['NOW HIRING SDRs', 'Start your sales career here.', ['Coaching', 'Path', 'Upside']],
  ['HIRING AEs', 'Bring your hunger. Keep the upside.', ['Territory', 'Support', 'Comp']],
  ['JOIN US', 'Sell something people love.', ['Product', 'Market', 'Mission']],
  ['NOW HIRING', 'Great reps wanted.', ['Coachable', 'Driven', 'Hungry']],
  ['BUILD WITH US', 'Help us build the revenue engine.', ['Own it', 'Scale it', 'Win']],
].forEach(([eyebrow, headline, sub]) => msg.push({ role: null, eyebrow, headline, sub }));

// 48 wallpaper taglines (visual styles)
[
  ['REVENUE OPERATIONS', 'Build the revenue engine.'],
  ['OPERATIONS', 'Pipeline. Process. Predictability.'],
  ['REVOPS', 'One source of revenue truth.'],
  ['SALES', 'Activity. Pipeline. Revenue.'],
  ['MINDSET', 'Pipeline cures all.'],
  ['GROWTH', 'Predictable revenue, by design.'],
  ['SALES OPS', 'Make selling effortless.'],
  ['FORECAST', 'Inspect. Qualify. Commit.'],
  ['PIPELINE', 'Fill it. Work it. Win it.'],
  ['CADENCE', 'Win the week.'],
  ['DISCOVERY', 'Sell the problem.'],
  ['MOMENTUM', 'Motion creates momentum.'],
  ['SIGNAL', 'Be the signal, not the noise.'],
  ['TRUST', 'Trust compounds.'],
  ['CLOSING', 'Earn every yes.'],
  ['VALUE', 'Sell outcomes, not features.'],
  ['SCALE', 'Process scales.'],
  ['EXECUTION', 'Do the reps.'],
  ['STRATEGY', 'Right market, right motion.'],
  ['DATA', 'Data beats opinions.'],
  ['ENABLEMENT', 'Ready reps win.'],
  ['RETENTION', 'Keep what you win.'],
  ['EXPANSION', 'Land, adopt, expand.'],
  ['PROSPECTING', 'Your pipeline is your paycheck.'],
  ['QUOTA', 'Own the number.'],
  ['CULTURE', 'Process over pressure.'],
  ['VELOCITY', 'Faster deals, fewer leaks.'],
  ['ALIGNMENT', 'One team. One number.'],
  ['INSIGHT', 'Turn data into decisions.'],
  ['DEMAND', 'Fill the top of funnel.'],
  ['CONVERSION', 'Turn interest into revenue.'],
  ['EFFICIENCY', 'Grow without the bloat.'],
  ['LEADERSHIP', 'Lead from the front.'],
  ['COACHING', 'Better reps, every week.'],
  ['DISCIPLINE', 'Small reps, big results.'],
  ['CLARITY', 'Clarity closes.'],
  ['RESILIENCE', 'Stay in the deal.'],
  ['CURIOSITY', 'Ask better questions.'],
  ['SERVICE', 'Help first. Sell second.'],
  ['VISION', 'Sell the future.'],
  ['SPEED', 'Speed to lead wins.'],
  ['FOCUS', 'Win the day.'],
  ['ENERGY', 'Bring the energy.'],
  ['GRIT', 'Chase the no.'],
  ['PRECISION', 'Right deal, right time.'],
  ['CONFIDENCE', 'Calm closers win.'],
  ['PURPOSE', 'Sell things worth buying.'],
  ['REVENUE', 'Make it predictable.'],
].forEach(([eyebrow, tag]) => wall.push({ eyebrow, tag }));

// assemble: interleave styles within each family
msg.forEach((m, i) => { m.tpl = TEXT_STYLES[i % TEXT_STYLES.length]; m.kind = 'msg'; });
wall.forEach((w, i) => { w.tpl = WALL_STYLES[i % WALL_STYLES.length]; w.kind = 'wall'; });
msg.forEach(m => SPECS.push(m));
wall.forEach(w => SPECS.push(w));

SPECS.forEach((s, i) => {
  s.id = id4(START_NUM + i);
  s.scheme = SCHEMES[i % SCHEMES.length];
  if (s.kind === 'msg') {
    s.title = (s.role ? s.role : `“${plain(s.headline)}”`) + ' — LinkedIn Banner';
    s.desc = `A dark, on-brand LinkedIn banner — "${plain(s.headline)}" over a "${plain(s.sub)}" line with a pulse motif. Put it on your profile to signal exactly what you do.`;
  } else {
    s.title = `${plain(s.tag)} — LinkedIn Wallpaper`;
    s.desc = `A dark, on-brand LinkedIn cover wallpaper — a ${WALL_DESC[s.tpl]} backdrop with a "${plain(s.tag)}" line and the Pulse mark. A clean, branded banner for your profile.`;
  }
});

// ── modes ───────────────────────────────────────────────────────────────────
function genAll() {
  if (!fs.existsSync(ASSET_DIR)) fs.mkdirSync(ASSET_DIR, { recursive: true });
  for (const s of SPECS) fs.writeFileSync(path.join(ASSET_DIR, s.id + '.svg'), injectTheme(RENDER[s.tpl](s), pickPalette(s.id)), 'utf8');
  console.log(`generated ${SPECS.length} SVGs (${SPECS[0].id}..${SPECS[SPECS.length - 1].id})`);
}

async function publishAll() {
  try {
    const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
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
    const ASSET_REL = `/graphics/assets/${s.id}.svg`;
    const now = Date.now();
    const TAGS = ['graphic', 'linkedin-banner', 'free-download', 'revops-graphics', 'presentation-graphics'];
    const body =
`### ${s.title}

[![${s.title}](${ASSET_REL})](${ASSET_REL})

${s.desc}

**Format:** SVG (scalable vector) · **Size:** ${W}×${H} px · **Category:** LinkedIn Banner · **License:** Free to use — no attribution required.

[⬇ Download this graphic](${ASSET_REL})

## Recolor it to your brand
Use the color picker above to recolor this banner to your team or company colors, switch the background (including transparent), then download it as an SVG or PNG. No sign-up, no watermark.

## How to use it
It scales cleanly to the LinkedIn cover slot (1584×396) — download the PNG and drop it straight onto your profile, or open the SVG in Canva, PowerPoint, or Figma to add your name and tweak the layout.

## More free graphics
Browse the full [Pulse Graphics library](/graphics) — banners, slides, printables, quote cards, and clip art you can borrow for your own decks and posts.`;
    const entry = {
      id: s.id, question: s.title, answer: body, tags: TAGS,
      quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now,
      model: 'claude-opus-4-7', gold_format: true,
      graphic: { category: 'linkedin-banner', category_label: 'LinkedIn Banner', asset: ASSET_REL, width: W, height: H },
    };
    await store.setJSON(`answers/${s.id}.json`, entry);
    const i = idx.entries.findIndex(e => e && e.id === s.id);
    const row = { id: s.id, question: s.title, tags: TAGS, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
    if (i >= 0) idx.entries.splice(i, 1);
    idx.entries.unshift(row);
    urls.push(`https://pulserevops.com/graphics/${s.id}`, `https://pulserevops.com/graphics/${s.id}/reviews`);
    if (++done % 25 === 0) console.log(`  wrote ${done}/${SPECS.length}`);
  }
  await store.setJSON('_index.json', idx);
  console.log(`published ${done}; index now ${idx.entries.length} total`);
  const r = await pingIndexNowUrlList(urls);
  console.log('indexnow batch:', JSON.stringify(r));
}

(async () => {
  const mode = process.argv[2] || 'gen';
  if (mode === 'gen' || mode === 'both') genAll();
  if (mode === 'publish' || mode === 'both') await publishAll();
})().catch(e => { console.error('ERR', e && e.stack || e); process.exit(1); });
