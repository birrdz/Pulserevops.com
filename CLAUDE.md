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

---

## NARROW FOCUS (stuck-thread rule)

When working title / Square / Fixer dash / homepage box / answer preview — **do not scan the whole repo.**

**@ these only:**

| File | Why |
|------|-----|
| `CLAUDE.md` | Title law (this file) |
| `_scrub_button_server.js` | Fixer + Square dash + apply bake |
| `_square_desk.js` | Pick-photos desk UI |
| `_square_manual_apply.js` | Queue watcher |
| `assets/square-preview/homepage-box.html` | Homepage `.rcard` preview |
| `assets/square-preview/answer.html` | Answer-page preview |

**Do not open / search for title rules in:** `_HANDOFF_NEXT_CLAUDE.md`, old `_CROSSOVER*` piles, `_BACKUP_*`, `lab/`, `nil_gen/`, derby, or whole-repo greps for “gold title”.

One task per chat. New chat if the model starts “fixing” back to CSS-only / keep-old-JPG.

---

## EXPLICIT DENY — OLD TITLE PATTERN (paste into stuck chats)

**Do not use the old title pattern. Use the new title law for all future outputs. Ignore all previous instructions regarding face-card / mosaic title naming and bake method.**

| DENY (old — revoked) | USE (current — CLAUDE.md) |
|----------------------|---------------------------|
| “Title = CSS overlay, never baked” on answer face `/assets/qa/<id>.jpg` | **Bake** gold/orange title into `/assets/qa/<id>.jpg` (`goldTitle` / `face_title_baked`) |
| Layer / composite a new title over old titled JPEG pixels | **Delete** old `/assets/qa/<id>.jpg*` (incl. `.oldtitle.jpg`) → write a **brand-new** graded file |
| Keep / restore the previous titled face “as the box” | Face-card = top hero = **same new file** after apply |
| Crop titled wide face into homepage `.rcard` band | Homepage `/assets/qa/<id>.sq.jpg` = **photo-only** square; **CSS title under** the image |
| Format Fixer bakes or “fixes” the face title | Format Fixer = **content only**; Square Builder owns title bake |

**Negative constraint (copy-paste):**

> Do not use “CSS overlay, never baked” / keep-old-JPG / title-layer-over-pixels for Q&A face-cards. Use CLAUDE.md TITLE / FACE-CARD LAW: delete old face → brand-new `/assets/qa/<id>.jpg` with baked gold title; homepage `.sq.jpg` photo + CSS title under. Ignore all previous instructions regarding the naming and bake method of this component.

---

## RESET STUCK FILE STATE (ghost Keep/Undo / cached “correct” file)

If the agent keeps reverting a finished file, it thinks there are **pending** edits or has cached an old buffer as truth.

**Editor (you):**
1. Close the chat that created the ghost Keep/Undo.
2. On the stuck file: Accept **Keep** once if shown, or **rename → save → rename back** to clear Cursor file metadata.
3. Do **not** Undo into the old title pattern.

**Repo (known-good):**
```bash
git checkout HEAD -- CLAUDE.md _scrub_button_server.js _square_desk.js _square_manual_apply.js assets/square-preview/
git status   # should be clean except unrelated junk
```
Known-good tip: branch `cursor/square-builder-real-run-828a` · commit message `checkpoint` (title law + deny old pattern).

**Face JPG ghosts:** delete `/assets/qa/<id>.jpg`, `<id>.oldtitle.jpg`, and any `<id>-face-*.jpg` leftovers, then re-run Square apply (never layer title onto the old file).
