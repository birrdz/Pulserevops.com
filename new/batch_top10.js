// one-shot: generate the 2 top-10 women's-leadership-network essays (2028, 2029), one at a time.
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const QS = [
  'Top 10 Women\'s Leadership Networks for 2028',
  'Top 10 Women\'s Leadership Networks for 2029',
];
const STATUS = WD + '/new/batch_top10_status.json';
(async () => {
  const results = [];
  for (let i = 0; i < QS.length; i++) {
    fs.writeFileSync(STATUS, JSON.stringify({ running: QS[i], index: i + 1, total: QS.length, done: results.length }, null, 1));
    console.log('[' + (i + 1) + '/' + QS.length + ']', QS[i]);
    const r = spawnSync(process.execPath, [WD + '/new/generate.js', QS[i]], { cwd: WD, encoding: 'utf8', timeout: 600000 });
    const out = (r.stdout || '') + (r.stderr || '');
    const m = out.match(/saved new\/entries\/(new\w+)\.json/);
    const pass = /3\/3 — TEXT DONE/.test(out);
    console.log('  →', pass ? '3/3 ✓' : 'not 3/3', m ? m[1] : '(no id)');
    results.push({ q: QS[i], id: m ? m[1] : null, status: pass ? '3/3' : 'text-fail' });
  }
  fs.writeFileSync(STATUS, JSON.stringify({ done: true, results }, null, 1));
  console.log('=== TOP10 BATCH DONE ===');
})();
