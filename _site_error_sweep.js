// _site_error_sweep.js — WHOLE-SITE render-error sweep (owner: "tons of errors in the
// most recent CRO pulse tools" — the V2 audit missed them). Scans every entry's body for
// RENDER-BREAKING issues that show as visible errors on the page:
//   - MERMAID syntax breakers: '<' or '>' inside a node/edge label (e.g. "<$1M", ">$5M"),
//     which Mermaid parses as syntax errors -> red "Syntax error in graph" box.
//   - leaked raw v2 fences / unbalanced ``` fences.
//   - broken markdown images with empty/placeholder URLs.
// Writes _site_error_queue.json (per-entry, with the offending snippet) + a per-pillar rollup.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const ONLY = (process.env.SWEEP_PILLAR||'').trim();
const pillarOf = id => (String(id).match(/^([a-z]{1,4})\d/)||[,'other'])[1];

function mermaidErrors(body){
  const out = [];
  const blocks = [...body.matchAll(/```mermaid\s*([\s\S]*?)```/g)].map(m=>m[1]);
  for (const blk of blocks){
    for (let line of blk.split('\n')){
      // strip valid arrow tokens so we only see stray < or >
      const stripped = line.replace(/<-->|-->|<--|-\.->|==>|<==|===|---|-\.-/g,' ');
      // a < or > that remains is inside a label -> mermaid breaker
      if (/[<>]/.test(stripped)) { out.push(line.trim().slice(0,90)); }
    }
  }
  return out;
}
(async()=>{
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  let entries = (idx.entries||[]).filter(e=>e&&/^[a-z]{1,4}\d+$/.test(e.id||''));
  if (ONLY) entries = entries.filter(e=>pillarOf(e.id)===ONLY);
  const flagged=[]; let scanned=0, mermBad=0, fenceBad=0, imgBad=0;
  const roll={};
  const CONC=12; let cur=0;
  async function worker(){
    while(cur<entries.length){
      const e=entries[cur++]; const p=pillarOf(e.id); roll[p]=roll[p]||{total:0,flagged:0};
      const b=await store.get('answers/'+e.id+'.json',{type:'json'}).catch(()=>null);
      if(!b||!b.answer) continue; scanned++; roll[p].total++;
      const body=b.answer; const reasons=[]; let snip='';
      const merr=mermaidErrors(body);
      if(merr.length){ reasons.push('mermaid<>'); mermBad++; snip=merr[0]; }
      const fences=(body.match(/```/g)||[]).length;
      if(fences%2!==0){ reasons.push('unbalanced-fence'); fenceBad++; }
      if(/!\[[^\]]*\]\(\s*\)/.test(body)||/!\[[^\]]*\]\((undefined|null|#)\)/.test(body)){ reasons.push('broken-img'); imgBad++; }
      if(reasons.length){ flagged.push({id:e.id,pillar:p,title:e.question,reasons,snippet:snip}); roll[p].flagged++; }
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  flagged.sort((a,b)=> (b.ts||0)-(a.ts||0) || a.id.localeCompare(b.id));
  fs.writeFileSync('C:/Users/koryj/website/_site_error_queue.json', JSON.stringify(flagged,null,1));
  const rollSorted=Object.entries(roll).map(([p,v])=>({pillar:p,total:v.total,flagged:v.flagged})).filter(r=>r.flagged>0).sort((a,b)=>b.flagged-a.flagged);
  fs.writeFileSync('C:/Users/koryj/website/_site_error_rollup.json', JSON.stringify(rollSorted,null,1));
  console.log('SCANNED',scanned,'| RENDER-ERROR FLAGGED',flagged.length,'(mermaid<>:'+mermBad+', unbalanced-fence:'+fenceBad+', broken-img:'+imgBad+')');
  console.log('TOP PILLARS:'); for(const r of rollSorted.slice(0,20)) console.log('  '+r.pillar.padEnd(6),'flagged',String(r.flagged).padStart(5),'/',String(r.total).padStart(5));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
