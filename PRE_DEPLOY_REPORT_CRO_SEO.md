# PRE-DEPLOY REPORT — CRO/SEO money-page batch

**Date:** 2026-07-12 (cloud check-in recovery)  
**Scope:** Staged CRO/SEO max-out from `_HANDOFF_NEXT_CLAUDE.md` §2026-07-08-C (not a full image-run deploy)  
**Site:** `a2b74b30-a1ac-40e2-9622-aebfc2feb482` · https://pulserevops.com  
**Gate source:** `CLAUDE_CODE_PEXELS_IMAGE_RUN.md` §PRE-DEPLOY VERIFICATION PASS (adapted to money-page/static scope)

## Verdict

**Code is on `main` and ready. Live site has NOT received the money-page/sitemap batch.**  
**Deploy itself is BLOCKED in this cloud pod** — no `.env.local` / `NETLIFY_AUTH_TOKEN` (Netlify CLI: Not logged in; API 401).

Finish line (local Windows box with token, standing 4444):

```bash
# From C:\Users\koryj\website — draft first, NEVER blind --prod
bash _do_deploy_draft.sh
# Verify draft URL: /hire title, utm_campaign=hire-page, /sitemap.xml urls, /about canonical
# Then promote:
#   _promote_deploy.ps1 -DeployId <id>
```

## Live vs staged (proof deploy still needed)

| Check | Local (git main) | Live pulserevops.com |
|-------|------------------|----------------------|
| `/hire` title | `Hire a Fractional CRO — Kory White \| Pulse RevOps` | `Hire a CRO — Kory White · Pulse News` (**STAGED-ONLY**) |
| `utm_campaign=hire-page` | present | **absent** |
| `ProfessionalService` JSON-LD on hire | present | **absent** |
| `/about` canonical | `https://pulserevops.com/about` | `…/about.html` (**STAGED-ONLY**) |
| sitemap `/hire` `/about` `/contact` `/revenue-architecture` | present | **absent** |
| Entry `cro-bar` → Hire a Fractional CRO | present | **already live** (prior renderer deploy) |

## 10-item gate (CRO/SEO scope)

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | Golden validator on touched pillars | **N/A / SKIP** | This batch is static money pages + sitemap (+ grader fix already in git). No pillar blob rewrite in the pending static set. gm0030 blob already live per handoff. |
| 2 | Zero remote image hosts (pexels/pixabay/DDG/pollinations hotlinks) in money pages | **PASS** | Grep clean on hire/fractional-cro/kory-white-maryland/about/contact/revenue-architecture/sitemap. |
| 3 | EXIF `PULSE_GRADE=v_final` on referenced images | **N/A / SKIP** | No image-pipeline files in this money-page deploy set. |
| 4 | Pollinations fallthrough % per pillar | **N/A / SKIP** | Image run not part of this ship set. |
| 5 | Visual sample 20 pages/pillar | **N/A / SKIP** | Not an image-run deploy. Spot-check after draft: `/hire`, `/fractional-cro`, `/about`, `/contact`, one entry cro-bar. |
| 6 | CRO Syndicate widget / cro-bar | **PASS** | `pulse-machine-entry.js` has cro-bar + `pulse-lead-track.js`; cro-bar already confirmed on live aq1158. |
| 7 | `http://localhost` in staged ship set | **PASS** | Zero matches in money pages + renderer + sitemap. (Known unicorn `localhost:8899` exception is owner portal — not in this ship set.) |
| 8 | No mv/hf modifications | **PASS** | Working tree clean; no mv/hf paths dirty. |
| 9 | Local syntax / build sanity | **PARTIAL PASS** | `node --check netlify/functions/pulse-machine-entry.js` OK. Full Netlify build not runnable here (no auth / Windows park path). Last `_dn_deploy_log.txt` ended with **Error while running build** on a prior Windows attempt — prefer `_do_deploy_draft.sh` (`--no-build`) then verify function count before promote. |
| 10 | This report | **PASS** | Written. |

**Ship gate for THIS batch:** items 2, 6, 7, 8 pass; 1/3/4/5 N/A; 9 partial (draft `--no-build` path recommended). **Overall: CLEAR TO DRAFT-DEPLOY from machine with token.**

## Files to ship (already on `origin/main`)

- `hire.html`
- `fractional-cro.html`
- `kory-white-maryland.html`
- `revenue-architecture.html`
- `about.html`
- `contact.html`
- `sitemap.xml`
- Related later commits on same pages (rebrand / funnel) already in main — deploy current tree tip `cf718af` (or newer), not the single 7aab1b3 commit alone.

## Blockers (this cloud agent)

1. **No `NETLIFY_AUTH_TOKEN`** — cannot draft or promote from this environment.
2. Stale `_render_audit_status.json` still has `deployBlocked: true` (2026-07-06; aq1160 misclassified as Top 10). `_do_deploy_now.js` will refuse; use draft script + restore promote, or refresh auditors first.
3. `_all_flux_daily_deploy_stop.flag` is present — daily face-card deploy halted (unrelated to this money-page ship).

## Next action (one step)

On `C:\Users\koryj\website` with `.env.local` present: run `bash _do_deploy_draft.sh` → verify draft `/hire` + sitemap → `_promote_deploy.ps1 -DeployId <id>`.
