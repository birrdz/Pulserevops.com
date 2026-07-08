// _v2_reground_run.js — SPIDER BACKEND FIXER (owner 2026-06-29: dedicated DeepSeek for the
// SEO spider). Reads _site_v2_queue.json (sub-V2 entries from _site_v2_audit), regenerates
// each to full V2 with the RIGHT per-pillar ruleset, and republishes — one regen fixes
// thin + no-V2 + no-FAQ + no-mermaid + no-image together. Drives those /seo counts to 0.
// Stop: _v2_reground_stop.flag. Log: _v2_reground.out.log. Conc: V2RG_CONC (default 3).
const fs = require('fs');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const CONC = parseInt(process.env.V2RG_CONC || '2', 10);  // economy: slow + steady
const CAP = parseFloat(process.env.V2RG_CAP || '8');       // economy: daily $ cap, pause when hit
const STOP = 'C:/Users/koryj/website/_v2_reground_stop.flag';
const capped = () => { try { const sp = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_ds_spend.json','utf8')); return (sp.spent||0) >= CAP; } catch(e){ return false; } };
function isV2(b){ if(!b||!b.answer) return false; const a=b.answer; const w=(a.replace(/```[\s\S]*?```/g,' ').match(/[A-Za-z0-9'-]+/g)||[]).length; const mer=(a.match(/```mermaid/g)||[]).length; return /```answer/.test(a) && (/##\s*FAQ/i.test(a)||/Frequently Asked/i.test(a)) && mer>=1 && w>=1200; }
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_v2_reground.out.log', s+'\n'); } catch(e){} console.log(s); };
// pillar -> ruleset (only the rulesets that exist in _ds_gen_any). sy is handled by the
// writing-side style writer, so the reground skips it. Top-10 pillars use top10v2.
const RULE = { q:'qa', gp:'qa', ra:'revenuearchitecture', tl:'cro', tc:'telcoqa',
  ik:'qa', tk:'qa', st:'qa', bs:'qa', er:'top10v2', ai:'top10v2', sw:'top10v2', gb:'qa',
  ca:'top10v2', co:'top10v2', aq:'top10v2', bt:'top10v2', mv:'top10v2', wl:'top10v2', dr:'top10v2',
  tv:'top10v2', es:'top10v2', bo:'qa', fr:'qa', sc:'top10v2', tn:'top10v2', nl:'top10v2', dn:'top10v2',
  cl:'top10v2', lv:'top10v2', ev:'top10v2', ga:'top10v2', gm:'top10v2', sk:'top10v2', hf:'top10v2', pt:'top10v2' };
const SKIP = new Set(['sy']); // style writer owns sy
const sleep = ms => new Promise(r => setTimeout(r, ms));
const IDLE = (parseInt(process.env.V2RG_IDLE_MIN || '15', 10)) * 60 * 1000;
(async()=>{
  logln(`[v2rg] up — economy reground, conc=${CONC} (idles when nothing to fix)`);
  while (!fs.existsSync(STOP)) {
    let q = [];
    try { q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_site_v2_queue.json','utf8')); } catch(e){}
    q = q.filter(x => x && x.id && !SKIP.has(x.pillar));
    if (!q.length) { logln('[v2rg] nothing to fix — idle ' + (IDLE/60000) + 'm (no spend)'); await sleep(IDLE); continue; }
    logln(`[v2rg] pass start: ${q.length} sub-V2 entries, conc=${CONC}`);
    let qi = 0, done = 0, skip = 0, fail = 0;
    async function worker(){
      while (qi < q.length) {
        if (fs.existsSync(STOP)) return;
        const item = q[qi++]; const ruleset = RULE[item.pillar] || 'qa';
        try {
          // economy: skip entries already at V2 so we never pay to redo a fixed one
          const cur = await store.get('answers/' + item.id + '.json', { type: 'json' }).catch(() => null);
          if (isV2(cur)) { skip++; continue; }
          const { body } = await generateGradedBody(item.id, item.title, { ruleset });
          fs.writeFileSync('C:/Users/koryj/' + item.id + '_answer.md', body);
          const r = await publishTextFirst(item.id, item.title);
          if (r.ok) { done++; if (done % 10 === 0 || done < 5) logln(`[v2rg] ${done} ✓ ${item.id} (${ruleset}, score ${r.score}, ${r.words}w)`);
            // live progress: tick the dashboard counts down per fix so numbers visibly drop
            // (>=1/min); the 15-min audit reconciles any drift.
            try { const c = await store.get('seo-monitor/content.json',{type:'json',consistency:'strong'}); if (c && c.counts){ const M={thin:'thin_content','no-v2':'missing_v2','no-faq':'missing_faq','missing-mermaid':'missing_mermaid','no-img':'no_image'}; for (const rs of (item.reasons||[])){ const k=M[rs]; if (k && c.counts[k]>0) c.counts[k]--; } c.total=Math.max(0,(c.total||0)-1); await store.setJSON('seo-monitor/content.json', c); } } catch(e){}
          }
          else { skip++; if (r.reason !== 'duplicate') logln(`[v2rg] ✗ ${item.id} ${r.reason} score ${r.score||''}`); }
        } catch(e){ fail++; if (fail < 20) logln(`[v2rg] ERR ${item.id} ${String(e.message).slice(0,80)}`); }
      }
    }
    await Promise.all(Array.from({length:CONC}, worker));
    logln(`[v2rg] pass done: regrounded ${done}, skipped ${skip}, failed ${fail}`);
    if (done === 0) { logln('[v2rg] no new fixes this pass — idle ' + (IDLE/60000) + 'm'); await sleep(IDLE); }
    else await sleep(30000);
  }
  logln('[v2rg] stop flag — exiting');
})().catch(e => { logln('[v2rg] FATAL '+e.message); process.exit(1); });
