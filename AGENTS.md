# PULSE — Agent entry point (Claude Code / Cursor)

**Local dev:** `C:\Users\koryj\website` · Live: https://pulserevops.com

**Cursor Agent mode entry point:** [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) — complete, self-contained execution spec (Claude Code equivalent: `CLAUDE.md` + `PIPELINE_TEMPLATE_LAW.md`). Read it first for any classify/generate/fix/certify task run inside Cursor.

## 🔒 GOAT — two golden templates (ONLY shapes for new Q&A)

Every pipeline entry is **exactly one** of these. Structure is **immutable**; copy and images are **new per entry**.

| Goat | Type | ID | Live URL | Code |
|------|------|-----|----------|------|
| **🐐 #1** | **Top 10 ranking list** (listicle-intent, any pillar) | `aq1158` | https://pulserevops.com/aquariums/aq1158 | `_ranking_top10_gold_template.js` |
| **🐐 #2** | **Q&A essay** | `q11133` | https://pulserevops.com/knowledge/q11133 | `_qa_gold_template.js` |

**Authoritative template law — read ONLY these two files (no other golden-template docs):**

| File | Shape | Gold ref | §7 gate |
|------|-------|----------|---------|
| [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) | Top 10 / listicle-intent | aq1158 | **§7 Pass condition** · 20-item checklist |
| [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) | Q&A essay | q11133 | **§7 Pass condition** · 19-item checklist |

Each file owns: detection, page structure, CRO (§0.1), schema, HTML skeleton, rendering, image sourcing, **§7 QUALITY GATE**, and **Compliance** (13/13, word floor ≥800, visual lock). **Sole doc sources of truth** — no other golden-template markdown.

**Cursor Agent execution spec:** [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) — self-contained runbook (HOW TO RUN THIS IN CURSOR, session checklist, DEFAULTS, assumption logging, validation gate). Read this first in a fresh Cursor session, before the two specs above.

**Cursor rule:** `.cursor/rules/golden-templates.mdc` (`alwaysApply: true`) — mandatory pointer to `CURSOR_GOLDEN_TEMPLATES.md` + the two golden specs; wired alongside `.cursor/rules/pipeline-template-law.mdc`.

**Spec-doc validator:** [`validate-golden.mjs`](validate-golden.mjs) — structural linter for the two `GOLDEN_TEMPLATE_*.md` files themselves (18-row gate table, full numbered checklist, schema/CRO law, word floor, cross-refs). Run after editing either spec:

```bash
node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md
node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md
```

**Router (classify before generate):** `_pulse_gold_template_router.js` → `pickGoldTemplate(id, body, title)`

**Pipeline process:** `.cursor/rules/pipeline-template-law.mdc` · **Rubric:** `SCRUBBER_SPEC.md`

**Search keywords:** `goat`, `golden template`, `aq1158`, `q11133`, `gold reference`, `immutable template`, `validate-golden`

**Title / face-card (2026-07-14):** sole rule in [`CLAUDE.md`](CLAUDE.md) → **TITLE / FACE-CARD LAW**. Do not scan `_HANDOFF_NEXT_CLAUDE.md` “CSS overlay, never baked” — that line is **revoked**.

## Other agent docs

| Doc | Purpose |
|-----|---------|
| `CURSOR_GOLDEN_TEMPLATES.md` | Cursor Agent execution spec — runbook, DEFAULTS, validation gate |
| `validate-golden.mjs` | Structural validator for the two golden-template spec docs |
| `.cursor/rules/golden-templates.mdc` | Cursor rule — mandatory pointer to golden template law |
| `SCRUBBER_SPEC.md` | 13/13 rubric, images, generation gate |
| `_CROSSOVER.md` | Session handoff, deploy, batch status |
| `content/editor/README.md` | Editor / quality path |
| `content/deployer/INDEX.md` | Deploy mirror `pulse-deploy-clean` |
