// _cro_seed_1000more.js — ADD another 1,000 fractional-CRO Q&As (tl pillar) for market
// dominance. ADDITIVE + idempotent: dedups vs the live index AND every existing _cro_*_queue
// file, assigns ids AFTER the highest reserved id, yearizes every title ("in 2027"), and
// APPENDS to _cro_ds_queue.json so the running DeepSeek writer picks them up on restart.
// Usage: node _cro_seed_1000more.js [count]   (default 1000)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const yearize = q => /20\d\d/.test(q) ? q : (/\?\s*$/.test(q) ? q.replace(/\?\s*$/, ' in 2027?') : q.replace(/[\s.]*$/, ' in 2027'));
const COUNT = parseInt(process.argv[2] || '1000', 10);

const STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Washington DC'];
const CITIES = ['New York City','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin','San Jose','Jacksonville','Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Boston','Nashville','Atlanta','Miami','Tampa','Orlando','Raleigh','Durham','Salt Lake City','Minneapolis','Detroit','Portland','Las Vegas','Kansas City','Cincinnati','Pittsburgh','St. Louis','Cleveland','Sacramento','Oklahoma City','Louisville','Memphis','Milwaukee','Tucson','Omaha','Colorado Springs','Virginia Beach','Oakland','Tulsa','New Orleans','Boise','Richmond','Birmingham','Madison','Chattanooga','Knoxville','Greenville','Charleston','Savannah','Boulder','Ann Arbor','Scottsdale','Irvine','Plano','Frisco','Bellevue','Reno','Fort Lauderdale','Naples','Jersey City','Stamford','Hartford','Providence','Buffalo','Lexington','Dayton','Grand Rapids','Fort Collins','Tempe','Chandler','Santa Monica','Palo Alto','Mountain View','Sunnyvale','Pasadena','Berkeley','San Mateo','Cambridge','Brooklyn','Bethesda','Reston','Alexandria','Cary','Bentonville','Huntsville','Baton Rouge','Lincoln','Honolulu'];
const REGIONS = ['the Bay Area','Silicon Valley','Greater Boston','the DMV area','the Research Triangle','Southern California','the Pacific Northwest','the Midwest','the Southeast','the Mountain West','New England','the Tri-State area','Central Texas','South Florida','the Gulf Coast'];
const VERTICALS = ['B2B SaaS','enterprise software','fintech','healthtech','medtech','medical device','biotech','martech','adtech','cybersecurity','dev tools','AI startup','machine learning','proptech','insurtech','legaltech','edtech','HR tech','supply chain software','logistics','manufacturing','industrial','professional services','consulting firm','marketing agency','e-commerce','consumer subscription','marketplace','hardware','IoT','clean energy','climate tech','telecom','media','gaming','staffing','financial services','real estate','construction tech','food and beverage','CPG','life sciences','government contracting','nonprofit','services business'];
const STAGES = ['a pre-seed','a seed-stage','a Series A','a Series B','a Series C','a bootstrapped','a PE-backed','a venture-backed','a founder-led','a pre-IPO','a $1M to $5M ARR','a $5M to $10M ARR','a $10M to $50M ARR','an early-stage','a scale-up','a mid-market','an SMB','a high-growth','a turnaround','a post-merger'];
const ROLES = ['fractional CRO','fractional Chief Revenue Officer','part-time CRO','outsourced CRO','interim CRO','fractional revenue leader','fractional head of revenue','fractional VP of Sales'];
const art = ro => /^[aeiou]/i.test(ro) ? 'an' : 'a';

