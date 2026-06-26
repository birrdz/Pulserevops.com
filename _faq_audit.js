const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const PRE=(process.argv[2]||'q,gb,sp').split(',');
const prefixOf=id=>{const m=String(id).match(/^([a-z]+)/i);return m?m[1].toLowerCase():'?';};
const hasFAQ=a=>/^#{2,3}\s*(FAQ|Frequently Asked)/im.test(a);
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});const ids=(idx.entries||[]).map(e=>e.id).filter(id=>PRE.includes(prefixOf(id)));
const stat={};let i=0,done=0;
async function w(){while(i<ids.length){const id=ids[i++];const p=prefixOf(id);stat[p]=stat[p]||{total:0,withFAQ:0,no:[]};stat[p].total++;try{const e=await s.get('answers/'+id+'.json',{type:'json'});if(e&&e.answer&&hasFAQ(e.answer))stat[p].withFAQ++;else stat[p].no.push(id);}catch(e){stat[p].no.push(id);}done++;if(done%1000===0)console.error('  ',done,'/',ids.length);}}
await Promise.all(Array.from({length:16},w));
let tot=0;console.log('PREFIX TOTAL WITH_FAQ NO_FAQ');for(const p of Object.keys(stat).sort()){const r=stat[p];tot+=r.no.length;console.log(p.padEnd(6),String(r.total).padStart(5),String(r.withFAQ).padStart(8),String(r.no.length).padStart(7));}
console.log('TOTAL needing FAQ:',tot);
fs.writeFileSync('C:/Users/koryj/website/_faq_audit.json',JSON.stringify(stat,null,1));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
