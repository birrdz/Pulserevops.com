const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
(async () => {
  for (const id of ['ca0924', 'ca0931', 'ca0973']) {
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    const sec1 = (e.answer.match(/^## 1\. (.+)$/m) || [])[1];
    const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
    const cover = /^!\[/.test(e.answer);
    console.log(id, e.question.slice(0, 50), '| sec1:', sec1, '| imgs:', imgs, '| cover:', cover);
  }
})();
