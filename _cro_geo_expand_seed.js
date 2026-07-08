// _cro_geo_expand_seed.js — CRO geo coverage. Owner priority:
//   (1) keep exhausting normal CRO searches, but (2) do EVERY city in the DMV + DC FIRST.
// So: the DMV group (DC + all Maryland + Northern Virginia, find/cost/hire each) is
// PREPENDED to the front of _cro_ds_queue.json; the nationwide one-per-city sweep is
// APPENDED to the end. Every title ends "in 2027" (locked). Additive + idempotent.
// Usage: node _cro_geo_expand_seed.js
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// LOCKED: every title ends "in 2027"
const yearize = q => /\bin 20\d\d\b/.test(q) ? q : q.replace(/\?\s*$/, ' in 2027?');

// Washington DC.
const DC = ['Washington DC', 'Washington, D.C.', 'Capitol Hill', 'Georgetown', 'Navy Yard'];
// Maryland (home state — full coverage, DMV-close + statewide).
const MD = ['Annapolis', 'Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Salisbury', 'College Park', 'Greenbelt', 'Cumberland', 'Westminster', 'Hyattsville', 'Laurel', 'Bel Air', 'Bethesda', 'Silver Spring', 'Columbia', 'Ellicott City', 'Glen Burnie', 'Towson', 'Dundalk', 'Germantown', 'Waldorf', 'Severna Park', 'Pasadena', 'Pikesville', 'Catonsville', 'Essex', 'Aspen Hill', 'Wheaton', 'Potomac', 'Olney', 'Crofton', 'Odenton', 'Fort Washington', 'Clinton', 'Oxon Hill', 'Upper Marlboro', 'Easton', 'Cambridge', 'Chestertown', 'Elkton', 'Aberdeen', 'Havre de Grace', 'Edgewater', 'Stevensville', 'Chester', 'Ocean City', 'Berlin', 'Leonardtown', 'La Plata', 'Lexington Park', 'Prince Frederick', 'Solomons', 'Owings Mills', 'Reisterstown', 'Eldersburg', 'Mount Airy', 'Walkersville', 'Thurmont', 'Brunswick', 'Hampstead', 'Sykesville', 'Kent Island'];
// Northern Virginia (the VA side of the DMV).
const NOVA = ['Arlington', 'Alexandria', 'Fairfax', 'Reston', 'Tysons', 'McLean', 'Vienna', 'Falls Church', 'Herndon', 'Ashburn', 'Leesburg', 'Manassas', 'Woodbridge', 'Springfield', 'Annandale', 'Centreville', 'Chantilly', 'Sterling', 'Burke', 'Lorton', 'Fredericksburg', 'Dumfries', 'Stafford', 'Gainesville', 'Bristow', 'Dale City', 'Great Falls', 'Oakton', 'Fairfax Station', 'Lansdowne'];
// Just-about-every US city (broad one-per-city sweep).
const US = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'San Jose', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco', 'Seattle', 'Denver', 'Oklahoma City', 'Nashville', 'El Paso', 'Boston', 'Portland', 'Las Vegas', 'Detroit', 'Memphis', 'Louisville', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Long Beach', 'Virginia Beach', 'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Bakersfield', 'Wichita', 'Aurora', 'Tampa', 'New Orleans', 'Cleveland', 'Honolulu', 'Anaheim', 'Lexington', 'Stockton', 'Corpus Christi', 'Henderson', 'Riverside', 'Newark', 'Saint Paul', 'Santa Ana', 'Cincinnati', 'Irvine', 'Orlando', 'Pittsburgh', 'St. Louis', 'Greensboro', 'Jersey City', 'Anchorage', 'Lincoln', 'Plano', 'Durham', 'Buffalo', 'Chandler', 'Chula Vista', 'Toledo', 'Madison', 'Gilbert', 'Reno', 'Fort Wayne', 'St. Petersburg', 'Lubbock', 'Irving', 'Laredo', 'Winston-Salem', 'Chesapeake', 'Glendale', 'Garland', 'Scottsdale', 'Norfolk', 'Boise', 'Fremont', 'Spokane', 'Santa Clarita', 'Baton Rouge', 'Richmond', 'Hialeah', 'San Bernardino', 'Tacoma', 'Modesto', 'Huntsville', 'Des Moines', 'Yonkers', 'Rochester', 'Moreno Valley', 'Fayetteville', 'Fontana', 'Worcester', 'Port St. Lucie', 'Little Rock', 'Augusta', 'Oxnard', 'Birmingham', 'Montgomery', 'Frisco', 'Amarillo', 'Salt Lake City', 'Grand Rapids', 'Huntington Beach', 'Overland Park', 'Tempe', 'McKinney', 'Mobile', 'Cape Coral', 'Shreveport', 'Knoxville', 'Providence', 'Akron', 'Brownsville', 'Newport News', 'Fort Lauderdale', 'Tallahassee', 'Chattanooga', 'Sioux Falls', 'Ontario', 'Cary', 'Eugene', 'Pembroke Pines', 'Peoria', 'Springfield IL', 'Naples', 'Fort Collins', 'Boulder', 'Ann Arbor', 'Charleston', 'Savannah', 'Bellevue', 'Stamford', 'Hartford', 'Palo Alto', 'Mountain View', 'Sunnyvale', 'Berkeley', 'San Mateo', 'Bentonville', 'Provo', 'Sarasota', 'Asheville', 'Greenville', 'Wilmington', 'Dayton', 'Spartanburg', 'Boca Raton', 'Plantation', 'Scranton', 'Allentown', 'Trenton', 'Wichita Falls', 'Tuscaloosa', 'Macon', 'Lansing', 'Rockford', 'Peoria AZ', 'Roanoke', 'Lancaster', 'Clearwater', 'Pomona', 'Escondido', 'Joliet', 'Naperville', 'Bridgeport', 'Savoy'];

