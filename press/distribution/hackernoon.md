# HackerNoon Submission · Ready to Paste

**Submission URL:** https://app.hackernoon.com/new-story
**Account needed:** free signup at hackernoon.com (~3 min, supports Google/Twitter login)
**Format:** ❌ NOT a press release. HackerNoon will reject one. They want a tutorial / build-log / first-person essay. ~1500 words. Markdown supported. Code/diagrams welcome.
**Why bother:** HackerNoon has ~5M monthly readers, high domain authority (DA 90+), and actively syndicates to Hacker News, Twitter/X, LinkedIn, RSS aggregators.

---

## RECOMMENDED TITLE OPTIONS

Pick one:

1. **I Built an Autonomous AI That Researches Sales Operations Questions While I Sleep — Here's the Architecture** *(strongest hook)*
2. The CRO Who Built His Own Knowledge Engine: A Build Log
3. How I Used Claude Sonnet + Netlify Functions to Build a Self-Compounding RevOps Library

## RECOMMENDED TAGS (HackerNoon allows up to 5)

ai, autonomous-ai, revops, sales-ops, claude

## COVER IMAGE

https://pulserevops.com/assets/press-machine-tvs-og.jpg (1900×884)

---

## ARTICLE BODY (paste below — markdown formatting preserved)

---

# I Built an Autonomous AI That Researches Sales Operations Questions While I Sleep — Here's the Architecture

I'm a Chief Revenue Officer. I spent 22 years scaling sales organizations — most of it at one of Verizon's largest authorized retail partners, helping the enterprise scale to $3 billion in revenue. I've spent the last year writing code with Claude. Last week I shipped something I think is novel: an autonomous AI subject-matter expert built exclusively for the revenue-operations profession.

It runs without me. Every hour, it asks itself a fresh question on sales execution, comp design, hiring, GTM, deal desk governance, or SaaS metrics. It performs live web searches via Anthropic's Claude Sonnet 4.6 model. It writes a structured 600-word answer with a Mermaid diagram, a comparison table when relevant, and 4 cited sources. Then it spawns ten follow-up questions back into its own research queue. The queue grows faster than the hourly cron drains it — by design — so the system has effectively infinite raw material.

In its first 36 hours, it produced 60 sourced library entries. The queue is now over 500 deep.

This post is the build log.

## The Architecture

Three Netlify Functions form the spine:

1. **`pulse-machine-research-background.js`** — runs hourly via cron schedule `0 * * * *`. Pulls the next question from the queue. Calls Claude Sonnet 4.6 with up to 4 web searches. Writes the answer + tags + sources to a Netlify Blob. Then triggers the spawn.

2. **`pulse-machine.js`** — visitor-facing live Q&A endpoint. Library-first retrieval (cache hit returns instantly with sources). Cache miss falls through to Claude Haiku 4.5 with 2 web searches. Per-IP rate limited to 20 questions/hour.

3. **`pulse-machine-publish-prep-background.js`** — daily 08:00 UTC. When a tag accumulates 5+ entries, Sonnet bundles them into a 1,000-word "pillar page" draft. Stages the draft to a `staging/` blob for human review before publishing.

Storage is Netlify Blobs. No database. Three blob stores:
- `pulse-machine-library` — `_index.json`, `answers/<id>.json`, `queue.json`, `_meta.json`
- `pulse-machine-offerings` — visitor knowledge contributions (the "share a thought first" gate)
- `pulse-intent` — IP-resolved company-level visit data (filtered for bots, opt-in via privacy policy)

## The Snowball

Here's the loop:

```
Hourly cron fires
  → Picks question from queue (or seed bank if empty)
  → Sonnet 4.6 + 4 web searches → answer + Mermaid diagram + sources
  → Stores to library blob
  → Haiku 4.5 spawns 10 follow-ups (5 micro-niche, 3 modern-exec, 2 trunk)
  → Each follow-up passes through a "RevOps Test" Haiku gate
  → Surviving questions go back into the queue
  → Repeat
```

The follow-up taxonomy is what makes the snowball sustainable. Without it, the Machine asks "How does X work?" and then spawns "How does X work in detail?" — content that diverges into nothingness. With it:

