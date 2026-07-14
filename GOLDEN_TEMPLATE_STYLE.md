# 🔒 GOLDEN TEMPLATE — Style Outfit Guide (sy*)

> **Spec for Claude Code / Cursor. Applies to Style pillar outfit / “What to wear” Q&As on pulserevops.com.**

> **Status: MANDATORY · NON-NEGOTIABLE · IMMUTABLE SHAPE**  
> **Saved:** 2026-07-13  
> **Do NOT regenerate, restyle, or “improve” the live gold reference.** Document the locked law only.  
> Each entry uses **NEW content** and **NEW outfit images** — the template **shape** is fixed.  
> **Pair specs:** `GOLDEN_TEMPLATE_QA.md` (essay) · `GOLDEN_TEMPLATE_TOP10.md` (listicle)

---

## 0. SUPERSESSION + CONTEXT

Owner 2026-07-13: **Style is goat #3** — parked pillar work resumes against this shape only.

| | |
|--|--|
| **Who** | Cursor / Claude Code, DD, Fixer, `_write_sy.js`, `_sy_conform.js`, `_dd_fixer_images.js` Style branch |
| **Scope** | Style pillar `sy*` outfit guides (“What to wear…”, occasion dress codes) |
| **Router** | `pickGoldTemplate` → `template: 'style'` when `appliesStyleGold(id, body, title)` |
| **Not this template** | Fashion Top 10 / “best of” ranking lists → **Top 10** (aq1158). Generic essay on style without 6 outfits → still **Style** if `sy*` + outfit intent |

**Code:** `_style_gold_template.js` · `_sy_writer_spec.md` (legacy detail) · `_sy_conform.js` (7-image audit)

**Immutable gold reference:** [sy0001](https://pulserevops.com/style/sy0001) — Shape law lives here + code; live quirks do not override.

---

## 1. DETECTION

`appliesStyleGold(id, body, title)` is true when **any** of:

1. ID prefix `sy` **and** not a ranking-list body (`isRankingListBody` false), **or**
2. Body has **≥6** ` ```outfit ` blocks with Men’s ×3 + Women’s ×3 age bands, **or**
3. Title matches `/what to wear|outfit|dress code|what does .+ (mean|look like)/i` **and** body has outfit fences

If title/body are ranking list → **Top 10**, not Style.

---

## 2. REQUIRED PAGE STRUCTURE (simple)

Reading order:

1. **Title** — page H1 from question (often ends “in 2027”)
2. **Cover image** — one `![…](url)` face/cover (self-hosted `/assets/qa/…`); **Style allows cover before Direct Answer** (unlike Q&A essay)
3. `## Direct Answer` — 2–4 sentences, ≥140 chars, never blank
4. `## For Men` — short intro + **exactly 3** outfit blocks: **20s / 40s / 60s**
5. `## For Women` — short intro + **exactly 3** outfit blocks: **20s / 40s / 60s**
6. Optional depth: `## How to Adapt by Age`, `## Common Mistakes` (prose; images only at existing slots)
7. `## FAQ` — ≥4 `**Question?**` + answer
8. `## Sources` — ≥4 real named sources with URLs
9. `## Related on PULSE` — internal links

**Word floor:** ≥900 (target ≥1,100). No TL;DR. No `@@PRODUCT`. No CRO in blob.

### Outfit block (exactly 6 total)

```outfit
gender: Men's
age: 20s
title: <short look name>
occasion: <entry occasion>
budget: $X–$Y
img: </assets/qa/… real full-body match — required before certify>
- <piece> | <color> | <#hex> | <brief>
- <piece> | <color> | <#hex> | <brief>
- <shoe> | <color> | <#hex> | <brief>
- <accessory> | <color> | <#hex> | <brief>
```

**Required set:** Men’s 20s, 40s, 60s + Women’s 20s, 40s, 60s. Looks must differ by age (not copy-paste).

---

## 0.1 CRO (same as other goats)

Render-time only (`insertCroAd`). Desktop fixed-right swinging card. Mobile inline after last depth H2 before FAQ/Related. **Never in blob.**

---

## 3. SCHEMA / RENDER

- Renderer: `pulse-machine-entry.js` — outfit fences → cards; Direct Answer gold box
- Face card: `/assets/qa/{id}.jpg` (+ `.sq.jpg`)
- Images: self-host only; no live `pollinations.ai` in blobs
- Visual lock: writers change **prose/outfit text** only — image pipeline swaps `img:` / cover at existing slots

---

## 4. IMAGE LAW (Style-specific)

| Slot | Rule |
|------|------|
| **Cover / face** | Clean photo; may dupe to top internal |
| **6 outfits** | One real matching full-body URL per block (`img:`) |
| **Rhythm** | No two markdown images stacked without text |
| **Fill path** | `_sy_outfit_img.js` / DD Style branch — thematic match to garments |

---

## 5. FORBIDDEN

- Ranking `## N.` + `@@PRODUCT` on Style outfit guides (that's Top 10)
- Fewer or more than **6** outfit blocks
- Missing `age:` or missing gender band coverage (must hit 20s/40s/60s × M/W)
- Blank Direct Answer
- CRO / widgets in blob
- Live pollinations URLs
- Claiming Style “done” because it is parked

---

## 6. QUALITY GATE — Pass condition

Publish / un-park only when **all** rows pass + content rubric **13/13** (Style checks in `grade-entry.js` / `auditStyleGoldTemplate`).

| # | Check | Pass |
|---|--------|------|
| 1 | Direct Answer present, ≥140 chars | yes |
| 2 | Cover / face image present | yes |
| 3 | `## For Men` + `## For Women` | yes |
| 4 | Exactly 6 ` ```outfit ` blocks | yes |
| 5 | Men’s 20s, 40s, 60s each once | yes |
| 6 | Women’s 20s, 40s, 60s each once | yes |
| 7 | Every block has non-empty `img:` (self-hosted) | yes |
| 8 | FAQ ≥4 | yes |
| 9 | Sources ≥4 | yes |
| 10 | Related on PULSE | yes |
| 11 | Words ≥900 | yes |
| 12 | No `@@PRODUCT` / no TL;DR / no live pollinations | yes |
| 13 | Gold audit `auditStyleGoldTemplate` → `compliant: true` | yes |
| 14 | Visual lock respected (no writer-added extra image slots) | yes |
| 15 | CRO render-only | yes |
| 16 | No stacked images | yes |
| 17 | Outfit `img:` topical to described look | yes |
| 18 | Classify locked as `style` before generate | yes |

### Checklist (agents)

1. Classify `style` via router — lock — never switch mid-run  
2. Cover + Direct Answer  
3. Six outfits, age bands complete  
4. Fill all `img:` before certify  
5. FAQ + Sources + Related  
6. Word floor  
7. `auditStyleGoldTemplate` clean  
8. Rubric 13/13  
9. No hybrid with Top 10 / Q&A essay shape  

---

## 7. COMPLIANCE

| Rule | Value |
|------|--------|
| Publish gate | **13/13** + Style gold audit |
| Word floor | ≥900 |
| Visual lock | Writers: prose + outfit lines only |
| Bypass shape | Owner passcode **4444** only |
| Park vs done | Parked ≠ done; un-park only after formula+gate |

**Companion:** [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) · [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) · [`_sy_writer_spec.md`](_sy_writer_spec.md)
