// _faq_autofix.js — PREEMPTIVE FAQ auto-fixer (owner 4444 2026-06-29): anytime the SEO spider
// would flag an answer page "missing FAQ", this writes a real FAQ section based on that URL's
// TITLE (DeepSeek, grounded in the existing answer, anti-fabrication) and appends it before
// ## Sources (else ## Bottom Line, else end), then saves the blob so the live page + next crawl
// show the FAQ. Economy: conc 1, batch-capped, skips pages that already have an FAQ (free).
// Run: node _faq_autofix.js [batchCap]   Stop: _faq_autofix_stop.flag   Log: _faq_autofix.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { dsChat } = require('./_ds_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const STOP = 'C:/Users/koryj/website/_faq_autofix_stop.flag';
const BATCH = parseInt(process.argv[2]||process.env.FAQ_BATCH||'60',10);
const logln = s => { try { fs.appendFileSync('C:/Users/koryj/website/_faq_autofix.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
// Same FAQ detection the spider/audit use (## FAQ / ### FAQ / "## 6. FAQ" / Frequently Asked).
const hasFAQ = body => /(^|\n)#{1,4}\s*((\d+|[IVXLC]+)[.)]\s*)?(FAQ|Frequently Asked)/i.test(String(body||''));
const SYSTEM = `You write concise, accurate FAQ sections for PULSE, an authority site. Output ONLY a Markdown "## FAQ" section: exactly 6 entries. Each entry is a line "**A real question ending in a question mark?**" on its own, then a 2-4 sentence answer below it. Ask the actual things a reader searching this title would want answered. NEVER fabricate precise statistics, prices, dates, product/model names, people, or source URLs — use honest ranges and general guidance, and only name things you are certain genuinely exist. No preamble, no closing remarks, no code fences — just the "## FAQ" heading and the 6 pairs.`;
async function makeFaq(title, answer){
  const snippet = String(answer||'').replace(/\s+/g,' ').slice(0,1600);
  const msgs = [
    { role:'system', content: SYSTEM },
    { role:'user', content: `Page title: "${title}"\n\nExisting answer (for grounding — match its facts, do not contradict it):\n${snippet}\n\nWrite the "## FAQ" section now (6 bold-question pairs).` },
  ];
  let { content } = await dsChat(msgs, { temperature:0.5, max_tokens:1500 });
  let faq = String(content||'').replace(/^```[a-z]*\s*|\s*```$/g,'').trim();
  if (!/^#{2,3}\s*FAQ/im.test(faq)) faq = '## FAQ\n\n' + faq;
  return faq;
}
function insertFaq(body, faq){
  const lines = String(body).replace(/\s+$/,'').split(/\r?\n/);
  let at = lines.findIndex(l=>/^#{2,3}\s*Sources\b/i.test(l));
  if (at<0) at = lines.findIndex(l=>/^#{2,3}\s*Bottom Line\b/i.test(l));
  if (at<0) return lines.join('\n').replace(/\s+$/,'') + '\n\n' + faq + '\n';
  const head = lines.slice(0,at).join('\n').replace(/\s+$/,''); const tail = lines.slice(at).join('\n');
  return head + '\n\n' + faq + '\n\n' + tail;
}
const FROM_AUDIT = process.argv.includes('--from-audit') || process.env.FAQ_FROM_AUDIT==='1';
function auditTargets(){ // only URLs the audit flagged 'no-faq' — targeted + economical
  try { return JSON.parse(fs.readFileSync('C:/Users/koryj/website/_site_v2_queue.json','utf8'))
    .filter(x=>Array.isArray(x.reasons)&&x.reasons.includes('no-faq'))
    .map(x=>({id:x.id,question:x.title})); } catch(e){ return null; }
}
(async()=>{
  logln(`[faq] up — preemptive FAQ auto-fix, batch cap ${BATCH}${FROM_AUDIT?' (audit-targeted)':''}`);
  let entries;
  if (FROM_AUDIT){ entries = auditTargets() || []; logln(`[faq] ${entries.length} audit-flagged 'no-faq' URLs`); }
  else { const idx = await store.get('_index.json',{type:'json',consistency:'strong'}); entries = (idx.entries||[]); logln(`[faq] scanning ${entries.length} entries for missing FAQ…`); }
  let fixed=0, scanned=0, already=0, fail=0;
  for (const ie of entries){
    if (fs.existsSync(STOP)){ logln('[faq] stop flag'); break; }
    if (fixed >= BATCH){ logln(`[faq] batch cap ${BATCH} reached — stopping (re-run for more)`); break; }
    scanned++;
    let e; try { e = await store.get('answers/'+ie.id+'.json',{type:'json'}); } catch(_){ continue; }
    if (!e || !e.answer) continue;
    if (hasFAQ(e.answer)){ already++; continue; }
    try {
      let faq = await makeFaq(ie.question||e.question||ie.id, e.answer);
      let pairs = (faq.match(/^\s*\*\*[^*]+\?\*\*/gm)||[]).length;
      if (pairs < 5){ // one stricter retry
        faq = await makeFaq((ie.question||ie.id)+' (give EXACTLY 6 bold question/answer pairs)', e.answer);
        pairs = (faq.match(/^\s*\*\*[^*]+\?\*\*/gm)||[]).length;
      }
      if (pairs < 5){ fail++; logln(`[faq] ✗ ${ie.id} only ${pairs} pairs`); continue; }
      const before = gradeEntry(ie.id, e.answer).score;
      const newBody = insertFaq(e.answer, faq);
      const after = gradeEntry(ie.id, newBody).score;
      e.answer = newBody;
      if (typeof after === 'number') e.quality_score = Math.max(e.quality_score||0, after);
      e.faq_autofixed_at = '2026-06-29';
      await store.setJSON('answers/'+ie.id+'.json', e);
      fixed++;
      logln(`[faq] ✓ ${ie.id} +FAQ (${pairs} Q, score ${before}->${after}) [${fixed}]`);
      await sleep(1500);
    } catch(err){ fail++; if (fail<15) logln(`[faq] ERR ${ie.id} ${String(err.message).slice(0,80)}`); await sleep(3000); }
  }
  logln(`[faq] DONE — scanned ${scanned}, already had FAQ ${already}, fixed ${fixed}, failed ${fail}`);
})().catch(e=>{logln('[faq] FATAL '+e.message);process.exit(1);});
