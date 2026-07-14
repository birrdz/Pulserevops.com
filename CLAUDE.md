# CLAUDE.md — pulserevops.com

## Q&A GENERATION — MANDATORY LAW

**Golden template law (sole doc sources of truth — read before every Q&A generation task):**

- `GOLDEN_TEMPLATE_TOP10.md` — Top 10 / listicle-intent (aq1158)
- `GOLDEN_TEMPLATE_QA.md` — Q&A essay (q11133)
- `GOLDEN_TEMPLATE_STYLE.md` — Style outfit guide (sy0001) · cover + 3 men + 3 women ages

**Pipeline process:** `PIPELINE_TEMPLATE_LAW.md` · `.cursor/rules/pipeline-template-law.mdc`

- Classify → select golden template → generate → score 13/13 → surgical fix loop → publish only at 13/13.
- Companion rubric: `SCRUBBER_SPEC.md` (the 13-point gate).
- Two golden templates only — never edited, never merged, never a third.
- Run the SESSION START CHECKLIST in `PIPELINE_TEMPLATE_LAW.md` before the first generation of any session.

**🔒 IMAGE PASS LAW (change only with `4444`):** approve images **for the pillar being worked** — usable as **face and/or top internal** (same URL) → write face → write top → next. Manual 1-by-1. Dupes OK. No Pollinations wait / no unsupervised batch. → `.cursor/rules/manual-image-pass-law.mdc` · `MANUAL_IMAGE_LAW.md`

## 🔒 DEPLOY LAW (permanent · 2026-07-11) — canonical: `DEPLOY_LAW.md`

1. **Classify every change first.** CONTENT/DATA (entries, bodies, images, scores, index rows) → **Blobs only, NEVER deploy**. CODE/TEMPLATE/ASSET (function, renderer, `.js`/`.css`/static, redirect) → **queue for the daily deploy**.
2. **`--prod` deploys: max ONCE/day**, at the end of the last machine run, and **only if the code queue is non-empty**. No queued code = no deploy that day.
3. **Draft deploys are FREE** (`netlify deploy`, no `--prod`) — test freely.
4. **Never misclassify code as content** to dodge a deploy — classify honestly.
5. **Exception:** operator says **"deploy now"** → urgent deploy allowed.
6. **Log every deploy** (date · what shipped) in `DEPLOY_LAW.md` — track monthly count vs the old ~$200/mo burn.

## 🔒 LAW-DOM (2026-07-14) — "wrong image/title on the page" is a RENDER-PATH bug, NEVER re-patch the picker

If the fixer/daily-driver "applies" an image or title but the LIVE page still shows the old one, DO NOT touch the image picker / Pexels logic. The picks are fine; they don't REACH the page. Root-cause the render path in order:
1. Fetch the LIVE rendered DOM of ONE affected entry. Get the exact face-card `<img src>` and where the `<h1>` title comes from.
2. Trace that src backward to the code line: which field/file does the TEMPLATE actually read? (`pulse-machine-entry.js` hero = CONSTRUCTED `/assets/qa/<id>.jpg`, line ~1051/1067 — it ignores blob.img/_index.json/pool.)
3. Confirm the WRITER writes that EXACT path, AND that the live READ path serves it (blob reader fn + netlify.toml redirect `force`). A write returning `live:true` is NOT proof — only a live DOM fetch is.
4. Known trap: `/assets/qa/*` was `force=false` (static-first) → stale deployed baked-title files won; and the `pulse-qa-asset` blob reader fn was 404 live. Clean images sit in blob `qa-bin/` unreached. Fix = `force=true` + working deployed reader fn, then DOM-verify.
Full post-mortem: `sim/LESSONS.md` (2026-07-14 row).

## 🔒 IMAGE ACQUISITION CONTRACT (2026-07-14) — applies to BOTH daily driver AND fixer image slots
Per image slot: DeepSeek generates a **2–4 word concrete-noun Pexels query** from the topic — NEVER the title verbatim (an airplane article gets an airplane photo). Fetch **top 5 candidates**; score by **keyword overlap between the Pexels alt-text and the topic nouns**; **zero overlap → next query variant, never apply blind.** TOP_LIST item images derive their query from **each item's own text**; **pHash dedup** so every image in an entry is distinct. ALL image applies go through the ONE choke-point writer (`putQaAsset` → blob `qa-bin/<id>.jpg`, the field the template reads) — same function for fixer + daily driver. Pexels-only.
