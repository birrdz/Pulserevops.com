// _recolor_all_covers.js — one-time batch re-grade of EVERY face-card cover in /assets/qa (owner 2026-07-10):
// LESS YELLOW + BRIGHTER + all colors (vibrance), not a warm/gold wash. Cools the warm cast (-red,+blue),
// bumps brightness + saturation across all hues, re-stamps EXIF PULSE_GRADE=v_final. Resume-safe (_recolor_done.json).
// Only top-level /assets/qa/*.jpg covers (NOT the _gp_pool subdir the generator is still writing). Deploy after.
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const QA = WD + '/assets/qa';
const DONE_F = WD + '/_recolor_done.json';
const PROG_F = WD + '/_recolor_progress.txt';
const CONC = parseInt(process.env.RECOLOR_CONC || '8', 10);
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

async function recolor(path) {
  const buf = await sharp(path, { animated: false })
    .modulate({ saturation: 1.18, brightness: 1.08 })          // pop ALL colors + brighter
    .linear(1.06, 4)                                            // gentle contrast, lifted shadows
    .recomb([[0.95, 0, 0], [0, 1.0, 0], [0, 0, 1.07]])         // cool the warm cast: -red +blue = LESS YELLOW
    .withMetadata({ exif: { IFD0: { ImageDescription: 'PULSE_GRADE=v_final' } } })
    .jpeg({ quality: 90 })
    .toBuffer();
  fs.writeFileSync(path, buf);
}

(async () => {
  const all = fs.readdirSync(QA).filter(f => /\.jpg$/i.test(f));
  const done = new Set(loadJSON(DONE_F, []));
  const queue = all.filter(f => !done.has(f));
  console.log('[recolor] ' + all.length + ' covers · ' + done.size + ' already done · ' + queue.length + ' to go · conc=' + CONC);
  let n = 0, fail = 0;
  const save = () => { try { fs.writeFileSync(DONE_F, JSON.stringify([...done])); fs.writeFileSync(PROG_F, n + '/' + queue.length + ' recolored · ' + fail + ' fail'); } catch (e) {} };
  async function worker() {
    while (queue.length) {
      const f = queue.shift();
      try { await recolor(QA + '/' + f); done.add(f); n++; }
      catch (e) { fail++; done.add(f); }   // mark done so a bad file doesn't block resume
      if (n % 200 === 0) { save(); console.log('[recolor] ' + n + '/' + queue.length + ' (' + fail + ' fail)'); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  save();
  console.log('[recolor] DONE · recolored=' + n + ' · fail=' + fail);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
