// SEO-optimize all ACG Systems knowledge Q&As: semantic FAQ compete keywords + IndexNow.
// Usage: node _acg_seo_optimize.js [--dry-run]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const {
  tagsForEntry,
  entrySeoBrandKeywords,
  semanticFaqForTitle,
  ACG_STATIC_URLS,
  ACG_KEYWORD_PHRASES,
  isAcgEntry,
} = require('./_acg_compete_semantic_keywords');
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

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  const candidates = (idx.entries || []).filter((e) => e && /^q\d+$/i.test(e.id));
  const results = [];

  for (const row of candidates) {
    const id = row.id;
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry || !isAcgEntry(row, entry)) continue;

    const newTags = tagsForEntry(id, entry.question || row.question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(entry.question || row.question);
    const newFaq = semanticFaqForTitle(entry.question || row.question);
    const tagsChanged = JSON.stringify(newTags) !== JSON.stringify(entry.tags || []);
    const displayChanged =
      JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay);
    const faqChanged =
      JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);
    const changed = tagsChanged || displayChanged || faqChanged;

    if (!DRY && changed) {
      const now = Date.now();
      await store.setJSON(`answers/${id}.json`, {
        ...entry,
        tags: newTags,
        seo_brand_keywords: newDisplay,
        seo_semantic_faq_questions: newFaq,
        seo_semantic_faq: true,
        seo_keyword_phrase_count: ACG_KEYWORD_PHRASES.length,
        seo_optimized_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === id);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      }
    }

    let indexnow = null;
    if (!DRY) {
      indexnow = await pingIndexNowEntry(id, store, { ...row, tags: newTags });
    }

    results.push({
      id,
      ok: true,
      changed,
      tagCount: newTags.length,
      keywordCount: newDisplay.length,
      url: `https://pulserevops.com/knowledge/${id}`,
      indexnow: indexnow ? { ok: indexnow.ok, pings: indexnow.pings } : null,
    });
    console.log(
      `${id}\tchanged=${changed}\ttags=${newTags.length}\tkw=${newDisplay.length}\tindexnow=${indexnow?.ok ?? 'skip'}`
    );
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  let hubPing = null;
  if (!DRY) hubPing = await pingIndexNowUrlList(ACG_STATIC_URLS);

  const report = {
    ok: true,
    dryRun: DRY,
    count: results.length,
    changed: results.filter((r) => r.changed).length,
    keywordPhrases: ACG_KEYWORD_PHRASES.length,
    hubPing,
    hubUrls: ACG_STATIC_URLS,
    results,
  };
  fs.writeFileSync('C:/Users/koryj/website/_acg_seo_optimize_report.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
