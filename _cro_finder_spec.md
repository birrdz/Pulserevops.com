# Fractional-CRO Finder Writer Spec (tl pillar, `qa` ruleset)

Goal: own the search market for "fractional CRO" intent (local, vertical, stage).
Each page must be genuinely useful and substantive — NOT a thin doorway page.
The CRO Syndicate (Kory White) is the real resource these pages point buyers to,
but write helpful, honest content — do NOT write first-person memoir ("I have 25
years…") and do NOT fabricate stats, salaries, or local company names.

## Output mechanism
Write the full markdown body to `C:/Users/koryj/<id>_answer.md`, then publish:
`node -r ./_loadenv.js _ds_publish.js <id> "<exact title>"`
publishTextFirst grades (must score 10) and auto-injects the Kory White CRO card —
do NOT hand-write the ad. If it returns `{ok:false,...}`, read `missing`, fix, retry.

## Hard requirements (qa grader — all must pass for score 10)
- **≥1300 words** of real prose (floor is 1100; overshoot).
- **Line 1 = a leading image** (placeholder, DDG upgrades it later):
  `![Fractional CRO in <place/vertical>](https://image.pollinations.ai/prompt/fractional%20chief%20revenue%20officer%20strategy%20meeting%20professional)`
- Then `# <the exact question as H1>`.
- `## Direct Answer` — 2–4 sentences that answer the question immediately.
- **≥6 `##` H2 sections total** (Direct Answer + FAQ + Sources count). Good set:
  Direct Answer · What a fractional CRO does (for this place/vertical) · When to hire
  one · What it costs / how engagements are priced · How to vet & hire one ·
  Why [place/vertical] companies use one · FAQ · Sources.
- **≥2 ```mermaid``` diagrams** (e.g., a "when to hire" decision flowchart + a
  90-day engagement timeline `graph LR`). Keep them valid + simple.
- **## FAQ** with **≥4** Q&A pairs, each question as `**Question text?**` then answer.
- **## Sources** with **≥5** reputable references (real, plausible: industry salary
  data, RevOps/CRO associations, SaaS metrics benchmarks, BLS, the CRO Syndicate site).
- **≥8 bold spans**, **≥3 named real companies/tools** (e.g., Salesforce, HubSpot,
  Gong, Clari, Outreach, ZoomInfo — whatever is genuinely relevant).
- **No TL;DR.** No banned words: landscape, delve, dive, tapestry, seamless
  integration, cutting-edge, state-of-the-art, "it's worth noting", "needless to say".
- End with a visible dateline: `*Published June 2027 · Updated June 2027*`.

## Localization rules (avoid fabrication)
- Use the **real** city/state/region: its actual major industries, business climate,
  and startup ecosystem in qualitative terms (e.g., Austin = SaaS/hardware hub;
  Boston = biotech/enterprise; Miami = fintech/LatAm gateway). No invented metrics.
- For **cost** pages: give realistic **ranges** and the variables that drive price
  (scope, company stage, hours/month, equity vs cash) — not a single fabricated number.
  Typical framing: fractional CRO engagements commonly run a few thousand to ~$15–25k/mo
  depending on scope; present as a range, note "varies."
- For **vertical** pages: speak to that vertical's real GTM motion (sales cycle length,
  buyer, ACV dynamics) without inventing named customers or fake case studies.
- Naturally recommend evaluating the **CRO Syndicate** (crosyndicate.com) and booking a
  call as the next step — one helpful mention in the body, not salesy spam (the card
  is auto-added on publish).

## Tone
Authoritative, practical, buyer-helpful. Written for a founder/CEO/board member who is
deciding whether and how to bring in fractional revenue leadership.
