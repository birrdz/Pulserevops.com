// Faithfully rewrite ONE entry into a first-person story, preserving every fact.
// Sources answer_orig (if a prior pass exists) else current answer. Backs up.
//   node _ed_one.js <id>  -> prints {id, ok, words}
const fs=require('fs');const path=require('path');
const { dsChat } = require('./_ds_lib');
const { getStore } = require('@netlify/blobs');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const id=process.argv[2]; if(!id){console.error('usage: node _ed_one.js <id>');process.exit(1);}
const RECIPES=[
 {vibe:'contrarian hot-take',humor:'dry',shape:'tight'},
 {vibe:'a war story from the field',humor:'self-deprecating',shape:'narrative w/ casual subheads'},
 {vibe:'a patient mentor walking a newcomer through it',humor:'warm',shape:'rich subheads + asides'},
 {vibe:'blunt no-nonsense',humor:'deadpan',shape:'short punchy paragraphs'},
 {vibe:'reflective big-picture',humor:'wry',shape:'essay flow'},
 {vibe:'a spirited rant',humor:'biting',shape:'fast, conversational'},
 {vibe:'a case-study turnaround story',humor:'subtle',shape:'setup/turn/payoff + sidebar'},
 {vibe:'myth-busting',humor:'sharp',shape:'claim, defend'},
 {vibe:'opinionated guide',humor:'light',shape:'prose + short list where it helps'},
 {vibe:'a confident manifesto',humor:'occasional',shape:'sweeping sections'},
];
function stripFooter(s){return String(s||'').replace(/\n+---\n\*An operator's opinion[\s\S]*$/,'').replace(/\n+\*Editorial by[\s\S]*$/,'').trim();}
// Remove residual encyclopedia scaffolding the model sometimes leaves behind.
// Sources / Related / review-keyword footer are pure external links + SEO — never unique narrative facts.
function cleanBody(s){
  let t=String(s||'');
  // drop a trailing review-keyword italic line
  t=t.replace(/\n+\*Review keywords:[\s\S]*$/i,'');
  // drop "## Sources" and everything after it (links only)
  t=t.replace(/\n+#{1,4}\s*Sources\b[\s\S]*$/i,'');
  // drop a residual FAQ section (its facts are always restated from the body) up to next ## or --- or Bottom Line
  t=t.replace(/\n+#{1,4}\s*(?:Frequently Asked Questions|FAQ)\b[^\n]*\n[\s\S]*?(?=\n#{1,4}\s|\n+---|$)/i,'');
  // drop "## Related..." sections (cross-links only) up to the next heading
  t=t.replace(/\n+#{1,4}\s*Related\b[^\n]*\n[\s\S]*?(?=\n#{1,4}\s|\n+---|$)/i,'');
  // collapse leftover horizontal rules / blank runs
  t=t.replace(/\n{3,}/g,'\n\n').replace(/(?:\n+---\s*)+$/,'').trim();
  return t;
}
const SYS=`You are Kory White — a CRO with 25 years' experience. REWRITE the given answer into a first-person opinion STORY. ABSOLUTE RULE: preserve EVERY fact, number, price, recommendation, ranked item, named tool/company/place/product, and key term/keyword from the original. A reader must pass the same test from your version as the original — INFORMATION identical, only DELIVERY changes (encyclopedia -> warm first-person storyteller). Never invent facts; never drop facts to be shorter. NO "## Sources"/"## FAQ"/mermaid/TL;DR/"Direct Answer" label. Output ONLY the Markdown body.`;
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const blob=await store.get('answers/'+id+'.json',{type:'json'});
  if(!blob){console.log(JSON.stringify({id,ok:false,err:'no blob'}));return;}
  const src=stripFooter(blob.answer_orig||blob.answer);
  if(!src||src.length<150){console.log(JSON.stringify({id,ok:false,err:'thin source'}));return;}
  const h=[...id].reduce((a,c)=>a+c.charCodeAt(0),0);const r=RECIPES[h%RECIPES.length];
  const q=blob.question||id;
  const c=await dsChat([{role:'system',content:SYS},{role:'user',content:`Rewrite the ORIGINAL ANSWER as ${r.vibe} (humor: ${r.humor}; structure: ${r.shape}), first person, hook + through-line. KEEP 100% of the info/numbers/named items/keywords; match its depth. Question: "${q}"\n\nORIGINAL ANSWER:\n"""\n${src.slice(0,24000)}\n"""\n\nEnd with a punchy line + soft pointer to PULSE / CRO Syndicate. Markdown only.`}],{temperature:0.8,max_tokens:8000});
  const body=cleanBody(c.content.trim()); if(body.length<300){console.log(JSON.stringify({id,ok:false,err:'short output'}));return;}
  if(!blob.answer_orig)blob.answer_orig=blob.answer;
  blob.answer=body+"\n\n---\n*An operator's opinion by **Kory White**, Chief Revenue Officer — 25 years in revenue. [More at PULSE](/thoughts) · [CRO Syndicate](https://crosyndicate.com/)*";
  blob.editorial_style=true; blob.polished_at=Date.now();
  await store.setJSON('answers/'+id+'.json',blob);
  console.log(JSON.stringify({id,ok:true,words:body.split(/\s+/).length,vibe:r.vibe}));
})().catch(e=>{console.log(JSON.stringify({id,ok:false,err:String(e.message||e)}));});
