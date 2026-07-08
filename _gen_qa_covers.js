// _gen_qa_covers — generate a vintage face-card cover per Q&A in a pillar (owner 2026-07-03): Pollinations
// photo from the question + the SAME vintage grade as topics; saves /assets/qa/<id>.jpg and points the
// entry's index `img` at it so the pillar + homepage tiles use it (gold title stays a CSS overlay).
// Usage: node _gen_qa_covers.js <prefix> <limit>   e.g. node _gen_qa_covers.js aq 40
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PREFIX = (process.argv[2] || 'aq'), LIMIT = parseInt(process.argv[3] || '99999', 10);
// ALTERNATE Pollinations flux <-> DDG real photos (owner 2026-07-03: "go back and forth between the two").
// DDG is instant (no throttle) so this ~2×'s throughput and halves Pollinations load. Same grade+gold title.
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) {}
const usedUrl = new Set();
async function ddgBuf(q, id) { if (!searchRealPhoto) return null; try { const pk = await searchRealPhoto(q, id, { skipRefine: true }); if (pk && pk.img && !usedUrl.has(pk.img)) { const b = await grab(pk.img); if (b) { usedUrl.add(pk.img); return b; } } } catch (e) {} return null; }
// Flux is SERIALIZED (1 request at a time across all workers) to dodge Pollinations' "max 1 queued per IP" throttle.
// Two quick tries; if still null it's genuinely throttled → caller instantly switches to DDG (owner: "when you hit throttles switch").
let fluxLock = Promise.resolve();
async function fluxBuf(q, seed) {
  const prev = fluxLock; let rel; fluxLock = new Promise(r => rel = r); await prev;
  try { let img = null; for (let t = 0; t < 2 && !img; t++) { img = await grab(flux(q, seed % 99999 + t)); if (!img && t === 0) await sleep(2500); } await sleep(800); return img; }
  finally { rel(); }
}
const flux = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
// Pollinations token (owner registered) → auth header lifts the anonymous throttle. Only sent to pollinations, never DDG.
const PTOK = process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';
async function grab(u) { try { const h = (PTOK && /image\.pollinations\.ai/.test(u)) ? { Authorization: 'Bearer ' + PTOK } : {}; const r = await fetch(u, { headers: h, signal: AbortSignal.timeout(80000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function overlaySVG(S) {
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>');
}
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ents = (idx.entries || []).filter(e => e && e.id && new RegExp('^' + PREFIX + '\\d+$').test(e.id) && e.question).slice(0, LIMIT);
  console.log('[qa-covers] ' + PREFIX + ': ' + ents.length + ' Q&As');
  let made = 0, ph = 0, qi = 0, done = {}, pace = 1500; const S = 760;   // pace = adaptive inter-request sleep (owner: scale back on throttle)
  const FORCE = process.env.FORCE_REDO === '1', madeThisRun = new Set();   // FORCE: overwrite every cover once (pure-pollinator redo), non-destructive
  async function worker() {
    while (qi < ents.length) {
      if (fs.existsSync(WD + '/_gen_qa_covers_stop.flag')) return;
      const myi = qi++, e = ents[myi], out = DIR + '/' + e.id + '.jpg';
      if (fs.existsSync(out)) { done[e.id] = '/assets/qa/' + e.id + '.jpg'; continue; }
      let seed = 0; for (const ch of e.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
      // DDG-ONLY for the bulk run (~21/min, unthrottled). Slow serialized flux is NOT used inline — it dragged the blended
      // rate to ~5/min. DDG gaps are SKIPPED + retried next pass; the few DDG can never match get a flux cleanup pass at the
      // end (owner 2026-07-03: keep it fast + sustainable). Set FLUX_FILL=1 to have flux fill gaps inline (the cleanup pass).
      let img = await ddgBuf(e.question, e.id), src = 'ddg';
      if (!img && process.env.FLUX_FILL === '1') { img = await fluxBuf(e.question, seed); src = 'flux'; }
      if (!img) { console.log('  skip ' + e.id + ' (no DDG photo, retry next pass)'); continue; }
      try {
        // SAME grade + overlay for BOTH sources so DDG and flux covers look identical.
        const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
        await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
        done[e.id] = '/assets/qa/' + e.id + '.jpg'; made++; ph++;
        console.log('  ' + made + ' ' + e.id + ' [' + src + ']');
      } catch (x) { console.log('  fail ' + e.id + ' ' + x.message); }
    }
  }
  // PATIENT: loop passes until every Q&A has a real cover (flux throttle recovers between passes). Each
  // pass re-scans and only regenerates the still-missing ones, and re-points the index at all covers made.
  for (let pass = 0; pass < 60 && !fs.existsSync(WD + '/_gen_qa_covers_stop.flag'); pass++) {
    qi = 0;
    await Promise.all([worker(), worker(), worker()]);   // 3 workers: flux is serialized by fluxLock, DDG runs parallel
    const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let ch = 0;
    for (const en of (fresh.entries || [])) { if (en && new RegExp('^' + PREFIX + '\\d+$').test(en.id) && fs.existsSync(DIR + '/' + en.id + '.jpg')) { const u = '/assets/qa/' + en.id + '.jpg'; if (en.img !== u) { en.img = u; ch++; } } }
    if (ch) await store.setJSON('_index.json', fresh);
    const remaining = ents.filter(e => !fs.existsSync(DIR + '/' + e.id + '.jpg')).length;
    console.log('[qa-covers] pass ' + (pass + 1) + ': indexed +' + ch + ' · ' + remaining + ' still missing');
    if (!remaining) break;
    await sleep(8000);   // brief recovery between passes; DDG-fallback means few stragglers remain
  }
  console.log('[qa-covers] DONE for ' + PREFIX);
})().catch(e => { console.log('[qa-covers] FATAL', e && e.message); process.exit(1); });
