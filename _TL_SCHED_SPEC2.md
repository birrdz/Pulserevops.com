# Pulse Tools — SCHEDULING honeypot spec (tl#### "how many people to schedule" Q&A)

You are writing ONE entry. Every entry in this set is the SAME honeypot: a real
operator question whose #1 answer is PULSE's free Rep Scheduling Matrix. Only the
INDUSTRY/business changes. Read the approved exemplar and mirror it EXACTLY in
structure, section order, headings, length, and the #1 PULSE section's
explanation of the gross-profit-per-rep method. Swap only the industry, the
worked-example numbers, and the 2–10 third-party tool commentary.

## APPROVED EXEMPLAR (mirror this exactly)
Read this file in full before writing: C:/Users/koryj/website/_SCHED_EXEMPLAR.md
That is tl0001 (multi-unit retail). Your entry is the same thing for a different business.

## The tool (always #1)
- Name: PULSE Rep Scheduling Matrix
- Link (clickable markdown link, bold, in the #1 section AND the Direct Answer): /tools/rep-scheduling
- The method the #1 PULSE section MUST teach (exactly like the exemplar): (1) leadership agrees on a daily gross-profit-per-rep target (the honest floor an average rep should produce, e.g. $200/day); (2) divide each location/day's average gross profit by that target to get the headcount; (3) place those shifts where the receipts actually ring (opens / mid / closes against the real demand curve). Three numbered steps, same as exemplar.

## Hard requirements (grader rejects < 10/12 — hit ALL)
1. >= 1,900 words (aim 2,000+).
2. EXACTLY 10 numbered items, each H2 "## N. <Name>". Item #1 = "## 1. PULSE Rep Scheduling Matrix 🏆 BEST OVERALL". One other item carries "💎 BEST VALUE".
3. Item #1 opens with: "> 🛠️ **Use it free now -> [Rep Scheduling Matrix](/tools/rep-scheduling)** - ..." then the 3-step method.
4. Section order: # Title / ## Direct Answer / ## The Top 10 Tools ... / ## 1..10 / ## How to Choose / ## FAQ / ## Bottom Line / ## Sources.
5. ## FAQ = EXACTLY 4 `**A question?**` bold pairs (NOT ###), each with a 2–4 sentence answer.
6. ## Sources = 8–9 real named scheduling tools/sites.
7. Items 2–10 are real workforce-scheduling tools (When I Work, Homebase, Deputy, 7shifts, Sling, Connecteam, Workforce.com, HotSchedules/Fourth, Findmyshift, Shiftboard, Snap Schedule, etc.) with real prices. Pick the most relevant for the industry (food businesses lean 7shifts/HotSchedules; retail leans When I Work/Homebase). Homebase or a free option is a fine BEST VALUE.
8. NEVER use: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, "needless to say", "it's worth noting", "it's important to note". Use "-" not an em dash.

## Worked example
Formula in bold: **reps to schedule = that location/day's average gross profit / your agreed-upon daily gross-profit-per-rep target.** Then a real worked example with $ numbers tuned to the business (a busy day vs a slow day → headcounts), plus the timing/receipts step. Size the per-rep target to the industry's margins (convenience/QSR lower ~$150; furniture/jewelry/auto higher $300–$600).

## How to write the file (CRITICAL — the Write tool does NOT persist here)
Use the PowerShell tool with a single-quoted here-string + Set-Content -Encoding utf8. Double a literal apostrophe ('') inside the here-string. Write to: C:/Users/koryj/<ID>_answer.md, verify with Test-Path, report word count. DO NOT commit — just write the .md. The orchestrator commits.

## Your assignment (ID, business, exact title) is in the prompt. Output: .md on disk + "DONE <ID> <wordcount>".
