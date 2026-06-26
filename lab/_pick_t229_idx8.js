const https = require('https');
https.get('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(b);
      const arr = j.entries || j.items || j.questions || (Array.isArray(j) ? j : []);
      console.log('count=' + arr.length);
      const skip = new Set(['q445','q433','q418','q446','q448','q447','q449','q450','q451','q452','q459','q460','q461','q462','q463','q464','q465','q466','q467','q474','q476','q479','q671','q672','q1145','q1147','q1892','q2003','q2135','q2137','q2141']);
      const elig = arr.filter(e => {
        const id = e.id || e.qid || '';
        if (!/^q\d+$/.test(id)) return false;
        const n = parseInt(id.slice(1), 10);
        if (n >= 9501) return false;
        if (n >= 1946 && n <= 1954) return false;
        if (skip.has(id)) return false;
        const qs = e.quality_score;
        if (typeof qs !== 'number' || qs < 10) return false;
        if (e.format_v === '2026-05') return false;
        const tags = e.tags || [];
        if (Array.isArray(tags) && tags.indexOf('sales-training') !== -1) return false;
        return true;
      });
      elig.sort((a, b) => {
        const ta = a.ts || a.created_ts || a.last_modified_ms || 0;
        const tb = b.ts || b.created_ts || b.last_modified_ms || 0;
        return tb - ta;
      });
      console.log('eligible=' + elig.length);
      for (let i = 0; i < Math.min(12, elig.length); i++) {
        const e = elig[i];
        console.log('idx=' + i + ' :: ' + (e.id||e.qid) + ' :: ts=' + (e.ts||e.created_ts||e.last_modified_ms) + ' :: qs=' + e.quality_score + ' :: fv=' + e.format_v + ' :: ' + (e.question||e.q||'').slice(0,100));
      }
      const t = elig[8];
      if (t) {
        console.log('TARGET=' + (t.id || t.qid));
        console.log('TARGET_Q=' + (t.question || t.q || ''));
        console.log('TARGET_TAGS=' + JSON.stringify(t.tags || []));
      } else {
        console.log('NO TARGET AT INDEX 8 - eligible only ' + elig.length);
      }
    } catch (err) {
      console.log('PARSE ERR ' + err.message);
      console.log(b.slice(0, 600));
    }
  });
}).on('error', e => console.error('ERR ' + e.message));
