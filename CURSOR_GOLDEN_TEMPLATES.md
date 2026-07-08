# Cursor Agent — Golden Template Execution Spec

Execution spec for Cursor (Agent mode). Same rules as the Claude Code version, adapted for how Cursor works. This file is complete and self-contained. Do not ask the user any questions. Every decision is pre-made. If something is not covered, apply the DEFAULTS table, log the assumption to logs/golden-template-assumptions.md, and keep going.

## Purpose

Every new/edited Q&A entry on `pulserevops.com` must be **exactly one** of two immutable shapes (Top 10 ranking list or Q&A essay). This doc is the **single entry point** a Cursor Agent reads first, so it never has to ask the user "which template?" or "what's the word floor?" — those answers are DEFAULTS below, sourced from the two golden specs.

## HOW TO RUN THIS IN CURSOR

### Cursor setup

1. Open Cursor → **Agent mode** (Composer), not **Ask**.
2. Enable **auto-run for terminal commands** so `node validate-golden.mjs` runs without approval prompts — **Cursor Settings → Composer/Agent → auto-run**.
3. Open repo: `C:\Users\koryj\website`.

### Start prompts (copy-paste)

**First session:**

```
@CURSOR_GOLDEN_TEMPLATES.md Execute this spec. Start with Phase 0.
```

**New / resumed session:**

```
@CURSOR_GOLDEN_TEMPLATES.md @.cursor/rules/pipeline-template-law.mdc PHASE 0 — DISCOVERY (before anything else)
```

### Session discipline

Cursor handles long runs less gracefully than a CLI agent — work one pillar per Agent session (see DEFAULTS: **Long batch requested**).

### Session handoff

At the end of each session, write progress to [`logs/golden-template-run.md`](logs/golden-template-run.md) so the next session resumes from the log, not from memory. Start each new session with the **New / resumed session** prompt above, then run [PHASE 0 — DISCOVERY](#phase-0--discovery-before-anything-else) (before anything else). Use the session block template in that log file; update **Current state** every session end.

### Key files in repo

| File | Role |
|------|------|
| [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) | This execution spec (read first) |
| [`logs/golden-template-run.md`](logs/golden-template-run.md) | Session handoff log — resume source between sessions |
| [`validate-golden.mjs`](validate-golden.mjs) | Spec-doc structural linter |
| [`.cursor/rules/golden-templates.mdc`](.cursor/rules/golden-templates.mdc) | Cursor always-on pointer rule |

Also read [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) and [`.cursor/rules/visual-lock-law.mdc`](.cursor/rules/visual-lock-law.mdc) explicitly each session (both `alwaysApply: true`).

### Execution checklist (phases in order)

1. **Phase 0 → Phase 1 → Phase 2–7** — do not skip Phase 0 or Phase 1.
2. **Classify** — call `pickGoldTemplate(id, body, title)` from `_pulse_gold_template_router.js` **before writing anything**; lock `template`, `goldId`, `goldUrl`, `reason`; never switch mid-run.
3. **Seed + generate** — load the locked golden outline (`QA_TEMPLATE_OUTLINE` / `TOP10_TEMPLATE_OUTLINE`); canonical path: `generateOne` → `seedWrite` → `fixEntry` in `_scrub_button_server.js`.
4. **Score + surgically fix** — `entryScrubPipeline` / `gradeEntry` + `rubricSignOff` + gold audit (`auditQaGoldTemplate` / `auditTop10GoldTemplate`); fix failing checkpoints only; re-verify gold structure after every edit.
5. **Do not ask the user mid-run** — apply the matching DEFAULT below; log assumptions to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md).

### Validation + publish gate

Whenever you touch `GOLDEN_TEMPLATE_QA.md` / `GOLDEN_TEMPLATE_TOP10.md`:

```bash
node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md
```

