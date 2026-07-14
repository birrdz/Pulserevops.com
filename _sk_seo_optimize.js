// SEO-optimize all sk#### entries. Usage: node _sk_seo_optimize.js [--dry-run]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { tagsForEntry, entrySeoBrandKeywords, semanticFaqForTitle, SK_STATIC_URLS, SK_KEYWORD_PHRASES } = require('./_sk_compete_semantic_keywords');
const { pingIndexNowEntry, pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (_) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force'); // re-stamp + IndexNow every sk URL even if already optimized
const RX = /^sk\d+$/i;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rows = (idx.entries || []).filter((e) => e && RX.test(e.id));
  let changed = 0, pinged = 0;
  const allUrls = [];
  for (const row of rows) {
    const entry = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!entry) continue;
    const newTags = tagsForEntry(row.id, entry.question || row.question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(entry.question || row.question);
    const newFaq = semanticFaqForTitle(entry.question || row.question);
    const did = FORCE || JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) || JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) || JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);
    allUrls.push('https://pulserevops.com/skills/' + row.id);
    if (!DRY && did) {
      const now = Date.now();
      await store.setJSON('answers/' + row.id + '.json', { ...entry, tags: newTags, seo_brand_keywords: newDisplay, seo_semantic_faq_questions: newFaq, seo_semantic_faq: true, seo_keyword_phrase_count: SK_KEYWORD_PHRASES.length, seo_optimized_at: now });
      const i = idx.entries.findIndex((e) => e && e.id === row.id);
      if (i >= 0) idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      changed++;
      await pingIndexNowEntry(row.id, store, { ...row, tags: newTags });
      pinged++;
      console.log(row.id, FORCE ? 'force-stamped+pinged' : 'stamped');
    }
  }
  if (!DRY) await store.setJSON('_index.json', idx);
  // Always IndexNow-max the hub + every skill URL (batched) so fixed pages get re-crawled
  if (!DRY) {
    const { SK_HUB_URL } = require('./_sk_compete_semantic_keywords');
    const urls = [SK_HUB_URL].concat(allUrls);
    const BATCH = 200;
    for (let i = 0; i < urls.length; i += BATCH) {
      const chunk = urls.slice(i, i + BATCH);
      const r = await pingIndexNowUrlList(chunk);
      console.log('IndexNow batch', i / BATCH + 1, 'n=' + chunk.length, 'ok=' + !!(r && r.ok));
    }
  }
  const report = { ok: true, prefix: 'sk', count: rows.length, changed, pinged, phrases: SK_KEYWORD_PHRASES.length, force: FORCE, dry: DRY };
  fs.writeFileSync('C:/Users/koryj/website/_sk_seo_optimize_report.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report));
})().catch((e) => { console.error(e); process.exit(1); });
