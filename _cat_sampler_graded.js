// Rebuild the category sampler with GRADED previews (v2 GRADED PREVIEW LAW).
// Reuses the already-fetched candidate URLs in _cat_candidates.json, fetches each, runs it
// through the ONE choke point (storeGradedImage, thumbnail), and shows the FILTERED result.
const fs = require('fs');
const path = require('path');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { storeGradedImage } = require('./_ddg_facecard_lib');
const map = JSON.parse(fs.readFileSync('_cat_candidates.json', 'utf8'));
const OUT = 'assets/qa/_prev';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const NAMES = { SY: 'Style', CA: 'Cars', AQ: 'Aquariums', ED: 'Advice' };
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 4000 ? b : null; } catch (e) { return null; } }

// simple concurrency pool
async function pool(items, n, fn) { const out = []; let i = 0; const workers = Array.from({ length: n }, async () => { while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); } }); await Promise.all(workers); return out; }

(async () => {
  const jobs = [];
  for (const key of Object.keys(map)) { (map[key].urls || []).forEach((u, i) => jobs.push({ key, i, u })); }
  console.log('grading', jobs.length, 'candidate thumbnails...');
  let done = 0, ok = 0;
  const graded = {};   // key -> [localpath|null,...]
  await pool(jobs, 6, async (j) => {
    graded[j.key] = graded[j.key] || [];
    const raw = await grab(j.u);
    if (raw) {
      const dest = path.join(OUT, `cat-${j.key}-${j.i + 1}.jpg`);
      try { await storeGradedImage(raw, dest, { width: 420, bright: false }); graded[j.key][j.i] = '/' + dest.replace(/\\/g, '/'); ok++; }
      catch (e) { graded[j.key][j.i] = null; }
    } else graded[j.key][j.i] = null;
    if (++done % 40 === 0) console.log('  ...' + done + '/' + jobs.length);
  });
  // build gallery
  const keys = Object.keys(map).sort((a, b) => { const [ta, na] = a.split('-'), [tb, nb] = b.split('-'); return ta === tb ? (+na - +nb) : ta.localeCompare(tb); });
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Category sampler (graded)</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:14px;color:#FFB81C}h1.cat{font-size:20px;margin:26px 0 4px;border-top:2px solid #FFB81C55;padding-top:14px}h2{font-size:13px;margin:12px 0 5px;font-style:italic}.q{opacity:.5;font-size:10px}.row{display:flex;gap:8px;flex-wrap:wrap}.c{position:relative;width:200px;height:170px;background:#000;border-radius:6px;overflow:hidden}.c img{width:100%;height:100%;object-fit:contain}.n{position:absolute;top:5px;left:5px;background:#000d;color:#FFB81C;font-weight:800;font-size:12px;padding:3px 7px;border-radius:5px;z-index:2}.miss{color:#f87171;font-size:11px;padding:20px}</style><body><h1 style=font-size:15px>Pulse sampler — GRADED (the finished look). Say badge e.g. "CA-3/2".</h1>';
  let lastTag = '';
  for (const key of keys) { const tag = key.split('-')[0]; if (tag !== lastTag) { html += '<h1 class=cat>' + (NAMES[tag] || tag) + '</h1>'; lastTag = tag; }
    html += '<h2>' + key + '</h2><div class=row>';
    (graded[key] || []).forEach((p, i) => { html += '<div class=c><span class=n>' + key + '/' + (i + 1) + '</span>' + (p ? '<img loading=lazy src="' + p + '">' : '<span class=miss>n/a</span>') + '</div>'; });
    html += '</div>';
  }
  fs.writeFileSync('_cat_sampler.html', html + '</body>');
  console.log(`DONE — ${ok}/${jobs.length} graded. http://localhost:8891/_cat_sampler.html`);
})().catch(e => console.log('ERR', e.message));
