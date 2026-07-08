# MASTER SCRUBBER + GENERATOR SPEC — PULSE REV-OPS Q&A QUALITY + IMAGE AUDIT

> Single source of truth for the **13-point rubric** and **image standard**. **Golden template shape law:** [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) · [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) — when this file conflicts with those specs on golden-template pages, **the golden template files win**. **Both** the scrubber (`scrubOne`) and the generator (`generateOne`) import the SAME rubric enforcement (`entryScrubPipeline` + `rubricSignOff` + `AUDIT_SYS`). Never maintain two rubric copies — change the rubric here/in the shared module and both pipelines change automatically. **Publish only at 13/13 — no exceptions, no partial passes.**

**Scope:** all Q&A pages (~35,000 URLs) plus all newly generated pages. Existing pages get two
passes: content first (no network), images second (network, throttled) — only re-fetch flagged pages.

---

## PASS 1: 13-POINT CONTENT RUBRIC (run first, no network)

Score each page, list failed criteria numbers, fix them, rescore until 13/13.

1. **WORD COUNT** — ≥ 2,000 words of real content. "Real" = no repeated sentences/paragraphs, no restating the question across sections, no generic sentences that could appear on any page unchanged. If removing a sentence loses no information, it is filler — cut it and replace with substance.
2. **DIRECT ANSWER** — a direct answer to the question appears at the top, before anything else.
3. **DIRECT ANSWER COMPLETE** — full and self-contained, not a one-line stub. A reader who stops there has their question answered.
4. **FAQ** — at least 5 relevant FAQ question/answer pairs.
5. **MERMAID DIAGRAMS** — exactly 2 mermaid diagrams. Not 1, not 3.
6. **MERMAID CLEAN** — both diagrams use valid, error-free syntax that renders. Validate the syntax; do not assume.
7. **SOURCES** — at least 5 real, verifiable sources. Each source URL must return HTTP 200 (or 301 to a live page) and the destination must plausibly relate to the claim. No fabricated URLs, no dead links, no citing our own site as a source.
8. **RELATED ON PULSE** — a "Related on PULSE" section linking sibling pages is present.
9. **CLEAN LINKS** — every internal and external link is valid; no broken, empty, or placeholder (#, TODO) links.
10. **IMAGES PRESENT** — sufficient on-page images per page type. **Golden-template pages:** image/hero law in `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md` (Q&A: no top hero before Direct Answer; Top 10: rank `@@PRODUCT` images only, `cover_src: 'no-hero'`).
11. **MEDIA COUNT** — 3 to 10 images total. **Golden-template pages:** per-type counts in `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md`.
12. **IMAGES LAW** — every image obeys the Image Standard below.
13. **NO FABRICATION** — zero invented vendors, products, prices, statistics, studies, or quotes. Every specific claim is real and verifiable; if a claim cannot be verified against a source, rewrite it as a general statement or remove it.

**Output per page:** `score X/13` + the list of failed criteria numbers.

---

## IMAGE STANDARD (criterion 12)

Every image must be a **REAL DuckDuckGo photo of a PERSON, PLACE, or THING**, on-topic to the page,
**self-hosted** (never a live DDG/hotlink URL), and given the **dated/vintage grade**.

**VINTAGE GRADE** (apply identically to every image via ONE shared processing function — never hand-tune per image):
desaturate to ~70% saturation, warm sepia cast (+10–15 temperature shift), reduce contrast ~15%,
vignette ~20% strength, film grain low opacity ~8%.

**RULE OUT / re-fetch any image that is:**
- a graph, chart, infographic, diagram, or table
- a logo, icon, clip art, or flat solid-color graphic (.svg)
- a transparent PNG (or give it a solid dark backdrop)
- a text-heavy image, screenshot, or meme
- a watermarked stock preview (dreamstime, shutterstock, alamy, istock, 123rf, depositphotos, getty, adobe stock)
- a webpage screenshot, directory grab, or marketing collage
- broken / dead / 403-hotlinked / placeholder / SVG
- low-res (width < 600px) or extreme aspect (beyond 1:2.5 or 2.5:1)
- an animated GIF (use first frame only, or exclude)
- white / light-dominant behind a gold title (exclude, or force a heavier overlay)

**Match aspect to card slot:** landscape → wide/hero, square → standard, portrait → tall.

**Subject by pillar:**
- PEOPLE (portrait): tl, ik, gp, ra, st, tk, ai, sw, tc, fr, q, ed
- PLACES: rs, lv, tn, ev, ga, nl, sc, dn, bo
- THINGS: ca, bt, aq, es, tv, cl, co, er, gm, dr, sy, cr, fs, pt, wl, hf
- TOPICAL (event): ce, mv
- EXEMPT (SVG system, not DDG): gb

**ADDITIONAL DDG FETCH RULES:**
- **POSITIVE TARGETING:** build queries to pull real photographs — append "photo"/"photograph" and prefer DDG's photo type filter. Never query the topic word alone if it invites diagrams (e.g. "MEDDPICC" returns charts → query the human subject: "sales executive meeting photo").
- **FILENAME/SOURCE FILTERS (before downloading, not after):** reject candidates whose URL/filename contains logo, icon, badge, banner, sprite, favicon, watermark, chart, graph, diagram, infographic, screenshot, or ends in .svg.
- **DEDUPE:** dedupe candidates by image URL and near-identical thumbnails; never use the same image on more than one page within the same pillar.
- **THUMBNAIL vs SOURCE:** fetch DDG's thumbnail URL for validation, but download the full-resolution source image for self-hosting IF it passes the same checks; fall back to the thumbnail if the source 403s or fails validation.

---

## PASS 2: IMAGE VALIDATION (run second, throttled — flagged pages only)

1. **FETCH CHECK** — request each stored image; 403/404/10s-timeout → `IMAGE_DEAD`, queue re-fetch.
2. **SVG PLACEHOLDER CHECK** — content-type `image/svg+xml`, OR body starts `<svg`, OR file <5KB → DDG placeholder → `IMAGE_PLACEHOLDER`, re-fetch with exponential backoff (5s, 15s, 45s, max 3 tries, then drop + log).
3. **DIMENSION CHECK** — decode; width <600px → `IMAGE_LOWRES`; aspect beyond 1:2.5 or 2.5:1 → `IMAGE_BADRATIO`. Re-fetch either.
4. **STANDARD CHECK** — violates any Image Standard rule-out → `IMAGE_STANDARD`, re-fetch.
5. **RELEVANCE** — re-fetch queries built from the page's question/title + pillar subject type (person/place/thing).
6. **RATE LIMITING** — queue, max 2 concurrent, 1–2s jittered delay (1000ms + rand 0–800ms), pause 3–5s every 15 fetches. Reuse the vqd token/session from the initial search; do not re-request it per image. Real browser User-Agent + DDG referer. Never blast DDG across 35k in one run.
7. **VALIDATE BEFORE ADVANCING** — real raster, decodes, >600px, not SVG, >5KB — BEFORE marking done (a 200 alone is not enough; the SVG placeholder returns 200).
8. **STORE, DON'T HOTLINK** — save every validated image to our own hosting; update the page to our copy. No live DDG URL in any page.
9. **REPORTING** — append to score: `13/13 + IMAGE_PASS`, `11/13 + IMAGE_PLACEHOLDER`, etc. Flags: `IMAGE_DEAD / IMAGE_PLACEHOLDER / IMAGE_LOWRES / IMAGE_BADRATIO / IMAGE_STANDARD`. CSV: `url, rubric_score, failed_criteria, image_flags, action_taken`.

**Run order / efficiency:** content pass on all 35k first (fast, local); image pass only re-fetches flagged pages; already-passing images skipped. Batches of ~500, checkpoint the CSV after each batch (resumable). Idempotent: never duplicate fixes or re-download images that already passed.

---

## GENERATION PIPELINE — PUBLISH GATE (new content)

> **🔒 PIPELINE TEMPLATE LAW (mandatory):** Classify → generate → surgical fix → publish **only at 13/13**.  
> **Golden template law:** `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md`  
> **Pipeline process:** `.cursor/rules/pipeline-template-law.mdc`

The SAME 13-point rubric + Image Standard govern ALL newly generated Q&A pages. Generator and scrubber
import the SAME rubric definition (single shared module). Never two copies.

**Batch flow (button → 100 new Q&As):**
1. **GENERATE** each Q&A per the content template.
2. **SELF-SCORE** the draft against all 13 criteria + Image Standard — the SAME code path as the scrubber's Pass 1 (no separate "lite" checker).
3. **AUTO-FIX LOOP** — if <13/13, fix the failed criteria and rescore. Max 3 fix attempts per page.
4. **IMAGE GATE** — images follow the same DDG fetch rules, rate limiting, validation-before-advancing, vintage grade, and self-hosting as Pass 2. No page enters the publish queue with an unvalidated or hotlinked image.
5. **HARD GATE** — a page publishes ONLY at **13/13** + IMAGE_PASS. **Not 12/13 "close enough."** Any page still failing after max fix attempts → HOLD queue: NOT published, NOT deleted, NOT silently retried forever.
6. **BATCH REPORT** — after each run: X published (13/13 + IMAGE_PASS); Y held (url, score, failed criteria, image flags). Same CSV format as the scrubber, appended to the same log so scrubbed + generated pages share one audit trail.

**Front-end (the button UI):**
- Live progress: pages generated / scored / fixing / publishing / held.
- Each page shows its score as a 13-point checklist (green check / red X per criterion) — failures visible at a glance, not buried in logs.
- Held pages get a "Review & Retry" action — one click re-runs the fix loop on that page.
- A "Rubric" link renders the shared rubric file, so the operator always sees the exact rubric the code enforces.
- No manual "publish anyway" override. Shipping below 13/13 = a human editing the page to pass, not a bypass.

**Generation DO-NOTs:**
- Do not create a second rubric definition anywhere in the codebase.
- Do not mark a page published before image validation completes.
- Do not let a batch of 100 fire 100 parallel DDG fetches — use the same throttled queue as Pass 2.
- Do not lower any threshold (word count, source count, diagram count) to make generation faster.
- Do not classify template type after generation has started, or switch template mid-pipeline.
- Do not publish at 12/13 or "close enough" — 13/13 + IMAGE_PASS only (see `GOLDEN_TEMPLATE_TOP10.md`, `GOLDEN_TEMPLATE_QA.md`, `.cursor/rules/pipeline-template-law.mdc`).

---

## PIPELINE TEMPLATE LAW — pointer

**Pipeline process:** `.cursor/rules/pipeline-template-law.mdc` · **Template shape law (only sources of truth):** `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md`

---

## GLOBAL DO-NOTs
- Do not rewrite page logic, templates, routing, or SEO (slugs, canonicals, redirects) — content + image fixes only.
- Do not fire parallel unthrottled requests at DDG.
- Do not leave placeholder SVGs, broken images, or hotlinked DDG URLs in any published page.

## LONG-TERM ARCHITECTURE (chosen)
Fetch each image once at build/scrub time and self-host it — one fetch per article ever, no runtime
rate limits, no placeholder flicker. DDG fallbacks if it keeps failing: Brave Search image API
(~2k/mo free), SerpAPI, or Serper.dev.

---

## DEDUPE (replaces the prior URL-only dedupe) — IMAGE REGISTRY + pHASH

- **IMAGE REGISTRY:** one persistent registry (`_img_registry.json`) of every self-hosted image — perceptual hash (pHash), source URL, dimensions, pillar, page URL(s). Scrubber AND generator write/check the SAME registry.
- **PERCEPTUAL HASH, NOT URL:** dedupe by pHash (dHash 64-bit, hamming ≤ 8 = duplicate), because the same photo appears under many URLs. URL match is a fast pre-check only, never the sole check.
- **HASH BEFORE THE VINTAGE GRADE:** compute pHash on the RAW downloaded image, before grading (grading shifts the hash).
- **SCOPE:** hard-block duplicates within the same pillar and the same page. Across different pillars, allow max 2 total uses site-wide, then block.
- **ON DUPLICATE HIT:** do not fail the page — advance to the next DDG candidate and validate that one. Only flag `IMAGE_DUPLICATE` if all candidates exhausted, then re-query with a varied term (a qualifying word from the page title) before giving up.
- **BACKFILL:** on first run, hash every existing self-hosted image into the registry before fetching anything new, so new fetches dedupe against the whole existing library.
- **IDEMPOTENT:** re-running never re-hashes unchanged files, never creates duplicate rows.
- **EVERY IMAGE, not just covers:** covers AND all section images run through the same claim/reject flow (requires section images to be self-hosted).

---

## EXECUTION PLAN — RUN ORDER

**MODE: LINEAR, PILLAR BY PILLAR. No alternating jobs.**

1. **SINGLE JOB, SINGLE WRITER** — exactly ONE scrub/generate job at a time; no parallel jobs across pillars. Guarantees one writer to the image registry (zero race on dedupe claims). Within the job, keep internal concurrency: max 2 concurrent DDG fetches, jittered 1–2s delay, pause 3–5s every 15 fetches. Linear job order ≠ one image at a time.
2. **PILLAR ORDER** — smallest page-count first, largest last. First print the planned order as a table (pillar code, page count, estimated batches), then proceed (wait for no one). Rationale: small pillars shake out bugs before the monster pillars.
3. **BATCHING** — 48 pages per batch, sequential batches within the pillar. Checkpoint CSV + registry after EVERY batch. A killed run resumes at the exact next unprocessed page — zero rework, zero duplicate fixes.
4. **PILLAR CLOSE-OUT (quality gate)** — a pillar is DONE only when every page is 13/13 + IMAGE_PASS (or in HOLD with flags logged). Close-out report: pages passed/held/total; top-3 most-failed criteria; images fetched / dedupe-rejected / re-queried. If any single criterion fails on >20% of pages, STOP before the next pillar and report the pattern — that's a systematic template/prompt defect to fix once, not 500 individual fixes.
5. **SPEED (fast without quality loss)** — Pass 1 (content scoring/fixes) is local: run at full speed, no throttling, across the whole pillar before Pass 2 begins. Pass 2 (images) only touches pages with image flags; pages whose images already pass are skipped entirely. NEVER speed up by raising DDG concurrency, shrinking delays, skipping validation, or lowering any rubric threshold. The only legitimate speedups: skipping already-passing pages, fixing systematic defects at the template level, and keeping the run resumable so no work repeats.
6. **PROGRESS REPORTING** — after each batch print one line: `[pillar] batch N/M | passed X | fixed Y | held Z | dupes rejected D`. Maintain a `PROGRESS.md` with per-pillar status (NOT STARTED / IN PROGRESS batch N/M / DONE + close-out summary) so status is readable at a glance between sessions.

> **The 20% circuit breaker (§4) is the speed weapon** — one template fix beats five hundred page fixes. That's where "fast AND quality" actually comes from.

---

## SCRUB DASHBOARD (dashboard.html — visual UI)

Single local page, no build step, auto-refresh every 10s by reading _master_scrub.csv / PROGRESS.md / _img_registry.json / _master_resume.json. Read-only except Retry buttons; the dashboard never edits content itself. Pulse brand: aubergine #1A0710 bg, gold #FFB81C accents, serif-italic headers.

1. **PILLAR BOARD** — one card per pillar in run order: code, status (NOT STARTED / IN PROGRESS / DONE / STOPPED-PATTERN), progress bar (pages done/total), pass %, held count. Done = gold check. Circuit-breaker stop = red banner naming the failing criterion.
2. **LIVE BATCH STRIP** — current pillar, batch N/M, live line: passed / fixed / held / dupes rejected.
3. **FAILURE HEATMAP** — 13 columns (rubric criteria) x pillars, colored by failure rate. Dark column = one rule failing everywhere (template defect); dark row = one pillar rotten.
4. **HOLD QUEUE TABLE** — every held page: clickable URL, score, failed criteria, image flags, Retry button (re-queues just that page).
5. **IMAGE STATS PANEL** — images validated / re-fetched / dupes rejected (URL vs pHash separately), DDG placeholder hits in last hour (spiking = rate limit).

---

## AUTO-CONTINUE — IMAGES DONE → CONTENT SCRUB
When the image scrub completes its FINAL pillar close-out (all pillars DONE, hold/unresolved logged), do NOT stop:
1. **FINAL IMAGE REPORT** first: total pages image-done, images fixed, dupes rejected (URL vs pHash), unresolved by pillar, full unresolved CSV. Print, then continue.
2. **LAUNCH CONTENT SCRUB** immediately — full 13-point rubric per this spec, same machinery (linear, smallest-first, 48/batch, checkpoint, resumable, 20% breaker per criterion at close-out).
3. **CONTENT PASS RULES:** criteria 1-11 + 13 are the work; criterion 12 is RE-VERIFY ONLY (do not re-fetch/re-grade/touch image files — if a page fails 12, flag, don't fix inline). Fix MEDIA_COUNT_OFF pages flagged in the image scrub via the standard throttled+deduped+frozen-grade pipeline. Fabrication (13): unverifiable claims → general statement or remove, never a new invented specific. No template/slug/routing/SEO changes — content only.
4. **REPORTING:** same CSV audit trail continued, one line/batch, PROGRESS.md current, pillar close-outs w/ top-3 failed criteria. Dashboard switches to content mode (heatmap = 13 criteria × pillars).
5. **DEPLOYS:** unchanged — one per pillar close-out, lastmod updated, IndexNow ping same build.
6. **STOP ONLY ON:** a circuit-breaker trip (criterion >20% of a pillar = template defect → report + wait) or run finish. Else run unattended to 13/13 site-wide.
7. **SOURCE-CHECK THROTTLE:** verifying 5+ source URLs × 35k = ~175k HTTP checks. Not DDG (no placeholder risk) but be polite — few concurrent, cache repeat domains, don't hammer.


## RULING 2026-07-07 (owner) — mv/site FAQ + list exemptions
- **FAQ (rubric pt 4) must be a VISIBLE `## FAQ` section in the answer BODY** with >=5 Q&As. The `seo_semantic_faq` SEO field alone does NOT satisfy it. Build the body FAQ from `seo_semantic_faq` when present.
- Pages with 0 product cards / non-list Q&As (e.g. mv0050) are graded as essays, exempt from the ranking-list + >=8-card requirement.
