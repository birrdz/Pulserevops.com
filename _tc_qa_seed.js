// _tc_qa_seed.js — seeds the "200 more" Telco combo: regular Q&A (telcoqa ruleset)
// + Top-10 rankings (top10v2 ruleset), per the dual-pillar 1:1 mix law. Assigns
// ids from the live max tc id, dedups EXACT pillar+question vs the index, writes
// _tc_combo_queue.json with a per-item `ruleset`. All titles end "in 2027".
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const Y = 'in 2027';
const norm = s => s.trim().replace(/\s+/g, ' ');

// ---------- REGULAR Q&A (telcoqa) ----------
const CARRIERS = ['Verizon', 'AT&T', 'T-Mobile'];
const VS_PAIRS = [
  ['Verizon', 'T-Mobile'], ['AT&T', 'Verizon'], ['AT&T', 'T-Mobile'],
  ['T-Mobile', 'Visible'], ['Mint Mobile', 'Visible'], ['Cricket Wireless', 'Metro by T-Mobile'],
  ['Google Fi', 'T-Mobile'], ['US Mobile', 'Mint Mobile'], ['Xfinity Mobile', 'Visible'],
  ['Boost Mobile', 'Cricket Wireless'], ['Verizon', 'Visible'], ['Straight Talk', 'Total Wireless'],
];
const regular = [];
VS_PAIRS.forEach(([a, b]) => regular.push(`${a} vs ${b}: which is better ${Y}?`));
[
  `Is an unlimited data plan worth it ${Y}?`,
  `How much mobile data does a family of four actually need ${Y}?`,
  `Is a prepaid carrier as good as Verizon, AT&T, or T-Mobile ${Y}?`,
  `What is the catch with cheap MVNO carriers ${Y}?`,
  `How do I port my phone number to a new carrier ${Y}?`,
  `What is the best cheap unlimited phone plan ${Y}?`,
  `What is the best family cell phone plan for four lines ${Y}?`,
  `How do I lower my cell phone bill ${Y}?`,
  `Are autopay and paperless discounts worth it ${Y}?`,
  `Why are taxes and fees so high on my phone bill ${Y}?`,
  `Should I get a contract or no-contract phone plan ${Y}?`,
  `Can I bring my own phone to a new carrier (BYOD) ${Y}?`,
  `Should I finance a new phone or buy it outright ${Y}?`,
  `Are phone trade-in deals actually worth it ${Y}?`,
  `Is carrier phone insurance worth it ${Y}?`,
  `How does mobile hotspot and tethering work ${Y}?`,
  `Do I need a separate plan line for a smartwatch ${Y}?`,
  `How do I add a tablet to my cell phone plan ${Y}?`,
  `Is 5G home internet good enough to replace cable ${Y}?`,
  `T-Mobile vs Verizon 5G home internet: which is better ${Y}?`,
  `Is 5G home internet good enough for gaming ${Y}?`,
  `Is 5G home internet a good option for rural areas ${Y}?`,
  `eSIM vs physical SIM: which is better ${Y}?`,
  `How do I set up an eSIM ${Y}?`,
  `How do I unlock my phone to switch carriers ${Y}?`,
  `How do I check if my phone is compatible with a new carrier ${Y}?`,
  `What is the best cell phone plan for international travel ${Y}?`,
  `How does international roaming work and how do I avoid huge bills ${Y}?`,
  `What is the best cell phone plan for seniors ${Y}?`,
  `What is the best cell phone plan for kids ${Y}?`,
  `What is the best carrier for rural coverage ${Y}?`,
  `What is Wi-Fi calling and should I turn it on ${Y}?`,
  `Why is my cell phone data so slow and am I being throttled ${Y}?`,
  `How do I fix bad cell signal at home ${Y}?`,
  `What should I do when I have no service or dropped calls ${Y}?`,
  `Prepaid vs postpaid: which should I choose ${Y}?`,
  `Is switching cell carriers worth the hassle ${Y}?`,
  `What is the best plan for a single line with unlimited data ${Y}?`,
  `What is the best plan if I barely use data ${Y}?`,
  `How do I keep my phone number if I cancel my plan ${Y}?`,
  `What is the best two-line cell phone plan ${Y}?`,
  `Do I really get free streaming (Netflix, Apple TV) with my plan ${Y}?`,
  `What is the difference between 5G UW, 5G+, and regular 5G ${Y}?`,
  `Is Starlink a good home internet option ${Y}?`,
  `How much speed do I need from home internet ${Y}?`,
  `What is the best phone plan for a small business ${Y}?`,
  `How do I get the best Black Friday cell phone deal ${Y}?`,
  `Can I use one carrier for phone and another for home internet ${Y}?`,
  `What is the best backup option if my home internet goes down ${Y}?`,
  `How do I split a family plan when someone moves out ${Y}?`,
  `Mint Mobile vs Cricket Wireless: which is better ${Y}?`,
  `Google Fi vs Visible: which is better ${Y}?`,
  `US Mobile vs Visible: which is better ${Y}?`,
  `Verizon vs AT&T for rural coverage ${Y}?`,
  `Is Visible worth it ${Y}?`,
  `Is Mint Mobile worth it ${Y}?`,
  `Is Google Fi worth it ${Y}?`,
  `Is US Mobile worth it ${Y}?`,
  `Is Boost Mobile worth it ${Y}?`,
  `What is the best cell phone plan for a college student ${Y}?`,
  `What is the best first phone plan for a child ${Y}?`,
  `How do I monitor my child's phone usage ${Y}?`,
  `Do I need 5G or is 4G LTE still fine ${Y}?`,
  `How do I test a carrier's coverage before fully switching ${Y}?`,
  `How long does it take to port a phone number ${Y}?`,
  `Is a dedicated hotspot device better than phone tethering ${Y}?`,
  `What is the best cell phone plan if I work from home ${Y}?`,
  `What is the best phone plan with no credit check ${Y}?`,
  `Are family plans really cheaper than individual lines ${Y}?`,
  `How do I avoid an early termination fee when switching ${Y}?`,
  `What is the difference between an MVNO and a major carrier ${Y}?`,
  `Is unlimited data really unlimited or does it slow down ${Y}?`,
  `How do I get a free or discounted phone when I switch ${Y}?`,
  `What is the best plan for a frequent international traveler ${Y}?`,
  `Should I buy a phone from the carrier or unlocked ${Y}?`,
  `How do I read and understand my cell phone bill ${Y}?`,
].forEach(q => regular.push(q));

