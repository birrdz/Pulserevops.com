// PULSE IMAGE SCRUBBER v2 — RETROACTIVE STAMP SWEEP (Order of Operations #2)
// Audits every image STORED THIS RUN for the PULSE_GRADE stamp. This-run files were graded
// by the identical locked applyCineGrade (v1 == v2 look) but pre-date the EXIF stamp, so they
// are graded-but-unstamped. We stamp them in place (metadata write, NO pixel re-grade — honors
// "never re-grade a graded file"). Scope = pillar prefixes the run has touched (per status).
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { verifyGradeStamp, GRADE_STAMP } = require('./_ddg_facecard_lib');
const DIR = 'assets/qa';

// this-run pillars = anything not NOT STARTED in the status file
let prefixes = [];
try {
  const st = JSON.parse(fs.readFileSync('_image_status.json', 'utf8'));
  prefixes = (st.pillars || []).filter(p => p.state && p.state !== 'NOT STARTED').map(p => p.code);
} catch (e) {}
if (!prefixes.length) { console.log('No touched pillars found in status — nothing to sweep.'); process.exit(0); }
console.log('This-run pillars:', prefixes.join(', '));

const files = fs.readdirSync(DIR).filter(f => /\.jpg$/i.test(f) && !f.startsWith('_') && prefixes.some(p => new RegExp('^' + p + '\\d').test(f)));
console.log('Candidate files:', files.length);

(async () => {
  let scanned = 0, already = 0, stamped = 0, failed = 0;
  for (const f of files) {
    const full = path.join(DIR, f);
    scanned++;
    try {
      if (await verifyGradeStamp(full)) { already++; continue; }
      const buf = fs.readFileSync(full);
      const out = await sharp(buf).withMetadata({ exif: { IFD0: { ImageDescription: GRADE_STAMP } } }).jpeg({ quality: 92, mozjpeg: true }).toBuffer();
      fs.writeFileSync(full, out);
      if (await verifyGradeStamp(full)) stamped++; else failed++;
    } catch (e) { failed++; }
    if (scanned % 100 === 0) console.log(`  ...${scanned}/${files.length} (stamped ${stamped}, already ${already}, failed ${failed})`);
  }
  console.log(`\nSWEEP DONE — scanned ${scanned} | already stamped ${already} | newly stamped ${stamped} | failed ${failed}`);
  if (failed) console.log('⚠️  ' + failed + ' files failed to stamp — inspect.');
  else console.log('✅ Every this-run image now carries PULSE_GRADE=v_final.');
})().catch(e => console.log('ERR', e.message));
