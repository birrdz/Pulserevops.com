// _pillar_golden_validate.js — golden-template gate for all touched entries in a pillar (mv excluded).
//
// Checks: TOP_LIST vs GENERAL classification, gold audit (13/13), spotCheck, CRO-not-in-blob.
// Run after each pillar batch: node _pillar_golden_validate.js --pillar=ca
'use strict';

const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { spotCheckEntry } = require('./_ranking_list_rebuild_lib');
const { shouldSkipMv, isMvPillar, filterOutMv } = require('./netlify/functions/lib/mv-pillar-guard');

const WD = __dirname;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const CRO_IN_BLOB = /hire your fractional cro|class="[^"]*cro-card|data-cro-card|id="cro-card/i;

function parseArgs(argv) {
  const pillar = (argv.find((a) => a.startsWith('--pillar=')) || '').split('=')[1]
    || (argv.includes('--pillar') ? argv[argv.indexOf('--pillar') + 1] : '')
    || process.env.PILLAR || '';
  const onlyIds = argv.includes('--ids')
    ? fs.readFileSync(argv[argv.indexOf('--ids') + 1], 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : null;
  return { pillar: pillar.toLowerCase(), onlyIds };
}

async function validateEntry(row, store) {
  const id = row.id;
  let entry;
  try { entry = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {
    return { id, pass: false, issues: ['blob-read-error'] };
  }
  const body = (entry && (entry.answer || entry.body)) || '';
  const title = row.question || (entry && entry.question) || id;
  if (!body) return { id, pass: false, issues: ['empty-body'] };

  const route = pickGoldTemplate(id, body, title);
  const issues = [];

  if (!route.template) issues.push('no_template:' + route.reason);
  if (CRO_IN_BLOB.test(body)) issues.push('cro_card_in_blob');

  let gold = { compliant: true, issues: [] };
  if (route.template === 'top10') {
    gold = auditTop10GoldTemplate(body, title);
  } else if (route.template === 'qa') {
    gold = auditQaGoldTemplate(body, title, id);
  }
  if (!gold.compliant) issues.push(...(gold.issues || []).slice(0, 6));

  let spot = { pass: true, grade: 13, masterIssues: [] };
  try {
    spot = await spotCheckEntry(id, body, title);
  } catch (e) {
    issues.push('spotCheck-threw:' + e.message.slice(0, 80));
  }
  if (!spot.pass) issues.push(...(spot.masterIssues || []).slice(0, 4));
  if (spot.grade != null && spot.grade < 13) issues.push('grade<' + spot.grade);

  return {
    id,
    pass: issues.length === 0,
    template: route.template,
    subtype: route.template === 'qa' ? 'GENERAL' : route.template === 'top10' ? 'TOP_LIST' : null,
    grade: spot.grade,
    issues,
  };
}

async function validatePillar(pillar, opts) {
  opts = opts || {};
  if (isMvPillar(pillar)) {
    return { pillar, skipped: true, reason: 'mv-hard-exclusion', total: 0, pass: 0, fails: [] };
  }
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const idRe = new RegExp('^' + pillar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\d+$', 'i');
  let rows = (idx.entries || []).filter((e) => e && idRe.test(e.id));
  rows = filterOutMv(rows);
  if (opts.onlyIds) {
    const set = new Set(opts.onlyIds);
    rows = rows.filter((r) => set.has(r.id));
  }
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const fails = [];
  let pass = 0;
  for (const row of rows) {
    const r = await validateEntry(row, store);
    if (r.pass) pass++;
    else fails.push(r);
  }
  return { pillar, total: rows.length, pass, fail: fails.length, fails };
}

async function main() {
  const { pillar, onlyIds } = parseArgs(process.argv.slice(2));
  if (!pillar) {
    console.error('Usage: node _pillar_golden_validate.js --pillar=<prefix> [--ids touched.txt]');
    process.exit(1);
  }
  const report = await validatePillar(pillar, { onlyIds });
  const outF = path.join(WD, '_pillar_golden_validate_' + pillar + '.json');
  fs.writeFileSync(outF, JSON.stringify({ at: new Date().toISOString(), ...report }, null, 2));
  console.log(
    pillar + ' golden validate · total=' + report.total
    + ' · pass=' + report.pass + ' · FAIL=' + (report.fail || 0)
    + (report.skipped ? ' · SKIPPED (mv)' : '')
  );
  if (report.fails && report.fails.length) {
    console.log(JSON.stringify(report.fails.slice(0, 20), null, 2));
  }
  process.exit(report.skipped ? 0 : (report.fail ? 1 : 0));
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { validatePillar, validateEntry };
