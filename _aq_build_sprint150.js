// Build aq0051–aq0200 queue from SEO keyword phrases (skip overlaps with aq0001–50).
const fs = require('fs');
const KEYWORDS = require('./_aq_keyword_phrases.json');
const EXISTING = [
  'top 10 aquarium filters 2027','top 10 canister filters 2027','top 10 hang-on-back aquarium filters 2027',
  'top 10 aquarium heaters 2027','top 10 aquarium led lights 2027','top 10 planted tank led lights 2027',
  'top 10 aquarium air pumps 2027','top 10 aquarium water test kits 2027','top 10 aquarium substrates 2027',
  'top 10 aquarium gravel vacuums 2027','top 10 protein skimmers 2027','top 10 aquarium wavemakers and powerheads 2027',
  'top 10 aquarium co2 systems 2027','top 10 aquarium water conditioners 2027','top 10 aquarium chillers 2027',
  'top 10 auto top-off systems for aquariums 2027','top 10 aquarium controllers 2027','top 10 uv sterilizers for aquariums 2027',
  'top 10 nano aquariums 2027','top 10 betta fish tanks 2027','top 10 5-gallon aquariums 2027',
  'top 10 10-gallon aquariums 2027','top 10 20-gallon aquariums 2027','top 10 40-gallon aquariums 2027',
  'top 10 75-gallon aquariums 2027','top 10 rimless aquariums 2027','top 10 all-in-one reef tanks 2027',
  'top 10 aquarium starter kits 2027','top 10 pico reef tanks 2027','top 10 acrylic aquariums 2027',
  'top 10 beginner freshwater fish 2027','top 10 nano aquarium fish 2027','top 10 freshwater schooling fish 2027',
  'top 10 betta tankmates 2027','top 10 african cichlids 2027','top 10 freshwater aquarium sharks 2027',
  'top 10 plecos for aquariums 2027','top 10 algae-eating fish 2027','top 10 freshwater aquarium shrimp 2027',
  'top 10 aquarium snails 2027','top 10 saltwater fish for beginners 2027','top 10 reef-safe saltwater fish 2027',
  'top 10 clownfish varieties 2027','top 10 goldfish varieties 2027','top 10 centerpiece fish for community tanks 2027',
  'top 10 low-light aquarium plants 2027','top 10 aquarium carpeting plants 2027','top 10 floating aquarium plants 2027',
  'top 10 tropical fish foods 2027','top 10 aquarium driftwood and decor 2027',
];

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}

function normTitle(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isDupe(phrase) {
  const t = normTitle(phrase);
  for (const e of EXISTING) {
    const en = normTitle(e.replace(/^top 10 /i, '').replace(/ 2027$/i, ''));
    const pn = normTitle(phrase.replace(/^top 10 /i, ''));
    if (en === pn || en.includes(pn) || pn.includes(en)) return true;
  }
  return false;
}

const picked = [];
for (const phrase of KEYWORDS) {
  if (picked.length >= 150) break;
  const title = /\b2027\b/.test(phrase) ? phrase : `${phrase} 2027`;
  if (isDupe(title)) continue;
  picked.push(title);
}

// Pad if keyword list filtered too aggressively
const PAD = [
  'Top 10 Corydoras Species 2027','Top 10 Neon Tetra Tank Mates 2027','Top 10 Guppy Color Variations 2027',
  'Top 10 Molly Fish for Community Tanks 2027','Top 10 Swordtail Care Essentials 2027','Top 10 Angelfish Tank Size Guide 2027',
  'Top 10 Dwarf Cichlid Species 2027','Top 10 Rainbowfish Species 2027','Top 10 Loach Varieties 2027',
  'Top 10 Gourami Types 2027','Top 10 Rasbora Species 2027','Top 10 Danio Tank Requirements 2027',
  'Top 10 Killifish for Beginners 2027','Top 10 Brackish Water Fish 2027','Top 10 Reef Tank Starter Corals 2027',
  'Top 10 Sponge Filters for Aquariums 2027','Top 10 Return Pumps for Reef Tanks 2027','Top 10 Aquarium Sumps 2027',
  'Top 10 Refugium Lights 2027','Top 10 RO/DI Systems for Aquariums 2027','Top 10 Aquarium Timers 2027',
  'Top 10 Aquarium Thermometers 2027','Top 10 Algae Scrapers 2027','Top 10 Aquarium Nets 2027',
  'Top 10 Fish Foods for Bettas 2027','Top 10 Frozen Fish Foods 2027','Top 10 Anubias Types 2027',
  'Top 10 Java Fern Varieties 2027','Top 10 Cryptocoryne Species 2027','Top 10 Aquarium Moss Types 2027',
];
for (const t of PAD) {
  if (picked.length >= 150) break;
  if (!picked.find((p) => normTitle(p) === normTitle(t)) && !isDupe(t)) picked.push(t);
}

const queue = picked.slice(0, 150).map((title, i) => {
  const n = 51 + i;
  const id = 'aq' + String(n).padStart(4, '0');
  return { id, title, slug: slugify(title) };
});

const out = 'C:/Users/koryj/_aq_sprint150.json';
fs.writeFileSync(out, JSON.stringify(queue, null, 2));
console.log('wrote', out, 'count=', queue.length);
console.log(queue[0], '...', queue[queue.length - 1]);
