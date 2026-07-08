// _sf_crawl_audit.js — Screaming Frog-style site crawl + SEO audit for pulserevops.com
// Read-only HTTP crawl; never writes blobs or deploys.
//
// Usage:
//   node _sf_crawl_audit.js --quick              # sitemap inventory only (~50k URLs, polite)
//   node _sf_crawl_audit.js --full                 # seeds + internal link follow (depth 4)
//   node _sf_crawl_audit.js --full --knowledge-sample=500   # + random /knowledge/* spot-check
//   node _sf_crawl_audit.js --quick --limit=200    # smoke test
//   node _sf_crawl_audit.js --compare              # diff vs _sf_audit_baseline.json
//   node _sf_crawl_audit.js --quick --save-baseline  # promote current run → baseline
//
// Outputs: _sf_audit_report.json, _sf_audit_summary.md
// Exit: 0 = clean, 1 = high issues, 2 = critical issues (CI-friendly)
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.join(__dirname);
const SITE = 'pulserevops.com';
const ORIGIN = `https://${SITE}`;
const UA = 'pulse-sf-crawl-audit/1.0 (+https://pulserevops.com)';
const REPORT = path.join(ROOT, '_sf_audit_report.json');
const SUMMARY = path.join(ROOT, '_sf_audit_summary.md');
const BASELINE = path.join(ROOT, '_sf_audit_baseline.json');
const LOG = path.join(ROOT, '_sf_audit_run.log');

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const arg = (k, d) => {
  const hit = argv.find((a) => a.startsWith('--' + k + '='));
  if (hit) return hit.split('=').slice(1).join('=');
  const i = argv.indexOf('--' + k);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return d;
};

const MODE = has('--full') ? 'full' : 'quick';
const COMPARE = has('--compare');
const SAVE_BASELINE = has('--save-baseline');
const LIMIT = parseInt(arg('limit', '0'), 10) || Infinity;
const CONC = Math.min(12, Math.max(1, parseInt(arg('conc', '6'), 10) || 6));
const DELAY_MS = parseInt(arg('delay', '100'), 10) || 100;
const MAX_DEPTH = parseInt(arg('depth', '4'), 10) || 4;
const KNOWLEDGE_SAMPLE = parseInt(arg('knowledge-sample', '0'), 10) || 0;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n', 'utf8'); } catch (e) {}
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── robots.txt ─────────────────────────────────────────────────────────────
function parseRobots(txt, ua = '*') {
  const blocks = [];
  let cur = { agents: [], rules: [] };
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.split('#')[0].trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      if (cur.agents.length) blocks.push(cur);
      cur = { agents: [val.toLowerCase()], rules: [] };
    } else if (key === 'disallow' || key === 'allow') {
      cur.rules.push({ type: key, path: val || '/' });
    }
  }
  if (cur.agents.length) blocks.push(cur);
  const pick = blocks.find((b) => b.agents.includes(ua.toLowerCase())) ||
    blocks.find((b) => b.agents.includes('*')) || { rules: [] };
  return pick.rules;
}

function robotsAllowed(rules, pathname) {
  let bestAllow = null;
  let bestDisallow = null;
  for (const r of rules) {
    const p = r.path;
    if (p === '') continue;
    const match = p === '/' || pathname.startsWith(p);
    if (!match) continue;
    const len = p.length;
    if (r.type === 'allow' && (bestAllow === null || len > bestAllow.len)) bestAllow = { len, path: p };
    if (r.type === 'disallow' && (bestDisallow === null || len > bestDisallow.len)) bestDisallow = { len, path: p };
  }
  if (bestAllow && (!bestDisallow || bestAllow.len >= bestDisallow.len)) return true;
  if (bestDisallow) return false;
  return true;
}

// ── sitemap ────────────────────────────────────────────────────────────────
function parseLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s][^<]*?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return locs;
}

