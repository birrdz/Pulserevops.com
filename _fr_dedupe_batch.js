// Dedupe a batch of proposed franchise titles against the live library.
// Prints CLEAR (safe to write) vs COLLISION (exact or >=0.72 jaccard).
// Usage: node _fr_dedupe_batch.js
const https = require('https');

function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function tokens(s){const stop=new Set(['how','do','you','what','is','the','a','an','to','in','on','for','of','and','or','should','i','open','buy','franchise','2027']);return norm(s).split(/\s+/).filter(w=>w.length>2&&!stop.has(w));}
function jaccard(a,b){const A=new Set(tokens(a)),B=new Set(tokens(b));if(!A.size||!B.size)return 0;let n=0;for(const t of A)if(B.has(t))n++;return n/(A.size+B.size-n);}

function art(name){return /^[aeiou]/i.test(name)?'an':'a';}
// brand -> "Should I open or buy a/an <brand> franchise in 2027?"
function fTitle(name){return `Should I open or buy ${art(name)} ${name} franchise in 2027?`;}

// ---- CANDIDATE BRANDS (new, not yet covered). Heavy sports/athletics block. ----
const SPORTS = [
 'i9 Sports','Parisi Speed School','Athletic Republic','TGA Premier Sports','Lil’ Kickers soccer',
 'Soccer Stars','Amazing Athletes','Gracie Barra Brazilian Jiu-Jitsu','Premier Martial Arts',
 'Tiger Schulmann’s Martial Arts','iLoveKickboxing','UFC Gym','Bad Axe Throwing','Stumpy’s Hatchet House',
 'K1 Speed indoor karting','Andretti Indoor Karting','Bowlero','Main Event Entertainment','Get Air trampoline park',
 'Rockin’ Jump trampoline park','Play It Again Sports','Fleet Feet running store','Trek Bicycle Store',
 'Restore Hyper Wellness','iCRYO cryotherapy','Perspire Sauna Studio','HOTWORX','The DRIPBaR',
 'YogaSix','CorePower Yoga','Crunch Fitness','EOS Fitness','Snap Fitness','Workout Anytime','Fitness 19',
 'Fit Body Boot Camp','The Bar Method','solidcore','GNC','Complete Nutrition','Nutrishop',
 'The Picklr pickleball','Pickleball Kingdom','Chicken N Pickle','X-Golf indoor golf','Five Iron Golf','BigShots Golf',
 'UFC FIT','Crunch','Zoom Room dog training','Sit Means Sit dog training'
];
const FOOD = [
 'Jack in the Box','Cheba Hut','Jon Smith Subs','Clean Juice','CoreLife Eatery','Zoup Eatery','Mellow Mushroom',
 'Your Pie Pizza','Pizza Factory','Toppers Pizza','Fox’s Pizza Den','Rosati’s Pizza','Grimaldi’s Pizzeria',
 'Anthony’s Coal Fired Pizza','Jet’s Pizza','Happy Joe’s Pizza','Ledo Pizza','Russo’s New York Pizzeria',
 'Jason’s Deli','Fazoli’s','Buca di Beppo','Carrabba’s Italian Grill','Romano’s Macaroni Grill',
 'Old Spaghetti Factory','Johnny Rockets','Hwy 55 Burgers','The Counter burger','Burgerville','Golden Chick',
 'Lee’s Famous Recipe Chicken','Angry Chickz','Huey Magoo’s Chicken Tenders','Guthrie’s','Chicken Express',
 'Bad Ass Coffee of Hawaii','The Human Bean','Dunn Brothers Coffee','Gloria Jean’s Coffees','Coffee Beanery',
 'Vivi Bubble Tea','Tiger Sugar','CoCo Fresh Tea & Juice','Happy Lemon','Chatime','Crave Cookies','Dirty Dough',
 'Chip City','Nothing Bundt Cakes','Smallcakes Cupcakery','Gigi’s Cupcakes','Dippin’ Dots','Bahama Buck’s',
 'Frios Gourmet Pops','Andy’s Frozen Custard','Repicci’s Italian Ice','Twistee Treat','Hokulia Shave Ice',
 'Island Fin Poke','Poke Bros','Pokeworks','Pepper Lunch','Surcheros Fresh Mex','Cafe Zupas','Modern Market Eatery',
 'Crisp & Green','Mr. Pickle’s Sandwich Shop','Goodcents'
];
const SERVICES = [
 'FASTSIGNS','Signarama','Image360','PostNet','Pak Mail','MaidPro','Maid Brigade','The Cleaning Authority',
 'You’ve Got Maids','Two Maids','Fish Window Cleaning','Shine Window Care','Spray-Net','JDog Junk Removal & Hauling',
 'The Junkluggers','Stand Up Guys Junk Removal','Paul Davis Restoration','911 Restoration','Ace Handyman Services',
 'Handyman Connection','House Doctors','TruBlue Total House Care','Floor Coverings International','Footprints Floors',
 'N-Hance Wood Refinishing','Miracle Method','Gotcha Covered','Made in the Shade Blinds','West Shore Home',
 'Jacuzzi Bath Remodel','Kitchen Solvers','Cabinet IQ','Mighty Dog Roofing','Superior Fence & Rail','Concrete Craft',
 'TSR Concrete Coatings','Outdoor Lighting Perspectives','Blingle','Christmas Decor','ASP America’s Swimming Pool',
 'Premier Pools & Spas','Grease Monkey','Kwik Kar','Express Oil Change & Tire','Tint World','Line-X','Rhino Linings',
 'Reis & Irvy’s','HealthyYOU Vending','Cruise Holidays','Pet Wants','Woofie’s','Scenthound','Central Bark',
 'EarthWise Pet','Bark Busters','Amazing Lash Studio','The Lash Lounge','Deka Lash','Woodhouse Spa','Image Studios',
 'Salon Lofts','Frenchies Modern Nail Care','uBreakiFix','CPR Cell Phone Repair','Batteries Plus Bulbs',
 'Goosehead Insurance','Brightway Insurance','Estrella Insurance','Padgett Business Services','American Family Care',
 'AFC Urgent Care','Profile by Sanford','Medi-Weightloss','Ideal Image','Your CBD Store','Brain Balance','LearningRx',
 'Best Brains','Tutoring Club','Young Rembrandts','Abrakadoodle','Kidcreate Studio','Painting with a Twist',
 'Pinot’s Palette','Gymboree Play & Music','We Rock the Spectrum','eXp Realty','United Real Estate','HomeSmart',
 'EXIT Realty','Fathom Realty','FirstLight Home Care','Griswold Home Care','CarePatrol','Oasis Senior Advisors',
 'Assisted Living Locators'
];

