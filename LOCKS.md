# LOCKS — permanent architectural laws (change only with owner's explicit word)

## 🔒 STATIC_IMAGE_LAW (owner/Fable 2026-07-15)

**Face-card images are baked STATIC files inside the deploy — nothing runtime in the visitor image path.**

- Every entry's face card is a real static file at `assets/qa/<id>.jpg`, shipped in the deploy and served by the CDN/edge as a plain static asset (edge cache hit). The template constructs `/assets/qa/<id>.jpg` for the hero.
- **No blob-reader. No serverless function. No runtime lookup** in the path a visitor's browser takes to load a face-card image. The `pulse-qa-asset` blob-reader function is NOT the image path — it 404'd in production and caused the 2026-07-15 regression (blob-sourced images 404 on prod while static ones worked).
- **Blobs are for DATA only** (entry bodies, `_index.json`, counters, receipts) — never for images a visitor must fetch at request time.
- When a new/fixed entry needs a face card, **BAKE it to `assets/qa/<id>.jpg`** (via `_bake_static_facecards.js` or the image lane's static writer) BEFORE it can render correctly on a fresh deploy. An entry with no static file = a 404 face card after any deploy-from-local.
- **Why:** a deploy from the local tree only ships the static files that exist locally. If an image lives only in a blob (or only on the currently-live prod), a new deploy drops it → 404. Baking makes the image part of the deployable tree, so it can never be dropped.

**Baker:** `_bake_static_facecards.js` — walks the index, bakes any entry missing `assets/qa/<id>.jpg` from the best source (local `.sq` → img-field asset → prod-download → pillar topic-image fallback). Serial, resume-safe lockfile (`sim/baker/lock`), one receipt per entry (`sim/baker/receipts.md`). First run 2026-07-15: 110 missing → 110 baked, 0 failed.

## 🔒 LAW-BATON (owner 2026-07-16) — Manual Image Baton System (no batch, no cheating)

**Images reach ID cards (face cards) or answer pages ONLY via receipt-backed single writes.**

- **Picker** (`baton_picker.js`, http://localhost:7802, Pulse crimson/gold): candidate images left, target slots right (1 ID/face-card + 6 answer-page). Kory taps an image then a slot; the pair locks and the slot shows the thumbnail. On **each** tap-pair the server writes **one** HMAC-signed receipt to `_receipts/pending/`: `{entry_id, slot_id, source_image_sha256, dest_path, timestamp, nonce, sig}`. "Round complete" when ID + all 6 are filled.
- **Secret**: the HMAC key lives ONLY in `.guard/secret.key`, generated once by `.guard/setup_baton.bat` which **Kory runs himself**. Claude never sees it.
- **Guard** (`.guard/guard.py`, PreToolUse hook in `.claude/settings.json`), on every Bash/Write/Edit/Read:
  - a. BLOCK Bash loops (for/while)/xargs/find -exec/python|node|powershell/globs/write-vectors touching image output dirs (`new/output`, `assets/qa`).
  - b. BLOCK any Read/Bash/Edit/Write touching `.guard/secret.key` or `_receipts/`. CC may never open these.
  - c. ALLOW a Write/Edit into an image dir ONLY IF a pending receipt matches `dest_path` exactly AND `sha256(content)`. On success the receipt MOVES to `_receipts/used/` — single use, ever.
  - d. One image write per tool call.
  - e. Every blocked attempt logs to `_receipts/violations.log` with the attempt.
- **Claude's rule**: if a receipt is missing, **STOP** and tell Kory **"waiting on your picks at :7802"** — never generate, guess, or script a workaround.
- **Activation**: run `.guard/setup_baton.bat` once (creates the secret), then `/hooks` or restart to load the guard, then `node baton_picker.js`.
- **Honest scope**: the guard inspects tool calls by command/path string — it blocks the obvious batch/no-receipt/secret-read vectors (all four acceptance cases) and is a strong deterrent + audit trail, but not an absolute wall against a determined author. The absolute wall remains **Kory holding the publish keys + approving before publish.**
