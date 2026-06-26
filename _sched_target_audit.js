const { getStore } = require('@netlify/blobs');
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const ids=[]; for(let i=1;i<=10;i++)ids.push(i); for(let i=61;i<=100;i++)ids.push(i);
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
 for(const i of ids){
  const id='tl'+String(i).padStart(4,'0');
  const e=await s.get('answers/'+id+'.json',{type:'json'});
  if(!e)continue;
  const a=e.answer||'';
  // pull the per-rep target: figures stated with day/shift near 'no less than' or 'target'
  const figs=[...new Set((a.match(/\$[\d,]+(?:\s*(?:a|per)\s*(?:day|shift|person))?/gi)||[])
     .filter(x=>/day|shift|person/i.test(x)))];
  const q=(e.question||'').replace(/^How Many |Should I Schedule.*$/g,'').trim();
  console.log(id+' | '+(e.question||'').slice(0,70)+' | targets: '+(figs.join('  ')||'(none found)'));
 }
})();
