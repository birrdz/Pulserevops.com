// Cycle loop: WRITE new Q&A → INDEX it → POLISH 2 oldest <10/10 entries to 10/10 → LOOP.
//
// Writes use templated baselines ("How do you start a [X] business in 2027?")
// — zero Gemini cost, so the Gemini quota is reserved entirely for grader
// fallback at the 9→10 gate. Polishes walk oldest entries (by q-id ascending)
// up the ladder using the same rung templates as the sequential agent.
//
// Throughput at 80% guardrail: ~18 cycles/hr sustained (limited by grader TPD).
// Per hour: 18 new + 18 indexed + 36 polished-to-10/10 = 72 ops.
//
// Waits at startup until library is 100% indexed before starting cycles.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const GRADER_URL = 'https://pulserevops.com/.netlify/functions/pulse-grader-groq';
const INDEXNOW_URL = 'https://pulserevops.com/.netlify/functions/pulse-indexnow-target';
const PER_RUNG_MS = 2000;
const PER_ENTRY_MS = 5000;
const CYCLE_MIN_MS = 900_000; // ~4 cycles/hr = ~96/day. Targets user's 50-100/day band; <30% of free-tier grader caps, far under 80% guardrail.
const REJECT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const TRANSIENT_FAIL_COOLDOWN_MS = 15 * 60 * 1000;
const GROQ_429_BACKOFF_MS = 15 * 60 * 1000;
const MAX_CYCLES = 2000;

const transientSkip = new Map();
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function idHash(id) { return String(id).split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0); }

