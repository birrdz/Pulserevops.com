# LOCKS — owner hard rules (do not re-coach)

## CURSOR DRIP — PER URL ORDER (2026-07-26 — FINAL)

**Find one → run all steps → find next.** No timetable. No cooldown.  
Prefer URLs that still need white/mangled image purge.

| Step | What |
|------|------|
| 1 | **Purge** white / blank / mangled / broken / **404** slots — keep the slot (pending placeholder), do not leave a white/404 URL live |
| 2 | **Fact-check** (Cerebras OK if cheaper) |
| 3 | **Content fix** from fact-check (**Cursor** rewrite — new writing) |
| 3b | **Mermaid** — fix mangled / errored diagrams anywhere (incl. bottom) |
| 4 | **Replace the purged slot(s)** with a **NEW applicable image** that matches the rewritten content (Pexels + repair/fill + deploy to `/assets/qa`). Also fix other non-applicable/broken slots on that URL when possible. Never publish phantom `/assets/qa` 404s. |

**Hard bans:** DeepSeek · Claude / Anthropic API.

Script: `scripts/cursor-drip-local.js`  
Asset write root: `process.cwd()/assets/qa` on cloud (never a fake `C:/…` tree). Deploy via `scripts/lib/deploy-qa-assets.js` (`BLOBS_PAT` = Netlify token).
