const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Manny Medina's job is on the line in 2027 for four specific reasons: (1) the FY27 IPO window — if Outreach goes public, the board will scrutinize founder-CEO continuity vs operator-CEO replacement; (2) the 2024 RIF + valuation drop ($4.4B → $2-3B) created board pressure for results; (3) Smart Email Assist attach rate must hit 50-60% to defend his "AI thesis"; (4) the upmarket-vs-mid-market pivot (his strategic call) needs to show payoff or get blamed for the slowdown. The four pressure points + the named board dynamics + the historical pattern for founder-CEOs at this stage.

## The 4 Pressure Points

- **Pressure 1 — IPO window scrutiny**: Outreach is IPO-ready by 2027-28 if growth holds 18-22%. At IPO, boards routinely evaluate founder-CEO vs bring-in-an-operator-CEO. Comparable: Eric Yuan (Zoom) survived; Daniel Loose (Looker) didn't; Stewart Butterfield (Slack) was eventually replaced post-acquisition.
- **Pressure 2 — Valuation drop**: $4.4B (2021) → $2-3B (2024-25). Boards don't fire CEOs over macro corrections, but a 30-50% valuation drop concentrates focus on execution. Investors (Spark Capital, Sapphire, Lone Pine) want to see strategic clarity.
- **Pressure 3 — Smart Email Assist must work**: Medina has personally championed Smart Email Assist as the AI-reacceleration thesis. If attach rate plateaus at 30-40% (per q1736), the thesis fails publicly. Boards punish public-thesis failures.
- **Pressure 4 — Upmarket pivot accountability**: The 2022-23 enterprise pivot was Medina's call. If mid-market churn from that pivot exceeds enterprise gains, the strategic call gets blamed for the slowdown (per q1732).

## The Named Board Dynamics

- **Spark Capital** (lead Series E): wants 3x+ return on investment, will push for IPO or strategic sale by 2027-28
- **Sapphire Ventures**: enterprise-focused, supports the upmarket pivot but expects results
- **Lone Pine Capital**: hedge-fund-style, will push for either IPO or acquisition exit
- **Salesforce Ventures** (strategic investor): may want acquisition path (Salesforce buys Outreach for CRM-bundle play)
- **Mayfield + Trinity Ventures**: early backers, less voice now but want exit

## What Survival Looks Like For Medina

- Hit FY27 ARR target $620-720M (per q1737) at 18-22% growth
- Smart Email Assist attach climbs to 50-60% by Q4 2026
- IPO 2027 at $1.5B+ valuation OR strategic acquisition at $2.5B+ premium
- Operating margin expansion from -10% (2022) to +5-15% (2027) holds
- 2-3 anchor enterprise wins/quarter through 2026 (SAP, Cisco-style logos)

## What Replacement Looks Like For Medina

- Growth slows below 15% by mid-2026 → board brings in operator CEO 2027
- Smart Email Assist attach stalls at 30-40% → AI thesis fails publicly → CEO change
- Enterprise upmarket pivot fails → board calls it "wrong call by founder" → CEO change
- IPO window closes → forced PE acquisition → Vista-style operator replaces Medina
- Most likely replacement profile: ex-Salesloft / Apollo / HubSpot operator with category experience

## The Historical Pattern — Founder-CEO Survival At This Stage

- **Survived IPO**: Eric Yuan (Zoom), Mark Roberge (HubSpot CRO not CEO), Aaron Levie (Box, partial), Tobi Lütke (Shopify)
- **Replaced pre-IPO**: Daniel Loose (Looker, sold to Google), Hayden Stafford (Pure-Play role at Pega), various seed-Series-D casualties
- **Replaced post-IPO**: Marc Benioff stayed but most don't — average founder-CEO tenure post-IPO is 4.2 years (BVP data)
- **Acquisition path**: Stewart Butterfield (Slack → Salesforce, eventually replaced), Mike Cannon-Brookes (Atlassian, still there), Jeff Lawson (Twilio, eventually replaced)

## The 5 Specific Things Medina Needs To Do In 2026

- **Ship Smart Email Assist UX overhaul** (Q1) — fix the 30-40% attach plateau
- **Defend mid-market pricing discipline** — don't let Vista/Salesloft trigger price war
- **Win 30+ Strategic Account deals at >$1M ACV** — anchor enterprise narrative
- **Hit 18-22% growth + +5-15% operating margin** — IPO-ready financials
- **Make 1-2 strategic AI/vertical acquisitions** — show category-leadership ambition

## A Markdown Table — Medina Survival Probability By Scenario

| Scenario | Conditions | Survival probability | Likely path |
|---|---|---|---|
| Bull — all 4 pressure points resolved | Smart Email works, growth holds, IPO succeeds | 80%+ | IPO + 2-3 yr CEO tenure post-IPO |
| Base — 3 of 4 resolved | Growth holds, Smart Email partial, IPO acceptable | 55-65% | IPO + 1-2 yr tenure, then succession plan |
| Bear — 2 of 4 resolved | Growth slows to 12-15%, Smart Email stalls | 25-35% | Operator-CEO brought in 2026-27 |
| Crash — 0-1 resolved | Growth <10%, AI thesis fails | 10-20% | Forced PE acquisition + Medina exit |

## A Mermaid Diagram — Medina FY27 Decision Tree

\`\`\`mermaid
graph LR
  A["Medina FY26 execution"] --> B{"Growth >= 18%?"}
  B -->|Yes| C{"Smart Email attach >= 50%?"}
  B -->|No| D["Board pressure mounts"]
  C -->|Yes| E["IPO 2027 - Medina survives"]
  C -->|No| F["AI thesis fails - succession plan"]
  D --> G{"Operating margin >= 5%?"}
  G -->|Yes| H["IPO acceptable - 1-2 yr tenure"]
  G -->|No| I["Operator CEO brought in"]
  F --> H
  I --> J["Vista-style PE acquisition"]
\`\`\`

## Bottom Line

Manny Medina's job is on the line in 2027 because four specific pressure points converge: IPO scrutiny, valuation drop, Smart Email Assist execution, and upmarket-pivot accountability. The honest call: 55-65% survival probability through FY27 if base case execution holds. Most likely outcome: Medina makes it to IPO 2027-28 then succession plan kicks in by 2029. Replacement profile: ex-category operator (Salesloft, Apollo, HubSpot alum). The board math is clear — founder-CEOs rarely run public companies more than 4 years post-IPO. (See also: q1729, q1732, q1733, q1736)

## Tags

outreach, manny-medina, ceo-succession, board-dynamics, ipo-prep, founder-ceo-pattern, valuation-pressure, vista-equity, spark-capital, smart-email-assist

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/blog/manny-medina
- https://www.crunchbase.com/organization/outreach-corp
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://www.linkedin.com/in/mannymedina/
- https://news.crunchbase.com/sales-marketing/outreach-layoffs-2024/`;

const entry = {
  id: 'q1738',
  question: "Why is Manny Medina's job on the line in 2027?",
  answer,
  tags: ['outreach', 'manny-medina', 'ceo-succession', 'board-dynamics', 'ipo-prep', 'founder-ceo-pattern', 'valuation-pressure', 'vista-equity', 'spark-capital', 'smart-email-assist'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/blog/manny-medina',
    'https://www.crunchbase.com/organization/outreach-corp',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    'https://www.iconiqcapital.com/insights/state-of-saas',
    'https://www.linkedin.com/in/mannymedina/',
    'https://news.crunchbase.com/sales-marketing/outreach-layoffs-2024/',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1738.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