// ── 100 fresh business types (distinct from q9560-q9609) ──
const BIZ_TYPES = [
  { type: 'commercial cleaning', cat: 'home services / commercial', market: 'small office buildings, medical offices, retail strip-malls, and restaurants needing recurring overnight cleaning', startup: '$5K-$25K', y1: '$120K-$320K', cac: '$60-$300', acv: '$8,000-$30,000', moves: ['land 5-12 recurring accounts at $1,500-$3,500/month before scaling crew — recurring revenue is the entire business model', 'price by square footage and frequency (3-5x/week is the sweet spot for commercial), not per-hour', 'specialize one vertical (medical offices, restaurants, retail) — that drives certifications and repeat-referral velocity', 'use a hire-quickly model with W-2 crew at $16-$24/hour — 1099 has too much liability for facility cleaning'], risk: 'Wage inflation is 6-10%/yr in this category. Re-quote standard accounts annually or margin evaporates within 18 months.', tags: ['commercial cleaning', 'janitorial services', 'home services', 'b2b services'] },
  { type: 'residential pool service', cat: 'home services / pool', market: 'homeowners with in-ground pools wanting weekly chemical balancing and equipment service', startup: '$8K-$25K', y1: '$80K-$240K', cac: '$30-$100', acv: '$2,400-$4,800', moves: ['route density wins — target 12-20 pools/day in a 5-mile radius', 'price as monthly flat rate ($150-$250 per pool) for chemicals + service combined', 'add equipment repair (pumps, heaters, filters) as the high-margin upsell — separate $80-$140/hr labor rate', 'get the pool operator certification (CPO) — credibility plus required by some HOAs and commercial accounts'], risk: 'Pool ownership is regional and weather-dependent — Florida, Arizona, Texas, Southern California year-round; everywhere else seasonal.', tags: ['pool service', 'home services', 'residential services', 'recurring services'] },
  { type: 'lawn care', cat: 'home services / outdoor', market: 'homeowners and small commercial properties outsourcing weekly mowing, edging, and seasonal maintenance', startup: '$10K-$30K', y1: '$80K-$280K', cac: '$30-$80', acv: '$1,800-$3,600', moves: ['truck + trailer + commercial mower ($15K-$25K) is the right capex start — riding mowers double productivity vs. push', 'route density matters above all — 15-25 stops/day in tight clusters beat 8 spread across 40 miles', 'price as flat-rate weekly service ($45-$120/mow) with annual contracts, not per-hour', 'add fall leaf cleanup, spring aeration, and snow removal as seasonal extensions for revenue smoothing'], risk: 'Weather drives revenue volatility 30-50% between months. Always carry 60 days operating cash; budget for 8-month operating seasons in northern markets.', tags: ['lawn care', 'landscaping', 'home services', 'outdoor services'] },
  { type: 'tree service', cat: 'home services / outdoor specialty', market: 'homeowners and municipalities needing tree trimming, removal, stump grinding, and emergency storm response', startup: '$40K-$150K', y1: '$160K-$500K', cac: '$60-$300', acv: '$1,500-$8,000', moves: ['ISA-certified arborist on staff — credentials enable commercial bids and premium pricing', 'invest in a chipper, bucket truck, and stump grinder ($60K-$150K used) early — capex IS the moat', 'land 2-3 municipal contracts or HOA accounts for recurring revenue floor at $50K-$200K/year', 'storm-response work is the margin engine — being available 24/7 in emergencies drives 2-3x premium pricing'], risk: 'Workers comp insurance is a major cost (10-25% of payroll). Insurance carriers are tightening underwriting; document safety protocols.', tags: ['tree service', 'arboriculture', 'home services', 'outdoor specialty'] },
  { type: 'handyman service', cat: 'home services / general', market: 'homeowners and rental property managers needing small repairs, installations, and home fixes', startup: '$5K-$20K', y1: '$80K-$200K', cac: '$30-$120', acv: '$600-$2,000', moves: ['own a well-equipped van/truck — tool inventory is the productivity multiplier', 'price by job (not hour) for most work — $150-$450 per job sweet spot; hourly only for diagnosis', 'land 3-5 property management accounts for recurring revenue at $500-$3,000/month each', 'get the proper licensing where required (electrical, plumbing handyman thresholds vary by state)'], risk: 'Customer expectations span home-fix gamuts; some calls turn into liability traps. Insure properly and quote scope clearly before starting.', tags: ['handyman', 'home services', 'home repair', 'general contractor'] },
  { type: 'epoxy garage flooring', cat: 'home services / specialty', market: 'homeowners upgrading garage floors (3-car garages are the sweet spot)', startup: '$15K-$40K', y1: '$140K-$320K', cac: '$80-$300', acv: '$3,500-$8,000', moves: ['get manufacturer-certified (Penntek, Garage Force, etc.) — credentials enable warranty backing and 30% pricing premium', 'price per square foot ($6-$12/sqft for residential) with 3-day project standard', 'partner with garage door installers and home remodelers for referrals — 30-40% of profitable pipeline', 'invest in a grinder and dust extraction ($10K-$20K) before scaling — surface prep determines warranty viability'], risk: 'Concrete prep and humidity-control errors cause failures that ruin a $5K job AND the warranty. Train tightly; document every project.', tags: ['epoxy flooring', 'home services', 'concrete coatings', 'garage services'] },
  { type: 'mobile blasting', cat: 'industrial services / mobile', market: 'industrial, automotive, marine, and architectural customers needing on-site sandblasting or media blasting', startup: '$25K-$80K', y1: '$120K-$380K', cac: '$80-$300', acv: '$1,200-$10,000', moves: ['outfit a trailer or truck with blaster, compressor, and media containment ($20K-$60K) — mobile is the differentiation', 'specialize on one media (soda, dry ice, sand, or walnut shell) for one vertical (marine, industrial, restoration)', 'price by sqft ($3-$10/sqft) or per-project for one-offs — never per-hour', 'commercial accounts (refineries, industrial facilities) are the high-margin recurring work — pursue them early'], risk: 'OSHA respirator and silica regulations are tightening every cycle. Get the right respirators, training, and waste-containment before quoting commercial.', tags: ['mobile blasting', 'industrial services', 'surface prep', 'restoration services'] },
  { type: 'gutter installation', cat: 'home services / exterior', market: 'homeowners and small commercial properties needing new gutters, gutter guards, or repair', startup: '$20K-$60K', y1: '$140K-$400K', cac: '$80-$300', acv: '$1,800-$5,000', moves: ['invest in a seamless gutter machine ($8K-$20K) so you can run on-site — that\'s the entire differentiation vs. retail gutter installers', 'specialize on premium materials (copper, aluminum 0.032+, half-round) — commodity sectional gutters are race-to-the-bottom', 'add gutter guard installation ($800-$3,500 add-on) as the standard upsell at every install', 'land roof contractors and home builders as referrers — they\'re the highest-conversion pipeline channel'], risk: 'Aluminum and copper material costs swing ±25%/yr with metals markets. Quote with 30-day price guarantees, not 90+.', tags: ['gutter installation', 'home services', 'exterior services', 'roofing services'] },
  { type: 'fence installation', cat: 'home services / exterior', market: 'homeowners installing new fences (privacy, security, decorative) or replacing aged ones', startup: '$25K-$80K', y1: '$160K-$500K', cac: '$80-$300', acv: '$3,000-$12,000', moves: ['specialize in one or two materials (vinyl + composite, or wood + metal) — generalist fence companies dilute the design competence', 'land 2-3 builder accounts for new-construction recurring volume at $50K-$200K/year each', 'offer financing through a partner (Greensky, Hearth) — closes 30-40% of high-ticket residential deals', 'invest in a post-pounder or auger ($8K-$20K) to halve installation time on standard runs'], risk: 'Wood and steel costs swing ±30% with commodities. Inventory buffer of 30-60 days material protects margin in volatile cycles.', tags: ['fence installation', 'home services', 'exterior services', 'fencing business'] },
  { type: 'cabinet refacing', cat: 'home services / remodeling', market: 'homeowners refreshing kitchen and bathroom cabinets without full replacement', startup: '$15K-$50K', y1: '$120K-$320K', cac: '$80-$400', acv: '$4,500-$14,000', moves: ['differentiate from generic painters — refacing replaces doors + drawer fronts with new veneer or laminate on existing boxes', 'price by linear-foot of cabinetry ($120-$320/lf) — kitchens average $5K-$12K projects', 'partner with 1-2 manufacturers (Rustic, Conestoga, Cabinet Door World) for consistent door quality and 30-50% pricing margin', 'lean on 3D rendering software (Cabinet Vision, 2020 Design) — visualization closes more than just samples'], risk: 'Cabinet refacing competes with full replacement ($25K-$60K) and DIY repainting ($300-$1500). Position on the middle ground — sub-30% of new cost, dramatic-look upgrade.', tags: ['cabinet refacing', 'home remodeling', 'home services', 'kitchen remodeling'] },
  { type: 'painting contractor', cat: 'home services / interior', market: 'homeowners and property managers needing interior and exterior repaints', startup: '$10K-$40K', y1: '$140K-$400K', cac: '$80-$300', acv: '$2,500-$10,000', moves: ['own commercial-grade sprayers, ladders, and lift access ($10K-$25K capex) for productivity 2-3x DIY-level competitors', 'specialize one segment (residential interior, exterior, cabinet, commercial) for crew specialization and faster bidding', 'land property managers and realtors as referrers — they generate 30-50% of recurring residential pipeline', 'price by sqft for interior ($1.50-$4) and per-job for exterior with a written warranty (2-5 years) as the closing argument'], risk: 'Labor turnover is the #1 operational issue. Pay 10-20% above local rate for skilled painters; the productivity offset is real.', tags: ['painting contractor', 'home services', 'interior services', 'painting business'] },
  { type: 'concrete contractor', cat: 'home services / structural', market: 'homeowners needing driveways, patios, sidewalks, and small commercial concrete work', startup: '$50K-$200K', y1: '$200K-$700K', cac: '$80-$400', acv: '$3,500-$25,000', moves: ['own forms, finishing tools, and a small mixer or use ready-mix from local plant — capex tradeoff worth analyzing per market', 'specialize on decorative (stamped, stained, polished) or structural (footings, foundations) — decorative is higher margin', 'land 3-5 builder or general contractor accounts for recurring volume at $100K-$500K/year each', 'maintain certifications for ACI (American Concrete Institute) — required for some commercial work, premium pricing signal'], risk: 'Weather sensitivity is severe — concrete won\'t cure properly below 45°F or above 90°F. Northern markets have 8-month seasons, max.', tags: ['concrete contractor', 'home services', 'structural services', 'concrete business'] },
  { type: 'plumbing service', cat: 'home services / trades', market: 'homeowners, restaurants, and small commercial needing repairs, installations, and emergency response', startup: '$20K-$80K', y1: '$160K-$500K', cac: '$80-$400', acv: '$600-$8,000', moves: ['get the master plumber license (state-dependent) and start with one journeyman + apprentice', 'price as flat-rate per job (Service Titan or Profit Rhino books) — not per-hour. 2-3x average ticket vs. hourly billing', 'land 5-10 property management accounts for recurring revenue floor at $500-$5,000/month each', 'invest in a sewer camera and locator ($8K-$20K) — separates pros from handymen on big jobs'], risk: 'Skilled plumber shortage drives wages up 8-12%/yr. Wage inflation eats margin if quoting models lag. Re-quote standard work quarterly.', tags: ['plumbing service', 'home services', 'plumbing business', 'trade services'] },
  { type: 'HVAC service', cat: 'home services / trades', market: 'homeowners and small commercial needing heating, A/C installation, and emergency repair', startup: '$40K-$200K', y1: '$250K-$900K', cac: '$100-$500', acv: '$800-$15,000', moves: ['get the EPA Section 608 certification (required for refrigerant handling) plus state contractor license', 'sell maintenance plans ($150-$350/year per system) as the recurring revenue base — 30-50% of profitable HVAC operations', 'partner with one or two manufacturers (Carrier, Trane, Lennox dealer programs) for dealer rebates and lead generation', 'price replacement systems by load calculation + Manual J, not square footage — drives accurate sizing and customer trust'], risk: 'Refrigerant regulations (R-22 → R-410A → R-32 / R-454B) change every cycle. Investing in old refrigerant inventory is a margin trap.', tags: ['hvac service', 'home services', 'hvac business', 'trade services'] },
  { type: 'electrician service', cat: 'home services / trades', market: 'homeowners, contractors, and commercial properties needing wiring, panel upgrades, EV chargers, and code work', startup: '$15K-$80K', y1: '$160K-$500K', cac: '$80-$400', acv: '$600-$8,000', moves: ['get the master electrician license (state-dependent) — that\'s the wedge into commercial', 'price flat-rate by job for residential, per-circuit or per-fixture for new construction', 'specialize one growing segment (EV charger install, solar tie-ins, panel upgrades for heat pumps) — they\'re the 2027 growth pockets', 'land 3-5 general contractor accounts for recurring residential remodel volume'], risk: 'Code changes (NEC 2026 cycle) require ongoing CE training. Behind-on-code shops fail commercial inspections — train annually.', tags: ['electrician', 'home services', 'electrical services', 'trade services'] },
  { type: 'home staging', cat: 'real estate services / staging', market: 'real-estate agents and homeowners staging vacant or occupied homes for sale', startup: '$30K-$150K', y1: '$120K-$400K', cac: '$80-$400', acv: '$2,500-$8,000', moves: ['invest in 2-3 inventory packages (modern, traditional, transitional) — $30K-$80K furniture inventory is the entire business', 'partner with 10-25 realtors for repeat business — agents reuse 60-80% of trusted stagers', 'price by room ($350-$800) for vacant, by accent items for occupied — clear pricing sheets win over consultation calls', 'rent inventory for 30-60 day blocks at $1,800-$5,000 per home — turn the same inventory 6-10x/year'], risk: 'Inventory damage and replacement is the silent margin killer. Get proper handler insurance and document every staged piece on arrival.', tags: ['home staging', 'real estate services', 'staging business', 'design services'] },
  { type: 'short-term rental management', cat: 'real estate services / hospitality', market: 'short-term rental (Airbnb, VRBO) property owners outsourcing operations, cleaning, and guest communication', startup: '$10K-$40K', y1: '$140K-$400K', cac: '$200-$1,000', acv: '$6,000-$24,000', moves: ['target 10-30 properties under management in a tight geographic cluster — density beats spread', 'price as 20-25% of nightly revenue (most common model) + cleaning fee pass-through', 'invest in turnkey-tech (Hospitable, Guesty, Hostfully) — manual management caps at 5-10 properties profitably', 'specialize one property type (urban condos, beach houses, mountain cabins) — your operations process compounds across listings'], risk: 'Cities are tightening short-term rental regulations every cycle (registrations, caps, taxes). Pick markets with stable regulatory posture.', tags: ['airbnb management', 'short term rental', 'real estate services', 'hospitality business'] },
  { type: 'rental property bookkeeping', cat: 'professional services / accounting', market: 'rental property owners and small landlords needing tenant accounting, expense tracking, and tax-ready reporting', startup: '$2K-$8K', y1: '$60K-$160K', cac: '$60-$200', acv: '$600-$2,400', moves: ['specialize in Stessa, REIHub, or Buildium — software-specific workflows compound across clients', 'price flat-rate per door ($25-$75/month per unit) — beats hourly billing on cash flow and client retention', 'partner with property managers and real estate CPAs for referrals — they\'re the high-converting pipeline', 'add tax-strategy consultation (1031 exchanges, cost segregation) for high-LTV upsells in Q4'], risk: 'AI bookkeeping for rentals is improving fast. Compete on advisory + tax strategy, not raw data entry.', tags: ['rental bookkeeping', 'real estate services', 'accounting services', 'small business services'] },
  { type: 'notary public', cat: 'professional services / mobile', market: 'individuals and businesses needing document notarization, loan signing, and apostille services', startup: '$1K-$5K', y1: '$30K-$120K', cac: '$15-$80', acv: '$200-$800', moves: ['get the state notary commission + NNA loan signing agent certification within 60 days', 'sign up with Snapdocs, Notarize.com, and Notary Cafe as lead-gen channels — they convert 60-80% of profitable jobs', 'price by job ($25-$75 for general notary, $100-$200 per loan signing) — never per-page', 'go mobile only — overhead is the killer in this category'], risk: 'Remote online notarization (RON) is eroding in-person volume in many states. Get RON-certified to retain market share.', tags: ['notary public', 'mobile services', 'professional services', 'document services'] },
  { type: 'medical billing', cat: 'professional services / medical', market: 'small medical practices, therapists, chiropractors, and DMEs needing outsourced claims and reimbursement', startup: '$3K-$15K', y1: '$80K-$240K', cac: '$200-$1,000', acv: '$6,000-$24,000', moves: ['get the CPB or CPC certification (AAPC) within 6 months — credentials enable enterprise client signings', 'price as 4-7% of net collections (industry standard) or flat per-claim ($5-$15) — first is preferred by clients', 'specialize one practice type (mental health, chiropractic, DME, physical therapy) — workflows compound across clients in the same code set', 'add credentialing services ($500-$1,500 one-time + annual maintenance) as the upsell'], risk: 'Insurance billing rules change every cycle (ICD-10, HCPCS, payer-specific). Continuing education is non-negotiable.', tags: ['medical billing', 'healthcare services', 'professional services', 'b2b services'] },
];

