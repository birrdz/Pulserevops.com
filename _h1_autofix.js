// _h1_autofix.js — PREEMPTIVE duplicate-H1 auto-fixer (owner 4444 2026-06-29; discretion: align
// to our laws/templates). The SEO spider flags "duplicate H1" when two URLs render the same H1
// text (the question) — usually the same question existing across pillars. This finds those
// groups, KEEPS the earliest entry's H1 unchanged, and gives each other duplicate a unique,
// applicable H1 variant (DeepSeek rephrase: same meaning, same trailing year, same topic) stored
// as entry.h1 — which the renderer now uses for <h1>. The question itself is left intact, so
// cross-pillar coverage + the no-duplicates rule are unaffected; only the visible H1 differs.
// (Multiple-H1 per page is already handled by the renderer dropping stray body "# " headings.)
// Run: node _h1_autofix.js [batchCap]  Stop: _h1_autofix_stop.flag  Log: _h1_autofix.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const STOP = 'C:/Users/koryj/website/_h1_autofix_stop.flag';
const BATCH = parseInt(process.argv[2]||process.env.H1_BATCH||'60',10);
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_h1_autofix.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const norm = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const yearOf = s => (String(s||'').match(/\b(20\d\d)\b/)||[])[1] || '';
async function uniqueH1(question, pillar){
  const yr = yearOf(question);
  const { content } = await dsChat([
    { role:'system', content: 'You rewrite a page H1 heading into a UNIQUE, natural variant with the EXACT SAME meaning and topic. Keep it concise, keep any trailing year, keep it a proper question if the original is a question. Do NOT add facts. Output ONLY the new heading text — no quotes, no preamble.' },
    { role:'user', content: `Original H1: "${question}"\nContext (pillar): ${pillar||'general'}\nRewrite it as a distinct but equivalent heading${yr?(' that still ends with '+yr):''}.` },
  ], { temperature:0.7, max_tokens:80 });
  let h = String(content||'').replace(/^["'\s]+|["'\s]+$/g,'').replace(/\s+/g,' ').trim();
  if (yr && !new RegExp('\\b'+yr+'\\b').test(h)) h = h.replace(/[?\s]*$/,'') + ' in ' + yr + (question.trim().endsWith('?')?'?':'');
  return h;
}
(async()=>{
  logln(`[h1] up — preemptive duplicate-H1 auto-fix, batch cap ${BATCH}`);
  const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
  const entries = (idx.entries||[]).filter(e=>e&&e.id&&e.question);
  const groups = new Map();
  for (const e of entries){ const k=norm(e.question); if(!k) continue; (groups.get(k)||groups.set(k,[]).get(k)).push(e); }
  // duplicate H1 = same normalized question on 2+ URLs. Keep first, fix the rest.
  const dupExtras = [];
  for (const [,arr] of groups){ if (arr.length>1){ for (let i=1;i<arr.length;i++) dupExtras.push(arr[i]); } }
  logln(`[h1] ${entries.length} entries, ${[...groups.values()].filter(a=>a.length>1).length} duplicate-H1 groups, ${dupExtras.length} pages to make unique`);
  let fixed=0, already=0, fail=0;
  for (const ie of dupExtras){
    if (fs.existsSync(STOP)){ logln('[h1] stop flag'); break; }
    if (fixed >= BATCH){ logln(`[h1] batch cap ${BATCH} reached — re-run for more`); break; }
    let e; try { e = await store.get('answers/'+ie.id+'.json',{type:'json'}); } catch(_){ continue; }
    if (!e) continue;
    if (e.h1 && norm(e.h1)!==norm(e.question)){ already++; continue; }   // already given a unique H1
    try {
      const pillar = (ie.id.match(/^[a-z]+/)||[''])[0];
      let h1 = await uniqueH1(ie.question, pillar);
      if (!h1 || norm(h1)===norm(ie.question)) h1 = await uniqueH1(ie.question+' (make the wording clearly different)', pillar);
      if (!h1 || norm(h1)===norm(ie.question)){ fail++; logln(`[h1] ✗ ${ie.id} could not differentiate`); continue; }
      e.h1 = h1;
      e.h1_autofixed_at = '2026-06-29';
      await store.setJSON('answers/'+ie.id+'.json', e);
      fixed++;
      logln(`[h1] ✓ ${ie.id} H1 -> "${h1.slice(0,70)}" [${fixed}]`);
      await sleep(1200);
    } catch(err){ fail++; if (fail<15) logln(`[h1] ERR ${ie.id} ${String(err.message).slice(0,80)}`); await sleep(2500); }
  }
  logln(`[h1] DONE — to-fix ${dupExtras.length}, fixed ${fixed}, already-unique ${already}, failed ${fail}`);
})().catch(e=>{logln('[h1] FATAL '+e.message);process.exit(1);});
