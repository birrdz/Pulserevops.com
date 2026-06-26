const https = require('https');
const fs = require('fs');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTTP ' + res.statusCode);
    const j = JSON.parse(b);
    fs.writeFileSync('C:/Users/koryj/website/lab/_list_t229.json', JSON.stringify(j));
    console.log('total=' + j.total, 'returned=' + j.returned);
    const skip = new Set(['q445','q433','q418','q446','q448','q447','q449','q450','q451','q452','q459','q460','q461','q462','q463','q464','q465','q466','q467','q474','q476','q479','q671','q672','q1145','q1147','q1892','q2003','q2135','q2137','q2141']);
    const elig = j.entries.filter(e => {
      if (typeof e.quality_score !== 'number' || e.quality_score < 10) return false;
      if (e.format_v === '2026-05') return false;
      if (!/^q\d+$/.test(e.id)) return false;
      const n = parseInt(e.id.slice(1), 10);
      if (n >= 9501) return false;
      if (n >= 1946 && n <= 1954) return false;
      if (Array.isArray(e.tags) && e.tags.indexOf('sales-training') !== -1) return false;
      if (skip.has(e.id)) return false;
      return true;
    });
    elig.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    console.log('eligible=' + elig.length);
    elig.slice(0, 15).forEach((e, i) => console.log('  idx' + i + ' ' + e.id + ' ts=' + e.ts + ' qs=' + e.quality_score + ' fv=' + e.format_v + ' :: ' + e.question));
    const target = elig[10];
    console.log('TARGET idx10 = ' + (target ? target.id + ' :: ' + target.question : 'NONE'));
  });
}).on('error', e => console.error('ERR ' + e.message));
