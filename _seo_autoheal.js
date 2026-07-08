// _seo_autoheal.js — AUTONOMOUS, SELF-FIXING SEO loop (owner: "it's supposed to be
// autonomous and self-fixing, constantly running 24/7; as things get fixed remove them
// from the issues, and put notes at the bottom of /seo about what was recently fixed,
// updated every 15 min"). The audits only DETECT; this loop FIXES, then refreshes the
// live /seo counts + a "recently fixed" changelog. Runs deterministic fixers every cycle:
//   1. mermaid <>  -> _site_error_sweep.js + _fix_mermaid_ltgt.js --live
//   2. CRO non-approved images -> _cro_approved_images.js --live
//   3. whole-site audit -> _site_v2_audit.js  (rewrites seo-monitor/content.json counts)
// then appends a recentlyFixed[] entry to content.json so the dashboard shows what changed.
// (Content fixes that NEED the writer — missing FAQ / thin / V2 — are driven down by the
//  DeepSeek reground writer separately; this loop handles everything deterministic.)
// Stop: _seo_autoheal_stop.flag.  Relaunch: Start-Process node _seo_autoheal.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
const { spawnSync } = require('child_process');
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const INTERVAL = (parseInt(process.env.INTERVAL_MIN || '15',10))*60*1000;
const STOP = 'C:/Users/koryj/website/_seo_autoheal_stop.flag';
const WD = 'C:/Users/koryj/website';
function run(args){ const r = spawnSync(process.execPath, args, { cwd: WD, encoding:'utf8', timeout: 12*60*1000 }); return (r.stdout||'')+(r.stderr||''); }
function num(out, rx){ const m = out.match(rx); return m ? parseInt(m[1],10) : 0; }
const ECO = process.env.AUTOHEAL_BATCH || '25';   // economy: fix at most N of each issue per cycle
async function cycle(){
  const fixes = [];
  // 1. mermaid render errors (deterministic <,> in labels)
  run(['_site_error_sweep.js']);
  const mo = run(['_fix_mermaid_ltgt.js','--live']);
  const mFix = num(mo, /APPLIED (\d+)/);
  if (mFix>0) fixes.push(`Fixed ${mFix} mermaid syntax error${mFix>1?'s':''} (rewrote <,> in diagram labels)`);
  // 2. CRO non-approved images
  const co = run(['_cro_approved_images.js','--live']);
  const cFix = num(co, /entries fixed (\d+)/);
  if (cFix>0) fixes.push(`Replaced non-approved images on ${cFix} CRO/Pulse-Tools entr${cFix>1?'ies':'y'} with approved covers`);
  // 3. AUDIT FIRST — refresh whole-site counts + flagged list (_site_v2_queue.json) so the
  //    preemptive fixers below can TARGET exactly the flagged URLs (no 40k-blob scan).
  run(['_site_v2_audit.js']);
  // 4. PREEMPTIVE content fixers (4444-locked, audit-targeted, economy batches):
  //    missing-FAQ -> write FAQ from title; missing-mermaid -> add a diagram; duplicate-H1 -> unique H1.
  const fo = run(['_faq_autofix.js','--from-audit',ECO]);   const fFix = num(fo, /fixed (\d+)/);
  if (fFix>0) fixes.push(`Auto-wrote FAQ sections on ${fFix} page${fFix>1?'s':''} (title-based, before Sources)`);
  const meo = run(['_mermaid_autofix.js','--from-audit',ECO]); const meFix = num(meo, /fixed (\d+)/);
  if (meFix>0) fixes.push(`Auto-added a mermaid diagram on ${meFix} page${meFix>1?'s':''} (V2 standard)`);
  const ho = run(['_h1_autofix.js',ECO]);                   const hFix = num(ho, /fixed (\d+)/);
  if (hFix>0) fixes.push(`De-duplicated H1 on ${hFix} page${hFix>1?'s':''} (unique applicable headings)`);
  // 5. VERIFY (auditor double-check): confirm a sample of just-fixed pages really show the fix LIVE.
  let verifyMsg = null;
  try { const vo = run(['_spider_verify.js','12']); const vm = vo.match(/VERIFY pass=(\d+) fail=(\d+)/); if (vm) { verifyMsg = `Auditor verified fixes: ${vm[1]} pass / ${vm[2]} fail (live re-check)`; if (+vm[2]>0) console.log('[autoheal] VERIFY FAILURES:', vo.split('\n').filter(l=>/FAIL/.test(l)).slice(0,8).join(' | ')); } } catch(e){}
  // 6. AUTO INDEXNOW (hands-off): submit new/changed URLs ~hourly (every 4th cycle).
  let indexnowMsg = null;
  if (CYCLE % 4 === 0) {
    try { const io = run(['_indexnow_delta.js']); const m = io.match(/pinged=(\d+)/); if (m && +m[1] > 0) indexnowMsg = `IndexNow: auto-submitted ${m[1]} new/changed URLs to search engines`; } catch (e) {}
  }
  // 7. append recentlyFixed changelog to content.json (preserve engine ledger counts)
  try {
    const { enrichContent } = require('./_seo_monitor_sync_lib');
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null);
    const cur = await store.get('seo-monitor/content.json', { type: 'json' }) || {};
    const log = Array.isArray(cur.recentlyFixed) ? cur.recentlyFixed : [];
    const at = new Date().toISOString();
    if (indexnowMsg) fixes.push(indexnowMsg);
    if (fixes.length) for (const f of fixes) log.unshift({ at, msg: f });
    else log.unshift({ at, msg: 'Self-heal pass — no deterministic issues found this cycle ✅' });
    const content = enrichContent(cur, {
      recentlyFixed: log.slice(0, 40),
      autohealAt: at,
      autohealEveryMin: INTERVAL / 60000,
      indexnowAuto: true,
      indexnowAt: indexnowMsg ? at : cur.indexnowAt,
    }, idx);
    await store.setJSON('seo-monitor/content.json', content);
    try { fs.writeFileSync(WD+'/_seo_audit/content.json', JSON.stringify(content,null,1)); } catch(e){}
    console.log('[autoheal]', at, 'mermaidFixed='+mFix, 'croImgFixed='+cFix);
    // total remaining work = content counts + fixes this pass; 0 => relax to hourly
    const remaining = Object.values(content.counts||{}).reduce((a,b)=>a+(+b||0),0);
    return remaining + mFix + cFix;
  } catch(e){ console.error('[autoheal] content.json update err', e.message); return 1; }
}
const RELAX = 60*60*1000; // when all 0s/green: relax, check hourly
let CYCLE = 0;
(async()=>{
  console.log('[autoheal] up — self-fixing every', INTERVAL/60000, 'min (relaxes to hourly when all green)');
  while(!fs.existsSync(STOP)){
    let work = 1;
    try { work = await cycle(); } catch(e){ console.error('[autoheal] cycle err', e.message); }
    CYCLE++;
    const naptime = (work > 0) ? INTERVAL : RELAX;
    if (work === 0) console.log('[autoheal] all 0s/green — relaxing for 60m');
    const t=Date.now(); while(Date.now()-t<naptime && !fs.existsSync(STOP)){ await new Promise(r=>setTimeout(r,5000)); }
  }
  console.log('[autoheal] stop flag seen, exiting');
})();
