# ▶ PULSE SPRINT BACKLOG — owner queue (2026-06-27)

Owner is queuing many pillar content sprints + 2 tool rebuilds. This is the single source of truth; the handoff references it. **Each Top-10 pillar = +300 entries, ONE Claude writer at a time** (owner: "1 Claude code writer", NOT 10-wide). Mechanism per pillar: `_seed_<p>300.js` (real, deduped titles in that pillar's existing style + year-at-end) → `_<p>_sprint_queue.json` → serial workflow (a `for` loop with `await agent()` = 1 at a time) → each agent writes `C:/Users/koryj/<id>_answer.md` to the pillar's grader spec, then `node _write_<p>.js <id> "<title>" <slug>` (deploy-free blob+index, grades ≥10). Speeches use `_sp_writer_spec.md`; Top-10 pillars (cl/co/ev/gm/ga/nl/mv/lv...) grade under the **electronicreview** ruleset (10 items, 🏆Best Overall/💎Best Value, FAQ, Sources, 1 mermaid, ≥1800w, ≥3 real named places, cover image). ⚠️ ACCURACY: real venues/items only — never fabricate.

## ACTIVE
- **CRM + War Room rebuild** — DELETE current (CRM = `dashboard.html`; War Room = its embedded "AI Custom Report" + `netlify/functions/warroom-report.js`; registry `lib/pulse-tools-registry.js`; landing via `tools-page.js`). REBUILD as **two separate pillars**, redesigned "in owner's image" for **new-user ease**. Build `crm.html` + `war-room.html`, register routes/nav. NEEDS DEPLOY (deploy only if provably safe — owner: "make sure won't screw up site").

## CONTENT SPRINTS (in owner's stated order)
1. **Speeches → 400** (sp) — RESUME (paused ~135/400). Speech format, `_sp_writer_spec.md`, `_sp_sprint_queue300.json`.
2. **Clubs +300** (cl) — Top-10. Staged `_cl_sprint_queue300.json` (177 — widen to 300). cl max = cl0090.
3. **Collectibles +300** (co) — Top-10. co max = co0086.
4. **Events +300** (ev) — Top-10.
5. **Gaming +300** (gm) — Top-10.
6. **Gatherings +300** (ga) — Top-10.
7. **GTM Playbooks** — redo the `/go-to-market-playbooks` landing page "in owner's image" (the "random words at top" keyword-dump bug is already fixed in source, item #4 in handoff), THEN **Pulse GTM (gp) +300**.
8. **HS Football Recruiting +300** — (confirm pillar/prefix; sports/NIL-adjacent — may need a new pillar or maps to an existing sports prefix).
9. **Industry KPIs +400** (ik) — KPI format (ik0035 template, ≥1200w), NOT Top-10.
10. **Living +300** (lv) — Top-10.
11. **Movies +300** (mv) — Top-10.
12. **Nightlife +300** (nl) — Top-10.
13. **Resorts +300** (rs) — Top-10.
14. **Reviews +400** (er) — Top-10 (Electronic Reviews, the native electronicreview pillar).
15. **Sales Trainings +300** (st) — st213 template (6 H2 + 2 mermaids + scripts + FAQ + Sources), `_write_st`-style; NOT Top-10. st max ≈ check live.
16. **Schools +300** (sc) — Top-10 (electronicreview ruleset).
17. **Style +500** (sy) — dual format (Top-10 OR outfit guide); both genders + outfit boards (see feedback_pulse_style_gendered_visual).
18. **Tech Stacks +300** (tk) — tk0197 template (Direct Answer + TL;DR + 9 H2 + 2 mermaids).
19. **Tools +300** (tl) — Pulse Tools how-to + CRO lead-gen format. ⚠️ tl tags re-bloat the index 502 — cap tags at write time (see [[tools-pillar-tag-bloat-502]]).
20. **Towns +500** (tn) — Top-10 (electronicreview ruleset).
21. **Travel +500** (tv) — Top-10 (electronicreview ruleset).
22. **Wellness +400** (wl) — Top-10 (electronicreview ruleset).

## SITE-WIDE TASK (owner: "after crm")
- **SEO index-max + interweave ALL pillars.** After the CRM work: maximize sitewide SEO/indexing and cross-link ("interweave") every pillar's Q&As/entries to each other — the "## Related on PULSE" sibling-pillar mesh + Tools (see feedback_cross_link_law). Likely a blob-level pass adding Related-on-PULSE cross-links across all ~22k entries (deploy-free), plus sitemap/IndexNow refresh. Keep `_indexnow_sitewide.js` OFF unless owner re-enables (it froze the index before).

(Append new owner requests below as they arrive.)

## 🕒 OPERATING CADENCE (owner 2026-06-27)
**Every ~3 hours: PAUSE and refresh the handoff files for the next Claude Code session.** Update `_HANDOFF_NEXT_CLAUDE.md` (latest-session block) + this `_SPRINT_BACKLOG.md` (what's done / in-flight / remaining) + `project_current_work.md` memory, so a fresh Claude can resume cleanly. `_handoff_hourly.js` already refreshes the LIVE SNAPSHOT hourly; this 3-hour rhythm is the deliberate human-readable checkpoint.
