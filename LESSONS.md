# LESSONS

## 2026-07-26 — Drip images must land on CDN

Bug: drip “fixed” pages by rewriting `/assets/qa/<id>-N.jpg` into the blob, but
`_ddg_facecard_lib.js` wrote files under a fake `C:/Users/koryj/website/...` tree
on Linux cloud agents. Live URLs 404’d → looked like “removed all images, didn’t replace.”

Fix:
- Resolve `WD` via `process.cwd()` on non-Windows (or `PULSE_WD`).
- After step 4, deploy local qa assets with Netlify file digest + promote (`BLOBS_PAT` works as `NETLIFY_AUTH_TOKEN`).
- Strip any `/assets/qa` refs with no local file before save.
- Owner image rule: purge whites/404s always; **replace only if that section’s last good image was purged** (extras stay gone).

## 2026-07-26 — Models

Owner:
- Cursor does the rewrites / pretty much the fix path.
- Cerebras (“cerebral”) is fine if cheaper for audit — use it.
- **Never** DeepSeek or Claude.

Do not “helpfully” fall back to Claude when Anthropic has credits issues, or DeepSeek when Cerebras 429s. Rewrite path stays Cursor (`scripts/cursor-apply-fix.js` + Cursor-written body).
