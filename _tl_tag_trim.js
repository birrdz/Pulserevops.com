// _tl_tag_trim.js — DEPLOY-FREE FIX for "Pulse Tools pillar Q&As don't load".
//
// Root cause: 913 tl#### index entries carry runaway tag arrays (up to 706 tags
// each, ~13.7 MB raw). The deployed pulse-machine-library-list returns the pillar
// branch UNCAPPED, so /...?pillar=tl exceeds Netlify's 6 MB response limit →
// HTTP 502 Function.ResponseSizeTooLarge → the Tools grid renders empty.
//
// Fix: trim each tl entry's tags to the leading CAP in the live _index.json blob.
// The first ~20 tags lead with functional + pillar + sports tags (search / filter
// survive); the long SEO keyword block lives on the rendered entry page from the
// full answer blob, NOT this list API. Brings the pillar=tl payload to ~0.68 MB.
//
// Safe against the reconcile heartbeat: it skips the tl prefix and only ADDS
// missing entries (never rewrites existing tags), so this trim sticks. Strong-read
// + write + verify + retry guards the brief read-modify-write race window.

const fs = require('fs');
for (const f of ['.env.local', '.env']) {
  try { for (const ln of fs.readFileSync(f, 'utf8').split(/\r?\n/)) { const m = ln.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
}
const { getStore } = require('@netlify/blobs');

const CAP = 20;
const IS_TL = (e) => e && typeof e.id === 'string' && /^tl\d+$/i.test(e.id);

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
      if (!IS_TL(e) || !Array.isArray(e.tags) || e.tags.length <= CAP) continue;
      before += e.tags.length;
      e.tags = e.tags.slice(0, CAP);
      trimmed++;
    }
    if (!trimmed) { console.log(`attempt ${attempt}: nothing over cap — already trimmed.`); break; }

    await store.setJSON('_index.json', idx);
    const sizeMB = (JSON.stringify({ entries: idx.entries.filter(IS_TL) }).length / 1048576).toFixed(2);
    console.log(`attempt ${attempt}: trimmed ${trimmed} tl entries (avg ${Math.round(before / trimmed)}→${CAP} tags). tl payload now ${sizeMB} MB. wrote _index.json (${idx.entries.length} total).`);

    // Verify the write held against any concurrent heartbeat write.
    await new Promise(r => setTimeout(r, 3000));
    const re = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    const stillBig = re.entries.filter(e => IS_TL(e) && Array.isArray(e.tags) && e.tags.length > CAP).length;
    if (!stillBig) { console.log(`VERIFIED: 0 tl entries over ${CAP} tags. Fix stable.`); break; }
    console.log(`verify: ${stillBig} tl entries still over cap (lost a race) — retrying...`);
  }
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
