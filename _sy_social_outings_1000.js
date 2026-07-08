// _sy_social_outings_1000.js — owner (2026-06-29): "do a thousand more style pulse, start with
// what to wear to different sorts of SOCIAL OUTINGS at work." The base work-occasions pool was
// exhausted, so this scales it by crossing work SOCIAL outings × natural modifiers (season,
// dress code, role, age, body type) × gendered variants. Dedups vs index + queue, appends NEW
// ones to _sy_full_queue.json, ids from trueMax+1. Run: node _sy_social_outings_1000.js [cap]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const Y='2027'; const CAP=parseInt(process.argv[2]||'1000',10);
// work SOCIAL outings (the "two different sorts" + many more) — these come FIRST.
const outings=['a work happy hour','a work holiday party','a work cocktail hour','a work brewery outing','a work sports bar night','a work bar trip','a work dinner','a work steak dinner','a work networking event','a work mixer','a work summer party','a work boat outing','a work golf outing','a work gala','a work fundraiser','a work charity event','a work picnic','a work farewell party','a work promotion celebration','a work anniversary party','a client steak dinner','a sales kickoff dinner','a work after-party','a work rooftop party','a work wine night'];
// natural modifiers that read cleanly appended after the outing.
const mods=['in the winter','in the summer','in the fall','in the spring','when it is hot out','when it is cold out','as a new employee','as a new manager','as an executive','in your 20s','in your 30s','in your 40s','in your 50s','when you are plus-size','when you are petite','when you are tall','on a budget','outdoors','at a nice restaurant','at a casual bar','straight from the office','when the dress code is business casual','when the dress code is cocktail attire','when the dress code is black tie','for an introvert','when you do not drink'];
const variants=(o,m)=>[`What to wear to ${o} ${m} in ${Y}?`,`What should a man wear to ${o} ${m} in ${Y}?`,`What should a woman wear to ${o} ${m} in ${Y}?`];
(async()=>{
  const idx=await store.get('_index.json',{type:'json',consistency:'strong'});
  const have=new Set((idx.entries||[]).map(e=>String(e.question||'').toLowerCase().trim()));
  let queue=[]; try{queue=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_full_queue.json','utf8'));}catch(e){}
  let maxNum=0; for(const e of (idx.entries||[])){const m=/^sy(\d+)$/.exec(e.id||'');if(m)maxNum=Math.max(maxNum,+m[1]);}
  for(const it of queue){const m=/^sy(\d+)$/.exec(it.id||'');if(m)maxNum=Math.max(maxNum,+m[1]);if(it&&it.title)have.add(it.title.toLowerCase().trim());}
  const fresh=[]; const seen=new Set();
  // outing-outer / mod-inner so the queue STARTS with social-outing variety
  outer: for(const o of outings) for(const m of mods) for(const t of variants(o,m)){const k=t.toLowerCase().trim();if(have.has(k)||seen.has(k))continue;seen.add(k);fresh.push(t);if(fresh.length>=CAP)break outer;}
  const pad=n=>'sy'+String(n).padStart(4,'0');
  const add=fresh.map((title,i)=>({id:pad(maxNum+1+i),title}));
  const merged=queue.concat(add);
  fs.writeFileSync('C:/Users/koryj/website/_sy_full_queue.json',JSON.stringify(merged,null,1));
  console.log('work social-outing style Q&As added:',add.length,'(ids '+(add[0]&&add[0].id)+'..'+(add[add.length-1]&&add[add.length-1].id)+') | queue',queue.length,'->',merged.length);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
