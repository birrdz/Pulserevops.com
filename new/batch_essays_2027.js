// generate up to 20 hand-picked, on-brand RevOps essay Q&As (end in 2027), dedup-checked vs the library.
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const TARGET = 20;

const CANDIDATES = [
  'How do you build a revenue forecast a CFO will actually trust in 2027?',
  'What do the first 90 days of a new RevOps leader look like in 2027?',
  'How do you set SDR quotas that are actually attainable in 2027?',
  'How do you fix a broken pipeline review in 2027?',
  'How do you calculate and shorten CAC payback in 2027?',
  'How do you design a sales comp plan that drives the right behavior in 2027?',
  'How do you run a deal desk that speeds up approvals in 2027?',
  'How do you clean up messy Salesforce data without stopping the team in 2027?',
  'How do you build a lead scoring model that sales actually trusts in 2027?',
  'How do you measure and shorten sales rep ramp time in 2027?',
  'How do you structure a RevOps team at a Series B startup in 2027?',
  'How do you run a QBR the sales team does not dread in 2027?',
  'How do you build a customer health score that predicts churn in 2027?',
  'How do you align marketing and sales on one funnel in 2027?',
  'How do you forecast renewals accurately in 2027?',
  'How do you set pipeline stage exit criteria that stop deal inflation in 2027?',
  'How do you measure marketing\'s real contribution to revenue in 2027?',
  'How do you build a RevOps tech stack without tool sprawl in 2027?',
  'How do you build a territory plan reps will not fight in 2027?',
  'How do you run an effective weekly sales forecast call in 2027?',
  'How do you decide when to hire your first RevOps person in 2027?',
  'How do you reduce sales cycle length without discounting in 2027?',
  'How do you build a win-loss analysis program that changes behavior in 2027?',
  'How do you set up sales dashboards leaders will actually use in 2027?',
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['2027', '2028', 'what', 'how', 'the', 'you', 'your', 'that', 'with', 'does', 'will', 'without', 'actually'].includes(w));
const STATUS = WD + '/new/batch_essays_status.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const existing = idx.entries.map(e => new Set(norm(e.question)));
  const maxSim = q => { const a = new Set(norm(q)); let best = 0; for (const b of existing) { let inter = 0; a.forEach(t => { if (b.has(t)) inter++; }); const j = inter / (a.size + b.size - inter || 1); if (j > best) best = j; } return best; };

  let done = 0; const results = [];
  for (const q of CANDIDATES) {
    if (done >= TARGET) break;
    const sim = maxSim(q);
    if (sim > 0.7) { console.log('SKIP dup (' + sim.toFixed(2) + '):', q); results.push({ q, status: 'dup-skip' }); continue; }
    done++;
    console.log('[' + done + '/' + TARGET + '] (' + sim.toFixed(2) + ')', q);
    fs.writeFileSync(STATUS, JSON.stringify({ running: q, done, target: TARGET }, null, 1));
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', q], { cwd: WD, encoding: 'utf8', timeout: 600000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    console.log('  →', /TEXT DONE|text not at 3\/3/.test(out) ? 'done' : 'issue', m ? m[1] : '');
    results.push({ q, id: m ? m[1] : null, status: 'built' });
  }
  fs.writeFileSync(STATUS, JSON.stringify({ done: true, generated: done, results }, null, 1));
  console.log('\n=== ESSAY BATCH DONE · ' + done + ' generated ===');
})();
