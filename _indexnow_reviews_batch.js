// One-shot batch IndexNow ping for ALL reviews-mirror URLs.
// Generates /knowledge/<id>/reviews, /sales-trainings/<id>/reviews,
// /industry-kpis/<id>/reviews for every library entry, plus the 12 static-page
// reviews URLs, and submits them to IndexNow.org / Bing / Yandex / Seznam /
// Naver in one batch. Free, fast — Bing crawls within hours.

const fs = require('fs');
const path = require('path');
try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const SITE = 'https://pulserevops.com';

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = idx.entries || [];

  const isTraining = e => (Array.isArray(e.tags) && e.tags.includes('sales-training')) || /^st\d+$/i.test(e.id || '');
  const isKpi      = e => (Array.isArray(e.tags) && e.tags.includes('industry-kpi')) || /^ik\d+$/i.test(e.id || '');

  // Static-page reviews (12 URLs)
  const staticPages = [
    '/home/reviews', '/knowledge/reviews', '/sales-trainings/reviews', '/industry-kpis/reviews',
    '/dashboard/reviews', '/matrix/reviews', '/schedule/reviews', '/plan-90/reviews',
    '/bins/reviews', '/answers/reviews', '/machine/reviews',
  ];

  const urls = [];
  for (const p of staticPages) urls.push(SITE + p);

  for (const e of entries) {
    if (!e || !e.id) continue;
    let suffixPath;
    if (isTraining(e))    suffixPath = '/sales-trainings/' + e.id + '/reviews';
    else if (isKpi(e))    suffixPath = '/industry-kpis/' + e.id + '/reviews';
    else                  suffixPath = '/knowledge/' + e.id + '/reviews';
    urls.push(SITE + suffixPath);
  }

  console.log('Total reviews URLs to ping:', urls.length);

  // IndexNow allows up to 10,000 URLs per request. Split into batches if needed.
  const BATCH = 9000;
  let success = 0, fail = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const slice = urls.slice(i, i + BATCH);
    const res = await pingIndexNowUrlList(slice);
    console.log(`Batch ${i / BATCH + 1}: ${slice.length} URLs · ok=${res.ok}`, JSON.stringify(res.pings || {}));
    if (res.ok) success += slice.length; else fail += slice.length;
  }
  console.log(`DONE. Submitted ${success} URLs successfully, ${fail} failed.`);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
