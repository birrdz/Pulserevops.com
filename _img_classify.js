// READ-ONLY. For each prefix, sample entries and report whether the pillar uses
// @@PRODUCT cards at all (=> true Top-10 product pillar) or never (=> essay pillar
// that only needs a single cover image despite numbered ## headings).
const fs=require('fs');
const { getStore }=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const prefixOf=id=>(String(id).match(/^([a-z]+)\d+$/i)||[])[1]||'(other)';
(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const byPre={};
  for(const e of idx.entries){const p=prefixOf(e.id);(byPre[p]=byPre[p]||[]).push(e.id);}
  const out={};
  const pres=Object.keys(byPre).sort();
  for(const p of pres){
    const ids=byPre[p];
    // sample up to 8 spread across the prefix
    const step=Math.max(1,Math.floor(ids.length/8));
    const sample=[];for(let i=0;i<ids.length&&sample.length<8;i+=step)sample.push(ids[i]);
    let withProduct=0,withLead=0,n=0;
    for(const id of sample){
      const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
      if(!e||!e.answer)continue;n++;
      if(/@@PRODUCT/.test(e.answer))withProduct++;
      if(/^﻿?\s*!\[/.test(e.answer))withLead++;
    }
    out[p]={n,withProduct,withLead,kind:withProduct>0?'PRODUCT':'essay'};
    console.log(`${p.padEnd(8)} sampled=${n} withProduct=${withProduct} withLeadImg=${withLead}  => ${out[p].kind}`);
  }
  fs.writeFileSync('C:/Users/koryj/website/_img_classify.json',JSON.stringify(out,null,1));
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
