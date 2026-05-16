# Dev.to Submission · Ready to Paste

**Submission URL:** https://dev.to/new
**Account needed:** free signup (~2 min — Google/GitHub/Twitter login works)
**Format:** Technical post in markdown · ~1000-1500 words · code blocks render natively · Mermaid does NOT render (paste as image or code-fenced text)
**Why bother:** Dev.to has DA 92, ~3M monthly readers, friendly to both AI and ops content, every post syndicates to RSS + their feed algorithm. Better for a slightly more technical / less corporate angle than HackerNoon.

---

## RECOMMENDED TITLE

**Building "The Machine": An Autonomous AI Subject-Matter Expert (Architecture + Cost Discipline)**

Or pick:
- *I Wired an AI to Research Its Own Questions Every Hour — Here's What Happens at Hour 36*
- *60 Sourced Answers in 36 Hours: An Autonomous Knowledge-Engine Build Log*

## RECOMMENDED TAGS (Dev.to allows 4)

`#ai`  `#serverless`  `#showdev`  `#productivity`

(`#showdev` gets featured on the "Show" landing — high visibility for builds.)

## COVER IMAGE

https://pulserevops.com/assets/press-machine-tvs-og.jpg

---

## ARTICLE BODY (paste below)

---

## TL;DR

I built an autonomous AI knowledge engine for revenue operations. It runs on Netlify Functions + Anthropic Claude. It generates its own research questions, executes live web searches, writes structured answers with diagrams, and self-publishes to a public knowledge library — without me touching it. 60 sourced entries in 36 hours. ~$60-90/month steady-state cost. Free and public.

