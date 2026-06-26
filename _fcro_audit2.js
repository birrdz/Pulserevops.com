const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const BANNED=['delve','tapestry','holistic','ever-evolving','synergy','paradigm shift','game-changer','cutting-edge','state-of-the-art','seamless integration','needless to say'];
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 let fails=[],pass=0;
 for(let i=101;i<=150;i++){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e){fails.push(id+': NO BLOB');continue;}
  const a=e.answer||'';
  const words=a.split(/\s+/).filter(Boolean).length;
  const probs=[];
  if(words<1650)probs.push('words='+words);
  if(!a.includes('/assets/kory-white.jpg'))probs.push('noPhoto');
  if((a.match(/kory-white-resume-p[123]\.png/g)||[]).length<3)probs.push('resumes');
  if((a.match(/linkedin\.com\/in\/korywhite/gi)||[]).length<2)probs.push('linkedin');
  if(!/A Fractional CRO Worth Knowing/.test(a))probs.push('noEditorialHead');
  if(!/CRO Syndicate/.test(a))probs.push('noCROSyndicate');
  if(!/\$3 billion/.test(a))probs.push('no$3B');
  if((a.match(/^\*\*[^*\n]+\?\*\*\s*$/gm)||[]).length!==4)probs.push('faq!=4');
  if(/—/.test(a))probs.push('emdash');
  const banned=BANNED.filter(b=>a.toLowerCase().includes(b)); if(banned.length)probs.push('banned:'+banned.join('/'));
  if(probs.length)fails.push(id+': '+probs.join(', ')); else pass++;
 }
 console.log('FRACTIONAL-CRO FINAL AUDIT (tl0101-tl0150): '+pass+'/50 pass');
 if(fails.length)console.log('ISSUES:\n'+fails.join('\n')); else console.log('ALL 50 PASS: editorial block, CRO Syndicate, $3B stat, photo+3 resumes+LinkedIn, 4 FAQ, no em dash, no banned, 1650+ words');
 // re-ping all 50 (content was reframed)
 let ok=0;
 for(let i=101;i<=150;i++){const id='tl'+String(i).padStart(4,'0');try{const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id})});const j=await r.json();if(j.ok)ok++;}catch(e){}}
 console.log('IndexNow re-ping: '+ok+'/50');
})();
