// Add a topic image to sports/NIL entries (q####, tag-selected) that lack a
// leading image — the general NIL explainers the team-logo script skipped.
// Keyless DuckDuckGo. Prepends one HEAD-valid image. Never removes.
const fs=require('fs');
const { getStore }=require('@netlify/blobs');
try{const env=fs.readFileSync('C:/Users/koryj/website/.env.local','utf8');for(const l of env.split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}}catch(e){}
const TOK=process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN;
const s=getStore({name:'pulse-machine-library',siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482',token:TOK});
const SPORTS=/^(sports|nil|football|mbb|wbb|college-sports|college-nil|nil-gtm|nil-2027|nil-mbb|nil-wbb|nil-football|nil-business)$/i;
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function q(t){return String(t||'').replace(/\bin 20\d\d\b/gi,'').replace(/[?.!]+$/,'').trim()+' college sports';}
async function headOk(u){try{const r=await fetch(u,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(9000)});const ct=(r.headers.get('content-type')||'').toLowerCase();if(r.ok&&ct.startsWith('image/'))return true;const g=await fetch(u,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(9000)});return g.ok&&(g.headers.get('content-type')||'').toLowerCase().startsWith('image/');}catch(e){return false;}}
async function ddg(query,a=0){try{const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(query)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});const html=await tp.text();const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);if(!m){if(a<2){await sleep(1500+a*1500);return ddg(query,a+1);}return[];}await sleep(120);const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(query)+'&vqd='+m[1]+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});if(r.status===429||r.status===403){if(a<3){await sleep(2500+a*2500);return ddg(query,a+1);}return[];}let j;try{j=JSON.parse(await r.text());}catch(e){if(a<2){await sleep(2000);return ddg(query,a+1);}return[];}return(j.results||[]).map(x=>x.image).filter(Boolean);}catch(e){if(a<2){await sleep(1500);return ddg(query,a+1);}return[];}}
async function pick(query){const arr=await ddg(query);for(const im of arr.slice(0,10)){if(await headOk(im))return im;}return '';}
async function ping(id){try{await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)});}catch(e){}}
(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const sport=(idx.entries||[]).filter(e=>(e.tags||[]).some(t=>SPORTS.test(t)));
  const targets=[];
  for(const e of sport){const a=await s.get('answers/'+e.id+'.json',{type:'json'}).catch(()=>null);if(!a||!a.answer)continue;if(/^﻿?\s*!\[/.test(a.answer))continue;targets.push({id:e.id,q:e.question});}
  console.log('sports/NIL missing image:',targets.length);
  let done=0,fail=0,cur=0;const CONC=3;
  async function w(){while(cur<targets.length){const t=targets[cur++];const e=await s.get('answers/'+t.id+'.json',{type:'json'}).catch(()=>null);if(!e||!e.answer)continue;const img=await pick(q(t.q));if(!img){fail++;console.log('  no img',t.id);continue;}e.answer=e.answer.replace(/^﻿/,'');e.answer=`![${String(t.q||'').replace(/[\[\]]/g,'').slice(0,80)}](${img})\n\n`+e.answer.replace(/^\n+/,'');e.ts=Date.now();e.polished_at=Date.now();await s.setJSON('answers/'+t.id+'.json',e);await ping(t.id);done++;console.log(`  [${done}] ${t.id} -> ${img.slice(0,55)}`);}}
  await Promise.all(Array.from({length:CONC},w));
  console.log(`\nSPORTS IMG DONE. added=${done} no-image=${fail} of ${targets.length}`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
