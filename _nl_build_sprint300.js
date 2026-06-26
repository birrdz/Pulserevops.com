// Build 300-entry nightlife sprint queue nl0101–nl0400.
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const cities = [
  'Chicago', 'San Francisco', 'Atlanta', 'Houston', 'Dallas', 'Denver', 'Seattle', 'Boston',
  'Philadelphia', 'San Diego', 'Scottsdale', 'Charlotte', 'Tampa', 'Orlando', 'Savannah',
  'Memphis', 'Minneapolis', 'Portland, Oregon', 'Pittsburgh', 'Phoenix', 'Honolulu',
  'Charleston', 'Kansas City', 'San Antonio', 'Fort Lauderdale', 'Key West', 'St. Louis',
  'Cleveland', 'Detroit', 'Baltimore', 'Richmond', 'Raleigh', 'Nashville', 'Austin',
  'New Orleans', 'Miami', 'Las Vegas', 'Los Angeles', 'New York City', 'Brooklyn',
  'Washington, D.C.', 'West Hollywood', 'Miami Beach', 'Scottsdale', 'Santa Monica',
];
// cities list fixed above

const intl = [
  'London', 'Berlin', 'Amsterdam', 'Tokyo', 'Ibiza', 'Barcelona', 'Bangkok', 'Tulum',
  'Mexico City', 'Toronto', 'Montreal', 'Dubai', 'Lisbon', 'Paris', 'Seoul', 'Sydney',
  'Copenhagen', 'Stockholm', 'Dublin', 'Prague',
];

const types = [
  'Rooftop Bars', 'Speakeasies', 'Nightclubs', 'Dive Bars', 'Jazz Clubs', 'Wine Bars',
  'Sports Bars', 'Comedy Clubs', 'Gay Bars', 'Tiki Bars', 'Cocktail Bars', 'Whiskey Bars',
  'Karaoke Bars', 'Live Music Venues', 'Beach Clubs', 'Hotel Bars', 'Dance Clubs', 'Lounges',
  'Piano Bars', 'Brewpubs with Late Hours', 'Hookah Lounges', 'Craft Beer Bars',
  'Latin Dance Clubs', 'Country Bars', 'Blues Clubs', 'Rooftop Lounges', 'Pool Clubs',
  'After-Hours Spots', 'VIP Bottle-Service Clubs', 'Industry Hangouts',
];

const occasions = [
  'Date Night', 'Bachelor Parties', 'Birthday Nights Out', 'Solo Travelers', 'Tourists',
  'Locals', 'Weekend Nights', 'Thursday Nights', 'After-Work Drinks', 'Live DJ Nights',
  'Late-Night Dancing', 'Cocktail-Focused Nights', 'No-Cover Nights', 'Group Celebrations',
];

const pools = [];
for (const c of cities) pools.push(mk(`Top 10 Nightlife Spots in ${c}`, `nightlife-${sl(c)}`));
for (const c of intl) pools.push(mk(`Top 10 Nightlife Spots in ${c}`, `nightlife-${sl(c)}`));
for (const t of types) {
  for (const c of [...cities.slice(0, 20), ...intl.slice(0, 10)]) {
    pools.push(mk(`Top 10 ${t} in ${c}`, sl(`${t}-${c}`)));
  }
}
for (const o of occasions) {
  for (const c of cities.slice(0, 15)) {
    pools.push(mk(`Top 10 ${o} Nightlife Spots in ${c}`, sl(`${o}-nightlife-${c}`)));
  }
}

const seen = new Set();
const unique = [];
for (const row of pools) {
  if (seen.has(row.title)) continue;
  seen.add(row.title);
  unique.push(row);
}
while (unique.length < 300) {
  const c = cities[unique.length % cities.length];
  const t = types[unique.length % types.length];
  const row = mk(`Top 10 ${t} in ${c} for 2027`, sl(`${t}-${c}-2027-${unique.length}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
}

const out = unique.slice(0, 300).map((e, i) => ({
  id: 'nl' + String(101 + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_nl_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
