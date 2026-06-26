// One-time repair: re-stamp copied_from/copied_from_pillar/family_id onto index
// rows for cross-pillar copies whose row lost them via an earlier reconcile.
// Reads blobs for the dest-pillar prefixes, syncs the marker into the index row.
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
// prefixes that received cross-pillar copies (q copies live in q13/q14 range)
const PREFIXES=['pt','tv','nl','tn','lv','ev','cl','gm','wl','hf','sw','tk','ra','bo','co','aq','er','mv','sy','sp','q13','q14','q15','q16','q17'];
(async()=>{
  const s=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const idx=await s.get('_index.json',{type:'json'});
  const rowById=new Map(idx.entries.map(e=>[e.id,e]));
  let ids=[];
  for(const pfx of PREFIXES){let cur;do{const r=await s.list({prefix:'answers/'+pfx,cursor:cur});for(const b of r.blobs){const m=b.key.match(/^answers\/([a-z]+\d+)\.json$/);if(m)ids.push(m[1]);}cur=r.cursor;}while(cur);}
  ids=[...new Set(ids)];
  let updated=0,checked=0;
  // concurrency pool
  let i=0;const CONC=12;
  async function worker(){while(i<ids.length){const id=ids[i++];const row=rowById.get(id);if(!row)continue;checked++;
    if(row.copied_from&&row.family_id)continue; // already good
    const b=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(b&&b.copied_from){row.copied_from=b.copied_from;if(b.copied_from_pillar)row.copied_from_pillar=b.copied_from_pillar;row.family_id=b.family_id||b.copied_from;updated++;}
  }}
  await Promise.all(Array.from({length:CONC},()=>worker()));
  if(updated)await s.setJSON('_index.json',idx);
  console.log(JSON.stringify({checked,updated,index:idx.entries.length}));
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
