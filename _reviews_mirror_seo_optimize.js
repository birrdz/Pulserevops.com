// Reviews mirror SEO batch — inventory, stamp shared mirror index, IndexNow, hub sync, verify, deploy, email.
// Usage:
//   node _reviews_mirror_seo_optimize.js
//   node _reviews_mirror_seo_optimize.js --dry-run
//   node _reviews_mirror_seo_optimize.js --skip-deploy
//   node _reviews_mirror_seo_optimize.js --inventory-only
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const {
  MIRROR_KEYWORD_PHRASES,
  MIRROR_STATIC_URLS,
  mirrorTagsForEntry,
  mirrorEntrySeoBrandKeywords,
  mirrorSemanticFaqForTitle,
  matchReviewsInventoryEntry,
  isErEntry,
} = require('./_reviews_mirror_semantic_keywords');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
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
const SITE = 'https://pulserevops.com';
const DRY = process.argv.includes('--dry-run');
const SKIP_DEPLOY = process.argv.includes('--skip-deploy');
const INVENTORY_ONLY = process.argv.includes('--inventory-only');
const INVENTORY_OUT = path.join(__dirname, '_reviews_mirror_inventory.json');
const REPORT_OUT = path.join(__dirname, '_reviews_mirror_seo_report.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-reviews-mirror-seo/1.0' }, maxRedirects: 5 }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function checkSeo(html, url) {
  const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const checks = {
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="[^"]+"/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${esc}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
    keywords: /<meta\s+name="keywords"\s+content="/i.test(html),
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

function mergeKeywords(existing, incoming) {
  return Array.from(new Set([...(existing || []), ...(incoming || [])].map(String).filter(Boolean)));
}

async function buildInventory(store, idx) {
  const buckets = { er: [], tagged: [], title: [], mirror: [], st: [], q: [], ik: [] };
  const entries = [];

  for (const row of idx.entries || []) {
    if (!row || !row.id) continue;
    const match = matchReviewsInventoryEntry(row, null);
    if (!match) continue;

    const publicUrl = libraryEntryPublicUrl(row);
    const reviewsUrl = publicUrl ? `${publicUrl}/reviews` : null;
    const rec = {
      id: row.id,
      bucket: match.bucket,
      reason: match.reason,
      question: String(row.question || '').slice(0, 140),
      tags: (row.tags || []).slice(0, 12),
      url: publicUrl,
      reviewsUrl,
      hasSeo: !!row.seo_optimized_at,
    };
    entries.push(rec);
    if (buckets[match.bucket]) buckets[match.bucket].push(row.id);
    if (/^st\d+$/i.test(row.id)) buckets.st.push(row.id);
    if (/^q\d+$/i.test(row.id) && /\breviews?\b/i.test(rec.question + ' ' + (row.tags || []).join(' '))) {
      buckets.q.push(row.id);
    }
    if (/^ik\d+$/i.test(row.id) && /\breviews?\b/i.test(rec.question + ' ' + (row.tags || []).join(' '))) {
      buckets.ik.push(row.id);
    }
  }

  const staticReviewsPages = [
    '/home/reviews', '/knowledge/reviews', '/sales-trainings/reviews', '/industry-kpis/reviews',
    '/dashboard/reviews', '/matrix/reviews', '/schedule/reviews', '/plan-90/reviews',
    '/bins/reviews', '/answers/reviews', '/machine/reviews', '/reviews',
  ];

  const inventory = {
    generatedAt: new Date().toISOString(),
    keywordFile: '_reviews_mirror_keyword_phrases.json',
    keywordCount: MIRROR_KEYWORD_PHRASES.length,
    counts: {
      total: entries.length,
      er: buckets.er.length,
      tagged: buckets.tagged.length,
      title: buckets.title.length,
      mirror: buckets.mirror.length,
      stWithReviews: buckets.st.length,
      qWithReviews: buckets.q.length,
      ikWithReviews: buckets.ik.length,
      staticPages: staticReviewsPages.length,
    },
    buckets,
    staticPages: staticReviewsPages.map((p) => SITE + p),
    hubPages: [SITE + '/electronic-reviews', SITE + '/reviews'],
    entries,
  };

  fs.writeFileSync(INVENTORY_OUT, JSON.stringify(inventory, null, 2));
  return inventory;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  console.log('Building reviews mirror inventory…');
  const inventory = await buildInventory(store, idx);
  console.log(
    `Inventory: total=${inventory.counts.total} er=${inventory.counts.er} tagged=${inventory.counts.tagged} title=${inventory.counts.title} mirror=${inventory.counts.mirror}`
  );

  if (INVENTORY_ONLY) {
    console.log('Inventory-only mode — wrote', INVENTORY_OUT);
    process.exit(0);
  }

  const progress = createBatchProgressReporter({
    label: 'Reviews mirror SEO batch',
    total: inventory.counts.total,
    interval: 10,
    pillarUrl: SITE + '/electronic-reviews',
  });

  if (!DRY) {
    await progress.start(
      `<p>Reviews mirror SEO | Entries: <b>${inventory.counts.total}</b> | Keywords: <b>${MIRROR_KEYWORD_PHRASES.length}</b> | er####: ${inventory.counts.er}</p>`
    );
  }

  const results = [];
  let updated = 0;
  let skipped = 0;
  let indexnowOk = 0;

  for (const inv of inventory.entries) {
    const row = idx.entries.find((e) => e && e.id === inv.id) || { id: inv.id, question: inv.question, tags: inv.tags };
    const entry = await store.get(`answers/${inv.id}.json`, { type: 'json' });
    if (!entry) {
      results.push({ ...inv, ok: false, reason: 'no answer blob' });
      if (!DRY) await progress.fail(`${inv.id}: no answer blob`);
      continue;
    }

    const question = entry.question || row.question;
    const alreadyStamped =
      entry.reviews_mirror_index_at &&
      entry.seo_keyword_phrase_count === MIRROR_KEYWORD_PHRASES.length &&
      (entry.tags || []).includes('reviews-mirror-index');

    if (alreadyStamped && !DRY) {
      skipped++;
      results.push({ id: inv.id, ok: true, skipped: true, bucket: inv.bucket, url: inv.url, reviewsUrl: inv.reviewsUrl });
      if (results.length % 100 === 0) {
        console.log(`… ${results.length}/${inventory.counts.total} (${updated} updated, ${skipped} skipped)`);
      }
      continue;
    }

    const newTags = mirrorTagsForEntry(inv.id, question, entry.tags || row.tags);
    const newDisplay = mirrorEntrySeoBrandKeywords(inv.id, question);
    const newFaq = mirrorSemanticFaqForTitle(question);
    const mergedDisplay = mergeKeywords(entry.seo_brand_keywords, newDisplay);
    const mergedFaq = mergeKeywords(entry.seo_semantic_faq_questions, newFaq);

    const changed =
      JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) ||
      JSON.stringify(mergedDisplay) !== JSON.stringify(entry.seo_brand_keywords || []) ||
      JSON.stringify(mergedFaq) !== JSON.stringify(entry.seo_semantic_faq_questions || []) ||
      entry.seo_keyword_phrase_count !== MIRROR_KEYWORD_PHRASES.length ||
      !entry.seo_optimized_at;

    if (!DRY) {
      const now = Date.now();
      await store.setJSON(`answers/${inv.id}.json`, {
        ...entry,
        tags: newTags,
        seo_brand_keywords: mergedDisplay,
        seo_semantic_faq_questions: mergedFaq,
        seo_semantic_faq: true,
        seo_keyword_phrase_count: MIRROR_KEYWORD_PHRASES.length,
        seo_optimized_at: now,
        reviews_mirror_index_at: now,
      });
      const i = idx.entries.findIndex((e) => e && e.id === inv.id);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      }
      if (changed) updated++;
    }

    let indexnow = null;

    results.push({
      id: inv.id,
      ok: true,
      bucket: inv.bucket,
      changed: DRY ? null : changed,
      tagCount: newTags.length,
      keywordCount: mergedDisplay.length,
      faqCount: mergedFaq.length,
      url: inv.url,
      reviewsUrl: inv.reviewsUrl,
      indexnow: indexnow ? { ok: indexnow.ok, pings: indexnow.pings } : null,
    });

    if (!DRY) {
      await progress.tick(`${inv.id} kw=${mergedDisplay.length}`);
      if (results.length % 100 === 0) {
        console.log(`… ${results.length}/${inventory.counts.total} (${updated} updated, ${skipped} skipped)`);
      }
    } else if (results.length <= 20 || isErEntry(inv.id)) {
      console.log(`${inv.id}\t${inv.bucket}\tkw=${mergedDisplay.length}\tfaq=${mergedFaq.length}`);
    }
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  let hubSync = null;
  if (!DRY) {
    try {
      require('./_er_seo_sync_hub.js');
      hubSync = { ok: true, page: 'electronic-reviews.html' };
      console.log('Hub sync: electronic-reviews.html patched');
    } catch (e) {
      hubSync = { ok: false, error: String(e.message || e) };
      console.error('Hub sync failed:', hubSync.error);
    }
  }

  let staticPing = null;
  let reviewsBatchPing = null;
  let erPing = null;
  if (!DRY) {
    const erUrls = inventory.entries.filter((e) => isErEntry(e.id) && e.url).map((e) => [e.url, e.reviewsUrl]).flat().filter(Boolean);
    if (erUrls.length) erPing = await pingIndexNowUrlList(erUrls.slice(0, 9000));
    staticPing = await pingIndexNowUrlList(MIRROR_STATIC_URLS);
    const reviewsUrls = inventory.entries
      .filter((e) => e.reviewsUrl)
      .map((e) => e.reviewsUrl)
      .slice(0, 9000);
    if (reviewsUrls.length) {
      reviewsBatchPing = await pingIndexNowUrlList(reviewsUrls);
      indexnowOk = reviewsBatchPing.ok ? reviewsUrls.length : 0;
    }
  }

  const verifyTargets = [];
  const erSample = inventory.entries.find((e) => isErEntry(e.id));
  if (erSample) {
    verifyTargets.push({ label: 'er entry', url: erSample.url });
    verifyTargets.push({ label: 'er reviews mirror', url: erSample.reviewsUrl });
  }
  verifyTargets.push({ label: 'electronic-reviews hub', url: SITE + '/electronic-reviews' });

  const seoVerify = [];
  if (!DRY) {
    const smReviews = await get(SITE + '/sitemap-reviews.xml');
    for (const t of verifyTargets) {
      if (!t.url) continue;
      const page = await get(t.url);
      const seo = checkSeo(page.body || '', t.url);
      const inSitemap =
        (smReviews.body || '').includes(t.url.replace(SITE, '')) ||
        (smReviews.body || '').includes(t.url);
      seoVerify.push({ ...t, status: page.status, seo: seo.ok, missing: seo.missing, inSitemap });
      console.log(`VERIFY ${t.label}\t${t.url}\tHTTP ${page.status}\tSEO ${seo.ok ? 'OK' : seo.missing.join(',')}`);
    }
  }

  let deploy = null;
  if (!DRY && !SKIP_DEPLOY && hubSync && hubSync.ok) {
    console.log('Netlify prod deploy (hub HTML changed)…');
    try {
      const out = execSync('npx netlify deploy --prod --message "Reviews mirror SEO hub sync"', {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 600000,
      });
      deploy = { ok: true, tail: out.slice(-500) };
      console.log('Deploy OK');
    } catch (e) {
      deploy = { ok: false, error: String(e.message || e), stderr: (e.stderr || '').slice(-400) };
      console.error('Deploy failed:', deploy.error);
    }
  } else if (SKIP_DEPLOY) {
    deploy = { ok: null, skipped: true };
  }

  const report = {
    ok: true,
    dryRun: DRY,
    keywordFile: '_reviews_mirror_keyword_phrases.json',
    keywordCount: MIRROR_KEYWORD_PHRASES.length,
    inventory: inventory.counts,
    updated,
    skipped,
    indexnowOk,
    erPing,
    hubSync,
    staticPing,
    reviewsBatchPing,
    seoVerify,
    deploy,
    sampleUrls: verifyTargets.map((t) => t.url).filter(Boolean),
    completedAt: new Date().toISOString(),
  };
  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2));

  if (!DRY) {
    const table = `<table border="1" cellpadding="4"><tr><th>Pillar</th><th>Count</th><th>Keywords</th><th>IndexNow</th><th>Deploy</th></tr>
<tr><td>er#### (electronic-reviews)</td><td>${inventory.counts.er}</td><td>${MIRROR_KEYWORD_PHRASES.length}</td><td>${indexnowOk}/${inventory.counts.total}</td><td>${deploy?.ok ? 'OK' : deploy?.skipped ? 'skipped' : 'FAILED'}</td></tr>
<tr><td>tagged reviews</td><td>${inventory.counts.tagged}</td><td>${MIRROR_KEYWORD_PHRASES.length}</td><td>batch</td><td>—</td></tr>
<tr><td>/reviews mirror (all)</td><td>${inventory.counts.total}</td><td>${MIRROR_KEYWORD_PHRASES.length}</td><td>${reviewsBatchPing?.ok ? 'OK' : '—'}</td><td>—</td></tr>
<tr><td>static /reviews pages</td><td>${inventory.counts.staticPages}</td><td>hub meta</td><td>${staticPing?.ok ? 'OK' : '—'}</td><td>${deploy?.ok ? 'OK' : '—'}</td></tr></table>
<p>Updated blobs: <b>${updated}</b> | Skipped (already stamped): <b>${skipped}</b> | IndexNow /reviews batch: <b>${reviewsBatchPing?.ok ? 'OK' : '—'}</b> | Keyword file: <code>_reviews_mirror_keyword_phrases.json</code></p>
<p>Sample: ${verifyTargets.map((t) => `<a href="${t.url}">${t.label}</a>`).join(' · ')}</p>`;
    await progress.complete(table);
  }

  console.log(JSON.stringify({ ok: true, total: inventory.counts.total, updated, skipped, indexnowOk, deploy: deploy?.ok }, null, 2));
})().catch(async (e) => {
  console.error('ERR', e && e.message);
  try {
    const progress = createBatchProgressReporter({ label: 'Reviews mirror SEO batch' });
    await progress.error(String(e.message || e));
  } catch (_) {}
  process.exit(1);
});
