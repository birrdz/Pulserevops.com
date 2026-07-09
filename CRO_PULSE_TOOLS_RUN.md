# CRO / PULSE TOOLS REWRITE — FULL RUN INSTRUCTIONS (LAW)

Source: owner + Fable, carried over from the old PC 2026-07-09. This file is LAW for the
fractional-CRO ("tl" pillar) location/finder rewrite. If you find a correction needed during
the run, write it INTO this file permanently (no re-coaching the same rule twice).

Companion law: `SCRUBBER_SPEC.md` (13-pt gate), `PIPELINE_TEMPLATE_LAW.md` (6 steps),
`GOLDEN_TEMPLATE_QA.md` (GENERAL template). Format specs for these entries:
`_FCRO_SPEC2.md` (CURRENT — editorial honeypot, mirror exemplar tl0101, >=1700 words, verbatim
Kory Block) and `_cro_finder_spec.md` (finder format). SPEC2 supersedes on conflicts.

## #1 GOAL (never lose sight of it)
Make EVERY entry genuinely UNIQUE while bringing it to the golden template + 13/13. Own
"fractional CRO [state/city/vertical]" search without a duplicate/doorway penalty.

## PHASE 0 — ENVIRONMENT (do first, verify before anything else)
1. Pull API keys from Netlify: `netlify login` (owner approves browser), `netlify link` to
   pulserevops.com, `netlify env:list`, then write a local `.env`. CONFIRM `.env` is gitignored
   BEFORE writing it. (Verified: `.env` + `.env.*` are in .gitignore.)
2. Read the spec files before touching any page: `SCRUBBER_SPEC.md` + this file. They are law.
3. SMOKE TEST: process ONE entry end-to-end and show the owner the result BEFORE batching.
   Do not batch until the owner has seen one good entry.

## PHASE 1 — AUDIT BEFORE REWRITE
4. Write/reuse a detector script that checks every pulse-tools entry against the gate and emits
   a failures manifest (url -> failed criteria). Validate the detector against ONE known-good and
   ONE known-bad page first — if it can't tell them apart, fix the DETECTOR, not the pages.
5. Never audit by your own judgment; the script's output is ground truth. DONE = a fresh full
   detector run returns ZERO failures. Never mark complete based on how "done" it feels.

## PHASE 2 — REWRITE RULES
6. UNIQUENESS IS A GATE CRITERION. Every entry unique in: title (title-variety pass),
   opening/direct-answer paragraph, section phrasings, examples. Enforce MECHANICALLY: after each
   batch run a similarity check across entries (shingle/n-gram overlap or embedding similarity).
   Any pair sharing >30% of sentences FAILS both — rewrite the newer. Clone-family location
   variants must differ in real substance (local specifics, different examples, phrasing) — not
   just a swapped city name. THRESHOLD: 30% is the start; loosen to 40% if too many legit
   near-matches on genuinely-similar tools flag; tighten if clone families still read samey.
7. No template stub text may render on any page. Structural check: exactly ONE Verdict/answer
   block per section, zero placeholder strings, zero visible HTML comments, zero other-pillar
   vocabulary. The old bug: a fallback block rendering ALONGSIDE authored content — a fallback
   renders ONLY when authored content is absent, never in addition.
8. Widgets (CRO Syndicate card, decision trees) inject at TEMPLATE/RENDERER level only — never
   stored in answer blobs (blobs get HTML-escaped and dump label text as plain content). Widget
   placement: between sections or designated slots, never inside an entry's content.
9. Images: Image Relevance Gate chain = Pexels -> retry -> Pixabay -> Pollinations (NO DDG),
   relevance check at each step (image-relevance-gate.js + spec). All images via
   storeGradedImage() with EXIF proof-of-grade. ONE-STRIKE TIMEOUT: a provider that times out is
   dead for the run — go straight to next step, no second 90s attempt. Reuse guard checks content
   identity (stamp matches THIS entry), not just file-exists.
   [Owner note: Pexels optional; DDG+Pollinator acceptable if Pexels key unavailable — but keep
   the relevance gate + storeGradedImage + one-strike timeout regardless.]

