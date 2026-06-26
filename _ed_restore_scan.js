// Restore drifted in-place story rewrites by SCANNING blobs (editorial_style lives
// on the blob, not the index). Reverts answer=answer_orig for non-ed entries.
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const PREFIXES=['q13','q14','q15','q16'];
(async()=>{
  const s=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  let ids=[];for(const p of PREFIXES){let c;do{const r=await s.list({prefix:'answers/'+p,cursor:c});for(const b of r.blobs){const m=b.key.match(/^answers\/(q\d+)\.json$/);if(m)ids.push(m[1]);}c=r.cursor;}while(c);}
  ids=[...new Set(ids)];
  let i=0,restored=0,checked=0;const CONC=12;
  async function w(){while(i<ids.length){const id=ids[i++];const b=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);if(!b)continue;checked++;
    if(b.editorial_style&&b.answer_orig){b.answer=b.answer_orig;delete b.editorial_style;b.polished_at=Date.now();await s.setJSON('answers/'+id+'.json',b);restored++;}}}
  await Promise.all(Array.from({length:CONC},()=>w()));
  console.log(JSON.stringify({checked,restored}));
})().catch(e=>console.log('ERR '+e.message));
