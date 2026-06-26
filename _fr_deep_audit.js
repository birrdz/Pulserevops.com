const { getStore } = require('@netlify/blobs');
const fs = require('fs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
} catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN;
const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
const BANNED=/\b(landscape|synerg\w*|holistic|delve|tapestry|game-?changer|cutting-?edge|state-of-the-art|drive growth|unlock (value|potential)|in today's|ever-evolving|fast-paced world)\b/i;
(async()=>{
  const manifest=require('./_fr_batch_manifest.json');
  let issues=[];
  for (const it of manifest.items){
    const rec=await store.get('answers/'+it.id+'.json',{type:'json'});
    if(!rec){issues.push(it.id+': MISSING'); continue;}
    const b=rec.answer||'';
    const mer=(b.match(/```mermaid/g)||[]).length;
    const hasFAQ=/##\s*FAQ/i.test(b);
    const sources=(b.match(/^- \*\*/gm)||[]); // rough
    const srcSec=b.split(/## Sources/i)[1]||''; const srcCount=(srcSec.match(/^\s*-\s+/gm)||[]).length;
    const hasPrice=/\$[\d,]/.test(b);
    const has2027=/2027/.test(b);
    const hasTLDR=/TL;?DR/i.test(b);
    const banned=BANNED.test(b);
    const probs=[];
    if(mer<2) probs.push('mermaids='+mer);
    if(!hasFAQ) probs.push('noFAQ');
    if(srcCount<5) probs.push('sources='+srcCount);
    if(!hasPrice) probs.push('noPrice');
    if(!has2027) probs.push('no2027');
    if(hasTLDR) probs.push('hasTLDR');
    if(banned) probs.push('BANNED:'+(b.match(BANNED)||[''])[0]);
    if(probs.length) issues.push(`${it.id}: ${probs.join(', ')}`);
  }
  console.log('=== DEEP AUDIT (200 entries) ===');
  console.log('Issues found:', issues.length);
  issues.forEach(x=>console.log('  '+x));
  if(!issues.length) console.log('CLEAN — all 200: 2+ mermaids, FAQ, 5+ sources, real prices, 2027 framing, no TL;DR, no banned phrases.');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
