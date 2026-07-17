# ⭐ CROSSOVER FOR CURSOR — 2026-07-14 (EVENING UPDATE)
**Read `_SESSION_LOG_2026-07-14_images.md` first.** Cursor cloud agents can't reach localhost/run the
machines — your lane is CODE + DEPLOY reasoning. Tonight the image dig hit bottom (layers 5-7): contract
binding, query relevance, and env-key-in-run-context all fixed; demo 3/3 relevant. **Render-path deploy
HELD** — a root deploy would expose `.env.local` secrets (`.netlifyignore` doesn't list it) and
`pulse-deploy-clean` is stale. Safe path in the session log. Finisher daemon spec = `_IMAGE_FINISHER_SPEC.md`
(build AFTER deploy + eyeball). Image lanes PAUSED until then.

---

# ⭐ CROSSOVER FOR CURSOR — 2026-07-14

**READ THIS FIRST — Cursor ≠ Claude Code environment.** The fixer + daily driver run as **local Node processes on Kory's Windows machine** (`fixer_panel.js` @ http://localhost:8905, gate `_scrub_button_server.js` @ 8899, `sim_transform.js`, `gen_daemon.js`). Cursor's cloud agents **cannot reach localhost, cannot start those servers, cannot run the live panels.** So your lane = **CODE + DEPLOY reasoning + reviewing the render-path fix**, NOT operating the machine. Kory (or Claude Code locally) presses the buttons.

## 🚨 #1 PRIORITY — RENDER-PATH GHOST FIX (baked-title / old-image bug)
**Root cause (proven, LAW-DOM — see `sim/LESSONS.md` 2026-07-14 row):** the fixer/DD write clean Pexels images to Netlify blob store `qa-bin/<id>.jpg` (confirmed: hf0037.jpg = 264KB, 1365 keys) — but the LIVE page never reads them:
- Template hero = a **constructed path** `/assets/qa/<id>.jpg` (`netlify/functions/pulse-machine-entry.js:1051/1067`) — it ignores blob.img / _index.json / any pool.
- `netlify.toml` serves `/assets/qa/*` **static-first** → stale deployed baked-title files win.
- The blob reader function `pulse-qa-asset` returns **404 live** → blob never served → falls to `pulse-og.svg`.
- The `<h1>` title is CORRECT; the "old title" is **baked into the .jpg file itself**.
**NEVER re-patch the image picker** (CLAUDE.md LAW-DOM). It's the read path.

**DEPLOY ACTION ITEMS (Fable's decisions — one prod deploy per DEPLOY_LAW):**
1. `netlify.toml` `/assets/qa/*` = **force=false** (already reverted in code). **PURGE the stale baked static `/assets/qa/*.jpg`** (ship clean local statics or delete) so the static CDN serves clean first, function only on miss. Do NOT use force=true (per-visitor function-compute cost bomb).
2. **Set `SITE_ID` + `BLOBS_PAT` as Netlify FUNCTION env vars BEFORE deploying** — a deploy without runtime blob access is just a live 404 with extra steps. Then deploy `pulse-machine-entry.js` (single-source 1d change), `pulse-qa-asset.js` (Cache-Control `public, max-age=31536000, immutable` — done in code), `netlify.toml`. **Post-deploy: curl one `qa-bin` asset to verify, DOM-check one entry, THEN open the image lane.**
3. Writer = ONE path: `putQaAsset` → blob `qa-bin/`. `ensureDdFixerImages` + `stampTitleFaceTop` route through it. (Full single-function consolidation = future cleanup, not mid-fix.)
4. Two-tier gate (sw115 precedent): content gate hard-fail always; the 1e DOM image check hard-fails ONLY when an image was applied that run; `images_pending` entries pass content-only.

## KEY FILES
- `netlify/functions/pulse-machine-entry.js` — answer-page renderer (hero single-source fix @ ~1067)
- `netlify/functions/pulse-qa-asset.js` — blob image reader (Cache-Control immutable)
- `_live_qa_asset.js` — `putQaAsset` (the ONE writer, blob key `qa-bin/`)
- `netlify.toml` — `/assets/qa/*` redirect (force=false)
- `_dd_fixer_images.js` / `_stamp_title_face.js` / `_image_provider_rotate.js` — Pexels-only image apply (route through putQaAsset)
- `sim_transform.js` — fixer engine (image step honors `IMAGE_APPLY_PAUSED=1`)
- `gen_daemon.js` — daily driver (Claude Code writer, template-locked titles, subsections)
- `CLAUDE.md` — LAW-DOM + IMAGE ACQUISITION CONTRACT + DEPLOY LAW
- `sim/LESSONS.md` — full post-mortems
- `_FIXER_PANEL_SPEC.md` — the panel build spec

## WAVE PLAN
Wave 1 = **GENERAL** (25,226) content-only NOW (`IMAGE_APPLY_PAUSED=1`, stamps `images_pending`). Wave 2 = **TOP_LIST** (9,429) only after the render-path deploy is DOM-verified on a 3-entry top-10 test batch.

## GIT
Repo `github.com/birrdz/Pulserevops.com`, branch `claude/fix-it-all-handoff`. ~565 uncommitted (this session not pushed yet). Full CC-oriented detail: `_HANDOFF_NEXT_CLAUDE.md` (top section).
