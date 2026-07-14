'use strict';
// Serial next-N RA face+top fixes (still one id after another inside this process).
// Usage: node _manual_ra_face_fix_next.js [N=10]
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
const N = Math.max(1, Math.min(40, parseInt(process.argv[2] || '10', 10) || 10));
const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ra.json'), 'utf8'));
const st = JSON.parse(fs.readFileSync(path.join(WD, '_ra_topic_review_state.json'), 'utf8'));
const done = new Set(Object.keys(st.approved || {}));
const next = mos.map((e) => e.id).filter((id) => !done.has(id)).slice(0, N);
console.log('[ra-next] fixing', next.length, next.join(','));
let ok = 0, fail = 0;
for (const id of next) {
  const r = spawnSync(process.execPath, [path.join(WD, '_manual_ra_face_fix_one.js'), id], {
    cwd: WD,
    encoding: 'utf8',
    timeout: 120000,
  });
  const out = String(r.stdout || '').trim();
  const err = String(r.stderr || '').trim();
  if (r.status === 0) {
    ok++;
    console.log('OK', out.slice(0, 220));
  } else {
    fail++;
    console.log('FAIL', id, err.slice(0, 200) || out.slice(0, 200));
  }
}
console.log(JSON.stringify({ asked: next.length, ok, fail, ids: next }));
