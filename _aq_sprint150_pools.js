// Product/species pools for aq sprint 150 body generator.
function it(name, price, spec, bestFor, brand) {
  return { name, price, spec, bestFor, brand };
}

const POOLS = {
  fish: [
    it('Neon Tetra', 3, '1.5 in · pH 6.0–7.0 · peaceful shoaler', 'Classic nano community color', 'Tetra'),
    it('Cardinal Tetra', 4, '2 in · soft acidic water · red-blue stripe', 'Planted blackwater tanks', 'Tetra'),
    it('Corydoras Panda', 8, '2 in · bottom dweller · 72–78°F', 'Peaceful cleanup crew', 'Corydoras'),
    it('Corydoras Sterbai', 12, '2.5 in · spotted armor · hardy', 'Community substrate sifter', 'Corydoras'),
    it('German Blue Ram', 14, '3 in · dwarf cichlid · pairs well', 'Centerpiece nano cichlid', 'Mikrogeophagus'),
    it('Honey Gourami', 6, '2.5 in · labyrinth · calm surface swimmer', 'Small peaceful gourami', 'Trichogaster'),
    it('Cherry Barb', 5, '2 in · schooling · tolerates cooler water', 'Active mid-level color', 'Puntius'),
    it('Harlequin Rasbora', 4, '2 in · orange wedge · classic biotope', 'Planted community staple', 'Trigonostigma'),
    it('Kuhli Loach', 7, '4 in · eel-like · burrows in sand', 'Oddball peaceful bottom fish', 'Pangio'),
    it('Bristlenose Pleco', 10, '4 in · algae grazer · breeds in captivity', 'Best algae control pleco', 'Ancistrus'),
  ],
  saltfish: [
    it('Ocellaris Clownfish', 25, '3 in · reef safe · pairs bond', 'Iconic beginner marine fish', 'Amphiprion'),
    it('Firefish Goby', 18, '3 in · darting · needs lid', 'Peaceful nano reef fish', 'Nemateleotris'),
    it('Royal Gramma', 22, '3 in · purple-yellow · cave dweller', 'Reef centerpiece color', 'Gramma'),
    it('Yellow Watchman Goby', 20, '4 in · pairs with pistol shrimp', 'Sand-sifting personality', 'Cryptocentrus'),
    it('Green Chromis', 12, '3 in · shoaling · hardy damsel', 'Reef schooling blue fish', 'Chromis'),
    it('Sixline Wrasse', 28, '3 in · pest control · active', 'Aiptasia and flatworm hunter', 'Pseudocheilinus'),
    it('Bangaii Cardinalfish', 24, '3 in · mouthbrooder · slow swimmer', 'Striking striped marine', 'Pterapogon'),
    it('Tailspot Blenny', 30, '2.5 in · algae grazer · perching', 'Nano reef personality fish', 'Ecsenius'),
    it('Azure Damselfish', 10, '2 in · hardy · can be territorial', 'Cycle fish then rehome', 'Chrysiptera'),
    it('Coral Beauty Angelfish', 45, '4 in · dwarf angel · reef with caution', 'Colorful centropyge', 'Centropyge'),
  ],
  plants: [
    it('Java Fern', 8, 'Low light · rhizome on wood · slow grower', 'Bulletproof beginner plant', 'Microsorum'),
    it('Anubias Nana Petite', 10, 'Low light · attach to hardscape', 'Nano aquascape staple', 'Anubias'),
    it('Cryptocoryne Wendtii', 7, 'Low–medium light · root feeder', 'Red-green easy crypt', 'Cryptocoryne'),
    it('Amazon Sword', 9, 'Root tabs · background rosette', 'Large tank focal plant', 'Echinodorus'),
    it('Dwarf Hairgrass', 12, 'Medium–high light · carpet candidate', 'Lawn effect with CO2', 'Eleocharis'),
    it('Monte Carlo', 14, 'High light · CO2 helps · carpet', 'Iwagumi foreground', 'Micranthemum'),
    it('Water Wisteria', 6, 'Fast grower · nutrient sponge', 'Algae competition plant', 'Hygrophila'),
    it('Hornwort', 5, 'Floating or planted · ammonia sink', 'Breeder tank cover', 'Ceratophyllum'),
    it('Red Root Floater', 8, 'Floating · high light reddens', 'Surface shade for shrimp', 'Phyllanthus'),
    it('Christmas Moss', 11, 'Attach to wood · shrimp habitat', 'Naturalistic texture', 'Vesicularia'),
  ],
  gear: [
    it('Fluval 307 Canister', 160, '303 GPH · 40–70 gal · quiet', 'Best all-around canister', 'Fluval'),
    it('AquaClear 50 HOB', 45, '200 GPH · refillable media', 'Best value hang-on-back', 'AquaClear'),
    it('Seachem Tidal 75', 60, '350 GPH · surface skimmer', 'Premium HOB design', 'Seachem'),
    it('Eheim Jäger 150W', 32, '150W · glass · adjustable', 'Reliable heater line', 'Eheim'),
    it('Fluval Plant 3.0 LED', 120, 'Bluetooth · PAR for planted', 'App-controlled planted light', 'Fluval'),
    it('NICREW ClassicLED', 35, 'Budget PAR · dimmable', 'Starter planted upgrade', 'NICREW'),
    it('Sponge Filter XY-2836', 12, 'Air driven · biofilm surface', 'Shrimp and fry safe', 'Generic'),
    it('Python No Spill Clean', 48, 'Gravel vac · water changer', 'Fast water changes', 'Python'),
    it('API Freshwater Master Kit', 28, 'Ammonia · nitrite · nitrate · pH', 'Standard test kit', 'API'),
    it('Seachem Prime', 12, 'Dechlorinator · ammonia detox', 'Daily water conditioner', 'Seachem'),
  ],
  reef: [
    it('Zoanthids Colony', 35, 'Soft coral · photosynthetic · spread', 'Beginner reef color', 'Zoanthus'),
    it('Green Star Polyp', 25, 'Fast spread · low demand', 'First coral for new reef', 'Pachyclavularia'),
    it('Hammer Coral', 55, 'LPS · moderate flow · weekly feed', 'Showpiece LPS', 'Euphyllia'),
    it('Birdsnest Coral', 40, 'SPS starter · bright light', 'Branching SPS practice', 'Seriatopora'),
    it('Toadstool Leather', 30, 'Soft coral · tolerant', 'Easy leather coral', 'Sarcophyton'),
    it('AI Prime 16HD', 230, 'Reef PAR · app control', 'Nano reef lighting', 'AquaIllumination'),
    it('Reef Octopus Classic 100', 190, 'Protein skimmer · 100 gal', 'Dependable skimmer', 'Reef Octopus'),
    it('Instant Ocean Salt Mix', 18, 'Marine salt · 50 gal box', 'Widely available mix', 'Instant Ocean'),
    it('Red Sea Reef Foundation', 45, 'Ca/Alk/Mg test kit', 'Reef parameter testing', 'Red Sea'),
    it('AutoAqua Smart ATO', 85, 'Optical sensor · quiet pump', 'Stable salinity ATO', 'AutoAqua'),
  ],
  food: [
    it('Hikari Micro Pellets', 8, 'Slow sink · community formula', 'Daily staple pellets', 'Hikari'),
    it('New Life Spectrum Thera-A', 12, 'Garlic enhanced · immune support', 'Sick tank recovery food', 'NLS'),
    it('Omega One Frozen Bloodworms', 9, 'Treat · protein rich', 'Conditioning and color', 'Omega One'),
    it('Repashy Soilent Green', 14, 'Gel food · algae base', 'Pleco and shrimp gel', 'Repashy'),
    it('Sera Vipan Nature', 10, 'Flake · no dyes', 'European quality flake', 'Sera'),
    it('Northfin Community', 11, 'Low ash pellets', 'Clean water formula', 'Northfin'),
    it('San Francisco Bay Brine Shrimp', 7, 'Hatch or frozen', 'Fry and marine treat', 'SF Bay'),
    it('TetraMin Tropical Flakes', 6, 'Classic flake · widely stocked', 'Budget community flake', 'Tetra'),
    it('Hikari Algae Wafers', 9, 'Sinking veggie disks', 'Pleco and snail food', 'Hikari'),
    it('Cobalt Ultra Pellets', 13, 'Probiotics · color enhancers', 'Premium daily diet', 'Cobalt'),
  ],
};

function poolFor(title) {
  const t = String(title).toLowerCase();
  if (/salt|reef|marine|clown|coral|brackish|live rock|refugium|skimmer|ro\/di/i.test(t)) {
    if (/coral|reef|zoanth|hammer|starter coral/i.test(t)) return POOLS.reef;
    if (/fish|goby|wrasse|damsel|cardinal/i.test(t)) return POOLS.saltfish;
    return [...POOLS.reef, ...POOLS.gear].slice(0, 10);
  }
  if (/plant|moss|fern|anubias|crypt|carpet|iwagumi|stem|floating|substrate|fertiliz|co2|root tab/i.test(t)) return POOLS.plants;
  if (/food|pellet|flake|frozen|feed|vitamin/i.test(t)) return POOLS.food;
  if (/fish|tetra|cory|guppy|molly|betta|pleco|loach|gourami|rasbora|danio|cichlid|killifish|shrimp|snail|puffer|oscar|discus|angelfish|rainbow/i.test(t)) return POOLS.fish;
  return POOLS.gear;
}

function wikiSlug(name) {
  return encodeURIComponent(name.split(/[(\[]/)[0].trim().replace(/\s+/g, '_'));
}

module.exports = { POOLS, poolFor, wikiSlug, it };
