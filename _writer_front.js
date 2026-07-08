// _writer_front.js — FRONT-END WRITER (2 DeepSeek). Cranks GROUNDED DRAFTS fast and publishes
// them text-first; the SEO Site Perfection Engine (_v2_components.js) + CC auditor (_v2_auditor.js)
// then bring every new entry to a flawless 13/13. Division of labor (owner 2026-06-30):
//   FRONT (this) = write drafts fast on DeepSeek · BACK (SEO engine) = perfect them to 13/13.
//
// Queue: _writer_queue.json = [ { id, title, ruleset?, kind?, tags? }, ... ]  (seed with _writer_seed.js)
// New entries unshift to the FRONT of _index.json (newest) → CC auditor (newest-first) picks them up fast.
// 2 DeepSeek workers (WRITER_CONC), dedup-safe, resumable (done items removed from the queue).
// Stop: _writer_front_stop.flag · log: _writer_front.out.log · idles 5m when the queue is empty.
const fs = require('fs');
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_writer_front_stop.flag';
const QUEUE = WD + '/_writer_queue.json';
const CONC = Math.max(1, parseInt(process.env.WRITER_CONC || '2', 10));   // owner: 2 DeepSeek writers
const sleep = ms => new Promise(r => setTimeout(r, ms));
const logln = s => { try { fs.appendFileSync(WD + '/_writer_front.out.log', new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} console.log(s); };
const readQ = () => { try { return JSON.parse(fs.readFileSync(QUEUE, 'utf8')); } catch (e) { return []; } };
const removeFromQ = id => { const q = readQ().filter(it => it.id !== id); try { fs.writeFileSync(QUEUE, JSON.stringify(q, null, 0)); } catch (e) {} };

(async () => {
  logln(`[writer] FRONT writer up — ${CONC} DeepSeek, drafts → SEO engine perfects to 13/13`);
  while (!fs.existsSync(STOP)) {
    const q = readQ();
    if (!q.length) { logln('[writer] queue empty — idle 5m (drop titles via _writer_seed.js)'); await sleep(300000); continue; }
    logln(`[writer] ${q.length} queued`);
    let qi = 0; let wrote = 0;
    async function worker(wid) {
      while (!fs.existsSync(STOP)) {
        const item = q[qi++]; if (!item) return;
        try {
          const { body, grade } = await generateGradedBody(item.id, item.title, { ruleset: item.ruleset, kind: item.kind });
          const r = await publishTextFirst(item.id, item.title, { tags: item.tags || [] });
          if (r.ok) { wrote++; removeFromQ(item.id); logln(`[writer] w${wid} ✍️ PUBLISHED ${item.id} (score ${r.score}, ${r.words}w) — engine will perfect to 13/13`); }
          else if (r.reason === 'duplicate') { removeFromQ(item.id); logln(`[writer] w${wid} ⊘ ${item.id} duplicate of ${r.dupeOf} — dropped`); }
          else if (r.reason === 'grade') { removeFromQ(item.id); logln(`[writer] w${wid} ↪ ${item.id} draft score ${r.score} (<10) — published-as-draft skipped; left for engine pass`); }
          else { removeFromQ(item.id); logln(`[writer] w${wid} ⚠ ${item.id} ${r.reason}`); }
        } catch (e) { removeFromQ(item.id); logln(`[writer] w${wid} ERR ${item.id} ${e.message}`); }
      }
    }
    await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
    logln(`[writer] pass done — wrote ${wrote}`);
  }
  logln('[writer] stop flag — exiting');
})().catch(e => { logln('[writer] FATAL ' + (e && e.message)); process.exit(1); });
