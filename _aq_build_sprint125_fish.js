// Build aq0326–aq0450 queue — 125 fish-focused Top-10 aquarium entries.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const FISH_CANDIDATES = [
  'Top 10 Neon Tetra Tank Mates 2027', 'Top 10 Cardinal Tetra Species 2027', 'Top 10 Glowlight Tetra Varieties 2027',
  'Top 10 Lemon Tetra Community Fish 2027', 'Top 10 Black Neon Tetra Picks 2027', 'Top 10 Penguin Tetra Shoaling Fish 2027',
  'Top 10 Bleeding Heart Tetra Types 2027', 'Top 10 Emperor Tetra Centerpiece Fish 2027', 'Top 10 Diamond Tetra Color Strains 2027',
  'Top 10 Serpae Tetra Tank Ideas 2027', 'Top 10 Buenos Aires Tetra Hardy Fish 2027', 'Top 10 Bloodfin Tetra Active Swimmers 2027',
  'Top 10 Red Phantom Tetra Blackwater Fish 2027', 'Top 10 Flame Tetra South American Picks 2027', 'Top 10 Columbian Tetra Shoalers 2027',
  'Top 10 Blind Cave Tetra Oddball Fish 2027', 'Top 10 Pencilfish Nano Species 2027', 'Top 10 Hatchetfish Surface Swimmers 2027',
  'Top 10 Corydoras Catfish Species 2027', 'Top 10 Corydoras Sterbai Tank Mates 2027', 'Top 10 Corydoras Julii Varieties 2027',
  'Top 10 Corydoras Pygmaeus Schooling Catfish 2027', 'Top 10 Bronze Corydoras Beginner Picks 2027', 'Top 10 Panda Corydoras Nano Tanks 2027',
  'Top 10 Bristlenose Pleco Morphs 2027', 'Top 10 Common Pleco Alternatives 2027', 'Top 10 Clown Pleco Wood Grazers 2027',
  'Top 10 Rubber Lip Pleco Algae Eaters 2027', 'Top 10 Zebra Pleco Rare Catfish 2027', 'Top 10 Farlowella Twig Catfish 2027',
  'Top 10 Whiptail Catfish Peaceful Oddballs 2027', 'Top 10 Pictus Catfish Active Swimmers 2027', 'Top 10 Raphael Catfish Nocturnal Fish 2027',
  'Top 10 Upside Down Catfish African Picks 2027', 'Top 10 Synodontis Catfish Species 2027', 'Top 10 Glass Catfish Transparent Shoalers 2027',
  'Top 10 Otocinclus Algae Crew Species 2027', 'Top 10 Clown Loach Centerpiece Fish 2027', 'Top 10 Yo-Yo Loach Patterned Loaches 2027',
  'Top 10 Kuhli Loach Sand Dwellers 2027', 'Top 10 Hillstream Loach Flow Tank Fish 2027', 'Top 10 Weather Loach Cold Tolerant Fish 2027',
  'Top 10 Zebra Loach Striped Bottom Fish 2027', 'Top 10 Rope Fish Eel-Like Oddballs 2027', 'Top 10 Bichir Ancient Fish Species 2027',
  'Top 10 Elephant Nose Fish Oddball Picks 2027', 'Top 10 African Butterfly Fish Surface Hunters 2027', 'Top 10 Silver Dollar Fish Shoalers 2027',
  'Top 10 Red Hook Silver Dollar Varieties 2027', 'Top 10 Severum Cichlid Tank Mates 2027', 'Top 10 Blue Acara Peaceful Cichlids 2027',
  'Top 10 Electric Blue Acara Centerpiece Fish 2027', 'Top 10 Keyhole Cichlid Shy Cichlids 2027', 'Top 10 Checkerboard Cichlid Dwarf Pairs 2027',
  'Top 10 Shell Dweller Cichlid Species 2027', 'Top 10 Julidochromis Tanganyika Cichlids 2027', 'Top 10 Altolamprologus Compressiceps 2027',
  'Top 10 Oscar Cichlid Tank Mates 2027', 'Top 10 Red Devil Cichlid Aggressive Fish 2027', 'Top 10 Midas Cichlid Large Cichlids 2027',
  'Top 10 Uaru Cichlid Herbivore Cichlids 2027', 'Top 10 Geophagus Eartheater Cichlids 2027', 'Top 10 Rainbow Shark Semi-Aggressive Fish 2027',
  'Top 10 Red Tail Black Shark Center Fish 2027', 'Top 10 Flying Fox Algae Eaters 2027', 'Top 10 Siamese Algae Eater Species 2027',
  'Top 10 Chinese Algae Eater Alternatives 2027', 'Top 10 Paradise Fish Hardy Labyrinth Fish 2027', 'Top 10 Pearl Gourami Peaceful Gouramis 2027',
  'Top 10 Dwarf Gourami Color Morphs 2027', 'Top 10 Sparkling Gourami Nano Fish 2027', 'Top 10 Licorice Gourami Rare Gouramis 2027',
  'Top 10 Moonlight Gourami Large Gouramis 2027', 'Top 10 Blue Gourami Community Fish 2027', 'Top 10 Betta Fish Tail Types 2027',
  'Top 10 Betta Sorority Tank Mates 2027', 'Top 10 Peaceful Betta Community Fish 2027', 'Top 10 Wild Type Betta Species 2027',
  'Top 10 Fancy Guppy Strain Colors 2027', 'Top 10 Molly Fish Varieties 2027', 'Top 10 Sailfin Molly Centerpiece Livebearers 2027',
  'Top 10 Lyretail Swordtail Strains 2027', 'Top 10 Platy Fish Color Morphs 2027', 'Top 10 Killifish Beginner Species 2027',
  'Top 10 Gardneri Killifish Pairs 2027', 'Top 10 Golden Wonder Killifish Top Swimmers 2027', 'Top 10 Celebes Rainbow Nano Fish 2027',
  'Top 10 Forktail Blue Eye Rainbowfish 2027', 'Top 10 Pseudomugil Rainbowfish Species 2027', 'Top 10 Rice Fish Nano Species 2027',
  'Top 10 Medaka Japanese Rice Fish 2027', 'Top 10 Rosy Barb Peaceful Barbs 2027', 'Top 10 Tiger Barb Active Barbs 2027',
  'Top 10 Odessa Barb Colorful Barbs 2027', 'Top 10 Denison Barb Red Line Barbs 2027', 'Top 10 Tinfoil Barb Large Shoalers 2027',
  'Top 10 Gold Barb Hardy Barbs 2027', 'Top 10 Giant Danio Fast Swimmers 2027', 'Top 10 Pearl Danio Peaceful Danios 2027',
  'Top 10 Zebra Danio Beginner Fish 2027', 'Top 10 Leopard Danio Patterned Danios 2027', 'Top 10 Goldfish Fancy Varieties 2027',
  'Top 10 Comet Goldfish Pond Fish 2027', 'Top 10 Ranchu Goldfish Ornamental Breeds 2027', 'Top 10 Ryukin Goldfish Round Body Types 2027',
  'Top 10 Arowana Aquarium Species 2027', 'Top 10 Discus Color Strains 2027', 'Top 10 Angelfish Color Morphs 2027',
  'Top 10 Freshwater Angelfish Tank Mates 2027', 'Top 10 South American Tetra Biotope Fish 2027', 'Top 10 West African Killifish Species 2027',
  'Top 10 Central American Livebearer Fish 2027', 'Top 10 Asian Nano Fish for Shrimp Tanks 2027', 'Top 10 Cold Water Aquarium Fish 2027',
  'Top 10 Low Light Community Fish 2027', 'Top 10 High Flow River Fish 2027', 'Top 10 Blackwater Aquarium Fish 2027',
  'Top 10 Peaceful Cichlid Community Fish 2027', 'Top 10 Semi-Aggressive Cichlid Tank Fish 2027', 'Top 10 Monster Fish for Large Tanks 2027',
  'Top 10 Nano Reef Safe Fish 2027', 'Top 10 Anthias Reef Fish Species 2027', 'Top 10 Hawkfish Reef Personality Fish 2027',
  'Top 10 Fairy Wrasse Colorful Reef Fish 2027', 'Top 10 Flasher Wrasse Display Fish 2027', 'Top 10 Leopard Wrasse Sand Sifters 2027',
  'Top 10 Yellow Coris Wrasse Pest Control Fish 2027', 'Top 10 Melanurus Wrasse Active Wrasses 2027', 'Top 10 Royal Gramma Basslet Pairs 2027',
  'Top 10 Swissguard Basslet Reef Fish 2027', 'Top 10 Bicolor Dottyback Aggressive Reef Fish 2027', 'Top 10 Orchid Dottyback Nano Reef Fish 2027',
  'Top 10 Pajama Cardinalfish Peaceful Marine Fish 2027', 'Top 10 Longspine Cardinalfish Shoaling Fish 2027', 'Top 10 Threadfin Cardinalfish 2027',
  'Top 10 Skunk Clownfish Hardy Marine Fish 2027', 'Top 10 Percula Clownfish Classic Reef Fish 2027', 'Top 10 Maroon Clownfish Large Clowns 2027',
  'Top 10 Tomato Clownfish Aggressive Clowns 2027', 'Top 10 Clarkii Clownfish Hardy Clownfish 2027', 'Top 10 Sailfin Tang Large Reef Fish 2027',
  'Top 10 Kole Tang Algae Grazing Fish 2027', 'Top 10 Naso Tang Unicorn Tang Species 2027', 'Top 10 Chevron Tang Rare Tangs 2027',
  'Top 10 Scopas Tang Brown Tang Varieties 2027', 'Top 10 Convict Tang Striped Reef Fish 2027', 'Top 10 Tomini Tang Small Tang Species 2027',
  'Top 10 Midas Blenny Colorful Blennies 2027', 'Top 10 Sailfin Blenny Personality Reef Fish 2027', 'Top 10 Scooter Blenny Sand Sifters 2027',
  'Top 10 Engineer Goby Reef Safe Gobies 2027', 'Top 10 Diamond Watchman Goby Pairs 2027', 'Top 10 Rainford Goby Nano Reef Fish 2027',
  'Top 10 Neon Goby Cleaner Fish 2027', 'Top 10 Marine Betta Shy Reef Fish 2027', 'Top 10 Squarespot Anthias Shoaling Reef Fish 2027',
  'Top 10 Lyretail Anthias Display Fish 2027', 'Top 10 Bartlett Anthias Hardy Anthias 2027', 'Top 10 Copperband Butterflyfish Aiptasia Eaters 2027',
  'Top 10 Klein Butterflyfish Reef Butterflyfish 2027', 'Top 10 Longnose Hawkfish Perching Fish 2027', 'Top 10 Arc Eye Hawkfish Bold Reef Fish 2027',
  'Top 10 Green Chromis Schooling Reef Fish 2027', 'Top 10 Blue Green Chromis Nano Reef Fish 2027', 'Top 10 Talbot Damsel Hardy Reef Fish 2027',
  'Top 10 Three Stripe Damsel Beginner Marine Fish 2027', 'Top 10 Yellowtail Damselfish Semi-Aggressive Fish 2027',
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
  for (const title of FISH_CANDIDATES) {
    if (picked.length >= 125) break;
    const n = norm(title);
    if (used.has(n)) continue;
    if (picked.some((t) => norm(t) === n)) continue;
    picked.push(title);
    used.add(n);
  }
  if (picked.length < 125) {
    console.error('Only found', picked.length, 'unique fish titles — add more FISH_CANDIDATES');
    process.exit(1);
  }

  const queue = picked.slice(0, 125).map((title, i) => {
    const id = 'aq' + String(326 + i).padStart(4, '0');
    return { id, title, slug: slugify(title) };
  });
  const out = 'C:/Users/koryj/_aq_sprint125_fish.json';
  fs.writeFileSync(out, JSON.stringify(queue, null, 2));
  console.log('wrote', out, 'count=', queue.length);
  console.log(queue[0].id, queue[0].title);
  console.log(queue[queue.length - 1].id, queue[queue.length - 1].title);
})();
