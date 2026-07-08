# PULSE Style (sy) Writer Spec v2 — 2026-06-27 (owner: "3 men and 3 women in ages per Q&A")

Style/fashion Q&As. Each entry answers a "What to Wear to/for ..." question with
**SIX outfit recommendations: 3 men + 3 women, each spanning a different AGE band**,
and a REAL matching image for every single outfit.

## The 6 outfit blocks (REQUIRED, exactly this set)
For the entry's occasion, give age-appropriate looks:
- **Men's · 20s** (young professional / early-career)
- **Men's · 40s** (established / mid-career)
- **Men's · 60s** (senior / distinguished)
- **Women's · 20s**
- **Women's · 40s**
- **Women's · 60s**

Each look is tailored to BOTH the occasion AND that age band (cut, formality,
trend-vs-classic shift with age) — not the same outfit relabeled.

## Outfit block format (the renderer turns each into a styled card + its image)
```outfit
gender: Men's
age: 20s
title: <short look name>
occasion: <the entry's occasion>
budget: $X–$Y
img: <REAL full-body photo URL matching THIS gender+age+garments — or leave blank; the DDG lane fills it>
- <piece> | <color> | <#hex> | <brief detail>
- <piece> | <color> | <#hex> | <brief detail>
- <piece> | <color> | <#hex> | <brief detail>
- <shoe>  | <color> | <#hex> | <brief detail>
- <accessory> | <color> | <#hex> | <brief detail>
```
Rules:
- **`age:` is required** on every block (20s / 40s / 60s).
- **`img:`** = a real matching photo if you have a reliable one; otherwise leave the
  line OFF — the DDG lane (`_sy_outfit_img.js`) sources + inserts a real matching
  photo per block (full body, gender + age + the named garments). The image MUST
  match the described look (blue suit + brown shoes → a photo of that).
- 4–6 garment lines, head-to-toe (top, bottom/dress, shoe, +1–2 accessories).
- Real, well-known brands only in prose; **no fabricated brands/prices/stats**. Cost as ranges.

## Body structure (qa-style, deploy-free publish)
1. **Line 1 = leading cover image** (placeholder ok; DDG cover lane upgrades it):
   `![<topic> in 2027](https://image.pollinations.ai/prompt/<topic>%20outfit%20flat%20lay)`
2. `# <exact title — ends "in 2027">`
3. `## Direct Answer` — 2–4 sentences answering immediately.
4. `## For Men` — intro + the 3 men's ```outfit blocks (20s/40s/60s).
5. `## For Women` — intro + the 3 women's ```outfit blocks (20s/40s/60s).
6. Optional: `## How to Adapt by Age`, `## Common Mistakes`.
7. `## FAQ` — ≥4 `**Question?**` + answer pairs.
8. `## Sources` — ≥4 reputable references.
9. Dateline: `*Published June 2027 · Updated June 2027*`.
- ≥900 words. No TL;DR. No banned words (landscape, delve, dive, tapestry, seamless,
  cutting-edge, state-of-the-art). The CRO card is auto-injected on publish.

## Publish / fix
- New: `node _write_sy.js <id> "<title>"` (body at `C:/Users/koryj/<id>_answer.md`),
  or the existing publishTextFirst path. Existing-entry rewrites: overwrite the
  answer blob in place (deploy-free), keep the same id/URL.
- After writing blocks, run `node _sy_outfit_img.js <id>` to fill real per-outfit images.
