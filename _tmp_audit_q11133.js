const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { auditQaGoldTemplate } = require('./_qa_gold_template');

(async () => {
  const e = await store.get('answers/q11133.json', { type: 'json' });
  const b = (e && e.answer) || '';
  const audit = auditQaGoldTemplate(b, e && e.question, 'q11133');
  console.log('TITLE:', e && e.question);
  console.log('WORDS:', (b.match(/[A-Za-z0-9'-]+/g) || []).length);
  console.log('HAS_TOP_HERO:', /^!\[/.test(b.trim()));
  console.log('FIRST_H2:', (b.match(/^##\s+.+$/m) || [])[0]);
  console.log('IMG_COUNT:', (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length);
  console.log('AUDIT:', JSON.stringify(audit, null, 2));
  console.log('---BODY START---');
  console.log(b.slice(0, 2500));
})().catch(e => { console.error(e); process.exit(1); });
