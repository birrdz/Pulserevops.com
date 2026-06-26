// One-off: delete all old `my-content/<4digit>.json` buckets after the
// cutover to the new initials+4-digit code format (which uses
// `my-content-v2/<7char>.json`). Per owner instruction 2026-06-04.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let deleted = 0;
  let listed = 0;
  let cursor;
  do {
    const page = await store.list({ prefix: 'my-content/', cursor });
    for (const b of (page.blobs || [])) {
      listed++;
      // Only delete the OLD bucket pattern (my-content/<4 digits>.json).
      // Anything else under the my-content/ prefix gets left alone defensively.
      const key = b.key;
      if (/^my-content\/\d{4}\.json$/.test(key)) {
        try {
          await store.delete(key);
          deleted++;
          console.log('  DELETED', key);
        } catch (e) {
          console.log('  ERR', key, e.message);
        }
      }
    }
    cursor = page.cursor;
  } while (cursor);
  console.log(`\nListed ${listed} blobs under my-content/. Deleted ${deleted} old 4-digit buckets.`);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
