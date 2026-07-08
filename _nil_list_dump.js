const fs=require('fs');const {getStore}=require('@netlify/blobs');
for(const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{
 const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
 const idx=await s.get('_index.json',{type:'json'});
 const isCollegeNil=e=>{
   if(!/^q\d+$/.test(e.id||''))return false;
   const t=(e.tags||[]).map(x=>String(x).toLowerCase());
   return t.includes('nil')||t.some(x=>x.startsWith('nil-'));
 };
 const nil=(idx.entries||[]).filter(e=>e&&isCollegeNil(e)).map(e=>({id:e.id,question:e.question}));
 nil.sort((a,b)=>{const na=+a.id.slice(1),nb=+b.id.slice(1);return na-nb;});
 fs.writeFileSync('C:/Users/koryj/website/_nil_entries.json',JSON.stringify(nil,null,0));
 const mbb=nil.filter(e=>/men'?s|mbb/i.test(e.question)).length;
 const wbb=nil.filter(e=>/women'?s|wbb/i.test(e.question)).length;
 const fb=nil.filter(e=>/football/i.test(e.question)).length;
 const bb=nil.filter(e=>/basketball/i.test(e.question)).length;
 console.log('COLLEGE NIL q-entries:',nil.length,'| basketball:',bb,'football:',fb,'| men:',mbb,'women:',wbb);
 console.log('id range:',nil[0]&&nil[0].id,'->',nil[nil.length-1]&&nil[nil.length-1].id);
 console.log('samples:'); nil.slice(0,3).concat(nil.slice(-3)).forEach(e=>console.log(' ',e.id,e.question));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
