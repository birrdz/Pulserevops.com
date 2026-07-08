// PILLAR-BY-PILLAR image-relevance orchestrator. Runs the 3-cc-agent image auditor on ONE pillar
// to completion (all its images audited + made relevant), then moves to the next. Current Events
// first (worst offender: real people), then smallest-first (owner's pillar-by-pillar law). Fixes
// go LIVE to the blobs immediately. Resumable: children skip entries already stamped img_audited_at.
const fs = require('fs'); const { spawn } = require('child_process');
for (const l of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){ const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].replace(/^["']|["']$/g,''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token:process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const STATUS = '_image_audit_all_status.json';
const doneP = [];
function status(x){ try{ fs.writeFileSync(STATUS, JSON.stringify(Object.assign({ updatedAt:Date.now(), doneP }, x))); }catch(e){} }

(async()=>{
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  const counts = {};
  for (const e of (idx.entries||[])){ const m=(e&&e.id||'').match(/^([a-z]{1,3})\d/i); if(m){ const p=m[1].toLowerCase(); if(p!=='vq') counts[p]=(counts[p]||0)+1; } }
  let pillars = Object.keys(counts).sort((a,b)=>counts[a]-counts[b]);         // smallest first
  pillars = ['ce', ...pillars.filter(p=>p!=='ce')].filter((p,i,a)=>a.indexOf(p)===i && counts[p]);   // ce first, dedup
  console.log('[img-audit-all] '+pillars.length+' pillars, order: '+pillars.map(p=>p+'('+counts[p]+')').join(' → '));
  status({ pillars, counts, startedAt:Date.now(), current:null });
  for (const p of pillars){
    console.log('\n[img-audit-all] ▶ PILLAR '+p+' — '+counts[p]+' entries');
    status({ pillars, counts, current:p, currentSince:Date.now() });
    await new Promise(res=>{
      const ch = spawn('node', ['_image_audit.js'], { env:Object.assign({}, process.env, { PILLAR:p, IMG_WORKERS:(process.env.IMG_WORKERS||'1') }), stdio:'inherit' });
      ch.on('exit', ()=>res()); ch.on('error', ()=>res());
    });
    doneP.push(p);
    console.log('[img-audit-all] ✅ PILLAR '+p+' complete ('+doneP.length+'/'+pillars.length+')');
    status({ pillars, counts, current:null });
  }
  status({ finishedAt:Date.now(), current:null });
  console.log('\n[img-audit-all] ALL PILLARS AUDITED ✅');
})().catch(e=>{ console.error('[img-audit-all] FATAL', e.message); process.exit(1); });
