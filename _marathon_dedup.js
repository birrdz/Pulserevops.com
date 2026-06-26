// Cross-pillar dedup check for the marathon.
// Usage: node _marathon_dedup.js <prefix> "<proposed title>"
// Fetches the live library, compares normalized titles of same-prefix entries
// via Jaccard token overlap, and reports exact/near duplicates.
const https = require('https');
const PREFIX = process.argv[2];
const TITLE = process.argv[3] || '';
if (!PREFIX || !TITLE) { console.error('usage: node _marathon_dedup.js <prefix> "<title>"'); process.exit(1); }
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const toks = s => new Set(norm(s).split(' ').filter(w => w.length > 2));
const jac = (a, b) => { const A = toks(a), B = toks(b); if (!A.size || !B.size) return 0; let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i); };
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=100000', res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    let arr = [];
    try { const j = JSON.parse(d); const e = j.entries || j.items || j; arr = Array.isArray(e) ? e : Object.values(e); } catch (err) { console.error('parse err', err.message); process.exit(1); }
    const re = new RegExp('^' + PREFIX + '\\d+$');
    const same = arr.filter(e => e && e.id && re.test(e.id) && e.question);
    const np = norm(TITLE);
    const exact = same.filter(e => norm(e.question) === np);
    const similar = same.map(e => ({ id: e.id, q: e.question, s: jac(TITLE, e.question) })).filter(x => x.s >= 0.6).sort((a, b) => b.s - a.s).slice(0, 5);
    console.log(JSON.stringify({ prefix: PREFIX, proposed: TITLE, pool: same.length, clear: exact.length === 0 && similar.length === 0, exact: exact.map(e => e.id), similar }, null, 1));
  });
}).on('error', e => { console.error('http err', e.message); process.exit(1); });
