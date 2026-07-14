# MIGRATION_MACHINE.md — Netlify → Cloudflare Pages (FULL STATIC) — STANDING ORDERS

**Goal:** kill the ~$200/mo Netlify spend by moving pulserevops.com to a **fully static site on Cloudflare Pages** — every one of the ~35,453 pages pre-rendered to HTML, served from CF's free/cheap static tier, with the smallest possible number of edge functions for the few truly-dynamic bits.

**Operator:** Kory. Written by Claude 2026-07-11. Per the NO RE-COACHING RULE, corrections during build append here + to `migration/LESSONS.md`.

**Status: PLAN ONLY. Phase 1 build starts AFTER the CC weekly limit resets. Nothing live is touched until Phase 4 verify + Phase 5 cutover, both operator-gated.**

---

## 0. GROUND TRUTH (measured 2026-07-11 — do not re-derive from memory)

| Fact | Value | Source |
|------|-------|--------|
| Netlify Functions | **148** (`netlify/functions/*.js`) | `ls` |
| Scripts using `@netlify/blobs` | **2,284** | `grep -rl` |
| Content DB | Netlify Blobs store `pulse-machine-library` (`_index.json` + `answers/<id>.json`), ~35,453 entries | live |
| Rendering | **server-side at request time** by `pulse-machine-entry.js` (entries), `pulse-machine-library-list.js` (listings), `pulse-machine-sitemap.js`, `tools-page.js`, etc. | code |
| DNS | Netlify-managed zone `pulserevops.com` — see **`DNS_INVENTORY.md`** (2 MX→SMTP.GOOGLE.COM, SPF, DMARC, google-site-verification TXT, `go.` CNAME) | Netlify API |
| Netlify sites | 4, **all repo=NONE, cmd=none** (no CI builds; CLI/token deploys only) | Netlify API |
| CF creds | **MISSING** — need real `CF_ACCOUNT_ID` + `CF_API_TOKEN` in `.env.local` before Phase 2 | `.env.local` |

**⚠️ The big coupling:** the whole content pipeline (generator, fixer, image lanes, 2,284 scripts) reads/writes Netlify Blobs and pages render on-demand. "Deploy-free blob updates" is the current model. **Going static replaces that model:** content changes become *edit data file → re-render affected pages → `wrangler pages deploy`*. This is the single biggest workflow change and every downstream machine must be ported to it (Phase 3).

---

## 1. TARGET ARCHITECTURE (full static)

```
repo/data/            <- content DB as flat files (blobs snapshot, then source of truth)
  index.json          <- the entry registry (was _index.json)
  answers/<id>.json   <- one file per entry (was answers/<id>.json in Blobs)
  counts.json, ...    <- view counts + other small state (or CF KV, see §Dynamic)
repo/dist/            <- BUILD OUTPUT: pre-rendered static HTML for every URL
  index.html, knowledge/<id>.html, <pillar>/<id>.html, sitemap-*.xml, _redirects, _routes.json
functions/            <- CF Pages Functions — ONLY the few truly-dynamic endpoints (see below)
```

- **Static:** every entry page, listing, hub, sitemap, tool page, homepage → pre-rendered HTML in `dist/`. CF Pages serves these directly (no per-request compute = no per-request cost).
- **Truly-dynamic (must stay as small CF Pages Functions or move client-side):** enumerate and port ONLY these — view-count increment (`entry-view`), visitor/CRO click beacons (`pulse-click-notify`, visitor-alert), search (can be client-side over a prebuilt index JSON), trivia, IndexNow ping. Target: **<10 functions**, down from 148.
- **Snippet injections** (PULSE brighter pillar pills, PULSE Graphics pillar card — Netlify-only "snippet injection"): re-implement as **build-time HTML injection** in the static generator (inject into every rendered page), OR a CF Pages `_headers`/transform. Netlify snippet injection does not exist on CF.

---

## 2. PHASES (each phase ends with a VERIFY gate; nothing live until Phase 5)

### PHASE 1 — STATIC GENERATOR + FULL LOCAL RENDER  ← **START HERE (after limit reset)**
Prove the whole site renders statically, offline, before touching anything live.
1. **Snapshot the Blobs DB → `data/`** (read-only pull): `index.json` + all `answers/<id>.json` (~35,453) + `counts.json`. Resumable, content-hash cached.
2. **Extract render logic** from the 148 functions into a reusable module — primarily `pulse-machine-entry.js`'s markdown→HTML + CRO inject + JSON-LD + hero/image resolution + `renderMd`/`escHtml`. Reuse the EXACT functions (don't reimplement — visual-lock law) by requiring them with a shimmed `event/context` and a local-file blob shim (`getStore` → read from `data/`).
3. **`build_static.js`** — for every id in `index.json`, render its page to `dist/<seg>/<id>.html` (+ `dist/knowledge/<id>.html` alias), plus listings, hubs, homepage, sitemaps, `robots.txt`. Build-time inject the 2 snippets into every page.
4. **VERIFY (LAW-DOM):** headless-render N random `dist/*.html` and diff hero/card imgs, Direct Answer box, CRO card, mermaids, canonical/301 tags against the **live** Netlify page for the same id. Must match. Report a coverage number (pages rendered / total) and a diff report.
   - **Gate:** ≥99.5% of pages render without error AND the DOM spot-check matches live. Nothing proceeds until this passes.

