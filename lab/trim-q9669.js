const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const { getStore } = require('@netlify/blobs');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await store.get('answers/q9669.json', { type: 'json' });
  const a = e.answer;
  const src_idx = a.indexOf('## Sources');
  const tldr_end = a.indexOf('A **food truck business**');
  const toc_start = a.indexOf('## 🗺️');
  const part1 = a.indexOf('## 📐 PART 1');
  const flow_start = a.indexOf('## The Operating Journey');
  const tail = a.substring(src_idx);

  const slimTldr = `**TL;DR:** Starting a **food truck business in 2027** -- a state-and-local-permitted self-contained mobile food kitchen run from a step-van truck or towable trailer serving prepared food at brewery rotations, corporate Fridays, festivals, weddings, and street locations -- means navigating three regulatory pillars: state mobile food vendor / retail food establishment license ($100-$500/yr + ServSafe Manager cert), local city or county health department mobile food unit permit ($150-$2,500/yr + plan review + 1-4x/yr inspection), and a commissary kitchen affidavit required in 44 of 50 states ($400-$1,500/mo shared or $1,500-$3,000/mo coastal). City-specific permits (NYC Mobile Food Vending Permit lottery, LA Bureau of Street Services, SF Mobile Food Facility restricted zones, Austin permit cap, Portland food cart pods, Miami-Dade, Chicago two-tier) are the binding constraint. Capital is **$80K-$200K** for a used step van retrofit (Freightliner MT45/MT55, Workhorse W42, Grumman Olson chassis $25K-$65K + $40K-$90K build-out: Type-1 hood + Ansul R-102 fire suppression + 6-burner range + flat-top + fryer + reach-in refrigeration + 3-comp sink + Honda EU7000is generator + propane + POS) or **$200K-$450K** new custom build (Cruising Kitchens, M&R Specialty Trailers, Apollo Custom Manufacturing, United Food Truck Builders, Concession Nation), with bookings sourced via brewery rotations (2-5 nights/wk anchor), corporate Fridays ($1,800-$4,200/shift direct or via Roaming Hunger/MOGL/BestFoodTrucks 10-20% commission), wedding catering ($1,800-$8,500/event highest margin), festivals, and farmers markets. The economics: **mature owner-operator truck 28-38% gross + 10-22% net at $11-$18 avg ticket + 80-180 covers/day + $180K-$540K/yr revenue**; mature 3-5 truck mini-fleet 12-20% blended EBITDA at $600K-$2.5M revenue if catering pipeline anchors. Exit at 1.5-3.0x SDE single truck or 3.0-5.0x EBITDA mini-fleet; rare brand graduations to franchise (Cousins Maine Lobster, The Halal Guys, Kogi BBQ) or brick-and-mortar conversion. The hardest part is **weather + seasonality + permit lottery + commissary scarcity + commission compression + owner burnout** (one rainy Saturday = 50% revenue loss; Nov-Feb Northern death zone; NYC/LA/SF/Austin permit waitlists; Roaming Hunger/BestFoodTrucks 10-20% + DoorDash/Uber Eats 18-30% margin-negative; food cost inflation 30-60% post-COVID; CA Advanced Clean Fleets EV transition 2025+; Instagram algorithm collapse; 14-hr days driving 30-50% Year 1-3 exit).`;

  const bottomLine = a.substring(tldr_end, toc_start);
  const toc = a.substring(toc_start, part1);

  let body = a.substring(part1, flow_start);
  body = body.replace(/\*\*Trade associations \+ advocacy\.\*\* \*\*National Food Truck Association \(NFTA\)\*\*[^\n]*\n\n/, '');
  body = body.replace(/\*\*Cuisine fit \+ cost structure\.\*\* \*\*Tacos, burgers[^\n]*\n\n/, '');
  body = body.replace(/\*\*Dietary breadth\.\*\* \*\*One vegetarian[^\n]*\n\n/, '');
  body = body.replace(/\*\*Crowdfunding \+ community\.\*\* \*\*Kickstarter[^\n]*\n\n/, '');
  body = body.replace(/\*\*Brewery \+ venue social cross-promotion\.\*\*[^\n]*\n\n/, '');
  body = body.replace(/\*\*Inventory \+ food cost\.\*\* \*\*MarketMan[^\n]*\n\n/, '');
  body = body.replace(/\*\*Marketing CRM\.\*\* \*\*Mailchimp[^\n]*\n\n/, '');
  body = body.replace(/\*\*Festival \+ community word-of-mouth\.\*\*[^\n]*\n\n/, '');
  body = body.replace(/\*\*Asset wind-down\.\*\*[^\n]*\n\n/, '');
  body = body.replace(/\*\*Acquihire by restaurant group\.\*\*[^\n]*\n\n/, '');

  let flow = a.substring(flow_start, src_idx);
  const decisionIdx = flow.indexOf('## The Decision Matrix');
  const firstMermaidBlock = flow.substring(0, decisionIdx);

  const shortSecondMermaid = [
    '## The Decision Matrix: Truck vs Trailer vs Mini-Fleet + Cuisine + Channel Selection',
    '',
    '```mermaid',
    'flowchart TD',
    '  A[Food Truck Founder] --> B{Truck vs Trailer vs Mini-Fleet vs Acquisition}',
    '  B -->|Used Step Van Retrofit| C[Used Retrofit $80K-$155K]',
    '  B -->|New Custom Truck| D[New Custom $200K-$450K]',
    '  B -->|Towable Trailer + Tow| E[Trailer $55K-$180K]',
    '  B -->|2-Truck Mini-Fleet Day 1| F[Mini-Fleet $200K-$500K]',
    '  B -->|Acquire Existing| G[Acquisition 1.5-3.0x SDE]',
    '  C --> H{Cuisine + Channel Mix}',
    '  D --> H',
    '  E --> H',
    '  F --> H',
    '  G --> H',
    '  H -->|Tacos/Burgers/BBQ/Birria High-Velocity| I[80-180 covers/day $11-$18 ticket]',
    '  H -->|Lobster Roll/Pierogi/Ramen Niche Premium| J[60-140 covers $15-$24 premium]',
    '  H -->|Vegan/Plant-Based Dietary Specialty| K[40-100 covers loyal niche]',
    '  H -->|Dessert/Coffee/Boba Lower Tier| L[120-280 cups $5-$9 ticket]',
    '  H -->|Full Pasta/Sushi AVOID Slow| M[AVOID slow cuisine]',
    '  I --> N{Year 2 Reassess Exit Decision}',
    '  J --> N',
    '  K --> N',
    '  L --> N',
    '  N -->|Hold For Cash Flow| O[Long-Term Independent Hold]',
    '  N -->|Single Truck Sale 1.5-3.0x SDE| P[$45K-$180K Solo Sale]',
    '  N -->|Mini-Fleet Sale 3.0-5.0x EBITDA| Q[$200K-$1.2M Mini-Fleet]',
    '  N -->|Franchise / Licensing| R[Cousins Maine Lobster Path]',
    '  N -->|Brick-and-Mortar Conversion| S[$400K-$1.5M BAM Flagship]',
    '  N -->|Acquihire by Restaurant Group| T[$150K-$800K + Earn-Out]',
    '  N -->|Wind-Down Asset Sale| U[$25K-$90K Equipment Liquidation]',
    '```',
    '',
    ''
  ].join('\n');

  flow = firstMermaidBlock + shortSecondMermaid;

  const newAnswer = slimTldr + bottomLine + toc + body + flow + tail;
  const newWords = newAnswer.split(/\s+/).filter(Boolean).length;
  const newMermaids = (newAnswer.match(/```mermaid/g) || []).length;
  const newTables = (newAnswer.match(/\n\|[^\n]+\|\s*\n\|[\s\-:|]+\|/g) || []).length;
  const newUrls = (newAnswer.match(/https?:\/\/[^\s)\]]+/g) || []).length;
  const newCounter = (newAnswer.match(/\*\*\(\d+\)/g) || []).length;
  const newQIds = (newAnswer.match(/\[\[q\d+\]\]/g) || []).length;
  console.log('words:', newWords);
  console.log('mermaids:', newMermaids);
  console.log('tables:', newTables);
  console.log('urls:', newUrls);
  console.log('counter:', newCounter);
  console.log('q-ids:', newQIds);

  if (newWords < 8000 || newWords > 10500) {
    console.log('OUT OF RANGE — bailing without write');
    process.exit(0);
  }

  const ts = Date.now();
  const updated = Object.assign({}, e, {
    answer: newAnswer,
    ts,
    last_modified_ms: ts,
    polished_at: ts,
    polish_history: [...(e.polish_history || []), { ts, note: 'Trimmed for value-not-wordcount mandate: slim TL;DR, slim 2nd mermaid, light body trim. 12071 -> ' + newWords + ' words.', target: 10 }]
  });
  await store.setJSON('answers/q9669.json', updated);

  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === 'q9669');
  if (i >= 0) {
    idx.entries[i].ts = ts;
    idx.entries[i].last_modified_ms = ts;
    idx.entries[i].polished_at = ts;
    await store.setJSON('_index.json', idx);
  }
  console.log('WROTE q9669 at', newWords, 'words');
})().catch(err => { console.error('FATAL:', err); process.exit(1); });
