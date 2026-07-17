# 📣 ADVERTISING CARD — HANDOFF / RESTORE POINT (2026-07-17)

**This is the savepoint before Kory adds a risky "wrinkle." Everything below is WORKING and PROVEN live.**
Revert target: the git commit this file ships in (branch `claude/fix-it-all-handoff`).

---

## What it is
`_ad_card.js` — a fresh, simple localhost tool on **port 7700** that replaces the OLD face card on every
answer page with a new "advertising card" image. One image per entry. It reads the WHOLE blob library
(**35,906 entries**), worst-first, and lets Kory manually place + seal a permanent image per card.

Start it:
```
cd C:/Users/koryj/website
AD_PORT=7700 node _ad_card.js         # (PowerShell: $env:AD_PORT='7700'; node _ad_card.js)
```
Open: **http://localhost:7700/**  (Ctrl+F5 after any restart)

## The flow (per card)
1. Card loads worst-first. **DRESSING** (the question title) shows on top. **ADVERTISE ID** (e.g. AD-42942)
   is the friendly label; the real `ref` (e.g. q19062) is shown small + kept searchable.
2. Auto Pexels search by the card keyword — candidate photos appear.
3. Click a photo → **live preview with the dressing overlaid** (close to final look).
4. **DELETE the old card first** (POA) — wipes old face + blob.
5. **Real 2-party POA sign-off:** Kory signs his box; the **IDE** grant is server-issued (only after
   delete + image chosen); the **LLM** grant is a GENUINE Max-plan `claude.exe -p` call (framed as a
   routine "is this topic OK to illustrate?" editorial approval so it actually answers). **Seal is
   server-blocked until BOTH real grants exist** — cannot be faked.
6. **SEAL** → writes a VERSIONED image + repoints img. Auto-confirms live, then **auto-advances** to the
   next card (endless loop). ⏸ Hold pauses; X-out / Hold stops.

## 🔑 THE CORE FIX — why images finally update (versioned filenames)
Old bug: page always requested the SAME url `/assets/qa/<id>.jpg`, which (a) was shadowed by a baked
static file and (b) got a **1-year immutable cache** → old image resurfaced forever.
Fix = **new filename every seal**: `qa-bin/<id>-v<timestamp>.jpg`, and the entry's `img` is repointed to it.
A new URL is never shadowed and never cache-stale.
- **Renderer** `netlify/functions/pulse-machine-entry.js` (~line 1075): hero prefers `idxEntry.img` when it
  matches `/assets/qa/<id>-v<digits>.jpg`, else the old constructed path. Fully backward-compatible.
  **DEPLOYED** (prod, restore-API, deploy `6a5aa78f`). Homepage tiles read `img` too → they update as well.
- **Publisher** `new/publish_core.js` → `publishFaceImageOnly(id)`: IMAGE-ONLY (never touches body),
  works for BLOB-ONLY entries (no local file needed), writes versioned + unversioned blobs, repoints
  `answers/<id>.json` img AND `_index.json` img. This is what the ad-card tool calls.
- Proven live: a versioned qa url serves fresh from the blob, byte-match; real cards (q19053, q19062, …)
  render the versioned url on the live page (~60s propagation lag on the index read, then it sticks).

## Worst-first queue + endless loop
- `_ad_build_queue.js` → writes `new/_ad_queue.json` = 100 ids, **worst-first** (missing/placeholder image
  first, then oldest). Re-runnable; skips already-sealed. Auto-refills the next 100 when a batch finishes
  (`maybeRebuildQueue` in `_ad_card.js`, triggered on /api/card when queueLeft===0).
- Endless auto-advance: seal → ~2s confirm → 4s countdown → next card. No manual Next, no long wait.

## Searchable IDs — both ways
- `new/_advid_map.json` maps Advertise ID ↔ ref. Endpoint `GET /api/find?q=AD-12345` or `?q=q19062`
  resolves either direction. Advertise ID is a stable hash of the ref (`AD-` + 10000..99999).
- Questions/content are 100% intact — the tool ONLY changes the image.

## No-mirroring
- Every sealed source photo is recorded in `new/_ad_used_src.json` and filtered out of all future
  candidate searches → no photo appears on two cards.

## Progress so far
- `new/_ad_done.json` = sealed + skipped ids (skips are stored so they don't recur). **18 done** at savepoint.
- Confirmed versioned+live: q19053, q19056, q19059, q19062, q19097, q19099, q19101, q19103, q19105, …
- Skipped (only body images, NOT failures): q19057, q19095.

## Key files
| File | Role |
|------|------|
| `_ad_card.js` | the tool (server + UI), port 7700 |
| `new/publish_core.js` | `publishFaceImageOnly()` — versioned image-only publish |
| `netlify/functions/pulse-machine-entry.js` | renderer (versioned-face hero) — DEPLOYED |
| `_ad_build_queue.js` | builds worst-first 100 → `new/_ad_queue.json` |
| `new/_ad_done.json` | sealed/skipped ids |
| `new/_advid_map.json` | Advertise ID ↔ ref |
| `new/_ad_used_src.json` | used photos (no dupes) |
| `_deploy_renderer_once.js` | the one-off safe renderer deploy (draft→verify→restore promote) |

## Endpoints (`_ad_card.js`)
`/api/card` (next card + stats) · `/api/candidates?q=` · `/api/poa` (ide/llm grant) · `/api/set` (seal) ·
`/api/verify?id=` (live check) · `/api/find?q=` (ID lookup) · `/api/deletecard` · `/api/skip`

## NEXT (planned, NOT started)
- After images: a **content-proof pass** on every page.
- Kory floated a **mechanical clicker** (clicks the same middle image every ~15s). **DECIDED: NOT building
  it right now** — it crosses the human-places-every-image law. Revisit only on explicit go.

## Deploy note
Renderer shipped once (prod). Everything else is **deploy-free** — seals write to blobs and go live via the
`pulse-qa-asset` function. Do NOT auto-ship `netlify/functions` via daily_deploy (it refuses them on purpose).
