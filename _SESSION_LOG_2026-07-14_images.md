# 📓 SESSION LOG — 2026-07-14 — The image-relevance close-out (layers 5–7)

This is the session that reached the **bottom of the 10-day image dig**. Read `_IMAGE_FINISHER_SPEC.md`
alongside this. Machines (fixer + daily driver) ran text-only the whole session; image lanes stay
PAUSED (`IMAGE_APPLY_PAUSED=1`) on both until the render-path deploy lands + one live DOM check passes.

## THE STACK — it was never one bug. Seven layers, each hid the next:
1. Baked pixels (old title burned into the .jpg)
2. Stale deployed statics winning over fresh blobs
3. "Wrong surface verified" — fixes confirmed on a surface the machine chose, not the live one
4. Dead render path — `/assets/qa/*` 404s live → falls to `pulse-og.svg` (the logo)
5. Template contract ignoring type — Q&A entries filled as top10, 0 body images
6. **Query relevance** — subject noun sliced out of the query window
7. **Env key not loaded** in the run context — live Pexels search never fired

## WHAT WAS FIXED THIS SESSION (code, committed-pending)
### Layer 5 — contract binding (DONE, verified)
- `_dd_fixer_images.js` `ensureDdFixerImages`: added `opts.templateType`/`typeHint` — the caller's
  RECORDED type WINS, never auto-detect. GENERAL=hero+2, TOP_LIST=hero+10.
- `sim_transform.js` (fixer) + `gen_daemon.js` (daily driver) now classify by the panel's `typeOf`
  regex and pass `templateType`. Result: tl0003 went top10/0-body → qa/3-images.

### Layer 6 — query relevance (DONE, verified 3/3)
- Root cause: `netlify/functions/lib/derive-image-search-query.js` kept price/measure/filler words
  and took the FIRST 4 tokens. "200-gallon reef tank cost" → "true cost 200 gallon" → gas pump.
  "trade show booth cost" → "much custom trade show" (booth sliced off) → random car.
- Fix: expanded STOPWORDS with price/quantity/unit/filler words (cost, much, true, gallon, custom,
  setup, fees, destination, units, etc.) + strip bare numbers. Subject nouns now survive.
- Verified: `trade show booth`, `acrylic reef tank`, `toyota camry le` — all correct.

### Layer 7 — env key in run context (DONE)
- The pipeline correctly REQUIRES `PEXELS_API_KEY` (`_image_provider_rotate.js` throws without it).
- Demo runs must export BOTH `BLOBS_PAT` and `PEXELS_API_KEY` (they live in `.env.local`; note the
  file has a UTF-8 BOM that breaks `source` — extract keys with grep/cut instead).
- **The finisher daemon MUST load PEXELS_API_KEY in its env**, or every bank-miss falls to a random
  generic bank image instead of a real search. Add to its launcher.

## THE 3/3 DEMO (controlled, owner-eyeballed)
Applied contract-bound + relevance-fixed face cards to 3 live entries, downloaded for review:
- **ev109** (trade show booth): RAV4 → **exhibition hall of booths** ✅
- **ca1106** (Toyota Camry): **black Camry** ✅ (right all along)
- **aq1171** (200-gal reef tank): gas pump → **coral reef aquarium** ✅
Files in `~/Downloads/1_ev109… 2_ca1106… 3_aq1171…`. Clickable comparison artifact published.

## 🚧 THE DEPLOY — WHY IT'S HELD (read before you touch it)
The render-path fix is in 4 files, READY: `netlify/functions/pulse-machine-entry.js` (hero single-
source), `netlify/functions/pulse-qa-asset.js` (Cache-Control immutable), `netlify.toml`
(`/assets/qa/*` → pulse-qa-asset), `netlify/functions/lib/derive-image-search-query.js`.
**Two landmines make a blind prod promote UNSAFE — do NOT `--prod` blind:**
1. **SECRET EXPOSURE**: no `publish` dir set in `netlify.toml` → defaults to repo ROOT. `.netlifyignore`
   does **NOT** exclude `.env.local` (BLOBS_PAT, NETLIFY_AUTH_TOKEN, PEXELS_API_KEY, resendapikey).
   A root deploy would publish secrets at `pulserevops.com/.env.local`. **FIX FIRST**: add
   `.env.local`, `.env`, `.env.*`, `_tmp_*`, `_ra_topic_stage/`, `node_modules/` to `.netlifyignore`.
2. **STALE ARTIFACT**: the established scripts (`_tmp_predraft_promote.js`, `_promote_deploy.ps1`)
   deploy from `C:/Users/koryj/pulse-deploy-clean`, which is flagged DANGEROUSLY stale (missing pages,
   old functions — it even keeps its OWN old `pulse-machine-entry.js`). Promoting it regresses content.

