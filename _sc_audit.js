const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8'); for (const l of env.split(/\r?\n/)){ const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); } } catch(e){}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
(async () => {
  const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:TOK });
  const idx = await store.get('_index.json',{type:'json'});
  const scs = (idx.entries||[]).filter(e=>e&&/^sc\d+$/.test(e.id)).sort((a,b)=>a.id.localeCompare(b.id));
  let allClean = true;
  for (const e of scs) {
    const rec = await store.get(`answers/${e.id}.json`,{type:'json'});
    const body = rec.answer; const g = gradeEntry(e.id, body);
    const issues = [];
    if (g.score < 12) issues.push('score '+g.score+'/12 missing['+g.missing.join(',')+']');
    if (g.word_count < 1900) issues.push('words '+g.word_count+'<1900');
    if (g.banned_hits && g.banned_hits.length) issues.push('banned['+g.banned_hits.join(',')+']');
    if (!/🏆|BEST\s+OVERALL/i.test(body)) issues.push('no BEST OVERALL');
    if (!/💎|BEST\s+VALUE/i.test(body)) issues.push('no BEST VALUE');
    const secs = (body.match(/^#{2,3}\s+\d+\.\s+/gm)||[]).length;
    if (secs < 10) issues.push('sections '+secs+'<10');
    const mermaid = (body.match(/```mermaid/g)||[]).length;
    if (mermaid < 1) issues.push('no mermaid');
    if (issues.length) allClean = false;
    console.log((issues.length?'FAIL':'PASS')+' '+e.id+' ('+g.word_count+'w, '+secs+' secs) — '+e.question + (issues.length?(' :: '+issues.join(' | ')):''));
    if (e.id==='sc0001'||e.id==='sc0003') fs.writeFileSync('C:/Users/koryj/_'+e.id+'_view.md', body);
  }
  console.log(allClean ? '\nALL 10 CLEAN ✅' : '\nSOME FAILED ❌');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
