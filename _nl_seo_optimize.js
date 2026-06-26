// SEO-optimize all live nl#### entries: semantic FAQ compete keywords + IndexNow.
// Usage: node _nl_seo_optimize.js [--dry-run] [--from nl0101]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const {
  tagsForEntry,
  entrySeoBrandKeywords,
  semanticFaqForTitle,
  NL_STATIC_URLS,
  NL_KEYWORD_PHRASES,
} = require('./_nl_compete_semantic_keywords');
const { pingIndexNowEntry, pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const FROM = (process.argv.find((a) => /^nl\d+$/i.test(a)) || '').toLowerCase();

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  let nlRows = (idx.entries || []).filter((e) => e && /^nl\d+$/i.test(e.id));
  if (FROM) nlRows = nlRows.filter((e) => e.id >= FROM);
  nlRows.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));

  const results = [];
  for (const row of nlRows) {
    const id = row.id;
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry) {
      results.push({ id, ok: false, reason: 'no answer blob' });
      continue;
    }

    const newTags = tagsForEntry(id, entry.question || row.question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(entry.question || row.question);
    const newFaq = semanticFaqForTitle(entry.question || row.question);
    const changed =
      JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) ||
      JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) ||
      JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);

    if (!DRY && changed) {
      const now = Date.now();
      await store.setJSON(`answers/${id}.json`, {
        ...entry,
        tags: newTags,
        seo_brand_keywords: newDisplay,
        seo_semantic_faq_questions: newFaq,
        seo_semantic_faq: true,
        seo_keyword_phrase_count: NL_KEYWORD_PHRASES.length,
        seo_optimized_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
    }

    let indexnow = null;
    if (!DRY && changed) indexnow = await pingIndexNowEntry(id, store, { ...row, tags: newTags });

    results.push({ id, ok: true, changed, url: `https://pulserevops.com/nightlife/${id}` });
    if (changed) console.log(`${id}\tindexnow=${indexnow?.ok ?? 'skip'}`);
  }

  if (!DRY) await store.setJSON('_index.json', idx);
  const hubPing = DRY ? null : await pingIndexNowUrlList(NL_STATIC_URLS);

  const report = { ok: true, dryRun: DRY, count: results.length, changed: results.filter((r) => r.changed).length, hubPing };
  fs.writeFileSync('C:/Users/koryj/website/_nl_seo_optimize_report.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
