// Fish & Crabs hot-spot data. Coordinates are REAL public access points; density
// arrays are ILLUSTRATIVE of typical seasonal/time abundance from public reports —
// not surveyed GPS marks. Density points are placed in OPEN WATER. Each point is
// [lat, lng, intensity 0–1]: red≈dense, yellow≈good, green≈few. cat = 'crab'|'fish'.
// seasons = conversational "around this time of year" dialogue, shown by current month.
module.exports = [
  {
    slug: 'bay-bridge', cat: 'fish',
    region: 'Chesapeake Bay · MD',
    hubTitle: 'Best Fishing at the Bay Bridge in 2027',
    hubBlurb: 'Watch the density move onto the bridge pilings at dawn & dusk, then slide to the channel midday.',
    title: 'Best Fishing Spots at the Bay Bridge in 2027',
    desc: 'Where to fish the Chesapeake Bay Bridge for rockfish and striped bass — a density map that changes by time of day, plus public access, gear, and the rules.',
    dek: 'The Bay Bridge is a structure magnet for rockfish (striped bass) — and where they hold changes with the light. This density map <b>shifts by time of day</b>: red on the pilings at dawn & dusk, sliding to the deep channel midday.',
    quick: 'Fish push tight to the <b>bridge pilings and shallow flats at dawn and dusk</b> (densest, low-light feed); they slide off to the cooler <b>deep channel edges at midday</b>; after dark they hold in the <b>light line of the lit spans</b>. Best public access is Sandy Point and Matapeake.',
    center: [38.99, -76.39], zoom: 12,
    fish: {
      dawn:    [[38.992,-76.388,1.0],[38.997,-76.393,0.95],[38.987,-76.398,0.9],[39.004,-76.382,0.8],[38.972,-76.405,0.55]],
      morning: [[38.992,-76.390,0.8],[38.985,-76.400,0.75],[38.975,-76.408,0.6],[39.00,-76.385,0.55]],
      midday:  [[38.965,-76.430,0.9],[38.945,-76.445,0.85],[39.02,-76.420,0.7],[38.93,-76.43,0.5]],
      dusk:    [[38.992,-76.388,1.0],[38.997,-76.386,0.95],[38.986,-76.396,0.9],[39.004,-76.384,0.85],[38.97,-76.405,0.6]],
      night:   [[38.992,-76.390,0.9],[38.997,-76.385,0.8],[38.986,-76.395,0.7]]
    },
    crab: {
      dawn:[[38.96,-76.41,0.5],[38.94,-76.40,0.4]], morning:[[38.96,-76.41,0.45]],
      midday:[[38.96,-76.41,0.35]], dusk:[[38.96,-76.41,0.4]], night:[[38.96,-76.41,0.3]]
    },
    bite: {
      dawn:'🔴 Densest. Rockfish tight on the pilings & shallow flats in the low light.',
      morning:'Good. Fish easing off the structure toward the channel edges.',
      midday:'Slower & deeper — work the channel drops; the bite scatters off the bridge.',
      dusk:'🔴 Dense again. Evening low-light pushes fish back onto the spans & points.',
      night:'Steady on the LIT spans — fish hold in the light line ambushing bait.'
    },
    seasons: {
      spring:'Spring is trophy time — big pre-spawn rockfish stage around the bridge and up-bay before the run. Early and late are best; the heat goes red right on the structure at first and last light.',
      summer:'Mid-summer the resident stripers stack on the bridge structure. Beat the heat: fish dawn and dusk when the density climbs onto the pilings, then chase the deeper channel edges through midday.',
      fall:'Fall is the run — fish feed hard ahead of winter, busting bait on top. Look for birds and breaking fish near the spans; the red zone is wherever the bait is getting crushed.',
      winter:'Winter is lean and deep — most fish have dropped down-bay and the catch-and-release rules tighten. Work the deepest channel edges on the warmest afternoons, or wait for spring.'
    },
    access: [
      ['Sandy Point State Park', 39.012, -76.401],
      ['Matapeake Pier & Ramp', 38.962, -76.358],
      ['Bay Bridge (rockfish structure)', 38.992, -76.388],
      ['Kent Narrows ramp', 38.971, -76.244]
    ],
    spots: [
      { name: 'Bay Bridge pilings & rock piles', note: 'The classic structure bite. Jig or live-line near the pilings at first and last light; troll the channel edges when they slide deep.', chips: ['🔴 dense dawn/dusk','Boat'] },
      { name: 'Sandy Point State Park', note: 'Easiest public access right under the bridge — beach, pier, and ramp near Annapolis. Crowded but productive.', chips: ['Park fee','Shore + ramp'] },
      { name: 'Matapeake Pier (Kent Island)', note: 'Lighted public pier on the main stem; good evening and night bite, plus a nearby ramp for the bridge run.', chips: ['Public pier','Lighted'] }
    ],
    qa: [
      { q: 'Best time of day to fish the Bay Bridge for rockfish?', a: 'Dawn and dusk, hands down. In low light the rockfish push tight to the pilings and onto the shallow flats to feed — that\'s when the density map glows red on the structure. Midday they slide off into the cooler, deeper channel edges, so switch from the pilings to the drops. After dark, fish hold in the light line of the lit spans. Toggle the time buttons on the map to see the shift.' },
      { q: 'Can I catch rockfish from shore near the Bay Bridge?', a: 'Yes — Sandy Point State Park and the Matapeake pier are the two best public shore options. Sandy Point has beach, a pier, and a ramp right under the bridge; Matapeake is a lighted pier that fishes well in the evening and at night. Cast bottom rigs with cut bait or work jigs along the structure on a moving tide.' },
      { q: 'What gear works around the bridge?', a: 'Medium spinning or conventional gear with bottom rigs and cut bait (menhaden/bunker) for bait fishing; jigging spoons and soft-plastic jigs near the pilings; light trolling spreads along the channel edges when the fish go deep. Maryland requires non-offset circle hooks when using bait for striped bass — check the current rule before you go.' },
      { q: 'What are the rockfish rules I can\'t ignore?', a: 'Striped bass (rockfish) have seasonal closures, slot/size limits, creel limits, and circle-hook requirements that change year to year and are strictly enforced on the Bay. This guide points you to where the fish are by time of day — it is not a license to ignore the limits. Verify the current Maryland DNR striped bass regulations before every trip.' }
    ]
  },

  {
    slug: 'susquehanna-flats', cat: 'fish',
    region: 'Upper Bay · MD',
    hubTitle: 'Best Fishing on the Susquehanna Flats in 2027',
    hubBlurb: 'Spring catch-and-release trophy stripers on topwater. Densest at first and last light over the flats.',
    title: 'Best Fishing Spots on the Susquehanna Flats in 2027',
    desc: 'Where to fish the Susquehanna Flats for spring trophy rockfish — a time-of-day density map plus public ramps, topwater tactics, and the catch-and-release rules.',
    dek: 'The Susquehanna Flats at the head of the Bay is the premier <b>spring catch-and-release trophy striped bass</b> fishery — big pre-spawn fish in skinny water eating topwater. The density goes red over the flats at first and last light.',
    quick: 'Big pre-spawn rockfish stage on the <b>Flats in March–early May</b> and crush <b>topwater at dawn and dusk</b> in shallow water; midday they slide to the deeper edges and channel. This is largely a <b>catch-and-release</b> trophy fishery — check the current DNR rules. Crab density is low this far up (fresher water).',
    center: [39.50, -76.08], zoom: 12,
    fish: {
      dawn:    [[39.515,-76.075,1.0],[39.50,-76.095,0.95],[39.49,-76.06,0.85],[39.53,-76.085,0.8],[39.475,-76.075,0.6]],
      morning: [[39.515,-76.075,0.85],[39.50,-76.095,0.75],[39.49,-76.06,0.6]],
      midday:  [[39.465,-76.05,0.8],[39.45,-76.07,0.85],[39.48,-76.03,0.6]],
      dusk:    [[39.515,-76.075,1.0],[39.50,-76.095,0.95],[39.49,-76.06,0.85],[39.53,-76.085,0.75]],
      night:   [[39.50,-76.08,0.45]]
    },
    crab: { dawn:[[39.45,-76.05,0.3]], morning:[[39.45,-76.05,0.3]], midday:[[39.45,-76.05,0.25]], dusk:[[39.45,-76.05,0.25]], night:[[39.45,-76.05,0.2]] },
    bite: {
      dawn:'🔴 Prime topwater. Big stripers up on the flats in the low light.',
      morning:'Still good early; fish start pulling toward the edges as the sun climbs.',
      midday:'Slower — work the deeper flats edges and channel with subsurface baits.',
      dusk:'🔴 Topwater again. Evening light brings the trophies back up shallow.',
      night:'Bite tails off; a few fish hold on the channel edges.'
    },
    seasons: {
      spring:'This is THE window — late March into early May the Flats light up with pre-spawn trophies. Walk topwater at first and last light over the grass and gravel; it\'s catch-and-release, but the size is unreal.',
      summer:'The big fish have run up the river and gone; summer is quieter up here. White perch, smaller stripers, and catfish fill in — for trophy rockfish you\'re better off down-bay.',
      fall:'A few fish filter back to the upper-bay edges in fall, and the perch and catfish bite stays solid. Not the spring show, but the channel edges can surprise you in low light.',
      winter:'Cold and slow at the head of the Bay — most stripers are long gone and the season is closed or strict C&R. This is a spring spot; check back in March.'
    },
    access: [
      ['Jean S. Roberts Memorial Park ramp, Havre de Grace', 39.543, -76.091],
      ['Susquehanna State Park ramp (Lapidum)', 39.609, -76.157],
      ['Flats topwater zone', 39.51, -76.08]
    ],
    spots: [
      { name: 'The Flats (topwater zone)', note: 'Skinny water over grass and gravel at the head of the Bay. Walk topwater plugs and big soft plastics at first and last light for pre-spawn trophies.', chips: ['🔴 trophy C&R','Spring'] },
      { name: 'Channel & flats edges', note: 'When the sun gets high, fish slide to the deeper edges and the old river channel — switch to subsurface swimbaits and jerkbaits.', chips: ['Midday','Boat/kayak'] },
      { name: 'Havre de Grace (Jean Roberts ramp)', note: 'The main public launch for the Flats. Shallow-water boats and kayaks rule up here; the run to the topwater zone is short.', chips: ['Public ramp','Launch'] }
    ],
    qa: [
      { q: 'When is the Susquehanna Flats trophy season?', a: 'The Flats fire in the spring pre-spawn — roughly March into early May — when big striped bass stage in the shallow, warming water at the head of the Bay before running up the Susquehanna. This is a special catch-and-release zone with its own DNR season dates and rules that change each year, so confirm the current regulations before you launch.' },
      { q: 'Why topwater, and when?', a: 'The Flats are shallow — grass, gravel, and skinny water — so big pre-spawn fish feed up top, especially in low light. Walk-the-dog topwater plugs and big soft-plastic paddletails at dawn and dusk are the signature technique. As the sun climbs, the fish pull to the deeper edges and channel; switch to subsurface swimbaits and jerkbaits then.' },
      { q: 'Is this catch-and-release?', a: 'The Susquehanna Flats trophy fishery is largely a catch-and-release season with strict rules — barbless or circle hooks may be required and harvest is typically closed during the spawn window. It exists to protect the spawning stock. Treat it as C&R unless the current Maryland DNR regulations explicitly say otherwise for the dates you\'re fishing.' },
      { q: 'Any crabbing up here?', a: 'Not really — the head of the Bay is much fresher water, so blue crab density is low compared to the mid and lower Bay (the map reflects that). If crabs are the goal, head down to the Choptank, the Patuxent, or Tangier Sound. The Flats are about trophy rockfish, white perch, and (after dark) catfish.' }
    ]
  },

  {
    slug: 'choptank-river', cat: 'crab',
    region: 'Eastern Shore · MD',
    hubTitle: 'Best Blue Crabbing in the Choptank River in 2027',
    hubBlurb: 'Blue-crab country. Dense crab zones up the creeks plus perch, rockfish, and catfish off the public pier.',
    title: 'Best Blue Crabbing Spots in the Choptank River in 2027',
    desc: 'Where to crab the Choptank River around Cambridge — a density map plus the public pier, ramps, gear, and the rules for blue crab, white perch, and rockfish.',
    dek: 'The Choptank is classic Eastern Shore blue-crab country, with a big public fishing pier on top of it. The density map goes red up the creeks and tidal guts where the summer crabs stack out of the main current.',
    quick: 'Blue crabs are <b>thick in the creeks and tidal guts from July to September</b>; the Bill Burton (old Choptank bridge) public pier produces crabs, white perch, rockfish, and catfish without a boat. Crab density is fairly <b>steady through the day</b>, with a red early-morning edge before the boat traffic.',
    center: [38.585, -76.075], zoom: 12,
    crab: {
      dawn:    [[38.585,-76.090,1.0],[38.565,-76.072,0.9],[38.602,-76.098,0.85],[38.55,-76.055,0.8],[38.61,-76.112,0.7]],
      morning: [[38.585,-76.090,0.9],[38.565,-76.072,0.85],[38.602,-76.098,0.8],[38.55,-76.055,0.7]],
      midday:  [[38.585,-76.090,0.8],[38.565,-76.072,0.75],[38.602,-76.098,0.6]],
      dusk:    [[38.585,-76.090,0.9],[38.565,-76.072,0.8],[38.602,-76.098,0.7]],
      night:   [[38.585,-76.090,0.6],[38.565,-76.072,0.5]]
    },
    fish: {
      dawn:[[38.596,-76.078,0.85],[38.58,-76.06,0.6]], morning:[[38.596,-76.078,0.75]],
      midday:[[38.575,-76.05,0.6]], dusk:[[38.596,-76.078,0.8],[38.58,-76.06,0.6]], night:[[38.596,-76.078,0.7]]
    },
    bite: {
      dawn:'🔴 Best crabbing window — work the trotline early before the boat traffic.',
      morning:'Strong crabbing in the creeks; perch and rockfish off the pier.',
      midday:'Crabs hold steady up the guts; fishing slows in the heat.',
      dusk:'Good evening crab pick plus a perch/rockfish bite off the pier.',
      night:'Catfish take over after dark off the pier and channel edges.'
    },
    seasons: {
      spring:'The crabs are just waking up as the water warms through May — light early-season pick, getting better by the week. The white perch run is the early story; crab traps start producing late spring.',
      summer:'Peak crab country. From July the blue crabs stack thick in the side creeks and tidal guts — run a trotline at first light before the boats. This is when the map goes solid red up the creeks.',
      fall:'Fall crabs are heavy and fat before they bury for winter — some of the best eating of the year off the Bill Burton pier and up the guts. The bite tapers as the water cools into November.',
      winter:'Crabs are buried and dormant — crabbing\'s done until spring. The pier still gives up pickerel, perch, and big blue catfish through the cold months if you want to fish.'
    },
    access: [
      ['Bill Burton Fishing Pier State Park', 38.595, -76.075],
      ['Great Marsh Park ramp, Cambridge', 38.585, -76.078],
      ['Choptank River creeks (crab)', 38.57, -76.07]
    ],
    spots: [
      { name: 'Bill Burton Fishing Pier (old Choptank bridge)', note: 'Two long public piers spanning the river — crabs, white perch, rockfish, catfish, and spot, no boat needed. Lighted for night fishing.', chips: ['🔴 dense','Public pier'] },
      { name: 'Tidal creeks & guts', note: 'Run a trotline or drop traps in the side creeks early; this is where the summer crabs stack up out of the main current.', chips: ['🔴 dense Jul–Sep','Boat/kayak'] },
      { name: 'Great Marsh Park, Cambridge', note: 'Public ramp and shoreline access to the lower river — handy launch for the crab run and the perch flats.', chips: ['Public ramp','Shore + launch'] }
    ],
    qa: [
      { q: 'When is the Choptank crabbing best?', a: 'Mid-summer through early fall — roughly July to September, once the water holds above 70°F. The crabs stack in the side creeks and tidal guts out of the main current. Early morning, before the boat traffic and heat, is the best window for a trotline or a set of collapsible traps.' },
      { q: 'Where can I crab without a boat?', a: 'The Bill Burton Fishing Pier State Park (the old Choptank River bridge at Cambridge) is the answer — two long public piers that produce blue crabs, white perch, rockfish, catfish, and spot. Bring collapsible traps or handlines with chicken necks for crabs and bottom rigs for the fish. Maryland lets recreational crabbers use limited handlines/traps without a license, but confirm the current DNR limits.' },
      { q: 'What gear do I need to crab the Choptank?', a: 'For the pier: a few collapsible traps or handlines, chicken necks or razor clams for bait, a long-handled dip net, a catch basket, and a 5" measuring gauge. For a small boat, a trotline with a hand-over-hand or power-pull rig and a bushel basket. Early morning on a moving tide is prime.' },
      { q: 'What crab rules apply on the Choptank?', a: 'Maryland crab rules — 5" hard-crab minimum, no egg-bearing "sponge" females, and recreational gear/license limits — all apply and change yearly. There are seasonal start/end dates too. Verify the current Maryland DNR crabbing regulations before you head out; this guide shows where the crabs are, not a pass on the limits.' }
    ]
  },

  {
    slug: 'tangier-sound', cat: 'crab',
    region: 'Lower Bay · MD',
    hubTitle: 'Best Blue Crabbing in Tangier Sound in 2027',
    hubBlurb: 'The lower Bay\'s premier blue-crab water — dense summer zones over the grass flats and channel edges.',
    title: 'Best Blue Crabbing Spots in Tangier Sound in 2027',
    desc: 'Where to crab Tangier Sound in the lower Chesapeake — a density map of the grass flats and channel edges, plus public ramps, gear, and the rules.',
    dek: 'Tangier Sound and the lower Bay around Crisfield are the heart of Maryland blue-crab country. The density map runs red over the grass flats and channel edges through the summer — this is where the watermen work for a reason.',
    quick: 'Blue crabs are <b>densest over the grass flats and channel edges from June into October</b>, with the lower Sound around Crisfield and the Smith/Tangier island flats holding the best summer numbers. Run a trotline or traps early; the crabs hold all day but the morning pick is reddest.',
    center: [37.98, -75.94], zoom: 11,
    crab: {
      dawn:    [[37.99,-75.95,1.0],[37.96,-75.99,0.95],[38.03,-75.90,0.9],[37.92,-75.96,0.85],[38.05,-75.98,0.8],[37.88,-75.90,0.75]],
      morning: [[37.99,-75.95,0.95],[37.96,-75.99,0.9],[38.03,-75.90,0.85],[37.92,-75.96,0.8],[38.05,-75.98,0.75]],
      midday:  [[37.99,-75.95,0.85],[37.96,-75.99,0.8],[38.03,-75.90,0.75],[37.92,-75.96,0.7]],
      dusk:    [[37.99,-75.95,0.9],[37.96,-75.99,0.85],[38.03,-75.90,0.8],[37.92,-75.96,0.75]],
      night:   [[37.99,-75.95,0.6],[37.96,-75.99,0.55]]
    },
    fish: {
      dawn:[[37.95,-75.91,0.75],[38.02,-75.86,0.65]], morning:[[37.95,-75.91,0.65]],
      midday:[[37.93,-75.88,0.6]], dusk:[[37.95,-75.91,0.7],[38.02,-75.86,0.6]], night:[[37.95,-75.91,0.55]]
    },
    bite: {
      dawn:'🔴 Prime. Crabs spread over the grass flats; run the trotline at first light.',
      morning:'Strong all over the Sound — flats and channel edges both producing.',
      midday:'Crabs hold; work the deeper edges as the flats warm.',
      dusk:'Good evening pick over the flats before the tide change.',
      night:'Quieter for crabs; speckled trout and rockfish work the edges after dark.'
    },
    seasons: {
      spring:'Early season builds through May — the first good trotline pick comes as the water warms over the grass. Peelers and soft crabs are the lower-Bay specialty this time of year around Crisfield.',
      summer:'Peak. From June into September Tangier Sound is as dense as Maryland crabbing gets — the grass flats and channel edges run solid red. Run a trotline early and you\'ll fill a bushel before the heat.',
      fall:'Fall crabs are heavy and prime right into October before they migrate deep and bury. The lower Bay holds them later than up north — some of the best eating crabs of the year come out of the Sound now.',
      winter:'The crabs have buried in the deep mud of the Sound for winter and crabbing is closed. The lower Bay turns to rockfish and speckled trout along the edges until spring warms the flats again.'
    },
    access: [
      ['Somers Cove Marina ramp, Crisfield', 37.978, -75.860],
      ['Jenkins Creek ramp', 38.045, -75.860],
      ['Tangier Sound grass flats', 37.98, -75.95]
    ],
    spots: [
      { name: 'Tangier Sound grass flats', note: 'The signature blue-crab water — broad eelgrass flats that hold crabs all summer. Run a baited trotline at first light for the heaviest pick.', chips: ['🔴 dense Jun–Oct','Trotline'] },
      { name: 'Channel edges off Crisfield', note: 'When the flats warm, the crabs slide to the deeper channel edges. Drop traps or run the line along the drop-offs.', chips: ['🔴 dense','Boat'] },
      { name: 'Somers Cove / Crisfield ramps', note: 'Public launches in the self-styled "Crab Capital of the World." Short runs to the flats and the island waters.', chips: ['Public ramp','Launch'] }
    ],
    qa: [
      { q: 'Why is Tangier Sound such good crabbing?', a: 'The lower Chesapeake around Tangier Sound, Smith Island, and Crisfield has broad, shallow eelgrass flats and a maze of channel edges — ideal blue-crab habitat with warm, salty water that crabs love. It\'s the heart of Maryland\'s commercial crab fishery for a reason, and recreational crabbers ride the same abundance from June into October.' },
      { q: 'When and how should I crab the Sound?', a: 'June through September is peak. Run a baited trotline (razor clams or bull lips) over the grass flats at first light for the heaviest pick, before the heat and the wind. Collapsible traps and dip-netting work too. As the flats warm through the day, slide to the deeper channel edges where the crabs hold cooler.' },
      { q: 'Where can I launch near Crisfield?', a: 'Somers Cove Marina in Crisfield and the Jenkins Creek ramp are the main public launches, with short runs out to the Sound\'s flats and the waters around Smith and Tangier islands. Crisfield bills itself as the "Crab Capital of the World," and the access reflects it.' },
      { q: 'What rules apply to crabbing Tangier Sound?', a: 'Standard Maryland recreational crab rules apply — 5" hard-crab minimum, no egg-bearing "sponge" females, gear and license limits, and seasonal dates — and they change year to year. The lower Bay also has specific peeler/soft-crab rules. Always verify the current Maryland DNR crabbing regulations before you set a line.' }
    ]
  }
];
