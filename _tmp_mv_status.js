'use strict';
// Quick mv pillar checkpoint for _movies_alt_orchestrator.js — see _CROSSOVER.md LATEST-39
const fs = require('fs');
const WD = __dirname;
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { needsAqQaFix } = require('./_aq_qa_gold_fix_lib');
const { needsAqTop10Fix } = require('./_aq_top10_gold_fix_lib');

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter((e) => e && /^mv\d+$/.test(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  let needCover = 0;
  let needFix = 0;
  let gold = 0;
  for (const row of rows) {
    if (row.cover_src !== 'flux') needCover++;
    let a;
    try {
      a = await store.get('answers/' + row.id + '.json', { type: 'json' });
    } catch (e) {
      continue;
    }
    const body = (a && (a.answer || a.body)) || '';
    const title = row.question || row.id;
    const pick = pickGoldTemplate(row.id, body, title);
    const needs =
      pick.template === 'qa'
        ? needsAqQaFix(row.id, body, title, row, false)
        : needsAqTop10Fix(row.id, body, title, row, false);
    if (needs) needFix++;
    else gold++;
  }
  let perf = {};
  try {
    perf = JSON.parse(fs.readFileSync(WD + '/_perf_stats.json', 'utf8'));
  } catch (e) {}
  console.log(JSON.stringify({ total: rows.length, needCover, needFix, gold, perfFixes: perf.fixes, perfCards: perf.cards }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
