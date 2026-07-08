# SF Crawl Process — Screaming Frog-style SEO audit for pulserevops.com

Production-grade site crawl + technical SEO audit. Replicates the **Screaming Frog SEO Spider workflow** (not the GUI): sitemap discovery, URL inventory, on-page checks, redirect/canonical/directive analysis, structured data, sitemap-vs-crawl diff, performance signals, severity-tier reporting, and baseline comparison.

**Script:** `_sf_crawl_audit.js`  
**Outputs:** `_sf_audit_report.json` (machine), `_sf_audit_summary.md` (human), optional `_sf_audit_baseline.json` (regression baseline)

---

## When to run

| Trigger | Command | Why |
|---|---|---|
| **Weekly health check** | `node _sf_crawl_audit.js --quick --compare` | Catch sitemap 404s, noindex regressions, duplicate titles |
| **Pre-deploy** | `node _sf_crawl_audit.js --full --limit=500` | Spot-check static hubs + link graph after netlify.toml edits |
| **Post-deploy** | `node _sf_crawl_audit.js --quick --compare --save-baseline` | Confirm deploy didn't break canonicals/redirects; refresh baseline |
| **After sitemap changes** | `node _sf_crawl_audit.js --quick` | Validate all new URLs return 200 + indexable |
| **After removing global Link canonical** | `node _sf_crawl_audit.js --quick --limit=100` | Verify `global_link_canonical` = 0 (commit 5588154 pattern) |
| **Big publish batch (24k library)** | Use `_indexnow_delta.js` for pings; SF audit weekly | IndexNow = discovery; SF = correctness |

---

## Commands (Windows PowerShell)

```powershell
cd C:\Users\koryj\website

# Smoke test (~30s)
node _sf_crawl_audit.js --quick --limit=50

# Production weekly — full sitemap inventory (~50k URLs, ~2–4h at conc=6 delay=100ms)
node _sf_crawl_audit.js --quick

# Deep crawl — static pages + link follow + knowledge spot-check
node _sf_crawl_audit.js --full --knowledge-sample=500

# Regression diff vs last baseline
node _sf_crawl_audit.js --quick --compare

# Save a clean run as the new baseline (after fixing issues)
node _sf_crawl_audit.js --quick --save-baseline
```

### Flags

| Flag | Default | Purpose |
|---|---|---|
| `--quick` | (default) | Audit every URL in `sitemap-index.xml` child sitemaps; no link follow |
| `--full` | | Seed static/hub URLs + follow internal links to `--depth` |
| `--compare` | | Diff issue set vs `_sf_audit_baseline.json` |
| `--save-baseline` | | Copy report → baseline after run |
| `--limit=N` | none | Cap URLs crawled (smoke tests) |
| `--conc=N` | 6 | Parallel fetch workers (max 12) |
| `--delay=MS` | 100 | Politeness delay per request |
| `--depth=N` | 4 | Max link-follow depth (`--full` only) |
| `--knowledge-sample=N` | 0 | Random `/knowledge/*` URLs added to full-mode seeds |

### Exit codes (CI)

| Code | Meaning |
|---|---|
| 0 | No critical or high issues |
| 1 | One or more **high** issues |
| 2 | One or more **critical** issues |

---

## Screaming Frog tab mapping

| SF tab | Our equivalent | Source in report |
|---|---|---|
| **Internal** | All crawled URLs | `pages[]` |
| **Response Codes** | HTTP status histogram | `summary.statusHistogram` |
| **Page Titles** | title + duplicate detection | `pages[].title`, `duplicates.dupTitles` |
| **Meta Description** | meta desc + duplicates | `pages[].metaDesc`, `duplicates.dupDescs` |
| **H1** | H1 count + text | `pages[].h1`, `pages[].h1Count` |
| **Canonicals** | HTML + HTTP Link header | `canonicalHtml`, `canonicalHeader` |
| **Directives** | robots meta + X-Robots-Tag | `robotsMeta`, `xRobots` |
| **Structured Data** | JSON-LD types | `pages[].jsonLdTypes` |
| **Sitemaps** | sitemap vs crawl diff | `sitemap.notCrawledSample`, `crawl.notInSitemap` |
| **Hreflang** | alternate links | `pages[].hreflang` |
| **Redirect Chains** | hop list | `pages[].chain` |
| **Security / Headers** | Netlify global headers | `global_link_canonical` issue |

---

## Severity definitions

### Critical (fix immediately)

| Code | Meaning | Typical fix |
|---|---|---|
| `fetch_fail` | Network/timeout | Check Netlify status |
| `status_5xx` | Server error | Function logs, byte-budget 502s |
| `sitemap_404` | Sitemap lists dead URL | Reconcile index; fix sitemap generator |
| `redirect_loop` | 8+ redirect hops | Fix circular rule in `netlify.toml` |
| `global_link_canonical` | HTTP `Link: rel=canonical` → homepage on every page | Remove from `netlify.toml` `[[headers]]` (was removed commit 5588154 — re-audit catches reintroduction) |
| `noindex_in_sitemap` | Indexable sitemap URL has noindex | Remove noindex OR drop from sitemap |

### High

