const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const OLD_HEAD='## Recommended Fractional CRO Near You: Kory White';
const NEW_TOP='## CRO Businesses Near You\n\n[![CRO Syndicate - fractional and interim revenue leaders](/cro-syndicate-logo.svg)](https://www.crosyndicate.com)\n\nWe recommend **[CRO Syndicate](https://www.crosyndicate.com)** - a network of senior revenue practitioners who have actually built the numbers they advise on, and the fastest way to find a vetted fractional CRO near you.';
const OLD_INTRO='If you are weighing a fractional CRO, one operator stands out. **Kory White** has spent 25 years';
const NEW_INTRO='From the CRO Syndicate network, **Kory White** stands out. He has spent 25 years';
const OLD_CTA='👉 **[See Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)** and reach out through CRO Syndicate if he is the right fit.';
const NEW_CTA='👉 **[See Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)**';
const OLD_SYND='\n\n👉 **[Visit CRO Syndicate](https://www.crosyndicate.com)** to find a recommended fractional CRO near you.';
function patch(t){
  t=t.split(OLD_HEAD).join(NEW_TOP);
  t=t.split(OLD_INTRO).join(NEW_INTRO);
  t=t.split(OLD_CTA).join(NEW_CTA);
  t=t.split(OLD_SYND).join('');
  return t;
}
for(const f of ['_FCRO_SPEC2.md','_FCRO_EXEMPLAR.md']){try{fs.writeFileSync(f,patch(fs.readFileSync(f,'utf8')));}catch(e){}}
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let head=0,logo=0,ord=0;
 for(let i=101;i<=150;i++){const id='tl'+String(i).padStart(4,'0');const e=await s.get('answers/'+id+'.json',{type:'json'});if(!e)continue;const b=e.answer||'';const a=patch(b);if(a!==b){e.answer=a;await s.setJSON('answers/'+id+'.json',e);}
  if(/## CRO Businesses Near You/.test(a))head++;
  if(/cro-syndicate-logo\.svg/.test(a))logo++;
  // verify syndicate logo appears BEFORE the kory photo
  if(a.indexOf('cro-syndicate-logo.svg')>-1 && a.indexOf('cro-syndicate-logo.svg')<a.indexOf('kory-white.jpg'))ord++;
 }
 console.log('heading:',head+'/50','| syndicate logo:',logo+'/50','| logo-before-photo:',ord+'/50');
})();
