const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'pulse-ev-seo-check/1.0' } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (e) => resolve({ status: 0, body: String(e.message) }));
  });
}

(async () => {
  const entry = await get('https://pulserevops.com/events/ev0001');
  const hub = await get('https://pulserevops.com/events');
  const sm = await get('https://pulserevops.com/.netlify/functions/pulse-machine-sitemap?pillar=ev');
  const pick = (html, re) => {
    const m = String(html).match(re);
    return m ? m[1] : null;
  };
  const report = {
    entry: {
      url: 'https://pulserevops.com/events/ev0001',
      status: entry.status,
      title: pick(entry.body, /<title>([^<]+)<\/title>/i),
      canonical: pick(entry.body, /rel="canonical" href="([^"]+)"/i),
      metaDesc: pick(entry.body, /<meta name="description" content="([^"]*)"/i),
      keywords: (pick(entry.body, /<meta name="keywords" content="([^"]*)"/i) || '').slice(0, 120),
      hasLd: /application\/ld\+json/.test(entry.body),
      hasPulseEvents: /Pulse Events|pulse-events|music festivals/i.test(entry.body),
    },
    hub: {
      url: 'https://pulserevops.com/events',
      status: hub.status,
      keywords: (pick(hub.body, /<meta name="keywords" content="([^"]*)"/i) || '').slice(0, 120),
      ldBlocks: (hub.body.match(/application\/ld\+json/g) || []).length,
      hasEventSchema: /"@type": "Event"/.test(hub.body),
    },
    sitemap: {
      status: sm.status,
      hasEv0001: sm.body.includes('/events/ev0001'),
      evCount: (sm.body.match(/\/events\/ev\d+/g) || []).length,
    },
  };
  console.log(JSON.stringify(report, null, 2));
})();
