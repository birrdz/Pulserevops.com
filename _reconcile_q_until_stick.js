// One-off: reconcile q16220..q16231 into _index.json and retry until the write
// survives the concurrent background-writer race. Adds ONLY the target ids
// (minimal, fast) rather than scanning all 7k q blobs each attempt.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TARGETS = [];
for (let n = 16220; n <= 16231; n++) TARGETS.push('q' + n);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  // Pre-fetch the answer records once.
  const recs = {};
  for (const id of TARGETS) recs[id] = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);

  // Persist until a write survives N consecutive verifications (so we know it
  // truly stuck, not just landed in a momentary gap). Non-destructive: we only
  // ever ADD our 12 target ids if missing, exactly like the heartbeat does.
  const MAX = 400;            // ~ up to several minutes of fair retries
  let consecutiveHeld = 0;
  const NEED_HELD = 4;        // 4 clean checks in a row (~ spans a gapfill cycle)
  for (let attempt = 1; attempt <= MAX; attempt++) {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    const have = new Set(idx.entries.filter(e => e && e.id).map(e => e.id));
    const missing = TARGETS.filter(id => !have.has(id));
    if (!missing.length) {
      consecutiveHeld++;
      if (consecutiveHeld === 1) console.log('attempt', attempt, 'all 12 present, confirming stability...');
      if (consecutiveHeld >= NEED_HELD) { console.log('STUCK: 12/12 held across', NEED_HELD, 'checks. size', idx.entries.length); return; }
      await new Promise(r => setTimeout(r, 2500));
      continue;
    }
    consecutiveHeld = 0;
    for (const id of missing) {
      const rec = recs[id]; if (!rec) { console.log('no blob for', id); continue; }
      idx.entries.unshift({
        id, question: rec.question || id, tags: rec.tags || [],
        quality_score: typeof rec.quality_score === 'number' ? rec.quality_score : 10,
        format_v: rec.format_v || '2026-05', pending: false,
        ts: rec.ts || Date.now(), polished_at: rec.polished_at || rec.ts || Date.now(),
        model: rec.model || 'deepseek-chat', was_indexed_at: null,
        seo_optimized_at: rec.seo_optimized_at || rec.ts || Date.now(), images_pending: true,
      });
    }
    await store.setJSON('_index.json', idx);
    if (attempt % 10 === 0) console.log('attempt', attempt, 're-added', missing.length, '(still racing)');
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log('EXHAUSTED', MAX, 'attempts — heartbeat will continue self-healing from the live answer blobs');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
