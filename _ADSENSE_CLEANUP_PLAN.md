# ⚠️ STRATEGY PIVOT (owner 2026-07-08): CRO LEAD-GEN over AdSense
Owner chose to MAX the site for **CRO Syndicate fractional-CRO lead generation**, NOT AdSense (repeated "low value" rejections; ~400 views/day = AdSense pennies vs. one CRO client worth far more). CONSEQUENCES:
- **DO NOT consolidate/delete the CRO geo clone pages** ("fractional CRO cost/eval in [city/state]", 149+ tl####). They are now LEAD-GEN ASSETS capturing local intent → Kory. The tl checkpoint below FLIPS to "KEEP for lead-gen" (optionally raise quality, but don't prune the funnel).
- Non-CRO clone families MAY still be consolidated later if they add nothing (low priority now).
- AdSense = DE-PRIORITIZED. ads.txt/pub-ID not needed (not approved; won't reapply unchanged).
- New focus = maximize conversions on the CRO funnel (CTA/offer, money-pages, geo capture, tracking). See `_LEADGEN_PLAN.md`.

---

# ADSENSE / LOW-VALUE-CONTENT CLEANUP PLAN (DEFERRED + partly SUPERSEDED by lead-gen pivot, 2026-07-08)

Context: Google AdSense keeps rejecting the site for "low value content." Not a % threshold — it's a holistic review; the trigger for a large programmatic site is mass-production / thin-uniqueness / near-duplicate (doorway) pages. Traffic is healthy and growing (~400 views/day, +10–20%/day) — that helps; the blocker is duplication + originality, not traffic.

## ANALYSIS (2026-07-08, from _index.json — 35,458 entries)
- **CLONE FAMILIES: 466 families = 2,045 location-variant duplicate pages** (near-identical answer, only city/state swapped). THE doorway-page risk.
- Biggest family: **"How much does a fractional CRO cost in [city/state]?" = 149 pages** (tl#### = Pulse Tools/CRO pillar). Plus "what to look for / evaluate / part-time / near me in [state]" families (~40 each). "Top 10 Best Towns to Live in [state]" ×52 (arguably legit per-state intent).
- **DO NOT delete on `quality_score`**: 34,235 show <12 but that's the OLD /10 scale (not re-graded) — deleting on it would nuke the whole library. ❌
- **7,881 "malformed ids"**: too many to assume junk — needs a separate look before touching. ❌ (don't blanket-delete)
- visitor-question (vq) staging: 6.

## OWNER DECISION (2026-07-08)
- Approach = **CONSOLIDATE: keep 1 per family, 301-redirect the variants** (back up first, add redirects, update sitemap — no dead links).
- CRO geo pages specifically: owner said "whatever you recommend" → **deferred to work on later.**

## MY RECOMMENDATION (for when we resume)
1. **Non-CRO clone families** → consolidate keep-1 + redirect the rest. Clear win, low business risk.
2. **CRO geo families (tl#### fractional-CRO-by-city/state, ~149+)** → these are lead-gen BUT thin/doorway. Fractional CRO is remote/hybrid (the content itself says local supply is thin), so per-city value is low. Recommend: keep a SMALL curated set (1 national + a handful of top metros/regions), 301-redirect the long-tail city pages to the national/regional page. Middle ground: kills the doorway spam, keeps some geo lead-gen reach.
3. **Sequencing**: run the consolidation only when NO other job is writing `_index.json` (image runs, content batches) — both write it → clobber risk. Back up `_index.json` + deleted `answers/<id>.json` blobs first. Add 301s to netlify.toml/_redirects. Deploy (redirects + removed pages need a deploy; blob removal is live).
4. Also verify About/Contact/Privacy are linked in the footer (files exist: about.html/contact.html/privacy.html).
5. Do NOT touch mv/hf.

## 🚩 TRIGGER (owner 2026-07-08): DECIDE THE CLONE SITES WHEN THE IMAGE RUN REACHES `tl` (CRO PULSE TOOLS)
The tl pillar holds the CRO geo clone families (149+ "fractional CRO cost in [city/state]" etc.). **Before running the Pexels image run / content pass on `tl`, STOP and make the clone-consolidation decision with Kory** (consolidate long-tail city pages → national + few regional, redirect the rest — see recommendation above). Do not image-process 149 near-duplicate CRO pages until that decision is made — otherwise we grade + deploy images for pages we may redirect/delete. Flag surfaced at the tl step.

## STATUS: DEFERRED. Resume after the current Pexels image run + gm content pass are done and reviewed. Hard checkpoint at the `tl` pillar.
