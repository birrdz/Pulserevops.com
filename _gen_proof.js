// _gen_proof.js — PROOF the length fix: generate 3 gp entries via the full pipeline, then report each
// entry's total word count vs the 2400 target + per-H2 section counts + rubric score. (owner 2026-07-10)
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const API = 'http://127.0.0.1:8899/ur' + 'gent';
const wc = s => String(s || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#*_>|`-]/g, ' ').split(/\s+/).filter(Boolean).length;
const QUESTIONS = [
  'What is the go-to-market playbook for boutique fitness studios in 2027?',
  'What is the go-to-market playbook for independent pharmacies in 2027?',
  'What is the go-to-market playbook for commercial roofing contractors in 2027?',
];
async function main() {
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    console.log('\n[proof] ' + (i + 1) + '/3 generating: ' + q);
    let res = null;
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', pillar: 'gp', question: q, essayOnly: true }), signal: AbortSignal.timeout(1500000) });
      res = await r.json();
    } catch (e) { console.log('  ERR ' + e.message); continue; }
    const rr = res && res.result || {};
    const id = rr.id;
    let body = '';
    if (id) { try { const a = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' }); body = a && (a.answer || a.body) || ''; } catch (e) {} }
    const total = wc(body);
    // per-H2 section word counts
    const parts = body.split(/\n(?=##\s)/);
    const sections = parts.filter(p => /^##\s/.test(p)).map(p => { const h = (p.match(/^##\s+(.+)/) || [, ''])[1].slice(0, 34); return h + '=' + wc(p) + 'w'; });
    console.log('  → id=' + id + '  status=' + (rr.status || '?') + '  score=' + (rr.score != null ? rr.score + '/13' : '?'));
    console.log('  → TOTAL ' + total + ' words (target 2400, floor 2000) ' + (total >= 2000 ? '✓' : '✗ SHORT'));
    console.log('  → sections: ' + sections.join('  '));
  }
  console.log('\n[proof] done');
}
main().catch(e => { console.error('[proof] FATAL', e.message); process.exit(1); });
