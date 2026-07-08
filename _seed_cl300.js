// _seed_cl300.js — generate 300 NEW unique Clubs (cl) Top-10 titles, deduped
// against the live cl catalog, reserved IDs cl0091+, → _cl_sprint_queue300.json.
// Style matches existing cl entries: "The 10 Best <Category> in <City> (2027 Ranking)".
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slug = s => norm(s).replace(/\s+/g, '-').slice(0, 60);

// category -> list of real cities known for that club type
const CATS = {
  'Nightclubs': ['Chicago','São Paulo','Mexico City','Singapore','Bangkok','Barcelona','Seoul','Toronto','Madrid','Paris','Sydney','Hong Kong','Mumbai','Tel Aviv','Mykonos','Beirut','Montreal','Austin','Atlanta','Houston','San Francisco','Boston','Washington DC','Warsaw','Prague','Stockholm','Cape Town','Marrakech','Istanbul','Tulum'],
  'Beach Clubs': ['Mykonos','Ibiza','Tulum','Saint-Tropez','Dubai','Bali','Nice','Phuket','Cancún','Miami','Santorini','Marbella','Capri','Positano','Cabo San Lucas','Montego Bay','Nassau','Koh Samui','Hvar','Sardinia'],
  'Country Clubs': ['Atlanta','Dallas','Scottsdale','Naples FL','Greenwich CT','Charlotte','Houston','Palm Beach','Chicago','Los Angeles','Boston','Nashville','Denver','San Diego','Westchester','Bloomfield Hills','Pinehurst','Hilton Head','Augusta','Kiawah Island'],
  'Golf Clubs': ['Scotland','Ireland','Pebble Beach','Scottsdale','Pinehurst','Palm Springs','Bandon','Hilton Head','Myrtle Beach','Dubai','Melbourne','Cabo San Lucas','Kohler','Sea Island','Long Island','Phoenix','Orlando','Hawaii','Portugal','Spain'],
  'Members Clubs': ['London','New York','Los Angeles','Miami','Paris','Hong Kong','Berlin','Mumbai','Toronto','Austin','Chicago','San Francisco','Tokyo','Singapore','Dubai','Amsterdam','Barcelona','Mexico City','Istanbul','Sydney'],
  'Yacht Clubs': ['Monaco','Newport RI','Miami','San Diego','Palma de Mallorca','Sydney','Auckland','Hamburg','Antibes','Fort Lauderdale','Annapolis','Cowes','Porto Cervo','Marina del Rey','Chicago','Seattle','Hong Kong','Dubai','Saint-Tropez','Cannes'],
  'Comedy Clubs': ['New York','Los Angeles','Chicago','Austin','London','Toronto','Boston','Montreal','Atlanta','Nashville','Denver','Seattle','San Francisco','Philadelphia','Washington DC'],
  'Jazz Clubs': ['New York','New Orleans','Chicago','Paris','Tokyo','London','Berlin','Lisbon','Barcelona','Montreal','Kansas City','Washington DC','San Francisco','Vienna','Copenhagen'],
  'Supper Clubs': ['Wisconsin','Chicago','New York','Los Angeles','Miami','Nashville','New Orleans','Charleston','Las Vegas','San Francisco'],
  'Rooftop Clubs': ['Bangkok','New York','Dubai','Singapore','Los Angeles','Miami','Barcelona','London','Mexico City','Athens','Mumbai','Hong Kong','Rome','Medellín','Lisbon'],
};

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.filter(e => e && e.question).map(e => norm(e.question)));
  let maxId = 0; for (const e of idx.entries) { const m = String(e.id).match(/^cl(\d+)$/); if (m) maxId = Math.max(maxId, +m[1]); }
  const seen = new Set(); const fresh = [];
  // round-robin across categories so the sprint is varied, not 30 of one type
  const lists = Object.entries(CATS).map(([cat, cities]) => cities.map(c => `The 10 Best ${cat} in ${c} (2027 Ranking)`));
  let added = true;
  for (let r = 0; added; r++) { added = false; for (const list of lists) { if (r < list.length) { const t = list[r]; const n = norm(t); added = true; if (seen.has(n) || have.has(n)) continue; seen.add(n); fresh.push(t); } } }
  const take = fresh.slice(0, 300);
  const queue = take.map((title, i) => { const id = 'cl' + String(maxId + 1 + i).padStart(4, '0'); return { id, title, slug: slug(title) }; });
  fs.writeFileSync('C:/Users/koryj/website/_cl_sprint_queue300.json', JSON.stringify(queue, null, 2));
  console.log(`fresh ${fresh.length}, took ${queue.length}. IDs ${queue[0] && queue[0].id}..${queue[queue.length-1] && queue[queue.length-1].id}`);
  console.log('sample:', queue.slice(0, 4).map(q => q.id + ' ' + q.title).join(' | '));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
