// _sy_img_loop.js — ONE of 3 DDG per-outfit image lanes for the Style pillar.
// Each lane owns a disjoint 1/3 of sy ids (LANE=1|2|3, NLANES=3) and re-sweeps every
// ~2 min, filling real per-outfit photos as the writers publish. Stop: _sy_img_loop_stop.flag.
const { execSync } = require('child_process');
const fs = require('fs');
const STOP = 'C:/Users/koryj/website/_sy_img_loop_stop.flag';
const LANE = process.env.LANE || '1';
const NLANES = process.env.NLANES || '3';
(async () => {
  while (!fs.existsSync(STOP)) {
    try {
      execSync('node _sy_outfit_img.js all', { cwd: 'C:/Users/koryj/website', stdio: 'inherit', env: { ...process.env, LANE, NLANES } });
    } catch (e) { console.error('lane ' + LANE + ' sweep err', e.message); }
    await new Promise(r => setTimeout(r, 120000));
  }
  console.log('sy img loop lane ' + LANE + ' stopped');
})();
