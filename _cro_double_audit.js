// _cro_double_audit.js — find/fix answers carrying in-blob CRO cards (renderer adds ONE near top).
//   node _cro_double_audit.js           audit → _cro_double_audit_result.json
//   node _cro_double_audit.js --fix     strip all in-blob CRO (idempotent)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { stripAllCroFromBody, countCroInBody } = require('./_cro_strip_lib');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const FIX = process.argv.includes('--fix');
const CONC = parseInt(process.env.CRO_AUDIT_CONC || '10', 10);

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).map(e => e && e.id).filter(Boolean);
  const doubles = [];
  let scanned = 0, fixed = 0, noblob = 0;
  let cur = 0;

  async function worker() {
    while (cur < ids.length) {
      const id = ids[cur++];
      let e;
      try { e = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (x) { continue; }
      if (!e || !e.answer) { noblob++; continue; }
      scanned++;
      const n = countCroInBody(e.answer);
      if (n > 0) doubles.push({ id, n, title: (e.question || '').slice(0, 80) });
      if (FIX && n > 0) {
        const stripped = stripAllCroFromBody(e.answer);
        if (stripped !== e.answer) {
          const patch = Object.assign({}, e, { answer: stripped, cro_stripped_at: new Date().toISOString(), updated_at: new Date().toISOString() });
          await store.setJSON('answers/' + id + '.json', patch);
          fixed++;
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, worker));
  doubles.sort((a, b) => b.n - a.n || a.id.localeCompare(b.id));
  const out = { at: new Date().toISOString(), scanned, noblob, withInBlobCro: doubles.length, fixed: FIX ? fixed : 0, sample: doubles.slice(0, 200), ids: doubles.map(d => d.id) };
  fs.writeFileSync(WD + '/_cro_double_audit_result.json', JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ scanned, withInBlobCro: doubles.length, fixed: out.fixed, mode: FIX ? 'fix' : 'audit' }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
