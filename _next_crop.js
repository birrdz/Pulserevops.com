// Build the NEXT crop of category samplers, GRADED from the start (v2 preview law).
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const OUT = 'assets/qa/_prev';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
// tag -> [prefix, friendly name, query fn]
const CATS = [
  ['SP', 'sp', 'Famous Speeches', s => 'artistic ' + s + ' historic speech oration vintage dramatic fine art'],
  ['TV', 'tv', 'Vacation Destinations', s => 'artistic ' + s + ' travel tropical scenic cinematic moody fine art'],
  ['SW', 'sw', 'Software', s => 'artistic ' + s + ' software technology abstract office cinematic moody'],
  ['SK', 'sk', 'Skill Drills', s => 'artistic ' + s + ' sales training business office cinematic moody fine art'],
];
function subj(t) { return String(t).replace(/[?"]/g, '').replace(/^(the\s+\d+\s+best|top\s+\d+|top\s+ten|the\s+best|how\s+do\s+you|how\s+to|what\s+(is|are)|what's|why|when|where|which)\s+/i, '').replace(/\s+of\s+all\s+time.*$/i, '').replace(/\s+in\s+20\d\d/i, '').replace(/\s+/g, ' ').trim(); }
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 4000 ? b : null; } catch (e) { return null; } }

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const map = {};
  for (const [tag, prefix, name, qfn] of CATS) {
    const ents = (idx.entries || []).filter(e => e && e.id && e.id.startsWith(prefix) && !/^vq_/i.test(e.id)).sort((a, b) => a.id.localeCompare(b.id)).slice(0, 15);
    let n = 0;
    for (const e of ents) {
      n++; const key = tag + '-' + n; const query = qfn(subj(e.question));
      let arr = []; try { arr = await ddgImages(query); } catch (x) {}
      const urls = (arr || []).slice(0, 5).map(x => x.image);
      map[key] = { id: e.id, urls, q: query };
      for (let i = 0; i < 5; i++) { const dest = path.join(OUT, `cat-${key}-${i + 1}.jpg`); const raw = urls[i] ? await grab(urls[i]) : null; try { if (raw) await storeGradedImage(raw, dest, { width: 420, bright: false }); else if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch (x) {} }
    }
    console.log('  ' + name + ': ' + n);
  }
  fs.writeFileSync('_cat_candidates6.json', JSON.stringify(map));
  const NAMES = Object.fromEntries(CATS.map(c => [c[0], c[2]]));
  const keys = Object.keys(map).sort((a, b) => { const [ta, na] = a.split('-'), [tb, nb] = b.split('-'); return ta === tb ? (+na - +nb) : ta.localeCompare(tb); });
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Crop 2 (graded)</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:14px;color:#FFB81C}h1.cat{font-size:20px;margin:26px 0 4px;border-top:2px solid #FFB81C55;padding-top:14px}h2{font-size:13px;margin:12px 0 5px;font-style:italic}.row{display:flex;gap:8px;flex-wrap:wrap}.c{position:relative;width:200px;height:170px;background:#000;border-radius:6px;overflow:hidden}.c img{width:100%;height:100%;object-fit:contain}.n{position:absolute;top:5px;left:5px;background:#000d;color:#FFB81C;font-weight:800;font-size:12px;padding:3px 7px;border-radius:5px;z-index:2}.miss{color:#f87171;font-size:11px;padding:20px}</style><body><h1 style=font-size:15px>Crop 2 — GRADED. Say badge e.g. "BT-3/2".</h1>';
  let lastTag = '';
  for (const key of keys) { const tag = key.split('-')[0]; if (tag !== lastTag) { html += '<h1 class=cat>' + (NAMES[tag] || tag) + '</h1>'; lastTag = tag; }
    html += '<h2>' + key + '</h2><div class=row>';
    for (let i = 1; i <= 5; i++) { const p = 'assets/qa/_prev/cat-' + key + '-' + i + '.jpg'; const ok = fs.existsSync(p); html += '<div class=c><span class=n>' + key + '/' + i + '</span>' + (ok ? '<img loading=lazy src="/' + p + '">' : '<span class=miss>n/a</span>') + '</div>'; }
    html += '</div>';
  }
  fs.writeFileSync('_cat_sampler6.html', html + '</body>');
  console.log('DONE — crop 6 graded. http://localhost:8891/_cat_sampler6.html');
})().catch(e => console.log('ERR', e.message));