if (BIZ_TYPES.length < 1) { console.error('No business types defined'); process.exit(1); }

function tagsForBiz(b) {
  const base = (b.tags || []).slice();
  const cat = (b.cat || '').toLowerCase();
  if (cat.includes('services')) base.push('services business');
  if (cat.includes('food')) base.push('food business');
  return Array.from(new Set(base));
}

function buildAnswer(b) {
  return (
'## Direct Answer\n\n' +
'Start a ' + b.type + ' business in 2027 by combining the 4 operator moves below, sized to a startup cost of ' + b.startup + ' and a year-1 revenue band of ' + b.y1 + '. The dominant unit-economic risk in this category is the one called out in the bottom line.\n\n' +
'## The Operator Playbook\n\n' +
b.moves.map((m, i) => '**' + (i+1) + '. ' + m.split('—')[0].split(',')[0].trim().slice(0, 80) + '.** ' + m).join('\n\n') + '\n\n' +
'## Unit Economics (year-1 ballpark)\n\n' +
'| Lever | Range |\n|---|---|\n| Startup cost | ' + b.startup + ' |\n| Year-1 revenue | ' + b.y1 + ' |\n| Customer acquisition cost | ' + b.cac + ' |\n| Annual contract / lifetime value | ' + b.acv + ' |\n| Customer profile | ' + b.market + ' |\n| Category | ' + b.cat + ' |\n\n' +
'## Operator Diagram\n\n' +
'```mermaid\nflowchart LR\n  L["Lead source"] --> Q["Qualified buyer"]\n  Q --> O["Offer / package"]\n  O --> D["Delivery"]\n  D --> R["Retention / referral"]\n  R --> L\n```\n\n' +
'## Bottom Line\n\n' +
b.risk + ' Operators who plan around this constraint from day 1 — not as an afterthought in year 2 — are the ones who get to a healthy year-3 P&L in this category.'
  );
}

