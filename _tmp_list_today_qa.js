const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { auditQaGoldTemplate, needsQaGoldFix } = require('./_qa_gold_template');

const TODAY = '2026-07-06';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const aq = (idx.entries || []).filter(e => e && e.id && /^aq\d/i.test(e.id));
  const qaEssays = [];
  for (const row of aq) {
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) continue;
    const route = pickGoldTemplate(row.id, e.answer, e.question || row.question);
    if (route.template !== 'qa') continue;
    const polished = e.polished_at ? new Date(e.polished_at).toISOString().slice(0, 10) : null;
    const updated = e.updated_at ? String(e.updated_at).slice(0, 10) : null;
    const touchedToday = polished === TODAY || updated === TODAY || e.format_v === '2026-07-aq-qa-gold';
    const audit = auditQaGoldTemplate(e.answer, e.question || row.question, row.id);
    qaEssays.push({
      id: row.id,
      title: (e.question || row.question || '').slice(0, 60),
      touchedToday,
      polished_at: e.polished_at,
      updated_at: e.updated_at,
      format_v: e.format_v,
      compliant: audit.compliant,
      issues: audit.issues,
      needsFix: needsQaGoldFix(e.answer, e.question || row.question, row.id),
    });
  }
  const todayOnes = qaEssays.filter(x => x.touchedToday);
  console.log('AQ Q&A essays total:', qaEssays.length);
  console.log('Touched today:', todayOnes.length);
  console.log('Non-compliant today:', todayOnes.filter(x => !x.compliant).map(x => x.id + ' ' + (x.issues || []).join(',')));
  console.log('All non-compliant:', qaEssays.filter(x => x.needsFix).map(x => x.id + ' ' + (x.issues || []).join(',')));
})().catch(e => { console.error(e); process.exit(1); });
