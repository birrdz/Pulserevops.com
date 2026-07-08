// _cf_run.js — CRAB (cr) + FISHING (fs) Q&A writer. Reads _cf_queue.json, generates V2
// Q&As (ruleset 'qa'), publishes via publishTextFirst (adds each to _index.json → the
// library/entry counter grows). Economy conc=2. Skips already-published. Idles when done.
// Stop: _cf_stop.flag. Log: _cf_run.out.log.
const fs = require('fs');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const CONC = parseInt(process.env.CF_CONC || '2', 10);
const STOP = 'C:/Users/koryj/website/_cf_stop.flag';
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_cf_run.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  logln(`[cf] up — crab+fishing writer, conc=${CONC}`);
  while (!fs.existsSync(STOP)) {
    let q=[]; try { q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cf_queue.json','utf8')); } catch(e){}
    if (!q.length) { logln('[cf] no queue — idle 30m'); await sleep(30*60000); continue; }
    let qi=0, done=0, skip=0, fail=0;
    async function worker(){
      while (qi < q.length) {
        if (fs.existsSync(STOP)) return;
        const item = q[qi++];
        try {
          const existing = await store.get('answers/'+item.id+'.json',{type:'json'}).catch(()=>null);
          if (existing && existing.quality_score >= 10) { skip++; continue; }
          const { body } = await generateGradedBody(item.id, item.title, { ruleset:'qa' });
          fs.writeFileSync('C:/Users/koryj/'+item.id+'_answer.md', body);
          const r = await publishTextFirst(item.id, item.title);
          if (r.ok) { done++; if (done%5===0||done<5) logln(`[cf] ${done} ✓ ${item.id} (score ${r.score}, ${r.words}w)`); }
          else { skip++; if (r.reason!=='duplicate') logln(`[cf] ✗ ${item.id} ${r.reason}`); }
        } catch(e){ fail++; if (fail<15) logln(`[cf] ERR ${item.id} ${String(e.message).slice(0,70)}`); }
      }
    }
    await Promise.all(Array.from({length:CONC}, worker));
    logln(`[cf] pass done: wrote ${done}, skipped ${skip}, failed ${fail}`);
    if (done===0) { logln('[cf] all written — idle 60m'); await sleep(60*60000); } else await sleep(20000);
  }
  logln('[cf] stop flag — exiting');
})().catch(e=>{logln('[cf] FATAL '+e.message);process.exit(1);});
