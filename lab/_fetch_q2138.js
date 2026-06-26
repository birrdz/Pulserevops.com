const https = require('https');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const j = JSON.parse(b);
    const arr = j.entries || j.items || j.questions || [];
    const e = arr.find(x => (x.id||x.qid) === 'q2138');
    console.log(JSON.stringify({ id: e.id, q: e.question||e.q, qs: e.quality_score, format_v: e.format_v, tags: e.tags, ts: e.ts }, null, 2));
    // sibling candidates for cross-links
    const sibs = arr.filter(x => /start a .* business in 2027/i.test(x.question||x.q||'')).map(x => (x.id||x.qid)+' :: '+(x.question||x.q));
    console.log('--- siblings (start-a-business) ---');
    sibs.slice(0,60).forEach(s => console.log(s));
  });
}).on('error', e => console.error('ERR ' + e.message));