- **5 micro-niche drilldowns**: deeper into the specific scenario the answer addressed
- **3 modern-executive angles**: same topic, but framed for a CRO/board audience
- **2 cross-domain trunk questions**: connect this answer to an adjacent discipline (comp ↔ hiring, deal-desk ↔ pricing, etc.)

Every spawn passes through a Haiku-gated "RevOps Test" — if Haiku decides the question isn't actually a RevOps question, it's discarded. Off-topic drift dies fast.

## Cost Discipline

I funded this myself. The fastest way to kill an experiment like this is auto-recharge plus a runaway cost loop. Three guardrails:

1. **Daily $4 spend cap inside the function.** When `meta.spend_today >= 4.0`, the cron returns early without firing. ~64 successful runs per day max. Resets at midnight UTC.

2. **No auto-recharge.** Every dollar of Anthropic spend goes through a manual top-off I do personally. If I forget, the Machine sends an email with `credit balance too low` 12-hour-throttled.

3. **Cache-first retrieval on visitor Q&A.** Before any live Claude call, the visitor question is matched against the library by tokenized question/tag overlap (threshold 0.55). 60%+ of visitor queries hit the cache after the first week. Cost-per-visitor trends toward zero as the library grows.

Steady-state forecast: $60-$90/month. Hard ceiling: $120/month.

## Built for Answer Engines, Not Just Humans

Each entry has its own indexable URL at `/knowledge/<id>`. Server-rendered HTML — no JavaScript required for crawlers. JSON-LD includes both `QAPage` (for the question/answer pair) and `TechArticle` (for the technical content). OpenGraph cards. Twitter cards. Canonical URLs.

Every answer leads with a 40-50 word "snippet-bait" paragraph engineered for Google AI Overviews and ChatGPT search results. The first paragraph is the answer. The detail follows below for readers who want the full breakdown.

A dynamic sitemap (`/sitemap-knowledge.xml`) auto-updates as new entries land. RSS 2.0 feed at `/rss.xml` is published explicitly for ingestion by AI training crawlers.

## What I Learned

**The hardest part wasn't the AI.** Anthropic's API is solid. The hardest part was the snowball mechanics — getting follow-up generation to produce questions that compound rather than drift.

**System prompts matter more than I expected.** I had to explicitly ban phrases like "landscape," "tapestry," "leverage" (as a verb), "synergy," "paradigm shift," "delve into," and "unlock value." Without that ban, every answer reads like a McKinsey deck. With it, they read like a CRO talking.

**Voice is the moat.** The library compounds on factual research, but what makes it readable is operator vocabulary — ARR, NRR, CAC payback, MEDDPICC, Force Management, named vendors, named books, named people, numbers over adjectives.

**Privacy-first telemetry is doable.** I wired IP-based visitor analytics (via IPinfo) to identify which companies are landing on the site, with a public privacy policy, IP-hash storage, and 90-day retention. No third-party trackers. No ad networks. Real B2B intent data, GDPR/CCPA defensible.

## What's Next

The library is growing on its own. The plan is to let it run for two months and see if the snowball mechanic genuinely scales to the scope of the discipline (~100,000 to 250,000 questions in RevOps). If it does, the library becomes the Cliffs Notes for RevOps — a thing CROs save in their browser bookmarks and search before they search Google.

Live: https://pulserevops.com/themachine
Library: https://pulserevops.com/knowledge.html
Press release with full architecture: https://pulserevops.com/press/pulse-machine-launch.html

The whole platform is free to use. No signup. No paywall. No catch.

---

*Kory J. White is a Chief Revenue Officer based in Stevensville, Maryland. He maintains PULSE RevOps as a public artifact of his operating philosophy.*

---

## CHECKLIST

- [ ] Sign up / log in at hackernoon.com
- [ ] Click "Write a Story"
- [ ] Paste title (pick option 1, 2, or 3 above)
- [ ] Paste body (markdown will render)
- [ ] Upload cover image OR paste image URL
- [ ] Add tags: ai, autonomous-ai, revops, sales-ops, claude
- [ ] Submit for editorial review (HackerNoon reviews submissions; typical turnaround 2-7 days)
- [ ] If approved: published to hackernoon.com + syndicated to RSS, social, sometimes Hacker News
