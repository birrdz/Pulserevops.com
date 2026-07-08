// _tc_run.js — DeepSeek Telco writer. Generates v2 Top-10 "Best Cellular and Wireless
// Carrier in <State> in 2027" pages from _tc_queue.json (tc0001..). Uses the top10v2
// ruleset (gradeable Top-10 + v2 cards), grades as electronicreview, publishes to
// /telco/<id> via publishTextFirst (seg 'telco'). Stop: _tc_stop.flag. Log: _tc_run.log.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { generateGradedBody } = require('./_ds_gen_any');
const { publishTextFirst } = require('./_ds_publish');
const { getStore } = require('@netlify/blobs');
const QUEUE = JSON.parse(fs.readFileSync(process.env.TC_QUEUE || 'C:/Users/koryj/website/_tc_queue.json', 'utf8'));
const CAP = parseFloat(process.env.DS_DAILY_CAP || '15');
const STOP = 'C:/Users/koryj/website/_tc_stop.flag';
const LOG = 'C:/Users/koryj/website/_tc_run.log';
const CONC = parseInt(process.env.TC_CONC || '5', 10);
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const capped = () => { try { const sp = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_ds_spend.json', 'utf8')); return (sp.spent || 0) >= CAP; } catch (e) { return false; } };
const prefixOf = id => (String(id).match(/^([a-z]+)/i) || [])[1];
const dupKey = (id, q) => prefixOf(id) + ' ' + String(q || '').trim().replace(/\s+/g, ' ');

(async () => {
  logln(`[tc] start: ${QUEUE.length} items, conc=${CONC}, cap=$${CAP}, ruleset=top10v2`);
  const titleOwner = new Map();
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    for (const e of (idx.entries || idx || [])) { if (!e || !e.question) continue; const k = dupKey(e.id, e.question); if (!titleOwner.has(k)) titleOwner.set(k, e.id); }
    logln(`[tc] dedup map: ${titleOwner.size} exact pillar+question keys loaded`);
  } catch (e) { logln('[tc] WARN dedup map load failed (' + e.message + ')'); }
  const claimed = new Set();
  let qi = 0, done = 0, fail = 0, skip = 0, dup = 0;
  async function worker() {
    while (qi < QUEUE.length) {
      if (fs.existsSync(STOP)) { logln('[tc] STOP flag'); return; }
      if (capped()) { logln('[tc] DAILY CAP reached — stopping'); return; }
      const item = QUEUE[qi++];
      try {
        const tkey = dupKey(item.id, item.title);
        const owner = titleOwner.get(tkey);
        if ((owner && owner !== item.id) || claimed.has(tkey)) { dup++; logln(`[tc] DUP-skip ${item.id} "${item.title}"`); continue; }
        claimed.add(tkey);
        const existing = await store.get(`answers/${item.id}.json`, { type: 'json' }).catch(() => null);
        if (!process.env.TC_FORCE && existing && existing.quality_score >= 10) { skip++; continue; }
        const { body } = await generateGradedBody(item.id, item.title, { ruleset: item.ruleset || 'top10v2' });
        fs.writeFileSync('C:/Users/koryj/' + item.id + '_answer.md', body);
        const r = await publishTextFirst(item.id, item.title);
        if (r.ok) { done++; titleOwner.set(tkey, item.id); logln(`[tc] ${done} ✓ ${item.id} (score ${r.score}, ${r.words}w)`); }
        else if (r.reason === 'duplicate') { dup++; claimed.delete(tkey); logln(`[tc] DUP-skip ${item.id} (publisher: ${r.dupeOf})`); }
        else { skip++; logln(`[tc] ✗ grade ${item.id} score ${r.score} missing ${(r.missing || []).join(',')}`); }
      } catch (e) { fail++; logln(`[tc] ERR ${item.id} ${e.message}`); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  logln(`[tc] DONE published=${done} grade-skip=${skip} dup-skip=${dup} fail=${fail}`);
})().catch(e => { logln('[tc] FATAL ' + e.message); process.exit(1); });
