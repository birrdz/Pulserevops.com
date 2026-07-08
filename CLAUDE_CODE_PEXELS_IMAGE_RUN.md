# CLAUDE_CODE_PEXELS_IMAGE_RUN.md — Real Photo Acquisition Pass (CLAUDE CODE)

OPERATOR: CLAUDE CODE

This run is assigned to Claude Code. Cursor may be working other pillars in parallel. Only ONE image run may exist at any time across all tools (Pexels rate limit is per API key, shared). If Cursor's run is active (lockfile present), Claude Code REFUSES to start and reports.

## MISSION
Replace generated/hotlinked images with real stock photos downloaded to local disk, matched per-page, graded, and registered. Pexels primary, Pixabay fallback. Demand-driven: only download images that map to an actual page. No blind bulk downloads.
ADD-ON (owner): the page's FACE-CARD COVER = one of that page's internal (Pexels) images — same pattern as mv used its #1 poster.

## NO-RE-COACHING RULE
Any correction/edge case/bug fix discovered during this run MUST be written into this file's CORRECTIONS LOG before continuing. This spec is the single source of truth. Do not rely on chat memory.

## STARTING PILLAR
Inventory all pillars by page count from the registry (EXCLUDING mv and hf, and excluding pillars claimed in an active lockfile or already completed in image_run_cache.json). Start with the SMALLEST remaining pillar as the pilot. After the pilot completes: produce the pillar report, run validation, then STOP and wait for Kory's review. After approval, proceed smallest → largest, one pillar at a time.

## HARD EXCLUSIONS: MOVIES AND HEALTH & FAMILY
- mv (movies) OFF LIMITS AT ALL COSTS — keeps TMDB real posters per the topic override map.
- hf (health & family) OFF LIMITS AT ALL COSTS for this run.
- Do not query, touch, count, or "fix" them even if the validator flags them. Explicit guard clause in every script path skips mv and hf and logs the skip.
- hf registry code CONFIRMED = `hf` (Home & Family, 62 pages) — verified 2026-07-08.

## GOLDEN TEMPLATE COMPLIANCE
Every touched page must still pass the golden template (TOP_LIST / GENERAL + subtypes YESNO/DEFINITION/PROCESS/BESTPICK, 14-pt quality gate, mobile-first, CRO Syndicate widget fixed-right desktop / inline mobile). Image replacement must not break classification, layout, or the gate. Run the Node validator after each pillar. Fix rendering at template/renderer level — never inject markup into stored blobs.

## API KEYS
Pexels key from Netlify env → local .env as PEXELS_API_KEY. Never hardcode/commit/print. Pixabay key from .env PIXABAY_API_KEY if present; absent → fallback disabled, log misses (do not halt). (Current: PEXELS present in .env.local; PIXABAY absent → fallback disabled.)

## MULTI-AGENT COORDINATION
- Lockfile: check image_run.lock at repo root on start. If exists, REFUSE + report holder. If clear, create it: operator CLAUDE_CODE + PID + timestamp + claimed pillar. Delete on clean exit, incl. after circuit-breaker halt.
- Pillar ownership: work ONLY the claimed pillar. Single-writer registry: only this run (via storeGradedImage()) writes the image registry + image_run_cache.json while the lock is held.
- Shared files (templates, renderer, validator, spec files) single-agent-per-session. Template/renderer change → make it, commit immediately, note in CORRECTIONS LOG.
- Git: pull before starting. Commit frequently with pillar-prefixed messages (e.g. `gm: image run batch 3`). Never leave uncommitted shared-file changes at end of session.