Live: [pulserevops.com/themachine](https://pulserevops.com/themachine)

---

## The architecture in three functions

```
netlify/functions/
├── pulse-machine-research-background.js    # hourly cron · Sonnet 4.6 + 4 web searches
├── pulse-machine.js                        # visitor Q&A · Haiku 4.5 + cache-first
└── pulse-machine-publish-prep-background.js # daily 08:00 UTC · pillar drafts
```

### 1. The hourly research cron

```js
// netlify.toml
[functions."pulse-machine-research-background"]
  schedule = "0 * * * *"
```

Each fire:

1. Pulls the next question from a `queue.json` blob (priority desc, oldest first)
2. Calls Claude Sonnet 4.6 with `web_search_20250305` tool, `max_uses: 4`
3. Parses the response — extracts text, citations from `web_search_tool_result` blocks
4. Writes the answer + tags + sources to `answers/<id>.json`
5. Triggers the spawn (described below)

### 2. The snowball spawn

This is the part that makes the library compound. After every answer, a second pass with Claude Haiku 4.5 generates **ten typed follow-up questions**:

- 5 `micro_niche` — deeper into the specific scenario the answer addressed
- 3 `modern_exec` — same topic framed for a CRO/board audience
- 2 `trunk` — cross-domain branches into adjacent disciplines

Each follow-up passes through a Haiku-gated "RevOps Test" — if Haiku decides the question isn't relevant to the domain, it's discarded. Off-topic drift dies fast.

The surviving questions go back into `queue.json`. The queue grows faster than the cron drains it (10 in, 1 out per hour) — by design, the system always has more raw material than time to research it.

### 3. Cost guardrails

The fastest way to kill an autonomous-AI experiment is auto-recharge plus a runaway feedback loop. Three guardrails:

```js
const DAILY_SPEND_CAP = 4.0;
let meta = await getMeta(store);
if (meta.spend_today >= DAILY_SPEND_CAP) {
  return { statusCode: 200, body: 'cap reached' };
}
```

1. **Daily $4 cap inside the function.** ~64 successful runs/day max. Resets at midnight UTC.
2. **No auto-recharge anywhere.** Manual top-off only.
3. **Cache-first retrieval on visitor Q&A.** Tokenized question/tag overlap match (threshold 0.55) before any live API call. ~60% of visitor queries hit the cache after the first week.

Steady-state cost forecast: $60-$90/month. Hard ceiling: $120/month.

## Storage: Netlify Blobs, no database

```js
const tok = process.env.BLOBS_PAT;
const sid = process.env.NETLIFY_SITE_ID;
const store = getStore({ name: 'pulse-machine-library', siteID: sid, token: tok });
```

Three blob stores:

- `pulse-machine-library` — `_index.json`, `answers/<id>.json`, `queue.json`, `_meta.json`
- `pulse-machine-offerings` — visitor knowledge contributions
- `pulse-intent` — IP-resolved company analytics (privacy-policy disclosed)

Heads up: Netlify reserves the `NETLIFY_*` env-var prefix. Use `BLOBS_PAT`, not `NETLIFY_BLOBS_TOKEN` — the latter silently fails to load.

## SEO architecture for the answer-engine era

Each library entry is server-rendered at `/knowledge/<id>` with full JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "QAPage", "mainEntity": {"@type": "Question", ...}},
    {"@type": "TechArticle", "headline": "...", "datePublished": "..."}
  ]
}
```

Plus:

- 40-50 word "snippet-bait" first paragraph (engineered for Google AI Overviews / Perplexity / ChatGPT search)
- Mermaid diagram on every entry (rendered client-side via CDN)
- Dynamic sitemap auto-updates as new entries land
- RSS 2.0 feed published explicitly for AI training crawlers
- IndexNow protocol push to Bing/Yandex on every new URL

## What I learned

**System prompts matter more than model choice.** I had to explicitly ban phrases like `landscape`, `tapestry`, `leverage` (verb), `synergy`, `paradigm shift`, `delve`, `unlock value`, `seamless integration`. Without that ban, every answer reads like a McKinsey deck. With it, they read like an operator talking.

**The follow-up taxonomy is the moat.** Generic "generate 10 follow-ups" produces drift. Typed follow-ups (5 niche / 3 exec / 2 trunk) produce a graph that branches in directions the operator audience actually cares about.

**Visitor-question caching is non-negotiable.** Without cache-first retrieval, cost-per-visitor scales linearly with traffic. With it, cost trends toward zero as the library compounds.

**Privacy-first telemetry is doable.** I wired IP-based visitor analytics via IPinfo with a public privacy policy, IP-hash storage, and 90-day retention. No third-party trackers. Real B2B intent data, GDPR/CCPA defensible.

## Numbers from the first 36 hours

- 60 library entries published
- 524 questions in the autonomous queue
- $2.86 spent today (of $4 daily cap)
- 1.6 average runs/hour
- ~340-380 words per entry, including the diagram
- 6 sources cited per entry on average

## Next steps

- 30+ industry-specific how-to pages (Vet, Dental, SaaS, HVAC, Real Estate, Telecom shipped — 30 more on a templated structure I'm replacing)
- Multi-AI orchestration (cross-validate via OpenAI + Gemini + Perplexity) — deferred until single-Claude is proven
- Pillar pages auto-bundled when a tag accumulates 5+ entries (already running, human-reviewed before publishing)

The whole thing is free to use. No signup. No paywall. Live at [pulserevops.com](https://pulserevops.com).

If you want the full press release with the architecture diagram and the wall-of-CRTs hero: [pulserevops.com/press/pulse-machine-launch.html](https://pulserevops.com/press/pulse-machine-launch.html)

Built solo with Claude Code. Deployed on Netlify. Storage is just blobs. The whole system is shockingly simple — the hard part was the snowball mechanics, not the AI.

If you're building something similar in your own domain, hit me up — happy to compare notes.

---

## CHECKLIST

- [ ] Sign up / log in at dev.to
- [ ] Click "Write a Post"
- [ ] Paste title + tags + cover image URL
- [ ] Paste body (markdown renders natively)
- [ ] Add canonical URL = https://pulserevops.com/press/pulse-machine-launch.html (preserves your SEO juice on the original)
- [ ] Publish
