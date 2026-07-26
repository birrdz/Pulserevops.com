# LOCKS — owner hard rules (do not re-coach)

## CURSOR DRIP — PER URL ORDER (2026-07-26 — FINAL)

**Find one → run all steps → find next.** No timetable. No cooldown.  
Prefer URLs that still need white/mangled image purge.

| Step | What |
|------|------|
| 1 | **Purge** white / blank / mangled / broken / **404** slots (remove them — do not leave white/404 URLs live) |
| 2 | **Fact-check** (Cerebras OK if cheaper) |
| 3 | **Content fix** from fact-check (**Cursor** rewrite — new writing) |
| 3b | **Mermaid** — fix mangled / errored diagrams anywhere (incl. bottom) |
| 4 | **Replace an image only if that topic/section has no good image left** after purge (it was the only one). If one of two was purged and the other is fine → leave it. New image must match rewritten topic; host + deploy `/assets/qa`. Never publish phantom 404s. |

**Hard bans:** DeepSeek · Claude / Anthropic API.

Script: `scripts/cursor-drip-local.js`  
Asset write root: `process.cwd()/assets/qa` on cloud (never a fake `C:/…` tree). Deploy via `scripts/lib/deploy-qa-assets.js` (`BLOBS_PAT` = Netlify token).
