# LOCKS — owner hard rules (do not re-coach)

## MODELS (2026-07-26 — FINAL)

| Job | Allowed | Forbidden |
|-----|---------|-----------|
| Fact-check / audit | **Cerebras** (ok if cheaper on plan) or **Cursor** | DeepSeek, Claude/Anthropic |
| Content rewrite | **Cursor only** | DeepSeek, Claude, Cerebras-as-writer |
| Images after rewrite | Pexels | — |
| Email | One per page after diagnose + Cursor rewrite + Pexels | — |

**Hard bans forever:** DeepSeek · Claude / Anthropic API for this content work.

**Cerebras:** allowed for audit/diagnose when cheaper. Never use it (or anything else) as a substitute for **Cursor rewrites**.

**Drip 24/7:** Cerebras (or Cursor) diagnoses → queue → **Cursor rewrite** → Pexels → one email. Independent of batch STOP_AT=8000.
