const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^ce/i.test(e.id));
  const touched = rows.filter(e => e.format_v === '2026-07-answer-occasional-imgs');
  const broken = [];
  for (const row of rows.slice(0, 200)) {
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const body = e.answer || '';
    const lines = body.split('\n').filter(l => l.trim());
    const first = lines[0] || '';
    const daIdx = lines.findIndex(l => /^##\s+Direct\s+Answer/i.test(l));
    const h1BeforeDa = lines.some(l => /^#\s+/.test(l) && !/^##/.test(l)) && daIdx > 0;
    const emptyDa = daIdx >= 0 && !lines.slice(daIdx + 1, daIdx + 4).some(l => l.trim() && !/^##/.test(l));
    if (h1BeforeDa || emptyDa) broken.push({ id: row.id, h1BeforeDa, emptyDa, format_v: e.format_v, first: first.slice(0, 60) });
  }
  console.log(JSON.stringify({ total: rows.length, touched: touched.length, broken: broken.length, brokenSample: broken.slice(0, 15), touchedIds: touched.map(e => e.id) }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
