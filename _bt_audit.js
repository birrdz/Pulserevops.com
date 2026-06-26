const fs=require('fs');const {getStore}=require('@netlify/blobs');const {gradeEntry}=require('./netlify/functions/lib/grade-entry');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});
const bts=(idx.entries||[]).filter(e=>e&&/^bt\d+$/.test(e.id)).sort((a,b)=>a.id.localeCompare(b.id));
let ok=true;
for(const e of bts){const rec=await s.get('answers/'+e.id+'.json',{type:'json'});const b=rec.answer;const g=gradeEntry(e.id,b);const iss=[];
if(g.score<12)iss.push('score '+g.score+'['+g.missing.join(',')+']');if(g.word_count<1900)iss.push('words '+g.word_count);if(g.banned_hits&&g.banned_hits.length)iss.push('banned');
const secs=(b.match(/^#{2,3}\s+\d+\.\s+/gm)||[]).length;if(secs<10)iss.push('secs '+secs);
if(iss.length)ok=false;console.log((iss.length?'FAIL':'PASS')+' '+e.id+' ('+g.word_count+'w) — '+e.question+(iss.length?(' :: '+iss.join(' | ')):''));
if(e.id==='bt0002')fs.writeFileSync('C:/Users/koryj/_bt0002_view.md',b);}
console.log(ok?'\nALL CLEAN':'\nSOME FAILED');})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
