# 🎨 GO-TO IMAGE-GENERATION PLAY — LOCKED (owner 2026-07-09)

**This is the standing image-generation cadence for face-card / topic-tile image jobs.**

## The line-up (in a row, one at a time, 20 seconds apart)
1. **DuckDuckGo** (web image search)
2. **Pollinator** (Pollinations flux — AI generation)
3. **Hugging Face** (FLUX.1-schnell Inference API — AI generation)
4. **Cloudflare** (Workers AI `@cf/black-forest-labs/flux-1-schnell` — AI generation)

- **Concurrent lanes, staggered starts 0s / 20s / 40s / 60s.** Each lane runs STRICTLY **one at a time**; **20-second cadence** per lane (`GP_CADENCE_MS=20000`). Never double a provider, never blast in parallel — slow and steady, in a line.
- Back off further (not faster) only when a provider throttles.

## Standing rules that ride along
- **Dimensions: 760×760 SQUARE**, matching every live topic cover. **Generate NATIVELY at the target size** (Pollinations `width=760&height=760`, HF/CF `768` then minimal grade-crop) — do NOT generate large then downscale.
- **Filter: the locked warm cine-grade pushed VERY BRIGHT + VERY SHARP** (`_gp_grade.js` = single choke point) on EVERY image regardless of source. Ramps brighter/sharper by cook-pass.
- **Cook-loop** (`_gp_cook_loop.js`): while images sit awaiting approval, keep re-grading each FROM RAW toward a sharper/brighter ceiling.
- **Approval gallery** (`_gp_gallery_server.js` :8905): shows only today's new images; ✓/✗ per image; a reviewed image **leaves the screen**; batch-of-10 links via `?batch=N`.
- **Style = look like the main-page topic tiles** (warm cinematic, high quality — ref `assets/qa/aq0001.jpg`). Subject flexible.

## Keys (in Netlify env; pulled into `.env.local`)
`POLLINATOR_API_KEY` (works) · `HUGGINGFACE_API_KEY` (added) · `CLOUDFLARE_API_KEY` (added) · DDG keyless.
- **Cloudflare needs `CLOUDFLARE_ACCOUNT_ID`** — the current token returns no account, so the CF lane no-ops until a valid account-scoped token/ID is supplied. HF Inference can cold-start (503) / rate-limit; the lane self-backs-off. Both stay in the line-up per owner; they fill in as they respond. (Also available in Netlify if ever needed: Replicate, Leonardo, AI Horde, Pexels stock.)

## Runner
`GP_POOL_N=450 node _gp_cartoon_pool_gen.js` (generator) + `node _gp_cook_loop.js` (refiner) + `node _gp_gallery_server.js` (approval). Full spec: `_FACECARD_IMAGE_JOB_SPEC.md`.
