// Franchise ranking engine. Extracts unit economics from each fr#### entry,
// scores on revenue-per-dollar-invested (royalty-adjusted), ranks all of them,
// and writes _fr_rank.json. READ-ONLY (no blob writes).
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const DRY=process.argv.includes('--sample');

function nameFrom(q){
  let t=String(q||'').trim();
  // "Should I open or buy a/an [NAME] franchise in 2027?"
  let m=t.match(/(?:open or buy|open|buy|invest in)\s+(?:an?\s+)?(.+?)\s+franchise\b/i);
  if(m) return clean(m[1]);
  // "Should I open a/an [TYPE] business in 2027?"
  m=t.match(/(?:open or start|open|start|run)\s+(?:an?\s+)?(.+?)\s+business\b/i);
  if(m) return clean(m[1])+' business';
  // fallback: strip scaffolding
  return clean(t.replace(/^should i\s+/i,'').replace(/\s+in\s+20\d\d.*$/i,'').replace(/[?]/g,''));
  function clean(x){return String(x).replace(/[—–]/g,' ').replace(/\b(alternative|vs\.?|or)\b.*$/i,'').replace(/\s+/g,' ').replace(/^[\s\-—]+|[\s\-—]+$/g,'').trim();}
}
// parse a dollar token like "$2.4 million", "$50,000", "$1.5M", "$750k"
function dollar(tok){
  if(!tok)return null;
  let t=tok.replace(/[, ]/g,'').toLowerCase();
  let m=t.match(/\$?([\d.]+)(m|million|k|thousand|b|billion)?/);
  if(!m)return null;
  let v=parseFloat(m[1]);if(isNaN(v))return null;
  const u=m[2]||'';
  if(/^m|million/.test(u))v*=1e6;else if(/^k|thousand/.test(u))v*=1e3;else if(/^b|billion/.test(u))v*=1e9;
  return v;
}
// find a $low to $high range near a keyword
function rangeNear(text,kw){
  const re=new RegExp(kw+'[^$]{0,80}?\\$([\\d.,]+\\s*(?:million|m|k|thousand|billion|b)?)\\s*(?:to|[\\u2013\\u2014-]|and)\\s*\\$?([\\d.,]+\\s*(?:million|m|k|thousand|billion|b)?)','i');
  const m=text.match(re);
  if(m){const lo=dollar('$'+m[1]),hi=dollar('$'+m[2]);if(lo&&hi)return [lo,hi];}
  // single value fallback
  const re2=new RegExp(kw+'[^$]{0,60}?\\$([\\d.,]+\\s*(?:million|m|k|thousand|billion|b)?)','i');
  const m2=text.match(re2);
  if(m2){const v=dollar('$'+m2[1]);if(v)return [v,v];}
  return null;
}
function royaltyFrom(text){const m=text.match(/royalty[^%\d]{0,40}?([\d.]+)\s*%/i);if(!m)return null;const v=parseFloat(m[1]);return (v>0&&v<=20)?v:null;} // >20% is profit-share/misread, not a standard royalty
// largest plausible $ value appearing within ~140 chars after any keyword hit
function bestNear(text,kw,lo,hi){
  const re=new RegExp('(?:'+kw+')[\\s\\S]{0,140}','gi');let m,best=null;
  while((m=re.exec(text))){
    const seg=m[0];const ds=[...seg.matchAll(/\$\s?([\d.,]+)\s*(million|m|k|thousand|billion|b)?/gi)].map(x=>dollar('$'+x[1].replace(/,/g,'')+(x[2]||'')));
    for(const d of ds){if(d>=lo&&d<=hi&&(best==null||d>best))best=d;}
  }
  return best;
}

