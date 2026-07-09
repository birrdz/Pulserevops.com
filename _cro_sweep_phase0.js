// _cro_sweep_phase0.js — POST-DEPLOY Phase 0: sweep the ENTIRE library index for CRO-family entries
// OUTSIDE the 4,996 already scored (the fractional-cro tl census). Over-sweeping is fine — false positives
// cost nothing to score. Output _cro_phase0_manifest.json {byPrefix, matches:[{id,prefix,pillar,title}]}.
// Does NOT transform anything — scoring only (uniqueness scan runs next, on this manifest).
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

// CRO-family match — broad on purpose (over-sweep). Applied to question/title.
const CRO = /chief\s+revenue\s+officer|\bcro\b|fractional\s+cro|fractional\s+(?:chief\s+revenue|revenue\s+lead)|interim\s+(?:cro|revenue)|outsourced\s+(?:cro|revenue)|part[\s-]?time\s+(?:cro|revenue)|revenue\s+leader|vp\s+of\s+(?:sales|revenue)|rev\s?ops\s+lead|revenue\s+leadership|sales\s+leadership\s+hir/i;
// already-scored = the fractional-cro tl census scope (question mentions "fractional cro")
const ALREADY = /fractional\s*cro/i;
const PILLAR_NAME = { tl: 'CRO Pulse Tools', q: 'Business Q&A', ra: 'Revenue Architecture', gp: 'GTM Playbooks', ik: 'Industry KPIs', st: 'Sales Trainings', tk: 'Tech Stacks', bs: 'Book Summaries', sc: 'Sales Coaching', cg: 'Consulting' };

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  const es = idx.entries || [];
  const matches = [], byPrefix = {};
  for (const e of es) {
    if (!e || !e.id) continue;
    const q = e.question || e.title || '';
    if (!CRO.test(q)) continue;
    const pre = (String(e.id).match(/^[a-z]+/i) || [''])[0].toLowerCase();
    // exclude the already-scored fractional-cro tl census
    if (pre === 'tl' && ALREADY.test(q)) continue;
    matches.push({ id: e.id, prefix: pre, pillar: PILLAR_NAME[pre] || pre, title: q.slice(0, 90) });
    byPrefix[pre] = (byPrefix[pre] || 0) + 1;
  }
  const out = { total: matches.length, byPrefix, matches };
  fs.writeFileSync(WD + '/_cro_phase0_manifest.json', JSON.stringify(out, null, 1));
  console.log('PHASE 0 SWEEP — CRO-family entries OUTSIDE the 4,996 already scored: ' + matches.length);
  console.log('by prefix (where they were hiding):');
  for (const [p, c] of Object.entries(byPrefix).sort((a, b) => b[1] - a[1])) console.log('  ' + p + ' (' + (PILLAR_NAME[p] || p) + '): ' + c);
  console.log('sample:', matches.slice(0, 6).map(m => m.id + ' — ' + m.title.slice(0, 50)).join(' | '));
  console.log('wrote _cro_phase0_manifest.json');
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
