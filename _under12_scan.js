// _under12_scan.js — LOW-TOKEN deterministic audit (owner 2026-06-30). NO DeepSeek/Claude — just
// gradeEntry across EVERY URL in the catalog to find the ones genuinely scoring under 12/13
// (structurally incomplete: missing Direct Answer / 6 FAQ / 2 mermaids / 5 sources / Related, too
// short, or a broken mermaid). Fabrication is NOT detectable here — this is the cheap structural pass.
// Output: _under12_result.json  ·  console summary by pillar.
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const CONC = 16;

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const ids = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
  console.log(`[under12] grading ${ids.length} URLs deterministically (no API)…`);
  const under = []; const byPillar = {}; const scoreHist = {}; const missHist = {};
  let done = 0, noBlob = 0, qi = 0;
  async function worker() {
    while (qi < ids.length) {
      const id = ids[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer) { noBlob++; continue; }
        const g = gradeEntry(id, e.answer, { imagesDeferred: true });
        scoreHist[g.score] = (scoreHist[g.score] || 0) + 1;
        if (g.score < 12) {
          under.push({ id, score: g.score, missing: g.missing });
          byPillar[pillarOf(id)] = (byPillar[pillarOf(id)] || 0) + 1;
          for (const m of (g.missing || [])) missHist[m] = (missHist[m] || 0) + 1;
        }
      } catch (x) {}
      if (++done % 4000 === 0) console.log(`[under12] ${done}/${ids.length} · under12=${under.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  under.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  const out = {
    total: ids.length, noBlob, under12: under.length,
    scoreHist: Object.fromEntries(Object.entries(scoreHist).sort((a, b) => a[0] - b[0])),
    byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])),
    topMissing: Object.fromEntries(Object.entries(missHist).sort((a, b) => b[1] - a[1])),
    ids: under.map(u => u.id), sample: under.slice(0, 40),
  };
  fs.writeFileSync(WD + '/_under12_result.json', JSON.stringify(out));
  console.log(`[under12] DONE — ${under.length}/${ids.length} score <12 (noBlob ${noBlob})`);
  console.log(`[under12] scoreHist=${JSON.stringify(out.scoreHist)}`);
  console.log(`[under12] byPillar=${JSON.stringify(out.byPillar)}`);
  console.log(`[under12] topMissing=${JSON.stringify(out.topMissing)}`);
})().catch(e => { console.log('[under12] FATAL', e && e.message); process.exit(1); });
