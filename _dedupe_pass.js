// Safe dedupe pass. Groups entries per prefix by normalized title; within a group
// keeps the BEST copy and removes the rest (after backing them up). DRY by default.
// Usage: node _dedupe_pass.js [prefixes=tl,fr,bs,nl,bt] [--live]
const fs = require('fs');
try { const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of e.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const LIVE = process.argv.includes('--live');
const prefArg = process.argv.find(a => /^[a-z,]+$/.test(a) && a !== '--live');
const PREFIXES = (prefArg ? prefArg.split(',') : ['tl', 'fr', 'bs', 'nl', 'bt']);
const BK = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/bffa3b37-ddf6-4fff-9f56-41dae8eb861c/scratchpad/_dedupe_backup_' + Date.now() + '.json';

function norm(t) {
  // LAW (no-duplicates-law): "diff year OK" — years are SIGNIFICANT, do NOT strip them.
  // Only collapse true same-title (incl. same year) collisions.
  return String(t || '').toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/\(re-?do[^)]*\)/g, '')                   // strip (re-do ...) editorial markers
    .replace(/\bbest overall\b|\bbest value\b|\branked\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')                        // punctuation -> space
    .replace(/\b(the|a|an|in|for|of|to|us|usa)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
const score = (e) => (e.has_answer ? 1000 : 0) + (Number(e.quality_score) || 0) * 10 + (Number(e.ts) ? 1 : 0);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const all = idx.entries || [];
  const report = {}; const toDelete = [];
  for (const pfx of PREFIXES) {
    const rows = all.filter(e => e && e.id && new RegExp('^' + pfx + '\\d+$').test(e.id));
    const groups = {};
    for (const e of rows) { const k = norm(e.question); if (!k) continue; (groups[k] = groups[k] || []).push(e); }
    let dupGroups = 0, dupDel = 0;
    for (const k in groups) {
      const g = groups[k];
      if (g.length < 2) continue;
      dupGroups++;
      g.sort((a, b) => score(b) - score(a) || (b.ts || 0) - (a.ts || 0)); // best first
      for (const loser of g.slice(1)) { toDelete.push(loser.id); dupDel++; }
    }
    report[pfx] = { entries: rows.length, dup_groups: dupGroups, to_delete: dupDel };
  }
  console.log('DEDUPE ' + (LIVE ? 'LIVE' : 'DRY') + ' — per pillar:');
  for (const p in report) console.log('  ' + p.padEnd(4), JSON.stringify(report[p]));
  console.log('TOTAL to delete:', toDelete.length);

  if (!LIVE) { console.log('(dry run — no changes. sample ids:', toDelete.slice(0, 10).join(','), ')'); return; }

  // backup full blobs of everything we delete
  const backup = [];
  for (const id of toDelete) { const b = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); backup.push({ id, blob: b, index: all.find(e => e.id === id) }); }
  fs.writeFileSync(BK, JSON.stringify(backup));
  console.log('backed up', backup.length, 'entries ->', BK);
  // delete blobs
  let del = 0;
  for (const id of toDelete) { try { await store.delete('answers/' + id + '.json'); del++; } catch (e) {} }
  // splice index once
  const dset = new Set(toDelete);
  const fresh = await store.get('_index.json', { type: 'json' });
  const before = fresh.entries.length;
  fresh.entries = fresh.entries.filter(e => e && !dset.has(e.id));
  await store.setJSON('_index.json', fresh);
  console.log(JSON.stringify({ live: true, blobs_deleted: del, index_before: before, index_after: fresh.entries.length, backup: BK }));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
