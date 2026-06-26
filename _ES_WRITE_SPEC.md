# Estates (es####) Entry Spec — Top-10 ranking, gold format

You are writing **Pulse Estates** Top-10 luxury / real-estate ranking entries. Each
entry is graded by an automated 12-point grader and REJECTED if it scores < 10/12.
Follow this skeleton EXACTLY. Model entry: `C:/Users/koryj/_es0001_template.md` —
match its depth, tone, and structure.

## Output
For each assigned entry, write a Markdown file to `C:/Users/koryj/<id>_answer.md`
(e.g. `C:/Users/koryj/es0051_answer.md`). Body only — no frontmatter, no code fences
around the whole thing.

## Hard requirements (grader)
1. **≥ 1,900 words** (floor is 1,800; aim 2,000–2,400 so it never fails).
2. `## Direct Answer` section — name the **Best Overall** and **Best Value** picks in
   **bold**, with real price ranges, and say who the list is for. 2027 framing.
3. `## How We Ranked the Top 10` — a weighted methodology (6 criteria w/ %), cite real
   data sources (e.g. Zillow, Redfin, NAR, Realtor.com, U.S. Census, local MLS, Niche,
   Builder Magazine, J.D. Power — whatever fits the topic).
4. **Exactly 10 numbered item sections**: `## 1. <Name> 🏆 BEST OVERALL` … `## 10. <Name>`.
   - The #1 item carries the `🏆 BEST OVERALL` pill. Exactly ONE item (any rank, often
     a lower-priced pick) carries the `💎 BEST VALUE` pill in its H2.
   - Immediately under each H2, a product card line:
     `@@PRODUCT name="<exact item name>" site="<real official URL>"`
     (Use a REAL working URL — official community/builder/city/chamber/Zillow page.
     Omit `img` — an image backfill job fills it later.)
   - Then a spec line: `**Type:** …  |  **Median/Entry price:** ~$X  |  **Best for:** …`
   - Then one substantial paragraph (4–6 sentences) with **bolded** real numbers
     (prices, founded year, acreage, HOA, population, appreciation %, etc.).
   - `Pros:` with **4 bold bullets**.  `Cons:` with 2 plain bullets.
   - `**Verdict: …**` one bold sentence.
5. `## Which One Is Right for You?` — a ```mermaid flowchart TD``` decision tree that
   routes by budget / lifestyle to specific picks (reference "Pick N <name>").
6. `## What to Look For` — 5 bold-led bullets of buyer guidance + a closing "what
   matters less than the hype" line.
7. `## FAQ` — **≥ 5** Q&A pairs. Each question is a **bold** line, answer below it.
8. `## Bottom Line` — recap Best Overall + Best Value with numbers.
9. `## Sources` — **≥ 6** real Markdown links `[label](https://…)`.
10. Final line: an *italic* SEO keyword mirror, e.g.
    `*<topic> review — <topic> reviews, ratings, best <topic> 2027, and a review of the top picks for buyers.*`
11. **≥ 25 bold spans** total (the per-item bold easily clears this).

## Banned phrases (auto-reject if present — never use)
delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergistic,
paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration,
drive growth, unlock value/potential, needless to say, "it's worth noting",
"it's important to note".

## Content rules
- Use **REAL, verifiable** communities, builders, cities, neighborhoods, and price
  ranges as of 2027. No invented developments. If listing a metro's neighborhoods,
  use actual named neighborhoods; if builders, actual named firms; if markets, actual
  cities with realistic median prices.
- Be specific and useful: real HOA ranges, real median list prices, real amenities,
  real appreciation trends, founded years, acreage.
- No duplicate phrasing across entries; each entry is self-contained and distinct.
- Vary which item earns 💎 BEST VALUE; it should genuinely be the value pick.
