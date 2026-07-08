# PULSE RevOps — Q&A Quality Rubric (13-point) + Image Standard

> Source of truth: the live scrubber's `rubricSignOff` (shared by writing `generateOne`
> and scrubbing `scrubOne`). Pollinator/flux **removed** — all imagery is now **DuckDuckGo,
> self-hosted, dated-graded**. A page publishes only at **13/13 with all checkmarks green**
> (a full-rubric 12 is an accepted scoring quirk; an *incomplete* rubric is not).

## PART A — CONTENT RUBRIC (Pass 1, no network)

| # | Criterion | Pass condition |
|---|-----------|----------------|
| 1 | **Word count** | ≥ 2000 words of real content (no padding) |
| 2 | **Direct answer** | A direct answer to the question up top |
| 3 | **Direct answer (full)** | The direct answer is complete, not a stub |
| 4 | **FAQ block** | ≥ 5 relevant FAQ Q&As |
| 5 | **Mermaid diagrams** | Exactly **2** mermaid diagrams |
| 6 | **Mermaid clean** | Both mermaids are valid, error-free syntax |
| 7 | **Sources** | ≥ 5 real, non-fabricated sources |
| 8 | **Related on PULSE** | "## Related on PULSE" sibling-mesh section present |
| 9 | **Clean links** | All internal/external links valid, no broken/placeholder |
| 10 | **Hero image** | A top image is present above the answer |
| 11 | **Media count** | **3–10** images total (1 hero + up to 9 section images) |
| 12 | **Images law** | All images satisfy the Image Standard in Part C |
| 13 | **No fabrication** | Zero invented vendors/products/prices/stats/studies/quotes (auditor-verified) |

**Output per page:** `score X/13` + list of failed criteria numbers.

## PART B — IMAGE VALIDATION (Pass 2, throttled, network — flagged pages only)

Per image (cover + every section image):

1. **FETCH** — 403/404/timeout(10s) → `IMAGE_DEAD` → re-fetch.
2. **PLACEHOLDER** — content-type `image/svg+xml` OR body starts `<svg` OR <5KB → `IMAGE_PLACEHOLDER` → re-fetch (backoff 5s/15s/45s, max 3, then drop+log).
3. **DIMENSION** — width <600px → `IMAGE_LOWRES`; aspect beyond 1:2.5 or 2.5:1 → `IMAGE_BADRATIO` → re-fetch.
4. **RELEVANCE** — query derived from the page **title/topic** (never generic).
5. **VALIDATE BEFORE ADVANCING** — real raster, decodes, >600px, not SVG, >5KB — *before* marking done (a 200 alone is not enough; the SVG placeholder returns 200).
6. **STORE, DON'T HOTLINK** — save every validated image to our own hosting and update the page to our copy. **No live DDG URL left in any page.**

**Reporting:** append to the score → `13/13 + IMAGE_PASS` or `11/13 + IMAGE_PLACEHOLDER`, etc.
CSV columns: `url, rubric_score, failed_criteria, image_flags, action_taken`.

## PART C — IMAGE STANDARD (what a valid image IS)

**Source:** DuckDuckGo real photos only. Pollinator/flux removed everywhere.
**Subject:** people, places, or things — on-topic, no random images.
**Style:** dated/vintage grade — muted color, warm sepia cast, faded contrast, vignette + film grain (the "looks-like-Pollinator" look), square 760×760 cover crop.
**Self-hosted:** covers → `/assets/qa/<id>.jpg`; section images → our hosting too (never hotlinked).

**RULE OUT (exclude / re-fetch):**
- Graphs, charts, infographics, diagrams, tables
- Logos, icons, clip art, flat solid-color graphics, `.svg`
- Transparent PNGs (or give a solid dark backdrop)
- Text-heavy images (screenshots, memes)
- Watermarked stock previews (dreamstime, shutterstock, alamy, istock, 123rf, depositphotos, getty, adobe stock…)
- Webpage screenshots / directory grabs / marketing collages
- Broken / dead / hotlink-403 / placeholder / SVG
- Low-res (<600px) or extreme aspect (beyond 1:2.5 or 2.5:1)
- Animated GIFs (first frame only, or exclude)
- White/light-dominant when a gold title sits on it (exclude, or force heavier overlay)

**Match aspect to card type:** landscape → wide/hero slots, square-ish → standard, portrait → tall slots.

## PART D — SUBJECT TYPE BY PILLAR (drives the search + "on-topic")

| Type | Pillars | Cover subject |
|------|---------|---------------|
| PEOPLE (portrait) | tl, ik, gp, ra, st, tk, ai, sw, tc, fr, q, ed | one clean professional portrait |
| PLACES | rs, lv, tn, ev, ga, nl, sc, dn, bo | real location/scene photo |
| THINGS | ca, bt, aq, es, tv, cl, co, er, gm, dr, sy, cr, fs, pt, wl, hf | real product/object photo |
| TOPICAL | ce, mv | photo of the actual event/subject |
| EXEMPT | gb (Graphics) | unbranded SVG system — not DDG |

## DO NOT
- Do not rewrite page logic, templates, routing, or SEO (slugs, canonicals, redirects) — content + image fixes only.
- Do not fire parallel unthrottled requests at DDG.
- Do not leave placeholder SVGs, broken images, or hotlinked DDG URLs in any published page.
