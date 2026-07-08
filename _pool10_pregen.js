// _pool10_pregen.js — pre-build image pools AHEAD of owner approval, one topic at a time (owner 2026-07-07).
// DDG real-photos only (POOL10_DDG_ONLY=1) → no melted faces, single DDG in flight (never 2 at once).
// Walks ORDER from PREGEN_START forward; skips topics already applied (_pool10_applied_<t>.flag) or pool already full.
// Stop: _pool10_pregen_stop.flag
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
const POOL = WD + '/assets/pool10';
const STOPF = WD + '/_pool10_pregen_stop.flag';
const ORDER = ['mv', 'hf', 'gm', 'ga', 'sw', 'ev', 'sk', 'wl', 'lv', 'tn', 'co', 'cl', 'nl', 'rs', 'tc', 'sp', 'tv', 'bo', 'bs', 'es', 'dn', 'bt', 'gp', 'ai', 'sc', 'tk', 'gb', 'ra', 'pt', 'ik', 'er', 'cg', 'st', 'aq', 'ed', 'fr', 'ca', 'sy', 'q', 'tl'];
const N = parseInt(process.env.PREGEN_N || '15');
const START = process.env.PREGEN_START || (fs.existsSync(WD + '/_pool10_topic.txt') ? fs.readFileSync(WD + '/_pool10_topic.txt', 'utf8').trim() : 'ga');
const poolCount = t => { try { return fs.readdirSync(POOL + '/' + t).filter(f => /\.jpg$/i.test(f)).length; } catch (e) { return 0; } };
const applied = t => fs.existsSync(WD + '/_pool10_applied_' + t + '.flag');
const ts = () => new Date().toISOString().slice(11, 19);
const startIdx = Math.max(0, ORDER.indexOf(START));
console.log(ts() + ' PREGEN start=' + START + ' (idx ' + startIdx + ') N=' + N + ' DDG-only');
for (let i = startIdx; i < ORDER.length; i++) {
  if (fs.existsSync(STOPF)) { console.log(ts() + ' STOP flag — halting'); break; }
  const t = ORDER[i];
  if (applied(t)) { console.log(ts() + ' skip ' + t + ' (already applied)'); continue; }
  if (poolCount(t) >= N) { console.log(ts() + ' skip ' + t + ' (pool full=' + poolCount(t) + ')'); continue; }
  console.log(ts() + ' ▶ build ' + t + ' — ' + N + ' DDG images');
  const r = spawnSync('node', ['_pool10_new.js'], {
    cwd: WD,
    env: Object.assign({}, process.env, { MODE: 'gen', ONLY_TOPIC: t, N_IMAGES: String(N), POOL10_COOL_MS: '0', POOL10_STAGGER_MS: (process.env.POOL10_STAGGER_MS || '20000'), POOL10_BLUR_MIN: (process.env.POOL10_BLUR_MIN || '210'), NO_EMAIL: '1' }),
    stdio: 'ignore'
  });
  console.log(ts() + ' ◀ ' + t + ' done → ' + poolCount(t) + ' images (exit ' + (r.status) + ')');
}
console.log(ts() + ' PREGEN finished');
