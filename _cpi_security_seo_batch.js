// CPI Security SEO max batch — find matches, apply 209 keywords + semantic FAQ, IndexNow, verify, email.
// Usage:
//   node _cpi_security_seo_batch.js              # full run
//   node _cpi_security_seo_batch.js --dry-run
//   node _cpi_security_seo_batch.js --skip-deploy
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const {
  tagsForEntry,
  entrySeoBrandKeywords,
  semanticFaqForTitle,
  matchCpiEntry,
  CPI_KEYWORD_PHRASES,
  CPI_STATIC_URLS,
} = require('./_cpi_security_semantic_keywords');
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
const SKIP_DEPLOY = process.argv.includes('--skip-deploy');
const MATCHES_OUT = path.join(__dirname, '_cpi_matches.json');
const REPORT_OUT = path.join(__dirname, '_cpi_security_seo_batch_report.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-cpi-seo-batch/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function checkSeo(html, id) {
  const url = `https://pulserevops.com/knowledge/${id}`;
  const checks = {
    title: /<title[^>]*>([^<]+)<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

function matchReasonLabel(tier) {
  if (tier === 'cpi-security') return 'cpi security';
  if (tier === 'cpi-word-inflation') return 'standalone cpi (ambiguous: inflation index)';
  if (tier === 'cpi-word') return 'standalone cpi';
  return 'unknown';
}

async function findMatches(store, idx) {
  const matches = [];
  const ambiguous = [];

  for (const row of idx.entries || []) {
    if (!row || !/^q\d+$/i.test(row.id)) continue;
    const entry = await store.get(`answers/${row.id}.json`, { type: 'json' });
    const q = String(row.question || (entry && entry.question) || '');
    const a = entry ? String(entry.answer || '') : '';
    const tier = matchCpiEntry(q, a, row.tags || (entry && entry.tags));
    if (!tier) continue;

    const matchIn = [];
    if (/cpi\s+security/i.test(q) || /\bcpi\b/i.test(q)) matchIn.push('question');
    if (/cpi\s+security/i.test(a) || /\bcpi\b/i.test(a)) matchIn.push('answer');
    if ((row.tags || []).some((t) => /cpi/i.test(String(t)))) matchIn.push('tags');

    const rec = {
      id: row.id,
      question: q.slice(0, 160),
      pillar: 'knowledge',
      url: `https://pulserevops.com/knowledge/${row.id}`,
      matchTier: tier,
      matchReason: matchReasonLabel(tier),
      matchIn,
      tags: (row.tags || []).slice(0, 10),
      hasSeo: !!(entry && entry.seo_optimized_at),
      ambiguous: tier === 'cpi-word-inflation',
    };
    matches.push(rec);
    if (rec.ambiguous) ambiguous.push(row.id);
  }

  matches.sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10));
  const report = { count: matches.length, ambiguousCount: ambiguous.length, ambiguousIds: ambiguous, matches };
  fs.writeFileSync(MATCHES_OUT, JSON.stringify(report, null, 2));
  return report;
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };

  console.log('Finding CPI matches…');
  const matchReport = await findMatches(store, idx);
  console.log(`Found ${matchReport.count} matches (${matchReport.ambiguousCount} ambiguous inflation CPI)`);

  const progress = createBatchProgressReporter({
    label: 'CPI Security SEO batch',
    total: matchReport.count,
    interval: 10,
    pillarUrl: 'https://pulserevops.com/knowledge',
  });

  if (!DRY) {
    await progress.start(
      `<p>Matches: <b>${matchReport.count}</b> | Keywords: <b>${CPI_KEYWORD_PHRASES.length}</b> | Ambiguous CPI: ${matchReport.ambiguousCount}</p>`
    );
  }

  const results = [];
  let updated = 0;
  let indexnowOk = 0;

  for (const m of matchReport.matches) {
    const row = idx.entries.find((e) => e && e.id === m.id) || { id: m.id, question: m.question, tags: m.tags };
    const entry = await store.get(`answers/${m.id}.json`, { type: 'json' });
    if (!entry) {
      await progress.fail(`${m.id}: no answer blob`);
      results.push({ ...m, ok: false, reason: 'no answer blob' });
      continue;
    }

    // Only SEO-max true CPI Security brand entries — skip standalone/inflation CPI hits.
    if (m.matchTier !== 'cpi-security') {
      results.push({
        id: m.id,
        ok: true,
        skipped: true,
        matchReason: m.matchReason,
        ambiguous: m.ambiguous,
        url: m.url,
      });
      await progress.skip(`${m.id} (${m.matchReason}) — not CPI Security brand`);
      continue;
    }

    const question = entry.question || row.question;
    const newTags = tagsForEntry(m.id, question, entry.tags || row.tags);
    const newDisplay = entrySeoBrandKeywords(question);
    const newFaq = semanticFaqForTitle(question);
    const changed =
      JSON.stringify(newTags) !== JSON.stringify(entry.tags || []) ||
      JSON.stringify(entry.seo_brand_keywords || []) !== JSON.stringify(newDisplay) ||
      JSON.stringify(entry.seo_semantic_faq_questions || []) !== JSON.stringify(newFaq) ||
      !entry.seo_optimized_at;

    if (!DRY) {
      const now = Date.now();
      await store.setJSON(`answers/${m.id}.json`, {
        ...entry,
        tags: newTags,
        seo_brand_keywords: newDisplay,
        seo_semantic_faq_questions: newFaq,
        seo_semantic_faq: true,
        seo_keyword_phrase_count: CPI_KEYWORD_PHRASES.length,
        seo_optimized_at: now,
        seo_cpi_security_batch: true,
      });
      const i = idx.entries.findIndex((e) => e && e.id === m.id);
      if (i >= 0) {
        idx.entries[i] = { ...idx.entries[i], tags: newTags, seo_optimized_at: now };
      }
      if (changed) updated++;
    }

    let indexnow = null;
    if (!DRY) {
      indexnow = await pingIndexNowEntry(m.id, store, { ...row, tags: newTags });
      if (indexnow && indexnow.ok) indexnowOk++;
      await sleep(100);
    }

    const rowResult = {
      id: m.id,
      ok: true,
      changed: DRY ? null : changed,
      matchReason: m.matchReason,
      ambiguous: m.ambiguous,
      tagCount: newTags.length,
      keywordCount: newDisplay.length,
      faqCount: newFaq.length,
      url: m.url,
      indexnow: indexnow ? { ok: indexnow.ok, pings: indexnow.pings } : null,
    };
    results.push(rowResult);

    if (!DRY) {
      await progress.tick(`${m.id} kw=${newDisplay.length} indexnow=${indexnow?.ok ?? 'skip'}`);
      if (results.length % 5 === 0) {
        console.log(`… ${results.length}/${matchReport.count} (${indexnowOk} indexnow ok)`);
      }
    } else {
      console.log(`${m.id}\t${m.matchReason}\tkw=${newDisplay.length}\tfaq=${newFaq.length}`);
    }
  }

  if (!DRY) await store.setJSON('_index.json', idx);

  let hubPing = null;
  if (!DRY) hubPing = await pingIndexNowUrlList(CPI_STATIC_URLS);

  const verifyIds = matchReport.matches
    .filter((m) => m.matchTier === 'cpi-security')
    .slice(0, 2)
    .map((m) => m.id);
  const seoVerify = [];
  if (!DRY) {
    const sitemap = await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap');
    const smBody = sitemap.body || '';
    for (const id of verifyIds) {
      const pageUrl = `https://pulserevops.com/knowledge/${id}`;
      const page = await get(pageUrl);
      const seo = checkSeo(page.body || '', id);
      const inSitemap = smBody.includes(`/knowledge/${id}</loc>`) || smBody.includes(`/knowledge/${id}<`);
      seoVerify.push({ id, url: pageUrl, status: page.status, seo: seo.ok, missing: seo.missing, inSitemap });
      console.log(`VERIFY ${id}\tHTTP ${page.status}\tSEO ${seo.ok ? 'OK' : 'FAIL'}\tSitemap ${inSitemap ? 'yes' : 'NO'}`);
    }
  }

  let deploy = null;
  if (!DRY && !SKIP_DEPLOY) {
    console.log('Netlify prod deploy…');
    try {
      const out = execSync('npx netlify deploy --prod --message "CPI Security SEO batch"', {
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
  }

  const report = {
    ok: true,
    dryRun: DRY,
    keywordCount: CPI_KEYWORD_PHRASES.length,
    matchCount: matchReport.count,
    ambiguousCount: matchReport.ambiguousCount,
    ambiguousIds: matchReport.ambiguousIds,
    updated,
    indexnowOk,
    hubPing,
    seoVerify,
    deploy,
    results,
    completedAt: new Date().toISOString(),
  };
  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2));

  if (!DRY) {
    let table = '<table border="1" cellpadding="4" cellspacing="0"><tr><th>ID</th><th>Match</th><th>KW</th><th>IndexNow</th><th>SEO</th><th>Sitemap</th></tr>';
    for (const r of results.slice(0, 40)) {
      const v = seoVerify.find((x) => x.id === r.id);
      table += `<tr><td>${r.id}</td><td>${r.matchReason}</td><td>${r.keywordCount}</td><td>${r.indexnow?.ok ? 'OK' : '—'}</td><td>${v ? (v.seo ? 'OK' : 'FAIL') : '—'}</td><td>${v ? (v.inSitemap ? 'yes' : 'no') : '—'}</td></tr>`;
    }
    if (results.length > 40) table += `<tr><td colspan="6">…and ${results.length - 40} more</td></tr>`;
    table += '</table>';
    const extra = `<p>Updated: <b>${updated}</b> | IndexNow OK: <b>${indexnowOk}/${matchReport.count}</b> | Keywords: <b>${CPI_KEYWORD_PHRASES.length}</b></p><p>Ambiguous inflation CPI: ${matchReport.ambiguousCount} (${(matchReport.ambiguousIds || []).join(', ') || 'none'})</p>${table}<p>Deploy: ${deploy?.ok ? 'OK' : deploy ? 'FAILED' : 'skipped'}</p>`;
    await progress.complete(extra);
  }

  console.log(JSON.stringify({ ok: true, matchCount: matchReport.count, updated, indexnowOk, deploy: deploy?.ok }, null, 2));
})().catch(async (e) => {
  console.error('ERR', e && e.message);
  try {
    const progress = createBatchProgressReporter({ label: 'CPI Security SEO batch' });
    await progress.error(String(e.message || e));
  } catch (_) {}
  process.exit(1);
});
