// _sy_seed_more.js — generate UNIQUE new Pulse Style (sy) "What to Wear" Q&A titles to reach
// a target final sy id (default sy1100 = 1,000 new beyond sy0100). Dedups against ALL existing
// library titles (normalized, year-stripped) and against itself. Assigns ids from maxSyId+1.
// Writes _sy_new_queue.json (new only) and _sy_full_queue.json (remaining respec ++ new).
// Usage: node _sy_seed_more.js [targetFinalNum]   e.g. node _sy_seed_more.js 1100
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const TARGET_FINAL = parseInt(process.argv[2] || '1100', 10);
const Y = 'in 2027';
const norm = s => s.toLowerCase().replace(/\bin 20\d\d\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// ---- taxonomy ----
const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
const weddingVenues = ['Beach', 'Garden', 'Church', 'Courthouse', 'Barn', 'Vineyard', 'Ballroom', 'Backyard', 'Rooftop', 'Country Club', 'Lakeside', 'Destination', 'City Hall', 'Estate', 'Greenhouse'];
const weddingRoles = ['Guest', 'Mother of the Bride', 'Father of the Groom', 'Bridesmaid', 'Best Man', 'Maid of Honor', 'Officiant', 'Groomsman', 'Wedding Planner'];
const weddingFormality = ['Black-Tie', 'Cocktail', 'Casual', 'Semi-Formal', 'White-Tie'];
const interviewFields = ['Tech', 'Finance', 'Law', 'Healthcare', 'Creative Agency', 'Startup', 'Government', 'Retail', 'Hospitality', 'Academic', 'Sales', 'Consulting', 'Nonprofit', 'Engineering', 'Marketing', 'Banking', 'Architecture', 'Fashion', 'Media', 'Real Estate'];
const interviewTypes = ['Video', 'Panel', 'Second-Round', 'Internship', 'Executive', 'Phone-Screen Follow-Up'];
const dates = ['First Date', 'Coffee Date', 'Dinner Date', 'Movie Date', 'Concert Date', 'Hiking Date', 'Anniversary Dinner', 'Blind Date', 'Brunch Date', 'Wine-Tasting Date', 'Museum Date', 'Beach Date'];
const holidays = ['Thanksgiving Dinner', 'a Christmas Party', 'New Year’s Eve', 'Easter Brunch', 'Hanukkah Dinner', 'Diwali', 'Lunar New Year', 'an Adult Halloween Party', 'Valentine’s Day', 'a Mother’s Day Brunch', 'Fourth of July', 'a Holiday Office Party', 'Friendsgiving', 'a New Year’s Day Brunch'];
const workScenes = ['a Business-Casual Office', 'Your First Day at a New Job', 'a Work Conference', 'a Networking Event', 'an Office Holiday Party', 'a Big Presentation', 'a Client Meeting', 'a Remote Video Call', 'a Performance Review', 'a Co-Working Space', 'a Trade Show', 'a Company Offsite', 'a Board Meeting', 'a Startup Pitch'];
const funerals = ['a Funeral', 'a Celebration of Life', 'a Wake', 'a Memorial Service', 'a Graveside Service'];
const religious = ['Church on Sunday', 'a Bar Mitzvah', 'a Bat Mitzvah', 'a Quinceañera', 'a Baptism', 'a Christening', 'a First Communion', 'a Confirmation', 'a Temple Visit', 'a Mosque Visit', 'a Sikh Wedding', 'a Hindu Wedding', 'an Easter Service', 'a Christmas Eve Service'];
const milestones = ['a High School Graduation', 'a College Graduation', 'a Baby Shower', 'a Bridal Shower', 'an Engagement Party', 'a Retirement Party', 'a High School Reunion', 'a Family Reunion', 'a Housewarming Party', 'a Gender Reveal', 'a 50th Birthday Party', 'a Sweet 16', 'a Graduation Ceremony', 'an Anniversary Party', 'a Promotion Celebration'];
const events = ['a Charity Gala', 'an Awards Ceremony', 'an Art Gallery Opening', 'the Theater', 'the Opera', 'a Black-Tie Gala', 'a Cocktail Party', 'a Garden Party', 'a Fundraiser', 'a Book Launch', 'a Film Premiere', 'a Fashion Show', 'a Poetry Reading', 'a Wine Gala'];
const concerts = ['a Rock Concert', 'a Classical Concert', 'a Music Festival', 'a Country Concert', 'a Jazz Club', 'an EDM Festival', 'a Pop Concert', 'an Outdoor Festival', 'a Hip-Hop Show', 'a Symphony', 'a Coachella-Style Festival', 'a Summer Music Festival'];
const sports = ['a Football Game', 'a Baseball Game', 'a Basketball Game', 'a Tennis Match', 'a Golf Outing', 'the Kentucky Derby', 'a Soccer Match', 'a Hockey Game', 'a Tailgate', 'a Polo Match', 'a Marathon (as a Spectator)', 'a Horse Race', 'a Boxing Match', 'a Pickleball Tournament'];
const activities = ['Brunch', 'a Picnic', 'a BBQ', 'Camping', 'Yoga Class', 'the Gym', 'Golfing', 'Boating', 'Horseback Riding', 'a Wine Tasting', 'a Cooking Class', 'a Pottery Class', 'Apple Picking', 'a Farmers Market', 'a Day at the Beach', 'a Pool Party', 'a Bonfire', 'Ice Skating', 'a Ski Day', 'a Spa Day'];
const destinations = ['Paris', 'Italy', 'Tokyo', 'Hawaii', 'London', 'New York City', 'Greece', 'Bali', 'Iceland', 'Dubai', 'Mexico City', 'Barcelona', 'Amsterdam', 'Morocco', 'Thailand', 'a Caribbean Cruise', 'a Safari', 'a Ski Resort', 'a Tropical Resort', 'Las Vegas', 'Miami', 'San Francisco', 'New Orleans', 'Charleston', 'Aspen', 'Napa Valley', 'the Hamptons', 'Santorini', 'Portugal', 'Costa Rica'];
const tripTypes = ['a Road Trip', 'a Cruise', 'a Red-Eye Flight', 'a Weekend Getaway', 'a Long-Haul Flight', 'a Beach Vacation', 'a Ski Trip', 'a Camping Trip', 'a City Break', 'a Honeymoon', 'a Business Trip', 'a Bachelorette Trip', 'a Bachelor Trip', 'a Girls’ Trip', 'a Backpacking Trip'];
const weather = ['a Rainy Day', 'a Heat Wave', 'a Cold Snap', 'a Humid Day', 'a Snowy Day', 'a Windy Day', 'an Unpredictable Spring Day', 'a Muggy Summer Night', 'a Crisp Fall Morning', 'a Freezing Commute', 'a Mild Winter Day', 'a Foggy Morning'];
const dining = ['a Fine-Dining Restaurant', 'a Steakhouse', 'a Rooftop Bar', 'a Sushi Restaurant', 'a Casual Bistro', 'a Michelin-Star Dinner', 'a Wine Bar', 'a Speakeasy', 'a Brunch Spot', 'a Tasting Menu'];
const bodyGuides = ['You’re Tall', 'You’re Petite', 'You’re Plus-Size', 'You Have an Athletic Build', 'You’re Pear-Shaped', 'You’re Apple-Shaped', 'You’re Hourglass-Shaped', 'You Have Broad Shoulders', 'You’re Slim', 'You Have a Long Torso', 'You’re Curvy', 'You’re Big and Tall'];
const decades = ['Your 20s', 'Your 30s', 'Your 40s', 'Your 50s', 'Your 60s', 'Your 70s'];
const capsules = ['a Spring Capsule Wardrobe', 'a Summer Capsule Wardrobe', 'a Fall Capsule Wardrobe', 'a Winter Capsule Wardrobe', 'a Travel Capsule Wardrobe', 'a Work Capsule Wardrobe', 'a Minimalist Wardrobe', 'a Weekend Wardrobe'];

// ---- build candidates (each: {title}) ----
const C = [];
const add = t => C.push(t);
seasons.forEach(s => weddingVenues.forEach(v => add(`What to Wear to a ${s} ${v} Wedding ${Y}`)));
weddingRoles.forEach(r => add(`What to Wear as a ${r} to a Wedding ${Y}`));
weddingFormality.forEach(f => add(`What to Wear to a ${f} Wedding ${Y}`));
interviewFields.forEach(f => add(`What to Wear to a ${f} Job Interview ${Y}`));
interviewTypes.forEach(t => add(`What to Wear to a ${t} Job Interview ${Y}`));
dates.forEach(d => add(`What to Wear on a ${d} ${Y}`));
holidays.forEach(h => add(`What to Wear to ${h} ${Y}`));
workScenes.forEach(w => add(`What to Wear to ${w} ${Y}`));
funerals.forEach(f => add(`What to Wear to ${f} ${Y}`));
religious.forEach(r => add(`What to Wear to ${r} ${Y}`));
milestones.forEach(m => add(`What to Wear to ${m} ${Y}`));
events.forEach(e => add(`What to Wear to ${e} ${Y}`));
concerts.forEach(c => add(`What to Wear to ${c} ${Y}`));
sports.forEach(s => add(`What to Wear to ${s} ${Y}`));
activities.forEach(a => add(`What to Wear to ${a} ${Y}`));
destinations.forEach(d => add(`What to Wear in ${d} ${Y}`));
seasons.forEach(s => destinations.forEach(d => add(`What to Wear in ${d} in ${s} ${Y}`)));
tripTypes.forEach(t => add(`What to Wear on ${t} ${Y}`));
weather.forEach(w => add(`What to Wear on ${w} ${Y}`));
dining.forEach(d => add(`What to Wear to ${d} ${Y}`));
bodyGuides.forEach(b => add(`What to Wear if ${b} ${Y}`));
decades.forEach(d => add(`What to Wear in ${d} ${Y}`));
capsules.forEach(c => add(`How to Build ${c} ${Y}`));
seasons.forEach(s => activities.forEach(a => add(`What to Wear to ${a} in ${s} ${Y}`)));
// second-order combinations for volume
weddingVenues.forEach(v => weddingRoles.forEach(r => add(`What to Wear as a ${r} to a ${v} Wedding ${Y}`)));
interviewFields.forEach(f => interviewTypes.forEach(t => add(`What to Wear to a ${t} ${f} Job Interview ${Y}`)));
const keyOcc = ['a Wedding', 'a Job Interview', 'a First Date', 'the Office', 'a Funeral', 'a Graduation', 'a Cocktail Party', 'a Holiday Party', 'a Gala', 'Brunch'];
bodyGuides.forEach(b => keyOcc.forEach(o => add(`What to Wear to ${o} if ${b} ${Y}`)));
decades.forEach(d => keyOcc.forEach(o => add(`What to Wear to ${o} in ${d} ${Y}`)));
const colors = ['Burgundy', 'Olive Green', 'Navy', 'All Black', 'Head-to-Toe White', 'Camel', 'Sage Green', 'Cobalt Blue', 'Blush Pink', 'Mustard Yellow', 'Forest Green', 'Lavender', 'Rust', 'Charcoal Gray', 'Emerald', 'Chocolate Brown', 'Powder Blue', 'Hot Pink'];
colors.forEach(c => add(`How to Wear ${c} ${Y}`));
const garments = ['a Blazer', 'White Sneakers', 'a Leather Jacket', 'a Trench Coat', 'Wide-Leg Pants', 'a Midi Skirt', 'Cowboy Boots', 'a Turtleneck', 'Linen Pants', 'a Slip Dress', 'Loafers', 'a Denim Jacket', 'Cargo Pants', 'a Blue Suit', 'Ankle Boots', 'a Pleated Skirt', 'a Bomber Jacket', 'Chelsea Boots', 'a Knit Vest', 'a Maxi Dress'];
garments.forEach(g => add(`How to Style ${g} ${Y}`));
seasons.forEach(s => dining.forEach(d => add(`What to Wear to ${d} in ${s} ${Y}`)));
seasons.forEach(s => workScenes.forEach(w => add(`What to Wear to ${w} in ${s} ${Y}`)));

// ---- dedup + interleave by category for variety ----
// stable shuffle: interleave so sequential ids vary in topic (group then round-robin)
function interleave(arr) {
  // bucket by the 3rd+4th word signature isn't worth it; do a simple stride interleave
  const out = []; const n = arr.length; const stride = 37; // coprime-ish stride for spread
  const seen = new Set(); let i = 0, count = 0;
  while (count < n) { const idx = (i * stride) % n; if (!seen.has(idx)) { seen.add(idx); out.push(arr[idx]); count++; } i++; if (i > n * 3) break; }
  for (let k = 0; k < n; k++) if (!seen.has(k)) out.push(arr[k]);
  return out;
}

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = await s.get('_index.json', { type: 'json' });
  const existingNorm = new Set();
  let maxNum = 0;
  for (const e of (idx.entries || [])) {
    if (!e || !e.question) continue;
    existingNorm.add(norm(e.question));
    const m = /^sy(\d+)$/.exec(e.id || ''); if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }
  // unique candidates not already in library
  const localSeen = new Set();
  let uniq = [];
  for (const t of C) { const k = norm(t); if (existingNorm.has(k) || localSeen.has(k)) continue; localSeen.add(k); uniq.push(t); }
  uniq = interleave(uniq);

  const needed = Math.max(0, TARGET_FINAL - maxNum);
  if (uniq.length < needed) console.error(`WARN: only ${uniq.length} unique candidates but need ${needed} — taxonomy short by ${needed - uniq.length}`);
  const take = uniq.slice(0, needed);
  const pad = n => 'sy' + String(n).padStart(4, '0');
  const newQ = take.map((title, i) => ({ id: pad(maxNum + 1 + i), title }));
  fs.writeFileSync('C:/Users/koryj/website/_sy_new_queue.json', JSON.stringify(newQ, null, 1));

  // full queue = remaining respec (existing ids that still lack age blocks isn't recomputed here;
  // just concat the respec queue file if present) ++ new
  let respec = [];
  try { respec = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_respec_queue.json', 'utf8')); } catch (e) {}
  fs.writeFileSync('C:/Users/koryj/website/_sy_full_queue.json', JSON.stringify(respec.concat(newQ), null, 1));

  console.log(`candidates=${C.length} unique=${uniq.length} maxSyId=sy${String(maxNum).padStart(4,'0')} needed=${needed} -> wrote ${newQ.length} new (ids ${newQ[0] ? newQ[0].id : '-'}..${newQ.length ? newQ[newQ.length-1].id : '-'})`);
  console.log(`_sy_full_queue.json = ${respec.length} respec + ${newQ.length} new = ${respec.length + newQ.length}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
