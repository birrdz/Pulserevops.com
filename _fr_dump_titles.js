const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
(async()=>{
  const idx=(await store.get('_index.json',{type:'json'}))||{entries:[]};
  const fr=idx.entries.filter(e=>e&&e.id&&/^fr\d+$/.test(e.id));
  const titles=fr.map(e=>e.question).sort();
  fs.writeFileSync('C:/Users/koryj/_fr_existing_titles.json', JSON.stringify(titles,null,0));
  console.log('Existing fr entries:', fr.length);
})();