const CANDIDATES = [...SPORTS, ...FOOD, ...SERVICES].map(fTitle);

function fetchLib(){return new Promise((res,rej)=>{https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000',r=>{let b='';r.on('data',c=>b+=c);r.on('end',()=>{try{res(JSON.parse(b).entries||[])}catch(e){rej(e)}})}).on('error',rej)});}

(async()=>{
 const all = await fetchLib();
 // dedup candidates against EVERYTHING (whole library, not just fr) + against each other
 const clear=[], collide=[];
 const accepted=[]; // for intra-batch dedup
 for(const t of CANDIDATES){
   const nT=norm(t);
   let hit=null;
   for(const e of all){const q=e.question||'';if(norm(q)===nT){hit={id:e.id,q,score:1};break;}const s=jaccard(t,q);if(s>=0.72){hit={id:e.id,q,score:+s.toFixed(2)};break;}}
   if(!hit){for(const a of accepted){if(norm(a)===nT||jaccard(t,a)>=0.72){hit={id:'BATCH',q:a,score:1};break;}}}
   if(hit) collide.push({t,hit}); else {clear.push(t);accepted.push(t);}
 }
 console.log('LIBRARY_TOTAL='+all.length);
 console.log('CANDIDATES='+CANDIDATES.length);
 console.log('CLEAR='+clear.length);
 console.log('COLLISIONS='+collide.length);
 console.log('\n--- COLLISIONS ---');
 for(const c of collide) console.log('X  '+c.t+'  <=>  ['+c.hit.id+' '+c.hit.score+'] '+c.hit.q);
 console.log('\n--- CLEAR (first 200) ---');
 clear.slice(0,200).forEach((t,i)=>console.log(String(i+1).padStart(3,'0')+'  '+t));
})().catch(e=>{console.error(e);process.exit(1)});
