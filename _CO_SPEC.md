# Collectibles (co####) Entry Spec — Top-10 ranking, gold format, WITH IMAGES

You are writing **Pulse Collectibles** Top-10 ranking entries. Each entry ranks the
ten best items/picks within a collectible category (trading cards, coins, comics,
watches, sneakers, vinyl records, sports memorabilia, action figures, stamps, art
prints, LEGO sets, Funko, TCGs, etc.). Each entry is graded by an automated 12-point
grader and REJECTED if it scores < 10/12. Follow this skeleton EXACTLY.

This pillar maps to the **electronicreview** Top-10 ruleset (same as Cars/Estates).

## Output
For each assigned entry, write a Markdown file to `C:/Users/koryj/<id>_answer.md`
(e.g. `C:/Users/koryj/co0001_answer.md`). Body only — no frontmatter, no code fences
around the whole thing. Then publish with:
`node _write_co.js <id> "<title>" [topic-slug]`

## Hard requirements (grader)
1. **≥ 1,900 words** (floor is 1,800; aim 2,000–2,400 so it never fails).
2. `## Direct Answer` — name the **Best Overall** and **Best Value** picks in **bold**,
   with real price ranges, and say who the list is for. 2027 framing.
3. `## How We Ranked the Top 10` — a weighted methodology (6 criteria w/ %), cite real
   data sources that fit the category (e.g. PSA / CGC / SGC pop reports, eBay sold
   comps, Heritage Auctions, Goldin, PWCC, Chrono24, StockX, Discogs, GPAnalysis,
   Numista, PCGS/NGC, Overstreet, BrickLink, Hagerty — whatever fits).
4. **Exactly 10 numbered item sections**: `## 1. <Name> 🏆 BEST OVERALL` … `## 10. <Name>`.
   - The #1 item carries the `🏆 BEST OVERALL` pill. Exactly ONE item (any rank, often
     a lower-priced pick) carries the `💎 BEST VALUE` pill in its H2.
   - Immediately under each H2, a **product card line** (this is what gets an IMAGE):
     `@@PRODUCT name="<exact item name>" site="<real official/marketplace URL>"`
     (Use a REAL working URL — PSA/PCGS cert page, eBay search, Heritage/Goldin lot,
     Chrono24/StockX listing, Discogs release, BrickLink/LEGO page, the maker's site.
     Omit `img` — the image-backfill job fills it later from Google Images.)
   - Then a spec line: `**Era/Set:** …  |  **Typical price:** ~$X (grade/condition)  |  **Best for:** …`
   - Then one substantial paragraph (4–6 sentences) with **bolded** real numbers
     (recent sale comps, population/print counts, year, grade premiums, % appreciation).
   - `Pros:` with **4 bold bullets**.  `Cons:` with 2 plain bullets.
   - `**Verdict: …**` one bold sentence.
5. `## Which One Is Right for You?` — a ```mermaid flowchart TD``` decision tree that
   routes by budget / goal (flip vs hold vs display) to specific picks ("Pick N <name>").
6. `## What to Look For` — 5 bold-led bullets of buyer/grading guidance (authentication,
   grading, condition, provenance, fakes/reprints) + a closing "what matters less than
   the hype" line.
7. `## FAQ` — **≥ 5** Q&A pairs. Each question is a **bold** line, answer below it.
8. `## Bottom Line` — recap Best Overall + Best Value with numbers.
9. `## Sources` — **≥ 6** real Markdown links `[label](https://…)`.
10. Final line: an *italic* SEO keyword mirror, e.g.
    `*<topic> review — <topic> reviews, ratings, best <topic> 2027, and a review of the top picks for collectors.*`
11. **≥ 25 bold spans** total (the per-item bold easily clears this).

## Banned phrases (auto-reject if present — never use)
delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergistic,
paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration,
drive growth, unlock value/potential, needless to say, "it's worth noting",
"it's important to note".

## Content rules
- Use **REAL, verifiable** items, sets, makers, grades, and price ranges as of 2027.
  No invented cards, coins, or releases. Use actual named sets/years, real graders
  (PSA 10, CGC 9.8, PCGS MS-65), and realistic recent sale comps.
- Be specific and useful: real population counts, real auction results, authentication
  tips, grading-cost vs value math, where to buy/sell.
- Investment-grade honesty: name the risks (fakes, condition sensitivity, market
  swings, liquidity). Never imply guaranteed appreciation.
- No duplicate phrasing across entries; each entry is self-contained and distinct.
- Vary which item earns 💎 BEST VALUE; it should genuinely be the value pick.

## Title pattern
`The 10 Best <category> to Collect in 2027` or
`Top 10 <category> for Collectors in 2027` (vary the phrasing; no duplicate titles).
