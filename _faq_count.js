// Accurate live count of entries still missing a FAQ, per prefix.
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const hasFAQ=a=>/^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
const PRE=(process.argv[2]||'q,sp').split(',');
(async()=>{
  const idx=await s.get('_index.json',{type:'json'});
  for(const pre of PRE){
    const list=idx.entries.map(e=>e.id).filter(id=>new RegExp('^'+pre+'\\d+$').test(id));
    let miss=0,cur=0;const CONC=16;
    async function w(){while(cur<list.length){const id=list[cur++];const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);if(e&&e.answer&&!hasFAQ(e.answer))miss++;}}
    await Promise.all(Array.from({length:CONC},w));
    console.log(pre+': '+miss+' missing FAQ of '+list.length);
  }
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
