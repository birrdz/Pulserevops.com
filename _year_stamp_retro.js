// RETROACTIVE year-stamp — appends "in 2027" to outdatable, year-less titles
// across the whole library. Idempotent, dupe-guarded. Updates the answer blob's
// .question + the index row's .question, bumps dateModified. Runs AFTER the
// gap-fill writer finishes (no concurrent writer => no index clobber).
// Usage: node _year_stamp_retro.js [--limit=N] [--dry]
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { stampYear } = require('./_year_law');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const LOG = 'C:/Users/koryj/website/_year_stamp_retro.log';
const LIMIT = parseInt((process.argv.find(a => a.startsWith('--limit=')) || '--limit=0').split('=')[1], 10) || 0;
const DRY = process.argv.includes('--dry');
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const taken = new Set(idx.entries.map(e => norm(e.question)));
  const byId = new Map(idx.entries.map(e => [e.id, e]));
  // candidates: have a question, the stamp changes it, no dupe collision
  const targets = [];
  for (const e of idx.entries) {
    if (!e || !e.question) continue;
    const nu = stampYear(e.question);
    if (nu === e.question) continue;            // already has year / evergreen / no-op
    if (taken.has(norm(nu))) { continue; }      // would duplicate an existing title
    taken.add(norm(nu));                         // reserve so two candidates can't collide
    targets.push({ id: e.id, old: e.question, nu });
    if (LIMIT && targets.length >= LIMIT) break;
  }
  log(`candidates to stamp: ${targets.length}${DRY ? ' (DRY — no writes)' : ''}`);
  if (DRY) { targets.slice(0, 15).forEach(t => log(`  ${t.id}: ${t.nu}`)); return; }

  let done = 0, fail = 0;
  for (const t of targets) {
    try {
      const blob = await store.get('answers/' + t.id + '.json', { type: 'json' });
      if (!blob) { fail++; continue; }
      blob.question = t.nu;
      blob.dateModified = Date.now();
      blob.year_stamped_at = Date.now();
      await store.setJSON('answers/' + t.id + '.json', blob);
      const row = byId.get(t.id);
      if (row) row.question = t.nu;              // mutate in-memory index, single write at end
      done++;
      if (done % 200 === 0) log(`  ${done}/${targets.length} stamped`);
    } catch (e) { fail++; log(`  ERR ${t.id} ${e.message}`); }
  }
  // single index write (writer is stopped at this point, so no clobber)
  await store.setJSON('_index.json', idx);
  log(`DONE. stamped ${done}, failed ${fail}, index size ${idx.entries.length}`);
})().catch(e => { log('FATAL ' + e.message); process.exit(1); });
