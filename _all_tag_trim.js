// _all_tag_trim.js — DEPLOY-FREE FIX for "homepage search loads nothing / 502".
//
// Root cause: the live pulse-machine-library-list mini projection now returns
// `tags` (so the homepage predictive search can match on keywords), but many
// entries carry long tag arrays (tl/tool pages especially). At 22k+ entries the
// mini payload blew past Netlify's 6 MB response cap → HTTP 502 → the homepage
// search fetch fails → zero autocomplete, no keyword autofill at all.
//
// Fix: cap EVERY index entry's tags to the leading CAP in the live _index.json
// blob. The first ~CAP tags lead with functional + pillar + primary keyword tags
// (predictive search / filters survive); the long SEO keyword block stays on the
// rendered entry page from the full answer blob, NOT this list/mini API.
//
// Safe against the reconcile heartbeat: _index_reconcile_any.js only ADDS missing
// entries (never rewrites existing tags — verified line 61), so this trim sticks.
// Strong-read + write + verify + retry guards the brief read-modify-write race.
//
// Usage: node _all_tag_trim.js [CAP]     (default CAP=10)

const fs = require('fs');
for (const f of ['.env.local', '.env']) {
  try { for (const ln of fs.readFileSync(f, 'utf8').split(/\r?\n/)) { const m = ln.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
}
const { getStore } = require('@netlify/blobs');

const CAP = Math.max(3, parseInt(process.argv[2], 10) || 10);

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });

  for (let attempt = 1; attempt <= 4; attempt++) {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    let trimmed = 0, before = 0;
    for (const e of idx.entries) {
      if (!e || !Array.isArray(e.tags) || e.tags.length <= CAP) continue;
      before += e.tags.length;
      e.tags = e.tags.slice(0, CAP);
      trimmed++;
    }
    if (!trimmed) { console.log(`attempt ${attempt}: nothing over cap ${CAP} — already trimmed.`); break; }

    await store.setJSON('_index.json', idx);
    // Estimate the mini payload size (id + question + capped tags) post-trim.
    const miniBytes = JSON.stringify(idx.entries.slice(0, 20000).map(e => ({ id: e.id, question: e.question, tags: e.tags }))).length;
    console.log(`attempt ${attempt}: trimmed ${trimmed} entries (avg ${Math.round(before / trimmed)}→${CAP} tags). est mini payload ${(miniBytes / 1048576).toFixed(2)} MB. wrote _index.json (${idx.entries.length} total).`);

    await new Promise(r => setTimeout(r, 3000));
    const re = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    const stillBig = re.entries.filter(e => e && Array.isArray(e.tags) && e.tags.length > CAP).length;
    if (!stillBig) { console.log(`VERIFIED: 0 entries over ${CAP} tags. Fix stable.`); break; }
    console.log(`verify: ${stillBig} entries still over cap (lost a race) — retrying...`);
  }
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
