const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');
const { auditQaGoldTemplate } = require('./_qa_gold_template');
const { needsAqTop10Fix } = require('./_aq_top10_gold_fix_lib');
const { needsAqQaFix } = require('./_aq_qa_gold_fix_lib');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const id = process.argv[2] || 'mv0009';
(async () => {
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (idx.entries || []).find(e => e && e.id === id);
  console.log('id:', id, '| title:', row && row.question, '| cover_src:', row && row.cover_src);
  const a = await s.get('answers/' + id + '.json', { type: 'json' });
  const body = a.answer || a.body || '';
  console.log('len:', body.length);
  const pick = pickGoldTemplate(id, body, row.question);
  console.log('template pick:', pick.template, '|', pick.reason);
  if (pick.template === 'qa') {
    const g = auditQaGoldTemplate(body, row.question, id);
    console.log('QA gold compliant:', g.compliant, '| issues:', (g.issues || []).join(', '));
    console.log('needsAqQaFix:', needsAqQaFix(id, body, row.question, row, false));
  } else {
    const g = auditTop10GoldTemplate(body, row.question);
    console.log('TOP10 gold compliant:', g.compliant, '| issues:', (g.issues || []).join(', '));
    console.log('needsAqTop10Fix:', needsAqTop10Fix(id, body, row.question, row, false));
  }
  console.log('--- H2 headings ---');
  console.log((body.match(/^##\s+.+$/gm) || []).join('\n'));
  console.log('--- first 600 chars ---');
  console.log(body.slice(0, 600));
})();
