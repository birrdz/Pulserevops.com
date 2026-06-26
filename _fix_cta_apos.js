const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const RX = /See Kory White[’'‘]?s background on LinkedIn/g;
const NEW = 'See Kory White on LinkedIn';
// also fix local spec/exemplar files
for (const f of ['_FCRO_SPEC2.md','_FCRO_EXEMPLAR.md']) { try { const t=fs.readFileSync(f,'utf8'); fs.writeFileSync(f, t.replace(RX,NEW)); } catch(e){} }
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let changed=0, residual=0;
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'}); if(!e)continue;
  const b=e.answer||''; const a=b.replace(RX,NEW);
  if(a!==b){e.answer=a;await s.setJSON('answers/'+id+'.json',e);changed++;}
  if(/background on LinkedIn/.test(a)) residual++;
 }
 console.log('apostrophe CTA fixed this pass:',changed,' | entries still showing "background on LinkedIn":',residual);
})();
