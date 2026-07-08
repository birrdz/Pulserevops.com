# 🔒 GOLDEN TEMPLATE — Top 10 Ranking List (aq1158)

> Spec for Claude Code / Cursor. Applies to any listicle-intent URL on pulserevops.com.

> **Status: MANDATORY · NON-NEGOTIABLE · IMMUTABLE SHAPE**  
> **Saved:** 2026-07-06  
> **Do NOT regenerate, restyle, or "improve" the live gold reference.** Document the locked law only.  
> Each entry uses **NEW content** and **NEW @@PRODUCT images** per rank — the template **shape** is fixed.  
> **Pair spec:** `GOLDEN_TEMPLATE_QA.md` (Q&A essay, q11133)

---

## 0. SUPERSESSION + CONTEXT (do this FIRST)

Owner MANDATORY supersession law:

**Delete all prior golden-template files/sections anywhere in the repo. This file and GOLDEN_TEMPLATE_QA.md are the only source of truth. Conflicting old rules are removed, not merged.**

**Read previous session logs (SCRUBBER_SPEC.md, prior Claude Code logs) for the 13-point gate, image grading pipeline, renderer HTML-escaping constraint, and Pulse palette before generating any page.**

- **13-point content gate** — publish only at **13/13** (`entryScrubPipeline` + `rubricSignOff`); see [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) PASS 1
- **Image grading pipeline** — every disk write through **`storeGradedImage()`**; **pHash** dedup; **EXIF** proof-of-grade (`PULSE_GRADE=v_final`); see [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) IMAGE STANDARD + DEDUPE
- **Renderer HTML-escaping constraint** — ad/widget markup lives in **`pulse-machine-entry.js`**, **NOT** in stored answer blobs (see **§0.1**)
- **Pulse palette** — crimson **`#B91C3F`**, gold **`#FFB81C`**

---

### Supersession — what this spec replaces

**This file is the sole owner spec for listicle-intent Top 10 pages.** It **supersedes and voids** any older or conflicting material, including:

| Superseded | Why it loses |
|------------|--------------|
| **Old Q&A-with-hero listicle shapes** | Ranking lists are **not** essay Q&As with a top face-card hero. Listicle-intent → **Top 10 only** (`cover_src: 'no-hero'`). |
| **Pre-2026-07 ranking templates** | Any `format_v` before `2026-07-ranking-master-no-hero`, Flux/local face-card heroes on ranking lists, hero-before-Direct-Answer render order. |
| **Prior `GOLDEN_TEMPLATE_TOP10.md` drafts** | HTML `<article>` skeletons, ItemList JSON-LD blocks, hero `fetchpriority="high"`, CRO inline after item #5, 14/14 `validate-golden.mjs` gate — **deleted**; pipeline uses markdown blob + `auditTop10GoldTemplate` + **13/13** rubric. |
| **Stale crossover / batch notes** | Session logs that describe ranking lists with top heroes or Q&A CRO placement on Top 10 — **this spec + code win**. |
| **Conflicting Q&A template bullets** | Older rules (e.g. `pulse-template-selection.mdc`, `SCRUBBER_SPEC.md` criterion 10) that **mandated a top hero on Q&A** — **corrected 2026-07-06**: Q&A (q11133) has **no top hero before Direct Answer**; that correction does **not** mean Top 10 gets a hero — **Top 10 never has a top hero**. |
| **Pillar-only assumptions** | Treating listicles as `/aquariums/` or `aq*` only — **wrong**. Any pillar can host listicle-intent URLs. |

**Immutable gold reference:** [aq1158 — Top 10 Nano Reef Tanks](https://pulserevops.com/aquariums/aq1158) (`aq1158`). Do **not** edit the live aq1158 blob.

**Code wins over live quirks:** `_ranking_top10_gold_template.js` (`TOP10_SECTION_ORDER`, `TOP10_TEMPLATE_OUTLINE`, `auditTop10GoldTemplate`) is the enforcement source of truth. If the live page or an old doc disagrees, **the code shape wins**. Bypass gold shape only with owner passcode **4444**.

---

### Context — who, scope, router

| | |
|--|--|
| **Who must read this** | Claude Code, Cursor agents, `generateOne` (`_scrub_button_server.js`), `entryScrubPipeline`, `_aq_top10_gold_fix_lib.js`, `_ranking_list_rebuild_lib.js`, batch fix paths (`_aq_gold_redo_batch_run.js`, pillar ranking batches), scrub UI |
| **Scope** | **Any listicle-intent URL** on pulserevops.com — all pillars (`/aquariums/`, `/software/`, `/clubs/`, `/wellness/`, `/knowledge/` if mis-seeded, etc.). Dual pillars host **both** ranking lists and essay Q&As; route by **body shape**, not hub path or ID prefix. |
| **Router** | `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` — call **before** generate, fix, or audit; lock result; **never switch template mid-run**. |
| **Templates** | **Exactly two** — no hybrids: **Top 10** (aq1158) or **Q&A** (q11133). Never merge `@@PRODUCT`/ranking pills into Q&A; never prepend Q&A top hero onto Top 10. |

**Related docs (read with this file):**

- [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) — Q&A essay spec (q11133)
- [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) — pipeline process (classify → 13/13)
- [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) — 13-point rubric, `storeGradedImage()` / pHash / EXIF image law, renderer HTML-escaping, Pulse palette

**Code modules (audit enforcement):** `_ranking_top10_gold_template.js` · `_qa_gold_template.js` · `_pulse_gold_template_router.js`

---

### Date / owner law (2026-07-06 session corrections)

Saved **2026-07-06 ~18:00–19:08 ET**. Locked with owner passcode **4444**:

1. **Two golden templates only** — Top 10 (aq1158) + Q&A (q11133); classify before generate.
2. **No top hero on ranking lists** — `cover_src: 'no-hero'`, `format_v: '2026-07-ranking-master-no-hero'`; gold audit: `unexpected_top_hero`.
3. **One `@@PRODUCT img=` per rank** — no markdown `![…](…)` inside `## 1.`–`## 10.`; gold audit: `rank{N}_markdown_image`, `rank{N}_duplicate_image`.
4. **Image/provider law** — DDG ↔ Pollinator strict alternation (`_image_provider_alternate.js`); **20s cooldown** on both providers; **self-hosted paths only** in saved bodies (no live `pollinations.ai`).
5. **Direct Answer must never be blank** — ≥140 chars, ≥2 sentences; gold audit: `direct_answer_blank`.
6. **CRO on Top 10** — render-time inject only (desktop fixed-right; mobile inline **after item #5**); never stored in blob (see **§0.1**).
7. **Q&A corrected separately** — no top hero before Direct Answer on Q&A; do not back-port Q&A hero law onto Top 10.

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

**Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup).**

One instance per page. localStorage dismiss behavior unchanged.

#### Owner law (locked — 2026-07-06)

| Rule | Requirement |
|------|-------------|
| **Widget** | Existing CRO Syndicate **hanging-card** — CSS cord + clothespin (`.cro-cord` / `.cro-peg`) swing animation, **crimson/oxblood** palette, **Calendly** primary CTA (`Book a Call →`), × dismiss |
| **Desktop ≥768px** | Fixed right viewport: `position: fixed; right: 0; top: 20vh` (or equivalent); article gutter so card **must not overlap** body text |
| **Mobile <768px** | Fixed right **DISABLED**; same swinging card **inline full-width** — Top 10: **after item #5** (after `#5` `product-card` closes); swing animation **on**; honor `prefers-reduced-motion: reduce` |
| **Renderer constraint** | Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup) |
| **One instance** | Exactly **one** CRO card per rendered page — no duplicates |
| **Dismiss** | **Unchanged** — localStorage dismiss keys/behavior (`croX` desktop, `croMobX` mobile); do not alter without owner passcode **4444** |
| **§7 gate** | Row **17**: present once — fixed-right desktop, inline after **item #5** on mobile, renderer-injected not blob |

> **Code note:** Live renderer uses `sessionStorage` for `croX` / `croMobX`; breakpoint gates at **1200px/1199px**; Top 10 inline splice at **rank #3** (`afterTop10Item3Card()`) — owner targets **768px** and **after item #5** on mobile; align code in a separate task.

#### Render-time only — never in the blob

**Renderer constraint (mandatory):** Injected by the page template/renderer only — never stored in answer blobs (renderer HTML-escapes stored markup).

**One instance per page; localStorage dismiss unchanged.**

| Function | Role |
|----------|------|
| `insertCroAd()` | Orchestrator — desktop fixed + mobile inline at `croInsertPos()` |
| `insertCroAdDesktop()` | Strips legacy blob CRO, splices `croAdCard()` into body HTML |
| `croAdCard()` | Desktop hanging widget + dismiss script (`#croFixed`) |
| `croMobileCard()` | Mobile inline widget at same logical slot (`#croMobCard`) |
| `croInsertPos()` | Placement router — Top 10 → `afterTop10Item3Card()` |
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
| Gold audit | `_ranking_top10_gold_template.js` | `cro_in_blob` failure code |
| Visual lock | `_visual_lock_law.js` | `enforceWriterVisualLock` — writers must not add CRO cards |
| Render auditors | `_render_audit_agent_a.js`, `_render_audit_agent_c.js` | Agent A: live CRO placement · Agent C: blob gold + no baked CRO · `_render_audit_gate.js` |

See also: `.cursor/rules/visual-lock-law.mdc` (writers change prose only — not CRO cards, HTML, or layout widgets).

#### Top 10 placement

On ranking lists, `croInsertPos()` calls `afterTop10Item3Card()` (code) — **owner mobile target: after item #5**:

