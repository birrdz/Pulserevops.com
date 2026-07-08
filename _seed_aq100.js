// _seed_aq100.js — Aquariums sprint queue: 50 Top-10 + 50 regular Q&As, deduped
// vs the live index, ids from current max aq id. Real fishkeeping topics, no
// fabrication. Year-at-end on gear/product rankings; species/biology stay evergreen.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const TOP10 = [
  // gear / products — dateable → "in 2027"
  'Top 10 Canister Filters for Planted Aquariums in 2027',
  'Top 10 LED Lights for Reef Tanks in 2027',
  'Top 10 Protein Skimmers for Nano Reefs in 2027',
  'Top 10 Aquarium Heaters for Large Tanks in 2027',
  'Top 10 Wavemakers for Reef Aquariums in 2027',
  'Top 10 Aquarium Water Test Kits in 2027',
  'Top 10 RO/DI Systems for Reef Keepers in 2027',
  'Top 10 Auto Top-Off Systems for Saltwater Tanks in 2027',
  'Top 10 Aquarium Controllers for Smart Tanks in 2027',
  'Top 10 CO2 Systems for Planted Aquariums in 2027',
  'Top 10 Aquarium Chillers in 2027',
  'Top 10 Sponge Filters for Shrimp Tanks in 2027',
  'Top 10 Aquarium Gravel Vacuums in 2027',
  'Top 10 Reef Salt Mixes in 2027',
  'Top 10 Aquarium Air Pumps in 2027',
  'Top 10 UV Sterilizers for Aquariums in 2027',
  'Top 10 Planted Tank Substrates in 2027',
  'Top 10 Dosing Pumps for Reef Tanks in 2027',
  'Top 10 Nano Aquarium Kits in 2027',
  'Top 10 Hang-on-Back Filters for Freshwater Tanks in 2027',
  'Top 10 Aquarium Water Conditioners in 2027',
  'Top 10 Reef Tank Powerheads in 2027',
  'Top 10 Aquarium Glass Cleaners and Magnet Scrapers in 2027',
  'Top 10 Automatic Fish Feeders in 2027',
  'Top 10 Aquarium Plant Fertilizers in 2027',
  'Top 10 Reef Tank Refractometers in 2027',
  'Top 10 Aquarium Background Decorations in 2027',
  'Top 10 Aquascaping Tool Kits in 2027',
  'Top 10 Aquarium Filter Media in 2027',
  'Top 10 Saltwater Aquarium Starter Kits in 2027',
  // species / biology — evergreen, no year
  'Top 10 Beginner Freshwater Fish for Community Tanks',
  'Top 10 Saltwater Fish for Nano Reefs',
  'Top 10 Centerpiece Fish for Planted Tanks',
  'Top 10 Algae-Eating Fish for Freshwater Tanks',
  'Top 10 Freshwater Shrimp for Planted Tanks',
  'Top 10 Hardy Corals for Beginner Reefers',
  'Top 10 Schooling Fish for Aquascaped Tanks',
  'Top 10 Bottom-Dwelling Fish for Community Tanks',
  'Top 10 Nano Fish for Small Aquariums',
  'Top 10 Live Plants for Low-Tech Planted Tanks',
  'Top 10 Cichlids for African Cichlid Tanks',
  'Top 10 Saltwater Invertebrates for Cleanup Crews',
  'Top 10 Coldwater Fish for Unheated Aquariums',
  'Top 10 Brackish Water Fish for Aquariums',
  'Top 10 Carpeting Plants for Aquascapes',
  'Top 10 Floating Plants for Aquariums',
  'Top 10 Goby Species for Reef Tanks',
  'Top 10 Tetras for Planted Community Tanks',
  'Top 10 Snails for Algae Control in Aquariums',
  'Top 10 Pond Fish for Backyard Ponds',
  // extra top-up (buffer for dedupe)
  'Top 10 Aquarium Return Pumps in 2027',
  'Top 10 Reef Tank Frag Racks in 2027',
  'Top 10 Betta Fish Tank Kits in 2027',
  'Top 10 Aquarium Thermometers in 2027',
  'Top 10 Killifish Species for Aquariums',
  'Top 10 Rasbora Species for Planted Tanks',
];

