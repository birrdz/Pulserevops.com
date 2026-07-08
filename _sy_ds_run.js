// _sy_ds_run.js — DeepSeek Style (sy) writer over _sy_sprint_queue500.json.
// 2 parallel writers, age-banded outfit guides (ruleset:'style'). publishTextFirst
// grades with the style ruleset, bakes in the CRO card + kw cluster, writes blob+index.
// Text-first: the per-outfit DDG image lane (_sy_outfit_img.js) fills real photos after.
// Cap-guarded on _ds_spend.json. Stop: _sy_ds_stop.flag. Log: _sy_ds_run.log.
// ⚠️ The single Claude auditor reviews this output (fabrication, brand sanity, both
//    genders × 3 age bands, no banned words).
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
const QUEUE = JSON.parse(fs.readFileSync(process.env.SY_QUEUE || 'C:/Users/koryj/website/_sy_sprint_queue500.json', 'utf8'));
const CAP = parseFloat(process.env.DS_DAILY_CAP || '15');
const STOP = 'C:/Users/koryj/website/_sy_ds_stop.flag';
const LOG = 'C:/Users/koryj/website/_sy_ds_run.log';
const CONC = parseInt(process.env.SY_CONC || '2', 10);
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const capped = () => { try { const sp = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_ds_spend.json', 'utf8')); return (sp.spent || 0) >= CAP; } catch (e) { return false; } };

(async () => {
  logln(`[sy-ds] start: ${QUEUE.length} items, conc=${CONC}, cap=$${CAP}`);
  let qi = 0, done = 0, fail = 0, skip = 0;
  async function worker() {
    while (qi < QUEUE.length) {
      if (fs.existsSync(STOP)) { logln('[sy-ds] STOP flag'); return; }
      if (capped()) { logln('[sy-ds] DAILY CAP reached — stopping'); return; }
      const item = QUEUE[qi++];
      try {
        const existing = await store.get(`answers/${item.id}.json`, { type: 'json' }).catch(() => null);
        // skip only if already in the new age-banded format; otherwise (re)generate.
        const hasAgeBlocks = existing && /```outfit[\s\S]*?\bage:/.test(existing.answer || '');
        if (existing && existing.quality_score >= 10 && hasAgeBlocks) { skip++; continue; }
        const { body } = await generateGradedBody(item.id, item.title, { ruleset: 'style' });
        fs.writeFileSync('C:/Users/koryj/' + item.id + '_answer.md', body);
        const r = await publishTextFirst(item.id, item.title);
        if (r.ok) { done++; logln(`[sy-ds] ${done} ✓ ${item.id} (score ${r.score}, ${r.words}w)`); }
        else { skip++; logln(`[sy-ds] ✗ grade ${item.id} score ${r.score} missing ${(r.missing || []).join(',')}`); }
      } catch (e) { fail++; logln(`[sy-ds] ERR ${item.id} ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  logln(`[sy-ds] DONE published=${done} grade-skip=${skip} fail=${fail}`);
})().catch(e => { logln('[sy-ds] FATAL ' + e.message); process.exit(1); });
