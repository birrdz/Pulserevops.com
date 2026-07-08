const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { rebuildAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { dsChat } = require('./_ds_lib');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const id = process.argv[2] || 'mv0009';
const SAVE = process.argv.includes('--save');
(async () => {
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(e => e && e.id === id);
  const a = await s.get('answers/' + id + '.json', { type: 'json' });
  const body = a.answer || a.body || '';
  console.log('BEFORE:', auditTop10GoldTemplate(body, row.question).issues.join(', ') || 'compliant');
  const rebuilt = await rebuildAqTop10Entry(id, row.question, body, { dsChat });
  const nb = rebuilt.body;
  const after = auditTop10GoldTemplate(nb, row.question);
  console.log('AFTER :', after.compliant ? 'COMPLIANT ✅' : ('STILL FAILING → ' + after.issues.join(', ')));
  console.log('mermaids after:', (nb.match(/```mermaid/g) || []).length, '| tail H2s:', (nb.match(/^##\s+.+$/gm) || []).slice(-4).join(' | '));
  if (SAVE && after.compliant) {
    const { saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
    await saveAqTop10Entry(s, idx, id, row.question, nb, a);
    await s.setJSON('_index.json', idx);
    console.log('SAVED ' + id);
  } else if (SAVE) {
    console.log('NOT SAVED — rebuild did not reach compliance');
  }
})();
