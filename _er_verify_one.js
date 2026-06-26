const https = require('https');
const url = process.argv[2] || 'https://pulserevops.com/electronic-reviews/er0577';
https.get(url, { headers: { 'User-Agent': 'pulse-seo-verify' } }, (r) => {
  let b = '';
  r.on('data', (c) => (b += c));
  r.on('end', () => {
    const checks = {
      status: r.statusCode,
      title: /<title[^>]*>[^<]+<\/title>/i.test(b),
      metaDesc: /<meta\s+name="description"/i.test(b),
      canonical: /rel="canonical"/i.test(b),
      ogTitle: /<meta\s+property="og:title"/i.test(b),
      jsonLd: /application\/ld\+json/i.test(b),
      h1: /<h1[^>]*>/i.test(b),
      metaKw: /<meta\s+name="keywords"/i.test(b),
      productCards: /@@PRODUCT|product-card/i.test(b),
    };
    console.log(JSON.stringify(checks, null, 2));
  });
}).on('error', (e) => console.error(e));
