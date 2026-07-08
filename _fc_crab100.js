// ~90 blue-crab areas in the CHESAPEAKE BAY + surrounding waters (MD / VA / Delmarva /
// Delaware Bay). Each map is scoped to its own river, creek, or sub-bay. Coordinates
// are approximate centers of REAL crabbing waters; density is ILLUSTRATIVE seasonal
// pattern (page disclaims it); access is described generically (verify locally).
// cat:'crab'. Chesapeake = cold-water seasonal crabbing (peak Jul–Oct). Titles end 2027.
function days(zones, prof) {
  var o = {};
  Object.keys(prof).forEach(function (t) { o[t] = zones.map(function (z) { return [z[0], z[1], Math.round(Math.min(1, z[2] * prof[t]) * 100) / 100]; }); });
  return o;
}
var CRAB = { dawn: 1.0, morning: 0.92, midday: 0.8, dusk: 0.85, night: 0.55 };
var FISH = { dawn: 0.7, morning: 0.6, midday: 0.5, dusk: 0.7, night: 0.55 };
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
    morning: 'Strong in the creeks and channel edges out of the current.',
    midday: 'Crabs hold steady; work the deeper edges as the shallows warm.',
    dusk: 'Good evening pick before the tide change.',
    night: 'Quieter for crabs; perch and catfish take over the edges after dark.'
  };
}
function seasons(a) {
  return {
    spring: 'The ' + a + ' crabs wake up as the water warms through May — a light early pick that builds week by week. The white perch run comes first; traps and trotlines start producing by late spring.',
    summer: 'Peak. From July the blue crabs stack in the ' + a + '’s creeks and channel edges, out of the current — run a trotline at first light before the heat and boats. This is when the map runs solid red.',
    fall: 'Fall crabs are heavy and fat before they bury for winter — some of the best eating of the year on the ' + a + '. The bite tapers as the water cools through November.',
    winter: 'Crabs are buried and dormant in the cold mud — crabbing’s done until spring. The ' + a + ' still gives up pickerel, white perch, and blue catfish through the cold months if you want bent rods.'
  };
}
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
var STATE = { MD: 'Maryland', VA: 'Virginia', DE: 'Delaware' };

