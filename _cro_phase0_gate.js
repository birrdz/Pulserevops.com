// _cro_phase0_gate.js — Phase 0 uniqueness scan on the 5,652 swept CRO-family entries.
// Same sentence-overlap method + 30% threshold as _fcro_similarity_gate.js (the CRO census).
// Output _cro_phase0_unique.json { uniqueIds, nearDup, stubIds, byPrefix:{pre:{certified,nearDup,stub}} }.
// MEASURE ONLY — no rewrites, no transforms. Resume/progress via _cro_phase0_gate_progress.txt.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const THRESHOLD = 0.30;
const preOf = id => (String(id).match(/^[a-z]+/i) || [''])[0].toLowerCase();
function normSentence(s) { return s.toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[*_`#>|]/g, ' ').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function sentenceSet(body) { const out = new Set(); const text = String(body || '').replace(/```[\s\S]*?```/g, ' '); for (const raw of text.split(/(?<=[.!?])\s+|\n+/)) { const n = normSentence(raw); if (n && n.split(' ').length >= 8) out.add(n); } return out; }

(async () => {
  const man = JSON.parse(fs.readFileSync(WD + '/_cro_phase0_manifest.json', 'utf8'));
  const ids = man.matches.map(m => m.id);
  const sets = {}, inv = new Map(), stubIds = [];
  let n = 0, fullN = 0;
  for (const id of ids) {
    n++;
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e) { stubIds.push(id); continue; }
    const wc = (e.answer || '').split(/\s+/).filter(Boolean).length;
    if (wc < 1600) { stubIds.push(id); continue; }
    fullN++;
    const set = sentenceSet(e.answer);
    sets[id] = set;
    for (const s of set) { let a = inv.get(s); if (!a) { a = []; inv.set(s, a); } a.push(id); }
    if (n % 300 === 0) fs.writeFileSync(WD + '/_cro_phase0_gate_progress.txt', 'fingerprint ' + n + '/' + ids.length + ' full=' + fullN + ' stub=' + stubIds.length);
  }
  const fids = Object.keys(sets), nearDup = [], uniqueIds = [];
  let done = 0;
  for (const id of fids) {
    const mine = sets[id]; const size = mine.size || 1; const shareCount = new Map();
    for (const s of mine) { const holders = inv.get(s); if (holders && holders.length > 1) for (const o of holders) if (o !== id) shareCount.set(o, (shareCount.get(o) || 0) + 1); }
    let bestId = null, best = 0;
    for (const [o, c] of shareCount) { const ov = c / Math.min(size, sets[o].size || 1); if (ov > best) { best = ov; bestId = o; } }
    if (best > THRESHOLD) nearDup.push({ id, dupOf: bestId, overlap: +best.toFixed(3) }); else uniqueIds.push(id);
    done++;
    if (done % 300 === 0) fs.writeFileSync(WD + '/_cro_phase0_gate_progress.txt', 'compare ' + done + '/' + fids.length + ' nearDup=' + nearDup.length);
  }
  // per-prefix split
  const dupSet = new Set(nearDup.map(d => d.id)), stubSet = new Set(stubIds);
  const byPrefix = {};
  for (const id of ids) { const p = preOf(id); (byPrefix[p] = byPrefix[p] || { certified: 0, nearDup: 0, stub: 0 }); if (stubSet.has(id)) byPrefix[p].stub++; else if (dupSet.has(id)) byPrefix[p].nearDup++; else byPrefix[p].certified++; }
  const out = { threshold: THRESHOLD, scanned: ids.length, certified: uniqueIds.length, nearDup: nearDup.length, stub: stubIds.length, byPrefix, uniqueIds, nearDupList: nearDup, stubIds };
  fs.writeFileSync(WD + '/_cro_phase0_unique.json', JSON.stringify(out, null, 1));
  console.log('PHASE 0 UNIQUENESS CENSUS (' + ids.length + ' swept):');
  console.log('  ✅ CERTIFIED (SPEC2 transform queue): ' + uniqueIds.length);
  console.log('  ⚠  NEAR-DUP (→ Phase 1): ' + nearDup.length);
  console.log('  ▫  STUB (→ Phase 2): ' + stubIds.length);
  console.log('  by prefix:'); for (const [p, s] of Object.entries(byPrefix).sort((a, b) => (b[1].certified + b[1].nearDup + b[1].stub) - (a[1].certified + a[1].nearDup + a[1].stub))) console.log('    ' + p + ': cert ' + s.certified + ' / dup ' + s.nearDup + ' / stub ' + s.stub);
  console.log('wrote _cro_phase0_unique.json');
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
