# CLAUDE.md — pulserevops.com

## Q&A GENERATION — MANDATORY LAW

**Golden template law (sole doc sources of truth — read before every Q&A generation task):**

- `GOLDEN_TEMPLATE_TOP10.md` — Top 10 / listicle-intent (aq1158)
- `GOLDEN_TEMPLATE_QA.md` — Q&A essay (q11133)

**Pipeline process:** `PIPELINE_TEMPLATE_LAW.md` · `.cursor/rules/pipeline-template-law.mdc`

- Classify → select golden template → generate → score 13/13 → surgical fix loop → publish only at 13/13.
- Companion rubric: `SCRUBBER_SPEC.md` (the 13-point gate).
- Two golden templates only — never edited, never merged, never a third.
- Run the SESSION START CHECKLIST in `PIPELINE_TEMPLATE_LAW.md` before the first generation of any session.

## 🔒 DEPLOY LAW (permanent · 2026-07-11) — canonical: `DEPLOY_LAW.md`

1. **Classify every change first.** CONTENT/DATA (entries, bodies, images, scores, index rows) → **Blobs only, NEVER deploy**. CODE/TEMPLATE/ASSET (function, renderer, `.js`/`.css`/static, redirect) → **queue for the daily deploy**.
2. **`--prod` deploys: max ONCE/day**, at the end of the last machine run, and **only if the code queue is non-empty**. No queued code = no deploy that day.
3. **Draft deploys are FREE** (`netlify deploy`, no `--prod`) — test freely.
4. **Never misclassify code as content** to dodge a deploy — classify honestly.
5. **Exception:** operator says **"deploy now"** → urgent deploy allowed.
6. **Log every deploy** (date · what shipped) in `DEPLOY_LAW.md` — track monthly count vs the old ~$200/mo burn.
