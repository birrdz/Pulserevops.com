# LESSONS

## 2026-07-26 — Models

Owner:
- Cursor does the rewrites / pretty much the fix path.
- Cerebras (“cerebral”) is fine if cheaper for audit — use it.
- **Never** DeepSeek or Claude.

Do not “helpfully” fall back to Claude when Anthropic has credits issues, or DeepSeek when Cerebras 429s. Rewrite path stays Cursor (`scripts/cursor-apply-fix.js` + Cursor-written body).
