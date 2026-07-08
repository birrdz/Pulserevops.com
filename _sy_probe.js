const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});
const sys=(idx.entries||[]).filter(e=>e&&/^sy00\d\d$/.test(e.id)&&parseInt(e.id.slice(2))<=100).sort((a,b)=>a.id.localeCompare(b.id));
for(const e of sys){const rec=await s.get('answers/'+e.id+'.json',{type:'json'});const b=rec.answer;
const hasH1=/^#\s+/m.test(b);
const hasWTW=/^##\s+[^\n]*(?:What to Wear|The Outfit|The Look|Dress Code|What .* Means?|The Rules|Build the Outfit|Core Pieces?)/im.test(b);
const hasAvoid=/^##\s+[^\n]*(?:Avoid|Mistakes?|Never Wear|What Not to Wear|Pitfalls?|Do(?:’|'|)s? (?:&|and) Don)/im.test(b);
const hasBL=/^##\s+[^\n]*Bottom Line/im.test(b);
const faqBoldMd=(b.match(/^\*\*[^*]+\?\*\*/gm)||[]).length;
const faqH3=(b.match(/^###\s+[^\n]+\?/gm)||[]).length;
const plain=b.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');const wc=plain.split(/\s+/).filter(Boolean).length;
const bold=(b.match(/<strong>[^<]*<\/strong>|\*\*[^*\n]+\*\*/gi)||[]).length;
console.log(e.id,'wc='+wc,'h1='+(hasH1?1:0),'wtw='+(hasWTW?1:0),'avoid='+(hasAvoid?1:0),'bl='+(hasBL?1:0),'faqBold='+faqBoldMd,'faqH3='+faqH3,'bold='+bold);}
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
