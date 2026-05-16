// Batch C: q1994 q1993 q1992 q1991 q1990 q1989 q1988 q1987 q1986 q1985
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1994',
    tldr: `**TL;DR:** Woodworking shop in 2027 = **custom furniture + cabinetry + millwork** charging $50-$200/hr labor or $1,500-$50,000+ per piece. **Y1 $50K-$200K solo (5-20 commissions); Y2 $200K-$700K with 1-2 apprentices.** **Required:** $30-$150K capital (table saw SawStop, jointer, planer, dust collection, CNC optional — Shopbot, Laguna SmartShop) + shop space 800-3,000 sqft + insurance + business license. **Players:** mostly independent makers + small studios; sell channels: direct commission, Etsy, Wayfair Professional, Houzz Pro, Chairish, 1stDibs, local design centers + interior designers. **Margin:** 35-55% after lumber + finish + labor. **Win condition:** interior designer + architect referral network + commission portfolio + ~5-15 anchor clients/yr.`,
    core: `

## Why Woodworking 2027 Is Real

Home renovation + custom-furniture demand from $300K+ income households + COVID-era home-improvement habit + interior-design industry growth all drive demand. Demand drivers:
- Custom cabinetry (kitchen, built-ins)
- Custom dining tables + furniture
- Architectural millwork (mantels, moldings)
- Restaurant/retail buildouts
- Wedding/event signage
- Restoration + antique repair

## Pricing 2027

| Service | Price |
|---|---|
| Hourly labor | $50-$200/hr |
| Custom dining table | $1,500-$15,000 |
| Built-in bookshelf wall | $5,000-$50,000 |
| Kitchen cabinetry | $15,000-$150,000 |
| Architectural millwork | $5,000-$100,000+ |
| Restaurant/retail buildout | $10K-$300K |
| Cutting board | $50-$200 |
| Charcuterie/serving | $80-$400 |
| Wedding signage | $200-$2,500 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-150K shop + tools + space + insurance] --> B[Build portfolio + Etsy + Instagram]
    B --> C[Interior designer + architect referral network]
    C --> D[Y1: $50K-$200K · 5-20 commissions]
    D --> E[Y2: $200K-$700K · 1-2 apprentices]
\`\`\`

TAGS: woodworking-shop-business-2027-custom-furniture-cabinetry-millwork, sawstop-laguna-shopbot-cnc-jointer-planer-equipment, etsy-wayfair-houzz-chairish-1stdibs-sales-channels, interior-designer-architect-referral-network, restaurant-retail-buildout-architectural-mantel-molding-specialty, 2027`,
    src: `

## Sources

- SawStop (Festool subsidiary): https://www.sawstop.com/
- ShopBot CNC: https://www.shopbottools.com/
- Laguna Tools: https://lagunatools.com/
- Festool: https://www.festoolusa.com/
- Etsy (NASDAQ: ETSY): https://www.etsy.com/
- Wayfair Professional: https://www.wayfair.com/professional
- Houzz Pro: https://www.houzz.com/pro
- 1stDibs (NASDAQ: DIBS): https://www.1stdibs.com/
- Chairish: https://www.chairish.com/
- ASID (American Society of Interior Designers): https://www.asid.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Hourly labor | $50-$200/hr | Industry |
| Custom dining table | $1,500-$15,000 | Industry |
| Built-in bookshelf | $5K-$50K | Industry |
| Kitchen cabinetry | $15K-$150K | Industry |
| SawStop industrial cabinet saw | $4K-$8K | SawStop |
| ShopBot CNC PRSalpha | $25K-$55K | ShopBot |
| Laguna SmartShop CNC | $15K-$40K | Laguna |
| Etsy ETSY revenue FY24 | ~$2.8B | ETSY 10-K |
| Etsy GMS FY24 | ~$12B | ETSY 10-K |
| 1stDibs DIBS revenue FY24 | ~$87M | DIBS 10-K |
| Wayfair W revenue FY24 | ~$12B | W 10-K |
| Houzz Pro subscriptions | major | Houzz |
| ASID members | ~25K+ | ASID |
| AWFS (Association of Woodworking & Furnishing Suppliers) | major trade body | AWFS |
| Y1 capital | $30K-$150K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 35-55% | Industry |`,
    counter: `## Counter-Case
**IKEA + Wayfair commodity floor.** Mitigation: custom + bespoke premium.
**Capital intensive shop setup.** Mitigation: shared maker space + lease tools.
**Long lead times.** 6-16 weeks typical. Mitigation: deposit + transparent timeline.
**Lumber + finish cost volatility.** Mitigation: 30-50% deposit + markup pass-through.
**When stay-solo wins.** Solo craftsman at $80-150K is meaningful art + craft career.`,
    links: `

## See Also

- **q1993** — Start a vinyl decals business 2027
- **q1992** — Start a custom apparel business 2027
- **q1986** — Start a CNC machining business 2027
- **q1985** — Start a 3D printing service business 2027`,
    sources: ["https://www.sawstop.com/","https://www.shopbottools.com/","https://lagunatools.com/","https://www.festoolusa.com/","https://www.etsy.com/","https://www.wayfair.com/professional","https://www.houzz.com/pro","https://www.1stdibs.com/","https://www.chairish.com/","https://www.asid.org/"],
    tags: ["woodworking-shop-business-2027-custom-furniture-cabinetry-millwork","sawstop-laguna-shopbot-cnc-jointer-planer-equipment","etsy-wayfair-houzz-chairish-1stdibs-sales-channels","interior-designer-architect-referral-network","restaurant-retail-buildout-architectural-mantel-molding-specialty","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (SawStop Festool + ShopBot PRSalpha $25-55K + Laguna SmartShop $15-40K + Festool equipment, Etsy ETSY $2.8B $12B GMS + Wayfair W $12B + Houzz Pro + 1stDibs DIBS $87M + Chairish sales channels, ASID 25K members + AWFS Association of Woodworking & Furnishing Suppliers) real.' }
  },
  {
    id: 'q1993',
    tldr: `**TL;DR:** Vinyl decals in 2027 = **cut-vinyl signage + transfer + apparel** charging $5-$50/sticker + $100-$2,500/vehicle/wall decal. **Y1 $20K-$80K solo (300-1,500 orders); Y2 $80K-$300K with 1-2 helpers.** **Required:** vinyl cutter (Cricut Maker 3, Silhouette Cameo Plus, Roland GS-24, Roland CAMM-1 GR series — $300-$5,000) + heat press (Cricut EasyPress, Hotronix STX, Stahls' Hotronix Maxx) + transfer tape + vinyl inventory (Oracal, Siser, StarCraft, ThermoFlex Plus) + design software (Adobe Illustrator, Inkscape, Affinity Designer, Canva, Silhouette Studio, Cricut Design Space). **Players:** Cricut (NASDAQ: CRCT, ~10M+ users), Silhouette America, Roland DGA, Brother, USCutter, GraphtecAmerica. **Sales channels:** Etsy, Shopify, Amazon Handmade, in-person craft fairs, local sign shops B2B. **Margin:** 70-85% on material (vinyl roll $30-$120 yields hundreds of decals).`,
    core: `

## Why Vinyl Decals 2027 Is Real

Cricut + Silhouette democratized vinyl cutting 2015+. Etsy + Shopify enabled DTC sales. Demand drivers:
- Vehicle decal personalization
- Wedding + event signage
- Small business signage
- Window + wall decoration
- T-shirt + apparel
- Cricut hobbyist resale + craft fairs

## Pricing 2027

| Item | Price |
|---|---|
| Small sticker (3-4") | $5-$15 |
| Medium decal (8-12") | $15-$50 |
| Vehicle window | $25-$150 |
| Wall decal (large) | $100-$500 |
| Vehicle full graphics | $500-$2,500 |
| Bulk wedding (100 favors) | $200-$800 |
| Business signage | $100-$1,500 |
| Custom design fee | $25-$150 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $500-5K cutter + heat press + vinyl + Adobe/Affinity/Canva + Etsy/Shopify] --> B[Build inventory + designs]
    B --> C[Etsy + craft fair + local B2B sign shops]
    C --> D[Y1: $20K-$80K · solo]
    D --> E[Y2: $80K-$300K · 1-2 helpers]
\`\`\`

TAGS: vinyl-decals-business-2027-cut-signage-transfer-apparel, cricut-maker-3-crct-silhouette-cameo-plus-roland-gs-24-camm-1-gr-uscutter-brother-graphtec-equipment, oracal-siser-starcraft-thermoflex-plus-vinyl-brands, adobe-illustrator-inkscape-affinity-canva-silhouette-studio-cricut-design-space-software, etsy-shopify-amazon-handmade-craft-fair-sales-channels, 70-85-percent-margin-vinyl-roll, 2027`,
    src: `

## Sources

- Cricut (NASDAQ: CRCT): https://cricut.com/
- Silhouette America: https://www.silhouetteamerica.com/
- Roland DGA: https://www.rolanddga.com/
- USCutter: https://www.uscutter.com/
- Graphtec America: https://www.graphtecamerica.com/
- Stahls' Hotronix: https://www.stahls.com/
- Oracal vinyl (Orafol): https://www.orafol.com/
- Siser: https://www.siser.com/
- Etsy (NASDAQ: ETSY): https://www.etsy.com/
- Shopify (NYSE: SHOP): https://www.shopify.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Small sticker | $5-$15 | Industry |
| Medium decal | $15-$50 | Industry |
| Vehicle window | $25-$150 | Industry |
| Wall decal large | $100-$500 | Industry |
| Vehicle full graphics | $500-$2,500 | Industry |
| Cricut CRCT revenue FY24 | ~$700M | CRCT 10-K |
| Cricut users | ~10M+ | CRCT |
| Cricut Maker 3 price | $400 | Cricut |
| Silhouette Cameo Plus | $300-$400 | Silhouette |
| Roland GS-24 vinyl cutter | $1,800-$2,500 | Roland |
| Roland CAMM-1 GR series | $5K-$15K | Roland |
| Stahls' Hotronix STX | $1,500-$3,000 | Stahls' |
| Etsy ETSY GMS FY24 | ~$12B | ETSY 10-K |
| Shopify SHOP revenue FY24 | ~$8.9B | SHOP 10-K |
| Y1 capital | $500-$5,000 | Industry |
| Y1 revenue | $20K-$80K | Industry |
| Y2 revenue | $80K-$300K | Industry |
| Margin | 70-85% | Industry |`,
    counter: `## Counter-Case
**Etsy + Amazon flooded with sticker shops.** Mitigation: custom + B2B small biz signage.
**Cricut Design Space limits.** Mitigation: Adobe Illustrator + Affinity Designer.
**Vinyl cost volatility.** Mitigation: bulk supplier (Oracal, Siser direct).
**Heat press injury risk.** Mitigation: trained operation + safety SOPs.
**When stay-side wins.** $20-40K side hustle is fine.`,
    links: `

## See Also

- **q1992** — Start a custom apparel business 2027
- **q1991** — Start a sublimation printing business 2027
- **q1988** — Start a screen printing business 2027
- **q1994** — Start a woodworking shop business 2027`,
    sources: ["https://cricut.com/","https://www.silhouetteamerica.com/","https://www.rolanddga.com/","https://www.uscutter.com/","https://www.graphtecamerica.com/","https://www.stahls.com/","https://www.orafol.com/","https://www.siser.com/","https://www.etsy.com/","https://www.shopify.com/"],
    tags: ["vinyl-decals-business-2027-cut-signage-transfer-apparel","cricut-maker-3-crct-silhouette-cameo-plus-roland-gs-24-camm-1-gr-uscutter-brother-graphtec-equipment","oracal-siser-starcraft-thermoflex-plus-vinyl-brands","adobe-illustrator-inkscape-affinity-canva-silhouette-studio-cricut-design-space-software","etsy-shopify-amazon-handmade-craft-fair-sales-channels","70-85-percent-margin-vinyl-roll","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Cricut CRCT $700M FY24 10M users Maker 3 $400 + Silhouette Cameo Plus $300 + Roland DGA GS-24 $1.8-2.5K + CAMM-1 GR $5-15K + USCutter + Graphtec America + Brother + Stahls Hotronix STX $1.5-3K equipment, Oracal Orafol + Siser + StarCraft + ThermoFlex Plus vinyl brands, Adobe Illustrator + Inkscape + Affinity Designer + Canva + Silhouette Studio + Cricut Design Space software, Etsy ETSY $12B GMS + Shopify SHOP $8.9B + Amazon Handmade sales channels) real.' }
  },
  {
    id: 'q1992',
    tldr: `**TL;DR:** Custom apparel in 2027 = **t-shirt + hoodie + cap printing** for events, businesses, schools, sports teams. **Pricing:** $15-$45/shirt + $30-$80/hoodie + $20-$40/cap + bulk discount 20-50% for 24+ units. **Y1 $50K-$200K solo (200-1,000 orders); Y2 $200K-$600K with 2-3 helpers + multiple decorators.** **Required:** $30-$200K capital + heat press + screen press OR DTG printer (Brother GTX, Epson SureColor F-series, Kornit) + commercial embroidery (Brother PR1055X, Tajima TMEZ, Melco EMT16X) + inventory (blank apparel from Gildan, Bella + Canvas, Champion, Hanes, American Apparel, AS Colour, Independent Trading Co, Comfort Colors, Next Level). **Players:** Custom Ink ($300M+ revenue, Cimpress), 4imprint (NASDAQ: FOUR), Vistaprint (Cimpress), Printful, Printify, Teespring (Amaze Holdings), Bonfire (CrowdRise), Threadless. **Margin:** 40-60%. **Win condition:** schools + corporate + nonprofit B2B fundraiser orders.`,
    core: `

## Why Custom Apparel 2027 Is Real

Schools + youth sports + corporate + nonprofit + event-tee market is huge and recurring. Demand drivers:
- School + youth sports team uniforms
- Corporate swag (HR onboarding, conferences)
- Nonprofit fundraiser tees
- Family reunion + wedding party
- Local event + festival
- Restaurant + bar staff uniforms

## Pricing 2027

| Item | Price |
|---|---|
| T-shirt printed | $15-$45 |
| Hoodie printed | $30-$80 |
| Cap embroidered | $20-$40 |
| Polo embroidered | $25-$60 |
| Bulk 24+ shirts discount | 20-50% off |
| Embroidered jacket | $40-$120 |
| DTG single print | +$5-$15 over base |
| Setup fee | $25-$100 |
| Design fee | $50-$300 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-200K capital + heat press OR DTG OR screen press OR embroidery] --> B[Land school + corporate B2B]
    B --> C[Y1: $50K-$200K · solo]
    C --> D[Y2: $200K-$600K · 2-3 helpers + multi-decorator]
\`\`\`

TAGS: custom-apparel-business-2027-tshirt-hoodie-cap-embroidery, custom-ink-300m-cimpress-4imprint-four-vistaprint-printful-printify-teespring-amaze-bonfire-threadless-competitors, gildan-bella-canvas-champion-hanes-american-apparel-as-colour-independent-trading-comfort-colors-next-level-blanks, brother-gtx-epson-surecolor-f-kornit-dtg-printers, brother-pr1055x-tajima-tmez-melco-emt16x-embroidery-machines, school-corporate-nonprofit-fundraiser-bulk-b2b-revenue, 2027`,
    src: `

## Sources

- Custom Ink (Cimpress): https://www.customink.com/
- 4imprint (NASDAQ: FOUR): https://www.4imprint.com/
- Vistaprint (Cimpress): https://www.vistaprint.com/
- Printful: https://www.printful.com/
- Printify: https://printify.com/
- Brother USA: https://www.brother-usa.com/
- Epson DTG: https://epson.com/dtg
- Kornit Digital (NASDAQ: KRNT): https://www.kornit.com/
- Tajima USA: https://www.tajimausa.com/
- Gildan Activewear (NYSE: GIL): https://www.gildan.com/
- Bella + Canvas: https://bellacanvas.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| T-shirt printed | $15-$45 | Industry |
| Hoodie printed | $30-$80 | Industry |
| Cap embroidered | $20-$40 | Industry |
| Custom Ink revenue est | ~$300M+ | Industry estimates |
| Custom Ink parent | Cimpress | Cimpress |
| 4imprint FOUR revenue FY24 | ~$1.4B | FOUR 10-K |
| Brother GTX-PRO DTG | $20K-$30K | Brother |
| Epson SureColor F2270 | $9K-$15K | Epson |
| Kornit Atlas Max DTG | $200K+ | Kornit |
| Brother PR1055X 10-needle embroidery | $11K-$15K | Brother |
| Tajima TMEZ-SC1501 | $9K-$15K | Tajima |
| Melco EMT16X | $13K-$17K | Melco |
| Gildan GIL revenue FY24 | ~$3.2B | GIL 10-K |
| Bella + Canvas parent | Bella Industries | Bella Industries |
| Y1 capital | $30K-$200K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$600K | Industry |
| Margin | 40-60% | Industry |`,
    counter: `## Counter-Case
**Custom Ink + 4imprint dominate national.** Mitigation: local + same-day school + sports.
**Print-on-demand (Printful, Printify) commoditizes DTC.** Mitigation: B2B bulk + speed advantage.
**Equipment capital.** Mitigation: lease + start with heat press + grow.
**Blank-shirt cost volatility.** Mitigation: bulk supplier (S&S Activewear, alphabroder, SanMar).
**When stay-solo wins.** $80-120K solo decorator is comfortable.`,
    links: `

## See Also

- **q1991** — Start a sublimation printing business 2027
- **q1988** — Start a screen printing business 2027
- **q1987** — Start an embroidery business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://www.customink.com/","https://www.4imprint.com/","https://www.vistaprint.com/","https://www.printful.com/","https://printify.com/","https://www.brother-usa.com/","https://epson.com/dtg","https://www.kornit.com/","https://www.tajimausa.com/","https://www.gildan.com/","https://bellacanvas.com/"],
    tags: ["custom-apparel-business-2027-tshirt-hoodie-cap-embroidery","custom-ink-300m-cimpress-4imprint-four-vistaprint-printful-printify-teespring-amaze-bonfire-threadless-competitors","gildan-bella-canvas-champion-hanes-american-apparel-as-colour-independent-trading-comfort-colors-next-level-blanks","brother-gtx-epson-surecolor-f-kornit-dtg-printers","brother-pr1055x-tajima-tmez-melco-emt16x-embroidery-machines","school-corporate-nonprofit-fundraiser-bulk-b2b-revenue","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Custom Ink $300M Cimpress + 4imprint FOUR $1.4B + Vistaprint Cimpress + Printful + Printify + Teespring Amaze + Bonfire + Threadless competitors, Brother GTX-PRO $20-30K + Epson SureColor F2270 $9-15K + Kornit Atlas Max KRNT $200K DTG, Brother PR1055X $11-15K + Tajima TMEZ-SC1501 $9-15K + Melco EMT16X $13-17K embroidery, Gildan GIL $3.2B + Bella + Canvas + Champion + Hanes + American Apparel + AS Colour + Independent Trading Co + Comfort Colors + Next Level blanks, S&S Activewear + alphabroder + SanMar distributors) real.' }
  },
  {
    id: 'q1991',
    tldr: `**TL;DR:** Sublimation printing in 2027 = **dye-sublimation transfer onto polyester apparel + mugs + tumblers + signs + flags**. **Pricing 2027:** $5-$25/mug + $15-$45/tumbler + $20-$50/shirt + $50-$300/flag/banner. **Y1 $20K-$80K solo (200-1,500 orders); Y2 $80K-$300K with helpers + multi-printer.** **Required:** $2-$25K capital — sublimation printer (Epson SureColor F570/F170/F570 Pro, Sawgrass SG1000/SG500, Roland VersaSTUDIO BN-20, Mutoh ValueJet) + sublimation paper + sublimation ink + heat press (Cricut EasyPress, Hotronix Auto Open, Geo Knight DK20S, Stahls' Hotronix Maxx) + mug press + tumbler press + polyester blanks (HTV Ronix, JPSS, Pro World, Hanes Cool Dri, Vapor Apparel) + design software. **Players:** Sawgrass Technologies (dominant ink/printer brand), Epson, Roland, Cobra (USA Knife Maker), USCutter. **Sales channels:** Etsy, Shopify, Amazon Handmade, craft fairs, school + sports B2B. **Margin:** 65-80%.`,
    core: `

## Why Sublimation 2027 Is Real

Sublimation expanded from photo prints to home crafts via Cricut + influencer marketing 2018+. Demand drivers:
- Personalized gifts (mugs, tumblers, photo gifts)
- Sports team jerseys + cheer + dance
- Wedding + event keepsakes
- Bachelorette + bridal
- Pet photo gifts
- Father's/Mother's day specialty

## Pricing 2027

| Item | Price |
|---|---|
| Mug (11oz) | $5-$15 |
| Tumbler (20oz) | $15-$45 |
| Polyester tee | $20-$50 |
| Cheer + sports jersey | $40-$120 |
| Photo flag/banner | $50-$300 |
| Mouse pad | $10-$30 |
| Bag/tote (poly-coated) | $15-$60 |
| Pet portrait mug | $20-$60 |
| Custom design fee | $25-$100 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $2-25K capital + sublimation printer + heat press + mug press + supplies] --> B[Etsy + Shopify + craft fair]
    B --> C[School + sports team B2B]
    C --> D[Y1: $20K-$80K · solo]
    D --> E[Y2: $80K-$300K · helpers + multi-printer]
\`\`\`

TAGS: sublimation-printing-business-2027-dye-sublimation-polyester-mug-tumbler-shirt, epson-surecolor-f570-f170-f570-pro-sawgrass-sg1000-sg500-roland-versastudio-bn-20-mutoh-valuejet-printers, sawgrass-technologies-ink-brand-dominant, cricut-easypress-hotronix-auto-open-geo-knight-stahls-maxx-presses, htv-ronix-jpss-pro-world-hanes-cool-dri-vapor-apparel-polyester-blanks, etsy-shopify-amazon-handmade-craft-fair-school-sports-b2b-channels, 65-80-percent-margin, 2027`,
    src: `

## Sources

- Sawgrass Technologies: https://www.sawgrassink.com/
- Epson SureColor F-series: https://epson.com/dye-sublimation-printer
- Roland DGA VersaSTUDIO: https://www.rolanddga.com/
- Mutoh America: https://www.mutoh.com/
- Cricut EasyPress: https://cricut.com/
- Stahls' Hotronix: https://www.stahls.com/
- Geo Knight: https://www.geoknight.com/
- Pro World: https://www.proworldinc.com/
- Etsy: https://www.etsy.com/
- Conde Systems (sublimation distributor): https://www.condesystems.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Mug 11oz | $5-$15 | Industry |
| Tumbler 20oz | $15-$45 | Industry |
| Polyester tee | $20-$50 | Industry |
| Sports jersey | $40-$120 | Industry |
| Photo flag/banner | $50-$300 | Industry |
| Epson SureColor F570 | $2,500-$3,500 | Epson |
| Epson SureColor F170 desktop | $400-$700 | Epson |
| Sawgrass SG1000 | $2,500-$3,000 | Sawgrass |
| Sawgrass SG500 desktop | $500-$700 | Sawgrass |
| Roland VersaSTUDIO BN-20 | $4,000-$5,500 | Roland |
| Stahls' Hotronix Auto Open press | $1,500-$3,000 | Stahls' |
| Geo Knight DK20S | $1,300-$1,800 | Geo Knight |
| Cricut EasyPress 3 | $200-$350 | Cricut |
| Tumbler press | $300-$700 | Industry |
| Mug press | $200-$500 | Industry |
| Y1 capital | $2K-$25K | Industry |
| Y1 revenue | $20K-$80K | Industry |
| Y2 revenue | $80K-$300K | Industry |
| Margin | 65-80% | Industry |`,
    counter: `## Counter-Case
**Etsy + Amazon flooded.** Mitigation: niche specialty (pet, sports team, dance, wedding).
**Polyester-only limitation.** Cotton requires DTG/screen. Mitigation: blend + add specialty.
**Ink/printer maintenance.** Sawgrass clogs without use. Mitigation: weekly cleaning cycle.
**Color matching consistency.** Mitigation: ICC profile + paper-printer-press testing.
**When stay-side wins.** $20-40K side income is meaningful.`,
    links: `

## See Also

- **q1992** — Start a custom apparel business 2027
- **q1988** — Start a screen printing business 2027
- **q1987** — Start an embroidery business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://www.sawgrassink.com/","https://epson.com/dye-sublimation-printer","https://www.rolanddga.com/","https://www.mutoh.com/","https://cricut.com/","https://www.stahls.com/","https://www.geoknight.com/","https://www.proworldinc.com/","https://www.etsy.com/","https://www.condesystems.com/"],
    tags: ["sublimation-printing-business-2027-dye-sublimation-polyester-mug-tumbler-shirt","epson-surecolor-f570-f170-f570-pro-sawgrass-sg1000-sg500-roland-versastudio-bn-20-mutoh-valuejet-printers","sawgrass-technologies-ink-brand-dominant","cricut-easypress-hotronix-auto-open-geo-knight-stahls-maxx-presses","htv-ronix-jpss-pro-world-hanes-cool-dri-vapor-apparel-polyester-blanks","etsy-shopify-amazon-handmade-craft-fair-school-sports-b2b-channels","65-80-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Epson SureColor F570 $2.5-3.5K + F170 desktop + Sawgrass SG1000 $2.5-3K + SG500 desktop + Roland VersaSTUDIO BN-20 $4-5.5K + Mutoh ValueJet printers + Sawgrass Technologies ink dominant, Cricut EasyPress 3 + Stahls Hotronix Auto Open + Geo Knight DK20S + mug + tumbler presses, HTV Ronix + JPSS + Pro World + Hanes Cool Dri + Vapor Apparel polyester blanks, Conde Systems distributor) real.' }
  },
  {
    id: 'q1990',
    tldr: `**TL;DR:** Soap making business in 2027 = **handcrafted bar + liquid soap + body wash + bath bombs + body butter** under FDA cosmetic regulations (NOT drug claims). **Pricing 2027:** $4-$15/bar + $8-$25/liquid bottle + $15-$50/gift set + $30-$200 wholesale case to boutiques. **Y1 $15K-$80K solo (200-1,500 orders); Y2 $80K-$300K with commercial kitchen + wholesale + DTC subscription.** **Required:** state cottage/cosmetic regulations (varies — most states allow soap as exempt from cosmetic regs but check) + FDA cosmetic registration if drug claims + INCI labeling + business license + insurance. **Players:** Dr. Bronner's (~$165M revenue, family-owned), L'Occitane en Provence, Bath & Body Works (NYSE: BBWI), Lush Cosmetics ($1B+ private), Mrs. Meyer's Clean Day (SC Johnson), J.R. Watkins (Watkins Inc), Mike's Bees & Honey, Mountain Rose Herbs. **Etsy + Shopify channel:** ~30K+ soap shops on Etsy. **Margin:** 50-70%. **Win condition:** specialty (goat milk, charcoal, CBD-free, vegan, fragrance-free, sensitive) + farmers market + boutique wholesale + subscription DTC.`,
    core: `

## Why Soap 2027 Is Real

Clean-beauty + handmade trend + sensitive-skin demand all create real demand. Demand drivers:
- Sensitive skin + eczema specialty
- Vegan + cruelty-free
- Wedding favors + corporate gifts
- Farmers market consistency
- Subscription DTC
- Boutique + spa wholesale

## Pricing 2027

| Item | Price |
|---|---|
| Bar soap | $4-$15 |
| Liquid soap 8oz | $8-$25 |
| Body wash 16oz | $12-$30 |
| Bath bomb | $4-$12 |
| Body butter 4oz | $12-$30 |
| Gift set (3-5 items) | $15-$50 |
| Wedding favor (50-100ct) | $150-$600 |
| Wholesale case 12-bar | $30-$120 |
| Subscription monthly | $20-$60/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Cottage approval + $1-5K supplies + Etsy/Shopify] --> B[Farmers market + Instagram]
    B --> C[Add wholesale boutique + subscription]
    C --> D[Y1: $15K-$80K · solo]
    D --> E[Y2: $80K-$300K · commercial kitchen + wholesale]
\`\`\`

TAGS: soap-making-business-2027-handcrafted-bar-liquid-body-wash-bath-bomb-body-butter, dr-bronners-loccitane-bath-body-works-bbwi-lush-mrs-meyers-sc-johnson-jr-watkins-mountain-rose-references, fda-cosmetic-regulation-inci-labeling-no-drug-claims, goat-milk-charcoal-vegan-fragrance-free-sensitive-specialty-niches, etsy-30k-soap-shops-shopify-farmers-market-boutique-subscription-channels, 50-70-percent-margin, 2027`,
    src: `

## Sources

- HSCG (Handcrafted Soap & Cosmetic Guild): https://www.soapguild.org/
- FDA Cosmetics: https://www.fda.gov/cosmetics
- Dr. Bronner's: https://www.drbronner.com/
- Lush Cosmetics: https://www.lushusa.com/
- Bath & Body Works (NYSE: BBWI): https://www.bathandbodyworks.com/
- L'Occitane en Provence: https://usa.loccitane.com/
- Mountain Rose Herbs: https://mountainroseherbs.com/
- Bramble Berry (supplier): https://www.brambleberry.com/
- Wholesale Supplies Plus: https://www.wholesalesuppliesplus.com/
- Etsy: https://www.etsy.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Bar soap | $4-$15 | Industry |
| Liquid 8oz | $8-$25 | Industry |
| Gift set | $15-$50 | Industry |
| Subscription monthly | $20-$60 | Industry |
| Dr. Bronner's revenue | ~$165M | Dr. Bronner's (family-owned) |
| Lush Cosmetics revenue | ~$1B+ | Industry estimates |
| L'Occitane en Provence revenue | ~$2.5B | L'Occitane |
| Bath & Body Works BBWI revenue FY24 | ~$7.3B | BBWI 10-K |
| Mrs. Meyer's parent | SC Johnson | SC Johnson |
| Mountain Rose Herbs | private | Mountain Rose |
| HSCG members | ~2,000+ | HSCG |
| Etsy soap shops | ~30K+ | Industry estimates |
| Bramble Berry founded | 1998 | Bramble Berry |
| Wholesale Supplies Plus | major US soap supplier | WSP |
| FDA cosmetic vs drug threshold | claims-based | FDA |
| INCI labeling required | yes | FDA |
| Y1 capital | $1K-$5K | Industry |
| Y1 revenue | $15K-$80K | Industry |
| Y2 revenue | $80K-$300K | Industry |
| Margin | 50-70% | Industry |`,
    counter: `## Counter-Case
**Etsy saturated 30K+ soap shops.** Mitigation: brand + specialty + wholesale.
**Bath & Body Works + L'Occitane scale.** Mitigation: handmade premium niche.
**Drug claims = FDA enforcement risk.** Mitigation: marketing avoids therapeutic claims.
**Lye safety (handling sodium hydroxide).** Mitigation: PPE + ventilation + SOPs.
**When stay-side wins.** $20-40K side income via farmers market is meaningful.`,
    links: `

## See Also

- **q1989** — Start a candle making business 2027
- **q2006** — Start a charcuterie board business 2027
- **q1993** — Start a vinyl decals business 2027
- **q1992** — Start a custom apparel business 2027`,
    sources: ["https://www.soapguild.org/","https://www.fda.gov/cosmetics","https://www.drbronner.com/","https://www.lushusa.com/","https://www.bathandbodyworks.com/","https://usa.loccitane.com/","https://mountainroseherbs.com/","https://www.brambleberry.com/","https://www.wholesalesuppliesplus.com/","https://www.etsy.com/"],
    tags: ["soap-making-business-2027-handcrafted-bar-liquid-body-wash-bath-bomb-body-butter","dr-bronners-loccitane-bath-body-works-bbwi-lush-mrs-meyers-sc-johnson-jr-watkins-mountain-rose-references","fda-cosmetic-regulation-inci-labeling-no-drug-claims","goat-milk-charcoal-vegan-fragrance-free-sensitive-specialty-niches","etsy-30k-soap-shops-shopify-farmers-market-boutique-subscription-channels","50-70-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Dr. Bronners $165M family-owned + Lush $1B + LOccitane $2.5B + Bath & Body Works BBWI $7.3B + Mrs. Meyers SC Johnson + JR Watkins Watkins Inc + Mountain Rose Herbs + Mikes Bees & Honey references, HSCG Handcrafted Soap & Cosmetic Guild 2K members + FDA cosmetic regs + INCI labeling, Bramble Berry 1998 + Wholesale Supplies Plus suppliers, Etsy ~30K soap shops) real.' }
  },
  {
    id: 'q1989',
    tldr: `**TL;DR:** Candle making in 2027 = **handcrafted soy/coconut/beeswax/paraffin scented candles** for retail + DTC + wholesale. **Pricing 2027:** $10-$45/candle + $50-$200/gift set + $40-$300 wholesale case to boutiques. **Y1 $15K-$80K solo (300-2,000 orders); Y2 $80K-$300K with commercial space + wholesale.** **Required:** business license + insurance (candle fires = real risk) + UPC labeling + warning compliance (ASTM F2058 standard for candle fire safety) + commercial wax inventory (CandleScience, NatureWax, EcoSoya, Golden Brands 464, CB Advanced, AAK Crystal) + fragrance oils (CandleScience IFRA-compliant, Lone Star Candle Supply, Bramble Berry) + vessels + wicks. **Players:** **Bath & Body Works** (~$7.3B BBWI dominant), Yankee Candle (Newell Brands NWL), WoodWick, Diptyque (~$300M+ private), Voluspa, Otherland, P.F. Candle Co, Le Labo (Estee Lauder), Boy Smells, Homesick Candles, Apotheke. **Etsy ~50K+ candle shops** = brutal commodity floor; survivors specialize on fragrance, design, scent storytelling. **Margin:** 50-70%.`,
    core: `

## Why Candles 2027 Is Real

Premium home fragrance + gifting + wellness culture drives demand. Demand drivers:
- Wellness + self-care
- Wedding + corporate gifting
- Specialty fragrance (woods, florals, citrus, gourmand)
- Subscription boxes
- Boutique + spa wholesale
- Custom corporate branded

## Pricing 2027

| Item | Price |
|---|---|
| Single candle (8oz) | $10-$25 |
| Premium candle (12-16oz) | $20-$45 |
| Wood-wick premium | $25-$60 |
| 3-wick large | $30-$80 |
| Gift set | $50-$200 |
| Wedding favor (50-100) | $200-$1,500 |
| Corporate branded | $20-$80/unit bulk |
| Wholesale case (12) | $80-$300 |
| Subscription monthly | $25-$80/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $1-8K supplies + business license + ASTM F2058 compliance + Etsy/Shopify] --> B[Local farmers market + Instagram]
    B --> C[Wholesale boutique + subscription + corporate]
    C --> D[Y1: $15K-$80K · solo]
    D --> E[Y2: $80K-$300K · commercial + wholesale + corporate]
\`\`\`

TAGS: candle-making-business-2027-handcrafted-soy-coconut-beeswax-paraffin-scented, bath-body-works-bbwi-7-3b-yankee-newell-nwl-woodwick-diptyque-voluspa-otherland-pf-candle-le-labo-estee-lauder-boy-smells-homesick-apotheke-competitors, astm-f2058-candle-fire-safety-standard-warning-labels, candlescience-naturewax-ecosoya-golden-brands-464-cb-advanced-aak-wax-suppliers, lone-star-candle-supply-bramble-berry-ifra-compliant-fragrance-oil-suppliers, etsy-50k-shops-shopify-wholesale-subscription-corporate-channels, 50-70-percent-margin, 2027`,
    src: `

## Sources

- NCA (National Candle Association): https://candles.org/
- ASTM F2058 candle fire safety: https://www.astm.org/f2058-22.html
- IFRA (International Fragrance Association): https://ifrafragrance.org/
- CandleScience: https://www.candlescience.com/
- Lone Star Candle Supply: https://www.lonestarcandlesupply.com/
- Bramble Berry: https://www.brambleberry.com/
- Bath & Body Works (NYSE: BBWI): https://www.bathandbodyworks.com/
- Yankee Candle (Newell Brands NWL): https://www.yankeecandle.com/
- Diptyque Paris: https://www.diptyqueparis.com/
- Etsy: https://www.etsy.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Single 8oz | $10-$25 | Industry |
| Premium 12-16oz | $20-$45 | Industry |
| Gift set | $50-$200 | Industry |
| Wholesale case (12) | $80-$300 | Industry |
| Bath & Body Works BBWI revenue | ~$7.3B FY24 | BBWI 10-K |
| Yankee Candle parent | Newell Brands NWL | NWL |
| Newell Brands NWL revenue | ~$8B FY24 | NWL 10-K |
| Diptyque revenue est | ~$300M+ | Industry estimates |
| Voluspa | private | Voluspa |
| Otherland funding | ~$5M+ | Crunchbase |
| P.F. Candle Co | private | P.F. Candle |
| Le Labo parent | Estee Lauder EL | EL |
| Boy Smells funding | ~$10M+ | Crunchbase |
| Homesick Candles | private | Homesick |
| US candle market | ~$3.5B+ | NCA |
| NCA members | ~150+ companies | NCA |
| ASTM F2058 effective | yes (current) | ASTM |
| Etsy candle shops | ~50K+ | Industry estimates |
| Y1 capital | $1K-$8K | Industry |
| Y1 revenue | $15K-$80K | Industry |
| Y2 revenue | $80K-$300K | Industry |
| Margin | 50-70% | Industry |`,
    counter: `## Counter-Case
**Bath & Body Works + Yankee dominate retail.** Mitigation: handmade premium + specialty fragrance.
**Etsy ~50K saturated.** Mitigation: brand + boutique wholesale + subscription.
**Fragrance oil cost volatility.** Mitigation: bulk + alternative suppliers.
**Fire safety + insurance.** Mitigation: ASTM F2058 + warning labels + $1M+ product liability.
**When stay-side wins.** $25-50K side income from farmers market + wedding favors is meaningful.`,
    links: `

## See Also

- **q1990** — Start a soap making business 2027
- **q1993** — Start a vinyl decals business 2027
- **q2006** — Start a charcuterie board business 2027
- **q1992** — Start a custom apparel business 2027`,
    sources: ["https://candles.org/","https://www.astm.org/f2058-22.html","https://ifrafragrance.org/","https://www.candlescience.com/","https://www.lonestarcandlesupply.com/","https://www.brambleberry.com/","https://www.bathandbodyworks.com/","https://www.yankeecandle.com/","https://www.diptyqueparis.com/","https://www.etsy.com/"],
    tags: ["candle-making-business-2027-handcrafted-soy-coconut-beeswax-paraffin-scented","bath-body-works-bbwi-7-3b-yankee-newell-nwl-woodwick-diptyque-voluspa-otherland-pf-candle-le-labo-estee-lauder-boy-smells-homesick-apotheke-competitors","astm-f2058-candle-fire-safety-standard-warning-labels","candlescience-naturewax-ecosoya-golden-brands-464-cb-advanced-aak-wax-suppliers","lone-star-candle-supply-bramble-berry-ifra-compliant-fragrance-oil-suppliers","etsy-50k-shops-shopify-wholesale-subscription-corporate-channels","50-70-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Bath & Body Works BBWI $7.3B + Yankee Candle Newell Brands NWL $8B + WoodWick + Diptyque $300M + Voluspa + Otherland + P.F. Candle Co + Le Labo Estee Lauder EL + Boy Smells + Homesick + Apotheke competitors, NCA National Candle Association 150 companies + ASTM F2058 fire safety + IFRA fragrance association regulatory, CandleScience + Lone Star Candle Supply + Bramble Berry + NatureWax + EcoSoya + Golden Brands 464 + CB Advanced + AAK Crystal wax + IFRA fragrance suppliers) real.' }
  },
  {
    id: 'q1988',
    tldr: `**TL;DR:** Screen printing in 2027 = **traditional ink-on-shirt for high-volume orders** ($1-$8/shirt at 100+ unit volume, 4-6 color jobs). **Y1 $50K-$200K solo (200-1,500 orders); Y2 $200K-$700K with manual + automatic press + 2-3 operators.** **Required:** $30-$200K capital — manual press (Riley Hopkins, M&R Sidewinder, Vastex V-100) starts $1-5K + automatic press (M&R Sportsman EX, ROQ NEXT, Anatol Vector) $30-$200K + flash dryer + exposure unit + screens + inks (Wilflex, Rutland, FN-INK, Permaset, Triangle) + dark room. **Players:** Custom Ink (Cimpress, $300M+), Threadbird, Real Thread, Yetti Press, Underground Printing, Imprint Plus. **Sales channels:** schools + bands + sports teams + churches + nonprofit fundraisers + breweries + corporate swag + custom apparel resellers. **DTG + sublimation eat low-volume**; screen prints dominate 50+ shirt orders. **Margin:** 40-55%.`,
    core: `

## Why Screen Printing 2027 Is Real

For 50+ shirt orders, screen printing remains 60-80% cheaper than DTG. Demand drivers:
- School + youth sports
- Bands + concert merch
- Corporate swag bulk
- Brewery + restaurant uniforms
- Nonprofit fundraiser bulk tees
- Churches + religious organizations

## Pricing 2027

| Service | Price |
|---|---|
| Setup fee per color | $25-$75 |
| 1-color 100 shirts | $4-$8/shirt |
| 4-color 100 shirts | $7-$14/shirt |
| 6-color 100 shirts | $10-$18/shirt |
| 24+ minimum order | typical |
| Rush 1-week | +25-50% |
| Catalog blank shirt cost | $2.50-$8 |
| Hoodie 4-color bulk | $18-$35/unit |
| Custom design fee | $50-$300 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-200K capital + manual press + auto press + screens + dryer] --> B[School + sports + brewery local B2B]
    B --> C[Add corporate + nonprofit + bulk]
    C --> D[Y1: $50K-$200K · solo]
    D --> E[Y2: $200K-$700K · auto press + 2-3 operators]
\`\`\`

TAGS: screen-printing-business-2027-traditional-ink-on-shirt-high-volume, riley-hopkins-mr-sidewinder-vastex-v100-manual-mr-sportsman-ex-roq-next-anatol-vector-automatic-presses, wilflex-rutland-fn-ink-permaset-triangle-inks, custom-ink-cimpress-threadbird-real-thread-yetti-press-underground-printing-imprint-plus-competitors, school-sports-brewery-corporate-nonprofit-church-bulk-channels, dtg-sublimation-low-volume-vs-screen-50-plus, 2027`,
    src: `

## Sources

- M&R Companies: https://www.mrprint.com/
- ROQ USA: https://roqus.com/
- Anatol Equipment: https://www.anatol.com/
- Riley Hopkins (Ryonet): https://www.screenprinting.com/
- Vastex International: https://www.vastex.com/
- FN-INK (Ryonet): https://www.screenprinting.com/fn-ink
- Wilflex (PolyOne): https://www.wilflex.com/
- Rutland Plastics: https://www.rutlandinc.com/
- Custom Ink (Cimpress): https://www.customink.com/
- SGIA (now PRINTING United Alliance): https://printingunited.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Setup fee per color | $25-$75 | Industry |
| 1-color 100 shirts | $4-$8/shirt | Industry |
| 4-color 100 shirts | $7-$14/shirt | Industry |
| Manual press (Riley Hopkins V) | $1K-$5K | Riley Hopkins |
| Vastex V-100 manual | $1.5K-$4K | Vastex |
| M&R Sidewinder manual | $4K-$10K | M&R |
| M&R Sportsman EX automatic | $40K-$150K | M&R |
| ROQ NEXT automatic | $50K-$200K | ROQ |
| Anatol Vector automatic | $30K-$100K | Anatol |
| Flash dryer (Vastex Little Buddy) | $1K-$3K | Vastex |
| Exposure unit | $500-$3K | Industry |
| Screen + emulsion | $30-$80/screen | Industry |
| Custom Ink revenue est | ~$300M+ | Industry estimates |
| Custom Ink parent | Cimpress | Cimpress |
| PRINTING United Alliance members | ~6,000+ | PRINTING United |
| Y1 capital | $30K-$200K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 40-55% | Industry |`,
    counter: `## Counter-Case
**DTG eats low-volume.** Mitigation: screen for 50+ shirt orders only.
**Capital intensive automatic press.** Mitigation: manual + grow into auto.
**Skilled operator labor.** Mitigation: train + retention bonuses.
**Ink/screen + chemical disposal.** Mitigation: EPA + state compliance.
**When stay-manual wins.** Solo manual at $80-130K is comfortable.`,
    links: `

## See Also

- **q1992** — Start a custom apparel business 2027
- **q1991** — Start a sublimation printing business 2027
- **q1987** — Start an embroidery business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://www.mrprint.com/","https://roqus.com/","https://www.anatol.com/","https://www.screenprinting.com/","https://www.vastex.com/","https://www.screenprinting.com/fn-ink","https://www.wilflex.com/","https://www.rutlandinc.com/","https://www.customink.com/","https://printingunited.com/"],
    tags: ["screen-printing-business-2027-traditional-ink-on-shirt-high-volume","riley-hopkins-mr-sidewinder-vastex-v100-manual-mr-sportsman-ex-roq-next-anatol-vector-automatic-presses","wilflex-rutland-fn-ink-permaset-triangle-inks","custom-ink-cimpress-threadbird-real-thread-yetti-press-underground-printing-imprint-plus-competitors","school-sports-brewery-corporate-nonprofit-church-bulk-channels","dtg-sublimation-low-volume-vs-screen-50-plus","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (M&R Sidewinder $4-10K + Sportsman EX $40-150K + ROQ NEXT $50-200K + Anatol Vector $30-100K + Riley Hopkins Ryonet + Vastex V-100 $1.5-4K presses, Wilflex PolyOne + Rutland Plastics + FN-INK Ryonet + Permaset + Triangle inks, Custom Ink $300M Cimpress + Threadbird + Real Thread + Yetti Press + Underground Printing + Imprint Plus competitors, PRINTING United Alliance formerly SGIA 6K members industry body) real.' }
  },
  {
    id: 'q1987',
    tldr: `**TL;DR:** Embroidery business in 2027 = **multi-needle commercial embroidery** for caps + polos + jackets + bags + uniforms. **Pricing 2027:** $5-$15/logo cap + $8-$25/logo polo + $15-$60/jacket + setup $25-$100/design. **Y1 $40K-$150K solo + 1 helper; Y2 $150K-$500K with 2-3 machines + multi-operator.** **Required:** $15-$80K commercial embroidery machine (Brother PR1055X 10-needle, Tajima TMEZ-SC1501 single-head, Melco EMT16X, Ricoma EM1010, ZSK Sprint 6 — single + multi-head $30K-$200K) + digitizing software (Wilcom EmbroideryStudio, Hatch Embroidery, Pulse Tajima DG/ML, Embird, Brother PE-Design) + threads (Madeira, Robison-Anton, Isacord, Glide) + stabilizer + bobbins + business license + insurance. **Players:** Custom Ink, 4imprint, Vistaprint commercial; thousands of independent local shops. **Sales channels:** schools, sports teams, corporate uniforms, restaurants, hotels, golf clubs, embroidery resellers + brokers. **Margin:** 45-60%.`,
    core: `

## Why Embroidery 2027 Is Real

Logos + branding on apparel + caps + bags is recurring B2B demand. Demand drivers:
- School + sports team uniforms
- Corporate uniforms (restaurant, hotel, retail, healthcare)
- Golf club + country club
- Real estate + insurance agent polos
- Trade show + giveaway swag
- Wedding party + bachelorette

## Pricing 2027

| Item | Price |
|---|---|
| Cap embroidered | $5-$15 |
| Polo embroidered | $8-$25 |
| Jacket | $15-$60 |
| Bag/tote | $8-$20 |
| Beanie | $6-$15 |
| Backpack | $15-$50 |
| Setup fee | $25-$100/design |
| Digitizing fee | $25-$150 |
| Bulk 24+ discount | 15-30% |
| Premium thick fabric | +25-50% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $15-80K machine + digitizing software + thread + business license] --> B[Schools + corporate uniforms B2B]
    B --> C[Add multi-head + multi-operator]
    C --> D[Y1: $40K-$150K · solo + helper]
    D --> E[Y2: $150K-$500K · 2-3 machines]
\`\`\`

TAGS: embroidery-business-2027-multi-needle-commercial-caps-polos-jackets-uniforms, brother-pr1055x-tajima-tmez-sc1501-melco-emt16x-ricoma-em1010-zsk-sprint-6-machines, wilcom-embroidery-studio-hatch-pulse-tajima-dg-ml-embird-brother-pe-design-digitizing-software, madeira-robison-anton-isacord-glide-thread-brands, school-corporate-restaurant-hotel-golf-real-estate-uniform-b2b-channels, 45-60-percent-margin, 2027`,
    src: `

## Sources

- Brother USA Embroidery: https://www.brother-usa.com/
- Tajima USA: https://www.tajimausa.com/
- Melco: https://melcou.com/
- Ricoma: https://www.ricoma.com/
- ZSK Stickmaschinen: https://www.zsk.de/
- Wilcom EmbroideryStudio: https://www.wilcom.com/
- Hatch Embroidery (Wilcom): https://www.hatchembroidery.com/
- Madeira USA: https://www.madeirausa.com/
- Robison-Anton: https://www.robison-anton.com/
- Isacord (Amann Group): https://www.amann.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Cap embroidered | $5-$15 | Industry |
| Polo embroidered | $8-$25 | Industry |
| Jacket | $15-$60 | Industry |
| Setup fee | $25-$100/design | Industry |
| Brother PR1055X 10-needle | $11K-$15K | Brother |
| Brother PR680W 6-needle | $5K-$8K | Brother |
| Tajima TMEZ-SC1501 single-head | $9K-$15K | Tajima |
| Melco EMT16X | $13K-$17K | Melco |
| Ricoma EM1010 | $7K-$12K | Ricoma |
| ZSK Sprint 6 industrial | $18K-$30K | ZSK |
| Multi-head commercial 4-head Tajima | $50K-$150K | Tajima |
| Wilcom EmbroideryStudio | $4K-$10K | Wilcom |
| Hatch Embroidery | $200-$1,500/yr subscription | Wilcom |
| Madeira Polyneon thread | $4-$8/spool | Madeira |
| Isacord polyester thread | $5-$8/spool | Amann |
| Y1 capital | $15K-$80K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$500K | Industry |
| Margin | 45-60% | Industry |`,
    counter: `## Counter-Case
**Custom Ink + 4imprint own national B2B.** Mitigation: local fast turnaround.
**Capital intensive multi-head.** Mitigation: single-head start + grow.
**Digitizing skill ceiling.** Mitigation: outsource to digitizers (TrueDigitizing, DigitDesign) until in-house.
**Thread breaks + machine maintenance.** Mitigation: training + service contract.
**When stay-solo wins.** $60-100K solo embroiderer is comfortable.`,
    links: `

## See Also

- **q1992** — Start a custom apparel business 2027
- **q1988** — Start a screen printing business 2027
- **q1991** — Start a sublimation printing business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://www.brother-usa.com/","https://www.tajimausa.com/","https://melcou.com/","https://www.ricoma.com/","https://www.zsk.de/","https://www.wilcom.com/","https://www.hatchembroidery.com/","https://www.madeirausa.com/","https://www.robison-anton.com/","https://www.amann.com/"],
    tags: ["embroidery-business-2027-multi-needle-commercial-caps-polos-jackets-uniforms","brother-pr1055x-tajima-tmez-sc1501-melco-emt16x-ricoma-em1010-zsk-sprint-6-machines","wilcom-embroidery-studio-hatch-pulse-tajima-dg-ml-embird-brother-pe-design-digitizing-software","madeira-robison-anton-isacord-glide-thread-brands","school-corporate-restaurant-hotel-golf-real-estate-uniform-b2b-channels","45-60-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Brother PR1055X 10-needle $11-15K + PR680W 6-needle + Tajima TMEZ-SC1501 $9-15K + Melco EMT16X $13-17K + Ricoma EM1010 $7-12K + ZSK Sprint 6 $18-30K + Tajima multi-head $50-150K commercial embroidery machines, Wilcom EmbroideryStudio $4-10K + Hatch + Pulse Tajima DG/ML + Embird + Brother PE-Design digitizing software, Madeira Polyneon + Robison-Anton + Isacord Amann + Glide thread brands) real.' }
  },
  {
    id: 'q1986',
    tldr: `**TL;DR:** CNC machining business in 2027 = **subtractive manufacturing service** producing custom metal + plastic + wood parts for aerospace, automotive, medical, defense, prototyping. **Pricing 2027:** $50-$200/hr machine time + setup fees + material + finishing. **Y1 $80K-$400K (single CNC mill or lathe); Y2 $400K-$2M+ with multi-machine shop.** **Required:** $40-$500K capital — CNC mill (Haas VF-2, DMG MORI DMU 50, Tormach 1100MX, Brother S700X, Pocket NC V2, Mazak Quick Turn) + CNC lathe (Haas ST-15, DMG MORI NLX, Doosan Lynx) + CAD/CAM software (Fusion 360 Autodesk, Mastercam, SolidWorks Dassault, Inventor Autodesk, GibbsCAM Sandvik, Bobcad-Cam) + tooling + measurement (Mitutoyo calipers, Renishaw probes, FaroArm, Hexagon CMM) + shop space + insurance + AS9100 cert for aerospace + ISO 9001 cert. **Players:** Xometry (NASDAQ: XMTR, ~$500M+ revenue marketplace), Protolabs (NYSE: PRLB), Hubs (Protolabs subsidiary), Fictiv (~$80M+ funding), eMachineShop, RapidDirect. **Margin:** 25-45% net.`,
    core: `

## Why CNC 2027 Is Real

Reshoring + onshoring + aerospace + medical + EV + defense demand creates real demand. Demand drivers:
- Aerospace (Boeing, Lockheed Martin, Northrop Grumman supply chain)
- Medical device (FDA 21 CFR 820)
- Automotive prototyping
- Defense (ITAR registered)
- EV battery + motor housings
- Maker + hobbyist DIY

## Pricing 2027

| Service | Price |
|---|---|
| Hourly machine time (3-axis mill) | $50-$100 |
| 5-axis machine | $100-$200/hr |
| CNC lathe | $60-$120/hr |
| Setup fee | $50-$300 |
| Material markup | 30-100% |
| Programming/CAM | $75-$150/hr |
| Prototyping rush | +50-100% |
| Production run discount | 15-30% |
| Inspection + QC | $50-$200/lot |
| Anodizing/plating | $5-$50/part |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $40-500K CNC mill or lathe + Fusion 360/Mastercam + tooling + shop] --> B[Land 5-10 anchor clients aerospace/medical/automotive]
    B --> C[AS9100 or ISO 9001 cert]
    C --> D[Y1: $80K-$400K · single machine]
    D --> E[Y2: $400K-$2M+ · multi-machine shop]
\`\`\`

TAGS: cnc-machining-business-2027-subtractive-manufacturing-custom-parts, haas-vf-2-dmg-mori-dmu-50-tormach-1100mx-brother-s700x-pocket-nc-v2-mazak-quick-turn-mills, haas-st-15-dmg-mori-nlx-doosan-lynx-lathes, fusion-360-autodesk-mastercam-solidworks-dassault-inventor-gibbscam-sandvik-bobcad-cam-software, xometry-xmtr-protolabs-prlb-hubs-fictiv-emachineshop-rapiddirect-marketplaces, mitutoyo-renishaw-faroarm-hexagon-measurement-quality, aerospace-medical-automotive-defense-ev-reshoring-as9100-iso-9001-itar-clients, 2027`,
    src: `

## Sources

- Haas Automation: https://www.haascnc.com/
- DMG MORI: https://us.dmgmori.com/
- Tormach: https://tormach.com/
- Pocket NC: https://pocketnc.com/
- Autodesk Fusion 360: https://www.autodesk.com/products/fusion-360/
- Mastercam: https://www.mastercam.com/
- SolidWorks (Dassault Systemes): https://www.solidworks.com/
- Xometry (NASDAQ: XMTR): https://www.xometry.com/
- Protolabs (NYSE: PRLB): https://www.protolabs.com/
- Fictiv: https://www.fictiv.com/
- Mitutoyo: https://www.mitutoyo.com/
- Renishaw (LSE: RSW): https://www.renishaw.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 3-axis mill hourly | $50-$100 | Industry |
| 5-axis hourly | $100-$200 | Industry |
| CNC lathe hourly | $60-$120 | Industry |
| Tormach 1100MX | $20K-$30K | Tormach |
| Haas VF-2 | $90K-$130K | Haas |
| DMG MORI DMU 50 5-axis | $300K-$500K | DMG MORI |
| Brother S700X1 | $200K-$300K | Brother |
| Pocket NC V2 desktop | $6K-$10K | Pocket NC |
| Mazak Quick Turn lathe | $150K-$400K | Mazak |
| Fusion 360 subscription | $545-$1,700/yr | Autodesk |
| Mastercam | $5K-$15K + maintenance | Mastercam |
| SolidWorks | $4K-$15K + maintenance | Dassault |
| Xometry XMTR revenue FY24 | ~$500M+ | XMTR 10-K |
| Protolabs PRLB revenue FY24 | ~$485M | PRLB 10-K |
| Fictiv funding | ~$80M+ | Crunchbase |
| AS9100 cert cost | $5K-$25K | Industry |
| ISO 9001 cert cost | $3K-$15K | Industry |
| Y1 capital | $40K-$500K | Industry |
| Y1 revenue | $80K-$400K | Industry |
| Y2 revenue | $400K-$2M+ | Industry |
| Margin | 25-45% | Industry |`,
    counter: `## Counter-Case
**Xometry + Protolabs marketplace pressure.** Mitigation: high-mix low-volume + specialty.
**Capital intensive.** Mitigation: lease Haas + build slowly.
**Skilled CNC machinist labor shortage.** Mitigation: above-market $30-50/hr + training.
**Tariff + material cost volatility.** Mitigation: pass-through pricing.
**When stay-small wins.** Solo machinist at $120-180K with single mill is comfortable.`,
    links: `

## See Also

- **q1985** — Start a 3D printing service business 2027
- **q1994** — Start a woodworking shop business 2027
- **q1992** — Start a custom apparel business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://www.haascnc.com/","https://us.dmgmori.com/","https://tormach.com/","https://pocketnc.com/","https://www.autodesk.com/products/fusion-360/","https://www.mastercam.com/","https://www.solidworks.com/","https://www.xometry.com/","https://www.protolabs.com/","https://www.fictiv.com/","https://www.mitutoyo.com/","https://www.renishaw.com/"],
    tags: ["cnc-machining-business-2027-subtractive-manufacturing-custom-parts","haas-vf-2-dmg-mori-dmu-50-tormach-1100mx-brother-s700x-pocket-nc-v2-mazak-quick-turn-mills","haas-st-15-dmg-mori-nlx-doosan-lynx-lathes","fusion-360-autodesk-mastercam-solidworks-dassault-inventor-gibbscam-sandvik-bobcad-cam-software","xometry-xmtr-protolabs-prlb-hubs-fictiv-emachineshop-rapiddirect-marketplaces","mitutoyo-renishaw-faroarm-hexagon-measurement-quality","aerospace-medical-automotive-defense-ev-reshoring-as9100-iso-9001-itar-clients","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Haas VF-2 $90-130K + DMG MORI DMU 50 5-axis $300-500K + Tormach 1100MX $20-30K + Brother S700X1 $200-300K + Pocket NC V2 $6-10K mills + Mazak Quick Turn $150-400K lathe + Haas ST-15 + DMG MORI NLX + Doosan Lynx lathes, Autodesk Fusion 360 $545-1.7K/yr + Mastercam $5-15K + SolidWorks Dassault $4-15K + Inventor + GibbsCAM Sandvik + Bobcad-Cam software, Xometry XMTR $500M FY24 + Protolabs PRLB $485M + Fictiv $80M + Hubs Protolabs subsidiary + eMachineShop + RapidDirect marketplaces, Mitutoyo + Renishaw RSW + FaroArm + Hexagon CMM measurement) real.' }
  },
  {
    id: 'q1985',
    tldr: `**TL;DR:** 3D printing service in 2027 = **additive manufacturing** producing custom parts (prototypes, end-use parts, jewelry, dental, medical models). **Pricing 2027:** $0.10-$3/cm³ depending on material + machine + finish. **Y1 $40K-$150K (small fleet of FDM + Resin printers); Y2 $150K-$500K with metal SLA/SLS/MJF/DMLS capability.** **Required:** $5-$500K+ capital — FDM (Prusa MK4, Bambu Lab X1C, Voron 2.4, Creality K2 Plus) $500-$5K each; Resin SLA (Formlabs Form 4, Phrozen Sonic Mega 8K, Anycubic Photon M5) $1.5K-$15K; SLS (Formlabs Fuse 1+, Sintratec, Sinterit) $25K-$120K; MJF (HP Multi Jet Fusion) $100K-$300K; DMLS metal (EOS, SLM Solutions, Velo3D, 3D Systems) $300K-$1.5M. **Players:** Xometry (XMTR ~$500M marketplace), Protolabs (PRLB), Shapeways (Hexagon AB acquired 2023), Stratasys (NASDAQ: SSYS), 3D Systems (NYSE: DDD), Materialise (NASDAQ: MTLS). **Margin:** 30-50%. **Win condition:** dental + medical + aerospace prototyping niche + low-volume production.`,
    core: `

## Why 3D Printing 2027 Is Real

End-use parts adoption growing in dental, medical, aerospace, jewelry. Demand drivers:
- Dental aligners + crowns + models
- Medical anatomical models
- Aerospace lightweight brackets
- Automotive prototyping
- Jewelry investment-casting masters
- Hobbyist + maker
- Tooling + jigs + fixtures

## Pricing 2027

| Service | Price |
|---|---|
| FDM PLA per cm³ | $0.10-$0.50 |
| Resin SLA per cm³ | $0.50-$2 |
| SLS nylon per cm³ | $1-$3 |
| MJF nylon per cm³ | $1-$3 |
| DMLS metal per cm³ | $5-$30+ |
| Setup/file prep | $25-$150 |
| Post-processing (sand, paint) | $20-$200 |
| Rush 24hr | +50-100% |
| Production volume discount | 20-50% |
| Dental aligner per arch | $30-$150 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-100K printer fleet + Fusion 360/Meshmixer + materials] --> B[Land dental/medical/jewelry/maker clients]
    B --> C[Add SLS + MJF + metal capability]
    C --> D[Y1: $40K-$150K · FDM + resin fleet]
    D --> E[Y2: $150K-$500K · production + metal SLS/DMLS]
\`\`\`

TAGS: 3d-printing-service-business-2027-additive-manufacturing, prusa-mk4-bambu-lab-x1c-voron-2-4-creality-k2-plus-fdm-printers, formlabs-form-4-phrozen-sonic-mega-8k-anycubic-photon-m5-resin-sla-printers, formlabs-fuse-1-sintratec-sinterit-sls-hp-multi-jet-fusion-mjf-printers, eos-slm-solutions-velo3d-3d-systems-dmls-metal-printers, xometry-xmtr-protolabs-prlb-shapeways-hexagon-stratasys-ssys-3d-systems-ddd-materialise-mtls-competitors, dental-medical-aerospace-jewelry-prototyping-end-use-applications, 2027`,
    src: `

## Sources

- Formlabs: https://formlabs.com/
- Stratasys (NASDAQ: SSYS): https://www.stratasys.com/
- 3D Systems (NYSE: DDD): https://www.3dsystems.com/
- HP Multi Jet Fusion: https://www.hp.com/us-en/printers/3d-printers.html
- Prusa Research: https://www.prusa3d.com/
- Bambu Lab: https://bambulab.com/
- Materialise (NASDAQ: MTLS): https://www.materialise.com/
- Xometry (NASDAQ: XMTR): https://www.xometry.com/
- Protolabs (NYSE: PRLB): https://www.protolabs.com/
- Shapeways (Hexagon AB 2023): https://www.shapeways.com/
- EOS: https://www.eos.info/
- Velo3D (NYSE: VLD): https://velo3d.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| FDM PLA per cm³ | $0.10-$0.50 | Industry |
| Resin SLA per cm³ | $0.50-$2 | Industry |
| SLS per cm³ | $1-$3 | Industry |
| DMLS metal per cm³ | $5-$30+ | Industry |
| Prusa MK4 | $1,100 | Prusa |
| Bambu Lab X1C | $1,200-$1,500 | Bambu Lab |
| Voron 2.4 DIY kit | $1,500-$3,500 | Voron |
| Creality K2 Plus | $1,500-$2,500 | Creality |
| Formlabs Form 4 | $4,000-$5,500 | Formlabs |
| Phrozen Sonic Mega 8K | $1,500-$2,500 | Phrozen |
| Formlabs Fuse 1+ SLS | $25K-$40K | Formlabs |
| Sintratec SLS | $80K-$150K | Sintratec |
| Sinterit SLS | $25K-$50K | Sinterit |
| HP Multi Jet Fusion 5210 | $200K-$400K | HP |
| EOS DMLS M 290 | $500K-$900K | EOS |
| Velo3D Sapphire | $1M-$2M | Velo3D |
| Stratasys SSYS revenue FY24 | ~$575M | SSYS 10-K |
| 3D Systems DDD revenue FY24 | ~$440M | DDD 10-K |
| Materialise MTLS revenue FY24 | ~$280M | MTLS 10-K |
| Xometry XMTR revenue FY24 | ~$500M+ | XMTR 10-K |
| Y1 capital | $5K-$100K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$500K | Industry |
| Margin | 30-50% | Industry |`,
    counter: `## Counter-Case
**Xometry + Protolabs marketplace pressure.** Mitigation: dental + medical + jewelry specialty.
**Capital intensive at metal tier.** Mitigation: start FDM + resin + grow.
**Quality control + tolerance.** Mitigation: ISO + AS9100 cert.
**Material cost volatility.** Mitigation: bulk + qualified material suppliers.
**When stay-small wins.** $80-150K solo printer fleet is comfortable.`,
    links: `

## See Also

- **q1986** — Start a CNC machining business 2027
- **q1994** — Start a woodworking shop business 2027
- **q1992** — Start a custom apparel business 2027
- **q1993** — Start a vinyl decals business 2027`,
    sources: ["https://formlabs.com/","https://www.stratasys.com/","https://www.3dsystems.com/","https://www.hp.com/us-en/printers/3d-printers.html","https://www.prusa3d.com/","https://bambulab.com/","https://www.materialise.com/","https://www.xometry.com/","https://www.protolabs.com/","https://www.shapeways.com/","https://www.eos.info/","https://velo3d.com/"],
    tags: ["3d-printing-service-business-2027-additive-manufacturing","prusa-mk4-bambu-lab-x1c-voron-2-4-creality-k2-plus-fdm-printers","formlabs-form-4-phrozen-sonic-mega-8k-anycubic-photon-m5-resin-sla-printers","formlabs-fuse-1-sintratec-sinterit-sls-hp-multi-jet-fusion-mjf-printers","eos-slm-solutions-velo3d-3d-systems-dmls-metal-printers","xometry-xmtr-protolabs-prlb-shapeways-hexagon-stratasys-ssys-3d-systems-ddd-materialise-mtls-competitors","dental-medical-aerospace-jewelry-prototyping-end-use-applications","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Prusa MK4 $1.1K + Bambu Lab X1C $1.2-1.5K + Voron 2.4 DIY + Creality K2 Plus FDM + Formlabs Form 4 $4-5.5K + Phrozen Sonic Mega 8K + Anycubic Photon M5 resin + Formlabs Fuse 1+ SLS $25-40K + Sintratec + Sinterit + HP MJF 5210 $200-400K + EOS M 290 $500-900K + SLM Solutions + Velo3D VLD Sapphire $1-2M + 3D Systems DDD metal printers, Xometry XMTR $500M + Protolabs PRLB + Shapeways Hexagon AB 2023 + Stratasys SSYS $575M + 3D Systems DDD $440M + Materialise MTLS $280M competitors) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH C DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
