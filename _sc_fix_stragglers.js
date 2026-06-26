// Surgical fixer for ca entries stuck at 9/10 images. For each entry, find every
// "## N. <item>" whose @@PRODUCT card lacks img=, try several DDG query variants,
// scan up to 20 candidates, HEAD-validate, and inject img= into THAT card only.
// Leaves the other (good) cards untouched. Never regresses. Avoids global dedup
// blanking — only skips an image if it's already used in THIS entry.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const IDS = process.argv.slice(2).length ? process.argv.slice(2)
  : ["sc0049"];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cleanName = x => x.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu,' ').replace(/\bBEST OVERALL\b/gi,'').replace(/\bBEST VALUE\b/gi,'').replace(/\s{2,}/g,' ').trim();

async function headOk(url){
  try{
    const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000)});
    const ct=(r.headers.get('content-type')||'').toLowerCase();
    if(r.ok&&ct.startsWith('image/'))return true;
    if(!r.ok||!ct){const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(10000)});const ct2=(g.headers.get('content-type')||'').toLowerCase();return g.ok&&ct2.startsWith('image/');}
    return false;
  }catch(e){return false;}
}
async function ddgImages(q, attempt=0){
  try{
    const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(q)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
    const html=await tp.text();
    const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);
    if(!m){ if(attempt<2){await sleep(1500+attempt*1500);return ddgImages(q,attempt+1);} return []; }
    const vqd=m[1];
    await sleep(150);
    const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(q)+'&vqd='+vqd+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(r.status===429||r.status===403){ if(attempt<3){await sleep(2500+attempt*2500);return ddgImages(q,attempt+1);} return []; }
    const t=await r.text();
    let j; try{j=JSON.parse(t);}catch(e){ if(attempt<2){await sleep(2000);return ddgImages(q,attempt+1);} return []; }
    return (j.results||[]).map(x=>({image:x.image,url:x.url}));
  }catch(e){ if(attempt<2){await sleep(1500);return ddgImages(q,attempt+1);} return []; }
}

// try the base query plus variants; scan up to 20 candidates each; return first valid not-already-used image
async function findImage(name, year, usedImgs){
  const variants=[];
  if(year) variants.push(`${year} ${name}`);
  variants.push(name);
  variants.push(`${name} school campus`);
  if(year) variants.push(`${year} ${name} exterior`);
  variants.push(`${name} university`);
  for(const q of variants){
    const arr=await ddgImages(q);
    for(const c of arr.slice(0,20)){
      if(!c.image||usedImgs.has(c.image))continue;
      if(await headOk(c.image))return {img:c.image,site:c.url||''};
    }
  }
  // last resort: allow a valid image even if site link missing, from base query, ignoring used-set
  const arr=await ddgImages(name);
  for(const c of arr.slice(0,20)){ if(!c.image)continue; if(await headOk(c.image))return {img:c.image,site:c.url||''}; }
  return null;
}

async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}

(async()=>{
  let fixedEntries=0,fixedCards=0;
  for(const id of IDS){
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer){console.log(`SKIP ${id} (no entry)`);continue;}
    const yearM=(e.question||'').match(/\b(19|20)\d{2}\b/); const year=yearM?yearM[0]:'';
    const lines=e.answer.split(/\r?\n/);
    const usedImgs=new Set((e.answer.match(/img="([^"]+)"/g)||[]).map(x=>x.slice(5,-1)));
    let changed=false;
    for(let i=0;i<lines.length;i++){
      const m=lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
      if(!m)continue;
      // locate the @@PRODUCT line for this heading
      let pi=-1;for(let j=i+1;j<Math.min(i+6,lines.length);j++){if(/^@@PRODUCT/.test(lines[j])){pi=j;break;}if(/^##\s+\d+\./.test(lines[j]))break;}
      if(pi<0)continue;
      if(/ img=/.test(lines[pi]))continue; // already has image
      const name=cleanName(m[2]);
      const found=await findImage(name,year,usedImgs);
      if(found){
        usedImgs.add(found.img);
        let str=lines[pi];
        // insert img= right after name="..."
        if(/ img=/.test(str)){/*shouldn't happen*/}
        str=str.replace(/(name="[^"]*")/, `$1 img="${found.img.replace(/"/g,'')}"`);
        if(!/ site=/.test(str) && found.site) str+=` site="${found.site.replace(/"/g,'')}"`;
        lines[pi]=str;
        changed=true;fixedCards++;
        console.log(`  ${id} #${m[1]} ${name} -> img OK`);
      } else {
        console.log(`  ${id} #${m[1]} ${name} -> STILL no valid image`);
      }
    }
    if(changed){
      e.answer=lines.join('\n');e.ts=Date.now();e.polished_at=Date.now();
      await s.setJSON('answers/'+id+'.json',e);
      await pingIndexNow(id);
      fixedEntries++;
      const imgs=(e.answer.match(/@@PRODUCT[^\n]* img=/g)||[]).length;
      console.log(`UPDATED ${id} -> ${imgs}/10 imgs`);
    }
  }
  console.log(`\nStraggler fix done. entries updated=${fixedEntries}, cards filled=${fixedCards}`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
