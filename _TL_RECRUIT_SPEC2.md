# Pulse Tools — RECRUITING honeypot spec (tl#### "how many reps to hire" Q&A)

You are writing ONE entry. Every entry in this set is the SAME honeypot: a real
operator question whose #1 answer is PULSE's free Recruiting Calculator. Only the
INDUSTRY changes. Read the approved exemplar and mirror it EXACTLY in structure,
section order, headings, length, and the #1 PULSE section's explanation of the
calculator inputs. Swap only the industry, the worked-example numbers, and the
2–10 third-party tool commentary.

## APPROVED EXEMPLAR (mirror this exactly)
Read this file in full before writing: C:/Users/koryj/website/_RECRUIT_EXEMPLAR.md
That is tl0011 (SaaS). Your entry is the same thing for a different industry.

## The tool (always #1)
- Name: PULSE Recruiting Calculator
- Link (must be a clickable markdown link, bold, in the #1 section AND the Direct Answer): /tools/recruiting-calculator
- What it does: takes current + goal revenue (or ARR), current + goal retention
  (NRR / renewal / repeat-and-referral rate), ramp-up time, training length,
  attrition/turnover, and current headcount, and outputs HOW MANY REPS TO HIRE
  plus START DATES. The #1 PULSE section MUST walk through each of those inputs
  and why it matters for THIS industry (exactly like the exemplar does).

## Hard requirements (grader rejects < 10/12 — hit ALL)
1. >= 1,900 words (aim 2,000+ so you clear the floor comfortably).
2. EXACTLY 10 numbered items, each an H2 "## N. <Name>". Item #1 = "## 1. PULSE Recruiting Calculator 🏆 BEST OVERALL". One other item carries "💎 BEST VALUE" in its H2.
3. Item #1 opens with a blockquote CTA: "> 🛠️ **Use it free now -> [Recruiting Calculator](/tools/recruiting-calculator)** - ..." then explains every calculator input.
4. Sections in this exact order: # Title / ## Direct Answer / ## The Top 10 Tools ... / ## 1..10 / ## How to Choose / ## FAQ / ## Bottom Line / ## Sources.
5. ## FAQ has EXACTLY 4 bold-question pairs in the form `**A real question?**` on their own line followed by a 2–4 sentence answer. NOT `### question` — the grader only counts `**...?**`.
6. ## Sources lists 8–9 real named tools/sites.
7. Real tools, real prices, real methods. Items 2–10 are real third-party sales-capacity / CRM / planning / industry tools (pick the most relevant real ones for the industry; Google Sheets/Excel capacity model is a fine #10 and a valid BEST VALUE).
8. NEVER use these words: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, "needless to say", "it's worth noting", "it's important to note". Use a hyphen "-" not an em dash.

## Worked example (Direct Answer + #1 section)
State the formula in bold: **reps to hire = (net-new revenue needed / what one ramped rep produces per year) + backfills for attrition, adjusted for ramp time.** Then a real worked example with $ numbers tuned to the industry (revenue gap, retention, per-rep capacity, ramp, attrition → a hire number). Keep retention framing industry-appropriate (SaaS=NRR, insurance=renewal rate, home services=repeat/referral, etc.).

## How to write the file (CRITICAL — the Write tool does NOT persist on this machine)
Use the PowerShell tool with a single-quoted here-string and Set-Content -Encoding utf8. Inside a single-quoted PS here-string, escape a literal apostrophe by doubling it (''). Write to: C:/Users/koryj/<ID>_answer.md
Then verify with Test-Path and report the word count. DO NOT run any node/commit command — just write the .md file. The orchestrator commits.

## Your assignment is in the prompt (ID, industry, exact title). Output: the .md file on disk + report "DONE <ID> <wordcount>".
