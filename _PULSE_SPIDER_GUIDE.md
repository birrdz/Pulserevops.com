# 🕷️ PULSE SPIDER — SEO Crawler & Live Monitor (permanent runbook)

A free, in-house Screaming-Frog-style SEO crawler for pulserevops.com, built because Screaming
Frog is $279/yr + needs a paid license (its free tier can't run the MCP). Tuned to BEAT Screaming
Frog **on this site** because the site is JS-rendered and blob-backed (see "Why better" below).

> Sibling tool that already existed: `_sf_crawl_audit.js` (+ `_SF_CRAWL_PROCESS.md`) — a one-shot,
> severity-tiered audit with baseline compare (catches the `global_link_canonical` header bug).
> Pulse Spider is COMPLEMENTARY: it adds the always-on daemon + live dashboard + blob-accurate
> content metrics + site-law checks. Consider merging them one day.

## Files
- `_pulse_spider.js` — the crawler (one crawl → writes `_seo_audit/`).
- `_pulse_spider_forever.js` — always-on daemon; re-crawls every 30 min, logs issue DELTAS, appends `_seo_audit/history.jsonl`.
- `_seo_dashboard_server.js` — serves the live dashboard locally on :8899.
- `_seo_audit/` — all output: `report.md` (readable), `summary.json`, `history.jsonl`, `dashboard.html`, and 20+ issue CSVs.
- Stop flag: `_pulse_spider_stop.flag`. Daemon log: `_pulse_spider.log`.

## Open the dashboard
**http://localhost:8899/** — auto-refreshes every 15s (pulsing green dot = live). If it won't load, the
server isn't running — relaunch it (below). It is LOCAL ONLY (not on pulserevops.com).

## How to READ the dashboard
- **Top counters:** URLs crawled · HTML 200 · Indexable · Broken · Redirects · Orphans. Red/yellow when >0.
- **Trend chart:** one line per issue across each crawl cycle. Down = fixing; a line jumping up = a regression.
- **All-issues grid:** every check + count. Green = 0. Watch: Broken, Missing/Dup titles, Missing CRO card, Thin.
- **By-pillar table:** issues per section (tl, tc, q, telco…) so you see WHICH pillar is affected.
- **Broken / Redirects lists:** the actual offending URLs.

## Act on findings (priority)
1. **Broken (4xx/5xx)** — fix first; find the linking page (CSV `sources` column) and remove/repoint.
2. **Redirects (3xx)** — repoint internal links to the final URL.
3. **Duplicate / missing titles & meta** — biggest ranking lever across the ~28k pages.
4. **Missing CRO card** — owner's #1 goal (eyes on the Kory White card) — flags answer pages that lost it.
5. **Thin / no-image** — quality flags (library pages only, so accurate).

## OPERATE the crawler (run from the `website` folder)
- One-off crawl: `node _pulse_spider.js`
- Deeper crawl: `MAX_URLS=2000 node _pulse_spider.js`
- One section only: `SEED=https://pulserevops.com/telco FROM_SITEMAP=0 node _pulse_spider.js`
- Check external links too: `CHECK_EXTERNAL=1 node _pulse_spider.js`
- Env knobs: `MAX_URLS` (default 300) · `CONCURRENCY` (6) · `DELAY_MS` (150) · `FROM_SITEMAP` (1) · `SITEMAP_CAP` (600) · `THIN_WORDS` (300) · `BLOB_ENRICH` (1) · `MAX_DEPTH` (25).

## Relaunch after a session/host restart (both die on close — NOT auto-restart)
```
# always-on monitor
Remove-Item C:\Users\koryj\website\_pulse_spider_stop.flag -EA SilentlyContinue
$env:INTERVAL_MIN='30'; $env:MAX_URLS='400'; $env:CONCURRENCY='6'
Start-Process node _pulse_spider_forever.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
# dashboard server
Start-Process node _seo_dashboard_server.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
```
Stop the monitor: create `_pulse_spider_stop.flag` (delete to resume).

## Why it's better than Screaming Frog HERE
The site renders answer content client-side, so a raw crawl (and even SF's render) under-counts content.
For library URLs (`/<seg>/<id>`) the spider reads the CANONICAL source — the answer blob + `_index.json` —
for TRUE word/image/H1/FAQ/CRO-card metrics, and gates thin/no-image checks to those real content pages
(no hub/shell false positives). It also runs site-specific law checks SF can't: CRO-card present, FAQ
present, image-law. Plus per-pillar rollups for this pillar-based site.

## Checks it runs (Screaming-Frog parity)
status codes · redirect chains · canonical (missing/canonicalised) · title (missing/dup/short/long/multiple) ·
meta description (missing/dup/long/multiple) · H1 (missing/multiple/dup) · H2 count · exact-duplicate page
bodies (content hash) · hreflang · JSON-LD schema types + datePublished/dateModified · OG/Twitter tags ·
meta-robots + X-Robots-Tag header · images (count + missing alt) · internal/external/insecure links ·
indexability + reason · inlinks (link equity: most-linked + low-inlink) · orphans (sitemap-vs-crawl) ·
response time (slowest) · per-pillar rollup.

## On-site version (NOT built — reverted per owner 2026-06-29)
A password-gated `/seo` page on pulserevops.com was requested then retracted ("that's cursor"). To do it
later: spider uploads `summary.json` → a blob; a `pulse-seo-monitor` function serves it (key-gated 4444);
deploy `seo.html` (route `/seo`) with a 4444 overlay; add a category link. Not built yet.
