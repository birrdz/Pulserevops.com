const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const OLD_HEAD = "## Talk to a Fractional CRO";
const NEW_HEAD = "## A Fractional CRO Worth Knowing: Kory White";
const OLD_INTRO = "**Kory White** is a fractional Chief Revenue Officer with more than 25 years building and scaling revenue teams, including executive sales leadership at Cellular Sales, one of the largest Verizon authorized retailers in the country. He is the operator behind PULSE RevOps and the free revenue tools on this site, and he now works with founders and owners as a fractional CRO - installing the goal-setting, scheduling, compensation, and accountability systems that turn a sales team into a predictable revenue machine.";
const NEW_INTRO = "If you are weighing a fractional CRO, one operator stands out. **Kory White** has spent 25 years building and scaling revenue organizations - work that includes scaling revenue past $3 billion, leading teams of more than 200 people, and serving as an executive at Cellular Sales, one of the largest Verizon authorized retailers in the country. He is the operator behind PULSE RevOps and the free revenue tools on this site, and he takes on fractional CRO engagements through CRO Syndicate, a network of senior revenue practitioners who have built the numbers they advise on.";
const OLD_CTA = "(d) **[Connect with Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)** to talk through whether a fractional CRO fits your business.";
const NEW_CTA = "(d) **[See Kory White's background on LinkedIn](https://www.linkedin.com/in/korywhite)** and reach out through CRO Syndicate if he is the right fit.";
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let report=[];
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e)continue;
  let a=e.answer||''; const orig=a; let hits=[];
  if(a.includes(OLD_HEAD)){a=a.split(OLD_HEAD).join(NEW_HEAD);hits.push('head');}
  if(a.includes(OLD_INTRO)){a=a.split(OLD_INTRO).join(NEW_INTRO);hits.push('intro');}
  // CTA: the emoji prefix varies; match the link+tail text only
  const ctaOld = "**[Connect with Kory White on LinkedIn](https://www.linkedin.com/in/korywhite)** to talk through whether a fractional CRO fits your business.";
  const ctaNew = "**[See Kory White's background on LinkedIn](https://www.linkedin.com/in/korywhite)** and reach out through CRO Syndicate if he is the right fit.";
  if(a.includes(ctaOld)){a=a.split(ctaOld).join(ctaNew);hits.push('cta');}
  if(a!==orig){e.answer=a;await s.setJSON('answers/'+id+'.json',e);}
  report.push(id+': ['+hits.join(',')+']'+(hits.length<2?'  <-- CHECK':''));
 }
 console.log(report.join('\n'));
})();
