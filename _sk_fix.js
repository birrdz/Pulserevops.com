// Save Skincare picks, re-query the flagged ones with a beauty/editorial artistic angle, regrade, rebuild sampler5.
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const map = JSON.parse(fs.readFileSync('_cat_candidates5.json', 'utf8'));
const K = '_cat_reference5.json'; let ref = {}; try { ref = JSON.parse(fs.readFileSync(K, 'utf8')); } catch (e) {}
const OUT = 'assets/qa/_prev';
const PICKS = { 1: 3, 3: 1, 5: 1, 7: 2, 8: 3, 9: 3, 14: 1, 15: 2 };
const BAD = [2, 4, 6, 10, 11, 12, 13];
const MODS = ['fine art', 'painterly', 'oil painting', 'editorial moody', 'macro glowing', 'cinematic soft'];
function subj(t) { return String(t).replace(/[?"]/g, '').replace(/^(the\s+\d+\s+best|top\s+\d+|top\s+ten|the\s+best|how\s+do\s+you|how\s+to|what\s+(is|are)|what's|why|when|where|which)\s+/i, '').replace(/\s+in\s+20\d\d/i, '').replace(/\s+/g, ' ').trim(); }
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 4000 ? b : null; } catch (e) { return null; } }
(async () => {
  // save picks
  for (const [q, img] of Object.entries(PICKS)) { const key = 'SK-' + q; const e = map[key] || {}; if (e.id) ref[e.id] = { cat: 'sk', key, img, url: (e.urls || [])[img - 1] }; }
  fs.writeFileSync(K, JSON.stringify(ref, null, 2));
  // requery bad
  const idx = await store.get('_index.json', { type: 'json' });
  const ents = (idx.entries || []).filter(e => e && e.id && e.id.startsWith('sk') && !/^vq_/i.test(e.id)).sort((a, b) => a.id.localeCompare(b.id)).slice(0, 15);
  for (const q of BAD) {
    const key = 'SK-' + q; const e = ents[q - 1]; if (!e) continue;
    const query = 'fine art beauty skincare ' + subj(e.question) + ' spa glowing ' + MODS[q % MODS.length];
    let arr = []; try { arr = await ddgImages(query); } catch (x) {}
    const urls = (arr || []).slice(0, 5).map(x => x.image);
    map[key] = { id: e.id, urls, q: query };
    for (let i = 0; i < 5; i++) { const dest = path.join(OUT, `cat-${key}-${i + 1}.jpg`); const raw = urls[i] ? await grab(urls[i]) : null; try { if (raw) await storeGradedImage(raw, dest, { width: 420, bright: false }); else if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch (x) {} }
    console.log('  requeried ' + key + ' [' + query + ']');
  }
  fs.writeFileSync('_cat_candidates5.json', JSON.stringify(map));
  // rebuild sampler5
  const NAMES = { SP: 'Sports', TV: 'TV Shows', CR: 'Crabbing', BS: 'Book Summaries', SK: 'Skincare', SW: 'Watersports', CL: 'Clubs', NL: 'Nightlife' };
  const keys = Object.keys(map).sort((a, b) => { const [ta, na] = a.split('-'), [tb, nb] = b.split('-'); return ta === tb ? (+na - +nb) : ta.localeCompare(tb); });
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Crop 5 (graded)</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:14px;color:#FFB81C}h1.cat{font-size:20px;margin:26px 0 4px;border-top:2px solid #FFB81C55;padding-top:14px}h2{font-size:13px;margin:12px 0 5px;font-style:italic}.row{display:flex;gap:8px;flex-wrap:wrap}.c{position:relative;width:200px;height:170px;background:#000;border-radius:6px;overflow:hidden}.c img{width:100%;height:100%;object-fit:contain}.c.pk img{outline:3px solid #4ade80}.n{position:absolute;top:5px;left:5px;background:#000d;color:#FFB81C;font-weight:800;font-size:12px;padding:3px 7px;border-radius:5px;z-index:2}.miss{color:#f87171;font-size:11px;padding:20px}</style><body><h1 style=font-size:15px>Crop 5 — GRADED. Green=picked. Say badge e.g. "SK-2/3".</h1>';
  let lastTag = '';
  for (const key of keys) { const tag = key.split('-')[0]; if (tag !== lastTag) { html += '<h1 class=cat>' + (NAMES[tag] || tag) + '</h1>'; lastTag = tag; }
    const id = map[key].id; const on = ref[id] ? ref[id].img : 0;
    html += '<h2>' + key + (on ? ' ✓' : '') + '</h2><div class=row>';
    for (let i = 1; i <= 5; i++) { const p = 'assets/qa/_prev/cat-' + key + '-' + i + '.jpg'; const ok = fs.existsSync(p); html += '<div class="c' + (on === i ? ' pk' : '') + '"><span class=n>' + key + '/' + i + '</span>' + (ok ? '<img loading=lazy src="/' + p + '">' : '<span class=miss>n/a</span>') + '</div>'; }
    html += '</div>';
  }
  fs.writeFileSync('_cat_sampler5.html', html + '</body>');
  console.log('DONE — SK picks saved + flagged requeried. crop5 total:', Object.keys(ref).length);
})().catch(e => console.log('ERR', e.message));
