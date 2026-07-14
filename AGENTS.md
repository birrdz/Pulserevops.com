# PULSE — Agent entry point (Claude Code / Cursor)

**Local dev:** `C:\Users\koryj\website` · Live: https://pulserevops.com

**Cursor Agent mode entry point:** [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) — complete, self-contained execution spec (Claude Code equivalent: `CLAUDE.md` + `PIPELINE_TEMPLATE_LAW.md`). Read it first for any classify/generate/fix/certify task run inside Cursor.

## 🔒 GOAT — three golden templates (ONLY shapes for new Q&A)

Every pipeline entry is **exactly one** of these. Structure is **immutable**; copy and images are **new per entry**.

| Goat | Type | ID | Live URL | Code |
|------|------|-----|----------|------|
| **🐐 #1** | **Top 10 ranking list** (listicle-intent, any pillar) | `aq1158` | https://pulserevops.com/aquariums/aq1158 | `_ranking_top10_gold_template.js` |
| **🐐 #2** | **Q&A essay** | `q11133` | https://pulserevops.com/knowledge/q11133 | `_qa_gold_template.js` |
| **🐐 #3** | **Style outfit guide** (`sy*` what-to-wear) | `sy0001` | https://pulserevops.com/style/sy0001 | `_style_gold_template.js` |

**Authoritative template law — read ONLY these three files:**

| File | Shape | Gold ref | Gate |
|------|-------|----------|------|
| [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | Top 10 / listicle-intent | aq1158 | **§7 Pass condition** |
| [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | Q&A essay | q11133 | **§6/§7 Pass condition** |
| [`GOLDEN_TEMPLATE_STYLE.md`](GOLDEN_TEMPLATE_STYLE.md) | Style · cover + 3 men + 3 women ages | sy0001 | **§6 Pass condition** |

Each file owns: detection, page structure, CRO (§0.1), schema, rendering, image sourcing, quality gate, Compliance. **Sole doc sources of truth.**

**Cursor Agent execution spec:** [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) — read first in a fresh Cursor session.

**Cursor rule:** `.cursor/rules/golden-templates.mdc` (`alwaysApply: true`).

**Spec-doc validator:**

```bash
node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md
```

**Router (classify before generate):** `_pulse_gold_template_router.js` → `pickGoldTemplate(id, body, title)` → `top10` | `qa` | `style`

**Pipeline process:** `.cursor/rules/pipeline-template-law.mdc` · **Rubric:** `SCRUBBER_SPEC.md`

**Search keywords:** `goat`, `golden template`, `aq1158`, `q11133`, `sy0001`, `style outfit`, `validate-golden`

## 🔒 IMAGE PASS LAW (face + top internal)

**Locked (change only with `4444`):** Owner approves images **for the pillar being worked** — usable as **face and/or top internal**. Process: **`PILLAR {NAME} FACE/TOPS`** (e.g. **`PILLAR KPI FACE/TOPS`**) — `PILLAR_X_FACE_TOPS.md` · `_manual_pillar_face_tops.js`. Write face → write top **same URL** → next. Manual 1-by-1. Dupes OK/expected. No Pollinations wait. No unsupervised pillar batch. Rule: [`.cursor/rules/manual-image-pass-law.mdc`](.cursor/rules/manual-image-pass-law.mdc) · [`MANUAL_IMAGE_LAW.md`](MANUAL_IMAGE_LAW.md).

## 🔒 SHOW AS SITE LAW

**Locked (change only with `4444`):** Owner-facing previews (face approvals, audits, spot-checks) must look **like the live site** — mosaic tile with photo + pillar chip + **full title (industry in the title)**. Rule: [`.cursor/rules/show-as-site-law.mdc`](.cursor/rules/show-as-site-law.mdc) · [`SHOW_AS_SITE_LAW.md`](SHOW_AS_SITE_LAW.md).

## Other agent docs

| Doc | Purpose |
|-----|---------|
| `CURSOR_GOLDEN_TEMPLATES.md` | Cursor Agent execution spec — runbook, DEFAULTS, validation gate |
| `validate-golden.mjs` | Structural validator for the two golden-template spec docs |
| `.cursor/rules/golden-templates.mdc` | Cursor rule — mandatory pointer to golden template law |
| `SHOW_AS_SITE_LAW.md` | Previews must match live mosaic tiles |
| `SCRUBBER_SPEC.md` | 13/13 rubric, images, generation gate |
| `_CROSSOVER.md` | Session handoff, deploy, batch status |
| `content/editor/README.md` | Editor / quality path |
| `content/deployer/INDEX.md` | Deploy mirror `pulse-deploy-clean` |
