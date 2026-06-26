// Keyless image+link backfill via DuckDuckGo image search (no API key / no credits).
// Targets er entries with < THRESHOLD images (the Serper-credit-exhausted zeros +
// partials). Strips old @@PRODUCT cards, rebuilds with real DDG image + source
// link per item, HEAD-validates every image, writes to blobs only if NOT worse.
// Same @@PRODUCT card format as the canonical backfill. Rate-limit resilient.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const THRESHOLD = 10;
const CONCURRENCY = 3;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const num = id => parseInt(String(id).match(/\d+/)[0], 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function cleanName(x){return x.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu,' ').replace(/\bBEST OVERALL\b/gi,'').replace(/\bBEST VALUE\b/gi,'').replace(/\s{2,}/g,' ').trim();}

async function headOk(url){
  try{
    const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000)});
    const ct=(r.headers.get('content-type')||'').toLowerCase();
    if(r.ok&&ct.startsWith('image/'))return true;
    if(!r.ok||!ct){const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(10000)});const ct2=(g.headers.get('content-type')||'').toLowerCase();return g.ok&&ct2.startsWith('image/');}
    return false;
  }catch(e){return false;}
}

// DDG image search for one query -> array of {image, url}. Retries on rate-limit.
async function ddgImages(q, attempt=0){
  try{
    const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(q)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
    const html=await tp.text();
    const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);
    if(!m){ if(attempt<2){await sleep(1500+attempt*1500);return ddgImages(q,attempt+1);} return []; }
    const vqd=m[1];
    await sleep(120);
    const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(q)+'&vqd='+vqd+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(r.status===429||r.status===403){ if(attempt<3){await sleep(2500+attempt*2500);return ddgImages(q,attempt+1);} return []; }
    const t=await r.text();
    let j; try{j=JSON.parse(t);}catch(e){ if(attempt<2){await sleep(2000);return ddgImages(q,attempt+1);} return []; }
    return (j.results||[]).map(x=>({image:x.image,url:x.url}));
  }catch(e){ if(attempt<2){await sleep(1500);return ddgImages(q,attempt+1);} return []; }
}

async function rebuild(answer){
  const lines=answer.split(/\r?\n/).filter(l=>!/^@@PRODUCT/.test(l));
  const items=[];
  for(const l of lines){const m=l.match(/^##\s+(\d+)\.\s+(.+)$/);if(m)items.push({idx:m[1],q:cleanName(m[2])});}
  if(items.length<5)return null;
  const picks=[];
  for(const it of items){              // sequential per item -> gentle on DDG
    const arr=await ddgImages(it.q);
    let got=null;
    for(const c of arr.slice(0,8)){ if(!c.image)continue; if(await headOk(c.image)){got={idx:it.idx,q:it.q,img:c.image,site:c.url||''};break;} }
    picks.push(got||{idx:it.idx,q:it.q,img:'',site:(arr[0]&&arr[0].url)||''});
  }
  const seen=new Set();for(const p of picks){if(p.img){if(seen.has(p.img))p.img='';else seen.add(p.img);}}
  const card={};let imgs=0,links=0;
  for(const p of picks){let str=`@@PRODUCT name="${p.q.replace(/"/g,'')}"`;if(p.img){str+=` img="${p.img.replace(/"/g,'')}"`;imgs++;}if(p.site){str+=` site="${p.site.replace(/"/g,'')}"`;links++;}card[p.idx]=str;}
  const out=[];for(const l of lines){out.push(l);const m=l.match(/^##\s+(\d+)\.\s/);if(m&&card[m[1]])out.push(card[m[1]]);}
  return {body:out.join('\n'),imgs,links,items:items.length};
}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
async function emailOwner(subject,html){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,html}),signal:AbortSignal.timeout(12000)});}catch(e){}}

(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const allCa=(idx.entries||[]).map(e=>e.id).filter(id=>/^sc\d+$/.test(id)).sort((a,b)=>num(a)-num(b));
  const weak=[];
  for(const id of allCa){
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer)continue;
    const cur=(e.answer.match(/@@PRODUCT[^\n]* img=/g)||[]).length;
    const items=(e.answer.match(/^##\s+\d+\.\s/gm)||[]).length;
    if(items>=5&&cur<Math.min(THRESHOLD,items))weak.push({id,cur});
  }
  console.log(`DDG backfill targets (<${THRESHOLD} imgs): ${weak.length}`);
  let fixed=0,improved=0,addedImgs=0,cursor=0,lastEmail=Date.now();
  async function worker(){
    while(cursor<weak.length){
      const {id,cur}=weak[cursor++];
      try{
        const e=await s.get('answers/'+id+'.json',{type:'json'});
        const res=await rebuild(e.answer);
        if(!res)continue;
        if(res.imgs>=cur){
          e.answer=res.body;e.ts=Date.now();e.polished_at=Date.now();
          await s.setJSON('answers/'+id+'.json',e);
          await pingIndexNow(id);
          if(res.imgs>cur){improved++;addedImgs+=(res.imgs-cur);}
          fixed++;
          console.log(`  [${fixed}/${weak.length}] ${id} ${cur}->${res.imgs} imgs / ${res.links} links`);
        } else {
          console.log(`  keep ${id} ${cur} (ddg got ${res.imgs})`);
        }
      }catch(err){console.log(`  FAIL ${id}: ${err.message}`);}
      if(Date.now()-lastEmail>15*60*1000){lastEmail=Date.now();await emailOwner(`PULSE sc DDG backfill: ${fixed}/${weak.length}`,`<p>Schools image backfill (keyless/DuckDuckGo) in progress: <b>${fixed}</b>/${weak.length} entries updated, ${improved} improved, ${addedImgs} images added.</p>`);}
    }
  }
  await Promise.all(Array.from({length:CONCURRENCY},worker));
  console.log(`\nDDG DONE. updated=${fixed} improved=${improved} imagesAdded=${addedImgs}`);
  fs.writeFileSync('C:/Users/koryj/website/_sc_ddg_result.json',JSON.stringify({targets:weak.length,fixed,improved,addedImgs},null,1));
  await emailOwner(`PULSE sc DDG backfill COMPLETE`,`<p>Schools keyless image backfill finished. ${improved} entries improved, ${addedImgs} real images added across ${weak.length} targeted entries.</p><p>https://pulserevops.com/schools</p>`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
