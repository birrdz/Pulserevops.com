# 🪃 BATON PASS — live snapshot for the next Claude Code

_Refreshed **2026-07-03 late night (LATEST-27)**. Read **`_HANDOFF_NEXT_CLAUDE.md` LATEST-27 block (top)** first — parallel workers + crew manifest + Claude auditor._

## 👥 CREW MANIFEST (`_scrub_crew_manifest.js`)

| Role | Who | How many |
|------|-----|----------|
| Content writer | **DeepSeek API** | 1 |
| Claude Code writers | — | **0** (dropped) |
| Hero worker | **Pollinator flux** | 1 slot |
| DDG worker | **DuckDuckGo** | 1 slot |
| **Auditor (primary)** | **Claude Code CLI** (quad code) | **1 per article** |
| DS auditor | DeepSeek skeptic | **0** default · **1** CLI fallback · **1** if `claude+ds` |
| CC pool cap | `CC_MAX` | **4** parallel claude.exe (not 4 auditors/article) |
| Publish gate | rubric + human | **no** auto auditor at gate |

**Default one-liner:** `48 batch · 3 workers · 1 Claude Code auditor · human approval pile`

**Env:** `LANE_AUDITOR_MODE=claude` (recommended) | `claude+ds` | `ds` (avoid)

## 🔀 PARALLEL LANE (default ON)

- **48** articles (`_scrub_lane_jobs.json`) · auto-refill on completion
- **3 workers at once** on **different** Q&As: `content` · `flux` · `ddg`
- `laneOrchestrate()` / `runLaneSlot()` / `pickLaneJobsParallel()`
- Chained cooldown scheduler (`scheduleLaneTick`) — not serial one-at-a-time
- Content must pass `laneContentAuditGuard` before advancing to images
- Owner hits **Begin Scrub** — `_scrub_auto_off.flag` when stopped

## HERO = FACE-CARD (same image)

| Rubric key | Meaning |
|------------|---------|
| `heroImage` | Top image tag exists |
| `faceCardApplicable` | Topical cover (no CRO boardroom on wrong pillar) |
| `pollinatorFaceCover` | Flux file `/assets/qa/<id>.jpg`, `cover_src:'flux'`, >40KB |

Flux worker slot = phase `image_cover` / face-card work.

## 🔒 IMAGE LAW (locked)

| Slot | Source |
|------|--------|
| Face-card / hero (#1) | **Pollinator flux** → `/assets/qa/<id>.jpg` (>40KB, `cover_src:'flux'`) |
| Internal sections | **DuckDuckGo** `https` |
| Kory CRO (#2) | `/assets/kory-white.jpg` (extra, not in 3–10) |
| Top-10 | 1 hero + 10 `@@PRODUCT` images |
| **Banned internals** | `pollinations.ai`, `/img/auto/*.svg`, `/assets/qa/<id>-N.jpg` |

## PUBLISH / APPROVAL

- **Content audit:** Claude Code during `content` phase (not at final gate)
- **Gate:** `finalPublishGate` = `rubricSignOff` only
- **Approval pile:** 100% rubric + human skim → ✓ publish

## SCRUB BUTTON

- **URL:** http://localhost:8899/ · **code:** 4444
- **Scripts:** `_scrub_button_server.js` + `_scrub_crew_manifest.js`
- **Queue:** **~35,294** · **Green:** 0 · **Pending:** 0
- **Kid UI:** 3 workers · audit pile docked · crew manifest

## POLLINATOR

- `_pollinator_flux_throttle.js` — **15s** fixed (`POLLINATOR_FREQ_MS=15000`)
- DDG pace default **12s** (`DDG_PACE_MS=12000`)

## STOP + REPOP

```powershell
cd C:\Users\koryj\website
node _repop_scrub_now.js
Set-Content '_scrub_auto_off.flag' -Value '1' -NoNewline
Set-Content '_scrub_lane_jobs.json' -Value '[]' -NoNewline
```

## RELAUNCH SERVER

```powershell
cd C:\Users\koryj\website
node -c _scrub_crew_manifest.js
node -c _scrub_button_server.js
$procs = Get-NetTCPConnection -LocalPort 8899 -EA SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $procs) { if ($procId) { Stop-Process -Id $procId -Force -EA SilentlyContinue } }
Start-Sleep -Seconds 2
Start-Process node -ArgumentList '_scrub_button_server.js' -WorkingDirectory 'C:\Users\koryj\website' -RedirectStandardOutput 'C:\Users\koryj\website\_scrub_button.out.log' -RedirectStandardError 'C:\Users\koryj\website\_scrub_button.err.log' -WindowStyle Hidden
```

## VERIFY

```powershell
Invoke-RestMethod 'http://localhost:8899/scrub-status' | Select-Object -ExpandProperty scrubCrew
node -e "console.log(require('./_scrub_crew_manifest').crewOneLiner())"
node _audit_scrub_last10.js 10
```

## KEY FILES

- `_scrub_crew_manifest.js` — crew + auditor counts (READ FIRST)
- `_scrub_button_server.js` — parallel lane, auditors, kid UI
- `_pollinator_flux_throttle.js`, `_scrub_lane_jobs.json`, `_face_cover_lib.js`
- Handoffs: `_HANDOFF_NEXT_CLAUDE.md`, `_CROSSOVER.md`, `_scrub_image_law_handoff_20260703.md`, `HANDOFF_PROMPT.md`, `_site_deploy/_CROSSOVER.md`
