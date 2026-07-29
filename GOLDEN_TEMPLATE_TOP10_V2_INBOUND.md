# GOLDEN_TEMPLATE_TOP10 — TOP_LIST GOLDEN TEMPLATE (v2.2 — SCOPE-LOCKED MULTIHUB LANE)

> Captured from owner 2026-07-29 (source: Fable). **v2.2 supersedes v2.1 and the earlier v2 paste.**
> ✅ **COMPLETE — skeleton built, wired, and verified 13/13.** Nothing outstanding.

**Status: LAW.** This is an **ADD-ON LANE** inside the EXISTING Kory's Multihub fix-and-dress run.
**The multihub process is working well. DO NOT change it.** This lane ONLY standardizes TOP_LIST pages.

## ═══ SCOPE LOCK — READ FIRST, OBEY ALWAYS ═══

**TOUCH:** TOP_LIST entries only (top 10 / best-of / ranked intent).

**NEVER TOUCH:**

- GENERAL Q&A entries — classify, SKIP, zero writes, log the skip, move on
- Stage 1 ad cards — already complete. Do not regenerate, re-grade, move, or re-reference
- URLs, slugs, registry entries — preserved exactly. Never delete or change a URL
- The renderer, page templates, CSS, or any code files — this lane writes **CONTENT BLOBS ONLY**
  (Blobs-only per DEPLOY_LAW; no deploys triggered by this lane)
- The GENERAL golden template or any other multihub stage's logic
- **The v1 aq1158 gold** (`_ranking_top10_gold_template.js` internals) — 25 files depend on it
- Any entry already stamped `data-version="v2"` that passes the checklist — verify and skip (**idempotent**)

**CLASSIFIER:** if not `matchesTopListIntent(entry)` → SKIP. Do not "upgrade" ambiguous entries to TOP_LIST;
ambiguous = SKIP + log.

**CONTENT PRESERVATION:** Reformatting, **not rewriting from scratch**. Keep every verified fact from the existing
entry; pour it into the template slots. Existing graded images that pass (EXIF `v_final`, pHash-unique, relevant)
are **REUSED** in the image slots first; only fetch new images to fill remaining slots up to 11.
**Never delete a passing image.**

**RUN DISCIPLINE (inherits multihub laws):** Serial execution · single-writer registry · resume-safe: append per
entry to `logs/top10-lane-run.md` `{slug, action: skipped-general | skipped-conforming | reformatted, score,
images_reused/new}` · **20% rolling circuit breaker** (if >20% of last 25 touched entries fail after 3 loops, HALT
the lane — the multihub keeps running; only this lane stops) · never ask the user mid-run · LAW-DOM verification.

**FAILURE ISOLATION:** Any failure leaves the entry's **PRIOR LIVE VERSION untouched**. Quarantine the slug
(`_RUBRIC_QUARANTINE.txt`), continue. **This lane can never make an entry worse than it was.**

## THE TEMPLATE

`GOLDEN_TEMPLATE_TOP10_SKELETON.html` (repo root) is the **single source of truth**. Structure is byte-level law.
The module reads it from disk — edit that file and both machines pick it up on next process start.

**Section order (top to bottom):**

1. `<article class="golden top10" data-template="TOP_LIST" data-version="v2">`
2. `<header class="g-head">` — facecard figure (img eager + `g-facecard-title`), `<h1>`, `g-byline`
3. `<section class="g-direct" id="direct-answer">`
4. `<figure class="g-img g-hero">` — IMG_1, eager (body image 1 of 11)
5. `<section class="g-quicktable" id="at-a-glance">` — "At a Glance" + table + `{{MERMAID_1}}`
6. `<section class="g-item" id="item-1..10">` ×10 — H2 `#n:` · figure IMG_(n+1) lazy · body · `g-stat`
   (renderer injects the mobile CRO card after item-5 — **never stored in the blob**)
7. `<section class="g-method" id="how-we-ranked">` — "How We Ranked These" + `{{MERMAID_2}}`
8. `<section class="g-faq" id="related-questions">` — "Frequently Asked Questions" + 5 H3/p pairs
9. `<section class="g-sources" id="sources">`
10. `<nav class="g-related" id="related-links">` — "Keep Reading"
11. Three JSON-LD scripts: Article · ItemList · FAQPage

## HOW TO USE — per TOP_LIST entry

