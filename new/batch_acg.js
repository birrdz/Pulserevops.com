// 20 educational cellular-signal / in-building coverage Q&As (ACG Systems domain), dedup-checked.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const TARGET = 20;

const QS = [
  'Why is my cell signal weak inside my building and how do you fix it in 2027?',
  'What is a Distributed Antenna System (DAS) and does my building need one in 2027?',
  'How do cellular signal boosters work for commercial buildings in 2027?',
  'What causes dropped calls inside offices and warehouses in 2027?',
  'DAS vs cellular signal booster: which is right for my building in 2027?',
  'How do you get reliable cell coverage in a concrete or metal building in 2027?',
  'Why do new energy-efficient buildings have worse cell signal in 2027?',
  'What is ERRCS and is public safety radio coverage required by fire code in 2027?',
  'How do you fix cellular dead zones in a multi-story building in 2027?',
  'How long does it take to install an in-building cellular coverage system in 2027?',
  'Do cell signal systems work for all carriers like Verizon, AT&T, and T-Mobile in 2027?',
  'How do you improve cell coverage in a parking garage in 2027?',
  'What is the difference between a passive DAS and an active DAS in 2027?',
  'How do you design in-building wireless for a new construction project in 2027?',
  'How do you improve cellular coverage in a hospital or large healthcare facility in 2027?',
  'What is a cellular repeater and how is it different from a DAS in 2027?',
  'How do you get strong cell signal on a boat or at a marina in Annapolis in 2027?',
  'Why does reliable indoor cell coverage matter for a business in 2027?',
  'How do you improve cell signal in a waterfront home or condo in Annapolis in 2027?',
  'What should you look for in an in-building cellular coverage installer in 2027?',
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['2027', 'what', 'how', 'the', 'you', 'your', 'that', 'with', 'does', 'and'].includes(w));
const STATUS = WD + '/new/batch_acg_status.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const existing = idx.entries.map(e => new Set(norm(e.question)));
  const maxSim = q => { const a = new Set(norm(q)); let best = 0; for (const b of existing) { let inter = 0; a.forEach(t => { if (b.has(t)) inter++; }); const j = inter / (a.size + b.size - inter || 1); if (j > best) best = j; } return best; };
  let done = 0; const results = [];
  for (const q of QS) {
    if (done >= TARGET) break;
    const sim = maxSim(q);
    if (sim > 0.72) { console.log('SKIP dup (' + sim.toFixed(2) + '):', q); results.push({ q, status: 'dup-skip' }); continue; }
    done++;
    console.log('[' + done + '/' + TARGET + '] (' + sim.toFixed(2) + ')', q);
    fs.writeFileSync(STATUS, JSON.stringify({ running: q, done, target: TARGET }, null, 1));
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', q], { cwd: WD, encoding: 'utf8', timeout: 600000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    console.log('  →', /3\/3 —/.test(out) ? '3/3 ✓' : 'needs-review', m ? m[1] : '');
    results.push({ q, id: m ? m[1] : null });
  }
  fs.writeFileSync(STATUS, JSON.stringify({ done: true, generated: done, results }, null, 1));
  console.log('\n=== ACG BATCH DONE · ' + done + ' generated ===');
})();
