# HANDOFF — image curation + homepage session (2026-07-04)

## DEPLOY (in progress)
- Draft deploy `btpimyykj` running. **Must PROMOTE via restore API after verifying** (never blind --prod).
  Draft URL + deploy id in the task output. Homepage changes below are LOCAL until promoted.

## Homepage (index.html) changes made this session
- Pulse News hero (`.mm.mm-hero`): shrunk to a single tiny tile (`grid-column:span 1;min-height:120px`).
- Hire-a-CRO (`.mm.mm-hire`): now the focal point — `grid-column:span 2;grid-row:span 3;min-height:640px`,
  large square-ish, NOT full-width. Tile text changed "Hire your Fractional CRO here" → **"CRO Coaching Tools"**.
- Hire tile background ROTATES every 30 min through `assets/hire-cro-1..8.jpg` (time-based:
  `Math.floor(Date.now()/1800000)%8+1`). Images are owner's downloads, graded+stamped. Removed the
  original watermarked #1, renumbered to 8.

## PENDING homepage requests (NOT done yet)
1. **Add a "Hands-On Tools" mosaic tile** linking to /tools (sales-rep recruiting calc, scheduling calc, etc.).
2. **/hire page (pulserevops.com/hire)** — add to the image-curation project so owner can supply images;
   the CRO tile links to /hire. Owner wants to give images for that page next.

## IMAGE CURATION — picks saved (NOT yet applied as live covers)
- Reference files (id -> {img,url}): `_cat_reference.json` (crop1), `_cat_reference2/3/4/5.json`,
  `_image_keepers.json` (fishing 19), `_movies_keepers.json` (movies 51).
- ~370 heroes curated. **Apply step still owed:** fetch each chosen url -> storeGradedImage ->
  coverPath(id) + stampDdgProvenance. Fishing keepers store section-index not url (handle separately).

## 🔴 CROP 5 BUG — wrong pillar labels (must redo 4 categories)
Real pillar identities (from blob index, NOT what I labeled):
- **sp = Famous Speeches** (Gettysburg/JFK/MLK) — I labeled "Sports". Owner: "all political." REDO.
- **tv = Vacation Destinations** (beaches) — I labeled "TV Shows". Owner: "all vacation destinations." REDO.
- **sw = Software** (CRM/Top-10s) — I labeled "Watersports". Owner: "none are water sports." REDO.
- **sk = Skill Drills** (sales) — I labeled "Skincare". REDO with sales/business framing.
- **cl = Country Clubs** — I labeled "Clubs"; actually close (golf/country clubs). Owner's CL picks likely OK.
- CR (Crabbing), BS (Book Summaries), NL (Nightlife) were CORRECT. Their picks are valid.
- SP/SK/SW/TV picks in `_cat_reference5.json` are against off-topic images — DISCARD + requery with correct
  queries: sp->"artistic historic speech oration [subject] fine art"; tv->"artistic [beach/destination]
  travel cinematic"; sw->"artistic [subject] software technology abstract office"; sk->"artistic [subject]
  sales training business office".

## NEXT UP (owner, end of session)
- **/hire page (`hire.html`, routed /hire in netlify.toml)** — build the SAME endless-loop scrolling
  mosaic as the homepage (`index.html`): grid of tiles + infinite-scroll JS that cycles the buffer
  forever. Owner wants images for it too (like the homepage curation). Reuse the homepage's `.mm`
  mosaic + endless-loop setInterval/observer pattern.
- Crop 6 is COMPLETE (60/60: SP/TV/SW/SK all 15). Saved in `_cat_reference6.json`.
- Owner said "TB one one..." (15 picks) but TB matches no built category — likely meant a new/next
  crop; unresolved, re-ask which pillar.

## STILL OWED
- Next crops at +25% each (12->15->19->24...), lead crop 6 with **tl (Pulse Tools, 10,949)** + **q
  (Knowledge, 7,865)** using office/tech-artistic query.
- **Learning bias**: fingerprint the ~370 approved picks (pHash) so the auto-run prefers owner-taste
  candidates. Then point the enforced auto-run at the whole library for the other ~33k pages.
- v2 spec remaining: picker queue UI, smoke test (proofs a-j). Core done: choke point + stamp + verify +
  retroactive sweep (see `_IMAGE_SCRUBBER_V2_SPEC.md`, `_IMAGE_LOOK_LOCK.md`).

## Servers
- Unicorn scrubber :8899 (leave Begin Scrub alone — spawns duplicate). Image dashboard + all galleries on :8891.
