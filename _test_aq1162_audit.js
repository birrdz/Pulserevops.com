for (const l of require('fs').readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { spotCheckEntry } = require('./_ranking_list_rebuild_lib');
(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const e = await store.get('answers/aq1162.json', { type: 'json' });
  const title = e.question;
  const origGold = auditTop10GoldTemplate(e.answer, title);
  const origGrade = gradeEntry('aq1162', e.answer);
  const collapsed = collapseToGoldStructure(e.answer, 'aq1162', title);
  const gold = auditTop10GoldTemplate(collapsed, title);
  const grade = gradeEntry('aq1162', collapsed);
  const check = await spotCheckEntry('aq1162', collapsed, title);
  console.log('origGold', origGold.compliant, origGold.issues);
  console.log('origGrade', origGrade.score, origGrade.missing);
  console.log('gold', gold.compliant, gold.issues);
  console.log('grade', grade.score, grade.missing);
  console.log('spot', check.grade, check.pass);
  console.log('mermaid', (collapsed.match(/```mermaid/gi) || []).length);
})().catch(err => { console.error(err); process.exit(1); });
