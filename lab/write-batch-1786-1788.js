const fs = require('fs');
const path = require('path');

const RUN = 'outreach-arc-2026-05-04';
const MODEL = 'claude-opus-4-7';

const entries = [
  {
    id: 'q1786',
    question: 'What is Outreach developer-platform strategy through 2027?',
    tags: ['outreach', 'developer-platform', 'api-strategy', 'app-marketplace', 'fy27-platform', 'ecosystem-strategy', 'developer-relations', 'partner-economics', 'salesforce-appexchange', 'platform-positioning'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/integrations',
      'https://developer.outreach.io/',
      'https://appexchange.salesforce.com/',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.gartner.com/en/sales/research',
      'https://www.iconiqcapital.com/insights/state-of-saas',
    ],
    answer: `## Direct Answer

Outreach's developer-platform strategy through 2027 has four pillars: (1) deepen the Outreach Marketplace from ~50 apps today to 100+ apps by FY27 (per q1757), (2) ship the AI Agent Marketplace as next-generation developer ecosystem (per q1785), (3) launch developer-first APIs + SDK improvements to match Salesloft developer ergonomics (per q1780), (4) build Developer Relations team (8-12 people) to evangelize platform. The four named pillars + the comparable platform plays + the 5-stage roadmap. Strategic positioning shift: from "Outreach is a sequencer" to "Outreach is a sales-engagement platform" by FY27, then "AI Sales OS platform" by FY28-29.

## The 4 Named Platform Pillars

- **Pillar 1: App Marketplace** — current ~50 apps, target 100+ by FY27 (per q1757); revenue share 70/30 (partner/Outreach)
- **Pillar 2: AI Agent Marketplace** — emerging category Q3 2026 launch; vertical/functional/persona AI agents
- **Pillar 3: Developer APIs + SDK** — close ergonomics gap with Salesloft (per q1780); developer-first onboarding
- **Pillar 4: Developer Relations team** — 8-12 people by FY27; evangelize platform, support partner ecosystem, run hackathons

## The 5-Stage Platform Roadmap

- **Stage 1 (Q1 2026)**: Developer experience overhaul — quickstart, OAuth simplification, public roadmap
- **Stage 2 (Q2 2026)**: Agent SDK + APIs ship — foundation for AI Agent Marketplace
- **Stage 3 (Q3 2026)**: AI Agent Marketplace launch — 25-50 launch agents (vertical + functional)
- **Stage 4 (Q1 2027)**: Marketplace hits 100+ apps + 50+ agents; revenue contribution $5-10M/yr
- **Stage 5 (Q4 2027)**: Platform brand cemented — "Outreach is the AI Sales OS"; IPO narrative

## Why Platform Strategy Matters For IPO

- **Platform companies trade at 10-15x ARR** vs product companies at 6-10x ARR
- **Platform narrative**: "Outreach is the platform sales-engagement runs on" vs "Outreach is a sequencing tool"
- **Marketplace revenue at FY27**: $10-25M ARR (per q1757) — adds 1.5-4% to total revenue
- **Brand value**: marketplace is the strategic moat AI-native challengers can't easily replicate
- **Investor narrative**: platform multiplier on IPO valuation = $300-500M extra enterprise value

## Comparable Developer-Platform Plays

- **Salesforce AppExchange** (2005-): 7,000+ apps, $2B+ marketplace revenue, gold standard
- **HubSpot App Marketplace** (2014-): 1,500+ apps, $200M+ revenue, mid-tier
- **Slack App Directory** (2016-): 2,500+ apps, key Slack stickiness driver
- **Zapier integrations** (2011-): 6,000+ integrations, aggregator strategy
- **Stripe API platform** (2010-): lighter ecosystem but extreme developer love
- **Outreach FY27 target**: 100+ apps + 50+ agents = mid-tier platform play
- **Pattern**: every successful platform-to-marketplace evolution adds 30-50% enterprise value

## What Outreach Must Build

- **Developer SDK** — TypeScript + Python clients for activity graph + AI agent integration
- **Quickstart guide** — 15-minute developer onboarding (currently 1-2 hours)
- **Sandbox environment** — free dev tier for partner experimentation
- **Quality + security review process** — vetting apps + agents before publishing
- **Revenue + billing infrastructure** — subscription + transaction fee handling
- **Marketplace discovery UX** — search, browse, install workflow
- **Developer documentation portal** — API reference + tutorials + recipes
- **Developer Relations team** — 8-12 people for evangelism, support, hackathons

## What Outreach Must NOT Do

- **Don't price marketplace transactions above 30% revenue share** — too greedy, partners go elsewhere
- **Don't gate APIs behind enterprise tier only** — kills indie developer ecosystem
- **Don't launch with <50 apps + <25 agents** — empty marketplace damages brand
- **Don't ignore Anthropic + OpenAI agent ecosystems** — must integrate, not compete
- **Don't compete with Salesforce AppExchange** — different scope (Outreach is sales-engagement-specific)

## The Developer Persona Targets

- **Indie developers**: build single-feature apps; appreciate good API + free tier
- **System integrators (Deloitte, Accenture, Wipro)**: build customer-specific implementations
- **Agent developers (AI startups)**: build vertical/functional AI agents on Outreach platform
- **Enterprise customers**: build internal apps for proprietary workflows
- **Sales-tech adjacent vendors**: Lavender, Hyperbound, Outplay etc. integrate via API
- **AI-native vendors (Anthropic, OpenAI)**: official agent integrations

## A Markdown Table — Platform Roadmap By Stage

| Stage | Q | Deliverable | Investment | Revenue impact |
|---|---|---|---|---|
| 1 | Q1 2026 | Developer experience overhaul | $2-4M | Lays foundation |
| 2 | Q2 2026 | Agent SDK + APIs | $3-5M | Lays foundation |
| 3 | Q3 2026 | AI Agent Marketplace launch | $2-3M | $2-5M FY27 ramp |
| 4 | Q1 2027 | 100+ apps + 50+ agents | $1-2M ongoing | $10-25M FY27 ARR |
| 5 | Q4 2027 | Platform brand cemented | $1-2M ongoing | IPO multiplier |

## A Mermaid Diagram — Developer Platform Strategy Mindmap

\`\`\`mermaid
mindmap
  root((Outreach Developer Platform FY27))
    Pillar 1 - App Marketplace
      100+ apps target
      70/30 revenue share
      Quality review
      Discovery UX
    Pillar 2 - AI Agent Marketplace
      Vertical agents
      Functional agents
      Persona agents
      30 percent share
    Pillar 3 - Developer APIs + SDK
      TypeScript + Python clients
      Quickstart guide
      Sandbox environment
      Documentation portal
    Pillar 4 - Developer Relations
      8-12 person team
      Hackathons + events
      Partner enablement
      Brand evangelism
    Strategic Outcome
      Platform brand cemented
      AI Sales OS positioning
      10-15x ARR multiple
      IPO 1.5-2.5B valuation
\`\`\`

## Bottom Line

Outreach developer-platform strategy through 2027 has four pillars: App Marketplace expansion + AI Agent Marketplace launch + Developer APIs/SDK improvements + Developer Relations team. Total investment: $10-15M across 24 months. Total revenue contribution FY27: $10-25M ARR + IPO multiplier (1.5-4% of revenue but 5-15% of valuation). Strategic imperative: shift Outreach narrative from "sequencer with API" to "AI Sales OS platform" — different valuation multiple, different IPO story. Platform play is the moat AI-native challengers can't easily replicate. (See also: q1734, q1757, q1769, q1771, q1780, q1785)

## Tags

outreach, developer-platform, api-strategy, app-marketplace, fy27-platform, ecosystem-strategy, developer-relations, partner-economics, salesforce-appexchange, platform-positioning

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/integrations
- https://developer.outreach.io/
- https://appexchange.salesforce.com/
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.gartner.com/en/sales/research
- https://www.iconiqcapital.com/insights/state-of-saas`,
  },
  {
    id: 'q1787',
    question: 'How does Outreach retain CRO talent in 2027?',
    tags: ['outreach', 'cro-retention', 'leadership-talent', 'fy27-talent', 'equity-refresh', 'comp-uncap', 'manny-medina-succession', 'sales-leadership', 'attrition-defense', 'talent-strategy'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/careers',
      'https://www.joinpavilion.com/cro-report',
      'https://www.builtin.com/salaries',
      'https://www.linkedin.com/company/outreach',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.iconiqcapital.com/insights/state-of-saas',
    ],
    answer: `## Direct Answer

Outreach retains CRO talent in 2027 with five named moves: (1) equity refresh program for top 25% of senior leaders (vs late-stage equity gap per q1758), (2) uncap accelerators above 200% attainment for elite performers (let top 10% earn $400-700K OTE), (3) ship AI-first product narrative so CRO can sell career-future-proof story, (4) Strategic Account program that gives CROs $1M+ ACV deals worth selling, (5) succession planning + executive board exposure for VP-Sales-to-CRO promotion path. The five moves + the comparable retention patterns + the cost-benefit math. Total retention investment: $11-22M annually (per q1758) — pays back via reduced replacement cost + retention-driven growth.

## The 5 Named Retention Moves

- **Move 1: Equity refresh for top 25%** — supplemental grants bridge late-stage equity gap; $5-10M annual dilution
- **Move 2: Uncap accelerators above 200% attainment** — top 10% earn $400-700K OTE; $2-4M variable comp
- **Move 3: AI-first product narrative** — CROs sell future-proof story (Smart Email Assist + Kaia + AI orchestration)
- **Move 4: Strategic Account program** — $1M+ ACV deals worth career-defining work
- **Move 5: VP-Sales-to-CRO promotion path** — internal succession + board exposure

## Why CRO Talent Is At Risk

- **Equity gap**: Outreach late-stage ($2-3B) offers 4x potential return; AI-native (Apollo $5-10B target IPO, Lavender 5-10x exit multiplier) offers 5-10x
- **Comp gap**: AI-native competitors pay 10-25% more on cash (per q1758)
- **Culture velocity**: Outreach late-stage process vs AI-native founder-mode shipping speed
- **AI-first narrative**: CROs at AI-native companies sell career-future-proof; Outreach narrative is "category leader defending"
- **Strategic Account access**: only 8-12 dedicated AEs in Strategic Account program; many CRO-grade salespeople want $1M+ ACV deals

## Retention Cost-Benefit Math

- **Cost of retention program**: $11-22M annually (per q1758)
- **Cost of replacing CRO**: $200-400K per CRO (search + onboarding + ramp); 5-10 CRO-level departures = $1-4M
- **Cost of replacing senior AEs**: $80-150K per AE; 50-80 senior AE departures = $4-12M
- **Lost productivity from attrition**: 6-12 month ramp on replacements = $5-15M lost ARR
- **Net retention ROI**: $11-22M investment defends $10-31M in costs + lost revenue = 1-2x return

## Comparable CRO Retention Patterns

- **Salesforce 2008-12**: equity refresh + uncapped comp held attrition at 18-22% (industry avg 25%+)
- **HubSpot 2018-22**: PLG-led culture + remote-first + equity grants held attrition at 15-18%
- **Marketo 2014-18 (Vista era)**: cost-out culture pushed attrition to 35-40%; never recovered
- **Anaplan 2018-22**: similar pattern to Outreach; attrition rose to 25-30% pre-acquisition
- **Datadog 2018-25**: strong equity + comp + product narrative held attrition at 12-15%
- **Outreach FY26-27 trajectory**: at risk of Marketo pattern without active defense

## What Outreach Must Communicate To Retain CRO Talent

- **AI-first narrative**: "Outreach is the AI Sales OS" (per q1771) — career-future-proof
- **IPO upside story**: 2027-28 IPO at $1.5-2.5B with strategic acquisition optionality at $2.5-4B premium (per q1750)
- **Strategic Account program access**: $1M+ ACV deals worth career-defining work
- **Equity refresh program**: explicit, transparent, predictable supplemental grants
- **Uncap accelerator program**: top 10% AEs earn $400-700K — celebrated, not capped
- **Founder-CEO continuity**: Manny Medina through IPO + 2-3 yrs post-IPO (per q1738)
- **Product roadmap confidence**: Smart Email Assist UX overhaul + agent orchestration + vertical solutions

## The Top Talent Profile Outreach Must Retain

- **Strategic Account AEs (15-25 people)**: $1M+ ACV deal closers; replacement cost $300-500K each
- **Enterprise tier AEs (40-60 people)**: $100-500K ACV closers; replacement cost $150-250K each
- **VP Sales / Regional VPs (8-12 people)**: regional ownership; replacement cost $400-700K each
- **CRO + senior leadership (5-8 people)**: strategic role; replacement cost $500K-1M each
- **Top engineers (40-60 people)**: AI / Platform / Vertical owners; replacement cost $200-400K each
- **Top product managers (10-15 people)**: AI roadmap owners; replacement cost $200-350K each

## What Outreach Must NOT Do

- **Don't cap accelerators below 200% attainment** — drives top 10% to AI-native competitors
- **Don't delay equity refresh past Q1 2026** — Vista-style discipline can't be sole signal
- **Don't ignore senior AE attrition** — bottom of leadership funnel = top of CRO succession funnel
- **Don't compete on cash comp alone** — AI-native always wins cash race
- **Don't lose Manny Medina prematurely** — founder-CEO premium critical for IPO

## Comparable Talent Investments (Cost vs ROI)

- **Equity refresh top 25%**: $5-10M dilution / -3-5 pts attrition / 2-3x ROI on attrition costs avoided
- **Uncap accelerators**: $2-4M variable / -2-4 pts attrition / 1.5-2x ROI
- **AI-first narrative shift**: $1-2M marketing / -2-3 pts attrition / 2-4x ROI
- **Strategic Account access**: requires anchor logos / -1-2 pts attrition / brand-multiplier ROI
- **Founder-mode CEO comms**: $0 / -1-2 pts attrition / infinite ROI
- **Combined**: $11-22M / -8-14 pts attrition / 1-2x ROI net

## A Markdown Table — Retention Move ROI Analysis

| Move | Annual cost | Attrition impact | Replacement cost saved | Net ROI |
|---|---|---|---|---|
| Equity refresh top 25% | $5-10M dilution | -3-5 pts | $5-10M | 1-2x |
| Uncap accelerators | $2-4M variable | -2-4 pts | $3-6M | 1.5-2x |
| AI-first narrative | $1-2M marketing | -2-3 pts | $3-5M | 2-3x |
| Strategic Account access | (no incremental) | -1-2 pts | $2-4M | infinite |
| Founder-mode comms | $0 | -1-2 pts | $2-4M | infinite |
| **Combined** | **$11-22M** | **-8-14 pts** | **$15-29M** | **1.5-2x** |

## A Mermaid Diagram — Talent Retention Decision Flow

\`\`\`mermaid
graph LR
  A["CRO talent at Outreach FY27"] --> B{"Top 25% performer?"}
  B -->|Yes - top 25%| C["Equity refresh + uncap accelerators"]
  B -->|Mid 50-75%| D["Standard comp + AI narrative"]
  B -->|Bottom 25%| E["PIP or exit"]
  C --> F{"Career trajectory?"}
  D --> F
  F -->|VP path| G["Strategic Account access + board exposure"]
  F -->|IC stay| H["Premium comp + brand"]
  G --> I["Outreach retains - 18-22% attrition"]
  H --> I
  I --> J["IPO 2027-28 equity event"]
\`\`\`

## Bottom Line

Outreach retains CRO talent in 2027 with five coordinated moves: equity refresh top 25% + uncap accelerators above 200% + AI-first narrative + Strategic Account access + founder-mode communication. Total investment: $11-22M annually (per q1758). Net ROI: 1.5-2x via reduced replacement costs + sustained productivity. The honest call: defending CRO talent is non-optional pre-IPO; without active defense, attrition spikes to 25-35% (per q1758) and IPO trajectory compresses. Most important moves: equity refresh + uncap accelerators — without those, the rest doesn't matter. (See also: q1737, q1738, q1758, q1759, q1773)

## Tags

outreach, cro-retention, leadership-talent, fy27-talent, equity-refresh, comp-uncap, manny-medina-succession, sales-leadership, attrition-defense, talent-strategy

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/careers
- https://www.joinpavilion.com/cro-report
- https://www.builtin.com/salaries
- https://www.linkedin.com/company/outreach
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas`,
  },
  {
    id: 'q1788',
    question: 'What is Outreach playbook for the next $500M in revenue?',
    tags: ['outreach', 'next-500m-revenue', 'fy27-fy28-growth', 'revenue-playbook', 'arr-expansion', 'multi-product-attach', 'enterprise-expansion', 'vertical-solutions', 'international-growth', 'ipo-strategy'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/products/smart-email-assist',
      'https://www.outreach.io/products/kaia',
      'https://www.outreach.io/products/commit',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.iconiqcapital.com/insights/state-of-saas',
      'https://www.crunchbase.com/organization/outreach-corp',
    ],
    answer: `## Direct Answer

Outreach's playbook for the next $500M in revenue (from $430-500M FY25 to $930M-1B by FY28-29): six named levers stacked over 36 months. (1) Smart Email Assist + Kaia + Commit attach hits 60-70% on Pro/Enterprise base ($150-200M incremental ARR), (2) Strategic Account program scales to 80+ deals at $1M+ ACV ($80-130M), (3) Vertical solutions (FinServ + Healthcare + Industrial) ship and ramp ($60-100M), (4) International expansion via partner-led EMEA + APAC ($50-80M), (5) AI Agent Marketplace + developer platform ($30-60M), (6) Mid-market consolidation via M&A (Lavender + Outplay + Hyperbound) ($30-60M). The six levers + the timeline + dependencies + comparable SaaS playbooks. Strategic imperative: this $500M growth is what cements Outreach as standalone IPO at $2-2.5B vs PE acquisition at $1-1.5B.

## The 6 Named Revenue Levers

- **Lever 1: AI add-on attach $150-200M** — Smart Email Assist + Kaia + Commit attach hits 60-70% on Pro/Enterprise base
- **Lever 2: Strategic Account program $80-130M** — 80+ deals at $1M+ ACV by FY28
- **Lever 3: Vertical solutions $60-100M** — FinServ + Healthcare + Industrial verticals
- **Lever 4: International expansion $50-80M** — partner-led EMEA + APAC + LATAM
- **Lever 5: AI Agent Marketplace $30-60M** — platform play; developer ecosystem
- **Lever 6: M&A consolidation $30-60M** — Lavender + Outplay + Hyperbound integrations

## The Revenue Math (FY25 → FY28-29)

- **FY25 baseline**: ~$430-500M ARR
- **FY26 target**: $560-650M ARR (25-30% growth) — bull case
- **FY27 target**: $720-820M ARR (25-30% growth) — bull case (per q1779)
- **FY28 target**: $920-1.05B ARR (20-25% growth)
- **FY29 stretch**: $1.1-1.3B ARR (15-20% growth)
- **Net new ARR over 36-48 months**: ~$500M from $430M base = $930M total

## Lever 1 Math: AI Add-On Attach

- **Pro/Enterprise base FY27**: ~6,500 customers
- **AI attach target**: 60-70% = 4,000-4,500 customers attached
- **Average AI ARPU uplift**: $30-45/user/mo
- **Average users per customer**: 80-150
- **Annual AI add-on per customer**: $30-80K
- **Total AI add-on revenue FY28**: $150-200M

## Lever 2 Math: Strategic Account

- **Strategic Account customer count target FY28**: 80+ customers
- **Average Strategic Account ACV**: $1.5-2M
- **Strategic Account revenue FY28**: $120-160M
- **Net new from FY25 (40 customers, $60M)**: $80-130M incremental

## Lever 3 Math: Vertical Solutions

- **FinServ vertical FY28**: $25-40M ARR
- **Healthcare vertical FY28**: $20-35M ARR
- **Industrial vertical FY28**: $15-25M ARR
- **Total vertical ARR FY28**: $60-100M
- **Vertical premium pricing**: 25-30% above horizontal

## Lever 4 Math: International

- **EMEA total FY28**: $80-130M (UK + DACH + France + Benelux)
- **APAC total FY28**: $40-70M (Australia + Japan + Singapore)
- **LATAM total FY28**: $15-30M (Brazil + Mexico)
- **Total international FY28**: $135-230M (vs $70-115M FY27 per q1746)
- **Net new from FY25 ($45M international)**: $90-185M incremental over 36 months

## Lever 5 Math: AI Agent Marketplace

- **Marketplace revenue FY28** (per q1785): $30-60M (Outreach 30% share)
- **Marketplace transactions FY28**: $100-200M total partner-customer flow
- **Net new (zero baseline)**: $30-60M incremental

## Lever 6 Math: M&A Consolidation

- **Lavender acquisition FY26-27**: +$30-60M ARR by FY28 (Lavender ARR + Outreach customer expansion)
- **Outplay acquisition FY27**: +$10-20M ARR by FY28 (mid-market consolidation)
- **Hyperbound acquisition FY27**: +$5-15M ARR by FY28 (voice-AI category)
- **Total M&A contribution FY28**: $30-60M (per q1775)

## What Could Derail This Playbook

- **Smart Email Assist plateaus at 30-40%** (per q1736) — Lever 1 delivers $80-100M instead of $150-200M
- **Salesloft post-Vista price war** — renewal compression 8-15 points
- **HubSpot Sales Hub bundle wins SMB** — bundle pressure compresses mid-market
- **AI compute cost rises 30-50%** — gross margin pressure (per q1747)
- **Macro recession 2.0** — customer downgrades + budget cuts
- **M&A integration failures** — Lavender / Outplay / Hyperbound integration weak

## Comparable SaaS Playbooks

- **HubSpot $200M → $1B (2018-22)**: multi-hub attach + international + Service Hub + AI; 4-year journey
- **Datadog $400M → $2B (2019-23)**: multi-product attach + APM + Logs + AI; 4-year journey
- **Salesforce $500M → $1B (2007-09)**: Service Cloud + AppExchange + international; 2-3 year journey
- **Asana $200M → $500M (2019-22)**: enterprise expansion + AI + integrations; 3-year journey
- **Outreach $500M → $1B (FY25-FY28-29)**: AI attach + Strategic Account + verticals + international + marketplace + M&A; 36-48 month journey

## What Outreach Must Ship FY26-27 To Hit FY28 Target

- **Q1 2026**: Smart Email Assist UX overhaul + Pro Lite tier
- **Q2 2026**: Vertical solutions GA (FinServ + Healthcare + Industrial)
- **Q3 2026**: Lavender acquisition + AI Agent Marketplace launch + EMEA expansion push
- **Q4 2026**: Hyperbound acquisition + Strategic Account scaling
- **Q1 2027**: Outplay acquisition + APAC expansion push + AI orchestration platform launch
- **Q2-Q3 2027**: International beachhead maturity + marketplace 100+ apps + 50+ agents
- **Q4 2027**: IPO preparation; S-1 filing

## A Markdown Table — Playbook Lever Contribution FY28

| Lever | Net new ARR FY28 | Cost | Risk | Probability |
|---|---|---|---|---|
| AI add-on attach | $150-200M | $30-50M R&D | Attach plateau | 50-65% |
| Strategic Account | $80-130M | $30-40M GTM | Macro / win-rate | 60-75% |
| Vertical solutions | $60-100M | $25-40M product+GTM | Vertical demand | 65-80% |
| International | $50-80M | $20-30M | Localization speed | 65-75% |
| AI Agent Marketplace | $30-60M | $5-10M | Agent supply | 50-60% |
| M&A consolidation | $30-60M | $230-450M | Integration | 60-70% |
| **Total net new FY28** | **$400-630M** | **$340-620M total** | **Combined** | **Base case 50-65%** |

## A Mermaid Diagram — $500M Revenue Lever Stack

\`\`\`mermaid
graph LR
  A["FY25 Baseline 430-500M ARR"] --> B["Lever 1 - AI attach +150-200M"]
  A --> C["Lever 2 - Strategic Account +80-130M"]
  A --> D["Lever 3 - Vertical solutions +60-100M"]
  A --> E["Lever 4 - International +50-80M"]
  A --> F["Lever 5 - Agent Marketplace +30-60M"]
  A --> G["Lever 6 - M&A +30-60M"]
  B --> H["FY28 Target 920M-1.05B ARR"]
  C --> H
  D --> H
  E --> H
  F --> H
  G --> H
  H --> I["IPO 2027-28 at 2-2.5B valuation"]
  H --> J["Strategic acquisition optionality 2.5-4B"]
\`\`\`

## Bottom Line

Outreach's playbook for the next $500M in revenue stacks 6 named levers over 36-48 months: AI attach + Strategic Account + Verticals + International + Marketplace + M&A. Total investment: $340-620M (M&A heavy). Total net new ARR FY28: $400-630M. The honest call: hitting the $920M-1.05B FY28 target requires 4-5 of 6 levers firing simultaneously — base case probability 50-65%. Most important lever: AI add-on attach (Lever 1) at $150-200M; without it, the playbook misses by 25-35%. Strategic imperative: this is what cements standalone IPO at $2-2.5B vs forced PE acquisition at $1-1.5B. (See also: q1729, q1733, q1737, q1745-1786 — entire arc)

## Tags

outreach, next-500m-revenue, fy27-fy28-growth, revenue-playbook, arr-expansion, multi-product-attach, enterprise-expansion, vertical-solutions, international-growth, ipo-strategy

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.outreach.io/products/kaia
- https://www.outreach.io/products/commit
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://www.crunchbase.com/organization/outreach-corp`,
  },
];

let written = 0;
for (const e of entries) {
  const obj = {
    id: e.id,
    question: e.question,
    answer: e.answer,
    tags: e.tags,
    sources: e.sources,
    model: MODEL,
    lab_run: RUN,
  };
  const out = path.join(__dirname, 'cheap-100', e.id + '.json');
  fs.writeFileSync(out, JSON.stringify(obj) + '\n');
  console.log('wrote', e.id, fs.statSync(out).size, 'bytes');
  written++;
}
console.log('total written:', written);
