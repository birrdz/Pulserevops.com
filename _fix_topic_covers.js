// Regenerate specific TOPIC covers (gradient-fallback placeholders) with real Pollinations photos + vintage grade.
// Overwrites /assets/topics/<slug>.jpg in place (no delete). Usage: node _fix_topic_covers.js buildouts coaching ...
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/topics';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const PTOK = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
let window = {}; eval(fs.readFileSync(WD + '/home-v2-data.js', 'utf8')); const T = window.PULSE_TAX || [];
const slug = href => String(href).replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'x';
// build slug -> label(q) map exactly like the generator, plus the hub tiles
const Q = { _topics: 'a colorful stack of vintage magazines on many topics', _home: 'a vintage newsroom with a printing press', _search: 'a vintage magnifying glass on an old desk', _hire: 'a confident fractional chief revenue officer executive in a modern glass boardroom' };
T.forEach(c => (c.subs || []).forEach(s => (s.items || []).forEach(it => { if (it && it[1] && !/knowledge|library/i.test(it[0] || '')) Q[slug(it[1])] = it[0]; })));
const S = 760, sleep = ms => new Promise(r => setTimeout(r, ms));
const flux = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no signs, no poster, no flyer, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const h = (PTOK && /image\.pollinations\.ai/.test(u)) ? { Authorization: 'Bearer ' + PTOK } : {}; const r = await fetch(u, { headers: h, signal: AbortSignal.timeout(80000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
function overlaySVG(S) { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }
(async () => {
  const slugs = process.argv.slice(2);
  for (const sg of slugs) {
    const q = Q[sg] || sg.replace(/-/g, ' ');
    let seed = 0; for (const ch of sg) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    let img = null; for (let t = 0; t < 8 && !img; t++) { img = await grab(flux(q, seed % 99999 + t + 700)); if (!img) { console.log('  ' + sg + ' retry ' + (t + 1)); await sleep(6000); } }
    if (!img) { console.log('FAIL ' + sg + ' (no flux) <- ' + q); continue; }
    const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
    await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 86, mozjpeg: true }).toFile(DIR + '/' + sg + '.jpg');
    console.log('FIXED ' + sg + ' ' + fs.statSync(DIR + '/' + sg + '.jpg').size + 'B  <- ' + q);
  }
  console.log('done');
})().catch(e => { console.log('FATAL', e && e.message); process.exit(1); });
