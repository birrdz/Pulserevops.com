// _pillar_weave.js — GENERIC internal-link weave for any pillar. Clusters entries by
// DISCRIMINATIVE question-title keywords (auto-drops words appearing in >40% of the pillar's
// questions, since tags are often identical across a pillar). Injects a "## Related on PULSE"
// block of the 6 most-similar sibling guides. Idempotent via <!--pillar-weave--> marker.
// Modes:
//   node _pillar_weave.js ca --dry            preview cars (no writes)
//   node _pillar_weave.js ca --dry --limit 6  preview 6
//   node _pillar_weave.js ca                  weave cars (live)
//   node _pillar_weave.js ALL                 weave every content pillar, smallest-first
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const args = process.argv.slice(2);
const PILLAR = args[0];
const DRY = args.includes('--dry');
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const MARK = '<!--pillar-weave-->';
const SLEEP = parseInt(process.env.WEAVE_PACE_MS || '0', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const STOP = new Set('the a an of to in for on at by with and or vs versus is are do does how what which where when why who whom best top ten guide review list under over your my this that these those it as into from about near 2024 2025 2026 2027 2028 2029 i you we should can need cost costs price buy buying hire find get use using'.split(' '));
const tok = q => (q || '').toLowerCase().replace(/[^a-z0-9$\s-]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !/^\d+$/.test(w) && !STOP.has(w));

function buildIndexCluster(entries) {
  // document frequency per token within this pillar
  const df = {};
  const toks = entries.map(e => { const t = [...new Set(tok(e.question))]; t.forEach(w => df[w] = (df[w] || 0) + 1); return t; });
  const N = entries.length, MAXDF = Math.max(2, Math.floor(0.4 * N));
  // discriminative tokens: appear in >=2 questions but < 40% of them
  const disc = entries.map((e, i) => toks[i].filter(w => df[w] >= 2 && df[w] <= MAXDF));
  // inverted index token -> [entryIdx]
  const inv = {};
  disc.forEach((ts, i) => ts.forEach(w => (inv[w] = inv[w] || []).push(i)));
  return { df, disc, inv, N };
}
function siblingsFor(i, entries, cl) {
  const { df, disc, inv } = cl;
  const score = {};
  for (const w of disc[i]) { const wt = 1 / df[w]; for (const j of inv[w]) if (j !== i) score[j] = (score[j] || 0) + wt; }
  return Object.entries(score).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([j]) => entries[+j]);
}
// FALLBACK for orphans (no discriminative sibling): link the same-pillar entries with the
// highest RAW question-token overlap. Only /knowledge/<id> targets (can't 404), never a hub slug.
function fallbackSiblings(i, entries) {
  const mine = new Set(tok(entries[i].question));
  if (!mine.size) return [];
  const scored = [];
  for (let j = 0; j < entries.length; j++) {
    if (j === i) continue;
    let shared = 0; for (const w of new Set(tok(entries[j].question))) if (mine.has(w)) shared++;
    if (shared >= 1) scored.push([j, shared]);
  }
  return scored.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([j]) => entries[j]);
}
function block(sibs) {
  return `${MARK}\n## Related on PULSE\n\n${sibs.map(s => `- [${(s.question || '').replace(/\s+$/, '')}](/knowledge/${s.id})`).join('\n')}\n`;
}
function inject(body, blk) {
  if (body.includes(MARK) || body.includes('<!--cro-weave-->')) return null; // already woven (either weaver)
  const reRel = /\n#{2,3}\s*Related on PULSE[\s\S]*?(?=\n#{1,2}\s|\s*$)/i;
  if (reRel.test(body)) return body.replace(reRel, '\n' + blk.replace(/\n+$/, '') + '\n');
  const reSrc = /\n## Sources\b/i, reFaq = /\n## (FAQ|Frequently)\b/i;
  if (reSrc.test(body)) return body.replace(reSrc, '\n' + blk + '\n## Sources');
  if (reFaq.test(body)) return body.replace(reFaq, '\n' + blk + '\n## FAQ');
  return body.replace(/\s*$/, '') + '\n\n' + blk;
}

async function weavePillar(prefix, idx) {
  const re = new RegExp('^' + prefix + '\\d');
  const entries = idx.entries.filter(e => e && re.test(e.id));
  if (entries.length < 3) { console.log(`[${prefix}] only ${entries.length} entries — skip`); return { prefix, wrote: 0 }; }
  const cl = buildIndexCluster(entries);
  let wrote = 0, skipped = 0, nosib = 0, preview = 0;
  for (let i = 0; i < entries.length; i++) {
    if (wrote >= LIMIT) break;
    let sibs = siblingsFor(i, entries, cl);
    if (sibs.length < 2) sibs = fallbackSiblings(i, entries); // orphan → same-pillar raw-overlap links (no dead-ends)
    if (sibs.length < 2) { nosib++; continue; }
    const blk = block(sibs);
    if (DRY) { if (preview++ < 6) { console.log(`\n=== ${entries[i].id} | ${entries[i].question}`); console.log(blk); } continue; }
    const e = await store.get('answers/' + entries[i].id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { skipped++; continue; }
    const nb = inject(e.answer, blk);
    if (!nb) { skipped++; continue; }
    await store.setJSON('answers/' + entries[i].id + '.json', Object.assign({}, e, { answer: nb, pillar_woven_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
    wrote++;
    if (wrote % 100 === 0) console.log(`[${prefix}] woven ${wrote}...`);
    if (SLEEP) await sleep(SLEEP);
  }
  console.log(`[${prefix}] ${DRY ? 'DRY preview done' : 'DONE wrote ' + wrote + ', skipped ' + skipped + ' (woven/no-blob), noSib ' + nosib} (of ${entries.length})`);
  return { prefix, wrote };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  if (PILLAR && PILLAR !== 'ALL') { await weavePillar(PILLAR, idx); return; }
  // ALL: every content pillar, smallest-first, skip tl (CRO weave owns it) + junk prefixes
  const byPillar = {};
  idx.entries.forEach(e => { if (e && e.id) { const p = (e.id.match(/^[a-z]+/) || [''])[0]; byPillar[p] = (byPillar[p] || 0) + 1; } });
  const order = Object.entries(byPillar).filter(([p, n]) => n >= 20 && p !== 'tl' && !/^qmp/.test(p)).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  console.log('ALL pillars (smallest-first):', order.join(', '));
  for (const p of order) await weavePillar(p, idx);
})();
