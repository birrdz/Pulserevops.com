// _mv_poster_cleanup.js — remove non-poster (landscape/odd-aspect) files the first download run saved, so the
// improved infobox-first re-run can replace them. Deletes from BOTH the pipeline library and the Downloads copy,
// and drops their manifest.ok entries so the re-run re-attempts them.
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const LIB = 'C:/Users/koryj/website/assets/qa/_poster-lib';
const DOWNLOADS = 'C:/Users/koryj/Downloads/movie-posters';
const MANIFEST = 'C:/Users/koryj/website/_mv_poster_manifest.json';

(async () => {
  const files = fs.readdirSync(LIB).filter((f) => f.endsWith('.jpg'));
  let removed = 0, kept = 0;
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { ok: {}, fail: {} };
  for (const f of files) {
    let ar = null;
    try { const m = await sharp(path.join(LIB, f)).metadata(); ar = m.width / m.height; } catch (e) {}
    if (ar == null || ar > 0.85 || ar < 0.5) {
      for (const d of [LIB, DOWNLOADS]) { try { fs.unlinkSync(path.join(d, f)); } catch (e) {} }
      const key = f.replace(/\.jpg$/, '');
      delete manifest.ok[key];
      removed++;
      console.log('  removed non-poster ' + f + (ar ? ' (ar' + ar.toFixed(2) + ')' : ' (unreadable)'));
    } else kept++;
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log('\nCleanup: removed ' + removed + ' non-poster · kept ' + kept + ' portrait posters');
})().catch((e) => { console.error('FATAL', e); process.exitCode = 1; });
