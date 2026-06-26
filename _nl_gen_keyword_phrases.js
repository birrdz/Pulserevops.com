// Generate 300 nightlife search-intent keyword phrases for semantic SEO.
const fs = require('fs');
const cities = [
  'New York City', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas', 'Austin', 'Nashville',
  'New Orleans', 'San Francisco', 'Boston', 'Atlanta', 'Houston', 'Dallas', 'Denver',
  'Seattle', 'Philadelphia', 'San Diego', 'Scottsdale', 'Charlotte', 'Tampa', 'Orlando',
  'London', 'Berlin', 'Amsterdam', 'Tokyo', 'Barcelona', 'Bangkok', 'Mexico City', 'Toronto',
  'Dubai', 'Ibiza', 'Miami Beach', 'Brooklyn', 'Williamsburg', 'West Hollywood', 'Downtown LA',
];
const types = [
  'Rooftop Bars', 'Speakeasies', 'Nightclubs', 'Cocktail Bars', 'Dive Bars', 'Jazz Clubs',
  'Wine Bars', 'Sports Bars', 'Comedy Clubs', 'Gay Bars', 'Tiki Bars', 'Whiskey Bars',
  'Karaoke Bars', 'Live Music Venues', 'Beach Clubs', 'Hotel Bars', 'Dance Clubs', 'Lounges',
  'Breweries with Nightlife', 'Late-Night Eateries', 'Hookah Lounges', 'Piano Bars',
];
const occasions = [
  'date night', 'bachelor party', 'birthday night out', 'solo travelers', 'tourists',
  'locals', 'weekend nights', 'Thursday night', 'after-work drinks', 'live DJ nights',
];
const sl = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const phrases = [];
for (const c of cities) phrases.push(`Top 10 Nightlife Spots in ${c}`);
for (const t of types) {
  for (const c of cities.slice(0, 12)) phrases.push(`Best ${t} in ${c} 2027`);
}
for (const o of occasions) {
  for (const c of cities.slice(0, 8)) phrases.push(`Best nightlife for ${o} in ${c}`);
}
phrases.push(
  'Best rooftop bars in America 2027',
  'Best speakeasies in America 2027',
  'Best nightclubs in America 2027',
  'Where to go out in Las Vegas 2027',
  'Best bars in New York City 2027',
  'Best Miami nightlife 2027',
  'Best Austin live music bars 2027',
  'Best Nashville honky tonks 2027',
  'Best New Orleans jazz bars 2027',
  'Best Chicago cocktail bars 2027',
  'Best LA rooftop bars 2027',
  'Best San Francisco wine bars 2027',
  'Best London cocktail bars 2027',
  'Best Amsterdam nightlife 2027',
  'Best Ibiza clubs 2027',
  'Nightlife without cover charge',
  'Best value nightlife spots',
  'Dress code for nightclubs 2027',
  'How to get into exclusive clubs',
  'Best nightlife for groups',
);
const unique = [...new Set(phrases)].slice(0, 300);
if (unique.length < 300) {
  let n = 0;
  while (unique.length < 300) {
    const c = cities[n % cities.length];
    const t = types[n % types.length];
    unique.push(`Top 10 ${t} in ${c} for 2027`);
    n++;
  }
}
fs.writeFileSync('C:/Users/koryj/website/_nl_keyword_phrases.json', JSON.stringify(unique, null, 2) + '\n');
console.log('wrote', unique.length, 'phrases');
