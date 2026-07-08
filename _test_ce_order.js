const fs = require('fs');
const { normalizeCeBodyOrder } = require('./_ce_current_events_fix_lib');
const WD = 'C:/Users/koryj/website';
const id = process.argv[2] || 'ce0023';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  const fixed = normalizeCeBodyOrder(e.answer, e.question, id);
  const lines = fixed.split('\n').filter(l => l.trim()).slice(0, 8);
  console.log(lines.join('\n'));
})().catch(err => { console.error(err); process.exit(1); });
