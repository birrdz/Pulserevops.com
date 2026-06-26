const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const rec=await store.get('answers/ca0229.json',{type:'json'});
let b=rec.answer;
const before=(b.match(/landscape/gi)||[]).length;
// context-aware replacements then catch-all
b=b.replace(/competitive landscape/gi,'competitive field').replace(/truck landscape/gi,'truck market').replace(/pickup landscape/gi,'pickup market').replace(/\blandscape\b/gi,'market');
fs.writeFileSync('C:/Users/koryj/ca0229_answer.md',b);
console.log('replaced',before,'occurrences of landscape; wrote ca0229_answer.md ('+b.length+' chars)');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