const cands = [];
const add = t => cands.push(t);
// place-level deeper intents (new angles vs the first batch)
for (const p of STATES.concat(CITIES, REGIONS)) {
  add(`How do I evaluate a fractional CRO in ${p}?`);
  add(`What does a fractional CRO engagement cost in ${p}?`);
  add(`Is there a fractional CRO available near me in ${p}?`);
}
// role-synonym × city (cost + hire), full city list
for (const ro of ROLES) for (const c of CITIES) { add(`How much does ${art(ro)} ${ro} cost in ${c}?`); }
// role-synonym × state (cost)
for (const ro of ROLES.slice(1)) for (const s of STATES) add(`How much does ${art(ro)} ${ro} cost in ${s}?`);
// vertical × stage situational
for (const v of VERTICALS) for (const st of STAGES) add(`Does ${st} ${v} company need a fractional CRO?`);
// vertical deep intents
for (const v of VERTICALS) {
  add(`What KPIs should a fractional CRO own at a ${v} company?`);
  add(`How does a fractional CRO build pipeline for a ${v} company?`);
  add(`How does a fractional CRO fix forecasting at a ${v} company?`);
}
// stage deep intents
for (const st of STAGES) {
  add(`What should ${st} company look for in a fractional CRO?`);
  add(`How do I scope a fractional CRO engagement for ${st} company?`);
}
// generic high-intent
for (const g of ['How do I compare fractional CRO candidates','What contract terms protect a fractional CRO engagement','How do I measure fractional CRO ROI in the first quarter','What is a fair fractional CRO equity grant','How do I structure a fractional-to-full-time CRO path','What does a fractional CRO do in week one','How do I know my fractional CRO is working','What reporting should a fractional CRO deliver','How do I replace an underperforming fractional CRO','How do I brief my board on hiring a fractional CRO']) add(g + '?');
// fresh angle families — role × city finder/hire intents (large new pool)
for (const ro of ROLES) for (const c of CITIES) { add(`Where do I find ${art(ro)} ${ro} in ${c}?`); add(`How do I hire ${art(ro)} ${ro} in ${c}?`); }
// role × vertical hire intents
for (const ro of ROLES) for (const v of VERTICALS) add(`How do I hire ${art(ro)} ${ro} for ${art(v)} ${v} company?`);

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }
  // fold in every existing CRO queue (dedup + reserve ids)
  for (const f of ['_cro_market_queue.json', '_cro_ds_queue.json', '_cro_cc_queue.json', '_cro_more_queue.json', '_cro_more2_queue.json']) {
    try { for (const it of JSON.parse(fs.readFileSync('C:/Users/koryj/website/' + f, 'utf8'))) { have.add(norm(it.title)); const m = String(it.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); } } catch (e) {}
  }
  const seen = new Set(); const uniq = [];
  for (const t of cands) { const y = yearize(t); const k = norm(y); if (have.has(k) || seen.has(k)) continue; seen.add(k); uniq.push(y); }
  // interleave for topic variety
  const stride = 103, out = [], used = new Set(); let i = 0, n = uniq.length, cnt = 0;
  while (cnt < n) { const j = (i * stride) % n; if (!used.has(j)) { used.add(j); out.push(uniq[j]); cnt++; } i++; if (i > n * 3) break; }
  for (let k = 0; k < n; k++) if (!used.has(k)) out.push(uniq[k]);

  const take = out.slice(0, COUNT);
  if (take.length < COUNT) console.error(`WARN: only ${take.length} unique available, wanted ${COUNT}`);
  let id = maxTl;
  const items = take.map(t => { id++; return { id: 'tl' + String(id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' }; });
  fs.writeFileSync('C:/Users/koryj/website/_cro_more2_queue.json', JSON.stringify(items, null, 1));
  // APPEND to the DeepSeek back-band queue (writer skips already-published on restart)
  let ds = []; try { ds = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cro_ds_queue.json', 'utf8')); } catch (e) {}
  fs.writeFileSync('C:/Users/koryj/website/_cro_ds_queue.json', JSON.stringify(ds.concat(items), null, 1));
  console.log(`candidates=${cands.length} unique=${uniq.length} | added ${items.length} new: ${items[0].id}..${items[items.length-1].id}`);
  console.log(`_cro_ds_queue.json now ${ds.length + items.length} items (restart _cro_ds_run.js to pick them up)`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
