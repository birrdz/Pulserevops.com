// FAITHFUL story rewrite: re-tell the EXISTING answer in first-person storyteller
// style, preserving EVERY fact/number/recommendation/named-item/keyword (SEO-safe).
// Encyclopedia -> storyteller, same information. Sources the ORIGINAL (answer_orig
// if a prior pass exists, else current answer). In-place blob update; same id/title
// => no index loss. Parallel.
//   node _ed_scale.js --count 250 --par 4
const fs=require('fs');const path=require('path');
const { dsChat } = require('./_ds_lib');
const { getStore } = require('@netlify/blobs');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const arg=(n,d)=>{const i=process.argv.indexOf('--'+n);return i>=0?process.argv[i+1]:d;};
const COUNT=parseInt(arg('count','250'),10); const PAR=parseInt(arg('par','4'),10);
// VIBE recipes (tone/structure only — length follows the source so NO facts get dropped)
const RECIPES=[
 {vibe:'contrarian hot-take that opens by disagreeing with conventional wisdom',humor:'dry, occasional zinger',shape:'tight, few or no subheads'},
 {vibe:'a war story from the field',humor:'self-deprecating',shape:'narrative with casual subheads'},
 {vibe:'a patient mentor walking a newcomer through it',humor:'warm, light',shape:'rich subheads + asides'},
 {vibe:'blunt no-nonsense, here-is-what-actually-happens',humor:'deadpan',shape:'short punchy paragraphs'},
 {vibe:'reflective, big-picture, what experience taught me',humor:'wry',shape:'essay flow with a pull-quote line'},
 {vibe:'a spirited rant about what people get wrong',humor:'biting, funny',shape:'fast, conversational'},
 {vibe:'a case-study story with a turnaround arc',humor:'subtle',shape:'setup/turn/payoff + a sidebar'},
 {vibe:'myth-busting — everyone says X, here is the truth',humor:'sharp',shape:'claim, defend, repeat'},
 {vibe:'an opinionated guide, my take woven through',humor:'light',shape:'mixed prose + a short list where it helps'},
 {vibe:'a confident manifesto on how this should be done',humor:'occasional',shape:'sweeping sections'},
];
const SYS=`You are Kory White — a Chief Revenue Officer with 25 years' experience. Your job: REWRITE an existing answer into a first-person opinion STORY/editorial. ABSOLUTE RULE: preserve EVERY fact, number, price, recommendation, ranked item, and named tool/company/place/product from the original, and keep the important keywords/entities intact (SEO). A reader must be able to pass the exact same test from your version as from the original — the INFORMATION is identical, only the DELIVERY changes (dry encyclopedia -> warm first-person storyteller). Never invent facts not in the original; never drop facts to be shorter. If the original lists 10 items with prices, your story still covers all 10 with those prices. NO "## Sources", NO "## FAQ", NO mermaid, NO TL;DR, NO "Direct Answer" label. Vary your structure. Output ONLY the Markdown body.`;
const prompt=(q,a,r)=>`Rewrite the ORIGINAL ANSWER below as ${r.vibe}. Humor: ${r.humor}. Structure: ${r.shape}. First person (I/me/my), real voice, a hook up top and a through-line. KEEP 100% of the information, every number/price, every named item, every recommendation, and the key terms — only the storytelling changes. Match the original's depth (don't cut facts to be shorter; don't pad).\n\nQUESTION: "${q}"\n\nORIGINAL ANSWER (preserve all of its substance + keywords):\n"""\n${a}\n"""\n\nEnd with a punchy closing line + one soft pointer to PULSE / CRO Syndicate. Markdown only.`;
function stripFooter(s){return String(s||'').replace(/\n+---\n\*An operator's opinion[\s\S]*$/,'').replace(/\n+\*Editorial by[\s\S]*$/,'').trim();}
(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=20000');
  const d=await r.json();
  let cand=(d.entries||[]).filter(e=>e&&e.question&&e.has_answer!==false&&!e.noindex&&!e.copied_from&&e.source!=='editorial'&&/^[a-z]+\d+$/.test(e.id)&&!/^tl9\d/.test(e.id)&&!/^vq_/.test(e.id));
  // FIX-FIRST: entries already rewritten (need faithful redo) first, then fresh ones.
  cand.sort((a,b)=>((b.editorial_style?1:0)-(a.editorial_style?1:0))||((b.ts||0)-(a.ts||0)));
  const picks=cand.slice(0,COUNT);
  console.log('faithful story rewrite: '+picks.length+' (fix-first), par '+PAR);
  let i=0,done=0,fail=0,fixed=0;
  async function worker(){while(i<picks.length){const k=i++;const s=picks[k];const rec=RECIPES[k%RECIPES.length];
    try{
      const blob=await store.get('answers/'+s.id+'.json',{type:'json'});if(!blob){fail++;continue;}
      const source=stripFooter(blob.answer_orig||blob.answer);
      if(!source||source.length<200){fail++;continue;}
      const c=await dsChat([{role:'system',content:SYS},{role:'user',content:prompt(s.question,source.slice(0,9000),rec)}],{temperature:0.8,max_tokens:8000});
      const body=c.content.trim(); if(body.length<300){fail++;continue;}
      if(!blob.answer_orig)blob.answer_orig=blob.answer; else fixed++;
      blob.answer=body+"\n\n---\n*An operator's opinion by **Kory White**, Chief Revenue Officer — 25 years in revenue. [More at PULSE](/thoughts) · [CRO Syndicate](https://crosyndicate.com/)*";
      blob.editorial_style=true; blob.polished_at=Date.now();
      await store.setJSON('answers/'+s.id+'.json',blob);
      done++; if(done%20===0)console.log('  '+done+'/'+picks.length+' (last '+s.id+' '+body.split(/\s+/).length+'w)');
    }catch(err){fail++;console.log('  ERR '+s.id+' '+(err.message||err));}
  }}
  await Promise.all(Array.from({length:PAR},()=>worker()));
  await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:`PULSE — ${done} answers retold as STORIES (facts preserved)`,html:`<h2>${done} entries rewritten faithfully (${fixed} drift-fixes, ${fail} failed)</h2><p>Same information, storyteller delivery. Same questions, same IDs — SEO preserved. Browse <a href="https://pulserevops.com/thoughts">My Thoughts</a>.</p>`})});
  console.log('DONE faithful-rewrite done='+done+' fixed='+fixed+' fail='+fail);
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
