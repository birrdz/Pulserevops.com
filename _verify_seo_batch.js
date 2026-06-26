// Verify SEO + sitemap presence for a range of knowledge IDs.
const https = require('https');

const START = parseInt(process.argv[2] || '10419', 10);
const END = parseInt(process.argv[3] || '10443', 10);

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-seo-verify/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

function check(html, id) {
  const url = `https://pulserevops.com/knowledge/${id}`;
  const checks = {
    title: /<title[^>]*>([^<]+)<\/title>/i.test(html),
    metaDesc: /<meta\s+name="description"\s+content="/i.test(html),
    canonical: new RegExp(`rel="canonical"\\s+href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i').test(html),
    ogTitle: /<meta\s+property="og:title"/i.test(html),
    ogDesc: /<meta\s+property="og:description"/i.test(html),
    twitter: /<meta\s+name="twitter:card"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
    h1: /<h1[^>]*>/i.test(html),
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  return { ok: missing.length === 0, missing };
}

async function main() {
  const sitemap = await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap');
  const smBody = sitemap.body || '';
  const pageResults = [];
  let allOk = true;

  for (let n = START; n <= END; n++) {
    const id = 'q' + n;
    const pageUrl = `https://pulserevops.com/knowledge/${id}`;
    const page = await get(pageUrl);
    const seo = check(page.body || '', id);
    const inSitemap = smBody.includes(`/knowledge/${id}</loc>`) || smBody.includes(`/knowledge/${id}<`);
    const row = { id, status: page.status, seo: seo.ok, missing: seo.missing, inSitemap };
    pageResults.push(row);
    if (!seo.ok || page.status !== 200 || !inSitemap) allOk = false;
    console.log(
      `${id}\tHTTP ${page.status}\tSEO ${seo.ok ? 'OK' : 'MISSING ' + seo.missing.join(',')}\tSitemap ${inSitemap ? 'yes' : 'NO'}`
    );
  }

  const indexNow = await get(
    'https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background'
  );
  console.log('\nIndexNow batch:', indexNow.status, (indexNow.body || '').slice(0, 300));

  console.log('\nSummary:', allOk ? 'ALL PASS' : 'ISSUES FOUND');
  process.exit(allOk ? 0 : 1);
}

main();
