const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const a=await store.get('answers/tl0001.json',{type:'json'});
  const b=await store.get('answers/tl0011.json',{type:'json'});
  fs.writeFileSync('C:/Users/koryj/website/_SCHED_EXEMPLAR.md', a.answer, 'utf8');
  fs.writeFileSync('C:/Users/koryj/website/_RECRUIT_EXEMPLAR.md', b.answer, 'utf8');
  console.log('sched words', a.answer.split(/\s+/).length, '| recruit words', b.answer.split(/\s+/).length);
})();
