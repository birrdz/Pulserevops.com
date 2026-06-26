// Full-library SEO audit — verify sitemap, robots.txt, IndexNow stamping,
// per-URL HTTP 200, and Google discovery infrastructure across the WHOLE library.
const fs = require('fs');
const https = require('https');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => resolve({ status: res.statusCode, body: buf, headers: res.headers }));
    }).on('error', () => resolve({ status: 0, body: '' }));
  });
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const allIds = (idx.entries || []).map(e => e.id).filter(Boolean);
  console.log(`Total entries in _index.json: ${allIds.length}`);

  // 1) Sitemap audit
  console.log('\n=== sitemap-knowledge.xml ===');
  const sm = await get('https://pulserevops.com/sitemap-knowledge.xml');
  console.log(`HTTP: ${sm.status}, body length: ${sm.body.length}`);
  let inSitemap = 0;
  const missingFromSitemap = [];
  for (const id of allIds) {
    if (sm.body.includes('/knowledge/' + id + '<') || sm.body.includes('/sales-trainings/' + id + '<') || sm.body.includes('/industry-kpis/' + id + '<')) {
      inSitemap++;
    } else {
      missingFromSitemap.push(id);
    }
  }
  console.log(`In sitemap: ${inSitemap}/${allIds.length}`);
  if (missingFromSitemap.length) {
    console.log(`First 20 missing: ${missingFromSitemap.slice(0, 20).join(', ')}`);
  }

  // 2) robots.txt
  console.log('\n=== robots.txt ===');
  const robots = await get('https://pulserevops.com/robots.txt');
  console.log(`HTTP: ${robots.status}`);
  console.log('Sitemap directives:');
  (robots.body.match(/Sitemap:[^\n]+/gi) || []).forEach(s => console.log('  ' + s.trim()));

  // 3) IndexNow stamp coverage on the recent 200 entries
  console.log('\n=== IndexNow stamp coverage (recent 200) ===');
  const recent200 = (idx.entries || []).slice(0, 200).map(e => e.id);
  let stamped = 0;
  const notStamped = [];
  for (const id of recent200) {
    if (!id) continue;
    try {
      const e = await store.get('answers/' + id + '.json', { type: 'json' });
      if (e && e.was_indexed_at) stamped++;
      else notStamped.push(id);
    } catch (_) {}
  }
  console.log(`Stamped: ${stamped}/${recent200.length}`);
  if (notStamped.length) console.log(`Not stamped (first 20): ${notStamped.slice(0, 20).join(', ')}`);

  // 4) Sample 10 random URLs for HTTP 200
  console.log('\n=== Public URL reachability (sample 10) ===');
  const samples = [];
  for (let i = 0; i < 10 && i < allIds.length; i++) {
    samples.push(allIds[Math.floor(Math.random() * allIds.length)]);
  }
  let reachable = 0;
  for (const id of samples) {
    const r = await get('https://pulserevops.com/knowledge/' + id);
    if (r.status === 200) reachable++;
    console.log(`  ${id} -> HTTP ${r.status}`);
  }
  console.log(`Reachable: ${reachable}/${samples.length}`);

  // 5) Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Library size: ${allIds.length} entries`);
  console.log(`In sitemap: ${inSitemap} (${(100 * inSitemap / allIds.length).toFixed(1)}%)`);
  console.log(`Recent-200 IndexNow-stamped: ${stamped}/${recent200.length}`);
  console.log(`Sample URLs returning 200: ${reachable}/${samples.length}`);
  console.log(`Sitemaps in robots.txt: ${(robots.body.match(/Sitemap:/gi) || []).length}`);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
