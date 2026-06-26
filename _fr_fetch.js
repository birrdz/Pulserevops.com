const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN;
const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
(async()=>{ const id=process.argv[2]; const rec=await store.get('answers/'+id+'.json',{type:'json'});
  fs.writeFileSync('C:/Users/koryj/'+id+'_answer.md', rec.answer); console.log('wrote', id, rec.answer.length,'chars / question:', rec.question);
})();
