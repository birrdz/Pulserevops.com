// Build a dedup-safe 200-item queue for the next Boats sprint (bt0201+).
// Diversifies beyond the existing type×year + category lists: used/budget
// lists, NEW use-case audiences, brand best-model rankings, new type×year.
const fs = require('fs');
const all = fs.readFileSync('C:/Users/koryj/_bt_all_titles.txt', 'utf8').split('\n').filter(Boolean);
const norm = t => t.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[—–-]/g, '-').replace(/[",.()$]/g, '');
const existing = new Set(all.map(norm));
// crude topic-key set to dodge semantic dups (audience already covered as "Top 10 Best Boats for X")
const coveredAudience = new Set();
for (const t of all) { const m = t.match(/best boats for (.+?)\s+20\d\d/i); if (m) coveredAudience.add(m[1].toLowerCase().trim()); }

const cand = [];
const push = t => cand.push(t);

// 1) Used / budget lists  (type x price)
const budgetTypes = ['Pontoon Boats', 'Bowrider Boats', 'Center Console Boats', 'Fishing Boats', 'Bass Boats', 'Deck Boats', 'Cabin Cruiser Boats', 'Ski Boats', 'Wakeboard Boats', 'Jet Boats', 'Aluminum Fishing Boats', 'Sailboats', 'Bay Boats', 'Dual Console Boats', 'Runabout Boats', 'Cuddy Cabin Boats', 'Express Cruisers', 'Walkaround Boats', 'Yachts', 'Sport Fishing Boats'];
const prices = ['$10,000', '$20,000', '$30,000', '$50,000', '$75,000', '$100,000'];
for (const p of prices) for (const t of budgetTypes) push(`Best Used ${t} Under ${p} in 2027 (Ranked)`);

// 2) NEW use-case audiences (avoid families/beginners/saltwater/watersports/lake already covered)
const audiences = ['Offshore Fishing', 'Cruising', 'Overnight Trips', 'Couples', 'Big Groups', 'First-Time Buyers', 'Retirees', 'Day Trips', 'Fly Fishing', 'Bass Fishing', 'River Floating', 'Tubing', 'Coastal Cruising', 'Weekend Getaways', 'Inshore Fishing', 'Bay Fishing', 'Ocean Fishing', 'Calm Lakes', 'Rough Water', 'Sandbar Days', 'Liveaboard Life', 'Watersports Families'];
for (const a of audiences) { if (!coveredAudience.has(a.toLowerCase())) push(`Best Boats for ${a} in 2027 (Ranked)`); }

// 3) Brand best-model rankings
const brands = ['Boston Whaler', 'Sea Ray', 'Bayliner', 'MasterCraft', 'Malibu', 'Chaparral', 'Grady-White', 'Pursuit', 'Robalo', 'Tracker', 'Lund', 'Ranger', 'Nitro', 'Bennington', 'Sun Tracker', 'Crestliner', 'Regal', 'Cobalt', 'Monterey', 'Four Winns', 'Scout', 'Sportsman', 'Everglades', 'Contender', 'Carolina Skiff', 'Yamaha', 'Tige', 'Nautique', 'Supra', 'Moomba', 'Starcraft', 'Stingray', 'Crownline', 'Glastron', 'Wellcraft', 'Hurricane', 'Tahoe', 'Godfrey', 'Avalon', 'Manitou', 'Harris', 'Sylvan', 'Princecraft', 'Alumacraft', 'Skeeter', 'Triton', 'Yellowfin', 'Jupiter', 'Cobia', 'Sea-Doo'];
for (const b of brands) push(`Best ${b} Boat Models (Ranked)`);

// 4) New type x year combos (2024 + exotic types)
const newTypes = ['Bass Boats', 'Jet Boats', 'Bay Boats', 'Aluminum Fishing Boats', 'Sailboats', 'Power Catamarans', 'Trawlers', 'Houseboats', 'Express Cruisers', 'Ski Boats', 'Flats Boats', 'Performance Boats', 'Offshore Fishing Boats', 'Dual Console Boats', 'Pilothouse Boats', 'Skiffs', 'Jon Boats', 'Electric Boats', 'Wake Surf Boats', 'Tritoon Boats'];
for (const y of ['2024', '2028']) for (const t of newTypes) push(`Top 10 ${t} ${y}`);

// Dedup + assign sequential ids from 201
const q = [];
const seen = new Set();
let next = 201;
for (const title of cand) {
  const n = norm(title);
  if (existing.has(n) || seen.has(n)) continue;
  seen.add(n);
  const id = 'bt' + String(next++).padStart(4, '0');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  q.push({ id, title, slug });
  if (q.length >= 200) break;
}
fs.writeFileSync('C:/Users/koryj/_bt_sprint201.json', JSON.stringify(q, null, 1));
console.log('queue:', q.length, '| candidates:', cand.length);
console.log('first:', q[0].id, q[0].title);
console.log('last:', q[q.length - 1].id, q[q.length - 1].title);
