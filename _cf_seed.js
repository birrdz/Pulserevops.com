// _cf_seed.js — seed up to 1000 CRAB (cr) + 1000 FISHING (fs) Q&As. APPEND-SAFE: dedups vs
// the live index AND the existing _cf_queue.json, assigns new ids from current max+1, and
// appends. Big location list (heavy Chesapeake/mid-Atlantic + US coasts/lakes) x 7 question
// types reaches ~1000 each. Run: node _cf_seed.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const Y='2027', WANT=1000;
const CHES=['the Chesapeake Bay','Kent Island MD','Eastern Bay MD','the Magothy River MD','the Severn River MD','the Choptank River MD','Tangier Sound MD','the Patuxent River MD','Solomons Island MD','the Chester River MD','Smith Island MD','Crisfield MD','the Honga River MD','the Nanticoke River MD','Point Lookout MD','the Potomac River','Rock Hall MD','Tilghman Island MD','Deale MD','Chesapeake Beach MD','the Wye River MD','the Miles River MD','the South River MD','the West River MD','Annapolis MD','Havre de Grace MD','the Susquehanna Flats','the Bohemia River MD','the Sassafras River MD','Cambridge MD','the Little Choptank MD','Hooper Island MD','Saint Marys River MD','the Wicomico River MD','Ocean City MD','Assateague MD'];
const VA=['the Rappahannock River VA','the York River VA','Mobjack Bay VA','the James River VA','Virginia Beach VA','the Eastern Shore VA','Chincoteague VA','Cape Charles VA','the Elizabeth River VA','Lynnhaven Inlet VA','the Piankatank River VA','Gwynns Island VA','Reedville VA','Hampton VA','Poquoson VA','the Northern Neck VA'];
const DENJ=['Delaware Bay','Indian River Inlet DE','Rehoboth Bay DE','the Delaware River','Lewes DE','Barnegat Bay NJ','the Navesink River NJ','Raritan Bay NJ','Great Bay NJ','the Maurice River NJ','Cape May NJ','Absecon Bay NJ','the Mullica River NJ','Sandy Hook NJ','Little Egg Harbor NJ','the Shrewsbury River NJ'];
const NE=['Long Island Sound','the Hudson River NY','Jamaica Bay NY','Great South Bay NY','Peconic Bay NY','Montauk NY','the East River NY','Cape Cod MA','Buzzards Bay MA','Narragansett Bay RI','Casco Bay ME','Penobscot Bay ME','the Connecticut River','Boston Harbor MA','Long Island NY','the Jersey Shore'];
const SE=['the Outer Banks NC','Pamlico Sound NC','the Neuse River NC','Wilmington NC','Charleston SC','Hilton Head SC','Myrtle Beach SC','Savannah GA','the Georgia coast','Jacksonville FL','Tampa Bay FL','the Florida Keys','Apalachicola FL','Cedar Key FL','Mosquito Lagoon FL','the Indian River Lagoon FL','Pensacola FL','Charlotte Harbor FL','Sarasota FL','the St. Johns River FL'];
const GULF=['the Gulf Coast','Galveston TX','the Louisiana bayous','Mobile Bay AL','Corpus Christi TX','Port Aransas TX','Grand Isle LA','Biloxi MS','the Mississippi River Delta','Matagorda TX','Sabine Lake TX','Calcasieu Lake LA','Pensacola Bay FL','the Laguna Madre TX'];
const WEST=['San Francisco Bay','Puget Sound WA','the Oregon Coast','the Columbia River','Bodega Bay CA','Half Moon Bay CA','Tomales Bay CA','Willapa Bay WA','Coos Bay OR','Humboldt Bay CA','the San Juan Islands WA','Monterey Bay CA','Westport WA'];
const LAKES=['Lake Erie','Lake Michigan','Lake Ontario','Lake Huron','Lake St. Clair','the Great Lakes','Lake Champlain','the Mississippi River','Lake Okeechobee FL','the Potomac River tidal','Lake Texoma','the Tennessee River'];
const LOCS=[...CHES,...CHES,...VA,...VA,...DENJ,...DENJ,...NE,...SE,...GULF,...WEST,...LAKES]; // Chesapeake/mid-Atlantic weighted 2x
const crabQ=loc=>[`Where are the best crabbing spots in ${loc} in ${Y}?`,`When is the best time to go crabbing in ${loc} in ${Y}?`,`What is the best bait for crabbing in ${loc} in ${Y}?`,`How do you catch blue crabs in ${loc} in ${Y}?`,`What size and catch limits apply to crabbing in ${loc} in ${Y}?`,`Where can you crab from a public pier in ${loc} in ${Y}?`,`Do you need a license to crab in ${loc} in ${Y}, and what does it cost?`];
const fishQ=loc=>[`Where are the best fishing spots in ${loc} in ${Y}?`,`What fish can you catch in ${loc} in ${Y}?`,`When is the best time to fish in ${loc} in ${Y}?`,`What bait and tackle works best for fishing ${loc} in ${Y}?`,`Do you need a fishing license for ${loc} in ${Y}, and what does it cost?`,`What is the best public fishing pier in ${loc} in ${Y}?`,`Can you fish from shore in ${loc} in ${Y}, and where?`];
function gen(qfn){const out=[];const seen=new Set();for(const loc of LOCS)for(const q of qfn(loc)){const k=q.toLowerCase();if(!seen.has(k)){seen.add(k);out.push(q);}}return out;}
(async()=>{
  const idx=await store.get('_index.json',{type:'json',consistency:'strong'});
  const have=new Set((idx.entries||[]).map(e=>String(e.question||'').toLowerCase().trim()));
  let queue=[]; try{queue=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cf_queue.json','utf8'));}catch(e){}
  let maxCr=0,maxFs=0; const inQ=new Set();
  for(const it of queue){ if(it&&it.title)inQ.add(it.title.toLowerCase().trim()); let m=/^cr(\d+)$/.exec(it.id||'');if(m)maxCr=Math.max(maxCr,+m[1]); m=/^fs(\d+)$/.exec(it.id||'');if(m)maxFs=Math.max(maxFs,+m[1]); }
  for(const e of (idx.entries||[])){ let m=/^cr(\d+)$/.exec(e.id||'');if(m)maxCr=Math.max(maxCr,+m[1]); m=/^fs(\d+)$/.exec(e.id||'');if(m)maxFs=Math.max(maxFs,+m[1]); }
  const dedupe=arr=>arr.filter(q=>{const k=q.toLowerCase().trim();return !have.has(k)&&!inQ.has(k);});
  // target total cr/fs (existing + new) up to WANT
  const existCr=queue.filter(x=>x.pillar==='cr').length, existFs=queue.filter(x=>x.pillar==='fs').length;
  const crNew=dedupe(gen(crabQ)).slice(0,Math.max(0,WANT-existCr));
  const fsNew=dedupe(gen(fishQ)).slice(0,Math.max(0,WANT-existFs));
  const pad=n=>String(n).padStart(4,'0');
  const add=[...crNew.map((title,i)=>({id:'cr'+pad(maxCr+1+i),title,pillar:'cr'})),...fsNew.map((title,i)=>({id:'fs'+pad(maxFs+1+i),title,pillar:'fs'}))];
  const merged=queue.concat(add);
  fs.writeFileSync('C:/Users/koryj/website/_cf_queue.json',JSON.stringify(merged,null,1));
  console.log('added cr:',crNew.length,'fs:',fsNew.length,'| queue',queue.length,'->',merged.length,'(cr total '+merged.filter(x=>x.pillar==='cr').length+', fs '+merged.filter(x=>x.pillar==='fs').length+')');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
