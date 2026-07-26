# HANDOFF — 2026-07-26 CREW / GATE-12 (newest)

**Read first:** `CC_CREW_HANDOFF.md` + top of `_CROSSOVER.md` (2026-07-26 block).

**Running plan:** 2× DeepSeek Whole Crew · Less than 12/13 · roam · surgical→12.

**CC:** benched til Tue 2026-07-28 (`new/_claude_bench.js`).

**Hub:** http://localhost:7950/

---

# HANDOFF — 2026-07-21 late (pre-compact)

## ✅ LIVE on pulserevops.com (clean-mirror draft→restore, all promoted)
- **Brand = black-circle/electric-gold CHECKMARK** everywhere: favicon.ico (multi-size)+16/32/192/512, apple-touch, manifest (black theme #0D0D0F), OG/Twitter (pulse-og .png+.jpg 1200x630), JSON-LD Organization logo → `/assets/images/logo-master.png?v=nightgold`. Source: owner Google Photos link → `scratchpad/logo_src.png` (1408x768) → square crop. `netlify/functions/lib/pulse-brand.js` = single source (?v=nightgold). Regenerate: `scratchpad/gen_brand.js`.
- **Header masthead logo** `pulse-news-logo.png` (820x547) = checkmark badge + gold "PULSE / VALUE ADDED"; ?v=nightgold in index.html/hire.html/renderer/js. Regenerate: `scratchpad/gen_header_logo.js`.
- **Tile titles**: tl→"Fractional CCO · Santa Fe" + gp/ra/cg/sw (pulseSimpleTitle in index.html, croRole map).
- **Render-time mermaid fixer** (`fixMermaidSrc` in renderer) hardened → fixes ALL live pages on load (quote labels, add directive, strip md, graph→flowchart, keep `<-->`).

## 👷 Whole Crew = `_page_finisher.js` (manager :7950, type wholecrew, code 4444)
See **2026-07-26** block above + `CC_CREW_HANDOFF.md` for current gate-12 / surgical / email / win-loss truth. Older notes below may be stale (mermaid count, etc.).

### Historical (2026-07-21)
- Per page: WRITE(12-13/13)→face→hero→body 1-N→mermaid→email. Leapfrog claims.
- Pressure gate: publish only if ≥12.
- Image pick: keyword → buildings/art fallback → packs; page MD5 dedupe.

## ⚠️ LAWS (CLAUDE.md): image placement human-only/baton unless owner 4444; Deploy Law; visual lock; golden templates.