async function fetchText(url, opts = {}) {
  const maxRedir = opts.maxRedir ?? 8;
  const follow = opts.follow !== false;
  const chain = opts.chain || [];
  const t0 = Date.now();
  return new Promise((resolve) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(url, {
      method: opts.method || 'GET',
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', ...(opts.headers || {}) },
      timeout: opts.timeout || 25000,
    }, (res) => {
      const loc = res.headers.location;
      const status = res.statusCode || 0;
      if (follow && loc && status >= 300 && status < 400 && chain.length < maxRedir) {
        const next = new URL(loc, url).href;
        chain.push({ from: url, to: next, status });
        res.resume();
        return resolve(fetchText(next, { ...opts, chain, maxRedir }));
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { if (body.length < 2_500_000) body += c; });
      res.on('end', () => {
        resolve({
          url,
          finalUrl: url,
          status,
          headers: res.headers,
          body,
          ms: Date.now() - t0,
          chain,
        });
      });
    });
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, error: 'timeout', ms: Date.now() - t0, chain, headers: {}, body: '' }); });
    req.on('error', (e) => resolve({ url, status: 0, error: e.message, ms: Date.now() - t0, chain, headers: {}, body: '' }));
    req.end();
  });
}

async function loadAllSitemapUrls() {
  const indexPath = path.join(ROOT, 'sitemap-index.xml');
  let indexXml = '';
  try { indexXml = fs.readFileSync(indexPath, 'utf8'); } catch (e) {
    const live = await fetchText(`${ORIGIN}/sitemap-index.xml`);
    indexXml = live.body || '';
  }
  const childMaps = parseLocs(indexXml).filter((u) => u.includes(SITE));
  const all = new Set();
  const errors = [];
  log(`sitemaps in index: ${childMaps.length}`);
  for (let i = 0; i < childMaps.length; i++) {
    const smUrl = childMaps[i];
    const r = await fetchText(smUrl);
    if (r.status !== 200) { errors.push({ sitemap: smUrl, status: r.status }); continue; }
    const locs = parseLocs(r.body || '');
    if (/<sitemapindex/i.test(r.body || '')) {
      for (const nested of locs) {
        const nr = await fetchText(nested);
        if (nr.status === 200) parseLocs(nr.body || '').forEach((u) => all.add(normalizeUrl(u)));
        await sleep(50);
      }
    } else {
      locs.forEach((u) => all.add(normalizeUrl(u)));
    }
    if ((i + 1) % 10 === 0) log(`  fetched ${i + 1}/${childMaps.length} sitemaps → ${all.size} URLs`);
    await sleep(40);
  }
  return { urls: [...all], sitemapErrors: errors, sitemapCount: childMaps.length };
}

function normalizeUrl(href) {
  try {
    const u = new URL(href);
    if (u.hostname.replace(/^www\./, '') !== SITE) return null;
    u.hash = '';
    let p = u.pathname.replace(/\/+/g, '/');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    u.pathname = p;
    return u.href;
  } catch (e) { return null; }
}

function isInternal(href) {
  const n = normalizeUrl(href);
  return n && n.startsWith(ORIGIN);
}

function extractLinks(html, baseUrl) {
  const out = new Set();
  const re = /href\s*=\s*["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html || ''))) {
    try {
      const abs = normalizeUrl(new URL(m[1], baseUrl).href);
      if (abs && abs.startsWith(ORIGIN)) out.add(abs);
    } catch (e) {}
  }
  return [...out];
}

