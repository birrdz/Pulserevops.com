const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
function strip(md){
  const lines = md.split('\n');
  const out = [];
  for (const ln of lines){
    if (/kory-white-resume-p[123]\.png/.test(ln)) continue;            // drop resume image lines
    if (/^\*\*Kory.?s resume:?\*\*\s*$/i.test(ln.trim())) continue;     // drop "Kory's resume:" label
    out.push(ln);
  }
  // collapse 3+ blank lines to 1 blank
  return out.join('\n').replace(/\n{3,}/g,'\n\n');
}
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let changed=0,still=0;
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e)continue;
  const before=e.answer||''; const after=strip(before);
  if(after!==before){e.answer=after;await s.setJSON('answers/'+id+'.json',e);changed++;}
  if(/kory-white-resume/.test(after))still++;
 }
 console.log('resume stripped: changed='+changed+'  still-have-resume='+still);
}) ();
