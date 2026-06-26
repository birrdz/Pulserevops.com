// Backfill: drop the literal "9 KPIs" framing from KPI entries (SEO change, 2026-06-18).
// Retitles questions to "best / most important KPIs" and rewrites the in-body heading +
// prose. Direct blob re-store (content already gold; we only reword the count).
const fs=require('fs');
for(const ln of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){const m=ln.match(/^([A-Z_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const {getStore}=require('@netlify/blobs');
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN;

function fixTitle(s){
  let t=s;
  t=t.replace(/\bThe\s+9\s+Key\s+KPIs\b/gi,'The Best KPIs');
  t=t.replace(/\bthe\s+9\s+KPIs\b/g,'the most important KPIs');
  t=t.replace(/\bThe\s+9\s+KPIs\b/g,'The Most Important KPIs');
  t=t.replace(/\b9\s+Key\s+KPIs\b/gi,'Best KPIs');
  t=t.replace(/\bthe\s+nine\s+KPIs\b/gi,'the most important KPIs');
  t=t.replace(/\bNine\s+KPIs\b/g,'Key KPIs');
  t=t.replace(/\bnine\s+KPIs\b/g,'key KPIs');
  t=t.replace(/\b9\s+KPIs\b/g,'key KPIs');
  return t;
}
function fixBody(s){
  let b=s;
  // section heading -> SEO-neutral
  b=b.replace(/((?:^|\n)\s*#{2,3}\s*)(?:The\s+)?(?:9|Nine)[-\s]+KPIs?\s+In\s+Depth/gi,'$1The KPIs That Matter Most');
  b=b.replace(/(<h[23][^>]*>\s*)(?:The\s+)?(?:9|Nine)[-\s]+KPIs?\s+In\s+Depth/gi,'$1The KPIs That Matter Most');
  // prose
  b=b.replace(/\bthese\s+9\s+KPIs\b/gi,'these KPIs');
  b=b.replace(/\ball\s+9\s+KPIs\b/gi,'all of these KPIs');
  b=b.replace(/\bthe\s+9\s+KPIs\b/g,'the most important KPIs');
  b=b.replace(/\bThe\s+9\s+KPIs\b/g,'The Most Important KPIs');
  b=b.replace(/\b9\s+Key\s+KPIs\b/gi,'the best KPIs');
  b=b.replace(/\bthese\s+nine\s+KPIs\b/gi,'these KPIs');
  b=b.replace(/\bthe\s+nine\s+KPIs\b/gi,'the most important KPIs');
  b=b.replace(/\bNine\s+KPIs\b/g,'Key KPIs');
  b=b.replace(/\bnine\s+KPIs\b/g,'key KPIs');
  b=b.replace(/\b9\s+KPIs\b/g,'key KPIs');
  b=b.replace(/\b9\s+key\s+metrics\b/gi,'the key metrics');
  b=b.replace(/\bnine\s+key\s+metrics\b/gi,'the key metrics');
  return b;
}

(async()=>{
  const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
  const idx=await s.get('_index.json',{type:'json'})||{entries:[]};
  const targets=idx.entries.filter(e=>/^ik\d+/.test(e.id||'')&&/\bnine\b|\b9\b/i.test(e.question||''));
  console.log('targets:',targets.length);
  let changed=0; const changedIds=[];
  for(const ie of targets){
    const id=ie.id;
    const e=await s.get('answers/'+id+'.json',{type:'json'});
    if(!e){console.log('MISSING blob',id);continue;}
    const newQ=fixTitle(e.question||'');
    const newBody=fixBody(e.answer||'');
    if(newQ===e.question && newBody===e.answer){continue;}
    e.question=newQ; e.answer=newBody;
    await s.setJSON('answers/'+id+'.json',e);
    // update index question
    const i=idx.entries.findIndex(x=>x&&x.id===id);
    if(i>=0) idx.entries[i].question=newQ;
    changed++; changedIds.push(id);
  }
  await s.setJSON('_index.json',idx);
  console.log('rewrote',changed,'entries');
  fs.writeFileSync('_ik9_changed.json',JSON.stringify(changedIds));
  console.log('sample new titles:');
  for(const id of changedIds.slice(0,6)){const e=await s.get('answers/'+id+'.json',{type:'json'});console.log(' ',id,'->',e.question);}
})().catch(e=>{console.log('ERR',e.message);process.exit(1);});
