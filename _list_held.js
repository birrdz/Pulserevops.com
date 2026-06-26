// List held (noindex:true) entries + their questions for the grounded-regen
// campaign. Outputs JSON [{id, question}] for the given prefixes.
//   node _list_held.js rs nl dn er pt > _held_queue.json
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const prefixes = process.argv.slice(2).map((p) => p.toLowerCase());
if (!prefixes.length) { console.error('usage: node _list_held.js <pfx> [<pfx2> ...]'); process.exit(1); }

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const ids = [];
  for (const pfx of prefixes) {
    let cursor;
    do {
      const res = await store.list({ prefix: 'answers/' + pfx, cursor });
      for (const b of res.blobs) { const m = b.key.match(new RegExp('^answers/(' + pfx + '\\d+)\\.json$')); if (m) ids.push(m[1]); }
      cursor = res.cursor;
    } while (cursor);
  }
  const out = [];
  // read in chunks to bound concurrency
  for (let i = 0; i < ids.length; i += 40) {
    const chunk = ids.slice(i, i + 40);
    const recs = await Promise.all(chunk.map((id) => store.get('answers/' + id + '.json', { type: 'json' }).then((r) => ({ id, r })).catch(() => ({ id, r: null }))));
    for (const { id, r } of recs) { if (r && r.noindex && r.question) out.push({ id, question: r.question }); }
  }
  process.stderr.write(`held entries: ${out.length}\n`);
  process.stdout.write(JSON.stringify(out));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
