const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { ensureQaGoldBodyShape, qaHasTopHero, qaHasStackedImages } = require('./_qa_gold_template');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

(async () => {
  const e = await store.get('answers/q11133.json', { type: 'json' });
  const b = (e && e.answer) || '';
  const title = (e && e.question) || '';
  console.log('TITLE:', title);
  console.log('FIRST 1200:\n', b.slice(0, 1200));
  console.log('\ntopHero:', qaHasTopHero(b));
  console.log('stacked:', qaHasStackedImages(b));
  console.log('img count:', (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length);
  console.log('H2s:', b.split('\n').filter(l => /^##\s/.test(l)).slice(0, 20));
  const shaped = ensureQaGoldBodyShape(b);
  console.log('\nAfter ensureQaGoldBodyShape topHero:', qaHasTopHero(shaped));
  console.log('changed:', shaped !== b.trim());
})().catch(e => { console.error(e); process.exit(1); });