## PROVIDERS
- Pexels (primary) — GET https://api.pexels.com/v1/search · Auth header `Authorization: <PEXELS_API_KEY>` · limit 200/hr → throttle ≥1 req / 18s · `?query=<derived>&per_page=5&orientation=landscape` · pick best from photos[] by width ≥1200 landscape then highest res · download `src.large2x` (fallback `src.large`).
- Pixabay (fallback only) — GET https://pixabay.com/api/ · use ONLY when Pexels returns 0 AND PIXABAY_API_KEY exists · `?key=<PIXABAY_API_KEY>&q=<derived>&per_page=5&orientation=horizontal&image_type=photo` · pick imageWidth ≥1200 · download largeImageURL.

## SCOPE
All pillars EXCEPT mv and hf. Respect the existing topic override map (any pillar/topic with an override keeps it). Linear pillar-by-pillar; complete one fully before the next; no parallel pillar work.

## QUERY DERIVATION
Per page: derive from slug/title — strip years, stopwords (best, top, vs, how, why, what, guide, 2024, 2025, 2026), location tokens for clone-family pages (city/state), keep 2–4 core nouns.
- best-noise-cancelling-headphones-2026 → noise cancelling headphones
- crm-software-for-realtors-annapolis-md → crm software realtor
Clone families share one query → one candidate pool. Query the API ONCE per unique query, cache, reuse for all family members.

## PIPELINE (per page, serial)
1. Check image_run_cache.json — slug done → SKIP.
2. Derive query → check query cache → cached? reuse : call Pexels (throttled).
3. Pexels 0 results → Pixabay fallback (if key). Both 0 → log to image_run_misses.log (slug + query), continue (NO retry, NO mid-run broadening — broadening rules must be added here first).
4. Download best candidate to temp.
5. pHash dedupe vs existing registry BEFORE storing. Match within threshold → reuse existing registered path (clone families hit this constantly — intended).
6. Route through storeGradedImage() — frozen grade (warm golden cast, filmic curve, vignette, grain), EXIF PULSE_GRADE=v_final, single-writer registry. NEVER write registry directly.
7. Update page to reference local registered path. Markup at template/renderer level, not blobs.
8. Write image_run_cache.json entry: { slug, query, provider, source_url, registered_path, phash, timestamp }.

## EXECUTION RULES
Serial only, one page at a time, one API request in flight. No concurrency/worker pools/sub-agent API calls. Throttle: ≥18s between Pexels, ≥1s between Pixabay. Circuit breaker: failure rate (download+API errors, NOT zero-result misses) >20% over any rolling 50-page window → HALT, write failure report, release lock, stop, no auto-resume. Resume-safe via image_run_cache.json — never re-download/re-grade a completed page. HTTP 429 (either provider): sleep 60s, retry once; second 429 counts as a failure.

## LICENSE / ATTRIBUTION
Pexels/Pixabay permit download + self-hosting without attribution. Store provider + source_url in cache for provenance. No hotlinking — local hosting only.

## VALIDATION (end of each pillar)
Run the Node validator on the pillar; confirm: golden template gate passes on every touched page; no page references a Pexels/Pixabay remote URL (local only); no SVG placeholders remain on touched pages; every stored image passes EXIF PULSE_GRADE=v_final; CRO Syndicate widget renders (fixed desktop / inline mobile) on touched pages. Miss log: if misses >10% of a pillar, stop and update QUERY DERIVATION here before continuing.

## REPORTING
After each completed pillar, append to IMAGE_RUN_REPORT.md: pillar name, pages processed, unique queries, API requests made, images stored, dedupe reuse count, misses, failures; validator pass/fail summary; estimated remaining runtime at current throttle. Then STOP after the pilot and wait for review.

## THROTTLE — HARD LAW (owner reinforcement 2026-07-08)
Pexels throttle is a HARD LAW, same discipline as Pollinations/DDG: **serial execution only, exactly ONE API request in flight at any time, MINIMUM 18 seconds between Pexels calls, no worker pools, no parallel sub-agents making API calls.** The 200/hr limit is tied to the API key and shared with Cursor — that is why the lockfile exists. Do NOT parallelize to go faster. On HTTP 429: sleep 60s, retry once; a second 429 counts as a failure toward the circuit breaker. The runner MUST enforce an 18000ms floor between Pexels calls that no env var can lower. Confirm this rule is reflected in the implementation before running.

