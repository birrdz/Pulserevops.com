# 🔒🔒 HERO RESOLUTION LAW — shared renderer (owner 2026-07-10, no-re-coaching)

**Recurrence root cause (why KPI broke the same way GTM/others had):** the renderer's `pickHeroUrl`
(`netlify/functions/pulse-machine-entry.js`) treated the registered face-card `/assets/qa/<id>.jpg` as a
"legacy flux placeholder" and **skipped it sitewide**, then fell back to the first hotlinked body image.
For Top-10 / ranking-list pillars (KPI `ik`, and any `RANKING_LIST_NO_TOP_HERO` topic) `noTopHero` made
`pickHeroUrl` return `''`, so NO face-card rendered at all — the page showed body/product chart images.
Because the cover files ARE unique per entry (proven: 7/7 distinct hero srcs, 5/5 distinct pHashes), this was
**never a file/pHash/keying bug** — it was a renderer resolution bug. It recurred because the earlier fixes
were topic-scoped and the correction was never hoisted to the shared renderer.

## THE LAW (shared, every pillar, no exceptions)
1. **The entry HERO = the entry's REGISTERED cover** — `idxEntry.img` when it is `^/assets/qa/`. Always.
   Never inferred from body content, never a shared/global fallback image. The hero sits OUTSIDE `.body`, so
   it renders even for Top-10 / `noTopHero` ranking lists (the product list still renders below it).
   Implemented at `pickHeroUrl` caller: `const registryCover = /^\/assets\/qa\//.test(idxEntry.img) ? idxEntry.img : ''; const heroUrl = registryCover || pickHeroUrl(...)`.
2. **Grader must STAMP atomically.** Every graded image must carry EXIF `PULSE_GRADE=v_final`
   (via `storeGradedImage()` → `.withMetadata({exif:{IFD0:{ImageDescription:'PULSE_GRADE=v_final'}}})`).
   Any grade output missing the stamp FAILS the gate. Custom graders (e.g. `_gp_grade.js`) MUST stamp too, or
   route through `storeGradedImage()`.

## STRUCTURAL GATE (run before shipping any renderer/cover change — a third recurrence must fail, not ship)
- **5-src diff:** render 5 different entries from a pillar; the hero `src` must be 5 DISTINCT `/assets/qa/<id>.jpg`.
  `for id in ...; do curl -s "$URL/knowledge/$id" | grep -oE 'entry-cover"[^>]*><img src="[^"]+"'; done` → 5 unique or FAIL.
- **EXIF spot-check:** 10 random covers must have `PULSE_GRADE=v_final` in EXIF, or FAIL.
- **Honest-metric rule:** no "done" without the 5-src diff output + EXIF count in the report.

## Proven working (2026-07-10)
Shared renderer edit shipped; live verify: `ik0719 → /assets/qa/ik0719.jpg`, `gp0001 → /assets/qa/gp0001.jpg`;
5-src gate 7/7 distinct. Deploy 6a505c64244685e737a14ae0 promoted. See [[feedback_image_look_lock_4444]].
