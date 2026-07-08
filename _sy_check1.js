const fs=require('fs');const {getStore}=require('@netlify/blobs');const {gradeEntry}=require('./netlify/functions/lib/grade-entry');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const {prepareEntryForPublish}=require('./_write_lib');
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const id='sy0049';const rec=await s.get('answers/'+id+'.json',{type:'json'});
let b=rec.answer;
b=b.replace(/^###\s+([^\n]+\?)\s*$/gm,(m,q)=>`**${q.trim()}**`);
const g=gradeEntry(id,b);
console.log('score',g.score,'wc',g.word_count,'floor',g.word_floor);
console.log('missing',g.missing);
})().catch(e=>{console.error('ERR',e.message)});
