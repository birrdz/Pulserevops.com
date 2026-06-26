const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
const BANNED=/\b(landscape|synerg\w*|holistic|delve|tapestry|game-?changer|cutting-?edge|state-of-the-art|drive growth|unlock (value|potential))\b/i;
const lo=parseInt(process.argv[2]), hi=parseInt(process.argv[3]);
(async()=>{
  let issues=0, n=0;
  for(let i=lo;i<=hi;i++){const id='fr'+String(i).padStart(4,'0'); const r=await store.get('answers/'+id+'.json',{type:'json'}); if(!r){console.log(id,'MISSING');issues++;continue;}
    n++; const b=r.answer||''; const mer=(b.match(/```mermaid/g)||[]).length; const faq=/## FAQ/i.test(b);
    const src=(b.split(/## Sources/i)[1]||'').match(/^\s*-\s+/gm)||[]; const price=/\$[\d,]/.test(b); const y=/2027/.test(b); const tldr=/TL;?DR/i.test(b); const ban=BANNED.test(b);
    const words=b.replace(/<[^>]+>/g,' ').replace(/[#*|`>-]/g,' ').split(/\s+/).filter(Boolean).length;
    const p=[]; if(mer<2)p.push('mer'+mer); if(!faq)p.push('faq'); if(src.length<5)p.push('src'+src.length); if(!price)p.push('noprice'); if(!y)p.push('no2027'); if(tldr)p.push('tldr'); if(ban)p.push('BAN:'+(b.match(BANNED)||[''])[0]); if(words<1150)p.push('thin'+words);
    if(p.length){console.log(id,p.join(','));issues++;}
  }
  console.log(issues?('ISSUES: '+issues+'/'+n):('CLEAN '+n+'/'+n+': 2+ mermaids, FAQ, 5+ sources, prices, 2027, no TLDR, no banned, 1150+ words'));
})();
