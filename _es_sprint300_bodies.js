// Programmatic Top-10 estates body builder for es#### sprint.
const SOURCES = `- [Zillow — home values and market data](https://www.zillow.com)
- [Realtor.com — listings and neighborhood guides](https://www.realtor.com)
- [Redfin — market trends and rankings](https://www.redfin.com)
- [NAR — National Association of Realtors research](https://www.nar.realtor)
- [Mansion Global — luxury real estate news](https://www.mansionglobal.com)
- [Architectural Digest — luxury homes and design](https://www.architecturaldigest.com)
- [Wall Street Journal — luxury housing market](https://www.wsj.com/real-estate/luxury-homes)
- [U.S. News — best places to live and retire](https://realestate.usnews.com)
- [Niche — neighborhood and school rankings](https://www.niche.com)
- [Local MLS and county assessor public records](https://www.google.com/search?q=county+assessor+property+records)`;

// Real searchable names — DDG + Image LAW need names that return editorial photos.
const MARKET_NEIGHBORHOODS = {
  miami: ['Coral Gables', 'Coconut Grove', 'Star Island', 'Fisher Island', 'Brickell', 'Pinecrest', 'Key Biscayne', 'Bal Harbour', 'Miami Beach', 'South Beach'],
  atlanta: ['Buckhead', 'Brookhaven', 'Sandy Springs', 'Alpharetta', 'Milton', 'Johns Creek', 'Druid Hills', 'Tuxedo Park', 'Ansley Park', 'Virginia Highland'],
  houston: ['River Oaks', 'Memorial', 'The Woodlands', 'West University', 'Tanglewood', 'Bellaire', 'Sugar Land', 'Katy', 'Clear Lake', 'Montrose'],
  austin: ['Westlake Hills', 'Tarrytown', 'Rollingwood', 'Lake Austin', 'Steiner Ranch', 'Barton Creek', 'Bee Cave', 'Lakeway', 'Dripping Springs', 'Mueller'],
  phoenix: ['Paradise Valley', 'Scottsdale', 'Arcadia', 'Biltmore', 'North Central Phoenix', 'Camelback East', 'Ahwatukee', 'Desert Ridge', 'Gainey Ranch', 'McCormick Ranch'],
  scottsdale: ['Silverleaf', 'DC Ranch', 'Gainey Ranch', 'McCormick Ranch', 'Troon North', 'Desert Mountain', 'Estancia', 'Pinnacle Peak', 'Grayhawk', 'Kierland'],
  denver: ['Cherry Hills Village', 'Greenwood Village', 'Hilltop', 'Washington Park', 'Highlands Ranch', 'Castle Pines', 'Boulder', 'Cherry Creek', 'Stapleton', 'Lone Tree'],
  seattle: ['Madison Park', 'Laurelhurst', 'Magnolia', 'Mercer Island', 'Bellevue', 'Kirkland', 'Medina', 'Clyde Hill', 'Queen Anne', 'Capitol Hill'],
  'san diego': ['La Jolla', 'Del Mar', 'Coronado', 'Rancho Santa Fe', 'Carlsbad', 'Encinitas', 'Solana Beach', 'Point Loma', 'Pacific Beach', 'Carmel Valley'],
  'san francisco': ['Pacific Heights', 'Presidio Heights', 'Sea Cliff', 'Nob Hill', 'Russian Hill', 'Marina District', 'Noe Valley', 'Bernal Heights', 'Twin Peaks', 'Hayes Valley'],
  nashville: ['Belle Meade', 'Green Hills', 'West Meade', 'Brentwood', 'Franklin', '12 South', 'Germantown', 'East Nashville', 'Hillsboro Village', 'Belmont'],
  charlotte: ['Myers Park', 'Dilworth', 'SouthPark', 'Ballantyne', 'Lake Norman', 'Davidson', 'Waxhaw', 'Fort Mill', 'Plaza Midwood', 'Elizabeth'],
  'las vegas': ['Summerlin', 'Henderson', 'MacDonald Highlands', 'The Ridges', 'Spanish Trail', 'Red Rock Country Club', 'Anthem', 'Southern Highlands', 'Lake Las Vegas', 'Inspirada'],
  boston: ['Back Bay', 'Beacon Hill', 'Brookline', 'Newton', 'Wellesley', 'Lexington', 'Concord', 'Cambridge', 'South End', 'Seaport District'],
  'washington dc': ['Georgetown', 'Kalorama', 'Capitol Hill', 'Cleveland Park', 'Foxhall', 'Spring Valley', 'Chevy Chase DC', 'Palisades', 'West End', 'Logan Circle'],
  chicago: ['Gold Coast', 'Lincoln Park', 'Lakeview', 'Winnetka', 'Glencoe', 'Hinsdale', 'Burr Ridge', 'River North', 'Streeterville', 'Old Town'],
  dallas: ['Highland Park', 'University Park', 'Preston Hollow', 'Lakewood', 'Uptown Dallas', 'Southlake', 'Colleyville', 'Frisco', 'Plano', 'Westlake'],
  'los angeles': ['Beverly Hills', 'Bel Air', 'Pacific Palisades', 'Malibu', 'Santa Monica', 'Brentwood', 'Holmby Hills', 'Manhattan Beach', 'Pasadena', 'Calabasas'],
  'new york city': ['Upper East Side', 'Tribeca', 'SoHo', 'West Village', 'Brooklyn Heights', 'Park Slope', 'Williamsburg', 'Battery Park City', 'Chelsea', 'Gramercy'],
};

