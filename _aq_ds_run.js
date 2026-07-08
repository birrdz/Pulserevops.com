// _aq_ds_run.js — DeepSeek aquarium writer on EXPLICIT ids from _aq_ds_queue.json
// (high band aq1100+, no collision with the Claude sprint). 2-parallel (owner law),
// publish via publishTextFirst (bakes in CRO card, grades ≥10, writes blob+index).
// Daily-cap guard on _ds_spend.json. Stop flag: _aq_ds_stop.flag.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_aq_ds_queue.json', 'utf8'));
const CAP = parseFloat(process.env.DS_DAILY_CAP || '15');
const STOP = 'C:/Users/koryj/website/_aq_ds_stop.flag';
const LOG = 'C:/Users/koryj/website/_aq_ds_run.log';
const CONC = 2;
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const capped = () => { try { const sp = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_ds_spend.json', 'utf8')); return (sp.spent || 0) >= CAP; } catch (e) { return false; } };

(async () => {
  logln(`[aq-ds] start: ${QUEUE.length} items, conc=${CONC}, cap=$${CAP}`);
  let qi = 0, done = 0, fail = 0, skip = 0;
  async function worker() {
    while (qi < QUEUE.length) {
      if (fs.existsSync(STOP)) { logln('[aq-ds] STOP flag'); return; }
      if (capped()) { logln('[aq-ds] DAILY CAP reached — stopping'); return; }
      const item = QUEUE[qi++];
      try {
        const { body } = await generateGradedBody(item.id, item.title, { kind: item.kind });
        fs.writeFileSync('C:/Users/koryj/' + item.id + '_answer.md', body);
        const r = await publishTextFirst(item.id, item.title);
        if (r.ok) { done++; logln(`[aq-ds] ${done} ✓ ${item.id} (${item.kind}, score ${r.score}, ${r.words}w)`); }
        else { skip++; logln(`[aq-ds] ✗ grade ${item.id} score ${r.score} missing ${(r.missing || []).join(',')}`); }
      } catch (e) { fail++; logln(`[aq-ds] ERR ${item.id} ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  logln(`[aq-ds] DONE published=${done} grade-skip=${skip} fail=${fail}`);
})().catch(e => { logln('[aq-ds] FATAL ' + e.message); process.exit(1); });
