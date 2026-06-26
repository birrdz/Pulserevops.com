# AI Infrastructure (ai####) Entry Spec — Top-10 ranking, gold format, WITH IMAGES

You are writing **Pulse AI Infrastructure** Top-10 ranking entries. Each entry ranks the
**ten best AI tools for a specific task or use-case** (animation, resume building, video
editing, copywriting, coding, image generation, transcription, voice cloning, slide
decks, logo design, music, chatbots, data analysis, SEO, email, etc.). Each entry is
graded by an automated 12-point grader and REJECTED if it scores < 10/12. Follow this
skeleton EXACTLY.

This pillar maps to the **electronicreview** Top-10 ruleset (same as Cars/Collectibles/Estates).

## Output
For each assigned entry, write a Markdown file to `C:/Users/koryj/<id>_answer.md`
(e.g. `C:/Users/koryj/ai0001_answer.md`). Body only — no frontmatter, no code fences
around the whole thing. Then publish with:
`node _write_ai.js <id> "<title>" [topic-slug]`

## Hard requirements (grader)
1. **≥ 1,900 words** (floor is 1,800; aim 2,000–2,400 so it never fails).
2. `## Direct Answer` — name the **Best Overall** and **Best Value** AI tools in **bold**,
   with real pricing (free tier / monthly $), and say who the list is for. 2027 framing.
3. `## How We Ranked the Top 10` — a weighted methodology (6 criteria w/ %) such as output
   quality, ease of use, price/value, speed, integrations/export, and learning curve. Cite
   real reference points (G2, Capterra, Product Hunt, official changelogs, benchmark
   leaderboards like LMArena/Artificial Analysis, model cards) where they fit.
4. **Exactly 10 numbered tool sections**: `## 1. <Tool Name> 🏆 BEST OVERALL` … `## 10. <Tool Name>`.
   - The #1 tool carries the `🏆 BEST OVERALL` pill. Exactly ONE tool (any rank, often a
     free or low-cost pick) carries the `💎 BEST VALUE` pill in its H2.
   - Immediately under each H2, a **product card line** (this is what gets an IMAGE):
     `@@PRODUCT name="<exact tool name>" site="<real official URL>"`
     (Use the REAL official site — e.g. https://runwayml.com, https://www.canva.com,
     https://openai.com, https://www.midjourney.com, https://eleven labs.io. Omit `img`
     — the image-backfill job fills it later from Google Images.)
   - Then a spec line: `**Best for:** …  |  **Pricing:** Free / $X/mo (real plan name)  |  **Platform:** web/desktop/API`
   - Then one substantial paragraph (4–6 sentences) with **bolded** real specifics
     (underlying model, real plan prices, output formats, export limits, integrations,
     notable users, launch/update year).
   - `Pros:` with **4 bold bullets**.  `Cons:` with 2 plain bullets.
   - `**Verdict: …**` one bold sentence.
5. `## Which One Is Right for You?` — a ```mermaid flowchart TD``` decision tree that
   routes by budget / skill level / output goal to specific picks ("Pick N <name>").
6. `## What to Look For` — 5 bold-led bullets of buyer guidance (free vs paid, data
   privacy/training opt-out, export & licensing rights, integration with your stack,
   output watermarks/limits) + a closing "what matters less than the hype" line.
7. `## FAQ` — **≥ 5** Q&A pairs. Each question is a **bold** line, answer below it.
8. `## Bottom Line` — recap Best Overall + Best Value with prices.
9. `## Sources` — **≥ 6** real Markdown links `[label](https://…)` (official sites,
   pricing pages, credible reviews/benchmarks).
10. Final line: an *italic* SEO keyword mirror, e.g.
    `*<task> AI tools review — best AI for <task>, <task> AI reviews, ratings, best AI <task> tools 2027, and a review of the top picks.*`
11. **≥ 25 bold spans** total (the per-tool bold easily clears this).

## Banned phrases (auto-reject if present — never use)
delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergistic,
paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration,
drive growth, unlock value/potential, needless to say, "it's worth noting",
"it's important to note".

## Content rules
- Use **REAL, verifiable** AI tools, real company names, real pricing tiers, and real
  underlying models as of 2027. No invented tools or fake prices. If a price changed,
  use the current public plan name and price.
- Be specific and useful: real free-tier limits, real export formats, real model names
  (GPT, Claude, Gemini, Llama, Flux, Veo, Sora, etc. where actually used), privacy/opt-out
  facts, and where each tool genuinely wins or falls short.
- Honest trade-offs: name the real limits (watermarks, credit caps, hallucination,
  licensing, learning curve, lock-in). Never imply a tool does more than it does.
- No duplicate phrasing across entries; each entry is self-contained and distinct.
- Vary which tool earns 💎 BEST VALUE; it should genuinely be the value pick (often a
  strong free tier).

## Title pattern
`The 10 Best AI Tools for <Task> in 2027` or
`Top 10 AI Tools for <Task> in 2027` (vary the phrasing; no duplicate titles).
Examples: "Top 10 AI Tools for Animation in 2027", "The 10 Best AI Tools for Creating
Resumes in 2027", "Top 10 AI Tools for Video Editing in 2027".
