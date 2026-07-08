// _pool10_auto.js — full SERIAL auto-pipeline (owner 2026-07-07). For each remaining topic in ORDER from AUTO_START:
//   gen strict (alternating flux+DDG, 20s stagger, hard blur-refuse, sharpened) → pick BEST 10 (sharpest by
//   Laplacian variance) → apply across ALL of that topic's Q&As → flag applied → advance → next topic.
// ONE engine at a time → respects the ≤1-flux + ≤1-DDG rule, no collisions. Skips already-applied topics.
// Stop cleanly: create _pool10_auto_stop.flag
'use strict';
process.on('unhandledRejection', e => console.log('UNHANDLED_REJECTION', e && e.message));
process.on('uncaughtException', e => console.log('UNCAUGHT', e && e.message));
const fs = require('fs');
const { spawnSync } = require('child_process');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const POOL = WD + '/assets/pool10';
const STOPF = WD + '/_pool10_auto_stop.flag';
const ORDER = ['mv', 'hf', 'gm', 'ga', 'sw', 'ev', 'sk', 'wl', 'lv', 'tn', 'co', 'cl', 'nl', 'rs', 'tc', 'sp', 'tv', 'bo', 'bs', 'es', 'dn', 'bt', 'gp', 'ai', 'sc', 'tk', 'gb', 'ra', 'pt', 'ik', 'er', 'cg', 'st', 'aq', 'ed', 'fr', 'ca', 'sy', 'q', 'tl'];
const N = parseInt(process.env.AUTO_N || '18', 10);
const START = process.env.AUTO_START || 'sk';
const applied = t => fs.existsSync(WD + '/_pool10_applied_' + t + '.flag');
const poolFiles = t => { try { return fs.readdirSync(POOL + '/' + t).filter(f => /\.jpg$/i.test(f)).sort(); } catch (e) { return []; } };
const ts = () => new Date().toISOString().slice(11, 19);
function run(env) { return spawnSync('node', ['_pool10_new.js'], { cwd: WD, env: Object.assign({}, process.env, env), stdio: 'ignore' }); }
// sharpness = variance of the Laplacian on a 320px greyscale copy (higher = crisper)
async function lapvar(fp) {
  const g = await sharp(fp).greyscale().resize(320, 320, { fit: 'inside' }).convolve({ width: 3, height: 3, kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0] }).raw().toBuffer();
  let sum = 0, sum2 = 0, n = g.length; for (let i = 0; i < n; i++) { const v = g[i]; sum += v; sum2 += v * v; }
  const m = sum / n; return sum2 / n - m * m;
}
async function bestTen(dir, files) {
  const scored = [];
  for (const f of files) { try { scored.push({ f, v: await lapvar(dir + '/' + f) }); } catch (e) { scored.push({ f, v: 0 }); } }
  scored.sort((a, b) => b.v - a.v);
  return scored.slice(0, 10).map(x => x.f).sort();   // top-10 sharpest, back in filename order
}
const startIdx = Math.max(0, ORDER.indexOf(START));
console.log(ts() + ' AUTO start=' + START + ' (idx ' + startIdx + ') N=' + N + ' — pick BEST 10 by sharpness');
(async () => {
  for (let i = startIdx; i < ORDER.length; i++) {
    if (fs.existsSync(STOPF)) { console.log(ts() + ' STOP flag — halting'); break; }
    const t = ORDER[i];
    if (applied(t)) { console.log(ts() + ' skip ' + t + ' (already applied)'); continue; }
    try { fs.writeFileSync(WD + '/_pool10_topic.txt', t); } catch (e) {}
    console.log(ts() + ' ▶ GEN ' + t + ' (N=' + N + ', strict blur-refuse + sharpen)');
    run({ MODE: 'gen', ONLY_TOPIC: t, N_IMAGES: String(N), POOL10_COOL_MS: '0', POOL10_STAGGER_MS: (process.env.POOL10_STAGGER_MS || '20000'), POOL10_BLUR_MIN: (process.env.POOL10_BLUR_MIN || '210'), NO_EMAIL: '1' });
    const dir = POOL + '/' + t;
    const files = poolFiles(t);
    if (files.length < 1) { console.log(ts() + ' ✗ ' + t + ' produced no sharp images — skipping'); continue; }
    const keep = files.length > 10 ? await bestTen(dir, files) : files.slice(0, 10);
    for (const f of files) { if (!keep.includes(f)) { try { fs.unlinkSync(dir + '/' + f); } catch (e) {} } }
    console.log(ts() + ' kept BEST ' + keep.length + ' for ' + t + ': ' + keep.join(','));
    console.log(ts() + ' ▶ APPLY ' + t + ' across all Q&As');
    run({ MODE: 'apply', ONLY_TOPIC: t, NO_EMAIL: '1' });
    try { fs.writeFileSync(WD + '/_pool10_applied_' + t + '.flag', 'x'); } catch (e) {}
    // build a spot-check grid per topic so it can be published as a review link
    try { fs.mkdirSync(WD + '/_spotchecks', { recursive: true }); } catch (e) {}
    try { spawnSync('node', ['_pool10_grid.js', t, WD + '/_spotchecks/spotcheck_' + t + '.html'], { cwd: WD, stdio: 'ignore' }); } catch (e) {}
    console.log(ts() + ' ◀ ' + t + ' applied (' + keep.length + ' best images) + grid built');
    if (process.env.AUTO_ONCE === '1') { console.log(ts() + ' AUTO_ONCE — stop after ' + t); break; }
    if (process.env.AUTO_UNTIL && t === process.env.AUTO_UNTIL) { console.log(ts() + ' AUTO_UNTIL ' + t + ' — stop'); break; }
  }
  console.log(ts() + ' AUTO done');
})();
