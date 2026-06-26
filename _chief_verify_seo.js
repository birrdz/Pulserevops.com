const https = require('https');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['q10939', 'q1410'];

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-chief-verify/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

(async () => {
  const sm = await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap');
  for (const id of ids) {
    const url = `https://pulserevops.com/knowledge/${id}`;
    const page = await get(url);
    const h = page.body || '';
    const checks = {
      http200: page.status === 200,
      title: /<title[^>]*>[^<]+<\/title>/i.test(h),
      metaDesc: /<meta\s+name="description"/i.test(h),
      canonical: /rel="canonical"/i.test(h),
      ogTitle: /<meta\s+property="og:title"/i.test(h),
      jsonLd: /application\/ld\+json/i.test(h),
      h1: /<h1/i.test(h),
      keywords: /<meta\s+name="keywords"/i.test(h),
      inSitemap: (sm.body || '').includes(`/knowledge/${id}`),
    };
    const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
    console.log(`${id}\tHTTP ${page.status}\tSEO ${missing.length ? 'MISSING ' + missing.join(',') : 'OK'}`);
  }
})();
