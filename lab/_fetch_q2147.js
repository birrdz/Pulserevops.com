const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const j = JSON.parse(b);
    const arr = j.entries || j.items || j.questions || (Array.isArray(j) ? j : []);
    // candidate cross-link ids: business-start q-entries
    const wanted = ['q2138','q2139','q2140','q2141','q2142','q2143','q2144','q2145','q2146','q2148','q2149','q2150','q1145','q1147','q1892','q2003','q2135','q2136','q2137'];
    wanted.forEach(w => {
      const e = arr.find(x => (x.id||x.qid) === w);
      console.log(w + ' :: ' + (e ? 'EXISTS :: ' + (e.question||e.q||'').slice(0,80) : 'MISSING'));
    });
    fs.writeFileSync('_liblist_full_t229.json', JSON.stringify(arr.map(e => ({id:e.id||e.qid, q:e.question||e.q})), null, 0));
    console.log('---wrote index, count=' + arr.length);
  });
}).on('error', e => console.error('ERR ' + e.message));
