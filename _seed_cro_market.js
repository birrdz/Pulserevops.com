// _seed_cro_market.js — CORNER-THE-MARKET fractional-CRO lead-gen queue (tl pillar).
// Owner priority: dominate the online search market for "fractional CRO" intent.
// Generates localized + vertical + stage + role-synonym Q&As across the money
// keywords, deduped vs the live index. These grade as 'qa' (tl is DUAL).
// Writes _cro_market_queue.json (ids from current max tl id). Substantive pages
// (>=1200 words each) — NOT thin doorway pages.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Washington DC'];

const CITIES = ['New York City','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin','San Jose','Fort Worth','Jacksonville','Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Boston','Nashville','Atlanta','Miami','Tampa','Orlando','Raleigh','Durham','Salt Lake City','Minneapolis','St. Paul','Detroit','Portland','Las Vegas','Kansas City','Cincinnati','Pittsburgh','St. Louis','Cleveland','Sacramento','Oklahoma City','Louisville','Memphis','Milwaukee','Albuquerque','Tucson','Fresno','Mesa','Omaha','Colorado Springs','Virginia Beach','Long Beach','Oakland','Bakersfield','Tulsa','Arlington','New Orleans','Wichita','Cleveland','Boise','Richmond','Birmingham','Spokane','Des Moines','Madison','Provo','Chattanooga','Knoxville','Greenville','Charleston','Savannah','Boulder','Ann Arbor','Scottsdale','Irvine','Plano','Frisco','Bellevue','Reno','Fort Lauderdale','Naples','Sarasota','Jersey City','Stamford','Hartford','Providence','Buffalo','Rochester','Syracuse','Allentown','Columbia','Lexington','Dayton','Akron','Toledo','Grand Rapids','Fort Collins','Tempe','Chandler','Gilbert','Henderson','Santa Monica','Palo Alto','Mountain View','Sunnyvale','Santa Clara','Pasadena','Berkeley','San Mateo','Redwood City','Cambridge','Brooklyn','Manhattan','Bethesda','Reston','Alexandria','Tysons','Cary','Bentonville','Huntsville','Mobile','Baton Rouge','Lincoln','Fargo','Sioux Falls','Billings','Anchorage','Honolulu','Portland Maine','Burlington','Manchester','Wilmington'];

const REGIONS = ['the Bay Area','Silicon Valley','Greater Boston','the DMV area','the Research Triangle','Southern California','the Pacific Northwest','the Midwest','the Southeast','the Mountain West','New England','the Tri-State area','Central Texas','South Florida','the Gulf Coast'];

const VERTICALS = ['B2B SaaS','enterprise software','fintech','healthtech','medtech','medical device','biotech','martech','adtech','cybersecurity','dev tools','AI startup','machine learning','proptech','insurtech','legaltech','edtech','HR tech','supply chain software','logistics','manufacturing','industrial','professional services','consulting firm','marketing agency','e-commerce','consumer subscription','marketplace','hardware','IoT','clean energy','climate tech','telecom','media','gaming','staffing','financial services','real estate','construction tech','food and beverage','CPG','life sciences','government contracting','nonprofit','services business'];

const STAGES = ['pre-seed','seed-stage','Series A','Series B','Series C','bootstrapped','PE-backed','venture-backed','founder-led','pre-IPO','a $1M to $5M ARR','a $5M to $10M ARR','a $10M to $50M ARR','an early-stage','a scale-up','a mid-market','an SMB','a high-growth','a turnaround','a post-merger'];

const ROLES = ['fractional CRO','fractional Chief Revenue Officer','part-time CRO','outsourced CRO','interim CRO','fractional revenue leader','fractional head of revenue','fractional VP of Sales'];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }

  // Money-intent templates. Local/find/hire intent kept year-free (evergreen
  // service-finding); cost/salary get the year (dateable, year-at-end law).
  const cands = [];
  const add = t => cands.push(t);

  // PLACE x intent (states + DC get the full set; cities get find+hire; regions find)
  for (const s of STATES) {
    add(`Where do I find a fractional CRO in ${s}?`);
    add(`How do I hire a fractional CRO in ${s}?`);
    add(`How much does a fractional CRO cost in ${s} in 2027?`);
    add(`What should I look for in a fractional CRO in ${s}?`);
  }
  for (const c of CITIES) {
    add(`Where do I find a fractional CRO in ${c}?`);
    add(`How do I hire a fractional CRO in ${c}?`);
  }
  for (const r of REGIONS) add(`Where do I find a fractional CRO in ${r}?`);

  // VERTICAL intent
  for (const v of VERTICALS) {
    add(`How do I find a fractional CRO for a ${v} company?`);
    add(`What does a fractional CRO do for a ${v} business?`);
  }

  // STAGE / situation intent
  for (const st of STAGES) add(`When should ${st} company hire a fractional CRO?`);
  add('When should a startup hire a fractional CRO?');
  add('Should a founder hire a fractional CRO or a full-time CRO?');
  add('Do I need a fractional CRO or a VP of Sales first?');

  // ROLE-SYNONYM education intent (capture every phrasing of the keyword)
  for (const ro of ROLES) {
    add(`What is ${ro === 'fractional CRO' ? 'a fractional CRO' : 'a ' + ro} and how do I hire one?`);
    add(`How much does ${ro === 'fractional CRO' ? 'a fractional CRO' : 'a ' + ro} charge in 2027?`);
  }
  // High-intent generics
  add('How do I find the best fractional CRO for my company?');
  add('What questions should I ask when hiring a fractional CRO?');
  add('How do I know if my company is ready for a fractional CRO?');
  add('What is the difference between a fractional CRO and a sales consultant?');
  add('What is the difference between a fractional CRO and a fractional CMO?');
  add('How do I write a job scope for a fractional CRO engagement?');
  add('How long should a fractional CRO engagement last?');
  add('What results should I expect from a fractional CRO in the first 90 days?');
  add('How do fractional CRO engagements get priced and structured?');
  add('Can a fractional CRO work with my existing VP of Sales?');

  // Dedupe vs index + within pool, allocate ids
  const items = []; const seen = new Set(); let id = maxTl;
  for (const t of cands) {
    const k = norm(t);
    if (have.has(k) || seen.has(k)) continue;
    seen.add(k); id++;
    const kind = /how much|cost|charge|salary/i.test(t) ? 'regular' : 'regular';
    items.push({ id: 'tl' + String(id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' });
  }
  fs.writeFileSync('C:/Users/koryj/website/_cro_market_queue.json', JSON.stringify(items, null, 1));
  console.log(`candidates: ${cands.length} | NEW after dedupe: ${items.length} | ids ${items[0].id}..${items[items.length - 1].id} | maxTl was ${maxTl}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
