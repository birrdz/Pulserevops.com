const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?id=q2149', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTTP ' + res.statusCode);
    fs.writeFileSync('C:/Users/koryj/website/lab/_entry_q2149.json', b);
    const j = JSON.parse(b);
    console.log('id=' + j.id, 'qs=' + j.quality_score, 'fv=' + j.format_v, 'tags=' + JSON.stringify(j.tags));
    console.log('question: ' + j.question);
    console.log('answer.len=' + (j.answer || '').length);
  });
}).on('error', e => console.error('ERR ' + e.message));
