const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?id=q1869', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTTP ' + res.statusCode);
    fs.writeFileSync('C:/Users/koryj/website/lab/_entry_q1869.json', b);
    try {
      const j = JSON.parse(b);
      console.log('id=' + j.id, 'qs=' + j.quality_score, 'fv=' + j.format_v, 'tags=' + JSON.stringify(j.tags));
      console.log('question=' + j.question);
      console.log('answer.len=' + (j.answer || '').length);
      console.log('--- answer head ---');
      console.log((j.answer || '').slice(0, 2500));
    } catch (e) { console.error('parse err', e.message); }
  });
}).on('error', e => console.error('ERR ' + e.message));
