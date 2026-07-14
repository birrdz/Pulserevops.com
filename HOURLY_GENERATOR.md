# HOURLY_GENERATOR.md — AUTONOMOUS GENERATION DAEMON FOR CLAUDE CODE

Build a scheduler that generates new golden-template Q&As every hour on the hour, forever, using `PIPELINE_GENERATION_PROMPTS.md` as the generation law. CC builds and launches this as a persistent daemon (`gen_daemon.js`) — the daemon + pipeline scripts do the work; no chat session required after build.

## THE JOB

Every hour, on the hour (:00), the daemon wakes and generates a batch of NEW, unique Q&A entries across the site's topics:
- Mix per batch: for each topic served that hour, generate BOTH types where questions exist — TOP_LIST entries via Prompt 1 and GENERAL/essay entries via Prompt 2 from `PIPELINE_GENERATION_PROMPTS.md`. Never mix templates within one entry.
- Every entry must pass the full 13/13 gate (`auditQaGoldTemplate` / `auditTop10GoldTemplate` + `rubricSignOff`) and the similarity-at-birth scan before its publish flag flips. The daemon inherits EVERY law in `PIPELINE_GENERATION_PROMPTS.md` and `SCRUBBER_SPEC.md` without exception.

## RATE (the knob — config file, not code)

`gen/config.json`:
```
{
  "entriesPerHour": 10,           // TOTAL new entries per hourly batch
  "perTopicPerHour": null,        // alternative mode: N per topic per hour
  "topicRotation": true,          // rotate through all topics fairly
  "activeHours": "0-23",          // e.g. "6-22" to generate only daytime
  "paused": false,
  "deployEveryHours": 6
}
```
- **DEFAULT MODE:** entriesPerHour=10 TOTAL, topicRotation=true — each hour serves the next topics in the rotation so every topic gets fresh content on a recurring cycle. 10/hr = 240/day = solid steady growth.
- **KORY'S REQUESTED MODE:** set perTopicPerHour=10 and entriesPerHour=null → 10 per topic per hour across all ~40 topics (~400/hr, ~9,600/day). The daemon MUST print the projected daily volume + provider load estimate to run_status when this mode is enabled, and require the operator to have set it manually in config — the daemon never escalates its own rate.
- Change the rate anytime by editing config.json; daemon re-reads it at the top of every hour. paused:true = skip batches until unpaused.

## QUESTION SUPPLY (uniqueness at the source)

- Maintain `gen/question_bank.json` per topic. Each hourly batch pulls unused questions for its topics. Generate questions programmatically from topic seed patterns + the approved title-variety patterns (no pattern >5% within a topic, per existing law).
- **DEDUPE BEFORE GENERATING:** a candidate question is discarded if its normalized form matches or near-matches (>=0.85 similarity) any existing entry title or any previously used question in the bank. Never spend a DeepSeek call on a duplicate question.
- When a topic's bank runs dry, the daemon replenishes it (new seed expansion) and logs the replenishment. If replenishment can't produce genuinely distinct questions for a topic, the daemon SKIPS that topic and logs it — it never pads with rephrased duplicates.

## HOURLY BATCH FLOW (serial, per existing laws)

For each :00 wake:
1. Read config, read LESSONS.md, verify golden templates + SCRUBBER_SPEC.md on disk (HALT the batch and log if missing — never regenerate from memory).
2. Select topics + pull questions per rate mode. Classify each question (TOP_LIST vs GENERAL) per the locked classifier — route to the matching prompt's flow.
3. Generate serially: DeepSeek prose (prose-only restriction, placeholder protocol, delete-not-blur), image via the standard ladder (unique prompt+seed, storeGradedImage(), EXIF stamp, pHash-unique), fill the golden template exactly.
4. Gate each entry 13/13 with the surgical fix loop; 3 strikes → log to `gen/gen_failures.md`, move on. Then similarity-at-birth scan vs the topic; near-dup → differentiate per LAW-SIM-2 or discard, never publish.
5. Registry: single-writer, resume-safe lockfiles. A batch interrupted by crash/restart resumes; it never double-generates a question.
6. Circuit breaker: 20% rolling over last 50 entries. Trip → self-heal per the playbook (one attempt per cause), else STOP the daemon's generation (not the daemon) and surface the cause; the hourly wake still fires and reports "halted: <cause>" until fixed.
7. If a batch overruns the hour, finish it — never start batch N+1 while N runs (serial law). Skipped hours log; the daemon does not "catch up" by double-batching.

## DEPLOY CADENCE

Do NOT deploy every entry or every hour. Deploy on a fixed schedule from config (deployEveryHours, default 6): commit the accumulated passed entries (one commit: "GEN_DAEMON: <n> entries, <topics>"), fire the Netlify hook, wait state:ready, then live rendered-DOM spot check on 5 random new entries per LAW-DOM. Spot check fails → halt further deploys, log, surface.

## VISIBILITY + CONTROL

- Write `gen/run_status.json` continuously (same dashboard contract): current batch, entries generated today, gate pass rate, discards by reason, provider tallies, next wake time, projected daily volume.
- Add a GENERATOR card to the existing LAN panel: today's count, pass rate, PAUSE/RESUME button (writes paused flag), and the rate setting displayed read-only with current mode.
- Daily digest appended to `gen/daily_log.md`: date, generated, published, discarded (and why), failures, topics served.
- Windows persistence: register the daemon so it survives reboots (Task Scheduler at logon + hourly health check that restarts it if dead). PC must stay awake — remind operator once at launch if the power plan allows sleep.

## LAWS

- The daemon NEVER raises its own rate, never relaxes the 13/13 gate, never skips the similarity scan to hit quota. Quantity yields to quality every time — an hour that publishes 3/10 clean is a success; an hour that publishes 10/10 with a relaxed gate is a firing offense.
- All corrections append to this file + LESSONS.md per no-re-coaching.
- Build proof before launch (Phase-4 style): run ONE manual batch of 10, report gate scores, sim results, discards, and 3 live URLs for operator taste check. Only after operator approval does the hourly schedule arm.

=== END — BUILD gen_daemon.js, RUN THE PROOF BATCH, AWAIT MY GO TO ARM ===

## 🔒 DEPLOY LAW (permanent · 2026-07-11) — canonical: `DEPLOY_LAW.md`
1. **Classify every change first.** CONTENT/DATA (entries, bodies, images, scores, index rows) → **Blobs only, NEVER deploy**. CODE/TEMPLATE/ASSET (function, renderer, `.js`/`.css`/static, redirect) → **queue for the daily deploy**.
2. **`--prod` max ONCE/day**, end of the last machine run, and **only if the code queue is non-empty**. No queued code = no deploy that day.
3. **Draft deploys are FREE** (`netlify deploy`, no `--prod`) — test freely.
4. **Never misclassify code as content** to dodge a deploy — classify honestly.
5. **Exception:** operator says **"deploy now"** → urgent deploy allowed.
6. **Log every deploy** (date · what shipped) in `DEPLOY_LAW.md`. (Generated Q&As are CONTENT — Blobs only, never deploy; the daemon's `deployEveryHours` is superseded by this once-a-day CODE-only law.)
