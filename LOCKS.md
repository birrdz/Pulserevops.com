# LOCKS — owner hard rules (do not re-coach)

## CURSOR DRIP — PER URL ORDER (2026-07-26 — FINAL)

**Find one → run all steps → find next.** No timetable. No cooldown.  
Prefer URLs that still need white/mangled image purge.

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
