const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { saveAqTop10Entry } = require('./_aq_top10_gold_fix_lib');
const { saveAqQaEntry } = require('./_aq_qa_gold_fix_lib');
const { ccGoldenFix } = require('./_cc_golden_fix');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const id = process.argv[2] || 'mv0009';
const SAVE = process.argv.includes('--save');
(async () => {
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(e => e && e.id === id);
  const a = await s.get('answers/' + id + '.json', { type: 'json' });
  const body = a.answer || a.body || '';
  const tmpl = pickGoldTemplate(id, body, row.question).template === 'qa' ? 'qa' : 'top10';
  const auditOf = b => (tmpl === 'qa' ? auditQaGoldTemplate(b, row.question, id) : auditTop10GoldTemplate(b, row.question));
  console.log(id, '·', tmpl, '· BEFORE:', auditOf(body).issues.join(', ') || 'compliant');
  const cc = await ccGoldenFix(id, row.question, body, tmpl, { log: (...x) => console.log(...x) });
  console.log('AFTER:', cc.compliant ? 'COMPLIANT ✅ (tries ' + cc.tries + ')' : 'STILL FAILING → ' + (cc.issues || []).join(', '));
  if (SAVE && cc.compliant && cc.changed) {
    if (tmpl === 'qa') await saveAqQaEntry(s, idx, id, row.question, cc.body, a);
    else await saveAqTop10Entry(s, idx, id, row.question, cc.body, a);
    // safe index merge: reload + re-apply this row
    const snap = (idx.entries || []).find(e => e && e.id === id);
    const fresh = await s.get('_index.json', { type: 'json', consistency: 'strong' });
    const j = (fresh.entries || []).findIndex(e => e && e.id === id); if (j >= 0 && snap) fresh.entries[j] = snap;
    await s.setJSON('_index.json', fresh);
    console.log('SAVED', id);
  } else if (SAVE) console.log('NOT SAVED (not compliant or unchanged)');
})();