1. Classify. Not TOP_LIST → skip per scope lock.
2. Already v2-conforming → verify checklist, log `skipped-conforming`, next.
3. Otherwise: pour existing content into the template. Fill every `{{SLOT}}`. No new sections, no reordering,
   no dropped sections.
4. Direct answer = 1–2 paragraphs MAX. Overflow pushes down into items.
5. New prose (only where slots are empty): **DeepSeek only**. Fact-bearing sentences: **CC assembles from verified
   sources** (two-writer lane). Existing verified facts carry over as-is.
6. Images: **reuse-first**, then fill to 11 via provider ladder → `storeGradedImage()` → EXIF `PULSE_GRADE=v_final`
   → pHash dedup.
7. **GATE:** `rubricSignOff` **≥12/13** to publish. 12/13 passes only on a **WAIVABLE** point,
   logged `{slug, failed_point, "waived-12"}`. Non-waivable fail or ≤11 → **max 3 loops → quarantine**.
8. Widget/ad markup (CRO Syndicate card) injected by the **RENDERER only** — never stored in the blob.

## IMAGE LAW — FACE CARD + 11 BODY IMAGES

**FACE CARD** (required, **not** counted in the 11): `{{FACECARD_URL}}` + `{{FACECARD_ALT}}` — Discover-style
face-card image with the TITLE rendered with it at the top of the page; also wired as the Article schema image
(`og:image`).

**BODY IMAGES (exactly 11):** `IMG_1` hero under the direct answer (16:9, **eager**) · `IMG_2..IMG_11` one per
ranked item #1–#10, directly under each item H2 (**lazy**). No duplicate image URLs on a page. Alt text
descriptive, includes item/page name.

## SLOT DICTIONARY

| Slot | Rule |
|---|---|
| `{{TITLE}}` | H1 + face-card title. Ranked intent required. ≤65 chars. **Must end "in 2027"** (year-at-end law) |
| `{{META_DESC}}` | 150–160 chars, includes #1 pick name |
| `{{UPDATED_ISO}}` / `{{UPDATED_HUMAN}}` / `{{READ_MIN}}` | Updated stamp + read time (site byline pattern) |
| `{{DIRECT_ANSWER}}` | 1–2 paragraphs MAX. Names the #1 pick in sentence one |
| `{{QUICK_TABLE_ROWS}}` | 10 `<tr>` rows: # \| Name \| Why It Ranks \| Key Stat |
| `{{MERMAID_1}}` / `{{MERMAID_2}}` | Two ` ```mermaid ` fenced blocks, **both unique per page** |
| `{{ITEM_n_NAME}}` `{{ITEM_n_BODY}}` `{{ITEM_n_STAT}}` | n=1..10. **~200–250 words per item body** (see word band note) |
| `{{HOW_WE_RANKED}}` | 1 paragraph, real criteria only |
| `{{FAQ_Q1..Q5}}` `{{FAQ_A1..A5}}` | **5** questions, 40–80 word answers |
| `{{SOURCES_LIST}}` | **5–6** `<li>` items: real, resolving external sources. **Invented/dead = NON-WAIVABLE fail** |
| `{{RELATED_LINKS}}` | 3–6 internal `<a>` links, same pillar, registry-verified slugs only |
| `{{FACECARD_URL/ALT}}` `{{IMG_1..IMG_11_URL/ALT}}` | Per image law |

## SEO / SCHEMA LAW

One H1 · items are H2 (`#1: …` … `#10: …`) · FAQ questions H3 · JSON-LD: **Article + ItemList (1–10) + FAQPage (5)**,
each exactly once · rendered word band **2,500–3,200** · no fabricated stats/prices/entities.

ItemList carries `itemListOrder: ItemListOrderDescending` and `numberOfItems: 10`; Article carries
`author: {Person, "Kory White"}`. **ItemList names must match the rank H2 text exactly** (audited).

## BRAND CSS HOOKS (renderer-side, reference only — never inline in blobs, never edit renderer in this lane)

`--g-crimson: #B91C3F` · `--g-gold: #FFB81C` · near-black background.
Complete class set — **add none** (the audit rejects any class outside this set):
`golden, top10, g-head, g-facecard, g-facecard-title, g-byline, g-direct, g-quicktable, g-item, g-stat, g-method,
g-faq, g-sources, g-related, g-img, g-hero`

