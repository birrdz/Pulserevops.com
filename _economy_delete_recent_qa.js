#!/usr/bin/env node
/**
 * Delete q#### Q&As from the library index + answer blobs by age.
 *   node _economy_delete_recent_qa.js --hours=10
 *   node _economy_delete_recent_qa.js --hours=10 --min-id=11000
 *   node _economy_delete_recent_qa.js --hours=10 --dry-run
 */
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const REPORT = path.join(__dirname, '_economy_delete_recent_report.json');

function loadPat() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local missing');
  const m = fs.readFileSync(envPath, 'utf8').match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing');
  return m[1].trim();
}

function parseArgs() {
  const h = process.argv.find((a) => a.startsWith('--hours='));
  const minArg = process.argv.find((a) => a.startsWith('--min-id='));
  return {
    hours: h ? parseFloat(h.split('=')[1]) : 5,
    minId: minArg ? parseInt(minArg.split('=')[1].replace(/^q/i, ''), 10) : 0,
    dryRun: process.argv.includes('--dry-run'),
  };
}

async function main() {
  const opts = parseArgs();
  const cutoff = Date.now() - opts.hours * 3600000;
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const toDelete = (idx.entries || []).filter((e) => {
    if (!e || !/^q\d+$/i.test(e.id)) return false;
    const n = parseInt(e.id.slice(1), 10);
    const byTime = (e.ts || 0) >= cutoff;
    const byMinId = opts.minId > 0 && n >= opts.minId;
    return byTime || byMinId;
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: opts.dryRun,
        hours: opts.hours,
        minId: opts.minId || null,
        cutoff_iso: new Date(cutoff).toISOString(),
        candidates: toDelete.length,
        ids: toDelete.map((e) => e.id),
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
      if (!opts.dryRun) {
        await store.delete(key);
      }
      deleted.push({ id: row.id, question: (row.question || '').slice(0, 80), ts: row.ts });
    } catch (e) {
      errors.push({ id: row.id, error: String(e.message || e) });
    }
  }

  const deleteIds = new Set(toDelete.map((e) => e.id));
  const remaining = (idx.entries || []).filter((e) => !deleteIds.has(e.id));

  if (!opts.dryRun) {
    await store.setJSON('_index.json', { ...idx, entries: remaining });
    try {
      await store.setJSON('_in_flight.json', { ids: [], workers: [], ts: Date.now() });
      await store.setJSON('_current_activity.json', {
        action: 'idle',
        target: null,
        score: null,
        ts: Date.now(),
      });
    } catch (_e) {}
  }

  const report = {
    ok: true,
    dryRun: opts.dryRun,
    hours: opts.hours,
    cutoff_ms: cutoff,
    deleted_count: deleted.length,
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
