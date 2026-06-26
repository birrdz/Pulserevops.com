// Rebuild _held_queue.json + _held_count.txt from ACTUAL blob/index state.
// An entry is "held" if its answer blob has noindex===true OR it is absent from _index.json.
const fs=require('fs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const {getStore}=require('@netlify/blobs');
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
  const idx=(await store.get('_index.json',{type:'json'}))||{entries:[]};
  const inIndex=new Set(idx.entries.filter(e=>e&&e.id).map(e=>e.id));
  const prev=JSON.parse(fs.readFileSync('C:/Users/koryj/website/_held_queue.json','utf8'));
  const held=[];
  for(const q of prev){
    const rec=await store.get('answers/'+q.id+'.json',{type:'json'}).catch(()=>null);
    if(!rec) continue;
    const isHeld = rec.noindex===true || !inIndex.has(q.id);
    if(isHeld) held.push({id:q.id, question:rec.question||q.question});
  }
  fs.writeFileSync('C:/Users/koryj/website/_held_queue.json',JSON.stringify(held));
  fs.writeFileSync('C:/Users/koryj/website/_held_count.txt','held entries: '+held.length+'\n');
  const byPfx={};for(const h of held){const p=h.id.match(/^[a-z]+/)[0];byPfx[p]=(byPfx[p]||0)+1;}
  console.log('held now:',held.length,JSON.stringify(byPfx));
})().catch(e=>{console.error('ERR',e.message);});
