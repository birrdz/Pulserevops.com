// _aq_ds_seed.js — DeepSeek aquarium queue on a SEPARATE high id band (aq1100+)
// so it never collides with the Claude sprint (aq0972-aq1071). 20 Top-10 + 20
// regular, deduped vs the live index. Real fishkeeping topics.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const TOP10 = [
  'Top 10 Aquarium Sand Substrates for Saltwater Tanks in 2027',
  'Top 10 Aquarium Plant Grow Lights in 2027',
  'Top 10 Aquarium Surface Skimmers in 2027',
  'Top 10 Internal Aquarium Filters in 2027',
  'Top 10 Aquarium Wave Pump Brands in 2027',
  'Top 10 Freshwater Aquarium Plants for Beginners',
  'Top 10 Pleco Species for Freshwater Aquariums',
  'Top 10 Reef-Safe Wrasse Species for Aquariums',
  'Top 10 Saltwater Angelfish for Large Reef Tanks',
  'Top 10 Dwarf Cichlids for Planted Aquariums',
  'Top 10 Catfish Species for Community Aquariums',
  'Top 10 Livebearer Fish for Beginner Aquariums',
  'Top 10 Clownfish Varieties for Saltwater Aquariums',
  'Top 10 Reef-Safe Tangs for Saltwater Aquariums',
  'Top 10 Aquarium Moss Species for Aquascaping',
  'Top 10 Anemone Species for Clownfish Tanks',
  'Top 10 Aquarium Driftwood Types for Aquascaping',
  'Top 10 Rainbowfish Species for Planted Tanks',
  'Top 10 Nano Saltwater Corals for Beginners',
  'Top 10 Aquarium Background Plants for Aquascaping',
];

const REGULAR = [
  'How do you breed betta fish?',
  'What is old tank syndrome and how do you avoid it?',
  'How do you set up a shrimp-only aquarium?',
  'How do you treat fin rot in aquarium fish?',
  'What is the best food for tropical aquarium fish?',
  'How do you remove ammonia from an aquarium quickly?',
  'How do you set up a betta fish tank?',
  'How do you plumb an aquarium sump?',
  'How do you keep aquarium plants from melting after planting?',
  'How do you raise water hardness in a shrimp tank?',
  'How do you quarantine and dip new corals?',
  'What are dinoflagellates and how do you get rid of them in a reef tank?',
  'How do you set up an African cichlid aquarium?',
  'How do you tell male and female aquarium fish apart?',
  'How do you lower pH in a freshwater aquarium naturally?',
  'How do you keep a goldfish tank healthy?',
  'How do you do a fishless cycle with ammonia?',
  'How do you set up a low-tech planted shrimp tank?',
  'How do you treat velvet disease in aquarium fish?',
  'How do you keep a betta and other fish together peacefully?',
];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let id = 1100; // fixed high band, clear of the sprint (aq0972-aq1071)
  const items = [];
  const push = (title, kind) => { if (have.has(norm(title))) { console.log('SKIP dup:', title); return; } items.push({ id: 'aq' + String(id++).padStart(4, '0'), title, kind, prefix: 'aq' }); };
  const n = Math.max(TOP10.length, REGULAR.length);
  for (let i = 0; i < n; i++) { if (TOP10[i]) push(TOP10[i], 'top10'); if (REGULAR[i]) push(REGULAR[i], 'regular'); }
  fs.writeFileSync('C:/Users/koryj/website/_aq_ds_queue.json', JSON.stringify(items, null, 1));
  console.log(`DS queue: ${items.length} items (${items.filter(i => i.kind === 'top10').length} top10 + ${items.filter(i => i.kind === 'regular').length} regular) | ids ${items[0].id}..${items[items.length - 1].id}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
