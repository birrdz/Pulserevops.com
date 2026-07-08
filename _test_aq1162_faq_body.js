for (const l of require('fs').readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  const e = await s.get('answers/aq1162.json', { type: 'json' });
  const faqM = e.answer.match(/##\s+FAQ[\s\S]*?(?=\n##\s+|$)/i);
  console.log(faqM ? faqM[0].slice(0, 2000) : 'none');
})().catch(console.error);
