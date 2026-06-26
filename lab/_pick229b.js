const fs = require('fs');
const j = JSON.parse(fs.readFileSync('C:/Users/koryj/website/lab/_liblist_t229.json', 'utf8'));
const entries = Array.isArray(j.entries) ? j.entries : [];
const skip = new Set(['q445','q433','q418','q446','q448','q447','q449','q450','q451','q452','q459','q460','q461','q462','q463','q464','q465','q466','q467','q474','q476','q479','q671','q672','q1145','q1147','q1892','q2003','q2135','q2136','q2137','q2141']);
const elig = entries.filter(function (e) {
  if (!e || typeof e.id !== 'string') return false;
  const m = e.id.match(/^q(\d+)$/);
  if (!m) return false;
  const n = parseInt(m[1], 10);
  if (n >= 9501) return false;
  if (n >= 1946 && n <= 1954) return false;
  if (skip.has(e.id)) return false;
  if ((e.quality_score || 0) < 10) return false;
  if (e.format_v === '2026-05') return false;
  const tags = e.tags || [];
  if (tags.indexOf('sales-training') !== -1) return false;
  return true;
});
elig.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
console.log('eligible:', elig.length);
elig.slice(0, 20).forEach(function (e, i) {
  console.log(i, e.id, 'ts=' + e.ts, 'qs=' + e.quality_score, 'fv=' + e.format_v, '|', (e.question || '').slice(0, 75));
});
const t = elig[14];
console.log('---TARGET index 14---');
console.log(JSON.stringify({ id: t.id, question: t.question, tags: t.tags, ts: t.ts }));
