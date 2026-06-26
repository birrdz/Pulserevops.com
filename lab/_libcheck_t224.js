const https = require('https');
const ids = ['q429','q431','q432','q424','q418','q161'];
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    let j;
    try { j = JSON.parse(b); } catch (e) { console.log('PARSE ERR', b.slice(0,300)); return; }
    const arr = j.entries || j.items || j.library || (Array.isArray(j) ? j : []);
    console.log('total entries:', arr.length);
    const byId = {};
    arr.forEach(e => { if (e && e.id) byId[e.id] = e; });
    ids.forEach(id => {
      const e = byId[id];
      if (e) console.log('OK  ' + id + ' :: ' + (e.question || e.q || '(no question field)'));
      else console.log('MISSING ' + id);
    });
  });
}).on('error', e => console.error('ERR ' + e.message));
