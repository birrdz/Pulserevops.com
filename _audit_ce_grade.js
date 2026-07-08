// CE pillar 13/13 audit — node _audit_ce_grade.js [--fix-one=ce0178]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { auditAllCeEntries, MIN_GRADE, CE_GOLD_ID } = require('./_ce_current_events_fix_lib');

const fixOne = (process.argv.find(a => a.startsWith('--fix-one=')) || '').split('=')[1] || '';

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const report = await auditAllCeEntries(store, idx, { skipGold: true });
  console.log('CE audit · pass=' + report.passing + '/' + report.total + ' · fail=' + report.failing.length + ' · bar=' + MIN_GRADE + '/13 (gold skip ' + CE_GOLD_ID + ')');
  for (const f of report.failing.slice(0, 30)) {
    console.log('  ' + f.id + ' · ' + f.score + '/13 · ' + (f.missing || []).slice(0, 4).join(', '));
  }
  if (report.failing.length > 30) console.log('  ... +' + (report.failing.length - 30) + ' more');
  if (fixOne) {
    const { rebuildCeEntry, saveCeEntry, loadCeGoldTemplate } = require('./_ce_current_events_fix_lib');
    const existing = await store.get('answers/' + fixOne + '.json', { type: 'json' });
    const ceTemplate = await loadCeGoldTemplate(store);
    const valid = new Set((idx.entries || []).map(e => e && e.id).filter(Boolean));
    const rebuilt = await rebuildCeEntry(fixOne, existing.question, existing.answer, { store, entryMeta: existing, siblings: [], valid, templateExample: ceTemplate });
    const saved = await saveCeEntry(store, idx, fixOne, existing.question, rebuilt.body, existing, { audit: rebuilt.audit, words: rebuilt.words });
    await store.setJSON('_index.json', idx);
    console.log('Fixed ' + fixOne + ' · grade=' + saved.grade + '/13 · words=' + saved.words + ' · imgs=' + saved.imgs);
  }
  process.exit(report.allPass ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
