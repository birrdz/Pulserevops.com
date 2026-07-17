# ⭐ HANDOFF — SAFE STATE (2026-07-15, ~1:40pm)

Everything below is verified, not claimed. Prod is safe; nothing is mid-break.

## LIVE SITE (prod) — SAFE
- pulserevops.com = **200**, rolled back to last-good deploy **6a5739eb57afec0097aa7ff4** (restore-API).
- Face cards: the OLD ones work; **110 newer entries were missing their static `/assets/qa/<id>.jpg`** so they 404 on prod (pre-existing condition, NOT a new break). The fix is staged on a draft (below), not yet promoted.

## NIGHTLY DEPLOY TASK — DISABLED (do not re-enable blindly)
- `PulseRevOps Nightly Deploy` (Task Scheduler) = **Disabled**. It was set to `--prod --no-build` at 11:55pm = broken + unauthorized. Script `scripts/nightly-deploy.ps1` now fixed to `--build` + secrets park/restore (parses OK). Owner re-enables manually after a verified prod deploy.

## THE IMAGE FIX — STAGED ON A DRAFT, awaiting "GO prod"
- **Root cause:** face cards are STATIC files at `assets/qa/<id>.jpg` (48,838 exist). 110 newer entries never got baked → a deploy-from-local drops them → 404. NOT a blob-reader bug.
- **NEW LAW:** `LOCKS.md` → STATIC_IMAGE_LAW (images = baked static files, blobs = data only, no runtime image function).
- **Baker:** `_bake_static_facecards.js` — baked all **110 missing (110/110, 0 failed)**; receipts in `sim/baker/receipts.md`. Serial, resume-safe.
- **Draft deploy (--build):** `https://6a57c47e1ba93e28c14e32f5--pulserevops.netlify.app` — **14/14 face-card assets 200, rendered-DOM real photos, zero 404s, zero SVG fallbacks.**
- **TO FINISH:** eyeball the draft → promote deploy `6a57c47e1ba93e28c14e32f5` to prod via restore-API → re-verify prod on rendered DOM. Note: gp532/533/534 share the pillar topic image (they were `topic-interim`, never had unique photos) — real per-entry photos are the (locked) image lane's job.

## DEPLOY METHOD (the fix for the recurring --no-build 404s)
- Deploy with **`--build`** (bundles functions), NEVER `--no-build`. Script: `_do_deploy_draft_build.sh` (parks .env/.env.local, DRAFT only, restore-API promote separately). Old `_do_deploy_draft.sh` uses --no-build (broken).

## RUNNING NOW
- 🌱 Groundskeeper `groundskeeper.js` @ **8917** — honest fixer, walking all 35,829, counters climb only on real receipts (`sim/groundskeeper/ledger.md`). Pauses honestly if Max usage runs out. Scrubs API key at boot (Max-only). Gate on 8899 (kill the Spider if it re-grabs the port, then Fix-Gate).
- Image lane + finisher daemon = LOCKED until the render-path/prod image deploy lands.
