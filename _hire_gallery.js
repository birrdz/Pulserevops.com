// Graded candidate gallery for the 8 /hire page tiles so owner can pick a background image for each.
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const OUT = 'assets/qa/_prev';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const TILES = [
  ['BOOK', 'Book a Call', 'artistic business meeting handshake office cinematic moody fine art'],
  ['HIRE', 'Hire a Fractional CRO', 'artistic executive business leader boardroom cinematic moody fine art'],
  ['RESUME', 'Resume', 'artistic professional office desk documents cinematic moody fine art'],
  ['LINKEDIN', 'Kory White / LinkedIn', 'artistic professional businessman portrait cinematic moody fine art'],
  ['SYNDICATE', 'CRO Syndicate', 'artistic corporate team business firm skyline cinematic moody fine art'],
  ['ABOUT', 'About the Syndicate', 'artistic business team collaboration office cinematic moody fine art'],
  ['CONTACT', 'Contact', 'artistic business communication office desk phone cinematic moody fine art'],
  ['TOOLS', 'CRO Tools', 'artistic business analytics data abstract technology cinematic moody fine art'],
];
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 4000 ? b : null; } catch (e) { return null; } }
(async () => {
  const map = {};
  for (const [tag, name, query] of TILES) {
    let arr = []; try { arr = await ddgImages(query); } catch (x) {}
    const urls = (arr || []).slice(0, 5).map(x => x.image);
    map[tag] = { name, urls };
    for (let i = 0; i < 5; i++) { const dest = path.join(OUT, `hire-${tag}-${i + 1}.jpg`); const raw = urls[i] ? await grab(urls[i]) : null; try { if (raw) await storeGradedImage(raw, dest, { width: 420, bright: false }); else if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch (x) {} }
    console.log('  ' + name);
  }
  fs.writeFileSync('_hire_candidates.json', JSON.stringify(map));
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>/hire tiles</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:14px;color:#FFB81C}h2{font-size:14px;margin:18px 0 6px;font-style:italic}.row{display:flex;gap:8px;flex-wrap:wrap}.c{position:relative;width:200px;height:150px;background:#000;border-radius:6px;overflow:hidden}.c img{width:100%;height:100%;object-fit:cover}.n{position:absolute;top:5px;left:5px;background:#000d;color:#FFB81C;font-weight:800;font-size:12px;padding:3px 7px;border-radius:5px;z-index:2}.miss{color:#f87171;font-size:11px;padding:20px}</style><body><h1 style=font-size:15px>/hire tiles — GRADED. Say badge e.g. "HIRE/2".</h1>';
  for (const [tag, name] of TILES.map(t => [t[0], t[1]])) {
    html += '<h2>' + tag + ' — ' + name + '</h2><div class=row>';
    for (let i = 1; i <= 5; i++) { const p = 'assets/qa/_prev/hire-' + tag + '-' + i + '.jpg'; const ok = fs.existsSync(p); html += '<div class=c><span class=n>' + tag + '/' + i + '</span>' + (ok ? '<img loading=lazy src="/' + p + '">' : '<span class=miss>n/a</span>') + '</div>'; }
    html += '</div>';
  }
  fs.writeFileSync('_hire_sampler.html', html + '</body>');
  console.log('DONE — http://localhost:8891/_hire_sampler.html');
})().catch(e => console.log('ERR', e.message));
