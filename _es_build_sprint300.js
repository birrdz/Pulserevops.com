// Build 300-entry estates sprint queue es0051–es0350 (skip existing live titles).
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('estate-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_es_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_es_existing_titles.json', 'utf8')))
  : new Set();

const metros = [
  'Miami', 'Atlanta', 'Houston', 'Austin', 'Phoenix', 'Scottsdale', 'Denver', 'Seattle',
  'San Diego', 'San Francisco', 'Nashville', 'Charlotte', 'Las Vegas', 'Boston', 'Washington DC',
  'Chicago', 'Naples Florida', 'Palm Beach', 'Aspen', 'Park City Utah', 'Dallas', 'Los Angeles',
  'New York City', 'Brooklyn', 'San Antonio', 'Tampa', 'Orlando', 'Raleigh', 'Salt Lake City',
  'Boise', 'Portland Oregon', 'Minneapolis', 'Detroit', 'Cleveland', 'Pittsburgh', 'Baltimore',
  'Richmond', 'Savannah', 'Charleston', 'Jacksonville', 'Fort Lauderdale', 'Santa Barbara',
  'Palm Springs', 'Boulder', 'Colorado Springs', 'Honolulu', 'Kauai', 'Maui',
];

const states = [
  'California', 'Arizona', 'Colorado', 'Georgia', 'South Carolina', 'North Carolina', 'Nevada',
  'Idaho', 'Montana', 'Virginia', 'Washington State', 'Oregon', 'Alabama', 'Kentucky', 'Michigan',
  'Texas', 'Florida', 'Tennessee', 'Utah', 'New Mexico', 'Wyoming', 'Maine', 'New Hampshire',
];

const propertyTypes = [
  'Waterfront Estates', 'Golf Course Communities', 'Gated Communities', 'Master-Planned Communities',
  '55-Plus Communities', 'Lake Communities', 'Beach Towns', 'Mountain Towns', 'Ski Towns',
  'Equestrian Communities', 'Vineyard Estates', 'Luxury Condos', 'Luxury High-Rises',
  'Custom Home Builders', 'Production Home Builders', 'New-Construction Communities',
  'Vacation Rental Markets', 'Investment Property Markets', 'Retirement Communities',
  'Historic Districts', 'Walkable Neighborhoods', 'Suburbs', 'Luxury Neighborhoods',
];

