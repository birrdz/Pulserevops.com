# Coaching (cg####) Entry Spec — Sales-Coaching Q&A, gold format

> **Pillar mix (locked):** `cg####` is **half Top-10 rankings + half operator Q&A** (1:1). This spec is for the **Q&A half** only. Top-10 entries use the electronicreview / Top-10 grader. See `.cursor/rules/coaching-pillar-mix.mdc`.

You are writing **Pulse Coaching** entries: practical, manager-facing **Q&A answers about
coaching salespeople**. Each entry answers ONE real coaching question a sales manager / VP /
enablement leader would ask (e.g. "How do you coach a rep who won't prospect?", "How do you
run a deal-coaching session that actually moves the deal?"). Each entry is graded by an
automated grader (cg maps to the **qa** ruleset) and REJECTED if it scores < 10/12. Follow
this skeleton EXACTLY.

## Output
Write a Markdown file (body only — no frontmatter, no outer code fences) to
`C:/Users/koryj/<id>_answer.md` (e.g. `C:/Users/koryj/cg0001_answer.md`). Then publish with:
`node _write_cg.js <id> "<question>" [topic-slug]`

## Hard requirements (grader — must clear ≥10/12)
1. **≥ 1,400 words** (hard floor 1,200 per the QA LAW; aim 1,500–2,000). Value, not padding.
2. `### Direct Answer` — **NO TL;DR anywhere** (the Direct Answer replaces it). 3–6 sentences
   that answer the coaching question head-on and name the core move. Lead with the answer.
3. **≥ 6 H2/H3 sections** total. Use the coaching structure below.
4. **≥ 2 ```mermaid``` diagrams** — one **diagnosis decision tree** (`flowchart TD`) and one
   **coaching cadence/loop** (`flowchart LR`). Real branching, not decoration.
5. `## FAQ` — **≥ 5** Q&A pairs. Each question is a **bold line ending in `?`** (`**...?**`),
   answer in the paragraph below it.
6. `## Sources` — **≥ 6** real Markdown links `[label](https://…)` to credible sources
   (HBR, Gong Labs/Gong.io research, Sales Hacker, RAIN Group, Sandler, Challenger/Gartner,
   Winning by Design, Salesforce/Outreach blogs, SBI, Richardson, CSO Insights, etc.).
7. **≥ 10 bold spans** total (the scripts + key terms easily clear this).
8. **≥ 3 named real entities** — real methodologies/tools/companies (GROW model, Sandler,
   Challenger Sale, MEDDIC/MEDDPICC, SPIN, Gong, Salesforce, Outreach, Clari, Chorus,
   Winning by Design, RAIN Group, etc.).
9. No banned phrases (list below).

## Required structure (in order)
- `### Direct Answer` — answer first, name the move, who it's for, 2027 framing where relevant.
- `## Why This Happens — Diagnose Before You Coach` — root-cause the behavior: **skill vs.
  will vs. knowledge vs. system/territory**. Include the **diagnosis ```mermaid flowchart TD```**
  that routes a manager from the symptom to the real cause.
- `## The Coaching Conversation` — **verbatim manager scripts**: the exact questions to ask and
  language to use (lean on the **GROW model** — Goal, Reality, Options, Will — or a named
  framework). Bold the key questions. Make it copy-pasteable for a 1:1.
- `## The Coaching Plan / Cadence` — a concrete weekly or **30/60/90** plan, with the second
  **```mermaid flowchart LR```** showing the coaching loop (observe → diagnose → coach →
  practice → measure → repeat).
- `## Drills & Role-Play` — specific reps the manager runs to build the skill (call reviews,
  role-play scenarios, scorecards).
- `## What to Measure` — the **leading indicators** that prove the coaching is working
  (activity, conversion, ramp, win-rate, behavior change) — not just lagging quota.
- `## Common Mistakes Managers Make` — 4–6 honest pitfalls (rescuing the rep, coaching to the
  deal not the skill, no follow-through, coaching everyone the same).
- `## FAQ` — ≥5 **bold?** Q&A pairs.
- `## Bottom Line` — 2–4 sentence recap of the one move that matters.
- `## Sources` — ≥6 real links.
- Final line: an *italic* SEO keyword mirror, e.g.
  `*Sales coaching for <topic> — how to coach <topic>, sales manager coaching guide, rep coaching framework, and a coaching playbook for 2027.*`

## Content rules
- **Real, specific, useful.** Reference real frameworks (GROW, Sandler, Challenger, MEDDIC,
  SPIN, Command of the Message), real tools (Gong, Chorus, Salesforce, Outreach, Clari,
  Salesloft), and real research where it fits. No invented studies — if you cite a stat,
  attribute it to a plausible real source (Gong Labs, RAIN Group, CSO Insights, HBR).
- **Manager's point of view.** The reader is the coach (manager/VP/enablement), not the rep.
- **Scripts must be verbatim and usable.** Give the actual words, not "ask about their goals."
- **Honest.** Name when coaching won't fix it (wrong-fit hire, comp/territory problem, a
  performance issue that needs a PIP, not more coaching).
- No duplicate phrasing across entries; each entry is self-contained and distinct.
- 2027 framing where relevant (AI call-coaching, hybrid teams, longer cycles, buying committees).

## Banned phrases (auto-reject if present — never use)
delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy/synergistic,
paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration,
drive growth, unlock value/potential, needless to say, "it's worth noting",
"it's important to note".

## Question pattern
Phrase the title as a real coaching question, e.g.
"How do you coach a sales rep who won't prospect?",
"How do you coach a rep who's great at demos but can't close?",
"How do you run an effective deal-coaching session?",
"How do you coach a new SDR through their first 30 days?".
Capitalize correctly, fix acronym casing (SDR/AE/CRO/MEDDIC/SaaS), end with `?`.
