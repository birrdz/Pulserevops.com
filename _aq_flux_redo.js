// _aq_flux_redo — POLLINATOR-ONLY face-card cover redo (owner 2026-07-03 LAW: covers = flux only, DDG banned).
// Regenerates EVERY <prefix> Q&A cover with Pollinations flux (same /topics grade), overwrites /assets/qa/<id>.jpg,
// and STAMPS the index entry with cover_src:'flux' so DDG-built covers are detectable and this run is resumable.
// Flux is SERIALIZED (1 request in flight) to respect the "max 1 queued per IP" throttle — slow on purpose (owner: "I want it that way").
// Usage: node _aq_flux_redo.js <prefix> [limit]      e.g. node _aq_flux_redo.js aq
//   FORCE_ALL=1  -> redo even entries already stamped cover_src:'flux' (default: skip them = resume).
// Stop: create _aq_flux_redo_stop.flag in the website dir. Log OUTSIDE the publish root (scratchpad) so deploys don't 422.
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PREFIX = (process.argv[2] || 'aq'), LIMIT = parseInt(process.argv[3] || '99999', 10);
const FORCE_ALL = process.env.FORCE_ALL === '1';
const PTOK = process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';
const S = 760;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const flux = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const h = (PTOK && /image\.pollinations\.ai/.test(u)) ? { Authorization: 'Bearer ' + PTOK } : {}; const r = await fetch(u, { headers: h, signal: AbortSignal.timeout(90000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
function overlaySVG(S) { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }
(async () => {
  let idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rx = new RegExp('^' + PREFIX + '\\d+$');
  const ents = (idx.entries || []).filter(e => e && e.id && rx.test(e.id) && e.question).slice(0, LIMIT);
  const todo = ents.filter(e => FORCE_ALL || e.cover_src !== 'flux');
  console.log('[aq-flux-redo] ' + PREFIX + ': ' + ents.length + ' Q&As · ' + todo.length + ' to (re)build with flux · ' + (ents.length - todo.length) + ' already flux-stamped');
  let done = 0, fail = 0;
  for (let i = 0; i < todo.length; i++) {
    if (fs.existsSync(WD + '/_aq_flux_redo_stop.flag')) { console.log('[aq-flux-redo] STOP flag — halting at ' + i + '/' + todo.length); break; }
    const e = todo[i];
    let seed = 0; for (const ch of e.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    let img = null;
    for (let t = 0; t < 10 && !img; t++) { img = await grab(flux(e.question, seed % 99999 + t)); if (!img) { console.log('  ' + e.id + ' retry ' + (t + 1) + '/10 (throttle/gen)'); await sleep(4000); } }  // 1.5× profile: 6000->4000 retry backoff (still 1-at-a-time)
    if (!img) { fail++; console.log('  ✗ ' + e.id + ' FAILED after 10 tries — left as-is, retry next run'); continue; }
    try {
      const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
      await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(DIR + '/' + e.id + '.jpg');
      const sz = fs.statSync(DIR + '/' + e.id + '.jpg').size;
      // stamp provenance + repoint img on a FRESH strong read so we never clobber concurrent index writes
      idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const live = (idx.entries || []).find(x => x && x.id === e.id);
      if (live) { live.img = '/assets/qa/' + e.id + '.jpg'; live.cover_src = 'flux'; live.cover_flux_at = i; await store.setJSON('_index.json', idx); }
      done++;
      console.log('  ✓ ' + done + '/' + todo.length + ' ' + e.id + ' [flux] ' + Math.round(sz / 1024) + 'KB  <-  ' + String(e.question).slice(0, 60));
    } catch (x) { fail++; console.log('  ✗ ' + e.id + ' grade-fail ' + x.message); }
    await sleep(350); // brief breather between images (1.5× profile: 800->350; still strictly 1-at-a-time)
  }
  console.log('[aq-flux-redo] DONE ' + PREFIX + ' · rebuilt ' + done + ' · failed ' + fail + ' (rerun to catch failures)');
})().catch(e => { console.log('[aq-flux-redo] FATAL', e && e.message); process.exit(1); });
