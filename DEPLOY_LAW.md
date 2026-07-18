# ???? DEPLOY_LAW.md ??? PERMANENT DEPLOY LAW (all machines) ??? 2026-07-11

Canonical source of truth. Referenced by every machine spec + `CLAUDE.md` + `sim/LESSONS.md`.
Purpose: kill the ~$200/mo Netlify burn by deploying rarely ??? content is deploy-free; code ships at most once a day.

## THE LAW

1. **Classify every change BEFORE shipping.**
   - **CONTENT / DATA** ??? new or edited entries, answer bodies, images, quality scores, index rows, blob writes ??? **write to Blobs only. NEVER deploy for content.** Content goes live the moment it's written.
   - **CODE / TEMPLATE / ASSET** ??? a function, the renderer, any `.js`/`.css`/static file, `netlify.toml`/redirect/route change ??? **queue it for the daily deploy** (add a line to the QUEUE below).

2. **Production deploys (`--prod`) happen at most ONCE per day** ??? at the **end of the last machine run of the day**, and **only if the code queue is non-empty.** No queued code changes = **no deploy that day.**

3. **Draft deploys are FREE** ??? `netlify deploy` (WITHOUT `--prod`) costs nothing. Use them freely to test code before the daily prod promote.

4. **Never misclassify code as content to dodge a deploy.** Classify honestly. If it changes what the code/renderer/asset does, it's CODE and it waits for the daily deploy.

5. **Exception ??? operator override:** Kory can say **"deploy now"** for an urgent fix; that bypasses the once-a-day rule.

6. **Log every deploy** in the DEPLOY LOG below (date ?? what shipped ?? draft or prod). Track the monthly deploy count vs the old burn rate for the 2-week credit-meter watch.

---

## AUTOMATION ??? Windows Scheduled Task (registered 2026-07-11)

- Task **`PulseDailyDeploy`** runs **`node daily_deploy.js`** **daily at 9:00 AM** (first run **Sun 2026-07-12**).
- Detects real DEPLOYABLE changes (`assets/` ?? `netlify/functions/` ?? `js/` ?? `*.html` ?? `*.css` ?? `netlify.toml` ?? `_redirects`) **plus** any manual lines in the CODE DEPLOY QUEUE below.
- **Empty ??? emails "SKIPPED ??? no code changes", does nothing.**
- **Non-empty ???** sync changed files into `pulse-deploy-clean` ??? **draft deploy ??? verify draft 200 ??? promote via restore-API** (never blind `--prod`) ??? emails **"SHIPPED"** with the file list, appends the DEPLOY LOG, clears the queue. Any failure ??? emails **"FAILED"**, leaves the queue for retry.
- Emails ??? koryjordanwhite@gmail.com (Resend). Log: `daily_deploy.log`.
- **On-demand:** run `node daily_deploy.js` anytime (owner-run) for the same flow.
- Manage: `schtasks /Query /TN PulseDailyDeploy` ?? pause: `schtasks /Change /TN PulseDailyDeploy /DISABLE`.

## CODE DEPLOY QUEUE (things waiting for the next daily deploy)
_Add a line when you make a CODE/TEMPLATE/ASSET change; clear it when it ships._

- (empty)

---

## DEPLOY LOG (append one line per deploy ??? for monthly count vs burn-rate tracking)

