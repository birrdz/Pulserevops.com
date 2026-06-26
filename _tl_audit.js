const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const BANNED=['delve','tapestry','holistic','ever-evolving','synergy','paradigm shift','game-changer','cutting-edge','state-of-the-art','seamless integration','needless to say','it\'s worth noting','it\'s important to note'];
const schedIds=new Set();for(let i=1;i<=10;i++)schedIds.add(i);for(let i=61;i<=100;i++)schedIds.add(i);
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let fails=[];
 for(let i=1;i<=100;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e){fails.push(id+': NO BLOB');continue;}
  const a=e.answer||'';
  const numItems=(a.match(/^##\s+\d+\.\s/gm)||[]).length;
  const wantLink=schedIds.has(i)?'/tools/rep-scheduling':'/tools/recruiting-calculator';
  const linkCount=a.split(wantLink).length-1;
  const mdLink=a.includes('](' + wantLink + ')');
  const faqPairs=(a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm)||[]).length;
  const best=/🏆\s*BEST OVERALL/.test(a);
  const value=/💎\s*BEST VALUE/.test(a);
  const em=(a.match(/—/g)||[]).length;
  const banned=BANNED.filter(b=>a.toLowerCase().includes(b));
  let probs=[];
  if(numItems!==10)probs.push('items='+numItems);
  if(linkCount<2)probs.push('linkCount='+linkCount);
  if(!mdLink)probs.push('noClickableLink');
  if(faqPairs<4)probs.push('faq='+faqPairs);
  if(!best)probs.push('noBESTOVERALL');
  if(!value)probs.push('noBESTVALUE');
  if(em>0)probs.push('emdash='+em);
  if(banned.length)probs.push('banned:'+banned.join('/'));
  if(probs.length)fails.push(id+': '+probs.join(', '));
 }
 console.log('AUDITED 100 entries (sched='+[...schedIds].length+' recruit=50)');
 console.log(fails.length?('ISSUES ('+fails.length+'):\n'+fails.join('\n')):'ALL 100 PASS: exactly 10 items, clickable tool link x2+, 4+ FAQ pairs, BEST OVERALL + BEST VALUE, 0 em dash, 0 banned words');
})();
