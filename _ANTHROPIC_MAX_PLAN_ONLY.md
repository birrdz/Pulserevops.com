# 🔒🔒 ANTHROPIC = MAX $200 PLAN ONLY — NEVER PAY-AS-YOU-GO (owner law, 2026-07-17)

**Rule:** every Anthropic/Claude call on this account runs on the owner's **$200 Max plan**. **Never** pay-as-you-go API billing. Owner: *"I never use API pay as you go."*

**Writer order (2026-07-17):** MAIN writer = **Claude Code (Max plan)**. BACKUP writer = **DeepSeek API** (only when Claude Code is genuinely unavailable).

## What went wrong (incident 2026-07-17)
The Baton Picker's "Improve to 13/13" writer spawns the bundled Claude Code CLI (`claude.exe`). It inherited `ANTHROPIC_API_KEY` from `.env.local` and billed that **depleted** pay-as-you-go key → the CLI returned **"Credit balance is too low"**, and the improver **saved that error string as the entry body**. It corrupted 6+ entries (lv122/123/124/125, nl232, bbnewmro3ooay); nl232 was live-published showing the error as its answer.

## Enforcement
1. **Local CLI writers must strip the key.** Any tool that spawns `claude.exe` must `delete env.ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN / CLAUDE_API_KEY` in the child env so the CLI uses the stored Max-plan login. **DONE:** `new/improve_content.js`.
   - **Still to audit:** `groundskeeper.js`, `_claude_chat.js`, `_image_audit.js`, `_scrub_button_server.js`, `_scrub_crew_manifest.js`, `_sim_transform_cursor.js`.
2. **Never save a model error as content.** `improve_content.js` now rejects "credit balance…"/auth/short/non-markdown output, never regresses a good body, and seeds a golden skeleton for empty/junk bodies.
3. `.env.local` keeps `ANTHROPIC_API_KEY` only for ~25 legacy **server-side netlify functions** (they can't use a Max login). It must never reach a local CLI writer.

## Validated
2026-07-17: after the key-strip, `node new/improve_content.js lv122` rewrote lv122 **7 → 13/13, 2966 words** under the Max plan. Fix confirmed.
