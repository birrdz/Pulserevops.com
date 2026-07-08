const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const nums = (idx.entries || []).filter(e => e && /^ca\d+$/i.test(e.id)).map(e => parseInt(e.id.slice(2), 10)).sort((a, b) => a - b);
  const max = nums.length ? nums[nums.length - 1] : 0;
  const next = 'ca' + String(max + 1).padStart(4, '0');
  console.log(JSON.stringify({ count: nums.length, max: max ? 'ca' + String(max).padStart(4, '0') : null, next }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
