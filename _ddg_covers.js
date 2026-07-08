// DDG-sourced aquarium covers: real-photo search + SAME vintage grade as _gen_qa_covers. No Pollinations, no throttle.
// Usage: node _ddg_covers.js <prefix> <limit>   e.g. node _ddg_covers.js aq 50
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PREFIX = (process.argv[2] || 'aq'), LIMIT = parseInt(process.argv[3] || '50', 10);
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) { console.log('img-search-lib load fail', e.message); }
const S = 760, usedUrl = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
function overlaySVG(S) { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }
async function ddgBuf(q, id) { if (!searchRealPhoto) return null; try { const pk = await searchRealPhoto(q, id, { skipRefine: true }); if (pk && pk.img && !usedUrl.has(pk.img)) { const b = await grab(pk.img); if (b) { usedUrl.add(pk.img); return b; } } } catch (e) {} return null; }
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const missing = (idx.entries || []).filter(e => e && e.id && new RegExp('^' + PREFIX + '\\d+$').test(e.id) && e.question && !fs.existsSync(DIR + '/' + e.id + '.jpg')).slice(0, LIMIT);
  console.log('[ddg-covers] ' + PREFIX + ': ' + missing.length + ' missing to try (DDG)');
  let made = 0, qi = 0;
  async function worker() {
    while (qi < missing.length) {
      const e = missing[qi++], out = DIR + '/' + e.id + '.jpg';
      if (fs.existsSync(out)) continue;
      const img = await ddgBuf(e.question, e.id);
      if (!img) { console.log('  skip ' + e.id + ' (no DDG photo)  <- ' + e.question); continue; }
      try {
        const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
        await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
        made++; console.log('  ' + made + ' ' + e.id + ' [ddg] ' + fs.statSync(out).size + 'B  <- ' + e.question);
      } catch (x) { console.log('  fail ' + e.id + ' ' + x.message); }
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  // re-point index at all covers made
  const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ch = 0; for (const en of (fresh.entries || [])) { if (en && new RegExp('^' + PREFIX + '\\d+$').test(en.id) && fs.existsSync(DIR + '/' + en.id + '.jpg')) { const u = '/assets/qa/' + en.id + '.jpg'; if (en.img !== u) { en.img = u; ch++; } } }
  if (ch) await store.setJSON('_index.json', fresh);
  console.log('[ddg-covers] DONE — made ' + made + ', index repointed +' + ch);
})().catch(e => { console.log('[ddg-covers] FATAL', e && e.message); process.exit(1); });