## CORRECTIONS LOG
(Write all mid-run corrections here per the no-re-coaching rule.)

### `_gm_content_batch.js` fixes (2026-07-08, from gm pilot)
1. **Hang fix**: slots whose original img is ALREADY a valid self-hosted `/assets/qa/…` file → KEEP it (no fetch, no flux). Previously fell to flux `makeContent` which HUNG with no timeout (stalled on gm0042 for 26 min). Also wrapped `makeContent` in a 60s `Promise.race` timeout so one slot can never stall the batch.
2. **De-number pre-step (CRITICAL)**: the batch calls `collapseToGoldStructure` directly and MISSED the `deNumberMetaHeadings` pre-step the pipeline top10 phase uses. gm0051–0063 had `## 1. How We Ranked the Top 10 🏆 BEST OVERALL` (meta heading numbered as rank 1 + pill) → collapse couldn't fix → master-law failed at grade 14. FIX: before collapse, strip `## N.` from meta headings AND strip any 🏆/💎 pill from a meta heading. Validated gm0051/52/63 → 15/13 compliant. (Pipeline already handles this via its own deNumberMetaHeadings — batch now matches.)
- gm pilot tally: 63 Pexels covers (0 miss/fail); content batch 62/63 published 13/13 (gm0030 = genuine content grade-11 gap, left unpublished). ALL image FILES local → need deploy.


### 🚩 CHECKPOINT — `tl` (CRO Pulse Tools) pillar (owner 2026-07-08)
When the smallest→largest run reaches the **`tl`** pillar, HALT and make the clone-site consolidation decision with Kory FIRST (see `_ADSENSE_CLEANUP_PLAN.md`). tl holds 149+ "fractional CRO cost in [city/state]" clone families — do NOT image-process/deploy them until we decide consolidate-vs-keep, or we'll grade+ship images for pages we may redirect/delete.


### LOCKED STANDARD — Top-10 content/format fix (owner "lock that in", 2026-07-08)
Any Top-10 pillar page with a `<!--HERO-->` + leading `![](image.pollinations.ai/...)` hero, markdown images inside ranks, missing "How We Ranked"/"What to Look For", and/or HOTLINKED @@PRODUCT images gets this fix (validated on gm0001 → master+image compliant, 15/13):
1. `collapseToGoldStructure(body, id, title)` (`_aq_top10_gold_fix_lib.js`) — strips the hero + rank markdown images, adds missing sections, fixes gold tail order. It DROPS @@PRODUCT imgs.
2. Self-host each rank's image FROM ITS ORIGINAL HOTLINK: capture rank→img BEFORE collapse; download the original URL → `storeGradedImage(buf, /assets/qa/<id>-1NN.jpg, {width:800})` (grade + EXIF). If the hotlink is dead/absent → flux fallback `makeContent(id, 100+rank, name+title)`. (gm0001: 9 hotlink + 1 flux.)
3. Face-card COVER = the page's Pexels topical image (from the image run) — leave it; the content batch does not touch the cover img.
4. Verify `auditRankingListMaster` + `auditImages` + `gradeEntry` ≥13/13 → publish (answer blob + index quality_score=13 + `pulse-recent`) → email QID.
5. Image FILES are static → deploy after the pillar (owner 4444 standing deploy auth).
Runner: `_gm_content_batch.js` (PILLAR-parameterized; reuse for other Top-10 pillars — set `PILLAR=xx`). Run AFTER the Pexels cover run releases `image_run.lock` (both write `_index.json` — never concurrent). mv/hf guards included.

