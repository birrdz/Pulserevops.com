const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-answer?id=q1860', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTTP ' + res.statusCode);
    try {
      const j = JSON.parse(b);
      fs.writeFileSync('C:/Users/koryj/website/lab/_entry_q1860.json', JSON.stringify(j, null, 2));
      const e = j.entry || j;
      console.log('id=' + e.id, 'qs=' + e.quality_score, 'fv=' + e.format_v, 'tags=' + JSON.stringify(e.tags));
      console.log('question=' + e.question);
      console.log('answer.len=' + (e.answer || '').length);
      console.log('--- ANSWER ---');
      console.log((e.answer || '').slice(0, 4000));
    } catch (err) { console.log('parse err', err.message); console.log(b.slice(0,2000)); }
  });
}).on('error', e => console.error('ERR ' + e.message));
