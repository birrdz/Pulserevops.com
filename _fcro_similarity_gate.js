// _fcro_similarity_gate.js — Q3 UNIQUENESS SKIP-GATE for the fractional-CRO transform.
// The certification manifest died with the new PC, so we regenerate the uniqueness signal directly:
// per CRO_PULSE_TOOLS_RUN.md rule 6, any pair sharing >30% of sentences FAILS. This scans every
// full-content (>=1600w) fractional-CRO tl body, fingerprints its prose sentences, and flags near-dups.
// Output _fcro_unique.json { uniqueIds:[...], nearDup:[{id, dupOf, overlap}] } = the transform's allow-list.
// Also = the regenerated audit manifest (persist it — state, not scratch).
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const THRESHOLD = 0.30; // >30% shared sentences = near-duplicate (spec rule 6)

// normalize a sentence for comparison: lowercase, strip markdown/urls/punctuation/digits, collapse space
function normSentence(s) {
  return s.toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[*_`#>|]/g, ' ').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
}
// prose sentence set for a body: split into sentences, keep substantive ones (>=8 words), drop boilerplate.
function sentenceSet(body) {
  const out = new Set();
  const text = String(body || '').replace(/```[\s\S]*?```/g, ' ');          // drop code/mermaid
  for (const raw of text.split(/(?<=[.!?])\s+|\n+/)) {
    const n = normSentence(raw);
    const wc = n ? n.split(' ').length : 0;
    if (wc >= 8) out.add(n);
  }
  return out;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const scope = (idx.entries || []).filter(e => e && /^tl\d+$/.test(String(e.id)) && /fractional\s*cro/i.test(e.question || ''));
  scope.sort((a, b) => parseInt(String(a.id).slice(2), 10) - parseInt(String(b.id).slice(2), 10));
  // 1) fetch bodies + build sentence sets (only full-content >=1600w candidates)
  const sets = {};       // id -> Set(sentences)
  const inv = new Map();  // sentenceHash -> [ids]
  let n = 0, fullN = 0;
  for (const row of scope) {
    n++;
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e) continue;
    const wc = (e.answer || '').split(/\s+/).filter(Boolean).length;
    if (wc < 1600) continue;   // short finder entries are a different spec, not honeypot candidates
    fullN++;
    const set = sentenceSet(e.answer);
    sets[row.id] = set;
    for (const s of set) { let a = inv.get(s); if (!a) { a = []; inv.set(s, a); } a.push(row.id); }
    if (n % 300 === 0) fs.writeFileSync(WD + '/_fcro_sim_progress.txt', 'fingerprint ' + n + '/' + scope.length + ' full=' + fullN);
  }
  // 2) for each entry, find max shared-sentence overlap with any single other entry
  const ids = Object.keys(sets);
  const nearDup = [];
  const uniqueIds = [];
  let done = 0;
  for (const id of ids) {
    const mine = sets[id]; const size = mine.size || 1;
    const shareCount = new Map(); // otherId -> shared sentence count
    for (const s of mine) {
      const holders = inv.get(s);
      if (holders && holders.length > 1) for (const o of holders) if (o !== id) shareCount.set(o, (shareCount.get(o) || 0) + 1);
    }
    let bestId = null, best = 0;
    for (const [o, c] of shareCount) { const ov = c / Math.min(size, sets[o].size || 1); if (ov > best) { best = ov; bestId = o; } }
    if (best > THRESHOLD) nearDup.push({ id, dupOf: bestId, overlap: +best.toFixed(3), sents: size });
    else uniqueIds.push(id);
    done++;
    if (done % 300 === 0) fs.writeFileSync(WD + '/_fcro_sim_progress.txt', 'compare ' + done + '/' + ids.length + ' nearDup=' + nearDup.length);
  }
  const out = { threshold: THRESHOLD, fullContentScanned: fullN, uniqueIds, nearDup, generated: 'similarity-gate' };
  fs.writeFileSync(WD + '/_fcro_unique.json', JSON.stringify(out, null, 1));
  console.log('SIMILARITY GATE DONE');
  console.log('  full-content candidates:', fullN);
  console.log('  UNIQUE (allow transform):', uniqueIds.length);
  console.log('  NEAR-DUP (skip - would be doorway polishing):', nearDup.length);
  if (nearDup.length) console.log('  worst offenders:', nearDup.sort((a, b) => b.overlap - a.overlap).slice(0, 8).map(d => d.id + '~' + d.dupOf + '@' + d.overlap).join(', '));
  console.log('  wrote _fcro_unique.json (regenerated manifest)');
  process.exit(0);
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
