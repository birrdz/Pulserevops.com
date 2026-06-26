// Build dedup-safe 50-item queue for next Cars sprint (ca0924+).
const fs = require('fs');
// Prefer live blob dump (_ca_titles.txt); fall back to legacy all-titles file.
let titleLines = [];
if (fs.existsSync('C:/Users/koryj/_ca_titles.txt')) {
  titleLines = fs.readFileSync('C:/Users/koryj/_ca_titles.txt', 'utf8').split('\n').filter(Boolean)
    .map(l => l.replace(/^ca\d+:\s*/, '').trim());
} else {
  titleLines = fs.readFileSync('C:/Users/koryj/_ca_all_titles.txt', 'utf8').split('\n').filter(Boolean);
}
const norm = t => t.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[—–-]/g, '-').replace(/[",.()]/g, '');
const existing = new Set(titleLines.map(norm));
const coveredModel = new Set();
for (const t of titleLines) {
  const m = t.match(/^Best (.+?) (?:Model Years|Generations) \(Ranked\)/i);
  if (m) coveredModel.add(m[1].toLowerCase().trim());
}

const cand = [];
const push = t => cand.push(t);

const budgetClasses = ['SUVs', 'Sedans', 'Pickup Trucks', 'Minivans', 'Hatchbacks', 'Sports Cars', 'Luxury Cars', 'Electric Cars', 'Hybrid Cars', 'Wagons', 'Coupes', 'Convertibles', '3-Row SUVs', 'Compact SUVs', 'Full-Size SUVs', 'Crossovers', 'Trucks', 'Off-Road SUVs', 'Family Cars', 'AWD Cars', 'Electric SUVs', 'Hybrid SUVs', 'Mid-Size SUVs', 'Subcompact SUVs'];
const prices = ['$10,000', '$15,000', '$20,000', '$25,000', '$30,000', '$35,000', '$40,000', '$50,000', '$60,000'];
for (const p of prices) for (const c of budgetClasses) push(`Best Used ${c} Under ${p} in 2027 (Ranked)`);

const ucVehicles = ['Cars', 'SUVs', 'Trucks', 'Sedans', 'Crossovers', 'EVs', 'Hybrids', 'Minivans', 'Pickups'];
const audiences = ['Families', 'Tall Drivers', 'Short Drivers', 'Seniors', 'Teen Drivers', 'New Drivers', 'College Students', 'Commuters', 'Dog Owners', 'Big Families', 'Snowy Climates', 'Off-Road Adventures', 'City Driving', 'Long Road Trips', 'Camping', 'Towing', 'Rideshare Drivers', 'First-Time Buyers', 'Retirees', 'Outdoor Enthusiasts', 'Ski Trips', 'Hot Climates', 'Winter Driving', 'Daily Commuting', 'Small Business Owners', 'Delivery Drivers', 'Growing Families', 'Beginner Drivers', 'Uber Drivers', 'Lyft Drivers', 'Road Trips', 'Highway Commuting'];
for (const a of audiences) for (const v of ucVehicles) push(`Best ${v} for ${a} in 2027 (Ranked)`);

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
  'Best All-Weather Crossovers in 2027 (Ranked)', 'Best Cars for Mountain Roads in 2027 (Ranked)', 'Best Performance Sedans Under $60,000 in 2027 (Ranked)',
  'Best 3-Row SUVs Under $45,000 in 2027 (Ranked)', 'Best Electric SUVs Under $50,000 in 2027 (Ranked)', 'Best Hybrid Sedans Under $35,000 in 2027 (Ranked)',
  'Best Cars with Adaptive Cruise Control in 2027 (Ranked)', 'Best Cars with 360-Degree Cameras in 2027 (Ranked)', 'Best Cars with Wireless CarPlay in 2027 (Ranked)'
];
for (const t of attrs) push(t);

const t10classes = ['Subcompact SUVs', 'Sports Sedans', 'Luxury Sedans', 'Hybrid SUVs', 'Compact Pickup Trucks', 'Heavy-Duty Trucks', 'Electric Sedans', 'Hot Hatches', 'Station Wagons', 'Plug-In Hybrid SUVs', 'Performance SUVs', 'Diesel Trucks', 'Family Minivans', 'Micro SUVs', 'Luxury Coupes', 'Electric Pickups'];
for (const y of ['2027', '2026']) for (const c of t10classes) push(`Top 10 ${c} ${y} — Best Overall + Best Value`);

const extraModels = [
  'Nissan Pulsar', 'Nissan 240SX', 'Nissan Quest', 'Nissan Rogue Sport',
  'Hyundai Azera', 'Hyundai Entourage', 'Hyundai Tiburon', 'Hyundai Equus', 'Hyundai Nexo',
  'Kia Cadenza', 'Kia K5', 'Kia K900', 'Kia Borrego', 'Kia Amanti',
  'Mazda2', 'Mazda MPV', 'Mazdaspeed3', 'Mazda B-Series', 'Mazda CX-7', 'Mazda5',
  'Volkswagen CC', 'Volkswagen Eos', 'Volkswagen Rabbit', 'Volkswagen Routan', 'Volkswagen Taos', 'Volkswagen e-Golf',
  'BMW 2 Series', 'BMW 6 Series', 'BMW 8 Series', 'BMW X2', 'BMW X4', 'BMW i3', 'BMW 1 Series',
  'Mercedes-Benz G-Class', 'Mercedes-Benz GLK', 'Mercedes-Benz CLS', 'Mercedes-Benz SL', 'Mercedes-Benz EQS',
  'Lexus CT', 'Lexus HS', 'Lexus GS', 'Lexus LC', 'Lexus RZ',
  'Acura RL', 'Acura RLX', 'Acura ZDX', 'Acura NSX', 'Acura CL', 'Acura Legend',
  'Volvo S90', 'Volvo V90', 'Volvo C40', 'Volvo XC70', 'Volvo S40',
  'Audi A7', 'Audi A8', 'Audi Q4 e-tron', 'Audi S4', 'Audi RS5', 'Audi R8',
  'Porsche Taycan', 'Porsche 718', 'Tesla Cybertruck', 'Polestar 2', 'Genesis GV60',
  'Mini Countryman', 'Mitsubishi Lancer', 'Subaru Baja', 'Subaru Tribeca',
  'Pontiac G6', 'Pontiac GTO', 'Hummer H2', 'Hummer H3',
  'Lincoln Navigator', 'Lincoln Aviator', 'Lincoln MKZ', 'Lincoln Continental',
  'Jaguar XF', 'Jaguar XE', 'Jaguar E-Pace', 'Jaguar I-Pace', 'Maserati Ghibli', 'Maserati Levante'
];
for (const m of extraModels) {
  const useGen = /(Civic|Accord|Corolla|Camry|Mustang|911|Miata|3 Series|5 Series|C-Class|E-Class|Golf|GTI|CX-5|Outback|Forester)/i.test(m);
  push(`Best ${m} ${useGen ? 'Generations' : 'Model Years'} (Ranked)`);
}

const q = [];
const seen = new Set();
let next = 924;
for (const title of cand) {
  const n = norm(title);
  if (existing.has(n) || seen.has(n)) continue;
  const mm = title.match(/^Best (.+?) (?:Model Years|Generations) \(Ranked\)/i);
  if (mm && coveredModel.has(mm[1].toLowerCase().trim())) continue;
  seen.add(n);
  const id = 'ca' + String(next++).padStart(4, '0');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  q.push({ id, title, slug });
  if (q.length >= 50) break;
}
fs.writeFileSync('C:/Users/koryj/_ca_sprint50.json', JSON.stringify(q, null, 2));
console.log('queue:', q.length, '| candidates:', cand.length);
console.log('first:', q[0].id, q[0].title);
console.log('last:', q[q.length - 1].id, q[q.length - 1].title);
