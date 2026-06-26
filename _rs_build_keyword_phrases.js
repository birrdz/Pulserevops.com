// Generate _rs_keyword_phrases.json for resort semantic SEO.
const fs = require('fs');

const destinations = [
  'Maldives', 'Hawaii', 'Caribbean', 'Mexico', 'Costa Rica', 'Bahamas', 'Jamaica',
  'Dominican Republic', 'Turks and Caicos', 'Aruba', 'St. Lucia', 'Barbados',
  'Cancún', 'Riviera Maya', 'Los Cabos', 'Puerto Vallarta', 'Tulum', 'Bali',
  'Thailand', 'Phuket', 'Koh Samui', 'Seychelles', 'Mauritius', 'Fiji', 'Bora Bora',
  'French Polynesia', 'Greece', 'Santorini', 'Mykonos', 'Crete', 'Italy', 'Amalfi Coast',
  'Tuscany', 'Spain', 'Ibiza', 'Mallorca', 'Portugal', 'Algarve', 'France', 'French Riviera',
  'Monaco', 'Switzerland', 'Austria', 'Dubai', 'Abu Dhabi', 'Maldives', 'Malaysia',
  'Singapore', 'Japan', 'Okinawa', 'Australia', 'Gold Coast', 'New Zealand', 'Queenstown',
  'South Africa', 'Morocco', 'Marrakech', 'Egypt', 'Turkey', 'Antalya', 'California',
  'Florida', 'Miami', 'Key West', 'Hawaii Big Island', 'Maui', 'Kauai', 'Oahu',
  'Arizona', 'Scottsdale', 'Colorado', 'Aspen', 'Vail', 'Park City', 'Lake Tahoe',
  'Montana', 'Big Sky', 'Vermont', 'Stowe', 'Maine', 'Cape Cod', 'Outer Banks',
  'Charleston', 'Savannah', 'Nashville', 'Las Vegas', 'Palm Springs', 'San Diego',
  'Cabo San Lucas', 'Puerto Rico', 'US Virgin Islands', 'Hilton Head', 'Myrtle Beach',
];

const types = [
  'all-inclusive resorts',
  'luxury beach resorts',
  'family-friendly resorts',
  'adults-only resorts',
  'ski resorts',
  'spa resorts',
  'wellness retreats',
  'golf resorts',
  'overwater bungalow resorts',
  'boutique resorts',
  'eco-resorts',
  'honeymoon resorts',
  'kid-friendly resorts',
  'water park resorts',
  'mountain resorts',
  'lakefront resorts',
  'desert spa resorts',
  'tropical island resorts',
  'five-star resorts',
  'budget-friendly all-inclusive resorts',
];

const intents = [
  'Best all-inclusive resorts in {d}',
  'Top 10 luxury resorts in {d}',
  'Best family resorts in {d}',
  'Best honeymoon resorts in {d}',
  'Best ski resorts in {d}',
  'Best beach resorts in {d}',
  'Best spa resorts in {d}',
  'Best adults-only resorts in {d}',
  'Best golf resorts in {d}',
  'Best overwater bungalow resorts in {d}',
  'Best kid-friendly resorts in {d}',
  'Best budget all-inclusive resorts in {d}',
  'Best five-star resorts in {d}',
  'Best wellness retreats in {d}',
  'Best boutique resorts in {d}',
];

const extras = [
  'Best resorts with private pools',
  'Best resorts with water slides for kids',
  'Best all-inclusive resorts with no tipping',
  'Best ski-in ski-out resorts',
  'Best beach resorts with butler service',
  'Best resorts for multigenerational travel',
  'Best resorts with kids clubs',
  'Best resorts with swim-up bars',
  'Best pet-friendly luxury resorts',
  'Best resorts with Michelin dining',
  'Best eco-friendly luxury resorts',
  'Best resorts with infinity pools',
  'Best resorts for destination weddings',
  'Best resorts with snorkeling off the beach',
  'Best all-inclusive resorts for couples',
  'Best mountain spa resorts',
  'Best lake resorts with boating',
  'Best desert golf resorts',
  'Best tropical resorts under $300 per night',
  'Best luxury resorts with airport transfers included',
];

const phrases = new Set();
for (const d of destinations) {
  for (const t of intents) phrases.add(t.replace('{d}', d));
  for (const t of types.slice(0, 8)) phrases.add(`Best ${t} in ${d}`);
}
for (const e of extras) phrases.add(e);
for (const d of destinations.slice(0, 30)) {
  phrases.add(`Top 10 resorts in ${d} for 2027`);
  phrases.add(`Where to stay in ${d} — best resorts ranked`);
}

const out = Array.from(phrases).slice(0, 220);
fs.writeFileSync('C:/Users/koryj/website/_rs_keyword_phrases.json', JSON.stringify(out, null, 2));
console.log('wrote', out.length, 'phrases');
