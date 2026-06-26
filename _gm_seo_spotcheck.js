const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'pulse-seo-check' } }, (r) => {
        let body = '';
        r.on('data', (c) => (body += c));
        r.on('end', () => resolve({ status: r.statusCode, body }));
      })
      .on('error', reject);
  });
}

(async () => {
  for (const url of ['https://pulserevops.com/gaming/gm0001', 'https://pulserevops.com/gaming']) {
    const r = await get(url);
    const title = (r.body.match(/<title>([^<]+)/i) || [])[1];
    const desc = (r.body.match(/name="description" content="([^"]+)/i) || [])[1];
    const canon = (r.body.match(/rel="canonical" href="([^"]+)/i) || [])[1];
    const kw = (r.body.match(/name="keywords" content="([^"]+)/i) || [])[1];
    const ld = (r.body.match(/application\/ld\+json/gi) || []).length;
    const hasGamingKw = /Future of gaming trends|cloud gaming|Pulse Gaming/i.test(r.body);
    console.log(JSON.stringify({ url, status: r.status, title, canon, desc: desc?.slice(0, 100), kwLen: kw?.length || 0, jsonLd: ld, hasGamingKw }, null, 2));
  }
})();
