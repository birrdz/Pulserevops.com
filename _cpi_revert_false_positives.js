// Revert CPI Security SEO fields on non-brand matches (standalone cpi / inflation cpi).
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const matches = require('./_cpi_matches.json').matches.filter((m) => m.matchReason !== 'cpi security');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let reverted = 0;
  for (const m of matches) {
    const entry = await store.get(`answers/${m.id}.json`, { type: 'json' });
    if (!entry) continue;
    const {
      seo_brand_keywords,
      seo_semantic_faq_questions,
      seo_semantic_faq,
      seo_keyword_phrase_count,
      seo_optimized_at,
      seo_cpi_security_batch,
      ...rest
    } = entry;
    await store.setJSON(`answers/${m.id}.json`, { ...rest, tags: m.tags });
    const i = idx.entries.findIndex((e) => e && e.id === m.id);
    if (i >= 0) {
      const row = { ...idx.entries[i], tags: m.tags };
      delete row.seo_optimized_at;
      idx.entries[i] = row;
    }
    reverted++;
    console.log('reverted', m.id);
  }
  await store.setJSON('_index.json', idx);
  console.log(JSON.stringify({ ok: true, reverted }));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
