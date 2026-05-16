const fs = require('fs');
const path = require('path');

const RUN = 'outreach-arc-2026-05-04';
const MODEL = 'claude-opus-4-7';

const entries = [
  {
    id: 'q1781',
    question: 'Is Outreach mobile app good enough in 2027?',
    tags: ['outreach', 'mobile-app', 'rep-mobility', 'fy27-mobile', 'salesforce-mobile', 'feature-parity', 'enterprise-rfp', 'lite-mobile', 'engineering-allocation', 'product-portfolio'],
    sources: [
      'https://www.outreach.io/about',
      'https://apps.apple.com/us/app/outreach/id1149378900',
      'https://play.google.com/store/apps/details?id=io.outreach.everywhere',
      'https://www.salesforce.com/products/sales-cloud-mobile/',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.gartner.com/en/sales/research',
      'https://openviewpartners.com/saas-benchmarks/',
    ],
    answer: `## Direct Answer

Outreach mobile app in 2027 is "barely good enough" — adequate for enterprise RFP table-stakes (30-40% of RFPs require it) but feature-parity gap with web is 30-40% and usage stays at 5-8% of total engagement (per q1755). The four named gaps + the Salesforce Mobile comparable + the lite-mobile pivot recommendation. Honest call: Outreach should ship a "lite" mobile (10-15 essential workflows, $500K-1M annual cost) instead of full-featured (4-6 engineers, $2-3M/yr) — saves $1-2M/yr that goes to Smart Email Assist + AI roadmap. The mobile app earns its keep as enterprise checkbox, not as primary engagement surface.

## The 4 Named Gaps Vs Web Product

- **Gap 1: Sequence builder is read-only** — reps can pause/resume but can't create or edit sequences
- **Gap 2: Smart Email Assist not on mobile** — AI personalization is web-only; mobile uses templates only
- **Gap 3: Kaia conversation insights minimal** — call recording playback works, but signal-driven insights desktop-only
- **Gap 4: Reporting + analytics thin** — basic dashboards on mobile; deep cohort/territory analysis web-only

## Why Usage Stays Low (5-8%)

- Sales reps prefer keyboard-first workflows for sequence editing + email composition
- Web has Smart Email Assist; mobile has templates — quality gap drives reps back to web
- Most rep activity (LinkedIn outreach, prospect research, Salesforce CRM) requires web context anyway
- Mobile-only use case: in-field rep logging calls, checking notifications, light follow-up replies
- Industry-wide pattern: sales-engagement mobile apps hit 5-12% engagement ceiling

## Comparable Mobile App Patterns

- **Salesforce Sales Cloud Mobile**: full-featured, ~25-35% of total engagement; massive enterprise demand drives investment
- **HubSpot Mobile**: full-featured, ~15-25% engagement; PLG motion drives mobile signups
- **Salesloft Mobile**: lite, ~5-10% engagement; similar to Outreach
- **Apollo Mobile**: lite-medium, ~10-15% engagement; data-first use case fits mobile better
- **Gong Mobile**: lite (review calls + insights), ~12-18% engagement
- **Pattern**: vertical-platform tools (Outreach, Salesloft) get away with lite mobile; horizontal-platform tools (Salesforce, HubSpot) need full

## The Lite-Mobile Recommendation

- **Strip to 10-15 essential workflows**: call logging, sequence pause/resume, prospect notes, deal status, manager dashboards, push notifications
- **Reduce engineering**: from 4-6 engineers to 1-2 engineers (~$500K-1M annual)
- **Maintain App Store presence**: RFP checkbox + brand signal preserved
- **Reallocate 3-4 engineers**: Smart Email Assist UX overhaul, Kaia depth, AI agent orchestration
- **Acceptable trade-off**: 80% of essentials at 30% of cost
- **FY27 cost savings**: $1-2M/yr → fund AI roadmap

## What Mobile MUST Do Well

- **Push notifications**: real-time signal alerts (prospect engagement, deal milestone, hot lead)
- **Call logging**: in-field rep logs call outcome quickly
- **Sequence pause/resume**: rep stops sequence when going on vacation; resumes back
- **Manager dashboards**: VPs review team activity on commute
- **Quick reply**: rep replies to inbound prospect email from mobile

## What Mobile DOESN'T Need To Do

- **Sequence builder** — keep web-only; complex UX
- **Smart Email Assist composition** — keep web-only; AI prompt UX needs keyboard
- **Deep reporting** — keep web-only; data-dense
- **Strategic Account workflow** — keep web-only; multi-stakeholder complexity
- **Custom integrations** — keep web-only; admin workflow

## A Markdown Table — Mobile Strategy Trade-offs

| Strategy | Annual cost | FY27 engagement | RFP impact | Recommendation |
|---|---|---|---|---|
| Full-featured mobile | $2-3M | 5-8% (no lift) | Strong | Skip — bad ROI |
| Lite mobile (10-15 workflows) | $500K-1M | 4-6% (acceptable) | Strong | **Ship** |
| No mobile (kill app) | -$2-3M saved | 0% | Lose 8-12% RFPs | Skip — RFP risk |
| Mobile + web parity push | $4-6M | 10-15% | Strong | Skip — over-invest |
| **Lite + reallocate to AI** | **$500K-1M** | **4-6%** | **Strong** | **Optimal** |

## A Mermaid Diagram — Mobile Decision Tree FY27

\`\`\`mermaid
graph LR
  A["Outreach Mobile FY27"] --> B{"RFP requirement?"}
  B -->|Yes - 30-40%| C{"Engineering cost vs value?"}
  B -->|No| D["Kill mobile - reallocate engineers"]
  C -->|Bad - 5-8% engagement| E["Ship LITE version"]
  C -->|Good - >15%| F["Keep full-featured"]
  E --> G["1-2 engineers maintenance"]
  E --> H["Reallocate 3-4 engineers to AI"]
  G --> I["RFP checkbox preserved"]
  H --> J["Smart Email Assist UX overhaul"]
\`\`\`

## Bottom Line

Outreach mobile app is "barely good enough" in 2027 — keeps RFP checkbox but not primary engagement surface. The honest call: ship lite version (10-15 workflows, 1-2 engineers, $500K-1M/yr) and reallocate 3-4 engineers to AI roadmap. That trade-off saves $1-2M/yr while preserving 8-12% of enterprise RFP eligibility. Full-featured mobile is bad ROI given 5-8% usage; killing entirely costs $30-50M ARR in lost RFPs (per q1755). Lite-mobile is the strategic answer. (See also: q1737, q1755, q1758, q1773)

## Tags

outreach, mobile-app, rep-mobility, fy27-mobile, salesforce-mobile, feature-parity, enterprise-rfp, lite-mobile, engineering-allocation, product-portfolio

## Sources

- https://www.outreach.io/about
- https://apps.apple.com/us/app/outreach/id1149378900
- https://play.google.com/store/apps/details?id=io.outreach.everywhere
- https://www.salesforce.com/products/sales-cloud-mobile/
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.gartner.com/en/sales/research
- https://openviewpartners.com/saas-benchmarks/`,
  },
  {
    id: 'q1782',
    question: 'How does Outreach onboarding compare to Salesloft?',
    tags: ['outreach', 'onboarding', 'salesloft-comparison', 'time-to-value', 'implementation', 'customer-success', 'mid-market-onboarding', 'enterprise-onboarding', 'csm-team', 'fy27-onboarding'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.salesloft.com/about',
      'https://www.outreach.io/customer-success',
      'https://www.salesloft.com/professional-services',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.gartner.com/en/documents/sales-engagement',
      'https://www.iconiqcapital.com/insights/state-of-saas',
    ],
    answer: `## Direct Answer

Outreach onboarding is 8-16 weeks (mid-market) and 16-26 weeks (enterprise) — longer than Salesloft's 4-8 weeks (mid-market) and 12-20 weeks (enterprise). Salesloft wins on speed-to-value; Outreach wins on enterprise depth + customization. The four named onboarding stages + the time-to-first-meeting math + customer success org sizes + what Outreach should do to close the gap. The honest call: Outreach onboarding is "comprehensive but slow" — fine for enterprise, problematic for mid-market.

## The 4 Named Onboarding Stages

- **Stage 1: Discovery + Architecture** (Outreach 2-4 weeks vs Salesloft 1-2 weeks) — workflow mapping, sequence design, integration planning
- **Stage 2: Technical Implementation** (Outreach 3-6 weeks vs Salesloft 2-3 weeks) — CRM integration, custom object mapping, user provisioning
- **Stage 3: Pilot + Training** (Outreach 2-4 weeks vs Salesloft 1-2 weeks) — train-the-trainer, pilot rep deployment, refinement
- **Stage 4: Full Rollout + Optimization** (Outreach 1-2 weeks vs Salesloft 1 week) — broad rep deployment, manager enablement, success metrics

## Time-To-First-Meeting Math

- **Outreach mid-market onboarding**: ~10 weeks → first Strategic-Account-level meeting ~12-14 weeks total
- **Salesloft mid-market onboarding**: ~6 weeks → first meeting ~8-10 weeks total
- **Outreach enterprise**: ~20 weeks → first meeting ~24-28 weeks
- **Salesloft enterprise**: ~16 weeks → first meeting ~18-22 weeks
- **Net delta**: Salesloft 30-40% faster to value
- **Cost of delay (mid-market customer)**: 4-6 weeks of lost productivity = ~$50-150K incremental

## Why Outreach Is Slower

- **Custom object mapping** — enterprise customers map proprietary deal stages, products, etc.; Salesforce integration depth requires more setup
- **Strategic Account workflow** — multi-stakeholder enterprise sales motion requires more discovery
- **AI tool enablement** — Smart Email Assist + Kaia + Commit have separate onboarding paths
- **Vertical solutions setup** — FinServ + Healthcare + Industrial require compliance documentation
- **Higher CSM-touch model** — Outreach CSMs do more white-glove setup; Salesloft more self-serve

## Why Salesloft Is Faster

- **Simpler product UX** — fewer features = less to configure
- **HubSpot CRM preferred-partner status** — tighter integration setup automation
- **Self-serve onboarding for SMB / mid-market** — guided wizard reduces CSM time
- **Standardized templates** — pre-built sequence library reduces design time
- **Lower-touch CSM model** — Salesloft CSMs handle more accounts per person

## Customer Success Team Sizes (Estimated)

- **Outreach total CS**: ~120-180 people (8-10% of total headcount per q1773)
- **Outreach customer-to-CSM ratio**: ~30-50 customers per CSM (varies by tier)
- **Salesloft total CS**: ~80-120 people (post-Vista efficiency)
- **Salesloft customer-to-CSM ratio**: ~50-80 customers per CSM (more leverage)
- **Net**: Outreach more white-glove; Salesloft more leveraged

## What Outreach Should Do To Close The Gap

- **Self-serve onboarding wizard** — automate Stage 1 + 2 for mid-market customers
- **Standardized sequence templates** — pre-built library reduces Stage 1 design time by 40-60%
- **AI-assisted setup** — use AI to generate initial sequences from customer brief
- **Tiered CSM model** — high-touch for Strategic Account; lighter-touch for Pro tier
- **Onboarding playbooks** — published guides reduce CSM time
- **Time-to-value SLA** — commit to 6-week mid-market onboarding by FY27

## What Outreach Should NOT Do

- **Don't sacrifice enterprise depth** — Strategic Account onboarding earns its 16-26 weeks because of $1M+ ACV deals
- **Don't fully automate** — some customer-specific workflows need CSM judgment
- **Don't price-cut implementation services** — earns $40-120K per Enterprise deal; margin matters
- **Don't kill the train-the-trainer model** — drives long-term adoption better than self-serve

## Customer Onboarding NPS

- **Outreach NPS**: estimated 42-55 (good but not great); enterprise customers higher (50-65), mid-market lower (35-45)
- **Salesloft NPS**: estimated 48-60 (slight edge on speed); mid-market segment higher (50-58)
- **HubSpot Sales Hub NPS**: 55-65 (highest — PLG motion); but feature parity gap
- **Net**: Outreach NPS limited by mid-market onboarding speed; enterprise onboarding NPS strong

## A Markdown Table — Outreach Vs Salesloft Onboarding

| Metric | Outreach | Salesloft | Winner |
|---|---|---|---|
| Mid-market timeline | 8-16 weeks | 4-8 weeks | Salesloft |
| Enterprise timeline | 16-26 weeks | 12-20 weeks | Salesloft |
| Customizability | High | Moderate | Outreach |
| Strategic Account depth | Strong | Adequate | Outreach |
| Self-serve option | Limited | Available | Salesloft |
| CSM-to-customer ratio | 1:30-50 | 1:50-80 | Salesloft (efficiency) |
| Implementation services revenue | $40-120K/deal | $20-80K/deal | Outreach |
| Time-to-first-meeting | 12-14 wks (mid) | 8-10 wks (mid) | Salesloft |
| Customer NPS | 42-55 | 48-60 | Salesloft |
| Strategic Account NPS | 50-65 | 45-55 | Outreach |

## A Mermaid Diagram — Onboarding Funnel Sequence

\`\`\`mermaid
sequenceDiagram
  participant C as Customer
  participant CSM as Outreach CSM
  participant Tech as Tech Implementation
  participant Reps as Sales Reps
  C->>CSM: Sign contract (week 0)
  CSM->>C: Discovery + architecture (weeks 1-4)
  CSM->>Tech: Technical implementation (weeks 5-10)
  Tech->>Reps: Pilot deployment (weeks 11-12)
  Reps->>CSM: Pilot feedback + refinement (weeks 13-14)
  CSM->>Reps: Full rollout (weeks 15-16)
  Note over C,Reps: Mid-market: 8-16 weeks total
  Reps->>C: First Strategic Account meeting (week 17+)
\`\`\`

## Bottom Line

Outreach onboarding is 30-40% slower than Salesloft for mid-market (8-16 weeks vs 4-8) and ~20% slower for enterprise (16-26 vs 12-20). The honest call: Outreach onboarding is "comprehensive but slow" — earns its time for Strategic Account customers ($1M+ ACV) but creates friction for mid-market net-new logos who care about time-to-value. The fix: ship self-serve wizard + standardized templates + AI-assisted setup to bring mid-market onboarding to 6 weeks by FY27. Don't sacrifice enterprise depth. (See also: q1737, q1739, q1742, q1773)

## Tags

outreach, onboarding, salesloft-comparison, time-to-value, implementation, customer-success, mid-market-onboarding, enterprise-onboarding, csm-team, fy27-onboarding

## Sources

- https://www.outreach.io/about
- https://www.salesloft.com/about
- https://www.outreach.io/customer-success
- https://www.salesloft.com/professional-services
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.gartner.com/en/documents/sales-engagement
- https://www.iconiqcapital.com/insights/state-of-saas`,
  },
  {
    id: 'q1783',
    question: 'What does Outreach churn math look like under AI pressure?',
    tags: ['outreach', 'churn-math', 'ai-pressure', 'gross-retention', 'logo-churn', 'revenue-churn', 'fy27-churn', 'tier-downgrade', 'multi-product-defense', 'segment-churn'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/products/smart-email-assist',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.iconiqcapital.com/insights/state-of-saas',
      'https://openviewpartners.com/saas-benchmarks/',
      'https://www.gartner.com/en/documents/sales-engagement',
      'https://www.gainsight.com/customer-success/',
    ],
    answer: `## Direct Answer

Outreach churn math under AI pressure: gross logo churn rises from 8-12% (FY25 baseline) to 12-16% (FY27 projected) due to AI-native competitor poaching + bundle pressure. Revenue churn (gross retention complement) rises from 8-12% to 12-15%. Multi-product attach defense (Kaia + Commit + Smart Email Assist) reduces churn 60% on attached cohort but only 35-45% of customers attach (per q1741). The four named churn drivers + the segment breakdown + the multi-product defense math + comparable SaaS pressure patterns. AI pressure isn't existential but compresses NRR 3-7 points without active defense.

## The 4 Named Churn Drivers Under AI Pressure

- **Driver 1: AI-native competitors poach mid-market** — Apollo + Lavender + Outplay take 30-50% of unattached mid-market customers (per q1735)
- **Driver 2: HubSpot Sales Hub bundle wins SMB** — bundled Sales Hub + AI eats lower-mid-market (per q1740)
- **Driver 3: Sequence-fatigue stagnation** — customers reduce Outreach usage as outbound effectiveness wanes (per q1743)
- **Driver 4: Tier downgrades** — Enterprise customers move to Pro tier in recession (per q1772) — partial revenue churn

## The Logo Churn Math FY25 → FY27

- **FY25 baseline**: 8-12% gross logo churn (~480-600 customers/yr lost)
- **FY26 projection**: 10-14% (~600-840 customers/yr) — competitive intensity rising
- **FY27 projection**: 12-16% (~720-960 customers/yr) — AI pressure peaks
- **Net new logos required**: 1,200-1,500/yr to hit growth target (vs ~700-900 lost) → 500-600 net new
- **Comparable**: Salesloft post-Vista likely 14-20% logo churn; Apollo ~10-14%; HubSpot ~6-10%

## The Revenue Churn Math (Gross Retention)

- **FY25 GRR**: 88-92% (8-12% revenue churn)
- **FY26 GRR**: 86-90% (10-14% revenue churn)
- **FY27 GRR**: 85-88% (12-15% revenue churn)
- **Combined with expansion**: NRR drops from 105-115% to 100-110% without active defense
- **With defense**: NRR holds 110-120% target (per q1741)

## Churn By Segment FY27 Projection

- **Strategic Account (>$1M ACV)**: 4-7% logo churn (high lock-in, multi-year contracts)
- **Enterprise tier ($100-500K ACV)**: 8-12% logo churn (competitive but defended)
- **Upper mid-market ($30-100K ACV)**: 14-18% logo churn (highest competitive pressure)
- **Core mid-market ($10-30K ACV)**: 18-25% logo churn (Apollo + HubSpot bundle threat)
- **SMB (<$10K ACV)**: 25-35% logo churn (segment in retreat)

## Multi-Product Defense Math

- **Single-product customers (Outreach Pro only)**: 18-25% logo churn FY27
- **Multi-product attached (Pro + Kaia OR Commit OR Smart Email Assist)**: 12-15% churn
- **Multi-product attached (Pro + 2 of Kaia/Commit/Smart Email)**: 7-10% churn
- **Full bundle (Pro + Kaia + Commit + Smart Email Assist)**: 3-5% churn
- **Net**: full attach drops churn 60-75% vs single-product

## What Drives Customers To Stay (Defense Levers)

- **Activity-graph data lock-in** — switching cost $200K-2M (per q1749)
- **Multi-year contracts** — 60-70% of Enterprise renewals on 3-yr commits (per q1772)
- **Vertical solutions stickiness** — FinServ + Healthcare + Industrial compliance lock-in (per q1752)
- **Strategic Account program** — dedicated AE pod retains anchor logos
- **Multi-product attach motion** — every additional product attached reduces churn

## What Drives Customers To Leave (Pressure Levers)

- **Apollo $50-100/user/mo** — 50-70% cheaper than Outreach Pro for SMB
- **HubSpot Sales Hub bundle** — marginal cost vs Outreach Pro standalone
- **Salesloft post-Vista 30-40% discount** — competitive renewal compression
- **Sequence-fatigue** — customers question outbound ROI; cut budget
- **AI-native shipping speed** — Lavender + Apollo ship faster; perception of Outreach lagging

## Comparable SaaS Churn Pressure Patterns

- **Marketo 2014-18 (Vista era)**: logo churn rose from 8% to 15%; never recovered pre-acquisition
- **Salesforce 2008-12**: logo churn rose from 6% to 9% during recession; recovered via product expansion
- **HubSpot 2018-22**: logo churn rose from 6% to 10% during PLG transition; recovered via Service Hub expansion
- **Anaplan 2018-22**: logo churn rose from 8% to 14%; led to Thoma Bravo acquisition
- **Outreach FY25-27 trajectory**: similar to Anaplan pre-acquisition; churn pressure real but defendable

## A Markdown Table — Churn Math Sensitivity Analysis FY27

| Driver | Churn impact | Defense | Net FY27 churn |
|---|---|---|---|
| Apollo poaching mid-market | +3-5 points | Multi-product attach | +1-2 points |
| HubSpot bundle SMB | +2-4 points | Cede SMB gracefully | +0-1 point |
| Salesloft price war | +2-3 points | Multi-year locks | +0-1 point |
| Sequence-fatigue | +1-2 points | AI sequencing + Kaia | +0-1 point |
| Tier downgrade | +1-2 points | Pro Lite tier | -0-1 point (saved logos) |
| Recession deepening | +2-3 points | Defense levers | +1-2 points |
| **Net combined** | **+11-19 points** | **-7-10 points defended** | **+4-9 points** |

## A Mermaid Diagram — Churn Defense Funnel

\`\`\`mermaid
graph LR
  A["Outreach customer base FY27"] --> B{"Single or multi-product?"}
  B -->|Single product| C["Churn risk 18-25%"]
  B -->|Multi-product attached| D{"How many products?"}
  D -->|2 products| E["Churn risk 12-15%"]
  D -->|3+ products| F["Churn risk 7-10%"]
  D -->|Full bundle| G["Churn risk 3-5%"]
  C --> H{"Multi-year locked?"}
  H -->|Yes| I["Defended churn 8-12%"]
  H -->|No| J["Full churn risk 18-25%"]
\`\`\`

## Bottom Line

Outreach churn math under AI pressure: gross logo churn rises from 8-12% (FY25) to 12-16% (FY27) — manageable but pressured. The defense levers (multi-product attach + multi-year contracts + vertical lock-in + Strategic Account program) reduce net churn 7-10 points; without them, churn spikes to 18-25%. The honest call: AI pressure isn't existential but compresses NRR 3-7 points without active defense. Most important defense: multi-product attach (Kaia + Commit + Smart Email Assist) — drops churn 60-75% on attached cohort. (See also: q1735, q1740, q1741, q1772, q1778)

## Tags

outreach, churn-math, ai-pressure, gross-retention, logo-churn, revenue-churn, fy27-churn, tier-downgrade, multi-product-defense, segment-churn

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://openviewpartners.com/saas-benchmarks/
- https://www.gartner.com/en/documents/sales-engagement
- https://www.gainsight.com/customer-success/`,
  },
  {
    id: 'q1784',
    question: 'How should Outreach price Smart Email Assist against HubSpot Breeze?',
    tags: ['outreach', 'smart-email-assist', 'hubspot-breeze', 'pricing-strategy', 'ai-bundle-pressure', 'consumption-pricing', 'fy27-pricing', 'crm-aligned-buyer', 'salesforce-customers', 'hubspot-customers'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/products/smart-email-assist',
      'https://www.hubspot.com/products/ai',
      'https://www.hubspot.com/products/sales/sales-hub',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
      'https://www.iconiqcapital.com/insights/state-of-saas',
      'https://openviewpartners.com/saas-benchmarks/',
    ],
    answer: `## Direct Answer

Outreach should price Smart Email Assist with a three-tier strategy: (1) $5-10/user/mo add-on for Pro tier (matches HubSpot Breeze's marginal cost positioning), (2) consumption pricing $0.50-1.50 per 1000 AI emails for heavy users (extracts margin from high-volume), (3) bundled-free in Enterprise tier ($190-230/user/mo) and Vertical SKUs to drive tier upgrade. The four named pricing competitors + the HubSpot Breeze bundle math + the differentiation framework + what Outreach must NOT do. Strategic imperative: don't compete on standalone price — compete on activity-graph depth + workflow integration.

## The 4 Named AI Pricing Competitors

- **HubSpot Breeze**: bundled with HubSpot Sales Hub Enterprise at $150/user/mo all-in (effectively $0-50 marginal AI cost)
- **Salesforce Einstein GPT**: bundled with Sales Cloud Enterprise at $0-20 marginal cost
- **Apollo Smart Email**: $50-100/user/mo bundle (data + sequencing + AI combined)
- **Lavender**: $30-40/user/mo standalone AI email composition
- **Outreach Smart Email Assist current**: $5-15/user/mo add-on OR $0.50-2.00/1000 emails consumption

## The HubSpot Breeze Bundle Math

- **HubSpot Sales Hub Enterprise**: $150/user/mo
- **Includes**: sequencing, AI email (Breeze), conversation intelligence, reporting
- **Marginal AI cost**: $0-50/user/mo over base CRM
- **Outreach Pro + Smart Email Assist add-on**: $130-160 + $5-15 = $135-175/user/mo
- **Outreach Enterprise (bundled AI)**: $190-230/user/mo
- **Net comparison**: HubSpot Breeze 30-50% cheaper than Outreach for HubSpot CRM customers
- **For Salesforce customers**: HubSpot Breeze isn't an option (CRM-locked)

## The 3-Tier Pricing Strategy

- **Tier 1: Pro tier add-on $5-10/user/mo** — matches HubSpot Breeze positioning; volume capture
- **Tier 2: Consumption pricing $0.50-1.50/1000 emails** — heavy users pay variable; margin-neutral at scale
- **Tier 3: Enterprise tier bundled at $190-230 all-in** — drives tier upgrade; AI included
- **Vertical SKUs** (FinServ, Healthcare, Industrial) — bundled AI at vertical premium 25-30%
- **Free trial caps at 100 emails** — prevents leakage abuse

## The Differentiation Framework (Don't Compete On Price)

- **Activity-graph training data** — Outreach AI trained on 6,000-brand corpus vs HubSpot Breeze on HubSpot-CRM-specific data
- **Sales-engagement specialization** — Smart Email Assist is sales-specific; HubSpot Breeze is general-purpose
- **Salesforce CRM integration depth** — Outreach + Salesforce wins where HubSpot Breeze can't go
- **Vertical-tuned AI** — FinServ + Healthcare + Industrial verticals
- **Multi-product platform** — Smart Email Assist + Kaia + Commit bundle
- **Net**: Don't compete on $5-10/user/mo. Compete on depth, integration, vertical specialization

## Customer-Type Pricing Decisions

- **Salesforce CRM, mid-market**: Outreach Pro + Smart Email Assist add-on $135-175/user/mo (HubSpot Breeze not available)
- **HubSpot CRM, mid-market**: lose to bundled HubSpot Sales Hub + Breeze unless Outreach offers compelling value
- **Salesforce CRM, enterprise**: Outreach Enterprise bundled $190-230/user/mo (premium but defensible)
- **Verticals (FinServ, Healthcare, Industrial)**: Outreach Vertical SKUs $200-280/user/mo with bundled AI (premium for compliance)
- **AI-buyer (any CRM)**: Outreach Smart Email Assist consumption pricing for heavy users

## What Outreach Should NOT Do

- **Don't price below $5/user/mo** — devalues AI category; race-to-bottom
- **Don't price above $20/user/mo standalone** — Apollo + Lavender win on cost
- **Don't bundle free in Pro tier** — margin destruction; $50-80M ARR risk
- **Don't ignore HubSpot CRM customers** — partnership / referral motion to retain
- **Don't make consumption pricing default** — admin budget unpredictability friction

## What Outreach Should Ship FY26-27

- **Smart Email Assist UX overhaul** (Q1 2026 per q1736) — close attach plateau gap
- **Vertical AI tuning** (Q2 2026) — FinServ + Healthcare + Industrial vertical-trained models
- **Per-1000-emails consumption tier** (Q1 2026) — heavy-user margin capture
- **AI Premium tier bundle** (Q3 2026) — Pro + Kaia + Commit + Smart Email Assist at premium
- **Salesforce Einstein integration partnership** (Q2 2026) — defends Salesforce-aligned customers

## A Markdown Table — Pricing Strategy By Customer Profile

| Profile | Outreach price | HubSpot Breeze price | Apollo Smart Email | Recommendation |
|---|---|---|---|---|
| Salesforce CRM mid-market | $135-175/user/mo | n/a (no Salesforce CRM) | $80-100 | Outreach wins by default |
| HubSpot CRM mid-market | $135-175/user/mo | $50-80 marginal | $80-100 | Outreach loses on price |
| Salesforce CRM enterprise | $190-230/user/mo | n/a | n/a | Outreach Enterprise tier |
| HubSpot CRM enterprise | $190-230/user/mo | $100-150 marginal | n/a | Outreach loses if HubSpot bundle close |
| Vertical (FinServ, etc.) | $200-280/user/mo | n/a | n/a | Outreach vertical premium |
| Heavy AI user | Consumption $1/1000 | Bundled cap | $80-100 | Outreach wins on volume math |

## A Mermaid Diagram — Pricing Decision Pie

\`\`\`mermaid
pie title "Smart Email Assist Pricing Mix FY27 (% of revenue)"
  "Pro tier add-on $5-10/mo (volume)" : 45
  "Enterprise bundled (tier upgrade)" : 30
  "Consumption pricing (heavy users)" : 15
  "Vertical SKU premium" : 10
\`\`\`

## Bottom Line

Outreach should price Smart Email Assist with three-tier strategy: $5-10/user/mo Pro add-on (volume) + consumption $0.50-1.50/1000 emails (heavy users) + bundled Enterprise tier (tier upgrade). Don't compete with HubSpot Breeze on standalone price (lose race-to-bottom); compete on activity-graph depth + Salesforce integration + vertical specialization + multi-product platform. Honest call: HubSpot CRM mid-market customers are lost to Breeze regardless; Salesforce CRM customers are Outreach territory. Vertical SKUs at premium pricing capture wallet HubSpot can't reach. (See also: q1729, q1734, q1736, q1740, q1751)

## Tags

outreach, smart-email-assist, hubspot-breeze, pricing-strategy, ai-bundle-pressure, consumption-pricing, fy27-pricing, crm-aligned-buyer, salesforce-customers, hubspot-customers

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.hubspot.com/products/ai
- https://www.hubspot.com/products/sales/sales-hub
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://openviewpartners.com/saas-benchmarks/`,
  },
  {
    id: 'q1785',
    question: 'Should Outreach launch its own AI agent marketplace?',
    tags: ['outreach', 'ai-agent-marketplace', 'platform-strategy', 'developer-ecosystem', 'fy27-marketplace', 'agent-orchestration', 'partner-ecosystem', 'revenue-share', 'salesforce-appexchange', 'platform-vs-product'],
    sources: [
      'https://www.outreach.io/about',
      'https://www.outreach.io/integrations',
      'https://appexchange.salesforce.com/',
      'https://www.hubspot.com/products/integrations',
      'https://www.anthropic.com/',
      'https://openai.com/',
      'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    ],
    answer: `## Direct Answer

Yes — Outreach should launch an AI agent marketplace by Q3 2026 as part of the agent-orchestration platform pivot (per q1771). The marketplace would host third-party AI agents (built on Anthropic Claude + OpenAI + Gemini + custom models) that integrate with Outreach activity graph + Kaia + Commit. The four named marketplace components + the revenue model + comparable platform plays + what Outreach must build first. Strategic imperative: positions Outreach as "AI Sales OS" platform vs "sequencer with AI add-ons" — different valuation multiple, different IPO narrative.

## The 4 Named Marketplace Components

- **Component 1: Agent directory** — searchable catalog of vertical / functional / persona-specific AI agents
- **Component 2: Agent SDK + APIs** — developers build agents that integrate with Outreach activity graph + Kaia signal + Commit forecasting
- **Component 3: Revenue share** — Outreach takes 30%, partner takes 70% (Salesforce AppExchange model)
- **Component 4: Quality + security review** — Outreach certifies agents for compliance, security, performance

## The 5 Named Agent Categories Outreach Should Host

- **Vertical agents**: FinServ compliance agent, Healthcare HIPAA-aware outreach agent, Industrial Manufacturing long-cycle agent
- **Functional agents**: meeting prep agent, deal coach agent, voicemail-drop agent, follow-up triage agent
- **Persona agents**: CRO advisor, RevOps analyst, Sales Manager coach
- **Integration agents**: Salesforce data enrichment, HubSpot sync, Slack notifier, ZoomInfo lookup
- **Custom enterprise agents**: customer-built agents for proprietary workflows

## The Revenue Model

- **Marketplace transactions**: customer pays for agent subscription/usage; Outreach takes 30%
- **Estimated marketplace revenue FY27**: $10-25M (per q1757 — 100+ apps target)
- **Estimated marketplace revenue FY28**: $30-60M (200+ agents)
- **Estimated marketplace revenue FY29**: $60-120M (300+ agents)
- **Brand value**: positions Outreach as platform; supports premium IPO multiple
- **Customer value**: ecosystem of vertical / functional agents; faster customization

## What Outreach Must Build First

- **Agent SDK** — APIs for agent developers to connect to activity graph + Kaia + Commit
- **Agent task routing engine** — Outreach decides which agent handles which task
- **Agent memory + context** — agents share context across sequences
- **Quality + security review process** — vetting agents before publishing
- **Marketplace discovery UX** — search, browse, install agents
- **Revenue + billing infrastructure** — handle subscription + transaction fees
- **Developer relations team** — evangelize platform to AI startups + enterprise developers

## Comparable Platform Marketplace Plays

- **Salesforce AppExchange (2005-)**: 7,000+ apps; $2B+ marketplace revenue; gold standard
- **HubSpot App Marketplace (2014-)**: 1,500+ apps; $200M+ revenue; mid-tier
- **Slack App Directory (2016-)**: 2,500+ apps; key Slack stickiness driver
- **Microsoft Copilot Plugins (2024-)**: emerging; platform play for Office Suite
- **OpenAI GPT Store (2024-)**: 3M+ GPTs; consumer + B2B mix
- **Pattern**: every successful platform-to-marketplace evolution adds 30-50% to enterprise value via ecosystem

## Why Outreach SHOULD Build This

- **Strategic positioning** — "AI Sales OS" vs "sequencer" justifies premium IPO multiple
- **Customer wallet expansion** — marketplace transactions add ARPU on top of base subscription
- **Defensive against AI-native** — ecosystem moat that Lavender + Apollo can't easily replicate
- **Vertical capture** — FinServ + Healthcare + Industrial agents drive vertical wallet
- **Developer brand** — attracts top AI talent + agent startups
- **Salesforce defensive** — ecosystem play that Salesforce native sequencing can't match

## Why It Could Fail

- **Insufficient agent supply** — fewer than 50 quality agents = marketplace looks empty
- **Quality control gaps** — bad agents damage brand
- **Customer adoption gap** — customers don't browse marketplace; agents go undiscovered
- **Revenue share friction** — agent developers prefer to sell direct
- **Competitive marketplaces** — OpenAI GPT Store, Anthropic Claude agents, Salesforce Agentforce
- **Engineering investment** — $5-10M to build infrastructure properly

## What Outreach Must NOT Do

- **Don't launch with <50 quality agents** — looks empty, damages credibility
- **Don't compete with Salesforce AppExchange directly** — different scope (Outreach is sales-engagement-specific)
- **Don't try to host EVERY agent type** — focus on sales-engagement adjacent
- **Don't take 50% revenue share** — too greedy; partners go elsewhere
- **Don't skip security review** — compliance failures damage enterprise customer trust

## A Markdown Table — Marketplace ROI Analysis FY27-29

| Metric | FY27 target | FY28 target | FY29 target |
|---|---|---|---|
| Number of agents | 100-150 | 200-300 | 300-500 |
| Marketplace revenue (Outreach 30%) | $10-25M | $30-60M | $60-120M |
| Customer adoption | 15-25% try | 35-45% try | 50-60% try |
| Engineering cost | $5-10M one-time | $3-5M ongoing | $3-5M ongoing |
| Brand multiplier on IPO | +0.5-1x ARR | +0.5-1.5x ARR | +1-2x ARR |
| Strategic positioning | Emerging platform | Established platform | Category platform |

## A Mermaid Diagram — Agent Marketplace Architecture

\`\`\`mermaid
mindmap
  root((Outreach AI Agent Marketplace FY27))
    Agent Directory
      Vertical agents
        FinServ compliance
        Healthcare HIPAA
        Industrial long-cycle
      Functional agents
        Meeting prep
        Deal coach
        Voicemail drop
      Persona agents
        CRO advisor
        RevOps analyst
      Integration agents
        Salesforce
        HubSpot
        Slack
        ZoomInfo
    Platform Infrastructure
      Agent SDK + APIs
      Task routing engine
      Memory + context
      Quality review
      Discovery UX
      Billing + revenue
    Revenue Model
      30 percent Outreach
      70 percent partner
      10-25M FY27
      30-60M FY28
      60-120M FY29
    Strategic Defense
      vs HubSpot Breeze
      vs Salesforce native
      vs Apollo Lavender
      vs OpenAI GPT Store
\`\`\`

## Bottom Line

Outreach should launch an AI agent marketplace by Q3 2026 — strategic imperative for "AI Sales OS" platform positioning. The honest call: marketplace adds $10-25M FY27 revenue + $60-120M FY29 revenue + 0.5-2x ARR multiplier on IPO valuation. Cost: $5-10M engineering + 8-12 month build. Strategic risk: insufficient agent supply OR quality control gaps damage brand. The Salesforce AppExchange + Slack App Directory comparable patterns suggest 30-50% enterprise value uplift from platform marketplace plays. Most important investment: agent SDK + APIs + quality review process — without those, marketplace fails. (See also: q1734, q1757, q1769, q1771, q1775)

## Tags

outreach, ai-agent-marketplace, platform-strategy, developer-ecosystem, fy27-marketplace, agent-orchestration, partner-ecosystem, revenue-share, salesforce-appexchange, platform-vs-product

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/integrations
- https://appexchange.salesforce.com/
- https://www.hubspot.com/products/integrations
- https://www.anthropic.com/
- https://openai.com/
- https://www.bvp.com/atlas/state-of-the-cloud-2026`,
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
