// Quick SEO spot-check for review-mirror test IDs.
const https = require('https');

const IDS = (process.argv[2] || 'q10990rv,q10991rv,q10992rv').split(',').map((s) => s.trim());

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'mirror-reviews-verify/1.0' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', (e) => resolve({ status: 0, body: e.message }));
  });
}

(async () => {
  for (const id of IDS) {
    const url = `https://pulserevops.com/knowledge/${id}`;
    const r = await get(url);
    const html = r.body || '';
    const canon = (html.match(/rel="canonical"\s+href="([^"]+)"/i) || [])[1];
    const robots = (html.match(/name="robots"\s+content="([^"]+)"/i) || [])[1];
    const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1];
    const h1 = (html.match(/<h1[^>]*>([^<]{0,140})/i) || [])[1];
    const hasMirrorNav = /reviews-mirror-nav|Reviews companion/i.test(html);
    const sourceId = id.replace(/rv$/i, '');
    const sourceCanon = `https://pulserevops.com/knowledge/${sourceId}`;
    console.log(
      JSON.stringify(
        {
          id,
          status: r.status,
          title: title && title.slice(0, 100),
          h1: h1 && h1.trim().slice(0, 80),
          canonical: canon,
          canonicalPointsToSource: canon === sourceCanon,
          robots,
          noindex: /noindex/i.test(robots || ''),
          hasMirrorNav,
        },
        null,
        2
      )
    );
  }
})();
