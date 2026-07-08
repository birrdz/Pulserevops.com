// Re-query + grade every UNAPPROVED question across SY/CA/AQ/ED with a fresh artistic angle.
// Approved (in _cat_reference.json) are left untouched. Rebuild the graded sampler after.
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');
const { storeGradedImage } = require('./_ddg_facecard_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const map = JSON.parse(fs.readFileSync('_cat_candidates.json', 'utf8'));
let ref = {}; try { ref = JSON.parse(fs.readFileSync('_cat_reference.json', 'utf8')); } catch (e) {}
const picked = new Set(Object.keys(ref));
const OUT = 'assets/qa/_prev';
const NAMES = { SY: 'Style', CA: 'Cars', AQ: 'Aquariums', ED: 'Advice' };
const TAGS = { SY: 'sy', CA: 'ca', AQ: 'aq', ED: 'ed' };
const MODS = ['fine art painting', 'watercolor painterly', 'oil painting', 'cinematic moody atmospheric', 'vintage illustration', 'dramatic fine art'];
function subj(t) { return String(t).replace(/[?"]/g, '').replace(/^(the\s+\d+\s+best|top\s+\d+|top\s+ten|the\s+best|how\s+do\s+you|how\s+to|what\s+(is|are)|what's|why|when|where|which)\s+/i, '').replace(/\s+of\s+all\s+time.*$/i, '').replace(/\s+in\s+20\d\d/i, '').replace(/\s+/g, ' ').trim(); }
const AQ_GEAR = /filter|heater|skimmer|vacuum|test kit|gravel|pump|light|co2|substrate/i;
function query(tag, q, n) {
  const mod = MODS[n % MODS.length]; const s = subj(q);
  if (tag === 'SY') return 'fine art fashion illustration ' + s + ' painterly portrait ' + mod;
  if (tag === 'CA') return 'artistic ' + s + ' car cinematic ' + mod;
  if (tag === 'AQ') return AQ_GEAR.test(q) ? ('moody planted aquarium underwater scene ' + mod) : ('artistic ' + s + ' aquarium macro moody ' + mod);
  return 'artistic ' + s + ' conceptual ' + mod; // ED
}
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 4000 ? b : null; } catch (e) { return null; } }

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const qById = {}; for (const e of (idx.entries || [])) if (e && e.id) qById[e.id] = e.question || e.id;
  let requeried = 0;
  for (const tag of ['AQ', 'CA', 'ED', 'SY']) {
    for (let q = 1; q <= 12; q++) {
      const key = tag + '-' + q; const cur = map[key]; if (!cur || !cur.id) continue;
      if (picked.has(cur.id)) continue;               // approved -> leave alone
      const question = qById[cur.id] || ''; const query_ = query(tag, question, q);
      let arr = []; try { arr = await ddgImages(query_); } catch (x) {}
      const urls = (arr || []).slice(0, 5).map(x => x.image);
      map[key] = { id: cur.id, urls, q: query_ };
      for (let i = 0; i < 5; i++) { const dest = path.join(OUT, `cat-${key}-${i + 1}.jpg`); const raw = urls[i] ? await grab(urls[i]) : null; try { if (raw) await storeGradedImage(raw, dest, { width: 420, bright: false }); else if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch (x) { try { if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch (y) {} } }
      requeried++; console.log('  ' + key + '  [' + query_ + ']');
    }
  }
  fs.writeFileSync('_cat_candidates.json', JSON.stringify(map));
  // rebuild sampler
  const keys = Object.keys(map).sort((a, b) => { const [ta, na] = a.split('-'), [tb, nb] = b.split('-'); return ta === tb ? (+na - +nb) : ta.localeCompare(tb); });
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Category sampler (graded)</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:14px;color:#FFB81C}h1.cat{font-size:20px;margin:26px 0 4px;border-top:2px solid #FFB81C55;padding-top:14px}h2{font-size:13px;margin:12px 0 5px;font-style:italic}.row{display:flex;gap:8px;flex-wrap:wrap}.c{position:relative;width:200px;height:170px;background:#000;border-radius:6px;overflow:hidden}.c img{width:100%;height:100%;object-fit:contain}.c.pk img{outline:3px solid #4ade80}.n{position:absolute;top:5px;left:5px;background:#000d;color:#FFB81C;font-weight:800;font-size:12px;padding:3px 7px;border-radius:5px;z-index:2}.miss{color:#f87171;font-size:11px;padding:20px}</style><body><h1 style=font-size:15px>Pulse sampler — GRADED. Green=approved. New images on the rest. Say badge e.g. "AQ-1/2".</h1>';
  let lastTag = '';
  for (const key of keys) { const tag = key.split('-')[0]; if (tag !== lastTag) { html += '<h1 class=cat>' + (NAMES[tag] || tag) + '</h1>'; lastTag = tag; }
    const id = map[key].id; const pk = ref[id]; const on = pk ? pk.img : 0;
    html += '<h2>' + key + (on ? ' ✓' : '') + '</h2><div class=row>';
    for (let i = 1; i <= 5; i++) { const p = 'assets/qa/_prev/cat-' + key + '-' + i + '.jpg'; const ok = fs.existsSync(p); html += '<div class="c' + (on === i ? ' pk' : '') + '"><span class=n>' + key + '/' + i + '</span>' + (ok ? '<img loading=lazy src="/' + p + '">' : '<span class=miss>n/a</span>') + '</div>'; }
    html += '</div>';
  }
  fs.writeFileSync('_cat_sampler.html', html + '</body>');
  console.log('DONE — requeried ' + requeried + ' unapproved questions. http://localhost:8891/_cat_sampler.html');
})().catch(e => console.log('ERR', e.message));