function stripTags(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parsePage(html, pageUrl, headers) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = stripTags(titleM ? titleM[1] : '');
  const descM = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDesc = descM ? descM[1].trim() : '';
  const canonM = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const canonicalHtml = canonM ? normalizeUrl(canonM[1]) : null;
  const robotsM = html.match(/<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const robotsMeta = robotsM ? robotsM[1].toLowerCase() : '';
  const h1s = [];
  const h1Re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let hm;
  while ((hm = h1Re.exec(html))) h1s.push(stripTags(hm[1]));
  const wordCount = stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')).split(/\s+/).filter(Boolean).length;
  const jsonLdTypes = [];
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm;
  while ((jm = ldRe.exec(html))) {
    try {
      const j = JSON.parse(jm[1]);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) {
        const t = it['@type'];
        if (typeof t === 'string') jsonLdTypes.push(t);
        else if (Array.isArray(t)) jsonLdTypes.push(...t);
      }
    } catch (e) { jsonLdTypes.push('(parse-error)'); }
  }
  const hreflang = [];
  const hlRe = /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi;
  let hlm;
  while ((hlm = hlRe.exec(html))) hreflang.push({ lang: hlm[1], href: hlm[2] });

  const linkHeader = (headers.link || headers.Link || '');
  let canonicalHeader = null;
  const lhRe = /<([^>]+)>;\s*rel="?canonical"?/gi;
  let lhm;
  while ((lhm = lhRe.exec(linkHeader))) canonicalHeader = normalizeUrl(lhm[1].trim());
  const xRobots = (headers['x-robots-tag'] || headers['X-Robots-Tag'] || '').toLowerCase();

  return {
    title, metaDesc, canonicalHtml, canonicalHeader, robotsMeta, xRobots,
    h1: h1s[0] || '', h1Count: h1s.length, wordCount, jsonLdTypes, hreflang,
    hasOgTitle: /<meta\s+[^>]*property=["']og:title["']/i.test(html),
    hasJsonLd: jsonLdTypes.length > 0,
  };
}

function classifyIssues(row, ctx) {
  const issues = [];
  const add = (sev, code, detail, fix) => issues.push({ severity: sev, code, detail, fix, url: row.url });

  if (row.status === 0) add('critical', 'fetch_fail', row.error || 'network error', 'Check DNS/Netlify uptime; retry');
  else if (row.status >= 500) add('critical', 'status_5xx', `HTTP ${row.status}`, 'Fix server/function error; check Netlify logs');
  else if (row.status === 404 && ctx.inSitemap) add('critical', 'sitemap_404', 'URL in sitemap returns 404', 'Remove from sitemap or restore page; reconcile index');
  else if (row.status >= 400) add('high', 'status_4xx', `HTTP ${row.status}`, 'Fix broken URL or redirect rule in netlify.toml');

  if (row.chain && row.chain.length > 0) {
    if (row.chain.length >= 8) add('critical', 'redirect_loop', `${row.chain.length}+ hops`, 'Fix circular redirect in netlify.toml');
    else if (row.chain.length > 2) add('medium', 'redirect_chain', `${row.chain.length} hops`, 'Prefer single 301 to canonical URL');
  }

  if (row.canonicalHeader && row.canonicalHeader !== row.url) {
    const isGlobalHome = row.canonicalHeader === ORIGIN + '/' || row.canonicalHeader === ORIGIN;
    if (isGlobalHome) add('critical', 'global_link_canonical', `HTTP Link canonical → ${row.canonicalHeader}`, 'Remove global Link canonical from netlify.toml [[headers]] (commit 5588154 pattern)');
    else add('high', 'canonical_header_mismatch', `Link header → ${row.canonicalHeader}`, 'Align HTTP Link canonical with page URL or remove header');
  }
  if (row.canonicalHtml && row.canonicalHtml !== row.url) {
    add('high', 'canonical_html_mismatch', `HTML canonical → ${row.canonicalHtml}`, 'Set rel=canonical to self URL in page head / renderer');
  }
  if (row.canonicalHtml && row.canonicalHeader && row.canonicalHtml !== row.canonicalHeader) {
    add('high', 'duplicate_canonical', `HTML ${row.canonicalHtml} vs header ${row.canonicalHeader}`, 'Use ONE canonical signal (prefer HTML per-URL)');
  }

  const noindex = /noindex/i.test(row.robotsMeta) || /noindex/i.test(row.xRobots);
  if (noindex && ctx.inSitemap) add('critical', 'noindex_in_sitemap', `robots=${row.robotsMeta || '-'} x-robots=${row.xRobots || '-'}`, 'Remove noindex OR drop URL from sitemap');
  if (!noindex && row.status === 200 && ctx.inSitemap) {
    if (!row.title) add('high', 'missing_title', 'empty <title>', 'Add title in static HTML or pulse-machine-entry renderer');
    if (!row.metaDesc) add('medium', 'missing_meta_desc', 'no meta description', 'Add description meta (renderer or static page)');
    if (!row.h1) add('medium', 'missing_h1', 'no H1', 'Ensure answer renderer emits # question as H1');
    if (row.canonicalHtml && row.canonicalHtml !== row.url) { /* already flagged */ }
    else if (!row.canonicalHtml && !row.canonicalHeader) add('medium', 'missing_canonical', 'no canonical tag', 'Add rel=canonical matching public URL');
  }

  if (row.ms > 5000) add('medium', 'slow_response', `${row.ms}ms`, 'Check function cold start / payload size');
  else if (row.ms > 3000) add('low', 'slow_response', `${row.ms}ms`, 'Monitor; may be cold start');

  if (row.title && row.title.length < 15) add('low', 'short_title', `${row.title.length} chars`, 'Expand title for CTR');
  if (row.title && row.title.length > 65) add('low', 'long_title', `${row.title.length} chars`, 'Trim title to ~60 chars for SERP');
  if (row.metaDesc && row.metaDesc.length > 160) add('low', 'long_meta_desc', `${row.metaDesc.length} chars`, 'Trim meta description to ~155 chars');

  return issues;
}

function pickKnowledgeSample(urls, n) {
  const k = urls.filter((u) => /\/knowledge\//i.test(u));
  if (!n || n >= k.length) return k;
  const step = Math.max(1, Math.floor(k.length / n));
  const out = [];
  for (let i = 0; i < k.length && out.length < n; i += step) out.push(k[i]);
  return out;
}

function staticOnly(urls) {
  return urls.filter((u) => !/\/knowledge\/[a-z]+\d+/i.test(u) && !/\/tools\/tl\d+/i.test(u));
}

async function crawlUrls(urlList, robotsRules, sitemapSet) {
  const pages = {};
  const queue = urlList.map((url) => ({ url, depth: 0 }));
  const enqueued = new Set(urlList);
  let crawled = 0;
  let lock = false;

  async function worker() {
    while (true) {
      if (crawled >= LIMIT) return;
      let job = null;
      while (lock) await sleep(5);
      lock = true;
      if (queue.length && crawled < LIMIT) job = queue.shift();
      lock = false;
      if (!job) return;

      const { url, depth } = job;
      if (pages[url]) continue;
      const pathname = new URL(url).pathname;
      if (!robotsAllowed(robotsRules, pathname)) continue;

      await sleep(DELAY_MS);
      const res = await fetchText(url);
      crawled++;
      const parsed = parsePage(res.body || '', res.finalUrl || url, res.headers || {});
      pages[url] = {
        url,
        status: res.status,
        ms: res.ms,
        chain: res.chain || [],
        error: res.error || null,
        inSitemap: sitemapSet.has(url),
        depth,
        ...parsed,
      };

      if (crawled % 250 === 0) log(`  crawled ${crawled} … queue ${queue.length}`);

      if (MODE === 'full' && res.status === 200 && depth < MAX_DEPTH && (res.body || '').length) {
        for (const link of extractLinks(res.body, url)) {
          if (!enqueued.has(link) && crawled + queue.length < LIMIT) {
            enqueued.add(link);
            lock = true;
            queue.push({ url: link, depth: depth + 1 });
            lock = false;
          }
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));
  return pages;
}

function aggregateDuplicates(pages) {
  const byTitle = {};
  const byDesc = {};
  for (const row of Object.values(pages)) {
    if (row.status !== 200) continue;
    if (row.title) (byTitle[row.title] = byTitle[row.title] || []).push(row.url);
    if (row.metaDesc) (byDesc[row.metaDesc] = byDesc[row.metaDesc] || []).push(row.url);
  }
  const dupTitles = Object.entries(byTitle).filter(([, v]) => v.length > 1).map(([t, urls]) => ({ title: t, count: urls.length, urls: urls.slice(0, 8) }));
  const dupDescs = Object.entries(byDesc).filter(([, v]) => v.length > 1).map(([d, urls]) => ({ desc: d.slice(0, 80), count: urls.length, urls: urls.slice(0, 8) }));
  return { dupTitles, dupDescs };
}

function buildSummary(report) {
  const s = report.summary;
  let md = `# SF Crawl Audit Summary — ${report.site}\n\n`;
  md += `_Generated ${report.audited_at} · mode **${report.mode}** · ${report.urls_crawled} URLs crawled · ${report.sitemap.total_urls} in sitemap_\n\n`;
  md += `## Severity counts\n\n| Tier | Count |\n|---|---|\n`;
  for (const tier of ['critical', 'high', 'medium', 'low']) md += `| ${tier} | ${s.bySeverity[tier] || 0} |\n`;
  md += `\n## Top issue types\n\n`;
  const sorted = Object.entries(s.byCode).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [code, n] of sorted) md += `- **${code}**: ${n}\n`;
  md += `\n## Response codes\n\n`;
  for (const [code, n] of Object.entries(s.statusHistogram).sort()) md += `- ${code}: ${n}\n`;
  md += `\n## Sitemap hygiene\n\n`;
  md += `- Sitemap URLs: **${report.sitemap.total_urls}**\n`;
  md += `- Sitemap fetch errors: **${report.sitemap.errors.length}**\n`;
  md += `- In sitemap but not crawled (skipped/limit): **${report.sitemap.notCrawledSample.length}** (sample)\n`;
  md += `- Crawled but not in sitemap: **${report.crawl.notInSitemap.length}**\n`;
  if (report.duplicates.dupTitles.length) {
    md += `\n## Duplicate titles (sample)\n\n`;
    report.duplicates.dupTitles.slice(0, 10).forEach((d) => {
      md += `- "${d.title.slice(0, 60)}…" ×${d.count} — e.g. ${d.urls[0]}\n`;
    });
  }
  if (report.issues.critical.length) {
    md += `\n## Critical issues (first 20)\n\n`;
    report.issues.critical.slice(0, 20).forEach((i) => {
      md += `- \`${i.code}\` [${i.url}](${i.url}) — ${i.detail}\n  - _Fix:_ ${i.fix}\n`;
    });
  }
  if (report.compare) {
    md += `\n## Regression vs baseline (${report.compare.baseline_at})\n\n`;
    md += `- New critical: **${report.compare.newCritical}**\n`;
    md += `- Resolved critical: **${report.compare.resolvedCritical}**\n`;
    if (report.compare.newCriticalSamples.length) {
      md += `\nNew critical samples:\n`;
      report.compare.newCriticalSamples.slice(0, 10).forEach((i) => md += `- ${i.code} ${i.url}\n`);
    }
  }
  md += `\n---\nFull JSON: \`_sf_audit_report.json\` · Runbook: \`_SF_CRAWL_PROCESS.md\`\n`;
  return md;
}

function compareReports(current, baseline) {
  const curKeys = new Set(current.issues.all.map((i) => i.code + '|' + i.url));
  const baseKeys = new Set((baseline.issues?.all || []).map((i) => i.code + '|' + i.url));
  const newIssues = current.issues.all.filter((i) => !baseKeys.has(i.code + '|' + i.url));
  const resolved = (baseline.issues?.all || []).filter((i) => !curKeys.has(i.code + '|' + i.url));
  return {
    baseline_at: baseline.audited_at,
    newCritical: newIssues.filter((i) => i.severity === 'critical').length,
    resolvedCritical: resolved.filter((i) => i.severity === 'critical').length,
    newCriticalSamples: newIssues.filter((i) => i.severity === 'critical'),
    newHigh: newIssues.filter((i) => i.severity === 'high').length,
  };
}

async function main() {
  fs.writeFileSync(LOG, '', 'utf8');
  log(`SF crawl audit start mode=${MODE} conc=${CONC} delay=${DELAY_MS}ms limit=${LIMIT === Infinity ? 'none' : LIMIT}`);

  const robotsRes = await fetchText(`${ORIGIN}/robots.txt`);
  const robotsRules = parseRobots(robotsRes.body || '', 'pulse-sf-crawl-audit');
  log(`robots rules: ${robotsRules.length}`);

  const { urls: sitemapUrls, sitemapErrors, sitemapCount } = await loadAllSitemapUrls();
  const sitemapSet = new Set(sitemapUrls.filter(Boolean));
  log(`sitemap URLs collected: ${sitemapSet.size}`);

  let crawlList;
  if (MODE === 'quick') {
    crawlList = [...sitemapSet];
  } else {
    const seeds = new Set([ORIGIN, ORIGIN + '/']);
    staticOnly([...sitemapSet]).forEach((u) => seeds.add(u));
    if (KNOWLEDGE_SAMPLE > 0) pickKnowledgeSample([...sitemapSet], KNOWLEDGE_SAMPLE).forEach((u) => seeds.add(u));
    crawlList = [...seeds];
    log(`full mode seeds: ${crawlList.length} static/hub + knowledge sample ${KNOWLEDGE_SAMPLE}`);
  }
  if (LIMIT < crawlList.length) crawlList = crawlList.slice(0, LIMIT);

  const pages = await crawlUrls(crawlList, robotsRules, sitemapSet);
  const pageRows = Object.values(pages).filter((p) => p.url);

  const allIssues = [];
  for (const row of pageRows) {
    const iss = classifyIssues(row, { inSitemap: sitemapSet.has(row.url) });
    allIssues.push(...iss);
  }

  const { dupTitles, dupDescs } = aggregateDuplicates(pages);
  for (const d of dupTitles.filter((x) => x.count > 3)) {
    allIssues.push({ severity: 'high', code: 'duplicate_title', detail: `"${d.title.slice(0, 50)}" ×${d.count}`, fix: 'Differentiate titles per URL in renderer', url: d.urls[0] });
  }
  for (const d of dupDescs.filter((x) => x.count > 3)) {
    allIssues.push({ severity: 'medium', code: 'duplicate_meta_desc', detail: `×${d.count}`, fix: 'Unique meta descriptions per page', url: d.urls[0] });
  }

  const crawledSet = new Set(pageRows.map((r) => r.url));
  const notInSitemap = [...crawledSet].filter((u) => !sitemapSet.has(u));
  const notCrawled = [...sitemapSet].filter((u) => !crawledSet.has(u));

  const statusHistogram = {};
  for (const r of pageRows) statusHistogram[r.status || 0] = (statusHistogram[r.status || 0] || 0) + 1;

  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
  const byCode = {};
  for (const i of allIssues) {
    bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
    byCode[i.code] = (byCode[i.code] || 0) + 1;
  }

  const report = {
    audited_at: new Date().toISOString(),
    site: ORIGIN,
    mode: MODE,
    options: { conc: CONC, delay: DELAY_MS, limit: LIMIT === Infinity ? null : LIMIT, depth: MAX_DEPTH, knowledgeSample: KNOWLEDGE_SAMPLE },
    urls_crawled: pageRows.length,
    sitemap: { total_urls: sitemapSet.size, child_sitemaps: sitemapCount, errors: sitemapErrors, notCrawledSample: notCrawled.slice(0, 50) },
    crawl: { notInSitemap: notInSitemap.slice(0, 100) },
    summary: { bySeverity, byCode, statusHistogram },
    duplicates: { dupTitles: dupTitles.slice(0, 50), dupDescs: dupDescs.slice(0, 50) },
    issues: {
      critical: allIssues.filter((i) => i.severity === 'critical'),
      high: allIssues.filter((i) => i.severity === 'high'),
      medium: allIssues.filter((i) => i.severity === 'medium'),
      low: allIssues.filter((i) => i.severity === 'low'),
      all: allIssues,
    },
    pages: pageRows,
  };

  if (COMPARE && fs.existsSync(BASELINE)) {
    report.compare = compareReports(report, JSON.parse(fs.readFileSync(BASELINE, 'utf8')));
    log(`compare: newCritical=${report.compare.newCritical} resolvedCritical=${report.compare.resolvedCritical}`);
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
  fs.writeFileSync(SUMMARY, buildSummary(report), 'utf8');
  log(`report → ${REPORT}`);
  log(`summary → ${SUMMARY}`);
  log(`critical=${bySeverity.critical} high=${bySeverity.high} medium=${bySeverity.medium} low=${bySeverity.low}`);

  if (SAVE_BASELINE) {
    fs.copyFileSync(REPORT, BASELINE);
    log(`baseline saved → ${BASELINE}`);
  }

  if (bySeverity.critical > 0) process.exit(2);
  if (bySeverity.high > 0) process.exit(1);
  process.exit(0);
}

main().catch((e) => { log('FATAL ' + (e && e.stack || e)); process.exit(2); });
