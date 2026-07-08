const fs=require('fs');const {getStore}=require('@netlify/blobs');const {gradeEntry}=require('./netlify/functions/lib/grade-entry');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
for(const id of process.argv.slice(2)){const rec=await s.get('answers/'+id+'.json',{type:'json'});const g=gradeEntry(id,rec.answer);
console.log((g.score<11?'FAIL':'PASS')+' '+id+' '+g.score+'/12 wc='+g.word_count+(g.score<11?' '+JSON.stringify(g.missing):'')+(g.banned_hits.length?' banned:'+g.banned_hits.join(','):''));}
})().catch(e=>{console.error('ERR',e.message);});
