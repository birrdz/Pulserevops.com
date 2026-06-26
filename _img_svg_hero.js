// Give EVERY library answer a real, on-brand IMAGE — instantly and for free —
// by GENERATING a flat-vector SVG "hero card" per entry in-house (no API, no
// rate limits, zero failures). Satisfies the "≥1 image/answer" LAW for the
// knowledge/playbook pillars that have a mermaid diagram but no real image.
//
// Why SVG instead of Pollinations/Imagen: those free engines are slow + flaky,
// and a paid image API isn't enabled yet. A designed SVG is a genuine image
// (<svg>/<img>), renders crisply, shows the ACTUAL question as a headline, and
// carries a pillar-specific illustration (bar chart / funnel / node graph /
// target / lightbulb). Later, Imagen can replace these on flagship pillars.
//
// Per-entry (no dedup): generation is instant so every entry gets a perfectly
// relevant hero. Files: website/img/auto/<id>.svg -> https://pulserevops.com/img/auto/<id>.svg
// Durable/resumable (skips entries that already have an image), grade-guarded
// (never regresses), republishes + pings IndexNow.
//
// Usage: node _img_svg_hero.js <prefixCSV> [--limit N] [--conc N]
//   e.g. node _img_svg_hero.js ik,st,gp,ra,vq,q --conc 12
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const IMG_DIR = 'C:/Users/koryj/website/img/auto';
const PUB_BASE = 'https://pulserevops.com/img/auto/';
const RESULT_PATH = 'C:/Users/koryj/website/_img_svg_hero_result.json';
fs.mkdirSync(IMG_DIR, { recursive: true });

const args = process.argv.slice(2);
const PREFIXES = (args.find(a => !a.startsWith('--')) || 'ik,st,gp,ra,vq,q')
  .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1]) : Infinity; })();
const CONC = (() => { const i = args.indexOf('--conc'); return i >= 0 ? parseInt(args[i + 1]) : 12; })();

const prefixOf = (id) => { const m = String(id).match(/^([a-z]+)/i); return m ? m[1].toLowerCase() : '?'; };
const hasImage = (a) => /@@PRODUCT[^\n]*\bimg=/.test(a) || /!\[[^\]]*\]\([^)]+\)/.test(a) || /<img\s/i.test(a) || /<svg/i.test(a);
function hash(str) { let h = 5381; for (let i = 0; i < String(str).length; i++) h = ((h << 5) + h + String(str).charCodeAt(i)) >>> 0; return h; }
const xml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PILLAR = {
  ik: { name: 'Industry KPIs', accent: '#f5a623', motif: 'bars' },
  st: { name: 'Sales Trainings', accent: '#2ec5b6', motif: 'target' },
  gp: { name: 'GTM Playbooks', accent: '#ff7a45', motif: 'funnel' },
  ra: { name: 'Revenue Architecture', accent: '#9b8cff', motif: 'nodes' },
  q: { name: 'RevOps Knowledge', accent: '#ffcf5c', motif: 'bulb' },
  vq: { name: 'RevOps Knowledge', accent: '#ffcf5c', motif: 'bulb' },
};
const pillarOf = (p) => PILLAR[p] || { name: 'Pulse RevOps', accent: '#f5a623', motif: 'bulb' };

// wrap a headline into up to `max` lines of ~`width` chars
function wrap(text, width, max) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > width) { if (cur) lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
    if (lines.length === max) break;
  }
  if (cur && lines.length < max) lines.push(cur);
  if (lines.length === max && words.join(' ').length > lines.join(' ').length) {
    lines[max - 1] = lines[max - 1].replace(/[\s.,;:]+$/, '') + '…';
  }
  return lines;
}

