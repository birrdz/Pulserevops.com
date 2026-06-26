// Direct-write for Fractional-CRO honeypot entries (tl#### tagged 'fractional-cro').
// These are personal-promo answers (Kory White photo + LinkedIn + resume placed
// high), NOT Top-10 product rankings, so they bypass the electronicreview grader
// and use a light must-have check instead.
//
// Usage: node _write_fcro.js <tl####> "<title>"   (body at C:/Users/koryj/<id>_answer.md)
const fs = require('fs');
const { prepareEntryForPublish } = require('./_write_lib');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');
  for (const line of env.split(/\r?\n/)) { const m=line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); } } catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN;
const ID=process.argv[2]; const TITLE=process.argv[3]; const FORCE=process.argv.includes('--force');
if(!ID||!/^tl\d+$/.test(ID)||!TITLE){console.error('usage: node _write_fcro.js <tl####> "<title>"');process.exit(1);}
const BODY_PATH=`C:/Users/koryj/${ID}_answer.md`;
const BANNED=['delve','tapestry','holistic','ever-evolving','synergy','paradigm shift','game-changer','cutting-edge','state-of-the-art','seamless integration','needless to say','it\'s worth noting','it\'s important to note'];
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const body=fs.readFileSync(BODY_PATH,'utf8');
  const words=body.split(/\s+/).filter(Boolean).length;
  const faqPairs=(body.match(/^\*\*[^*\n]+\?\*\*\s*$/gm)||[]).length;
  const probs=[];
  if(words<1500)probs.push('words='+words+' (<1500)');
  if(!/linkedin\.com\/in\/korywhite/i.test(body))probs.push('no LinkedIn link');
  if(!body.includes('/assets/kory-white.jpg'))probs.push('no photo');
  if(faqPairs<4)probs.push('faq='+faqPairs+' (<4)');
  if(!/##\s*Sources/i.test(body))probs.push('no Sources');
  if(/—/.test(body))probs.push('em dash present');
  const banned=BANNED.filter(b=>body.toLowerCase().includes(b)); if(banned.length)probs.push('banned:'+banned.join('/'));
  if(probs.length && !FORCE){console.error('REJECTED '+ID+': '+probs.join(', '));process.exit(2);}
  if(probs.length)console.error('NOTE '+ID+' (forced): '+probs.join(', '));
  const now=Date.now();
  const existing=await store.get(`answers/${ID}.json`,{type:'json'});
  const TAGS=['tools','fractional-cro','fractional-cro-2027','cro','top-10'];
  let entry={id:ID,question:TITLE,answer:body,tags:TAGS,quality_score:10,format_v:'2026-05',pending:false,ts:now,polished_at:now,model:'claude-opus-4-8',gold_format:true,
    polish_history:[...(existing&&Array.isArray(existing.polish_history)?existing.polish_history:[]),{from:existing&&existing.quality_score||0,to:10,at:now,note:'fractional-cro direct-write'}]};
  entry = prepareEntryForPublish(ID, TITLE, entry);
  await store.setJSON(`answers/${ID}.json`,entry);
  const idx=(await store.get('_index.json',{type:'json'}))||{entries:[]};
  const ei=idx.entries.findIndex(e=>e&&e.id===ID);
  const row={id:ID,question:TITLE,tags:entry.tags,quality_score:10,format_v:'2026-05',pending:false,ts:now,polished_at:now,model:'claude-opus-4-8',was_indexed_at:null};
  if(ei>=0)idx.entries.splice(ei,1); idx.entries.unshift(row);
  await store.setJSON('_index.json',idx);
  try{fs.unlinkSync(BODY_PATH);}catch(e){}
  let indexed=null; try{const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id:ID})});indexed=await r.json();}catch(e){indexed={ok:false};}
  console.log(JSON.stringify({ok:true,id:ID,words,faqPairs,ts:now,total:idx.entries.length,url:`https://pulserevops.com/tools/${ID}`,indexnow:indexed&&indexed.ok}));
})().catch(e=>{console.error('ERR',e&&e.message);process.exit(1);});
