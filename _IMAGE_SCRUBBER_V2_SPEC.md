# PULSE IMAGE SCRUBBER v2 — MASTER SPEC (canonical, 2026-07-04)

> Pasted verbatim by owner. This REPLACES the old scrubber's image logic and the image
> portions of SCRUBBER_SPEC.md. Retire legacy: old parallel Begin-Scrub lane, full-content
> scoring paths, old grading values, duplicate rubric/image logic. One clean job:
> `_image_scrub.js` + picker UI + enforced grade + artistic aesthetic.
> Companion: `_IMAGE_LOOK_LOCK.md` (the look) and `feedback_image_look_lock_4444` (memory).

## SCOPE
- Cover = card face = page top/hero = ONE asset, one slot, one registry entry (rendered at card
  size AND hero size). If build treats card+hero as two images, MERGE to one slot.
- Pipeline/grade/stamp/verify apply to ALL images site-wide: covers/heroes AND every Q&A section
  image. No class exempt. No ungraded image may exist anywhere.

## AESTHETIC — ART OVER LITERAL
Priority: 1) taste/artistic, 2) on-topic, 3) literal accuracy. Beautiful evocative > accurate boring.
WANT: painterly/illustrated/fine-art (oil, watercolor, vintage illustration, etching);
atmospheric/cinematic/distant-moody photography (silhouette, golden hour, macro, dark) the grade
turns artistic; dramatic close-ups w/ strong color/composition. NOT: man holding catch, pet-store
tank snapshot, fluorescent documentary.
LEAD QUERY (always first): "artistic [subject]" / "artistic photos of [subject]" (fishing→"artistic
fishing images"). Rotate secondary modifiers by page-id hash: painting, watercolor, cinematic,
moody, vintage illustration, fine art, macro dark background, golden hour, atmospheric.
PEOPLE pillars: 10-descriptor rotation biased artistic (portrait painting, cinematic portrait,
silhouette, dramatic-lighting portrait) — never corporate-stock headshots.
FALLBACK: artistic exact → artistic generic (strip celebrity/brand) → best photographic (graded).
Documentary photos = last resort.

## TOPIC OVERRIDE MAP (real artifacts, not art)
- MOVIES (mv) → real movie poster of the referenced film. Extend ONLY when operator names a topic.
- Poster caveat: posters text-heavy by design → exempt from text-heavy rule-out on override topics
  only. All other gates apply. Watermarked stock banned everywhere.

## RULE-OUT
WELCOME: paintings, illustrations, watercolors, etchings, drawings (NOT "clip art").
BLOCKED: flat vector clip art, logos/icons, diagrams/charts, text-heavy (outside override), memes,
screenshots, watermarked stock (dreamstime, shutterstock, alamy, istock, 123rf, depositphotos,
getty, adobe stock), collages, clashing cartoon/comic.

## FROZEN GRADE (locked)
Sat 105–110% | warm cast +8–12 highlights+midtones (golden, not sepia mud) | contrast +10% filmic,
lifted shadows | vignette 12–15% soft/wide | grain 4–5%. Grade from RAW only; never re-grade a
graded file. One shared function. No per-image tuning. No changes this run.

## GRADE ENFORCEMENT (verified, non-negotiable)
1. ONE CHOKE POINT: exactly one fn writes images — `storeGradedImage(raw)` — ALWAYS grades before
   write. No other path may write an image file. Delete bypasses.
2. PROOF-OF-GRADE: stamp every output (EXIF/metadata `PULSE_GRADE=v_final` + post-grade hash in
   registry row). No stamp+registry = ungraded by definition.
3. VERIFY GATE: before any page ref rewritten, verify stamp+hash. Fail → slot unresolved, flag
   GRADE_MISSING. Any GRADE_MISSING in a batch → PAUSE + report (code defect, never per-image fix).
4. GRADED PREVIEW LAW: every picker thumbnail, sampler image, before/after "after" ALREADY wears
   the filter BEFORE display. Operator judges FINISHED product only. Raw thumbnail in UI =
   GRADE_MISSING bug → pause+fix. Override posters get the grade too (unifies house look).
5. RETROACTIVE SWEEP: audit every image stored this run for the stamp; unstamped → re-grade from
   RAW, restore, report count.
6. ACCEPTANCE TEST (FIRST): 6 test images end-to-end; verify all 6 stamped AND differ from raws
   (hash inequality + saturation/contrast delta). Sampler ≥3 painterly/artistic. Show the 6; any
   output == raw = broken, fix first.

## PIPELINE PER SLOT
1. AUDIT (local, no net): inspect actual file — self-hosted ≠ pass. Fail if hotlinked,
   SVG/placeholder (content-type / "<svg" / <5KB), fails decode, width <600px, aspect beyond
   1:2.5–2.5:1, rule-out hit, or missing grade stamp. PASS → registry-claim, skip, zero net.
2. FETCH: query per aesthetic (artistic formula + override + fallback). URL/filename pre-filters
   (logo, icon, badge, banner, sprite, favicon, watermark, chart, graph, diagram, infographic,
   screenshot, .svg) BEFORE download.
3. VALIDATE each candidate: real raster, decodes, ≥600px, >5KB, not SVG, aspect OK. 200 proves nothing.
4. DEDUPE: URL pre-check → pHash vs full registry (hamming ≤8 = dupe; hash RAW pre-grade). Replace
   rejects until 10 valid deduped distinct candidates (or results exhaust).
5. GRADE all survivors via choke point (thumbnail for picker; full-res on selection).
6. RESOLVE per PICK MODE.
7. STORE: selected full-res graded, raw kept in registry, pHash+URL claimed, stamp verified, page
   ref rewritten. Zero hotlinks remain.

## PICK MODE
PICK_SCOPE = "covers" | "all" | "none" (default "covers").
- PICKER QUEUE UI (mobile-first single col): per in-scope slot show title+pillar + grid of 10
  GRADED candidates ranked ARTISTIC-FIRST (auto-pick #1 inherits bias). Tap ONE → resolve full-res/
  store/claim/rewrite, next loads instantly. "None of these" → next fallback rung, 10 fresh.
  "Auto-pick" → top candidate. Target <3s/decision.
- OUT-OF-SCOPE slots (sections when scope=covers): auto-select top-ranked, same bar+gates.
- PREFETCH N+1..N+5 (fetch+grade) so picker never waits; obeys throttle.
- SESSION-SAFE: checkpoint, resume exactly; resolved slots never re-ask.

## RUN MECHANICS
Linear single job, smallest pillar first; print pillar order table + estimates at start. 48/batch;
checkpoint CSV+registry+status JSON every batch; kill/resume zero rework. Throttle: max 2 concurrent
DDG, 1–2s jitter, 3–5s pause/15 fetches, vqd reuse, real UA+referer, backoff 5/15/45s max 3 →
IMAGE_UNRESOLVED (old stays, logged). Breaker: >20% placeholder/unresolved over rolling 100 OR any
GRADE_MISSING → PAUSE+report. Deploys: ONE per pillar close-out (commit+build), sitemap lastmod +
IndexNow same build; never per batch. No content/template/slug/SEO/media-count changes (log
MEDIA_COUNT_OFF for content pass).

## NO RE-COACHING
Spec, not conversation. Don't revert to literal queries, don't show ungraded candidates, don't ask
to re-explain aesthetic. Conflicts resolve for THIS spec. New topic override / aesthetic edge → ask
ONCE, record here, never ask again.

## DASHBOARD (bg #1A0710, gold #FFB81C, serif italic, 10s refresh, mobile single-col, live strip pinned)
1. PICKER QUEUE front+center: count waiting, 10-thumb graded grid, tap-to-pick.
2. Pillar board: status/progress/fixed/skipped.
3. Live strip: batch N/M, fetched/graded/deduped-rejected/unresolved, placeholder hits last hour.
4. Flag heatmap: pillars × flags (DEAD/PLACEHOLDER/LOWRES/BADRATIO/STANDARD/DUPLICATE/UNRESOLVED/
   HOTLINKED/GRADE_MISSING).
5. Before→After sampler (last 6, "after" graded).
6. Unresolved queue table, exportable CSV.

## SMOKE TEST (10 pages, smallest pillar) — prove ALL
(a) hotlinked section replaced (b) self-hosted placeholder caught+replaced (c) pHash dupe → next
(d) passing skipped zero-net (e) kill/resume zero rework (f) picker 10 graded artistic-ranked, tap
resolves+rewrites, "None" refetches (g) auto-pick out-of-scope (h) every output stamped + passes
verify (i) mv page pulls real poster via override (j) dashboard live on every panel mobile.

## ORDER OF OPERATIONS
1. Grade acceptance test (6 imgs, 3+ artistic) → sampler → operator approval.
2. Retroactive stamp sweep of images stored this run.
3. Smoke test (10 pages, all proofs) → operator "go".
4. Full run, pillar by pillar, unattended except picker queue + breaker stops.
5. After final pillar: print final image report → AUTO-CONTINUE into content scrub per
   SCRUBBER_SPEC.md (criteria 1–11 + 13; 12 re-verify only; MEDIA_COUNT_OFF fixed there; polite
   throttled source-URL checks; same batching/deploys/breaker) → run to 13/13 site-wide.
