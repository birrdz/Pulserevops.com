const https = require('https');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const j = JSON.parse(b);
    const arr = j.entries || j.items || j.questions || (Array.isArray(j) ? j : []);
    const ids = new Set(arr.map(e => e.id || e.qid));
    const check = ['q9665','q9662','q9659','q9663','q2151','q2153','q2138','q2140','q2150',
                   'q2135','q2136','q2139','q2141','q2145','q2146','q2003','q2142','q2143','q2144','q2148','q2149'];
    check.forEach(c => console.log(c + ' :: ' + (ids.has(c) ? 'EXISTS' : 'MISSING')));
  });
}).on('error', e => console.error('ERR ' + e.message));
