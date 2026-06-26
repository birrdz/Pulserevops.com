const https = require('https');
const targets = ['q1168','q127','q240','q262','q263','q373','q393','q395','q449','q459','q460','q461','q462','q464','q465','q467','q478','q488','q9638'];
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const j = JSON.parse(b);
    const entries = j.entries || j.items || j;
    const ids = new Set(entries.map(e => e && e.id));
    const missing = targets.filter(t => !ids.has(t));
    console.log('checked', targets.length, 'links');
    console.log('MISSING:', missing.length ? missing.join(', ') : 'none — all exist');
  });
}).on('error', e => console.error('ERR', e.message));
