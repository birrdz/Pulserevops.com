// Micro-landmark blue-crab spots — the granular "by the Bay Bridge / by the Naval
// Academy / Sandy Point Beach / Conquest Beach" variations to corner SEO. Real public
// Chesapeake crabbing landmarks. Coordinates approximate; density illustrative; access
// generic (verify locally). cat:'crab'. Titles end 2027.
function days(zones, prof) { var o = {}; Object.keys(prof).forEach(function (t) { o[t] = zones.map(function (z) { return [z[0], z[1], Math.round(Math.min(1, z[2] * prof[t]) * 100) / 100]; }); }); return o; }
var CRAB = { dawn: 1.0, morning: 0.92, midday: 0.8, dusk: 0.85, night: 0.55 };
var FISH = { dawn: 0.7, morning: 0.6, midday: 0.5, dusk: 0.7, night: 0.55 };
// Per-time crab density that visibly MOVES with time of day while staying ON the water.
function crabDays(zones) {
  function v(dLat, dLng, mult, take) { return zones.slice(0, take).map(function (z) { return [Math.round((z[0] + dLat) * 1e5) / 1e5, Math.round((z[1] + dLng) * 1e5) / 1e5, Math.round(Math.min(1, z[2] * mult) * 100) / 100]; }); }
  var n = zones.length;
  return { dawn: v(0.003, 0.002, 1.00, n), morning: v(0.001, -0.003, 0.92, n), midday: v(-0.004, 0.004, 0.82, Math.max(2, n - 1)), dusk: v(0.004, -0.001, 0.95, n), night: v(-0.003, 0.005, 0.60, Math.max(1, n - 2)) };
}
function bite() {
  return { dawn: '🔴 Best crabbing window — get on it early, before the boat traffic.', morning: 'Strong along the edges and structure out of the current.', midday: 'Crabs hold steady; work the deeper edges as the shallows warm.', dusk: 'Good evening pick before the tide change.', night: 'Quieter for crabs; perch and catfish take the edges after dark.' };
}
function seasons(a) {
  return {
    spring: 'Crabs around ' + a + ' wake up as the water warms through May — a light early pick that builds week by week into summer.',
    summer: 'Peak. From July the blue crabs stack around ' + a + ' out of the current — get there at first light. This is when the map runs solid red.',
    fall: 'Fall crabs are heavy and fat before they bury for winter — some of the best eating of the year around ' + a + '. The bite tapers as the water cools.',
    winter: 'Crabs are buried and dormant in the cold — crabbing’s done until spring around ' + a + '. Perch, pickerel, and catfish fill in for fishing.'
  };
}
function qa(place, short) {
  return [
    { q: 'When is crabbing ' + place + ' best?', a: 'July to September, occasionally into October, once the water holds above 70°F. Early morning — before the boat traffic and heat — is the prime window for a trotline, handlines, or collapsible traps. The crabs hold along the structure and channel edges out of the main current.' },
    { q: 'Can I crab ' + place + ' without a boat?', a: 'Yes — this is a public-access landmark, so you can drop collapsible traps or run a handline with chicken necks off the pier, bulkhead, or shoreline on a moving tide. Bring a long-handled dip net, a catch basket, and a 5″ gauge. Always confirm where crabbing is allowed on site.' },
    { q: 'What are the crab rules around ' + short + '?', a: 'Maryland recreational crab rules apply and change year to year: 5″ hard-crab minimum, no egg-bearing “sponge” females, recreational gear and license limits, and seasonal dates. This guide shows where the crabs are, not a pass on the limits — verify the current Maryland DNR crabbing regulations before you set a line.' }
  ];
}
// [titleName, slug, lat, lng, zoom, blurb]
var L = [
  ['at Sandy Point Beach', 'sandy-point-beach', 39.012, -76.401, 13, 'right under the Bay Bridge at Sandy Point State Park'],
  ['by the Bay Bridge', 'by-the-bay-bridge', 38.99, -76.39, 12, 'around the Bay Bridge structure and the Sandy Point flats'],
  ['by the Naval Academy', 'by-the-naval-academy', 39.004, -76.49, 13, 'on the Severn River off the Naval Academy at Jonas Green Park'],
  ['at Conquest Beach', 'conquest-beach', 39.06, -76.13, 13, 'on the Eastern Shore near the Corsica and Chester rivers'],
  ['off Matapeake Pier', 'matapeake-pier', 38.962, -76.358, 13, 'off the Matapeake public fishing pier on Kent Island'],
  ['off Romancoke Pier', 'romancoke-pier', 38.907, -76.227, 13, 'off the Romancoke public pier on the south end of Kent Island'],
  ['at Downs Park', 'downs-park', 39.115, -76.43, 13, 'at Downs Memorial Park on the Bodkin Peninsula'],
  ['at Fort Smallwood Park', 'fort-smallwood-park', 39.16, -76.53, 13, 'at Fort Smallwood Park where the Patapsco meets the Bay'],
  ['at Truxtun Park', 'truxtun-park', 38.97, -76.50, 14, 'on Spa Creek at Truxtun Park in Annapolis'],
  ['at North Beach', 'north-beach', 38.71, -76.53, 13, 'off the North Beach public pier in Calvert County'],
  ['at Chesapeake Beach', 'chesapeake-beach', 38.685, -76.535, 13, 'off Chesapeake Beach in Calvert County'],
  ['at Point Lookout', 'point-lookout', 38.05, -76.32, 12, 'at Point Lookout State Park where the Potomac meets the Bay'],
  ['at Greenwell State Park', 'greenwell-state-park', 38.37, -76.51, 13, 'on the Patuxent River at Greenwell State Park'],
  ['at Elk Neck State Park', 'elk-neck-state-park', 39.48, -75.98, 12, 'at the head of the Bay on the Elk Neck peninsula'],
  ['at Betterton Beach', 'betterton-beach', 39.37, -76.06, 13, 'at Betterton Beach at the mouth of the Sassafras River'],
  ['off Kentmorr Pier', 'kentmorr-pier', 38.92, -76.32, 13, 'off the Kentmorr public pier on Kent Island'],
  ['at Breezy Point', 'breezy-point', 38.66, -76.53, 13, 'off Breezy Point in Calvert County'],
  ['at Beverly Triton Beach', 'beverly-triton-beach', 38.84, -76.50, 13, 'at Beverly Triton Beach in Mayo'],
  ['at Flag Ponds', 'flag-ponds', 38.50, -76.51, 13, 'at Flag Ponds Nature Park in Calvert County'],
  ['at Hart-Miller Island', 'hart-miller-island', 39.25, -76.35, 12, 'at Hart-Miller Island off Baltimore County']
];

