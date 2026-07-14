# Kory's Fixer + Daily Driver — build spec (2026-07-14)

Fresh control panel: `fixer_panel.js` on **http://localhost:8905** (`start_fixer.bat`). Owner-triggered, DeepSeek-only, never deployed. Drives `sim_scan.js`, `sim_transform.js`, `gen_daemon.js`.

## ① Daily Driver (generator)  — STATUS: building
- **Duration timer** — operator sets how many hours; runs over and over (one after another) until the timer expires, then auto-stops (`config.runUntil`).
- **Pillar dropdown** — pick one pillar, or ALL (rotate every pillar).
- **Notes box** — free text "what I'm looking for." The generator STARTS on that exact topic, then slowly BRANCHES OFF into adjacent angles over successive cycles (`config.genNotes` → DeepSeek-generated question seeds + used-bank dedupe drift).

## ② Fixer — pods of 100, grouped by pillar  — STATUS: building
- Group by **pillar/topic first**, then split each pillar into **pods of 100 by entry-number range**: `tl 1–100`, `tl 101–200`, … `tl 401–500` (ranges keyed off idNum, e.g. tl0001 = 1).
- Sweep pod by pod (scan → fix full pipeline). When a whole pod's 100 are scrubbed/done, **remove that pod from the list** (persist a done-pods ledger in `sim/panel_pods.json`) so it's never attempted again.
- Pod scope = pillar + 100-block; engines already accept id-prefix/range scopes. Done pod = all its ids in the FIXED ledger → dropped from the active list.
- **Auto-run option:** one continuous run — when a pod finishes it immediately advances to the next pod, pillar after pillar, until STOP (skips done pods).

## ③ Image step (Pexels) — STATUS: todo
Operator has a **Pexels API key**. The image stage searches Pexels by keyword and places images per the two golden templates:

STATUS: DONE ✓ (owner-run/deploy to see live). Fixer now calls `ensureDdFixerImages(..., forceAll:true)` in `sim_transform.js` → overwrites existing images with fresh CLEAN Pexels (replaces baked-title heroes like ai445). DD + Fixer share `_dd_fixer_images.js`. Face generator (`_stamp_title_face.js`) verified pure resize/crop — NO text baking. Pexels path verified working with the key (live search + download returns clean photos). Bank-first, then live Pexels search; Pexels-only.

The two golden templates need DIFFERENT image counts — the code must detect which template and place the right number:

**Q&A / essay template (GENERAL, q11133) — 3 images total:**
- Face card (cover) from a Pexels keyword search — the SAME image doubles as the top image card (they match).
- Then ~2 similar images spaced through the body (roughly one image every two blocks of text).

**Top-10 template (aq1158) — 11 images total:**
- 1 face card from a Pexels keyword search.
- For each of the 10 ranked items: search Pexels for THAT item's title and place its image at that number (10 item images).

## ④ Title step + baked-title hero images — STATUS: todo
- Use the title ALREADY on the Q&A / live on the main site (current canonical title). Do NOT fall back to an older/prior title that had problems.
- CONCRETE EXAMPLE (owner 2026-07-14, /ai-infrastructure/ai445): page H1 title is correct ("How much does AI Infra cost in 2027?") but the HERO IMAGE is an OLD BAKED-TITLE mosaic face card — garbled title "…uch does AI Infra cost ?" burned into an off-topic collage (books + legs). This is the "old titles coming back" symptom.
- Fix (ties to ③ + ⑧): the image step must DETECT baked-title / mosaic-face heroes and REPLACE (overwrite) them with a clean Pexels keyword photo — NO text baked into the image. Hero = /assets/qa/<id>.jpg clean; browse square = <id>.sq.jpg clean. Never reuse a baked mosaic face as the hero.

## ⑤ Post-fix placement — STATUS: todo
- After every Q&A is fixed, it must surface in **Recents** on the main page.
- It must also drop into its **own pillar-topic box** — a copy in that entry's matching pillar section (confirmed 2026-07-14: "vet pillar" = the pillar topic).

## ⑥ Pexels-ONLY image sourcing — STATUS: CONFIRMED ✓
- Audit result: `_image_provider_rotate.js` is hard-locked Pexels-only ("No Pollinator/Cloudflare/HF/Grok/DDG"), uses `api.pexels.com/v1/search` + `PEXELS_API_KEY` (throws if missing), serial 1-worker. `_dd_fixer_images.js` = "Pexels library → Pexels search → NEVER pollinations." Other image keys already removed from .env.local (owner 2026-07-13).
- Remaining loose end: `sim_transform.js` line 16 imports `_ddg_facecard_lib` but NEVER calls it (dead import) — delete to prevent regression.
- Open build for "image right during fixing": `stageImage` is a FAKE no-op; real placement runs post-gate via `stampIqPass → ensureDdFixerImages`. Verify it actually lands the right counts: Q&A = 3 (face=top + 2 body), Top-10 = 11 (1 face + 10 items).

