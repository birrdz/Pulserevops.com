// _indexnow_drip.js — STEADY IndexNow drip (owner 2026-06-29: "every 400-URL crawl, do a
// 400-URL index"). Each cycle: take the next 400 NEWEST un-indexed entries, ping them to
// IndexNow (Bing/Yandex/Seznam — clobber-safe, no per-entry RMW), then stamp was_indexed_at on
// all 400 in ONE batched _index.json write (NOT the 15k-RMW that froze the index before). The
// /seo + /publish "Indexed" tile climbs 400/cycle. Soft daily cap keeps us in IndexNow's comfort
// zone. Idles when everything is already indexed (then catches new content as it's published).
//   knobs: DRIP_BATCH (400), DRIP_INTERVAL_S (900=15m, matches the crawl), DRIP_DAILY_CAP (10000)
//   stop: _indexnow_drip_stop.flag · log: _indexnow_drip.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD+'/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD+'/_indexnow_drip_stop.flag';
const DAYFILE = WD+'/_indexnow_drip_day.json';
const BATCH = parseInt(process.env.DRIP_BATCH || '400', 10);
const INTERVAL = parseInt(process.env.DRIP_INTERVAL_S || '900', 10) * 1000;
const DAILY_CAP = parseInt(process.env.DRIP_DAILY_CAP || '10000', 10);
const logln = s => { const line = new Date().toISOString()+' '+s; try { fs.appendFileSync(WD+'/_indexnow_drip.out.log', line+'\n'); } catch(e){} console.log(line); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const today = () => new Date().toISOString().slice(0,10);
function dayCount(){ try { const d=JSON.parse(fs.readFileSync(DAYFILE,'utf8')); return d.day===today() ? (d.n||0) : 0; } catch(e){ return 0; } }
function addDay(n){ const cur=dayCount(); try { fs.writeFileSync(DAYFILE, JSON.stringify({day:today(), n:cur+n})); } catch(e){} }
(async()=>{
  logln(`[drip] up — ${BATCH}/cycle every ${INTERVAL/1000}s, daily cap ${DAILY_CAP} (clobber-safe single-write stamp)`);
  while (!fs.existsSync(STOP)){
    const used = dayCount();
    if (used >= DAILY_CAP){ logln(`[drip] daily cap ${DAILY_CAP} hit (${used}) — idling 1h`); await sleep(3600000); continue; }
    const idx = await store.get('_index.json',{type:'json',consistency:'strong'});
    const entries = idx.entries || [];
    // newest un-indexed first (fresh content gets discovered fastest)
    const todo = entries.filter(e=>e&&e.id&&!e.was_indexed_at).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0, Math.min(BATCH, DAILY_CAP-used));
    if (!todo.length){ logln('[drip] nothing un-indexed — all submitted; idling 30m (will catch new content)'); await sleep(1800000); continue; }
    const urls = todo.map(e=>'https://pulserevops.com/knowledge/'+e.id);
    // 1) PING (clobber-safe — notifies search engines, no index write)
    let pinged=0, okB=0, failB=0;
    for (let i=0;i<urls.length;i+=200){ if(fs.existsSync(STOP))break; const chunk=urls.slice(i,i+200); let r; try{ r=await pingIndexNowUrlList(chunk); }catch(e){ r={ok:false}; } if(r&&r.ok){okB++;pinged+=chunk.length;}else failB++; await sleep(800); }
    // 2) STAMP all done ids in ONE _index.json write (re-read fresh to minimize clobber of live writers)
    const ts = new Date().toISOString(); const ids = new Set(todo.map(e=>e.id));
    try {
      const fresh = await store.get('_index.json',{type:'json',consistency:'strong'});
      let n=0; for (const e of (fresh.entries||[])){ if (e && ids.has(e.id) && !e.was_indexed_at){ e.was_indexed_at = ts; n++; } }
      await store.setJSON('_index.json', fresh);
      // push live indexed/notIndexed to the /seo tile so it ticks DOWN as we index (re-read just before to stay clobber-safe)
      try { const totalE=(fresh.entries||[]).length; const idxN=(fresh.entries||[]).filter(x=>x&&x.was_indexed_at).length; const cc=await store.get('seo-monitor/content.json',{type:'json'})||{}; cc.indexed=idxN; cc.notIndexed=Math.max(0,totalE-idxN); await store.setJSON('seo-monitor/content.json', cc); } catch(_){}
      addDay(pinged);
      logln(`[drip] cycle: pinged ${pinged} (ok ${okB}/fail ${failB} batches) · stamped ${n} · day total ${dayCount()}/${DAILY_CAP}`);
    } catch(e){ logln('[drip] stamp ERR '+e.message); }
    await sleep(INTERVAL);
  }
  logln('[drip] stop flag — exiting');
})().catch(e=>{ logln('[drip] FATAL '+(e&&e.message)); process.exit(1); });