| Code | Meaning | Fix |
|---|---|---|
| `status_4xx` | Broken page | Redirect or restore content |
| `canonical_header_mismatch` | Link header ≠ page URL | Per-URL canonical only |
| `canonical_html_mismatch` | HTML canonical ≠ page URL | Fix renderer `<link rel=canonical>` |
| `duplicate_canonical` | HTML and header disagree | One canonical signal |
| `duplicate_title` | Same title on 4+ URLs | Unique titles in `pulse-machine-entry.js` |
| `missing_title` | Empty title on indexable page | Renderer/static head |

### Medium

Missing meta desc, missing H1, missing canonical, redirect chains >2 hops, duplicate meta descriptions, slow >5s.

### Low

Short/long titles, long meta descriptions, slow 3–5s.

---

## pulserevops.com scale strategy

The library has **24k+ entries** (~50k sitemap URLs total).

| Mode | Coverage | Runtime |
|---|---|---|
| `--quick` | **All sitemap URLs** (static + every pillar sub-sitemap + knowledge/tools) | Hours; use `--conc=8` if Netlify tolerates |
| `--full` | Static/hub pages from sitemap + internal link graph to depth 4 | ~30–60 min |
| `--full --knowledge-sample=500` | Above + evenly sampled `/knowledge/*` entries | Adds ~5 min |

**Recommended first run:** `node _sf_crawl_audit.js --quick --limit=200` then expand.

For ongoing ops: **weekly `--quick --compare`**; full sitemap pass monthly or after major sitemap deploys.

---

## Integration with existing SEO tools

| Tool | Role | When |
|---|---|---|
| **`_sf_crawl_audit.js`** | Full crawl inventory + technical SEO | Weekly / pre-post deploy |
| **`_index_all_pages_seo.js`** | Library IndexNow stamp + spot SEO on q/st/ik | After index gaps; `--fix` pings |
| **`_indexnow_delta.js`** | Ping only last ~26h new URLs | After every big publish batch |
| **`_indexnow_safe.js`** | Batched whole-site ping (clobber-safe) | Rare; owner-approved |
| **`_cro_link_audit.js`** | CRO card link text↔target integrity | Content QA (not crawl) |
| **GSC** | External index coverage | Manual; SF audit catches what GSC reports late |

Workflow after a deploy:
1. `node _sf_crawl_audit.js --quick --limit=500 --compare`
2. If clean → `node _indexnow_delta.js`
3. If critical → fix `netlify.toml` / renderer before IndexNow

---

## Example summary output

```markdown
# SF Crawl Audit Summary — https://pulserevops.com

_Generated 2026-06-28T… · mode **quick** · 200 URLs crawled · 50559 in sitemap_

## Severity counts
| Tier | Count |
|---|---|
| critical | 0 |
| high | 3 |
| medium | 12 |
| low | 8 |

## Top issue types
- **missing_meta_desc**: 12
- **slow_response**: 8
- **duplicate_title**: 3

## Critical issues (first 20)
(none)
```

## Example JSON issue (actionable)

```json
{
  "severity": "critical",
  "code": "global_link_canonical",
  "detail": "HTTP Link canonical → https://pulserevops.com/",
  "fix": "Remove global Link canonical from netlify.toml [[headers]] (commit 5588154 pattern)",
  "url": "https://pulserevops.com/knowledge/q12345"
}
```

---

## Netlify-specific checks

The audit explicitly watches for:

1. **Global `Link: rel=canonical`** in `netlify.toml` `[[headers]] for = "/*"` — caused every URL to canonicalize to homepage (removed in commit 5588154; script flags `global_link_canonical`).
2. **Clean URL redirects** — `netlify.toml` `[[redirects]]` with `status = 200` rewrites vs 301 chains.
3. **Function routes** — `/.netlify/functions/` disallowed in robots.txt but sitemap function allowed.
4. **Sitemap 404s** — dynamic pillar sitemaps via `pulse-machine-sitemap?pillar=` must return 200.

Local reference: compare `netlify.toml` headers block (should NOT contain `Link = "<https://pulserevops.com/>; rel=\"canonical\""`).

---

## Fix playbooks

### Sitemap URL returns 404
1. Confirm entry exists: `node _index_reconcile_any.js <prefix>`
2. Check route in `netlify.toml` for pillar prefix
3. Re-run sitemap function locally or verify `/sitemap-knowledge.xml`

### noindex on indexable library page
1. Check `pulse-machine-entry.js` for accidental `<meta name="robots" content="noindex">`
2. Check `X-Robots-Tag` response header
3. Remove noindex OR exclude URL from sitemap

### Duplicate titles (common on templated Q&A)
1. Ensure renderer uses entry `question` as unique `<title>`
2. Spot-check: `pages[].title` in report JSON
3. Backfill via blob rewrite if template drift

### Redirect chain >2
1. Grep `netlify.toml` for overlapping rules on same path
2. Consolidate to single 301 to final canonical

---

## Files touched by this process

| File | Written by |
|---|---|
| `_sf_audit_report.json` | Every run |
| `_sf_audit_summary.md` | Every run |
| `_sf_audit_baseline.json` | `--save-baseline` only |
| `_sf_audit_run.log` | Append log each run |

Read-only — never modifies site content or deploys.
