#!/usr/bin/env node
/**
 * Delete newest N q#### Q&As from the library blob store + remove from _index.json.
 *
 * Usage:
 *   node _economy_delete_top_q_count.js --count=100
 *   node _economy_delete_top_q_count.js --count=100 --dry-run
 */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const REPORT = path.join(__dirname, '_economy_delete_top_report.json');

function loadPat() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local missing');
  const m = fs.readFileSync(envPath, 'utf8').match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

function parseArgs() {
  const countArg = process.argv.find((a) => a.startsWith('--count='));
  const dryRun = process.argv.includes('--dry-run');
  const count = countArg ? parseInt(countArg.split('=')[1], 10) : 100;
  return { count, dryRun };
}

async function main() {
  const opts = parseArgs();
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const qRows = (idx.entries || [])
    .filter((e) => e && /^q\d+$/i.test(e.id))
    .sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));

  const toDelete = qRows.slice(0, opts.count);
  const ids = toDelete.map((e) => e.id);

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: opts.dryRun,
        count: opts.count,
        availableQ: qRows.length,
        deleting: ids.length,
        idRange: ids.length ? `${ids[ids.length - 1]}..${ids[0]}` : null,
        sample: ids.slice(0, 5),
      },
      null,
      2
    )
  );

  const deleted = [];
  const errors = [];

  for (const row of toDelete) {
    const key = 'answers/' + row.id + '.json';
    try {
      if (!opts.dryRun) await store.delete(key);
      deleted.push({ id: row.id, ts: row.ts || null, question: (row.question || '').slice(0, 80) });
    } catch (e) {
      errors.push({ id: row.id, error: String(e.message || e) });
    }
  }

  const remaining = (idx.entries || []).filter((e) => !ids.includes(e.id));

  if (!opts.dryRun) {
    await store.setJSON('_index.json', { ...idx, entries: remaining });
    try {
      await store.setJSON('_in_flight.json', { ids: [], workers: [], ts: Date.now() });
      await store.setJSON('_current_activity.json', { action: 'idle', target: null, score: null, ts: Date.now() });
    } catch (_e) {}
  }

  const report = {
    ok: true,
    dryRun: opts.dryRun,
    countRequested: opts.count,
    deleted_count: deleted.length,
    idRange: ids.length ? `${ids[ids.length - 1]}..${ids[0]}` : null,
    deleted,
    errors,
    index_before: (idx.entries || []).length,
    index_after: remaining.length,
  };

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

