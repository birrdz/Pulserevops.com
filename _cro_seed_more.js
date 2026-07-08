// _cro_seed_more.js — add 1,000 MORE fractional-CRO finder Q&As (tl pillar) to corner the
// online "fractional CRO" search market. Expanded intent × locality × vertical × stage ×
// role-synonym combinations, deduped vs the live index AND the original _cro_market_queue.
// Writes _cro_more_queue.json (all new) + splits into _cro_ds_queue.json (DeepSeek back band)
// and _cro_cc_queue.json (Claude-writer front band) so the two writers never collide.
// Usage: node _cro_seed_more.js [count]   (default 1000)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const COUNT = parseInt(process.argv[2] || '1000', 10);

const STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Washington DC'];
const CITIES = ['New York City','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin','San Jose','Jacksonville','Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Boston','Nashville','Atlanta','Miami','Tampa','Orlando','Raleigh','Durham','Salt Lake City','Minneapolis','Detroit','Portland','Las Vegas','Kansas City','Cincinnati','Pittsburgh','St. Louis','Cleveland','Sacramento','Oklahoma City','Louisville','Memphis','Milwaukee','Tucson','Omaha','Colorado Springs','Virginia Beach','Oakland','Tulsa','New Orleans','Boise','Richmond','Birmingham','Madison','Chattanooga','Knoxville','Greenville','Charleston','Savannah','Boulder','Ann Arbor','Scottsdale','Irvine','Plano','Frisco','Bellevue','Reno','Fort Lauderdale','Naples','Jersey City','Stamford','Hartford','Providence','Buffalo','Lexington','Dayton','Grand Rapids','Fort Collins','Tempe','Chandler','Santa Monica','Palo Alto','Mountain View','Sunnyvale','Pasadena','Berkeley','San Mateo','Cambridge','Brooklyn','Bethesda','Reston','Alexandria','Cary','Bentonville','Huntsville','Baton Rouge','Lincoln','Honolulu'];
const REGIONS = ['the Bay Area','Silicon Valley','Greater Boston','the DMV area','the Research Triangle','Southern California','the Pacific Northwest','the Midwest','the Southeast','the Mountain West','New England','the Tri-State area','Central Texas','South Florida','the Gulf Coast'];
const VERTICALS = ['B2B SaaS','enterprise software','fintech','healthtech','medtech','medical device','biotech','martech','adtech','cybersecurity','dev tools','AI startup','machine learning','proptech','insurtech','legaltech','edtech','HR tech','supply chain software','logistics','manufacturing','industrial','professional services','consulting firm','marketing agency','e-commerce','consumer subscription','marketplace','hardware','IoT','clean energy','climate tech','telecom','media','gaming','staffing','financial services','real estate','construction tech','food and beverage','CPG','life sciences','government contracting','nonprofit','services business'];
const STAGES = ['a pre-seed','a seed-stage','a Series A','a Series B','a Series C','a bootstrapped','a PE-backed','a venture-backed','a founder-led','a pre-IPO','a $1M to $5M ARR','a $5M to $10M ARR','a $10M to $50M ARR','an early-stage','a scale-up','a mid-market','an SMB','a high-growth','a turnaround','a post-merger'];
const ROLES_SYN = ['fractional Chief Revenue Officer','part-time CRO','outsourced CRO','interim CRO','fractional revenue leader','fractional head of revenue','fractional VP of Sales'];

const cands = [];
const add = t => cands.push(t);