9b. PROVIDER THROTTLING & COOLDOWNS (mandatory — this is architecture, also encoded in
    image-relevance-gate.js, not just a per-run instruction):
    - Serial execution per provider: ONE in-flight request per provider at any time
      (per-provider mutex, same as the cardface spec). Never parallel-hit the same provider,
      even across batches or sub-agents.
    - Stagger between requests: Pexels ~1.5-2s; Pixabay ~2s; Pollinations 5-8s between
      generations (slowest + most-leaned-on — don't hammer it). Add +/-30% random jitter to
      every delay so requests don't land in a mechanical rhythm.
    - Respect provider signals: on any HTTP 429 or rate-limit header, exponential backoff
      30s -> 60s -> 120s before the next attempt to that provider. THREE consecutive 429s =
      provider dead for the run (same as one-strike timeout), fall through to next in chain.
    - Run-level budget: track requests per provider per run. Pexels free tier ~200/hour — if a
      batch will exceed a provider's budget, slow the batch, don't burn the key. Log a running
      per-provider count in the batch report.
    - Cooldown between batches: 60-90s pause after each batch of 10-15 before the next, so
      sustained runs don't look like a scraper.
    - Cache first: before ANY provider call, check the graded library (stamp-matched to THIS
      entry per rule 9). Never re-fetch an image we already legitimately hold — free headroom.

## PHASE 3 — EXECUTION DISCIPLINE
10. Batches of 10-15, single-writer registry, update after each entry passes re-check. 20%
    CIRCUIT BREAKER: if >20% of a batch fails re-check, HALT and diagnose before continuing.
    Linear, pillar order.
11. Git commit before each batch. Never claim commit/push/deploy succeeded until the verification
    command confirms it (ls-remote hash match for pushes). Large generated files stay gitignored.
12. If an approach fails, log ONE line to `attempt_log.md` and try a MATERIALLY different
    approach — never retry the same thing. 10 failures on one problem -> write `STUCK_REPORT.md`
    for it and keep going on the rest; one stuck entry never halts the run.
13. Fix causes at TEMPLATE/RENDERER/SPEC level so fixes hold for all entries — never hand-edit
    one page's output to pass.
14. PRE-DEPLOY VERIFICATION PASS before anything ships: full gate on everything touched, plus NO
    localhost/127.0.0.1/dev-port URLs anywhere in output (leaked to prod before — permanent gate).
15. Report after each batch: entries passed, entries failing, similarity-check results, anything
    logged. EVIDENCE = command output + diffs, not summaries. If output contradicts expectation,
    SAY SO — never smooth it over.

## FIRST CHECKPOINT
Show the owner `netlify env:list` (names only, not values) so we know the keys landed before
committing to anything else.

## SEO GOAL (owner 2026-07-09) — CORNER THE FRACTIONAL-CRO MARKET: nationwide + Maryland/DC
The 4,506 certified-unique fractional-CRO entries are the content moat. Max SEO via DUAL-HUB:
- NATIONAL hub = /fractional-cro. Every certified entry links up to it; it links down to top spokes.
  Intent-aware interlinking (cost<->cost, city<->city, industry<->industry, find<->find) so it reads
  as a topic silo, not a blanket mesh. Buckets: find 3543, cost 680, city 542, vs 58, industry 24.
- LOCAL hub = /fractional-cro-maryland-dc (+ /kory-white-maryland). The MD/DC + nearby-city entries
  form a tighter local sub-cluster funneling here — highest-conversion home-market intent.
- IndexNow-submit all 4,506 after deploy (fast crawl). Keyword clusters + "People also search."
- Guardrail: only works because entries are UNIQUE (gate proved it). Never interlink near-dups (doorways).
