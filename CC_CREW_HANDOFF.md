## Ops right now (2 crews)\n\n- Hub: **2 · DeepSeek · Less than 12/13 · roam**\n- LOW-VALUE declines after honest gate/quality stamps (restart hub/crews if stuck)\n- Gate is structural — fact-check later\n\n## Current owner plan (2026-07-26 evening)

1. **DeepSeek** crews only (surgical clears most 11→12 with $0 writer).
2. Hub target: **📉 Less than 12/13** + **roam**.
3. Owner has **Cursor Ultra $200** for chat/Composer — crew Cursor Agent still needs `CURSOR_API_KEY` in `.env.local`.
4. Facts / image DOM proof / IndexNow = later.
5. Kill drips/boosters unless owner asks — crew only.

# CC / CREW TAKEOVER HANDOFF — 2026-07-26

**For:** Claude Code (or any agent) picking up Whole Crew / gate-12 work after Cursor session.  
**Live hub:** http://localhost:7950/  
**Repo:** `C:\Users\koryj\website`

---

## What is running / intended

- **Only Whole Crew** for now (owner): hub + `_page_finisher.js` crews.
- Other drips/boosters/picture-machines/spider/sim_scan were **killed** 2026-07-26 — do **not** relaunch unless owner asks.
- **Claude Code was BENCHED** until **Tue 2026-07-28**. Auto-unbenches that day (or sooner with `CLAUDE_OK=1`).

---

## Claude unbench (seamless)

| Mechanism | How |
|-----------|-----|
| Auto | After **2026-07-28 00:00 local** — hub enables Claude option; `runWriter` calls `runClaude` again |
| Override now | `CLAUDE_OK=1` in env / `.env.local` (or hub launch env) |
| Keep benched | `CLAUDE_BENCHED=1` |

**Code:** `new/_claude_bench.js` → `claudeUnbenched()`  
Wired in: `new/improve_content.js` (`runWriter`), `_page_finisher.js` (engine picker), `_hub.js` (dropdown).

When unbenched, hub writer options: **DeepSeek · Cursor Agent · Alternate (DS↔Cursor) · Claude Code**.

---

## Gate 12+ path (do not break)

Publish bar = **`GATE_MIN` default 12** (12 or 13 both OK).

1. **`surgicalGateFix(body, question)`** in `new/improve_content.js` — mechanical, **engine-agnostic** (DS / Cursor / CC):
   - Direct Answer pad ≥40 words
   - Mermaid **exactly 2**
   - FAQ ≥5, Sources ≥5, Related on PULSE, clean links
2. **`rebuildToGate`** — surgical **before** writer; if score ≥12 → **`surgicalOnly: true`**, **0 writer calls**
3. Surgical **after** every writer attempt too; early-exit at `score >= TARGET`
4. Finisher mermaid cleanup also inserts **2** diagrams (was 1 — that stuck pages at 11)

Smoke: `node new/_smoke_surgical_gate.js`

Many pages already ~11 → surgical → 12 in ms. Slow part = images + email.

---

## Emails

- **Hit ≥12 + fully done:** subject like `♻️ REVISED 12/13 — {id}` · body shows **Gate score: 12/13**
- **Miss &lt;12:** subject `📉 MISS 11/13 — {id} (didn't hit 12)` via `emailCrewMiss`
- Silence: `_crew_email_off.flag`

---

## Hub win/loss (top bar)

Status files: `new/imagebank/_crew_<port>.json` fields `win` / `loss` / `lastGate`.  
**Intended meaning:** win = hit 12+ · loss = missed &lt;12 (fully attempted).  
If counters still show 0 after restarts, re-check finisher increments (`HIT 12+` / `MISS &lt;12` logs) — may need crew restart to load latest `_page_finisher.js`.

---

## Writers

| Engine | Env | Notes |
|--------|-----|--------|
| DeepSeek | `WRITER_ENGINE=deepseek` / `ENGINE_MODE=deepseek` | Default; needs DS key in `.env.local` |
| Cursor | `cursor` | Needs **`CURSOR_API_KEY`** in `.env.local` (was missing 2026-07-26) · helper `new/_cursor_run_once.js` |
| Alternate | `alternate` | Flips DS ↔ Cursor per page |
| Claude | `claude` | Max-plan CLI via `runClaude` — **no API billing**; unbench first |

Anti-drift (`new/_ds_antidrift.js`) applies to **DeepSeek prose only**. Surgical + gate apply to all engines.

---

## Less than 12/13 pile

- Hub pillar: **📉 Less than 12/13** (`__under12__`)
- Fail file: `_under12_failed.json`
- Inventory: `_under12_inventory.json` · rebuild `node _rebuild_under12_inv.js` if present
- Env: `UNDER12=1` on finisher

---

## Restart crews after code changes

Hub does **not** hot-reload finisher logic already in flight. After pulling/editing:

1. Hub → Force Clear / kill crews  
2. Send the Crew again (engine of choice)  
3. Confirm log lines: `[surgical]`, `WROTE N/13 (surgical-only)`, `email SENT … N/13`

---

## Deferred (owner: later)

- Live DOM / `proveLive` image double-check (crew only does light MD5/size/used-Pexels today)
- White-page purge
- Dupe same-URL harden beyond current MD5 `seen` set (face→top same URL still **required by law**)

---

## Do not

- Relaunch drips / content booster / picture machines / spider unless asked  
- Bulk face/tops (manual 1-by-1 law)  
- Deploy prod without owner / Deploy Law  
- Bypass visual lock / golden templates without `4444`  
- Assume Cursor works without `CURSOR_API_KEY`

---

## Quick verify for CC

```bash
node -e "console.log(require('./new/_claude_bench').claudeUnbenched())"
node new/_smoke_surgical_gate.js
# hub
node _hub.js
# → http://localhost:7950/  type 4444, Send the Crew
```

**Session that built this:** Cursor Agent 2026-07-26 — surgical gate-12, emails with rating, Claude bench until Tue, drips stopped.
