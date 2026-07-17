#!/usr/bin/env node
// _ad_build_queue.js — build a WORST-FIRST queue of 100 advertising cards for the tool (:7700).
// Order: missing/broken image first (worst), then smallest/placeholder, then oldest. Skips already-sealed.
'use strict';
const fs = require('fs');
const WD = __dirname;
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const WANT = 100, PROBE = 900;   // probe the oldest PROBE candidates, pick the worst WANT

function done() { try { return new Set(JSON.parse(fs.readFileSync(WD + '/new/_ad_done.json', 'utf8'))); } catch (e) { return new Set(); } }

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const doneSet = done();
  let list = (idx.entries || []).filter(e => e && e.id && !doneSet.has(e.id))
    .map(e => ({ id: e.id, ts: e.ts || 0, bb: !!e.bb, img: e.img || ('/assets/qa/' + e.id + '.jpg') }));
  // already-versioned (freshly sealed & good) → skip as "not worst"
  list = list.filter(e => !/-v\d+\.(jpe?g|png|webp)$/i.test(e.img));
  // oldest first (Black Box first), then take the oldest PROBE to inspect
  list.sort((a, b) => (b.bb - a.bb) || (a.ts - b.ts));
  const cand = list.slice(0, PROBE);
  console.log('probing ' + cand.length + ' oldest un-sealed images for "worst looking"…');

  async function probe(e) {
    const url = 'https://pulserevops.com' + e.img + '?cb=' + Date.now();
    try {
      const r = await fetch(url);
      if (r.status !== 200) { e.score = 0; e.why = 'missing(' + r.status + ')'; return; }
      const len = parseInt(r.headers.get('content-length') || '0', 10);
      const via = r.headers.get('x-pulse-asset') || 'static';
      if (!len || len < 6000) { e.score = 1; e.why = 'tiny/placeholder(' + len + 'b)'; }
      else { e.score = 2; e.why = 'has-image(' + len + 'b,' + via + ')'; }
    } catch (err) { e.score = 0; e.why = 'error'; }
  }
  // probe in batches of 25
  for (let i = 0; i < cand.length; i += 25) { await Promise.all(cand.slice(i, i + 25).map(probe)); if (i % 200 === 0) console.log('  …' + Math.min(i + 25, cand.length) + '/' + cand.length); }

  // rank: worst score first (0 missing → 1 placeholder → 2 has-image), Black Box first, then oldest
  cand.sort((a, b) => (a.score - b.score) || (b.bb - a.bb) || (a.ts - b.ts));
  const queue = cand.slice(0, WANT);
  const counts = queue.reduce((m, e) => (m[e.score] = (m[e.score] || 0) + 1, m), {});
  fs.writeFileSync(WD + '/new/_ad_queue.json', JSON.stringify(queue.map(e => e.id)));
  console.log('\nQUEUE of ' + queue.length + ' written → new/_ad_queue.json');
  console.log('  missing image : ' + (counts[0] || 0));
  console.log('  tiny/placeholder: ' + (counts[1] || 0));
  console.log('  has-image(old): ' + (counts[2] || 0));
  console.log('\nfirst 8:', queue.slice(0, 8).map(e => e.id + ' [' + e.why + ']').join('  '));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
