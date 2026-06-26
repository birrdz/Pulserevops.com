// Transform existing Q&As into VARIED first-person Kory White editorials/stories.
// Every one different: word count (800-4000), vibe, humor, structure. No template,
// no Sources/FAQ/mermaid scaffold. Backs up original to answer_orig. Updates blob
// in place (no index change). Emails the URLs to approve.
//   node _ed_rewrite.js --count 10
const fs=require('fs');const path=require('path');
const { dsChat } = require('./_ds_lib');
const { getStore } = require('@netlify/blobs');
try{const e=fs.readFileSync(path.join(__dirname,'.env.local'),'utf8');for(const l of e.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'')}}catch(e){}
const SID='a2b74b30-a1ac-40e2-9622-aebfc2feb482';const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const arg=(n,d)=>{const i=process.argv.indexOf('--'+n);return i>=0?process.argv[i+1]:d;};
const COUNT=parseInt(arg('count','10'),10);

// 10 distinct recipes — vary length, vibe, humor, structure.
const RECIPES=[
 {w:'about 800 words, tight and punchy',vibe:'contrarian hot-take — open by disagreeing with the conventional wisdom',humor:'dry, occasional zinger',shape:'no subheads, one continuous argument'},
 {w:'about 1200 words',vibe:'a war story from a real deal/quarter that went sideways',humor:'self-deprecating',shape:'narrative with 2-3 casual subheads'},
 {w:'about 4000 words, the definitive long-read',vibe:'mentor walking a junior operator through the whole thing',humor:'warm, light',shape:'rich subheads, asides, a numbered play near the end'},
 {w:'about 1500 words',vibe:'blunt no-nonsense, "here is what actually happens"',humor:'deadpan',shape:'short punchy paragraphs'},
 {w:'about 2500 words',vibe:'reflective, big-picture, what 25 years taught me',humor:'wry',shape:'essay flow, a couple of pull-quote-style lines'},
 {w:'about 900 words',vibe:'rant — the thing that drives me crazy about this',humor:'biting, funny',shape:'fast, conversational, fragments OK'},
 {w:'about 3200 words',vibe:'case-study story: a company I turned around',humor:'subtle',shape:'arc with setup/turn/payoff + a sidebar'},
 {w:'about 1100 words',vibe:'myth-busting, "everyone tells you X; they are wrong"',humor:'sharp',shape:'a few bold claims, each defended'},
 {w:'about 2000 words',vibe:'playbook-with-personality — opinions woven into a real plan',humor:'light',shape:'mixed prose + one short checklist'},
 {w:'about 3600 words',vibe:'manifesto on how this should really be done',humor:'confident, occasional humor',shape:'big sweeping sections'},
];
const SYS=`You are Kory White — a Chief Revenue Officer with 25 years scaling revenue (~$3B). You write FIRST-PERSON editorials/columns — opinion, voice, story. NOT how-to docs, NOT listicles, NOT encyclopedia entries. Real operator experience, strong opinions, named tools/companies where natural. NO "## Sources" section, NO "## FAQ" section, NO mermaid diagrams, NO TL;DR. Vary your structure every time — you are a storyteller, not a template. Banned words: delve, tapestry, cutting-edge, game-changer, synergy, in today's, ever-evolving, seamless. Output ONLY the Markdown body, starting with a real hook (no "Direct Answer" label).`;
const prompt=(q,r)=>`Rewrite the topic of this question as a ${r.vibe} editorial — ${r.w}. Humor: ${r.humor}. Structure: ${r.shape}. Question to riff on (do not just answer it mechanically — have an opinion):\n\n"${q}"\n\nFirst person ("I've seen...", "Here's what I'd do..."). Make it read like a magazine column by a real CRO. End with a punchy closing line and one soft line pointing to PULSE / CRO Syndicate. Markdown only.`;

(async()=>{
  const store=getStore({name:'pulse-machine-library',siteID:SID,token:TOK});
  const r=await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=4000&pillar=q');
  const d=await r.json();
  const cand=(d.entries||[]).filter(e=>e&&e.question&&!e.copied_from&&e.source!=='editorial'&&/^q\d+$/.test(e.id));
  // spread across the list for topic variety
  const step=Math.max(1,Math.floor(cand.length/COUNT));
  const picks=[];for(let i=0;i<cand.length&&picks.length<COUNT;i+=step)picks.push(cand[i]);
  const out=[];
  for(let i=0;i<picks.length;i++){const s=picks[i];const rec=RECIPES[i%RECIPES.length];
    let body;try{const c=await dsChat([{role:'system',content:SYS},{role:'user',content:prompt(s.question,rec)}],{temperature:0.85,max_tokens:8000});body=c.content.trim();}catch(e){console.log('ERR '+s.id+' '+e.message);continue;}
    const blob=await store.get('answers/'+s.id+'.json',{type:'json'});if(!blob){console.log('no blob '+s.id);continue;}
    if(!blob.answer_orig)blob.answer_orig=blob.answer; // backup once
    blob.answer=body+`\n\n---\n*An operator's opinion by **Kory White**, Chief Revenue Officer — 25 years in revenue. [More at PULSE](/knowledge) · [CRO Syndicate](https://crosyndicate.com/)*`;
    blob.editorial_style=true; blob.polished_at=Date.now();
    await store.setJSON('answers/'+s.id+'.json',blob);
    const words=body.split(/\s+/).length;
    out.push({id:s.id,url:'https://pulserevops.com/knowledge/'+s.id,words,vibe:rec.vibe.slice(0,40)});
    console.log('OK '+s.id+' '+words+'w · '+rec.vibe.slice(0,40));
  }
  // email the URLs to approve
  const rows=out.map(o=>`<tr><td><a href="${o.url}">${o.id}</a></td><td>${o.words}w</td><td>${o.vibe}</td></tr>`).join('');
  await fetch('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:'PULSE — 10 sample EDITORIALS to approve (varied length/vibe)',html:`<h2>10 editorial rewrites — approve the direction?</h2><p>Each is a different length + vibe + structure (first-person Kory White opinion, no Sources/FAQ template). Click through and tell me if this is the storyteller direction you want before I scale it.</p><table border=1 cellpadding=6 style="border-collapse:collapse">${rows}</table>`})});
  console.log(JSON.stringify({made:out.length,urls:out.map(o=>o.url)},null,2));
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
