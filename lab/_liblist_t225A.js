const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    fs.writeFileSync('_liblist_t225A.json', b);
    try {
      const j = JSON.parse(b);
      const arr = j.entries || j.items || j;
      console.log('HTTP ' + res.statusCode + ' count=' + (Array.isArray(arr) ? arr.length : 'n/a'));
    } catch (e) { console.log('HTTP ' + res.statusCode + ' parse-fail len=' + b.length); }
  });
}).on('error', e => console.error('ERR ' + e.message));
