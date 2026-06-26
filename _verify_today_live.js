const https = require('https');
const urls = [
  'https://pulserevops.com/tools',
  'https://pulserevops.com/fractional-cro',
  'https://pulserevops.com/kory-white-maryland',
  'https://pulserevops.com/resume',
];
function get(url) {
  return new Promise((r) => {
    https.get(url, { headers: { 'User-Agent': 'verify/1' } }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => r({ url, status: res.statusCode, body: b }));
    }).on('error', (e) => r({ url, status: 0, err: e.message }));
  });
}
(async () => {
  for (const url of urls) {
    const p = await get(url);
    const b = p.body || '';
    console.log(
      url,
      'HTTP', p.status,
      'kw', /name="keywords"/.test(b),
      'ld', /ld\+json/.test(b),
      'canon', /rel="canonical"/.test(b),
      'cred', b.includes('credential-strip') || b.includes('$200M Builder')
    );
  }
})();
