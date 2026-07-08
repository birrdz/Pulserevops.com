// Preview: generate a few Aquarium Q&A face cards (vintage Pollinations photo + gold bottom title = the
// question) so the owner can verify the pillar template before we roll it out.
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const flux = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(80000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function overlaySVG(S) {
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>');
}
function titleSVG(S, text) {
  const words = String(text).split(/\s+/).filter(Boolean), lines = []; let cur = '';
  words.forEach(w => { if ((cur + ' ' + w).trim().length > 22 && cur) { lines.push(cur.trim()); cur = w; } else cur = (cur + ' ' + w).trim(); });
  if (cur) lines.push(cur); const L = lines.slice(-3);
  const F = Math.round(S * 0.072), lh = Math.round(F * 1.04), y0 = S - Math.round(S * 0.05) - (L.length - 1) * lh;
  const ts = L.map((l, i) => '<text x="' + Math.round(S * 0.04) + '" y="' + (y0 + i * lh) + '" font-family="Georgia,serif" font-style="italic" font-weight="800" font-size="' + F + '" fill="#EAC15C">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/></linearGradient><filter id="d"><feDropShadow dx="0" dy="1" stdDeviation="3" flood-color="#000" flood-opacity="0.9"/></filter></defs><rect width="' + S + '" height="' + S + '" fill="url(#s)"/><g filter="url(#d)">' + ts + '</g></svg>');
}
(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const aq = (idx.entries || []).filter(e => e && /^aq\d+$/.test(e.id) && e.question).slice(0, 4);
  console.log('picked:', aq.map(e => e.id).join(', '));
  const S = 380, tiles = [];
  for (const e of aq) {
    let seed = 0; for (const ch of e.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    let img = null; for (let t = 0; t < 5 && !img; t++) { img = await grab(flux(e.question, seed % 99999 + t)); if (!img) await new Promise(r => setTimeout(r, 5000)); }
    const base = img ? await sharp(img).resize(S, S, { fit: 'cover' }).modulate({ saturation: 1.1, brightness: 1.1 }).toBuffer()
      : await sharp({ create: { width: S, height: S, channels: 3, background: '#0e7c86' } }).jpeg().toBuffer();
    tiles.push(await sharp(base).composite([{ input: overlaySVG(S) }, { input: titleSVG(S, e.question) }]).toBuffer());
    console.log('  made', e.id, img ? '' : '(no photo)');
  }
  while (tiles.length < 4) tiles.push(await sharp({ create: { width: S, height: S, channels: 3, background: '#111' } }).jpeg().toBuffer());
  await sharp({ create: { width: S * 2 + 12, height: S * 2 + 12, channels: 3, background: '#0a0806' } }).composite([
    { input: tiles[0], top: 0, left: 0 }, { input: tiles[1], top: 0, left: S + 12 },
    { input: tiles[2], top: S + 12, left: 0 }, { input: tiles[3], top: S + 12, left: S + 12 }
  ]).jpeg({ quality: 88 }).toFile(WD + '/_preview_aq.jpg');
  console.log('preview written');
})().catch(e => { console.log('ERR', e && e.message); process.exit(1); });
