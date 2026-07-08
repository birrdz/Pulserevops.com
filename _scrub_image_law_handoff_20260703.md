# Scrub image-law + lane crossover — 2026-07-03 late night (LATEST-27)

Saved for crossover handoff. Canonical: `_HANDOFF_NEXT_CLAUDE.md` LATEST-27 top block.

## Crew manifest (`_scrub_crew_manifest.js`)

| Role | Count |
|------|-------|
| DeepSeek content writer | 1 |
| Claude Code writers | 0 |
| Parallel workers (flux / ddg / content) | 3 slots |
| Claude Code auditor (per article) | 1 (default) |
| DeepSeek auditor | 0 (+ CLI fallback) |
| Final gate auto-auditor | 0 |

**Quad code** = Claude Code CLI. **Recommended:** `LANE_AUDITOR_MODE=claude`.

## Parallel lane (48-batch scrub)

- Default ON · 48 jobs max · **3 workers at once** on different articles
- `laneOrchestrate` / `laneSlots` / `pickLaneJobsParallel`
- Phases: content → image_cover → image_section/top10 → image_verify → gate
- Content must pass Claude auditor before advancing to images
- Approval pile: 100% rubric + human skim

## Hero = face-card (SAME image)

- **Hero** and **face-card** are one image: first top markdown image = homepage + pillar mosaic tile
- Path: `/assets/qa/<id>.jpg` (Pollinator flux, `cover_src:'flux'`, >40KB)
- Image #2 = Kory CRO `/assets/kory-white.jpg` (extra, not counted)

### Rubric (all three required for 12/13)

| Key | UI label |
|-----|----------|
| `heroImage` | Hero image |
| `faceCardApplicable` | Face-card applicable |
| `pollinatorFaceCover` | Pollinator face-card cover |

Failures on these → lane phase `image_cover`.

### Lineup mapping

| Layer | Label |
|-------|-------|
| Phase | `image_cover` → `🌸 flux cover` |
| Batch stage | **2 Pollinator** / column **Hero** |
| Kid UI | "Hero pic" / "Making the big hero picture" |
| Pending detail | `face-card` |

DDG section images = stage 3 (not hero/face-card).

## Image law

| Slot | Rule |
|------|------|
| **Every Q&A** | **1 main top hero** (face-card) — always required |
| Hero/face-card | Pollinator flux → `/assets/qa/{id}.jpg` (>40KB) |
| Kory #2 | `/assets/kory-white.jpg` (not counted in 3–10) |
| Regular Q&A sections | DuckDuckGo `https` under major `##` only — **3–10 counted** (hero + up to 9 DDG) |
| **Top-10** | **11 total** = 1 hero + **10** `@@PRODUCT` cards |
| **Banned** | `pollinations.ai` in sections, `/img/auto/*.svg`, `/assets/qa/{id}-N.jpg` internals |

## Lane mode (48-batch scrub) — superseded detail in LATEST-27 parallel section above

- Default ON (`SCRUB_LANE_MODE≠0`)
- 48 jobs max (`_scrub_lane_jobs.json`), chained cooldown scheduler, auto-refill
- `LANE_CONTENT_MAX_ROUNDS=1` — fast to images
- Phases: content → image_cover → image_section/top10 → image_verify → gate
- **Pipeline spread:** interleave flux covers + DDG early (`lanePipelineBalance`, `pickLaneJobCooldownAware`)
- Approval pile: 100% rubric only (`APPROVAL_PILE_REQUIRES_FULL_RUBRIC`)

## Pollinator throttle (LATEST-26)

- **15s** fixed frequency (`POLLINATOR_FREQ_MS=15000`) — no adaptive 2.5min gap
- UI: Freq · last gen · avg
- DDG pace: `DDG_PACE_MS=12000` default

## Kid-simple UI (LATEST-27)

- Up to **3 workers** shown live (✍️ / 🌸 / 🖼)
- Audit pile docked during scrub · crew manifest from `scrubCrew` API
- Color-coded whole line (multiple green actives)

## Owner controls

- **Begin Scrub** — owner starts; do not auto-start
- Stop when asked (`_scrub_auto_off.flag`, POST stop)

## Pool state

- Scrub server: `localhost:8899`, code `4444`
- Queue: **~35,294** · green/pending/parked: **0**
- Repop: `node _repop_scrub_now.js`

## Env defaults

- `LANE_AUDITOR_MODE=claude` (recommended)
- `SCRUB_LANE_MAX_JOBS=48`, `CC_MAX=4`, `LANE_MIN_GAP_MS=2000`
- `LANE_IMAGE_FLOOR_PCT=0.35`, `LANE_MAX_CONTENT_PCT=0.55`
- `POLLINATOR_FREQ_MS=15000`, `DDG_PACE_MS=12000`
- `REQUIRE_FLUX_IMAGES=1` → legacy all-flux internals (OFF by default)

## Files

- `_scrub_crew_manifest.js` — crew + auditor law
- `_scrub_button_server.js` — parallel lane, rubric, UI
- `_pollinator_flux_throttle.js`, `_scrub_lane_jobs.json`, `_face_cover_lib.js`

## Handoff mirrors

- `_HANDOFF_NEXT_CLAUDE.md` (canonical, LATEST-27 top)
- `_CROSSOVER.md`, `_BATON_PASS.md`, `HANDOFF_PROMPT.md`
- `_site_deploy/_CROSSOVER.md`

## Commands

```powershell
node -c _scrub_button_server.js
Invoke-RestMethod 'http://localhost:8899/scrub-status'
node _repop_scrub_now.js
node _audit_scrub_last10.js 10
```
