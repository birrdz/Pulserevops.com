for (const l of require('fs').readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  for (const id of ['aq1156', 'aq1155', 'aq1132']) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    const title = e.question;
    const orig = auditTop10GoldTemplate(e.answer, title);
    const collapsed = collapseToGoldStructure(e.answer, id, title);
    const gold = auditTop10GoldTemplate(collapsed, title);
    console.log(id, 'orig', orig.compliant, '->', gold.compliant, gold.issues.slice(0, 5).join(','));
  }
})().catch(console.error);
