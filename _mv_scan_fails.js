// Scan every mv#### entry against the golden Top-10 gate; list the failures.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const { spotCheckEntry } = require('./_ranking_list_rebuild_lib');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const rows = (idx.entries || []).filter(e => e && /^mv\d+$/i.test(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const fails = [];
  let ok = 0;
  for (const row of rows) {
    let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (e) { fails.push({ id: row.id, why: 'blob-read-error' }); continue; }
    const body = (a && (a.answer || a.body)) || '';
    const title = row.question || row.id;
    if (!body) { fails.push({ id: row.id, why: 'empty-body' }); continue; }
    let chk;
    try { chk = await spotCheckEntry(row.id, body, title); }
    catch (e) { fails.push({ id: row.id, why: 'audit-threw: ' + e.message.slice(0, 120) }); continue; }
    if (chk.pass) { ok++; continue; }
    fails.push({
      id: row.id,
      grade: chk.grade,
      masterOk: chk.masterOk,
      productImgs: chk.productImgs + '/' + chk.wantProduct,
      issues: (chk.masterIssues || []).slice(0, 4),
    });
  }
  console.log('mv entries: ' + rows.length + ' · pass=' + ok + ' · FAIL=' + fails.length);
  console.log(JSON.stringify(fails, null, 2));
  fs.writeFileSync('C:/Users/koryj/website/_mv_fails_scan.json', JSON.stringify({ total: rows.length, pass: ok, fails }, null, 2));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
