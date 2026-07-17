// new/_requeue_24h.js — put EVERY entry built in the last 24h back into general population
// for MANUAL redo in Block Builder. No automation, no image work here. Sources body+qid from the
// LOCAL output/<id>/meta.json (works for both in-place tl fixes AND net-new builds whose folder
// id differs from the published qid).
//   1. new/entries/<qid>.json (re)created with body -> shows in Block Builder to redo by hand
//   2. _index.json blob: clear `bb` on the qid row -> back in general population (score/badges untouched, stays live)
//   3. old new/output/<folder>/ wiped -> clears the baked images/meta so the redo starts clean
// Usage:  node new/_requeue_24h.js --dry | --apply
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const OUT = __dirname + '/output';
const ENTRIES = __dirname + '/entries';
const APPLY = process.argv.includes('--apply');
const WINDOW_MS = 24 * 60 * 60 * 1000;

(async () => {
  const now = Date.now();
  const dirs = fs.existsSync(OUT) ? fs.readdirSync(OUT) : [];
  const targets = [];
  for (const d of dirs) {
    let m; try { m = JSON.parse(fs.readFileSync(OUT + '/' + d + '/meta.json', 'utf8')); } catch (e) { continue; }
    if (m.status !== '5/5' || !m.publishedAt) continue;
    const t = Date.parse(m.publishedAt);
    if (!(isFinite(t) && (now - t) <= WINDOW_MS)) continue;
    const qid = m.qid || d;
    targets.push({ folder: d, qid, question: m.title || qid, format: m.format || 'essay', body: m.body || '', hasBody: !!(m.body && String(m.body).trim()) });
  }
  const noBody = targets.filter(t => !t.hasBody);
  console.log('BUILT in last 24h:', targets.length, '| have body (requeuable):', targets.length - noBody.length, '| NO body:', noBody.length);
  if (noBody.length) console.log('  no-body ids (will still wipe+clear-bb, but cannot pre-fill builder):', noBody.slice(0, 20).map(t => t.folder).join(', '));

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = new Map(idx.entries.map(e => [e.id, e]));
  const bbOn = targets.filter(t => { const r = byId.get(t.qid); return r && r.bb; }).length;
  console.log('of those, currently flagged bb (built) in index:', bbOn);

  if (!APPLY) { console.log('\n--- DRY RUN — nothing changed. --apply to execute. ---'); return; }

  // BACKUPS
  const stamp = new Date(now).toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(__dirname + '/_index.backup-' + stamp + '.json', JSON.stringify(idx));
  const entBak = __dirname + '/entries.bak-' + stamp; fs.mkdirSync(entBak, { recursive: true });
  if (fs.existsSync(ENTRIES)) for (const f of fs.readdirSync(ENTRIES)) { if (!f.endsWith('.json')) continue; try { fs.copyFileSync(ENTRIES + '/' + f, entBak + '/' + f); } catch (e) {} }
  const metaBak = __dirname + '/output_meta.bak-' + stamp; fs.mkdirSync(metaBak, { recursive: true });
  for (const t of targets) { try { fs.copyFileSync(OUT + '/' + t.folder + '/meta.json', metaBak + '/' + t.folder + '.json'); } catch (e) {} }
  console.log('backups → _index.backup-' + stamp + '.json · entries.bak-' + stamp + '/ · output_meta.bak-' + stamp + '/');

  let cleared = 0, created = 0, wiped = 0;
  for (const t of targets) {
    const r = byId.get(t.qid); if (r && r.bb) { delete r.bb; cleared++; }
    if (t.hasBody) {
      fs.writeFileSync(ENTRIES + '/' + t.qid + '.json', JSON.stringify({ id: t.qid, question: t.question, format: t.format, body: t.body, inPlace: true, upgradeId: t.qid, useLib: true, status: '3/3', created: new Date(now).toISOString(), requeued: '24h-redo' }, null, 1));
      created++;
    }
    const od = OUT + '/' + t.folder; if (fs.existsSync(od)) { fs.rmSync(od, { recursive: true, force: true }); wiped++; }
  }
  await store.setJSON('_index.json', idx);
  console.log('\nAPPLIED · bb cleared:', cleared, '· builder entries created:', created, '· old output wiped:', wiped);
  console.log('All now redo-able by hand in Block Builder. Live URLs stay up until you republish each.');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
