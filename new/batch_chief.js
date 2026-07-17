// new/batch_chief.js — generate N fair Chief women's-network essays, ONE AT A TIME.
// Dedup-checks each question against existing Chief entries (token overlap) before generating.
// Not a persistent daemon — a one-shot batch that exits when done.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';

const QUESTIONS = [
  'How do you get the most out of your first year as a Chief member in 2028?',
  'What should you do in your first 90 days after joining Chief in 2028?',
  'How do you prepare for your first Chief Core Group meeting in 2028?',
  'How do you build strong relationships inside a Chief Core Group in 2028?',
  'How do you network effectively at a Chief Summit in 2028?',
  'How do you use a Chief membership to prepare for a corporate board seat in 2028?',
  'How do you choose the right Chief membership tier for your career stage in 2028?',
  'How do you measure whether your Chief membership is paying off in 2028?',
  'How do you balance a Chief membership with a demanding executive schedule in 2028?',
  'What are the unwritten rules for getting real value from Chief in 2028?',
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['chief','2027','2026','2028','does','with','your','what','from','into','they','that','this'].includes(w));
const existing = (() => { try { return JSON.parse(fs.readFileSync(WD + '/new/_chief_existing.json', 'utf8')).map(norm); } catch (e) { return []; } })();
function maxSim(q) {
  const a = new Set(norm(q)); let best = 0, bq = '';
  existing.forEach((toks, i) => { const b = new Set(toks); let inter = 0; a.forEach(t => { if (b.has(t)) inter++; }); const jac = inter / (a.size + b.size - inter || 1); if (jac > best) { best = jac; } });
  return best;
}

const STATUS = WD + '/new/batch_chief_status.json';
const setS = o => { try { fs.writeFileSync(STATUS, JSON.stringify(o, null, 1)); } catch (e) {} };

(async () => {
  const results = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const sim = maxSim(q);
    if (sim > 0.6) { console.log('SKIP dup (' + sim.toFixed(2) + '):', q); results.push({ q, status: 'dup-skip', sim }); continue; }
    console.log('\n[' + (i + 1) + '/' + QUESTIONS.length + '] generating (sim ' + sim.toFixed(2) + '):', q);
    setS({ running: q, index: i + 1, total: QUESTIONS.length, done: results.length, at: new Date().toISOString() });
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', q], { cwd: WD, encoding: 'utf8', timeout: 600000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    const pass = /3\/3 — TEXT DONE/.test(out);
    console.log('   →', pass ? '3/3 ✓' : 'not 3/3', m ? m[1] : '(no id)');
    results.push({ q, status: pass ? '3/3' : 'text-fail', id: m ? m[1] : null, sim });
  }
  setS({ done: true, results, finishedAt: new Date().toISOString() });
  console.log('\n=== BATCH DONE ===');
  results.forEach(r => console.log((r.status === '3/3' ? '✅' : r.status === 'dup-skip' ? '⏭️ ' : '⚠️ ') + ' ' + (r.id || r.status) + ' · ' + r.q.slice(0, 60)));
})();
