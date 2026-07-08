// _qa_format_diag.js — READ ONLY. Measure how many answer bodies start with a
// markdown image line and/or a single-# H1 (the two things renderMd mangles).
const fs = require('fs');
for (const f of ['.env.local', '.env']) { try { for (const ln of fs.readFileSync(f,'utf8').split(/\r?\n/)){const m=ln.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');} } catch(e){} }
const { getStore } = require('@netlify/blobs');
const firstLines = (s) => String(s||'').replace(/\r\n/g,'\n').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,3);
const startsImg = (s) => { const l=firstLines(s); return l[0] && /^!\[.*\]\(.*\)$/.test(l[0]); };
const hasLeadH1 = (s) => firstLines(s).some(l => /^#\s+\S/.test(l)); // single # within first 3 non-empty lines
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:process.env.SITE_ID||'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
  const idx=await store.get('_index.json',{type:'json',consistency:'strong'});
  const ents=idx.entries.filter(e=>e&&e.id);
  console.log('total index entries:', ents.length);
  // Sample the newest 400 for body inspection (fetching all 22k is too slow here).
  const sample=ents.slice().sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,400);
  let img=0,h1=0,both=0,neither=0; const examples=[];
  for(const e of sample){
    let a; try{ a=await store.get('answers/'+e.id+'.json',{type:'json'}); }catch(err){ continue; }
    if(!a||!a.answer) continue;
    const si=startsImg(a.answer), sh=hasLeadH1(a.answer);
    if(si)img++; if(sh)h1++; if(si&&sh)both++; if(!si&&!sh)neither++;
    if(examples.length<5&&(si||sh)) examples.push(e.id+' img='+si+' h1='+sh+' | first: '+JSON.stringify(firstLines(a.answer)[0]));
  }
  console.log('sampled newest:', sample.length);
  console.log('  leading markdown image (![..](..)):', img);
  console.log('  leading single-# H1:', h1);
  console.log('  both:', both, '| neither:', neither);
  console.log('examples:'); examples.forEach(x=>console.log('  '+x));
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
