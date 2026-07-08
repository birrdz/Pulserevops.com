# 🔒🔒 LOCKED IMAGE LOOK — North-Star aesthetic (4444)

**Approved by owner 2026-07-04 while viewing the live pulserevops.com front page (TWO screenshots).**
Before typing ANY image query or judging ANY image, look at these references first.

## THE TWO REFERENCE VIEWS (the canonical look)
Both are the front-page mosaic. Warm, dark, cinematic, artsy — cohesive palette across every genre:
- View A: Aquariums (clownfish/anemone), Resorts (Bora Bora), Home&Family, Pulse News portraits.
- View B: "Browse Topics" books, planted tank, Idaho retire town, Search magnifier, "Top 10
  Trawlers 2024" boats, "Top 10 Off-Road Pickup Trucks 2027" cars, clownfish/coral aquariums.
- On-disk exemplars of this exact look: `assets/qa/aq*.jpg`, `assets/qa/bt*.jpg`,
  `assets/qa/ca*.jpg`, `assets/qa/rs*.jpg` (the graded covers already live on the site).

## THE #1 RULE (owner, verbatim intent)
**"You're not supposed to be FINDING the image. You're supposed to be AUDITING or CHANGING it
so it looks like these."**
- DEFAULT = audit the existing image + apply the grade so it matches the references.
- Only REPLACE when the existing image genuinely fails (chart/graph/document, plain snapshot,
  off-topic). The replacement is ALSO graded to match — finding is the fallback, not the goal.
- Judge every candidate **AS GRADED**, never as the raw web source. Review galleries must show
  the GRADED preview; also surface the source url ("exact image off the internet").

## THE LOCKED GRADE (produces the reference palette — do not drift)
```js
pipe.modulate({ saturation: 1.08, brightness: 1.01 })
    .linear(1.10, 6)                                   // +10% contrast, lifted shadows
    .recomb([[1.07,0,0],[0,1.0,0],[0,0,0.93]])         // warm highlights / cool shadows
    .sharpen();
// overlay: radial vignette 0.14, grain slope 0.045, warm rect #c98a2e opacity 0.07
```

## SUBJECT RULE (artsy, not stock) — palette is constant, genre changes
- ARTISTIC / painterly / fine-art treatment of the subject. NOT plain product shots, NOT
  "top 10 workplace" stock, NOT charts/graphs/documents, NOT close-up snapshots.
- Style example: not "a shoe" → art of shoes; not "top 10 workplaces" → painterly portraits of
  men/women in blazers; "dress shirts for work" → artistic/painting versions. Needn't be loud,
  just artful. Same colors/scheme as the references — if it drifts, it's wrong.

## FACE-CARD / TOP HERO (Pollinator + Face Card generator — owner 2026-07-05)
- **Writers:** do NOT add a leading `![...](...)` hero or `<!--HERO-->` block — one Pollinator file (`/assets/qa/<id>.jpg`) becomes mosaic tile + top hero.
- **Prompts:** every face-card flux query includes headroom / no cut-off heads (`FACE_CARD_FRAMING` in `_ddg_facecard_lib.js`).
- **Crop:** square face-cards use **north-biased** cover crop (not `attention`) so heads stay in frame; gold title sits at bottom.
- **Markdown:** `forceMainTopHero` strips legacy `<!--HERO-->` + stray intro images before first `##`.
