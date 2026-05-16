# Character System — Archived 2026-04-27

Removed from the live site per user request after Pulse Derby launch. Preserved here for easy future restoration.

## Files

- **`index-html-character-block.html`** — full block from `index.html` lines 3246–3612 at time of removal. Contains:
  - `<style>` rules for `.lc-char-label` (hidden) and `.lc-char-avatar` opacity transitions
  - `#lc-char-preview` — fullscreen translucent character preview overlay (with hover/click backdrop logic)
  - `#lc-character-row` / `#lc-character-list` — the "Pick Your Character" picker row with all 39 character buttons (`malewhite`, `femalewhite`, `blackmale`, `blackfemale`, `asianmale`, `asianfemale`, `detective`, `detectivefemale`, `frankenstein`, `frankensteinfemale`, `santa`, `mrsclaus`, `werewolf`, `aristovampire`, `aristovampirefemale`, `snowman`, `snowmanlong`, `ballplayer`, `ballplayerfemale`, `ballcoach`, `ballcoachfemale`, `char11`, `char15`, `char16`, `char17`, `char19`, `char20`, `char21`, `char22`, `char23`, `char24`, `char28`, `char29`, `char31`, `char35`, `char37`, `char38`, `char39`, `char40`, `char41`)
  - `<script>` IIFE with `window.lcSelectCharacter`, hover/focus listeners, localStorage save/restore (`pulse_character` key), and `preloadCharacters` PNG decoder

- **`dashboard-html-avatar-block.html`** — full block from `dashboard.html` lines 4691–4824 at time of removal. Contains:
  - `#avatar-picker-wrap` — "Select Your Fighter" panel with one avatar option (Shell-Shock Juggernaut / Wild Path / `/assets/avatars/turtle.png`)
  - `#dash-char-backdrop` — fixed-position translucent character watermark on the right edge of the dashboard, reads `localStorage.pulse_character` and resolves to `assets/characters/<id>.png`
  - `#avatar-pill` — floating top-right pill showing the currently selected avatar (icon-only at time of archive; name span was hidden)
  - Two `<script>` IIFEs:
    - First: backdrop loader (`storage` + `hashchange` listeners, default char `malewhite`)
    - Second: avatar picker click/hover handlers, localStorage `pulse_avatar` save/restore

## Image assets (kept in place, not removed)

The character/avatar PNGs themselves stay in the repo so the archive can be restored without asset hunting:

- `assets/characters/*.png` — 39 full-body character art files (one per slug above)
- `assets/avatars/*.png` — small head-icon variants (e.g. `turtle.png`)

## Localstorage keys still in use elsewhere

Both keys remain readable/writable from any other code that opts into the character system later. They are *not* cleared by removal:

- `pulse_character` — slug of the index.html-picked character
- `pulse_avatar` — slug of the dashboard-picked avatar

## How to restore

1. Paste the contents of `index-html-character-block.html` back into `index.html` immediately after the `<button>Skip ↓</button>` line of the landing-chooser top bar (originally line ~3245).
2. Paste the contents of `dashboard-html-avatar-block.html` back into `dashboard.html` immediately before the `<!-- HERO -->` comment (originally line ~4826).
3. Both files self-contain their styles + scripts. No additional wiring required.

## Related references that *did not* need cleanup

These references in the live files target now-missing elements but are harmless null-checks:

- `dashboard.html` `CHROME_IDS` allowlist still includes `dash-char-backdrop` and `avatar-pill` — strings only, no behavior
- Tour step at `dashboard.html#warroom` calls `document.querySelector('#avatar-picker-wrap')` inside an `if (picker)` guard
- Mobile media queries reference `#dash-char-backdrop` / `#avatar-pill` selectors — empty rules when the elements are gone