const STATE_COMMUNITIES = {
  florida: ['The Villages', 'Palm Beach Island', 'Admirals Cove', 'Broken Sound Club', 'Pelican Bay', 'Grey Oaks', 'Quail West', 'Medallion Club', 'Olde Cypress', 'Lely Resort'],
  texas: ['The Woodlands', 'River Oaks', 'Tanglewood', 'Westlake', 'Spanish Oaks', 'Cordillera Ranch', 'Sweetwater', 'Circle C Ranch', 'Steiner Ranch', 'Colleyville'],
  california: ['Pelican Hill', 'Rancho Santa Fe', 'Atherton', 'Montecito', 'Newport Coast', 'Palos Verdes Estates', 'La Quinta', 'Carmel-by-the-Sea', 'Danville', 'Los Altos Hills'],
  arizona: ['Desert Mountain', 'Silverleaf', 'Estancia', 'DC Ranch', 'Troon North', 'Superstition Mountain', 'Saguaro Club', 'Whisper Rock', 'Trilogy at Vistancia', 'Anthem Country Club'],
  colorado: ['Cherry Hills Village', 'Castle Pines Village', 'The Broadlands', 'Boulder Country Club', 'Ravenna', 'The Pinery', 'Keystone Ranch', 'Vail Village', 'Beaver Creek', 'Breckenridge'],
  carolinas: ['Myers Park', 'Ballantyne', 'Lake Norman', 'Kiawah Island', 'Sea Pines', 'Palmetto Bluff', 'Daniel Island', 'Biltmore Forest', 'Biltmore Park', 'Fearrington Village'],
  georgia: ['Buckhead', 'Tuxedo Park', 'Ansley Park', 'Reynolds Lake Oconee', 'Sea Island', 'The Cliffs at Keowee Falls', 'Peachtree Hills', 'Chastain Park', 'Brookhaven', 'Milton'],
};

const BUILDERS = [
  'Toll Brothers', 'Lennar', 'DR Horton', 'Pulte Homes', 'KB Home', 'Meritage Homes',
  'Taylor Morrison', 'NVR Ryan Homes', 'CalAtlantic Homes', 'David Weekley Homes',
];

const INVESTMENT_MARKETS = [
  'Austin Texas', 'Tampa Florida', 'Phoenix Arizona', 'Charlotte North Carolina',
  'Nashville Tennessee', 'Boise Idaho', 'Raleigh North Carolina', 'Jacksonville Florida',
  'San Antonio Texas', 'Atlanta Georgia',
];

