const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await store.get('_index.json',{type:'json'});
const cas=(idx.entries||[]).filter(e=>e&&/^ca\d+$/.test(e.id));
const nums=cas.map(e=>parseInt(e.id.replace('ca',''),10)).sort((a,b)=>a-b);
console.log('CA total:',cas.length,'| max id: ca'+(nums.length?String(nums[nums.length-1]).padStart(4,'0'):'none'));
console.log('first 25 titles:');
cas.sort((a,b)=>parseInt(a.id.slice(2))-parseInt(b.id.slice(2))).slice(0,25).forEach(e=>console.log('  '+e.id+': '+e.question));
// visitor priority check
try{const vp=await store.get('_visitor_priority.json',{type:'json'});console.log('VISITOR PRIORITY:',JSON.stringify(vp).slice(0,500));}catch(e){console.log('no _visitor_priority.json blob');}
try{const q=await store.get('queue.json',{type:'json'});console.log('QUEUE:',JSON.stringify(q).slice(0,500));}catch(e){console.log('no queue.json blob');}
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