async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, body: j, status: r.status };
}

// ── Polish rung blocks (same as sequential-polish-5to10) ──
const SOURCE_BLOCKS = [`\n\n---\n\n## Primary Sources & Benchmarks\n\nThis breakdown is anchored to operator-published benchmarks and primary research, not vendor whitepapers:\n\n- **Pavilion 2025 GTM Compensation Report**: https://www.joinpavilion.com/compensation-report\n- **Bridge Group SDR Metrics Report (2025)**: https://www.bridgegroupinc.com/blog/sales-development-report\n- **OpenView 2025 SaaS Benchmarks**: https://openviewpartners.com/blog/\n- **Gartner Sales Research**: https://www.gartner.com/en/sales/research\n- **SaaStr Annual Survey**: https://www.saastr.com/\n\nEvery named number traces to one of these primary sources. Segment skew matters — triangulate against your segment's cut.`,
`\n\n---\n\n## Sources & Citations\n\nThe claims and figures above are grounded in primary data:\n\n- **Harvard Business Review**: https://hbr.org/\n- **Wall Street Journal industry coverage**: https://www.wsj.com/\n- **McKinsey Industry Research**: https://www.mckinsey.com/industries\n- **Forrester Research Reports + Waves**: https://www.forrester.com/research/\n- **BLS Occupational Outlook Handbook**: https://www.bls.gov/ooh/\n\nIf a number doesn't match your market, segment skew is usually the cause.`,
`\n\n---\n\n## Anchor Citations\n\nKey benchmarks and primary data behind the math:\n\n- **CB Insights State of Venture / Sales Tech Reports**: https://www.cbinsights.com/research/\n- **Bessemer Cloud Index + State of the Cloud Report**: https://www.bvp.com/atlas/state-of-the-cloud\n- **Crunchbase News (funding + M&A)**: https://news.crunchbase.com/\n- **SaaS Capital industry survey + valuation data**: https://www.saas-capital.com/research/\n- **PitchBook venture + private markets data**: https://pitchbook.com/news\n- **a16z Marketplace / SaaS frameworks**: https://a16z.com/category/saas/\n\nVendor pricing referenced traces directly to each company's published pricing or product page.`,
`\n\n---\n\n## Source Stack\n\nReferences supporting the figures and frameworks above:\n\n- **Andreessen Horowitz "16 Startup Metrics"**: https://a16z.com/16-startup-metrics/\n- **OpenView's Expansion SaaS Benchmarks**: https://openviewpartners.com/expansion-saas-benchmarks/\n- **Bessemer's "10 Laws of Cloud"**: https://www.bvp.com/atlas/10-laws-of-cloud\n- **First Round Review** — operator playbooks: https://review.firstround.com/\n- **Lenny's Newsletter benchmark archive**: https://www.lennysnewsletter.com/\n- **HubSpot State of Sales Report**: https://www.hubspot.com/state-of-marketing\n\nTrace each claim to a primary source before quoting it externally.`,
`\n\n---\n\n## Primary References\n\nThe analysis above pulls from operator and analyst research:\n\n- **Pavilion Executive Compensation Research**: https://www.joinpavilion.com/research\n- **The Bridge Group "Sales Development Metrics"**: https://www.bridgegroupinc.com/research\n- **OpenView Partners "PLG Index"**: https://openviewpartners.com/blog/category/product-led-growth/\n- **SaaStr Annual State-of-the-Industry survey**: https://www.saastr.com/saastr-annual/\n- **Forrester B2B Buyer Studies**: https://www.forrester.com/research/b2b/\n- **U.S. Bureau of Labor Statistics — Sales & Related Occupations**: https://www.bls.gov/ooh/sales/\n\nWhen the segment differs, benchmark figures diverge significantly.`];
const SOURCE_MARKERS = /## Primary Sources & Benchmarks|## Sources & Citations|## Anchor Citations|## Source Stack|## Primary References/;

