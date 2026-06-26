const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await store.get('_index.json',{type:'json'});
const cas=(idx.entries||[]).filter(e=>e&&/^ca\d+$/.test(e.id)).sort((a,b)=>parseInt(a.id.slice(2))-parseInt(b.id.slice(2)));
fs.writeFileSync('C:/Users/koryj/_ca_titles.txt',cas.map(e=>e.id+': '+e.question).join('\n'));
console.log('dumped',cas.length,'titles to _ca_titles.txt');
// also dump ca0001 body for template
const t=await store.get('answers/ca0001.json',{type:'json'});
fs.writeFileSync('C:/Users/koryj/_ca0001_body.md',t.answer);
console.log('ca0001 body chars:',t.answer.length);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
