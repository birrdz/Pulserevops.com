# LOCKS — owner hard rules (do not re-coach)

## CURSOR DRIP — PER URL ORDER (2026-07-26 — FINAL)

**Two drips, lead/follow, smallest → largest. Email immediately per finished URL (`EMAIL_EVERY=1`).**

| Drip | Role | Script |
|------|------|--------|
| **Image lead (ahead)** | White/404/mangled purge + replace images that don’t match title/paragraph context | `scripts/white-image-purge-local.js` |
| **Content (behind)** | Fact-check → find lies/misspeaks → rewrite. Stays behind `image_lead_done_at` | `scripts/cursor-drip-local.js` (`DRIP_CONTENT_ONLY=1`) |

**Pillar order:** both = all pillars, smallest → largest.  
White purge must **replace** white/404 covers (never leave blank/404 face). Live-verify before claiming fixed. QA asset deploys lock-serialized (`/tmp/pulse-qa-deploy.lock`).

| Image-lead | What |
|------|------|
| 1 | Find white / blank / mangled / broken / **404** |
| 2 | Find off-topic / non-applicable images (title + paragraph context) |
| 3 | Replace with applicable hosted `/assets/qa` · deploy · stamp `image_lead_done_at` |

| Content drip | What |
|------|------|
| 1 | Wait until image-lead cleared the URL |
| 2 | **Fact-check** (Cerebras) — lies / misspeaks |
| 3 | **Content rewrite** (Cursor) |
| 3b | **Mermaid** fix if mangled |

**Hard bans:** DeepSeek · Claude / Anthropic API.

Script: `scripts/cursor-drip-local.js`  
Asset write root: `process.cwd()/assets/qa` on cloud (never a fake `C:/…` tree). Deploy via `scripts/lib/deploy-qa-assets.js` (`BLOBS_PAT` = Netlify token).
