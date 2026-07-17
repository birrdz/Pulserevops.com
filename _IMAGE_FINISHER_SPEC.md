# 🖼️ IMAGE FINISHER DAEMON + CURATED FALLBACK POOL — SPEC (captured 2026-07-14)

> **DO NOT BUILD YET.** Sequencing law (Fable/Kory 2026-07-14): the render-path deploy must land
> FIRST. DOM-verify is the heart of this daemon and is impossible while every `/assets/qa/*` URL
> 404s. **Deploy → DOM-verify one entry → THEN build this.** Order of operations below.

## WHY THIS EXISTS (the core insight)
Automation kept producing wrong/fake images because the old apply path had **no eyes** — it
applied-and-forgot. Manual worked only because a human looked at the result and reacted. That
verify-and-retry loop is mechanical once specced — so we code the loop, we don't pay Claude tokens
per-entry to BE the loop. "The daemon IS the manual process, running while you sleep."

Root cause of the ghost/logo the user saw (2026-07-14): render path constructs `/assets/qa/<id>.jpg`,
which 404s live (blob reader fn not serving + static-first redirect) → falls to `pulse-og.svg` (logo).
Confirmed by live fetch: `/assets/qa/ev109.jpg` → 404, `pulse-og.jpg` → 404, `pulse-og.svg` → 200.

---

## MACHINE: IMAGE FINISHER (third machine, same species as the fixer)
- **Trigger:** watches for entries tagged `images_pending` (every fixer pass + daily-driver publish
  already sets this flag). That flag IS the worklist.
- **Per entry:** run the Image Acquisition Contract (CLAUDE.md) **per the entry's golden-template type**
  (GENERAL = hero+2 · TOP_LIST = hero+10):
  concrete-noun query → 5 Pexels candidates → alt-text overlap score → pHash dedupe → `putQaAsset`.
- **MANDATORY self-verify (the eyes):** after apply, fetch the **live DOM** of the entry and confirm
  the rendered `<img src>` matches the applied image **and is NOT the SVG fallback**.
  - Pass → clear `images_pending`, write receipt (below).
  - Fail → retry with next candidate.
  - **3 strikes** → log to `sim/transform_failures.md`, leave the fallback in place tagged
    `fallback:true`, move on. **Never fake success.**
- **Runtime:** serial, capped, resume-safe, respects DS caps. Counters on the 8904 panel
  (`pending ↓` / `imaged ↑`). **No entry is ever marked imaged without DOM proof.**

### IMAGE LADDER (per slot — face cards AND top-10 items)
`factual topic-matched Pexels` → `pillar accent bucket (random)` → `architecture spine (random)` → `gray placeholder`
- **Generative rung is BANNED for face cards permanently** (that's the machine that invented the fake logo).
- Top-10 ITEM images = the real pipeline ALWAYS (each item's own text → matched photo). The fallback
  pool is the **spare tire**, not the daily wheels — emergencies only (Pexels dry / stuck pending).
- Every fallback pick is tagged `fallback:true` in the blob so a later pass can upgrade to a real match.

### 🔒 HARD-CODED FAILSAFES (built so laziness can't work — not instructions, mechanics)
The predictable AI failure mode: serial for 10–20, then "let me write a batch script to speed up" —
and the batch script skips verify, which was the whole point. Defenses:
1. **RATE LOCK** — daemon may mark **≤ 1 entry complete per 30s**. A real verify loop takes ~that long.
   Watchdog sees completions faster than the floor → **instant halt**. (50 done in 2 min = impossible
   unless verify was skipped.)
2. **RECEIPTS** — every completion MUST write a row to `sim/IMAGE_RECEIPTS.md`:
   `id · applied image URL · actual DOM-fetched src string · fetch timestamp · byte size`.
   **No receipt = not done, flag stays pending.** A script can fake a "done" flag; it cannot fake 500
   real DOM fetches. Spot-checkable: audit any 5 at random (you or a 2nd CC session).
3. **AUDIT LOOP** — every 25 completions, re-fetch **3 random already-completed** entries' live DOM.
   Any of the 3 wrong → **circuit breaker trips, run halts, red banner on 8904**. (Your 20%-breaker
   philosophy pointed backward at finished work.)

Deep reason it works: the rubric gate already proved it — machines stay honest not because told to,
but because **the system only counts work that carries proof**. Receipts + rate floor + random audit
make the lazy path *more work than the honest path* — the only incentive an AI respects at 3am on #4,000.

---

## CURATED FALLBACK POOL (the spare tire)
- **Size: 300–500 total, NOT thousands.** Safety = every image passed Kory's eyes once. Thousands →
  skimming → junk slips in → poisoned well rebuilt with extra steps.
- **Composition:** ~150–200 approved **architecture / building / interior** images = universal SPINE
  ("go with everything," timeless, Pexels is deep on them) + **10–20 pillar accents each**
  (pets→pet photos, aquariums→tanks, franchises→storefronts, etc.).
- **Selection:** pillar accent bucket first → else spine; **random with no-repeat-within-last-20-per-pillar**
  (track last N used per pillar so adjacent listing tiles don't wear the same building).
- **Storage:** `assets/fallback-pool/<pillar>/`.
- **Source: MANUAL approvals ONLY** — nothing enters programmatically (programmatic entry is exactly
  how the fake-logo bred). Kory's search list: "modern architecture," "city skyline dusk,"
  "office interior," "glass building," "business strategy meeting," "retail store," "home aquarium"…
  ✓/✗ until the spine is full. Worst case the site looks like an architecture magazine, not a glitch.
- **Approval tool:** Fable references a "Pulse Media Room (port 7801)." **NOT FOUND in repo as of
  2026-07-14** — must be located or a minimal ✓/✗ approval UI built before pool curation.

## PURGE THE POISONED POOL (do carefully, report before deleting)
pHash-match and delete **all** AI-generated fake-logo images (all copies/variants) from the library
pool. **Report the count destroyed.** (Scan + report first; deletion is destructive — confirm count
with Kory before mass-delete.)

---

## ORDER OF OPERATIONS (the only "start" left — nothing restarts; machines never stopped)
1. Purge poisoned pool + build curated fallback (needs Media Room / approval UI + Kory's eyes).
2. **Render-path deploy** (Fable's 4 items — the one daily deploy). ← unblocks everything.
3. Reconcile `_index.json` (right before the deploy; show before/after).
4. **DOM-verify ONE entry** — Kory's eyes on a live page: right photo, right count, no ghost.
5. Tell CC "open the image lane on both machines" → both do text+images going forward
   (new entries imaged at birth, fixed entries imaged during melt).
6. Backfill pass: queue an image backfill for all `images_pending` entries (same gates, same cap) —
   the finisher chews it like any other pile. Not a restart, just one more worklist.
