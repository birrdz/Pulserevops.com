const https = require('https');
const ids = ['ca0924', 'ca0940', 'ca0950', 'ca0973'];
function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'pulse-ca-verify/1.0' } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}
(async () => {
  const sm = (await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap')).body;
  for (const id of ids) {
    const url = `https://pulserevops.com/cars/${id}`;
    const p = await get(url);
    const checks = {
      title: /<title/i.test(p.body),
      metaDesc: /meta\s+name="description"/i.test(p.body),
      canonical: new RegExp(`rel="canonical"\\s+href="${url}"`, 'i').test(p.body),
      og: /property="og:title"/i.test(p.body),
      jsonLd: /application\/ld\+json/i.test(p.body),
      h1: /<h1/i.test(p.body),
    };
    const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
    const inSm = sm.includes(`/cars/${id}`);
    console.log(`${id}\tHTTP ${p.status}\tSEO ${missing.length ? 'FAIL ' + missing.join(',') : 'OK'}\tsitemap ${inSm ? 'yes' : 'no'}`);
  }
})();