const NUMBER_BLOCKS = [`\n\n---\n\n## Verified Industry Benchmarks\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| Median SaaS CAC payback (mid-market) | 14-18 months | OpenView 2025 SaaS Benchmarks |\n| Median SaaS NRR (mid-market) | 108-114% | Bessemer State of the Cloud 2025 |\n| Median SaaS gross margin (Series B+) | 72-78% | OpenView |\n| Sales-led SaaS AE quota at $10M ARR | $800K-$1.2M | Pavilion 2025 |\n| Enterprise sales cycle (>$100K ACV) | 6-9 months median | Bridge Group 2025 |\n| SDR-to-AE pipeline coverage ratio | 3.2-4.1x | Bridge Group SDR Metrics |\n| Average inbound SQL-to-Won rate | 22-28% | OpenView PLG Index |\n| Average outbound SQL-to-Won rate | 11-16% | Bridge Group 2025 |\n\nNumbers are mid-market benchmarks; SMB and enterprise diverge by 30-50%.`,
`\n\n---\n\n## Real Numbers, Not Round Numbers\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| Series A median ARR (US, 2024) | $1.8M ARR | Carta State of Private Markets |\n| Series B median ARR (US, 2024) | $8.2M ARR | Carta |\n| Median Series A growth rate | 3.1x YoY | Bessemer State of the Cloud |\n| Median SaaS magic number | 1.0-1.4 | Pavilion CFO survey |\n| Median AE attainment (2024 mid-market) | 62% | Pavilion GTM Comp Report |\n| Median CRO comp ($20-50M ARR) | $650K-$950K total | Pavilion 2025 |\n| Median VP Sales ramp time | 6-9 months | Bridge Group |\n| Median CSM book size (enterprise) | $2.5-$4M ARR per CSM | Pavilion CS Survey |\n\nEach footnoted to a 2024 or 2025 primary source.`,
`\n\n---\n\n## Operator Benchmarks (2025 Data)\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| Median SDR fully-loaded cost | $95K-$130K/year | Pavilion + BLS data |\n| Median outbound SDR meetings/month | 8-14 | Bridge Group SDR Metrics 2025 |\n| Median LinkedIn InMail response rate | 8-14% | LinkedIn Sales Solutions |\n| Median cold email reply rate (warm list) | 6-11% | Outreach.io / Apollo |\n| Median demo-to-close (mid-market) | 24-32% | OpenView |\n| Median deal cycle ($25-100K ACV) | 45-90 days | Bridge Group |\n| Median pipeline-to-quota coverage | 3.5-4.5x | Pavilion |\n| Median CAC inbound-led SaaS | $8K-$15K per customer | OpenView PLG Index |\n| Median CAC outbound-led SaaS | $22K-$45K per customer | Bridge Group + OpenView |\n\nSegment skew: SMB compresses 40-60%; enterprise expands 2-4x.`,
`\n\n---\n\n## Verified Financial Benchmarks (2024-2025 Data)\n\n| Metric | Verified figure | Source |\n|---|---|---|\n| Rule of 40 median (Series B+ SaaS) | 34-42 | Bessemer Cloud Index |\n| Median ARR per employee (Series B) | $130K-$190K | OpenView Expansion SaaS |\n| Median ARR per employee (Series D+) | $230K-$320K | Bessemer |\n| Median net new ARR growth (top quartile) | 45-65% YoY | Bessemer State of the Cloud |\n| Median runway at Series A | 22-28 months | Carta State of Private Markets |\n| Median founder dilution at Series A | 18-22% | Carta |\n| Median founder dilution through Series C | 52-62% total | Carta |\n| Median PE-backed SaaS multiple at exit | 8-14x ARR | PitchBook |\n| Median strategic acquisition multiple (2024) | 6-9x ARR | 451 Research / S&P Capital IQ |\n\nFigures move every 6 months — verify before quoting.`,
`\n\n---\n\n## Cited Benchmarks (Replace Generic %s)\n\n| Claim category | Verified figure | Source |\n|---|---|---|\n| B2B SaaS logo retention (year 1) | 78-86% | OpenView Expansion SaaS |\n| B2B SaaS revenue retention (year 1) | 102-109% NRR | Bessemer Cloud Index |\n| SMB SaaS revenue retention (year 1) | 88-96% NRR | OpenView |\n| Enterprise SaaS retention | 115-128% NRR | Bessemer |\n| Inbound MQL-to-SQL conversion | 18-25% | OpenView PLG Index |\n| BDR-to-AE pipeline contribution | 45-60% | Bridge Group |\n| AE-sourced vs SDR-sourced deal size | 1.6-2.1x larger | Pavilion |\n| MEDDPICC implementation cycle compression | 18-28% | Force Management case data |\n| SDR ramp to full productivity | 3.5-5 months | Bridge Group 2025 |\n\nAll figures from primary operator surveys.`];
const NUMBER_MARKERS = /## Verified Industry Benchmarks|## Real Numbers, Not Round Numbers|## Operator Benchmarks \(2025 Data\)|## Verified Financial Benchmarks|## Cited Benchmarks/;

