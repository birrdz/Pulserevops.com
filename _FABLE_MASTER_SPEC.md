# PULSE RevOps — MASTER SPEC & HANDOFF (for Claude Fable)

> Everything decided in the 2026-07-04 working session, in one place. This is the authoritative
> spec for the Pulse RevOps Q&A engine's **quality rubric, image standard, two-pass scrubber,
> auto-publish gate, and bento-grid layout**. Pollinator/flux is **removed everywhere**; all imagery
> is **DuckDuckGo, self-hosted, dated-graded**. Hand this whole file to Fable to fill out / build against.

---

## 0. CONTEXT & CURRENT STATE (what's already implemented this session)

- **Site:** ~35,000 Q&A pages across ~40 pillars. Goal: get people to hire Kory White / his company as a fractional CRO.
- **Scrub server:** `_scrub_button_server.js` on `http://localhost:8899/` (key `4444`). Handles both **writing** (`generateOne`) and **scrubbing** (`scrubOne`); they share one rubric (`rubricSignOff`).
- **Already shipped this session:**
  - ✅ **Auto-publish gate** — no human approval pile. A page auto-publishes to green ONLY when the full rubric passes **+ 3 staggered, specialized auditors** all pass (see §4). A miss loops back to re-scrub.
  - ✅ **Pollinator REMOVED** from writing + scrubbing. Covers now come from DDG (`_ddg_facecard_lib.js`), dated-graded, self-hosted to `/assets/qa/<id>.jpg`, stamped `cover_src:'ddg-facecard'`.
  - ✅ **Image-exclusion gate** in code + auditor prompt (see §3).
  - ✅ **Hire-a-CRO large tile** live on homepage (`/assets/hire-cro.jpg`, "Hire your Fractional CRO here"). Image is meant to rotate (not fixed).
  - ✅ **Bento-grid mock** built to spec (see §5) — awaiting sign-off before wiring live.
- **Two OPEN decisions** (see §6) — needed before the full 35k run.

---

## 1. THE 13-POINT CONTENT RUBRIC (Pass 1 — no network)

Score every Q&A page. Fix fails, rescore. Publish only at **13/13 with all checkmarks green**
(a full-rubric 12 is an accepted scoring quirk; an *incomplete* rubric is not). Thresholds are exact,
from the live `rubricSignOff`.

| # | Criterion | Pass condition |
|---|-----------|----------------|
| 1 | Word count | ≥ 2000 words of real content (no padding) |
| 2 | Direct answer | Direct answer to the question, up top |
| 3 | Direct answer (full) | The direct answer is complete, not a stub |
| 4 | FAQ block | ≥ 5 relevant FAQ Q&As |
| 5 | Mermaid diagrams | Exactly **2** mermaid diagrams |
| 6 | Mermaid clean | Both mermaids valid, error-free syntax |
| 7 | Sources | ≥ 5 real, non-fabricated sources |
| 8 | Related on PULSE | "## Related on PULSE" sibling-mesh section present |
| 9 | Clean links | All links valid, no broken/placeholder |
| 10 | Hero image | Top image present above the answer |
| 11 | Media count | 3–10 images (1 hero + up to 9 section images) |
| 12 | Images law | All images satisfy the Image Standard (§3) |
| 13 | No fabrication | Zero invented vendors/products/prices/stats/studies/quotes (auditor-verified) |

**Output per page:** `score X/13` + failed-criteria numbers.

---

## 2. MASTER SCRUBBER — TWO-PASS SPEC

**Scope:** all ~35,000 URLs. Two passes. Content first (no network), images second (network, throttled).
Only re-fetch flagged pages.

### PASS 1 — CONTENT (run first, no network)
Score all 35k against §1, fix, rescore to 13/13. Output `score X/13` + failed criteria.

