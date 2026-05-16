// Pull visitor counts from the visit-alerts blob (last 7 days).
const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

(async () => {
  const store = getStore({ name: 'visit-alerts', siteID: SITE_ID, token: TOKEN });
  const NOW = new Date();
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(NOW.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    days.push(key);
  }
  console.log('\n═══ VISITOR ALERTS — last 14 days (unique IPs per day) ═══\n');
  let total = 0, weekTotal = 0;
  for (let i = 0; i < days.length; i++) {
    const key = days[i];
    let seen = null;
    try { const raw = await store.get(key); seen = raw ? JSON.parse(raw) : null; } catch (e) {}
    const count = seen ? (Array.isArray(seen) ? seen.length : Object.keys(seen).length) : 0;
    const bar = '█'.repeat(Math.min(count, 50));
    console.log('  ' + key + '  ' + String(count).padStart(4) + '  ' + bar);
    total += count;
    if (i < 7) weekTotal += count;
  }
  console.log('\nTotals:');
  console.log('  Last 7 days unique-visitor-day count: ', weekTotal);
  console.log('  Last 14 days unique-visitor-day count:', total);
  console.log('  Note: a visitor is counted once per day. Same IP across days = multiple counts.');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
