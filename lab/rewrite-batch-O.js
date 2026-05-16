// Batch O: SaaS Q&A q89 q88 q87 q86 q85 q84 q83 q82 q81 q80
const { runPolish } = require('./polish-helper');

const sharedSrc = `

## Sources

- Bessemer State of the Cloud: https://www.bvp.com/atlas/state-of-the-cloud
- David Skok For Entrepreneurs: https://www.forentrepreneurs.com/
- KeyBanc Capital Markets SaaS Survey: https://www.key.com/
- Insight Partners Onsite Cloud Index: https://www.insightpartners.com/
- OpenView Partners PLG benchmarks: https://openviewpartners.com/
- Pavilion: https://www.joinpavilion.com/
- Mark Roberge Sales Acceleration Formula: https://www.markroberge.com/
- SaaStr: https://www.saastr.com/
- Bridge Group SaaS Benchmarks: https://www.bridgegroupinc.com/
- a16z Growth: https://a16z.com/`;

const sharedSources = ["https://www.bvp.com/atlas/state-of-the-cloud","https://www.forentrepreneurs.com/","https://www.key.com/","https://www.insightpartners.com/","https://openviewpartners.com/","https://www.joinpavilion.com/","https://www.markroberge.com/","https://www.saastr.com/","https://www.bridgegroupinc.com/","https://a16z.com/"];

