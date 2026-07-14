# SIMILARITY_MACHINE.md — STANDING ORDERS FOR CLAUDE CODE

Scope: selectable per run — one topic, one pillar, or ALL Q&As sitewide. This is permanent infrastructure. Per the NO RE-COACHING RULE, any correction issued during build or operation gets appended here and to SCRUBBER_SPEC.md.

Ask ZERO questions. Unknowns are covered by DEFAULTS. If a required asset (validate-golden.mjs, SCRUBBER_SPEC.md, golden templates, registries) is missing: HALT and report — never regenerate from memory.

Invocation: "Run SIMILARITY_MACHINE on <topic|pillar|ALL>". No scope named = HALT and ask for scope. That is the only permitted question.

## WHAT THIS IS
The machine that fixes thousands of near-identical Q&As. Three stages, always in this order, never combined:

- SCAN — deterministic similarity detection. Detect only, change nothing.
- TRIAGE — sort every entry into exactly one pile: PASS / NEAR-DUP / STUB.
- TRANSFORM — rewrite the near-dups with real differentiation, write the stubs fully, gate everything at 14/14 before it publishes. PASS pile is untouched except normal polish.

Nothing that fails the scan ever publishes as-is. That is the prime law.

## PHASE 0 — CONTEXT
Read SCRUBBER_SPEC.md, CLAUDE_CODE_GOLDEN_TEMPLATES.md, validate-golden.mjs, and existing registries/state files from prior similarity runs. Reuse prior scan state where content is unchanged (content-hash keyed cache).
Enumerate the requested scope from the registry. Report the entry count before scanning.
All standing laws apply: serial execution, single writer, 20% rolling circuit breaker (last 50 entries), resume-safe lockfile/cache state, honest-metric rule, renderer-level widget injection (never inside blobs), delete-not-blur.

## PHASE 1 — SCAN (sim_scan.js, detect only)
Method: the same sentence-overlap similarity test from the 4,949 run. Normalize (lowercase, strip location tokens/state names/city names into a LOCATION placeholder, strip numbers into NUM), then compute pairwise sentence-overlap within the scope. Two entries are NEAR-DUP partners when overlap ≥ SIM_THRESHOLD after normalization.
Group near-dups into CLONE FAMILIES: entries whose normalized bodies match are one family with one canonical member (longest/highest-quality entry). Location-variant sets ("...in North Carolina" / "...in Maryland") are the classic family.
STUB detection: body word count < STUB_MIN → STUB pile regardless of similarity.
Output:
- `sim/scan_report.json` — per entry: pile (PASS/NEAR_DUP/STUB), family id if any, overlap score, canonical flag.
- `sim/summary.json` — scope, counts per pile, family count, largest families, timestamp. Print the summary in chat: total / pass / near-dup / stub. When launched via the panel's START, proceed directly into Phase 3 — no pause, no second go.

## PHASE 2 — TRIAGE RULES
- PASS → eligible for polish + publish. No rewrite.
- NEAR-DUP → publish-blocked until transformed. Never polish a near-dup as-is; word count is not uniqueness.
- STUB → publish-blocked until fully written. Stubs are written last, after all near-dup families in the scope are cleared.

## PHASE 3 — TRANSFORM
For each clone family (serial, family by family):

Canonical first: bring the canonical entry to full golden standard — correct template type (TOP_LIST vs GENERAL), 14/14 on validate-golden.mjs, registered graded cover (unique prompt+seed, provider ladder Pexels→Pixabay stock / Pollinations→AI Horde→Cloudflare→HF generated, DDG BANNED, storeGradedImage(), EXIF PULSE_GRADE=v_final, pHash unique).

