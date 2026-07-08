// _seo_batch_loop.js — SEO back-end, 400-AT-A-TIME (owner 4444 2026-06-29: "run 400 URLs at a
// time, fix those, no more crawling until all 400 are done"). Replaces the whole-site audit +
// reground flood that caused a bottleneck (24k issues queued, never caught up).
//
// Each batch: take the next 400 entries (catalog order, rotating offset) → audit ONLY those 400
// for V2 issues → FIX every flagged one (DeepSeek reground = the master fix: clears thin + no-V2
// + no-FAQ + no-mermaid + no-image together; sy is owned by the style chain so it's skipped) →
// re-audit → only when all 400 are green does the offset advance to the next 400. Both /seo bars
// are scoped to the current 400 (target=400) so they show this batch's progress, nothing more.
// Economy: conc=2. Stop: _seo_batch_stop.flag. Log: _seo_batch.out.log.
const fs = require('fs');
const { spawnSync } = require('child_process');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { claudeChat } = require('./_claude_chat');   // SEO back-end Claude Code workers (Max plan)
const { dsChat } = require('./_ds_lib');             // optional extra DeepSeek workers (owner: +2 DS on SEO crew)
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const WD = 'C:/Users/koryj/website';
const STOP = WD+'/_seo_batch_stop.flag';
const OFFSET_FILE = WD+'/_seo_batch_offset.json';
const BATCH = parseInt(process.env.SEO_BATCH || '400', 10);
const CONC = parseInt(process.env.SEO_BATCH_CONC || '0', 10);   // Claude Code workers (0 = off; owner 2026-06-30: SEO fixer = 1 DeepSeek only)
const DS_CONC = parseInt(process.env.SEO_DS_CONC || '1', 10);   // DeepSeek workers (default 1)
const PACE_MS = parseInt(process.env.PACE_MS || '0', 10);       // economy pacing: sleep after each item (5/10 speed)
const STAGGER_MS = parseInt(process.env.STAGGER_MS || '0', 10); // stagger worker launches N ms apart (avoids Claude Max-plan contention from simultaneous calls)
const TOTAL_WORKERS = CONC + DS_CONC;
const ENGINE_LABEL = `${CONC}x Claude Code${DS_CONC?` + ${DS_CONC}x DeepSeek`:''}`;
const MINW = 1200;
const logln = s => { try { fs.appendFileSync(WD+'/_seo_batch.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const run = args => { try { const r = spawnSync(process.execPath, args, { cwd: WD, encoding:'utf8', timeout: 10*60*1000, windowsHide:true }); return (r.stdout||'')+(r.stderr||''); } catch(e){ return ''; } };
// per-pillar ruleset (mirror of _v2_reground_run); sy handled by the style chain writer.
const RULE = { q:'qa', gp:'qa', ra:'revenuearchitecture', tl:'cro', tc:'telcoqa', ik:'qa', tk:'qa', st:'qa', bs:'qa', er:'top10v2', ai:'top10v2', sw:'top10v2', gb:'qa', ca:'top10v2', co:'top10v2', aq:'top10v2', bt:'top10v2', mv:'top10v2', wl:'top10v2', dr:'top10v2', tv:'top10v2', es:'top10v2', bo:'qa', fr:'qa', sc:'top10v2', tn:'top10v2', nl:'top10v2', dn:'top10v2', cl:'top10v2', lv:'top10v2', ev:'top10v2', ga:'top10v2', gm:'top10v2', sk:'top10v2', hf:'top10v2', cr:'qa', fs:'qa' };
const SKIP = new Set(['sy']);
const pillarOf = id => (String(id).match(/^[a-z]+/)||[''])[0];
const proseWords = a => (String(a).replace(/```[\s\S]*?```/g,' ').match(/[A-Za-z0-9'-]+/g)||[]).length;
function flagsFor(b){
  const a = (b&&b.answer)||''; if (!a) return null;
  const w = proseWords(a); const mer = (a.match(/```mermaid/g)||[]).length;
  const reasons = [];
  if (!/```answer/.test(a)) reasons.push('no-v2');
  if (!(/##\s*FAQ\b/i.test(a)||/Frequently Asked/i.test(a))) reasons.push('no-faq');
  if (mer < 1) reasons.push('missing-mermaid');
  if (w < MINW) reasons.push('thin');
  if (!(/!\[[^\]]*\]\([^)]*\)/.test(a) || /<img[\s>]/i.test(a))) reasons.push('no-img');
  return reasons;
}
const readOffset = () => { try { return JSON.parse(fs.readFileSync(OFFSET_FILE,'utf8')).offset||0; } catch(e){ return 0; } };
const writeOffset = o => { try { fs.writeFileSync(OFFSET_FILE, JSON.stringify({offset:o, at:new Date().toISOString()})); } catch(e){} };
let CURRENT = '';   // human-readable "currently working on" line for /seo + /publish
let LASTBARS = null;
let INDEXED = 0;    // catalog entries with was_indexed_at set (IndexNow-submitted) — /seo "Indexed" tile
let CUR_AREA_KEY = null;   // counts-key of the area being worked RIGHT NOW — /seo green-trims that one tile
// "never get stuck" (owner 2026-06-29): track per-entry failures; after 2 fails skip-list the
// entry so a poison page can't block the area/batch from finishing — the fixer always moves on.
const SKIP_IDS = new Set(); const FAILS = {};
const fixTimes = [];   // rolling timestamps of successful fixes → live fixes/min + fixes/hr on /seo
const recordFix = () => { const now = Date.now(); fixTimes.push(now); while (fixTimes.length && fixTimes[0] < now-3600000) fixTimes.shift(); };
const ratePerMin = () => +(fixTimes.filter(t=>t>Date.now()-300000).length/5).toFixed(1);   // 5-min window, smoothed
const ratePerHour = () => fixTimes.filter(t=>t>Date.now()-3600000).length;
const markFail = id => { FAILS[id]=(FAILS[id]||0)+1; if (FAILS[id]>=2 && !SKIP_IDS.has(id)){ SKIP_IDS.add(id); try{ fs.appendFileSync(WD+'/_seo_batch.out.log', `[batch] ⏭ ${id} failed ${FAILS[id]}x — skip-listing, moving on\n`);}catch(e){} } };
async function setWorking(label, id){
  CURRENT = label;
  const prog = Object.assign({}, LASTBARS || {}, { running:true, mode:'batch-400', currentlyWorking: label, currentId: id||null, currentAreaKey: CUR_AREA_KEY, currentAt: new Date().toISOString() });
  try { fs.writeFileSync(WD+'/_seo_audit/progress.json', JSON.stringify(prog)); } catch(e){}
  try { await store.setJSON('seo-monitor/progress.json', prog); } catch(e){}
}
async function writeBars(processed, total, offset, counts, flaggedRemain){
  const prog = { phase:'fix', running:true, mode:'batch-400', crawled: processed, target: BATCH, siteTotal: BATCH, batchOffset: offset, catalogTotal: total, flaggedRemain, currentlyWorking: CURRENT, currentAreaKey: CUR_AREA_KEY, engine: ENGINE_LABEL, startedAt: new Date().toISOString() };
  LASTBARS = prog;
  try { if (!fs.existsSync(WD+'/_seo_audit')) fs.mkdirSync(WD+'/_seo_audit',{recursive:true}); fs.writeFileSync(WD+'/_seo_audit/progress.json', JSON.stringify(prog)); } catch(e){}
  try { await store.setJSON('seo-monitor/progress.json', prog); } catch(e){}
  let indexedToday = 0; try { const d = JSON.parse(fs.readFileSync(WD+'/_indexnow_drip_day.json','utf8')); if (d.day === new Date().toISOString().slice(0,10)) indexedToday = d.n||0; } catch(e){}
  const { enrichContent } = require('./_seo_monitor_sync_lib');
  const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null);
  const content = enrichContent(cur, {
    total: flaggedRemain,
    catalogTotal: total,
    auditedAt: new Date().toISOString(),
    mode: 'batch-400',
    batchOffset: offset,
    batchSize: BATCH,
    coveragePct: total ? Math.round(offset / total * 100) : 0,
    indexed: INDEXED,
    notIndexed: Math.max(0, total - INDEXED),
    indexedToday,
    fixesPerMin: ratePerMin(),
    fixesPerHour: ratePerHour(),
    counts,
  });
  try { await store.setJSON('seo-monitor/content.json', content); } catch (e) {}
  try { fs.writeFileSync(WD+'/_seo_audit/content.json', JSON.stringify(content,null,1)); } catch(e){}
}
async function changelog(msg){
  try { const c = await store.get('seo-monitor/content.json',{type:'json'}); if (!c || !c.counts) return;   // don't clobber the real content with a {recentlyFixed}-only stub (was wiping the metric tiles)
    const log = Array.isArray(c.recentlyFixed)?c.recentlyFixed:[]; log.unshift({at:new Date().toISOString(), msg}); c.recentlyFixed = log.slice(0,40); await store.setJSON('seo-monitor/content.json', c); } catch(e){}
}
(async()=>{
  logln(`[batch] up — 400-at-a-time SEO back-end, conc=${CONC} (no re-crawl until each 400 is green)`);
  while (!fs.existsSync(STOP)){
    const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
    const ids = (idx.entries||[]).filter(e=>e&&e.id).map(e=>({id:e.id, title:e.question})).sort((a,b)=>a.id.localeCompare(b.id));
    const total = ids.length;
    INDEXED = (idx.entries||[]).filter(e=>e&&e.was_indexed_at).length;   // for /seo Indexed tile
    let offset = readOffset(); if (offset >= total) { offset = 0; writeOffset(0); }
    const batch = ids.slice(offset, offset+BATCH);
    logln(`[batch] === BATCH @${offset}..${offset+batch.length} of ${total} ===`);
    await setWorking(`Auditing 400 pages @${offset}–${offset+batch.length} of ${total}…`);
    // 1) AUDIT only these 400 (blob reads, scoped)
    let flagged = [];
    const beforeFlags = new Map();   // id -> reasons at audit time, for live tile decrement
    { let i=0; async function aw(){ while(i<batch.length){ if(fs.existsSync(STOP))return; const it=batch[i++]; if(SKIP.has(pillarOf(it.id))) continue; const b=await store.get('answers/'+it.id+'.json',{type:'json'}).catch(()=>null); const r=flagsFor(b); if(r&&r.length){ flagged.push({id:it.id, pillar:pillarOf(it.id), title:it.title, reasons:r}); beforeFlags.set(it.id, r.slice()); } } }
      await Promise.all(Array.from({length:6}, aw)); }
    const tally = k => flagged.filter(f=>f.reasons.includes(k)).length;
    const counts = { missing_v2: tally('no-v2'), missing_faq: tally('no-faq'), missing_mermaid: tally('missing-mermaid'), thin_content: tally('thin'), no_image: tally('no-img'), mermaid_errors: 0 };
    await writeBars(BATCH - flagged.length, total, offset, counts, flagged.length);
    // expose the scoped queue (so any sidecar fixer that reads it stays scoped to 400)
    try { fs.writeFileSync(WD+'/_site_v2_queue.json', JSON.stringify(flagged,null,1)); } catch(e){}
    // 2) if this 400 is all green -> deterministic sweep, IndexNow, advance to next 400
    if (!flagged.length){
      logln(`[batch] ✅ batch @${offset} all green — advancing`);
      run(['_fix_mermaid_ltgt.js','--live']); run(['_cro_approved_images.js','--live']);   // cheap deterministic safety
      try { const io = run(['_indexnow_delta.js']); const m = io.match(/pinged=(\d+)/); if (m&&+m[1]>0) await changelog(`IndexNow: submitted ${m[1]} URLs after batch @${offset} went green`); } catch(e){}
      await changelog(`Batch @${offset}–${offset+batch.length} fully green ✅ — advancing to next 400`);
      offset += BATCH; writeOffset(offset);
      await sleep(4000); continue;
    }
    // 3) FIX — ALL RESOURCES on ONE problem area at a time, in priority order (owner 4444:
    //    "throw all resources at V2 first, then next most important; don't split resources").
    //    reground is the master fix (clears V2+thin+FAQ+mermaid+image together), so after the
    //    V2 + thin areas the later areas usually find little/nothing left. We re-audit each
    //    entry right before touching it so an area only fixes what's still broken.
    logln(`[batch] ${flagged.length}/${batch.length} flagged — area-by-area (SMALLEST-first), no advance until green`);
    const AREAS = [
      ['no-v2', 'missing V2'], ['thin', 'thin content'], ['no-img', 'missing image'],
      ['missing-faq', 'missing FAQ'], ['missing-mermaid', 'missing mermaid'],
    ];
    // Owner 2026-06-29: REVERSE the order — put all resources on the SMALLEST yellow/red count
    // first and work up (quick wins), and ALWAYS save the big "400 V2" group for LAST regardless
    // of its count. reground is still a catch-all so the V2 group shrinks as a side effect anyway.
    const areaCount = a => flagged.filter(f => f.reasons.includes(a)).length;
    const PRIORITY = AREAS.map(([a,l]) => [a, l, areaCount(a)]).filter(x => x[2] > 0)
      .sort((x,y) => (x[0]==='no-v2') - (y[0]==='no-v2') || x[2] - y[2]);   // V2 forced last, else smallest-first
    logln(`[batch] area order (smallest-first): ${PRIORITY.map(x=>x[1]+':'+x[2]).join(' · ')||'(none)'}`);
    let totalFixed = 0, totalFail = 0;
    for (const [area, label] of PRIORITY){
      if (fs.existsSync(STOP)) break;
      // group = entries STILL flagged for this area (skip any a prior area's reground already cleared)
      const group = [];
      for (const f of flagged){
        if (SKIP_IDS.has(f.id)) continue;                 // skip-listed (failed 2x) — never block on it
        const cur = await store.get('answers/'+f.id+'.json',{type:'json'}).catch(()=>null);
        const r = cur ? flagsFor(cur) : null;
        if (r && r.includes(area)) group.push({ id:f.id, pillar:f.pillar, title:f.title });
      }
      if (!group.length){ logln(`[batch] area "${label}": nothing left`); continue; }
      CUR_AREA_KEY = ({ 'no-v2':'missing_v2', 'thin':'thin_content', 'no-img':'no_image', 'missing-faq':'missing_faq', 'missing-mermaid':'missing_mermaid' })[area] || null;   // green-trim THIS tile on /seo
      logln(`[batch] ▶ ALL ${TOTAL_WORKERS} workers (${ENGINE_LABEL}) on "${label}" — ${group.length} entries`);
      await changelog(`All resources on ${label} (${group.length}) — batch @${offset}`);
      let qi=0, done=0, fail=0;
      async function worker(chat){
        while (qi < group.length){
          if (fs.existsSync(STOP)) return;
          const item = group[qi++]; const ruleset = RULE[item.pillar] || 'qa';
          try {
            const cur = await store.get('answers/'+item.id+'.json',{type:'json'}).catch(()=>null);
            if (cur && !flagsFor(cur).length) continue;             // already clean
            await setWorking(`Fixing ${label}: ${String(item.title||item.id).slice(0,90)}`, item.id);
            const { body } = await generateGradedBody(item.id, item.title, { ruleset, chat });  // Claude Code (Max) or DeepSeek per worker
            fs.writeFileSync('C:/Users/koryj/'+item.id+'_answer.md', body);
            const r = await publishTextFirst(item.id, item.title);
            if (r.ok){ done++; totalFixed++; recordFix();   // track for live fixes/min on /seo
              // live-decrement the dashboard tile for THIS area (+ co-cleared areas) so /seo
              // ticks down in real time instead of freezing at the audit-start number until
              // the next full green re-audit (the "stuck at 326" bug). reground is a catch-all
              // so a no-v2 fix usually clears thin/faq/mermaid/img on the same entry too.
              const before = beforeFlags.get(item.id) || [];
              const CK = { 'no-v2':'missing_v2', 'thin':'thin_content', 'no-img':'no_image', 'missing-faq':'missing_faq', 'missing-mermaid':'missing_mermaid' };
              for (const fl of before){ const k = CK[fl]; if (k && counts[k] > 0) counts[k]--; }
              beforeFlags.set(item.id, []);
              if (done%10===0||done<5) logln(`[batch] [${label}] ${done} ✓ ${item.id} (${ruleset}, score ${r.score}, ${r.words}w)`); }
            else if (r.reason!=='duplicate'){ fail++; totalFail++; markFail(item.id); logln(`[batch] ✗ ${item.id} ${r.reason}`); }
            const remain = Math.max(0, flagged.length - totalFixed);
            await writeBars(BATCH - remain, total, offset, counts, remain);
          } catch(e){ fail++; totalFail++; markFail(item.id); if (totalFail<20) logln(`[batch] ERR ${item.id} ${String(e.message).slice(0,80)}`); }
          if (PACE_MS && !fs.existsSync(STOP)) await sleep(PACE_MS);   // economy pacing (5/10 speed)
        }
      }
      const engines = [ ...Array(CONC).fill(claudeChat), ...Array(DS_CONC).fill(dsChat) ];  // shared qi → no double-work
      // stagger worker launches (owner 2026-06-29): worker i waits i×STAGGER_MS before starting,
      // so 2 Claude workers don't hit the Max plan simultaneously (which hangs the CLI).
      if (STAGGER_MS) logln(`[batch] staggering ${engines.length} workers ${STAGGER_MS/1000}s apart`);
      await Promise.all(engines.map((e,i) => (async () => {
        if (STAGGER_MS && i > 0 && !fs.existsSync(STOP)) await sleep(i * STAGGER_MS);
        await worker(e);
      })()));
      logln(`[batch] ✅ area "${label}" done: fixed ${done}, fail ${fail} — moving all resources to next area`);
    }
    logln(`[batch] batch @${offset} sweep: fixed ${totalFixed}, fail ${totalFail} (re-audits next loop; advances when green)`);
    if (totalFixed>0) await changelog(`Fixed ${totalFixed} page${totalFixed>1?'s':''} in batch @${offset} (smallest-first, area-by-area)`);
    // NEVER STUCK (owner 2026-06-29): if a full sweep fixed NOTHING yet entries remain, the rest
    // are stuck (skip-listed / unfixable / engine hiccup) — advance to the next 400 rather than
    // re-grinding the same window forever. The catalog wraps, so skipped entries get retried later.
    if (totalFixed===0 && flagged.length>0){
      logln(`[batch] ⏭ batch @${offset} fixed 0 — remaining ${flagged.length} stuck; MOVING ON to next 400`);
      await changelog(`Batch @${offset} stuck (0 fixed) — moving on to next 400`);
      writeOffset(offset + BATCH);
      SKIP_IDS.clear(); for (const k in FAILS) delete FAILS[k];   // reset per-window fail tracking
    }
    try { run(['_spider_verify.js','8']); } catch(e){}
    await sleep(totalFixed? 8000 : 60000);   // back off if nothing fixed (spend cap / all fail)
  }
  logln('[batch] stop flag — exiting');
})().catch(e=>{ logln('[batch] FATAL '+e.message); process.exit(1); });
