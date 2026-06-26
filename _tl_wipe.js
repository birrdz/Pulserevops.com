const fs=require('fs');const {getStore}=require('@netlify/blobs');
for(const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
  const s=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const tlIds=idx.entries.filter(e=>e&&/^tl\d+$/i.test(e.id)).map(e=>e.id);
  console.log('tl entries to delete:',tlIds.length);
  // BACKUP
  const backup=[];
  for(const id of tlIds){const e=await s.get(`answers/${id}.json`,{type:'json'});if(e)backup.push(e);}
  fs.writeFileSync('C:/Users/koryj/_tl_backup_'+tlIds.length+'.json',JSON.stringify(backup));
  console.log('backed up',backup.length,'entries to C:/Users/koryj/_tl_backup_'+tlIds.length+'.json');
  // DELETE blobs
  let del=0;
  for(const id of tlIds){try{await s.delete(`answers/${id}.json`);del++;}catch(e){}}
  console.log('deleted blobs:',del);
  // PRUNE index
  idx.entries=idx.entries.filter(e=>!(e&&/^tl\d+$/i.test(e.id)));
  await s.setJSON('_index.json',idx);
  console.log('index pruned. remaining total:',idx.entries.length);
})();
