// NEW (keyless/DuckDuckGo) version of the NIL college-logo adder. Serper is dead,
// so this replaces _nil_logo.js. Scans nil-tagged q entries, extracts a SPECIFIC
// school from the title, finds its athletics logo via DDG image search, HEAD-
// validates it, and prepends it as a standalone markdown image. Only acts on
// entries that name a real school (skips general NIL explainers). Never adds a
// second logo if one is already present.
//   node _nil_logo_ddg.js --dry      → preview targets, write nothing
//   node _nil_logo_ddg.js            → do it
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
const DRY = process.argv.includes('--dry');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Known D1 schools / programs (extend as needed). Title must contain one of these
// to be treated as team-specific. Longest match wins (so "Texas A&M" beats "Texas").
const SCHOOLS = [
  "Texas A&M","Ohio State","Michigan State","Florida State","Penn State","Oklahoma State","Oregon State","Arizona State","Kansas State","Mississippi State","Iowa State","NC State","North Carolina","South Carolina","Notre Dame","Georgia Tech","Boston College","Virginia Tech","West Virginia","Texas Tech","Miami","UCLA","USC","UConn","LSU","TCU","SMU","BYU","UNLV","UAB","UCF","Duke","Kentucky","Kansas","Indiana","Illinois","Purdue","Michigan","Wisconsin","Minnesota","Iowa","Nebraska","Maryland","Rutgers","Washington","Oregon","Stanford","California","Colorado","Utah","Arizona","Texas","Oklahoma","Alabama","Auburn","Georgia","Florida","Tennessee","Arkansas","Missouri","Mississippi","Vanderbilt","Clemson","Louisville","Virginia","Syracuse","Pittsburgh","Wake Forest","Baylor","Houston","Cincinnati","Memphis","Gonzaga","Villanova","Marquette","Creighton","Providence","Xavier","Butler","Seton Hall","Dayton","Saint Mary's","San Diego State","Boise State","Fresno State","Iowa Hawkeyes","Connecticut"
];
const sorted = SCHOOLS.slice().sort((a,b)=>b.length-a.length);
function extractSchool(q){
  const t = ' ' + q + ' ';
  for (const sc of sorted){ const re = new RegExp('\\b'+sc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'); if (re.test(t)) return sc; }
  return null;
}
function sport(q){ const t=q.toLowerCase(); if(t.includes("women")) return "women's basketball"; if(t.includes("basketball")||/\bmbb\b/.test(t)) return "basketball"; if(t.includes("football")) return "football"; if(t.includes("baseball")) return "baseball"; return "athletics"; }

async function headOk(url){ try{ const r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(9000)}); const ct=(r.headers.get('content-type')||'').toLowerCase(); if(r.ok&&ct.startsWith('image/'))return true; const g=await fetch(url,{method:'GET',headers:{Range:'bytes=0-1024','User-Agent':UA},redirect:'follow',signal:AbortSignal.timeout(9000)}); return g.ok&&(g.headers.get('content-type')||'').toLowerCase().startsWith('image/'); }catch(e){return false;} }
async function ddgImages(q, attempt=0){
  try{
    const tp=await fetch('https://duckduckgo.com/?q='+encodeURIComponent(q)+'&iax=images&ia=images',{headers:{'User-Agent':UA},signal:AbortSignal.timeout(15000)});
    const html=await tp.text();
    const m=html.match(/vqd=([\d-]+)/)||html.match(/vqd="([^"]+)"/);
    if(!m){ if(attempt<2){await sleep(1500+attempt*1500);return ddgImages(q,attempt+1);} return []; }
    await sleep(120);
    const r=await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q='+encodeURIComponent(q)+'&vqd='+m[1]+'&f=,,,&p=1',{headers:{'User-Agent':UA,'Referer':'https://duckduckgo.com/','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
    if(r.status===429||r.status===403){ if(attempt<3){await sleep(2500+attempt*2500);return ddgImages(q,attempt+1);} return []; }
    let j; try{j=JSON.parse(await r.text());}catch(e){ if(attempt<2){await sleep(2000);return ddgImages(q,attempt+1);} return []; }
    return (j.results||[]).map(x=>({image:x.image,url:x.url}));
  }catch(e){ if(attempt<2){await sleep(1500);return ddgImages(q,attempt+1);} return []; }
}
async function logoFor(school){
  for(const q of [school+' '+'college athletics logo', school+' logo png', school+' university logo']){
    const arr=await ddgImages(q);
    for(const c of arr.slice(0,10)){ if(c.image && await headOk(c.image)) return {img:c.image,src:c.url||''}; }
  }
  return {img:'',src:''};
}
async function pingIndexNow(id){ try{ await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'pulsemachine-writer-2026',id}),signal:AbortSignal.timeout(8000)}); }catch(e){} }

(async()=>{
  const idx=(await s.get('_index.json',{type:'json'}))||{entries:[]};
  const nil=(idx.entries||[]).filter(e=>{const t=(e.tags||[]).join(' ');return /\bnil\b|nil-/.test(t)||/\bnil\b/i.test(e.question||'');});
  const targets=[];
  for(const e of nil){ const school=extractSchool(e.question||''); if(school) targets.push({id:e.id,school,sport:sport(e.question||''),q:e.question}); }
  console.log(`NIL entries: ${nil.length} | team-specific (named school): ${targets.length}`);
  if(DRY){ targets.slice(0,60).forEach(t=>console.log(`  ${t.id} -> ${t.school} (${t.sport}) :: ${t.q.slice(0,70)}`)); console.log(`... ${targets.length} total`); return; }
  let done=0,skip=0;
  for(const t of targets){
    const e=await s.get('answers/'+t.id+'.json',{type:'json'}).catch(()=>null);
    if(!e||!e.answer){console.log(t.id,'NO ENTRY');continue;}
    if(/^\s*!\[/.test(e.answer)){ skip++; console.log(t.id,'already has leading image'); continue; }
    const {img}=await logoFor(t.school);
    if(!img){ console.log(t.id,'no logo for',t.school); continue; }
    e.answer = `![${t.school} athletics logo](${img})\n\n` + e.answer.replace(/^\n+/,'');
    e.ts=Date.now(); e.polished_at=Date.now();
    await s.setJSON('answers/'+t.id+'.json',e);
    await pingIndexNow(t.id);
    done++; console.log(`  [${done}] ${t.id} ${t.school} -> ${img.slice(0,60)}`);
  }
  console.log(`\nNIL logos DONE. added=${done} skipped(existing)=${skip} of ${targets.length} team-specific`);
})().catch(e=>{console.error('FATAL',e&&e.stack);process.exit(1);});
