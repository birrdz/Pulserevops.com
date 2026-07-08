const fs=require('fs');
for(const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const {getStore}=require('@netlify/blobs');
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
(async()=>{
const idx=await store.get('_index.json',{type:'json',consistency:'strong'});
const tl=idx.entries.filter(e=>/^tl\d+$/.test(e.id));
let max=0;for(const e of tl){const m=e.id.match(/^tl(\d+)$/);if(m)max=Math.max(max,+m[1]);}
console.log('TL COUNT',tl.length,'MAX',max);
const top10=tl.filter(e=>/^the 10 best|^10 best|top 10/i.test(e.question||''));
console.log('TOP10-ish',top10.length,'REGULAR',tl.length-top10.length);
fs.writeFileSync('_tl_titles.txt',tl.map(e=>e.id+' | '+(e.question||'')).join('\n'));
console.log('--- sample top10 ---');top10.slice(0,25).forEach(e=>console.log(e.question));
console.log('--- sample regular ---');tl.filter(e=>!/^the 10 best|^10 best|top 10/i.test(e.question||'')).slice(0,25).forEach(e=>console.log(e.question));
})().catch(e=>{console.error(e.message);process.exit(1);});
