// Build 300-entry dining sprint queue dn0119–dn0418 (skip existing titles).
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('dine-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_dn_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_dn_existing_titles.json', 'utf8')))
  : new Set();

const cities = [
  'Minneapolis', 'St. Paul', 'Milwaukee', 'Indianapolis', 'Columbus', 'Cincinnati', 'Kansas City',
  'Omaha', 'Des Moines', 'Salt Lake City', 'Boise', 'Albuquerque', 'Santa Fe', 'Tucson',
  'Phoenix', 'Scottsdale', 'Tampa', 'St. Petersburg', 'Jacksonville', 'Orlando', 'Tallahassee',
  'Birmingham', 'Mobile', 'Little Rock', 'Oklahoma City', 'Tulsa', 'Wichita', 'Louisville',
  'Lexington', 'Richmond', 'Norfolk', 'Virginia Beach', 'Raleigh', 'Durham', 'Wilmington',
  'Greenville', 'Columbia', 'Knoxville', 'Chattanooga', 'Jackson', 'Baton Rouge', 'Lafayette',
  'Tulsa', 'Fresno', 'Sacramento', 'Oakland', 'San Jose', 'Long Beach', 'Pasadena',
  'Santa Barbara', 'Palm Springs', 'Tucson', 'Flagstaff', 'Boulder', 'Colorado Springs',
  'Albuquerque', 'Santa Monica', 'West Hollywood', 'Beverly Hills', 'Manhattan Beach',
  'Jersey City', 'Hoboken', 'Providence', 'Hartford', 'New Haven', 'Burlington', 'Portland, Maine',
  'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Pittsburgh', 'Cleveland', 'Detroit',
  'Grand Rapids', 'Madison', 'Ann Arbor', 'Champaign', 'Springfield', 'St. Louis',
  'Kansas City', 'Omaha', 'Lincoln', 'Fargo', 'Sioux Falls', 'Billings', 'Anchorage',
  'Honolulu', 'Maui', 'Kauai', 'Vancouver', 'Toronto', 'Montreal', 'Quebec City',
  'Calgary', 'Edmonton', 'London', 'Edinburgh', 'Dublin', 'Barcelona', 'Madrid', 'Lisbon',
  'Rome', 'Florence', 'Milan', 'Paris', 'Lyon', 'Berlin', 'Munich', 'Amsterdam',
  'Brussels', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Prague', 'Vienna', 'Budapest',
  'Athens', 'Istanbul', 'Dubai', 'Singapore', 'Hong Kong', 'Tokyo', 'Osaka', 'Seoul',
  'Bangkok', 'Ho Chi Minh City', 'Sydney', 'Melbourne', 'Auckland', 'Mexico City', 'Oaxaca',
  'Cancún', 'Tulum', 'Buenos Aires', 'Lima', 'Bogotá', 'Santiago', 'Cape Town', 'Marrakech',
];

const cuisines = [
  'Italian', 'French', 'Japanese', 'Sushi', 'Ramen', 'Korean BBQ', 'Thai', 'Vietnamese',
  'Indian', 'Mexican', 'Tex-Mex', 'BBQ', 'Steakhouse', 'Seafood', 'Oyster Bar', 'Pizza',
  'Dim Sum', 'Chinese', 'Mediterranean', 'Greek', 'Spanish Tapas', 'Portuguese', 'Peruvian',
  'Brazilian', 'Caribbean', 'Cajun', 'Creole', 'Soul Food', 'Southern', 'Farm-to-Table',
  'Vegetarian', 'Vegan', 'Brunch', 'Bakery', 'Dessert', 'Coffee Shop', 'Wine Bar',
  'Bistro', 'Fine Dining', 'Casual Dining', 'Hot Chicken', 'Tacos', 'Burgers', 'Hot Dogs',
  'Deli', 'Sandwich Shop', 'Pho', 'Middle Eastern', 'Ethiopian', 'Filipino', 'Hawaiian',
];

const occasions = [
  'Date Night', 'Family-Friendly', 'Business Lunch', 'Brunch', 'Birthday Dinner',
  'Anniversary Dinner', 'Group Dining', 'Waterfront Dining', 'Rooftop Dining', 'Late-Night Dining',
  'Happy Hour', 'Sunday Dinner', 'Holiday Dinner', 'Outdoor Patio Dining',
];

const neighborhoods = [
  'Downtown', 'Midtown', 'Historic District', 'Waterfront', 'Arts District', 'University Area',
  'Old Town', 'Financial District', 'River North', 'French Quarter', 'Gaslamp Quarter',
];

const pools = [];
for (const c of cities) pools.push(mk(`Top 10 Places to Dine in ${c}`, sl(c)));
for (const cu of cuisines) {
  for (const c of cities.slice(0, 40)) {
    pools.push(mk(`Top 10 ${cu} Restaurants in ${c}`, sl(`${cu}-${c}`)));
  }
}
for (const o of occasions) {
  for (const c of cities.slice(0, 25)) {
    pools.push(mk(`Top 10 ${o} Restaurants in ${c}`, sl(`${o}-${c}`)));
  }
}
for (const n of neighborhoods) {
  for (const c of cities.slice(0, 15)) {
    pools.push(mk(`Top 10 Restaurants in ${n} ${c}`, sl(`${n}-${c}`)));
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
  const c = cities[n % cities.length];
  const cu = cuisines[n % cuisines.length];
  const row = mk(`Top 10 ${cu} Spots in ${c} for 2027`, sl(`${cu}-${c}-2027-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 119;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'dn' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_dn_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
