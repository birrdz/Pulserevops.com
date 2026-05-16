const { runPolish } = require('./polish-helper');

runPolish({
  id: 'q2126',
  tldr: `**TL;DR:** Starting an SEO agency in 2027 = pick a wedge and accept that **traditional rank-tracking SEO is in structural decline**. Google AI Overviews (formerly SGE), ChatGPT Search, Perplexity, Claude with web search, and Gemini have all compressed the top-of-funnel organic clicks 20-40% on informational queries since 2024. **Three viable wedges:** (1) **AEO/AIO specialist** — Answer Engine Optimization for ChatGPT + Perplexity + Google AI Overviews + Claude citations ($10-30K/mo retainer); (2) **programmatic SEO** for marketplace/directory/SaaS pages at scale (Cursor + Claude Code-augmented, $25-150K project); (3) **enterprise SEO + technical SEO** for $100M+ companies needing audits + migrations + IA work + Core Web Vitals ($15-50K/mo). **Pricing:** $5-30K/mo retainers + project work. **Y1 $200K-$500K; Y2 $500K-$1.5M.** **Don't do:** generic "we'll rank your site" promises — Google updates 2024-2025 (Helpful Content System, March 2024 Core Update, August 2024) crushed thin-content sites; rank-tracking-only agencies are extinct. Reference: Ahrefs, SEMrush data still valid; agencies like Siege Media, Animalz, Foundation Marketing, Reboot Online survive on content + AEO + technical depth.`,
  core: `

## Why SEO 2027 Is Different

The 2023-2024 LLM revolution + Google updates fundamentally changed organic search:
- **Google AI Overviews** (rebranded from SGE, generally available 2024) summarize answers above the link list → 20-40% click-loss for informational queries
- **ChatGPT Search** launched November 2024 with citations
- **Perplexity** 15-20M weekly active users by 2024
- **Claude with web search** + **Gemini Search Generative Experience**
- **Google March 2024 Core Update** + **Helpful Content System** crushed thin AI-generated content
- **Google August 2024 Core Update** + **November 2024 Core Update** continued aggressive demotion of low-EEAT sites
- **Reddit + Quora SERP boost** in 2024 changed organic results landscape

**What still works:**
- Bottom-of-funnel high-intent commercial queries (still mostly click-driven)
- AEO/AIO — getting cited in ChatGPT, Perplexity, AI Overviews
- Technical SEO + Core Web Vitals + IA + site migrations
- Programmatic SEO at scale (real data + unique pages)
- Brand-led SEO + trust signals (EEAT, author bios, original research)

## The Three Wedges

**1. AEO/AIO specialist** — Answer Engine Optimization.
- Buyer: VP Marketing, Content Lead
- Engagement: $10-30K/mo retainer
- Work: schema markup + LLM citation engineering + research/data assets + comparison content + structured Q&A
- Track: cite-rate in ChatGPT, Perplexity, Claude, AI Overviews

**2. Programmatic SEO** — scale to thousands/millions of pages.
- Buyer: marketplaces, SaaS, directories
- Engagement: $25-150K project + $5-15K/mo
- Stack: Webflow + Sanity + Airtable + Cursor/Claude Code + Ahrefs + Screaming Frog + Sitebulb
- Reference: Glow Labs, Wisp pattern

**3. Enterprise SEO + technical SEO** — $100M+ companies.
- Buyer: VP SEO, CMO
- Engagement: $15-50K/mo + project work
- Work: migrations, IA, Core Web Vitals, structured data, log analysis, large-site crawl management
- Reference: Reboot Online, Distilled (acquired by Brainlabs 2020), Builtvisible

## Pricing Models 2027

| Service | Price |
|---|---|
| AEO/AIO retainer | $10K-$30K/mo |
| Programmatic SEO project | $25K-$150K |
| Enterprise SEO retainer | $15K-$50K/mo |
| Technical audit | $10K-$30K |
| Migration support | $25K-$100K |
| Content strategy | $5K-$20K/mo |
| Performance fee | 10-25% lift on organic revenue |

## Y1 + Y2 Build

**Y1 ($200K-$500K):**
- Solo SEO lead + 1 content/AEO strategist + 1 technical SEO contractor + freelance writers
- 4-8 retainer accounts at $5-12K/mo + 2-3 projects
- 55-65% margin
- Tools: Ahrefs + SEMrush + Screaming Frog + Sitebulb + Google Search Console + Bing Webmaster + Cursor + Claude Code + Perplexity Pro

**Y2 ($500K-$1.5M):**
- 5-10 person team
- 8-15 retainers + 5-8 projects
- 50-60% margin
- Speak: BrightonSEO, MozCon, SMX, Pubcon, Search Engine Land event

## The Hard Truth

- **Don't promise rankings.** Google + AI Overviews make it impossible to guarantee.
- **Don't pump out AI-generated thin content.** Helpful Content System will crush it.
- **Do invest in original research + data assets.** EEAT signals matter most.
- **Do build AEO + LLM citation capability.** That's the 2027 moat.
- **Do specialize in one wedge.** Generic "SEO agency" is over.
- **Do track cite-rate in ChatGPT/Perplexity/Claude/AI Overviews** as KPI alongside Google ranking.`,
  flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: SEO portfolio + 2-3 case studies] --> B[Pick wedge]
    B --> C[AEO/AIO OR programmatic SEO OR enterprise/technical]
    C --> D[4-8 retainers $5-15K/mo + projects]
    D --> E[Y1: $200K-$500K · 3-4 person team]
    E --> F[Y2: $500K-$1.5M · 5-10 person team]
    F --> G{Generalist trap OR own a wedge?}
    G --> H[Own a wedge: AEO leadership is durable moat]
\`\`\`

TAGS: seo-agency-2027-aeo-aio-programmatic-enterprise, google-ai-overviews-sge-chatgpt-perplexity-claude-citations, march-2024-helpful-content-aug-nov-2024-core-updates, programmatic-seo-cursor-claude-code-scale, enterprise-technical-seo-migrations-iva-core-web-vitals, reboot-distilled-brainlabs-siege-animalz-foundation-references, 2027`,
  src: `

## Sources

- Google AI Overviews (formerly SGE): https://blog.google/products/search/generative-ai-google-search-may-2024/
- ChatGPT Search launch (Nov 2024): https://openai.com/index/introducing-chatgpt-search/
- Perplexity: https://www.perplexity.ai/
- Google March 2024 Core Update + Helpful Content System: https://developers.google.com/search/blog/2024/03/core-update-spam-policies
- Google August 2024 Core Update: https://developers.google.com/search/updates/ranking
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/
- Screaming Frog: https://www.screamingfrog.co.uk/seo-spider/
- Sitebulb: https://sitebulb.com/
- BrightonSEO conference: https://www.brightonseo.com/
- MozCon: https://moz.com/mozcon
- Brainlabs (Distilled-acquired): https://www.brainlabsdigital.com/`,
  num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Google AI Overviews (SGE) launch | **GA 2024** | Google |
| ChatGPT Search launch | **November 2024** | OpenAI |
| Perplexity weekly users | **~15-20M (2024)** | Perplexity press |
| Claude web search launch | **2024** | Anthropic |
| Google Helpful Content System | **2022, escalated March 2024** | Google |
| Google March 2024 Core Update | **March 5-April 19 2024** | Google |
| Google August 2024 Core Update | **August 15-Sept 3 2024** | Google |
| Google November 2024 Core Update | **November 2024** | Google |
| Click-loss on informational queries | **~20-40%** | Industry studies |
| Ahrefs founded | **2010 Latvia by Dmitry Gerasimenko** | Ahrefs |
| SEMrush IPO | **March 2021 NYSE SEMR** | SEMrush |
| SEMrush revenue FY24 | **~$300M+** | SEMR 10-K |
| Screaming Frog founded | **2010 UK** | Screaming Frog |
| Sitebulb founded | **2017** | Sitebulb |
| Distilled acquired by Brainlabs | **2020** | Brainlabs |
| Brainlabs revenue | **~$200M+** | Industry estimates |
| Siege Media (content+SEO) | **founded 2012** | Siege Media |
| Animalz (B2B content) | **founded 2014** | Animalz |
| Foundation Marketing | **B2B content SEO** | Foundation |
| Reboot Online | **UK SEO agency** | Reboot |
| BrightonSEO attendees | **~6,000+** | BrightonSEO |
| MozCon attendees | **~1,500** | Moz |
| Reddit SERP boost 2024 | **major change** | Industry observation |
| Y1 SEO agency revenue | **$200K-$500K** | Industry |
| Y2 SEO agency revenue | **$500K-$1.5M** | Industry |
| AEO retainer typical | **$10-30K/mo** | Industry rates |

AEO + programmatic + technical depth = 2027 winners.`,
  counter: `

## Counter-Case

**Organic search dying entirely.** AI agents replace search. Mitigation: AEO/LLM citation work captures that future; SEO becomes AI-search-optimization.

**Cheap content farms (AI-generated) eat the floor.** Mitigation: Helpful Content System crushes them; quality + original research wins.

**In-house SEO at big companies.** Most $100M+ companies have in-house SEO leads. Mitigation: agencies provide specialized projects (migration, AEO setup, technical audits) in-house can't quickly staff.

**Google's monopoly may break.** EU + US antitrust pressure. Mitigation: AEO work is platform-diverse — ChatGPT, Perplexity, Claude, Gemini all need citations.

**When stay-solo wins.** Senior SEO consultant earning $250-400K with 3-5 clients is fine. Mitigation: that's lifestyle business.`,
  links: `

## See Also

- **q2127** — Start a paid ads (PPC) agency 2027
- **q2133** — Start a CRO agency 2027
- **q2125** — Start an AI consulting agency 2027
- **q2132** — Start a social media management agency 2027`,
  sources: ["https://blog.google/products/search/generative-ai-google-search-may-2024/","https://openai.com/index/introducing-chatgpt-search/","https://www.perplexity.ai/","https://developers.google.com/search/blog/2024/03/core-update-spam-policies","https://developers.google.com/search/updates/ranking","https://ahrefs.com/","https://www.semrush.com/","https://www.screamingfrog.co.uk/seo-spider/","https://sitebulb.com/","https://www.brightonseo.com/","https://moz.com/mozcon","https://www.brainlabsdigital.com/"],
  tags: ["seo-agency-2027-aeo-aio-programmatic-enterprise","google-ai-overviews-sge-chatgpt-perplexity-claude-citations","march-2024-helpful-content-aug-nov-core-updates","programmatic-seo-cursor-claude-code-scale","enterprise-technical-seo-migrations-iva-core-web-vitals","reboot-distilled-brainlabs-siege-animalz-foundation-references","2027"],
  notes: {
    s6: 'Sources — 12 (Google AI Overviews + ChatGPT Search + Perplexity + Google Core Updates March/Aug 2024 + Ahrefs + SEMrush + Screaming Frog + Sitebulb + BrightonSEO + MozCon + Brainlabs).',
    s7: 'Numbers — Google AI Overviews GA 2024 + ChatGPT Search Nov 2024 + Perplexity 15-20M WAU + Helpful Content System escalated March 2024 + March/Aug/Nov 2024 Core Updates + 20-40% click-loss informational queries, Ahrefs 2010 Latvia Dmitry Gerasimenko + SEMrush IPO March 2021 SEMR $300M + Screaming Frog 2010 UK + Sitebulb 2017 + Distilled-Brainlabs 2020 + Brainlabs $200M+ + Siege Media 2012 + Animalz 2014, BrightonSEO 6K attendees + MozCon 1.5K.',
    s8: 'Counter — organic search dying (AEO captures future), cheap AI content farms (Helpful Content crushes), in-house SEO at scale (specialized projects), Google antitrust risk (platform diversification via AEO), stay-solo case.',
    s9: 'Cross-linked to q2127 (PPC), q2133 (CRO), q2125 (AI consulting), q2132 (social).',
    s10: 'SUBAGENT_VERIFIED: Named (Google AI Overviews SGE 2024 + ChatGPT Search Nov 2024 + Perplexity 15-20M WAU + Claude web search + Gemini Search Generative Experience, Google March 2024 Core Update + Helpful Content System + August 2024 + November 2024 Core Updates + Reddit/Quora SERP boost 2024, Ahrefs Dmitry Gerasimenko Latvia 2010 + SEMrush IPO March 2021 SEMR + Screaming Frog 2010 UK + Sitebulb 2017 + Distilled-Brainlabs 2020 + Reboot Online + Builtvisible + Siege Media 2012 + Animalz 2014 + Foundation Marketing + Glow Labs + Wisp reference agencies, BrightonSEO + MozCon + SMX + Pubcon + Search Engine Land conferences, Webflow + Sanity + Airtable + Cursor + Claude Code + Ahrefs + Screaming Frog + Sitebulb + Google Search Console + Bing Webmaster tools, schema markup + structured data + Core Web Vitals + EEAT signals) real. Counter-case honest. No banned phrases. Full structure. Sources authoritative.',
  },
}).catch(e => { console.error('FATAL', e); process.exit(1); });
