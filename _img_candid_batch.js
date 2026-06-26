// Add 100 images across random pillars: alternate CLEAN editorial vs CANDID
// phone-style (UGC, real). Inserts a markdown image into the entry body, updates
// blob (no index change). Emails the list. Run with engines paused.
//   node _img_candid_batch.js --count 100 --par 3
const fs=require('fs');const path=require('path');
const { generateHostedImage } = require('./netlify/functions/lib/gemini-image-lib');
const { getStore } = require('@netlify/blobs');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const arg=(n,d)=>{const i=process.argv.indexOf('--'+n);return i>=0?process.argv[i+1]:d;};
const COUNT=parseInt(arg('count','100'),10); const PAR=parseInt(arg('par','3'),10);
function topic(q){return String(q||'').replace(/^(operator.s take:|top 10\s*)/i,'').replace(/\?+$/,'').trim();}
function cleanPrompt(t){return `Editorial photograph illustrating "${t}". Realistic, natural, professional lighting, magazine quality. No text, no words, no logos, no watermark.`;}
function candidPrompt(t){return `Candid smartphone snapshot related to "${t}". Amateur phone photo, natural available light, slightly imperfect framing, authentic real-life moment, casual UGC style, a little grain. No text, no logos, no watermark.`;}
function insertImage(body, md){ // insert after first paragraph for a natural inline placement
  const parts=String(body).split(/\n\n/);
  if(parts.length<2) return md+'\n\n'+body;
  parts.splice(1,0,md); return parts.join('\n\n');
}
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const idx=await store.get('_index.json',{type:'json'});
  // candidate real, indexable entries across pillars (exclude tl9### CRO ads + noindex)
  let cand=idx.entries.filter(e=>e&&e.id&&e.question&&e.has_answer!==false&&!e.noindex&&!/^tl9\d/.test(e.id));
  // group by pillar prefix, round-robin for pillar spread
  const byP={};for(const e of cand){const p=e.id.match(/^[a-z]+/)[0];(byP[p]=byP[p]||[]).push(e);}
  const pills=Object.keys(byP); for(const p of pills) byP[p].sort((a,b)=>(b.ts||0)-(a.ts||0));
  const picks=[];let pi=0;while(picks.length<COUNT){let added=false;for(const p of pills){const list=byP[p];const idxp=Math.floor(pi);if(idxp<list.length){picks.push(list[idxp]);added=true;if(picks.length>=COUNT)break;}}if(!added)break;pi++;}
  console.log('image batch: '+picks.length+' entries across '+pills.length+' pillars (par '+PAR+')');
  let i=0,done=0,fail=0;const out=[];
  async function worker(){while(i<picks.length){const k=i++;const e=picks[k];const candid=k%2===1;const t=topic(e.question);
    try{
      const prompt=candid?candidPrompt(t):cleanPrompt(t);
      const url=await generateHostedImage(prompt,(candid?'candid-':'clean-')+e.id+'-'+t);
      if(!url){fail++;continue;}
      const blob=await store.get('answers/'+e.id+'.json',{type:'json'});if(!blob){fail++;continue;}
      const alt=(candid?'':'')+t;
      blob.answer=insertImage(blob.answer||'', `![${alt}](${url})`);
      blob.polished_at=Date.now();
      await store.setJSON('answers/'+e.id+'.json',blob);
      done++; out.push({id:e.id,pillar:e.id.match(/^[a-z]+/)[0],style:candid?'candid':'clean',url,page:'https://pulserevops.com/knowledge/'+e.id});
      if(done%15===0)console.log('  '+done+'/'+picks.length+' (last '+e.id+' '+(candid?'candid':'clean')+')');
    }catch(err){fail++;console.log('  ERR '+e.id+' '+(err.message||err));}
  }}
  await Promise.all(Array.from({length:PAR},()=>worker()));
  // email summary
  const byPill={};for(const o of out){byPill[o.pillar]=(byPill[o.pillar]||0)+1;}
  const pillRows=Object.entries(byPill).sort((a,b)=>b[1]-a[1]).map(([p,n])=>`${p}:${n}`).join(' · ');
  const sample=out.slice(0,30).map(o=>`<tr><td><a href="${o.page}">${o.id}</a></td><td>${o.style}</td><td><a href="${o.url}">img</a></td></tr>`).join('');
  await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:`PULSE — ${done} images added across ${Object.keys(byPill).length} pillars (clean + candid)`,html:`<h2>${done} images added (${fail} failed)</h2><p>Mix of clean editorial + candid phone-style, across pillars: ${pillRows}</p><p>First 30 (click the page to see it placed):</p><table border="1" cellpadding="6" style="border-collapse:collapse;font:13px system-ui"><tr><th>Entry</th><th>Style</th><th>Image</th></tr>${sample}</table>`})});
  console.log('DONE images done='+done+' fail='+fail+' pillars='+pillRows);
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
