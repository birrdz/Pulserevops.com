# 🔒 GOLDEN TEMPLATE — Q&A Essay (q11133)

> **Spec for Claude Code / Cursor. Applies to single-question URLs: yes/no questions, "what is", "how do", "which/what is the best X for Y" — anything answered in essay form on pulserevops.com.**

> **Status: MANDATORY · NON-NEGOTIABLE · IMMUTABLE SHAPE**  
> **Saved:** 2026-07-06  
> **Do NOT regenerate, restyle, or "improve" the live gold reference.** Document the locked law only.  
> Each entry uses **NEW content** and **NEW topical images** — the template **shape** is fixed.  
> **Pair spec:** `GOLDEN_TEMPLATE_TOP10.md` (Top 10 ranking list, aq1158)

---

## 0. SUPERSESSION + CONTEXT (do this FIRST)

Owner MANDATORY supersession law:

**Delete all prior golden-template files/sections anywhere in the repo. This file + GOLDEN_TEMPLATE_TOP10.md are the only source of truth. Conflicting old rules are removed, not merged.**

**Read previous session logs (SCRUBBER_SPEC.md, prior Claude Code logs) for the 13-point gate, image grading pipeline, renderer HTML-escaping constraint, and Pulse palette before generating any page.**

- **13-point content gate** — publish only at **13/13** (`entryScrubPipeline` + `rubricSignOff`); see [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) PASS 1
- **Image grading pipeline** — every disk write through **`storeGradedImage()`**; **pHash** dedup; **EXIF** proof-of-grade (`PULSE_GRADE=v_final`); see [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) IMAGE STANDARD + DEDUPE
- **Renderer HTML-escaping constraint** — ad/widget markup lives in **`pulse-machine-entry.js`**, **NOT** in stored answer blobs (see **§0.1**)
- **Pulse palette** — crimson **`#B91C3F`**, gold **`#FFB81C`**

---

### Supersession — what this spec replaces

**This file is the sole owner spec for single-question Q&A essay pages.** It **supersedes and voids** any older or conflicting material, including:

| Superseded | Why it loses |
|------------|--------------|
| **Prior `GOLDEN_TEMPLATE_QA.md` drafts** | HTML `<article>` skeletons, JSON-LD in blobs, top face-card hero before Direct Answer, 14/14 `validate-golden.mjs` gate — **deleted**; pipeline uses markdown blob + `auditQaGoldTemplate` + **13/13** rubric. |
| **Top 10 / listicle shapes on essay URLs** | Ranked `## N.` + `@@PRODUCT` + Best Overall/Value pills → **Top 10 only** (`GOLDEN_TEMPLATE_TOP10.md` §1). Essay bodies with "best" in the title but no ranking markers stay **Q&A**. |
| **Pre-2026-07 Q&A hero law** | Older rules (`pulse-template-selection.mdc`, `SCRUBBER_SPEC.md` criterion 10) that **mandated a top hero before Direct Answer** — **corrected 2026-07-06**: Q&A (q11133) has **no top hero** before the gold Direct Answer box; first content figure follows prose. |
| **`ItemList` / product-card schema on essays** | Q&A pages emit **`QAPage`** + **`TechArticle`** — not ranked-product `ItemList`. See **§3**. |
| **Baked CRO in blobs** | Any `<aside class="cro-ad">`, markdown CRO cards, or `/assets/kory-white.jpg` portrait in answer bodies — render-time inject only (**§0.1**). |
| **Stale crossover / batch notes** | Session logs describing Q&A with top heroes, Top 10 CRO placement on essays, or 2,000-word floors on golden-template pages — **this spec + code win**. |

**Immutable gold reference:** [q11133 — Q&A essay](https://pulserevops.com/knowledge/q11133) (`q11133`). Do **not** edit the live q11133 blob.

**Code wins over live quirks:** `_qa_gold_template.js` (`QA_SECTION_ORDER`, `QA_TEMPLATE_OUTLINE`, `auditQaGoldTemplate`, `ensureQaGoldBodyShape`) is the enforcement source of truth. If the live page or an old doc disagrees, **the code shape wins**. Bypass gold shape only with owner passcode **4444**.

---

### Context — who, scope, router

| | |
|--|--|
| **Who must read this** | Claude Code, Cursor agents, `generateOne` (`_scrub_button_server.js`), `entryScrubPipeline`, `_aq_qa_gold_fix_lib.js`, scrub UI, render auditors (Agent C) |
| **Scope** | **Any single-question essay URL** on pulserevops.com — all pillars. Dual pillars host **both** ranking lists and essay Q&As; route by **body shape**, not hub path or ID prefix. |
| **Router** | `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` — call **before** generate, fix, or audit; lock result; **never switch template mid-run**. |
| **Templates** | **Exactly two** — no hybrids: **Q&A** (q11133) or **Top 10** (aq1158). Never merge `@@PRODUCT`/ranking pills into Q&A; never prepend Q&A top hero onto Top 10. |

**Related docs (read with this file):**

- [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) — Top 10 / listicle-intent spec (aq1158)
- [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) — pipeline process (classify → 13/13)
- [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) — 13-point rubric, `storeGradedImage()` / pHash / EXIF image law, renderer HTML-escaping, Pulse palette

**Code modules (audit enforcement):** `_qa_gold_template.js` · `_ranking_top10_gold_template.js` · `_pulse_gold_template_router.js`

---

### Date / owner law (2026-07-06 session corrections)

Saved **2026-07-06 ~18:00–19:08 ET**. Locked with owner passcode **4444**:

1. **Two golden templates only** — Q&A (q11133) + Top 10 (aq1158); classify before generate.
2. **No top hero before Direct Answer on Q&A** — gold Direct Answer box is first body content; `ensureQaGoldBodyShape` strips leading `![…](…)`; gold audit: `unexpected_top_hero`.
3. **No `@@PRODUCT` or ranked sections on Q&A** — listicle markers → Top 10 template.
4. **Image/provider law** — DDG ↔ Pollinator strict alternation (`_image_provider_alternate.js`); **15s floor** between generates; **self-hosted paths only** in saved bodies (no live `pollinations.ai`).
5. **Direct Answer must never be blank** — ≥140 chars, ≥2 sentences; gold audit: `direct_answer_blank`.
6. **CRO on Q&A** — render-time inject; mobile inline after **last depth-section H2 block, before "Related questions."** (see **§0.1**); never stored in blob.
7. **Top 10 corrected separately** — ranking lists have **no top hero** and different CRO slot; do not back-port Q&A placement onto Top 10.

Full session handoff: [`_CROSSOVER.md`](_CROSSOVER.md).

---

### Session status — doc only, no batch runs

**All batch jobs are STOPPED** as of this documentation pass. Do **not** start or restart:

- `_aq_gold_redo_batch_run.js`
- `_smallest_pillar_13_restart.js`
- Pillar ranking/image repair batches

This session is **documentation only**. Read, classify, and fix individual entries only when the owner explicitly requests — not via unattended batch.

---

### 0.1 CRO SYNDICATE SWINGING CARD (required on every page)

**The existing CRO Syndicate hanging-card widget (CSS clothespin/cord swinging animation, crimson/oxblood palette, localStorage dismiss, Calendly link) must appear on every golden-template page:**

Top 10 (aq1158), Q&A (q11133), all pillars. No opt-out.

**Desktop (≥768px): existing hanging-card widget pinned fixed-RIGHT, swinging animation active, no overlap with article text — both templates, renderer-injected.**

**Mobile (<768px): fixed placement disabled; render the same swinging card INLINE in the article body. Template A (Top 10): after item #5. Template B (Q&A): after last depth-section H2, before "Related questions." Full width, animation on, respect prefers-reduced-motion.**

Cross-ref [`CURSOR_GOLDEN_TEMPLATES.md` §C3](CURSOR_GOLDEN_TEMPLATES.md#c3-cro-card-renderer-injected) for the runbook insertion-point table.

**Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup).**

One instance per page. localStorage dismiss behavior unchanged.

#### Owner law (locked — 2026-07-06)

| Rule | Requirement |
|------|-------------|
| **Widget** | Existing CRO Syndicate **hanging-card** — CSS cord + clothespin (`.cro-cord` / `.cro-peg`) swing animation, **crimson/oxblood** palette, **Calendly** primary CTA (`Book a Call →`), × dismiss |
| **Desktop ≥768px** | Fixed right viewport: `position: fixed; right: 0; top: 20vh` (or equivalent); article gutter so card **must not overlap** body text |
| **Mobile <768px** | Fixed placement **DISABLED**; same swinging card **inline full-width** in article body — Q&A: **immediately after last depth-section H2 block, before "Related questions."**; swing animation **on**; honor `prefers-reduced-motion: reduce` |
| **Renderer constraint** | Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup) |
| **One instance** | Exactly **one** CRO card per rendered page — no duplicates |
| **Dismiss** | **Unchanged** — localStorage dismiss keys/behavior (`croX` desktop, `croMobX` mobile); do not alter without owner passcode **4444** |
| **§6 gate** | Row **18**: present once — fixed-right desktop; mobile inline after **last depth-section H2 block, before "Related questions."**; renderer-injected not blob |

> **Code note:** Live renderer uses `sessionStorage` for `croX` / `croMobX`; breakpoint gates at **1200px/1199px** — owner target **768px**; Q&A mobile slot owner spec: **last depth-section H2 block, before "Related questions."** (`afterQaEssayCroPos()` today — align in separate task). Top 10 mobile: **after item #5** — see `GOLDEN_TEMPLATE_TOP10.md` §0.1.

#### Render-time only — never in the blob

**Renderer constraint (mandatory):** Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup).

**One instance per page; localStorage dismiss unchanged.**

| Function | Role |
|----------|------|
| `insertCroAd()` | Orchestrator — desktop fixed + mobile inline at `croInsertPos()` |
| `insertCroAdDesktop()` | Strips legacy blob CRO, splices `croAdCard()` into body HTML |
| `croAdCard()` | Desktop hanging widget + dismiss script (`#croFixed`) |
| `croMobileCard()` | Mobile inline widget at same logical slot (`#croMobCard`) |
| `croInsertPos()` | Placement router — Q&A → `afterQaEssayCroPos()` |
| `stripBlobCro()` / `stripRenderedCro()` | Remove baked CRO before inject (prevents double cards) |

Pipeline: `stripBlobCro(entry.answer)` → `renderMd(bodyForMd)` → `insertCroAd(renderedAnswer, id)` wired into `<div class="body">` output (~L1325). `insertCroAd()` operates on **already-rendered HTML**, so body HTML-escaping does not apply to injected markup (L407–408).

Answer blobs store **markdown/text only**. `renderMd()` passes every paragraph, heading, and list item through `escHtml()` before output — any baked CRO HTML (`<aside class="cro-ad">`, `.cro-ad-card` divs, etc.) in the blob renders as escaped literal text (`&lt;aside…&gt;`), not a live widget. In-blob CRO also causes **double cards** when the renderer injects the canonical widget.

**Writers, DeepSeek, and the image pipeline must NOT** add CRO HTML, `<aside class="cro-ad">`, or `/assets/kory-white.jpg` CRO portrait images to blobs. `_cro_strip_lib.js` → `stripAllCroFromBody` / `countCroInBody` enforces strip-before-save.

**Blob forbidden content** (strip before save; audit/scrub gate fails if present):

- `/assets/kory-white.jpg` as an in-body markdown image (the widget uses this asset at render only)
- `<aside class="cro-ad">` or any other baked CRO HTML
- Markdown image cards (`cro-syndicate-card.png`, catbox / usgv65 URLs, link-row text ads)
- Text ad rows ("Reach Kory White, Fractional CRO", Calendly / LinkedIn / CRO Syndicate link rows)

Enforcement chain:

| Layer | Module | Function |
|-------|--------|----------|
| Blob strip | `_cro_strip_lib.js` | `stripAllCroFromBody`, `countCroInBody` |
| Render strip + inject | `pulse-machine-entry.js` | `stripBlobCro`, `stripRenderedCro`, `insertCroAd`, `escHtml` / `renderMd` |
| Scrub / publish gate | `_scrub_button_server.js` | `croCardLawOk`, `enforceCroCardLaw` |
| Grade checklist | `_format_fixer_lib.js` | `croBlobClean` (13/13 gate) |
| Gold audit | `_qa_gold_template.js` | `cro_in_blob` failure code |
| Visual lock | `_visual_lock_law.js` | `enforceWriterVisualLock` — writers must not add CRO cards |
| Render auditors | `_render_audit_agent_a.js`, `_render_audit_agent_c.js` | Agent A: live CRO placement · Agent C: blob gold + no baked CRO · `_render_audit_gate.js` |

See also: `.cursor/rules/visual-lock-law.mdc` (writers change prose only — not CRO cards, HTML, or layout widgets).

#### One instance per page

- **Exactly one CRO Syndicate swinging card** per rendered page — no duplicate desktop or mobile widgets.
- **Renderer must not inject doubles:** `insertCroAd()` → `insertCroAdDesktop()` + `croMobileCard()`; `stripRenderedCro()` clears any prior CRO markup before inject; if `cro-ad-card` is already present, dedupe to a single instance re-spliced at `croInsertPos()`; mobile path strips existing `.cro-mob-card` blocks before inserting one inline card.
- **Blobs must not contain CRO:** `stripBlobCro()` (render) and `_cro_strip_lib.js` (save/scrub) remove in-blob CRO so the render-time inject never stacks on baked markup.

#### Dismiss (unchanged — localStorage)

Dismiss behavior is **unchanged** from `pulse-machine-entry.js` (`croAdCard()` / `croMobileCard()` inline scripts). Owner law: **localStorage dismiss unchanged** — do not alter keys or UX without passcode **4444**. Renderer today uses **`sessionStorage`** (per browser tab session):

| Viewport | Key | On load (`getItem === "1"`) | On × (`.cro-close`) |
|----------|-----|-----------------------------|---------------------|
| Desktop (`#croFixed`) | `croX` | Hide card; add `body.cro-dismissed` (removes right gutter) | Drop animation (`.cro-drop`); set `croX`; add `body.cro-dismissed`; hide after 780ms |
| Mobile inline (`#croMobCard`) | `croMobX` | Remove card from DOM | Fade/scale out; set `croMobX`; remove from DOM after 420ms |

#### Q&A placement

On essay Q&A pages, `croInsertPos()` calls `afterQaEssayCroPos()` — **owner mobile target: immediately after the last depth-section H2 block, before "Related questions."**:

