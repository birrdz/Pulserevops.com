// _skim_covers.js — HOMEPAGE "FOYER" SKIM: pollinator-flux the ~40 newest-per-pillar tiles that fill the
// main page's first view, FAST (owner 2026-07-03: "put extra resources, do 2-3 in parallel just for these
// 40, then go back to 1.5x one-at-a-time on aquariums, deploy after the foyer is done"). Round-robins
// newest-of-each-pillar so the homepage's freshest cross-pillar tiles all flip. Skips already cover_src flux.
// Workers generate the jpgs in PARALLEL, then ONE batched _index.json stamp (no per-cover clobber).
// Env: SKIM_LIMIT (40), SKIM_PAR (3), SKIM_LAP (1 = newest per pillar). Stop: _skim_covers_stop.flag.
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const LIMIT = parseInt(process.env.SKIM_LIMIT || '40', 10), PAR = parseInt(process.env.SKIM_PAR || '3', 10), LAP = parseInt(process.env.SKIM_LAP || '1', 10);
const STOP = WD + '/_skim_covers_stop.flag', S = 760;
const PTOK = process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fluxUrl = (q, seed) => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=' + seed;
async function grab(u) { try { const h = PTOK ? { Authorization: 'Bearer ' + PTOK } : {}; const r = await fetch(u, { headers: h, signal: AbortSignal.timeout(90000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; } }
function overlaySVG(S) { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }
const coverPath = id => DIR + '/' + id + '.jpg';
const coverFileOk = id => { try { return fs.statSync(coverPath(id)).size > 40000; } catch (e) { return false; } };
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && e.question);
  const byP = {};
  for (const e of es) { const p = (e.id.match(/^[a-z]+/) || [''])[0]; if (!/^[a-z]{2,3}$/.test(p) || p === 'vq') continue; (byP[p] = byP[p] || []).push(e); }
  const pillars = Object.keys(byP).sort((a, b) => byP[a].length - byP[b].length);
  const tops = {}; for (const p of pillars) tops[p] = byP[p].slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, LAP);
  const work = [];
  for (let lap = 0; lap < LAP; lap++) for (const p of pillars) if (tops[p][lap]) work.push(tops[p][lap]);
  const pick = work.slice(0, LIMIT);
  const coverSrc = {}; for (const e of es) coverSrc[e.id] = e.cover_src || null;
  const todo = pick.filter(e => !(coverSrc[e.id] === 'flux' && coverFileOk(e.id)));
  console.log('[skim] foyer = ' + pick.length + ' newest-per-pillar tiles · ' + (pick.length - todo.length) + ' already flux · ' + todo.length + ' to build · ' + PAR + ' parallel');
  let qi = 0, fail = 0; const doneIds = [];
  async function worker(w) {
    while (qi < todo.length) {
      if (fs.existsSync(STOP)) return;
      const e = todo[qi++]; let seed = 0; for (const ch of e.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
      let img = null; for (let t = 0; t < 8 && !img; t++) { img = await grab(fluxUrl(e.question, seed % 99999 + t)); if (!img) await sleep(3500); }
      if (!img) { fail++; console.log('  [skim] ✗ ' + e.id + ' (flux throttled)'); continue; }
      try {
        const base = await sharp(img).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer();
        await sharp(base).composite([{ input: overlaySVG(S) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(coverPath(e.id));
        doneIds.push(e.id); console.log('  [skim] ' + doneIds.length + '/' + todo.length + ' ' + e.id + ' [' + (e.id.match(/^[a-z]+/) || [''])[0] + '] ' + String(e.question).slice(0, 46));
      } catch (x) { fail++; console.log('  [skim] grade-fail ' + e.id + ' ' + x.message); }
    }
  }
  await Promise.all(Array.from({ length: PAR }, (_, w) => worker(w)));
  // ONE batched index stamp (avoids parallel clobber)
  if (doneIds.length) {
    const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const set = new Set(doneIds);
    for (const e of (fresh.entries || [])) { if (e && set.has(e.id)) { e.img = '/assets/qa/' + e.id + '.jpg'; e.cover_src = 'flux'; } }
    await store.setJSON('_index.json', fresh);
  }
  console.log('[skim] FOYER DONE · built ' + doneIds.length + ' · failed ' + fail + ' (rerun to catch failures)');
})().catch(e => { console.log('[skim] FATAL', e && e.message); process.exit(1); });
