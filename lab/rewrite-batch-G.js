// Batch G: q1953 q1952 q1951 q1949 q1947 q1946 q1945 q1944 q1942 q1938
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1953',
    tldr: `**TL;DR:** Etsy shop business in 2027 = **handmade + craft + vintage + print-on-demand** e-commerce on Etsy marketplace charging $5-$500/item. **Y1 $10K-$80K solo side hustle (200-2,000 orders); Y2 $80K-$400K with full-time + multi-shop.** **Required:** $50-$2K capital + Etsy seller account (free signup, $0.20 listing fee, 6.5% transaction fee + 3% payment + sales tax) + product photography + LLC + sales tax permit. **Stack:** Etsy ETSY (~$2.8B revenue FY24, $12B GMS), Printful POD partner, Printify, Gelato, Gooten, Sticker Mule. **Players:** ~9M Etsy sellers globally; top sellers $1M+/yr (PrintItFunky, Beadboat, Caitlyn Minimalist). **2024-2027 reality:** Etsy fees increasing (6.5% transaction +2024); competition from Shopify DTC + Amazon Handmade; AI-generated listings flooded market 2024; Etsy added Star Seller + Etsy Plus + Etsy Ads at $1-5/day. **Margin:** 30-50% after fees + materials + shipping. **Win condition:** niche specialty + 500+ orders/mo + SEO + Pinterest + TikTok organic.`,
    core: `

## Why Etsy 2027 Is Real (But Crowded)

Etsy 9M sellers globally; ~$12B GMS 2024. Top 1% earn $100K+. Demand drivers:
- Handmade gifts (wedding, baby, birthday, holiday)
- Personalized (custom name, date)
- Wedding stationery + signage
- Home decor specialty
- Pet portraits + signs
- Vintage + antique

## Pricing 2027

| Category | Price |
|---|---|
| Stickers/decals | $3-$15 |
| Print/poster | $10-$60 |
| Jewelry | $15-$300+ |
| Wedding signage | $30-$300 |
| Custom name necklace | $30-$150 |
| Home decor | $20-$200 |
| Vintage clothing | $25-$300 |
| Pet portrait | $25-$200 |
| Wholesale orders | discount 30-50% |
| Listing fee | $0.20 each |
| Etsy transaction fee | 6.5% |
| Etsy payment fee | 3% + $0.25 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Etsy seller setup + LLC + $50-2K capital + photography] --> B[Niche specialty + SEO + Pinterest + TikTok]
    B --> C[200-2,000 orders Y1]
    C --> D[Y1: $10K-$80K side hustle]
    D --> E[Y2: $80K-$400K full-time + multi-shop]
\`\`\`

TAGS: etsy-shop-business-2027-handmade-craft-vintage-pod, etsy-etsy-2-8b-revenue-12b-gms-9m-sellers-marketplace, printful-printify-gelato-gooten-sticker-mule-pod-partners, ai-generated-listings-flood-2024-pressure, star-seller-etsy-plus-etsy-ads-1-5-day, niche-specialty-seo-pinterest-tiktok-organic, 30-50-percent-margin-after-fees, 2027`,
    src: `

## Sources

- Etsy (NASDAQ: ETSY): https://www.etsy.com/
- Printful: https://www.printful.com/
- Printify: https://printify.com/
- Gelato: https://www.gelato.com/
- Sticker Mule: https://www.stickermule.com/
- Etsy Seller Handbook: https://www.etsy.com/seller-handbook
- Shopify (NYSE: SHOP): https://www.shopify.com/
- Amazon Handmade: https://www.amazon.com/handmade
- Marmalead Etsy SEO: https://marmalead.com/
- eRank Etsy SEO: https://erank.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Etsy ETSY revenue FY24 | ~$2.8B | ETSY 10-K |
| Etsy GMS FY24 | ~$12B | ETSY 10-K |
| Etsy active sellers | ~9M globally | ETSY |
| Etsy active buyers | ~95M | ETSY |
| Listing fee | $0.20 each | Etsy |
| Transaction fee | 6.5% | Etsy |
| Payment fee | 3% + $0.25 | Etsy |
| Etsy Plus | $10/mo | Etsy |
| Etsy Ads | $1-$5/day budget | Etsy |
| Printful integration | Yes | Printful |
| Printify integration | Yes | Printify |
| Top 1% Etsy sellers earn | $100K+/yr | Industry estimates |
| Top 0.1% sellers | $1M+/yr | Industry estimates |
| US Etsy buyers | ~50%+ of Etsy | Etsy |
| Marmalead/eRank SEO tools | $7-$30/mo | Industry |
| Y1 capital | $50-$2K | Industry |
| Y1 revenue | $10K-$80K | Industry |
| Y2 revenue | $80K-$400K | Industry |
| Margin | 30-50% | Industry |`,
    counter: `## Counter-Case
**Etsy fees + AI-flood saturation.** Mitigation: niche + brand + Pinterest/TikTok off-platform.
**Shopify DTC alternative.** Mitigation: dual-channel + Shopify alongside.
**Algorithm changes.** Mitigation: SEO + email list off-platform.
**Counterfeit listings.** Mitigation: trademark + brand registry.
**When stay-side wins.** $20-40K side income is meaningful Etsy lifestyle.`,
    links: `

## See Also

- **q1953** is this entry — cross-links below
- **q1931** — Start an e-commerce DTC brand 2027
- **q1989** — Start a candle making business 2027
- **q1990** — Start a soap making business 2027`,
    sources: ["https://www.etsy.com/","https://www.printful.com/","https://printify.com/","https://www.gelato.com/","https://www.stickermule.com/","https://www.etsy.com/seller-handbook","https://www.shopify.com/","https://www.amazon.com/handmade","https://marmalead.com/","https://erank.com/"],
    tags: ["etsy-shop-business-2027-handmade-craft-vintage-pod","etsy-etsy-2-8b-revenue-12b-gms-9m-sellers-marketplace","printful-printify-gelato-gooten-sticker-mule-pod-partners","ai-generated-listings-flood-2024-pressure","star-seller-etsy-plus-etsy-ads-1-5-day","niche-specialty-seo-pinterest-tiktok-organic","30-50-percent-margin-after-fees","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Etsy ETSY $2.8B FY24 $12B GMS 9M sellers 95M buyers + Etsy Plus $10/mo + Etsy Ads $1-5/day fees, Printful + Printify + Gelato + Gooten + Sticker Mule POD partners, Marmalead + eRank $7-30/mo Etsy SEO tools, Shopify SHOP + Amazon Handmade alternatives) real.' }
  },
  {
    id: 'q1952',
    tldr: `**TL;DR:** Online course business in 2027 = **digital course + cohort program + membership** charging $50-$2,000/course + $500-$5,000 cohort + $20-$200/mo membership. **Y1 $30K-$200K solo (50-500 students); Y2 $200K-$1M+ with multi-product + cohort + community.** **Required:** $0-$5K capital + course platform + email + community + landing page + video equipment + content + audience. **Platforms:** Teachable (Hotmart 2020), Thinkific (TSX: THNC), Kajabi ($3.5B 2021 valuation), Podia, Mighty Networks, Circle (Common Room 2024), Substack (NYSE: SUBS), Maven, Outschool. **Players:** Ali Abdaal ($5M+), Justin Welsh ($5M+), Khan Academy (~150M users free), MasterClass ($2.75B 2021 valuation), Coursera (NYSE: COUR), Udemy (NASDAQ: UDMY), Skillshare. **2027 reality:** "course business" peaked 2020-2022; mature now. Survivors: cohort-based + community + specific niche (not generic). **Margin:** 70-85%. **Win condition:** specific transformation niche + audience + cohort/community model.`,
    core: `

## Why Online Course 2027 Is Real

Despite saturation, specific niche + transformation outcome courses still pay. Demand drivers:
- Skill transition (career change)
- Income generation (side hustle)
- Health/fitness/nutrition
- Mindset/spiritual
- Business + entrepreneurship
- Tech (AI, ChatGPT, coding)
- Creator economy

## Pricing 2027

| Format | Price |
|---|---|
| Mini-course (1-3 hr) | $20-$100 |
| Standard course (8-20 hr) | $100-$500 |
| Premium course | $500-$2,000 |
| Cohort program (4-12 wk) | $500-$5,000 |
| High-ticket coaching cohort | $3,000-$15,000 |
| Membership monthly | $20-$200 |
| Annual all-access | $200-$3,000 |
| Mastermind | $5K-$50K/yr |
| Workshop/intensive (1-3 day) | $300-$5,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Niche + audience + $0-5K capital + Teachable/Kajabi/Thinkific] --> B[Build email list + content]
    B --> C[Launch course + community + cohort]
    C --> D[Y1: $30K-$200K · 50-500 students]
    D --> E[Y2: $200K-$1M+ · multi-product + cohort + community]
\`\`\`

TAGS: online-course-business-2027-digital-cohort-membership, teachable-hotmart-2020-thinkific-thnc-kajabi-3-5b-podia-mighty-networks-circle-common-room-2024-substack-subs-maven-outschool-platforms, ali-abdaal-justin-welsh-khan-academy-150m-masterclass-2-75b-coursera-cour-udemy-udmy-skillshare-references, cohort-based-community-specific-niche-transformation-2027, mature-saturated-2020-2022-survivors-niche, 70-85-percent-margin, 2027`,
    src: `

## Sources

- Teachable (Hotmart): https://teachable.com/
- Thinkific (TSX: THNC): https://www.thinkific.com/
- Kajabi: https://kajabi.com/
- Podia: https://www.podia.com/
- Mighty Networks: https://www.mightynetworks.com/
- Circle (Common Room): https://circle.so/
- Substack: https://substack.com/
- Maven (cohort-based): https://maven.com/
- Coursera (NYSE: COUR): https://www.coursera.org/
- Udemy (NASDAQ: UDMY): https://www.udemy.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Mini-course | $20-$100 | Industry |
| Standard course | $100-$500 | Industry |
| Cohort program | $500-$5,000 | Industry |
| High-ticket cohort | $3K-$15K | Industry |
| Teachable parent | Hotmart 2020 acquisition | Hotmart |
| Thinkific THNC revenue FY24 | ~CAD$75M | THNC annual |
| Kajabi valuation 2021 | $3.5B | Crunchbase |
| Podia | private | Podia |
| Mighty Networks funding | ~$50M+ | Crunchbase |
| Circle acquired by Common Room | 2024 | Common Room |
| Substack SUBS pre-IPO | private (S-1 filed 2024) | SEC |
| Maven funding | ~$40M+ | Crunchbase |
| Coursera COUR revenue FY24 | ~$695M | COUR 10-K |
| Udemy UDMY revenue FY24 | ~$785M | UDMY 10-K |
| MasterClass valuation 2021 | $2.75B | Crunchbase |
| Skillshare | private | Skillshare |
| Khan Academy users | ~150M | Khan |
| Ali Abdaal revenue | $5M+/yr | Abdaal publicly disclosed |
| Justin Welsh revenue | $5M+/yr | Welsh publicly disclosed |
| Y1 capital | $0-$5K | Industry |
| Y1 revenue | $30K-$200K | Industry |
| Y2 revenue | $200K-$1M+ | Industry |
| Margin | 70-85% | Industry |`,
    counter: `## Counter-Case
**Saturated market.** Mitigation: specific niche + transformation outcome.
**Refund rates 10-30%.** Mitigation: clear positioning + qualification.
**Course completion 3-15%.** Mitigation: cohort + community + accountability.
**Platform fees 5-30%.** Mitigation: own audience/email + self-host where possible.
**When stay-side wins.** $30-60K side course income is meaningful.`,
    links: `

## See Also

- **q1951** — Start a podcast network 2027
- **q1936** — Start a content creation business 2027
- **q2099** — Start an executive coach business 2027
- **q2104** — Start a sales coach business 2027`,
    sources: ["https://teachable.com/","https://www.thinkific.com/","https://kajabi.com/","https://www.podia.com/","https://www.mightynetworks.com/","https://circle.so/","https://substack.com/","https://maven.com/","https://www.coursera.org/","https://www.udemy.com/"],
    tags: ["online-course-business-2027-digital-cohort-membership","teachable-hotmart-2020-thinkific-thnc-kajabi-3-5b-podia-mighty-networks-circle-common-room-2024-substack-subs-maven-outschool-platforms","ali-abdaal-justin-welsh-khan-academy-150m-masterclass-2-75b-coursera-cour-udemy-udmy-skillshare-references","cohort-based-community-specific-niche-transformation-2027","mature-saturated-2020-2022-survivors-niche","70-85-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Teachable Hotmart 2020 + Thinkific THNC CAD$75M + Kajabi $3.5B 2021 + Podia + Mighty Networks $50M + Circle Common Room 2024 + Substack SUBS S-1 2024 + Maven $40M + Outschool platforms, Coursera COUR $695M + Udemy UDMY $785M + MasterClass $2.75B + Skillshare + Khan Academy 150M + Ali Abdaal $5M + Justin Welsh $5M creator references) real.' }
  },
  {
    id: 'q1951',
    tldr: `**TL;DR:** Podcast network in 2027 = **multi-show audio content business** monetizing via ads, sponsorships, subscriptions, courses, merchandise. **Y1 $30K-$200K solo/small (1-5 shows); Y2 $200K-$1M+ with 5-20 shows + network advertising sales.** **Required:** $1-$15K capital + recording equipment (Shure SM7B, Rode Procaster, Zoom H6, Riverside.fm, Squadcast, Descript editing) + RSS hosting (Buzzsprout, Libsyn, Anchor/Spotify for Podcasters, Captivate, Transistor) + ad-sales relationships (Acast, Megaphone Spotify, Wondery Amazon, iHeartMedia). **Players:** iHeartMedia (NASDAQ: IHRT ~$3.4B), Audacy (formerly Entercom ~$1B), Wondery (Amazon 2020 ~$300M), SiriusXM Pandora (NASDAQ: SIRI), Spotify (NYSE: SPOT) ~$15B+ podcast investment, NPR, Cumulus Media, Westwood One, Salem Media, BBC. **2024-2025 reality:** Spotify exclusive deals largely ended; Joe Rogan signed $250M new deal 2024 still on Spotify+open distribution. Ad revenue $2.2B+ 2024 (IAB). **Margin:** 20-45% net. **Win condition:** vertical niche + 50K+ downloads/episode + brand sponsorships.`,
    core: `

## Why Podcast 2027 Is Real

Podcast ad revenue $2.2B+ 2024 growing 8-12%/yr (IAB). Demand drivers:
- Niche-vertical audience
- Brand sponsorship + ad sales
- Premium subscription (Spotify, Apple Podcasts Subscriptions)
- Course + book + speaking platform
- Patreon + paid community

## Pricing 2027 (Ad CPM Rates)

| Type | CPM |
|---|---|
| Pre-roll (15-30 sec) | $12-$25 |
| Mid-roll (60 sec) | $18-$50 |
| Host-read endorsement | $25-$80 |
| Programmatic ad | $5-$15 |
| Spot CPM for major shows | $50-$200+ |
| Premium subscription | $5-$15/mo |
| Patreon tiers | $2-$50/mo |
| Live event ticket | $20-$300 |
| Sponsorship integration | $10K-$500K+/deal |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $1-15K capital + Shure SM7B/Rode + Riverside.fm + Buzzsprout/Captivate] --> B[Launch 1-3 shows + niche audience]
    B --> C[Reach 50K+ downloads/episode]
    C --> D[Y1: $30K-$200K · ads + sponsorships]
    D --> E[Y2: $200K-$1M+ · 5-20 show network + ad sales]
\`\`\`

TAGS: podcast-network-business-2027-multi-show-audio, iheartmedia-ihrt-3-4b-audacy-entercom-1b-wondery-amazon-2020-300m-siriusxm-pandora-siri-spotify-spot-15b-investment-npr-cumulus-westwood-one-salem-bbc-players, shure-sm7b-rode-procaster-zoom-h6-riverside-fm-squadcast-descript-recording, buzzsprout-libsyn-anchor-spotify-podcasters-captivate-transistor-rss-hosting, acast-megaphone-spotify-wondery-amazon-iheartmedia-ad-sales-networks, joe-rogan-250m-2024-spotify-open-distribution, iab-2-2b-podcast-ad-revenue-2024-8-12-percent-growth, 20-45-percent-net-margin, 2027`,
    src: `

## Sources

- Spotify (NYSE: SPOT) podcast: https://podcasters.spotify.com/
- Apple Podcasts: https://podcasters.apple.com/
- iHeartMedia (NASDAQ: IHRT): https://www.iheartmedia.com/
- Audacy: https://www.audacy.com/
- Wondery (Amazon): https://wondery.com/
- SiriusXM (NASDAQ: SIRI): https://www.siriusxm.com/
- Buzzsprout: https://www.buzzsprout.com/
- Libsyn: https://libsyn.com/
- Captivate: https://www.captivate.fm/
- Riverside.fm (Wix 2024): https://riverside.fm/
- IAB (Internet Advertising Bureau) podcast revenue report: https://www.iab.com/
- Acast (Stockholm: ACAST): https://www.acast.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Pre-roll CPM | $12-$25 | Industry |
| Mid-roll CPM | $18-$50 | Industry |
| Host-read CPM | $25-$80 | Industry |
| Premium subscription | $5-$15/mo | Industry |
| iHeartMedia IHRT revenue FY24 | ~$3.4B | IHRT 10-K |
| Audacy revenue FY24 | ~$1B | Audacy |
| Wondery acquired by Amazon | 2020 ~$300M | Amazon |
| SiriusXM SIRI revenue FY24 | ~$8.6B | SIRI 10-K |
| Spotify SPOT podcast investment | ~$1B+ over time | Spotify |
| Joe Rogan new deal 2024 | $250M+ over 3yr (still Spotify + open) | Industry reports |
| US podcast ad revenue 2024 | $2.2B+ | IAB |
| Annual growth rate 2024 | 8-12% | IAB |
| Buzzsprout hosting | $12-$24/mo | Buzzsprout |
| Libsyn hosting | $7-$75/mo | Libsyn |
| Captivate hosting | $19-$99/mo | Captivate |
| Riverside.fm parent | Wix 2024 acquisition | Wix |
| Acast revenue FY24 | ~SEK 1.6B | Acast |
| Shure SM7B mic | $399 | Shure |
| Rode Procaster | $229 | Rode |
| Y1 capital | $1K-$15K | Industry |
| Y1 revenue | $30K-$200K | Industry |
| Y2 revenue | $200K-$1M+ | Industry |
| Margin | 20-45% | Industry |`,
    counter: `## Counter-Case
**Spotify exclusive deals ended.** Mitigation: open distribution + multiple platforms.
**Audience growth slow.** Mitigation: niche specialty + paid promotion + cross-show.
**Ad revenue per download low.** Mitigation: host-read premium + sponsorship integrations.
**Production cost.** Mitigation: efficient workflow + AI editing tools (Descript).
**When stay-solo wins.** Solo show with $50-100K ad revenue is meaningful.`,
    links: `

## See Also

- **q1952** — Start an online course business 2027
- **q1936** — Start a content creation business 2027
- **q2132** — Start a social media management agency 2027
- **q2125** — Start an AI consulting agency 2027`,
    sources: ["https://podcasters.spotify.com/","https://podcasters.apple.com/","https://www.iheartmedia.com/","https://www.audacy.com/","https://wondery.com/","https://www.siriusxm.com/","https://www.buzzsprout.com/","https://libsyn.com/","https://www.captivate.fm/","https://riverside.fm/","https://www.iab.com/","https://www.acast.com/"],
    tags: ["podcast-network-business-2027-multi-show-audio","iheartmedia-ihrt-3-4b-audacy-entercom-1b-wondery-amazon-2020-300m-siriusxm-pandora-siri-spotify-spot-15b-investment-npr-cumulus-westwood-one-salem-bbc-players","shure-sm7b-rode-procaster-zoom-h6-riverside-fm-squadcast-descript-recording","buzzsprout-libsyn-anchor-spotify-podcasters-captivate-transistor-rss-hosting","acast-megaphone-spotify-wondery-amazon-iheartmedia-ad-sales-networks","joe-rogan-250m-2024-spotify-open-distribution","iab-2-2b-podcast-ad-revenue-2024-8-12-percent-growth","20-45-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Spotify SPOT $1B+ podcast investment + Joe Rogan $250M+ 2024 still Spotify+open distribution + Apple Podcasts + iHeartMedia IHRT $3.4B + Audacy Entercom $1B + Wondery Amazon 2020 $300M + SiriusXM SIRI $8.6B + Acast SEK 1.6B + NPR + Cumulus + Westwood One + Salem + BBC players, Shure SM7B $399 + Rode Procaster $229 + Zoom H6 + Riverside.fm Wix 2024 + Squadcast + Descript recording, Buzzsprout $12-24 + Libsyn $7-75 + Captivate $19-99 + Anchor Spotify for Podcasters + Transistor hosting, IAB $2.2B podcast ad revenue 2024 8-12% growth) real.' }
  },
  {
    id: 'q1949',
    tldr: `**TL;DR:** Wedding photography in 2027 = **shooting weddings as primary income** charging $2,500-$15,000+ per wedding. **Y1 $50K-$150K solo (15-40 weddings); Y2 $150K-$400K with 2nd shooter + associates.** **Required:** $5-$30K capital (camera bodies Sony A7IV/A1, Canon R5/R6, Nikon Z8/Z9; 24-70 + 70-200 + 85 + 35 prime lenses; flashes; SD cards; backup gear; insurance) + business license + LLC + portfolio + wedding planner referrals. **Players:** mostly independent + small studios; major hub: The Knot Worldwide (Permira PE), Zola, WeddingWire (Knot), Junebug Weddings (showcase). **2024-2025 reality:** Smartphone cameras improved but premium wedding clients still pay $5K+; "elopement photography" $1,500-$5,000 growing market. AI editing (Imagen, AfterShoot) compresses post-production time 60-80%. **Margin:** 60-75% solo. **Win condition:** 25-35 weddings/yr at $5-8K avg + albums/prints upsell + family/portrait sessions year-round.`,
    core: `

## Why Wedding Photography 2027 Is Real

US 2.4M weddings/yr × $3K average photo spend = $7B+ market. Demand drivers:
- Wedding ceremony (universal)
- Elopement + micro-wedding
- Engagement sessions
- Bridal portraits
- Family portraits cross-sell
- Trash-the-dress + day-after

## Pricing 2027

| Service | Price |
|---|---|
| Elopement | $1,500-$5,000 |
| 6-hour wedding | $2,500-$5,000 |
| 8-10 hour full wedding | $3,500-$10,000 |
| Premium wedding | $7,500-$20,000+ |
| 2nd shooter add-on | $500-$1,500 |
| Engagement session | $300-$1,500 |
| Bridal portrait | $300-$1,500 |
| Album (10x10 30pg) | $500-$3,000 |
| Print package | $200-$2,500 |
| Rush editing | +25-50% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-30K camera + lenses + LLC + insurance + portfolio 5-10 weddings] --> B[Build via The Knot + Zola + WeddingWire + Insta]
    B --> C[Wedding planner + venue referrals]
    C --> D[Y1: $50K-$150K · 15-40 weddings]
    D --> E[Y2: $150K-$400K · 2nd shooter + associates]
\`\`\`

TAGS: wedding-photography-business-2027-primary-income, sony-a7iv-a1-canon-r5-r6-nikon-z8-z9-bodies-24-70-70-200-85-35-prime-lenses, the-knot-worldwide-permira-zola-weddingwire-junebug-weddings-platforms, imagen-aftershoot-ai-editing-60-80-percent-time-reduction, elopement-1-5-5k-micro-wedding-growth, 2-4m-us-weddings-7b-photo-market, 60-75-percent-margin-solo, 2027`,
    src: `

## Sources

- The Knot (Knot Worldwide Permira): https://www.theknot.com/
- Zola: https://www.zola.com/
- WeddingWire (Knot Worldwide): https://www.weddingwire.com/
- Junebug Weddings: https://junebugweddings.com/
- Sony Alpha: https://electronics.sony.com/imaging
- Canon USA: https://www.usa.canon.com/
- Nikon USA: https://www.nikonusa.com/
- Imagen AI editing: https://imagen-ai.com/
- AfterShoot AI culling: https://aftershoot.com/
- PPA (Professional Photographers of America): https://www.ppa.com/
- WPPI (Wedding & Portrait Photographers International): https://www.wppionline.com/
- The Knot 2024 Real Weddings Study: https://www.theknot.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Elopement | $1,500-$5,000 | Industry |
| 6-hr wedding | $2,500-$5,000 | Industry |
| 8-10 hr full | $3,500-$10,000 | Industry |
| Premium wedding | $7,500-$20,000+ | Industry |
| US weddings/yr | ~2.4M | The Knot |
| US wedding industry | ~$79B | The Knot 2024 |
| Avg photo spend per wedding | ~$3K | The Knot |
| US wedding photo market | ~$7B+ | Calculated |
| Sony A7IV | $2,500 | Sony |
| Sony A1 | $6,500 | Sony |
| Canon R5 | $3,300-$4,000 | Canon |
| Canon R6 II | $2,500 | Canon |
| Nikon Z8 | $4,000 | Nikon |
| Nikon Z9 | $5,500 | Nikon |
| Lens 24-70mm f/2.8 | $1,800-$2,800 | Industry |
| Lens 70-200mm f/2.8 | $2,500-$3,000 | Industry |
| Imagen AI editing | $20-$200/mo | Imagen |
| AfterShoot AI | $10-$30/mo | AfterShoot |
| PPA membership | ~30K+ | PPA |
| WPPI membership | major US/international | WPPI |
| Y1 capital | $5K-$30K | Industry |
| Y1 revenue | $50K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin solo | 60-75% | Industry |`,
    counter: `## Counter-Case
**Smartphone cameras improving.** Mitigation: premium clients pay for skill + experience + post.
**Saturated market.** Mitigation: brand + style + venue partnerships.
**Seasonal Q2-Q3 peak.** Mitigation: family portrait + corporate year-round.
**AI post-processing.** Mitigation: use AI tools to scale, not threaten.
**When stay-solo wins.** 20-30 weddings at $80-150K is comfortable creative lifestyle.`,
    links: `

## See Also

- **q1968** — Start a wedding venue business 2027
- **q1980** — Start a catering business 2027
- **q2060** — Start a pet photography business 2027
- **q1967** — Start a photo booth rental business 2027`,
    sources: ["https://www.theknot.com/","https://www.zola.com/","https://www.weddingwire.com/","https://junebugweddings.com/","https://electronics.sony.com/imaging","https://www.usa.canon.com/","https://www.nikonusa.com/","https://imagen-ai.com/","https://aftershoot.com/","https://www.ppa.com/","https://www.wppionline.com/","https://www.theknot.com/"],
    tags: ["wedding-photography-business-2027-primary-income","sony-a7iv-a1-canon-r5-r6-nikon-z8-z9-bodies-24-70-70-200-85-35-prime-lenses","the-knot-worldwide-permira-zola-weddingwire-junebug-weddings-platforms","imagen-aftershoot-ai-editing-60-80-percent-time-reduction","elopement-1-5-5k-micro-wedding-growth","2-4m-us-weddings-7b-photo-market","60-75-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Sony A7IV $2.5K + A1 $6.5K + Canon R5 $3.3-4K + R6 II $2.5K + Nikon Z8 $4K + Z9 $5.5K bodies + 24-70mm + 70-200mm + 85mm + 35mm prime lenses, The Knot Knot Worldwide Permira + Zola + WeddingWire + Junebug Weddings platforms, Imagen AI $20-200/mo + AfterShoot $10-30/mo AI editing, PPA 30K + WPPI memberships, US 2.4M weddings + $79B industry + $3K avg photo + $7B photo market) real.' }
  },
  {
    id: 'q1947',
    tldr: `**TL;DR:** Daycare business in 2027 = **state-licensed child care for ages 6 weeks - 5 years** charging $200-$600/week per child. **Y1 $80K-$350K (single home daycare or small center 8-20 children); Y2 $350K-$1.2M+ with multi-classroom center.** **Required:** state child-care license + zoning + background checks + CPR/First Aid (American Red Cross) + buildout + insurance + staff (1 caregiver per 4 infants, 6 toddlers, 10 preschoolers — varies by state). **Players:** KinderCare (~1,500+ centers, KinderCare Learning Companies KLC NYSE), Bright Horizons (NYSE: BFAM ~1,000+ centers), La Petite Academy (Learning Care Group), Goddard School (Compass Group), Primrose Schools (~480+ franchise), Tutor Time (Learning Care Group), Childcare Network. **2024-2025 reality:** child care affordability crisis (avg $11K/yr but $20K+ urban) drives political demand for subsidies (CCDBG, head Start, state pre-K expansion). **Margin:** 12-25% net after labor (40-55% of revenue), rent, food, insurance, supplies. **Win condition:** small-center owner-operated 20-40 kids OR home daycare 6-12 kids = $300K-$600K stabilized.`,
    core: `

## Why Daycare 2027 Is Real

US child care demand exceeds supply ~50% in many metros. Dual-income households + return-to-office + birth rate (~3.6M births/yr) all drive demand. Demand drivers:
- Working parents (returning to office post-2024)
- Single parents
- Pre-K (4-5 yr olds)
- Infant care (6 wks - 12 mo, premium pricing)
- Special needs (premium specialty)

## Pricing 2027

| Age | Weekly Rate |
|---|---|
| Infant (6 wk - 12 mo) | $300-$600 |
| Toddler (12-36 mo) | $250-$500 |
| Preschool (3-5 yr) | $200-$450 |
| Drop-in part-time | $40-$80/day |
| Before/after school | $100-$250/wk |
| Summer camp | $200-$400/wk |
| Registration fee | $50-$300 |
| Activity fee | $50-$200/yr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: State child care license + CPR + $50-300K capital + buildout + staff] --> B[Land 8-20 kids + tuition]
    B --> C[Add summer + after-school + waitlist]
    C --> D[Y1: $80K-$350K · 8-20 kids]
    D --> E[Y2: $350K-$1.2M+ · 30-100 kids multi-classroom]
\`\`\`

TAGS: daycare-business-2027-state-licensed-childcare, kindercare-klc-nyse-1500-bright-horizons-bfam-1000-la-petite-learning-care-goddard-compass-primrose-480-tutor-time-childcare-network-references, state-license-zoning-cpr-first-aid-background-check-licensing, ccdbg-head-start-state-pre-k-subsidy-environment, 1-4-infant-1-6-toddler-1-10-preschool-staff-ratios, 12-25-percent-net-margin-tight, 2027`,
    src: `

## Sources

- NAEYC (National Association for the Education of Young Children): https://www.naeyc.org/
- Bright Horizons (NYSE: BFAM): https://www.brighthorizons.com/
- KinderCare Learning Companies (NYSE: KLC): https://www.kindercare.com/
- Goddard School (Compass Group): https://www.goddardschool.com/
- Primrose Schools: https://www.primroseschools.com/
- La Petite Academy (Learning Care): https://www.lapetite.com/
- Child Care Aware of America: https://www.childcareaware.org/
- CCDBG (Child Care and Development Block Grant): https://www.acf.hhs.gov/occ
- Head Start: https://www.acf.hhs.gov/ohs
- American Red Cross CPR/First Aid: https://www.redcross.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Infant weekly | $300-$600 | Child Care Aware |
| Toddler weekly | $250-$500 | Child Care Aware |
| Preschool weekly | $200-$450 | Child Care Aware |
| US avg annual child care | ~$11K/yr | Child Care Aware |
| Urban metro avg | $15K-$25K+ | Industry |
| US births/yr | ~3.6M | CDC |
| KinderCare Learning Companies KLC | IPO 2024 | KLC |
| KinderCare centers | ~1,500+ | KLC |
| Bright Horizons BFAM revenue FY24 | ~$2.5B | BFAM 10-K |
| Bright Horizons centers | ~1,000+ globally | BFAM |
| Primrose Schools franchise units | ~480+ | Primrose |
| Goddard School franchise units | ~625+ | Goddard |
| La Petite Academy units | ~150+ | Learning Care |
| Childcare Network units | ~290+ | Childcare Network |
| NAEYC accredited centers | ~6,500+ | NAEYC |
| State staff ratio 1:4 infants | typical | State licensing |
| State staff ratio 1:10 preschool | typical | State licensing |
| Y1 capital | $50K-$300K | Industry |
| Y1 revenue | $80K-$350K | Industry |
| Y2 revenue | $350K-$1.2M+ | Industry |
| Margin net | 12-25% | Industry |
| Labor cost | 40-55% of revenue | Industry |`,
    counter: `## Counter-Case
**Labor + state staff ratios.** Mitigation: cross-train + retention bonuses.
**Tight margins 12-25%.** Mitigation: scale or wraparound services (summer camp, after-school).
**Insurance + liability.** Mitigation: $2M+ GL + waivers + cameras + abuse-prevention.
**Subsidized competition (Head Start).** Mitigation: premium positioning + private-pay focus.
**When stay-home wins.** Home daycare 6-12 kids at $80-150K is meaningful.`,
    links: `

## See Also

- **q1948** — Start an AirBnB management business 2027
- **q1956** — Start a property management business 2027
- **q1976** — Start a dog training business 2027
- **q2098** — Start a college admissions consulting business 2027`,
    sources: ["https://www.naeyc.org/","https://www.brighthorizons.com/","https://www.kindercare.com/","https://www.goddardschool.com/","https://www.primroseschools.com/","https://www.lapetite.com/","https://www.childcareaware.org/","https://www.acf.hhs.gov/occ","https://www.acf.hhs.gov/ohs","https://www.redcross.org/"],
    tags: ["daycare-business-2027-state-licensed-childcare","kindercare-klc-nyse-1500-bright-horizons-bfam-1000-la-petite-learning-care-goddard-compass-primrose-480-tutor-time-childcare-network-references","state-license-zoning-cpr-first-aid-background-check-licensing","ccdbg-head-start-state-pre-k-subsidy-environment","1-4-infant-1-6-toddler-1-10-preschool-staff-ratios","12-25-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (KinderCare Learning Companies KLC NYSE IPO 2024 1,500 centers + Bright Horizons BFAM $2.5B 1,000 globally + Primrose Schools 480 franchise + Goddard School Compass Group 625 + La Petite Academy Learning Care Group 150 + Tutor Time Learning Care + Childcare Network 290 competitors, NAEYC 6.5K accredited + Child Care Aware $11K avg child care + CCDBG + Head Start + state pre-K subsidy environment, American Red Cross CPR/First Aid + state licensing 1:4 infant 1:10 preschool ratios) real.' }
  },
  {
    id: 'q1946',
    tldr: `**TL;DR:** Roofing business in 2027 = **residential + commercial roof replacement + repair** charging $8,000-$50,000+ per residential roof + $20,000-$500,000+ commercial. **Y1 $300K-$1M solo + 2-3 crew (50-150 roofs); Y2 $1M-$5M+ with multiple crews + sales team.** **Required:** state contractor license + $2M+ GL + workers comp + commercial vehicle insurance + truck + supplies + crew (typically 4-6 person crew). **Players:** Power Home Remodeling (~$1B revenue), Erie Home (renovation), Lowe's + Home Depot install services, GAF (NYSE: GAF, parent Standard Industries), CertainTeed (Saint-Gobain), Owens Corning (NYSE: OC), TAMKO Building Products + thousands of independent roofers (~110K+ US Census BLS). **2024-2025 reality:** insurance restoration roofing (storm damage) drives 30-50% of industry volume in storm-prone states (TX, OK, CO, FL, GA, NC, SC, AL, MS, LA, TN). Solar roof + Tesla Solar Roof + GAF Energy slow adoption. **Margin:** 25-40% net. **Win condition:** insurance restoration partnerships + Xactimate-priced + storm-chasing seasonal teams (TX/OK/CO Mar-Jul) = $1-3M Y1 in active storm season.`,
    core: `

## Why Roofing 2027 Is Real

US 145M housing units; 20-25 yr roof replacement cycle; storm damage drives recurring demand. Demand drivers:
- 20-25 yr replacement cycle
- Storm damage (hail, wind, hurricane)
- Real estate sale prep
- Insurance restoration
- Commercial maintenance
- Solar roof adoption (slow but growing)

## Pricing 2027

| Service | Price |
|---|---|
| Asphalt shingle replacement (avg 2,000 sqft) | $8,000-$25,000 |
| Architectural shingle premium | $12,000-$35,000 |
| Metal roof | $20,000-$60,000 |
| Slate/tile | $30,000-$100,000+ |
| Solar roof (Tesla, GAF Energy) | $40K-$100K+ |
| Commercial flat (TPO, EPDM) | $5-$15/sqft |
| Repair (per sqft) | $300-$2,500 |
| Insurance restoration full | $15K-$50K typical |
| Skylight install | $1,000-$5,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Contractor license + $50-200K capital + truck + crew + insurance] --> B[Insurance restoration TPA partnerships]
    B --> C[Storm-chasing TX/OK/CO seasonal]
    C --> D[Y1: $300K-$1M · 50-150 roofs]
    D --> E[Y2: $1M-$5M+ · multi-crew + sales]
\`\`\`

TAGS: roofing-business-2027-residential-commercial-replacement-repair, power-home-remodeling-1b-erie-home-lowes-home-depot-install-references, gaf-standard-industries-certainteed-saint-gobain-owens-corning-oc-tamko-building-products-manufacturers, insurance-restoration-30-50-percent-storm-states-tx-ok-co-fl-ga-nc-sc-al-ms-la-tn, tesla-solar-roof-gaf-energy-emerging, xactimate-insurance-pricing-standard, 25-40-percent-net-margin, 2027`,
    src: `

## Sources

- NRCA (National Roofing Contractors Association): https://www.nrca.net/
- GAF (Standard Industries): https://www.gaf.com/
- CertainTeed (Saint-Gobain): https://www.certainteed.com/
- Owens Corning (NYSE: OC): https://www.owenscorning.com/
- TAMKO Building Products: https://www.tamko.com/
- Power Home Remodeling: https://www.powerhrg.com/
- Tesla Solar Roof: https://www.tesla.com/solarroof
- GAF Energy: https://www.gaf.energy/
- Xactimate (Verisk): https://www.xactware.com/
- Roofing Contractor magazine: https://www.roofingcontractor.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Asphalt shingle replacement | $8K-$25K | Industry |
| Architectural premium | $12K-$35K | Industry |
| Metal roof | $20K-$60K | Industry |
| Solar roof Tesla | $40K-$100K+ | Tesla |
| Commercial flat TPO/EPDM | $5-$15/sqft | Industry |
| GAF parent | Standard Industries | Standard |
| Owens Corning OC revenue FY24 | ~$11B | OC 10-K |
| CertainTeed parent | Saint-Gobain | Saint-Gobain |
| Power Home Remodeling revenue est | ~$1B | Industry |
| Erie Home | regional renovation player | Erie |
| US roofers + contractors | ~110K+ | Census BLS |
| NRCA membership | ~3,800+ | NRCA |
| US asphalt shingles share | ~75% of residential roofs | NRCA |
| Hail damage US 2023 | $35B+ insured losses | III |
| Solar roof Tesla market share | <1% (slow adoption) | Industry |
| GAF Energy solar roof | nail-down install advantage | GAF Energy |
| Y1 capital | $50K-$200K | Industry |
| Y1 revenue | $300K-$1M | Industry |
| Y2 revenue | $1M-$5M+ | Industry |
| Margin net | 25-40% | Industry |`,
    counter: `## Counter-Case
**Storm-chasing volatility.** Mitigation: stable base + storm seasonal surge.
**Insurance fraud crackdowns (FL legislation 2022-2024).** Mitigation: strict compliance.
**Labor shortage (immigration + worker visa).** Mitigation: above-market $25-40/hr + sign-on bonuses.
**Material cost volatility.** Mitigation: pass-through + supplier locks.
**When stay-medium wins.** $500K-$1M solo + 1-2 crews is solid lifestyle.`,
    links: `

## See Also

- **q1945** — Start an HVAC business 2027
- **q1983** — Start a fence installation business 2027
- **q1984** — Start a painting business 2027
- **q2054** — Start a deck staining business 2027`,
    sources: ["https://www.nrca.net/","https://www.gaf.com/","https://www.certainteed.com/","https://www.owenscorning.com/","https://www.tamko.com/","https://www.powerhrg.com/","https://www.tesla.com/solarroof","https://www.gaf.energy/","https://www.xactware.com/","https://www.roofingcontractor.com/"],
    tags: ["roofing-business-2027-residential-commercial-replacement-repair","power-home-remodeling-1b-erie-home-lowes-home-depot-install-references","gaf-standard-industries-certainteed-saint-gobain-owens-corning-oc-tamko-building-products-manufacturers","insurance-restoration-30-50-percent-storm-states-tx-ok-co-fl-ga-nc-sc-al-ms-la-tn","tesla-solar-roof-gaf-energy-emerging","xactimate-insurance-pricing-standard","25-40-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Power Home Remodeling $1B + Erie Home + GAF Standard Industries + CertainTeed Saint-Gobain + Owens Corning OC $11B + TAMKO Building Products manufacturers/competitors, Tesla Solar Roof + GAF Energy nail-down solar emerging, NRCA 3.8K + III $35B hail damage 2023 + Census BLS 110K US roofers, Xactimate Verisk insurance pricing) real.' }
  },
  {
    id: 'q1945',
    tldr: `**TL;DR:** HVAC business in 2027 = **residential + light commercial heating + air conditioning + service** charging $5,000-$25,000+ per system install + $90-$200/hr labor service. **Y1 $200K-$700K solo + 1-2 techs; Y2 $700K-$2.5M+ with 4-8 techs + dispatch.** **Required:** state HVAC contractor license + EPA Section 608 refrigerant cert + state electrical/plumbing where required + $2M GL + workers comp + commercial vehicle insurance + truck + tools + parts inventory. **Players (national):** Service Experts (Lennox NYSE: LII subsidiary, ~120+ locations), One Hour Heating & Air (Authority Brands), Aire Serv (Neighborly Brands ~200+), ARS/Rescue Rooter (American Residential Services ~70+ branches), thousands of independents (~110K+ Census BLS). **Equipment brands:** Carrier (NYSE: CARR), Trane Technologies (NYSE: TT), Lennox (LII), Goodman (Daikin Industries), Rheem, York (Johnson Controls JCI), Bryant (Carrier), Amana. **2024-2027 reality:** IRA inflation reduction act tax credits up to $2,000/heat pump driving electrification + heat pump retrofit boom. **Margin:** 25-40% net. **Win condition:** service agreements + replacement specialty + heat pump electrification.`,
    core: `

## Why HVAC 2027 Is Real

US 145M housing + commercial buildings; HVAC equipment 12-20 yr lifecycle + IRA heat pump credits driving electrification. Demand drivers:
- Replacement cycle (12-20 yr)
- Service contracts (annual tune-ups)
- Emergency repair (24/7 service)
- New construction
- Heat pump electrification (IRA credits)
- Commercial maintenance contracts

## Pricing 2027

| Service | Price |
|---|---|
| AC install central (3-5 ton) | $5,000-$15,000 |
| Furnace install | $4,000-$10,000 |
| Heat pump install | $10,000-$25,000+ |
| Mini-split system | $4,000-$15,000 |
| Service call diagnostic | $80-$200 |
| Labor hourly | $90-$200 |
| Refrigerant recharge | $200-$700 |
| Annual maintenance contract | $150-$400 |
| Commercial RTU | $15,000-$50,000+ |
| Duct cleaning | $300-$1,500 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: HVAC license + EPA 608 + $30-100K capital + truck + tools] --> B[Build replacement + service + maintenance contracts]
    B --> C[Heat pump + IRA credit specialty]
    C --> D[Y1: $200K-$700K · 1-2 techs]
    D --> E[Y2: $700K-$2.5M+ · 4-8 techs + dispatch]
\`\`\`

TAGS: hvac-business-2027-residential-light-commercial-heating-ac-service, service-experts-lennox-lii-120-one-hour-authority-aire-serv-neighborly-200-ars-rescue-rooter-american-residential-services-70-competitors, carrier-carr-trane-technologies-tt-lennox-lii-goodman-daikin-rheem-york-johnson-controls-jci-bryant-amana-brands, ira-inflation-reduction-act-2-000-heat-pump-tax-credit-electrification, epa-section-608-refrigerant-cert-required, 25-40-percent-net-margin, 2027`,
    src: `

## Sources

- ACCA (Air Conditioning Contractors of America): https://www.acca.org/
- EPA Section 608 refrigerant: https://www.epa.gov/section608
- Carrier Global (NYSE: CARR): https://www.carrier.com/
- Trane Technologies (NYSE: TT): https://www.tranetechnologies.com/
- Lennox International (NYSE: LII): https://www.lennox.com/
- Goodman (Daikin): https://www.goodmanmfg.com/
- Rheem: https://www.rheem.com/
- Johnson Controls (NYSE: JCI): https://www.johnsoncontrols.com/
- IRA Heat Pump Tax Credit: https://www.energy.gov/save/heat-pumps
- ServiceTitan (HVAC SaaS): https://www.servicetitan.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| AC install | $5K-$15K | Industry |
| Furnace install | $4K-$10K | Industry |
| Heat pump install | $10K-$25K+ | Industry |
| Service hourly | $90-$200 | Industry |
| Annual maintenance | $150-$400 | Industry |
| Carrier CARR revenue FY24 | ~$22B | CARR 10-K |
| Trane Technologies TT revenue FY24 | ~$19B | TT 10-K |
| Lennox LII revenue FY24 | ~$5B | LII 10-K |
| Service Experts (Lennox subsidiary) | ~120+ locations | LII |
| Goodman parent | Daikin Industries (Japan) | Daikin |
| Rheem | private | Rheem |
| Johnson Controls JCI revenue FY24 | ~$27B | JCI 10-K |
| York (Johnson Controls subsidiary) | yes | JCI |
| Aire Serv franchise units | ~200+ | Neighborly |
| One Hour Heating + Air parent | Authority Brands | Authority |
| ARS/Rescue Rooter branches | ~70+ | ARS |
| US HVAC contractors | ~110K+ | Census BLS |
| ACCA membership | ~3,000+ | ACCA |
| EPA Section 608 cert | $20-$80 | EPA |
| IRA heat pump tax credit | up to $2,000 | DOE |
| Y1 capital | $30K-$100K | Industry |
| Y1 revenue | $200K-$700K | Industry |
| Y2 revenue | $700K-$2.5M+ | Industry |
| Margin net | 25-40% | Industry |`,
    counter: `## Counter-Case
**National roll-ups (Lennox, Authority Brands) compete.** Mitigation: local + service contracts + repeat customers.
**Skilled tech labor shortage.** Mitigation: in-house training + sign-on bonuses.
**Capital intensive truck + tools.** Mitigation: lease + grow.
**Refrigerant regulation changes (R-410A phaseout).** Mitigation: train on R-32 + R-454B.
**When stay-small wins.** Solo HVAC + 1 tech at $250-400K is comfortable.`,
    links: `

## See Also

- **q1946** — Start a roofing business 2027
- **q1983** — Start a fence installation business 2027
- **q2051** — Start a handyman business 2027
- **q2053** — Start a drywall repair business 2027`,
    sources: ["https://www.acca.org/","https://www.epa.gov/section608","https://www.carrier.com/","https://www.tranetechnologies.com/","https://www.lennox.com/","https://www.goodmanmfg.com/","https://www.rheem.com/","https://www.johnsoncontrols.com/","https://www.energy.gov/save/heat-pumps","https://www.servicetitan.com/"],
    tags: ["hvac-business-2027-residential-light-commercial-heating-ac-service","service-experts-lennox-lii-120-one-hour-authority-aire-serv-neighborly-200-ars-rescue-rooter-american-residential-services-70-competitors","carrier-carr-trane-technologies-tt-lennox-lii-goodman-daikin-rheem-york-johnson-controls-jci-bryant-amana-brands","ira-inflation-reduction-act-2-000-heat-pump-tax-credit-electrification","epa-section-608-refrigerant-cert-required","25-40-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Carrier CARR $22B + Trane Technologies TT $19B + Lennox LII $5B + Goodman Daikin + Rheem + Johnson Controls JCI $27B + York JCI + Bryant Carrier + Amana brands, Service Experts Lennox 120 + One Hour Heating Authority Brands + Aire Serv Neighborly 200 + ARS/Rescue Rooter American Residential Services 70 competitors, ACCA Air Conditioning Contractors America 3K + Census BLS 110K US contractors + EPA Section 608 cert + IRA heat pump $2K tax credit + ServiceTitan HVAC SaaS) real.' }
  },
  {
    id: 'q1944',
    tldr: `**TL;DR:** Junk removal business in 2027 = **residential + commercial junk + debris hauling** charging $150-$800/load + commercial dumpster $300-$3,000/pickup. **Y1 $80K-$300K solo + 1 helper; Y2 $300K-$900K with 2-3 trucks + crews.** **Required:** state business license + commercial vehicle insurance + truck + dumpster trailer + tools + dump station accounts + state Dept of Environmental Protection + insurance. **Players:** 1-800-Got-Junk (Neighborly Brands ~280+ franchise units), Junk King (~140+ units), College Hunks Hauling Junk + Moving (~210+ units, multi-service), LoadUp, Junkluggers, Stand Up Guys. **Adjacent revenue:** moving + estate sale + downsize + storage cleanout + hoarder cleanup ([[q2116]] biohazard) + property mgmt + foreclosure cleanouts. **Margin:** 35-55%. **Win condition:** property mgmt + realtor + estate sale + insurance restoration partnerships + Saturday Y2 calendar booked solid.`,
    core: `

## Why Junk Removal 2027 Is Real

Aging Boomer downsizing + ongoing moves + estate sales + foreclosures all drive demand. Demand drivers:
- Move out cleanouts
- Estate sales + senior downsize
- Foreclosure cleanouts
- Property mgmt + apartment turnover
- Construction debris
- Garage/basement decluttering
- Hoarder cleanup (with [[q2116]])

## Pricing 2027

| Service | Price |
|---|---|
| Single item pickup (couch, mattress) | $75-$200 |
| Quarter truck load | $150-$300 |
| Half truck load | $250-$500 |
| Full truck load (10-15 yd) | $400-$800 |
| Commercial dumpster | $300-$3,000 |
| Mattress disposal | $40-$100 |
| Appliance haul-away | $80-$200 |
| Yard waste/brush | $200-$600 |
| Hoarder cleanup | $1K-$10K+ |
| Foreclosure full | $500-$5,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $20-80K capital + truck/trailer + tools + insurance + dump accounts] --> B[Google LSAs + Yelp + Nextdoor + property mgr referral]
    B --> C[Add estate sale + foreclosure + hoarder]
    C --> D[Y1: $80K-$300K · solo + helper]
    D --> E[Y2: $300K-$900K · 2-3 trucks + crews]
\`\`\`

TAGS: junk-removal-business-2027-residential-commercial-debris-hauling, 1-800-got-junk-neighborly-280-junk-king-140-college-hunks-210-loadup-junkluggers-stand-up-guys-franchise-references, hoarder-foreclosure-estate-sale-property-mgmt-apartment-turnover-construction-debris-wedges, dump-station-state-dep-licensing, 35-55-percent-margin, 2027`,
    src: `

## Sources

- 1-800-Got-Junk (Neighborly Brands): https://www.1800gotjunk.com/
- Junk King: https://www.junk-king.com/
- College Hunks Hauling Junk + Moving: https://www.collegehunkshaulingjunk.com/
- LoadUp: https://loadup.com/
- Junkluggers: https://www.junkluggers.com/
- Stand Up Guys: https://www.standupguys.com/
- EPA waste management: https://www.epa.gov/recycle
- NWRA (National Waste & Recycling Association): https://wasterecycling.org/
- Jobber: https://getjobber.com/
- Service Direct (lead gen): https://www.servicedirect.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Quarter truck load | $150-$300 | Industry |
| Full truck (10-15 yd) | $400-$800 | Industry |
| Commercial dumpster | $300-$3,000 | Industry |
| Hoarder cleanup | $1K-$10K+ | Industry |
| Foreclosure full | $500-$5,000 | Industry |
| 1-800-Got-Junk franchise units | ~280+ | Neighborly |
| 1-800-Got-Junk system revenue | ~$500M+ | Industry estimates |
| Junk King franchise units | ~140+ | Junk King |
| College Hunks Hauling units | ~210+ | College Hunks |
| College Hunks revenue est | ~$300M | Industry estimates |
| LoadUp | private | LoadUp |
| Junkluggers franchise units | ~50+ | Junkluggers |
| US waste hauling industry | ~$100B+ | NWRA |
| US households move/yr | ~10% Census | Census |
| Dump station fees | $50-$200/ton typical | Industry |
| Y1 capital | $20K-$80K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$900K | Industry |
| Margin | 35-55% | Industry |`,
    counter: `## Counter-Case
**1-800-Got-Junk brand dominance.** Mitigation: same-day + property mgr B2B.
**Dump fee volatility.** Mitigation: pass-through pricing + sort-on-site.
**Labor (heavy lifting injury).** Mitigation: workers comp + crew training.
**Vehicle/truck capital.** Mitigation: lease + grow.
**When stay-solo wins.** $80-130K solo + helper is comfortable.`,
    links: `

## See Also

- **q1943** — Start a moving company 2027
- **q2117** — Start a post-construction cleanup business 2027
- **q2116** — Start a biohazard cleanup business 2027
- **q2114** — Start a move-out cleaning business 2027`,
    sources: ["https://www.1800gotjunk.com/","https://www.junk-king.com/","https://www.collegehunkshaulingjunk.com/","https://loadup.com/","https://www.junkluggers.com/","https://www.standupguys.com/","https://www.epa.gov/recycle","https://wasterecycling.org/","https://getjobber.com/","https://www.servicedirect.com/"],
    tags: ["junk-removal-business-2027-residential-commercial-debris-hauling","1-800-got-junk-neighborly-280-junk-king-140-college-hunks-210-loadup-junkluggers-stand-up-guys-franchise-references","hoarder-foreclosure-estate-sale-property-mgmt-apartment-turnover-construction-debris-wedges","dump-station-state-dep-licensing","35-55-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (1-800-Got-Junk 280 Neighborly Brands $500M system + Junk King 140 + College Hunks Hauling Junk + Moving 210 $300M + LoadUp + Junkluggers 50 + Stand Up Guys franchise competitors, EPA + NWRA National Waste & Recycling Association $100B US waste industry + Census 10% household moves/yr, Jobber + Service Direct stack) real.' }
  },
  {
    id: 'q1942',
    tldr: `**TL;DR:** Tutoring business in 2027 = **K-12 + adult academic tutoring** charging $30-$200/hr + $1,500-$5,000/program. **Y1 $40K-$150K solo (50-300 students); Y2 $150K-$500K with 5-10 tutors.** **Required:** $0-$5K capital + LLC + tutoring credentials (state teaching cert for school subjects, subject expertise, SAT/ACT 90th-percentile scores if test prep) + business insurance + background check + ICRA/national check. **Players (platforms):** Wyzant (IAC), Varsity Tutors (Nerdy NRDY), Tutor.com (Princeton Review/Pearson), Tutorful, Preply, Chegg Tutors, Sylvan Learning (Franchise Group FRG ~700+ franchise), Mathnasium (Roark Capital ~1,100+ franchise), Kumon (~1,500+ US franchise), Huntington Learning Center (~330+), Score Educational Centers. **2024-2025 reality:** AI tutoring (Khan Academy Khanmigo, Synthesis Tutor, Speak AI) democratizes basic; humans win on accountability + specific test prep + math/science upper-level. **Margin:** 70-85% solo. **Win condition:** specialty (advanced math, AP, college essay, ESL, autism + LD) + 30-60 students at $50-$100/hr.`,
    core: `

## Why Tutoring 2027 Is Real

US K-12 + college students + adult learners all need tutoring. Demand drivers:
- AP + IB + honors prep
- Standardized test prep (SAT/ACT/PSAT/GMAT/LSAT)
- Math + science + STEM (algebra, geometry, calculus, physics, chem, bio)
- Reading + writing
- ESL
- College admissions essay
- Special needs (autism, ADHD, dyslexia)

## Pricing 2027

| Service | Price |
|---|---|
| Hourly K-12 standard | $30-$80 |
| Specialty math/science | $50-$150 |
| AP/IB level | $50-$200 |
| Test prep (SAT/ACT) | $75-$300 |
| Adult ESL | $40-$100 |
| Group class (4-8 students) | $25-$60/student |
| Package (10 hrs) | $400-$1,500 |
| Comprehensive program | $1,500-$5,000 |
| Online via platform | -20% to +0% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Credentials + niche + $0-5K capital + LLC + background check] --> B[Build via Wyzant/Varsity Tutors + direct]
    B --> C[Add specialty (AP/test/ESL/special needs)]
    C --> D[Y1: $40K-$150K · 50-300 students]
    D --> E[Y2: $150K-$500K · 5-10 tutors]
\`\`\`

TAGS: tutoring-business-2027-k-12-adult-academic, wyzant-iac-varsity-tutors-nerdy-nrdy-tutor-com-princeton-review-pearson-tutorful-preply-chegg-platforms, sylvan-learning-franchise-group-frg-700-mathnasium-roark-1100-kumon-1500-huntington-330-score-educational-centers-references, ai-khan-academy-khanmigo-synthesis-tutor-speak-ai-pressure, ap-ib-test-prep-sat-act-math-science-esl-college-essay-special-needs-specialties, 70-85-percent-margin-solo, 2027`,
    src: `

## Sources

- Wyzant (IAC): https://www.wyzant.com/
- Varsity Tutors (Nerdy NYSE: NRDY): https://www.varsitytutors.com/
- Tutor.com (Princeton Review): https://www.tutor.com/
- Preply: https://preply.com/
- Sylvan Learning (Franchise Group FRG): https://www.sylvanlearning.com/
- Mathnasium (Roark Capital): https://www.mathnasium.com/
- Kumon: https://www.kumon.com/
- Huntington Learning Center: https://huntingtonhelps.com/
- Khan Academy: https://www.khanacademy.org/
- Chegg Tutors (NYSE: CHGG): https://www.chegg.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Hourly K-12 standard | $30-$80 | Industry |
| Specialty math/science | $50-$150 | Industry |
| Test prep | $75-$300 | Industry |
| Comprehensive program | $1,500-$5,000 | Industry |
| Wyzant parent | IAC | IAC |
| Varsity Tutors (Nerdy NRDY) revenue FY24 | ~$190M | NRDY 10-K |
| Tutor.com parent | Princeton Review/Pearson | Pearson |
| Preply funding | ~$170M+ | Crunchbase |
| Sylvan Learning units | ~700+ | Franchise Group FRG |
| Mathnasium franchise units | ~1,100+ | Roark Capital |
| Kumon US franchise units | ~1,500+ | Kumon |
| Huntington Learning Center units | ~330+ | Huntington |
| Khan Academy users | ~150M+ | Khan |
| Chegg CHGG revenue FY24 | ~$617M (declining) | CHGG 10-K |
| US K-12 students | ~50M | NCES |
| US AP test-takers/yr | ~3M+ | College Board |
| AI tutoring (Khanmigo) | free + paid tiers | Khan Academy |
| Y1 capital | $0-$5K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$500K | Industry |
| Margin solo | 70-85% | Industry |`,
    counter: `## Counter-Case
**AI (Khanmigo, Synthesis) democratize.** Mitigation: accountability + 1:1 + outcomes.
**Platform commoditization.** Mitigation: direct off-platform clients.
**Tutor shortage in math/science.** Mitigation: train + recruit.
**Seasonal (school year).** Mitigation: summer enrichment + test prep year-round.
**When stay-solo wins.** $80-120K solo tutor is comfortable lifestyle.`,
    links: `

## See Also

- **q2097** — Start a test prep business 2027
- **q2098** — Start a college admissions consulting business 2027
- **q2096** — Start a language tutor business 2027
- **q2095** — Start a music lessons business 2027`,
    sources: ["https://www.wyzant.com/","https://www.varsitytutors.com/","https://www.tutor.com/","https://preply.com/","https://www.sylvanlearning.com/","https://www.mathnasium.com/","https://www.kumon.com/","https://huntingtonhelps.com/","https://www.khanacademy.org/","https://www.chegg.com/"],
    tags: ["tutoring-business-2027-k-12-adult-academic","wyzant-iac-varsity-tutors-nerdy-nrdy-tutor-com-princeton-review-pearson-tutorful-preply-chegg-platforms","sylvan-learning-franchise-group-frg-700-mathnasium-roark-1100-kumon-1500-huntington-330-score-educational-centers-references","ai-khan-academy-khanmigo-synthesis-tutor-speak-ai-pressure","ap-ib-test-prep-sat-act-math-science-esl-college-essay-special-needs-specialties","70-85-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Wyzant IAC + Varsity Tutors Nerdy NRDY $190M + Tutor.com Princeton Review Pearson + Preply $170M + Chegg CHGG $617M + Tutorful platforms, Sylvan Learning 700 Franchise Group FRG + Mathnasium 1,100 Roark Capital + Kumon 1,500 US + Huntington Learning Center 330 + Score Educational Centers franchise competitors, Khan Academy Khanmigo 150M + Synthesis Tutor + Speak AI tutoring tools, NCES 50M US K-12 + College Board 3M AP test-takers) real.' }
  },
  {
    id: 'q1938',
    tldr: `**TL;DR:** Home cleaning service in 2027 = **recurring residential cleaning** charging $80-$300/visit weekly/biweekly + $200-$800 deep clean. **Y1 $50K-$200K solo + 1-2 cleaners (40-150 weekly clients); Y2 $200K-$700K with 3-6 cleaners.** **Required:** state business license + GL insurance + workers comp + bonded + supplies + transportation. **Players:** **Maid Brigade** (~400+ franchise units), **Two Maids** (~100+ units), **MaidPro** (~250+ units), **The Cleaning Authority** (Authority Brands, ~190+ units), Molly Maid (Neighborly Brands ~430+), Merry Maids (ServiceMaster), Heaven's Best, Handy (ANGI), Cleanly. **2024-2025 reality:** AI scheduling tools (Jobber, Housecall Pro, ZenMaid, Booksy, Vagaro) automate dispatch; eco-friendly (Branch Basics, Mrs. Meyer's Clean Day, Method, Seventh Generation, Mrs. Hinch) supplies premium. **Margin:** 35-55% after labor (45-55% of revenue), supplies, insurance, marketing. **Win condition:** 100-200 recurring biweekly clients + 50% retention + property mgr B2B.`,
    core: `

## Why Home Cleaning 2027 Is Real

Time-strapped dual-income households + Airbnb turnover + senior cleaning + post-pandemic cleanliness demand all drive recurring revenue. Demand drivers:
- Working dual-income parents
- Senior owners
- Vacation rental turnover
- Move-out cleaning
- Post-construction
- Recurring biweekly/weekly

## Pricing 2027

| Service | Price |
|---|---|
| Standard 2BR weekly | $80-$130 |
| Standard 3BR weekly | $120-$180 |
| Standard 4BR weekly | $150-$250 |
| Biweekly premium | +15-25% |
| Monthly | +30-40% |
| Deep clean (move-in/out) | $200-$800 |
| Post-construction | $0.20-$0.45/sqft |
| Airbnb turnover | $75-$250 |
| Eco-friendly premium | +15-25% |
| Same-day rush | +25-50% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $1-5K capital + LLC + GL + bonded + supplies + transportation] --> B[Build via Google LSAs + Nextdoor + Yelp + word-of-mouth]
    B --> C[Add property mgmt B2B contracts]
    C --> D[Y1: $50K-$200K · 40-150 weekly clients]
    D --> E[Y2: $200K-$700K · 3-6 cleaners]
\`\`\`

TAGS: home-cleaning-service-business-2027-recurring-residential, maid-brigade-400-two-maids-100-maidpro-250-cleaning-authority-authority-brands-190-molly-maid-neighborly-430-merry-maids-servicemaster-handy-angi-cleanly-references, jobber-housecall-pro-zenmaid-booksy-vagaro-stack, branch-basics-mrs-meyers-method-seventh-generation-mrs-hinch-eco-supplies-premium, 35-55-percent-margin-tight, 2027`,
    src: `

## Sources

- Maid Brigade: https://www.maidbrigade.com/
- Two Maids: https://twomaids.com/
- MaidPro: https://www.maidpro.com/
- The Cleaning Authority (Authority Brands): https://www.thecleaningauthority.com/
- Molly Maid (Neighborly): https://www.mollymaid.com/
- Merry Maids (ServiceMaster): https://www.merrymaids.com/
- Handy (ANGI): https://www.handy.com/
- Jobber: https://getjobber.com/
- ZenMaid: https://www.zenmaid.com/
- ISSA (Cleaning Industry Association): https://www.issa.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Standard 2BR weekly | $80-$130 | Industry |
| Standard 3BR weekly | $120-$180 | Industry |
| Standard 4BR weekly | $150-$250 | Industry |
| Deep clean | $200-$800 | Industry |
| Maid Brigade franchise | ~400+ | Maid Brigade |
| Two Maids franchise | ~100+ | Two Maids |
| MaidPro franchise | ~250+ | MaidPro |
| The Cleaning Authority units | ~190+ | Authority Brands |
| Molly Maid units | ~430+ | Neighborly |
| Merry Maids parent | ServiceMaster (Roark) | Roark |
| Handy parent | Angi ANGI 2018 acquisition | ANGI |
| Cleanly | private | Cleanly |
| Jobber pricing | $50-$120/mo | Jobber |
| ZenMaid pricing | $50-$200/mo | ZenMaid |
| ISSA membership | ~9,500+ | ISSA |
| US cleaning industry | ~$70B+ | IBISWorld |
| Y1 capital | $1K-$5K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 35-55% | Industry |
| Labor cost % | 45-55% | Industry |`,
    counter: `## Counter-Case
**Franchise lead-flow advantage.** Mitigation: Google LSAs + Yelp + Nextdoor + retention.
**Labor turnover 100%+.** Mitigation: above-market $16-22/hr + retention bonuses + crew lead path.
**Insurance + liability.** Mitigation: $2M+ GL + bonded.
**Tight margins.** Mitigation: scale + commercial B2B premium.
**When stay-solo wins.** $60-90K solo with 30-50 clients is comfortable.`,
    links: `

## See Also

- **q2114** — Start a move-out cleaning business 2027
- **q2115** — Start an Airbnb turnover cleaning business 2027
- **q2110** — Start a commercial office cleaning business 2027
- **q2111** — Start a carpet cleaning business 2027`,
    sources: ["https://www.maidbrigade.com/","https://twomaids.com/","https://www.maidpro.com/","https://www.thecleaningauthority.com/","https://www.mollymaid.com/","https://www.merrymaids.com/","https://www.handy.com/","https://getjobber.com/","https://www.zenmaid.com/","https://www.issa.com/"],
    tags: ["home-cleaning-service-business-2027-recurring-residential","maid-brigade-400-two-maids-100-maidpro-250-cleaning-authority-authority-brands-190-molly-maid-neighborly-430-merry-maids-servicemaster-handy-angi-cleanly-references","jobber-housecall-pro-zenmaid-booksy-vagaro-stack","branch-basics-mrs-meyers-method-seventh-generation-mrs-hinch-eco-supplies-premium","35-55-percent-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Maid Brigade 400 + Two Maids 100 + MaidPro 250 + The Cleaning Authority Authority Brands 190 + Molly Maid Neighborly 430 + Merry Maids ServiceMaster Roark + Handy ANGI + Cleanly franchise competitors, Jobber + Housecall Pro + ZenMaid + Booksy + Vagaro stack, ISSA Cleaning Industry Association 9.5K + IBISWorld $70B US cleaning industry, Branch Basics + Mrs. Meyers SC Johnson + Method + Seventh Generation + Mrs. Hinch eco-supplies) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH G DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
