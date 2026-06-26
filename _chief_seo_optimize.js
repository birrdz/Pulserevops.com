// SEO-max all chief-matching q#### entries: 200 Chief Women's Network keywords + IndexNow.
// Usage: node _chief_seo_optimize.js [--dry-run]
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const {
  tagsForEntry,
  entrySeoBrandKeywords,
  semanticFaqForTitle,
  CHIEF_STATIC_URLS,
  CHIEF_KEYWORD_PHRASES,
} = require('./_chief_compete_semantic_keywords');
const { pingIndexNowEntry, pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const { createBatchProgressReporter } = require('./netlify/functions/lib/progress-email');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
const DRY = process.argv.includes('--dry-run');
const MATCHES_PATH = path.join(__dirname, '_chief_matches.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const matchReport = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf8'));
  const ids = (matchReport.matches || []).map((m) => m.id);
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  const progress = createBatchProgressReporter({
    label: 'Chief Women\'s Network SEO max',
    total: ids.length,
    interval: 10,
    pillarUrl: 'https://pulserevops.com/knowledge',
  });

  const stats = { updated: 0, unchanged: 0, missing: 0, indexnow_ok: 0, indexnow_fail: 0 };
  const results = [];
  const recentIds = [];

  if (!DRY) {
    await progress.start(
      `<p>Starting Chief Women\'s Network SEO max on <b>${ids.length}</b> chief-matching Q&amp;As.</p><p>Keywords: <code>_chief_womens_network_keywords.json</code> (${CHIEF_KEYWORD_PHRASES.length} phrases)</p>`
    );
  }

  for (let n = 0; n < ids.length; n++) {
    const id = ids[n];
    const row = (idx.entries || []).find((e) => e && e.id === id) || { id };
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry) {
      stats.missing++;
      results.push({ id, ok: false, reason: 'no answer blob' });
      continue;
    }

    const question = entry.question || row.question || '';
    const newTags = tagsForEntry(id, question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(question);
    const newFaq = semanticFaqForTitle(question);
    const tagsChanged = JSON.stringify(newTags) !== JSON.stringify(entry.tags || []);
    const displayChanged =
      JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay);
    const faqChanged =
      JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq);
    const changed = tagsChanged || displayChanged || faqChanged;

    if (!DRY) {
      const now = Date.now();
      await store.setJSON(`answers/${id}.json`, {
        ...entry,
        tags: newTags,
        seo_brand_keywords: newDisplay,
        seo_semantic_faq_questions: newFaq,
        seo_semantic_faq: true,
        seo_keyword_phrase_count: CHIEF_KEYWORD_PHRASES.length,
        seo_chief_womens_network: true,
        seo_optimized_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === id);
      if (i >= 0) {
        idx.entries[i] = {
          ...idx.entries[i],
          tags: newTags,
          seo_optimized_at: now,
          was_indexed_at: now,
        };
      }
      if (changed) stats.updated++;
      else stats.unchanged++;

      const ping = await pingIndexNowEntry(id, store, { ...row, tags: newTags });
      if (ping.ok) stats.indexnow_ok++;
      else stats.indexnow_fail++;
      await sleep(100);
    }

    recentIds.push(id);
    if (recentIds.length > 5) recentIds.shift();

    results.push({
      id,
      ok: true,
      changed,
      tagCount: newTags.length,
      keywordCount: newDisplay.length,
      faqCount: newFaq.length,
      url: `https://pulserevops.com/knowledge/${id}`,
    });

    if (!DRY && (n + 1) % 10 === 0) {
      await progress.tick(`${id} SEO+IndexNow (${stats.indexnow_ok}/${n + 1} ok)`);
      console.log(`… ${n + 1}/${ids.length} (${stats.indexnow_ok} indexnow ok)`);
    }
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  let hubPing = null;
  if (!DRY) {
    try {
      const { execSync } = require('child_process');
      execSync('node _chief_seo_sync_hub.js', { cwd: __dirname, stdio: 'inherit' });
    } catch (e) {
      console.warn('hub sync warn', e.message);
      hubPing = await pingIndexNowUrlList(CHIEF_STATIC_URLS);
    }
  }

  const report = {
    ok: true,
    dryRun: DRY,
    matchCount: ids.length,
    stats,
    keywordPhrases: CHIEF_KEYWORD_PHRASES.length,
    hubPing,
    hubUrls: CHIEF_STATIC_URLS,
    sample: results.slice(0, 5),
    lastIds: recentIds,
    finishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(__dirname, '_chief_seo_optimize_report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (!DRY) {
    await progress.complete(
      `<p>Chief SEO max complete: <b>${stats.updated}</b> updated, <b>${stats.unchanged}</b> unchanged, <b>${stats.missing}</b> missing.</p><p>IndexNow: <b>${stats.indexnow_ok}</b> ok / <b>${stats.indexnow_fail}</b> fail.</p><p>Last IDs: ${recentIds.join(', ')}</p>`
    );
  }
})().catch(async (e) => {
  console.error('ERR', e && e.message);
  try {
    const { sendProgressEmail } = require('./_progress_email');
    await sendProgressEmail('Chief SEO max FAILED', `<p>${e && e.message}</p>`);
  } catch (_) {}
  process.exit(1);
});
