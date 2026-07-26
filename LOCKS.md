# LOCKS — owner hard rules (do not re-coach)

## CURSOR DRIP — PER URL ORDER (2026-07-26 — FINAL)

**Find one → run all steps → find next.** No timetable. No cooldown.  
White/mangled **strip**: `scripts/white-image-purge-local.js` (no Cursor rewrite).  
Drip prefers fact-check/content first (`DRIP_DEFER_IMAGE_PURGE=1`); still runs step 1/4 if a claimed URL still has bad images.  
**Pillar order:** both drips = **all pillars, smallest → largest** (`DRIP_ORDER=smallest`). Optional lock via `DRIP_PILLAR` / `WHITE_PURGE_PILLAR`.  
White purge must **replace** white/404 covers (never leave a blank/404 face → white page).  
**Live verify before claiming fixed:** after purge, probe the hero URL live; if still 404/white, do **not** email “fixed” / mark done — pin a live `/assets/cro-cover-N.jpg` fallback and clear `face_title_baked`.  
`ensureAlternateFaceCover` → `stampCoverProvenance` can re-point index at `/assets/qa/{id}.jpg` before CDN deploy; purge must force-repatch index after. QA asset deploys are lock-serialized (`/tmp/pulse-qa-deploy.lock`).

| Step | What |
|------|------|
| 1 | **Find** white / blank / mangled / broken / **404** slots (scan all images on the URL) |
| 2 | **Fact-check** (Cerebras OK if cheaper) |
| 3 | **Content fix** from fact-check (**Cursor** rewrite — new writing) |
| 3b | **Mermaid** — fix mangled / errored diagrams anywhere (incl. bottom) |
| 4 | **Replace every bad image** in place with a NEW applicable hosted `/assets/qa` image for that section/topic. If a section would have zero images, put one back. Deploy — never leave white/404. |

**Hard bans:** DeepSeek · Claude / Anthropic API.

Script: `scripts/cursor-drip-local.js`  
Asset write root: `process.cwd()/assets/qa` on cloud (never a fake `C:/…` tree). Deploy via `scripts/lib/deploy-qa-assets.js` (`BLOBS_PAT` = Netlify token).
