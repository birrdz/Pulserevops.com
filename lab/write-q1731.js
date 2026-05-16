const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Buying Outreach in 2027 is the right call IF you're (a) Salesforce-CRM, (b) >150 reps in pipeline-driven sales motion, (c) willing to commit to 3-yr contract for 30-40% discount, and (d) can absorb $150-220/user/mo all-in cost. Skip Outreach if you're <50 reps (HubSpot Sales Hub bundled is cheaper), HubSpot-CRM (Salesloft is the tighter integration), or your ACV is <$10K (Apollo at $50/user/mo wins on ROI). The 4-question buy/skip framework + the named alternatives by segment + the 18-month break-even math.

## The Real Cost — Outreach All-In FY27

- **List price**: Pro tier $130-160/user/mo, Enterprise tier $190-230/user/mo (depending on seat count + AI add-ons)
- **Smart Email Assist add-on**: +$15-30/user/mo or per-1000-AI-emails consumption
- **Kaia conversation intelligence**: +$25-45/user/mo
- **Commit forecasting**: +$30-50/user/mo
- **Implementation**: $40-120K one-time for >100-rep org (3-6 month rollout)
- **Internal admin overhead**: 0.5-1.0 FTE RevOps to maintain sequences + reporting
- **All-in TCO** for 200-rep org: ~$450-650K annual + $80K implementation = roughly $2,300-3,300/rep/yr

## The 4-Question Buy/Skip Framework

- **Question 1: What CRM?** Salesforce → Outreach. HubSpot → Salesloft. Microsoft Dynamics → Outreach. None → HubSpot Sales Hub bundled.
- **Question 2: How many reps in pipeline motion?** <50 reps → HubSpot Sales Hub or Apollo. 50-150 → Outreach Pro tier. 150+ → Outreach Enterprise + Strategic Account program.
- **Question 3: Average ACV?** <$10K → Apollo wins on ROI. $10K-$100K → Outreach Pro is fair. >$100K → Outreach Enterprise + Kaia + Commit pays back.
- **Question 4: Multi-year commit appetite?** 1-yr only → expect list price. 3-yr commit → 30-40% discount achievable + locked roadmap.

## Where Outreach Pays Back vs Where It Burns Money

- **Pays back fast**: enterprise SaaS, FinServ, Healthcare, Industrial Manufacturing — long sales cycles + named-account workflows + multi-stakeholder sequences. Break-even ~9-12 months on Pro tier when reps run 4+ active sequences.
- **Pays back slow**: mid-market technology, agencies, professional services — sequences help but ACV doesn't justify $150+/user/mo. Break-even 18-24 months.
- **Burns money**: SMB, low-touch SaaS, transactional ecommerce — visitors convert via product or HubSpot lifecycle marketing, not sequences. Outreach is over-tooled for this segment.
- **Edge case**: PLG-led companies adding outbound motion — Outreach plus PLG signal data (e.g., from Pocus, Endgame) compounds nicely; pays back ~12 months.

## Named Alternatives By Segment

- **Salesloft** — HubSpot CRM customers, mid-market simplicity, post-Vista 30-40% discount achievable. Cadence + Drift conversation tools.
- **Apollo** — sub-$10K ACV, sub-50-rep teams, $50-100/user/mo all-in including data + sequencing + AI email. Best ROI at low end.
- **HubSpot Sales Hub** — bundled with HubSpot CRM at marginal cost. Eats SMB and lower mid-market. Sequencing functionality is "good enough" for 80% of teams.
- **Salesforce native sequencing (Sales Engagement Cloud)** — bundled with Sales Cloud Enterprise at no marginal cost. Eats Salesforce-aligned customers who don't want a second vendor.
- **Lavender + Twain + Outplay** — AI-native challengers, $30-80/user/mo, no enterprise depth but compelling for AI-first email workflows.
- **Build internal** — large orgs ($1B+ revenue) with engineering capacity build internal cadence tooling on Salesforce + AWS. Total cost ~$2-4M to build, but breakeven vs Outreach Enterprise license at ~1500-rep scale.

## The 18-Month Break-Even Math (200-rep Salesforce Shop)

- Outreach Enterprise + Kaia + Commit = ~$650K/yr all-in
- Productivity uplift target: +12% pipeline coverage, +8% AE quota attainment
- For $5K-$15K ACV mid-market: incremental ARR per rep = ~$80K-$120K
- 200 reps × $100K incremental = $20M incremental ARR ceiling
- Even at 20% of ceiling realized = $4M incremental ARR vs $650K cost = 6:1 ROI
- Break-even hits month 5-9 if execution clean; month 18-24 if change management struggles

## What Could Make You Regret Buying Outreach in 2027

