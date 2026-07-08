const {execSync}=require('child_process');const fs=require('fs');const {getStore}=require('@netlify/blobs');
try{const e=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
(async()=>{const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const idx=await s.get('_index.json',{type:'json'});const map={};for(const e of (idx.entries||[]))if(e&&/^sy\d+$/.test(e.id))map[e.id]=e.question;
const ids=process.argv.slice(2);
for(const id of ids){const title=map[id];if(!title){console.log('SKIP '+id+' no-title');continue;}
  if(!fs.existsSync('C:/Users/koryj/'+id+'_answer.md')){console.log('SKIP '+id+' no-file');continue;}
  try{const out=execSync('node _write_sy.js '+id+' '+JSON.stringify(title),{cwd:process.cwd(),encoding:'utf8',stdio:['pipe','pipe','pipe']});
    const okline=out.trim().split('\n').pop();let ok=false;try{ok=JSON.parse(okline).ok;}catch(e){}
    console.log((ok?'PUB ':'??? ')+id);
  }catch(e){console.log('ERR '+id+' '+(e.stdout||'')+(e.stderr||'').toString().slice(0,200));}
}
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
