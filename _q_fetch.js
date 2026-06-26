const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
(async()=>{
  for(const id of process.argv.slice(2)){
    const r=await store.get('answers/'+id+'.json',{type:'json'});
    if(!r){console.log(id,'MISSING');continue;}
    fs.writeFileSync('C:/Users/koryj/'+id+'_answer.md', r.answer);
    console.log('fetched',id);
  }
})();
