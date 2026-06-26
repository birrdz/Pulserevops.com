// Dumps NIL entries needing a year-accuracy rewrite into nil_gen/<id>.txt
// (question + body, leading image stripped & saved to <id>.img) for subagents.
// Skips entries already audited (e._nil_audited). Usage: node _nil_dump.js <N> [offset]
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const N=parseInt(process.argv[2]||'20',10),OFF=parseInt(process.argv[3]||'0',10);
const num=id=>{const m=String(id).match(/\d+/);return m?parseInt(m[0],10):0;};
(async()=>{
  const idx=await s.get('_index.json',{type:'json'});
  const nil=idx.entries.filter(e=>/^q\d+$/.test(e.id)&&/\bnil\b/i.test(e.question||'')).sort((a,b)=>num(a.id)-num(b.id));
  fs.mkdirSync('C:/Users/koryj/website/nil_gen',{recursive:true});
  const picked=[];let i=OFF;
  while(i<nil.length&&picked.length<N){
    const e0=nil[i++];const e=await s.get('answers/'+e0.id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer)continue; if(e._nil_audited)continue;
    let body=e.answer; let img='';
    const m=body.match(/^(﻿?\s*!\[[^\]]*\]\([^)]*\)\s*)/);
    if(m){img=m[1];body=body.slice(m[1].length);}
    fs.writeFileSync('C:/Users/koryj/website/nil_gen/'+e0.id+'.img',img);
    fs.writeFileSync('C:/Users/koryj/website/nil_gen/'+e0.id+'.txt','QUESTION: '+e0.question+'\n\nANSWER (rewrite per the rules in _NIL_INSTRUCTIONS.md):\n'+body);
    picked.push(e0.id);
  }
  console.log(picked.join(' '));
  console.error('dumped '+picked.length+' (scanned to '+i+'/'+nil.length+')');
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
