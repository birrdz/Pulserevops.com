// _pillar_images_flux.js <prefix> [limit] — redo a pillar's FACE-CARD COVER **and every INTERNAL Q&A image**
// with Pollinations flux (owner 2026-07-04: match the new direction, NO DuckDuckGo). One-at-a-time
// (serialized flux), resumable (skips entries stamped imgs_flux), stop: _pillar_images_flux_stop.flag.
// Cover keeps the vintage face-card grade (/assets/qa/<id>.jpg); internal images = clean warm flux
// (/assets/qa/<id>-N.jpg). Only image URLs in the body are rewritten — all other content is untouched.
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', QDIR = WD + '/assets/qa';
if (!fs.existsSync(QDIR)) fs.mkdirSync(QDIR, { recursive: true });
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PREFIX = process.argv[2] || 'ce', LIMIT = parseInt(process.argv[3] || '99999', 10);
const STOP = WD + '/_pillar_images_flux_stop.flag';
const PTOK = process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';
const S = 760, sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = s => String(s || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
const fluxUrl = q => 'https://image.pollinations.ai/prompt/' + encodeURIComponent(('a realistic candid documentary color photograph of ' + q + ', natural light, cinematic, detailed, no text, no words, no letters, no watermark').slice(0, 340)) + '?width=760&height=760&nologo=true&enhance=true&model=flux&seed=';
async function grab(seed, q) { for (let t = 0; t < 8; t++) { try { const h = PTOK ? { Authorization: 'Bearer ' + PTOK } : {}; const r = await fetch(fluxUrl(q) + ((seed + t) % 99999), { headers: h, signal: AbortSignal.timeout(90000) }); if (r.ok && (r.headers.get('content-type') || '').startsWith('image')) { const b = Buffer.from(await r.arrayBuffer()); if (b.length > 3000) return b; } } catch (e) {} await sleep(4000); } return null; }
function overlaySVG() { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + S + '" height="' + S + '"><defs><radialGradient id="v" cx="0.5" cy="0.45" r="0.95"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter></defs><rect width="' + S + '" height="' + S + '" fill="#6b4a1e" opacity="0.08"/><rect width="' + S + '" height="' + S + '" fill="url(#v)"/><rect width="' + S + '" height="' + S + '" filter="url(#grain)" opacity="0.42"/></svg>'); }
// serialize ALL flux so only 1 request is ever in flight (throttle)
let lock = Promise.resolve();
function serial(fn) { const p = lock; let rel; lock = new Promise(r => rel = r); return p.then(fn).finally(() => rel()); }
const hash = id => { let s = 0; for (const c of String(id)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return s; };
const coverFileOk = id => { try { return fs.statSync(QDIR + '/' + id + '.jpg').size > 40000; } catch (e) { return false; } };
async function makeCover(id, q) { const b = await grab(hash(id), q); if (!b) return false; const base = await sharp(b).resize(S, S, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.07, brightness: 1.16 }).toBuffer(); await sharp(base).composite([{ input: overlaySVG() }]).jpeg({ quality: 84, mozjpeg: true }).toFile(QDIR + '/' + id + '.jpg'); return true; }
async function makeContent(id, n, alt) { const b = await grab(hash(id) + n * 101, clean(alt) || 'documentary scene'); if (!b) return null; await sharp(b).resize(1024, 1024, { fit: 'cover', position: 'centre' }).modulate({ saturation: 1.04, brightness: 1.08 }).jpeg({ quality: 82, mozjpeg: true }).toFile(QDIR + '/' + id + '-' + n + '.jpg'); return '/assets/qa/' + id + '-' + n + '.jpg'; }
async function replaceAsync(str, re, fn) { const parts = []; let last = 0, m; re.lastIndex = 0; while ((m = re.exec(str))) { parts.push(str.slice(last, m.index)); parts.push(await fn(m)); last = m.index + m[0].length; if (m[0] === '') re.lastIndex++; } parts.push(str.slice(last)); return parts.join(''); }
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ents = (idx.entries || []).filter(e => e && e.id && new RegExp('^' + PREFIX + '\\d+$').test(e.id) && e.question).slice(0, LIMIT);
  console.log('[imgflux] ' + PREFIX + ': ' + ents.length + ' entries · redo cover + internal images (flux)');
  let done = 0, fail = 0;
  for (const e of ents) {
    if (fs.existsSync(STOP)) { console.log('[imgflux] STOP'); break; }
    if (e.imgs_flux) { continue; }                                        // resumable
    const blob = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
    if (!blob || !blob.answer) { continue; }
    let body = blob.answer, n = 0, imgErr = false;
    // 1) face-card cover — skip if already a valid flux cover (aq covers already done)
    const okCover = (e.cover_src === 'flux' && coverFileOk(e.id)) ? true : await serial(() => makeCover(e.id, e.question));
    if (!okCover) { fail++; console.log('  ✗ ' + e.id + ' cover flux failed — skip (retry next run)'); continue; }
    // 2) markdown images: hero (#1) -> the cover; the rest -> fresh flux content images
    body = await replaceAsync(body, /!\[([^\]]*)\]\(([^)\s]+)\)/g, async (m) => {
      n++;
      if (n === 1) return '![' + (m[1] || e.question).replace(/[\[\]]/g, '') + '](/assets/qa/' + e.id + '.jpg)';
      if (/\/assets\/qa\//.test(m[2])) return m[0];        // already a flux internal image → keep (gap-fill reruns fast)
      const p = await serial(() => makeContent(e.id, n, m[1] || e.question));
      if (!p) { imgErr = true; return m[0]; }
      return '![' + (m[1] || '').replace(/[\[\]]/g, '') + '](' + p + ')';
    });
    // 3) @@PRODUCT img="..." cards (Top-10) -> flux from the product name
    body = await replaceAsync(body, /(@@PRODUCT\b[^\n]*?\bimg=")([^"]+)(")/g, async (m) => {
      n++;
      if (/\/assets\/qa\//.test(m[2])) return m[0];        // already flux → keep (gap-fill reruns fast)
      const nm = (m[0].match(/name="([^"]+)"/) || [])[1] || (m[0].match(/title="([^"]+)"/) || [])[1] || e.question;
      const p = await serial(() => makeContent(e.id, n, nm));
      if (!p) { imgErr = true; return m[0]; }
      return m[1] + p + m[3];
    });
    await store.setJSON('answers/' + e.id + '.json', Object.assign({}, blob, { answer: body, updated_at: new Date().toISOString() }));
    // stamp index: cover flux + (only if all internal images succeeded) imgs_flux for resume
    const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const le = (fresh.entries || []).find(x => x && x.id === e.id);
    if (le) { le.img = '/assets/qa/' + e.id + '.jpg'; le.cover_src = 'flux'; if (!imgErr) le.imgs_flux = true; await store.setJSON('_index.json', fresh); }
    done++; console.log('  ✓ ' + done + ' ' + e.id + ' · ' + (n) + ' imgs' + (imgErr ? ' (some flux gaps — retry next run)' : '') + ' · ' + clean(e.question).slice(0, 44));
  }
  console.log('[imgflux] DONE ' + PREFIX + ' · ' + done + ' entries · ' + fail + ' cover-fail');
})().catch(e => { console.log('[imgflux] FATAL', e && e.message); process.exit(1); });