// CITIES — add the cost + what-to-look-for intents (originals only had find+hire)
for (const c of CITIES) {
  add(`How much does a fractional CRO cost in ${c} in 2027?`);
  add(`What should I look for in a fractional CRO in ${c}?`);
}
// VERTICAL — deeper intents
for (const v of VERTICALS) {
  add(`How much does a fractional CRO cost for a ${v} company in 2027?`);
  add(`When should a ${v} company hire a fractional CRO?`);
  add(`Does a ${v} company need a fractional CRO or a full-time CRO?`);
  add(`What should a ${v} company look for in a fractional CRO?`);
}
// STAGE — cost + role
for (const st of STAGES) {
  add(`How much does a fractional CRO cost for ${st} company in 2027?`);
  add(`What does a fractional CRO do for ${st} company?`);
}
// ROLE-SYNONYM × STATE (capture every keyword phrasing locally)
for (const ro of ROLES_SYN) for (const s of STATES) add(`Where do I find ${/^[aeiou]/i.test(ro) ? 'an' : 'a'} ${ro} in ${s}?`);
// ROLE-SYNONYM × top CITIES (hire intent)
for (const ro of ROLES_SYN) for (const c of CITIES.slice(0, 50)) add(`How do I hire ${/^[aeiou]/i.test(ro) ? 'an' : 'a'} ${ro} in ${c}?`);
// VERTICAL × REGION
for (const v of VERTICALS) for (const r of REGIONS) add(`How do I find a fractional CRO for a ${v} company in ${r}?`);
// STAGE × VERTICAL situational
for (const st of STAGES.slice(0, 12)) for (const v of VERTICALS.slice(0, 20)) add(`Should ${st} ${v} company hire a fractional CRO?`);
// Extra high-intent education
const generics = [
 'How do I vet a fractional CRO before hiring?','What KPIs should a fractional CRO own?','How is a fractional CRO different from a sales coach?','What does a fractional CRO charge per month in 2027?','How do equity-based fractional CRO deals work?','How many hours a month does a fractional CRO work?','What is a day-rate for a fractional CRO in 2027?','How do I onboard a fractional CRO fast?','What red flags should I watch for in a fractional CRO?','Can a fractional CRO fix a stalled sales pipeline?','How does a fractional CRO build a revenue operating system?','What is the ROI of a fractional CRO?','How do I transition from a fractional CRO to a full-time CRO?','What deliverables should a fractional CRO produce?','How do I measure a fractional CRO engagement?','Should my Series A startup hire a fractional CRO or a VP of Sales?','How do I find a fractional CRO with industry experience?','What does a fractional CRO 90-day plan look like?','How do fractional CRO retainers compare to commission models?','Can a remote fractional CRO work as well as a local one?'
];
for (const g of generics) add(g);

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }
  // also dedup vs any pending originals queue
  try { for (const it of JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cro_market_queue.json', 'utf8'))) have.add(norm(it.title)); } catch (e) {}

  const seen = new Set(); const uniq = [];
  for (const t of cands) { const k = norm(t); if (have.has(k) || seen.has(k)) continue; seen.add(k); uniq.push(t); }
  // interleave for topic variety across sequential ids
  const stride = 101, out = [], used = new Set(); let i = 0, n = uniq.length, cnt = 0;
  while (cnt < n) { const j = (i * stride) % n; if (!used.has(j)) { used.add(j); out.push(uniq[j]); cnt++; } i++; if (i > n * 3) break; }
  for (let k = 0; k < n; k++) if (!used.has(k)) out.push(uniq[k]);

  const take = out.slice(0, COUNT);
  if (take.length < COUNT) console.error(`WARN: only ${take.length} unique, wanted ${COUNT}`);
  let id = maxTl;
  const items = take.map(t => { id++; return { id: 'tl' + String(id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' }; });
  fs.writeFileSync('C:/Users/koryj/website/_cro_more_queue.json', JSON.stringify(items, null, 1));

  // split: front band -> Claude CC writer, back band -> DeepSeek
  const CC_N = Math.min(150, Math.floor(items.length * 0.18));
  const ccQ = items.slice(0, CC_N);
  const dsQ = items.slice(CC_N);
  fs.writeFileSync('C:/Users/koryj/website/_cro_cc_queue.json', JSON.stringify(ccQ, null, 1));
  fs.writeFileSync('C:/Users/koryj/website/_cro_ds_queue.json', JSON.stringify(dsQ, null, 1));
  console.log(`candidates=${cands.length} unique=${uniq.length} maxTl=tl${String(maxTl).padStart(4,'0')}`);
  console.log(`wrote ${items.length} new: ids ${items[0].id}..${items[items.length-1].id}`);
  console.log(`split -> CC front band ${ccQ.length} (${ccQ[0].id}..${ccQ[ccQ.length-1].id}) | DeepSeek back band ${dsQ.length} (${dsQ[0].id}..${dsQ[dsQ.length-1].id})`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