**No commit below 13/13** on entry rubric + gold audit + §6/§7 checklist, or on spec-doc validation. Full gate detail: [Validation gate](#validation-gate).

---

## Sole sources of truth (after Phase 1 — read these three for law)

| Template | Spec | Gold ref | Live URL | §N gate |
|----------|------|----------|----------|---------|
| **Top 10 ranking list** (listicle-intent, any pillar) | [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | `aq1158` | https://pulserevops.com/aquariums/aq1158 | **§7 QUALITY GATE** — 18-row Pass condition table + 20-item checklist |
| **Q&A essay** (single-question) | [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | `q11133` | https://pulserevops.com/knowledge/q11133 | **§6 QUALITY GATE** — 18-row Pass condition table + 19-item checklist |

Each file owns: detection, page structure, CRO (§0.1), schema, HTML skeleton, rendering, image sourcing, the quality gate, and Compliance (word floor, visual lock). **After Phase 1 supersession**, shape law lives only in the two golden specs above plus this execution file — prior drafts are void; do not merge legacy content, only pointers.

**Phased execution (every session, in order — do not skip):**

| Phase | Name | Section |
|-------|------|---------|
| **0** | Discovery | [PHASE 0](#phase-0--discovery-before-anything-else) |
| **1** | Supersession (destructive, no confirmation) | [PHASE 1](#phase-1--supersession-destructive-no-confirmation) |
| **2** | Classify | [PHASE 2](#phase-2--classify-before-generate) |
| **3** | Seed | [Pipeline Phase 3](#pipeline-steps--phases-27-in-order) |
| **4** | Generate | [Pipeline Phase 4](#pipeline-steps--phases-27-in-order) |
| **5** | Score + surgical fix | [Pipeline Phase 5](#pipeline-steps--phases-27-in-order) |
| **6** | Validate | [Validation gate](#validation-gate) |
| **7** | 13/13 publish gate | [Pipeline Phase 7](#pipeline-steps--phases-27-in-order) |

---

## PHASE 0 — DISCOVERY (before anything else)

Run **every** Phase 0 item before Phase 1 supersession, classify, seed, or draft. Aligns with the **read-first context** in **§0 SUPERSESSION + CONTEXT** ([`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) · [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md)) — Phase 0 reads; Phase 1 purges conflicting material.

**Session resume:** New / resumed sessions start with the [New / resumed session](#start-prompts-copy-paste) prompt per [Session handoff](#session-handoff) — read [`logs/golden-template-run.md`](logs/golden-template-run.md) first; resume from the log, not chat memory.

**Owner dictation (verbatim):** Read [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) and prior logs/notes in the repo (`logs/`, `docs/`, root `*.md`). Honor: the **13-point content gate**, **image grading pipeline** (`storeGradedImage()`, pHash dedup, EXIF proof-of-grade), and the **renderer constraint**: stored answer blobs are HTML-escaped — widget/ad markup must be injected by the page template/renderer, never stored in answer content.

### 0.1 Read specs + prior logs

- [ ] [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) — Pass 1 (13-point rubric), IMAGE STANDARD (criterion 12), DEDUPE (pHash registry), GENERATION PIPELINE publish gate, EXECUTION PLAN
- [ ] Prior logs — [`logs/golden-template-run.md`](logs/golden-template-run.md) ([Session handoff](#session-handoff); resume source — not chat memory; use session block template), [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md) (locked decisions), [`logs/golden-template-supersession.md`](logs/golden-template-supersession.md) (Phase 1 deletion audit)
- [ ] Root handoffs / notes — [`_CROSSOVER.md`](_CROSSOVER.md), [`_CROSSOVER_IMAGE.md`](_CROSSOVER_IMAGE.md), [`PIPELINE_TEMPLATE_LAW.md`](PIPELINE_TEMPLATE_LAW.md), [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md) (pointers only — shape law lives in the two golden specs)
- [ ] Locked template spec for the task (Template A/B quick refs below → full canonical MD)
- [ ] Cursor rules — [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc), [`.cursor/rules/visual-lock-law.mdc`](.cursor/rules/visual-lock-law.mdc)

### 0.2 Honor mandatory laws (before any draft)

Three non-negotiable laws govern every golden-template session. Cross-ref [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) (rubric + images) and [`.cursor/rules/visual-lock-law.mdc`](.cursor/rules/visual-lock-law.mdc) (writer/image/render split).

#### 0.2.1 — 13-point content gate

Publish **only at 13/13** — not 12/13, not "close enough." Generator and scrubber share one rubric (`entryScrubPipeline` + `rubricSignOff` + `gradeEntry()`).

| # | Criterion | Phase 0 note |
|---|-----------|--------------|
| 1 | WORD COUNT | ≥2,000 words real content (golden pages: per-type floors in golden specs — Q&A ≥600/≥800, Top 10 ≥800) |
| 2 | DIRECT ANSWER | At top, before anything else |
| 3 | DIRECT ANSWER COMPLETE | Self-contained, not a stub |
| 4 | FAQ | ≥5 relevant pairs |
| 5 | MERMAID DIAGRAMS | Exactly 2 |
| 6 | MERMAID CLEAN | Valid syntax, renders |
| 7 | SOURCES | ≥5 real, verifiable (HTTP 200/301) |
| 8 | RELATED ON PULSE | Section present |
| 9 | CLEAN LINKS | No broken/placeholder links |
| 10 | IMAGES PRESENT | Per golden-template type law |
| 11 | MEDIA COUNT | 3–10 images (golden pages: per-type counts in golden specs) |
| 12 | IMAGES LAW | Image Standard + `storeGradedImage()` choke point |
| 13 | NO FABRICATION | Zero invented vendors/stats/quotes |

- [ ] **13-point content gate** — full rubric read in [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) Pass 1; scoring path acknowledged: `gradeEntry()` in `netlify/functions/lib/grade-entry.js` → `entryScrubPipeline` / `rubricSignOff` in `_scrub_button_server.js`
- [ ] Publish gate acknowledged — **13/13 + IMAGE_PASS** only; HOLD queue for failures; `maxRounds: 6` surgical fix loop

#### 0.2.2 — Image grading pipeline

Every image file written to disk passes **`storeGradedImage()`** — the sole choke point. No bypass, no raw JPG copies into `/assets/qa/`.

| Step | Law | Module / artifact |
|------|-----|-------------------|
| **Write choke point** | `storeGradedImage(rawBuf, destPath, opts)` — grades from RAW via `applyCineGrade()`, self-hosts to `/assets/qa/` | [`_ddg_facecard_lib.js`](_ddg_facecard_lib.js) (definition + export) |
| **EXIF proof-of-grade** | Every stored file carries `ImageDescription: PULSE_GRADE=v_final` (`GRADE_STAMP`); verify with `verifyGradeStamp()` | `_ddg_facecard_lib.js` · retroactive sweep: `_grade_stamp_sweep.js` |
| **pHash dedup** | dHash 64-bit on **raw** download (before grade); Hamming ≤8 (`REG_HAMMING`) = duplicate; registry `_img_registry.json` via `regAdd()` / `regBlocked()` | `_ddg_facecard_lib.js` · [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) DEDUPE |
| **Dedup scope** | Same-page hard-block; same-pillar block; cross-pillar max 2 site-wide; on hit → next candidate, not page fail | `sweepTop10DuplicateImages()` · `countBodyImageDupes()` · `sweepPageDuplicateImages()` |
| **Provider alternation** | DDG ↔ Pollinator strict alternation; **15s floor** (`FLOOR_MS` / `waitForProvider()`) | [`_image_provider_alternate.js`](_image_provider_alternate.js) |
| **Slot routing** | Covers, sections, rank `@@PRODUCT img=`, pool imports, batch staging | `ensureAlternateFaceCover()` · `ensureAlternateSectionImage()` · `fillEntryMissingImages()` · `repairBrokenQaImages()` in `_ddg_facecard_lib.js` |
| **Consumers** (all import `storeGradedImage` from `_ddg_facecard_lib.js`) | Pool import, flux rewrite, picker preview, gallery scripts | `_img_flux_lib.js` · `_img_flux_rewrite_lib.js` · `_image_picker_lib.js` · `_all_flux_facecards.js` · `_import_pool_grid.js` · `_import_pool_files.js` · `_import_cro_pool_grid.js` · `_apply_cat_reference_covers.js` · pillar-pool rule: [`.cursor/rules/pillar-pool-images.mdc`](.cursor/rules/pillar-pool-images.mdc) |
| **Visual lock** | Image pipeline may **swap** at existing slots only — same count, same rhythm; no live `pollinations.ai` in blobs | [`.cursor/rules/visual-lock-law.mdc`](.cursor/rules/visual-lock-law.mdc) · `_visual_lock_law.js` → `enforceWriterVisualLock()` |

- [ ] **Image grading pipeline** — `storeGradedImage()` choke point + `verifyGradeStamp()` EXIF proof acknowledged
- [ ] **pHash dedup** — hash-before-grade, `_img_registry.json`, `REG_HAMMING = 8` acknowledged
- [ ] **Self-host only** — persisted blob paths under `/assets/qa/…`; no live DDG/Pollinator hotlinks in answer content

#### 0.2.3 — Renderer constraint (HTML-escaped blobs)

Answer blobs store **markdown + text only** (`entry.answer`). The server renderer HTML-escapes all prose via `escHtml()` / `renderMd()` in [`netlify/functions/pulse-machine-entry.js`](netlify/functions/pulse-machine-entry.js). Widget/ad markup stored in blobs would render as escaped text — **never bake it in**.

| Render-time inject only | Module | Never in blob |
|-------------------------|--------|---------------|
| Gold `direct-answer-box` | `wrapDirectAnswerGold()` | HTML class wrappers |
| CRO Syndicate card | `insertCroAd()` → `croAdCard()` / `croMobileCard()` | `stripBlobCro()` / `_cro_strip_lib.js` strips baked CRO on save/render |
| JSON-LD `@graph` | `pulse-machine-entry.js` `<head>` emit | No `<script type="application/ld+json">` in markdown |
| Image `onerror` fallback | `entryImgAttrs()` | Writers never emit handlers in blobs |
| Page chrome / badges | Renderer template string | — |

Cross-ref [`.cursor/rules/visual-lock-law.mdc`](.cursor/rules/visual-lock-law.mdc): writers touch **prose only**; renderer + `assets/pulse-tan.css` own all visuals; CRO injected at render — never in blob.

- [ ] **Renderer constraint** — stored answer blobs are HTML-escaped; widget/ad/CRO/schema markup injected by `pulse-machine-entry.js` only
- [ ] **Visual lock** — writers must not add/edit images, `@@PRODUCT`, HTML, `<aside>`, inline styles, or CRO cards ([`_visual_lock_law.js`](_visual_lock_law.js))

### 0.3 Phase 0 pass condition

- [ ] [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) + prior logs/notes read (`logs/`, root `*.md`)
- [ ] Three mandatory laws honored (§0.2.1–0.2.3) — 13-point gate, image pipeline, renderer constraint
- [ ] Module paths confirmed: `storeGradedImage` → `_ddg_facecard_lib.js`; grade → `grade-entry.js`; render → `pulse-machine-entry.js`; visual lock → `_visual_lock_law.js`
- [ ] Log paths confirmed for [Session handoff](#session-handoff) + assumptions ([Session discipline](#session-discipline): one pillar per session)

**Only then** proceed to **Phase 1 — Supersession**.

---

## PHASE 1 — SUPERSESSION (destructive, no confirmation)

> **Spec-only default:** This section defines delete rules and a known-targets inventory. **Do not execute deletes** during spec/read passes unless the owner explicitly requests Phase 1 execution in the same session. When executing: **destructive, no confirmation** — agent acts without asking the user.

Run **every** Phase 1 item after Phase 0 and **before** Phase 2 classify. Aligns with **§0 SUPERSESSION + CONTEXT** in [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) and [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md).

**Never merge.** When old golden-template rules conflict with the §1.3 trio, **delete** them — do not fold legacy bullets, sections, or `.mdc` rules into canonical files.

### 1.1 Execution mode

- **Conflicting old rules lose** — **deleted, never merged** into canonical files. Do not fold legacy bullets into `GOLDEN_TEMPLATE_*.md`, `golden-templates.mdc`, or handoffs.
- Log judgment calls to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md).
- Session handoff progress stays in [`logs/golden-template-run.md`](logs/golden-template-run.md) — **not** the deletion audit.

### Delete ALL prior golden-template material in the repo:

Duplicate shape law, stale drafts, orphaned partials, and conflicting rules must go. Only the §1.3 trio (+ logs + protected code/rules) survives.

**Owner dictation (verbatim):** Files matching `golden*template*`, `GOLDEN_*`, `*golden*.md` — **except** [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) (this file), [`validate-golden.mjs`](validate-golden.mjs), and [`.cursor/rules/golden-templates.mdc`](.cursor/rules/golden-templates.mdc).

**One-line pointer** (use when replacing embedded section bodies — keep the host doc):

> See [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md), [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md), [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md)

#### File globs and exceptions

Search the full repo with these globs (exclude `node_modules/`, `_site_deploy/`, `.netlify/`, `derby/assets/`, `lab/`). **Delete** every whole-file match unless listed in **KEEP — never delete** below.

| Glob | Intent |
|------|--------|
| `**/*golden*template*` | Filename contains `golden` + `template` (case-insensitive) — drafts, duplicates; utility scripts are **not** shape law |
| `**/GOLDEN_*` | Filename starts with `GOLDEN_` — prior draft specs |
| `**/*golden*.md` | Any `.md` filename containing `golden` |

**KEEP — never delete (owner except, verbatim):**

| Path | Role |
|------|------|
| [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) | This execution spec |
| [`validate-golden.mjs`](validate-golden.mjs) | Spec-doc structural linter |
| [`.cursor/rules/golden-templates.mdc`](.cursor/rules/golden-templates.mdc) | Cursor always-on pointer rule |

**KEEP — never delete (explicit, prior session):**

| Path | Role |
|------|------|
| [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | Top 10 shape law (canonical) |
| [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | Q&A shape law (canonical) |
| [`_qa_gold_template.js`](_qa_gold_template.js) | Q&A outline + audit |
| [`_ranking_top10_gold_template.js`](_ranking_top10_gold_template.js) | Top 10 outline + audit |
| [`_pulse_gold_template_router.js`](_pulse_gold_template_router.js) | `pickGoldTemplate` |
| [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) | Pipeline process law |
| [`.cursor/rules/qa-gold-template.mdc`](.cursor/rules/qa-gold-template.mdc) | Q&A gold pointer rule |
| [`.cursor/rules/ranking-top10-gold-template.mdc`](.cursor/rules/ranking-top10-gold-template.mdc) | Top 10 gold pointer rule |

**Also keep (operational — not shape law):**

| Path | Role |
|------|------|
| `logs/golden-template-*.md` | Run, assumptions, supersession logs |
| [`_send_golden_templates_email.js`](_send_golden_templates_email.js) | Utility email script |
| [`_send_gold_templates_email.js`](_send_gold_templates_email.js) | Utility email script |
| [`_count_aq_gold_templates.js`](_count_aq_gold_templates.js) | Utility counter script |

**DELETE targets (whole-file — repo scan 2026-07-06):**

| Path | Action | Notes |
|------|--------|-------|
| [`.cursor/GOLDEN_TEMPLATES.md`](.cursor/GOLDEN_TEMPLATES.md) | **Replace** pointer-only stub (or delete if redundant) | Sole glob match requiring file-level action. Must contain only the one-line pointer block — no embedded shape law. As of 2026-07-06: already pointer-only — verify each Phase 1 run. |

No other whole-file delete targets match the three globs as of 2026-07-06. Code modules and `.mdc` pointer rules above do **not** match `golden*template*` / `GOLDEN_*` / `*golden*.md` filename patterns (except those already in KEEP).

#### Embedded sections — surgical removal

Golden-template **shape law** must not live inside rubric, handoff, or agent-entry docs. When grep finds an embedded block, **remove the block body** and leave **one** pointer line (above). **Keep the host file.** **Never merge** removed text into canonical files.

| Host scope | Action |
|------------|--------|
| [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) | **Keep:** 13-point rubric, IMAGE STANDARD, DEDUPE, GENERATION PIPELINE publish gate, EXECUTION PLAN. **Remove:** duplicate shape law — inline golden-page overrides on criteria 10–11, duplicate template structure, conflicting word floors (e.g. 2,000-word mandate on golden pages), duplicate §7/§6 checklists, embedded detection/router tables. **Replace** removed blocks with one-line pointer. |
| [`AGENTS.md`](AGENTS.md) | **Remove:** embedded GOAT shape tables, §7/§6 gate restatements, detection/router copy, duplicate module maps. **Keep:** one-line agent entry + pointer to this file. |
| [`CLAUDE.md`](CLAUDE.md) | **Remove:** embedded golden-template pipeline steps, classification prose, duplicate "two templates only" law. **Keep:** brief pointer to [`PIPELINE_TEMPLATE_LAW.md`](PIPELINE_TEMPLATE_LAW.md) process + one-line shape pointer. |
| [`_CROSSOVER.md`](_CROSSOVER.md) | **Remove:** duplicate golden-template law blocks (tables, router trees, shape checklists); stale notes e.g. "Missing top hero on Q&A" (~L56). **Keep:** session handoff, deploy, batch status, PIDs, timestamps. |
| [`PIPELINE_TEMPLATE_LAW.md`](PIPELINE_TEMPLATE_LAW.md) | **Remove:** embedded TOP_LIST/GENERAL classification prose, template-selection steps, duplicate golden shape sections. **Keep:** pipeline process pointer to `.cursor/rules/pipeline-template-law.mdc` + one-line shape pointer. |
| [`docs/`](docs/) | **Remove:** any embedded golden-template shape blocks. **Keep:** unrelated docs. (`docs/` — no matches at 2026-07-06 grep; re-grep each Phase 1 run.) |
| [`.cursor/`](.cursor/) | **Surgical trim only:** any `.mdc` that pastes §2 structure, detection regex tables, or §6/§7 gate rows — replace block with one-line pointer. **Protected (never delete):** [`golden-templates.mdc`](.cursor/rules/golden-templates.mdc), [`pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc), [`qa-gold-template.mdc`](.cursor/rules/qa-gold-template.mdc), [`ranking-top10-gold-template.mdc`](.cursor/rules/ranking-top10-gold-template.mdc). Other pointer-only rules (e.g. `pulse-template-selection.mdc`, `listicle-intent-top10.mdc`) — keep if pointer-only; trim embedded shape law only. |

**Do not merge:** removed embedded bullets, old checklists, or legacy shape law into `GOLDEN_TEMPLATE_TOP10.md`, `GOLDEN_TEMPLATE_QA.md`, `CURSOR_GOLDEN_TEMPLATES.md`, or `golden-templates.mdc`. Conflicting material is **deleted**, not folded in.

#### Orphaned partials

After deleting or replacing golden-template files:

1. Read deleted-file contents (or `git log` / `git show` if already deleted) for relative links, `@include`, `require(`, markdown `[text](path)` references.
2. Search for `.md` fragments, `.html` snippets, template blocks, duplicate § copies, stale HTML `<article>` skeletons in docs.
3. **Delete** partials with **no remaining references** anywhere in the repo (grep basename + path).
4. **Keep** partials still referenced by protected code or the §1.3 trio — e.g. [`components/cro-card.html`](components/cro-card.html) (CRO rebuild reference; pointer comments only).
5. Log each orphan deleted to [`logs/golden-template-supersession.md`](logs/golden-template-supersession.md).

Likely orphan candidates to verify on execution (inventory only — none confirmed orphaned yet):

| Candidate | Referenced by | Notes |
|-----------|---------------|-------|
| *(none confirmed)* | — | Re-scan after whole-file deletes; `.cursor/GOLDEN_TEMPLATES.md` already pointer stub |

#### Supersession log

Append **one row per deletion or replacement** to [`logs/golden-template-supersession.md`](logs/golden-template-supersession.md):

| Column | Content |
|--------|---------|
| `timestamp` | ISO local time |
| `action` | `deleted` · `replaced-stub` · `embedded-section-removed` · `orphan-deleted` · `verify-clean` |
| `path` | Repo-relative path |
| `notes` | What conflict was removed; pointer inserted; git ref if recovered from history |

**Do not** log deletions to [`logs/golden-template-run.md`](logs/golden-template-run.md) — that file is session progress / handoff only.

Repeat sessions: re-run globs; if already clean, append one `verify-clean` row (`Phase 1 verify — no conflicts`) and proceed.

#### Known targets (repo scan 2026-07-06)

Full-repo search for `golden*template*`, `GOLDEN_*`, `*golden*.md` (excluding `node_modules/`, `_site_deploy/`, `.netlify/`, `derby/assets/`, `lab/`). Re-run globs each Phase 1 session; update this table when new matches appear.

| Path | Pattern(s) | Disposition |
|------|------------|-------------|
| [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) | `golden*template*` · `*golden*.md` | **KEEP** — owner except |
| [`validate-golden.mjs`](validate-golden.mjs) | (no glob match; owner except) | **KEEP** — owner except |
| [`.cursor/rules/golden-templates.mdc`](.cursor/rules/golden-templates.mdc) | `golden*template*` | **KEEP** — owner except |
| [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | all three | **KEEP** — explicit |
| [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | all three | **KEEP** — explicit |
| [`logs/golden-template-run.md`](logs/golden-template-run.md) | `golden*template*` · `*golden*.md` | **KEEP** — operational log |
| [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md) | `golden*template*` · `*golden*.md` | **KEEP** — operational log |
| [`logs/golden-template-supersession.md`](logs/golden-template-supersession.md) | `golden*template*` · `*golden*.md` | **KEEP** — Phase 1 audit log |
| [`_send_golden_templates_email.js`](_send_golden_templates_email.js) | `golden*template*` | **KEEP** — utility (not shape law) |
| [`.cursor/GOLDEN_TEMPLATES.md`](.cursor/GOLDEN_TEMPLATES.md) | `GOLDEN_*` · `*golden*.md` | **DELETE / replace** — pointer-only stub only (see DELETE targets above) |
| [`_qa_gold_template.js`](_qa_gold_template.js) | (no glob match) | **KEEP** — explicit code module |
| [`_ranking_top10_gold_template.js`](_ranking_top10_gold_template.js) | (no glob match) | **KEEP** — explicit code module |
| [`_pulse_gold_template_router.js`](_pulse_gold_template_router.js) | (no glob match) | **KEEP** — explicit code module |
| [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) | (no glob match) | **KEEP** — explicit |
| [`.cursor/rules/qa-gold-template.mdc`](.cursor/rules/qa-gold-template.mdc) | (no glob match) | **KEEP** — explicit |
| [`.cursor/rules/ranking-top10-gold-template.mdc`](.cursor/rules/ranking-top10-gold-template.mdc) | (no glob match) | **KEEP** — explicit |
| [`_send_gold_templates_email.js`](_send_gold_templates_email.js) | (no glob match) | **KEEP** — utility |
| [`_count_aq_gold_templates.js`](_count_aq_gold_templates.js) | (no glob match) | **KEEP** — utility |
| [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) | embedded shape blocks | **SURGICAL** — trim to pointer; keep rubric + image standard |
| [`AGENTS.md`](AGENTS.md) | embedded GOAT block | **SURGICAL** — collapse to entry pointer |
| [`CLAUDE.md`](CLAUDE.md) | golden-template bullets | **SURGICAL** — pointer only |
| [`_CROSSOVER.md`](_CROSSOVER.md) | shape blocks | **SURGICAL** — keep handoff/batch rows |
| [`PIPELINE_TEMPLATE_LAW.md`](PIPELINE_TEMPLATE_LAW.md) | TOP_LIST/GENERAL classification | **SURGICAL** — process pointer only |
| [`PROGRESS.md`](PROGRESS.md) | — | **VERIFY** on execution |
| [`docs/`](docs/) | — | None found 2026-07-06 |

**Superseded material** (non-exhaustive — see §0 in both template specs): prior `GOLDEN_TEMPLATE_*.md` drafts, HTML `<article>` skeletons in docs, 14/14 `validate-golden.mjs` gate references, pre-2026-07 top-hero law, 2,000-word floors on golden pages, stale crossover/batch notes with conflicting shape law. **Code wins over live quirks** — bypass shape only with owner passcode **4444** (log in assumptions).

### 1.3 Sole sources of truth (after Phase 1)

**ONLY** these three markdown files own golden-template law:

| File | Owns |
|------|------|
| [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | Top 10 / listicle-intent shape, §7 gate, CRO §0.1, schema, images (`aq1158`) |
| [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | Q&A essay shape, §6 gate, CRO §0.1, schema, images (`q11133`) |
| [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) | Phased execution, defaults, assumption/run logging |

No other golden-template markdown is authoritative.

### 1.4 Phase 1 pass condition

- [ ] Repo search complete (File globs); all **Known targets** handled (deleted, pointer-only stub, or embedded section → one-line pointer; no merges into canonical files).
- [ ] No duplicate golden-template markdown outside §1.3 trio (+ `logs/golden-template-*.md`).
- [ ] Orphaned partials removed; protected `.cursor/rules/` pointer rules untouched (`golden-templates.mdc`, `pipeline-template-law.mdc`, `qa-gold-template.mdc`, `ranking-top10-gold-template.mdc`).
- [ ] KEEP list (owner except + explicit) + code modules untouched.
- [ ] Every deletion/replacement logged to [`logs/golden-template-supersession.md`](logs/golden-template-supersession.md).
- [ ] Judgment calls logged to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md).

**Repeat sessions:** re-run §1.2 globs; if already clean, append `Phase 1 verify — no conflicts` to supersession log and proceed. **Only then** proceed to **Phase 2 — Classify**.

---

## PHASE 2 — CLASSIFY (before generate)

**Prerequisites:** Phase 0 complete · Phase 1 complete (or verified clean).

**Never generate, fix, audit, or publish before calling the router.** Classification is deterministic — there is nothing to ask the user.

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

const route = pickGoldTemplate(id, body, title);
// route.template → 'top10' | 'qa' — lock before draft; never switch mid-run
// route.goldId, route.goldUrl, route.reason also returned — log all four
```

| Code module | Role |
|-------------|------|
| `_pulse_gold_template_router.js` | `pickGoldTemplate(id, body, title)` — classification |
| `_ranking_top10_gold_template.js` | Top 10 outline (`TOP10_TEMPLATE_OUTLINE`) + `auditTop10GoldTemplate` |
| `_qa_gold_template.js` | Q&A outline (`QA_TEMPLATE_OUTLINE`) + `auditQaGoldTemplate` |
| `_scrub_button_server.js` | `generateOne`, `entryScrubPipeline`, `rubricSignOff` |
| `grade-entry.js` | `gradeEntry()` — 13-point content rubric |

**Body shape wins over title** — an essay Q&A locks `qa` even when the title says "best/top 10"; a ranked `## N.` + `@@PRODUCT` body locks `top10` even off-pillar.

---

## TEMPLATE A — TOP-10 / BEST-OF PAGES

| | |
|--|--|
| **Gold reference** | `aq1158` — [https://pulserevops.com/aquariums/aq1158](https://pulserevops.com/aquariums/aq1158) |
| **Code** | [`_ranking_top10_gold_template.js`](_ranking_top10_gold_template.js) — `TOP10_TEMPLATE_OUTLINE`, `TOP10_SECTION_ORDER`, `auditTop10GoldTemplate()` |
| **Router** | `pickGoldTemplate(id, body, title)` → **`template: 'top10'`**, `goldId: 'aq1158'` — lock before draft; never switch mid-run |
| **Full spec** | [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) — shape, CRO §0.1, schema, images, §7 gate (**do not duplicate entire doc here**) |

### A1. Detection

Read **`GOLDEN_TEMPLATE_TOP10.md` §1 DETECTION** and **`_pulse_gold_template_router.js`**. Deep dive §1.1 N mapping: [`GOLDEN_TEMPLATE_TOP10.md` §1.1](GOLDEN_TEMPLATE_TOP10.md#11-extract-n-ranked-item-count).

**Apply when** slug/title/query matches **listicle-intent** — ranked `## N.` product sections + rank markers — on **any pillar** (`/aquariums/`, `/software/`, `/cars/`, `/knowledge/` if mis-seeded, etc.). Slug/tags/hub path are **soft seed hints**; router classifies from **`id + body + title` only** (`pickGoldTemplate`). Pipeline passes `entry.question` as `title`. Title/query signals alone are **never sufficient** — must also pass `isRankingListBody(body, title)` (router step 1) or body-only ranking markers (step 2).

**Router truth:** always call `pickGoldTemplate` before generate/fix; **body shape wins over title** when they disagree.

**Extract N.** If both A and B match, **A wins** — `rankCountFromTitle(title)` in `_ranking_list_master_law.js` evaluates patterns in order (A = explicit number; B = `best of` / `the best`). **Default N = 10** for `best of` with no explicit number ([DEFAULTS](#defaults-table-use-instead-of-asking)).

#### Regex

Synced from **`GOLDEN_TEMPLATE_TOP10.md` §1 DETECTION → Regex`**. **Code source of truth:** `_pulse_gold_template_router.js` (`pickGoldTemplate` steps 1–2) + `_ranking_list_master_law.js` (`titleSuggestsRankingList`, `isRankingListBody`, `rankCountFromTitle`, `expectedRankCount`). **Code wins** on conflict; **SPEC** lines are agent/seed hints not yet in `TITLE_RANKING_PATTERNS`.

**Title input:** `entry.question` / explicit `title` arg, or `# H1` via `entryTitle(body)` → `/^#\s+(.+)$/m`.

**Entry ID / slug / URL context** — soft seed hints only; router lowercases `id` for Q&A fallback; **does not** select Top 10 alone:

```javascript
// Router normalize — NOT a Top 10 trigger by itself
const entryId = String(id || '').toLowerCase();

// Dual-mode ID — same prefix can be Top 10 OR Q&A (_qa_gold_template.js pillarIsQa)
const DUAL_MODE_ID = /^([a-z]+)\d+$/i;
// capture[1] ∈ q, cg, tk, pt, sw, ai, aq, tl, tc, ga, gm

// Q-only knowledge IDs — default Q&A unless isRankingListBody(body)
const Q_ONLY_ID = /^q\d+$/i;

// Publish tags / topic slug hints (metadata only — pickGoldTemplate ignores today)
const LISTICLE_TAG_HINT = /\b(?:top-10|best-of-\d{4})\b/i;
const TOPIC_SLUG_HINT = /(?:^|-)(?:top-10|top-\d+|best-|.*-ranked|.*-rankings)(?:-|$)/i;

// H1 fallback when title arg omitted
const ENTRY_H1 = /^#\s+(.+)$/m;
```

| ID / slug signal (case-insensitive) | Examples | Notes |
|-------------------------------------|----------|-------|
| Topic slug *(publish metadata)* | `top-10`, `top-\d+`, `best-*`, `*-ranked*` | Sprint seeds; **not** read by `pickGoldTemplate` |
| Entry tags | `top-10`, `best-of-2027` | Correlates with listicle intent; router ignores |
| Dual-mode pillar ID | `aq####`, `tl####`, `sw####`, … | Top 10 **or** Q&A — body shape decides |
| Q-only ID `q####` | `/knowledge/q11133` | Default Q&A unless `isRankingListBody(body)` |
| Listicle-only pillar | `er####` | Almost always ranking lists — still verify body markers |

`titleSuggestsRankingList(title)` tests against `TITLE_RANKING_PATTERNS` (any **one** match → `true`). **Title alone is insufficient** — must pair with `isRankingListBody(body, title)` (router step 1) or lose to step 3 when body is essay shape.

| Pattern (regex) | Matches | Example title / query |
|-----------------|---------|------------------------|
| `\btop\s*(?:10\|ten)\b` | Top 10, Top Ten | "Top 10 Nano Reef Tanks" |
| `\btop[\s-]?(?:10\|ten)\b` *(SPEC)* | top-ten, Top-Ten | slug `top-ten-mid-size-suvs`; "Top-Ten CRM Tools" |
| `\bbest\s*(?:10\|ten)\b` | Best 10, Best Ten | "Best 10 CRM Platforms in 2027" |
| `\bbest\s*(?:five\|5)\b` | Best 5, Best Five | "Best Five Running Shoes" |
| `\bbest\s+\d+\b` | Best N (any digit) | "Best 7 Email Tools", "Best 3 CRMs" |
| `\btop\s+\d+\b` | Top N | "Top 5 Laptops", "Top 8 Filters" |
| `\b\d+\s+best\b` *(SPEC)* | N Best (digit-first) | "10 Best CRM Tools", "7 Best Email Platforms" |
| `\bthe\s+best\b` | The Best … | "The Best RevOps Stack for 2027" — **N defaults to 10** |
| `\bbest[\s-]?of\b` | Best of … | "Best of 2027 Blenders", "Best-of CRM Tools" — **N defaults to 10** |
| `\b(?:20(?:2[4-9]\|30))\b` or `\bin\s+20(?:2[4-9]\|30)\b` *(soft)* | Year in title | "… in 2027" — pair with top/best/listicle intent |
| `\b(?:ranked\|rankings\|top-rated\|highest-rated)\b` *(soft)* | Ranking language | "Top Rated Blenders 2027" — still needs ranking **body** |
| `\b(?:\d+\s+)?(?:best\|top)\b.*\bvs\.?\b` *(SPEC, soft)* | vs comparison listicles | "Best 5 CRM: HubSpot vs Salesforce" — pair with `## N.` ranks |
| `\b(?:compare\|comparison\|compared)\b` *(soft)* | Comparison listicle | "Laptop Comparison 2027" — pair with ranking **body** |

**CODE TRUTH** — `TITLE_RANKING_PATTERNS`; any **one** match → `titleSuggestsRankingList(title) === true`:

```javascript
const TITLE_RANKING_PATTERNS = [
  /\btop\s*(?:10|ten)\b/i,      // "Top 10 …", "Topten …"
  /\bbest\s*(?:10|ten)\b/i,     // "Best 10 …", "Best Ten …"
  /\bbest\s*(?:five|5)\b/i,     // "Best Five …", "Best5 …"
  /\bbest\s+\d+\b/i,            // "Best 7 …", "Best 3 CRMs"
  /\btop\s+\d+\b/i,             // "Top 5 …", "Top 8 …"
  /\bthe\s+best\b/i,            // "The Best RevOps Stack …" — N = 10 default
  /\bbest\s+of\b/i,             // "Best of 2027 …" — N = 10 default
];
```

**SPEC (agents / seed)** — listicle-intent, **N = 10** default; **not** in `TITLE_RANKING_PATTERNS` today:

```javascript
const TITLE_SPEC_TOP_TEN = /\btop[\s-]?(?:10|ten)\b/i;
const TITLE_SPEC_N_BEST = /\b(\d+)\s+best\b/i;              // "10 Best CRM Tools" → extract N
const TITLE_SPEC_BEST_OF = /\bbest[\s-]?of\b/i;
const TITLE_SPEC_SOFT = /\b(?:ranked|rankings|top-rated|highest-rated)\b/i;
const TITLE_SPEC_VS = /\b(?:\d+\s+)?(?:best|top)\b.*\bvs\.?\b/i;
const TITLE_SPEC_COMPARE = /\b(?:compare|comparison|compared)\b/i;
const TITLE_SPEC_YEAR = /\b(?:20(?:2[4-9]|30))\b|\bin\s+20(?:2[4-9]|30)\b/i;
```

**Code divergence:** `_ranking_top10_gold_template.js` duplicates a narrower local `isRankingListBody` (title checks only `\btop\s*(?:10|ten)\b|\bbest\s*(?:10|ten)\b`) — **router uses master law**, not gold template, for classification.

**Body signals** (`isRankingListBody`) — true when **any** of:

| Rule | Threshold |
|------|-----------|
| Numbered rank sections | `^##\s+\d+\.\s` count **≥ 5** |
| Rank sections + markers | **≥ 3** numbered sections **and** rank markers present |
| Title + partial ranks | Title suggests ranking **and** (≥ 3 numbered sections **or** rank markers) |

**Rank markers:** `@@PRODUCT` · 🏆 / **BEST OVERALL** · 💎 / **BEST VALUE**

```javascript
const NUMBERED_RANK_HEADING = /^##\s+\d+\.\s/gm;
const RANK_MARKERS = /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b|@@PRODUCT)/i;

function isRankingListBody(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const numbered = (body.match(NUMBERED_RANK_HEADING) || []).length;
  if (numbered >= 5) return true;
  if (numbered >= 3 && RANK_MARKERS.test(body)) return true;
  if (titleSuggestsRankingList(t) && (numbered >= 3 || RANK_MARKERS.test(body))) return true;
  return false;
}
```

**Negative — do NOT match pure essay Q&A** (title-only listicle words without body markers → Q&A via `pickGoldTemplate` step 3):

```javascript
// Negative fingerprint — essay Q&A shape (pickGoldTemplate step 3)
const QA_DIRECT_ANSWER = /^##\s+Direct\s+Answer/im;
const QA_NO_PRODUCT = !/^@@PRODUCT\b/m.test(body);
const QA_FEW_RANKS = (body.match(/^##\s+\d+\.\s/gm) || []).length < 3;
const QA_NO_PILLS = !/(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b)/i.test(body);

// Title says "best/top 10" but body is essay → Q&A wins
const titleOnlyRanking =
  titleSuggestsRankingList(title) && !isRankingListBody(body, title);

// Dual-pillar guard — ≥8 numbered sections + rank markers → Top 10, NOT Q&A
const QA_RANKING_GUARD =
  (body.match(/^##\s+\d+\.\s/gm) || []).length >= 8 && RANK_MARKERS.test(body);

// "What is the best …?" explainer — single answer, no ranked ## N. picks → Q&A
const EXPLAINER_QUESTION = /^(?:what|how|why|when|where|should|can|do|does|is|are)\b/i;
```

#### Extract N

**Extract N.** If both A and B match, **A wins.** Synced from **`GOLDEN_TEMPLATE_TOP10.md` §1 → Extract N (item count)`** and **§1.1**. **`rankCountFromTitle(title)`** + **`expectedRankCount(body, title)`** in `_ranking_list_master_law.js` — consumed by `pickGoldTemplate` → `appliesTop10Gold`. No `extractN` export — **`rankCountFromTitle` is the canonical N extractor**. N controls how many `## 1.`–`## N.` rank sections and `@@PRODUCT` cards the blob must contain. **Lock N at classify + seed time** — same as template classification.

**Default N = 10** when the phrase is **`best of`** or **`the best`** with no explicit number (DEFAULTS table).

`rankCountFromTitle` evaluates in order; first match wins:

| Pattern | Role | Regex / rule (in order) | N |
|---------|------|-------------------------|---|
| **A — explicit number** | Digit or fixed literal in title | `\b(?:top\|best)\s*(?:10\|ten)\b` → **10**; `\b(?:best\s*(?:five\|5)\|top\s*5)\b` → **5**; `\b(?:best\|top)\s+(\d+)\b` → clamp 3–10; `\b(\d+)\s+best\b` *(SPEC)* → clamp 3–10 | **10**, **5**, or **N** |
| **B — default-10 phrase** | No usable explicit number | `\bbest\s+of\b` or `\bthe\s+best\b` *(only if A did not match)* | **10** |

Example: *Best 7 of 2027 Blenders* — A matches `\bbest\s+7\b` → **N = 7**; B's `\bbest\s+of\b` is never reached.

| Title / query phrase | N | Source |
|----------------------|---|--------|
| `top 10`, `top ten`, `best 10`, `best ten` | **10** | `rankCountFromTitle` |
| `best 5`, `best five`, `top 5` | **5** | `rankCountFromTitle` |
| `top N` / `best N` where N is 3–10 | **N** (clamped 3–10) | `\b(?:best\|top)\s+(\d+)\b` |
| `N best` / `\d+\s+best` (e.g. "10 Best …") | **N** (clamped 3–10) *(SPEC)* | `TITLE_SPEC_N_BEST` |
| **`best of` / `best-of` with no number** | **10** *(default)* | `\bbest\s+of\b` |
| `the best` with no number | **10** | `\bthe\s+best\b` |
| No title match | `min(10, ## N. count)` if ≥ 3 sections, else **10** | `expectedRankCount` body fallback |

**`expectedRankCount(body, title)`** — resolution order:

| Priority | Source | Rule |
|----------|--------|------|
| 1 | **Title** | `rankCountFromTitle(title)` — explicit number in title wins |
| 2 | **Body** | `countProductSections(body)` — count of `^##\s+\d+\.\s` headings; if **≥ 3**, use `min(10, count)` |
| 3 | **Default** | **N = 10** |

```javascript
// _ranking_list_master_law.js — live code (pattern A before B; A wins when both match)
function rankCountFromTitle(title) {
  const t = String(title || '');
  if (/\b(?:top|best)\s*(?:10|ten)\b/i.test(t)) return 10;
  if (/\b(?:best\s*(?:five|5)|top\s*5)\b/i.test(t)) return 5;
  const m = t.match(/\b(?:best|top)\s+(\d+)\b/i);
  if (m) return Math.min(10, Math.max(3, parseInt(m[1], 10)));
  if (/\bbest\s+of\b/i.test(t) || /\bthe\s+best\b/i.test(t)) return 10;
  return null;
}

function expectedRankCount(body, title) {
  const fromTitle = rankCountFromTitle(title);
  const fromBody = countProductSections(body);
  if (fromTitle != null) return fromTitle;
  if (fromBody >= 3) return Math.min(10, fromBody);
  return 10;
}
```

**Top 10 gold vs Best N (`appliesTop10Gold`):**

- **`pickGoldTemplate` → `top10`** for **any** detected ranking list (Top 10, Best 5, Best 7, etc.).
- **`appliesTop10Gold(body, title)`** is stricter: `isRankingListBody` **and** `expectedRankCount(body, title) === 10`.
- When N ≠ 10, router still returns `template: 'top10'` but `reason: 'title_and_body_ranking_markers_not_top10_count'` — same immutable shape, N rank blocks instead of 10.
- **`auditTop10GoldTemplate`** runs full aq1158 section-order audit **only** when `appliesTop10Gold` is true.

#### pickGoldTemplate

Synced from **`GOLDEN_TEMPLATE_TOP10.md` §1 → Router reference`**. Call **before** draft, fix, audit, or publish; lock `template`, `goldId`, `goldUrl`, `reason` — **never switch mid-run**.

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

// title ← entry.question (pipeline) or explicit title arg
const route = pickGoldTemplate(id, body, title);
// route.template → 'top10' | 'qa' | null
// route.goldId   → 'aq1158' | 'q11133' | null
// route.reason   → see decision tree below

/**
 * Dual-pillar rule: BOTH title signal AND body ranking markers required for Top 10.
 * A title with "best" alone must NOT force Top 10 when body is essay/Q&A shape.
 */
function pickGoldTemplate(id, body, title) {
  const entryId = String(id || '').toLowerCase();
  const b = String(body || '');
  const t = title != null ? String(title) : '';

  if (titleSuggestsRankingList(t) && isRankingListBody(b, t)) {
    const top10 = appliesTop10Gold(b, t);
    return {
      template: 'top10',
      goldId: TOP10_GOLD_ID,
      goldUrl: TOP10_GOLD_URL,
      reason: top10
        ? 'title_and_body_ranking_markers_top10'
        : 'title_and_body_ranking_markers_not_top10_count',
    };
  }

  if (isRankingListBody(b, t)) {
    return {
      template: 'top10',
      goldId: TOP10_GOLD_ID,
      goldUrl: TOP10_GOLD_URL,
      reason: 'body_ranking_markers_without_title_signal',
    };
  }

  if (appliesQaGold(entryId, b, { title: t })) {
    return {
      template: 'qa',
      goldId: QA_GOLD_ID,
      goldUrl: QA_GOLD_URL,
      reason: titleSuggestsRankingList(t)
        ? 'title_suggests_ranking_but_body_is_essay_qa'
        : 'essay_qa_body_shape',
    };
  }

  return {
    template: null,
    goldId: null,
    goldUrl: null,
    reason: 'no_gold_template_applies',
  };
}
```

**Router decision tree** — evaluated **in order**; first match wins:

| Step | Condition | Template | `reason` |
|------|-----------|----------|----------|
| 1 | `titleSuggestsRankingList(title)` **and** `isRankingListBody(body, title)` | **Top 10** | `title_and_body_ranking_markers_top10` (N = 10) or `title_and_body_ranking_markers_not_top10_count` (Best 5 / Best N) |
| 2 | `isRankingListBody(body, title)` (body markers **without** title signal) | **Top 10** | `body_ranking_markers_without_title_signal` |
| 3 | `appliesQaGold(id, body, { title })` | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` **or** `essay_qa_body_shape` |
| 4 | (none) | **null** | `no_gold_template_applies` |

**Critical dual-pillar rule:** A title with "best" / "top 10" alone must **not** force Top 10 when the body is essay/Q&A shape. Title signal **plus** ranking body markers → Top 10; title signal **without** ranking body → Q&A (`title_suggests_ranking_but_body_is_essay_qa`).

**Negative cases — do not apply Top 10** (essay body wins):

| Condition | Router result | `reason` |
|-----------|---------------|----------|
| Essay/Q&A body — no `## N.` product ranks, no `@@PRODUCT`, no 🏆/💎/BEST OVERALL/VALUE | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` |
| Title says "best" / "top 10" but body is prose + text→image rhythm only | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` — **never force Top 10** |
| "What is the best …?" how-to / explainer (single answer, no ranked picks) | **Q&A** | Same — title word "best" ≠ ranking list |
| Body has ranking markers **without** title signal | **Top 10** | `body_ranking_markers_without_title_signal` *(positive — body wins)* |
| Neither template shape matches | **null** | `no_gold_template_applies` |

**Classification law — before generation:**

1. Call **`pickGoldTemplate(id, body, title)`** **before** draft, fix, audit, or publish.
2. Lock `template`, `goldId`, `goldUrl`, `reason` — **never switch mid-run**.
3. Lock **N** via `rankCountFromTitle(title)` + `expectedRankCount(body, title)` at classify + seed.

Modules: `_pulse_gold_template_router.js` · `_ranking_list_master_law.js` · `_ranking_top10_gold_template.js` · `_qa_gold_template.js` (`appliesQaGold`). Pair spec: essay Q&As → **Template B · B1**.

### A2. Required structure, in order

Synced from [`GOLDEN_TEMPLATE_TOP10.md` §2 REQUIRED PAGE STRUCTURE](GOLDEN_TEMPLATE_TOP10.md#2-required-page-structure-in-order) — full tail order, live-page sequence, gold-audit rules, and §7 gate cross-refs live there. N = locked rank count (default 10).

1. **`<title>`** — query phrase + number, ≤60 chars
2. **`<meta name="description">`** — 120–160 chars: promise + one differentiator
3. **One `<h1>`** — matches title intent
4. **`<p class="byline">By Kory White · Updated {dateModified}</p>`**
5. **`<p class="direct-answer">`** — ≤50 words, names the **#1 pick** (bolded) + one-line reason
6. Hero image (face card) — the ONLY required image: fetchpriority="high", no lazy loading, width="1200" height="630", descriptive topic alt, onerror fallback (§C2). Item images optional; if used, follow §C2.
7. **N item sections** — each item is an `<h2>` (#2. Name format), followed by 2–4 sentences: (a) why it made the list, (b) one original data point / stat / comparison not found on competing pages. Item images are OPTIONAL — only include if they add information.
8. **2–3 in-context internal links** — editorial links to related pillar/knowledge pages woven in body prose (not a related-posts widget). Cross-ref **DEFAULTS: Internal link targets** · `GOLDEN_TEMPLATE_TOP10.md` §2 item **12**
9. **`<p class="verdict">`** — ~50 words, #1 pick restated + when the runner-up wins
10. **CRO card per §C3** — render-time only (`insertCroAd()` → `croAdCard()` / `croMobileCard()`); **never in blob**. Desktop ≥768px: fixed-right viewport card with **cord + clothespin swinging animation**, renderer-injected. Mobile <768px: fixed-right **disabled**; same swinging card **inline full-width after item #5** (after `#5` `product-card` closes). Cross-ref **§C3** · `GOLDEN_TEMPLATE_TOP10.md` §0.1 · DEFAULTS: **CRO card missing** · §7 gate **17**
11. **Word floor 800** — never pad; padding is a gate failure
12. **2–3 in-context internal links** — editorial links to related pillar/knowledge pages woven in body prose (not a related-posts widget). Cross-ref **DEFAULTS: Internal link targets** · `GOLDEN_TEMPLATE_TOP10.md` §2 item **12**
13. **`<p class="verdict">`** — ~50 words, #1 pick restated + when the runner-up wins — inside `## Bottom Line`
14. **Tail sections (blob order)** — [optional mid-body H2s] → `## How to Choose` (one mermaid) → `## What to Look For` → `## FAQ` (≥5) → `## Bottom Line` → `## Sources` (≥5) → `## Related on PULSE`
15. **Word floor ≥800** — no ceiling; never pad; padding is a gate failure; 2,000 words not required

**Live page sequence:** Badges → H1 → meta-row (byline + dates) → Listen → Direct Answer gold box → hero image (face card) → How We Ranked → `## 1.` … `## N.` → [CRO per §C3: desktop fixed-right swinging | mobile inline after item **#5**] → [optional mid-body H2s] → How to Choose → What to Look For → FAQ → Bottom Line → Sources → Related on PULSE.

**Note:** No top hero before Direct Answer on Q&A either — the **face-card hero after DA** (item 6) is **Top 10 only**; never prepend Q&A hero chrome on listicles. Placement: immediately after Direct Answer, before `## How We Ranked These Products`; **no entry-cover hero before DA**. CRO is **render-injected only** — never bake CRO markup into the blob.

### A3. Schema — one JSON-LD

**Owner law (Top 10):** one render-time JSON-LD `@graph` per page — **`ItemList`** + **`Article`** + **`BreadcrumbList`**.

| Node | Required fields |
|------|-----------------|
| **`Article`** | `headline`; `author`: `{ "@type": "Person", "name": "Kory White" }`; `datePublished`; `dateModified` |
| **`ItemList`** | `numberOfItems` = **N**; `itemListOrder`: `"https://schema.org/ItemListOrderDescending"` (descending); `itemListElement`: **ListItem** 1..N with `name` + `{canonical}#item-{pos}` URLs |

Render-time only — **not in blob**. Injected by `netlify/functions/pulse-machine-entry.js` in `<head>` (~L876–952 build, ~L1092 emit). Full spec: [`GOLDEN_TEMPLATE_TOP10.md` §3 SCHEMA](GOLDEN_TEMPLATE_TOP10.md#3-schema-required). §7 gate **12** · **14**.

**Batch context:** [`_cg_sprint300_run.js`](_cg_sprint300_run.js) — batch publish runner for coaching-pillar entries `cg0518`–`cg0817` (Top-10-heavy sprint via `_write_cg.js` + `_cg_sprint300_bodies.js`). Does **not** build or inject schema; every entry it certifies must still receive this render-time `@graph` at serve time.

#### One block

Exactly **one** `<script type="application/ld+json">` per page — single `@context` + `@graph` (or equivalent combined object). No second LD script, no JSON-LD in markdown blobs. Writers, DeepSeek, and the image pipeline **must not** add schema markup to answer blobs.

#### `@graph` nodes (Top 10)

| Node | Required fields |
|------|-----------------|
| **`ItemList`** | `numberOfItems` == locked **N**; `itemListOrder`: `"https://schema.org/ItemListOrderDescending"`; `itemListElement`: **N** `ListItem` objects at positions **1..N** with `name` + `{canonical}#item-{pos}` URLs (matches `## 1.`–`## N.` — no gaps, no extras) |
| **`Article`** | `headline` (`entry.question`); `author`: `{ "@type": "Person", "name": "Kory White" }`; `datePublished` (`entry.ts` → ISO); `dateModified` (`entry.polished_at` → ISO, else `datePublished`) |
| **`BreadcrumbList`** | Home → pillar hub → this entry |

Cross-ref **DEFAULTS:** Canonical domain **https://pulserevops.com** — `{canonical}` = `https://pulserevops.com/{pillar}/{id}` (via `libraryEntryPublicUrl()`).

**Do not emit `QAPage` on Top 10.** Optional when applicable: `Product` (per `@@PRODUCT` rank card), `FAQPage` (≥5 FAQ pairs).

#### ItemList

ItemList: numberOfItems = N, itemListOrder descending, ListItem 1..N with name + {canonical}#item-{pos} URLs.

#### ItemList detail

| Field | Requirement |
|-------|-------------|
| `numberOfItems` | Locked **N** (matches `## 1.`–`## N.`) |
| `itemListOrder` | `"https://schema.org/ItemListOrderDescending"` (rank 1 = best) |
| `itemListElement` | **N** `ListItem` objects, positions **1..N** |
| Each `ListItem.name` | Product name from `@@PRODUCT name="…"` or rank heading |
| Each `ListItem.url` | `{canonical}#item-{pos}` — e.g. `https://pulserevops.com/aquariums/aq1158#item-1` |

#### Article detail

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"Article"` (renderer may emit schema.org **`TechArticle`** subtype — owner fields below are mandatory) | Yes |
| `headline` | `entry.question` | Yes |
| `author` | `{ "@type": "Person", "name": "Kory White" }` | Yes |
| `datePublished` | `entry.ts` → ISO | Yes |
| `dateModified` | `entry.polished_at` → ISO, else `datePublished` | Yes |

#### Example skeleton

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "name": "Top 10 Example Products in 2027",
      "url": "https://pulserevops.com/aquariums/xx0000",
      "numberOfItems": 10,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Example Alpha", "url": "https://pulserevops.com/aquariums/xx0000#item-1" },
        { "@type": "ListItem", "position": 2, "name": "Example Beta", "url": "https://pulserevops.com/aquariums/xx0000#item-2" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Top 10 Example Products in 2027",
      "url": "https://pulserevops.com/aquariums/xx0000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "author": { "@type": "Person", "name": "Kory White" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pulserevops.com/" },
        { "@type": "ListItem", "position": 2, "name": "Pillar Hub", "item": "https://pulserevops.com/aquariums/" },
        { "@type": "ListItem", "position": 3, "name": "Top 10 Example Products in 2027", "item": "https://pulserevops.com/aquariums/xx0000" }
      ]
    }
  ]
}
```

### A4. Quick checklist

Run before generate, fix, certify, or publish. Full §7 gate + 20-item numbered checklist: [`GOLDEN_TEMPLATE_TOP10.md` §7](GOLDEN_TEMPLATE_TOP10.md#7-quality-gate-validate-before-commit--all-must-pass).

| Step | Check |
|------|-------|
| **Classify** | `pickGoldTemplate(id, body, title)` **before** any draft — lock `template: 'top10'`, `goldId: 'aq1158'`, `goldUrl`, `reason`; **never switch mid-run** |
| **N extraction** | `rankCountFromTitle(title)` + `expectedRankCount(body, title)` — N rank sections (`## 1.`–`## N.`) + N × `@@PRODUCT`; **default N = 10** for "best of" / "the best"; lock at classify + seed |
| **Structure order** | A2 items **1–15** in order — load `TOP10_TEMPLATE_OUTLINE` / `TOP10_SECTION_ORDER` from `_ranking_top10_gold_template.js` |
| **§7 quality gate** | Pass condition rows **1–17** all ✓ (summary below) + row **18** closing verdict + gold audit + **13/13** rubric |
| **CRO** | Render-time only (`insertCroAd()`) — desktop fixed-right; **mobile inline after item #5** (§0.1); **never in blob** |
| **Validate spec doc** | When editing the golden spec itself: `node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md` — must exit **0** |

#### §7 Pass condition — rows 1–17 (summary)

Full pass/fail law: [`GOLDEN_TEMPLATE_TOP10.md` §7 Pass condition](GOLDEN_TEMPLATE_TOP10.md#pass-condition).

| # | Check | Pass condition (one line) |
|---|-------|---------------------------|
| 1 | Classification locked | `pickGoldTemplate` before draft; `top10` + `aq1158` locked; N matches rank sections |
| 2 | Title | ≤60 chars, number + query phrase |
| 3 | Meta description | 120–160 chars, promise + differentiator |
| 4 | H1 | Exactly one, matches title intent |
| 5 | Direct answer | ≤50 words, names #1 pick, before hero |
| 6 | Hero image | Alt, width/height, `fetchpriority="high"`, loads (200) — after DA, before How We Ranked |
| 7 | H2 count | == N, each `id="item-{pos}"` |
| 8 | Unique data | Every item ≥1 stat/comparison not on SERP page #1 |
| 9 | Internal links | ≥2 to pulserevops.com pillar pages |
| 10 | Viewport render | 375px + 1440px, zero CLS, zero broken images |
| 11 | Item quality | Every item: reason + one original data point |
| 12 | ItemList schema | Present, `numberOfItems == N`, positions 1..N |
| 13 | Word count | **≥800** — 2,000 **not** required |
| 14 | Author + dateModified | Visible byline + `TechArticle` JSON-LD |
| 15 | Rendering | No fixed px widths; imgs `max-width:100%`; no h-scroll @375px |
| 16 | Image fallbacks | Every img has `onerror` provider swap; zero broken |
| 17 | **CRO card** | Once only: fixed-right desktop; **inline after item #5 on mobile**; renderer-injected, not blob |

Also required: row **18** closing verdict (~50 words, #1 pick) · `auditTop10GoldTemplate()` clean · `rubricSignOff()` **13/13**.

---

## TEMPLATE B — GENERAL Q&A PAGES

| | |
|--|--|
| **Gold reference** | `q11133` — [https://pulserevops.com/knowledge/q11133](https://pulserevops.com/knowledge/q11133) |
| **Code** | [`_qa_gold_template.js`](_qa_gold_template.js) — `QA_TEMPLATE_OUTLINE`, `QA_SECTION_ORDER`, `auditQaGoldTemplate()`, `ensureQaGoldBodyShape()` |
| **Router** | `pickGoldTemplate(id, body, title)` → **`template: 'qa'`**, `goldId: 'q11133'` — lock before draft; never switch mid-run |
| **Full spec** | [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) — shape, CRO §0.1, schema, images, §6 gate (**do not duplicate entire doc here**) |

**Spec-doc validate** (when `GOLDEN_TEMPLATE_QA.md` itself changes):

```bash
node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
```

### B1. Detection (only when A doesn't match)

Read **`GOLDEN_TEMPLATE_QA.md` §1 DETECTION** and **`_pulse_gold_template_router.js`**. Pair spec for listicle URLs: **Template A · A1** ([`GOLDEN_TEMPLATE_TOP10.md` §1](GOLDEN_TEMPLATE_TOP10.md#1-detection--when-this-template-applies-not-top-10)).

**Scope:** Single-question essay URLs on pulserevops.com — yes/no questions, "what is", "how do", "should/can/does", "which/what is the best X for Y" when answered in **essay form** (explanatory prose + text→image rhythm). **Not** ranked product lists.

**Contrast spec:** Listicle-intent detection (ranked `## N.`, `@@PRODUCT`, Best Overall/Value pills) → **Template A · A1** (`GOLDEN_TEMPLATE_TOP10.md` §1, `aq1158`). **N extraction (Top N item count) does not apply to Q&A** — see Template A **§1.1**. Classify **before** generation; **never switch template mid-run**.

### Apply if slug/title/query matches AND Template A does NOT

**Router truth:** `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` classifies from **entry id + markdown body + title string** only. This template applies at router **step 3** when Template A steps 1–2 fail and `appliesQaGold(id, body, { title })` returns true. Pipeline passes `entry.question` as `title` (see `entryScrubPipeline` / `generateOne` in `_scrub_button_server.js`).

**Final lock:** slug/title/query hints alone are **never sufficient** — when `isRankingListBody(body, title)` is true → **Template A**, not Q&A ([`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1).

**Critical dual-pillar rule (owner 2026-07-06):** **Essay/Q&A body shape wins over title listicle signals.** A title with "best" / "top 10" alone must **not** force Template A when the body is essay shape. Title signal **plus** ranking body markers → Template A; title signal **without** ranking body → **Q&A** (`title_suggests_ranking_but_body_is_essay_qa`).

#### Regex

Synced from **`GOLDEN_TEMPLATE_QA.md` §1 DETECTION → Regex`**. **Code source of truth:** `_pulse_gold_template_router.js` (`pickGoldTemplate` step 3 → `appliesQaGold()` in `_qa_gold_template.js`). **Code wins** on conflict; **SPEC** lines are agent/seed hints not yet enforced in `appliesQaGold()`.

**Title and query** use the same string — pipeline `entry.question` = router `title` arg. When `title` is omitted, code falls back to `# H1` extracted from body (`entryTitle()` in `_ranking_list_master_law.js`).

**Opening tagline (this spec):** single-question URLs — yes/no, "what is", "how do", "which/what is the best X for Y" — anything answered in **essay form**, not ranked product lists.

**Code truth:** `pickGoldTemplate()` in `_pulse_gold_template_router.js` returns Q&A at **step 3** only when `appliesQaGold(id, body, { title })` in `_qa_gold_template.js` is true. `appliesQaGold()` does **not** test title regex — it gates on `pillarIsQa(id, body)` and `!isQaRankingList(body)`. Patterns below are **SPEC (agents / seed / pre-classify hints)** for essay intent; **body shape wins** when Template A router steps 1–2 fail.

| Pattern (regex) | Matches | Example title / query |
|-----------------|---------|------------------------|
| `\bwhat\s+is\b` | What is … | "What is RevOps?" |
| `\bhow\s+(?:do\|to\|can\|should)\b` | How do / how to / how can / how should | "How do you cycle an aquarium?", "How should I pick a CRM?" |
| `\bwhy\s+(?:is\|do\|does)\b` | Why is / why do / why does | "Why is my tank cloudy?", "Why does churn spike in Q4?" |
| `\b(?:yes\|no)\b.*\?` | Yes/no decision ending in `?` | "Should I open a franchise?", "Is it safe to …?" |
| `\?\s*$` | Any question-mark query | "Can you run RevOps without a CRM?" |
| `\bwhich\s+(?:is\|are)\s+the\s+best\b` | Which is/are the best … | "Which is the best filter for nano reefs?" |
| `\bwhat\s+is\s+the\s+best\b` | What is the best … | "What is the best CRM for a 10-person team?" — **essay** unless ranking body |

**Exclude — route to Template A instead of Q&A:**

When **`titleSuggestsRankingList(title)`** matches Top 10 `TITLE_RANKING_PATTERNS` ([**Template A · A1**](GOLDEN_TEMPLATE_TOP10.md#regex)) **and** **`isRankingListBody(body, title)`** is **`true`** → **Template A** (router step 1). Title-only listicle words without ranking body → **Q&A** (`title_suggests_ranking_but_body_is_essay_qa`).

`\bwhat\s+is\s+the\s+best\b` and `\bwhich\s+(?:is\|are)\s+the\s+best\b` are **Q&A essay intent** — **not** Template A — unless the body has ranked `## N.` product sections + rank markers (`@@PRODUCT`, 🏆/💎, BEST OVERALL/VALUE) per `isRankingListBody()`.

```javascript
// _pulse_gold_template_router.js — evaluated in order; Q&A is step 3
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const route = pickGoldTemplate(id, body, title);
// route.template === 'qa' when steps 1–2 fail and appliesQaGold(...) === true

// _qa_gold_template.js — body/pillar gate (no title regex)
function appliesQaGold(id, body, opts) {
  if (id === 'q11133') return false;
  if (!pillarIsQa(id, body)) return false;
  if (isQaRankingList(body)) return false;
  return true;
}
```

```javascript
// SPEC (agents / seed) — essay-intent title/query hints; not enforced in appliesQaGold today
const TITLE_QA_ESSAY_PATTERNS = [
  /\bwhat\s+(?:is|are)\b/i,                              // DEFINITION
  /\bhow\s+(?:to|do)\b/i,                                // PROCESS
  /^(?:is|are|can|should|does|do|will|would)\b/i,        // YESNO
  /\b(?:yes|no)\b.*\?/i,                                 // YESNO
  /\b(?:what|which)\s+(?:is|are)\s+the\s+best\b/i,       // BESTPICK — essay unless ranking body
  /\bwhy\s+(?:is|do|does)\b/i,
  /\bhow\s+(?:can|should|much|long|often)\b/i,
];
const QUESTION_MARK_QUERY = /\?\s*$/;

// Exclusion — Template A wins when BOTH title listicle signal AND ranking body
const top10Wins =
  titleSuggestsRankingList(title) && isRankingListBody(body, title);
// Essay "best" titles → Q&A unless isRankingListBody(body, title) === true
```

| ID / slug signal (case-insensitive) | Examples | Notes |
|-------------------------------------|----------|-------|
| Q-only ID `q####` | `/knowledge/q11133` | Default Q&A unless `isRankingListBody(body)` |
| Dual-mode pillar essay | `aq####`, `tl####`, `sw####`, … on any hub | Q&A when body lacks ranking markers |

Hub path, topic slug, and entry tags are **soft seed hints** — `pickGoldTemplate` does **not** read them.

#### Classify sub-type

Subtypes (set data-subtype on <article>): YESNO (is/are/can/should/does/do/will), DEFINITION ("what is/are"), PROCESS ("how to/do"), BESTPICK ("what/which is the best X", single answer).

After `pickGoldTemplate` locks **`template: 'qa'`** + **`goldId: 'q11133'`**, classify the **essay sub-type** from the entry title/query (pipeline `entry.question` = router `title` arg). Sub-type informs seed tone, Direct Answer framing (B2), and `data-subtype` on the rendered `<article>` — it **does not** change the golden template shape or router outcome.

**Evaluate in order** — first match wins (title-only; same input as [Regex](#regex) above):

| Priority | `data-subtype` | Title / query signal | Examples | Direct Answer format (B2 · [`GOLDEN_TEMPLATE_QA.md` §2](GOLDEN_TEMPLATE_QA.md#direct-answer-block-qa--not-top-10)) |
|----------|----------------|----------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| 1 | **YESNO** | `is` / `are` / `can` / `should` / `does` / `do` / `will` | "Should I …?", "Is it safe to …?", "Can you …?", "Do I need …?" | Opens `<strong>Yes/No/It depends</strong>` + one-sentence condition; evergreen — no year suffix (`yearize` guard in `_scrub_button_server.js`) |
| 2 | **DEFINITION** | "what is/are" — `\bwhat\s+(?:is\|are)\b` **without** `\bthe\s+best\b` | "What is RevOps?", "What are nano reefs?", "What is an AI gateway?" | `"{Term} is …"` quotable first sentence |
| 3 | **PROCESS** | "how to/do" — `\bhow\s+(?:to\|do)\b` | "How do I cycle an aquarium?", "How to fix …" | **Method summary + time required** |
| 4 | **BESTPICK** | "what/which is the best X" — `\b(?:what\|which)\s+(?:is\|are)\s+the\s+best\b` — **single answer** | "What is the best CRM **for** startups?", "Which is the best filter **for** nano reefs?" | **The pick + qualifying condition** — single answer; **not** Template A unless body has ranked `## N.` + `@@PRODUCT` / 🏆/💎 markers. Often pairs with router `reason`: **`title_suggests_ranking_but_body_is_essay_qa`** |

```javascript
// SPEC — essay sub-type classify (not yet a standalone module)
// Pair: TITLE_QA_ESSAY_PATTERNS in Regex block above
// Render: set data-subtype on <article> — YESNO | DEFINITION | PROCESS | BESTPICK
const QA_SUBTYPE_PATTERNS = {
  YESNO: /^(?:is|are|can|should|does|do|will)\b/i,
  DEFINITION: /\bwhat\s+(?:is|are)\b/i,
  PROCESS: /\bhow\s+(?:to|do)\b/i,
  BESTPICK: /\b(?:what|which)\s+(?:is|are)\s+the\s+best\b/i,
};

// Evergreen guard (_scrub_button_server.js yearize) — do NOT yearize these sub-types
const QA_EVERGREEN_TITLE =
  /\b(best|right|proper|smartest|safest|easiest|fastest)\s+way\b|\bhow\s+(to|do|can|should|much|long|often)\b|\bwhy\b|\bshould\s+(i|you)\b|\bwhat\s+does\b.*\bmean\b|\bdifference\s+between\b|\bmeaning\s+of\b|\bis\s+it\s+(ok|safe|normal|worth|possible)\b/i;

function classifyQaSubType(title) {
  const t = String(title || '').trim();
  if (QA_SUBTYPE_PATTERNS.YESNO.test(t)) return 'YESNO';
  if (QA_SUBTYPE_PATTERNS.DEFINITION.test(t) && !/\bthe\s+best\b/i.test(t)) return 'DEFINITION';
  if (QA_SUBTYPE_PATTERNS.PROCESS.test(t)) return 'PROCESS';
  if (QA_SUBTYPE_PATTERNS.BESTPICK.test(t)) return 'BESTPICK';
  return 'DEFINITION'; // fallback for unmatched wh- essays
}
```

**Top 10 boundary (all sub-types):** if `isRankingListBody(body, title)` is true → **Template A**, regardless of sub-type. `\bwhat\s+is\s+the\s+best\b` / `\bwhich\s+(?:is\|are)\s+the\s+best\b` are **Q&A essay intent** unless ranking body markers are present.

**Not sub-types (Template A path):** ranked `## 1.`–`## N.` product sections, `@@PRODUCT`, 🏆 BEST OVERALL / 💎 BEST VALUE — see **Template A · A1**.

#### Sub-type pass conditions *(owner dictation pending)*

> **Status:** Placeholder structure — owner will dictate pass conditions per sub-type in a follow-up session. Do **not** publish sub-type-specific gates until this table is filled and wired in code.

| `data-subtype` | Pass condition | Audit / code hook | Status |
|----------------|----------------|-------------------|--------|
| **YESNO** | Opens `<strong>Yes/No/It depends</strong>` + one-sentence condition | Direct Answer gold box — verdict-first per B2 | ✅ Owner dictated |
| **DEFINITION** | First sentence opens `"{Term} is …"` — quotable, plain-language definition | Direct Answer gold box — first sentence matches definition-first pattern | ✅ Owner dictated |
| **PROCESS** | Method summary + time required in Direct Answer gold box | Direct Answer gold box — method summary + time required per B2 | ✅ Owner dictated |
| **BESTPICK** | Direct Answer names **the pick + qualifying condition** (single answer — not a ranked list) | Direct Answer gold box — pick + qualifying condition per B2 | ✅ Owner dictated |

**Shared Q&A gates (all sub-types — already in B4 / `GOLDEN_TEMPLATE_QA.md` §6):** immutable gold shape (`QA_SECTION_ORDER`), Direct Answer ≥140 chars / ≥2 sentences, no top hero, no `@@PRODUCT`, 13/13 rubric, CRO render-time only.

**Router `reason` strings (template level — not sub-type keys):**

| `pickGoldTemplate` → `reason` | When | Typical `data-subtype` |
|-------------------------------|------|------------------------|
| **`essay_qa_body_shape`** | Body lacks ranking list markers — default essay Q&A | Any — classify from title |
| **`title_suggests_ranking_but_body_is_essay_qa`** | Title says "best/top 10" but body is **not** a ranking list | Usually **BESTPICK**; may be **PROCESS** when title is "best **way** to …" |
| **`no_gold_template_applies`** | Neither Top 10 nor Q&A shape | N/A — fix body or re-seed before sub-type classify |

**Negative — `isRankingListBody(body, title)` true → Template A, not Q&A:**

| Condition | Router result | `reason` |
|-----------|---------------|----------|
| ≥ 5 numbered `## N.` sections, or ≥ 3 + 🏆/💎/BEST OVERALL/VALUE/`@@PRODUCT` | **Template A** | `title_and_body_ranking_markers_*` or `body_ranking_markers_without_title_signal` |
| Title says "best/top 10" **and** body has ranking markers | **Template A** | Title **plus** body required — see Template A · A1 |
| ≥ 8 numbered sections + rank markers on dual pillar | **Template A** | `isQaRankingList()` guard in `_qa_gold_template.js` |

**Positive Q&A edge:** title matches `titleSuggestsRankingList(title)` but body is prose + `## Direct Answer` + text→image only → **Q&A** with **`title_suggests_ranking_but_body_is_essay_qa`** — **never force Template A on title alone**. Default essay body → **`essay_qa_body_shape`**.

**Pair spec:** listicle URLs that pass Template A detection → **Template A · A1** (`GOLDEN_TEMPLATE_TOP10.md` §1, `aq1158`).

#### Detection gate — `appliesQaGold(id, body, opts)`

**Code:** `_qa_gold_template.js` → `appliesQaGold()`. Returns `true` when Q&A gold law should apply (router step 3).

| Check | Rule |
|-------|------|
| Gold reference exempt | `id === 'q11133'` → `false` (live reference is not re-audited as a candidate) |
| Pillar eligible | `pillarIsQa(id, body)` — see pillar table below |
| Not a ranking list | `isQaRankingList(body)` → `false` when **≥ 8** numbered `## N.` sections **and** `qaHasRankingMarkers(body)` |

**`pillarIsQa(id, body)`:**

| Mode | ID pattern | Routing |
|------|------------|---------|
| **Q-only** | `q####` (`/^q\d+$/`) | Q&A unless body is a ranking list |
| **Dual-mode** | Prefix ∈ `q`, `cg`, `tk`, `pt`, `sw`, `ai`, `aq`, `tl`, `tc`, `ga`, `gm` | **Body shape wins** — same prefix can be Template A or Q&A |
| **Dual-mode guard** | ≥ 8 `## N.` **and** rank markers in body | **Not Q&A** → Template A path |

#### Gold audit — `auditQaGoldTemplate(body, title, id)`

**Code:** `_qa_gold_template.js` → `auditQaGoldTemplate()`. Runs strict shape checks when `appliesQaGold()` is true.

| Return | Meaning |
|--------|---------|
| `applies: false` | Entry is q11133 reference, or `appliesQaGold()` is false — skip Q&A gold audit |
| `applies: true`, `compliant: false` | Q&A template applies but blob fails shape (see `issues[]`) |
| `applies: true`, `compliant: true` | Ready for 13/13 + certify |

**Detection-related audit failures** (body classified Q&A but contains listicle artifacts):

| Issue code | Trigger |
|------------|---------|
| `ranking_markers_in_qa` | `qaHasRankingMarkers(body)` — `@@PRODUCT`, 🏆/💎, BEST OVERALL/VALUE in ranked `## N.` headings |

Use `needsQaGoldFix(body, title, id)` for batch/fix routing: `appliesQaGold` **and** audit non-compliant.

#### Positive signals — when Q&A applies

> **Full regex code blocks:** [Regex](#regex) above.

**Question / title types** (essay intent — single answer, not ranked picks):

| Type | Examples |
|------|----------|
| **Yes/no** | "Should I …?", "Is it safe to …?", "Can you …?" |
| **What is** | "What is RevOps?", "What is the best CRM **for** startups?" (essay — not Template A) |
| **How do / how to** | "How do I cycle an aquarium?", "How to fix …" |
| **Explainer wh-** | Why / when / where / should / can / do / does / is / are … |
| **Best X for Y (essay)** | "What is the best email tool **for** a 10-person team?" — prose answer, no `## 1.`–`## 10.` product ranks |

Title may contain listicle words ("best", "top 10") — if body is essay shape (Direct Answer + content H2s + text→image, no rank blocks), **Q&A wins**.

See [Classify sub-type](#classify-sub-type) above — **`data-subtype`** on `<article>` (`YESNO` · `DEFINITION` · `PROCESS` · `BESTPICK`) drives B2 Direct Answer layout within the locked Q&A shape.

#### Negative — do **not** apply Q&A (route to Template A)

Even on `/knowledge/` or with an essay-sounding title:

| Condition | Result | `reason` (Template A) |
|-----------|--------|------------------------|
| `isRankingListBody(body, title)` is true | **Template A** | See **Template A · A1** |
| Body has **≥ 3** (or **≥ 5**) numbered `## N.` product sections | **Template A** | `body_ranking_markers_without_title_signal` or title+body match |
| Body has `@@PRODUCT` widgets | **Template A** | Ranking list shape — not essay Q&A |
| Ranked sections with 🏆 BEST OVERALL / 💎 BEST VALUE pills | **Template A** | `qaHasRankingMarkers` / `hasRankMarkers` |
| **≥ 8** numbered `## N.` **and** rank markers (`isQaRankingList`) | **Template A** | Dual-pillar guard — overrides Q&A default |

**`isRankingListBody(body, title)`** (`_ranking_list_master_law.js`): true when numbered product sections ≥ 5, or ≥ 3 with rank markers, or title suggests ranking **and** (≥ 3 sections or rank markers).

**Never merge:** no `@@PRODUCT` / ranking pills in Q&A blobs; no ranked `## N.` product blocks on essay URLs.

#### pickGoldTemplate

Synced from **`GOLDEN_TEMPLATE_QA.md` §1 → Router decision tree`**. Call **before** draft, fix, audit, or publish; lock `template`, `goldId`, `goldUrl`, `reason` — **never switch mid-run**.

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

const route = pickGoldTemplate(id, body, title);
// route.template → 'qa' | 'top10' | null
// route.goldId   → 'q11133' | 'aq1158' | null
// route.reason   → see decision tree below
```

**Router decision tree** — evaluated **in order**; first match wins. Q&A is **step 3** (after Template A steps 1–2 fail):

| Step | Condition | Template | `reason` |
|------|-----------|----------|----------|
| 1 | `titleSuggestsRankingList(title)` **and** `isRankingListBody(body, title)` | **Template A** | `title_and_body_ranking_markers_top10` or `…_not_top10_count` |
| 2 | `isRankingListBody(body, title)` (body markers **without** title signal) | **Template A** | `body_ranking_markers_without_title_signal` |
| 3 | `appliesQaGold(id, body, { title })` | **Q&A** | `essay_qa_body_shape` **or** `title_suggests_ranking_but_body_is_essay_qa` |
| 4 | (none) | **null** | `no_gold_template_applies` |

| Router outcome (`reason`) | When |
|---------------------------|------|
| **`essay_qa_body_shape`** | Body lacks ranking list markers — default essay Q&A |
| **`title_suggests_ranking_but_body_is_essay_qa`** | Title says "best/top 10" but body is **not** a ranking list — **Q&A wins**; never force Template A on title alone |

**Classification law — before generation:**

1. Call **`pickGoldTemplate(id, body, title)`** **before** draft, fix, audit, or publish.
2. **Lock** `template`, `goldId`, `goldUrl`, and `reason` for the entire run.
3. **Never switch template mid-run** — no Q&A → Template A pivots (or reverse) after generation starts.
4. After router locks **`template: 'qa'`**, classify essay **sub-type** (**YESNO** · **DEFINITION** · **PROCESS** · **BESTPICK**) from title — informs Direct Answer framing only; **does not** change golden shape.

**Render mirror:** `pulse-machine-entry.js` uses `appliesQaGold()` for `noTopHero` and Q&A CRO slot (`afterQaEssayCroPos`) — same body/id law as the router.

Modules: `_pulse_gold_template_router.js` · `_ranking_list_master_law.js` (`titleSuggestsRankingList`, `isRankingListBody`) · `_qa_gold_template.js` (`appliesQaGold`, `auditQaGoldTemplate`) · `_ranking_top10_gold_template.js` (`appliesTop10Gold`). Deep dive: **`GOLDEN_TEMPLATE_QA.md` §1 DETECTION** · [Classify sub-type](GOLDEN_TEMPLATE_QA.md#classify-sub-type). Pair spec: listicle URLs → **Template A · A1**.

### B2. Required structure, in order

Synced from [`GOLDEN_TEMPLATE_QA.md` §2 REQUIRED PAGE STRUCTURE](GOLDEN_TEMPLATE_QA.md#2-required-page-structure-in-order) — full tail order, live-page sequence, gold-audit rules, and §6 gate cross-refs live there. Sub-type (`YESNO` · `DEFINITION` · `PROCESS` · `BESTPICK`) informs Direct Answer framing only — **does not** change golden shape.

Every Q&A blob and rendered page must follow this sequence **in order**. **Do not reorder, skip, or rename mandatory elements.** Q&A shape only — no ranked `## N.` product sections, no `@@PRODUCT`, no 🏆/💎 pills, no hero before Direct Answer.

1. **`<title>`** — the question, ≤60 chars
2. **`<meta name="description">`** — 120–160 chars containing the short answer
3. **One `<h1>`** = the question
4. **Byline** — `<p class="byline">By Kory White · Updated {dateModified}</p>`
5. **`<p class="direct-answer">`** — **40–60 words** — featured-snippet / AEO lead; **first element after byline** (first content block in `<div class="body">` after H1 + byline + Listen). Format by `data-subtype` ([B1](#classify-sub-type) · [`GOLDEN_TEMPLATE_QA.md` §2 Direct answer](GOLDEN_TEMPLATE_QA.md#direct-answer-block-qa--not-top-10)):
   - **YESNO** → opens `<strong>Yes/No/It depends</strong>` + one-sentence condition
   - **DEFINITION** → `"{Term} is …"` quotable first sentence
   - **PROCESS** → method summary + time required
   - **BESTPICK** → the pick + qualifying condition
   Blob: `## Direct Answer` — **first H2**; render: gold `direct-answer-box` via `wrapDirectAnswerGold()` — **not stored as HTML in blob**. Full block ≥140 chars, ≥2 sentences; **no #1 product pick**, no Best Overall/Value pills. §6 gate **5**

   **YESNO:** opens `<strong>Yes/No/It depends</strong>` + one-sentence condition.

   **DEFINITION:** `"{Term} is …"` quotable first sentence.

   **PROCESS:** method summary + time required.

   **BESTPICK:** the pick + qualifying condition.
6. **Hero image OPTIONAL** (visual topics only; same rules as A) — cross-ref Template A A2 item **6** + **§C2**. After Direct Answer — **no top hero before DA**; when used, hero comes after the Direct Answer gold box (plus at least one intro prose block per q11133 text→image rhythm); may coincide with first depth-section `![alt](url)`. Same attrs as A: `fetchpriority="high"`, NO lazy loading, explicit `width`/`height`, descriptive topic alt, `onerror` fallback; no leading `![…](…)` in blob
7. **Depth sections** — 3–6 `<h2>` depth sections (evidence, when the answer changes, caveats, comparison, common mistakes). H2s phrased as searchable sub-questions where natural. No section under 40 words.
8. **Depth-section rhythm** — topical content sections (`## Topic Name` — **not** ranked `## N. Product`). Each section: **text block (paragraphs)** → **one** topical `![alt](url)` → repeat **text → image** rhythm down the page. **Never stack two images** back-to-back without text between. Weave **2–3** in-context internal links to `/knowledge/{id}` in body prose
9. **CRO card per §C3** — render-time only (`insertCroAd()` → `afterQaEssayCroPos()`); **never in blob**. Desktop ≥768px: fixed-right viewport swinging card, renderer-injected. Mobile <768px: same card **inline full-width** — **mobile insertion point: before Related questions section** (after last depth-section H2, before `## Related questions`). Cross-ref **§C3** · `GOLDEN_TEMPLATE_QA.md` §0.1 · DEFAULTS: **CRO card missing** · §6 gate **18**
10. **Related questions** — `<h2>Related questions</h2>` + **3–5** `<h3>`s, each answered **≤50 words** (People Also Ask). Blob: `## Related questions` then `### Question?` + answer paragraph per item · §6 gate **12**
11. **[Optional] `## Bottom Line`** — essay operating-rhythm recap before FAQ; gold audit treats as optional. **Not** Top 10 ≤50-word #1-pick closing verdict
12. **`## FAQ`** — single header (unnumbered); **4–6** (rubric may require ≥5) `**Question?**` bold pairs + answer paragraphs
13. **`## Sources`** — **5–10** bulleted real named sources with URLs (`## References` accepted by audit). **YMYL** topics (health/medicine, money, legal, insurance): **≥2 citations to authoritative sources** + one-line disclaimer from [DEFAULTS **YMYL disclaimer**](#defaults-table-use-instead-of-asking). **Non-YMYL:** cite statistical/factual claims; still need ≥5 real, live (HTTP 200/301), named sources overall. §6 gate **9**
14. **2–3 internal links in-context** — editorial links to `/knowledge/{id}` woven in body prose (distinct from tail `## Related on PULSE`). Cross-ref DEFAULTS: **Internal link targets**
15. **`## Related on PULSE`** — internal library link line (tail sibling nav — distinct from in-body editorial links)
16. **Word floor ≥600** — YESNO may ship at 600–799; DEFINITION/PROCESS usually land 900–1,400 (target ≥800 per Compliance table). No ceiling; never pad; padding is a gate failure. The direct answer does the ranking work; the body proves you earned it

**Live page sequence:** Badges → H1 → byline (`<p class="byline">`) → Listen → Direct Answer gold box (NO top hero before) → [optional hero after DA + intro prose] → depth H2 sections (3–6): text → image → text → image … → [CRO per §C3: desktop fixed-right | mobile after last depth H2 before Related questions] → Related questions → [optional Bottom Line] → FAQ → Sources → Related on PULSE.

**Note:** CRO is **render-injected only** — never bake CRO markup into the blob. Mobile insertion point per **§C3**: **after last depth-section H2, before "Related questions."**

### B3. Schema — one JSON-LD

Render-time only — **not in blob**. Injected by `netlify/functions/pulse-machine-entry.js` in `<head>` (~L876–952 build, ~L1092 emit). Full spec: [`GOLDEN_TEMPLATE_QA.md` §3 SCHEMA](GOLDEN_TEMPLATE_QA.md#3-schema-required). §6 gate **8**.

#### One block

Exactly **one** `<script type="application/ld+json">` per page — single `@context` + `@graph` (or equivalent combined object). No second LD script, no JSON-LD in markdown blobs. Writers, DeepSeek, and the image pipeline **must not** add schema markup to answer blobs.

#### `@graph` nodes (Q&A essay)

| Node | Required fields |
|------|-----------------|
| **`QAPage`** | `mainEntity` **`Question`** (`name` = `entry.question`, `answerCount: 1`) + single **`acceptedAnswer`** (`Answer`); `acceptedAnswer.text` **must match** the plain-text body of the rendered direct-answer box (`<p class="direct-answer">` / `direct-answer-box` via `wrapDirectAnswerGold()`) **exactly** |
| **`TechArticle`** (`Article`) | `headline` (`entry.question`); **`datePublished`** (`entry.ts` → ISO); **`dateModified`** (`entry.polished_at` → ISO, else `datePublished`); E-E-A-T: **`author`** Organization Pulse (`machineAuthor`), **`editor`** Person **Kory White** (`koryEditor`), **`publisher`** Pulse News |
| **`BreadcrumbList`** | Home → Knowledge Library → this entry |

Cross-ref **DEFAULTS:** Canonical domain **https://pulserevops.com** — entry URL = `https://pulserevops.com/{pillar}/{id}` (via `libraryEntryPublicUrl()`).

**Do not emit `ItemList` on Q&A.** Optional when applicable: **`FAQPage`** (when tail `## FAQ` has **≥5** pairs) — `mainEntity[]` of `Question` / `acceptedAnswer` per on-page FAQ; pair format = `**Question?**` bold line + answer paragraph(s).

> **Note:** FAQ rich results now display mostly for high-authority sites, but the markup still feeds Google's understanding and AI Overviews — keep it.

#### QAPage detail

| Field | Requirement |
|-------|-------------|
| `mainEntity.@type` | `"Question"` |
| `mainEntity.name` | `entry.question` |
| `mainEntity.answerCount` | `1` |
| `mainEntity.acceptedAnswer.@type` | `"Answer"` |
| `mainEntity.acceptedAnswer.text` | Plain text of rendered **direct-answer** body — **exact match** to `<p class="direct-answer">` / gold `direct-answer-box` content (§6 gate **8** · B2 item **4**) |
| `mainEntity.datePublished` | `entry.ts` → ISO (`datePub`) |
| `mainEntity.author` | `machineAuthor` (Organization Pulse) |

**Code today:** `acceptedAnswer.text` = first **5,000** chars of `entry.answer` — **gap vs owner spec**; renderer should clip to direct-answer plain text only.

#### TechArticle (Article) detail

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"TechArticle"` (schema.org **`Article`** subtype) | Yes |
| `headline` | `entry.question` | Yes |
| **`datePublished`** | `entry.ts` → ISO | Yes |
| **`dateModified`** | `entry.polished_at` → ISO, else `datePublished` | Yes |
| **`author`** | Organization Pulse (`machineAuthor`) | Yes |
| **`editor`** | Person **Kory White** (`koryEditor`, CRO) | Yes |
| `description` | `descExcerpt(entry.answer)` | Yes |

#### FAQPage (optional — when `## FAQ` present)

| Rule | Detail |
|------|--------|
| **Trigger** | Blob has `## FAQ` with **≥5** pairs (13/13 criterion 4) |
| **`mainEntity[]`** | Each `Question` + `acceptedAnswer` mirrors on-page FAQ pair |
| **Code today** | **Not emitted** on entry pages — hub pages only — **gap vs owner spec** |

#### Example skeleton

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "QAPage",
      "url": "https://pulserevops.com/knowledge/q00000",
      "mainEntity": {
        "@type": "Question",
        "name": "What Is an Example Operator Question?",
        "answerCount": 1,
        "datePublished": "2027-01-15T12:00:00.000Z",
        "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" },
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Exact plain-text body of the rendered direct-answer box — matches <p class=\"direct-answer\"> at serve time.",
          "url": "https://pulserevops.com/knowledge/q00000",
          "datePublished": "2027-01-15T12:00:00.000Z",
          "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" }
        }
      }
    },
    {
      "@type": "TechArticle",
      "headline": "What Is an Example Operator Question?",
      "url": "https://pulserevops.com/knowledge/q00000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" },
      "editor": { "@type": "Person", "name": "Kory White", "jobTitle": "Chief Revenue Officer" },
      "publisher": { "@type": "Organization", "name": "Pulse News" },
      "description": "Short meta description restating the question promise plus one differentiator."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pulserevops.com/" },
        { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": "https://pulserevops.com/knowledge.html" },
        { "@type": "ListItem", "position": 3, "name": "What Is an Example Operator Question?", "item": "https://pulserevops.com/knowledge/q00000" }
      ]
    }
  ]
}
```

### B4. Quick checklist

Run before generate, fix, certify, or publish. Full §6 gate + 19-item numbered checklist: [`GOLDEN_TEMPLATE_QA.md` §6](GOLDEN_TEMPLATE_QA.md#6-quality-gate-all-must-pass).

| Step | Check |
|------|-------|
| **Classify** | `pickGoldTemplate(id, body, title)` **before** any draft — lock `template: 'qa'`, `goldId: 'q11133'`, `goldUrl`, `reason`; **never switch mid-run** |
| **Sub-type** | After router locks Q&A, classify **YESNO** · **DEFINITION** · **PROCESS** · **BESTPICK** from title — informs Direct Answer framing only |
| **Structure order** | B2 items **1–16** in order — load `QA_TEMPLATE_OUTLINE` / `QA_SECTION_ORDER` from `_qa_gold_template.js` |
| **§6 quality gate** | Pass condition rows **1–15** all ✓ (summary below) + rows **16–18** (images + CRO) + gold audit + **13/13** rubric |
| **CRO** | Render-time only (`insertCroAd()` → `afterQaEssayCroPos()`) — desktop fixed-right; **mobile inline after last depth-section H2, before Related questions** (§C3 · B2 item **9**); **never in blob** |
| **Validate spec doc** | When editing the golden spec itself: `node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md` — must exit **0** |

#### §6 Pass condition — rows 1–15 (summary)

Full pass/fail law: [`GOLDEN_TEMPLATE_QA.md` §6 Pass condition](GOLDEN_TEMPLATE_QA.md#pass-condition).

| # | Check | Pass condition (one line) |
|---|-------|---------------------------|
| 1 | Classification locked | `pickGoldTemplate` before draft; `qa` + `q11133` locked; body shape wins over title |
| 2 | Title | Question verbatim (or tightened), ≤60 chars |
| 3 | Meta description | 120–160 chars, contains short answer |
| 4 | H1 | Exactly one — the question |
| 5 | Direct answer | 40–60 words after byline; YESNO opens `<strong>Yes/No/It depends</strong>` + one-sentence condition |
| 6 | Hero image | OPTIONAL (visual topics only; same rules as A); after DA — no top hero before DA; if present: eager load, dimensions, alt, HTTP 200 |
| 7 | Depth sections | 3–6 depth-section H2s; searchable sub-questions where natural |
| 8 | Schema | Valid JSON-LD QAPage + TechArticle with author, dates |
| 9 | Sources | YMYL (health/medicine, money, legal, insurance): ≥2 authoritative citations + DEFAULTS disclaimer; non-YMYL: cite statistical claims |
| 10 | Word count | **≥600** — 2,000 **not** required |
| 11 | Internal links | ≥2 in-context to `/knowledge/{id}` |
| 12 | Related questions | 3–5 H3s, each answered ≤50 words |
| 13 | Rendering | Passes §5 at 375px and 1440px |
| 14 | Author + dateModified | Visible meta-row + `TechArticle` JSON-LD |
| 15 | Viewport | Manual pass 375px + 1440px — zero CLS, zero broken images |

Also required: rows **16–18** (image fallbacks · image sourcing · **CRO** fixed-right desktop, **inline after last depth-section H2 before Related questions on mobile**) · `auditQaGoldTemplate()` clean · `rubricSignOff()` **13/13**.

---

## §C1 Rendering (mobile/desktop parity — MANDATORY)

Runbook stub for the rendering law shared by **both** golden templates. **Full law:** [`GOLDEN_TEMPLATE_QA.md` §5 RENDERING RULES](GOLDEN_TEMPLATE_QA.md#5-rendering-rules) · [`GOLDEN_TEMPLATE_TOP10.md` §5 RENDERING RULES](GOLDEN_TEMPLATE_TOP10.md#5-rendering-rules-mobiledesktop-parity--mandatory). **Code:** `netlify/functions/pulse-machine-entry.js` + `assets/pulse-tan.css`.

These rules exist because of prior mobile↔desktop render breakage (mosaic tiles via `background-image` instead of real `<img>`, `content-visibility` deferring off-screen tiles, missing global `img` CSS). **Every generated page must obey:**

| Law | Rule | Gate |
|-----|------|------|
| **Mobile-first CSS** | Single column default; layout enhancements only inside `@media (min-width: 768px)` | Q&A §6 row 13 · Top10 §7 row 15 |
| **No fixed pixel widths** | `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;` on `.body`/`<article>` prose column — never hard px column locks | same |
| **Fluid typography** | body `clamp(1rem, 0.95rem + 0.4vw, 1.125rem)`; `h1` `clamp(1.6rem, 1.2rem + 2vw, 2.4rem)` | same |
| **Images** | `max-width:100%; height:auto`; explicit `width`/`height` HTML attrs via `entryImgAttrs()`; lazy-load every image **except** the hero (`loading="lazy" decoding="async"`) | same · **§C2** |
| **No layout tables** | Tables for true tabular data only — never for page structure, columns, or chrome | same |
| **Overflow-wrap** | `overflow-wrap: break-word` (+ `word-break: break-word`) on the prose column — zero horizontal scroll @375px | same |
| **Renderer owns visuals** | Answer blobs are markdown/text only (`escHtml()` / `renderMd()`) — renderer + `assets/pulse-tan.css` own all HTML/CSS/widgets; never bake gold Direct Answer box or CRO markup into blobs | §0.1 · this file **§C3** |
| **Real `<img>` tags** | Entry section figures + mosaic tiles use real `<img>` (mosaic: `<img class="mm-img">` via `PulseFaceImg.mosaicImgTag()`) — never `background-image` lazy-load for content | Q&A/Top10 §5 |
| **Desktop/mobile parity** | Same blob → same HTML structure at both breakpoints; CRO fixed-right vs mobile-inline is a renderer CSS swap only, not different blob markup per viewport | §0.1 · **§C3** |
| **Viewport test** | Manual pass at **375px** and **1440px** before certify — zero CLS, zero broken images | Q&A §6 row 15 · Top10 §7 row 10 |

**Container CSS (copy verbatim for audits):**

```css
.body,
article {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
  padding-inline: 16px;
  overflow-wrap: break-word;
  word-break: break-word;
}
```

CRO gutter (`body{padding-right:352px}` @ ≥1200px) and the mosaic rail (`max-width:1080px`) are page-chrome exceptions — they must never force horizontal scroll on the prose column @375px.

Enforcement: render audit agents A (live layout) + B (live images) + C (blob gold + visual lock) — `_render_audit_agent_*.js`, `_render_audit_gate.js` (cross-ref [`.cursor/rules/render-audit-agent-c.mdc`](.cursor/rules/render-audit-agent-c.mdc)).

Cross-ref **A2/B2** image + CRO items · **§C2 Image fallbacks** · **§C3 CRO card**.

---

## §C2 Image fallbacks

Runbook stub for image provider rotation and render-time `onerror` swap. **Full law:** [`GOLDEN_TEMPLATE_TOP10.md` §6 IMAGE SOURCING](GOLDEN_TEMPLATE_TOP10.md#6-image-sourcing--alternate-pollinations--ddg) (shared with Q&A — cross-ref [`GOLDEN_TEMPLATE_QA.md` §6](GOLDEN_TEMPLATE_QA.md)).

| Rule | Detail |
|------|--------|
| **Provider rotation** | Strict **DDG ↔ Pollinator (flux) alternation** via `_image_provider_alternate.js`; **15s floor** (`FLOOR_MS` / `waitForProvider()`); hero/face-card slot always tries Pollinator first |
| **Self-host only** | Every fetch through `storeGradedImage()` → `/assets/qa/…` — **no live `pollinations.ai` URLs in blobs** |
| **Render `onerror`** | `entryImgAttrs()` in `pulse-machine-entry.js` — every rendered `<img>` gets `onerror` + optional `data-fallback` (wsrv → direct retry); writers never emit handlers in blobs |
| **Broken image** | Hard FAIL — blocks certify/publish (Agent B · rubric #12 · `IMAGE_DEAD` / `IMAGE_PLACEHOLDER`) |
| **Top 10 hero** | **Only required image** — `fetchpriority="high"`, no lazy loading, `width="1200"` `height="630"`, descriptive topic alt, `onerror` fallback via `entryImgAttrs()` (A2 item **6**) |
| **Top 10 item images** | Optional `@@PRODUCT img=` per rank — if present, follow §C2 (provider rotation + `onerror` law) |

Cross-ref **DEFAULTS:** Hero image dimensions **1200×630**.

---

## §C3 CRO card (renderer-injected)

Runbook stub for the **CRO Syndicate hanging-card widget** on **both** golden templates. Synced from [`GOLDEN_TEMPLATE_TOP10.md` §0.1](GOLDEN_TEMPLATE_TOP10.md#01-cro-syndicate-swinging-card-required-on-every-page) · [`GOLDEN_TEMPLATE_QA.md` §0.1](GOLDEN_TEMPLATE_QA.md#01-cro-syndicate-swinging-card-required-on-every-page). **Production code:** `insertCroAd()` / `croAdCard()` / `croMobileCard()` in `netlify/functions/pulse-machine-entry.js`. **Standalone reference:** [`components/cro-card.html`](components/cro-card.html) + [`css/cro-card.css`](css/cro-card.css) (spec-exact rebuild pair — use when the live renderer widget is missing).

#### Template A (Top 10) — mobile after item #5

On ranking lists, **one** CRO Syndicate swinging card per page — renderer-injected, never in blob:

| Viewport | Placement |
|----------|-----------|
| **Desktop ≥768px** | **Fixed-right** viewport card with **cord + clothespin swinging animation** (`cro-sway`; honor `prefers-reduced-motion: reduce`) — not spliced into article flow |
| **Mobile <768px** | Fixed-right **disabled**; same swinging card **inline full-width after item #5** — after `#5` `product-card` closes, before `## 6.` |

> **Code note:** Live renderer splices at rank **#3** (`afterTop10Item3Card()`); owner law requires **after item #5** on mobile — align code in a separate task.

#### Template B (Q&A) — mobile before Related questions

On Q&A essays, **one** CRO Syndicate swinging card per page — renderer-injected, never in blob:

| Viewport | Placement |
|----------|-----------|
| **Desktop ≥768px** | **Fixed-right** viewport card with **cord + clothespin swinging animation** (`cro-sway`; honor `prefers-reduced-motion: reduce`) — not spliced into article flow |
| **Mobile <768px** | Fixed-right **disabled**; same swinging card **inline full-width before Related questions section** — **here** = immediately after the **last depth-section H2 block**, before `<h2>Related questions</h2>` (`afterQaEssayCroPos()`) |

> **Code note:** Live renderer today splices earlier (`afterQaEssayCroPos()` — DA → text → first `<figure>` → following `</p>`); owner law requires **after last depth-section H2, before Related questions** — align code in a separate task.

#### Insertion-point table (both templates)

| Viewport | Template A (Top 10) | Template B (Q&A) |
|----------|---------------------|------------------|
| **Desktop ≥768px** | **Fixed-right** viewport card with **cord + clothespin swinging animation** (`cro-sway`; honor `prefers-reduced-motion: reduce`) | Same fixed-right swinging card |
| **Mobile <768px** | Fixed-right **disabled**; same swinging card **inline full-width after item #5** (after `#5` `product-card` closes) | Fixed-right **disabled**; inline full-width **before Related questions section** — after last depth-section H2, before `<h2>Related questions</h2>` (`afterQaEssayCroPos()`) |

| Rule | Detail |
|------|--------|
| **Renderer-injected only** | **Never** store CRO markup in answer blobs — `stripBlobCro()` / `_cro_strip_lib.js` · writers must not add `<aside class="cro-ad">`, CRO HTML, or `/assets/kory-white.jpg` portrait images in blobs |
| **One instance** | Exactly **one** CRO card per rendered page — no duplicates |
| **Widget** | CRO Syndicate **hanging-card** — CSS cord + clothespin (`.cro-cord` / `.cro-peg` or `.cro-card-cord` / `.cro-card-pin`), **crimson/oxblood** palette, **Calendly** primary CTA (`Book a Call →`) |
| **Dismiss** | **`localStorage.croCardDismissed = "1"`** — hide on load if set; × click sets key and hides card (`components/cro-card.html`). Live renderer today uses **`sessionStorage`** keys `croX` / `croMobX` — do not alter dismiss UX without owner passcode **4444** |
| **Gate** | Top 10 §7 row **17** · Q&A §6 row **18** · DEFAULTS: **CRO card missing** |

Cross-ref **A2 item 10** (Top 10) · **B2 item 9** (Q&A).

---

## Pipeline steps — Phases 2–7 (in order)

**Prerequisite:** Phase 0 + Phase 1 complete. Phase 2 classify is detailed above; Phases 3–7 below.

| Phase | Step | Detail |
|-------|------|--------|
| **2** | **CLASSIFY** | `pickGoldTemplate(id, body, title)` — lock `template`, `goldId`, `goldUrl`, `reason` before any draft |
| **3** | **SEED** | Assign id, pillar, question; load the locked gold outline (`QA_TEMPLATE_OUTLINE` / `TOP10_TEMPLATE_OUTLINE`) |
| **4** | **GENERATE** | `seedWrite` → `fixEntry` — new copy + new images per entry, written into the classified shape only |
| **5** | **SCORE + SURGICAL FIX** | `entryScrubPipeline` / `gradeEntry` + `rubricSignOff` + gold audit; fix failing checkpoints only; re-verify gold structure after every edit; loop until pass |
| **6** | **VALIDATE** | Entry-level gates + spec-doc `validate-golden.mjs` when golden `.md` files change — see [Validation gate](#validation-gate) |
| **7** | **CERTIFY** | No publish below **13/13** — rubric (`SCRUBBER_SPEC.md`) + gold audit clean + §6/§7 checklist all green |

**Do not:** regenerate/restyle gold template definitions · freestyle structure · prepend Q&A hero on Top 10 · inject `@@PRODUCT` into Q&A · publish before 13/13 · switch template mid-run · merge template elements across types.

---

## DEFAULTS TABLE (use instead of asking)

**Never ask the user.** Every decision is pre-made below. If something is not covered — in this table, the two golden specs, pipeline law, or `SCRUBBER_SPEC.md` — log the assumption to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md) (format: [Assumption logging](#assumption-logging-mandatory) below) and **keep going** — never stop and wait for owner input.

| Situation | Default |
|-----------|---------|
| **Unknown** | Log assumption to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md); apply conservative default; continue without asking |
| Author name | Kory White |
| Canonical domain | https://pulserevops.com |
| N when phrase is "best of" with no number | **10** — pattern B; only when pattern A (explicit number) did not match |
| Extract N — both pattern A and B match title | **A wins** — e.g. *Best 7 of 2027 Blenders* → `\bbest\s+7\b` → **N = 7**; `\bbest\s+of\b` never reached (`rankCountFromTitle` order) |
| Hero image dimensions | 1200×630 |
| `datePublished` if unknown | Git first-commit date of the file; else today |
| `dateModified` | Today at generation time |
| Internal link targets | 2–3 most topically related pillar pages by slug/keyword match |
| **Calendly URL** | Reuse repo's existing one; else `https://calendly.com/PLACEHOLDER` |
| Article max-width | 760px |
| Breakpoint | 768px |
| YMYL disclaimer | This is general information, not professional medical, legal, or financial advice. Consult a qualified professional for your situation. |
| Template ambiguous — title says "best" but body is essay prose | **Q&A** — essay body shape wins (`title_suggests_ranking_but_body_is_essay_qa`) |
| Template ambiguous — ranking markers in body (`## N.`, `@@PRODUCT`, 🏆/💎) | **Top 10** — `isRankingListBody(body, title)` wins |
| Title has explicit N outside 3–10 (e.g. "Top 15") | Clamp to **N = 10** — `Math.min(10, Math.max(3, N))` |
| Q&A sub-type unclear | Precedence: **YESNO** → **DEFINITION** → **PROCESS** → **BESTPICK**; set `data-subtype` on `<article>` |
| Pillar not specified | Infer from URL slug or question keywords; else **`knowledge`** (treat "`general`" as same bucket) |
| Hero image — Q&A | **Optional** (visual topics only; same rules as A) — after Direct Answer + intro prose; **no top hero before DA** |
| Hero image — Top 10 | **Required** — one face-card hero immediately after Direct Answer, before "How We Ranked These Products" |
| Word count below floor | Expand depth sections surgically — Q&A **≥600** (target ≥800; YESNO may ship 600–799); Top 10 **≥800**; never pad |
| YMYL unclear | Treat **health/medicine, money, legal, insurance** (and adjacent) as YMYL — ≥2 authoritative citations + YMYL disclaimer row above; general hobby content is non-YMYL unless medical/veterinary advice |
| Sources — non-YMYL | Cite statistical/factual claims only; still ≥5 real, live (HTTP 200/301), named sources overall |
| Image provider failure | Alternate **DDG ↔ Pollinator** strictly; **15s floor** between generates |
| Broken image | Hard fail that slot only — swap at same slot, same count, same rhythm |
| CRO card missing / not rendering | Rebuild render-time CRO Syndicate widget per **§C3** — desktop fixed-right; mobile: Top 10 after item **#5**, Q&A after last depth-section H2 before Related questions; never in blob |
| Fix pass limit | **`maxRounds: 6`** in `entryScrubPipeline`; on exhaust without 13/13 → HOLD queue + log |
| Score 12/13 (or any partial) | Surgical fix on failing criterion only; re-verify gold audit after every edit |
| Commit / publish below 13/13 | **Do not** — bypass gold shape only with owner passcode **4444**, logged in assumptions |
| Long batch requested | **One pillar per Agent session**, smallest page-count pillar first |
| Item count 3–9 (not exactly 10) | Valid ranking-list shape; grade via `auditRankingListMaster`, not full `aq1158` audit (requires N = 10) |
| Image dedupe exhausted | Re-query with varied term from title/pillar; flag `IMAGE_DUPLICATE` only after requery attempts exhausted |
| Title and body disagree on template | **Body shape wins** — essay → `qa`, ranked list → `top10` |
| Owner passcode (**4444**) needed but not given | Do **not** bypass immutable gold shape; hold entry, log blocker, continue other work |

---

## Assumption logging (mandatory)

**Never ask the user a clarifying question mid-run.** Instead:

1. Apply the closest matching DEFAULT above (or the most conservative, template-compliant choice if none matches exactly).
2. Append one row/entry to [`logs/golden-template-assumptions.md`](logs/golden-template-assumptions.md) with: date, what was ambiguous, the DEFAULT/assumption applied, and why.
3. Continue the run — do not block on it.

---

## Validation gate

Two independent gates, both required before publish:

1. **Entry-level gate (runtime, per generated page)** — `rubricSignOff()` (13/13 content rubric) **+** `auditQaGoldTemplate()` / `auditTop10GoldTemplate()` (`compliant: true`, `issues: []`) **+** the numbered §6/§7 checklist (19 items Q&A / 20 items Top 10) all green **+** human viewport check @375px + @1440px. See `SCRUBBER_SPEC.md` for the full rubric.
2. **Spec-doc gate (static, whenever `GOLDEN_TEMPLATE_*.md` changes)** — [`validate-golden.mjs`](validate-golden.mjs):
   ```bash
   node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
   node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md
   ```
   Exit 0 only on 13/13 structural checks (gate heading, 18-row Pass-condition table, required check rows, full numbered checklist, Forbidden section, gate-tier table, gold-audit references, word-floor + legacy-2,000-waiver text, schema + CRO render-only law, companion cross-reference). Non-zero exit **blocks** editing that spec further until fixed.

**No publish below 13/13 on gate 1. No spec-doc edit ships below 13/13 on gate 2.** Bypass only with owner passcode **4444**, and only for immutable shape law — never for rubric, broken images, or gold-audit failures.

---

## Locate by search (quick keyword lookup)

Repo-wide keyword → file/section map. Jump straight to the law instead of re-reading full specs every session.

| Keyword / topic | File | Section |
|---|---|---|
| Classify / router | `_pulse_gold_template_router.js` | `pickGoldTemplate()` · this file [PHASE 2](#phase-2--classify-before-generate) |
| Detection regex (Top 10) | `GOLDEN_TEMPLATE_TOP10.md` | §1 DETECTION · this file [A1](#a1-detection) |
| Detection regex (Q&A) | `GOLDEN_TEMPLATE_QA.md` | §1 DETECTION · this file [B1](#b1-detection-only-when-a-doesnt-match) |
| Sub-type (YESNO/DEFINITION/PROCESS/BESTPICK) | `GOLDEN_TEMPLATE_QA.md` | §1 Classify sub-type · this file B1 Subtypes |
| Direct Answer | both golden specs | §2 REQUIRED PAGE STRUCTURE |
| Hero image | both golden specs | §2 (Top10 item 6 / Q&A item 5) · this file **§C2** |
| Byline / dateModified | both golden specs | §2 · this file DEFAULTS: Author name / `dateModified` |
| Schema / JSON-LD | both golden specs | §3 SCHEMA · this file [A3](#a3-schema--one-json-ld) / [B3](#b3-schema--one-json-ld) |
| HTML skeleton | both golden specs | §4 HTML SKELETON |
| Rendering / mobile parity | both golden specs | §5 RENDERING RULES · this file **§C1** |
| Image sourcing / providers | `GOLDEN_TEMPLATE_TOP10.md` | §6 IMAGE SOURCING · this file **§C2** |
| CRO card / swinging widget | both golden specs | §0.1 · this file **§C3** |
| Quality gate / pass condition | `GOLDEN_TEMPLATE_QA.md` §6 · `GOLDEN_TEMPLATE_TOP10.md` §7 | this file [A4](#a4-quick-checklist) / [B4](#b4-quick-checklist) |
| Word floor | both golden specs | Compliance § Word count · this file DEFAULTS |
| Internal links | both golden specs | Compliance § Internal links · this file DEFAULTS |
| Forbidden (passcode 4444) | both golden specs | `## Forbidden` |
| Gold audit failure codes | both golden specs | `## Gold audit — common failure codes` |
| Supersession / deletions | this file | [PHASE 1](#phase-1--supersession-destructive-no-confirmation) · `logs/golden-template-supersession.md` |
| Assumptions / defaults | this file | [DEFAULTS TABLE](#defaults-table-use-instead-of-asking) · [Assumption logging](#assumption-logging-mandatory) |
| Session handoff | `logs/golden-template-run.md` | Current state + Session history |
| Spec-doc validator | `validate-golden.mjs` | Usage in [Validation gate](#validation-gate) |
| 13-point content rubric | `SCRUBBER_SPEC.md` | Full rubric |
| Visual lock (writers/images) | `.cursor/rules/visual-lock-law.mdc` | Full law |

**Search keywords:** `goat`, `golden template`, `aq1158`, `q11133`, `gold reference`, `immutable template`, `validate-golden`, `pickGoldTemplate`, `direct-answer-box`, `croAdCard`, `entryImgAttrs`.

---

## Other agent docs

| Doc | Purpose |
|-----|---------|
| `AGENTS.md` | Repo-wide agent entry point |
| `SCRUBBER_SPEC.md` | 13/13 rubric, images, generation gate |
| `.cursor/rules/golden-templates.mdc` | Cursor rule — mandatory pointer to this file + the two golden specs |
| `.cursor/rules/pipeline-template-law.mdc` | Pipeline process law (classify → generate → fix → certify) |
| `.cursor/rules/visual-lock-law.mdc` | Writer/image visual-lock law |
| `_CROSSOVER.md` | Session handoff, deploy, batch status |
| `logs/golden-template-run.md` | Session handoff (resume source) |
| `logs/golden-template-supersession.md` | Phase 1 deletion/replacement audit |
| `logs/golden-template-assumptions.md` | Assumption log for this pipeline (never ask — log instead) |