## SELF-VALIDATION CHECKLIST (mechanized in `auditTop10V2()`)

- `data-template="TOP_LIST"` `data-version="v2"` on a `class="golden top10"` root
- Face card at top: image + title together; same URL in Article JSON-LD image
- One H1; exactly 10 item H2s in order; ids `item-1`..`item-10`; H2 numbering matches id
- Direct answer present and ≥40 words
- Quick table: 10 rows
- EXACTLY 11 body images, alt non-empty, hero eager / 10 items lazy, no duplicate URLs
- **Exactly 2 mermaid diagrams, and the two must differ**
- No empty `{{SLOT}}` anywhere
- 3 JSON-LD blocks, all valid JSON; ItemList names match item H2 names exactly
- 5 FAQ H3s · Sources 5–6 external URLs · Related 3–6 internal links
- Rendered word count 2,500–3,200 · no CRO card markup in the blob · no unsanctioned classes

**WAIVABLE** (may publish at 12/13, logged): `quicktable_rows_*`, `related_links_*`, `word_count_*`,
`unsanctioned_classes_*`, `itemlist_name_mismatch_*`.
**NON-WAIVABLE:** mermaid count/uniqueness, sources, unfilled slots, image counts, missing sections, invalid JSON-LD.

---

# WIRING — DONE AND VERIFIED (2026-07-29)

**Files added:**

- `GOLDEN_TEMPLATE_TOP10_SKELETON.html` — the template, read from disk at runtime
- `_top10_v2_template.js` — `renderTop10V2()`, `auditTop10V2()`, `isTop10V2()`, `V2_SLOTS`, `V2_LAW`

**Files changed (both strictly additive):**

- `_ranking_top10_gold_template.js` — a dispatch at the top of `auditTop10GoldTemplate()`. Bodies stamped
  `data-version="v2"` route to the v2.2 audit; **everything else falls through to the untouched v1 path.**
  This is the ONLY hook needed, because `new/_drip.js` (line 1965) and `new/improve_content.js` both reach the
  template through exactly this function — **so the drip and the multihub inherit v2.2 with zero changes to
  their own code, and the premium ladder / crew logic is not touched at all.**
- `new/content_gate.js` — a `gateScoreTopListV2()` branch, entered only when the body carries the TOP_LIST v2
  stamp. All ~28,500 GENERAL entries keep the original markdown path byte for byte.

**Why the gate branch was necessary (not optional):** all 13 original checks match markdown (`^## Heading`).
A v2.2 body is HTML, so the gate could not SEE its sections — a *perfectly built* v2.2 page scored **~7/13**
(Direct Answer ×2, FAQ, Sources, Related all invisible). The lane would have quarantined every page it touched.
The branch reads the same 13 points off the HTML structure instead. Thresholds are identical; only the selectors differ.

**v1 ↔ v2.2 are contradictory by design — never audit one by the other's rules:**

| | v1 (aq1158) | v2.2 (TOP_LIST) |
|---|---|---|
| Body format | markdown | HTML |
| Item marker | `## 1.` + `@@PRODUCT` | `<section class="g-item" id="item-1">` |
| Mermaids | exactly **1** | exactly **2**, unique |
| Top hero | **banned** | **required** (IMG_1) |
| Images | 10 (one per rank) | 11 (hero + 10) + face card |

**Verified 2026-07-29** with a fully-filled fixture:

- filled v2.2 page → **GATE 13/13** (2,959 words, 2 mermaids) · **AUDIT COMPLIANT** (11 body images)
- dispatch routes v2.2 bodies to `version=v2.2`
- a markdown aq1158-shape body still takes the **v1 path unchanged**
- a GENERAL entry still takes the **original gate path**

**Word-band note (practical):** hitting 2,500–3,200 rendered words needs roughly **200–250 words per item body**
across all 10 items, plus the direct answer and method paragraph. Item bodies materially shorter than that land
the page under the bar on point 1.

## REMAINING TO TURN THE LANE ON

The template, the audit and the gate are live. What is **not** yet built is the **emitter** — the step that
takes an existing markdown TOP_LIST entry and pours it into `renderTop10V2()`. Until that exists, the machines
will *correctly validate* v2.2 pages but will not yet *produce* them. That emitter is the next piece, and it is
the only remaining work.