### LOCKED — NEW Q&A GENERATION also uses this fix (owner "lock that in for new generation", 2026-07-08)
The NEW Q&A pipeline already applies this automatically: `generateOne` (`_scrub_button_server.js` L5106) → `entryScrubPipeline` (L6109) → `case 'top10'` (L2843) runs `collapseToGoldStructure` (strip hero + gold structure) + `fluxFillTop10Gaps` (self-hosted images, poster-lib/flux). So every newly generated Top-10 Q&A comes out gold-compliant: NO `<!--HERO-->`/leading hero, NO hotlinked/pollinations images, self-hosted slot images, correct tail order, 13/13 gate. Confirmed wired 2026-07-08 — do not remove `collapseToGoldStructure` from the top10 phase.

- 2026-07-08 · Pre-flight: existing `_image_pexels_pipeline.js` is a PARTIAL foundation — NOT spec-compliant. Gaps to fix before running: (a) throttle is 1.2s, spec requires ≥18s Pexels; (b) no pHash dedupe; (c) writes raw download, must route through `storeGradedImage()` (grade + EXIF); (d) only mv guard, must add hf guard (`_ddg_facecard_lib` storeGradedImage in `_ddg_facecard_lib.js`); (e) no circuit breaker; (f) no 429 handling; (g) no Pixabay fallback path; (h) no misses log; (i) no lockfile; (j) per_page=15 → 5; (k) best-candidate must enforce width≥1200. Shared libs to reuse: `netlify/functions/lib/derive-image-search-query.js`, `netlify/functions/lib/mv-pillar-guard.js`. hf guard lib to add. Validator: `validate-golden.mjs`.
- 2026-07-08 · **Throttle + lock enforced in code** (Cursor): `netlify/functions/lib/pexels-throttle.js` — serial mutex, one in flight, **18000ms floor** (env may only raise `PEXELS_PACE_MS`, never lower), 429 → sleep 60s retry once. `netlify/functions/lib/image-run-lock.js` + `image_run.lock` on pipeline start. `_image_pexels_pipeline.js` updated: per_page=5, width≥1200 pick, hf+mv skip, misses log. **Still TODO before full spec run:** pHash dedupe, `storeGradedImage()`, Pixabay fallback, circuit breaker.
- 2026-07-08 · hf code confirmed = `hf`. Pilot pillar = `gm` (Gaming, smallest real pillar excl mv/hf; junk prefixes qmpx*/vq excluded as non-pillars).

### SPEC PATCH — IMAGE RELEVANCE GATE (owner 2026-07-08, no-re-coaching rule)
**WHY:** Some pages received unrelated images. Root cause is NOT the provider — it is that (a) query derivation produces weak queries for some slugs, and (b) Pexels returns its closest match even when nothing relevant exists, and the pipeline accepted it blindly. **Fix = validate relevance BEFORE accepting any candidate.** Do NOT alternate providers randomly — random alternation reintroduces the DDG reliability problems. Use a deterministic fallback chain with a relevance gate at each step.

**REPLACE the candidate-selection step in PIPELINE with:**

**RELEVANCE GATE (applies to every candidate before download)**
- Extract CORE TERMS from the derived query: the 1–3 most specific nouns (e.g. "noise cancelling headphones" → `["headphones"]`; "crm software realtor" → `["crm","software"]` with "laptop/computer/office" accepted as synonyms — see SYNONYM MAP below).
- For each Pexels candidate, check the photo's alt text (Pexels returns this per photo). A candidate PASSES only if at least one core term (or a mapped synonym) appears in the alt text, case-insensitive.
- Additionally require: `total_results >= 3` on the Pexels response. If Pexels returns 1–2 results, treat as low-confidence and FAIL the gate (thin results = probably wrong topic).
- Pick the FIRST passing candidate by the existing quality rules (width ≥ 1200, landscape, highest resolution among passers).