| Date | Type | What shipped |
|------|------|--------------|
| 2026-07-17 | prod | **OWNER INLINE TITLE EDIT** netlify/functions/pulse-title-edit.js (NEW, secret-gated title/dressing save) + js/pulse-edit.js (NEW, long-press-5s edit on homepage tiles, unlock via `?edit=SECRET`) + index.html (loads pulse-edit.js). Secret in private blob `config/edit_secret`. Clean-mirror draft→verify(home+q11133+sw115 200 · wrong-secret 403 · right-secret+fake-id 404)→restore promote (deploy 6a5b23bf). Owner edits real Q&A titles from the live homepage; visitors rejected server-side. |
| 2026-07-17 | prod | **VERSIONED FACE FIX** netlify/functions/pulse-machine-entry.js — hero now prefers idxEntry.img when it is a versioned `/assets/qa/<id>-v<ts>.jpg` path (else the old constructed faceCard; fully backward-compatible, unversioned entries unchanged). Fixes "sealed image never changes / old baked-title image keeps coming back": each seal writes a NEW filename (publish_core.publishFaceOnly → `qa-bin/<id>-v<ts>.jpg` + `_index.json` img update) so the URL is never shadowed by a stale baked static and never hit by the function's 1-yr immutable cache. Renderer-only isolated ship via clean-mirror draft→verify(home+q11133+sw115+wl119+qa img all 200)→restore-API promote (deploy 6a5aa78f). Live proof: versioned qa path serves fresh from blob, byte-match. Powers the Advertising Card tool (_ad_card.js :7700). |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, revenue-checkup-request.html, js/cro-card.js.gold.bak |
| 2026-07-17 | prod | **RENDER FIX** netlify/functions/pulse-machine-entry.js (07-16 version) — bbImages opt-in so Block Builder entries render their 6 body images (was stripped by ANSWER_CONTENT_IMAGES_OFF); + hot-pink block-builder border, bigger H1, brighter share buttons, darker card bg, male TTS voice. draft→verified sc512 body images render (0→13)→restore-API promote. Fixes "only face card shows" bug. |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, revenue-checkup-request.html, js/cro-card.js.gold.bak |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, revenue-checkup-request.html, js/cro-card.js.gold.bak |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, revenue-checkup-request.html, js/cro-card.js.gold.bak |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, revenue-checkup-request.html, js/cro-card.js.gold.bak |
| 2026-07-17 | prod | css/pulse-jet-sides.css, css/pulse-mosaic.css, css/pulse-squares.css, index.html, js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, js/pulse-squares.js, js/cro-card.js.gold.bak, css/pulse-mosaic.css (+ mosaic gap=0 / no black strips),  js/pulse-home-mosaic.js, js/pulse-mosaic-endless.js, index.html, netlify/functions/pulse-machine-entry.js ? Q&A face-card double-title fix, Branding: **Pulse - Value Added** (index/search/knowledge/manifest/entry og:site_name) + new pulse-og.png/jpg + pulse-news-logo.png (Pulse News look, no domain baked in), Recents max-out: index.html RECENT_POOL=1000 + js/pulse-home-mosaic.js /recent pool=1000 + dual-surface Recents+pillar (_stamp_title_face.js), Answer pages: remove bottom pillar mosaic tiles + random More-from-library; indexing via new square cards TBD (netlify/functions/pulse-machine-entry.js), Pillar shuffle: 1 card/row every 15s (index.html + js/pulse-squares.js), Live QA images (no per-image deploy): netlify/functions/pulse-qa-asset.js + netlify.toml `/assets/qa/*` ? blob serve; `_live_qa_asset.js` put path (rotator + stamp) |
| 2026-07-13 | prod | **ST+BS+IK+RA faces/sq + search box** ? draft?promote `6a54d2350885fb2b0cf5645f` ? Recents-first index ? |
| 2026-07-12 | prod | **PILLAR REV ARCH FACE/TOPS** ? `assets/qa/ra*.jpg` + `.sq.jpg` (573) ? draft?promote `6a545f2f572ef8889ed44bf8` ? 148 fn ? Recent verified |
| 2026-07-11 | prod | assets/kory-white.jpg, assets/topics/ai-infrastructure.jpg, assets/topics/aquariums.jpg, assets/topics/boats.jpg, assets/topics/buildouts.jpg, assets/topics/cars.jpg, assets/topics/clubs.jpg, assets/topics/coaching.jpg, assets/topics/collectibles.jpg, assets/topics/contracts.jpg, assets/topics/current-events.jpg, assets/topics/dining.jpg, assets/topics/drills.jpg, assets/topics/electronic-reviews.jpg, assets/topics/estates.jpg, assets/topics/events.jpg, assets/topics/franchises.jpg, assets/topics/gaming.jpg, assets/topics/go-to-market-playbooks.jpg, assets/topics/graphics.jpg, assets/topics/highschool-football-recruiting.jpg, assets/topics/industry-kpis.jpg, assets/topics/living.jpg, assets/topics/media.jpg, assets/topics/movies.jpg, assets/topics/nightlife.jpg, assets/topics/pets.jpg, assets/topics/resorts.jpg, assets/topics/revenue-architecture.jpg, assets/topics/sales-book-summaries.jpg, assets/topics/sales-trainings.jpg, assets/topics/software.jpg, assets/topics/speeches.jpg, assets/topics/sports.jpg, assets/topics/style.jpg, assets/topics/tech-stacks.jpg, assets/topics/telco.jpg, assets/topics/tools.jpg, assets/topics/towns.jpg, assets/topics/travel.jpg, assets/topics/wellness.jpg, index.html, js/pillar-mosaic-instant.js, js/pulse-face-img.js, js/pulse-home-mosaic.js, netlify/functions/lib/anthropic-models.js, netlify/functions/lib/vs-expert-verify.js, netlify/functions/pulse-machine-entry.js, (things waiting for the next daily deploy) |
| _(none yet ??? first deploy under this law)_ | | |

## ???? INCIDENT 2026-07-11 ??? daily_deploy shipped STALE functions ??? full outage ??? rolled back
- `daily_deploy.js` synced git-changed files into pulse-deploy-clean INCLUDING `netlify/functions/pulse-machine-entry.js` (the renderer). The LOCAL copy was STALER/broken vs live ??? the deploy 404`d EVERY rendered page (homepage static = 200, all entries/tools = 404).
- Recovery: `node rollback.js` restored deploy 6a51bea709a90ed9087f3eee (verified sw115 -> 200). Site back.
- `PulseDailyDeploy` scheduled task **DISABLED** (would have re-broken the site Sunday 9AM).
- ???? FIX BEFORE RE-ENABLING: daily_deploy must deploy **STATIC ASSETS ONLY** (assets/ js/ *.html *.css) and NEVER ship `netlify/functions/` unless the local functions are confirmed = or newer than live (pull live functions into pulse-deploy-clean first). The ~40 topic-image changes are NOT live (rolled back with the bad deploy) ??? re-ship them assets-only once the machine is fixed.

- 2026-07-15T18:01:41Z · PROD PROMOTE (owner typed GO prod) · deploy 6a57c47e1ba93e28c14e32f5 via restore-API · 110 baked static face cards · 14/14 verified real photos on rendered DOM · fixes render-path 404s