Variants get mandatory differentiators — every non-canonical family member must differ from the canonical by ALL of:
- a. Title from the approved variety patterns (no pattern >5% of the family).
- b. A location/context-specific block: at least LOC_MIN unique sentences of genuinely local or variant-specific substance (market context, local regulations/rates where applicable, region-specific examples). No mad-libs find/replace of the state name — that is the doorway-page pattern this machine exists to kill.
- c. Its own cover image (unique prompt+seed; family members may NOT share a pHash).
- d. Distinct meta title + description.

Gate: every transformed entry re-runs the FULL 14/14 gate PLUS a re-scan against its own family — post-transform overlap with any family member must be < SIM_THRESHOLD. Fail 3 attempts → log to `sim/transform_failures.md` with entry id + failing check and MOVE ON. Never stall, never ask.
Stubs: after families clear, write each stub fully per golden template, same gate, same image pipeline.
Prose provider: DeepSeek for bulk rewrite prose per existing pipeline convention; CC orchestrates and gates. One provider request at a time per provider (per-provider mutex), never two of the same provider in parallel.
Registry + state: single-writer updates to the similarity registry after each entry clears; publish flag flips ONLY on gate pass. Resume-safe: kill/restart loses nothing and never re-transforms a cleared entry.

## PHASE 4 — VERIFY (honest finish line)
"Done" for the scope = ALL of:
- Fresh full SCAN over the scope returns zero NEAR-DUP and zero STUB (minus explicitly logged 3-strike exceptions).
- Fresh validate-golden pass over every transformed entry: 14/14.
- Rendered-DOM spot check (LAW-DOM): for 5 random transformed entries, headless-render the live/built page and paste the DOM hero/card img srcs — 5 distinct registered covers. Source HTML does not count.
- Report: before/after pile counts, families cleared, entries transformed, stubs written, exceptions logged, provider failure stats. The transformer never self-certifies; only the fresh scan + gate do.

