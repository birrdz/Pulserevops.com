# 🖼️ IMAGE SCRUB + CONTENT SCRUB — HANDOFF / CROSSOVER (2026-07-04)
> Read FIRST alongside _HANDOFF_NEXT_CLAUDE.md. This session pivoted the whole scrubber to IMAGE-ONLY first, then content.

## THE PIVOT (why)
The old full-scrub (text+images+3 auditors/page) took >10 min/page → months for 35k. Pivoted to an
IMAGE-ONLY scrubber (`_image_scrub.js`): no text touched, AUDIT-FIRST (passing images skip in ~33ms, zero
network), fetch only failures. Then AUTO-CONTINUE into the content scrub (13-pt rubric) when images finish.

## CURRENT STATE (as of handoff)
- **`node _image_scrub.js` is RUNNING** (full run, all 40 real pillars, ~34,266 pages, smallest-first).
  Resumable via `_image_resume.json`; checkpoints every 48-page batch. Dashboard: http://localhost:8891/_image_dashboard.html
- ce (Pulse News) done. Grade is FROZEN + approved by owner.
- Images are LOCAL until deploy. **Deploy schedule = one per pillar close-out** (Fable), lastmod + IndexNow same build.

## FROZEN GRADE (in `_ddg_facecard_lib.js` → applyCineGrade + datedSVG)
saturation 1.08, +10% contrast (linear(1.10,6), lifted shadows), recomb warm-highlight/cool-shadow split,
light sharpen; overlay = ~14% soft vignette + ~4.5% grain + subtle golden warmth. Face-aware crop (position:'attention').
**Owner's look: rich, warm, old-timey editorial — NOT faded/sepia.** Samples he approved: betta/muscle car/coral/portrait/town/espresso.

## KEY FILES
- `_image_scrub.js` — linear image-only runner (SMOKE=N for smoke). Writes `_image_scrub.csv`, `_image_status.json`, `_image_resume.json`, `_image_samples.json`.
- `_ddg_facecard_lib.js` — ensureDdgFaceCover (cover), ensureDdgSectionImage (section, self-hosted /assets/qa/<id>-N.jpg), auditImage (zero-network audit), pHash registry (`_img_registry.json`), fallback ladder (exact→name-stripped→pillar), STOCK/COMPOSITE/REJECT blocklists.
- `_image_dashboard.html` — mobile-responsive, pinned live strip, before/after sampler, heatmap, unresolved queue.
- `_scrub_button_server.js` (localhost:8899 "unicorn site") — Begin Scrub now SPAWNS `_image_scrub.js` (old lane retired).
- `SCRUBBER_SPEC.md` — full spec incl. AUTO-CONTINUE (image→content), MAX-INDEX (SEO), generator gate, CRO-ad+mosaic compliance.
- `_grade_samples.html` — grade preview cards (localhost:8891/_grade_samples.html).

## 🔴 OPEN / CRITICAL DECISIONS
1. **QUALITY = "artsy magazine-editorial, NOT informational."** Owner's hard bar: no graphs/charts/documents/infographics.
   Pixel filters CANNOT enforce this (a chart/document passes size+aspect checks). → NEEDS A VISION CHECK per fetched image
   (Gemini Flash / Claude Haiku: "artsy magazine photo, no text/chart/document? y/n"). Not yet built. This is THE gap.
2. Hire-a-CRO hero swapped to bald exec (`_final-1.jpg` → `/assets/hire-cro.jpg`) — live on next deploy.
3. Owner dislikes hub-tile graphics (Browse Topics books, Search) — want artsy magazine replacements.
4. Content scrub (auto-continue) not yet built as a runner — needs the 13-pt rubric machinery (rubricSignOff exists in server).
5. Generator 13/13 gate (new pages) + 100 current-events Q&As requested — after image scrub, one registry writer at a time.
6. MAX-INDEX SEO (sitemaps/robots/schema/internal-linking/audit) — Step 3 + Step 5.
7. Deploy footprint: ~200k images could be 10-30GB → consider dedicated asset hosting before the monster pillars (CRO/Knowledge).

## STANDING RULES
- One registry writer at a time (never generator + scrub together).
- Never lower thresholds / skip validation / raise DDG concurrency for speed.
- Circuit breaker: >20% fail over rolling 100 fetches → PAUSE + report (template defect, fix once).
- Deploys pre-approved (4444), per pillar close-out, draft→restore-promote, pause log lanes.
