// Quality second-pass: re-backfill er entries whose @@PRODUCT cards have fewer
// than THRESHOLD images. Strips existing cards and redoes the Serper lookup at
// LOW concurrency (so HEAD validation doesn't time out under load), keeping the
// better of the two results (never reduces an entry's image count).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const SERPER = process.env.SERPER_API_KEY;
const s = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

const THRESHOLD = 6;       // entries with < this many images get retried
const CONCURRENCY = 2;     // low → fewer HEAD timeouts → higher hit rate
const num = id => parseInt(String(id).match(/\d+/)[0], 10);

function cleanName(x){return x.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu,' ').replace(/\bBEST OVERALL\b/gi,'').replace(/\bBEST VALUE\b/gi,'').replace(/\s{2,}/g,' ').trim();}
async function headOk(url){
  try{
    const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(12000)});
    const ct=(r.headers.get('content-type')||'').toLowerCase();
    if(r.ok&&ct.startsWith('image/'))return true;
    if(!r.ok||!ct){const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024'},redirect:'follow',signal:AbortSignal.timeout(12000)});const ct2=(g.headers.get('content-type')||'').toLowerCase();return g.ok&&ct2.startsWith('image/');}
    return false;
  }catch(e){return false;}
}
async function serperImages(queries){
  const r=await fetch('https://google.serper.dev/images',{method:'POST',headers:{'X-API-KEY':SERPER,'Content-Type':'application/json'},body:JSON.stringify(queries.map(q=>({q}))),signal:AbortSignal.timeout(30000)});
  const d=await r.json();return Array.isArray(d)?d:[d];
}
// strip existing @@PRODUCT lines, rebuild from scratch
async function rebuild(answer){
  const lines=answer.split(/\r?\n/).filter(l=>!/^@@PRODUCT/.test(l));
  const items=[];
  for(const l of lines){const m=l.match(/^##\s+(\d+)\.\s+(.+)$/);if(m)items.push({idx:m[1],q:cleanName(m[2])});}
  if(items.length<5)return null;
  const results=await serperImages(items.map(i=>i.q));
  const picks=[];
  for(let i=0;i<items.length;i++){
    const it=items[i];const arr=(results[i]&&results[i].images)||[];let got=null;
    for(const c of arr.slice(0,8)){if(!c.imageUrl)continue;if(await headOk(c.imageUrl)){got={idx:it.idx,q:it.q,img:c.imageUrl,site:c.link||''};break;}}
    picks.push(got||{idx:it.idx,q:it.q,img:'',site:(arr[0]&&arr[0].link)||''});
  }
  const seen=new Set();for(const p of picks){if(p.img){if(seen.has(p.img))p.img='';else seen.add(p.img);}}
  const card={};let imgs=0,links=0;
  for(const p of picks){let str=`@@PRODUCT name="${p.q.replace(/"/g,'')}"`;if(p.img){str+=` img="${p.img.replace(/"/g,'')}"`;imgs++;}if(p.site){str+=` site="${p.site.replace(/"/g,'')}"`;links++;}card[p.idx]=str;}
  const out=[];for(const l of lines){out.push(l);const m=l.match(/^##\s+(\d+)\.\s/);if(m&&card[m[1]])out.push(card[m[1]]);}
  return {body:out.join('\n'),imgs,links,items:items.length};
}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}

(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const allEr=(idx.entries||[]).map(e=>e.id).filter(id=>/^er\d+$/.test(id)).sort((a,b)=>num(a)-num(b));
  // find weak entries
  const weak=[];
  for(const id of allEr){
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer)continue;
    const curImgs=(e.answer.match(/@@PRODUCT[^\n]* img=/g)||[]).length;
    const items=(e.answer.match(/^##\s+\d+\.\s/gm)||[]).length;
    if(items>=5&&curImgs<Math.min(THRESHOLD,items))weak.push({id,curImgs,items});
  }
  console.log(`weak entries (<${THRESHOLD} imgs): ${weak.length}`);
  let fixed=0,improved=0,cursor=0;
  async function worker(){
    while(cursor<weak.length){
      const {id,curImgs}=weak[cursor++];
      try{
        const e=await s.get('answers/'+id+'.json',{type:'json'});
        const res=await rebuild(e.answer);
        if(!res){continue;}
        if(res.imgs>=curImgs){ // only accept if not worse
          e.answer=res.body;e.ts=Date.now();e.polished_at=Date.now();
          await s.setJSON('answers/'+id+'.json',e);
          await pingIndexNow(id);
          if(res.imgs>curImgs)improved++;
          fixed++;
          console.log(`  [${fixed}/${weak.length}] ${id} ${curImgs}->${res.imgs} imgs / ${res.links} links`);
        } else {
          console.log(`  keep  ${id} ${curImgs} (retry got ${res.imgs}, not better)`);
        }
      }catch(err){console.log(`  FAIL ${id}: ${err.message}`);}
    }
  }
  await Promise.all(Array.from({length:CONCURRENCY},worker));
  console.log(`\nRETRY DONE. processed=${fixed} improved=${improved}`);
  fs.writeFileSync('C:/Users/koryj/website/_er_retry_result.json',JSON.stringify({weak:weak.length,fixed,improved},null,1));
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
