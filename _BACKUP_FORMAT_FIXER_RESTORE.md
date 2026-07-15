# Format Fixer intact backup — 2026-07-14

Saved **before** the Format Fixer → Square Builder order gate, in case that idea is bad and you want the old fixer back.

## Files
| File | What |
|------|------|
| `_BACKUP_scrub_button_server_pre_square_gate_20260714.js` | Full scrub server from `main` @ pre-gate (Format Fixer + Face Card as they were) |
| `_BACKUP_format_fixer_lib_intact_20260714.js` | Format Fixer lib (content-only) — unchanged by the gate work; dated snapshot |

## Restore (Windows box: `C:\Users\koryj\website`)
```powershell
# Stop scrub server first, then:
Copy-Item _BACKUP_scrub_button_server_pre_square_gate_20260714.js _scrub_button_server.js -Force
# optional lib restore (only if you also changed it):
# Copy-Item _BACKUP_format_fixer_lib_intact_20260714.js _format_fixer_lib.js -Force
# Restart: node _scrub_button_server.js
```

Or git: `git checkout main -- _scrub_button_server.js` if main still has the pre-gate file.

## What was NOT the problem
Deploy is **not** required to run Format Fixer / Square Builder. Those buttons run on **localhost:8899** on the Windows machine with `.env.local` (DeepSeek + `BLOBS_PAT` / Netlify token). A cloud agent cannot push that button without those credentials and the Windows scrub process.