- **Desktop (≥768px target):** fixed right-side swinging card — see **[Desktop placement](#desktop-placement)**; **not** spliced into article flow
- **Mobile (<768px target):** inline full-width swinging card **immediately after the last depth-section H2 block, before "Related questions."** — see **[Mobile placement (<768px)](#mobile-placement-768px)**
- **Code today:** `afterQaEssayCroPos()` splices at Direct Answer gold box → first text block → first content `<figure>` → following `</p>` — **owner spec is last depth-section H2 block**; align renderer in a separate task
- **Not** after item #5 (that slot is Top 10-only — see `GOLDEN_TEMPLATE_TOP10.md` §0.1)
- CRO must **never** splice inside the Direct Answer gold box (guardrails: `directAnswerBoxEndPos`, `afterDirectAnswerPos`)

All styling is **renderer-owned** (inline CSS in `pulse-machine-entry.js` — not blob content).

#### Desktop placement

**Owner requirement:** On desktop (≥768px), the CRO widget is pinned to the **right side of the viewport** with the swinging animation active (`position: fixed; right: 0; top: ~20vh` or equivalent). At **≥1100px**, article `max-width` plus a right gutter must ensure the card **never overlaps body text**.

**What the renderer does today** (`pulse-machine-entry.js` → `croAdCard()` + inline `<style>` block, ~L1149–1201):

| Breakpoint | Behavior |
|------------|----------|
| **≥1200px** | Fixed hanging widget visible; page shifts left to reserve a right column |
| **≤1199px** | `.cro-ad-root` hidden; inline `.cro-mob-card` at the content slot instead |

**Fixed widget classes** (do not invent — cite from code):

- Root: `.cro-ad`, `.cro-ad-card`, `.cro-ad-root`, `#croFixed`
- Swing stack: `.cro-swing` → `.cro-cord` + `.cro-peg` → `.cro-card`
- Dismiss: `.cro-close` / `.cro-x`; drop animation via `.cro-ad-root.cro-drop`; `body.cro-dismissed` removes gutter shift

**Position & animation (≥1200px only):**

```css
.cro-ad-root { position: fixed; top: 0; right: 28px; width: 322px; z-index: 2147483000; }
.cro-swing   { animation: cro-sway 5.5s ease-in-out infinite; transform-origin: 50% 0; }
@keyframes cro-sway { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
```

**No-overlap gutter (≥1200px — code uses 1200px, not 1100px):**

```css
@media (min-width: 1200px) {
  body            { padding-right: 352px; }
  body.cro-dismissed { padding-right: 0; }
  article         { max-width: 1240px; }
  body.cro-dismissed article { max-width: 880px; }
}
```

**Code vs owner spec (document both):**

| Spec | Owner | Code today |
|------|-------|------------|
| Desktop breakpoint | ≥768px | **≥1200px** (fixed widget); ≤1199px gets inline `.cro-mob-card` |
| Vertical anchor | `top: ~20vh` | **`top: 0`** (cord hangs from viewport top; card sits below peg) |
| Right gutter / no overlap | ≥**1100px** | ≥**1200px** (`padding-right: 352px` + `article max-width: 1240px`) |

> **Owner note:** Right gutter at **1100px** is the target; renderer currently gates at **1200px**. Do not change breakpoints in this doc pass — align code in a separate task if needed.

#### Mobile placement (<768px)

**Owner requirement:** On viewports **below 768px**, the fixed right-side widget is **DISABLED**. The same swinging CRO card renders **inline** in the article body as a **full-width block**. On Q&A essays, insert **immediately after the last depth-section H2 block, before "Related questions."** The cord/peg **swing animation stays on** unless the user has `prefers-reduced-motion: reduce`.

See **[Desktop placement](#desktop-placement)** for the fixed right-side widget (≥768px target). Top 10 lists use a different inline slot (**after item #5** on mobile) — see `GOLDEN_TEMPLATE_TOP10.md` §0.1 Mobile placement.

**What the renderer does today** (`pulse-machine-entry.js` → `insertCroAd()` + `croMobileCard()` + inline `<style>` block, ~L465–478, L577–617, L664–672, L1190–1201):

| Spec | Owner | Code today |
|------|-------|------------|
| Mobile breakpoint | **<768px** | **≤1199px** (fixed hidden + inline shown) |
| Q&A inline slot | **Last depth-section H2 block, before "Related questions."** | **`afterQaEssayCroPos()`** today — DA → text → first `<figure>` → following `</p>`; align to owner spec in separate task |
| Fixed widget on mobile | **Disabled** | **Disabled** (`.cro-ad-root{display:none!important;}`) |
| Inline full-width block | Yes | Yes (`.cro-mob-card{display:flex;width:100%;…}`) |
| Swing animation | On; off when `prefers-reduced-motion` | On via `.cro-swing` + `cro-sway`; `@media(prefers-reduced-motion:reduce)` disables animation |

**Injection path** (Q&A branch of `croInsertPos()`):

```javascript
// croInsertPos() → afterQaEssayCroPos(html) when direct-answer-box present and not Top 10
const boxEnd = directAnswerBoxEndPos(html);
// … first <figure> after boxEnd, then first </p> after figure close
// insertCroAd() splices croMobileCard() at that index (same as desktop anchor)
```

**Inline widget classes** (do not invent — cite from code):

- Root: `.cro-mob-card`, `#croMobCard`
- Swing stack: `.cro-swing` → `.cro-cord` + `.cro-peg` → `.cro-card` (same markup/CSS as desktop)
- Dismiss: `.cro-close` → fade/remove; session key `croMobX` (separate from desktop `croX`)

**Inline block styling (≤1199px — code uses 1199px, not 768px):**

```css
@media (max-width: 1199px) {
  .cro-ad-root { display: none !important; }
  .cro-mob-card {
    display: flex; justify-content: center; width: 100%;
    margin: 28px 0 24px; padding: 8px 0 12px;
    background: rgba(236,227,210,.55); border-radius: 14px;
  }
  .cro-mob-card .cro-swing { width: min(322px, 88vw); }
}
```

**Animation + reduced motion** (shared desktop/mobile):

```css
.cro-swing { animation: cro-sway 5.5s ease-in-out infinite; transform-origin: 50% 0; }
@media (prefers-reduced-motion: reduce) { .cro-swing { animation: none; transform: rotate(-1deg); } }
```

> **Renderer fix note:** Owner targets **768px** breakpoint and **last depth-section H2 block** mobile slot; code today switches fixed ↔ inline at **1199px** and splices via `afterQaEssayCroPos()` (DA → text → first `<figure>` → following `</p>`). Align breakpoint and slot in `pulse-machine-entry.js` in a separate task — do not change renderer in this doc pass.

#### Palette — crimson / oxblood (renderer inline CSS)

CRO widget styling lives in **inline CSS inside `pulse-machine-entry.js`** (~L1149–1201) — not `assets/pulse-tan.css`. Oxblood ramp from `croAdCard()` CSS:

| Token | Hex | Used for |
|-------|-----|----------|
| Deep oxblood | `#8b0202` | Spine gradient end (`.cro-spine`), logo, pill borders, link hover, btn gradient end, photo ring |
| Crimson | `#a71c1c` | Close button, name (`.cro-name`), eyebrow, head underline, footer links |
| Bright crimson | `#b81f1f` | Primary CTA button gradient start (`.cro-btn`) |
| Card wash | `#fdf1f0` → `#fbe9e8` | `.cro-card` background gradient |
| Border | `#f0d3d2` | Card border |
| Cord / peg wood | `#d7c19f`, `#c6ab80`, `#e4c489`, `#caa15f` | `.cro-cord` + `.cro-peg` gradients |

**Pulse brand alignment:** site-wide tokens **gold `#FFB81C`** and **crimson `#B91C3F`** (Compliance § Pulse brand palette). CRO oxblood ramp (`#8b0202`–`#b81f1f`) is an editorial accent adjacent to `#B91C3F`. Direct Answer box uses entry amber `#C8821E` / cream `#FBF3E4`.

#### Behavior — dismiss + click tracking

**Dismiss (unchanged — localStorage):** Owner law — do not alter dismiss keys or UX. Renderer today persists via **`sessionStorage`** (`croX` / `croMobX`):

| Surface | Key | On load | On × click |
|---------|-----|---------|------------|
| Desktop `#croFixed` | `croX` | If `"1"`, hide widget + `body.cro-dismissed` | Set `croX="1"`, add `.cro-drop`, hide after 780ms |
| Mobile `#croMobCard` | `croMobX` | If `"1"`, remove inline card | Set `croMobX="1"`, fade out, remove from DOM |

Desktop dismiss plays **drop-off-string** animation: `.cro-ad-root.cro-drop .cro-swing` → `rotate(11deg) translateY(130vh)` over 0.7s.

Interaction beacons POST to `/.netlify/functions/pulse-click-notify` (kinds: `cro-card-dismiss`, `cro-card-click`, `cro-card-hover`). Entry pages load `/js/pulse-lead-track.js` for CTA click email digest.

#### CTAs (renderer links — `croAdCard()` / `croMobileCard()`)

| Label | URL | `data-pulse-click` |
|-------|-----|-------------------|
| **Book a Call →** (primary pill) | `https://calendly.com/korywhiterevops` | `hire-cro` |
| **Kory White LinkedIn →** | `https://www.linkedin.com/in/korywhite` | `curator` |
| **CRO Syndicate →** | `https://crosyndicate.com/` | `cro-syndicate` |

Headshot: `/assets/kory-white.jpg` (render only — never as blob markdown image).

#### Render audit + grade gates

| Gate | Expectation |
|------|-------------|
| **Gold audit** | `cro_in_blob` if CRO markup in markdown body |
| **Scrub publish** | `croCardLawOk()` — zero baked CRO / kory-white images in blob |
| **Agent A** (live) | Direct Answer gold box intact; CRO must **not** splice inside DA box (`_render_audit_agent_a.js`, `_render_audit_lib.js` → `heuristicLayoutAudit`) |
| **Agent C** (blob) | Gold template + visual lock; no baked CRO (`.cursor/rules/render-audit-agent-c.mdc`, `_render_audit_agent_c.js`) |
| **Deploy gate** | Agent A layout failures block deploy via `_render_audit_gate.js` |
| **§6 row 18** | Present once: fixed-right desktop, inline after **last depth-section H2 block, before "Related questions."** on mobile — see **§6** item **18** |

⚠️ **False flag:** v2 slip scans grepping blobs for `class="cro-ad"` always fail — CRO is render-time only. Exclude `croCard` from blob-based slip scans.

Session handoff: `_CROSSOVER.md` (CRO strip + blank-DA render fixes, 2026-07-06).

---

## Live reference

| Field | Value |
|-------|-------|
| **Gold ID** | `q11133` |
| **Live URL** | https://pulserevops.com/knowledge/q11133 |
| **Title example** | (general Q&A essay) |

Open q11133 on desktop and mobile before bulk fixes. That page is the shape demo — never copy its prose or images into other entries. Ideal **law** here — not live quirks (numbered Bottom Line, duplicate FAQ headers).

---

## 1. DETECTION — when this template applies (NOT Top 10)

**Scope:** Single-question essay URLs on pulserevops.com — yes/no questions, "what is", "how do", "should/can/does", "which/what is the best X for Y" when answered in **essay form** (explanatory prose + text→image rhythm). **Not** ranked product lists.

**Contrast spec:** Listicle-intent detection (ranked `## N.`, `@@PRODUCT`, Best Overall/Value pills) → [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§1** (aq1158). **N extraction (Top N item count) does not apply to Q&A** — see Top 10 **§1.1**. Classify **before** generation; **never switch template mid-run**.

### Apply if slug/title/query matches AND the top-10 template does NOT:

**Router truth:** `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` classifies from **entry id + markdown body + title string** only. This template applies at router **step 3** when Top 10 steps 1–2 fail and `appliesQaGold(id, body, { title })` returns true. Pipeline passes `entry.question` as `title` (see `entryScrubPipeline` / `generateOne` in `_scrub_button_server.js`).

**Final lock:** slug/title/query hints alone are **never sufficient** — when `isRankingListBody(body, title)` is true → **Top 10**, not Q&A ([`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1).

#### Regex

**Title and query** use the same string — pipeline `entry.question` = router `title` arg. When `title` is omitted, code falls back to `# H1` extracted from body (`entryTitle()` in `_ranking_list_master_law.js`).

**Opening tagline (this spec):** single-question URLs — yes/no, "what is", "how do", "which/what is the best X for Y" — anything answered in **essay form**, not ranked product lists.

**Code truth:** `pickGoldTemplate()` in `_pulse_gold_template_router.js` returns Q&A at **step 3** only when `appliesQaGold(id, body, { title })` in `_qa_gold_template.js` is true. `appliesQaGold()` does **not** test title regex — it gates on `pillarIsQa(id, body)` and `!isQaRankingList(body)`. Patterns below are **SPEC (agents / seed / pre-classify hints)** for essay intent; **body shape wins** when Top 10 router steps 1–2 fail.

| Pattern (regex) | Matches | Example title / query |
|-----------------|---------|------------------------|
| `\bwhat\s+is\b` | What is … | "What is RevOps?" |
| `\bhow\s+(?:do\|to\|can\|should)\b` | How do / how to / how can / how should | "How do you cycle an aquarium?", "How should I pick a CRM?" |
| `\bwhy\s+(?:is\|do\|does)\b` | Why is / why do / why does | "Why is my tank cloudy?", "Why does churn spike in Q4?" |
| `\b(?:yes\|no)\b.*\?` | Yes/no decision ending in `?` | "Should I open a franchise?", "Is it safe to …?" |
| `\?\s*$` | Any question-mark query | "Can you run RevOps without a CRM?" |
| `\bwhich\s+(?:is\|are)\s+the\s+best\b` | Which is/are the best … | "Which is the best filter for nano reefs?" |
| `\bwhat\s+is\s+the\s+best\b` | What is the best … | "What is the best CRM for a 10-person team?" — **essay** unless ranking body |

**Exclude — route to Top 10 instead of Q&A:**

When **`titleSuggestsRankingList(title)`** matches Top 10 `TITLE_RANKING_PATTERNS` ([`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1) **and** **`isRankingListBody(body, title)`** is **`true`** → **Top 10** (router step 1). Title-only listicle words without ranking body → **Q&A** (`title_suggests_ranking_but_body_is_essay_qa`).

`\bwhat\s+is\s+the\s+best\b` and `\bwhich\s+(?:is\|are)\s+the\s+best\b` are **Q&A essay intent** — **not** Top 10 — unless the body has ranked `## N.` product sections + rank markers (`@@PRODUCT`, 🏆/💎, BEST OVERALL/VALUE) per `isRankingListBody()`.

```javascript
// _pulse_gold_template_router.js — evaluated in order; Q&A is step 3
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const route = pickGoldTemplate(id, body, title);
// route.template === 'qa' when steps 1–2 fail and appliesQaGold(...) === true

// _qa_gold_template.js — body/pillar gate (no title regex)
function appliesQaGold(id, body, opts) {
  if (id === 'q11133') return false;
  if (!pillarIsQa(id, body)) return false;
  if (isQaRankingList(body)) return false;
  return true;
}
```

```javascript
// SPEC (agents / seed) — essay-intent title/query hints; not enforced in appliesQaGold today
const TITLE_QA_ESSAY_PATTERNS = [
  /\bwhat\s+(?:is|are)\b/i,                              // DEFINITION
  /\bhow\s+(?:to|do)\b/i,                                // PROCESS
  /^(?:is|are|can|should|does|do|will|would)\b/i,        // YESNO
  /\b(?:yes|no)\b.*\?/i,                                 // YESNO
  /\b(?:what|which)\s+(?:is|are)\s+the\s+best\b/i,       // BESTPICK — essay unless ranking body
  /\bwhy\s+(?:is|do|does)\b/i,
  /\bhow\s+(?:can|should|much|long|often)\b/i,
];
const QUESTION_MARK_QUERY = /\?\s*$/;

// Exclusion — Top 10 wins when BOTH title listicle signal AND ranking body
const top10Wins =
  titleSuggestsRankingList(title) && isRankingListBody(body, title);
// Essay "best" titles → Q&A unless isRankingListBody(body, title) === true
```

| ID / slug signal (case-insensitive) | Examples | Notes |
|-------------------------------------|----------|-------|
| Q-only ID `q####` | `/knowledge/q11133` | Default Q&A unless `isRankingListBody(body)` |
| Dual-mode pillar essay | `aq####`, `tl####`, `sw####`, … on any hub | Q&A when body lacks ranking markers |

### Classify sub-type

After `pickGoldTemplate` locks **`template: 'qa'`** + **`goldId: 'q11133'`**, classify the **essay sub-type** from the entry title/query (pipeline `entry.question` = router `title` arg). Sub-type informs seed tone, Direct Answer framing (§2), and `data-subtype` on the rendered `<article>` — it **does not** change the golden template shape or router outcome.

**Subtypes (set `data-subtype` on `<article>`):** YESNO (is/are/can/should/does/do/will), DEFINITION ("what is/are"), PROCESS ("how to/do"), BESTPICK ("what/which is the best X", single answer).

**Evaluate in order** — first match wins (title-only; same input as [Regex](#regex) above):

| Priority | `data-subtype` | Title / query signal | Examples | Direct Answer format (§2) |
|----------|----------------|----------------------|----------|---------------------------|
| 1 | **YESNO** | `is` / `are` / `can` / `should` / `does` / `do` / `will` | "Should I …?", "Is it safe to …?", "Can you …?", "Do I need …?" | **Verdict-first** — lead with yes/no/maybe + one-sentence why; evergreen — no year suffix (`yearize` guard in `_scrub_button_server.js`) |
| 2 | **DEFINITION** | "what is/are" — `\bwhat\s+(?:is\|are)\b` **without** `\bthe\s+best\b` | "What is RevOps?", "What are nano reefs?", "What is an AI gateway?" | `"{Term} is …"` quotable first sentence |
| 3 | **PROCESS** | "how to/do" — `\bhow\s+(?:to\|do)\b` | "How do I cycle an aquarium?", "How to fix …" | **Method summary + time required** |
| 4 | **BESTPICK** | "what/which is the best X" — `\b(?:what\|which)\s+(?:is\|are)\s+the\s+best\b` — **single answer** | "What is the best CRM **for** startups?", "Which is the best filter **for** nano reefs?" | **The pick + qualifying condition** — single answer; **not** Top 10 unless body has ranked `## N.` + `@@PRODUCT` / 🏆/💎 markers. Often pairs with router `reason`: **`title_suggests_ranking_but_body_is_essay_qa`** |

**Top 10 boundary (all sub-types):** if `isRankingListBody(body, title)` is true → **Top 10**, regardless of sub-type. `\bwhat\s+is\s+the\s+best\b` / `\bwhich\s+(?:is\|are)\s+the\s+best\b` are **Q&A essay intent** unless ranking body markers are present.

**Router `reason` strings (template level — not sub-type keys):**

| `pickGoldTemplate` → `reason` | When | Typical `data-subtype` |
|-------------------------------|------|------------------------|
| **`essay_qa_body_shape`** | Body lacks ranking list markers — default essay Q&A | Any — classify from title |
| **`title_suggests_ranking_but_body_is_essay_qa`** | Title says "best/top 10" but body is **not** a ranking list | Usually **BESTPICK**; may be **PROCESS** when title is "best **way** to …" |
| **`no_gold_template_applies`** | Neither Top 10 nor Q&A shape | N/A — fix body or re-seed before sub-type classify |

```javascript
// SPEC — essay sub-type classify (not yet a standalone module)
// Pair: TITLE_QA_ESSAY_PATTERNS in Regex block above
// Render: set data-subtype on <article> — YESNO | DEFINITION | PROCESS | BESTPICK
const QA_SUBTYPE_PATTERNS = {
  YESNO: /^(?:is|are|can|should|does|do|will)\b/i,
  DEFINITION: /\bwhat\s+(?:is|are)\b/i,
  PROCESS: /\bhow\s+(?:to|do)\b/i,
  BESTPICK: /\b(?:what|which)\s+(?:is|are)\s+the\s+best\b/i,
};

// Evergreen guard (_scrub_button_server.js yearize) — do NOT yearize these sub-types
const QA_EVERGREEN_TITLE =
  /\b(best|right|proper|smartest|safest|easiest|fastest)\s+way\b|\bhow\s+(to|do|can|should|much|long|often)\b|\bwhy\b|\bshould\s+(i|you)\b|\bwhat\s+does\b.*\bmean\b|\bdifference\s+between\b|\bmeaning\s+of\b|\bis\s+it\s+(ok|safe|normal|worth|possible)\b/i;

function classifyQaSubType(title) {
  const t = String(title || '').trim();
  if (QA_SUBTYPE_PATTERNS.YESNO.test(t)) return 'YESNO';
  if (QA_SUBTYPE_PATTERNS.DEFINITION.test(t) && !/\bthe\s+best\b/i.test(t)) return 'DEFINITION';
  if (QA_SUBTYPE_PATTERNS.PROCESS.test(t)) return 'PROCESS';
  if (QA_SUBTYPE_PATTERNS.BESTPICK.test(t)) return 'BESTPICK';
  return 'DEFINITION'; // fallback for unmatched wh- essays
}
```

**Not sub-types (Top 10 path):** ranked `## 1.`–`## N.` product sections, `@@PRODUCT`, 🏆 BEST OVERALL / 💎 BEST VALUE — see [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1.

#### Sub-type pass conditions *(owner dictation pending)*

> **Status:** Placeholder structure — owner will dictate pass conditions per sub-type in a follow-up session. Do **not** publish sub-type-specific gates until this table is filled and wired in code.

| `data-subtype` | Pass condition | Audit / code hook | Status |
|----------------|----------------|-------------------|--------|
| **YESNO** | _(owner to dictate)_ | _(TBD — e.g. Direct Answer opens with clear yes/no/maybe)_ | ⏳ Pending |
| **DEFINITION** | First sentence opens `"{Term} is …"` — quotable, plain-language definition | Direct Answer gold box — first sentence matches definition-first pattern | ✅ Owner dictated |
| **PROCESS** | _(owner to dictate)_ | _(TBD — e.g. numbered or sequential steps in content H2s)_ | ⏳ Pending |
| **BESTPICK** | Direct Answer names **the pick + qualifying condition** (single answer — not a ranked list) | Direct Answer gold box — pick + qualifying condition per §2 | ✅ Owner dictated |

**Shared Q&A gates (all sub-types — already in §6):** immutable gold shape (`QA_SECTION_ORDER`), Direct Answer ≥140 chars / ≥2 sentences, no top hero, no `@@PRODUCT`, 13/13 rubric, CRO render-time only.

**Negative — `isRankingListBody(body, title)` true → Top 10, not Q&A:**

| Condition | Router result | `reason` |
|-----------|---------------|----------|
| ≥ 5 numbered `## N.` sections, or ≥ 3 + 🏆/💎/BEST OVERALL/VALUE/`@@PRODUCT` | **Top 10** | `title_and_body_ranking_markers_*` or `body_ranking_markers_without_title_signal` |
| Title says "best/top 10" **and** body has ranking markers | **Top 10** | Title **plus** body required — see Top 10 §1 |
| ≥ 8 numbered sections + rank markers on dual pillar | **Top 10** | `isQaRankingList()` guard in `_qa_gold_template.js` |

**Positive Q&A edge:** title matches `titleSuggestsRankingList(title)` but body is prose + `## Direct Answer` + text→image only → **Q&A** with **`title_suggests_ranking_but_body_is_essay_qa`** — **never force Top 10 on title alone**. Default essay body → **`essay_qa_body_shape`**.

**Pair spec:** listicle URLs that pass Top 10 detection → [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1 (aq1158).

### Router truth — body shape wins

**Critical dual-pillar rule (owner 2026-07-06):** **Essay/Q&A body shape wins over title listicle signals.** A title with "best" / "top 10" alone must **not** force Top 10 when the body is essay shape. Title signal **plus** ranking body markers → Top 10; title signal **without** ranking body → **Q&A** (`title_suggests_ranking_but_body_is_essay_qa`).

This template applies when the router returns `template: 'qa'`, `goldId: 'q11133'`, `goldUrl: https://pulserevops.com/knowledge/q11133`.

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

const route = pickGoldTemplate(id, body, title);
// route.template → 'qa' | 'top10' | null
// route.goldId   → 'q11133' | 'aq1158' | null
// route.reason   → see decision tree below
```

### Router decision tree (`pickGoldTemplate`)

Evaluated **in order** — first match wins. Q&A is **step 3** (after Top 10 steps 1–2 fail):

| Step | Condition | Template | `reason` |
|------|-----------|----------|----------|
| 1 | `titleSuggestsRankingList(title)` **and** `isRankingListBody(body, title)` | **Top 10** | `title_and_body_ranking_markers_top10` or `…_not_top10_count` |
| 2 | `isRankingListBody(body, title)` (body markers **without** title signal) | **Top 10** | `body_ranking_markers_without_title_signal` |
| 3 | `appliesQaGold(id, body, { title })` | **Q&A** | `essay_qa_body_shape` **or** `title_suggests_ranking_but_body_is_essay_qa` |
| 4 | (none) | **null** | `no_gold_template_applies` |

| Router outcome (`reason`) | When |
|---------------------------|------|
| **`essay_qa_body_shape`** | Body lacks ranking list markers — default essay Q&A |
| **`title_suggests_ranking_but_body_is_essay_qa`** | Title says "best/top 10" but body is **not** a ranking list — **Q&A wins**; never force Top 10 on title alone |

Supporting modules: `_ranking_list_master_law.js` (`titleSuggestsRankingList`, `isRankingListBody`) · `_qa_gold_template.js` (`appliesQaGold`, `auditQaGoldTemplate`) · `_ranking_top10_gold_template.js` (`appliesTop10Gold`).

### Detection gate — `appliesQaGold(id, body, opts)`

**Code:** `_qa_gold_template.js` → `appliesQaGold()`. Returns `true` when Q&A gold law should apply (router step 3).

| Check | Rule |
|-------|------|
| Gold reference exempt | `id === 'q11133'` → `false` (live reference is not re-audited as a candidate) |
| Pillar eligible | `pillarIsQa(id, body)` — see pillar table below |
| Not a ranking list | `isQaRankingList(body)` → `false` when **≥ 8** numbered `## N.` sections **and** `qaHasRankingMarkers(body)` |

**`pillarIsQa(id, body)`:**

| Mode | ID pattern | Routing |
|------|------------|---------|
| **Q-only** | `q####` (`/^q\d+$/`) | Q&A unless body is a ranking list |
| **Dual-mode** | Prefix ∈ `q`, `cg`, `tk`, `pt`, `sw`, `ai`, `aq`, `tl`, `tc`, `ga`, `gm` | **Body shape wins** — same prefix can be Top 10 or Q&A |
| **Dual-mode guard** | ≥ 8 `## N.` **and** rank markers in body | **Not Q&A** → Top 10 path |

Hub path, topic slug, and entry tags are **soft seed hints** — `pickGoldTemplate` does **not** read them.

### Gold audit — `auditQaGoldTemplate(body, title, id)`

**Code:** `_qa_gold_template.js` → `auditQaGoldTemplate()`. Runs strict shape checks when `appliesQaGold()` is true.

| Return | Meaning |
|--------|---------|
| `applies: false` | Entry is q11133 reference, or `appliesQaGold()` is false — skip Q&A gold audit |
| `applies: true`, `compliant: false` | Q&A template applies but blob fails shape (see `issues[]`) |
| `applies: true`, `compliant: true` | Ready for 13/13 + certify |

**Detection-related audit failures** (body classified Q&A but contains listicle artifacts):

| Issue code | Trigger |
|------------|---------|
| `ranking_markers_in_qa` | `qaHasRankingMarkers(body)` — `@@PRODUCT`, 🏆/💎, BEST OVERALL/VALUE in ranked `## N.` headings |

Use `needsQaGoldFix(body, title, id)` for batch/fix routing: `appliesQaGold` **and** audit non-compliant.

### Positive signals — when Q&A applies

> **Full regex code blocks:** [Regex](#regex) above.

**Question / title types** (essay intent — single answer, not ranked picks):

| Type | Examples |
|------|----------|
| **Yes/no** | "Should I …?", "Is it safe to …?", "Can you …?" |
| **What is** | "What is RevOps?", "What is the best CRM **for** startups?" (essay — not Top 10) |
| **How do / how to** | "How do I cycle an aquarium?", "How to fix …" |
| **Explainer wh-** | Why / when / where / should / can / do / does / is / are … |
| **Best X for Y (essay)** | "What is the best email tool **for** a 10-person team?" — prose answer, no `## 1.`–`## 10.` product ranks |

Title may contain listicle words ("best", "top 10") — if body is essay shape (Direct Answer + content H2s + text→image, no rank blocks), **Q&A wins**.

See [Classify sub-type](#classify-sub-type) above — **`data-subtype`** on `<article>` (`YESNO` · `DEFINITION` · `PROCESS` · `BESTPICK`) drives §2 Direct Answer layout within the locked Q&A shape.

### Negative — do **not** apply Q&A (route to Top 10)

Even on `/knowledge/` or with an essay-sounding title:

| Condition | Result | `reason` (Top 10) |
|-----------|--------|-------------------|
| `isRankingListBody(body, title)` is true | **Top 10** | See [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §1 |
| Body has **≥ 3** (or **≥ 5**) numbered `## N.` product sections | **Top 10** | `body_ranking_markers_without_title_signal` or title+body match |
| Body has `@@PRODUCT` widgets | **Top 10** | Ranking list shape — not essay Q&A |
| Ranked sections with 🏆 BEST OVERALL / 💎 BEST VALUE pills | **Top 10** | `qaHasRankingMarkers` / `hasRankMarkers` |
| **≥ 8** numbered `## N.` **and** rank markers (`isQaRankingList`) | **Top 10** | Dual-pillar guard — overrides Q&A default |

**`isRankingListBody(body, title)`** (`_ranking_list_master_law.js`): true when numbered product sections ≥ 5, or ≥ 3 with rank markers, or title suggests ranking **and** (≥ 3 sections or rank markers).

**Never merge:** no `@@PRODUCT` / ranking pills in Q&A blobs; no ranked `## N.` product blocks on essay URLs.

### Classification law — before generation

1. Call **`pickGoldTemplate(id, body, title)`** **before** draft, fix, audit, or publish.
2. **Lock** `template`, `goldId`, `goldUrl`, and `reason` for the entire run.
3. **Never switch template mid-run** — no Q&A → Top 10 pivots (or reverse) after generation starts.

**Render mirror:** `pulse-machine-entry.js` uses `appliesQaGold()` for `noTopHero` and Q&A CRO slot (`afterQaEssayCroPos`) — same body/id law as the router.

---

## 2. REQUIRED PAGE STRUCTURE (in order)

**Gold reference:** [q11133 — Q&A essay](https://pulserevops.com/knowledge/q11133) · **Code:** `QA_SECTION_ORDER`, `QA_TEMPLATE_OUTLINE`, `auditQaGoldTemplate`, `ensureQaGoldBodyShape` in `_qa_gold_template.js`.

Every Q&A blob and its rendered page must follow this sequence **in order**. **Do not reorder, skip, or rename mandatory elements.** **Q&A shape only** — **not** Top 10: no ranked `## N.` product sections, no `@@PRODUCT`, no 🏆/💎 pills, no hero before Direct Answer, no "How We Ranked" block. Cross-ref **§6** quality gate rows below.

### Required elements (in order)

1. **`<title>`** — the question, **≤60 chars** (`entry.question`); before renderer ` | Pulse News` clip. §6 gate **2**.
2. **`<meta name="description">`** — 120–160 chars containing the short answer. §6 gate **3**.
3. **One `<h1>`** = the question. §6 gate **4**.
4. **Byline + dateModified** — `<p class="byline">By Kory White · Updated {dateModified}</p>` near top; author name = **Kory White**; `dateModified` = today at generation time (DEFAULTS: `CURSOR_GOLDEN_TEMPLATES.md` B2 item **4**). **`TechArticle.author`** + **`dateModified`** in JSON-LD — **not in blob**. §6 gate **14** · detail below.
5. **Direct answer block** (`class="direct-answer"`) — **40–60 words**; **first element after byline**. This is the **featured-snippet target**. Format by `data-subtype` ([Classify sub-type](#classify-sub-type) §1):
   - **YESNO** → opens `<strong>Yes/No/It depends</strong>` + one-sentence condition
   - **DEFINITION** → `"{Term} is …"` quotable first sentence
   - **PROCESS** → method summary + time required
   - **BESTPICK** → the pick + qualifying condition
   Blob: `## Direct Answer` — **first H2**; render: `<div class="direct-answer-box">` via `wrapDirectAnswerGold()` — **not stored as HTML in blob**. Full block ≥140 chars, ≥2 sentences; **no #1 product pick**, no Best Overall/Value pills. §6 gate **5** · detail below.

   **YESNO:** opens `<strong>Yes/No/It depends</strong>` + one-sentence condition.

   **PROCESS:** method summary + time required.

   **BESTPICK:** the pick + qualifying condition.
6. **Hero image OPTIONAL** (visual topics only; same rules as A) — cross-ref Template A [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §2 item **6** hero rules + [`CURSOR_GOLDEN_TEMPLATES.md`](CURSOR_GOLDEN_TEMPLATES.md) **§C2**. **Q&A:** no top hero before Direct Answer; when used, hero comes **after** the Direct Answer gold box (plus at least one intro prose block per q11133 text→image rhythm) — never before DA; may coincide with the first depth-section `![alt](url)`. Same attrs as Top 10: `fetchpriority="high"`, **NO lazy loading** (`loading="eager"`), explicit `width`/`height`, descriptive **alt containing the topic**; must load (HTTP 200). No leading `![…](…)` in blob; no `<figure class="entry-cover">` before gold box; renderer `noTopHero`; `ensureQaGoldBodyShape()` strips leading images; gold audit: `image_before_direct_answer`. §6 gate **6**.
7. **Depth sections** — 3–6 `<h2>` depth sections (evidence, when the answer changes, caveats, comparison, common mistakes). H2s phrased as searchable sub-questions where natural. No section under 40 words. §6 gate **7**.
8. **Depth-section rhythm** — Topical content sections (`## Topic Name` — **not** ranked `## N. Product`). Each section: **text block (paragraphs)** → **one** topical `![alt](url)` → repeat **text → image** rhythm down the page. **Never stack two images** back-to-back without text between (`stacked_images`). Weave **2–3** in-context internal links to `/knowledge/{id}` in body prose. §6 gates **7**, **10**, **11**.
9. **CRO card per §C3** — render-time only (`insertCroAd()` → `afterQaEssayCroPos()`); **never in blob**. Desktop ≥768px: fixed-right viewport swinging card, renderer-injected. Mobile <768px: same card **inline full-width — after last depth-section H2, before "Related questions."** Cross-ref [`CURSOR_GOLDEN_TEMPLATES.md` §C3](CURSOR_GOLDEN_TEMPLATES.md#c3-cro-card-renderer-injected) · **§0.1** · §6 gate **18**.
10. **Related questions section** — `<h2>Related questions</h2>` with **3–5** `<h3>` questions, each answered in **≤50 words**. These target **People Also Ask.** Blob: `## Related questions` then `### Question?` + answer paragraph per item. §6 gate **12** · detail below.
11. **[Optional] `## Bottom Line`** — Essay operating-rhythm recap before FAQ; gold audit treats as optional. **Not** Top 10 ≤50-word #1-pick closing verdict. Detail below.
12. **`## FAQ`** — Single header (unnumbered — gold audit: `faq_numbered_not_unnumbered` if `## N. FAQ`); **4–6** (rubric may require ≥5) `**Question?**` bold pairs + answer paragraphs.
13. **`## Sources`** — **5–10** bulleted real named sources with URLs (`## References` accepted by audit). **YMYL** (health, money, legal): **≥2 citations to authoritative sources** + one-line disclaimer ("This is general information, not medical/financial advice — consult a professional."). **Non-YMYL:** cite statistical/factual claims; still need ≥5 real, live, named sources overall. §6 gate **9**.
14. **2–3 internal links in-context** — editorial links to `/knowledge/{id}` woven in body prose (distinct from tail `## Related on PULSE`). Cross-ref [`CURSOR_GOLDEN_TEMPLATES.md` DEFAULTS item **22**](CURSOR_GOLDEN_TEMPLATES.md#defaults-table-use-instead-of-asking) · Compliance § Internal links · §6 gate **11**.
15. **`## Related on PULSE`** — Internal library link line (tail sibling nav — distinct from in-body editorial links).
16. **Word floor ≥600** — YESNO may ship at 600–799; DEFINITION/PROCESS usually land 900–1,400 (target ≥800 per Compliance table). No ceiling; never pad; padding is a gate failure. The direct answer does the ranking work; the body proves you earned it. §6 gate **10**.

**Optional (rubric may still require):** 2 mermaid diagrams in content H2s.

### Live page sequence

```
Badges → H1 (from question) → byline (`<p class="byline">`) → Listen
  → Direct Answer [gold box — NO top hero before]
  → [Optional hero — after DA + intro prose; §2 item 6 — same rules as Template A + §C2]
  → Depth H2 sections (3–6): text → image → text → image …
  → [CRO: desktop fixed-right | mobile inline after last depth H2 — §0.1]
  → Related questions (3–5 H3 Q&As, ≤50 words each — PAA target)
  → [Optional Bottom Line] → FAQ → Sources → Related on PULSE
```

### Gold audit (`auditQaGoldTemplate`)

Enforces: `## Direct Answer` first H2; no hero before DA; optional hero after DA + intro prose (§2 item **6**); **3–6** depth-section H2s (searchable sub-questions where natural); text→image rhythm (no stacked images); tail order FAQ → Sources → Related; no blank Direct Answer; no live pollinations; no CRO in blob; no ranking artifacts (`@@PRODUCT`, 🏆/💎). Load `QA_TEMPLATE_OUTLINE` at pipeline STEP 2.

---

### Byline + dateModified (required on every page)

**Required on every golden-template page** — Q&A (q11133), Top 10 (aq1158), all pillars. Render-time only — **not in blob**.

#### Render location (cite from code)

`netlify/functions/pulse-machine-entry.js` emits `<p class="byline">By Kory White · Updated {dateModified}</p>` (~**L1320** area) **immediately below** `<h1 class="q">` (and optional `${heroHtml}` — empty on general Q&A with `noTopHero`), **before** the Listen button (`#read-aloud-top`) and `<div class="body">`. CSS: `.byline` (~L1138).

**Near-top chrome order:** crumb → badges → H1 → **byline** → Listen → body / Direct Answer gold box.

#### Visible content

Render-time `<p class="byline">By Kory White · Updated {dateModified}</p>` — author name = **Kory White**; `{dateModified}` from update chain below (formatted `Mon D, YYYY` when shown on page, ISO in JSON-LD).

| Slot | Display | Notes |
|------|---------|-------|
| **Author** | `By Kory White` | Visible in byline paragraph |
| **Updated (dateModified)** | ` · Updated {Mon D, YYYY}` | From update chain; DEFAULTS: today at generation time when unknown |

Dates use `toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })`.

#### Source fields (index + blob)

| Field | Role | Precedence / merge |
|-------|------|-------------------|
| **`entry.ts`** | Primary **published** date | First in publish chain |
| **`entry.was_indexed_at`** | Published fallback | When `ts` absent |
| **`entry.cc_signed_at`** | Published / updated fallback | Certify timestamp |
| **`entry.polished_at`** | Primary **updated** / `dateModified` | **Index is source of truth** — renderer merges from `_index.json` (~L817–824); per-entry blob may be stale |
| **`entry.updated_at`** | Updated fallback | Set on blob patch (e.g. `_v2_components.js` `seedWrite`) when `polished_at` absent |
| **`entry.author`** | Optional author string | **Not** rendered in byline today; visible byline uses **Kory White** per §2 item **4**; E-E-A-T author/editor also in JSON-LD (below) |

**Publish chain (visible Published):** `entry.ts || entry.was_indexed_at || entry.cc_signed_at || Date.now()`

**Update chain (visible Updated + JSON-LD `dateModified`):** `entry.polished_at || entry.updated_at || entry.cc_signed_at`

#### Author / byline (structured data)

Visible byline carries **Kory White** + **Updated {dateModified}**. **Author attribution** is also renderer-owned JSON-LD (~L876–938), not blob markdown:

| JSON-LD field | Value |
|---------------|-------|
| `TechArticle.author` | Pulse / The Machine (`machineAuthor`) |
| `TechArticle.editor` | Kory White (`koryEditor`) |
| `TechArticle.dateModified` | `entry.polished_at` ISO, else `datePublished` |
| `QAPage.mainEntity.datePublished` | `entry.ts` ISO |

Do **not** bake bylines, datelines, or author HTML into answer blobs — renderer + index fields only.

Top 10 lists use the same byline slot — see [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§2** item **7**.

### Bottom Line (Q&A — optional; no closing verdict)

| | Q&A essay (q11133) | Top 10 (aq1158) |
|--|-------------------|-----------------|
| **Mandatory?** | **No** — gold audit skips `bottomLine` in strict tail order (`TAIL_KEYS.filter(k => k !== 'bottomLine')` in `_qa_gold_template.js`) | **Yes** — mandatory tail H2 |
| **Rubric** | Optional; some pillars/rubric passes may still require `## Bottom Line` before FAQ | Required for 13/13 + gold audit |
| **Content law** | Operating-rhythm recap or thesis close — **not** a ranked-product pick | **Closing verdict paragraph (~50 words)** repeating **#1 (Best Overall)** — see [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §2 · `## Bottom Line` |
| **#1 pick / Best Overall** | **N/A** — essay shape has no ranked winner | Required bookend after full list |

Do **not** copy Top 10's ≤50-word #1-pick **closing verdict** onto Q&A. Q&A `## Bottom Line` (when present) answers "what to do next" for the essay topic — not "buy product X."

### Direct answer block (Q&A — not Top 10)

**Placement:** Gold box is the **first content block in `<div class="body">`** after H1 + byline + Listen chrome — **first element after byline**. **40–60 words** — featured-snippet target; format by `data-subtype` (§1 [Classify sub-type](#classify-sub-type)): **YESNO** → opens `<strong>Yes/No/It depends</strong>` + one-sentence condition · **DEFINITION** → `"{Term} is …"` quotable first sentence · **PROCESS** → method summary + time required · **BESTPICK** → the pick + qualifying condition. Renderer sets `data-subtype` on `<article>` from `classifyQaSubType(title)`. **No top hero** before `## Direct Answer` (gold audit: `image_before_direct_answer`).

**Contrast with Top 10:** Q&A Direct Answer is **dense explanatory prose** that directly answers the page question. **No #1 pick, no Best Overall/Value pills, no ranked-product framing, no price callouts for a "winner."** Do **not** copy the Top 10 ≤50-word #1-pick rule onto Q&A.

| Layer | Rule |
|-------|------|
| **Blob** | `## Direct Answer` — first H2; gold audit: `first_h2_not_direct_answer` if not. |
| **Lead (snippet target)** | **40–60 words** — **first element after byline**; format by sub-type; first 1–2 sentences answer the question's promise plainly (**featured-snippet / AEO lead**, not a product pick). |
| **Full block** | ≥140 chars, ≥2 sentences; add one concrete differentiator so rendered meta lands in the **120–160** char band (`direct_answer_blank` if stub). |
| **Render** | Same gold `direct-answer-box` / `direct-answer-label` at serve time (`wrapDirectAnswerGold()` in `pulse-machine-entry.js`) — **not in blob**. |
| **Snippet target** | Same **`descExcerpt()`** / meta-description mechanism as Top 10; **different content law** — answer the question, not name a #1 product. |

#### Format by `data-subtype`

Subtypes (set `data-subtype` on `<article>`): YESNO (is/are/can/should/does/do/will), DEFINITION ("what is/are"), PROCESS ("how to/do"), BESTPICK ("what/which is the best X", single answer).

**YESNO:** opens `<strong>Yes/No/It depends</strong>` + one-sentence condition.

**DEFINITION:** `"{Term} is …"` quotable first sentence.

**PROCESS:** method summary + time required.

**BESTPICK:** the pick + qualifying condition.

CRO must **never** splice inside the Direct Answer gold box (guardrails: `directAnswerBoxEndPos`, `afterDirectAnswerPos`).

### Byline + dateModified visible

**Byline + dateModified visible.** Render-time `<p class="byline">By Kory White · Updated {dateModified}</p>` immediately below H1 (before Listen / body). **`TechArticle.author`** + **`dateModified`** in JSON-LD — **not in blob**. §6 gate **14** · field chains and JSON-LD mapping in [§2 Byline + dateModified](#byline--datemodified-required-on-every-page) above.

---

## 3. SCHEMA (required)

**Inject one JSON-LD block:**

#### Html

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "QAPage",
      "url": "https://example.com/knowledge/q00000",
      "mainEntity": {
        "@type": "Question",
        "name": "What Is an Example Operator Question?",
        "answerCount": 1,
        "datePublished": "2027-01-15T12:00:00.000Z",
        "author": { "@type": "Organization", "name": "Pulse", "url": "https://example.com/themachine" },
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Plain-text excerpt of the answer body, clipped to five thousand characters at render time.",
          "url": "https://example.com/knowledge/q00000",
          "datePublished": "2027-01-15T12:00:00.000Z",
          "author": { "@type": "Organization", "name": "Pulse", "url": "https://example.com/themachine" }
        }
      }
    },
    {
      "@type": "TechArticle",
      "headline": "What Is an Example Operator Question?",
      "url": "https://example.com/knowledge/q00000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "keywords": "tag-one, tag-two",
      "author": { "@type": "Organization", "name": "Pulse", "url": "https://example.com/themachine" },
      "editor": { "@type": "Person", "name": "Kory White", "jobTitle": "Chief Revenue Officer" },
      "publisher": { "@type": "Organization", "name": "Pulse News" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/knowledge/q00000" },
      "description": "Short meta description restating the question promise plus one differentiator."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": "https://example.com/knowledge.html" },
        { "@type": "ListItem", "position": 3, "name": "What Is an Example Operator Question?", "item": "https://example.com/knowledge/q00000" }
      ]
    }
  ]
}
</script>
```

**Also include Article schema (`TechArticle`) with author, datePublished, dateModified.**

**Do not emit `ItemList` on Q&A** — essay pages are `QAPage`, not ranked-product lists. Top 10 listicle law: [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§3**.

**Render-time only — not in blob.** Structured data is injected by `netlify/functions/pulse-machine-entry.js` in `<head>` (~**L876–952** build, ~**L1092** emit). Writers, DeepSeek, and the image pipeline **must not** add JSON-LD, `<script type="application/ld+json">`, or schema markup to answer blobs.

**Required on every Q&A essay page** (q11133 shape, all pillars). Listicle-intent schema → [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) §3 (aq1158).

**Gold reference (live verify):** [q11133](https://pulserevops.com/knowledge/q11133) — view page source → single `<script type="application/ld+json">`. Live `@types`: `QAPage`, `TechArticle`, `BreadcrumbList` (+ nested `Question`, `Answer`, `Organization`, `Person`, `ImageObject`, `WebPage`, `ListItem`).

### Required structured data (owner law)

Every Q&A essay render injects **one** JSON-LD `@graph` in `<head>`. Minimum required nodes:

> **Also include Article schema (`TechArticle`) with author, datePublished, dateModified.**

| Schema node | Requirement | §6 gate |
|-------------|-------------|---------|
| **`QAPage`** | Inject JSON-LD **`QAPage`** with `mainEntity` **`Question`** + single **`acceptedAnswer`** (`Answer`); `answerCount: 1` | item **8** |
| **`TechArticle`** (`Article`) | Same `@graph` block includes **`TechArticle`** (schema.org **`Article`** subtype) with **`author`**, **`datePublished`**, **`dateModified`** from index fields | item **8** |
| **`BreadcrumbList`** | Home → Knowledge Library → this entry | item **8** (with QAPage) |

Optional when applicable: **`FAQPage`** (when tail `## FAQ` has ≥5 pairs). **Do not emit `ItemList` on Q&A.**

| Rule | Detail |
|------|--------|
| **Count** | **Exactly one** `<script type="application/ld+json">` per rendered page — no second LD script, no inline duplicate blocks |
| **Owner** | Renderer (`pulse-machine-entry.js`) builds the object at serve time from index + blob fields |
| **Blob forbidden** | No JSON-LD in markdown bodies — gold audit / visual lock treat baked schema as contamination |
| **Pattern** | Single script wraps one JSON object using `@context` + `@graph` (multiple schema types in one block) |

The page may have other `<script>` tags (e.g. lazy mermaid loader ~L1093) — those are **not** JSON-LD and do not count toward the one-block rule.

### HTML injection (renderer-owned)

JSON-LD is injected as **HTML** in the rendered page — not as markdown in the answer blob. The renderer builds a JavaScript object at serve time and serializes it into the document `<head>`.

| Rule | Detail |
|------|--------|
| **Location** | `<head>` only — after favicon / apple-touch-icon links, before the lazy mermaid loader (~**L1092**) |
| **Tag** | Exactly one `<script type="application/ld+json">…</script>` — `type="application/ld+json"` tells crawlers this is structured data, not executable JS |
| **Content** | **Valid JSON** inside the script tag — must parse with `JSON.parse()` (no trailing commas, no comments, no HTML entities inside the JSON) |
| **Build** | `const ld = { "@context": "https://schema.org", "@graph": [ … ] }` → `${JSON.stringify(ld)}` inlined in the HTML template |
| **Not in blob** | Answer markdown must never contain `<script>`, `application/ld+json`, or raw `@context` / `@graph` blocks |

**Renderer code** (`pulse-machine-entry.js` ~L1067–1092):

```javascript
const html = `<!doctype html>
<html lang="en">
<head>
  …
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script>/* lazy mermaid loader — NOT JSON-LD */</script>
</head>
<body>…</body>
</html>`;
```

`JSON.stringify(ld)` emits compact single-line JSON (no pretty-print). Whitespace inside the tag is optional — crawlers accept both compact and indented forms as long as the payload is valid JSON. The **#### Html** block above is the canonical pretty-print reference; live output uses compact `JSON.stringify(ld)`.

### Index / blob field mapping (dates + author)

JSON-LD dates and author objects are built from **index entry fields** at render time — never from blob markdown.

| Index field | JSON-LD use | Renderer chain |
|-------------|-------------|----------------|
| **`entry.ts`** | `TechArticle.datePublished` · `QAPage.mainEntity.datePublished` · `acceptedAnswer.datePublished` | Primary publish timestamp → ISO (`datePub`) |
| **`entry.polished_at`** | `TechArticle.dateModified` | Index is source of truth (~L817–824); ISO when present, else falls back to `datePublished` |
| **`entry.updated_at`** | Visible **Updated** dateline (§2 meta-row) | Feeds on-page dateline when `polished_at` absent; **not** currently wired to `TechArticle.dateModified` in code |
| **`entry.author`** | — | Optional blob/index string; **not** rendered in meta-row or JSON-LD today |

**Publish ISO (`datePub`):** `new Date(entry.ts \|\| Date.now()).toISOString()`

**Modified ISO (`dateModified`):** `entry.polished_at ? new Date(entry.polished_at).toISOString() : datePub`

See §2 **Byline + dateModified** for visible Published / Updated dateline chains (`was_indexed_at`, `cc_signed_at` fallbacks).

### Q&A essay — `@graph` nodes (as implemented)

Essay Q&A pages (`appliesQaGold()` / `template: 'qa'`) emit **three** nodes inside the one `@graph` array (~**L909–952**):

| # | `@type` | Role |
|---|---------|------|
| 1 | **`QAPage`** | Question + single accepted answer — primary rich-result signal for Q&A intent |
| 2 | **`TechArticle`** | Article metadata, E-E-A-T author/editor, `dateModified` |
| 3 | **`BreadcrumbList`** | Home → Knowledge Library → this entry |

#### `QAPage` — required fields

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"QAPage"` | Yes |
| `url` | Canonical entry URL | Yes |
| `mainEntity.@type` | `"Question"` | Yes |
| `mainEntity.name` | `entry.question` | Yes |
| `mainEntity.answerCount` | `1` | Yes |
| `mainEntity.datePublished` | `entry.ts` ISO (`datePub`) | Yes |
| `mainEntity.author` | `machineAuthor` (Pulse / The Machine org) | Yes |
| `mainEntity.acceptedAnswer.@type` | `"Answer"` | Yes |
| `mainEntity.acceptedAnswer.text` | Plain text of rendered **direct-answer** body — **exact match** to `<p class="direct-answer">` / gold `direct-answer-box` content (owner law · §6 gate **8** · [`CURSOR_GOLDEN_TEMPLATES.md` B3](CURSOR_GOLDEN_TEMPLATES.md#b3-schema--one-json-ld)). **Code today:** first **5,000** chars of `entry.answer` — **gap — renderer task** | Yes |
| `mainEntity.acceptedAnswer.url` | Canonical entry URL | Yes |
| `mainEntity.acceptedAnswer.datePublished` | `datePub` | Yes |
| `mainEntity.acceptedAnswer.author` | `machineAuthor` | Yes |

#### Article schema (`TechArticle`) — required on every page

Pulse uses **`TechArticle`** (schema.org subtype of **`Article`**) as the Article node in `@graph`. Every Q&A page **must** include this node alongside `QAPage` — not `QAPage` alone.

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"TechArticle"` | Yes |
| `headline` | `entry.question` | Yes |
| `url` | Canonical entry URL | Yes |
| **`datePublished`** | `entry.ts` → ISO (`datePub`) | Yes |
| **`dateModified`** | `entry.polished_at` → ISO, else `datePublished` | Yes |
| **`author`** | `machineAuthor` — **Organization** (Pulse / The Machine) | Yes |
| `editor` | `koryEditor` — **Person** (Kory White, CRO) | Yes |
| `publisher` | `publisherOrg` — **Organization** (Pulse News + logo) | Yes |
| `keywords` | `entry.tags` joined | Yes |
| `mainEntityOfPage.@type` | `"WebPage"` | Yes |
| `mainEntityOfPage.@id` | Canonical entry URL | Yes |
| `description` | `descExcerpt(entry.answer)` | Yes |

**Author attribution (what Pulse uses):**

| Role | `@type` | `name` | Notes |
|------|---------|--------|-------|
| **`author`** | **Organization** | `"Pulse"` | `machineAuthor` — AI research engine (`@id`: `SITE + "/#themachine"`, `url`: `/themachine`) |
| **`editor`** | **Person** | `"Kory White"` | `koryEditor` — human CRO / curator (`jobTitle`: `"Chief Revenue Officer"`, `url`: `/resume`) |
| **`publisher`** | **Organization** | `"Pulse News"` | `publisherOrg` — site publisher with logo `ImageObject` |
| **`QAPage.mainEntity.author`** | **Organization** | `"Pulse"` | Same `machineAuthor` on Question + accepted Answer |

E-E-A-T lives in JSON-LD — visible meta-row (§2) carries dateline only, not author byline. §2 **Author / byline (structured data)** maps to these fields.

#### `BreadcrumbList` — required fields

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"BreadcrumbList"` | Yes |
| `itemListElement` | Array of 3 `ListItem` objects | Yes |
| `itemListElement[0]` | `{ position: 1, name: "Home", item: SITE + "/" }` | Yes |
| `itemListElement[1]` | `{ position: 2, name: "Knowledge Library", item: SITE + "/knowledge.html" }` | Yes |
| `itemListElement[2]` | `{ position: 3, name: entry.question, item: canonical URL }` | Yes |

#### Example skeleton (Q&A — generic placeholders)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "QAPage",
      "url": "https://example.com/knowledge/q00000",
      "mainEntity": {
        "@type": "Question",
        "name": "What Is an Example Operator Question?",
        "answerCount": 1,
        "datePublished": "2027-01-15T12:00:00.000Z",
        "author": {
          "@type": "Organization",
          "name": "Pulse",
          "url": "https://example.com/themachine"
        },
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Plain-text excerpt of the answer body, clipped to five thousand characters at render time.",
          "url": "https://example.com/knowledge/q00000",
          "datePublished": "2027-01-15T12:00:00.000Z",
          "author": {
            "@type": "Organization",
            "name": "Pulse",
            "url": "https://example.com/themachine"
          }
        }
      }
    },
    {
      "@type": "TechArticle",
      "headline": "What Is an Example Operator Question?",
      "url": "https://example.com/knowledge/q00000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "keywords": "tag-one, tag-two",
      "author": { "@type": "Organization", "name": "Pulse", "url": "https://example.com/themachine" },
      "editor": { "@type": "Person", "name": "Kory White", "jobTitle": "Chief Revenue Officer" },
      "publisher": { "@type": "Organization", "name": "Pulse News" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/knowledge/q00000" },
      "description": "Short meta description restating the question promise plus one differentiator."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": "https://example.com/knowledge.html" },
        { "@type": "ListItem", "position": 3, "name": "What Is an Example Operator Question?", "item": "https://example.com/knowledge/q00000" }
      ]
    }
  ]
}
```

#### FAQPage (owner target — when `## FAQ` present)

> **Note:** FAQ rich results now display mostly for high-authority sites, but the markup still feeds Google's understanding and AI Overviews — keep it.

| Rule | Detail |
|------|--------|
| **Trigger** | Blob has `## FAQ` with **≥5** pairs (13/13 criterion 4) |
| **Target `@graph` node** | `FAQPage` with `mainEntity[]` of `Question` / `acceptedAnswer` |
| **Pair format** | `**Question?**` bold line + answer paragraph(s) — same as on-page FAQ |
| **Code today** | **Not emitted** on entry pages — hub pages only (e.g. `_aq_compete_semantic_keywords.js` → `hubFaqJsonLd()`) |

#### Code vs owner spec (Q&A)

| Element | Owner spec | Code today (`pulse-machine-entry.js` ~L909–952) | Status |
|---------|------------|------------------------------------------------|--------|
| **QAPage** + Question/Answer | Required | Emitted | **Aligned** (except `acceptedAnswer.text` — see below) |
| **`acceptedAnswer.text`** | Exact match to rendered direct-answer box plain text | First 5,000 chars of `entry.answer` | **Gap — renderer task** |
| **TechArticle** (Article node) | Required — `TechArticle`, not generic `Article` | Emitted | **Aligned** |
| **BreadcrumbList** | Required | Emitted | **Aligned** |
| **FAQPage** | Required when FAQ ≥5 pairs | Not on entries | **Gap — renderer task** |
| **`alternateName`** from `seo_kw_cluster` | Index SEO variants in JSON-LD | Not rendered (`_CROSSOVER.md` queued) | **Gap — renderer task** |

#### SCRUBBER_SPEC tie-in

Schema is **not** a separate 13/13 checkpoint (`SCRUBBER_SPEC.md` criteria 1–13). It **derives** from gated blob content: **#2–3** Direct Answer → `TechArticle.description`; **#4** FAQ ≥5 → FAQPage eligibility when renderer ships.

**Post-render audit:** `_sf_crawl_audit.js` (`jsonLdTypes`, `hasJsonLd`); `_pulse_spider.js` — confirm `QAPage` + `TechArticle` on live Q&A URL.

Blobs never carry JSON-LD — renderer + index fields only.

---

## 4. HTML SKELETON

**Render-time only — not in blob.** Answer blobs store **markdown + text only** (`entry.answer`), not full HTML. This section is the **renderer output target reference** — the live page shape `netlify/functions/pulse-machine-entry.js` emits at serve time via `renderMd()` → `wrapDirectAnswerGold()` → `insertCroAd()` → template string (~**L1067–1374**).

**Gold law:** Q&A essays have **no top hero before Direct Answer** (`noTopHero` when `appliesQaGold()`). Optional hero **after** Direct Answer + intro prose (§2 item **5**). CRO is **never** stored in markdown — injected by `insertCroAd()` at render time inside `<div class="body">`. **No `@@PRODUCT`** — essay shape only. Cross-refs: **§0.1** CRO · **§2** page chrome · **§3 SCHEMA (required)** · Top 10 full skeleton [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§4**.

### Q&A deltas vs Top 10 §4

| Element | Top 10 (aq1158) | Q&A essay (q11133) |
|---------|-----------------|---------------------|
| **JSON-LD `@graph`** | **`ItemList`** + N `ListItem` + **`TechArticle`** + **`BreadcrumbList`** | **`QAPage`** + **`TechArticle`** + **`BreadcrumbList`** — **no `ItemList`** |
| **Top hero** | Forbidden (`noTopHero`) | Forbidden before Direct Answer — **no** `<figure class="entry-cover">` |
| **First body block** | `direct-answer-box` (#1 / Best Overall lead) | `direct-answer-box` (question-first — **no** ranked-product framing) |
| **Content rhythm** | `## 1.`–`## N.` + `product-card` per rank | Topical `##` H2s — text → **`figure.entry-section`** → text |
| **`@@PRODUCT`** | Per rank when cards used | **Forbidden** |
| **CRO anchor** | `afterTop10Item3Card()` — after rank **#3** `product-card` | **Owner:** after last depth H2, before **Related questions** — code: `afterQaEssayCroPos()` |
| **Tail** | How We Ranked → ranks → How to Choose → Bottom Line (mandatory) | Depth H2s → Related questions (h2/h3) → optional Bottom Line → FAQ → Sources → Related on PULSE |
| **Mermaid** | Exactly **one** in How to Choose | Up to **two** in content H2s (rubric 5–6) |

#### Html

Placeholders: `{id}`, `{question}`, `{pillar}`. Gold reference: [q11133](https://pulserevops.com/knowledge/q11133). Comments describe renderer ownership vs blob origin. CRO `#croFixed` / `#croMobCard` injected at render — **never in blob**. Q&A: **no `ItemList`**, **no `product-card`**, **no `@@PRODUCT`**.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><!-- entry.question — clipped for &lt;title&gt; --></title>
  <meta name="description" content="<!-- descExcerpt(entry.answer) — ≤158 chars -->">
  <meta name="keywords" content="<!-- entry.tags joined -->">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="<!-- SITE + /{pillar}/{id} -->">
  <!-- optional: <link rel="prev|next"> for q#### sequential crawl -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="<!-- entry.question -->">
  <meta property="og:description" content="<!-- descExcerpt() -->">
  <meta property="og:url" content="<!-- canonical URL -->">
  <meta property="og:site_name" content="Pulse News">
  <meta property="og:image" content="https://pulserevops.com/og-preview.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<!-- entry.question -->">
  <meta name="twitter:description" content="<!-- descExcerpt() -->">
  <meta name="twitter:image" content="https://pulserevops.com/og-preview.jpg">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- §3 JSON-LD — exactly ONE script; QAPage + TechArticle + BreadcrumbList (no ItemList) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "QAPage",
        "url": "<!-- canonical URL -->",
        "mainEntity": {
          "@type": "Question",
          "name": "<!-- entry.question -->",
          "answerCount": 1,
          "datePublished": "<!-- entry.ts ISO (datePub) -->",
          "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "<!-- first 5000 chars entry.answer plain text -->",
            "url": "<!-- canonical URL -->",
            "datePublished": "<!-- datePub -->",
            "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" }
          }
        }
      },
      {
        "@type": "TechArticle",
        "headline": "<!-- entry.question -->",
        "url": "<!-- canonical URL -->",
        "datePublished": "<!-- entry.ts ISO -->",
        "dateModified": "<!-- entry.polished_at ISO, else datePublished -->",
        "keywords": "<!-- entry.tags -->",
        "author": { "@type": "Organization", "name": "Pulse", "url": "https://pulserevops.com/themachine" },
        "editor": { "@type": "Person", "name": "Kory White", "jobTitle": "Chief Revenue Officer" },
        "publisher": { "@type": "Organization", "name": "Pulse News" },
        "mainEntityOfPage": { "@type": "WebPage", "@id": "<!-- canonical URL -->" },
        "description": "<!-- descExcerpt() -->"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pulserevops.com/" },
          { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": "https://pulserevops.com/knowledge.html" },
          { "@type": "ListItem", "position": 3, "name": "<!-- entry.question -->", "item": "<!-- canonical URL -->" }
        ]
      }
    ]
  }
  </script>

  <!-- lazy mermaid loader — non-blocking; skipped when no .mermaid on page -->
  <script><!-- mermaid lazy-load IIFE --></script>
  <style><!-- inline entry + CRO CSS (~L1113–1281) --></style>
  <link rel="stylesheet" href="/assets/pulse-tan.css">
</head>
<body>
  <button id="scroll-top" type="button" aria-label="Scroll to top">↑</button>

  <div class="top">
    <a href="/" class="brand" aria-label="Pulse News — Value Added">
      <img class="brandlogo" src="/pulse-news-logo.png" alt="Pulse News — Value Added" width="164" height="46">
    </a>
    <span><a href="/knowledge.html">← Library</a></span>
  </div>

  <article><!-- class="cc-gold" when entry.cc_signed -->

    <!-- §2 — badges -->
    <div class="crumb"><a href="/knowledge.html">Knowledge Library</a> · <!-- primary tag --></div>
    <!-- optional: <span class="cc-gold-badge">🏆 13/13 · Claude Code Audited</span> -->
    <div><!-- quality pills: ✓ Machine Certified · 10/10 · ? help --></div>

    <!-- §2 — title -->
    <!-- RENDERER: single page H1 from entry.h1 || entry.question (~L1318) -->
    <!-- BLOB: no # H1 — renderMd() drops lone # lines; start at ## Direct Answer -->
    <h1 class="q"><!-- entry.question --></h1>

    <!-- Q&A GOLD: noTopHero — NO <figure class="entry-cover"> before Direct Answer (~L959–961) -->
    <!-- ${heroHtml} is empty when appliesQaGold() — no top hero before gold box -->

    <!-- §2 item 6 — meta byline: word count + Published / Updated dateline (render-time only) -->
    <div class="meta-row">
      <span title="Word count of this answer">📖 <!-- N --> words</span>
      <span style="margin-left:auto">🗓️ Published <!-- Mon D, YYYY --> · Updated <!-- Mon D, YYYY when ≠ published --></span>
    </div>

    <!-- §2 — Listen (TTS) -->
    <div>
      <button type="button" id="read-aloud-top" aria-label="Read this answer aloud">
        <span id="ra-top-icon">🔊</span><span id="ra-top-label">Listen to this answer</span>
      </button>
    </div>

    <!-- §2 body — markdown → renderMd() → wrapDirectAnswerGold() → insertCroAd() -->
    <div class="body">

      <!-- §2 item 4 — div.direct-answer (owner); render: class="direct-answer-box" via wrapDirectAnswerGold() -->
      <!-- BLOB: ## Direct Answer — first H2; 40–60 word AEO lead; ≥140 chars; ≥2 sentences; NOT stored as HTML -->
      <div class="direct-answer-box">
        <div class="direct-answer-label">Direct Answer</div>
        <p><!-- question-first featured-snippet target — no #1 product pick --></p>
      </div>

      <!-- BLOB: intro prose block after Direct Answer (before first depth H2 or hero) -->
      <p>…</p>

      <!-- BLOB [optional]: hero / face-card — after Direct Answer + intro prose (§2 item 5); NOT before gold box -->
      <!-- fetchpriority="high" loading="eager" — same rules as Template A §2 item 6 + §C2; may coincide with first depth-section image -->
      <figure class="entry-section">
        <img src="https://pulserevops.com/assets/qa/q11133-hero.jpg"
             alt="<!-- topic overview alt -->"
             width="760" height="428"
             loading="eager" fetchpriority="high"
             onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
      </figure>

      <!-- BLOB: depth sections — 3–6 topical ## H2s (searchable sub-questions where natural) -->
      <h2><!-- Topical section title — searchable sub-question --></h2>
      <p>…</p>
      <figure class="entry-section">
        <img src="https://pulserevops.com/assets/qa/q11133-1.jpg"
             alt="<!-- topical alt -->"
             width="760" height="428"
             loading="lazy" decoding="async"
             onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
      </figure>

      <h2><!-- Next depth section --></h2>
      <p>…</p>
      <figure class="entry-section"><!-- second section image --></figure>

      <!-- … repeat text → image rhythm (min 3 section images total; never stacked images) … -->

      <h2><!-- Additional depth sections (3–6 total) … --></h2>
      <p>…</p>
      <figure class="entry-section"><!-- third+ section image --></figure>

      <!-- ═══ CRO injected at render after last depth h2 (mobile) / fixed-right desktop — NEVER in blob (§0.1) ═══ -->
      <!-- insertCroAd() → croInsertPos() → afterQaEssayCroPos(); MUST NOT splice inside direct-answer-box -->
      <!-- Desktop (≥768px target): fixed right viewport swinging card — #croFixed position:fixed; not in body flow -->
      <div class="cro-ad cro-ad-card cro-ad-root" id="croFixed" aria-label="Sponsored — Kory White, Fractional CRO">
        <div class="cro-swing">
          <div class="cro-cord"></div><div class="cro-peg"></div>
          <div class="cro-card"><!-- .cro-spine · .cro-close · .cro-btn · .cro-links --></div>
        </div>
      </div>
      <!-- Mobile (<768px target): inline full-width #croMobCard immediately after last depth-section H2, before Related questions -->
      <div class="cro-mob-card" id="croMobCard" aria-label="Sponsored — Kory White, Fractional CRO">
        <div class="cro-swing"><!-- same .cro-card markup as desktop --></div>
      </div>
      <!-- Code today: afterQaEssayCroPos() — DA → text → first &lt;figure&gt; → following &lt;/p&gt; — align to owner slot in separate task -->

      <!-- BLOB: Related questions — PAA target; 3–5 ### Question? + ≤50-word answers -->
      <h2>Related questions</h2>
      <h3><!-- First PAA sub-question? --></h3>
      <p>…</p>
      <h3><!-- Second PAA sub-question? --></h3>
      <p>…</p>
      <h3><!-- Third PAA sub-question? --></h3>
      <p>…</p>

      <!-- BLOB [optional]: ## Bottom Line — essay recap (NOT Top 10 #1-pick closing verdict) -->
      <h2>Bottom Line</h2>
      <p>…</p>

      <!-- BLOB: ## FAQ — single header; 4–6 **Question?** bold pairs + answer paragraphs -->
      <h2>FAQ</h2>
      <p><strong>Question?</strong></p>
      <p>…</p>

      <!-- BLOB: ## Sources — 5–10 bulleted real named sources with URLs -->
      <h2>Sources</h2>
      <ul><li>…</li></ul>

      <!-- BLOB: ## Related on PULSE — internal /knowledge/{id} link line -->
      <h2>Related on PULSE</h2>
      <p>…</p>

      <!-- optional: mermaid diagrams (max 2 rubric) — moveMermaidToBottom() clusters before Related on PULSE -->
      <div class="mermaid-wrap"><div class="mermaid"><!-- diagram source --></div></div>

    </div><!-- /.body — insertCroAd(moveMermaidToBottom(renderedAnswer), id) (~L1325) -->

    <!-- post-body chrome — renderer-owned; not blob markdown -->
    <div class="dl-row" aria-label="Download options"><!-- .md · .pdf · Social Studio · Listen --></div>
    <div id="social-panel" hidden><!-- Social Studio --></div>
    <textarea id="raw-md" hidden readonly><!-- entry.answer markdown --></textarea>
    <div id="feedback-row"><!-- Was this helpful? 👍 👎 ☆ --></div>
    <div class="share-row entry-share" aria-label="Share this answer"><!-- LinkedIn · X · Facebook · Email · Copy --></div>
    <div class="entry-sources"><!-- Sources cited — index sources[] rail --></div>
    <div class="entry-sources"><!-- Deep dive · related in the library --></div>
    <div class="entry-sources"><!-- More from the library --></div>
    <nav class="seq-nav" aria-label="Previous and next library entry"><!-- rel=prev / rel=next --></nav>

  </article>

  <div class="viz-lightbox" id="viz-lightbox" role="dialog" aria-label="Visual zoom">…</div>
  <section class="mag-mosaic" data-pulse-mosaic data-pillar="<!-- pillar -->" aria-label="More stories in this topic"></section>
  <div class="footer-note">Researched autonomously by <a href="/themachine">The Machine</a> …</div>

  <script src="/js/pulse-face-img.js" defer></script>
  <script src="/js/pulse-home-mosaic.js" defer></script>
  <script src="/js/human-gate.js" defer></script>
  <script src="/js/pulse-lead-track.js" defer></script><!-- CRO click beacons -->
  <script src="/pulse-ambient.js" defer></script>
  <script><!-- scroll-top · read-aloud · share-copy · feedback · mermaid zoom --></script>
</body>
</html>
```

Writers, DeepSeek, and the image pipeline **must not** bake HTML, `<div class="direct-answer-box">`, CRO markup, or layout widgets into blobs — blob HTML is escaped by `escHtml()` and renders as literal text. **Forbidden on Q&A:** `@@PRODUCT`, `product-card`, ranked `## N.` headings, top hero before Direct Answer.

### Required skeleton elements (Q&A render target)

| Element | Owner law | Blob? |
|---------|-----------|-------|
| **`<article>` wrapper** | Renderer shell around crumb, H1, `.body`, share/related rails | No — template only |
| **`<h1 class="q">`** | Single page question from `entry.h1 \|\| entry.question` (~L1318) | No `#` H1 in blob — start at `## Direct Answer` |
| **`div.direct-answer`** | Owner term (§2 item **4**); render: **`direct-answer-box`** from `## Direct Answer` via `wrapDirectAnswerGold()` — **first content in `.body`**; question-first AEO lead, **not** #1 product pick | Markdown prose only — box injected at render |
| **Hero image (optional)** | `<figure class="entry-section">` **after** Direct Answer + intro prose — `fetchpriority="high"`, `loading="eager"`, `onerror` fallback (§2 item **5**). **No** `<figure class="entry-cover">` before Direct Answer (`noTopHero`) | Blob `![alt](/assets/qa/…)` after DA prose block — never before `## Direct Answer` |
| **Depth sections** | **3–6** topical `<h2>`s — searchable sub-questions where natural; text → `<figure class="entry-section">` → text rhythm | Markdown `## Section title` + `![alt](url)` per slot |
| **Related questions** | `<h2>Related questions</h2>` + **3–5** `<h3>` PAA sub-questions, each answered in **≤50 words** | Blob `## Related questions` + `### Question?` + answer paragraph |
| **Sources** | `<h2>Sources</h2>` — 5–10 bulleted real named sources with URLs | Blob `## Sources` (or `## References`) |
| **`@@PRODUCT`** | **Forbidden** on Q&A — no `product-card`, no ranked `## N.` headings | Never in Q&A blobs |
| **JSON-LD `<script>`** | Exactly **one** `<script type="application/ld+json">` in `<head>` — **`QAPage`** + **`TechArticle`** + **`BreadcrumbList`** — **no `ItemList`** | Never in blob — see **§3 SCHEMA (required)** |
| **CRO injection** | `insertCroAd()` splices desktop fixed + mobile inline at render — **owner slot:** after last depth H2, before Related questions — **never** stored in markdown | Render-time only — see **§0.1** |

### Source of truth

| Layer | Module | Role |
|-------|--------|------|
| Page shell | `pulse-machine-entry.js` | `<!doctype>` … `</html>` template (~L1067) |
| Body markdown → HTML | `renderMd()`, `wrapDirectAnswerGold()` | Escaped prose, headings, figures — **no `@@PRODUCT` on Q&A** |
| CRO inject | `insertCroAd()` → `croInsertPos()` → `afterQaEssayCroPos()` | Desktop fixed + mobile inline at same anchor |
| Meta / title | `shortTitle`, `descExcerpt()`, `clipMeta()` | `<title>`, `<meta name="description">`, OG/Twitter |
| Structured data | `ld` object (~L909–952) | Single JSON-LD block in `<head>` (~L1092) |

### Q&A essay — `<div class="body">` fragment (audit shorthand)

Use when verifying blob → HTML mapping without full page chrome:

```html
<div class="body">
  <div class="direct-answer-box"><div class="direct-answer-label">Direct Answer</div><!-- AEO prose — question-first --></div>
  <p>…</p><!-- intro prose after DA -->
  <figure class="entry-section"><!-- [optional] hero after DA + intro: fetchpriority="high" loading="eager" onerror --></figure>
  <h2><!-- Depth section 1 — searchable sub-question --></h2><p>…</p>
  <figure class="entry-section"><img … onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}"></figure>
  <h2><!-- Depth section 2 --></h2><p>…</p>
  <figure class="entry-section"><img …></figure>
  <h2><!-- Depth section 3+ … --></h2><p>…</p><figure class="entry-section">…</figure>
  <!-- CRO injected at render after last depth h2 (mobile) / fixed-right desktop — never in blob -->
  <h2>Related questions</h2>
  <h3><!-- PAA sub-question 1? --></h3><p>…</p>
  <h3><!-- PAA sub-question 2? --></h3><p>…</p>
  <!-- [optional] <h2>Bottom Line</h2> -->
  <h2>FAQ</h2>
  <h2>Sources</h2>
  <h2>Related on PULSE</h2>
  <!-- optional: <div class="mermaid-wrap">…</div> -->
</div>
```

**Contrast Top 10:** No `@@PRODUCT` / `product-card`, no `How We Ranked`, no ranked `## N.` headings, no `ItemList` JSON-LD. CRO must never splice inside `direct-answer-box`.

### Blob vs renderer — quick map (Q&A)

| In live HTML | Source |
|--------------|--------|
| `<title>`, meta description, JSON-LD | Renderer + index fields + `descExcerpt(blob)` |
| H1, meta-row, badges, Listen, share, related rail | Renderer only |
| `direct-answer-box`, `<h2>` depth headings, `<h3>` related questions, tail sections | Blob markdown → `renderMd()` |
| CRO `#croFixed` / `#croMobCard` | Renderer `insertCroAd()` only — **never in blob** |
| Mermaid SVG (client-side) | Blob fence → `.mermaid-wrap`; lazy-loaded script in `<head>` |

**Gold reference:** compare live DOM at [q11133](https://pulserevops.com/knowledge/q11133) against this skeleton — shape demo only; never copy prose or images.

### CRO placement — desktop vs mobile (Q&A)

| Surface | Owner spec | Code today |
|---------|------------|------------|
| **Logical slot** | After **last depth-section H2 block**, before **Related questions** | `afterQaEssayCroPos()` — DA → text → first `<figure>` → following `</p>` — **align in separate task** |
| **Desktop** | Fixed right swinging card ≥768px | `#croFixed` visible **≥1200px**; `body{padding-right:352px}` |
| **Mobile** | Inline full-width at **same slot** — before Related questions | `.cro-mob-card` at same splice index; visible **≤1199px** |
| **Never** | Inside `direct-answer-box`; in blob markdown | Guardrails: `directAnswerBoxEndPos` |
| **vs Top 10** | — | Top 10 splices at rank #3 `product-card` — Top 10 **§0.1** / **§4** |

---

## 5. RENDERING RULES

*(mobile/desktop parity — MANDATORY)*

These exist because of prior mobile↔desktop render breakage. On **2026-07-06**, production pages showed divergent desktop vs mobile layout: mosaic tiles rendered via **`background-image` CSS** instead of real `<img>` tags (broken or invisible on some viewports), **`content-visibility`** deferring mosaic/entry tiles off-screen, and **missing global `img` CSS** in `assets/pulse-tan.css` so body and section figures overflowed or collapsed. **Every generated page must obey** the rendering rules below:

### Owner rendering law (summary)

| Law | Rule | §6 gate |
|-----|------|---------|
| **Mobile-first CSS** | Single column default; layout enhancements only in `@media (min-width: 768px)` | **13** |
| **No fixed pixel widths** | No fixed pixel widths on any container or image. Containers: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;` on `.body` / `<article>` prose column | **13** |
| **Fluid typography** | `body`: `clamp(1rem, 0.95rem + 0.4vw, 1.125rem)`; `h1`: `clamp(1.6rem, 1.2rem + 2vw, 2.4rem)` | **13** |
| **Images** | `max-width:100%; height:auto`; explicit `width`/`height` HTML attrs on every `<img>` via `entryImgAttrs()` | **13** · **16** |
| **No layout tables** | Tables for true tabular data only — never for page structure, columns, or chrome | **13** |
| **Overflow-wrap** | `overflow-wrap: break-word` (+ `word-break: break-word`) on prose column — no h-scroll @375px | **13** |
| **Lazy-load** | Lazy-load every image except the hero: `loading="lazy"` `decoding="async"`. Cross-ref **§2** hero — NO lazy loading on hero | **13** · **6** |
| **Viewport test** | Manual pass at **375px** and **1440px** before certify — zero CLS, zero broken images | **15** |

- **Mobile-first CSS. Single column by default; layout enhancements only inside @media (min-width:768px).**
- **No fixed pixel widths on any container or image. Containers: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;`**
- **Fluid type: font-size: clamp(1rem, 0.95rem + 0.4vw, 1.125rem); body. H1: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);**
- **Renderer owns all visuals** — `netlify/functions/pulse-machine-entry.js` + `assets/pulse-tan.css`; answer blobs are markdown + text only (`escHtml()` / `renderMd()`). Never store HTML, inline styles, gold Direct Answer wrappers, or CRO in blobs.
- **Real `<img>` tags everywhere** — entry section figures and mosaic tiles use `<img>` (mosaic: `<img class="mm-img">` via `PulseFaceImg.mosaicImgTag()` in `js/pulse-face-img.js`); **never** `background-image` lazy-load for content or mosaic entry tiles.
- **Global img sizing** — `.entry-cover img`, `.entry-section img`, `.body figure img` → `width:100%; height:auto; max-width:100%` (`pulse-tan.css`); explicit `width`/`height` on every `<img>` via `entryImgAttrs()` (760×428 section slot; 1200×675 when entry-cover is allowed on non–Q&A pillars).
- **Test render at 375px and 1440px before marking the URL done.**
- **No tables for layout. No horizontal scroll: overflow-wrap: break-word; on the article.**
- **Lazy-load every image except the hero: `loading="lazy"` `decoding="async"`.** — cross-ref **§2** hero (NO lazy loading on hero).
- **Inject at render only** — gold `direct-answer-box` (`wrapDirectAnswerGold()`), CRO Syndicate card (`insertCroAd()` → `afterQaEssayCroPos()`) — never baked in blob markdown (see **§0.1**).
- **No `content-visibility:auto` on entry body figures** — entry prose and in-body images must paint on first scroll; mosaic tiles may use `content-visibility:visible` with real `<img>` — do not reintroduce background-image-only tiles.
- **Desktop + mobile parity** — same blob → same HTML structure at both breakpoints; CRO fixed-right vs mobile inline is a renderer CSS swap only (§0.1), not different blob markup per viewport.
- **Visual lock** — writers must not add, remove, move, or edit `![alt](url)`, HTML, or layout widgets; image pipeline may **swap** at existing slots only (`_visual_lock_law.js` → `enforceWriterVisualLock()`).
- **Q&A image rhythm** — text → one section `![alt](url)` → text → image …; never stacked images; **no top hero** before `## Direct Answer` (`noTopHero`).
- **Self-hosted images in blobs** — `/assets/qa/…` or pillar pool paths only; no live `pollinations.ai` URLs (`live_pollinations_url_in_body`).
- **onerror fallback swap on every `<img>`** — `entryImgAttrs()` (~L81–97) emits `onerror` + optional `data-fallback` on **every** renderer-built `<img>`; wsrv primary → direct URL retry on error; **Pollinations ↔ DDG provider rotation** cross-ref [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§6** (see **§ Images — onerror fallback swap**).
- **Broken image = hard FAIL** — any live broken/missing image blocks certify (`Agent B`, rubric #12, `SCRUBBER_SPEC.md` `IMAGE_DEAD` / `IMAGE_PLACEHOLDER`); no publish at 13/13 without **IMAGE_PASS**.
- **Verify before certify** — mandatory **§6 QUALITY GATE** before commit/publish (375px + 1440px viewport + all automated gates).

Enforcement: render agents A (live layout) + B (live images) + C (blob gold + visual lock) — `_render_audit_agent_*.js`, `_render_audit_gate.js`. Handoff: `_CROSSOVER.md` (2026-07-06 render fixes).

### No fixed pixel widths

**No fixed pixel widths** on any container or image. Use responsive `%`, `max-width`, `clamp()`, and `margin-inline:auto` — never `width:620px`, `width:760px`, or other hard px column locks on `.body`, `<article>`, `<figure>`, or `<img>` display sizing.

| Layer | Owner law | Code today (audit 2026-07-06) |
|-------|-----------|-------------------------------|
| **Containers** | `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;` on content column (`.body` / `<article>` prose region) | `pulse-machine-entry.js` inline CSS (~L1134): `article{max-width:880px; …}`; `@media(min-width:1200px){ article{max-width:1240px;} }` — **deploy-gated alignment to 760px owner column** |
| **Figures** | `<figure class="entry-section">`, `.entry-cover`, `.entry-graphic` — inherit column width; no px width on wrapper | Renderer emits `width:100%` inline on `<img>`; figure wrappers have margin/radius only |
| **Images (display)** | `max-width:100%; height:auto` — see **§ Images** · **Compliance § Visual lock** | `assets/pulse-tan.css` (~L115–147): sitewide `img{max-width:100%;height:auto}` + `.entry-cover img`, `.entry-section img`, `.body figure img` → `width:100%; height:auto; max-width:100%` |
| **Images (src hint)** | `entryImgAttrs()` `width`/`height` attrs = **aspect-ratio / CDN resize hint only** (default **760** × slot height, e.g. 760×428 section slot) — not CSS column width | `pulse-machine-entry.js` (~L77–92, L1048): `w=760` wsrv + HTML `width="760"` on `<img>` for layout stability; display still fluid via CSS |

### Container CSS (owner spec — copy verbatim for audits)

```css
/* Content column — .body / article prose region */
.body,
article {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
  padding-inline: 16px;
  overflow-wrap: break-word;
  word-break: break-word;
}
```

CRO gutter (`body{padding-right:352px}` @ ≥1200px) and mosaic rail (`max-width:1080px`) are **page chrome exceptions** — they must not force horizontal scroll on the prose column @375px.

### Images (cross-ref)

- **Display sizing:** `max-width:100%; height:auto; display:block` — enforced in `assets/pulse-tan.css` and renderer inline `style="width:100%;height:auto;…"` on entry figures.
- **Explicit `width`/`height` attributes:** required on every rendered `<img>` via `entryImgAttrs()` — prevents CLS; values are **760×slot** CDN hints, not fixed layout px.
- **Lazy-load (non-hero):** every image **except the hero** (lead above-fold figure) — `loading="lazy"` `decoding="async"` via `entryImgAttrs()` (~L90–94); hero/lead → `loading="eager"` + `fetchpriority="high"`, never lazy (cross-ref **§2**). Q&A: no top hero — first section `![alt](url)` after Direct Answer inherits lead rules.
- **Full image law:** **§ Images** · **Compliance § Image pipeline** · **Compliance § Visual lock** · `.cursor/rules/visual-lock-law.mdc`.

### Additional render law

- **Fluid type:** body `clamp(1rem, 0.95rem + 0.4vw, 1.125rem)` where editorial theme applies; entry pages use `pulse-tan.css` mobile bump @640px.
- **Images: img { max-width:100%; height:auto; display:block; } + explicit width/height attributes on every `<img>` (prevents CLS on both viewports).**
- **No tables for layout** — tables only for true tabular data if ever needed; never for page structure. Blobs and renderer must not use `<table>` for columns, spacing, or page chrome.
- **No horizontal scroll** on article — apply `overflow-wrap: break-word;` on `.body` / `<article>` prose container (see Container CSS above); use `word-break: break-word` (or `break-all` on `<a>` URLs) for long unbroken strings. Verify @375px — no page-level horizontal scroll on the prose column. **Code today:** `assets/pulse-tan.css` has no `overflow-wrap` on `.body`/`article`; renderer inline links use `word-break:break-all` (`pulse-machine-entry.js` ~L1481) — **deploy-gated alignment**.
- **Lazy-load every image except the hero: `loading="lazy"` `decoding="async"`.** — cross-ref **§2** hero (NO lazy loading on hero).
- **Mermaid SVG:** `.body .mermaid-wrap svg{max-width:100% !important; height:auto !important;}` (`pulse-machine-entry.js` inline CSS).

### Mobile-first CSS (mandatory)

| Rule | Detail |
|------|--------|
| **Mobile-first CSS** | **Mandatory.** Base styles target the narrow viewport first; never assume desktop width in unqualified rules. |
| **Single column by default** | Article body, content H2 sections, figures, and FAQ stack in **one column** at all breakpoints unless a `@media (min-width: 768px)` rule explicitly adds a wider layout. |
| **Layout enhancements only `@media (min-width: 768px)`** | Wider-viewport changes — **CRO fixed-right placement**, **article right gutter** (`body{padding-right:…}`), **expanded `article` max-width**, and **any multi-column layout** — belong **only** inside `@media (min-width: 768px)` blocks. No desktop-only layout in default CSS. |
| **Fluid base** | Default: `width: 100%`; images `max-width: 100%; height: auto; display: block` (`assets/pulse-tan.css`); article padding via `clamp()` — no fixed px column widths in base rules. |
| **CRO desktop vs mobile** | Cross-ref **§0.1** — desktop (≥768px target): fixed right-side swinging card + gutter; mobile (<768px target): inline full-width card at **DA → text → image → text** slot. Code today gates at **1200px / 1199px** — see §0.1 code-vs-owner tables; align renderer in a separate task. |
| **Enforcement surfaces** | `assets/pulse-tan.css` (sitewide entry theme) + renderer inline `<style>` in `netlify/functions/pulse-machine-entry.js` (~L1120–1201). Blobs never carry layout CSS. |

### Fluid typography (mandatory)

Sitewide on golden-template entry pages via `assets/pulse-tan.css` and renderer inline `<style>` — **not** in blobs. **Today:** `pulse-tan.css` uses fixed `rem` body sizes (`1.16rem` / `1.22rem` @640px) with no `clamp()` on `body` or `h1`; renderer `h1.q` uses a separate clamp — align both surfaces to this law in a separate CSS task.

```css
body {
  font-size: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);
}

h1 {
  font-size: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);
}
```

| Rule | Detail |
|------|--------|
| **Fluid typography** | **Mandatory.** `body` and `h1` scale smoothly between mobile and desktop — no breakpoint-only font-size jumps for base copy or page title. |
| **`body`** | `font-size: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);` |
| **`h1`** | `font-size: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);` |
| **Enforcement surfaces** | `assets/pulse-tan.css` + renderer inline `<style>` in `netlify/functions/pulse-machine-entry.js`. Blobs never carry typography CSS. |

### Images (mandatory)

Sitewide responsive image law — `assets/pulse-tan.css` + renderer `entryImgAttrs()` in `netlify/functions/pulse-machine-entry.js`.

```css
img { max-width:100%; height:auto; display:block; }
```

| Rule | Detail |
|------|--------|
| **Global img CSS** | `max-width:100%; height:auto; display:block` on every `<img>` — mobile and desktop (`assets/pulse-tan.css` ~L115–120) |
| **Explicit dimensions** | Every rendered `<img>` **must** have `width` and `height` HTML attributes via `entryImgAttrs()` — prevents CLS on mobile and desktop (aspect-ratio / CDN resize hint; display remains fluid via CSS) |
| **Lazy-load (non-hero)** | Every `<img>` except the lead above-fold figure: `loading="lazy"` `decoding="async"` via `entryImgAttrs()` (~L90–94) — default when `opts.eager` is unset |
| **Lead image (hero)** | Lead above-fold figure after Direct Answer: `loading="eager"` + `fetchpriority="high"` — **never** `loading="lazy"` (cross-ref **§2**). Q&A: no top hero — first section `![alt](url)` after Direct Answer is lead; mosaic face-card cover uses same eager path on first batch. |
| **`onerror` fallback swap** | **Required on every rendered `<img>`** — `entryImgAttrs()` always appends `onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}"` (~L81, L96); `data-fallback="…"` when wsrv-proxied `src` has a direct HTTPS alternate or `opts.fallback` is set (~L89, L95); **Pollinations ↔ DDG provider rotation** cross-ref [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§6** |
| **Broken image gate** | **Hard FAIL** — Agent B `heuristicImageAudit()` flags `broken/missing image`; lane fail → `speedupBlocked` (`_render_audit_gate.js`). Rubric **#12** + `SCRUBBER_SPEC.md` image law: **13/13 + IMAGE_PASS** only; no broken imgs in production |
| **Enforcement surfaces** | `assets/pulse-tan.css` · `entryImgAttrs()` (~L84–97) · renderer inline `style="width:100%;height:auto;…"` on entry figures |

### onerror fallback swap (mandatory — every `<img>`)

**Render-time only.** Every entry-body `<img>` — section figures, entry-cover (non–Q&A pillars) — is built by `entryImgAttrs()` in `netlify/functions/pulse-machine-entry.js` (~**L81–97**). Writers and blobs never emit these attributes — the renderer owns them. **Provider rotation on fallback:** Pollinations ↔ DDG alternation per [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md) **§6** (`_image_provider_alternate.js`).

| Piece | Source / behavior |
|-------|-------------------|
| **`IMG_ONERROR` constant** (~L81) | `this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}` |
| **Primary `src`** | `resolveEntryAssetUrl()` (~L128–135) — `/assets/…` → `SITE + path`; external HTTPS → `imgProxy()` via `wsrv.nl` (`w=760`, WebP) |
| **`data-fallback`** | Set when primary is wsrv-proxied and a direct HTTPS URL exists (`direct && src !== direct`), or when `opts.fallback` is passed (e.g. `entryCoverFigureHtmlWithFallback()`); alternate provider URL per **TOP10 §6** slot rotation when self-hosted primary fails |
| **Swap behavior** | On load error: null `onerror` (one retry), read `data-fallback`, if present and ≠ current `src`, set `src` to fallback — typically **wsrv → direct origin URL**, explicit self-hosted alternate, or **DDG ↔ Pollinations** rotated provider per **TOP10 §6** |

**Skeleton example — wsrv primary + direct fallback** (external URL proxied at render):

```html
<img src="https://wsrv.nl/?url=example.com%2Fphoto.jpg&amp;w=760&amp;output=webp&amp;q=80&amp;we&amp;n=-1"
     alt="Topical section illustration"
     width="760" height="428"
     loading="lazy" decoding="async"
     data-fallback="https://example.com/photo.jpg"
     onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
```

**Skeleton example — self-hosted primary** (`onerror` always present; `data-fallback` only when alternate supplied):

```html
<img src="https://pulserevops.com/assets/qa/q11133-2.jpg"
     alt="Topical section illustration"
     width="760" height="428"
     loading="lazy" decoding="async"
     onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
```

**Broken image = hard FAIL.** If any live `<img>` 404s, returns non-image content, or stays broken after the fallback swap, the entry **does not certify or publish**. Render Agent B (`_render_audit_agent_b.js` → `heuristicImageAudit()` in `_render_audit_lib.js`) HEAD-checks sample image URLs on live HTML; issues matching `broken/missing image` fail the lane and contribute to `speedupBlocked`. Rubric criterion **#12 Images law** and `SCRUBBER_SPEC.md` image scrub (`IMAGE_DEAD` / `IMAGE_PLACEHOLDER`) require **13/13 + IMAGE_PASS** — no broken images in production.

### Mosaic tiles — `<img class="mm-img">`, not background-image

| Rule | Detail |
|------|--------|
| **Primary load path** | `PulseFaceImg.mosaicImgTag()` in `js/pulse-face-img.js` — native `<img class="mm-img img-cover" width="400" height="300">` with `loading="eager|lazy"` + optional `fetchpriority="high"`. |
| **No bg-only tiles** | Do not use CSS `background-image` as the primary mosaic face-card load path — causes broken/invisible tiles on mobile Safari. Legacy `bindTile()` bg fallback is deprecated for new markup. |
| **`content-visibility`** | `css/pulse-mosaic.css`: **`content-visibility: visible`** on `.mm` tiles (2026-07-06 fix) — prevents off-screen paint skip. Do not revert to `auto` without passcode **4444**. |
| **Broken-image retry** | `mm-img` `onerror` → `PulseFaceImg.bindTile()` → `.mm-noimg` after retries exhausted. Agent B flags broken live imgs. |

### Mobile/desktop parity — same content, adaptive CRO

| Requirement | Rule |
|-------------|------|
| **Same body content** | All blob-rendered sections (Direct Answer, content H2s, FAQ, Sources) appear on **both** viewports — no `display:none` on prose, headings, or figures. |
| **Direct Answer gold box** | **`wrapDirectAnswerGold()`** renders `<div class="direct-answer-box">` + `<div class="direct-answer-label">` on **both** mobile and desktop — border `#C8821E`, fill `#FBF3E4`. Mobile type bump @640px in renderer CSS + `pulse-tan.css`. Agent A fails `missing direct-answer-box on live page`. |
| **CRO — two surfaces, one slot** | Cross-ref **§0.1**. Desktop: fixed `#croFixed` / `.cro-ad-root`. Mobile: inline `#croMobCard` / `.cro-mob-card` at same splice index (`afterQaEssayCroPos()` — DA → text → first `<figure>` → following `</p>`). CSS hides one per breakpoint — **not** two cards at once. |
| **CRO never in DA box** | `directAnswerBoxEndPos()` depth-counts gold box — CRO splices **after** box close only. |

### `prefers-reduced-motion` — CRO swing

CRO cord/peg swing uses `.cro-swing { animation: cro-sway 5.5s ease-in-out infinite; }` on **both** desktop fixed and mobile inline cards (`pulse-machine-entry.js` inline CSS ~L1180–1182):

```css
@media (prefers-reduced-motion: reduce) {
  .cro-swing { animation: none; transform: rotate(-1deg); }
}
```

When reduced motion is set, swing **stops** but the card remains visible and dismissable on both surfaces.

### Article gutter — fixed CRO must not overlap text

**Owner requirement:** At viewports **≥1100px**, article width plus a right gutter must ensure the fixed CRO card **never overlaps body text**.

**Code today** (`pulse-machine-entry.js` ~L1183–1187):

```css
@media (min-width: 1200px) {
  body            { padding-right: 352px; }
  body.cro-dismissed { padding-right: 0; }
  article         { max-width: 1240px; }
  body.cro-dismissed article { max-width: 880px; }
}
```

| Spec | Owner | Code today |
|------|-------|------------|
| Gutter threshold | **≥1100px** | **≥1200px** |
| Right padding | Reserve column for 322px widget | `padding-right: 352px` |

> **Owner note:** **1100px** is the target gutter; renderer gates at **1200px**. Align code in a separate task.

Below the threshold, `.cro-ad-root { display: none !important; }` and inline `.cro-mob-card` carries the widget — no text overlap on narrow viewports.

### HTML escape law — blob markdown only; widgets at render

| Layer | Rule |
|-------|------|
| **Blob** | Markdown + text only — no HTML, CRO, gold-box wrapper, inline styles, JSON-LD. |
| **`escHtml()` + `renderMd()`** | All prose escaped before HTML output — baked blob HTML renders as literal text, not live widgets. |
| **Render-time inject only** | Gold Direct Answer box, CRO (`insertCroAd()` → `afterQaEssayCroPos()`), badges, meta-row, JSON-LD. CRO splices into **already-rendered** HTML (L407–408). |
| **Writer lock** | `_visual_lock_law.js` → `enforceWriterVisualLock()` — prose only; image pipeline swaps at existing slots only. |

### Pulse brand palette (render)

| Token | Hex | Where |
|-------|-----|-------|
| **Pulse gold** | `#FFB81C` | Pulse News / dark-brand surfaces |
| **Pulse crimson** | `#B91C3F` | Site-wide brand crimson |
| **Direct Answer amber** | `#C8821E` | Gold box border + label |
| **Direct Answer cream** | `#FBF3E4` | Gold box background |
| **CRO oxblood ramp** | `#8b0202`–`#b81f1f` | CRO inline CSS — accent adjacent to `#B91C3F` |

Entry pages: light tan editorial theme (`pulse-tan.css` — cream `#ECE3D2`, Fraunces headings `#1d1711`, amber links `#C8821E`). Renderer owns chrome — **not** the blob.

### Render audit gates (live + blob)

| Agent | Checks relevant to §5 |
|-------|----------------------|
| **A** (live layout) | Direct Answer gold box; CRO not inside DA box (`heuristicLayoutAudit`) |
| **B** (live images) | Zero broken imgs on mobile Safari + desktop; **hard FAIL** on `broken/missing image` (`heuristicImageAudit` → `speedupBlocked`); no pollinations leaks |
| **C** (blob) | Gold template + visual lock; no baked CRO/HTML; no `stacked_images`; no live pollinations |

**Deploy gate:** Agent A + B block deploy via `_render_audit_gate.js`. Agent C blocks batch writes (`templateBlocked`).

### Pre-ship checklist (Q&A)

> **Consolidated into §6 QUALITY GATE** — run the full pre-commit + viewport checklist there before certify. Gold reference for spot-check: [q11133](https://pulserevops.com/knowledge/q11133).

---

## 6. QUALITY GATE (all must pass)

**Status:** MANDATORY · NON-NEGOTIABLE · HARD GATE  
**When:** Run **before every commit, certify, or publish** — local blob save, batch write, deploy mirror, IndexNow ping.  
**Law hierarchy:** **`GOLDEN_TEMPLATE_QA.md` is law.** [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) holds rubric detail — when they conflict on golden-template pages, **this file wins** (word count floor, hero law, shape).  
**Rule:** **All checklist items below must pass.** No publish below gate. No "12/13 close enough." No manual bypass except owner passcode **4444** for immutable shape law only — never for rubric, broken images, or gold audit failures.

> **Section numbering note:** Q&A uses **§6** for the quality gate. Top 10 uses **§6 IMAGE SOURCING** + **§7 QUALITY GATE** ([`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md)). **Image sourcing law** (Pollinations ↔ DDG alternation, 15s floor, `storeGradedImage()`, self-hosted paths) is **TOP10 §6** — cross-ref gate row **16** below; Q&A section-image rhythm and visual lock remain in **§2** · **§5** · Compliance.

### Pass condition

**Pass condition:** All numbered checks below must pass before commit, certify, or publish. Every gate item must be checked ✓ — no partial credit, no "close enough."

| # | Check | Pass condition |
|---|-------|----------------|
| 1 | Template classification | `pickGoldTemplate(id, body, title)` called **before** any draft, fix, audit, or publish; `template`, `goldId`, `goldUrl`, `reason` locked for the entire run — **never switch mid-run**. Router returns **`qa`** + **`q11133`** (or **`top10`** + `aq1158` on listicle bodies) — no hybrids. Body shape wins: essay Q&A locks **`qa`** even when title says "best/top 10". |
| 2 | Title | Question **verbatim** (or tightened), **≤60 chars** |
| 3 | Meta description | **120–160 chars**, contains the **short answer** |
| 4 | H1 | Exactly one — the question |
| 5 | Direct answer | 40–60 words, first element after byline; YESNO opens with verdict |
| 6 | Hero image | **Optional** (recommended if topic is visual); if present: same attrs as Top 10 §7 gate **6** — `fetchpriority="high"`, explicit `width`/`height`, descriptive alt containing topic, **`loading="eager"`** (NO lazy load), loads HTTP 200; **no hero before Direct Answer** — after DA + intro prose only (q11133 text→image rhythm) |
| 7 | Depth sections | 3–6 `<h2>` depth sections (evidence, when the answer changes, caveats, comparison, common mistakes); H2s phrased as searchable sub-questions where natural; no section under 40 words |
| 8 | Schema | Valid JSON-LD QAPage + TechArticle schema with author, datePublished, dateModified |
| 9 | Sources | YMYL: ≥2 authoritative citations + disclaimer present |
| 10 | Word count | ≥600 |
| 11 | Internal links | ≥2 in-context |
| 12 | Related questions | 3–5 H3s, each answered ≤50 words |
| 13 | Rendering | Passes §5 at 375px and 1440px |
| 14 | Author + dateModified | In body and schema |
| 15 | Viewport | Manual pass **375px** + **1440px** — zero CLS, zero broken images |
| 16 | Image fallbacks | Every `<img>` has `entryImgAttrs()` **onerror** provider swap; zero broken images @375px + @1440px |
| 17 | Image sourcing | **[`GOLDEN_TEMPLATE_TOP10.md` §6](GOLDEN_TEMPLATE_TOP10.md)** — DDG ↔ Pollinator (Pollinations) strict alternation; **15s floor**; **`storeGradedImage()`** only (`PULSE_GRADE=v_final`); self-hosted `/assets/qa/…` only — no live `pollinations.ai`; Q&A slots via `ensureAlternateSectionImage()` fill order **1, 2, 3…** |
| 18 | CRO card | Present once per **§C3** / **§0.1**: fixed-right desktop (both templates); mobile inline — Q&A: after last depth-section H2 before Related questions; Top 10: after item #5; renderer-injected, never in blob |

---

## Blob markdown — mandatory section order

Cross-ref **§2 REQUIRED PAGE STRUCTURE (in order)** — canonical numbered list above. Blob-only sequence:

```
GOLD REFERENCE: https://pulserevops.com/knowledge/q11133 (id q11133)

1. ## Direct Answer
   — Renders inside gold border box (`direct-answer-box` / `direct-answer-label`; #C8821E / #FBF3E4)
   — First H2 in blob; first content block after H1 chrome — featured-snippet target via `descExcerpt()`
   — Dense question-first AEO prose (NOT a #1 product pick); ≥140 chars, ≥2 sentences (gold audit: direct_answer_blank)
   — NO top hero (![…](…)) before this section

2. Depth-section H2s (**3–6** topical H2s — searchable sub-questions where natural; NOT ranked ## N. Product):
   — Write a block of text (paragraphs)
   — Weave 2–3 in-context internal links to related `/knowledge/{id}` pages (see Compliance § Internal links)
   — Then ONE topical image (![alt](url)) illustrating that block
   — Repeat: text → image → text → image …
   — NEVER stack two images back-to-back without text between them

   [RENDER ONLY — not in blob] CRO card per §0.1 / CURSOR §C3: desktop fixed-right; mobile inline after last depth-section H2, before Related questions

3. ## Related questions — 3–5 ### Question? headings, each answered in ≤50 words (People Also Ask target)

4. [Optional] ## Bottom Line — unnumbered recap before FAQ (rubric may require; gold audit treats as optional — no #1-pick closing verdict)

5. ## FAQ — **Question?** then answer paragraphs (4–6 items)

6. ## Sources — 5–10 real bulleted sources; YMYL (health, money, legal): ≥2 authoritative citations + disclaimer; non-YMYL: cite statistical claims

7. ## Related on PULSE — internal link line
   (Tail sibling nav — distinct from 2–3 editorial in-body links; see Compliance § Internal links)
```

Enforced in code as `QA_SECTION_ORDER` / `QA_TEMPLATE_OUTLINE` in `_qa_gold_template.js`.

---

> **Appendix — section image law (reference):** Image sourcing primary law is **[`GOLDEN_TEMPLATE_TOP10.md` §6](GOLDEN_TEMPLATE_TOP10.md)** (Pollinations ↔ DDG). Image rhythm, forbidden items, and gold audit failure codes below supplement **§6 QUALITY GATE** — do not treat as alternate rules.

## Forbidden (without passcode 4444)

- Top hero before Direct Answer
- Stacked images (image then image with no text between)
- TL;DR block
- `@@PRODUCT` / ranking pills / How We Ranked sections
- CRO card in blob markdown (see **§0.1** — render-time only)
- Live `pollinations.ai` URLs in published markdown
- Blank or stub Direct Answer
- Forcing Top 10 shape because title says "best"

---

## Gold audit — common failure codes

| Code | Meaning |
|------|---------|
| `image_before_direct_answer` | Hero or section image before `## Direct Answer` |
| `stacked_images` | Two images back-to-back without text between |
| `live_pollinations_url_in_body` | Live pollinations URL in blob |
| `direct_answer_blank` | Direct Answer too short or empty |
| `numbered_sections_0_min_5` | Fewer than 5 content H2 sections |
| `cro_in_blob` | CRO card markup in markdown body (see **§0.1**) |

Audit function: `auditQaGoldTemplate(body, title, id)` in `_qa_gold_template.js`.

#### Pass ✓

**Pass** = every numbered gate item **1–18** checked ✓ **and** all of the following true:

| Requirement | Gate / item |
|-------------|-------------|
| **Every numbered gate checked** | Numbered items **1–18** all ✓ |
| **Image fallbacks** | Every `<img>` has `entryImgAttrs()` onerror provider swap; zero broken images @375px + @1440px (item **16** · gate **G** · Agent B) |
| **Viewport verified** | Manual §6-G checklist passed at **375px** + **1440px** (item **15**) |
| **Gold audit clean** | `auditQaGoldTemplate()` → `compliant: true`, `issues: []` (gate **I**) |
| **Word count** | **≥600 words** substantive prose (item **10** · gate **H-1**) — **2,000 words NOT required** |
| **No live pollinations** | Blob self-hosted paths only — no `pollinations.ai` URLs (gate **F**) |
| **CRO render-only** | CRO injected at render (`insertCroAd()` → `afterQaEssayCroPos()`) — **not** in blob markdown (gate **K**) |
| **Schema present** | Live `<head>` has §3 JSON-LD: **`QAPage`** + **`TechArticle`** + **`BreadcrumbList`** — `mainEntity` Question + acceptedAnswer; **no `ItemList`** (item **8** · gate **C**) |
| **Byline + dateModified** | **Visible in body** (meta-row Published/Updated below H1) **AND** in Article schema — `TechArticle.author` + `dateModified` in JSON-LD (item **14** · gate **C** · §2) |
| **Rendering rules satisfied** | No fixed px widths, all imgs max-width:100%, no h-scroll at 375px — §5 detail (item **13** · gate **E**) |

#### Fail ✗

**Fail** = **any single hard-fail item** — fix surgically, re-run all gates, do not commit:

| Hard fail | Detection |
|-----------|-----------|
| Broken or missing live image | Agent B · gate **G** · item **16** · rubric #12 / `IMAGE_DEAD` |
| Missing onerror provider swap | Item **16** · gate **G** — any rendered `<img>` without `entryImgAttrs()` `onerror` + optional `data-fallback` |
| Missing CRO at render | Agent A · gate **G** — no `#croFixed` / `#croMobCard` at §0.1 slot |
| Gold template audit fail | Agent C · gate **I** — any `auditQaGoldTemplate()` code |
| Horizontal scroll @375px | Gate **G** · gate **E** |
| Missing Direct Answer gold box | Agent A · gate **G** — no `direct-answer-box` wrapper |
| Live pollinations in blob | Gate **F** · `live_pollinations_url_in_body` |
| CRO baked in blob | Gate **I** · `cro_in_blob` |
| Hero before Direct Answer | Gate **B** · gate **I** · `image_before_direct_answer` |
| Stacked images | Gate **B** · gate **I** · `stacked_images` |
| Word count below 800 | Item **13** · gate **H-1** |
| Missing or wrong schema | Item **8** · gate **C** — no JSON-LD, `ItemList` on Q&A, or missing `mainEntity` Question + acceptedAnswer |
| Missing byline or dateModified | Item **14** · gate **C** — no visible meta-row Published/Updated in body or missing `TechArticle.author` / `dateModified` |

#### Q&A pass deltas (vs Top 10)

| Gate | Q&A (this template) |
|------|---------------------|
| **Gold audit** | `auditQaGoldTemplate()` — ≥5 content H2 sections, no `@@PRODUCT`, no ranked `## N.` headings |
| **CRO slot** | After first content figure following Direct Answer prose (§0.1 `afterQaEssayCroPos()`) — **not** after rank #5 |
| **Schema** | **`QAPage`** + `TechArticle` — **no `ItemList`** |
| **Images** | Section `![alt](url)` only — min 3; text between each; optional hero after DA + intro prose (§2 item **6**); **no** top hero before `## Direct Answer` |
| **Shape** | Question-form title/H1; essay sections — not listicle ranks or Best Overall pills |

> **Not required for §6 Pass condition:** **2,000-word floor** · legacy `WORD_FLOOR=2000` · padding prose to satisfy stale scrubber defaults. **13/13** is enforced via gate **H** when that gate is in scope — §6 Pass is **all gates green** (600-word floor + full checklist), not a separate 2,000-word or off-checklist rubric restatement.

#### Validate before commit — all must pass

**Do not commit, certify, or mark the URL done until numbered items **1–18** and the Pass condition table above are all green.** Automated render agents supplement manual viewport QA — they do **not** replace gate **G**. Re-run the full checklist after every surgical fix.

### Gate tier reference (modules)

| Gate tier | Pass condition | Modules |
|-----------|----------------|---------|
| **Classification** | `pickGoldTemplate()` → `template: 'qa'`, `goldId: 'q11133'` locked **before** draft; never switch mid-run | `_pulse_gold_template_router.js` |
| **13/13 content rubric** | `rubricSignOff(id, body).pass === true` — all 13 criteria green (gate **H** only) | `grade-entry.js`, `_scrub_button_server.js`, `_format_fixer_lib.js` |
| **Gold blob audit** | `auditQaGoldTemplate()` → `compliant: true`, `issues: []` | `_qa_gold_template.js` · Agent C |
| **IMAGE_PASS** | Self-hosted paths only; `verifyGradeStamp()` on disk; no `IMAGE_DEAD` / `IMAGE_PLACEHOLDER` / `IMAGE_LOWRES` / `IMAGE_STANDARD` flags | `_ddg_facecard_lib.js` · `SCRUBBER_SPEC.md` Pass 2 |
| **CRO / visual lock** | `croCardLawOk()` + `croBlobClean()` — zero baked CRO in blob; writers touched prose only | `_cro_strip_lib.js`, `_visual_lock_law.js` |
| **Render audit (pre-commit blob)** | Agent C green — `templateBlocked === false` | `_render_audit_agent_c.js`, `_render_audit_gate.js` |
| **Render audit (post-deploy live)** | Agent A + B green — `deployBlocked === false`; zero broken live imgs | `_render_audit_agent_a.js`, `_render_audit_agent_b.js` |
| **Viewport (human)** | Live or staged URL passes **375px** + **1440px** checklist **G** below | Manual — supplements agents |

### Numbered checklist — Q&A essay (q11133)

Run **before commit, certify, or publish.** **All 19 items must pass.**

1. **Template classification locked** — Call `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` **before** any draft, fix, audit, or publish. Lock `template`, `goldId`, `goldUrl`, and `reason` for the entire run — **never switch template mid-run**. Router returns **`qa`** + `q11133` (Q&A essay) or **`top10`** + `aq1158` (Top 10) — no hybrids. Body shape wins: essay Q&A must lock **`qa`** even when title says "best/top 10". **N extraction:** N/A for Q&A; for Top 10 only — `rankCountFromTitle` / `expectedRankCount`; **default N = 10** for "best of" with no explicit number.
2. **`<title>`** — ≤60 chars; exact query phrase (`entry.question`); renderer clip + ` | Pulse News` ≤65 chars live.
3. **`<meta name="description">`** — **120–160 chars** (renderer ≤158); question promise + one differentiator via `descExcerpt()`.
4. **Exactly one `<h1>`** — renderer `<h1 class="q">` from `entry.h1 || entry.question`; no competing `# …` H1 in blob.
5. **Direct Answer gold box** — `## Direct Answer` first H2; ≥140 chars, ≥2 sentences; dense **question-first AEO prose** — **no #1 product pick**; `direct-answer-box` at render only.
6. **Hero image (optional)** — **No top hero before Direct Answer**; if present, same attrs as Top 10 §7 gate **6** (`fetchpriority="high"`, explicit `width`/`height`, descriptive alt containing topic, `loading="eager"`, loads HTTP 200); placement after DA + intro prose per q11133 text→image rhythm; renderer `noTopHero`; gold audit: `image_before_direct_answer`.
7. **Page structure (blob order)** — content H2 sections (min 5, text → one `![alt](url)` → text) → optional `## Bottom Line` (essay recap — **not** Top 10 #1 verdict) → `## FAQ` → `## Sources` → `## Related on PULSE`. **No** `@@PRODUCT` or ranked `## N.` blocks.
8. **Internal links** — **2–3** editorial in-context links to `/knowledge/{id}` in body prose — not a link-farm widget.
9. **Word count floor** — **≥800 words** substantive prose; never pad; 2,000 **not** required on golden-template pages.
10. **Meta-row byline + dates** — word count + Published / Updated render-time only — not in blob.
11. **CRO swinging card** — render-time only (`afterQaEssayCroPos()`); **never in blob**; **exactly one** per page; **Q&A slot:** DA → text → first content `<figure>` → following paragraph; dismiss **`sessionStorage`** `croX` / `croMobX`.
12. **Schema JSON-LD** — exactly **one** JSON-LD block in `<head>`; **`QAPage`** + **`TechArticle`** (Article node) + **`BreadcrumbList`** — **no `ItemList`**; no JSON-LD in blob.
13. **HTML skeleton (§4)** — no top hero; gold DA first in `<div class="body">`; CRO/post-body chrome renderer-owned.
14. **Mobile-first rendering (§5)** — single column @375px; `max-width:760px` content column; fluid type; no horizontal scroll @375px.
15. **Images — lazy-load, onerror, sizing** — real `<img>` tags; explicit `width`/`height`; non-hero lazy; min 3 section images; no stacked images; every img has **`onerror`** fallback.
16. **Broken image = hard fail** — **zero** broken imgs @375px **and** @1440px; Agent B + rubric **#12** / `IMAGE_DEAD`.
17. **Viewport parity @375px + @1440px** — same DA box, H2s, figures both viewports; CRO fixed-right desktop OR inline mobile at Q&A slot; no obvious CLS.
18. **Image sourcing (TOP10 §6)** — DDG ↔ Pollinator alternation; **15s floor**; **`storeGradedImage()`** only; self-hosted `/assets/qa/…` — no live `pollinations.ai`. Full law: [`GOLDEN_TEMPLATE_TOP10.md` §6](GOLDEN_TEMPLATE_TOP10.md).
19. **Blob purity + gates** — no baked CRO/visual-lock violations; `rubricSignOff()` + `auditQaGoldTemplate()` + Agents A/B/C green (or passcode **4444** override documented).

**Do not commit or certify below 19/19.**

### Master checklist — detailed breakdown (reference)

#### A. Classification & detection (§1)

- [ ] `pickGoldTemplate(id, body, title)` → `template: 'qa'` before any draft write
- [ ] **NOT** Top 10 — no ranked `## N.` product sections, no `@@PRODUCT`, no Best Overall/Value pills
- [ ] Title may say "best/top 10" but if body is essay Q&A, **Q&A wins** — never force Top 10 on title alone
- [ ] Dual-mode pillars route by **body shape**, not ID prefix — router locked for run

#### B. Page structure (§2)

- [ ] **`## Direct Answer`** first H2 — dense question-first prose; **no top hero** before it (`image_before_direct_answer`); optional hero after DA + intro prose — same rules as Template A §2 item **6** + §C2 (§2 item **5**)
- [ ] Content H2 sections (min **5**): text → one `![alt](url)` → text → image … — never stacked images
- [ ] Tail order: optional `## Bottom Line` → `## FAQ` → `## Sources` → `## Related on PULSE`
- [ ] FAQ: single header; 4–6 `**Question?**` bold pairs
- [ ] **No** `@@PRODUCT`, How We Ranked, ranked `#1 pick` closing verdict (Top 10 only)
- [ ] Meta-row (word count + Published / Updated) render-time only — not in blob

#### C. Schema (§3)

- [ ] Exactly **one** `<script type="application/ld+json">` in `<head>` — render-time only
- [ ] `@graph` includes **`QAPage`** + **`TechArticle`** + **`BreadcrumbList`** — **no `ItemList`**
- [ ] No JSON-LD, `@context`, or `@graph` in answer blob

#### D. HTML skeleton compliance (§4)

- [ ] **`noTopHero`** — no `<figure class="entry-cover">` before Direct Answer; optional hero **after** DA + intro prose only (§2 item **5**)
- [ ] Gold `direct-answer-box` first content in `<div class="body">` — question-first AEO lead, not product pick
- [ ] **No `@@PRODUCT`** — no `product-card`, no ranked `## N.` headings
- [ ] Depth sections: 3–6 topical `<h2>`s; text → image rhythm (no stacked images)
- [ ] **`Related questions`** — `<h2>` + 3–5 `<h3>` PAA sub-questions (≤50 words each)
- [ ] **`Sources`** — `<h2>Sources</h2>` with 5–10 bulleted real named sources
- [ ] CRO render-time only — owner slot: after last depth H2, before Related questions (§0.1); code today: `afterQaEssayCroPos()`
- [ ] Single `<h1 class="q">` from index — no `# …` H1 in blob
- [ ] Mermaid (max 2) in content H2s — optional cluster before Related on PULSE at render

#### E. Rendering rules (§5)

- [ ] **Mobile-first CSS** — single column default; wider layout / CRO gutter only inside `@media (min-width: 768px)`
- [ ] **Containers** — `.body` / `<article>`: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px; overflow-wrap:break-word`
- [ ] **Fluid typography** — `body` + `h1` use `clamp()` per §5 (no breakpoint-only font jumps on base copy)
- [ ] Real `<img>` tags — section `<figure class="entry-section">` + mosaic `<img class="mm-img">`; **no** `background-image`-only tiles
- [ ] Global img CSS: `max-width:100%; height:auto`; explicit `width`/`height` via `entryImgAttrs()`
- [ ] Non-hero: `loading="lazy"` `decoding="async"`; lead section figure after DA may be eager — lazy-load all except hero
- [ ] **No layout tables** — tables for tabular data only; never for page structure
- [ ] Gold DA box + CRO injected at render only — `escHtml()` / `renderMd()` on blob prose
- [ ] No `content-visibility:auto` on entry body figures; mosaic tiles `content-visibility:visible`
- [ ] Desktop + mobile parity — same blob → same HTML structure; CRO is CSS swap only
- [ ] No horizontal scroll on prose column @375px

#### F. Image sourcing (TOP10 §6)

- [ ] DDG ↔ Pollinator strict alternation — `_image_provider_alternate.js`; **15s floor** between generates
- [ ] Every file through `storeGradedImage()` — grade from RAW, EXIF `PULSE_GRADE=v_final`
- [ ] Self-hosted paths only in blob — `/assets/qa/…`; no live pollinations or DDG hotlinks
- [ ] Min **3** section images; text between each; pipeline swaps at **existing** slots only
- [ ] pHash dedup — zero within-page URL or near-duplicate collisions (`countBodyImageDupes()`)
- [ ] Visual lock — writers did not add/remove/move `![alt](url)` markdown

#### G. Viewport test — 375px + 1440px (mandatory human pass)

Before marking URL **done** or **certified**, verify **live or staged** render at both breakpoints:

| Viewport | Width | How |
|----------|-------|-----|
| **Mobile** | **375px** | DevTools device mode or narrow browser window |
| **Desktop** | **1440px** | DevTools responsive mode or desktop browser |

**Do not mark the URL done until both viewports pass.**

- [ ] **Images visible** — all section figures load from self-hosted paths; **zero broken images** (hard FAIL — Agent B + rubric #12 / `IMAGE_DEAD`; every `<img>` must carry `entryImgAttrs()` `onerror` fallback swap on live render)
- [ ] **No horizontal scroll** — prose column fits viewport; no overflow from imgs, mermaid, or CRO gutter
- [ ] **CRO placement** — desktop: fixed right swinging card; mobile: inline full-width at Q&A slot (DA → text → first content figure → following paragraph) — §0.1
- [ ] **Direct Answer gold box** — amber/cream box wraps DA prose only; CRO **not** inside box
- [ ] **No obvious CLS** — explicit `width`/`height` on imgs; stable layout on load
- [ ] **Same content both viewports** — DA box, section H2s, figures visible on mobile and desktop

Gold reference spot-check: [q11133](https://pulserevops.com/knowledge/q11133).

#### H. 13/13 content rubric (all criteria green)

Detail: [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) Pass 1. **Owner word-count floor: ≥800 words** (not 2,000 — see Compliance § Word count).

- [ ] **1** Word count — ≥800 words substantive prose
- [ ] **2** Direct Answer at top — `## Direct Answer` first H2; gold box at render
- [ ] **3** Direct Answer complete — ≥140 chars, ≥2 sentences; question-first AEO lead; not stub (`direct_answer_blank`)
- [ ] **4** FAQ — ≥5 `**Question?**` pairs under `## FAQ`
- [ ] **5** Mermaid — exactly 2 diagrams in content H2s
- [ ] **6** Mermaid clean — valid syntax; both render
- [ ] **7** Sources — ≥5 real named sources; live URLs; YMYL (health, money, legal): ≥2 authoritative citations + one-line disclaimer; non-YMYL: cite statistical claims (§6 gate **9**)
- [ ] **8** Related on PULSE — `## Related on PULSE` tail section
- [ ] **9** Clean links — no `#`, TODO, dead links; entry links use `/knowledge/{id}`
- [ ] **10** Hero image — optional on Q&A (recommended if visual); if present, same attrs as Top 10 §7 gate **6**; **no top hero before DA** — after DA + intro prose (`noTopHero`)
- [ ] **11** Media count — 3–10 images total (min 3 section images, text between each)
- [ ] **12** Images law — vintage grade, self-hosted, EXIF stamp (TOP10 §6 · §6 gate **17**)
- [ ] **13** No fabrication — real claims only; no invented vendors, stats, or quotes

**Enforcement:** `entryScrubPipeline` → `gradeEntry()` + `rubricSignOff()` + `qa_gold_outline` — surgical fix on failing checkpoints only; re-verify gold structure after every edit.

#### I. Gold blob audit — Agent C (pre-commit)

- [ ] `auditQaGoldTemplate(body, title, id)` → `compliant: true`, zero issues
- [ ] No `cro_in_blob`, `live_pollinations_url_in_body`, `direct_answer_blank`, `image_before_direct_answer`, `stacked_images`
- [ ] No `ranking_markers_in_qa`, `tldr_present`, `first_h2_not_direct_answer`
- [ ] Min 5 content H2 sections; tail order FAQ → Sources → Related (`QA_SECTION_ORDER`)
- [ ] `enforceWriterVisualLock()` passed on last writer pass

See **Gold audit — common failure codes** above for full code list.

#### J. Render audit when deployed (Agents A + B)

| Agent | Checks | Gate |
|-------|--------|------|
| **A** (live layout) | Direct Answer gold box; CRO not inside DA box; layout heuristics | `deployBlocked` |
| **B** (live images) | Zero broken/missing imgs; **`broken/missing image` = hard FAIL**; no pollinations in live HTML | `deployBlocked` + `speedupBlocked` |
| **C** (blob) | Gold template + visual lock; no baked CRO | `templateBlocked` |

Supervisor: `_render_audit_supervisor.js` · Gate: `_render_audit_gate.js` · Status: `_render_audit_status.json`

**Human §6-G viewport pass is still required** even when automated agents are green — catches visual regressions agents miss.

Post-deploy crawl (informational): `_sf_crawl_audit.js`, `_pulse_spider.js` — confirm `QAPage` + `TechArticle` on live URL; H1 count, meta length.

#### K. Editorial & CRO gates (cross-cutting)

- [ ] **2–3 editorial internal links** in body prose — in-context `/knowledge/{id}` (Compliance § Internal links)
- [ ] **CRO law** — render-time only; exactly one widget per page; `croCardLawOk()` pass
- [ ] **No TL;DR**, no `@@PRODUCT`, no ranked-product framing, no live pollinations in published markdown

### Enforcement path (single pipeline)

```
pickGoldTemplate → generateOne / fixEntry
  → entryScrubPipeline (gradeEntry + rubricSignOff + auditQaGoldTemplate)
  → IMAGE_PASS (storeGradedImage + validate)
  → Agent C blob audit (templateBlocked)
  → commit / certify ONLY when ALL §6 checks green
  → deploy → Agent A + B (deployBlocked)
  → human viewport @375px + @1440px (§6-G)
```

**No publish below gate. Not 12/13. Ever.**

---

## Pipeline law (summary)

1. **CLASSIFY** → `pickGoldTemplate` → lock `qa` + `q11133`
2. **SEED** → load `QA_TEMPLATE_OUTLINE`
3. **GENERATE** → new content into locked shape only (`generateOne` / `fixEntry`)
4. **SCORE + SURGICAL FIX** → `entryScrubPipeline` + gold audit
5. **CERTIFY** → **13/13 only** — no publish below 13/13
6. **QUALITY GATE** → **§6** — all gates green (13/13 + gold audit + IMAGE_PASS + Agent C + viewport @375px + @1440px) before commit/publish

Process details: `.cursor/rules/pipeline-template-law.mdc` · rubric detail: `SCRUBBER_SPEC.md` · **gate checklist: §6 (this file is law)**

---

## Compliance (cross-cutting law)

> **Full spec:** [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) — do not duplicate here. **Pre-commit gate checklist: §6 QUALITY GATE.** This section lists golden-template-relevant editorial/SEO requirements only. Top 10 listicle law: [`GOLDEN_TEMPLATE_TOP10.md`](GOLDEN_TEMPLATE_TOP10.md).

### Word count

**Owner law (this spec wins over legacy scrubber defaults).**

#### Legacy code conflict

| Source | Legacy floor | Status |
|--------|--------------|--------|
| [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) criterion 1 | ≥2,000 words | **Superseded** for golden-template pages |
| `netlify/functions/lib/grade-entry.js` | 2,000 (1,100+ general Q&A) | **Superseded** for golden-template pages |
| `_v2_components.js` | `WORD_FLOOR=2000` | **Superseded** for golden-template pages |

For **Q&A** (q11133) and **Top 10** (aq1158) golden-template entries, **`GOLDEN_TEMPLATE_*.md` owner spec wins** until pipeline code is updated.

#### Word count law

> **Gate checkpoint:** §6 **H.1** — ≥600 words required at certify (owner floor); 13/13 rubric may still enforce higher until code aligned.

| Rule | Detail |
|------|--------|
| **Floor** | **800 words** minimum substantive prose |
| **Ceiling** | **None** — no upper limit |
| **Never pad** | No filler, repetition, or throat-clearing to hit arbitrary counts |
| **2,000 words is NOT required** | Golden-template pages do **not** require 2,000 words. Explicit override of legacy scrubber default. |

> **Code not yet aligned:** Pipeline scripts may still enforce higher floors until updated. Agents and writers follow **GOLDEN_TEMPLATE law first** — do not pad prose to satisfy stale 2,000-word gates on golden-template entries.

### 13/13 content gate

> **Full pre-commit checklist: §6 QUALITY GATE** (sections H–K). This table is the criterion summary; **all §6 items must pass** before publish.

Every Q&A entry must pass **both** the shared 13-point rubric **and** `auditQaGoldTemplate()` before publish.

| # | Criterion (summary) | Q&A note |
|---|---------------------|----------|
| 1 | Substantive word count | **Owner: ≥800 words** (see **Word count** above) — not 2,000; legacy `WORD_FLOOR=2000` / `grade-entry.js` superseded for golden-template pages |
| 2–3 | Direct Answer at top, complete | Gold box at render; blob ≥140 chars, ≥2 sentences; **no top hero before DA** |
| 4 | FAQ ≥5 pairs | `## FAQ` — `**Question?**` bold pairs |
| 5–6 | Exactly 2 mermaid, valid syntax | Embedded in content H2 sections |
| 7 | Sources ≥5, live URLs; YMYL authoritative + disclaimer | `## Sources`; YMYL: ≥2 authoritative citations + disclaimer; non-YMYL: cite statistics (§6 gate **9**) |
| 8 | Related on PULSE | `## Related on PULSE` |
| 9 | Clean links | No `#`, TODO, dead links |
| 10 | Hero image | Optional on Q&A (recommended if visual); if present, same attrs as Top 10 §7 gate **6**; **no top hero before DA** — after DA + intro prose (`noTopHero`) |
| 11 | 3–10 images total | Min 3 section images, text between each |
| 12 | Images law | Vintage grade, self-hosted, EXIF stamp; **no broken live images** — Agent B hard FAIL + `IMAGE_DEAD` / `IMAGE_PLACEHOLDER`; every rendered `<img>` carries `entryImgAttrs()` `onerror` fallback swap |
| 13 | No fabrication | Real claims only |

**Enforcement path:** `entryScrubPipeline` → `gradeEntry()` (`netlify/functions/lib/grade-entry.js`) + `rubricSignOff()` (`_scrub_button_server.js`) + `auditQaGoldTemplate()`. Checks include `qa_gold_outline` and `qaGoldOutline` in rubric sign-off. Surgical fixes touch **failing checkpoints only**. **No publish below 13/13**.

### Internal links (editorial)

**Requirement:** Weave **2–3 internal links** to related pillar or knowledge pages **in-context** inside body prose — not as a separate "related posts" widget or link farm.

| Rule | Detail |
|------|--------|
| **Count** | **2–3** editorial internal links minimum, spread across body sections (`## Direct Answer`, content H2s, FAQ answers — not all in one block). |
| **Format** | Inline markdown: `[anchor text](/knowledge/{id})` for library entries. Pillar hub/index routes (e.g. `/aquariums/`, `/knowledge/`) are OK when linking to a pillar landing page — not an entry ID. |
| **Clean-links gate** | Entry-to-entry links **must** use `/knowledge/{id}` — `linksClean` in `_v2_components.js` rejects pillar-path entry URLs (e.g. `/aquariums/aq1158`) and `/reviews/` suffixes. Targets must exist in the library index when validated (rubric criterion 9; `SCRUBBER_SPEC.md`). |
| **In-context** | Anchor text must read naturally in the sentence (e.g. "…see our guide to [cycle stability](/knowledge/q12345)…"). No mid-body bullet list of "Related:" or "See also" links. |
| **Not this** | A separate "Related posts", "More reading", or "See also" widget/block in the body. **Do not** duplicate the tail `## Related on PULSE` section inside prose sections. |

#### Distinction: editorial links vs `## Related on PULSE`

| | **Editorial internal links (this rule)** | **`## Related on PULSE` (rubric #8)** |
|---|------------------------------------------|----------------------------------------|
| **Where** | Woven into body prose (Direct Answer + content H2s + FAQ) | Tail section after `## Sources` |
| **Purpose** | SEO + reader context while reading | Sibling mesh / library discovery nav |
| **Format** | Inline `[text](url)` in sentences | `## Related on PULSE` heading + bullet list of verified siblings |
| **Who writes** | Author / generator at draft time | May be fixer-injected (`_format_fixer_lib.js`, `_v2_components.js`) from sibling index |
| **Rubric** | Golden-template editorial law (this spec) | Explicit 13/13 criterion 8 (`C.related` in `_v2_components.js`) |

### Page head / SEO meta

| Field | Rule |
|-------|------|
| **`<meta name="description">`** | **120–160 characters.** Must restate the page promise (question / title intent) **plus one differentiator** (e.g. key number, timeframe, operator-grade lens, contrarian hook). |
| **`<title>`** | **≤60 characters** (authoring target). Must contain the **exact query phrase** (the question the page answers). See **Document title** below. |
| **`<h1>` (on-page)** | **Exactly one `<h1>` per page.** Matches title/question intent (same query/promise as `<title>`, but may be longer than ≤60 char title or ≤65 char render clip). See **On-page H1** below. |

#### Document title (`<title>`)

| Rule | Detail |
|------|--------|
| **Length** | **≤60 characters** at authoring time. Front-load the query so a render-time clip + ` \| Pulse News` suffix still shows the question in SERPs. |
| **Query phrase** | Title / `question` must **contain the exact query phrase** — the same question string used as on-page H1 (e.g. `What Is RevOps?`, `How Do You Fix a Cloudy Aquarium?`). If the question includes a number or timeframe, that number must appear in the title (e.g. `… in 2027`, `… 30 Days`). |
| **Examples** | ✓ `What Is RevOps and Why Does It Matter?` · ✓ `How Long Can Betta Fish Go Without Food?` · ✗ `RevOps Explained` (drops the exact query) · ✗ `Everything About Cloudy Water` (not the question) |

**H1 vs `<title>` — two fields, one source string:**

| Surface | Source | Clip? |
|---------|--------|-------|
| **On-page H1** (`<h1 class="q">`) | `entry.h1 \|\| entry.question` | **No** — full question always shown |
| **`<title>`** (browser tab / SERP) | `entry.question` only | **Yes** — renderer builds `shortTitle` at serve time |
| **OG / Twitter title** | `entry.question` (first 70 chars) | Partial — full question, not `shortTitle` |
| **JSON-LD `headline`** | `entry.question` | No |

#### On-page H1 (`<h1 class="q">`)

| Rule | Detail |
|------|--------|
| **Count** | **Exactly one `<h1>`** per rendered page. |
| **Intent** | Matches `<title>` intent — same query/promise (the question the page answers). H1 **may be longer** than the ≤60 char authoring target or ≤65 char render-time `<title>` clip. |
| **Source** | Index `entry.question` + optional `entry.h1` — renderer uses `entry.h1 \|\| entry.question`. Optional `h1` overrides on-page heading only; it does **not** feed `<title>`. |
| **Renderer** | `pulse-machine-entry.js` emits a single `<h1 class="q">` from index fields — **must not** duplicate H1 from body markdown. |
| **Body markdown** | **No `# …` H1** in gold blob shape (start at `## Direct Answer`). `renderMd()` strips lone `# …` lines so they never become a second H1. |
| **Forbidden** | Multiple H1s in the DOM; body `# H1` that repeats or **conflicts** with the page H1; writer/fix passes that inject a competing heading. |

**Post-render audit (outside 13/13):** `_pulse_spider.js` → `missing_h1`, `MULTIPLE_H1`; `_sf_crawl_audit.js` → H1 count + text.

- **Author at publish:** set the **title arg** / index **`question`** field to the final question string (≤60 chars). Optional **`h1`** override on the index entry changes on-page H1 only — it does **not** feed `<title>`.
- **Blob `# H1`:** Q&A gold shape has **no** leading `# title` line — Direct Answer is first. If a legacy `# …` line exists, renderer drops it when it duplicates the page H1.
- **`prepareEntryForPublish()`** (`_write_lib.js`) stamps pillar SEO + keyword cluster on the index entry; it does **not** write `<title>` text.

**Render-time vs blob:** `<title>` is **not** stored in the blob or index as its own field. At serve time, `netlify/functions/pulse-machine-entry.js` builds `shortTitle` from `entry.question`: word-boundary clip so total length ≤65 chars including ` \| Pulse News` suffix; ellipsis when truncated. The **full** `question` stays as on-page H1.

**13/13 rubric tie-in:** `<title>` length is **not** a separate rubric checkpoint (`SCRUBBER_SPEC.md` criteria 1–13; `grade-entry.js` has no title-length criterion). It **derives** from fields that **are** gated:

| Rubric / audit | How it feeds `<title>` |
|----------------|------------------------|
| **Criteria 1 — Title (H1)** | Same string as `question`; gold outline expects question-form H1 from the seed query. |
| **Router classify** | `pickGoldTemplate(id, body, title)` — a ranking-style title on an essay body mis-routes; keep title as a plain question for Q&A. |

**Post-render audit (outside 13/13):** `_sf_crawl_audit.js` flags missing or >65-char `<title>`; `_pulse_spider.js` checks title/H1 parity.

**Render-time vs blob (meta description):** Meta description is **not** stored in the answer blob or index as its own field. At serve time, `netlify/functions/pulse-machine-entry.js` sets head tags from index entry fields + blob body:

1. `const desc = descExcerpt(entry.answer)` — walks the blob for the first substantive prose block (skips headings, rules, code, tables; requires ≥40 chars after markdown strip).
2. `clipMeta(cleaned)` — trims to **≤158 chars** on a word boundary (preemptive cap so crawlers never see >160).
3. Same `desc` is reused for `<meta property="og:description">` and `<meta name="twitter:description">`.

`prepareEntryForPublish()` in `_write_lib.js` stamps pillar SEO + keyword cluster on the index entry; it does **not** write meta description text.

**13/13 rubric tie-in:** Meta description is **not** a separate rubric checkpoint (`SCRUBBER_SPEC.md` criteria 1–13; `grade-entry.js` has no meta-desc criterion). It **derives** from blob content that **is** gated:

| Rubric / audit | How it feeds meta |
|----------------|-------------------|
| **Criteria 2–3** — Direct Answer at top, complete | `descExcerpt()` selects the first real prose block after headings — normally the `## Direct Answer` paragraph (≥140 chars, ≥2 sentences in blob). |
| **`direct_answer_blank`** (gold audit) | Blank or stub Direct Answer → weak or missing meta snippet. |

**Authoring law:** Write `## Direct Answer` as snippet-bait: answer the question's promise in the first 1–2 sentences, then add **one concrete differentiator** so the rendered meta lands in the **120–160** char band without padding.

**Post-render audit (outside 13/13):** `_sf_crawl_audit.js` and `_pulse_spider.js` flag missing meta, duplicate descriptions, or length >160; renderer clipping at 158 is the primary enforcement.

### Image pipeline

| Rule | Detail |
|------|--------|
| **Choke point** | `storeGradedImage()` in `_ddg_facecard_lib.js` — the **only** function that writes image files. Grades from RAW via `applyCineGrade()`, self-hosts to `/assets/qa/`. |
| **EXIF proof-of-grade** | Every stored file carries `PULSE_GRADE=v_final` in EXIF `ImageDescription`. Verify with `verifyGradeStamp()`. |
| **pHash dedup** | dHash 64-bit on **raw** download (before grade). Hamming ≤8 = duplicate. Registry: `_img_registry.json`. Same-page hard-block; topical pool reuse OK across pages when matched (`pickMatchingLibraryImage`). |
| **Self-hosted only** | Saved bodies: `/assets/qa/…`, pillar pool. **No** live DDG hotlinks. **No** live `pollinations.ai` in blobs. |
| **Provider alternation** | DDG ↔ Pollinator strict flip — `_image_provider_alternate.js`. **15s floor** on both providers. |
| **Q&A rhythm** | Text → one `![alt](url)` → text → image … — never stacked. Image pipeline may **swap** at existing slot only. |

### Renderer law (blobs ≠ HTML)

Answer blobs are **markdown + text only**. The server renderer HTML-escapes all prose.

- **`escHtml()` + `renderMd()`** in `netlify/functions/pulse-machine-entry.js` — all body text escaped before HTML output; blob HTML cannot survive as live markup.
- **Never store in blob:** HTML, `<aside class="cro-ad">`, CRO cards, gold Direct Answer wrapper (`direct-answer-box`), ad widgets, inline styles, `/assets/kory-white.jpg` portrait images.
- **Injected at render only:** gold `direct-answer-box` (`wrapDirectAnswerGold()`), CRO Syndicate card (`insertCroAd()` → `croAdCard()` / `croMobileCard()` — after first content image + following text block on Q&A), badges, Related mosaic.
- CRO HTML is spliced into **already-rendered** answer HTML — blob HTML would be escaped and render as broken literal text; see **§0.1 Renderer constraint**.

**Gates:** `croBlobClean()` (`_format_fixer_lib.js`), gold audit `cro_in_blob`, scrub `croCardLawOk`, render agents A + C (`_render_audit_gate.js`). Handoff: `_CROSSOVER.md` (CRO strip + blank-DA fixes, 2026-07-06).

### Pulse brand palette (render)

| Token | Hex | Where enforced |
|-------|-----|----------------|
| **Gold** | `#FFB81C` | Pulse News / dark-brand surfaces — `_FABLE_MASTER_SPEC.md`, scrub dashboard |
| **Crimson** | `#B91C3F` | Pulse brand crimson (owner palette) |
| **Entry amber/gold** | `#C8821E` / `#CBA135` | Q&A entry pages — `assets/pulse-tan.css`, Direct Answer box in `pulse-machine-entry.js` (`#C8821E` border/label, `#FBF3E4` background) |

Q&A Direct Answer renders inside the gold border box at serve time — **not** baked into blob markdown.

### Visual lock (writing & images)

Per `.cursor/rules/visual-lock-law.mdc` and `_visual_lock_law.js`:

- **DeepSeek / writers:** prose, headings, FAQ, Sources, mermaid code **only**.
- **Writers must NOT:** add/remove/move `![alt](url)` markdown, HTML, CRO cards, or layout widgets.
- **Image pipeline:** swap one image at an existing slot — same count, same rhythm (`repairBrokenQaImages`, `fillEntryMissingImages` in `_ddg_facecard_lib.js`).
- **Enforcement:** `enforceWriterVisualLock()` after every DeepSeek pass.

---

## Code pointers

| Concern | Module |
|---------|--------|
| Gold outline + audit | `_qa_gold_template.js` — `QA_SECTION_ORDER`, `QA_TEMPLATE_OUTLINE`, `auditQaGoldTemplate` |
| Shape enforcement | `ensureQaGoldBodyShape` — strips leading hero images |
| Classify router | `_pulse_gold_template_router.js` — `pickGoldTemplate` |
| Render | `netlify/functions/pulse-machine-entry.js` — gold DA box, `noTopHero`, CRO after first content block |
| Document title | `pulse-machine-entry.js` — `shortTitle` from `entry.question`; H1 from `entry.h1 \|\| entry.question` |
| Meta description | `pulse-machine-entry.js` — `descExcerpt()`, `clipMeta()`; feeds `<meta name="description">`, OG, Twitter |
| Q&A surgical fix | `_aq_qa_gold_fix_lib.js` |
| Visual lock | `_visual_lock_law.js` |
| Image provider | `_image_provider_alternate.js` |
| Render auditors | Agent A (live layout) · Agent B (live images) · Agent C (Cursor blob gold) — `_render_audit_agent_*.js` |

---

## Related docs

- **Top 10 gold template:** `GOLDEN_TEMPLATE_TOP10.md` (reference `aq1158`)
- **Scrubber rubric:** `SCRUBBER_SPEC.md`

*Do not edit gold template shape without owner passcode 4444.*
