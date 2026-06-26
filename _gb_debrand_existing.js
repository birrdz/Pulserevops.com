// One-shot: de-brand + make themeable the original hand-authored gb0001-gb0020.
// Strips the "PULSE · RevOps" wordmark / "pulserevops.com" credit / attribution
// text nodes, converts the brand accent + bg gradient colours to CSS vars, and
// bakes a deterministic default palette into an internal <style>. Idempotent-ish
// (re-running is safe because the brand text is already gone and var() wrappers
// are only applied to bare hex literals).
const fs = require('fs');
const path = require('path');
const { PALETTES, paletteVars } = require('./graphics-palettes.js');

const dir = path.join(__dirname, 'graphics', 'assets');
function pickPalette(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return PALETTES[h % PALETTES.length]; }

let n = 0;
for (let i = 1; i <= 20; i++) {
  const id = 'gb' + String(i).padStart(4, '0');
  const f = path.join(dir, id + '.svg');
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');

  // 1) remove brand text nodes (wordmark / credit / attribution)
  s = s.replace(/[ \t]*<text\b[^>]*>(?:(?!<\/text>)[\s\S])*?(?:pulserevops\.com|PULSE<tspan|PULSE REVOPS|PULSE<\/tspan)(?:(?!<\/text>)[\s\S])*?<\/text>\s*\n?/g, '');
  // strip comments (some mention "Pulse") so the shared file is fully neutral
  s = s.replace(/[ \t]*<!--[\s\S]*?-->\s*\n?/g, '');

  // 2) themeable colours — bg gradient stops only (leave dark ink/cutouts literal)
  s = s.replace(/stop-color="#0b0f17"/g, 'style="stop-color:var(--bg1,#0b0f17)"');
  s = s.replace(/stop-color="#0f172a"/g, 'style="stop-color:var(--bg2,#0f172a)"');
  // accent + secondary brand hexes anywhere (gradient stops + standalone fills)
  s = s.replace(/#FF8C1A/g, 'var(--c1,#FF8C1A)');
  s = s.replace(/#E8710A/g, 'var(--c2,#E8710A)');
  s = s.replace(/#FFD740/g, 'var(--c3,#FFD740)');
  s = s.replace(/#22d3ee/g, 'var(--c4,#22d3ee)');
  s = s.replace(/#0ea5b7/g, 'var(--c4,#0ea5b7)');
  s = s.replace(/#0f766e/g, 'var(--c2,#0f766e)');
  // stop-color="var(...)" must become style="stop-color:var(...)" to be valid
  s = s.replace(/stop-color="(var\([^"]*\))"/g, 'style="stop-color:$1"');

  // 3) bake default palette
  s = s.replace(/(<svg[^>]*>)/, `$1\n  <style>svg{${paletteVars(pickPalette(id))}}</style>`);

  fs.writeFileSync(f, s, 'utf8');
  n++;
}
console.log('de-branded + themed', n, 'original graphics (gb0001-gb0020)');