const REGULAR = [
  'How do you cycle a new aquarium?',
  'What is the nitrogen cycle in an aquarium?',
  'How often should you do water changes in a freshwater tank?',
  'How do you lower nitrates in a reef tank?',
  'What causes algae blooms in aquariums and how do you stop them?',
  'How do you acclimate new fish to an aquarium?',
  'What is the ideal water temperature for a tropical community tank?',
  'How do you set up a planted aquarium for beginners?',
  'How do you treat ich in a freshwater aquarium?',
  'What size aquarium is best for beginners?',
  'How do you maintain stable salinity in a reef tank?',
  'What are GH and KH and why do they matter in aquariums?',
  'How do you prevent and treat fish fungal infections?',
  'How do you choose the right filter for your aquarium?',
  'How much light do planted aquariums need?',
  'How do you dose CO2 in a planted tank safely?',
  'What fish are compatible with bettas?',
  'How do you quarantine new aquarium fish?',
  'What is the best substrate for a planted aquarium?',
  'How do you control phosphates in a reef tank?',
  'How do you aquascape an aquarium?',
  'What is a refugium and do you need one?',
  'How do you feed corals in a reef tank?',
  'How do you fix cloudy aquarium water?',
  'What is the difference between a sump and a canister filter?',
  'How do you breed guppies in a home aquarium?',
  'How do you keep shrimp alive in a planted tank?',
  'What causes fish to gasp at the surface of the water?',
  'How do you raise the pH in a freshwater aquarium?',
  'How do you set up a saltwater aquarium for the first time?',
  'What is reef tank alkalinity and how do you maintain it?',
  'How do you get rid of brown algae in a new tank?',
  'How many fish can you put in a 10-gallon tank?',
  'How do you choose corals for a beginner reef tank?',
  'What equipment do you need to start a reef tank?',
  'How do you deal with aiptasia in a reef tank?',
  'How do you acclimate corals to a new tank?',
  'What is the best way to feed aquarium fish?',
  'How do you keep a planted tank without CO2?',
  'How do you prevent fish disease in a community tank?',
  'What is hair algae and how do you remove it?',
  'How do you set up a quarantine tank?',
  'How do you choose fish that will not outgrow your aquarium?',
  'What is the best way to clean aquarium glass?',
  'How do you stabilize pH swings in an aquarium?',
  'How do you safely transport fish when moving?',
  'What is a protein skimmer and how does it work?',
  'How do you grow live plants in a low-tech aquarium?',
  'How do you tell if your aquarium is overstocked?',
  'How do you maintain a nano reef tank?',
];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxAq = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^aq(\d+)$/); if (m) maxAq = Math.max(maxAq, +m[1]); }
  const items = [];
  const push = (title, kind) => { if (have.has(norm(title))) { console.log('SKIP dup:', title); return; } maxAq++; items.push({ id: 'aq' + String(maxAq).padStart(4, '0'), title, kind, prefix: 'aq' }); };
  const n = Math.max(TOP10.length, REGULAR.length);
  for (let i = 0; i < n; i++) { if (TOP10[i]) push(TOP10[i], 'top10'); if (REGULAR[i]) push(REGULAR[i], 'regular'); }
  fs.writeFileSync('C:/Users/koryj/website/_aq_sprint_queue100.json', JSON.stringify(items, null, 1));
  const t10 = items.filter(i => i.kind === 'top10').length, reg = items.filter(i => i.kind === 'regular').length;
  console.log(`queue: ${items.length} items (${t10} top10 + ${reg} regular) | ids ${items[0].id}..${items[items.length - 1].id}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