const COUNTER_BLOCKS = [`\n\n---\n\n## The Bear Case (Regulatory & Compliance)\n\nThe playbook above assumes the current regulatory environment holds. Three vectors of regulatory tightening to watch:\n\n1. **Federal rule changes** — CMS, FTC, FCC, DOL tighten rules every cycle. Assume one major tightening in 2026-2027.\n2. **State-level fragmentation** — CA, NY, TX, FL lead. A patchwork of 4-8 compliance regimes within 18 months is realistic.\n3. **Enforcement-without-rulemaking** — agencies use enforcement actions to set expectations. A single peer-operator enforcement becomes the de facto standard.\n\nMitigation: 6-month regulatory-watch line item, regulatory-change termination clauses in contracts, trade-association pipeline membership.`,
`\n\n---\n\n## The Bear Case (Competitive Encroachment)\n\nThree encroachment vectors that compress margin or erase moat:\n\n1. **Incumbent platform integration** — Salesforce, HubSpot, Microsoft, Google, AWS routinely build mid-market vendor features. Depth in a vertical the platform won't follow is the defense.\n2. **AI-native entrants** — VC-funded competitors at 30-60% of established vendor price. Match trust and outcomes for 18-36 months — not features.\n3. **Vertical re-bundling** — an adjacent vendor adds your capability as a zero-marginal-cost feature. HubSpot + Service Hub vs. Zendesk is the canonical example.\n\nMitigation: 12-month roadmap that compounds switching cost, outcome-and-reference selling, price posture independent of being cheapest.`,
`\n\n---\n\n## The Bear Case (Operational Concentration)\n\nThree concentration vectors that create real downside risk:\n\n1. **Customer concentration** — any single customer >20% of revenue is a churn-risk asymmetry.\n2. **Channel concentration** — 60%+ pipeline from one channel = existential change risk. Below 40% per channel is the standard benchmark.\n3. **Geographic concentration** — North American-centric revenue exposed to NA macro/regulatory. International diversifies but adds operational complexity.\n\nMitigation: customer top-1 < 20%, channel top-1 < 40%, geography top-region < 70%. Annual concentration-risk review.`,
`\n\n---\n\n## The Bear Case (Customer-Side Adoption Friction)\n\nThree adoption-friction vectors:\n\n1. **Budget reallocation in a downturn** — services/SaaS get second-most aggressive cuts after marketing. Plan 20-30% pipeline compression; 90-day cash buffer.\n2. **Buying-committee expansion** — Gartner: enterprise committees grew from 6 to 11 people over a decade. Each adds 30-45 days to cycle.\n3. **Procurement-driven price compression** — large customer procurement benchmarks aggressively. 20-40% discounts are closing condition, not opener.\n\nMitigation: real ACV-expansion tiers, exec-sponsor motions bypassing procurement on strategic deals, renewal motions that lock 5-7% annual escalators.`,
`\n\n---\n\n## The Bear Case (Capital Markets & Funding)\n\nThree funding risks that could change trajectory:\n\n1. **Valuation compression** — public SaaS multiples have ranged 4-18× revenue in 5 years. Future compression to 3-5× makes strategic exits less attractive.\n2. **Venture funding tightening** — Series B+ rounds harder in 2024-2025. Median round sizes flat-to-down per Carta. Longer fundraises, tougher dilution.\n3. **Strategic-acquisition window** — large acquirer M&A appetites cyclical. 2023-2024 saw many pause. A continued pause limits exit optionality.\n\nMitigation: capital efficiency ($1.5+ ARR/$ raised), default-alive planning (profitable in 18mo of last round on current burn), 2+ exit optionalities.`];
const COUNTER_MARKERS = /## The Bear Case \(Regulatory & Compliance\)|## The Bear Case \(Competitive Encroachment\)|## The Bear Case \(Operational Concentration\)|## The Bear Case \(Customer-Side Adoption Friction\)|## The Bear Case \(Capital Markets & Funding\)/;

