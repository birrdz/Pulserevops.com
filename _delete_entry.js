const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;const ID=process.argv[2];
if(!ID){console.error('usage: node _delete_entry.js <id>');process.exit(1);}
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
try{await s.delete('answers/'+ID+'.json');}catch(e){}
const idx=await s.get('_index.json',{type:'json'});const before=idx.entries.length;idx.entries=idx.entries.filter(e=>e&&e.id!==ID);await s.setJSON('_index.json',idx);
console.log(JSON.stringify({ok:true,deleted:ID,index_before:before,index_after:idx.entries.length}));})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