- **Desktop (≥768px target):** fixed right-side swinging card — see **[Desktop placement](#desktop-placement)**; **not** spliced into article flow
- **Mobile (<768px target):** inline full-width swinging card **after item #5** — see **[Mobile placement (<768px)](#mobile-placement-768px)**
- **Code today:** mobile inline splices at **rank #3** (`afterTop10Item3Card()` — after `#3` `product-card` closes); owner law requires **after item #5**
- **Not** immediately after Direct Answer (that slot is Q&A-only — see `GOLDEN_TEMPLATE_QA.md` §0.1)

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

**Owner requirement:** On viewports **below 768px**, the fixed right-side widget is **DISABLED**. The same swinging CRO card renders **inline** in the article body as a **full-width block**. On Top 10 pages, insert **after item #5** (after item #5's `product-card` closes). The cord/peg **swing animation stays on** unless the user has `prefers-reduced-motion: reduce`.

See **[Desktop placement](#desktop-placement)** for the fixed right-side widget (≥768px target).

**What the renderer does today** (`pulse-machine-entry.js` → `insertCroAd()` + `croMobileCard()` + inline `<style>` block, ~L577–617, L664–672, L1190–1201):

| Spec | Owner | Code today |
|------|-------|------------|
| Mobile breakpoint | **<768px** | **≤1199px** (fixed hidden + inline shown) |
| Top 10 inline slot | **After rank #5** | **`afterTop10Item3Card()` — after rank #3** (same slot as desktop) |
| Fixed widget on mobile | **Disabled** | **Disabled** (`.cro-ad-root{display:none!important;}`) |
| Inline full-width block | Yes | Yes (`.cro-mob-card{display:flex;width:100%;…}`) |
| Swing animation | On; off when `prefers-reduced-motion` | On via `.cro-swing` + `cro-sway`; `@media(prefers-reduced-motion:reduce)` disables animation |

**Injection path** (shared desktop + mobile anchor):

```javascript
// insertCroAd() — desktop fixed card + mobile inline card at the same croInsertPos()
const pos = croInsertPos(out);          // Top 10 → afterTop10Item3Card()
return out.slice(0, pos) + croMobileCard() + out.slice(pos);
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

> **Renderer fix note:** Owner targets **768px** breakpoint and Top 10 inline slot **after rank #5**; code today switches at **1199px** and splices at **rank #3** via `afterTop10Item3Card()`. Align `pulse-machine-entry.js` in a separate task — do not change renderer in this doc pass.

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
| **§7 row 17** | Present once: fixed-right desktop, inline after **item #5** on mobile — see **§7** item **17** |

⚠️ **False flag:** v2 slip scans grepping blobs for `class="cro-ad"` always fail — CRO is render-time only. Exclude `croCard` from blob-based slip scans.

Session handoff: `_CROSSOVER.md` (CRO strip + blank-DA render fixes, 2026-07-06).

---

## Live reference

| Field | Value |
|-------|-------|
| **Gold ID** | `aq1158` |
| **Live URL** | https://pulserevops.com/aquariums/aq1158 |
| **Title example** | Top 10 Nano Reef Tanks |

Open aq1158 on desktop and mobile before bulk fixes. That page is the shape demo — never copy its prose or product images into other entries.

---

## 1. DETECTION — when this template applies

### Apply if the URL slug, title, or query matches:

**Router truth:** `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` classifies from **entry id + markdown body + title string** only. Public URL path, topic slug, and tags are **soft pre-classify hints** for agents at seed/publish time — they do **not** override body shape. Pipeline passes `entry.question` as `title` (see `entryScrubPipeline` / `generateOne` in `_scrub_button_server.js`).

**Final lock:** always call the router before generate/fix; title/query signals alone are **never sufficient** without ranking body markers (except body-only path in the router table below).

#### URL slug, path, and ID (soft signals)

Entry pages render at `/{pillar-hub}/{id}` via `libraryEntryPublicUrl()` in `netlify/functions/lib/library-entry-url.js` + `pulse-machine-entry.js`. The path segment is the **numeric id** (`aq1158`, `tl0042`) — not a semantic slug derived from the title.

| Signal | Match pattern (case-insensitive) | Example | Agent use |
|--------|----------------------------------|---------|-----------|
| **Topic slug** (optional publish metadata) | `top-10`, `top-\d+`, `best-*`, `*-ranked*`, `*-rankings*` | `top-10-mid-size-suvs`, `best-off-road-suvs` | Sprint seeds (`_ca_workflow.js`, `_aq_workflow_template.js`); passed as 4th arg to `_write_*.js`; often copied into `tags` |
| **Entry tags** | `top-10`, `best-of-2027`, `best-of-2026` | `_ds_publish.js` pillar `BASE_TAGS` | Correlates with listicle intent; **not** read by `pickGoldTemplate` |
| **Pillar hub path** | `/aquariums/`, `/software/`, `/cars/`, `/electronic-reviews/`, `/knowledge/`, … | `https://pulserevops.com/aquariums/aq1158` | Hub only — dual-mode pillars host **both** Top 10 and Q&A |
| **ID prefix** | `aq####`, `er####`, `tl####`, `sw####`, … | `aq1158`, `tl0100` | Routes pillar + grader ruleset — **does not** pick template by itself |
| **Listicle-only pillars** | `er####` | `/electronic-reviews/er0042` | ER entries are almost always ranking lists — still verify body markers |
| **Mis-seed under Q&A hub** | `q####` or `/knowledge/q####` with ranking body | Rare | Body shape wins → Top 10 if `isRankingListBody` |

**Not entry URLs:** `/tools/<slug>` (`tools-page.js`) serves calculator widgets — not Top 10 ranking blobs.

#### Regex

**Title and query** use the same patterns — pipeline `question` field = router `title` arg.

`titleSuggestsRankingList(title)` in `_ranking_list_master_law.js` tests against `TITLE_RANKING_PATTERNS` (any **one** match → `true`). When `title` is omitted, code falls back to `# H1` extracted from body (`entryTitle()`). **Title alone is insufficient** — must also pass `isRankingListBody(body, title)` (router step 1) or body-only ranking markers (step 2).

| Pattern (regex) | Matches | Example title / query |
|-----------------|---------|------------------------|
| `\btop\s*(?:10\|ten)\b` | Top 10, Top Ten | "Top 10 Nano Reef Tanks" |
| `\btop[\s-]?(?:10\|ten)\b` *(SPEC)* | top-ten, Top-Ten | slug `top-ten-mid-size-suvs`; "Top-Ten CRM Tools" |
| `\bbest\s*(?:10\|ten)\b` | Best 10, Best Ten | "Best 10 CRM Platforms in 2027" |
| `\bbest\s*(?:five\|5)\b` | Best 5, Best Five | "Best Five Running Shoes" |
| `\bbest\s+\d+\b` | Best N (any digit) | "Best 7 Email Tools", "Best 3 CRMs" |
| `\btop\s+\d+\b` | Top N | "Top 5 Laptops", "Top 8 Filters" |
| `\b\d+\s+best\b` *(SPEC)* | N Best (digit-first) | "10 Best CRM Tools", "7 Best Email Platforms" |
| `\bthe\s+best\b` | The Best … | "The Best RevOps Stack for 2027" |
| `\bbest[\s-]?of\b` | Best of … | "Best of 2027 Blenders", "Best-of CRM Tools" — **N defaults to 10** (see N extraction) |
| `\b(?:20(?:2[4-9]\|30))\b` or `\bin\s+20(?:2[4-9]\|30)\b` *(soft)* | Year in title | "… in 2027" — soft signal; pair with top/best/listicle intent |
| `\b(?:ranked\|rankings\|top-rated\|highest-rated)\b` *(soft)* | Ranking language | "Top Rated Blenders 2027" — `PIPELINE_TEMPLATE_LAW.md` TOP_LIST; still needs ranking **body** |
| `\b(?:\d+\s+)?(?:best\|top)\b.*\bvs\.?\b` *(SPEC, soft)* | vs comparison listicles | "Best 5 CRM: HubSpot vs Salesforce" — pair with `## N.` ranks |
| `\b(?:compare\|comparison\|compared)\b` *(soft)* | Comparison listicle | "Laptop Comparison 2027" — pair with ranking **body** |

#### Extract N (item count)

Parse item count **N** from title (`entry.question` / H1), slug, or query. **`rankCountFromTitle(title)`** + **`expectedRankCount(body, title)`** in `_ranking_list_master_law.js` (router: `pickGoldTemplate` → `appliesTop10Gold` reads `expectedRankCount` for strict aq1158 N = 10 audit). No `extractN` export — **`rankCountFromTitle` is the canonical N extractor**. N controls how many `## 1.`–`## N.` rank sections and `@@PRODUCT` cards the blob must contain. Resolve and **lock N at classify + seed time** (before draft outline) — same as template classification.

**Default N = 10** when the phrase is **`best of`** or **`the best`** with no explicit number.

**If both pattern A and pattern B match, A wins** — `rankCountFromTitle` evaluates in order; first match wins:

| Pattern | Role | Regex / rule (in order) | N |
|---------|------|-------------------------|---|
| **A — explicit number** | Digit or fixed literal in title | `\b(?:top\|best)\s*(?:10\|ten)\b` → **10**; `\b(?:best\s*(?:five\|5)\|top\s*5)\b` → **5**; `\b(?:best\|top)\s+(\d+)\b` → clamp 3–10; `\b(\d+)\s+best\b` *(SPEC)* → clamp 3–10 | **10**, **5**, or **N** |
| **B — default-10 phrase** | No usable explicit number | `\bbest\s+of\b` or `\bthe\s+best\b` *(only if A did not match)* | **10** |

Example: *Best 7 of 2027 Blenders* — A matches `\bbest\s+7\b` → **N = 7**; B's `\bbest\s+of\b` is never reached.

**`rankCountFromTitle(title)`** — evaluated in order; first match wins:

| Title / query phrase | N | Source |
|----------------------|---|--------|
| `top 10`, `top ten`, `best 10`, `best ten` | **10** | `rankCountFromTitle` |
| `best 5`, `best five`, `top 5` | **5** | `rankCountFromTitle` |
| `top N` / `best N` where N is 3–10 | **N** (clamped 3–10) | `rankCountFromTitle` — `\b(?:best\|top)\s+(\d+)\b` → `Math.min(10, Math.max(3, N))` |
| `N best` / `\d+\s+best` (e.g. "10 Best …") | **N** (clamped 3–10) *(SPEC)* | `TITLE_SPEC_N_BEST` — `\b(\d+)\s+best\b` |
| **`best of` / `best-of` with no number** | **10** *(default)* | `rankCountFromTitle` — `\bbest\s+of\b` |
| `the best` with no number | **10** | `rankCountFromTitle` — `\bthe\s+best\b` |
| No title match | `min(10, ## N. count)` if ≥ 3 sections, else **10** | `expectedRankCount` body fallback |

**`expectedRankCount(body, title)`** — resolution order when title does not pin N:

| Priority | Source | Rule |
|----------|--------|------|
| 1 | **Title** | `rankCountFromTitle(title)` — explicit number in title wins |
| 2 | **Body** | `countProductSections(body)` — count of `^##\s+\d+\.\s` headings; if **≥ 3**, use `min(10, count)` |
| 3 | **Default** | **N = 10** |

- **`appliesTop10Gold(body, title)`** (strict aq1158 audit) requires **`expectedRankCount(body, title) === 10`** exactly.
- **Best 5 / Best N** (N ≠ 10): router still returns `template: 'top10'` with `reason: 'title_and_body_ranking_markers_not_top10_count'` — same immutable shape, N rank blocks instead of 10.

**Deep dive:** [§1.1 Extract N](#11-extract-n-ranked-item-count) (blob shape, code consumers, seed notes).

#### Negative cases — do **not** apply Top 10

Even when slug, title, or query looks listicle-intent:

| Condition | Router result | `reason` |
|-----------|---------------|----------|
| Essay/Q&A body — no `## N.` product ranks, no `@@PRODUCT`, no 🏆/💎/BEST OVERALL/VALUE | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` |
| Title says "best" / "top 10" but body is prose + text→image rhythm only | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` — **never force Top 10** |
| Dual pillar (`aq`, `tl`, `sw`, …) essay with < 8 numbered sections or no rank markers | **Q&A** | `essay_qa_body_shape` |
| "What is the best …?" how-to / explainer (single answer, no ranked picks) | **Q&A** | Same — title word "best" ≠ ranking list |
| Body has ranking markers **without** title signal | **Top 10** | `body_ranking_markers_without_title_signal` *(positive — body wins)* |
| Neither template shape matches | **null** | `no_gold_template_applies` |

**Render mirror:** `pulse-machine-entry.js` calls `isRankingListBody(croStripped, entry.question || entry.h1)` for no-hero + product-card render path — same body/title law as the router.

#### Router reference — `pickGoldTemplate`

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');

// title ← entry.question (pipeline) or explicit title arg
const route = pickGoldTemplate(id, body, title);
// route.template → 'top10' | 'qa' | null
// route.goldId   → 'aq1158' | 'q11133' | null
// route.reason   → see decision tree below
```

**Scope:** Any **listicle-intent URL** on pulserevops.com — all pillars (`/aquariums/`, `/software/`, `/clubs/`, `/wellness/`, `/knowledge/` if mis-seeded, etc.). Hub path and ID prefix do **not** decide template; **body shape + title signals** do.

**Pair spec:** Essay Q&As that fail these detection rules → [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) §1 (q11133).

### Classification law — before generation

1. Call **`pickGoldTemplate(id, body, title)`** in `_pulse_gold_template_router.js` **before** draft, fix, audit, or publish.
2. **Lock** the returned `template`, `goldId`, `goldUrl`, and `reason` for the entire run.
3. **Never switch template mid-run** — no Top 10 → Q&A pivots (or reverse) after generation starts.

```javascript
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const route = pickGoldTemplate(id, body, title);
// route.template → 'top10' | 'qa' | null
// route.goldId   → 'aq1158' | 'q11133' | null
// route.reason   → audit string (see router table below)
```

Supporting modules: `_ranking_list_master_law.js` (`titleSuggestsRankingList`, `isRankingListBody`, `rankCountFromTitle`, `expectedRankCount`) · `_ranking_top10_gold_template.js` (`appliesTop10Gold`, `auditTop10GoldTemplate`) · `_qa_gold_template.js` (`appliesQaGold`).

### Router decision tree (`pickGoldTemplate`)

Evaluated **in order** — first match wins:

| Step | Condition | Template | `reason` |
|------|-----------|----------|----------|
| 1 | `titleSuggestsRankingList(title)` **and** `isRankingListBody(body, title)` | **Top 10** | `title_and_body_ranking_markers_top10` (N = 10) or `title_and_body_ranking_markers_not_top10_count` (Best 5 / Best N) |
| 2 | `isRankingListBody(body, title)` (body markers **without** title signal) | **Top 10** | `body_ranking_markers_without_title_signal` |
| 3 | `appliesQaGold(id, body, { title })` | **Q&A** | `title_suggests_ranking_but_body_is_essay_qa` **or** `essay_qa_body_shape` |
| 4 | (none) | **null** | `no_gold_template_applies` |

**Critical dual-pillar rule (owner 2026-07-06):** A title with "best" / "top 10" alone must **not** force Top 10 when the body is essay/Q&A shape. Title signal **plus** ranking body markers → Top 10; title signal **without** ranking body → Q&A (`title_suggests_ranking_but_body_is_essay_qa`).

### Regex

**Code source of truth:** `_ranking_list_master_law.js` — consumed by `pickGoldTemplate`. **Code wins** on conflict; **SPEC** lines are agent/seed hints not yet in code.

**Title input:** `entry.question` / explicit `title` arg, or `# H1` via `entryTitle(body)` → `/^#\s+(.+)$/m`.

#### Entry ID / slug / URL context

ID, hub path, and topic slug **do not** select Top 10 alone — only soft hints at seed/publish. Router lowercases `id` for Q&A fallback only.

```javascript
// Router normalize — NOT a Top 10 trigger by itself
const entryId = String(id || '').toLowerCase();

// Dual-mode ID — same prefix can be Top 10 OR Q&A (_qa_gold_template.js pillarIsQa)
const DUAL_MODE_ID = /^([a-z]+)\d+$/i;
// capture[1] ∈ q, cg, tk, pt, sw, ai, aq, tl, tc, ga, gm

// Q-only knowledge IDs — default Q&A unless isRankingListBody(body)
const Q_ONLY_ID = /^q\d+$/i;

// Publish tags / topic slug hints (metadata only — pickGoldTemplate ignores today)
const LISTICLE_TAG_HINT = /\b(?:top-10|best-of-\d{4})\b/i;
const TOPIC_SLUG_HINT = /(?:^|-)(?:top-10|top-\d+|best-|.*-ranked|.*-rankings)(?:-|$)/i;

// H1 fallback when title arg omitted
const ENTRY_H1 = /^#\s+(.+)$/m;
```

#### Title / query signals (`titleSuggestsRankingList`)

**CODE TRUTH** — `TITLE_RANKING_PATTERNS`; any **one** match → `titleSuggestsRankingList(title) === true`:

```javascript
const TITLE_RANKING_PATTERNS = [
  /\btop\s*(?:10|ten)\b/i,      // "Top 10 …", "Topten …" (space optional before 10/ten)
  /\bbest\s*(?:10|ten)\b/i,     // "Best 10 …", "Best Ten …"
  /\bbest\s*(?:five|5)\b/i,     // "Best Five …", "Best5 …"
  /\bbest\s+\d+\b/i,            // "Best 7 …", "Best 3 CRMs"
  /\btop\s+\d+\b/i,             // "Top 5 …", "Top 8 …"
  /\bthe\s+best\b/i,            // "The Best RevOps Stack …" — N = 10 default
  /\bbest\s+of\b/i,             // "Best of 2027 …" — N = 10 default
];
```

**SPEC (agents / seed)** — listicle-intent, **N = 10** default; **not** in `TITLE_RANKING_PATTERNS` today:

```javascript
const TITLE_SPEC_TOP_TEN = /\btop[\s-]?(?:10|ten)\b/i;       // top-ten slug/title
const TITLE_SPEC_N_BEST = /\b(\d+)\s+best\b/i;              // "10 Best CRM Tools" → extract N
const TITLE_SPEC_BEST_OF = /\bbest[\s-]?of\b/i;             // "Best Of CRM Tools", "Best-of 2027"
const TITLE_SPEC_SOFT = /\b(?:ranked|rankings|top-rated|highest-rated)\b/i;  // pair with body markers
const TITLE_SPEC_VS = /\b(?:\d+\s+)?(?:best|top)\b.*\bvs\.?\b/i;  // vs comparison listicles
const TITLE_SPEC_COMPARE = /\b(?:compare|comparison|compared)\b/i;
const TITLE_SPEC_YEAR = /\b(?:20(?:2[4-9]|30))\b|\bin\s+20(?:2[4-9]|30)\b/i; // soft — "… in 2027"
```

**Code divergence:** `_ranking_top10_gold_template.js` duplicates a narrower local `isRankingListBody` (title checks only `\btop\s*(?:10|ten)\b|\bbest\s*(?:10|ten)\b`) — **router uses master law**, not gold template, for classification.

#### Extract N — code reference (`rankCountFromTitle` / `expectedRankCount`)

**Canonical N law:** [Extract N (item count)](#extract-n-item-count) under **Apply if the URL slug, title, or query matches** above. **`rankCountFromTitle`** returns **10** for "best of" / "the best" with no explicit number (`_ranking_list_master_law.js`).

```javascript
// _ranking_list_master_law.js — live code (pattern A before B; A wins when both match)
function rankCountFromTitle(title) {
  const t = String(title || '');
  if (/\b(?:top|best)\s*(?:10|ten)\b/i.test(t)) return 10;           // A
  if (/\b(?:best\s*(?:five|5)|top\s*5)\b/i.test(t)) return 5;       // A
  const m = t.match(/\b(?:best|top)\s+(\d+)\b/i);                   // A
  if (m) return Math.min(10, Math.max(3, parseInt(m[1], 10)));
  if (/\bbest\s+of\b/i.test(t) || /\bthe\s+best\b/i.test(t)) return 10;  // B
  return null;
}

function expectedRankCount(body, title) {
  const fromTitle = rankCountFromTitle(title);
  const fromBody = countProductSections(body);
  if (fromTitle != null) return fromTitle;
  if (fromBody >= 3) return Math.min(10, fromBody);
  return 10;
}
```

#### Body signals (`isRankingListBody`)

```javascript
const NUMBERED_RANK_HEADING = /^##\s+\d+\.\s/gm;  // count matches → countProductSections
const RANK_MARKERS = /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b|@@PRODUCT)/i;

function isRankingListBody(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const numbered = (body.match(NUMBERED_RANK_HEADING) || []).length;

  if (numbered >= 5) return true;
  if (numbered >= 3 && RANK_MARKERS.test(body)) return true;
  if (titleSuggestsRankingList(t) && (numbered >= 3 || RANK_MARKERS.test(body))) return true;
  return false;
}
```

#### Negative — do NOT match pure essay Q&A

Title-only listicle words **without** body markers → Q&A (`title_suggests_ranking_but_body_is_essay_qa`). Never force Top 10 on title alone.

```javascript
// Negative fingerprint — essay Q&A shape (pickGoldTemplate step 3)
const QA_DIRECT_ANSWER = /^##\s+Direct\s+Answer/im;
const QA_NO_PRODUCT = !/^@@PRODUCT\b/m.test(body);
const QA_FEW_RANKS = (body.match(/^##\s+\d+\.\s/gm) || []).length < 3;
const QA_NO_PILLS = !/(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b)/i.test(body);

// Title says "best/top 10" but body is essay → Q&A wins
const titleOnlyRanking =
  titleSuggestsRankingList(title) && !isRankingListBody(body, title);

// Dual-pillar guard — ≥8 numbered sections + rank markers → Top 10, NOT Q&A
const QA_RANKING_GUARD =
  (body.match(/^##\s+\d+\.\s/gm) || []).length >= 8 && RANK_MARKERS.test(body);

// "What is the best …?" explainer — single answer, no ranked ## N. picks → Q&A
const EXPLAINER_QUESTION = /^(?:what|how|why|when|where|should|can|do|does|is|are)\b/i;
```

Prose tables: [Negative cases](#negative-cases--do-not-apply-top-10) · slug/title soft signals: [Apply if the URL slug, title, or query matches](#apply-if-the-url-slug-title-or-query-matches).

### Title signals (`titleSuggestsRankingList`)

> **Full regex code blocks:** [Regex](#regex) above · **pattern tables:** [Apply if the URL slug, title, or query matches](#apply-if-the-url-slug-title-or-query-matches).

Any of these regex patterns on the entry title (or `# H1` extracted from body when title omitted):

| Pattern | Examples |
|---------|----------|
| `\btop\s*(?:10\|ten)\b` | "Top 10 Nano Reef Tanks", "Top Ten CRM Tools" |
| `\btop[\s-]?(?:10\|ten)\b` **(SPEC)** | "Top-Ten CRM Tools", slug `top-ten-mid-size-suvs` |
| `\bbest\s*(?:10\|ten)\b` | "Best 10 Project Management Apps" |
| `\bbest\s*(?:five\|5)\b` | "Best Five Running Shoes" |
| `\bbest\s+\d+\b` | "Best 7 Email Platforms", "Best 3 CRMs" |
| `\btop\s+\d+\b` | "Top 5 Laptops", "Top 8 Aquarium Filters" |
| `\b\d+\s+best\b` **(SPEC)** | "10 Best CRM Tools", "7 Best Email Platforms" |
| `\bthe\s+best\b` | "The Best RevOps Stack for 2027" |
| `\bbest[\s-]?of\b` | "Best Of CRM Tools", "Best-of 2027" — N = 10 default |
| `\b(?:ranked\|rankings\|top-rated\|highest-rated)\b` **(soft)** | "Top Rated Blenders 2027" |
| `\b(?:\d+\s+)?(?:best\|top)\b.*\bvs\.?\b` **(SPEC, soft)** | "Best 5 CRM: HubSpot vs Salesforce" |
| `\b(?:compare\|comparison\|compared)\b` **(soft)** | "Laptop Comparison 2027" |

Title alone is **insufficient** — must pair with ranking body markers (step 1) **or** lose to step 3 when body is essay shape.

### Body signals (`isRankingListBody`)

> **Full regex code blocks:** [Regex → Body signals](#body-signals-isrankinglistbody-1) above.

True when **any** of:

| Rule | Threshold |
|------|-----------|
| Numbered rank sections | `^##\s+\d+\.\s` count **≥ 5** |
| Rank sections + markers | **≥ 3** numbered sections **and** rank markers present |
| Title + partial ranks | Title suggests ranking **and** (≥ 3 numbered sections **or** rank markers) |

**Rank markers** (`hasRankMarkers` / `qaHasRankingMarkers`):

- `@@PRODUCT` widget lines (`@@PRODUCT name="…" img="…" site="…"`)
- `🏆` or **`BEST OVERALL`** in rank #1 heading
- `💎` or **`BEST VALUE`** in rank #2 heading

**Typical Top 10 blob shape:**

```
## Direct Answer
## How We Ranked These Products
## 1. Product Name 🏆 BEST OVERALL
@@PRODUCT name="…" img="…" site="…"
…
## 2. … 💎 BEST VALUE
@@PRODUCT …
## 3.–## 10. …
```

### Top 10 gold vs Best N (`appliesTop10Gold`)

- **`pickGoldTemplate` → `top10`** for **any** detected ranking list (Top 10, Best 5, Best 7, etc.).
- **`appliesTop10Gold(body, title)`** is stricter: `isRankingListBody` **and** `expectedRankCount(body, title) === 10`.
- When N ≠ 10, router still returns `template: 'top10'` but `reason: 'title_and_body_ranking_markers_not_top10_count'` — same immutable **shape** (Direct Answer → How We Ranked → N ranks → tail), N product cards instead of 10.
- **`auditTop10GoldTemplate`** runs full aq1158 section-order audit **only** when `appliesTop10Gold` is true.

### 1.1 Extract N (ranked item count)

**Default N = 10** when the phrase is **`best of`** or **`the best`** with no explicit number. **If both pattern A (explicit `\b(?:best|top)\s+(\d+)\b` or fixed 10/ten/5 literals) and pattern B (`\bbest\s+of\b` / `\bthe\s+best\b`) match, A wins** — see [Extract N (item count)](#extract-n-item-count).

**N** = how many ranked product sections the entry must contain (`## 1.` … `## N.`), how many `@@PRODUCT img=` lines to generate, and what `auditRankingListMaster` / `grade-entry.js` expect. Title → N table and resolution order: [Extract N (item count)](#extract-n-item-count). Lock N at classify + seed time — same as template classification.

Title string = entry `question` / H1, or `# …` first line from body via `entryTitle(body)` when title omitted.

#### N → blob shape mapping

Once N is locked, the ranked block is always:

```
## 1. … 🏆 BEST OVERALL
@@PRODUCT name="…" img="…" site="…"
…
## 2. … 💎 BEST VALUE
@@PRODUCT …
## 3. …
…
## N. …
```

| N | Ranked sections | Product images | Full aq1158 gold audit |
|---|-----------------|----------------|------------------------|
| **10** | `## 1.`–`## 10.` | 10 × `@@PRODUCT img=` | **Yes** — `appliesTop10Gold` + `auditTop10GoldTemplate` |
| **3–9** | `## 1.`–`## N.` | N × `@@PRODUCT img=` | **No** — `auditRankingListMaster` only (`numbered_sections_{found}_of_{N}`, `product_lines_{found}_of_{N}`) |

Tail sections (How to Choose → Sources) are **unchanged** regardless of N. Optional mid-body H2s sit **after rank N**, before How to Choose.

**Seed note:** `TOP10_TEMPLATE_OUTLINE` in `_ranking_top10_gold_template.js` is written for N = 10 (aq1158). For Best 5 / Best N, agents must **parameterize** the outline at seed time (`## 1.`–`## N.` instead of hardcoded 10) using locked N from title — `generateOne` → `pickGoldTemplate` runs after first draft today; N should be computed from **title before** or **immediately after** classify and passed into fix/rebuild (`_ranking_list_rebuild_lib.js`, `_aq_top10_gold_fix_lib.js`).

#### Code consumers (N-aware today)

| Module | Function | Use |
|--------|----------|-----|
| `_ranking_list_master_law.js` | `expectedRankCount`, `rankCountFromTitle`, `auditRankingListMaster` | Master law + compliance |
| `_ranking_top10_gold_template.js` | `expectedRankCount`, `appliesTop10Gold` | aq1158 strict audit when N = 10 |
| `_pulse_gold_template_router.js` | `pickGoldTemplate` | Classify; `reason` distinguishes N = 10 vs not |
| `netlify/functions/lib/grade-entry.js` | `expectedRankCount` | Rubric image/rank counts |
| `netlify/functions/lib/ensure-entry-images.js` | `expectedRankCount` | Product image slot count |
| `_ranking_list_rebuild_lib.js` | `expectedRankCount`, `parseRankedProducts` | Rebuild/fix ranked sections |
| `_aq_top10_gold_fix_lib.js` | `expectedRankCount` | AQ Top 10 gold fix path |
| `_scrub_button_server.js` | `expectedRankCount` | Scrub/generate pipeline (`TOP10_PRODUCT_SLOTS = 10` is fallback only) |

### Pillars — q-only vs dual-mode

**Do not route by pillar prefix alone.** Dual-mode pillars host **both** ranking lists and essay Q&As on the same hub.

| Mode | ID prefixes | Routing |
|------|-------------|---------|
| **Q-only** | `q####` (`/^q\d+$/`) | Essay Q&As default to Q&A gold unless body is a ranking list |
| **Dual-mode** | `q`, `cg`, `tk`, `pt`, `sw`, `ai`, `aq`, `tl`, `tc`, `ga`, `gm` | **Body shape wins** — same ID prefix can be Top 10 or Q&A |

Dual-mode example: `aq1158` is Top 10; `aq####` essay entries on `/aquariums/` are Q&A. A mis-seeded listicle under `/knowledge/` still classifies Top 10 if body markers match.

**Q&A guard on dual pillars** (`pillarIsQa` in `_qa_gold_template.js`): entries with **≥ 8** numbered `## N.` sections **and** ranking markers are **not** Q&A — they are ranking lists (Top 10 path).

### What is NOT this template

| Body shape | Title says "best/top 10"? | Result |
|------------|---------------------------|--------|
| Essay Q&A (text→image rhythm, no `@@PRODUCT`, no ranked `## N.`) | No | **Q&A** — `essay_qa_body_shape` |
| Essay Q&A | Yes | **Q&A** — `title_suggests_ranking_but_body_is_essay_qa` (**never** force Top 10) |
| Ranking list markers | Any | **Top 10** — this spec |
| Neither template matches | — | `no_gold_template_applies` — fix seed or body before generate |

**Never merge:** no `@@PRODUCT` / ranking pills in Q&A blobs; no Q&A top hero on Top 10; no hybrid shapes.

### Logging (every pipeline run)

Record via `_pipeline_template_log.js` → `makePipelineTemplateRun`:

1. **Classification** — `template`, `goldId`, `reason`
2. **Template used** — `top10` | `qa`
3. **Score history** — rubric score after each fix round
4. **Final 13/13 proof** — gold audit + rubric before certify

See [`.cursor/rules/pipeline-template-law.mdc`](.cursor/rules/pipeline-template-law.mdc) · [`PIPELINE_TEMPLATE_LAW.md`](PIPELINE_TEMPLATE_LAW.md).

---

## 2. REQUIRED PAGE STRUCTURE (in order)

**Gold reference:** [aq1158 — Top 10 Nano Reef Tanks](https://pulserevops.com/aquariums/aq1158) · **Code:** `TOP10_SECTION_ORDER`, `TOP10_TEMPLATE_OUTLINE`, `auditTop10GoldTemplate` in `_ranking_top10_gold_template.js`.

Every Top 10 blob and its rendered page must follow this sequence **in order**. **Do not reorder, skip, or rename mandatory elements.** N = locked rank count from §1.1 (default **10** for aq1158 strict audit; 3–9 for Best N with same tail shape). Cross-ref **§7** quality gate rows below.

### Required elements (in order)

1. **`<title>`** — Query phrase + number (e.g. `Top 10 …` / `Best 7 …`); **≤60 chars** before renderer ` | Pulse News` clip. §7 gate **2** · checklist **2**.
2. **`<meta name="description">`** — 120–160 chars: promise + one differentiator. §7 gate **3** · checklist **3**.
3. **Exactly ONE `<h1>`** — Matches title intent (may be longer than title tag). Renderer `<h1 class="q">` from `entry.h1 || entry.question`; no competing `# …` H1 in blob. §7 gate **4** · checklist **4**.
4. **Direct answer block** — `<p class="direct-answer">`: ≤50 words, names the **#1 pick** (bolded) + one-line reason; featured-snippet / AEO lead. Class `direct-answer` → gold `direct-answer-box` at render per spec. **Appears before hero** — no image before this block; gold audit: `unexpected_top_hero` / `top_hero_present`.
5. **`## Direct Answer`** (blob + render) — First H2 in every blob; gold audit: `first_section_not_direct_answer` if not. Wrapped at render in `<div class="direct-answer-box">` (`direct-answer` class family) — **not stored in blob**. ≥140 chars, ≥2 sentences; expand Best Overall + Best Value context with prices in the same section. §7 gate **5** · checklist **5**.
6. **Hero image (face card)** — **Immediately after Direct Answer block** (before `## How We Ranked These Products`). **The ONLY required image** — one image only. `fetchpriority="high"`, **NO lazy loading** (`loading="eager"`), `width="1200"` `height="630"`, descriptive **alt containing the topic**; **`onerror` fallback** (§6 · onerror provider swap); must load (HTTP 200). **Item images optional** — `@@PRODUCT img=` per rank only when image adds information; if used, follow §6 provider + onerror law. **No entry-cover hero before Direct Answer** (`cover_src: 'no-hero'`). §7 gate **6** · checklist **6** · **16**.
7. **Byline + dateModified near top** — Render-time `<p class="byline">By Kory White · Updated {dateModified}</p>` immediately below H1 (before Listen / body). Author name = **Kory White**; `dateModified` = today at generation time (DEFAULTS: `CURSOR_GOLDEN_TEMPLATES.md` A2 item **7**). **`TechArticle.author`** + **`dateModified`** in JSON-LD — **not in blob**. §7 gate **14** · checklist **11**.
8. **N sections:** `<section id="item-{pos}"><h2>{pos}. {Name}</h2><p>…</p></section>` — each body 2–4 sentences: why it made the list + one original data point/stat/comparison not on competing pages. §7 gates **7**, **8**, **11** · checklist **7**.
9. **Render chrome (before body markdown)** — Badges → H1 → meta-row → Listen → body begins at Direct Answer gold box. Renderer-owned — **not in blob**.
10. **CRO Syndicate swinging card** — Render-time only (`insertCroAd()` → `croAdCard()` / `croMobileCard()`); **never in blob**. Desktop ≥768px: **fixed-right** viewport card with **cord + clothespin swinging animation**. Mobile <768px: fixed-right **disabled**; same swinging card **inline full-width after item #5** (after `#5` `product-card` closes). Dismiss: **`localStorage.croCardDismissed`** (owner spec; live code: `sessionStorage` `croX` / `croMobX`). Reference rebuild: `components/cro-card.html` + `css/cro-card.css`. §0.1 · §7 gate **17** · checklist **17** · cross-ref **`CURSOR_GOLDEN_TEMPLATES.md` §C3** · A2 item **10**.
11. **`## How We Ranked These Products`** — Second H2 in every blob; weighted criteria bullets. Gold audit: `second_section_not_how_we_ranked`.
12. **2–3 in-context internal links** — Editorial links to related pulserevops.com pillar/knowledge pages woven in body prose — **not a "related posts" widget**. `/knowledge/{id}` entry routes OK when in-context. Tail `## Related on PULSE` is separate sibling nav. Cross-ref **`CURSOR_GOLDEN_TEMPLATES.md` DEFAULTS: Internal link targets**. §7 gate **9** · checklist **9**.
13. **`<p class="verdict">`** — ~50 words, #1 pick restated + when the runner-up wins. Inside `## Bottom Line`; fresh wording — not a paste of the Direct Answer opening. §7 gate **18** · gold audit tail.
14. **Tail sections (blob order)** — [Optional mid-body H2s 0+] → `## How to Choose` (one mermaid) → `## What to Look For` → `## FAQ` (≥5 pairs) → `## Bottom Line` → `## Sources` (≥5 URLs) → `## Related on PULSE`. `TOP10_SECTION_ORDER` · checklist **8**.
15. **Word count floor** — Word floor: **800**. Ceiling: **none**, but **never pad**; **padding is a gate failure**. **2,000 words is NOT required.** §7 gate **13** · checklist **10**.

### Live page sequence

```
Badges → H1 → meta-row (byline + dates) → Listen
  → Direct Answer [gold box]
  → Hero image (face card) — one lead figure after DA
  → How We Ranked → ## 1. … ## N. [CRO: desktop fixed-right swinging | mobile inline after item #5 — §0.1 · §C3]
  → [optional mid-body H2s]
  → How to Choose → What to Look For → FAQ → Bottom Line → Sources → Related on PULSE
```

### Gold audit (`auditTop10GoldTemplate`)

Enforces H2 order, N sequential ranks, single mermaid, no hero before Direct Answer, face-card hero after Direct Answer (§2 item **6**), no blank Direct Answer, no live pollinations, no CRO in blob. Load `TOP10_TEMPLATE_OUTLINE` at pipeline STEP 2 — parameterize `## 1.`–`## N.` when N ≠ 10.

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
      "@type": "ItemList",
      "name": "Top 10 Example Products in 2027",
      "url": "https://example.com/pillar/xx0000",
      "numberOfItems": 10,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "description": "Short meta description restating list promise plus one differentiator.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Example Product Alpha",
          "url": "https://pulserevops.com/aquariums/aq1158#item-1"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Example Product Beta",
          "url": "https://pulserevops.com/aquariums/aq1158#item-2"
        }
      ]
    },
    {
      "@type": "Article",
      "headline": "Top 10 Example Products in 2027",
      "url": "https://example.com/pillar/xx0000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "author": { "@type": "Person", "name": "Kory White" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Pillar Hub", "item": "https://example.com/pillar/" },
        { "@type": "ListItem", "position": 3, "name": "Top 10 Example Products in 2027", "item": "https://example.com/pillar/xx0000" }
      ]
    }
  ]
}
</script>
```

**Article node (required):** same `@graph` — `headline`, `author` (`@type`: `Person`, `name`: `Kory White`), `datePublished`, `dateModified`. Cross-ref `CURSOR_GOLDEN_TEMPLATES.md` **A3**.

**Render-time only — not in blob.** Structured data is injected by `netlify/functions/pulse-machine-entry.js` in `<head>` (~**L876–952** build, ~**L1092** emit). Writers, DeepSeek, and the image pipeline **must not** add JSON-LD, `<script type="application/ld+json">`, or schema markup to answer blobs.

**Required on every listicle-intent Top 10 page** (all pillars, all N). Q&A essay schema → [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) §3 (q11133).

**Gold reference (live verify):** [aq1158](https://pulserevops.com/aquariums/aq1158) — view page source → single `<script type="application/ld+json">`.

### Required structured data (owner law)

Every Top 10 render injects **one** JSON-LD `@graph` in `<head>`. Minimum required nodes:

> **Article node (required):** same `@graph` — `headline`, `author` (`@type`: `Person`, `name`: `Kory White`), `datePublished`, `dateModified`. Cross-ref `CURSOR_GOLDEN_TEMPLATES.md` **A3**.

| Schema node | Requirement | §7 gate |
|-------------|-------------|---------|
| **`ItemList`** | Inject JSON-LD **`ItemList`** with `numberOfItems` == locked **N**; `itemListOrder`: `"https://schema.org/ItemListOrderDescending"`; `itemListElement` array of **N** **`ListItem`** objects at positions **1..N** with `name` + `{canonical}#item-{pos}` URLs (matches `## 1.`–`## N.` rank headings — no gaps, no extras). Cross-ref **DEFAULTS:** canonical domain **https://pulserevops.com** (`CURSOR_GOLDEN_TEMPLATES.md` A3) | item **12** |
| **`Article`** | Same `@graph` block includes **`Article`** with **`headline`**, **`author`** (`@type`: `Person`, `name`: `Kory White`), **`datePublished`**, **`dateModified`** from index fields | item **14** |
| **`BreadcrumbList`** | Home → pillar hub → this entry | item **12** (with ItemList) |

Optional when applicable: **`Product`** (one per `@@PRODUCT` rank card), **`FAQPage`** (when tail `## FAQ` has ≥5 pairs). **Do not emit `QAPage` on Top 10.**

#### ItemList

ItemList: numberOfItems = N, itemListOrder descending, ListItem 1..N with name + {canonical}#item-{pos} URLs.

Cross-ref `CURSOR_GOLDEN_TEMPLATES.md` **A3**.

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

`JSON.stringify(ld)` emits compact single-line JSON (no pretty-print). Whitespace inside the tag is optional — crawlers accept both compact and indented forms as long as the payload is valid JSON.

#### HTML wrapper example (Top 10 — generic placeholders)

The script body is the JSON skeleton from **Example skeleton (Top 10)** below — wrapped in the required HTML tag:

```html
<head>
  <meta charset="utf-8">
  <title>Top 10 Example Products in 2027 | Pulse News</title>
  <meta name="description" content="Short meta description restating list promise plus one differentiator.">
  <link rel="canonical" href="https://example.com/pillar/xx0000">
  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"ItemList","name":"Top 10 Example Products in 2027","url":"https://example.com/pillar/xx0000","numberOfItems":10,"itemListOrder":"https://schema.org/ItemListOrderDescending","description":"Short meta description restating list promise plus one differentiator.","itemListElement":[{"@type":"ListItem","position":1,"name":"Example Product Alpha","url":"https://pulserevops.com/aquariums/aq1158#item-1"},{"@type":"ListItem","position":2,"name":"Example Product Beta","url":"https://pulserevops.com/aquariums/aq1158#item-2"}]},{"@type":"TechArticle","headline":"Top 10 Example Products in 2027","url":"https://example.com/pillar/xx0000","datePublished":"2027-01-15T12:00:00.000Z","dateModified":"2027-03-01T08:00:00.000Z","author":{"@type":"Organization","name":"Pulse"},"editor":{"@type":"Person","name":"Kory White","jobTitle":"Chief Revenue Officer"},"publisher":{"@type":"Organization","name":"Pulse News"},"description":"Short meta description restating list promise plus one differentiator."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://example.com/"},{"@type":"ListItem","position":2,"name":"Pillar Hub","item":"https://example.com/pillar/"},{"@type":"ListItem","position":3,"name":"Top 10 Example Products in 2027","item":"https://example.com/pillar/xx0000"}]}]}</script>
</head>
```

Readable equivalent (same payload — valid JSON inside one script tag):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ItemList", "name": "Top 10 Example Products in 2027", "numberOfItems": 10, "itemListElement": [ … ] },
    { "@type": "TechArticle", "headline": "…", "datePublished": "2027-01-15T12:00:00.000Z", "dateModified": "2027-03-01T08:00:00.000Z", "author": { "@type": "Organization", "name": "Pulse" }, "editor": { "@type": "Person", "name": "Kory White" } },
    { "@type": "BreadcrumbList", "itemListElement": [ … ] }
  ]
}
</script>
```

**Article node (required):** same `@graph` — `headline`, `author` (`@type`: `Person`, `name`: `Kory White`), `datePublished`, `dateModified`. Cross-ref `CURSOR_GOLDEN_TEMPLATES.md` **A3**.

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

### What the renderer emits today (live aq1158)

**Code today:** the **same** `@graph` for ranking lists and essay Q&As — `ld` is built **before** `isRankingListBody()` (~L959); no listicle-specific branch.

| `@graph` node (live aq1158) | `@type` | Notes |
|-----------------------------|---------|-------|
| 1 | **QAPage** | `mainEntity` → `Question` + `acceptedAnswer` (first 5000 chars of raw markdown blob) |
| 2 | **TechArticle** | headline, dates, author, editor, publisher, `descExcerpt()` description |
| 3 | **BreadcrumbList** | Home → Knowledge Library → entry title |

**Live aq1158 `@types` (verified 2026-07-06):** `QAPage`, `TechArticle`, `BreadcrumbList`, `Question`, `Answer`, `Organization`, `Person`, `ImageObject`, `WebPage`, `ListItem` — **no** `ItemList`, **no** `Product`, **no** `FAQPage`.

**URL mismatch:** JSON-LD uses `https://pulserevops.com/knowledge/aq1158` (~L834: `SITE + '/knowledge/' + id`) while canonical HTML is `https://pulserevops.com/aquariums/aq1158` — align to `libraryEntryPublicUrl()` in a renderer task.

### Top 10 — `@graph` nodes (owner law)

Ranking-list pages (`isRankingListBody()` / Top 10 gold) emit **three** nodes inside the one `@graph` array:

| # | `@type` | Role |
|---|---------|------|
| 1 | **`ItemList`** | Ranked product list — primary rich-result signal for listicle intent |
| 2 | **`TechArticle`** | Article metadata — **`author`**, **`datePublished`**, **`dateModified`**, editor, E-E-A-T |
| 3 | **`BreadcrumbList`** | Home → pillar/hub → this entry |

**Do not emit `QAPage` on Top 10** — listicle pages are `ItemList`, not Q&A schema.

#### `ItemList` — required fields

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"ItemList"` | Yes |
| `name` | `entry.question` (listicle title) | Yes |
| `url` | Canonical entry URL (`SITE + '/' + pillarPath + id`) | Yes |
| `numberOfItems` | Locked **N** from `expectedRankCount(body, title)` | Yes |
| `itemListOrder` | `"https://schema.org/ItemListOrderDescending"` (rank 1 = best) | Yes |
| `description` | `descExcerpt(entry.answer)` — same band as `<meta name="description">` | Yes |
| `itemListElement` | Array of **N** `ListItem` objects | Yes |

#### `ListItem` — one per rank (`## 1.`–`## N.`)

Parse ranked sections from blob at render time (`parseRankedProducts()` in `_ranking_list_rebuild_lib.js` — same heading/`@@PRODUCT` shape the gold audit enforces):

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"ListItem"` | Yes |
| `position` | Rank integer **1 → N** (matches `## N.` heading) | Yes |
| `name` | Product name — `@@PRODUCT name="…"` if present, else heading text stripped of 🏆/💎 pills | Yes |
| `url` | `{canonical}#item-{pos}` — e.g. `https://pulserevops.com/aquariums/aq1158#item-1` (cross-ref **DEFAULTS:** canonical domain **https://pulserevops.com**) | Yes |

Optional enrichers (not required for compliance): `image` from `@@PRODUCT img=` (absolute URL), price text from `**Price / Cost:**` line.

#### `Product` — one per rank with `@@PRODUCT` (owner law)

When `@@PRODUCT name="…" img="…" site="…"` renders a `product-card` (~L336–347), emit a matching **`Product`** node (same parse regex as `renderMd`):

| Field | Source |
|-------|--------|
| `@type` | `"Product"` |
| `name` | `name="…"` attribute |
| `image` | Absolute URL from `img=` via `resolveEntryAssetUrl()` / `SITE + path` |
| `url` | `site=` vendor link |
| `offers` | Optional — when `**Price / Cost:**` present in rank block (`parseRankedProducts()` → `price`) |

#### `FAQPage` — when tail `## FAQ` exists (owner law)

| Rule | Detail |
|------|--------|
| **Trigger** | Blob has `## FAQ` with **≥5** pairs (13/13 criterion 4) |
| **`mainEntity`** | `Question` / `acceptedAnswer` per bold `**Question?**` + answer paragraph |
| **Code today** | **Not emitted** on entry pages — hub-only pattern in `_aq_compete_semantic_keywords.js` → `hubFaqJsonLd()` |

#### Article schema — required on every page

Every Top 10 page **must** include an **`Article`** node in `@graph` alongside `ItemList` — not `ItemList` alone. Owner law (`CURSOR_GOLDEN_TEMPLATES.md` **A3**): **`author`** is a **Person** named **Kory White**. Renderer may emit schema.org **`TechArticle`** subtype; owner-required fields below are mandatory regardless of `@type`.

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"Article"` (or `"TechArticle"` subtype) | Yes |
| `headline` | `entry.question` (listicle title) | Yes |
| `url` | Canonical entry URL | Yes |
| **`datePublished`** | `entry.ts` → ISO (`datePub`) | Yes |
| **`dateModified`** | `entry.polished_at` → ISO, else `datePublished` | Yes |
| **`author`** | `{ "@type": "Person", "name": "Kory White" }` | Yes |
| `keywords` | `entry.tags` joined | Optional |
| `mainEntityOfPage` | `{ "@type": "WebPage", "@id": canonical URL }` | Optional |
| `description` | `descExcerpt(entry.answer)` | Optional |

**Code today (deploy-gated):** renderer still emits `TechArticle` with `machineAuthor` (**Organization** `"Pulse"`) + `koryEditor` (**Person** `"Kory White"`). Agents and writers follow **owner spec** (Person author); renderer alignment is a separate deploy task.

E-E-A-T lives in JSON-LD — visible byline (§2 item **7**) carries **Kory White** + `dateModified`.

#### `BreadcrumbList` — required fields

| Field | Source | Required |
|-------|--------|----------|
| `@type` | `"BreadcrumbList"` | Yes |
| `itemListElement` | Array of 3 `ListItem` objects | Yes |
| `itemListElement[0]` | `{ position: 1, name: "Home", item: SITE + "/" }` | Yes |
| `itemListElement[1]` | `{ position: 2, name: pillar hub label, item: pillar hub URL }` | Yes |
| `itemListElement[2]` | `{ position: 3, name: entry.question, item: canonical URL }` | Yes |

Full shared field tables: [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) **§3** (`machineAuthor`, `koryEditor`, `publisherOrg`).

#### Example skeleton (Top 10 — generic placeholders)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "name": "Top 10 Example Products in 2027",
      "url": "https://example.com/pillar/xx0000",
      "numberOfItems": 10,
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "description": "Short meta description restating list promise plus one differentiator.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Example Product Alpha",
          "url": "https://pulserevops.com/aquariums/aq1158#item-1"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Example Product Beta",
          "url": "https://pulserevops.com/aquariums/aq1158#item-2"
        }
      ]
    },
    {
      "@type": "Article",
      "headline": "Top 10 Example Products in 2027",
      "url": "https://example.com/pillar/xx0000",
      "datePublished": "2027-01-15T12:00:00.000Z",
      "dateModified": "2027-03-01T08:00:00.000Z",
      "author": { "@type": "Person", "name": "Kory White" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Pillar Hub", "item": "https://example.com/pillar/" },
        { "@type": "ListItem", "position": 3, "name": "Top 10 Example Products in 2027", "item": "https://example.com/pillar/xx0000" }
      ]
    }
  ]
}
```

#### Code status (owner spec vs renderer today)

| Element | Owner law (this doc) | Code today (`pulse-machine-entry.js` ~L909–952) |
|---------|---------------------|--------------------------------------------------|
| **One LD script** | Yes | **Aligned** — single `<script type="application/ld+json">` |
| **Top 10 primary type** | `ItemList` + N `ListItem` | **Not yet** — all entries emit `QAPage` + `TechArticle` + `BreadcrumbList` |
| **Top 10 omit `QAPage`** | Yes | **Not yet** — `QAPage` still present on ranking lists (live aq1158) |
| **`Product` per `@@PRODUCT`** | Required where product card renders | **Not yet** — HTML `product-card` only |
| **`FAQPage` when FAQ ≥5** | Required | **Not yet** on entries |
| **JSON-LD URL = canonical** | `libraryEntryPublicUrl()` pillar path | Hardcoded `/knowledge/{id}` |

Agents and writers follow **owner spec**; renderer code change is deploy-gated. Blobs never carry JSON-LD regardless.

**Post-render audit:** `_sf_crawl_audit.js` (`jsonLdTypes`, `hasJsonLd`); `_pulse_spider.js` on live listicle URL.

**SCRUBBER_SPEC:** schema is not a separate 13/13 criterion — derives from Direct Answer (#2–3), FAQ (#4), N ranks + `@@PRODUCT` (gold audit).

**Code pointers:** `parseRankedProducts()` in `_ranking_list_rebuild_lib.js` · `expectedRankCount()` in `_ranking_list_master_law.js` · `libraryEntryPublicUrl()` in `netlify/functions/lib/library-entry-url.js`.

---

## 4. HTML SKELETON

**Render-time only — not in blob.** Answer blobs store **markdown + text only** (`entry.answer`), not full HTML. This section is the **renderer output target reference** — the live page shape `netlify/functions/pulse-machine-entry.js` emits at serve time via `renderMd()` → `wrapDirectAnswerGold()` → `insertCroAd()` → template string (~**L1067–1374**).

#### Html

Placeholders: `{id}`, `{question}`, `{pillar}`, `{N}` = locked rank count. Comments describe renderer ownership vs blob origin. CRO `#croFixed` / `#croMobCard` injected at render — **never in blob**.

```html
<!doctype html>
<html lang="en">
<head>
  <!-- RENDERER: charset, viewport, favicons, pulse-tan.css (~L1070–1091, L1282) -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- RENDERER: shortTitle from entry.question — word-boundary clip ≤65 chars incl. " | Pulse News" (~L838–844) -->
  <!-- BLOB: none — set index entry.question at publish (Compliance § Document title) -->
  <title>Top 10 Example Products in 2027 | Pulse News</title>

  <!-- RENDERER: descExcerpt(entry.answer) → clipMeta() ≤158 chars (~L836, L735–758) -->
  <!-- BLOB: first substantive prose in ## Direct Answer feeds this snippet -->
  <meta name="description" content="Short meta description restating list promise plus one differentiator.">

  <!-- RENDERER: metaKeywords(entry), canonical, robots, OG/Twitter (~L1074–1087) -->
  <meta name="keywords" content="…">
  <link rel="canonical" href="https://pulserevops.com/{pillar}/{id}">
  <!-- og:title uses entry.question (first 70 chars); og:description reuses desc -->

  <!-- §3 JSON-LD — exactly ONE script; ItemList + TechArticle + BreadcrumbList (no QAPage) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "<!-- entry.question -->",
        "url": "<!-- canonical URL -->",
        "numberOfItems": "<!-- N from expectedRankCount() -->",
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "description": "<!-- descExcerpt() -->",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "<!-- @@PRODUCT name= or heading text -->",
            "url": "<!-- {canonical}#item-{pos} -->"
          }
          <!-- … ListItem position 2 … N — one per ## 1.–## N. -->
        ]
      },
      {
        "@type": "TechArticle",
        "headline": "<!-- entry.question -->",
        "url": "<!-- canonical URL -->",
        "datePublished": "<!-- entry.ts ISO (datePub) -->",
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
          { "@type": "ListItem", "position": 2, "name": "<!-- pillar hub label -->", "item": "<!-- pillar hub URL -->" },
          { "@type": "ListItem", "position": 3, "name": "<!-- entry.question -->", "item": "<!-- canonical URL -->" }
        ]
      }
    ]
  }
  </script>

  <!-- RENDERER: lazy mermaid loader — NOT JSON-LD (~L1093–1111) -->
  <script>/* load mermaid.min.js after first paint if .mermaid present */</script>

  <!-- RENDERER: inline entry + CRO CSS (~L1113–1281); assets/pulse-tan.css -->
</head>
<body>
  <!-- RENDERER: scroll-top, dark masthead (.top) (~L1285–1288) -->

  <article><!-- optional class="cc-gold" when entry.cc_signed -->

    <!-- RENDERER ONLY — not in blob -->
    <div class="crumb"><a href="/knowledge.html">Knowledge Library</a> · {tag}</div>
    <!-- RENDERER: quality / Machine Certified badge pills (~L1293–1316) -->

    <!-- RENDERER: single page H1 from entry.h1 || entry.question (~L1318) -->
    <!-- BLOB: no # H1 — renderMd() drops lone # lines; start at ## Direct Answer -->
    <h1 class="q">Top 10 Example Products in 2027</h1>

    <!-- TOP 10 GOLD: noTopHero — NO <figure class="entry-cover"> here (~L959–961) -->
    <!-- heroHtml empty when isRankingListBody() + RANKING_LIST_NO_TOP_HERO -->

    <!-- RENDERER: meta-row — word count + Published / Updated (~L1320) -->
    <!-- dateModified chain: entry.polished_at || entry.updated_at || entry.cc_signed_at -->
    <div class="meta-row">
      <span>📖 {wordCount} words</span>
      <span style="margin-left:auto">🗓️ Published {Mon D, YYYY} · Updated {Mon D, YYYY}</span>
    </div>

    <!-- RENDERER: TTS Listen button (#read-aloud-top) (~L1321–1323) -->

    <div class="body">
      <!-- ═══ BLOB MARKDOWN RENDERED BELOW — escHtml() on all prose ═══ -->

      <!-- renderMd(): ## Direct Answer → wrapDirectAnswerGold() gold box (~L367–371, L167–175) -->
      <div class="direct-answer-box">
        <div class="direct-answer-label">Direct Answer</div>
        <!-- BLOB: ## Direct Answer + prose (≥140 chars, ≥2 sentences; #1 pick in first ≤50 words) -->
        <p>…</p>
      </div>

      <!-- BLOB: face-card hero — immediately after Direct Answer, before How We Ranked (§2 item 6) -->
      <figure class="entry-section">
        <img src="https://pulserevops.com/assets/qa/aq1158-hero.jpg"
             alt="Top 10 example products topic overview"
             width="760" height="428"
             loading="eager" fetchpriority="high"
             onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
      </figure>

      <!-- BLOB: ## How We Ranked These Products -->
      <h2>How We Ranked These Products</h2>
      <ul><li>…</li></ul>

      <!-- BLOB: ## 1. … 🏆 BEST OVERALL -->
      <h2>1. Example Product Alpha 🏆 BEST OVERALL</h2>
      <!-- renderMd(): @@PRODUCT → product-card (~L336–346) -->
      <div class="product-card">
        <!-- entryImgAttrs() (~L84–97): every <img> carries onerror + optional data-fallback -->
        <a href="{site}"><img src="https://pulserevops.com/assets/qa/aq1158-1.jpg"
             alt="{name}" width="760" height="460"
             loading="lazy" decoding="async"
             onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}"></a>
        <div class="product-name">{name}</div>
      </div>
      <!-- BLOB: 2–4 sentence rank prose (+ optional Price/Pros/Cons/Verdict) -->
      <p>…</p>

      <!-- BLOB: ## 2. … 💎 BEST VALUE + @@PRODUCT + prose -->
      <h2>2. Example Product Beta 💎 BEST VALUE</h2>
      <div class="product-card">…</div>
      <p>…</p>

      <!-- BLOB: ## 3. … + @@PRODUCT + prose -->
      <h2>3. Example Product Gamma</h2>
      <div class="product-card">…</div>
      <p>…</p>

      <!-- ═══ CRO INJECT ANCHOR — after rank #3 product-card closes (~L481–488, croInsertPos) ═══ -->
      <!-- DESKTOP (≥1200px): fixed right-side widget — appended here, position:fixed (~L1150, insertCroAdDesktop) -->
      <div class="cro-ad cro-ad-card cro-ad-root" id="croFixed">…</div>
      <!-- MOBILE (≤1199px): inline full-width block at SAME splice index (~L664–672, croMobileCard) -->
      <div class="cro-mob-card" id="croMobCard">…</div>
      <!-- Owner spec: desktop fixed ≥768px, mobile inline after rank #5; code today: both at rank #3, breakpoint 1200px/1199px — §0.1 -->

      <!-- BLOB: ## 4. … through ## N. — repeat h2 + product-card? + prose -->
      <h2>4. …</h2>
      <!-- … ranks 4–N … -->

      <!-- BLOB: [optional mid-body H2s after rank N] -->

      <!-- BLOB: ## How to Choose — single ```mermaid flowchart``` → .mermaid-wrap -->
      <h2>How to Choose</h2>
      <div class="mermaid-wrap"><div class="mermaid">…</div></div>

      <!-- BLOB: ## What to Look For · ## FAQ · ## Bottom Line · ## Sources · ## Related on PULSE -->
      <h2>What to Look For</h2>
      <h2>FAQ</h2>
      <h2>Bottom Line</h2>
      <h2>Sources</h2>
      <h2>Related on PULSE</h2>

      <!-- moveMermaidToBottom() may relocate mermaid blocks above Related on PULSE (~L647–661) -->
    </div><!-- /.body — insertCroAd(moveMermaidToBottom(renderedAnswer), id) (~L1325) -->

    <!-- RENDERER ONLY — below .body, still inside <article> -->
    <div class="dl-row">Download · Social Studio · Listen</div>
    <div id="feedback-row">Was this helpful? …</div>
    <div class="share-row entry-share">Share: LinkedIn · X · …</div>
    <!-- entry.sources → .entry-sources "Sources cited" (~L989–994) -->
    <!-- findRelated() → "Deep dive · related in the library" (~L996–1001) -->
    <!-- prev/next q-ID nav when applicable (~L1355–1364) -->

  </article>

  <!-- RENDERER: viz lightbox, mosaic rail, footer, pulse-lead-track.js (~L1366–1383) -->
  <section class="mag-mosaic" data-pulse-mosaic data-pillar="{pillar}">…</section>
</body>
</html>
```

Writers, DeepSeek, and the image pipeline **must not** bake HTML, `<div class="direct-answer-box">`, `<div class="product-card">`, CRO markup, or layout widgets into blobs — blob HTML is escaped by `escHtml()` and renders as literal text.

### Required skeleton elements (Top 10 render target)

| Element | Owner law | Blob? |
|---------|-----------|-------|
| **`<article>` wrapper** | Renderer shell around crumb, H1, `.body`, share/related rails | No — template only |
| **`<h1>`** | Single page title from `entry.h1 \|\| entry.question` (~L1318) | No `#` H1 in blob — start at `## Direct Answer` |
| **`direct-answer-box`** | Gold box from `## Direct Answer` via `wrapDirectAnswerGold()` | Markdown prose only — box injected at render |
| **Hero image** | Face-card `<figure class="entry-section">` immediately after Direct Answer — `fetchpriority="high"`, `loading="eager"`, `onerror` fallback (§2 item **6**). **No** `<figure class="entry-cover">` before Direct Answer (`noTopHero`) | Blob `![alt](/assets/qa/…)` after `## Direct Answer` prose |
| **Rank sections** | `## 1.`–`## N.` sequential H2s + optional `product-card` per `@@PRODUCT` | Markdown headings + `@@PRODUCT` lines |
| **JSON-LD `<script>`** | Exactly **one** `<script type="application/ld+json">` in `<head>` — **`ItemList`** + N **`ListItem`** + **`TechArticle`** + **`BreadcrumbList`** (+ **`FAQPage`** when FAQ ≥5) | Never in blob — see **§3 SCHEMA (required)** |
| **CRO injection** | `insertCroAd()` splices desktop fixed + mobile inline at rank **#3** anchor — **never** stored in markdown | Render-time only — see **§0.1** |

**JSON-LD detail:** owner law vs code today (`QAPage` still on all entries) — **§3** code-status table.

### Source of truth

| Layer | Module | Role |
|-------|--------|------|
| Page shell | `pulse-machine-entry.js` | `<!doctype>` … `</html>` template (~L1067) |
| Body markdown → HTML | `renderMd()`, `wrapDirectAnswerGold()` | Escaped prose, headings, figures, `@@PRODUCT` → cards |
| CRO inject | `insertCroAd()` → `croInsertPos()` → `afterTop10Item3Card()` | Desktop fixed + mobile inline at same anchor |
| Meta / title | `shortTitle`, `descExcerpt()`, `clipMeta()` | `<title>`, `<meta name="description">`, OG/Twitter |
| Structured data | `ld` object (~L909–952) | Single JSON-LD block in `<head>` (~L1092) |

### CRO placement — desktop vs mobile (Top 10)

| Surface | Owner spec | Code today (`pulse-machine-entry.js`) |
|---------|------------|----------------------------------------|
| **Insertion anchor** | After rank **#3** `product-card` closes (before #3 description prose continues) | `afterTop10Item3Card()` — same |
| **Desktop widget** | Fixed right viewport, swinging card, no text overlap ≥1100px | `#croFixed` / `.cro-ad-root` — **≥1200px** only; `body{padding-right:352px}` |
| **Mobile widget** | Inline full-width **after rank #5** | `.cro-mob-card` inline at **same anchor as desktop** (rank #3); shown **≤1199px** |
| **Count** | Exactly **one** logical slot — desktop fixed + mobile inline are paired surfaces, not duplicates | `insertCroAd()` splices both at `croInsertPos()`; CSS hides one per breakpoint |
| **Never** | Inside `direct-answer-box`; immediately after Direct Answer (Q&A-only slot) | Guardrails: `directAnswerBoxEndPos`, `afterDirectAnswerPos` |

### Blob vs renderer — quick map (Top 10)

| In live HTML | Source |
|--------------|--------|
| `<title>`, meta description, JSON-LD | Renderer + index fields + `descExcerpt(blob)` |
| H1, meta-row, badges, Listen, share, related rail | Renderer only |
| `direct-answer-box`, `product-card`, `<h2>` rank headings, tail sections | Blob markdown → `renderMd()` |
| CRO `#croFixed` / `#croMobCard` | Renderer `insertCroAd()` only |
| Mermaid SVG (client-side) | Blob fence → `.mermaid-wrap`; lazy-loaded script in `<head>` |

**Gold reference:** compare live DOM at [aq1158](https://pulserevops.com/aquariums/aq1158) against this skeleton — shape demo only; never copy prose or product images.

### Top 10 — `<div class="body">` fragment (audit shorthand)

Use when verifying blob → HTML mapping without full page chrome:

```html
<div class="body">
  <div class="direct-answer-box"><div class="direct-answer-label">Direct Answer</div><!-- #1 lead + prose --></div>
  <figure class="entry-section"><!-- face-card hero: fetchpriority="high" loading="eager" onerror --></figure>
  <h2>How We Ranked These Products</h2>
  <h2>1. … 🏆 BEST OVERALL</h2><div class="product-card">…</div><!-- prose -->
  <h2>2. … 💎 BEST VALUE</h2><div class="product-card">…</div><!-- prose -->
  <h2>3. …</h2><div class="product-card">…</div><!-- prose -->
  <!-- CRO desktop #croFixed + mobile #croMobCard — afterTop10Item3Card() -->
  <h2>4. …</h2><!-- … ranks through N … -->
  <!-- [optional mid-body H2] -->
  <h2>How to Choose</h2><div class="mermaid-wrap"><div class="mermaid">…</div></div>
  <h2>What to Look For</h2>
  <h2>FAQ</h2>
  <h2>Bottom Line</h2>
  <h2>Sources</h2>
  <h2>Related on PULSE</h2>
</div>
```

**Code vs owner:** JSON-LD today still emits `QAPage` on all entries — owner spec requires `ItemList` (§3). CRO splice today is after rank **#3**; owner mobile target is after rank **#5** (§0.1).

---

## 5. RENDERING RULES (mobile/desktop parity — MANDATORY)

These exist because of prior mobile↔desktop render breakage. On **2026-07-06**, production pages showed divergent desktop vs mobile layout: mosaic tiles rendered via **`background-image` CSS** instead of real `<img>` tags (broken or invisible on some viewports), **`content-visibility`** deferring mosaic/entry tiles off-screen, and **missing global `img` CSS** in `assets/pulse-tan.css` so body, product-card, and section figures overflowed or collapsed. **Every generated page must obey** the rendering rules below:

### Owner rendering law (summary)

| Law | Rule | §7 gate |
|-----|------|---------|
| **Mobile-first CSS** | Single column default; layout enhancements only in `@media (min-width: 768px)` | **15** |
| **No fixed pixel widths** | No fixed pixel widths on any container or image. Containers: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;` on `.body` / `<article>` prose column | **15** |
| **Fluid typography** | `body`: `clamp(1rem, 0.95rem + 0.4vw, 1.125rem)`; `h1`: `clamp(1.6rem, 1.2rem + 2vw, 2.4rem)` | **15** |
| **Images** | `max-width:100%; height:auto`; explicit `width`/`height` HTML attrs on every `<img>` via `entryImgAttrs()` | **15** · **16** |
| **No layout tables** | Tables for true tabular data only — never for page structure, columns, or chrome | **15** |
| **Overflow-wrap** | `overflow-wrap: break-word` (+ `word-break: break-word`) on prose column — no h-scroll @375px | **15** |
| **Lazy-load** | Lazy-load every image except the hero: `loading="lazy"` `decoding="async"`. Cross-ref **§2** hero — NO lazy loading on hero | **15** · **6** |
| **Viewport test** | Manual pass at **375px** and **1440px** before certify — zero CLS, zero broken images | **10** |

- **Mobile-first CSS. Single column by default; layout enhancements only inside @media (min-width:768px).**
- **No fixed pixel widths on any container or image. Containers: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;`**
- **Fluid type: font-size: clamp(1rem, 0.95rem + 0.4vw, 1.125rem); body. H1: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);**
- **Renderer owns all visuals** — `netlify/functions/pulse-machine-entry.js` + `assets/pulse-tan.css`; answer blobs are markdown + text only (`escHtml()` / `renderMd()`). Never store HTML, inline styles, gold Direct Answer wrappers, product-card markup, or CRO in blobs.
- **Real `<img>` tags everywhere** — entry figures, product cards, and mosaic tiles use `<img>` (mosaic: `<img class="mm-img">` via `PulseFaceImg.mosaicImgTag()` in `js/pulse-face-img.js`); **never** `background-image` lazy-load for content or mosaic entry tiles.
- **Global img sizing** — `.entry-cover img`, `.entry-section img`, `.product-card img`, `.body figure img` → `width:100%; height:auto; max-width:100%` (`pulse-tan.css`); explicit `width`/`height` on every `<img>` via `entryImgAttrs()`.
- **Test render at 375px and 1440px before marking the URL done.**
- **No tables for layout. No horizontal scroll: overflow-wrap: break-word; on the article.**
- **Lazy-load every image except the hero: `loading="lazy"` `decoding="async"`.** — cross-ref **§2** hero (NO lazy loading on hero).
- **Inject at render only** — gold `direct-answer-box`, `@@PRODUCT` → product cards, CRO Syndicate card (`insertCroAd()`) — never baked in blob markdown (see **§0.1**).
- **No `content-visibility:auto` on entry body figures** — entry prose and in-body images must paint on first scroll; mosaic tiles may use `content-visibility:visible` with real `<img>` — do not reintroduce background-image-only tiles.
- **Desktop + mobile parity** — same blob → same HTML structure at both breakpoints; CRO fixed-right vs mobile inline is a renderer CSS swap only (§0.1), not different blob markup per viewport.
- **Visual lock** — writers must not add, remove, move, or edit `@@PRODUCT`, `![alt](url)`, HTML, or layout widgets; image pipeline may **swap** at existing slots only (`_visual_lock_law.js` → `enforceWriterVisualLock()`).
- **Self-hosted images in blobs** — `/assets/qa/…` or pillar pool paths only; no live `pollinations.ai` URLs (`live_pollinations_url_in_body`).
- **onerror fallback swap on every `<img>`** — `entryImgAttrs()` (~L81–97) emits `onerror` + optional `data-fallback` on **every** renderer-built `<img>`; wsrv primary → direct URL retry on error (see **§ Images — onerror fallback swap**).
- **Broken image = hard FAIL** — any live broken/missing image blocks certify (`Agent B`, rubric #12, `SCRUBBER_SPEC.md` `IMAGE_DEAD` / `IMAGE_PLACEHOLDER`); no publish at 13/13 without **IMAGE_PASS**.
- **Verify before certify** — mandatory **§7 QUALITY GATE** before commit/publish (375px + 1440px viewport + all automated gates).

Enforcement: render agents A (live layout) + B (live images) + C (blob gold + visual lock) — `_render_audit_agent_*.js`, `_render_audit_gate.js`. Handoff: `_CROSSOVER.md` (2026-07-06 render fixes).

### No fixed pixel widths

**No fixed pixel widths** on any container or image. Use responsive `%`, `max-width`, `clamp()`, and `margin-inline:auto` — never `width:620px`, `width:760px`, or other hard px column locks on `.body`, `<article>`, `<figure>`, or `<img>` display sizing.

| Layer | Owner law | Code today (audit 2026-07-06) |
|-------|-----------|-------------------------------|
| **Containers** | `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px;` on content column (`.body` / `<article>` prose region) | `pulse-machine-entry.js` inline CSS (~L1134): `article{max-width:880px; …}`; `@media(min-width:1200px){ article{max-width:1240px;} }` — **deploy-gated alignment to 760px owner column** |
| **Figures** | `<figure class="entry-section">`, `.entry-cover`, `.entry-graphic`, `.product-card` — inherit column width; no px width on wrapper | Renderer emits `width:100%` inline on `<img>`; figure wrappers have margin/radius only |
| **Images (display)** | `max-width:100%; height:auto` — see **§ Images (Top 10)** · **Compliance § Visual lock** | `assets/pulse-tan.css` (~L115–147): sitewide `img{max-width:100%;height:auto}` + `.entry-cover img`, `.entry-section img`, `.product-card img`, `.body figure img` → `width:100%; height:auto; max-width:100%` |
| **Images (src hint)** | `entryImgAttrs()` `width`/`height` attrs = **aspect-ratio / CDN resize hint only** (default **760** × slot height) — not CSS column width | `pulse-machine-entry.js` (~L77–92, L1648): `w=760` wsrv + HTML `width="760"` on `<img>` for layout stability; display still fluid via CSS |

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
- **Lazy-load (non-hero):** every image **except the hero** (lead above-fold figure) — `loading="lazy"` `decoding="async"` via `entryImgAttrs()` (~L90–94); hero/lead → `loading="eager"` + `fetchpriority="high"`, never lazy (cross-ref **§2**). Top 10: no top hero — first rank `#1 @@PRODUCT` or section figure inherits lead rules.
- **Full image law:** **§ Images (Top 10)** · **Compliance § Image pipeline** · **Compliance § Visual lock** · `.cursor/rules/visual-lock-law.mdc`.

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
| **Single column by default** | Article body, rank blocks, product cards, and figures stack in **one column** at all breakpoints unless a `@media (min-width: 768px)` rule explicitly adds a wider layout. |
| **Layout enhancements only `@media (min-width: 768px)`** | Wider- viewport changes — **CRO fixed-right placement**, **article right gutter** (`body{padding-right:…}`), **expanded `article` max-width**, and **any multi-column layout** — belong **only** inside `@media (min-width: 768px)` blocks. No desktop-only layout in default CSS. |
| **Fluid base** | Default: `width: 100%`; images `max-width: 100%; height: auto; display: block` (`assets/pulse-tan.css`); article padding via `clamp()` — no fixed px column widths in base rules. |
| **CRO desktop vs mobile** | Cross-ref **§0.1** — desktop (≥768px target): fixed right-side swinging card + gutter; mobile (<768px target): inline full-width card after rank **#5**. Code today gates at **1200px / 1199px** — see §0.1 code-vs-owner tables; align renderer in a separate task. |
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
| **Lead image (hero)** | Lead above-fold figure: `loading="eager"` + `fetchpriority="high"` — **never** `loading="lazy"` (cross-ref **§2**). Top 10: no top hero — rank `#1 @@PRODUCT img=` or first section figure is lead; mosaic face-card cover uses same eager path on first batch. |
| **`onerror` fallback swap** | **Required on every rendered `<img>`** — `entryImgAttrs()` always appends `onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}"` (~L81, L96); `data-fallback="…"` when wsrv-proxied `src` has a direct HTTPS alternate or `opts.fallback` is set (~L89, L95) |
| **Broken image gate** | **Hard FAIL** — Agent B `heuristicImageAudit()` flags `broken/missing image`; lane fail → `speedupBlocked` (`_render_audit_gate.js`). Rubric **#12** + `SCRUBBER_SPEC.md` image law: **13/13 + IMAGE_PASS** only; no broken imgs in production |
| **Enforcement surfaces** | `assets/pulse-tan.css` · `entryImgAttrs()` (~L84–97) · renderer inline `style="width:100%;height:auto;…"` on entry figures |

### onerror fallback swap (mandatory — every `<img>`)

**Render-time only.** Every entry-body `<img>` — product-card figures, section figures, entry-cover (non–Top-10 pillars) — is built by `entryImgAttrs()` in `netlify/functions/pulse-machine-entry.js` (~**L81–97**). Writers and blobs never emit these attributes — the renderer owns them.

| Piece | Source / behavior |
|-------|-------------------|
| **`IMG_ONERROR` constant** (~L81) | `this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}` |
| **Primary `src`** | `resolveEntryAssetUrl()` (~L128–135) — `/assets/…` → `SITE + path`; external HTTPS → `imgProxy()` via `wsrv.nl` (`w=760`, WebP) |
| **`data-fallback`** | Set when primary is wsrv-proxied and a direct HTTPS URL exists (`direct && src !== direct`), or when `opts.fallback` is passed (e.g. `entryCoverFigureHtmlWithFallback()`) |
| **Swap behavior** | On load error: null `onerror` (one retry), read `data-fallback`, if present and ≠ current `src`, set `src` to fallback — typically **wsrv → direct origin URL** or explicit self-hosted alternate |

**Skeleton example — wsrv primary + direct fallback** (external URL proxied at render):

```html
<img src="https://wsrv.nl/?url=example.com%2Fphoto.jpg&amp;w=760&amp;output=webp&amp;q=80&amp;we&amp;n=-1"
     alt="Product illustration"
     width="760" height="460"
     loading="lazy" decoding="async"
     data-fallback="https://example.com/photo.jpg"
     onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&amp;&amp;this.src!==fb){this.src=fb;}">
```

**Skeleton example — self-hosted product image** (`onerror` always present; `data-fallback` only when alternate supplied):

```html
<img src="https://pulserevops.com/assets/qa/aq1158-1.jpg"
     alt="Example Product Alpha"
     width="760" height="460"
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
| **Same body content** | All blob-rendered sections (Direct Answer, ranks, tail) appear on **both** viewports — no `display:none` on prose, headings, figures, or product cards. |
| **Direct Answer gold box** | **`wrapDirectAnswerGold()`** renders `<div class="direct-answer-box">` + `<div class="direct-answer-label">` on **both** mobile and desktop — border `#C8821E`, fill `#FBF3E4`. Mobile type bump @640px in renderer CSS + `pulse-tan.css`. Agent A fails `missing direct-answer-box on live page`. |
| **CRO — two surfaces, one slot** | Cross-ref **§0.1**. Desktop: fixed `#croFixed` / `.cro-ad-root`. Mobile: inline `#croMobCard` / `.cro-mob-card` at same splice index (`afterTop10Item3Card()`). CSS hides one per breakpoint — **not** two cards at once. |
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
| **Blob** | Markdown + text only — no HTML, CRO, gold-box wrapper, product-card HTML, JSON-LD, inline styles. |
| **`escHtml()` + `renderMd()`** | All prose escaped before HTML output — baked blob HTML renders as literal text, not live widgets. |
| **Render-time inject only** | Gold Direct Answer box, `@@PRODUCT` → product cards, CRO (`insertCroAd()`), badges, meta-row, JSON-LD. CRO splices into **already-rendered** HTML (L407–408). |
| **Writer lock** | `_visual_lock_law.js` → `enforceWriterVisualLock()` — prose only; image pipeline swaps at existing `@@PRODUCT` slots only. |

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
| **C** (blob) | Gold template + visual lock; no baked CRO/HTML; no live pollinations |

**Deploy gate:** Agent A + B block deploy via `_render_audit_gate.js`. Agent C blocks batch writes (`templateBlocked`).

### Pre-ship checklist (Top 10)

> **Consolidated into §7 QUALITY GATE** — run the full pre-commit + viewport checklist there before certify. Gold reference for spot-check: [aq1158](https://pulserevops.com/aquariums/aq1158).

---

## 6. IMAGE SOURCING — alternate Pollinations / DDG

**Owner image sourcing law (summary):** Rotate providers by item position (DDG ↔ Pollinations) via `_image_provider_alternate.js` to avoid rate limits. Hero always tries Pollinations first. Every fetch self-hosts through **`storeGradedImage()`** to **`/assets/qa/`** — **no live `pollinations.ai` URLs in blobs**. Global queue enforces **15–20s floor** between provider calls (`FLOOR_MS` / `waitForProvider()`). At render, every `<img>` carries **`entryImgAttrs()` `onerror` provider swap**; **broken image = hard FAIL** (Agent B · gate G).

**Js**

```javascript
// _image_provider_alternate.js — global DDG ↔ Pollinator queue (15s floor)
const FLOOR_MS = parseInt(process.env.IMAGE_PROVIDER_COOLDOWN_MS || '15000', 10);
let lastProvider = null;

function nextAlternateProvider(preferred) {
  if (lastProvider === 'flux') return 'ddg';
  if (lastProvider === 'ddg') return 'flux';
  return preferred === 'ddg' ? 'ddg' : 'flux';
}

async function runProviderJob(provider, fn, label, opts) {
  await waitForProvider(provider, opts);          // max(providerGap, globalGap, FLOOR_MS)
  const result = await fn();
  if (jobOk(result)) lastProvider = provider;   // strict flip — never back-to-back same
  return result;
}

// _ddg_facecard_lib.js — slot seed by item position (Top 10 rank N → slot N)
function slotPrefersFlux(id, slot) {
  return (hashId(String(id) + '|slot|' + String(slot)) % 2) === 0; // even → flux, odd → ddg
}

// Hero / face-card / Top 10 rank #1 lead — Pollinations (flux) always preferred
const HERO_PREFERRED = 'flux'; // ensureAlternateFaceCover · mosaic cover · rank-1 @@PRODUCT img=

async function ensureAlternateSectionImage(id, slot, sectionText, opts) {
  const preferred = (slot === 1) ? HERO_PREFERRED
    : (slotPrefersFlux(id, slot) ? 'flux' : 'ddg');
  const provider = nextAlternateProvider(preferred);
  return runProviderJob(provider, () => storeGradedImage(/* … */), 'alt-sec:' + id + '-' + slot, opts);
}

// pulse-machine-entry.js — every rendered <img> must carry onerror fallback (§7 item 16)
const IMG_ONERROR = "this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}";
function entryImgAttrs(url, alt, opts) {
  const src = resolveEntryAssetUrl(url);
  const fb = opts.fallback || (direct && src !== direct ? direct : '');
  let attrs = ' src="' + src + '" alt="' + alt + '" width="760" height="428" loading="lazy" decoding="async"';
  if (fb) attrs += ' data-fallback="' + fb + '"';
  return attrs + ' onerror="' + IMG_ONERROR + '"';
}
```

**Status: MANDATORY · LOCKED** (owner passcode **4444**, 2026-07-06). Applies to every Top 10 (aq1158) and Q&A (q11133) entry. Cross-ref Q&A section-image law: [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) **§6**.

### Rotate providers by slot index (DDG ↔ Pollinator)

**Goal:** spread load across DDG and Pollinator by **item position / slot index** so one provider never absorbs every generate — avoids rate limits (429/403) and render failures from throttling.

| Step | Law |
|------|-----|
| **Slot preferred** | `slotPrefersFlux(id, slot)` in `_ddg_facecard_lib.js` — `hashId(String(id) + '\|slot\|' + String(slot)) % 2`: **even hash → Pollinator (flux) first**, **odd hash → DDG first** |
| **Hero / face-card / lead** | **`preferred = 'flux'` always** (Pollinations first) — mosaic cover `/assets/qa/{id}.jpg` (`ensureAlternateFaceCover`), entry-cover hero when allowed, Top 10 **rank #1** `@@PRODUCT img=` lead figure. DDG runs only when global alternation flips (`nextAlternateProvider('flux')` returns `'ddg'` because `lastProvider === 'flux'`) |
| **Global flip** | `nextAlternateProvider(preferred)` in `_image_provider_alternate.js` — never back-to-back same provider; honors `preferred` on first job in queue, then strict alternation |
| **Generate path** | `ensureAlternateSectionImage(id, slot, …)` · `ensureAlternateFaceCover()` · `repairBrokenQaImages()` · `fillEntryMissingImages()` · ranking product rebuild (`fillProductImagesSequential`) |

**How rank / section index maps to slot:**

| Template | Slot index | Indexes |
|----------|------------|---------|
| **Top 10 (this template)** | Rank **N** (1–10) | Nth `@@PRODUCT img=` under `## N.` — passed as `slot` to `ensureAlternateSectionImage(id, N, …)`; rank **#1** is also the **lead hero** slot (Pollinations first override) |
| **Q&A** | **1, 2, 3…** (fill order) | 1-based counter in `repairBrokenQaImages` (`slotNum`) and `fillEntryMissingImages` (`fixed + 1`) — **not** the H2 section number |
| **Mosaic face-card** | Hero law | Always Pollinations preferred — not slot-hashed |

Adjacent slots usually flip preferred provider because the slot term changes the hash; combined with the global queue flip, no single provider handles every slot in a batch.

### Provider alternation (global queue)

| Rule | Detail |
|------|--------|
| **Module** | `_image_provider_alternate.js` — `runDdgJob()` / `runFluxAlternateJob()` / `runProviderJob()` |
| **Strict flip** | Never back-to-back same provider — `nextAlternateProvider()` flips from `lastProvider` |
| **Queue** | Global serial turn — one image job at a time; alternation enforced before each generate |
| **Adaptive learner** | `_adaptive_throttle_learner.js` may raise wait on 429/403/throttle — persists `.adaptive_throttle.json`; floor never drops below **15s** (may extend toward **~20s** under throttle) |

### 15–20s floor between provider calls

| Env / constant | Default | Role |
|----------------|---------|------|
| `IMAGE_PROVIDER_COOLDOWN_MS` | **15000** | Global floor (`FLOOR_MS`) — **both** providers; **minimum 15s**, never lower |
| `DDG_THROTTLE_COOLDOWN_MS` / `DDG_DELAY_MS` | ≥15000 | DDG per-provider minimum |
| `FLUX_THROTTLE_COOLDOWN_MS` / `POLLINATOR_FREQ_MS` / `POLLINATOR_MIN_MS` | ≥15000 | Pollinator per-provider minimum |

`waitForProvider()` sleeps until `max(providerGap, globalGap, FLOOR_MS)` elapses since the last successful job. **No burst generates** — every cover, rank product image, repair, and fill slot respects the **15–20s floor** (15s hard minimum; `_adaptive_throttle_learner.js` may raise waits toward ~20s on 429/403/throttle — floor never drops below **15s**). Status: `cooldownLabel()` / `providerStats()` in `_image_provider_alternate.js`.

### JS (code)

Canonical modules (repo root):

| Module | Role | Key exports |
|--------|------|-------------|
| `_image_provider_alternate.js` | DDG ↔ Pollinator alternation + cooldown queue | `runDdgJob()`, `runFluxAlternateJob()`, `runProviderJob()`, `nextAlternateProvider()`, `waitForProvider()`, `canUseProvider()`, `providerStats()`, `cooldownLabel()`, `FLOOR_MS`, `DDG_COOLDOWN_MS`, `FLUX_COOLDOWN_MS`, `auditLivePollinationsInBody()` |
| `_ddg_facecard_lib.js` | Fetch, grade, self-host; slot routing | **`storeGradedImage()`** (sole disk write path), `ensureAlternateFaceCover()`, `ensureAlternateSectionImage()`, `fillEntryMissingImages()`, `repairBrokenQaImages()`, `slotPrefersFlux()`, `coverAltFirst()`, `hashId()`, `heroFaceCardSlot()`, `heroFillQuery()` |

**Rotation by slot** — id + slot hash seeds preferred provider; global alternator enforces strict flip (never back-to-back same provider):

| Function | Module | Behavior |
|----------|--------|----------|
| `hashId(id)` | `_ddg_facecard_lib.js` | Rolling char-code hash for entry/slot seeding |
| `coverAltFirst(id)` | `_ddg_facecard_lib.js` | `hashId(id) % 2 === 0` → `flux` (Pollinator) preferred on first face-card job |
| `slotPrefersFlux(id, slot)` | `_ddg_facecard_lib.js` | `hashId(id + '\|slot\|' + slot) % 2 === 0` → per-section slot seed; used in `ensureAlternateSectionImage()` |
| `nextAlternateProvider(preferred)` | `_image_provider_alternate.js` | Flips from `lastProvider`; honors `preferred` when no prior job |
| `runProviderJob(provider, fn, label, opts)` | `_image_provider_alternate.js` | Serial turn queue → `waitForProvider()` → job → `markProviderDone()` updates `lastProvider` |

**Hero / face-card — Pollinator first** — `_ddg_facecard_lib.js`:

- Mosaic cover default: `ensureAlternateFaceCover()` → `makeFluxFaceCover()` (Pollinator flux via `_pollinator_flux_throttle.js` → `runFluxJob()`)
- Without `opts.alternateSources`: Pollinator only — skips DDG entirely
- When alternation enabled: `coverAltFirst(id)` seeds first provider; `nextAlternateProvider(preferred)` + `runProviderJob()` route face-card jobs
- Hero slot detection in fill/repair: `heroFaceCardSlot(url, id, lineIdx)` + `heroFillQuery(pillar, title)` in `fillEntryMissingImages()` / `repairBrokenQaImages()`

**Env (15s defaults)** — `_image_provider_alternate.js` (`FLOOR_MS`, `DDG_COOLDOWN_MS`, `FLUX_COOLDOWN_MS`):

| Env var | Default | Constant |
|---------|---------|----------|
| `IMAGE_PROVIDER_COOLDOWN_MS` | **15000** | `FLOOR_MS` — global floor, both providers |
| `DDG_DELAY_MS` / `DDG_THROTTLE_COOLDOWN_MS` | **15000** | `DDG_COOLDOWN_MS` |
| `POLLINATOR_FREQ_MS` / `FLUX_THROTTLE_COOLDOWN_MS` / `POLLINATOR_MIN_MS` / `IMAGE_GAP_MS` | **15000** | `FLUX_COOLDOWN_MS` |

Optional adaptive learner: `_adaptive_throttle_learner.js` — may raise wait on throttle; floor never drops below `FLOOR_MS` (persists `.adaptive_throttle.json`).

Cross-ref Q&A paths: [`GOLDEN_TEMPLATE_QA.md`](GOLDEN_TEMPLATE_QA.md) **§6** · `ensureAlternateSectionImage()` for section `![alt](url)` slots.

**Every `<img>` carries the onerror fallback swap shown in the skeleton. A broken image is a hard FAIL in the gate.**

### `storeGradedImage()` — single write choke point

**Every** image file written to disk passes `storeGradedImage()` in `_ddg_facecard_lib.js` — mosaic face-card covers, rank `@@PRODUCT img=` assets, batch staging, dupe swaps. No bypass.

| Step | Law |
|------|-----|
| **Grade from RAW** | `applyCineGrade()` on raw download only — never re-grade an already-stamped file |
| **Resize / crop** | Face-card mosaic: square `760` + `FACE_CARD_FRAMING`; product/section figures: width-capped resize or `1200×675` section tile when applicable |
| **EXIF proof** | `ImageDescription: PULSE_GRADE=v_final` (`GRADE_STAMP`) — verify with `verifyGradeStamp()` |
| **Self-host path** | Write to `/assets/qa/{id}.jpg` (cover) or `/assets/qa/{id}-{slot}.jpg` / pillar pool paths |
| **pHash dedup** | dHash 64-bit on raw buffer before grade; Hamming ≤8 = duplicate; registry `_img_registry.json`; same-page hard-block via `sweepTop10DuplicateImages()` / `countBodyImageDupes()` |

### Self-hosted paths only in blobs

Saved answer bodies **must not** carry live provider URLs.

| Allowed in markdown | Forbidden in markdown |
|---------------------|----------------------|
| `@@PRODUCT img="/assets/qa/…"` | `https://image.pollinations.ai/…` |
| Pillar pool paths (when matched) | `https://pollinations.ai/…` |
| | Any live DDG hotlink |
| | `![…](…)` inside ranked `## N.` sections (use `@@PRODUCT img=` only) |

Gold audit: `live_pollinations_url_in_body` (`auditLivePollinationsInBody()` in `_image_provider_alternate.js`). Pollinator/DDG fetch at generate time only; persisted blob paths are always self-hosted under **`/assets/qa/`** via **`storeGradedImage()`** — no live `pollinations.ai` URLs in blobs.

### onerror provider swap — every `<img>` (render-time)

**Generate-time law** (above): rotate DDG ↔ Pollinator by slot via `_image_provider_alternate.js`; self-host through `storeGradedImage()`. **Render-time law** (below): every live `<img>` must survive a failed primary load.

| Rule | Detail |
|------|--------|
| **Module** | `entryImgAttrs()` in `netlify/functions/pulse-machine-entry.js` (~**L81–97**) — **every** renderer-built `<img>` (product-card figures, section figures, entry-cover on non–Top-10 pillars) |
| **`onerror` swap** | Always appends `onerror="this.onerror=null;var fb=this.getAttribute('data-fallback');if(fb&&this.src!==fb){this.src=fb;}"` — one retry via optional `data-fallback` (typically **wsrv → direct self-hosted `/assets/qa/…` URL**) |
| **Writers forbidden** | Blobs never emit `onerror`, `data-fallback`, or inline image handlers — renderer owns all swap attrs |
| **Broken image = hard FAIL** | Any live `<img>` that 404s, returns non-image content, or stays broken **after** the fallback swap **blocks certify and publish**. Render Agent B (`_render_audit_agent_b.js` → `heuristicImageAudit()` in `_render_audit_lib.js`) HEAD-checks sample URLs; issues matching `broken/missing image` fail the lane → `speedupBlocked` (`_render_audit_gate.js`). Rubric **#12 Images law** + `SCRUBBER_SPEC.md` (`IMAGE_DEAD` / `IMAGE_PLACEHOLDER`): **13/13 + IMAGE_PASS** only |

Cross-ref render sizing + lazy-load: **§5** · gate item **16** below.

### Top 10 — item images (this template)

| Rule | Detail |
|------|--------|
| **Slots** | **`@@PRODUCT img=` optional per rank** — only when image adds information; no `![…](…)` inside `## 1.`–`## N.` |
| **Provider by rank** | Rank **N** → slot **N** for `slotPrefersFlux(id, N)`; rank **#1** is also the **lead hero** slot (Pollinations first) — see **Rotate providers by slot index** above |
| **No top hero** | `cover_src: 'no-hero'` — no leading `![…](…)` before Direct Answer; gold audit: `top_hero_present` |
| **Pipeline only** | Ranking image repair / `_ddg_facecard_lib.js` — swap at **existing** `@@PRODUCT img=` slot; same count, same rhythm |
| **Writers forbidden** | DeepSeek / writers must **not** add, remove, move, or edit `@@PRODUCT` lines or `![alt](url)` markdown |

One `@@PRODUCT img=` per rank block when used — gold audit: `rank{N}_markdown_image`, `rank{N}_duplicate_image`.

### Visual lock (writers vs image pipeline)

Per `.cursor/rules/visual-lock-law.mdc` and `_visual_lock_law.js` → `enforceWriterVisualLock()`:

| Actor | May change | Must NOT change |
|-------|------------|-----------------|
| **Writers / DeepSeek** | Prose, headings, FAQ, Sources, mermaid | `@@PRODUCT`, image markdown, HTML, CRO, layout widgets |
| **Image pipeline** | **Swap** one product image at an existing `@@PRODUCT img=` slot (ranking image repair) | Add slots, stack images, invent URLs |

Render owns display sizing — §5; blobs carry self-hosted paths only.

### 6.1 Pre-certify image checks

> **Consolidated into §7 QUALITY GATE** gates **7** (image sourcing) + **10** (viewport — zero broken images). Spot-check before certify:

| Check | Expectation |
|-------|-------------|
| **Paths** | Every `@@PRODUCT img=` resolves to `/assets/qa/…` or approved pillar pool — no live pollinations |
| **EXIF** | On-disk files carry `PULSE_GRADE=v_final` (`verifyGradeStamp()`) |
| **Rank law** | No markdown images in ranks; no duplicate image markers per rank block |
| **Dupes** | `sweepTop10DuplicateImages()` — zero within-page URL or pHash collisions |
| **Gold audit** | `auditTop10GoldTemplate()` — includes `live_pollinations_url_in_body`, `top_hero_present`, `rank{N}_*` image codes |

Enforcement modules: `_image_provider_alternate.js` · `_ddg_facecard_lib.js` · `_visual_lock_law.js` · `_ranking_top10_gold_template.js`.

---

> **Appendix — image rank law (reference):** Primary law is **§6** and gate **18**. Rank-image rules, forbidden items, and gold audit failure codes below supplement §7 — do not treat as alternate rules.

## Forbidden (without passcode 4444)

- Top hero image before Direct Answer  
- Reordering, skipping, or renaming mandatory sections  
- Second mermaid block outside **How to Choose** (e.g. "At a Glance")  
- `![…](…)` markdown images inside ranked sections  
- Reusing aq1158 copy or product images in other entries  
- Live `pollinations.ai` URLs in published markdown  
- Blank or stub Direct Answer  
- Injecting `@@PRODUCT` / ranking pills into **Q&A-shaped** pages  
- Stacking two images in one rank block  

---

## Gold audit — common failure codes

| Code | Meaning |
|------|---------|
| `rank{N}_markdown_image` | `![…](…)` inside rank section |
| `rank{N}_duplicate_image` | More than one image marker in rank block |
| `rank{N}_product_not_first_line` | `@@PRODUCT` not first non-empty line after heading |
| `rank1_missing_best_overall` | #1 heading missing 🏆 / BEST OVERALL |
| `rank2_missing_best_value` | #2 heading missing 💎 / BEST VALUE |
| `live_pollinations_url_in_body` | Live pollinations URL in blob |
| `direct_answer_blank` | Direct Answer too short or empty |
| `top_hero_present` | Leading `![…](…)` on ranking list |

Audit function: `auditTop10GoldTemplate(body, title, id)` in `_ranking_top10_gold_template.js`.

---

## 7. QUALITY GATE (validate before commit — all must pass)

**Status:** MANDATORY · NON-NEGOTIABLE · HARD GATE  
**When:** Run **before every commit, certify, or publish** — local blob save, batch write, deploy mirror, IndexNow ping.  
**Law hierarchy:** **`GOLDEN_TEMPLATE_TOP10.md` is law.** [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) holds rubric detail — when they conflict on golden-template pages, **this file wins** (word count floor, hero law, shape).  
**Rule:** **All checklist items below must pass.** No publish below gate. No "12/13 close enough." No manual bypass except owner passcode **4444** for immutable shape law only — never for rubric, broken images, or gold audit failures.

### Pass condition

**Pass condition:** All numbered checks below must pass before commit, certify, or publish. Every gate item must be checked ✓ — no partial credit, no "close enough."

| # | Check | Pass condition |
|---|-------|----------------|
| 1 | Template classification locked | `pickGoldTemplate(id, body, title)` called **before** any draft, fix, audit, or publish; `template`, `goldId`, `goldUrl`, `reason` locked for the entire run — **never switch mid-run**. Router returns **`top10`** + `aq1158` or **`qa`** + `q11133` — no hybrids. **N extraction:** `rankCountFromTitle(title)` + `expectedRankCount(body, title)` must match N rank sections (`## 1.`–`## N.`); **default N = 10** for "best of" titles with no explicit number (owner law at classify/seed). `isRankingListBody(body, title)` true for Top 10. |
| 2 | Title | ≤60 chars, contains number + query phrase |
| 3 | Meta description | 120–160 chars, restates promise + differentiator |
| 4 | H1 | Exactly one, matches title intent |
| 5 | Direct answer | ≤50 words, names #1 pick, appears before hero |
| 6 | Hero image | Alt text, width/height attrs, fetchpriority="high", loads (200) |
| 7 | H2 count | == N, each with id="item-{pos}" |
| 8 | Unique data | Every item has ≥1 stat/comparison not on page #1 SERP competitors |
| 9 | Internal links | ≥2 to pulserevops.com pillar pages |
| 10 | Viewport render | 375px and 1440px, zero CLS, zero broken images |
| 11 | Item quality | Every item has a reason + one original data point |
| 12 | ItemList schema | Present, numberOfItems == N, positions 1..N |
| 13 | Word count | ≥800 |
| 14 | Author + dateModified | Visible in body AND in Article schema |
| 15 | Rendering | No fixed px widths, all imgs max-width:100%, no h-scroll at 375px |
| 16 | Image fallbacks | Every img has onerror provider swap; zero broken images |
| 17 | CRO card | Present once: fixed-right on desktop, inline after item #5 on mobile, injected by renderer not answer blob |
| 18 | Closing verdict | ~50 words, repeats #1 pick |

#### Pass ✓

**Pass** = every numbered gate item **1–18** checked ✓ **and** all of the following true:

| Requirement | Gate / item |
|-------------|-------------|
| **Every numbered gate checked** | Numbered items **1–18** all ✓ |
| **Image fallbacks** | **§6** — every `<img>` has `onerror` provider swap; **zero broken images** @375px + @1440px (item **16** · gate **G** · Agent B) |
| **Viewport verified** | Manual §7-G checklist passed at **375px** + **1440px** (item **10**) |
| **Gold audit clean** | `auditTop10GoldTemplate()` → `compliant: true`, `issues: []` (gate **I** · item **20**) |
| **Word count** | **≥800 words** substantive prose (item **13** · gate **H-1**) — **2,000 words NOT required** |
| **No live pollinations** | Blob self-hosted paths only — no `pollinations.ai` URLs (gate **F** · item **18**) |
| **CRO render-only** | CRO injected at render (`insertCroAd()`) — **not** in blob markdown (gate **K**) |
| **Schema present** | Live `<head>` has §3 JSON-LD: **`ItemList`** + **`TechArticle`** + **`BreadcrumbList`** — `numberOfItems == N`, positions **1..N** (item **12** · gate **C**) |
| **Author + dateModified** | **Byline visible near top** — Published/Updated in meta-row below H1; Article schema (`TechArticle`): **`author`**, **`datePublished`**, **`dateModified`** in JSON-LD (item **14** · gate **C** · §2 item **7**) |
| **Rendering rules satisfied** | §5 mobile/desktop parity — real `<img>`, fluid column, DA gold box, no h-scroll @375px (item **15** · gate **E**) |

#### Fail ✗

**Fail** = **any single hard-fail item** — fix surgically, re-run all gates, do not commit:

| Hard fail | Detection |
|-----------|-----------|
| Broken or missing live image | Agent B · gate **G** · item **16** · rubric #12 / `IMAGE_DEAD` |
| Missing onerror provider swap | Item **16** · gate **G** — any rendered `<img>` without `entryImgAttrs()` `onerror` + optional `data-fallback` |
| Missing CRO at render | Agent A · gate **G** — no `#croFixed` / `#croMobCard` at §0.1 slot |
| Gold template audit fail | Agent C · gate **I** — any `auditTop10GoldTemplate()` code |
| Horizontal scroll @375px | Gate **G** · gate **E** · item **15** |
| Missing Direct Answer gold box | Agent A · gate **G** — no `direct-answer-box` wrapper |
| Live pollinations in blob | Gate **F** · item **18** · `live_pollinations_url_in_body` |
| CRO baked in blob | Item **12** · gate **I** · `cro_in_blob` |
| Top hero before Direct Answer | Item **6** · gate **D** · `top_hero_present` |
| Markdown image inside rank | Gate **F** · gate **I** · `rank{N}_markdown_image` |
| Word count below 800 | Item **13** · gate **H-1** |
| Missing or wrong schema | Item **12** · gate **C** — no JSON-LD, `QAPage` on Top 10, or `numberOfItems != N` |
| Missing author or dateModified | Item **14** · gate **C** — no visible meta-row Published/Updated near top or missing Article schema (`TechArticle`) **`author`**, **`datePublished`**, or **`dateModified`** in JSON-LD |

#### Top 10 pass deltas (vs Q&A)

| Gate | Top 10 (this template) |
|------|------------------------|
| **Gold audit** | `auditTop10GoldTemplate()` — N rank sections, `@@PRODUCT` cards, `How We Ranked`, Bottom Line #1 verdict |
| **CRO slot** | After rank **#3** `product-card` desktop; mobile inline after rank **#5** (§0.1) |
| **Schema** | **`ItemList`** + N `ListItem` — **no `QAPage`** |
| **Images** | `@@PRODUCT img=` per rank when used — **no** `![…](…)` inside `## N.` ranks |
| **Shape** | Listicle title with **N** matching rank count; 🏆/💎 badge pills on ranks 1–2 |

> **Not required for §7 Pass condition:** **2,000-word floor** · legacy `WORD_FLOOR=2000` · padding prose to satisfy stale scrubber defaults. **13/13** is enforced via gate **H** / item **20** when that gate is in scope — §7 Pass is **all gates green** (800-word floor + full checklist), not a separate 2,000-word or off-checklist rubric restatement.

#### Validate before commit — all must pass

**Do not commit, certify, or mark the URL done until numbered items **1–18** and the Pass condition table above are all green.** Automated render agents supplement manual viewport QA — they do **not** replace gate **G**. Re-run the full checklist after every surgical fix.

### Gate tier reference (modules)

| Gate tier | Pass condition | Modules |
|-----------|----------------|---------|
| **Classification** | `pickGoldTemplate()` → `template: 'top10'`, `goldId: 'aq1158'` locked **before** draft; never switch mid-run | `_pulse_gold_template_router.js` |
| **13/13 content rubric** | `rubricSignOff(id, body).pass === true` — all 13 criteria green (gate **H** / item **20** only) | `grade-entry.js`, `_scrub_button_server.js`, `_format_fixer_lib.js` |
| **Gold blob audit** | `auditTop10GoldTemplate()` → `compliant: true`, `issues: []` | `_ranking_top10_gold_template.js` · Agent C |
| **IMAGE_PASS** | Self-hosted paths only; `verifyGradeStamp()` on disk; no `IMAGE_DEAD` / `IMAGE_PLACEHOLDER` / `IMAGE_LOWRES` / `IMAGE_STANDARD` flags | `_ddg_facecard_lib.js` · `SCRUBBER_SPEC.md` Pass 2 |
| **CRO / visual lock** | `croCardLawOk()` + `croBlobClean()` — zero baked CRO in blob; writers touched prose only | `_cro_strip_lib.js`, `_visual_lock_law.js` |
| **Render audit (pre-commit blob)** | Agent C green — `templateBlocked === false` | `_render_audit_agent_c.js`, `_render_audit_gate.js` |
| **Render audit (post-deploy live)** | Agent A + B green — `deployBlocked === false`; zero broken live imgs | `_render_audit_agent_a.js`, `_render_audit_agent_b.js` |
| **Viewport (human)** | Live or staged URL passes **375px** + **1440px** checklist **G** below | Manual — supplements agents |

### Numbered checklist — Top 10 ranking list (aq1158)

Run **before commit, certify, or publish.** **All 20 items must pass.**

1. **Template classification locked** — Call `pickGoldTemplate(id, body, title)` in `_pulse_gold_template_router.js` **before** any draft, fix, audit, or publish. Lock `template`, `goldId`, `goldUrl`, and `reason` for the entire run — **never switch template mid-run**. Router returns **`top10`** + `aq1158` (Top 10) or **`qa`** + `q11133` (Q&A essay) — no hybrids. **N extraction:** `rankCountFromTitle(title)` + `expectedRankCount(body, title)` must match N rank sections (`## 1.`–`## N.`); **default N = 10** for "best of" titles with no explicit number (owner law at classify/seed). `isRankingListBody(body, title)` true for Top 10.
2. **`<title>`** — ≤60 chars; exact query phrase + number; renderer clip + ` | Pulse News` ≤65 chars live.
3. **`<meta name="description">`** — 120–160 chars, restates the promise + one differentiator (renderer ≤158 via `descExcerpt()` → `clipMeta()`).
4. **Exactly ONE `<h1>`** — matches title intent (may be longer than title tag); renderer `<h1 class="q">` from `entry.h1 || entry.question`; no competing `# …` H1 in blob.
5. **Direct answer block** — first ≤50 words after H1 names the #1 pick and why. Class: direct-answer. Snippet target. `## Direct Answer` first H2; ≥140 chars, ≥2 sentences with #1/#2 prices; `direct-answer-box` at render only.
6. **No top hero before Direct Answer** — no leading `![…](…)`; `cover_src: 'no-hero'`; gold audit: `top_hero_present` / `unexpected_top_hero`.
7. **N item sections** — Each item is an `<h2>` in `## N. Name` format (`## 1.`–`## N.`; 🏆 #1 BEST OVERALL · 💎 #2 BEST VALUE); **2–4 sentences** each: (a) why it made the list, (b) one original data point / stat / comparison **not found on competing pages**; item images **optional** (`@@PRODUCT img=` only when informative); no `![…](…)` inside ranks.
8. **Tail sections** — How to Choose (one mermaid) → **`## Bottom Line`** mandatory ~50-word **#1 closing verdict** → FAQ → Sources → Related on PULSE — order per `TOP10_SECTION_ORDER`.
9. **Internal links** — **2–3** in-context links to related pulserevops.com pillar pages in body prose — not a "related posts" widget (gate **9** floor: ≥2).
10. **Word count floor** — **≥800 words** substantive prose; never pad; 2,000 **not** required on golden-template pages.
11. **Meta-row byline + dates** — word count + Published / Updated dateline render-time only (`entry.ts`, `entry.polished_at` chains) — not in blob.
12. **CRO swinging card** — render-time only (`insertCroAd()` → `afterTop10Item3Card()`); **never in blob**; **exactly one** per page (`#croFixed` desktop OR `#croMobCard` mobile). Slot: after rank **#3** `product-card` (code); owner mobile target rank **#5** — **§0.1**. Dismiss: **`sessionStorage`** `croX` / `croMobX`.
13. **Schema JSON-LD** — exactly **one** `<script type="application/ld+json">` in `<head>`; `@graph`: **`ItemList`** (`numberOfItems == N`) + **`TechArticle`** (Article node with **`author`**, **`datePublished`**, **`dateModified`**) + **`BreadcrumbList`**; no JSON-LD in blob.
14. **HTML skeleton (§4)** — matches live renderer shape: no top hero; gold DA first in `<div class="body">`; `@@PRODUCT` → product-card at render; CRO/post-body chrome renderer-owned.
15. **Mobile-first rendering (§5)** — single column @375px; content column `max-width:760px; margin-inline:auto; padding-inline:16px`; fluid type; no horizontal scroll @375px; CRO gutter exception only @≥768px (code: 1200px).
16. **Images — lazy-load, onerror, sizing** — real `<img>` tags; `max-width:100%; height:auto`; explicit `width`/`height` via `entryImgAttrs()`; non-hero lazy; every img has **`onerror`** fallback.
17. **Broken image = hard fail** — **zero** broken product-card or section imgs @375px **and** @1440px; Agent B + rubric **#12** / `IMAGE_DEAD`.
18. **Image sourcing (§6)** — DDG ↔ Pollinator alternation; **15s floor**; **`storeGradedImage()`** only (`PULSE_GRADE=v_final`); self-hosted `/assets/qa/…` only — no live `pollinations.ai`.
19. **Blob purity + visual lock** — no baked CRO, gold-box HTML, JSON-LD, or inline styles; writers: prose only — not `@@PRODUCT`/images; `enforceWriterVisualLock()` passed.
20. **13/13 + gold audit + render auditors** — `rubricSignOff()` + `auditTop10GoldTemplate()` green; Agents A/B/C via `_render_audit_gate.js` (or passcode **4444** override documented); **human viewport @375px + @1440px** still required.

**Do not commit or certify below 20/20.**

### Master checklist — detailed breakdown (reference)

#### A. Classification & detection (§1)

- [ ] `pickGoldTemplate(id, body, title)` → `template: 'top10'` before any draft write
- [ ] `isRankingListBody(body, title)` true — ranked `## N.` + `@@PRODUCT` / Best Overall·Value markers
- [ ] **N extraction:** title `Top N` / `Best N` matches N rank sections (`rankCountFromTitle` / `expectedRankCount`)
- [ ] Never force Top 10 on title alone when body is essay Q&A — router locked for run

#### B. Page structure (§2)

- [ ] **`<title>`** — query phrase + number; ≤60 chars (§2 item **1** · gate **2**)
- [ ] **Exactly one `<h1>`** — matches title intent (§2 item **2** · gate **4**)
- [ ] **Direct Answer** — first ≤50 words name #1 + why; `direct-answer-box` at render (§2 item **3** · gate **5**)
- [ ] **Hero image (face card)** — one image immediately after Direct Answer; descriptive alt containing topic; explicit width/height; `fetchpriority="high"`; NO lazy loading; loads (200); no entry-cover hero before DA (§2 item **6** · gate **6**)
- [ ] **Byline + dateModified near top** — `<p class="byline">By Kory White · Updated {dateModified}</p>` render-time below H1; author = **Kory White**, `dateModified` = today at generation time; Article schema (`TechArticle`): **`author`**, **`datePublished`**, **`dateModified`** in JSON-LD (§2 item **7** · gate **14**)
- [ ] **N item sections** — `## 1.`–`## N.`; 🏆/#1 · 💎/#2; 2–4 sentences each (§2 item **8** · gates **7**, **8**, **11**)
- [ ] **CRO Syndicate swinging card** — render-time only; desktop fixed-right swinging; mobile inline after item **#5**; never in blob (§2 item **10** · §0.1 · §C3 · gate **17**)
- [ ] **2–3 internal links** — editorial in-context pillar links in body prose (§2 item **12** · gate **9**)
- [ ] **Closing verdict** — ~50-word #1 repeat in `## Bottom Line` (§2 item **13** · gate **18**)
- [ ] **Tail order** — How We Ranked → ranks → [optional mid-body] → How to Choose → What to Look For → FAQ → Bottom Line → Sources → Related (§2 items **10**, **13**)
- [ ] **Word floor ≥800** — Word floor: 800; ceiling: none, but never pad; 2,000 words is NOT required (§2 item **15** · gate **13**)

#### C. Schema (§3)

- [ ] Exactly **one** `<script type="application/ld+json">` in `<head>` — render-time only
- [ ] `@graph` includes **`ItemList`** + N **`ListItem`** + **`TechArticle`** + **`BreadcrumbList`**
- [ ] No JSON-LD, `@context`, or `@graph` in answer blob

#### D. HTML skeleton compliance (§4)

- [ ] **`noTopHero`** — no `<figure class="entry-cover">` before Direct Answer; gold audit: `top_hero_present`
- [ ] Gold `direct-answer-box` first content in `<div class="body">`
- [ ] `@@PRODUCT` → product-card at render — not baked HTML in blob
- [ ] CRO render-time only — after rank #3 desktop (`afterTop10Item3Card`); inline after rank #5 mobile (§0.1)
- [ ] Single `<h1 class="q">` from index — no `# …` H1 in blob

#### E. Rendering rules (§5)

- [ ] **Mobile-first CSS** — single column default; wider layout / CRO gutter only inside `@media (min-width: 768px)`
- [ ] **Containers** — `.body` / `<article>`: `width:100%; max-width:760px; margin-inline:auto; padding-inline:16px; overflow-wrap:break-word`
- [ ] **Fluid typography** — `body` + `h1` use `clamp()` per §5 (no breakpoint-only font jumps on base copy)
- [ ] Real `<img>` tags — entry figures + mosaic `<img class="mm-img">`; **no** `background-image`-only tiles
- [ ] Global img CSS: `max-width:100%; height:auto`; explicit `width`/`height` via `entryImgAttrs()`
- [ ] Non-hero: `loading="lazy"` `decoding="async"`; lead rank figure may be eager — lazy-load all except hero
- [ ] **No layout tables** — tables for tabular data only; never for page structure
- [ ] Gold DA box + CRO injected at render only — `escHtml()` / `renderMd()` on blob prose
- [ ] No `content-visibility:auto` on entry body figures; mosaic tiles `content-visibility:visible`
- [ ] Desktop + mobile parity — same blob → same HTML structure; CRO is CSS swap only
- [ ] No horizontal scroll on prose column @375px

#### F. Image sourcing (§6)

- [ ] DDG ↔ Pollinator strict alternation — `_image_provider_alternate.js`; **15s floor** between generates
- [ ] Every file through `storeGradedImage()` — grade from RAW, EXIF `PULSE_GRADE=v_final`
- [ ] Self-hosted paths only in blob — `/assets/qa/…`; no live pollinations or DDG hotlinks
- [ ] One `@@PRODUCT img=` per rank when used — no `![…](…)` inside ranked sections
- [ ] pHash dedup — zero within-page URL or near-duplicate collisions
- [ ] Visual lock — writers did not add/remove/move `@@PRODUCT` or image markdown

#### G. Viewport test — 375px + 1440px (mandatory human pass)

Before marking URL **done** or **certified**, verify **live or staged** render at both breakpoints:

| Viewport | Width | How |
|----------|-------|-----|
| **Mobile** | **375px** | DevTools device mode or narrow browser window |
| **Desktop** | **1440px** | DevTools responsive mode or desktop browser |

**Do not mark the URL done until both viewports pass.**

- [ ] **Images visible** — all product-card figures load from self-hosted paths; **zero broken images** (hard FAIL — Agent B + rubric #12 / `IMAGE_DEAD`; every `<img>` must carry `entryImgAttrs()` `onerror` fallback swap on live render)
- [ ] **No horizontal scroll** — prose column fits viewport; no overflow from imgs, mermaid, product cards, or CRO gutter
- [ ] **CRO placement** — desktop: fixed right swinging card; mobile: inline full-width after rank **#5** (§0.1)
- [ ] **Direct Answer gold box** — amber/cream box wraps DA prose only; CRO **not** inside box
- [ ] **No obvious CLS** — explicit `width`/`height` on imgs; stable layout on load
- [ ] **Same content both viewports** — ranks, DA box, product cards visible on mobile and desktop

Gold reference spot-check: [aq1158](https://pulserevops.com/aquariums/aq1158).

#### H. 13/13 content rubric (all criteria green)

Detail: [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) Pass 1. **Owner word-count floor: ≥800 words** (not 2,000 — see Compliance § Word count).

- [ ] **1** Word count — ≥800 words substantive prose
- [ ] **2** Direct Answer at top — `## Direct Answer` first H2
- [ ] **3** Direct Answer complete — ≥140 chars, ≥2 sentences; Best Overall + Best Value + prices; not stub
- [ ] **4** FAQ — ≥5 `**Question?**` pairs
- [ ] **5** Mermaid — exactly 2 diagrams (primary in How to Choose)
- [ ] **6** Mermaid clean — valid syntax; both render
- [ ] **7** Sources — ≥5 real named sources; live URLs
- [ ] **8** Related on PULSE — tail sibling section
- [ ] **9** Clean links — no `#`, TODO, dead links; entry links use `/knowledge/{id}`
- [ ] **10** Hero image — one face-card image immediately after Direct Answer; descriptive alt containing topic; explicit width/height; `fetchpriority="high"`; NO lazy loading; loads (200); no entry-cover hero before DA (`cover_src: 'no-hero'`)
- [ ] **11** Media count — 3–10 images total (N rank `@@PRODUCT img=` when used)
- [ ] **12** Images law — vintage grade, self-hosted, EXIF stamp (§6)
- [ ] **13** No fabrication — real vendors, prices, claims only

**Enforcement:** `entryScrubPipeline` → `gradeEntry()` + `rubricSignOff()` — surgical fix on failing checkpoints only; re-verify gold structure after every edit.

#### I. Gold blob audit — Agent C (pre-commit)

- [ ] `auditTop10GoldTemplate(body, title, id)` → `compliant: true`, zero issues
- [ ] No `cro_in_blob`, `live_pollinations_url_in_body`, `direct_answer_blank`, `top_hero_present`
- [ ] No `rank{N}_markdown_image`, `rank{N}_duplicate_image`, `rank{N}_product_not_first_line`
- [ ] Tail order matches `TOP10_SECTION_ORDER` — no `extra_sections_after_sources`
- [ ] `enforceWriterVisualLock()` passed on last writer pass

See **Gold audit — common failure codes** above for full code list.

#### J. Render audit when deployed (Agents A + B)

| Agent | Checks | Gate |
|-------|--------|------|
| **A** (live layout) | Direct Answer gold box; CRO not inside DA box; layout heuristics | `deployBlocked` |
| **B** (live images) | Zero broken/missing imgs; **`broken/missing image` = hard FAIL**; no pollinations in live HTML | `deployBlocked` + `speedupBlocked` |
| **C** (blob) | Gold template + visual lock; no baked CRO | `templateBlocked` |

Supervisor: `_render_audit_supervisor.js` · Gate: `_render_audit_gate.js` · Status: `_render_audit_status.json`

**Human §7-G viewport pass is still required** even when automated agents are green — catches visual regressions agents miss.

Post-deploy crawl (informational): `_sf_crawl_audit.js`, `_pulse_spider.js` — JSON-LD types, H1 count, meta length.

#### K. Editorial & CRO gates (cross-cutting)

- [ ] **2–3 editorial internal links** in body prose — in-context `/knowledge/{id}` (Compliance § Internal links)
- [ ] **CRO law** — render-time only; exactly one widget per page; `croCardLawOk()` pass
- [ ] **No TL;DR**, no stacked images, no live pollinations in published markdown

### Enforcement path (single pipeline)

```
pickGoldTemplate → generateOne / fixEntry
  → entryScrubPipeline (gradeEntry + rubricSignOff + auditTop10GoldTemplate)
  → IMAGE_PASS (storeGradedImage + validate)
  → Agent C blob audit (templateBlocked)
  → commit / certify ONLY when ALL §7 checks green
  → deploy → Agent A + B (deployBlocked)
  → human viewport @375px + @1440px (§7-G)
```

**No publish below gate. Not 12/13. Ever.**

---

## Pipeline law (summary)

1. **CLASSIFY** → `pickGoldTemplate` → lock `top10` + `aq1158`  
2. **SEED** → load `TOP10_TEMPLATE_OUTLINE`  
3. **GENERATE** → new content into locked shape only (`generateOne` / `fixEntry`)  
4. **SCORE + SURGICAL FIX** → `entryScrubPipeline` + gold audit  
5. **CERTIFY** → **13/13 only** — no publish below 13/13  
6. **QUALITY GATE** → **§7** — all gates green (13/13 + gold audit + IMAGE_PASS + Agent C + viewport @375px + @1440px) before commit/publish  

Process: `.cursor/rules/pipeline-template-law.mdc` · rubric detail: `SCRUBBER_SPEC.md` · **gate checklist: §7 (this file is law)**

---

## Compliance (cross-cutting law)

> **Full spec:** [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) — do not duplicate here. **Pre-commit gate checklist: §7 QUALITY GATE.** This section lists golden-template-relevant editorial/SEO requirements only.

### Word count

**Owner law (this spec wins over legacy scrubber defaults).**

#### Legacy code conflict

| Source | Legacy floor | Status |
|--------|--------------|--------|
| [`SCRUBBER_SPEC.md`](SCRUBBER_SPEC.md) criterion 1 | ≥2,000 words | **Superseded** for golden-template pages |
| `netlify/functions/lib/grade-entry.js` | 2,000 (1,800 ER pillar) | **Superseded** for golden-template pages |
| `_v2_components.js` | `WORD_FLOOR=2000` | **Superseded** for golden-template pages |

For **Top 10** (aq1158) and **Q&A** (q11133) golden-template entries, **`GOLDEN_TEMPLATE_*.md` owner spec wins** until pipeline code is updated.

#### Word count law

> **Gate checkpoint:** §7 **H.1** — ≥800 words required at certify; enforced in 13/13 rubric.

| Rule | Detail |
|------|--------|
| **Floor** | **800 words** minimum substantive prose |
| **Ceiling** | **None** — no upper limit |
| **Never pad** | No filler, repetition, or throat-clearing to hit arbitrary counts |
| **2,000 words is NOT required** | Golden-template pages do **not** require 2,000 words. Explicit override of legacy scrubber default. |

> **Code not yet aligned:** Pipeline scripts may still enforce higher floors until updated. Agents and writers follow **GOLDEN_TEMPLATE law first** — do not pad prose to satisfy stale 2,000-word gates on golden-template entries.

### 13/13 content gate

> **Full pre-commit checklist: §7 QUALITY GATE** (sections H–K). This table is the criterion summary; **all §7 items must pass** before publish.

Every Top 10 entry must pass **both** the shared 13-point rubric **and** `auditTop10GoldTemplate()` before publish.

| # | Criterion (summary) | Top 10 note |
|---|---------------------|-------------|
| 1 | Substantive word count | **Owner: ≥800 words** (see **Word count** above) — not 2,000; legacy `WORD_FLOOR=2000` / `grade-entry.js` superseded for golden-template pages |
| 2–3 | Direct Answer at top, complete | Gold box at render; blob ≥140 chars, ≥2 sentences |
| 4 | FAQ ≥5 pairs | Tail `## FAQ` |
| 5–6 | Exactly 2 mermaid, valid syntax | Top 10: 1 in **How to Choose** (+ rubric may allow 1 for ER) |
| 7 | Sources ≥5, live URLs | `## Sources` |
| 8 | Related on PULSE | Internal link line |
| 9 | Clean links | No `#`, TODO, dead links |
| 10 | Hero image | One face-card image immediately after Direct Answer; descriptive alt containing topic; explicit width/height attrs; fetchpriority="high"; loading eager (NO lazy); loads (200); no entry-cover hero before DA |
| 11 | 3–10 images total | N `@@PRODUCT img=` (10 for Top 10) |
| 12 | Images law | Vintage grade, self-hosted, EXIF stamp; **no broken live images** — Agent B hard FAIL + `IMAGE_DEAD` / `IMAGE_PLACEHOLDER`; every rendered `<img>` carries `entryImgAttrs()` `onerror` fallback swap |
| 13 | No fabrication | Real vendors/prices only |

**Enforcement path:** `entryScrubPipeline` → `gradeEntry()` (`netlify/functions/lib/grade-entry.js`) + `rubricSignOff()` (`_scrub_button_server.js`) + `auditTop10GoldTemplate()`. Surgical fixes touch **failing checkpoints only**. **No publish below 13/13** — not 12/13. Bypass shape law only with owner passcode **4444**.

### Internal links (editorial)

**Requirement:** Weave **2–3 internal links** to related pillar or knowledge pages **in-context** inside body prose — not as a separate "related posts" widget or link farm.

| Rule | Detail |
|------|--------|
| **Count** | **2–3** editorial internal links minimum, spread across body sections (`## Direct Answer`, `## How We Ranked`, rank prose, optional mid-body H2s, FAQ — not all in one block). |
| **Format** | Inline markdown: `[anchor text](/knowledge/{id})` for library entries. Pillar hub/index routes (e.g. `/aquariums/`, `/knowledge/`) are OK when linking to a pillar landing page — not an entry ID. |
| **Clean-links gate** | Entry-to-entry links **must** use `/knowledge/{id}` — `linksClean` in `_v2_components.js` rejects pillar-path entry URLs (e.g. `/aquariums/aq1158`) and `/reviews/` suffixes. Targets must exist in the library index when validated (rubric criterion 9; `SCRUBBER_SPEC.md`). |
| **In-context** | Anchor text must read naturally in the sentence (e.g. "…our [nano reef setup guide](/knowledge/q12345) covers…"). No mid-body bullet list of "Related:" or "See also" links. |
| **Not this** | A separate "Related posts", "More reading", or "See also" widget/block in the body. **Do not** duplicate the tail `## Related on PULSE` section inside prose sections. |

#### Distinction: editorial links vs `## Related on PULSE`

| | **Editorial internal links (this rule)** | **`## Related on PULSE` (rubric #8)** |
|---|------------------------------------------|----------------------------------------|
| **Where** | Woven into body prose (Direct Answer through FAQ) | Tail section after `## Sources` |
| **Purpose** | SEO + reader context while reading | Sibling mesh / library discovery nav |
| **Format** | Inline `[text](url)` in sentences | `## Related on PULSE` heading + bullet list of verified siblings |
| **Who writes** | Author / generator at draft time | May be fixer-injected (`_format_fixer_lib.js`, `_v2_components.js`); gold-fix path may strip/re-add at scrub |
| **Rubric** | Golden-template editorial law (this spec) | Explicit 13/13 criterion 8 (`C.related` in `_v2_components.js`) |

Renderer may also show a companion "Deep dive · related in the library" sibling rail at page tail — that is render-owned nav, not editorial in-body links.

### Page head / SEO meta

| Field | Rule |
|-------|------|
| **`<title>`** | **≤60 characters** (authoring target). Must contain the **exact query phrase + number** (e.g. `Top 10 …`, `Best 7 …`) matching **N** from `rankCountFromTitle` / `expectedRankCount`. See **Document title** below. |
| **`<meta name="description">`** | **120–160 characters.** Restates the promise + one differentiator (e.g. Best Overall pick, price band, ranking year, methodology hook). Render-time via `descExcerpt()` → `clipMeta()`. |
| **`<h1>` (on-page)** | **Exactly one `<h1>` per page.** Matches title/listicle intent (same query/promise as `<title>`, but may be longer than ≤60 char title or ≤65 char render clip). See **On-page H1** below. |

#### Document title (`<title>`)

| Rule | Detail |
|------|--------|
| **Length** | **≤60 characters** at authoring time. Keep the listicle phrase + **N** in the first ~45 chars so a render-time clip + ` \| Pulse News` suffix still shows the query in SERPs. |
| **Query phrase + number** | Title / `question` must **lead with** the detected listicle pattern and **N**: `Top 10 …`, `Top N …`, `Best 10 …`, `Best N …`, `The Best …` (see § Regex — `TITLE_RANKING_PATTERNS`). **N in the title must match N rank sections** (`## 1.`–`## N.` + `@@PRODUCT` cards) from `rankCountFromTitle(title)` / `expectedRankCount(body, title)`. |
| **Examples** | ✓ `Top 10 Nano Reef Tanks in 2027` · ✓ `Best 7 CRM Platforms in 2027` · ✗ `Nano Reef Tanks — Our Picks` (missing `Top 10` / `Best N`) · ✗ `Best CRM Tools` (no **N** when body has 7 ranks) |

**H1 vs `<title>` — two fields, one source string:**

| Surface | Source | Clip? |
|---------|--------|-------|
| **On-page H1** (`<h1 class="q">`) | `entry.h1 \|\| entry.question` | **No** — full title always shown |
| **`<title>`** (browser tab / SERP) | `entry.question` only | **Yes** — renderer builds `shortTitle` at serve time |
| **OG / Twitter title** | `entry.question` (first 70 chars) | Partial — full question, not `shortTitle` |
| **JSON-LD `headline`** | `entry.question` | No |

#### On-page H1 (`<h1 class="q">`)

| Rule | Detail |
|------|--------|
| **Count** | **Exactly one `<h1>`** per rendered page. |
| **Intent** | Matches `<title>` intent — same query/promise (listicle query + **N**). H1 **may be longer** than the ≤60 char authoring target or ≤65 char render-time `<title>` clip. |
| **Source** | Index `entry.question` + optional `entry.h1` — renderer uses `entry.h1 \|\| entry.question`. Optional `h1` overrides on-page heading only; it does **not** feed `<title>`. |
| **Renderer** | `pulse-machine-entry.js` emits a single `<h1 class="q">` from index fields — **must not** duplicate H1 from body markdown. |
| **Body markdown** | **No `# …` H1** in gold blob shape (start at `## Direct Answer`). `renderMd()` strips lone `# …` lines so they never become a second H1. |
| **Forbidden** | Multiple H1s in the DOM; body `# H1` that repeats or **conflicts** with the page H1; writer/fix passes that inject a competing heading. |

**Post-render audit (outside 13/13):** `_pulse_spider.js` → `missing_h1`, `MULTIPLE_H1`; `_sf_crawl_audit.js` → H1 count + text.

- **Author at publish:** set the **title arg** / index **`question`** field to the final listicle query (≤60 chars). Optional **`h1`** override on the index entry changes on-page H1 only — it does **not** feed `<title>`.
- **Blob `# H1`:** if present, must match `question`; renderer **drops** a lone `# …` line when it duplicates the page H1 (`pulse-machine-entry.js` → `renderMd`).
- **`prepareEntryForPublish()`** (`_write_lib.js`) stamps pillar SEO + keyword cluster on the index entry; it does **not** write `<title>` text.

**Render-time vs blob:** `<title>` is **not** stored in the blob or index as its own field. At serve time, `netlify/functions/pulse-machine-entry.js` builds `shortTitle` from `entry.question`: word-boundary clip so total length ≤65 chars including ` \| Pulse News` suffix; ellipsis when truncated. The **full** `question` stays as on-page H1.

**13/13 rubric tie-in:** `<title>` length and listicle phrase are **not** separate rubric checkpoints (`SCRUBBER_SPEC.md` criteria 1–13; `grade-entry.js` has no title-length criterion). They **derive** from fields that **are** gated:

| Rubric / audit | How it feeds `<title>` |
|----------------|------------------------|
| **Gold audit / Top 10 shape** | `rankCountFromTitle` + N rank sections require a title that carries **N** — mismatch fails gold audit before publish. |
| **Criteria 1 — Title (H1)** | Same string as `question`; gold outline expects listicle-intent H1. |
| **Router classify** | `pickGoldTemplate(id, body, title)` uses `titleSuggestsRankingList(title)` — title without `Top N` / `Best N` may mis-route to Q&A. |

**Post-render audit (outside 13/13):** `_sf_crawl_audit.js` flags missing or >65-char `<title>`; `_pulse_spider.js` checks title/H1 parity.

**Render-time vs blob (meta description):** Meta description is **not** stored in the answer blob or index as its own field. At serve time, `netlify/functions/pulse-machine-entry.js` sets head tags from index entry fields + blob body:

1. `const desc = descExcerpt(entry.answer)` — walks the blob for the first substantive prose block (skips headings, rules, code, tables; requires ≥40 chars after markdown strip).
2. `clipMeta(cleaned)` — trims to **≤158 chars** on a word boundary (preemptive cap so crawlers never see >160).
3. Same `desc` is reused for `<meta property="og:description">` and `<meta name="twitter:description">`.

`prepareEntryForPublish()` in `_write_lib.js` stamps pillar SEO + keyword cluster on the index entry; it does **not** write meta description text.

**13/13 rubric tie-in:** Meta description is **not** a separate rubric checkpoint (`SCRUBBER_SPEC.md` criteria 1–13; `grade-entry.js` has no meta-desc criterion). It **derives** from blob content that **is** gated:

| Rubric / audit | How it feeds meta |
|----------------|-------------------|
| **Criteria 2–3** — Direct Answer at top, complete | `descExcerpt()` selects the first real prose block after headings — normally the `## Direct Answer` paragraph. |
| **`direct_answer_blank`** (gold audit) | Blank or stub Direct Answer → weak or missing meta snippet. |

**Authoring law:** Write `## Direct Answer` as snippet-bait: answer the title's promise in the first 1–2 sentences, then add **one concrete differentiator** (Best Overall + price, "How We Ranked" lens, N picks, year) so the rendered meta lands in the **120–160** char band without padding.

**Post-render audit (outside 13/13):** `_sf_crawl_audit.js` and `_pulse_spider.js` flag missing meta, duplicate descriptions, or length >160; renderer clipping at 158 is the primary enforcement.

### Image pipeline

| Rule | Detail |
|------|--------|
| **Choke point** | `storeGradedImage()` in `_ddg_facecard_lib.js` — the **only** function that writes image files. Grades from RAW via `applyCineGrade()`, self-hosts to `/assets/qa/`. |
| **EXIF proof-of-grade** | Every stored file carries `PULSE_GRADE=v_final` in EXIF `ImageDescription`. Verify with `verifyGradeStamp()`. Retroactive sweep: `_grade_stamp_sweep.js`. |
| **pHash dedup** | dHash 64-bit on **raw** download (before grade). Hamming ≤8 = duplicate (`REG_HAMMING`). Registry: `_img_registry.json` via `regAdd()` / `regBlocked()`. Same-page hard-block; cross-pillar max 2 site-wide (see `SCRUBBER_SPEC.md` § Dedupe). |
| **Self-hosted only** | Saved bodies: `/assets/qa/…` or pillar pool paths. **No** live DDG hotlinks. **No** live `pollinations.ai` in blobs (`live_pollinations_url_in_body`). |
| **Provider alternation** | DDG ↔ Pollinator strict flip — `_image_provider_alternate.js`. **15s floor** on both (`IMAGE_PROVIDER_COOLDOWN_MS`; owner may raise to 20s via env). Adaptive learner: `.adaptive_throttle.json`. |
| **Top 10 images** | One `@@PRODUCT img=` per rank — pipeline grades product photos through same choke point. |

### Renderer law (blobs ≠ HTML)

Answer blobs are **markdown + text only**. The server renderer HTML-escapes all prose.

- **`escHtml()` + `renderMd()`** in `netlify/functions/pulse-machine-entry.js` — every paragraph, heading, list item, mermaid source, and table cell passes through HTML escape before output; blob HTML cannot survive as live markup.
- **Never store in blob:** HTML tags, `<aside class="cro-ad">`, inline styles, CRO card markup, gold Direct Answer wrapper, ad widgets, product-card HTML, `/assets/kory-white.jpg` portrait images.
- **Injected at render only:** gold `direct-answer-box`, `@@PRODUCT` → product cards, CRO Syndicate card (`insertCroAd()` → `croAdCard()` / `croMobileCard()` — **after rank #3** on Top 10), badges, Listen button.
- CRO HTML is spliced into **already-rendered** answer HTML — blob HTML would be escaped and render as broken literal text; see **§0.1 Renderer constraint**.

**Gates:** `croBlobClean()` (`_format_fixer_lib.js`), gold audit `cro_in_blob`, scrub `croCardLawOk`, render agents A + C (`_render_audit_gate.js`). Handoff: `_CROSSOVER.md` (CRO strip + blank-DA fixes, 2026-07-06).

### Pulse brand palette (render)

| Token | Hex | Where enforced |
|-------|-----|----------------|
| **Gold** | `#FFB81C` | Pulse News / dark-brand surfaces — `_FABLE_MASTER_SPEC.md`, scrub dashboard (`SCRUBBER_SPEC.md`), `_image_dashboard.html` |
| **Crimson** | `#B91C3F` | Pulse brand crimson (owner palette); dark-theme accents alongside gold |
| **Aubergine bg** | `#1A0710` | Dark Pulse surfaces (dashboard, Pulse News cards) |
| **Entry amber/gold** | `#C8821E` / `#CBA135` | Light editorial entry pages — `assets/pulse-tan.css` (`--amber`, `--gold`), Direct Answer box in `pulse-machine-entry.js` |

Entry pages use the **light tan editorial theme** (`pulse-tan.css`): cream `#ECE3D2` bg, Fraunces headings `#1d1711`, amber links/borders `#C8821E`. Renderer owns all visual chrome — not the blob.

### Visual lock (writing & images)

Per `.cursor/rules/visual-lock-law.mdc` and `_visual_lock_law.js`:

- **DeepSeek / writers:** prose, headings, FAQ, Sources, mermaid code **only**. No `@@PRODUCT`, `![…](…)`, HTML, or CRO.
- **Image pipeline:** **swap only** at existing `@@PRODUCT` slots — same count, same rhythm (`_ddg_facecard_lib.js`, ranking image repair).
- **Enforcement:** `enforceWriterVisualLock()` after every DeepSeek pass (`VISUAL_LOCK_DS_SYSTEM_SNIPPET`).

---

## Code pointers

| Concern | Module |
|---------|--------|
| Gold outline + audit | `_ranking_top10_gold_template.js` — `TOP10_SECTION_ORDER`, `TOP10_TEMPLATE_OUTLINE`, `auditTop10GoldTemplate` |
| Master ranking law | `_ranking_list_master_law.js` — `auditRankingListMaster`, no-hero, CRO slot |
| Rebuild / save gate | `_ranking_list_rebuild_lib.js` — throws on gold audit failure |
| Classify router | `_pulse_gold_template_router.js` — `pickGoldTemplate` |
| Render | `netlify/functions/pulse-machine-entry.js` — gold DA box, product cards, CRO after #3 |
| Document title | `pulse-machine-entry.js` — `shortTitle` from `entry.question`; H1 from `entry.h1 \|\| entry.question` |
| Meta description | `pulse-machine-entry.js` — `descExcerpt()`, `clipMeta()`; feeds `<meta name="description">`, OG, Twitter |
| Visual lock | `_visual_lock_law.js` |
| Image provider | `_image_provider_alternate.js` |
| Cursor rules | `.cursor/rules/listicle-intent-top10.mdc`, `.cursor/rules/ranking-top10-gold-template.mdc`, `.cursor/rules/ranking-list-master-law.mdc`, `.cursor/rules/visual-lock-law.mdc` |
| Render auditors | Agent A (live layout) · Agent B (live images) · Agent C (Cursor blob gold) — `_render_audit_agent_*.js` |

---

## Related docs

- **Q&A gold template:** `GOLDEN_TEMPLATE_QA.md` (reference `q11133`)
- **Scrubber rubric:** `SCRUBBER_SPEC.md`

*Do not edit gold template shape without owner passcode 4444.*
ut owner passcode 4444.*
shape without owner passcode 4444.*
ut owner passcode 4444.*
4.*
ut owner passcode 4444.*
 4444.*
4.*
ut owner passcode 4444.*
