// _bad_image_scan.js — WHOLE-SITE scan for INCORRECT images (owner: "make sure no other
// images have incorrect images"). Flags markdown/HTML images whose host is NOT an approved
// source. Approved = the site itself (pulserevops.com, /assets, /img, relative), the wsrv.nl
// hotlink proxy, and the generative-image hosts the pipeline uses. Anything else — esp.
// scraped competitor CDNs (Webflow website-files.com, squarespace, wixstatic, shopify,
// substack, etc.) — is flagged. Writes _bad_image_queue.json. READ-ONLY.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
// approved image hosts (substring match on the URL)
const ALLOW = ['pulserevops.com','wsrv.nl','/assets/','/img/','pollinations.ai','image.pollinations','oaidalle','googleusercontent.com/gemini','data:image'];
const isAllowed = u => u.startsWith('/') || ALLOW.some(a => u.includes(a));
const hostOf = u => { try { return new URL(u).host; } catch(e){ return u.startsWith('/')?'(relative)':'(?)'; } };
const pillarOf = id => (String(id).match(/^([a-z]{1,4})\d/)||[,'other'])[1];
(async()=>{
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  const entries = (idx.entries||[]).filter(e=>e&&/^[a-z]{1,4}\d+$/.test(e.id||''));
  const flagged=[]; const hostCount={}; let scanned=0;
  const CONC=12; let cur=0;
  async function worker(){
    while(cur<entries.length){
      const e=entries[cur++];
      const b=await store.get('answers/'+e.id+'.json',{type:'json'}).catch(()=>null);
      if(!b||!b.answer) continue; scanned++;
      const urls=[];
      for(const m of b.answer.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) urls.push(m[1]);
      for(const m of b.answer.matchAll(/<img[^>]+src="([^"]+)"/gi)) urls.push(m[1]);
      const bad=urls.filter(u=>!isAllowed(u));
      if(bad.length){
        flagged.push({id:e.id,pillar:pillarOf(e.id),title:e.question,bad:[...new Set(bad)]});
        for(const u of new Set(bad)){ const h=hostOf(u); hostCount[h]=(hostCount[h]||0)+1; }
      }
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  flagged.sort((a,b)=>a.pillar.localeCompare(b.pillar)||a.id.localeCompare(b.id));
  fs.writeFileSync('C:/Users/koryj/website/_bad_image_queue.json', JSON.stringify(flagged,null,1));
  console.log('SCANNED',scanned,'| entries with INCORRECT images:',flagged.length);
  console.log('--- offending hosts (count) ---');
  for(const [h,n] of Object.entries(hostCount).sort((a,b)=>b[1]-a[1]).slice(0,25)) console.log('  '+String(n).padStart(5),h);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
