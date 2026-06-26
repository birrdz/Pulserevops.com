const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
const cg=idx.entries.filter(e=>e&&/^cg\d+$/.test(e.id)).map(e=>e.id).sort();
const nums=cg.map(id=>parseInt(id.slice(2),10));
console.log('CG live count:',cg.length,'| max:',Math.max(0,...nums));
console.log('ids:',cg.slice(0,30).join(','));
if(cg.length){const e=await s.get('answers/'+cg[0]+'.json',{type:'json'});console.log('--- sample',cg[0],'question:',e.question);console.log('--- tags:',JSON.stringify(e.tags));console.log('--- first 1200 chars ---');console.log((e.answer||'').slice(0,1200));}
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
