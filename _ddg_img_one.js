// Add a DuckDuckGo image to ONE entry. node _ddg_img_one.js <id> "<query>"
const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const id=process.argv[2]; const q=process.argv[3]||'';
async function ddgImage(query){
  const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(query)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
  const html=await tp.text(); const m=html.match(/vqd=["']?([\d-]+)/); if(!m) return null;
  const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(query)+'&vqd='+m[1]+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
  const j=await r.json(); const results=(j&&j.results)||[];
  for(const it of results){ if(it.image && /^https?:\/\//.test(it.image)) return it.image; }
  return null;
}
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const blob=await store.get('answers/'+id+'.json',{type:'json'}); if(!blob){console.log('no blob');return;}
  const img=await ddgImage(q||blob.question||id);
  if(!img){console.log(JSON.stringify({id,ok:false,err:'no ddg image'}));return;}
  // proxy hotlink-protected hosts via wsrv.nl so it always displays
  const proxied='https://wsrv.nl/?url='+encodeURIComponent(img)+'&w=1200&output=webp';
  const md='!['+(blob.question||id).replace(/[\[\]]/g,'')+']('+proxied+')';
  // insert after first paragraph
  var parts=String(blob.answer||'').split(/\n\n/);
  if(parts.length>=2 && !/!\[/.test(parts[0]+parts[1])) parts.splice(1,0,md); else parts.unshift(md);
  blob.answer=parts.join('\n\n'); blob.polished_at=Date.now();
  await store.setJSON('answers/'+id+'.json',blob);
  console.log(JSON.stringify({id,ok:true,img,via:'ddg'}));
})().catch(e=>console.log(JSON.stringify({id,ok:false,err:String(e.message||e)})));
