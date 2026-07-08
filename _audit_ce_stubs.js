const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const ids = (process.argv.slice(2).length ? process.argv.slice(2) : ['ce0024', 'ce0030', 'ce0050', 'ce0186']).slice(0, 8);
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { contentRubricAudit } = require('./_format_fixer_lib');
const { wordCount } = require('./_format_fixer_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  for (const id of ids) {
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      const body = e.answer || '';
      const audit = contentRubricAudit(id, body, { valid: new Set() });
      console.log(id, 'words', audit.words, 'pass', audit.pass, 'failed', (audit.failed || []).join(','), 'len', body.length);
    } catch (err) { console.log(id, 'ERR', err.message); }
  }
})().catch(e => { console.error(e); process.exit(1); });
