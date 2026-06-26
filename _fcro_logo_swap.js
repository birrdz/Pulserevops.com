const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const FROM='/cro-syndicate-logo.svg', TO='/cro-syndicate-logo.png';
for(const f of ['_FCRO_SPEC2.md','_FCRO_EXEMPLAR.md']){try{fs.writeFileSync(f,fs.readFileSync(f,'utf8').split(FROM).join(TO));}catch(e){}}
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let c=0;
 for(let i=101;i<=150;i++){const id='tl'+String(i).padStart(4,'0');const e=await s.get('answers/'+id+'.json',{type:'json'});if(!e)continue;const b=e.answer||'';if(b.includes(FROM)){e.answer=b.split(FROM).join(TO);await s.setJSON('answers/'+id+'.json',e);c++;}}
 console.log('in-body logo swapped to .png in',c,'entries');
})();
