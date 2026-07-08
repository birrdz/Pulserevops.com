// 10 SPECIFIC Chesapeake Bay blue-crab areas — each map is zoomed to its own river
// or sub-area (not the whole Bay). Coordinates are approximate REAL public access +
// open-water zones; crab density is ILLUSTRATIVE of typical seasonal patterns (the
// page disclaims this). cat:'crab'. Titles end "in 2027".
function days(zones, prof) {
  var o = {};
  Object.keys(prof).forEach(function (t) {
    o[t] = zones.map(function (z) { return [z[0], z[1], Math.round(Math.min(1, z[2] * prof[t]) * 100) / 100]; });
  });
  return o;
}
var CRAB = { dawn: 1.0, morning: 0.92, midday: 0.8, dusk: 0.85, night: 0.55 };
var FISH = { dawn: 0.8, morning: 0.65, midday: 0.55, dusk: 0.8, night: 0.6 };
// Per-time crab density that visibly MOVES with the tide/time of day while staying ON the
// water: tight on the shallow creek mouths at dawn/dusk, slid out to the deeper channel
// edges midday, sparse at night. Small (~0.3 mi) nudges keep every blob on the same water.
function crabDays(zones) {
  function v(dLat, dLng, mult, take) {
    return zones.slice(0, take).map(function (z) {
      return [Math.round((z[0] + dLat) * 1e5) / 1e5, Math.round((z[1] + dLng) * 1e5) / 1e5, Math.round(Math.min(1, z[2] * mult) * 100) / 100];
    });
  }
  var n = zones.length;
  return {
    dawn:    v( 0.003,  0.002, 1.00, n),
    morning: v( 0.001, -0.003, 0.92, n),
    midday:  v(-0.004,  0.004, 0.82, Math.max(2, n - 1)),
    dusk:    v( 0.004, -0.001, 0.95, n),
    night:   v(-0.003,  0.005, 0.60, Math.max(1, n - 2))
  };
}
function bite() {
  return {
    dawn: '🔴 Best crabbing window — run the trotline early, before the boat traffic.',
    morning: 'Strong in the creeks and channel edges; perch off the points.',
    midday: 'Crabs hold steady; work the deeper edges as the shallows warm.',
    dusk: 'Good evening pick before the tide change.',
    night: 'Quieter for crabs; catfish and perch take over after dark.'
  };
}
function seasons(area) {
  return {
    spring: 'The ' + area + ' crabs wake up as the water warms through May — a light early pick that builds week by week. The white perch run comes first; traps and trotlines start producing by late spring.',
    summer: 'Peak. From July the blue crabs stack in the ' + area + '’s creeks and channel edges, out of the current — run a trotline at first light before the heat and the boats. This is when the map goes solid red.',
    fall: 'Fall crabs are heavy and fat before they bury for winter — some of the best eating of the year on the ' + area + '. The bite tapers as the water cools through November.',
    winter: 'Crabs are buried and dormant in the deep mud — crabbing’s done until spring. The ' + area + ' still gives up pickerel, white perch, and blue catfish through the cold if you want to fish.'
  };
}
function qa(area, access) {
  return [
    { q: 'When is the ' + area + ' crabbing best?', a: 'Mid-summer through early fall — roughly July to September, once the water holds above 70°F. The crabs stack in the side creeks and along the channel edges, out of the main current. Early morning, before the boat traffic and the heat, is the prime window for a trotline or a set of collapsible traps.' },
    { q: 'Where can I crab the ' + area + ' without a boat?', a: 'Public shoreline and pier access is your friend — ' + access + ' is the main public launch/landing here, and many of the ' + area + '’s county landings and piers allow recreational crabbing with handlines or collapsible traps. Bring chicken necks or razor clams, a long-handled dip net, a catch basket, and a 5″ gauge.' },
    { q: 'What crab rules apply on the ' + area + '?', a: 'Standard Maryland recreational crab rules apply and change year to year: 5″ hard-crab minimum, no egg-bearing “sponge” females, recreational gear and license limits, and seasonal start/end dates. This guide shows where the crabs typically are — it is not a pass on the limits. Always verify the current Maryland DNR crabbing regulations before you set a line.' }
  ];
}
function mk(o) {
  var loc = /River/.test(o.name) ? 'the ' + o.name : o.name;
  return {
    slug: o.slug, cat: 'crab', region: o.region,
    hubTitle: 'Best Blue Crabbing in ' + loc + ' in 2027',
    hubBlurb: o.blurb,
    title: 'Best Blue Crabbing Spots in ' + loc + ' in 2027',
    desc: 'Where to crab the ' + o.name + ' in the Chesapeake Bay — a density map of the creeks and channel edges scoped to this area, plus public access, gear, and the rules.',
    dek: 'Blue-crab hot spots scoped to the <b>' + o.name + '</b> — not the whole Bay. The density map runs red where the crabs stack in this area’s creeks and channel edges through the summer.',
    quick: 'On the ' + o.name + ', blue crabs are <b>densest in the creek mouths and channel edges from July into October</b>. Run a trotline or traps early; the crabs hold through the day but the morning pick is reddest. Best public access: ' + o.access[0][0] + '.',
    center: o.center, zoom: o.zoom || 13,
    crab: crabDays(o.zones),
    fish: days(o.fishZones || [[o.center[0], o.center[1], 0.6]], FISH),
    bite: bite(), seasons: seasons(o.name),
    access: o.access,
    spots: o.spots,
    qa: qa(o.name, o.access[0][0])
  };
}

