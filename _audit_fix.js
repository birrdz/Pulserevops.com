// Tier-1 remediation for the last-3-day publishes. Mutates the blob store.
// Backs up _index.json first. Idempotent. Skips the 3 retired dup ids.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
for (const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});

const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const fmt = ts => { const d=new Date(ts); return MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear(); };
const RETIRE = new Set(['fr1027','fr1026','er0343']);
const KEEP_NOTE = {fr1027:'fr0033',fr1026:'fr0180',er0343:'er0287'};

// derive a review-keyword footer from a title
function footerFor(title){
  let t=(title||'').replace(/\?+$/,'').trim();
  // strip common lead-ins for a cleaner topic
  t=t.replace(/^(should i open or buy an? |should i open an? |what is the best |what are the |how do you |how should )/i,'').replace(/ in 2027$/i,'').replace(/ franchise$/i,' franchise').trim();
  if(!t) t='this topic';
  return `\n\n---\n\n*${t} review / ${t} reviews / ${t} rating / ${t} review 2027 / review of ${t}.*\n`;
}
// convert ### Question? headings inside the FAQ section to bold **Question?**
function boldFaq(body){
  const m=body.match(/(^|\n)(##\s+FAQ[^\n]*\n)([\s\S]*?)(?=\n##\s|\n*$)/i);
  if(!m) return body;
  const before=body.slice(0,m.index+m[1].length+m[2].length);
  let faq=m[3];
  const after=body.slice(m.index+m[1].length+m[2].length+m[3].length);
  faq=faq.replace(/^###\s+(.+?\?)\s*$/gm,'**$1**');
  return before+faq+after;
}

(async()=>{
  const idx=await store.get('_index.json',{type:'json'});
  fs.writeFileSync('C:/Users/koryj/_index_backup_'+Date.now()+'.json', JSON.stringify(idx));
  const tsById=new Map(idx.entries.filter(e=>e).map(e=>[e.id,e.ts]));
  const titleById=new Map(idx.entries.filter(e=>e).map(e=>[e.id,e.question]));
  const F=JSON.parse(fs.readFileSync('C:/Users/koryj/_audit_findings.json','utf8'));

  let datelined=0, faqfixed=0, footered=0, regraded=[], errors=[];
  const toFix=F.filter(x=>!RETIRE.has(x.id));
  for(const x of toFix){
    let a; try{ a=await store.get('answers/'+x.id+'.json',{type:'json'}); }catch(e){ errors.push(x.id+' read'); continue; }
    if(!a||!a.answer){ errors.push(x.id+' nobody'); continue; }
    let b=a.answer, changed=false;
    // 1. dateline
    if(!/Published .{3,40}·.{0,6}Updated /.test(b)){
      const ts=tsById.get(x.id)||Date.now(); const d=fmt(ts);
      b=`Published ${d} · Updated ${d}\n\n`+b.replace(/^﻿?/,''); changed=true; datelined++;
    }
    // 2. fr FAQ bold (only if grader missing faq_five_plus)
    if(x.p==='fr' && /faq_five_plus/.test(x.issues.join(' '))){
      const nb=boldFaq(b); if(nb!==b){ b=nb; changed=true; faqfixed++; }
    }
    // 3. footer
    if(!/review/i.test(b.slice(-700))){
      b=b.replace(/\s+$/,'')+footerFor(titleById.get(x.id)); changed=true; footered++;
    }
    if(changed){
      a.answer=b;
      try{ await store.setJSON('answers/'+x.id+'.json', a); }catch(e){ errors.push(x.id+' write'); continue; }
      if(regraded.length<8){ const r=gradeEntry(x.id,b); regraded.push(x.id+':'+r.score+'/12'); }
    }
  }

  // 4. retire dups
  let retired=[];
  for(const id of RETIRE){
    try{ await store.delete('answers/'+id+'.json'); }catch(e){}
    const before=idx.entries.length;
    idx.entries=idx.entries.filter(e=>!(e&&e.id===id));
    if(idx.entries.length<before) retired.push(id+'(kept '+KEEP_NOTE[id]+')');
  }
  await store.setJSON('_index.json', idx);

  console.log('DATELINED:',datelined);
  console.log('FAQ->bold (fr):',faqfixed);
  console.log('FOOTERED:',footered);
  console.log('RETIRED:',retired.join(', '));
  console.log('ERRORS:',errors.length?errors.join(', '):'none');
  console.log('regrade sample:',regraded.join('  '));
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
