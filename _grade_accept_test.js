// PULSE IMAGE SCRUBBER v2 — GRADE ACCEPTANCE TEST (Order of Operations #1)
// Processes 6 images end-to-end through the ONE choke point (storeGradedImage) and
// programmatically PROVES: (1) every output carries the PULSE_GRADE stamp, (2) every
// output differs from its raw (sha256 inequality), (3) measurable saturation/contrast
// delta. Sampler includes 3+ painterly/artistic renditions. Writes _grade_accept.html.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const crypto = require('crypto');
const { storeGradedImage, verifyGradeStamp } = require('./_ddg_facecard_lib');
const { ddgImages } = require('./netlify/functions/lib/img-search-lib');

const OUT = 'assets/qa/_prev';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
async function metrics(buf) {
  const st = await sharp(buf).stats();
  const c = st.channels;
  const contrast = (c[0].stdev + c[1].stdev + c[2].stdev) / 3;                 // spread = contrast proxy
  const sat = Math.max(c[0].mean, c[1].mean, c[2].mean) - Math.min(c[0].mean, c[1].mean, c[2].mean); // channel spread = warmth/sat proxy
  return { contrast: +contrast.toFixed(2), sat: +sat.toFixed(2) };
}
async function grab(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(25000) }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 5000 ? b : null; } catch (e) { return null; } }

// 3 painterly/artistic + 3 atmospheric-photo queries (art-first per spec)
const QUERIES = [
  ['painterly', 'artistic fishing images painting'],
  ['painterly', 'vintage naturalist betta fish illustration'],
  ['painterly', 'watercolor aquarium painting fine art'],
  ['photo', 'cinematic boat ocean moody atmospheric'],
  ['photo', 'golden hour espresso macro dark'],
  ['photo', 'silhouette portrait dramatic lighting fine art'],
];

(async () => {
  const rows = [];
  for (let i = 0; i < QUERIES.length; i++) {
    const [kind, q] = QUERIES[i];
    let raw = null, srcUrl = '';
    try {
      const arr = await ddgImages(q);
      for (const cand of (arr || []).slice(0, 8)) { raw = await grab(cand.image); if (raw) { srcUrl = cand.image; break; } }
    } catch (e) {}
    if (!raw) { rows.push({ i: i + 1, kind, q, ok: false, why: 'no fetchable candidate' }); console.log(`  ${i + 1}. [${kind}] FETCH FAIL — ${q}`); continue; }
    const dest = path.join(OUT, `accept-${i + 1}.jpg`);
    const rawHash = sha(raw), rawM = await metrics(raw);
    const g = await storeGradedImage(raw, dest, { width: 900, bright: false });
    const gradedBuf = fs.readFileSync(dest);
    const gradedHash = sha(gradedBuf), gradedM = await metrics(gradedBuf);
    const stamped = await verifyGradeStamp(dest);
    const differs = rawHash !== gradedHash;
    const dContrast = +(gradedM.contrast - rawM.contrast).toFixed(2);
    const dSat = +(gradedM.sat - rawM.sat).toFixed(2);
    const measurable = Math.abs(dContrast) > 0.2 || Math.abs(dSat) > 0.2;
    const ok = stamped && differs && measurable;
    rows.push({ i: i + 1, kind, q, ok, stamped, differs, dContrast, dSat, srcUrl, dest: '/' + dest.replace(/\\/g, '/') });
    console.log(`  ${i + 1}. [${kind}] ${ok ? 'PASS' : 'FAIL'}  stamp=${stamped} differs=${differs} Δcontrast=${dContrast} Δsat=${dSat}`);
  }
  const passed = rows.filter(r => r.ok).length;
  const artistic = rows.filter(r => r.kind === 'painterly' && r.ok).length;
  // sampler html
  let html = '<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><title>Grade Acceptance Test</title><style>body{background:#1A0710;font-family:system-ui;margin:0;padding:16px;color:#FFB81C}h1{font-family:Georgia,serif;font-style:italic}.row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start;margin:14px 0;border-top:1px solid #FFB81C33;padding-top:12px}.col{width:300px}.col img{width:300px;border-radius:8px}.lab{font-size:11px;opacity:.7;text-transform:uppercase;letter-spacing:.1em}.pass{color:#4ade80;font-weight:800}.fail{color:#f87171;font-weight:800}.meta{font-size:12px;opacity:.85}@media(max-width:680px){.col{width:100%}.col img{width:100%}}</style><body>';
  html += `<h1>Grade Acceptance Test — ${passed}/6 PASS · ${artistic} painterly passing</h1>`;
  html += '<p class=meta>Each output went through the single choke point <b>storeGradedImage</b>: graded from RAW + EXIF-stamped PULSE_GRADE=v_final. "After" is the finished product you would see on the site.</p>';
  for (const r of rows) {
    html += '<div class=row>';
    if (r.srcUrl) html += `<div class=col><div class=lab>Before (raw source)</div><img loading=lazy src="${r.srcUrl}"></div>`;
    if (r.dest) html += `<div class=col><div class=lab>After (graded + stamped)</div><img loading=lazy src="${r.dest}"></div>`;
    html += `<div class=col><div class="${r.ok ? 'pass' : 'fail'}">${r.i}. ${r.ok ? 'PASS' : 'FAIL'} — ${r.kind}</div><div class=meta>${r.q}<br>stamp: ${r.stamped}<br>differs from raw: ${r.differs}<br>Δcontrast: ${r.dContrast}<br>Δsat: ${r.dSat}${r.why ? '<br>' + r.why : ''}</div></div>`;
    html += '</div>';
  }
  fs.writeFileSync('_grade_accept.html', html + '</body>');
  console.log(`\nRESULT: ${passed}/6 passed, ${artistic} painterly passing.`);
  console.log('Sampler: http://localhost:8891/_grade_accept.html');
  if (passed < 6) console.log('⚠️  Not all 6 passed — pipeline needs a fix before proceeding.');
  else console.log('✅ ALL 6 stamped + differ from raw + measurable grade delta.');
})().catch(e => console.log('ERR', e.message));
