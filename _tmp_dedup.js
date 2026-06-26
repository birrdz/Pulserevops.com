const fs=require("fs");
const { getStore } = require("@netlify/blobs");
const env=fs.readFileSync("C:/Users/koryj/website/.env.local","utf8");
for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const TOK=process.env.BLOBS_PAT;
const terms=process.argv.slice(2);
(async()=>{
  const store=getStore({name:"pulse-machine-library",siteID:"a2b74b30-a1ac-40e2-9622-aebfc2feb482",token:TOK});
  const idx=await store.get("_index.json",{type:"json"});
  const ents=idx.entries||[];
  for(const t of terms){
    const tl=t.toLowerCase();
    const hits=ents.filter(e=>e&&(e.question||"").toLowerCase().includes(tl));
    console.log("\n== "+t+" == ("+hits.length+")");
    hits.slice(0,6).forEach(e=>console.log("  ",e.id,"|",(e.question||"").slice(0,85)));
  }
})().catch(e=>{console.error("ERR",e.message);process.exit(1);});