// ---------- TOP-10 (top10v2) ----------
const top10 = [];
[
  'Best Prepaid Cell Phone Plans', 'Best Unlimited Cell Phone Plans', 'Best Cheap Cell Phone Plans',
  'Best Family Cell Phone Plans', 'Best Cell Phone Plans for Seniors', 'Best Cell Phone Plans for Kids',
  'Best Cell Phone Plans for International Travel', 'Best No-Contract Cell Phone Plans',
  'Best Cell Phone Plans for Light Users', 'Best Cell Phone Plans for Heavy Data Users',
  'Best Business Cell Phone Plans', 'Best Pay-As-You-Go Cell Phone Plans',
  'Best Two-Line Cell Phone Plans', 'Best Cell Phone Plans with a Free Phone',
  'Best MVNO Cell Phone Carriers', 'Best Budget Cell Phone Carriers', 'Best Carriers for Rural Coverage',
  'Best Carriers for Travel', 'Best 5G Cell Phone Carriers', 'Best Value Cell Phone Carriers',
  'Best 5G Home Internet Providers', 'Best Home Internet for Rural Areas', 'Best Fixed-Wireless Internet Providers',
  'Best Satellite Internet Providers', 'Best Home Internet for Gaming',
  'Best Phones on Verizon', 'Best Phones on AT&T', 'Best Phones on T-Mobile',
  'Best Budget Smartphones', 'Best 5G Phones', 'Best Phones for Seniors', 'Best Phones for Kids',
  'Best Unlocked Phones', 'Best Smartwatches with Cellular',
].forEach(t => top10.push(`${t} ${Y}`));
// 50 metro-city carrier rankings (city != state, so no collision with the tc0001-50 state set)
const CITIES = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
  'Indianapolis', 'San Francisco', 'Seattle', 'Denver', 'Washington DC', 'Boston', 'Nashville', 'Las Vegas',
  'Portland', 'Memphis', 'Oklahoma City', 'Louisville', 'Milwaukee', 'Baltimore', 'Albuquerque', 'Tucson',
  'Fresno', 'Sacramento', 'Kansas City', 'Atlanta', 'Miami', 'Raleigh', 'Omaha', 'Minneapolis', 'Tulsa',
  'Tampa', 'New Orleans', 'Wichita', 'Cleveland', 'Pittsburgh', 'St. Louis', 'Cincinnati', 'Orlando',
  'Salt Lake City', 'Richmond',
  'Buffalo', 'Hartford', 'Birmingham', 'Rochester', 'Grand Rapids', 'Boise', 'Spokane', 'Des Moines',
  'Little Rock', 'Charleston', 'Greenville', 'Knoxville', 'Chattanooga', 'Lexington', 'Dayton', 'Akron',
  'Toledo', 'Madison', 'Reno', 'Colorado Springs', 'Virginia Beach', 'Norfolk', 'Greensboro', 'Durham',
  'Baton Rouge', 'Shreveport', 'Mobile', 'Montgomery', 'Fort Wayne', 'Anchorage'];
CITIES.forEach(c => top10.push(`Best Cellular and Wireless Carrier in ${c} ${Y}`));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const existing = new Set();
  let maxId = 50;
  for (const e of (idx.entries || [])) {
    const m = String(e.id).match(/^tc(\d+)$/i);
    if (m) maxId = Math.max(maxId, +m[1]);
    if (/^(tc)\d+$/i.test(e.id) && e.question) existing.add('tc ' + norm(e.question).toLowerCase());
  }
  const items = [];
  const claimed = new Set();
  function add(title, ruleset, kind) {
    const key = 'tc ' + norm(title).toLowerCase();
    if (existing.has(key) || claimed.has(key)) return;
    claimed.add(key);
    items.push({ title: norm(title), ruleset, kind });
  }
  // interleave regular + top10 so a partial run still yields a mix
  let ri = 0, ti = 0;
  while (ri < regular.length || ti < top10.length) {
    if (ri < regular.length) add(regular[ri++], 'telcoqa', 'qa');
    if (ti < top10.length) add(top10[ti++], 'top10v2', 'top10');
    if (ti < top10.length) add(top10[ti++], 'top10v2', 'top10');
  }
  const LIMIT = 200;
  const chosen = items.slice(0, LIMIT).map((it, i) => ({ id: 'tc' + String(maxId + 1 + i).padStart(4, '0'), ...it }));
  fs.writeFileSync('C:/Users/koryj/website/_tc_combo_queue.json', JSON.stringify(chosen, null, 1));
  const nQa = chosen.filter(c => c.ruleset === 'telcoqa').length;
  const nT10 = chosen.filter(c => c.ruleset === 'top10v2').length;
  console.log(`seeded ${chosen.length} -> _tc_combo_queue.json (regular Q&A: ${nQa}, Top-10: ${nT10}); ids ${chosen[0].id}..${chosen[chosen.length-1].id}`);
  console.log('candidates available: regular=' + regular.length + ', top10=' + top10.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
