// Weekly usage report — pulls from pulse-machine-library blob + checks
// visitor-asked Q&A volume, library growth, top tags this week.

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

(async () => {
  const lib = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });
  const idx = (await lib.get('_index.json', { type: 'json' })) || { entries: [] };
  const NOW = Date.now();
  const D = 86400000;
  const buckets = { d1: 0, d7: 0, d14: 0, d30: 0, total: idx.entries.length };
  const visitor = { d1: 0, d7: 0, d14: 0, d30: 0, total: 0 };
  const tagCounts = {}; // last 7 days only
  const dailyCounts = {}; // last 14 days
  for (const e of idx.entries) {
    const age = NOW - (e.ts || 0);
    if (age < 1 * D) buckets.d1++;
    if (age < 7 * D) buckets.d7++;
    if (age < 14 * D) buckets.d14++;
    if (age < 30 * D) buckets.d30++;
    const isVisitor = String(e.id || '').startsWith('vq_') || (e.tags || []).includes('visitor-asked');
    if (isVisitor) {
      visitor.total++;
      if (age < 1 * D) visitor.d1++;
      if (age < 7 * D) visitor.d7++;
      if (age < 14 * D) visitor.d14++;
      if (age < 30 * D) visitor.d30++;
    }
    if (age < 7 * D && Array.isArray(e.tags)) {
      for (const t of e.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
    if (age < 14 * D) {
      const day = new Date(e.ts).toISOString().slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 15);
  const dailySorted = Object.entries(dailyCounts).sort();

  console.log('\n═══ LIBRARY USAGE — last 30 days ═══\n');
  console.log('Total entries in library:', buckets.total);
  console.log('  - last 24h:           ', buckets.d1);
  console.log('  - last 7 days:        ', buckets.d7);
  console.log('  - last 14 days:       ', buckets.d14);
  console.log('  - last 30 days:       ', buckets.d30);
  console.log('\nVisitor-asked Q&A:');
  console.log('  - total ever:         ', visitor.total);
  console.log('  - last 24h:           ', visitor.d1);
  console.log('  - last 7 days:        ', visitor.d7);
  console.log('  - last 30 days:       ', visitor.d30);
  console.log('\nDaily entry count (last 14 days):');
  for (const [day, n] of dailySorted) {
    const bar = '█'.repeat(Math.min(n, 60));
    console.log('  ' + day + '  ' + String(n).padStart(3) + '  ' + bar);
  }
  console.log('\nTop tags this week (top 15):');
  for (const [tag, n] of topTags) {
    console.log('  ' + tag.padEnd(28) + ' ' + n);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
