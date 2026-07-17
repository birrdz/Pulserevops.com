// 20 fresh RevOps / sales-leadership essay Q&As (2027), dedup-checked vs the whole library.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const TARGET = 20;
const QS = [
  'How do you build a sales enablement program that reps actually use in 2027?',
  'How do you reduce sales rep turnover in 2027?',
  'How do you run an effective sales kickoff (SKO) in 2027?',
  'How do you build a channel partner program from scratch in 2027?',
  'How do you price a SaaS product for the mid-market in 2027?',
  'How do you build a customer success team that drives expansion revenue in 2027?',
  'How do you fix a leaky sales funnel in 2027?',
  'How do you set up multi-touch attribution marketing and sales both trust in 2027?',
  'How do you build a demand generation engine in 2027?',
  'How do you coach an underperforming sales rep in 2027?',
  'How do you build an ideal customer profile (ICP) in 2027?',
  'How do you structure a clean BDR to AE handoff in 2027?',
  'How do you build a sales playbook that scales in 2027?',
  'How do you reduce discounting without losing deals in 2027?',
  'How do you build a competitive battlecard program in 2027?',
  'How do you measure sales productivity in 2027?',
  'How do you build a RevOps dashboard in Salesforce in 2027?',
  'How do you run a quarterly business review with your board in 2027?',
  'How do you build a lead routing system that does not drop leads in 2027?',
  'How do you set up sales territories that are fair and balanced in 2027?',
];
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['2027', 'what', 'how', 'the', 'you', 'your', 'that', 'with', 'does', 'and', 'without'].includes(w));
const STATUS = WD + '/new/batch_new20_status.json';
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
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', q], { cwd: WD, encoding: 'utf8', timeout: 600000, env: Object.assign({}, process.env, { GEN_FORCE_FORMAT: 'essay' }) });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    console.log('  →', /3\/3 —/.test(out) ? '3/3 ✓' : 'needs-review', m ? m[1] : '');
    results.push({ q, id: m ? m[1] : null });
  }
  fs.writeFileSync(STATUS, JSON.stringify({ done: true, generated: done, results }, null, 1));
  console.log('\n=== NEW-20 BATCH DONE · ' + done + ' generated ===');
})();
