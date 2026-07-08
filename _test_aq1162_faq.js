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
  const e = await s.get('answers/aq1162.json', { type: 'json' });
  const c = collapseToGoldStructure(e.answer, 'aq1162', e.question);
  function faqCount(b) { return (b.match(/^\*\*[^*]+\?\*\*/gm) || []).length; }
  function srcCount(b) {
    const m = b.match(/##\s+Sources[\s\S]*?(?=##|$)/i);
    return m ? (m[0].match(/^[-*]\s+/gm) || []).length : 0;
  }
  console.log('orig faq', faqCount(e.answer), 'src', srcCount(e.answer));
  console.log('new faq', faqCount(c), 'src', srcCount(c));
  const faqHeadings = (b) => (b.match(/^##\s+[^\n]+/gm) || []).filter(h => /faq|frequently/i.test(h));
  console.log('orig faq headings', faqHeadings(e.answer));
  console.log('new faq headings', faqHeadings(c));
})().catch(console.error);
