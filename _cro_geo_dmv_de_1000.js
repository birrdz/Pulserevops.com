// _cro_geo_dmv_de_1000.js — Owner ask (2026-06-29): "do 1000 more CRO Pulse Tools (tl)
// entries — hit EVERY city in Maryland, the DMV, Delaware, and DC."
// Strategy: comprehensive city lists for DC + all Maryland + Delaware (+ NoVA = the DMV),
// multiple honest fractional-CRO angles, deduped against the live index AND every CRO queue,
// then APPEND up to 1000 NEW items to _cro_ds_queue.json. Every title ends "in 2027" (LOCKED).
// Honest ruleset is applied by the writer (_cro_ds_run.js, ruleset:'cro') — no fabrication.
// Additive + idempotent: re-run anytime; only brand-new questions are added.
// Usage: node _cro_geo_dmv_de_1000.js
const fs = require('fs');
const ROOT = 'C:/Users/koryj/website/';
for (const l of fs.readFileSync(ROOT + '.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const yearize = q => /\bin 20\d\d\b/.test(q) ? q : q.replace(/\?\s*$/, ' in 2027?');
const CAP = parseInt(process.env.GEO_CAP || '1000', 10);

// Washington DC + its named districts.
const DC = ['Washington DC', 'Capitol Hill', 'Georgetown', 'Navy Yard', 'Dupont Circle', 'Foggy Bottom', 'Adams Morgan', 'Anacostia', 'Columbia Heights', 'NoMa'];

// MARYLAND — full statewide coverage (DMV-close + every region; ~190 places).
const MD = [
  'Annapolis','Baltimore','Frederick','Rockville','Gaithersburg','Bowie','Hagerstown','Salisbury','College Park','Greenbelt','Cumberland','Westminster','Hyattsville','Laurel','Bel Air','Bethesda','Silver Spring','Columbia','Ellicott City','Glen Burnie','Towson','Dundalk','Germantown','Waldorf','Severna Park','Pasadena','Pikesville','Catonsville','Essex','Aspen Hill','Wheaton','Potomac','Olney','Crofton','Odenton','Fort Washington','Clinton','Oxon Hill','Upper Marlboro','Easton','Cambridge','Chestertown','Elkton','Aberdeen','Havre de Grace','Edgewater','Stevensville','Chester','Ocean City','Berlin','Leonardtown','La Plata','Lexington Park','Prince Frederick','Solomons','Owings Mills','Reisterstown','Eldersburg','Mount Airy','Walkersville','Thurmont','Brunswick','Hampstead','Sykesville','Kent Island',
  'Takoma Park','New Carrollton','Cheverly','Bladensburg','Riverdale Park','Mount Rainier','Brentwood','District Heights','Capitol Heights','Seat Pleasant','Glenarden','Landover','Suitland','Temple Hills','Camp Springs','Forestville','Largo','Mitchellville','Beltsville','Adelphi','Langley Park','Burtonsville','Montgomery Village','Damascus','Poolesville','Kensington','Garrett Park','Chevy Chase','Glen Echo','Cabin John','Clarksburg','Boyds','Sandy Spring','Brookeville','Highland','Fulton','Savage','Jessup','Hanover','Elkridge','Arbutus','Lansdowne','Halethorpe','Woodlawn','Randallstown','Cockeysville','Hunt Valley','Timonium','Lutherville','Parkville','Perry Hall','White Marsh','Middle River','Rosedale','Overlea','Nottingham','Kingsville','Joppatowne','Edgewood','Abingdon','Fallston','Forest Hill','Jarrettsville','Perryville','North East','Rising Sun','Port Deposit','Chesapeake City','Galena','Rock Hall','Millington','Sudlersville','Queenstown','Grasonville','Church Hill','Ridgely','Denton','Greensboro','Federalsburg','Hurlock','Preston','Hebron','Fruitland','Princess Anne','Crisfield','Pocomoke City','Snow Hill','Frostburg','LaVale','Mount Savage','Lonaconing','Westernport','Oakland','Mountain Lake Park','Grantsville','Accident','Friendsville','Smithsburg','Boonsboro','Williamsport','Clear Spring','Hancock','Keedysville','Sharpsburg','Myersville','Emmitsburg','Woodsboro','New Market','Union Bridge','New Windsor','Manchester','Taneytown','Pikesville','Lochearn','Milford Mill','Carney','Dickerson','Barnesville','Friendship Heights'
];

// DELAWARE — full statewide coverage (every city/town, ~75 places).
const DE = [
  'Wilmington','Dover','Newark','Middletown','Smyrna','Milford','Seaford','Georgetown','Elsmere','New Castle','Bear','Glasgow','Brookside','Pike Creek','Hockessin','Claymont','Lewes','Rehoboth Beach','Bethany Beach','Millsboro','Laurel','Delmar','Harrington','Camden','Wyoming','Clayton','Townsend','Felton','Milton','Selbyville','Ocean View','Frankford','Dagsboro','Bridgeville','Greenwood','Frederica','Magnolia','Cheswold','Little Creek','Leipsic','Delaware City','Odessa','Newport','Wilmington Manor','Stanton','Christiana','Greenville','Centreville','Yorklyn','Fenwick Island','Dewey Beach','Henlopen Acres','Bowers','Woodside','Viola','Hartly','Kenton','Marydel','Houston','Ellendale','Lincoln','Blades','Bethel','Slaughter Beach','Bellefonte','Arden','Ardentown','Ardencroft','Port Penn','Kitts Hummock','Dover Air Force Base','Long Neck','North Star','Edgemoor'
];

// Northern Virginia = the VA side of the DMV (kept for completeness).
const NOVA = ['Arlington','Alexandria','Fairfax','Reston','Tysons','McLean','Vienna','Falls Church','Herndon','Ashburn','Leesburg','Manassas','Woodbridge','Springfield','Annandale','Centreville VA','Chantilly','Sterling','Burke','Lorton','Dumfries','Gainesville','Bristow','Dale City','Great Falls','Oakton','Fairfax Station','Lansdowne VA','Purcellville','Haymarket'];

// Honest angles (writer enforces no-fabrication ranges via ruleset:'cro').
const angle = c => [
  'How do I find a fractional CRO in ' + c + '?',
  'What does a fractional CRO cost in ' + c + '?',
  'How do I hire a fractional CRO in ' + c + '?',
  'Who is the best fractional CRO in ' + c + '?',
  'Should I hire a fractional CRO in ' + c + '?',
];

// Build candidate list. Order: DC, MD, DE, NoVA, then state-level roll-ups.
const cands = [];
for (const c of [...DC, ...MD, ...DE, ...NOVA]) for (const q of angle(c)) cands.push(q);
[
  'How do I find a fractional CRO in Maryland?', 'What does a fractional CRO cost in Maryland?', 'How do I hire a fractional CRO in Maryland?',
  'How do I find a fractional CRO in Delaware?', 'What does a fractional CRO cost in Delaware?', 'How do I hire a fractional CRO in Delaware?',
  'How do I find a fractional CRO in the DMV area?', 'What does a fractional CRO cost in the DMV?', 'How do I hire a fractional CRO in the DMV?',
].forEach(t => cands.push(t));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }
  const QUEUES = ['_cro_market_queue.json','_cro_ds_queue.json','_cro_cc_queue.json','_cro_more_queue.json','_cro_more2_queue.json','_sales_help_queue.json','_cro_geo_queue.json','_cro_geo_dmv_de_queue.json'];
  for (const f of QUEUES) {
    try { for (const it of JSON.parse(fs.readFileSync(ROOT + f, 'utf8'))) { have.add(norm(it.title)); const m = String(it.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); } } catch (e) {}
  }
  const seen = new Set();
  const fresh = [];
  for (const t of cands) {
    if (fresh.length >= CAP) break;
    const y = yearize(t); const k = norm(y);
    if (have.has(k) || seen.has(k)) continue;
    seen.add(k); fresh.push(y);
  }
  let id = maxTl;
  const mk = t => ({ id: 'tl' + String(++id).padStart(4, '0'), title: t, kind: 'cro', prefix: 'tl' });
  const items = fresh.map(mk);
  // record this batch separately for traceability
  fs.writeFileSync(ROOT + '_cro_geo_dmv_de_queue.json', JSON.stringify(items, null, 1));
  // append to the live DeepSeek queue (writer + monitor pick it up; no restart needed)
  let ds = []; try { ds = JSON.parse(fs.readFileSync(ROOT + '_cro_ds_queue.json', 'utf8')); } catch (e) {}
  const next = ds.concat(items);
  fs.writeFileSync(ROOT + '_cro_ds_queue.json', JSON.stringify(next, null, 1));
  const cities = DC.length + MD.length + DE.length + NOVA.length;
  console.log(`candidates=${cands.length} (cities=${cities} x ~5 angles) | NEW after dedup (cap ${CAP})=${items.length}`);
  console.log(`ids ${items.length ? items[0].id + '..' + items[items.length-1].id : '(none)'}`);
  console.log(`_cro_ds_queue.json: ${ds.length} -> ${next.length}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
