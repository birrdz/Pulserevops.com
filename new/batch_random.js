// generate 10 diverse essay Q&As across different pillars, dedup-checked vs the WHOLE library.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });

const QUESTIONS = [
  'What should you inspect before buying a certified pre-owned luxury car in 2028?',
  'How do you cycle a new saltwater reef aquarium the right way in 2028?',
  'How do you dial in espresso on a brand-new machine in 2028?',
  'How do you introduce a second dog into a one-dog household in 2028?',
  'What does a modern RevOps tech stack look like for a Series A startup in 2028?',
  'How do you choose an all-inclusive resort that is actually worth the money in 2028?',
  'How do you build a family budget that survives real life in 2028?',
  'How do you build a budget gaming PC that still lasts in 2028?',
  'How do you build a morning routine that actually sticks in 2028?',
  'How do you winterize a wakeboard boat the right way in 2028?',
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['2028', '2027', 'what', 'how', 'the', 'you', 'your', 'that', 'with', 'does', 'right'].includes(w));
const STATUS = WD + '/new/batch_random_status.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const existing = idx.entries.map(e => new Set(norm(e.question)));
  const maxSim = q => { const a = new Set(norm(q)); let best = 0; for (const b of existing) { let inter = 0; a.forEach(t => { if (b.has(t)) inter++; }); const j = inter / (a.size + b.size - inter || 1); if (j > best) best = j; } return best; };

  const results = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]; const sim = maxSim(q);
    if (sim > 0.7) { console.log('SKIP dup (' + sim.toFixed(2) + '):', q); results.push({ q, status: 'dup-skip', sim }); continue; }
    console.log('[' + (i + 1) + '/10] (' + sim.toFixed(2) + ')', q);
    fs.writeFileSync(STATUS, JSON.stringify({ running: q, index: i + 1, total: 10, done: results.length }, null, 1));
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', q], { cwd: WD, encoding: 'utf8', timeout: 600000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    const pass = /3\/3 — TEXT DONE/.test(out);
    console.log('  →', pass ? '3/3 ✓' : 'not 3/3', m ? m[1] : '');
    results.push({ q, id: m ? m[1] : null, status: pass ? '3/3' : 'text-fail' });
  }
  fs.writeFileSync(STATUS, JSON.stringify({ done: true, results }, null, 1));
  console.log('=== RANDOM BATCH DONE ===');
  results.forEach(r => console.log((r.status === '3/3' ? '✅' : r.status === 'dup-skip' ? '⏭️' : '⚠️') + ' ' + (r.id || r.status) + ' · ' + r.q.slice(0, 55)));
})();
