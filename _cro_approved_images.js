// _cro_approved_images.js — enforce APPROVED images on CRO/Pulse-Tools content only
// (owner: "cro pulse images require the approved ones; all other pillar ddg can decide").
// For tl entries + q CRO-firm entries, replace any NON-approved image URL (scraped external
// CDNs like website-files.com, pinimg, licdn, amazon, ytimg, squarespace, wixstatic, etc.)
// with the entry's curated approved cover (/assets/cro-cover-{1,3,4,5,6}.jpg by title-hash,
// same rotation as _cro_set_covers.js). Approved/kept as-is: pulserevops.com, /assets, /img,
// wsrv.nl (the CRO Syndicate card proxy), pollinations (generative). Deploy-free blob rewrite.
// Usage: node _cro_approved_images.js [--live]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const LIVE = process.argv.includes('--live');
const COVERS = [1,3,4,5,6];
const coverFor = title => `/assets/cro-cover-${COVERS[[...String(title)].reduce((a,c)=>a+c.charCodeAt(0),0) % COVERS.length]}.jpg`;
const ALLOW = ['pulserevops.com','wsrv.nl','/assets/','/img/','pollinations.ai','image.pollinations','oaidalle','googleusercontent.com/gemini','data:image'];
const ok = u => u.startsWith('/') || ALLOW.some(a => u.includes(a));
const isCroEntry = (id, q) => /^tl\d+$/.test(id) || (/^q\d+$/.test(id) && /fractional cro|\bcro firm|cro firms|chief revenue officer/i.test(q||''));
(async()=>{
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  const targets = (idx.entries||[]).filter(e=>e&&isCroEntry(e.id,e.question));
  let scanned=0, fixed=0, imgsReplaced=0; const CONC=10; let cur=0;
  async function worker(){
    while(cur<targets.length){
      const e=targets[cur++];
      const b=await store.get('answers/'+e.id+'.json',{type:'json'}).catch(()=>null);
      if(!b||!b.answer) continue; scanned++;
      const cover=coverFor(e.question||e.id);
      let body=b.answer, n=0;
      // markdown images: ![alt](url)
      body=body.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g,(full,a,url,c)=>{ if(ok(url)) return full; n++; return a+cover+c; });
      // <img src="url">
      body=body.replace(/(<img[^>]+src=")([^"]+)(")/gi,(full,a,url,c)=>{ if(ok(url)) return full; n++; return a+cover+c; });
      if(n>0){ imgsReplaced+=n; fixed++; if(LIVE){ b.answer=body; b.ts=Date.now(); await store.setJSON('answers/'+e.id+'.json',b); } }
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  console.log((LIVE?'APPLIED':'DRY'),'CRO entries scanned',scanned,'| entries fixed',fixed,'| images replaced',imgsReplaced);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
