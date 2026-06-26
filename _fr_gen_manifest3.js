const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('C:/Users/koryj/_fr_existing_titles.json','utf8'));
const normBrand = s => (s||'').toLowerCase().replace(/[’'`]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\b(franchise|business|the|inc|llc|co|company)\b/g,'').replace(/\s+/g,' ').trim();
const existingBrands = new Set();
for (const t of existing){
  const m = t.match(/(?:open|buy)(?: or buy)? an? (.+?) (?:franchise|business)(?: in 2027)?/i) || t.match(/an? (.+?) (?:franchise|business)/i);
  if (m) existingBrands.add(normBrand(m[1]));
}
const cands = [
 // smoothie/juice/dessert/sweets
 "Smoothie King","Juice It Up","Maui Wowi","Main Squeeze Juice Co","Beyond Juicery + Eatery","I Love Juice Bar","Cinnaholic","Rocky Mountain Chocolate Factory","Kilwins","Philly Pretzel Factory","Ben's Soft Pretzels","Doc Popcorn","Mochinut","Parlor Doughnuts","Hurts Donut","Peace Love and Little Donuts","LaMar's Donuts","Big Apple Bagels","Bruegger's Bagels","Brooklyn Water Bagel","Creamistry","Sub Zero Nitrogen Ice Cream","Bahama Buck's","Tropical Smoothie Cafe","Yogurtland","Cold Stone Creamery","Wienerschnitzel","Nathan's Famous","Dog Haus","Cookie Plug",
 // sandwich / subs / fast casual
 "Cheba Hut","Lenny's Grill & Subs","Port of Subs","Quiznos","Togo's","Earl of Sandwich","PrimoHoagies","Jon Smith Subs","Mr. Pickle's Sandwich Shop","Great Steak","Steak Escape","Pita Pit","Just Salad","Bibibop Asian Grill","Wow Bao","Curry Up Now","Wing Zone","Hurricane Grill & Wings","Fatburger","Johnny Rockets","Checkers & Rally's","Steak 'n Shake","Hwy 55 Burgers","BurgerFi","Taco Bueno","Taco Cabana","Pick Up Stix","Bar-B-Cutie","Famous Dave's","Captain D's",
 // coffee/tea
 "Caribou Coffee","The Coffee Bean & Tea Leaf","Gloria Jean's Coffees","Coffee Beanery","It's A Grind Coffee","Dunn Brothers Coffee","Tim Hortons","Dunkin'","Bubbakoo's Burritos",
 // fitness/gyms
 "Crunch Fitness","World Gym","Retro Fitness","Fitness 19","Blink Fitness","Snap Fitness","Anytime Fitness","Workout Anytime","9Round","Jabz Boxing","Title Boxing Club","Body20","Manduu","Club Pilates","Pure Barre","Xtend Barre","StretchLab","Stretch Zone","CycleBar","Row House","YogaSix","Burn Boot Camp","F45 Training","Orangetheory Fitness",
 // wellness/health/medical
 "The Joint Chiropractic","HealthSource Chiropractic","100% Chiropractic","AlignLife","FYZICAL Therapy & Balance Centers","Miracle-Ear","Pearle Vision","My Eyelab","Stanton Optical","The DRIPBaR","Restore Hyper Wellness","Hand & Stone Massage","Massage Heights","Elements Massage","MassageLuXe","The NOW Massage","LaVida Massage","Amada Senior Care","FirstLight Home Care","Synergy HomeCare","Interim HealthCare","Home Helpers Home Care","CarePatrol","Nurse Next Door","HomeWell Care Services","Acti-Kare",
 // home services / repair / remodel
 "Mr. Appliance","Benjamin Franklin Plumbing","One Hour Heating & Air Conditioning","Mister Sparky","bluefrog Plumbing + Drain","Roto-Rooter","California Closets","Closet Factory","ShelfGenie","More Space Place","GarageExperts","Miracle Method Surface Refinishing","Bath Planet","Jacuzzi Bath Remodel","West Shore Home","Re-Bath","DaBella","Storm Guard Roofing","The Brothers that just do Gutters","Ned Stevens Gutter Cleaning","Spray-Net","ProTect Painters","Trimlight","Outdoor Lighting Perspectives","Pinch A Penny","Made in the Shade Blinds","Sunburst Shutters","Gotcha Covered","Window Hero","DetailXPerts","Surface Specialists",
 // cleaning res/commercial
 "Molly Maid","Merry Maids","You've Got Maids","Maid Right","ServiceMaster Clean","Buildingstars","OpenWorks","System4","ServiceMaster Restore","Servpro","PuroClean","Blue Kangaroo Packoutz","Bin There Dump That","redbox+ Dumpsters","Junk Doctors","Stand Up Guys",
 // pet
 "Pet Supplies Plus","Wag N' Wash","Sploot Veterinary Care","Pet Butler","DoodyCalls","Scoop Soldiers","Hounds Lounge","Dogdrop","Zoom Room","Sit Means Sit",
 // beauty
 "Floyd's 99 Barbershop","Bishops Cuts/Color","Diesel Barbershop","Salon Lofts","Image Studios 360","MiniLuxe","Heyday Skincare","FACE FOUNDRIÉ","Glo Sun Spa","Zoom Tan","Deka Lash","Amazing Lash Studio","The Lash Lounge","Waxing the City","European Wax Center",
 // entertainment / kids play
 "Sky Zone","Urban Air Adventure Park","Launch Trampoline Park","Altitude Trampoline Park","Rockin' Jump","DEFY","Get Air","The Escape Game","Escapology","Bad Axe Throwing","Stumpy's Hatchet House","Five Iron Golf","X-Golf","Painting with a Twist","Pinot's Palette","Board & Brush Creative Studio","AR Workshop","We Rock the Spectrum Kid's Gym","Pinspiration","Snapology","Bricks 4 Kidz",
 // resale (Winmark + others)
 "Plato's Closet","Once Upon A Child","Play It Again Sports","Music Go Round","Style Encore","Clothes Mentor","Uptown Cheapskate","Kid to Kid","2nd Ave Thrift",
 // tech/phone repair / IT
 "uBreakiFix","CPR Cell Phone Repair","Cellairis","Experimax","NerdsToGo","TeamLogic IT","CMIT Solutions","Computer Troubleshooters","Batteries Plus","Pop-A-Lock",
 // auto
 "Take 5 Oil Change","Jiffy Lube","Precision Tune Auto Care","Car-X Tire & Auto","Tuffy Tire & Auto Service","Monro","Express Oil Change & Tire Engineers","Oil Can Henry's","Big Brand Tire & Service","Tires Plus","Maaco","Colors on Parade","Dr. Vinyl","Mac Tools","Cornwell Quality Tools","Interstate All Battery Center","Tommy's Express Car Wash","Quick Quack Car Wash","Take 5 Car Wash","GO Car Wash","Zips Car Wash","El Car Wash",
 // dry cleaning / laundry
 "ZIPS Cleaners","OXXO Care Cleaners","Tide Cleaners","Martinizing Dry Cleaning","Comet Cleaners","Lapels Dry Cleaning","WaveMAX Laundry",
 // business services / print / staffing / finance
 "Fully Promoted","Big Frog Custom T-Shirts","Sir Speedy","Kwik Kopy","AtWork Group","PrideStaff","Snelling Staffing","HireQuest","Sandler Training","Dale Carnegie","Toro Taxes","BooXkeeping","Renters Warehouse","Keyrenter Property Management","Travel Leaders","Cruise Holidays","Freeway Insurance","Pronto Insurance","NextHome","United Real Estate","Fathom Realty","HomeWell",
 // storage / portable
 "Go Mini's","UNITS Moving and Portable Storage","Zippy Shell","Storage Authority",
 // misc services
 "Wild Birds Unlimited","Batteries Plus Bulbs","Office Evolution","Intelligent Office","Venture X","Crestcom","FocalPoint Coaching"
];
const seen=new Set(); const out=[]; let id=924;
function article(b){ return /^[aeiou]/i.test(b.trim()) ? 'an' : 'a'; }
const dropped=[];
for (let b of cands){
  b=b.trim(); if(!b) continue;
  const nb=normBrand(b);
  if(existingBrands.has(nb)){ dropped.push(b); continue; }
  if(seen.has(nb)) continue;
  seen.add(nb);
  out.push({ id:'fr'+String(id).padStart(4,'0'), title:`Should I open or buy ${article(b)} ${b.replace(/\[|\]/g,'')} franchise in 2027?` });
  id++; if(out.length>=100) break;
}
console.log('Candidates:',cands.length,'| selected:',out.length,'| dropped(covered):',dropped.length);
const manifest={ start_id:'fr0924', end_id:out[out.length-1].id, count:out.length, scheme:'4-digit', started_label:'100 more franchise Q&As (batch 3), gold fr0001 template', items:out };
fs.writeFileSync('C:/Users/koryj/website/_fr_batch_manifest3.json', JSON.stringify(manifest,null,2));
console.log('Range:',out[0].id,'->',out[out.length-1].id);
if(out.length<100) console.log('SHORT by',100-out.length,'- need more candidates');
