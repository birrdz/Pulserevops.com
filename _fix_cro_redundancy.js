const fs=require('fs');const path=require('path');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const {getStore}=require('@netlify/blobs');
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const DRY=process.argv.includes('--dry');
const OLD='a 25-year revenue veteran who has scaled roughly $3B and rebuilt GTM from the studs up';
const NEW='an operator who rebuilds GTM from the studs up and makes the forecast trustworthy';
function clean(s){
  let o=s;
  // 1) praise that restated the stats
  o=o.split(OLD).join(NEW);
  // 2) CTA prefix that duplicates the profile-card stats — keep stats in the card only
  o=o.replace(/\*\*Kory White\*\* — \*\*Chief Revenue Officer\*\*, 25 years, ~\$3B scaled — is /g,'**Kory White** is ');
  o=o.replace(/\*\*Kory White\*\* — Chief Revenue Officer, 25 years, ~\$3B scaled — is /g,'**Kory White** is ');
  // 3) the premium ctaBlock long-form duplicate
  o=o.replace(/\*\*Kory White\*\* is a \*\*Chief Revenue Officer\*\* with 25 years building and scaling revenue organizations \(~\$3B scaled across SaaS, services, and B2B\) — /g,'**Kory White** is ');
  // 4) CTAS[3] spelled-out stat line that duplicates the card
  o=o.replace(/ Twenty-five years, ~\$3B scaled, and a bias for fixing the forecast fast\./g,'');
  // 5) stray double/single-encoded entities (defensive)
  o=o.replace(/&amp;#39;|&amp;#x27;|&#39;|&#x27;|&rsquo;|&#8217;/g,"'");
  return o;
}
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const idx=await store.get('_index.json',{type:'json'});
  const ids=idx.entries.filter(e=>e&&/^tl9\d+$/.test(e.id)).map(e=>e.id);
  let scanned=0,changed=0;const sample=[];
  for(const id of ids){const b=await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);if(!b||!b.answer)continue;scanned++;
    const after=clean(b.answer);
    if(after!==b.answer){changed++;if(sample.length<6)sample.push(id);if(!DRY){b.answer=after;await store.setJSON('answers/'+id+'.json',b);}}
  }
  console.log(JSON.stringify({dry:DRY,scanned,changed,sample},null,2));
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
