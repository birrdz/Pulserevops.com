// SEO-optimize all hf#### entries. Usage: node _hf_seo_optimize.js [--dry-run]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { tagsForEntry, entrySeoBrandKeywords, semanticFaqForTitle, HF_STATIC_URLS, HF_KEYWORD_PHRASES } = require('./_hf_compete_semantic_keywords');
const { pingIndexNowEntry, pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (_) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const RX = /^hf\d+$/i;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = (idx.entries || []).filter((e) => e && RX.test(e.id));
  let changed = 0;
  for (const row of rows) {
    const entry = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!entry) continue;
    const newTags = tagsForEntry(row.id, entry.question || row.question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(entry.question || row.question);
    const newFaq = semanticFaqForTitle(entry.question || row.question);
    const did = JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) || JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) || JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);
    if (!DRY && did) {
      const now = Date.now();
      await store.setJSON('answers/' + row.id + '.json', { ...entry, tags: newTags, seo_brand_keywords: newDisplay, seo_semantic_faq_questions: newFaq, seo_semantic_faq: true, seo_keyword_phrase_count: HF_KEYWORD_PHRASES.length, seo_optimized_at: now });
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      changed++;
      await pingIndexNowEntry(row.id, store, { ...row, tags: newTags });
      console.log(row.id, 'stamped');
    }
  }
  if (!DRY) await store.setJSON('_index.json', idx);
  if (!DRY) await pingIndexNowUrlList(HF_STATIC_URLS);
  const report = { ok: true, prefix: 'hf', count: rows.length, changed, phrases: HF_KEYWORD_PHRASES.length };
  fs.writeFileSync('C:/Users/koryj/website/_hf_seo_optimize_report.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
