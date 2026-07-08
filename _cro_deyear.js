// 🔒 4444. _cro_deyear.js — strip "in 2027" (any year) from EXISTING Pulse Tools CRO / Chief Revenue
// Officer Q&As. Same entries, same URLs — only the title + text lose the year (evergreen).
//   node _cro_deyear.js          # DRY — count + samples
//   node _cro_deyear.js --live   # apply: rewrite question/h1/body, one batched _index.json write
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const LIVE = process.argv.includes('--live');
const CONC = 12;
const isCRO = q => /fractional\s+cro|chief\s+revenue\s+officer|\bcro\b/i.test(String(q || ''));
const deYear = s => String(s || '').replace(/\s+in\s+20\d\d\b/gi, '').replace(/\bin\s+20\d\d\b/gi, '').replace(/\s+20\d\d\b/g, '').replace(/\s{2,}/g, ' ').replace(/\s+([?.!,])/g, '$1');

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const targets = (idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id) && isCRO(e.question) && /\b20\d\d\b/.test(e.question || ''));
  console.log(`[deyear] CRO Tools entries with a year in the title: ${targets.length}  (mode=${LIVE ? 'LIVE' : 'DRY'})`);
  targets.slice(0, 8).forEach(e => console.log('   ' + e.id + ':  "' + e.question + '"  →  "' + deYear(e.question) + '"'));
  if (!LIVE) { console.log('[deyear] DRY — run with --live to apply.'); return; }

  const qById = {};   // collect new questions for one batched index write
  let done = 0, qi = 0;
  async function worker() {
    while (qi < targets.length) {
      const e = targets[qi++];
      const newQ = deYear(e.question);
      qById[e.id] = newQ;
      try {
        const blob = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
        if (blob && blob.answer) {
          // TITLE-ONLY: de-year the question, h1, and any heading lines + image alts in the body — leave prose untouched
          const newBody = String(blob.answer).replace(/^(#{1,6}\s[^\n]*)$/gm, l => deYear(l)).replace(/!\[([^\]]*)\]/g, (m, alt) => '![' + deYear(alt) + ']');
          const patch = Object.assign({}, blob, {
            question: newQ,
            h1: blob.h1 ? deYear(blob.h1) : blob.h1,
            answer: newBody,
            updated_at: new Date().toISOString(),
          });
          await store.setJSON('answers/' + e.id + '.json', patch);
        }
      } catch (x) {}
      if (++done % 200 === 0) console.log(`[deyear] ${done}/${targets.length} blobs updated`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));

  // ONE batched index write (clobber-safe re-read)
  const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let n = 0;
  for (const e of (fresh.entries || [])) { if (e && qById[e.id] && e.question !== qById[e.id]) { e.question = qById[e.id]; n++; } }
  fs.writeFileSync(WD + '/_index.pre_deyear.json', JSON.stringify({ ids: targets.map(t => t.id) }));
  await store.setJSON('_index.json', fresh);
  console.log(`[deyear] DONE — de-yeared ${done} blobs, ${n} index titles. Same URLs, no year.`);
})().catch(e => { console.log('[deyear] FATAL', e && e.message); process.exit(1); });
