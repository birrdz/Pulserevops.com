# Fringe RevOps economy infinite loop

**Cadence:** every **5 minutes** on Netlify (`pulse-cro-economy-tick-background`).

**Topics:** nuance fringe RevOps long-tail (CRM-native edge cases) — not CRO hire-help.

**Each tick:**
1. Pick next topic from blob queue (auto-refills when &lt; 40 remain).
2. Dedupe vs live library (exact + Jaccard ≥ 0.72) — skip, no post.
3. Post ~1,000–1,200 word economy answer (`lab_run: economy-mode-1000w`, `revops-fringe` + `nuance` tags).
4. **Auto-index on publish:** `pulse-blob-writer` pings IndexNow + stamps `was_indexed_at` for every new `q####` (cron SEO spot-check only).
5. SEO spot-check: 200, title, meta description, canonical, JSON-LD.

**Cancel:** set `cancelled: true` in blob `_economy_cro_infinite_state.json` (or local `_economy_cro_infinite_state.json` for the local runner).

**Local runner:** `node _economy_cro_infinite_scheduled.js` (same logic, 300s sleep).

**Regenerate topic file:** `node _generate_cro_infinite_queue.js 500`

**Seed blob after deploy:** `node _economy_cro_seed_blob_state.js`

**Heartbeat:** blob `_economy_cro_infinite_heartbeat.json`

**Status:** **RUNNING** — `*/5 * * * *` on Netlify; blob `cancelled` must stay `false`.
