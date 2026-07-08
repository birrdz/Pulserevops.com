// _fix_mermaid_ltgt.js — deterministic, deploy-free fix for the #1 render error
// (owner: "tons of errors in the most recent cro pulse tools"). Inside ```mermaid blocks,
// stray '<' / '>' in node/edge labels break Mermaid -> red "Syntax error" box. We replace
// them with word equivalents that always render ('<$1M'->'under $1M', '>$5M'->'over $5M',
// '<='/'>='->'at most'/'at least', bare '<'/'>'-> 'under'/'over'), WITHOUT touching arrow
// tokens (-->, <--, ==>, -.->, ---, etc.). Only mermaid fenced blocks are modified.
// Usage: node _fix_mermaid_ltgt.js            (DRY, from _site_error_queue.json, mermaid<> only)
//        node _fix_mermaid_ltgt.js --live     (apply, deploy-free blob rewrite)
//        node _fix_mermaid_ltgt.js --live tl19448 tl19449   (specific ids)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const ids = args.filter(a=>/^[a-z]{1,4}\d+$/.test(a));

// ASCII sentinel that cannot collide with label digits/words
const SO = 'ZZARROWZZ', SC = 'ZZ';
const ARROWS = [/<-\.->/g,/<-->/g,/<==>/g,/<--/g,/<==/g,/-\.->/g,/-->/g,/==>/g,/---/g,/-\.-/g,/===/g];
function fixLabelLtGt(line){
  let s = line; const saved=[];
  ARROWS.forEach((rx)=>{ s = s.replace(rx, m=>{ saved.push(m); return SO+(saved.length-1)+SC; }); });
  s = s.replace(/<=\s*/g,'at most ').replace(/>=\s*/g,'at least ')
       .replace(/<\s*(?=[$\d])/g,'under ').replace(/>\s*(?=[$\d])/g,'over ')
       .replace(/</g,'under ').replace(/>/g,'over ')
       .replace(/under\s+under /g,'under ').replace(/over\s+over /g,'over ');
  s = s.replace(new RegExp(SO+'(\\d+)'+SC,'g'), (_,n)=>saved[+n]);
  return s;
}
function stripArrows(line){ let s=line; ARROWS.forEach(rx=>s=s.replace(rx,' ')); return s; }
function fixBody(body){
  let changed=false;
  const out = body.replace(/```mermaid\s*([\s\S]*?)```/g, (full, inner)=>{
    if(!/[<>]/.test(inner)) return full;
    const fixed = inner.split('\n').map(fixLabelLtGt).join('\n');
    if(fixed!==inner) changed=true;
    return '```mermaid\n'+fixed.replace(/^\n+/,'').replace(/\n+$/,'')+'\n```';
  });
  return { out, changed };
}
(async()=>{
  let targets = ids;
  if(!targets.length){
    const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_site_error_queue.json','utf8'));
    targets = q.filter(x=>x.reasons.includes('mermaid<>')).map(x=>x.id);
  }
  console.log((LIVE?'LIVE':'DRY'),'targets:',targets.length);
  let fixed=0, skipped=0, stillBad=0;
  const CONC=10; let cur=0;
  async function worker(){
    while(cur<targets.length){
      const id=targets[cur++];
      const b=await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
      if(!b||!b.answer){ skipped++; continue; }
      const {out,changed}=fixBody(b.answer);
      if(!changed){ skipped++; continue; }
      const resid=[...out.matchAll(/```mermaid\s*([\s\S]*?)```/g)].some(m=>m[1].split('\n').some(line=>/[<>]/.test(stripArrows(line))));
      if(resid) stillBad++;
      if(LIVE){ b.answer=out; await store.setJSON('answers/'+id+'.json', b); }
      fixed++;
      if(ids.length){ console.log('--- '+id+' mermaid after fix ---'); console.log((out.match(/```mermaid[\s\S]*?```/)||[''])[0].slice(0,520)); }
    }
  }
  await Promise.all(Array.from({length:CONC},worker));
  console.log((LIVE?'APPLIED':'WOULD-FIX'),fixed,'| skipped(no-change)',skipped,'| residual<>',stillBad);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
