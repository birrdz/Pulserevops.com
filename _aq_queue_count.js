// Quick count for AQ dual-gold --reapply queue.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { pickGoldTemplate, TOP10_GOLD_ID, QA_GOLD_ID } = require('./_pulse_gold_template_router');
const { needsAqTop10Fix } = require('./_aq_top10_gold_fix_lib');
const { needsAqQaFix } = require('./_aq_qa_gold_fix_lib');

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && /^aq\d+$/i.test(e.id));
  let ranking = 0;
  let qa = 0;
  let skipped = 0;
  for (const row of rows) {
    if (row.id === TOP10_GOLD_ID || row.id === QA_GOLD_ID) {
      skipped++;
      continue;
    }
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' }).catch(() => null);
    const body = (e && e.answer) || '';
    if (!body) {
      skipped++;
      continue;
    }
    const route = pickGoldTemplate(row.id, body, row.question || '');
    if (route.template === 'top10' && needsAqTop10Fix(row.id, body, row.question || '', e, true)) ranking++;
    else if (route.template === 'qa' && needsAqQaFix(row.id, body, row.question || '', e, true)) qa++;
    else skipped++;
  }
  console.log(JSON.stringify({
    total: rows.length,
    ranking,
    qa,
    queued: ranking + qa,
    skipped,
    goldRefs: { top10: TOP10_GOLD_ID, qa: QA_GOLD_ID },
  }, null, 2));
})().catch(e => {
  console.error(e.message);
  process.exit(1);
});
