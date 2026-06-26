const https = require('https');
const url = process.argv[2] || 'https://pulserevops.com/resorts/rs0051';
https
  .get(url, { headers: { 'User-Agent': 'pulse-verify' } }, (r) => {
    let b = '';
    r.on('data', (c) => (b += c));
    r.on('end', () => {
      console.log(
        JSON.stringify({
          url,
          status: r.statusCode,
          title: /<title[^>]*>[^<]+<\/title>/i.test(b),
          metaDesc: /<meta\s+name="description"/i.test(b),
          canonical: b.includes(url.replace('https://pulserevops.com', '')),
          og: /<meta\s+property="og:title"/i.test(b),
          jsonLd: /application\/ld\+json/i.test(b),
          h1: /<h1[^>]*>/i.test(b),
        })
      );
    });
  })
  .on('error', (e) => console.error(e.message));
