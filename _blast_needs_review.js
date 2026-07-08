// _blast_needs_review.js — re-run the engine's needs-review backlog through fixEntry at the
// current MIN_SCORE (set V2C_MIN_SCORE=12). Entries that now pass move to _v2_approved.json and
// leave needs-review. RUN WITH THE ENGINE PAUSED (it owns _v2_approved.json) to avoid a write race.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { fixEntry } = require('./_v2_components');
const { dsChat } = require('./_ds_lib');
const WD = 'C:/Users/koryj/website';
const NR = WD + '/_v2_needs_review.json', AP = WD + '/_v2_approved.json';
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const CONC = parseInt(process.env.BLAST_CONC || '6', 10);

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set(idx.entries.map(e => e && e.id).filter(Boolean));
  const titleOf = Object.fromEntries(idx.entries.filter(e => e && e.id).map(e => [e.id, e.question]));
  const byPillar = {}; const pof = id => (String(id).match(/^[a-z]+/) || [''])[0];
  for (const e of idx.entries) if (e && e.id) (byPillar[pof(e.id)] = byPillar[pof(e.id)] || []).push({ id: e.id, title: e.question });

  let ids = readArr(NR);
  console.log('needs-review backlog:', ids.length, '| MIN_SCORE=', process.env.V2C_MIN_SCORE || '(default)');
  const approved = new Set(readArr(AP));
  const stillStuck = [];
  let pass = 0, fail = 0, qi = 0;

  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++];
      try {
        const sibs = (byPillar[pof(id)] || []).filter(s => s.id !== id);
        const r = await fixEntry(id, titleOf[id] || id, sibs, valid, dsChat).catch(e => ({ err: e.message }));
        if (r && r.approved) { approved.add(id); pass++; if (pass % 25 === 0) console.log('  blasted', pass); }
        else { stillStuck.push(id); fail++; }
      } catch (e) { stillStuck.push(id); fail++; }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  // merge approved (engine is paused, safe to rewrite) + shrink needs-review to the truly-stuck
  fs.writeFileSync(AP, JSON.stringify([...approved]));
  fs.writeFileSync(NR, JSON.stringify(stillStuck));
  console.log(`DONE: ${pass} cleared to approved, ${fail} still stuck. needs-review now ${stillStuck.length}.`);
})();
