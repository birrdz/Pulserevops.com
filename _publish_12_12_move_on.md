# PUBLISH 12/12 → TURTLE → MOVE ON (locked law)

**Owner mandate — 2026-06-23.** Applies to **`q####`** and **`st####`** only.

## The three steps (never reorder, never block on step 2)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ 1. PUBLISH 12/12│ ──► │ 2. TURTLE (async) │     │ 3. MOVE ON      │
│ Full text live  │     │ DDG adds cover    │     │ Next entry /    │
│ IndexNow + SEO  │     │ later — you wait  │     │ next project    │
└─────────────────┘     │ ZERO minutes here │     └─────────────────┘
                        └──────────────────┘
```

### 1 — Publish 12/12

Ship **full gold-format text** before anything else:

- **q####**: ~1,000–1,200 words, Direct Answer, 2+ Mermaid, FAQ, Sources, no banned phrases
- **st####**: 60-min guide (~1,400–1,700+ words), st213/st0073 shape, time-boxed H2s, scripts, FAQ, Sources
- Blob write + **IndexNow** + SEO stamp
- Stamp **`images_deferred_at`** — cover not required to go live

### 2 — Turtle (do not wait)

**DDG is a slow turtle.** It works alone in the background.

- Run: `node _ddg_turtle_backfill.js` (one entry at a time, deferred-first)
- Or batch: `node _qa_topimg_backfill.js q st`
- **Publish path never calls DDG.** No 2–4 min stall per entry.
- When turtle adds a hero image, it clears `images_deferred_at`.

### 3 — Move on

Immediately start the **next** entry, pillar, or project. Do not poll turtle. Do not block on cover.

---

## Code paths (source of truth)

| File | Role |
|------|------|
| `.cursor/rules/ship-first-q-st.mdc` | Cursor always-on law |
| `pulse-blob-writer.js` | `defer_images` → skip cover, stamp deferred |
| `economy-cro-publish.js` / `_economy_post_lib.js` | Ship-first POST payload |
| `economy-st-publish.js` | ST text-only + deferred stamp |
| `grade-entry.js` | No score cap at 9 when deferred |
| `_ddg_turtle_backfill.js` | Background turtle worker |

## Not this law

Top-10 pillars (`er`, `ca`, `nl`, …) still use **image-pipeline-law** at publish unless owner overrides.

**Coaching (`cg####`)** is also **not** ship-first. It is a **1:1 combo pillar** (Top-10 + operator Q&A). Top-10 `cg####` entries follow Top-10 image law; Q&A `cg####` entries follow `_CG_SPEC.md` — neither defers images like `q####`/`st####`. See `.cursor/rules/coaching-pillar-mix.mdc`.

## Cron note

2-min economy auto-publish cron is **OFF** (2026-06-23). Manual / scripted publish follows this law; turtle cleans images async.
