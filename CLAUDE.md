# CLAUDE.md — pulserevops.com

**Agents: do not scan `_HANDOFF_NEXT_CLAUDE.md` / old crossovers for title rules.** Those files contain revoked “CSS overlay, never baked” notes. Title law is **only** the section below (+ this file).

## Q&A GENERATION — MANDATORY LAW

**Golden template law (sole doc sources of truth — read before every Q&A generation task):**

- `GOLDEN_TEMPLATE_TOP10.md` — Top 10 / listicle-intent (aq1158)
- `GOLDEN_TEMPLATE_QA.md` — Q&A essay (q11133)

**Pipeline process:** `PIPELINE_TEMPLATE_LAW.md` · `.cursor/rules/pipeline-template-law.mdc`

- Classify → select golden template → generate → score 13/13 → surgical fix loop → publish only at 13/13.
- Companion rubric: `SCRUBBER_SPEC.md` (the 13-point gate).
- Two golden templates only — never edited, never merged, never a third.
- Run the SESSION START CHECKLIST in `PIPELINE_TEMPLATE_LAW.md` before the first generation of any session.

---

## TITLE / FACE-CARD LAW (owner 2026-07-14) — CURRENT REQUIREMENT

**This overrides any older “title overlay / keep old JPG / CSS-only title on face” notes in prior threads.**

### Who owns the title

1. **Format Fixer** (`/format-fixer-full`) — **content + structure only.** Never changes image URLs. Never bakes a title onto the face-card. Placeholder / fake title look is OK until Square runs.
2. **Square Builder** (same dash **under** Format Fixer daily driver, or `/square-builder` desk) — **owns the real title.** Face pick → Cursor apply **deletes** old `/assets/qa/<id>.jpg*` and writes a **brand-new** graded face with **baked gold/orange title** (`goldTitle` / `face_title_baked`). **No layering over old titled pixels** (that re-shows the stuck old title).

### Same file = face-card + top hero

- Answer-page **face-card** and **top hero** are the **same file**: `/assets/qa/<id>.jpg` (wide tile with baked title).
- Do **not** invent a second “top” image for Q&A essays — top auto-fills from face.

### Homepage square vs answer face (do not mix)

| Surface | File | Title |
|---------|------|-------|
| Homepage tall `.rcard` | `/assets/qa/<id>.sq.jpg` | **CSS under the image** — photo-only square crop |
| Answer face / top hero | `/assets/qa/<id>.jpg` | **Baked into the JPEG** (orange/gold `#FF8C1A`) |

**Never** crop the titled wide face into the homepage square band — that cuts the baked title and looks wrong.

### Answer image rhythm

- **2 text blocks → image → 2 text blocks → image** (body slots after face/top).

### Dash layout

- One page: **Format Fixer on top · Square Builder dashboard underneath** (`/format-fixer-full`).
- Order: Format Fixer pass → then Square Builder. Never reverse.
