// _sy_add_500.js — Owner (2026-06-29): "add 500 to Pulse Style, pick up where you left off."
// Queue-aware + APPEND-safe (the stock _sy_seed_more.js overwrites the queue and assigns ids
// from the INDEX max, which would drop the unpublished sy0510-sy1100 backlog and collide ids).
// This: computes the TRUE max sy id across index + existing _sy_full_queue.json, generates a
// broad pool of "What to Wear / How to Wear / How to Style / How to Build" titles, dedups vs
// BOTH published titles AND queued titles, takes 500 NEW, assigns ids from trueMax+1, and
// APPENDS to _sy_full_queue.json (so the pending backlog is preserved = "pick up where you
// left off"). All titles end "in 2027". Usage: node _sy_add_500.js [count]
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const WANT = parseInt(process.argv[2] || '500', 10);
const Y = 'in 2027';
const norm = s => s.toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
const colors = ['Burgundy', 'Olive Green', 'Navy', 'All Black', 'Head-to-Toe White', 'Camel', 'Sage Green', 'Cobalt Blue', 'Blush Pink', 'Mustard Yellow', 'Forest Green', 'Lavender', 'Rust', 'Charcoal Gray', 'Emerald', 'Chocolate Brown', 'Powder Blue', 'Hot Pink', 'Terracotta', 'Dusty Rose', 'Teal', 'Cream', 'Maroon', 'Slate Blue'];
const garments = ['a Blazer', 'White Sneakers', 'a Leather Jacket', 'a Trench Coat', 'Wide-Leg Pants', 'a Midi Skirt', 'Cowboy Boots', 'a Turtleneck', 'Linen Pants', 'a Slip Dress', 'Loafers', 'a Denim Jacket', 'Cargo Pants', 'a Blue Suit', 'Ankle Boots', 'a Pleated Skirt', 'a Bomber Jacket', 'Chelsea Boots', 'a Knit Vest', 'a Maxi Dress', 'a Pencil Skirt', 'Combat Boots', 'a Puffer Jacket', 'a Wrap Dress', 'Tailored Shorts', 'a Cardigan', 'a Jumpsuit', 'Platform Heels'];
const occasions = ['a Wedding', 'a Job Interview', 'a First Date', 'the Office', 'a Funeral', 'a Graduation', 'a Cocktail Party', 'a Holiday Party', 'a Gala', 'Brunch', 'a Baby Shower', 'a Bridal Shower', 'a Networking Event', 'a Conference', 'a Reunion', 'an Engagement Party', 'a Retirement Party', 'a Christening', 'a Bar Crawl', 'a Rooftop Party', 'a Wine Tasting', 'a Gallery Opening', 'a Theater Show', 'a Comedy Show'];
const destinations = ['Paris', 'Tokyo', 'Rome', 'New York City', 'London', 'Dubai', 'Bali', 'Iceland', 'Santorini', 'Marrakech', 'Mexico City', 'Charleston', 'Nashville', 'New Orleans', 'Aspen', 'Miami', 'Lisbon', 'Barcelona', 'Amsterdam', 'Seoul', 'Cairo', 'Cape Town', 'Sydney', 'Banff'];
const capsules = ['a Capsule Work Wardrobe', 'a Travel Capsule Wardrobe', 'a Minimalist Wardrobe', 'a Date-Night Capsule', 'a Wedding-Guest Capsule', 'a Vacation Capsule', 'a Fall Capsule Wardrobe', 'a Winter Capsule Wardrobe', 'a Maternity Capsule', 'a Postpartum Capsule', 'a Business-Casual Capsule', 'a Weekend Capsule'];
const bodyGuides = ['You Are Petite', 'You Are Tall', 'You Are Curvy', 'You Are Plus-Size', 'You Have an Athletic Build', 'You Have Broad Shoulders', 'You Are Pear-Shaped', 'You Are Apple-Shaped', 'You Are an Hourglass', 'You Are Long-Torsoed', 'You Are Short-Waisted'];

const C = [];
const add = t => C.push(t);
// color x garment (large new family)
colors.forEach(c => garments.forEach(g => add(`How to Wear ${c} with ${g} ${Y}`)));
// color x season
colors.forEach(c => seasons.forEach(s => add(`How to Wear ${c} in ${s} ${Y}`)));
// garment x season
garments.forEach(g => seasons.forEach(s => add(`How to Style ${g} in ${s} ${Y}`)));
// garment x occasion
garments.forEach(g => occasions.forEach(o => add(`How to Style ${g} for ${o} ${Y}`)));
// destination x season
destinations.forEach(d => seasons.forEach(s => add(`What to Wear in ${d} in ${s} ${Y}`)));
// body x occasion
bodyGuides.forEach(b => occasions.forEach(o => add(`What to Wear to ${o} if ${b} ${Y}`)));
// capsules
capsules.forEach(c => add(`How to Build ${c} ${Y}`));
// color solo + garment solo (fallback fillers)
colors.forEach(c => add(`How to Wear ${c} ${Y}`));
garments.forEach(g => add(`How to Style ${g} ${Y}`));

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set();
  let maxNum = 0;
  for (const e of (idx.entries || [])) { if (e && e.question) have.add(norm(e.question)); const m = /^sy(\d+)$/.exec(e.id || ''); if (m) maxNum = Math.max(maxNum, +m[1]); }
  let queue = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_full_queue.json', 'utf8'));
  for (const it of queue) { if (it && it.title) have.add(norm(it.title)); const m = /^sy(\d+)$/.exec(it.id || ''); if (m) maxNum = Math.max(maxNum, +m[1]); }
  // dedup candidates vs published+queued, keep order-stable unique
  const seen = new Set(); const fresh = [];
  for (const t of C) { const k = norm(t); if (have.has(k) || seen.has(k)) continue; seen.add(k); fresh.push(t); if (fresh.length >= WANT) break; }
  if (fresh.length < WANT) console.error(`WARN: only ${fresh.length} unique candidates (< ${WANT}) — expand taxonomy`);
  const pad = n => 'sy' + String(n).padStart(4, '0');
  const items = fresh.map((title, i) => ({ id: pad(maxNum + 1 + i), title }));
  fs.writeFileSync('C:/Users/koryj/website/_sy_add500_queue.json', JSON.stringify(items, null, 1));
  const out = queue.concat(items);
  fs.writeFileSync('C:/Users/koryj/website/_sy_full_queue.json', JSON.stringify(out, null, 1));
  console.log(`candidates=${C.length} | trueMax=sy${String(maxNum).padStart(4,'0')} | NEW added=${items.length} (ids ${items[0] ? items[0].id : '-'}..${items.length ? items[items.length-1].id : '-'})`);
  console.log(`_sy_full_queue.json: ${queue.length} -> ${out.length}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
