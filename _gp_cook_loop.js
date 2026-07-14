// _gp_cook_loop.js — SELECTION-ROOM refiner (owner spec 2026-07-09 step 11).
// While images sit in the gallery waiting for approval, keep making them better: re-grade each
// FROM ITS RAW source (assets/qa/_gp_pool/raw/NNN.jpg) with sharpness+brightness ramping toward a
// ceiling. Always from RAW → no cumulative artifacts. Bumps `cookPass` in the manifest so the gallery
// cache-busts and shows the improved version live. Runs continuously; converges when all hit the ceiling.
const fs = require('fs');
const { grade, paramsFor } = require('./_gp_grade.js');
const WD = 'C:/Users/koryj/website';
const POOL = WD + '/assets/qa/_gp_pool';
const RAW = POOL + '/raw';
const MAN = WD + '/_gp_pool_manifest.json';
const CEILING = 8;                       // pass at which brightness/sharpness reach their cap
const PER_IMAGE_MS = 400;                // gentle, one image at a time
const SWEEP_GAP_MS = 15000;              // pause between full sweeps
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

(async () => {
  console.log('[gp-cook] selection-room refiner started (ceiling pass=' + CEILING + ', from RAW every pass)');
  for (;;) {
    const man = loadJSON(MAN, { slots: [] });
    const slots = (man.slots || []).filter(s => s.ok);
    let improved = 0, atCeiling = 0;
    for (const s of slots) {
      const cur = s.cookPass || 0;
      if (cur >= CEILING) { atCeiling++; continue; }
      const rawP = RAW + '/' + String(s.slot).padStart(3, '0') + '.jpg';
      const outP = POOL + '/' + String(s.slot).padStart(3, '0') + '.jpg';
      if (!fs.existsSync(rawP)) continue;
      try {
        const next = cur + 1;
        await grade(fs.readFileSync(rawP), outP, { pass: next });   // re-polish FROM RAW at the higher pass
        // re-read manifest fresh before writing (generator may be appending new slots concurrently)
        const m2 = loadJSON(MAN, { slots: [] });
        const t = (m2.slots || []).find(x => x.slot === s.slot);
        if (t) { t.cookPass = next; fs.writeFileSync(MAN, JSON.stringify(m2, null, 1)); }
        improved++;
      } catch (e) {}
      await sleep(PER_IMAGE_MS);
    }
    const cap = paramsFor(CEILING);
    fs.writeFileSync(WD + '/_gp_cook_progress.txt', 'improved ' + improved + ' this sweep · ' + atCeiling + '/' + slots.length + ' at ceiling (bright ' + cap.brightness.toFixed(2) + ', sharp ' + cap.sigma.toFixed(2) + ')');
    if (slots.length && atCeiling === slots.length) { console.log('[gp-cook] all ' + slots.length + ' at ceiling — idling'); }
    await sleep(SWEEP_GAP_MS);
  }
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