// [name, state, lat, lng, zoom]  — Chesapeake Bay + surrounding waters only
var AREAS = [
  // ── MD Western Shore ──
  ['West River', 'MD', 38.86, -76.53, 13], ['Rhode River', 'MD', 38.88, -76.53, 13], ['Bodkin Creek', 'MD', 39.13, -76.43, 13],
  ['Stony Creek', 'MD', 39.16, -76.49, 14], ['Rock Creek', 'MD', 39.15, -76.52, 14], ['Bear Creek', 'MD', 39.25, -76.50, 14],
  ['Patapsco River', 'MD', 39.22, -76.52, 12], ['Middle River', 'MD', 39.30, -76.40, 13], ['Back River', 'MD', 39.27, -76.41, 13],
  ['Gunpowder River', 'MD', 39.37, -76.29, 12], ['Bush River', 'MD', 39.42, -76.25, 12], ['St. Leonard Creek', 'MD', 38.40, -76.51, 13],
  ['Battle Creek', 'MD', 38.46, -76.58, 13], ['Breton Bay', 'MD', 38.30, -76.62, 12], ['St. Clements Bay', 'MD', 38.27, -76.73, 13],
  ['St. Marys River', 'MD', 38.18, -76.43, 12], ['Smith Creek', 'MD', 38.13, -76.42, 13], ['Herring Bay', 'MD', 38.74, -76.53, 12],
  ['Parkers Creek', 'MD', 38.55, -76.52, 14], ['Wicomico River (St. Marys)', 'MD', 38.27, -76.83, 12],
  // ── MD Upper Bay ──
  ['Northeast River', 'MD', 39.55, -75.95, 12], ['Elk River', 'MD', 39.46, -75.92, 12], ['Bohemia River', 'MD', 39.47, -75.91, 13],
  ['Worton Creek', 'MD', 39.30, -76.18, 13], ['Fairlee Creek', 'MD', 39.27, -76.20, 14], ['Swan Creek', 'MD', 39.15, -76.25, 13],
  ['Still Pond', 'MD', 39.32, -76.13, 13],
  // ── MD Eastern Shore ──
  ['Corsica River', 'MD', 39.05, -76.10, 13], ['Wye River', 'MD', 38.86, -76.13, 13], ['Tred Avon River', 'MD', 38.69, -76.17, 13],
  ['Harris Creek', 'MD', 38.72, -76.30, 13], ['Broad Creek', 'MD', 38.74, -76.25, 13], ['Little Choptank River', 'MD', 38.55, -76.32, 12],
  ['Fishing Bay', 'MD', 38.30, -76.05, 12], ['Wicomico River (Salisbury)', 'MD', 38.30, -75.72, 12], ['Manokin River', 'MD', 38.07, -75.83, 12],
  ['Big Annemessex River', 'MD', 38.12, -75.83, 13], ['Pocomoke Sound', 'MD', 37.96, -75.76, 11], ['Pocomoke River', 'MD', 38.05, -75.57, 12],
  ['Kent Narrows', 'MD', 38.97, -76.24, 13], ['Eastern Neck', 'MD', 39.03, -76.23, 12], ['Transquaking River', 'MD', 38.43, -76.05, 13],
  // ── MD Coastal Bays (surrounding) ──
  ['Sinepuxent Bay', 'MD', 38.28, -75.13, 12], ['Isle of Wight Bay', 'MD', 38.40, -75.08, 12], ['Assawoman Bay', 'MD', 38.40, -75.06, 12],
  ['Newport Bay', 'MD', 38.25, -75.18, 13], ['Chincoteague Bay', 'MD', 38.05, -75.30, 11],
  // ── VA Chesapeake ──
  ['Lower Potomac River', 'VA', 38.10, -76.65, 11], ['Yeocomico River', 'VA', 38.03, -76.55, 13], ['Coan River', 'VA', 37.99, -76.46, 13],
  ['Great Wicomico River', 'VA', 37.80, -76.30, 12], ['Corrotoman River', 'VA', 37.70, -76.40, 13], ['Rappahannock River', 'VA', 37.60, -76.45, 11],
  ['Piankatank River', 'VA', 37.50, -76.32, 12], ['York River', 'VA', 37.25, -76.50, 11], ['Poquoson Flats', 'VA', 37.12, -76.30, 12],
  ['Mobjack Bay', 'VA', 37.36, -76.40, 12], ['Ware River', 'VA', 37.40, -76.45, 13], ['North River (VA)', 'VA', 37.43, -76.43, 13],
  ['East River (VA)', 'VA', 37.45, -76.40, 13], ['James River', 'VA', 37.10, -76.55, 11], ['Elizabeth River', 'VA', 36.85, -76.30, 12],
  ['Lynnhaven River', 'VA', 36.90, -76.08, 13], ['Hampton Back River', 'VA', 37.10, -76.30, 13], ['Mathews County', 'VA', 37.43, -76.32, 12],
  ['Gwynns Island', 'VA', 37.50, -76.28, 13], ['Onancock Creek', 'VA', 37.71, -75.75, 13], ['Pungoteague Creek', 'VA', 37.62, -75.85, 13],
  ['Occohannock Creek', 'VA', 37.50, -75.90, 13], ['Nassawadox Creek', 'VA', 37.45, -75.92, 13], ['Cherrystone Creek', 'VA', 37.28, -75.97, 13],
  ['Hungars Creek', 'VA', 37.37, -75.93, 13], ['Cape Charles', 'VA', 37.27, -76.02, 12], ['Magothy Bay (VA)', 'VA', 37.20, -75.95, 12],
  ['Hog Island Bay', 'VA', 37.45, -75.70, 12], ['Wachapreague', 'VA', 37.61, -75.69, 12], ['Pocomoke Sound (VA)', 'VA', 37.85, -75.70, 11],
  ['Mattaponi River', 'VA', 37.55, -76.80, 12], ['Pamunkey River', 'VA', 37.55, -77.00, 12], ['Severn River (VA)', 'VA', 37.35, -76.45, 13],
  // ── DE / Delaware Bay (surrounding) ──
  ['Delaware Bay (Bowers Beach)', 'DE', 39.06, -75.40, 11], ['Indian River Bay', 'DE', 38.60, -75.10, 12], ['Rehoboth Bay', 'DE', 38.66, -75.08, 12],
  ['Little Assawoman Bay', 'DE', 38.52, -75.07, 13], ['Broadkill (Lewes)', 'DE', 38.78, -75.16, 12], ['Murderkill River', 'DE', 39.08, -75.42, 13],
  ['Mispillion River', 'DE', 38.95, -75.32, 13]
];