// ── pillar illustration motifs (right panel, ~x 740-1150, y 120-520) ──────
function motifBars(h, accent) {
  const heights = [0, 1, 2, 3, 4].map((i) => 90 + ((h >>> (i * 3)) & 7) * 28); // 90..286, always positive
  let bx = 770, by = 470, bw = 50, gap = 30, out = '';
  heights.forEach((ht, i) => {
    const x = bx + i * (bw + gap);
    out += `<rect x="${x}" y="${by - ht}" width="${bw}" height="${ht}" rx="7" fill="${accent}" opacity="${0.55 + 0.09 * i}"/>`;
  });
  out += `<path d="M770 ${by} L1090 ${by}" stroke="#5b6b8c" stroke-width="3" stroke-linecap="round"/>`;
  // trend line
  let pts = heights.map((ht, i) => `${bx + i * (bw + gap) + bw / 2},${by - ht - 18}`).join(' ');
  out += `<polyline points="${pts}" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
  return out;
}
function motifFunnel(h, accent) {
  const cx = 935, y0 = 150, levels = 4; let out = '';
  for (let i = 0; i < levels; i++) {
    const topW = 360 - i * 80, botW = 360 - (i + 1) * 80, y = y0 + i * 78, hh = 64;
    const tl = cx - topW / 2, tr = cx + topW / 2, bl = cx - botW / 2, br = cx + botW / 2;
    out += `<path d="M${tl} ${y} L${tr} ${y} L${br} ${y + hh} L${bl} ${y + hh} Z" fill="${accent}" opacity="${0.45 + 0.14 * i}"/>`;
  }
  out += `<path d="M935 470 l0 36 m-14 -16 l14 16 l14 -16" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;
  return out;
}
function motifNodes(h, accent) {
  const nodes = [[800, 200], [1080, 180], [760, 420], [1060, 430], [930, 300]];
  const edges = [[4, 0], [4, 1], [4, 2], [4, 3], [0, 1], [2, 3]];
  let out = '';
  edges.forEach(([a, b]) => { out += `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#5b6b8c" stroke-width="3"/>`; });
  nodes.forEach(([x, y], i) => {
    const hub = i === 4;
    out += `<rect x="${x - (hub ? 46 : 34)}" y="${y - (hub ? 30 : 24)}" width="${hub ? 92 : 68}" height="${hub ? 60 : 48}" rx="12" fill="${hub ? accent : '#1b3056'}" stroke="${accent}" stroke-width="${hub ? 0 : 3}"/>`;
    out += `<circle cx="${x}" cy="${y}" r="6" fill="${hub ? '#0b1b34' : accent}"/>`;
  });
  return out;
}
function motifTarget(h, accent) {
  const cx = 935, cy = 320; let out = '';
  [150, 105, 60].forEach((r, i) => { out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accent}" stroke-width="${10 - i * 2}" opacity="${0.5 + 0.18 * i}"/>`; });
  out += `<circle cx="${cx}" cy="${cy}" r="18" fill="${accent}"/>`;
  out += `<path d="M1070 175 L${cx + 6} ${cy - 6}" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>`;
  out += `<path d="M1070 175 l-34 4 m38 -8 l-4 34" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  return out;
}
function motifBulb(h, accent) {
  const cx = 935, cy = 290; let out = '';
  for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 * i) / 8; const r1 = 150, r2 = 195; out += `<line x1="${(cx + Math.cos(a) * r1).toFixed(0)}" y1="${(cy + Math.sin(a) * r1).toFixed(0)}" x2="${(cx + Math.cos(a) * r2).toFixed(0)}" y2="${(cy + Math.sin(a) * r2).toFixed(0)}" stroke="${accent}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`; }
  out += `<circle cx="${cx}" cy="${cy}" r="92" fill="${accent}" opacity="0.92"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.5"/>`;
  out += `<rect x="${cx - 28}" y="${cy + 86}" width="56" height="40" rx="10" fill="#1b3056" stroke="${accent}" stroke-width="4"/>`;
  out += `<path d="M${cx - 16} ${cy + 100} h32 M${cx - 12} ${cy + 114} h24" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
  return out;
}
const MOTIF = { bars: motifBars, funnel: motifFunnel, nodes: motifNodes, target: motifTarget, bulb: motifBulb };

function buildSVG(id, prefix, question) {
  const p = pillarOf(prefix);
  const h = hash(id + '|' + question);
  const accent = p.accent;
  const lines = wrap(question || p.name, 24, 4);
  const fontSize = lines.length >= 4 ? 44 : lines.length === 3 ? 50 : 56;
  let ty = 300 - ((lines.length - 1) * (fontSize + 12)) / 2;
  let headline = '';
  for (const ln of lines) { headline += `<text x="90" y="${ty}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${xml(ln)}</text>`; ty += fontSize + 14; }
  const motif = (MOTIF[p.motif] || motifBulb)(h, accent);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${xml(question || p.name)}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1b34"/><stop offset="1" stop-color="#13294f"/></linearGradient>
<radialGradient id="glow" cx="0.78" cy="0.4" r="0.55"><stop offset="0" stop-color="${accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<g opacity="0.5">${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${90 * i}" x2="1200" y2="${90 * i}" stroke="#1c3358" stroke-width="1"/>`).join('')}</g>
${motif}
<g transform="translate(60,70)"><circle cx="14" cy="14" r="14" fill="${accent}"/><circle cx="14" cy="14" r="14" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/><rect x="8" y="26" width="12" height="7" rx="2" fill="#0b1b34"/></g>
<text x="92" y="84" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3" fill="${accent}">PULSE · ${xml(p.name.toUpperCase())}</text>
${headline}
<rect x="90" y="520" width="120" height="5" rx="2.5" fill="${accent}"/>
<text x="90" y="572" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="#9fb3d4">pulserevops.com</text>
</svg>`;
}

function insertImage(body, url, alt) {
  const safeAlt = String(alt || 'illustration').replace(/[\[\]]/g, '').slice(0, 90);
  const imgMd = `![${safeAlt}](${url})`;
  const lines = body.split(/\r?\n/);
  let at = lines.findIndex(l => /^#{1,3}\s+\S/.test(l));
  if (at < 0) at = lines.findIndex(l => l.trim().length);
  if (at < 0) return imgMd + '\n\n' + body;
  lines.splice(at + 1, 0, '', imgMd);
  return lines.join('\n');
}

module.exports = { buildSVG };
if (require.main !== module) return;
(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => PREFIXES.includes(prefixOf(id)));
  console.log('SVG hero engine | candidates in', PREFIXES.join(','), '=', ids.length);
  let fixed = 0, failed = 0, skipped = 0, i = 0, processed = 0;
  async function worker() {
    while (i < ids.length && processed < LIMIT) {
      const id = ids[i++];
      let e;
      try { e = await s.get('answers/' + id + '.json', { type: 'json' }); } catch (err) { continue; }
      const a = (e && e.answer) || '';
      if (!a || hasImage(a)) { skipped++; continue; }
      processed++;
      const prefix = prefixOf(id);
      try {
        const svg = buildSVG(id, prefix, e.question || '');
        fs.writeFileSync(path.join(IMG_DIR, id + '.svg'), svg);
        const url = PUB_BASE + id + '.svg';
        const before = gradeEntry(id, e.answer);
        const newBody = insertImage(e.answer, url, e.question || id);
        const after = gradeEntry(id, newBody);
        if (after.score < before.score) { failed++; console.log('  SKIP(regress)', id, before.score, '->', after.score); continue; }
        e.answer = newBody; e.ts = Date.now(); e.polished_at = Date.now();
        await s.setJSON('answers/' + id + '.json', e);
        // fire-and-forget IndexNow (don't block throughput)
        fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(8000) }).catch(() => {});
        fixed++;
        if (fixed % 100 === 0) { console.log(`  [${fixed}] ${id} +svg  (processed=${processed} failed=${failed})`); fs.writeFileSync(RESULT_PATH, JSON.stringify({ prefixes: PREFIXES, fixed, failed, processed }, null, 1)); }
      } catch (err) { failed++; console.log('  ERR', id, err.message); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const out = { prefixes: PREFIXES, processed, fixed, failed, skipped };
  fs.writeFileSync(RESULT_PATH, JSON.stringify(out, null, 1));
  console.log('DONE', JSON.stringify(out));
})().catch(e => { console.error('FATAL', e && e.stack); process.exit(1); });
