// Flag entries as noindex (or clear it) on their answer blobs — used to pull
// fabricated-venue entries out of Google while they await grounded regeneration.
// The renderer emits <meta robots="noindex,follow"> when entry.noindex is true.
//   node _set_noindex.js <prefix> <minNum> [<maxNum>] [--clear]
//   e.g. node _set_noindex.js nl 101            -> noindex nl0101+
//        node _set_noindex.js dn 119 9999 --clear -> un-noindex dn0119+
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const pfx = (process.argv[2] || '').toLowerCase();
const minN = parseInt(process.argv[3] || '0', 10);
const maxN = parseInt(process.argv[4] && /^\d+$/.test(process.argv[4]) ? process.argv[4] : '999999', 10);
const clear = process.argv.includes('--clear');
if (!pfx || !Number.isFinite(minN)) { console.error('usage: node _set_noindex.js <prefix> <minNum> [maxNum] [--clear]'); process.exit(1); }

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const ids = [];
  let cursor;
  do {
    const res = await store.list({ prefix: 'answers/' + pfx, cursor });
    for (const b of res.blobs) {
      const m = b.key.match(new RegExp('^answers/(' + pfx + '(\\d+))\\.json$'));
      if (m) { const n = parseInt(m[2], 10); if (n >= minN && n <= maxN) ids.push(m[1]); }
    }
    cursor = res.cursor;
  } while (cursor);
  console.log(`${pfx} ${minN}-${maxN}: ${ids.length} entries to ${clear ? 'CLEAR' : 'set'} noindex`);
  let changed = 0;
  for (const id of ids) {
    const rec = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!rec) continue;
    if (clear) { if (rec.noindex) { delete rec.noindex; await store.setJSON('answers/' + id + '.json', rec); changed++; } }
    else if (!rec.noindex) { rec.noindex = true; await store.setJSON('answers/' + id + '.json', rec); changed++; }
  }
  console.log(`DONE. ${clear ? 'cleared' : 'set noindex on'} ${changed} entries.`);
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
