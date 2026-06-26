// Build a dedup-safe 200-item queue for the next Cars sprint (ca0724+).
// Diversifies beyond the two dominant themes: adds use-case/budget Top-10
// lists, attribute superlatives, AND remaining uncovered model-year rankings.
const fs = require('fs');
const all = fs.readFileSync('C:/Users/koryj/_ca_all_titles.txt', 'utf8').split('\n').filter(Boolean);
const norm = t => t.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[—–-]/g, '-').replace(/[",.()]/g, '');
const existing = new Set(all.map(norm));
const coveredModel = new Set();
for (const t of all) { const m = t.match(/^Best (.+?) (?:Model Years|Generations) \(Ranked\)/i); if (m) coveredModel.add(m[1].toLowerCase().trim()); }

const cand = [];
const push = t => cand.push(t);

// 1) Budget / used-buyer lists  (class x price)
const budgetClasses = ['SUVs', 'Sedans', 'Pickup Trucks', 'Minivans', 'Hatchbacks', 'Sports Cars', 'Luxury Cars', 'Electric Cars', 'Hybrid Cars', 'Wagons', 'Coupes', 'Convertibles', '3-Row SUVs', 'Compact SUVs', 'Full-Size SUVs', 'Crossovers', 'Trucks', 'Off-Road SUVs', 'Family Cars', 'AWD Cars'];
const prices = ['$10,000', '$15,000', '$20,000', '$25,000', '$30,000', '$40,000', '$50,000'];
for (const p of prices) for (const c of budgetClasses) push(`Best Used ${c} Under ${p} in 2027 (Ranked)`);

// 2) Use-case / audience lists  (vehicle x audience)
const ucVehicles = ['Cars', 'SUVs', 'Trucks', 'Sedans', 'Crossovers'];
const audiences = ['Families', 'Tall Drivers', 'Short Drivers', 'Seniors', 'Teen Drivers', 'New Drivers', 'College Students', 'Commuters', 'Dog Owners', 'Big Families', 'Snowy Climates', 'Off-Road Adventures', 'City Driving', 'Long Road Trips', 'Camping', 'Towing', 'Rideshare Drivers', 'First-Time Buyers', 'Retirees', 'Outdoor Enthusiasts', 'Ski Trips', 'Hot Climates', 'Winter Driving', 'Daily Commuting', 'Small Business Owners', 'Delivery Drivers', 'Growing Families', 'Beginner Drivers'];
for (const a of audiences) for (const v of ucVehicles) push(`Best ${v} for ${a} in 2027 (Ranked)`);

// 3) Attribute superlative lists
const attrs = [
  'Best Cars for Gas Mileage in 2027 (Ranked)', 'Most Reliable SUVs in 2027 (Ranked)', 'Most Reliable Sedans in 2027 (Ranked)', 'Most Reliable Trucks in 2027 (Ranked)',
  'Best Cars That Hold Their Value in 2027 (Ranked)', 'Best Cars with Apple CarPlay in 2027 (Ranked)', 'Best Cars with the Best Resale Value in 2027 (Ranked)',
  'Best AWD Sedans for Snow in 2027 (Ranked)', 'Best Fuel-Efficient SUVs in 2027 (Ranked)', 'Best Plug-In Hybrid SUVs in 2027 (Ranked)',
  'Best Plug-In Hybrid Sedans in 2027 (Ranked)', 'Best Long-Range Electric Cars in 2027 (Ranked)', 'Best Affordable Electric Cars in 2027 (Ranked)',
  'Best Fast Cars Under $40,000 in 2027 (Ranked)', 'Best Cars with Third-Row Seating in 2027 (Ranked)', 'Best Cars for Towing in 2027 (Ranked)',
  'Best Cars with the Best Safety Ratings in 2027 (Ranked)', 'Best Roomy SUVs for Cargo in 2027 (Ranked)', 'Best Quiet Luxury Sedans in 2027 (Ranked)',
  'Best Sporty SUVs in 2027 (Ranked)', 'Best Compact Cars for City Driving in 2027 (Ranked)', 'Best Cars for Stop-and-Go Traffic in 2027 (Ranked)',
  'Best Diesel SUVs in 2027 (Ranked)', 'Best Cars with Ventilated Seats in 2027 (Ranked)', 'Best Cars for Snow and Ice in 2027 (Ranked)',
  'Best Cheap-to-Insure Cars in 2027 (Ranked)', 'Best Low-Maintenance Cars in 2027 (Ranked)', 'Best High-Mileage Cars That Last in 2027 (Ranked)',
  'Best Cars for Highway Driving in 2027 (Ranked)', 'Best Comfortable Cars for Bad Backs in 2027 (Ranked)', 'Best Cars with the Most Legroom in 2027 (Ranked)',
  'Best Hybrid Trucks in 2027 (Ranked)', 'Best Electric Trucks in 2027 (Ranked)', 'Best Small SUVs for Gas Mileage in 2027 (Ranked)',
  'Best Cars for Short Commutes in 2027 (Ranked)', 'Best Easy-to-Park SUVs in 2027 (Ranked)', 'Best Cars with Massaging Seats in 2027 (Ranked)',
  'Best All-Weather Crossovers in 2027 (Ranked)', 'Best Cars for Mountain Roads in 2027 (Ranked)', 'Best Performance Sedans Under $60,000 in 2027 (Ranked)'
];
for (const t of attrs) push(t);

// 4) More "Top 10 <class> <year>" across less-used class+year combos
const t10classes = ['Subcompact SUVs', 'Sports Sedans', 'Luxury Sedans', 'Hybrid SUVs', 'Compact Pickup Trucks', 'Heavy-Duty Trucks', 'Electric Sedans', 'Coupes', 'Hot Hatches', 'Station Wagons', 'Convertibles', 'Plug-In Hybrid SUVs', 'Performance SUVs', 'Diesel Trucks', 'Family Minivans'];
for (const y of ['2027', '2026', '2025']) for (const c of t10classes) push(`Top 10 ${c} ${y} — Best Overall + Best Value`);

// 5) Remaining uncovered models for "Best <Make Model> Model Years/Generations (Ranked)"
const extraModels = [
  'Lincoln Town Car', 'Lincoln LS', 'Lincoln Mark LT', 'Saturn Vue', 'Saturn Ion', 'Saturn Aura', 'Saab 9-3', 'Saab 9-5',
  'Suzuki Grand Vitara', 'Suzuki SX4', 'Mercury Grand Marquis', 'Mercury Mountaineer', 'Mercury Sable', 'Isuzu Trooper', 'Isuzu Rodeo',
  'Scion tC', 'Scion xB', 'Scion FR-S', 'Plymouth Prowler', 'Oldsmobile Alero', 'Hummer H1', 'Datsun 240Z',
  'Mazda CX-5', 'Mazda3', 'Mazda6', 'Mazda CX-9', 'Subaru Outback', 'Subaru Forester', 'Subaru Crosstrek', 'Subaru WRX', 'Subaru Ascent',
  'Toyota GR Supra', 'Nissan Pathfinder', 'Nissan Maxima', 'Nissan Altima', 'Nissan Frontier', 'Nissan Rogue',
  'Honda Clarity Fuel Cell', 'Chevrolet Equinox EV', 'Chevrolet Silverado EV', 'Ford Escape Hybrid', 'GMC Hummer EV',
  'Toyota Grand Highlander', 'Hyundai Tucson', 'Kia Telluride', 'Kia Sorento', 'Mitsubishi Outlander Sport',
  'Cadillac Lyriq', 'Cadillac Celestiq', 'Lexus TX', 'Lexus GX 550', 'BMW iX', 'Polestar 3', 'Lucid Gravity'
];
const extra2 = [];
for (const m of extraModels) {
  const useGen = /(CX-5|Mazda3|Mazda6|Outback|Forester|WRX|Altima|Maxima|Tucson|Sorento)/i.test(m);
  extra2.push(`Best ${m} ${useGen ? 'Generations' : 'Model Years'} (Ranked)`);
}
for (const t of extra2) push(t);

// Dedup + assign sequential ids from 724
const q = [];
const seen = new Set();
let next = 724;
for (const title of cand) {
  const n = norm(title);
  if (existing.has(n) || seen.has(n)) continue;
  // skip model-year titles whose model is already covered
  const mm = title.match(/^Best (.+?) (?:Model Years|Generations) \(Ranked\)/i);
  if (mm && coveredModel.has(mm[1].toLowerCase().trim())) continue;
  seen.add(n);
  const id = 'ca' + String(next++).padStart(4, '0');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  q.push({ id, title, slug });
  if (q.length >= 200) break;
}
fs.writeFileSync('C:/Users/koryj/_ca_sprint724.json', JSON.stringify(q, null, 1));
console.log('queue:', q.length, '| candidates:', cand.length);
console.log('first:', q[0].id, q[0].title);
console.log('last:', q[q.length - 1].id, q[q.length - 1].title);
