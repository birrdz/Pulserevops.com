for (const l of require('fs').readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { collapseToGoldStructure } = require('./_aq_top10_gold_fix_lib');
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  const e = await s.get('answers/aq1156.json', { type: 'json' });
  const c = collapseToGoldStructure(e.answer, 'aq1156', e.question);
  const tail = c.split('\n').filter(l => /^##\s+/.test(l)).slice(-8);
  console.log(tail.join('\n'));
})().catch(console.error);
