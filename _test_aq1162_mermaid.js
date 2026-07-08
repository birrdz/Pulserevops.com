for (const l of require('fs').readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure, stripMermaidOutsideHowToChoose } = require('./_aq_top10_gold_fix_lib');
const { auditRankingListMaster } = require('./_ranking_list_master_law');
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  const e = await s.get('answers/aq1162.json', { type: 'json' });
  const c = collapseToGoldStructure(e.answer, 'aq1162', e.question);
  console.log('mermaid', (c.match(/```mermaid/gi) || []).length);
  const master = auditRankingListMaster(c, e.question);
  console.log('master', master.compliant, master.issues);
  const htc = c.match(/## How to Choose[\s\S]*?(?=\n##|$)/i);
  console.log('htc snippet', htc ? htc[0].slice(0, 300) : 'none');
})().catch(console.error);