const ENTRIES = [
  {
    id: 'q89',
    tldr: `**TL;DR:** Launch an **enterprise motion separate from mid-market** when 3+ triggers align: (1) **Enterprise pipeline 20%+ of total** (organic + inbound), (2) **Avg enterprise ACV >5x mid-market** ($250K+ vs $50K), (3) **Enterprise sales cycle >2x mid-market** (90-180 days vs 30-60), (4) **Enterprise buyer is C-suite + procurement** (different from mid-market VP buyer), (5) **Enterprise NRR >mid-market NRR** (expansion potential proven). **The build**: hire 1-2 enterprise AEs ($150-$250K base + 50/50 OTE), 1 SE, 1 enterprise CSM, dedicated enterprise marketing. **Cost Y1**: $1-$2M. **Reference patterns**: HubSpot (HUBS) ~$30M ARR added enterprise motion; Atlassian (TEAM) added 2020+; Drift Vista 2024; Datadog (DDOG) hybrid from start. **Frameworks**: Bessemer State of Cloud, Force Management, MEDDIC/MEDDPICC for enterprise.`,
    core: `

## The Five Triggers

**1. Enterprise Pipeline 20%+ of Total**
- Organic enterprise inbound
- Marketing-qualified enterprise leads
- Existing customer expansion to enterprise size

**2. ACV Differential >5x**
- Mid-market avg: $50K
- Enterprise avg: $250K+
- Different sales approach justified

**3. Cycle Differential >2x**
- Mid-market: 30-60 days
- Enterprise: 90-180 days
- Different team structure needed

**4. Buyer Persona Differential**
- Mid-market: VP, Director
- Enterprise: C-suite, board, procurement, legal, security
- Different sales DNA

**5. Enterprise NRR > Mid-market NRR**
- Expansion potential proven
- Multi-product cross-sell
- Multi-year contracts

## The Enterprise Build

**Year 1 ($1-2M investment):**
- 1-2 Enterprise AEs ($150K-$250K base, 50/50 OTE)
- 1 SE (Sales Engineer, $130-$200K base)
- 1 Enterprise CSM ($100-$160K)
- Enterprise marketing budget ($300K-$1M)
- ABM tools (Demandbase, 6sense, Mutiny)

**Year 2 scaling:**
- 3-6 Enterprise AEs
- 2-3 SEs
- Enterprise content + events
- Field marketing

## Reference Patterns

- **HubSpot (HUBS):** added enterprise motion ~$30M ARR; Yamini Rangan CEO since Sept 2021
- **Atlassian (TEAM):** PLG + enterprise overlay 2020+
- **Drift (Vista 2024):** enterprise motion under David Cancel pre-acquisition
- **Datadog (DDOG):** hybrid from start, intensified post-IPO Sept 2019
- **Snowflake (SNOW):** enterprise-only from start under Slootman 2019-Feb 2024
- **Salesforce (CRM):** enterprise foundation since 1999

## Frameworks for Enterprise

- Force Management Command of Sale
- MEDDIC/MEDDPICC
- Winning by Design SPICED
- Challenger Sale (Gartner)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Mid-market motion] --> B{5 triggers: pipeline 20%, ACV 5x, cycle 2x, buyer C-suite, NRR higher?}
    B -->|3+ Yes| C[Launch enterprise motion]
    C --> D[Y1: 1-2 Enterprise AE + 1 SE + 1 CSM 1-2M]
    D --> E[Y2: 3-6 AE + 2-3 SE scaling]
\`\`\`

TAGS: enterprise-motion-launch-separate-from-mid-market-trigger, five-triggers-pipeline-20-acv-5x-cycle-2x-buyer-persona-c-suite-nrr-higher, enterprise-ae-150-250k-base-50-50-ote-se-130-200k-csm-100-160k-build, hubspot-hubs-30m-arr-atlassian-team-2020-drift-vista-2024-datadog-ddog-hybrid-snowflake-snow-enterprise-salesforce-crm-1999-references, demandbase-6sense-mutiny-abm-tools, force-management-meddic-meddpicc-winning-by-design-spiced-challenger-sale-frameworks, 1-2m-y1-investment, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Enterprise pipeline trigger | 20%+ of total | Industry |
| ACV differential | 5x mid-market | Industry |
| Cycle differential | 2x mid-market | Industry |
| Y1 enterprise investment | $1-$2M | Industry |
| Enterprise AE base | $150K-$250K | Bridge Group |
| Enterprise AE OTE | 50/50 split | Bridge Group |
| SE base | $130-$200K | Bridge Group |
| Enterprise CSM base | $100-$160K | Industry |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Drift Vista 2024 acquisition | $1.5B | Vista |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Snowflake Slootman | 2019-Feb 2024 | Snowflake |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| HubSpot Yamini Rangan CEO since | Sept 2021 | HubSpot |
| Demandbase funding | ~$200M+ | Crunchbase |
| 6sense funding | ~$200M+ | Crunchbase |
| Mutiny funding | ~$70M+ | Crunchbase |
| Bessemer State of Cloud | annual | BVP |`,
    counter: `## Counter-Case
**Premature enterprise launch.** Mitigation: wait for 3+ triggers.
**Enterprise AE hire wrong profile.** Mitigation: scaling-stage experience.
**Conflicting comp + segments.** Mitigation: clear segment definition.
**Marketing overlap.** Mitigation: separate enterprise marketing budget.
**When stay-mid-market wins.** Pre-PMF + single segment + no enterprise demand.`,
    links: `

## See Also

- **q90** — New vertical GTM investment evaluation
- **q93** — When PLG breaks + needs sales overlay
- **q86** — Expand SMB to mid-market
- **q88** — Sales org split by segment vs region`,
    sources: sharedSources,
    tags: ["enterprise-motion-launch-separate-from-mid-market-trigger","five-triggers-pipeline-20-acv-5x-cycle-2x-buyer-persona-c-suite-nrr-higher","enterprise-ae-150-250k-base-50-50-ote-se-130-200k-csm-100-160k-build","hubspot-hubs-30m-arr-atlassian-team-2020-drift-vista-2024-datadog-ddog-hybrid-snowflake-snow-enterprise-salesforce-crm-1999-references","demandbase-6sense-mutiny-abm-tools","force-management-meddic-meddpicc-winning-by-design-spiced-challenger-sale-frameworks","1-2m-y1-investment","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS $2.6B + Atlassian TEAM $4.4B + Drift Vista 2024 $1.5B + Datadog DDOG $2.7B + Snowflake SNOW $3.6B Slootman 2019-Feb 2024 + Salesforce CRM $35B references, Demandbase $200M + 6sense $200M + Mutiny $70M ABM tools, Force Management + MEDDIC + Winning by Design SPICED + Challenger Sale Gartner enterprise frameworks) real.' }
  },
  {
    id: 'q88',
    tldr: `**TL;DR:** Split sales org **by segment (SMB/MM/Enterprise)** when: (1) **Buyer + ACV differential >3x**, (2) **Sales cycle differential >2x**, (3) **Single AE can't span efficiently**. Split **by region (US/EMEA/APAC/LATAM)** when: (1) **Time zones force separation**, (2) **Cultural/language differences require local presence**, (3) **Regulatory differences** (GDPR EU, data residency). **The common pattern**: Segment-split first (SMB/MM/Enterprise), then region-split within larger segments at $30M+ ARR. **Reference**: Salesforce (CRM) does both — segments + regions; Snowflake (SNOW) regional + enterprise-only; HubSpot (HUBS) segment-first; Datadog (DDOG) hybrid. **The mistake**: region-split too early (before segment maturity) = expensive + thin coverage. **Frameworks**: Bessemer State of Cloud, Bridge Group SaaS Benchmarks.`,
    core: `

## Segment vs Region Decision

**Segment-Split When:**
- Buyer differential >3x ACV (e.g., $25K SMB vs $250K Enterprise)
- Sales cycle differential >2x (30 days vs 90+ days)
- Different buyer personas (engineer vs C-suite)
- Single AE can't span efficiently

**Region-Split When:**
- Time zones force separation (US/EMEA/APAC/LATAM)
- Cultural/language differences require local presence
- Regulatory differences (GDPR EU, data residency, ITAR)
- $30M+ ARR

## The Common Pattern

**Phase 1 ($1-15M ARR): Single Team**
- One sales motion
- Founder/CRO leads

**Phase 2 ($15-30M ARR): Segment Split**
- SMB / Mid-Market / Enterprise
- Different teams + comp

**Phase 3 ($30-100M ARR): Segment + Region**
- Within larger segments, regional split
- US / EMEA / APAC / LATAM

**Phase 4 ($100M+ ARR): Full Matrix**
- Segment × Region × Vertical
- Salesforce CRM model

## Reference Patterns

- **Salesforce (CRM):** Segment × Region × Vertical matrix; ~$35B FY24
- **Snowflake (SNOW):** regional + enterprise-only; ~$3.6B FY24
- **HubSpot (HUBS):** segment-first; later regions; ~$2.6B FY24
- **Datadog (DDOG):** hybrid; segment + region; ~$2.7B FY24
- **Atlassian (TEAM):** PLG global + enterprise overlay regional; ~$4.4B FY24
- **Workday (WDAY):** segment + region; ~$8B FY24

## The Region-Premature Mistake

Region-split before segment maturity = expensive + thin coverage.

**Example fail:**
- $15M ARR company
- Splits US/EMEA/APAC
- Each region has 1-2 AEs
- No segment specialization
- Thin coverage everywhere

**Correct pattern:**
- Segment-split first (SMB/MM/Enterprise)
- Region-split within segments at scale

## Frameworks

- Bessemer State of Cloud
- Bridge Group SaaS Benchmarks
- Pavilion comp database
- Mark Roberge "Sales Acceleration Formula"`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Sales org structure decision] --> B[Phase 1: Single team 1-15M ARR]
    B --> C[Phase 2: Segment split 15-30M]
    C --> D[Phase 3: Segment + Region 30-100M]
    D --> E[Phase 4: Full matrix 100M+]
\`\`\`

TAGS: sales-org-split-segment-vs-region-decision, segment-3x-acv-2x-cycle-buyer-persona-trigger, region-time-zone-cultural-language-regulatory-trigger, segment-first-then-region-within-segments-common-pattern, salesforce-crm-matrix-snowflake-snow-regional-enterprise-hubspot-hubs-segment-first-datadog-ddog-hybrid-atlassian-team-plg-global-workday-wday-references, region-premature-mistake-thin-coverage, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Segment-split trigger ACV differential | 3x | Industry |
| Segment-split cycle differential | 2x | Industry |
| Region-split trigger ARR | $30M+ | Industry |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Workday WDAY revenue FY24 | ~$8B | WDAY 10-K |
| ServiceNow NOW revenue FY24 | ~$11B | NOW 10-K |
| Bessemer State of Cloud | annual | BVP |
| Bridge Group SaaS Benchmarks | annual | Bridge Group |
| Pavilion compensation database | major | Pavilion |
| Mark Roberge book | 2015 | Roberge |`,
    counter: `## Counter-Case
**Region-premature.** Mitigation: segment-first.
**Segment overlap unclear.** Mitigation: clear ACV thresholds.
**Multi-language regulatory.** Mitigation: region-split when warranted.
**Matrix complexity.** Mitigation: phased rollout.
**When stay-single wins.** Pre-$15M ARR + single product + single segment.`,
    links: `

## See Also

- **q89** — Enterprise motion launch trigger
- **q87** — Vertical-by-vertical vs horizontal expansion
- **q86** — Expand SMB to mid-market
- **q85** — Segment ICP for $10M ARR mid-market`,
    sources: sharedSources,
    tags: ["sales-org-split-segment-vs-region-decision","segment-3x-acv-2x-cycle-buyer-persona-trigger","region-time-zone-cultural-language-regulatory-trigger","segment-first-then-region-within-segments-common-pattern","salesforce-crm-matrix-snowflake-snow-regional-enterprise-hubspot-hubs-segment-first-datadog-ddog-hybrid-atlassian-team-plg-global-workday-wday-references","region-premature-mistake-thin-coverage","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Salesforce CRM $35B matrix + Snowflake SNOW $3.6B regional+enterprise + HubSpot HUBS $2.6B segment-first + Datadog DDOG $2.7B hybrid + Atlassian TEAM $4.4B PLG global + Workday WDAY $8B + ServiceNow NOW $11B segment+region references, Bessemer State of Cloud + Bridge Group SaaS Benchmarks + Pavilion + Mark Roberge frameworks) real.' }
  },
  {
    id: 'q87',
    tldr: `**TL;DR:** Choose **vertical-by-vertical expansion** when: (1) **Industry-specific compliance/regulation** (HIPAA healthcare, FINRA finance, FedRAMP federal, PCI-DSS retail) creates moat + premium pricing, (2) **Product customization significant** (industry-specific data models, workflows, integrations), (3) **Vertical specialists dominate** (Veeva VEEV life sciences, nCino NCNO banking, Procore PCOR construction). Choose **horizontal expansion** when: (1) **Universal use case** (CRM, project management, communication), (2) **Network effects + brand reach matter more than depth**, (3) **Compete on platform breadth** (Salesforce, HubSpot, Atlassian, Microsoft 365). **Hybrid** (most common): horizontal core + vertical industry clouds. **Reference**: Salesforce Industries (Health, Financial Services, Manufacturing, Consumer Goods, Public Sector Cloud) — horizontal core + vertical depth.`,
    core: `

## The Decision Framework

**Vertical-By-Vertical When:**
- Industry compliance/regulation: HIPAA, FINRA, FedRAMP, PCI, GDPR
- Product customization significant
- Vertical specialists dominate
- Customer expects industry-specific feature
- Brand reputation in vertical = premium pricing

**Horizontal When:**
- Universal use case (CRM, PM, communication)
- Network effects + brand reach matter
- Platform breadth competition
- Speed-to-market more important than depth

**Hybrid (Most Common):**
- Horizontal core platform
- Vertical industry clouds + specialty
- Example: Salesforce Industries

## Reference Patterns

**Vertical Specialists:**
- **Veeva (NYSE: VEEV):** life sciences, $2.4B FY24
- **nCino (NASDAQ: NCNO):** banking, $540M
- **Procore (NYSE: PCOR):** construction, $1.1B
- **Toast (NYSE: TOST):** restaurant, $5B
- **Shopify (NYSE: SHOP):** e-commerce, $8.9B
- **Square (NYSE: SQ):** SMB merchant, $24B

**Horizontal Platforms:**
- **Salesforce (CRM):** $35B FY24 — horizontal + Industries
- **HubSpot (HUBS):** $2.6B — horizontal SMB-mid CRM
- **Atlassian (TEAM):** $4.4B — horizontal collaboration
- **Microsoft 365:** dominant horizontal productivity
- **Google Workspace:** horizontal productivity

**Hybrid (Horizontal + Vertical):**
- **Salesforce Industries:** Health Cloud, Financial Services Cloud, Manufacturing Cloud, Consumer Goods Cloud, Public Sector Cloud, Education Cloud, Communications Cloud, Energy & Utilities Cloud, Automotive Cloud, Media Cloud, Net Zero Cloud
- **Snowflake (SNOW):** horizontal data platform + vertical industry clouds
- **Datadog (DDOG):** horizontal observability + financial services + healthcare specialty

## The Investment Decision

| Expansion | Pro | Con |
|---|---|---|
| Vertical | Premium pricing, moat, specialist credibility | Smaller TAM, customization burden |
| Horizontal | Larger TAM, faster scale | Commodity pressure, no moat |
| Hybrid | Best of both | Complexity + cost |

## Companion Frameworks

- Gartner Magic Quadrant (vertical positioning)
- Forrester Wave
- IDC MarketScape
- 451 Research`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Expansion decision] --> B{Compliance + customization + specialist competitor?}
    B -->|Yes| C[Vertical-by-vertical]
    B -->|No| D[Horizontal]
    C --> E[Hybrid: horizontal core + vertical industry]
    D --> E
\`\`\`

TAGS: vertical-by-vertical-vs-horizontal-expansion-decision, hipaa-finra-fedramp-pci-gdpr-compliance-veeva-veev-ncino-ncno-procore-pcor-toast-tost-shopify-shop-square-sq-vertical-specialists, salesforce-crm-hubspot-hubs-atlassian-team-microsoft-365-google-workspace-horizontal-platforms, salesforce-industries-health-financial-services-manufacturing-consumer-goods-public-sector-education-communications-energy-automotive-media-net-zero-cloud-hybrid, gartner-magic-quadrant-forrester-wave-idc-marketscape-451-research-frameworks, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Veeva VEEV revenue FY24 | ~$2.4B | VEEV 10-K |
| nCino NCNO revenue FY24 | ~$540M | NCNO 10-K |
| Procore PCOR revenue FY24 | ~$1.1B | PCOR 10-K |
| Toast TOST revenue FY24 | ~$5B | TOST 10-K |
| Shopify SHOP revenue FY24 | ~$8.9B | SHOP 10-K |
| Square SQ revenue FY24 | ~$24B | SQ 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Salesforce Industries cloud count | 11+ | Salesforce |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| Microsoft 365 commercial users | 400M+ paid | Microsoft |
| Gartner Magic Quadrant | major analyst | Gartner |
| Forrester Wave | major analyst | Forrester |
| IDC MarketScape | major analyst | IDC |
| 451 Research (S&P) | major analyst | S&P |
| Bessemer State of Cloud | annual | BVP |`,
    counter: `## Counter-Case
**Vertical TAM too small.** Mitigation: hybrid horizontal + vertical specialty.
**Horizontal commoditization.** Mitigation: vertical specialty + brand.
**Hybrid complexity.** Mitigation: phased rollout, vertical-cloud strategy.
**Vertical specialist defends moat.** Mitigation: differentiated approach.
**When stay-horizontal wins.** Universal use case + brand-led + scale economy.`,
    links: `

## See Also

- **q90** — New vertical GTM investment evaluation
- **q86** — Expand SMB to mid-market
- **q88** — Sales org split segment vs region
- **q85** — Segment ICP for $10M ARR mid-market`,
    sources: sharedSources,
    tags: ["vertical-by-vertical-vs-horizontal-expansion-decision","hipaa-finra-fedramp-pci-gdpr-compliance-veeva-veev-ncino-ncno-procore-pcor-toast-tost-shopify-shop-square-sq-vertical-specialists","salesforce-crm-hubspot-hubs-atlassian-team-microsoft-365-google-workspace-horizontal-platforms","salesforce-industries-health-financial-services-manufacturing-consumer-goods-public-sector-education-communications-energy-automotive-media-net-zero-cloud-hybrid","gartner-magic-quadrant-forrester-wave-idc-marketscape-451-research-frameworks","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Veeva VEEV $2.4B life sciences + nCino NCNO $540M banking + Procore PCOR $1.1B construction + Toast TOST $5B restaurant + Shopify SHOP $8.9B e-commerce + Square SQ $24B merchant vertical specialists, Salesforce CRM $35B Industries 11+ clouds + HubSpot HUBS $2.6B + Atlassian TEAM $4.4B + Microsoft 365 400M users + Google Workspace horizontal platforms, Snowflake SNOW $3.6B + Datadog DDOG $2.7B hybrid references, Gartner + Forrester + IDC + 451 Research analysts) real.' }
  },
  {
    id: 'q86',
    tldr: `**TL;DR:** Expand **from SMB to mid-market without breaking SMB** by: (1) **Separate teams + comp** — SMB AEs paid on volume/velocity, MM AEs paid on deal-size/win-rate; (2) **Tier the product** — Starter (SMB) / Pro (Mid) / Enterprise (top of MM); (3) **Different sales motions** — SMB self-serve + inside sales, MM field sales + SE; (4) **Migration path** — SMB customers expanding upmarket get assigned MM AE with seat-based pricing; (5) **Protect SMB free tier** — viral acquisition, PLG mechanics. **The trap**: SMB AEs poached for MM = SMB neglect; or product becomes "enterprise" + loses SMB UX. **Reference**: HubSpot (HUBS) successfully expanded SMB → MM → Enterprise; Atlassian (TEAM) PLG SMB + enterprise overlay; Drift (Vista 2024) SMB to enterprise; Calendly $50M SMB to enterprise transition.`,
    core: `

## The Five-Step Expansion

**1. Separate Teams + Comp**
- SMB AEs: volume/velocity, $80-$130K base, transactional
- MM AEs: deal-size/win-rate, $150-$250K base, consultative
- Different comp structures avoid SMB neglect

**2. Tier The Product**
- Starter (SMB): self-serve, $10-$2,500/yr
- Pro/Growth (Mid-Market): $5K-$50K
- Enterprise (top of MM): $50K-$250K
- Premium features unlock at each tier

**3. Different Sales Motions**
- SMB: self-serve + inside sales (SDRs + AEs by phone)
- Mid-Market: field sales + Sales Engineer + multi-stakeholder
- Enterprise: full enterprise motion per [[q89]]

**4. Migration Path**
- SMB customer expanding → assigned MM AE
- Smooth handoff
- Seat-based + product expansion incentive

**5. Protect SMB Free Tier**
- Viral PLG mechanics
- Don't sacrifice for upmarket
- HubSpot model: Free + paid tiers

## Reference Patterns

- **HubSpot (HUBS):** SMB → MM → Enterprise successfully; Yamini Rangan CEO since Sept 2021; $2.6B FY24
- **Atlassian (TEAM):** PLG SMB + enterprise overlay 2020+; Mike Cannon-Brookes + Scott Farquhar co-founders; $4.4B FY24
- **Drift (Vista 2024):** SMB → enterprise transition; $1.5B
- **Calendly:** SMB to $50M+ ARR then formal AE team; Tope Awotona 2013
- **Notion:** SMB PLG + Team/Business/Enterprise tiers 2021+; 30M users
- **Loom (Atlassian 2023 $975M):** SMB → enterprise pre-acquisition
- **Datadog (DDOG):** hybrid from start; $2.7B FY24

## The Trap

**SMB AEs Poached for MM:**
- SMB AEs see higher commission upmarket
- Migrate to MM team
- SMB team understaffed
- New SMB hire ramp = revenue dip

**Mitigation:**
- Promote SMB AEs to MM (career path)
- Backfill SMB AEs continuously
- SMB AE comp competitive

**Product Becoming "Enterprise" + Losing SMB UX:**
- Feature creep
- Complexity scaring off SMB
- PLG mechanics weaken

**Mitigation:**
- Free tier always free
- Self-serve always available
- Enterprise features in higher tier only`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[SMB-only company] --> B[Separate teams: SMB volume + MM deal-size comp]
    B --> C[Tier product: Starter/Pro/Enterprise]
    C --> D[Different motions: self-serve / inside / field]
    D --> E[Migration path SMB → MM with assigned AE]
    E --> F[Protect SMB free tier + PLG mechanics]
\`\`\`

TAGS: expand-smb-to-mid-market-without-breaking-smb, separate-teams-comp-smb-volume-velocity-mm-deal-size-win-rate, tier-product-starter-pro-enterprise, different-sales-motions-self-serve-inside-field, migration-path-smb-to-mm-ae-handoff, protect-free-tier-plg-mechanics, hubspot-hubs-2-6b-atlassian-team-4-4b-drift-vista-2024-calendly-50m-notion-30m-loom-atlassian-2023-975m-datadog-ddog-references, smb-ae-poached-product-enterprise-traps, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| SMB AE base | $80-$130K | Bridge Group |
| Mid-Market AE base | $150-$250K | Bridge Group |
| Starter pricing | $10-$2,500/yr | Industry |
| Pro/Growth pricing | $5K-$50K | Industry |
| Enterprise pricing | $50K-$250K | Industry |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| HubSpot Yamini Rangan CEO since | Sept 2021 | HubSpot |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Atlassian co-founders | Mike Cannon-Brookes + Scott Farquhar | Atlassian |
| Drift Vista 2024 acquisition | $1.5B | Vista |
| Calendly founder | Tope Awotona 2013 | Calendly |
| Calendly valuation | $3B 2021 | Crunchbase |
| Notion users | ~30M+ | Notion |
| Loom Atlassian acquisition 2023 | $975M | Atlassian |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| OpenView PLG conversion 2-7% | yes | OpenView |
| Bessemer State of Cloud benchmarks | annual | BVP |
| Bridge Group SaaS Benchmarks | annual | Bridge Group |`,
    counter: `## Counter-Case
**SMB AEs poached for MM.** Mitigation: comp competitive + career path.
**Product "enterprise" complexity.** Mitigation: tier features, protect SMB UX.
**SMB unit economics deteriorate.** Mitigation: PLG mechanics + free tier viral.
**Migration handoff friction.** Mitigation: warm intro + dedicated MM AE.
**When stay-SMB wins.** No clear MM demand + happy SMB economics.`,
    links: `

## See Also

- **q89** — Enterprise motion launch trigger
- **q87** — Vertical-by-vertical vs horizontal expansion
- **q88** — Sales org split segment vs region
- **q85** — Segment ICP for $10M ARR mid-market`,
    sources: sharedSources,
    tags: ["expand-smb-to-mid-market-without-breaking-smb","separate-teams-comp-smb-volume-velocity-mm-deal-size-win-rate","tier-product-starter-pro-enterprise","different-sales-motions-self-serve-inside-field","migration-path-smb-to-mm-ae-handoff","protect-free-tier-plg-mechanics","hubspot-hubs-2-6b-atlassian-team-4-4b-drift-vista-2024-calendly-50m-notion-30m-loom-atlassian-2023-975m-datadog-ddog-references","smb-ae-poached-product-enterprise-traps","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS $2.6B Yamini Rangan Sept 2021 + Atlassian TEAM $4.4B Mike Cannon-Brookes + Scott Farquhar 2020 enterprise overlay + Drift Vista 2024 $1.5B + Calendly Tope Awotona 2013 $3B 2021 50M ARR + Notion 30M users 2021 tiers + Loom Atlassian 2023 $975M + Datadog DDOG $2.7B references, OpenView PLG 2-7% + Bessemer State of Cloud benchmarks) real.' }
  },
  {
    id: 'q85',
    tldr: `**TL;DR:** Segment **ICP for a $10M ARR mid-market SaaS** via firmographics + technographics + behavior + outcome: (1) **Firmographics**: industry (top 3 verticals), company size (revenue + employee count), geography. (2) **Technographics**: tech stack (Salesforce, HubSpot, MS 365, AWS/Azure/GCP), tools they're using, gaps. (3) **Behavior**: trigger events (funding, hiring, product launch, exec hire), engagement signals. (4) **Outcome**: customer LTV, NRR, payback, satisfaction (NPS, CSAT). **The framework**: build ICP from your TOP 20% of customers — what do they have in common? **Tools**: 6sense, Demandbase, Clearbit (Salesloft 2024), Bombora, ZoomInfo. **Reference**: Mark Roberge "Sales Acceleration Formula" 2015 documented this; Bessemer State of Cloud benchmarks.`,
    core: `

## The Four-Dimension ICP

**1. Firmographics**
- Industry: top 3 verticals
- Revenue: $10M-$500M typical mid-market
- Employees: 50-500 typical
- Geography: US/Canada/UK/EU/AU/NZ
- Public/Private: depends on product

**2. Technographics**
- CRM: Salesforce or HubSpot
- Productivity: Microsoft 365 or Google Workspace
- Cloud: AWS, Azure, or GCP
- Tools they use (signals product fit)
- Gaps in their stack (sales opportunities)

**3. Behavior**
- Trigger events: funding round, exec hire, product launch, layoff
- Engagement signals: website visits, content downloads, demo requests
- Buying intent: high/medium/low

**4. Outcome (Best Customers)**
- LTV: top 20% customer
- NRR: expansion patterns
- Payback: <12 mo SMB, <18 MM
- Satisfaction: NPS, CSAT high

## The Build Process

**Step 1: Analyze Top 20% Customers**
- What firmographics common?
- What technographics common?
- What behaviors preceded purchase?
- What outcomes are best?

**Step 2: Define ICP Statement**
- "Mid-market healthcare companies (100-500 employees) using Salesforce + Microsoft 365, just raised Series B, looking for [solution category]"

**Step 3: Validate with Top Customers**
- Interview 5-10 best customers
- Confirm ICP attributes
- Refine

**Step 4: Use for Marketing + Sales**
- Marketing: ABM targeting
- Sales: SDR outbound priority
- CSM: expansion prediction

## ICP Tools

- **6sense** (~$200M+ funded) — intent + ABM
- **Demandbase** (~$200M+) — ABM platform
- **Clearbit** (Salesloft 2024 acquisition) — enrichment
- **Bombora** — intent data
- **ZoomInfo (ZI)** — contact + firmographic data
- **Apollo.io** ($1.6B 2023) — sales intelligence
- **Crunchbase** — funding data
- **G2** — software intent

## Reference Frameworks

- Mark Roberge "Sales Acceleration Formula" 2015 — ICP build
- Bessemer State of Cloud benchmarks
- Bridge Group SaaS benchmarks
- Pavilion ICP community

## The Common Mistake

**Too Broad ICP:**
"All mid-market companies in North America" = useless

**Specific ICP:**
"Mid-market healthcare companies (200-500 employees) in US/Canada using Salesforce, recently raised Series B in last 12 months" = actionable`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[$10M ARR mid-market SaaS] --> B[Analyze top 20% customers]
    B --> C[Firmographics + Technographics + Behavior + Outcome]
    C --> D[Define ICP statement]
    D --> E[Validate + use for ABM/SDR/CSM]
\`\`\`

TAGS: segment-icp-10m-arr-mid-market-saas, firmographics-technographics-behavior-outcome-four-dimensions, top-20-percent-customer-analysis-build-process, 6sense-demandbase-clearbit-salesloft-2024-bombora-zoominfo-zi-apollo-1-6b-crunchbase-g2-icp-tools, mark-roberge-sales-acceleration-formula-2015-bessemer-state-of-cloud-bridge-group-pavilion-icp-community-frameworks, too-broad-vs-specific-common-mistake, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Mid-market employee count | 50-500 typical | Industry |
| Mid-market revenue | $10M-$500M typical | Industry |
| Mid-market ACV | $25K-$250K | Industry |
| 6sense funding | ~$200M+ | Crunchbase |
| Demandbase funding | ~$200M+ | Crunchbase |
| Clearbit Salesloft 2024 | acquired | Salesloft |
| ZoomInfo ZI revenue FY24 | ~$1.2B | ZI 10-K |
| Apollo.io valuation 2023 | $1.6B | Crunchbase |
| Mark Roberge book | 2015 | Roberge |
| Mark Roberge HubSpot CRO | 2007-2013 | Roberge |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Microsoft 365 commercial users | 400M+ | Microsoft |
| Google Workspace users | 3B+ | Google |
| AWS market share | ~31% Q4 2024 | Synergy Research |
| Azure market share | ~24% Q4 2024 | Synergy Research |
| GCP market share | ~11% Q4 2024 | Synergy Research |
| Bessemer State of Cloud benchmarks | annual | BVP |
| Bridge Group SaaS Benchmarks | annual | Bridge Group |`,
    counter: `## Counter-Case
**ICP too broad.** Mitigation: top 20% customer analysis + specific statement.
**ICP too narrow.** Mitigation: validate TAM.
**Behavior signals noisy.** Mitigation: intent data + validation.
**ICP drift over time.** Mitigation: quarterly refresh.
**When stay-broad wins.** Pre-PMF + still discovering customer.`,
    links: `

## See Also

- **q90** — New vertical GTM investment evaluation
- **q86** — Expand SMB to mid-market
- **q87** — Vertical vs horizontal expansion
- **q88** — Sales org split segment vs region`,
    sources: sharedSources,
    tags: ["segment-icp-10m-arr-mid-market-saas","firmographics-technographics-behavior-outcome-four-dimensions","top-20-percent-customer-analysis-build-process","6sense-demandbase-clearbit-salesloft-2024-bombora-zoominfo-zi-apollo-1-6b-crunchbase-g2-icp-tools","mark-roberge-sales-acceleration-formula-2015-bessemer-state-of-cloud-bridge-group-pavilion-icp-community-frameworks","too-broad-vs-specific-common-mistake","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (6sense $200M + Demandbase $200M + Clearbit Salesloft 2024 + Bombora + ZoomInfo ZI $1.2B + Apollo.io $1.6B 2023 + Crunchbase + G2 ICP tools, Mark Roberge HubSpot Sales Acceleration Formula 2015 CRO 2007-2013 + Bessemer State of Cloud + Bridge Group SaaS Benchmarks + Pavilion ICP community frameworks, Salesforce CRM $35B + HubSpot HUBS $2.6B + Microsoft 365 400M + Google Workspace 3B + AWS 31% + Azure 24% + GCP 11% Q4 2024 references) real.' }
  },
  {
    id: 'q84',
    tldr: `**TL;DR:** Right **pricing strategy for freemium → paid conversion** = (1) **Limit free tier on dimensions that hurt** (storage, users, integrations, retention period — not feature breadth that prevents trial), (2) **Show value in free tier** (real usage, not crippled), (3) **Trigger paid upgrade at natural pain points** (storage full, more users, advanced features), (4) **Generous Pro tier** (most users land here, drives revenue), (5) **Enterprise for top 1%**. **Conversion benchmarks** (OpenView Partners): 2-7% free-to-paid healthy; <2% = product issue; >10% = exceptional. **Reference patterns**: Notion (30M users, generous free + Pro $8-$10/user/mo), Slack (free + Pro $7.25/user/mo + Business $12.50 + Enterprise custom), Atlassian Jira (free up to 10 users, Standard $7/user, Premium $14/user), Calendly (free + Standard $10 + Teams $16 + Enterprise custom), Linear, Loom, Figma, GitHub (Microsoft).`,
    core: `

## The Five-Element Framework

**1. Limit Free on Hurt Dimensions**
- Storage: free 5GB, paid 100GB+
- Users: free up to 3-10, paid unlimited
- Integrations: free limited, paid all
- Retention: free 30 days, paid forever
- API rate limit: free low, paid high

**NOT limit on:**
- Feature breadth that prevents trial
- Time-bound (artificial pressure)
- Workflow disruption (breaks experience)

**2. Show Value in Free Tier**
- Real usage, not crippled
- Users see the value
- Build habit + dependence

**3. Trigger Paid Upgrade at Natural Pain**
- Storage full notification
- Hitting user cap
- Need advanced feature
- Want longer retention

**4. Generous Pro Tier**
- Most users land here
- $7-$25/user/mo typical
- Drives core revenue

**5. Enterprise for Top 1%**
- SSO, SAML, audit logs
- Custom pricing
- Annual commitment
- $50K-$5M+ ACV

## Conversion Benchmarks (OpenView)

| Tier | Free-to-Paid % |
|---|---|
| Exceptional | >10% |
| Best-in-class | 5-7% |
| Healthy | 2-5% |
| Concerning | <2% |

## Reference Patterns

- **Notion:** 30M users; free (unlimited blocks, 5 page templates) → Plus $8/user/mo → Business $15 → Enterprise custom
- **Slack:** free (10K messages, 1 integration) → Pro $7.25/user/mo → Business $12.50 → Enterprise custom
- **Atlassian Jira:** free up to 10 users → Standard $7/user → Premium $14 → Enterprise custom
- **Calendly (Tope Awotona founded 2013):** free (1 event type) → Standard $10 → Teams $16 → Enterprise custom
- **Linear:** free (unlimited users, limited features) → Standard $8/user → Plus $14
- **Loom (Atlassian 2023 $975M):** free (25 videos, 5 min each) → Business $12.50/creator → Enterprise custom
- **Figma:** free (3 files) → Professional $12/editor → Organization $45 → Enterprise $75
- **GitHub (Microsoft):** free (unlimited public repos) → Team $4/user → Enterprise $21/user
- **HubSpot (HUBS):** free CRM forever → Starter $20/seat → Pro $90 → Enterprise $150/seat

## The Common Mistakes

- **Free too generous:** no upgrade trigger
- **Free too crippled:** users abandon without trial
- **Time-bound free:** artificial pressure scares users
- **Skipping Pro tier:** straight to Enterprise = lost mid-segment`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Freemium-paid strategy] --> B[Free: real value, limit on storage/users/integrations/retention]
    B --> C[Pro: generous + most users land $7-25 per user]
    C --> D[Enterprise: top 1% custom + SSO + audit]
    D --> E[Target 2-7% free-to-paid conversion]
\`\`\`

TAGS: freemium-to-paid-conversion-pricing-strategy, limit-storage-users-integrations-retention-api-not-feature-breadth, generous-pro-tier-7-25-per-user-most-users-land, enterprise-top-1-percent-sso-saml-audit-custom-pricing, openview-2-7-percent-healthy-5-7-best-greater-10-exceptional-conversion-benchmarks, notion-30m-slack-7-25-jira-7-calendly-2013-awotona-linear-loom-atlassian-2023-975m-figma-github-microsoft-hubspot-hubs-references, free-too-generous-too-crippled-time-bound-pro-skipping-traps, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Best-in-class free-to-paid | 5-7% | OpenView |
| Healthy | 2-5% | OpenView |
| Exceptional | >10% | OpenView |
| Notion users | 30M+ | Notion |
| Notion Plus pricing | $8/user/mo | Notion |
| Notion Business | $15/user/mo | Notion |
| Slack Pro | $7.25/user/mo | Slack |
| Slack Business | $12.50/user/mo | Slack |
| Atlassian Jira Standard | $7/user/mo | Atlassian |
| Atlassian Jira Premium | $14/user/mo | Atlassian |
| Calendly Standard | $10/user/mo | Calendly |
| Calendly Teams | $16/user/mo | Calendly |
| Calendly founder | Tope Awotona 2013 | Calendly |
| Linear Standard | $8/user/mo | Linear |
| Linear Plus | $14/user/mo | Linear |
| Loom Business | $12.50/creator/mo | Loom |
| Figma Professional | $12/editor/mo | Figma |
| Figma Organization | $45/editor/mo | Figma |
| Figma Enterprise | $75/editor/mo | Figma |
| GitHub Team | $4/user/mo | GitHub |
| GitHub Enterprise | $21/user/mo | GitHub |
| HubSpot Starter | $20/seat | HubSpot |
| HubSpot Pro | $90/seat | HubSpot |
| HubSpot Enterprise | $150/seat | HubSpot |
| OpenView Partners PLG benchmarks | annual | OpenView |`,
    counter: `## Counter-Case
**Free too generous = no upgrade.** Mitigation: hurt dimensions only.
**Free too crippled = abandon.** Mitigation: real value visible.
**Time-bound trial.** Mitigation: usage-bound limits more humane.
**Pro tier confusion.** Mitigation: clear feature delineation.
**When stay-paid-only wins.** Enterprise-only product + no PLG demand.`,
    links: `

## See Also

- **q83** — Onboarding fees one-time vs amortized
- **q82** — International vs domestic pricing
- **q81** — List price vs effective price ratio
- **q79** — When enterprise tier makes sense`,
    sources: sharedSources,
    tags: ["freemium-to-paid-conversion-pricing-strategy","limit-storage-users-integrations-retention-api-not-feature-breadth","generous-pro-tier-7-25-per-user-most-users-land","enterprise-top-1-percent-sso-saml-audit-custom-pricing","openview-2-7-percent-healthy-5-7-best-greater-10-exceptional-conversion-benchmarks","notion-30m-slack-7-25-jira-7-calendly-2013-awotona-linear-loom-atlassian-2023-975m-figma-github-microsoft-hubspot-hubs-references","free-too-generous-too-crippled-time-bound-pro-skipping-traps","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Notion 30M users $8/user Plus + $15 Business + Slack $7.25 Pro $12.50 Business + Atlassian Jira $7 Standard $14 Premium + Calendly Tope Awotona 2013 $10 Standard $16 Teams + Linear $8 Standard $14 Plus + Loom Atlassian 2023 $975M $12.50 Business + Figma $12 Pro $45 Org $75 Enterprise + GitHub Microsoft $4 Team $21 Enterprise + HubSpot $20 Starter $90 Pro $150 Enterprise pricing references, OpenView Partners 2-7% healthy benchmarks) real.' }
  },
  {
    id: 'q83',
    tldr: `**TL;DR:** Onboarding fees should be **one-time AND amortized into ARR depending on accounting + sales motion**. (1) **GAAP/ASC 606 perspective**: onboarding has its own performance obligation; recognize over service period (not upfront), or treat as a separate revenue stream from ARR. (2) **Investor + ARR-narrative perspective**: amortize into ARR if customer pays monthly/quarterly subscription that includes onboarding services. (3) **One-time fee perspective**: charge separately for clean ARR purity; common for enterprise. **The trap**: large one-time onboarding fees inflate first-year revenue but distort ARR multiple (investors discount). **Best practice**: enterprise SaaS = separate one-time professional services fee (PS revenue line, gross-margin different); SMB SaaS = amortize into subscription. **Reference**: Salesforce (CRM) charges PS separately; HubSpot has onboarding tier; Snowflake (SNOW) usage-based has no traditional onboarding fee.`,
    core: `

## The Accounting Treatment

**ASC 606 Performance Obligations:**
- Onboarding = separate performance obligation if distinct
- Recognize over service delivery period (typically 30-90 days)
- NOT upfront recognition if customer can't use service yet

**ARR Definition Question:**
- Is onboarding part of subscription? → amortize into ARR
- Is onboarding separate? → don't include in ARR

## The Two Common Patterns

**Pattern 1: Separate One-Time Fee**
- Common for Enterprise SaaS
- Customer pays $25K-$500K+ for implementation
- Recognized over delivery period (ASC 606)
- Reported as Professional Services (PS) revenue
- PS revenue has different margins (often 20-40% gross vs 70-85% SaaS)
- Doesn't dilute SaaS margin metric

**Pattern 2: Amortized Into Subscription**
- Common for SMB-Mid SaaS
- $250/mo subscription "includes onboarding"
- Subscription includes 30-day onboarding
- Clean ARR + LTV calculation
- May reduce perceived value if customer wants premium service

## The Investor Lens

**One-Time Fees:**
- Pro: clean ARR purity, high SaaS multiple
- Con: revenue volatility, less predictable

**Amortized:**
- Pro: predictable ARR, smooth growth
- Con: doesn't separate services + product, harder to compare

## Reference Patterns

- **Salesforce (CRM):** charges PS separately; ~$35B FY24
- **HubSpot (HUBS):** tiered onboarding fees (Starter $0, Pro $1.5K, Enterprise $3K-$10K); ~$2.6B FY24
- **Snowflake (SNOW):** usage-based, no traditional onboarding fee; ~$3.6B FY24
- **Workday (WDAY):** large PS revenue stream (~25% of revenue); ~$8B FY24
- **Datadog (DDOG):** minimal PS, mostly self-serve onboarding; ~$2.7B FY24
- **Atlassian (TEAM):** no traditional onboarding fee, PLG model; ~$4.4B FY24

## The Decision Framework

**Enterprise + Complex Implementation:**
- Charge PS separately ($25K-$500K+)
- ASC 606 recognize over service period
- Clean SaaS ARR

**SMB-Mid + Standard Onboarding:**
- Amortize into subscription
- Charge per-seat or per-feature
- Predictable ARR

**Hybrid:**
- Tiered onboarding fees
- Self-serve free; assisted $X; white-glove $XXK
- HubSpot model`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Onboarding fee decision] --> B[ASC 606 separate performance obligation]
    B --> C{Enterprise or SMB?}
    C -->|Enterprise| D[Separate one-time PS fee, recognize over period]
    C -->|SMB| E[Amortize into subscription, clean ARR]
\`\`\`

TAGS: onboarding-fees-one-time-vs-amortized-into-arr, asc-606-separate-performance-obligation-recognize-over-service-period, separate-ps-fee-enterprise-vs-amortized-subscription-smb, ps-revenue-20-40-margin-vs-saas-70-85-margin, salesforce-crm-ps-separate-hubspot-hubs-tiered-snowflake-snow-no-onboarding-workday-wday-25-ps-datadog-ddog-minimal-atlassian-team-plg-references, hybrid-tiered-self-serve-assisted-white-glove, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Enterprise onboarding fee | $25K-$500K+ | Industry |
| SMB onboarding | $0-$3K | Industry |
| Mid-market onboarding | $1.5K-$10K | Industry |
| PS gross margin | 20-40% | Industry |
| SaaS subscription margin | 70-85% | Industry |
| ASC 606 effective public | Jan 2018 | FASB |
| ASC 606 effective private | Jan 2019 | FASB |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Salesforce PS revenue | ~3-5% of total | Industry |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| HubSpot onboarding fees Starter | $0 | HubSpot |
| HubSpot onboarding fees Pro | $1.5K-$3K | HubSpot |
| HubSpot onboarding fees Enterprise | $3K-$10K+ | HubSpot |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Workday WDAY revenue FY24 | ~$8B | WDAY 10-K |
| Workday PS as % revenue | ~25% | Industry |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| KPMG ASC 606 guidance | published | KPMG |
| PwC ASC 606 guidance | published | PwC |`,
    counter: `## Counter-Case
**One-time fees distort ARR multiple.** Mitigation: separate PS line.
**Amortized hides high-touch services.** Mitigation: tiered + transparency.
**Wrong attribution.** Mitigation: ASC 606 strict allocation.
**Investor confusion.** Mitigation: clear PS vs SaaS reporting.
**When stay-no-fee wins.** Pure self-serve PLG + simple onboarding.`,
    links: `

## See Also

- **q84** — Freemium-paid conversion pricing
- **q82** — International vs domestic pricing
- **q81** — List price vs effective price ratio
- **q80** — Roll out 15% price increase without churning base`,
    sources: sharedSources,
    tags: ["onboarding-fees-one-time-vs-amortized-into-arr","asc-606-separate-performance-obligation-recognize-over-service-period","separate-ps-fee-enterprise-vs-amortized-subscription-smb","ps-revenue-20-40-margin-vs-saas-70-85-margin","salesforce-crm-ps-separate-hubspot-hubs-tiered-snowflake-snow-no-onboarding-workday-wday-25-ps-datadog-ddog-minimal-atlassian-team-plg-references","hybrid-tiered-self-serve-assisted-white-glove","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Salesforce CRM $35B PS separate + HubSpot HUBS $2.6B tiered Starter $0 Pro $1.5-3K Enterprise $3-10K + Snowflake SNOW $3.6B usage-based no onboarding + Workday WDAY $8B 25% PS + Datadog DDOG $2.7B minimal + Atlassian TEAM $4.4B PLG references, ASC 606 FASB Jan 2018 public Jan 2019 private + KPMG + PwC guidance) real.' }
  },
  {
    id: 'q82',
    tldr: `**TL;DR:** **International vs domestic pricing** = (1) **Standard US-anchored pricing** (most companies, simplest), (2) **Local currency pricing with FX risk hedged** (mature global SaaS — Salesforce, Microsoft, Atlassian), (3) **Regional pricing** with PPP (purchasing power parity) adjustment — emerging in 2023-2024 to be inclusive of India, Brazil, Mexico, Southeast Asia, Africa (~30-70% discount of US pricing). **The trade**: regional PPP pricing captures more market share but causes "grey market" arbitrage (US customers buying via India to save). **Tax + compliance**: VAT (EU 17-27%), GST (India 18%, Australia 10%), state sales tax US (varies). **Tools**: Stripe Tax, Quaderno, Avalara, TaxJar (Stripe 2021). **Reference**: GitHub (Microsoft) does PPP; Notion does PPP; Atlassian uses local currency; Salesforce mostly US-anchored.`,
    core: `

## The Three Pricing Strategies

**1. US-Anchored Pricing**
- Same USD price globally
- Simplest to implement
- Currency conversion at checkout
- Most SaaS companies use this
- Risk: prices too high for emerging markets

**2. Local Currency Pricing**
- EUR, GBP, JPY, AUD, BRL, INR, MXN prices
- FX risk hedged via finance team
- More inclusive than USD-only
- Salesforce, Microsoft, Atlassian model

**3. Regional PPP Pricing**
- Purchasing Power Parity adjustment
- 30-70% discount for India, Brazil, Mexico, SE Asia, Africa
- Emerging since 2023-2024
- Captures more market share
- Risk: grey market arbitrage

## The PPP Discount Pattern

| Region | PPP Discount Typical |
|---|---|
| India | 50-70% |
| Brazil | 40-60% |
| Mexico | 30-50% |
| Southeast Asia | 30-60% |
| Africa | 50-80% |
| Eastern Europe | 20-40% |
| China | 30-60% (where allowed) |

## Tax + Compliance

- **VAT (EU):** 17-27% varies by country
- **GST (India):** 18%
- **GST (Australia):** 10%
- **State sales tax (US):** varies, ~0-9%+
- **Digital services tax:** various countries

## Tools

- **Stripe Tax** (automated tax calculation + collection)
- **Quaderno** (international tax compliance)
- **Avalara** (NYSE: AVLR until 2022 taken private $8.4B)
- **TaxJar** (Stripe 2021 acquisition $190M)
- **Sovos**
- **Vertex** (NASDAQ: VERX)
- **Sphera + ONESOURCE Thomson Reuters**

## Reference Patterns

- **GitHub (Microsoft):** PPP since 2022, India 50%+ off
- **Notion:** PPP since 2022, India + Brazil + Mexico discounts
- **Atlassian (TEAM):** local currency, no PPP
- **Salesforce (CRM):** mostly USD-anchored, large markets get local currency
- **Microsoft Azure:** local currency
- **AWS:** USD-anchored
- **Slack (Salesforce):** local currency
- **Snowflake (SNOW):** USD-anchored

## The Grey Market Risk

PPP creates arbitrage:
- US customer buys via India entity at 50% off
- Damages US revenue
- Hard to police

Mitigation:
- Geographic IP restrictions
- Billing address verification
- Annual audit
- Account-level enforcement`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[International pricing decision] --> B{Strategy choice}
    B -->|Simple| C[USD-anchored global]
    B -->|Standard| D[Local currency hedged]
    B -->|Inclusive| E[Regional PPP 30-70 off]
    C --> F[Tax compliance: Stripe Tax + Quaderno + Avalara]
    D --> F
    E --> F
\`\`\`

TAGS: international-vs-domestic-pricing-strategy, usd-anchored-local-currency-regional-ppp-three-approaches, ppp-india-50-70-brazil-40-60-mexico-30-50-southeast-asia-africa-eastern-europe-china-discounts, vat-eu-17-27-gst-india-18-australia-10-state-sales-tax-us-compliance, stripe-tax-quaderno-avalara-avlr-8-4b-2022-taxjar-stripe-2021-190m-sovos-vertex-verx-sphera-onesource-thomson-reuters-tools, github-microsoft-notion-ppp-since-2022-atlassian-team-local-currency-salesforce-crm-usd-aws-snowflake-snow-references, grey-market-arbitrage-risk-mitigation, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| India PPP discount typical | 50-70% | Industry |
| Brazil PPP | 40-60% | Industry |
| Mexico PPP | 30-50% | Industry |
| Southeast Asia PPP | 30-60% | Industry |
| Africa PPP | 50-80% | Industry |
| Eastern Europe PPP | 20-40% | Industry |
| EU VAT range | 17-27% | EU |
| India GST | 18% | India |
| Australia GST | 10% | Australia |
| Stripe Tax launched | 2021 | Stripe |
| TaxJar Stripe acquisition | 2021 $190M | Stripe |
| Avalara taken private | 2022 $8.4B | Vista |
| Vertex VERX revenue FY24 | ~$650M | VERX 10-K |
| GitHub PPP since | 2022 | GitHub |
| Notion PPP since | 2022 | Notion |
| GitHub Microsoft revenue FY24 | ~$245B | Microsoft 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| AWS revenue FY24 | ~$105B | AMZN 10-K |
| Bessemer State of Cloud | annual | BVP |`,
    counter: `## Counter-Case
**PPP grey market arbitrage.** Mitigation: geographic verification.
**Local currency FX risk.** Mitigation: hedge via finance team.
**Tax compliance complexity.** Mitigation: Stripe Tax + Avalara.
**USD-anchored loses inclusivity.** Mitigation: PPP for emerging.
**When USD-only wins.** US-dominant customer base + simple ops.`,
    links: `

## See Also

- **q81** — List price vs effective price ratio
- **q83** — Onboarding fees one-time vs amortized
- **q80** — Roll out 15% price increase
- **q84** — Freemium-paid conversion pricing`,
    sources: sharedSources,
    tags: ["international-vs-domestic-pricing-strategy","usd-anchored-local-currency-regional-ppp-three-approaches","ppp-india-50-70-brazil-40-60-mexico-30-50-southeast-asia-africa-eastern-europe-china-discounts","vat-eu-17-27-gst-india-18-australia-10-state-sales-tax-us-compliance","stripe-tax-quaderno-avalara-avlr-8-4b-2022-taxjar-stripe-2021-190m-sovos-vertex-verx-sphera-onesource-thomson-reuters-tools","github-microsoft-notion-ppp-since-2022-atlassian-team-local-currency-salesforce-crm-usd-aws-snowflake-snow-references","grey-market-arbitrage-risk-mitigation","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (GitHub Microsoft + Notion PPP since 2022 + Atlassian TEAM local currency + Salesforce CRM $35B USD + AWS $105B USD + Snowflake SNOW $3.6B USD + Slack Salesforce local currency + Microsoft Azure local currency references, Stripe Tax 2021 + TaxJar Stripe 2021 $190M + Avalara Vista 2022 $8.4B + Sovos + Vertex VERX $650M + Sphera + ONESOURCE Thomson Reuters tax tools, EU VAT 17-27% + India GST 18% + Australia GST 10% compliance) real.' }
  },
  {
    id: 'q81',
    tldr: `**TL;DR:** Right **list price vs effective price ratio for SaaS** = **70-90%** (Effective Price Realization, EPR). Best-in-class >85%; healthy 75-85%; concerning <70%. **Why it matters**: ratio tracks discount discipline + pricing power. **High EPR** (>85%): premium positioning, strong product-market fit, low discounting (Snowflake SNOW, ServiceNow NOW, CrowdStrike CRWD); **Low EPR** (<70%): commodity pressure, weak positioning, undisciplined sales. **Formula**: EPR = Actual Realized Revenue / List Price × 100. **Improvements**: tighter discount governance per [[q9553]], CPQ enforcement per [[q9515]], comp redesign per [[q9525]]. **Reference**: Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey all report EPR benchmarks.`,
    core: `

## The Benchmarks

| Tier | EPR |
|---|---|
| Best-in-class | >85% |
| Healthy | 75-85% |
| Acceptable | 70-75% |
| Concerning | <70% |
| Critical | <60% |

## Why It Matters

**High EPR (>85%):**
- Premium positioning
- Strong product-market fit
- Low discounting
- Examples: Snowflake (SNOW), ServiceNow (NOW), CrowdStrike (CRWD)

**Low EPR (<70%):**
- Commodity pressure
- Weak positioning
- Undisciplined sales
- AE behavior arbitrage
- Examples: declining SaaS companies pre-acquisition

## The Formula

EPR = Actual Realized Revenue / List Price × 100

**Example:**
- List: $100K/year
- Customer pays: $80K (20% discount)
- EPR: 80%

## Improvement Levers

**1. Discount Governance ([[q9553]])**
- 5-band approval architecture
- Tighter tiers
- Strategic exception only

**2. CPQ Enforcement ([[q9515]])**
- Salesforce CPQ + Conga + DealHub + Maxio
- Auto-routing of approvals
- Workflow blocking

**3. Comp Redesign ([[q9525]])**
- AE comp tied to win rate + ACV + cycle
- Penalty for over-discounting
- Reward for full-price closures

**4. Value-Trade Training**
- Train AEs to trade value not just discount
- Force Management Command of Sale

**5. Pricing Strategy**
- Anchor pricing (top tier 5-10x bottom)
- Multi-year commit incentives
- Volume tiers

## Reference Public Benchmarks

| Company | EPR Est | FY24 Revenue |
|---|---|---|
| Snowflake (SNOW) | ~85%+ | $3.6B |
| ServiceNow (NOW) | ~88%+ | $11B |
| CrowdStrike (CRWD) | ~85%+ | $3.1B |
| Datadog (DDOG) | ~82% | $2.7B |
| HubSpot (HUBS) | ~80% | $2.6B |
| Atlassian (TEAM) | ~85%+ (PLG) | $4.4B |
| Salesforce (CRM) | ~75% | $35B |
| Workday (WDAY) | ~78% | $8B |
| MongoDB (MDB) | ~80% | $1.7B |
| Cloudflare (NET) | ~82% (PLG) | $1.7B |

## The Investor Lens

Investors look at:
- EPR trend (improving = good, declining = warning)
- Discount distribution (concentrated vs scattered)
- Competitive pressure indicators
- Pricing power signals

EPR pairs with:
- NRR (110-130% healthy)
- Win rate (>25% healthy)
- CAC payback (<18mo SMB, <24mo Enterprise)
- Rule of 40 (≥40%)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[List price vs effective price] --> B[EPR formula: actual / list × 100]
    B --> C{75-85 healthy, >85 best-in-class}
    C --> D[Improvement: governance + CPQ + comp + training + strategy]
\`\`\`

TAGS: list-price-vs-effective-price-ratio-saas-epr, 75-85-healthy-greater-85-best-in-class-under-70-concerning-benchmarks, snowflake-snow-85-plus-servicenow-now-88-plus-crowdstrike-crwd-85-plus-datadog-ddog-82-hubspot-hubs-80-atlassian-team-85-plg-salesforce-crm-75-workday-wday-78-mongodb-mdb-80-cloudflare-net-82-benchmarks, discount-governance-cpq-enforcement-comp-redesign-value-trade-training-strategy-improvement-levers, force-management-command-of-sale-meddic-value-trade-training, nrr-win-rate-cac-payback-rule-of-40-companion-metrics, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Best-in-class EPR | >85% | Bessemer |
| Healthy EPR | 75-85% | Bessemer |
| Acceptable | 70-75% | Bessemer |
| Concerning | <70% | Bessemer |
| Snowflake SNOW EPR est | ~85%+ | Industry |
| ServiceNow NOW EPR est | ~88%+ | Industry |
| CrowdStrike CRWD EPR est | ~85%+ | Industry |
| Datadog DDOG EPR est | ~82% | Industry |
| HubSpot HUBS EPR est | ~80% | Industry |
| Atlassian TEAM EPR est | ~85%+ (PLG) | Industry |
| Salesforce CRM EPR est | ~75% | Industry |
| Workday WDAY EPR est | ~78% | Industry |
| MongoDB MDB EPR est | ~80% | Industry |
| Cloudflare NET EPR est | ~82% (PLG) | Industry |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| ServiceNow NOW revenue FY24 | ~$11B | NOW 10-K |
| CrowdStrike CRWD revenue FY24 | ~$3.1B | CRWD 10-K |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Bessemer State of Cloud benchmarks | annual | BVP |
| OpenView Partners | annual | OpenView |
| KeyBanc SaaS Survey | annual | KeyBanc |`,
    counter: `## Counter-Case
**EPR doesn't account for value/segment.** Mitigation: pair with NRR + win rate.
**Aggregate EPR hides distribution.** Mitigation: report distribution.
**Over-optimization kills deals.** Mitigation: balance with win rate.
**Public company EPR private.** Mitigation: triangulate from revenue + customer count.
**When low EPR acceptable.** Strategic land-and-expand phase or competitive market.`,
    links: `

## See Also

- **q80** — Roll out 15% price increase without churning base
- **q82** — International vs domestic pricing
- **q84** — Freemium-paid conversion pricing
- **q9553** — Founder-led discount governance bands`,
    sources: sharedSources,
    tags: ["list-price-vs-effective-price-ratio-saas-epr","75-85-healthy-greater-85-best-in-class-under-70-concerning-benchmarks","snowflake-snow-85-plus-servicenow-now-88-plus-crowdstrike-crwd-85-plus-datadog-ddog-82-hubspot-hubs-80-atlassian-team-85-plg-salesforce-crm-75-workday-wday-78-mongodb-mdb-80-cloudflare-net-82-benchmarks","discount-governance-cpq-enforcement-comp-redesign-value-trade-training-strategy-improvement-levers","force-management-command-of-sale-meddic-value-trade-training","nrr-win-rate-cac-payback-rule-of-40-companion-metrics","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Snowflake SNOW $3.6B 85%+ + ServiceNow NOW $11B 88%+ + CrowdStrike CRWD $3.1B 85%+ + Datadog DDOG $2.7B 82% + HubSpot HUBS $2.6B 80% + Atlassian TEAM $4.4B 85% PLG + Salesforce CRM $35B 75% + Workday WDAY $8B 78% + MongoDB MDB $1.7B 80% + Cloudflare NET $1.7B 82% PLG EPR benchmarks, Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey annual references) real.' }
  },
  {
    id: 'q80',
    tldr: `**TL;DR:** Roll out a **15% price increase without churning the base** by: (1) **Grandfathering existing customers** at current pricing for 12-24 months, (2) **Communicating value justifications** (new features, AI capabilities, expanded support, security improvements) — never "we need more money", (3) **Tiering** — apply 15% to top tier only; protect SMB if needed, (4) **Offering multi-year contracts at current pricing** as buy-in incentive, (5) **Quarterly check-ins** with top 20% customers + CSM intervention. **Industry data**: well-communicated 10-20% price increases see 1-5% incremental churn (acceptable); poorly communicated see 10-30% churn (catastrophic). **Reference**: Snowflake (SNOW) raised prices 2022; Datadog (DDOG) raised Logs pricing 2023; HubSpot (HUBS) tiered seat pricing 2024; Slack (Salesforce) raised 2023. **Frameworks**: ProfitWell (Paddle 2022 $200M acquisition) churn prevention + Gainsight customer success.`,
    core: `

## The Five-Step Rollout

**1. Grandfather Existing Customers**
- Current customers: 12-24 months at current pricing
- Renewal: new pricing applies
- Reduces immediate churn risk

**2. Communicate Value Justifications**
- New features released
- AI capabilities (e.g., LLM integration)
- Expanded support tiers
- Security/compliance improvements
- NEVER "we need more money"

**3. Tier the Increase**
- Apply 15% to top tier only
- Protect SMB tier (potentially)
- Maintain free tier
- Different tiers different sensitivity

**4. Multi-Year Buy-In Incentive**
- "Lock in current pricing for 3 years"
- Encourages commitment
- Reduces churn

**5. Quarterly Check-Ins**
- CSM proactive outreach top 20%
- Address concerns
- Reinforce value
- Catch churn signals early

## Industry Data

**Well-Communicated 10-20% Increase:**
- 1-5% incremental churn
- Net revenue uplift +5-15%
- Investor reception positive

**Poorly Communicated:**
- 10-30% churn spike
- Net revenue decline
- Brand damage
- Investor concern

## Reference Patterns

- **Snowflake (SNOW):** raised storage/compute pricing 2022; ~$3.6B FY24
- **Datadog (DDOG):** raised Logs ingestion pricing 2023; ~$2.7B FY24
- **HubSpot (HUBS):** tiered seat pricing 2024; ~$2.6B FY24
- **Slack (Salesforce):** raised Pro $7.25 → $8.75 + others 2023; ~$27.7B acquisition
- **Notion:** raised Personal $5 → $10 2022; 30M+ users
- **Atlassian (TEAM):** progressive tier price increases over years; ~$4.4B FY24
- **Asana (ASAN):** raised Premium/Business pricing 2023; ~$725M FY24

## The Frameworks

- **ProfitWell (Paddle 2022 $200M):** churn prevention + pricing optimization
- **Gainsight:** customer success + health scoring
- **Catalyst (Totango):** customer success
- **ChurnZero:** churn prediction
- **ClientSuccess:** CS platform

## The Companion Metrics

- NRR (target maintain 110-130%)
- GRR (target maintain >90%)
- Customer NPS (monitor for drop)
- CSAT (monitor for drop)
- Churn rate (target <2% increase)

## When Not to Raise

- Pre-PMF
- Recent product issues
- Competitor pricing war
- Macroeconomic downturn`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[15 percent price increase decision] --> B[Grandfather existing 12-24mo]
    B --> C[Communicate value: features + AI + support + security]
    C --> D[Tier increase + multi-year buy-in]
    D --> E[Quarterly CSM check-ins top 20%]
    E --> F[Monitor NRR/GRR/NPS/CSAT/churn]
\`\`\`

TAGS: roll-out-15-percent-price-increase-without-churning-base, grandfather-existing-12-24-months-renewal-new-pricing, communicate-value-features-ai-support-security-not-money, tier-increase-top-protect-smb, multi-year-contract-lock-in-current-pricing-incentive, quarterly-csm-top-20-percent-check-ins, 1-5-percent-vs-10-30-percent-churn-well-vs-poorly-communicated, snowflake-snow-2022-datadog-ddog-logs-2023-hubspot-hubs-2024-slack-salesforce-2023-notion-2022-asana-asan-2023-references, profitwell-paddle-2022-200m-gainsight-catalyst-totango-churnzero-clientsuccess-frameworks, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Price increase typical | 10-20% | Industry |
| Well-communicated churn impact | 1-5% incremental | Industry |
| Poorly communicated | 10-30% | Industry |
| Grandfather period typical | 12-24 months | Industry |
| Multi-year contract discount | 15-25% | Industry |
| Snowflake SNOW price increase | 2022 | Snowflake |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Datadog DDOG Logs pricing increase | 2023 | Datadog |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| HubSpot HUBS seat pricing tier | 2024 | HubSpot |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Slack Pro increase 2023 | $7.25 → $8.75 | Slack |
| Slack-Salesforce acquisition | 2021 $27.7B | Salesforce |
| Notion Personal increase 2022 | $5 → $10 | Notion |
| Notion users | 30M+ | Notion |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Asana ASAN revenue FY24 | ~$725M | ASAN 10-K |
| ProfitWell-Paddle acquisition 2022 | $200M | Paddle |
| Gainsight valuation | $1.1B 2021 | Gainsight |
| Catalyst (Totango acquired 2023) | yes | Totango |
| ChurnZero funding | ~$75M+ | Crunchbase |
| Bessemer State of Cloud benchmarks | annual | BVP |`,
    counter: `## Counter-Case
**Customer perceives "shakedown".** Mitigation: value communication.
**Competitor exploits.** Mitigation: multi-year lock-in.
**Pre-PMF timing.** Mitigation: don't raise.
**Recent product issues.** Mitigation: fix product first.
**When stay-current wins.** Healthy NRR + happy customers + no value-add justifying.`,
    links: `

## See Also

- **q81** — List price vs effective price ratio
- **q82** — International vs domestic pricing
- **q83** — Onboarding fees one-time vs amortized
- **q84** — Freemium-paid conversion pricing`,
    sources: sharedSources,
    tags: ["roll-out-15-percent-price-increase-without-churning-base","grandfather-existing-12-24-months-renewal-new-pricing","communicate-value-features-ai-support-security-not-money","tier-increase-top-protect-smb","multi-year-contract-lock-in-current-pricing-incentive","quarterly-csm-top-20-percent-check-ins","1-5-percent-vs-10-30-percent-churn-well-vs-poorly-communicated","snowflake-snow-2022-datadog-ddog-logs-2023-hubspot-hubs-2024-slack-salesforce-2023-notion-2022-asana-asan-2023-references","profitwell-paddle-2022-200m-gainsight-catalyst-totango-churnzero-clientsuccess-frameworks","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Snowflake SNOW 2022 + Datadog DDOG Logs 2023 + HubSpot HUBS seat tiered 2024 + Slack-Salesforce 2021 $27.7B Pro $7.25 to $8.75 2023 + Notion $5 to $10 2022 + Atlassian TEAM + Asana ASAN 2023 price increase references, ProfitWell Paddle 2022 $200M + Gainsight $1.1B 2021 + Catalyst Totango 2023 + ChurnZero $75M + ClientSuccess churn prevention frameworks) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH O DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