**FALLBACK CHAIN (deterministic, in this exact order — never random, never alternating)**
1. Pexels with derived query → relevance gate → if pass, use it.
2. Pexels retry ONCE with a simplified query: core terms only, stopwords and modifiers stripped further (e.g. "wireless earbuds runners" → "wireless earbuds"). Gate again.
3. Pixabay with core-terms query → same relevance gate using Pixabay's `tags` field instead of alt text.
4. Pollinations (generated image) — build the prompt from the page title + pillar context, same slug-derived seed convention as `CURSOR_CARDFACE_RUN.md`. Generated images are always on-topic because the prompt drives them; this is the safety net for abstract/RevOps concepts that stock photos can't match (e.g. "MEDDPICC scoring rubric").
5. If Pollinations fails (HTTP error) → log to `image_run_misses.log`, continue.

**DO NOT USE DDG in this chain.** DDG scraping was the source of the original hotlink/reliability problems this run exists to eliminate.

**SYNONYM MAP (extend in this spec as misses are reviewed — no-re-coaching rule)**
- crm / software / saas / platform / dashboard → accept: computer, laptop, office, screen, technology, business
- sales / revenue / quota → accept: business, meeting, handshake, office, chart
- training / coaching → accept: presentation, whiteboard, meeting, classroom
- (Abstract RevOps topics will usually fall through to Pollinations — that is expected and correct.)

**REMEDIATION OF ALREADY-BAD PAGES**
- Add `gate_version: 2` to every NEW cache entry written after this patch.
- Audit pass: for every existing cache entry WITHOUT `gate_version: 2`, re-run the relevance gate against the stored candidate's alt text (re-fetch metadata only — 1 API request per unique cached query, throttled). Entries that PASS get stamped `gate_version: 2` and keep their image. Entries that FAIL get their cache entry deleted and re-enter the normal pipeline for a fresh fetch through the new chain.
- Registry images orphaned by re-fetch stay in the registry (other pages may reference them via dedupe) — do NOT delete registry entries.

**ACCEPTANCE CHECK (add to end-of-pillar VALIDATION)**
- Manually sample 20 random pages per pillar: image must be visually on-topic. If more than 2 of 20 are off-topic, HALT, expand the SYNONYM MAP or QUERY DERIVATION rules in this spec, then re-run the audit pass for that pillar.

**LOGGING**
- Every fallback step taken gets logged per page in the cache entry: `{ chain_step: "pexels" | "pexels_retry" | "pixabay" | "pollinations", gate: "pass" | "fallthrough" }` so we can see which topics stock photos can't serve and tune the map.

### PRE-DEPLOY VERIFICATION PASS — MANDATORY before ANY deploy from this run (owner 2026-07-08, permanent)
Before ANY deploy from this run, execute this pass and write a PRE-DEPLOY REPORT with pass/fail per item. All 10 PASS → deploy. ANY fail → stop, fix, re-run the FULL pass. NEVER deploy with a failing item.
1. Run the full Node.js validator on every pillar touched this run — 100% pass on the golden template quality gate, zero exceptions.
2. Confirm ZERO remote image URLs remain (no pexels.com, pixabay.com, or DDG links in any page — local registered paths only; Pollinations-generated files must also be stored locally, not hotlinked).
3. EXIF check every image referenced by touched pages — all must carry `PULSE_GRADE=v_final`.
4. Check chain_step logs: report the Pollinations fallthrough percentage per pillar. If any pillar is over 40%, flag it for owner review before deploy.
5. Random visual sample: render 20 pages per touched pillar, list them with their image, confirm every image is on-topic. More than 2 misses in 20 = halt, fix, resample.
6. Confirm the CRO Syndicate widget renders on every sampled page — fixed right desktop, inline mobile.
7. Grep for localhost URLs (`http://localhost`) anywhere in the build output — ZERO allowed. (This exists because of the localhost:8899 leak caught earlier — this class of bug must never ship again.)
8. Confirm no mv or hf pages were modified — diff against git to prove it.
9. Build the site locally and confirm zero build errors and no broken image references (404s) in the output.
10. Write the results as a PRE-DEPLOY REPORT with pass/fail per item.