module.exports = [
  mk({
    slug: 'magothy-river', name: 'Magothy River', region: 'Anne Arundel · MD', center: [39.065, -76.49], zoom: 13,
    blurb: 'Creek-mouth crabbing close to Baltimore — dense summer pick up the coves out of the current.',
    zones: [[39.065, -76.49, 1.0], [39.055, -76.47, 0.9], [39.078, -76.50, 0.85], [39.05, -76.51, 0.8]],
    fishZones: [[39.06, -76.49, 0.6], [39.07, -76.50, 0.55]],
    access: [['Beachwood Park ramp (Pasadena)', 39.083, -76.495], ['Magothy creek mouths', 39.06, -76.48]],
    spots: [
      { name: 'Cove & creek mouths', note: 'Cypress, Cockey, and Forked creeks dump into the river — crabs stack at the mouths on a moving tide. Run a short trotline early.', chips: ['🔴 dense Jul–Sep', 'Trotline'] },
      { name: 'Main-stem channel edges', note: 'When the coves warm, slide to the deeper river channel edges and drop traps along the drop-offs.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Beachwood Park (Pasadena)', note: 'Public county ramp with a short run to the best coves — the easiest launch on the river.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'severn-river', name: 'Severn River', region: 'Annapolis · MD', center: [39.03, -76.52], zoom: 13,
    blurb: 'Annapolis’ home river — crab the creeks and the deeper bends below the Naval Academy bridge.',
    zones: [[39.03, -76.52, 1.0], [39.045, -76.54, 0.9], [39.015, -76.50, 0.85], [39.05, -76.56, 0.75]],
    fishZones: [[39.0, -76.49, 0.6]],
    access: [['Jonas Green Park (Annapolis)', 39.004, -76.490], ['Severn creeks (Round Bay)', 39.05, -76.56]],
    spots: [
      { name: 'Round Bay & the upper creeks', note: 'The wide water at Round Bay and the creeks above it (Chase, Maynadier) hold the densest summer crabs out of the boat traffic.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'Below the Naval Academy bridge', note: 'Deeper channel edges near the bridge and Greenbury Point — work traps on the drop-offs.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Jonas Green Park', note: 'Public ramp and shore access right under the Rt-450 bridge — the main public launch on the Severn.', chips: ['Public ramp', 'Shore + launch'] }
    ]
  }),
  mk({
    slug: 'south-river', name: 'South River', region: 'Edgewater · MD', center: [38.93, -76.53], zoom: 13,
    blurb: 'Edgewater’s broad river — dense crabbing in Selby Bay and the creek mouths all summer.',
    zones: [[38.93, -76.53, 1.0], [38.92, -76.50, 0.9], [38.945, -76.55, 0.85], [38.91, -76.49, 0.8]],
    fishZones: [[38.93, -76.49, 0.6]],
    access: [['Mayo Beach Park / Selby Bay', 38.885, -76.512], ['South River creek mouths', 38.93, -76.52]],
    spots: [
      { name: 'Selby Bay & Crab Creek', note: 'The shallow bay and creek mouths off the lower river are the classic crab water — trotline them at first light.', chips: ['🔴 dense Jul–Sep', 'Trotline'] },
      { name: 'Main-stem channel edges', note: 'Drop traps along the river’s deeper edges as the shallows heat up midday.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Mayo Beach Park (Selby Bay)', note: 'Public county park access near the river mouth — short run to the crab water.', chips: ['Public access', 'Launch'] }
    ]
  }),
  mk({
    slug: 'patuxent-river-solomons', name: 'Patuxent River', region: 'Solomons · MD', center: [38.34, -76.47], zoom: 12,
    blurb: 'Solomons’ big river — sheltered creek crabbing plus heavy channel-edge crabs near the mouth.',
    zones: [[38.34, -76.47, 1.0], [38.36, -76.49, 0.95], [38.31, -76.45, 0.9], [38.40, -76.52, 0.8], [38.33, -76.43, 0.75]],
    fishZones: [[38.32, -76.45, 0.7], [38.31, -76.44, 0.6]],
    access: [['Solomons public ramp', 38.319, -76.457], ['Benedict public landing', 38.51, -76.68]],
    spots: [
      { name: 'St. Leonard & Mill creeks', note: 'The sheltered creeks off the lower Patuxent hold dense summer crabs out of the current — prime trotline water.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'River mouth channel edges', note: 'Heavy crabs along the deeper edges near Solomons and the gas docks; rockfish work the same structure.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Solomons public ramp', note: 'Main public launch at the river mouth — short runs to both the creeks and the channel edges.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'eastern-bay', name: 'Eastern Bay', region: 'Kent Island · MD', center: [38.87, -76.22], zoom: 12,
    blurb: 'The broad water behind Kent Island — dense crabbing over the flats and into the Wye & Miles mouths.',
    zones: [[38.87, -76.22, 1.0], [38.90, -76.25, 0.9], [38.84, -76.20, 0.9], [38.92, -76.30, 0.8], [38.83, -76.27, 0.75]],
    fishZones: [[38.91, -76.24, 0.65]],
    access: [['Romancoke Pier (Kent Island)', 38.907, -76.227], ['Kent Narrows ramp', 38.971, -76.244]],
    spots: [
      { name: 'Romancoke & the Kent Island flats', note: 'The shallow grass flats behind Kent Island are dense crab water — the Romancoke public pier lets you crab without a boat.', chips: ['🔴 dense', 'Pier + boat'] },
      { name: 'Wye & Miles river mouths', note: 'Where the rivers empty into Eastern Bay the crabs stack on the edges — run a trotline early.', chips: ['🔴 dense Jul–Sep', 'Trotline'] },
      { name: 'Kent Narrows', note: 'Public ramps and a current-swept channel that funnels crabs and fish — busy but productive.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'chester-river', name: 'Chester River', region: 'Rock Hall · MD', center: [39.18, -76.18], zoom: 12,
    blurb: 'Upper Eastern Shore — dense crabbing from Rock Hall up to Chestertown’s creek mouths.',
    zones: [[39.18, -76.18, 1.0], [39.21, -76.14, 0.9], [39.14, -76.22, 0.9], [39.25, -76.10, 0.8]],
    fishZones: [[39.16, -76.20, 0.6]],
    access: [['Rock Hall public ramp', 39.140, -76.245], ['Chestertown waterfront ramp', 39.207, -76.066]],
    spots: [
      { name: 'Rock Hall & the lower river', note: 'Broad, salty lower-river water with strong summer crab numbers — trotline the channel edges out of Rock Hall.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'Creek mouths toward Chestertown', note: 'The side creeks up the river hold crabs out of the current — traps on a moving tide.', chips: ['🔴 dense Jul–Sep', 'Boat'] },
      { name: 'Rock Hall public ramp', note: 'The main public launch on the lower Chester — a short run to the best crab water.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'miles-river', name: 'Miles River', region: 'St. Michaels · MD', center: [38.82, -76.20], zoom: 13,
    blurb: 'St. Michaels’ home river — sheltered creek crabbing and dense edges down toward Eastern Bay.',
    zones: [[38.82, -76.20, 1.0], [38.80, -76.22, 0.9], [38.85, -76.18, 0.85], [38.78, -76.24, 0.8]],
    fishZones: [[38.81, -76.21, 0.6]],
    access: [['St. Michaels public ramp', 38.786, -76.222], ['Miles River creek mouths', 38.82, -76.19]],
    spots: [
      { name: 'San Domingo & the town creeks', note: 'The sheltered creeks around St. Michaels hold crabs out of the wind — classic trotline water at first light.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'Lower-river edges toward Eastern Bay', note: 'As the river widens toward Eastern Bay the channel edges fill with summer crabs — drop traps on the drop-offs.', chips: ['🔴 dense', 'Boat'] },
      { name: 'St. Michaels public ramp', note: 'Public launch in town — a short run to the creeks and the lower river.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'honga-river', name: 'Honga River', region: 'Dorchester · MD', center: [38.27, -76.20], zoom: 12,
    blurb: 'Hoopers Island marsh country — some of the densest lower-Eastern-Shore crab water there is.',
    zones: [[38.27, -76.20, 1.0], [38.24, -76.22, 0.95], [38.30, -76.18, 0.9], [38.22, -76.25, 0.85], [38.32, -76.21, 0.8]],
    fishZones: [[38.25, -76.19, 0.65]],
    access: [['Hoopers Island public ramp', 38.256, -76.250], ['Fishing Creek landing', 38.31, -76.21]],
    spots: [
      { name: 'The marsh guts & creek mouths', note: 'The Honga is a maze of marsh guts dumping into the river — prime, dense crab water that the watermen work hard. Trotline the guts early.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'River channel edges', note: 'Heavy crabs along the deeper edges between Hoopers Island and the main river — traps on the drop-offs.', chips: ['🔴 dense Jun–Oct', 'Boat'] },
      { name: 'Hoopers Island ramp', note: 'Public launch deep in the marsh — short runs to the guts and the river.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'nanticoke-river', name: 'Nanticoke River', region: 'Dorchester · MD', center: [38.30, -75.92], zoom: 12,
    blurb: 'A broad lower-Shore river — dense brackish crabbing from Vienna down toward the Sound.',
    zones: [[38.30, -75.92, 1.0], [38.27, -75.90, 0.9], [38.33, -75.94, 0.85], [38.24, -75.88, 0.8]],
    fishZones: [[38.29, -75.91, 0.65]],
    access: [['Vienna public landing', 38.484, -75.825], ['Nanticoke creek mouths', 38.28, -75.90]],
    spots: [
      { name: 'Creek mouths & guts', note: 'The side creeks and marsh guts off the lower Nanticoke stack crabs out of the current — trotline them on a moving tide.', chips: ['🔴 dense', 'Trotline'] },
      { name: 'Main-stem channel edges', note: 'The broad river’s deeper edges hold heavy summer crabs — drop traps along the drop-offs.', chips: ['🔴 dense Jul–Sep', 'Boat'] },
      { name: 'Vienna public landing', note: 'Public ramp on the river at Vienna — a working launch into the crab water.', chips: ['Public ramp', 'Launch'] }
    ]
  }),
  mk({
    slug: 'sassafras-river', name: 'Sassafras River', region: 'Upper Bay · MD', center: [39.37, -75.99], zoom: 12,
    blurb: 'A scenic upper-Bay river — lighter, fresher crabbing best in the warm months toward the mouth.',
    zones: [[39.37, -75.99, 0.85], [39.36, -76.02, 0.8], [39.38, -75.95, 0.75], [39.355, -76.05, 0.7]],
    fishZones: [[39.36, -76.0, 0.7], [39.37, -75.98, 0.6]],
    access: [['Georgetown public ramp', 39.366, -75.884], ['Betterton Beach (mouth)', 39.367, -76.063]],
    spots: [
      { name: 'River mouth toward Betterton', note: 'The saltier water near the mouth holds the better crab numbers up here — work the edges and the bar off Betterton.', chips: ['🟡 good, fresher', 'Boat'] },
      { name: 'Mid-river coves', note: 'The coves and creek mouths give up a steady summer pick — lighter than the salty lower Bay but solid on a good tide.', chips: ['🟡 good Jul–Sep', 'Trotline'] },
      { name: 'Georgetown / Betterton access', note: 'Public ramp at Georgetown and beach access at Betterton at the mouth — two ends of the river to launch from.', chips: ['Public ramp', 'Shore + launch'] }
    ]
  })
];
