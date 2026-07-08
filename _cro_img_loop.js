// _cro_img_loop.js — DDG image backfill lane for the CRO (tl) pillar. Runs a topical
// COVER pass (real photo at the top of each answer) + a general image backfill over tl
// entries, re-sweeping every ~2 min so new CRO Q&As get real DuckDuckGo images as the
// writers publish. Stop: _cro_img_stop.flag. Mirrors the _sy_img_loop.js pattern.
const { execSync } = require('child_process');
const fs = require('fs');
const STOP = 'C:/Users/koryj/website/_cro_img_stop.flag';
const CWD = 'C:/Users/koryj/website';
(async () => {
  while (!fs.existsSync(STOP)) {
    try { execSync('node _cover_img_any.js tl ""', { cwd: CWD, stdio: 'inherit' }); } catch (e) { console.error('cover err', e.message); }
    try { execSync('node _img_backfill_any.js tl /tools', { cwd: CWD, stdio: 'inherit' }); } catch (e) { console.error('backfill err', e.message); }
    await new Promise(r => setTimeout(r, 120000));
  }
  console.log('cro img loop stopped');
})();
