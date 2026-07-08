// Generalized single-image-per-entry backfill for essay/visual pillars that have
// ONE natural representative image (book cover, speaker portrait, generic topic
// image) rather than a Top-10 product list. Keyless DuckDuckGo. Extracts a query
// from the entry title, finds one HEAD-valid image, and prepends it as a standalone
// markdown image. Skips entries that already have a leading image. Never removes.
//   node _cover_img_any.js <prefix> <suffix> [--dry]
//     bs "book cover"     speeches/sp "portrait"     sk ""    (suffix may be empty: '')
const fs=require('fs');
const { getStore }=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const PREFIX=(process.argv[2]||'').toLowerCase();
const SUFFIX=process.argv[3]!==undefined?process.argv[3]:'';
const DRY=process.argv.includes('--dry');
const SINCE=+(((process.argv.find(a=>a.startsWith('--since='))||'').split('=')[1])||0); // only entries with ts>=SINCE (today-and-forward scoping)
if(!PREFIX){console.error('Usage: node _cover_img_any.js <prefix> <suffix> [--dry]');process.exit(1);}
const isId=(id)=>id.slice(0,PREFIX.length)===PREFIX && /^[0-9]+$/.test(id.slice(PREFIX.length));
const num=id=>parseInt(String(id).match(/\d+/)[0],10);
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// Build a clean image query from a title: drop year tails, "Cliff Notes Summary",
// leading "How/What/Who" question scaffolding, trailing punctuation.
function queryFrom(q){
  let t=String(q||'');
  t=t.replace(/\s*[—-]\s*Cliff Notes.*$/i,'');     // book summaries
  t=t.replace(/\s*[—-]\s*(Text|Key Passages|Summary).*$/i,''); // speeches
  t=t.replace(/\bin 20\d\d\b/gi,'').replace(/\b20\d\d\b/g,'');
  t=t.replace(/[?.!]+$/,'').trim();
  return (t+(SUFFIX?(' '+SUFFIX):'')).trim();
}
async function headOk(url){try{const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(9000)});const ct=(r.headers.get('content-type')||'').toLowerCase();if(r.ok&&ct.startsWith('image/'))return true;const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(9000)});return g.ok&&(g.headers.get('content-type')||'').toLowerCase().startsWith('image/');}catch(e){return false;}}
async function ddgImages(q,attempt=0){
  try{
    const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(q)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
    const html=await tp.text();const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);
    if(!m){if(attempt<2){await sleep(1500+attempt*1500);return ddgImages(q,attempt+1);}return[];}
    await sleep(120);
    const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(q)+'&vqd='+m[1]+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(r.status===429||r.status===403){if(attempt<3){await sleep(2500+attempt*2500);return ddgImages(q,attempt+1);}return[];}
    let j;try{j=JSON.parse(await r.text());}catch(e){if(attempt<2){await sleep(2000);return ddgImages(q,attempt+1);}return[];}
    return (j.results||[]).map(x=>({image:x.image,url:x.url}));
  }catch(e){if(attempt<2){await sleep(1500);return ddgImages(q,attempt+1);}return[];}
}
async function pickImage(q){const arr=await ddgImages(q);for(const c of arr.slice(0,10)){if(c.image&&await headOk(c.image))return c.image;}return '';}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
async function emailOwner(subject,html){return;try{await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,html}),signal:AbortSignal.timeout(12000)});}catch(e){}}

(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  // Newest-published FIRST → oldest (owner 2026-06-27). Sort by publish time (ts),
  // falling back to id. Set IMG_ASC=1 to go oldest-first instead.
  const ASC=process.env.IMG_ASC==='1';
  const key=e=>(e.ts||num(e.id));
  const all=(idx.entries||[]).filter(e=>isId(e.id)&&(!SINCE||(e.ts||0)>=SINCE)).sort((a,b)=>ASC?key(a)-key(b):key(b)-key(a));
  console.log(`[${PREFIX}] entries: ${all.length} | suffix="${SUFFIX}"`);
  if(DRY){all.slice(0,15).forEach(e=>console.log('  '+e.id+' -> "'+queryFrom(e.question)+'"'));return;}
  let done=0,skip=0,fail=0,lastEmail=Date.now();
  const cleared=new Set(); // ids that now have an image → clear images_pending in index (moves the progress bar)
  const CONC=process.env.DDG_SLOW?1:3;let cur=0;
  const _slowMs=+process.env.DDG_SLOW||0; // gentle pace: sleep this long after each processed entry
  async function worker(){
    while(cur<all.length){
      const e0=all[cur++];
      const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);
      if(!e||!e.answer){continue;}
      // Leading image present? If it's a REAL cover, leave it. If it's a
      // pollinations AI placeholder (writers use it to pass the image-law at
      // write time), UPGRADE it to a real photo — once (cover_upgraded guard
      // prevents reprocessing every pass when no real photo is found).
      const lead=e.answer.match(/^﻿?\s*!\[[^\]]*\]\(([^)]+)\)/);
      const isPoll=lead && /pollinations\.ai/i.test(lead[1]);
      if(lead && !isPoll){skip++;cleared.add(e0.id);continue;}
      if(isPoll && e.cover_upgraded){skip++;cleared.add(e0.id);continue;}
      const img=await pickImage(queryFrom(e0.question));
      if(!img){fail++;console.log('  no img:',e0.id);continue;}
      e.answer=e.answer.replace(/^﻿/,'');
      if(lead) e.answer=e.answer.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n*/,''); // strip pollinations placeholder
      if(isPoll) e.cover_upgraded=true;
      e.answer=`![${String(e0.question||'').replace(/[\[\]]/g,'').slice(0,80)}](${img})\n\n`+e.answer.replace(/^\n+/,'');
      e.ts=Date.now();e.polished_at=Date.now();
      await s.setJSON('answers/'+e0.id+'.json',e);
      await pingIndexNow(e0.id);
      cleared.add(e0.id);
      done++;console.log(`  [${done}] ${e0.id} -> ${img.slice(0,55)}`);
      if(_slowMs)await new Promise(r=>setTimeout(r,_slowMs)); // throttle: ~0.6x writer pace, gentle on API/cap
      if(Date.now()-lastEmail>15*60*1000){lastEmail=Date.now();await emailOwner(`PULSE ${PREFIX} cover images: ${done}`,`<p>${PREFIX} cover-image backfill: ${done} added, ${skip} skipped, ${fail} no-image.</p>`);}
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  // Clear images_pending on the index rows that now have an image — so pulse-progress (live, no deploy) advances the image bar.
  if(cleared.size){
    try{
      const fresh=await s.get('_index.json',{type:'json',consistency:'strong'}); let n=0;
      for(const row of (fresh.entries||[])){ if(cleared.has(row.id) && row.images_pending){ delete row.images_pending; n++; } }
      if(n){ await s.setJSON('_index.json',fresh); console.log(`[${PREFIX}] cleared images_pending on ${n} index rows`); }
    }catch(err){ console.log(`[${PREFIX}] index-clear err`,err.message); }
  }
  console.log(`\n[${PREFIX}] COVER DONE. added=${done} skipped(existing)=${skip} no-image=${fail}`);
  fs.writeFileSync('C:/Users/koryj/website/_'+PREFIX+'_cover_result.json',JSON.stringify({prefix:PREFIX,added:done,skipped:skip,noImage:fail},null,1));
  await emailOwner(`PULSE ${PREFIX} cover images COMPLETE`,`<p>${PREFIX} cover-image backfill done: ${done} added, ${skip} already had one, ${fail} no image found.</p>`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
