// Full-site index + SEO audit (library q/st/ik + static sitemap pages).
// Usage:
//   node _index_all_pages_seo.js                 # audit only
//   node _index_all_pages_seo.js --fix         # IndexNow + stamp all missing library rows
//   node _index_all_pages_seo.js --fix 50      # cap library fixes per run
//   node _index_all_pages_seo.js --seo-only    # skip IndexNow; HTTP/SEO checks only
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getStore } = require('@netlify/blobs');
const { libraryEntryKind, libraryEntryPublicUrl } = require('./netlify/functions/lib/library-entry-url');
const {
  pingIndexNowEntry,
  pingIndexNowUrlList,
  stampIndexed,
} = require('./netlify/functions/lib/indexnow-ping-entry');

const SITE = 'pulserevops.com';
const REPORT = path.join(__dirname, '_index_all_pages_report.json');
const LOG = path.join(__dirname, '_index_all_pages_run.log');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DELAY_MS = 400;
const INDEX_BATCH = 200;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n', 'utf8');
}

function loadPat() {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const m = env.match(/^BLOBS_PAT=(.+)$/m);
  if (!m) throw new Error('BLOBS_PAT missing in .env.local');
  return m[1].trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchText(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-index-all-pages/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return locs;
}

function seoCheck(html, url) {
  const esc = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const checks = {
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${esc}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
  };
  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

async function loadLibraryIndex(store) {
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  return (idx.entries || []).filter((e) => e && e.id && libraryEntryKind(e));
}

async function main() {
  const fix = process.argv.includes('--fix');
  const seoOnly = process.argv.includes('--seo-only');
  const maxFix = parseInt(process.argv.find((a) => /^\d+$/.test(a)) || '0', 10) || (fix ? Infinity : 0);

  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: loadPat() });
  const entries = await loadLibraryIndex(store);

  const byKind = { knowledge: [], training: [], kpi: [] };
  for (const e of entries) {
    const k = libraryEntryKind(e);
    if (k) byKind[k].push(e);
  }

  const missingIndex = entries.filter((e) => !e.was_indexed_at);
  const smDyn = await fetchText(`https://${SITE}/.netlify/functions/pulse-machine-sitemap`);
  const smBody = smDyn.body || '';

  const libraryAudit = { knowledge: {}, training: {}, kpi: {} };
  for (const kind of Object.keys(byKind)) {
    const list = byKind[kind];
    const miss = list.filter((e) => !e.was_indexed_at);
    libraryAudit[kind] = {
      total: list.length,
      indexed_stamp: list.length - miss.length,
      missing_stamp: miss.length,
      pct_indexed: list.length ? Math.round((100 * (list.length - miss.length)) / list.length) : 100,
    };
  }

  const staticXml = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
  let staticUrls = parseSitemapLocs(staticXml).filter((u) => u.includes(SITE));
  const smTools = await fetchText(`https://${SITE}/sitemap-tools.xml`);
  const toolUrls = parseSitemapLocs(smTools.body || '');
  staticUrls = [...new Set([...staticUrls, ...toolUrls])];

  log(
    `LIBRARY knowledge=${libraryAudit.knowledge.total} training=${libraryAudit.training.total} kpi=${libraryAudit.kpi.total}`
  );
  log(
    `INDEX STAMP q=${libraryAudit.knowledge.pct_indexed}% st=${libraryAudit.training.pct_indexed}% ik=${libraryAudit.kpi.pct_indexed}%`
  );
  log(`MISSING STAMP total=${missingIndex.length} | static urls=${staticUrls.length}`);

  const report = {
    audited_at: new Date().toISOString(),
    library: libraryAudit,
    missing_index_total: missingIndex.length,
    missing_index_sample: missingIndex.slice(0, 20).map((e) => ({
      id: e.id,
      kind: libraryEntryKind(e),
      url: libraryEntryPublicUrl(e),
    })),
    static_pages: { total: staticUrls.length, tools_sitemap: toolUrls.length, seo_fail: [], seo_sample_ok: 0 },
    sitemap_spot: {},
    fix_run: null,
    seo_spot_library: [],
  };

  for (const id of ['q1', 'st0073', 'ik0001', entries[0]?.id].filter(Boolean)) {
    const e = entries.find((x) => x.id === id) || { id };
    const url = libraryEntryPublicUrl(e);
    report.sitemap_spot[id] = url ? smBody.includes(url.replace(`https://${SITE}`, '')) : false;
  }

  const staticSample = staticUrls.slice(0, 40);
  for (const url of staticSample) {
    const page = await fetchText(url);
    const seo = seoCheck(page.body || '', url);
    if (page.status !== 200 || !seo.ok) {
      report.static_pages.seo_fail.push({
        url,
        status: page.status,
        missing: seo.missing,
      });
    } else {
      report.static_pages.seo_sample_ok++;
    }
  }

  const libSeoSample = [...byKind.training.slice(0, 3), ...byKind.kpi.slice(0, 3), ...byKind.knowledge.slice(-2)];
  for (const e of libSeoSample) {
    const url = libraryEntryPublicUrl(e);
    const page = await fetchText(url);
    const seo = seoCheck(page.body || '', url);
    const inSm = smBody.includes(url.replace(`https://${SITE}`, ''));
    report.seo_spot_library.push({
      id: e.id,
      url,
      status: page.status,
      seoOk: seo.ok,
      missing: seo.missing,
      inSitemap: inSm,
      was_indexed_at: !!e.was_indexed_at,
    });
  }

  if (fix && !seoOnly) {
    const toolTodo = toolUrls.filter((u) => u.includes('/tools/') && u !== `https://${SITE}/tools/`);
    if (toolTodo.length) {
      log(`FIX tools IndexNow: ${toolTodo.length} URLs`);
      const batch = await pingIndexNowUrlList(toolTodo);
      log(`FIX tools pings=${JSON.stringify(batch.pings)} ok=${batch.ok}`);
      report.fix_run = report.fix_run || {};
      report.fix_run.tools_indexnow = { urls: toolTodo.length, ok: batch.ok, pings: batch.pings };
    }
  }

  if (fix && !seoOnly && missingIndex.length) {
    const todo = missingIndex.slice(0, maxFix === Infinity ? missingIndex.length : maxFix);
    log(`FIX library IndexNow: ${todo.length} entries (${INDEX_BATCH} URL batches + stamps)`);

    let ok = 0;
    let fail = 0;
    for (let i = 0; i < todo.length; i += INDEX_BATCH) {
      const chunk = todo.slice(i, i + INDEX_BATCH);
      const urls = chunk.map((e) => libraryEntryPublicUrl(e)).filter(Boolean);
      const batch = await pingIndexNowUrlList(urls);
      const ts = Date.now();
      if (batch.ok) {
        for (const e of chunk) {
          await stampIndexed(store, e.id, ts);
          ok++;
        }
        log(`FIX batch ${i / INDEX_BATCH + 1} urls=${urls.length} pings=${JSON.stringify(batch.pings)}`);
      } else {
        for (const e of chunk) {
          const r = await pingIndexNowEntry(e.id, store, e);
          if (r.ok) ok++;
          else fail++;
          await sleep(DELAY_MS);
        }
        log(`FIX batch ${i / INDEX_BATCH + 1} fallback per-URL ok=${ok} fail=${fail}`);
      }
      if (i + INDEX_BATCH < todo.length) await sleep(1200);
    }

    report.fix_run = { attempted: todo.length, ok, fail };
    const after = await loadLibraryIndex(store);
    report.fix_run.still_missing_stamp = after.filter((e) => !e.was_indexed_at).length;
    log(`FIX done ok=${ok} fail=${fail} still_missing=${report.fix_run.still_missing_stamp}`);
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
  log(`Report: ${REPORT}`);

  if (report.static_pages.seo_fail.length) {
    log(`Static SEO issues: ${report.static_pages.seo_fail.length} (sample of ${staticSample.length})`);
  }
}

main().catch((e) => {
  log('ERROR ' + e.message);
  process.exit(1);
});
