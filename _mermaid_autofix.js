// _mermaid_autofix.js — PREEMPTIVE mermaid auto-fixer (owner 4444 2026-06-29): anytime the SEO
// spider would flag an answer page "missing mermaid", this generates ONE valid, title-relevant
// mermaid diagram (DeepSeek), sanitizes it (no <>/() label breaks), inserts it inside the first
// section, and saves the blob so the live page + next crawl show the diagram. V2 standard = 1
// mermaid. Economy: conc 1, batch-capped, skips pages that already have a mermaid (free).
// Run: node _mermaid_autofix.js [batchCap]  Stop: _mermaid_autofix_stop.flag  Log: _mermaid_autofix.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { sanitizeMermaid } = require('./_mermaid_sanitize');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const STOP = 'C:/Users/koryj/website/_mermaid_autofix_stop.flag';
const BATCH = parseInt(process.argv[2]||process.env.MERM_BATCH||'60',10);
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_mermaid_autofix.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const mermCount = body => (String(body||'').match(/```mermaid/g)||[]).length;
const FENCE = '```';
const SYSTEM = `You create ONE simple, valid Mermaid diagram that visualizes the topic of a given page title. Rules: output ONLY the Mermaid code (no code fences, no prose). Use "flowchart TD". 5 to 8 nodes. Node labels must be PLAIN text: letters, numbers, spaces only — NO parentheses, brackets, quotes, slashes, colons, ampersands, or angle brackets inside labels (they break Mermaid). Use simple node ids A,B,C,... and arrows like A[Label] --> B[Label]. Make it genuinely relevant to the title.`;
async function makeMermaid(title){
  const { content } = await dsChat([
    { role:'system', content: SYSTEM },
    { role:'user', content: `Page title: "${title}"\n\nReturn the Mermaid diagram code now (flowchart TD, 5-8 nodes, plain labels).` },
  ], { temperature:0.4, max_tokens:600 });
  let code = String(content||'').replace(/```[a-z]*/gi,'').replace(/```/g,'').trim();
  if (!/^\s*(flowchart|graph)\s/i.test(code)) code = 'flowchart TD\n' + code;
  return code;
}
function validMermaid(code){
  return /^\s*(flowchart|graph)\s/i.test(code) && (code.match(/-->/g)||[]).length >= 2;
}
function insertMermaid(body, block){
  const lines = String(body).split(/\r?\n/);
  const h2s = []; lines.forEach((l,i)=>{ if(/^##\s/.test(l)) h2s.push(i); });
  let at;
  if (h2s.length >= 2) at = h2s[1];                 // before the 2nd H2 (inside first section)
  else if (h2s.length === 1) at = lines.length;     // only one H2 -> end
  else { // no H2: after first non-heading/non-image paragraph
    at = lines.findIndex(l=>l.trim() && !/^#/.test(l) && !/^!\[/.test(l));
    at = at < 0 ? lines.length : at + 1;
  }
  // never drop it below a Sources/Bottom Line section if those come first
  const srcAt = lines.findIndex(l=>/^#{2,3}\s*(Sources|Bottom Line)\b/i.test(l));
  if (srcAt >= 0 && at > srcAt) at = srcAt;
  const before = lines.slice(0,at).join('\n').replace(/\s+$/,'');
  const after = lines.slice(at).join('\n');
  return before + '\n\n' + block + '\n\n' + after;
}
const FROM_AUDIT = process.argv.includes('--from-audit') || process.env.MERM_FROM_AUDIT==='1';
function auditTargets(){ // only URLs the audit flagged 'missing-mermaid'
  try { return JSON.parse(fs.readFileSync('C:/Users/koryj/website/_site_v2_queue.json','utf8'))
    .filter(x=>Array.isArray(x.reasons)&&x.reasons.includes('missing-mermaid'))
    .map(x=>({id:x.id,question:x.title})); } catch(e){ return null; }
}
(async()=>{
  logln(`[merm] up — preemptive mermaid auto-fix, batch cap ${BATCH}${FROM_AUDIT?' (audit-targeted)':''}`);
  let entries;
  if (FROM_AUDIT){ entries = auditTargets() || []; logln(`[merm] ${entries.length} audit-flagged 'missing-mermaid' URLs`); }
  else { const idx = await store.get('_index.json',{type:'json',consistency:'strong'}); entries = (idx.entries||[]); logln(`[merm] scanning ${entries.length} entries for missing mermaid…`); }
  let fixed=0, scanned=0, already=0, fail=0;
  for (const ie of entries){
    if (fs.existsSync(STOP)){ logln('[merm] stop flag'); break; }
    if (fixed >= BATCH){ logln(`[merm] batch cap ${BATCH} reached — stopping (re-run for more)`); break; }
    scanned++;
    let e; try { e = await store.get('answers/'+ie.id+'.json',{type:'json'}); } catch(_){ continue; }
    if (!e || !e.answer) continue;
    if (mermCount(e.answer) >= 1){ already++; continue; }
    try {
      let code = await makeMermaid(ie.question||e.question||ie.id);
      if (!validMermaid(code)){ code = await makeMermaid((ie.question||ie.id)+' (simple flowchart TD, plain labels, at least 3 arrows)'); }
      if (!validMermaid(code)){ fail++; logln(`[merm] ✗ ${ie.id} invalid diagram`); continue; }
      const block = FENCE + 'mermaid\n' + code + '\n' + FENCE;
      let newBody = insertMermaid(e.answer, block);
      newBody = sanitizeMermaid(newBody);                // strip any <>/() that would break render
      if (mermCount(newBody) < 1){ fail++; logln(`[merm] ✗ ${ie.id} insert failed`); continue; }
      const before = gradeEntry(ie.id, e.answer).score;
      const after = gradeEntry(ie.id, newBody).score;
      e.answer = newBody;
      if (typeof after === 'number') e.quality_score = Math.max(e.quality_score||0, after);
      e.mermaid_autofixed_at = '2026-06-29';
      await store.setJSON('answers/'+ie.id+'.json', e);
      fixed++;
      logln(`[merm] ✓ ${ie.id} +mermaid (score ${before}->${after}) [${fixed}]`);
      await sleep(1500);
    } catch(err){ fail++; if (fail<15) logln(`[merm] ERR ${ie.id} ${String(err.message).slice(0,80)}`); await sleep(3000); }
  }
  logln(`[merm] DONE — scanned ${scanned}, already had mermaid ${already}, fixed ${fixed}, failed ${fail}`);
})().catch(e=>{logln('[merm] FATAL '+e.message);process.exit(1);});
