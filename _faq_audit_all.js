const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const prefixOf=id=>{const m=String(id).match(/^([a-z]+)/i);return m?m[1].toLowerCase():'?';};
const anyFAQ=a=>/^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});const ids=(idx.entries||[]).map(e=>e.id);
const stat={};let i=0,done=0;
async function w(){while(i<ids.length){const id=ids[i++];const p=prefixOf(id);stat[p]=stat[p]||{total:0,withF:0,no:0};stat[p].total++;try{const e=await s.get('answers/'+id+'.json',{type:'json'});if(e&&e.answer&&anyFAQ(e.answer))stat[p].withF++;else stat[p].no++;}catch(e){stat[p].no++;}done++;if(done%2000===0)console.error('  ',done,'/',ids.length);}}
await Promise.all(Array.from({length:16},w));
let tn=0;console.log('PREFIX  TOTAL  WITH_FAQ  NO_FAQ');
for(const p of Object.keys(stat).sort((a,b)=>stat[b].no-stat[a].no)){const r=stat[p];if(r.no>0){tn+=r.no;console.log(p.padEnd(7),String(r.total).padStart(5),String(r.withF).padStart(8),String(r.no).padStart(7));}}
console.log('--- pillars fully covered (0 missing):',Object.keys(stat).filter(p=>stat[p].no===0).join(' '));
console.log('TOTAL missing FAQ across all pillars:',tn);
fs.writeFileSync('C:/Users/koryj/website/_faq_audit_all.json',JSON.stringify(stat,null,1));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