module.exports = AREAS.map(function (a) {
  var name = a[0], st = a[1], lat = a[2], lng = a[3], zoom = a[4];
  var region = STATE[st] + (st === 'DE' ? ' · Delaware Bay' : ' · Chesapeake');
  // Tight cluster around the named water's center (≈0.6 mi) so the density glow stays
  // ON the water and doesn't bleed onto shore when you zoom in close. Density is still
  // illustrative (the page disclaims it) — not surveyed GPS marks.
  var zones = [[lat, lng, 1.0], [lat + 0.011, lng + 0.009, 0.85], [lat - 0.009, lng - 0.011, 0.8], [lat + 0.004, lng - 0.013, 0.7]];
  var loc = /River|Creek/.test(name) ? 'the ' + name : name;
  var wtype = /Creek/.test(name) ? 'creek' : /River/.test(name) ? 'river' : /Sound/.test(name) ? 'sound' : 'bay';
  return {
    slug: slugify(name) + '-' + st.toLowerCase(), cat: 'crab', region: region, wtype: wtype, ll: [lat, lng],
    hubTitle: 'Best Blue Crabbing in ' + loc + ' in 2027',
    hubBlurb: 'Blue-crab density scoped to ' + loc + ' (' + STATE[st] + ') — creek mouths and channel edges by time of day.',
    title: 'Best Blue Crabbing Spots in ' + loc + ' in 2027',
    desc: 'Where to crab ' + loc + ' (' + STATE[st] + ', Chesapeake Bay) — an interactive density map scoped to this ' + wtype + ', plus public access, gear, what else bites, and the rules.',
    dek: 'Blue-crab hot spots scoped to <b>' + loc + '</b> in the ' + STATE[st] + ' part of the Chesapeake. The density map runs red where the crabs stack in this ' + wtype + '’s creek mouths and channel edges.',
    quick: 'On ' + loc + ', blue crabs hold <b>densest in the ' + (wtype === 'creek' ? 'creek and its feeder guts' : wtype + ' mouths and channel edges') + '</b>, out of the current. Run a trotline or traps early — the morning pick is reddest. Peak is <b>July into October</b> once the water tops 70°F.',
    center: [lat, lng], zoom: zoom,
    crab: crabDays(zones), fish: days([[lat, lng, 0.55]], FISH),
    bite: bite(), seasons: seasons(loc),
    access: [['Public ramps & piers around ' + name, lat, lng]],
    spots: [
      { name: 'Creek mouths & guts', note: 'The side creeks and marsh guts off ' + loc + ' stack crabs out of the current — trotline them on a moving tide at first light for the heaviest pick.', chips: ['🔴 dense Jul–Oct', 'Trotline'] },
      { name: 'Channel edges', note: 'When the shallows warm through midday, the crabs slide to the deeper channel edges — drop collapsible traps along the drop-offs.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Public access around ' + name, note: 'Public ramps, piers, and county landings around the ' + wtype + ' put you on the crab water — confirm where access and crabbing are allowed locally before you go.', chips: ['Public access', 'Verify locally'] }
    ],
    qa: [
      { q: 'When is the ' + loc + ' crabbing best?', a: 'Mid-summer through early fall — roughly July to September, occasionally into October on the lower Bay, once the water holds above 70°F. The crabs stack in the side creeks and along the ' + wtype + '’s channel edges, out of the main current. Early morning, before the boat traffic and heat, is the prime window for a trotline or a set of collapsible traps.' },
      { q: 'Where can I crab ' + loc + ' without a boat?', a: 'Public ramps, piers, and shoreline landings around the area let you crab without a boat — drop collapsible traps or run a handline with chicken necks off a public pier or bulkhead on a moving tide. Bring a long-handled dip net, a catch basket, and a 5″ gauge. Always confirm where public access and recreational crabbing are actually allowed.' },
      { q: 'What else will I catch on ' + loc + '?', a: 'Besides blue crabs, ' + (st === 'VA' ? 'the Virginia tributaries hold croaker, spot, white perch, speckled trout, and flounder near the mouths' : 'Maryland and Delaware waters give up white perch, spot, rockfish on the channel edges, and big blue catfish after dark (an invasive species you can keep freely)') + '. A simple bottom rig with bloodworm or cut bait covers most of it while your crab traps soak.' },
      { q: 'What are the crab rules here?', a: 'Crabbing rules — 5″ hard-crab minimum, no egg-bearing “sponge” females, recreational gear and license limits, and seasonal start/end dates — are set by ' + STATE[st] + ' and change year to year. This guide shows where the crabs typically are, not a pass on the limits. Always verify the current ' + STATE[st] + ' DNR/Marine Resources crabbing regulations before you set a line.' }
    ]
  };
});
