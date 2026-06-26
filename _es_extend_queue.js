// Extend the estates sprint queue from es0100 → es0250 with 150 deduped,
// real-world Top-10 estate / luxury-real-estate titles. Idempotent: re-running
// rebuilds es0101+ from the curated list, keeps es0001-es0100 untouched.
const fs = require('fs');
const QP = 'C:/Users/koryj/_es_sprint_queue.json';
const q = JSON.parse(fs.readFileSync(QP, 'utf8'));

const slug = (t) => t.toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-+/g, '-');
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Curated 150 new titles (es0101-es0250). Real markets, metros, community
// types, builders, and property niches — no overlap with es0001-es0100.
const NEW = [
  // Metro luxury neighborhoods (real, named)
  "Top 10 Luxury Neighborhoods in Miami",
  "Top 10 Luxury Neighborhoods in Atlanta",
  "Top 10 Luxury Neighborhoods in Houston",
  "Top 10 Luxury Neighborhoods in Austin",
  "Top 10 Luxury Neighborhoods in Phoenix",
  "Top 10 Luxury Neighborhoods in Scottsdale",
  "Top 10 Luxury Neighborhoods in Denver",
  "Top 10 Luxury Neighborhoods in Seattle",
  "Top 10 Luxury Neighborhoods in San Diego",
  "Top 10 Luxury Neighborhoods in San Francisco",
  "Top 10 Luxury Neighborhoods in Nashville",
  "Top 10 Luxury Neighborhoods in Charlotte",
  "Top 10 Luxury Neighborhoods in Las Vegas",
  "Top 10 Luxury Neighborhoods in Boston",
  "Top 10 Luxury Neighborhoods in Washington DC",
  "Top 10 Luxury Neighborhoods in Chicago",
  "Top 10 Luxury Neighborhoods in Naples Florida",
  "Top 10 Luxury Neighborhoods in Palm Beach",
  "Top 10 Luxury Neighborhoods in Aspen",
  "Top 10 Luxury Neighborhoods in Park City Utah",
  // Best places to buy a home by state
  "Top 10 Best Places to Buy a Home in California",
  "Top 10 Best Places to Buy a Home in Arizona",
  "Top 10 Best Places to Buy a Home in Colorado",
  "Top 10 Best Places to Buy a Home in Georgia",
  "Top 10 Best Places to Buy a Home in South Carolina",
  "Top 10 Best Places to Buy a Home in North Carolina",
  "Top 10 Best Places to Buy a Home in Nevada",
  "Top 10 Best Places to Buy a Home in Idaho",
  "Top 10 Best Places to Buy a Home in Montana",
  "Top 10 Best Places to Buy a Home in Virginia",
  "Top 10 Best Places to Buy a Home in Washington State",
  "Top 10 Best Places to Buy a Home in Oregon",
  "Top 10 Best Places to Buy a Home in Alabama",
  "Top 10 Best Places to Buy a Home in Kentucky",
  "Top 10 Best Places to Buy a Home in Michigan",
  // Gated / master-planned by state
  "Top 10 Gated Communities in Texas",
  "Top 10 Gated Communities in Arizona",
  "Top 10 Gated Communities in California",
  "Top 10 Gated Communities in Nevada",
  "Top 10 Gated Communities in Georgia",
  "Top 10 Master-Planned Communities in Arizona",
  "Top 10 Master-Planned Communities in California",
  "Top 10 Master-Planned Communities in the Carolinas",
  "Top 10 Master-Planned Communities in Colorado",
  "Top 10 Master-Planned Communities in Tennessee",
  // Golf communities by region
  "Top 10 Golf Course Communities in Florida",
  "Top 10 Golf Course Communities in Texas",
  "Top 10 Golf Course Communities in California",
  "Top 10 Golf Course Communities in Georgia",
  "Top 10 Golf Course Communities in Nevada",
  "Top 10 Golf Course Communities in South Carolina",
  // 55-plus / active adult by region
  "Top 10 55-Plus Communities in Texas",
  "Top 10 55-Plus Communities in California",
  "Top 10 55-Plus Communities in the Carolinas",
  "Top 10 55-Plus Communities in Nevada",
  "Top 10 55-Plus Communities in Georgia",
  "Top 10 Del Webb Communities to Buy In",
  // Waterfront / lake / beach by region
  "Top 10 Waterfront Communities in Texas",
  "Top 10 Waterfront Communities in California",
  "Top 10 Waterfront Communities in the Carolinas",
  "Top 10 Best Lake Communities in Texas",
  "Top 10 Best Lake Communities in the Southeast",
  "Top 10 Best Lake Communities in the Northeast",
  "Top 10 Best Beach Towns to Buy a Home in Florida",
  "Top 10 Best Beach Towns to Buy a Home in California",
  "Top 10 Best Beach Towns to Buy a Home in the Carolinas",
  "Top 10 Best Beach Towns to Buy a Home on the Gulf Coast",
  "Top 10 Best Places to Buy a Beach House in Florida",
  "Top 10 Best Places to Buy an Oceanfront Condo",
  // Mountain / ski
  "Top 10 Best Ski Towns to Buy a Home in Colorado",
  "Top 10 Best Ski Towns to Buy a Home in Utah",
  "Top 10 Best Mountain Towns to Buy a Home in Montana",
  "Top 10 Best Mountain Towns to Buy a Home in North Carolina",
  "Top 10 Best Places to Buy a Mountain Home in Idaho",
  "Top 10 Best Places to Buy a Cabin in the Smoky Mountains",
  // Retire by state
  "Top 10 Best Places to Retire in Florida",
  "Top 10 Best Places to Retire in Arizona",
  "Top 10 Best Places to Retire in the Carolinas",
  "Top 10 Best Places to Retire in Texas",
  "Top 10 Best Places to Retire in Tennessee",
  "Top 10 Best Places to Retire in Georgia",
  "Top 10 Best Tax-Free States to Retire and Buy a Home",
  // Investment / rental markets
  "Top 10 Best Real Estate Markets to Invest In for 2027",
  "Top 10 Best Rental Property Markets in the US",
  "Top 10 Best Airbnb Markets to Buy a Vacation Rental",
  "Top 10 Best Markets for Buy-and-Hold Rental Property",
  "Top 10 Best Real Estate Markets for First-Time Investors",
  "Top 10 Best Cities for Rental Property Cash Flow",
  "Top 10 Best Beach Towns to Buy a Vacation Rental",
  "Top 10 Best Mountain Towns to Buy a Vacation Rental",
  "Top 10 Best Markets for Luxury Vacation Rentals",
  "Top 10 Fastest-Growing Real Estate Markets in 2027",
  // Builders by state / niche
  "Top 10 Luxury Custom Home Builders in Arizona",
  "Top 10 Luxury Custom Home Builders in Colorado",
  "Top 10 Luxury Custom Home Builders in the Carolinas",
  "Top 10 Luxury Custom Home Builders in Georgia",
  "Top 10 Luxury Custom Home Builders in Tennessee",
  "Top 10 Production Home Builders in America",
  "Top 10 Green and Energy-Efficient Home Builders",
  "Top 10 Barndominium Builders in the US",
  "Top 10 Log and Timber Home Builders",
  "Top 10 Luxury Home Builders in Florida",
  // Property niches
  "Top 10 Best Places to Buy a Horse Property",
  "Top 10 Best Places to Buy a Waterfront Cabin",
  "Top 10 Best Places to Buy a Golf Villa",
  "Top 10 Best Places to Buy a Mountain Cabin in Tennessee",
  "Top 10 Best Places to Buy a Tiny Home or Cabin",
  "Top 10 Best Places to Buy a Luxury Penthouse",
  "Top 10 Best Places to Buy a Waterfront Estate",
  "Top 10 Best Places to Buy a Historic Mansion",
  "Top 10 Best Places to Buy a New-Construction Home in 2027",
  "Top 10 Best Places to Buy a Smart Home",
  // Affordability / budget angles
  "Top 10 Most Affordable Places to Buy a Vacation Home",
  "Top 10 Most Affordable Beach Towns to Buy a Home",
  "Top 10 Most Affordable Mountain Towns to Buy a Home",
  "Top 10 Most Affordable Lake Towns to Buy a Home",
  "Top 10 Best Places to Buy a Home Under 300k in 2027",
  "Top 10 Best Places to Buy a Home Under 400k in 2027",
  "Top 10 Cheapest States to Buy a House in 2027",
  "Top 10 Best Places to Buy a Starter Home in 2027",
  // Exclusive / ultra-luxury
  "Top 10 Most Expensive Neighborhoods in America",
  "Top 10 Most Expensive Zip Codes to Buy a Home",
  "Top 10 Best Private Ski Club Communities",
  "Top 10 Best Yacht and Marina Communities to Buy In",
  "Top 10 Best Oceanfront Luxury Communities in the US",
  "Top 10 Best Luxury Golf Resort Communities",
  "Top 10 Best Ultra-Luxury Condo Towers in the US",
  "Top 10 Best Celebrity-Favorite Towns to Buy a Home",
  // Lifestyle / family / specific buyer
  "Top 10 Best Places to Buy a Home for Families in 2027",
  "Top 10 Best Places to Buy a Home for Remote Workers",
  "Top 10 Best Walkable Cities to Buy a Home",
  "Top 10 Best College Towns to Buy a Home",
  "Top 10 Best Small Towns to Retire and Buy a Home",
  "Top 10 Best Places to Buy a Home Near a Lake and Golf",
  "Top 10 Best Places to Buy a Home Near the Mountains and a Lake",
  "Top 10 Best Sun Belt Cities to Buy a Home in 2027",
  // International / second-home abroad
  "Top 10 Best Countries to Buy a Vacation Home",
  "Top 10 Best Places to Buy a Beach House in Mexico",
  "Top 10 Best Places to Buy a Home in Costa Rica",
  "Top 10 Best Places to Buy a Vacation Home in the Caribbean",
  "Top 10 Best Places to Buy a Home in Portugal",
  "Top 10 Best Places to Buy a Home in Italy",
  "Top 10 Best Places to Buy a Home in Spain",
  "Top 10 Best Overseas Markets for US Buyers in 2027",
  // More US regional luxury
  "Top 10 Best Luxury Markets in the Southeast for 2027",
  "Top 10 Best Luxury Markets in the Southwest for 2027",
  "Top 10 Best Luxury Markets in the Northeast for 2027",
  "Top 10 Best Luxury Markets in the Pacific Northwest",
  "Top 10 Best Desert Golf Communities in Arizona",
  "Top 10 Best Wine Country Communities to Buy In",
  "Top 10 Best Coastal Luxury Communities in California",
  "Top 10 Best Lakefront Luxury Communities in the US",
  "Top 10 Best Gated Communities in the Carolinas",
  "Top 10 Best Places to Buy a Lakefront Home in 2027",
];

// Drop anything that collides with existing normalized titles.
const have = new Set(q.map(e => norm(e.title)));
const fresh = [];
for (const t of NEW) {
  const n = norm(t);
  if (have.has(n)) { console.error('DUP skipped:', t); continue; }
  have.add(n);
  fresh.push(t);
}

// Truncate queue back to es0100, then append fresh ids es0101+.
const base = q.filter(e => parseInt(e.id.slice(2), 10) <= 100);
let next = 101;
for (const t of fresh) {
  const id = 'es' + String(next).padStart(4, '0');
  base.push({ id, title: t, slug: slug(t) });
  next++;
}
fs.writeFileSync(QP, JSON.stringify(base, null, 2));
console.log('Queue now', base.length, 'entries; ids es0001 ->', base[base.length-1].id);
console.log('Fresh added:', fresh.length, '(target 150)');