const niches = [
  'Best Places to Buy a Horse Property',
  'Best Places to Buy a Waterfront Cabin',
  'Best Places to Buy a Golf Villa',
  'Best Places to Buy a Mountain Cabin',
  'Best Places to Buy a Luxury Penthouse',
  'Best Places to Buy a Waterfront Estate',
  'Best Places to Buy a Historic Mansion',
  'Best Places to Buy a Smart Home',
  'Best Places to Buy a Tiny Home or Cabin',
  'Best Places to Buy Raw Land',
  'Best Places to Buy a Hobby Farm',
  'Best Places to Buy a Beach House',
  'Best Places to Buy a Lake House',
  'Best Places to Buy a Ski Cabin',
  'Best Places to Buy a Ranch',
  'Best Places to Buy a Vineyard or Winery',
  'Most Affordable Beach Towns to Buy a Home',
  'Most Affordable Mountain Towns to Buy a Home',
  'Most Affordable Lake Towns to Buy a Home',
  'Best Places to Buy a Starter Home',
  'Best Places to Buy a Home Under 400k',
  'Best Places to Buy a Home Under 500k',
  'Best Places to Buy a Home for Remote Workers',
  'Best Places to Buy a Home for Families',
  'Best Walkable Cities to Buy a Home',
  'Best College Towns to Buy a Home',
  'Best Small Towns to Retire and Buy a Home',
  'Best Sun Belt Cities to Buy a Home',
  'Best Real Estate Markets to Invest In',
  'Best Rental Property Markets',
  'Best Airbnb Markets to Buy a Vacation Rental',
  'Best Markets for Buy-and-Hold Rental Property',
  'Best Cities for Rental Property Cash Flow',
  'Fastest-Growing Real Estate Markets',
  'Best Markets for Luxury Vacation Rentals',
  'Best Overseas Markets for US Buyers',
  'Best Countries to Buy a Vacation Home',
  'Best Places to Buy a Home in Costa Rica',
  'Best Places to Buy a Beach House in Mexico',
  'Best Places to Buy a Vacation Home in the Caribbean',
  'Best Places to Buy a Home in Portugal',
  'Best Places to Buy a Home in Italy',
  'Best Places to Buy a Home in Spain',
  'Most Expensive Neighborhoods in America',
  'Most Expensive Zip Codes to Buy a Home',
  'Best Private Ski Club Communities',
  'Best Yacht and Marina Communities to Buy In',
  'Best Oceanfront Luxury Communities',
  'Best Luxury Golf Resort Communities',
  'Best Ultra-Luxury Condo Towers',
  'Best Celebrity-Favorite Towns to Buy a Home',
  'Best Wine Country Communities to Buy In',
  'Best Desert Golf Communities',
  'Best Lakefront Luxury Communities',
  'Best Coastal Luxury Communities',
  'Best Luxury Markets in the Southeast',
  'Best Luxury Markets in the Southwest',
  'Best Luxury Markets in the Northeast',
  'Best Luxury Markets in the Pacific Northwest',
  'Green and Energy-Efficient Home Builders',
  'Barndominium Builders',
  'Log and Timber Home Builders',
  'Modular and Prefab Luxury Home Companies',
  'Del Webb Communities to Buy In',
  'Luxury Custom Home Builders',
  'Smart Home Builders',
];

const pools = [];

for (const m of metros) pools.push(mk(`Top 10 Luxury Neighborhoods in ${m}`, sl(`luxury-neighborhoods-${m}`)));
for (const s of states) pools.push(mk(`Top 10 Best Places to Buy a Home in ${s}`, sl(`buy-home-${s}`)));
for (const s of states.slice(0, 20)) pools.push(mk(`Top 10 Gated Communities in ${s}`, sl(`gated-${s}`)));
for (const s of states.slice(0, 15)) pools.push(mk(`Top 10 Master-Planned Communities in ${s}`, sl(`master-planned-${s}`)));
for (const s of states.slice(0, 12)) pools.push(mk(`Top 10 Golf Course Communities in ${s}`, sl(`golf-${s}`)));
for (const s of states.slice(0, 10)) pools.push(mk(`Top 10 55-Plus Communities in ${s}`, sl(`55plus-${s}`)));
for (const s of states.slice(0, 10)) pools.push(mk(`Top 10 Waterfront Communities in ${s}`, sl(`waterfront-${s}`)));
for (const s of states.slice(0, 8)) pools.push(mk(`Top 10 Best Places to Retire in ${s}`, sl(`retire-${s}`)));
for (const pt of propertyTypes) {
  for (const m of metros.slice(0, 12)) {
    pools.push(mk(`Top 10 ${pt} in ${m}`, sl(`${pt}-${m}`)));
  }
}
for (const n of niches) pools.push(mk(`Top 10 ${n}`, sl(n)));
for (const m of metros.slice(0, 20)) {
  pools.push(mk(`Top 10 New-Construction Luxury Communities in ${m}`, sl(`new-construction-${m}`)));
  pools.push(mk(`Top 10 Luxury Custom Home Builders in ${m}`, sl(`custom-builders-${m}`)));
}

const seen = new Set(existing);
const unique = [];
for (const row of pools) {
  if (seen.has(row.title)) continue;
  seen.add(row.title);
  unique.push(row);
}
let n = 0;
while (unique.length < 300) {
  const m = metros[n % metros.length];
  const pt = propertyTypes[n % propertyTypes.length];
  const row = mk(`Top 10 ${pt} in ${m} for 2027`, sl(`${pt}-${m}-2027-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 51;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'es' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_es_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
