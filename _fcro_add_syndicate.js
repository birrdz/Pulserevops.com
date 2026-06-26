const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const OLD_HEAD = '## A Fractional CRO Worth Knowing: Kory White';
const NEW_HEAD = '## Recommended Fractional CRO Near You: Kory White';
const CTA = '👉 **[See Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)** and reach out through CRO Syndicate if he is the right fit.';
const SYND = '👉 **[Visit CRO Syndicate](https://www.crosyndicate.com)** to find a recommended fractional CRO near you.';
function patch(md){
  let t = md;
  t = t.split(OLD_HEAD).join(NEW_HEAD);
  if(!t.includes('crosyndicate.com') && t.includes(CTA)){
    t = t.split(CTA).join(CTA + '\n\n' + SYND);
  }
  return t;
}
for (const f of ['_FCRO_SPEC2.md','_FCRO_EXEMPLAR.md']) { try { fs.writeFileSync(f, patch(fs.readFileSync(f,'utf8'))); } catch(e){} }
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let head=0, synd=0;
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'}); if(!e)continue;
  const b=e.answer||''; const a=patch(b);
  if(a!==b){e.answer=a;await s.setJSON('answers/'+id+'.json',e);}
  if(/Recommended Fractional CRO Near You/.test(a))head++;
  if(/crosyndicate\.com/.test(a))synd++;
 }
 console.log('with new heading:',head+'/50','| with crosyndicate link:',synd+'/50');
})();
