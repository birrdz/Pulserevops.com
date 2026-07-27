'use strict';
// Rebuild _under12_inventory.json from live blob index
try {
  for (const l of require('fs').readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byPillar = {};
  const ids = [];
  for (const e of ((idx && idx.entries) || [])) {
    const id = String((e && e.id) || '');
    const m = id.match(/^([a-z]+)\d/i);
    if (!m) continue;
    const p = m[1].toLowerCase();
    const q = (e.gate_score != null ? e.gate_score : (e.quality_score == null ? 10 : e.quality_score));
    if (q < 12) {
      byPillar[p] = (byPillar[p] || 0) + 1;
      ids.push(id);
    }
  }
  const out = { total: ids.length, at: new Date().toISOString(), byPillar, ids };
  fs.writeFileSync('C:/Users/koryj/website/_under12_inventory.json', JSON.stringify(out));
  // ensure failed-rewrite pile file exists
  const failF = 'C:/Users/koryj/website/_under12_failed.json';
  if (!fs.existsSync(failF)) fs.writeFileSync(failF, '[]');
  console.log(JSON.stringify({
    total: out.total,
    pillars: Object.keys(byPillar).length,
    top: Object.entries(byPillar).sort((a, b) => b[1] - a[1]).slice(0, 10),
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
