// _pulse_spider_forever.js — always-on autonomous SEO loop. Each cycle:
//   1) FREE full-site content audit (all ~30k entries via blobs — no function cost),
//      with a live 0→100% progress bar (the dashboards read it).
//   2) Light HTTP crawl (sample) for technical checks (status/redirects/canonical/broken).
//   3) Auto-IndexNow: ping Bing/Yandex for today's new/changed URLs (expedite discovery).
// Publishes everything to blobs so the on-site /seo dashboard stays fresh. Hands-off.
//
//   node _pulse_spider_forever.js
//   INTERVAL_MIN=30 node _pulse_spider_forever.js
// Stop: create _pulse_spider_stop.flag   ·   Log: _pulse_spider.log
const fs = require('fs');
const { spawn } = require('child_process');
const DIR = 'C:/Users/koryj/website';
const OUT = DIR + '/_seo_audit';
const LOG = DIR + '/_pulse_spider.log';
const STOP = DIR + '/_pulse_spider_stop.flag';
const NODE = process.execPath;
const INTERVAL = Math.max(5, parseInt(process.env.INTERVAL_MIN || '30', 10)) * 60 * 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };

function run(script, extraEnv) {
  return new Promise(resolve => {
    const env = Object.assign({}, process.env, extraEnv || {});
    const p = spawn(NODE, [DIR + '/' + script], { cwd: DIR, env, windowsHide: true });
    let tail = '';
    p.stdout.on('data', d => { tail = (tail + d).slice(-1500); });
    p.stderr.on('data', d => { tail = (tail + d).slice(-1500); });
    p.on('close', code => resolve({ code, tail }));
    p.on('error', () => resolve({ code: -1, tail: 'spawn error' }));
  });
}
const readJson = f => { try { return JSON.parse(fs.readFileSync(OUT + '/' + f, 'utf8')); } catch (e) { return null; } }

// CRAWL GATE (owner 4444 2026-06-29): do NOT run a new full HTTP crawl until ALL fixable
// yellow/red issues are driven to 0. A fresh crawl only rediscovers the same known issues and
// costs function invocations — so we keep the FREE blob content-audit running every cycle (feeds
// the fixers + dashboard) and only re-crawl once everything is green, OR after a long fallback
// (so newly-published pages still eventually get crawled). Disable with CRAWL_GATE=0.
const CRAWL_GATE = process.env.CRAWL_GATE !== '0';
const CRAWL_FALLBACK = Math.max(1, parseInt(process.env.CRAWL_FALLBACK_H || '24', 10)) * 3600 * 1000;
function fixableTotal() {
  let t = 0;
  const ca = readJson('content_audit.json'); // thin / no-img / no-faq / missing-mermaid / etc.
  if (ca && ca.counts) for (const k of ['thin_content','no_image','missing_faq','missing_mermaid','mermaid_errors','missing_cro_card']) t += (+ca.counts[k] || 0);
  const sm = readJson('summary.json');       // technical: broken / redirects / orphans / dup H1 / dup title / multi-meta / missing canonical
  if (sm && sm.issues) for (const k of ['broken_4xx_5xx','redirects_3xx','orphan_pages','duplicate_h1','duplicate_titles','multiple_h1','missing_canonical','long_meta','duplicate_meta']) t += (+sm.issues[k] || 0);
  return t;
}

(async () => {
  log(`[spider-forever] start — interval ${INTERVAL / 60000}min · crawl-gate ${CRAWL_GATE?'ON (no re-crawl until 0 issues; '+(CRAWL_FALLBACK/3600000)+'h fallback)':'OFF'}`);
  let cycle = 0;
  let lastCrawlAt = 0;
  while (true) {
    if (fs.existsSync(STOP)) { log('[spider-forever] stop flag — exiting'); break; }
    cycle++;
    const t0 = Date.now();

    // 1) FREE full-site content audit (drives the 30k → 100% progress bar)
    log(`[spider-forever] cycle ${cycle}: content audit (all entries)…`);
    const a = await run('_seo_content_audit.js', { AUDIT_CONC: process.env.AUDIT_CONC || '20' });
    const ca = readJson('content_audit.json');
    if (ca) log(`[spider-forever]   audited ${ca.total} · thin ${ca.counts.thin_content} · noImg ${ca.counts.no_image} · noCRO ${ca.counts.missing_cro_card} · noFAQ ${ca.counts.missing_faq}`);

    // 2) HTTP crawl for technical checks — GATED: only when all issues are 0 (or fallback elapsed)
    const issues = fixableTotal();
    const fallbackDue = (Date.now() - lastCrawlAt) > CRAWL_FALLBACK;
    if (!CRAWL_GATE || issues === 0 || fallbackDue) {
      log(`[spider-forever] cycle ${cycle}: http crawl (${issues===0?'all green ✅':(fallbackDue?'fallback re-crawl':'gate off')})…`);
      await run('_pulse_spider.js', { MAX_URLS: process.env.MAX_URLS || '400', CONCURRENCY: process.env.CONCURRENCY || '6', DELAY_MS: process.env.DELAY_MS || '150', FROM_SITEMAP: '1', SITEMAP_CAP: process.env.SITEMAP_CAP || '500' });
      lastCrawlAt = Date.now();
      const sum = readJson('summary.json');
      if (sum) { log(`[spider-forever]   crawled ${sum.urls_crawled} · broken ${sum.issues.broken_4xx_5xx} · redirects ${sum.issues.redirects_3xx} · orphans ${sum.issues.orphan_pages}`); try { fs.appendFileSync(OUT + '/history.jsonl', JSON.stringify({ at: sum.crawledAt_utc, urls: sum.urls_crawled, issues: sum.issues, content: ca ? ca.counts : null }) + '\n'); } catch (e) {} }
    } else {
      log(`[spider-forever] cycle ${cycle}: SKIP http crawl — ${issues} fixable issue(s) still open; fixers driving them to 0 first (next fallback crawl in ${(((CRAWL_FALLBACK-(Date.now()-lastCrawlAt))/3600000)).toFixed(1)}h)`);
    }

    // 3) Auto-IndexNow — expedite discovery of new/changed URLs (Bing/Yandex). Deploy-free.
    if (process.env.AUTO_INDEXNOW !== '0') {
      log(`[spider-forever] cycle ${cycle}: auto-IndexNow (ping new URLs)…`);
      const ix = await run('_indexnow_delta.js', {});
      log(`[spider-forever]   indexnow: ${(ix.tail || '').replace(/\s+/g, ' ').trim().slice(-160) || 'done'}`);
    }

    log(`[spider-forever] cycle ${cycle} complete in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    for (let waited = 0; waited < INTERVAL; waited += 15000) { if (fs.existsSync(STOP)) break; await sleep(Math.min(15000, INTERVAL - waited)); }
  }
})().catch(e => { log('[spider-forever] FATAL ' + (e && e.stack)); process.exit(1); });
