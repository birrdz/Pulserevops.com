const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const PRE=(process.argv[2]||'q,gb,sp').split(',');
const prefixOf=id=>{const m=String(id).match(/^([a-z]+)/i);return m?m[1].toLowerCase():'?';};
const stdFAQ=a=>/^##\s*FAQ\b/im.test(a)||/^##\s*Frequently Asked/im.test(a);
const anyFAQ=a=>/^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked Question)/im.test(a)||/(^|\n)\s*\*\*[^\n*]{6,}\?\*\*/.test(a)&&(a.match(/\*\*[^\n*]{6,}\?\*\*/g)||[]).length>=3;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});const ids=(idx.entries||[]).map(e=>e.id).filter(id=>PRE.includes(prefixOf(id)));
const stat={};let i=0,done=0;
async function w(){while(i<ids.length){const id=ids[i++];const p=prefixOf(id);stat[p]=stat[p]||{total:0,std:0,normalize:[],generate:[]};stat[p].total++;try{const e=await s.get('answers/'+id+'.json',{type:'json'});const a=(e&&e.answer)||'';if(stdFAQ(a))stat[p].std++;else if(anyFAQ(a))stat[p].normalize.push(id);else stat[p].generate.push(id);}catch(e){stat[p].generate.push(id);}done++;if(done%1000===0)console.error('  ',done,'/',ids.length);}}
await Promise.all(Array.from({length:16},w));
let tn=0,tg=0;console.log('PREFIX TOTAL HAS_STD_FAQ NEED_NORMALIZE NEED_GENERATE');for(const p of Object.keys(stat).sort()){const r=stat[p];tn+=r.normalize.length;tg+=r.generate.length;console.log(p.padEnd(6),String(r.total).padStart(5),String(r.std).padStart(11),String(r.normalize.length).padStart(14),String(r.generate.length).padStart(13));}
console.log('TOTALS: need normalize (has FAQ, wrong format):',tn,'| need generate (no FAQ at all):',tg);
fs.writeFileSync('C:/Users/koryj/website/_faq_audit3.json',JSON.stringify(stat,null,1));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
