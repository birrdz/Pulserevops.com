// Revert in-place story rewrites (editorial_style on NON-ed entries) back to their
// original encyclopedia answers. Editorials live in the ed#### pillar now; the
// source Q&As must be the clean factual originals. Skips ed#### (those ARE editorials).
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const DRY=process.argv.includes('--dry');
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const idx=await store.get('_index.json',{type:'json'});
  const targets=idx.entries.filter(e=>e&&e.editorial_style&&!/^ed\d+$/.test(e.id)).map(e=>e.id);
  console.log('to restore:',targets.length);
  let restored=0,skip=0;
  for(const id of targets){const b=await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);if(!b){skip++;continue;}
    if(b.answer_orig){if(!DRY){b.answer=b.answer_orig;delete b.editorial_style;b.polished_at=Date.now();await store.setJSON('answers/'+id+'.json',b);}restored++;}else{skip++;}
  }
  console.log(JSON.stringify({dry:DRY,restored,skip}));
})().catch(e=>console.log('ERR '+e.message));
