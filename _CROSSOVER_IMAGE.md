# 🖼️ IMAGE SCRUB + CONTENT SCRUB — HANDOFF / CROSSOVER (2026-07-04)
> Read FIRST alongside `_CROSSOVER.md` and **`GOLDEN_TEMPLATE_TOP10.md` / `GOLDEN_TEMPLATE_QA.md`**. This session pivoted the whole scrubber to IMAGE-ONLY first, then content.

## ▶ LATEST — 2026-07-06 (PIPELINE TEMPLATE LAW · GOLD TEMPLATES)

**🔒 Template shape law:** `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md` · **Pipeline:** `.cursor/rules/pipeline-template-law.mdc` · **Rubric:** `SCRUBBER_SPEC.md`

| Template | Gold | Images |
|----------|------|--------|
| **Top 10** aq1158 | `@@PRODUCT` per rank, **no top hero** | One img/rank only; no markdown dupes in rank sections |
| **Q&A** q11133 | **No top hero** before Direct Answer + section imgs (≥3 total) | Topical pool/registry reuse OK; prefer new Flux/DDG |

**Shared:** DDG↔Pollinator alternation · 20s cooldown · self-hosted paths only · no live `pollinations.ai` in bodies · Direct Answer never blank.

## ▶ LATEST — 2026-07-06 (AQ GOLD REDO · RANKING MASTER NO-HERO · CE STOP)

- **2026-07-06:** AQ **ranking master no-hero** batch finished **838/838** (product `@@PRODUCT` imgs only, no top hero). Afternoon **dual-gold redo** (`_aq_gold_redo_batch_run.js --reapply`) re-applies **aq1158** Top 10 law + **q11133** Q&A law across full Aquariums pillar (841 ranking + 59 Q&A). CE pillar image/template runner **stopped** after owner deleted 178 CE blobs.

### AQ image + template batches (2026-07-06)

| Lane | Status | Log | Progress JSON |
|------|--------|-----|---------------|
| Ranking master (no hero) | ✅ complete 838/838 | `_aq_ranking_master_batch.log` | `_aq_ranking_master_progress.json` |
| Dual gold redo | ⏸ paused (3/840 fixed, 27 failed) | `_aq_gold_redo_batch.log` | `_aq_gold_redo_progress.json` |
| Gold redo email (5 min) | ⏸ stopped | `_aq_gold_redo_progress_email.log` | — |
| Per-entry 13/13 email | hook active | `_aq_1313_entry_email.log` | — |
| CE pillar fix | ⛔ stopped @ ce0184 | `_ce_pillar_image.log` | `_ce_pillar_image_progress.json` |

**Runners:** `_aq_ranking_master_batch.js` · `_aq_gold_redo_batch_run.js` · `_aq_gold_redo_progress_email.js` · `_aq_1313_entry_email.js` · `_pillar_image_fix_run.js --pillar=ce` (do not restart CE)

**Gold template router:** `_pulse_gold_template_router.js` — Top 10 → rebuild via `_ranking_list_rebuild_lib.js`; Q&A → `_aq_qa_gold_fix_lib.js`

**Ranking master law:** `_ranking_list_master_law.js` — `RANKING_LIST_NO_TOP_HERO=true` (owner 2026-07-06); enforced in `ensure-entry-images.js`

**Last aq gold redo log tail:**
```
2026-07-06T16:10:04.235Z Full reapply (--reapply)
2026-07-06T16:11:32.819Z Queue · aq total=900 · ranking=841/841 · qa=59/59 · skipped=0
2026-07-06T16:11:32.826Z TOP10 aq1158 · Top 10 Nano Reef Tanks 2027
```

---

## ▶ LATEST — 2026-07-04 eve (KORY STRIP + TOP-10 IMAGE LAW + DEPLOY)

### Kory portrait removed from answer bodies (live prod)
- **NOT removed:** CRO Syndicate sidebar widget (`#croFixed` / `croAdCard()` in `pulse-machine-entry.js`) — small sponsored card only.
- **Removed:** `/assets/kory-white.jpg` as in-body markdown image #2 (was showing full-width portrait mid-article on random pages).
- **Live:** deploy `6a4997a56911eb2e7014b7d1` · render strips in `stripBlobCro` + `stripRenderedCro` · scrub strips in `enforceCroCardLaw()`.
- **Backfill:** `node _strip_kory_from_blobs.js` (optional `--dry`) removes kory from all blob answers.

### Top-10 image law (enforce at scrub + publish)
| Rule | Example |
|------|---------|
| Unique URL per rank | `#2` and `#3` cannot share same `img=` |
| Image matches heading | `## 9. Metroid` → Metroid cover/screenshot, not random game |
| `@@PRODUCT name` matches `## N.` title | Mismatch → `product_title_mismatch` fail |
| Hero ≠ product img | `product_hero_dupe` fail if cover reused on a rank |

**Code:** `netlify/functions/lib/ensure-entry-images.js` — `auditTop10ProductLaw()`, `rebuildProductImages()` with per-slot DDG query + `excludeUrls`. Scrub `top10` phase calls `ensureTop10Images()` then `dedupeEntryImages()`.

### Deploy note
- **Never use `--no-build`** on Netlify CLI deploy — caused 0-function deploy and broke all entry pages. Always verify `available_functions.Count == 145` before promote.

---

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
