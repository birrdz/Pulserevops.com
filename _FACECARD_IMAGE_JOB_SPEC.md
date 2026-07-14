# 🎴 FACE-CARD IMAGE JOB — LOCKED SPEC (owner 2026-07-09)

**Applies to every future face-card image job for any pillar.** First live job: GTM Playbooks (`gp`).

## Owner requirements (verbatim intent)
1. **ALL NEW images** — regenerate every entry's face card; do not reuse the current ones.
2. **Artsy** — artsy generated images, not literal/plain stock.
3. **Source = alternate DDG + Pollinator, START with DDG.** Run DDG for the FIRST HALF of the batch, then at the halfway point switch to Pollinator (Pollinations flux), and keep alternating in halves/blocks. (verbatim: "alternate ddg and pollinator start ddg. then halfway thru image launch Pollinator and so on")
4. **"My filter I like"** = the warm-mosaic cine-grade in `_ddg_facecard_lib.js` `applyCineGrade()`:
   - `.modulate({saturation:1.08, brightness: bright?0.98:1.01})`
   - `.linear(1.10, 6)` — +10% contrast, LIFTED shadows (filmic, not crushed)
   - `.recomb([[1.07,0,0],[0,1,0],[0,0,0.93]])` — warm cast highlights+midtones, cool touch in blue
   - `.sharpen()` — light unsharp mask
   - Locked in `_IMAGE_LOOK_LOCK.md`. This is THE look; never replace it.
5. **MODIFIED + BRIGHTENED + SHARPENED "to perfection"** — push brightness + sharpen HARDER than the base grade. Add a stronger variant on top of `applyCineGrade` (e.g. an extra `.modulate({brightness:~1.06-1.10})` + a second stronger `.sharpen({sigma:1})` pass). Do NOT crush the warm look — brighten within it.
6. **Relate to the industry/topic in the TITLE** — each image relates to the specific GTM topic/industry named in that entry's title (e.g. "Reseller and VAR channel", "International geo-expansion", "Inbound demand-capture", "Sales-assisted PLG mid-market"). Use `buildFluxFaceQuery(id, question, attempt)` for the topical prompt.
7. **200 images, APPROVAL-GATED** — generate 200, owner approves/disapproves via a **gallery link** (LAN, like the dashboard). Disapproved → regenerate. Only approved images get assigned.
8. **Assign + DUPE AFTER #200, spread EVENLY** — first 200 entries get unique approved images; the rest REUSE the 200 distributed evenly (no adjacent duplicates).
9. **Gallery shows ONLY today's NEW images** — the approval gallery displays only images generated in THIS run; never show old/existing face cards. (verbatim: "don't show me any old images new today only")
10. **New images OVERWRITE existing** — approved images overwrite the current `/assets/qa/<id>.jpg` face cards. (verbatim: "these will overwrite existing")
11. **Selection room (cook loop)** — approved/checked images move to a "selection room" and **gradually get enhanced + sharpened over repeated passes** ("over and over"). Implement as an iterative refiner that re-polishes each approved image from its ORIGINAL raw with parameters ramping toward a ceiling (avoid cumulative over-sharpen artifacts). Keeps improving until assigned. (verbatim: "images selected need to sit and cook in selection room and gradually get enhanced and sharpen over and over")
12. **ONE at a time — no 2-parallel** DDG or Pollinator. Strictly sequential image generation. (verbatim: "only use 1 at a time no 2 parrallel ddg or pollinator")
13. **Self-learning stagger** — no fixed cooldowns/throttles; the generator tunes its own gap adaptively (speed up on success, back off on 429/throttle) to the fastest cadence that avoids throttling, and PERSISTS the learned optimum (`_gp_pool_pace.json`). (verbatim: "self learn stagger times to optimize writing w no throttles or cds")

## Pipeline (reuse — do NOT reinvent)
- Lib: `_ddg_facecard_lib.js`; runner pattern in `_all_flux_facecards.js`.
- **Prompt (topical):** `buildFluxFaceQuery(id, question, attempt, guideKeywords)` (lib ~2580). DDG path: `makeDdgFaceCover` / `ensureDdgFaceCover`. Flux path: `makeFluxFaceCover`.
- **Grade (THE only file writer / choke point):** `gradeFaceCardFromBuffer(rawBuf, coverPath(id), {question, bright})` — grades from RAW, stamps EXIF `PULSE_GRADE=v_final`, returns {hash,size,w,h,path}. Wraps `applyCineGrade` via `faceCardTileGradeOpts`. For brighter/sharper: add overrides or a post-pass, still through this choke point.
- **Path / size:** `coverPath(id)` = `/assets/qa/<id>.jpg`; face-card tile `FACE_CARD_TILE_W`×`FACE_CARD_TILE_H` (wide mosaic tile), S=760.
- **Dupe-after-N pool system (built for exactly this):** `POOL_REUSE_AFTER` (default 50 → set **200**), `runPillarPoolBuild(pillar, target, opts)`, `collectPillarPoolBatch` → `autoCuratePoolBatch` → `commitPillarPoolBatch` / `discardPillarPoolBatch`, `nextPoolSlot` / `ensurePillarPoolSlot`, `buildPoolQuery(pillar, slot, attempt)`, `poolImageRel`.
- **Pollinations:** `POLLINATOR_API_KEY`; 20s cooldown floor (`POLLINATOR_FREQ_MS=20000`).
- **Provenance:** `stampCoverProvenance` → `cover_src:'flux'|'ddg'`, `face_title_baked:true`, `entry.img='/assets/qa/<id>.jpg'`; strong-read + write back to `_index.json`.
- **DEPLOY-GATED:** `assets/qa/` is gitignored and STATIC — new images only go live after a **draft→restore deploy** (owner-gated). Blob index stamp is instant; the JPGs need the deploy.
- **Concurrency:** image gen (DDG/Pollinations) is a SEPARATE lane from DeepSeek text — safe to run alongside the near-dup/stub rewrite queues.

## Approval workflow (build)
1. `_gp_pool_gen.js` — generate 200 → staging `assets/qa/_gp_pool/NNN.jpg` + `_gp_pool_manifest.json` {slot, sourceId, sourceTitle, provider(ddg|flux)}; DDG first half, Pollinator second half.
2. Approval gallery — HTML grid on LAN (dashboard pattern): image + title + approve/disapprove toggle → `_gp_pool_approval.json`. Give owner the link.
3. `_gp_assign.js` (after approval) — copy approved → 420 `coverPath(id)`, dupe after 200 evenly, regenerate disapproved, stamp provenance.
4. Deploy `assets/qa` (draft→restore) on owner go.

## First job target
- Pillar `gp` (GTM Playbooks) — **420 entries**, all currently `/assets/qa/<id>.jpg`.
- Status **2026-07-09: DOCUMENTED, not started.** 346 near-dup rewrite running concurrently (safe, separate lane).
