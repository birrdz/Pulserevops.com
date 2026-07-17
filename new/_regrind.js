// new/_regrind.js — put the recently-built entries BACK in the grinder (Block Builder queue) so
// Kory redoes them by hand (the burnt-title images). CORRECT text source this time: the BLOB
// answers/<qid>.json.answer (a real string), keyed by the published qid from the backed-up metas.
// NO automation of image work — just re-queues them. Usage: node new/_regrind.js --dry | --apply
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const ENTRIES = __dirname + '/entries';
const META_BAK = __dirname + '/output_meta.bak-2026-07-16T19-18-53-922Z';   // the 281 built entries' metas (has qid)
const APPLY = process.argv.includes('--apply');

(async () => {
  if (!fs.existsSync(META_BAK)) { console.log('meta backup not found:', META_BAK); process.exit(1); }
  const files = fs.readdirSync(META_BAK).filter(f => f.endsWith('.json'));
  const targets = [];
  for (const f of files) {
    let m; try { m = JSON.parse(fs.readFileSync(META_BAK + '/' + f, 'utf8')); } catch (e) { continue; }
    const qid = m.qid || f.replace('.json', '');
    targets.push({ qid, question: m.title || qid, format: m.format || 'essay' });
  }
  console.log('built entries to regrind:', targets.length);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map(idx.entries.map(e => [e.id, e]));

  // pull real TEXT bodies from the blob, keyed by qid
  let okBody = 0, badBody = 0; const samples = [];
  const CONC = 12; let cur = 0; const resolved = [];
  async function worker() {
    while (cur < targets.length) {
      const t = targets[cur++];
      const blob = await store.get('answers/' + t.qid + '.json', { type: 'json' }).catch(() => null);
      const body = blob && typeof blob.answer === 'string' ? blob.answer : '';
      if (body && body.length > 200) { okBody++; resolved.push(Object.assign({}, t, { body, question: blob.question || t.question })); if (samples.length < 5) samples.push(t.qid + ' → ' + body.slice(0, 45).replace(/\n/g, ' ')); }
      else badBody++;
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('real TEXT body found:', okBody, '| missing/short (skipped):', badBody);
  console.log('bb currently set on:', targets.filter(t => { const r = byId.get(t.qid); return r && r.bb; }).length);
  samples.forEach(s => console.log('  ', s));

  if (!APPLY) { console.log('\n--- DRY RUN — nothing written. --apply to regrind. ---'); return; }

  const stamp = new Date(Date.now()).toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(__dirname + '/_index.backup-regrind-' + stamp + '.json', JSON.stringify(idx));
  const eb = __dirname + '/entries.bak-regrind-' + stamp; fs.mkdirSync(eb, { recursive: true });
  for (const f of fs.readdirSync(ENTRIES)) { if (f.endsWith('.json')) try { fs.copyFileSync(ENTRIES + '/' + f, eb + '/' + f); } catch (e) {} }

  let created = 0, cleared = 0;
  for (const t of resolved) {
    if (typeof t.body !== 'string' || t.body.length < 200) continue;   // hard guard — never write a non-string body
    fs.writeFileSync(ENTRIES + '/' + t.qid + '.json', JSON.stringify({ id: t.qid, question: t.question, format: t.format, body: t.body, inPlace: true, upgradeId: t.qid, useLib: true, status: '3/3', created: new Date(Date.now()).toISOString(), requeued: 'regrind-burnt-title' }, null, 1));
    created++;
    const r = byId.get(t.qid); if (r && r.bb) { delete r.bb; cleared++; }
  }
  await store.setJSON('_index.json', idx);
  console.log('\nAPPLIED · re-queued:', created, '· bb cleared:', cleared);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
