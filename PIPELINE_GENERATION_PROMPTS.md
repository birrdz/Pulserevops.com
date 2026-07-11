# PIPELINE_GENERATION_PROMPTS.md — TWO GENERATION LAWS FOR CLAUDE CODE

One prompt per golden template. 13/13 minimum or it does not publish. Ever.

Shared law for BOTH prompts is at the bottom. Paste the relevant prompt to CC per run, or store this file in the repo root and invoke by name.

=====================================================================
## PROMPT 1 — TOP_LIST GENERATION (top-10 / best-of / ranked pages)

Generate new Q&A entries for scope: `<PILLAR/TOPIC/QUESTION LIST>`.
This run is TOP_LIST ONLY. Every question in this run has ranked/curated intent ("top N", "best", plural comparative, ranking intent). If any supplied question is NOT top-list intent, set it aside into `gen/misrouted.json` for the GENERAL run — never force it through this template.

- **TEMPLATE:** use the stored golden TOP_LIST template (`CLAUDE_CODE_GOLDEN_TEMPLATES.md`, Template A) EXACTLY as it exists in the repo. Read it fresh from disk this run. Never regenerate it from memory, never restyle it, never add/drop/reorder sections. Structure is byte-level law; content fills the slots.
- **REQUIRED STRUCTURE** (per the stored template — verify against file, this list does not replace reading it): direct-answer block first, ranked ItemList with proper schema, H2 per item, comparison/criteria section, internal links per template rules, meta title + description unique to the entry, CRO Syndicate widget injected at TEMPLATE/RENDERER level (renderer HTML-escapes blobs — never put widget markup inside the stored answer blob).
- **PROSE:** DeepSeek per pipeline convention, prose-only restriction ON — no invented pricing, statistics, tier names, or named entities; placeholder protocol + delete-not-blur for anything ungrounded.
- **IMAGE:** one cover per entry through the standard ladder (Pexels→Pixabay stock / Pollinations→AI Horde→Cloudflare→HF generated, DDG BANNED), unique prompt+seed per entry, storeGradedImage(), EXIF PULSE_GRADE=v_final, pHash unique vs registry.
- **GATE:** score with the REAL runtime gate — `auditTop10GoldTemplate()` + `rubricSignOff()` against `SCRUBBER_SPEC.md`'s 13-point rubric. 13/13 minimum. Below 13/13 → fix ONLY the failing checkpoints and rescore. Loop until 13/13. 3 failed loops → log to `gen/gen_failures.md` with entry id + failing checks and MOVE ON. Publish flag flips ONLY at 13/13. Never publish a 12.

=====================================================================
## PROMPT 2 — GENERAL GENERATION (standard Q&A pages)

Generate new Q&A entries for scope: `<PILLAR/TOPIC/QUESTION LIST>`.
This run is GENERAL ONLY. Classify each question into its subtype — YESNO / DEFINITION / PROCESS / BESTPICK — and fill the golden GENERAL template accordingly. If any supplied question is actually top-list intent, set it aside into `gen/misrouted.json` for the TOP_LIST run — never force it through this template.

- **TEMPLATE:** use the stored golden GENERAL template (`CLAUDE_CODE_GOLDEN_TEMPLATES.md`, Template B) EXACTLY as it exists in the repo. Read it fresh from disk this run. Never regenerate from memory, never restyle, never add/drop/reorder sections.
- **REQUIRED STRUCTURE** (verify against the file): direct answer in the first block (subtype-appropriate: yes/no verdict, definition, numbered process, or pick + reasoning), H2 sections per template, FAQ/related per template rules, internal links per template rules, unique meta title + description, widget at renderer level only.
- **PROSE:** DeepSeek, prose-only restriction ON, placeholder protocol, delete-not-blur. Ground every claim; no fabricated specifics.
- **IMAGE:** same ladder, same rules as Prompt 1 — unique prompt+seed, graded, stamped, pHash-unique.
- **GATE:** score with `auditQaGoldTemplate()` + `rubricSignOff()` against the 13-point rubric. 13/13 minimum, surgical-fix loop on failures, 3 strikes → log and move on. Publish ONLY at 13/13.

=====================================================================
## SHARED LAW — APPLIES TO BOTH PROMPTS, EVERY RUN

- **CLASSIFY FIRST, ALWAYS:** two template types exist. TOP_LIST intent → Template A. Everything else → Template B (default when ambiguous, log the decision). No third option, no hybrid, no creative deviation.
- **READ FROM DISK:** `CLAUDE_CODE_GOLDEN_TEMPLATES.md`, `SCRUBBER_SPEC.md`, and the audit functions are the law. If any required asset is missing, HALT and report — never rebuild from memory. (Known repo fact: the old `validate-golden.mjs` 14/14 page validator is DELETED/superseded; the per-entry gate is `auditQaGoldTemplate()`/`auditTop10GoldTemplate()` + `rubricSignOff()`. Do not resurrect the dead validator.)
- **SIMILARITY AT BIRTH:** before publishing, run each new entry through the sim scan against its topic (SIM_THRESHOLD 0.70 normalized sentence overlap). A new entry that near-dups an existing one is publish-blocked and must be differentiated per LAW-SIM-2 before it ships. Never generate tomorrow's duplicate problem.
- **EXECUTION:** serial only, single-writer registry, resume-safe lockfiles, 20% rolling circuit breaker over last 50, progress to `run_status` every 25 entries so the dashboard tracks the run. Deploy per scope on completion (commit → Netlify hook → wait ready → live rendered-DOM spot check on 5 entries per LAW-DOM) — never mid-run.
- **HONEST METRICS:** "done" = fresh gate pass counts + live-DOM spot check reported with numbers. Chat claims contradicting `run_status.json` are void. New lessons append to `LESSONS.md` and `SCRUBBER_SPEC.md` per the no-re-coaching rule.

=== END — RUN THE PROMPT MATCHING THE CONTENT TYPE, NEVER MIX ===
