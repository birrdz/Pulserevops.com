// Delete an entire pillar from pulse-machine-library (blobs + index).
// Usage: node _delete_pillar.js --pillar=ce [--dry-run]
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const PILLARS = require('./_ranking_master_pillar_config');
const BUILTIN = {
  ce: { key: 'ce', prefix: 'ce', idRe: /^ce\d+$/i, label: 'Current Events' },
};
const { getStore } = require('@netlify/blobs');

const args = process.argv.slice(2);
const PILLAR = (args.find(a => a.startsWith('--pillar=')) || '').split('=')[1] || args[0];
const DRY = args.includes('--dry-run');
const cfg = PILLARS[PILLAR] || BUILTIN[PILLAR];
if (!cfg) throw new Error('Unknown pillar: ' + PILLAR);

const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter(e => e && cfg.idRe.test(e.id));
  console.log('Pillar', PILLAR, '(' + cfg.label + ') · entries to delete:', rows.length, DRY ? '(dry-run)' : '');

  let deleted = 0;
  for (const row of rows) {
    if (DRY) { console.log('would delete', row.id); continue; }
    try { await store.delete('answers/' + row.id + '.json'); } catch (e) {}
    deleted++;
    if (deleted % 25 === 0) console.log('  deleted', deleted, '/', rows.length);
    await sleep(40);
  }

  if (!DRY) {
    idx.entries = (idx.entries || []).filter(e => !e || !cfg.idRe.test(e.id));
    await store.setJSON('_index.json', idx);
  }

  const report = {
    pillar: PILLAR,
    label: cfg.label,
    removed: DRY ? 0 : deleted,
    indexBefore: (idx.entries || []).length + (DRY ? rows.length : 0),
    indexAfter: DRY ? (idx.entries || []).length : idx.entries.length,
    dryRun: DRY,
    at: new Date().toISOString(),
  };
  fs.writeFileSync(WD + '/_' + PILLAR + '_pillar_deleted.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
