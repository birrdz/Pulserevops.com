// Save an APPROVED story into the Pulse Editorials pillar (ed####), then restore
// the source Q&A to its original encyclopedia answer. Keeps them separate.
//   node _ed_save.js <sourceId>
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const src=process.argv[2]; if(!src){console.error('usage: node _ed_save.js <sourceId>');process.exit(1);}
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const s=await store.get('answers/'+src+'.json',{type:'json'}); if(!s){console.log('no source blob');return;}
  const story=s.answer; if(!story||!s.answer_orig){console.log(JSON.stringify({ok:false,err:'no story/backup on source'}));return;}
  const idx=await store.get('_index.json',{type:'json'});
  let maxEd=0;for(const e of idx.entries){const m=e&&e.id&&e.id.match(/^ed(\d+)$/);if(m)maxEd=Math.max(maxEd,parseInt(m[1],10));}
  const edId='ed'+String(maxEd+1).padStart(4,'0');
  const baseQ=(s.question||src).replace(/\?$/,'');
  const title='My Thoughts: '+baseQ;
  const ts=Date.now();
  const ed={id:edId,question:title,answer:story,tags:['editorial','pulse-editorial','operators-take','kory-white',(src.match(/^[a-z]+/)||['q'])[0]],quality_score:10,format_v:'2026-05',pending:false,ts,polished_at:ts,has_answer:true,model:'deepseek+claude-audit',editorial_style:true,source:'editorial',editorial_of:src};
  await store.setJSON('answers/'+edId+'.json',ed);
  idx.entries.unshift({id:edId,question:title,tags:ed.tags,quality_score:10,format_v:'2026-05',pending:false,ts,polished_at:ts,has_answer:true,model:'deepseek+claude-audit',was_indexed_at:null,source:'editorial',editorial_of:src});
  // restore source Q&A to its original encyclopedia answer
  s.answer=s.answer_orig; delete s.editorial_style; s.polished_at=ts;
  await store.setJSON('answers/'+src+'.json',s);
  await store.setJSON('_index.json',idx);
  try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id:edId})});}catch(e){}
  console.log(JSON.stringify({ok:true,editorial:edId,url:'https://pulserevops.com/knowledge/'+edId,restored:src,title}));
})().catch(e=>console.log(JSON.stringify({ok:false,err:String(e.message||e)})));