### PHASE 2 — ROUTING / REDIRECTS / HEADERS → CF FORMAT
- Convert `netlify.toml` `[[redirects]]` + any `_redirects` → CF `dist/_redirects` + `dist/_routes.json` (routes.json decides which paths hit functions vs static).
- Pretty URLs (`/knowledge/<id>`, `/<pillar>/<id>`, `/tools/*`, `/sitemap-*`) mapped. Preserve every 301 exactly (SEO).
- `_headers` for caching + the google-site-verification if needed.
- Requires real **CF creds** (Phase 0 prereq).

### PHASE 3 — PORT THE DATA LAYER (2,284 scripts + the machines)
- Replace the `@netlify/blobs` `getStore()` layer with a thin `data-store.js` that reads/writes `data/` files (or CF KV/R2 for the dynamic counts). Single shim, swap the import site-wide.
- **Port the machines we built:** `gen_daemon.js` (generator), `sim_transform.js`/`sim_scan.js` (fixer), image lanes — they must write to `data/` + trigger an incremental re-render + a `wrangler pages deploy`, instead of a live Blobs write. **New content workflow = edit data → re-render changed pages → deploy.**
- Keep the local dashboards (8904 etc.) pointed at `data/` instead of Blobs.

### PHASE 4 — DEPLOY TO pages.dev PREVIEW + FULL VERIFY
- `wrangler pages deploy dist` → `*.pages.dev` preview URL (NOT the real domain).
- Full LAW-DOM sweep on the preview: sample every pillar, verify entries/listings/tools/sitemaps/301s/canonicals/snippets. Owner eyeballs. **Operator GO required.**

### PHASE 5 — DNS CUTOVER (LAST, operator does it manually)
- Written step-by-step (see §DNS Cutover Runbook) — re-add **every** record from `DNS_INVENTORY.md` at the new DNS host FIRST (especially the 2 MX, SPF, DMARC, google-site-verification, `go.` CNAME) so **email never breaks**, THEN point apex + www to CF Pages, THEN verify email + site, THEN decommission Netlify.
- Rollback: DNS records are captured in `DNS_INVENTORY.md`; revert apex/www to `pulserevops.netlify.app` to roll back.

---

## 3. CONTROL PANEL (same pattern as the fix/generator machines)

LAN dashboard on **http://localhost:7200** (dark, crimson `#B91C3F`/gold `#FFB81C`, phone-first, gitignored, never deployed). Reads `migration/run_status.json`; a watcher runs stages.
- **SCOPE** — pillar chips + ALL (which pages to (re)render / verify).
- **START** — runs the current phase for that scope (Phase 1: snapshot→render→verify).
- **STOP** — graceful halt at the next page boundary; resume-safe (never re-renders unchanged pages; content-hash keyed).
- Below: progress bar (rendered/total), current stage, verify pass-rate, diff-failures count.
- **`migration/LESSONS.md`** — append-only ledger; every render mismatch, every ported script, every routing quirk logged with date/symptom/fix/rule. Read in full at the start of every run.

---

## 4. STANDING LAWS (inherited)
Serial-safe · resume-safe (content-hash cache) · 20% rolling breaker on render errors · **visual-lock: reuse the real render functions, never reimplement the look** · LAW-DOM verify vs live before trusting any page · honest-metric (`run_status.json` is truth) · HALT-and-report on any missing render dependency (never fake a page) · **nothing live until Phase 4 GO + Phase 5 manual DNS** · email records from `DNS_INVENTORY.md` are sacred.

## 5. OPEN QUESTIONS FOR OPERATOR (resolve before Phase 3/5)
1. **Data source of truth after migration:** flat repo files (simple, git-versioned, but 35k files) vs CF KV/R2 (scales, but another API to port to). Recommend **repo files for content + CF KV for hot counts**.
2. **Confirm the $200 driver** (Netlify billing) so we know static actually kills it (it should — static serving is the cheap tier; Blobs egress + function invocations are what cost).
3. Get real **`CF_ACCOUNT_ID` + `CF_API_TOKEN`** (current ones missing; crossover notes the old token "returns no account").
4. Search: prebuilt client-side index (static-friendly) vs a search function — recommend client-side.

=== END PLAN — BUILD PHASE 1 AFTER LIMIT RESET; PROVE FULL LOCAL RENDER BEFORE ANYTHING LIVE ===

## 🔒 DEPLOY LAW (permanent · 2026-07-11) — canonical: `DEPLOY_LAW.md`
1. **Classify every change first.** CONTENT/DATA (entries, bodies, images, scores, index rows) → **Blobs only, NEVER deploy**. CODE/TEMPLATE/ASSET (function, renderer, `.js`/`.css`/static, redirect) → **queue for the daily deploy**.
2. **`--prod` max ONCE/day**, end of the last machine run, and **only if the code queue is non-empty**. No queued code = no deploy that day.
3. **Draft deploys are FREE** (`netlify deploy`, no `--prod`) — test freely.
4. **Never misclassify code as content** to dodge a deploy — classify honestly.
5. **Exception:** operator says **"deploy now"** → urgent deploy allowed.
6. **Log every deploy** (date · what shipped) in `DEPLOY_LAW.md`. (Once static/CF, this law's deploy = `wrangler pages deploy`; until then it's the Netlify draft→restore promote.)