## CONTROL PANEL — THREE CONTROLS, NOTHING ELSE ON THE MAIN SCREEN
Build a LAN control panel (same pattern as the run_status dashboard: static HTML+JS, dark near-black, crimson #B91C3F / gold #FFB81C, polls `sim/run_status.json` every 5s, phone-first with big tap targets, gitignored, NEVER deployed). The machine takes orders via `sim/run_command.json`; a watcher process executes them.

The main screen is exactly:
- SCOPE — tap list of pillar → topic, plus ALL.
- START — one button. Runs the whole thing end to end for that scope: scan → triage → transform → verify. No intermediate approvals, no pile review stop, no second go. Press it and walk away.
- STOP — one button. Graceful halt at the next entry boundary. Pressing START again later RESUMES from saved state — never restarts, never re-transforms cleared entries.

Below the buttons: a progress bar, current scope/stage, and piles remaining. That's the entire operator surface.

Automated internals (no operator input, ever):
- All gates run automatically: 14/14 golden validator, post-transform family re-scan, image pipeline rules. Publish flag flips ONLY on gate pass.
- 3-strike entries auto-log to `sim/transform_failures.md` and the run moves on.
- If the 20% breaker trips, the run STOPS itself and the panel shows one line: "Stopped itself — systemic issue: <cause>. Fix, then press START to resume." That is the only situation requiring the operator, and the answer is still just the START button.
- Every START/STOP press logs to `sim/operator_log.md` with timestamp and scope.

This supersedes any earlier requirement for operator "go" between scan and transform: START is the go, for every scope including ALL.

## SELF-LEARNING & SELF-HEALING
The machine keeps its own institutional memory and repairs itself once per cause before asking for help. Not magic — a lessons ledger plus a repair playbook, applied automatically.

Self-learning (LESSONS.md):
- Maintain `sim/LESSONS.md` — an append-only ledger. Every time a fix is applied for a systemic cause, every 3-strike pattern, every provider quirk discovered, gets one entry: date, symptom, root cause, fix applied, rule going forward.
- At the start of EVERY run, read LESSONS.md in full and apply every rule before processing the first entry. The machine never re-learns the same lesson — this is the no-re-coaching rule, enforced by the machine on itself.
- When a lesson generalizes beyond this machine (renderer, image pipeline, validator), also append it to SCRUBBER_SPEC.md so every other machine inherits it.

Self-healing (one attempt per cause, then human): When the 20% breaker trips, do NOT stop immediately. Instead:
1. Diagnose: cluster the recent failures by failing check. One check dominating ≥70% of failures = a systemic cause, not bad content.
2. Match against the repair playbook and apply the fix automatically:
   - Provider errors/timeouts dominating → demote that provider in the ladder for this run, switch to next provider, add per-entry delay.
   - Image path/URL mismatches (absolute vs relative, wrong prefix) → normalize paths at the comparison point (the pulse-face-img.js lesson).
   - Validator check failing on entries that visually pass → re-render and verify on DOM per LAW-DOM before trusting the failure; if the checker is wrong, fix the CHECKER, not the pages.
   - Template misclassification cluster (TOP_LIST vs GENERAL) → fix the classifier rule, re-classify the cluster, don't rewrite content.
   - Registry/lockfile conflicts → verify single-writer, rebuild the lock state from the registry, resume.
3. Verify the heal: re-run the failed entries from the breaker window. Pass rate recovers → log the lesson to LESSONS.md, resume the run automatically, note the self-heal in run_status so the panel shows "self-healed: <cause>".
4. Escalate honestly: if the SAME cause trips the breaker twice in one run, or the diagnosis doesn't match any playbook entry, STOP. Panel shows: "Stopped — needs you: <cause>, tried <fix>, didn't hold." Never loop retries on an unfixed cause, never widen its own permissions to force progress, never touch the frozen grade, deploy config, or spec laws as a "fix." Healing means repairing the machine within its rules — a heal that requires breaking a law is an escalation, not a fix.
- Every self-heal action logs to `sim/operator_log.md` tagged AUTO, so the record distinguishes what the machine decided from what Kory ordered.

## DEFAULTS (never ask)
- SIM_THRESHOLD = 0.70 sentence overlap after normalization
- STUB_MIN = 250 words body
- LOC_MIN = 5 unique substantive sentences per variant
- Title pattern cap = 5% per pattern per family
- Breaker = 20% rolling over last 50; fix attempts = 3 then log + move on
- Progress flush = every 25 entries
- Family canonical = highest current gate score, ties → longest body

## PERMANENT LAWS (append to SCRUBBER_SPEC.md)
- LAW-SIM-1: No entry flagged NEAR-DUP or STUB may publish until it clears a fresh scan + full gate. Word count is not uniqueness.
- LAW-SIM-2: Location variants require substantive differentiators (title pattern, LOC_MIN unique sentences, own image, own meta) — never string substitution of the place name.
- LAW-SIM-3: Scope completion = fresh scan clean + fresh gate clean + rendered-DOM spot check. Transformer output alone is never proof.

=== END STANDING ORDERS — BUILD THE MACHINE, RUN PHASE 1 ON THE GIVEN SCOPE ===

## 🔒 DEPLOY LAW (permanent · 2026-07-11) — canonical: `DEPLOY_LAW.md`
1. **Classify every change first.** CONTENT/DATA (entries, bodies, images, scores, index rows) → **Blobs only, NEVER deploy**. CODE/TEMPLATE/ASSET (function, renderer, `.js`/`.css`/static, redirect) → **queue for the daily deploy**.
2. **`--prod` max ONCE/day**, end of the last machine run, and **only if the code queue is non-empty**. No queued code = no deploy that day.
3. **Draft deploys are FREE** (`netlify deploy`, no `--prod`) — test freely.
4. **Never misclassify code as content** to dodge a deploy — classify honestly.
5. **Exception:** operator says **"deploy now"** → urgent deploy allowed.
6. **Log every deploy** (date · what shipped) in `DEPLOY_LAW.md`. (This fix machine's transforms are CONTENT — Blobs only, never deploy.)