## ⑦ Typos / mojibake on the MAIN SITE — STATUS: todo (owner flagged 2026-07-14)
- Live header/nav shows UTF-8 mojibake: "RÃ©sumÃ©" (Résumé), "ðŸ"… Book a Call" (📅), "$0â†'$200M" ($0→$200M), "MARYLAND-BASED, NATIONWIDE Â·". Encoding bug in the template/served HTML (Latin-1 vs UTF-8). Find + fix the source strings / charset.

## ⑧ Fixer overwrites existing images — STATUS: todo
- When the fixer places Pexels images it must OVERWRITE the existing image(s), not skip when one already exists.

## Front-end batch (queues into ONE draft deploy)
- **Auto-scroll:** DONE ✓ — `js/pulse-idle-scroll.js` neutered to a no-op (stub API kept).
- **Ambient audio:** already a no-op stub in code (`pulse-ambient.js`, owner 2026-07-12); live site likely still serves the old audio version → the draft deploy removes it. No code change needed.
- **Homepage typos:** header/nav/cards FIXED in `index.html` (·, →, 📅, 📞, 🚀, —, ▾, é/Résumé, … ellipsis). REMAINING: scrolling-marquee emoji (💼📈🎯📊💰🧭✅⏱️), double-encoded CSS comments, and the SAME mojibake site-wide across other HTML → do as a dedicated MAP-based surgical script (NOT a latin1 round-trip — that would corrupt the already-fixed chars).
- **Square fade-refresh (NEW):** DONE ✓ — `js/pulse-square-refresh.js` (standalone add-on, wired into index.html). Every 15s each visible row cross-fades one random square to a fresh one from the off-screen pool. Visual verify via the draft-deploy preview.

## ⑨ Content: Mythics Emergent — STATUS: todo (after all builds)
- Piece 1: in-depth "Top 10 things Mythics Emergent should do in 2027."
- Piece 2: a full insights/company-info deep-dive on Mythics Emergent.

## ⑩ Search bar — ghost writing / predictive text — STATUS: fixed (verify on deploy)
- Bug: ghost inline-completion only fired when a full question-title started with the query (`list[i].n.indexOf(ql)===0`) — question titles never do, so ghost rarely appeared → felt bugged.
- Fix (`js/pulse-search.js paintGhost`): completion corpus now = recent searches + example prompts + top-ranked result titles, prefers shortest completion. Tab/→ accepts. Dropdown predictive results already worked.

## ⑪ Square images render black — STATUS: likely deploy-freshness
- ik/ra squares show black image area on LIVE; `.sq.jpg` files exist locally (ik 684, ra 573) → newer squares likely not deployed. Deploy → recheck; if still black, lazy-hydration bug (IntersectionObserver root=sc).
- Square-refresh fix: `js/pulse-square-refresh.js` now only reuses ALREADY-LOADED cards as fresh donors (never swaps in an unhydrated/blank placeholder).

## ⑫ Bottom tiles → squares model — STATUS: done (verify on deploy)
- Answer pages: old random "crawl tiles" already removed in code (owner 2026-07-13, not yet deployed).
- Interweave "related in the library" (SEO + human cross-link) converted from text rows to the CURRENT squares model — image tile + gold category + gold serif title on black — in `netlify/functions/pulse-machine-entry.js` (relatedHtml + .rel-sq CSS). Deploy to see live.
- TODO: check pillar HUB pages for the same old tiles (separate files) and apply the squares model there too if present.

## ⑬ Branded-card + backgrounds — STATUS: resolved
- pulse-og "Every RevOps Answer / One Free Library" branded card appears as some heroes (e.g. gm71) because the entry's OWN file (/assets/qa/<id>.jpg) IS an old branded image — URL looks legit so URL-bans miss it, but Fixer `forceAll:true` regenerates from clean Pexels → replaced when fixed. pulse-og.svg/png also hard-banned in `_image_hard_bans.js`; renderer fallback = img-missing.svg (never pulse-og).
- Main page: already SOLID BLACK from first paint (index.html html,body #000 !important + JS lock). No change.
- Answer pages: KEEP tan/editorial reading surface (owner 2026-07-14) — black frame + cream middle (#FBF8F1/#ECE3D2/#FBF3E4). Intentional, no change.

## ⑭ Square motion — STATUS: drift done; orbit tabled
- Slow drift: DONE ✓ — `js/pulse-square-drift.js` (wired into index.html). Each row ping-pong drifts (~16px/s), pauses on hover/touch, reduced-motion safe.
- FUTURE IDEA (tabled): squares ORBIT a central "round building" centerpiece — big canvas/CSS-3D build, heavy on 24k tiles; scope as its own piece with a mockup after seeing drift live. Don't rush.

## Laws to honor
- Owner presses START; Claude builds/watches only (owner-triggered writes).
- DeepSeek writes text; images via Pexels here (operator key).
- Fixer full pipeline per URL: sim → quality 10/10 → title → image → 13/13 gate.
- Gate server must be up for fixes/gen: `GATE_ONLY=1 GOLD_SKIP_IMG_GATE=1 node _scrub_button_server.js` (8899).