(async()=>{
  const idx=await s.get('_index.json',{type:'json'});
  const ids=idx.entries.filter(e=>/^fr\d+$/.test(e.id));
  console.log('fr entries:',ids.length);
  const rows=[];let cur=0;const CONC=16;
  const list=DRY?ids.slice(0,25):ids;
  async function w(){while(cur<list.length){const e0=list[cur++];const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);if(!e||!e.answer)continue;
    const a=e.answer;
    const inv=rangeNear(a,'(?:Item 7|total investment|investment of|total cost|startup cost|initial investment)')||rangeNear(a,'investment');
    const rev=rangeNear(a,'(?:gross|mature units?|annual revenue|unit volume|AUV|average unit|revenue of|sales of)');
    const roy=royaltyFrom(a);
    // sanity bounds: total investment $75k–$30M; per-unit revenue $80k–$30M
    const okInv=v=>(v&&v>=75000&&v<=30e6)?v:null;
    const okRev=v=>(v&&v>=80000&&v<=30e6)?v:null;
    const revBest=bestNear(a,'AUV|average unit volume|mature units?|gross(?:es)?|annual (?:revenue|sales)|revenue of|sales of|unit volume|per (?:unit|store|location)|generate[sd]?',80000,30e6);
    const invBest=bestNear(a,'Item 7|total investment|initial investment|investment of|startup cost|total cost|to (?:open|build|invest)',75000,30e6);
    let invMid=invBest||(inv?okInv((inv[0]+inv[1])/2):null);
    let revMid=revBest||(rev?okRev((rev[0]+rev[1])/2):null);
    rows.push({id:e0.id,name:nameFrom(e0.question),question:e0.question,invLow:inv&&inv[0],invHigh:inv&&inv[1],revLow:rev&&rev[0],revHigh:rev&&rev[1],royalty:roy,invMid,revMid});
  }}
  await Promise.all(Array.from({length:CONC},w));
  // SCORING — unit economics is the #1 factor: "makes the most per unit" wins.
  // Primary (55%): per-unit revenue (how much one unit makes). Secondary (30%):
  // capital efficiency (revenue per $ invested — cheap-to-enter is a plus, not the
  // driver). Modifier (15%): royalty load (lower = keeps more of each unit dollar).
  const med=arr=>{const a=arr.filter(x=>x).sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:0;};
  const medRev=med(rows.map(r=>r.revMid)), medInv=med(rows.map(r=>r.invMid));
  for(const r of rows){ r._rev=r.revMid||medRev; r._inv=r.invMid||medInv;
    let ratio=r._rev/r._inv; if(!(ratio>=0.15&&ratio<=12))ratio=medRev/medInv; r._eff=ratio; }
  const pctile=(sorted,v)=>{let lo=0,hi=sorted.length;while(lo<hi){const m=(lo+hi)>>1;if(sorted[m]<=v)lo=m+1;else hi=m;}return sorted.length?lo/sorted.length:0;};
  const revsSorted=rows.map(r=>r._rev).sort((a,b)=>a-b);
  const effsSorted=rows.map(r=>r._eff).sort((a,b)=>a-b);
  for(const r of rows){
    const pRev=pctile(revsSorted,r._rev);        // makes-the-most-per-unit (primary)
    const pEff=pctile(effsSorted,r._eff);         // capital efficiency (secondary)
    const royN=1-Math.min(r.royalty||6,12)/12;    // lower royalty better
    r.score=Math.round((0.55*pRev+0.30*pEff+0.15*royN)*10000)/100; // 0–100
  }
  rows.sort((a,b)=>b.score-a.score);
  rows.forEach((r,i)=>{r.rank=i+1;});
  const stats={total:rows.length,withInv:rows.filter(r=>r.invMid).length,withRev:rows.filter(r=>r.revMid).length,withBoth:rows.filter(r=>r.invMid&&r.revMid).length,withRoy:rows.filter(r=>r.royalty).length};
  console.log('extraction coverage:',JSON.stringify(stats));
  console.log('\nTOP 15:');rows.slice(0,15).forEach(r=>console.log(`  #${r.rank} ${r.name} | inv $${(r.invMid/1e6||0).toFixed(2)}M rev $${(r.revMid/1e6||0).toFixed(2)}M roy ${r.royalty||'?'}% score ${r.score.toFixed(2)}`));
  if(!DRY){fs.writeFileSync('C:/Users/koryj/website/_fr_rank.json',JSON.stringify({total:rows.length,generated_basis:'revenue-per-dollar-invested, royalty-adjusted',ranks:rows},null,1));console.log('\nwrote _fr_rank.json');}
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
