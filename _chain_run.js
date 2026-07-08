// _chain_run.js — SEQUENTIAL writer (owner 2026-06-29: "all agents/resources on style until
// done, then crabs, then fishing"). One phase at a time, BOTH writer slots on the active phase.
// Phase order: STYLE (_sy_full_queue.json, ruleset 'style') -> CRAB (_cf_queue.json pillar cr,
// ruleset 'qa') -> FISH (_cf_queue.json pillar fs, ruleset 'qa'). A phase is DONE when a full
// pass writes 0 new AND has 0 failures (everything left already published >=10). Then it
// advances. Idles 60m only after ALL three are done. Stop: _chain_stop.flag. Log: _chain.out.log
const fs = require('fs');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const CONC = parseInt(process.env.CHAIN_CONC || '1', 10);
const PACE_MS = parseInt(process.env.PACE_MS || '0', 10);   // economy pacing: sleep after each item (5/10 speed)
const STOP = 'C:/Users/koryj/website/_chain_stop.flag';
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_chain.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function loadStyle(){ try{ return JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_full_queue.json','utf8')).map(x=>({id:x.id,title:x.title,ruleset:'style'})); }catch(e){ return []; } }
function loadCf(pillar){ try{ return JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cf_queue.json','utf8')).filter(x=>x.pillar===pillar).map(x=>({id:x.id,title:x.title,ruleset:'qa'})); }catch(e){ return []; } }
const PHASE_DEFS = {
  STYLE: { name:'STYLE', load:loadStyle },
  CRAB:  { name:'CRAB',  load:()=>loadCf('cr') },
  FISH:  { name:'FISH',  load:()=>loadCf('fs') },
};
// Order is STYLE,CRAB,FISH by default (4444-locked). CHAIN_PHASES env overrides the order
// (e.g. CRAB,FISH,STYLE) so an explicit owner order can jump the queue without editing this file.
const PHASES = (process.env.CHAIN_PHASES || 'STYLE,CRAB,FISH').split(',').map(s=>s.trim().toUpperCase()).filter(n=>PHASE_DEFS[n]).map(n=>PHASE_DEFS[n]);
async function runPass(q){
  let qi=0, done=0, skip=0, fail=0;
  async function worker(){
    while (qi < q.length){
      if (fs.existsSync(STOP)) return;
      const item = q[qi++];
      try{
        const existing = await store.get('answers/'+item.id+'.json',{type:'json'}).catch(()=>null);
        if (existing && existing.quality_score >= 10){ skip++; continue; }
        const { body } = await generateGradedBody(item.id, item.title, { ruleset:item.ruleset });
        fs.writeFileSync('C:/Users/koryj/'+item.id+'_answer.md', body);
        const r = await publishTextFirst(item.id, item.title);
        if (r.ok){ done++; if (done%5===0||done<5) logln(`  ✓ ${item.id} (score ${r.score}, ${r.words}w) [${done}]`); }
        else { skip++; if (r.reason!=='duplicate') logln(`  ✗ ${item.id} ${r.reason}`); }
      }catch(e){ fail++; if (fail<15) logln(`  ERR ${item.id} ${String(e.message).slice(0,70)}`); }
      if (PACE_MS && !fs.existsSync(STOP)) await sleep(PACE_MS);   // economy pacing (5/10 speed)
    }
  }
  await Promise.all(Array.from({length:CONC}, worker));
  return { done, skip, fail };
}
const INTERLEAVE = process.env.CHAIN_INTERLEAVE === '1';   // owner 2026-06-29: weave all phases so style+crab+fish all advance together (cruise control), instead of finishing one pillar before the next
(async()=>{
  logln(`[chain] up — ${INTERLEAVE?'INTERLEAVED':'sequential'} ${PHASES.map(p=>p.name).join(' + ')}, conc=${CONC}`);
  while (!fs.existsSync(STOP)){
    if (INTERLEAVE){
      // TRUE lockstep: filter each phase to its UNWRITTEN items (via the index), then round-robin
      // those — one unwritten style, one unwritten crab, one unwritten fish, repeat. This way a
      // big written head-start on one pillar (style=1808) can't defer the others.
      const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
      const written = new Set((idx.entries||[]).filter(e=>e&&e.id&&(e.quality_score||0)>=10).map(e=>e.id));
      const lists = PHASES.map(ph => ph.load().filter(it => !written.has(it.id)));
      const maxLen = Math.max(0, ...lists.map(l=>l.length));
      const merged = [];
      for (let i=0;i<maxLen;i++) for (const l of lists) if (l[i]) merged.push(l[i]);
      if (!merged.length){ logln('[chain] all caught up — idle 30m'); await sleep(30*60000); continue; }
      logln(`[chain] === INTERLEAVED pass — unwritten ${lists.map((l,i)=>PHASES[i].name+':'+l.length).join(' ')} ===`);
      const { done, skip, fail } = await runPass(merged);
      logln(`[chain] interleaved pass: wrote ${done}, skipped ${skip}, failed ${fail}`);
      await sleep(done===0 && fail===0 ? 30*60000 : 8000);
      continue;
    }
    let anyWork = false;
    for (const ph of PHASES){
      if (fs.existsSync(STOP)) break;
      const q = ph.load();
      if (!q.length) { logln(`[chain] ${ph.name}: empty queue, skip`); continue; }
      logln(`[chain] === PHASE ${ph.name} (${q.length} queued) ===`);
      // loop passes until phase complete (0 new written and 0 failures)
      while (!fs.existsSync(STOP)){
        const { done, skip, fail } = await runPass(ph.load());
        logln(`[chain] ${ph.name} pass: wrote ${done}, skipped ${skip}, failed ${fail}`);
        if (done > 0) anyWork = true;
        if (done === 0 && fail === 0){ logln(`[chain] ✅ ${ph.name} COMPLETE`); break; }
        if (done === 0 && fail > 0){ logln(`[chain] ${ph.name} only failures — retry in 60s`); await sleep(60000); continue; }
        await sleep(15000);
      }
      if (!fs.existsSync(STOP)) logln(`[chain] advancing past ${ph.name}`);
    }
    if (fs.existsSync(STOP)) break;
    if (!anyWork){ logln('[chain] all phases complete — idle 60m'); await sleep(60*60000); }
    else logln('[chain] full cycle done — re-checking phases');
  }
  logln('[chain] stop flag — exiting');
})().catch(e=>{logln('[chain] FATAL '+e.message);process.exit(1);});
