const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
function clean(md){
  let t = md;
  t = t.replace(/''/g, "'");                 // un-double apostrophes
  t = t.replace(/’’/g, '’');
  // drop the resume label line (any apostrophe variant)
  t = t.split('\n').filter(ln => !/^\s*\*\*Kory['’]?s resume:?\*\*\s*$/i.test(ln)).join('\n');
  // strip apostrophe from CTA link text -> matches working links
  t = t.replace(/See Kory White['’]?s background on LinkedIn/g, 'See Kory White on LinkedIn');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t;
}
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let changed=0, dbl=0, resume=0, cta=0, okping=0;
 const ids=[];
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'}); if(!e)continue;
  const b=e.answer||''; const a=clean(b);
  if(a!==b){e.answer=a;await s.setJSON('answers/'+id+'.json',e);changed++;ids.push(id);}
  if(/''|’’/.test(a))dbl++;
  if(/\*\*Kory['’]?s resume/i.test(a))resume++;
  if(/background on LinkedIn/.test(a))cta++;
 }
 console.log('cleaned:',changed,'| residual doubled-apos:',dbl,'| residual resume-label:',resume,'| residual CTA-apos:',cta);
 // re-ping changed entries
 for(const id of ids){try{const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id})});const j=await r.json();if(j.ok)okping++;}catch(e){}}
 console.log('re-pinged:',okping+'/'+ids.length);
})();
