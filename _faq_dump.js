// Dumps the next N entries (q,sp by default) that still lack a FAQ into
// faq_gen/<id>.txt (TITLE + BODY), for a Claude subagent to read & write a FAQ.
// Prints the space-separated ID list. Usage: node _faq_dump.js <N> [prefixCSV] [offset]
const fs=require('fs');const { getStore }=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN});
const prefixOf=id=>{const m=String(id).match(/^([a-z]+)/i);return m?m[1].toLowerCase():'?';};
const num=id=>{const m=String(id).match(/\d+/);return m?parseInt(m[0],10):0;};
const hasFAQ=a=>/^#{2,4}\s*(\d+[.)]\s*)?(FAQ|Frequently Asked)/im.test(a);
const N=parseInt(process.argv[2]||'25',10);
const PRE=(process.argv[3]||'q,sp').split(',').map(x=>x.trim().toLowerCase());
const OFF=parseInt(process.argv[4]||'0',10);
(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const ids=(idx.entries||[]).map(e=>({id:e.id,q:e.question})).filter(e=>PRE.includes(prefixOf(e.id))).sort((a,b)=>{const pa=prefixOf(a.id),pb=prefixOf(b.id);return pa===pb?num(a.id)-num(b.id):pa<pb?-1:1;});
  fs.mkdirSync('C:/Users/koryj/website/faq_gen',{recursive:true});
  const picked=[];let i=OFF;
  while(i<ids.length&&picked.length<N){
    const {id,q}=ids[i++];
    const e=await s.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer)continue;
    if(hasFAQ(e.answer))continue;
    const title=q||e.question||id;
    const body=String(e.answer).replace(/^!\[[^\]]*\]\([^)]*\)\s*/,'').slice(0,6000);
    fs.writeFileSync('C:/Users/koryj/website/faq_gen/'+id+'.txt','TITLE: '+title+'\n\nBODY:\n'+body);
    picked.push(id);
  }
  console.log(picked.join(' '));
  console.error('dumped '+picked.length+' (scanned to index '+i+'/'+ids.length+')');
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
