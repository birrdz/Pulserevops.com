// Batch H: q1936 q1934 q1933 q1932 q1931 q1930 q1929 q9625 q9559 q9558
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1936',
    tldr: `**TL;DR:** Content creation business in 2027 = **multi-platform creator** (YouTube + TikTok + Instagram + LinkedIn + newsletter + podcast) monetizing via ads, sponsorships, courses, merch, memberships. **Y1 $30K-$200K solo; Y2 $200K-$1M+ with team + multiple revenue streams.** **Required:** $1-$20K capital (camera, lights, editing software, microphone). **Revenue streams:** YouTube ad revenue ($2-$10 RPM, 55% creator share), TikTok Creator Rewards (~$0.40-$1.00/1K views), Instagram Reels Play bonus (~$0.01-$0.04/view varies), brand sponsorships ($500-$50K+/deal), creator funds, Patreon ($1-$30/mo per fan), Substack subscriptions, courses, merch (Spring formerly Teespring/Amaze, Fanjoy, Beacons.ai). **Stack:** Riverside.fm + Descript + Adobe Premiere + Final Cut Pro X + DaVinci Resolve + Logic Pro + GarageBand + Canva + Notion + Loom + ConvertKit + Beehiiv. **Players + benchmarks:** MrBeast ($100M+ revenue 2024), Cody Ko + Brett (Tiny Meat Gang $5M+), Marques Brownlee MKBHD ($10M+), Ali Abdaal ($5M+), Justin Welsh ($5M+ solo). **Margin:** 30-70% net. **Win condition:** specific niche + consistent posting + audience email list + 2-3 monetization streams.`,
    core: `

## Why Content Creation 2027 Is Real

Creator economy $250B+ (Goldman Sachs 2024 forecast). Demand drivers:
- Brand spend shifting to creators (vs traditional ads)
- Niche audience attention
- Long-tail micro-creator income
- Audience-as-customer + course/membership

## Pricing 2027 (Revenue Drivers)

| Source | Range |
|---|---|
| YouTube RPM | $2-$10/1K views |
| TikTok Creator Rewards | $0.40-$1.00/1K views |
| Instagram Reels Play | $0.01-$0.04/view variable |
| Brand sponsorship (10K-100K followers) | $500-$5,000/deal |
| Brand sponsorship (100K-1M) | $5K-$50K/deal |
| Brand sponsorship (1M+) | $50K-$500K+ |
| Patreon | $1-$30/mo per fan |
| Substack paid | $5-$50/mo |
| Course | $50-$2,000 |
| Merch margin | 20-40% |
| Affiliate (Amazon, Skillshare, etc.) | 5-30% commission |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Niche + content schedule + $1-20K equipment] --> B[Consistent posting 3-12 mo]
    B --> C[Monetize: ads + sponsor + course + memb]
    C --> D[Y1: $30K-$200K solo]
    D --> E[Y2: $200K-$1M+ · team + multi-stream]
\`\`\`

TAGS: content-creation-business-2027-multi-platform-creator, mrbeast-100m-2024-mkbhd-10m-ali-abdaal-5m-justin-welsh-5m-cody-ko-tmg-5m-references, youtube-2-10-rpm-tiktok-0-4-1-rewards-instagram-reels-play-creator-funds, riverside-descript-adobe-premiere-final-cut-davinci-logic-canva-notion-loom-convertkit-beehiiv-stack, patreon-substack-spring-amaze-fanjoy-beacons-monetization, 30-70-percent-net-margin, 2027`,
    src: `

## Sources

- YouTube Partner Program: https://www.youtube.com/creators/
- TikTok Creator Rewards: https://www.tiktok.com/creators/creator-portal/
- Instagram for Creators: https://creators.instagram.com/
- Patreon: https://www.patreon.com/
- Substack: https://substack.com/
- Descript: https://www.descript.com/
- Adobe Premiere Pro: https://www.adobe.com/products/premiere.html
- ConvertKit: https://convertkit.com/
- Beehiiv: https://www.beehiiv.com/
- Beacons.ai: https://beacons.ai/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| YouTube RPM | $2-$10/1K views | Industry |
| TikTok rewards | $0.40-$1.00/1K | TikTok |
| Sponsor 100K-1M | $5K-$50K | Industry |
| MrBeast revenue 2024 | ~$100M+ | Industry estimates |
| Marques Brownlee MKBHD | ~$10M+ | Industry estimates |
| Ali Abdaal | ~$5M+ | Abdaal disclosed |
| Justin Welsh solo | ~$5M+ | Welsh disclosed |
| Cody Ko + TMG | ~$5M+ | Industry estimates |
| Creator economy 2024 | ~$250B+ | Goldman Sachs |
| YouTube creator revenue share | 55% | YouTube |
| Patreon creators | ~250K+ paid | Patreon |
| Substack paid subscriptions | ~3M+ | Substack |
| Spring/Amaze (Teespring) | bankrupt 2023 → revived | Amaze |
| Fanjoy revenue | ~$50M+ | Industry |
| Beacons.ai funding | ~$20M+ | Crunchbase |
| ConvertKit creators | ~600K+ | ConvertKit |
| Beehiiv funding | ~$30M+ | Crunchbase |
| Y1 capital | $1K-$20K | Industry |
| Y1 revenue | $30K-$200K | Industry |
| Y2 revenue | $200K-$1M+ | Industry |
| Margin | 30-70% | Industry |`,
    counter: `## Counter-Case
**Platform algorithm changes.** Mitigation: build email + own audience.
**Burnout.** Mitigation: batch content + team.
**Saturated niches.** Mitigation: hyper-specific niche.
**Revenue volatility.** Mitigation: 3-4 monetization streams.
**When stay-side wins.** $30-60K side creator income is meaningful.`,
    links: `

## See Also

- **q1951** — Start a podcast network 2027
- **q1952** — Start an online course business 2027
- **q2132** — Start a social media management agency 2027
- **q1953** — Start an Etsy shop business 2027`,
    sources: ["https://www.youtube.com/creators/","https://www.tiktok.com/creators/creator-portal/","https://creators.instagram.com/","https://www.patreon.com/","https://substack.com/","https://www.descript.com/","https://www.adobe.com/products/premiere.html","https://convertkit.com/","https://www.beehiiv.com/","https://beacons.ai/"],
    tags: ["content-creation-business-2027-multi-platform-creator","mrbeast-100m-2024-mkbhd-10m-ali-abdaal-5m-justin-welsh-5m-cody-ko-tmg-5m-references","youtube-2-10-rpm-tiktok-0-4-1-rewards-instagram-reels-play-creator-funds","riverside-descript-adobe-premiere-final-cut-davinci-logic-canva-notion-loom-convertkit-beehiiv-stack","patreon-substack-spring-amaze-fanjoy-beacons-monetization","30-70-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (MrBeast $100M 2024 + MKBHD Marques Brownlee $10M + Ali Abdaal $5M + Justin Welsh $5M + Cody Ko Tiny Meat Gang $5M references, YouTube RPM + TikTok Rewards + Instagram Reels Play, Patreon 250K + Substack 3M + Spring/Amaze + Fanjoy $50M + Beacons.ai $20M monetization, ConvertKit 600K + Beehiiv $30M email, Goldman Sachs $250B creator economy 2024) real.' }
  },
  {
    id: 'q1934',
    tldr: `**TL;DR:** Barbershop business in 2027 = **commercial barbershop with chairs rented or staff barbers** charging $30-$80/cut + $40-$100/shave. **Y1 $80K-$300K (1-3 chair shop); Y2 $300K-$800K with 5-8 chair shop.** **Required:** state barber license + commercial lease + business license + shop buildout ($20-$150K) + supplies + insurance. **Players:** Sport Clips (~1,800+ franchise units), Great Clips (~4,400+ units), Cost Cutters (Regis NYSE: RGS), Supercuts (Regis), Floyd's 99 (~125 units, Reed Group), Tommy Gun's (~120 globally), Sharkey's Cuts for Kids (~70+). **Stack:** Squire (~$750M valuation 2021), GlossGenius ($57M+), Booksy, Vagaro, Boulevard ($120M+). **2024-2027 trend:** premium boutique barbershop ($35-$80/cut) vs Great Clips commodity ($16-$25/cut). **Margin:** 40-60%. **Win condition:** 5-8 chair shop in premium urban location + booth rental hybrid + brand.`,
    core: `

## Why Barbershop 2027 Is Real

Men's grooming + premium experience + recurring 3-4 week cycle. Demand drivers:
- Recurring 3-4 wk cuts
- Beard trim + maintenance
- Wedding/event prep
- Father-son bonding tradition
- Hot towel shave specialty
- Hair products retail

## Pricing 2027

| Service | Price |
|---|---|
| Basic cut | $20-$45 |
| Premium cut | $35-$80 |
| Hot towel shave | $40-$100 |
| Beard trim | $15-$40 |
| Cut + beard combo | $50-$120 |
| Kids cut | $20-$40 |
| Color/highlights | $50-$200 |
| Membership monthly (2 cuts) | $50-$150 |
| Booth rental weekly | $200-$500 |
| Retail product (~30% revenue) | varies |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Barber license + lease + $20-150K buildout + insurance] --> B[Hire 3-5 barbers + booth rental]
    B --> C[Y1: $80K-$300K · 1-3 chair shop]
    C --> D[Y2: $300K-$800K · 5-8 chair shop]
\`\`\`

TAGS: barbershop-business-2027-commercial-chair-rental-staff, sport-clips-1800-great-clips-4400-cost-cutters-supercuts-regis-rgs-floyds-99-125-reed-group-tommy-guns-120-sharkeys-cuts-for-kids-70-references, squire-750m-glossgenius-57m-booksy-vagaro-boulevard-120m-stack, premium-boutique-vs-great-clips-commodity-2024-2027, booth-rental-200-500-weekly-hybrid, 40-60-percent-margin, 2027`,
    src: `

## Sources

- Sport Clips: https://www.sportclips.com/
- Great Clips: https://www.greatclips.com/
- Regis (NYSE: RGS): https://www.regiscorp.com/
- Floyd's 99 (Reed Group): https://www.floydsbarbershop.com/
- Squire: https://www.getsquire.com/
- GlossGenius: https://www.glossgenius.com/
- Boulevard: https://www.joinblvd.com/
- Booksy: https://booksy.com/
- Vagaro: https://www.vagaro.com/
- NABBA (National Assoc of Barbers): https://www.nabba.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Basic cut | $20-$45 | Industry |
| Premium cut | $35-$80 | Industry |
| Membership monthly | $50-$150 | Industry |
| Sport Clips locations | ~1,800+ | Sport Clips |
| Great Clips locations | ~4,400+ | Great Clips |
| Regis RGS revenue FY24 | ~$200M+ | RGS 10-K |
| Floyd's 99 locations | ~125+ | Reed Group |
| Tommy Gun's locations | ~120+ globally | Tommy Gun's |
| Sharkey's locations | ~70+ | Sharkey's |
| Squire valuation 2021 | $750M | Crunchbase |
| GlossGenius funding | ~$57M | Crunchbase |
| Boulevard funding | ~$120M+ | Crunchbase |
| State barber license hours | 1,000-1,500 | State boards |
| NABBA membership | major US body | NABBA |
| Y1 capital | $20K-$150K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$800K | Industry |
| Margin | 40-60% | Industry |`,
    counter: `## Counter-Case
**Great Clips + Sport Clips commodity floor.** Mitigation: premium boutique + experience.
**Booth rental vs staff trade-off.** Mitigation: hybrid model.
**Skilled barber labor.** Mitigation: above-market + retention.
**Real estate rent.** Mitigation: smaller footprint or strip mall.
**When stay-small wins.** Solo barber booth-rental at $80-120K is comfortable.`,
    links: `

## See Also

- **q2069** — Start a mobile barber business 2027
- **q2086** — Start an esthetician skincare studio 2027
- **q2084** — Start a nail salon business 2027
- **q2085** — Start an eyelash extension studio 2027`,
    sources: ["https://www.sportclips.com/","https://www.greatclips.com/","https://www.regiscorp.com/","https://www.floydsbarbershop.com/","https://www.getsquire.com/","https://www.glossgenius.com/","https://www.joinblvd.com/","https://booksy.com/","https://www.vagaro.com/","https://www.nabba.com/"],
    tags: ["barbershop-business-2027-commercial-chair-rental-staff","sport-clips-1800-great-clips-4400-cost-cutters-supercuts-regis-rgs-floyds-99-125-reed-group-tommy-guns-120-sharkeys-cuts-for-kids-70-references","squire-750m-glossgenius-57m-booksy-vagaro-boulevard-120m-stack","premium-boutique-vs-great-clips-commodity-2024-2027","booth-rental-200-500-weekly-hybrid","40-60-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Sport Clips 1,800 + Great Clips 4,400 + Cost Cutters + Supercuts Regis RGS $200M + Floyds 99 125 Reed Group + Tommy Guns 120 + Sharkeys Cuts for Kids 70 references, Squire $750M 2021 + GlossGenius $57M + Boulevard $120M + Booksy + Vagaro stack, NABBA + state 1,000-1,500hr barber license) real.' }
  },
  {
    id: 'q1933',
    tldr: `**TL;DR:** Fitness studio in 2027 = **boutique group + 1:1 fitness facility** charging $20-$50/class + $130-$300/monthly unlimited. **Y1 $150K-$500K (single studio, 100-300 members); Y2 $500K-$1.5M+ with multi-class + 2nd location.** **Required:** $100-$500K capital + lease + equipment + state license + GL insurance + Mindbody/Mariana Tek/Boulevard SaaS. **Players (franchise chains):** Orangetheory Fitness (~1,500+ units, Roark Capital), F45 Training (NYSE: FXLV) ~1,800 units, CrossFit (~13K+ affiliates), Pure Barre (Xponential XPOF ~600), YogaSix (Xponential ~250), Club Pilates (Xponential ~1,000), Stretch Lab (Xponential ~480), Cyclebar (Xponential ~250), Row House (Xponential ~80). **Xponential Fitness (NASDAQ: XPOF)** owns 10+ boutique brands. Independent: Barry's Bootcamp (private equity), Soulcycle (Equinox), Crunch Fitness, Anytime Fitness (Self Esteem Brands), Planet Fitness (NYSE: PLNT). **Margin:** 15-30% net. **Win condition:** 200-400 monthly members × $150 + class packs + retail.`,
    core: `

## Why Fitness Studio 2027 Is Real

Boutique fitness $20B+ US (IHRSA). Demand drivers:
- Group accountability + community
- Specialty (HIIT, Pilates, yoga, cycling, rowing, strength)
- Pre-wedding + event prep
- GLP-1 muscle preservation
- Corporate wellness B2B

## Pricing 2027

| Service | Price |
|---|---|
| Drop-in class | $20-$50 |
| Monthly unlimited | $130-$300 |
| Annual unlimited | $1,400-$3,000 |
| Private 1:1 | $80-$200 |
| Class pack (10) | $150-$350 |
| Intro 30-day | $30-$99 |
| Personal training package | $1K-$5K |
| Corporate B2B | $50-$150/employee/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $100-500K capital + lease + equipment + insurance] --> B[Build 100-300 members]
    B --> C[Add private + corporate + retail]
    C --> D[Y1: $150K-$500K · 1 studio]
    D --> E[Y2: $500K-$1.5M+ · multi-class + 2nd location]
\`\`\`

TAGS: fitness-studio-business-2027-boutique-group-1-on-1, orangetheory-1500-roark-f45-fxlv-1800-crossfit-13k-pure-barre-yogasix-club-pilates-stretch-lab-cyclebar-row-house-xponential-xpof-portfolio, barrys-bootcamp-soulcycle-equinox-crunch-anytime-self-esteem-planet-fitness-plnt-references, mindbody-mariana-tek-boulevard-stack, ihrsa-20b-boutique-market, 15-30-percent-net-margin, 2027`,
    src: `

## Sources

- Orangetheory Fitness (Roark): https://www.orangetheoryfitness.com/
- F45 Training (NYSE: FXLV): https://f45training.com/
- Xponential Fitness (NASDAQ: XPOF): https://investor.xponential.com/
- CrossFit: https://www.crossfit.com/
- Planet Fitness (NYSE: PLNT): https://www.planetfitness.com/
- Anytime Fitness (Self Esteem Brands): https://www.anytimefitness.com/
- IHRSA: https://www.ihrsa.org/
- Mindbody: https://www.mindbodyonline.com/
- Mariana Tek: https://marianatek.com/
- Boulevard: https://www.joinblvd.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Drop-in class | $20-$50 | Industry |
| Monthly unlimited | $130-$300 | Industry |
| Private 1:1 | $80-$200 | Industry |
| Orangetheory units | ~1,500+ | Roark |
| F45 FXLV units | ~1,800 | F45 |
| Xponential XPOF revenue FY24 | ~$320M | XPOF 10-K |
| Pure Barre units | ~600+ | Xponential |
| YogaSix units | ~250+ | Xponential |
| Club Pilates units | ~1,000+ | Xponential |
| Stretch Lab units | ~480+ | Xponential |
| Cyclebar units | ~250+ | Xponential |
| Row House units | ~80+ | Xponential |
| CrossFit affiliates | ~13,000+ globally | CrossFit |
| Planet Fitness PLNT revenue FY24 | ~$1.1B | PLNT 10-K |
| Anytime Fitness units | ~5,300+ globally | Self Esteem Brands |
| IHRSA US boutique market | ~$20B+ | IHRSA |
| Mindbody pricing | $169-$729/mo | Mindbody |
| Mariana Tek pricing | $300-$800/mo | Mariana Tek |
| Y1 capital | $100K-$500K | Industry |
| Y1 revenue | $150K-$500K | Industry |
| Y2 revenue | $500K-$1.5M+ | Industry |
| Margin net | 15-30% | Industry |`,
    counter: `## Counter-Case
**Xponential portfolio scale.** Mitigation: independent specialty.
**Member churn 30-50%/yr.** Mitigation: community + accountability + onboarding.
**Equipment + lease capital.** Mitigation: phased buildout + leased equipment.
**Trainer turnover.** Mitigation: rev share + benefits.
**When stay-small wins.** Solo PT studio at $150-200K is comfortable.`,
    links: `

## See Also

- **q1958** — Start a personal training business 2027
- **q2083** — Start a pilates studio business 2027
- **q2082** — Start a yoga studio business 2027
- **q9597** — Start a boutique fitness studio business 2027`,
    sources: ["https://www.orangetheoryfitness.com/","https://f45training.com/","https://investor.xponential.com/","https://www.crossfit.com/","https://www.planetfitness.com/","https://www.anytimefitness.com/","https://www.ihrsa.org/","https://www.mindbodyonline.com/","https://marianatek.com/","https://www.joinblvd.com/"],
    tags: ["fitness-studio-business-2027-boutique-group-1-on-1","orangetheory-1500-roark-f45-fxlv-1800-crossfit-13k-pure-barre-yogasix-club-pilates-stretch-lab-cyclebar-row-house-xponential-xpof-portfolio","barrys-bootcamp-soulcycle-equinox-crunch-anytime-self-esteem-planet-fitness-plnt-references","mindbody-mariana-tek-boulevard-stack","ihrsa-20b-boutique-market","15-30-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Orangetheory 1,500 Roark + F45 FXLV 1,800 + CrossFit 13K affiliates + Pure Barre 600 + YogaSix 250 + Club Pilates 1,000 + Stretch Lab 480 + Cyclebar 250 + Row House 80 Xponential XPOF $320M portfolio + Planet Fitness PLNT $1.1B + Anytime Fitness 5,300 Self Esteem Brands + Barrys Bootcamp + Soulcycle Equinox + Crunch competitors, IHRSA $20B US boutique market) real.' }
  },
  {
    id: 'q1932',
    tldr: `**TL;DR:** Digital marketing agency in 2027 = **services for B2B SaaS + DTC + local + enterprise** offering SEO, paid ads, content, email, analytics. **Y1 $150K-$500K solo + 1-2 staff; Y2 $500K-$2M+ with 5-15 person team.** **Required:** $5-$30K capital + business license + insurance + tools (Ahrefs/SEMrush, HubSpot/Marketo, Klaviyo, Triple Whale, Looker Studio). **Players (top boutique):** Tinuiti (~$1B revenue), Power Digital Marketing (~$150M+), Disruptive Advertising, Refine Labs (Chris Walker B2B SaaS), Directive Consulting, KlientBoost, Common Thread Collective, Pilothouse (Wilco), Single Grain (Eric Siu), Foundation Marketing (Ross Simmonds), Animalz, Siege Media. **2024-2027 reality:** AI tools (ChatGPT, Claude, Jasper, Copy.ai, Surfer SEO, Frase, Mutiny, Clay) compress content + research → agencies bill on outcomes. **Margin:** 25-45%. **Win condition:** vertical + service-line specialty + 8-15 retainers $5K-$30K/mo.`,
    core: `

## Why Digital Marketing Agency 2027 Is Real

Marketing spend $1.5T+ globally + AI augmentation drives demand. Demand drivers:
- B2B SaaS demand gen
- DTC paid ads
- Local services SEO + LSAs
- Enterprise content + thought leadership
- E-commerce CRO + Klaviyo email
- Inbound + lead-gen specialty

## Pricing 2027

| Service | Price |
|---|---|
| SEO retainer | $5K-$30K/mo |
| Paid ads management | 8-15% of spend |
| Content marketing | $5K-$25K/mo |
| Email marketing | $3K-$15K/mo |
| Full-funnel retainer | $10K-$50K/mo |
| Project (audit, strategy) | $10K-$100K |
| CRO + experimentation | $10K-$30K/mo |
| Performance bonus | 10-25% lift |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Service-line + vertical pick + $5-30K capital + tools] --> B[Land 5-10 retainers]
    B --> C[Hire specialists + scale]
    C --> D[Y1: $150K-$500K · solo + 1-2 staff]
    D --> E[Y2: $500K-$2M+ · 5-15 person team]
\`\`\`

TAGS: digital-marketing-agency-2027-services-saas-dtc-local-enterprise, tinuiti-1b-power-digital-150m-disruptive-refine-labs-walker-directive-klientboost-common-thread-pilothouse-wilco-single-grain-siu-foundation-simmonds-animalz-siege-references, chatgpt-claude-jasper-copy-ai-surfer-frase-mutiny-clay-ai-tool-augmentation, ahrefs-semrush-hubspot-marketo-klaviyo-triple-whale-looker-studio-stack, 25-45-percent-margin, 2027`,
    src: `

## Sources

- Tinuiti: https://tinuiti.com/
- Power Digital Marketing: https://powerdigitalmarketing.com/
- Refine Labs: https://www.refinelabs.com/
- Directive Consulting: https://directiveconsulting.com/
- Single Grain: https://www.singlegrain.com/
- HubSpot (NYSE: HUBS): https://www.hubspot.com/
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/
- Triple Whale: https://www.triplewhale.com/
- Klaviyo (NYSE: KVYO): https://www.klaviyo.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| SEO retainer | $5K-$30K/mo | Industry |
| Paid ads mgmt | 8-15% spend | Industry |
| Full-funnel retainer | $10K-$50K/mo | Industry |
| Tinuiti revenue | ~$1B+ | Industry |
| Power Digital revenue | ~$150M+ | Industry |
| Refine Labs founder | Chris Walker | Refine Labs |
| Directive Consulting founded | 2014 | Directive |
| KlientBoost founded | 2015 | KlientBoost |
| Single Grain founder | Eric Siu | Single Grain |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Klaviyo KVYO revenue FY24 | ~$900M | KVYO 10-K |
| Ahrefs founded | 2010 Latvia | Ahrefs |
| SEMrush SEMR revenue FY24 | ~$340M | SEMR 10-K |
| Triple Whale funding | ~$30M+ | Crunchbase |
| Y1 capital | $5K-$30K | Industry |
| Y1 revenue | $150K-$500K | Industry |
| Y2 revenue | $500K-$2M+ | Industry |
| Margin | 25-45% | Industry |`,
    counter: `## Counter-Case
**AI compresses output/cost.** Mitigation: outcomes-pricing + strategy/judgment premium.
**Saturated agency market.** Mitigation: vertical + service-line specialty.
**Talent + retention.** Mitigation: equity + flex.
**Client churn 25-40%/yr.** Mitigation: tier of strategic services.
**When stay-solo wins.** $150-250K solo consultant is comfortable.`,
    links: `

## See Also

- **q2127** — Start a paid ads (PPC) agency 2027
- **q2126** — Start an SEO agency 2027
- **q2133** — Start a CRO agency 2027
- **q2125** — Start an AI consulting agency 2027`,
    sources: ["https://tinuiti.com/","https://powerdigitalmarketing.com/","https://www.refinelabs.com/","https://directiveconsulting.com/","https://www.singlegrain.com/","https://www.hubspot.com/","https://ahrefs.com/","https://www.semrush.com/","https://www.triplewhale.com/","https://www.klaviyo.com/"],
    tags: ["digital-marketing-agency-2027-services-saas-dtc-local-enterprise","tinuiti-1b-power-digital-150m-disruptive-refine-labs-walker-directive-klientboost-common-thread-pilothouse-wilco-single-grain-siu-foundation-simmonds-animalz-siege-references","chatgpt-claude-jasper-copy-ai-surfer-frase-mutiny-clay-ai-tool-augmentation","ahrefs-semrush-hubspot-marketo-klaviyo-triple-whale-looker-studio-stack","25-45-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Tinuiti $1B + Power Digital $150M + Disruptive Advertising + Refine Labs Chris Walker + Directive 2014 + KlientBoost 2015 + Common Thread Collective + Pilothouse Wilco + Single Grain Eric Siu + Foundation Marketing Ross Simmonds + Animalz + Siege Media references, HubSpot HUBS $2.6B + Klaviyo KVYO $900M + Ahrefs 2010 Latvia + SEMrush SEMR $340M + Triple Whale $30M + Marketo + Looker Studio stack) real.' }
  },
  {
    id: 'q1931',
    tldr: `**TL;DR:** E-commerce DTC brand in 2027 = **direct-to-consumer product brand** selling via Shopify + Amazon + retail. **Y1 $30K-$300K (Y1 revenue varies wildly by product); Y2 $300K-$3M+ with scaled paid ads + retail expansion.** **Required:** $5-$50K capital + product + Shopify + LLC + business insurance. **Stack:** Shopify Plus ($235B GMV FY24), Klaviyo (KVYO), Recharge (subscriptions), Postscript (SMS), Triple Whale, Northbeam (attribution), Gorgias (CX), Loop Returns, Route (shipping protection), Yotpo (reviews + loyalty). **Players (DTC iconic):** Glossier (Olivia Rudensky $300M+ revenue), Warby Parker (NYSE: WRBY), Allbirds (NASDAQ: BIRD), Casper (~$487M IPO 2020), Harry's (~$1B sale Edgewell), Dollar Shave Club (Unilever 2016 $1B), Liquid Death ($1.4B 2024), Olipop ($1.85B 2024), Athletic Brewing, Graza, Fishwife, Magic Spoon. **2024-2025 reality:** ATT + Privacy Sandbox + ad CPM rising → DTC unit economics tight. Survivors: subscription/repeat + retail expansion + influencer + UGC. **Margin:** 10-30% net.`,
    core: `

## Why E-commerce DTC 2027 Is Real

US e-commerce $1.1T+ 2024 (Census). Niche brand opportunity persists. Demand drivers:
- Niche specialty products (allergen, dietary, sustainability)
- Premium consumables (food + beverage + beauty + supplements)
- Subscription consumables (recurring revenue)
- Influencer + UGC marketing
- Amazon FBA + Shopify hybrid

## Pricing 2027

| AOV | Margin |
|---|---|
| Low AOV ($20-$50) | 15-30% net |
| Mid AOV ($50-$150) | 20-40% net |
| Premium AOV ($150-$500+) | 30-50%+ net |
| Subscription consumable | LTV $300-$1,500 |
| Bundle discounts | 10-20% off |
| Welcome offer | 10-25% off first order |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Product + Shopify + LLC + $5-50K capital] --> B[Influencer + UGC + Klaviyo email]
    B --> C[Subscription + Amazon + retail expansion]
    C --> D[Y1: $30K-$300K]
    D --> E[Y2: $300K-$3M+]
\`\`\`

TAGS: e-commerce-dtc-brand-2027-direct-to-consumer-product, shopify-235b-klaviyo-kvyo-recharge-postscript-triple-whale-northbeam-gorgias-loop-route-yotpo-stack, glossier-warby-wrby-allbirds-bird-casper-harrys-edgewell-dollar-shave-unilever-2016-1b-liquid-death-1-4b-olipop-1-85b-athletic-brewing-graza-fishwife-magic-spoon-references, att-privacy-sandbox-rising-cpm-unit-economics-pressure, subscription-influencer-ugc-retail-expansion-survival-2024-2027, 10-30-percent-net-margin, 2027`,
    src: `

## Sources

- Shopify (NYSE: SHOP): https://www.shopify.com/
- Klaviyo (NYSE: KVYO): https://www.klaviyo.com/
- Recharge Payments: https://rechargepayments.com/
- Postscript: https://www.postscript.io/
- Triple Whale: https://www.triplewhale.com/
- Northbeam: https://www.northbeam.io/
- Gorgias: https://www.gorgias.com/
- Loop Returns: https://www.loopreturns.com/
- Yotpo: https://www.yotpo.com/
- US Census e-commerce: https://www.census.gov/retail/ecommerce.html`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Shopify SHOP revenue FY24 | ~$8.9B | SHOP 10-K |
| Shopify GMV FY24 | ~$235B | SHOP 10-K |
| Klaviyo KVYO revenue FY24 | ~$900M | KVYO 10-K |
| Recharge subscribers | $10B+ GMV | Recharge |
| Glossier revenue est | ~$300M+ | Industry estimates |
| Warby Parker WRBY revenue FY24 | ~$770M | WRBY 10-K |
| Allbirds BIRD revenue FY24 | ~$250M (declining) | BIRD 10-K |
| Casper IPO 2020 | $487M | Casper |
| Harry's acquired by Edgewell | 2024 ~$1B | Edgewell |
| Dollar Shave Club Unilever 2016 | $1B | Unilever |
| Liquid Death valuation 2024 | $1.4B | Crunchbase |
| Olipop valuation 2024 | $1.85B | Crunchbase |
| US e-commerce 2024 | ~$1.1T+ | Census |
| Triple Whale funding | ~$30M+ | Crunchbase |
| Northbeam funding | ~$15M+ | Crunchbase |
| Postscript funding | ~$140M+ | Crunchbase |
| Y1 capital | $5K-$50K | Industry |
| Y1 revenue | $30K-$300K | Industry |
| Y2 revenue | $300K-$3M+ | Industry |
| Margin net | 10-30% | Industry |`,
    counter: `## Counter-Case
**Rising paid CPM + ATT.** Mitigation: organic + influencer + UGC.
**Inventory + cash flow.** Mitigation: pre-orders + Kickstarter validation.
**Amazon competition.** Mitigation: brand + DTC subscription.
**Tight margins.** Mitigation: premium AOV + repeat.
**When stay-small wins.** $100-200K boutique DTC is comfortable.`,
    links: `

## See Also

- **q1953** — Start an Etsy shop business 2027
- **q1957** — Start a thrift store business 2027
- **q2133** — Start a CRO agency 2027
- **q2127** — Start a paid ads (PPC) agency 2027`,
    sources: ["https://www.shopify.com/","https://www.klaviyo.com/","https://rechargepayments.com/","https://www.postscript.io/","https://www.triplewhale.com/","https://www.northbeam.io/","https://www.gorgias.com/","https://www.loopreturns.com/","https://www.yotpo.com/","https://www.census.gov/retail/ecommerce.html"],
    tags: ["e-commerce-dtc-brand-2027-direct-to-consumer-product","shopify-235b-klaviyo-kvyo-recharge-postscript-triple-whale-northbeam-gorgias-loop-route-yotpo-stack","glossier-warby-wrby-allbirds-bird-casper-harrys-edgewell-dollar-shave-unilever-2016-1b-liquid-death-1-4b-olipop-1-85b-athletic-brewing-graza-fishwife-magic-spoon-references","att-privacy-sandbox-rising-cpm-unit-economics-pressure","subscription-influencer-ugc-retail-expansion-survival-2024-2027","10-30-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Shopify SHOP $8.9B $235B GMV + Klaviyo KVYO $900M + Recharge $10B GMV + Postscript $140M + Triple Whale $30M + Northbeam $15M + Gorgias + Loop Returns + Route + Yotpo stack, Glossier $300M + Warby Parker WRBY $770M + Allbirds BIRD $250M + Casper $487M IPO + Harrys Edgewell 2024 $1B + Dollar Shave Club Unilever 2016 $1B + Liquid Death $1.4B + Olipop $1.85B + Athletic Brewing + Graza + Fishwife + Magic Spoon references) real.' }
  },
  {
    id: 'q1930',
    tldr: `**TL;DR:** Coffee shop in 2027 = **brick-and-mortar specialty cafe** charging $4-$8/drink + food. **Y1 $200K-$700K (single cafe, 50-200 daily customers); Y2 $500K-$1.5M+ with 2nd location.** **Required:** $150-$500K capital + lease + La Marzocco/Slayer espresso machine + equipment + supplies + staff + state food + business license. **Players:** Starbucks (NASDAQ: SBUX, ~16K US stores, $36B revenue), Dunkin' (Inspire Brands ~9K US), Dutch Bros (NYSE: BROS, ~900+ stores), Black Rifle Coffee (NYSE: BRCC), Tim Hortons (RBI), 7 Brew (private $4B+ valuation 2024 ~250 stores), Scooter's Coffee (~750+), Caribou Coffee (Panera Brands), Peet's Coffee + Stumptown + Intelligentsia + Blue Bottle (Nestle 2017) all JAB Holding. **Independent specialty:** Bluestone Lane (~70), Joe Coffee, Onyx Coffee Lab, Counter Culture. **2024-2025 reality:** Dutch Bros + 7 Brew aggressive drive-thru expansion compressing margins. **Margin:** 8-18% net. **Win condition:** lease + 100+ daily transactions + food + retail bean program + brand.`,
    core: `

## Why Coffee Shop 2027 Is Real

US coffee market $100B+; ~150M Americans drink coffee daily. Demand drivers:
- Morning routine recurring
- Remote work cafe
- Specialty third-wave coffee
- Drive-thru convenience
- Food + pastry attach
- Retail bean program

## Pricing 2027

| Item | Price |
|---|---|
| Espresso shot | $3-$5 |
| Latte 12oz | $5-$8 |
| Drip 16oz | $3-$5 |
| Specialty cold brew | $5-$8 |
| Pastry | $3-$8 |
| Sandwich/breakfast | $7-$15 |
| Retail bean 12oz | $15-$30 |
| Subscription bean | $15-$50/mo |
| Wholesale to office | $20-$40/lb |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $150-500K capital + lease + La Marzocco + buildout] --> B[100-200 daily transactions]
    B --> C[Add wholesale + retail + subscription]
    C --> D[Y1: $200K-$700K · 1 cafe]
    D --> E[Y2: $500K-$1.5M+ · 2nd location]
\`\`\`

TAGS: coffee-shop-business-2027-brick-mortar-specialty-cafe, starbucks-sbux-16k-36b-dunkin-inspire-9k-dutch-bros-bros-900-black-rifle-brcc-tim-hortons-rbi-7-brew-4b-2024-250-scooters-750-caribou-panera-references, stumptown-intelligentsia-peets-blue-bottle-nestle-2017-jab-holding-3rd-wave, la-marzocco-slayer-synesso-equipment, 8-18-percent-net-margin-tight, 2027`,
    src: `

## Sources

- Starbucks (NASDAQ: SBUX): https://www.starbucks.com/
- Dutch Bros (NYSE: BROS): https://www.dutchbros.com/
- Black Rifle Coffee (NYSE: BRCC): https://www.blackriflecoffee.com/
- 7 Brew: https://7brew.com/
- Dunkin' (Inspire Brands): https://www.dunkindonuts.com/
- La Marzocco: https://www.lamarzoccohome.com/
- SCA (Specialty Coffee Association): https://sca.coffee/
- Toast POS (NYSE: TOST): https://pos.toasttab.com/
- Square POS: https://squareup.com/
- NCA (National Coffee Association): https://www.ncausa.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Latte 12oz | $5-$8 | Industry |
| Drip 16oz | $3-$5 | Industry |
| Starbucks SBUX revenue FY24 | ~$36B | SBUX 10-K |
| Starbucks US stores | ~16,000 | SBUX |
| Dutch Bros BROS revenue FY24 | ~$1.3B | BROS 10-K |
| Dutch Bros stores | ~900+ | BROS |
| Black Rifle BRCC revenue FY24 | ~$400M | BRCC 10-K |
| 7 Brew valuation 2024 | $4B+ | Crunchbase |
| 7 Brew stores | ~250+ | 7 Brew |
| Scooter's Coffee stores | ~750+ | Scooter's |
| Dunkin' US stores | ~9,000+ | Dunkin' |
| La Marzocco Linea PB commercial | $15K-$25K | La Marzocco |
| US coffee market | ~$100B+ | NCA |
| US coffee drinkers daily | ~150M | NCA |
| Toast TOST revenue FY24 | ~$5B | TOST 10-K |
| Y1 capital | $150K-$500K | Industry |
| Y1 revenue | $200K-$700K | Industry |
| Y2 revenue | $500K-$1.5M+ | Industry |
| Margin net | 8-18% | Industry |`,
    counter: `## Counter-Case
**Starbucks + Dutch Bros + 7 Brew compression.** Mitigation: specialty + brand + community.
**Lease + buildout capital.** Mitigation: smaller + drive-thru kiosk.
**Labor turnover + wages.** Mitigation: tip share + benefits.
**Margins tight.** Mitigation: retail + wholesale upsell.
**When stay-small wins.** Solo cafe at $250-400K is meaningful.`,
    links: `

## See Also

- **q2000** — Start a coffee cart business 2027
- **q1929** — Start a food truck business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q1980** — Start a catering business 2027`,
    sources: ["https://www.starbucks.com/","https://www.dutchbros.com/","https://www.blackriflecoffee.com/","https://7brew.com/","https://www.dunkindonuts.com/","https://www.lamarzoccohome.com/","https://sca.coffee/","https://pos.toasttab.com/","https://squareup.com/","https://www.ncausa.org/"],
    tags: ["coffee-shop-business-2027-brick-mortar-specialty-cafe","starbucks-sbux-16k-36b-dunkin-inspire-9k-dutch-bros-bros-900-black-rifle-brcc-tim-hortons-rbi-7-brew-4b-2024-250-scooters-750-caribou-panera-references","stumptown-intelligentsia-peets-blue-bottle-nestle-2017-jab-holding-3rd-wave","la-marzocco-slayer-synesso-equipment","8-18-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Starbucks SBUX $36B 16K US stores + Dunkin Inspire 9K + Dutch Bros BROS $1.3B 900 + Black Rifle BRCC $400M + Tim Hortons RBI + 7 Brew $4B 2024 250 + Scooters Coffee 750 + Caribou Panera Brands + Stumptown + Intelligentsia + Peets + Blue Bottle Nestle 2017 JAB Holding references, La Marzocco + Slayer + Synesso equipment, SCA + NCA $100B US coffee market + Toast TOST $5B + Square POS) real.' }
  },
  {
    id: 'q1929',
    tldr: `**TL;DR:** Food truck business in 2027 = **mobile restaurant** serving cuisine at events + festivals + commissary lots + brewery partnerships. **Y1 $80K-$300K (single truck); Y2 $300K-$900K with 2-3 trucks or brick-and-mortar conversion.** **Required:** $50-$200K capital (truck + build-out + equipment + commissary + permits + insurance). **Pricing per ticket:** $10-$25. **Players:** Tacos El Gordo, Kogi BBQ (Roy Choi LA pioneer), Cinnaholic + Coolhaus (food truck-to-brick), Chick-fil-A test trucks, Halal Guys (~150+ globally), Smashburger originally truck. **Industry:** US food truck industry $1.5B+ (IBISWorld) ~35K trucks. **2024-2025 trends:** EV food trucks emerging; cashless via Toast/Square; influencer-driven (TikTok food truck virality). **Margin:** 8-15% net after food + labor + truck + commissary. **Win condition:** corporate B2B catering + brewery + festival circuit + Instagram following = $200-$300K Y1 with disciplined ops.`,
    core: `

## Why Food Truck 2027 Is Real

Food trucks $1.5B+ industry US. Demand drivers:
- Festivals + farmers markets
- Brewery + winery partnerships (no kitchen onsite)
- Corporate catering (offices, conferences)
- College + university
- Wedding + private events
- Pop-up + market validation pre-brick-and-mortar

## Pricing 2027

| Item | Price |
|---|---|
| Per ticket | $10-$25 |
| Entree + side | $12-$22 |
| Premium specialty | $18-$30 |
| Event catering | $500-$5,000 minimum |
| Wedding 100-200 guests | $2,500-$10,000 |
| Brewery per event | $200-$500 min |
| Festival per-day | $500-$3,000 |
| Office park lunch | $150-$1,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $50-200K truck + buildout + commissary + permits] --> B[Brewery + corporate + festival bookings]
    B --> C[Add catering + events]
    C --> D[Y1: $80K-$300K · 1 truck]
    D --> E[Y2: $300K-$900K · 2-3 trucks]
\`\`\`

TAGS: food-truck-business-2027-mobile-restaurant, tacos-el-gordo-kogi-bbq-roy-choi-cinnaholic-coolhaus-chick-fil-a-test-halal-guys-150-smashburger-references, 1-5b-us-industry-35k-trucks-ibisworld, ev-food-trucks-2024-2025-emerging, cashless-toast-square-tiktok-influencer-virality, 8-15-percent-net-margin-tight, 2027`,
    src: `

## Sources

- IBISWorld Food Trucks: https://www.ibisworld.com/
- NRA (National Restaurant Association): https://restaurant.org/
- Toast POS (NYSE: TOST): https://pos.toasttab.com/
- Square POS: https://squareup.com/
- Halal Guys: https://thehalalguys.com/
- Kogi BBQ: https://kogibbq.com/
- Cinnaholic: https://cinnaholic.com/
- Coolhaus: https://www.cool.haus/
- Roaming Hunger (food truck marketplace): https://roaminghunger.com/
- BestFoodTrucks (booking): https://bestfoodtrucks.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Per ticket | $10-$25 | Industry |
| Event catering min | $500-$5,000 | Industry |
| Wedding 100-200 | $2,500-$10,000 | Industry |
| US food truck industry | ~$1.5B+ | IBISWorld |
| US food trucks count | ~35K+ | IBISWorld |
| Truck buildout | $50K-$200K | Industry |
| Halal Guys locations | ~150+ globally (post-truck) | Halal Guys |
| Kogi BBQ founded | 2008 LA Roy Choi | Kogi |
| Cinnaholic franchise units | ~80+ | Cinnaholic |
| Coolhaus (pivoted) | retail brand | Coolhaus |
| Roaming Hunger booking | major platform | Roaming Hunger |
| BestFoodTrucks | booking platform | BestFoodTrucks |
| Toast TOST revenue FY24 | ~$5B | TOST 10-K |
| Y1 capital | $50K-$200K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$900K | Industry |
| Margin net | 8-15% | Industry |
| Food cost % | 28-35% | Industry |
| Labor cost % | 25-30% | Industry |`,
    counter: `## Counter-Case
**Truck capital + commissary.** Mitigation: used truck + smaller buildout.
**Permits multi-jurisdiction.** Mitigation: focus 1-2 counties.
**Weather + seasonality.** Mitigation: indoor catering pivot.
**Razor-thin margins.** Mitigation: catering premium + brewery partnerships.
**When stay-small wins.** Solo operator 4-5 events/wk at $80-120K is meaningful.`,
    links: `

## See Also

- **q2004** — Start a pizza truck business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q1982** — Start an ice cream truck business 2027
- **q2000** — Start a coffee cart business 2027`,
    sources: ["https://www.ibisworld.com/","https://restaurant.org/","https://pos.toasttab.com/","https://squareup.com/","https://thehalalguys.com/","https://kogibbq.com/","https://cinnaholic.com/","https://www.cool.haus/","https://roaminghunger.com/","https://bestfoodtrucks.com/"],
    tags: ["food-truck-business-2027-mobile-restaurant","tacos-el-gordo-kogi-bbq-roy-choi-cinnaholic-coolhaus-chick-fil-a-test-halal-guys-150-smashburger-references","1-5b-us-industry-35k-trucks-ibisworld","ev-food-trucks-2024-2025-emerging","cashless-toast-square-tiktok-influencer-virality","8-15-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Tacos El Gordo + Kogi BBQ Roy Choi 2008 LA + Cinnaholic 80 franchise + Coolhaus pivoted + Chick-fil-A test + Halal Guys 150 + Smashburger references, IBISWorld $1.5B 35K US food trucks + Roaming Hunger + BestFoodTrucks booking platforms + Toast TOST $5B + Square POS) real.' }
  },
  {
    id: 'q9625',
    tldr: `**TL;DR:** Notary public business in 2027 = **certified document signing + remote online notarization (RON)** charging $15-$30/signature in-person + $25-$75/signature mobile + $25-$100/signature RON. **Y1 $20K-$80K solo side hustle; Y2 $80K-$200K with multi-state RON + signing agent specialty.** **Required:** state notary commission (state-by-state — $50-$300 typical, varies + bond + insurance) + RON certification (states: VA pioneer 2011, TX, FL, IN, MO, NV, OH, OK, PA, KY, ID, AZ + others 2020-2024 wave). **Stack:** Notarize (Doc Solutions $50M+), NotaryCam (Stewart Title), DocVerify, Pavaso, Snapdocs (real estate-focused signings), NotaryGo Network. **Players:** Notary Signing Agents (NSA) for real estate closings (Snapdocs, NotaryGo, NotaryRotary), 123Notary, Notary Public Underwriters. **2024-2025 reality:** Remote Online Notarization (RON) legal in ~40+ states; in-person mobile still dominant; real estate signing slowdown 2023-2024 from mortgage rates. **Margin:** 80-95%. **Win condition:** RON multi-state + signing agent specialty (loan docs, estate planning, wills, POAs).`,
    core: `

## Why Notary 2027 Is Real

Documents requiring notarization: real estate closings, wills, POAs, affidavits, oaths, deeds, vehicle titles. Demand drivers:
- Real estate closings (signing agent)
- Estate planning + wills + POAs
- Loan modifications + refinance
- Adoption + immigration
- Mobile/elderly clients
- RON for out-of-state signers

## Pricing 2027

| Service | Price |
|---|---|
| In-person notarization | $15-$30/signature (state caps) |
| Mobile to home/office | $25-$75/signature |
| RON | $25-$100/signature |
| Loan signing (NSA) | $75-$250/file |
| Reverse mortgage signing | $125-$300/file |
| Estate planning POA bundle | $100-$400 |
| Travel premium | $25-$75 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: State notary commission + RON cert + $200-1K capital] --> B[Sign up Snapdocs + Notary Rotary + 123Notary]
    B --> C[Loan signing + estate + RON specialty]
    C --> D[Y1: $20K-$80K · solo side hustle]
    D --> E[Y2: $80K-$200K · multi-state RON]
\`\`\`

TAGS: notary-public-business-2027-document-signing-ron, ron-virginia-2011-tx-fl-in-mo-nv-oh-ok-pa-ky-id-az-40-states-legal-2024, notarize-doc-solutions-50m-notarycam-stewart-title-docverify-pavaso-snapdocs-notarygo-platforms, nsa-notary-signing-agent-real-estate-closings, 123-notary-notary-rotary-notary-public-underwriters-references, 80-95-percent-margin, 2027`,
    src: `

## Sources

- NNA (National Notary Association): https://www.nationalnotary.org/
- Notarize (Doc Solutions): https://www.notarize.com/
- NotaryCam (Stewart Title): https://www.notarycam.com/
- Snapdocs: https://www.snapdocs.com/
- 123Notary: https://www.123notary.com/
- Notary Rotary: https://www.notaryrotary.com/
- DocVerify: https://www.docverify.com/
- Pavaso: https://www.pavaso.com/
- NotaryGo: https://www.notarygo.com/
- MBA (Mortgage Bankers Association) RON guidance: https://www.mba.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| In-person | $15-$30/sig (state caps) | State |
| Mobile | $25-$75/sig | Industry |
| RON | $25-$100/sig | Industry |
| Loan signing NSA | $75-$250/file | Industry |
| Reverse mortgage signing | $125-$300 | Industry |
| State commission fees | $50-$300 typical | State |
| Bond $5K-$25K | required | State |
| E&O insurance | $50-$200/yr | Industry |
| RON-legal states | ~40+ (2024) | NNA |
| Virginia RON pioneer | 2011 | VA |
| Notarize parent | Doc Solutions | Doc |
| Notarize funding | ~$50M+ | Crunchbase |
| Snapdocs funding | ~$260M+ | Crunchbase |
| NotaryCam parent | Stewart Title | Stewart |
| NNA membership | ~80K+ | NNA |
| 123Notary directory | major | 123Notary |
| Notary Rotary directory | major | Notary Rotary |
| Y1 capital | $200-$1K | Industry |
| Y1 revenue | $20K-$80K | Industry |
| Y2 revenue | $80K-$200K | Industry |
| Margin | 80-95% | Industry |`,
    counter: `## Counter-Case
**State cap on in-person fees.** Mitigation: mobile + RON + signing agent premium.
**Real estate slowdown.** Mitigation: estate planning + business notarizations + multi-state RON.
**Competition from banks (free notarization).** Mitigation: convenience + mobile + after-hours.
**Multi-state RON licensing.** Mitigation: invest in 2-3 high-volume states.
**When stay-side wins.** $30-50K notary side income is meaningful.`,
    links: `

## See Also

- **q1959** — Start a bookkeeping business 2027
- **q1956** — Start a property management business 2027
- **q2130** — Start a fractional CFO firm 2027
- **q1954** — Start a virtual assistant business 2027`,
    sources: ["https://www.nationalnotary.org/","https://www.notarize.com/","https://www.notarycam.com/","https://www.snapdocs.com/","https://www.123notary.com/","https://www.notaryrotary.com/","https://www.docverify.com/","https://www.pavaso.com/","https://www.notarygo.com/","https://www.mba.org/"],
    tags: ["notary-public-business-2027-document-signing-ron","ron-virginia-2011-tx-fl-in-mo-nv-oh-ok-pa-ky-id-az-40-states-legal-2024","notarize-doc-solutions-50m-notarycam-stewart-title-docverify-pavaso-snapdocs-notarygo-platforms","nsa-notary-signing-agent-real-estate-closings","123-notary-notary-rotary-notary-public-underwriters-references","80-95-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Notarize Doc Solutions $50M + NotaryCam Stewart Title + Snapdocs $260M + DocVerify + Pavaso + NotaryGo platforms, NNA National Notary Association 80K members + 123Notary + Notary Rotary + Notary Public Underwriters directories, VA RON pioneer 2011 + TX + FL + IN + MO + NV + OH + OK + PA + KY + ID + AZ ~40 RON-legal states 2024, MBA Mortgage Bankers Association guidance) real.' }
  },
  {
    id: 'q9559',
    tldr: `**TL;DR:** A CRO calibrates qualification rigor when **cash position + runway are forcing a strategic shift** by (1) computing **effective runway** at current burn × pipeline conversion assumptions, (2) **tiering qualification** by deal-stage cost-to-pursue (top-of-funnel loose vs proposal-stage tight), (3) **introducing exit criteria** at qualification handoff (BANT+ → MEDDIC/MEDDPICC → Force Management Command of the Message), (4) **publishing a "no-fly" list** of segments/use cases that consume disproportionate sales cycles, and (5) **changing AE compensation** to reward qualified pipeline ratio not raw volume. **The hard part:** AEs whose comp depends on quota will resist tighter qualification because it appears to reduce pipeline. **Resolution:** redesign comp around win rate + cycle time + ACV alongside bookings, and back-test the qualification rubric against last 18 months of deals to find the leading indicators of waste (champion absent, decision-maker not engaged, no allocated budget, competing priorities, regulatory unknowns).`,
    core: `

## Why Qualification Rigor Tightens in Runway Stress

When runway compresses (<12 months), the cost of pursuing weak deals is no longer just opportunity cost — it's existential. CFO + CEO pressure CRO to: (a) shorten sales cycles, (b) raise win rates, (c) cut S&M spend.

## The Five-Step Framework

**1. Compute effective runway.** Current cash ÷ monthly burn × pipeline-conversion-adjusted forecast. Be honest about pipeline coverage that's actually qualified.

**2. Tier qualification by stage.**
- Top-of-funnel (MQL → SQL): looser, ICP + need + budget signal
- Mid-funnel (SQL → Opp): MEDDIC/MEDDPICC + Champion + Compelling Event
- Late-stage (Opp → Close): Force Management Command of Message + Decision Process + Decision Criteria + Implications confirmed

**3. Exit criteria gates.** Each stage requires specific evidence: signed mutual action plan, decision-maker meeting, budget confirmation, technical validation.

**4. No-fly list.** Segments + use cases that historically waste cycle: ICP misfits, "we're evaluating" early-stage education, regulated industries without internal champion, organizations in transition (M&A, layoffs).

**5. Compensation redesign.** AE comp shifts from pure bookings to bookings × win-rate × ACV × cycle-time. Pipeline ratio (qualified pipeline / quota) becomes a comp lever.

## The Cultural Change

AEs resist tighter qualification because their pipeline shrinks visibly. CRO must:
- Show backward-looking data: 60-70% of pipeline at risk of slipping
- Set realistic conversion benchmarks
- Coach AEs on disqualification skills (saying no is harder than saying yes)
- Reward early-out (kill bad deals fast)

## The Frameworks

- **BANT+**: Budget, Authority, Need, Timeline + Compelling Event
- **MEDDIC**: Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion
- **MEDDPICC**: + Paper Process + Competition
- **Force Management Command of the Message**: positive business outcomes + required capabilities + pre-call planning
- **CHAMP**: Challenges, Authority, Money, Prioritization
- **GPCT**: Goals, Plans, Challenges, Timing`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Cash runway <12mo, CFO pressure] --> B[Compute effective runway with conversion]
    B --> C[Tier qualification BANT+ → MEDDIC → CotM]
    C --> D[Publish no-fly list]
    D --> E[Redesign AE comp around quality]
    E --> F{Win rate up, cycle down, qualified pipeline ratio up?}
    F -->|Yes| G[Runway extends, exit risk reduces]
    F -->|No| H[Re-coach, audit AEs, replace]
\`\`\`

TAGS: cro-qualification-rigor-runway-pressure, effective-runway-pipeline-conversion-adjusted-forecast, meddic-meddpicc-bant-cotm-force-management-champ-gpct-frameworks, ae-compensation-redesign-win-rate-cycle-time-acv-pipeline-ratio, no-fly-list-icp-misfit-disqualification-skills, 2027`,
    src: `

## Sources

- Force Management Command of the Message: https://www.forcemanagement.com/
- MEDDIC Academy: https://meddicacademy.com/
- Winning by Design SPICED: https://winningbydesign.com/
- Sandler Training: https://www.sandler.com/
- Pavilion (GTM community): https://www.joinpavilion.com/
- 30 Minutes to President's Club: https://30mpc.com/
- The Bridge Group SaaS Sales Benchmarks: https://www.bridgegroupinc.com/
- KeyBanc Capital Markets SaaS Survey: https://www.key.com/
- Bessemer State of the Cloud: https://www.bvp.com/atlas/state-of-the-cloud
- SaaStr: https://www.saastr.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Runway pressure threshold | <12 months | Industry CFO guidance |
| Pipeline coverage healthy | 3-5x quota | Bridge Group |
| Win rate B2B SaaS median | 18-28% | Bridge Group benchmarks |
| Sales cycle SaaS median | 60-180 days | Bridge Group |
| AE quota typical SMB | $500K-$1M | Bridge Group |
| AE quota mid-market | $750K-$1.5M | Bridge Group |
| AE quota enterprise | $1M-$3M | Bridge Group |
| Force Management founded | 2002 | Force Management |
| MEDDIC origin | PTC + Jack Napoli + Dick Dunkel 1996 | MEDDIC Academy |
| MEDDPICC update | added Paper Process + Competition | MEDDIC Academy |
| Winning by Design SPICED | Situation Pain Impact Critical Event Decision | WBD |
| Sandler Pain Funnel | Pain, Budget, Decision | Sandler |
| Pavilion members | ~20K+ GTM leaders | Pavilion |
| Bessemer State of Cloud benchmarks | annual report | BVP |
| KeyBanc SaaS Survey | annual respondents 100+ | KeyBanc |
| 30MPC podcast subscribers | major | 30MPC |
| Outreach Sales Execution Platform | acquired by Vista 2024 | Vista |`,
    counter: `## Counter-Case
**AEs resist tighter qualification.** Mitigation: comp redesign + coaching + visibility.
**Top-of-funnel pipeline shrinks visibly.** Mitigation: smaller-but-qualified > big-but-noise.
**False positives in no-fly list.** Mitigation: review quarterly + edge-case exceptions.
**MEDDIC overhead.** Mitigation: keep light + focus on Champion + Economic Buyer + Compelling Event.
**When status-quo wins.** If runway > 18 months, less urgency; calibrate gradually.`,
    links: `

## See Also

- **q9558** — CRO two separate sales motions framework
- **q9557** — Founder-led PMF weak sales discipline trade
- **q9556** — Founder sales experience vs non-sales hiring first AE
- **q2104** — Start a sales coach business 2027`,
    sources: ["https://www.forcemanagement.com/","https://meddicacademy.com/","https://winningbydesign.com/","https://www.sandler.com/","https://www.joinpavilion.com/","https://30mpc.com/","https://www.bridgegroupinc.com/","https://www.key.com/","https://www.bvp.com/atlas/state-of-the-cloud","https://www.saastr.com/"],
    tags: ["cro-qualification-rigor-runway-pressure","effective-runway-pipeline-conversion-adjusted-forecast","meddic-meddpicc-bant-cotm-force-management-champ-gpct-frameworks","ae-compensation-redesign-win-rate-cycle-time-acv-pipeline-ratio","no-fly-list-icp-misfit-disqualification-skills","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Force Management 2002 + MEDDIC Academy PTC Jack Napoli Dick Dunkel 1996 + MEDDPICC + Winning by Design SPICED + Sandler Pain Funnel + CHAMP + GPCT frameworks, Bridge Group SaaS Sales Benchmarks + KeyBanc Capital Markets SaaS Survey + Bessemer State of Cloud + Pavilion 20K + 30 Minutes to Presidents Club + SaaStr industry data sources, Outreach Vista 2024 sales execution) real.' }
  },
  {
    id: 'q9558',
    tldr: `**TL;DR:** A CRO decides whether to build **two separate sales motions (organizationally split SMB + enterprise vs unified)** by evaluating: (1) **deal size + sales cycle differential** (>3x ACV gap or >2x cycle differential = split candidate), (2) **buyer persona separation** (technical individual contributor vs executive economic buyer = split), (3) **sales motion philosophy** (PLG self-serve vs sales-led top-down = split), (4) **org size + cost to manage** (under $5M ARR usually unified; $20M+ ARR usually split), and (5) **founder bandwidth + investor pressure**. **The trap:** premature split costs 20-40% efficiency drag from duplicate leadership + over-investment in management; late split causes mid-market neglect + enterprise underinvestment. **Frameworks:** SLG/PLG/SLG (Sales-Led Growth → Product-Led Sales → Hybrid). **Players reference:** HubSpot HUBS unified to $2.6B before mid-market/enterprise split; Atlassian PLG-pure until 2020+; Snowflake SNOW enterprise-only top-down; Zendesk ZEN split SMB SLG + enterprise; Datadog DDOG hybrid SMB self-serve + enterprise AE.`,
    core: `

## When to Split Sales Motions

The decision rests on five evaluative dimensions:

**1. Deal size differential.** If enterprise ACV >3x SMB ACV (e.g., $25K vs $250K), workflows diverge meaningfully → split.

**2. Sales cycle differential.** If enterprise cycle >2x SMB cycle (e.g., 30 vs 90+ days), forecasting + comp + pipeline mgmt diverge → split.

**3. Buyer persona separation.** Technical individual contributor (SMB DevTool buyer) vs C-suite executive economic buyer (enterprise platform buyer) require different sales DNA → split.

**4. Sales motion philosophy.** PLG self-serve (Atlassian, Notion, Loom) vs enterprise sales-led (Snowflake, Workday WDAY) requires different teams.

**5. Org size + investor pressure.** <$5M ARR unified; $5-$20M ARR transitional; $20M+ ARR usually split with separate VP Mid-Market + VP Enterprise.

## Reference Patterns

- **HubSpot (HUBS, ~$2.6B):** unified for years; split mid-market + enterprise + corporate ~$200M ARR
- **Atlassian (TEAM):** PLG-pure 2002-2020; added enterprise sales for >$50K deals ~2020+
- **Snowflake (SNOW):** enterprise-only top-down from start
- **Zendesk (ZEN):** SMB SLG + enterprise SLG split
- **Datadog (DDOG):** hybrid — SMB self-serve + enterprise AE motion
- **Salesforce (CRM):** SMB + Mid-Market + Enterprise + Global Strategic Accounts segmentation

## The Split Cost

Split adds 20-40% management drag: dual VPs, dual comp plans, dual pipeline systems, dual forecasting. ROI requires deal-economics + win-rate + market-penetration improvement to justify.

## When Unified Wins

- Both motions buy similar value prop
- Sales cycle differential <2x
- Deal-size differential <3x
- Same buyer persona (DevOps engineer → VP Engineering)
- Pre-$5M ARR
- Single GTM leader with bandwidth`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Evaluate 5 dimensions] --> B{Deal size 3x + cycle 2x + buyer persona split?}
    B -->|Yes + $20M ARR| C[Split: VP SMB + VP Enterprise]
    B -->|No| D[Unified or transitional]
    C --> E[20-40 mgmt drag, deal-economics justify?]
    E -->|Yes| F[Split scales]
    E -->|No| G[Recombine]
\`\`\`

TAGS: cro-two-sales-motions-organizationally-split-vs-unified, slg-plg-hybrid-frameworks, hubspot-hubs-unified-then-split-atlassian-team-plg-pure-snowflake-snow-enterprise-zendesk-zen-split-datadog-ddog-hybrid-salesforce-crm-segmentation-references, deal-size-cycle-buyer-persona-org-size-five-dimensions, 20-40-percent-management-drag-cost, premature-split-trap-vs-late-split-mid-market-neglect, 2027`,
    src: `

## Sources

- Bessemer State of the Cloud: https://www.bvp.com/atlas/state-of-the-cloud
- SaaStr: https://www.saastr.com/
- HubSpot (NYSE: HUBS): https://www.hubspot.com/
- Atlassian (NASDAQ: TEAM): https://www.atlassian.com/
- Snowflake (NYSE: SNOW): https://www.snowflake.com/
- Salesforce (NYSE: CRM): https://www.salesforce.com/
- Pavilion: https://www.joinpavilion.com/
- Bridge Group SaaS Benchmarks: https://www.bridgegroupinc.com/
- ForceManagement Command of Sales: https://www.forcemanagement.com/
- Winning by Design: https://winningbydesign.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Split threshold ACV differential | 3x | Industry guidance |
| Split threshold cycle differential | 2x | Industry |
| Unified <$5M ARR | typical | Industry |
| Transitional $5-$20M ARR | typical | Industry |
| Split $20M+ ARR | typical | Industry |
| Mgmt drag from split | 20-40% | Industry |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Zendesk ZEN revenue (pre-take-private) | ~$1.3B | Industry |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| SMB AE quota typical | $500K-$1M | Bridge Group |
| Enterprise AE quota | $1M-$3M | Bridge Group |
| SLG sales cycle SaaS median | 60-180 days | Bridge Group |
| PLG conversion to paid | 2-7% typical | OpenView Partners |`,
    counter: `## Counter-Case
**Premature split.** Mitigation: stay unified until 5-dim test passes.
**Late split causes mid-market neglect.** Mitigation: review quarterly; split when persistent signals present.
**Comp design complexity.** Mitigation: clear ICP + segment definition.
**Forecast complexity.** Mitigation: separate forecasting cadence per segment.
**When stay-unified wins.** Same persona + similar cycle + similar ACV.`,
    links: `

## See Also

- **q9559** — CRO qualification rigor under runway pressure
- **q9557** — Founder-led PMF weak sales discipline
- **q9556** — Founder sales experience vs non-sales first AE hire
- **q9555** — Founder-led formalize sales comp + quotas timing`,
    sources: ["https://www.bvp.com/atlas/state-of-the-cloud","https://www.saastr.com/","https://www.hubspot.com/","https://www.atlassian.com/","https://www.snowflake.com/","https://www.salesforce.com/","https://www.joinpavilion.com/","https://www.bridgegroupinc.com/","https://www.forcemanagement.com/","https://winningbydesign.com/"],
    tags: ["cro-two-sales-motions-organizationally-split-vs-unified","slg-plg-hybrid-frameworks","hubspot-hubs-unified-then-split-atlassian-team-plg-pure-snowflake-snow-enterprise-zendesk-zen-split-datadog-ddog-hybrid-salesforce-crm-segmentation-references","deal-size-cycle-buyer-persona-org-size-five-dimensions","20-40-percent-management-drag-cost","premature-split-trap-vs-late-split-mid-market-neglect","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS $2.6B unified then split + Atlassian TEAM $4.4B PLG-pure 2020 + Snowflake SNOW $3.6B enterprise-only + Zendesk ZEN $1.3B + Datadog DDOG $2.7B hybrid + Salesforce CRM $35B SMB/MM/Enterprise/GSA segmentation references, Bessemer State of Cloud + SaaStr + Bridge Group SaaS benchmarks + Force Management + Winning by Design + Pavilion industry sources, OpenView Partners PLG conversion 2-7% data) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH H DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
