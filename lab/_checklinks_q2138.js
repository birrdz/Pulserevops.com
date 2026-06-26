const https = require('https');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const j = JSON.parse(b);
    const arr = j.entries || j.items || j.questions || [];
    const ids = new Set(arr.map(x => x.id || x.qid));
    const links = ['q9620','q9621','q9613','q9619','q9622','q9614','q9616','q9617','q9615'];
    links.forEach(l => console.log(l + ' :: ' + (ids.has(l) ? 'EXISTS' : 'MISSING')));
  });
}).on('error', e => console.error('ERR ' + e.message));
