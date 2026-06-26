const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const BANNED=['delve','tapestry','holistic','ever-evolving','synergy','paradigm shift','game-changer','cutting-edge','state-of-the-art','seamless integration','needless to say'];
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let fails=[];
 for(let i=101;i<=110;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e){fails.push(id+': NO BLOB');continue;}
  const a=e.answer||'';
  const words=a.split(/\s+/).filter(Boolean).length;
  const photo=a.includes('/assets/kory-white.jpg');
  const resumes=(a.match(/kory-white-resume-p[123]\.png/g)||[]).length;
  const linkedin=(a.match(/linkedin\.com\/in\/korywhite/gi)||[]).length;
  const faqPairs=(a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm)||[]).length;
  const koryBlock=/##\s*Talk to a Fractional CRO/.test(a);
  const em=(a.match(/—/g)||[]).length;
  const banned=BANNED.filter(b=>a.toLowerCase().includes(b));
  const tags=(e.tags||[]).includes('fractional-cro');
  let probs=[];
  if(words<1650)probs.push('words='+words);
  if(!photo)probs.push('noPhoto');
  if(resumes<3)probs.push('resumes='+resumes);
  if(linkedin<2)probs.push('linkedin='+linkedin);
  if(!koryBlock)probs.push('noKoryHeader');
  if(faqPairs!==4)probs.push('faq='+faqPairs);
  if(em>0)probs.push('emdash='+em);
  if(!tags)probs.push('noTag');
  if(banned.length)probs.push('banned:'+banned.join('/'));
  fails.push((probs.length?'FAIL ':'PASS ')+id+' ('+words+'w, '+resumes+' resumes, '+linkedin+' linkedin)'+(probs.length?' :: '+probs.join(', '):''));
 }
 console.log('FRACTIONAL-CRO AUDIT tl0101-tl0110:');
 console.log(fails.join('\n'));
 console.log(fails.every(f=>f.startsWith('PASS'))?'\nALL 10 PASS':'\nSEE FAILURES ABOVE');
})();