module.exports = L.map(function (a) {
  var titleName = a[0], slug = a[1], lat = a[2], lng = a[3], zoom = a[4], blurb = a[5];
  var short = titleName.replace(/^(at|by|off)\s+(the\s+)?/i, '');
  var zones = [[lat, lng, 1.0], [lat + 0.012, lng + 0.012, 0.85], [lat - 0.011, lng - 0.013, 0.78], [lat + 0.004, lng - 0.016, 0.66]];
  return {
    slug: slug + '-md', cat: 'crab', region: 'Maryland · Chesapeake', ll: [lat, lng],
    hubTitle: 'Best Blue Crabbing ' + titleName + ' in 2027',
    hubBlurb: 'Blue-crab density ' + blurb + ' — by time of day.',
    title: 'Best Blue Crabbing ' + titleName + ' in 2027',
    desc: 'Where to crab ' + titleName + ' (' + short + ', Chesapeake Bay, MD) — an interactive density map by time of day, plus public access, gear, and the rules.',
    dek: 'Blue-crab hot spots ' + blurb + '. The density map runs red where the crabs stack here — and shifts by time of day.',
    quick: 'Crabbing ' + titleName + ', work the creek mouths, channel edges, and structure out of the current. Run a trotline or traps early — the morning pick is reddest. Peak is <b>July into October</b> once the water tops 70°F.',
    center: [lat, lng], zoom: zoom,
    crab: crabDays(zones), fish: days([[lat, lng, 0.5]], FISH),
    bite: bite(), seasons: seasons(short),
    access: [['Public access ' + titleName, lat, lng]],
    spots: [
      { name: short + ' structure & edges', note: 'Work the structure, creek mouths, and channel edges ' + blurb + ' — crabs stack here out of the current. Trotline or traps at first light.', chips: ['🔴 dense Jul–Oct', 'Trotline/traps'] },
      { name: 'Deeper edges midday', note: 'As the shallows warm, the crabs slide to the deeper edges nearby — drop traps along the drop-offs.', chips: ['🔴 dense', 'Boat'] },
      { name: 'Public access ' + titleName, note: 'This is a public landmark — pier, beach, or park access puts you right on the crab water. Confirm where crabbing is allowed on site.', chips: ['Public access', 'Verify on site'] }
    ],
    qa: qa(titleName, short)
  };
});
