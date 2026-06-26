const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
const tk=idx.entries.filter(e=>e&&/^tk\d+$/.test(e.id)).map(e=>e.id);
let withImg=0,zero=[];
for(const id of tk){const e=await s.get('answers/'+id+'.json',{type:'json'});const b=(e&&e.answer)||'';const imgs=(b.match(/@@PRODUCT[^\n]* img=/g)||[]).length;if(imgs>0)withImg++;else zero.push(id);}
console.log('TK image coverage — entries:',tk.length,'| with images:',withImg,'| ZERO images:',zero.length);
if(zero.length)console.log('  ZERO:',zero.join(','));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
