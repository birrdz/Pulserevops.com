// Targeted finisher: fills a leading cover image on the entries that STILL lack
// one (the ~622 DDG returned nothing for). Uses smarter query variants:
//   1) keyword-simplified question (strip "how do you / what is / in 20XX / ...")
//   2) pillar-topic fallback by id prefix
// Foreground-friendly, low concurrency. Never removes; only adds.
const fs=require('fs');
const { getStore }=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const prefixOf=id=>(String(id).match(/^([a-z]+)\d+$/i)||[])[1]||'';
const num=id=>{const m=String(id).match(/\d+/);return m?parseInt(m[0],10):0;};
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// pillar-topic fallback queries
const TOPIC={q:'revenue operations business strategy',gp:'go to market strategy',ra:'revenue growth architecture',ik:'business KPI dashboard',st:'sales team training meeting',tk:'business software technology stack',bs:'business strategy book',cg:'business data chart',gb:'business infographic',sp:'public speaking podium',sk:'team workshop skills',sy:'professional business fashion',fr:'franchise storefront business',tl:'business calculator tools'};
const STOP=/^(how|what|whats|what's|why|when|where|who|which|should|is|are|do|does|did|can|could|the|a|an|to|of|in|for|on|with|your|you|my|i|it|and|or)$/i;

function variants(q,pre){
  let t=String(q||'').replace(/[?.!]+$/,'').replace(/\bin\s+20\d\d\b/gi,'').replace(/\b20\d\d\b/g,'').trim();
  const full=t.slice(0,120);
  // core keywords: drop leading question scaffolding, keep first ~6 significant words
  const words=t.split(/\s+/).filter(w=>w.length>1);
  const sig=words.filter(w=>!STOP.test(w.replace(/[^A-Za-z']/g,'')));
  const core=sig.slice(0,6).join(' ');
  const out=[];
  if(core&&core.length>3)out.push(core);
  if(full&&full!==core)out.push(full);
  if(TOPIC[pre])out.push(TOPIC[pre]);
  out.push('business professional concept');
  return [...new Set(out)];
}
async function headOk(url){try{const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(9000)});const ct=(r.headers.get('content-type')||'').toLowerCase();if(r.ok&&ct.startsWith('image/'))return true;const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(9000)});return g.ok&&(g.headers.get('content-type')||'').toLowerCase().startsWith('image/');}catch(e){return false;}}
async function ddgImages(q,attempt=0){
  try{
    const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(q)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
    const html=await tp.text();const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);
    if(!m){if(attempt<3){await sleep(1500+attempt*1500);return ddgImages(q,attempt+1);}return[];}
    await sleep(120);
    const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(q)+'&vqd='+m[1]+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(r.status===429||r.status===403){if(attempt<4){await sleep(3000+attempt*3000);return ddgImages(q,attempt+1);}return[];}
    let j;try{j=JSON.parse(await r.text());}catch(e){if(attempt<3){await sleep(2000);return ddgImages(q,attempt+1);}return[];}
    return (j.results||[]).map(x=>x.image).filter(Boolean);
  }catch(e){if(attempt<3){await sleep(1500);return ddgImages(q,attempt+1);}return[];}
}
async function pickImage(q,pre){
  for(const v of variants(q,pre)){
    const arr=await ddgImages(v);
    for(const img of arr.slice(0,10)){ if(await headOk(img)) return {img,via:v}; }
  }
  return null;
}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}

(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const entries=(idx.entries||[]).filter(e=>e&&e.id);
  console.log('scanning',entries.length,'for entries still missing a lead image...');
  // find the ones lacking a lead image
  const need=[];let c0=0;const CS=14;
  async function scan(){while(c0<entries.length){const e0=entries[c0++];const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);if(!e||!e.answer)continue;if(/^﻿?\s*!\[/.test(e.answer))continue;need.push(e0);}}
  await Promise.all(Array.from({length:CS},scan));
  need.sort((a,b)=>{const pa=prefixOf(a.id),pb=prefixOf(b.id);return pa===pb?num(a.id)-num(b.id):pa<pb?-1:1;});
  console.log('still missing:',need.length);
  let done=0,fail=0,cur=0;const CONC=4;
  async function worker(){
    while(cur<need.length){
      const e0=need[cur++];
      const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);
      if(!e||!e.answer){continue;}
      if(/^﻿?\s*!\[/.test(e.answer)){continue;}
      const got=await pickImage(e0.question||e0.title||e0.id, prefixOf(e0.id));
      if(!got){fail++;console.log('  STILL no-img',e0.id);continue;}
      e.answer=e.answer.replace(/^﻿/,'');
      const alt=String(e0.question||e0.title||'').replace(/[\[\]]/g,'').slice(0,90);
      e.answer=`![${alt}](${got.img})\n\n`+e.answer.replace(/^\n+/,'');
      e.ts=Date.now();e.polished_at=Date.now();
      await s.setJSON('answers/'+e0.id+'.json',e);
      await pingIndexNow(e0.id);
      done++;
      if(done%10===0)console.log(`  [${done}] +img ${e0.id} via "${got.via.slice(0,40)}"`);
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  console.log(`\nFINISH DONE. added=${done} stillNoImg=${fail} of ${need.length}`);
  fs.writeFileSync('C:/Users/koryj/website/_img_finish_result.json',JSON.stringify({missing:need.length,added:done,stillNoImg:fail},null,1));
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