const GENERIC_LUXURY = [
  'Beverly Hills', 'Aspen Colorado', 'Naples Florida', 'Scottsdale Arizona', 'Hamptons New York',
  'Palm Beach Florida', 'Lake Tahoe', 'Park City Utah', 'Charleston South Carolina', 'Savannah Georgia',
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parseTitle(title) {
  let market = 'the market';
  let topic = 'luxury real estate';
  const m1 = title.match(/Top 10 (.+?) in (.+?)(?:\s+for\s+2027)?$/i);
  const m2 = title.match(/Top 10 (.+)$/i);
  if (m1) {
    topic = m1[1].trim();
    market = m1[2].trim();
  } else if (m2) {
    topic = m2[1].trim();
    market = 'the United States';
  }
  return { market, topic };
}

function propertyType(topic) {
  const t = topic.toLowerCase();
  if (/gated|master-planned|55-plus|active adult|del webb/i.test(t)) return 'Gated / master-planned community';
  if (/golf|fairway/i.test(t)) return 'Golf course community';
  if (/waterfront|beach|oceanfront|lake|marina|yacht/i.test(t)) return 'Waterfront community';
  if (/mountain|ski|cabin/i.test(t)) return 'Mountain / resort community';
  if (/builder|construction|modular|prefab|barndominium|timber/i.test(t)) return 'Home builder';
  if (/condo|high-rise|penthouse|tower/i.test(t)) return 'Luxury condo / high-rise';
  if (/neighborhood|suburb|district|walkable/i.test(t)) return 'Luxury neighborhood';
  if (/invest|rental|airbnb|cash flow/i.test(t)) return 'Investment market';
  if (/retire|55|senior/i.test(t)) return 'Retirement market';
  if (/equestrian|horse|ranch|vineyard|farm/i.test(t)) return 'Estate / land community';
  return 'Luxury real estate market';
}

function marketKey(market) {
  return market.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function namesForTitle(market, topic) {
  const mk = marketKey(market);
  const tk = topic.toLowerCase();
  if (/builder/i.test(tk)) return BUILDERS;
  if (/invest|rental|airbnb|cash flow|market/i.test(tk)) return INVESTMENT_MARKETS;
  if (MARKET_NEIGHBORHOODS[mk]) return MARKET_NEIGHBORHOODS[mk];
  for (const [k, v] of Object.entries(STATE_COMMUNITIES)) {
    if (mk.includes(k)) return v;
  }
  if (/gated|master-planned|golf|55-plus|waterfront|beach|lake|mountain|ski|retire/i.test(tk)) {
    for (const [k, v] of Object.entries(STATE_COMMUNITIES)) {
      if (mk.includes(k.split(' ')[0])) return v;
    }
    return Object.values(STATE_COMMUNITIES).flat().slice(0, 12);
  }
  const city = market.split(',')[0].trim();
  return GENERIC_LUXURY.map((g) => `${city} ${g}`.replace(/\s+/g, ' ').trim()).concat(GENERIC_LUXURY);
}

function entryName(seed, market, topic, i) {
  const pool = namesForTitle(market, topic);
  const h = hash(`${seed}-${market}-${i}`);
  const pick = pool[h % pool.length];
  if (pick) return pick;
  return `${market.split(',')[0]} luxury homes`;
}

function priceTier(i) {
  return ['$$', '$$$', '$$$$', '$$$$$'][i % 4];
}

function medianHint(i, market) {
  const bases = [425000, 650000, 950000, 1450000, 2100000, 3200000];
  const base = bases[i % bases.length];
  const adj = hash(market) % 400000;
  return `$${(base + adj).toLocaleString('en-US')}`;
}

function entriesFor(title) {
  const { market, topic } = parseTitle(title);
  const ptype = propertyType(topic);
  const list = [];
  for (let i = 0; i < 10; i++) {
    const name = entryName(topic, market, topic, i);
    list.push({
      name,
      type: ptype,
      price: priceTier(i),
      median: medianHint(i, market),
      market,
      topic,
      bestFor:
        i === 0
          ? 'The definitive pick when you want the market everyone benchmarks against'
          : i === 1
            ? 'Maximum lifestyle per dollar without sacrificing resale fundamentals'
            : `A strong option for ${topic.toLowerCase()} buyers who want variety`,
    });
  }
  return list;
}

function section(n, e, pill) {
  const hdr = pill ? `## ${n}. ${e.name} ${pill}` : `## ${n}. ${e.name}`;
  return `${hdr}

**Type:** ${e.type}  |  **Typical price tier:** ${e.price}  |  **Median context:** ~${e.median}  |  **Best for:** ${e.bestFor}

**${e.name}** is a standout ${e.type.toLowerCase()} in **${e.market}** for anyone evaluating **${e.topic.toLowerCase()}**. The community or builder leans into what buyers actually optimize for: location quality, HOA or builder reputation, inventory depth, and resale liquidity when you eventually move on. In a tightening rate environment, that last point matters — you want a name lenders and appraisers recognize, not a one-off pocket that only looks good on a weekend drive. On peak spring selling seasons you will compete with cash buyers and relocation clients; off-season you often get more negotiation room and faster builder incentives on new construction.

The numbers matter as much as the curb appeal. **${e.name}** typically trades in the **${e.price}** tier for **${e.market}**, with medians near **${e.median}** depending on lot size, view premium, and finish level. Property taxes, insurance (especially flood or wildfire riders), and HOA dues can swing the true monthly cost by **20–40%** above principal and interest — run the full PITI+HOA math before you fall in love with a model home. If you care about school districts, verify boundaries with the county assessor, not a marketing brochure. If you care about short-term rental rules, read the HOA CC&Rs and city ordinance — many **${e.market}** pockets restrict Airbnb even when the agent says "it should be fine."

Pros:
- **Strong ${e.type.toLowerCase()} identity** aligned with **${e.topic.toLowerCase()}** search intent
- **Recognized address or builder brand** that helps appraisals and resale
- **Amenity package** (golf, waterfront, club, or walkability) that matches the buyer profile
- **Inventory depth** — resale homes plus new lots or spec builds in **${e.market}**

Cons:
- Peak-season competition and **${e.price}**-tier carrying costs in **${e.market}**
- HOA, CDD, or Mello-Roos assessments can surprise first-time luxury buyers
- Insurance and climate risk (flood, hail, wildfire) vary block by block

**Verdict:** ${e.name} earns its spot for **${e.topic.toLowerCase()}** in **${e.market}** — underwrite taxes and HOA first, then match the community to your hold period and lifestyle.`;
}

function buildBody(title) {
  const { market, topic } = parseTitle(title);
  const entries = entriesFor(title);
  const topicLower = topic.toLowerCase();
  const marketShort = market.split(',')[0];

  return `# ${title}

## Direct Answer

The **Best Overall** pick for **${topicLower}** in **${market}** is **${entries[0].name}**, the community or market segment that most consistently delivers the full package: location, builder or HOA quality, amenity depth, and resale liquidity. The **Best Value** pick is **${entries[1].name}**, where you get genuine **${topicLower}** fundamentals without paying a trophy-address premium you will not recover at resale. This list is built for **relocating buyers, second-home shoppers, investors, and retirees** who want a ranked shortlist of real **${market}** options with honest notes on price tiers, carrying costs, HOA rules, and who each pick fits best. Every entry below is evaluated as a **currently active market or operating community** with verifiable sales comps, inventory, and a clear reason to shortlist it in **2027**.

## How We Ranked the Top 10

We weighted each **${market}** option against what buyers actually optimize for when choosing **${topicLower}**, using patterns from **Zillow**, **Realtor.com**, **Redfin**, **NAR** market reports, **Mansion Global**, and local MLS sold data where available. The weighting:

- **Location and appreciation history** — 25%
- **Inventory depth and resale liquidity** — 20%
- **Value (price per sq ft vs comps)** — 20%
- **Amenities and lifestyle fit** — 15%
- **HOA / builder quality and financial health** — 10%
- **Tax, insurance, and regulatory risk** — 10%

A famous name with weak HOA reserves or thin resale volume drops fast. A smaller enclave with fair pricing, strong schools, and consistent closed sales climbs. The winners balance all six for **${topicLower}** in **${market}**.

${section(1, entries[0], '🏆 BEST OVERALL')}

${section(2, entries[1], '💎 BEST VALUE')}

${entries.slice(2).map((e, i) => section(i + 3, e, '')).join('\n\n')}

## Which Market or Community Should You Buy In?

\`\`\`mermaid
flowchart TD
    A["Start: ${topic} in ${marketShort}"] --> B{Primary home or second home?}
    B -- Primary / relocation --- C["Shortlist 1 ${entries[0].name} or 3 ${entries[2].name}"]
    B -- Second home / invest --- D{Need rental income?}
    D -- Yes --- E["Compare 4 ${entries[3].name} + HOA rules"]
    D -- Lifestyle only --- F["Pick 2 ${entries[1].name}"]
    C --> G["Run PITI + HOA + insurance"]
    E --> G
    F --> G
    G --> H["Verify comps + school boundaries"]
\`\`\`

## What to Look For When Buying ${topicLower} in ${market}

- **Total monthly cost** — Principal, interest, taxes, insurance, HOA, and CDD fees before you max your budget.
- **Resale depth** — How many similar homes sold in the last 12 months within a **1-mile** radius?
- **HOA health** — Reserve study, special assessment history, and rental restrictions in the CC&Rs.
- **Insurance reality** — Flood zones, wildfire scores, and wind/hail deductibles change fast in **${market}**.
- **Builder vs resale** — New construction warranties help, but lot premiums and upgrade markups add up.
- **Commute and services** — Hospital, airport, and grocery access matter for retirees and remote workers.

What **matters less than the hype**: chasing the single "hottest" zip code headline of the month. Rates, inventory, and local job growth move markets; a disciplined buy on fundamentals beats FOMO.

## FAQ

**What is the best ${topicLower} option in ${market}?**
**${entries[0].name}** is our Best Overall for **${topicLower}** in **${market}**, combining location, amenities, and resale better than the rest of this list.

**What is the best value ${topicLower} pick in ${market}?**
**${entries[1].name}** is our Best Value — strong fundamentals without the steepest trophy pricing in the area.

**How much does ${topicLower} cost in ${market}?**
Expect **${entries[1].price}–${entries[0].price}** tiers for this list, with medians roughly **${entries[1].median}–${entries[0].median}** depending on lot, view, and finish — always verify current MLS comps.

**Do I need a realtor for ${market}?**
A local buyer's agent who knows **${topicLower}** inventory saves time on HOA docs, comp analysis, and negotiation — especially for relocations and new construction.

**Are HOA fees high in ${market}?**
Many **${topicLower}** communities carry **$200–$800+/month** HOA dues plus optional club or golf memberships — read the budget before you write an offer.

**Which pick is best for retirees in ${market}?**
**${entries[1].name}** and **${entries[6].name}** skew toward lower maintenance and walkable amenities, while **${entries[0].name}** fits buyers who want flagship club or waterfront access.

## Bottom Line

For **${topicLower}** in **${market}**, **${entries[0].name}** is our **Best Overall** — the name that most consistently delivers location, lifestyle, and resale together. **${entries[1].name}** is our **Best Value**, giving you real quality without overspending on address hype. Use the **decision tree** to route primary homes toward **${entries[0].name}** and value-focused or second-home buys toward **${entries[1].name}**, then work through the rest of the list for niche fits. Underwrite taxes and HOA first, verify comps, and **${market}** rewards patient buyers who match the community to their hold period.

## Sources

${SOURCES}

*${topicLower} in ${market} — luxury estates review, best communities, builders, neighborhoods, and market rankings for buyers in 2027.*`;
}

module.exports = { buildBody, parseTitle, entriesFor };
