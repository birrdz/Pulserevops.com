const https = require('https');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(b);
      const arr = j.entries || j.items || j.questions || (Array.isArray(j) ? j : []);
      console.log('count=' + arr.length);
      const kw = /language|local|transl|apac|emea|global|international|multi|region|expansion|support|onboard|cross-border|currency|compliance|gdpr|i18n|hiring|headcount|fractional|outsourc|offshore/i;
      arr.forEach(e => {
        const q = e.question || e.q || '';
        if (kw.test(q)) console.log((e.id || e.qid) + ' :: ' + q);
      });
    } catch (err) {
      console.log('PARSE ERR ' + err.message);
      console.log(b.slice(0, 600));
    }
  });
}).on('error', e => console.error('ERR ' + e.message));
