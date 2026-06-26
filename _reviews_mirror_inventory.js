// Fast inventory from _index.json rows only (no per-blob fetch).
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { matchReviewsInventoryEntry, MIRROR_KEYWORD_PHRASES } = require('./_reviews_mirror_semantic_keywords');
const { libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');

try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SITE = 'https://pulserevops.com';

(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const buckets = { er: [], tagged: [], title: [], mirror: [], st: [], q: [], ik: [] };
  const entries = [];

  for (const row of idx.entries || []) {
    if (!row || !row.id) continue;
    const match = matchReviewsInventoryEntry(row, null);
    if (!match) continue;
    const publicUrl = libraryEntryPublicUrl(row);
    entries.push({
      id: row.id,
      bucket: match.bucket,
      reason: match.reason,
      question: String(row.question || '').slice(0, 140),
      url: publicUrl,
      reviewsUrl: publicUrl ? `${publicUrl}/reviews` : null,
    });
    buckets[match.bucket].push(row.id);
    if (/^st\d+$/i.test(row.id) && /\breviews?\b/i.test((row.question || '') + ' ' + (row.tags || []).join(' '))) {
      buckets.st.push(row.id);
    }
    if (/^q\d+$/i.test(row.id) && /\breviews?\b/i.test((row.question || '') + ' ' + (row.tags || []).join(' '))) {
      buckets.q.push(row.id);
    }
    if (/^ik\d+$/i.test(row.id) && /\breviews?\b/i.test((row.question || '') + ' ' + (row.tags || []).join(' '))) {
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

  fs.writeFileSync(path.join(__dirname, '_reviews_mirror_inventory.json'), JSON.stringify(inventory, null, 2));
  console.log(JSON.stringify(inventory.counts, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