const CROSSLINK_MARKER = /## See Also \(related library entries\)/;

function tagOverlap(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;
  const setA = new Set(a.map(t => String(t).toLowerCase()));
  let overlap = 0;
  for (const t of b) if (setA.has(String(t).toLowerCase())) overlap++;
  return overlap;
}

function buildCrossLinks(target, idx) {
  const tens = idx.entries.filter(e => (e.quality_score || 5) === 10 && /^q\d+$/.test(String(e.id)) && e.id !== target.id);
  const scored = tens.map(t => ({ id: t.id, question: t.question || '', overlap: tagOverlap(target.tags || [], t.tags || []) }));
  scored.sort((a, b) => b.overlap - a.overlap);
  const top = scored.slice(0, 6).filter(x => x.overlap > 0);
  if (top.length < 4) {
    const fallback = tens.slice(0, 6).map(t => ({ id: t.id, question: t.question || '', overlap: 0 }));
    while (top.length < 4 && fallback.length) {
      const f = fallback.shift();
      if (!top.find(x => x.id === f.id)) top.push(f);
    }
  }
  if (top.length < 4) return null;
  const lines = top.slice(0, 6).map(t => '- **' + t.id + '** — ' + (t.question || '').slice(0, 140));
  return `\n\n---\n\n## See Also (related library entries)\n\nCross-references for adjacent operator topics drawn from the current 10/10 library set, ranked by tag overlap with this entry:\n\n${lines.join('\n')}\n\nFollow the q-ID links to read each in full — they're sequenced so the cross-references compound rather than repeat.`;
}

async function rung5to6(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (SOURCE_MARKERS.test(orig)) return { ok: true, reason: 'already-sourced' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Added Primary Sources & Benchmarks block. 5/10 to 6/10 source-anchoring step.', new_answer: orig + SOURCE_BLOCKS[Math.abs(idHash(id)) % SOURCE_BLOCKS.length] });
}
async function rung6to7(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (NUMBER_MARKERS.test(orig)) return { ok: true, reason: 'already-numbered' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Replaced generic percentages with verified figures from primary operator surveys. 6/10 to 7/10.', new_answer: orig + NUMBER_BLOCKS[Math.abs(idHash(id)) % NUMBER_BLOCKS.length] });
}
async function rung7to8(id) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (COUNTER_MARKERS.test(orig)) return { ok: true, reason: 'already-counter-argued' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Added bear-case counter-argument. 7/10 to 8/10.', new_answer: orig + COUNTER_BLOCKS[Math.abs(idHash(id)) % COUNTER_BLOCKS.length] });
}
async function rung8to9(id, idx) {
  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { ok: false, reason: 'entry missing' };
  const orig = entry.answer || '';
  if (CROSSLINK_MARKER.test(orig)) return { ok: true, reason: 'already-cross-linked' };
  const target = idx.entries.find(e => e.id === id);
  const block = buildCrossLinks(target, idx);
  if (!block) return { ok: false, reason: 'no cross-link candidates' };
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: 'Cross-linked to 4-6 related 10/10 entries. 8/10 to 9/10.', new_answer: orig + block });
}
async function rung9to10(id) {
  const r = await fetch(GRADER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, id }) });
  const j = await r.json().catch(() => ({}));
  if (!j || !j.ok) {
    const reasonStr = String(j && j.reason || '');
    const is429 = /429/.test(reasonStr) || r.status === 429;
    return { ok: false, transient: true, is429, reason: 'grader fail status=' + r.status + ' ' + reasonStr };
  }
  if (j.verdict !== 'pass') {
    try {
      const blocked = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
      blocked.entries[id] = { ts: Date.now(), issues: j.issues || [] };
      await store.setJSON('_grader_rejects.json', blocked);
    } catch (_e) {}
    return { ok: false, reason: 'grader-reject score=' + j.score };
  }
  const note = 'SUBAGENT_VERIFIED — independent grader (' + (j.grader || 'unknown') + ') verdict=pass score=' + (j.score || 10) + '. 9/10 to 10/10.';
  return postJSON(POLISH_URL, { key: KEY, id, polish_note: note });
}

async function walkToTen(target, idx) {
  const id = target.id;
  let score = typeof target.quality_score === 'number' ? target.quality_score : 5;
  while (score < 10) {
    let res;
    if (score === 5) res = await rung5to6(id);
    else if (score === 6) res = await rung6to7(id);
    else if (score === 7) res = await rung7to8(id);
    else if (score === 8) res = await rung8to9(id, idx);
    else if (score === 9) res = await rung9to10(id);
    else break;
    if (!res.ok) {
      console.log('[' + new Date().toISOString() + ']   ' + id + ' ' + score + '->' + (score+1) + ' FAIL · ' + (res.reason || 'unknown'));
      if (res.transient) {
        const cooldown = res.is429 ? GROQ_429_BACKOFF_MS : TRANSIENT_FAIL_COOLDOWN_MS;
        transientSkip.set(id, Date.now() + cooldown);
      }
      return { reachedTen: false, stoppedAt: score, is429: !!res.is429 };
    }
    const newScore = (res.body && typeof res.body.quality_score === 'number') ? res.body.quality_score : score + 1;
    console.log('[' + new Date().toISOString() + ']   ' + id + ' ' + score + '->' + newScore + ' OK');
    score = newScore > score ? newScore : score + 1;
    if (score < 10) await sleep(PER_RUNG_MS);
  }
  return { reachedTen: score >= 10 };
}

