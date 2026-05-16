# Industries Navbar UI — Archived 2026-04-27

User asked to remove the Industry dropdown(s) and the "✦ AI Goal Set" button from the navbars on Site 1. The How-To's mega menu (industry-specific playbook pages) was explicitly preserved per user instruction.

## Files

- **`index-html-industry-block.html`** — Industry `<select>` from `index.html` lines 3383–3408 at time of removal. 20 industry options. `onchange` redirected to `dashboard.html?industry=<slug>`.
- **`dashboard-html-industry-block.html`** — Industry `<select>` + AI Goal Set button from `dashboard.html` lines 4431–4481 at time of removal. 39 industry options + the purple "✦ AI Goal Set" button next to it.

## What was kept (NOT removed)

- `INDUSTRY_PRESETS` data structure in `dashboard.html` (KPI names, coaching items, recruiting targets per 39 industries)
- `INDUSTRY_GOAL_BENCHMARKS` data structure (numeric per-rep KPI targets)
- `INDUSTRY_VISUALS` data structure (icon/color/tagline per industry)
- `applyIndustryPreset()` function — still callable programmatically
- `aiSuggestGoals()` function — still callable, defaults to 'security' industry if no dropdown value
- `aiGoalSet()` function — still defined but unreachable from UI (no button calls it)
- `/how-tos/` directory and all 39 industry pages
- How-To's mega menu in both navbars
- Press release `press/pulse-howtos-library.html`
- Sitemap entries for `/how-tos/*`
- Console references to `#global-industry-select` (defensive `?.value || 'security'`, all null-safe)

## Known soft regressions

- **Tour step at `dashboard.html:13526`** ("Pick Your Industry") will ghost-click an element that no longer exists. Will fail silently and the tour will proceed to the next step.
- **CSS rule** at `index.html:417` and `dashboard.html:416` (`#global-industry-select option { ... }`) is now an unused selector. Harmless.
- **`body.tour-active #ai-goal-set-btn` rule** at `dashboard.html:2269` is now unused. Harmless.

## How to restore

1. Paste contents of `index-html-industry-block.html` back into `index.html` immediately after the `<a>` brand link in `<nav>` (was at line ~3382).
2. Paste contents of `dashboard-html-industry-block.html` back into `dashboard.html` immediately after the `</a>` of the `<a href="index.html" ...>` brand link in `<nav>` (was at line ~4430).
3. No JS rewiring needed — the underlying functions (`applyIndustryPreset`, `aiGoalSet`, `aiSuggestGoals`) are still defined and exposed on `window`.
