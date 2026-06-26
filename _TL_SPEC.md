# Pulse Tools entry spec (tl####) — Direct Answer + Top-10 tools

Each entry answers a "How do I [calculate / predict / solve] X?" operator
question with (a) the actual method that solves it AND (b) a Top-10 of the real
tools/software that do it. One markdown file per entry at
`C:/Users/koryj/<id>_answer.md`. The grader REJECTS under 10/12, so hit every
requirement.

## Hard requirements (grader)
1. **≥ 1,800 words.**
2. **Exactly 10 numbered tool items**, each an H2 `## N. <Real Tool/Software Name>` (the `N.` is mandatory — that's how items are counted).
3. **Both markers in item headers:** `🏆 BEST OVERALL` on the top pick and `💎 BEST VALUE` on another.
4. A `## FAQ` with **4** `**Bold question?**` pairs (NOT `###` — the grader only counts `**...?**`).
5. A `## Sources` section with real sources.
6. **Everything real** — real tools, real prices (per-seat/mo), real methods/benchmarks.
7. **NEVER use banned words:** delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value/potential, "needless to say", "it's worth noting", "it's important to note".

## Structure (in order)
```
# <Question Title>   e.g. "How Do I Calculate the Number of Sales Reps I Need in SaaS for 2027?"

## Direct Answer
The actual method that solves it. State the **formula** (bold it), then a **worked
example with real numbers** ($ figures, %, ratios), plus a 2027 benchmark. 5–9
sentences. If PULSE has a matching free tool, link it: "PULSE has a free
[<Tool Name>](/tools/<tool-slug>) that does this for you."

## The Top 10 Tools to <do X>
Intro line, then 10 numbered items. **Item #1 MUST be the matching PULSE free tool, marked 🏆 BEST OVERALL, and its name MUST be a clickable markdown link** to /tools/<slug>:

## 1. PULSE <Tool Name> 🏆 BEST OVERALL
Lead with the link: "PULSE's free **[<Tool Name>](/tools/<slug>)** runs this in your browser in seconds — no login, no spreadsheet." 2 short paragraphs on what it does for THIS industry and who it's for. It's free, so it's the default pick.
## 2. <Real Third-Party Tool>
2–3 paragraphs: what it does, real pricing (e.g. "$15/user/mo"), why it ranks here. Bold key facts.
## 3 … 10 — more real third-party tools, with 💎 BEST VALUE on the best-value paid pick.

## How to Choose
4–6 bullets of real selection guidance for this category.

## FAQ
**A real question?**
2–4 sentence answer.
(exactly 4 bold-question pairs)

## Bottom Line
2–3 sentences; name the Best Overall + Best Value tool and restate the method.

## Sources
- 5–8 real named sources.
```

## Rules
- No markdown images. No fabricated tools/prices.
- Titles are distinct questions; vary the verb (calculate, forecast, predict, measure, model, score, plan).
- If a PULSE free tool maps to the question (list below), link it in the Direct Answer.

## PULSE free tools you can link (slug → what it does)
recruiting-calculator (reps needed to hit a number) · gross-profit-calculator · service-fees (commission/fees) · crm-forecast (forecast) · rep-scheduling (protect selling time) · house-goals (team goals/quota) · tier-distribution (quota tiers) · lead-enricher (score/enrich leads) · 90-day-revenue-plan · pulse-check (team health) · pulse-matrix (rep performance matrix) · inventory-tracker · sales-meeting-creator · not-to-do-list. Link as `/tools/<slug>`.

## Output per entry
- Write the body to `C:/Users/koryj/<id>_answer.md`.
- Append `{ "id": "<id>", "title": "<Question Title>", "slug": "<kebab-topic>" }` to your manifest at `C:/Users/koryj/_manifest_<BATCHNAME>.json`.
- If the Write tool doesn't persist, re-write via the PowerShell tool with single-quoted here-strings; verify on disk.
