// IMAGE-RELEVANCE CREW — 3 cc (Claude Code Max plan) agents audit every image in each answer for
// relevance to the Q&A/story, then tell the image tier the correct subject. Real subjects (people/
// teams/places/events/brands) → real photos via DDG; concepts → Pollinations. Resumable (skips
// entries already stamped img_audited_at). Owner LAW: images must be relevant to content.
const fs = require('fs'), path = require('path');
const { execFile } = require('child_process');
for (const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const { pickImage } = require('./_v2_nr_ddg');

const WORKERS = parseInt(process.env.IMG_WORKERS || '3', 10);
const LIMIT = parseInt(process.env.LIMIT || '0', 10);      // 0 = all
const START_AT = parseInt(process.env.START_AT || '0', 10);
const PROG = '_image_audit_progress.json';

// ── Claude Code Max plan CLI ──
function findCli(){ if(process.env.CLAUDE_CLI&&fs.existsSync(process.env.CLAUDE_CLI))return process.env.CLAUDE_CLI;
  try{ const base=path.join(process.env.USERPROFILE||'C:/Users/koryj','.vscode','extensions');
    const d=fs.readdirSync(base).filter(x=>/^anthropic\.claude-code-/i.test(x)).sort().reverse();
    for(const x of d){ const p=path.join(base,x,'resources','native-binary','claude.exe'); if(fs.existsSync(p))return p; } }catch(e){} return 'claude'; }
const CLI = findCli();
function cc(prompt, ms){ return new Promise(res=>{ execFile(CLI,['-p',prompt],{timeout:ms||90000,maxBuffer:4*1024*1024,windowsHide:true},(e,out)=>{ const t=String(out||'').trim(); res(t||''); }); }); }

function pillarOf(id){ const m=String(id).match(/^([a-z]+)\d+/i); return m?m[1].toLowerCase():'q'; }
function pollUrl(subject, seedStr){ let h=0; for(const c of String(seedStr)) h=(h*31+c.charCodeAt(0))>>>0; return 'https://image.pollinations.ai/prompt/'+encodeURIComponent('realistic editorial photograph of '+String(subject).slice(0,90)+', natural light, no text, no watermark')+'?width=1200&height=675&nologo=true&model=flux&seed='+(h%100000); }

// audit + fix one entry's images; returns 'fixed N' / 'ok' / 'no-img' / 'skip'
async function auditEntry(id, question, body){
  const imgRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imgs = []; let m; while((m=imgRe.exec(body))) imgs.push({ alt:m[1], url:m[2], full:m[0] });
  if(!imgs.length) return { status:'no-img' };
  const heads = (body.match(/^#{2,3}\s+(.+)$/gm)||[]).map(h=>h.replace(/^#{2,3}\s+/,'').slice(0,50)).slice(0,8);
  const sys = 'You are an image-relevance editor. For an article you get the TITLE, its section headings, and the current image captions in order. For EACH image, give the single best LITERAL photo subject that matches that spot in the article. If the ideal subject is a SPECIFIC real person, team, place, brand, venue, or event, set real=true (we fetch a real photo); if it is a generic concept/scene set real=false (we generate it). Reply ONLY with a JSON array, one object per image IN ORDER, exactly this shape: [{"subject":"2-6 word concrete subject, no punctuation","real":true|false}]. No prose.';
  const user = 'TITLE: '+question+'\nSECTIONS: '+(heads.join(' | ')||'(none)')+'\nIMAGES ('+imgs.length+', in order):\n'+imgs.map((x,i)=>(i+1)+') '+(x.alt||'(no caption)')).join('\n')+'\n\nReturn the JSON array with EXACTLY '+imgs.length+' objects.';
  let raw = await cc(sys+'\n\n'+user, 90000);
  let plan; try{ const jm = raw.match(/\[[\s\S]*\]/); plan = JSON.parse(jm?jm[0]:raw); }catch(e){ return { status:'cc-parse-fail' }; }
  if(!Array.isArray(plan) || !plan.length) return { status:'cc-empty' };
  let nb = body, fixed = 0;
  for(let i=0;i<imgs.length && i<plan.length;i++){
    const p = plan[i]; if(!p||!p.subject) continue;
    let newUrl = '';
    if(p.real){ try{ newUrl = await pickImage(String(p.subject)); }catch(e){} }
    if(!newUrl) newUrl = pollUrl(p.subject, id+i+p.subject);   // fallback / concept
    if(newUrl && newUrl !== imgs[i].url){
      const alt = String(p.subject).replace(/[\[\]"]/g,'').slice(0,70);
      nb = nb.replace(imgs[i].full, '!['+alt+']('+newUrl+')');
      fixed++;
    }
  }
  return { status: fixed?('fixed '+fixed):'ok', body: fixed?nb:null };
}

let done=0, fixed=0, ok=0, noimg=0, errors=0, total=0, started=Date.now();
function save(x){ try{ fs.writeFileSync(PROG, JSON.stringify(Object.assign({done,fixed,ok,noimg,errors,total,workers:WORKERS,startedAt:started,updatedAt:Date.now()},x||{}))); }catch(e){} }

(async()=>{
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  let ids = (idx.entries||[]).filter(e=>e&&e.id&&/^[a-z]{1,3}\d+$/i.test(e.id)).map(e=>e.id);
  if(process.env.PILLAR){ const rx=new RegExp('^'+process.env.PILLAR+'\\d'); ids=ids.filter(x=>rx.test(x)); }   // e.g. PILLAR=ce
  if(START_AT) ids = ids.slice(START_AT);
  if(LIMIT) ids = ids.slice(0, LIMIT);
  total = ids.length;
  console.log('[img-audit] '+total+' entries · '+WORKERS+' cc agents · relevance audit via '+CLI.split('\\').pop());
  let cursor = 0;
  async function worker(){
    while(cursor < ids.length){
      const id = ids[cursor++];
      try{
        const e = await store.get('answers/'+id+'.json',{type:'json'}).catch(()=>null);
        if(!e||!e.answer){ done++; continue; }
        if(e.img_audited_at && !process.env.REDO){ done++; ok++; continue; }   // resume: skip audited
        const r = await auditEntry(id, e.question||id, e.answer);
        if(r.status.startsWith('fixed') && r.body){ await store.setJSON('answers/'+id+'.json', Object.assign({},e,{answer:r.body,img_audited_at:new Date().toISOString(),updated_at:new Date().toISOString()})); fixed++; console.log('[img-audit] '+id+' → '+r.status+' · '+String(e.question).slice(0,44)); }
        else { await store.setJSON('answers/'+id+'.json', Object.assign({},e,{img_audited_at:new Date().toISOString()})); if(r.status==='no-img')noimg++; else ok++; }
        done++;
      }catch(err){ errors++; done++; }
      if(done%20===0){ const rate=(done/((Date.now()-started)/1000)).toFixed(2); console.log('[img-audit] '+done+'/'+total+' · '+fixed+' re-imaged · '+rate+'/s'); save(); }
      await new Promise(r=>setTimeout(r, parseInt(process.env.IMG_PACE||'2000',10)));   // gentle pace (owner: ease Max-plan load)
    }
  }
  await Promise.all(Array.from({length:WORKERS},()=>worker()));
  save({finishedAt:Date.now()});
  console.log('[img-audit] DONE · '+fixed+' re-imaged · '+ok+' already-relevant · '+noimg+' no-image · '+errors+' errors of '+total);
})().catch(e=>{ console.error('[img-audit] FATAL', e.message); process.exit(1); });
