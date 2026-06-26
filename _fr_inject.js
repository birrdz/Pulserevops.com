// Stamps fr_rank / fr_total / fr_score / fr_name onto every fr#### blob from
// _fr_rank.json so the entry renderer can draw a big rank badge. Idempotent.
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const j=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_fr_rank.json','utf8'));
const total=j.total;
const byId={};for(const r of j.ranks)byId[r.id]=r;
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
(async()=>{
  const ids=Object.keys(byId);
  console.log('stamping',ids.length,'fr entries (total='+total+')');
  let done=0,cur=0;const CONC=12;
  async function w(){while(cur<ids.length){const id=ids[cur++];const r=byId[id];
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);if(!e)continue;
    e.fr_rank=r.rank;e.fr_total=total;e.fr_score=Math.round(r.score*100)/100;e.fr_name=r.name;
    await s.setJSON('answers/'+id+'.json',e);
    done++;if(done%100===0){console.log('  '+done+'/'+ids.length);await pingIndexNow(id);}
  }}
  await Promise.all(Array.from({length:CONC},w));
  console.log('DONE stamped='+done);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
