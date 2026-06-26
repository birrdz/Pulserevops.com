const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    fs.writeFileSync('C:/Users/koryj/website/lab/_gold_q446_library.json', b);
    try {
      const j = JSON.parse(b);
      const arr = j.entries || j.items || j.library || (Array.isArray(j) ? j : []);
      console.log('count=' + arr.length);
      // print fx/finance/revenue relevant
      const kw = /fx|currenc|hedg|forex|exchange|treasur|cac|payback|ltv|margin|arr|revenue|magic number|forecast|burn|runway|board|metric|saas|pricing|interna/i;
      const hits = arr.filter(e => e && e.id && /^q\d+$/.test(e.id) && kw.test((e.question||'') + ' ' + (e.title||'')));
      console.log('relevant=' + hits.length);
      hits.slice(0, 80).forEach(e => console.log(e.id + ' :: ' + (e.question || e.title || '')));
    } catch (e) { console.log('parse err ' + e.message + ' len=' + b.length); }
  });
}).on('error', e => console.error('ERR ' + e.message));
