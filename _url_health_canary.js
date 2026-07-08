// _url_health_canary.js — FAILSAFE for the 2026-06-29 mass dead-URL incident
// (a deploy shipped a stale netlify.toml → ~47.7k 404s). Two checks:
//   1. STATIC: every pillar prefix in _index.json has a /<seg>/:id route in netlify.toml
//      (catches the missing-rule class, e.g. /pets/:id, BEFORE/AFTER deploy).
//   2. LIVE: sample real ids per pillar and verify on prod:
//        /knowledge/<id>        -> 200   (canonical)
//        /<seg>/<id>            -> 200   (pretty pillar)
//        /<seg>/<id>/reviews    -> 301   (review-mirror consolidation)
// On failure: prints ALERT, writes _url_health_alert.json, exits 2 (so it can gate a
// deploy or trip a monitor). Clean run exits 0 and writes _url_health_ok.json.
// Run: node _url_health_canary.js   |   knobs: CANARY_SAMPLE (per pillar, default 2),
//   CANARY_BASE (default https://pulserevops.com), CANARY_TOLERANCE (allowed fails, default 0).
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { PILLAR, prefixOf } = require('./_ds_publish');
const BASE = process.env.CANARY_BASE || 'https://pulserevops.com';
const SAMPLE = parseInt(process.env.CANARY_SAMPLE || '2', 10);
const TOL = parseInt(process.env.CANARY_TOLERANCE || '0', 10);
const TOML = fs.readFileSync('C:/Users/koryj/website/netlify.toml', 'utf8');

async function status(url) {
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15000) });
    return r.status;
  } catch (e) { return 'ERR:' + e.message.slice(0, 30); }
}
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byP = {};
  for (const e of (idx.entries || [])) { const m = (e.id || '').match(/^([a-z]{1,4})\d+$/); if (m) (byP[m[1]] = byP[m[1]] || []).push(e.id); }

  const fails = [];
  // ---- 1. STATIC route-coverage check ----
  const missingRule = [];
  for (const pfx of Object.keys(byP)) {
    const seg = (PILLAR[pfx] || {}).seg || 'knowledge';
    if (seg === 'knowledge' || seg === 'tools') continue; // special routes, verified live below
    const rx = new RegExp('from\\s*=\\s*"/' + seg.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '/:id"');
    if (!rx.test(TOML)) missingRule.push(pfx + ' -> /' + seg + '/:id');
  }
  if (missingRule.length) fails.push('STATIC missing netlify.toml route: ' + missingRule.join(', '));

  // ---- 2. LIVE sample check ----
  let checked = 0;
  for (const pfx of Object.keys(byP).sort()) {
    const seg = (PILLAR[pfx] || {}).seg || 'knowledge';
    const ids = byP[pfx];
    const picks = [];
    for (let i = 0; i < SAMPLE && ids.length; i++) picks.push(ids[Math.floor((i + 0.5) * ids.length / SAMPLE)]);
    for (const id of picks) {
      checked++;
      const c1 = await status(`${BASE}/knowledge/${id}`);
      if (c1 !== 200) fails.push(`/knowledge/${id} = ${c1} (want 200)`);
      if (seg !== 'knowledge' && seg !== 'tools') {
        const c2 = await status(`${BASE}/${seg}/${id}`);
        if (c2 !== 200) fails.push(`/${seg}/${id} = ${c2} (want 200)`);
        const c3 = await status(`${BASE}/${seg}/${id}/reviews`);
        if (c3 !== 301) fails.push(`/${seg}/${id}/reviews = ${c3} (want 301)`);
      }
    }
  }

  const stamp = new Date().toISOString();
  if (fails.length > TOL) {
    const alert = { ok: false, at: stamp, base: BASE, pillarsChecked: Object.keys(byP).length, urlsSampled: checked, failCount: fails.length, fails: fails.slice(0, 100) };
    fs.writeFileSync('C:/Users/koryj/website/_url_health_alert.json', JSON.stringify(alert, null, 1));
    console.error(`\n🚨 URL HEALTH ALERT — ${fails.length} failures (tolerance ${TOL}) across ${Object.keys(byP).length} pillars / ${checked} ids sampled:`);
    for (const f of fails.slice(0, 40)) console.error('   ✗ ' + f);
    if (fails.length > 40) console.error(`   …and ${fails.length - 40} more (see _url_health_alert.json)`);
    process.exit(2);
  }
  try { fs.unlinkSync('C:/Users/koryj/website/_url_health_alert.json'); } catch (e) {}
  fs.writeFileSync('C:/Users/koryj/website/_url_health_ok.json', JSON.stringify({ ok: true, at: stamp, pillarsChecked: Object.keys(byP).length, urlsSampled: checked }, null, 1));
  console.log(`✅ URL HEALTH OK — ${Object.keys(byP).length} pillars, ${checked} ids sampled, all routes resolve (static + live).`);
})().catch(e => { console.error('CANARY ERR', e.message); process.exit(1); });
