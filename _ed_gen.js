// Editorial generator: original first-person op-ed ("Operator's Take" by Kory
// White, 25-yr CRO) tied to an existing Q&A. DeepSeek writes the draft; this is
// the E-E-A-T value-add (original voice, not templated). Publishes as ed#### entries.
//   node _ed_gen.js --pillar q --count 10 [--start N]
const fs=require('fs');const path=require('path');
const { dsChat } = require('./_ds_lib');
const { getStore } = require('@netlify/blobs');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const arg=(n,d)=>{const i=process.argv.indexOf('--'+n);return i>=0?process.argv[i+1]:d;};
const PILLAR=arg('pillar','q'); const COUNT=parseInt(arg('count','10'),10);

const SYS=`You are Kory White — a Chief Revenue Officer with 25 years building and scaling revenue organizations (~$3B scaled). You write a first-person editorial ("Operator's Take") — an original, opinionated, experience-driven essay. NOT a how-to, NOT a listicle. Real war stories, specific named situations, contrarian takes, what actually happens in the field. Banned: "delve, tapestry, cutting-edge, game-changer, synergy, in today's, ever-evolving". Output ONLY Markdown body.`;
function prompt(q){return `Write a 700-1000 word first-person EDITORIAL by Kory White riffing on this question as the jumping-off point:\n\n"${q}"\n\nRequirements:\n- Open with a hook from real operator experience (a deal, a hire, a board meeting) — not a definition.\n- One strong, specific OPINION/thesis. Defend it with concrete examples and real named tools/companies (Salesforce, Gong, Clari, HubSpot, etc.) where natural.\n- A "## What most people get wrong" section.\n- A "## What I'd actually do" section with a specific play.\n- Personal voice throughout ("I've seen...", "In my experience...").\n- End with a short "## The bottom line" + one line linking the reader to PULSE for the full operator guide.\n- NO mermaid, NO FAQ, NO fake stats. Markdown only.`;}

(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=2000&pillar='+PILLAR);
  const d=await r.json();
  const src=(d.entries||[]).filter(e=>e&&e.question&&!e.copied_from).slice(0,COUNT);
  const idx=await store.get('_index.json',{type:'json'});
  let maxEd=0;for(const e of idx.entries){const m=e&&e.id&&e.id.match(/^ed(\d+)$/);if(m)maxEd=Math.max(maxEd,parseInt(m[1],10));}
  const baseTs=Date.now(); const made=[];
  for(let i=0;i<src.length;i++){const s=src[i];const id='ed'+String(maxEd+1+i).padStart(4,'0');
    let body;try{const c=await dsChat([{role:'system',content:SYS},{role:'user',content:prompt(s.question)}],{temperature:0.75,max_tokens:4000});body=c.content.trim();}catch(e){console.log('ERR gen '+id+' '+e.message);continue;}
    const title='Operator’s Take: '+s.question.replace(/\?$/,'');
    const ts=baseTs-i*1000;
    const answer=`${body}\n\n---\n*Editorial by **Kory White**, Chief Revenue Officer · [Read the full operator guide](/knowledge/${s.id}) · [CRO Syndicate](https://crosyndicate.com/)*`;
    const entry={id,question:title,answer,tags:['editorial','pulse-editorial','operators-take',PILLAR,'kory-white'],quality_score:10,format_v:'2026-05',pending:false,ts,polished_at:ts,has_answer:true,model:'deepseek-editorial',source:'editorial',editorial_of:s.id};
    await store.setJSON('answers/'+id+'.json',entry);
    idx.entries.unshift({id,question:title,tags:entry.tags,quality_score:10,format_v:'2026-05',pending:false,ts,polished_at:ts,has_answer:true,model:'deepseek-editorial',was_indexed_at:null,source:'editorial',editorial_of:s.id});
    made.push({id,title,of:s.id});console.log('OK '+id+' <- '+s.id);
  }
  await store.setJSON('_index.json',idx);
  console.log(JSON.stringify({pillar:PILLAR,made:made.length,sample:made.slice(0,5)},null,2));
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