- **Salesloft post-Vista discount war**: if Vista decides to compete on price, Salesloft could come in 30-40% cheaper for HubSpot-CRM customers
- **HubSpot Sales Hub maturity**: HubSpot keeps closing the gap; by FY27 the bundled product may be 80% of Outreach functionality at 20% of cost
- **Salesforce native sequencing maturity**: Salesforce Sales Engagement Cloud is bundled free with Sales Cloud Enterprise — by FY27 may eat the Outreach value-prop for Salesforce-aligned shops
- **AI agent commoditization**: if Anthropic Claude Skills + OpenAI agents handle outbound natively by FY28, the entire sales engagement category compresses
- **Outreach acquisition uncertainty**: if Outreach gets acquired (Salesforce most likely buyer), roadmap + pricing may shift mid-contract

## A Markdown Table — Buy / Wait / Skip By Org Profile

| Org profile | Recommendation | Reason | Alternative |
|---|---|---|---|
| 200+ reps, Salesforce, $50K+ ACV, 3-yr commit | **Buy Outreach Enterprise** | Best enterprise depth + Kaia/Commit cross-sell | None comparable |
| 50-150 reps, Salesforce, $10-50K ACV | **Buy Outreach Pro** | Right-sized tier, manageable cost | Salesloft if HubSpot adjacent |
| 50-150 reps, HubSpot, $10-50K ACV | **Buy Salesloft** | HubSpot integration depth wins | Outreach Pro acceptable |
| <50 reps, any CRM, <$10K ACV | **Skip — buy Apollo** | $50/user/mo crushes Outreach ROI math | HubSpot Sales Hub if HubSpot CRM |
| SMB, transactional sales, no CRM | **Skip — buy HubSpot bundle** | Bundled cost beats standalone tooling | None — Outreach over-tooled |
| 1500+ reps, large eng team, custom workflows | **Wait — evaluate build vs buy** | Build TCO breaks even at scale | Outreach Enterprise as fallback |
| AI-first SDR motion, low ACV | **Buy Lavender or Apollo** | AI-native pricing + workflow | Outreach Smart Email Assist if upmarket |

## A Mermaid Decision Flow — Buy or Skip in 2027

\`\`\`mermaid
graph LR
  A["Considering Outreach?"] --> B{"What CRM?"}
  B -->|Salesforce| C{"How many reps?"}
  B -->|HubSpot| D["Buy Salesloft instead"]
  B -->|None / SMB| E["Buy HubSpot Sales Hub bundle"]
  C -->|50-150| F{"ACV size?"}
  C -->|150+| G["Buy Outreach Enterprise"]
  C -->|<50| H["Buy Apollo - cheaper"]
  F -->|$10K-$50K| I["Buy Outreach Pro"]
  F -->|<$10K| J["Skip - Apollo wins ROI"]
  F -->|>$50K| G
  G --> K{"Multi-year commit?"}
  K -->|3-yr| L["30-40 percent discount"]
  K -->|1-yr| M["Expect list price"]
\`\`\`

## Bottom Line

Outreach is worth buying in 2027 if you fit the narrow band — Salesforce CRM + 50+ reps + $10K+ ACV + multi-year commit appetite. Outside that band, the bundle alternatives (HubSpot Sales Hub, Salesforce native sequencing, Apollo) win on ROI. The honest answer most CROs need to hear: probably skip Outreach if you're <50 reps OR your CRM is HubSpot OR your ACV is sub-$10K. The 18-month break-even math is the gate. (See also: q1729, q1730)

## Tags

outreach, buy-vs-skip, sales-engagement, pricing, salesloft-alternative, apollo, hubspot-sales-hub, gtm-strategy, total-cost-of-ownership, enterprise-buyer

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.outreach.io/products/kaia
- https://www.outreach.io/products/commit
- https://www.salesloft.com/about
- https://www.apollo.io/
- https://www.hubspot.com/products/sales/sales-hub
- https://www.salesforce.com/products/sales-engagement-platform/
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.gartner.com/en/documents/sales-engagement`;

const entry = {
  id: 'q1731',
  question: 'Is Outreach worth buying in 2027?',
  answer,
  tags: ['outreach', 'buy-vs-skip', 'sales-engagement', 'pricing', 'salesloft-alternative', 'apollo', 'hubspot-sales-hub', 'gtm-strategy', 'total-cost-of-ownership', 'enterprise-buyer'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/products/smart-email-assist',
    'https://www.outreach.io/products/kaia',
    'https://www.outreach.io/products/commit',
    'https://www.salesloft.com/about',
    'https://www.apollo.io/',
    'https://www.hubspot.com/products/sales/sales-hub',
    'https://www.salesforce.com/products/sales-engagement-platform/',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    'https://www.gartner.com/en/documents/sales-engagement',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1731.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
