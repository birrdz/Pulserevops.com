// Count aq entries by gold template route.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^aq\d+$/i.test(e.id));
  let top10 = 0;
  let qa = 0;
  let other = 0;
  for (const row of rows) {
    let body = '';
    try {
      const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
      body = e && e.answer ? e.answer : '';
    } catch (err) {}
    const r = pickGoldTemplate(row.id, body, row.question || '');
    if (r.template === 'top10') top10++;
    else if (r.template === 'qa') qa++;
    else other++;
  }
  console.log(JSON.stringify({ total: rows.length, top10, qa, other }, null, 2));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
