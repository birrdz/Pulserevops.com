// _sy_work_occasions.js — expand the Style (sy) taxonomy into WORK + activity occasions
// (owner 2026-06-29: "what to wear to a work baby shower / work sports game / work function /
// snow skiing trip", etc.). Generates gendered "what to wear to {occasion}" Q&As, dedups vs
// index + queue, appends NEW ones to _sy_full_queue.json. Run: node _sy_work_occasions.js [cap]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const Y='2027'; const CAP=parseInt(process.argv[2]||'1000',10);
const work=['a work baby shower','a work sports game','a work function','a work holiday party','a work happy hour','a work conference','a work offsite','a work retreat','a work dinner','a work golf outing','a work networking event','a work award ceremony','a work training day','a work team-building event','a work client meeting','a big work presentation','a work gala','a work fundraiser','a work volunteer day','a work picnic','a work boat outing','work casual Friday','a work trade show','a work product launch','a work board meeting','a work farewell party','a work promotion celebration','a work summer party','a work happy hour after 5','a work breakfast meeting','a work lunch interview','your first day at a new job','a work site visit','a work factory tour','a work convention','a work seminar','a work cocktail event','a work charity event','a work anniversary party','a work town hall','a work strategy offsite','a work sales kickoff','a work onboarding day','a work performance review','a work mixer','a work open house','a work ribbon cutting','a work groundbreaking','a work investor meeting','a work pitch meeting','a sales meeting','a sales kickoff dinner','a work steak dinner','a nice work dinner','a work bar trip','a work brewery outing','a work sports bar night','a client steak dinner','a work cocktail hour','a quarterly business review','a work demo day','a vendor meeting','a work lunch with the CEO','a work coffee meeting'];
const trips=['a snow skiing trip','a ski resort weekend','a beach vacation','a lake house weekend','a camping trip','a hiking trip','a golf trip','a fishing trip','a cruise','a wine-tasting trip','a brewery tour','a mountain getaway','a national park trip','a road trip','a city weekend trip','a spa weekend','a tropical vacation','a winter cabin trip','a tailgate','a music festival','a sporting event','an outdoor concert','a fall apple-picking trip','a pumpkin patch outing','a holiday market'];
const occ=[...work,...trips];
const variants=o=>[`What to wear to ${o} in ${Y}?`,`What should a man wear to ${o} in ${Y}?`,`What should a woman wear to ${o} in ${Y}?`];
(async()=>{
  const idx=await store.get('_index.json',{type:'json',consistency:'strong'});
  const have=new Set((idx.entries||[]).map(e=>String(e.question||'').toLowerCase().trim()));
  let queue=[]; try{queue=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_full_queue.json','utf8'));}catch(e){}
  let maxNum=0; for(const e of (idx.entries||[])){const m=/^sy(\d+)$/.exec(e.id||'');if(m)maxNum=Math.max(maxNum,+m[1]);}
  for(const it of queue){const m=/^sy(\d+)$/.exec(it.id||'');if(m)maxNum=Math.max(maxNum,+m[1]);if(it&&it.title)have.add(it.title.toLowerCase().trim());}
  const fresh=[]; const seen=new Set();
  for(const o of occ) for(const t of variants(o)){const k=t.toLowerCase().trim();if(have.has(k)||seen.has(k))continue;seen.add(k);fresh.push(t);if(fresh.length>=CAP)break;}
  const pad=n=>'sy'+String(n).padStart(4,'0');
  const add=fresh.map((title,i)=>({id:pad(maxNum+1+i),title}));
  const merged=queue.concat(add);
  fs.writeFileSync('C:/Users/koryj/website/_sy_full_queue.json',JSON.stringify(merged,null,1));
  console.log('work/activity style Q&As added:',add.length,'(ids '+(add[0]&&add[0].id)+'..'+(add[add.length-1]&&add[add.length-1].id)+') | queue',queue.length,'->',merged.length);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
