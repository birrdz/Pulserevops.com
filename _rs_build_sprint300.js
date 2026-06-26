// Build 300-entry resorts sprint queue rs0051–rs0350 (skip existing titles).
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('rs-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_rs_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_rs_existing_titles.json', 'utf8')))
  : new Set();

const destinations = [
  'Maldives', 'Hawaii', 'Maui', 'Kauai', 'Oahu', 'Big Island', 'Caribbean', 'Bahamas',
  'Jamaica', 'Dominican Republic', 'Turks and Caicos', 'Aruba', 'St. Lucia', 'Barbados',
  'Cancún', 'Riviera Maya', 'Los Cabos', 'Puerto Vallarta', 'Tulum', 'Mexico', 'Costa Rica',
  'Bali', 'Thailand', 'Phuket', 'Koh Samui', 'Seychelles', 'Mauritius', 'Fiji', 'Bora Bora',
  'French Polynesia', 'Greece', 'Santorini', 'Mykonos', 'Crete', 'Italy', 'Amalfi Coast',
  'Tuscany', 'Spain', 'Ibiza', 'Mallorca', 'Portugal', 'Algarve', 'France', 'French Riviera',
  'Monaco', 'Switzerland', 'Austria', 'Dubai', 'Abu Dhabi', 'Malaysia', 'Singapore', 'Japan',
  'Okinawa', 'Australia', 'Gold Coast', 'New Zealand', 'Queenstown', 'South Africa', 'Morocco',
  'Marrakech', 'Egypt', 'Turkey', 'Antalya', 'California', 'Florida', 'Miami', 'Key West',
  'Arizona', 'Scottsdale', 'Colorado', 'Aspen', 'Vail', 'Park City', 'Lake Tahoe', 'Montana',
  'Big Sky', 'Vermont', 'Stowe', 'Maine', 'Cape Cod', 'Outer Banks', 'Charleston', 'Savannah',
  'Las Vegas', 'Palm Springs', 'San Diego', 'Puerto Rico', 'US Virgin Islands', 'Hilton Head',
  'Myrtle Beach', 'Nashville', 'Charlotte', 'San Juan', 'Cabo San Lucas', 'Zion', 'Sedona',
];

const resortTypes = [
  'All-Inclusive Resorts',
  'Luxury Beach Resorts',
  'Family-Friendly Resorts',
  'Adults-Only Resorts',
  'Ski Resorts',
  'Spa Resorts',
  'Wellness Retreats',
  'Golf Resorts',
  'Overwater Bungalow Resorts',
  'Boutique Resorts',
  'Eco-Resorts',
  'Honeymoon Resorts',
  'Kid-Friendly Resorts',
  'Water Park Resorts',
  'Mountain Resorts',
  'Lakefront Resorts',
  'Desert Spa Resorts',
  'Tropical Island Resorts',
  'Five-Star Resorts',
  'Budget All-Inclusive Resorts',
];

const occasions = [
  'Honeymoon', 'Family Vacation', 'Multigenerational Trip', 'Girls Trip', 'Guys Trip',
  'Wellness Getaway', 'Ski Vacation', 'Beach Escape', 'Golf Trip', 'Destination Wedding',
];

const pools = [];
for (const d of destinations) {
  pools.push(mk(`Top 10 Resorts in ${d}`, sl(`resorts-${d}`)));
}
for (const rt of resortTypes) {
  for (const d of destinations) {
    pools.push(mk(`Top 10 ${rt} in ${d}`, sl(`${rt}-${d}`)));
  }
}
for (const o of occasions) {
  for (const d of destinations.slice(0, 40)) {
    pools.push(mk(`Top 10 ${o} Resorts in ${d}`, sl(`${o}-${d}`)));
  }
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
  const d = destinations[n % destinations.length];
  const rt = resortTypes[n % resortTypes.length];
  const row = mk(`Top 10 ${rt} in ${d} for 2027`, sl(`${rt}-${d}-2027-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 51;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'rs' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_rs_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
