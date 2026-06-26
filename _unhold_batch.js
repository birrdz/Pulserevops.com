// _unhold_batch.js — drain held entries for ONE pillar, sequentially (one index
// writer at a time). Reads ids from scratchpad/truly_held.json[pfx], processes up
// to LIMIT, prints a running tally. NO DeepSeek, NO concurrency.
//   node _unhold_batch.js <pfx> [limit]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { unholdOne } = require('./_unhold_one');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const HELD = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/6ead528c-c395-40d0-85bd-8c3ab0cc23ee/scratchpad/truly_held.json';

(async () => {
  const pfx = process.argv[2];
  const limit = parseInt(process.argv[3] || '9999', 10);
  if (!pfx) { console.error('usage: node _unhold_batch.js <pfx> [limit]'); process.exit(1); }
  const map = JSON.parse(fs.readFileSync(HELD, 'utf8'));
  const ids = (map[pfx] || []).slice(0, limit);
  if (!ids.length) { console.log(JSON.stringify({ pfx, done: 0, msg: 'no held ids' })); return; }
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let ok = 0, skip = 0; const fails = [];
  for (const id of ids) {
    try {
      const r = await unholdOne(id, store);
      if (r.ok) { ok++; process.stdout.write(`  ${id} ok (held=${r.wasHeld}, inIndex=${r.wasInIndex})\n`); }
      else { skip++; fails.push({ id, reason: r.reason }); process.stdout.write(`  ${id} SKIP ${r.reason}\n`); }
    } catch (e) { skip++; fails.push({ id, reason: e.message }); process.stdout.write(`  ${id} ERR ${e.message}\n`); }
  }
  console.log(JSON.stringify({ pfx, processed: ids.length, ok, skip, fails }));
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
