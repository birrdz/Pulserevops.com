# FAQ generation instructions

For each assigned entry ID:
1. Read `C:\Users\koryj\website\faq_gen\<id>.txt` — it has `TITLE:` and `BODY:` of a RevOps article.
2. Write `C:\Users\koryj\website\faq_gen\<id>.faq.md` containing ONLY a Markdown FAQ section in EXACTLY this format:

```
## FAQ

**<question ending in ?>**
<2-4 sentence answer>

**<question ending in ?>**
<2-4 sentence answer>
```
...exactly 5 question/answer pairs total.

RULES (strict):
- Each question is a **bold** line ending in "?"; the answer is plain text on the next line(s), 2–4 sentences.
- The 5 questions must be REAL, specific follow-up questions a reader of THIS article would ask, drawn from its ACTUAL content — real tools, numbers, prices, sources, names, and roles mentioned in the BODY. No generic filler. No duplicate questions across the 5.
- Answers must be concrete and consistent with the article body. Do not invent statistics.
- NEVER use these words/phrases: delve, tapestry, landscape, holistic, ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, needless to say, "in today's", "it's worth noting", "it's important to note".
- The file MUST start with `## FAQ`. No code fences, no commentary, no repeating the article body.
