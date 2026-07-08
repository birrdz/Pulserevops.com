// _gen_mosaic_pool.js — prebuild ONE static mosaic pool file so the homepage/topics load fast (owner 2026-07-06).
// Replaces the 43× pulse-machine-library-list fan-out (~2.7s each = ~20s) with a single ~0.1s CDN fetch.
// Pool = entries with a live flux cover (cover_src:'flux') OR quality_score>=13, round-robin by pillar,
// newest+best first, capped POOL total / PER_PILLAR each so no pillar dominates. Regenerate on each deploy.
// Writes: mosaic-pool.json  (fields the mosaic tile needs: id, question, img, cover_src, quality_score, ts)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const POOL = parseInt(process.env.MOSAIC_POOL || '1500', 10);
const PER_PILLAR = parseInt(process.env.MOSAIC_PER_PILLAR || '140', 10);
const TL_CAP = parseInt(process.env.MOSAIC_TL_CAP || '40', 10); // tools pillar is huge — cap harder
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const es = (idx.entries || []).filter(e => e && e.id && e.question && /^[a-z]+\d+$/.test(e.id));
  const showable = es.filter(e => {
    const qs = typeof e.quality_score === 'number' ? e.quality_score : null;
    const isFlux = e.cover_src === 'flux';
    const hasImg = e.img && /\/assets\/qa\//.test(e.img);
    return hasImg && (isFlux || (qs != null && qs >= 13));
  });
  // group by pillar, newest+best first, cap per pillar
  const byP = {};
  for (const e of showable) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; (byP[p] = byP[p] || []).push(e); }
  const score = e => (Number(e.ts) || 0);
  const q = e => (Number(e.quality_score) || 0);
  const pills = Object.keys(byP);
  pills.forEach(p => {
    byP[p].sort((a, b) => (b.cover_src === 'flux' ? 1 : 0) - (a.cover_src === 'flux' ? 1 : 0) || score(b) - score(a) || q(b) - q(a));
    const cap = p === 'tl' ? TL_CAP : PER_PILLAR;
    if (byP[p].length > cap) byP[p] = byP[p].slice(0, cap);
  });
  // round-robin across pillars until POOL filled
  const out = [], cur = {}; pills.forEach(p => cur[p] = 0);
  let added = true;
  while (added && out.length < POOL) {
    added = false;
    for (const p of pills) { if (out.length >= POOL) break; if (cur[p] < byP[p].length) { out.push(byP[p][cur[p]++]); added = true; } }
  }
  const leanOf = e => ({ id: e.id, question: String(e.question).replace(/\s+/g, ' ').trim().slice(0, 130), img: e.img, cover_src: e.cover_src || '', quality_score: (typeof e.quality_score === 'number' ? e.quality_score : null), ts: e.ts || 0 });
  const lean = out.map(leanOf);
  fs.writeFileSync(WD + '/mosaic-pool.json', JSON.stringify(lean));
  const fluxN = lean.filter(x => x.cover_src === 'flux').length;
  console.log('[mosaic-pool] wrote ' + lean.length + ' homepage tiles from ' + pills.length + ' pillars (' + fluxN + ' flux, ' + (lean.length - fluxN) + ' q13) · ' + Math.round(fs.statSync(WD + '/mosaic-pool.json').size / 1024) + 'KB');
  // PER-PILLAR files (owner 2026-07-06): each topic page loads its Q&As from a static file instead of the 2.8s library-list call.
  const FILE_CAP = parseInt(process.env.MOSAIC_PILLAR_FILE_CAP || '800', 10);
  const byPfull = {};
  for (const e of showable) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; (byPfull[p] = byPfull[p] || []).push(e); }
  let wrote = 0, tiles = 0;
  for (const p of Object.keys(byPfull)) {
    const arr = byPfull[p].sort((a, b) => (b.cover_src === 'flux' ? 1 : 0) - (a.cover_src === 'flux' ? 1 : 0) || score(b) - score(a) || q(b) - q(a)).slice(0, FILE_CAP).map(leanOf);
    fs.writeFileSync(WD + '/mosaic-pool-' + p + '.json', JSON.stringify(arr));
    wrote++; tiles += arr.length;
  }
  console.log('[mosaic-pool] + ' + wrote + ' per-pillar topic files (' + tiles + ' tiles total)');
})().catch(e => { console.log('[mosaic-pool] ERR', e.message); process.exit(1); });
