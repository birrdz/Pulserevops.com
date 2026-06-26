const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN;
const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
(async()=>{
  for (const id of process.argv.slice(2)) {
    const rec = await store.get('answers/'+id+'.json',{type:'json'});
    const g = gradeEntry(id, rec.answer);
    console.log(`${id}: score ${g.score}/12, grader word_count ${g.word_count} (floor ${g.word_floor}), missing: ${g.missing.join(',')||'none'}`);
  }
})();
