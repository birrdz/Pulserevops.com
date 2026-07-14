'use strict';
/** Make one sample face card the way the fixer does — for owner visual check. */
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const flib = require('./_ddg_facecard_lib');

const id = process.argv[2] || 'sk0095';
const title = process.argv.slice(3).join(' ') || 'Skill Drill: Delegation for Construction';
const out = WD + '/assets/qa/_sample_fixer_facecard.jpg';
const cp = flib.coverPath(id);

function walkJpg(root, outArr) {
  if (!fs.existsSync(root)) return;
  for (const n of fs.readdirSync(root)) {
    const p = root + '/' + n;
    try {
      const st = fs.statSync(p);
      if (st.isDirectory()) walkJpg(p, outArr);
      else if (/\.jpe?g$/i.test(n) && st.size > 20000) outArr.push(p);
    } catch (e) {}
  }
}

(async () => {
  const donors = [];
  walkJpg(WD + '/assets/qa/_pexels_stored', donors);
  if (!donors.length) walkJpg(WD + '/assets/qa/_gp_pool', donors);
  if (!donors.length && fs.existsSync(cp)) donors.push(cp);
  if (!donors.length) throw new Error('no donor image');
  const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const buf = fs.readFileSync(donors[seed % donors.length]);
  await flib.gradeFaceCardFromBuffer(buf, out, { question: title, goldTitle: title });
  console.log(JSON.stringify({ ok: true, sample: out, title, bytes: fs.statSync(out).size }));
})().catch(e => { console.error(e); process.exit(1); });