**SAFE DEPLOY PATH (recommended, for tomorrow with eyes on it):**
- Harden `.netlifyignore` (secrets) → DRAFT deploy from website root (`npx netlify-cli@latest deploy
  --dir=. --json --no-build`, NO `--prod`) → get the draft URL → **eyeball it**: fetch
  `<draft>/assets/qa/<id>.jpg` (must be 200 image/jpeg, NOT 404) and open one entry page (real photo,
  no SVG logo) → only then `_promote_deploy.ps1 <deployId>` (restore API).
- Netlify Functions get NATIVE blob access on-platform, so `pulse-qa-asset` should serve `qa-bin/`
  without setting SITE_ID/BLOBS_PAT as function env vars — verify on the draft before promoting.
- Deploy while background writers churn = 422; the `.netlifyignore` `*_state.json`/`*.log` excludes
  are there for this. Consider pausing the machines for the promote.

## PENDING (owner GO given, but gated on safe execution / eyeball)
- **Deploy**: draft → eyeball → promote (see above). Kills the SVG logo sitewide.
- **DOM-verify one entry** live, give owner the URL. THE moment the 10 days pays off visibly.
- **Status heartbeat**: `/status.json` every 5 min to Blobs (public-safe fields: timestamp, PIDs
  alive/dead, last 10 publishes, failure count, image-lane state, last receipt ts; <5KB, NO secrets).
  Public URL activates via the render-path redirect once deployed (write to `qa-bin/status.json` →
  served at `/assets/qa/status.json`).
- **Finisher daemon**: HOLD until owner eyeballs the live page. Then "build and start the finisher
  daemon per the saved spec" → chews the whole `images_pending` backlog with DOM receipts.
- **Results email**: composed (`_tmp_closeout_email.js`); the safety classifier blocked the autonomous
  send. Owner approved — retry needs a Bash permission allowance or manual send.

## LAWS ADDED THIS SESSION (CLAUDE.md)
- IMAGE FINISHER LAW: image applies ONLY through the verified daemon; generative rung BANNED for face
  cards; batch/mass-update image scripts BANNED (per-entry DOM receipts required; propose otherwise =
  HALT + ask Kory). Failsafes: rate lock ≤1/30s, mandatory `sim/IMAGE_RECEIPTS.md` receipts, random
  re-verify audit every 25.

## KEY FILES TOUCHED
`_dd_fixer_images.js` · `sim_transform.js` · `gen_daemon.js` · `fixer_panel.js` (DD spawn gets
IMAGE_APPLY_PAUSED) · `netlify/functions/lib/derive-image-search-query.js` · `CLAUDE.md` ·
`_IMAGE_FINISHER_SPEC.md` · this log. Git: branch `claude/fix-it-all-handoff`, last commit `06ebac37`
(query fix + this log NOT yet committed — commit next).

## 🚧 DEPLOY ATTEMPTS (2026-07-14 evening) — 4 tries, NOT completed. Read before retrying.
Owner GO'd the deploy directly ("let's deploy now"). Attempted the safe draft→verify path. Findings:
1. **Root deploy = 181,236 files → 422 (Unprocessable Entity)** ×2. Far past Netlify's deploy digest.
   `.netlifyignore` hardened with `.env.local`/.env*/node_modules/_tmp_*/_ra_topic_stage/*.raw.jpg
   (secrets were NOT excluded before — fixed).
2. **`pulse-deploy-clean` = 72k files, incl. 45,021 baked `/assets/qa/*.jpg`** — these shadow the blob
   function (static-first). Excluded `assets/qa/` in clean's `.netlifyignore` → 14,813 files → DRAFT
   SUCCEEDED: `https://6a56a5736f10d3314e5d0f02--pulserevops.netlify.app`.
3. **BUT the draft is FUNCTION-LESS.** Every function 404s (pulse-qa-asset, pulse-machine-entry,
   /knowledge/*); only static (homepage) serves. Cause: `--no-build` + node_modules excluded → Netlify
   never bundled functions/deps. **The current LIVE prod HAS working functions** (/knowledge/* = 200),
   so promoting this draft would REGRESS the whole site to 404s. DID NOT PROMOTE.
**CONCLUSION: the deploy needs a PROPER BUILD** (`netlify deploy` WITHOUT `--no-build`, node_modules
present so the function bundler traces deps like @netlify/blobs), from a curated dir (clean minus the
45k qa statics) OR via the Netlify git build pipeline. `--no-build` is why the reader fn has chronically
404'd live (Fable's original symptom). This is a careful, watch-it operation — NOT a night gamble.
**Machines restarted after (daily-driver text-only + panel). Deploy remains the one open blocker.**