function triples(arr, out) { for (const c of arr) { out.push('How do I find a fractional CRO in ' + c + '?'); out.push('What does a fractional CRO cost in ' + c + '?'); out.push('How do I hire a fractional CRO in ' + c + '?'); } }
// DMV-FIRST group (DC + MD + NoVA), deep
const dmvCands = [];
triples(DC, dmvCands); triples(MD, dmvCands); triples(NOVA, dmvCands);
['How do I find a fractional CRO in Maryland?', 'What does a fractional CRO cost in Maryland?', 'How do I hire a fractional CRO in Maryland?', 'How do I find a fractional CRO in the DMV area?', 'How do I find a fractional CRO in Northern Virginia?'].forEach(t => dmvCands.push(t));
// nationwide group, one finder each
const usCands = US.map(c => 'How do I find a fractional CRO in ' + c + '?');

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }
  for (const f of ['_cro_market_queue.json', '_cro_ds_queue.json', '_cro_cc_queue.json', '_cro_more_queue.json', '_cro_more2_queue.json', '_sales_help_queue.json', '_cro_geo_queue.json']) {
    try { for (const it of JSON.parse(fs.readFileSync('C:/Users/koryj/website/' + f, 'utf8'))) { have.add(norm(it.title)); const m = String(it.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); } } catch (e) {}
  }
  const seen = new Set();
  function dedupe(cands) { const out = []; for (const t of cands) { const y = yearize(t); const k = norm(y); if (have.has(k) || seen.has(k)) continue; seen.add(k); out.push(y); } return out; }
  const dmv = dedupe(dmvCands), us = dedupe(usCands);
  let id = maxTl;
  const mk = t => ({ id: 'tl' + String(++id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' });
  const dmvItems = dmv.map(mk), usItems = us.map(mk);
  // record (full geo set) + rebuild the live queue: DMV FIRST, then existing, then nationwide
  fs.writeFileSync('C:/Users/koryj/website/_cro_geo_queue.json', JSON.stringify(dmvItems.concat(usItems), null, 1));
  let ds = []; try { ds = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cro_ds_queue.json', 'utf8')); } catch (e) {}
  // Owner: order flexible — append both groups (DMV + nationwide) to the end. No restart;
  // the running writer keeps going and the monitor loads these on its next relaunch.
  const next = ds.concat(dmvItems, usItems);
  fs.writeFileSync('C:/Users/koryj/website/_cro_ds_queue.json', JSON.stringify(next, null, 1));
  console.log(`DMV new=${dmvItems.length} (DC ${DC.length}+MD ${MD.length}+NoVA ${NOVA.length}) | nationwide new=${usItems.length}`);
  console.log(`queue: ${ds.length} existing + ${dmvItems.length} DMV + ${usItems.length} nationwide = ${next.length}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
