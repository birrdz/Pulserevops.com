// Build aq0201–aq0325 queue (125 new Top-10 aquarium entries).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const CANDIDATES = [
  'Top 10 Amazon Biotope Fish 2027','Top 10 Southeast Asian Biotope Fish 2027','Top 10 Central American Cichlids 2027',
  'Top 10 South American Cichlids 2027','Top 10 Lake Tanganyika Cichlids 2027','Top 10 Lake Malawi Cichlids 2027',
  'Top 10 Lake Victoria Cichlids 2027','Top 10 West African Cichlids 2027','Top 10 Peacock Cichlid Varieties 2027',
  'Top 10 Mbuna Cichlids 2027','Top 10 Apistogramma Species 2027','Top 10 Bolivian Ram Tank Mates 2027',
  'Top 10 Discus Tank Mates 2027','Top 10 Angelfish Tank Mates 2027','Top 10 Guppy Tank Mates 2027',
  'Top 10 Platy Fish Varieties 2027','Top 10 Swordtail Varieties 2027','Top 10 Endler Livebearer Strains 2027',
  'Top 10 White Cloud Mountain Minnows 2027','Top 10 Celestial Pearl Danios 2027','Top 10 Chili Rasbora Species 2027',
  'Top 10 Ember Tetra Tank Ideas 2027','Top 10 Rummy Nose Tetra Care Tips 2027','Top 10 Black Skirt Tetra Tank Mates 2027',
  'Top 10 Congo Tetra Centerpiece Fish 2027','Top 10 Boesemani Rainbowfish 2027','Top 10 Turquoise Rainbowfish 2027',
  'Top 10 Kribensis Cichlid Care 2027','Top 10 Firemouth Cichlid Tank Size 2027','Top 10 Convict Cichlid Tank Mates 2027',
  'Top 10 Jack Dempsey Cichlid Requirements 2027','Top 10 Green Terror Cichlid Care 2027','Top 10 Frontosa Cichlid Setup 2027',
  'Top 10 Flowerhorn Cichlid Varieties 2027','Top 10 Blood Parrot Cichlid Care 2027','Top 10 Pea Puffer Tank Setup 2027',
  'Top 10 Figure 8 Puffer Brackish Setup 2027','Top 10 Archer Fish Brackish Tanks 2027','Top 10 Mono Sebae Brackish Fish 2027',
  'Top 10 Bumblebee Goby Species 2027','Top 10 Mudskipper Aquarium Setup 2027','Top 10 Mandarin Dragonet Care 2027',
  'Top 10 Yellow Tang Saltwater Fish 2027','Top 10 Blue Tang Care Requirements 2027','Top 10 Purple Tang Reef Fish 2027',
  'Top 10 Powder Blue Tang Setup 2027','Top 10 Flame Angelfish Reef Tanks 2027','Top 10 Coral Beauty Angelfish 2027',
  'Top 10 Emperor Angelfish Requirements 2027','Top 10 Yellow Watchman Goby Pairs 2027','Top 10 Lawnmower Blenny Algae Control 2027',
  'Top 10 Foxface Rabbitfish 2027','Top 10 Copperband Butterflyfish 2027','Top 10 Cleaner Shrimp Species 2027',
  'Top 10 Peppermint Shrimp Aiptasia Control 2027','Top 10 Emerald Crab Reef Tanks 2027','Top 10 Scarlet Skunk Cleaner Shrimp 2027',
  'Top 10 LPS Corals for Beginners 2027','Top 10 SPS Corals for Advanced Reefs 2027','Top 10 Soft Corals for Nano Reefs 2027',
  'Top 10 Mushroom Corals for Reef Tanks 2027','Top 10 Xenia Coral Varieties 2027','Top 10 Torch Coral Care Tips 2027',
  'Top 10 Frogspawn Coral Placement 2027','Top 10 Duncan Coral LPS Picks 2027','Top 10 Acropora SPS Starter Corals 2027',
  'Top 10 Refugium Macroalgae Types 2027','Top 10 Chaetomorpha Refugium Setup 2027','Top 10 Live Sand for Reef Tanks 2027',
  'Top 10 Reef Tank Test Kits 2027','Top 10 Calcium Reactors for Reefs 2027','Top 10 Kalkwasser Dosing Systems 2027',
  'Top 10 Dosing Pumps for Reef Aquariums 2027','Top 10 Media Reactors for Reef Tanks 2027','Top 10 GFO Media for Phosphate Control 2027',
  'Top 10 Carbon Dosing Reef Methods 2027','Top 10 Quarantine Tank Equipment 2027','Top 10 Hospital Tank Essentials 2027',
  'Top 10 Breeder Box Options 2027','Top 10 Sponge Filters for Fry Tanks 2027','Top 10 Fry Food Options 2027',
  'Top 10 Livebearer Breeding Tips 2027','Top 10 Cichlid Breeding Setup Ideas 2027','Top 10 Shrimp Breeding Tanks 2027',
  'Top 10 Betta Breeding Tank Setup 2027','Top 10 Planted Tank CO2 Diffusers 2027','Top 10 CO2 Drop Checkers 2027',
  'Top 10 Aquarium Lily Pipes 2027','Top 10 Glass Inflow Outflow Pipes 2027','Top 10 Aquarium Surface Skimmers 2027',
  'Top 10 Inline Heaters for Canisters 2027','Top 10 Aquarium Cooling Fans 2027','Top 10 Aquarium Insulation Methods 2027',
  'Top 10 Aquarium Cabinet Stands 2027','Top 10 Custom Aquarium Builders 2027','Top 10 Low Iron Rimless Tanks 2027',
  'Top 10 Red Sea Reefer Alternatives 2027','Top 10 Waterbox Aquarium Systems 2027','Top 10 Innovative Marine Nano Skimmers 2027',
  'Top 10 Sicce Return Pumps 2027','Top 10 Jebao Wavemakers 2027','Top 10 Ecotech VorTech Pumps 2027',
  'Top 10 AI Hydra Reef Lights 2027','Top 10 Kessil Reef Lights 2027','Top 10 T5 HO Reef Lighting 2027',
  'Top 10 Chihiros Planted Tank Lights 2027','Top 10 Twinstar Algae Inhibitors 2027','Top 10 Oase Biomaster Filters 2027',
  'Top 10 Sunsun Canister Filters 2027','Top 10 Hydor Internal Filters 2027','Top 10 Zoo Med Aquatic Products 2027',
  'Top 10 CaribSea Substrates 2027','Top 10 Seachem Flourite Substrates 2027','Top 10 ADA Aqua Soil Products 2027',
  'Top 10 UNS Controsoil Options 2027','Top 10 Aquascaping Tool Kits 2027','Top 10 Aquarium Tweezers and Scissors 2027',
  'Top 10 Aquascaping Rocks for Iwagumi 2027','Top 10 Dragon Stone Aquascaping 2027','Top 10 Seiryu Stone Hardscape 2027',
  'Top 10 Spider Wood for Aquascapes 2027','Top 10 Manzanita Driftwood Branches 2027','Top 10 Bucephalandra Varieties 2027',
  'Top 10 Ludwigia Repens Color Varieties 2027','Top 10 Rotala Rotundifolia Types 2027','Top 10 Vallisneria Aquarium Plants 2027',
  'Top 10 Sagittaria Subulata Carpet Plants 2027','Top 10 Marsilea Hirsuta Carpeting 2027','Top 10 Monte Carlo Carpet Plants 2027',
  'Top 10 Dwarf Baby Tears Carpeting 2027','Top 10 Staurogyne Repens Foreground Plants 2027','Top 10 Hydrocotyle Tripartita Carpet 2027',
  'Top 10 Salvinia Floating Plants 2027','Top 10 Duckweed Control Methods 2027','Top 10 Frogbit Floating Plants 2027',
  'Top 10 Amano Shrimp Tank Mates 2027','Top 10 Cherry Shrimp Color Grades 2027','Top 10 Blue Dream Shrimp Lines 2027',
  'Top 10 Crystal Red Shrimp Grades 2027','Top 10 Bamboo Shrimp Filter Feeders 2027','Top 10 Vampire Shrimp Species 2027',
  'Top 10 Nerite Snail Types 2027','Top 10 Mystery Snail Colors 2027','Top 10 Assassin Snail Pest Control 2027',
  'Top 10 Rabbit Snail Varieties 2027','Top 10 Malaysian Trumpet Snail Benefits 2027','Top 10 Aquarium Pest Snail Solutions 2027',
  'Top 10 Planaria Treatment Options 2027','Top 10 Hydra Removal Methods 2027','Top 10 Detritus Worm Control 2027',
  'Top 10 Aquarium Medication Brands 2027','Top 10 Salt Bath Fish Treatments 2027','Top 10 Aquarium Quarantine Medications 2027',
  'Top 10 Methylene Blue Fish Treatments 2027','Top 10 Aquarium Salt Uses 2027','Top 10 Epsom Salt Fish Treatments 2027',
];

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}
function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const used = new Set((idx.entries || []).filter((e) => e && /^aq\d+$/i.test(e.id)).map((e) => norm(e.question)));

  const picked = [];
  for (const title of CANDIDATES) {
    if (picked.length >= 125) break;
    const n = norm(title);
    if (used.has(n)) continue;
    if (picked.some((t) => norm(t) === n)) continue;
    picked.push(title);
    used.add(n);
  }
  if (picked.length < 125) {
    console.error('Only found', picked.length, 'unique titles — add more CANDIDATES');
    process.exit(1);
  }

  const queue = picked.slice(0, 125).map((title, i) => {
    const id = 'aq' + String(201 + i).padStart(4, '0');
    return { id, title, slug: slugify(title) };
  });
  const out = 'C:/Users/koryj/_aq_sprint125.json';
  fs.writeFileSync(out, JSON.stringify(queue, null, 2));
  console.log('wrote', out, 'count=', queue.length);
  console.log(queue[0].id, queue[0].title);
  console.log(queue[queue.length - 1].id, queue[queue.length - 1].title);
})();
