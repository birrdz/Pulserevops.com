// _cro_expand_minicert.js — EXPANSION PASS on the 12 mini-cert drafts to clear the 2,000-word floor
// with REAL situation-specific substance (not padding), then re-run the similarity matrix.
// Deepens each: buying dynamics, sales-cycle implications, what the fractional engagement looks like
// in THAT situation. Facts-discipline: no invented names/stats/%/$/laws/superlatives. STAGE ONLY.
const { dsChat } = require('./_ds_lib.js');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/_cro_minicert';

const SYS = 'You are a senior revenue-operations writer for PULSE RevOps. STRICT FACTUAL DISCIPLINE: never invent company names, person names, statistics, percentages, dollar figures, dates, laws, or regulations. No superlatives (best, leading, top, world-class). Only qualitative dynamics a working revenue leader recognizes as generally true. No em-dashes; use " - ". Deepen with real substance, never padding or repetition.';

function expandPrompt(question, anchor, draft) {
  return 'Below is a draft answer. EXPAND it to 2,100-2,400 words by DEEPENING each section with concrete, situation-specific substance for this exact situation (' + anchor + '). Do not pad, repeat, restate, or add filler - every added sentence must carry real operating substance.\n\n' +
    'Deepen specifically around:\n' +
    '1. BUYING DYNAMICS of ' + anchor + ' - who sits on the buying committee, typical deal size and shape, how budget gets approved, what the buyer actually evaluates, where deals stall.\n' +
    '2. SALES-CYCLE IMPLICATIONS - the motion this situation forces, ramp and forecast behavior, pipeline shape, where the leaks are.\n' +
    '3. WHAT THE FRACTIONAL / INTERIM ENGAGEMENT LOOKS LIKE HERE - the first 90 days, the operating cadence, what the revenue leader owns vs advises, the signals that say convert to full-time (or do not).\n\n' +
    'Keep the structure: "## Direct Answer" (2-3 sentences), 5-7 "## " H2 sections, then "## FAQ" with exactly 4 "**A question?**" items each answered in 2-4 sentences. Then STOP - do NOT write a Sources section. Everything must read as if it could ONLY have been written about ' + anchor + '.\n\n' +
    'QUESTION: ' + question + '\n\nDRAFT TO EXPAND:\n' + draft;
}

function normSentence(s) { return s.toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[*_`#>|]/g, ' ').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function sentenceSet(body) { const out = new Set(); const text = String(body || '').replace(/```[\s\S]*?```/g, ' '); for (const raw of text.split(/(?<=[.!?])\s+|\n+/)) { const n = normSentence(raw); if (n && n.split(' ').length >= 8) out.add(n); } return out; }
function overlap(a, b) { let c = 0; for (const s of a) if (b.has(s)) c++; return c / Math.min(a.size || 1, b.size || 1); }

(async () => {
  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.json'));
  const drafts = files.map(f => JSON.parse(fs.readFileSync(OUT + '/' + f, 'utf8'))).sort((a, b) => a.id.localeCompare(b.id));
  console.log('[expand] deepening ' + drafts.length + ' mini-cert entries to 2,000+ words (facts-discipline, no padding)');
  const queue = drafts.slice();
  const results = [];
  async function worker() {
    while (queue.length) {
      const d = queue.shift();
      try {
        const r = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: expandPrompt(d.question, d.anchor, d.body) }], { temperature: 0.6, max_tokens: 12000 });
        let body = r.content.trim();
        let wc = body.split(/\s+/).filter(Boolean).length;
        // one retry if still short
        if (wc < 2000) {
          const r2 = await dsChat([{ role: 'system', content: SYS }, { role: 'user', content: expandPrompt(d.question, d.anchor, body) + '\n\nThe previous version was ' + wc + ' words - still under 2,000. Add more situation-specific operating substance to clear 2,100 words. No padding.' }], { temperature: 0.6, max_tokens: 12000 });
          const body2 = r2.content.trim(); const wc2 = body2.split(/\s+/).filter(Boolean).length;
          if (wc2 > wc) { body = body2; wc = wc2; }
        }
        fs.writeFileSync(OUT + '/' + d.id + '.json', JSON.stringify({ id: d.id, question: d.question, anchor: d.anchor, body, words: wc }, null, 1));
        results.push({ id: d.id, anchor: d.anchor, body, words: wc });
        console.log('  ' + (wc >= 2000 ? '✓' : '⚠') + ' ' + d.id + ' [' + wc + 'w] ' + d.anchor);
      } catch (x) { console.log('  ✖ ' + d.id + ' ' + (x && x.message)); }
    }
  }
  await Promise.all([worker(), worker()]);
  results.sort((a, b) => a.id.localeCompare(b.id));

  // re-run matrix
  const sets = results.map(r => ({ id: r.id, set: sentenceSet(r.body) }));
  const N = sets.length; const mat = []; let worst = 0, worstPair = '';
  for (let i = 0; i < N; i++) { mat[i] = []; for (let j = 0; j < N; j++) { if (i === j) { mat[i][j] = 1; continue; } const ov = overlap(sets[i].set, sets[j].set); mat[i][j] = +ov.toFixed(2); if (ov > worst) { worst = ov; worstPair = sets[i].id + '~' + sets[j].id; } } }
  const perEntryMax = sets.map((s, i) => ({ id: s.id, maxOverlap: +Math.max(...mat[i].filter((_, j) => j !== i)).toFixed(2) }));
  const under2000 = results.filter(r => r.words < 2000).map(r => r.id + '(' + r.words + 'w)');
  const report = { family: 'decide-if-fractional-cro-right-for-[X]', phase: 'post-expansion', threshold: 0.30, worst: +worst.toFixed(2), worstPair, allAt2000: under2000.length === 0, under2000, avgWords: Math.round(results.reduce((a, r) => a + r.words, 0) / (results.length || 1)), minWords: Math.min(...results.map(r => r.words)), maxWords: Math.max(...results.map(r => r.words)), ids: sets.map(s => s.id), matrix: mat, perEntryMax };
  fs.writeFileSync(WD + '/_cro_minicert_matrix.json', JSON.stringify(report, null, 1));

  console.log('\n===== POST-EXPANSION MATRIX (' + N + 'x' + N + ') =====');
  process.stdout.write('        ' + sets.map(s => s.id.slice(-4)).join('  ') + '\n');
  for (let i = 0; i < N; i++) process.stdout.write(sets[i].id.padEnd(8) + mat[i].map(v => (v === 1 ? '  -- ' : ' ' + v.toFixed(2))).join('') + '\n');
  console.log('\nWORD FLOOR: all 12 at 2,000+? ' + (report.allAt2000 ? 'YES' : 'NO -> ' + under2000.join(', ')));
  console.log('  min ' + report.minWords + 'w · avg ' + report.avgWords + 'w · max ' + report.maxWords + 'w');
  console.log('UNIQUENESS: worst pair ' + Math.round(worst * 100) + '% (' + worstPair + ') · pass if < 30%: ' + (worst < 0.30 ? 'PASS' : 'FAIL'));
  console.log('\nBOTH GATES: ' + (report.allAt2000 && worst < 0.30 ? '✅ PASS - full GO condition met' : '❌ not yet'));
})().catch(x => { console.error('FATAL', x.message); process.exit(1); });
