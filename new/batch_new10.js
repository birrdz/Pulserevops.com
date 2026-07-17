'use strict';
const fs=require('fs');const {spawnSync}=require('child_process');const WD='C:/Users/koryj/website';
for(const l of fs.readFileSync(WD+'/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const {getStore}=require('@netlify/blobs');
const store=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:process.env.BLOBS_PAT||process.env.NETLIFY_BLOBS_TOKEN||process.env.NETLIFY_AUTH_TOKEN});
const QS=[
 'How do you build a 30-60-90 day plan as a new sales leader in 2027?',
 'How do you run a deal review that actually moves deals forward in 2027?',
 'How do you qualify deals with MEDDICC in 2027?',
 'How do you handle a price objection late in a deal in 2027?',
 'How do you win back a churned customer in 2027?',
 'How do you build a referral program that generates real pipeline in 2027?',
 'How do you have a hard conversation with an underperforming rep in 2027?',
 'How do you build influence without authority in 2027?',
 'How do you make a high-stakes decision without complete data in 2027?',
 'How do you run a board meeting as a first-time revenue leader in 2027?'];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>3&&!['2027','what','how','the','you','your','that','with','does','and'].includes(w));
(async()=>{const idx=await store.get('_index.json',{type:'json'});const ex=idx.entries.map(e=>new Set(norm(e.question)));
const sim=q=>{const a=new Set(norm(q));let b=0;for(const s of ex){let i=0;a.forEach(t=>{if(s.has(t))i++;});const j=i/(a.size+s.size-i||1);if(j>b)b=j;}return b;};
let done=0;for(const q of QS){const s=sim(q);if(s>0.72){console.log('SKIP dup',q);continue;}done++;console.log('['+done+'/10]',q);
const r=spawnSync(process.execPath,[WD+'/new/generate.js',q],{cwd:WD,encoding:'utf8',timeout:600000,env:Object.assign({},process.env,{GEN_FORCE_FORMAT:'essay'})});
console.log('  →',/3\/3 —/.test((r.stdout||'')+(r.stderr||''))?'3/3 ✓':'needs-review');}
console.log('=== NEW-10 DONE ·',done,'===');})();
