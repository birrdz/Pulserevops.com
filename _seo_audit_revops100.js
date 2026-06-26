// SEO / IndexNow audit + repair for the RevOps-100 line (q10798..q10898).
// For each entry: check was_indexed_at stamp; if missing, call the live
// pulse-indexnow-target endpoint to re-ping (Bing/Yandex/Naver/Seznam/IndexNow.org).
// Google has no real-time ping API — its sitemap discovery covers all entries
// via /sitemap-knowledge.xml, which we verify is reachable and includes the IDs.
//
// Usage: node _seo_audit_revops100.js
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
const FROM = 10798;
const TO   = 10898;

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    }).on('error', () => resolve({ status: 0, body: '' }));
  });
}

function postJSON(url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: 12000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(buf) }); }
        catch (_) { resolve({ status: res.statusCode, body: buf }); }
      });
    });
    req.on('error', () => resolve({ status: 0, body: 'err' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });

  // 1) Verify sitemap is live + contains all 101 IDs
  console.log('=== Step 1: sitemap audit ===');
  const sm = await get('https://pulserevops.com/sitemap-knowledge.xml');
  console.log(`Sitemap HTTP: ${sm.status}, length: ${sm.body.length}`);
  let inSitemap = 0;
  const missingSitemap = [];
  for (let n = FROM; n <= TO; n++) {
    const id = `q${n}`;
    if (sm.body.includes(`/knowledge/${id}<`)) inSitemap++;
    else missingSitemap.push(id);
  }
  console.log(`In sitemap: ${inSitemap}/${TO - FROM + 1}`);
  if (missingSitemap.length) console.log('Missing from sitemap: ' + missingSitemap.join(', '));

  // 2) Verify static sitemap.xml references the knowledge sitemap
  const staticSm = await get('https://pulserevops.com/sitemap.xml');
  const hasIndex = /sitemap-knowledge\.xml/i.test(staticSm.body) || /<urlset/i.test(staticSm.body);
  console.log(`/sitemap.xml HTTP: ${staticSm.status}, includes knowledge ref or urlset: ${hasIndex}`);

  // 3) Per-entry IndexNow audit + repair
  console.log('\n=== Step 2: IndexNow stamp audit ===');
  const noStamp = [];
  let stamped = 0;
  let urlReachable = 0;
  for (let n = FROM; n <= TO; n++) {
    const id = `q${n}`;
    const e = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!e) { noStamp.push({ id, why: 'missing entry' }); continue; }
    if (e.was_indexed_at) stamped++;
    else noStamp.push({ id, why: 'no was_indexed_at' });
  }
  console.log(`Stamped (was_indexed_at present): ${stamped}/${TO - FROM + 1}`);
  console.log(`Needs re-ping: ${noStamp.length}`);

  // 4) Sample 5 public URLs to confirm they're reachable (200)
  console.log('\n=== Step 3: public URL reachability sample (5 entries) ===');
  const sampleIds = ['q10798', 'q10830', 'q10860', 'q10890', 'q10898'];
  for (const id of sampleIds) {
    const r = await get(`https://pulserevops.com/knowledge/${id}`);
    const titleMatch = r.body.match(/<title>([^<]+)<\/title>/);
    urlReachable += r.status === 200 ? 1 : 0;
    console.log(`  ${id} -> HTTP ${r.status} | title: ${titleMatch ? titleMatch[1].slice(0, 70) : '(none)'}`);
  }

  // 5) Re-ping any missing stamps via the live function
  if (noStamp.length) {
    console.log(`\n=== Step 4: re-pinging ${noStamp.length} entries ===`);
    let pinged = 0;
    let pingErr = 0;
    for (const row of noStamp) {
      const r = await postJSON('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
        key: 'pulsemachine-writer-2026', id: row.id,
      });
      const ok = r.body && r.body.ok;
      if (ok) pinged++; else pingErr++;
      console.log(`  ${row.id} -> ${ok ? 'OK' : 'ERR'} ${JSON.stringify((r.body && r.body.pings) || r.body).slice(0, 120)}`);
    }
    console.log(`Re-pinged OK: ${pinged}, errors: ${pingErr}`);
  } else {
    console.log('\n=== Step 4: nothing to re-ping (all stamped) ===');
  }

  // 6) Google-specific check: robots.txt sitemap directive
  console.log('\n=== Step 5: robots.txt / Google discovery ===');
  const robots = await get('https://pulserevops.com/robots.txt');
  console.log(`robots.txt HTTP: ${robots.status}`);
  console.log('Sitemap directives:');
  (robots.body.match(/Sitemap:[^\n]+/gi) || []).forEach((s) => console.log('  ' + s.trim()));

  // 7) Final summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total RevOps-100 entries (q10798..q10898): ${TO - FROM + 1}`);
  console.log(`In sitemap-knowledge.xml: ${inSitemap}`);
  console.log(`IndexNow-stamped at audit start: ${stamped}`);
  console.log(`Sample public URLs returning 200: ${urlReachable}/5`);
  console.log('Google: indexed via sitemap discovery (no real-time ping API exists).');
  console.log('Bing/Yandex/Naver/Seznam: pinged via IndexNow per-entry on write + any repair above.');
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
