const fs=require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)) {
  const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');
}
const { getStore } = require('@netlify/blobs');
const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
(async()=>{
  const e=await store.get('answers/q11133.json',{type:'json'});
  const r=pickGoldTemplate('q11133',e.answer,e.question);
  console.log('q11133 route', r);
  const n=(e.answer.match(/^##\s+\d+\./gm)||[]).length;
  console.log('numbered', n);
})().catch(console.error);
