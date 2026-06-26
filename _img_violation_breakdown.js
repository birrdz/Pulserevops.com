// Quick per-prefix violation type breakdown
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const prefixOf = (id) => (String(id).match(/^([a-z]+)\d+$/i) || [])[1] || '?';

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const stats = {};
  let cur = 0;
  const CONC = 12;
  async function worker() {
    while (cur < idx.entries.length) {
      const e0 = idx.entries[cur++];
      const p = prefixOf(e0.id);
      const row = await s.get(`answers/${e0.id}.json`, { type: 'json' }).catch(() => null);
      if (!row || !row.answer) continue;
      const a = auditImages(e0.id, row.answer);
      if (a.compliant) continue;
      if (!stats[p]) stats[p] = { cover: 0, product: 0, both: 0, total: 0 };
      stats[p].total++;
      const c = a.needs.includes('cover');
      const pi = a.needs.includes('product_imgs');
      if (c && pi) stats[p].both++;
      else if (c) stats[p].cover++;
      else if (pi) stats[p].product++;
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const rows = Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
  console.log('prefix | total | cover | product | both');
  for (const [p, v] of rows) {
    console.log(`${p.padEnd(8)} | ${String(v.total).padStart(5)} | ${String(v.cover).padStart(5)} | ${String(v.product).padStart(7)} | ${String(v.both).padStart(4)}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
