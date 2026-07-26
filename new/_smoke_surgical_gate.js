'use strict';
// Smoke: surgical + early-exit is ENGINE-AGNOSTIC (DS / Cursor / CC).
const ic = require('./improve_content.js');

const q = 'How do RevOps teams set pipeline coverage targets?';
const body = [
  '## Direct Answer',
  '',
  'Set pipeline coverage near three to four times remaining quota, then review weekly with sales and finance so slip does not sink the number. Keep the ratio visible on the forecast call.',
  '',
  '## How coverage works',
  '',
  ('Open pipeline divided by remaining quota is the core ratio. Leaders set a floor, watch aging deals, and rebalance when coverage dips below plan. ').repeat(60),
  '',
  '## Operating cadence',
  '',
  ('Run a weekly coverage review, tag at-risk deals, and assign owners before the forecast lock. ').repeat(40),
].join('\n');

const g0 = ic.gateScore({ body, question: q });
const sx = ic.surgicalGateFix(body, q);
const g1 = ic.gateScore({ body: sx.body, question: q });
console.log('before', g0.score, g0.fails.map(f => f.name).join(','));
console.log('after surgical', g1.score, 'fixed', sx.fixed.join(','), 'fails', g1.fails.map(f => f.name).join(',') || 'none', 'mer', g1.mermaids);

const r = ic.rebuildToGate(q, body, { maxAttempts: 0, antidrift: false, id: 'smoke_any_engine' });
console.log('rebuildToGate', { after: r.after, attempts: r.attempts, surgicalOnly: !!r.surgicalOnly, ok: r.ok });

if (!(g1.score >= 12)) { console.error('FAIL: surgical should clear 12+'); process.exit(1); }
if (!r.surgicalOnly || r.after < 12) { console.error('FAIL: expected surgical-only early exit >=12'); process.exit(1); }

const only1 = body + '\n\n```mermaid\nflowchart TD\n  A-->B\n```\n';
const fixed = ic.surgicalGateFix(only1, q);
const mer = (fixed.body.match(/```mermaid/gi) || []).length;
if (mer !== 2) { console.error('FAIL: need exactly 2 mermaids, got', mer); process.exit(1); }

console.log('OK — surgical path is engine-agnostic (pre/post writer; DS/Cursor/CC share same gate)');
