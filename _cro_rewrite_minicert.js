// _cro_rewrite_minicert.js — PHASE 1 MINI-CERT for the "decide if a fractional CRO is right for [X]" family.
// Rewrites 12 near-dup siblings so each diverges on its EXACT situation [X] (stage / industry / motion),
// driven by that situation's buying dynamics, sales cycle, and revenue model.
// STAGES ONLY — writes to _cro_minicert/<id>.json, DOES NOT publish. Owner reviews matrix + sample first.
// Facts-table discipline: NO invented company/person names, stats, %, $, dates, laws, superlatives.
const { dsChat } = require('./_ds_lib.js');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const OUT = WD + '/_cro_minicert';
try { fs.mkdirSync(OUT, { recursive: true }); } catch (e) {}

const SYS = 'You are a senior revenue-operations writer for PULSE RevOps. You write precise, non-generic B2B revenue content for operators who can smell filler. STRICT FACTUAL DISCIPLINE: never invent company names, person names, statistics, percentages, dollar figures, dates, laws, or regulations. Do not use superlatives (best, leading, top, world-class, cutting-edge). Write only qualitative dynamics that a working revenue leader would recognize as generally true. No em-dashes anywhere; use " - " instead. No filler, no throat-clearing.';

function anchorOf(q) { const m = String(q || '').match(/right for (?:a |an )?([^?]+?)(?: when | company| companies|\?|$)/i); return (m ? m[1] : String(q || '')).trim().slice(0, 80); }

function userPrompt(q, x) {
  return 'Rewrite the answer to this question so it is UNIQUE to its exact situation and shares no templated sentences with its sibling questions.\n\n' +
    'QUESTION: ' + q + '\n\n' +
    'The ENTIRE answer must be driven by the specific buying dynamics, sales-cycle characteristics, and revenue model of THIS exact situation (' + x + '): how deals actually get sourced and closed in this context, what the sales motion and buying committee look like, how revenue is structured and recognized, and how those realities determine whether a fractional, interim, or full-time revenue leader is the right fit. Everything should feel like it could ONLY have been written about ' + x + ', not about companies in general.\n\n' +
    'STRUCTURE (markdown):\n' +
    '## Direct Answer\n(2-3 sentence verdict specific to ' + x + ')\n\n' +
    'then 4 to 6 "## " H2 sections, each with concrete situation-driven substance,\n\n' +
    '## FAQ\nexactly 4 items, each a line "**A specific question?**" followed by a 2-4 sentence answer.\n\n' +
    'Then STOP. Do NOT write a Sources section (added later). 1500-2000 words. No lists of generic advice that would apply to any company.';
}

// --- uniqueness matrix (same method as the census gate) ---
function normSentence(s) { return s.toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[*_`#>|]/g, ' ').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function sentenceSet(body) { const out = new Set(); const text = String(body || '').replace(/```[\s\S]*?```/g, ' '); for (const raw of text.split(/(?<=[.!?])\s+|\n+/)) { const n = normSentence(raw); if (n && n.split(' ').length >= 8) out.add(n); } return out; }
function overlap(a, b) { let c = 0; for (const s of a) if (b.has(s)) c++; return c / Math.min(a.size || 1, b.size || 1); }

(async () => {
  const ids = JSON.parse(fs.readFileSync(WD + '/_cro_family_x.json', 'utf8')).ids.slice(0, 12);
  console.log('[minicert] rewriting ' + ids.length + ' from the [X]-situation family (stage only, no publish)');
  const results = [];
  // DeepSeek 2-parallel per the concurrency law
  const queue = ids.slice();
  async function worker(wid) {
    while (queue.length) {
      const id = queue.shift();
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' });
        if (!e) { console.log('  ' + id + ' MISSING'); continue; }
        const x = anchorOf(e.question);
        const r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: userPrompt(e.question, x) }], { temperature: 0.7, max_tokens: 8000 });
        const body = r.content.trim();
        const wc = body.split(/\s+/).filter(Boolean).length;
        fs.writeFileSync(OUT + '/' + id + '.json', JSON.stringify({ id, question: e.question, anchor: x, body, words: wc }, null, 1));
        results.push({ id, anchor: x, body, words: wc });
        console.log('  ✓ ' + id + ' [' + wc + 'w] ' + x);
      } catch (x2) { console.log('  ✖ ' + id + ' ' + (x2 && x2.message)); }
    }
  }
  await Promise.all([worker(1), worker(2)]);
  results.sort((a, b) => a.id.localeCompare(b.id));

  // pairwise similarity matrix on the rewritten bodies
  const sets = results.map(r => ({ id: r.id, set: sentenceSet(r.body) }));
  const N = sets.length;
  const mat = [];
  let worst = 0, worstPair = '';
  for (let i = 0; i < N; i++) { mat[i] = []; for (let j = 0; j < N; j++) { if (i === j) { mat[i][j] = 1; continue; } const ov = overlap(sets[i].set, sets[j].set); mat[i][j] = +ov.toFixed(2); if (ov > worst) { worst = ov; worstPair = sets[i].id + '~' + sets[j].id; } } }
  const perEntryMax = sets.map((s, i) => ({ id: s.id, maxOverlap: +Math.max(...mat[i].filter((_, j) => j !== i)).toFixed(2) }));

  const report = { family: 'decide-if-fractional-cro-right-for-[X]', threshold: 0.30, worst: +worst.toFixed(2), worstPair, ids: sets.map(s => s.id), matrix: mat, perEntryMax, avgWords: Math.round(results.reduce((a, r) => a + r.words, 0) / (results.length || 1)) };
  fs.writeFileSync(WD + '/_cro_minicert_matrix.json', JSON.stringify(report, null, 1));

  console.log('\n===== SIMILARITY MATRIX (rewritten bodies, ' + N + 'x' + N + ', 0.30 = fail line) =====');
  process.stdout.write('        ' + sets.map(s => s.id.slice(-4)).join('  ') + '\n');
  for (let i = 0; i < N; i++) process.stdout.write(sets[i].id.padEnd(8) + mat[i].map(v => (v === 1 ? '  -- ' : ' ' + v.toFixed(2))).join('') + '\n');
  console.log('\nworst off-diagonal overlap: ' + worst.toFixed(2) + ' (' + worstPair + ')   [pass if < 0.30]');
  console.log('per-entry max overlap:'); perEntryMax.forEach(p => console.log('  ' + p.id + '  ' + p.maxOverlap + (p.maxOverlap >= 0.30 ? '  <-- still too close' : '')));
  console.log('avg words: ' + report.avgWords);
  console.log('\nstaged to _cro_minicert/ · matrix _cro_minicert_matrix.json · NOTHING PUBLISHED');
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
