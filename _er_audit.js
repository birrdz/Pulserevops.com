// Electronic-reviews (er####) deep quality auditor.
// Walks er entries newest-first, re-grades each on the shared gold grader,
// and deep-checks the er-specific contract: 1800+ words, 10 numbered product
// sections, BOTH 🏆 BEST OVERALL and 💎 BEST VALUE pills, FAQ, Sources, no
// banned phrases. Stops after N consecutive clean passes (audit early-stop law).
// Usage: node _er_audit.js [maxClean=12]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const MAX_CLEAN = parseInt(process.argv[2] || '12', 10);
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = await store.get('_index.json', { type: 'json' });
  const ers = (idx.entries || []).filter(e => e && /^er\d+$/.test(e.id)).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  let scanned = 0, clean = 0, streak = 0; const fails = [];
  for (const e of ers) {
    const rec = await store.get(`answers/${e.id}.json`, { type: 'json' });
    if (!rec || !rec.answer) { fails.push({ id: e.id, issues: ['missing body'] }); streak = 0; scanned++; continue; }
    const g = gradeEntry(e.id, rec.answer);
    const body = rec.answer;
    const issues = [];
    if (g.score < 12) issues.push(`score ${g.score}/12 missing[${g.missing.join(',')}]`);
    if (g.word_count < 1800) issues.push(`words ${g.word_count}<1800`);
    if (g.banned_hits && g.banned_hits.length) issues.push(`banned[${g.banned_hits.join(',')}]`);
    if (!/(?:🏆|BEST\s+OVERALL)/i.test(body)) issues.push('no BEST OVERALL pill');
    if (!/(?:💎|BEST\s+VALUE)/i.test(body)) issues.push('no BEST VALUE pill');
    const prodSecs = (body.match(/^#{2,3}\s+(?:\d+\.|#?\d+\s+[—-])/gm) || []).length;
    if (prodSecs < 10) issues.push(`product sections ${prodSecs}<10`);
    scanned++;
    if (issues.length) { fails.push({ id: e.id, q: e.question, issues }); streak = 0; }
    else { clean++; streak++; if (streak >= MAX_CLEAN) break; }
  }
  console.log(`ER AUDIT — scanned ${scanned} / er total ${ers.length} | clean ${clean} | failed ${fails.length} | stopped after ${streak} consecutive clean`);
  if (fails.length) { console.log('FAILURES:'); fails.forEach(f => console.log(`  ${f.id}: ${f.issues.join(' | ')}  ${(f.q||'').slice(0,60)}`)); }
  else console.log('ALL CLEAN in the scanned window.');
  fs.writeFileSync('C:/Users/koryj/_er_audit_findings.json', JSON.stringify(fails, null, 2));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
