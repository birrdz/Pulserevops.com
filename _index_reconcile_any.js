// Generic _index.json reconcile for ANY pillar prefix — repairs entries dropped
// by concurrent-write races (answer blobs are race-safe; only the shared index
// loses updates). Idempotent, single final write.
//   node _index_reconcile_any.js <prefix> [<prefix2> ...]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const prefixes = process.argv.slice(2).map((p) => p.toLowerCase()).filter(Boolean);
if (!prefixes.length) { console.error('usage: node _index_reconcile_any.js <prefix> [<prefix2> ...]'); process.exit(1); }

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter((e) => e && e.id).map((e) => e.id));
  let addedTotal = 0;

  for (const pfx of prefixes) {
    const ids = [];
    let cursor;
    do {
      const res = await store.list({ prefix: 'answers/' + pfx, cursor });
      for (const b of res.blobs) { const m = b.key.match(new RegExp('^answers/(' + pfx + '\\d+)\\.json$')); if (m) ids.push(m[1]); }
      cursor = res.cursor;
    } while (cursor);
    const missing = ids.filter((id) => !inIndex.has(id));
    console.log(`[${pfx}] answer blobs: ${ids.length} | missing from index: ${missing.length}`);
    for (const id of missing) {
      const rec = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!rec) { console.log('  skip (no blob):', id); continue; }
      if (rec.noindex) { continue; } // never re-list noindexed (fabricated/held) entries
      idx.entries.unshift({
        id,
        question: rec.question || id,
        tags: rec.tags || [],
        quality_score: typeof rec.quality_score === 'number' ? rec.quality_score : 10,
        format_v: rec.format_v || '2026-05',
        pending: false,
        ts: rec.ts || Date.now(),
        polished_at: rec.polished_at || rec.ts || Date.now(),
        model: rec.model || 'deepseek',
        was_indexed_at: null,
        ...(rec.pinned_until ? { pinned_until: rec.pinned_until } : {}),
        ...(rec.has_answer === false ? {} : { has_answer: true }),
        ...(rec.copied_from ? { copied_from: rec.copied_from } : {}),
        ...(rec.copied_from_pillar ? { copied_from_pillar: rec.copied_from_pillar } : {}),
        ...(rec.family_id ? { family_id: rec.family_id } : {}),
      });
      inIndex.add(id);
      addedTotal++;
    }
  }
  // RE-READ + MERGE the LIVE index right before writing, so any entries a
  // concurrent writer/lane added DURING our (slow) blob-list pass are preserved
  // instead of clobbered. Reconcile only ever ADDS — never drops. This closes the
  // race that froze the index (writer adds X; our stale snapshot overwrote it).
  let mergedIn = 0;
  try {
    const live = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    for (const e of ((live && live.entries) || [])) {
      if (e && e.id && !inIndex.has(e.id)) { idx.entries.unshift(e); inIndex.add(e.id); mergedIn++; }
    }
  } catch (e) { console.log('merge re-read failed (continuing):', e && e.message); }
  if (!addedTotal && !mergedIn) { console.log('NOTHING TO REPAIR.'); return; }
  await store.setJSON('_index.json', idx);
  console.log('REPAIRED. added', addedTotal, 'from blobs +', mergedIn, 'merged-live. new index size:', idx.entries.length);
})().catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
