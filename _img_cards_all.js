// Phase B: fill straggler Top-10 @@PRODUCT image cards across the genuine product
// pillars (entries with `## N.` items and < min(10,items) image cards). Rebuilds
// only the cards that are missing-imaged; never regresses (keeps if DDG finds fewer).
// Keyless DuckDuckGo. Run AFTER Phase A cover-images to avoid write races.
//   node _img_cards_all.js
const fs=require('fs');
const { getStore }=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
// genuine numbered Top-10 product pillars
const PRODUCT=['er','sc','dn','ai','cl','nl','ga','gm','ev','wl','tn','ca','co','bt','mv','es','tv','lv','rs','tl'];
const prefixOf=id=>(String(id).match(/^([a-z]+)\d+$/i)||[])[1]||'';
const num=id=>{const m=String(id).match(/\d+/);return m?parseInt(m[0],10):0;};
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const PROG='C:/Users/koryj/website/_img_cards_progress.json';
function cleanName(x){return x.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu,' ').replace(/\bBEST OVERALL\b/gi,'').replace(/\bBEST VALUE\b/gi,'').replace(/\s{2,}/g,' ').trim();}
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
    return (j.results||[]).map(x=>({image:x.image,url:x.url}));
  }catch(e){if(attempt<3){await sleep(1500);return ddgImages(q,attempt+1);}return[];}
}
async function rebuild(answer){
  const lines=answer.split(/\r?\n/).filter(l=>!/^@@PRODUCT/.test(l));
  const items=[];
  for(const l of lines){const m=l.match(/^##\s+(\d+)\.\s+(.+)$/);if(m)items.push({idx:m[1],q:cleanName(m[2])});}
  if(items.length<5)return null;
  const picks=[];
  for(const it of items){
    const arr=await ddgImages(it.q);let got=null;
    for(const c of arr.slice(0,8)){if(!c.image)continue;if(await headOk(c.image)){got={idx:it.idx,q:it.q,img:c.image,site:c.url||''};break;}}
    picks.push(got||{idx:it.idx,q:it.q,img:'',site:(arr[0]&&arr[0].url)||''});
  }
  const seen=new Set();for(const p of picks){if(p.img){if(seen.has(p.img))p.img='';else seen.add(p.img);}}
  const card={};let imgs=0;
  for(const p of picks){let str=`@@PRODUCT name="${p.q.replace(/"/g,'')}"`;if(p.img){str+=` img="${p.img.replace(/"/g,'')}"`;imgs++;}if(p.site){str+=` site="${p.site.replace(/"/g,'')}"`;}card[p.idx]=str;}
  const out=[];for(const l of lines){out.push(l);const m=l.match(/^##\s+(\d+)\.\s/);if(m&&card[m[1]])out.push(card[m[1]]);}
  return {body:out.join('\n'),imgs,items:items.length};
}
async function pingIndexNow(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
async function emailOwner(subject,html){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,html}),signal:AbortSignal.timeout(12000)});}catch(e){}}
(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const ids=(idx.entries||[]).map(e=>e.id).filter(id=>PRODUCT.includes(prefixOf(id))).sort((a,b)=>num(a)-num(b));
  // find weak ones
  const weak=[];let scan=0;
  const CONC0=12;let c0=0;
  async function scanner(){while(c0<ids.length){const id=ids[c0++];const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);scan++;if(!e||!e.answer)continue;const items=(e.answer.match(/^##\s+\d+\.\s/gm)||[]).length;if(items<5)continue;const cur=(e.answer.match(/@@PRODUCT[^\n]* img=/g)||[]).length;if(cur<Math.min(10,items))weak.push({id,cur});}}
  await Promise.all(Array.from({length:CONC0},scanner));
  weak.sort((a,b)=>num(a.id)-num(b.id));
  console.log(`scanned ${ids.length} product entries; weak (need cards): ${weak.length}`);
  let fixed=0,addedImgs=0,cur=0,lastEmail=Date.now();
  const CONC=4;
  async function worker(){
    while(cur<weak.length){
      const {id,cur:have}=weak[cur++];
      try{
        const e=await s.get('answers/'+id+'.json',{type:'json'});
        const res=await rebuild(e.answer);
        if(!res)continue;
        if(res.imgs>=have){
          e.answer=res.body;e.ts=Date.now();e.polished_at=Date.now();
          await s.setJSON('answers/'+id+'.json',e);
          await pingIndexNow(id);
          if(res.imgs>have)addedImgs+=(res.imgs-have);
          fixed++;
          console.log(`  [${fixed}/${weak.length}] ${id} ${have}->${res.imgs} cards`);
        } else console.log(`  keep ${id} ${have} (ddg ${res.imgs})`);
      }catch(err){console.log(`  FAIL ${id}: ${err.message}`);}
      const now=Date.now();
      fs.writeFileSync(PROG,JSON.stringify({weak:weak.length,processed:cur,fixed,addedImgs},null,1));
      if(now-lastEmail>15*60*1000){lastEmail=now;await emailOwner(`PULSE Top-10 cards: ${fixed}/${weak.length}`,`<p>Straggler Top-10 image-card backfill: <b>${fixed}</b>/${weak.length} entries completed, ${addedImgs} card images added.</p>`);}
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  fs.writeFileSync(PROG,JSON.stringify({weak:weak.length,processed:cur,fixed,addedImgs,complete:true},null,1));
  console.log(`\nCARDS DONE. fixed=${fixed} imagesAdded=${addedImgs}`);
  await emailOwner(`PULSE Top-10 cards COMPLETE`,`<p>Top-10 straggler card backfill finished: ${fixed} entries completed, ${addedImgs} card images added. Every Top-10 now carries its product image cards.</p>`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