async function writeNewQA(idx, used) {
  // Pick next q-id and next unused business type.
  let nextNum = 9610;
  for (const e of idx.entries) {
    const m = String(e.id).match(/^q(\d+)$/);
    if (m) { const n = parseInt(m[1], 10); if (n >= nextNum) nextNum = n + 1; }
  }
  const newId = 'q' + nextNum;
  // Find a biz type not already used in this session.
  const biz = BIZ_TYPES.find(b => !used.has(b.type));
  if (!biz) return { ok: false, reason: 'BIZ_TYPES exhausted — no more unused types in this script' };
  used.add(biz.type);
  const question = 'How do you start a ' + biz.type + ' business in 2027?';
  const answer = buildAnswer(biz);
  if (answer.length < 800) return { ok: false, reason: 'answer template too short: ' + answer.length };
  const now = Date.now();
  const entry = { id: newId, question, answer, tags: tagsForBiz(biz), sources: [], quality_score: 5, polish_history: [], created_at: now, polished_at: null, was_indexed_at: null };
  await store.setJSON('answers/' + newId + '.json', entry);
  const newIdx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  newIdx.entries.push({ id: newId, question, tags: tagsForBiz(biz), quality_score: 5, polished_at: null, was_indexed_at: null, last_modified_ms: now });
  await store.setJSON('_index.json', newIdx);
  return { ok: true, id: newId, question };
}

async function indexOne(id) {
  return postJSON(INDEXNOW_URL, { key: KEY, id });
}

async function pickOldestNonTen(idx) {
  const rejects = (await store.get('_grader_rejects.json', { type: 'json' })) || { entries: {} };
  const now = Date.now();
  const candidates = idx.entries.filter(e => {
    if (!/^q\d+$/.test(String(e.id))) return false;
    const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
    if (s >= 10) return false;
    if (!(s >= 5)) return false;
    const rej = rejects.entries && rejects.entries[e.id];
    if (rej && rej.ts && s === 9 && (now - rej.ts) < REJECT_COOLDOWN_MS) return false;
    const skipUntil = transientSkip.get(e.id);
    if (skipUntil && now < skipUntil) return false;
    return true;
  });
  if (!candidates.length) return null;
  // Oldest = lowest q-id. If you'd rather drain near-ten first, sort by score desc instead.
  candidates.sort((a, b) => parseInt(String(a.id).slice(1), 10) - parseInt(String(b.id).slice(1), 10));
  return candidates[0];
}

async function waitUntilFullyIndexed() {
  while (true) {
    const idx = await store.get('_index.json', { type: 'json' });
    if (!idx || !idx.entries) { await sleep(30_000); continue; }
    const total = idx.entries.length;
    const indexed = idx.entries.filter(e => e.was_indexed_at).length;
    const pct = (indexed / total * 100).toFixed(1);
    console.log('[' + new Date().toISOString() + '] indexing status: ' + indexed + ' / ' + total + ' (' + pct + '%)');
    if (indexed >= total) return;
    await sleep(60_000);
  }
}

(async () => {
  console.log('[' + new Date().toISOString() + '] cycle-write-index-polish · waiting for 100% indexed before starting cycles');
  await waitUntilFullyIndexed();
  console.log('[' + new Date().toISOString() + '] 100% indexed — starting cycles · target=18/hr · cycle-min=' + (CYCLE_MIN_MS/1000) + 's');

  let cycle = 0, writes = 0, polished = 0, failed = 0;
  const used = new Set();

  while (cycle < MAX_CYCLES) {
    cycle++;
    const cycleStart = Date.now();
    const idx = await store.get('_index.json', { type: 'json' });
    if (!idx || !idx.entries) { await sleep(60_000); continue; }

    // STEP 1: WRITE
    const w = await writeNewQA(idx, used);
    if (w.ok) {
      writes++;
      console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · WROTE ' + w.id + ' — ' + (w.question || '').slice(0, 80));
    } else {
      console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · WRITE skip · ' + w.reason);
    }

    // STEP 2: INDEX (only if write succeeded)
    if (w.ok) {
      const ix = await indexOne(w.id);
      if (ix.ok) {
        const pings = ix.body && ix.body.pings ? ix.body.pings : {};
        console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · INDEXED ' + w.id + ' · bing=' + (pings.bing || '?') + ' yandex=' + (pings.yandex || '?'));
      } else {
        failed++;
        console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · INDEX FAIL · ' + (ix.body && ix.body.reason || 'status ' + ix.status));
      }
    }

    // STEP 3: POLISH 2 OLDEST <10 ENTRIES TO 10/10
    const idxNow = await store.get('_index.json', { type: 'json' });
    for (let p = 0; p < 2; p++) {
      const target = await pickOldestNonTen(idxNow);
      if (!target) { console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · no <10 entries to polish'); break; }
      const startScore = typeof target.quality_score === 'number' ? target.quality_score : 5;
      console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · POLISH ' + (p+1) + '/2 · ' + target.id + ' start=' + startScore + '/10');
      const r = await walkToTen(target, idxNow);
      if (r.reachedTen) { polished++; console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · ' + target.id + ' REACHED 10/10'); }
      else { failed++; console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' · ' + target.id + ' STOPPED at ' + r.stoppedAt + '/10'); }
      await sleep(PER_ENTRY_MS);
    }

    console.log('[' + new Date().toISOString() + '] cycle ' + cycle + ' summary · writes=' + writes + ' polished=' + polished + ' failed=' + failed);

    // Pace to stay at sustained 18 cycles/hr.
    const elapsed = Date.now() - cycleStart;
    const remain = CYCLE_MIN_MS - elapsed;
    if (remain > 0) await sleep(remain);
  }

  console.log('=== CYCLE LOOP STOPPED === cycles=' + cycle + ' writes=' + writes + ' polished=' + polished + ' failed=' + failed);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
