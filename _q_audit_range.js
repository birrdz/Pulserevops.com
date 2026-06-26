const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
const ids = process.argv.slice(2);
(async()=>{
  let issues=0,n=0;
  for(const id of ids){
    const r=await store.get('answers/'+id+'.json',{type:'json'});
    if(!r){console.log(id,'MISSING');issues++;continue;}
    n++;
    const g=gradeEntry(id, r.answer);
    const b=r.answer||'';
    const reviewFooter=/review \/ reviews \/ rating/i.test(b);
    const has2027=/2027/.test(b);
    const p=[];
    if(g.score<10)p.push('SCORE'+g.score);
    if(g.word_count<1200)p.push('thin'+g.word_count);
    if(g.banned_hits.length)p.push('BAN:'+g.banned_hits.join('/'));
    if(!has2027)p.push('no2027');
    if(!reviewFooter)p.push('no-review-footer');
    if(g.mermaid_count<2)p.push('mer'+g.mermaid_count);
    if(p.length){console.log(id,'score='+g.score+'/12',p.join(','));issues++;}
    else console.log(id,'OK score='+g.score+'/12 words='+g.word_count);
  }
  console.log(issues?('\nISSUES: '+issues+'/'+ids.length):('\nCLEAN '+n+'/'+n+': score>=10, 1200+ words, 2+ mermaids, 2027, review-footer, no banned'));
})();
