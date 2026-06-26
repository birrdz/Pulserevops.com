// Remove from _index.json any entry whose answer blob has noindex:true — so
// fabricated/held entries don't show in on-site listings or sitemaps (the
// robots noindex already keeps them out of Google; this keeps them out of the
// UI too). Scoped to the given prefixes to bound blob reads.
//   node _deindex_noindexed.js <prefix> [<prefix2> ...]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const prefixes = process.argv.slice(2).map((p) => p.toLowerCase());
if (!prefixes.length) { console.error('usage: node _deindex_noindexed.js <prefix> [<prefix2> ...]'); process.exit(1); }
const rx = new RegExp('^(' + prefixes.join('|') + ')\\d');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const candidates = idx.entries.filter((e) => e && e.id && rx.test(e.id));
  console.log(`checking ${candidates.length} index entries across [${prefixes.join(',')}] for noindex...`);
  const flags = await Promise.all(candidates.map((e) => store.get('answers/' + e.id + '.json', { type: 'json' }).then((r) => (r && r.noindex ? e.id : null)).catch(() => null)));
  const remove = new Set(flags.filter(Boolean));
  if (!remove.size) { console.log('nothing to de-index.'); return; }
  idx.entries = idx.entries.filter((e) => !(e && e.id && remove.has(e.id)));
  await store.setJSON('_index.json', idx);
  console.log(`de-indexed ${remove.size} noindexed entries. new index size: ${idx.entries.length}`);
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
