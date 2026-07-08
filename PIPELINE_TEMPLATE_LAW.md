# PIPELINE TEMPLATE LAW — Q&A GENERATION (CLAUDE CODE)

**Status: MANDATORY. NON-NEGOTIABLE.** Enforced on every Q&A generation task, every session.

**Location:** keep this file in repo root. Reference from `CLAUDE.md` with:
> "Read and enforce PIPELINE_TEMPLATE_LAW.md on every Q&A generation task — no exceptions."

**Companion spec:** `SCRUBBER_SPEC.md`

---

## YOUR STANDING ORDER

You (Claude Code) are the pipeline operator. For every new question that enters the Q&A
generation pipeline, you follow the six steps below **in order, every time, with zero deviation.**

You never publish anything below 13/13. You never invent a third template. You never skip
classification. **If you catch yourself about to deviate, stop and restart from Step 1.**

---

## STEP 1 — CLASSIFY (always first, always deterministic)

Classify the question into exactly **ONE of two** types:

- **TOP_LIST** — the core intent is a ranked or curated set. Signals (any one qualifies):
  "top N", "best", "top 10", "greatest", "leading", "#1", plural comparative intent
  ("best CRMs for…", "top tools to…"), or ranking intent without the word "top"
  ("which platforms should…").
- **GENERAL** — everything else.

**Rules:**
- There are only two classifications. You never output a third.
- If genuinely ambiguous, default to **GENERAL**.
- **Log the classification decision before generating anything.**

## STEP 2 — TEMPLATE SELECTION (locked mapping, no judgment calls)

- **TOP_LIST** → `GOLDEN_TEMPLATE_TOP10.md` (gold ref aq1158) + `_ranking_top10_gold_template.js`
- **GENERAL** → `GOLDEN_TEMPLATE_QA.md` (gold ref q11133) + `_qa_gold_template.js`

**Golden template law:** `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md` — read the locked spec; never edit, merge, or restyle template shape.

## STEP 3 — GENERATE

Render the answer into the selected template:
- Fill every required slot. No empty slots. No placeholder text left behind.
- **TOP_LIST:** exact item count the template specifies, ranked, every entry complete.
- **GENERAL:** direct answer first, then supporting structure exactly as the template defines.

## STEP 4 — SCORE (13-point gate, before anything ships)

Score the draft against the 13-point rubric (Google quality signals + internal rubric,
per `SCRUBBER_SPEC.md`). **Always output the full line-item breakdown.**
**Never summarize the score without the line-item breakdown.**

## STEP 5 — FIX LOOP (until 13/13, no early exit)

While score < 13:
1. List the failing checkpoints by name.
2. Fix ONLY those checkpoints. Passing content is untouchable — do not rewrite it.
3. Re-verify template structure still matches the golden template exactly after every edit.
4. Rescore with full breakdown.
5. Log the iteration number, new score, and remaining failures.

**Escalation:** if you hit **10 fix passes** without reaching 13/13, **HALT.** Flag the draft for
manual review with a summary of what won't pass and why. **DO NOT PUBLISH. DO NOT keep
looping silently.**

## STEP 6 — PUBLISH GATE

- score == 13 → publish.
- score < 13 → **never publishes. Not 12/13. Not "close enough." Ever.**

## STEP 7 — PLACEMENT (🔒 LOCKED owner 2026-07-06)

On publish, every new Q&A must land in ALL THREE surfaces, **main page first**:
1. **Recent folder** — tag the entry `pulse-recent` (the "recent" collection / `?tag=pulse-recent`).
2. **Main page first** — the entry becomes eligible for and appears on the homepage mosaic
   (`cover_src:'flux'` gold-title cover → `_gen_mosaic_pool.js` homepage pool).
3. **Then a copy in the appropriate topic** — the same entry also goes into its topic/pillar page
   (its per-pillar file `mosaic-pool-<pillar>.json`). A new question always lands under the correct
   topic pillar; if no clean topic fit, place it in the general/filler pillar.

All fed from the one published entry (no divergent copies) — recent folder + main page first, topic pillar carries the copy.

---

## HARD INVARIANTS (violating any one = pipeline bug; stop work and report it)

1. Exactly two classifications exist: `TOP_LIST` and `GENERAL`.
2. Exactly two templates exist: the two stored golden templates, untouched.
3. Classification happens BEFORE generation, every time.
4. Nothing below 13/13 publishes, under any circumstances.
5. Fix passes are surgical — failing checkpoints only.
6. Template structure survives every fix pass — re-verify after every edit.
7. Every run logs: classification, template used, score history per iteration,
   and final 13/13 proof before publish.

---

## DEFAULT WRITING TEAM (🔒 LOCKED owner 2026-07-06 — change code **4444**)

Every Q&A generation task runs with this fixed crew unless the owner changes it with passcode **4444**:

| Role | Agent | Job |
|------|-------|-----|
| **Writer** | **1 × DeepSeek** | writes the Q&A text/body |
| **Auditors** | **2 × Claude Code** | audit/score to 13/13 (surgical fix loop) |
| **Cover image** | **1 × Pollinator (flux)** | the facial image card (the OUTSIDE cover) — gold title baked |
| **Internal images** | **1 × DuckDuckGo** | in-body / section content images |

Image split is explicit: **Pollinator = the face-card COVER only; DuckDuckGo = internal body images.**
(This supersedes any "DDG↔Pollinator alternation" phrasing — covers are pollinator-only, internal are DDG.)

⚠️ **The team is only the crew (the "who"). It does NOT change the law.** Everything this team produces
still obeys the golden templates + the 6 steps + the 13/13 publish gate above — no exceptions. The team
executes the law; it never overrides it.

## GOLDEN TEMPLATE + RUBRIC LOCATIONS

**Golden template law:** `GOLDEN_TEMPLATE_TOP10.md` · `GOLDEN_TEMPLATE_QA.md`  
**Pipeline process:** `.cursor/rules/pipeline-template-law.mdc` · **Rubric:** `SCRUBBER_SPEC.md`  
**Router:** `_pulse_gold_template_router.js` · **Generate/fix:** `generateOne` / `entryScrubPipeline` in `_scrub_button_server.js`

Load code modules READ-ONLY. Golden **shape is immutable — bypass only with owner passcode 4444.** If either golden entry/code is missing or altered, HALT and report (Step 2 hard rule).

## SESSION START CHECKLIST (run before the first generation of any session)

- [ ] Confirm both golden template specs exist: `GOLDEN_TEMPLATE_TOP10.md`, `GOLDEN_TEMPLATE_QA.md`.
- [ ] Confirm the 13-point rubric definition is available (`SCRUBBER_SPEC.md`).
- [ ] Confirm logging destination for classification + score history.
- [ ] Acknowledge this law in your plan before generating the first Q&A.