### PASS 2 — IMAGE VALIDATION (run second, throttled; flagged pages only)
Per image (cover + every section image):
1. **FETCH** — 403/404/timeout(10s) → `IMAGE_DEAD` → re-fetch.
2. **PLACEHOLDER** — `image/svg+xml` OR body starts `<svg` OR <5KB → `IMAGE_PLACEHOLDER` → re-fetch with backoff **5s / 15s / 45s, max 3, then drop + log**.
3. **DIMENSION** — width <600 → `IMAGE_LOWRES`; aspect beyond 1:2.5 or 2.5:1 → `IMAGE_BADRATIO` → re-fetch.
4. **RELEVANCE** — search query derived from the page **title/topic**, never generic.
5. **RATE LIMITING** — queue, **max 2 concurrent**, **1–2s jittered** delay (`1000ms + rand(0–800)`), **pause 3–5s every 15 fetches**. Reuse the vqd token/session from the initial search (don't re-request per image). Real browser User-Agent + DDG referer. Never blast DDG across 35k in one run.
6. **VALIDATE BEFORE ADVANCING** — real raster, decodes, >600px, not SVG, >5KB, *before* marking done (a 200 alone is not enough — the SVG placeholder returns 200).
7. **STORE, DON'T HOTLINK** — save every validated image to our own hosting; update the page to our copy. **No live DDG URL in any page.** (Removes DDG dependency permanently.)
8. **REPORTING** — append to score: `13/13 + IMAGE_PASS`, `11/13 + IMAGE_PLACEHOLDER`, etc. Flags: `IMAGE_DEAD / IMAGE_PLACEHOLDER / IMAGE_LOWRES / IMAGE_BADRATIO`. Write CSV: `url, rubric_score, failed_criteria, image_flags, action_taken`.

### RUN ORDER / EFFICIENCY
- Content pass on all 35k first (fast, local).
- Image pass only re-fetches flagged pages; already-passing images skipped entirely.
- Batches of ~500; checkpoint the CSV after each batch (resumable if interrupted).
- **Idempotent:** re-running never duplicates fixes or re-downloads images that already passed.

### DO NOT
- Do not rewrite page logic, templates, routing, or SEO (slugs, canonicals, redirects) — content + image fixes only.
- Do not fire parallel unthrottled requests at DDG.
- Do not leave placeholder SVGs, broken images, or hotlinked DDG URLs in any published page.

### IMAGE FETCH TIMEOUT + FALLBACK LAW (owner 2026-07-07 — baked in, do not re-coach)
Every live image-provider fetch (DDG or Pollinator) MUST be wrapped in a hard timeout — an unbounded fetch
can hang and freeze the whole entry. On timeout:
1. **ONE-STRIKE RULE:** a live provider that hangs once gets NO second live attempt. Go straight to the instant
   self-hosted library/pool pick (`pickMatchingLibraryImage` — already graded, no network). Never live→live→library;
   always live→library. (A second 90s attempt on an already-hung provider wastes ~3 min/slot for no quality gain.)
2. Only if NO library match exists at all does the slot fall to a hotlink — and then only so the gate can catch + repair it.
3. **Hotlinks never pass the render gate** — a timed-out slot must end as a self-hosted graded asset, never an external URL.
Enforced in `fillProductImagesSequential` (`_ranking_list_rebuild_lib.js`: on timeout → `pickMatchingLibraryImage`
before any hotlink) AND `_fable_image_render_gate.js` (`providerHung` breaks the round loop → `guaranteedLibraryFill`).
Timeouts: `PROD_IMG_TIMEOUT_MS` default 35s (first attempt), `GATE_REPAIR_TIMEOUT_MS` default 90s.
Completion = a fresh `node _mv_audit.js` run with zero failures AND `node _mv_grade_check.js <id>` showing N/N
grade-stamped (EXIF `PULSE_GRADE=v_final` in the actual bytes) + N/N render-OK — not "I fixed the N that failed."

### LONG-TERM (already the chosen architecture)
Fetch each image **once** at build/scrub time and **self-host** it — one fetch per article ever, no runtime rate limits, no placeholder flicker. (If DDG keeps failing: Brave Search image API ~2k/mo free, SerpAPI, or Serper.dev as fallbacks.)

---

## 3. IMAGE STANDARD — what a valid image IS

**Source:** DuckDuckGo real photos only. Pollinator/flux removed everywhere.
**Subject:** people, places, or things — on-topic, **no random images**.
**Style (the "looks-like-Pollinator" dated grade):** muted color (saturation ~0.64), warm sepia cast, faded contrast (gamma ~1.12), heavy vignette + film-grain overlay; square 760×760 cover crop; light-dominant images get extra darkening; transparent PNGs flattened onto a dark backdrop; GIFs → first frame.
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
- White/light-dominant under a gold title (exclude, or force heavier overlay)

**Match aspect to card type:** landscape → wide/hero, square-ish → standard, portrait → tall.
*(Owner's note: this single rule does more for the look than anything else.)*

### SUBJECT TYPE BY PILLAR (drives the query + what "on-topic" means)
| Type | Pillars | Cover subject |
|------|---------|---------------|
| PEOPLE (portrait) | tl, ik, gp, ra, st, tk, ai, sw, tc, fr, q, ed | one clean professional portrait |
| PLACES | rs, lv, tn, ev, ga, nl, sc, dn, bo | real location/scene photo |
| THINGS | ca, bt, aq, es, tv, cl, co, er, gm, dr, sy, cr, fs, pt, wl, hf | real product/object photo |
| TOPICAL | ce, mv | photo of the actual event/subject |
| EXEMPT | gb (Graphics) | unbranded SVG system — not DDG |

---

## 4. AUTO-PUBLISH GATE (no human review pile)

A rubric-complete page auto-publishes to green ONLY when **all three staggered, specialized auditors pass**
(staggered ~10s apart so they're independent, not correlated snapshots):
1. ✍️ **Writing auditor** (Claude Code CLI) — fabrication + content quality.
2. 🖼 **DDG/images auditor** (DeepSeek skeptic) — every image present, relevant, no graphs/watermarks/screenshots.
3. 🌸 **Hero auditor** (Claude Code personal, strictest) — cover present + on-topic.

Plus a hard **live-render image guard** (no SVG placeholder, image actually renders). Any miss → back to re-scrub
(routed by which lane failed); after N misses recycle to the red queue. **No human approval pile.**

Auditor exclusion rules (in the prompt): FAIL any image that is a graph/chart/infographic/diagram, logo/icon/clip-art,
transparent PNG, text-heavy/screenshot/meme, watermarked stock, webpage screenshot/collage, broken/placeholder,
low-res (<600px), or extreme-aspect. Every image must be a real photo of a person/place/thing, on-topic.

---

## 5. BENTO GRID LAYOUT (homepage / image pages) — spanning grid, NOT masonry

> `grid-template-rows: masonry` is Firefox-only (unshipped in Chrome); `column-count` breaks order.
> Use a **spanning grid** only. This is a **style pass** — keep search input, pagination/infinite scroll,
> safe-search, and click-through working exactly as-is. Wrap new CSS/JS in idempotency comment markers.

**Layout:** `display:grid; grid-template-columns:repeat(6,1fr); grid-auto-rows:120px; gap:10px; grid-auto-flow:dense;`
Span classes cycled so no two adjacent are the same size: **hero** (3col/3row), **wide** (3–4col/2row), **tall** (2col/3row), **standard** (2col/2row).
Breakpoints: **4 cols ≤1024px**, **2 cols ≤640px** (hero collapses to span 2).

**Cards:** image `position:absolute; inset:0; object-fit:cover`; card `border-radius:10px; overflow:hidden`.
Bottom gradient: `linear-gradient(to top, rgba(20,5,12,0.92) 0%, rgba(20,5,12,0.55) 40%, transparent 75%)`.
Text bottom-left, padding 14px. Whole card = link. Lazy-load, alt text.

**Typography (Pulse News brand):** eyebrow 10px uppercase letter-spaced sans, gold `#FFB81C`; title Playfair-Display italic, gold `#FFB81C`, 17–22px by card size, line-height 1.15, `text-shadow:0 1px 3px rgba(0,0,0,.6)`. **Page bg aubergine `#1A0710`.** Cards get box-shadow + slight scale/glow on hover.

**Robustness (grid renderer):**
- **Broken/dead images:** `onerror` removes the card (never show broken icons / empty rectangles).
- **Placeholder guard:** don't trust `onload` alone — the SVG placeholder fires onload. After load, if `naturalWidth < 100` (or svg / <5KB) → treat as failure, remove/retry.
- **No layout shift:** render cards at fixed grid spans immediately; fade images in on load (opacity transition).
- **Dedupe** by image URL and by title similarity before rendering.
- **Title truncation:** `-webkit-line-clamp` 2–3 lines.
- **Thumbnail first**, full-size never (slow/blocked). (Moot once self-hosted.)
- **Idempotency markers** around the injected CSS/JS block.

---

## 6. OPEN DECISIONS (need owner call before the full 35k run)

1. **Self-host internal images too?** Covers are already self-hosted; internal section images are currently
   hotlinked DDG URLs. Master spec §2.7 says self-host everything (~200k+ images — big storage, permanent fix).
   → Decision: **YES self-host all / NO covers only.**
2. **Pacing:** master spec says 1–2s jittered + pause/15; earlier direction was 30s between renders.
   Self-hosting (fetch-once) makes the fast jittered pacing correct.
   → Decision: **switch to 1–2s jittered, drop the 30s?**

---

## 7. KEY FILES
| File | Role |
|------|------|
| `_scrub_button_server.js` | Scrub + writing engine, rubric, auto-publish gate, auditor prompt |
| `_ddg_facecard_lib.js` | DDG dated covers + image-exclusion gate (drop-in replacement for the old flux lib) |
| `_PULSE_RUBRIC_13.md` | The 13-point rubric (standalone) |
| `_bento_gen.js` / `_bento_mock.html` | Bento grid mock (6-col spec) — preview at `localhost:8891/_bento_mock.html` |
| `_FABLE_MASTER_SPEC.md` | **This file** |
